import React from "react";
import * as css from "./index.css";

type TextProps = {
	style?: "white";
	variant:
		| "title"
		| "subtitle"
		| "subtitleBold"
		| "text"
		| "textBold"
		| "link"
		| "linkMenu";
	children: React.ReactNode; //para que el label pueda tener íconos u otro contenido, lo ideal es usar React.ReactNode
	href?: string; //para el link
	className?: string; //para poder añadirle clases extra donde lo utilicemos, falta agregar la props al className
};

function Text(props: TextProps) {
	return props.variant === "title" ? (
		<h1
			className={`${css.rootTitle} ${css[props.style]} ${
				props.className || ""
			}`}
		>
			{props.children}{" "}
		</h1>
	) : props.variant === "subtitle" ? (
		<h3
			className={`${css.rootSubTitle} ${css[props.style]} ${
				props.className || ""
			}`}
		>
			{props.children}
		</h3>
	) : props.variant === "subtitleBold" ? (
		<h3
			className={`${css.rootSubTitleBold} ${css[props.style]} ${
				props.className || ""
			}`}
		>
			{props.children}{" "}
		</h3>
	) : props.variant === "text" ? (
		<p
			className={`${css.rootText} ${css[props.style]} ${props.className || ""}`}
		>
			{" "}
			{props.children}
		</p>
	) : props.variant === "textBold" ? (
		<p
			className={`${css.rootTextBold} ${css[props.style]} ${
				props.className || ""
			}`}
		>
			{props.children}
		</p>
	) : props.variant === "link" ? (
		<a
			className={`${css.rootLink} ${css[props.style]} ${props.className || ""}`}
			href={props.href}
		>
			{props.children}
		</a>
	) : props.variant === "linkMenu" ? (
		<a
			className={`${css.rootLinkMenu} ${css[props.style]} ${
				props.className || ""
			}`}
			href={props.href}
		>
			{props.children}
		</a>
	) : (
		<p>{props.children}</p>
	);
}
export { Text };
