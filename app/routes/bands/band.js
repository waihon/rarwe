import Route from '@ember/routing/route';

export default class BandsBandRoute extends Route {
  model(params) {
    // modelFor fetches the model of a parent route that had already
    // been activated.
    let bands = this.modelFor('bands');
    return bands.find((band) => band.id == params.id);
  }
}
