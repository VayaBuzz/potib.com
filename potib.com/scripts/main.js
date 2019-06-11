// Helpful utilities:
//function round(value, decimals) {
  // Rounds a number to two decimal places.
//  return Number(Math.round(value+'e'+decimals)+'e-'+decimals).toFixed(2);
//}

Number.prototype.round = function(places) {
  // update the number prototype to round to two places. code courtesy of:
  // https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary
  return +(Math.round(this + "e+" + places)  + "e-" + places);
};


function returnBTCprice(originalPrice, conversionRate){
  // Accepts: Original currency price of an item.
  //          conversion rate for the currency to bitcoin.
  // Returns: Price of item converted to milliBTC
  //console.log(typeof originalPrice);
  //console.log(typeof conversionRate);
  //console.log(parseFloat(conversionRate));
  var numberNoCommas = conversionRate.replace(/,/g, '');  // remove any commas from the price string
  var priceBTC1 = originalPrice / parseFloat(numberNoCommas) * 1000; // round(originalPrice / conversionRate * 1000,2); // in milliBTC
  //console.log('pricebtc1 ' + priceBTC1);
  return priceBTC1.round(2);
}


function updatePricesToBTC(itemArray, conversionRate){
  // Accepts: Array of items in their original currency prices.
  // Returns: Same array, but updated to prices in Bitcoin.
  //console.log(itemArray);
  //console.log('conversion rate:' + conversionRate);
  for (var i = 0; i < itemArray.length; i++){
    //console.log(itemArray[i].priceOrig);
    itemArray[i].priceCrypto = returnBTCprice(itemArray[i].priceOrig,conversionRate);
    //itemArray[i].priceCrypto = itemArray[i].priceOrig;
    //console.log(itemArray[i].priceOrig);
  }
  return 1;
}

function assignCryptoRateToEachCountry(countriesObject, ratesObject){
// accepts: custom object of countries from "items.txt"
//          custom rates object for each country from coindesk api
// returns: updated custom object of each countries, but now including the custom rates key/value pair.
  countriesObject.USA.bpi = ratesObject.USD.rate;
  countriesObject.GER.bpi = ratesObject.EUR.rate;
  countriesObject.GBR.bpi = ratesObject.GBP.rate;
  return 1;
}

function createEachCountryItemPriceCrypto(countriesObject){
  updatePricesToBTC(countriesObject.USA.items, countriesObject.USA.bpi);
  updatePricesToBTC(countriesObject.GER.items, countriesObject.GER.bpi);
  updatePricesToBTC(countriesObject.GBR.items, countriesObject.GBR.bpi);
}

// accepts object containing country data
// loops through each country in the object
// examines teh

//
// app
//
var app = angular.module('demo', ['ngAnimate']);

//
// controller for getting bitcoin price, and listing all the items
//
app.controller('repeatController', function($scope, $http,$q) {
  
  $scope.countryData = {}; // holds all the country data from the API call.
  
  var promise1 = $http.get('https://api.coindesk.com/v1/bpi/currentprice.json');
  var promise2 = $http.get('https://vayabuzz.github.io/items/items.txt');
  $q.all([promise1, promise2]).then(function(data){
	  //console.log(data[0], data[1]);
	        
    // version 1: Just update one country.

	  //$scope.myRate = data[0].data.bpi.USD.rate;
	  //$scope.myCurrencyOrig = "USD";
	  //$scope.myCountry = "USA"; // initialize here to USA. To-do: initialize to closest country.
	  //$scope.items = data[1].data[$scope.myCountry].items;
	  //updatePricesToBTC($scope.items, $scope.myRate);
	 
	  // version 2: Update all countries returned by items.txt
	  
	  $scope.countriesObject = data[1].data;
	  $scope.ratesObject = data[0].data.bpi;
	  //console.log($scope.countriesObject);
	  //console.log($scope.ratesObject);
	  assignCryptoRateToEachCountry($scope.countriesObject, $scope.ratesObject);
    createEachCountryItemPriceCrypto($scope.countriesObject);
    
    console.log($scope.countriesObject);
	  // Display items to web page. Use USA as default, but in future detect closest country.
    $scope.myRate = $scope.countriesObject.USA.bpi;
    $scope.myCurrencyOrig = $scope.countriesObject.USA.currency;
    $scope.items = $scope.countriesObject.USA.items;

  });
        
  $scope.clickHandle = function(freshChar) {
    switch (freshChar) {
      
      case 'gb':
        console.log('Great Britain!');
        $scope.myRate = $scope.countriesObject.GBR.bpi;
        $scope.myCurrencyOrig = $scope.countriesObject.GBR.currency;
        $scope.items = $scope.countriesObject.GBR.items;
        break;
      case 'us':
        console.log('United States!');
        $scope.myRate = $scope.countriesObject.USA.bpi;
        $scope.myCurrencyOrig = $scope.countriesObject.USA.currency;
        $scope.items = $scope.countriesObject.USA.items;
        break;
      case 'de':
        console.log('Germany!');
        $scope.myRate = $scope.countriesObject.GER.bpi;
        $scope.myCurrencyOrig = $scope.countriesObject.GER.currency;
        $scope.items = $scope.countriesObject.GER.items;
        break;
      default:
        console.log("clickHandler doesn't recognize this parameter" + freshChar);
    }
  };
            
});
    
    




