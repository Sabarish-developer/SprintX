import { useEffect, useState } from "react";
import {
    DndContext,
    closestCenter,
    DragOverlay, 
    PointerSensor, 
    useSensor,
    useSensors,
    closestCorners
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import ColumnContainer from "./ColumnContainer";
import TaskCard from "./TaskCard"; 
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const Tasks = () => {
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
    
      //const tr = true;
        
        const isProductOwner = user?.role === "Product owner";
        const isScrumMaster = user?.role === "Scrum master";
        const isTeamMember = user?.role === "Team member";
        const { projectId, sprintId } = useParams();
        const navigate = useNavigate();
        console.log("Project ID:", projectId);
        console.log("Sprint ID:", sprintId);
        console.log("User Role:", user?.role);
        const token = localStorage.getItem("token");
        const [isLoading, setIsLoading] = useState(true);

        const [tasks, setTasks] = useState([
        { id: "14", title: "Hide", dueDate: "April 12", columnId: "Todo" },
        { id: "15", title: "Hide", dueDate: "April 15", columnId: "In Progress" },
        { id: "16", title: "Hide", dueDate: "April 18", columnId: "Testing" },
        { id: "17", title: "Hide", dueDate: "April 20", columnId: "Completed" },
        { id: "18", title: "Hide", dueDate: "April 22", columnId: "Need Review" },
    ]);

    const staticData = [
        { id: "14", title: "Hide", dueDate: "April 12", columnId: "Todo" },
        { id: "15", title: "Hide", dueDate: "April 15", columnId: "In Progress" },
        { id: "16", title: "Hide", dueDate: "April 18", columnId: "Testing" },
        { id: "17", title: "Hide", dueDate: "April 20", columnId: "Completed" },
        { id: "18", title: "Hide", dueDate: "April 22", columnId: "Need Review" },
    ];


        const fetchTasks = async () => {
            console.log("Fetching tasks...");
            let id = projectId;
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/${whoIsLoggedIn}/projects/${id}/sprints/${sprintId}`, {
                    headers: {
                        Authorization: token
                    }
                });
        
                console.log('Fetched Tasks:', response.data);
                const taskdata = response.data.assignedTasks.map((task) => ({
                    id: task._id,
                    title: task.title,
                    dueDate: new Date(task.deadline).toLocaleDateString("en-US"),
                    columnId: task.status,
                }));
                setTasks([...taskdata, ...tasks]); // Append the fetched tasks to the existing tasks
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        useEffect(() => {
            fetchTasks();
        }, []);

        const updateTasks = async(taskId, status) => {
            setIsLoading(true);
            setTasks(staticData);
            console.log("Updating task status...:", taskId, status);
            let id = projectId;
            try {
                const response = await axios.patch(`${import.meta.env.VITE_BASE_URL}/api/${whoIsLoggedIn}/projects/${id}/tasks/${taskId}`, {
                    status: status
                }, {
                    headers: {
                        Authorization: token
                    }
                });
                console.log('Updated Task:', response.data);
                window.location.reload();
                toast.success(response.data.message);
            } catch (error) {
                toast.error(response.data.message || "Error updating task");
                console.error('Error updating task:', error);
            }
        }


    const initialColumns = ["Todo", "In Progress", "Testing", "Completed", "Need Review"];
    const [columns, setColumns] = useState(initialColumns); 

    const getTextColor = (columnId) => {
        switch (columnId) {
            case "Todo":
                return "text-[#2E67F8]";
            case "In Progress":
                return "text-orange-400";
            case "Testing":
                return "text-[#555555]";
            case "Completed":
                return "text-[#00b300]";
            case "Need Review":
                return "text-[#EB212E]";
            default:
                return "text-gray-500"; 
        }
    }

    const [activeTask, setActiveTask] = useState(null);

   
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3, 
            },
        })
    );

 
    function onDragStart(event) {
        
        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task);
        }
        console.log("Drag started", event.active.data.current?.task);
        console.log("Active task:", activeTask);
    }


    
    function onDragEnd(event) {
        //setActiveColumn(null);
        setActiveTask(null); // Clear the active task after drop
        const { active, over } = event;
        console.log("updated columnId:", active.data.current?.columnId);
        console.log("Drag ended", event);
        console.log("over", over);
        console.log("active", active); //mukkiyam
        let taskId = active.id;
        //active.data.current.task.columnId
        let status = active.data.current.task.columnId;
        console.log("taskId:", taskId);
        console.log("status:", status);
        updateTasks(taskId, status); // Update the task status in the backend
        return;

       
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

       
        if (activeId === overId) return;

        
        const isActiveATask = active.data.current?.type === "Task";
        

        if (!isActiveATask) return; 

        const isOverATask = over.data.current?.type === "Task";
        const isOverAColumn = over.data.current?.type === "Column";

      
        if (isActiveATask && isOverATask) {
            setTasks((currentTasks) => {
                const activeIndex = currentTasks.findIndex((t) => t.id === activeId);
                const overIndex = currentTasks.findIndex((t) => t.id === overId);

                // Check if tasks were found
                if (activeIndex === -1 || overIndex === -1) {
                    console.error("Task not found in onDragEnd (Task over Task)");
                    return currentTasks; // Return current state if tasks aren't found
                }

                // Get the columnId of the task being dropped onto
                const overTaskColumnId = currentTasks[overIndex].columnId;

                if (currentTasks[activeIndex].columnId !== overTaskColumnId) {
                   currentTasks[activeIndex].columnId = overTaskColumnId;
                
                   return arrayMove(currentTasks, activeIndex, overIndex);
                } else {
                    // If in the same column, just reorder
                    return arrayMove(currentTasks, activeIndex, overIndex);
                }

            });
        }

      
        if (isActiveATask && isOverAColumn) {
             setTasks((currentTasks) => {
                const activeIndex = currentTasks.findIndex((t) => t.id === activeId);

                if (activeIndex === -1) {
                     console.error("Task not found in onDragEnd (Task over Column)");
                     return currentTasks; // Return current state if task isn't found
                }

                currentTasks[activeIndex].columnId = overId;

                
                return arrayMove(currentTasks, activeIndex, activeIndex);
            });
        }
    }

    function onDragOver(DragOverEvent) {
        console.log("onDragOver", DragOverEvent);
        const { active, over } = DragOverEvent;
    
  
        if (!over) return;
    
        const activeId = active.id;
        const overId = over.id;
    
       
        if (activeId === overId) return;
    
        const isActiveATask = active.data.current && active.data.current.type === "Task";
        const isOverATask = over.data.current && over.data.current.type === "Task";
    
        if (!isActiveATask) return;
    
        
        if (isActiveATask && isOverATask) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const overIndex = tasks.findIndex((t) => t.id === overId);
    
                
                // if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
                tasks[activeIndex].columnId = tasks[overIndex].columnId;
                // }
    
                return arrayMove(tasks, activeIndex, overIndex);
                //return;
            });
        }
    
        const isOverAColumn = over.data.current && over.data.current.type === "Column";
    
        // Dropping a task over a column
        // if (isActiveATask && isOverAColumn) {
        //     setTasks((tasks) => {
        //         const activeIndex = tasks.findIndex((t) => t.id === activeId);
        //         // Uncomment if columnId change condition is required:
        //         // if (tasks[activeIndex].columnId !== overId) {
        //         tasks[activeIndex].columnId = overId;
        //         // }
    
                
        //         return arrayMove(tasks, activeIndex, activeIndex);
        //     });
        // }
    }
    


    return (
        !isLoading ? (
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDragOver={onDragOver}
            >
                <div className="overflow-x-auto w-screen lg:w-auto h-screen">
                    <div className="min-w-[900px] md:min-w-full">
                        <div className="grid grid-cols-5 sticky top-0 z-10">
                            {columns.map((columnId) => (
                                <div key={columnId} className={`p-3 ${getTextColor(columnId)} bg-white font-semibold ${columnId === 'Need Review' ? '' : 'border-r'} border-b border-black flex justify-between`}>
                                    <span>{columnId}</span>
                                    {/* <span>({tasks.filter((task) => task.columnId === columnId).length - 1})</span> */}
                                    <span>({Array.isArray(tasks) ? tasks.filter((task) => task?.columnId === columnId).length - 1 : 0})</span>
                                </div>
                            ))}
                        </div>

                        {/* Task Columns Grid */}
                        <div className="grid grid-cols-5 h-full">
                            {columns.map((columnId) => (
                                <ColumnContainer
                                    key={columnId}
                                    columnId={columnId}
                                    tasks={tasks}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <DragOverlay>
                    {activeTask && <TaskCard task={activeTask} />}
                </DragOverlay>
            </DndContext>
        ) : (
            <div className="flex items-center justify-center h-screen">
                <svg
                    className="animate-spin h-10 w-10 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                >
                    <path
                        fill="currentColor"
                        d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8.009,8.009,0,0,1,12,20Z"
                    />
                </svg>
            </div>
        )
    );

};

export default Tasks;