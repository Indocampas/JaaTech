import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './Navbar.css';

const LINKS = [
  'Home',
  'About',
  'Services',
  'Technology',
  'Careers',
  'Contact',
];

export default function Navbar() {
  const [on, setOn] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('Home');

  // Scroll detection and active section highlighting
  useEffect(() => {
    const handleScroll = () => {
      setOn(window.scrollY > 40);

      // Stay in sync with the CSS anchor offset (navbar height) plus a small buffer.
      const offset =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            '--nav-offset'
          )
        ) || 92;
      const clear = offset + 40;

      let current = 'Home';

      LINKS.forEach((link) => {
        const section = document.getElementById(
          link.toLowerCase()
        );

        if (section && section.getBoundingClientRect().top <= clear) {
          current = link;
        }
      });

      setActive(current);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    window.addEventListener('resize', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Close with Escape, lock background scrolling,
  // and close the menu when switching to desktop width.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth > 950) {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [open]);

  const handleNavClick = (link) => {
    setActive(link);
    setOpen(false);
  };

  return (
    <header className={`nav ${on || open ? 'on' : ''}`}>
      {/* LOGO */}
      
{/* LOGO */}
<a
  href="#home"
  className="nav-logo"
  aria-label="JAA TECH home"
  onClick={() => handleNavClick('Home')}
>
  <img
    className="nav-logo-image"
    src="/assets/jaa-tech-logo.png"
    alt="JAA TECH Logo"
  />
</a>


      {/* DESKTOP NAVIGATION */}
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
          <span className="cta-arrow" aria-hidden="true">
            →
          </span>
        </a>
      </div>

   
{/* MOBILE MENU TOGGLE */}
<button
  type="button"
  className={`burger ${open ? 'open' : ''}`}
  aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
  aria-expanded={open}
  aria-controls="mobile-navigation"
  onClick={() => setOpen((previous) => !previous)}
>
  <svg
    className="burger-icon"
    viewBox="0 0 24 24"
    width="26"
    height="26"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {open ? (
      <>
        <path d="M6 6L18 18" />
        <path d="M18 6L6 18" />
      </>
    ) : (
      <>
        <path d="M4 7H20" />
        <path d="M4 12H20" />
        <path d="M4 17H20" />
      </>
    )}
  </svg>
</button>


      {/* MOBILE NAVIGATION */}
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-navigation"
            className="menu"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {LINKS.map((link) => (
              <a
                key={link}
                className={active === link ? 'mobile-active' : ''}
                href={`#${link.toLowerCase()}`}
                aria-current={active === link ? 'page' : undefined}
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
                <span className="cta-arrow" aria-hidden="true">
                  →
                </span>
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
