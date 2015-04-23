importScripts('../app/libs/components/threads/threads.js');

var panels = {};
var effect = '';
var current, future;


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

function S4() {
  return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

function guuid() {
  // then to call it, plus stitch in '4' in the third group
  var guid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
  return guid;
}

var service = threads.service('navigation-service')
  .method('goto', function(uuid, params, sync) {
    current = getPanelByUUID(uuid);
    future = params.destination;
    effect = params.effect;

    // I send all params to 'to' panel in order to render it
    // asap
    service.broadcast('beforenavigating', {
      uuid: panels[params.destination],
      params: params.params
    });

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
    });
  })
  .method('navigationend', function(uuid, params) {
    service.broadcast('navigationend', {
      uuid: panels[future],
      previous: current
    });
  })
  // Register every panel. 'alias' must be the ID of the panel
  .method('register', function(alias) {
    var uuid = guuid();
    panels[alias] = uuid;
    return uuid;
  });
