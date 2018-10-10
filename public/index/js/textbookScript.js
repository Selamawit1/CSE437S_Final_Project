$(window).load(function () {
  document.getElementById("newTextbookBtn").addEventListener("click", addTextbook);
  renderUserTextbooks();
});


function renderUserTextbooks() {
  // read data in from Firebase and render

}

/**
  *
  * Adds a new textbook sale post under current user
  * Appends listing to database
  *
  */
function addTextbook() {
  firebase.auth().onAuthStateChanged(function(user) {
  let database = firebase.database();
    if (user) {
      console.log("user is " + firebase.auth().currentUser);
      let ownerID = firebase.auth().currentUser.uid;
      let author = document.getElementById("author");
      let isbn = document.getElementById("isbn");
      let title = document.getElementById("title");
      // write to database
      let obj = {
        author: author,
        isbn: isbn,
        owner: owner,
        title: title
      };
       database.ref("textbooks/").push(obj);

       // close modal
       $('#addTextbookModal').modal('toggle');

    } else {
      console.log("User is not logged in!");
    }
  });

}