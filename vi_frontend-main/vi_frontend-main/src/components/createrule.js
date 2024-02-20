import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BASE_URL } from './config.js';


const RuleCreationPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const modelParam = queryParams.get('model');

  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(modelParam || '');
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [ruleName, setRuleName] = useState('');
  const [rules, setRules] = useState([{ label: '', detection: '', category: '' }]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from the browser's cache
  
      const response = await fetch(BASE_URL + '/getModelDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
  
      if (modelParam) {
        const selectedModelData = data.responseData.find(
          (model) => model.modelName === modelParam
        );
  
        if (selectedModelData) {
          setSelectedLabels(selectedModelData.labels);
        } else {
          setSelectedLabels([]);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  

  const handleModelSelect = async (e) => {
    const selectedModel = e.target.value;
    setSelectedModel(selectedModel);
  
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from the browser's cache
  
      const response = await fetch(BASE_URL + '/getModelDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
  
      const selectedModelData = data.responseData.find(
        (model) => model.modelName === selectedModel
      );
  
      if (selectedModelData) {
        setSelectedLabels(selectedModelData.labels);
      } else {
        setSelectedLabels([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  const handleRuleNameChange = (e) => {
    setRuleName(e.target.value);
  };

  const handleAddRow = () => {
    setRules([...rules, { label: '', detection: '', category: '' }]);
  };

  const handleRemoveRow = (index) => {
    const updatedRules = [...rules];
    updatedRules.splice(index, 1);
    setRules(updatedRules);
  };

  const handleRuleChange = (index, field, value) => {
    const updatedRules = [...rules];
    updatedRules[index][field] = value;
    setRules(updatedRules);
  };

  const handleSubmit = async () => {
    const requestBody = {
      modelName: selectedModel,
      ruleName: ruleName,
      ruleDescription: rules,
    };
  
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from the browser's cache
  
      const response = await fetch(BASE_URL + '/createRuleRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token // Add the token as a header
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        alert('Rule creation request sent successfully!');
        // Reset form or perform any other necessary actions
      } else if (response.status === 401) {
        // Token is missing or invalid
        const data = await response.json();
        console.error('Failed to send rule creation request:', data.message);
        // Redirect to '/login'
        window.location.href = '/login';
      } else {
        console.error('Failed to send rule creation request:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to send rule creation request:', error);
    }
  };
  

  return (
    <div>
      <div>
        <label>Select Model:</label>
        <select value={selectedModel} onChange={handleModelSelect}>
          <option value="">Select Model</option>
          {models.map((model) => (
            <option key={model.modelID} value={model.modelName}>
              {model.modelName}
            </option>
          ))}
        </select>
      </div>
      <div className="rule-name-container">
        <label htmlFor="ruleName">Rule Name:</label>
        <input type="text" id="ruleName" value={ruleName} onChange={handleRuleNameChange} style={{ width: '150px', height: '30px' }} />
      </div>
      {selectedModel && (
        <div>
          <table>
            <thead>
              <tr>
                <th>Label</th>
                <th>Detection</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule, index) => (
                <tr key={index}>
                  <td>
                    <select
                      value={rule.label}
                      onChange={(e) => handleRuleChange(index, 'label', e.target.value)}
                    >
                      <option value="">Select Label</option>
                      {selectedLabels.map((label) => (
                        <option key={label} value={label}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      value={rule.detection}
                      onChange={(e) => handleRuleChange(index, 'detection', e.target.value)}
                    >
                      <option value="">Select Detection</option>
                      <option value="Yes">When Detected</option>
                      <option value="No">When Not Detected</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={rule.category}
                      onChange={(e) => handleRuleChange(index, 'category', e.target.value)}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleRemoveRow(index)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleAddRow}>Add Row</button>
          &nbsp;&nbsp;
          <button onClick={handleSubmit}>Create Rule</button>
        </div>
      )}
    </div>
  );
};

export default RuleCreationPage;
