import { set } from "ol/transform";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const LOCAL_URL = "http://localhost:3000"; // Asegúrate de definir tu URL base

//creamos user
const useSignUp = () => {
	const [user, setUser] = useState({ email: "", token: "" });
	const [status, setStatus] = useState(null);
	const [message, setMessage] = useState("");
	const createUser = async (email, password) => {
		try {
			const response = await fetch(LOCAL_URL + "/auth", {
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
				setUser({ token: data.token, email: email });
				localStorage.setItem("userToken", data.token);
				localStorage.setItem("userEmail", email);
			}
			setStatus(data.status);
			setMessage(data.message);
			return { status: data.status, message: data.message };
		} catch (error) {
			console.error("Error en el metodo createUser del state", error);
			return { status: "error" };
		}
	};

	return { user, createUser, status, message };
};
export { useSignUp };

//seteamos nombre y localidad del user
const useSetDataUser = () => {
	const [status, setStatus] = useState(null);
	const [message, setMessage] = useState("");
	const token = localStorage.getItem("userToken");
	if (!token) {
		setStatus("error");
		setMessage("No estás autenticado");
		return { status: "error", message: "No estás autenticado" };
	}
	const [user, setUser] = useState(() => {
		const name = localStorage.getItem("userName");
		const location = localStorage.getItem("userLocation");
		return {
			name: name || "",
			location: location || "",
		};
	});
	const setDataUser = async (nombre, localidad) => {
		try {
			const response = await fetch(LOCAL_URL + "/me/my-data", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`, // Acá va el token
				},
				body: JSON.stringify({
					name: nombre,
					location: localidad,
				}),
			});
			const data = await response.json();
			if (data.status === "success") {
				setUser({ name: nombre, location: localidad });
				localStorage.setItem("userName", nombre);
				localStorage.setItem("userLocation", localidad);
			}
			setStatus(data.status);
			setMessage(data.message);
			return { status: data.status, message: data.message };
		} catch (error) {
			console.error("Error en el metodo setDatesUser del state", error);
			return { status: "error" };
		}
	};
	return { user, setDataUser, status, message };
};
export { useSetDataUser };

//cambio de password del user
const useSetNewPassword = () => {
	const [status, setStatus] = useState(null);
	const [message, setMessage] = useState("");
	const token = localStorage.getItem("userToken");
	const setNewPassword = async (password: string) => {
		if (!token) {
			setStatus("error");
			setMessage("No estás autenticado");
			return { status: "error", message: "No estás autenticado" };
		}
		try {
			const response = await fetch(LOCAL_URL + "/me/my-pass", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`, // Acá va el token
				},
				body: JSON.stringify({
					password,
				}),
			});
			const data = await response.json();
			if (data.status === "success") {
				localStorage.setItem("userToken", data.token);
			}
			setStatus(data.status);
			setMessage(data.message);
			return { status: data.status, message: data.message };
		} catch (error) {
			console.error("Error en el metodo setNewPassword del state", error);
			return { status: "error" };
		}
	};
	return { setNewPassword, status, message };
};

export { useSetNewPassword };
//login
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

//restablecer contraseña - obtener codigo de verificacion
const useGetCodePassword = () => {
	const [status, setStatus] = useState(null);
	const [message, setMessage] = useState("");
	const getCode = async (email: string) => {
		try {
			const response = await fetch(LOCAL_URL + "/create-code", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});
			const data = await response.json();
			localStorage.setItem("userEmail", email);

			setStatus(data.status);
			setMessage(data.message);
			return { status: data.status, message: data.message };
		} catch (error) {
			console.error("error en getCode del state", error);
			return { status: "error" };
		}
	};
	return { getCode, status, message };
};
export { useGetCodePassword };

//   //restablecer contraseña - enviar codigo de verificacion y cambiar la pass
const useSendCodePassword = () => {
	const [status, setStatus] = useState(null);
	const [message, setMessage] = useState("");
	const email = localStorage.getItem("userEmail");

	const sendCode = async (codigo: string) => {
		try {
			const respuesta = await fetch(LOCAL_URL + "/compare-code", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ codigo, email }),
			});
			const data = await respuesta.json();
			if (data.status === "success") {
				localStorage.setItem("userToken", data.token);
			}
			setStatus(data.status);
			setMessage(data.message);
			return { status: data.status, message: data.message };
		} catch (error) {
			console.error("error en sendCode del state", error);
			return { status: "error" };
		}
	};
	return { sendCode, status, message };
};
export { useSendCodePassword };
