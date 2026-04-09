import React, { useState, useEffect } from 'react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiURL = process.env.REACT_APP_CODESPACE_NAME
      ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`
      : 'http://localhost:8000/api/users/';

    console.log('Fetching users from:', apiURL);

    fetch(apiURL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Users API Response:', data);
        // Handle both paginated response (.results) and plain array
        const usersData = data.results || data;
        console.log('Processed Users Data:', usersData);
        setUsers(Array.isArray(usersData) ? usersData : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
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
          <span className="ms-2">Loading users...</span>
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
          <h2>👤 Users</h2>
          <p className="text-muted">Browse all registered fitness users</p>
        </div>
        <div className="col-lg-4 text-lg-end">
          <button className="btn btn-primary">
            <i className="bi bi-person-plus"></i> Add User
          </button>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="alert alert-warning" role="alert">
          <i className="bi bi-info-circle"></i>
          <strong> No Users Found</strong>
          <p className="mb-0 mt-2">Register new users to see them listed here.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table table-hover table-striped mb-0">
            <thead className="table-dark">
              <tr>
                <th scope="col">#ID</th>
                <th scope="col">Username</th>
                <th scope="col">Email</th>
                <th scope="col">Full Name</th>
                <th scope="col">Joined</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <strong>#{user.id}</strong>
                  </td>
                  <td>
                    <strong>{user.username || 'N/A'}</strong>
                  </td>
                  <td>
                    <a href={`mailto:${user.email}`}>{user.email || 'N/A'}</a>
                  </td>
                  <td>
                    {user.first_name || user.last_name
                      ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                      : 'N/A'}
                  </td>
                  <td>
                    <small className="text-muted">
                      {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}
                    </small>
                  </td>
                  <td>
                    <div className="btn-group-custom">
                      <button className="btn btn-sm btn-primary" title="View Profile">
                        👁‍🗨
                      </button>
                      <button className="btn btn-sm btn-secondary" title="Edit">
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

export default Users;
