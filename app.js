var isMasterShown = true;
window.onload = function() {
  // TODO Change navigation based on Chris approach
  var client = threads.client('navigation-service');
  client.method('registerContentWrapper', client.id);

  var detailIframe = document.getElementById('detail').querySelector('iframe');
  function navigate(params) {
    var from = isMasterShown ? 'master':'detail';
    var to = !isMasterShown ? 'master':'detail';
    if (isMasterShown) {
      history.pushState({}, to, params.to);
    } else{
      history.back();
    }

    Navigation.go(from, to, params.effect).then(function() {
      client.method('navigationend');
      if (!isMasterShown) {
        detailIframe.src = '';
      }
      isMasterShown = !isMasterShown;

    });
  }

  // Listen about requests of navigation
  client.on('navigate', function(params) {
    if (isMasterShown) {
      detailIframe.src = params.to;
      detailIframe.onload = function() {
        detailIframe.onload = null;
        navigate(params);
      }
    } else {
      navigate(params);
    }
  });
}