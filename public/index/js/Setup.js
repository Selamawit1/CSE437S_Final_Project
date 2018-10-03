/**
 * Loads current user data into side bar
 * Deals with multi-page shared site functionality such as logging out
 */

window.onload = function() {
  var reset = function() {
    firebase.auth().signOut();
    window.location.href = "../index.html";
    return false;
  }

  document.getElementById("logoutBtn").addEventListener('click', e => {
    console.log("Logout Clicked")
    reset();
  });

  // fill sidebar with new user info
  var user = firebase.auth().currentUser;
  var email;

  if (user != null) {
    email = user.email;
    document.getElementById("userEmail").innerHTML = email;
  }


}
