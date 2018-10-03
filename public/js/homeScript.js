window.onload= function(){
var reset= function(){
    firebase.auth().signOut();
    window.location.href = "../index.html";
    return false;
  }

  document.getElementById("logout").addEventListener('click',e=>{
  //  window.alert("logout clicked");
    reset();
  });

}
