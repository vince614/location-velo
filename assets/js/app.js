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
        // Init booking button
        $('.bookingButton').click(() => {
            if (this.googleMap.selectedStation.length !== 0) {

                // If station no have available bikes
                if (this.googleMap.selectedStation.available_bikes <= 0) return this.swalError("Cette station n'as plus de vélos libre, veuillez en choisir une autre.");

                if (!sessionStorage.reservedStation) {
                    return this.openForm();
                }
                return this.swalError('Vous avez déjà réservé une station !<br/><br/>Vous devez annuler votre ancienne réservation pour en faire une nouvelle.');
            }
            return this.swalError('Veuillez sélectionner une station !');
        });

        // Check if existing reservedStation
        if (sessionStorage.reservedStation) {
            let station = JSON.parse(sessionStorage.reservedStation);
            this.showBooking(station);
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
                if (!this.validation(firstName) || !this.validation(lastName)) Swal.showValidationMessage('Veuillez utilisez uniquement des lettres');
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
     * Form validation
     * @param str
     * @return {boolean}
     */
    validation(str) {
        return /^[a-zA-Z]+$/.test(str);
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
        sessionStorage.reservedTime = 30000;
    }

    /**
     * Start countDown
     */
    startCountDown() {
        let self = this;
        setInterval(() => {
            sessionStorage.reservedTime--;
            let minutes = self.component(sessionStorage.reservedTime,60) % 60,
                seconds = self.component(sessionStorage.reservedTime,1) % 60,
                time = 0;

            //Time left
            minutes >= 2 ? time = minutes + "min " + seconds + "s" : time = seconds + "s";
            this.timeLeft.text(time);

            //Reset reserved station when time epired
            if (sessionStorage.reservedTime <= 0) {
                self.clearSession();
            }
        }, 1000);
    }

    /**
     * Clear session
     */
    clearSession() {
        sessionStorage.removeItem('reservedStation');
        sessionStorage.removeItem('reservedTime');
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
                        self.clearSession();
                        self.cancelBooking();
                        self.swalSuccess('Votre réservation à été annuler.');
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
     * Cancel booking
     */
    cancelBooking() {
        this.statusBooking.removeClass('green');
        this.statusBooking.addClass('red');
        this.statusBooking.text('Pas de réservation');
        this.bookingDescription.css('display', 'flex');
        this.infos.hide();
        this.cancelButton.hide();
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