var _uuid;
window.onload = function() {

  // Connect with our 'service' of navigation.
  var contactsService = threads.client('contacts-service');

  // Connect with our 'service' of navigation.
  var client = threads.client('navigation-service');

  _uuid = client.id;

  // First of all every panel must be registered.
  client.method('register', 'detail', _uuid);

  // If we want to navigate to this panel, we will execute some
  // activities before navigating (for example start retrieving
  // info from contacts)
  client.on('beforenavigating', function(properties) {

    // First of all every panel must be registered.
    contactsService.method('get', properties.params.contact).then(function(contactSerialized) {
      var contact = JSON.parse(contactSerialized);
      /////////////////JORGE: Small patch/////////////////
      contact.published = new Date(contact.published);
      contact.updated = new Date(contact.updated);
      contact.bday = new Date(contact.bday);
      contact.anniversary = new Date(contact.anniversary);
      /////////////////JORGE: Small patch/////////////////
      loadContact(contact);
    });
  });

  // Add listener to the 'back' button
  document.getElementById('details-view-header').addEventListener(
    'action',
    function() {
      client.method(
        'goto',
        _uuid,
        {
          destination: 'list',
          effect: 'right'
        }
      );
      // No need to wait, due to no animation is needed in Detail
      client.method('navigationready');
    }
  )
}