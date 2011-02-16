var book_title  = $("#title").html();
var authors_count = $(".product-metadata .authorname").size();
if(authors_count > 1){
  authors = [];
  $(".product-metadata .authorname").each(function(index){
    authors[index] = $(this).html();
  });
  var pageURL = createAboutForBookWithMultipleAuthors(book_title, authors);
}else{
  var book_author = $(".product-metadata .authorname").html();
  var pageURL = createAboutForBook(book_title, book_author);
}
$(".product-metadata .authorname").parents("dl").after('<div id="fluidinfo"><div id="object_id" style="display:none;"></div></div>');

chrome.extension.sendRequest(
  {
    'action'      : 'initTag',
    'tag'         : 'owns',
    'description' : 'I own a copy of what I have tagged'
  },
  function(resp){
  });

chrome.extension.sendRequest(
  {
    'action' : 'searchBook',
    'about'  : pageURL
  },
  function(resp){
    $("#object_id").html(resp.id); // saves the object-id in the DOM
    var icon_url = chrome.extension.getURL('images/icons/icon.png');
    $("#fluidinfo #object_id").after('<span id="fluidinfo-button-own"><button type="button" class="own"><img src="'+ icon_url +'" alt=""/>I own it</button></span><span id="fluidinfo-button-release" style="display:none"><button type="button" class="release"><img src="' + icon_url + '" alt=""/>I don\'t own it</button></span>');

    $("#fluidinfo .own").click(function(){
      chrome.extension.sendRequest(
        {
          'id'  : $("#object_id").html(),
          'action'      : 'ownBook'
        },
        function(resp){
          $("#fluidinfo-button-own").hide();
          $("#fluidinfo-button-release").show();
        });

    });

    $("#fluidinfo .release").click(function(){
      chrome.extension.sendRequest(
        {
          'id'  : $("#object_id").html(),
          'action'      : 'releaseBook'
        },
        function(resp){
          $("#fluidinfo-button-own").show();
          $("#fluidinfo-button-release").hide();
        });

    });

    chrome.extension.sendRequest(
      {
        'action' : 'isBookOwned?',
        'id'  : resp.id
      },
      function(resp){
        $("#fluidinfo-button-own").hide();
        $("#fluidinfo-button-release").show();
        alert("the response is:" + resp.message);
      });
  });
