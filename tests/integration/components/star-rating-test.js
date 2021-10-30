import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
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

  test('Calls onUpdate with the correct value', async function (assert) {
    this.set('rating', 2);
    // We don't have to use the action d ecorator to bind the context of our event handler.
    // As opposed to the "real" app, we run everything in the same context (the context of
    // the test), so there's no need to.
    this.set('updateRating', (rating) => {
      // Every time assert.step is called, it records the argument it was called with.
      assert.step(`Updated to rating: ${rating}`);
    });

    await render(hbs`
      <StarRating
        @rating={{this.rating}}
        @onUpdate={{this.updateRating}}
      />
    `);

    await click('[data-test-rr="star-rating-button"]:nth-child(4)');
    // Referring to the assert.step above, we can then verify the order and equality of
    // the arguments by calling assert.verifySteps and passing the expected values.
    // Here, we only use it for a single value but it's especially useful when wa want to
    // check the order of calls.
    assert.verifySteps(['Updated to rating: 4']);
  });
});
