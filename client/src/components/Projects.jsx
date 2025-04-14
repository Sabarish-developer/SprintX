import { useState, useEffect, useRef } from "react";
import { X, Menu, SortAsc, FolderCog, Trash2, FolderPlus} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";
import ConfirmToast from "./ConfirmToast";
import Select from "react-select";

//Dummy Projects Data
// const projectsData = [
//     { id: 1, name: "Seenu nnnnnn nnnn n", owner: "Aliceee", scrumMaster: "Bob", from: "2025-03-01", to: "2025-06-30", status: "In Progress", progress: 50 },
//     { id: 2, name: "Apple", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Completed", progress: 100 },
//     { id: 3, name: "Windows", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "In Progress", progress: 50},
//     { id: 4, name: "Linux", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started", progress: 0},
//     { id: 5, name: "Linux", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started", progress: 0},
//     { id: 6, name: "Projectl 2", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started", progress: 0},
//     { id: 7, name: "Projectl 2", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started", progress: 0},
//     { id: 8, name: "Project 2", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started", progress: 0 },
//     { id: 9, name: "Project 2", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started", progress: 0 },
//     { id: 10, name: "Project 2", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started", progress: 0 },
//     { id: 11, name: "Project 2", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started", progress: 0 },
//     { id: 12, name: "Project 2", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started", progress: 0 },
//   ];

