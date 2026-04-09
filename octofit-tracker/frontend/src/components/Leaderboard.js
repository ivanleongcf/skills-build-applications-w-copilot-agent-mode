import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiURL = process.env.REACT_APP_CODESPACE_NAME
      ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`
      : 'http://localhost:8000/api/leaderboard/';

    console.log('Fetching leaderboard from:', apiURL);

    fetch(apiURL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Leaderboard API Response:', data);
        // Handle both paginated response (.results) and plain array
        const leaderboardData = data.results || data;
        console.log('Processed Leaderboard Data:', leaderboardData);
        setLeaderboard(Array.isArray(leaderboardData) ? leaderboardData : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching leaderboard:', error);
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
          <span className="ms-2">Loading leaderboard...</span>
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
          <h2>🏆 Leaderboard</h2>
          <p className="text-muted">Competitive rankings based on points earned</p>
        </div>
        <div className="col-lg-4 text-lg-end">
          <button className="btn btn-warning">
            <i className="bi bi-arrow-repeat"></i> Refresh Rankings
          </button>
        </div>
      </div>

      {leaderboard.length === 0 ? (
        <div className="alert alert-warning" role="alert">
          <i className="bi bi-info-circle"></i>
          <strong> No Leaderboard Data</strong>
          <p className="mb-0 mt-2">Rankings will appear once users start earning points.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table table-hover table-striped mb-0">
            <thead className="table-dark">
              <tr>
                <th scope="col" style={{ width: '80px' }}>Rank</th>
                <th scope="col">User ID</th>
                <th scope="col">Username</th>
                <th scope="col">Points</th>
                <th scope="col">Workouts</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={entry.id || index}>
                  <td>
                    <h5 className="mb-0">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                    </h5>
                  </td>
                  <td>
                    <strong>#{entry.user_id || 'N/A'}</strong>
                  </td>
                  <td>
                    <strong>{entry.username || 'N/A'}</strong>
                  </td>
                  <td>
                    <span className="badge bg-success fs-6">{entry.points || 0}</span>
                  </td>
                  <td>
                    <span className="badge bg-primary">{entry.total_workouts || 0}</span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-primary" title="View Profile">
                      👤
                    </button>
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

export default Leaderboard;
