import React, {useState ,useEffect } from "react";
import '../SignUp.css';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { PieChart as PieIcon, BarChart3, ClipboardList, FileText, PercentCircle, TimerReset } from "lucide-react";
import useAuth from '../hooks/useAuth';
import axios from "axios";
import { toast } from "react-toastify";

const dataFromBackend = {
  totalUserStories: 0,
  completedUserStories: 0,
  userStoryCompletionRate: 0,
  currentProjectUserStoryCompletionRate: 0,
  userStorySuccessRate: 0,
  userStoriesSpillOverRate: 0,
  averageUserStoryCompletionTime: 0,
  totalSprints: 0,
  completedSprints: 0,
  sprintCompletionRate: 0,
  currentProjectSprintCompletionRate: 0,
  sprintSuccessRate: 0,
  sprintSpillOverRate: 0,
  averageSprintCompletionTime: 0,
};

const data = {
    totalEpics: 0,
    completedEpics: 0,
    epicCompletionRate: 0,
    currentProjectEpicCompletionRate: 0,
    epicSuccessRate: 0,
    epicSpillOverRate: 0,
    averageEpicCompletionTime: 0,

    totalProjects: 0,
    completedProjects: 0,
    projectCompletionRate: 0,
    projectSuccessRate: 0,
    projectSpillOverRate: 0,
    averageProjectCompletionTime: 0
  };

  const taskData = {
  totalTasks: 0,
  completedTasks: 0,
  taskCompletionRate: 0,
  currentProjectTaskCompletionRate: 0,
  taskSuccessRate: 0,
  taskSpillOverRate: 0,
  averageTaskCompletionTime: 0, // in days
};

const COLORS = ["#a40ff3", "#f3e8ff", "#6b21a8"];
//const COLORS = ['#a40ff3', '#e0e0e0'];

