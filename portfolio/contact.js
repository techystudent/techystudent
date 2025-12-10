// Contact form functionality
document.addEventListener('DOMContentLoaded', function() {
    const cookieConsent = document.getElementById('cookieConsent');
    const acceptCookiesBtn = document.getElementById('acceptCookies');
    const contactForm = document.getElementById('contactForm');
    
    // Show cookie consent if not accepted
    if (!localStorage.getItem('cookiesAccepted')) {
        cookieConsent.classList.add('active');
    }
    
    // Accept cookies
    acceptCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieConsent.classList.remove('active');
    });
    
    // Check for saved theme preference or respect OS preference
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    // Create dark mode toggle button
    const darkModeToggle = document.createElement('div');
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.innerHTML = '🌙';
    document.body.appendChild(darkModeToggle);
    
    // Update dark mode toggle icon based on theme
    function updateDarkModeIcon() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        darkModeToggle.innerHTML = isDark ? '☀️' : '🌙';
    }
    
    updateDarkModeIcon();
    
    // Toggle dark mode
    darkModeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
        updateDarkModeIcon();
    });
    
    // Handle form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // In a real implementation, you would send this data to a server
        // For now, we'll just show a confirmation message
        alert(`Thank you, ${name}! Your message has been received. We'll get back to you at ${email} soon.`);
        
        // Reset form
        contactForm.reset();
    });
});