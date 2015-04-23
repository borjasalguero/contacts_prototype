/*global threads*/

threads.manager({
  'navigation-service': {
    src: 'services/navigation.js',
    type: 'worker'
  },
  'contacts-service': {
    src: 'services/contacts.html',
    type: 'window'
  }
});