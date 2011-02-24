// creating the listener for all the fluidinfo calls

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  var username = localStorage.username;
  var password = localStorage.password;

  if(request.action == "initTag"){
    // initiates the tag on Fluidinfo
    if(username && password){
      fluidDB.post("tags/"+username, '{"name" : "'+ request.tag +'", "description" : "' + request.description + '", "indexed" : false}',
                   function(json){
                      sendResponse({message: "created"});
                   },
                    false,
                    username,
                    password);
    }else{
      sendResponse({message: "Error, password not found"});
    }
  }else if(request.action == "searchBook"){

    var query = escape('fluidDB/about="'+ request.about +'"');
    fluidDB.get("values?query="+query+"&tag=amazon.com/price/usd&tag=amazon.com/url&tag=books.google.com/url&tag=goodreads.com/url",
                function(json){
                  for(key in json.results.id){ id = key}; //need to get the object ID. ugly, but it saves a GET
                  sendResponse({
                    id:     id,
                    values: json.results.id[id]
                  });
                });
  }else if(request.action == "ownBook"){
    fluidDB.put("objects/"+request.id+"/"+username+'/owns',
                'null',
                 function(json){
                    sendResponse({message: "created"});
                 },
                  false,
                  username,
                  password,
                  true);
  }else if(request.action == "isBookOwned?"){
    fluidDB.head("objects/"+request.id+"/"+username+'/owns',
                 function(json){
                    sendResponse({message: "oh yes, you have it!"});
                 },
                  false,
                  username,
                  password);
  }else if(request.action == "releaseBook"){
    fluidDB.delete("objects/"+request.id+"/"+username+'/owns',
                 function(json){
                    sendResponse({message: "deleted"});
                 },
                  false,
                  username,
                  password);
  }
});

