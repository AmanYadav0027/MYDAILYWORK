window.onload = function() {
    const progressBars = document.querySelectorAll('.progress');
    progressBars.forEach(bar => {
        bar.style.width = bar.style.width; // This will trigger the transition
    });
};

