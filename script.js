import gasp from 'gasp';
import { ScrollTrigger } from 'gsap/all';
import { SplitText } from 'gsap/all';
import Lenis from 'lenis';

document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time*1000);
    });
    gsap.ticker.lagSmoothing(0);

    const spotlightImages = document.querySelector('.spotlight-image');
    const maskContainer = document.querySelector('.mask-container');
    const maskImage = document.querySelector('.mask-image');
    const maskHeader = document.querySelector('.mask-container .header h1');

    const spotlightContainerHeight = spotlightImages.offsetHeight;
    const viewportHeight = window.innerHeight;
    const initialOffset = spotlightContainerHeight * 0.05;
    const totalMovement = spotlightContainerHeight + viewportHeight + initialOffset;

    let headerSplit = null;
    if(maskHeader){
        headerSplit = SplitText.create(maskHeader, {
            type: 'words',
            wordsClass: 'spotlight-word',
    });
    gsap.set(headerSplit.words, {opacity: 0});
    }

    ScrollTrigger.create({
        trigger: ".spotlight",
        start: 'top top',
        end: `+=${window.innerHeight * 7}px`,
        pin: true,
        scrub: 1,
        pinSpacer: true,

    });
});

