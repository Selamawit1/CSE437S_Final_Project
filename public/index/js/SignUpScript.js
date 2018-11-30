window.onload = function() {
  var signup = function() {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;
    const username = document.getElementById("username").value;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, pass)
      .catch(function(error) {
        console.log(error.message);
      });
    firebase.auth().onAuthStateChanged(function(user) {
      //window.alert("on auth state changed");
      if (user) {
        //User is signed in.
        var user = firebase.auth().currentUser;
        console.log("user is " + firebase.auth().currentUser);
        if (user != null) {
          //  window.alert("the user is not null");
          user
            .sendEmailVerification()
            .then(function() {
              // Email sent.
              window.alert("Please verify your email before proceeding.");
            })
            .catch(function(error) {
              // An error happened.
              window.alert("Error happened" + error.message);
            });
          var email_id = user.email;
          var email_verified = user.emailVerified;
          window.alert("email_verified: " + email_verified);
          // insert username as well
          user
            .updateProfile({
              displayName: username
            })
            .then(function() {
              // Update successful.
              window.alert("Successfully added username");
              //var user = firebase.auth().currentUser;
            })
            .catch(function(error) {
              // An error happened.
              window.alert("Error adding username");
            });

          window.location.href = "../index.html";
          return false;
        }
      } else {
        // No user is signed in.
        alert("Account not created. Please try again.");
      }
    });
  };
  document.getElementById("signup").addEventListener("click", e => {
    signup();
  });

  document
    .getElementById("reenterPassword")
    .addEventListener("keypress", function(event) {
      if (event.keyCode === 13) {
        //13 is enter
        event.preventDefault();
        document.getElementById("signup").click();
      }
    });
};
