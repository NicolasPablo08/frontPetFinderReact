import React from "react";
import * as css from "./index.css";
import { UseFormRegister } from "react-hook-form"; // Importa el tipo register de useForm

type TextFieldProps = {
	type: "text" | "email" | "password"; //propiedades del type de input
	placeholder?: string;
	name: string;
	register: UseFormRegister<any>; // Agregá el tipo para register
};

export function TextField(props: TextFieldProps) {
	//console.log(css);

	return (
		<input
			type={props.type}
			{...props.register(props.name)}
			placeholder={props.placeholder}
			className={css["input-text"]} // siq queremos poner guiones en la clase, debemos declaralo entre []
		/>
	);
}
