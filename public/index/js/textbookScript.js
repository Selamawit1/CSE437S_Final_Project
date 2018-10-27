var textbookKeys = [];
var clickedListing = "";

$(window).load(function() {
  document.getElementById("newTextbookBtn").addEventListener("click", addTextbook);
  renderUserTextbooks();
  renderAllTextbooks();



  $("#saveBtn").click(function() {
    let id = clickedListing; // get id of clicked listing
    console.log("hi" + id);
    // parse listing to get key for post to update
    id = parseInt(id.substr(5)); // upost# --> # = index within array

    let key = textbookKeys[id]; // KEY
    console.log(key);

    // update textbook info in database
    let utitle = document.getElementById("utitle").value;
    let uauthor = document.getElementById("uauthor").value;
    let uisbn = document.getElementById("uisbn").value;
    let uprice = document.getElementById("uprice").value;

    if (utitle == "" || uauthor == "" || uisbn == "" || uprice == "") {
      alert("Please make sure all fields are filled!");
      return;
    } else {
      var textbooksRef = firebase.database().ref().child("textbooks/" + key);
      textbooksRef.update({
        author: uauthor,
        isbn: uisbn,
        title: utitle,
        price: uprice
      });
      renderUserTextbooks();
      renderAllTextbooks();

      $('#userDetailModal').modal('toggle');
    }

  });

  $("#contactBtn").click(function() {
    // send email or message? to seller as inquiry


  });


});




// renders list-group divs into user submitted textbook listings
function renderUserTextbooks() {
  console.log("Rendering user owned textbook posts");
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
        // pulls all textbook keys associated with current user account
        textbookKeys = Object.keys(snapshot.val())
        var idNum = 0;
        snapshot.forEach(function(data) {
          //console.log(data.val());
          // render each within userTextbookListings div
          var textbook = document.createElement('div');
          textbook.id = "upost" + idNum;
          textbook.className = "list-group-item list-group-item-action";
          textbook.innerHTML = data.val().title;
          aDiv.appendChild(textbook);

          let utitle = document.getElementById("utitle").value;
          let uauthor = document.getElementById("uauthor").value;
          let uisbn = document.getElementById("uisbn").value;
          let uprice = document.getElementById("uprice").value;

          // add click event
          $("#" + textbook.id).click(function() {
            clickedListing = textbook.id;
            console.log(textbook.id + " clicked");
            utitle.value = data.val().title;
            uauthor.value = data.val().author;
            uisbn.value = data.val().isbn;
            uprice.value = data.val().price;

            $("#userDetailModal").modal('show');
          });
          idNum++;
        });
      });
    } else {
      console.log("User is not logged in!");
    }
  });
}

// renders all inputted textbooks
function renderAllTextbooks() {
  let body = document.getElementById("textbookTableBody");
  // clear body
  while (body.firstChild) {
    body.removeChild(body.firstChild);
  }
  console.log("Rendering all textbooks");
  let rootRef = firebase.database().ref();
  rootRef.child('textbooks').once('value').then(function(snapshot) {
    var idNum = 0;
    snapshot.forEach(function(data) {
      //console.log(data.val());
      // render each within userTextbookListings div
      var textbookPost = document.createElement('tr');
      textbookPost.id = "post" + idNum;

      var isbn = document.createElement('td');
      isbn.innerHTML = data.val().isbn;
      var sellerEmail = document.createElement('td');
      sellerEmail.innerHTML = data.val().email
      var title = document.createElement('td');
      title.innerHTML = data.val().title;
      var author = document.createElement('td');
      author.innerHTML = data.val().author;
      var price = document.createElement('td');
      price.innerHTML = "$" + data.val().price;

      textbookPost.appendChild(isbn);
      textbookPost.appendChild(sellerEmail);
      textbookPost.appendChild(title);
      textbookPost.appendChild(author);
      textbookPost.appendChild(price);

      body.appendChild(textbookPost);

      $("#" + textbookPost.id).click(function() {
        console.log(textbookPost.id + " clicked");
        // TODO: Append needed information
        document.getElementById("textbookTitle").innerHTML = data.val().title;
        document.getElementById("textbookAuthor").innerHTML = "Author: " + data.val().author;
        document.getElementById("textbookISBN").innerHTML = "ISBN #: " + data.val().isbn;
        document.getElementById("textbookSeller").innerHTML = "Seller Email: " + data.val().price;
        document.getElementById("textbookPrice").innerHTML = "Price: $" + " " + data.val().price;

        $("#detailModal").modal('show');
      });
      idNum++;

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
      let uid = firebase.auth().currentUser.uid;
      let email = firebase.auth().currentUser.email;
      let author = document.getElementById("author").value;
      let isbn = document.getElementById("isbn").value;
      let title = document.getElementById("title").value;
      let price = document.getElementById("price").value;

      let rootRef = firebase.database().ref();
      let storesRef = rootRef.child('textbooks');
      let newStoreRef = storesRef.push();

      // store key in case the user wants to edit any posts
      textbookKeys.push(newStoreRef.getKey());

      newStoreRef.set({
        uid: uid,
        email: email,
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
          renderAllTextbooks();
        }
      });

      // close modal
      $('#addTextbookModal').modal('toggle');

    } else {
      console.log("User is not logged in!");
    }
  });
}
