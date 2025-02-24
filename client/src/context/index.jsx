import { createContext, useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

export const GlobalContext = createContext(null); //initial value

export default function GlobalState({ children }) {
  // VARIABLES
  // Valor que introduces en el searchBar
  const [searchParam, setSearchParam] = useState("");

  const [selectedTypes, setSelectedTypes] = useState("");
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

  // Agregar este useEffect en `GlobalState.js`
  useEffect(() => {
    console.log("selectedTypes actualizado en contexto:", selectedTypes);
  }, [selectedTypes]); 

  // FUNCIONES
  // función cuando haces enter en el search bar
  async function handleSubmitSearch(event) {
    event.preventDefault();
    
    try {
      console.log("selectedTypes antes de la petición:", searchParam); // 🔍 Depuración
      
      const typeQuery = selectedTypes ? `&types=${selectedTypes}` : "";
      const searchQuery = searchParam ? `search=${searchParam}` : "";
      const query = `${searchQuery}${typeQuery ? `&${typeQuery}` : ""}`;
      
      console.log("Query final:", query); // 🔍 Depuración
  
      const res = await fetch(`http://localhost:3001/recipes?${query}`);
      const data = await res.json();
  
      if (data) {
        setRecipeList(data);
        setLoading(false);
        setSearchParam(""); 
        setSelectedTypes(""); 
        navigate("/");
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
