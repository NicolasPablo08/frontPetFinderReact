import React, { useState } from "react";
import * as css from "./index.css";
import { Text } from "../../ui/text";
import { Button } from "../../ui/button";
import { TextField } from "../../ui/text-field";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useSignUp } from "../../hooks/user-hooks";
import { Status } from "../../ui/status";
import { Waiting } from "../../components/waiting";
function Regist() {
	const navigate = useNavigate();
	const { register, handleSubmit } = useForm();
	const [error, setError] = useState("");
	const [statusOpen, setStatusOpen] = useState(false);
	const [waitingOpen, setWaitingOpen] = useState(false);
	const { createUser } = useSignUp();

	async function formSubmit(data) {
		if (!data.email || !data.password || !data.confirmPassword) {
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
		setWaitingOpen(true);
		const result = await createUser(data.email, data.password);
		if (result.status === "success") {
			setWaitingOpen(false);
			setError(result.message);
			setStatusOpen(true);
			setTimeout(() => {
				setStatusOpen(false);
				navigate("/edit-profile");
			}, 3000);
		} else {
			setWaitingOpen(false);
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
					<Text variant="link" href="/login">
						Inicia sesion
					</Text>
				</div>
				<Button type="submit" style="blue" form="my-form">
					Siguiente
				</Button>
			</div>
			{statusOpen && <Status>{error}</Status>}
			{waitingOpen && <Waiting />}
		</div>
	);
}
export { Regist };
