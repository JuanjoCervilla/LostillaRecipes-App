import { Link } from "react-router-dom";

// Este componente sería la card que se muestra por receta
export default function RecipeItem({ item }) {
  return (
    <div className="flex flex-col w-80 overflow-hidden p-5 bg-white/75 shaadow-xl gap-5 border-2 rounded-2xl border-white">
      
      {/* Image */}
      <div className="h-40 flex justify-center overflow-hidden items-center rounde-xl">
        <img
          src={item?.imageURL}
          alt="recipe item"
          className="block w-full"
        ></img>
      </div>
      
      <div>
        <div className="flex items-center justify-between gap-4">
          {/* Title */}
          <h3 className="font-bold text-2xl truncate text-black">
            {item?.title}
          </h3>
          {/* Type */}
          <span className="text-sm text-cyan-700 font-medium">
            {item?.type}
          </span>
        </div>
        {/* Tag */}
        <span className="text-sm text-orange-700 font-medium">
          {item?.tags?.join(" - ")}
        </span>
        <br></br>
        {/* Button to Recipe Details */}
        <Link
          to={`/recipe-item/${item?._id}`}
          className="text-sm p-3 px-8 mt-5 rounded-lg uppercase font-medium tracking-wider inline-block shawdow-md text-white bg-black"
        >
          Recipe Details
        </Link>
      </div>
    </div>
  );
}
