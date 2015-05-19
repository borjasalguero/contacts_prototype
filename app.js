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



window.onload = function() {
  var client = threads.client('navigation-service');

  isOriginalUI = Config.originalUI;
  loadView(isOriginalUI);

  client.method('registerContentWrapper', client.id);

  // Listen about requests of navigation
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