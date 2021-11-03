import { module, test } from 'qunit';
import { visit, waitFor } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { getPageTitle } from 'ember-page-title/test-support';
// To be able to use a custom test helper, we have to import it in our tests.
import { createBand } from 'rarwe/tests/helpers/custom-helpers';

module('Acceptance | bands', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('List bands', async function (assert) {
    // this.server is how we access Mirage.
    this.server.create('band', { name: 'Radiohead' });
    this.server.create('band', { name: 'Long Distance Calling' });

    await visit('/');
    assert.equal(getPageTitle(), 'Bands | Rock & Roll with Octane');

    assert
      .dom('[data-test-rr="band-link"]')
      .exists({ count: 2 }, 'All band links are rendered');
    assert
      .dom('[data-test-rr="band-list-item"]:first-child')
      .hasText('Radiohead', 'The first band link contains the band name');
    assert
      .dom('[data-test-rr="band-list-item"]:last-child')
      .hasText(
        'Long Distance Calling',
        'The other band link contains the band name'
      );
  });

  test('Create a band', async function (assert) {
    this.server.create('band', { name: 'Royal Blood' });

    await visit('/');
    await createBand('Caspian');
    // To resolve the intermittent issue of unmatched number of band links, in which
    // by the time the test arrives at checking if there are 2 band links, the new
    // band link hasn't rendered yet, we'll wait for "The band has no songs yet"
    // to be displayed first as part of rendering the empty songs page for the new band,
    // as an indicator that the new band has appeared in the bands list by that time.
    await waitFor('[data-test-rr="no-songs-text"]');

    assert
      .dom('[data-test-rr="band-list-item"]')
      .exists({ count: 2 }, 'A new band link is rendered');
    assert
      .dom('[data-test-rr="band-list-item"]:last-child')
      .hasText('Caspian', 'The new band link is rendered as the last item');
    assert
      .dom('[data-test-rr="songs-nav-item"] > .active')
      .exists('The Songs tab is active');
  });
});
