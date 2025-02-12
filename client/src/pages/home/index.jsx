import { useContext } from "react";
import { GlobalContext } from "../../context";
import RecipeItem from "../../components/recipe-list";

export default function Home() {

  // Usamos las variables useContext de recipeList y loading
  const { recipeList, loading } = useContext(GlobalContext);

  // ??
  if (loading) return <div>Loading... Please wait!</div>;

  return (
    // Muestra todas la lista de card si hay contenido en recipeList
    <div className="py-8 container mx-auto flex flex-wrap justify-center gap-10">
      {recipeList && recipeList.length > 0 ? (
        recipeList.map((item) => <RecipeItem item={item} />)
      ) : (
        <div>
          <p className="lg:text-4x1 text-xl text-center text-black font-extrabold">
            Nothing to show. Please search something
          </p>
        </div>
      )}
    </div>
  );
}
