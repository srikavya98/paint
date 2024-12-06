import { useRef, useState, useEffect } from "react";

const useCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctxRef.current = ctx;
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Your logic to start drawing...
  };

  const endDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Your logic to end drawing...
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Your logic for drawing...
  };

  return { canvasRef, startDrawing, endDrawing, draw };
};

export default useCanvas;
