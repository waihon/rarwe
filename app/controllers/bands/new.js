import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class BandsNewController extends Controller {
  @service catalog;
  @service router;

  @tracked name;

  constructor() {
    super(...arguments);
    // The on method creates a listener that can be torn down by calling off on the same
    // object, with the same method.
    // The advantage of having added our listener on the controller is that we don't
    // have to bother tearing it down. The controller is only created once and lives
    // as long as the app is not close, so we're fine.
    // However, if we added the listener on a component, we'd have to take care to
    // properly unregister it.
    this.router.on('routeWillChange', (transition) => {
      if (transition.isAborted) {
        // When transition.aborted() is called below, an aborted transition is created
        // and that also triggers the routeWillChange event. Consequently, we have to check
        // whether the transition is an aborted one, and then bail out early.
        return;
      }
      if (this.confirmedLeave) {
        // If the flag was set to true below as a result of clicking OK on the confirm dialog,
        // we just let the transition happen.
        return;
      }
      // transition.from is the source route object (the route we're moving away from),
      // while transition.to is the one we're hoping to reach.
      // Here, we only care about moving away from this route.
      if (transition.from.name === 'bands.new') {
        if (this.name) {
          let leave = window.confirm('You have unsaved changes. Are you sure?');
          // When the user clicks the OK button on the dialog
          if (leave) {
            // The transition.to may invoke router.transitionTo resulting in the same
            // transition.from.
            // In our case, clicking a bank link initiates a transition from bands.new
            // to bands.band.index, and then the router.transitionTo there aborts that one
            // and starts one from bands.new to bands.band.details (or bands.band.songs,
            // depending on the band).
            // To prevent the confirm dialog from being brought up twice, we set a flag
            // that will be checked at the beginning of this event.
            this.confirmedLeave = true;
          } else {
            transition.abort();
          }
        }
      }
    });
  }

  @action
  updateName(event) {
    this.name = event.target.value;
  }

  @action
  async saveBand() {
    let band = await this.catalog.create('band', { name: this.name });
    // Bypass the confirmation dialog which is displayed as a result of
    // transitioning from bands.new to another route.
    this.confirmedLeave = true;
    this.router.transitionTo('bands.band.songs', band.id);
  }
}
