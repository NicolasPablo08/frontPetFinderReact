import React, { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Text } from "../../ui/text";
import * as css from "./index.css";
import { useNavigate } from "react-router";
import { useLogIn } from "../../hooks/user-hooks";
function Profile() {
	const { user, logOut } = useLogIn();
	const navigate = useNavigate();
	const email = user.email;

	//me envia a login si no estoy logueado
	useEffect(() => {
		if (!user.token) {
			navigate("/login");
		}
	}, [user.token, navigate]);

	function goTo(url) {
		navigate(url);
	}
	return (
		<div className={css.root}>
			<Text variant="title" className={css.title}>
				Mis datos
			</Text>
			<div className={css.buttons}>
				<Button
					type="button"
					style="blue"
					onClick={() => goTo("/edit-profile")}
				>
					Modificar datos personales
				</Button>
				<Button
					type="button"
					style="blue"
					onClick={() => goTo("/reset-password")}
				>
					Modificar contraseña
				</Button>
				<Button type="button" style="green" onClick={() => goTo("/my-reports")}>
					Mis reportes
				</Button>
			</div>
			<div className={css.footer}>
				<Text variant="text">{email}</Text>
				<Text variant="link" onClick={logOut}>
					Cerrar sesión
				</Text>
			</div>
		</div>
	);
}
export { Profile };
