import { useState } from "react";
import { Dumbbell, PlusCircle, Save, Trash2 } from "lucide-react";
import * as jwtDecode from "jwt-decode";
import api from "../config/api";
import Alerts from "../components/Alerts";
import Loading from "../components/Loading";

function NewWorkout() {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [workout, setWorkout] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

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

  const addExercise = () => {
    if (!selectedGroup)
      return setAlert({ type: "error", message: "Select a muscle group first!" });
    const updated = { ...workout };
    if (!updated[selectedGroup]) updated[selectedGroup] = [];
    updated[selectedGroup].push({ name: "", series: [{ weight: "", reps: "" }] });
    setWorkout(updated);
  };

  const deleteExercise = (group, exIndex) => {
    const updated = { ...workout };
    updated[group].splice(exIndex, 1);
    if (updated[group].length === 0) delete updated[group];
    setWorkout(updated);
  };

  const updateExercise = (group, exIndex, field, value) => {
    const updated = { ...workout };
    updated[group][exIndex][field] = value;
    setWorkout(updated);
  };

  const updateSeries = (group, exIndex, sIndex, field, value) => {
    const updated = { ...workout };
    updated[group][exIndex].series[sIndex][field] = value;
    setWorkout(updated);
  };

  const addSeries = (group, exIndex) => {
    const updated = { ...workout };
    updated[group][exIndex].series.push({ weight: "", reps: "" });
    setWorkout(updated);
  };

  const deleteSeries = (group, exIndex, sIndex) => {
    const updated = { ...workout };
    updated[group][exIndex].series.splice(sIndex, 1);
    setWorkout(updated);
  };

  const saveWorkout = async () => {
    const userId = getUserId();
    if (!userId)
      return setAlert({ type: "error", message: "User not identified!" });
    if (Object.keys(workout).length === 0)
      return setAlert({
        type: "error",
        message: "Add at least one exercise!",
      });

    try {
      setLoading(true);
      await api.post("/workout/create", { userId, data: workout });
      setAlert({ type: "success", message: "Workout created successfully!" });
      setWorkout({});
      setSelectedGroup("");
    } catch (error) {
      console.error(error);
      setAlert({
        type: "error",
        message: error.response?.data?.message || "Error creating workout!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-workout-wrapper">
      {loading && <Loading message="Saving workout..." />}
      {alert.message && (
        <Alerts
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: "", message: "" })}
        />
      )}

      <div className="new-workout-card">
        <h2>
          <Dumbbell size={24} color="#ff7f50" /> New Workout
        </h2>

        <div className="form-group">
          <label>Muscle group</label>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="">Select a muscle group</option>
            {muscleGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
          <button className="add-btn" onClick={addExercise}>
            <PlusCircle size={18} /> Add Exercise
          </button>
        </div>

        {Object.keys(workout).length === 0 && (
          <p className="no-exercises">No exercises added yet.</p>
        )}

        {Object.entries(workout).map(([group, exercises]) => (
          <div key={group} className="group-section">
            <h3>{group}</h3>
            {exercises.map((ex, exIndex) => (
              <div key={exIndex} className="exercise-card">
                <div className="exercise-header">
                  <input
                    type="text"
                    placeholder="Exercise name"
                    value={ex.name}
                    onChange={(e) =>
                      updateExercise(group, exIndex, "name", e.target.value)
                    }
                    className="exercise-name"
                  />
                  <button
                    className="delete-exercise"
                    onClick={() => deleteExercise(group, exIndex)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {ex.series.map((serie, sIndex) => (
                  <div key={sIndex} className="series-row">
                    <input
                      type="number"
                      placeholder="Weight (kg)"
                      value={serie.weight}
                      onChange={(e) =>
                        updateSeries(group, exIndex, sIndex, "weight", e.target.value)
                      }
                      className="series-input"
                    />
                    <input
                      type="number"
                      placeholder="Reps"
                      value={serie.reps}
                      onChange={(e) =>
                        updateSeries(group, exIndex, sIndex, "reps", e.target.value)
                      }
                      className="series-input"
                    />
                    <button
                      className="delete-series"
                      onClick={() => deleteSeries(group, exIndex, sIndex)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                <button
                  className="add-series"
                  onClick={() => addSeries(group, exIndex)}
                >
                  + Add Set
                </button>
              </div>
            ))}
          </div>
        ))}

        {Object.keys(workout).length > 0 && (
          <button className="save-btn" onClick={saveWorkout} disabled={loading}>
            <Save size={18} /> {loading ? "Saving..." : "Save Workout"}
          </button>
        )}
      </div>

      <style>{`
        .new-workout-wrapper {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 20px;
          min-height: 100vh;
        }

        .new-workout-card {
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
          font-family: 'Segoe UI', sans-serif;
        }

        h2 {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.8rem;
          margin-bottom: 20px;
          color: #ff7f50;
        }

        .form-group { display: flex; flex-direction: column; gap: 10px; }
        select {
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #3a3a3f;
          background: #fff;
          color: #000;
          font-size: 1rem;
        }

        .add-btn {
          background: #ff7f50;
          color: #fff;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          transition: 0.2s;
          margin-top: 6px;
        }
        .add-btn:hover { background: #ff946b; }

        .no-exercises {
          color: #bbb;
          font-style: italic;
          margin-top: 12px;
        }

        .group-section { display: flex; flex-direction: column; gap: 16px; margin-top: 20px; }
        .group-section h3 { color: #ff7f50; font-size: 1.3rem; }

        .exercise-card {
          background: #2a2d36;
          padding: 20px;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .exercise-name {
          padding: 10px;
          border-radius: 6px;
          border: 1px solid #3a3a3f;
          font-size: 1rem;
        }

        .series-row {
          display: flex;
          gap: 10px;
        }

        .series-input {
          flex: 1;
          min-width: 0;
          padding: 10px;
          border-radius: 6px;
          border: 1px solid #3a3a3f;
          font-size: 1rem;
        }

        .add-series {
          background: none;
          border: none;
          color: #ff7f50;
          cursor: pointer;
          text-align: left;
          font-weight: 500;
          margin-top: 6px;
        }
        .add-series:hover { text-decoration: underline; }

        .save-btn {
          margin-top: 20px;
          padding: 14px;
          background: #2ecc71;
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          justify-content: center;
          font-size: 1rem;
          transition: 0.2s;
        }
        .save-btn:hover { background: #35d37e; }
        .save-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        @media (max-width: 600px) {
          .new-workout-card { padding: 24px; }
          .series-row { flex-direction: row; }
        }

        .exercise-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .delete-exercise {
          background: none;
          border: none;
          color: #ff4d4d;
          cursor: pointer;
          padding: 4px;
          transition: 0.2s;
        }
        .delete-exercise:hover { color: #ff6b6b; }

        .delete-series {
          background: none;
          border: none;
          color: #ff4d4d;
          cursor: pointer;
          transition: 0.2s;
        }
        .delete-series:hover { color: #ff6b6b; }
      `}</style>
    </div>
  );
}

export default NewWorkout;

