gsap.registerPlugin(ScrollTrigger);

gsap.to(".scroll-img", {
  x: 500, // move right
  duration: 1,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".trigger-section",
    start: "top 70%",
    end: "top 20%",
    scrub: true,
  }
});
