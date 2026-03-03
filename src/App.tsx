import Clarity from "@microsoft/clarity";
import { useEffect, useState } from "react";
import "./App.css";

const projectId = import.meta.env.VITE_CLARITY_PROJECT_ID;

function App() {
  const [isClarityEnabled, setIsClarityEnabled] = useState(false);

  useEffect(() => {
    if (isClarityEnabled) {
      Clarity.init(projectId);
    }
  }, [isClarityEnabled]);

  return (
    <div style={{ width: 800, height: 600 }}>
      <span>{isClarityEnabled ? "Clarity enabled" : "Clarity disabled"}</span>
      <iframe
        srcDoc={`<html><body><h1>Hello, world!</h1></body></html>`}
        width="100%"
        height="100%"
        name="aleluia"
      />
      {!isClarityEnabled && (
        <button onClick={() => setIsClarityEnabled(true)}>
          Enable Clarity
        </button>
      )}
    </div>
  );
}

export default App;
