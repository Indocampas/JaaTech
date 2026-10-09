import { useEffect, useMemo, useRef, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, ContactShadows, PresentationControls, QuadraticBezierLine, Line, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { CssBook } from './ui.jsx'

const damp = THREE.MathUtils.damp
export const mouse = { x: 0, y: 0 }
if (typeof window !== 'undefined') addEventListener('pointermove', e => { mouse.x = (e.clientX / innerWidth) * 2 - 1; mouse.y = -((e.clientY / innerHeight) * 2 - 1) }, { passive: true })

export const PAL = {
  green: ['#2E6B4A', '#7DB08F', '#1B4330'], wine: ['#8C2038', '#C58A99', '#4A0F1F'], sage: ['#3E7A58', '#9CC5A8', '#25503A'],
  rose: ['#6B1729', '#D08A9A', '#3A0C17'], ink: ['#4A0F1F', '#8C2038', '#2A0810'],
}
export const BOOKS = [['The Digital Future', 'green'], ['Innovation & Growth', 'wine'], ['Health & Wellness', 'sage'], ['Education', 'rose'], ['Business & Technology', 'ink']]

const cache = {}
function coverTex(title, pal) {
  const k = title + pal[0]; if (cache[k]) return cache[k]
  const c = document.createElement('canvas'); c.width = 400; c.height = 560
  const g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 560)
  gr.addColorStop(0, pal[1]); gr.addColorStop(1, pal[0]); g.fillStyle = gr; g.fillRect(0, 0, 400, 560)
  g.fillStyle = 'rgba(255,255,255,.14)'; g.beginPath(); g.moveTo(0, 560); g.lineTo(120, 350); g.lineTo(210, 450); g.lineTo(300, 300); g.lineTo(400, 470); g.lineTo(400, 560); g.fill()
  g.fillStyle = 'rgba(0,0,0,.16)'; g.beginPath(); g.moveTo(0, 560); g.lineTo(90, 450); g.lineTo(200, 540); g.lineTo(330, 430); g.lineTo(400, 520); g.lineTo(400, 560); g.fill()
  g.fillStyle = '#FFF9F7'; g.textAlign = 'center'; g.font = '600 50px "Playfair Display", Georgia, serif'
  title.split(' ').forEach((w, i) => g.fillText(w, 200, 120 + i * 58))
  g.strokeStyle = 'rgba(255,249,247,.45)'; g.lineWidth = 2; g.strokeRect(18, 18, 364, 524)
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4
  return (cache[k] = t)
}

/* Hardcover closed book: page block, front/back boards, spine */
export function Book({ title = 'The Digital Future', pal = PAL.green, w = 1.5, h = 2.1, d = 0.34, ...p }) {
  const tex = useMemo(() => coverTex(title, pal), [title, pal])
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: pal[2], roughness: 0.5 }), [pal])
  const front = useMemo(() => [dark, dark, dark, dark, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.4 }), dark], [tex, dark])
  return (
    <group {...p}>
      <mesh castShadow position={[0.02, 0, 0]}><boxGeometry args={[w - 0.06, h - 0.08, d - 0.06]} /><meshStandardMaterial color="#F6EBD9" roughness={0.9} /></mesh>
      <mesh castShadow position={[0, 0, d / 2 - 0.015]} material={front}><boxGeometry args={[w, h, 0.03]} /></mesh>
      <mesh position={[0, 0, -d / 2 + 0.015]} material={dark}><boxGeometry args={[w, h, 0.03]} /></mesh>
      <mesh position={[-w / 2 + 0.02, 0, 0]} material={dark}><boxGeometry args={[0.05, h, d]} /></mesh>
    </group>
  )
}

/* One half of an open book: extruded page block with a curved top + layered page lines + hardcover board */
const W = 2.1, D = 2.9, top = t => 0.4 + 0.34 * Math.pow(1 - t, 2.6) - 0.07 * t
function Half({ s }) {
  const geo = useMemo(() => {
    const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(W, 0)
    for (let i = 24; i >= 0; i--) sh.lineTo(W * i / 24, top(i / 24))
    const g = new THREE.ExtrudeGeometry(sh, { depth: D, bevelEnabled: false }); g.translate(0, 0, -D / 2); return g
  }, [])
  const lines = useMemo(() => [1, 2, 3, 4].map(k => Array.from({ length: 13 }, (_, i) => [W * i / 12, top(i / 12) - k * 0.07, 0])), [])
  return (
    <group scale={[s, 1, 1]}>
      <mesh geometry={geo} position={[0, 0.08, 0]} castShadow><meshStandardMaterial color="#FBF3E6" roughness={0.85} side={THREE.DoubleSide} /></mesh>
      {lines.map((pts, k) => <Line key={k} points={pts} color="#D9C7AA" lineWidth={1} position={[0, 0.08, D / 2 + 0.003]} />)}
      <mesh position={[W / 2 + 0.02, 0.04, 0]} castShadow><boxGeometry args={[W + 0.14, 0.08, D + 0.18]} /><meshStandardMaterial color="#6B1729" roughness={0.5} /></mesh>
    </group>
  )
}
const DOCS = [[-1.5, 1.7, 0.2, 0.4, -0.3, 'Ideas'], [0.1, 2.3, -0.3, -0.2, 0.1, 'Photos'], [1.6, 1.6, 0.3, -0.5, 0.2, 'Reports'], [-0.4, 1.3, 1, 0.1, -0.1, 'Stories']]

