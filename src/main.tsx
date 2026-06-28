import { App } from "./App";
import { ThreePlugin } from "./ThreePlugin";
import ReactDOM from "react-dom/client";

const container = document.getElementById('canvas');

new ThreePlugin(container);

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
