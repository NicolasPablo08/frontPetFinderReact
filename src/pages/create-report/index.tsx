import React, { useState, useRef } from "react";
import * as css from "./index.css";
import { Text } from "../../ui/text";
import { MapSearch } from "../../components/map-search";
import { Button } from "../../ui/button";
import { TextField } from "../../ui/text-field";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Status } from "../../ui/status";
import { useCreatePetReport } from "../../hooks/pets-hooks";

function CreateReport() {
	const { register, handleSubmit } = useForm();
	const navigate = useNavigate();
	const { createReport, status, message } = useCreatePetReport();
	const [error, setError] = useState("");
	const [errorClass, setErrorClass] = useState("status");
	const [lastCoords, setLastCoords] = useState({
		lat: -34.6037,
		lng: -58.3816,
	});
	const inputFileRef = useRef(null);
	const [image, setImage] = useState("public/assets/icon-img.png"); // para montar solo la url en el src de la imagen
	const [file, setFile] = useState(null); // para obtener la imagen y enviarla con el formulario, ya que es distinto el formato a la url de la imagen

	//subir imagen, se oculto el input-file para que el button cumpla su funcion,
	//entonces al hacer click en el button dispara handleButtonclick que dispara el click
	//del input-file y este llama a la funcion handleImageChange
	//todo esto por no poder darle estilos al input-file
	const handleButtonClick = () => {
		inputFileRef.current.click(); // Dispara el click en el input oculto
	};
	const handleImageChange = (event) => {
		const selectedFile = event.target.files[0]; // Obtiene objeto con datos el primer archivo seleccionado
		const fileWebPath = URL.createObjectURL(selectedFile); // crea una url de la imagen para montarla en el src de img
		setImage(fileWebPath); //guarda la url de la imagen para el src de img

		const reader = new FileReader();
		reader.onloadend = () => {
			setFile(reader.result); // Guarda el objeto file de la imagen para el form
			//console.log(reader.result);
		};
		//console.log(reader.readAsDataURL(selectedFile));
		reader.readAsDataURL(selectedFile);
	};

	//obtiene las coordenadas del mapa cada vez que se ponga un nuevo punto
	const handleCoordsChange = (coords) => {
		setLastCoords(coords);
	};

	//obtiene los datos del formulario y les agrega las coordenadas
	async function formSubmit(data) {
		if (!lastCoords.lat || !lastCoords.lng || !data.name || !file) {
			setError("Todos los campos son obligatorios");
			setErrorClass("status-error");
			setTimeout(() => {
				setErrorClass("status");
			}, 3000);
			return;
		}
		const result = await createReport(
			data.name,
			file,
			lastCoords.lat,
			lastCoords.lng
		);
		if (result.status === "success") {
			setErrorClass("status-error");
			setError(result.message);
			setTimeout(() => {
				navigate("/my-pets-lost");
			}, 3000);
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
					<Text variant="title"> Reportar mascota perdida</Text>
					<Text variant="subtitle">
						{" "}
						Ingresá la siguiente información para realizar el reporte de la
						mascota
					</Text>
				</div>
				<form
					id="my-form"
					className={css.form}
					onSubmit={handleSubmit(formSubmit)}
				>
					<div className={css.name}>
						<TextField type="text" register={register} name="name">
							Nombre
						</TextField>
					</div>
					<div className={css["img-container"]}>
						<input
							type="file"
							accept="image/*"
							ref={inputFileRef}
							style={{ display: "none" }}
							onChange={handleImageChange}
						/>
						<img src={image} className={css.img} />
						<Button style="blue" type="button" onClick={handleButtonClick}>
							{" "}
							Agregar foto{" "}
						</Button>
					</div>
					<MapSearch lastCoords={handleCoordsChange}>
						Pon un punto de referencia en el mapa, por ejemplo la ubicacion
						donde lo viste por ultima vez.
					</MapSearch>
				</form>
				<div className={css.buttons}>
					<Button style="blue" type="submit" form="my-form">
						Reportar mascota
					</Button>
					<Button
						style="gray"
						type="button"
						onClick={() => navigate("/my-pets-lost")}
					>
						Volver{" "}
					</Button>
				</div>
			</div>
			<Status className={css[errorClass]}>{error}</Status>
		</div>
	);
}
export { CreateReport };
