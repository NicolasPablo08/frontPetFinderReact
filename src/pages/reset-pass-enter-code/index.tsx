import React from "react";
import * as css from "./index.css";
import { Text } from "../../ui/text";
import { Button } from "../../ui/button";
import { TextField } from "../../ui/text-field";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
function EnterCode() {
	const navigate = useNavigate();
	const { register, handleSubmit } = useForm();
	function formSubmit(data) {
		console.log(data);
		navigate("/reset-password");
	}
	return (
		<div className={css.root}>
			<div className={css["text-container"]}>
				<Text variant="title">Ingresar Código de Verificacion</Text>
				<Text variant="subtitle">
					Ingresá el codigo de verificacion que enviamos a tu email.
				</Text>
			</div>
			<form className={css.form} onSubmit={handleSubmit(formSubmit)}>
				<div>
					<TextField register={register} name="codigo" type="text">
						CÓDIGO
					</TextField>
					<div className={css.contador}>Validez del código: 55</div>
				</div>
				<Button type="submit" style="blue" className={css.button}>
					Cambiar la contraseña
				</Button>
			</form>
			<Button
				type="button"
				style="blue"
				onClick={() => navigate("/enter-email")}
			>
				Volver a enviar el código
			</Button>
		</div>
	);
}
export { EnterCode };
