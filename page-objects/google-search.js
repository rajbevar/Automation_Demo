module.exports = {

    url: 'http://www.google.co.uk',
    
    elements: {
        searchInput: by.name('q'),
        searchResultLink: by.css('div.g > h3 > a'),
        
    },
    searchResults: by.css('div.g'),
    patientNameHeaders: by.css('div.col-md-9.col-sm-6'),
    //patientNameHeaders: by.css('span.hidden-xs'),
    
    linkMedications: by.linkText('Medications'),
    //linkMedications: by.css("span.info-box-number"),

    /**
     * enters a search term into Google's search box and presses enter
     * @param {string} searchQuery
     * @returns {Promise} a promise to enter the search values
     */
    preformSearch: function (searchQuery) {

        var selector = page.googleSearch.elements.searchInput;

        // return a promise so the calling function knows the task has completed
        return driver.findElement(selector).sendKeys(searchQuery, selenium.Key.ENTER);
    }
};