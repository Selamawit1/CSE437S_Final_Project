var classKeys = [];
var clickedListing = "";
var allClassKeys = [];
var allClassNames = [];

$(window).load(function() {
  document.getElementById("newClassBtn").addEventListener("click", addClass);
  document
    .getElementById("searchClassBtn")
    .addEventListener("click", searchClass);
  renderUserClasses();
  renderAllClasses();
  $("#saveBtn").click(function() {
    let id = clickedListing; // get id of clicked listing
    console.log("hi" + id);
    // parse listing to get key for post to update
    id = parseInt(id.substr(5)); // upost# --> # = index within array

    let key = classKeys[id]; // KEY
    console.log(key);

    // update class info in database
    let utitle = document.getElementById("utitle").value;
    let udepartment = document.getElementById("udepartment").value;
    let uinstructor = document.getElementById("uinstructor").value;
    let uschool = document.getElementById("uschool").value;

    if (
      utitle == "" ||
      udepartment == "" ||
      uinstructor == "" ||
      uschool == ""
    ) {
      alert("Please make sure all fields are filled!");
      return;
    } else {
      var classesRef = firebase
        .database()
        .ref()
        .child("classes/" + key);
      classesRef.update({
        title: utitle,
        department: udepartment,
        instructor: uinstructor,
        school: uschool
        //rating: firebase.database().ref().child("classes/" + key).rating
      });

      renderUserClasses();
      renderAllClasses();

      $("#userDetailModal").modal("toggle");
    }
  });
  renderSubscriptions();
});

// renders list-group divs into user submitted class listings
function renderUserClasses() {
  // read data in from Firebase and render
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      let aDiv = document.getElementById("userClassListings");
      while (aDiv.firstChild) {
        aDiv.removeChild(aDiv.firstChild);
      }
      let uid = firebase.auth().currentUser.uid;
      let rootRef = firebase.database().ref();
      rootRef
        .child("classes")
        .orderByChild("uid")
        .equalTo(uid)
        .on("value", function(snapshot) {
          //console.log(snapshot.val());
          classKeys = Object.keys(snapshot.val());
          var idNum = 0;
          snapshot.forEach(function(data) {
            //console.log(data.val());
            // render each within userTextbookListings div
            var Class = document.createElement("div");
            Class.id = "upost" + idNum;
            Class.className = "list-group-item list-group-item-action";
            Class.innerHTML = data.val().title;
            aDiv.appendChild(Class);

            let utitle = document.getElementById("utitle").value;
            let udepartment = document.getElementById("udepartment").value;
            let uinstructor = document.getElementById("uinstructor").value;
            let uschool = document.getElementById("uschool").value;
            let uemail = document.getElementById("uemail").value;
            //let urating = document.getElementById("urating").value;

            // add click event
            $("#" + Class.id).click(function() {
              clickedListing = Class.id;
              console.log(Class.id + " clicked");
              utitle.value = data.val().title;
              udepartment.value = data.val().department;
              uinstructor.value = data.val().instructor;
              uschool.value = data.val().school;
              uemail.value = data.val().email;

              $("#userDetailModal").modal("show");
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
function renderAllClasses() {
  let body = document.getElementById("classTableBody");
  // clear body
  while (body.firstChild) {
    body.removeChild(body.firstChild);
  }
  console.log("Rendering all classes");

  let rootRef = firebase.database().ref();
  rootRef.child("classes").on("value", function(snapshot) {
    //console.log(snapshot.val());
    idNumAll = 0;
    allClassKeys = Object.keys(snapshot.val());
    snapshot.forEach(function(data) {
      //console.log(data.val());
      // render each within userTextbookListings div
      var classPost = document.createElement("tr");

      var title = document.createElement("td");
      title.innerHTML = data.val().title;

      var department = document.createElement("td");
      department.innerHTML = data.val().department;

      var instructor = document.createElement("td");
      instructor.innerHTML = data.val().instructor;

      var school = document.createElement("td");
      school.innerHTML = data.val().school;

      var rating = document.createElement("td");
      rating.innerHTML = data.val().rating;
      if (rating.innerHTML == "-1") {
        rating.innerHTML = "No Ratings";
      }

      classPost.appendChild(title);
      classPost.appendChild(department);
      classPost.appendChild(instructor);
      classPost.appendChild(school);
      classPost.appendChild(rating);
      classPost.id = "allpost" + idNumAll;

      body.appendChild(classPost);

      // add click event
      $("#" + classPost.id).click(function() {
        clickedListing = classPost.id;
        $("#subscriptionModal").modal("show");
      });

      idNumAll++;
      allClassNames.push(data.val().title);
    });
  });
}

/**
 *
 * Adds a new class
 */
function addClass() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      let ownerID = firebase.auth().currentUser.uid;
      let department = document.getElementById("department").value;
      let email = document.getElementById("email").value;
      let title = document.getElementById("title").value;
      let school = document.getElementById("school").value;
      let instructor = document.getElementById("instructor").value;

      let rootRef = firebase.database().ref();
      let classesRef = rootRef.child("classes");
      let newClassesRef = classesRef.push();
      newClassesRef.set(
        {
          uid: ownerID,
          department: department,
          email: email,
          title: title,
          instructor: instructor,
          school: school,
          rating: -1
        },
        function(error) {
          if (error) {
            console.log(error);
          } else {
            console.log("User input Success");
            // render new class listing
            renderUserClasses();
            renderAllClasses();
          }
        }
      );

      // close modal
      $("#addClassModal").modal("toggle");
    } else {
      console.log("User is not logged in!");
    }
  });
}

/**
 *
 * Subscribes to a new class
 */
function subscribeClass(val) {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      let id = clickedListing; // get id of clicked listing
      // parse listing to get key for post to update
      id = parseInt(id.substr(7)); // upost# --> # = index within array
      let key = allClassKeys[id]; // KEY

      // check if already defined subscription
      let exists = false;
      let uid = firebase.auth().currentUser.uid;
      console.log("key: " + key);
      console.log("uid:" + uid);
      let rootRef = firebase.database().ref();
      rootRef
        .child("subscriptions")
        .orderByChild("uid")
        .equalTo(uid)
        .on("value", function(snapshot) {
          snapshot.forEach(function(data) {
            if (data.val().classid == key) {
              exists = true;
            }
          });
        });
      if (!exists && val) {
        console.log("sub doesnt exists");
        let subscriptionsRef = rootRef.child("subscriptions");
        let newSubscriptionsRef = subscriptionsRef.push();
        newSubscriptionsRef.set(
          {
            uid: uid,
            classid: key,
            subscription: val,
            classname: allClassNames[id]
          },
          function(error) {
            if (error) {
              console.log(error);
            } else {
              console.log("User input Success");
              // render new class listing
              renderSubscriptions();
            }
          }
        );
      } else {
        var foundSub,
          index = 0;
        rootRef
          .child("subscriptions")
          .orderByChild("uid")
          .equalTo(uid)
          .on("value", function(snapshot) {
            snapshot.forEach(function(data) {
              if (data.val().classid == key) {
                foundSub = Object.keys(snapshot.val())[index];
              }
              index++;
            });
          });
        let removeSubscriptionsRef = firebase
          .database()
          .ref()
          .child("subscriptions/" + foundSub);
        removeSubscriptionsRef.remove();
        (function(error) {
          if (error) {
            console.log(error);
          } else {
            console.log("User input Success");
            // render new class listing
            renderSubscriptions();
          }
        });
      }
    } else {
      console.log("User is not logged in!");
    }
  });
  renderSubscriptions();
}

