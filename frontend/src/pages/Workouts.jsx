import { useState, useEffect } from "react";
import {
  Dumbbell,
  ClipboardList,
  RefreshCw,
  Calendar,
  Pencil,
  Plus,
  Save,
  X,
} from "lucide-react";
import * as jwtDecode from "jwt-decode";
import api from "../config/api";
import Alerts from "../components/Alerts";
import Loading from "../components/Loading";

function Workouts() {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteWorkout, setDeleteWorkout] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const muscleGroups = [
    "Chest",
    "Back",
    "Shoulders",
    "Biceps",
    "Triceps",
    "Quadriceps",
    "Hamstrings",
    "Calves",
    "Abs",
  ];

  const getUserId = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const decoded = jwtDecode.jwtDecode(token);
      return decoded.id;
    } catch (err) {
      console.error("Error decoding token:", err);
      return null;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const fetchWorkouts = async () => {
    const userId = getUserId();
    if (!userId)
      return setAlert({ type: "error", message: "User not identified!" });

    try {
      setLoading(true);
      const response = await api.get(`/workout/user/${userId}`);
      const userData = response.data.data;
      const workoutsData = Array.isArray(userData?.Workouts)
        ? userData.Workouts.map((w) => ({
          ...w,
          data: typeof w.data === "string" ? JSON.parse(w.data) : w.data,
        }))
        : [];

      // 🔥 Show the newest workout first
      setWorkouts(workoutsData.reverse());
    } catch (error) {
      console.error(error);
      setAlert({
        type: "error",
        message:
          error.response?.data?.message || "Error loading workout plans!",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  // --- EDIT ---
  const handleEdit = (workout) => {
    setEditingWorkout(workout);
    setEditData({ ...workout, data: { ...workout.data } });
  };

  const handleChangeExercise = (group, exIndex, field, value) => {
    const updatedData = { ...editData.data };
    updatedData[group][exIndex][field] = value;
    setEditData({ ...editData, data: updatedData });
  };

  const handleChangeSerie = (group, exIndex, sIndex, field, value) => {
    const updatedData = { ...editData.data };
    updatedData[group][exIndex].series[sIndex][field] = value;
    setEditData({ ...editData, data: updatedData });
  };

  const addExercise = (group) => {
    if (!group) return;
    const updatedData = { ...editData.data };
    if (!updatedData[group]) updatedData[group] = [];
    updatedData[group].push({ name: "", series: [{ weight: "", reps: "" }] });
    setEditData({ ...editData, data: updatedData });
  };

  const addSerie = (group, exIndex) => {
    const updatedData = { ...editData.data };
    if (!updatedData[group][exIndex].series)
      updatedData[group][exIndex].series = [];
    updatedData[group][exIndex].series.push({ weight: "", reps: "" });
    setEditData({ ...editData, data: updatedData });
  };

  const saveChanges = async () => {
    if (!editingWorkout) return;
    try {
      setLoading(true);
      await api.put(`/workout/edit/${editingWorkout.id}`, {
        data: editData.data,
      });
      setAlert({
        type: "success",
        message: "Workout updated successfully!",
      });
      setEditingWorkout(null);
      fetchWorkouts();
    } catch (error) {
      console.error(error);
      setAlert({
        type: "error",
        message: error.response?.data?.message || "Error updating workout.",
      });
    } finally {
      setLoading(false);
    }
  };

  // --- DELETE ---
  const handleDeleteClick = (workout) => {
    setDeleteWorkout(workout);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteWorkout) return;
    try {
      setLoading(true);
      await api.delete(`/workout/delete/${deleteWorkout.id}`);
      setAlert({
        type: "success",
        message: "Workout deleted successfully!",
      });
      setShowDeleteModal(false);
      setDeleteWorkout(null);
      fetchWorkouts();
    } catch (error) {
      console.error(error);
      setAlert({
        type: "error",
        message: error.response?.data?.message || "Error deleting workout!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-workouts-wrapper">
      {loading && <Loading message="Loading workouts..." />}
      {alert.message && (
        <Alerts
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: "", message: "" })}
        />
      )}

      <div className="user-workouts-card">
        <h2>
          <ClipboardList size={24} color="#ff7f50" /> My Workouts
        </h2>

        <button className="refresh-btn" onClick={fetchWorkouts}>
          <RefreshCw size={16} /> Refresh
        </button>

        {workouts.length === 0 && !loading && (
          <p className="no-workouts">No workouts found.</p>
        )}

        {workouts.map((workout, index) => (
          <div key={index} className="workout-card">
            <div className="workout-header">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div className="workout-date">
                  <Calendar size={16} color="#ff7f50" />
                  <span>{formatDate(workout.createdAt)}</span>
                </div>
                <button className="edit-btn" onClick={() => handleEdit(workout)}>
                  <Pencil size={16} />
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteClick(workout)}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {workout.data &&
              Object.entries(workout.data).map(([group, exercises]) => (
                <div key={group} className="workout-group">
                  <h4>{group}</h4>
                  {exercises.map((exercise, exIndex) => (
                    <div key={exIndex} className="exercise-details">
                      <p className="exercise-name">{exercise.name}</p>
                      {exercise.series && exercise.series.length > 0 ? (
                        <ul>
                          {exercise.series.map((serie, sIndex) => (
                            <li key={sIndex}>
                              {serie.weight || 0} kg × {serie.reps || 0} reps
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="no-series">No sets added.</p>
                      )}
                    </div>
                  ))}
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* --- EDIT MODAL --- */}
      {editingWorkout && editData && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit Workout</h3>
              <button
                onClick={() => setEditingWorkout(null)}
                className="close-btn"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="add-exercise-section">
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                >
                  <option value="">Select a muscle group</option>
                  {muscleGroups.map((group) => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
                <button onClick={() => addExercise(selectedGroup)} className="add-exercise-btn">
                  <Plus size={14} /> Add Exercise
                </button>
              </div>

              {Object.entries(editData.data).map(([group, exercises]) => (
                <div key={group} className="modal-group">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4>{group}</h4>
                    <button
                      className="remove-btn"
                      onClick={() => {
                        const updatedData = { ...editData.data };
                        delete updatedData[group];
                        setEditData({ ...editData, data: updatedData });
                      }}
                    >
                      Remove Group
                    </button>
                  </div>

                  {exercises.map((exercise, exIndex) => (
                    <div key={exIndex} className="modal-exercise">
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <input
                          type="text"
                          value={exercise.name}
                          onChange={(e) =>
                            handleChangeExercise(group, exIndex, "name", e.target.value)
                          }
                          className="modal-input"
                          placeholder="Exercise Name"
                        />
                        <button
                          className="remove-btn"
                          onClick={() => {
                            const updatedData = { ...editData.data };
                            updatedData[group].splice(exIndex, 1);
                            setEditData({ ...editData, data: updatedData });
                          }}
                        >
                          Remove
                        </button>
                      </div>

                      <ul>
                        {exercise.series.map((serie, sIndex) => (
                          <li key={sIndex} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <input
                              type="number"
                              value={serie.weight}
                              onChange={(e) =>
                                handleChangeSerie(group, exIndex, sIndex, "weight", e.target.value)
                              }
                              className="modal-input small"
                              placeholder="Weight (kg)"
                            />
                            <input
                              type="number"
                              value={serie.reps}
                              onChange={(e) =>
                                handleChangeSerie(group, exIndex, sIndex, "reps", e.target.value)
                              }
                              className="modal-input small"
                              placeholder="Reps"
                            />
                            <button
                              className="remove-btn"
                              onClick={() => {
                                const updatedData = { ...editData.data };
                                updatedData[group][exIndex].series.splice(sIndex, 1);
                                setEditData({ ...editData, data: updatedData });
                              }}
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => addSerie(group, exIndex)}
                        className="modal-add-btn"
                      >
                        <Plus size={14} /> Add Set
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => addExercise(group)}
                    className="modal-add-btn"
                  >
                    <Plus size={14} /> Add Exercise
                  </button>
                </div>
              ))}
            </div>

            <button onClick={saveChanges} className="save-btn">
              <Save size={16} /> Save Changes
            </button>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRM MODAL --- */}
      {showDeleteModal && deleteWorkout && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="close-btn"
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete Workout #{workouts.indexOf(deleteWorkout) + 1}?
              </p>
            </div>
            <div className="modal-actions" style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={confirmDelete}
                className="save-btn"
                style={{ background: "#ff4d4d" }}
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="modal-add-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- STYLES (unchanged) --- */}
      <style>{`
         /* --- BOTOES --- */
  .edit-btn {
    background: #3a3a3f;
    border: none;
    color: white;
    border-radius: 6px;
    padding: 4px 6px;
    cursor: pointer;
    transition: 0.2s;
  }
  .edit-btn:hover { background: #4a4a4f; }

  .delete-btn {
    background: #ff4d4d;
    border: none;
    color: white;
    border-radius: 6px;
    padding: 4px 6px;
    cursor: pointer;
    transition: 0.2s;
  }
  .delete-btn:hover { background: #ff6666; }

  .refresh-btn {
    align-self: flex-end;
    background: #3a3a3f;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 8px 12px;
    cursor: pointer;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: 0.2s;
  }
  .refresh-btn:hover { background: #4a4a4f; }
/* --- BOTÃO ADD EXERCISE --- */
.add-exercise-btn {
  background: #4caf50; /* Verde para destacar */
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 14px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: 0.2s;
}

.add-exercise-btn:hover {
  background: #66bb6a; /* Verde mais claro ao passar o mouse */
}
  /* --- WRAPPER --- */
  .user-workouts-wrapper {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 20px;
    min-height: 100vh;
    font-family: 'Segoe UI', sans-serif;
  }

  /* --- CARD PRINCIPAL --- */
  .user-workouts-card {
    background: #20232a;
    padding: 36px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    width: 100%;
    max-width: 650px;
    color: white;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  h2 { display: flex; align-items: center; gap: 12px; font-size: 1.8rem; color: #ff7f50; }
  .no-workouts { text-align: center; color: #aaa; font-style: italic; }

  /* --- WORKOUT CARD --- */
  .workout-card { 
    background: #2a2d36; 
    border-radius: 10px; 
    padding: 20px; 
    display: flex; 
    flex-direction: column; 
    gap: 16px; 
  }
  .workout-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #3a3a3f;
    padding-bottom: 8px;
  }
  .workout-date {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #ff7f50;
    font-size: 0.9rem;
  }
  .workout-group { 
    background: #333642; 
    padding: 14px; 
    border-radius: 8px; 
  }
  .workout-group h4 { color: #ff7f50; margin-bottom: 8px; font-size: 1.1rem; }
  .exercise-details { background: #3a3d48; padding: 10px; border-radius: 6px; margin-bottom: 10px; }
  .exercise-name { font-weight: 600; color: #fff; margin-bottom: 6px; }
  .no-series { color: #bbb; font-style: italic; }
  ul { list-style: none; padding-left: 10px; margin: 0; }
  li { color: #ccc; font-size: 0.95rem; }

  /* --- MODAL OVERLAY --- */
  .modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.75);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 10px;
  }

  .modal {
    background: #1f2128;
    color: #fff;
    padding: 24px;
    border-radius: 12px;
    width: 100%;
    max-width: 650px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.6);
    overflow: hidden;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #3a3a3f;
    padding-bottom: 10px;
  }

  .close-btn {
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    transition: transform 0.2s;
  }
  .close-btn:hover { transform: rotate(90deg); }

  .modal-body {
    max-height: 60vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-right: 4px;
  }

  .modal-group {
    background: #2a2d36;
    padding: 14px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .modal-group h4 {
    color: #ff7f50;
    margin-bottom: 8px;
    font-size: 1.2rem;
  }

  .modal-exercise {
    background: #333642;
    padding: 12px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .modal-input {
    background: #20232a;
    border: 1px solid #444;
    color: white;
    border-radius: 6px;
    padding: 8px;
    font-size: 0.95rem;
    transition: 0.2s;
  }
  .modal-input:focus {
    border-color: #ff7f50;
    outline: none;
  }
  .modal-input.small {
    width: 48%;
  }

  .modal-add-btn, .save-btn {
    background: #ff7f50;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 14px;
    cursor: pointer;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: 0.2s;
  }
  .modal-add-btn:hover, .save-btn:hover { background: #ff9f70; }

      /* --- SEÇÃO DE ADICIONAR EXERCÍCIO --- */
.add-exercise-section {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.add-exercise-section select {
  flex: 1;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #444;
  background: #20232a;
  color: white;
  font-size: 0.95rem;
  transition: 0.2s;
}

.add-exercise-section select:focus {
  border-color: #ff7f50;
  outline: none;
}

.add-exercise-section .modal-add-btn {
  padding: 10px 14px;
  background: #ff7f50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: 0.2s;
}

  .add-exercise-section .modal-add-btn:hover {
    background: #ff9f70;
  }

  /* --- RESPONSIVIDADE --- */
  @media (max-width: 650px) {
    .add-exercise-section {
      flex-direction: column;
      gap: 6px;
    }
  }


  .remove-btn {
    background: #ff4d4d;
    border: none;
    color: white;
    border-radius: 6px;
    padding: 4px 8px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: 0.2s;
  }
  .remove-btn:hover { background: #ff6666; }

  /* --- RESPONSIVIDADE --- */
  @media (max-width: 650px) {
    .modal {
      padding: 20px;
    }

    .modal-body {
      max-height: 55vh;
    }

    .modal-input.small {
      width: 100%;
      margin-right: 0;
    }

    .modal-exercise {
      gap: 12px;
    }

    .modal-add-btn, .save-btn {
      width: 100%;
      justify-content: center;
    }

    .workout-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }
  }
      `}</style>
    </div>
  );
}

export default Workouts;
