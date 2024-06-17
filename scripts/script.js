gsap.registerPlugin(EasePack)
gsap.registerPlugin(ScrollTrigger)
import { SplitText } from './splitText.js'

const MasterTimeline = gsap.timeline({ repeatDelay: 1 });

function InitFlickerWords(cls, dur) {
    cls.forEach((el) => {
        el.classList.toggle('visible')
        let text = new SplitText(el);
        let flickerEase = "rough({ template: circ.easeOut, strength: 4, points: 50, taper: 'out', randomize: true, clamp:  true})";
        gsap.from(text.words, {
            autoAlpha: 0,
            duration: dur,
            stagger: { each: 0.01, from: "random" },
            ease: flickerEase,
        });

    })
}

function InitFlickerChar(cls, dur) {
    cls.forEach((el) => {
        el.classList.toggle('visible')
        let text = new SplitText(el);
        let flickerEase = "rough({ template: circ.easeOut, strength: 4, points: 50, taper: 'out', randomize: true, clamp:  true})";
        gsap.from(text.chars, {
            autoAlpha: 0,
            duration: dur,
            stagger: { each: 0.05, from: "random" },
            ease: flickerEase
        });
    })
}

function InitFlickerInfinite(cls, dur) {
    let text = new SplitText(cls);
    let flickerEase = "rough({ template: circ.easeOut, strength: 4, points: 50, taper: 'out', randomize: true, clamp:  true})";
    gsap.from(text.words, {
        autoAlpha: 0,
        duration: dur,
        stagger: { each: 0.01, from: "random" },
        ease: flickerEase,
        repeat: -1
    });
}

function isInView(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const windowScrollY = window.scrollY;

    return (
        rect.top <= windowHeight + windowScrollY &&
        rect.bottom >= windowScrollY
    );
}

function initMagneticButtons() {

    // Magnetic Buttons
    // Inspired By: https://codepen.io/tdesero/pen/RmoxQg
    var magnets = document.querySelectorAll('.magnetic');
    var strength = 100;

    // START : If screen is bigger as 540 px do magnetic
    if (window.innerWidth > 540) {
        // Mouse Reset
        magnets.forEach((magnet) => {
            magnet.addEventListener('mousemove', moveMagnet);
            magnet.addEventListener('mouseleave', function (event) {
                gsap.to(event.currentTarget, 1.5, {
                    x: 0,
                    y: 0,
                    ease: Elastic.easeOut
                });
                gsap.to($(this).find(".btn-text"), 1.5, {
                    x: 0,
                    y: 0,
                    ease: Elastic.easeOut
                });
            });
        });

        // Mouse move
        function moveMagnet(event) {
            var magnetButton = event.currentTarget;
            var bounding = magnetButton.getBoundingClientRect();
            var magnetsStrength = magnetButton.getAttribute("data-strength");
            var magnetsStrengthText = magnetButton.getAttribute("data-strength-text");

            gsap.to(magnetButton, 1.5, {
                x: (((event.clientX - bounding.left) / magnetButton.offsetWidth) - 0.5) * magnetsStrength,
                y: (((event.clientY - bounding.top) / magnetButton.offsetHeight) - 0.5) * magnetsStrength,
                rotate: "0.001deg",
                ease: Power4.easeOut
            });
            gsap.to($(this).find(".btn-text"), 1.5, {
                x: (((event.clientX - bounding.left) / magnetButton.offsetWidth) - 0.5) * magnetsStrengthText,
                y: (((event.clientY - bounding.top) / magnetButton.offsetHeight) - 0.5) * magnetsStrengthText,
                rotate: "0.001deg",
                ease: Power4.easeOut
            });
        }

    }; // END : If screen is bigger as 540 px do magnetic

    // Mouse Enter
    $('.btn-click.magnetic').on('mouseenter', function () {
        if (!$('.menu-btn').hasClass('active')) {
            if ($(this).find(".btn-fill").length) {
                gsap.to($(this).find(".btn-fill"), .6, {
                    startAt: { y: "76%" },
                    y: "0%",
                    ease: Power2.easeInOut
                });
            }
        }
        if ($(this).find(".btn-text-inner.change").length) {
            gsap.to($(this).find(".btn-text-inner.change"), .3, {
                startAt: { color: "#1C1D20" },
                color: "#FFFFFF",
                ease: Power3.easeIn,
            });
        }
        $(this.parentNode).removeClass('not-active');
    });

    // Mouse Leave
    $('.btn-click.magnetic').on('mouseleave', function () {
        if (!$('.menu-btn').hasClass('active')) {
            if ($(this).find(".btn-fill").length) {
                gsap.to($(this).find(".btn-fill"), .6, {
                    y: "-76%",
                    ease: Power2.easeInOut
                });
            }
        }
        if ($(this).find(".btn-text-inner.change").length) {
            gsap.to($(this).find(".btn-text-inner.change"), .3, {
                color: "#1C1D20",
                ease: Power3.easeOut,
                delay: .3
            });
        }
        $(this.parentNode).removeClass('not-active');
    });
}

