import React, { useEffect, useState, useRef } from 'react';
import { BASE_URL } from './config';
import './viewdeploy.css';

const DeploymentTable = () => {
  const [deploymentData, setDeploymentData] = useState([]);
  const [rulesData, setRulesData] = useState([]);
  const [selectedRules, setSelectedRules] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [suggestedRules, setSuggestedRules] = useState([]);
  const token = localStorage.getItem('token');
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const fetchDeploymentData = async () => {
      try {
        const response = await fetch(BASE_URL + '/getDetectionImagesUploadDetails', {
          method: 'POST',
          headers: {
            'x-access-token': token,
          },
        });
        const data = await response.json();

        if (response.status === 401) {
          // Token is missing or invalid, show the error message
          alert(data.message);
          // Redirect to '/login'
          window.location.href = '/login';
          return; // Stop further execution
        }

        setDeploymentData(data.filter((item) => item.dataType === 'detectionData'));
      } catch (error) {
        console.error('Error fetching deployment data:', error);
      }
    };

    const fetchRulesData = async () => {
      try {
        const response = await fetch(BASE_URL + '/getRules', {
          method: 'POST',
          headers: {
            'x-access-token': token,
          },
        });
        const data = await response.json();

        setRulesData(data.data.reverse());
      } catch (error) {
        console.error('Error fetching rules data:', error);
      }
    };

    fetchDeploymentData();
    fetchRulesData();
  }, [token]);

  const getRuleNames = (ruleIds) => {
    return ruleIds.map((ruleId) => {
      const rule = rulesData.find((rule) => rule['Rule ID'] === ruleId);
      return rule ? rule['Rule Name'] : '';
    });
  };

  const downloadReport = async (requestID) => {
    try {
      console.log(requestID);
      const response = await fetch(BASE_URL + '/reports/getDetectionResults', {
        method: 'POST',
        headers: {
          'x-access-token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testUploadID: requestID,
        }),
      });
      console.log(response.status);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'report.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  const handleRuleFilterChange = (event) => {
    const filterText = event.target.value;
    setFilterText(filterText);

    const filteredRules = rulesData.filter((rule) =>
      rule['Rule Name'].toLowerCase().includes(filterText.toLowerCase())
    );
    setSuggestedRules(filteredRules);
  };

  const handleRuleSelection = (rule) => {
    setSelectedRules([...selectedRules, rule]);
    setFilterText('');
    setSuggestedRules([]);
  };

  const removeSelectedRule = (rule) => {
    const updatedSelectedRules = selectedRules.filter((selectedRule) => selectedRule !== rule);
    setSelectedRules(updatedSelectedRules);
  };

  const handleOutsideClick = (event) => {
    if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
      setSuggestedRules([]);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const isAnySelected = selectedRules.includes('All');
  const filteredData = isAnySelected
    ? deploymentData
    : deploymentData.filter((item) => {
        const ruleNames = getRuleNames(item.rulesList);
        return selectedRules.every((selectedRule) => ruleNames.includes(selectedRule));
      });

  const [showPopup, setShowPopup] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  
      
  const handleRunAgainClick = () => {
    setShowPopup(true);
    setSelectedOption('');
  };

  const handleOptionSelection = (option) => {
    setSelectedOption(option);
  };
  
  const handleRunClick = () => {
    // Perform the necessary actions based on the selected option
    if (selectedOption === 'runAgain') {
      // Run last execution again
      console.log('Running last execution again...');
    } else if (selectedOption === 'makeNewExecution') {
      // Make new execution
      console.log('Making new execution...');
    }
  
    // Close the popup
    setShowPopup(false);
  };
  
  const handleCloseClick = () => {
    // Close the popup without performing any action
    setShowPopup(false);
  };
  

  return (
    <div>
      <h2>Visual Inspection Status</h2>
      <div className="input-container">
        <label htmlFor="ruleFilter">Filter by Rule:</label>
        <div className="dropdown">
          <input
            type="text"
            id="ruleFilter"
            value={filterText}
            onChange={handleRuleFilterChange}
            autoComplete="off"
            placeholder="Search for a rule"
          />
          {suggestedRules.length > 0 && (
            <ul className="suggestions" ref={suggestionsRef}>
              <li onClick={() => handleRuleSelection('All')}>All</li>
              {suggestedRules.map((rule) => (
                <li
                  key={rule['Rule ID']}
                  onClick={() => handleRuleSelection(rule['Rule Name'])}
                >
                  {rule['Rule Name']}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="selected-rules">
        {selectedRules.map((rule) => (
          <span key={rule} className="selected-rule">
            {rule}
            <button className='cross' onClick={() => removeSelectedRule(rule)}>x</button>
          </span>
        ))}
      </div>
      <table className="deploytable">
        <thead>
          <tr>
            <th>Date Time</th>
            <th>Deployed Rules</th>
            <th>Status</th>
            <th>Download</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td>{item.datetime}</td>
              <td>{getRuleNames(item.rulesList).join(', ')}</td>
              <td>{item.status}</td>
              <td>
                <button onClick={() => downloadReport(item.requestID)}>Report</button>
              </td>
              <td>
                <button id="runButton" onClick={handleRunAgainClick}>Run again</button>
              </td>
            </tr>
          )).reverse()}
        </tbody>
      </table>
      {showPopup && (
        <div className="popup-deploy">
          <h3>Select an option:</h3>
          <ul>
            <li
              className={selectedOption === 'runAgain' ? 'selected' : ''}
              onClick={() => handleOptionSelection('runAgain')}>
              Run Last Execution again
            </li>
            <li
              className={selectedOption === 'makeNewExecution' ? 'selected' : ''}
              onClick={() => handleOptionSelection('makeNewExecution')}>
              Make new execution
            </li>
          </ul>
          <div className="popup-deploy-buttons">
            <button onClick={handleRunClick}>Run</button>
            <button onClick={handleCloseClick}>Close</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default DeploymentTable;
