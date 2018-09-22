const push_service_url = 'wss://watch.yield.newfish.com:4043';
const ping_interval = 30000;
const reconnect_time = 300000;
const close_code_of_abort = 4000;
const ping_tag = 'push-ping';
const cache_api = 'cache-api';

function debug(...args) {
  console.log(...args);
}

function connect_push_service() {
  // push websocket
  let ws = new WebSocket(push_service_url);
  self.push_service = ws;
  // ping timer
  let timer;

  ws.addEventListener('open', function () {
    debug(`Socket is connected. Send ping every ${ping_interval / 1000} seconds.`);
    debug(self.registration.periodSync)
    timer = setInterval(function () {
      debug('>>> pinging');
      ws.send('ping');
    }, ping_interval);
  });

  // receive message
  ws.addEventListener('message', function (event) {
    debug('<<< receiving', event.data);
    self.registration.showNotification(event.data).catch(function (err) {
      debug(err.message);
    });
  });

  ws.addEventListener('error', function () {
    debug('Socket encountered error. Closing socket.');
    ws.close();
  });

  // release source and reconnect
  ws.addEventListener('close', function (event) {
    if (timer) {
      clearInterval(timer);
    }
    debug('Socket is closed.');
    if (event.code !== close_code_of_abort) {
      debug(`Reconnect will be attempted in ${reconnect_time / 1000} seconds.`);
      setTimeout(function () {
        connect_push_service();
      }, reconnect_time);
    }
  });
}

if (self.registration.sync) {
  debug('Sync bingo.');
  // init connection
  connect_push_service();
} else {
  debug('This browser does not support sync.');
}

self.addEventListener('install', function (event) {
  self.skipWaiting();

  event.waitUntil(async function() {
    const cache = await caches.open(cache_api);
    await cache.addAll([
      '/api/coins',
    ]);
  }());
});

self.addEventListener('sync', function (event) {
  if (event.tag === ping_tag) {
    let ws = self.push_service;
    if (ws && ws.readyState === ws.OPEN) {
      debug('>>> pinging');
      ws.send('ping');
    }
  }
});

// self.addEventListener('fetch', function (event) {
//   debug('Serving the asset:', event.request);
//   event.respondWith(async function() {
//     const cache = await caches.open(cache_api);
//     const matching = await cache.match(event.request);

//     if(matching){
//       debug('=== hit cache')
//       return matching;
//     }else{
//       debug('>>> fetching')
//       const response = await fetch(event.request);
//       cache.put(event.request, response)
//       return response;
//     }
//   }());
// });