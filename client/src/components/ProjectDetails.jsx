import React, { useState, useEffect, useRef } from 'react';
import { Menu, SortAsc, X, Plus, Pencil, Trash2, FolderPlus, User } from 'lucide-react';
import '../SignUp.css';
import useAuth from "../hooks/useAuth";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import ConfirmToast from './ConfirmToast';
import Select from 'react-select';

const sprintData = [
  { id: 1, title: 'seenu', start: '2024-04-01', deadline: '2024-05-15', status: 'Active' },
  { id: 2, title: 'zzzz', start: '2024-04-16', deadline: '2024-04-30', status: 'Completed' },
  { id: 3, title: 'aaaa', start: '2024-05-01', deadline: '2024-04-15', status: 'Active' },
];

const epicData = [
  { id: 1, title: 'Epic A', deadline: '2024-05-01', priority: 'High', description: 'This is a detailed description for Epic A that is long enough to show scrolling behavior inside the popup.' },
  { id: 2, title: 'Epic B', deadline: '2024-06-01', priority: 'Medium', description: 'Epic B involves creating UI for reports and analytics.' },
];

const userStoriesData = [
  { id: 1, title: 'Userstory A', deadline: '2024-05-02', priority: 'High', description: 'This is a detailed description for Uerstory A that is long enough to show scrolling behavior inside the popup.' },
  { id: 2, title: 'Userstory B', deadline: '2024-06-02', priority: 'Medium', description: 'Userstory B involves creating UI for reports and analytics.' },
];

const tasksData = [
  { id: 1, title: 'Task A', deadline: '2024-05-03', priority: 'Medium', description: 'This is a detailed description for Task A that is long enough to show scrolling behavior inside the popup.' },
  { id: 2, title: 'Task B', deadline: '2024-06-03', priority: 'High', description: 'Task B involves creating UI for reports and analytics.' },
];

