import { ZoomIn, ZoomOut, Maximize2, HelpCircle } from 'lucide-react';

interface ZoomControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToView: () => void;
  isPasting: boolean;
  selection: any;
  onOpenHelp?: () => void;
}

export function ZoomControls({ zoom, onZoomIn, onZoomOut, onFitToView, isPasting, selection, onOpenHelp }: ZoomControlsProps) {
  return (
    <div className="bg-white border-2 p-2" style={{
      borderTopColor: '#000',
      borderLeftColor: '#000',
      borderRightColor: '#fff',
      borderBottomColor: '#fff'
    }}>
      <div className="flex items-center gap-4 justify-between flex-wrap">
        <div className="flex gap-2">
          <button
            onClick={onZoomIn}
            className="border-2 px-3 py-1 bg-white hover:bg-gray-200 text-xs"
            style={{
              borderTopColor: '#fff',
              borderLeftColor: '#fff',
              borderRightColor: '#000',
              borderBottomColor: '#000'
            }}
            aria-label="Zoom in"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            onClick={onZoomOut}
            className="border-2 px-3 py-1 bg-white hover:bg-gray-200 text-xs"
            style={{
              borderTopColor: '#fff',
              borderLeftColor: '#fff',
              borderRightColor: '#000',
              borderBottomColor: '#000'
            }}
            aria-label="Zoom out"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            onClick={onFitToView}
            className="border-2 px-3 py-1 bg-white hover:bg-gray-200 text-xs"
            style={{
              borderTopColor: '#fff',
              borderLeftColor: '#fff',
              borderRightColor: '#000',
              borderBottomColor: '#000'
            }}
            aria-label="Fit to view"
            title="Fit to view"
          >
            <Maximize2 className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
        {onOpenHelp && (
          <button
            onClick={onOpenHelp}
            className="border-2 px-3 py-1 bg-white hover:bg-gray-200 text-xs flex items-center gap-1"
            style={{
              borderTopColor: '#fff',
              borderLeftColor: '#fff',
              borderRightColor: '#000',
              borderBottomColor: '#000'
            }}
            title="Open help dialog"
            aria-label="Open help dialog (Press H)"
          >
            <HelpCircle className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
        {(isPasting || selection) && (
          <div className="text-xs flex-1 text-center" role="status" aria-live="polite">
            {isPasting && 'Click to place'}
            {selection && !isPasting && 'Selection active'}
          </div>
        )}
      </div>
    </div>
  );
}