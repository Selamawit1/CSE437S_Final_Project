Classes.prototype.getAllClasses = function(render) {
    var query = firebase.firestore()
        .collection('courses')
        .orderBy('title', 'desc')
    this.getDocumentsInQuery(query, render);

Classes.prototype.getMostPopularClasses = function(render) {
    var query = firebase.firestore()
        .collection('courses')
        .orderBy('rating', 'desc')
        .limit(5);
    this.getDocumentsInQuery(query, render);
  }

  Classes.prototype.getDocumentsInQuery = function(query, render) {
    query.onSnapshot(function(snapshot) {
      if (!snapshot.size) return render();
  
      snapshot.docChanges().forEach(function(change) {
        if (change.type === 'added') {
          render(change.doc);
        }
      });
    });
  }