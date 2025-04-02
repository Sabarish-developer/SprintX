import { useState } from "react";
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

const Home = () => {
    const initialColumns = ["To Do", "In Progress", "Testing", "Completed", "Need Review"];
    const [columns, setColumns] = useState(initialColumns); 

   
    const [tasks, setTasks] = useState([
        { id: "1", title: "Design Homepage", dueDate: "April 12", columnId: "To Do" },
        { id: "2", title: "Fix Login Bug", dueDate: "April 15", columnId: "In Progress" },
        { id: "3", title: "Write Tests", dueDate: "April 18", columnId: "Testing" },
        { id: "4", title: "Deploy App", dueDate: "April 20", columnId: "Completed" },
        { id: "5", title: "Code Review", dueDate: "April 22", columnId: "Need Review" },
        { id: "6", title: "Setup CI/CD", dueDate: "April 12", columnId: "To Do" },
        { id: "7", title: "User Authentication", dueDate: "April 12", columnId: "To Do" },
        { id: "8", title: "Database Schema", dueDate: "April 12", columnId: "To Do" },
    ]);

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
        
    }


    
    function onDragEnd(event) {
        //setActiveColumn(null);
        setActiveTask(null); // Clear the active task after drop
        const { active, over } = event;

       
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
            });
        }
    
        const isOverAColumn = over.data.current && over.data.current.type === "Column";
    
        // Dropping a task over a column
        if (isActiveATask && isOverAColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                // Uncomment if columnId change condition is required:
                // if (tasks[activeIndex].columnId !== overId) {
                tasks[activeIndex].columnId = overId;
                // }
    
                
                return arrayMove(tasks, activeIndex, activeIndex);
            });
        }
    }
    


    return (
     
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
        >
            
            <div className="overflow-x-auto w-screen h-screen">
                <div className="min-w-[900px] md:min-w-full">
                   
                    <div className="grid grid-cols-5 border-b border-gray-300 bg-purple-300 sticky top-0 z-10">
                        {columns.map((columnId) => ( 
                            <div key={columnId} className="p-3 text-center font-bold border-r border-gray-300 last:border-r-0">
               
                                {columnId} ({tasks.filter((task) => task.columnId === columnId).length})
                            </div>
                        ))}
                    </div>

                    {/* Task Columns Grid */}
                    <div className="grid grid-cols-5 h-full">
                        {/* REMOVED the single SortableContext wrapper */}
                        {columns.map((columnId) => (
                            <ColumnContainer
                                key={columnId}
                                columnId={columnId} // Pass the name/ID (e.g., "To Do")
                                tasks={tasks}      // Pass the entire tasks list
                            />
                        ))}
                    </div>
                </div>
            </div>

            <DragOverlay>
                {activeTask ? (
                    <TaskCard task={activeTask} /> // Render the captured task
                ) : null}
            </DragOverlay>

        </DndContext>
    );
};

export default Home;