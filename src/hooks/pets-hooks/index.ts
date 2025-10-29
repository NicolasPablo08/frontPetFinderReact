import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { getCiudadProvincia } from "../map-hooks";
import { userAtom } from "../user-hooks";

const LOCAL_URL = process.env.REACT_APP_LOCAL_URL; //"http://localhost:3000"; // Asegúrate de definir tu URL base
//de esta forma no solo creamos el atomo local sino que tambien lo guarda en el localStorage
//sin localStorage seria const userAtom = atom({token: "", email: "", name: "", location: ""});
const petsFromSeacrhAtom = atomWithStorage("petsFromSearch", []);

//busqueda de mascotas cerca de una ubicacion
const useSearchPets = () => {
	const [petsFromSearch, setPetsFromSearch] = useAtom(petsFromSeacrhAtom);

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
				const petsFromSearchWithUbication = await Promise.all(
					data.pets.map(async (pet) => {
						const ubicacion = await getCiudadProvincia(pet.lat, pet.lng);

						return {
							petId: pet.id,
							name: pet.name,
							imgUrl: pet.imageUrl,
							ownerPetEmail: pet["User.email"],
							ubicacion, // agregamos la ubicación acá
						};
					})
				);
				setPetsFromSearch(petsFromSearchWithUbication);
			}
			return { status: data.status, message: data.message };
		} catch (error) {
			console.error("Error en el hook searchPetsNearby del petsHooks", error);
			return { status: "error" };
		}
	};
	return { petsFromSearch, searchPetsNearby };
};
export { useSearchPets };

//envio de formulario de mascota avistada
const useSendFormPetNearby = () => {
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
			return { status: data.status, message: data.message };
		} catch (error) {
			console.error(
				"Error en el hook useSendFormPetNearby del petsHooks",
				error
			);
			return { status: "error" };
		}
	};
	return { sendPetForm };
};
export { useSendFormPetNearby };

/////////////////////////////////////////////////
const petsUserAtom = atomWithStorage("petsUser", []);
//obtener mascotas perdidas de un user
const useGetPetsUser = () => {
	const [petsUser, setPetsUser] = useAtom(petsUserAtom);
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
			}
			return { status: data.status, message: data.message };
		} catch (error) {
			console.error("Error en el hook getPetsUser del petsHooks", error);
			return { status: "error" };
		}
	};
	return { petsUser, getPetsUser };
};
export { useGetPetsUser };

//crear reporte de mascota perdida vinculada a un usuario
const useCreatePetReport = () => {
	const [petsUser] = useAtom(userAtom);
	const token = petsUser.token;
	const createReport = async (
		name: string,
		imageUrl: string,
		lat: number,
		lng: number
	) => {
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
			return { status: data.status, message: data.message };
		} catch (error) {
			console.error("Error en el metodo createPetReport del state", error);
			return { status: "error" };
		}
	};
	return { createReport };
};
export { useCreatePetReport };

//editar reporte de una mascota vinculada a un user
const useEditPetReport = () => {
	const [petsUser] = useAtom(userAtom);
	const token = petsUser.token;
	const editReport = async (
		name: string,
		imageUrl: string,
		lat: number,
		lng: number,
		petId: number
	) => {
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

			return { status: data.status, message: data.message };
		} catch (error) {
			console.error("Error en el hook useEditPetReport del petsHooks", error);
			return { status: "error" };
		}
	};
	return { editReport };
};
export { useEditPetReport };

//eliminar definitivamente el reporte de una mascota de un usuario
const useDeletePetReport = () => {
	const [petsUser] = useAtom(userAtom);
	const token = petsUser.token;
	const deletePetReport = async (petId: number) => {
		try {
			const response = await fetch(LOCAL_URL + "/me/my-pets/" + petId, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`, // Acá va el token
				},
			});
			const data = await response.json();
			return { status: data.status, message: data.message };
		} catch (error) {
			console.error("Error en el hook useEditPetReport del petsHooks", error);
			return { status: "error" };
		}
	};
	return { deletePetReport };
};
export { useDeletePetReport };
