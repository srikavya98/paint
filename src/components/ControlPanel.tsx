import React from "react";
import BrushSettingsForm from "./BrushSettingsForm";
import ShapeTools from "./ShapeTools";

interface ControlPanelProps {
  setLineColor: (color: string) => void;
  setLineWidth: (width: number) => void;
  setLineOpacity: (opacity: number) => void;
  setFillColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  setShapeTool: (tool: string | null) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  setLineColor,
  setLineWidth,
  setLineOpacity,
  setFillColor,
  setBackgroundColor,
  setShapeTool,
}) => {
  return (
    <div>
      <BrushSettingsForm
        setLineColor={setLineColor}
        setLineWidth={setLineWidth}
        setLineOpacity={setLineOpacity}
        setFillColor={setFillColor}
        setBackgroundColor={setBackgroundColor}
      />
      <ShapeTools setShapeTool={setShapeTool} />
    </div>
  );
};

export default ControlPanel;
