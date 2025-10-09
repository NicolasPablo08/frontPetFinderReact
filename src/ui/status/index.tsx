import React from "react";
import * as css from "./index.css";
import { Text } from "../text";

type StatusProps = {
	children: React.ReactNode; //para que el label pueda tener íconos u otro contenido, lo ideal es usar React.ReactNode
	className?: string;
};
function Status(props: StatusProps) {
	return (
		<div className={`${css.root} ${props.className || ""}`}>
			<Text variant="subtitle"> {props.children} </Text>
		</div>
	);
}
export { Status };
