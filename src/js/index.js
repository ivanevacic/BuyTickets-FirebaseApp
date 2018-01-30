//--  Create Google Maps map  --//
  //  Map options
  var myLatLng = {
    lat: 51.5,
    lng: -0.1
  };
  var mapOptions = {
    center:myLatLng,
    zoom:5,
    MapTypeId: google.maps.MapTypeId.ROADMAP
  };
  // Create map with defined options
  var map = new google.maps.Map(document.getElementById('googleMap'),mapOptions);
//----------------------------//

var directionsService = new google.maps.DirectionsService();
var directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);

function calculateRoute(){
  //  Create request
  var request = {
    origin: document.getElementById('input_Starting_Point').value,
    destination: document.getElementById('input_Destination_Point').value,
    travelMode: google.maps.TravelMode.TRANSIT,
    unitSystem: google.maps.UnitSystem.METRIC
  }
  //  Pass request to route method
  directionsService.route(request, function(result, status){
    if(status == google.maps.DirectionsStatus.OK) {
      //Get distance in km and time needed to travel via Transit
      $('#output').html("<div class='alert-info'>From: " + document.getElementById("input_Starting_Point").value +".<br />To: " + document.getElementById("input_Destination_Point").value +".<br />Distance: "+result.routes[0].legs[0].distance.text+".<br />Duration: "+result.routes[0].legs[0].duration.text+".</div>");

      //Display route
      directionsDisplay.setDirections(result);
    }
    else {
      //Delete route from map
      directionsDisplay.setDirections({routes: []});
      //Center map in London
      map.setCenter(myLatLng);
      //Show error message
      $('#output').html("<div class='alert-danger'>Could not calculate route.</div>");
    }
  });
}

//--  Input autocomplete --//
var options = {
  types: ['(cities)'] //  Limit autocomplete only to cities
}
var input1 = document.getElementById('input_Starting_Point');
var autocomplete1 = new google.maps.places.Autocomplete(input1, options);

var input2 = document.getElementById('input_Destination_Point');
var autocomplete2 = new google.maps.places.Autocomplete(input2, options);
//------------------------//

function createTicket() {
  var startingPoint = document.getElementById('input_Starting_Point').value;
  var destinationPoint = document.getElementById('input_Destination_Point').value;
  var dateInput = document.getElementById('date').value;
  //  Create new key in Firebase
  var tKey = firebase.database().ref().child('Tickets').push().key;
  //  Object with input values;
  var Ticket = {
    date_created: dateInput,
    destination_point: destinationPoint,
    price: 50,
    starting_point: startingPoint,
    ticket_type: "One way"
  }
  //  Save object to Firebase
  var oTicket = {};
  oTicket[tKey] = Ticket;
  Tickets.update(oTicket);
  //Test
  console.log(Ticket);
  console.log('updated');
}

//-- Datepicker --//

//---------------//