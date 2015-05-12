var isFirstContact = true;
var service = threads.service('contacts-service')
  .method('get', function(uuid) {
    return new Promise(function(resolve, reject) {
      var options = {
        filterBy: ['id'],
        filterOp: 'equals',
        filterValue: uuid
      };

      var request = navigator.mozContacts.find(options);

      request.onsuccess = function onsuccess(e) {
        var contact = e.target.result[0];
        if (!contact) {
          reject();
          return;
        }
        resolve(JSON.stringify(contact));
      };

      request.onerror = reject;
    });


  })
  .stream('getAll', function(stream) {
    window.parent.performance.mark('api_request_start');
    var options = {
      sortBy: 'givenName',
      sortOrder: 'ascending'
    };

    var id = Date.now();
    var cursor = navigator.mozContacts.getAll(options);
    cursor.onsuccess = function onsuccess(evt) {
      // console.log('Tenemos un contacto en el servicio');
      var contact = evt.target.result;
      if (!contact) {

        stream.close();


        return;
      }
      if (isFirstContact) {
        window.parent.performance.mark('api_contact_retrieved');
      }
      // XXX If it's not serialized it's not working!!!
      stream.write({
        contact: JSON.stringify(contact),
        photo: contact.photo
      });
      if (isFirstContact) {
        window.parent.performance.mark('api_contact_sent');

        // window.parent.performance.measure('api_contact_retrieved', 'api_request_start', 'api_contact_retrieved');
        // window.parent.performance.measure('api_contact_sent', 'api_request_start', 'api_contact_sent' );
        // console.log('*******************************')
        // console.log('** Contacts Service *');
        // var measures = window.parent.performance.getEntriesByType('measure');
        // for (var i = 0; i < measures.length; i++) {
        //   console.log('Performance: Measure "' + measures[i].name +'" was ' + measures[i].duration);
        // }
        // console.log('*******************************')
        isFirstContact = false;
      }
      cursor.continue();
    };

    cursor.onerror = function onerror(error) {
      console.log('ERROR ' + JSON.stringify(error));
    };
    return 'foo';
  });
