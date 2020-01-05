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

module.exports.convertResultsToXrayFormat = function () {
  var moment = require('moment');
  var _ = require('lodash');
  var fs = require('fs');
  var sourceFilePath = "./reports/";
  var sourceFileName = "cucumber-report.json";
  var destinationFilePath = "./reports/xray/";
  var destinationFileName = ('xray_format_' + sourceFileName);
  var dataObject;
  function readdata(file, callback) {
    fs.readFile(file, 'utf8', function(err, data) {
        if (err) throw err;
        if (data.length <= 0) throw err;
        var jsonData = JSON.parse(data);
        console.log("jsondata:" + jsonData);
        console.log("jsonData.length:" + jsonData.length);
        /**
        for (var i = 0; i < jsonData.length; ++i) {
            if (jsonData[i].alias != -1) {
                console.log("readTestDataObjectFile: Alias : " + jsonData[i].alias);
            } else {
                //do nothing 
                //// console.log('No Alias Found');
            }
        } */
        callback(jsonData);
        
    });
  }
  //console.log("Reading file from readTestDataObjectFile : " + file);
  file = (sourceFilePath + sourceFileName);
  console.log("file name:" + file);

  console.log("dataObject:" + dataObject)
  readdata(file, function(dataObject){


    var xrayResultsFormatObject = {
        info: {
          summary: "none",
          revision: "none",
          startDate: "none",
          finishDate: "none"
        },
        tests: []
      };
      var info = xrayResultsFormatObject.info;
      var tests = xrayResultsFormatObject.tests;
      var failedTests = [];
      var overallCounter = 0;
      var overallExecutionStartDate = "2001-01-01T11:11:11+01:00";
      var overallExecutionEndDate = "2001-01-01T11:11:11+01:00";
      var executionStartDate = "2001-01-01T11:11:11+01:00";
      var executionEndDate = "2001-01-01T11:11:11+01:00";
      var executionComment = "";
      var executionExamples = {
        examples: []
      };
      var examples = executionExamples.examples;
      var duplicateTestKey = [];
      var testsToCreate = [];
      var moreTestsToCreate = [];
      console.log('moreTestsToCreate After Declaration : ' + moreTestsToCreate);

      //  console.log('BEFORE xrayResultsFormatObject.tests');
      //  console.log(xrayResultsFormatObject["tests"]);
      //  console.log('Getting Data from results JSON file : ');
      //  console.log(dataObject);
      //
      info.summary = ('Imported results for file : ' + sourceFileName);
      info.revision = ('Revision Information');

      //UpdateUniqueValues: loop through the file to update values and write back to files
      for (var i = 0; i < dataObject.length; ++i) {
        //  console.log(dataObject[i].id);
        //extract key from string...this will be obsoleted
        var testKeySrc = (dataObject[i].id).substr(0, (dataObject[i].id).indexOf("-", (dataObject[i].id).indexOf("-") + 1));

        //console.log("testKeySrc:" + testKeySrc);
        // maintain status of parent key status to be written to testKey.status
        var testKeySrcParentStatus = 'UNKNOWN';

        // console.log(dataObject[i].elements.name);
        _(dataObject[i].elements).forEach(function(elementInstance, index) {

          //    console.log('ElementIndex : ' + index);
          var elementInstanceParentStatus = 'UNKNOWN';

          //initialize duplicateTestKey
          duplicateTestKey = [];
          var count = 0;
          // duplicate results if coverage applies to more than one AC as designated by the presence of tag (@ACxxx-nnn)
          _(elementInstance.tags).forEach(function(tagInstance, index) {
            // TO DO: need to override the testKeySrc with the name of tag index 0
            // avoiding tags at line 1, as those are User stories
            if ((count === 0) && (tagInstance.line !== 1)) {
              console.log('1st Tag is the JIRA id for the AC');
              testKeySrc = _.trimStart(tagInstance.name, '@');
              console.log('testKeySrc from tag : ' + testKeySrc);
              count = 1;
            }

            // need to maintain an array of testKey's to duplicate and process at the end of testKey
            var duplicateTagPrefix = "@AC";
            if (tagInstance.name.indexOf(duplicateTagPrefix) > -1) {
              // console.log(tagInstance.name);
              //parse and add to duplicateTestKey
              var dupeKey = (tagInstance.name).substr(tagInstance.name.indexOf(duplicateTagPrefix) + duplicateTagPrefix.length);
              console.log(dupeKey);
              duplicateTestKey.push({
                testKeyOriginal: testKeySrc,
                testKeyDupe: dupeKey
              });

            }

          });
          //  console.log('elementInstance Name : ' + elementInstance.id + elementInstance.name + elementInstance.line + elementInstance.steps);

          testsToCreate = duplicateTestKey;


          //step iterator
          _(elementInstance.steps).forEach(function(stepInstance) {

            // console.log('example status : ' + elementInstanceParentStatus);
            //   console.log('stepInstance keyword : ' + stepInstance.keyword);
            //      console.log('stepInstance.result.status; : ' + stepInstance.result.status);
            var exampleStepResult = stepInstance.result.status;

            if (exampleStepResult === 'failed' || exampleStepResult === 'ambiguous' || exampleStepResult === 'skipped') {
              //fail the example
              elementInstanceParentStatus = 'FAIL';

              //fail the overall parent testKey
              testKeySrcParentStatus = 'FAIL';

            } else if (exampleStepResult === 'passed') {
              if (elementInstanceParentStatus === 'UNKNOWN' || elementInstanceParentStatus === 'PASS') {
                elementInstanceParentStatus = 'PASS';
              }

              if (testKeySrcParentStatus === 'UNKNOWN' || testKeySrcParentStatus === 'PASS') {
                testKeySrcParentStatus = 'PASS';
              }
            }

            //  console.log(stepInstance.keyword);
            //write the errors to the comments

            var stepName = ((stepInstance.name || stepInstance.keyword));
            //   console.log('*******stepName****** : ' + stepName);
            if (exampleStepResult === 'failed') {
              executionComment = executionComment + ' Error at Step : ' + stepName + ' : Message : ' + stepInstance.result.error_message;
            }

            // Timings
            if (stepName === 'Before ' || stepName === 'After ') {
              _(stepInstance.embeddings).forEach(function(embeddingInstance) {

                if (stepName === 'Before ' && index === 0) {
                  executionStartDate = (new Buffer(embeddingInstance.data, 'base64').toString('ascii'));

                  // for the very first instance of the very first Before step...capture the time to overall start

                  if (overallCounter === 0) {
                    overallExecutionStartDate = executionStartDate;
                    overallCounter = 1;
                  }


                } else if (stepName === 'After ') {
                  executionEndDate = (new Buffer(embeddingInstance.data, 'base64').toString('ascii'));
                }
              });
            }
          });
          //push to elements
          examples.push(elementInstanceParentStatus);

          //console.log(examples);

          //console.log(' Is testsToCreate empty ?');
          //   console.log(_.isEmpty(testsToCreate));
          if (_.isEmpty(testsToCreate)) {
            // do nothing
            //    console.log('testsToCreate is empty, not updating moreTestsToCreate');
          } else {
            //        console.log('testsToCreate is not empty, setting moreTestsToCreate = testsToCreate');
            moreTestsToCreate = testsToCreate;
          }
          //  console.log('moreTestsToCreate: ' + moreTestsToCreate);

        });

        // ********************** Pushes must be duplicated here ***********************
        //Push failed test tags
        if (testKeySrcParentStatus == 'FAIL') {
          failedTests.push({
            testTag: '@' + testKeySrc
          });
        }

        // Push to tests
        tests.push({
          testKey: testKeySrc,
          start: executionStartDate,
          finish: executionEndDate,
          comment: executionComment,
          status: testKeySrcParentStatus,
          examples
        });

        // if duplicates exist then push them
        //  console.log('moreTestsToCreate 2: ' + moreTestsToCreate);
        _(moreTestsToCreate).forEach(function(keyToCopy) {

          if (testKeySrc === keyToCopy.testKeyOriginal) {
            //  console.log(testKeySrc + ' === ' + keyToCopy.testKeyOriginal);
            console.log('Duplicating Key : testKeyOriginal : ' + keyToCopy.testKeyOriginal + ' testKeyDupe : ' + keyToCopy.testKeyDupe);
            duplicateKey = keyToCopy.testKeyDupe;
            // push the duplicates
            tests.push({
              testKey: duplicateKey,
              start: executionStartDate,
              finish: executionEndDate,
              comment: executionComment,
              status: testKeySrcParentStatus,
              examples
            });
          }

        });
        // clear
        moreTestsToCreate = [];


        // testsToCreate = [];

        //clear examples
        executionExamples = {
          examples: []
        };
        examples = executionExamples.examples;

        //clear comments
        executionComment = "";
        //set overall execution dates
        overallExecutionEndDate = executionEndDate;
        info.startDate = overallExecutionStartDate;
        info.finishDate = overallExecutionEndDate;

        //    console.log('xrayResultsFormatObject');
        //    console.log(xrayResultsFormatObject);
        //only run when done
        var strResults = JSON.stringify(xrayResultsFormatObject);
        //    console.log(strResults);

      }

      fs.writeFile(destinationFilePath + destinationFileName, JSON.stringify(xrayResultsFormatObject, null, 4), function(err) {
          // './data/subjectData.json', 
          if (err) {
              console.log('Failed to update JSON file, check :' + destinationFilePath + destinationFileName + ' for permissions.');
          } else {
              console.log(destinationFilePath + destinationFileName + ' updated with ' + JSON.stringify(xrayResultsFormatObject).substring(0,20));
              //return callback('success');
          }
      }); 
    });   
};