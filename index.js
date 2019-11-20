'use strict';
const apiKey = 'sZg6TKKsTDuanqlKscZ1zrhmK9g2O5mYTXpjfopb';
const endpointURL = 'https://developer.nps.gov/api/v1/parks';

function makeQuery(params){
    const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function displayResults(responseJson){
    $('#results-list').empty();
    for (let i = 0; i < responseJson.data.length; i++){
      $('#results-list').append(
        `<li><h3>${responseJson.data[i].fullName}</h3>
        <p>${responseJson.data[i].description}</p>
        <a href='${responseJson.data[i].url}'>Visit Website</a>
        </li>`
      )};
    $('#results').removeClass('hidden');
    $('#bad-input').remove();
}
function getParks(stateCode, maxResult){
    const params = {
        api_key: apiKey,
        stateCode: stateCode,
        limit: maxResult,
      };

      let queryLink = makeQuery(params);
      console.log(queryLink);
      const url = endpointURL + '?' + queryLink;
      console.log(url);

      fetch(url)
      .then(response => {
          if(response.ok){
              return response.json();
          }
        throw new Error(response.statusText);
      })
      .then(responseJson => displayResults(responseJson))
      .catch(err => $('#js-error-message').text(`Something went wrong: ${err.message}`));
}

function watchForm(){
    $('form').submit(event => {
        event.preventDefault();
        const stateCode = $('#stateId').val();
        const maxResult = $('#park-limit').val();
        if(stateCode.length != 2){
            $('.container').append('<p id="bad-input" class="error-message">Your state code can only contain 2 letters!</p>');
            return;
        }
        console.log(stateCode);
        console.log(maxResult);
        getParks(stateCode, maxResult);
    });
}

$(watchForm);