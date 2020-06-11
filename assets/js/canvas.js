class Canvas {

    constructor(selectorId) {
        this.paint = false;
        this.canvas  = $('#' + selectorId);
        this.context = this.canvas[0].getContext('2d');
        this.started = false;
        this.cursorX = null;
        this.cursorY= null;
        this.sign = false;
        this.hideElements();
        this.init();
    }

    /**
     * Init
     */
    init() {
        this.canvas.show();

        //Enable desktop & mobile draw
        this.desktopDraw();
        this.mobileDraw();

        //Clear canvas
        $('#clear').click(() => {
            this.clearCanvas();
        });

        //Confirm canvas
        $('#confirm').click(() => {
            this.confirm();
        });
    }

    /**
     * Desktop draw
     */
    desktopDraw() {
        this.canvas.mouseup(() => {
            this.paint = false;
            this.started = false;
        }).bind(this);

        this.canvas.mousedown(() => {
            this.paint = true;
        }).bind(this);

        this.canvas.mousemove((mouse) => {
            if (!this.paint) return;
            if (!this.started) {
                this.started = true;
            } else {
                this.context.beginPath();
                this.context.moveTo(this.cursorX , this.cursorY);
                this.context.lineTo(mouse.offsetX, mouse.offsetY);
                this.context.strokeStyle = "rgb(50, 50, 50)";
                this.context.lineWidth = 4;
                this.context.closePath();
                this.context.stroke();
                this.sign = true;
            }
            this.cursorX = mouse.offsetX;
            this.cursorY = mouse.offsetY;
        }).bind(this);
    }

    /**
     * Mobile draw
     */
    mobileDraw() {
        this.canvas.on('touchstart', () => {
            this.paint = true;
            this.started = false;
        }).bind(this);

        this.canvas.on('touchend', () => {
            this.paint = false;
        }).bind(this);

        this.canvas.on('touchmove', (touch) => {
            touch.preventDefault();
            if (this.paint) {
                if (!this.started) {
                    this.started = true;
                } else {
                    this.newCursorX = touch.touches[0].pageX - touch.touches[0].target.offsetLeft;
                    this.newCursorY = touch.touches[0].pageY - touch.touches[0].target.offsetTop;
                    this.context.beginPath();
                    this.context.moveTo(this.cursorX , this.cursorY);
                    this.context.lineTo(this.newCursorX, this.newCursorY);
                    this.context.strokeStyle = "rgb(23, 145, 167)";
                    this.context.lineWidth = 4;
                    this.context.closePath()
                    this.context.stroke();
                    this.sign = true;
                }
                this.cursorX = this.newCursorX;
                this.cursorY = this.newCursorY;
            }
        }).bind(this);
    }

    /**
     * Clear canvas
     */
    clearCanvas() {
        this.context.clearRect(0,0, this.canvas[0].width, this.canvas[0].height);
        this.sign = false;
    }

    /**
     * Confirm sign
     */
    confirm() {
        let station = JSON.parse(sessionStorage.selectedStation);
        this.swalSuccess('Votre réservation à la station ' + station.name + ' à été effectué !');
        this.showElements();
    }

    /**
     * Hide HTML elements
     */
    hideElements() {
        $('.bookingInfos').hide();
        $('.bookingValidation').hide();
        $('.canvasButtonsContainer').css('display', 'flex');
    }

    /**
     * Show elements
     */
    showElements() {
        $('.bookingInfos').show();
        $('.bookingValidation').show();
        $('.canvasButtonsContainer').hide();
        this.canvas.hide();
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
}