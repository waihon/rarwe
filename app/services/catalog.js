import Service from '@ember/service';
import Band from 'rarwe/models/band';
import Song from 'rarwe/models/song';
// `tracked` is an enhanced version of the @tracked decorator, which automatically
// shallow-wraps the native versions of {}, [], Map, Set, WeakMap, and WeakSet.
import { tracked } from 'tracked-built-ins';
// The ember-fetch package (installed by default in all new Ember apps)
// adds a wrapper around fetch and this is what we import below.
import fetch from 'fetch';
import { isArray } from '@ember/array';
import ENV from 'rarwe/config/environment';

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
  // We don't need to track storage itself as we don't change its value.
  storage = {};

  constructor() {
    super(...arguments);
    // Since we mutate the bands and songs arrays (by pushing a new item into them)
    // which are properties of storage, we have to mark them as tracked, using
    // tracked-built-ins addon, which provides tracking for {}, [], Map, Set,
    // WeamMap, and WeakSet.
    this.storage.bands = tracked([]);
    this.storage.songs = tracked([]);
  }

  get bandsURL() {
    return `${ENV.apiHost || ''}/bands`;
  }

  get songsURL() {
    return `${ENV.apiHost || ''}/songs`;
  }

  async fetchAll(type) {
    // The API is available at http://json-api.rockandrollwithemberjs.com,
    // and it follows JSON:API convention which has a top-level data attribute.
    // We don't have to bother prepending the host because the proxy option
    // we launched Ember server with takes care of that.
    // (ember s --proxy=http://json-api.rockandrollwithemberjs.com)
    if (type === 'bands') {
      let response = await fetch(this.bandsURL);
      let json = await response.json();
      this.loadAll(json);
      return this.bands;
    }
    if (type === 'songs') {
      let response = await fetch(this.songsURL);
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
    return this._loadResource(json.data);
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

  async fetchRelated(record, relationship) {
    // This method does 2 things.
    // First, it requests the backend for the related records and loads
    // them to the storage of the catalog.
    // Second, it assigns the created, related records to a "relationship"
    // property, like to songs property of Band model instances.
    let url = record.relationships[relationship];
    let response = await fetch(url);
    let json = await response.json();
    if (isArray(json.data)) {
      record[relationship] = this.loadAll(json);
    } else {
      record[relationship] = this.load(json);
    }
    return record[relationship];
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
    let response = await fetch(
      type === 'band' ? this.bandsURL : this.songsURL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/vnd.api+json',
        },
        body: JSON.stringify(payload),
      }
    );
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
    let url =
      type === 'band'
        ? `${this.getBandsURL}/${record.id}`
        : `${this.getSongsURL}/${record.id}`;
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
    let recordIds = collection.map((record) => record.id);
    // Make our collections to become what's usually referred to as "identify maps" -
    // items in the collection are unique on their ids.
    // Technically, our collections are arays and not maps (which is leass than ideal)
    // but they implement the idea behid the identify maps just the same.
    if (!recordIds.includes(record.id)) {
      collection.push(record);
    }
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
