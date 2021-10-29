import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class BandsBandIndexRoute extends Route {
  @service router;

  // We need to make the redirection in the bands.band route based on
  // whether the band has a description or not.
  // There are two ways to do this.
  // In cases where the model of the route is not needed in order to decide
  // on the redirection, we can use the beforeModel hook. One common use case
  // is authentication: if the user is not properly authenticated to see the
  // page, we can already redirect them at this point.
  // In case the model is needed for the redirection, the proper place to do
  // the redirection is the aptly named redirect hook which gets passed the
  // resolved model as the first parameter.
  redirect(band) {
    // router.transitionTo implicitly cancels the current transition (if there's one)
    // and starts a new one.
    // In this case, router.transitionTo aborts the transition to bands.band.index,
    // and starts one to bands.band.details or bands.band.songs, depending on the band.
    if (band.description) {
      this.router.transitionTo('bands.band.details');
    } else {
      this.router.transitionTo('bands.band.songs');
    }
  }
}
