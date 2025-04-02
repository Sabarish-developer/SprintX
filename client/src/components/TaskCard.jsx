// TaskCard.jsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const TaskCard = ({ task }) => {
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1, 
    border: '1px solid #ccc',
    padding: '8px',
    marginBottom: '8px',
    backgroundColor: '#ffffff',
    borderRadius: '4px',
    cursor: 'grab'
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-2 rounded shadow bg-white touch-none"
    >
      <p className="font-medium">{task.title}</p>
      <p className="text-sm text-gray-500">{task.dueDate}</p>
    </div>
  );
};

export default TaskCard;