export function OpenBook({ docs = false, scale = 1, scroll = true, ...p }) {
  const g = useRef()
  useFrame((st, dt) => {
    const sc = scroll ? Math.min(scrollY / innerHeight, 2) : 0, t = st.clock.elapsedTime
    g.current.rotation.y = damp(g.current.rotation.y, mouse.x * 0.3 + Math.sin(t * 0.4) * 0.05 + sc * 0.22, 4, dt)
    g.current.rotation.x = damp(g.current.rotation.x, 0.1 + mouse.y * 0.05, 4, dt)
    g.current.position.y = damp(g.current.position.y, sc * 0.2, 4, dt)
  })
  return (
    <group {...p}>
      <Float speed={1.4} floatIntensity={0.35} rotationIntensity={0.08}>
        <group ref={g} scale={scale}>
          <Half s={1} /><Half s={-1} />
          {docs && DOCS.map(([x, y, z, r, q, n], i) => (
            <Float key={n} speed={2} floatIntensity={1.4}><mesh position={[x, y, z]} rotation={[-0.5, r, q]} castShadow><boxGeometry args={[1, 1.3, 0.02]} /><meshStandardMaterial map={coverTex(n, PAL[BOOKS[i][1]])} roughness={0.6} /></mesh></Float>
          ))}
        </group>
      </Float>
    </group>
  )
}

export const Leaves = () => (
  <>
    {[[-3, 1.6, -0.5], [3.2, 2, -0.3], [-2, 2.8, 0.4], [2.2, 3, 0.2], [-3.6, 0.6, 0.5], [3.7, 1, 0.6], [0, 3.4, -0.6]].map((p, i) => (
      <Float key={i} speed={1 + i * 0.15} floatIntensity={2} rotationIntensity={2}>
        <mesh position={p} scale={[0.22, 0.03, 0.09]} rotation={[0, i, 0.4]}><sphereGeometry args={[1, 14, 8]} /><meshStandardMaterial color={i % 2 ? '#4F8A68' : '#8C2038'} roughness={0.6} /></mesh>
      </Float>
    ))}
    <Sparkles count={40} scale={[9, 4, 3]} size={2.5} speed={0.3} color="#C58A99" position={[0, 2, 0]} />
  </>
)

/* Interactive library: draggable main book, shelf of books that lift on hover and come forward on click */
function Rig() {
  useFrame(({ camera }, dt) => { camera.position.x = damp(camera.position.x, mouse.x * 0.8, 3, dt); camera.position.y = damp(camera.position.y, 2.6 + mouse.y * 0.4, 3, dt); camera.lookAt(0, 1.9, 0) })
  return null
}
function Small({ i, t, k, active, onPick }) {
  const r = useRef(), [h, setH] = useState(false)
  useFrame((_, dt) => { r.current.position.y = damp(r.current.position.y, 0.8 + (h || active ? 0.24 : 0), 6, dt); r.current.rotation.y = damp(r.current.rotation.y, h ? -0.1 : -0.45, 6, dt) })
  return (
    <group ref={r} position={[(i - 2) * 1.7, 0.8, 1]} onClick={() => onPick(i)}
      onPointerOver={e => { e.stopPropagation(); setH(true); document.body.style.cursor = 'pointer' }} onPointerOut={() => { setH(false); document.body.style.cursor = '' }}>
      <Book title={t} pal={PAL[k]} w={0.9} h={1.3} d={0.24} />
    </group>
  )
}
export function Library({ sel, setSel }) {
  const f = useRef()
  useEffect(() => { f.current?.scale.setScalar(0.8) }, [sel])
  useFrame((_, dt) => f.current.scale.setScalar(damp(f.current.scale.x, 1, 5, dt)))
  const [t, k] = BOOKS[sel]
  return (
    <>
      <Rig />
      <PresentationControls polar={[-0.15, 0.15]} azimuth={[-1, 1]} snap config={{ mass: 1, tension: 200 }} position={[0, 3.3, 0]}>
        <Float speed={1.5} floatIntensity={0.3}><group ref={f}><Book title={t} pal={PAL[k]} w={2.3} h={3.2} d={0.5} rotation={[0, -0.25, 0]} /></group></Float>
      </PresentationControls>
      <mesh position={[0, 0.06, 1]} receiveShadow><boxGeometry args={[9.2, 0.14, 1.9]} /><meshStandardMaterial color="#C9A08F" roughness={0.6} /></mesh>
      {BOOKS.map(([n, c], i) => <Small key={n} i={i} t={n} k={c} active={i === sel} onPick={setSel} />)}
      <ContactShadows position={[0, -0.02, 1]} opacity={0.35} scale={14} blur={2.5} far={4} />
    </>
  )
}

