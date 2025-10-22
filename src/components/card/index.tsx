import React, { useState } from "react";
import * as css from "./index.css";
import { Text } from "../../ui/text";
import { Button } from "../../ui/button";
import { ContactForm } from "../contact-form";
type CardProps = {
	petImgUrl: string;
	petName: string;
	petLocation: string;
	ownerPetEmail?: string;
	type: "edit" | "report";
	openForm?: () => void; //prop que viene de petsNearby para ejecutar la funcion y abrir el formulario
};

function Card(props: CardProps) {
	const { petImgUrl, petName, petLocation, type, ownerPetEmail } = props;
	const btnStyle = type === "edit" ? "blue" : "red";
	const btnText = type === "edit" ? "Editar 🖉" : "Reportar 🚨";

	function editReport() {
		//logica para editar reporte
		console.log("editar reporte");
	}
	function formReportPet() {
		//logica para abrir el formulario, el componente form se encarga de enviar la info
		props.openForm(); //ejecutamos la funcion openForm que viene de la page pets-nearby
	}

	return (
		<div>
			<div className={css.root}>
				<div className={css["img-container"]}>
					<img className={css["card-img"]} src={petImgUrl} alt="Card Image" />
				</div>
				<div className={css["card-container"]}>
					<div className={css["card-data"]}>
						<Text variant="title" style="white">
							{petName}
						</Text>
						<Text variant="textBold" style="white">
							{petLocation}
						</Text>
					</div>
					<Button
						className={css["card-btn"]}
						style={btnStyle}
						type="button"
						onClick={type === "edit" ? editReport : formReportPet}
					>
						{btnText}
					</Button>
				</div>
			</div>
			{/* {formEditIsOpen && (
				<ContactForm
					ownerPetEmail={ownerPetEmail}
					petName={petName}
					closeForm={closeForm}
				/>
			)} */}
		</div>
	);
}
export { Card };
