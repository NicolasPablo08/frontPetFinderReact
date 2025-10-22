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
				LOCAL_URL +
					"/search-pets?lat=" +
					lat +
					"&lng=" +
					lng +
					"&rango=" +
					range,
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

//envio de formulario de mascota avistada
const useSendFormPetNearby = () => {
	const [status, setStatus] = useState(null);
	const [message, setMessage] = useState("");
	const sendPetForm = async (
		nombre: string,
		email: string,
		telefono: string,
		informacion: string,
		namePet: string
	) => {
		try {
			const response = await fetch(LOCAL_URL + "/send-email", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					nombre,
					email,
					telefono,
					informacion,
					namePet,
				}),
			});
			const data = await response.json();
			console.log(data);

			setStatus(data.status);
			setMessage(data.message);
			return { status: data.status, message: data.message };
		} catch (error) {
			console.error(
				"Error en el hook useSendFormPetNearby del petsHooks",
				error
			);
			return { status: "error" };
		}
	};
	return { sendPetForm, status, message };
};
export { useSendFormPetNearby };

//obtener ciudad y provincia a traves del lat y lng
export async function getCiudadProvincia(lat: number, lng: number) {
	const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`;
	const response = await fetch(url, {
		headers: { "User-Agent": "mi-app/1.0" }, // algunos servidores lo requieren
	});
	const data = await response.json();

	if (data && data.address) {
		const { city, town, village, state } = data.address;
		const ciudad = city || town || village || "Desconocida";
		const provincia = state || "Desconocida";
		return `${ciudad}, ${provincia}`;
	}

	return "Ubicación desconocida";
}

//obtener mascotas perdidas de un user
const useGetPetsUser = () => {
	const [petsUser, setPetsUser] = useState([]);
	const [status, setStatus] = useState(null);
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false); // Estado de carga

	const getPetsUser = async (token: string) => {
		setLoading(true); // Inicia la carga

		try {
			const response = await fetch(LOCAL_URL + "/me/my-pets", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`, // Acá va el token
				},
			});
			const data = await response.json();

			if (data.status === "success") {
				const searchPets = await Promise.all(
					data.petsLost.map(async (pet) => {
						const ubicacion = await getCiudadProvincia(pet.lat, pet.lng);
						return {
							petId: pet.id,
							name: pet.name,
							lat: pet.lat,
							lng: pet.lng,
							imgUrl: pet.imageUrl,
							ubicacion, // agregamos la ubicación acá
						};
					})
				);
				console.log("petsUser en el hook", searchPets);
				setPetsUser(searchPets);
				localStorage.setItem("petsUser", JSON.stringify(searchPets));
			}
			setStatus(data.status);
			setMessage(data.message);
		} catch (error) {
			console.error("Error en el hook getPetsUser del petsHooks", error);
			return { status: "error" };
		} finally {
			setLoading(false); // Finaliza la carga
		}
	};
	return { petsUser, getPetsUser, status, message, loading };
};
export { useGetPetsUser };

//  async getAllPetsUser() {
//     const cb = this.getState();
//     const token = cb.user.token;
//     try {
//       const response = await fetch(LOCAL_URL + "/me/my-pets", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`, // Acá va el token
//         },
//       });
//       const data = await response.json();
//       if (data.status === "success") {
//         const searchPets = await Promise.all(
//           data.petsLost.map(async (pet) => {
//             const ubicacion = await getCiudadProvincia(pet.lat, pet.lng);
//             return {
//               petId: pet.id,
//               name: pet.name,
//               lat: pet.lat,
//               lng: pet.lng,
//               imgUrl: pet.imageUrl,
//               ubicacion, // agregamos la ubicación acá
//             };
//           })
//         );
//         cb.petsUser = searchPets;
//         this.setState(cb);
//       }
//       return "ok";
//     } catch (error) {
//       console.error("Error en getAllPetsUser:", error);
//     }
//     return cb.petsUser;
//   },
