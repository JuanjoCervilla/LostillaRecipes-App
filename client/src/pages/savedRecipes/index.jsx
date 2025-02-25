import { useContext } from "react";
import { GlobalContext } from "../../context";
import RecipeItem from "../../components/recipe-list";

export default function Planning() {
  const { planningList } = useContext(GlobalContext);

  return (
    <div className="py-8 container mx-auto flex flex-wrap justify-center gap-10">
      {planningList && planningList.length > 0 ? (
        planningList.map((item) => <RecipeItem item={item} />)
      ) : (
        <div>
          <p className="lg:text-4x1 text-xl text-center text-black font-extrabold">
            Nothing is added in planning
          </p>
        </div>
      )}
    </div>
  );
}