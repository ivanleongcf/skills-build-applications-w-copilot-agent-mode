import React, { useState, useEffect } from 'react';

const Teams = () => {
  const [teams, setTeams] = useState([]);
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
    const apiURL = `${baseURL}/api/teams/`;

    console.log('Fetching teams from:', apiURL);

    fetch(apiURL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Teams API Response:', data);
        // Handle both paginated response (.results) and plain array
        const teamsData = data.results || data;
        console.log('Processed Teams Data:', teamsData);
        setTeams(Array.isArray(teamsData) ? teamsData : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching teams:', error);
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
          <span className="ms-2">Loading teams...</span>
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
          <h2>👥 Teams</h2>
          <p className="text-muted">Create and manage fitness teams</p>
        </div>
        <div className="col-lg-4 text-lg-end">
          <button className="btn btn-success">
            <i className="bi bi-plus-circle"></i> Create Team
          </button>
        </div>
      </div>

      {teams.length === 0 ? (
        <div className="alert alert-warning" role="alert">
          <i className="bi bi-info-circle"></i>
          <strong> No Teams Found</strong>
          <p className="mb-0 mt-2">Create a new team or join an existing team to get started.</p>
        </div>
      ) : (
        <div className="data-grid">
          {teams.map((team) => (
            <div key={team.id} className="card h-100">
              <div className="card-header">
                <h5 className="card-title mb-0">{team.name || 'N/A'}</h5>
              </div>
              <div className="card-body">
                <p className="card-text text-muted">{team.description || 'No description available.'}</p>
                <div className="row g-3">
                  <div className="col-6">
                    <small className="text-muted d-block">Members</small>
                    <strong className="text-primary">{team.members_count || 0}</strong>
                  </div>
                  <div className="col-6">
                    <small className="text-muted d-block">Team ID</small>
                    <strong className="text-secondary">#{team.id}</strong>
                  </div>
                </div>
                <div className="row g-2 mt-3">
                  <div className="col-12">
                    <small className="text-muted d-block mb-2">Created Date</small>
                    <small>{team.created_at || 'N/A'}</small>
                  </div>
                </div>
              </div>
              <div className="card-footer bg-light">
                <div className="btn-group-custom">
                  <button className="btn btn-sm btn-primary flex-grow-1">View Team</button>
                  <button className="btn btn-sm btn-secondary">Edit</button>
                  <button className="btn btn-sm btn-danger">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Teams;
