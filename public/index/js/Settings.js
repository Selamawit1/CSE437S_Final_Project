$(window).load(function() {
  loadCurrentUserInfo();

  $("#updateBtn").click(update);
  $("#updatePassBtn").click(updatePass);
  //  $("#moderateBtn").click(sendEmail);
  $("#moderateBtn").click(moderatorForm);

  //document.getElementById("moderateBtn").addEventListener("click",moderatorForm);
  document.getElementById("my-file").onchange = function(e) {
    //Get File
    var file = e.target.files[0];

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        //Create a Storage Ref
        var storageRef = firebase
          .storage()
          .ref(user + "/profilePictures/" + file.name);
        //Upload file
        var task = storageRef.put(file).then(function(snapshot) {
          console.log("Successly inserted image");
          snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log("File available at", downloadURL);
            // update user
            var user = firebase.auth().currentUser;
            user
              .updateProfile({
                photoURL: downloadURL
              })
              .then(function() {
                // Update successful.
                alert("Successfully updated user profile image.");
              })
              .catch(function(error) {
                // An error happened.
                //alert("Error encountered updating user profile image.");
              });
            var user = firebase.auth().currentUser;

            if (user != null && downloadURL != null) {
              downloadURL = user.photoURL;
              document.getElementById("profile-pic").src = downloadURL;
              location.reload();
            } else {
              alert("Error uploading profile image.");
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
    if (user.photoURL == null) {
      document.getElementById("profileImg").src = "../images/placeholder.png";
      document.getElementById("profile-pic").src = "../images/placeholder.png";
    } else {
      document.getElementById("profileImg").src = user.photoURL;
      document.getElementById("profile-pic").src = user.photoURL;
    }
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
    user
      .updateProfile({
        displayName: newName
      })
      .then(function() {
        // Update successful.
        if (validateEmail(newEmail)) {
          user
            .updateEmail(newEmail)
            .then(() => {
              clearAlert();
              $("#alert").append(`<div class="alert alert-success" role="alert">
  Succesfully updated user information. Reload the page to see the changes made.
</div>`);
              //location.reload();
            })
            .catch(function(error) {
              clearAlert();
              $("#alert").append(`<div class="alert alert-danger" role="alert">
    Error updating user information. Error message: ${error.message}
    </div>`);
            });
        } else {
          alert("Please enter a valid email address.");
        }
      })
      .catch(function(error) {
        // An error happened.
        clearAlert();
        $("#alert").append(`<div class="alert alert-danger" role="alert">
Error updating user information. Error message: ${error.message}
</div>`);
      });
  } else if (newName != "") {
    user
      .updateProfile({
        displayName: newName
      })
      .then(function() {
        // Update successful.
        clearAlert();
        $("#alert").append(`<div class="alert alert-success" role="alert">
Succesfully updated user information. Reload the page to see the changes made.
</div>`);
        // location.reload();
      })
      .catch(function(error) {
        // An error happened.
        clearAlert();
        $("#alert").append(`<div class="alert alert-danger" role="alert">
Error updating user information. Error message: ${error.message}
</div>`);
      });
  } else if (newEmail != "") {
    if (validateEmail(newEmail)) {
      user.updateEmail(newEmail).then(() => {
        clearAlert();
        $("#alert").append(`<div class="alert alert-success" role="alert">
Succesfully updated user information. Reload the page to see the changes made.
</div>`);
        // location.reload();
      });
    } else {
      alert("Please enter a valid email address.");
    }
  }
};

function moderatorForm() {
  console.log("moderator form");

  $("#detailModal").modal("show");

  var sendEmail = function() {
    adminEmail = "sntegegn13@ole.augie.edu";
    console.log(adminEmail);
    var emailVar = document.getElementById("emailVal").value;
    var nameVar = document.getElementById("nameVal").value;
    var radios = document.getElementsByName("reason");
    var classVar = document.getElementById("classVal").value;

    console.log(nameVar);
    console.log(emailVar);
    console.log(classVar);

    for (var i = 0, length = radios.length; i < length; i++) {
      if (radios[i].checked) {
        var reasonVar = radios[i].value;
        console.log(reasonVar);
      }
    }
    console.log(reasonVar);
    adminEmail =
      "sntegegn13@ole.augie.edu;isabelle.xu88@gmail.com;jeremy.goldstein@wustl.edu";
    var link =
      "mailto:" +
      adminEmail +
      "?&subject=" +
      escape("Moderator access") +
      "&body=" +
      escape(
        "Hi! \n\n " +
          "My name is " +
          nameVar +
          ". My email address is " +
          emailVar +
          ". I am " +
          reasonVar +
          " for " +
          classVar +
          ". I was wondering " +
          " if I can get a moderator access." +
          "\n\n Thanks! "
      );
    window.location.href = link;
    console.log(emailVar);
  };
  $("#contactBtn").click(sendEmail);
}

function updatePass() {
  var user = firebase.auth().currentUser;
  let newPass = document.getElementById("newpass").value;
  let newPassC = document.getElementById("confirm_newpass").value;

  // TODO: Check if old password is correct (for security)
  if (newPass != newPassC || newPass == "" || newPassC == "") {
    alert("Passwords don't match!");
  } else {
    user.updatePassword(newPass).then(
      () => {
        console.log("Updating password successful");
        alert("Successfully updated password!");
      },
      error => {
        // An error happened.
        alert("Updating password failed. Please try signing in again.");
      }
    );
  }
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function clearAlert() {
  var myNode = document.getElementById("alert");
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
  }
}
