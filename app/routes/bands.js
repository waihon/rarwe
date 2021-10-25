import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Band from 'rarwe/models/band';
// The ember-fetch package (installed by default in all new Ember apps)
// adds a wrapper around fetch and this is what we import below.
import fetch from 'fetch';

export default class BandsRoute extends Route {
  @service catalog;

  async model() {
    // The API is available at https://json-api.rockandrollwithemberjs.com,
    // and it follows JSON:API convention which has a top-level data attribute.
    // We don't have to bother prepending the host because the proxy option
    // we launched Ember server with takes care of that.
    // (ember s --proxy=https://json-api.rockandrollwithemberjs.com)
    let response = await fetch('/bands');
    let json = await response.json();
    for (let item of json.data) {
      let { id, attributes } = item;
      let record = new Band({ id, ...attributes });
      this.catalog.add('band', record);
    }
    return this.catalog.bands;
  }
}
