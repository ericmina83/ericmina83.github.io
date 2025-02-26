import ReactDOM from "react-dom/client";
import { App } from "./App";
import { ThreePlugin } from "./ThreePlugin";

const container = document.getElementById('canvas');

new ThreePlugin(container);

// ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
