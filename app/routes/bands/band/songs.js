import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class BandsBandSongsRoute extends Route {
  @service catalog;

  queryParams = {
    sortBy: {
      as: 's',
    },
    searchTerm: {
      // Search term is almost universally denoted by q
      as: 'q',
    },
  };

  async model() {
    let band = this.modelFor('bands.band');
    await this.catalog.fetchRelated(band, 'songs');
    return band;
  }

  // Each controller class only has one single instance in the application.
  // Ember provides a specific hook to update controller properties when moving
  // between routes. It's called on the route every time a route transition is
  // initiated.
  resetController(controller) {
    controller.title = '';
    controller.showAddSong = true;
  }
}
