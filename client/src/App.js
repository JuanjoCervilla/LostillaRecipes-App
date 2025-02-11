//import './App.css';
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import Planning from "./pages/planning";
import Details from "./pages/details";
import Auth from "./pages/auth";
import CreateRecipes from "./pages/createRecipes";

function App() {
  return (
    <div>
      <div className="min-h-screen p-6 bg-white text-gray-600 text-lg">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/planning" element={<Planning />} />
          <Route path="/recipe-item/:id" element={<Details />} />
          <Route path="/create-recipe" element={<CreateRecipes />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
