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

function ViewTicketDetails(ticketKey){
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
  directionsDisplay.setMap(map);
      
  var request = {
    origin: starting_point,
    destination: destination_point,
    travelMode: google.maps.TravelMode.TRANSIT,
    unitSystem: google.maps.UnitSystem.METRIC
  }
  //  Pass request to route method
  directionsService.route(request, function(result, status){
    if(status == google.maps.DirectionsStatus.OK) {              
      directionsDisplay.setDirections(result);
      console.log(result);
      $('#viewModal').on('shown.bs.modal', function(){
        google.maps.event.trigger(map, 'resize');
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

function EditTicket(ticketKey){

}

function DeleteTicket(ticketKey){
  var ticketRef = firebaseBuyTickets.ref('Tickets/' + ticketKey);
  ticketRef.remove();
}



