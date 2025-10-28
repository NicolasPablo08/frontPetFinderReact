import React, { useState } from "react";
import * as css from "./index.css";
import { Text } from "../../ui/text";
import { Button } from "../../ui/button";
import { TextField } from "../../ui/text-field";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Status } from "../../ui/status";
import { useGetCodePassword } from "../../hooks/user-hooks";
import { Waiting } from "../../components/waiting";
import { set } from "ol/transform";
function EnterEmail() {
	const navigate = useNavigate();
	const { register, handleSubmit } = useForm();
	const [error, setError] = useState("");
	const [statusOpen, setStatusOpen] = useState(false);
	const [waitingOpen, setWaitingOpen] = useState(false);

	const { getCode } = useGetCodePassword();

	async function formSubmit(data) {
		setWaitingOpen(true);
		const result = await getCode(data.email);
		if (result.status === "success") {
			navigate("/enter-code");
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
			<div className={`${css.root} ${waitingOpen && css.waiting}`}>
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
			{statusOpen && <Status>{error}</Status>}
			{waitingOpen && <Waiting />}
		</div>
	);
}
export { EnterEmail };
