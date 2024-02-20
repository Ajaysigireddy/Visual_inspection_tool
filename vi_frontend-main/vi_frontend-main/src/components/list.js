import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './list.css';
import { BASE_URL } from './config.js';
import { useParams } from 'react-router-dom';

const ImageList = () => {
  const [imageData, setImageData] = useState([]);
  const { requestID } = useParams();
  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate();
  const [label, setLabel] = useState('');
  const token = localStorage.getItem('token');


  useEffect(() => {
    fetchImageData();
  }, []);

  const fetchImageData = async () => {
    try {
      const response = await fetch(BASE_URL + '/getImagesUploadDetailsByUsername', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify({
          user: localStorage.getItem('userEmail')
          // user: 'null'
        })
      });
      console.log(response.status);
      const data = await response.json();
      
      if (response.status === 401) {
        // Token is missing or invalid, show the error message
        alert(data.message);
        // Redirect to '/login'
        window.location.href = '/login';
        return; // Stop further execution
      }

      console.log('Image data fetched successfully:', data);
      setImageData(data.reverse());
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewClick = (requestID) => {
    // Handle view button click for the corresponding request ID
    navigate(`/viewimages/${requestID}`);
  };

  const handleAnnotateClick = (requestID) => {
    // Handle annotate button click for the corresponding request ID
    navigate(`/imageannotation/${requestID}`);
  };

  const handleDeleteClick = (requestID) => {
    // Handle delete button click for the corresponding request ID
    // ...
  };

  const handleSelectRow = (requestID) => {
    const selectedRowSet = new Set(selectedRows);
    if (selectedRowSet.has(requestID)) {
      selectedRowSet.delete(requestID);
    } else {
      selectedRowSet.add(requestID);
    }
    setSelectedRows([...selectedRowSet]);
  };

  const handleTrainModelClick = async () => {
    const unannotatedImages = imageData.filter(
      (image) => selectedRows.includes(image.requestID) && image['Total Unannotated Image'] > 0
    );
  
    if (unannotatedImages.length > 0) {
      const confirmMsg =
        'Some of the selected rows have unannotated images. Are you sure you want to continue?';
  
      if (!window.confirm(confirmMsg)) {
        return;
      }
    }
  
    const selectedImages = imageData.filter((image) => selectedRows.includes(image.requestID));
    const labelInput = window.prompt('Enter the label:');
    if (labelInput) {
      setLabel(labelInput);
  
      try {
        const response = await fetch(BASE_URL + '/trainModelRequest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
          },
          body: JSON.stringify({
            modelName: labelInput,
            imageDatasetID: selectedImages.map((image) => image.requestID),
          }),
        });
        console.log(await response.text());

        const data = await response.json();
        if (response.status === 401) {
          // Token is missing or invalid, show the error message
          alert(data.message);
          // Redirect to '/login'
          window.location.href = '/login';
          return; // Stop further execution
        }
  
        if (response.ok) {
          alert('Model training request sent successfully!');
        } else {
          const data = await response.json();
          alert(`Failed to send model training request: ${data.message}`);
        }
      } catch (error) {
        console.error(error);
        alert('An error occurred while sending the model training request.');
      }
    }
  };
  


  return (
    <div className="ImageList">
      <button className="train-model-button" onClick={handleTrainModelClick}>
        Train Model
      </button>
      <table className='list'>
        <thead>
          <tr>
            <th>Select</th>
            <th>Upload Day Date Time</th>
            <th>Label</th>
            <th>Total Images</th>
            <th>Total Annotated Images</th>
            <th>Total Unannotated Images</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {imageData.map((image) => (
            <tr key={image.requestID}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(image.requestID)}
                  onChange={() => handleSelectRow(image.requestID)}
                />
              </td>
              <td>{image['Upload DateTime']}</td>
              <td>{image.Label}</td>
              <td>{image['Total Images']}</td>
              <td>{image['Total Annotated Image']}</td>
              <td>{image['Total Unannotated Image']}</td>
              <td>{image.Status}</td>
              <td>
                <button className="view-button" onClick={() => handleViewClick(image.requestID)}>
                  View
                </button>
                &nbsp;&nbsp;
                <button
                  className="annotate-button"
                  onClick={() => handleAnnotateClick(image.requestID)}
                >
                  Annotate
                </button>
                {/* <button
                  className="delete-button"
                  onClick={() => handleDeleteClick(image.requestID)}
                >
                  Delete
                </button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ImageList;
