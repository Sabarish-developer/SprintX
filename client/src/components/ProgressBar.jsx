import React from 'react'

const ProgressBar = ({progress}) => {
  return (
    progress > 0 && (
    <div className="fixed top-0 left-0 w-full h-1 z-50 bg-purple-500" style={{ width: `${progress}%` }} />
    )
  );
}

export default ProgressBar