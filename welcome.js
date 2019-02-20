'use strict';

document.addEventListener('DOMContentLoaded', () => {

    checkSchedule();

    let button = document.getElementById('suggest_quote');
    let quoteText = document.getElementById('quote_text');

    fetch('http://quotes.rest/qod.json?category=inspire')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        quoteText.innerHTML = data.contents.quotes[0].quote;
    })
    .catch(err => {
        console.log(err)
    });

    button.addEventListener('click', () => {
        let quote_suggestion = window.prompt("Please enter your quote text below.  All quotes will be reviewed before final submission!");
        console.log(quote_suggestion);
    });

});