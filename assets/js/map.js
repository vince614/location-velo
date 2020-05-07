class GoogleMap {

    /**
     * Contruct map object
     * @param position
     * @param selectorId
     */
    constructor(position, selectorId) {
        this.position = position;
        this.element = $("#" + selectorId)[0];
        this.icon = "icons/map/green.png";
    }

    /**
     * Init map
     */
    initMap() {
        this.map = new google.maps.Map(this.element, {
            center: this.position,
            zoom: 16
        });
    }
}