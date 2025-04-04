import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const projectsData = [
  { id: 1, name: "Project 1", owner: "Alice", scrumMaster: "Bob", from: "2025-03-01", to: "2025-06-30", status: "In Progress" },
  { id: 2, name: "Project 2", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started" },
  { id: 3, name: "Project 2", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started" },
  { id: 4, name: "Project 2", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started" },
  { id: 5, name: "Project 2", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started" },
  { id: 6, name: "Project 2", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started" },
  { id: 7, name: "Project 2", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started" },
  { id: 8, name: "Project 2", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started" },
  { id: 9, name: "Project 2", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started" },
  { id: 10, name: "Project 2", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started" },
  { id: 11, name: "Project 2", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started" },
  { id: 12, name: "Project 2", owner: "Charlie", scrumMaster: "Dave", from: "2025-04-01", to: "2025-07-30", status: "Not Started" },
];

export default function Projects() {
  const [search, setSearch] = useState("");
  const [showIcon, setShowIcon] = useState(false);
  const [projects, setProjects] = useState(projectsData);
  const navigate = useNavigate();

  const handleSearch = () => {
    const filtered = projectsData.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    setProjects(filtered);
  };

  const sortByProjects = () => {
    setProjects([...projects].sort((a, b) => a.name.localeCompare(b.name)));
  };

  const sortByDate = () => {
    setProjects([...projects].sort((a, b) => new Date(a.from) - new Date(b.from)));
  };

  return (
    <div className="p-4 flex flex-col items-center">
      {/* Search Box + Buttons (Aligned in one row) */}
      <div className="flex items-center gap-4 w-full max-w-2xl lg:max-w-5xl justify-center">
        {/* Search Box */}
        <div className="flex items-center border border-gray-400 rounded-lg px-3 py-2 flex-1 max-w-lg">
          {showIcon && <Search className="text-gray-500 mr-2" size={20} />}
          <input
            type="text"
            placeholder="Search projects"
            className="flex-1 outline-none lg:w-100"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setShowIcon(true)}
            onBlur={() => setShowIcon(false)}
          />
        </div>

        {/* Buttons (Aligned in one row) */}
        <button onClick={handleSearch} className="bg-[#a40ff3] text-white px-4 py-2 rounded">Search</button>
        <button onClick={sortByProjects} className="bg-gray-500 text-white px-4 py-2 rounded w-60">Sort by Projects</button>
        <button onClick={sortByDate} className="bg-gray-500 text-white px-4 py-2 rounded w-50">Sort by Date</button>
      </div>

      {/* Project Cards - Responsive Flex Layout */}
      <div className="mt-9 flex flex-wrap justify-center gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border p-2 rounded-lg shadow cursor-pointer hover:shadow-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
            // onClick={() => navigate(`/tasks/${project.id}`)}
            onClick={() => navigate(`/home/tasks`)}
          >
            <h2 className="text-xl font-bold mb-2">{project.name}</h2>
            <hr/>
            <p className="p-1"><strong>Product Owner:</strong> {project.owner}</p>
            <p className="p-1"><strong>Scrum Master:</strong> {project.scrumMaster}</p>
            <p className="p-1"><strong>From:</strong> {project.from}</p>
            <p className="p-1"><strong>To:</strong> {project.to}</p>
            <p className="p-1"><strong>Status:</strong> {project.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
