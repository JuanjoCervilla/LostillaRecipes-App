import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const GlobalContext = createContext(null); //initial value

export default function GlobalState({ children }) {
  // VARIABLES
  // Valor que introduces en el searchBar
  const [searchParam, setSearchParam] = useState("");

  const [selectedTypes, setSelectedTypes] = useState([]);
  // ???
  const [loading, setLoading] = useState(false);
  // Variable para mostrar la lista de recetas que aparecen según los criterios de la búsqueda
  const [recipeList, setRecipeList] = useState([]);
  // Variable con un json dentro de los detalles de la receta
  const [recipeDetailsData, setRecipeDetailsData] = useState({});
  //
  const [planningList, setPlanningList] = useState([]);
  // ??
  const navigate = useNavigate();

  // FUNCIONES
  // función cuando haces enter en el search bar
  async function handleSubmitSearch(event) {
    event.preventDefault();
  
    try {
      // Create query parameters for both search and types (from checkboxes)
      const typeQuery = selectedTypes.length > 0 ? `&types=${selectedTypes.join(',')}` : '';
      const searchQuery = searchParam ? `search=${searchParam}` : '';
  
      // Combine the search and type filters
      const query = `${searchQuery}${typeQuery ? `&${typeQuery}` : ''}`;
  
      const res = await fetch(`http://localhost:3001/recipes?${query}`);
  
      const data = await res.json();
  
      if (data) {
        setRecipeList(data);
        setLoading(false);
        setSearchParam(""); // Optionally reset search input
        setSelectedTypes([]); // Optionally reset checkboxes
        navigate("/"); // Navigate to the homepage or results page
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
      setSearchParam("");
    }
  }

  //
  function handleAddToPlanning(getCurrentItem) {
    console.log(getCurrentItem);
    let copyPlanningList = [...planningList];
    const index = copyPlanningList.findIndex(
      (item) => item.id === getCurrentItem.id
    );

    if (index === -1) {
      copyPlanningList.push(getCurrentItem);
    } else {
      copyPlanningList.splice(index);
    }

    setPlanningList(copyPlanningList);
  }

  return (
    <GlobalContext.Provider
      value={{
        searchParam,
        selectedTypes,
        loading,
        recipeList,
        recipeDetailsData,
        planningList,
        setSearchParam,
        setSelectedTypes,
        handleSubmitSearch,
        setRecipeDetailsData,
        handleAddToPlanning,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
