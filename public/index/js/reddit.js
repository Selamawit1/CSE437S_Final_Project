var postKeys = [];
var clickedListing = "";
var scores = [];
var currentClassKey = "";

document.addEventListener("DOMContentLoaded", function() {
  // retrieve current class from cookie
  console.log(currentClassKey);
  document.getElementById("className").innerHTML = getCookie("currentClass");

  $(".editor").jqte(); // see http://jqueryte.com/documentation
  loadPostListings();
  document.getElementById("submitBtn").addEventListener("click", newPost);

  $("#topic").upvote();
  document.getElementById("up0").addEventListener("click", function() {
    $("#topic").upvote("upvote");
    console.log("upvoting");
    let ref = firebase
      .database()
      .ref(
        "classes/" + currentClassKey + "/posts/" + clickedListing + "/score"
      );
    ref.transaction(function(score) {
      return score + 1; // increment score
    });
  });
  document.getElementById("down0").addEventListener("click", function() {
    $("#topic").upvote("downvote");
    console.log("downvoting");
    let ref = firebase
      .database()
      .ref(
        "classes/" + currentClassKey + "/posts/" + clickedListing + "/score"
      );
    ref.transaction(function(score) {
      return score - 1; // decrement score
    });
  });
});

// grab all posts from firebase then render
function loadPostListings() {
  currentClassKey = getCookie("currentClassKey");
  console.log("currentClassKey : " + currentClassKey);
  postKeys = []; // reset post keys
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      let body = document.getElementById("postListings");
      // clear prev listings
      while (body.firstChild) {
        body.removeChild(body.firstChild);
      }
      let uid = firebase.auth().currentUser.uid;
      let rootRef = firebase.database().ref();

      // get all keys
      rootRef
        .child("classes/" + currentClassKey + "/posts")
        .once("value")
        .then(function(snapshot) {
          if (snapshot.val()) {
            let total = Object.keys(snapshot.val()).length;
            let i = 0;
            while (i < total) {
              postKeys.push(Object.keys(snapshot.val())[i]);
              i++;
            }
          }
        });

      // pull all posts from firebase
      // TODO: Pull posts associated to current class
      rootRef
        .child("classes/" + currentClassKey + "/posts")
        .once("value")
        .then(function(snapshot) {
          var idNum = 0;

          snapshot.forEach(function(data) {
            let listing = document.getElementById("postListings");
            let post = document.createElement("a");
            post.id = "post" + idNum;
            post.className =
              "list-group-item list-group-item-action flex-column align-items-start";
            let postDiv = document.createElement("div");
            postDiv.className = "d-flex w-100 justify-content-between";
            let postH = document.createElement("h6");
            postH.className = "mb-1";
            postH.innerHTML = data.val().title;
            postDiv.appendChild(postH);
            post.appendChild(postDiv);
            listing.appendChild(post);

            // add click event
            $("#" + post.id).click(function() {
              // get most recent score from listing
              getScores(function() {
                let newScore = scores[parseInt(post.id.replace("post", ""))];
                $("#topic").upvote({
                  count: newScore,
                  upvoted: 0
                });
                console.log();
                document.getElementById("score").innerHTML = newScore;
              });

              document.getElementById("scorer").style.display = "block";
              // Append information to details view
              clickedListing = postKeys[parseInt(post.id.replace("post", ""))];
              //console.log("clicked Listing for " + post.id + " = " + clickedListing);
              console.log(post.id + " clicked" + "score: " + data.val().score);
              document.getElementById("score").innerHTML = data.val().score;
              if (data.val().score > -2) {
                document.getElementById(
                  "profileImgSmall"
                ).src = data.val().profileUrl;
                document.getElementById(
                  "postDetailsTitle"
                ).innerHTML = data.val().title;
                document.getElementById(
                  "postDetailsContent"
                ).innerHTML = data.val().content;
                document.getElementById("poster").innerHTML =
                  "Post by " +
                  data.val().username +
                  " on " +
                  data.val().timestamp;
                loadComments();
              } else {
                document.getElementById("profileImgSmall").src = "";
                document.getElementById("postDetailsContent").innerHTML = "";
                document.getElementById("poster").innerHTML = "";
                document.getElementById("postDetailsTitle").innerHTML =
                  "This post has been automatically hidden due to significant downvotes.";
                let body = document.getElementById("postComments");
                // clear comments section to prepare for fresh load
                while (body.firstChild) {
                  body.removeChild(body.firstChild);
                }
              }
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
      let username = firebase.auth().currentUser.displayName;
      let email = firebase.auth().currentUser.email;
      let profileUrl = firebase.auth().currentUser.photoURL;
      console.log(firebase.auth().currentUser.photoURL);
      let title = document.getElementById("postTitle").value;
      let content = document.getElementById("postContent").value;
      let rootRef = firebase.database().ref();
      let storesRef = rootRef.child("classes/" + currentClassKey + "/posts");
      let newStoreRef = storesRef.push();
      let timestamp = new Date();

      newStoreRef.set(
        {
          username: username, // original post username
          email: email,
          profileUrl: profileUrl,
          timestamp: timestamp.toString(),
          title: title,
          content: content,
          score: 0
          // upvoted: [],
          // downvoted: []
        },
        function(error) {
          if (error) {
            console.log(error);
          } else {
            console.log("User input Success");
            // render post
            loadPostListings();
          }
        }
      );

      // close modal
      $("#postModal").modal("toggle");
    } else {
      console.log("User is not logged in!");
    }
  });
}

function loadComments() {
  let body = document.getElementById("postComments");
  // clear comments section to prepare for fresh load
  while (body.firstChild) {
    body.removeChild(body.firstChild);
  }

  // first render input comment box
  let h = document.createElement("h5");
  h.innerHTML = "Comment";
  let inputBox = document.createElement("textarea");
  inputBox.id = "inputBox";
  inputBox.class = "form-control";
  inputBox.rows = 2;
  inputBox.cols = 70;
  let submitBtn = document.createElement("button");
  submitBtn.type = "button";
  submitBtn.class = "btn btn-primary";
  submitBtn.id = "newCommentBtn";
  submitBtn.innerHTML = "Submit";

  let commentDiv = document.getElementById("postComments");
  commentDiv.appendChild(document.createElement("br"));
  commentDiv.appendChild(h);
  commentDiv.appendChild(inputBox);
  commentDiv.appendChild(document.createElement("br"));
  commentDiv.appendChild(submitBtn);
  commentDiv.appendChild(document.createElement("br"));
  commentDiv.appendChild(document.createElement("br"));

  // append click event for new comment
  document
    .getElementById("newCommentBtn")
    .addEventListener("click", newComment);

  // render other comments
  renderComments();
}

function renderComments() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      let uid = firebase.auth().currentUser.uid;
      let rootRef = firebase.database().ref();

      // Render comments for current post key
      rootRef
        .child(
          "classes/" +
            currentClassKey +
            "/posts/" +
            clickedListing +
            "/comments/"
        )
        .once("value")
        .then(function(snapshot) {
          snapshot.forEach(function(data) {
            $("#postComments").append(
              `<div class="row">
              <div class="col-sm-1">
                <div class="thumbnail">
                  <img class="img-responsive user-photo" src='${
                    data.val().profileUrl
                  }' height="50" width="50">
                </div>
              </div>
              <div class="col-sm-5">
                <div class="panel panel-default">
                 <div class="panel-heading">
                   <strong>${
                     data.val().username
                   }</strong> <span class="text-muted"></span>
                 </div>
                 <div class="panel-body">${data.val().comment}</div>
                </div>
               </div>
            </div><br>`
            );
          });
        });
    } else {
      console.log("User is not logged in!");
    }
  });
}

function newComment() {
  // add comment to database
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      let username = firebase.auth().currentUser.displayName;
      let profileUrl = firebase.auth().currentUser.photoURL;
      let comment = document.getElementById("inputBox").value;
      if (comment != "") {
      } else {
        alert("Please input a valid comment.");
        return;
      }

      let rootRef = firebase.database().ref();
      // store underneath current post (get key)
      console.log(clickedListing);

      let storesRef = rootRef.child(
        "classes/" + currentClassKey + "/posts/" + clickedListing + "/comments/"
      );
      let newStoreRef = storesRef.push();

      newStoreRef.set(
        {
          username: username,
          profileUrl: profileUrl,
          comment: comment
        },
        function(error) {
          if (error) {
            console.log(error);
          } else {
            console.log("User input Success");
            // render post
            loadComments();
          }
        }
      );
    } else {
      console.log("User is not logged in!");
    }
  });
}

function getScores(callback) {
  console.log("Getting scores");
  scores = [];
  let rootRef = firebase.database().ref();
  rootRef
    .child("classes/" + currentClassKey + "/posts/")
    .once("value")
    .then(function(snapshot) {
      snapshot.forEach(function(data) {
        scores.push(data.val().score);
      });
      callback();
    });
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
