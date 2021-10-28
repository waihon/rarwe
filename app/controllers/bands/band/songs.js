import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import fetch from 'fetch';

export default class BandsBandSongsController extends Controller {
  @tracked showAddSong = true;
  @tracked title = '';

  @service catalog;

  @action
  updateTitle(event) {
    this.title = event.target.value;
  }

  @action
  async updateRating(song, rating) {
    song.rating = rating;
    let payload = {
      data: {
        id: song.id,
        type: 'songs',
        // As this is a PATCH request, we only need to send the changes: the new rating
        attributes: {
          rating
        }
      }
    };
    await fetch(`/songs/${song.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/vnd.api+json'
      },
      body: JSON.stringify(payload)
    });
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
