import React from "react";
import * as css from "./index.css";
import { Text } from "../../ui/text";
import { Button } from "../../ui/button";
import { TextField } from "../../ui/text-field";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
function Regist() {
	const navigate = useNavigate();
	const { register, handleSubmit } = useForm();
	function formSubmit(data) {
		console.log(data);
		navigate("/edit-profile");
	}
	return (
		<div className={css.root}>
			<div className={css["text-container"]}>
				<Text variant="title">Registrate</Text>
				<Text variant="subtitle">
					Ingresá los siguientes datos para realizar el registro
				</Text>
			</div>
			<form
				className={css.form}
				id="my-form"
				onSubmit={handleSubmit(formSubmit)}
			>
				<TextField register={register} name="email" type="email">
					Email
				</TextField>
				<TextField register={register} name="password" type="password">
					Contraseña
				</TextField>
				<TextField register={register} name="confirmPassword" type="password">
					Confirmar contraseña
				</TextField>
			</form>
			<div className={css.links}>
				<Text variant="text">ya tenés cuenta?</Text>
				<Text variant="link">Inicia sesion</Text>
			</div>
			<Button type="submit" style="blue" form="my-form">
				Siguiente
			</Button>
		</div>
	);
}
export { Regist };
