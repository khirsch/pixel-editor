import { 
  Pencil, Eraser, Move, Droplet, Grid3x3, 
  Upload, RotateCcw, Download, Undo, Redo, 
  Square, Scissors, Copy, Clipboard, Home, HelpCircle
} from 'lucide-react';
import { Tool } from '../types/pixel-editor';
import { ToolButton } from './ToolButton';

interface DesktopToolbarProps {
  currentTool: Tool;
  setCurrentTool: (tool: Tool) => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  currentColor: string;
  setCurrentColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  selection: any;
  clipboard: any;
  historyIndex: number;
  historyLength: number;
  onCut: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  onDownload: () => void;
  onOpenHelp: () => void;
}

export function DesktopToolbar({
  currentTool,
  setCurrentTool,
  showGrid,
  setShowGrid,
  currentColor,
  setCurrentColor,
  brushSize,
  setBrushSize,
  selection,
  clipboard,
  historyIndex,
  historyLength,
  onCut,
  onCopy,
  onPaste,
  onUndo,
  onRedo,
  onUpload,
  onReset,
  onDownload,
  onOpenHelp
}: DesktopToolbarProps) {
  return (
    <div className="hidden md:flex flex-col gap-2 w-20 shrink-0">
      {/* Tools panel */}
      <div className="bg-white border-2 p-1" style={{
        borderTopColor: '#000',
        borderLeftColor: '#000',
        borderRightColor: '#fff',
        borderBottomColor: '#fff'
      }}>
        <div className="grid grid-cols-2 gap-1">
          <ToolButton icon={Move} active={currentTool === 'pan'} onClick={() => setCurrentTool('pan')} title="Pan" />
          <ToolButton icon={Square} active={currentTool === 'select'} onClick={() => setCurrentTool('select')} title="Select" />
          <ToolButton icon={Pencil} active={currentTool === 'draw'} onClick={() => setCurrentTool('draw')} title="Draw" />
          <ToolButton icon={Eraser} active={currentTool === 'erase'} onClick={() => setCurrentTool('erase')} title="Erase" />
          <ToolButton icon={Droplet} active={currentTool === 'eyedropper'} onClick={() => setCurrentTool('eyedropper')} title="Eyedropper" />
          <ToolButton icon={Grid3x3} active={showGrid} onClick={() => setShowGrid(!showGrid)} title="Grid" />
        </div>
      </div>

      {/* Edit tools panel */}
      <div className="bg-white border-2 p-1" style={{
        borderTopColor: '#000',
        borderLeftColor: '#000',
        borderRightColor: '#fff',
        borderBottomColor: '#fff'
      }}>
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={onCut}
            disabled={!selection}
            className="aspect-square border-2 flex items-center justify-center bg-white hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              borderTopColor: '#fff',
              borderLeftColor: '#fff',
              borderRightColor: '#000',
              borderBottomColor: '#000'
            }}
            title="Cut"
            aria-label="Cut selection (Ctrl+X)"
            aria-disabled={!selection}
          >
            <Scissors className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            onClick={onCopy}
            disabled={!selection}
            className="aspect-square border-2 flex items-center justify-center bg-white hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              borderTopColor: '#fff',
              borderLeftColor: '#fff',
              borderRightColor: '#000',
              borderBottomColor: '#000'
            }}
            title="Copy"
            aria-label="Copy selection (Ctrl+C)"
            aria-disabled={!selection}
          >
            <Copy className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            onClick={onPaste}
            disabled={!clipboard}
            className="aspect-square border-2 flex items-center justify-center bg-white hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              borderTopColor: '#fff',
              borderLeftColor: '#fff',
              borderRightColor: '#000',
              borderBottomColor: '#000'
            }}
            title="Paste"
            aria-label="Paste clipboard (Ctrl+V)"
            aria-disabled={!clipboard}
          >
            <Clipboard className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            onClick={onUndo}
            disabled={historyIndex <= 0}
            className="aspect-square border-2 flex items-center justify-center bg-white hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              borderTopColor: '#fff',
              borderLeftColor: '#fff',
              borderRightColor: '#000',
              borderBottomColor: '#000'
            }}
            title="Undo"
            aria-label="Undo (Ctrl+Z)"
            aria-disabled={historyIndex <= 0}
          >
            <Undo className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            onClick={onRedo}
            disabled={historyIndex >= historyLength - 1}
            className="aspect-square border-2 flex items-center justify-center bg-white hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              borderTopColor: '#fff',
              borderLeftColor: '#fff',
              borderRightColor: '#000',
              borderBottomColor: '#000'
            }}
            title="Redo"
            aria-label="Redo (Ctrl+Shift+Z)"
            aria-disabled={historyIndex >= historyLength - 1}
          >
            <Redo className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Color picker panel */}
      <div className="bg-white border-2 p-2" style={{
        borderTopColor: '#000',
        borderLeftColor: '#000',
        borderRightColor: '#fff',
        borderBottomColor: '#fff'
      }}>
        <label htmlFor="color-picker" className="sr-only">Choose color</label>
        <input
          id="color-picker"
          type="color"
          value={currentColor}
          onChange={(e) => setCurrentColor(e.target.value)}
          className="w-full h-12 rounded-none cursor-pointer border-2 border-black"
          aria-label={`Current color: ${currentColor}`}
        />
      </div>

      {/* Brush size panel */}
      <div className="bg-white border-2 p-2" style={{
        borderTopColor: '#000',
        borderLeftColor: '#000',
        borderRightColor: '#fff',
        borderBottomColor: '#fff'
      }}>
        <div className="space-y-1">
          <label htmlFor="brush-size" className="text-center text-xs block">Size</label>
          <input
            id="brush-size"
            type="range"
            min="1"
            max="10"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-full cursor-pointer"
            style={{
              WebkitAppearance: 'none',
              appearance: 'none',
              height: '6px',
              background: '#fff',
              border: '2px solid',
              borderTopColor: '#000',
              borderLeftColor: '#000',
              borderRightColor: '#fff',
              borderBottomColor: '#fff',
              outline: 'none'
            }}
            aria-label={`Brush size: ${brushSize} pixels`}
            aria-valuemin={1}
            aria-valuemax={10}
            aria-valuenow={brushSize}
          />
          <div className="text-center text-xs" aria-hidden="true">{brushSize}</div>
        </div>
      </div>

      {/* File operations panel */}
      <div className="bg-white border-2 p-1" style={{
        borderTopColor: '#000',
        borderLeftColor: '#000',
        borderRightColor: '#fff',
        borderBottomColor: '#fff'
      }}>
        <div className="flex flex-col gap-1">
          <label 
            htmlFor="file-upload"
            className="border-2 p-2 bg-white hover:bg-gray-200 cursor-pointer flex items-center justify-center" 
            style={{
              borderTopColor: '#fff',
              borderLeftColor: '#fff',
              borderRightColor: '#000',
              borderBottomColor: '#000'
            }}
            title="Upload image"
            aria-label="Upload image">
            <Upload className="w-4 h-4" aria-hidden="true" />
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={onUpload}
              className="hidden"
              aria-label="Upload image file"
            />
          </label>
          <button
            onClick={onReset}
            className="border-2 p-2 bg-white hover:bg-gray-200 flex items-center justify-center"
            style={{
              borderTopColor: '#fff',
              borderLeftColor: '#fff',
              borderRightColor: '#000',
              borderBottomColor: '#000'
            }}
            title="Reset canvas"
            aria-label="Reset canvas to default"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            onClick={onDownload}
            className="border-2 p-2 bg-white hover:bg-gray-200 flex items-center justify-center"
            style={{
              borderTopColor: '#fff',
              borderLeftColor: '#fff',
              borderRightColor: '#000',
              borderBottomColor: '#000'
            }}
            title="Download image"
            aria-label="Download pixel art as PNG"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Home button - separated at bottom */}
      <div className="mt-auto bg-white border-2 p-2" style={{
        borderTopColor: '#000',
        borderLeftColor: '#000',
        borderRightColor: '#fff',
        borderBottomColor: '#fff'
      }}>
        <a
          href="https://katlandin.com"
          className="w-full border-2 px-3 py-1 bg-white hover:bg-gray-200 flex items-center justify-center"
          style={{
            borderTopColor: '#fff',
            borderLeftColor: '#fff',
            borderRightColor: '#000',
            borderBottomColor: '#000'
          }}
          title="Visit katlandin.com"
          aria-label="Go to katlandin.com home page (opens in new tab)"
        >
          <Home className="w-4 h-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}