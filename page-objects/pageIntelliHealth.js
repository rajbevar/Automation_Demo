
var pageIntelliHealth = {

    //PatientDashboard
    patientNameHeaders: by.css('.list-item-header div span'),
    tabDemographics: by.css('app-patient-details .nav-tabs [href="#tab_1-1"]'),
    tabMedications: by.css('app-patient-details .nav-tabs [href="#tab_2-2"]'),
    tabNotes: by.css('app-patient-details .nav-tabs [href="#tab_3-3"]'),
    tabMedicalConditions: by.css('app-patient-details .nav-tabs [href="#tab_4-4"]'),
    
    linkMedications: by.linkText('Medications'),

    //MedicationTab
    labelMedicationChartHeader: by.css(".highcharts-container text.highcharts-title"),
    inputMedicaitonName: by.css("#inputName_1"),
    inputForm: by.css("#inputForm_1"),
    inputDosage: by.css("#inputDosage_1"),
    inputMode: by.css("#inputMode_1"),
    inputFrequency: by.css("#inputFrequency_1"),
    inputDuration: by.css("#inputDuration_1"),
    btnNewMedication: by.css("#btnnewmedication"),
    btnAddNewMedication: by.css("#addnewmedication"),
    btnSubmit: by.css("#savemedication"),

    labelPatientName: by.css(".info-box-number"),
    patientRows: by.css("div.row.list-item-container"),
    deviceTable: by.css(".deviceDetailsTable"),
   

}

module.exports = pageIntelliHealth;
