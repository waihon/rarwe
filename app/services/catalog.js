import Service from '@ember/service';
import Band from 'rarwe/models/band';
import { tracked } from 'tracked-built-ins';
// The ember-fetch package (installed by default in all new Ember apps)
// adds a wrapper around fetch and this is what we import below.
import fetch from 'fetch';

function extractRelationships(object) {
  let relationships = {};
  for (let relationshipName in object) {
    // Example 1:
    // {} relationships
    // |_ {} songs
    //    |_ {} links
    //       |_ self: "http://json-api.rockandrollwithemberjs.com/bands/pearl-jam/relationships/songs"
    //       |_ related: "http://json-api.rockandrollwithemberjs.com/bands/pearl-jam/songs"
    // Example 2:
    // {} relationships
    // |_ {} band
    //    |_ {} links
    //       |_ self: "http://json-api.rockandrollwithemberjs.com/songs/3/relationships/band"
    //       |_ related: "http://json-api.rockandrollwithemberjs.com/songs/3/band"
    relationships[relationshipName] = object[relationshipName].links.related;
  }
  return relationships;
}

export default class CatalogService extends Service {
  storage = {};

  constructor() {
    super(...arguments);
    this.storage.bands = tracked([]);
    this.storage.songs = tracked([]);
  }

  async fetchAll() {
    // The API is available at http://json-api.rockandrollwithemberjs.com,
    // and it follows JSON:API convention which has a top-level data attribute.
    // We don't have to bother prepending the host because the proxy option
    // we launched Ember server with takes care of that.
    // (ember s --proxy=http://json-api.rockandrollwithemberjs.com)
    let response = await fetch('/bands');
    let json = await response.json();
    for (let item of json.data) {
      let { id, attributes, relationships } = item;
      let rels = extractRelationships(relationships);
      let record = new Band({ id, ...attributes }, rels);
      this.add('band', record);
    }
    return this.bands;
  }

  add(type, record) {
    let collection = type === 'band' ? this.storage.bands : this.storage.songs;
    collection.push(record);
  }

  get bands() {
    return this.storage.bands;
  }

  get songs() {
    return this.storage.songs;
  }

  find(type, filterFn) {
    let collection = type === 'band' ? this.storage.bands : this.storage.songs;
    return collection.find(filterFn);
  }
}
