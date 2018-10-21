window.onload = function() {
  renderAllTextbooks();

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
    snapshot.forEach(function(data) {
      console.log(data.val())
      // render each within userTextbookListings div
      var textbookPost = document.createElement('tr');

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

      textbookPost.appendChild(isbn);
      textbookPost.appendChild(sellerEmail);
      textbookPost.appendChild(title);
      textbookPost.appendChild(author);
      textbookPost.appendChild(price);

      body.appendChild(textbookPost);

    });
  });
}