/* Stylised globe: dotted sphere, floating cloud, animated-rotation connection arcs and device markers */
export function WorldGlobe() {
  const g = useRef()
  const pts = useMemo(() => { const a = [], N = 900; for (let i = 0; i < N; i++) { const y = 1 - 2 * (i + 0.5) / N, r = Math.sqrt(1 - y * y), th = i * 2.39996; a.push(Math.cos(th) * r * 1.5, y * 1.5, Math.sin(th) * r * 1.5) } return new Float32Array(a) }, [])
  const cloud = useMemo(() => new THREE.Vector3(0, 2.7, 0), [])
  const spots = useMemo(() => [[0.6, 0.5], [2.4, 0.2], [4.1, -0.3], [5.3, 0.6], [1.5, -0.5], [3.3, 0.8]].map(([lo, la]) => new THREE.Vector3(Math.cos(la) * Math.cos(lo), Math.sin(la), Math.cos(la) * Math.sin(lo)).multiplyScalar(1.5)), [])
  useFrame((_, dt) => { g.current.rotation.y += dt * 0.09 })
  return (
    <group rotation={[0.25, 0, -0.12]}>
      <group ref={g}>
        <mesh><sphereGeometry args={[1.47, 48, 32]} /><meshStandardMaterial color="#DCEBDD" roughness={1} /></mesh>
        <points><bufferGeometry><bufferAttribute attach="attributes-position" array={pts} count={pts.length / 3} itemSize={3} /></bufferGeometry><pointsMaterial size={0.04} color="#2E6B4A" /></points>
        {spots.map((p, i) => (
          <group key={i}>
            <QuadraticBezierLine start={cloud.toArray()} end={p.toArray()} mid={cloud.clone().add(p).multiplyScalar(0.68).toArray()} color="#8C2038" lineWidth={1.2} dashed dashScale={12} />
            <mesh position={p}><sphereGeometry args={[0.05]} /><meshBasicMaterial color="#8C2038" /></mesh>
            <group position={p.clone().multiplyScalar(1.1)} ref={o => o && o.lookAt(p.clone().multiplyScalar(3))}><mesh><boxGeometry args={[0.26, 0.34, 0.03]} /><meshStandardMaterial color={i % 2 ? '#6B1729' : '#2E6B4A'} /></mesh></group>
          </group>
        ))}
        <Float speed={2} floatIntensity={0.5}>
          <group position={cloud}>{[[0, 0, 0, 0.42], [-0.45, -0.1, 0, 0.3], [0.45, -0.1, 0, 0.32], [0.1, 0.25, 0, 0.3]].map(([x, y, z, r], i) => <mesh key={i} position={[x, y, z]}><sphereGeometry args={[r, 24, 16]} /><meshStandardMaterial color="#FFF9F7" roughness={0.9} /></mesh>)}</group>
        </Float>
      </group>
    </group>
  )
}

/* Canvas wrapper: mounts WebGL only while visible, caps DPR, scales the camera for narrow screens, falls back to CSS book */
const hasGL = () => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')) } catch { return false } }
export function Stage({ children, cam = [0, 3, 7], fov = 36, className = '' }) {
  const ref = useRef(), [on, setOn] = useState(false), [ok] = useState(hasGL)
  useEffect(() => { const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: '300px' }); io.observe(ref.current); return () => io.disconnect() }, [])
  const m = innerWidth < 768, k = innerWidth < 600 ? 1.6 : innerWidth < 1000 ? 1.25 : 1
  return (
    <div ref={ref} className={'stage ' + className}>
      {ok ? on && (
        <Canvas flat dpr={[1, m ? 1.4 : 1.8]} shadows={!m} camera={{ position: cam.map(v => v * k), fov }} gl={{ antialias: !m, alpha: true }}>
          <Suspense fallback={null}>
            <hemisphereLight args={['#FFF9F7', '#E8C5CC', 1.3]} />
            <directionalLight position={[4, 7, 5]} intensity={2.6} castShadow />
            <directionalLight position={[0, 3, 9]} intensity={1.1} />
            <directionalLight position={[-5, 3, -2]} intensity={0.7} color="#f7c9d3" />
            {children}
          </Suspense>
        </Canvas>
      ) : <div className="fb"><CssBook size="lg" /></div>}
    </div>
  )
}
