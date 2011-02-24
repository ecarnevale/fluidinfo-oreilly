var book_title  = $("#title").html();
var authors_count = $(".product-metadata .authorname").size();
var icon_url = chrome.extension.getURL('images/icons/icon.png');
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
$(".product-metadata .authorname").parents("dl").after('<div id="fluidinfo"><div id="popup" style="display:none;"></div><div id="object_id" style="display:none;"></div><img id="fluidinfo-button" src="' + icon_url + '" alt=""/></div>');

function actOnBook(action){
  chrome.extension.sendRequest(
    {
      'id'  : $("#object_id").html(),
      'action'      : action+'Book'
    },
    function(resp){
      $("#fluidinfo-button-own").toggle();
      $("#fluidinfo-button-release").toggle();
    });

};

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
    $("#fluidinfo #object_id").after('<span id="fluidinfo-button-own"><button type="button" class="own"><img src="'+ icon_url +'" alt=""/>I own it</button></span><span id="fluidinfo-button-release" style="display:none"><button type="button" class="release"><img src="' + icon_url + '" alt=""/>I don\'t own it</button></span>');

    $("#fluidinfo .own").click(function(){
      actOnBook("own");
    });

    $("#fluidinfo .release").click(function(){
      actOnBook("release");
    });

    chrome.extension.sendRequest(
      {
        'action' : 'isBookOwned?',
        'id'  : resp.id
      },
      function(resp){
        $("#fluidinfo-button").qtip({
          style: {
            border: {
               width: 5,
               radius: 10
            },
            padding: 10, 
            textAlign: 'center',
            tip: true, // Give it a speech bubble tip with automatic corner detection
            name: 'dark' // Style it according to the preset 'cream' style
         },
          border: {
                   width: 3,
                   radius: 8,
                   color: '#6699CC'
                },
          content: '<b>BOLD</b>face',
             position: {
                corner: {
                   target: 'topRight',
                   tooltip: 'bottomLeft'
                }
             }
        });
        $("#fluidinfo-button-own").hide();
        $("#fluidinfo-button-release").show();
      });
  });
