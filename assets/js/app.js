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
        this.init();
    }

    /**
     * Init
     */
    init() {
        //Init booking button
        $('.bookingButton').click(() => {
            if (this.googleMap.selectedStation.length !== 0) {
                return this.openForm()
            }
            return this.swalError('Veuillez sélectionner une station !');
        });
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
            sessionStorage.firstName = result.value.firstName;
            sessionStorage.lastName = result.value.lastName;
            sessionStorage.selectedStation = JSON.stringify(this.googleMap.selectedStation);
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
     * Swal error
     * @param msg
     */
    swalError(msg) {
        Swal.fire({
            icon: 'error',
            title: 'Erreur !',
            text: msg
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