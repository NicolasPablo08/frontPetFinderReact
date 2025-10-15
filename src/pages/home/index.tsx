import React from "react";
import { Text } from "../../ui/text";
import { Button } from "../../ui/button";
import * as css from "./index.css";
import { useNavigate } from "react-router";

function HomePage() {
	const navigate = useNavigate();
	function goTo(url) {
		navigate(url);
	}
	return (
		<div className={css.root}>
			<img src="public/assets/icon-home.png" className={css.img} />
			<div className={css["text-container"]}>
				<Text variant="title" className={css.title}>
					Pet Finder App
				</Text>
				<Text variant="subtitle">
					Encontra y reporta mascotas perdidas cerca de tu ubicación
				</Text>
			</div>
			<div className={css["buttons-container"]}>
				<Button
					type="button"
					style="blue"
					onClick={() => goTo("search-reports")}
				>
					Ver mascotas perdidas cerca
				</Button>
				<Button type="button" style="green" onClick={() => goTo("login")}>
					Inicia sesión para reportar
				</Button>
			</div>
		</div>
	);
}

export { HomePage };
