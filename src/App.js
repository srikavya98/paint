import { useRef, useState, useEffect } from "react";
import './App.css';

const App = () => {
  // References to the canvas and its drawing context
  const canvasRef = useRef(null); // Canvas DOM element reference
  const ctxRef = useRef(null); // 2D canvas context reference

  // State hooks to manage drawing state and tool settings
  const [isDrawing, setIsDrawing] = useState(false); // Tracks if the user is currently drawing
  const [lineWidth, setLineWidth] = useState(5); // Line width for drawing
  const [lineColor, setLineColor] = useState("black"); // Line color for drawing
  const [lineOpacity, setLineOpacity] = useState(0.6); // Opacity of the line for drawing
  const [fillColor, setFillColor] = useState("#ffffff"); // Fill color for shapes
  const [shapeTool, setShapeTool] = useState(null); // Tracks the selected shape tool (e.g., rectangle, circle)
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 }); // Stores the start coordinates for drawing shapes
  const [backgroundColor, setBackgroundColor] = useState("#ffffff"); // Background color of the canvas

  // Undo and Redo stacks to keep track of previous canvas states
  const [undoStack, setUndoStack] = useState([]); // Stores previous canvas states for undo
  const [redoStack, setRedoStack] = useState([]); // Stores undone canvas states for redo

  // useEffect hook to initialize the canvas settings and apply changes when relevant state variables change
  useEffect(() => {
    const canvas = canvasRef.current; // Get the canvas DOM element
    const ctx = canvas.getContext("2d"); // Get the 2D context of the canvas
    ctx.lineCap = "round"; // Set line cap to 'round' for smoother lines
    ctx.lineJoin = "round"; // Set line join to 'round' for smoother shape corners
    ctx.globalAlpha = lineOpacity; // Set the global alpha (opacity) for the lines
    ctx.strokeStyle = lineColor; // Set the stroke (line) color
    ctx.lineWidth = lineWidth; // Set the stroke (line) width
    ctxRef.current = ctx; // Store the context for later use

    ctx.fillStyle = backgroundColor; // Set background color
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the canvas with the background color
    saveState(); // Save the initial canvas state for undo functionality
  }, [lineColor, lineOpacity, lineWidth, fillColor, backgroundColor]); // Re-run when these settings change

  // Function to save the current canvas state to the undo stack
  const saveState = () => {
    const canvas = canvasRef.current; // Get the canvas DOM element
    const dataUrl = canvas.toDataURL(); // Get the current canvas content as a data URL
    setUndoStack((prev) => [...prev, dataUrl]); // Add the current canvas state to the undo stack
  };

  // Function to restore a canvas state from a saved data URL
  const restoreState = (dataUrl) => {
    const canvas = canvasRef.current; // Get the canvas DOM element
    const ctx = canvas.getContext("2d"); // Get the 2D context
    const img = new Image(); // Create an image element
    img.src = dataUrl; // Set the image source to the saved data URL
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before restoring the image
      const currentAlpha = ctx.globalAlpha;
      ctx.globalAlpha = 1; // Set alpha to 1 to draw the image without transparency
      ctx.drawImage(img, 0, 0); // Draw the saved image on the canvas
      ctx.globalAlpha = currentAlpha; // Restore the original alpha transparency
    };
  };

  // Start drawing when mouse is pressed down
  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent; // Get the mouse position
    setStartCoords({ x: offsetX, y: offsetY }); // Store the start coordinates for drawing shapes
    setIsDrawing(true); // Set drawing state to true
    if (!shapeTool) {
      ctxRef.current.beginPath(); // Start a new path for freehand drawing
      ctxRef.current.moveTo(offsetX, offsetY); // Move to the starting coordinates
    }
  };

  // End drawing when mouse is released
  const endDrawing = (e) => {
    if (isDrawing) {
      if (shapeTool) {
        drawShape(e); // If a shape tool is selected, draw the shape
        saveState(); // Save state after drawing a shape
      } else {
        ctxRef.current.closePath(); // Close the path for freehand drawing
        saveState(); // Save state after freehand drawing
      }
      setIsDrawing(false); // Stop drawing
      setRedoStack([]); // Clear the redo stack after a change
    }
  };

  // Draw on the canvas when the mouse is moving while drawing (freehand drawing)
  const draw = (e) => {
    if (!isDrawing || shapeTool) return; // Don't draw if not drawing or if a shape tool is selected
    ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY); // Draw a line to the current mouse position
    ctxRef.current.stroke(); // Apply the stroke to the current path
  };

  // Draw shapes based on the selected shape tool
  const drawShape = (e) => {
    if (!isDrawing) return; // Don't draw if not currently drawing
    const { offsetX, offsetY } = e.nativeEvent; // Get the current mouse position
    const endPoint = { x: offsetX, y: offsetY }; // Set the endpoint for the shape

    switch (shapeTool) {
      case "rectangle":
        ctxRef.current.fillStyle = fillColor; // Set the fill color for the rectangle
        ctxRef.current.strokeRect(
          startCoords.x,
          startCoords.y,
          endPoint.x - startCoords.x,
          endPoint.y - startCoords.y
        ); // Draw the rectangle with the selected brush settings
        ctxRef.current.fillRect(
          startCoords.x,
          startCoords.y,
          endPoint.x - startCoords.x,
          endPoint.y - startCoords.y
        ); // Fill the rectangle with the selected fill color
        break;
      case "circle":
        const radius = Math.sqrt(
          Math.pow(startCoords.x - endPoint.x, 2) +
          Math.pow(startCoords.y - endPoint.y, 2)
        ); // Calculate the radius of the circle
        ctxRef.current.beginPath();
        ctxRef.current.arc(startCoords.x, startCoords.y, radius, 0, 2 * Math.PI); // Draw the circle
        ctxRef.current.stroke(); // Apply the stroke to the circle
        ctxRef.current.fillStyle = fillColor; // Set the fill color
        ctxRef.current.fill(); // Fill the circle with the selected fill color
        break;
      case "line":
        ctxRef.current.beginPath();
        ctxRef.current.moveTo(startCoords.x, startCoords.y);
        ctxRef.current.lineTo(endPoint.x, endPoint.y); // Draw the line from start to end
        ctxRef.current.stroke(); // Apply the stroke to the line
        break;
      case "triangle":
        ctxRef.current.beginPath();
        ctxRef.current.moveTo(startCoords.x, startCoords.y);
        ctxRef.current.lineTo(endPoint.x, endPoint.y); // Draw one side of the triangle
        ctxRef.current.lineTo(startCoords.x * 2 - endPoint.x, endPoint.y); // Draw the second side of the triangle
        ctxRef.current.closePath(); // Close the triangle path
        ctxRef.current.stroke(); // Apply the stroke to the triangle
        ctxRef.current.fillStyle = fillColor; // Set the fill color
        ctxRef.current.fill(); // Fill the triangle with the selected fill color
        break;
      default:
        break;
    }
  };

  // Undo the last action by popping the last state from undo stack
  const handleUndo = () => {
    if (undoStack.length > 1) {
      const newUndoStack = [...undoStack];
      const lastState = newUndoStack.pop(); // Remove the last state from the undo stack
      setRedoStack((prev) => [lastState, ...prev]); // Push the last state to the redo stack
      setUndoStack(newUndoStack); // Update the undo stack
      restoreState(newUndoStack[newUndoStack.length - 1]); // Restore the previous state
    }
  };

  // Redo the last undone action by shifting from redo stack
  const handleRedo = () => {
    if (redoStack.length > 0) {
      const newRedoStack = [...redoStack];
      const nextState = newRedoStack.shift(); // Remove the first state from the redo stack
      setRedoStack(newRedoStack); // Update the redo stack
      setUndoStack((prev) => [...prev, nextState]); // Push the next state to the undo stack
      restoreState(nextState); // Restore the next state
    }
  };

  // Save the current canvas content as a PNG file
  const handleSave = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL("image/png"); // Get the canvas content as a data URL
    const link = document.createElement("a"); // Create an anchor element for the download link
    link.href = dataUrl; // Set the link's href to the canvas image
    link.download = "drawing.png"; // Set the default download file name
    link.click(); // Simulate a click on the link to download the image
  };

  // Load an image file onto the canvas
  const handleLoad = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader(); // Create a file reader to read the file
      reader.onload = (event) => {
        const img = new Image(); // Create a new image
        img.src = event.target.result; // Set the image source to the file data URL
        img.onload = () => {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before loading the new image

          const currentAlpha = ctx.globalAlpha;
          ctx.globalAlpha = 1; // Set alpha to 1 for drawing the image without transparency

          ctx.drawImage(img, 0, 0); // Draw the loaded image onto the canvas

          ctx.globalAlpha = currentAlpha; // Restore the original alpha transparency

          saveState(); // Save the canvas state after loading the image
        };
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  // Clear the canvas and reset undo/redo stacks
  const handleNewPage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
    ctx.fillStyle = "#ffffff"; // Set the fill color to white
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the canvas with white color
    setUndoStack([]); // Clear the undo stack
    setRedoStack([]); // Clear the redo stack
    saveState(); // Save the empty canvas state
  };

  // Styled components for the menu and error alerts
  const StyledMenu = ({ className, children }) => (
    <div
      className={`${className} bg-gray-100 rounded-lg p-4 mb-4 w-[650px] flex justify-evenly items-center shadow-md`}
    >
      {children}
    </div>
  );

  const ErrorAlert = ({ children }) => (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative text-sm">
      {children}
    </div>
  );

  


  const BrushSettingsForm = ({ setLineColor, setLineWidth, setLineOpacity, setFillColor, setBackgroundColor }) => {
    const [formValues, setFormValues] = useState({
      color: "#000000",
      width: "5",
      opacity: "10",
      fill: "#ffffff",
      background: "#ffffff"
    });
    const [errors, setErrors] = useState({});

    const validateForm = (name, value) => {
      switch (name) {
        case "width":
          return value >= 3 && value <= 20 ? "" : "Width must be between 3 and 20";
        case "opacity":
          return value >= 1 && value <= 100 ? "" : "Opacity must be between 1 and 100";
        default:
          return "";
      }
    };

    const handleChange = (e) => {
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
            setLineWidth(value);
            break;
          case "opacity":
            setLineOpacity(value / 100);
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

  const ShapeTools = ({ setShapeTool }) => {
    return (
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setShapeTool("rectangle")}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 transition-all duration-300"
        >
          Rectangle
        </button>
        <button
          onClick={() => setShapeTool("circle")}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 transition-all duration-300"
        >
          Circle
        </button>
        <button
          onClick={() => setShapeTool("line")}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 transition-all duration-300"
        >
          Line
        </button>
        <button
          onClick={() => setShapeTool("triangle")}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 transition-all duration-300"
        >
          Triangle
        </button>
        <button
          onClick={() => setShapeTool(null)}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition-all duration-300"
        >
          Free Draw
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center">
      <h1 className="font-['Lobster'] text-5xl text-blue-600 my-6">Paint App</h1>
      <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
        <BrushSettingsForm
          setLineColor={setLineColor}
          setLineWidth={setLineWidth}
          setLineOpacity={setLineOpacity}
          setFillColor={setFillColor}
          setBackgroundColor={setBackgroundColor}
        />
        <ShapeTools setShapeTool={setShapeTool} />
        <div className="flex space-x-4 mb-4">
          <button
            onClick={handleUndo}
            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
          >
            Undo
          </button>
          <button
            onClick={handleRedo}
            className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
          >
            Redo
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
          >
            Save
          </button>
          <input
            type="file"
            accept="image/*"
            onChange={handleLoad}
            className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
          />
          <button
            onClick={handleNewPage}
            className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600"
          >
            New Page
          </button>
        </div>
        <canvas
          onMouseDown={startDrawing}
          onMouseUp={endDrawing}
          onMouseMove={draw}
          ref={canvasRef}
          width={1280}
          height={720}
          className="border border-gray-200"
        />
      </div>
    </div>
  );
};

export default App;
