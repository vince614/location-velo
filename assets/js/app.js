class App {

    /**
     * Contructor
     */
    constructor() {
        this.googleMap = new GoogleMap(
            {
                lat: 45.7579502,
                lng: 4.8001016
            },
            "mapContainer"
        );
        this.slider = new Slider();
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