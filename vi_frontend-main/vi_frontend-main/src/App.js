// // import logo from './logo.svg';
// import './App.css';
// import AnnotateImage from './components/annotate';


// function App() {

//   return (
    
//     <div className="App">
//       <header className="App-header">
//       <AnnotateImage imageUrl="https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcT7p48zgkqUyYDdx7AGnlWVOEh6vpc8QHHPh0mAtn_73_jD_etGCyAexD1ArARBsGl4HqZYyGjcpRJRo3A://example.com/image.jpg" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


// import React, { useState, useEffect } from 'react';
// import { ReactPictureAnnotation } from 'react-picture-annotation';


// const App = () => {
//   const [pageSize, setPageSize] = useState({
//     width: window.innerWidth,
//     height: window.innerHeight
//   });
//   const [annotations, setAnnotations] = useState([]);

//   const onResize = () => {
//     setPageSize({ width: window.innerWidth, height: window.innerHeight });
//   };

//   useEffect(() => {
//     window.addEventListener('resize', onResize);
//     return () => window.removeEventListener('resize', onResize);
//   }, []);

//   const onSelect = (selectedId) => console.log(selectedId);

//   const onChange = (data) => {
//     setAnnotations(data);
//   };

//   const handleDeleteBox = (id) => {
//     const updatedAnnotations = annotations.filter((annotation) => annotation.id !== id);
//     setAnnotations(updatedAnnotations);
//   };

//   return (
//     <div className="App">
//       <ReactPictureAnnotation
//         image="https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcT7p48zgkqUyYDdx7AGnlWVOEh6vpc8QHHPh0mAtn_73_jD_etGCyAexD1ArARBsGl4HqZYyGjcpRJRo3A" // Update the image URL
//         onSelect={onSelect}
//         onChange={onChange}
//         width={pageSize.width}
//         height={pageSize.height}
//         annotations={annotations}
//         renderAnnotation={({ annotation }) => (
//           <div style={{ position: 'absolute', left: annotation.position.x, top: annotation.position.y }}>
//             <input
//               type="text"
//               value={annotation.content}
//               onChange={(e) => {
//                 const updatedAnnotations = [...annotations];
//                 const index = updatedAnnotations.findIndex((a) => a.id === annotation.id);
//                 updatedAnnotations[index].content = e.target.value;
//                 setAnnotations(updatedAnnotations);
//               }}
//             />
//             <button onClick={() => handleDeleteBox(annotation.id)}>Delete</button>
//           </div>
//         )}
//       />
//     </div>
//   );
// };

// export default App;

// function App() {
//     const base64String = "data:image/png;base64," + "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";
    
//     return (
//       <div className="App">
//         <img src={base64String} alt="Thumbnail" />
//       </div>
//     );
//   }
  
//   export default App;

import React from 'react';
import AnnotateImage from './components/annotate';
import sampleImage from './sampleImage.jpg'; // Import the image

const App = () => {
  return (
    <div>
      <AnnotateImage image={sampleImage} />
    </div>
  );
};

export default App;