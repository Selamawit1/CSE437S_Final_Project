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
      var user = firebase.auth().currentUser;
      console.log("user is " + firebase.auth().currentUser);
      console.log("The user is signed in");
    //  window.alert(user.emailVerified);
    //  if(!user.emailVerified)
      //  window.alert("Please authenticate your email");
    //  if(user.emailVerified)
        window.location.href = "/html/homepage.html";

    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      alert("Error : " + errorMessage);

    });

  }

  function logout() {
    firebase.auth().signOut();
  }

  document.getElementById("login").addEventListener('click', e => {
    login();
  });


}
