import React, { useState, useEffect } from 'react';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBaseURL = () => {
      if (process.env.REACT_APP_CODESPACE_NAME) {
        return `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`;
      }
      return 'http://localhost:8000';
    };

    const baseURL = getBaseURL();
    const apiURL = `${baseURL}/api/workouts/`;

    console.log('Fetching workouts from:', apiURL);

    fetch(apiURL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Workouts API Response:', data);
        // Handle both paginated response (.results) and plain array
        const workoutsData = data.results || data;
        console.log('Processed Workouts Data:', workoutsData);
        setWorkouts(Array.isArray(workoutsData) ? workoutsData : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching workouts:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="container mt-4">
        <div className="alert alert-info" role="alert">
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="ms-2">Loading workouts...</span>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <strong>Error!</strong> {error}
        </div>
      </div>
    );

  const getDifficultyColor = (level) => {
    switch ((level || '').toLowerCase()) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-lg-8">
          <h2>💪 Workouts</h2>
          <p className="text-muted">Explore personalized workout routines</p>
        </div>
        <div className="col-lg-4 text-lg-end">
          <button className="btn btn-success">
            <i className="bi bi-plus-circle"></i> Create Workout
          </button>
        </div>
      </div>

      {workouts.length === 0 ? (
        <div className="alert alert-warning" role="alert">
          <i className="bi bi-info-circle"></i>
          <strong> No Workouts Available</strong>
          <p className="mb-0 mt-2">Create your first workout routine to get started.</p>
        </div>
      ) : (
        <div className="row g-4">
          {workouts.map((workout) => (
            <div key={workout.id} className="col-md-6 col-lg-4">
              <div className="card h-100">
                <div className="card-header">
                  <h5 className="card-title mb-0">{workout.name || 'N/A'}</h5>
                </div>
                <div className="card-body">
                  <p className="card-text text-muted">{workout.description || 'No description available.'}</p>
                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <small className="text-muted d-block">Duration</small>
                      <strong className="text-primary">{workout.duration || 0} min</strong>
                    </div>
                    <div className="col-6">
                      <small className="text-muted d-block">Difficulty</small>
                      <span className={`badge bg-${getDifficultyColor(workout.difficulty_level)}`}>
                        {workout.difficulty_level || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <small className="text-muted d-block mb-2">Created Date</small>
                    <small>{workout.created_at ? new Date(workout.created_at).toLocaleDateString() : 'N/A'}</small>
                  </div>
                </div>
                <div className="card-footer bg-light">
                  <div className="btn-group-custom">
                    <button className="btn btn-sm btn-primary flex-grow-1">Start</button>
                    <button className="btn btn-sm btn-secondary">Edit</button>
                    <button className="btn btn-sm btn-danger">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Workouts;
