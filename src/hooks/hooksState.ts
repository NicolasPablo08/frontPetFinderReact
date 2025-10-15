import { useParams } from "react-router";
import { useEffect } from "react";
import { atom, useAtom } from "jotai";

//1ro creamos un atomo que guardara la query y empezara vacia
const queryAtom = atom("");

// Átomo derivado para los resultados de búsqueda, se dispara cuando cambia queryAtom
const resultsAtom = atom(async (get) => {
  const query = get(queryAtom);
  if (!query) return []; // Si no hay query, devolvemos un array vacío

  const response = await fetch(
    "https://world.openfoodfacts.org/cgi/search.pl?search_terms=" + query + "&json=true"
  );
  const data = await response.json();
  return data.products;
});

export function useSearchResult() {
  //2do obtenemos la query cuando se llama a la funcion desde la page (o se monta el componente)
  const params = useParams();
  const query = params.query;
  const [newQuery, setNewQuery] = useAtom(queryAtom);

  //3ro obtenida la query se la seteamos al atomo ya creado,
  // el cambio en el atomo disparara la llamada a resultsAtom que hara la busqueda a la api
  useEffect(() => {
    setNewQuery(query);
  }, [query]);

  //4to obtirne los resultados de resultsAtom
  const [results] = useAtom(resultsAtom);

  //5to retornamos los resultados al componente que llamo a la funcion
  return results;
}
