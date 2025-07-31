import React, { useEffect, useState } from "react";
import clsx from 'clsx'
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { color } from "framer-motion";

const Home = () => {
  const user = useAuth();
    const whoIsLoggedIn = user?.getWhoIsLoggedIn(); // Get the role of the logged-in user
    if (user) {
      // whoIsLoggedIn = user.getWhoIsLoggedIn();
      console.log("who is logged in", whoIsLoggedIn);
      console.log("user", user);
    }
    else {
      console.log("unAuthenticated user");
      toast.error("No user found, please login again.");
      navigate("/login"); // Redirect to login if not authenticated
    }

    //name
    const username = user.username;
    
    const isProductOwner = user?.role === "Product owner";
    const isScrumMaster = user?.role === "Scrum master";
    const isTeamMember = user?.role === "Team member";
  // Dummy data have to replace with DB.
  //const userRole = "ProductOwner"; // Change this to "ProductOwner" or "TeamMember" also upadte this from db
  //const activeProject = { name: "Project Alpha", from: "Mar 10", to: "Apr 20" };
  const activeSprint = { name: "Sprint 3", from: "Mar 15", to: "Apr 10" };
  //const [stats, setStats] = useState({ ToDo: 0, InProgress: 0, Completed: 0, NeedReview: 0, Testing: 0 });
  let statusData, initialStats;
  if(isTeamMember){
    statusData = [
    { key: "ToDo", label: "Assigned", color: "text-blue-500" },
    { key: "InProgress", label: "In Progress", color: "text-orange-500" },
    { key: "Completed", label: "Completed", color: "text-green-500" },
    { key: "NeedReview", label: "Need Review", color: "text-purple-500" },
    { key: "Testing", label: "Testing", color: "text-yellow-500" },
  ];
  initialStats = {ToDo: 0, InProgress: 0, Completed: 0, NeedReview: 0, Testing: 0 };
  }
  else{
    statusData = [
      {key: "Active", label: "Active", color: "text-blue-500"},
      {key: "Completed", label: "Completed", color: "text-green-500"},
    ];
    initialStats = {Active: 0, Completed: 0};
  }
  const [stats, setStats] = useState(initialStats);

  // const statusData = [
  //   { key: "ToDo", label: "Assigned", color: "text-blue-500" },
  //   { key: "InProgress", label: "In Progress", color: "text-orange-500" },
  //   { key: "Completed", label: "Completed", color: "text-green-500" },
  //   { key: "NeedReview", label: "Need Review", color: "text-purple-500" },
  //   { key: "Testing", label: "Testing", color: "text-yellow-500" },
  // ];

  // Data to display based on role

  const [activeProject, setActiveProject] = useState(null);
  const [epics, setEpics] = useState([]);
  const [userStories, setUserStories] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [mes, setMes] = useState("");
  //active project error area
  const [error, setError] = useState("");
  //table error area
  const [errorTable, setErrorTable] = useState("");

  //common data for all roles
  const [data, setData] = useState([]);
  const [taskBro, setTaskBro] = useState([{}]);

  useEffect(() => {
    const fetchHomeData = async () => {
      //console.log("hello bro");
      try {
        const token = localStorage.getItem("token");
        console.log(token);
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/${whoIsLoggedIn}/home`, {
          headers: {
            Authorization: token,
          }
        });
          console.log("fetching home data...");
          console.log("full res:",res.data);
          const { message, project, epics, userStories, tasks} = res.data;
          console.log("after fetch :" , tasks);
          console.log("project : ",project);
          setMes(message);
          console.log("message : ", message);

          if (!project || project.length === 0) {
            console.log("No projects yet.");
            setError("No projects yet.");
            setMes("Welcome");
            return;
          }

        //const {project, epics} = res.data;
        setActiveProject({
          name: project.title,
          from: new Date(project.start).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          to: new Date(project.deadline).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        });

        if(isProductOwner){
          setData(epics);
        }
        else if(isScrumMaster){
          setData(userStories);
        }
        else {
          // useEffect(() => {
          //     console.log("Setting data:", tasks);
          //     setData(tasks);
          // }, [isTeamMember, tasks]);

          // useEffect(() => {
          //   console.log("Data after state update:", data);
          // }, [data]);

          console.log("inside else tasks:", tasks);
          //setTaskBro(tasks);
          //console.log("task bro:", taskBro);
          setData(tasks);
        }
        console.log("data:", data);

        // if(!data || data.length === 0) {
        //   console.log("Not found, start by creating.");
        //   setErrorTable("Not found, start by creating.");
        //   return;
        // }

        if(isProductOwner){
        const formattedEpics = epics.map((epic, index) => ({
          id: index + 1,
          name: epic.name,
          deadline: new Date(epic.deadline).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          status: epic.status,
        }));

        setEpics(formattedEpics);
      }
      else if(isScrumMaster){
        const formattedUserStories = userStories.map((userStory, index) => ({
          id: index + 1,
          name: userStory.title,
          deadline: new Date(userStory.deadline).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          status: userStory.status,
        }));

        setStats({
          Active: formattedUserStories.filter(item => item.status === "Active").length,
          Completed: formattedUserStories.filter(item => item.status === "Completed").length
        })
        setUserStories(formattedUserStories); 
      }
      else{
        const userTasks = tasks.filter(task => task.teamMemberId === user.id);
        const formattedTasks = userTasks.map((task, index) => ({
          id: index + 1,
          name: task.title,
          myId : task.teamMemberId, 
          deadline: new Date(task.deadline).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          status: task.status,
        }));

        console.log("formattedTasks:", formattedTasks);

        setStats({
          ToDo: formattedTasks.filter((task, index) => task.status === "Todo").length,
          InProgress: formattedTasks.filter((task, index) => task.status === "In Progress").length,
          Completed: formattedTasks.filter((task, index) => task.status === "Completed").length,
          NeedReview: formattedTasks.filter((task, index) => task.status === "Need Review").length,
          Testing: formattedTasks.filter((task, index) => task.status === "Testing").length,
        });
        console.log("statusDataUpdated:", stats);
        // Update stats state
        // statusData.forEach(status => {
        //   setStats(prevStats => ({
        //     ...prevStats,
        //     [status.key]: statusDataUpdated[status.key] || 0,
        //   }));
        // });
        setTasks(formattedTasks);
      }
      } catch (error) {
        console.error("Error fetching home data:", error);
        setError(error.response?.data?.message || "An error occurred while fetching data.");
        setErrorTable(error.response?.data?.message || "An error occurred while fetching data.");
      }
    };

    fetchHomeData();
  }, []);

  // const epics = [
  //   { id: 1, name: "Epic 1", deadline: "Apr 5, 2025", status: "In Progress" },
  //   { id: 2, name: "Epic 2", deadline: "Apr 10, 2025", status: "Not Started" },
  // ];
  // const userStories = [
  //   { id: 1, name: "User Story A", deadline: "Apr 6, 2025", status: "Completed" },
  //   { id: 2, name: "User Story B", deadline: "Apr 8, 2025", status: "In Progress" },
  // ];
  // const tasks = [
  //   { id: 1, name: "Task X", deadline: "Apr 3, 2025", status: "Not Started" },
  //   { id: 2, name: "Task Y", deadline: "Apr 7, 2025", status: "In Progress" },
  // ];

  let listItems = [];
  if (isProductOwner) listItems = epics;
  else if (isScrumMaster) listItems = userStories;
  else listItems = tasks;

  return (
    <div className="flex flex-col justify-between p-6">
        <div className="flex flex-col lg:flex-row gap-6 p-6 bg-purple-200 border-0 rounded-lg">
          {/* Welcome Card */}
          <div className="bg-purple-200 p-3 lg:p-6 rounded-xl w-auto shadow-sm">
            <h2 className="text-1xl lg:text-2xl font-semibold text-[#a40ff3] italic">{mes}</h2>
            <h3 className="text-2xl lg:text-3xl font-semibold text-[#a40ff3] italic">{username} 👋</h3>
          </div>

          {/* Inbox Card */}
          <div className="bg-purple-200 p-6 rounded-xl w-auto shadow-sm flex items-center">
            {activeProject ? (
              <div>
              <p className="text-[#a40ff3] p-2 lg:p-0">
                <strong>Active Project:</strong> {activeProject.name} ({activeProject.from} - {activeProject.to})
              </p>
              <p className="text-[#a40ff3] p-2 lg:p-0">
                <strong>Active Sprint:</strong> {activeSprint.name} ({activeSprint.from} - {activeSprint.to})
              </p>
            </div>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <p className="text-[#a40ff3]">Loading Project info...</p>
            )}
        </div>
    </div>

      {/* Status Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-9">
      {statusData.map((status, index) => (
        <div
          key={index}
          className={`flex flex-col items-center justify-center bg-white h-30 w-auto rounded-lg shadow-md`}
        >
          <span className={`text-7xl font-bold ${status.color}`}>
            {stats[status.key]}
          </span>
          <span className={`text-xl font-semibold ${status.color}`}>
            {status.label}
          </span>
        </div>
      ))}
    </div>

      {/* Table Section */}
      <div className="mt-9 p-6">
        <h3 className="text-lg font-semibold text-[#a40ff3]">My {isProductOwner ? "Epics" : isScrumMaster ? "User Stories" : "Tasks"}:</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-separate border-spacing-0 border-0 rounded-lg">
            <thead>
              <tr className="bg-[#a40ff3]">
                <th className="border-r border-b border-gray-300 text-purple-200 px-4 py-2">S.No</th>
                <th className="border-b border-r border-gray-300 text-purple-200 px-4 py-2">Title</th>
                <th className="border-b border-r border-gray-300 text-purple-200 px-4 py-2">Deadline</th>
                <th className="border-b border-r border-gray-300 text-purple-200 px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {listItems.length > 0 ? (
                listItems.map((item, idx) => (
                  <tr key={idx} className="bg-white text-center">
                    <td className="border-b border-r border-gray-300 px-4 py-2 text-purple-500">{item.id}</td>
                    <td className="border-b border-r border-gray-300 px-4 py-2 text-purple-500">{item.name}</td>
                    <td className="border-b border-r border-gray-300 px-4 py-2 text-purple-500">{item.deadline}</td>
                    <td className={`border-b border-gray-300 px-4 py-2 font-semibold 
                      ${item.status === "In Progress" ? "text-orange-500" :
                        item.status === "Completed" ? "text-green-500" :
                        item.status === "Active" ? "text-blue-500" :
                        "text-gray-600"}`}>
                      {item.status}
                    </td>
                  </tr>
                ))
              ) : errorTable ? (
                <tr>
                  <td colSpan="4" className="text-center text-red-500">{errorTable}</td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-purple-500">Loading...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;


// import React from 'react'

// const Home = () => {
//   return (
//     <div>Home</div>
//   )
// }

// export default Home