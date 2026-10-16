import type { ClipboardData, Selection } from "../types/pixel-editor";

interface DrawPixelEditorCanvasOptions {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  imageData: ImageData;
  offset: { x: number; y: number };
  zoom: number;
  showGrid: boolean;
  selection: Selection | null;
  isPasting: boolean;
  pastePosition: { x: number; y: number } | null;
  clipboard: ClipboardData | null;
}

export function drawPixelEditorCanvas({
  ctx,
  canvas,
  imageData,
  offset,
  zoom,
  showGrid,
  selection,
  isPasting,
  pastePosition,
  clipboard,
}: DrawPixelEditorCanvasOptions) {
  const { width, height } = imageData;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext("2d");
  if (!tempCtx) return;

  tempCtx.putImageData(imageData, 0, 0);

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    tempCanvas,
    0,
    0,
    width,
    height,
    offset.x,
    offset.y,
    width * zoom,
    height * zoom,
  );

  if (isPasting && pastePosition && clipboard) {
    ctx.globalAlpha = 0.7;

    const clipTempCanvas = document.createElement("canvas");
    clipTempCanvas.width = clipboard.width;
    clipTempCanvas.height = clipboard.height;
    const clipTempCtx = clipTempCanvas.getContext("2d");
    if (clipTempCtx) {
      clipTempCtx.putImageData(clipboard.imageData, 0, 0);
      ctx.drawImage(
        clipTempCanvas,
        0,
        0,
        clipboard.width,
        clipboard.height,
        offset.x + pastePosition.x * zoom,
        offset.y + pastePosition.y * zoom,
        clipboard.width * zoom,
        clipboard.height * zoom,
      );
    }

    ctx.globalAlpha = 1;
  }

  if (showGrid && zoom >= 4) {
    ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
    ctx.lineWidth = 1;

    for (let x = 0; x <= width; x++) {
      ctx.beginPath();
      ctx.moveTo(offset.x + x * zoom, offset.y);
      ctx.lineTo(offset.x + x * zoom, offset.y + height * zoom);
      ctx.stroke();
    }

    for (let y = 0; y <= height; y++) {
      ctx.beginPath();
      ctx.moveTo(offset.x, offset.y + y * zoom);
      ctx.lineTo(offset.x + width * zoom, offset.y + y * zoom);
      ctx.stroke();
    }
  }

  if (selection && !isPasting) {
    const minX = Math.min(selection.startX, selection.endX);
    const minY = Math.min(selection.startY, selection.endY);
    const maxX = Math.max(selection.startX, selection.endX);
    const maxY = Math.max(selection.startY, selection.endY);

    ctx.strokeStyle = "#00aaff";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(
      offset.x + minX * zoom,
      offset.y + minY * zoom,
      (maxX - minX + 1) * zoom,
      (maxY - minY + 1) * zoom,
    );
    ctx.setLineDash([]);
  }
}
