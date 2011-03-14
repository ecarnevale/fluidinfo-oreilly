// creating the listener for all the fluidinfo calls

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  var username = localStorage.username;
  var password = localStorage.password;

  if(request.action == "initTag"){
    // initiates the tag on Fluidinfo
    if(username && password){
      fluidDB.post({
                    url: "tags/"+username,
                    payload: '{"name" : "'+ request.tag +'", "description" : "' + request.description + '", "indexed" : false}',
                    success: function(json){
                               sendResponse({message: "created"});
                             },
                    async: false,
                    username: username,
                    password: password
                   });
    }else{
      sendResponse({message: "Error, password not found"});
    }
  }else if(request.action == "searchBook"){

    var query = escape('fluidDB/about="'+ request.about +'"');
    fluidDB.get({ //it's possible to do everything with one GET to /values, but for semplicity we check first that the object exists.
                  url: "objects?query="+query,
                  success: function(json){
                           if(json.ids[0]){
                              object_id = json.ids[0];
                              fluidDB.get({
                                            url: "values?query="+query+"&tag=amazon.com/price/usd&tag=amazon.com/url&tag=books.google.com/url&tag=goodreads.com/url",
                                            success: function(json){
                                                       sendResponse({
                                                         found:  true,
                                                         id:     object_id,
                                                         values: json.results.id[object_id]
                                                       });
                                                     },
                                            async: false,
                                            username: username,
                                            password: password
                                           });
                           }else{
                             sendResponse({found:false});
                           }
                           },
                  async: false,
                  username: username,
                  password: password
                 });

  }else if(request.action == "ownBook"){
    fluidDB.put({
                  url: "objects/"+request.id+"/"+username+'/owns',
                  opaque: true,
                  payload: 'null',
                  success: function(json){
                             sendResponse({message: "created"});
                           },
                  async: false,
                  username: username,
                  password: password
                 });
  }else if(request.action == "isBookOwned?"){
    fluidDB.head({
                   url: "objects/"+request.id+"/"+username+'/owns',
                   success: function(json){
                              sendResponse({owns: true});
                            },
                   error: function(json){
                              sendResponse({owns: false});
                            },
                   async: false,
                   username: username,
                   password: password
                 });
  }else if(request.action == "releaseBook"){
    fluidDB.delete({
                   url: "objects/"+request.id+"/"+username+'/owns',
                   success: function(json){
                              sendResponse({message: "deleted"});
                            },
                   async: false,
                   username: username,
                   password: password
                 });
  }
});

