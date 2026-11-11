/* 
 * Student Enrollment Form - JsonPowerDB Interactive Web App
 * Designed for Apache NetBeans IDE & Login2Xplore JPDB Micro Project
 */

// JsonPowerDB Configuration
var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var dbName = "SCHOOL-DB";
var relName = "STUDENT-TABLE";
var defaultConnToken = "90933129|-31949221379430331|90951165";

// Retrieve active token (from input if entered by user, else default)
function getToken() {
    var userToken = $("#connTokenInput").val();
    if (userToken && userToken.trim() !== "") {
        return userToken.trim();
    }
    return defaultConnToken;
}

// Display helper status alert on UI
function showStatus(message, type) {
    var statusDiv = $("#statusMsg");
    statusDiv.removeClass("d-none alert-info alert-success alert-warning alert-danger");
    statusDiv.addClass("alert-" + (type || "info"));
    statusDiv.html(message);
}

// Helper to enable non-primary fields
function enableOtherFields() {
    $("#fullName").prop("disabled", false);
    $("#class").prop("disabled", false);
    $("#birthDate").prop("disabled", false);
    $("#address").prop("disabled", false);
    $("#enrollmentDate").prop("disabled", false);
}

// Helper to disable non-primary fields
function disableOtherFields() {
    $("#fullName").prop("disabled", true);
    $("#class").prop("disabled", true);
    $("#birthDate").prop("disabled", true);
    $("#address").prop("disabled", true);
    $("#enrollmentDate").prop("disabled", true);
}

// Save record number to localStorage
function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

// Format primary key Roll-No into JSON
function getRollNoAsJsonObj() {
    var rollNo = $("#rollNo").val().trim();
    var jsonStr = {
        "Roll-No": rollNo
    };
    return JSON.stringify(jsonStr);
}

// Populate form fields with retrieved data
function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#fullName").val(record["Full-Name"] || record.fullName || "");
    $("#class").val(record["Class"] || record.class || "");
    $("#birthDate").val(record["Birth-Date"] || record.birthDate || "");
    $("#address").val(record["Address"] || record.address || "");
    $("#enrollmentDate").val(record["Enrollment-Date"] || record.enrollmentDate || "");
}

// Reset form to Step-2 Initial State
function resetForm() {
    $("#rollNo").val("");
    $("#fullName").val("");
    $("#class").val("");
    $("#birthDate").val("");
    $("#address").val("");
    $("#enrollmentDate").val("");

    // Enable only Roll No
    $("#rollNo").prop("disabled", false);
    
    // Disable all other fields
    disableOtherFields();

    // Disable all 3 control buttons
    $("#save").prop("disabled", true);
    $("#update").prop("disabled", true);
    $("#reset").prop("disabled", true);

    // Clear local storage record number
    localStorage.removeItem("recno");

    // Focus cursor to Roll No field
    $("#rollNo").focus();
    
    showStatus("Enter Student Roll-No to check if record exists or create new.", "info");
}

// Validate form data: check for empty fields
function validateAndGetFormData() {
    var rollNo = $("#rollNo").val().trim();
    if (rollNo === "") {
        alert("Roll Number is required!");
        $("#rollNo").focus();
        return "";
    }

    var fullName = $("#fullName").val().trim();
    if (fullName === "") {
        alert("Full Name is required!");
        $("#fullName").focus();
        return "";
    }

    var studentClass = $("#class").val().trim();
    if (studentClass === "") {
        alert("Class is required!");
        $("#class").focus();
        return "";
    }

    var birthDate = $("#birthDate").val().trim();
    if (birthDate === "") {
        alert("Birth Date is required!");
        $("#birthDate").focus();
        return "";
    }

    var address = $("#address").val().trim();
    if (address === "") {
        alert("Address is required!");
        $("#address").focus();
        return "";
    }

    var enrollmentDate = $("#enrollmentDate").val().trim();
    if (enrollmentDate === "") {
        alert("Enrollment Date is required!");
        $("#enrollmentDate").focus();
        return "";
    }

    var jsonStrObj = {
        "Roll-No": rollNo,
        "Full-Name": fullName,
        "Class": studentClass,
        "Birth-Date": birthDate,
        "Address": address,
        "Enrollment-Date": enrollmentDate
    };
    return JSON.stringify(jsonStrObj);
}

// Check Roll-No against JsonPowerDB
function getStudent() {
    var rollNoVal = $("#rollNo").val().trim();
    if (rollNoVal === "") {
        return;
    }

    var rollNoJsonObj = getRollNoAsJsonObj();
    var token = getToken();
    var getRequest = createGET_BY_KEYRequest(token, dbName, relName, rollNoJsonObj);

    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});

    if (resJsonObj.status === 400) {
        // Record does NOT exist in DB: Enable [Save] and [Reset], move cursor to next field
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#update").prop("disabled", true);
        enableOtherFields();
        $("#fullName").focus();
        showStatus("Roll-No not found in database. You can fill out details and click <strong>[Save]</strong>.", "warning");
    } else if (resJsonObj.status === 200) {
        // Record EXISTS in DB: Display data, enable [Update] and [Reset], keep Roll-No disabled
        $("#rollNo").prop("disabled", true);
        fillData(resJsonObj);
        enableOtherFields();
        $("#save").prop("disabled", true);
        $("#update").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#fullName").focus();
        showStatus("Record found! Details loaded. You may edit values and click <strong>[Update]</strong>.", "success");
    } else {
        alert("Error accessing database: " + JSON.stringify(resJsonObj));
    }
}

// Save new student record
function saveData() {
    var jsonStrObj = validateAndGetFormData();
    if (jsonStrObj === "") {
        return;
    }

    var token = getToken();
    var putRequest = createPUTRequest(token, jsonStrObj, dbName, relName);

    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});

    if (resJsonObj.status === 200) {
        alert("Student Record Saved Successfully in JsonPowerDB!");
    } else {
        alert("Failed to save data: " + (resJsonObj.message || JSON.stringify(resJsonObj)));
    }
    resetForm();
}

// Update existing student record
function updateData() {
    var jsonStrObj = validateAndGetFormData();
    if (jsonStrObj === "") {
        return;
    }

    var token = getToken();
    var recNo = localStorage.getItem("recno");
    if (!recNo) {
        alert("Record number not found in session. Please re-enter Roll-No.");
        resetForm();
        return;
    }

    var updateRequest = createUPDATERecordRequest(token, jsonStrObj, dbName, relName, recNo);

    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});

    if (resJsonObj.status === 200) {
        alert("Student Record Updated Successfully in JsonPowerDB!");
    } else {
        alert("Failed to update data: " + (resJsonObj.message || JSON.stringify(resJsonObj)));
    }
    resetForm();
}

// On page load: initialize form state
$(document).ready(function () {
    resetForm();
});
