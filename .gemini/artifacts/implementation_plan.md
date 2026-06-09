# Landing Page Performance Optimization

Based on a thorough analysis of the newly added landing page (`src/app/page.tsx`) and `globals.css`, several critical performance bottlenecks have been identified. The landing page is currently suffering from a massive client-side JavaScript payload, unoptimized heavy background images, and inefficient script loading/animation handling. 

Here is the proposed plan to resolve these issues according to Next.js best practices without altering the design or functionality.

## Proposed Changes

### 1. Rendering Strategy (Server Component Conversion)
Currently, the entire 1,500+ line `page.tsx` has `"use client";` at the top. This forces Next.js to ship the entire massive DOM structure as a Client Component, forcing the browser to parse, execute, and hydrate the entire tree, severely hurting Time to Interactive (TTI).
- **Fix**: Remove `"use client";` from `page.tsx` to turn the massive static HTML structure into a **Server Component**. 

### 2. Isolate Animation Logic (Code Splitting)
To keep the GSAP/Lenis animations working while making the main page a Server Component, we need to extract the client-side logic.
- **Fix**: Create a new file `src/components/ClientAnimator.tsx` (a Client Component). Move the Next.js `<Script>` tags and the `useEffect` animation initialization into this tiny component. 
- **Fix**: Import and drop `<ClientAnimator />` anywhere inside `page.tsx`. Because GSAP manipulates the DOM directly via classes (e.g., `.scroller`, `.book`), it will still seamlessly animate the Server Component's output.

### 3. Script Loading Optimization
The current animation hook uses a heavy `setTimeout(initAnimation, 100)` polling loop that constantly checks if `window.gsap` is available, burning CPU cycles during initial load.
- **Fix**: Utilize the `onReady` callback provided by the Next.js `<Script>` component to trigger the `initAnimation` function cleanly and exactly when the libraries are ready, removing the busy-wait loop.

### 4. Image Optimization
The landing page relies on 5 large background images (e.g., `mplgalaa-Gradiente-Suave.jpg`) loaded via CSS `url()` in `globals.css`. Next.js *cannot* optimize images loaded directly in CSS. The browser downloads the massive, unoptimized original files, crippling your Largest Contentful Paint (LCP) score.
- **Fix**: Remove the `background-image` declarations from `globals.css`.
- **Fix**: Inside `page.tsx`, insert `next/image` components with `src`, `fill`, `alt=""`, and `style={{ objectFit: 'cover' }}` in the background layers. Add the `priority` prop to above-the-fold images to preload them instantly.

### 5. Animation Event Efficiency
The `mousemove` parallax effect creates a brand new `gsap.to()` tween for every single pixel the mouse moves. This creates massive garbage collection overhead and can cause visual stuttering on lower-end devices.
- **Fix**: Upgrade the mousemove handler to use GSAP's `gsap.quickTo()`. This is GSAP's dedicated method for high-frequency updates (like cursor tracking), bypassing standard tween creation and drastically reducing CPU usage.

---

### Component Overview

#### [MODIFY] `src/app/page.tsx`
- Remove `"use client";`.
- Add `import Image from 'next/image';`.
- Add `import ClientAnimator from '@/components/ClientAnimator';`.
- Replace CSS background `div`s with optimized `<Image>` components.
- Include `<ClientAnimator />` in the tree.

#### [NEW] `src/components/ClientAnimator.tsx`
- Client Component containing the `<Script>` tags for GSAP, ScrollTrigger, and Lenis.
- Contains the optimized `useEffect` utilizing `gsap.quickTo` and `onReady` callbacks.

#### [MODIFY] `src/app/globals.css`
- Remove `background-image` rules from `.bg-layer-dark`, `.bg-layer-light`, `.cover-texture`, `.page-background-p1`, and `.page-background-p2`.

## Verification Plan

### Automated/Build Verification
- Verify the build succeeds with the new `next/image` imports.
- Confirm that Webpack bundles for the client are significantly smaller by checking the build output size for `/`.

### Manual Verification
- Test that the GSAP and ScrollTrigger animations still function exactly as before.
- Test that the mousemove parallax effect is buttery smooth.
- Confirm images load properly and are optimized by checking the Network tab for WebP/AVIF formats instead of raw `.jpg` files.
