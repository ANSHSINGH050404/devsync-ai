import React, { useContext, useState } from "react";
import { UserContext } from "../context/user.context";
import { PlusSquare, X } from "lucide-react";
import axios from "../config/axios";
const Home = () => {
  const { user } = useContext(UserContext);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [projectName, setProjectName] = useState("");

  const handleOpenForm = () => setIsFormOpen(true);
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setProjectName("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("/projects/create",{
        name:projectName
      })
      .then((res) => {
        console.log(res);
        handleCloseForm();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="border-2 h-[50px] w-[100px] m-2.5 rounded-2xl flex justify-end items-center bg-white shadow-sm hover:shadow-md transition-shadow">
        <button
          className="flex items-center gap-2 p-2"
          onClick={handleOpenForm}
        >
          <h1 className="text-sm font-semibold">Project</h1>
          <PlusSquare className="size-6 text-blue-500" />
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-lg p-6 w-full max-w-md mt-4 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Create New Project</h2>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={handleCloseForm}
            >
              <X className="size-6" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="projectName"
                className="block text-sm font-medium text-gray-700"
              >
                Project Name
              </label>
              <input
                id="projectName"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="mt-1 block w-full  border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                placeholder="Enter project name"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCloseForm}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