const ProjectDetails = () => {

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

  const tr = true;
    
  const isProductOwner = user?.role === "Product owner";
  const isScrumMaster = user?.role === "Scrum master";
  const isTeamMember = user?.role === "Team member";
  const { projectId } = useParams();
  const navigate = useNavigate();
  console.log("Project ID:", projectId);
  console.log("User Role:", user?.role);
  const token = localStorage.getItem("token");

  //userstory part
  const[userStory, setUserStory] = useState([]);
  const[userStoryAction, setUserStoryAction] = useState('');
  const[userStoryToEdit, setUserStoryToEdit] = useState();
  const[isUserStoryCreating, setIsUserStoryCreating] = useState(false);
  const[showUserStoryModal, setShowUserStoryModal] = useState(false);
  const[selectedUserStory, setSelectedUserStory] = useState(null);
  const [epicOptions, setEpicOptions] = useState([]);
  const [selecteddEpic, setSelecteddEpic] = useState(null);
  const selectedEpicId = selecteddEpic?.value;
  const [userStoryError, setUserStoryError] = useState(null);


  //task part
  const[task, setTask] = useState([]);
  const[taskAction, setTaskAction] = useState('');
  const[taskToEdit, setTaskToEdit] = useState();
  const[isTaskCreating, setIsTaskCreating] = useState(false);
  const[showTaskModal, setShowTaskModal] = useState(false);
  const[selectedTask, setSelectedTask] = useState(null);
  const [USOptions, setUSOptions] = useState([]);
  const [selectedUS, setSelectedUS] = useState(null);
  const selectedUSId = selectedUS?.value;
  const [TMOptions, setTMOptions] = useState([]);
  const [selectedTM, setSelectedTM] = useState(null);
  const selectedTMId = selectedTM?.value;
  const [taskError, setTaskError] = useState(null);
  console.log("selectedTMId", selectedTMId);

  //sprint part
  const [Sprints, setSprints] = useState([]);
  const [sprintsData, setSprintsData] = useState([]);
  const [sprintAction, setSprintAction] = useState('');
  const [sprintToEdit, setSprintToEdit] = useState(null);
  const [isSprintCreating, setIsSprintCreating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorSprint, setErrorSprint] = useState(null);
  const [editStatus, setEditStatus] = useState(false);


  const [Epics, setEpics] = useState([]);
  const [EpicsData, setEpicsData] = useState([]); 
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [epicToEdit, setEpicToEdit] = useState();
  const [isCreating, setIsCreating] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState('');
  const [selectedEpic, setSelectedEpic] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [epicAction, setEpicAction] = useState('');
  const [error, setError] = useState(null);

 
  const fetchTeamMembers = async (projectId) => {
    try {
      console.log("Fetching Team Members...");
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/scrummaster/projects/${projectId}/teammembers`, {
        headers: {
          Authorization: token
        }
      });
  
      console.log("Team Members Response:", response.data);
  
      const teamMembers = response.data.teamMembers;
  
      const formattedOptions = teamMembers.map(member => ({
        value: member._id,
        label: member.username
      }));
  
      setTMOptions(formattedOptions);
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast.error("Error fetching team members for tasks");
    }
  };
  

useEffect(() => {
    fetchTeamMembers(projectId);
}, []);

  // useEffect(() => {
  //   if (isScrumMaster) {
  //     fetchTeamMembers(projectId);
  //   }
  // }, [isScrumMaster, projectId]);

  const fetchEpics = async () => {
    try {
      console.log("Fetching Epics...");
  
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/${whoIsLoggedIn}/projects/${projectId}/epics`, {
        headers: {
          Authorization: token
        }
      });
  
      if (res.status === 200) {
        if (res.data.epics.length == 0) {
          setError(res.data.message);
          return;
        }
        
        const fetchedEpics = res.data.epics.map((p) => {
          console.log(p);
          return {
            id: p._id,
            title: p.title,
            deadline: new Date(p.deadline).toISOString().slice(0, 10), // ✅ good for <input type="date" />
            priority: p.priority,
            description: p.description,
          };
        });
  
        setEpics(fetchedEpics);
        setEpicsData(fetchedEpics);

        //this will Create epicOptions for <Select />
        const options = res.data.epics.map((p) => ({
          value: p._id,
          label: p.title,
        }));

        setEpicOptions(options);
      }
    } catch (err) {
      console.error("Error fetching Epics data:", err);
      setError("Error fetching Epics data");
      toast.error("Error fetching Epics data");
    }
  };
  
  useEffect(() => {
    if (isProductOwner) {
    fetchEpics();
    }
  }, []);

  const fetchSprints = async () => {
    try {
      console.log("Fetching Sprints...");
  
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/${whoIsLoggedIn}/projects/${projectId}`, {
        headers: {
          Authorization: token
        }
      });
  
      if (res.status === 200) {
        if (res.data.sprints.length == 0) {
          setErrorSprint(res.data.message);
          return;
        }
        
        const fetchedSprints = res.data.sprints.map((p) => {
          console.log("sprints",p);
          return {
            id: p._id,
            title: p.title,
            start: new Date(p.start).toISOString().slice(0, 10), // ✅ good for <input type="date" />
            deadline: new Date(p.deadline).toISOString().slice(0, 10), // ✅ good for <input type="date" />
            priority: p.priority,
            description: p.description,
            status: p.status,
            // owner: p.description,
            // scrumMaster: "SEENU",
            // start: new Date(p.start).toISOString().slice(0, 10), // ✅ good for <input type="date" />
            // from: new Date(p.start).toLocaleDateString("en-US", {
            //   month: "short",
            //   day: "numeric",
            //   year: "numeric",
            // }),
            // to: new Date(p.deadline).toLocaleDateString("en-US", {
            //   month: "short",
            //   day: "numeric",
            //   year: "numeric",
            // }),
            // status: p.status,
            // progress: p.completionPercentage,
            // scrumMasterId: p.scrumMasterId,
            // productOwnerId:p.productOwnerId,
            // teamMembersId: p.teamMembersId,
            // description:p.description
          };
        });
  
        setSprints(fetchedSprints);
        setSprintsData(fetchedSprints);
      }
    } catch (err) {
      console.error("Error fetching Sprints data:", err);
      setErrorSprint("Error fetching Sprints data");
      toast.error("Error fetching Sprints data");
    }
  };
  
  useEffect(() => {
    fetchSprints();
  }, []);

  const fetchUserstories = async () => {
    try {
      console.log("Fetching Userstories...");
  
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/${whoIsLoggedIn}/projects/${projectId}/userstories`, {
        headers: {
          Authorization: token
        }
      });
  
      if (res.status === 200) {
        if (res.data.userStories.length == 0) {
          setUserStoryError(res.data.message);
          return;
        }
        
        const fetchedUserStories = res.data.userStories.map((p) => {
          console.log(p);
          return {
            id: p._id,
            title: p.title,
            description: p.description,
            priority: p.priority,
            deadline: new Date(p.deadline).toISOString().slice(0, 10), // ✅ good for <input type="date" />
            epicId: p.epicId,
          };
        });
  
        setUserStory(fetchedUserStories);
        //setUserStoryData(fetchedUserStories);

        //this will Create epicOptions for <Select />
        const optionsUS = res.data.userStories.map((p) => ({
          value: p._id,
          label: p.title,
        }));

        setUSOptions(optionsUS);
      }
    } catch (err) {
      console.error("Error fetching userStory data:", err);
      setUserStoryError("Error fetching userStory data");
      toast.error("Error fetching userStory data");
    }
  };
  
  useEffect(() => {
    if (isScrumMaster) {
      fetchUserstories();
    }
  }, []);

  const id = projectId;
  const url = isScrumMaster ? `/api/scrummaster/projects/${projectId}/tasks` : `/api/teammember/projects/${id}/tasks`;

  const fetchTasks = async () => {
    try {
      let id = projectId;
      let res;
      console.log("Fetching Tasks...");

      if (isScrumMaster) {
      res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/${whoIsLoggedIn}/projects/${projectId}/tasks`, {
        headers: {
          Authorization: token
        }
      });}
      else{
        res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/${whoIsLoggedIn}/projects/${id}/tasks`, {
          headers: {
            Authorization: token
          }
        });
      }
  
      if (res.status === 200) {
        if (res.data.tasks.length == 0) {
          setTaskError(res.data.message);
          return;
        }
        
        const fetchedTasks = res.data.tasks.map((p) => {
          console.log("Tasks",p);
          return {
            id: p._id,
            title: p.title,
            deadline: new Date(p.deadline).toISOString().slice(0, 10),
            priority: p.priority,
            description: p.description,
            userStoryId: p.userStoryId,
            teamMemberId: p.teamMemberId,
          };
        });
  
        setTask(fetchedTasks);
        //setEpicsData(fetchedEpics);

        //this will Create TaskOptions for <Select />
        // const options = res.data.epics.map((p) => ({
        //   value: p._id,
        //   label: p.title,
        // }));

        //setEpicOptions(options);
      }
    } catch (err) {
      console.error("Error fetching Tasks data:", err);
      setTaskError("Error fetching Tasks data");
      toast.error("Error fetching Tasks data");
    }
  };
  
  useEffect(() => {
    fetchTasks();
  }, []);


  // Filter projects by search text
  useEffect(() => {
    const filtered = sprintsData.filter((p) =>  
      p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSprints(filtered);
  }, [searchTerm]);
  // const filteredSprints = [...Sprints]
  //   .filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()))
  //   .sort((a, b) => {
  //     if (sortOption === 'Sprints') {
  //       return a.title.localeCompare(b.title);
  //     } else if (sortOption === 'Date') {
  //       return new Date(b.start) - new Date(a.start);
  //     }
  //     return 0;
  //   });

  const sortBySprints = () => {
    const sorted = [...Sprints].sort((a, b) => a.title.localeCompare(b.title));
    setSprints(sorted);
  };

  // Sort by start date
  const sortByDate = () => {
    const sorted = [...Sprints].sort(
      (a, b) => new Date(b.start) - new Date(a.start)
    );
    setSprints(sorted);
  };

  const clearSort = () => {
    fetchSprints();
  };

  const handleEditClick = (epic) => {
    setEpicToEdit(epic);
    setEditModalOpen(true);
  };

  const handleSprintEditClick = (sprint) => {
    setSprintToEdit(sprint);
    setIsSprintCreating(false);
    setShowModal(true);
    console.log("clicked edit icon", sprintToEdit);
  };

  const [isLoading, setIsLoading] = useState(false);
  
  const handleSprintEditSave = async() => {
    if (isSprintCreating) {
      console.log("new sprint:", sprintToEdit);
      const formData = {
        //id: Date.now(),
        // id: sprintToEdit.id,
        title: sprintToEdit.title,
        start: sprintToEdit.start,
        deadline: sprintToEdit.deadline,
        // status: "Active",
      };
      setIsLoading(true);
      await createSprint(projectId, formData);
      //setSprints(prev => [...prev, formData]);
      console.log("Sprint created:", formData); //temporary only
      fetchSprints(); // Refresh the sprints list after creation
      setIsLoading(false);
    } else {
      const updatedData = {
        title: sprintToEdit.title,
        start: sprintToEdit.start,
        deadline: sprintToEdit.deadline,
        status: sprintToEdit.status,
      };
      console.log("Updating Sprint:", updatedData);
      setIsLoading(true);
      await editSprint(sprintToEdit.id, updatedData);
      // setSprints(prev =>
      //   prev.map(sprint =>
      //     sprint.id === sprintToEdit.id ? sprintToEdit : sprint
      //   )
      // );
      console.log("Sprint updated:", updatedData);
      setIsLoading(false);

      // setEpics(prev =>
      //   prev.map(epic =>
      //     epic.id === epicToEdit.id ? epicToEdit : epic
      //   )
      // );
    }
    setShowModal(false);
    setIsSprintCreating(false);
  };

  const createSprint = async (projectId, formData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/scrummaster/projects/${projectId}/sprints`,
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      fetchSprints();
      console.log(response.data.message);
      toast.success(response.data.message);
    } catch (error) {
      console.error("Epic creation failed:", error.response?.data?.message || error.message);
      toast.error("Epic creation failed");
    }
  };

  const editSprint = async (sprintId, updatedData) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/${whoIsLoggedIn}/projects/${projectId}/sprints/${sprintId}`,
        updatedData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(response.data.message);
      toast.success(response.data.message);
      fetchSprints();
    } catch (error) {
      console.error("Failed to update sprint:", error.response?.data?.message || error.message);
      toast.error("Failed to update sprint");
    }
  };

  const handleSprintDelete = async(id) => {
    console.log("Deleting sprint with ID:", id);
    toast(
      <ConfirmToast
        message="Are you sure you want to delete this Sprint? This action cannot be undone."
        onConfirm={ async() => {
          try {
           const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/${whoIsLoggedIn}/projects/${id}/sprints`, {
              // data: { sprintId: id },
              headers: {
                Authorization: token
              }
            });

            if (response.status === 200) {
              toast.success(response.data.message);
              fetchSprints();
            }
          } catch (error) {
            console.error("Failed to delete sprint:", error);
            toast.error("Failed to delete sprint");
          }
        }}
      />,
      { autoClose: false }
    );
  };

  const handleEditSave = async() => {
    if (isCreating) {
      console.log("new epic:", epicToEdit);
      const formData = {
        title: epicToEdit.title,
        description: epicToEdit.description,
        priority: epicToEdit.priority,
        deadline: epicToEdit.deadline,
      };
      setIsLoading(true);
      await createEpic(projectId, formData);
      setIsLoading(false);
    } else {
      const updatedData = {
        title: epicToEdit.title,
        description: epicToEdit.description,
        priority: epicToEdit.priority,
        deadline: epicToEdit.deadline,
      };
      console.log("Updating epic:", updatedData);
      setIsLoading(true);
      await editEpic(epicToEdit.id, updatedData);
      setIsLoading(false);

      // setEpics(prev =>
      //   prev.map(epic =>
      //     epic.id === epicToEdit.id ? epicToEdit : epic
      //   )
      // );
    }
    setEditModalOpen(false);
    setIsCreating(false);
  };

  const editEpic = async (epicId, updatedData) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/productowner/projects/${projectId}/epics/${epicId}`,
        updatedData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(response.data.message);
      toast.success(response.data.message);
      fetchEpics(); // Refresh the epics list after editing
    } catch (error) {
      console.error("Failed to update epic:", error.response?.data?.message || error.message);
      toast.error("Failed to update epic");
    }
  };

  const createEpic = async (projectId, formData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/productowner/projects/${projectId}/epics`,
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(response.data.message);
      toast.success(response.data.message);
      fetchEpics(); // Refresh the epics list after creation
      // setEpics(prev => [...prev, epicToEdit]);
    } catch (error) {
      console.error("Epic creation failed:", error.response?.data?.message || error.message);
    }
  };
  

  const handleDelete = async(id) => {
    console.log("Deleting epic with ID:", id);
    toast(
      <ConfirmToast
        message="Are you sure you want to delete this Epic? This action cannot be undone."
        onConfirm={ async() => {
          try {
           const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/productowner/projects/${projectId}/epics`, {
              data: { epicId: id },
              headers: {
                Authorization: token
              }
            });

            if (response.status === 200) {
              toast.success(response.data.message);
              fetchEpics();
            }
          } catch (error) {
            console.error("Failed to delete Epic:", error);
            toast.error("Failed to delete Epic");
          }
          //setProjects(prev => prev.filter(p => p.id !== projectId));
          //toast.success("Project deleted successfully!✅");
        }}
      />,
      { autoClose: false }
    );
  };
  
  const handleEditSaveUserstory = async() => {
    if (isUserStoryCreating) {
      console.log("new Usrstory:", userStoryToEdit, selectedEpicId);
      const formData = {
        //id: Date.now(),
        title: userStoryToEdit.title,
        description: userStoryToEdit.description,
        priority: userStoryToEdit.priority,
        deadline: userStoryToEdit.deadline,
        epicId: selectedEpicId,
      };
      setIsLoading(true);
      await createUserstory(projectId, formData);
      fetchUserstories(); // Refresh the user stories list after creation   
      //setUserStory(prev => [...prev, formData]); //temporary only
      setIsLoading(false);
    } else {
      const updatedData = {
        title: userStoryToEdit.title,
        description: userStoryToEdit.description,
        priority: userStoryToEdit.priority,
        deadline: userStoryToEdit.deadline,
        epicId: selectedEpicId,
      };
      console.log("Updating userstory:", updatedData);
      setIsLoading(true);
      await editUserstory(userStoryToEdit.id, updatedData);
      // setUserStory(prev =>
      //   prev.map(userStory =>
      //     userStory.id === userStoryToEdit.id ? userStoryToEdit : userStory
      //   )
      // );
      fetchUserstories(); // Refresh the user stories list after editing
      setIsLoading(false);

      // setEpics(prev =>
      //   prev.map(epic =>
      //     epic.id === epicToEdit.id ? epicToEdit : epic
      //   )
      // );
    }
    setShowUserStoryModal(false);
    setIsUserStoryCreating(false);
  };

  const createUserstory = async (projectId, formData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/scrummaster/projects/${projectId}/userstories`,
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(response.data.message);
      toast.success(response.data.message);
      fetchEpics(); // Refresh the epics list after creation
      // setEpics(prev => [...prev, epicToEdit]);
    } catch (error) {
      console.error("Userstory creation failed:", error.response?.data?.message || error.message);
      toast.error("Userstory creation failed");
    }
  };

  const handleEditClickUserstory = (userstory) => {
    setUserStoryToEdit(userstory);
    const tempEpic = epicOptions.find(epic => epic.value === userstory.epicId);
    setSelecteddEpic(tempEpic);
    setShowUserStoryModal(true);
  };

  const editUserstory = async (userStoryId, updatedData) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/${whoIsLoggedIn}/projects/${projectId}/userstories/${userStoryId}`,
        updatedData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(response.data.message);
      toast.success(response.data.message);
      fetchUserstories(); // Refresh the user stories list after editing
    } catch (error) {
      console.error("Failed to update userstory:", error.response?.data?.message || error.message);
      toast.error("Failed to update userstory");
    }
  };

  const handleDeleteUserstory = async(id) => {
    console.log("Deleting Userstory with ID:", id);
    toast(
      <ConfirmToast
        message="Are you sure you want to delete this userstory? This action cannot be undone."
        onConfirm={ async() => {
          try {
           const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/${whoIsLoggedIn}/projects/${projectId}/userstories`, {
              data: { userStoryId: id },
              headers: {
                Authorization: token
              }
            });

            if (response.status === 200) {
              toast.success(response.data.message);
              fetchUserstories();
            }
          } catch (error) {
            console.error("Failed to delete userstory:", error);
            toast.error("Failed to delete userstory");
          }
          //setProjects(prev => prev.filter(p => p.id !== projectId));
          //toast.success("Project deleted successfully!✅");
        }}
      />,
      { autoClose: false }
    );
    // setUserStory(prev => prev.filter(p => p.id !== id));
    // toast.success("Userstory deleted successfully! temp only ✅");
  };

  //tasks part
  const handleEditSaveTask = async() => {
    if (isTaskCreating) {
      console.log("new Task:", taskToEdit);
      const formData = {
        //id: Date.now(),
        title: taskToEdit.title,
        description: taskToEdit.description,
        priority: taskToEdit.priority,
        deadline: taskToEdit.deadline,
        userStoryId: selectedUSId,
        teamMemberId: selectedTMId,
      };
      setIsLoading(true);
      await createTask(projectId, formData);
      //setTask(prev => [...prev, formData]); //temporary only
      setIsLoading(false);
    } else {
      const updatedData = {
        title: taskToEdit.title,
        description: taskToEdit.description,
        priority: taskToEdit.priority,
        deadline: taskToEdit.deadline,
        userStoryId: selectedUSId,
        teamMemberId: selectedTMId,
      };
      console.log("Updating Task:", updatedData);
      setIsLoading(true);
      await editTask(taskToEdit.id, updatedData);
      // setTask(prev =>
      //   prev.map(task =>
      //     task.id === taskToEdit.id ? taskToEdit : task
      //   )
      // );
      setIsLoading(false);

      // setEpics(prev =>
      //   prev.map(epic =>
      //     epic.id === epicToEdit.id ? epicToEdit : epic
      //   )
      // );
    }
    setShowTaskModal(false);
    setIsTaskCreating(false);
    toast.success("operation(task) success temp only!✅");
  };

  const createTask = async (projectId, formData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/scrummaster/projects/${projectId}/tasks`,
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      fetchTasks(); 
      setSelectedUS(null);
      setSelectedTM(null);
      console.log(response.data.message);
      toast.success(response.data.message);
    } catch (error) {
      console.error("Epic creation failed:", error.response?.data?.message || error.message);
    }
  };

  const handleEditClickTask = (taskk) => {
    setTaskToEdit(taskk);
    const tempUS = USOptions.find(us => us.value === taskk.userStoryId);
    const tempTM = TMOptions.find(tm => tm.value === taskk.teamMemberId);
    setSelectedUS(tempUS);
    setSelectedTM(tempTM);
    console.log("kkkselectedUS", selectedUS);
    console.log("kkkselectedTM", selectedTM);
    setShowTaskModal(true);
  };

  const editTask = async (taskId, updatedData) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/${whoIsLoggedIn}/projects/${taskId}/tasks/${projectId}`,
        updatedData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(response.data.message);
      toast.success(response.data.message);
      fetchTasks();
    } catch (error) {
      console.error("Failed to update Task:", error.response?.data?.message || error.message);
      toast.error("Failed to update Task");
    }
  };

  const handleDeleteTask = async(id) => {
    console.log("Deleting Task with ID:", id);
    toast(
      <ConfirmToast
        message="Are you sure you want to delete this Task? This action cannot be undone."
        onConfirm={ async() => {
          try {
           const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/${whoIsLoggedIn}/projects/${id}/tasks`, {
              data: { taskId: id },
              headers: {
                Authorization: token
              }
            });

            if (response.status === 200) {
              fetchTasks();
              toast.success(response.data.message);
            }
          } catch (error) {
            console.error("Failed to delete Task:", error);
            toast.error("Failed to delete Task");
          }
        }}
      />,
      { autoClose: false }
    );
  };

  return (
    <div className="p-4 space-y-6">
      {/* Top Search & Sort */}
      <div className='bottom-shadow-nav p-2'>
      <div className="hidden lg:flex lg:items-center gap-4 max-w-5xl">
      {isScrumMaster &&
          <button
          onClick={() => {
            setSprintToEdit({title: "", start: "", deadline: ""}); 
            setIsSprintCreating(true); 
            setSprintAction('Create Sprint'); 
            setShowModal(true)
          }} 
          className="bg-[#a40ff3] hover:bg-white cursor-pointer hover:text-[#a40ff3] text-white px-4 py-2 rounded shadow hover:shadow-md text-sm flex items-center gap-2 w-40"
          >
            <FolderPlus size={18} />
            Create sprint
          </button>
          }
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
          sortType={sortType}
          sortBySprints={sortBySprints}
          sortByDate={sortByDate}
          clearSort={clearSort}
        />
        {/* <SortDropdown
                sortBySprints={sortBySprints}
                sortByDate={sortByDate}
                sortType={sortType}
                clearSort={clearSort}
              /> */}
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
          {isScrumMaster &&
          <button
          onClick={() => {
            setSprintToEdit({title: "", start: "", deadline: ""}); 
            setIsSprintCreating(true); 
            setSprintAction('Create Sprint'); 
            setShowModal(true)}}
            className="bg-[#a40ff3] hover:bg-white cursor-pointer hover:text-[#a40ff3] text-white px-4 py-2 rounded shadow hover:shadow-md text-sm flex items-center gap-2 w-40"
          >
            <FolderPlus size={18} />
            Create sprint
          </button>
          }
          <div className="flex items-center border border-gray-400 rounded-lg px-3 py-2">
            <input
              type="text"
              className="flex-1 outline-none"
              placeholder="Search sprints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* <SortDropdown
            sortType={sortOption}
            sortBySprints={() => setSortOption('Sprints')}
            sortByDate={() => setSortOption('Date')}
            clearSort={clearSort}
          /> */}
          <SortDropdown
          sortType={sortType}
          sortBySprints={sortBySprints}
          sortByDate={sortByDate}
          clearSort={clearSort}
        />
        </div>
      )}
      </div>

      {/* Sprint Cards */}
      <h2 className="text-lg font-semibold mb-2">Sprints</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {errorSprint ? (
          <div className="text-red-500 text-center">{errorSprint}</div>
        ) : Sprints.length > 0 ? (
          <>
            {/* Render your list of Sprints here */}
            {Sprints.map(sprint => (
          <div key={sprint.id} className="relative border-0 bg-white rounded-xl bottom-shadow p-4">
            <h3 className="text-lg font-semibold">{sprint.title}</h3>
            <p className="text-sm text-gray-500">Start: {sprint.start}</p>
            <p className="text-sm text-gray-500">Deadline: {sprint.deadline}</p>
            <span className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${sprint.status === 'Active' ? 'bg-orange-100 text-orange-800' : 'bg-green-200 text-green-700'}`}>
              {sprint.status}
            </span>
            {isScrumMaster && (
              <div className="p-0 m-0 text-sm absolute top-3 right-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <button onClick={() => {setEditStatus(true) ;handleSprintEditClick(sprint); setSprintAction('Edit sprint') }} className="cursor-pointer text-gray-800 hover:text-gray-600">
                    <Pencil size={18} />
                  </button>
                  <div className="h-5 w-px bg-gray-300" />
                  <button onClick={() => handleSprintDelete(sprint.id)} className="text-red-500 cursor-pointer hover:text-red-600">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
          </>
        ) : (
              <div className="flex justify-center items-center h-32">
                <div className="relative w-10 h-10 animate-[spin-dots_1.2s_linear_infinite]">
                  <div className="absolute top-0 left-1/2 w-2 h-2 bg-purple-500 rounded-full transform -translate-x-1/2"></div>
                  <div className="absolute top-1/2 left-0 w-2 h-2 bg-purple-400 rounded-full transform -translate-y-1/2"></div>
                  <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-purple-300 rounded-full transform -translate-x-1/2"></div>
                  <div className="absolute top-1/2 right-0 w-2 h-2 bg-purple-200 rounded-full transform -translate-y-1/2"></div>
                </div>
              </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-100 p-4">
        <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
          <h2 className="text-lg font-semibold mb-4">{sprintAction}</h2>
          <div className="space-y-3">
          <label className="text-md font-medium mb-1">Title</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Title"
              value={sprintToEdit.title}
              onChange={(e) => setSprintToEdit({ ...sprintToEdit, title: e.target.value })}
            />
            {/* <label className="text-md font-medium mb-1">Description</label>
            <textarea
              className="w-full p-2 border rounded-md h-28 resize-none overflow-y-auto mb-0"
              placeholder="Enter epic description..."
              value={epicToEdit.description}
              // onChange={(e) => setEpicToEdit({ ...epicToEdit, description: e.target.value })}
              onChange={(e) => {
                const words = e.target.value.trim().split(/\s+/);
                if (words.length <= 15) {
                  setEpicToEdit({ ...epicToEdit, description: e.target.value });
                }
              }}                
            />
            <p className="text-xs text-gray-500 text-right">
              {epicToEdit.description.trim().split(/\s+/).filter(Boolean).length}/15 words
            </p>

            <label className="text-md font-medium mb-1">Priority</label>
            <select
              className="w-full border rounded px-3 py-2"
              onChange={(e) => setEpicToEdit({ ...epicToEdit, priority: e.target.value })}
              value={epicToEdit.priority}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select> */}
            <label className="text-md font-medium mb-1">Start</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2"
              value={sprintToEdit.start}
              onChange={(e) => setSprintToEdit({ ...sprintToEdit, start: e.target.value })}
            />

            <label className="text-md font-medium mb-1">Deadline</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2"
              value={sprintToEdit.deadline}
              onChange={(e) => setSprintToEdit({ ...sprintToEdit, deadline: e.target.value })}
            />
            {editStatus && (
              <select
                className="w-full border rounded px-3 py-2"
                placeholder="update status"
                onChange={(e) => setSprintToEdit({ ...sprintToEdit, status: e.target.value })}
                value={sprintToEdit.status}
              >
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
            )}
          </div>
          <div className="flex justify-end mt-5 gap-3">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-100"
            onClick={() => {
              setShowModal(false);
              setIsSprintCreating(false);
              setSprintToEdit(null);
            }}>
              Cancel
          </button>

          <button
            className="px-4 py-2 bg-[#a40ff3] text-white rounded hover:bg-purple-500"
            onClick={handleSprintEditSave}
            disabled={isLoading}
          >
          {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5h-3z"
                ></path>
              </svg>
            ) : (
              "Save"
            )}
          </button>
          </div>
        </div>
      </div>
      )}

      {/* Epic Table */}
      {isProductOwner && (
        <h2 className="text-lg font-semibold mt-8 mb-2">Epics</h2>
      )}
      {/* <h2 className="text-lg font-semibold mt-8 mb-2">Epics</h2> */}
      {isProductOwner && (
        <button
        onClick={() => {
          setEpicToEdit({ title: "", description: "", deadline: "", priority: "High", id: Date.now() });
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
      {/* {isProductOwner && ( */}   
      {/* now showing epics too all but actions only to PO. tr = true we defined it first itself. */}
        {isProductOwner && (
        <div className="overflow-x-auto">
        <table className="min-w-full border rounded-xl overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-sm font-medium text-gray-700">S.No</th>
              <th className="p-3 text-left text-sm font-medium text-gray-700">Title</th>
              <th className="p-3 text-left text-sm font-medium text-gray-700">Priority</th>
              <th className="p-3 text-left text-sm font-medium text-gray-700">Deadline</th>
              {isProductOwner && (
                <th className="p-3 text-left text-sm font-medium text-gray-700">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {Epics.length > 0 ? (
              Epics.map((epic, idx) => (
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
              ))
            ): error ? (
              <tr>
                  <td colSpan={4} className="text-center py-4 text-purple-400">
                    {error}
                  </td>
                </tr>
            ) : (
              <tr>
                  <td colSpan={4} className="text-center py-4 text-purple-400">
                    {/* {"Loading..."} */}
                        <div className="flex justify-center items-center h-32">
                          <div className="relative w-10 h-10 animate-[spin-dots_1.2s_linear_infinite]">
                            <div className="absolute top-0 left-1/2 w-2 h-2 bg-purple-500 rounded-full transform -translate-x-1/2"></div>
                            <div className="absolute top-1/2 left-0 w-2 h-2 bg-purple-400 rounded-full transform -translate-y-1/2"></div>
                            <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-purple-300 rounded-full transform -translate-x-1/2"></div>
                            <div className="absolute top-1/2 right-0 w-2 h-2 bg-purple-200 rounded-full transform -translate-y-1/2"></div>
                          </div>
                        </div>
                  </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
      )}


      {/* Modal Popup */}
          {selectedEpic && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-100">
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-100 p-4">
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
                  if (words.length <= 15) {
                    setEpicToEdit({ ...epicToEdit, description: e.target.value });
                  }
                }}                
              />
              <p className="text-xs text-gray-500 text-right">
                {epicToEdit.description.trim().split(/\s+/).filter(Boolean).length}/15 words
              </p>

              <label className="text-md font-medium mb-1">Priority</label>
              <select
                className="w-full border rounded px-3 py-2"
                onChange={(e) => setEpicToEdit({ ...epicToEdit, priority: e.target.value })}
                value={epicToEdit.priority}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
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
              disabled={isLoading}
            >
            {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5h-3z"
                  ></path>
                </svg>
              ) : (
                "Save"
              )}
            </button>
            </div>
          </div>
        </div>
      )}

      {/* Userstory Table */}
      {isScrumMaster && (
        <h2 className="text-lg font-semibold mt-8 mb-2">Userstories</h2>
      )}
      {/* <h2 className="text-lg font-semibold mt-8 mb-2">Userstories</h2> */}
      {isScrumMaster && (
        <button
        onClick={() => {
          setUserStoryToEdit({ title: "", description: "", deadline: "", priority: "High", id: Date.now() });
          setShowUserStoryModal(true);
          setIsUserStoryCreating(true);
          setUserStoryAction('Create Userstory');
        }}
        className="flex items-center gap-2 px-4 py-2 border-0 rounded-lg bg-[#a40ff3] text-white cursor-pointer hover:bg-white hover:text-[#a40ff3] transition-colors duration-200 group hover:border-b-2 border-[#a40ff3]"
      >
        <Plus size={16} className="text-white transition-colors duration-200 group-hover:text-[#a40ff3]" />
        <span className="group-hover:text-purple-500">Create Userstory</span>
      </button>
      )}
      {isScrumMaster && (  
        // if want only render to scrum master then just replace "tr" by  "isScrumMaster"    
        <div className="overflow-x-auto">
        <table className="min-w-full border rounded-xl overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-sm font-medium text-gray-700">S.No</th>
              <th className="p-3 text-left text-sm font-medium text-gray-700">Title</th>
              <th className="p-3 text-left text-sm font-medium text-gray-700">Priority</th>
              <th className="p-3 text-left text-sm font-medium text-gray-700">Deadline</th>
              {isScrumMaster && (
                <th className="p-3 text-left text-sm font-medium text-gray-700">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {userStory.length > 0 ? (
              userStory.map((userstory, idx) => (
                  <tr key={userstory.id} className="border-t">
                    <td className="p-3 text-sm">{idx + 1}</td>
                    <td
                      className="p-3 text-sm text-blue-600 cursor-pointer hover:underline"
                      onClick={() => setSelectedUserStory(userstory)}
                    >
                      {userstory.title}
                    </td>
                    <td className="p-3 text-sm">{userstory.priority}</td>
                    <td className="p-3 text-sm">{userstory.deadline}</td>
                    {isScrumMaster && (
                      <td className="p-3 text-sm">
                        <div className="flex items-center gap-3 text-gray-600">
                          <button onClick={() => {handleEditClickUserstory(userstory); setUserStoryAction('Edit Userstory')}} className="cursor-pointer text-gray-800 hover:text-gray-600">
                            <Pencil size={18} />
                          </button>
                          <div className="h-5 w-px bg-gray-300" />
                          <button onClick={() => handleDeleteUserstory(userstory.id)} className="text-red-500 cursor-pointer hover:text-red-600">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
              ))
            ): error ? (
              <tr>
                  <td colSpan={4} className="text-center py-4 text-purple-400">
                    {error}
                  </td>
                </tr>
            ) : (
              <tr>
                  <td colSpan={4} className="text-center py-4 text-purple-400">
                    {/* {"Loading..."} */}
                        <div className="flex justify-center items-center h-32">
                          <div className="relative w-10 h-10 animate-[spin-dots_1.2s_linear_infinite]">
                            <div className="absolute top-0 left-1/2 w-2 h-2 bg-purple-500 rounded-full transform -translate-x-1/2"></div>
                            <div className="absolute top-1/2 left-0 w-2 h-2 bg-purple-400 rounded-full transform -translate-y-1/2"></div>
                            <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-purple-300 rounded-full transform -translate-x-1/2"></div>
                            <div className="absolute top-1/2 right-0 w-2 h-2 bg-purple-200 rounded-full transform -translate-y-1/2"></div>
                          </div>
                        </div>
                  </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
      )}


      {/* userstory Modal Popup */}
          {selectedUserStory && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-100">
              <div className="bg-white w-[90%] max-w-md p-6 rounded-xl shadow-xl relative">
                <h2 className="text-lg font-bold mb-2">{selectedUserStory.title} - Description</h2>
                <div className="h-[200px] overflow-y-auto text-sm text-gray-700 border p-3 rounded">
                  {selectedUserStory.description}
                </div>
                <button
                  className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
                  onClick={() => setSelectedUserStory(null)}
                >
                  ✕
                </button>
              </div>
            </div>
          )}

      {showUserStoryModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-100 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">{userStoryAction}</h2>
            <div className="space-y-3">
              <label className="text-md font-medium mb-1">Title</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                placeholder="Title"
                value={userStoryToEdit.title}
                onChange={(e) => setUserStoryToEdit({ ...userStoryToEdit, title: e.target.value })}
              />
              <label className="text-md font-medium mb-1">Description</label>
              <textarea
                className="w-full p-2 border rounded-md h-28 resize-none overflow-y-auto mb-0"
                placeholder="Enter epic description..."
                value={userStoryToEdit.description}
                // onChange={(e) => setEpicToEdit({ ...epicToEdit, description: e.target.value })}
                onChange={(e) => {
                  const words = e.target.value.trim().split(/\s+/);
                  if (words.length <= 15) {
                    setUserStoryToEdit({ ...userStoryToEdit, description: e.target.value });
                  }
                }}
              />
              <p className="text-xs text-gray-500 text-right">
                {userStoryToEdit.description.trim().split(/\s+/).filter(Boolean).length}/15 words
              </p>

              <label className="text-md font-medium mb-1">Priority</label>
              <select
                className="w-full border rounded px-3 py-2"
                onChange={(e) => setUserStoryToEdit({ ...userStoryToEdit, priority: e.target.value })}
                value={userStoryToEdit.priority}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <label className="text-md font-medium mb-1">Deadline</label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2"
                value={userStoryToEdit.deadline}
                onChange={(e) => setUserStoryToEdit({ ...userStoryToEdit, deadline: e.target.value })}
              />
              <Select
                options={epicOptions}
                value={selecteddEpic}
                onChange={(selected) => setSelecteddEpic(selected)}
                placeholder="Select an Epic..."
                className="w-full"
                styles={{ menu: (base) => ({ ...base, zIndex: 9999 }) }} // optional fix for modal overlap
              />

            </div>
            <div className="flex justify-end mt-5 gap-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-100"
                onClick={() => {
                  setShowUserStoryModal(false);
                  setIsUserStoryCreating(false);
                  setSelectedUserStory(null);
                }}>
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-[#a40ff3] text-white rounded hover:bg-purple-500"
                onClick={handleEditSaveUserstory}
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5h-3z"
                    ></path>
                  </svg>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* task */}
      {/* {isScrumMaster && (
        <h2 className="text-lg font-semibold mt-8 mb-2">Tasks</h2>
      )} */}
      <h2 className="text-lg font-semibold mt-8 mb-2">Tasks</h2>
      {isScrumMaster && (
        <button
        onClick={() => {
          setTaskToEdit({ title: "", description: "", deadline: "", priority: "High", id: Date.now() });
          setShowTaskModal(true);
          setIsTaskCreating(true);
          setTaskAction('Create Task');
        }}
        className="flex items-center gap-2 px-4 py-2 border-0 rounded-lg bg-[#a40ff3] text-white cursor-pointer hover:bg-white hover:text-[#a40ff3] transition-colors duration-200 group hover:border-b-2 border-[#a40ff3]"
      >
        <Plus size={16} className="text-white transition-colors duration-200 group-hover:text-[#a40ff3]" />
        <span className="group-hover:text-purple-500">Create Task</span>
      </button>
      )}
      {(isScrumMaster || isTeamMember) && (
        // replace tr by isScrumMaster if want to show only to scrum master.
        // if want to show to all then just replace tr by true.
        <div className="overflow-x-auto">
        <table className="min-w-full border rounded-xl overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-sm font-medium text-gray-700">S.No</th>
              <th className="p-3 text-left text-sm font-medium text-gray-700">Title</th>
              <th className="p-3 text-left text-sm font-medium text-gray-700">Priority</th>
              <th className="p-3 text-left text-sm font-medium text-gray-700">Deadline</th>
              {isScrumMaster && (
                <th className="p-3 text-left text-sm font-medium text-gray-700">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {task.length > 0 ? (
              task.map((taskk, idx) => (
                  <tr key={taskk.id} className="border-t">
                    <td className="p-3 text-sm">{idx + 1}</td>
                    <td
                      className="p-3 text-sm text-blue-600 cursor-pointer hover:underline"
                      onClick={() => setSelectedUserStory(taskk)}
                    >
                      {taskk.title}
                    </td>
                    <td className="p-3 text-sm">{taskk.priority}</td>
                    <td className="p-3 text-sm">{taskk.deadline}</td>
                    {isScrumMaster && (
                      <td className="p-3 text-sm">
                        <div className="flex items-center gap-3 text-gray-600">
                          <button onClick={() => {handleEditClickTask(taskk); setTaskAction('Edit Task')}} className="cursor-pointer text-gray-800 hover:text-gray-600">
                            <Pencil size={18} />
                          </button>
                          <div className="h-5 w-px bg-gray-300" />
                          <button onClick={() => handleDeleteTask(taskk.id)} className="text-red-500 cursor-pointer hover:text-red-600">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
              ))
            ): taskError ? (
              <tr>
                  <td colSpan={4} className="text-center py-4 text-purple-400">
                    {taskError}
                  </td>
                </tr>
            ) : (
              <tr>
                  <td colSpan={4} className="text-center py-4 text-purple-400">
                    {/* {"Loading..."} */}
                        <div className="flex justify-center items-center h-32">
                          <div className="relative w-10 h-10 animate-[spin-dots_1.2s_linear_infinite]">
                            <div className="absolute top-0 left-1/2 w-2 h-2 bg-purple-500 rounded-full transform -translate-x-1/2"></div>
                            <div className="absolute top-1/2 left-0 w-2 h-2 bg-purple-400 rounded-full transform -translate-y-1/2"></div>
                            <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-purple-300 rounded-full transform -translate-x-1/2"></div>
                            <div className="absolute top-1/2 right-0 w-2 h-2 bg-purple-200 rounded-full transform -translate-y-1/2"></div>
                          </div>
                        </div>
                  </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
      )}


      {/* task Modal Popup */}
          {selectedTask && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-100">
              <div className="bg-white w-[90%] max-w-md p-6 rounded-xl shadow-xl relative">
                <h2 className="text-lg font-bold mb-2">{selectedTask.title} - Description</h2>
                <div className="h-[200px] overflow-y-auto text-sm text-gray-700 border p-3 rounded">
                  {selectedTask.description}
                </div>
                <button
                  className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
                  onClick={() => setSelectedTask(null)}
                >
                  ✕
                </button>
              </div>
            </div>
          )}

      {showTaskModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-100 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">{taskAction}</h2>
            <div className="space-y-3">
              <label className="text-md font-medium mb-1">Title</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                placeholder="Title"
                value={taskToEdit.title}
                onChange={(e) => setTaskToEdit({ ...taskToEdit, title: e.target.value })}
              />
              <label className="text-md font-medium mb-1">Description</label>
              <textarea
                className="w-full p-2 border rounded-md h-28 resize-none overflow-y-auto mb-0"
                placeholder="Enter epic description..."
                value={taskToEdit.description}
                // onChange={(e) => setEpicToEdit({ ...epicToEdit, description: e.target.value })}
                onChange={(e) => {
                  const words = e.target.value.trim().split(/\s+/);
                  if (words.length <= 15) {
                    setTaskToEdit({ ...taskToEdit, description: e.target.value });
                  }
                }}
              />
              <p className="text-xs text-gray-500 text-right">
                {taskToEdit.description.trim().split(/\s+/).filter(Boolean).length}/15 words
              </p>

              <label className="text-md font-medium mb-1">Priority</label>
              <select
                className="block w-[50%] border rounded px-3 py-2"
                onChange={(e) => setTaskToEdit({ ...taskToEdit, priority: e.target.value })}
                value={taskToEdit.priority}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <label className="text-md font-medium mb-1">Deadline</label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2"
                value={taskToEdit.deadline}
                onChange={(e) => setTaskToEdit({ ...taskToEdit, deadline: e.target.value })}
              />

              <Select
                options={USOptions}
                value={selectedUS}
                onChange={(selected) => setSelectedUS(selected)}
                placeholder="Select an Userstory..."
                className="w-full"
                styles={{ menu: (base) => ({ ...base, zIndex: 9999 }) }}
              />

              <Select
                options={TMOptions}
                value={selectedTM}
                onChange={(selected) => setSelectedTM(selected)}
                placeholder="Select a Team member..."
                className="w-full"
                styles={{ menu: (base) => ({ ...base, zIndex: 9999 }) }}
              />
            </div>
            <div className="flex justify-end mt-5 gap-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-100"
                onClick={() => {
                  setShowTaskModal(false);
                  setIsTaskCreating(false);
                  setSelectedTM(null);
                  setSelectedUS(null);
                }}>
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-[#a40ff3] text-white rounded hover:bg-purple-500"
                onClick={handleEditSaveTask}
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5h-3z"
                    ></path>
                  </svg>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
    
  );
};

export default ProjectDetails;

function SortDropdown({ sortType, sortBySprints, sortByDate, clearSort }) {
  const [clear, setClear] = useState(false);
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
                  setClear(true);
                  sortBySprints();
                  setOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#a40ff3] hover:text-white"
              >
                Sprints
              </button>
              <button
                onClick={() => {
                  setClear(true);
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

      {clear && (
        <button
          onClick={() => {
            clearSort();
            setClear(false);
            setOpen(false);
          }}
          className="bg-red-500 hover:bg-red-600 text-white w-30 px-3 py-2 rounded text-sm flex items-center gap-1 shadow"
        >
          <X size={16} />
          Clear Sort
        </button>
      )}
    </div>
  );
}
