import React, { useState } from "react";
import * as css from "./index.css";
import { Text } from "../../ui/text";
import { TextField, TextArea } from "../../ui/text-field";
import { Button } from "../../ui/button";
import { Status } from "../../ui/status";
import { useForm } from "react-hook-form";
import { useSendFormPetNearby } from "../../hooks/pets-hooks";
import { Waiting } from "../waiting";
type ContactFormProps = {
	ownerPetEmail: string;
	petName: string;
	closeForm: () => void; // Recibir la función para cerrar el formulario desde la page
};

function ContactForm(props: ContactFormProps) {
	const { ownerPetEmail, petName, closeForm } = props;
	const { register, handleSubmit } = useForm();
	const { sendPetForm } = useSendFormPetNearby();
	const [classWaiting, setClassWaiting] = useState(false);
	//status del mensaje
	const [statusOpen, setStatusOpen] = useState(false);
	const [statusMessage, setStatusMessage] = useState("");

	async function sendForm(data) {
		if (!data.nombre || !data.telefono || !data.informacion) {
			setStatusMessage("Todos los campos son obligatorios");
			setStatusOpen(true);
			// Cerrar el mensaje después de 3 segundos
			setTimeout(() => {
				setStatusOpen(false);
				setStatusMessage(""); // Limpiar el mensaje
			}, 3000);
			return;
		}
		// Si todo está bien,
		// logica para enviar el mensaje
		setClassWaiting(true);
		const result = await sendPetForm(
			data.nombre,
			ownerPetEmail,
			data.telefono,
			data.informacion,
			petName
		);
		const { message } = result;

		setStatusMessage(message);
		setClassWaiting(false);
		setStatusOpen(true);

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
					<TextArea style="black" name="informacion" register={register}>
						¿DÓNDE LO VISTE?
					</TextArea>
					<Button style="green" type="submit">
						Enviar información
					</Button>
				</form>
			</div>
			{statusOpen && <Status className={css.status}>{statusMessage}</Status>}
			{classWaiting && <Waiting />}
		</div>
	);
}
export { ContactForm };
