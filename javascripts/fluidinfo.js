function createAboutForBookWithMultipleAuthors(title, authors){
  for(index in authors){
    authors[index] = naco.normalize(authors[index]);
  }
  return "book:" + naco.normalize(title) + " (" + authors.join("; ") + ")";
}

function createAboutForBook(title, author){
  return "book:" + naco.normalize(title) + " (" + naco.normalize(author) + ")";
}
