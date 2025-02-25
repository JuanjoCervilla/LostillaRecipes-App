import { useContext, useState, useEffect } from "react";
import { GlobalContext } from "../../context";

// Debounce function
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export default function Planning() {
  const { recipePlanningList, loading } = useContext(GlobalContext);
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState(recipePlanningList);

  // Effect for updating the filtered recipe list
  useEffect(() => {
    const debouncedSearch = debounce((query) => {
      setFilteredRecipes(
        recipePlanningList.filter((recipe) =>
          recipe.title.toLowerCase().includes(query.toLowerCase())
        )
      );
    }, 300);

    if (searchTerm === "") {
      setFilteredRecipes(recipePlanningList);
    } else {
      debouncedSearch(searchTerm);
    }
  }, [searchTerm, recipePlanningList]); // No need for useCallback

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

      {/* Modal for Recipe Selection */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg">
            {/* Modal Header with Close Button */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Select a Recipe for {selectedDay} {selectedMeal}
              </h2>
              <div className="w-8"></div> {/* Spacer */}
            </div>

            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search for recipes..."
              className="mb-4 w-full p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Scrollable Recipe List */}
            <div className="max-h-60 overflow-y-auto mb-4">
              <ul>
                {filteredRecipes.length > 0 ? (
                  filteredRecipes.map((recipe, index) => (
                    <li key={index} className="mb-2">
                      <button
                        className="p-3 border border-gray-300 rounded-lg w-full text-left hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
                        onClick={() => addRecipeToTimetable(recipe)}
                      >
                        {recipe.title}
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No recipes found</li>
                )}
              </ul>
            </div>

            {/* Close Button */}
            <div className="text-center">
              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
