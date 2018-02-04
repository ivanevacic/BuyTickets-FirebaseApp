  //------------------------//
  //Create google maps
  var myLatLng = {
    lat: 51.5,
    lng: -0.1
  };
  var mapOptions = {
    center:myLatLng,
    zoom:5,
    MapTypeId: google.maps.MapTypeId.ROADMAP
  }; 
  
  //All maps
var mapView = new google.maps.Map(document.getElementById('viewMap'),mapOptions);
var mapEdit = new google.maps.Map(document.getElementById('editGoogleMap'),mapOptions);
//Direction services
var directionsService = new google.maps.DirectionsService();
var directionsDisplay = new google.maps.DirectionsRenderer();
directionsDisplay.setMap(mapView);
directionsDisplay.setMap(mapEdit);
  
  //--  Input autocomplete --//
  var options = {
    types: ['(cities)'] //  Limit autocomplete only to cities
  }
  var input1 = document.getElementById('inputEdit_Starting_Point');
  var autocomplete1 = new google.maps.places.Autocomplete(input1, options);
  
  var input2 = document.getElementById('inputEdit_Destination_Point');
  var autocomplete2 = new google.maps.places.Autocomplete(input2, options);
  
  
 
//Populates table with ticket on each refresh
Tickets.on('value', function(firebaseResponse){
  var ticket_table = $('#ticket_table');
  ticket_table.find('tbody').empty();
  firebaseResponse.forEach(function(ticketsSnapshot){
    var ticketKey = ticketsSnapshot.key;
    var ticket = ticketsSnapshot.val();
    var tableRow = '<tr><td>' + ticket.starting_point + '</td><td>' + ticket.destination_point + '</td><td>' + ticket.date_created + '</td><td>' + ticket.distance + "km" + '</td><td>' + ticket.duration + '</td><td>' + ticket.price + "€" + '</td><td>' + ticket.ticket_type + '</td><td><button type="button"  onclick="ViewTicketDetails(\'' + ticketKey + '\')" class="btn btn-xs btn-success" data-toggle="modal" data-target="#viewModal">View</button></td><td><button type="button" onclick="EditTicket(\'' + ticketKey + '\')" class="btn btn-xs btn-warning" data-toggle="modal" data-target="#editTicketModal">Edit</button></td><td><button onclick="DeleteTicket(\'' + ticketKey + '\')" type="button" class="btn btn-xs btn-danger">Delete</button></td></tr>';
    ticket_table.find('tbody').append(tableRow);
  });
});


//Views ticket route in google maps
function ViewTicketDetails(ticketKey){

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
     var map = new google.maps.Map(document.getElementById('viewMap'),mapOptions);
      
      var directionsService = new google.maps.DirectionsService();
      var directionsDisplay = new google.maps.DirectionsRenderer();
    - directionsDisplay.setMap(map);

  var starting_point;
  var destination_point;
  var ticketRef = firebaseBuyTickets.ref('Tickets/' + ticketKey );
  ticketRef.once('value', function(firebaseResponse){
    var ticket = firebaseResponse.val();
      starting_point = ticket.starting_point;
      destination_point = ticket.destination_point; 
      //test
      console.log('from : ' + starting_point);
      console.log('to : ' + destination_point);          
  });
  
  //  Create google maps request   
  var request = {
    origin: starting_point,
    destination: destination_point,
    travelMode: google.maps.TravelMode.TRANSIT,
    unitSystem: google.maps.UnitSystem.METRIC
  }
  //  Pass request to route method
  directionsService.route(request, function(result, status){
    if(status == google.maps.DirectionsStatus.OK) {   
      //If route is valid,show path in google maps    
      console.log(result);       
      directionsDisplay.setDirections(result);     
      $('#viewModal').on('shown.bs.modal', function(){
        google.maps.event.trigger(mapView, 'resize');
      });    
    }   
    else {
      //  Delete route from map
      directionsDisplay.setDirections({routes: []});
      //Center map in London
      map.setCenter(myLatLng);
      //  Show error message
      alert('error');
    }
    
  });
}

