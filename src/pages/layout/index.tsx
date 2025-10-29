import React from "react";
import { Outlet } from "react-router";
import { Header } from "../../components/header";
import * as css from "./index.css";
function Layout() {
	return (
		<div>
			<Header />
			<div className={css.outlet}>
				<Outlet />
			</div>
		</div>
	);
}
export { Layout };
