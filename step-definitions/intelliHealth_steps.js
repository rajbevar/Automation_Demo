var pageIntelliHealth = require("../page-objects/pageIntelliHealth.js");
console.log("variable name:" + pageIntelliHealth.variable)

module.exports = function () {
    this.When(/^I navigate to intelli health portal$/, function (callback) {
        //https://patientengweb.azurewebsites.net/patients/patientsummary/2654160
        helpers.loadPage('https://patientengweb.azurewebsites.net/patients', 20).then(function() {
            driver.sleep(15000);
            callback();
            // use a method on the page object which also returns a promise
            //return page.googleSearch.preformSearch(searchQuery);
        });
    });

    this.When(/^I selected the patient$/, function (callback) {
        //var elements =  page.pageIntelliHealth.linkMedications;
        //var elements = page.googleSearch.patientNameHeaders;
        //pageIntelliHealth.linkMedications.click();
        var elements = driver.findElements(pageIntelliHealth.patientNameHeaders);
        //elements.count().then(function(count){
        //    console.log("length:" + count);
        //})
        
        
        elements.get(0).click()
        //elements.click()
        //driver.findElement(pageIntelliHealth.linkMedications).click();
        
        //page.googleSearch.linkMedications.click();
        driver.sleep(5000);
        callback();
        //driver.wait(until.elementsLocated(page.googleSearch.linkMedications), 20000).then(function(){
        //    callback();
        //});
    });
}; 
