import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sparkles, Line, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as X from './journeyTextures.js'
import './JourneyBook.css'

gsap.registerPlugin(ScrollTrigger)
const { CHAPTERS } = X

/* ------------------------------------------------------------------ math */
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x))
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t) }
const eio = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const lerp = (a, b, t) => a + (b - a) * t
const win = (p, a, b, c, d) => sstep(a, b, p) - sstep(c, d, p)

/* ------------------------------------------------------------ timeline
   0.00-0.08 closed · 0.08-0.30 cover opens · 0.32-0.88 page turns
   chapter k is centred on 0.40 + 0.10k · 0.925-0.95 last leaf · 0.955-0.995 closes */
const NS = 7                                   // leaves
const centre = k => 0.4 + 0.1 * k
const chapterWeight = (p, k) => {
  const c = centre(k)
  return win(p, c - 0.07, c - 0.025, k === 5 ? 0.915 : c + 0.025, k === 5 ? 0.955 : c + 0.07)
}
const openTheta = p => Math.PI * eio(clamp((p - 0.08) / 0.22)) * (1 - eio(clamp((p - 0.955) / 0.04)))
const turnOf = (p, i) => eio(clamp(i < 6 ? (p - (0.32 + 0.1 * i)) / 0.06 : (p - 0.925) / 0.03))

/* --------------------------------------------------------- book size */
const BW = 1.55, BH = 2.15, T = 0.11, B = 0.045, PWd = BW - 0.04, PHt = BH - 0.11, SEG = 14
const IS_MOBILE = () => typeof window !== 'undefined' && window.innerWidth < 760

/* ================================================================== 3D */
function Env() {
  const { gl, scene } = useThree()
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl)
    const env = pm.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = env; scene.environmentIntensity = 0.55
    return () => { scene.environment = null; env.dispose(); pm.dispose() }
  }, [gl, scene])
  return null
}

/* One leaf: a bendable double-sided page hinged on the spine */
function Leaf({ i, S, recto, verso }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry(), n = (SEG + 1) * 2
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3))
    g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(n * 3), 3))
    const uv = new Float32Array(n * 2), idx = []
    for (let j = 0; j <= SEG; j++) { uv.set([j / SEG, 1, j / SEG, 0], j * 4) }
    for (let j = 0; j < SEG; j++) { const a = 2 * j; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2) }
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); g.setIndex(idx)
    return g
  }, [])
  const vTex = useMemo(() => { const t = verso.clone(); t.repeat.x = -1; t.offset.x = 1; t.needsUpdate = true; return t }, [verso])
  const last = useRef(-9)
  useFrame(() => {
    const s = S.current, t = s.turn[i], th0 = Math.PI * t
    const th = Math.min(th0, s.theta), key = th * 1000 + t
    if (Math.abs(key - last.current) < 1e-4) return
    last.current = key
    const curl = t > 0 && t < 1 ? 0.95 * Math.sin(Math.PI * t) : 0
    const ofR = 0.003 + (NS - 1 - i) * 0.0035, ofL = 0.003 + i * 0.0035
    const off = lerp(ofR, -ofL, t)
    const ox = -Math.sin(th) * off, oz = Math.cos(th) * off
    const ds = PWd * 0.985 / SEG, hh = PHt * 0.985 / 2
    const pos = geo.attributes.position
    let x = 0.012, z = 0
    for (let j = 0; j <= SEG; j++) {
      pos.setXYZ(2 * j, x + ox, hh, z + oz); pos.setXYZ(2 * j + 1, x + ox, -hh, z + oz)
      const a = th - curl * Math.pow(j / SEG, 1.25)
      x += ds * Math.cos(a); z += ds * Math.sin(a)
    }
    pos.needsUpdate = true; geo.computeVertexNormals()
  })
  return (
    <group>
      <mesh geometry={geo} frustumCulled={false}>
        <meshStandardMaterial map={recto} emissiveMap={recto} emissive="#ffffff" emissiveIntensity={0.16} roughness={0.92} side={THREE.FrontSide} />
      </mesh>
      <mesh geometry={geo} frustumCulled={false}>
        <meshStandardMaterial map={vTex} emissiveMap={vTex} emissive="#ffffff" emissiveIntensity={0.16} roughness={0.92} side={THREE.BackSide} />
      </mesh>
    </group>
  )
}

