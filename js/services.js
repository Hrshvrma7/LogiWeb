function openStory(evt, brandName) {
    // 1. Hide all tab content
    const tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove("active");
    }

    // 2. Remove "active" class from all tab buttons
    const tabLinks = document.getElementsByClassName("tab-link");
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove("active");
    }

    // 3. Show the specific tab and mark the button as active
    document.getElementById(brandName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

window.addEventListener('DOMContentLoaded', () => {
    // Get the hash from URL (e.g., #air)
    const hash = window.location.hash;

    if (hash) {
        // Map the hashes to your IDs
        const tabMap = {
            '#logistic': 'link-logistic',
            '#cargo': 'link-cargo',
            '#air': 'link-air',
            '#lcl': 'link-lcl',
            '#fcl': 'link-fcl'
        };

        const targetId = tabMap[hash];
        const tabButton = document.getElementById(targetId);

        if (tabButton) {
            // This triggers your existing openStory function
            tabButton.click(); 
        }
    }
});