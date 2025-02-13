import { useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../context";
import { useCookies } from "react-cookie";

export default function Navbar() {

  // Access context values
  const { searchParam, setSearchParam, selectedTypes, setSelectedTypes, handleSubmitSearch } = useContext(GlobalContext);

  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  // Handle logout
  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.removeItem("userID");
    navigate("/auth");
  };

  // Handle checkbox changes (filtering types)
  const handleFilterChange = (event) => {
    const value = event.target.value.replace(/ /g, "+"); // Reemplaza espacios con '+'
  
    setSelectedTypes((prevSelected) => {
      const selectedArray = prevSelected ? prevSelected.split(",") : []; // Convertimos string a array
  
      if (selectedArray.includes(value)) {
        return selectedArray.filter((type) => type !== value).join(","); // Quitamos el elemento
      } else {
        return [...selectedArray, value].join(","); // Agregamos el nuevo valor
      }
    });
  };
  
  
  
  // useEffect(() => {
  //   console.log(selectedTypes)
  // }, [selectedTypes]); // This will run every time selectedTypes changes

  return (
    <div>
      {/* Navbar */}
      <nav className="flex justify-between items-center py-8 container mx-auto flex-col lg:flex-row gap-5 lg:gap-0">
        <h2 className="text-2xl font-semibold">
          <NavLink to={"/"} className="text-black hover:text-gray-700 duration-300">
            LostillaRecipes
          </NavLink>
        </h2>

        {/* Search Bar */}
        <form onSubmit={handleSubmitSearch}>
          <input
            type="text"
            name="search"
            value={searchParam}
            onChange={(event) => setSearchParam(event.target.value)}
            placeholder="Enter your name or tag recipe"
            className="bg-white/80 p-3 px-6 rounded-full outline-none lg:w-96 shadow-md shadow-gray-300 border border-gray-300 transition-all duration-300 ease-in-out transform hover:scale-105 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white"
          />
        </form>

        {/* Navbar Links */}
        <ul className="flex gap-5">
          <li>
            <NavLink to={"/create-recipe"} className="text-black hover:text-gray-700 duration-300">
              ➕
            </NavLink>
          </li>
          <li>
            <NavLink to={"/"} className="text-black hover:text-gray-700 duration-300">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to={"/planning"} className="text-black hover:text-gray-700 duration-300">
              Planning
            </NavLink>
          </li>
          <li>
            {!cookies.access_token ? (
              <NavLink to={"/auth"} className="text-black hover:text-gray-700 duration-300">
                Login
              </NavLink>
            ) : (
              <button onClick={logout}>Logout</button>
            )}
          </li>
        </ul>
      </nav>

      {/* Food Type Checklist */}
      <div className="w-full py-4 bg-white flex justify-center mt-4">
        <div className="flex gap-6">
          {["Main dish", "Drink", "Appetizer", "Dessert"].map((foodType) => (
            <label key={foodType} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={foodType}
                checked={selectedTypes.includes(foodType)} // Dynamically check if the type is selected
                onChange={handleFilterChange}
                className="h-5 w-5 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
              />
              <span className="text-gray-700">{foodType}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
