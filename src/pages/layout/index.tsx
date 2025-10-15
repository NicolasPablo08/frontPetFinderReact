import React from "react";
import { Outlet } from "react-router";
import { Header } from "../../components/header";
function Layout() {
	return (
		<div>
			<Header />
			<Outlet />
		</div>
	);
}
export { Layout };
