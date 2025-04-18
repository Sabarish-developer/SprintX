import React, { useState, useEffect, useRef } from 'react';
import { Menu, SortAsc, X, Plus, Pencil, Trash2 } from 'lucide-react';
import '../SignUp.css';
import useAuth from "../hooks/useAuth";

const sprintData = [
  { id: 1, title: 'seenu', start: '2024-04-01', deadline: '2024-05-15', priority: 'Active' },
  { id: 2, title: 'zzzz', start: '2024-04-16', deadline: '2024-04-30', priority: 'Completed' },
  { id: 3, title: 'aaaa', start: '2024-05-01', deadline: '2024-04-15', priority: 'Active' },
];

const epicData = [
  { id: 1, title: 'Epic A', deadline: '2024-05-01', priority: 'Ongoing', description: 'This is a detailed description for Epic A that is long enough to show scrolling behavior inside the popup.' },
  { id: 2, title: 'Epic B', deadline: '2024-06-01', priority: 'Pending', description: 'Epic B involves creating UI for reports and analytics.' },
];

const ProjectDetails = () => {

  const user = useAuth();
  const isProductOwner = user?.role === "Product owner";

  const [Sprints, setSprints] = useState(sprintData);
  const [Epics, setEpics] = useState(epicData);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [epicToEdit, setEpicToEdit] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [selectedEpic, setSelectedEpic] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [epicAction, setEpicAction] = useState('');

  const filteredSprints = [...Sprints]
    .filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOption === 'Sprints') {
        return a.title.localeCompare(b.title);
      } else if (sortOption === 'Date') {
        return new Date(b.start) - new Date(a.start);
      }
      return 0;
    });

  const clearSort = () => {
    setSortOption('');
  };

  const handleEditClick = (epic) => {
    setEpicToEdit(epic);
    setEditModalOpen(true);
  };
  
  const handleEditSave = () => {
    if (isCreating) {
      setEpics(prev => [...prev, epicToEdit]);
    } else {
      setEpics(prev =>
        prev.map(epic =>
          epic.id === epicToEdit.id ? epicToEdit : epic
        )
      );
    }
    setEditModalOpen(false);
    setIsCreating(false);
  };
  

  const handleDelete = (id) => {
    setEpics(prev => prev.filter(epic => epic.id !== id));
  };
  

  return (
    <div className="p-4 space-y-6">
      {/* Top Search & Sort */}
      <div className='bottom-shadow-nav p-2'>
      <div className="hidden lg:flex lg:items-center gap-4 max-w-5xl">
        <div className="flex items-center border-0 rounded-lg px-3 py-2">
          <input
            type="text"
            className="flex-1 outline-none input-field"
            placeholder="Search sprints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <SortDropdown
          sortType={sortOption}
          sortByProjects={() => setSortOption('Sprints')}
          sortByDate={() => setSortOption('Date')}
          clearSort={clearSort}
        />
      </div>

      <div className="lg:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-gray-700 ml-2"
        >
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="lg:hidden px-4 mt-3 space-y-3">
          <div className="flex items-center border border-gray-400 rounded-lg px-3 py-2">
            <input
              type="text"
              className="flex-1 outline-none"
              placeholder="Search sprints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <SortDropdown
            sortType={sortOption}
            sortByProjects={() => setSortOption('Sprints')}
            sortByDate={() => setSortOption('Date')}
            clearSort={clearSort}
          />
        </div>
      )}
      </div>

      {/* Sprint Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSprints.map(sprint => (
          <div key={sprint.id} className="border-0 bg-white rounded-xl bottom-shadow p-4">
            <h3 className="text-lg font-semibold">{sprint.title}</h3>
            <p className="text-sm text-gray-500">Start: {sprint.start}</p>
            <p className="text-sm text-gray-500">Deadline: {sprint.deadline}</p>
            <span className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${sprint.priority === 'Active' ? 'bg-orange-100 text-orange-800' : 'bg-green-200 text-green-700'}`}>
              {sprint.priority}
            </span>
          </div>
        ))}
      </div>

      {/* Epic Table */}
      <h2 className="text-lg font-semibold mt-8 mb-2">Epics</h2>
      {isProductOwner && (
        <button
        onClick={() => {
          setEpicToEdit({ title: "", description: "", deadline: "", priority: "Planned", id: Date.now() });
          setEditModalOpen(true);
          setIsCreating(true);
          setEpicAction('Create Epics');
        }}
        className="flex items-center gap-2 px-4 py-2 border-0 rounded-lg bg-[#a40ff3] text-white cursor-pointer hover:bg-white hover:text-[#a40ff3] transition-colors duration-200 group hover:border-b-2 border-[#a40ff3]"
      >
        <Plus size={16} className="text-white transition-colors duration-200 group-hover:text-[#a40ff3]" />
        <span className="group-hover:text-purple-500">Create Epics</span>
      </button>
      )}
    <div className="overflow-x-auto">
        <table className="min-w-full border rounded-xl overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-sm font-medium text-gray-700">S.No</th>
              <th className="p-3 text-left text-sm font-medium text-gray-700">Title</th>
              <th className="p-3 text-left text-sm font-medium text-gray-700">priority</th>
              <th className="p-3 text-left text-sm font-medium text-gray-700">Deadline</th>
              {isProductOwner && (
                <th className="p-3 text-left text-sm font-medium text-gray-700">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {Epics.map((epic, idx) => (
              <tr key={epic.id} className="border-t">
                <td className="p-3 text-sm">{idx + 1}</td>
                <td
                  className="p-3 text-sm text-blue-600 cursor-pointer hover:underline"
                  onClick={() => setSelectedEpic(epic)}
                >
                  {epic.title}
                </td>
                <td className="p-3 text-sm">{epic.priority}</td>
                <td className="p-3 text-sm">{epic.deadline}</td>
                {isProductOwner && (
                  <td className="p-3 text-sm">
                    <div className="flex items-center gap-3 text-gray-600">
                      <button onClick={() => {handleEditClick(epic); setEpicAction('Edit Epic')}} className="cursor-pointer text-gray-800 hover:text-gray-600">
                        <Pencil size={18} />
                      </button>
                      <div className="h-5 w-px bg-gray-300" />
                      <button onClick={() => handleDelete(epic.id)} className="text-red-500 cursor-pointer hover:text-red-600">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* Modal Popup */}
          {selectedEpic && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white w-[90%] max-w-md p-6 rounded-xl shadow-xl relative">
                <h2 className="text-lg font-bold mb-2">{selectedEpic.title} - Description</h2>
                <div className="h-[200px] overflow-y-auto text-sm text-gray-700 border p-3 rounded">
                  {selectedEpic.description}
                </div>
                <button
                  className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
                  onClick={() => setSelectedEpic(null)}
                >
                  ✕
                </button>
              </div>
            </div>
          )}

      {editModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">{epicAction}</h2>
            <div className="space-y-3">
            <label className="text-md font-medium mb-1">Title</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                placeholder="Title"
                value={epicToEdit.title}
                onChange={(e) => setEpicToEdit({ ...epicToEdit, title: e.target.value })}
              />
              <label className="text-md font-medium mb-1">Description</label>
              <textarea
                className="w-full p-2 border rounded-md h-28 resize-none overflow-y-auto mb-0"
                placeholder="Enter epic description..."
                value={epicToEdit.description}
                // onChange={(e) => setEpicToEdit({ ...epicToEdit, description: e.target.value })}
                onChange={(e) => {
                  const words = e.target.value.trim().split(/\s+/);
                  if (words.length <= 100) {
                    setEpicToEdit({ ...epicToEdit, description: e.target.value });
                  }
                }}                
              />
              <p className="text-xs text-gray-500 text-right">
                {epicToEdit.description.trim().split(/\s+/).filter(Boolean).length}/100 words
              </p>

              <label className="text-md font-medium mb-1">Priority</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={epicToEdit.priority}
                onChange={(e) => setEpicToEdit({ ...epicToEdit, priority: e.target.value })}
              >
                <option value="Ongoing">Ongoing</option>
                <option value="Pending">Pending</option>
              </select>

              <label className="text-md font-medium mb-1">Deadline</label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2"
                value={epicToEdit.deadline}
                onChange={(e) => setEpicToEdit({ ...epicToEdit, deadline: e.target.value })}
              />
            </div>
            <div className="flex justify-end mt-5 gap-3">
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-100"
              onClick={() => {
                setEditModalOpen(false);
                setIsCreating(false);
              }}>
                Cancel
            </button>

            <button
              className="px-4 py-2 bg-[#a40ff3] text-white rounded hover:bg-purple-500"
              onClick={handleEditSave}
            >
              Save
            </button>
            </div>
          </div>
        </div>
      )}

    </div>
    
  );
};

export default ProjectDetails;

function SortDropdown({ sortType, sortByProjects, sortByDate, clearSort }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div ref={dropdownRef} className="relative inline-block text-left">
        <button
          onClick={() => setOpen(!open)}
          className="bg-[#a40ff3] hover:bg-white hover:text-[#a40ff3] text-white px-4 py-2 rounded shadow-sm text-sm flex items-center gap-2"
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
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#a40ff3] hover:text-white"
              >
                Sprints
              </button>
              <button
                onClick={() => {
                  sortByDate();
                  setOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#a40ff3] hover:text-white"
              >
                Date
              </button>
            </div>
          </div>
        )}
      </div>

      {sortType && (
        <button
          onClick={clearSort}
          className="bg-red-500 hover:bg-red-600 text-white w-30 px-3 py-2 rounded text-sm flex items-center gap-1 shadow"
        >
          <X size={16} />
          Clear Sort
        </button>
      )}
    </div>
  );
}
