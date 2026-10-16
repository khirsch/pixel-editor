import { useEffect } from "react";
import { PixelEditor } from "./components/PixelEditor";
import { createDefaultImage } from "./utils/default-image";

export default function App() {
  useEffect(() => {
    // Set favicon to our little Mac friend
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      const imageData = createDefaultImage();
      ctx.putImageData(imageData, 0, 0);

      // Remove existing favicons
      const existingLinks = document.querySelectorAll("link[rel*='icon']");
      existingLinks.forEach((link) => link.remove());

      // Add new favicon
      const link = document.createElement("link");
      link.type = "image/x-icon";
      link.rel = "shortcut icon";
      link.href = canvas.toDataURL("image/png");
      document.head.appendChild(link);

      // Also add as icon rel for better browser support
      const link2 = document.createElement("link");
      link2.type = "image/png";
      link2.rel = "icon";
      link2.href = canvas.toDataURL("image/png");
      document.head.appendChild(link2);

      // Create a larger image for Open Graph
      const ogCanvas = document.createElement("canvas");
      ogCanvas.width = 1200;
      ogCanvas.height = 630;
      const ogCtx = ogCanvas.getContext("2d");

      if (ogCtx) {
        // Fill background with retro gray
        ogCtx.fillStyle = "#c0c0c0";
        ogCtx.fillRect(0, 0, 1200, 630);

        // Draw the pixel art in the center, scaled up
        ogCtx.imageSmoothingEnabled = false;
        ogCtx.drawImage(canvas, 450, 200, 300, 300);

        const ogImageUrl = ogCanvas.toDataURL("image/png");

        // Remove existing meta tags
        const existingMetas = document.querySelectorAll(
          "meta[property^='og:']",
        );
        existingMetas.forEach((meta) => meta.remove());
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <PixelEditor />
    </div>
  );
}
