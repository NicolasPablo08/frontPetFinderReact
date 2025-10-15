import React from "react";
import ReactDom from "react-dom/client";
import { BrowserRouter } from "react-router";
import { AppRoutes } from "./router";

const root = document.getElementById("root");
ReactDom.createRoot(root).render(
	<BrowserRouter>
		<AppRoutes />
	</BrowserRouter>
);
