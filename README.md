# rarwe

This README outlines the details of collaborating on this Ember application.
A short introduction of this app could easily go here.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Ember CLI](https://ember-cli.com/)
* [Google Chrome](https://google.com/chrome/)

## Installation

* `git clone <repository-url>` this repository
* `cd rarwe`
* `npm install`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Linting

* `npm run lint`
* `npm run lint:fix`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.

## Further Reading / Useful Links

* [ember.js](https://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

## Terminal Commands

### 2. Ember CLI

* `node -v`
* `npm install -g ember-cli`
* `ember --version`
* `ember new rarwe --no-welcome`
* `cd rarwe`
* `ember server`

### 3. Templates and Data Bindings

* `npm install -D tailwindcss`
* `npm install -D ember-cli-postcss`
* `ember server`

### 4. Routing

* `ember g route bands`
* `ember g route songs`

### 5.  Nestered Routes

* `ember g route bands/band --path=':id'`
* `ember g template bands/index`
* `ember g template bands/band/songs`
* `ember destroy route songs`

### 6. Components

* `ember g component star-rating --with-component-class`
* `ember i @fortawesome/ember-fontawesome`
* `npm install -D @fortawesome/free-regular-svg-icons @fortawesome/free-solid-svg-icons`
* `ember server`
* `ember i ember-set-helper`
* `ember server`

### 7. Controllers

* `ember g controller bands/band/songs`
* `ember g route bands/new`
* `ember g controller bands/new`

### 8. Building a Catalog

* `ember g service catalog`
* `ember i tracked-built-ins`
* `ember s`

### 9. Talking to a Back-end

* `ember s --proxy=http://json-api.rockandrollwithemberjs.com`
  (http is used instead of https as the latter is not compatible with localhost)
* `npm uninstall ember-data`

### 10. Advanced Routing

* `ember g route bands/band/details`
* `ember g route bands/band/index`
* `ember g component band-navigation`
* `ember g component-class band-navigation`
* `ember g component band-list --with-component-class`

### 11. Testing

* `ember t --server`
* `ember g acceptance-test bands`
* `ember install ember-cli-mirage`
* `ember g mirage-model band`
* `ember install ember-test-selectors`
* `ember g component-test star-rating`
* `ember g service-test catalog`

### 12. Query Params

* `ember g acceptance-test songs`
