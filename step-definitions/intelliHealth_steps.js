const pageIntelliHealth = require("../page-objects/pageIntelliHealth.js");
const utilities = require("../utilities.js");
const needle = require('needle');
const longWait = 20000;
const wdio = require("webdriverio");
const assert = require("assert");
const dataFileDir = './data/';
const dataFileFullPath = (dataFileDir + 'subjectData.json');


module.exports = function () {
    
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

    this.When(/^I navigate to intelli health portal$/, function (callback) {
        helpers.loadPage('https://patientengweb.azurewebsites.net/patients', 20).then(function() {
            driver.wait(until.elementsLocated(pageIntelliHealth.patientRows), longWait).then(function(){
                callback();
            });
        });
    });


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
                    let medAliasInfo = pageIntelliHealth.getObjectByAttribute('alias', medicaitonAlias, aliasInfo.medications);
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

    this.When(/^patient (.*) confirms added medication in mobile app$/, function(patientAlias, callback){
        const opts = {
          capabilities: {
            platformName: "Android",
            platformVersion: "9.0",
            deviceName: "emulator-5554",
            app: "/Users/rajani/Automation_Demo/patient_app_testing_with_api.apk",
            appPackage: "com.healthcare.bosch.patientapp",
            appActivity: ".activity.SplashActivity",
            automationName: "UiAutomator2",
            noReset: true,
            appWaitForLaunch: true
          },
          port: 4723,
          logLevel: 'info',
          host: 'localhost'
        };

        async function verifyMedInApp (patientEmail, patientPassword) {
            const client = await wdio.remote(opts);
            //client.pause(20000)
            //client.timeout(10000)
            const email_selector = 'new UiSelector().text("Email Address").resourceId("com.healthcare.bosch.patientapp:id/eTxtEmail")'
            const email = await client.$(`android=${email_selector}`)
            //const email = await client.elementsByAndroidUIAutomator(email_selector);
            email.waitForDisplayed(10000);
            //Button.click()
            console.log("wdio with remote options done")
            //console.log(client.findElement);
            //const email = await client.$("eTxtEmail");
            //let email = await client.element("id/eTxtEmail");
            //await view.click();
            //const email = await client.$("#eTxtEmail");
            //const email = await client.$("android.widget.EditText");
            //driver.sleep(5000)
            //const field = await client.$("com.healthcare.bosch.patientapp:id/fab");
            //field.waitForVisible()
            //await field.click();
            await email.setValue(patientEmail);
            const password_selector = 'new UiSelector().text("Password").resourceId("com.healthcare.bosch.patientapp:id/eTxtPassword")'
            const password = await client.$(`android=${password_selector}`) 
            password.waitForDisplayed(10000);
            await password.setValue(patientPassword);
            //const value = await email.getText();
            //assert.equal(value,"test234@demo.com");
            const go_button_selector = 'new UiSelector().resourceId("com.healthcare.bosch.patientapp:id/fab")'
            const go_button = await client.$(`android=${go_button_selector}`) 
            await go_button.click();
            //const no_data_found_selector = 'new UiSelector().text("No Data found").className("android.widget.TextView")'
            //const label_no_data_found = await client.$(`android=${no_data_found_selector}`)
            //label_no_data_found.waitForDisplayed(15000);
            //client.pause(5000)
            //const medication_selector = await client.$(`android=${no_data_found_selector}`)
            const medication_selector = 'new UiSelector().resourceId("com.healthcare.bosch.patientapp:id/txtPatientId")'
            const medication_button = await client.$(`android=${medication_selector}`);
            medication_button.waitForDisplayed(20000);
            await medication_button.click();
            const medication_img_selector = 'new UiSelector().resourceId("com.healthcare.bosch.patientapp:id/image_start")'
            const medication_img = await client.$(`android=${medication_img_selector}`);
            medication_img.waitForDisplayed(20000);
            const medication_text_selector = 'new UiSelector().resourceId("com.healthcare.bosch.patientapp:id/title")'
            const medication_text = await client.$(`android=${medication_text_selector}`);

            const value = await email.getText();
            console.log("value:" + value);
            await client.deleteSession();
            callback();  
        }
        utilities.readTestDataObjectFile(dataFileFullPath, function(dataObjects){
            let aliasInfo = utilities.getObjectByAttribute('alias', patientAlias, dataObjects);
            //console.log("aliasInfo: " + aliasInfo.userFName);
            patientEmail = aliasInfo.userEmail;
            patientPassword = aliasInfo.userPass;
            verifyMedInApp(patientEmail, patientPassword);
        });
        
    });    

}; 
