import React, { useState } from 'react'
import { FaPlus, FaUpload } from "react-icons/fa";
const PantryToolbar = ({
  onAddItemClick,
  onUploadItemClick,
  onSearchChange,
  onFilterChange,
  onSortChange
}) => {
  const categories = ['All', 'Fruit', 'Vegetable', 'Dairy', 'Meat', 'Other'];
 /// We Passing all this data to DashBoard we will Handle all this passed Function There
  return (
    <div className='pantry-toolbar'>
      <div className="toolbar-actions">
        <button className="btn-add-item" onClick={onAddItemClick}><FaPlus size={24} /> <span>Add Item</span></button>
        <button className="btn-upload-item" onClick={onUploadItemClick}><FaUpload size={24} /> <span>Upload Item</span></button>
      </div>
      <div className="toolbar-filters">
        <input type="search"
          placeholder="Search pantry..."
          onChange={(e) => {
            onSearchChange(e.target.value)
          }}
          className='toolbar-search'
        />
        <select id="filter-category" className='toolbar-select' onChange={(e) => {
          onFilterChange(e.target.value)
        }} >
          {categories.map((cat) => 
            <option key={cat} value={cat}>{cat}</option>
          )}
        </select>
        <select id="sort-by" className='toolbar-select' onChange={(e) => {
          onSortChange(e.target.value)
        }}>
           <option value="name-asc">Sort: Name (A-Z)</option>
           <option value="name-desc">Sort: Name (Z-A)</option>
           <option value="expiry-asc">Sort: Expiry (Soonest)</option>
           
        </select>
      </div>
    </div>


  )
}

export default PantryToolbar