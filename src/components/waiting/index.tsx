import React, { useState, useEffect } from "react";
import * as css from "./index.css";
type WaitingProps = {
	className?: string;
};
function Waiting(props: WaitingProps) {
	const emojis = ["🐶", "🐱", "🐤"];
	const [index, setIndex] = useState(0); // Estado para el índice
	useEffect(() => {
		const interval = setInterval(() => {
			setIndex((prev) => {
				if (prev + 1 > emojis.length) {
					//recordar que el array de emojis empieza en 0
					return 0; // vuelve a 0 cuando pasa el máximo
				}
				return prev + 1;
			});
		}, 1000);

		return () => clearInterval(interval); // Limpia el intervalo al desmontar
	}, []);
	return (
		<div className={`${css.root} ${props.className || ""}`}>
			<h3 className={css.emoji}>{emojis.slice(0, index).join(" ")}</h3>
		</div>
	);
}
export { Waiting };
