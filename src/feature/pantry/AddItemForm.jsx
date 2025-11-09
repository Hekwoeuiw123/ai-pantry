import React, { useState } from 'react'
import { useAuthData } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { InfinitySpin } from 'react-loader-spinner';
import { addPantryItem } from '../../services/pantryService';
import '../../styles/pantryForm.css'
const AddItemForm = ({ onSuccess }) => {
    const [name, setName] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [category, setCategory] = useState('')
    const [expirationDate, setExpirationDate] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const { currentUser } = useAuthData()

    const categories = ['Fruit', 'Vegetable', 'Dairy', 'Meat', 'Other'];

    // so Basically ye form modal ke andar jayega so jo ki addbutton  click pe open hoga
    // modal onclose prop leta hai jo cloase krdeta hai modal ko 
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setError(null)
            setLoading(true)
            const newItem = {
                name,
                quantity: Number(quantity),
                category,
                expirationDate,
                userID: currentUser.uid
            }
            //  console.log(newItem);
            
            await addPantryItem(newItem);
            setCategory("Other")
            setName("")
            setQuantity(1)
            setExpirationDate("")
            toast.success("Item added to Pantry")
            if (onSuccess) {
                onSuccess()
            }
        } catch (error) {
            setError("Got Error in adding item")
            toast.error("Error adding item: ", error)
        } finally {
            setLoading(false)
        }
    }
    return (
        <form onSubmit={handleSubmit} className='pantry-form'>
            <h2>Add Pantry Item</h2>
            {error && <p className="error">{error}</p>}
            <label>Item Name</label>
            <input
                type="text"
                placeholder="Item Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <label>Quantity</label>
            <input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                required
            />
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {
                    categories.map((cate) => (<option key={cate} value={cate} >{cate}</option>))
                }
            </select>
            <label>Expiry Date</label>
            <input
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
            />
            <button type="submit" disabled={loading} className="add-btn">
                {loading ? <InfinitySpin height="20" width="20" /> : 'Add Item'}
            </button>
        </form>
    )
}

export default AddItemForm