import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  // If the project has Ember Data models, Mirage auto detects them and
  // manually creating Mirage model is not necessary.
  //
  // Simple properties don't need to be defined, but defining relationships
  // gives us a few methods on the relationship property we can use to set up
  // our data hierarchy.
  songs: hasMany(),
});
