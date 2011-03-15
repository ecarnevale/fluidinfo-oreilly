// NACO-like normalization.
// Emanuel Carnevale
// emanuel.carnevale@gmail.com
// inspired by the work of @njr0
// http://blog.abouttag.com/2010/03/how-to-tag-books-in-fluiddb.html

naco = new Object();

naco.translations = {
  'Æ': 'AE',
  'æ': 'ae',
  'Œ': 'OE',
  'œ': 'oe',
  'Ð': 'D',
  'đ': 'd',
  'ð': 'd',
  'ı': 'i',
  'Ł': 'l',
  'ł': 'l',
  'ℓ': 'l',
  'Ø': 'o',
  'ø': 'o',
  'Ơ': 'o',
  'ơ': 'o',
  'Þ': 'th',
  'þ': 'th',
  'Ư': '',
  'ư': '',
  'α': 'a',
  'β': 'b',
  'γ': 'y',
  '♭': 'b',
  '♯': '#',   //# careful: sharp not hash on left!
  '–': '-',   //# en-dash
  '—': '-',   //# em-dash
  "'": ''    //# apostrophe
};

naco.TO_SPACES_RE = /[\!\(\)\{\}\<\>\-\;\:\.\?\,\/\\\@\*\%\=\$\^\_\~]/g;
naco.DELETIONS_RE = /\[\]\|/g;
naco.MULTISPACE_RE = /\s+/g;

naco.remove_accents = function(s){
  var r=s.toLowerCase();
  r = r.replace(new RegExp("[àáâãäå]", 'g'),"a");
  r = r.replace(new RegExp("æ", 'g'),"ae");
  r = r.replace(new RegExp("ç", 'g'),"c");
  r = r.replace(new RegExp("[èéêë]", 'g'),"e");
  r = r.replace(new RegExp("[ìíîï]", 'g'),"i");
  r = r.replace(new RegExp("ñ", 'g'),"n");
  r = r.replace(new RegExp("[òóôõö]", 'g'),"o");
  r = r.replace(new RegExp("œ", 'g'),"oe");
  r = r.replace(new RegExp("[ùúûü]", 'g'),"u");
  r = r.replace(new RegExp("[ýÿ]", 'g'),"y");
  //r = r.replace(new RegExp("\\W", 'g'),"");
  return r;
};

naco.normalize_part = function(s) {
  s = naco.remove_accents(s);
  var new_s = "";
  for(i=0; i < s.length; i++){
    var char = s.charAt(i);
    if(naco.translations[char] != undefined){
      new_s = new_s + naco.translations[char];
    }else{
      new_s = new_s + char;
    }
  }
  return new_s.replace(naco.TO_SPACES_RE, ' ').replace(naco.DELETIONS_RE, '').replace(naco.MULTISPACE_RE,' ');
};

naco.normalize = function(s){
  return naco.normalize_part(s);
};
