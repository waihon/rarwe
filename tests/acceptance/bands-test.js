import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
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
});
