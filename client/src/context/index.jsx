import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const GlobalContext = createContext(null); //initial value

export default function GlobalState({ children }) {

  // VARIABLES
  // Valor que introduces en el searchBar
  const [searchParam, setSearchParam] = useState("");
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
  async function handleSubmit(event) {

    event.preventDefault();
    
    try {
      
      const res = await fetch(
        `http://localhost:3001/recipes?search=${searchParam}` 
      );

      const data = await res.json();
    
      if (data) {
        setRecipeList(data);
        setLoading(false);
        setSearchParam("");
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
        loading,
        recipeList,
        recipeDetailsData,
        planningList,
        setSearchParam,
        handleSubmit,
        setRecipeDetailsData,
        handleAddToPlanning,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
