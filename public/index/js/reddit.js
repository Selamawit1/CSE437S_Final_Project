var postKeys = [];
var clickedListing = "";
var scores = [];
var currentClassKey = "";
var mailList = [];

document.addEventListener("DOMContentLoaded", function() {
  // retrieve current class from cookie
  console.log(currentClassKey);
  document.getElementById("className").innerHTML = getCookie("currentClass");

  var fileInput = document.getElementById("fileId");


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

function sendEmail(mailList,id)
{
  console.log(sendEmail);
  var i =0;
  var adminEmail = "";
  for(i=0; i<mailList.length;i++)
  {
      console.log(mailList[i]);
      adminEmail+= ";" + mailList[i];
  }
  var link =
    "mailto:" +
    adminEmail +

    "&subject=" +
    escape("classkey"+currentClassKey+" postkey"+id) +
    "&body=" +
    escape(
      "Hi! \n\n " +
      "I wanted to report inappropriate content "
      + "\n\n Thanks! "
    );
  window.location.href = link;
}

function flagPost(e) {
  console.log(e.target.id);
  var id = e.target.id;
  adminEmail = "sntegegn13@ole.augie.edu";
  var mailList = [];
  let rootRef = firebase.database().ref();
  rootRef
    .child("classes/" + currentClassKey + "/Moderators")
    .once("value")
    .then(function(snapshot) {
      var idNum = 0;

      snapshot.forEach(function(data) {
           console.log(data.val());
            adminEmail+= data.val();
            mailList.push(data.val());
      });
      console.log(mailList.length);
      sendEmail(mailList,id);

    });
    console.log(mailList);

}

function deletePost(e){
  console.log("timestamp");
  timestamp = e.target.id;
  console.log(timestamp.toString());
  var date = new Date(timestamp.toString());
var seconds = date.getTime()/1000;

console.log(seconds);
  let rootRef = firebase.database().ref();

  // get all keys
  rootRef
  .child("classes/" + currentClassKey + "/posts")
  .once("value")
  .then(function(snapshot) {

    snapshot.forEach(function(data) {

      if (data.val().timestamp == timestamp) {
          console.log("match");
          console.log(timestamp);
          console.log(data.val());
          if(data.val().fileName != ""){
              console.log(data.val().fileName)
              const name = (+seconds) + '-' + data.val().fileName;
              const storageRef= firebase.storage().ref();
              var desertRef = storageRef.child(name)

              // Delete the file
              desertRef.delete().then(function() {
                console.log("File deleted successfully")
              }).catch(function(error) {
                console.log("Uh-oh, an error occurred!")
              });
         }
         rootRef.child("classes/" + currentClassKey + "/posts/"+data.key).remove().then(function() {
             console.log("item deleted successfully")
         }).catch(function(error) {
           console.log("Uh-oh, an error occurred!")
         });

      }
    });
  });
  location.reload();
}

// grab all posts from firebase then render
function loadPostListings() {
  currentClassKey = getCookie("currentClassKey");
  console.log("currentClassKey : " + currentClassKey);
  postKeys = []; // reset post keys
  let flagBtn = document.createElement("button");
  flagBtn.type = "button";
  flagBtn.class = "btn btn-primary";
  flagBtn.id = "flagBtn";
  flagBtn.innerHTML = "Flag";

  let deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.class = "btn btn-primary";
  deleteBtn.id = "deleteBtn";
  deleteBtn.innerHTML = "Delete";



//  document
//      .getElementById("flagBtn");
//      .addEventListener("click", flagPost);

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      let body = document.getElementById("postListings");
      console.log(body);
      // clear prev listings
      while (body.firstChild) {
        body.removeChild(body.firstChild);
      }
      let uid = firebase.auth().currentUser.uid;
      let rootRef = firebase.database().ref();

      console.log(currentClassKey);
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
            console.log(data.val());
            var p = document.createElement('p');
            var addFileVal = "Add Files...";
            var addFile = document.createTextNode(addFileVal);
            p.id = "addFile";
            p.appendChild(addFile);

            val = document.createElement('input');
            val.type = "file";
            val.id = "file";
            var br = document.createElement('br');
            var h = document.createElement('hr');
            h.id = "hr";

            var fileDiv = document.createElement('div');

            fileDiv.appendChild(p);
            fileDiv.appendChild(val);
            fileDiv.appendChild(br);
            fileDiv.appendChild(h);

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

              var timestamp = data.val().timestamp;
              var moderateRef = data.val().Moderators;
            //  console.log(moderateRef.val());
              console.log(currentClassKey);



              var i = 0;


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
                if(data.val().fileName != null){
                  console.log("fileURL is ");
                  console.log(data.val().fileURL);
                  document.getElementById(
                    "postDetailsFile"
                  ).innerHTML = data.val().fileName;
                  document.getElementById(
                    "postDetailsFile"
                  ).href = data.val().fileURL;

                }
                document.getElementById("poster").innerHTML =
                  "Post by " +
                  data.val().username +
                  " on " +
                  data.val().timestamp;
                loadComments();
                rootRef
                  .child("classes/" + currentClassKey + "/Moderators")
                  .once("value")
                  .then(function(snapshot) {
                    var idNum = 0;

                    snapshot.forEach(function(data) {
                         console.log(data.val());
                         if(data.val() == user.email)
                        {
                            document.getElementById("flagDelete").append(deleteBtn);
                            deleteBtn.id = timestamp;
                            deleteBtn.type="button";
                            deleteBtn.className="btn btn-primary";
                            deleteBtn.style.width="100px";
                            document
                               .getElementById(timestamp)
                               .addEventListener("click", deletePost);
                        }
                    });
                  });
                  document.getElementById("flagDelete").append(flagBtn);
                  flagBtn.id = data.key;
                  flagBtn.style.marginRight="20px";
                  flagBtn.style.width="100px";
                  console.log(data.key);
                  document
                     .getElementById(data.key)
                     .addEventListener("click", flagPost);
                  flagBtn.type="button";
                  flagBtn.className="btn btn-primary";
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
      let fileInput = document.getElementById("fileId");
      let fileLen = fileInput.files.length;
      let rootRef = firebase.database().ref();
      let storesRef = rootRef.child("classes/" + currentClassKey + "/posts");
      const ref= firebase.storage().ref();
      let timestamp = new Date();
      console.log(timestamp.getTime());
      var fileName = null;
      var url = "";
      if(fileLen!=0)
      {
        for(var i=0; i<fileLen; i++){
          var file = fileInput.files[i];
          const name = (+(parseInt(timestamp.getTime()/1000))) + '-' + file.name;
          console.log(name);
          const metadata = {
            contentType: file.type
          }
          const task = ref.child(name).put(file,metadata);
          fileName = file.name;

          var fileURL = task.then(snapshot => snapshot.ref.getDownloadURL()).then(function(url) {
            writeUserData(username,email,profileUrl,timestamp,title,content,fileName,url);
            return;
        });
    //
          console.log(fileURL);
        }


      }
      else{
        writeUserData(username,email,profileUrl,timestamp,title,content," "," ",currentClassKey)
      }




      // close modal
      $("#postModal").modal("toggle");
      //clear file name
      fileInput.value = "";

    } else {
      console.log("User is not logged in!");
    }
  });
}

function writeUserData(username,email,profileUrl,timestamp,title,content,fileName,fileURL,currentClassKey){

  let rootRef = firebase.database().ref();
  let storesRef = rootRef.child("classes/" + currentClassKey + "/posts");
  console.log(currentClassKey);
    let newStoreRef = storesRef.push();
    Moderators = "sntegegn@wustl.edu" + " "
  newStoreRef.set(
    {
      username: username, // original post username
      email: email,
      profileUrl: profileUrl,
      timestamp: timestamp.toString(),
      title: title,
      content: content,
      score: 0,
      fileName: fileName,
      fileURL: fileURL,

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

//  document
  //  .getElementById("flagBtn");
  //  .addEventListener("click", newComment);

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
  console.log(document.cookie);
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
