class Slider {
    /**
     * Contructor
     */
    constructor(settings) {
        this.def = {
            target: this.$('.slider'),
            dotsWrapper: this.$('.dots-wrapper'),
            arrowLeft: this.$('.arrow-left'),
            arrowRight: this.$('.arrow-right'),
            transition: {
                speed: 300,
                easing: ''
            },
            swipe: true,
            autoHeight: true,
            afterChangeSlide: function afterChangeSlide() {}
        };

        this.$extendObj(this.def, settings);
        this.init();
    }

    /**
     * Target element
     * @param elem
     * @return {elem}
     */
    $(elem) {
        return document.querySelector(elem);
    }

    /**
     * Check if element has class
     * @param el
     * @param className
     * @return {boolean}
     */
    hasClass(el, className) {
        return el.classList ? el.classList.contains(className) : new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    }

    /**
     * Add class to element
     * @param el
     * @param className
     */
    addClass(el, className) {
        if (el.classList) {
            el.classList.add(className);
        } else {
            el.className += ' ' + className;
        }
    }

    /**
     * Remove class from element
     * @param el
     * @param className
     */
    removeClass(el, className) {
        if (el.classList) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    /**
     * Extend Obj
     * @param _def
     * @param addons
     */
    $extendObj(_def, addons) {
        if (typeof addons !== "undefined") {
            for (let prop in _def) {
                if (addons[prop] !== undefined) {
                    _def[prop] = addons[prop];
                }
            }
        }
    }

    /**
     * Builds all dots
     */
    buildDots() {
        /**
         * Self instance
         * @type {Slider}
         */
        let self = this;

        for (let i = 0; i < self.totalSlides; i++) {
            let dot = document.createElement('li');
            dot.setAttribute('data-slide', i + 1);
            self.def.dotsWrapper.appendChild(dot);
        }

        self.def.dotsWrapper.addEventListener('click', function (e) {
            if (e.target && e.target.nodeName === "LI") {
                self.curSlide = e.target.getAttribute('data-slide');
                self.gotoSlide();
            }
        }, false);
    }

    getCurLeft() {
        let self = this;
        self.curLeft = parseInt(self.sliderInner.style.left.split('px')[0]);
    }

    gotoSlide() {
        let self = this;
        self.sliderInner.style.transition = 'left ' + self.def.transition.speed / 1000 + 's ' + self.def.transition.easing;
        self.sliderInner.style.left = -self.curSlide * self.slideW + 'px';
        self.addClass(self.def.target, 'isAnimating');
        setTimeout(function () {
            self.sliderInner.style.transition = '';
            self.removeClass(self.def.target, 'isAnimating');
        }, self.def.transition.speed);
        self.setDot();
        if (self.def.autoHeight) {
            self.def.target.style.height = self.allSlides[self.curSlide].offsetHeight + "px";
        }
        self.def.afterChangeSlide(self);
    }

    init() {
        let self = this;
        function on_resize(c, t) {
            onresize = function() {
                clearTimeout(t);
                t = setTimeout(c, 100);
            };
            return onresize;
        }

        function loadedImg(el) {
            let loaded = false;
            function loadHandler() {
                if (loaded) {
                    return;
                }
                loaded = true;
                self.loadedCnt++;
                if (self.loadedCnt >= self.totalSlides + 2) {
                    self.updateSliderDimension();
                }
            }
            var img = el.querySelector('img');
            if (img) {
                img.onload = loadHandler;
                img.src = img.getAttribute('data-src');
                img.style.display = 'block';
                if (img.complete) {
                    loadHandler();
                }
            } else {
                self.updateSliderDimension();
            }
        }

        // wrap slider-inner
        let nowHTML = self.def.target.innerHTML;
        self.def.target.innerHTML = '<div class="slider-inner">' + nowHTML + '</div>';

        self.allSlides = 0;
        self.curSlide = 0;
        self.curLeft = 0;
        self.totalSlides = self.def.target.querySelectorAll('.slide').length;

        self.sliderInner = self.def.target.querySelector('.slider-inner');
        self.loadedCnt = 0;

        // append clones
        let cloneFirst = self.def.target.querySelectorAll('.slide')[0].cloneNode(true);
        self.sliderInner.appendChild(cloneFirst);
        let cloneLast = self.def.target.querySelectorAll('.slide')[self.totalSlides - 1].cloneNode(true);
        self.sliderInner.insertBefore(cloneLast, self.sliderInner.firstChild);

        self.curSlide++;
        self.allSlides = self.def.target.querySelectorAll('.slide');

        //this.def.target.style.height = "1px";
        self.sliderInner.style.width = (self.totalSlides + 2) * 100 + "%";
        for (let thisi = 0; thisi < self.totalSlides + 2; thisi++) {
            self.allSlides[thisi].style.width = 100 / (self.totalSlides + 2) + "%";
            loadedImg(self.allSlides[thisi]);
        }

        self.buildDots();
        self.setDot();
        self.initArrows();

        function addListenerMulti(el, s, fn) {
            s.split(' ').forEach(function (e) {
                return el.addEventListener(e, fn, false);
            });
        }
        function removeListenerMulti(el, s, fn) {
            s.split(' ').forEach(function (e) {
                return el.removeEventListener(e, fn, false);
            });
        }

        if (self.def.swipe) {
            addListenerMulti(self.sliderInner, 'mousedown touchstart', startSwipe);
        }

        self.isAnimating = false;

        function startSwipe(e) {
            let touch = e;
            self.getCurLeft();
            if (!self.isAnimating) {
                if (e.type === 'touchstart') {
                    touch = e.targetTouches[0] || e.changedTouches[0];
                }
                self.startX = touch.pageX;
                self.startY = touch.pageY;
                addListenerMulti(self.sliderInner, 'mousemove touchmove', swipeMove);
                addListenerMulti(self.$('body'), 'mouseup touchend', swipeEnd);
            }
        }

        function swipeMove(e) {
            var touch = e;
            if (e.type === 'touchmove') {
                touch = e.targetTouches[0] || e.changedTouches[0];
            }
            self.moveX = touch.pageX;
            self.moveY = touch.pageY;

            // for scrolling up and down
            if (Math.abs(self.moveX - self.startX) < 40) return;

            self.isAnimating = true;
            self.addClass(self.def.target, 'isAnimating');
            e.preventDefault();

            if (self.curLeft + self.moveX - self.startX > 0 && self.curLeft === 0) {
                self.curLeft = -self.totalSlides * self.slideW;
            } else if (self.curLeft + self.moveX - self.startX < -(self.totalSlides + 1) * self.slideW) {
                self.curLeft = -self.slideW;
            }
            self.sliderInner.style.left = self.curLeft + self.moveX - self.startX + "px";
        }

        function swipeEnd(e) {
            let touch = e;
            self.getCurLeft();

            if (Math.abs(self.moveX - self.startX) === 0) return;

            self.stayAtCur = Math.abs(self.moveX - self.startX) < 40 || typeof self.moveX === "undefined";
            self.dir = self.startX < self.moveX ? 'left' : 'right';

            if (self.stayAtCur) {} else {
                self.dir === 'left' ? self.curSlide-- : self.curSlide++;
                if (self.curSlide < 0) {
                    self.curSlide = self.totalSlides;
                } else if (self.curSlide === self.totalSlides + 2) {
                    self.curSlide = 1;
                }
            }

            self.gotoSlide();

            delete self.startX;
            delete self.startY;
            delete self.moveX;
            delete self.moveY;

            self.isAnimating = false;
            self.removeClass(self.def.target, 'isAnimating');
            removeListenerMulti(self.sliderInner, 'mousemove touchmove', swipeMove);
            removeListenerMulti(self.$('body'), 'mouseup touchend', swipeEnd);
        }
    }

    initArrows() {
        let self = this;

        if (self.def.arrowLeft) {
            self.def.arrowLeft.addEventListener('click', function () {
                if (!self.hasClass(self.def.target, 'isAnimating')) {
                    if (self.curSlide === 1) {
                        self.curSlide = self.totalSlides + 1;
                        self.sliderInner.style.left = -self.curSlide * self.slideW + 'px';
                    }
                    self.curSlide--;
                    setTimeout(function () {
                        self.gotoSlide();
                    }, 20);
                }
            }, false);
        }

        if (self.def.arrowRight) {
            self.def.arrowRight.addEventListener('click', function () {
                if (!self.hasClass(self.def.target, 'isAnimating')) {
                    if (self.curSlide === self.totalSlides) {
                        self.curSlide = 0;
                        self.sliderInner.style.left = -self.curSlide * self.slideW + 'px';
                    }
                    self.curSlide++;
                    setTimeout(function () {
                        self.gotoSlide();
                    }, 20);
                }
            }, false);
        }
    }

    setDot() {
        let self = this;

        let tardot = self.curSlide - 1;

        for (let j = 0; j < self.totalSlides; j++) {
            self.removeClass(self.def.dotsWrapper.querySelectorAll('li')[j], 'active');
        }

        if (self.curSlide - 1 < 0) {
            tardot = self.totalSlides - 1;
        } else if (self.curSlide - 1 > self.totalSlides - 1) {
            tardot = 0;
        }
        self.addClass(self.def.dotsWrapper.querySelectorAll('li')[tardot], 'active');
    }

    updateSliderDimension() {
        let self = this;

        self.slideW = parseInt(self.def.target.querySelectorAll('.slide')[0].offsetWidth);
        self.sliderInner.style.left = -self.slideW * self.curSlide + "px";

        if (self.def.autoHeight) {
            self.def.target.style.height = self.allSlides[self.curSlide].offsetHeight + "px";
        } else {
            for (let i = 0; i < self.totalSlides + 2; i++) {
                if (self.allSlides[i].offsetHeight > self.def.target.offsetHeight) {
                    self.def.target.style.height = self.allSlides[i].offsetHeight + "px";
                }
            }
        }
        self.def.afterChangeSlide(self);
    }
}

let slider = new Slider();