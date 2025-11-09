import React from 'react'
import PantryItem from './PantryItem'

const PantryList = ({Items}) => {
 if(!Items || Items.length===0){
  return <p className="empty-pantry-message">Your pantry is empty. Add some items to get started!</p>;
 }

  return (
    <div className='pantry-list'>
      {
         Items.map((Item)=>
             <PantryItem key={Item.id} Item={Item}/>
         )
      }
    </div>
  )
}

export default PantryList