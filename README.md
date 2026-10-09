# JAA TECH Website

## Run
npm install
npm run dev        # local dev server
npm run build      # production build -> dist/
npm run preview    # preview the build

## Journey section (3D scroll book)
- src/sections/JourneyBook.jsx      main component (React Three Fiber + GSAP ScrollTrigger)
- src/sections/journeyTextures.js   book cover, pages and prop textures
- src/sections/JourneyBook.css      styles
Scroll length: change the `window.innerHeight * 9` in JourneyBook.jsx (desktop) / 7.5 (mobile).
