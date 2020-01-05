/**
 * **
 * File: results_converter.js : the purpose of this set of scripts is to convert .json output to an xray compatible format
 * Read results file generated by portal bvt .json file
 * Iterate through results json and create new object to meet xray json format
 *  sample input : 20160610011442_detailed_portal_rpt.json
 *  "name": "PAT-341 : Create Site Fields",
 *  sample output from xray confluence: {
    "tests": [{
        "testKey": "DEMO-7",
        "start": "2013-05-03T11:47:35+01:00",
        "finish": "2013-05-03T11:50:56+01:00",
        "comment": "Test was OK but the performance is very poor",
        "status": "PASS"
    }, {
        "testKey": "DEMO-8",
        "start": "2013-05-03T12:14:12+01:00",
        "finish": "2013-05-03T12:15:23+01:00",
        "comment": "Performance was better this time, in the context of test set DEMO-10.",
        "status": "PASS"
    }, {
        "testKey": "DEMO-9",
        "start": "2013-05-03T12:19:23+01:00",
        "finish": "2013-05-03T12:20:01+01:00",
        "comment": "Error decreasing space shuttle speed.",
        "status": "FAIL",
        "examples": [
            "PASS",
            "PASS",
            "PASS",
            "PASS",
            "PASS",
            "FAIL"
        ]
    }]
}

Source example:
"id": "PAT-342-:-User-shall-access-Create-Site-based-on-Role",
    "name": "PAT-342 : User shall access Create Site based on Role",
    "description": "",
    "line": 1,
    "keyword": "Feature",
    "uri": "/Users/sbaribeau/proteus-portal/portal-test/features/PAT_342_site_creation_by_role.feature",
    "elements": [{
        "name": "PAT-342 : User shall access Create Site based on Role",
        "id": "PAT-342-:-User-shall-access-Create-Site-based-on-Role;pat-342-:-user-shall-access-create-site-based-on-role",
        "line": 15,
        "keyword": "Scenario",
        "description": "",
        "type": "scenario",
        "tags": [{
            "name": "@PAT-342",
            "line": 5
        }, {
*/



module.exports.randomDataGenerator = function () {
  let _ = require("lodash");
  let moment = require("moment");
  function readTemplate(templateFileName, callback) {
      console.log('Reading File : ' + templateFileName);
      var templateContents = fs.readFileSync(templateFileName, "utf8");
      callback(templateContents);
  }

  function createFeatureFiles(featureFileName, fileContents) {
      //let expectedPath = path.dirname(featureFileName);
      //console.log('* Expected Path from createFeatureFiles: ' + expectedPath);
      //let pathCheck = fileUtilities.checkIfDirectoryExistsAndCreate(expectedPath, true);
      //console.log(pathCheck);

      fs.writeFileSync(featureFileName, fileContents, function(err) {
          if (err) {
              return console.log(err);
          }
          console.log('Created file from createFeatureFiles:' + featureFileName);
      });
  }  
  var templateFilePath = "./data/subjectData.tpl";
  var templateFeatureContent, dataToWrite;
  readTemplate(templateFilePath, function(tplFileData){
    templateFeatureContent = _.template(tplFileData);
    //console.log("templateFeatureContent:" + templateFeatureContent);
    dataToWrite = templateFeatureContent({
      "uniquevalue": (moment.unix(Math.floor(Date.now() / 1000)) / 1000),
    });
    createFeatureFiles("./data/subjectData.json", dataToWrite);
    console.log("Random data generated");
  })
};