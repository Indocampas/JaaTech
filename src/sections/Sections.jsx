import { Fragment, useState ,useEffect, useMemo, useRef} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Reveal, Title, Button, Tilt, Icon } from '../components/ui.jsx'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Lightbulb, FileText, PenTool, Settings2, BookOpen, Users } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

import {
  FaFileAlt,
  FaCode,
  FaBookOpen,
  FaUniversalAccess,
  FaShieldAlt,
  FaCloudUploadAlt,
  FaShareAlt,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import ApplyModal from '../components/ApplyModal.jsx'
import { SITE } from '../lib/site.js'
import { formatWhatsAppMessage, openWhatsApp } from '../lib/whatsapp.js'
import '../styles/forms.css'


const NODES = [
  {
    icon: FaFileAlt,
    title: 'Content',
    text: 'Organize and prepare content',
  },
  {
    icon: FaCode,
    title: 'XML',
    text: 'Structured digital content',
  },
  {
    icon: FaBookOpen,
    title: 'ePUB',
    text: 'Responsive digital publications',
  },
  {
    icon: FaUniversalAccess,
    title: 'Accessibility',
    text: 'Inclusive reading experiences',
  },
  {
    icon: FaShieldAlt,
    title: 'QA',
    text: 'Quality assurance',
  },
  {
    icon: FaCloudUploadAlt,
    title: 'Publishing',
    text: 'Publication management',
  },
  {
    icon: FaShareAlt,
    title: 'Distribution',
    text: 'Global digital delivery',
  },
]
const A = '/assets/'

const BOOKS = [
  { title: 'The Digital Future', tag: 'Technology & Innovation', img: A + 'book-digital-future.webp', tone: 'green' },
  { title: 'Innovation & Growth', tag: 'Business & Technology', img: A + 'book-innovation.webp', tone: 'wine' },
  { title: 'Health & Wellness', tag: 'Modern Living', img: A + 'book-health.webp', tone: 'blue' },
  { title: 'Education', tag: 'Learning & Development', img: A + 'book-education.webp', tone: 'violet' },
  { title: 'Business & Technology', tag: 'Professional Growth', img: A + 'book-business.webp', tone: 'green' },
]

const FEATS = [
  ['doc', 'Creative Content Transformation'],
  ['book', 'Digital Publishing Expertise'],
  ['leaf', 'Beautiful Reading Experiences'],
  ['code', 'Technology-Driven Solutions'],
]

const STEPS = [
  ['doc', 'Document', 'Raw content and source documents'],
  ['code', 'Structured Content', 'Organized and optimized information'],
  ['layout', 'Design & Layout', 'Beautiful visual presentation'],
  ['tablet', 'eBook', 'Interactive digital reading experience'],
  ['stack', 'Digital Publication', 'Publication-ready digital content'],
]

  const devices = [
    {
      k: "mobile",
      t: "Mobile",
      d: "Read anywhere",
    },
    {
      k: "tablet",
      t: "Tablet",
      d: "Interactive reading experience",
    },
    {
      k: "laptop",
      t: "Laptop",
      d: "Work and learn comfortably",
    },
    {
      k: "ereader",
      t: "eReader",
      d: "Focused digital reading",
    },
  ];



const INDUSTRIES = [
  ['cap', 'Education', 'Digital learning content'],
  ['heart', 'Healthcare', 'Accessible medical information'],
  ['chart', 'Business', 'Professional digital publications'],
  ['book', 'Publishing', 'Modern publishing solutions'],
  ['bldg', 'Corporate', 'Enterprise knowledge experiences'],
]

const IconCard = ({ icon, title, text }) => (
  <div className="mini-card">
    <span className="ic"><Icon n={icon} /></span>
    <div><b>{title}</b><span>{text}</span></div>
  </div>
)

const BookImage = ({ book, className = '' }) => (
  <div className={'book-image ' + className}>
    <img src={book.img} alt={book.title} loading="lazy" />
  </div>
)

/* 01 HERO */

export function Hero() {
  return (
    <section id="home" className="hero hero-sample">

      {/* Background Video */}
      <video
        className="hero-bg-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={A + "hero-bg.mp4"} type="video/mp4" />
      </video>

      {/* Optional dark overlay */}
      <div className="hero-video-overlay"></div>

      <div className="wrap hero-sample-wrap">

        {/* Fully Transparent Content */}
        <motion.div
          className="hero-content-card"
          initial={{ opacity: 0, y: 35, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 1,
            delay: 0.15,
            ease: "easeOut",
          }}
        >

          {/* Heading */}
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: "easeOut",
            }}
          >
            From a blank page to a world of possibilities.
          </motion.h1>

          {/* Description */}
          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.45,
              ease: "easeOut",
            }}
          >
            Transforming ideas into engaging digital publishing
            experiences.
          </motion.p>

          {/* CTA */}
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.6,
              ease: "easeOut",
            }}
          >
            <a href="#about" className="hero-btn hero-btn-primary">
              Explore Our World <span>→</span>
            </a>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}


