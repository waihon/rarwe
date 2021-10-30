import { JSONAPISerializer } from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  // Make the Mirage serializer return a response very similar to what our real bankend does.
  // Each band item in the response will have a relationships.songs.links.related key with
  // the URL to fetch the songs from as its value.
  links(resource) {
    let { id, modelName } = resource;
    if (modelName === 'band') {
      return {
        songs: {
          related: `/bands/${id}/songs`,
          self: `/bands/${id}/relationships/songs`,
        },
      };
    }
  },
});
