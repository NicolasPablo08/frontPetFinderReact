//obtener ciudad y provincia a traves del lat y lng
async function getCiudadProvincia(lat: number, lng: number) {
	try {
		const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`;
		const response = await fetch(url, {
			headers: { "User-Agent": "mi-app/1.0" }, // algunos servidores lo requieren
		});
		const data = await response.json();

		if (data && data.address) {
			const { city, town, village, state } = data.address;
			const ciudad = city || town || village || "Desconocida";
			const provincia = state || "Desconocida";
			return `${ciudad}, ${provincia}`;
		}
	} catch (error) {
		console.error("Error al obtener la ubicación:", error);
		return "Ubicación desconocida";
	}
}
export { getCiudadProvincia };
