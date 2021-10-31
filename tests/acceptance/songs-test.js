import { module, test } from 'qunit';
import { visit, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | songs', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Sort songs in various ways', async function (assert) {
    let band = this.server.create('band', { name: 'Them Crooked Vulture' });
    this.server.create('song', {
      title: 'Mind Eraser, No Chaser',
      rating: 2,
      band,
    });
    this.server.create('song', {
      title: 'Elephants',
      rating: 4,
      band,
    });
    this.server.create('song', {
      title: 'Spinning in Daffodils',
      rating: 5,
      band,
    });
    this.server.create('song', {
      title: 'New Fang',
      rating: 3,
      band,
    });

    await visit('/');
    // There was only one band created so only one band link
    await click('[data-test-rr=band-link');

    assert
      .dom('[data-test-rr=song-list-item]:first-child')
      .hasText(
        'Elephants',
        'The first song is the one that comes first in the alphabet'
      );
    assert
      .dom('[data-test-rr=song-list-item]:last-child')
      .hasText(
        'Spinning in Daffodils',
        'The last song is the one that come last in the alphabet'
      );

    await click('[data-test-rr=sort-by-title-desc]');
    assert
      .dom('[data-test-rr=song-list-item]:first-child')
      .hasText(
        'Spinning in Daffodils',
        'The first song is the one that comes last in the alphabet'
      );

    await click('[data-test-rr=sort-by-rating-asc]');
    assert
      .dom('[data-test-rr=song-list-item]:first-child')
      .hasText(
        'Mind Eraser, No Chaser',
        'This first song is the lowest rated'
      );
    assert
      .dom('[data-test-rr=song-list-item]:last-child')
      .hasText(
        'Spinning in Daffodils',
        'The last song is the highest rated'
      );

    await click('[data-test-rr=sort-by-rating-desc]');
    assert
      .dom('[data-test-rr=song-list-item]:first-child')
      .hasText(
        'Spinning in Daffodils',
        'The first song is the highest rated'
      );
    assert
      .dom('[data-test-rr=song-list-item]:last-child')
      .hasText(
        'Mind Eraser, No Chaser',
        'The last song is the lowest rated'
      );
  });
});
