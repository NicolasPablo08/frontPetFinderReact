import React, { useState, useEffect } from "react";
import * as css from "./index.css";
import { Text } from "../../ui/text";
import { Button } from "../../ui/button";
import { TextField } from "../../ui/text-field";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Status } from "../../ui/status";
import { useSendCodePassword } from "../../hooks/user-hooks";
function EnterCode() {
	const navigate = useNavigate();
	const { register, handleSubmit } = useForm();
	const [error, setError] = useState("");
	const [errorClass, setErrorClass] = useState("status");
	const { sendCode, status, message } = useSendCodePassword();

	//contador de tiempo
	const [timeLeft, setTimeLeft] = useState(55); // Estado para el temporizador

	useEffect(() => {
		if (timeLeft > 0) {
			const timer = setInterval(() => {
				setTimeLeft((prev) => prev - 1);
			}, 1000);
			return () => clearInterval(timer); // Limpiar el intervalo al desmontar
		}
	}, [timeLeft]);
	//si se agota el tiempo se redirecciona
	useEffect(() => {
		if (timeLeft === 0) {
			setError("El tiempo se agotó, solicita un nuevo código.");
			setErrorClass("status-error");
			const timeout = setTimeout(() => {
				setErrorClass("status");
				navigate("/enter-email");
			}, 3000);
			return () => clearTimeout(timeout);
		}
	}, [timeLeft, navigate]);

	async function formSubmit(data) {
		console.log(data);
		const result = await sendCode(data.codigo);
		if (result.status === "success") {
			navigate("/reset-password");
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
						<div className={css.contador}>
							{" "}
							Validez del código: {timeLeft > 0 ? timeLeft : "Expirado"}
						</div>
					</div>
					<Button type="submit" style="blue" className={css.button}>
						Cambiar la contraseña
					</Button>
				</form>
				<Button
					type="button"
					style="gray"
					onClick={() => navigate("/enter-email")}
				>
					Volver a enviar el código
				</Button>
			</div>
			<Status className={css[errorClass]}>{error}</Status>
		</div>
	);
}
export { EnterCode };
