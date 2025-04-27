import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, BarChart3, CheckCircle2 } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const COLORS = ['#a40ff3', '#f3e8ff', '#d9b4ff'];

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
    
        //name
        const username = user.username;
        
        const isProductOwner = user?.role === "Product owner";
        const isScrumMaster = user?.role === "Scrum master";
        const isTeamMember = user?.role === "Team member";
        // const isProductOwner = true;
        // const isScrumMaster = false;
        // const isTeamMember = false;

  // Dummy Data
  const sprintProgressData = [
    { name: 'Completed', value: 70 },
    { name: 'Remaining', value: 30 },
  ];

  const projectProgressData = [
    { name: 'Project A', completed: 80 },
    { name: 'Project B', completed: 60 },
    { name: 'Project C', completed: 90 },
  ];

  const teamTasksData = [
    { name: 'Sprint 1', tasksDone: 8, tasksPending: 2 },
    { name: 'Sprint 2', tasksDone: 5, tasksPending: 5 },
  ];

  const myTasksData = [
    { name: 'Completed', value: 5 },
    { name: 'Pending', value: 3 },
  ];

  return (
    <div className="flex-1 overflow-x-auto p-6">
      <h1 className="text-2xl font-bold text-[#a40ff3] mb-6">Reports</h1>

      {isProductOwner && (
        <div className="grid gap-8 md:grid-cols-2">
          {/* Overall Project Progress */}
          <div className="bg-white shadow rounded-2xl p-6">
            <div className="flex items-center mb-4">
              <Trophy className="text-[#a40ff3] mr-2" />
              <h2 className="text-xl font-semibold">Overall Project Progress</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectProgressData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#a40ff3" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Burndown Sprint Progress */}
          <div className="bg-white shadow rounded-2xl p-6">
            <div className="flex items-center mb-4">
              <BarChart3 className="text-[#a40ff3] mr-2" />
              <h2 className="text-xl font-semibold">Sprint Burndown</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={sprintProgressData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {sprintProgressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Scrum Master View */}
      {isScrumMaster && (
        <div className="grid gap-8 md:grid-cols-2">
          <div className="bg-white shadow rounded-2xl p-6">
            <div className="flex items-center mb-4">
              <CheckCircle2 className="text-[#a40ff3] mr-2" />
              <h2 className="text-xl font-semibold">Team Sprint Progress</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={teamTasksData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tasksDone" fill="#a40ff3" radius={[10, 10, 0, 0]} />
                <Bar dataKey="tasksPending" fill="#f3e8ff" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Team Member View */}
      {isTeamMember && (
        <div className="grid gap-8 md:grid-cols-1">
          <div className="bg-white shadow rounded-2xl p-6">
            <div className="flex items-center mb-4">
              <CheckCircle2 className="text-[#a40ff3] mr-2" />
              <h2 className="text-xl font-semibold">My Task Completion</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={myTasksData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {myTasksData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;