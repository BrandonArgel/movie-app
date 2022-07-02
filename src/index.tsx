import ReactDOM from "react-dom/client";
import App from "./routes/App";
import "styles/global.scss";

const root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement);
root.render(<App />);
