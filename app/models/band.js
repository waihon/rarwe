import { tracked } from '@glimmer/tracking';

export default class Band {
  @tracked name;
  @tracked songs;

  constructor({ id, name, songs }, relationships = {}) {
    this.id = id;
    this.name = name;
    this.songs = songs || [];
    // Store the (songs) relationship link for each band when we create them.
    // This way, we can load the data for the related relationship when we
    // need to by fetching data from the stored URL.
    this.relationships = relationships;
  }
}
