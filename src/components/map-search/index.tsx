import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Overlay from "ol/Overlay";
import { fromLonLat, toLonLat } from "ol/proj";

interface Coords {
	lat: number;
	lng: number;
}

function OpenLayersMapWithSearch() {
	//En React, useRef es un hook que te permite guardar una referencia mutable
	// que persiste entre renders sin causar que el componente se vuelva a renderizar cuando cambia.
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const markerElRef = useRef<HTMLDivElement>(null);
	const popupElRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<Map>();
	const markerOverlayRef = useRef<Overlay>();
	const popupOverlayRef = useRef<Overlay>();
	//Los primeros tres (mapContainerRef, markerElRef, popupElRef) son referencias a elementos HTML (divs).
	//Los otros tres (mapRef, markerOverlayRef, popupOverlayRef) son referencias a objetos de OpenLayers
	// que controlan el mapa y los overlays.
	//Esto permite que React y OpenLayers trabajen juntos: React maneja el DOM y el estado, OpenLayers maneja
	// el mapa y posiciona esos elementos HTML en el mapa según coordenadas.

	const [coords, setCoords] = useState<Coords>({
		lat: -34.6037,
		lng: -58.3816,
	});
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	// Inicialización del mapa
	useEffect(() => {
		if (!mapContainerRef.current || !markerElRef.current || !popupElRef.current)
			return;

		const map = new Map({
			target: mapContainerRef.current,
			layers: [new TileLayer({ source: new OSM() })],
			view: new View({
				center: fromLonLat([coords.lng, coords.lat]),
				zoom: 13,
			}),
			controls: [],
		});
		mapRef.current = map;

		const markerOv = new Overlay({
			element: markerElRef.current,
			positioning: "bottom-center",
			stopEvent: false,
		});
		map.addOverlay(markerOv);
		markerOverlayRef.current = markerOv;

		const popupOv = new Overlay({
			element: popupElRef.current,
			positioning: "top-center",
			offset: [0, -10],
			stopEvent: false,
		});
		map.addOverlay(popupOv);
		popupOverlayRef.current = popupOv;

		const initialPos = fromLonLat([coords.lng, coords.lat]);
		markerOv.setPosition(initialPos);
		popupOv.setPosition(initialPos);

		map.on("singleclick", (e) => {
			const coord = e.coordinate;
			markerOv.setPosition(coord);
			popupOv.setPosition(coord);

			const [lng, lat] = toLonLat(coord);
			setCoords({ lat, lng });
			map.getView().animate({ center: coord, duration: 300 });
		});

		return () => map.setTarget(undefined);
	}, []);

	// Cuando cambian coords (por búsqueda), reposiciona y centra
	useEffect(() => {
		if (
			!mapRef.current ||
			!markerOverlayRef.current ||
			!popupOverlayRef.current
		)
			return;
		const pos = fromLonLat([coords.lng, coords.lat]);
		markerOverlayRef.current.setPosition(pos);
		popupOverlayRef.current.setPosition(pos);
		mapRef.current.getView().animate({ center: pos, duration: 300 });
	}, [coords]);

	// Maneja Enter en el input
	const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== "Enter") return;
		const query = searchTerm.trim();
		if (!query) return;

		setLoading(true);
		setErrorMsg(null);

		try {
			const res = await fetch(
				`https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=ar&q=${encodeURIComponent(
					query
				)}`
			);
			const data = await res.json();
			if (data.length > 0) {
				const { lat, lon } = data[0];
				setCoords({ lat: parseFloat(lat), lng: parseFloat(lon) });
			} else {
				setErrorMsg("No se encontró esa ubicación.");
			}
		} catch {
			setErrorMsg("Error al buscar la ubicación.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<div style={{ textAlign: "center", marginBottom: 12 }}>
				<input
					type="text"
					placeholder="Busca ciudad o lugar y presiona Enter"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					onKeyDown={handleKeyDown}
					disabled={loading}
					style={{
						width: "60%",
						padding: "8px 12px",
						fontSize: 14,
						borderRadius: 4,
						border: "1px solid #ccc",
					}}
				/>
				{errorMsg && (
					<div style={{ color: "red", marginTop: 8 }}>{errorMsg}</div>
				)}
			</div>

			{/* Contenedor del mapa */}
			<div ref={mapContainerRef} style={{ width: "100%", height: "400px" }} />

			{/* Marcador y popup */}
			<div
				ref={markerElRef}
				style={{
					width: 20,
					height: 20,
					backgroundColor: "#d33",
					border: "2px solid white",
					borderRadius: "50%",
					transform: "translate(-50%, -100%)",
				}}
			/>
			<div
				ref={popupElRef}
				style={{
					padding: "4px 8px",
					backgroundColor: "white",
					border: "1px solid #ccc",
					borderRadius: 4,
					whiteSpace: "nowrap",
					transform: "translate(-50%, -110%)",
				}}
			>
				Ubicación seleccionada
			</div>

			{/* Coordenadas */}
			<p style={{ textAlign: "center", marginTop: 8 }}>
				📍 {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
			</p>
		</div>
	);
}

export { OpenLayersMapWithSearch };

//1. useObtainCoords: buscar coordenadas por nombre
// Hook que recibe un término de búsqueda y devuelve las coordenadas encontradas
export function useObtainCoords(query: string): {
	coords: { lat: number; lng: number } | null;
	loading: boolean;
	error: string | null;
} {
	const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
		null
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!query) return;

		let isCancelled = false;
		setLoading(true);
		setError(null);

		fetch(
			`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
				query
			)}&countrycodes=ar`
		)
			.then((res) => res.json())
			.then((data) => {
				if (isCancelled) return;
				if (data.length > 0) {
					const { lat, lon } = data[0];
					setCoords({ lat: parseFloat(lat), lng: parseFloat(lon) });
				} else {
					setError("No se encontraron resultados");
				}
			})
			.catch(() => {
				if (!isCancelled) setError("Error al buscar coordenadas");
			})
			.finally(() => {
				if (!isCancelled) setLoading(false);
			});

		return () => {
			isCancelled = true;
		};
	}, [query]);

	return { coords, loading, error };
}
// //Cómo usarlo dentro del componente de mapa:
// const [searchTerm, setSearchTerm] = useState("");
// const { coords: foundCoords, loading, error } = useObtainCoords(searchTerm);

