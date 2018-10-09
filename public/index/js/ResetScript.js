window.onload = function () {

  var reset = function () {
    var emailAddress = document.getElementById("email").value;

    firebase.auth().sendPasswordResetEmail(emailAddress).then(function () {
      // Email sent.
      //  window.alert("Email sent");
    }).catch(function (error) {

      //  window.alert("Error: "+error.message);
      // An error happened.
    });

  }
  document.getElementById("resetPassword").addEventListener('click', e => {

    reset();
    window.location.href = "../index.html";
    return false;
  });
}
