import { useRef, useState, useEffect, useCallback } from 'react';
import { Tool, ClipboardData, Selection } from '../types/pixel-editor';
import { hexToRgb, rgbToHex, cloneImageData } from '../utils/pixel-utils';
import { createDefaultImage } from '../utils/default-image';
import { DesktopToolbar } from './DesktopToolbar';
import { MobileToolbar } from './MobileToolbar';
import { ZoomControls } from './ZoomControls';
import { HelpModal } from './HelpModal';

export function PixelEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [currentTool, setCurrentTool] = useState<Tool>('pan');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [brushSize, setBrushSize] = useState(1);
  const imageDataRef = useRef<ImageData | null>(null);
  const [, setRenderTrigger] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [lastPanPos, setLastPanPos] = useState({ x: 0, y: 0 });
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const originalImageRef = useRef<HTMLImageElement | null>(null);
  
  // Touch/pinch zoom state
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);
  const [touchStartZoom, setTouchStartZoom] = useState<number>(1);
  const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null);
  const [touchIdentifier, setTouchIdentifier] = useState<number | null>(null);
  
  // Selection and clipboard state
  const [selection, setSelection] = useState<Selection | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [clipboard, setClipboard] = useState<ClipboardData | null>(null);
  const [pastePosition, setPastePosition] = useState<{ x: number; y: number } | null>(null);
  const [isPasting, setIsPasting] = useState(false);
  
  // History management
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isApplyingHistory = useRef(false);

  // Mobile toolbar state
  const [isMobileToolbarOpen, setIsMobileToolbarOpen] = useState(false);

  // Help modal state
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Move canvas to appropriate container based on screen size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth < 768; // md breakpoint
    const containerId = isMobile ? 'mobile-canvas-container' : 'desktop-canvas-container';
    const container = document.getElementById(containerId);
    
    if (container && canvas.parentElement !== container) {
      canvas.className = 'w-full h-full cursor-crosshair touch-none';
      container.appendChild(canvas);
    }

    const handleResize = () => {
      const isMobileNow = window.innerWidth < 768;
      const newContainerId = isMobileNow ? 'mobile-canvas-container' : 'desktop-canvas-container';
      const newContainer = document.getElementById(newContainerId);
      
      if (newContainer && canvas.parentElement !== newContainer) {
        canvas.className = 'w-full h-full cursor-crosshair touch-none';
        newContainer.appendChild(canvas);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Create default image on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return;

    const data = createDefaultImage();
    imageDataRef.current = data;
    
    // Initialize history with the first state
    setHistory([cloneImageData(data)]);
    setHistoryIndex(0);
    setCtx(context);
    
    // Fit image to view on page load
    const paddingFactor = 0.9;
    const zoomX = (canvas.width * paddingFactor) / data.width;
    const zoomY = (canvas.height * paddingFactor) / data.height;
    const newZoom = Math.min(zoomX, zoomY);
    
    setZoom(newZoom);
    setOffset({
      x: (canvas.width - data.width * newZoom) / 2,
      y: (canvas.height - data.height * newZoom) / 2
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') || (e.ctrlKey && e.key === 'y')) {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'x') {
        e.preventDefault();
        handleCut();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        handleCopy();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        handlePaste();
      } else if (e.key === 'Escape') {
        setSelection(null);
        setIsPasting(false);
        setPastePosition(null);
        redrawCanvas();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsSpacePressed(true);
        setCurrentTool('pan');
      } else if (e.key === 'h') {
        e.preventDefault();
        setIsHelpOpen(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        setIsSpacePressed(false);
        if (!isPanning) {
          setCurrentTool('draw');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [historyIndex, history, selection, clipboard]);

  // Draw the canvas
  const redrawCanvas = useCallback(() => {
    if (!ctx || !imageDataRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const imageData = imageDataRef.current;
    const width = imageData.width;
    const height = imageData.height;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;
    
    tempCtx.putImageData(imageData, 0, 0);
    
    // Draw the scaled image
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      tempCanvas,
      0, 0, width, height,
      offset.x, offset.y, width * zoom, height * zoom
    );

    // Draw paste preview
    if (isPasting && pastePosition && clipboard) {
      ctx.globalAlpha = 0.7;
      
      const clipTempCanvas = document.createElement('canvas');
      clipTempCanvas.width = clipboard.width;
      clipTempCanvas.height = clipboard.height;
      const clipTempCtx = clipTempCanvas.getContext('2d');
      if (clipTempCtx) {
        clipTempCtx.putImageData(clipboard.imageData, 0, 0);
        ctx.drawImage(
          clipTempCanvas,
          0, 0, clipboard.width, clipboard.height,
          offset.x + pastePosition.x * zoom,
          offset.y + pastePosition.y * zoom,
          clipboard.width * zoom,
          clipboard.height * zoom
        );
      }
      
      ctx.globalAlpha = 1;
    }

    // Draw grid
    if (showGrid && zoom >= 4) {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
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

    // Draw selection rectangle
    if (selection && !isPasting) {
      const minX = Math.min(selection.startX, selection.endX);
      const minY = Math.min(selection.startY, selection.endY);
      const maxX = Math.max(selection.startX, selection.endX);
      const maxY = Math.max(selection.startY, selection.endY);

      ctx.strokeStyle = '#00aaff';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(
        offset.x + minX * zoom,
        offset.y + minY * zoom,
        (maxX - minX + 1) * zoom,
        (maxY - minY + 1) * zoom
      );
      ctx.setLineDash([]);
    }
  }, [ctx, zoom, showGrid, offset, selection, isPasting, pastePosition, clipboard]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Wheel event for zoom
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheelEvent = (e: WheelEvent) => {
      e.preventDefault();
      
      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
      const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
      const imageX = (mouseX - offset.x) / zoom;
      const imageY = (mouseY - offset.y) / zoom;
      
      let delta = 0;
      if (e.deltaY < 0) {
        if (zoom < 1) delta = 0.1;
        else if (zoom < 4) delta = 0.5;
        else delta = 1;
      } else {
        if (zoom <= 1) delta = -0.1;
        else if (zoom <= 4) delta = -0.5;
        else delta = -1;
      }
      
      const newZoom = Math.max(0.1, Math.min(64, zoom + delta));
      
      if (newZoom !== zoom) {
        const newOffset = {
          x: mouseX - imageX * newZoom,
          y: mouseY - imageY * newZoom
        };
        
        setZoom(newZoom);
        setOffset(newOffset);
      }
    };

    canvas.addEventListener('wheel', handleWheelEvent, { passive: false });
    
    return () => {
      canvas.removeEventListener('wheel', handleWheelEvent);
    };
  }, [zoom, offset]);

  const getPixelCoords = (clientX: number, clientY: number) => {
    if (!canvasRef.current || !imageDataRef.current) return null;

    const rect = canvasRef.current.getBoundingClientRect();
    const canvasX = (clientX - rect.left) * (canvasRef.current.width / rect.width);
    const canvasY = (clientY - rect.top) * (canvasRef.current.height / rect.height);

    const pixelX = Math.floor((canvasX - offset.x) / zoom);
    const pixelY = Math.floor((canvasY - offset.y) / zoom);

    if (pixelX < 0 || pixelX >= imageDataRef.current.width || pixelY < 0 || pixelY >= imageDataRef.current.height) {
      return null;
    }

    return { x: pixelX, y: pixelY };
  };

  const setPixelDirect = (x: number, y: number, color: string) => {
    if (!imageDataRef.current || !ctx) return;

    const imageData = imageDataRef.current;
    const halfBrush = Math.floor(brushSize / 2);
    
    for (let dy = -halfBrush; dy < halfBrush + (brushSize % 2); dy++) {
      for (let dx = -halfBrush; dx < halfBrush + (brushSize % 2); dx++) {
        const px = x + dx;
        const py = y + dy;
        
        if (px < 0 || px >= imageData.width || py < 0 || py >= imageData.height) continue;
        
        const index = (py * imageData.width + px) * 4;

        if (color === 'erase') {
          imageData.data[index] = 0;
          imageData.data[index + 1] = 0;
          imageData.data[index + 2] = 0;
          imageData.data[index + 3] = 0;
        } else {
          const rgb = hexToRgb(color);
          if (rgb) {
            imageData.data[index] = rgb.r;
            imageData.data[index + 1] = rgb.g;
            imageData.data[index + 2] = rgb.b;
            imageData.data[index + 3] = 255;
          }
        }
      }
    }
    
    redrawCanvas();
  };

  const getPixelColor = (x: number, y: number): string => {
    if (!imageDataRef.current) return '#000000';

    const imageData = imageDataRef.current;
    const index = (y * imageData.width + x) * 4;
    const r = imageData.data[index];
    const g = imageData.data[index + 1];
    const b = imageData.data[index + 2];

    return rgbToHex(r, g, b);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getPixelCoords(e.clientX, e.clientY);

    if (isPasting && coords) {
      if (clipboard && pastePosition && imageDataRef.current) {
        const clipData = clipboard.imageData;
        const imageData = imageDataRef.current;
        
        for (let y = 0; y < clipboard.height; y++) {
          for (let x = 0; x < clipboard.width; x++) {
            const destX = pastePosition.x + x;
            const destY = pastePosition.y + y;
            
            if (destX >= 0 && destX < imageData.width && destY >= 0 && destY < imageData.height) {
              const srcIndex = (y * clipboard.width + x) * 4;
              const destIndex = (destY * imageData.width + destX) * 4;
              
              imageData.data[destIndex] = clipData.data[srcIndex];
              imageData.data[destIndex + 1] = clipData.data[srcIndex + 1];
              imageData.data[destIndex + 2] = clipData.data[srcIndex + 2];
              imageData.data[destIndex + 3] = clipData.data[srcIndex + 3];
            }
          }
        }

        if (!isApplyingHistory.current) {
          const currentIndex = historyIndex + 1;
          const newHistory = history.slice(0, currentIndex);
          newHistory.push(cloneImageData(imageDataRef.current));
          setHistory(newHistory);
          setHistoryIndex(currentIndex);
        }
      }
      
      setIsPasting(false);
      setPastePosition(null);
      redrawCanvas();
      return;
    }

    if (e.button === 1 || (e.button === 0 && isSpacePressed)) {
      e.preventDefault();
      setIsPanning(true);
      setLastPanPos({ x: e.clientX, y: e.clientY });
      return;
    }

    if (currentTool === 'pan' && e.button === 0) {
      setIsPanning(true);
      setLastPanPos({ x: e.clientX, y: e.clientY });
      return;
    }

    if (e.button !== 0) return;
    if (!coords) return;

    if (currentTool === 'select') {
      setIsSelecting(true);
      setSelection({
        startX: coords.x,
        startY: coords.y,
        endX: coords.x,
        endY: coords.y
      });
      return;
    }

    setIsDrawing(true);

    if (currentTool === 'draw') {
      setPixelDirect(coords.x, coords.y, currentColor);
    } else if (currentTool === 'erase') {
      setPixelDirect(coords.x, coords.y, 'erase');
    } else if (currentTool === 'eyedropper') {
      const color = getPixelColor(coords.x, coords.y);
      setCurrentColor(color);
      setCurrentTool('draw');
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getPixelCoords(e.clientX, e.clientY);

    if (isPasting && coords) {
      setPastePosition(coords);
      return;
    }

    if (isPanning) {
      const dx = e.clientX - lastPanPos.x;
      const dy = e.clientY - lastPanPos.y;
      setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setLastPanPos({ x: e.clientX, y: e.clientY });
      return;
    }

    if (isSelecting && coords && selection) {
      setSelection({
        ...selection,
        endX: coords.x,
        endY: coords.y
      });
      return;
    }

    if (!isDrawing) return;
    if (!coords) return;

    if (currentTool === 'draw') {
      setPixelDirect(coords.x, coords.y, currentColor);
    } else if (currentTool === 'erase') {
      setPixelDirect(coords.x, coords.y, 'erase');
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && imageDataRef.current && !isApplyingHistory.current) {
      const currentIndex = historyIndex + 1;
      const newHistory = history.slice(0, currentIndex);
      newHistory.push(cloneImageData(imageDataRef.current));
      setHistory(newHistory);
      setHistoryIndex(currentIndex);
    }
    
    setIsDrawing(false);
    setIsPanning(false);
    setIsSelecting(false);
  };

  const handleCut = () => {
    if (!selection || !imageDataRef.current) return;

    const minX = Math.min(selection.startX, selection.endX);
    const minY = Math.min(selection.startY, selection.endY);
    const maxX = Math.max(selection.startX, selection.endX);
    const maxY = Math.max(selection.startY, selection.endY);

    const width = maxX - minX + 1;
    const height = maxY - minY + 1;

    const clipboardCanvas = document.createElement('canvas');
    clipboardCanvas.width = width;
    clipboardCanvas.height = height;
    const clipCtx = clipboardCanvas.getContext('2d');
    if (!clipCtx) return;

    const imageData = imageDataRef.current;
    const clipImageData = clipCtx.createImageData(width, height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const srcIndex = ((minY + y) * imageData.width + (minX + x)) * 4;
        const destIndex = (y * width + x) * 4;

        clipImageData.data[destIndex] = imageData.data[srcIndex];
        clipImageData.data[destIndex + 1] = imageData.data[srcIndex + 1];
        clipImageData.data[destIndex + 2] = imageData.data[srcIndex + 2];
        clipImageData.data[destIndex + 3] = imageData.data[srcIndex + 3];

        imageData.data[srcIndex] = 0;
        imageData.data[srcIndex + 1] = 0;
        imageData.data[srcIndex + 2] = 0;
        imageData.data[srcIndex + 3] = 0;
      }
    }

    setClipboard({ imageData: clipImageData, width, height });
    
    if (!isApplyingHistory.current) {
      const currentIndex = historyIndex + 1;
      const newHistory = history.slice(0, currentIndex);
      newHistory.push(cloneImageData(imageDataRef.current));
      setHistory(newHistory);
      setHistoryIndex(currentIndex);
    }

    setSelection(null);
    redrawCanvas();
  };

  const handleCopy = () => {
    if (!selection || !imageDataRef.current) return;

    const minX = Math.min(selection.startX, selection.endX);
    const minY = Math.min(selection.startY, selection.endY);
    const maxX = Math.max(selection.startX, selection.endX);
    const maxY = Math.max(selection.startY, selection.endY);

    const width = maxX - minX + 1;
    const height = maxY - minY + 1;

    const clipboardCanvas = document.createElement('canvas');
    clipboardCanvas.width = width;
    clipboardCanvas.height = height;
    const clipCtx = clipboardCanvas.getContext('2d');
    if (!clipCtx) return;

    const imageData = imageDataRef.current;
    const clipImageData = clipCtx.createImageData(width, height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const srcIndex = ((minY + y) * imageData.width + (minX + x)) * 4;
        const destIndex = (y * width + x) * 4;

        clipImageData.data[destIndex] = imageData.data[srcIndex];
        clipImageData.data[destIndex + 1] = imageData.data[srcIndex + 1];
        clipImageData.data[destIndex + 2] = imageData.data[srcIndex + 2];
        clipImageData.data[destIndex + 3] = imageData.data[srcIndex + 3];
      }
    }

    setClipboard({ imageData: clipImageData, width, height });
  };

  const handlePaste = () => {
    if (!clipboard) return;

    setIsPasting(true);
    setSelection(null);
    
    if (canvasRef.current && imageDataRef.current) {
      setPastePosition({
        x: Math.floor((canvasRef.current.width / 2 - offset.x) / zoom - clipboard.width / 2),
        y: Math.floor((canvasRef.current.height / 2 - offset.y) / zoom - clipboard.height / 2)
      });
    }
    
    redrawCanvas();
  };

  const handleZoomIn = () => {
    setZoom(prev => {
      if (prev < 1) return Math.min(prev + 0.1, 64);
      if (prev < 4) return Math.min(prev + 0.5, 64);
      return Math.min(prev + 2, 64);
    });
  };

  const handleZoomOut = () => {
    setZoom(prev => {
      if (prev <= 1) return Math.max(prev - 0.1, 0.1);
      if (prev <= 4) return Math.max(prev - 0.5, 0.1);
      return Math.max(prev - 2, 0.1);
    });
  };

  const handleReset = () => {
    let data: ImageData;
    
    // If an image was uploaded, reset to that. Otherwise, reset to default.
    if (originalImageRef.current) {
      const img = originalImageRef.current;
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      tempCtx.drawImage(img, 0, 0);
      data = tempCtx.getImageData(0, 0, img.width, img.height);
    } else {
      data = createDefaultImage();
    }
    
    imageDataRef.current = data;
    
    setHistory([cloneImageData(data)]);
    setHistoryIndex(0);
    setZoom(1);
    
    if (canvasRef.current) {
      setOffset({
        x: (canvasRef.current.width - data.width * 1) / 2,
        y: (canvasRef.current.height - data.height * 1) / 2
      });
    }
    
    setSelection(null);
    setClipboard(null);
    setIsPasting(false);
    setPastePosition(null);
    setRenderTrigger(prev => prev + 1);
  };

  const handleFitToView = () => {
    if (!imageDataRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const img = imageDataRef.current;
    
    const paddingFactor = 0.9;
    const zoomX = (canvas.width * paddingFactor) / img.width;
    const zoomY = (canvas.height * paddingFactor) / img.height;
    const newZoom = Math.min(zoomX, zoomY);
    
    setZoom(newZoom);
    setOffset({
      x: (canvas.width - img.width * newZoom) / 2,
      y: (canvas.height - img.height * newZoom) / 2
    });
  };

  const handleDownload = () => {
    if (!imageDataRef.current) return;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = imageDataRef.current.width;
    tempCanvas.height = imageDataRef.current.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCtx.putImageData(imageDataRef.current, 0, 0);

    const link = document.createElement('a');
    link.download = 'pixel-art-cleaned.png';
    link.href = tempCanvas.toDataURL('image/png');
    
    // For better mobile compatibility, append to DOM before clicking
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        originalImageRef.current = img;
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;

        tempCtx.drawImage(img, 0, 0);
        const data = tempCtx.getImageData(0, 0, img.width, img.height);
        imageDataRef.current = data;
        
        setHistory([cloneImageData(data)]);
        setHistoryIndex(0);
        
        if (canvasRef.current) {
          setOffset({
            x: (canvasRef.current.width - img.width * zoom) / 2,
            y: (canvasRef.current.height - img.height * zoom) / 2
          });
        }
        
        setSelection(null);
        setClipboard(null);
        setIsPasting(false);
        setPastePosition(null);
        setRenderTrigger(prev => prev + 1);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    
    e.target.value = '';
  };

  const handleUndo = () => {
    if (historyIndex <= 0) return;
    isApplyingHistory.current = true;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    imageDataRef.current = cloneImageData(history[newIndex]);
    redrawCanvas();
    isApplyingHistory.current = false;
  };

  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return;
    isApplyingHistory.current = true;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    imageDataRef.current = cloneImageData(history[newIndex]);
    redrawCanvas();
    isApplyingHistory.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
      setLastTouchDistance(distance);
      setTouchStartZoom(zoom);
      setTouchStartPos({ x: (touch1.clientX + touch2.clientX) / 2, y: (touch1.clientY + touch2.clientY) / 2 });
      setTouchIdentifier(touch1.identifier);
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];
      setTouchIdentifier(touch.identifier);

      const coords = getPixelCoords(touch.clientX, touch.clientY);

      if (isPasting && coords) {
        if (clipboard && pastePosition && imageDataRef.current) {
          const clipData = clipboard.imageData;
          const imageData = imageDataRef.current;
          
          for (let y = 0; y < clipboard.height; y++) {
            for (let x = 0; x < clipboard.width; x++) {
              const destX = pastePosition.x + x;
              const destY = pastePosition.y + y;
              
              if (destX >= 0 && destX < imageData.width && destY >= 0 && destY < imageData.height) {
                const srcIndex = (y * clipboard.width + x) * 4;
                const destIndex = (destY * imageData.width + destX) * 4;
                
                imageData.data[destIndex] = clipData.data[srcIndex];
                imageData.data[destIndex + 1] = clipData.data[srcIndex + 1];
                imageData.data[destIndex + 2] = clipData.data[srcIndex + 2];
                imageData.data[destIndex + 3] = clipData.data[srcIndex + 3];
              }
            }
          }

          if (!isApplyingHistory.current) {
            const currentIndex = historyIndex + 1;
            const newHistory = history.slice(0, currentIndex);
            newHistory.push(cloneImageData(imageDataRef.current));
            setHistory(newHistory);
            setHistoryIndex(currentIndex);
          }
        }
        
        setIsPasting(false);
        setPastePosition(null);
        redrawCanvas();
        return;
      }

      if (currentTool === 'pan') {
        setIsPanning(true);
        setLastPanPos({ x: touch.clientX, y: touch.clientY });
        return;
      }

      if (!coords) return;

      if (currentTool === 'select') {
        setIsSelecting(true);
        setSelection({
          startX: coords.x,
          startY: coords.y,
          endX: coords.x,
          endY: coords.y
        });
      } else {
        setIsDrawing(true);
        if (currentTool === 'draw') {
          setPixelDirect(coords.x, coords.y, currentColor);
        } else if (currentTool === 'erase') {
          setPixelDirect(coords.x, coords.y, 'erase');
        } else if (currentTool === 'eyedropper') {
          const color = getPixelColor(coords.x, coords.y);
          setCurrentColor(color);
          setCurrentTool('draw');
        }
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
      
      if (lastTouchDistance !== null) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        
        const scale = distance / lastTouchDistance;
        const newZoom = Math.max(0.1, Math.min(64, touchStartZoom * scale));
        
        const centerX = ((touch1.clientX + touch2.clientX) / 2 - rect.left) * (canvasRef.current!.width / rect.width);
        const centerY = ((touch1.clientY + touch2.clientY) / 2 - rect.top) * (canvasRef.current!.height / rect.height);
        
        const imageX = (centerX - offset.x) / zoom;
        const imageY = (centerY - offset.y) / zoom;
        
        const newOffset = {
          x: centerX - imageX * newZoom,
          y: centerY - imageY * newZoom
        };
        
        setZoom(newZoom);
        setOffset(newOffset);
      }
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];
      
      if (currentTool === 'pan' && isPanning) {
        const dx = touch.clientX - lastPanPos.x;
        const dy = touch.clientY - lastPanPos.y;
        setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        setLastPanPos({ x: touch.clientX, y: touch.clientY });
      } else {
        const coords = getPixelCoords(touch.clientX, touch.clientY);
        
        if (isPasting && coords) {
          setPastePosition(coords);
          return;
        }

        if (isSelecting && coords && selection) {
          setSelection({
            ...selection,
            endX: coords.x,
            endY: coords.y
          });
          return;
        }

        if (!isDrawing) return;
        if (!coords) return;

        if (currentTool === 'draw') {
          setPixelDirect(coords.x, coords.y, currentColor);
        } else if (currentTool === 'erase') {
          setPixelDirect(coords.x, coords.y, 'erase');
        }
      }
    }
  };

  const handleTouchEnd = () => {
    setLastTouchDistance(null);
    setTouchStartPos(null);
    setTouchIdentifier(null);
    
    if (isDrawing && imageDataRef.current && !isApplyingHistory.current) {
      const currentIndex = historyIndex + 1;
      const newHistory = history.slice(0, currentIndex);
      newHistory.push(cloneImageData(imageDataRef.current));
      setHistory(newHistory);
      setHistoryIndex(currentIndex);
    }
    
    setIsDrawing(false);
    setIsPanning(false);
    setIsSelecting(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#c0c0c0]">
      <div className="h-full p-1" style={{
        backgroundImage: `repeating-conic-gradient(#000 0% 25%, #fff 0% 50%)`,
        backgroundSize: '8px 8px'
      }}>
        <div className="h-full bg-[#c0c0c0] p-2">
          {/* Desktop Layout */}
          <div className="hidden md:flex h-full gap-2">
            <DesktopToolbar
              currentTool={currentTool}
              setCurrentTool={setCurrentTool}
              showGrid={showGrid}
              setShowGrid={setShowGrid}
              currentColor={currentColor}
              setCurrentColor={setCurrentColor}
              brushSize={brushSize}
              setBrushSize={setBrushSize}
              selection={selection}
              clipboard={clipboard}
              historyIndex={historyIndex}
              historyLength={history.length}
              onCut={handleCut}
              onCopy={handleCopy}
              onPaste={handlePaste}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onUpload={handleUpload}
              onReset={handleReset}
              onDownload={handleDownload}
              onOpenHelp={() => setIsHelpOpen(true)}
            />

            <div className="flex-1 flex flex-col gap-2">
              <div id="desktop-canvas-container" className="flex-1 bg-white border-2 overflow-hidden relative" style={{
                borderTopColor: '#000',
                borderLeftColor: '#000',
                borderRightColor: '#fff',
                borderBottomColor: '#fff'
              }}
              role="img"
              aria-label="Pixel art canvas">
                <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 text-xs pointer-events-none rounded-sm">
                  Zoom: {zoom.toFixed(1)}x
                </div>
              </div>

              <ZoomControls
                zoom={zoom}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onFitToView={handleFitToView}
                isPasting={isPasting}
                selection={selection}
                onOpenHelp={() => setIsHelpOpen(true)}
              />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col h-full gap-2">
            <MobileToolbar
              currentTool={currentTool}
              setCurrentTool={setCurrentTool}
              showGrid={showGrid}
              setShowGrid={setShowGrid}
              currentColor={currentColor}
              setCurrentColor={setCurrentColor}
              brushSize={brushSize}
              setBrushSize={setBrushSize}
              selection={selection}
              clipboard={clipboard}
              historyIndex={historyIndex}
              historyLength={history.length}
              onCut={handleCut}
              onCopy={handleCopy}
              onPaste={handlePaste}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onUpload={handleUpload}
              onReset={handleReset}
              onDownload={handleDownload}
              onOpenHelp={() => setIsHelpOpen(true)}
            />

            <div id="mobile-canvas-container" className="flex-1 bg-white border-2 overflow-hidden min-h-0 relative" style={{
              borderTopColor: '#000',
              borderLeftColor: '#000',
              borderRightColor: '#fff',
              borderBottomColor: '#fff'
            }}>
              <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 text-xs pointer-events-none rounded-sm">
                Zoom: {zoom.toFixed(1)}x
              </div>
            </div>

            <ZoomControls
              zoom={zoom}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onFitToView={handleFitToView}
              isPasting={isPasting}
              selection={selection}
              onOpenHelp={() => setIsHelpOpen(true)}
            />
          </div>

          {/* Single canvas that gets moved to the appropriate container */}
          <canvas
            ref={canvasRef}
            width={1200}
            height={800}
            className="hidden"
            style={{ objectFit: 'contain' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
        </div>
      </div>
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}