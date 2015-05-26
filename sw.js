importScripts('sw/sww.js');
importScripts('sw/sww-raw-cache.js');

// Render Cache
var worker = new ServiceWorkerWare(/*We can add a 'resolver' in the near future*/);

// The render cache improves the performance of the most expensive part of
// the app by caching the rendered view for the specific movie.
worker.use('.*', new RawCache({ cacheName: 'RenderCache' }));
worker.use('.*', function (req, res) {
  return res ? Promise.resolve(res) : fetch(req);
});

worker.init();
