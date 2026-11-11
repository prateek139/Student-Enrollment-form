/* 
 * JsonPowerDB commons helper library
 * Copyright (c) Login2Xplore
 */

function createPUTRequest(connToken, jsonObj, dbName, relName) {
    var putRequest = "{\n"
            + "\"token\" : \""
            + connToken
            + "\","
            + "\"dbName\": \""
            + dbName
            + "\",\n"
            + "\"cmd\" : \"PUT\",\n"
            + "\"rel\" : \""
            + relName + "\","
            + "\"jsonStr\": \n"
            + jsonObj
            + "\n"
            + "}";
    return putRequest;
}

function createUPDATERecordRequest(token, jsonObj, dbName, relName, reqId) {
    var req = "{\n"
            + "\"token\" : \""
            + token
            + "\","
            + "\"dbName\": \""
            + dbName
            + "\",\n"
            + "\"cmd\" : \"UPDATE\",\n"
            + "\"rel\" : \""
            + relName
            + "\",\n"
            + "\"jsonStr\":{ \""
            + reqId
            + "\":\n"
            + jsonObj
            + "\n"
            + "}}";
    return req;
}

function createGET_BY_KEYRequest(token, dbname, relationName, jsonObjStr, createTime, updateTime) {
    if (createTime === undefined) {
        createTime = false;
    }
    if (updateTime === undefined) {
        updateTime = false;
    }
    var value1 = "{\n"
            + "\"token\" : \""
            + token
            + "\",\n"
            + "\"cmd\" : \"GET_BY_KEY\",\n"
            + "\"dbName\": \""
            + dbname
            + "\",\n"
            + "\"rel\" : \""
            + relationName
            + "\",\n"
            + "\"jsonStr\":\n"
            + jsonObjStr
            + ",\n"
            + "\"createTime\":"
            + createTime
            + ",\n"
            + "\"updateTime\":"
            + updateTime
            + "\n"
            + "}";
    return value1;
}

function executeCommandAtGivenBaseUrl(reqString, dbBaseUrl, apiEndPointUrl) {
    var url = dbBaseUrl + apiEndPointUrl;
    var jsonObj;
    $.ajax({
        url: url,
        type: "POST",
        data: reqString,
        async: false,
        success: function (result) {
            try {
                jsonObj = typeof result === "object" ? result : JSON.parse(result);
            } catch (e) {
                jsonObj = result;
            }
        },
        error: function (result) {
            try {
                jsonObj = JSON.parse(result.responseText);
            } catch (e) {
                jsonObj = result;
            }
        }
    });
    return jsonObj;
}
