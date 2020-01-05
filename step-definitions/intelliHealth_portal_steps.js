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
     * This step navigates to intelli health portal patient list page
     * @param  {[type]} callback) {                   helpers.loadPage('https:            driver.wait(until.elementsLocated(pageIntelliHealth.patientRows), longWait).then(function(){                callback();            });        });    } [description]
     * @return {[type]}           [description]
     */
    this.When(/^I navigate to intelli health portal$/, function (callback) {
        helpers.loadPage('https://patientengweb.azurewebsites.net/patients', 20).then(function() {
            driver.wait(until.elementsLocated(pageIntelliHealth.patientRows), longWait).then(function(){
                callback();
            });
        });
    });

    /**
     *  This step selects given patient
     * @param  {string} patientAlias patient alias
     */
    this.When(/^I selected the patient: (.*)$/, function (patientAlias, callback) {
        let subjectName;
        let subjectIndex;
        let elementArray;
        driver.sleep(5000);
        utilities.readTestDataObjectFile(dataFileFullPath, function(dataObjects){
            let aliasInfo = utilities.getObjectByAttribute('alias', patientAlias, dataObjects);
            //console.log("aliasInfo: " + aliasInfo.userFName);
            subjectName = aliasInfo.userLName + " " + aliasInfo.userFName; 
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
                console.log("clicked on the patient:" + subjectName);
                driver.sleep(5000);
            }).then(function(){
                driver.wait(until.elementsLocated(pageIntelliHealth.labelPatientName), longWait).then(function(){
                    driver.findElement(pageIntelliHealth.tabDemographics).getText().then(function(tabText){
                        console.log("tabText: " + tabText);
                        assert(tabText === "Demographics", "Fail: expected text: Demographics not matched with actual : " + tabText);
                        callback();
                    });    
                });
            });
        });
    });

    /**
     * This step navigates to medications tab of a patient
     * @param  {string} tabName   tab name (Ex: medications)
     */
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
            driver.sleep(2000);
            driver.wait(until.elementsLocated(pageIntelliHealth.labelMedicationChartHeader), longWait).then(function(){
                driver.findElement(pageIntelliHealth.labelMedicationChartHeader).getText().then(function(chartText){
                    console.log("chartText: " + chartText);
                    assert(chartText === "Medication Chart", "Fail: expected text: Medication Chart not matched with actual : " + chartText);
                    callback();
                });    
            });
        }); 
    });

    /**
     * This step adds medication for given patient
     * @param  {string} medicaitonAlias medication alias (From subjectData.json)
     * @param  {string} patientAlias    patient alias
     */
    this.Then(/^I added medications: (.*) for the patient: (.*)$/, function (medicaitonAlias, patientAlias, callback) {
        driver.wait(until.elementsLocated(pageIntelliHealth.labelMedicationChartHeader), longWait).then(function(){
            driver.wait(until.elementsLocated(pageIntelliHealth.btnNewMedication), longWait).then(function(){

                //driver.sleep(10000);
                //let dataFileDir = './data/';
                //let dataFileFullPath = (dataFileDir + 'subjectData.json');
                //console.log("dataFileFullPath : " + dataFileFullPath);

                utilities.readTestDataObjectFile(dataFileFullPath, function(dataObjects){
                    //console.log("dataObject1: " + dataObjects);
                    let aliasInfo = utilities.getObjectByAttribute('alias', patientAlias, dataObjects);
                    //console.log("aliasInfo: " + aliasInfo.userFName);
                    subjectName = aliasInfo.userLName + " " + aliasInfo.userFName;
                    console.log("subjectName: " + subjectName);
                    let medAliasInfo = utilities.getObjectByAttribute('alias', medicaitonAlias, aliasInfo.medications);
                    console.log("aliasInfo2: " + medAliasInfo.medicationName);

                    driver.findElement(pageIntelliHealth.btnNewMedication).click().then(function(){
                        driver.sleep(2000);
                        driver.wait(until.elementsLocated(pageIntelliHealth.btnAddNewMedication), longWait).then(function(){
                            driver.findElement(pageIntelliHealth.btnAddNewMedication).click();
                            driver.sleep(2000);
                            driver.wait(until.elementsLocated(pageIntelliHealth.inputMedicaitonName), longWait).then(function(){
                                driver.findElements(pageIntelliHealth.inputMedicaitonName).then(function(elements){
                                    elements[0].sendKeys(medAliasInfo.medicationName);
                                }).then(function(){
                                    driver.findElements(pageIntelliHealth.inputForm).then(function(elements){
                                        elements[0].sendKeys(medAliasInfo.form);
                                    });
                                }).then(function(){
                                    driver.findElements(pageIntelliHealth.inputDosage).then(function(elements){
                                        elements[0].sendKeys(medAliasInfo.dosage);
                                    });
                                }).then(function(){
                                    driver.findElements(pageIntelliHealth.inputMode).then(function(elements){
                                        elements[0].sendKeys(medAliasInfo.mode);
                                    });
                                }).then(function(){
                                    driver.findElements(pageIntelliHealth.inputFrequency).then(function(elements){
                                        elements[0].sendKeys(medAliasInfo.frequency);
                                    });
                                }).then(function(){
                                    driver.findElements(pageIntelliHealth.inputDuration).then(function(elements){
                                        elements[0].click();
                                        elements[0].clear();
                                        elements[0].sendKeys(medAliasInfo.duration);
                                    });
                                });
                            }).then(function(){
                                driver.sleep(2000);
                                driver.findElements(pageIntelliHealth.btnSubmit).then(function(elements){
                                    elements[0].click();
                                    console.log("Medication added successfully");
                                    driver.sleep(2000);
                                    driver.wait(until.elementsLocated(pageIntelliHealth.deviceTable)).then(function(){
                                        callback();
                                    });
                                }); 
                            });
                        });
                    });
                });
            });
        });
    });
}; 