function Book({ S, tx }) {
  const root = useRef(), inner = useRef(), cover = useRef(), spine = useRef(), shadow = useRef(), pool = useRef()
  const mats = useMemo(() => {
    const leather = (map) => new THREE.MeshPhysicalMaterial({ color: '#8a0a5c', map, bumpMap: tx.bump, bumpScale: 1.6, roughness: 0.52, clearcoat: 0.28, clearcoatRoughness: 0.5 })
    const plain = new THREE.MeshPhysicalMaterial({ color: '#4a0030', bumpMap: tx.bump, bumpScale: 1.2, roughness: 0.6, clearcoat: 0.15 })
    const paperEdgeX = new THREE.MeshStandardMaterial({ map: tx.edgeU, roughness: 0.95 })
    const paperEdgeY = new THREE.MeshStandardMaterial({ map: tx.edgeV, roughness: 0.95 })
    const paperDark = new THREE.MeshStandardMaterial({ color: '#d8c5a3', roughness: 1 })
    const face = (map) => new THREE.MeshStandardMaterial({ map, emissiveMap: map, emissive: '#ffffff', emissiveIntensity: 0.16, roughness: 0.92 })
    const endp = new THREE.MeshStandardMaterial({ map: tx.endpaper, roughness: 0.85 })
    return {
      frontBoard: [plain, plain, plain, plain, new THREE.MeshPhysicalMaterial({ map: tx.cover, bumpMap: tx.bump, bumpScale: 1.6, roughness: 0.5, clearcoat: 0.3, clearcoatRoughness: 0.45, metalness: 0.02 }), endp],
      backBoard: [plain, plain, plain, plain, endp, leather(null)],
      rightBlock: [paperEdgeX, paperDark, paperEdgeY, paperEdgeY, face(tx.back), paperDark],
      leftBlock: [paperEdgeX, paperDark, paperEdgeY, paperEdgeY, paperDark, face(tx.leftFront)],
      spine: new THREE.MeshPhysicalMaterial({ map: tx.spine, roughness: 0.5, clearcoat: 0.3, side: THREE.FrontSide }),
    }
  }, [tx])
  const spineGeo = useMemo(() => new THREE.CylinderGeometry(1, 1, BH, 28, 1, true, Math.PI, Math.PI), [])
  useFrame(({ clock }) => {
    const s = S.current, t = clock.elapsedTime, o = s.theta / Math.PI, oe = eio(o)
    cover.current.rotation.y = -s.theta
    const r = T + B, sc = 1 - 0.97 * o
    spine.current.scale.set(0.075, 1, r * sc); spine.current.position.z = -r * (1 - sc)
    inner.current.position.x = -(BW / 2) * (1 - o)
    root.current.rotation.set(0.07 - 0.03 * oe, (0.5 * (1 - sstep(0, 0.2, o)) - 0.35 * sstep(0, 0.2, o) * (1 - sstep(0.3, 1, o))) + Math.sin(t * 0.5) * 0.03 * (1 - oe), 0)
    const fl = Math.sin(t * 0.9) * 0.05
    root.current.position.y = fl + 0.02
    const k = 1 - clamp(fl * 4)
    shadow.current.scale.set(lerp(2.0, 4.2, oe) * (0.96 + 0.04 * k), lerp(1.5, 2.2, oe), 1)
    shadow.current.material.opacity = 0.62 * (0.9 + 0.1 * k)
  })
  const half = (T + B)
  return (
    <>
      <group ref={root}>
        <group ref={inner}>
          {/* spine */}
          <mesh ref={spine} geometry={spineGeo} material={mats.spine} />
          {/* back board + right page block (fixed) */}
          <mesh position={[BW / 2, 0, -T - B / 2]} material={mats.backBoard}><boxGeometry args={[BW, BH, B]} /></mesh>
          <mesh position={[PWd / 2 + 0.01, 0, -T / 2]} material={mats.rightBlock}><boxGeometry args={[PWd, PHt, T]} /></mesh>
          {/* leaves */}
          {tx.recto.map((r, i) => <Leaf key={i} i={i} S={S} recto={r} verso={tx.verso[i]} />)}
          {/* front cover assembly */}
          <group ref={cover}>
            <mesh position={[BW / 2, 0, T + B / 2]} material={mats.frontBoard}><boxGeometry args={[BW, BH, B]} /></mesh>
            <mesh position={[PWd / 2 + 0.01, 0, T / 2]} material={mats.leftBlock}><boxGeometry args={[PWd, PHt, T]} /></mesh>
          </group>
        </group>
      </group>
      {/* floor: light pool + soft contact shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.42, 0]} scale={[7, 5, 1]}>
        <planeGeometry args={[1, 1]} /><meshBasicMaterial map={tx.pool} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.5} toneMapped={false} />
      </mesh>
      <mesh ref={shadow} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.4, 0]}>
        <planeGeometry args={[1, 1]} /><meshBasicMaterial map={tx.shadow} transparent depthWrite={false} opacity={0.6} toneMapped={false} />
      </mesh>
    </>
  )
}

/* ---------------------------------------------------- floating props */
const EMIT = [0, 0.15, 0.25]
function Card({ S, ch, tex, size, home, from = EMIT, rot = [0, 0, 0], delay = 0, float = 0.05, op = 1, additive = false, upd }) {
  const m = useRef(), mat = useRef(), seed = useMemo(() => Math.random() * 10, [])
  useFrame(({ clock }) => {
    const w = S.current.w[ch], u = eio(clamp((w - delay) / (1 - delay))), o = m.current
    o.visible = u > 0.004; if (!o.visible) return
    const t = clock.elapsedTime
    o.position.set(lerp(from[0], home[0], u) + Math.sin(t * .7 + seed) * float * .6, lerp(from[1], home[1], u) + Math.cos(t * .6 + seed) * float, lerp(from[2], home[2], u))
    o.rotation.set(rot[0] + Math.sin(t * .5 + seed) * .04, rot[1] + Math.cos(t * .45 + seed) * .06, rot[2] + Math.sin(t * .4 + seed) * .03)
    const sc = .55 + .45 * u; o.scale.set(size[0] * sc, size[1] * sc, 1)
    mat.current.opacity = u * op
    upd && upd(o, mat.current, u, t, S.current)
  })
  return (
    <mesh ref={m} visible={false}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial ref={mat} map={tex} transparent depthWrite={false} toneMapped={false} blending={additive ? THREE.AdditiveBlending : THREE.NormalBlending} />
    </mesh>
  )
}

/* a card that repeatedly travels from the book to a target */
function Stream({ S, ch, tex, size, to, offset = 0, speed = 0.16, lift = 0.5, from = [0, 0.1, 0.2] }) {
  return (
    <Card S={S} ch={ch} tex={tex} size={size} home={from} from={from} float={0}
      upd={(o, mat, u, t) => {
        const s = ((t * speed + offset) % 1), e = eio(s)
        o.position.set(lerp(from[0], to[0], e), lerp(from[1], to[1], e) + Math.sin(Math.PI * e) * lift, lerp(from[2], to[2], e) + Math.sin(Math.PI * e) * .35)
        o.rotation.set(0, (to[0] < 0 ? .5 : -.5) * e, (to[0] < 0 ? .2 : -.2) * Math.sin(Math.PI * e))
        const sc = (.4 + .6 * Math.sin(Math.PI * Math.min(1, e * 1.15)))
        o.scale.set(size[0] * sc, size[1] * sc, 1)
        mat.opacity = u * Math.sin(Math.PI * s) ** 0.6
      }} />
  )
}

function Device({ S, ch, kind, pos, rot, tex, scale = 1 }) {
  const g = useRef()
  const dims = { phone: [0.62, 1.16], tablet: [1.02, 1.36], ereader: [0.86, 1.14], laptop: [1.5, 0.98] }[kind]
  useFrame(({ clock }) => {
    const u = eio(S.current.w[ch]), o = g.current, t = clock.elapsedTime
    o.visible = u > 0.004; if (!o.visible) return
    o.scale.setScalar(scale * (0.3 + 0.7 * u))
    o.position.set(lerp(0, pos[0], u), lerp(0.1, pos[1], u) + Math.sin(t * .8 + pos[0]) * .04, lerp(0.2, pos[2], u))
    o.rotation.set(rot[0], rot[1] + Math.sin(t * .4 + pos[0]) * .05, rot[2])
  })
  const [w, h] = dims
  return (
    <group ref={g} visible={false}>
      <RoundedBox args={[w, h, 0.06]} radius={kind === 'laptop' ? 0.03 : 0.07} smoothness={3}>
        <meshStandardMaterial color="#1a1116" roughness={0.35} metalness={0.5} />
      </RoundedBox>
      <mesh position={[0, 0, 0.032]}>
        <planeGeometry args={[w - (kind === 'ereader' ? 0.14 : 0.08), h - (kind === 'ereader' ? 0.22 : 0.09)]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      {kind === 'laptop' && <mesh position={[0, -h / 2 - 0.02, 0.28]} rotation={[-Math.PI / 2 + 0.05, 0, 0]}><boxGeometry args={[w + 0.14, 0.62, 0.035]} /><meshStandardMaterial color="#2a1c23" roughness={0.4} metalness={0.5} /></mesh>}
    </group>
  )
}

function DistLine({ S, ch, to }) {
  const ref = useRef()
  const pts = useMemo(() => new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, .1, .1), new THREE.Vector3(to[0] * .5, to[1] * .5 + .9, .7), new THREE.Vector3(...to)).getPoints(28), [to])
  useFrame(() => { const u = eio(S.current.w[ch]); if (ref.current) { ref.current.visible = u > .01; ref.current.material.opacity = u * .55 } })
  return <Line ref={ref} points={pts} color="#8fd69a" lineWidth={1.4} dashed dashScale={9} gapSize={.6} transparent opacity={0} />
}

function Props({ S, tx }) {
  const P = tx.props
  const words = ['content', 'structured', 'accessible', 'digital', 'convert', 'ready', 'EPUB', 'XML', 'pages']
  return (
    <>
      {/* IDEA */}
      <Card S={S} ch={0} tex={P.glowWarm} size={[3.0, 3.0]} home={[-2.35, 0.75, -0.3]} from={[0, .2, -.3]} additive op={.8} float={0.02} />
      <Card S={S} ch={0} tex={P.bulb} size={[1.0, 1.0]} home={[-2.35, 0.75, 0.6]} float={0.06} />
      {[[2.4, 0.95, .6, -.2], [-2.5, -0.5, .4, .25], [2.6, -0.2, .7, .15], [-2.05, -1.0, .5, -.1]].map(([x, y, z, r], i) =>
        <Card key={i} S={S} ch={0} tex={P.letters[i]} size={[.5, .5]} home={[x, y, z]} rot={[0, 0, r]} delay={.05 + i * .07} float={.09} />)}
      {[[2.35, -0.95, .7, -.08], [-2.6, 0.05, .6, .1], [1.95, 1.15, .7, .08]].map(([x, y, z, r], i) =>
        <Card key={i} S={S} ch={0} tex={P.words[i]} size={[1.15, .37]} home={[x, y, z]} rot={[0, 0, r]} delay={.1 + i * .08} float={.05} />)}
      {/* CONTENT */}
      {[[-2.4, 0.55, .4, .16], [2.45, 0.35, .5, -.2], [-2.15, -.65, .6, -.08]].map(([x, y, z, r], i) =>
        <Card key={i} S={S} ch={1} tex={P.ms[i]} size={[.78, 1.04]} home={[x, y, z]} rot={[0, i === 1 ? -.3 : .3, r]} delay={i * .12} float={.06} />)}
      {words.map((w, i) => (
        <Card key={w} S={S} ch={1} tex={P.flow[i]} size={[1.0, .32]} home={[0, 1.2, .5]} float={0}
          upd={(o, mat, u, t) => {
            const s = (t * 0.075 + i / words.length) % 1, x = -2.7 + s * 5.4
            o.position.set(x, 1.32 + Math.sin(x * 1.4 + i) * .16, .55 + Math.sin(s * Math.PI) * .25)
            o.rotation.z = Math.cos(x * 1.4 + i) * .08
            mat.opacity = u * Math.sin(Math.PI * s) ** .7
          }} />))}
      {/* DESIGN — pieces assemble from far away */}
      {[[-2.35, .85, .5, P.cov[0]], [2.5, .65, .45, P.cov[1]], [2.3, -.55, .6, P.cov[2]]].map(([x, y, z, t], i) =>
        <Card key={i} S={S} ch={2} tex={t} size={[.7, .99]} home={[x, y, z]} from={[x * 2.3, y * 2 + 1, z + 1.8]} rot={[0, i % 2 ? -.35 : .35, i ? -.1 : .12]} delay={.05 + i * .1} float={.05} />)}
      {[0.3, 0.0, -0.3, -0.6].map((y, i) =>
        <Card key={i} S={S} ch={2} tex={P.sw[i]} size={[.3, .3]} home={[-3.05, y, .5]} from={[-6, y + 1.5, 1.5]} delay={.15 + i * .07} float={.05} />)}
      <Card S={S} ch={2} tex={P.type} size={[.85, .85]} home={[-2.35, -.85, .5]} from={[-5, -2, 1.6]} rot={[0, .3, .1]} delay={.2} />
      <Card S={S} ch={2} tex={P.grid} size={[.8, 1.0]} home={[2.5, -.95, .4]} from={[5, -2.4, 1.6]} rot={[0, -.3, -.08]} delay={.3} />
      {/* TECHNOLOGY */}
      <Card S={S} ch={3} tex={P.tree} size={[.95, 1.19]} home={[-2.5, .45, .55]} rot={[0, .35, 0]} />
      {[['API', -1.75, 1.45, .6], ['{ }', -.9, 1.62, .5], ['cloud', 0.15, 1.6, .55], ['CI/CD', 1.0, 1.55, .6], ['React', 1.85, 1.35, .5], ['.epub', -2.7, -.55, .6], ['xml', 2.7, -.2, .5]].map(([t, x, y, z], i) =>
        <Card key={t} S={S} ch={3} tex={P.chips[i]} size={[.72, .24]} home={[x, y, z]} delay={.08 + i * .07} float={.07} />)}
      <Device S={S} ch={3} kind="tablet" pos={[2.5, .2, .6]} rot={[0, -.4, 0]} tex={P.scr.tablet} scale={.8} />
      {/* PUBLISHING */}
      <Card S={S} ch={4} tex={P.isbn} size={[.9, .6]} home={[2.55, -.6, .5]} rot={[0, -.3, -.05]} delay={.15} />
      <Card S={S} ch={4} tex={P.file} size={[.6, .75]} home={[-2.55, .7, .5]} rot={[0, .3, .1]} />
      {[[-2.75, -.95, 'Stores'], [-2.8, .05, 'Libraries'], [2.8, .95, 'Schools']].map(([x, y], i) => <DistLine key={i} S={S} ch={4} to={[x, y, .35]} />)}
      {[[-2.75, -.95, 0], [-2.8, .05, 1], [2.8, .95, 2]].map(([x, y, i]) =>
        <Card key={i} S={S} ch={4} tex={P.nodes[i]} size={[.95, .28]} home={[x, y, .35]} delay={.3} float={.03} />)}
      {[[-2.75, -.95, 0, .0], [-2.75, -.95, 1, .5], [-2.8, .05, 0, .25], [-2.8, .05, 1, .75], [2.8, .95, 0, .1], [2.8, .95, 1, .6], [2.8, .95, 0, .85]].map(([x, y, k, off], i) =>
        <Stream key={i} S={S} ch={4} tex={k ? P.file : P.cov[i % 3]} size={k ? [.3, .38] : [.32, .45]} to={[x, y, .4]} offset={off} lift={.5} />)}
      {/* READER */}
      <Device S={S} ch={5} kind="tablet" pos={[-2.5, .35, .6]} rot={[0, .4, 0]} tex={P.scr.tablet} scale={.85} />
      <Device S={S} ch={5} kind="phone" pos={[2.6, .5, .7]} rot={[0, -.4, 0]} tex={P.scr.phone} scale={.9} />
      <Device S={S} ch={5} kind="ereader" pos={[-2.2, -.95, .8]} rot={[0, .3, 0]} tex={P.scr.ereader} scale={.72} />
      <Device S={S} ch={5} kind="laptop" pos={[2.15, -.85, .7]} rot={[-.05, -.3, 0]} tex={P.scr.laptop} scale={.72} />
      {[[-2.5, .35, 0], [2.6, .5, .3], [-2.2, -.95, .55], [2.15, -.85, .8]].map(([x, y, off], i) =>
        <Stream key={i} S={S} ch={5} tex={P.scr.tablet} size={[.3, .4]} to={[x, y, .8]} offset={off} lift={.6} speed={.14} />)}
      {/* ambient particles */}
      <Sparkles count={38} scale={[7, 3.6, 2.6]} size={2.2} speed={0.18} opacity={0.45} color="#9be3a4" position={[0, 0, 0.4]} />
    </>
  )
}

/* ---------------------------------------------------------- driver */
function Driver({ S, target, live, onFrame }) {
  const { camera, size } = useThree()
  const sp = useRef(0)
  useFrame((st, dt) => {
    const d = target.current - sp.current
    sp.current = Math.abs(d) < 1e-5 ? target.current : sp.current + d * (1 - Math.exp(-dt * 7))
    const p = sp.current, s = S.current
    s.p = p; s.theta = openTheta(p)
    for (let i = 0; i < NS; i++) s.turn[i] = turnOf(p, i)
    for (let k = 0; k < 6; k++) s.w[k] = chapterWeight(p, k)
    // camera: pulls in as the book opens, drifts during the journey, retreats at the end
    const open = eio(clamp((p - 0.12) / 0.2)), pull = sstep(0.9, 1, p), o = s.theta / Math.PI
    let dist = lerp(8.5, 7.4, open) - 0.2 * sstep(0.32, 0.9, p) + pull * 1.9 + 0.3 * (1 - open) * Math.sin(st.clock.elapsedTime * 0.35)
    const aspect = size.width / size.height, tanH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
    if (aspect > 1.5) dist *= 0.92   // wide canvas: frame the book a little larger
    // always keep the whole book (height BH) + a margin inside the canvas, whatever the screen size
    const lookY = -0.32 * open - 0.02
    const needHalf = (BH / 2 + 0.3) * 1.04 + Math.abs(lookY)
    const needHalfW = lerp(BW / 2 + 0.2, BW + 0.25, o)
    dist = Math.max(dist, needHalf / tanH, needHalfW / (tanH * aspect))
    camera.position.set(Math.sin(st.clock.elapsedTime * 0.25) * 0.12 * (0.4 + o), lerp(0.25, 0.6, open) - 0.3 * pull, dist)
    camera.lookAt(0, lookY, 0)
    onFrame(p)
  })
  return null
}

function Scene({ target, onFrame, tx }) {
  const S = useRef({ p: 0, theta: 0, turn: Array(NS).fill(0), w: Array(6).fill(0) })
  return (
    <>
      <Env />
      <ambientLight intensity={0.35} color="#ffe9d2" />
      <spotLight position={[-3.5, 5.5, 6.5]} angle={0.7} penumbra={0.9} intensity={140} decay={2} color="#ffe0bd" />
      <directionalLight position={[3, 2, 5]} intensity={0.7} color="#ffd9c0" />
      <pointLight position={[3.5, 2.2, -3]} intensity={45} color="#c42a92" decay={2} />
      <Driver S={S} target={target} onFrame={onFrame} />
      <Book S={S} tx={tx} />
      <group scale={0.8}><Props S={S} tx={tx} /></group>
    </>
  )
}

/* ---------------------------------------------------- texture kit */
function buildKit() {
  const P = {}
  P.glowWarm = X.radial('255,196,110', .8); P.bulb = X.bulb()
  P.letters = ['J', 'A', 'A', '✦'].map(t => X.glyph(t, { italic: t !== '✦' }))
  P.words = ['purpose', 'vision', 'foundation'].map(t => X.hand(t))
  P.ms = ['Manuscript', 'Draft 02', 'Outline'].map(X.manuscript)
  P.flow = ['content', 'structured', 'accessible', 'digital', 'convert', 'ready', 'EPUB', 'XML', 'pages'].map(t => X.glyph(t, { size: 84, w: 384, h: 128, italic: true, color: '#e9fbe9' }))
  P.cov = [X.coverMock('#8f0060', '#4e0032', 'Publish'), X.coverMock('#4a9a4f', '#24582a', 'Apps'), X.coverMock('#5a2a70', '#2a0a3a', 'Cloud')]
  P.sw = ['#880058', '#4a9a4f', '#f0e2c6', '#c42a92'].map(X.swatch)
  P.type = X.typeCard(); P.grid = X.gridCard(); P.tree = X.tree()
  P.chips = ['API', '{ }', 'cloud', 'CI/CD', 'React', '.epub', 'xml'].map((t, i) => X.chip(t, i % 2 ? '#f5b3e0' : '#9be3a4'))
  P.file = X.fileCard(); P.isbn = X.isbn(); P.nodes = ['Publishing', 'Software', 'Cloud'].map(X.nodeLabel)
  P.scr = { tablet: X.screen('tablet'), phone: X.screen('phone'), ereader: X.screen('ereader'), laptop: X.screen('laptop') }
  const recto = [X.titlePage(), ...[0, 1, 2, 3, 4, 5].map(X.artPage)]
  const verso = [...[0, 1, 2, 3, 4, 5].map(X.versoPage), X.endVerso()]
  const shadow = X.radial('0,0,0', 1), pool = X.radial('150,40,120', .55)
  const bump = X.bumpTexture(); bump.wrapS = bump.wrapT = THREE.RepeatWrapping; bump.repeat.set(2, 3)
  const edgeU = X.edgeTexture(true), edgeV = X.edgeTexture(false); edgeU.repeat.set(1, 1); edgeV.repeat.set(1, 6)
  const endpaper = X.endpaperTexture(); endpaper.wrapS = endpaper.wrapT = THREE.RepeatWrapping; endpaper.repeat.set(3, 4)
  const leftFront = X.leftFront()
  return { props: P, recto, verso, shadow, pool, bump, edgeU, edgeV, endpaper, leftFront, cover: X.coverTexture(), spine: X.spineTexture(), back: X.backFace() }
}

const hasGL = () => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')) } catch { return false } }
const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

function Fallback() {
  return (
    <div className="jb-fallback">
      {CHAPTERS.map((c, i) => <div key={c.id} className="jb-fb-item"><span>{`0${i + 1}`}</span><h3>{c.title}</h3><b>{c.sub}</b><p>{c.text}</p></div>)}
    </div>
  )
}

/* ================================================================== section */
export function Journey() {
  const wrap = useRef(), stage = useRef(), target = useRef(0)
  const copy = useRef([]), dots = useRef([]), hintA = useRef(), hintB = useRef()
  const [ready, setReady] = useState(false), [live, setLive] = useState(false)
  const [tx, setTx] = useState(null)
  const [ok] = useState(() => hasGL() && !reduced())
  const navH = () => Math.round(document.querySelector('header.nav')?.getBoundingClientRect().height || 0)

  // fonts first, so canvas pages use the real typefaces
  useEffect(() => {
    if (!ok) return
    let dead = false
    const fonts = document.fonts
    const go = () => { if (!dead) setReady(true) }
    if (!fonts?.load) return go()
    Promise.race([
      Promise.all(['600 40px "Playfair Display"', 'italic 500 40px "Playfair Display"', '600 40px Caveat', '600 20px "JetBrains Mono"'].map(f => fonts.load(f).catch(() => 0))),
      new Promise(r => setTimeout(r, 2500)),
    ]).then(go)
    return () => { dead = true }
  }, [ok])
  useEffect(() => { if (!ready) return; const k = buildKit(); setTx(k); return () => { [k.shadow, k.pool, k.bump, k.edgeU, k.edgeV, k.endpaper, k.leftFront, k.cover, k.spine, k.back, ...k.recto, ...k.verso].forEach(t => t.dispose()) } }, [ready])

  useLayoutEffect(() => {
    if (!ok) return
    const setNav = () => stage.current && stage.current.style.setProperty('--jb-nav', navH() + 'px')
    setNav()
    const st = ScrollTrigger.create({
      trigger: wrap.current, start: () => { setNav(); return `top top+=${navH()}` }, end: () => `+=${window.innerHeight * (IS_MOBILE() ? 7.5 : 9)}`,
      pin: stage.current, pinSpacing: true, scrub: true, anticipatePin: 1, invalidateOnRefresh: true,
      onUpdate: self => { target.current = self.progress },
    })
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { rootMargin: '200px' })
    io.observe(wrap.current)
    return () => { st.kill(); io.disconnect() }
  }, [ok])

  // DOM overlay follows the same smoothed progress as the 3D scene
  const onFrame = useMemo(() => p => {
    let act = 0, best = -1
    for (let k = 0; k < 6; k++) {
      const c = copy.current[k]; if (!c) continue
      const c0 = centre(k), w = win(p, c0 - 0.045, c0 - 0.025, k === 5 ? 0.92 : c0 + 0.025, k === 5 ? 0.95 : c0 + 0.045)
      c.style.opacity = w.toFixed(3); c.style.transform = `translateX(-50%) translateY(${((1 - w) * 16).toFixed(1)}px)`
      if (w > best) { best = w; act = k }
    }
    dots.current.forEach((d, k) => d && d.classList.toggle('on', best > 0.3 && k === act))
    if (hintA.current) hintA.current.style.opacity = (1 - sstep(0.015, 0.07, p)).toFixed(3)
    if (hintB.current) hintB.current.style.opacity = sstep(0.985, 1, p).toFixed(3)
  }, [])

  return (
    <section id="journey" className="jb-wrap" ref={wrap}>
      {!ok ? <Fallback /> : (
        <div className="jb-stage" ref={stage}>
          <div className="jb-eyebrow"><span>Our Journey</span><i /></div>
          <div className="jb-canvas">
            {tx && (
              <Canvas frameloop={live ? 'always' : 'never'} dpr={[1, IS_MOBILE() ? 1.5 : 2]}
                camera={{ fov: 32, position: [0, 0.25, 7.6], near: 0.1, far: 40 }}
                gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
                <Scene target={target} onFrame={onFrame} tx={tx} />
              </Canvas>
            )}
          </div>
          <div className="jb-overlay">
            {CHAPTERS.map((c, i) => (
              <div className="jb-copy" key={c.id} ref={el => (copy.current[i] = el)}>
                <span className="jb-num">{`0${i + 1}`}<i />06</span>
                <h3>{c.title}</h3>
                <p className="jb-sub">{c.sub}</p>
                <p className="jb-text">{c.text}</p>
              </div>
            ))}
          </div>
          <div className="jb-hint" ref={hintA}>Scroll to open the book<span>↓</span></div>
          <div className="jb-hint" ref={hintB} style={{ opacity: 0 }}>The story continues<span>↓</span></div>
          <div className="jb-rail">{CHAPTERS.map((c, i) => <b key={c.id} ref={el => (dots.current[i] = el)} title={c.title} />)}</div>
        </div>
      )}
    </section>
  )
}
export default Journey
