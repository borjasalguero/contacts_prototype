var _uuid;

window.onload = function() {

  // Navigation service
  var navigation = threads.client('navigation-service');

  _uuid = navigation.id;

  navigation.method('register', 'settings', _uuid);

  navigation.on('beforenavigating', function(params) {
   	// TODO Currently we dont need anything, but it would be useful
    // for updating the list before showing it again.
  });

  // Add listeners for 'tap' actions in the list
	document.querySelector('#back-button').addEventListener(
    'click',
    function(e) {
      navigation.method(
        'goto',
        _uuid,
        {
          destination: 'list',
          effect: 'right'
        }
      );
      // No need to wait, due to no animation is needed in Detail
      navigation.method('navigationready');
    }
  );
}