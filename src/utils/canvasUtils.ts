export const getCanvasContext = (canvas: HTMLCanvasElement): CanvasRenderingContext2D | null => {
    return canvas.getContext("2d");
  };
  
  export const saveCanvasState = (canvas: HTMLCanvasElement, undoStack: string[], setUndoStack: any) => {
    const dataUrl = canvas.toDataURL();
    setUndoStack((prev: string[]) => [...prev, dataUrl]);
  };
  