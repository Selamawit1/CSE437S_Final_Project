$(window).load(function () {
  document.getElementById("newTextbookBtn").addEventListener("click", addTextbook);
  renderUserTextbooks();
});


function renderUserTextbooks() {
  // read data in from Firebase and render
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      let uid = firebase.auth().currentUser.uid;
      let rootRef = firebase.database().ref();
      rootRef.child('textbooks').orderByChild('uid').equalTo(uid).on("value", function(snapshot) {
        //console.log(snapshot.val());
        snapshot.forEach(function(data) {
          console.log(data.val())
            // render each within userTextbookListings div
            var textbook = document.createElement('div');
            textbook.className = "list-group-item list-group-item-action";
            textbook.innerHTML = data.val().title;
            document.getElementById("userTextbookListings").appendChild(textbook);

        });
});


    } else {
      console.log("User is not logged in!");
    }
  });
}

/**
  *
  * Adds a new textbook sale post under current user
  * Appends listing to database
  *
  */
function addTextbook() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      let ownerID = firebase.auth().currentUser.uid;
      let author = document.getElementById("author").value;
      let isbn = document.getElementById("isbn").value;
      let title = document.getElementById("title").value;
      let price = document.getElementById("price").value;

      let rootRef = firebase.database().ref();
      let storesRef = rootRef.child('textbooks');
      let newStoreRef = storesRef.push();
      newStoreRef.set({
          uid: ownerID,
          author: author,
          isbn: isbn,
          title: title,
          price: price
      }, function(error) {
        if (error) {
          console.log(error);
        } else {
          console.log("User input Success");
          // render new textbook listing
          var textbook = document.createElement('div');
          textbook.className = "list-group-item list-group-item-action";
          textbook.innerHTML = title;
          document.getElementById("userTextbookListings").appendChild(textbook);
        }
      });



      // close modal
      $('#addTextbookModal').modal('toggle');

    } else {
      console.log("User is not logged in!");
    }
  });
}
