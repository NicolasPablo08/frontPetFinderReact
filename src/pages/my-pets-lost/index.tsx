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
	const [myPets, setMyPets] = useState([]);
	const { user, logOut } = useLogIn();
	const navigate = useNavigate();
	const petsLost = JSON.parse(localStorage.getItem("myPetsLost")) || [];
	const [selectedPet, setSelectedPet] = useState(null); //para pasar la mascota seleccionada al formulario
	const { petsUser, getPetsUser, status, message } = useGetPetsUser();
	//me envia a login si no estoy logueado
	useEffect(() => {
		const fetchPets = async () => {
			if (!user.token) {
				navigate("/login");
			} else {
				setClassWaiting(true);
				const result = await getPetsUser(user.token); // Llama a la función para obtener las mascotas
				if (result) {
					setClassWaiting(false);
					setMyPets(result.pets);
				}
			}
		};
		fetchPets();
	}, [user.token, navigate]);
	return (
		<div>
			{classWaiting ? (
				<Waiting />
			) : (
				<div className={css.root}>
					{myPets.length === 0 ? (
						<EmptyResults>
							No tienes mascotas perdidas, si perdiste una crea un reporte
						</EmptyResults>
					) : (
						<>
							<Text variant="title"> Mascotas perdidas </Text>
							<div className={css["card-container"]}>
								{myPets.map((pet) => (
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
										petId={pet.petId}
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
			)}
		</div>
	);
}
export { MyPetsLost };
