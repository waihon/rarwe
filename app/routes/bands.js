import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class BandsRoute extends Route {
  @service catalog;

  @action
  loading() {
    window.alert("Loading the bands and/or songs, ok?");
  }

  async model() {
    return this.catalog.fetchAll('bands');
  }
}
