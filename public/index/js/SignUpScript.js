window.onload = function() {
  var signup = function() {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;
    const reenterPassword = document.getElementById("reenterPassword").value;
    const username = document.getElementById("username").value;
    if (email.length < 4 || username.length == 0 || pass != reenterPassword) {
      alert(
        "Account not created: Please ensure that all inputs are correctly filled and that passwords match, and then try again."
      );
      return false;
    }
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, pass)
      .catch(function(error) {
        console.log(error.message);
        if (error.message == "The email address is badly formatted.") {
          alert("The email address is badly formatted.");
        }
        if (error.message == "Password should be at least 6 characters") {
          alert("Password should be at least 6 characters.");
        }
        if(error.message=="The email address is already in use by another account.")
        {
          alert("The email address is already in use by another account")
        }
        return false;
      });
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        //User is signed in.
        var user = firebase.auth().currentUser;
        console.log("user is " + firebase.auth().currentUser);
        if (user != null) {
          user
            .sendEmailVerification()
            .then(function() {
              // Email sent.
              window.alert(
                "To login, verify your email via the sign-up sent to " +
                  email +
                  "before proceeding."
              );
              //window.location.href = "../index.html";
            })
            .catch(function(error) {
              // An error happened.
              console.log("Error happened: " + error.message);
            });
          var email_id = user.email;
          var email_verified = user.emailVerified;
          console.log("Email Verified: " + email_verified);
          // insert username as well
          user
            .updateProfile({
              displayName: username
            })
            .then(function() {
              // Update successful.
              console.log("Successfully added username");
              //var user = firebase.auth().currentUser;
            })
            .catch(function(error) {
              // An error happened.
              window.alert("Error adding username");
            });

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
  document.getElementById("goHome").addEventListener("click", function(event) {
    window.location.href = "../index.html";
  });
};
