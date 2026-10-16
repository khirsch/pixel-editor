import { 
  Pencil, Eraser, Move, Droplet, Grid3x3, 
  Upload, RotateCcw, Download, Undo, Redo, 
  Square, Scissors, Copy, Clipboard, Home
} from 'lucide-react';
import { Tool } from '../types/pixel-editor';

interface MobileToolbarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
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
}

export function MobileToolbarDrawer({
  isOpen,
  onClose,
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
  onDownload
}: MobileToolbarDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="md:hidden fixed inset-x-4 top-16 bottom-16 bg-[#c0c0c0] z-50 overflow-y-auto p-1" style={{
        backgroundImage: `repeating-conic-gradient(#000 0% 25%, #fff 0% 50%)`,
        backgroundSize: '8px 8px'
      }}>
        <div className="bg-[#c0c0c0] p-2 h-full overflow-y-auto">
          <div className="flex flex-col gap-2">
            {/* Close button */}
            <button
              onClick={onClose}
              className="border-2 p-2 bg-white hover:bg-gray-200 self-end text-xs"
              style={{
                borderTopColor: '#fff',
                borderLeftColor: '#fff',
                borderRightColor: '#000',
                borderBottomColor: '#000'
              }}
            >
              ✕
            </button>

            {/* Tools panel */}
            <div className="bg-white border-2 p-2" style={{
              borderTopColor: '#000',
              borderLeftColor: '#000',
              borderRightColor: '#fff',
              borderBottomColor: '#fff'
            }}>
              <div className="text-center mb-1 text-xs">Tools</div>
              <div className="grid grid-cols-3 gap-1">
                <MobileToolButton icon={Move} active={currentTool === 'pan'} onClick={() => { setCurrentTool('pan'); onClose(); }} label="Pan" />
                <MobileToolButton icon={Square} active={currentTool === 'select'} onClick={() => { setCurrentTool('select'); onClose(); }} label="Select" />
                <MobileToolButton icon={Pencil} active={currentTool === 'draw'} onClick={() => { setCurrentTool('draw'); onClose(); }} label="Draw" />
                <MobileToolButton icon={Eraser} active={currentTool === 'erase'} onClick={() => { setCurrentTool('erase'); onClose(); }} label="Erase" />
                <MobileToolButton icon={Droplet} active={currentTool === 'eyedropper'} onClick={() => { setCurrentTool('eyedropper'); onClose(); }} label="Picker" />
                <MobileToolButton icon={Grid3x3} active={showGrid} onClick={() => { setShowGrid(!showGrid); onClose(); }} label="Grid" />
              </div>
            </div>

            {/* Edit tools panel */}
            <div className="bg-white border-2 p-2" style={{
              borderTopColor: '#000',
              borderLeftColor: '#000',
              borderRightColor: '#fff',
              borderBottomColor: '#fff'
            }}>
              <div className="text-center mb-1 text-xs">Edit</div>
              <div className="grid grid-cols-3 gap-1">
                <MobileActionButton icon={Scissors} onClick={() => { onCut(); onClose(); }} label="Cut" disabled={!selection} />
                <MobileActionButton icon={Copy} onClick={() => { onCopy(); onClose(); }} label="Copy" disabled={!selection} />
                <MobileActionButton icon={Clipboard} onClick={() => { onPaste(); onClose(); }} label="Paste" disabled={!clipboard} />
                <MobileActionButton icon={Undo} onClick={onUndo} label="Undo" disabled={historyIndex <= 0} />
                <MobileActionButton icon={Redo} onClick={onRedo} label="Redo" disabled={historyIndex >= historyLength - 1} />
              </div>
            </div>

            {/* Color picker panel */}
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
                className="w-full h-12 rounded-none cursor-pointer border-2 border-black"
              />
            </div>

            {/* Brush size panel */}
            <div className="bg-white border-2 p-2" style={{
              borderTopColor: '#000',
              borderLeftColor: '#000',
              borderRightColor: '#fff',
              borderBottomColor: '#fff'
            }}>
              <div className="text-center mb-1 text-xs">Brush Size</div>
              <div className="space-y-1">
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
                <div className="text-center text-xs">{brushSize}</div>
              </div>
            </div>

            {/* File operations panel */}
            <div className="bg-white border-2 p-2" style={{
              borderTopColor: '#000',
              borderLeftColor: '#000',
              borderRightColor: '#fff',
              borderBottomColor: '#fff'
            }}>
              <div className="text-center mb-1 text-xs">File</div>
              <div className="flex flex-col gap-1">
                <label className="border-2 p-2 bg-white hover:bg-gray-200 cursor-pointer flex items-center justify-center gap-2 text-xs" 
                  style={{
                    borderTopColor: '#fff',
                    borderLeftColor: '#fff',
                    borderRightColor: '#000',
                    borderBottomColor: '#000'
                  }}>
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => { onUpload(e); onClose(); }}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={() => { onReset(); onClose(); }}
                  className="border-2 p-2 bg-white hover:bg-gray-200 flex items-center justify-center gap-2 text-xs"
                  style={{
                    borderTopColor: '#fff',
                    borderLeftColor: '#fff',
                    borderRightColor: '#000',
                    borderBottomColor: '#000'
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
                <button
                  onClick={() => { onDownload(); onClose(); }}
                  className="border-2 p-2 bg-white hover:bg-gray-200 flex items-center justify-center gap-2 text-xs"
                  style={{
                    borderTopColor: '#fff',
                    borderLeftColor: '#fff',
                    borderRightColor: '#000',
                    borderBottomColor: '#000'
                  }}
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Home button - separated at bottom */}
            <div className="bg-white border-2 p-2" style={{
              borderTopColor: '#000',
              borderLeftColor: '#000',
              borderRightColor: '#fff',
              borderBottomColor: '#fff'
            }}>
              <a
                href="https://katlandin.com"
                onClick={onClose}
                className="border-2 p-3 bg-white hover:bg-gray-200 flex items-center justify-center gap-2 text-xs"
                style={{
                  borderTopColor: '#fff',
                  borderLeftColor: '#fff',
                  borderRightColor: '#000',
                  borderBottomColor: '#000'
                }}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Helper component for mobile tool buttons
function MobileToolButton({ icon: Icon, active, onClick, label }: { icon: any; active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`aspect-square border-2 flex flex-col items-center justify-center gap-0.5 p-1 ${
        active ? 'bg-black text-white' : 'bg-white hover:bg-gray-200'
      }`}
      style={{
        borderTopColor: active ? '#000' : '#fff',
        borderLeftColor: active ? '#000' : '#fff',
        borderRightColor: active ? '#fff' : '#000',
        borderBottomColor: active ? '#fff' : '#000'
      }}
    >
      <Icon className="w-5 h-5" />
      <span className="text-xs">{label}</span>
    </button>
  );
}

// Helper component for mobile action buttons
function MobileActionButton({ icon: Icon, onClick, label, disabled }: { icon: any; onClick: () => void; label: string; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="aspect-square border-2 flex flex-col items-center justify-center gap-0.5 p-1 bg-white hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
      style={{
        borderTopColor: '#fff',
        borderLeftColor: '#fff',
        borderRightColor: '#000',
        borderBottomColor: '#000'
      }}
    >
      <Icon className="w-5 h-5" />
      <span className="text-xs">{label}</span>
    </button>
  );
}