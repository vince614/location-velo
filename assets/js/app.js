class App {

    /**
     * Contructor
     */
    constructor(safeMode = false) {
        this.initSelectors();
        if (safeMode) return;
        this.googleMap = new GoogleMap(
            {
                lat: 45.7579502,
                lng: 4.8001016
            },
            "mapContainer"
        );
        this.slider = new Slider();
        this.init();
    }

    /**
     * Init
     */
    init() {
        //Init booking button
        $('.bookingButton').click(() => {
            if (this.googleMap.selectedStation.length !== 0) {
                if (!sessionStorage.reservedStation) {
                    return this.openForm();
                }
                return this.swalError('Vous avez déjà réservé une station !<br/><br/>Vous devez annuler votre ancienne réservation pour en faire une nouvelle.');
            }
            return this.swalError('Veuillez sélectionner une station !');
        });

        // Check if existing reservedStation
        if (sessionStorage.reservedStation) {
            this.restoreReservedStation();
        }
    }

    /**
     * Init selectors
     */
    initSelectors() {
        this.statusBooking = $('#statusBooking');
        this.reservedStationAdresse = $('#reservedStationAdresse');
        this.reservedStationName = $('#reservedStationName');
        this.infos = $('.infos');
        this.cancelButton = $('#cancelButton');
        this.bookingDescription = $('#bookingDescription');
        this.timeLeft = $('#timeLeft');
    }

    /**
     * Restore station
     */
    restoreReservedStation() {
        console.log("OK!");
    }

    /**
     * Booking form
     */
    openForm() {
        Swal.fire({
            title: 'Réservation',
            html: '<input type="text" id="firstName" class="swal2-input" placeholder="Entrez votre prénom"/>' +
                  '<input type="text" id="lastName" class="swal2-input" placeholder="Entrez votre nom"/>',
            confirmButtonText: 'Réserver !',
            preConfirm: () => {
                let firstName = Swal.getPopup().querySelector('#firstName').value;
                let lastName = Swal.getPopup().querySelector('#lastName').value;
                if (firstName === '' || lastName === '') Swal.showValidationMessage(`Veuillez renseigner votre nom et votre prénom`);
                return {
                    firstName: firstName, lastName: lastName
                }
            }
        }).then((result) => {
            // Local storage
            localStorage.firstName = result.value.firstName;
            localStorage.lastName = result.value.lastName;
            // Session storage
            sessionStorage.reservedStation = JSON.stringify(this.googleMap.selectedStation);
            this.openCanvas();
        })
    }

    /**
     * Open canvas
     */
    openCanvas() {
        this.canvas = new Canvas('canvas');
    }

    /**
     * Confirm canvas
     */
    confirm() {
        let station = JSON.parse(sessionStorage.reservedStation);
        this.showBooking(station);
        this.reservedTime = Math.round(Date.now() / 1000);
    }

    /**
     * Start countDown
     */
    startCountDown() {
        let self = this;
        setInterval(() => {
            self.reservedTime--;
            let minutes = self.component(self.reservedTime,60) % 60,
                seconds = self.component(self.reservedTime,1) % 60,
                time = 0;

            //Time left
            minutes >= 2 ? time = minutes + "min " + seconds + "s" : time = seconds + "s";
            this.timeLeft.text(time);

            //Reset reserved station when time epired
            if (self.reservedTime <= 0) sessionStorage.reservedStation = [];
        }, 1000);
    }

    /**
     * Component
     * @param x
     * @param v
     * @return {number}
     */
    component(x, v) {
        return Math.floor(x / v);
    }

    /**
     * Init cancel button
     */
    initCancelButton() {
        let self = this;
        this.cancelButton.click(() => {
            if (sessionStorage.reservedStation) {
                Swal.fire({
                    title: 'Êtes vous sur ?',
                    text: "Annuler votre réservation",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Oui, supprimé là!'
                }).then((result) => {
                    if (result.value) {
                        //Remove item from sessionStorage
                        sessionStorage.removeItem('reservedStation');
                        Swal.fire(
                            'Deleted!',
                            'Votre réservation à été annuler.',
                            'success'
                        )
                    }
                })
            }
        });
    }

    /**
     * Show booking
     */
    showBooking(station) {
        this.statusBooking.removeClass('red');
        this.statusBooking.addClass('green');
        this.statusBooking.text('Réservation en cours');
        this.reservedStationAdresse.text(station.address);
        this.reservedStationName.text(station.name);
        this.infos.css('display', 'flex');
        this.cancelButton.css('display', 'flex');
        this.bookingDescription.hide();
        this.startCountDown();
        this.initCancelButton();
    }

    /**
     * Swal error
     * @param msg
     */
    swalError(msg) {
        Swal.fire({
            icon: 'error',
            title: 'Erreur !',
            html: msg
        })
    }

    /**
     * Swal success
     * @param msg
     */
    swalSuccess(msg) {
        Swal.fire({
            icon: 'success',
            title: 'Succès !',
            text: msg
        });
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