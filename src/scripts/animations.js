import { gsap } from "gsap/dist/gsap";

import ScrollTrigger from "gsap/dist/ScrollTrigger";
import ScrollToPlugin from "gsap/dist/ScrollToPlugin";
import { ExpoScaleEase } from "gsap/all";


gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

function animateFrom(elem, direction) {
    direction = direction | 1;
    var x = 0,
        y = direction * 100;
    if(elem.classList.contains("gs_reveal_fromLeft")) {
      x = -100;
      y = 0;
    } ExpoScaleEase;
    if(elem.classList.contains("gs_reveal_fromRight")) {
      x = 100;
      y = 0;
    }
    gsap.fromTo(elem, {x: x, y: y, autoAlpha: 0}, {
      duration: 1.25,
      x: 0,
      y: 0,
      autoAlpha: 1,
      ease: "expo",
      overwrite: "auto"
    });
  }

  function hide(elem) {
    gsap.set(elem, {autoAlpha: 0});
  }

  document.addEventListener("DOMContentLoaded", function() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray(".gs_reveal").forEach(function(elem) {
      hide(elem); // assure that the element is hidden when scrolled into view

      ScrollTrigger.create({
        trigger: elem,
        /* eslint-disable */
        onEnter: function() { animateFrom(elem) },
        onEnterBack: function() { animateFrom(elem, -1) },
        onLeave: function() { hide(elem) }
      });
    });
  });


// Animation: Fade In
const fadeIn = document.querySelectorAll('.fade-in');
if (fadeIn) {
    fadeIn.forEach(value => {
        gsap.fromTo(value, {
            autoAlpha: 0,
        }, {
            autoAlpha    : 1,
            ease         : 'power2.inOut',
            duration     : 1.5,
            scrollTrigger: {
                trigger      : value,
                markers      : false,
                start        : 'top 90%',
                toggleActions: 'play none none none'
            }
        });
    });
}
