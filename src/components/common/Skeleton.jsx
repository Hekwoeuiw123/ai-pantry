import React from 'react'
import './Skeleton.css'
const Skeleton = ({height ,width ,radius}) => {
  return (
    <div className='skeleton'
    style={{
      height : height || "200px",
      width : width || "200px",
      borderRadius : radius || "7px"
    }}
    >
    </div>
  )
}

export default Skeleton