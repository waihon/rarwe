import Route from '@ember/routing/route';

export default class BandsNewRoute extends Route {
  resetController(controller) {
    controller.name = '';
    // Reset confirmedLeave to false to make sure that when the user revisits
    // the bands.new page, the warning code will run again. If it is still true,
    // the warning will be short-circuited which is not what we want.
    controller.confirmedLeave = false;
  }
}
