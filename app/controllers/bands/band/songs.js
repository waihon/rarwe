import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class BandsBandSongsController extends Controller {
  @tracked showAddSong = true;
  @tracked title = '';
  @tracked sortBy = 'title';
  @tracked searchTerm = '';

  @service catalog;

  get matchingSongs() {
    let searchTerm = this.searchTerm.toLowerCase();
    return this.model.songs.filter((song) => {
      return song.title.toLowerCase().includes(searchTerm);
    });
  }

  get sortedSongs() {
    let sortBy = this.sortBy;
    let isDescendingSort = false;
    if (sortBy.charAt(0) === '-') {
      // Exclude '-' by extracting from position 1 (2nd position), and to the end.
      sortBy = this.sortBy.slice(1);
      isDescendingSort = true;
    }
    // We have to make sure that sorting happens on the filtered songs. It would be
    // wasteful (on larger lists) to first sort all the items, only to hve most
    // of them filtered out by the search expression.
    //
    // The sort function in JavaScript takes a "compare" function.
    // If the first item is smaller, it needs to return a negative value.
    // If the second, a positive value. If they are equal, zoro.
    // Also, sort mutates the array it's called on, so to be safe, we make
    // a copy by using [...this.model.songs] for example.
    // Besides, it also returns the sorted array.
    return this.matchingSongs.sort((song1, song2) => {
      if (song1[sortBy] < song2[sortBy]) {
        return isDescendingSort ? 1 : -1;
      }
      if (song1[sortBy] > song2[sortBy]) {
        return isDescendingSort ? -1 : 1;
      }
      return 0;
    });
  }

  @action
  updateTitle(event) {
    this.title = event.target.value;
  }

  @action
  updateSearchTerm(event) {
    this.searchTerm = event.target.value;
  }

  @action
  async updateRating(song, rating) {
    song.rating = rating;
    // As this is a PATCH request, we only need to send the changes: the new rating
    // { rating } is a shorthand for { rating: rating }
    this.catalog.update('song', song, { rating });
  }

  @action
  async saveSong() {
    let song = await this.catalog.create(
      'song',
      { title: this.title },
      // The designation of a related record by specifying its id and type
      // is called "resource linkage" in the JSON:API vocabulary.
      // this.model refers to the parent route's model by default, i.e. band
      { band: { data: { id: this.model.id, type: 'bands' } } }
    );
    this.model.songs = [...this.model.songs, song];
    this.title = '';
    this.showAddSong = true;
  }

  @action
  cancel() {
    this.title = '';
    this.showAddSong = true;
  }
}