/* 02 ABOUT */
export function About() {
  return (
    <section id="about" className="s-blush">
      <div className="wrap two about-grid">
        
        <div>
          <Title
            eyebrow="About"
            title="Where Every Story Begins"
            sub="Your content. Our creativity. A better tomorrow."
          />

          <Reveal>
            <p className="body">
              Every great publication begins with an idea. We transform raw
              content into meaningful, engaging and beautifully designed
              digital experiences.
            </p>
          </Reveal>

          <div className="feats">
            {FEATS.map(([i, t], k) => (
              <Reveal key={t} d={k * 0.08}>
                <IconCard
                  icon={i}
                  title={t}
                  text="Designed for modern digital reading."
                />
              </Reveal>
            ))}
          </div>
        </div>

     <Reveal className="about-book">
  <video
    src={A + 'about-book.mp4'}
    autoPlay
    loop
    muted
    playsInline
    preload="metadata"
    disablePictureInPicture
    controlsList="nodownload nofullscreen noremoteplayback"
    onContextMenu={(e) => e.preventDefault()}
    className="about-video"
  />
</Reveal>

      </div>
    </section>
  )
}

/* 03 SERVICES */



export function Services() {
  return (
    <section id="services" className="services-section">
      <div className="wrap">

        {/* Section Heading */}
        <Title
          eyebrow="Our services"
          title="Technology That Powers Your Business"
          sub="We build scalable digital solutions across web, mobile, and cloud platforms."
        />

        {/* ================================
            MAIN SERVICES
        ================================= */}
        <div className="main-services">

          {/* Web Applications */}
          <Reveal d={0}>
            <motion.div
              className="main-service-card"
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="main-service-number">01</div>

              <motion.div
                className="main-service-icon"
                whileHover={{ scale: 1.08, rotate: 3 }}
              >
                <Icon n="globe" s={34} />
              </motion.div>

              <h3>Web Applications</h3>

              <p>
                Modern, responsive and scalable web applications designed
                to deliver seamless experiences across all devices.
              </p>

              <div className="service-tags">
                <span>React</span>
                <span>Java</span>
                <span>Spring Boot</span>
                <span>Node.js</span>
              </div>
            </motion.div>
          </Reveal>

          {/* Mobile Applications */}
          <Reveal d={0.15}>
            <motion.div
              className="main-service-card"
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="main-service-number">02</div>

              <motion.div
                className="main-service-icon"
                whileHover={{ scale: 1.08, rotate: -3 }}
              >
                <Icon n="smartphone" s={34} />
              </motion.div>

              <h3>Mobile Applications</h3>

              <p>
                Intuitive mobile applications built for Android and iOS
                with smooth performance and user-friendly experiences.
              </p>

              <div className="service-tags">
                <span>React Native</span>
                <span>Android</span>
                <span>iOS</span>
                <span>APIs</span>
              </div>
            </motion.div>
          </Reveal>

          {/* Cloud Solutions */}
          <Reveal d={0.3}>
            <motion.div
              className="main-service-card"
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="main-service-number">03</div>

              <motion.div
                className="main-service-icon"
                whileHover={{ scale: 1.08, rotate: 3 }}
              >
                <Icon n="cloud" s={34} />
              </motion.div>

              <h3>Cloud Solutions</h3>

              <p>
                Secure and scalable cloud solutions that help businesses
                deploy, manage and grow their digital applications.
              </p>

              <div className="service-tags">
                <span>Cloud</span>
                <span>Deployment</span>
                <span>Database</span>
                <span>API</span>
              </div>
            </motion.div>
          </Reveal>

        </div>


        {/* ================================
            CONTENT TRANSFORMATION PROCESS
        ================================= */}

        <div className="services-process-section">

          <Title
            eyebrow="Content transformation"
            title="From Content to Experience"
            sub="From raw documents to beautiful digital publications."
          />

          <div className="services-process">

            {/* Animated Background Line */}
            <motion.div
              className="process-line"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 1.8,
                ease: 'easeInOut',
                delay: 0.3,
              }}
            />

            {/* Steps */}
            <div className="flow-row">

              {STEPS.map(([ic, title, description], i) => (
                <Fragment key={title}>

                  {/* Step Card */}
                  <Reveal
                    d={i * 0.18}
                    className="step-w"
                  >
                    <motion.div
                      className="service-step-wrapper"
                      initial={{
                        opacity: 0,
                        y: 45,
                        scale: 0.94,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      viewport={{
                        once: true,
                        amount: 0.35,
                      }}
                      transition={{
                        duration: 0.65,
                        delay: i * 0.15,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >

                      <Tilt className="card step">

                        {/* Step Number */}
                        <motion.small
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{
                            opacity: 1,
                            x: 0,
                          }}
                          viewport={{ once: true }}
                          transition={{
                            delay: i * 0.15 + 0.2,
                            duration: 0.4,
                          }}
                        >
                          0{i + 1}
                        </motion.small>

                        {/* Icon */}
                        <motion.span
                          className="ic lg service-icon"
                          initial={{
                            scale: 0,
                            rotate: -25,
                          }}
                          whileInView={{
                            scale: 1,
                            rotate: 0,
                          }}
                          viewport={{
                            once: true,
                            amount: 0.4,
                          }}
                          transition={{
                            type: 'spring',
                            stiffness: 260,
                            damping: 16,
                            delay: i * 0.15 + 0.2,
                          }}
                        >
                          <Icon n={ic} s={30} />
                        </motion.span>

                        {/* Title */}
                        <motion.h3
                          initial={{
                            opacity: 0,
                            y: 10,
                          }}
                          whileInView={{
                            opacity: 1,
                            y: 0,
                          }}
                          viewport={{ once: true }}
                          transition={{
                            delay: i * 0.15 + 0.3,
                            duration: 0.4,
                          }}
                        >
                          {title}
                        </motion.h3>

                        {/* Description */}
                        <motion.p
                          initial={{
                            opacity: 0,
                            y: 10,
                          }}
                          whileInView={{
                            opacity: 1,
                            y: 0,
                          }}
                          viewport={{ once: true }}
                          transition={{
                            delay: i * 0.15 + 0.4,
                            duration: 0.4,
                          }}
                        >
                          {description}
                        </motion.p>

                      </Tilt>
                    </motion.div>
                  </Reveal>

                  {/* Animated Arrow */}
                  {i < STEPS.length - 1 && (
                    <motion.span
                      className="arw"
                      initial={{
                        opacity: 0,
                        x: -12,
                      }}
                      whileInView={{
                        opacity: 1,
                        x: 0,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        duration: 0.45,
                        delay: i * 0.18 + 0.35,
                      }}
                    >
                      <motion.span
                        animate={{
                          x: [0, 5, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      >
                        →
                      </motion.span>
                    </motion.span>
                  )}

                </Fragment>
              ))}

            </div>
          </div>

        </div>

      </div>
    </section>
  )
}

/* 04 SHOWCASE */
export function BookShowcase() {
  const [sel, setSel] = useState(0)
  const book = BOOKS[sel]
  return (
    <section id="showcase" className="s-lib">
      <div className="wrap">
        <Title eyebrow="3D book showcase" title="Interactive Library" sub="Explore. Read. Experience." />
        <div className="showcase-grid">
          <div className="showcase-main"><AnimatePresence mode="wait"><motion.div key={book.title} initial={{ opacity: 0, scale: .97, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .97, y: -12 }} transition={{ duration: .45 }}><BookImage book={book} /></motion.div></AnimatePresence></div>
          <div className="showcase-info card">
            <span className="eyebrow">Featured publication</span><h3>{book.title}</h3><p>Discover a new generation of digital reading experiences with beautiful, responsive publications.</p><Button href="#contact">Explore Books</Button>
            <div className="book-tabs">{BOOKS.map((b, i) => <button key={b.title} className={i === sel ? 'active' : ''} onClick={() => setSel(i)} aria-label={'View ' + b.title}><img src={b.img} alt="" /><span>{b.title}</span></button>)}</div>
          </div>
        </div>
      </div>
    </section>
  )
}


/* 05 TECHNOLOGY */

function TechnologyCard({ icon: Icon, title, text, index }) {
  return (
    <div className={`technology-card card-${index + 1}`}>

      <div className="technology-card-icon">
        <Icon />
      </div>

      <div className="technology-card-content">
        <h3>{title}</h3>
        <p>{text}</p>
      </div>

      <div className="technology-card-arrow">
        →
      </div>

    </div>
  );
}


export function Technology() {
  const [activeTechnology, setActiveTechnology] = useState("content");

  const technologyDetails = {
    content: {
      title: "Digital Content",
      subtitle: "Structured Publishing Content",
      description:
        "We transform raw publishing content into structured, organized and publication-ready digital content. Text, images, tables and other elements are carefully prepared for consistent digital publishing.",
      features: [
        "Structured digital content",
        "Clean content formatting",
        "Image and media integration",
        "Consistent publishing workflow",
      ],
    },

    xml: {
      title: "XML Technology",
      subtitle: "Structured XML Publishing",
      description:
        "XML allows publishing content to remain structured and reusable across different formats. It creates a flexible foundation for digital publishing and automated content transformation.",
      features: [
        "Structured XML workflows",
        "Reusable content architecture",
        "Automated content transformation",
        "Format-independent publishing",
      ],
    },

    book: {
      title: "Digital Book Production",
      subtitle: "From Manuscript to Digital Book",
      description:
        "Our digital book workflow converts publishing material into professionally structured digital books while maintaining typography, layout and content consistency.",
      features: [
        "Digital book formatting",
        "Professional page structure",
        "Typography consistency",
        "Responsive digital reading",
      ],
    },

    epub: {
      title: "ePUB Publishing",
      subtitle: "Modern Digital Publications",
      description:
        "ePUB technology enables publications to work across modern reading devices and platforms. Content adapts naturally to different screen sizes while maintaining a consistent reading experience.",
      features: [
        "Responsive ePUB creation",
        "Cross-device compatibility",
        "Digital reading experience",
        "Modern publication standards",
      ],
    },

    accessibility: {
      title: "Accessibility",
      subtitle: "Publishing for Everyone",
      description:
        "Accessibility-focused publishing helps digital content remain usable for readers with different abilities. We build publications with accessibility considerations throughout the workflow.",
      features: [
        "Accessible digital content",
        "Screen-reader friendly structure",
        "Semantic publishing",
        "Inclusive reading experience",
      ],
    },

    code: {
      title: "Publishing Automation",
      subtitle: "Technology Driven Workflows",
      description:
        "Code and automation help streamline repetitive publishing processes, improve consistency and reduce manual effort across large-scale digital publishing workflows.",
      features: [
        "Automated publishing workflows",
        "Process optimization",
        "Content transformation",
        "Scalable publishing systems",
      ],
    },
  };

  const activeDetail = technologyDetails[activeTechnology];

  const technologyNumber =
    Object.keys(technologyDetails).indexOf(activeTechnology) + 1;

  return (
    <section id="technology" className="technology-section">

      {/* BACKGROUND */}
      <div className="technology-bg-circle bg-circle-1" />
      <div className="technology-bg-circle bg-circle-2" />

      <div className="technology-container">

        {/* =====================================================
            HEADER
        ===================================================== */}
        <div className="technology-heading">

          <div className="technology-eyebrow">
            <span>Publishing Technology</span>
            <i />
          </div>

          <h2>Inside the Machine</h2>

          <p>
            Advanced technology for seamless publishing.
          </p>

        </div>


        {/* =====================================================
            MAIN LAYOUT
        ===================================================== */}
        <div className="technology-layout">

          {/* ===================================================
              LEFT — ORBIT SYSTEM
          =================================================== */}
          <div className="technology-visual">

            <div className="technology-scene">

              {/* Glow */}
              <div className="scene-glow" />


              {/* Orbit rings */}
              <div className="tech-orbit tech-orbit-outer" />
              <div className="tech-orbit tech-orbit-middle" />
              <div className="tech-orbit tech-orbit-inner" />


              {/* Decorative dots */}
              <span className="orbit-dot dot-1" />
              <span className="orbit-dot dot-2" />
              <span className="orbit-dot dot-3" />
              <span className="orbit-dot dot-4" />
              <span className="orbit-dot dot-5" />
              <span className="orbit-dot dot-6" />


              {/* =================================================
                  DIGITAL CONTENT
              ================================================= */}
              <button
                type="button"
                className={`orbit-item orbit-content ${
                  activeTechnology === "content" ? "active" : ""
                }`}
                onClick={() => setActiveTechnology("content")}
                aria-label="Digital Content"
              >
                <div className="publishing-document">

                  <div className="document-fold" />

                  <div className="document-heading" />

                  <span />
                  <span />
                  <span />
                  <span />
                  <span />

                </div>
              </button>


              {/* =================================================
                  XML
              ================================================= */}
              <button
                type="button"
                className={`orbit-item orbit-xml ${
                  activeTechnology === "xml" ? "active" : ""
                }`}
                onClick={() => setActiveTechnology("xml")}
                aria-label="XML Technology"
              >
                <div className="xml-window">

                  <div className="xml-topbar">
                    <i />
                    <i />
                    <i />
                  </div>

                  <div className="xml-code">

                    <div>
                      <b>&lt;</b>book<b>&gt;</b>
                    </div>

                    <div className="xml-indent">
                      <b>&lt;</b>content<b>&gt;</b>
                    </div>

                    <div className="xml-indent-2">
                      publishing
                    </div>

                    <div className="xml-indent">
                      <b>&lt;/</b>content<b>&gt;</b>
                    </div>

                    <div>
                      <b>&lt;/</b>book<b>&gt;</b>
                    </div>

                  </div>

                </div>
              </button>


              {/* =================================================
                  DIGITAL BOOK
              ================================================= */}
              <button
                type="button"
                className={`orbit-item orbit-book ${
                  activeTechnology === "book" ? "active" : ""
                }`}
                onClick={() => setActiveTechnology("book")}
                aria-label="Digital Book Production"
              >
                <div className="open-book">

                  <div className="book-page book-left">

                    <div className="book-page-title" />

                    <span />
                    <span />
                    <span />
                    <span />

                  </div>

                  <div className="book-spine" />

                  <div className="book-page book-right">

                    <div className="book-page-title" />

                    <span />
                    <span />
                    <span />
                    <span />

                  </div>

                </div>
              </button>


              {/* =================================================
                  EPUB
              ================================================= */}
              <button
                type="button"
                className={`orbit-item orbit-epub ${
                  activeTechnology === "epub" ? "active" : ""
                }`}
                onClick={() => setActiveTechnology("epub")}
                aria-label="ePUB Publishing"
              >
                <div className="epub-object">

                  <div className="epub-icon">
                    <div className="epub-page-left" />
                    <div className="epub-page-right" />
                  </div>

                  <strong>ePUB</strong>

                  <small>
                    DIGITAL
                    <br />
                    PUBLICATION
                  </small>

                </div>
              </button>


              {/* =================================================
                  ACCESSIBILITY
              ================================================= */}
              <button
                type="button"
                className={`orbit-item orbit-accessibility ${
                  activeTechnology === "accessibility" ? "active" : ""
                }`}
                onClick={() =>
                  setActiveTechnology("accessibility")
                }
                aria-label="Accessibility"
              >
                <div className="accessibility-object">
                  <FaUniversalAccess />
                </div>
              </button>


              {/* =================================================
                  AUTOMATION / CODE
              ================================================= */}
              <button
                type="button"
                className={`orbit-item orbit-code ${
                  activeTechnology === "code" ? "active" : ""
                }`}
                onClick={() => setActiveTechnology("code")}
                aria-label="Publishing Automation"
              >
                <div className="code-object">
                  <FaCode />
                </div>
              </button>


              {/* =================================================
                  CENTER PLATFORM
              ================================================= */}
              <div className="technology-platform">

                <div className="platform-glow" />

                <div className="logo-orb">
                  <img
                    src="/assets/jaa-tech-logo.png"
                    alt="JAA Tech Private Limited"
                  />
                </div>

              </div>

            </div>
          </div>


          {/* ===================================================
              RIGHT — ONLY SELECTED DETAIL
          =================================================== */}
          <div className="technology-detail-wrapper">

            <div
              className="technology-detail-panel"
              key={activeTechnology}
            >

              {/* Number */}
              <div className="technology-detail-number">
                {String(technologyNumber).padStart(2, "0")}
              </div>


              {/* Content */}
              <div className="technology-detail-content">

                <span className="technology-detail-subtitle">
                  {activeDetail.subtitle}
                </span>

                <h3>
                  {activeDetail.title}
                </h3>

                <p>
                  {activeDetail.description}
                </p>


                {/* Features */}
                <div className="technology-detail-features">

                  {activeDetail.features.map((feature) => (
                    <div
                      className="technology-detail-feature"
                      key={feature}
                    >
                      <span>✓</span>

                      <strong>
                        {feature}
                      </strong>
                    </div>
                  ))}

                </div>

              </div>

            </div>


            {/* Active technology indicator */}
            <div className="technology-selection">

              <span>
                Selected Technology
              </span>

              <strong>
                {activeDetail.title}
              </strong>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

/* 06 ACCESSIBILITY */

export function Accessibility() {
  const [selectedImage, setSelectedImage] = useState(null)

  const devices = [
    ['mobile', 'Mobile', 'Read anywhere', '/assets/devices/mobile.jpeg'],
    ['tablet', 'Tablet', 'Interactive reading experience', '/assets/devices/tablet.jpeg'],
    ['laptop', 'Laptop', 'Work and learn comfortably', '/assets/devices/laptop.jpeg'],
    ['ereader', 'eReader', 'Focused digital reading', '/assets/devices/ereader.jpeg'],
  ]

  return (
    <section id="accessibility">
      <div className="wrap">

        <Title
          eyebrow="Accessibility"
          title="Every Reader"
          sub="One content. Multiple experiences."
        />

        <div className="access-grid">

          {devices.map(([k, t, d, img], i) => (
            <motion.figure
              key={k}
              className={`device-card ${k}-card`}
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >

              <button
                type="button"
                className={`device ${k} device-clickable`}
                onClick={() =>
                  setSelectedImage({
                    src: img,
                    title: t,
                    description: d
                  })
                }
                aria-label={`View ${t} image`}
              >
                <img
                  src={img}
                  alt={t}
                  className="device-image"
                />
              </button>

              <figcaption>
                <b>{t}</b>
                <small>{d}</small>
              </figcaption>

            </motion.figure>
          ))}

          <div className="access-book">
            <BookImage book={BOOKS[0]} />
          </div>

        </div>
      </div>

      {/* =====================================================
          IMAGE ZOOM MODAL
          ===================================================== */}

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="device-image-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >

            <motion.div
              className="device-image-modal-content"
              initial={{
                opacity: 0,
                scale: 0.85
              }}
              animate={{
                opacity: 1,
                scale: 1
              }}
              exit={{
                opacity: 0,
                scale: 0.85
              }}
              transition={{
                duration: 0.3,
                ease: 'easeOut'
              }}
              onClick={(e) => e.stopPropagation()}
            >

              <button
                type="button"
                className="device-modal-close"
                onClick={() => setSelectedImage(null)}
                aria-label="Close image"
              >
                ×
              </button>

              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="device-modal-image"
              />

              <div className="device-modal-info">
                <b>{selectedImage.title}</b>
                <span>{selectedImage.description}</span>
              </div>

            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

    </section>
  )
}

/* 07 CLOUD */
export function CloudDistribution() {
  return (
    <section id="cloud" className="s-blush">
      <div className="wrap">

        <Title
          eyebrow="Cloud & distribution"
          title="One Book, Millions of Readers"
          sub="From the cloud to every corner of the world."
        />

        <div className="cloud-grid">

          {/* LEFT VIDEO */}
          <div className="globe-art">
            <video
  autoPlay
  muted
  loop
  playsInline
  preload="auto"
  controls={false}
  disablePictureInPicture
  disableRemotePlayback
>
  <source src={A + 'globe.mp4'} type="video/mp4" />
            </video>
          </div>

          {/* RIGHT CONTENT */}
          <div className="cloud-copy">

            <h3>
              Create Once.
              <br />
              Publish Everywhere.
            </h3>

            <div className="stats">

              <div>
                <b>100+</b>
                <span>Countries</span>
              </div>

              <div>
                <b>10M+</b>
                <span>Readers</span>
              </div>

              <div>
                <b>1000+</b>
                <span>Publications</span>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  )
}

/* 08 PORTFOLIO */


/* 09 JOURNEY — scroll-driven 3D book, logo palette (see JourneyBook.jsx) */
export { Journey } from './JourneyBook.jsx'

/* 10 INDUSTRIES */
export function Industries() {
  return (
    <section id="industries">
      <div className="wrap"><Title eyebrow="Industries" title="Solutions for Every Sector" sub="Different industries. Same goal — Better Reading Experiences." /><div className="industries-grid">{INDUSTRIES.map(([i, t, d], k) => <Reveal key={t} d={k * .07}><article className={'industry-card t' + k}><div className="industry-icon"><Icon n={i} s={48} /></div><h3>{t}</h3><p>{d}</p><a href="#contact">Learn More →</a></article></Reveal>)}</div></div>
    </section>
  )
}

/* 11 TESTIMONIALS */
export function Testimonials() {
  return (
    <section id="testimonials" className="s-blush"><div className="wrap"><Title eyebrow="Client experience" title="What Our Clients Say" sub="Real stories. Lasting partnerships." /><div className="testimonial card"><div><span className="quote">“</span><p>ePub helped us transform our content into a beautiful digital experience. The team is professional, creative and always supportive.</p><em>— Global Publishing House</em><div className="stars">★★★★★</div></div><BookImage book={BOOKS[0]} /></div></div></section>
  )
}

/* CAREERS DATA */
const PERKS = [
  ['leaf', 'Remote-friendly', 'Work from wherever you do your best work.'],
  ['heart', 'Health cover', 'Medical insurance for you and your family.'],
  ['bulb', 'Learning budget', 'Courses, books and conferences, on us.'],
  ['user', 'Real ownership', 'Ship features that thousands of readers use.'],
  ['chart', 'Growth path', 'Clear, honest paths from junior to lead.'],
  ['cloud', 'Flexible hours', 'Work the hours that fit your life.'],
]

const ROLES = [
  {
    title: 'Frontend Engineer (React)',
    dept: 'Engineering',
    location: 'Tamil Nadu, India / Remote',
    type: 'Full-time',
    blurb:
      'Build the reading experiences our clients ship to millions of readers — from our 3D book showcases to accessible, responsive publication layouts.',
  },
  {
    title: 'Backend Engineer (Java / Spring Boot)',
    dept: 'Engineering',
    location: 'Tamil Nadu, India / Remote',
    type: 'Full-time',
    blurb:
      'Design and scale the services behind our publishing and CRM platforms, from content pipelines to secure client dashboards.',
  },
  {
    title: 'ePub & Digital Publishing Specialist',
    dept: 'Production',
    location: 'Tamil Nadu, India',
    type: 'Full-time',
    blurb:
      'Turn raw manuscripts into accessible, standards-compliant ePub and XML content for publishers around the world.',
  },
  {
    title: 'UI/UX Designer',
    dept: 'Design',
    location: 'Remote',
    type: 'Contract',
    blurb:
      'Shape the visual language of our client sites and internal tools — editorial, warm and unmistakably JAA TECH.',
  },
]

function RoleCard({ role, index, open, onToggle, onApply }) {
  return (
    <Reveal d={index * 0.06}>
      <article className={`job-card ${open ? 'is-open' : ''}`}>
        <button
          type="button"
          className="job-card-head"
          aria-expanded={open}
          onClick={() => onToggle(index)}
        >
          <div>
            <h3>{role.title}</h3>
            <div className="job-meta">
              <span>{role.dept}</span>
              <span>{role.location}</span>
              <span>{role.type}</span>
            </div>
          </div>
          <span className="job-toggle" aria-hidden="true">
            {open ? '−' : '+'}
          </span>
        </button>

        {open && (
          <div className="job-card-body">
            <p>{role.blurb}</p>
            <button type="button" className="btn job-apply" onClick={() => onApply(role.title)}>
              <span>Apply for this role</span>
              <i>→</i>
            </button>
          </div>
        )}
      </article>
    </Reveal>
  )
}

/* CAREERS SECTION */
const OTHER_ROLE = 'Other / General Application'

export function Careers() {
  const [openIndex, setOpenIndex] = useState(null)
  const [applyRole, setApplyRole] = useState(null)

  return (
    <section id="careers" className="careers-section s-blush">
      <div className="wrap">
        <Title
          eyebrow="Careers at JAA TECH"
          title="Help us build a brighter future for reading."
          sub="We're a small, focused team turning manuscripts and business ideas into beautiful, accessible digital experiences. If you care about craft, we'd love to hear from you."
        />

        <div className="perks-grid">
          {PERKS.map(([icon, title, text], i) => (
            <Reveal key={title} d={i * 0.06}>
              <div className="mini-card perk-card">
                <span className="ic"><Icon n={icon} /></span>
                <div>
                  <b>{title}</b>
                  <span>{text}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="wrap careers-jobs-wrap">
        <Title
          eyebrow="Open positions"
          title="Current openings"
          sub="Don't see a fit? Reach out anyway — we're always glad to meet good people."
        />

        <div className="jobs-list">
          {ROLES.map((role, i) => (
            <RoleCard
              key={role.title}
              role={role}
              index={i}
              open={openIndex === i}
              onToggle={(idx) => setOpenIndex((cur) => (cur === idx ? null : idx))}
              onApply={setApplyRole}
            />
          ))}
        </div>

        <Reveal d={0.1}>
          <div className="careers-cta-inline">
            <p>Don't see your role listed? We're always open to meeting people who love this craft.</p>
            <button type="button" className="btn ghost" onClick={() => setApplyRole(OTHER_ROLE)}>
              <span>Send your profile</span>
              <i>→</i>
            </button>
          </div>
        </Reveal>
      </div>

      {applyRole && (
        <ApplyModal
          role={applyRole}
          roles={[...ROLES.map((r) => r.title), OTHER_ROLE]}
          onClose={() => setApplyRole(null)}
        />
      )}
    </section>
  )
}

export function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | sent
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in your name, email and a short message.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.phone.trim() && !/^\+?\d{10,14}$/.test(form.phone.replace(/[\s-]/g, ""))) {
      setError("Please enter a valid phone number or leave it blank.");
      return;
    }

    setError("");
    openWhatsApp(
      formatWhatsAppMessage("New Website Enquiry", [
        ["Name", form.name],
        ["Email", form.email],
        ["Phone", form.phone],
        ["Company", form.company],
        ["Project Details", form.message],
      ])
    );
    setStatus("sent");
    setForm({ name: "", email: "", phone: "", company: "", message: "" });
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        {/* LEFT CONTENT */}
        <div className="contact-info">
          <span className="contact-eyebrow">GET IN TOUCH</span>

          <h2>
            Let’s create something
            <span> meaningful together.</span>
          </h2>

         

          <div className="contact-line" />

          <div className="contact-details">
            <div className="contact-detail">
              <div className="contact-icon"><FaEnvelope /></div>
              <div>
                <small>Email</small>
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </div>
            </div>

            <div className="contact-detail">
              <div className="contact-icon"><FaPhoneAlt /></div>
              <div>
                <small>Phone</small>
                <a href={`tel:${SITE.phoneTel}`}>{SITE.phoneDisplay}</a>
              </div>
            </div>

            <div className="contact-detail">
              <div className="contact-icon"><FaWhatsapp /></div>
              <div>
                <small>WhatsApp</small>
                <a href={SITE.whatsappLink} target="_blank" rel="noopener noreferrer">
                  {SITE.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="contact-detail">
              <div className="contact-icon"><FaMapMarkerAlt /></div>
              <div>
                <small>Address</small>
                <a href={SITE.mapLink} target="_blank" rel="noopener noreferrer">
                 
                  {SITE.addressLines.map((l, i) => (
                    <span key={i}>{l}{i < SITE.addressLines.length - 1 && <br />}</span>
                  ))}
                </a>
              </div>
            </div>
          </div>

   
        </div>

        {/* RIGHT FORM */}
        <div className="contact-card">
          <div className="contact-card-header">
            <h3>Start a conversation</h3>
            <p>Tell us a little about your project. It opens in WhatsApp, ready to send.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {status === "sent" && (
              <div className="contact-alert contact-alert-success" role="status">
                WhatsApp has opened with your message. Press Send there and we'll get back to you soon.
              </div>
            )}

            {error && (
              <div className="contact-alert contact-alert-error" role="alert">
                {error}
              </div>
            )}

            <div className="contact-form-row">
              <div className="contact-field">
                <label htmlFor="name">Your Name</label>
                <input id="name" name="name" type="text" placeholder="Enter your name" autoComplete="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="contact-field">
                <label htmlFor="email">Email Address</label>
                <input id="email" name="email" type="email" placeholder="Enter your email" autoComplete="email" value={form.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="contact-form-row">
              <div className="contact-field">
                <label htmlFor="phone">Phone Number</label>
                <input id="phone" name="phone" type="tel" inputMode="tel" placeholder="Optional" autoComplete="tel" value={form.phone} onChange={handleChange} />
              </div>
              <div className="contact-field">
                <label htmlFor="company">Company / Organization</label>
                <input id="company" name="company" type="text" placeholder="Enter company name" value={form.company} onChange={handleChange} />
              </div>
            </div>

            <div className="contact-field">
              <label htmlFor="message">Tell us about your project</label>
              <textarea id="message" name="message" rows="5" placeholder="Tell us about your publishing project..." value={form.message} onChange={handleChange} required />
            </div>

            <button type="submit" className="contact-submit">
              <span><FaWhatsapp /> Send via WhatsApp</span>
              <span className="contact-arrow">→</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}


export function Footer() {
  return (
    <footer className="foot">

      <div className="footer-main">

        {/* BRAND */}
        <div className="footer-brand">
          <img
            className="foot-logo"
            src="/assets/jaa-tech-logo.png"
            alt="JAA TECH Private Limited"
          />

          <p className="footer-description">
            Transforming ideas into engaging
            <br />
            <span>digital publishing experiences.</span>
          </p>

          <div className="footer-line" />

          <div className="soc">
            <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" aria-label="JAA TECH on LinkedIn"><FaLinkedinIn /></a>
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label="JAA TECH on Instagram"><FaInstagram /></a>
            <a href={SITE.whatsappLink} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"><FaWhatsapp /></a>
            <a href={`mailto:${SITE.email}`} aria-label="Email JAA TECH"><FaEnvelope /></a>
          </div>
        </div>


        {/* DIVIDER */}
        <div className="footer-divider" />


        {/* NAVIGATION */}
       <div className="footer-links">
  <h4>EXPLORE</h4>

  <nav className="footer-nav" aria-label="Footer navigation">
    <a href="#home">Home</a>
    <a href="#about">About</a>
    <a href="#services">Services</a>
    <a href="#careers">Careers</a>
    <a href="#contact">Contact</a>
  </nav>

</div>


        {/* DECORATIVE BOOK */}
        <div className="footer-visual">
          <div className="footer-glow" />

          <div className="footer-book">
            <span />
            <span />
            <span />
          </div>

          <div className="footer-pixels">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>

      </div>


      {/* COPYRIGHT */}
      <div className="footer-bottom">
        <p>
          © 2026 JAA TECH PRIVATE LIMITED. All rights reserved.
        </p>
      </div>

    </footer>
  );
}
