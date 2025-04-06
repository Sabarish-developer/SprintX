// ColumnContainer.jsx
import React from 'react';
import { SortableContext } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';


const ColumnContainer = ({ columnId, tasks }) => {

  const tasksInColumn = tasks.filter(task => task.columnId === columnId);

  const taskIds = tasksInColumn.map(task => task.id);

  
  const { setNodeRef } = useDroppable({
    id: columnId, 
    data: {
      type: 'Column',
    }
  });

  return (
   
    <div
      ref={setNodeRef} 
      className="p-3 border-r border-black last:border-r-0 h-screen flex flex-col"
      style={{ minHeight: '150px' }} 
    >
      <SortableContext items={taskIds}>
           <div className="flex flex-col gap-2 flex-grow">
               {tasksInColumn.length > 0 ? (
                   tasksInColumn.map((task) => (
                      <TaskCard key={task.id} task={task} status={task.columnId} />
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