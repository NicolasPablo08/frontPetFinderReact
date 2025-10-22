import React, { useEffect, useRef, useState } from "react";
import * as css from "./index.css";
import { TextField } from "../../ui/text-field";
import { Text } from "../../ui/text";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Overlay from "ol/Overlay";
import { fromLonLat, toLonLat } from "ol/proj";

type Coords = {
  lat: number;
  lng: number;
};
type MapSearchProps = {
  lastCoords?: (coords: Coords) => void;
  children?: React.ReactNode;
};

function MapSearch(props: MapSearchProps) {
  //En React, useRef es un hook que te permite guardar una referencia mutable
  // que persiste entre renders sin causar que el componente se vuelva a renderizar cuando cambia.
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerElRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map>();
  const markerOverlayRef = useRef<Overlay>();
  //Los primeros dos (mapContainerRef, markerElRef) son referencias a elementos HTML (divs).
  //Los otros dos (mapRef, markerOverlayRef) son referencias a objetos de OpenLayers
  // que controlan el mapa y los overlays.
  //Esto permite que React y OpenLayers trabajen juntos: React maneja el DOM y el estado, OpenLayers maneja
  // el mapa y posiciona esos elementos HTML en el mapa según coordenadas.

  const [coords, setCoords] = useState<Coords>({
    lat: -34.6037,
    lng: -58.3816,
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Inicialización del mapa
  useEffect(() => {
    if (!mapContainerRef.current || !markerElRef.current) return;

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

    const initialPos = fromLonLat([coords.lng, coords.lat]);
    markerOv.setPosition(initialPos);

    map.on("singleclick", (e) => {
      const coord = e.coordinate;
      markerOv.setPosition(coord);

      const [lng, lat] = toLonLat(coord);
      setCoords({ lat, lng });
      // Llamar a la función del padre con las nuevas coordenadas
      props.lastCoords({ lat, lng });
    });

    return () => map.setTarget(undefined);
  }, []);

  // Cuando cambian coords (por búsqueda), reposiciona y centra
  useEffect(() => {
    if (!mapRef.current || !markerOverlayRef.current) return;
    const pos = fromLonLat([coords.lng, coords.lat]);
    markerOverlayRef.current.setPosition(pos);
    mapRef.current.getView().animate({ center: pos, duration: 300 });
  }, [coords]);

  // Maneja Enter en el input
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault(); // Evitar que el formulario se envíe cuando presiono enter

    const query = searchTerm.trim();
    if (!query) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=ar&q=${encodeURIComponent(
          query
        )}`
      );
      const data = await res.json();
      const { lat, lon } = data[0];
      const newCoords = { lat: parseFloat(lat), lng: parseFloat(lon) };
      setCoords(newCoords); //pasar al componente padre las coordenadas
      props.lastCoords && props.lastCoords(newCoords); //también llamar al callback del padre
    } catch (error) {
      console.error("Error al buscar las coordenadas", error);
    }
  };

  return (
    <div className={css.root}>
      <TextField
        placeholder="Ubicacion + Enter..."
        type="text"
        name="location"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
      >
        Ubicación (por ej.: ciudad, provincia)
      </TextField>
      <div>
        <Text variant="text">{props.children}</Text>
        {/* Contenedor del mapa */}
        <div ref={mapContainerRef} className={css["map-container"]} />

        {/* Marcador */}
        <div ref={markerElRef} className={css["marker"]} />
      </div>
    </div>
  );
}

export { MapSearch };

//1. useObtainCoords: buscar coordenadas por nombre
// Hook que recibe un término de búsqueda y devuelve las coordenadas encontradas
export function useObtainCoords(query: string): {
  coords: { lat: number; lng: number } | null;
  loading: boolean;
  error: string | null;
} {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
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
