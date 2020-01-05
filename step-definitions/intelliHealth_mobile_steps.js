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
     * This step verifies added medication from portal, displayed in mobile app for specific patient
     * @param  {string} patientAlias patient alias
     */
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
