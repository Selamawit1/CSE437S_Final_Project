$(window).load(function () {
  loadCurrentUserInfo();

  $("#updateBtn").click(update);

});


function loadCurrentUserInfo() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var user = firebase.auth().currentUser;
      // User is signed in.
      let email = user.email;
      let username = user.displayName;
      document.getElementById("username").value = username;
      document.getElementById("email").value = email;
    } else {
      console.log("User is not logged in!");
    }
  });

}

let update = () => {
  console.log("user settings update button clicked");

};
