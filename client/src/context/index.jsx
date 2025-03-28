import { createContext, useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

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
  // const [savedList, setSavedList] = useState([]);
  // ??
  const navigate = useNavigate();
  const [cookies, _] = useCookies(["access_token"]);
  // New state for recipePlanningList
  const [recipePlanningList, setRecipePlanningList] = useState([]);

   // Fetch all recipes when the component is mounted
   useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:3001/recipes", {headers: { authorization: cookies.access_token }});
        const data = await res.json();
        setRecipePlanningList(data); // Store recipes in recipePlanningList
        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    };
    if (cookies.access_token) fetchAllRecipes();
  }, []); // Empty dependency array means this runs once when the component is mounted.

  // Agregar este useEffect en `GlobalState.js`
  useEffect(() => {
    // console.log("selectedTypes actualizado en contexto:", selectedTypes);
  }, [selectedTypes]); 

  // FUNCIONES
  // función cuando haces enter en el search bar
  async function handleSubmitSearch(event) {
    event.preventDefault();
    
    try {    
      const typeQuery = selectedTypes ? `&types=${selectedTypes}` : "";
      const searchQuery = searchParam ? `search=${searchParam}` : "";
      const query = `${searchQuery}${typeQuery ? `&${typeQuery}` : ""}`;
      
      const res = await fetch(`http://localhost:3001/recipes?${query}`, {
        headers: { authorization: cookies.access_token },
      });
      
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
  
  return (
    <GlobalContext.Provider
      value={{
        searchParam,
        selectedTypes,
        loading,
        recipeList,
        recipeDetailsData,
        recipePlanningList,
        setSearchParam,
        setSelectedTypes,
        handleSubmitSearch,
        setRecipeDetailsData,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
