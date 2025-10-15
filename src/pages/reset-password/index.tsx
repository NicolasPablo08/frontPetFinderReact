import React from "react";
import * as css from "./index.css";
import { Text } from "../../ui/text";
import { Button } from "../../ui/button";
import { TextField } from "../../ui/text-field";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
function ResetPassword() {
	const navigate = useNavigate();
	const { register, handleSubmit } = useForm();
	function formSubmit(data) {
		console.log(data);
		navigate("/login");
	}
	return (
		<div className={css.root}>
			<Text variant="title">
				Restablecer <br /> contraseña
			</Text>
			<form className={css.form} onSubmit={handleSubmit(formSubmit)}>
				<TextField
					register={register}
					type="password"
					name="password"
					placeholder="********"
				>
					Nueva contraseña
				</TextField>
				<TextField
					register={register}
					type="password"
					name="confirmPassword"
					placeholder="********"
				>
					Confirmar contraseña
				</TextField>
				<Button type="submit" style="blue" className={css.button}>
					Guardar
				</Button>
			</form>
		</div>
	);
}
export { ResetPassword };
