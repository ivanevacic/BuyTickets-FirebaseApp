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


//--  Set DirectionsService --//
var directionsService = new google.maps.DirectionsService();
var directionsDisplay = new google.maps.DirectionsRenderer();
directionsDisplay.setMap(map);

//--------------------------//
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
      //  Get distance in km and time needed to travel via Transit
      $('#output').html("<div class='alert-info'>From: " + document.getElementById("input_Starting_Point").value +".<br />To: " + document.getElementById("input_Destination_Point").value +".<br />Distance: "+result.routes[0].legs[0].distance.text+".<br />Duration: "+result.routes[0].legs[0].duration.text+".</div>");

      //Display route
      directionsDisplay.setDirections(result);
    }
    else {
      //  Delete route from map
      directionsDisplay.setDirections({routes: []});
      //Center map in London
      map.setCenter(myLatLng);
      //  Show error message
      $('#output').html("<div class='alert-danger'>Could not calculate route.</div>");
    }
  });
}


function createTicket() {
  var startingPoint = document.getElementById('input_Starting_Point').value;
  var destinationPoint = document.getElementById('input_Destination_Point').value;
  var date = document.getElementById('datePicker_date').value; 
  //  Create request
  var request = {
    origin: startingPoint,
    destination: destinationPoint,
    travelMode: google.maps.TravelMode.TRANSIT,
    unitSystem: google.maps.UnitSystem.METRIC
  }
  //  Pass request to route method
  directionsService.route(request, function(result, status){
    if(status == google.maps.DirectionsStatus.OK) {
      //  Get distance in float format
      var distance = parseFloat(result.routes[0].legs[0].distance.text.replace(",","."));
      //  Duration in format '2h 22m'
      var duration = result.routes[0].legs[0].duration.text;
      
      //  Get value of selected radio button(ticket type)
      var types = document.getElementsByName('optradio');     
      var ticketType;
      for(var i = 0; i < types.length; i++){
        if(types[i].checked){
          ticketType = types[i].value;
        }
      }
      //  Calculate ticket price depending on selected radio button type
      var price;
      if(ticketType == 'One way ticket'){
        //Fixed 0.2 euros/km
        price = parseFloat((distance * 0.2).toFixed(2));
      }
      if(ticketType == '2-part return ticket'){
        price = parseFloat(((distance * 0.2) * 2).toFixed(2));
      }
      //  Create new key in Firebase
      var tKey = firebase.database().ref().child('Tickets').push().key;
      //  Object with input values;
      var Ticket = {
        date_created: date,
        destination_point: destinationPoint,
        price: price,
        distance: distance,
        duration: duration,
        starting_point: startingPoint,
        ticket_type: ticketType
        }
        //  Save object to Firebase
        var oTicket = {};
        oTicket[tKey] = Ticket;
        Tickets.update(oTicket);
        //  Test
        console.log(Ticket);
        console.log('updated');
     }
     else {
       alert('Unable to save ticket.Check your input!');
       return;
     }
  });  
}