// useEffect(() => {
// 	if (foundCoords && mapRef.current) {
// 		// Centrar mapa y actualizar coordenadas
// 		const { lat, lng } = foundCoords;
// 		setCoords({ lat, lng }); // React state
// 		mapRef.current.getView().setCenter(fromLonLat([lng, lat]));
// 	}
// }, [foundCoords]);

//2. useReverseGeocode: obtener ciudad y provincia

export function useReverseGeocode(
	lat: number,
	lng: number
): {
	locationName: string;
	loading: boolean;
	error: string | null;
} {
	const [locationName, setLocationName] = useState("Cargando...");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (lat == null || lng == null) return;

		let isCancelled = false;
		setLoading(true);
		setError(null);

		fetch(
			`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
			{ headers: { "User-Agent": "mi-app/1.0" } }
		)
			.then((res) => res.json())
			.then((data) => {
				if (isCancelled) return;
				if (data.address) {
					const { city, town, village, state } = data.address;
					const ciudad = city || town || village || "Desconocida";
					const provincia = state || "Desconocida";
					setLocationName(`${ciudad}, ${provincia}`);
				} else {
					setLocationName("Ubicación desconocida");
				}
			})
			.catch(() => {
				if (!isCancelled) {
					setError("Error al obtener localidad");
					setLocationName("Ubicación desconocida");
				}
			})
			.finally(() => {
				if (!isCancelled) setLoading(false);
			});

		return () => {
			isCancelled = true;
		};
	}, [lat, lng]);

	return { locationName, loading, error };
}

//Cómo integrarlo en el componente:
// const { locationName, loading: ciudadLoading } = useReverseGeocode(
//   coords.lat,
//   coords.lng
// );

// return (
//   <>
//     {/* ...mapa y marcador */}
//     <p>
//       {ciudadLoading ? "Cargando ciudad..." : locationName}
//     </p>
//   </>
// );
