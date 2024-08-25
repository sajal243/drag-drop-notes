import React, { forwardRef } from 'react'

const Note = forwardRef(({initPos, content, ...props}, ref) => {
  return (
    <div className='note' 
      ref={ref} 
      style={{position: "absolute", left:`${initPos?.x}px` , top: `${initPos?.y}px`, backgroundColor: 'yellow', alignContent: 'center', padding: '20px', cursor: 'move' }}
      {...props}
    >
        {content}
    </div>
  )
})

export default Note