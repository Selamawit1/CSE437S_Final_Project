$(window).load(function() {
  document.getElementById("newTextbookBtn").addEventListener("click", addTextbook);
  renderUserTextbooks();
  renderAllTextbooks();
});

// renders list-group divs into user submitted textbook listings
function renderUserTextbooks() {
  // read data in from Firebase and render
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      let aDiv = document.getElementById("userTextbookListings");
      while (aDiv.firstChild) {
        aDiv.removeChild(aDiv.firstChild);
      }
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

// renders all inputted textbooks (TODO: pages/api load on scroll)
function renderAllTextbooks() {
  let body = document.getElementById("textbookTableBody");
  // clear body
  while (body.firstChild) {
    body.removeChild(body.firstChild);
  }
  console.log("Rendering all textbooks");
  let rootRef = firebase.database().ref();
  rootRef.child('textbooks').once('value').then(function(snapshot) {
    snapshot.forEach(function(data) {
      console.log(data.val())
      // render each within userTextbookListings div
      var textbookPost = document.createElement('tr');
      var textbookTh = document.createElement('th');
      textbookTh.scope = "row";

      // <th scope="col">ISBN #</th>
      // <th scope="col">Seller Email</th>
      // <th scope="col">Title</th>
      // <th scope="col">Author</th>
      // <th scope="col">Price</th>

      var isbn = document.createElement('td');
      isbn.innerHTML = data.val().isbn;

      var sellerEmail = document.createElement('td');
      // TODO: Get email from uid
      //sellerEmail.innerHTML = data.val().email

      var title = document.createElement('td');
      title.innerHTML = data.val().title;

      var author = document.createElement('td');
      author.innerHTML = data.val().author;

      var price = document.createElement('td');
      price.innerHTML = "$" + data.val().price;

      textbookPost.appendChild(textbookTh);
      textbookPost.appendChild(isbn);
      textbookPost.appendChild(sellerEmail);
      textbookPost.appendChild(title);
      textbookPost.appendChild(author);
      textbookPost.appendChild(price);

      body.appendChild(textbookPost);

    });

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
          renderUserTextbooks();
        }
      });

      // close modal
      $('#addTextbookModal').modal('toggle');

    } else {
      console.log("User is not logged in!");
    }
  });
}
