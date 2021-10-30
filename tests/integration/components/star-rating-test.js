import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | star-rating', function (hooks) {
  setupRenderingTest(hooks);

  test('Renders the full and empty stars correctly', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    this.set('rating', 4);
    // Handle any actions with this.set('myAction', function(val) { ... });
    this.set('updateRating', () => {});

    await render(hbs`
      <StarRating
        @rating={{this.rating}}
        @onUpdate={{this.updateRating}}
      />
    `);

    assert
      .dom('[data-test-rr="full-star"]')
      .exists({ count: 4 }, 'The right amount of full stars is rendered');
    assert
      .dom('[data-test-rr="empty-star"]')
      .exists({ count: 1 }, 'The right amount of empty stars is rendered');

    // The way Ember.js sets up components tests makes it very convenient to change
    // properties in the context and see how the rendered component changes: we just
    // have to set properties on this.
    this.set('rating', 2);

    assert
      .dom('[data-test-rr="full-star"]')
      .exists({ count: 2 }, 'The right amount of full stars is rendered');
    assert
      .dom('[data-test-rr="empty-star"]')
      .exists({ count: 3 }, 'The right amount of empty stars is rendered');
  });
});
