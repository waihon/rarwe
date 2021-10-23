import Component from '@glimmer/component';

export default class StarRatingComponent extends Component {
  get maxRating() {
    return this.args.maxRating ?? 5;
  }

  // We need to define a stars property because in Ember templates,
  // results of function calls cannot be rendered.
  get stars() {
    let stars = [];
    for (let i = 1; i <= this.maxRating; i++) {
      stars.push({
        rating: i,
        full: i <= this.args.rating,
      });
    }
    return stars;
  }
}
