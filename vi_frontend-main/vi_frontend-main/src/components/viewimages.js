import React, { useState, useEffect } from 'react';
import './viewimages.css'; 
import { BASE_URL } from './config';
import { useParams } from 'react-router-dom';

const ImageViewGrid = ({ token }) => {
  const [images, setImages] = useState([]);
  const { requestID } = useParams();

  const fetchImages = async () => {
    try {
      const response = await fetch(BASE_URL + '/getImageThumbnailsByRequestID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify({
          requestID: requestID,
        }),
      });
      console.log(requestID);
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

  useEffect(() => {
    fetchImages();
  }, [token, requestID]);

  return (
    <div className="image-grid">
      {images.map((image) => (
       <img src={`data:image/jpeg;base64,${image.imageThumbnail}`} alt={`Image ${image.imageID}`} />
      ))}
    </div>
  );
};

export default ImageViewGrid;