function InitTypeWriter(selector) {
    const duration = 0.17;
    const lettersAndSymbols = ["A", "B", "C", "1", "2", "3"];
    const textElements = document.querySelectorAll(selector);

    if (textElements.length === 0) return;

    textElements.forEach(textElement => {
        const textContent = textElement.textContent.trim();
        textElement.innerHTML = textContent.split('').map(char => {
            if (char === ' ') {
                return ' ';
            }
            return `<span class="char">${char}</span>`;
        }).join('');

        const chars = textElement.querySelectorAll(".char");

        const animations = Array.from(chars).map((char, position) => {
            const initialText = char.textContent;

            return gsap.fromTo(
                char,
                { opacity: 0 },
                {
                    duration: 0.06,
                    onUpdate: () => {
                        char.textContent = lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
                    },
                    repeat: 1,
                    repeatRefresh: true,
                    opacity: 1,
                    repeatDelay: 0,
                    onComplete: () => {
                        char.textContent = initialText;
                    },
                    delay: position * duration
                }
            );
        });

        gsap.timeline().add(animations).add(() => {
            // Restore the original text content after the animation
            textElement.textContent = textContent;
        });
    });
}

function InitMenu() {

    const container = document.querySelector('.content-container');
    const nav = document.querySelector('nav');

    container.addEventListener('scroll', () => {
        if (isInView(nav)) {
            let b = document.querySelector('.menu-btn');
            gsap.to(b, {
                scale: 0,
                duration: 0.3,
                ease: Expo.Out
            })
        }
        else {
            let b = document.querySelector('.menu-btn');
            gsap.to(b, {
                scale: 1,
                duration: 0.3,
                ease: Expo.Out
            })
        }
    });

    const btn = document.querySelector('.menu-btn');

    function initMenuButton() {
        const btn = document.querySelector('.menu-btn');
        const line = btn.querySelectorAll('img');
        const fill = btn.querySelector('.btn-fill');
        const menu = document.querySelector('.menu');
        const links = menu.querySelectorAll('.menu-links');

        if (btn.classList.contains('active')) {
            gsap.to(line[0], {
                rotateZ: 0,
                y: 0,
                duration: 0.2
            });
            gsap.to(line[1], {
                rotateZ: 0,
                y: 0,
                duration: 0.2
            });
            gsap.to(fill, {
                y: "-76%",
                ease: Power2.easeInOut
            })
            gsap.to(menu, {
                x: '50%',
                duration: 1,
                ease: Expo.easeInOut
            })
            gsap.to(menu, {
                BorderRadius: '50',
                duration: 0.5,
                ease: Expo.easeInOut,
                delay: 0.2
            })
            btn.classList.remove('active');
            container.classList.remove('no-scroll');
        } else {
            gsap.to(line[0], {
                rotateZ: '-45',
                y: 3.5,
                duration: 0.2
            });
            gsap.to(line[1], {
                rotateZ: '45',
                y: -3.5,
                duration: 0.2
            });
            gsap.to(fill, {
                startAt: { y: '76%' },
                y: '0%',
                ease: Power2.easeInOut
            })
            gsap.to(menu, {
                startAt: { x: '50%' },
                x: '0%',
                duration: 1,
                ease: Expo.easeInOut
            })
            gsap.to(menu, {
                BorderRadius: '0',
                duration: 0.5,
                ease: Expo.easeInOut,
                delay: 0.2
            })
            gsap.to(links[0], {
                startAt: { x: '40%' },
                x: '0%',
                duration: 0.5,
                ease: Expo.easeInOut,
                delay: 0.3
            })
            gsap.to(links[1], {
                startAt: { x: '40%' },
                x: '0%',
                duration: 0.5,
                ease: Expo.easeInOut,
                delay: 0.325
            })
            gsap.to(links[2], {
                startAt: { x: '40%' },
                x: '0%',
                duration: 0.5,
                ease: Expo.easeInOut,
                delay: 0.35
            })
            gsap.to(links[3], {
                startAt: { x: '40%' },
                x: '0%',
                duration: 0.5,
                ease: Expo.easeInOut,
                delay: 0.375
            })
            btn.classList.add('active');
            container.classList.add('no-scroll');
        }
    }

    btn.addEventListener('click', initMenuButton);
}

