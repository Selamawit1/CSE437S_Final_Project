window.onload = function() {
var fileLinkVar = document.getElementsByTagName("a");
var txt = "";
var fileLink = "";
const ref= firebase.storage().ref();
var database = firebase.database();
var ref_d = firebase.database().ref();
var arr = new Array();
  var num = 0;
  var index = 0;
//location.reload();
var printed = false;

ref_d.on("value", function(snapshot) {
 //if(printed == false)
  {
    //document.getElementsByTagName("html")[0].innerHTML = "";
    var p = document.createElement('p');
    var addFileVal = "Add Files...";
    var addFile = document.createTextNode(addFileVal);
    p.id = "addFile";
    document.getElementById("main").innerHTML = "";
    p.appendChild(addFile);

 val = document.createElement('input');
  val.type = "file";
  val.id = "file";
  var br = document.createElement('br');
  var h = document.createElement('hr');
  h.id = "hr";
  document.getElementById("main").appendChild(p);
  document.getElementById("main").appendChild(val);
  document.getElementById("main").appendChild(br);
  document.getElementById("main").appendChild(h);

  fileVar = document.getElementById("file");
  val.addEventListener("change", function() {
      uploadFunction(fileVar);
  });


   var value = snapshot.val().notes;
   console.log("values");
   console.log(value);
   for(id in value)
   {
    // window.alert(value.id);

     var fileURL = value[id].fileurl;
     var fileName = value[id].filename;
     var comment = value[id].comment;
     var count = value[id].like;
     var discount = value[id].dislike;

     if(comment!=null)
        var commentArray = comment.split("\n");
     var a = document.createElement('a');
     a.className = "linkText";
     var br = document.createElement('br');

     var plike = document.createElement('p');
     plike.className = "plike";

     var pdislike = document.createElement('p');
     pdislike.className = "pdislike";

     var commentText = document.createElement('textarea');
     commentText.className = "commentText";
     var commentSubmit= document.createElement('button');
     commentSubmit.className = "commentSubmit";
      var likeSubmit= document.createElement('button');
      likeSubmit.className = "likeSubmit";
      likeSubmit.id = fileName + "\n" + id;

      var dislikeSubmit= document.createElement('button');
      dislikeSubmit.className = "dislikeSubmit";
      dislikeSubmit.id = fileName + "\n" + id;

      commentSubmit.id = fileName + "\n" + id + "\n" + num;
      commentText.id = id;
      num = num + 1;
      console.log(likeSubmit.id);
     var linkText = document.createTextNode(fileName);
     var i = 0;


     var likeVal = document.createTextNode(count);
     var dislikeVal = document.createTextNode(discount);
     var t = document.createTextNode("COMMENT");
     var u = document.createTextNode("LIKE");
     var v = document.createTextNode("DISLIKE");
     commentSubmit.append(t);
     likeSubmit.append(u);
     dislikeSubmit.append(v);
     a.appendChild(linkText);

     plike.appendChild(likeVal);
     pdislike.appendChild(dislikeVal);
     a.addEventListener("click",function(){
      // window.alert("calling download")
       downloadFunction(url);
     });
     a.href = fileURL;
  //   commentText.type = "text";

     val = comment + "\n";

    commentText.addEventListener("change",function(event){
         val = val + commentText.value;
         //commentText.value = val;
         //commentText.id = id;
         console.log("VAL CHANGING");

     });
     //commentText.id = "textbox";

     commentSubmit.addEventListener("click",function(event){
       var commentArray = event.target.id.split("\n");
       var cname = commentArray[0];
       var cid = commentArray[1];
       var cnum = commentArray[2];
       var ccount = value[cid].like;
       var dcount = value[cid].dislike;
       var ccomment = document.getElementById(cid).value;
       var prevcomment = value[cid].comment;
       var allcomment = prevcomment + "\n" + ccomment;
      // val = ccomment + "\n";
       console.log("In like fuction ");
       console.log(value[id].filename);
       console.log(commentArray[0]);
       console.log(cid);
       console.log(commentText.id);
       console.log(cnum);
       console.log(document.getElementById(cid).value);
       firebase.database().ref('notes/'+cid).set({
         filename: cname,
         fileurl : fileURL,
       comment: allcomment,
         like: ccount,
         dislike: dcount
       });

      // submitComment(id,value[id].filename,fileURL,val,count);
     });
     likeSubmit.addEventListener("click",function(event){
        var likeArray = event.target.id.split("\n");
        var lname = likeArray[0];
        var lid = likeArray[1];
        var lcount = value[lid].like;
        var dcount = value[lid].dislike;
        var lcomment = value[lid].comment;
        lcount = lcount + 1;
        console.log("In like fuction ");
        console.log(value[id].filename);
        console.log(likeArray[0]);
        console.log(likeArray[1]);
        console.log(count);
        firebase.database().ref('notes/'+lid).set({
          filename: lname,
          fileurl : fileURL,
          comment: lcomment,
          like: lcount,
          dislike: dcount
        });
      //  location.reload();
    //   submitLike(id,value[id].filename,fileURL,val,count,likeVal);
     });


     dislikeSubmit.addEventListener("click",function(event){
        var dislikeArray = event.target.id.split("\n");
        var lname = dislikeArray[0];
        var lid = dislikeArray[1];
        var lcount = value[lid].like;
        var lcomment = value[lid].comment;
        var dcount = value[lid].dislike;
        dcount = dcount + 1;
        console.log("In like fuction ");
        console.log(value[id].filename);
        console.log(dislikeArray[0]);
        console.log(dislikeArray[1]);
        console.log(count);
        firebase.database().ref('notes/'+lid).set({
          filename: lname,
          fileurl : fileURL,
          comment: lcomment,
          like: count,
          dislike: dcount
        });
      //  location.reload();
    //   submitLike(id,value[id].filename,fileURL,val,count,likeVal);
     });

     var mainVar = document.getElementById("main");
     mainVar.appendChild(br);
     document.getElementById("main").appendChild(br);
     document.getElementById("main").appendChild(a);
     document.getElementById("main").appendChild(br);
     document.getElementById("main").appendChild(likeSubmit);
    document.getElementById("main").appendChild(dislikeSubmit);
     document.getElementById("main").appendChild(br);
     document.getElementById("main").appendChild(plike);
     document.getElementById("main").appendChild(pdislike);

     for(i=1; i<commentArray.length; i++)
     {
        var pcomment = document.createElement('p');
        pcomment.className = "pcomment";
       var commentVal = document.createTextNode(commentArray[i]);
       pcomment.appendChild(commentVal);
        document.getElementById("main").appendChild(pcomment);
       document.getElementById("main").appendChild(br);

     }

     document.getElementById("main").appendChild(br);
     document.getElementById("main").appendChild(br);
     document.getElementById("main").appendChild(commentText);
     document.getElementById("main").appendChild(commentSubmit);
     document.getElementById("main").appendChild(br);
     document.getElementById("main").appendChild(br);
   }
   printed = true;
 }
}, function (error) {
   console.log("Error: " + error.code);
});


var writeUserData = function(id,name, url,val,count,dcount) {
 //window.alert("In writeUserData");
  firebase.database().ref('notes/'+id).set({
    filename: name,
    fileurl : url,
    comment : val,
    like: count,
    dislike: dcount
  });
}
var uploadFunction = function(fileVar){

  //if('files' in fileVar)
  {
    if(fileVar.files.length == 0)
    {
      txt ="Select one or more files";
    }
    else{
      for(var i=0; i<fileVar.files.length; i++){
        //txt += "<br>+<strong>+(i+1)+file</strong><br>"

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

                 txt += url;
                 fileLink = url;
                 var a = document.createElement('a');
                 a.className = "linkText";
                 var br = document.createElement('br');
                 var commentText = document.createElement('textarea');
                 commentText.className = "commentText";
                 var commentSubmit= document.createElement('button');
                 commentSubmit.className = "commentSubmit";
                 var likeSubmit= document.createElement('button');
                 likeSubmit.className = "likeSubmit";
                 var dislikeSubmit= document.createElement('button');
                 dislikeSubmit.className = "dislikeSubmit";
                 var linkText = document.createTextNode(file.name);
                // linkText.className = "linkText";
                 var t = document.createTextNode("COMMENT");
                 var u = document.createTextNode("LIKE");
                 var pcomment = document.createElement('p');
                 pcomment.className = "pcomment";
                 var plike = document.createElement('p');
                 plike.className = "plike";
                 commentSubmit.append(t);
                 likeSubmit.append(u);
                 a.appendChild(linkText);
                 a.addEventListener("click",function(){
                  // window.alert("calling download")
                   downloadFunction(url);
                 });
                 a.href = fileLink;
              //   commentText.type = "text";
                 val = "";

                 commentText.addEventListener("change",function(){
                     val = val + commentText.value;
                 });
                 commentText.id = "textbox";

                // $("#textbox").on('input',function() {alert("Change detected!");});

                 commentSubmit.addEventListener("click",function(){
            //       submitComment(id,file.name,url,val,count);
                 });
                 var count = 0;
                 var dcount = 0;
                 likeSubmit.addEventListener("click",function(){
                   count = count + 1;
                   submitLike(id,file.name,url,val,count,dcount);
                 });
                 dislikeSubmit.addEventListener("click",function(){
                   dcount = dcount + 1;
                   submitLike(id,file.name,url,val,count,dcount);
                 });
                 document.getElementById("main").appendChild(br);
                 document.getElementById("main").appendChild(br);
                 document.getElementById("main").appendChild(a);
                 document.getElementById("main").appendChild(br);
                 document.getElementById("main").appendChild(br);
                 document.getElementById("main").appendChild(likeSubmit);
                 document.getElementById("main").appendChild(br);
                 //document.getElementById("main").appendChild(pcomment);
                 //document.getElementById("main").appendChild(plike);
                 document.getElementById("main").appendChild(br);
                 document.getElementById("main").appendChild(br);
                 document.getElementById("main").appendChild(commentText);
                 document.getElementById("main").appendChild(commentSubmit);
                 document.getElementById("main").appendChild(br);
                 document.getElementById("main").appendChild(br);
                 id = new Date();
                 writeUserData(id,file.name,url,val,count,dcount);

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

var submitComment = function(id,name,url,comment,count,dcount){

  firebase.database().ref('notes/'+id).set({
    filename: name,
    fileurl : url,
    comment: comment,
    like: count,
    dislike: dcount
  });
}

var submitLike = function(id,name,url,comment,count){

}



}
