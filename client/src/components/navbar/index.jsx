import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../context";
import { useCookies } from "react-cookie";

export default function Navbar() {
  const {
    searchParam,
    setSearchParam,
    selectedTypes,
    setSelectedTypes,
    handleSubmitSearch,
  } = useContext(GlobalContext);

  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.removeItem("userID");
    navigate("/auth");
  };

  const handleFilterChange = (event) => {
    const value = event.target.value.replace(/ /g, "+");
    setSelectedTypes((prevSelected) => {
      const selectedArray = prevSelected ? prevSelected.split(",") : [];
      return selectedArray.includes(value)
        ? selectedArray.filter((type) => type !== value).join(",")
        : [...selectedArray, value].join(",");
    });
  };

  return (
    <div className="bg-gray-900 text-white">
  {/* Navbar */}
  <nav className="flex items-center py-4 px-6 container mx-auto">
    {/* Left - Logo and Title */}
    <div className="flex items-center gap-3">
      <NavLink to={"/"}>
        <img
          src="/assets/logo.png"
          alt="LostillaRecipes Logo"
          className="h-16 w-16 object-contain hover:opacity-80 transition"
        />
      </NavLink>
      <h2 className="text-2xl font-semibold text-gray-100">
        <NavLink to={"/"} className="hover:text-blue-600 transition duration-300">
          LostillaRecipes
        </NavLink>
      </h2>
    </div>

    {/* Center - Search Bar */}
    <div className="flex-grow flex justify-center">
      <form onSubmit={handleSubmitSearch} className="flex w-full max-w-lg">
        <input
          type="text"
          name="search"
          value={searchParam}
          onChange={(event) => setSearchParam(event.target.value)}
          placeholder="Search recipes..."
          className="flex-grow bg-gray-100 p-3 px-6 rounded-l-full outline-none shadow-md border border-gray-300 
                    transition focus:ring-2 focus:ring-blue-500 text-black"
        />
        <button
          type="submit"
          className="bg-gray-600 text-white px-5 py-3 rounded-r-full font-medium 
                    hover:bg-blue-600 transition"
        >
          Apply Filters
        </button>
      </form>
    </div>

    {/* Right - Navbar Links */}
    <ul className="flex gap-6 items-center">
      <li>
      {cookies.access_token ? (
        <NavLink to={"/create-recipe"} className="hover:text-blue-400 transition">
          ➕ Add Recipe
        </NavLink> ) : ("")}
      </li>
      <li>
        {cookies.access_token ? (
        <NavLink to={"/savedRecipes"} className="hover:text-blue-400 transition">
        📒 Saved
        </NavLink>) : ("")}
      </li>
      <li>
        {cookies.access_token ? (
        <NavLink to={"/planning"} className="hover:text-blue-400 transition">
        📅 Planning
        </NavLink>) : ("")}
      </li>
      <li>
        {!cookies.access_token ? (
          <NavLink to={"/auth"} className="hover:text-blue-400 transition">
            🔒 Login
          </NavLink>
        ) : (
          <button
            onClick={logout}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            🔓 Logout
          </button>
        )}
      </li>
    </ul>
  </nav>

  {/* Food Type Checklist */}
  <div className="w-full py-3 bg-gray-500 flex justify-center">
    <div className="flex gap-6 items-center">
      {["Drink", "Main dish", "Appetizer", "Dessert"].map((foodType) => (
        <label
          key={foodType}
          className="flex items-center space-x-2 p-2 bg-gray-600 rounded-lg hover:bg-gray-600 transition cursor-pointer"
        >
          <input
            type="checkbox"
            value={foodType.replace(/ /g, "+")}
            checked={selectedTypes.includes(foodType.replace(/ /g, "+"))}
            onChange={handleFilterChange}
            className="h-5 w-5 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
          />
          <span className="font-medium">{foodType}</span>
        </label>
      ))}
    </div>
  </div>
</div>
  );
}
