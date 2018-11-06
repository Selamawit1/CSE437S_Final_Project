$(window).load(function() {
  loadCurrentUserInfo();

  $("#updateBtn").click(update);
  $("#updatePassBtn").click(updatePass);

  document.getElementById("my-file").onchange = function(e) {
    //Get File
    var file = e.target.files[0];

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.

        //Create a Storage Ref
        var storageRef = firebase.storage().ref(user + '/profilePictures/' + file.name);
        //Upload file
        var task = storageRef.put(file).then(function(snapshot) {
          console.log("Successly inserted image");
          snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log("File available at", downloadURL);
            // update user
            var user = firebase.auth().currentUser;
            user.updateProfile({
              photoURL: downloadURL
            }).then(function() {
              // Update successful.
              console.log("Success updating user profile image");
            }).catch(function(error) {
              // An error happened.
              console.log("Error updating user profile image");
            });
            var user = firebase.auth().currentUser;

            if (user != null &&  downloadURL != null) {
              downloadURL = user.photoURL;

              document.getElementById('profile-pic').src = downloadURL;
            } else {
              alert("Error uploading profile image!");
            }
            showUserAvatar();
          });
        });

      } else {
        // No user is signed in.
      }
    });


  };
});

function showUserAvatar() {
  var user = firebase.auth().currentUser;

  if (user != null) {
    document.getElementById('profileImg').src = user.photoURL;
    document.getElementById('profile-pic').src = user.photoURL;
  }
}

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
  var user = firebase.auth().currentUser;
  let newName = document.getElementById("username").value;
  let newEmail = document.getElementById("email").value;

  if (newName != "" && newEmail != "") {
    user.updateProfile({
      displayName: newName,
      email: newEmail
    }).then(function() {
      // Update successful.
      location.reload();
    }).catch(function(error) {
      // An error happened.
      alert("Error updating user information. Please try again.");
    });
  } else if (newName != "") {
    user.updateProfile({
      displayName: newName
    }).then(function() {
      // Update successful.
      location.reload();
    }).catch(function(error) {
      // An error happened.
      alert("Error updating user information. Please try again.");
    });
  } else if (newEmail != "") {
    user.updateProfile({
      email: newEmail
    }).then(function() {
      // Update successful.
      location.reload();
    }).catch(function(error) {
      // An error happened.
      alert("Error updating user information. Please try again.");
    });
  }

};

function updatePass() {
  var user = firebase.auth().currentUser;
  let newPass = document.getElementById("newpass").value;
  let newPassC = document.getElementById("confirm_newpass").value;

  // TODO: Check if old password is correct (for security)
  if (newPass != newPassC || newPass == "" || newPassC == "") {
    alert("Passwords don't match!");
  } else {
    user.updatePassword(newPass).then(() => {
      console.log("Updating password successful");
    }, (error) => {
      // An error happened.
      alert("Updating password failed. Please try signing in again.");
    });
  }
}