export default function Projects() {
  const token = localStorage.getItem("token");
  const [search, setSearch] = useState("");
  const [showIcon, setShowIcon] = useState(false);
  const [projects, setProjects] = useState([]);
  //const [projects, setProjects] = useState(projectsData);
  const [showModal, setShowModal] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [pro, setPro] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [sortType, setSortType] = useState("");
  const [error, setError] = useState("");

  const user = useAuth();
  const isProductOwner = user?.role === "Product owner";
  console.log(isProductOwner);
  console.log("hello");

  const [scrumMasters, setScrumMasters] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  // const [selectedScrumMaster, setSelectedScrumMaster] = useState({
  //   value: projectToEdit.scrumMasterId,
  //   label: projectToEdit.scrumMasterName,
  // });
  // const [selectedTeamMembers, setSelectedTeamMembers] = useState(
  //   projectToEdit.teamMembers.map(member => ({
  //     value: member.id,
  //     label: member.username,
  //   }))
  // );
  const [selectedScrumMaster, setSelectedScrumMaster] = useState(
    projectToEdit?.scrumMasterId
      ? {
          value: projectToEdit.scrumMasterId,
          label: projectToEdit.scrumMasterName,
        }
      : null
  );
  
  //const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState(
    Array.isArray(projectToEdit?.teamMembers)
      ? projectToEdit.teamMembers.map(member => ({
          value: member.id,
          label: member.username,
        }))
      : []
  );

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/productowner/companymembers`, {
                   headers: {
                     Authorization: token
                   }
                 }); // adjust endpoint if needed
        setScrumMasters(res.data.scrumMasters);
        setTeamMembers(res.data.teamMembers);
        // const formattedOptions = res.data.teamMembers.map(member => ({
        //   value: member._id,
        //   label: member.username,
        // }));
        // setTeamMembers(formattedOptions);
        
        toast.info(res.data.message);
      } catch (err) {
        toast.error("Failed to load members");
      }
    };
  
    fetchMembers();
  }, []);
  
  console.log("1",teamMembers);
  const scrumMasterOptions = scrumMasters.map(member => ({
    value: member._id,
    label: member.username
  }));
  const teamMemberOptions = teamMembers.map(member => ({
    value: member._id,
    label: member.username
  }));

  const fetchProjects = async () => {
    try {
      console.log("Fetching projects...");
  
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/productowner/projects`, {
        headers: {
          Authorization: token
        }
      });
  
      if (res.status === 200) {
        if (res.data.projects.length === 0) {
          setError(res.data.message);
          return;
        }
        
        const fetchedProjects = res.data.projects.map((p) => {
          console.log(p);
          return {
            id: p._id,
            name: p.title,
            owner: p.description,
            scrumMaster: p.scrumMaster,
            from: new Date(p.start).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            to: new Date(p.deadline).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            status: p.status,
            progress: p.completionPercentage
          };
        });
  
        setProjects(fetchedProjects);
        setPro(fetchedProjects);
      }
    } catch (err) {
      console.error("Error fetching project data:", err);
      setError("Error fetching project data");
    }
  };
  
  useEffect(() => {
    fetchProjects();
  }, []);

  const getProgressColor = (progress) => {
    if (progress == 0) return 'bg-red-500';
    if (progress > 0 && progress < 100) return 'bg-orange-500';
    return 'bg-green-500'; // progress === 100
  };

  const getCardBg = (progress) => {
    if (progress === 0) return 'bg-red-5';
    if (progress > 0 && progress < 100) return 'bg-orange-5';
    return 'bg-green-5'; // progress === 100
  };
  

  // Filter projects by search text
  useEffect(() => {
    const filtered = projects.filter((p) =>   // i changed here projectsData
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    setProjects(filtered);
  }, [search]);

  //const unsorted = [...Projects];

  // Sort by project name
  const sortByProjects = () => {
    const sorted = [...projects].sort((a, b) => a.name.localeCompare(b.name));
    setProjects(sorted);
  };

  // Sort by start date
  const sortByDate = () => {
    const sorted = [...projects].sort(
      (a, b) => new Date(a.from) - new Date(b.from)
    );
    setProjects(sorted);
  };

  //clear sort see below clear sort
  // const clearSort = () => {
  //   setProjects(projectsData); // this is temp only use below in integeration
  // };

  // use this on integrating with backend not above
  const clearSort = async () => {
    //const res = await fetch("/api/projects"); // or use Axios
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/productowner/projects`, {
      headers: {
        Authorization: token
      }
    });
    //const fresh = await res.json();
    const fresh = await res.data.projects;
    setProjects(fresh);
  };

  // const handleEdit = () => {
  //   alert("edit clicked");
  // }

  const handleEditSubmit = (e) => {
    e.preventDefault();
  
    const updatedProjects = projects.map((proj) =>
      proj.id === projectToEdit.id ? projectToEdit : proj
    );
    setProjects(updatedProjects);
    setIsEditOpen(false);
  };  //on integrate the backend soon, just replace the setProjects(updatedProjects) logic with PUT API call.

  const handleDelete = async (projectId) => {
    // const confirmDelete = window.confirm("Are you sure you want to delete this project?");
    // if (!confirmDelete) return;
  
    // try {
    //   const response = await axios.delete(`/api/projects/${projectId}`);
    //   if (response.status === 200) {
    //     // Remove the deleted project from local state
    //     setProjects((prev) => prev.filter((proj) => proj._id !== projectId));
    //   }
    // } catch (error) {
    //   console.error("Failed to delete project:", error);
    //   toast.error("Failed to delete project");
    // }

    toast(
      <ConfirmToast
        message="Are you sure you want to delete this project? This action cannot be undone."
        onConfirm={() => {
          // ✅ back end here below
          // try {
          //   const response = await axios.delete(`/api/projects/${projectId}`);
          //   if (response.status === 200) {
          //     // Remove the deleted project from local state
          //     setProjects((prev) => prev.filter((proj) => proj._id !== projectId));
          //   }
          // } catch (error) {
          //   console.error("Failed to delete project:", error);
          //   toast.error("Failed to delete project");
          // }
          setProjects(prev => prev.filter(p => p.id !== projectId));
          toast.success("Project deleted successfully!✅");
        }}
      />,
      { autoClose: false }
    );
    //setProjects((prev) => prev.filter((proj) => proj.id !== projectId)); //since we not integreated backend now i just used this 
  };
  
  // const handleDelete = () => {
  //   alert("delete clicked");
  // }

  // const handleCreateProject = () => {
  //   alert("project created")
  // }
  

  return (
    <div className="flex flex-col items-center">
      {/* Header */}
      <div className="sticky top-0 z-50 w-full bg-white border-b pb-4">
        <div className="flex items-center justify-between w-full px-4 pt-4">
          {/* Title */}
          {/* <div className="text-xl font-bold text-[#a40ff3]">Project Dashboard</div> */}

          {/* Desktop Search + Buttons */}
          <div className="hidden lg:flex lg:items-center gap-4 w-full max-w-5xl">
           <div className="flex items-center border border-gray-400 rounded-lg px-3 py-2">  {/*flex-1 */}
              {/* {showIcon && <Search className="text-gray-500 mr-2" size={20} />} */}
              <input
                type="text"
                placeholder="Search projects"
                className="flex-1 outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setShowIcon(true)}
                onBlur={() => setShowIcon(false)}
              />
            </div>
            {/* <button
              onClick={sortByProjects}
              className="bg-[#a40ff3] cursor-pointer hover:bg-white hover:text-[#a40ff3] shadow hover:shadow-md text-white px-4 py-2 rounded text-sm w-48"
            >
              Sort by Projects
            </button>
            <button
              onClick={sortByDate}
              className="bg-[#a40ff3] cursor-pointer hover:bg-white hover:text-[#a40ff3] shadow hover:shadow-md text-white px-4 py-2 rounded text-sm w-48"
            >
              Sort by Date
            </button> */}
            {/* <SortDropdown sortByProjects={sortByProjects} sortByDate={sortByDate} /> */}
            <SortDropdown
                sortByProjects={sortByProjects}
                sortByDate={sortByDate}
                sortType={sortType}
                clearSort={clearSort}
              />
          </div>
          {isProductOwner &&
          <button
          onClick={() => setShowModal(true)}
          className="bg-[#a40ff3] hover:bg-white cursor-pointer hover:text-[#a40ff3] text-white px-4 py-2 rounded shadow hover:shadow-md text-sm flex items-center gap-2 w-40"
          >
            <FolderPlus size={18} />
            Create project
          </button>
          }
          {showModal && (
              <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 ml-16 lg:ml-0 p-2 lg:p-0">
                <div className="bg-white p-6 rounded-md w-96 shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Create Project</h2>
                  <form
                    onSubmit={async(e) => {
                      e.preventDefault();

                      const formData = new FormData(e.target);
                      const newProject = {
                        title: formData.get("name"),
                        description: formData.get("desc"),
                        start: formData.get("from"),
                        deadline: formData.get("to"),
                        scrumMasterId: selectedScrumMaster?.value, // 🟢 ID of selected Scrum Master
                        teamMembersId: selectedTeamMembers.map(member => member.value), // 🟢 Array of IDs
                      };
                      console.log(newProject);
                      try {
                        // const res1 = axios.post(`${import.meta.env.VITE_BASE_URL}/api/productowner/projects`, newProject, 
                        //   {
                        //     headers: {
                        //       Authorization: token
                        //     }
                        //   }
                        console.log(formData.get("from"));
                        console.log(formData.get("to"));
                        const res1 = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/productowner/projects`, {
                          title: formData.get("name"),
                          description: formData.get("desc"),
                          start: formData.get("from"),
                          deadline: formData.get("to"),
                          scrumMasterId: selectedScrumMaster?.value, // 🟢 ID of selected Scrum Master
                          teamMembersId: selectedTeamMembers.map(member => member.value), // 🟢 Array of IDs
                        }, {
                          headers: {
                            Authorization: token
                          }
                        });
                        toast.success(res1.data.message);
                        await fetchProjects(); // refresh UI after DB update
                      } catch (error) {
                        toast.error("Failed to create project");
                        //console.log(res1.data.message?res1.data.message:error);
                      }

                      //setProjects((prev) => [...prev, newProject]);
                      setShowModal(false);
                    }}
                  >
                    <div className="mb-3">
                      <label className="block mb-1 font-medium">Project Name</label>
                      <input
                        name="name"
                        required
                        className="w-full border px-3 py-1 rounded"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="block mb-1 font-medium">Description</label>
                      <input
                        name="desc"
                        required
                        className="w-full border px-3 py-1 rounded"
                      />
                    </div>

                    {/* <div className="mb-3">
                      <label className="block mb-1 font-medium">Scrum Master</label>
                      <input
                        name="scrumMaster"
                        required
                        className="w-full border px-3 py-1 rounded"
                      />
                    </div> */}

                    <div className="mb-3">
                      <label className="block mb-1 font-medium">From Date</label>
                      <input
                        type="date"
                        name="from"
                        required
                        className="w-full border px-3 py-1 rounded"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="block mb-1 font-medium">To Date</label>
                      <input
                        type="date"
                        name="to"
                        required
                        className="w-full border px-3 py-1 rounded"
                      />
                    </div>

                    <label className="block mb-2 text-sm font-bold">Scrum Master</label>
                      <Select
                        options={scrumMasterOptions}
                        onChange={setSelectedScrumMaster}
                        menuPosition="fixed"
                        styles={{
                          menu: (base) => ({
                            ...base,
                            maxHeight: 200,
                            overflowY: 'auto'
                          }),
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        placeholder="Select Scrum Master"
                        isSearchable
                      />

                      <label className="block mt-4 mb-2 text-sm font-bold">Team Members</label>
                      <Select
                        isMulti
                        isSearchable
                        options={teamMemberOptions}
                        onChange={setSelectedTeamMembers}
                        value={selectedTeamMembers}
                        menuPosition="fixed"
                        styles={{
                          menu: (base) => ({
                            ...base,
                            maxHeight: 200,
                            overflowY: 'auto'
                          }),
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        //menuPortalTarget={document.body}                        
                        placeholder="Select Team Members"
                      />

                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
                      >
                        Create
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Edit Project */}
            {isEditOpen && (
              <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 ml-16 lg:ml-0 p-2 lg:p-0">
                <div className="bg-white p-6 rounded-md w-96 shadow-lg">
                  <h2 className="text-xl font-bold mb-4">Edit Project</h2>
                  <form onSubmit={handleEditSubmit} className="space-y-3">
                    {/* Name */}
                    <input
                      type="text"
                      value={projectToEdit.name}
                      onChange={(e) =>
                        setProjectToEdit({ ...projectToEdit, name: e.target.value })
                      }
                      placeholder="Project Name"
                      className="border border-gray-300 rounded w-full px-3 py-2"
                      required
                    />

                    {/* Owner */}
                    <input
                      type="text"
                      value={projectToEdit.owner}
                      onChange={(e) =>
                        setProjectToEdit({ ...projectToEdit, owner: e.target.value })
                      }
                      placeholder="Owner"
                      className="border border-gray-300 rounded w-full px-3 py-2"
                      required
                    />

                    {/* Scrum Master */}
                    {/* <input
                      type="text"
                      value={projectToEdit.scrumMaster}
                      onChange={(e) =>
                        setProjectToEdit({ ...projectToEdit, scrumMaster: e.target.value })
                      }
                      placeholder="Scrum Master"
                      className="border border-gray-300 rounded w-full px-3 py-2"
                      required
                    /> */}

                    {/* From Date */}
                    <input
                      type="date"
                      value={projectToEdit.from}
                      onChange={(e) =>
                        setProjectToEdit({ ...projectToEdit, from: e.target.value })
                      }
                      className="border border-gray-300 rounded w-full px-3 py-2"
                      required
                    />

                    {/* To Date */}
                    <input
                      type="date"
                      value={projectToEdit.to}
                      onChange={(e) =>
                        setProjectToEdit({ ...projectToEdit, to: e.target.value })
                      }
                      className="border border-gray-300 rounded w-full px-3 py-2"
                      required
                    />

                    {/* Status Dropdown */}
                    <select
                      value={projectToEdit.status}
                      onChange={(e) =>
                        setProjectToEdit({ ...projectToEdit, status: e.target.value })
                      }
                      className="border border-purple-300 rounded w-full px-3 py-2 bg-purple-100 font-medium"
                      required
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>

                    {/* Progress */}
                    <input
                      type="number"
                      value={projectToEdit.progress}
                      onChange={(e) =>
                        setProjectToEdit({ ...projectToEdit, progress: e.target.value })
                      }
                      placeholder="Progress %"
                      className="border border-gray-300 rounded w-full px-3 py-2"
                      required
                      min="0"
                      max="100"
                    />
                    {/* Scrum Master Select */}
                      <label className="font-semibold">Scrum Master</label>
                      <Select
                        value={selectedScrumMaster}
                        onChange={setSelectedScrumMaster}
                        options={scrumMasterOptions}
                        placeholder="Select Scrum Master"
                      />

                      {/* Team Members Select (Multi-select) */}
                      <label className="font-semibold mt-2">Team Members</label>
                      <Select
                        isMulti
                        value={selectedTeamMembers}
                        onChange={setSelectedTeamMembers}
                        options={teamMemberOptions}
                        menuPosition="fixed"
                        styles={{
                          menu: (base) => ({
                            ...base,
                            maxHeight: 200,
                            overflowY: 'auto'
                          }),
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        placeholder="Select Team Members"
                      />


                    {/* Buttons */}
                    <div className="flex justify-end gap-2 pt-2 mt-4">
                      <button
                        type="button"
                        onClick={() => setIsEditOpen(false)}
                        className="bg-gray-300 text-gray-800 px-4 py-1 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-purple-600 text-white px-4 py-1 rounded-md"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}



          {/* Mobile Hamburger */}
          <div className="lg:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 ml-2"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="lg:hidden px-4 mt-3 space-y-3">
            <div className="flex items-center border border-gray-400 rounded-lg px-3 py-2">
              {/* {showIcon && <Search className="text-gray-500 mr-2" size={20} />} */}
              <input
                type="text"
                placeholder="Search projects"
                className="flex-1 outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                // onFocus={() => setShowIcon(true)}
                // onBlur={() => setShowIcon(false)}
              />
            </div>
            {/* <button className="bg-[#a40ff3] text-white px-4 py-2 rounded w-full">
              Search
            </button>
            <button
              onClick={sortByProjects}
              className="bg-[#a40ff3] text-white px-4 py-2 rounded w-full text-sm"
            >
              Sort by Projects
            </button>
            <button
              onClick={sortByDate}
              className="bg-[#a40ff3] text-white px-4 py-2 rounded w-full text-sm"
            >
              Sort by Date
            </button> */}
            {/* <SortDropdown sortByProjects={sortByProjects} sortByDate={sortByDate} /> */}
            <SortDropdown
                sortByProjects={sortByProjects}
                sortByDate={sortByDate}
                sortType={sortType}
                clearSort={clearSort}
              />
          </div>
        )}
      </div>

      {/* Project Cards */}
      <div className="bg-purple-50 py-10 flex flex-wrap w-auto h-auto justify-center gap-10 px-10 lg:px-0" onClick={() => navigate(`/home/tasks`)}>
      {error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : projects.length > 0 ? (
          <>
            {/* Render your list of projects here */}
            {projects.map((project) => (
              <div
                key={project.id}
                className={`border-0 rounded-md shadow w-60 md:w-80 lg:w-80 p-5 cursor-pointer hover:shadow-lg sm:w-1/2 md:w-1/3 lg:w-1/5 transition duration-200 bg-white ${getCardBg(project.progress)}`}
              >
                <div className="flex items-center justify-between gap-2 mb-2 w-full">
                  <div className="w-4/4 min-w-0 cursor-pointer">
                    <h2 className="text-xl font-bold mb-2 overflow-hidden whitespace-nowrap text-ellipsis">
                      {project.name}
                    </h2>
                  </div>
                  {isProductOwner && 
                  <div className="border-2 p-1 flex items-center gap-1 rounded-md border-gray-400">
                    <span className="cursor-pointer" onClick={(e) => {e.stopPropagation(); setProjectToEdit(project); setIsEditOpen(true)}}><FolderCog size={20} color="#a40ff3" /></span>
                    <div className="w-px h-4 bg-gray-400"/>
                    <span className="cursor-pointer" onClick={(e) => {e.stopPropagation(); handleDelete(project.id)}}><Trash2 size={20} color="red" /></span>
                  </div>
                  }
                </div>
                <hr />
                <p className="p-1 text-gray-500">
                  <strong className="text-gray-600">Product Owner:</strong> {project.owner}
                </p>
                <p className="p-1 text-gray-500">
                  <strong className="text-gray-600">Scrum Master:</strong> {project.scrumMaster}
                </p>
                <p className="p-1 text-gray-500">
                  <strong className="text-gray-600">From:</strong> {project.from}
                </p>
                <p className="p-1 text-gray-500">
                  <strong className="text-gray-600">To:</strong> {project.to}
                </p>
                <p className="p-1 text-gray-500">
                  <strong className="text-gray-600">Status:</strong> {project.status}
                </p>
                <div className="p-2">
                  <div className="relative w-full h-1 bg-gray-500 mt-5 rounded overflow-visible">
                    {/* <div className={`absolute -top-7 left-1/2 -translate-x-1/2 text-sm ${getProgressColor(project.progress)} text-white px-2 py-0.5 rounded shadow`} style={{left: `calc(${project.progress}%)`}}>
                      {project.progress}%
                      <div className={`w-2 h-2 ${getProgressColor(project.progress)} rotate-45 absolute left-1/2 -bottom-1 -translate-x-1/2`}></div>
                    </div> */}
                    <AnimatedProgressLabel progress={project.progress} color={getProgressColor(project.progress)} />
                    <motion.div className={`h-full ${getProgressColor(project.progress)} transition-all duration-300`} initial={{width:0}} animate={{width: `${project.progress}%`}} transition={{duration: 0.7}} />
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div>Loading...</div> // Optional loading state
        )}
      </div>
    </div>
  );
}

function AnimatedProgressLabel({ progress, color }) {
  const x = useMotionValue(0);
  const percentage = useMotionValue(0);
  const [displayPercent, setDisplayPercent] = useState(0);

  useEffect(() => {
    // Animate position
    animate(x, progress, {
      duration: 0.8,
      ease: "easeOut"
    });

    // Animate percentage count
    const controls = animate(percentage, progress, {
      duration: 1,
      ease: "easeOut",
      onUpdate: latest => {
        setDisplayPercent(Math.round(latest));
      }
    });

    return () => controls.stop();
  }, [progress]);

  // Convert to CSS % string
  const left = useTransform(x, value => `calc(${value}%)`);

  return (
    <motion.div
      className={`absolute -top-7 left-1/2 -translate-x-1/2 text-sm ${color} text-white px-2 py-0.5 rounded shadow`}
      style={{ left }}
    >
      {displayPercent}%
      <div
        className={`w-2 h-2 ${color} rotate-45 absolute left-1/2 -bottom-1 -translate-x-1/2`}
      ></div>
    </motion.div>
  );
}



// import { useState, useEffect, useRef } from "react";
// import { SortAsc, X } from "lucide-react";

function SortDropdown({ sortByProjects, sortByDate, sortType, clearSort }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [clear, setClear] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div ref={dropdownRef} className="relative inline-block text-left">
        <button
          onClick={() => setOpen(!open)}
          className="bg-[#a40ff3] hover:bg-white cursor-pointer hover:text-[#a40ff3] text-white px-4 py-2 rounded shadow hover:shadow-md text-sm flex items-center gap-2"
        >
          <SortAsc size={16} />
          Sort
        </button>

        {open && (
          <div className="absolute z-10 mt-2 w-40 bg-white rounded-sm shadow-sm ring-1 ring-purple-500 ring-opacity-5">
            <div className="py-1">
              <button
                onClick={() => {
                  sortByProjects();
                  setOpen(false);
                  setClear(true);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-white hover:bg-[#a40ff3]"
              >
                Projects
              </button>
              <button
                onClick={() => {
                  sortByDate();
                  setOpen(false);
                  setClear(true);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-white hover:bg-[#a40ff3]"
              >
                Date
              </button>
            </div>
          </div>
        )}
      </div>

      {clear && (
        <button
          onClick={() => {
            setClear(false);
            clearSort();
          }}
          className="bg-red-500 hover:bg-red-600 cursor-pointer text-white px-3 py-2 rounded text-sm flex items-center gap-1 shadow hover:shadow-md"
        >
          <X size={16} />
          Clear Sort
        </button>
      )}
    </div>
  );
}



// import { SortAsc } from "lucide-react";

// function SortDropdown({ sortByProjects, sortByDate }) {
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setOpen(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <div ref={dropdownRef} className="relative inline-block text-left">
//       <button
//         onClick={() => setOpen(!open)}
//         className="bg-[#a40ff3] hover:bg-white hover:text-[#a40ff3] text-white px-4 py-2 rounded shadow hover:shadow-md text-sm flex items-center gap-2"
//       >
//         <SortAsc size={16} />
//         Sort
//       </button>

//       {open && (
//         <div className="absolute z-10 mt-2 w-40 bg-white rounded-sm shadow-sm ring-1 ring-purple-500 ring-opacity-5">
//           <div className="py-1">
//             <button
//               onClick={() => {
//                 sortByProjects();
//                 setOpen(false);
//               }}
//               className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-white hover:bg-[#a40ff3]"
//             >
//               Projects
//             </button>
//             <button
//               onClick={() => {
//                 sortByDate();
//                 setOpen(false);
//               }}
//               className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-white hover:bg-[#a40ff3]"
//             >
//               Date
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// import { useState, useEffect, useRef } from "react";
// import { ChevronDown, Check } from "lucide-react";

// function SortDropdown({ currentSort, onSortChange }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleSort = (type) => {
//     onSortChange(type);
//     setIsOpen(false);
//   };

//   return (
//     <div className="relative inline-block text-left" ref={dropdownRef}>
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="bg-[#a40ff3] text-white px-4 py-2 rounded flex items-center gap-2 shadow hover:bg-white hover:text-[#a40ff3] hover:shadow-md transition"
//       >
//         Sort
//         <ChevronDown size={18} />
//       </button>

//       {/* Dropdown */}
//       {isOpen && (
//         <div className="absolute z-10 mt-2 w-48 bg-white rounded shadow-lg border border-gray-200 animate-fade-in">
//           <button
//             onClick={() => handleSort("projects")}
//             className={`flex items-center justify-between w-full text-left px-4 py-2 hover:bg-gray-100 transition ${
//               currentSort === "projects" ? "font-medium text-[#a40ff3]" : ""
//             }`}
//           >
//             Sort by Projects
//             {currentSort === "projects" && <Check size={16} />}
//           </button>

//           <button
//             onClick={() => handleSort("date")}
//             className={`flex items-center justify-between w-full text-left px-4 py-2 hover:bg-gray-100 transition ${
//               currentSort === "date" ? "font-medium text-[#a40ff3]" : ""
//             }`}
//           >
//             Sort by Date
//             {currentSort === "date" && <Check size={16} />}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SortDropdown;













// import { useState } from "react";
// import { Search } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const projectsData = [
//   { id: 1, name: "Project 1", owner: "Alice", scrumMaster: "Bob", from: "2025-03-01", to: "2025-06-30", status: "In Progress" },
//   { id: 2, name: "Project 2", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started" },
//   { id: 3, name: "Project 2", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started" },
//   { id: 4, name: "Project 2", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started" },
//   { id: 5, name: "Project 2", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started" },
//   { id: 6, name: "Project 2", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started" },
//   { id: 7, name: "Project 2", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started" },
//   { id: 8, name: "Project 2", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started" },
//   { id: 9, name: "Project 2", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started" },
//   { id: 10, name: "Project 2", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started" },
//   { id: 11, name: "Project 2", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started" },
//   { id: 12, name: "Project 2", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started" },
// ];

// export default function Projects() {
//   const [search, setSearch] = useState("");
//   const [showIcon, setShowIcon] = useState(false);
//   const [projects, setProjects] = useState(projectsData);
//   const navigate = useNavigate();

//   const handleSearch = () => {
//     const filtered = projectsData.filter((p) =>
//       p.name.toLowerCase().includes(search.toLowerCase())
//     );
//     setProjects(filtered);
//   };

//   const sortByProjects = () => {
//     setProjects([...projects].sort((a, b) => a.name.localeCompare(b.name)));
//   };

//   const sortByDate = () => {
//     setProjects([...projects].sort((a, b) => new Date(a.from) - new Date(b.from)));
//   };

//   return (
//     <div className="p-4 flex flex-col items-center">
//       {/* Search Box + Buttons (Aligned in one row) */}
//       <div className="ml-60 flex items-center gap-4 w-full max-w-2xl lg:max-w-5xl justify-center">
//         {/* Search Box */}
//         <div className="flex items-center border border-gray-400 rounded-lg px-3 py-2 flex-1 max-w-lg">
//           {showIcon && <Search className="text-gray-500 mr-2" size={20} />}
//           <input
//             type="text"
//             placeholder="Search projects"
//             className="flex-1 outline-none lg:w-100"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             onFocus={() => setShowIcon(true)}
//             onBlur={() => setShowIcon(false)}
//           />
//           <button onClick={handleSearch} className="bg-[#a40ff3] text-white px-4 py-2 rounded">Search</button>
//         </div>

//         {/* Buttons (Aligned in one row) */}
//         <button onClick={sortByProjects} className="bg-gray-500 text-sm text-white px-4 py-2 rounded w-60">Sort by Projects</button>
//         <button onClick={sortByDate} className="bg-gray-500 text-sm text-white px-4 py-2 rounded w-60">Sort by Date</button>
//       </div>

//       {/* Project Cards - Responsive Flex Layout */}
//       <div className="mt-9 flex flex-wrap justify-center gap-4">
//         {projects.map((project) => (
//           <div
//             key={project.id}
//             className="border p-2 rounded-lg shadow cursor-pointer hover:shadow-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
//             // onClick={() => navigate(`/tasks/${project.id}`)}
//             onClick={() => navigate(`/home/tasks`)}
//           >
//             <h2 className="text-xl font-bold mb-2">{project.name}</h2>
//             <hr/>
//             <p className="p-1"><strong>Product Owner:</strong> {project.owner}</p>
//             <p className="p-1"><strong>Scrum Master:</strong> {project.scrumMaster}</p>
//             <p className="p-1"><strong>From:</strong> {project.from}</p>
//             <p className="p-1"><strong>To:</strong> {project.to}</p>
//             <p className="p-1"><strong>Status:</strong> {project.status}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// import React from 'react'

// const Projects = () => {
//   return (
//     <>
//     <div className='w-[1000px]'>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     <div>Projects</div>
//     </>
//   )
// }

// export default Projects