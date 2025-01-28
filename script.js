const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const frames = {
    currentIndex: 0,
    maxIndex: 1345,
};

let images = [];
let imagesLoaded = 0;

function preloadImgs() {
    for (let i = 1; i <= frames.maxIndex; i++) {
        const imgUrl = `./assets/frame_${i.toString().padStart(4, '0')}.jpeg`;
        const img = new Image();
        img.src = imgUrl;

        img.onload = () => {
            imagesLoaded++;
            if (imagesLoaded === frames.maxIndex) {
                // All images are loaded, start the animation
                startAnimation();
            }
        };

        img.onerror = () => {
            console.error(`Error loading image: ${imgUrl}`);
        };

        images.push(img);
    }
}

function loadImages(index) {
    if (index >= 0 && index <= frames.maxIndex) {
        const img = images[index];
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const scaleX = canvas.width / img.width;
        const scaleY = canvas.height / img.height;

        const scale = Math.max(scaleX, scaleY);

        const newWidth = img.width * scale;
        const newHeight = img.height * scale;

        const offsetX = (canvas.width - newWidth) / 2;
        const offsetY = (canvas.height - newHeight) / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);

        frames.currentIndex = index;
    }
}

function startAnimation() {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".parent",
            start: "top top",
            end: "bottom bottom",
            scrub: 2,
        },
    });

    tl.to(frames, {
        currentIndex: frames.maxIndex,
        onUpdate: () => {
            loadImages(Math.floor(frames.currentIndex));
        },
        ease: "none",
    });
}

// Handle window resize
window.addEventListener('resize', () => {
    loadImages(frames.currentIndex);
});

// Start preloading images
preloadImgs();

