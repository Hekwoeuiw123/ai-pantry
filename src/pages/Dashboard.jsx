import React, { useMemo, useState } from 'react'
import PantryToolbar from '../feature/pantry/PantryToolbar'
import { InfinitySpin } from 'react-loader-spinner';
import { usePantry } from '../context/pantryContext'
import PantryList from '../feature/pantry/PantryList'
import AddItemForm from '../feature/pantry/AddItemForm'
import { Modal } from '../components/common/Modal';
import '../styles/pantryForm.css'
import '../styles/Dashboard.css'
import ImageUpload from '../feature/pantry/ImageUpload';

const Dashboard = () => {
  const { item, loading } = usePantry()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("All")
  const [sortItem, setSortItem] = useState('name-asc')

  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  const openModal = () => setIsOpenModal(true)
  const closeModal = () => setIsOpenModal(false)

  const openUploadModal = () => setIsUploadModalOpen(true)
  const closeUploadModal = () => setIsUploadModalOpen(false)

  const handleUploadButton = () => {
    openUploadModal()
  }

  const handleFilteredandSortSearch = useMemo(() => {
    let tempItems = [...item]

    if (searchTerm) {
      tempItems = tempItems.filter((item) => {
        return item.name.toLowerCase().includes(searchTerm.toLowerCase())
      })
    }

    if (filterCategory !== "All") {
      tempItems = tempItems.filter((item) => {
        return item.category === filterCategory
      })
    }

    // localeCompare() 
    tempItems.sort((a, b) => {
      switch (sortItem) {
        case 'name-desc':
          return b.name.localeCompare(a.name)  // Z-A sort
        case 'expiry-asc':
          return new Date(a.expirationDate) - new Date(b.expirationDate) // return Jo abhi Expire Hone wala hai
        default:
          return a.name.localeCompare(b.name)   // A-Z default
      }
    })
    return tempItems;
  }, [item, searchTerm, filterCategory, sortItem])



  return (
    <div className='dashboard-page'>
      <PantryToolbar
        onAddItemClick={openModal}
        onUploadItemClick={handleUploadButton}
        onSearchChange={setSearchTerm}
        onFilterChange={setFilterCategory}
        onSortChange={setSortItem}
      />

      {
        loading ? <InfinitySpin height="50" width="50" /> : <PantryList Items={handleFilteredandSortSearch} />
      }

      {
        isOpenModal && <Modal onClose={closeModal}>
          <AddItemForm onSuccess={closeModal} />
        </Modal>
      }

      {
        isUploadModalOpen && <Modal onClose={closeUploadModal}>
          <ImageUpload onSuccess={closeUploadModal} />
        </Modal>
      }
    </div>
  )
}

export default Dashboard