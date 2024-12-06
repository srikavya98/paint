import React from "react";

interface ShapeToolsProps {
  setShapeTool: (tool: string | null) => void;
}

const ShapeTools: React.FC<ShapeToolsProps> = ({ setShapeTool }) => {
  return (
    <div className="flex space-x-4 mb-4">
      {/* Render buttons for shapes */}
    </div>
  );
};

export default ShapeTools;
