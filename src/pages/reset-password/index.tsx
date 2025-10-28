import React, { useState } from "react";
import * as css from "./index.css";
import { Text } from "../../ui/text";
import { Button } from "../../ui/button";
import { TextField } from "../../ui/text-field";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Status } from "../../ui/status";
import { useSetNewPassword } from "../../hooks/user-hooks";
import { useLogIn } from "../../hooks/user-hooks";

function ResetPassword() {
	const navigate = useNavigate();
	const { register, handleSubmit } = useForm();
	const [error, setError] = useState("");
	const [statusOpen, setStatusOpen] = useState(false);
	const { setNewPassword } = useSetNewPassword();
	const { logOut } = useLogIn();

	async function formSubmit(data) {
		if (!data.password || !data.confirmPassword) {
			setError("Todos los campos son obligatorios");
			setStatusOpen(true);
			setTimeout(() => {
				setStatusOpen(false);
			}, 3000);
			return;
		}
		if (data.password !== data.confirmPassword) {
			setError("Las contraseñas deben ser iguales");
			setStatusOpen(true);
			setTimeout(() => {
				setStatusOpen(false);
			}, 3000);
			return;
		}
		const result = await setNewPassword(data.password);
		if (result.status === "success") {
			setError(result.message);
			setStatusOpen(true);
			setTimeout(() => {
				setStatusOpen(false);
				logOut();
				navigate("/login");
			}, 3000);
		} else {
			setError(result.message);
			setStatusOpen(true);
			setTimeout(() => {
				setStatusOpen(false);
			}, 3000);
		}
	}
	return (
		<div>
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
			{statusOpen && <Status>{error}</Status>}
		</div>
	);
}
export { ResetPassword };
