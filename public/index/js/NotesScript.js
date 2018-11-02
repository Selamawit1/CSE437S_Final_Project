window.onload = function() {
var fileVar = document.getElementById("file");
var fileLinkVar = document.getElementsByTagName("a");
var txt = "";
var fileLink = "";
const ref= firebase.storage().ref();
var database = firebase.database();
var ref_d = firebase.database().ref();
//location.reload();
var printed = false;

ref_d.on("value", function(snapshot) {
  if(printed == false)
  {
   console.log(snapshot.val());
   var value = snapshot.val().notes;
   console.log(value);
   for(id in value)
   {
    // window.alert(value.id);
    console.log(value[id]);
     var fileURL = value[id].fileurl;
     var fileName = value[id].filename;
     console.log(fileName);
      console.log(fileURL);
     var a = document.createElement('a');
     var br = document.createElement('br');
     var commentText = document.createElement('input');
     var commentSubmit= document.createElement('button');
     var linkText = document.createTextNode(fileName);
     var t = document.createTextNode("SUBMIT");
     commentSubmit.append(t);
     a.appendChild(linkText);
     a.addEventListener("click",function(){
      // window.alert("calling download")
       downloadFunction(url);
     });
     a.href = fileURL;
     commentSubmit.addEventListener("click",function(e){
       console.log(fileName);
       submitComment(id,value[id].filename,fileURL);
     });
     document.body.appendChild(a);
     document.body.appendChild(br);
     document.body.appendChild(commentText);
     document.body.appendChild(commentSubmit);
     document.body.appendChild(br);
     document.body.appendChild(br);
   }
   printed = true;
 }
}, function (error) {
   console.log("Error: " + error.code);
});


var writeUserData = function(id,name, url) {
//  window.alert("In writeUserData");
  firebase.database().ref('notes/'+id).set({
    filename: name,
    fileurl : url
  });
}
var uploadFunction = function(){
  if('files' in fileVar){
    if(fileVar.files.length == 0)
    {
      txt ="Select one or more files";
    }
    else{
      for(var i=0; i<fileVar.files.length; i++){
        //txt += "<br>+<strong>+(i+1)+file</strong><br>"
        console.log(fileVar.files);
        var file = fileVar.files[i];
        if('name' in file){
      //    txt += "name: "+file.name +"<br>";
          const name = (+new Date()) + '-' + file.name;
          const metadata = {
            contentType: file.type
          }
          const task = ref.child(name).put(file,metadata);
          task.then(snapshot => snapshot.ref.getDownloadURL())
              .then((url) => {
                 console.log(url);
                 txt += url;
                 fileLink = url;
                 var a = document.createElement('a');
                 var br = document.createElement('br');
                 var commentText = document.createElement('input');
                 var commentSubmit= document.createElement('button');
                 var linkText = document.createTextNode(file.name);
                 var t = document.createTextNode("SUBMIT");
                 commentSubmit.append(t);
                 a.appendChild(linkText);
                 a.addEventListener("click",function(){
                  // window.alert("calling download")
                   downloadFunction(url);
                 });
                 a.href = fileLink;
                 commentText.type = "text";
                 commentSubmit.addEventListener("click",function(){
                   submitComment(id,file.name,url);
                 });
                 document.body.appendChild(a);
                 document.body.appendChild(br);
                 document.body.appendChild(commentText);
                 document.body.appendChild(commentSubmit);
                 document.body.appendChild(br);
                 document.body.appendChild(br);
                 id = new Date();
                 writeUserData(id,file.name,url);

               })
               .catch(console.error);
        }
      }
    }
  }
//  document.getElementById("demo").innerHTML = txt;
//  fileLinkVar.innerHTML = fileLink;
//  fileLinkVar.href = fileLink;

}
var downloadFunction = function(url){
  const ref = firebase.storage().ref().child(url);
}

var submitComment = function(id,file,url){
  console.log("In submit comment");
  console.log(this.value);
  firebase.database().ref('notes/'+id).set({
    filename: name,
    fileurl : url,
    comment: "hello"
  });
}

fileVar.addEventListener("change", function() {
    uploadFunction();
});

}
