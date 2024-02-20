const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://10.2.8.173:27017/';

// Database and collection names
const dbName = 'visualInspection';
const collectionName = 'imageRecords';

// Output directory for TXT files
const outputDir = './annotations/';

// MongoDB query to fetch the annotated images
const query = {
  annotationStatus: 'Annotated',
  annotations: { $exists: true, $ne: [] }
};

// MongoDB projection to include only the necessary fields
const projection = {
  _id: 0,
  filename: 1,
  annotations: 1
};

// Function to convert annotations to YOLO format
function convertToYoloFormat(annotations) {
  // Implement the conversion logic based on your specific requirements
  // This function should take the annotations and return a string in YOLO format
  // Modify it to match your annotation structure and YOLO format specification
  // Example implementation assuming annotations is an array of objects:
  return annotations.map(annotation => {
    const { x, y, width, height } = annotation.mark;
    const label = annotation.comment;
    const imageWidth = 5000; // Replace with the actual image width
    const imageHeight = 3000; // Replace with the actual image height
    const xCenter = (x + width / 2) / imageWidth;
    const yCenter = (y + height / 2) / imageHeight;
    const relativeWidth = width / imageWidth;
    const relativeHeight = height / imageHeight;
    return `${label} ${xCenter} ${yCenter} ${relativeWidth} ${relativeHeight}`;
  }).join('\n');
}

// Connect to MongoDB and fetch the annotated images
MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }

  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  collection.find(query, { projection }).toArray((err, documents) => {
    if (err) {
      console.error('Error retrieving documents from MongoDB:', err);
      client.close();
      return;
    }

    documents.forEach(document => {
      const { filename, annotations } = document;
      const yoloAnnotations = convertToYoloFormat(annotations);

      const filePath = `${outputDir}${filename.replace('.jpg', '.txt')}`;
      fs.writeFile(filePath, yoloAnnotations, (err) => {
        if (err) {
          console.error(`Error writing annotations to file ${filePath}:`, err);
        } else {
          console.log(`Annotations for ${filename} stored in ${filePath}`);
        }
      });
    });

    client.close();
  });
});
