let fs = require('fs');
const path = require('path');

var pageIntelliHealth = {

    //PatientDashboard
    patientNameHeaders: by.css('.list-item-header div span'),
    tabDemographics: by.css('app-patient-details .nav-tabs [href="#tab_1-1"]'),
    tabMedications: by.css('app-patient-details .nav-tabs [href="#tab_2-2"]'),
    tabNotes: by.css('app-patient-details .nav-tabs [href="#tab_3-3"]'),
    tabMedicalConditions: by.css('app-patient-details .nav-tabs [href="#tab_4-4"]'),
    //patientNameHeaders: by.css('span.hidden-xs'),
    
    linkMedications: by.linkText('Medications'),

    //MedicationTab
    labelMedicationChartHeader: by.css(".highcharts-container text.highcharts-title"),
    inputMedicaitonName: by.css("td #inputName_1"),
    inputForm: by.css("td #inputForm_1"),
    inputDosage: by.css("td #inputDosage_1"),
    inputMode: by.css("td #inputMode_1"),
    inputFrequency: by.css("td #inputFrequency_1"),
    inputDuration: by.css("td #inputDuration_1"),
    btnNewMedication: by.css("#btnnewmedication"),
    btnAddNewMedication: by.css("#addnewmedication"),
    btnSubmit: by.css("#savemedication"),

    variable: "dummy",

    /**
     * Constructor for readTestDataObjectFile : read json file into memory
     * @param  {string}   file  :   filename of json file to parse
     * @param  {Function} callback 
     * @return {object}   jsonData :   parsed json file contents
     */
    readTestDataObjectFile: function(file, callback) {
        console.log("Reading file from readTestDataObjectFile : " + file);
        fs.readFile(file, 'utf8', function(err, data) {
            if (err) throw err;
            if (data.length <= 0) throw err;
            let jsonData = JSON.parse(data);

            /*for (let i = 0; i < jsonData.length; ++i) {
                if (jsonData[i].alias != -1) {
                    console.log("readTestDataObjectFile: Alias : " + jsonData[i].alias);
                } else {
                    //do nothing 
                    //// console.log('No Alias Found');
                }
            }*/
            callback(jsonData);
        });
    },

    /**
     * Constructor: getObjectByAttribute
     * @param  {string} attributeName : attribute name that will be searched
     * @param  {string} attributeValue : attribute value that will be searched
     * @param  {string} arrayName : the array to search through
     * @return {object} arrayName[i] : the array record that contains the name and string value we are looking for
     */
    getObjectByAttribute: function(attributeName, attributeValue, arrayName) {
        //console.error(arrayName);
        for (let i = 0; i < arrayName.length; i++) {
            if (arrayName[i][attributeName] === attributeValue) {
                return arrayName[i];
            }
        }
    }

}

module.exports = pageIntelliHealth;
