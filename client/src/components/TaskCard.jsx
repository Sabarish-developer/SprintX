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
    if (status === "To Do") return "#fee2e2";
    if (status === "In Progress") return "#ffedd5"; 
    if (status === "Testing") return "#dbeafe"; 
    if (status === "Completed") return "#d1fae5"; 
    if (status === "Need Review") return "#fef9c3"; 
    return "#f3f4f6"; 
  };
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1, 
    borderTop: `12px solid ${getBorderColor(status)}`,
    backgroundColor: getBackgroundColor(status), // ✅ Set dynamic background color
    padding: '8px',
    marginBottom: '8px',
    borderRadius: '4px',
    cursor: 'grab'
  };
  

  return (
    <div
      className="p-2 rounded shadow bg-white touch-none"
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