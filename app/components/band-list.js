import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class BandListComponent extends Component {
  @service router;

  get bands() {
    // this.args.bands is an argument that was passed in by component invoker
    return this.args.bands.map((band) => {
      // Each item will have access both to the band itself (via the band property)
      // and whether it's the active route.
      return {
        band,
        isActive: this.router.isActive('bands.band', band),
      };
    });
  }
}
