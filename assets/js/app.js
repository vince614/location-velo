class App {

    /**
     * Contructor
     */
    constructor() {
        this.googleMap = new GoogleMap(
            {
                lat: 43.295334,
                lng: 5.374407
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