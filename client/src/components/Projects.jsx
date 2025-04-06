import { useState, useEffect } from "react";
import { Search, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Dummy Projects Data
const projectsData = [
    { id: 1, name: "Seenu", owner: "Aliceee", scrumMaster: "Bob", from: "2025-03-01", to: "2025-06-30", status: "In Progress", progress: 50 },
    { id: 2, name: "Apple", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Completed", progress: 100 },
    { id: 3, name: "Windows", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "In Progress", progress: 50},
    { id: 4, name: "Linux", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started", progress: 0},
    { id: 5, name: "Linux", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started", progress: 0},
    { id: 6, name: "Projectl 2", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started", progress: 0},
    { id: 7, name: "Projectl 2", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started", progress: 0},
    { id: 8, name: "Project 2", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started", progress: 0 },
    { id: 9, name: "Project 2", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started", progress: 0 },
    { id: 10, name: "Project 2", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started", progress: 0 },
    { id: 11, name: "Project 2", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started", progress: 0 },
    { id: 12, name: "Project 2", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started", progress: 0 },
  ];

export default function Projects() {
  const [search, setSearch] = useState("");
  const [showIcon, setShowIcon] = useState(false);
  const [projects, setProjects] = useState(projectsData);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();


  const getProgressColor = (progress) => {
    if (progress === 0) return 'bg-red-500';
    if (progress > 0 && progress < 100) return 'bg-orange-500';
    return 'bg-green-500'; // progress === 100
  };

  const getCardBg = (progress) => {
    if (progress === 0) return 'bg-red-100';
    if (progress > 0 && progress < 100) return 'bg-orange-100';
    return 'bg-green-100'; // progress === 100
  };
  

  // Filter projects by search text
  useEffect(() => {
    const filtered = projectsData.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    setProjects(filtered);
  }, [search]);

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

  return (
    <div className="flex flex-col items-center">
      {/* Header */}
      <div className="sticky top-0 z-50 w-full bg-white border-b pb-4">
        <div className="flex items-center justify-between px-4 pt-4">
          {/* Title */}
          <div className="text-xl font-bold text-[#a40ff3]">Project Dashboard</div>

          {/* Desktop Search + Buttons */}
          <div className="hidden lg:flex items-center gap-4 w-full max-w-5xl ml-6">
            <div className="flex items-center border border-gray-400 rounded-lg px-3 py-2 flex-1">
              {showIcon && <Search className="text-gray-500 mr-2" size={20} />}
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
            <button
              onClick={sortByProjects}
              className="bg-gray-500 text-white px-4 py-2 rounded text-sm w-48"
            >
              Sort by Projects
            </button>
            <button
              onClick={sortByDate}
              className="bg-gray-500 text-white px-4 py-2 rounded text-sm w-48"
            >
              Sort by Date
            </button>
          </div>

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
              {showIcon && <Search className="text-gray-500 mr-2" size={20} />}
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
            <button className="bg-[#a40ff3] text-white px-4 py-2 rounded w-full">
              Search
            </button>
            <button
              onClick={sortByProjects}
              className="bg-gray-500 text-white px-4 py-2 rounded w-full text-sm"
            >
              Sort by Projects
            </button>
            <button
              onClick={sortByDate}
              className="bg-gray-500 text-white px-4 py-2 rounded w-full text-sm"
            >
              Sort by Date
            </button>
          </div>
        )}
      </div>

      {/* Project Cards */}
      <div className="bg-gray-50 py-10 flex flex-wrap w-full h-auto justify-center gap-10 px-10 lg:px-0">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`border-0 rounded-md shadow w-auto h-full p-5 cursor-pointer hover:shadow-lg sm:w-1/2 md:w-1/3 lg:w-1/5 transition duration-200 ${getCardBg(project.progress)}`}
            onClick={() => navigate(`/home/tasks`)}
          >
            <h2 className="text-xl font-bold mb-2">{project.name}</h2>
            <hr />
            <p className="p-1">
              <strong>Product Owner:</strong> {project.owner}
            </p>
            <p className="p-1">
              <strong>Scrum Master:</strong> {project.scrumMaster}
            </p>
            <p className="p-1">
              <strong>From:</strong> {project.from}
            </p>
            <p className="p-1">
              <strong>To:</strong> {project.to}
            </p>
            <p className="p-1">
              <strong>Status:</strong> {project.status}
            </p>
            <div className="p-2">
            <div className="relative w-full h-1 bg-gray-500 mt-5 rounded overflow-visible">
              <div className={`absolute -top-7 left-1/2 -translate-x-1/2 text-sm ${getProgressColor(project.progress)} text-white px-2 py-0.5 rounded shadow`} style={{left: `calc(${project.progress}%)`}}>
                {project.progress}%
                <div className={`w-2 h-2 ${getProgressColor(project.progress)} rotate-45 absolute left-1/2 -bottom-1 -translate-x-1/2`}></div>
              </div>
              <motion.div className={`h-full ${getProgressColor(project.progress)} transition-all duration-300`} initial={{width:0}} animate={{width: `${project.progress}%`}} transition={{duration: 0.5}} />
            </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}








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