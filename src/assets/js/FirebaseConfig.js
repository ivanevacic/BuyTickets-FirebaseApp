// Initialize Firebase
var config = {
  apiKey: "AIzaSyCJbP0UAwnBiisQpypJ_T7MoKlejbeVLFs",
  authDomain: "buytraintickets-afaca.firebaseapp.com",
  databaseURL: "https://buytraintickets-afaca.firebaseio.com",
  projectId: "buytraintickets-afaca",
  storageBucket: "buytraintickets-afaca.appspot.com",
  messagingSenderId: "397750530271"
};
firebase.initializeApp(config);

// Create Firebase object
var firebaseBuyTickets = firebase.database();
var Tickets = firebaseBuyTickets.ref('Tickets');