const pageIntelliHealth = require("../page-objects/pageIntelliHealth.js");
const utilities = require("../utilities.js");
const needle = require('needle');
const longWait = 20000;
const wdio = require("webdriverio");
const assert = require("assert");
const dataFileDir = './data/';
const dataFileFullPath = (dataFileDir + 'subjectData.json');


module.exports = function () {
    
    /**
     * This step creates given patient 
     * @param  {string} role          user role
     * @param  {string} patientAlias  patient alias (from subjectData.json)
     * @param  {string} create        create patient(Ex: true/false)
     */
    this.Given(/^the following (.*) user exists with alias : (.*) else create: (.*)$/, function (role, patientAlias, create, callback) {
        let apiEndpoint = "https://patientengtranscriptionapithirdparty.azurewebsites.net/api/Patient";
        var options = {
            json: true
        };

        utilities.readTestDataObjectFile(dataFileFullPath, function(dataObjects){
            let aliasInfo = utilities.getObjectByAttribute('alias', patientAlias, dataObjects);
            subjectName = aliasInfo.userLName + " " + aliasInfo.userFName;
            console.log("subjectName: " + subjectName);
            if(create.toUpperCase().trim() === "TRUE"){
                needle.post(apiEndpoint, {
                    firstname: aliasInfo.userFName,
                    lastname: aliasInfo.userLName,
                    dateOfBirth: aliasInfo.dateOfBirth,
                    email: aliasInfo.userEmail,
                    gender: aliasInfo.gender,
                    phoneNumber: aliasInfo.phoneNumber,
                    externalId: aliasInfo.externalId,
                    isDeleted: aliasInfo.isDeleted
                },options, function(err, resp, body) {
                    console.log("resp.statusCode: " + resp.statusCode);
                    if ((resp.statusCode) === 200) {
                        console.log('Patient created successfull');
                        callback();
                    } else {
                        console.log('Unknown response at: ' + apiEndpoint);
                        console.log(resp);
                        assert(resp.statusCode !== 200, "Fail: expected status code: 200 not matched with actual : " + resp.statusCode);
                        callback();
                    }
                });
            }
        });
    });
}; 
