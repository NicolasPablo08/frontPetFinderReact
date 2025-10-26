import { set } from "ol/transform";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { SearchPets } from "../../pages/search-pets";

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
	try {
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
	} catch (error) {
		console.error("Error al obtener la ubicación:", error);
		return "Ubicación desconocida";
	}
}

//obtener mascotas perdidas de un user
const useGetPetsUser = () => {
	const [petsUser, setPetsUser] = useState([]);
	const [status, setStatus] = useState(null);
	const [message, setMessage] = useState("");

	const getPetsUser = async (token: string) => {
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
				const petsWithUbication = await Promise.all(
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

				setPetsUser(petsWithUbication);
				localStorage.setItem("petsUser", JSON.stringify(petsWithUbication));
				return {
					status: data.status,
					message: data.message,
					pets: petsWithUbication,
				};
			}
			setStatus(data.status);
			setMessage(data.message);
			return { status: data.status, message: data.message };
		} catch (error) {
			console.error("Error en el hook getPetsUser del petsHooks", error);
			return { status: "error" };
		}
	};
	return { petsUser, getPetsUser, status, message };
};
export { useGetPetsUser };

//crear reporte de mascota perdida vinculada a un usuario
const useCreatePetReport = () => {
	const [status, setStatus] = useState(null);
	const [message, setMessage] = useState("");
	const createReport = async (
		name: string,
		imageUrl: string,
		lat: number,
		lng: number
	) => {
		const token = localStorage.getItem("userToken");
		try {
			if (!token) return;
			const response = await fetch(LOCAL_URL + "/me/my-pets", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`, // Acá va el token
				},
				body: JSON.stringify({
					name,
					imageUrl,
					lat,
					lng,
				}),
			});
			const data = await response.json();
			setStatus(data.status);
			setMessage(data.message);
			return { status: data.status, message: data.message };
		} catch (error) {
			console.error("Error en el metodo createPetReport del state", error);
			setStatus("error");
			return;
		}
	};
	return { createReport, status, message };
};
export { useCreatePetReport };

//editar reporte de una mascota vinculada a un user
const useEditPetReport = () => {
	const [status, setStatus] = useState(null);
	const [message, setMessage] = useState("");
	const editReport = async (
		name: string,
		imageUrl: string,
		lat: number,
		lng: number,
		petId: number
	) => {
		const token = localStorage.getItem("userToken");
		try {
			if (!token) return;
			const response = await fetch(LOCAL_URL + "/me/my-pets/" + petId, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`, // Acá va el token
				},
				body: JSON.stringify({
					name,
					imageUrl,
					lat,
					lng,
				}),
			});
			const data = await response.json();
			setStatus(data.status);
			setMessage(data.message);
			return { status: data.status, message: data.message };
		} catch (error) {
			console.error("Error en el hook useEditPetReport del petsHooks", error);
			setStatus("error");
			return;
		}
	};
	return { editReport, status, message };
};
export { useEditPetReport };

//eliminar definitivamente el reporte de una mascota de un usuario
const useDeletePetReport = () => {
	const [status, setStatus] = useState(null);
	const [message, setMessage] = useState("");
	const deletePetReport = async (petId: number) => {
		const token = localStorage.getItem("userToken");
		try {
			const response = await fetch(LOCAL_URL + "/me/my-pets/" + petId, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`, // Acá va el token
				},
			});
			const data = await response.json();
			setStatus(data.status);
			setMessage(data.message);
			return { status: data.status, message: data.message };
		} catch (error) {
			console.error("Error en el hook useEditPetReport del petsHooks", error);
			setStatus("error");
			return;
		}
	};
	return { deletePetReport, status, message };
};
export { useDeletePetReport };

// async deletePetReport(petId: number) {
// 	const cb = this.getState();
// 	const token = cb.user.token;
// 	try {
// 		const response = await fetch(LOCAL_URL + "/me/my-pets/" + petId, {
// 			method: "DELETE",
// 			headers: {
// 				"Content-Type": "application/json",
// 				Authorization: `Bearer ${token}`, // Acá va el token
// 			},
// 		});
// 		const data = await response.json(); //asi devuelve la respuesta el metodo http
// 		if (data.status === "success") {
// 			cb.petsUser = cb.petsUser.filter((pet) => pet.petId !== petId);
// 			this.setState(cb);
// 		}
// 		return { status: data.status, message: data.message };
// 	} catch (error) {
// 		console.error("Error en el metodo deletePetReport del state", error);
// 		return { status: "error" };
// 	}
// },
