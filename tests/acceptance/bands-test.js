import { module, test } from 'qunit';
import { visit, click, fillIn, waitFor } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { getPageTitle } from 'ember-page-title/test-support';

module('Acceptance | bands', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('List bands', async function (assert) {
    // this.server is how we access Mirage.
    this.server.create('band', { name: 'Radiohead' });
    this.server.create('band', { name: 'Long Distance Calling' });

    await visit('/');
    assert.equal(getPageTitle(), 'Bands | Rock & Roll with Octane');

    let bandLinks = document.querySelectorAll('.mb-2 > a');
    assert.equal(bandLinks.length, 2, 'All band links are rendered');
    assert.ok(
      bandLinks[0].textContent.includes('Radiohead'),
      'First band link contains the band name'
    );
    assert.ok(
      bandLinks[1].textContent.includes('Long Distance Calling'),
      'The other band link contains the band name'
    );
  });

  test('Create a band', async function (assert) {
    this.server.create('band', { name: 'Royal Blood' });

    await visit('/');
    await click('a[href="/bands/new"]')
    await fillIn('input', 'Caspian');
    await click('button');
    // To resolve the intermittent issue of unmatched number of band links, in which
    // by the time the test arrives at checking if there are 2 band links, the new
    // band link hasn't rendered yet, we'll wait for "The band has no songs yet"
    // to be displayed first as part of rendering the empty songs page for the new band,
    // as an indicator that the new band has appeared in the bands list by that time.
    await waitFor('p.text-center');

    let bandLinks = document.querySelectorAll('.mb-2 > a');
    assert.equal(
      bandLinks.length,
      2,
      'All band links are rendered',
      'A new band link is rendered'
    );
    assert.ok(
      document
        .querySelector('.border-b-4.border-purple-400')
        .textContent.includes('Songs'),
      'The Songs tab is active'
    );
  });
});
