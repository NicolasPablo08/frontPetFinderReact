import React, { useState } from "react";
import * as css from "./index.css";
import { Text } from "../../ui/text";
import { Button } from "../../ui/button";
import { useNavigate } from "react-router";
import { Card } from "../../components/card";
import { EmptyResults } from "../../ui/empty-results";
import { ContactForm } from "../../components/contact-form";
import { useSearchPets } from "../../hooks/pets-hooks";

function PetsNearby() {
  const [formEditIsOpen, setFormEditIsOpen] = useState(false); //para abrir el formulario
  const navigate = useNavigate();
  const [selectedPet, setSelectedPet] = useState(null); //para pasar la mascota seleccionada al formulario
  const { petsFromSearch } = useSearchPets();

  function openForm(pet?) {
    setFormEditIsOpen(true);
    setSelectedPet(pet);
  }
  function closeForm() {
    setFormEditIsOpen(false);
  }
  return (
    <div className={css.root}>
      <div className={`${css["blur-container"]} ${formEditIsOpen ? css["form-open"] : ""}`}>
        {petsFromSearch.length === 0 ? (
          <EmptyResults>
            No se encontraron mascotas cerca, intenta con otra ubicacion o ampliando el rango de
            busqueda
          </EmptyResults>
        ) : (
          <>
            <Text variant="title"> Mascotas perdidas </Text>
            <div className={css["card-container"]}>
              {petsFromSearch.map((pet) => (
                <Card
                  type="report"
                  petImgUrl={pet.imgUrl}
                  petName={pet.name}
                  petLocation={pet.ubicacion}
                  ownerPetEmail={pet.ownerPetEmail}
                  openForm={() => openForm(pet)}
                  key={pet.petId}
                />
              ))}
            </div>
          </>
        )}
        <Button
          style="gray"
          className={css.button}
          type="button"
          onClick={() => navigate("/search-pets")}
        >
          {" "}
          Nueva busqueda{" "}
        </Button>
      </div>
      <div>
        {formEditIsOpen && (
          <ContactForm
            ownerPetEmail={selectedPet.ownerPetEmail}
            petName={selectedPet.name}
            closeForm={closeForm}
            className={css["form-container"]}
          />
        )}
      </div>
    </div>
  );
}
export { PetsNearby };
