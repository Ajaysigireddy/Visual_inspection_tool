import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import './modellist.css';
import { BASE_URL } from './config.js';

const ModelsTable = () => {
  const [models, setModels] = useState([]);
  const [redirect, setRedirect] = useState(null);
  const token = localStorage.getItem('token');
  console.log(token)

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(BASE_URL + '/getModelDetails', {
        method: 'POST',
        headers: {
          'x-access-token': token // Add the token as a header
        }
      });
      const data = await response.json();
      if (response.status === 401) {
        // Token is missing or invalid, show the error message
        alert(data.message);
        // Redirect to '/login'
        window.location.href = '/login';
        return; // Stop further execution
      }
      setModels(data.responseData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLabelCountHover = (labels) => {
    // Implement your desired tooltip or hover effect to display the labels
    console.log(labels);
  };

  const handleCreateRulesClick = (modelName) => {
    setRedirect(`/rules/create?model=${modelName}`);
  };

  const handleDeleteClick = async (modelID) => {
    try {
      const response = await fetch(BASE_URL + '/deleteModel', {
        method: 'POST',
        headers: {
          'x-access-token': token, // Add the token as a header
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ modelID })
      });
      const data = await response.json();
      if (response.status === 200) {
        // Model successfully deleted, update the model list
        fetchData();
      } else {
        // Handle error, show error message or alert
        console.error('Error deleting model:', data.message);
      }
    } catch (error) {
      console.error('Error deleting model:', error);
    }
  };

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="table-container">
      <table className="modeltable">
        <thead>
          <tr>
            <th>Model Creation Time</th>
            <th>Model Name</th>
            <th>Model Description</th>
            <th># of Labels</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {models.map((model) => (
            <tr key={model.modelID}>
              <td>{model.modelCreationTime}</td>
              <td>{model.modelName}</td>
              <td>{model.modelDescription}</td>
              <td>
                <span
                  className="label-count"
                  title={model.labels.join(', ')}
                  onMouseEnter={() => handleLabelCountHover(model.labels)}
                  onMouseLeave={() => handleLabelCountHover(null)}
                >
                  {model.totalLabels}
                </span>
              </td>
              <td>
                <div className="buttons">
                  <button onClick={() => handleCreateRulesClick(model.modelName)}>Create Rules</button>
                  &nbsp;&nbsp;
                  <button onClick={() => handleDeleteClick(model.modelID)}>Delete</button>
                  &nbsp;&nbsp;
                  <button>View Details</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ModelsTable;
