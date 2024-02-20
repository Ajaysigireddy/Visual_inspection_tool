import os
from datetime import datetime

from werkzeug.utils import secure_filename

from constants.mongoConstants import COLLECTION_FILE_UPLOAD_COUNTER, DB_VISUAL_INSPECTION, \
    COLLECTION_FILE_UPLOAD_REQUEST_DETAILS, COLLECTION_IMAGE_RECORDS
from constants.uploadFileConstants import INITIAL_UPLOAD_COUNTER, DATA_DIRECTORY, STATUS_FILE_UPLOADED, \
    STATUS_IMAGE_UNANNOTATED
from repository.mongoRepository import getData, updateData, insertData

def uploadTrainingDataWithoutAnnotations(data, user):
    imageList = data.files.getlist("imageFiles")
    label = data.form['label']
    uploadTask = "train"  # Specify the upload task
    requestID = getFileUploadIDCounter(uploadTask)
    saveRecord(requestID, label, user, uploadTask)
    imageFileDirectory = getFileDirectory(f"{uploadTask}Image", requestID)
    saveFileToDirectory(imageList, imageFileDirectory, requestID)
    return requestID

def getFileUploadIDCounter(uploadTask):
    default_task = 'default_task'
    # Use a default task if 'train' is not a valid key in INITIAL_UPLOAD_COUNTER
    if uploadTask not in INITIAL_UPLOAD_COUNTER:
        print(f"Warning: Using default initial counter value for uploadTask: {uploadTask}")
        uploadTask = default_task

    identifier = {'_id': uploadTask}
    data = getData(identifier, COLLECTION_FILE_UPLOAD_COUNTER, DB_VISUAL_INSPECTION)
    if len(data) == 0:
        initial_counter = INITIAL_UPLOAD_COUNTER.get(uploadTask, 0)
        fileUploadCounterData = {
            '_id': uploadTask,
            'counter': str(initial_counter)
        }
        insertData(fileUploadCounterData, COLLECTION_FILE_UPLOAD_COUNTER, DB_VISUAL_INSPECTION)
        return str(initial_counter)
    else:
        currentCounter = int(data[0]['counter'])
        nextCounter = str(currentCounter + 1)
        updatedData = {
            '$set': {
                'counter': nextCounter
            }
        }
        updateData(identifier, updatedData, COLLECTION_FILE_UPLOAD_COUNTER, DB_VISUAL_INSPECTION)
        return nextCounter



def getFileDirectory(uploadTask, requestID):
    fileDirectory = DATA_DIRECTORY.get(uploadTask, "").format(requestID)
    try:
        os.makedirs(fileDirectory)
    except:
        pass
    return fileDirectory

def saveRecord(requestID, label, user, uploadTask):
    recordDict = {
        'requestID': requestID,
        'datetime': datetime.now(),
        'label': label,
        'user': user,
        'status': STATUS_FILE_UPLOADED,
        'dataType': f"{uploadTask}Data",
        'annotations': []
    }
    collectionName = COLLECTION_FILE_UPLOAD_REQUEST_DETAILS
    insertData(recordDict, collectionName, DB_VISUAL_INSPECTION)

def saveFileToDirectory(fileList, fileDirectory, requestID):
    for i, fileElement in enumerate(fileList, start=1):
        filename = secure_filename(fileElement.filename)
        destination = os.path.join(fileDirectory, filename)
        saveFileRecordToMongo(filename, requestID, i, destination)
        fileElement.save(destination)

def saveFileRecordToMongo(filename, requestID, fileID, destination):
    fileRecordData = {
        "filename": filename,
        "requestID": requestID,
        "fileID": f"IMG_{str(requestID)}_{str(fileID)}",
        "destination": destination,
        "annotationStatus": STATUS_IMAGE_UNANNOTATED,
        "annotations": []
    }
    insertData(fileRecordData, COLLECTION_IMAGE_RECORDS, DB_VISUAL_INSPECTION)
