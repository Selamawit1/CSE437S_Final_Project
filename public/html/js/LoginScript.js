window.onload = function() {
  document.getElementById("createAccount").addEventListener('click', e => {
    window.location.href = "/html/SignUp.html";
    return false;
  });




  var login = function() {

    var userEmail = document.getElementById("email").value;
    var userPass = document.getElementById("password").value;

    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      //  window.alert("Error : " + errorMessage);

      // ...
    });

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        var user = firebase.auth().currentUser;
        if (user != null) {
          var email_id = user.email;
          window.location.href = "/html/homepage.html";
          return false;
          //    document.getElementById("user_para").innerHTML = "Welcome User : " + email_id;
        }

      } else {
        // No user is signed in.
        //  alert("bye");
        /*document.getElementById("user_div").style.display = "none";
        document.getElementById("login_div").style.display = "block";*/

      }
    });

  }

  function logout() {
    firebase.auth().signOut();
  }

  document.getElementById("login").addEventListener('click', e => {
    login();
  });


}
