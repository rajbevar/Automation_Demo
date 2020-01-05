let fs = require('fs');
const path = require('path');

var utilities = {
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
    },

    /**
     * Constructor for updateTestDataObjectFile :  write object contents to a file
     * @param  {string} fileDir       :  directory of file to write
     * @param  {string} fileToWriteName : filename of file to write
     * @param  {string} objectSource    : object contents to write to file
     * @return {string}  : indicates completion
     */
    updateTestDataObjectFile: function(fileDir, fileToWriteName, objectSource, callback) {
        fs.writeFile(fileDir + fileToWriteName, JSON.stringify(objectSource, null, 4), function(err) {
            // './data/subjectData.json', 
            if (err) {
                console.log('Failed to update JSON file, check :' + fileDir + fileToWriteName + ' for permissions.');
            } else {
                console.log(fileDir + fileToWriteName + ' updated with ' + JSON.stringify(objectSource).substring(0,20));
                return callback('success');
            }
        });
    }     
}

module.exports = utilities; 