var _uuid;

function getParams() {
  var params = {};
  var raw = window.location.search.split('?')[1];
  var pairs = raw.split('&');
  for (var i = 0; i < pairs.length; i++) {

    var data = pairs[i].split('=');
    params[data[0]] = data[1];
  }
  return params;
}

window.onload = function() {
  // Retrieve header from DOM
  var header = document.querySelector('header');
  var infoContainer = document.querySelector('#info-container');
  var params = getParams();

  // Update title properly
  header.querySelector('span').textContent = params.title;

  if (!!params.url) {
    header.style.backgroundImage = 'url("' + params.url +'")';
    header.classList.add('image-hack');
    document.querySelector('meta[property="og:image"').content = params.url;
  } else {
    header.style.background = '#' + params.color;
  }


  // Connect with our 'service' of navigation.
  var contactsService = threads.client('contacts-service');

  // Connect with our 'service' of navigation.
  var client = threads.client('navigation-service');
  _uuid = client.id;

  // First of all every panel must be registered.
  client.method('register', 'view/detail/index.html', _uuid);

  contactsService.method('get', params.contact).then(function(contactSerialized) {
    // XXXX Optimize this when ready
    var contact = JSON.parse(contactSerialized);

    var infoHeader = document.createElement('h2');
    infoHeader.textContent = 'Name';
    var infoUL = document.createElement('ul');
    infoUL.innerHTML = '<li>' + contact.name[0] + '</li>';
    document.querySelector('meta[property="og:title"').content = contact.name[0];

    infoContainer.appendChild(infoHeader);
    infoContainer.appendChild(infoUL);

    var description = '';
    if (contact.email && contact.email.length > 0) {
      var emailHeader = document.createElement('h2');
      emailHeader.textContent = 'Email/s';
      var emailUL = document.createElement('ul');
      for (var i = 0; i < contact.email.length; i++) {
        emailUL.innerHTML += '<li>' + contact.email[i].value + '</li>';
        description+= contact.email[i].value + ',';
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
        description+= contact.tel[i].value + ',';
      }

      infoContainer.appendChild(telHeader);
      infoContainer.appendChild(telUL);
    }

    document.querySelector('meta[property="og:description"').content = description;
  });

  // Add listener to the 'back' button
  document.getElementById('back-button').addEventListener(
    'click',
    function() {
      client.method(
        'goto',
        _uuid,
        {
          destination: 'view/list/index.html',
          effect: 'fade'
        }
      );
      // No need to wait, due to no animation is needed in Detail
      client.method('navigationready');
    }
  )
}