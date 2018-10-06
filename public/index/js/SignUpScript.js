window.onload = function() {

  var signup = function() {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;
    const username = document.getElementById("username").value;
    /*  firebase.auth().getUserByEmail(email)
      .then(function(userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log("Successfully fetched user data:", userRecord.toJSON());
      })
      .catch(function(error) {
        window.alert("Already signed up");
      });*/
    firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function(error) {
      console.log(error.message);
    });
    firebase.auth().onAuthStateChanged(function(user) {
      //window.alert("on auth state changed");
      if (user) {
        //User is signed in.
        var user = firebase.auth().currentUser;
        console.log("user is " + firebase.auth().currentUser);
        if (user != null) {
          var email_id = user.getEmail();
          // insert username as well
          user.updateProfile({
              displayName: username
          });

          window.location.href = "../homepage.html";
          return false;
        }
      } else {
        // No user is signed in.
        //    alert("bye");
      }
    });

  }
  document.getElementById("signup").addEventListener('click', e => {
    signup();
  });
}
