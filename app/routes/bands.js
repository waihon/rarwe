import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Band from 'rarwe/models/band';
// The ember-fetch package (installed by default in all new Ember apps)
// adds a wrapper around fetch and this is what we import below.
import fetch from 'fetch';

export default class BandsRoute extends Route {
  @service catalog;

  async model() {
    // The API is available at http://json-api.rockandrollwithemberjs.com,
    // and it follows JSON:API convention which has a top-level data attribute.
    // We don't have to bother prepending the host because the proxy option
    // we launched Ember server with takes care of that.
    // (ember s --proxy=http://json-api.rockandrollwithemberjs.com)
    let response = await fetch('/bands');
    let json = await response.json();
    for (let item of json.data) {
      let { id, attributes, relationships } = item;
      // {} relationships
      // |_ {} songs
      //    |_ {} links
      //       |_ self: "http://json-api.rockandrollwithemberjs.com/bands/pearl-jam/relationships/songs"
      //       |_ related: "http://json-api.rockandrollwithemberjs.com/bands/pearl-jam/songs"
      let rels = {};
      for (let relationshipName in relationships) {
        rels[relationshipName] = relationships[relationshipName].links.related;
      }
      let record = new Band({ id, ...attributes }, rels);
      this.catalog.add('band', record);
    }
    return this.catalog.bands;
  }
}
