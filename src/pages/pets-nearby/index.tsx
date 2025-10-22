import React, { useEffect, useState } from "react";
import * as css from "./index.css";
import { Text } from "../../ui/text";
import { Button } from "../../ui/button";
import { useNavigate } from "react-router";
import { Card } from "../../components/card";
import { EmptyResults } from "../../ui/empty-results";

function PetsNearby() {
  const [isOpenForm, setIsOpenForm] = useState(false);

  const navigate = useNavigate();
  const petsNearby = JSON.parse(localStorage.getItem("searchPetsNearby")) || [];
  petsNearby.map((pet) => {
    console.log(pet.User?.email);
  });
  return (
    <div className={css.root}>
      <div className={`${css["blur-container"]} ${isOpenForm ? css["form-open"] : ""}`}>
        {petsNearby.length === 0 ? (
          <EmptyResults>
            No se encontraron mascotas cerca, intenta con otra ubicacion o ampliando el rango de
            busqueda
          </EmptyResults>
        ) : (
          <>
            <Text variant="title"> Mascotas perdidas </Text>
            <div className={css["card-container"]}>
              {petsNearby.map((pet) => (
                <Card
                  type="report"
                  petImgUrl={pet.imageUrl}
                  petName={pet.name}
                  petLocation="cipolletti"
                  //User.email: 'limam24101@skateru.com',Eso sugiere que la propiedad User.email está aplanada (flattened),
                  // es decir, no tenés un objeto User, sino una clave con punto en el nombre ("User.email").
                  // y se accede asi pet["User.email"]
                  ownerPetEmail={pet["User.email"]}
                  key={pet.id}
                  onFormToggle={setIsOpenForm} // 👈 enviamos el setter para saber cuando esta abierto el formulario
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
    </div>
  );
}
export { PetsNearby };
