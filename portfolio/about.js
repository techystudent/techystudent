// Cookie consent functionality
document.addEventListener('DOMContentLoaded', function() {
    const cookieConsent = document.getElementById('cookieConsent');
    const acceptCookiesBtn = document.getElementById('acceptCookies');
    
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
});