var _uuid;
window.onload = function() {
  // Retrieve header from DOM
  var header = document.querySelector('header');
  var infoContainer = document.querySelector('#info-container');

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
    // Clean styles before rendering anything new
    infoContainer.innerHTML = '';
    header.style.background = '';
    header.classList.remove('image-hack'); // XXX Remove hack for image

    // Update title properly
    header.querySelector('span').textContent = properties.params.title;

    if (!!properties.params.url) {
      header.style.backgroundImage = 'url("' + properties.params.url +'")';
      header.classList.add('image-hack');
    } else {
      header.style.background = '' + properties.params.color;
    }

    // First of all every panel must be registered.
    contactsService.method('get', properties.params.contact).then(function(contactSerialized) {
      // XXXX Optimize this when ready
      var contact = JSON.parse(contactSerialized);

      var infoHeader = document.createElement('h2');
      infoHeader.textContent = 'Name';
      var infoUL = document.createElement('ul');
      infoUL.innerHTML = '<li>' + contact.name[0] + '</li>';

      infoContainer.appendChild(infoHeader);
      infoContainer.appendChild(infoUL);


      if (contact.email && contact.email.length > 0) {
        var emailHeader = document.createElement('h2');
        emailHeader.textContent = 'Email/s';
        var emailUL = document.createElement('ul');
        for (var i = 0; i < contact.email.length; i++) {
          emailUL.innerHTML += '<li>' + contact.email[i].value + '</li>';
        }


        infoContainer.appendChild(emailHeader);
        infoContainer.appendChild(emailUL);
      }

      if (contact.tel && contact.tel.length > 0) {
        var telHeader = document.createElement('h2');
        telHeader.textContent = 'Phone number/s';
        var telUL = document.createElement('ul');
        for (var i = 0; i < contact.tel.length; i++) {
          telUL.innerHTML += '<li>' + contact.tel[i].value + '</li>';
        }

        infoContainer.appendChild(telHeader);
        infoContainer.appendChild(telUL);
      }
    });
  });

  // Add listener to the 'back' button
  document.getElementById('back-button').addEventListener(
    'click',
    function() {
      client.method(
        'goto',
        _uuid,
        {
          destination: 'list',
          effect: 'fade'
        }
      );
      // No need to wait, due to no animation is needed in Detail
      client.method('navigationready');
    }
  )
}