import { X } from "lucide-react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-xl bg-white border-4 z-50 flex flex-col"
        style={{
          borderTopColor: "#fff",
          borderLeftColor: "#fff",
          borderRightColor: "#000",
          borderBottomColor: "#000",
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-modal-title"
      >
        {/* Inner border for double-border effect */}
        <div
          className="border-2 flex flex-col h-full"
          style={{
            borderTopColor: "#000",
            borderLeftColor: "#000",
            borderRightColor: "#fff",
            borderBottomColor: "#fff",
          }}
        >
          {/* Title bar */}
          <div
            className="bg-white border-b-2 p-2 flex items-center justify-between"
            style={{
              borderBottomColor: "#000",
            }}
          >
            <span className="font-bold" id="help-modal-title">How To Use</span>
            <button
              onClick={onClose}
              className="border-2 w-6 h-6 flex items-center justify-center bg-white hover:bg-gray-200"
              style={{
                borderTopColor: "#fff",
                borderLeftColor: "#fff",
                borderRightColor: "#000",
                borderBottomColor: "#000",
              }}
              aria-label="Close help dialog"
            >
              <X className="w-3 h-3" aria-hidden="true" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto flex-1 bg-white">
            <div className="space-y-3">
              <section
                className="border-2 p-2 bg-white"
                style={{
                  borderTopColor: "#000",
                  borderLeftColor: "#000",
                  borderRightColor: "#fff",
                  borderBottomColor: "#fff",
                }}
              >
                <div className="font-bold mb-1">
                  Drawing Tools
                </div>
                <div className="text-sm space-y-0.5">
                  <div>
                    • Draw: Click and drag to draw pixels
                  </div>
                  <div>• Erase: Remove pixels</div>
                  <div>
                    • Eyedropper: Pick colors from canvas
                  </div>
                  <div>• Pan: Move around the canvas</div>
                </div>
              </section>

              <section
                className="border-2 p-2 bg-white"
                style={{
                  borderTopColor: "#000",
                  borderLeftColor: "#000",
                  borderRightColor: "#fff",
                  borderBottomColor: "#fff",
                }}
              >
                <div className="font-bold mb-1">
                  Selection & Clipboard
                </div>
                <div className="text-sm space-y-0.5">
                  <div>• Select: Drag to select area</div>
                  <div>• Cut: Ctrl+X</div>
                  <div>• Copy: Ctrl+C</div>
                  <div>• Paste: Ctrl+V (drag to position)</div>
                </div>
              </section>

              <section
                className="border-2 p-2 bg-white"
                style={{
                  borderTopColor: "#000",
                  borderLeftColor: "#000",
                  borderRightColor: "#fff",
                  borderBottomColor: "#fff",
                }}
              >
                <div className="font-bold mb-1">
                  Canvas Controls
                </div>
                <div className="text-sm space-y-0.5">
                  <div>• Grid: Toggle pixel grid</div>
                  <div>• Zoom: Use +/- or scroll wheel</div>
                  <div>• Brush Size: 1-10 pixels</div>
                  <div>• Color: Click to choose</div>
                </div>
              </section>

              <section
                className="border-2 p-2 bg-white"
                style={{
                  borderTopColor: "#000",
                  borderLeftColor: "#000",
                  borderRightColor: "#fff",
                  borderBottomColor: "#fff",
                }}
              >
                <div className="font-bold mb-1">History</div>
                <div className="text-sm space-y-0.5">
                  <div>• Undo: Ctrl+Z</div>
                  <div>• Redo: Ctrl+Shift+Z</div>
                </div>
              </section>

              <section
                className="border-2 p-2 bg-white"
                style={{
                  borderTopColor: "#000",
                  borderLeftColor: "#000",
                  borderRightColor: "#fff",
                  borderBottomColor: "#fff",
                }}
              >
                <div className="font-bold mb-1">
                  File Operations
                </div>
                <div className="text-sm space-y-0.5">
                  <div>• Upload: Load image to edit</div>
                  <div>• Reset: Clear canvas</div>
                  <div>• Save: Export as PNG</div>
                </div>
              </section>
            </div>
          </div>

          {/* Footer */}
          <div
            className="border-t-2 p-3 bg-white text-center"
            style={{
              borderTopColor: "#000",
            }}
          >
            <button
              onClick={onClose}
              className="border-2 px-8 py-1 bg-white hover:bg-gray-200"
              style={{
                borderTopColor: "#fff",
                borderLeftColor: "#fff",
                borderRightColor: "#000",
                borderBottomColor: "#000",
              }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </>
  );
}