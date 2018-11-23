var postKeys = [];
var clickedListing = "";

document.addEventListener('DOMContentLoaded', function() {
  $(".editor").jqte(); // see http://jqueryte.com/documentation
  loadPostListings();
  document.getElementById("submitBtn").addEventListener('click', newPost);

  $('#topic').upvote({
    count: 0,
    upvoted: 0
  });
  $('#topic').upvote();
  document.getElementById("up0").addEventListener('click', function() {
    $('#topic').upvote('upvote');
  });
  document.getElementById("down0").addEventListener('click', function() {
    $('#topic').upvote('downvote');
  });
});

// grab all posts from firebase then render
function loadPostListings() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      let body = document.getElementById("postListings");
      // clear prev listings
      while (body.firstChild) {
        body.removeChild(body.firstChild);
      }
      let uid = firebase.auth().currentUser.uid;
      let rootRef = firebase.database().ref();

      // pull all posts from firebase
      // TODO: Pull posts associated to current class
      rootRef.child('posts').once('value').then(function(snapshot) {
        var idNum = 0;
        snapshot.forEach(function(data) {
          // <a href="#" class="list-group-item list-group-item-action flex-column align-items-start">
          //   <div class="d-flex w-100 justify-content-between">
          //     <h6 class="mb-1">List group item heading</h6>
          //   </div>
          // </a>
          let listing = document.getElementById("postListings");
          let post = document.createElement('a');
          post.id = "post" + idNum;
          post.className = "list-group-item list-group-item-action flex-column align-items-start";
          let postDiv = document.createElement('div');
          postDiv.className = "d-flex w-100 justify-content-between";
          let postH = document.createElement('h6');
          postH.className = "mb-1";
          postH.innerHTML = data.val().title;
          postDiv.appendChild(postH);
          post.appendChild(postDiv);
          listing.appendChild(post);

          // add click event
          $("#" + post.id).click(function() {
            // Append information to details view
            console.log(post.id + " clicked");
            document.getElementById("profileImg").src = data.val().photoURL;
            document.getElementById("postDetailsTitle").innerHTML = data.val().title;
            document.getElementById("postDetailsContent").innerHTML = data.val().content;
            document.getElementById("poster").innerHTML= data.val().username + " posted on " + data.val().timestamp;
          });
          idNum++;
        });
      });
    } else {
      console.log("User is not logged in!");
    }
  });
}

function newPost() {
  console.log("new post button pressed");
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      let username= firebase.auth().currentUser.displayName;
      let email = firebase.auth().currentUser.email;
      let profileUrl = firebase.auth().currentUser.photoURL;
      console.log(firebase.auth().currentUser.photoURL);
      let title = document.getElementById("postTitle").value;
      let content = document.getElementById("postContent").value;
      let rootRef = firebase.database().ref();
      let storesRef = rootRef.child('posts');
      let newStoreRef = storesRef.push();

      // store key in case the user wants to edit any posts
      postKeys.push(newStoreRef.getKey());
      newStoreRef.set({
        username: username, // original post username
        email: email,
        profileUrl: profileUrl,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        title: title,
        content: content,
        score: 0

      }, function(error) {
        if (error) {
          console.log(error);
        } else {
          console.log("User input Success");
          // render post
          loadPostListings();
        }
      });

      // close modal
      $('#postModal').modal('toggle');

    } else {
      console.log("User is not logged in!");
    }
  });
}
