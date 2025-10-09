import React, { useState } from "react";
import * as css from "./index.css";
import { Button } from "../../ui/button";

type UploadImageProps = {
	children: React.ReactNode;
};

function UploadImage(props: UploadImageProps) {
	const [image, setImage] = useState<string | null>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]; // Usamos optional chaining
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImage(reader.result as string); // Guardamos la imagen en el estado
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className={css.root}>
			<div className={css.container}>
				<input
					type="file"
					accept="image/*"
					id="fileInput"
					style={{ display: "none" }}
					onChange={handleFileChange}
				/>
				{image ? (
					<img className={css.imagePreview} src={image} alt="Vista previa" />
				) : (
					<img
						className={css.imagePreview}
						src="public/assets/icon-img.png" // ruta del ícono por defecto
						alt="Icono de imagen"
					/>
				)}
			</div>
			<Button
				onClick={() => document.getElementById("fileInput")?.click()}
				type="button"
				style="blue"
			>
				{props.children}
			</Button>
		</div>
	);
}

export { UploadImage };
