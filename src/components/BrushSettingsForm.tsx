import React, { useState } from "react";
import StyledMenu from "./StyledMenu";
import ErrorAlert from "./ErrorAlert";

interface BrushSettingsFormProps {
  setLineColor: (color: string) => void;
  setLineWidth: (width: number) => void;
  setLineOpacity: (opacity: number) => void;
  setFillColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
}

const BrushSettingsForm: React.FC<BrushSettingsFormProps> = ({
  setLineColor,
  setLineWidth,
  setLineOpacity,
  setFillColor,
  setBackgroundColor,
}) => {
  const [formValues, setFormValues] = useState({
    color: "#000000",
    width: "5",
    opacity: "10",
    fill: "#ffffff",
    background: "#ffffff",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (name: string, value: string) => {
    switch (name) {
      case "width":
        return parseInt(value) >= 3 && parseInt(value) <= 20
          ? ""
          : "Width must be between 3 and 20";
      case "opacity":
        return parseInt(value) >= 1 && parseInt(value) <= 100
          ? ""
          : "Opacity must be between 1 and 100";
      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateForm(name, value);
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    if (!error) {
      switch (name) {
        case "color":
          setLineColor(value);
          break;
        case "width":
          setLineWidth(parseInt(value));
          break;
        case "opacity":
          setLineOpacity(parseInt(value) / 100);
          break;
        case "fill":
          setFillColor(value);
          break;
        case "background":
          setBackgroundColor(value);
          break;
        default:
          console.warn(`Unhandled property: ${name}`);
          break;
      }
    }
  };

  return (
    <div className="space-y-4">
      <StyledMenu>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Brush Color</label>
          <input
            type="color"
            name="color"
            value={formValues.color}
            onChange={handleChange}
            className="h-8 w-16 rounded-md border-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">
            Brush Width ({formValues.width}px)
          </label>
          <input
            type="range"
            name="width"
            min="3"
            max="20"
            value={formValues.width}
            onChange={handleChange}
            className="w-32"
          />
          {errors.width && <ErrorAlert>{errors.width}</ErrorAlert>}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Brush Opacity ({formValues.opacity}%)
          </label>
          <input
            type="range"
            name="opacity"
            min="1"
            max="100"
            value={formValues.opacity}
            onChange={handleChange}
            className="w-32"
          />
          {errors.opacity && <ErrorAlert>{errors.opacity}</ErrorAlert>}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Fill Color</label>
          <input
            type="color"
            name="fill"
            value={formValues.fill}
            onChange={handleChange}
            className="h-8 w-16 rounded-md border-gray-300"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Background Color</label>
          <input
            type="color"
            name="background"
            value={formValues.background}
            onChange={handleChange}
            className="h-8 w-16 rounded-md border-gray-300"
          />
        </div>
      </StyledMenu>
    </div>
  );
};

export default BrushSettingsForm;
