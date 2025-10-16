import React, { useState } from "react";
import * as css from "./index.css";
import { Text } from "../../ui/text";
import { Button } from "../../ui/button";
import { TextField } from "../../ui/text-field";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useSetDataUser } from "../../hooks/user-hooks";
import { Status } from "../../ui/status";
function EditProfile() {
	const navigate = useNavigate();
	const [error, setError] = useState("");
	const [errorClass, setErrorClass] = useState("status");
	const { user, setDataUser, status, message } = useSetDataUser();
	const { register, handleSubmit } = useForm({
		defaultValues: {
			nombre: user.name,
			localidad: user.location,
		},
	});
	async function formSubmit(data) {
		console.log(data);
		if (!data.nombre || !data.localidad) {
			setError("Por favor completa todos los campos");
			setErrorClass("status-error");
			setTimeout(() => {
				setErrorClass("status");
			}, 3000);
			return;
		}
		const result = await setDataUser(data.nombre, data.localidad);
		if (result.status === "success") {
			setError(result.message);
			setErrorClass("status-error");
			setTimeout(() => {
				setErrorClass("status");
				navigate("/profile");
			}, 3000);
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
					<Text variant="title">
						Datos <br /> personales
					</Text>
				</div>
				<form className={css.form} onSubmit={handleSubmit(formSubmit)}>
					<TextField register={register} name="nombre" type="text">
						Nombre
					</TextField>
					<TextField register={register} name="localidad" type="text">
						Localidad
					</TextField>
					<Button type="submit" style="blue" className={css.button}>
						Guardar
					</Button>
				</form>
			</div>
			<Status className={css[errorClass]}>{error}</Status>
		</div>
	);
}
export { EditProfile };
