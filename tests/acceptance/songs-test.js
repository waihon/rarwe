import { module, test } from 'qunit';
import { visit, currentURL, click, fillIn } from '@ember/test-helpers';
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
    await click('[data-test-rr=band-link]');

    assert
      .dom('[data-test-rr=song-list-item]:first-child')
      .hasText(
        'Elephants',
        'The first song is the one that comes first in the alphabet'
      );
    assert
      .dom('[data-test-rr=song-list-item]:last-child')
      .hasText(
        'Spinning In Daffodils',
        'The last song is the one that come last in the alphabet'
      );
    // We don't test the s=title case. When the value of the query param (QP) is its
    // default value (as seen on the controller where we set sortBy), Ember doesn't
    // add the QP to the URL.

    await click('[data-test-rr=sort-by-title-desc]');
    assert
      .dom('[data-test-rr=song-list-item]:first-child')
      .hasText(
        'Spinning In Daffodils',
        'The first song is the one that comes last in the alphabet'
      );
    assert.ok(
      currentURL().includes('s=-title'),
      'The sort query param appears in the URL with the correct value'
    );

    await click('[data-test-rr=sort-by-rating-asc]');
    assert
      .dom('[data-test-rr=song-list-item]:first-child')
      .hasText('Mind Eraser, No Chaser', 'This first song is the lowest rated');
    assert
      .dom('[data-test-rr=song-list-item]:last-child')
      .hasText('Spinning In Daffodils', 'The last song is the highest rated');
    assert.ok(
      currentURL().includes('s=rating'),
      'The sort query param appears in the URL with the correct value'
    );

    await click('[data-test-rr=sort-by-rating-desc]');
    assert
      .dom('[data-test-rr=song-list-item]:first-child')
      .hasText('Spinning In Daffodils', 'The first song is the highest rated');
    assert
      .dom('[data-test-rr=song-list-item]:last-child')
      .hasText('Mind Eraser, No Chaser', 'The last song is the lowest rated');
    assert.ok(
      currentURL().includes('s=-rating'),
      'The sort query param appears in the URL with the correct value'
    );
  });

  test('Search songs', async function (assert) {
    let band = this.server.create('band', { name: 'Them Crooked Vultures' });
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
      title: 'Spinning in Daffoldils',
      rating: 5,
      band,
    });
    this.server.create('song', {
      title: 'No One Loves Me & Neither Do I',
      rating: 4,
      band,
    });

    await visit('/');
    await click('[data-test-rr=band-link]');
    await fillIn('[data-test-rr=search-box]', 'no');

    assert
      .dom('[data-test-rr=song-list-item]')
      .exists({ count: 2 }, 'The songs matching the search term are displayed');

    // Searching and sorting should be possible at the same time, and the consequent
    // clicking of the sorting link and assertions make sure this is the case.
    await click('[data-test-rr=sort-by-title-desc]');
    assert
      .dom('[data-test-rr=song-list-item]:first-child')
      .hasText(
        'No One Loves Me & Neither Do I',
        'A matching song that comes later in the alphabet appears on top'
      );
    assert
      .dom('[data-test-rr=song-list-item]:last-child')
      .hasText(
        'Mind Eraser, No Chaser',
        'A matching song that comes sooner in the alphabet apperas at the bottom'
      );
  });
});
