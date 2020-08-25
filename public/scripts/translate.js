// Handles very simple language translations eg color -> colour
var dictionary = {
  "apac" : {
    "Welcome" : "g'day",
  },
  "na" : {
    "welcome" : "welcome",
    "G'day" : "welcome"

  },
  "emea" : {
    "welcome" : "welcome",
    "G'day" : "welcome"

  }
};

function matchCase(text, pattern) {
  // Replace string while matching case. Src - https://stackoverflow.com/questions/17264639/replace-text-but-keep-case
    var result = '';
    try {
      for(var i = 0; i < text.length; i++) {
          var c = text.charAt(i);
          var p = pattern.charCodeAt(i);

          if(p >= 65 && p < 65 + 26) {
              result += c.toUpperCase();
          } else {
              result += c.toLowerCase();
          }
      }

    } catch(e) {
      console.log(e)
    }

    return result;
};


function localizeText() {
  // Updates DOM with localised versions of text. Really only going to be good for 2 languages (UK and US)
  var locale = document.getElementById("localize").value;
  const keys = Object.keys(dictionary[locale]);

    keys.forEach(function(k) {
      if (document.getElementById("printable").innerHTML.includes(k)) {
        console.log(true)
        document.getElementById("printable").innerHTML = document.getElementById("printable").innerHTML.replace(k, function(match) {
            return matchCase(dictionary[locale][k], match);
        });
      } else {
        console.log(false)
      }
    });
}
