import React from "react";
import * as css from "./index.css";
import { UseFormRegister } from "react-hook-form"; // Importa el tipo register de useForm

type TextFieldProps = {
  type: "text" | "email" | "password"; //propiedades del type de input
  placeholder?: string;
  name: string;
  register?: UseFormRegister<any>; // Agregá el tipo para register
  style?: "black";
  children: React.ReactNode; //para que el label pueda tener íconos u otro contenido, lo ideal es usar React.ReactNode
};

function TextField(props: TextFieldProps) {
  return (
    <div className={`${css.root} ${css[props.style]}`}>
      <label>
        <h4 className={css["text-label"]}>{props.children}</h4>
        <input
          type={props.type}
          {...(props.register ? props.register(props.name) : {})} // Si register está definido, lo usamos; de lo contrario, pasamos un objeto vacío
          placeholder={props.placeholder}
          className={css["input-text"]} // siq queremos poner guiones en la clase, debemos declaralo entre []
        />
      </label>
    </div>
  );
}
export { TextField };

type TextAreaProps = {
  placeholder?: string;
  name: string;
  register?: UseFormRegister<any>; // Agregá el tipo para register
  style?: "black";
  children: React.ReactNode; //para que el label pueda tener íconos u otro contenido, lo ideal es usar React.ReactNode
};
function TextArea(props: TextAreaProps) {
  return (
    <div className={`${css.root} ${css[props.style]}`}>
      <label>
        <h4 className={css["text-label"]}>{props.children}</h4>
        <textarea
          {...(props.register ? props.register(props.name) : {})} // Si register está definido, lo usamos; de lo contrario, pasamos un objeto vacío
          placeholder={props.placeholder}
          className={css["text-area"]} // siq queremos poner guiones en la clase, debemos declaralo entre []
        />
      </label>
    </div>
  );
}
export { TextArea };