const Reports = () => {
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
    
        const token = localStorage.getItem("token");
        //name
        const username = user.username;
        
        const isProductOwner = user?.role === "Product owner";
        const isScrumMaster = user?.role === "Scrum master";
        const isTeamMember = user?.role === "Team member";
        // const isProductOwner = true;
        // const isScrumMaster = false;
        // const isTeamMember = false;

        const [reportData, setReportData] = useState(null);
        const [reportDataPO, setReportDataPO] = useState(null);
        const [reportDataTM, setReportDataTM] = useState(null);
        const [error, setError] = useState(null);
        const [errorPO, setErrorPO] = useState(null); 
        const [errorTM, setErrorTM] = useState(null);

  const reportFetchSM = async () => {
    try {
      console.log("Fetching Reports...");

      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/${whoIsLoggedIn}/report`, {
        headers: {
          Authorization: token
        }
      });

      if (res.status === 200) {
        console.log("Reports fetched successfully");
        setReportData(res.data);
        };
      }catch (error) {
      if (error.res) {
            console.log("Error:", error.res.data.message); // This will log "Internal server error. Please try again later."
            toast.error(error.res.data.message); // Show the error message to the user
            setError(error.res.data.message);
        } else {
            console.log("Error:", error.message);
            toast.error("An error occurred while fetching reports. Please try again later.");
            setError("An error occurred while fetching reports. Please try again later.");
        }
      //setError("Error fetching report data");
    }
  }

  const reportFetchPO = async () => {
    try {
      console.log("Fetching Reports...");

      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/${whoIsLoggedIn}/report`, {
        headers: {
          Authorization: token
        }
      });

      if (res.status === 200) {
        console.log("Reports fetched successfully");
        setReportDataPO(res.data);
        };
      }catch (error) {
      if (error.res) {
            console.log("Error:", error.res.data.message); // This will log "Internal server error. Please try again later."
            toast.error(error.res.data.message); // Show the error message to the user
            setErrorPO(error.res.data.message);
        } else {
            console.log("Error:", error.message);
            toast.error("An error occurred while fetching reports. Please try again later.");
            setErrorPO("An error occurred while fetching reports. Please try again later.");
        }
      //setError("Error fetching report data");
    }
  }

  const reportFetchTM = async () => {
    try {
      console.log("Fetching Reports...");

      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/${whoIsLoggedIn}/report`, {
        headers: {
          Authorization: token
        }
      });

      if (res.status === 200) {
        console.log("Reports fetched successfully");
        setReportDataTM(res.data);
        };
      }catch (error) {
      if (error.res) {
            console.log("Error:", error.res.data.message); // This will log "Internal server error. Please try again later."
            toast.error(error.res.data.message); // Show the error message to the user
            setErrorTM(error.res.data.message);
        } else {
            console.log("Error:", error.message);
            toast.error("An error occurred while fetching reports. Please try again later.");
            setErrorTM("An error occurred while fetching reports. Please try again later.");
        }
      //setError("Error fetching report data");
    }
  }

  useEffect(() => {
    if (isProductOwner) {
      reportFetchPO();
    } else if (isScrumMaster) {
      reportFetchSM();
    } else if (isTeamMember) {
      reportFetchTM();
    }
  },[]);

  if(reportData){
    console.log("Report Data:", reportData);
    dataFromBackend.totalUserStories = reportData.totalUserStories;
    dataFromBackend.completedUserStories = reportData.completedUserStories;
    dataFromBackend.userStoryCompletionRate = reportData.userStoryCompletionRate;
    dataFromBackend.currentProjectUserStoryCompletionRate = reportData.currentProjectUserStoryCompletionRate;
    dataFromBackend.userStorySuccessRate = reportData.userStorySuccessRate;
    dataFromBackend.userStoriesSpillOverRate = reportData.userStoriesSpillOverRate;
    dataFromBackend.averageUserStoryCompletionTime = reportData.averageUserStoryCompletionTime;
    dataFromBackend.totalSprints = reportData.totalSprints;
    dataFromBackend.completedSprints = reportData.completedSprints;
    dataFromBackend.sprintCompletionRate = reportData.sprintCompletionRate;
    dataFromBackend.currentProjectSprintCompletionRate = reportData.currentProjectSprintCompletionRate;
    dataFromBackend.sprintSuccessRate = reportData.sprintSuccessRate;
    dataFromBackend.sprintSpillOverRate = reportData.sprintSpillOverRate;
    dataFromBackend.averageSprintCompletionTime = reportData.averageSprintCompletionTime;
  }  

     const {
    userStoryCompletionRate,
    userStorySuccessRate,
    userStoriesSpillOverRate,
    sprintCompletionRate,
    sprintSuccessRate,
    sprintSpillOverRate,
  } = dataFromBackend;

  if(reportDataPO){
    console.log("Report Data PO:", reportDataPO);
    data.totalEpics = reportDataPO.totalEpics;
    data.completedEpics = reportDataPO.completedEpics;
    data.epicCompletionRate = reportDataPO.epicCompletionRate;
    data.currentProjectEpicCompletionRate = reportDataPO.currentProjectEpicCompletionRate;
    data.epicSuccessRate = reportDataPO.epicSuccessRate;
    data.epicSpillOverRate = reportDataPO.epicSpillOverRate;
    data.averageEpicCompletionTime = reportDataPO.averageEpicCompletionTime;
    data.totalProjects = reportDataPO.totalProjects;
    data.completedProjects = reportDataPO.completedProjects;
    data.projectCompletionRate = reportDataPO.projectCompletionRate;
    data.projectSuccessRate = reportDataPO.projectSuccessRate;
    data.projectSpillOverRate = reportDataPO.projectSpillOverRate;
    data.averageProjectCompletionTime = reportDataPO.averageProjectCompletionTime;
  }

  if(reportDataTM){
    console.log("Report Data TM:", reportDataTM);
    taskData.totalTasks = reportDataTM.totalTasks;
    taskData.completedTasks = reportDataTM.completedTasks;
    taskData.taskCompletionRate = reportDataTM.taskCompletionRate;
    taskData.currentProjectTaskCompletionRate = reportDataTM.currentProjectTaskCompletionRate;
    taskData.taskSuccessRate = reportDataTM.taskSuccessRate;
    taskData.taskSpillOverRate = reportDataTM.taskSpillOverRate;
    taskData.averageTaskCompletionTime = reportDataTM.averageTaskCompletionTime;
  }

  const userStoryPieData = [
    { name: "Completed", value: userStoryCompletionRate },
    { name: "Spill Over", value: userStoriesSpillOverRate },
    { name: "Success", value: userStorySuccessRate },
  ];

  const sprintBarData = [
    { name: "Completion", value: sprintCompletionRate },
    { name: "Success", value: sprintSuccessRate },
    { name: "Spill Over", value: sprintSpillOverRate },
  ];

  const StatCard = ({ title, value }) => (
    <div className="bg-white rounded-2xl shadow p-4 w-60 text-center border border-gray-200">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-xl font-bold text-purple-700">{value}</p>
    </div>
  );

  const epicDistribution = [
    { name: 'Completed', value: data.completedEpics },
    { name: 'Pending', value: data.totalEpics - data.completedEpics },
  ];

  const COLORSP = ['#a40ff3', '#e0e0e0'];

  const epicMetrics = [
    { name: 'Completion Rate', value: data.epicCompletionRate },
    { name: 'Success Rate', value: data.epicSuccessRate },
    { name: 'Spillover Rate', value: data.epicSpillOverRate }
  ];

  const projectMetrics = [
    { name: 'Completion Rate', value: data.projectCompletionRate },
    { name: 'Success Rate', value: data.projectSuccessRate },
    { name: 'Spillover Rate', value: data.projectSpillOverRate }
  ];

  const pieChartData = [
  { name: 'Completed', value: taskData.completedTasks },
  { name: 'Remaining', value: taskData.totalTasks - taskData.completedTasks },
];

  return (
    <div className="overflow-x-auto p-4">
      <div className="min-w-[800px]">
        {isScrumMaster && reportData ? (
          <>
          <h2 className="text-2xl font-bold mb-4 text-purple-700">Reports Overview</h2>
            {/* Stat Cards */}
            <div className="flex gap-4 flex-wrap mb-6">
              <StatCard title="Total User Stories" value={dataFromBackend.totalUserStories} />
              <StatCard title="Completed User Stories" value={dataFromBackend.completedUserStories} />
              <StatCard title="Avg. User Story Time (days)" value={dataFromBackend.averageUserStoryCompletionTime} />
              <StatCard title="Total Sprints" value={dataFromBackend.totalSprints} />
              <StatCard title="Completed Sprints" value={dataFromBackend.completedSprints} />
              <StatCard title="Avg. Sprint Time (days)" value={dataFromBackend.averageSprintCompletionTime} />
            </div>

            {/* Pie Chart */}
            <div className="bg-white p-4 rounded-2xl shadow border border-gray-200 mb-6">
              <div className="flex items-center mb-4">
                <PieIcon className="text-purple-700 mr-2" />
                <h3 className="text-lg font-semibold text-purple-700">User Story Distribution</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userStoryPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {userStoryPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center mt-4 gap-4">
                {userStoryPieData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-gray-700">
                      {item.name}: <span className="font-medium">{item.value}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-white p-4 rounded-2xl shadow border border-gray-200">
              <div className="flex items-center mb-4">
                <BarChart3 className="text-purple-700 mr-2" />
                <h3 className="text-lg font-semibold text-purple-700">Sprint Metrics</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sprintBarData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#a40ff3" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center mt-4 gap-4">
                {sprintBarData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-gray-700">
                      {item.name}: <span className="font-medium">{item.value}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-md">
            <p>{error}</p>
          </div>
        ) : (
          isScrumMaster && (
            <div className="flex justify-center items-center h-32">
              <div className="relative w-10 h-10 animate-[spin-dots_1.2s_linear_infinite]">
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-purple-500 rounded-full transform -translate-x-1/2"></div>
                <div className="absolute top-1/2 left-0 w-2 h-2 bg-purple-400 rounded-full transform -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-purple-300 rounded-full transform -translate-x-1/2"></div>
                <div className="absolute top-1/2 right-0 w-2 h-2 bg-purple-200 rounded-full transform -translate-y-1/2"></div>
              </div>
            </div>
          )
        )}

        {/*PO*/}
        {isProductOwner && reportDataPO ? (
          <>
          {/* <h2 className="text-2xl font-bold mb-4 text-purple-700">Reports Overview</h2> */}
            <h2 className="text-xl font-bold text-[#a40ff3] flex items-center gap-2 m-2 mb-4 p-1"> 
              <ClipboardList size={20} /> Epic Distribution
            </h2>
            {/* Stat Cards */}
            <div className="flex gap-4 flex-wrap mb-6">
              <StatCard title="Total User Stories" value={data.totalEpics} />
              <StatCard title="Completed User Stories" value={data.completedEpics} />
              <StatCard title="Avg. User Story Time (days)" value={data.averageEpicCompletionTime} />
              <StatCard title="Total Sprints" value={data.totalProjects} />
              <StatCard title="Completed Sprints" value={data.completedProjects} />
              <StatCard title="Avg. Sprint Time (days)" value={data.averageProjectCompletionTime} />
            </div>

            {/* Pie Chart */}
            <div className="flex flex-col md:flex-row gap-4 items-start">
          {/* Pie Chart */}
          <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={epicDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {epicDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              </div>
          {/* Indicators */}
              <div className="flex flex-wrap justify-center gap-4 mb-4">
                {epicDistribution.map((entry, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-gray-700">
                      {entry.name}: <span className="font-medium">{entry.value}</span>
                    </span>
                  </div>
                ))}
              </div>

        {/* Epic Metrics */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-[#a40ff3] flex items-center gap-2 m-2 mb-4 p-1">
            <FileText size={20} /> Epic Metrics
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={epicMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis unit="%" />
              <Tooltip />
              <Bar dataKey="value" fill="#a40ff3" />
            </BarChart>
          </ResponsiveContainer>
              <div className="flex flex-wrap justify-center mt-8 gap-4 mb-8">
                {epicMetrics.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-gray-700">
                      {item.name}: <span className="font-medium">{item.value}</span>
                    </span>
                  </div>
                ))}
              </div>
        </div>

        {/* Project Metrics */}
        <div>
          <h2 className="text-xl font-bold text-[#a40ff3] flex items-center gap-2 m-2 mb-4 p-1">
            <ClipboardList size={20} /> Project Metrics
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis unit="%" />
              <Tooltip />
              <Bar dataKey="value" fill="#a40ff3" />
            </BarChart>
          </ResponsiveContainer>
              <div className="flex flex-wrap justify-center mt-8 gap-4">
                {projectMetrics.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-gray-700">
                      {item.name}: <span className="font-medium">{item.value}</span>
                    </span>
                  </div>
                ))}
              </div>
        </div>
          </>
        ) : errorPO ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-md">
            <p>{errorPO}</p>
          </div>
        ) : (
          isProductOwner && (
            <div className="flex justify-center items-center h-32">
              <div className="relative w-10 h-10 animate-[spin-dots_1.2s_linear_infinite]">
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-purple-500 rounded-full transform -translate-x-1/2"></div>
                <div className="absolute top-1/2 left-0 w-2 h-2 bg-purple-400 rounded-full transform -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-purple-300 rounded-full transform -translate-x-1/2"></div>
                <div className="absolute top-1/2 right-0 w-2 h-2 bg-purple-200 rounded-full transform -translate-y-1/2"></div>
              </div>
            </div>
          )
        )}

        {/*TM*/}
        {isTeamMember && reportDataTM ?(
          <>
          {/* <h2 className="text-2xl font-bold mb-4 text-purple-700">Reports Overview</h2> */}
            <h2 className="text-xl font-bold text-[#a40ff3] flex items-center gap-2 m-2 mb-4 p-1">
             Team Member Reports
            </h2>
            <div className="w-full md:w-1/2 lg:w-1/3 mx-auto mb-8">
        <div className="bg-white shadow-md rounded-2xl p-4 m-3">
          <h3 className="text-lg font-medium mb-2 text-center text-purple-700">Task Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* Mobile Indicators */}
          <div className="flex justify-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-[#a40ff3] rounded"></div>
              <span>Completed</span>
              <span className="font-medium text-purple-700">{taskData.completedTasks}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-[#d6b5f9] rounded"></div>
              <span>Remaining</span>
              <span className="font-medium text-purple-700">{taskData.totalTasks - taskData.completedTasks}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-2">
        <MetricCard label="Task Completion Rate" value={`${taskData.taskCompletionRate}%`} icon={<PercentCircle className="text-purple-600" />} />
        <MetricCard label="Current Project Task Completion Rate" value={`${taskData.currentProjectTaskCompletionRate}%`} icon={<PercentCircle className="text-purple-600" />} />
        <MetricCard label="Task Success Rate" value={`${taskData.taskSuccessRate}%`} icon={<PercentCircle className="text-purple-600" />} />
        <MetricCard label="Task Spill Over Rate" value={`${taskData.taskSpillOverRate}%`} icon={<PercentCircle className="text-purple-600" />} />
        <MetricCard label="Avg. Task Completion Time" value={`${taskData.averageTaskCompletionTime} days`} icon={<TimerReset className="text-purple-600" />} />
      </div>
          </>
        ) : errorTM ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-md">
            <p>{errorTM}</p>
          </div>
        ) : (
          isTeamMember && (
            <div className="flex justify-center items-center h-32">
              <div className="relative w-10 h-10 animate-[spin-dots_1.2s_linear_infinite]">
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-purple-500 rounded-full transform -translate-x-1/2"></div>
                <div className="absolute top-1/2 left-0 w-2 h-2 bg-purple-400 rounded-full transform -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-purple-300 rounded-full transform -translate-x-1/2"></div>
                <div className="absolute top-1/2 right-0 w-2 h-2 bg-purple-200 rounded-full transform -translate-y-1/2"></div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Reports;


function MetricCard({ label, value, icon }) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 flex items-center gap-4">
      <div className="bg-purple-100 p-2 rounded-xl">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-xl font-semibold text-purple-700">{value}</p>
      </div>
    </div>
  );
}