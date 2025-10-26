import React, { useState } from "react";
import * as css from "./index.css";
import { Text } from "../../ui/text";
import { Button } from "../../ui/button";
import { TextField } from "../../ui/text-field";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Status } from "../../ui/status";
import { useGetCodePassword } from "../../hooks/user-hooks";
function EnterEmail() {
	const navigate = useNavigate();
	const { register, handleSubmit } = useForm();
	const [error, setError] = useState("");
	const [errorClass, setErrorClass] = useState("status");
	const { getCode } = useGetCodePassword();

	async function formSubmit(data) {
		const result = await getCode(data.email);
		if (result.status === "success") {
			navigate("/enter-code");
		} else {
			setError(result.message);
			setErrorClass("status-error");
			setTimeout(() => {
				setErrorClass("status");
			}, 3000);
		}
	}
	return (
		<div>
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
				<Button type="button" style="gray" onClick={() => navigate("/login")}>
					Volver
				</Button>
			</div>
			<Status className={css[errorClass]}>{error}</Status>
		</div>
	);
}
export { EnterEmail };
