importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.0.0/workbox-sw.js");

if (workbox) {
	console.log("Ajua! Workbox está cargado! :) ");
	workbox.precaching.precacheAndRoute([]);

	/*Caché de imagenes en la carpeta por ejemplo "others", editamos a otras carpetas que se obtuvieron y configuramos en el archivo sw.js*/
	workbox.routing.registerRoute(
		/(.*)others(.*)\.(?:png|gif|jpg)/,
		new workbox.strategies.CacheFirst({
			cacheName: "images",
			plugins: [
				new workbox.expiration.Plugin({
					maxEntries: 50,
					maxAgeSeconds: 30 * 24 * 60 * 60,
				})
			]
		})
	);
	
	/* Hacemos que el contenido JS, CSS, SCSS sean rápidos devolviendo los "assets" de la caché, mientras se asegura que se actualizan en segundo plano para su proximo uso*/
	workbox.routing.registerRoute(
		//Caché de JS, CSS y SCSS
		/.*\.(?:css|js|scss|)/,
		//Usamos el caché temporal y actualizamos en segundo plano los nuevos cambios lo antes posible.
		new workbox.strategies.StaleWhileRevalidate({
			//Usamos el nombre de un caché personalizado.
			cacheName: "assets",
		})
	);

	// Caché de fuentes de Google
	workbox.routing.registerRoute(
		new RegExp("https://fonts.(?:googleapis|gstatic).com/(.*)"),
		new workbox.strategies.CacheFirst({
			cacheName: "google-fonts",
			plugins: [
				new workbox.cacheableResponse.Plugin({
					statuses: [0,200],
				}),
			],
		})
	);

	// Agregar un análisis offline
	workbox.googleAnalytics.initialize();

	/* Instalar un nuevo Service Worker y hacer que actualice y controle la página Web lo antes posible. */
	workbox.core.skipWaiting();
	workbox.core.clientsClaim();		
} else {
	console.log("¡Fallo! Workbox no está cargado. ): ");
}