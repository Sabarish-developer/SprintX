import { useState } from "react";
// Import necessary dnd-kit components/hooks
import {
    DndContext,
    closestCenter,
    DragOverlay, // For visual feedback during drag
    PointerSensor, // Sensor for pointer devices
    useSensor,
    useSensors,
    closestCorners
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import ColumnContainer from "./ColumnContainer";
import TaskCard from "./TaskCard"; // Import TaskCard for DragOverlay

const Home = () => {
    const initialColumns = ["To Do", "In Progress", "Testing", "Completed", "Need Review"];
    const [columns, setColumns] = useState(initialColumns); // Keep column names/IDs

    // --- State Modification: Use columnId matching column names ---
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

    // State to hold the task being dragged (for the overlay)
    const [activeTask, setActiveTask] = useState(null);

    // --- Sensor Setup (improves drag detection) ---
    const sensors = useSensors(
        useSensor(PointerSensor, {
            // Don't activate drag immediately, require a slight movement
            activationConstraint: {
                distance: 3, // 3px movement needed
            },
        })
    );

    // --- onDragStart: Capture the task being dragged ---
    function onDragStart(event) {
        // Check if the active item has the expected data structure
        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task);
        }
        // Could add logic here if columns were draggable too
    }


    // --- onDragEnd: Handle drop logic ---
    function onDragEnd(event) {
        //setActiveColumn(null);
        setActiveTask(null); // Clear the active task after drop
        const { active, over } = event;

        // If dropped outside any droppable area, do nothing
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        // Don't do anything if dropped onto itself
        if (activeId === overId) return;

        // --- Check types using the 'data' property ---
        const isActiveATask = active.data.current?.type === "Task";
        // No need to check for active column drag yet

        if (!isActiveATask) return; // Only handle dragging Tasks for now

        const isOverATask = over.data.current?.type === "Task";
        const isOverAColumn = over.data.current?.type === "Column";

        // --- Scenario 1: Dropping a Task over another Task ---
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

                // If the columns are different, update the dragged task's columnId
                if (currentTasks[activeIndex].columnId !== overTaskColumnId) {
                   currentTasks[activeIndex].columnId = overTaskColumnId;
                   // Reorder using arrayMove AFTER potentially changing columnId
                   // arrayMove naturally handles the index shift caused by potential column change implicitly here
                   // because we modify the array in place before passing to arrayMove
                   return arrayMove(currentTasks, activeIndex, overIndex);
                } else {
                    // If in the same column, just reorder
                    return arrayMove(currentTasks, activeIndex, overIndex);
                }

            });
        }

        // --- Scenario 2: Dropping a Task over a Column ---
        if (isActiveATask && isOverAColumn) {
             setTasks((currentTasks) => {
                const activeIndex = currentTasks.findIndex((t) => t.id === activeId);

                if (activeIndex === -1) {
                     console.error("Task not found in onDragEnd (Task over Column)");
                     return currentTasks; // Return current state if task isn't found
                }

                // Update the task's columnId to the ID of the column it was dropped onto (overId is the columnId)
                currentTasks[activeIndex].columnId = overId;

                // Trigger a state update. arrayMove helps ensure React detects the change.
                // The task will visually move columns on re-render because ColumnContainer filters by the updated columnId.
                // Using activeIndex for both doesn't change order but forces update.
                return arrayMove(currentTasks, activeIndex, activeIndex);
            });
        }
    }

    function onDragOver(DragOverEvent) {
        const { active, over } = DragOverEvent;
    
        // If dropped outside any droppable area, do nothing
        if (!over) return;
    
        const activeId = active.id;
        const overId = over.id;
    
        // Don't do anything if dropped onto itself
        if (activeId === overId) return;
    
        const isActiveATask = active.data.current && active.data.current.type === "Task";
        const isOverATask = over.data.current && over.data.current.type === "Task";
    
        if (!isActiveATask) return;
    
        // Dropping a task over another task
        if (isActiveATask && isOverATask) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const overIndex = tasks.findIndex((t) => t.id === overId);
    
                // Uncomment if columnId change condition is required:
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
    
                // No movement in array, only columnId change
                return arrayMove(tasks, activeIndex, activeIndex);
            });
        }
    }
    


    return (
        // Use the configured sensors and add onDragStart handler
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
        >
            {/* Your existing layout wrapper */}
            <div className="overflow-x-auto w-screen h-screen">
                <div className="min-w-[900px] md:min-w-full">
                    {/* Column Headers - Uses 'columns' state */}
                    <div className="grid grid-cols-5 border-b border-gray-300 bg-purple-300 sticky top-0 z-10">
                        {columns.map((columnId) => ( // Now iterating over column IDs/names
                            <div key={columnId} className="p-3 text-center font-bold border-r border-gray-300 last:border-r-0">
                                {/* Display column name and count tasks based on updated columnId */}
                                {columnId} ({tasks.filter((task) => task.columnId === columnId).length})
                            </div>
                        ))}
                    </div>

                    {/* Task Columns Grid */}
                    <div className="grid grid-cols-5 h-full">
                        {/* REMOVED the single SortableContext wrapper */}
                        {columns.map((columnId) => (
                            // Pass the columnId and the full tasks array to each container
                            // ColumnContainer now handles filtering and its own SortableContext
                            <ColumnContainer
                                key={columnId}
                                columnId={columnId} // Pass the name/ID (e.g., "To Do")
                                tasks={tasks}      // Pass the entire tasks list
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Drag Overlay: Renders a copy of the task being dragged */}
            <DragOverlay>
                {activeTask ? (
                    <TaskCard task={activeTask} /> // Render the captured task
                ) : null}
            </DragOverlay>

        </DndContext>
    );
};

export default Home;