import React from "react";
import { Button } from "../../ui/button";
import { TextField, TextArea } from "../../ui/text-field";
import { Text } from "../../ui/text";
import { Status } from "../../ui/status";
import { UploadImage } from "../../components/upload-image";
import { Menu } from "../../components/menu";
import { Header } from "../../components/header";
import { ContactForm } from "../../components/contact-form";
import { Card } from "../../components/card";
import { EmptyResults } from "../../ui/empty-results";
import { MyMap } from "../../components/map-search";
function HomePage() {
	return (
		<div>
			<h1>Home Page</h1>
			<Button type="button" style="green">
				Click me
			</Button>
			<TextField type="email" placeholder="email" name="email" style="black">
				Email
			</TextField>
			<TextArea placeholder="Your message" name="message" style="black">
				{" "}
				informacion{" "}
			</TextArea>
			<Text variant="title"> Hola mundo</Text>
			<UploadImage>Modificar foto</UploadImage>
			<Header />
			<Card
				petImgUrl="/public/assets/pet.jpg"
				petName="Luna"
				petLocation="Bogota"
				type="report"
				ownerPetEmail="lala@lala"
			/>
			<EmptyResults>no hay reportes</EmptyResults>
			<MyMap />
		</div>
	);
}

export { HomePage };
