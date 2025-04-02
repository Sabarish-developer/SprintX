// ColumnContainer.jsx
import React from 'react';
import { SortableContext } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard'; // Import TaskCard

// Accept columnId (e.g., "To Do") and the full tasks array
const ColumnContainer = ({ columnId, tasks }) => {
  // Filter tasks for this specific column
  const tasksInColumn = tasks.filter(task => task.columnId === columnId);
  // Get IDs of tasks in this column for SortableContext
  const taskIds = tasksInColumn.map(task => task.id);

  // Make the column itself a droppable area
  const { setNodeRef } = useDroppable({
    id: columnId, // Use the column name/ID as the droppable ID
    data: {
      type: 'Column', // Identify this droppable as a Column
    }
  });

  return (
    // This outer div is the droppable area for the column
    <div
      ref={setNodeRef} // Assign the ref from useDroppable
      // Add your existing column container Tailwind classes here
      className="bg-gray-100 p-3 border-r border-gray-300 last:border-r-0 h-full flex flex-col"
      style={{ minHeight: '150px' }} // Ensure columns have height to be dropped onto
    >
      {/* Provide SortableContext for tasks WITHIN this column */}
      <SortableContext items={taskIds}>
           {/* Container for the tasks */}
           <div className="flex flex-col gap-2 flex-grow"> {/* Use flex-grow if needed */}
               {tasksInColumn.length > 0 ? (
                   tasksInColumn.map((task) => (
                      <TaskCard key={task.id} task={task} />
                   ))
               ) : (
                   <div className="text-center text-gray-500 py-4">Drop tasks here</div>
               )}
           </div>
      </SortableContext>
    </div>
  );
};

export default ColumnContainer;