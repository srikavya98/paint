import React, { useState } from "react";
import ControlPanel from "./components/ControlPanel";
import Canvas from "./components/Canvas";

const App: React.FC = () => {
  const [lineColor, setLineColor] = useState("black");
  const [lineWidth, setLineWidth] = useState(5);
  const [lineOpacity, setLineOpacity] = useState(1.0);
  const [fillColor, setFillColor] = useState("#ffffff");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [shapeTool, setShapeTool] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center">
      <h1 className="font-['Lobster'] text-5xl text-blue-600 my-6">Paint App</h1>
      <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
        <ControlPanel
          setLineColor={setLineColor}
          setLineWidth={setLineWidth}
          setLineOpacity={setLineOpacity}
          setFillColor={setFillColor}
          setBackgroundColor={setBackgroundColor}
          setShapeTool={setShapeTool}
        />
        <Canvas />
      </div>
    </div>
  );
};

export default App;
