import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/user.context";
import { PersonStanding, PlusSquare, UserIcon, X } from "lucide-react";
import axios from "../config/axios";
import {useNavigate} from 'react-router-dom'

const Home = () => {
  const navigate=useNavigate();

  const { user } = useContext(UserContext);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]); // Initialize as empty array
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("/projects/all");
      setProjects(res.data.projects || []); // Fallback to empty array
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setProjects([]); // Set empty array on error
    }
  };

  const handleOpenForm = () => setIsFormOpen(true);

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setProjectName("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!projectName.trim()) {
      alert("Please enter a project name");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post("/projects/create", {
        name: projectName.trim(),
      });

      console.log("Create response:", res.data); // Debug log

      // Check different possible response structures
      const newProject = res.data.project ||
        res.data || {
          _id: Date.now().toString(), // Fallback ID
          name: projectName.trim(),
        };

      // Add the new project to the existing list
      setProjects((prevProjects) => [...prevProjects, newProject]);
      handleCloseForm();

      // Alternative: Refresh the entire list from server
      // await fetchProjects();
    } catch (err) {
      console.error("Failed to create project:", err);
      alert("Failed to create project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Create Project Button */}
      <div className="border-2 h-[50px] w-[120px] m-2.5 rounded-2xl flex justify-center items-center bg-white shadow-sm hover:shadow-md transition-shadow">
        <button
          className="flex items-center gap-2 p-2"
          onClick={handleOpenForm}
        >
          <h1 className="text-sm font-semibold">Project</h1>
          <PlusSquare className="size-6 text-blue-500" />
        </button>
      </div>

      {/* Projects List */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Your Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div
                key={project._id}
                onClick={() =>{
                  navigate('/project',{
                    state:{project}
                  })
                }}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border"
              >
                <h3 className="font-semibold text-lg">{project.name}</h3>
                <div className="flex gap-2">
                  <UserIcon />
                  <p>Collaborators: </p>
                  {project.users.length}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full">
              No projects found. Create your first project!
            </p>
          )}
        </div>
      </div>

      {/* Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Project</h2>
              <button
                className="text-gray-500 hover:text-gray-700 p-1"
                onClick={handleCloseForm}
              >
                <X className="size-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="projectName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Project Name
                </label>
                <input
                  id="projectName"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter project name"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
