function scrollToElement(id_string) {
    const navHeight = document.getElementById("navbar")?.getBoundingClientRect().height;
    const targetElement = document.getElementById(id_string);
    let targetPosition; 
    if (targetElement && navHeight) {
        targetPosition = Math.max(targetElement.getBoundingClientRect().top + window.scrollY - navHeight, 0);

        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        const duration = 300;
        let start = null;

        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const progressRate = Math.min(progress / duration, 1);
            window.scrollTo(0, startPosition + distance * progressRate);
            if (progress < duration) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }
}