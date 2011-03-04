var book_title  = $("#title").html();
var authors_count = $(".product-metadata .authorname").size();
var images_url = chrome.extension.getURL('images/');
var icon_url = images_url + 'icons/icon.png';
var own_icon_url = images_url + 'icons/icon.png';
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

function actOnBook(action){
  $(".notice").hide();
  $("#ajax-loader").show();
  chrome.extension.sendRequest(
    {
      'id'  : $("#object_id").html(),
      'action'      : action+'Book'
    },
    function(resp){
      $("#ajax-loader").hide();
      $(".fluidinfo-button").toggle();
      $("."+action+"-notice").show().effect('highlight', 1000);
    });

};

var popup_templ = ''
+'{{#amazon_url}}<p><a id="amazon_url" href="{{amazon_url}}">Amazon.com</a> (<span id="amazon_price">{{amazon_price}}</span>)</p>{{/amazon_url}}'
+'{{#google_url}}<p><a id="google_url" href="{{google_url}}">books.google.com</a></p>{{/google_url}}'
+'{{#goodreads_url}}<p><a id="goodreads_url" href="{{goodreads_url}}">goodreads.com</a></p>{{/goodreads_url}}'
+'<br/>'
+'<div class="own-notice notice" {{^owns}}style="display:none;"{{/owns}}>You own this book.<br/><em>(<span class="own">click the icon if you don\'t have it anymore</span>)</em></div>'
+'<div class="release-notice notice" {{#owns}}style="display:none;"{{/owns}}>You don\'t own this book.<br><em>(<span class="release">click the icon if you have it</span>)</em></div>'
+'<center><div id="ajax-loader" style="display:none;"><img src="' + images_url + 'ajax-loader.gif' + '" /></div></center>';

$(".product-metadata .authorname").parents("dl").after('<div id="fluidinfo"><div id="popup" style="display:none; text-align:left;"></div><div id="object_id" style="display:none;"></div><img id="fluidinfo-button-own" class="fluidinfo-button" src="' + own_icon_url + '" alt="#popup"/><img id="fluidinfo-button-release" class="fluidinfo-button" style="display:none;" src="' + icon_url + '" alt="#popup"/></div>');

function setupTooltip(response){
  $("#popup").html($.mustache(popup_templ,
                                         {title: book_title,
                                          amazon_url: response.values["amazon.com/url"].value,
                                          google_url: response.values["books.google.com/url"].value,
                                          goodreads_url: response.values["goodreads.com/url"].value,
                                          amazon_price: "$" + response.values["amazon.com/price/usd"].value/100,
                                          owns: response.owns
                                         }));
  $("#popup").dialog({ autoOpen: false, title: '<b>More information about <span id="book_title">\''+book_title+'\'</span>:</b>' });
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

    chrome.extension.sendRequest(
      {
        'action' : 'isBookOwned?',
        'id'  : resp.id
      },
      function(respTwo){
        if(respTwo.owns){
          resp.owns = true;
          $("#fluidinfo-button-own").hide();
          $("#fluidinfo-button-release").show();
        }
        setupTooltip(resp);
        $(".fluidinfo-button").hover(function(){
          var target = $(this);
          $("#popup").dialog('open').dialog('widget').position({
             my: 'left center',
             at: 'right center',
             of: target,
             collision: "fit none"
          });
        });
        $("#fluidinfo-button-own").click(function(){
          actOnBook("own");
        });

        $("#fluidinfo-button-release").click(function(){
          actOnBook("release");
        });
      });
  });
