import React, { useEffect, useState } from "react";
import * as css from "./index.css";
import { Text } from "../../ui/text";
import { MapSearch } from "../../components/map-search";
import { Button } from "../../ui/button";
import { TextField } from "../../ui/text-field";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Status } from "../../ui/status";
import { useSearchPets } from "../../hooks/pets-hooks";

function SearchPets() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [errorClass, setErrorClass] = useState("status");
  const [lastCoords, setLastCoords] = useState({ lat: -34.6037, lng: -58.3816 });
  const { pets, searchPetsNearby, status, message } = useSearchPets();

  //obtiene las coordenadas del mapa cada vez que se ponga un nuevo punto
  const handleCoordsChange = (coords) => {
    setLastCoords(coords);
  };

  //obtiene los datos del formulario y les agrega las coordenadas
  async function formSubmit(data) {
    const fullData = {
      ...data,
      lat: lastCoords.lat,
      lng: lastCoords.lng,
    };
    if (!fullData.lat || !fullData.lng || !fullData.range) {
      setError("Todos los campos son obligatorios");
      setErrorClass("status-error");
      setTimeout(() => {
        setErrorClass("status");
      }, 3000);
      return;
    }
    const result = await searchPetsNearby(fullData.lat, fullData.lng, fullData.range);
    if (result.status === "success") {
      const petsFromLocalStorageParsed = JSON.parse(localStorage.getItem("searchPetsNearby"));

      //console.log("petsFromLocalStorage", petsFromLocalStorageParsed);
      navigate("/pets-nearby");
    } else {
      setErrorClass("status-error");
      setError(result.message);
      setTimeout(() => {
        setErrorClass("status");
      }, 3000);
    }
  }
  return (
    <div>
      <div className={css.root}>
        <div className={css["text-container"]}>
          <Text variant="title"> Buscar mascotas cerca</Text>
          <Text variant="subtitle"> Ingresa la siguente informacion para realizar la busqueda</Text>
        </div>
        <form id="my-form" className={css.form} onSubmit={handleSubmit(formSubmit)}>
          <MapSearch lastCoords={handleCoordsChange}>
            Pon un punto de referencia en el mapa en donde desesas buscar mascotas perdidas cerca.
          </MapSearch>
          <div className={css.range}>
            <TextField type="number" register={register} name="range">
              Rango de busqueda (metros)
            </TextField>
          </div>
        </form>
        <div className={css.buttons}>
          <Button style="blue" type="submit" form="my-form">
            Buscar mascotas
          </Button>
          <Button style="gray" type="button" onClick={() => navigate("/")}>
            Volver{" "}
          </Button>
        </div>
      </div>
      <Status className={css[errorClass]}>{error}</Status>
    </div>
  );
}
export { SearchPets };
