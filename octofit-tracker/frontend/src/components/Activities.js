import React, { useState, useEffect } from 'react';

const Activities = () => {
  const [activities, setActivities] = useState([]);
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
    const apiURL = `${baseURL}/api/activities/`;

    console.log('Fetching activities from:', apiURL);

    fetch(apiURL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Activities API Response:', data);
        // Handle both paginated response (.results) and plain array
        const activitiesData = data.results || data;
        console.log('Processed Activities Data:', activitiesData);
        setActivities(Array.isArray(activitiesData) ? activitiesData : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching activities:', error);
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
          <span className="ms-2">Loading activities...</span>
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

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-lg-8">
          <h2>📋 Activities</h2>
          <p className="text-muted">View and manage your fitness activities</p>
        </div>
        <div className="col-lg-4 text-lg-end">
          <button className="btn btn-primary">
            <i className="bi bi-plus-circle"></i> Add Activity
          </button>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="alert alert-warning" role="alert">
          <i className="bi bi-info-circle"></i>
          <strong> No Activities Found</strong>
          <p className="mb-0 mt-2">Start logging your fitness activities to see them here.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table table-hover table-striped mb-0">
            <thead className="table-dark">
              <tr>
                <th scope="col">#ID</th>
                <th scope="col">Activity Name</th>
                <th scope="col">Type</th>
                <th scope="col">Duration (min)</th>
                <th scope="col">Calories</th>
                <th scope="col">Date</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id}>
                  <td>
                    <strong>#{activity.id}</strong>
                  </td>
                  <td>{activity.name || 'N/A'}</td>
                  <td>
                    <span className="badge bg-info">{activity.activity_type || 'N/A'}</span>
                  </td>
                  <td>{activity.duration || 'N/A'}</td>
                  <td>
                    <span className="badge bg-success">{activity.calories_burned || 'N/A'}</span>
                  </td>
                  <td>
                    <small className="text-muted">{activity.date || 'N/A'}</small>
                  </td>
                  <td>
                    <div className="btn-group-custom">
                      <button className="btn btn-sm btn-primary" title="Edit">
                        ✎
                      </button>
                      <button className="btn btn-sm btn-danger" title="Delete">
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Activities;
