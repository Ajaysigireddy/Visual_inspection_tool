import React, { useState, useEffect } from 'react';
import { ReactPictureAnnotation } from 'react-picture-annotation';

const AnnotateImage = ({ image, annotations: initialAnnotations, onChangeAnnotations }) => {
  const [pageSize, setPageSize] = useState({
    width: 3/5*window.innerWidth ,
    height: 3.5/5*window.innerHeight
  });
  const [annotations, setAnnotations] = useState([]);
  

  useEffect(() => {
    setAnnotations(initialAnnotations);
  }, [initialAnnotations]);

  console.log('Annotations:', annotations);

  const onResize = () => {
    setPageSize({ width: window.innerWidth, height: window.innerHeight });
  };

  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const onSelect = (selectedId) => console.log(selectedId);

  // const onChange = (data) => {
  //   const updatedAnnotations = data.reduce((acc, currentAnnotation) => {
  //     const existingIndex = acc.findIndex((a) => a.id === currentAnnotation.id);
  //     if (existingIndex !== -1) {
  //       // Update existing annotation with the latest values
  //       acc[existingIndex] = currentAnnotation;
  //     } else {
  //       // Add new annotation
  //       acc.push(currentAnnotation);
  //     }
  //     return acc;
  //   }, [...annotations]);
    
  //   setAnnotations(updatedAnnotations);
  //   onChangeAnnotations(updatedAnnotations);
  // };
  
  // const handleDeleteBox = (id) => {
  //   const updatedAnnotations = annotations.filter((annotation) => annotation.id !== id);
  //   setAnnotations(updatedAnnotations);
  //   onChangeAnnotations(updatedAnnotations);
  // };

  const onChange = (data) => {
    setAnnotations(data);
    onChangeAnnotations(data);
  };

  const handleDeleteBox = (id) => {
    console.log(id);
    const updatedAnnotations = annotations.filter((annotation) => annotation.id !== id);
    setAnnotations(updatedAnnotations);
    onChangeAnnotations(updatedAnnotations);
  };

  const customShapeStyle = {
    padding: 5, // text padding
  fontSize: 12, // text font size
  fontColor: "#212529", // text font color
  fontBackground: "#f8f9fa", // text background color
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', Helvetica, Arial, sans-serif",

    lineWidth: 3,
    shapeBackground: 'hsla(210, 16%, 93%, 0.2)',
    shapeStrokeStyle: 'red', // Set the stroke color to red
    shadowBlur: 10,
    shapeShadowStyle: 'hsla(210, 9%, 31%, 0.35)',
    transformerBackground: '#5c7cfa',
    transformerSize: 10
  };
  

  return (
    <div className="AnnotateImage">
      <ReactPictureAnnotation
        image={image}
        annotationData={annotations}
        onSelect={onSelect}
        onChange={onChange}
        // width={4*pageSize.width/5}
        // height={3.8*pageSize.height/5}
        width={pageSize.width}
        height={pageSize.height}
        renderAnnotation={({ annotation }) => (
          <div style={{ position: 'absolute', left: annotation.position.x, top: annotation.position.y }}>
            <input
              type="text"
              value={annotation.comment}
              onChange={(e) => {
                const updatedAnnotations = annotations.map((a) => {
                  if (a.id === annotation.id) {
                    return { ...a, comment: e.target.value };
                  }
                  return a;
                });
                setAnnotations(updatedAnnotations);
                onChangeAnnotations(updatedAnnotations);
              }}
            />
            <button onClick={() => handleDeleteBox(annotation.id)}>Delete</button>
          </div>
        )}
        annotationStyle={customShapeStyle} 
      />
    </div>
  );
};

export default AnnotateImage;
