import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Band from 'rarwe/models/band';
import Song from 'rarwe/models/song';

module('Unit | Service | catalog', function (hooks) {
  setupTest(hooks);

  test('it can store and retrieve bands', function (assert) {
    // this.owner gives access to the application instance running in
    // the test container.
    // Its lookup method retrieves the referred entity from the registry.
    // service:catalog, controller:bands/new, and component:star-rating
    // are valid values. The first part denotes the "type" of the entity
    // we want to fetch.
    let catalog = this.owner.lookup('service:catalog');
    catalog.add('band', new Band({ id: 1, name: 'Led Zeppelin' }));

    assert.equal(catalog.bands.length, 1);
    assert.equal(catalog.bands[0].name, 'Led Zeppelin');
  });

  test('it can store and retrieve songs', function (assert) {
    let catalog = this.owner.lookup('service:catalog');
    catalog.add(
      'song',
      new Song({
        id: 1,
        title: 'Achilles Last Stand',
        rating: 5,
      })
    );
    assert.equal(catalog.songs.length, 1);
    assert.equal(catalog.songs[0].title, 'Achilles Last Stand');
  });

  test('it can load a record from a JSON:API response', function (assert) {
    let catalog = this.owner.lookup('service:catalog');
    catalog.load({
      data: {
        type: 'bands',
        id: '1',
        attributes: {
          name: 'TOOL',
        },
        relationships: {
          songs: {
            links: {
              related: '/bands/1/songs',
            },
          },
        },
      },
    });
    let band = catalog.bands[0];
    assert.equal(band.name, 'TOOL');
    // band.relationships.songs is not to be confused with data.relationships.songs.
    // The former contains a URL text while the latter contains a links object.
    assert.equal(band.relationships.songs, '/bands/1/songs');
  });
});
