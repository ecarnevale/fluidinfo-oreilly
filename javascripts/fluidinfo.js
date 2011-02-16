function initTagForUser(username, password, tag, description, callback) {
		fluidDB.post("tags/"+username, '{"name" : "'+ tag +'", "description" : "' + description + '", "indexed" : false}', callback,
    true,
		username,
		password);
}

//function tagObjectWithValue(object, tag, value, username, password){

//};

function createAboutForBookWithMultipleAuthors(title, authors){
  for(index in authors){
    authors[index] = naco.normalize(authors[index]);
  }
  return "book:" + naco.normalize(title) + " (" + authors.join("; ") + ")";
}

function createAboutForBook(title, author){
  return "book:" + naco.normalize(title) + " (" + naco.normalize(author) + ")";
}

//function ownBook(about, username
