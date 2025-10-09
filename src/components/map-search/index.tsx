// import React, { useState } from "react";
// import * as css from "./index.css";
// import { Text } from "../../ui/text";
// import { TextField } from "../../ui/text-field";
// type MapSearchProps = {};

// function MapSearch(props: MapSearchProps) {
// 	return (
// 		<div className={css.root}>
// 			<TextField
// 				type="text"
// 				placeholder="Ubicacion + Enter..."
// 				name="ubicacion"
// 			>
// 				Ubicación (por ej. Ciudad, provincia)
// 			</TextField>
// 			<div className={css["map-container"]}>
// 				<Text variant="text">
// 					Pon un punto de referencia en el mapa, por ejemplo, la ubicacion donde
// 					lo viste por ultima vez
// 				</Text>
// 				<div className={css.map}></div>
// 			</div>
// 		</div>
// 	);
// }
// export { MapSearch };

import React, { useEffect, useRef, useState } from "react";
import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	useMapEvents,
} from "react-leaflet";
import L from "leaflet";

// Icono personalizado
const customIcon = L.icon({
	iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
	shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41],
});

// Componente para manejar eventos del mapa
function LocationMarker({ onLocationSelect }) {
	useMapEvents({
		click(e) {
			onLocationSelect(e.latlng);
		},
	});

	return null;
}

function MyMap({ initialLat = -34.6, initialLng = -58.38 }) {
	const [markerPosition, setMarkerPosition] = useState([
		initialLat,
		initialLng,
	]);

	const handleLocationSelect = (latlng) => {
		setMarkerPosition([latlng.lat, latlng.lng]);
	};

	return (
		<MapContainer
			center={[initialLat, initialLng]}
			zoom={13}
			style={{ height: "400px", width: "100%" }}
		>
			<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
			<LocationMarker onLocationSelect={handleLocationSelect} />
			<Marker position={markerPosition} icon={customIcon}>
				<Popup>Ubicación seleccionada</Popup>
			</Marker>
		</MapContainer>
	);
}

export { MyMap };