function renderSubscriptions() {
  // read data in from Firebase and render
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      let aDiv = document.getElementById("your-subscription-classes");
      while (aDiv.firstChild) {
        aDiv.removeChild(aDiv.firstChild);
      }
      let uid = firebase.auth().currentUser.uid;
      let rootRef = firebase.database().ref();
      rootRef
        .child("subscriptions")
        .orderByChild("uid")
        .equalTo(uid)
        .on("value", function(snapshot) {
          //console.log(snapshot.val());
          let i = 0;
          snapshot.forEach(function(data) {
            var subscription = document.createElement("a");
            subscription.classList.add("card");
            subscription.id = i;

            var title = document.createElement("div");
            title.classList.add("card-body", "text-center");
            var title_header = document.createElement("h4");
            title_header.classList.add("card-title");
            title_header.innerHTML = data.val().classname;
            title.appendChild(title_header);

            subscription.appendChild(title);

            // subscription.href = "../html/notes.html";
            // NOTE: since notes is going to be universal anyways, maybe we
            // should just make it part of the sidebar

            document
              .getElementById("your-subscription-classes")
              .appendChild(subscription);

            // jquery click event to unique class posts page
            console.log(i);
            $("#" + subscription.id).click(function(){
              console.log("class " + parseInt(subscription.id) + " clicked");
              // pass selected class key as cookie then go to posts page
              let currentClassKey = allClassKeys[parseInt(subscription.id)];
              console.log("currentClassKey : " + currentClassKey);
              document.cookie="currentClassKey=" + currentClassKey;
              document.cookie="currentClass=" + data.val().classname;
              window.location.href = "../html/reddit.html";

            });
            i++;
          });
        });
    } else {
      console.log("User is not logged in!");
    }
  });
}

/**
 * Sorts table on header click. Resorts asc/dec on each click
 * SRC: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_sort_table_desc
 */
function sortTable(n) {
  var table,
    rows,
    switching,
    i,
    x,
    y,
    shouldSwitch,
    dir,
    switchcount = 0;
  table = document.getElementById("myTable");
  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc";
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < rows.length - 1; i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

/*
 * Search when typing all rows for input
 * Adapted from: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_filter_table
 */
function searchClass() {
  console.log("search");
  var input, filter, table, tr, td, i;
  input = document.getElementById("searchClassQuery");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
    for (j = 0; j < tr.length; j++) {
      td = tr[i].getElementsByTagName("td")[j];
      if (td) {
        if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
          break;
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }
}
