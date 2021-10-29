import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class BandNavigationComponent extends Component {
  @service router;

  get isActive() {
    return {
      // router.isActive needs not only the route name but also all route models
      // for that route (if there are any). For example, our bands.band route
      // is only ever active for one specific band, so it makes sense that the
      // band needs to be passed in to that method.
      details: this.router.isActive('bands.band.details', this.args.band),
      songs: this.router.isActive('bands.band.songs', this.args.band),
    };
  }
}
