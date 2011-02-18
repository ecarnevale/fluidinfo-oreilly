chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  var username = localStorage.username;
  var password = localStorage.password;
  if(request.action == "initTag"){
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
    fluidDB.get("objects?query="+query,
                function(json){
                  sendResponse({id: json.ids[0]});
                });
  }else if(request.action == "ownBook"){
                    sendResponse({message: "created" + "objects/" + request.id + "/" + username + '/owns'});
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
                    sendResponse({message: "YES! YOU HAVE IT!"});
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

