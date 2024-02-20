import React, { useState, useEffect } from 'react';
import './viewrules.css';
import { BASE_URL } from './config';

const TableComponent = () => {
  const [rules, setRules] = useState([]);
  const [selectedRules, setSelectedRules] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [filterOption, setFilterOption] = useState('All');
  const token = localStorage.getItem('token');

  const fetchRules = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from the browser's cache

      const response = await fetch(BASE_URL+'/getRules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token // Add the token as a header
        }
      });

      const data = await response.json();

      if (response.status === 200) {
        // Token is valid, show the data
        setRules(data.data);
      } 
      else if (response.status === 401) {
        // Token is missing or invalid, show the error message
        alert(data.message);
        // Redirect to '/login'
        window.location.href = '/login';
      } else {
        // Handle other response statuses if needed
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const [showDescription, setShowDescription] = useState(false);
  const [descriptionData, setDescriptionData] = useState([]);

  const [showUpload, setUpload] = useState(false);

  const handleViewDescription = (description) => {
    setDescriptionData(description);
    setShowDescription(true);
  };

  const handleUploadImages = () => {
    if (selectedRules.length === 0) {
      alert('Please select rules first.'); // Alert if no rule is selected before uploading images
    } else {
      // Store the "Rule ID" of selected rules separated by comma
      const selectedRuleIds = selectedRules.map((rule) => rule['Rule ID']).join(',');
      console.log('Selected Rule IDs:', selectedRuleIds);

      setUpload(true);
   
    }

  };

  const handleImageSelect = (event) => {
    const files = event.target.files;
    const selectedImagesArray = Array.from(files);
    setSelectedImages(selectedImagesArray);
  };

  const handleDeploy = async () => {
    if (selectedImages.length === 0) {
      alert('Please upload images first.'); // Alert if no images are uploaded
    } else {
      // Create a new FormData object
      const formData = new FormData();
  
      // Append the image files to the form data
      selectedImages.forEach((imageFile) => {
        formData.append('imageFiles', imageFile);
      });
  
      // Get the rule IDs separated by commas
      const ruleIds = selectedRules.map((rule) => rule['Rule ID']).join(',');
  
      // Append the rule IDs to the form data
      formData.append('rulesList', ruleIds);
  
      try {
        const token = localStorage.getItem('token'); // Retrieve the token from the browser's cache
  
        const response = await fetch(BASE_URL+'/image/upload/detectionData', {
          method: 'POST',
          headers: {
            'x-access-token': token // Add the token as a header
          },
          body: formData
        });

        const data = await response.json();
        if (response.status === 401) {
          // Token is missing or invalid, show the error message
          alert(data.message);
          // Redirect to '/login'
          window.location.href = '/login';
          return; // Stop further execution
        }
  
        if (response.ok) {
          alert('Deployment successful!');
          // Reset any necessary state or perform other actions
        } else {
          console.error('Failed to deploy:', response.statusText);
        }
      } catch (error) {
        console.error('Failed to deploy:', error);
      }

      // Close the upload popup
      setUpload(false);

    }
  };
  

  const handleClosePopup = () => {
    // Close the upload popup
    // const uploadPopup = document.getElementById('upload-popup');
    // uploadPopup.style.display = 'none';
    setUpload(false);
  };

  const handleRuleSelect = (rule) => {
    const isSelected = selectedRules.some((selectedRule) => selectedRule['Rule ID'] === rule['Rule ID']);

    if (isSelected) {
      const updatedSelectedRules = selectedRules.filter((selectedRule) => selectedRule['Rule ID'] !== rule['Rule ID']);
      setSelectedRules(updatedSelectedRules);
    } else {
      setSelectedRules([...selectedRules, rule]);
    }
  };

  const handleFilterChange = (event) => {
    setFilterOption(event.target.value);
    // Apply the filter logic based on the selected filter option
  };

  // Get unique model names
  const uniqueModelNames = Array.from(new Set(rules.map((rule) => rule['Model Name'])));

  // Filter the rules based on the selected filter option
  const filteredRules = filterOption === 'All' ? rules : rules.filter((rule) => rule['Model Name'] === filterOption);

  return (
    <div>
      <label htmlFor="filter">Filter by Model:</label>
      <select id="filter" value={filterOption} onChange={handleFilterChange}>
        <option value="All">All</option>
        {uniqueModelNames.map((modelName) => (
          <option key={modelName} value={modelName}>{modelName}</option>
        ))}
      </select>
      <button className="upload" onClick={handleUploadImages}>Upload Images</button>
      <br /><br />
      <table className="rulestable">
        <thead>
          <tr>
            <th>Select</th>
            <th>Model Name</th>
            <th>Rule Name</th>
            <th>Rule Creation Date</th>
            <th>Rule Description</th>
          </tr>
        </thead>
        <tbody>
          {filteredRules.map((rule, index) => (
            <tr key={index}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRules.some((selectedRule) => selectedRule['Rule ID'] === rule['Rule ID'])}
                  onChange={() => handleRuleSelect(rule)}
                />
              </td>
              <td>{rule['Model Name']}</td>
              <td>{rule['Rule Name']}</td>
              <td>{rule['Rule Creation Date']}</td>
              <td>
                <button onClick={() => handleViewDescription(rule['Rule Description'])}>View Description</button>
              </td>
            </tr>
          )).reverse()}
        </tbody>
      </table>

      {showDescription && (
        <div className="popup">
          <div className="popup-content">
            <h3>Description</h3>
            <table className="rulestable">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Detection</th>
                  <th>Label</th>
                </tr>
              </thead>
              <tbody>
                {descriptionData.map((description, index) => (
                  <tr key={index}>
                    <td>{description.category}</td>
                    <td>{description.detection}</td>
                    <td>{description.label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => setShowDescription(false)}>Close</button>
          </div>
        </div>
      )}
      {showUpload && (
        <div id="upload-popup" className="popup">
        <div className="popup-content">
          <h3>Upload Images</h3>
          <input type="file" multiple onChange={handleImageSelect} />
          <p>Selected Images: {selectedImages.length}</p>
          <button onClick={handleDeploy}>Deploy</button>
          <button onClick={handleClosePopup}>Close</button>
        </div>
      </div>
      )}
    </div>
  );
};

export default TableComponent;

