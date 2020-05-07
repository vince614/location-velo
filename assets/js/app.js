class App {

    /**
     * Contructor
     */
    constructor() {
        this.googleMap = new GoogleMap(
            {
                lat: 48.866667,
                lng: 2.333333
            },
            "mapContainer"
        );
    }

    /**
     * Init map
     */
    initMap() {
        this.googleMap.initMap();
    }
}

/**
 * Init map function
 */
function initMap() {
    new App().initMap();
}