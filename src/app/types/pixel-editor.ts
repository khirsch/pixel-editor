export type Tool = 'draw' | 'erase' | 'pan' | 'eyedropper' | 'select';

export interface ClipboardData {
  imageData: ImageData;
  width: number;
  height: number;
}

export interface Selection {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export interface PixelEditorState {
  currentTool: Tool;
  currentColor: string;
  showGrid: boolean;
  zoom: number;
  brushSize: number;
  offset: { x: number; y: number };
  selection: Selection | null;
  clipboard: ClipboardData | null;
  isPasting: boolean;
  pastePosition: { x: number; y: number } | null;
}
