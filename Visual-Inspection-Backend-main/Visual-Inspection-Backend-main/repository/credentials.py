# Example usage in another file

from repository.mongoRepository import insertData, getData, updateData

# Set your data, dbName, and collectionName
data_to_insert = {"key": "value"}
dbName = "testaditya"
collectionName = "testing"

# Insert data
insertData(data_to_insert, collectionName, dbName)

# Retrieve data
data = getData({}, collectionName, dbName)
print("Retrieved data:", data)

# Update data (provide identifier and updateQuery)
identifier = {"key": "value"}
updateQuery = {"$set": {"key": "updated_value"}}
updateData(identifier, updateQuery, collectionName, dbName)
