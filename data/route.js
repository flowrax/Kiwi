document.addEventListener('DOMContentLoaded', () => {
    if (!window.blogs || window.blogs.length === 0) {
        console.warn('Geen blogs gevonden voor de kaart.');
        return;
    }

    // Kaart initialiseren, gecentreerd op de eerste blog
    const map = L.map('map').setView([window.blogs[0].lat, window.blogs[0].lng], 6);

    // OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Markers toevoegen
    window.blogs.forEach(blog => {
        L.marker([blog.lat, blog.lng])
         .addTo(map)
         .bindPopup(`<strong>${blog.title}</strong><br>${blog.description || ''}`);
    });

    // Route tekenen (lijn tussen de punten)
    const routeLatLngs = window.blogs.map(blog => [blog.lat, blog.lng]);
    const polyline = L.polyline(routeLatLngs, {color: 'blue', weight: 3}).addTo(map);

    // Zoom zodat alles zichtbaar is
    map.fitBounds(polyline.getBounds());
});
