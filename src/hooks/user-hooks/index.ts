import { useNavigate } from "react-router";
import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const LOCAL_URL = process.env.REACT_APP_LOCAL_URL; //|| "http://localhost:3000"; // Asegúrate de definir tu URL base

//de esta forma no solo creamos el atomo local sino que tambien lo guarda en el localStorage
//sin localStorage seria const userAtom = atom({token: "", email: "", name: "", location: ""});

export const userAtom = atomWithStorage("user", {
	token: "",
	email: "",
	name: "",
	location: "",
});

//creamos user
const useSignUp = () => {
	const [user, setUserSignUp] = useAtom(userAtom);
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
				//seteamos los nuevos datos en el atom manteniendo los otros
				setUserSignUp((prev) => ({
					...prev,
					token: data.token,
					email: email,
				}));
			}
			return { status: data.status, message: data.message };
		} catch (error) {
			console.error("Error en el hook useSignUp del userHooks", error);
			return { status: "error" };
		}
	};

	return { createUser };
};
export { useSignUp };

//seteamos nombre y localidad del user
const useSetDataUser = () => {
	const [user, setUserData] = useAtom(userAtom);
	const token = user.token;
	if (!token) return { status: "error", message: "No estás autenticado" };
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
				setUserData((prev) => ({
					...prev,
					name: nombre,
					location: localidad,
				}));
			}
			return { status: data.status, message: data.message };
		} catch (error) {
			console.error("Error en el hook useSetDataUser del userHooks", error);
			return { status: "error" };
		}
	};
	return { user, setDataUser };
};
export { useSetDataUser };

// chequeo si estamos logueados
const useCheckUserLogin = () => {
	const [user] = useAtom(userAtom);
	const isLoggedIn = Boolean(user.token);
	return isLoggedIn;
};
export { useCheckUserLogin };

//cambio de password del user
const useSetNewPassword = () => {
	const [user, setUserPassword] = useAtom(userAtom);
	const token = user.token;
	const setNewPassword = async (password: string) => {
		if (!token) return { status: "error", message: "No estás autenticado" };
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
				setUserPassword((prev) => ({
					...prev,
					token: data.token,
				}));
			}
			return { status: data.status, message: data.message };
		} catch (error) {
			console.error("Error en el hook useSetNewPassword del userHooks", error);
			return { status: "error" };
		}
	};
	return { setNewPassword };
};

export { useSetNewPassword };

//login
const useLogIn = () => {
	const navigate = useNavigate();
	const [user, setUser] = useAtom(userAtom);
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
			}
			return { status: data.status, message: data.message };
		} catch (error) {
			console.error("Error en el hook useLogIn del userHooks", error);
			return { status: "error" };
		}
	};

	const logOut = () => {
		setUser({ token: "", email: "", name: "", location: "" });
		navigate("/");
	};
	return { user, logIn, logOut };
};
export { useLogIn };

//restablecer contraseña - obtener codigo de verificacion
const useGetCodePassword = () => {
	const [user, setUserEmail] = useAtom(userAtom);
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
			if (data.status === "success") {
				setUserEmail((prev) => ({
					...prev,
					email: email,
				}));
			}
			return { status: data.status, message: data.message };
		} catch (error) {
			console.error("error en el hook useGetCodePassword del userHooks", error);
			return { status: "error" };
		}
	};
	return { getCode };
};
export { useGetCodePassword };

//restablecer contraseña - enviar codigo de verificacion y cambiar la pass
const useSendCodePassword = () => {
	const [user, setUserToken] = useAtom(userAtom);
	const email = user.email;

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
			console.log(data);
			if (data.status === "success") {
				setUserToken((prev) => ({
					...prev,
					token: data.token,
				}));
			}
			return { status: data.status, message: data.message };
		} catch (error) {
			console.error("error en hook useSendCodePassword del userHooks", error);
			return { status: "error" };
		}
	};
	return { sendCode };
};
export { useSendCodePassword };