// INTRO AND LOADING SCREEN

window.onload = function () {

    setTimeout(function () {
        document.querySelector("#a").classList.toggle('active-1');
    }, 0);

    setTimeout(function () {
        document.querySelector("#b").classList.toggle('active-1');
    }, 100);

    setTimeout(function () {
        document.querySelector("#c").classList.toggle('active-1');
    }, 200);


    setTimeout(function () {
        document.querySelector('.logo').classList.toggle('active');
    }, 1200);

    setTimeout(function () {
        document.querySelector('#a').classList.toggle('active-2');
        document.querySelector('#b').classList.toggle('active-2');
        document.querySelector('#c').classList.toggle('active-2');
        document.querySelector('#t').classList.toggle('active');
    }, 2200);

    setTimeout(function () {
        document.querySelector('.logo').classList.toggle('active-2');
        document.querySelector('#t').classList.toggle('active-2');

        setTimeout(function () {
            document.querySelector('.logo').classList.toggle('hide');
            document.querySelector('#t').classList.toggle('hide');
        }, 300);
    }, 3300);


    // Intro layer
    setTimeout(function () {
        document.querySelector('.intro-1').classList.add('active');
    }, 3200); // 1st intro lifts off immediately

    setTimeout(function () {
        document.querySelector('.intro-2').classList.add('active');
    }, 3300); // 2nd intro lifts off 200ms after 1st intro

    setTimeout(function () {
        document.querySelector('.intro-3').classList.add('active');
    }, 3350); // 3rd intro lifts off 200ms after 2nd intro

    setTimeout(function () {
        document.querySelector('.intro-4').classList.add('active');
    }, 3400); // 4th intro lifts off 200ms after 3rd intro
}

// CALL FUNCTIONS

function InitFirstLoad() {

    const FlickerWords = document.querySelectorAll('.flickword');

    const FlickerChars = document.querySelectorAll('.flickchar');

    MasterTimeline.add(() => InitTypeWriter('.decode'));
    MasterTimeline.add(() => InitFlickerWords(FlickerWords, 1), 0.5);
    MasterTimeline.add(() => InitFlickerChar(FlickerChars, 2), 0.5);
    MasterTimeline.add(() => initMagneticButtons());

    // initMenu();
}


window.onload = function () {
    InitFirstLoad();
};