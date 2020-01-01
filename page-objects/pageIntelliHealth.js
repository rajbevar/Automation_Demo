
var pageIntellliHealth = {

    patientNameHeaders: by.css('.col-md-12.list-item-header.cp'),
    //patientNameHeaders: by.css('span.hidden-xs'),
    
    linkMedications: by.linkText('Medications'),
    variable: "dummy",
    //linkMedications: by.css("span.info-box-number"),

    /**
     * enters a search term into Google's search box and presses enter
     * @param {string} searchQuery
     * @returns {Promise} a promise to enter the search values
     */
     /**
    preformSearch: function (searchQuery) {

        var selector = page.googleSearch.elements.searchInput;

        // return a promise so the calling function knows the task has completed
        return driver.findElement(selector).sendKeys(searchQuery, selenium.Key.ENTER);
    } */
}

module.exports = pageIntellliHealth;
