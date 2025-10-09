import React, { useState } from "react";
import * as css from "./index.css";
import { Text } from "../../ui/text";

type MenuProps = {};
function Menu(props: MenuProps) {
	const [isOpen, setIsOpen] = useState(false); //estado para controlar la apertura y cierre del menu
	const [isLogged, setIsLogged] = useState(false); //estado para mostrar el menu que corresponda segun el usuario este logueado o no
	function openMenu() {
		setIsOpen(true);
	}
	function closeMenu() {
		setIsOpen(false);
	}
	return (
		<div className={css.root}>
			<div className={css["menu-container"]}>
				<button className={css["button-open"]} onClick={openMenu}>
					<h3 className={css["icon-button-open"]}>☰</h3>
				</button>
			</div>
			<div className={`${css["menu-window"]} ${isOpen ? css.open : ""}`}>
				<button className={css["button-close"]} onClick={closeMenu}>
					X
				</button>
				<div className={css["menu-options"]}>
					{isLogged ? (
						<div className={css["logged"]}>
							<Text href="/perfil" variant="linkMenu">
								{" "}
								Mi perfil
							</Text>
							<Text href="/report" variant="linkMenu">
								{" "}
								Reportar mascota
							</Text>
							<Text href="/my-reports" variant="linkMenu">
								{" "}
								Mis mascotas <br /> reportadas
							</Text>
							<div className={css["option-footer"]}>
								<Text variant="text"> email@email.com </Text>
								<a href="" className={css["option-logout"]}>
									CERRAR SESIÓN
								</a>
							</div>
						</div>
					) : (
						<div className={css["not-logged"]}>
							<Text href="/" variant="linkMenu">
								{" "}
								Home
							</Text>
							<Text href="/share-loc" variant="linkMenu">
								{" "}
								Ver mascotas <br /> perdidas cerca
							</Text>
							<Text href="/login" variant="linkMenu">
								{" "}
								Iniciar Sesión
							</Text>
							<Text href="/regist" variant="linkMenu">
								{" "}
								Registrate
							</Text>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
export { Menu };
