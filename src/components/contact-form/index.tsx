import React, { useState } from "react";
import * as css from "./index.css";
import { Text } from "../../ui/text";
import { TextField, TextArea } from "../../ui/text-field";
import { Button } from "../../ui/button";
import { Status } from "../../ui/status";
import { useForm } from "react-hook-form";
type ContactFormProps = {
	ownerPetEmail: string;
	petName: string;
	closeForm: () => void; // Recibir la función para cerrar el formulario desde la card
};

function ContactForm(props: ContactFormProps) {
	const { ownerPetEmail, petName, closeForm } = props;
	const { register, handleSubmit } = useForm();

	//status del mensaje
	const [statusOpen, setStatusOpen] = useState(false);
	const [statusMessage, setStatusMessage] = useState("");

	function sendForm(data) {
		//manejar los datos del formulario, data nos trae un objeto con los datos del formulario
		if (!data.nombre || !data.telefono || !data.info) {
			setStatusMessage("Todos los campos son obligatorios");
			setStatusOpen(true);
			console.log("faltan datos", data, ownerPetEmail, petName);
			// Cerrar el mensaje después de 3 segundos
			setTimeout(() => {
				setStatusOpen(false);
				setStatusMessage(""); // Limpiar el mensaje
			}, 3000);
			return;
		}
		// Si todo está bien,
		setStatusMessage(
			"Mensaje enviado, gracias por ayudar a encontrar una mascota!"
		);
		setStatusOpen(true);
		//logica para enviar el mensaje
		console.log("mensaje enviado", data, ownerPetEmail, petName);

		// Cerrar el mensaje después de 3 segundos
		setTimeout(() => {
			setStatusOpen(false);
			setStatusMessage(""); // Limpiar el mensaje
			closeForm(); // Llamar a la función de la card para cerrar el formulario
		}, 3000);
	}
	return (
		<div>
			<div className={`${css.root} `}>
				<button className={css["close-button"]} onClick={closeForm}>
					X
				</button>
				<Text variant="title" style="white">
					Reportar info de una mascota
				</Text>
				<form className={css.form} onSubmit={handleSubmit(sendForm)}>
					<TextField
						style="black"
						type="text"
						name="nombre"
						register={register}
					>
						NOMBRE
					</TextField>
					<TextField
						style="black"
						type="tel"
						name="telefono"
						register={register}
					>
						TELEFONO
					</TextField>
					<TextArea style="black" name="info" register={register}>
						¿DÓNDE LO VISTE?
					</TextArea>
					<Button style="green" type="submit">
						Enviar información
					</Button>
				</form>
			</div>
			{statusOpen && <Status className={css.status}>{statusMessage}</Status>}
		</div>
	);
}
export { ContactForm };
