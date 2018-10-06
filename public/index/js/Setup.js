/**
 * Loads current user data into side bar
 * Deals with multi-page shared site functionality such as logging out
 */

$(window).load(function () {
    console.log("Setting up GUI");

    // fill sidebar with new user info
    let user = firebase.auth().currentUser;
    console.log(user);
    if (user != null) {
      let email = user.email;
      let username = user.displayName;
      console.log(email);
      document.getElementById("userEmail").innerHTML = email;
      document.getElementById("username").innerHTML = username;
    };


    var reset = function() {
      firebase.auth().signOut();
      window.location.href = "../index.html";
      return false;
    };

    document.getElementById("logoutBtn").addEventListener('click', e => {
      console.log("Logout Clicked");
      reset();
    });


});
