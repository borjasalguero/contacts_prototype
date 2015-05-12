window.onload = function() {
  var client = threads.client('navigation-service');
  client.method('registerContentWrapper', client.id);

  // Listen about requests of navigation
  client.on('navigate', function(params) {
    Navigation.go(params.from, params.to, params.effect).then(function() {
      client.method('navigationend');
    });
  });
}