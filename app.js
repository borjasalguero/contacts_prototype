var isOriginalUI;

function loadView(isOriginalUI) {
  if (isOriginalUI) {
    document.getElementById('detail-iframe').src = 'view/original-detail/index.html';
    document.getElementById('list-iframe').src = 'view/original-list/index.html';
  } else {
    document.getElementById('detail-iframe').src = 'view/detail/index.html';
    document.getElementById('list-iframe').src = 'view/list/index.html';
  }
}


function register() {
  navigator.serviceWorker.register('sw.js').then(function() {
    console.log('SW Registered properly!');
    window.location.reload();
  });

}

window.onload = function() {
  // Register SW if needed
  navigator.serviceWorker.getRegistration().then(function(req) {
    if (!req) {
      register();
    } else {
      // Boot the navigation
      var client = threads.client('navigation-service');
      // Render the right panels based on the configuration
      isOriginalUI = Config.originalUI;
      loadView(isOriginalUI);

      // Listen about requests of navigation
      client.method('registerContentWrapper', client.id);
      client.on('navigate', function(params) {
        Navigation.go(params.from, params.to, params.effect).then(function() {
          // TODO Remove me when Navigation will be ready
          if (params.to !== 'list') {
            document.querySelector('#change-view-button').style.display = 'none';
          } else {
            document.querySelector('#change-view-button').style.display = 'block';
          }
          client.method('navigationend');
        });
      });

      // Add listeners for 'tap' actions in the list
      document.querySelector('#change-view-button').addEventListener(
        'click',
        function() {
          isOriginalUI = !isOriginalUI;
          loadView(isOriginalUI);
        }
      );
    }
  })
}