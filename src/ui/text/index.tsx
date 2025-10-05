import React from "react";
import * as css from "./index.css";

type TextProps = {
  style?: "white";
  variant: "title" | "subtitle" | "subtitleBold" | "text" | "textBold" | "link";
  children: React.ReactNode; //para que el label pueda tener íconos u otro contenido, lo ideal es usar React.ReactNode
  href?: string; //para el link
};

function Text(props: TextProps) {
  return props.variant === "title" ? (
    <h1 className={css.rootTitle}>{props.children} </h1>
  ) : props.variant === "subtitle" ? (
    <h3 className={css.rootSubtitle}>{props.children}</h3>
  ) : props.variant === "subtitleBold" ? (
    <h3 className={css.rootSubtitleBold}>{props.children} </h3>
  ) : props.variant === "text" ? (
    <p className={css.rootText}> {props.children}</p>
  ) : props.variant === "textBold" ? (
    <p className={css.rootTextBold}>{props.children}</p>
  ) : props.variant === "link" ? (
    <a className={css.rootLink} href={props.href}>
      {props.children}
    </a>
  ) : (
    <p>{props.children}</p>
  );
}
export { Text };
