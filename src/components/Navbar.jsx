import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './Navbar.css';

//import logo from '../assets/jaa-logo-tech.png';

const LINKS = [
  'Home',
  'About',
  'Services',
  'Technology',
  'Accessibility',
  'Careers',
  'Contact',
];

export default function Navbar() {
  const [on, setOn] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('Home');

  useEffect(() => {
    const handleScroll = () => {
      setOn(window.scrollY > 40);

      const sections = LINKS.map((link) =>
        document.getElementById(link.toLowerCase())
      ).filter(Boolean);

      let current = 'Home';

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();

        // Anchor lands the section just below the fixed nav (see
        // globals.css --nav-clear / section scroll-margin-top), so use the
        // same clearance here to keep the highlighted link in sync.
        const clear = window.innerWidth <= 520 ? 100 : window.innerWidth <= 950 ? 120 : 190;

        if (rect.top <= clear) {
          current = section.id;
        }
      });

      setActive(
        current.charAt(0).toUpperCase() + current.slice(1)
      );
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, {
      passive: true
    });

    window.addEventListener('resize', handleScroll, {
      passive: true
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleNavClick = (link) => {
    setActive(link);
    setOpen(false);
  };

  return (
    <header className={`nav ${on || open ? 'on' : ''}`}>

      {/* LOGO */}
      <a
        href="#home"
        className="nav-logo"
        aria-label="JAA TECH home"
        onClick={() => handleNavClick('Home')}
      >
        <img
          src="/assets/jaa-tech-logo.png"
          alt="JAA TECH"
        />
      </a>

      {/* DESKTOP NAV */}
      <ul className="nav-links">
        {LINKS.map((link) => (
          <li key={link}>
            <a
              className={`l ${active === link ? 'active' : ''}`}
              href={`#${link.toLowerCase()}`}
              onClick={() => handleNavClick(link)}
            >
              {link}
            </a>
          </li>
        ))}
      </ul>

      {/* DESKTOP CTA */}
      <div className="nav-cta">
        <a
          href="#contact"
          className="project-btn"
          onClick={() => handleNavClick('Contact')}
        >
          <span>Start a Project</span>
          <span className="cta-arrow">→</span>
        </a>
      </div>

      {/* BURGER */}
      <button
        className={`burger ${open ? 'open' : ''}`}
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span />
        <span />
        <span />
      </button>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.nav
            className="menu"
            initial={{
              opacity: 0,
              y: -20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              y: -20
            }}
            transition={{
              duration: 0.25,
              ease: 'easeOut'
            }}
          >
            {LINKS.map((link) => (
              <a
                key={link}
                className={
                  active === link ? 'mobile-active' : ''
                }
                href={`#${link.toLowerCase()}`}
                onClick={() => handleNavClick(link)}
              >
                {link}
              </a>
            ))}

            <div className="mobile-cta">
              <a
                href="#contact"
                className="project-btn mobile-project-btn"
                onClick={() => handleNavClick('Contact')}
              >
                <span>Start a Project</span>
                <span className="cta-arrow">→</span>
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

    </header>
  );
}
