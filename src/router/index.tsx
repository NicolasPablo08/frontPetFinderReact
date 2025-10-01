import React from "react";
import { Routes, Route } from "react-router";
import { Layout } from "../pages/layout/index";
import { HomePage } from "../pages/home/index";

function AppRoutes() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<HomePage />} />
			</Route>
		</Routes>
	);
}
export { AppRoutes };
