var dependencies = [
 '/contacts/js/activities.js',
 '/shared/js/contacts/utilities/event_listeners.js',
 //'/contacts/js/navigation.js',
 '/contacts/js/views/list.js'
];

// If the cache is enabled, we push lazy loading l10n to the extreme,
// cause we will be applying the transalations manually from the cached
// content.
// Otherwise, we load the l10n scripts along with the rest of the JS
// scripts. This will avoid the non localized text to appear in the screen.
if (!Cache.active) {
  dependencies.push('/shared/js/l10n.js');
  dependencies.push('/shared/js/l10n_date.js');
}

LazyLoader.load(dependencies, () => {
  ['/shared/js/async_storage.js',
   '/shared/js/contacts/import/utilities/config.js',
   '/contacts/js/utilities/extract_params.js',
   '/contacts/js/utilities/cookie.js',
   '/shared/js/contact_photo_helper.js',
   '/shared/js/text_normalizer.js',
   '/shared/js/contacts/utilities/templates.js'].forEach((src) => {
    var scriptNode = document.createElement('script');
    scriptNode.src = src;
    scriptNode.setAttribute('defer', true);
    document.head.appendChild(scriptNode);
  });
  //return LazyLoader.load('/contacts/js/contacts.js');
});

///////////////////////////////////////////

var contactsDetails = null;

var SHARED = 'shared';
var SHARED_PATH = '/' + SHARED + '/' + 'js';

var SHARED_UTILS = 'sharedUtilities';
var SHARED_UTILS_PATH = SHARED_PATH + '/contacts/import/utilities';

LazyLoader.load(['/contacts/js/views/details.js'], function() {
  LazyLoader.load(
    [SHARED_UTILS_PATH + '/misc.js',
     //'/dialer/js/telephony_helper.js',
     '/shared/js/contacts/sms_integration.js',
     '/shared/js/contacts/contacts_buttons.js'],
  function() {
    contactsDetails = contacts.Details;
    contactsDetails.init();
    getContactById("9edc6f0ee5da4851ae9721efbbfcce44", function findCb(contact, fbContact) {
    // Enable NFC listening is available
    /*
    if ('mozNfc' in navigator) {
      contacts.NFC.startListening(contact);
    }
    */

    var currentContact = contact;
    console.info(currentContact);
    var currentFbContact = fbContact;

    if (ActivityHandler.currentActivityIsNot(['import'])) {
      if (ActivityHandler.currentActivityIs(['pick'])) {
        ActivityHandler.dataPickHandler(currentFbContact || currentContact);
      }
      return;
    }

    contactsDetails.render(currentContact, currentFbContact);
    /*
    if (contacts.Search && contacts.Search.isInSearchMode()) {
      navigation.go('view-contact-details', 'go-deeper-search');
    } else {
      navigation.go('view-contact-details', 'go-deeper');
    }
    */
  });
  });
});

//////////////////////////////////////////////

var getContactById = function(contactID, successCb, errorCb) {
  if (!contactID) {
    successCb();
    return;
  }

  var options = {
    filterBy: ['id'],
    filterOp: 'equals',
    filterValue: contactID
  };
  var request = navigator.mozContacts.find(options);

  request.onsuccess = function findCallback(e) {
    var result = e.target.result[0];
    successCb(result, null);
    /*
    if (!fb.isFbContact(result)) {
      successCb(result);
      return;
    }

    var fbContact = new fb.Contact(result);
    var fbReq = fbContact.getData();
    fbReq.onsuccess = function() {
      successCb(result, fbReq.result);
    };
    fbReq.onerror = successCb.bind(null, result);
    */
  }; // request.onsuccess

  if (typeof errorCb === 'function') {
    request.onerror = errorCb;
  }
};