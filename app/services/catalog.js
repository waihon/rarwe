import Service from '@ember/service';
import Band from 'rarwe/models/band';
import Song from 'rarwe/models/song';
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

  async fetchAll(type) {
    // The API is available at http://json-api.rockandrollwithemberjs.com,
    // and it follows JSON:API convention which has a top-level data attribute.
    // We don't have to bother prepending the host because the proxy option
    // we launched Ember server with takes care of that.
    // (ember s --proxy=http://json-api.rockandrollwithemberjs.com)
    if (type === 'bands') {
      let response = await fetch('/bands');
      let json = await response.json();
      this.loadAll(json);
      return this.bands;
    }
    if (type === 'songs') {
      let response = await fetch('/songs');
      let json = await response.json();
      this.loadAll(json);
      return this.songs;
    }
  }

  loadAll(json) {
    let records = [];
    for (let item of json.data) {
      records.push(this._loadResource(item));
    }
    return records;
  }

  load(json) {
    return this._loadResource(json.data)
  }

  _loadResource(item) {
    let record;
    // Creating the id of a band or song has now become the responsibility of
    // the backend: the response contains a top-level id and the attributes.
    let { id, type, attributes, relationships } = item;
    if (type === 'bands') {
      let rels = extractRelationships(relationships);
      record = new Band({ id, ...attributes }, rels);
      this.add('band', record);
    }
    if (type === 'songs') {
      let rels = extractRelationships(relationships);
      record = new Song({ id, ...attributes }, rels);
      this.add('song', record);
    }
    return record;
  }

  async create(type, attributes, relationships = {}) {
    // The payload must be a JSON:API representation of the resource to be
    // created: i.e. data with type and attributes.
    let payload = {
      data: {
        type: type === 'band' ? 'bands' : 'songs',
        attributes,
        relationships,
      },
    };
    let response = await fetch(type === 'band' ? '/bands' : '/songs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify(payload),
    });
    let json = await response.json();
    return this.load(json);
  }

  async update(type, record, attributes) {
    let payload = {
      data: {
        id: record.id,
        type: type === 'band' ? 'bands' : 'songs',
        attributes,
      },
    };
    let url = type === 'band' ? `/bands/${record.id}` : `/songs/${record.id}`;
    await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify(payload),
    });
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
