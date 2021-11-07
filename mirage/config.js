export default function () {
  /*
    Config (with defaults).
    Note: these only affect routes defined *after* them!
  */
  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.namespace = '';    // make this `/api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  /*
    Shorthand cheatsheet:
    this.get('/posts');
    this.post('/posts');
    this.get('/posts/:id');
    this.put('/posts/:id'); // or this.patch
    this.del('/posts/:id');
    https://www.ember-cli-mirage.com/docs/route-handlers/shorthands
  */

  // These 2 lines will mock out the network requests the app makes against the back-end.
  // They are called "shorthand handlers" because you don't have to implement what resposne
  // should Mirage return for them - it is smart emough to figure that out.
  this.get('/bands');
  this.get('/bands/:id');

  // Mirage can't figure out what we want to return for /bands/:id/songs, so we have to
  // implement it ourselves. In other words, we can't use a shorthand handler, we'll have
  // to use a function. Function handlers receive the schema as the first argument and
  // the request as the second one.
  this.get('/bands/:id/songs', function (schema, request) {
    let id = request.params.id;
    // For each Mirage model that we define, a corresponding collection can be accessed
    // on the schema.
    // The bands collection is found on schema.bands, songs are on schema.songs.
    // We return all songs whose bandId matches the id in the rquest.
    return schema.songs.where({ bandId: id });
  });

  this.post('/bands');
  this.post('/songs');
}
