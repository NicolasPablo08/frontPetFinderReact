import React from "react";
import * as css from "./index.css";
import { Text } from "../../ui/text";
import { Button } from "../../ui/button";
import { TextField } from "../../ui/text-field";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
function EnterEmail() {
	const navigate = useNavigate();
	const { register, handleSubmit } = useForm();
	function formSubmit(data) {
		console.log(data);
		navigate("/enter-code");
	}
	return (
		<div className={css.root}>
			<div className={css["text-container"]}>
				<Text variant="title">Restablecer contraseña</Text>
				<Text variant="subtitle">
					Ingresá tu email registrado, te enviaremos un codigo de verificacion
					para recuperar tu contraseña.
				</Text>
			</div>
			<form className={css.form} onSubmit={handleSubmit(formSubmit)}>
				<TextField register={register} name="email" type="email">
					Email
				</TextField>
				<Button type="submit" style="blue" className={css.button}>
					Enviar código
				</Button>
			</form>
			<Button type="button" style="blue" onClick={() => navigate("/login")}>
				Volver
			</Button>
		</div>
	);
}
export { EnterEmail };
