import pandas as pd

from constants.mongoConstants import COLLECTION_FILE_UPLOAD_REQUEST_DETAILS, DB_VISUAL_INSPECTION, COLLECTION_RULE_LIST
from repository.mongoRepository import getData

def getDetailedReportData(requestID):
    data_list = getData({"requestID": requestID}, COLLECTION_FILE_UPLOAD_REQUEST_DETAILS, DB_VISUAL_INSPECTION)

    if not data_list:
        # Handle the case where the list is empty
        return pd.DataFrame()

    report_data = pd.DataFrame(data_list[0].get("Detailed Report", []))
    return report_data

def getRulesDescription(requestID):
    data_list = getData({"requestID": requestID}, COLLECTION_FILE_UPLOAD_REQUEST_DETAILS, DB_VISUAL_INSPECTION)

    if not data_list:
        # Handle the case where the list is empty
        return pd.DataFrame()

    rule_id = data_list[0].get("rulesList", [])
    rules_description_list = pd.DataFrame(getData({"Rule ID": {"$in": rule_id}}, COLLECTION_RULE_LIST, DB_VISUAL_INSPECTION))
    
    return rules_description_list["Rule Description"]

def makeDeployedRulesReport(requestID):
    report_data = getDetailedReportData(requestID)
    print(report_data)

    rules_description_list = getRulesDescription(requestID)
    print(rules_description_list)

    rules_description_df = pd.DataFrame()

    for rules_description in rules_description_list:
        rules_description_df = pd.concat([rules_description_df, pd.DataFrame(rules_description)], ignore_index=True)

    print(rules_description_df)

    if 'category' in rules_description_df.columns:
        categories = rules_description_df["category"].unique()

        for category in categories:
            labels = rules_description_df[rules_description_df["category"] == category].reset_index()["label"].unique()
            # Process the labels for the current category
            pass
    else:
        print("Column 'category' not found in DataFrame.")

makeDeployedRulesReport("20016")
