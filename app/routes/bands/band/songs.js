import Route from '@ember/routing/route';

export default class BandsBandSongsRoute extends Route {
  // The default implementation of the model hook is to return the model of the
  // parent route. Since we need the band as the model, that suits us perfectly.

  // Each controller class only has one single instance in the application.
  // Ember provides a specific hook to update controller properties when moving
  // between routes. It's called on the route every time a route transition is
  // initiated.
  resetController(controller) {
    controller.title = '';
    controller.showAddSong = true;
  }
}
