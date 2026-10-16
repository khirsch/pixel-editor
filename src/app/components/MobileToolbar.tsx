import { 
  Pencil, Eraser, Move, Droplet, Grid3x3, 
  Upload, RotateCcw, Download, Undo, Redo, 
  Square, Scissors, Copy, Clipboard, Home
} from 'lucide-react';
import { Tool } from '../types/pixel-editor';

interface MobileToolbarProps {
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

export function MobileToolbar({
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
}: MobileToolbarProps) {
  return (
    <div className="md:hidden flex flex-col gap-2">
      {/* Tools Row */}
      <div className="bg-white border-2 p-2" style={{
        borderTopColor: '#000',
        borderLeftColor: '#000',
        borderRightColor: '#fff',
        borderBottomColor: '#fff'
      }}>
        <div className="text-center mb-1 text-xs">Tools</div>
        <div className="grid grid-cols-6 gap-1">
          <ToolButton icon={Move} active={currentTool === 'pan'} onClick={() => setCurrentTool('pan')} label="Pan" />
          <ToolButton icon={Square} active={currentTool === 'select'} onClick={() => setCurrentTool('select')} label="Select" />
          <ToolButton icon={Pencil} active={currentTool === 'draw'} onClick={() => setCurrentTool('draw')} label="Draw" />
          <ToolButton icon={Eraser} active={currentTool === 'erase'} onClick={() => setCurrentTool('erase')} label="Erase" />
          <ToolButton icon={Droplet} active={currentTool === 'eyedropper'} onClick={() => setCurrentTool('eyedropper')} label="Pick" />
          <ToolButton icon={Grid3x3} active={showGrid} onClick={() => setShowGrid(!showGrid)} label="Grid" />
        </div>
      </div>

      {/* Edit & Color Row */}
      <div className="grid grid-cols-2 gap-2">
        {/* Edit tools */}
        <div className="bg-white border-2 p-2" style={{
          borderTopColor: '#000',
          borderLeftColor: '#000',
          borderRightColor: '#fff',
          borderBottomColor: '#fff'
        }}>
          <div className="text-center mb-1 text-xs">Edit</div>
          <div className="grid grid-cols-3 gap-1">
            <ActionButton icon={Scissors} onClick={onCut} disabled={!selection} />
            <ActionButton icon={Copy} onClick={onCopy} disabled={!selection} />
            <ActionButton icon={Clipboard} onClick={onPaste} disabled={!clipboard} />
          </div>
        </div>

        {/* Color picker */}
        <div className="bg-white border-2 p-2" style={{
          borderTopColor: '#000',
          borderLeftColor: '#000',
          borderRightColor: '#fff',
          borderBottomColor: '#fff'
        }}>
          <div className="text-center mb-1 text-xs">Color</div>
          <input
            type="color"
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
            className="w-full h-9 rounded-none cursor-pointer border-2 border-black"
          />
        </div>
      </div>

      {/* History & Brush Row */}
      <div className="grid grid-cols-2 gap-2">
        {/* History */}
        <div className="bg-white border-2 p-2" style={{
          borderTopColor: '#000',
          borderLeftColor: '#000',
          borderRightColor: '#fff',
          borderBottomColor: '#fff'
        }}>
          <div className="text-center mb-1 text-xs">History</div>
          <div className="grid grid-cols-2 gap-1">
            <ActionButton icon={Undo} onClick={onUndo} disabled={historyIndex <= 0} />
            <ActionButton icon={Redo} onClick={onRedo} disabled={historyIndex >= historyLength - 1} />
          </div>
        </div>

        {/* Brush size */}
        <div className="bg-white border-2 p-2" style={{
          borderTopColor: '#000',
          borderLeftColor: '#000',
          borderRightColor: '#fff',
          borderBottomColor: '#fff'
        }}>
          <div className="text-center mb-1 text-xs">Brush: {brushSize}</div>
          <input
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
          />
        </div>
      </div>

      {/* File operations */}
      <div className="bg-white border-2 p-2" style={{
        borderTopColor: '#000',
        borderLeftColor: '#000',
        borderRightColor: '#fff',
        borderBottomColor: '#fff'
      }}>
        <div className="text-center mb-1 text-xs">File</div>
        <div className="grid grid-cols-4 gap-1">
          <label className="border-2 p-1 bg-white active:bg-gray-200 cursor-pointer flex flex-col items-center justify-center gap-0.5" 
            style={{
              borderTopColor: '#fff',
              borderLeftColor: '#fff',
              borderRightColor: '#000',
              borderBottomColor: '#000'
            }}>
            <Upload className="w-3 h-3" />
            <span className="text-xs">Upload</span>
            <input
              type="file"
              accept="image/*"
              onChange={onUpload}
              className="hidden"
            />
          </label>
          <button
            onClick={onReset}
            className="border-2 p-1 bg-white active:bg-gray-200 flex flex-col items-center justify-center gap-0.5"
            style={{
              borderTopColor: '#fff',
              borderLeftColor: '#fff',
              borderRightColor: '#000',
              borderBottomColor: '#000'
            }}
          >
            <RotateCcw className="w-3 h-3" />
            <span className="text-xs">Reset</span>
          </button>
          <button
            onClick={onDownload}
            className="border-2 p-1 bg-white active:bg-gray-200 flex flex-col items-center justify-center gap-0.5"
            style={{
              borderTopColor: '#fff',
              borderLeftColor: '#fff',
              borderRightColor: '#000',
              borderBottomColor: '#000'
            }}
          >
            <Download className="w-3 h-3" />
            <span className="text-xs">Save</span>
          </button>
          <a
            href="https://katlandin.com"
            className="border-2 p-1 bg-white active:bg-gray-200 flex flex-col items-center justify-center gap-0.5"
            style={{
              borderTopColor: '#fff',
              borderLeftColor: '#fff',
              borderRightColor: '#000',
              borderBottomColor: '#000'
            }}
          >
            <Home className="w-3 h-3" />
            <span className="text-xs">Home</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function ToolButton({ icon: Icon, active, onClick, label }: { icon: any; active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`border-2 flex flex-col items-center justify-center gap-0.5 p-1 ${
        active ? 'bg-black text-white' : 'bg-white active:bg-gray-200'
      }`}
      style={{
        borderTopColor: active ? '#000' : '#fff',
        borderLeftColor: active ? '#000' : '#fff',
        borderRightColor: active ? '#fff' : '#000',
        borderBottomColor: active ? '#fff' : '#000'
      }}
    >
      <Icon className="w-4 h-4" />
      <span className="text-xs leading-none">{label}</span>
    </button>
  );
}

function ActionButton({ icon: Icon, onClick, disabled }: { icon: any; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="border-2 flex items-center justify-center p-2 bg-white active:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
      style={{
        borderTopColor: '#fff',
        borderLeftColor: '#fff',
        borderRightColor: '#000',
        borderBottomColor: '#000'
      }}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
}