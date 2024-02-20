// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();


// import React from 'react';
// import ReactDOM from 'react-dom';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Login from './components/Login';
// import Register from './components/Register';
// import AnnotateImage from "./components/annotate";
// import UploadImages from "./components/upload";
// import ImageAnnotation from "./components/imageannotation";
// import ImageTable from "./components/list";

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/annotate" element={<AnnotateImage />} />
//         <Route path="/upload" element={<UploadImages />} />
//         <Route path="/imageannotation/:requestID" element={<ImageAnnotation />} />  
//         <Route path="/list" element={<ImageTable />} />
//       </Routes>
//     </Router>
//   );
// };

// ReactDOM.render(<App />, document.getElementById('root'));


// import React from 'react';
// import ReactDOM from 'react-dom';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Login from './components/Login';
// import Register from './components/Register';
// import AnnotateImage from "./components/annotate";
// import UploadImages from "./components/upload";
// import ImageAnnotation from "./components/imageannotation";
// import ImageTable from "./components/list";
// import ModelsTable from './components/modellist';
// import RuleCreationPage from "./components/createrule";
// import Layout from './components/Layout';
// import TableComponent from './components/viewrules';
// import DeploymentTable from './components/viewdeploy';

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Layout />}>
//           <Route path="login" element={<Login />} />
//           <Route path="register" element={<Register />} />
//           <Route path="annotate" element={<AnnotateImage />} />
//           <Route path="upload" element={<UploadImages />} />
//           <Route path="imageannotation/:requestID" element={<ImageAnnotation />} />
//           <Route path="dataset">
//             <Route path="view" element={<ImageTable />} />
//             <Route path="upload" element={<UploadImages />} />
//           </Route>
//           <Route path="model">
//             <Route path="view" element={<ModelsTable />} />
//             <Route path="train" element={<ImageTable />} />
//           </Route>
//           <Route path="rules">
//             <Route path="create" element={<RuleCreationPage />} />
//             <Route path="view" element={<TableComponent />} />
//           </Route>
//           <Route path="deploy" element={<DeploymentTable />} />
//         </Route>
//       </Routes>
//     </Router>
//   );
// };

// ReactDOM.render(<App />, document.getElementById('root'));


import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import UploadImages from "./components/upload";
import ImageAnnotation from "./components/imageannotation";
import ImageTable from "./components/list";
import ModelsTable from './components/modellist';
import RuleCreationPage from "./components/createrule";
import Layout from './components/Layout';
import Layoutbase from './components/Layoutbase';
import TableComponent from './components/viewrules';
import DeploymentTable from './components/viewdeploy';
import PrivateRoutes from './components/PrivateRoutes';
import Grid from './components/homepage';
import ImageViewGrid from './components/viewimages';
const token = localStorage.getItem('token');
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layoutbase />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="/" element={<Layout />}>
        <Route element={<PrivateRoutes />}>
          <Route path="home" element={<Grid/>}/>
          <Route path="imageannotation/:requestID" element={<ImageAnnotation />} />
          <Route path="viewimages/:requestID" element={<ImageViewGrid token={token} />} />
          <Route path="dataset">
            <Route path="view" element={<ImageTable />} />
            <Route path="upload" element={<UploadImages />} />
          </Route>
          <Route path="model">
            <Route path="view" element={<ModelsTable />} />
            <Route path="train" element={<ImageTable />} />
          </Route>
          <Route path="rules">
            <Route path="create" element={<RuleCreationPage />} />
            <Route path="view" element={<TableComponent />} />
          </Route>
          <Route path="deploy" element={<DeploymentTable />} />
        </Route>
        </Route>
      </Routes>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));






