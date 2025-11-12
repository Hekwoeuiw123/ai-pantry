import React, { useEffect, useRef, useState } from 'react'
import { usePantry } from '../context/pantryContext'
import { getMealPlan } from '../services/aiService'
import { InfinitySpin } from 'react-loader-spinner'
import MealPlanner from '../feature/planner/MealPlanner'
import '../styles/MealPlanner.css'
const Planner = () => {

  const [plan, setPlan] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null);
  const { item: pantryItems, loading: pantryLoading } = usePantry()

  const abortControllerRef = useRef(null);
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const handleGenerate = async () => {
    const controller = new AbortController()
    abortControllerRef.current = controller
    setLoading(true)
    setError(null)
    try {
      const ingredientNames = pantryItems.map(item => item.name);
      const newPlan = await getMealPlan(ingredientNames , controller.signal)
      if (newPlan) {
        setPlan(newPlan)
      } else {
        if (!controller.signal.aborted) {
          setError('Failed to get Plan. Please try again.');
        }
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        setError('An unexpected error occurred.', error.message);
      }
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      setLoading(false)
    }
  }
  return (
    <div className='page-container'>
      <div className="planner-header">
        <p>Generate a 7-day dinner plan based on your pantry.</p>
        <button className="btn-primary" onClick={handleGenerate} disabled={loading || pantryLoading}>
          {loading ? <InfinitySpin height="14" width="14" /> : "Generate My Meal"}
        </button>
      </div>
      {error && <p className="auth-error">{error}</p>}
      {loading && <InfinitySpin height="24" width="24" />}
      {/* Generate a Grid of Plan  */}
      <MealPlanner plan={plan} />
    </div>
  )
}

export default Planner