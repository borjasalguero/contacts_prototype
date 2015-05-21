window.onload = function() {
  var client = threads.client('navigation-service');



  // Set the right views
  var views = Config.originalUI;
  if (views.length > 0) {
    if (views.indexOf('detail') !== -1 || views.indexOf('all') !== -1) {
      document.getElementById('detail-iframe').src = 'view/original-detail/index.html';
    }

    if (views.indexOf('list') !== -1 || views.indexOf('all') !== -1) {
      document.getElementById('list-iframe').src = 'view/original-list/index.html';
    }
  }


  client.method('registerContentWrapper', client.id);

  // Listen about requests of navigation
  client.on('navigate', function(params) {
    Navigation.go(params.from, params.to, params.effect).then(function() {
      client.method('navigationend');
    });
  });
}