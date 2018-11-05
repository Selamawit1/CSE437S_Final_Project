window.onload = function() {
  renderAllTextbooks();

  $("#contactBtn").click(contactSeller);

}

// renders all inputted textbooks
function renderAllTextbooks() {
  let body = document.getElementById("textbookTableBody");
  // clear body
  while (body.firstChild) {
    body.removeChild(body.firstChild);
  }
  console.log("Rendering all textbooks");
  let rootRef = firebase.database().ref().child('textbooks').orderByKey();
  rootRef.limitToFirst(5).once('value').then(function(snapshot) {
    let idNum = 0;
    snapshot.forEach(function(data) {
      // render each within userTextbookListings div
      let textbookPost = document.createElement('tr');
      textbookPost.id = "post" + idNum;

      let isbn = document.createElement('td');
      isbn.innerHTML = data.val().isbn;

      let sellerEmail = document.createElement('td');
      sellerEmail.innerHTML = data.val().email

      let title = document.createElement('td');
      title.innerHTML = data.val().title;

      let author = document.createElement('td');
      author.innerHTML = data.val().author;

      let price = document.createElement('td');
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
        document.getElementById("textbookSeller").innerHTML = "Seller Email: " + data.val().email;
        document.getElementById("textbookPrice").innerHTML = "Price: $" + " " + data.val().price;

        $("#detailModal").modal('show');
      });
      idNum++;

    });
  });
}

function contactSeller() {
  // For demonstration purposes, opens mail clients on user's desktop


}
