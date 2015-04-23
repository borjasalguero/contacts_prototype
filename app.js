

window.onload = function() {
  var list = document.getElementById('list-iframe');
  var detail = document.getElementById('detail-iframe');


  var client = threads.client('navigation-service');

  // Listen about requests of navigation
  client.on('navigate', function(params) {
    Navigation.go(params.from, params.to, params.effect).then(function() {
      client.method('navigationend');
    });
  });
}