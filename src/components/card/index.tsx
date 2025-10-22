import React, { useState } from "react";
import * as css from "./index.css";
import { Text } from "../../ui/text";
import { Button } from "../../ui/button";
import { ContactForm } from "../contact-form";
type CardProps = {
  petImgUrl: string;
  petName: string;
  petLocation: string;
  ownerPetEmail: string;
  type: "edit" | "report";
  onFormToggle?: (open: boolean) => void; //viene de la page pets-nearby y va al comp form para saber cuando esta abierto o cerrado
};

function Card(props: CardProps) {
  const { petImgUrl, petName, petLocation, type, ownerPetEmail } = props;
  const btnStyle = type === "edit" ? "blue" : "red";
  const btnText = type === "edit" ? "Editar 🖉" : "Reportar 🚨";
  const [formEditIsOpen, setFormEditIsOpen] = useState(false);

  function editReport() {
    //logica para editar reporte
    console.log("editar reporte");
  }
  function reportPet() {
    //logica para reportar mascota
    setFormEditIsOpen(true);
    props.onFormToggle?.(true); // avisamos a petsNearby que se abrio el form
    console.log("reportar mascota");
  }
  function closeForm() {
    setFormEditIsOpen(false);
    props.onFormToggle?.(false); // avisamos a petsNearby que se cerro el form
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
            onClick={type === "edit" ? editReport : reportPet}
          >
            {btnText}
          </Button>
        </div>
      </div>
      {formEditIsOpen && (
        <ContactForm ownerPetEmail={ownerPetEmail} petName={petName} closeForm={closeForm} />
      )}
    </div>
  );
}
export { Card };
