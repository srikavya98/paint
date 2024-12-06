import React, { useRef, useEffect, useState } from "react";
import useCanvas from "../hooks/useCanvas";

const Canvas: React.FC = () => {
  const { canvasRef, startDrawing, endDrawing, draw } = useCanvas();
  
  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseUp={endDrawing}
      onMouseMove={draw}
      width={1280}
      height={720}
      className="border border-gray-200"
    />
  );
};

export default Canvas;
