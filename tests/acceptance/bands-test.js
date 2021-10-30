import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | bands', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /bands', async function (assert) {
    await visit('/bands');

    assert.equal(currentURL(), '/bands');
  });
});
