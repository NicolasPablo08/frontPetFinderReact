import React from "react";
import * as css from "./index.css";
type ButtonOneProps = {
	type: "submit" | "reset" | "button"; //propiedades del type de button
	children: React.ReactNode; //para que el botón pueda tener íconos u otro contenido, lo ideal es usar React.ReactNode
};

export function ButtonOne(props: ButtonOneProps) {
	//console.log(css);

	//si queremos hacerlo de a uno seria ({type, children}: ButtonOneProps)
	return (
		<button type={props.type} className={css.button}>
			{props.children}
		</button>
	);
}
