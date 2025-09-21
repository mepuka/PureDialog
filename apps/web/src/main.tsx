import React from "react";
import { createRoot } from "react-dom/client";

const App = () => <div>PureDialog Web</div>;

const container = document.getElementById("root");
if (container) createRoot(container).render(<App />);
