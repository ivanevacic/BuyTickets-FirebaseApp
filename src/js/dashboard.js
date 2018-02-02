Tickets.on('value', function(firebaseResponse){
  var ticket_table = $('#ticket_table');
  ticket_table.find('tbody').empty();
  firebaseResponse.forEach(function(ticketsSnapshot){
    var ticketKey = ticketsSnapshot.key;
    var ticket = ticketsSnapshot.val();
    var tableRow = '<tr><td>' + ticket.starting_point + '</td><td>' + ticket.destination_point + '</td><td>' + ticket.date_created + '</td><td><button type="button"  onclick="ViewTicketDetails(\'' + ticketKey + '\')" class="btn btn-xs btn-success">View details</button></td><td><button type="button" onclick="EditTicket(\'' + ticketKey + '\')" class="btn btn-xs btn-warning">Edit</button></td><td><button onclick="DeleteTicket(\'' + ticketKey + '\')" type="button" class="btn btn-xs btn-danger">Delete</button></td></tr>';
    ticket_table.find('tbody').append(tableRow);
  });
});

function ViewTicketDetails(ticketKey){

}

function EditTicket(ticketKey){

}

function DeleteTicket(ticketKey){
  var ticketRef = firebaseBuyTickets.ref('Tickets/' + ticketKey);
  ticketRef.remove();
}