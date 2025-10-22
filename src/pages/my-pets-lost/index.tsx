import React, { useState, useEffect } from "react";
import * as css from "./index.css";
import { Text } from "../../ui/text";
import { Button } from "../../ui/button";
import { useNavigate } from "react-router";
import { Card } from "../../components/card";
import { EmptyResults } from "../../ui/empty-results";
import { useLogIn } from "../../hooks/user-hooks";
import { useGetPetsUser } from "../../hooks/pets-hooks";
import { Waiting } from "../../components/waiting";

function MyPetsLost() {
	const [classWaiting, setClassWaiting] = useState(false);
	const { user, logOut } = useLogIn();
	const navigate = useNavigate();
	const petsLost = JSON.parse(localStorage.getItem("myPetsLost")) || [];
	const [selectedPet, setSelectedPet] = useState(null); //para pasar la mascota seleccionada al formulario
	const { petsUser, getPetsUser, status, message, loading } = useGetPetsUser();
	//me envia a login si no estoy logueado
	useEffect(() => {
		if (!user.token) {
			navigate("/login");
		} else {
			getPetsUser(user.token); // Llama a la función para obtener las mascotas
		}
	}, [user.token, navigate]);
	return (
		<div>
			<div className={css.root}>
				{loading ? (
					<Waiting />
				) : petsUser.length === 0 ? (
					<EmptyResults>
						No tienes mascotas perdidas, si perdiste una crea un reporte
					</EmptyResults>
				) : (
					<>
						<Text variant="title"> Mascotas perdidas </Text>
						<div className={css["card-container"]}>
							{petsUser.map((pet) => (
								<Card
									type="edit"
									petImgUrl={pet.imgUrl}
									petName={pet.name}
									petLocation={pet.ubicacion}
									//User.email: 'limam24101@skateru.com',Eso sugiere que la propiedad User.email está aplanada (flattened),
									// es decir, no tenés un objeto User, sino una clave con punto en el nombre ("User.email").
									// y se accede asi pet["User.email"]
									ownerPetEmail={pet["User.email"]}
									key={pet.petId}
								/>
							))}
						</div>
					</>
				)}
				<Button
					style="blue"
					className={css.button}
					type="button"
					onClick={() => navigate("/create-report")}
				>
					{" "}
					Nuevo reporte{" "}
				</Button>
			</div>
		</div>
	);
}
export { MyPetsLost };
