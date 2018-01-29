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
  //  Create new key in Firebase
  var tKey = firebase.database().ref().child('Tickets').push().key;
  //  Object with input values;
  var Ticket = {
    date_created: "01/01/2018",
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