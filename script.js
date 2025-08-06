// Since we're loading GSAP from CDN script tags, we don't need imports
// The libraries are available globally as gsap, ScrollTrigger, etc.

document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis for smooth scrolling
    let lenis;
    
    const initLenis = () => {
        if (typeof Lenis !== 'undefined') {
            lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                direction: 'vertical',
                gestureDirection: 'vertical',
                smooth: true,
                mouseMultiplier: 1,
                smoothTouch: false,
                touchMultiplier: 2,
                infinite: false,
            });

            lenis.on('scroll', ScrollTrigger.update);
            
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            
            gsap.ticker.lagSmoothing(0);
            
            console.log('Lenis initialized successfully');
            return true;
        } else {
            console.warn('Lenis not found, trying fallback CDN...');
            return false;
        }
    };

    // Try to initialize Lenis with fallback loading
    const tryInitLenis = () => {
        if (!initLenis()) {
            // Fallback: Load Lenis from alternative CDN
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/@studio-freight/lenis@1.0.42/dist/lenis.min.js';
            script.onload = () => {
                setTimeout(() => {
                    if (!initLenis()) {
                        console.warn('All Lenis loading attempts failed, continuing without smooth scroll');
                    }
                }, 100);
            };
            script.onerror = () => {
                console.warn('Fallback Lenis loading failed, continuing without smooth scroll');
            };
            document.head.appendChild(script);
        }
    };

    // Try immediately or wait for DOM
    if (typeof Lenis !== 'undefined') {
        initLenis();
    } else {
        setTimeout(tryInitLenis, 100);
    }

    // Fixed selector to match your HTML
    const spotlightImages = document.querySelector('.spotlight-images');
    const maskContainer = document.querySelector('.mask-container');
    const maskImage = document.querySelector('.mask-container .mask-img');
    const maskHeader = document.querySelector('.mask-container .header h1');
    const spotlightHeader = document.querySelector('.spotlight .header h1');

    // Initialize mask header to be hidden
    if (maskHeader) {
        gsap.set(maskHeader, {
            opacity: 0,
            y: '20px'
        });
    }

    // Initialize spotlight header
    if (spotlightHeader) {
        gsap.set(spotlightHeader, {
            opacity: 1,
            scale: 1
        });
    }

    if (spotlightImages) {
        const spotlightContainerHeight = spotlightImages.offsetHeight;
        const viewportHeight = window.innerHeight;
        const initialOffset = spotlightContainerHeight * 0.05;
        const totalMovement = spotlightContainerHeight + viewportHeight + initialOffset;

        ScrollTrigger.create({
            trigger: ".spotlight",
            start: 'top top',
            end: `+=${window.innerHeight * 7}px`,
            pin: true,
            scrub: 1,
            pinSpacer: true,

            onUpdate: (self) => {
                const progress = self.progress;

                // Animate spotlight images movement
                if (progress < 0.5) {
                    const imageProgress = progress / 0.5;
                    const startY = 5;
                    const endY = -((totalMovement / spotlightContainerHeight) * 100);
                    const currentY = startY + (endY - startY) * imageProgress;

                    gsap.set(spotlightImages, {
                        y: `${currentY}%`
                    });
                }

                // Animate spotlight header fade out
                if (spotlightHeader) {
                    if (progress < 0.3) {
                        gsap.set(spotlightHeader, {
                            opacity: 1,
                            scale: 1,
                            y: '0px'
                        });
                    } else if (progress >= 0.3 && progress < 0.6) {
                        const fadeProgress = (progress - 0.3) / 0.3;
                        gsap.set(spotlightHeader, {
                            opacity: 1 - fadeProgress * 0.7,
                            scale: 1 - fadeProgress * 0.3,
                            y: `${fadeProgress * -30}px`
                        });
                    } else {
                        gsap.set(spotlightHeader, {
                            opacity: 0.3,
                            scale: 0.7,
                            y: '-30px'
                        });
                    }
                }

                if(maskContainer && maskHeader) {
                    if(progress > 0.25 && progress < 0.75){
                        const maskProgress = (progress - 0.25) / 0.5; // Normalize progress to 0-1 range
                        const maskSize = `${maskProgress * 450}%`; // Convert to percentage
                        const imageScale = 1.5 - maskProgress * 0.5;
                        maskContainer.style.setProperty("-webkit-mask-size", maskSize);
                        maskContainer.style.setProperty("mask-size", maskSize);

                        if(maskImage) {
                            gsap.set(maskImage, {
                                scale: imageScale
                            });
                        }

                    } else if (progress < 0.25){
                        maskContainer.style.setProperty("-webkit-mask-size", "0%");
                        maskContainer.style.setProperty("mask-size", "0%");
                        if(maskImage) {
                            gsap.set(maskImage, {
                                scale: 1.5
                            });
                        }
                    } else if (progress > 0.75) {
                        maskContainer.style.setProperty("-webkit-mask-size", "450%");
                        maskContainer.style.setProperty("mask-size", "450%");
                        if(maskImage) {
                            gsap.set(maskImage, {
                                scale: 1
                            });
                        }
                    }

                    // Simple text fade animation for mask header
                    if(maskHeader) {
                        if(progress > 0.75 && progress < 0.95){
                            const textProgress = (progress - 0.75) / 0.2; // Normalize to 0-1
                            gsap.set(maskHeader, {
                                opacity: textProgress,
                                y: `${(1 - textProgress) * 20}px`
                            });
                        } else if (progress < 0.75){
                            gsap.set(maskHeader, {
                                opacity: 0,
                                y: '20px'
                            });
                        } else if (progress >= 0.95) {
                            gsap.set(maskHeader, {
                                opacity: 1,
                                y: '0px'
                            });
                        }
                    }
                }
            }
        });
    }
});