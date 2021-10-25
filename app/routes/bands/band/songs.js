import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Song from 'rarwe/models/song';
import fetch from 'fetch';

export default class BandsBandSongsRoute extends Route {
  @service catalog;

  async model() {
    let band = this.modelFor('bands.band');
    let url = band.relationships.songs;
    let response = await fetch(url);
    let json = await response.json();
    let songs = [];
    for (let item of json.data) {
      let { id, attributes, relationships } = item;
      // {} relationships
      // |_ {} band
      //    |_ {} links
      //       |_ related: "http://json-api.rockandrollwithemberjs.com/songs/3/band"
      //       |_ self: "http://json-api.rockandrollwithemberjs.com/songs/3/relationships/band"
      let rels = {};
      for (let relationshipName in relationships) {
        rels[relationshipName] = relationships[relationshipName].links.related;
      }
      let song = new Song({ id, ...attributes }, rels);
      songs.push(song);
      this.catalog.add('song', song);
    }
    band.songs = songs;
    return band;
  }

  // Each controller class only has one single instance in the application.
  // Ember provides a specific hook to update controller properties when moving
  // between routes. It's called on the route every time a route transition is
  // initiated.
  resetController(controller) {
    controller.title = '';
    controller.showAddSong = true;
  }
}
