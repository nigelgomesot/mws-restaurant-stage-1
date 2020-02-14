if (navigator.serviceWorker) {
	navigator.serviceWorker.register('/sw.js').then(function(reg) {
		console.log('SW registered successfully.');
	}).catch(e => {
		console.error('SW registration failed!');
	});
}
