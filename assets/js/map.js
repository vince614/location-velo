class GoogleMap {

    /**
     * Contruct map object
     * @param position
     * @param selectorId
     */
    constructor(position, selectorId) {
        this.position = position;
        this.element = $("#" + selectorId)[0];
        this.icon = "assets/icons/map/green.png";
    }

    /**
     * Init map
     */
    initMap() {
        this.map = new google.maps.Map(this.element, {
            center: this.position,
            zoom: 16
        });
        this.initStation();
    }

    /**
     * Init connection to stations class
     */
    initStation() {
        this.stationsClass = new Stations();
        this.stationsClass.getAllStations().then(response => {
            this.setStations(response);
        });
    }

    /**
     * Set stations in map
     * @param response
     */
    setStations(response) {
        response.forEach(station => {
            this.createMarker(station);
        })
    }

    /**
     * Create marker in map
     * @param station
     */
    createMarker(station) {
        let self = this;
        this.marker = new google.maps.Marker({
            position: station.position,
            map: self.map,
            title: station.name,
            icon: self.icon,
            status: station.status,
            availableBikes: station.available_bikes,
        });

        //Color of markers
        if (this.marker.availableBikes < 10) this.marker.icon = "assets/icons/map/orange.png";
        if (this.marker.availableBikes <= 0 || this.marker.status === "CLOSED") this.marker.icon = "assets/icons/map/red.png";

    }

    updateMarkers() {

    }

}