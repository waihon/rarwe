import { click, fillIn } from '@ember/test-helpers';

// There is nothing special about a custom test helper.
// It's just a JavaScript module with an exported function.
export async function createBand(name) {
  await click('[data-test-rr="new-band-button"]');
  await fillIn('[data-test-rr="new-band-name"]', name);
  await click('[data-test-rr="save-band-button"]');
}
