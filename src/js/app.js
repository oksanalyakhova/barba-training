import barba from '@barba/core';
import {gsap} from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// helpers
const prevAll = element => {
  const prevElements = []
  let prevElement = element

  while(prevElement.previousElementSibling) {
    prevElements.push(prevElement.previousElementSibling)
    prevElement = prevElement.previousElementSibling
  }
  return prevElements
}

const nextAll = element => {
  const nextElements = []
  let nextElement = element

  while(nextElement.nextElementSibling) {
    nextElements.push(nextElement.nextElementSibling)
    nextElement = nextElement.nextElementSibling
  }
  return nextElements
}

// App
class AppJs {
  constructor() {
    this.DOM = { body: document.querySelector('body') };
    this.wrapper = this.DOM.body.querySelector('.ninjas__wrapper');
    this.list = this.DOM.body.querySelector('.ninjas__list');
    this.cards = [...this.DOM.body.querySelectorAll('.ninjas-list__item')];
    this.card = this.DOM.body.querySelector('.ninjas-list__item');

    this.scrollMessage = this.DOM.body.querySelector('.scroll-message');
    this.textLetters =  [...this.DOM.body.querySelectorAll('.text-letters')];
    this.windowWidth = window.innerWidth;
  }

  initEvents() {
    this.splitLetters();
    this.animateLetters();
    this.hideScrollMessage();
    this.barbaTransition();

    if (window.innerWidth > 1023 && this.list) {
      this.horizontalScroll();
    }
  }

  splitLetters() {
    this.textLetters.forEach((el) => {
      const thisEl = el;
      thisEl.innerHTML = thisEl.innerText
        .replace(/./g,"<span class='letter-wrap'><span class='letter' data-letter='$&'>$&</span></span>")
        .replace(/\s/g, ' ');
    });
  }

  animateLetters() {
    const letters = [...this.DOM.body.querySelectorAll('.letter')];
    gsap.from(letters, {
      duration: 1.25,
      opacity: 0,
      scale: 0,
      y: -100,
      rotationX: -180,
      transformOrigin: '0% 50% -50',
      ease: 'back',
      stagger: 0.05,
      repeat: -1
    }, '+=0');
  }

  hideScrollMessage() {
    gsap.to(this.scrollMessage, {
      autoAlpha: 0,
      duration: 0.5,
      ease: 'none',
      scrollTrigger: {
        trigger: this.wrapper,
        scrub: true,
        start: 'top top',
        end: '+=200',
        invalidateOnRefresh: true
      }
    })
  }

  horizontalScroll() {
    gsap.to(this.wrapper, {
      xPercent: -43.7,
      duration: 2,
      ease: 'none',
      scrollTrigger: {
        trigger: this.wrapper,
        pin: true,
        scrub: 0.3,
        start: 'top top',
        end: `+=${this.wrapper.clientWidth}`,
        invalidateOnRefresh: true
      }
    })
  }

  barbaTransition() {
    const th = this;
    barba.init({
      transitions: [{
        name: 'opacity-transition',
        from: {
          namespace: ['home']
        },
        sync: true,
        leave(data) {
          return new Promise(resolve => {
            const clicked = data.trigger;

            // animate
            const {left} = clicked.getBoundingClientRect();
            const cloned = clicked.cloneNode(true);

            cloned.classList.add('is-cloned');
            data.current.container.appendChild(cloned);

            const tl = gsap.timeline({onComplete: resolve});
            tl.set(cloned, {
              x: left,
            }, 0);

            const img = cloned.querySelector('.ninja__img');
            const title = cloned.querySelector('.ninja__title');

            tl
              .to(cloned, {
                duration: 0.5,
                x: 0,
                width: window.innerWidth,
              }, 0)
              .to(img, {
                duration: 0.5,
                x: 0,
              }, 0)
              .to(title, {
                duration: 0.5,
                autoAlpha: 0,
                y: 100,
              }, 0);

            // animate prev / next els
            const prevEls = prevAll(clicked);
            const nextEls = nextAll(clicked);

            if (prevEls.length) {
              const prevElsLeft = prevEls[0].getBoundingClientRect().left;

              tl.to(prevEls, {
                duration: 0.5,
                x: -(th.windowWidth * 0.4444 + prevElsLeft)
              }, 0);
            }

            if (nextEls.length) {
              const nextElsLeft = nextEls[0].getBoundingClientRect().left;

              tl.to(nextEls, {
                duration: 0.5,
                x: nextElsLeft
              }, 0);
            }

            // scroll to top
            window.scrollTo(0, 0);
          })
        },
        enter(data) {
          return new Promise(resolve => {
            const theTitle = data.next.container.querySelector('.about__title');
            const tl = gsap.timeline({onComplete: resolve});
            tl.from(theTitle, {
              autoAlpha: 0
            });
          })
        }
      }]
    })
  };


}

const js = new AppJs();
js.initEvents();

