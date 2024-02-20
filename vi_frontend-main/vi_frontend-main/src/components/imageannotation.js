import React, { useState, useEffect } from 'react';
import './imageannotation.css';
import { useParams } from 'react-router-dom';
import AnnotateImage from './annotate';
import { BASE_URL } from './config.js';


const ImageAnnotation = () => {
  const { requestID } = useParams();
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [filterOption, setFilterOption] = useState('all');
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch images from API
    fetchImages();
  }, [requestID]);

  const fetchImages = async () => {
    try {
      const response = await fetch(BASE_URL+ '/getImageThumbnailsByRequestID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify({
          requestID: requestID
        })
      });
      console.log(requestID)
      const data = await response.json();
      
      console.log(data);
      if (response.status === 401) {
        // Token is missing or invalid, show the error message
        alert(data.message);
        // Redirect to '/login'
        window.location.href = '/login';
        return; // Stop further execution
      }

      setImages(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageClick = async (image) => {
    try {
      const response = await fetch(BASE_URL+ '/getImageByImageID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify({
          imageID: image.imageID
        })
      });
      console.log(image.imageID);
      const data = await response.json();

      if (response.status === 401) {
        // Token is missing or invalid, show the error message
        alert(data.message);
        // Redirect to '/login'
        window.location.href = '/login';
        return; // Stop further execution
      }

      setSelectedImage(data);
      
      // Update annotations for annotated images
      if (data.annotationStatus === 'Annotated') {
        console.log('Fetched Annotations:', data.annotations[0][0]); // Check the fetched annotations
        const fetchedAnnotations = data.annotations[0][0]; // Extract the inner array
        setAnnotations(fetchedAnnotations);
        console.log(annotations);
        console.log('Updated Annotations:', fetchedAnnotations); // Check the updated state
      } else {
        setAnnotations([]);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleDoneClick = async () => {
    console.log(annotations);
    if (annotations.length === 0) {
        alert('Please add annotations before submitting.');
        return;
    }
    const hasUndefinedLabels = annotations.some(a => a.comment === undefined);
    if (hasUndefinedLabels) {
      alert('Please add all labels before submitting.');
    } else {
      // Perform logic to save selected labels for the selected image
      console.log('Annotations:', annotations);
  
      const requestBody = {
        imageID: selectedImage.imageID,
        annotations: [annotations] // Wrap annotations in an array
      };
  
      try {
        const response = await fetch(BASE_URL+ '/setAnnotations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
          },
          body: JSON.stringify(requestBody)
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
          console.log('Annotations sent successfully!');
          // Update the image status to 'Annotated' in the local state
          if (selectedImage) {
            const updatedImages = images.map(image =>
              image.imageID === selectedImage.imageID ? { ...image, status: 'Annotated' } : image
            );
            setImages(updatedImages);
            // // Reload the page
            // window.location.reload();
          }
        } else {
          console.error('Failed to send annotations:', response.statusText);
        }
      } catch (error) {
        console.error('Failed to send annotations:', error);
      }
    }
  };
  

  // const handleResetClick = () => {
  //   setAnnotations([]);
  // };

  const handleResetClick = () => {
    setAnnotations([]);
    if (selectedImage) {
      const updatedImages = images.map(image =>
        image.imageID === selectedImage.imageID ? { ...image, status: 'Unannotated' } : image
      );
      setImages(updatedImages);
    }
  };
  

  const handleAnnotationChange = (updatedAnnotations) => {
    setAnnotations(updatedAnnotations);
  };

  const handleFilterChange = (option) => {
    setFilterOption(option);
  };

  const filteredImages = filterOption === 'all' ? images : images.filter((image) => image.status === filterOption);

  return (
    <div className="image-annotation-container">
      <div className="image-filter">
        <select value={filterOption} onChange={(e) => handleFilterChange(e.target.value)}>
          <option value="all">All</option>
          <option value="Unannotated">Unannotated</option>
          <option value="Annotated">Annotated</option>
        </select>
      </div>
      <div className="image-list">
        <br></br>
        {filteredImages.map((image) => (
          <div
            key={image.imageID}
            className={`image-thumbnail ${selectedImage && selectedImage.imageID === image.imageID ? 'selected' : ''}`}
            onClick={() => handleImageClick(image)}
          >
            <img src={`data:image/jpeg;base64,${image.imageThumbnail}`} alt={`Image ${image.imageID}`} />
            {image.status === 'Unannotated' ? (
              <div className="button-circle red"></div>
            ) : (
              <div className="button-circle green"></div>
            )}
          </div>
        ))}
      </div>
      <div className="annotation-section">
        {selectedImage && (
          <div className="selected-image">
          {/* <div className="box">
          </div> */}

            <AnnotateImage
              image={`data:image/jpeg;base64,${selectedImage.base64Image}`}
              annotations={annotations}
              onChangeAnnotations={handleAnnotationChange}
              className="annotation-image"
            />
          </div>
        )}

        <div className="label-section">
          <h3>Labels</h3>
          {annotations.map((annotation) => (
            <div key={annotation.id}>
              <span>{annotation.comment}</span>
            </div>
          ))}
        </div>
           
        <div className="button-section">
          <button className="done-button" onClick={handleDoneClick}>
            Done
          </button>
          <button className="reset-button" onClick={handleResetClick}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageAnnotation;
