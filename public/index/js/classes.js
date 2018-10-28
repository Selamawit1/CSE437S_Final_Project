$(window).load(function () {
  document.getElementById("newClassBtn").addEventListener("click", addClass);
  document.getElementById("searchClassBtn").addEventListener("click", searchClass);
  renderUserClasses();
  renderAllClasses();
});

// renders list-group divs into user submitted class listings
function renderUserClasses() {
  // read data in from Firebase and render
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      let aDiv = document.getElementById("userClassListings");
      while (aDiv.firstChild) {
        aDiv.removeChild(aDiv.firstChild);
      }
      let uid = firebase.auth().currentUser.uid;
      let rootRef = firebase.database().ref();
      rootRef.child("classes").orderByChild("uid").equalTo(uid).on("value", function (snapshot) {
        //console.log(snapshot.val());
        snapshot.forEach(function (data) {
          console.log(data.val());
          // render each within userTextbookListings div
          var Class = document.createElement("div");
          Class.className = "list-group-item list-group-item-action";
          Class.innerHTML = data.val().title;
          document.getElementById("userClassListings").appendChild(Class);

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
  rootRef.child("classes").once("value").then(function (snapshot) {
    snapshot.forEach(function (data) {
      console.log(data.val())
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
      if (rating.innerHTML == "undefined") {
        rating.innerHTML = "N/A";
      }

      classPost.appendChild(title);
      classPost.appendChild(department);
      classPost.appendChild(instructor);
      classPost.appendChild(school);
      classPost.appendChild(rating);

      body.appendChild(classPost);

    });
  });
}

/**
 *
 * Adds a new textbook sale post under current user
 * Appends listing to database
 *
 */
function addClass() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      let ownerID = firebase.auth().currentUser.uid;
      let department = document.getElementById("department").value;
      let email = document.getElementById("email").value;
      let title = document.getElementById("title").value;
      let school = document.getElementById("school").value;
      let instructor = document.getElementById("instructor").value;


      let rootRef = firebase.database().ref();
      let storesRef = rootRef.child("classes");
      let newStoreRef = storesRef.push();
      newStoreRef.set({
        uid: ownerID,
        department: department,
        email: email,
        title: title,
        instructor: instructor,
        school: school
      }, function (error) {
        if (error) {
          console.log(error);
        } else {
          console.log("User input Success");
          // render new textbook listing
          renderUserClasses();
          renderAllClasses();
        }
      });

      // close modal
      $("#addClassModal").modal("toggle");

    } else {
      console.log("User is not logged in!");
    }
  });
}

//SRC: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_sort_table_desc
function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
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
    for (i = 1; i < (rows.length - 1); i++) {
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


//SRC: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_filter_table
function searchClass() {
  console.log('search');
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