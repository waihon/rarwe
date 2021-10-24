import Route from '@ember/routing/route';

export default class BandsBandSongsRoute extends Route {
  model() {
    let band = this.modelFor('bands.band');
    return band.songs;
  }

  // Ember's routing layer provides a hook that comes handy when you want to set properties
  // on the controller: setupController. As we can access the band in the route, we can
  // leverage the hook to set it.
  setupController(controller) {
    super.setupController(...arguments);
    controller.set('band', this.modelFor('bands.band'));
  }
}
