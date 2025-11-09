import React, { useEffect, useState } from 'react'
import { usePantry } from '../../context/pantryContext'
import { deletePantryItem, updatePantryItem } from '../../services/pantryService';
import { toast } from 'react-toastify';
import { InfinitySpin } from 'react-loader-spinner';
import { Modal } from '../../components/common/Modal'
import getExpiryStatus from '../../utils/dateUtils'
import '../../styles/pantryForm.css'
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString + 'T00:00:00').toLocaleDateString();
};
const PantryItem = ({ Item }) => {
  const { loading } = usePantry()
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formEditData, setFormEditData] = useState({ ...Item })

  const status = getExpiryStatus(Item.expirationDate) // safe ,  expiring_soon ,  expired
  const statusClassName = `pantry-item--${status}`

  const categories = ['Fruit', 'Vegetable', 'Dairy', 'Meat', 'Other'];

  // useEffect(()=>{
  //     console.log("inside PantryItem :- " , Item);
      
  // },[])

  const handleDeleteButton = async () => {

    try {
      if (confirm("Are You Sure To Delete This Item ?")) {
        setIsDeleting(true)
        await deletePantryItem(Item.id)
        toast.done(`Item ${Item.name} is Deleted`)
        setIsDeleting(false)
      }
    } catch (error) {
      toast.error(`Deleting Process of Item ${Item.name} got Error`)
      setIsDeleting(true)
    }
  }
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsEditing(true)
      const updatedData = {
        name: formEditData.name,
        category: formEditData.category,
        quantity: Number(formEditData.quantity),
        expirationDate: formEditData.expirationDate
      }
      await updatePantryItem(formEditData.id, updatedData)
      setIsEditing(false)
      toast.success(`Edited Successfully `)
    } catch (error) {
      toast.error("You Got error in Edit", error)
      setIsEditing(false)
    }

  }
  const handleEditFormChange = (e) => {
    setFormEditData({ ...Item, [e.target.name]: e.target.value })
  }
  if (isDeleting) {
    return <div className='item-card item-card--deleting'>
      <InfinitySpin height="30" width="30" />
    </div>
  }

  return (<>
    <div className={`item-card ${statusClassName}`}>
      <div className="item-header">
        <span className="item-category">{Item.category}</span>
        <span className="item-quantity">{Item.quantity}</span>
      </div>
      <h3 className="item-name">{Item.name}</h3>
      <p className="item-expire-date">Expires : {formatDate(Item.expirationDate)}</p>
      <div className="item-actions">
        <button onClick={() => setIsEditing(true)} className="btn-edit">Edit</button>
        <button onClick={handleDeleteButton} className="btn-delete">Delete</button>
      </div>
    </div>
    {
      isEditing && <Modal onClose={() => setIsEditing(false)}>
        <form className='pantry-edit-form' onSubmit={handleEditSubmit}>
          <h2>Edit Pantry Item</h2>
          <label>Item Name</label>
          <input
            type="text"
            placeholder="Item Name"
            value={formEditData.name}
            name='name'
            onChange={handleEditFormChange}
            required
          />
          <label>Quantity</label>
          <input
            type="number"
            placeholder="Quantity"
            value={formEditData.quantity}
            name='quantity'
            onChange={handleEditFormChange}
            min="1"
            required
          />
          <label>Category</label>
          <select value={formEditData.category} name='category' onChange={handleEditFormChange}>
            {
              categories.map((cate) => (<option key={cate} value={cate} >{cate}</option>))
            }
          </select>
          <label>Expiry Date</label>
          <input
            type="date"
            value={formEditData.expirationDate}
            name='expirationDate'
            onChange={handleEditFormChange}
          />
          <button type="submit"  className="form-edit-btn">
            { 'Save Changes'}
          </button>
        </form>
      </Modal>
    }
  </>
  )
}

export default PantryItem