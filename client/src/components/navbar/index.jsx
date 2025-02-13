import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../context";
import { useCookies } from "react-cookie";

export default function Navbar() {

  // Cargamos las variables de useContext
  const { searchParam, setSearchParam, handleSubmit } = useContext(GlobalContext);

  //  ??
  const [cookies, setCookies] = useCookies(["access_token"])
  // ??
  const navigate = useNavigate()

  // variable para el logout
  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.removeItem("userID");
    navigate("/auth");
  }

  return (
    <nav className="flex justify-between items-center py-8 container mx-auto flex-col lg:flex-row gap-5 lg:gap-0">

      {/* Logo */}
      <h2 className="text-2x1 font-semibold">
        <NavLink
          to={"/"}
          className="text-black hover:text-gray-700 duration-300"
        >
          LostillaRecipes
        </NavLink>
      </h2>
      
      {/* Search Bar */}
      <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="search"
        value={searchParam}
        onChange={(event) => setSearchParam(event.target.value)}
        placeholder="Enter your name or tag recipe"
        className="bg-white/80 p-3 px-6 rounded-full outline-none lg:w-96 shadow-md shadow-gray-300 border border-gray-300 transition-all duration-300 ease-in-out transform hover:scale-105 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white"
      />
      </form>

      <ul className="flex gap-5">
        {/* Create Recipe */}
        <li>
          <NavLink
            to={"/create-recipe"}
            className="text-black hover:text-gray-700 duration-300"
          >
            ➕
          </NavLink>
        </li>
        {/* Home Link */}
        <li>
          <NavLink
            to={"/"}
            className="text-black hover:text-gray-700 duration-300"
          >
            Home
          </NavLink>
        </li>
        {/* Planning */}
        <li>
          <NavLink
            to={"/planning"}
            className="text-black hover:text-gray-700 duration-300"
          >
            Planning
          </NavLink>
        </li>
        {/* Login / Logout Status */}
        <li>
          {
            !cookies.access_token ? (<NavLink to={"/auth"} className="text-black hover:text-gray-700 duration-300"> Login </NavLink>) : <button onClick={logout}>Logout</button>
          }
        </li>
      </ul>
    </nav>
  );
}
