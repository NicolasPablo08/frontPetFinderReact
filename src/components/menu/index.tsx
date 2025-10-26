import React, { useState, useEffect } from "react";
import * as css from "./index.css";
import { Text } from "../../ui/text";
import { useLogIn } from "../../hooks/user-hooks";

type MenuProps = {};
function Menu(props: MenuProps) {
	const [isOpen, setIsOpen] = useState(false); //estado para controlar la apertura y cierre del menu
	const [isLogged, setIsLogged] = useState(false); //estado para mostrar el menu que corresponda segun el usuario este logueado o no
	const [email, setEmail] = useState("");
	const { user, logOut } = useLogIn();
	useEffect(() => {
		if (user.token) {
			setEmail(user.email || "");
			setIsLogged(true);
		} else {
			setEmail("");
			setIsLogged(false);
		}
	}, [user]); // Solo se ejecuta una vez al montar el componente
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
							<Text href="/profile" variant="linkMenu">
								{" "}
								Mi perfil
							</Text>
							<Text href="/report" variant="linkMenu">
								{" "}
								Reportar mascota
							</Text>
							<Text href="/my-pets-lost" variant="linkMenu">
								{" "}
								Mis mascotas <br /> reportadas
							</Text>
							<div className={css["option-footer"]}>
								<Text variant="text"> {email || "email@email.com"} </Text>
								<a href="" onClick={logOut} className={css["option-logout"]}>
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
