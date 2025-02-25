import { useContext, useState } from "react";
import { GlobalContext } from "../../context";
import RecipeItem from "../../components/recipe-list";

export default function Planning() {
  // const { planningList } = useContext(GlobalContext);

  const { recipePlanningList, loading } = useContext(GlobalContext);
  // Get recipePlanningList from context
  const [weeklyTimetable, setWeeklyTimetable] = useState({
    Monday: { lunch: "", dinner: "" },
    Tuesday: { lunch: "", dinner: "" },
    Wednesday: { lunch: "", dinner: "" },
    Thursday: { lunch: "", dinner: "" },
    Friday: { lunch: "", dinner: "" },
    Saturday: { lunch: "", dinner: "" },
    Sunday: { lunch: "", dinner: "" },
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedMeal, setSelectedMeal] = useState("");

  const openRecipeModal = (day, meal) => {
    setSelectedDay(day);
    setSelectedMeal(meal);
    setIsModalOpen(true);
  };

  const addRecipeToTimetable = (recipe) => {
    setWeeklyTimetable((prevTimetable) => ({
      ...prevTimetable,
      [selectedDay]: {
        ...prevTimetable[selectedDay],
        [selectedMeal]: recipe, // Add the selected recipe to the timetable
      },
    }));
    setIsModalOpen(false); // Close the modal after selection
  };

  if (loading) return <div>Loading... Please wait!</div>;

  return (
    <div className="py-8 container mx-auto flex flex-wrap justify-center gap-10">
      {/* Timetable Display */}
      <div className="w-full">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border px-2 py-2 text-center whitespace-nowrap w-1">
                Day
              </th>
              <th className="border p-2">Lunch</th>
              <th className="border p-2">Dinner</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(weeklyTimetable).map(([day, meals]) => (
              <tr key={day}>
                <td className="border px-2 py-2  whitespace-nowrap w-1">
                  {day}
                </td>
                <td className="border p-2">
                  {meals.lunch ? (
                    <div className="flex items-center justify-center gap-4">
                      {/* Title Section */}
                      <div className="text-center">
                        <div className="text-lg">{meals.lunch.title}</div>
                      </div>

                      {/* Image Section */}
                      <div className="flex justify-center">
                        <img
                          src={meals.lunch.imageURL}
                          alt="recipe item"
                          className="w-44 h-34 object-cover rounded-lg shadow-md"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <button
                        onClick={() => openRecipeModal(day, "lunch")}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
                      >
                        + Add meal
                      </button>
                    </div>
                  )}
                </td>
                <td className="border p-2">
                  {meals.dinner ? (
                    <div className="flex items-center justify-center gap-4">
                      {/* Title Section */}
                      <div className="text-center">
                        <div className="text-lg">{meals.dinner.title}</div>
                      </div>

                      {/* Image Section */}
                      <div className="flex justify-center">
                        <img
                          src={meals.dinner.imageURL}
                          alt="recipe item"
                          className="w-44 h-34 object-cover rounded-lg shadow-md"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <button
                        onClick={() => openRecipeModal(day, "dinner")}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
                      >
                        + Add meal
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recipe Planning List */}
      {/* <div className="w-full">
        {recipePlanningList && recipePlanningList.length > 0 ? (
          recipePlanningList.map((item, index) => (
            <RecipeItem key={index} item={item} />
          ))
        ) : (
          <div>
            <p className="lg:text-4xl text-xl text-center text-black font-extrabold">
              Nothing is added in planning
            </p>
          </div>
        )}
      </div> */}

      {/* Modal for Recipe Selection */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg">
            <h2 className="text-xl">
              Select a Recipe for {selectedDay} {selectedMeal}
            </h2>
            <ul>
              {recipePlanningList.map((recipe, index) => (
                <li key={index} className="mb-2">
                  <button
                    className="p-2 border rounded"
                    onClick={() => addRecipeToTimetable(recipe)}
                  >
                    {recipe.title}
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="mt-5 bg-gray-300 p-2 rounded"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
