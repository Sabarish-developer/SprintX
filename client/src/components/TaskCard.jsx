// TaskCard.jsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const TaskCard = ({ task, status }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging // Useful for styling while dragging
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task: task, // Pass the whole task object
    },
  });

  const getBorderColor = (status) => {
    if (status === "To Do") return "red";
    if (status === "In Progress") return "orange";
    if (status === "Testing") return "blue";
    if (status === "Completed") return "green";
    if (status === "Need Review") return "yellow";
    return "gray"; 
  };
  
  const getBackgroundColor = (status) => {
    if (status === "To Do") return "#fef2f2";
    if (status === "In Progress") return "#fff7ed"; 
    if (status === "Testing") return "#eff6ff"; 
    if (status === "Completed") return "##ecfdf5"; 
    if (status === "Need Review") return "#fefce8"; 
    return "#f3f4f6"; 
  };
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1, 
    borderTop: `8px solid ${getBorderColor(status)}`,
    backgroundColor: getBackgroundColor(status),
    padding: '8px',
    marginBottom: '8px',
    borderRadius: '4px',
    cursor: 'grab'
  };
  

  return (
    <div
    className={`p-2 rounded shadow bg-white touch-none ${task.title === 'Hide' ? 'invisible' : ''}`}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <p className="font-medium">{task.title}</p>
      <p className="text-sm text-gray-500">{task.dueDate}</p>
    </div>
  );
};

export default TaskCard;