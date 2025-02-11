import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../context";
import { useCookies } from "react-cookie";

export default function Navbar() {
  const { searchParam, setSearchParam, handleSubmit } =
    useContext(GlobalContext);

  const [cookies, setCookies] = useCookies(["access_token"])
  const navigate = useNavigate()

  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.removeItem("userID");
    navigate("/auth");
  }

  // console.log(searchParam);

  return (
    <nav className="flex justify-between items-center py-8 container mx-auto flex-col lg:flex-row gap-5 lg:gap-0">
      <h2 className="text-2x1 font-semibold">
        <NavLink
          to={"/"}
          className="text-black hover:text-gray-700 duration-300"
        >
          LostillaRecipes
        </NavLink>
      </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="search"
          value={searchParam}
          onChange={(event) => setSearchParam(event.target.value)}
          placeholder="Enter your name recipe..."
          className="bg-white/75 p-3 px-8 rounded-full outline-none lg:w-96 shadow-lg shadow-red-100 focus:shadow-red-200"
        ></input>
      </form>
      <ul className="flex gap-5">
        <li>
          <NavLink
            to={"/create-recipe"}
            className="text-black hover:text-gray-700 duration-300"
          >
            ➕
          </NavLink>
        </li>
        <li>
          <NavLink
            to={"/"}
            className="text-black hover:text-gray-700 duration-300"
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to={"/planning"}
            className="text-black hover:text-gray-700 duration-300"
          >
            Planning
          </NavLink>
        </li>
        <li>
          {
            !cookies.access_token ? (<NavLink to={"/auth"} className="text-black hover:text-gray-700 duration-300"> Login </NavLink>) : <button onClick={logout}>Logout</button>
          }
        </li>
      </ul>
    </nav>
  );
}
