# Pixel Editor

A small browser-based pixel art editor with a retro MacPaint-inspired interface. Draw directly on the canvas, edit existing images, and export your work as a PNG.

## Features

- Draw and erase with an adjustable brush and color picker.
- Select regions and cut, copy, or paste them elsewhere on the canvas.
- Pick a color from the canvas with the eyedropper.
- Undo and redo edits.
- Toggle the pixel grid, pan around the canvas, and zoom in or out.
- Upload an image to edit, reset to the default artwork, or download the result as a PNG.
- Use the responsive toolbar on desktop and mobile.

## Getting Started

Install dependencies:

```sh
npm install
```

Start the local development server:

```sh
npm run dev
```

Vite prints the local URL in the terminal. Open that URL in a browser to use the editor.

## Production Build

Build the app for production:

```sh
npm run build
```

The generated site is written to `dist/`.

## Keyboard Shortcuts

| Shortcut                             | Action                              |
| ------------------------------------ | ----------------------------------- |
| `Ctrl/Cmd + Z`                       | Undo                                |
| `Ctrl/Cmd + Shift + Z` or `Ctrl + Y` | Redo                                |
| `Ctrl/Cmd + X`                       | Cut selection                       |
| `Ctrl/Cmd + C`                       | Copy selection                      |
| `Ctrl/Cmd + V`                       | Paste; click to place               |
| `Space` (hold)                       | Pan the canvas                      |
| `Escape`                             | Cancel a selection or pending paste |
| `H`                                  | Open help                           |

You can also zoom with the mouse wheel and use the on-screen controls to fit the canvas to view.
