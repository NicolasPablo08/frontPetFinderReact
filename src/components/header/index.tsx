import React, { useState } from "react";
import * as css from "./index.css";
import { Menu } from "../menu";

type HeaderProps = {};

function Header(props: HeaderProps) {
	return (
		<div className={css.root}>
			<div>
				<img className={css.logo} src="/public/assets/icon-header.png" alt="" />
			</div>
			<Menu />
		</div>
	);
}
export { Header };
