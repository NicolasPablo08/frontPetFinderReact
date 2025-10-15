import React from "react";
import * as css from "./index.css";
import { Text } from "../../ui/text";
import { Button } from "../../ui/button";
import { TextField } from "../../ui/text-field";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
function EditProfile() {
	const { register, handleSubmit } = useForm();
	const navigate = useNavigate();
	function formSubmit(data) {
		console.log(data);
		navigate("/profile");
	}
	return (
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
	);
}
export { EditProfile };
