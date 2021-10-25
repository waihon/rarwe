import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Band from 'rarwe/models/band';
import { inject as service } from '@ember/service';
import fetch from 'fetch';

export default class BandsNewController extends Controller {
  @service catalog;
  @service router;

  @tracked name;

  @action
  updateName(event) {
    this.name = event.target.value;
  }

  @action
  async saveBand() {
    let response = await fetch('/bands', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
      // The payload must be a JSON:API representation of the resource to be
      // created: data with type and attributes.
      body: JSON.stringify({
        data: {
          type: 'bands',
          attributes: {
            name: this.name,
          },
        },
      }),
    });
    let json = await response.json();
    // Creating the id of the band has now become the responsibility of the
    // backend: the response contains a top-level id and the attributes.
    let { id, attributes } = json.data;
    let record = new Band({ id, ...attributes });
    this.catalog.add('band', record);
    this.router.transitionTo('bands.band.songs',id);
  }
}
