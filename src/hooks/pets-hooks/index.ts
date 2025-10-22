import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const LOCAL_URL = "http://localhost:3000"; // Asegúrate de definir tu URL base

//busqueda de mascotas cerca de una ubicacion
const useSearchPets = () => {
  const [pets, setPets] = useState([]);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");

  const searchPetsNearby = async (lat, lng, range) => {
    try {
      const response = await fetch(
        LOCAL_URL + "/search-pets?lat=" + lat + "&lng=" + lng + "&rango=" + range,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        setPets(data.pets);
        localStorage.setItem("searchPetsNearby", JSON.stringify(data.pets));
      }
      setStatus(data.status);
      setMessage(data.message);
      return { status: data.status, message: data.message };
    } catch (error) {
      console.error("Error en el hook searchPetsNearby del petsHooks", error);
      return { status: "error" };
    }
  };
  return { pets, searchPetsNearby, status, message };
};
export { useSearchPets };
