import { helper } from '@ember/component/helper';
// We use the `as` keyword in the import statement because the @ember/string
// module also has a capitalize export and we don't want it to clash with the
// new capitalize function.
import { capitalize as emberCapitalize } from '@ember/string';

// The imported helper function takes an ordinary function and wraps it so that
// the helper function establishes a binding. If the property passed to the
// helper changes, the helper rerenders its output.
export default helper(function capitalize(input) {
  // Positional arguments of a helper are passed in as an array (helpers can also
  // take multiple positional arguments). We only take one string, so we take the
  // first value in the array, i.e. input[0].
  // The passed-in value (which can be the name of a band or a song title) is split
  // apart on whitespace and then joined together by single spaces after each word
  // has been made to start with a capital letter.
  // We only call capitalize on the first character of each word because we want to
  // allow songs that are in all caps, like MFC from Pearl Jam. If we called
  // capitalize on each full word, users would not be able to create such a
  // song title.
  let words = input[0].split(/\s+/).map((word) => {
    return emberCapitalize(word.charAt(0)) + word.slice(1);
  });
  return words.join(' ');
});
