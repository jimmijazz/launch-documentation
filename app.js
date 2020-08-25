const Prismic = require('prismic-javascript');
const PrismicDOM = require('prismic-dom');
const request = require('request');
const PrismicConfig = require('./prismic-configuration');
const Onboarding = require('./onboarding');
const app = require('./config');
var ejs = require('ejs')
const PORT = app.get('port');


app.set('view engine', 'ejs');


app.listen(PORT, () => {
  Onboarding.trigger();
  process.stdout.write(`Point your browser to: http://localhost:${PORT}\n`);
});

// Middleware to inject prismic context
app.use((req, res, next) => {
  res.locals.ctx = {
    endpoint: PrismicConfig.apiEndpoint,
    linkResolver: PrismicConfig.linkResolver,
  };
  // add PrismicDOM in locals to access them in templates.
  res.locals.PrismicDOM = PrismicDOM;
  Prismic.api(PrismicConfig.apiEndpoint, {
    accessToken: PrismicConfig.accessToken,
    req,
  }).then((api) => {
    req.prismic = { api };
    next();
  }).catch((error) => {
    next(error.message);
  });
});

// Render all pages
app.route('/').get(function(req, res) {
  // Get all documents (by sending empty request) to build index
  var options = {};

  req.prismic.api.query('').then((data) => {
    var index = data.results.map(makeNewIndex);

    function makeNewIndex(i) {
      let handle = i["uid"];
      let title = (handle[0].toUpperCase() + handle.substring(1)).replace("-", " ");
      return {"title" : title, "handle" : handle}
    };

    res.render('index', {results : index} );
  });


});

app.get('/page/:pageID', function(req, res) {
  req.prismic.api.getByUID('page', req.params.pageID).then((response) => {

    var contentHTML = PrismicDOM.RichText.asHtml(response.data["main-content"])
    console.log( response.data['header-image']['dimensions'] )
    res.render('page', { document : response, content: contentHTML });
  });
});
