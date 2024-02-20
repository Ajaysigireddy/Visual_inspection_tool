import React from 'react';
import ReactDOM from 'react-dom';
import './homepage.css';
import CanvasJSReact from '@canvasjs/react-charts';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Grid = () => {
  const barGraphOptions = {
    title: {
    //   text: "Bar Graph"
    },
    height: 260,
    data: [
      {
        type: "column",
        dataPoints: [
          { label: "Data Point 1", y: 10 },
          { label: "Data Point 2", y: 15 },
          { label: "Data Point 3", y: 25 },
          { label: "Data Point 4", y: 30 },
          { label: "Data Point 5", y: 28 }
        ]
      }
    ]
  };

  const pieGraphOptions = {
    title: {
    //   text: "Pie Graph"
    },
    height: 260,
    data: [
      {
        type: "pie",
        startAngle: 75,
        toolTipContent: "<b>{label}</b>: {y}%",
        showInLegend: true,
        legendText: "{label}",
        indexLabelFontSize: 16,
        indexLabel: "{label} - {y}%",
        dataPoints: [
          { y: 18, label: "Data Point 1" },
          { y: 49, label: "Data Point 2" },
          { y: 9, label: "Data Point 3" },
          { y: 5, label: "Data Point 4" },
          { y: 19, label: "Data Point 5" }
        ]
      }
    ]
  };

  return (
    <div className="parent">
      <div className="div1">
        <h2>Model Training Data</h2>
        <p>No Data Available</p>
      </div>
      <div className="div2">
        <h2>Visual Inspection Run</h2>
        <p>No Data Available</p>
      </div>
      <div className="div3">
        <div className="chart-container">
          <CanvasJSChart options={barGraphOptions} />
        </div>
      </div>
      <div className="div4">
        <div className="chart-container">
          <CanvasJSChart options={pieGraphOptions} />
        </div>
      </div>
      <div className="div5">
        <div className="chart-container">
          <CanvasJSChart options={pieGraphOptions} />
        </div>
      </div>
    </div>
  );
};

export default Grid;



