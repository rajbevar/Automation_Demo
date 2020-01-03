let pageIntelliHealth = require("../page-objects/pageIntelliHealth.js");
var needle = require('needle');
let longWait = 20000;
//var List  = require("collections/List");
console.log("variable name:" + pageIntelliHealth.variable)

module.exports = function () {
    
    this.Given(/^the following (.*) user exists with alias : (.*) else create: (.*)$/, function (role, patientAlias, create, callback) {
        let apiEndpoint = "https://patientengtranscriptionapithirdparty.azurewebsites.net/api/Patient";
        let dataFileDir = './data/';
        let dataFileFullPath = (dataFileDir + 'subjectData.json');
        console.log("dataFileFullPath : " + dataFileFullPath);

        var options = {
            json: true
        };

        pageIntelliHealth.readTestDataObjectFile(dataFileFullPath, function(dataObjects){
            let aliasInfo = pageIntelliHealth.getObjectByAttribute('alias', patientAlias, dataObjects);
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

    this.When(/^I navigate to intelli health portal$/, function (callback) {
        //https://patientengweb.azurewebsites.net/patients/patientsummary/2654160
        helpers.loadPage('https://patientengweb.azurewebsites.net/patients', 20).then(function() {
            driver.sleep(15000);
        }).then(function(){
            callback();
        });
    });

    this.When(/^I selected the patient: (.*)$/, function (patientAlias, callback) {
        let subjectName;
        let subjectIndex;
        let elementArray;
        
        driver.sleep(10000);
        let dataFileDir = './data/';
        let dataFileFullPath = (dataFileDir + 'subjectData.json');
        console.log("dataFileFullPath : " + dataFileFullPath);

        pageIntelliHealth.readTestDataObjectFile(dataFileFullPath, function(dataObjects){
            //console.log("dataObject1: " + dataObjects);
            let aliasInfo = pageIntelliHealth.getObjectByAttribute('alias', patientAlias, dataObjects);
            //console.log("aliasInfo: " + aliasInfo.userFName);
            subjectName = aliasInfo.userLName + " " + aliasInfo.userFName;
            console.log("subjectName: " + subjectName);
            //driver.sleep(5000);    
            driver.findElements(pageIntelliHealth.patientNameHeaders).then(function(elements){
                //console.log("element length: " + elements.length);
                elementArray = elements;
                elements.forEach(function(childElement, index){
                    childElement.getText().then(function(actualNames){
                        //console.log("Names: " + actualNames);
                        if(actualNames.toUpperCase().trim() === subjectName.toUpperCase().trim()){
                            console.log("Subject name matched");
                            subjectIndex = index;    
                        }
                    });
                });          
            }).then(function(){
                elementArray[parseInt(subjectIndex)].click();
                driver.sleep(15000);
            }).then(function(){
                driver.wait(until.elementsLocated(pageIntelliHealth.tabDemographics), longWait).then(function(){
                    driver.findElement(pageIntelliHealth.tabDemographics).getText().then(function(tabText){
                        console.log("tabText: " + tabText);
                        assert(tabText === "Demographics", "Fail: expected text: Demographics not matched with actual : " + tabText);
                        callback();
                    });    
                });
            });
        });
    });

    this.When(/^I selected the (.*) tab from patient dashboard$/, function (tabName, callback) {
        let tabElement;
        switch (tabName.toUpperCase()) {
            case "DEMOGRAPHICS":
                tabElement = driver.findElement(pageIntelliHealth.tabDemographics);
                break;
            case "MEDICATIONS":
                tabElement = driver.findElement(pageIntelliHealth.tabMedications);
                break;
            case "NOTES":
                tabElement = driver.findElement(pageIntelliHealth.tabNotes);
                break;
            case "MEDICAL CONDITIONS":
                tabElement = driver.findElement(pageIntelliHealth.tabMedicalConditions);
                break;
            default:
                console.log("Invalid tab name");
        }

        tabElement.click().then(function(){
            driver.sleep(15000);
            driver.wait(until.elementsLocated(pageIntelliHealth.labelMedicationChartHeader), longWait).then(function(){
                driver.findElement(pageIntelliHealth.labelMedicationChartHeader).getText().then(function(chartText){
                    console.log("chartText: " + chartText);
                    assert(chartText === "Medication Chart", "Fail: expected text: Medication Chart not matched with actual : " + chartText);
                    callback();
                });    
            });
        }); 
    });

    this.Then(/^I added medications: (.*) for the patient: (.*)$/, function (medicaitonAlias, patientAlias, callback) {
        
        driver.sleep(10000);
        let dataFileDir = './data/';
        let dataFileFullPath = (dataFileDir + 'subjectData.json');
        console.log("dataFileFullPath : " + dataFileFullPath);

        pageIntelliHealth.readTestDataObjectFile(dataFileFullPath, function(dataObjects){
            //console.log("dataObject1: " + dataObjects);
            let aliasInfo = pageIntelliHealth.getObjectByAttribute('alias', patientAlias, dataObjects);
            //console.log("aliasInfo: " + aliasInfo.userFName);
            subjectName = aliasInfo.userLName + " " + aliasInfo.userFName;
            console.log("subjectName: " + subjectName);
            let medAliasInfo = pageIntelliHealth.getObjectByAttribute('alias', medicaitonAlias, aliasInfo.medications);
            console.log("aliasInfo2: " + medAliasInfo.medicationName);

            driver.findElement(pageIntelliHealth.btnNewMedication).click().then(function(){
                driver.sleep(2000);
                driver.findElements(pageIntelliHealth.btnAddNewMedication).then(function(elements){
                    elements[1].click().then(function(){
                        driver.sleep(2000);
                        driver.findElements(pageIntelliHealth.inputMedicaitonName).then(function(elements){
                            elements[1].sendKeys(medAliasInfo.medicationName);
                        }).then(function(){
                            driver.findElements(pageIntelliHealth.inputForm).then(function(elements){
                                elements[1].sendKeys(medAliasInfo.form);
                            });
                        }).then(function(){
                            driver.findElements(pageIntelliHealth.inputDosage).then(function(elements){
                                elements[1].sendKeys(medAliasInfo.dosage);
                            });
                        }).then(function(){
                            driver.findElements(pageIntelliHealth.inputMode).then(function(elements){
                                elements[1].sendKeys(medAliasInfo.mode);
                            });
                        }).then(function(){
                            driver.findElements(pageIntelliHealth.inputFrequency).then(function(elements){
                                elements[1].sendKeys(medAliasInfo.frequency);
                            });
                        }).then(function(){
                            driver.findElements(pageIntelliHealth.inputDuration).then(function(elements){
                                elements[1].click();
                                elements[1].clear();
                                elements[1].sendKeys(medAliasInfo.duration);
                            });
                        });
                        //driver.findElement(pageIntelliHealth.inputMedicaitonName).sendKeys(medAliasInfo.medicationName);
                        //driver.findElement(pageIntelliHealth.inputForm).sendKeys(medAliasInfo.form);
                        //driver.findElement(pageIntelliHealth.inputDosage).sendKeys(medAliasInfo.dosage);
                        //driver.findElement(pageIntelliHealth.inputMode).sendKeys(medAliasInfo.mode);
                        //driver.findElement(pageIntelliHealth.inputFrequency).sendKeys(medAliasInfo.frequency);
                        //driver.findElement(pageIntelliHealth.inputDuration).sendKeys(medAliasInfo.duration);
                        driver.sleep(2000);
                    }).then(function(){
                        driver.findElements(pageIntelliHealth.btnSubmit).then(function(elements){
                            elements[1].click();
                            console.log("Medication added successfully");
                            driver.sleep(2000);
                        });
                    }).then(function(){
                        callback();
                    });
                });
            });
        });
    });

    
}; 
