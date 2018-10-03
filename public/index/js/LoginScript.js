window.onload = function() {

  document.getElementById("createAccount").addEventListener('click', e => {
    window.location.href = "/html/SignUp.html";
    return false;
  });

  var login = function() {

    var userEmail = document.getElementById("email").value;
    var userPass = document.getElementById("password").value;
    console.log("Attempting to sign in...");
    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).then(function(data) {

      console.log("The user is signed in");
      window.location.href = "/html/homepage.html";

    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      console.log("Error : " + errorMessage);

    });

    // firebase.auth().onAuthStateChanged(function(user) {
    //   if (user) {
    //     // User is signed in.
    //     console.log("The user is signed in");
    //     var user = firebase.auth().currentUser;
    //     if (user != null) {
    //       var email_id = user.email;
    //       // window.location.href = "/html/homepage.html";
    //       return false;
    //     }
    //
    //   } else {
    //     console.log("The user is NOT signed in");
    //
    //   }
    // });

  }

  function logout() {
    firebase.auth().signOut();
  }

  document.getElementById("login").addEventListener('click', e => {
    login();
  });


}
