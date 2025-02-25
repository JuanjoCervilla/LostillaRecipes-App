import { useContext } from "react";
import { GlobalContext } from "../../context";
import RecipeItem from "../../components/recipe-list";

export default function Planning() {
  const { planningList } = useContext(GlobalContext);

  // Timetable for the week
  const weeklyTimetable = {
    Monday: {
      lunch: "",
      dinner: ""
    },
    Tuesday: {
      lunch: "",
      dinner: ""
    },
    Wednesday: {
      lunch: "",
      dinner: ""
    },
    Thursday: {
      lunch: "",
      dinner: ""
    },
    Friday: {
      lunch: "",
      dinner: ""
    },
    Saturday: {
      lunch: "",
      dinner: ""
    },
    Sunday: {
      lunch: "",
      dinner: ""
    }
  }

  return (
    <div className="py-8 container mx-auto flex flex-wrap justify-center gap-10">
      {/* Timetable Display */}
      <div className="w-full">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border px-2 py-2 text-center whitespace-nowrap w-1">Day</th>
              <th className="border p-2">Lunch</th>
              <th className="border p-2">Dinner</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(weeklyTimetable).map(([day, meals]) => (
              <tr key={day}>
                <td className="border px-2 py-2 text-center whitespace-nowrap w-1">{day}</td>
                <td className="border p-2">{meals.lunch}</td>
                <td className="border p-2">{meals.dinner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recipe Planning List */}
      <div className="w-full">
        {planningList && planningList.length > 0 ? (
          planningList.map((item, index) => <RecipeItem key={index} item={item} />)
        ) : (
          <div>
            <p className="lg:text-4xl text-xl text-center text-black font-extrabold">
              Nothing is added in planning
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
