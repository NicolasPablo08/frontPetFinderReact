import React, { useEffect, useState } from "react";
import * as css from "./index.css";
import { Text } from "../../ui/text";
import { Button } from "../../ui/button";
import { TextField } from "../../ui/text-field";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useLogIn } from "../../hooks/user-hooks";
import { Status } from "../../ui/status";

function Login() {
	const navigate = useNavigate();
	const [error, setError] = useState("");
	const [errorClass, setErrorClass] = useState("status");

	const { logIn, user, status, message } = useLogIn();

	useEffect(() => {
		setError(message);
	}, [message]);
	const { register, handleSubmit } = useForm();
	async function formSubmit(data) {
		if (!data.email || !data.password) {
			setError("Todos los campos son obligatorios");
			setErrorClass("status-error");
			setTimeout(() => {
				setErrorClass("status");
			}, 3000);
			return;
		}
		const result = await logIn(data.email, data.password);
		//console.log("result", result);
		if (result.status === "success") {
			navigate("/profile");
		} else {
			setErrorClass("status-error");
			setError(result.message);
			setTimeout(() => {
				setErrorClass("status");
			}, 4000);
		}
	}
	return (
		<div>
			<div className={css.root}>
				<div className={css["text-container"]}>
					<Text variant="title">Iniciar Sesión</Text>
					<Text variant="subtitle">
						Ingresa los siguientes datos para iniciar sesión
					</Text>
				</div>
				<form
					className={css.form}
					onSubmit={handleSubmit(formSubmit)}
					id="my-form"
				>
					<TextField register={register} name="email" type="email">
						Email
					</TextField>
					<TextField register={register} name="password" type="password">
						Contraseña
					</TextField>
				</form>
				<div className={css.links}>
					<Text variant="link" href="enter-email">
						Olvide mi contraseña
					</Text>
					<div className={css.regist}>
						<Text variant="text">Aun no tienes cuenta</Text>
						<Text variant="link" href="regist">
							Registrate
						</Text>
					</div>
				</div>
				<Button type="submit" style="blue" form="my-form">
					Acceder
				</Button>
			</div>
			<Status className={css[errorClass]}>{error}</Status>
		</div>
	);
}
export { Login };
