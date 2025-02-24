import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../context";
import { useCookies } from "react-cookie";

export default function Navbar() {
  // Access context values
  const {
    searchParam,
    setSearchParam,
    selectedTypes,
    setSelectedTypes,
    handleSubmitSearch,
  } = useContext(GlobalContext);

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

  return (
    <div>
    {/* Navbar */}
    <nav className="flex justify-between items-center py-6 px-6 container mx-auto">
      {/* Left - Logo */}
      <h2 className="text-2xl font-semibold text-gray-800">
        <NavLink to={"/"} className="hover:text-blue-600 transition duration-300">
          LostillaRecipes
        </NavLink>
      </h2>

      {/* Center - Search Bar with Apply Filters Button */}
      <div className="flex items-center gap-3 w-full max-w-lg">
        <form onSubmit={handleSubmitSearch} className="flex w-full">
          <input
            type="text"
            name="search"
            value={searchParam}
            onChange={(event) => setSearchParam(event.target.value)}
            placeholder="Search recipes..."
            className="flex-grow bg-gray-100 p-3 px-6 rounded-l-full outline-none shadow-sm border border-gray-300 
                      transition duration-300 ease-in-out focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-5 py-3 rounded-r-full font-medium 
                      hover:bg-blue-600 transition duration-300 shadow-md"
          >
            Apply Filters
          </button>
        </form>
      </div>

      {/* Right - Navbar Links */}
      <ul className="flex gap-6 items-center">
        <li>
          <NavLink
            to={"/create-recipe"}
            className="text-gray-800 font-medium hover:text-blue-600 transition duration-300"
          >
            ➕ Add New Recipe
          </NavLink>
        </li>
        <li>
          <NavLink
            to={"/planning"}
            className="text-gray-800 font-medium hover:text-blue-600 transition duration-300"
          >
            📅 Planning
          </NavLink>
        </li>
        <li>
          {!cookies.access_token ? (
            <NavLink
              to={"/auth"}
              className="text-gray-800 font-medium hover:text-blue-600 transition duration-300"
            >
              🔒 Login
            </NavLink>
          ) : (
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium 
                        hover:bg-red-600 transition duration-300 shadow-sm"
            >
              🔓 Logout
            </button>
          )}
        </li>
      </ul>
    </nav>


      {/* Food Type Checklist */}
      <div className="w-full py-4 bg-white flex justify-center mt-4">
        <div className="flex gap-6 items-center justify-center">
          {["Drink", "Main dish", "Appetizer", "Dessert"].map((foodType) => (
            <label
              key={foodType}
              className="flex items-center space-x-2 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition cursor-pointer"
            >
              <input
                type="checkbox"
                value={foodType.replace(/ /g, "+")}
                checked={selectedTypes.includes(foodType.replace(/ /g, "+"))}
                onChange={handleFilterChange}
                className="h-5 w-5 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
              />
              <span className="text-gray-700 font-medium">{foodType}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
