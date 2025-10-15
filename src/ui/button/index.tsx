import React from "react";
import * as css from "./index.css";
import { Link } from "react-router";
type ButtonProps = {
	type: "submit" | "reset" | "button"; //propiedades del type de button
	children: React.ReactNode; //para que el botón pueda tener íconos u otro contenido, lo ideal es usar React.ReactNode
	style: "blue" | "red" | "green" | "gray"; // estilo del botón pasado mediante clase a la hoja css
	onClick?: (any) => any; // Prop para manejar el clic
	className?: string; //para poder añadirle clases extra donde lo utilicemos
	form?: string;
};

function Button(props: ButtonProps) {
	//si queremos hacerlo de a uno seria ({type, children}: ButtonOneProps)
	return (
		<button
			type={props.type}
			className={`${css.root} ${css[props.style]} ${props.className || ""}`}
			onClick={props.onClick}
			form={props.form}
		>
			{props.children}
		</button>
	);
}

export { Button };
