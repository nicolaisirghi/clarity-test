## Microsoft Clarity + iframe `Text` issue repro

This project is a minimal reproduction of a bug where **Microsoft Clarity**, when enabled on the outer window, appears to interfere with `instanceof Text` checks inside a same‑origin `iframe`. In a real application (e.g. React + QuillJS editor hosted in an iframe), this can cause logic that relies on `node instanceof Text` to fail and break rich‑text behavior.

The app renders:

- A toggle to enable Clarity at runtime.
- A same‑origin `iframe` whose `srcDoc` contains a simple `Hello, world!` document.

When Clarity is enabled from the outer React app, DevTools operations performed inside the iframe can lead to `node instanceof Text` returning `false` in the iframe’s own console, even though the node is visually a normal text node.

There is also an accompanying video (to be added) that visually demonstrates the DevTools steps described below.

## Setup

- **Install dependencies**

  ```bash
  npm install
  ```

- **Configure Clarity project id**

  Create a `.env` file in the project root:

  ```bash
  echo "VITE_CLARITY_PROJECT_ID=<your-clarity-project-id>" > .env
  ```

  Replace `<your-clarity-project-id>` with a real Microsoft Clarity project id.

- **Start the dev server**

  ```bash
  npm run dev
  ```

  By default the app runs on `http://localhost:5173/`.

## How to reproduce the bug using DevTools

1. **Open the app**
   - Navigate your browser to `http://localhost:5173/`.

2. **Enable Clarity**
   - Click the `Enable Clarity` button rendered by the React app.
   - The text above the iframe should change to `Clarity enabled`.

3. **Open DevTools for the iframe**
   - Open browser DevTools.
   - In the *Elements* panel, locate the `iframe` (its `name` is `iframe-1`).
   - Right‑click the iframe and choose an option that lets you **inspect its contents** (e.g. “Open in new tab” or switch the Console context to that frame via the console’s context dropdown).
   - Make sure the **Console context is the iframe document**, not the top‑level page.

4. **Use “Edit as HTML” to modify the iframe body**
   - In the iframe’s Elements tree, right‑click the `<body>` inside the iframe document.
   - Choose **“Edit as HTML”**.
   - Add a new element with some text, e.g.:

     ```html
     <p id="test">Test text</p>
     ```

   - Commit the change so the new element appears in the iframe.

5. **Run `instanceof Text` checks in the iframe console**
   - With the iframe still selected as the console context, run:

     ```js
     const p = document.getElementById('test');
     const t = p.firstChild;
     t instanceof Text;
     ```

   - **Observed behavior (with Clarity enabled)**: this may return `false`, even though `t` is clearly a text node inside the iframe document.

6. **Compare behavior with Clarity disabled**
   - Reload the page, but **do not** click `Enable Clarity`.
   - Repeat steps 3–5 (create `<p id="test">Test text</p>` via “Edit as HTML” and run the same console code).
   - **Observed behavior (with Clarity disabled)**: `t instanceof Text` now returns `true`.

This difference illustrates the problematic interaction: **when Clarity is enabled on the outer page, DevTools “Edit as HTML” operations inside the iframe can produce text nodes for which `instanceof Text` in the iframe context unexpectedly returns `false`.**

In richer applications (e.g. QuillJS inside an iframe), logic that depends on `node instanceof Text` can then misclassify real text nodes and break editor behavior.
