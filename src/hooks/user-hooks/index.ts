// import { useState } from "react";

// const LOCAL_URL = "http://localhost:3000"; // Asegúrate de definir tu URL base

// const useLogIn = () => {
// 	const [user, setUser] = useState({
// 		token: "",
// 		email: "",
// 		name: "",
// 		location: "",
// 	});
// 	const [status, setStatus] = useState(null);
// 	const [message, setMessage] = useState("");

// 	const logIn = async (email, password) => {
// 		try {
// 			const response = await fetch(LOCAL_URL + "/auth/token", {
// 				method: "POST",
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 				body: JSON.stringify({
// 					email,
// 					password,
// 				}),
// 			});
// 			const data = await response.json();

// 			if (data.status === "success") {
// 				setUser({
// 					token: data.token,
// 					email: email,
// 					name: data.name || "",
// 					location: data.localidad || "",
// 				});
// 				//await getAllPetsUser(); // Asegúrate de definir esta función
// 			}
// 			setStatus(data.status);
// 			setMessage(data.message);
// 			return { status: data.status, message: data.message };
// 		} catch (error) {
// 			console.error("Error en el método logIn del hook", error);
// 			setStatus("error");
// 			return { status: "error" };
// 		}
// 	};

// 	return { user, logIn, status, message };
// };

// export { useLogIn };

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const LOCAL_URL = "http://localhost:3000"; // Asegúrate de definir tu URL base

const useLogIn = () => {
	const navigate = useNavigate();
	const [user, setUser] = useState(() => {
		// Recuperar datos de localStorage al inicializar el estado
		const token = localStorage.getItem("userToken");
		const email = localStorage.getItem("userEmail");
		const name = localStorage.getItem("userName");
		const location = localStorage.getItem("userLocation");
		return {
			token: token || "",
			email: email || "",
			name: name || "",
			location: location || "",
		};
	});
	const [status, setStatus] = useState(null);
	const [message, setMessage] = useState("");

	const logIn = async (email, password) => {
		try {
			const response = await fetch(LOCAL_URL + "/auth/token", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					password,
				}),
			});
			const data = await response.json();

			if (data.status === "success") {
				setUser({
					token: data.token,
					email: email,
					name: data.name || "",
					location: data.localidad || "",
				});
				// Guardar en localStorage
				localStorage.setItem("userToken", data.token);
				localStorage.setItem("userEmail", email);
				localStorage.setItem("userName", data.name || "");
				localStorage.setItem("userLocation", data.localidad || "");
			}
			setStatus(data.status);
			setMessage(data.message);
			return { status: data.status, message: data.message };
		} catch (error) {
			console.error("Error en el método logIn del hook", error);
			setStatus("error");
			return { status: "error" };
		}
	};

	const logOut = () => {
		setUser({ token: "", email: "", name: "", location: "" });
		localStorage.removeItem("userToken");
		localStorage.removeItem("userEmail");
		localStorage.removeItem("userName");
		localStorage.removeItem("userLocation");
		navigate("/login");
	};
	return { user, logIn, logOut, status, message };
};

export { useLogIn };