//Populates edit modal with values from firebase for clicked ticket
function EditTicket(ticketKey){
  var ticketRef = firebaseBuyTickets.ref('Tickets/' + ticketKey );
  ticketRef.once('value', function(firebaseResponse){
    var ticket = firebaseResponse.val();
      $('#inputEdit_Starting_Point').val(ticket.starting_point); 
      $('#inputEdit_Destination_Point').val(ticket.destination_point);  
      $('#editDatePicker_date').val(ticket.date_created);
      $('#bsaveChangesButton').attr('onclick', 'saveChanges("' + ticketKey + '")');
      //Check ticket type based on firebase value
      if(ticket.ticket_type == 'One way ticket') {
        document.getElementById('one_way').checked = true;
      }   
      if(ticket.ticket_type == '2-part return ticket'){
        document.getElementById('return').checked = true;
      }   
  });
  //  Create request
  var request = {
    origin: $('#inputEdit_Starting_Point').val(),
    destination: $('#inputEdit_Destination_Point').val(),
    travelMode: google.maps.TravelMode.TRANSIT,
    unitSystem: google.maps.UnitSystem.METRIC
  }
  //  Pass request to route method
  directionsService.route(request, function(result, status){
    if(status == google.maps.DirectionsStatus.OK) { 
      directionsDisplay.setDirections(result);       
      console.log(result);
      $('#editTicketModal').on('shown.bs.modal', function(){
        google.maps.event.trigger(mapEdit, 'resize');
      });    
    }
    else {
      alert('error');
    }
  });
}


//Save changes on ticket(if we have any)
function saveChanges(ticketKey) {
  //Reference clicked ticket in table
  var ticketRef = firebaseBuyTickets.ref('Tickets/' + ticketKey );
  //Get input values
  var startingPoint = document.getElementById('inputEdit_Starting_Point').value;
  var destinationPoint = document.getElementById('inputEdit_Destination_Point').value;
  var date = document.getElementById('editDatePicker_date').value; 
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
      var distanceGMmaps = parseFloat(result.routes[0].legs[0].distance.text.replace(",","."));    
      //  Duration in format '2h 22m'
      var duration = result.routes[0].legs[0].duration.text;  //time  
      //  Get value of selected radio button(ticket type)
      var types = document.getElementsByName('optradio');     
      var ticketType;
      for(var i = 0; i < types.length; i++){
        if(types[i].checked){
          ticketType = types[i].value;
        }
      }
      //If date is empty
      if(document.getElementById('editDatePicker_date').value  == '' ) {
        alert('Enter input date');
        return;
      }
      var distance;
      var price;
      if(ticketType == 'One way ticket'){
        //Fixed 0.2 euros/km
        distance = distanceGMmaps;
        price = parseFloat((distance * 0.2).toFixed(2));
      }
      if(ticketType == '2-part return ticket'){
        distance = distanceGMmaps * 2;
        price = parseFloat(((distance * 0.2).toFixed(2)));
      }
      //Console.log for testing
      console.log(distance);      
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
        //Save changes in clicked ticket      
        ticketRef.update(Ticket);
        //  Test
        console.log(Ticket);
        console.log('updated');
     }
     else {
       alert('Unable to update ticket.Check your input!');
       return;
     }
  });  
}


//Calculate updated route in edit modal
function calculateRoute(){
  //  Create request
  var request = {
    origin: $('#inputEdit_Starting_Point').val(),
    destination: $('#inputEdit_Destination_Point').val(),
    travelMode: google.maps.TravelMode.TRANSIT,
    unitSystem: google.maps.UnitSystem.METRIC
  }
  //  Pass request to route method
  directionsService.route(request, function(result, status){
    if(status == google.maps.DirectionsStatus.OK) {   
      //  Get distance in float format
      var distanceGMmaps = parseFloat(result.routes[0].legs[0].distance.text.replace(",","."));    
      //  Duration in format '2h 22m'
      var duration = result.routes[0].legs[0].duration.text;  //time
     //  Get value of selected radio button(ticket type)
      var types = document.getElementsByName('optradio');  
      //Get distance and price based on ticket type   
      var ticketType;
              for(var i = 0; i < types.length; i++){
                if(types[i].checked){
              ticketType = types[i].value;

              if(ticketType == 'One way ticket'){
                //Fixed 0.2 euros/km
                distance = distanceGMmaps;
                price = parseFloat((distance * 0.2).toFixed(2));
              }
              if(ticketType == '2-part return ticket'){
                distance = distanceGMmaps * 2;
                price = parseFloat(((distance * 0.2).toFixed(2)));
              }
            }
          }
          //Show route on google maps
          directionsDisplay.setDirections(result);
        //  Get distance in km and time needed to travel via Transit
        $('#outputEdit').html("<div class='alert-info'>From: " + document.getElementById("inputEdit_Starting_Point").value +".<br />To: " + document.getElementById("inputEdit_Destination_Point").value +".<br />Distance: "+distance+ "km" + ".<br />Duration: "+result.routes[0].legs[0].duration.text+".</div>");      //Display route     
    }
    else {     
      alert("Can't calculate route.Try another city!");
    }
  });
}

//  Delete clicked ticket
function DeleteTicket(ticketKey){
  var ticketRef = firebaseBuyTickets.ref('Tickets/' + ticketKey);
  ticketRef.remove();
}



