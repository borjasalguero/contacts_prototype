importScripts('../app/libs/components/threads/threads.js');

var panels = {};
var effect = '';
var current, future;
var contentWrapper;


function getPanelByUUID(uuid) {
  var panelName = '';
  Object.keys(panels).forEach(function(key) {
    if (panels[key] === uuid) {
      panelName = key;
      return false;
    }
  });
  return panelName;
}

var service = threads.service('navigation-service')
  .method('goto', function(uuid, params, sync) {
    current = getPanelByUUID(uuid);
    future = params.destination;
    effect = params.effect;

    // I send all params to 'to' panel in order to render it
    // asap
    service.broadcast(
      'beforenavigating', {
        params: params.params
      },
      [panels[params.destination]]
    );

    if (sync) {
      // TODO Add SYNC behaviour
    }
  })
  .method('navigationready', function(uuid, params) {
    // Currently we are just waiting for the 'from' panel
    // TODO Add SYNC behaviour
    service.broadcast('navigate', {
      from: current,
      to: future,
      effect: effect
    },
    [contentWrapper]);
  })
  .method('navigationend', function(uuid, params) {
    service.broadcast(
      'navigationend',
      {
        previous: current
      },
      [panels[future]]
    );
  })
  // Register every panel. 'alias' must be the ID of the panel
  .method('register', function(url, uuid) {
    panels[url] = uuid;
  })
  // Register content wrapper. This will be in charge of all transitions.
  .method('registerContentWrapper', function(uuid) {
    contentWrapper = uuid;
  });
