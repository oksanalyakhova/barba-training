import {gsap} from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

class AppJs {
  constructor() {
    this.DOM = { body: document.querySelector('body') };
    this.wrapper = this.DOM.body.querySelector('.ninjas__wrapper');
    this.list = this.DOM.body.querySelector('.ninjas__list');
    this.cards = [...this.DOM.body.querySelectorAll('.ninjas-list__item')];
    this.card = this.DOM.body.querySelector('.ninjas-list__item');

  }

  initEvents() {
    if (window.innerWidth > 1023) {
      this.horizontalScroll();
    }
  }

  horizontalScroll() {
    gsap.to(this.wrapper, {
      xPercent: -43.7,
      duration: 2,
      ease: "none",
      scrollTrigger: {
        trigger: this.wrapper,
        pin: true,
        scrub: 0.3,
        start: "top top",
        end: `+=${this.wrapper.clientWidth}`,
        invalidateOnRefresh: true
      }
    })


  }
}

const js = new AppJs();
js.initEvents();

