var pageIntelliHealth = require("../page-objects/pageIntelliHealth.js");
console.log("variable name:" + pageIntelliHealth.variable)
const wdio = require("webdriverio");
const assert = require("assert");

module.exports = function () {
    this.When(/^I navigate to intelli health portal$/, function (callback) {
        //https://patientengweb.azurewebsites.net/patients/patientsummary/2654160
        helpers.loadPage('https://patientengweb.azurewebsites.net/patients/patientsummary/2654160', 20).then(function() {
            driver.sleep(15000);
            callback();
            // use a method on the page object which also returns a promise
            //return page.googleSearch.preformSearch(searchQuery);
        });
    });

    this.When(/^I selected the patient$/, function (callback) {
        var elements =  page.pageIntelliHealth.linkMedications;
        //var elements = page.googleSearch.patientNameHeaders;
        //pageIntelliHealth.linkMedications.click();
        var elements = driver.findElement(pageIntelliHealth.linkMedications);
        //elements.count().then(function(count){
        //    console.log("length:" + count);
        //})
        
        
        elements.click()
        //elements.click()
        //driver.findElement(pageIntelliHealth.linkMedications).click();
        
        //page.googleSearch.linkMedications.click();
        driver.sleep(5000);
        callback();
        //driver.wait(until.elementsLocated(page.googleSearch.linkMedications), 20000).then(function(){
        //    callback();
        //});
    });


    this.When(/^I verified mobile application$/, function(callback){
        const opts = {
          port: 4723,
          capabilities: {
            platformName: "Android",
            platformVersion: "9.0",
            deviceName: "emulator-5554",
            //app: "/Users/rajani/Downloads/ApiDemos-debug.apk",
            app: "/Users/rajani/Automation_Demo/patient_app_testing_with_api.apk",
            appPackage: "com.healthcare.bosch.patientapp",
            //appActivity: "com.healthcare.bosch.patientapp",
            //appActivity: "",
            automationName: "UiAutomator2",
            noReset: true
          }
        };

        async function main () {
            const client = await wdio.remote(opts);
            client.pause(20000)
            const email_selector = 'new UiSelector().text("Email Address").resourceId("com.healthcare.bosch.patientapp:id/eTxtEmail")'
            const email = await client.$(`android=${email_selector}`)

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
            await email.setValue("jamesj3@demo.com");
            const password_selector = 'new UiSelector().text("Password").resourceId("com.healthcare.bosch.patientapp:id/eTxtPassword")'
            const password = await client.$(`android=${password_selector}`) 
            await password.setValue("password");
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
            medication_button.waitForDisplayed(10000);
            await medication_button.click();
            const medication_img_selector = 'new UiSelector().resourceId("com.healthcare.bosch.patientapp:id/image_start")'
            const medication_img = await client.$(`android=${medication_img_selector}`);

            const medication_text_selector = 'new UiSelector().resourceId("com.healthcare.bosch.patientapp:id/title")'
            const medication_text = await client.$(`android=${medication_text_selector}`);
            const value = await email.getText();
            console.log("value:" + value);
            await client.deleteSession();
            callback();  
        }
        main();
    });

}; 
