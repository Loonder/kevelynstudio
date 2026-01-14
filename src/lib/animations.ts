export const TRANSITION_EASE = [0.22, 1, 0.36, 1]; // Custom Bezier for "Luxury" feel

export const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: TRANSITION_EASE }
    }
};

export const containerStagger = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

export const parallaxImage = {
    hidden: { scale: 1.2, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: { duration: 1.5, ease: TRANSITION_EASE }
    }
};
