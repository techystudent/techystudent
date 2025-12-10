// DOM Elements
const imageInput = document.getElementById('imageInput');
const uploadArea = document.getElementById('uploadArea');
const previewContainer = document.getElementById('previewContainer');
const questionText = document.getElementById('questionText');
const solveBtn = document.getElementById('solveBtn');
const solutionSection = document.getElementById('solutionSection');
const solutionContent = document.getElementById('solutionContent');
const copySolutionBtn = document.getElementById('copySolution');
const downloadPDFBtn = document.getElementById('downloadPDF');
const shareLinkBtn = document.getElementById('shareLink');
const cookieConsent = document.getElementById('cookieConsent');
const acceptCookiesBtn = document.getElementById('acceptCookies');
const languageSelector = document.getElementById('language');

// Check for saved theme preference or respect OS preference
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const currentTheme = localStorage.getItem('theme');

if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
    document.documentElement.setAttribute('data-theme', 'dark');
} else {
    document.documentElement.setAttribute('data-theme', 'light');
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

// Show cookie consent if not accepted
if (!localStorage.getItem('cookiesAccepted')) {
    cookieConsent.classList.add('active');
}

// Accept cookies
acceptCookiesBtn.addEventListener('click', () => {
    localStorage.setItem('cookiesAccepted', 'true');
    cookieConsent.classList.remove('active');
});

// Handle image upload
imageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            previewContainer.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
            
            // Perform OCR on the image
            performOCR(file);
        };
        reader.readAsDataURL(file);
    }
});

// Drag and drop functionality
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#2196F3';
    uploadArea.style.backgroundColor = 'rgba(33, 150, 243, 0.1)';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#ddd';
    uploadArea.style.backgroundColor = 'rgba(33, 150, 243, 0.05)';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#ddd';
    uploadArea.style.backgroundColor = 'rgba(33, 150, 243, 0.05)';
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.match('image.*')) {
        imageInput.files = e.dataTransfer.files;
        const event = new Event('change', { bubbles: true });
        imageInput.dispatchEvent(event);
    }
});

// Perform OCR using Tesseract.js
async function performOCR(file) {
    try {
        // Show processing message
        questionText.placeholder = "Processing image... Please wait";
        questionText.disabled = true;
        
        // Initialize Tesseract worker
        const worker = await Tesseract.createWorker({
            logger: m => console.log(m),
        });
        
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        
        // Perform OCR
        const { data: { text } } = await worker.recognize(file);
        
        // Set the recognized text to the textarea
        questionText.value = text.trim();
        questionText.placeholder = "Or type your question here...";
        questionText.disabled = false;
        
        // Terminate the worker
        await worker.terminate();
        
        // Auto-solve if OCR was successful
        if (text.trim()) {
            solveQuestion(text.trim());
        }
    } catch (error) {
        console.error('OCR Error:', error);
        questionText.placeholder = "Failed to process image. Please try again or type manually.";
        questionText.disabled = false;
    }
}

// Solve question function
solveBtn.addEventListener('click', () => {
    const question = questionText.value.trim();
    if (question) {
        solveQuestion(question);
    } else {
        alert('Please enter or upload a question first.');
    }
});

// AI Solution Engine Simulation
function solveQuestion(question) {
    // Show solution section
    solutionSection.style.display = 'block';
    
    // Scroll to solution
    solutionSection.scrollIntoView({ behavior: 'smooth' });
    
    // Simulate AI processing
    solutionContent.innerHTML = '<p>🧠 Processing your question...</p>';
    
    // Simulate delay for "AI processing"
    setTimeout(() => {
        // Generate sample solution based on question keywords
        const solution = generateSampleSolution(question);
        solutionContent.innerHTML = solution;
        
        // Render MathJax if any math expressions
        if (typeof MathJax !== 'undefined') {
            MathJax.typesetPromise([solutionContent]);
        }
    }, 2000);
}

// Generate sample solution based on question
function generateSampleSolution(question) {
    const lowerQuestion = question.toLowerCase();
    
    // Sample solutions for different subjects
    if (lowerQuestion.includes('derivative') || lowerQuestion.includes('differentiate')) {
        return `
            <div class="solution-step">
                <h3>Step 1: Identify the function</h3>
                <p>We need to find the derivative of the given function:</p>
                <p>$$f(x) = ${question.split('=').pop().trim()}$$</p>
            </div>
            
            <div class="solution-step">
                <h3>Step 2: Apply differentiation rules</h3>
                <p>Using the power rule: $$\\frac{d}{dx}(x^n) = nx^{n-1}$$</p>
                <p>And the constant multiple rule: $$\\frac{d}{dx}[cf(x)] = c\\frac{d}{dx}[f(x)]$$</p>
            </div>
            
            <div class="solution-step">
                <h3>Step 3: Calculate the derivative</h3>
                <p>Applying the rules to each term:</p>
                <p>$$f'(x) = ${question.split('=').pop().trim().replace(/x\^2/g, '2x').replace(/x/g, '1')}$$</p>
            </div>
            
            <div class="final-answer">
                <h3>Final Answer</h3>
                <p>The derivative of the function is:</p>
                <p>$$\\boxed{f'(x) = 2x + 3}$$</p>
            </div>
        `;
    } else if (lowerQuestion.includes('integral') || lowerQuestion.includes('integrate')) {
        return `
            <div class="solution-step">
                <h3>Step 1: Identify the integral</h3>
                <p>We need to evaluate the integral:</p>
                <p>$$\\int ${question.split(' ').pop()} dx$$</p>
            </div>
            
            <div class="solution-step">
                <h3>Step 2: Apply integration rules</h3>
                <p>Using the power rule for integration: $$\\int x^n dx = \\frac{x^{n+1}}{n+1} + C$$</p>
            </div>
            
            <div class="solution-step">
                <h3>Step 3: Calculate the integral</h3>
                <p>Applying the rule:</p>
                <p>$$\\int x^2 dx = \\frac{x^3}{3} + C$$</p>
            </div>
            
            <div class="final-answer">
                <h3>Final Answer</h3>
                <p>The integral is:</p>
                <p>$$\\boxed{\\int x^2 dx = \\frac{x^3}{3} + C}$$</p>
            </div>
        `;
    } else if (lowerQuestion.includes('newton') || lowerQuestion.includes('force')) {
        return `
            <div class="solution-step">
                <h3>Step 1: Identify given values</h3>
                <p>We are given:</p>
                <ul>
                    <li>Mass (m) = 5 kg</li>
                    <li>Acceleration (a) = 3 m/s²</li>
                </ul>
            </div>
            
            <div class="solution-step">
                <h3>Step 2: Apply Newton's Second Law</h3>
                <p>Newton's second law states:</p>
                <p>$$F = ma$$</p>
                <p>Where F is force, m is mass, and a is acceleration.</p>
            </div>
            
            <div class="solution-step">
                <h3>Step 3: Substitute values</h3>
                <p>Plugging in the given values:</p>
                <p>$$F = 5 \\, \\text{kg} \\times 3 \\, \\text{m/s}^2$$</p>
            </div>
            
            <div class="final-answer">
                <h3>Final Answer</h3>
                <p>The force is:</p>
                <p>$$\\boxed{F = 15 \\, \\text{N}}$$</p>
            </div>
        `;
    } else if (lowerQuestion.includes('atom') || lowerQuestion.includes('electron')) {
        return `
            <div class="solution-step">
                <h3>Step 1: Understand atomic structure</h3>
                <p>An atom consists of:</p>
                <ul>
                    <li>A nucleus containing protons and neutrons</li>
                    <li>Electrons orbiting the nucleus</li>
                </ul>
            </div>
            
            <div class="solution-step">
                <h3>Step 2: Identify electron configuration</h3>
                <p>For a neutral carbon atom (atomic number 6):</p>
                <ul>
                    <li>Number of protons = 6</li>
                    <li>Number of electrons = 6</li>
                </ul>
            </div>
            
            <div class="solution-step">
                <h3>Step 3: Determine valence electrons</h3>
                <p>Carbon's electron configuration is 1s² 2s² 2p²</p>
                <p>Valence electrons are in the outermost shell (2s² 2p²)</p>
            </div>
            
            <div class="final-answer">
                <h3>Final Answer</h3>
                <p>A carbon atom has <strong>4 valence electrons</strong>.</p>
                <p>This makes carbon capable of forming 4 covalent bonds.</p>
            </div>
        `;
    } else {
        // Generic solution for other questions
        return `
            <div class="solution-step">
                <h3>Step 1: Analyze the problem</h3>
                <p>We are given the following question:</p>
                <p>"${question}"</p>
                <p>To solve this, we need to understand the underlying concepts and apply appropriate formulas.</p>
            </div>
            
            <div class="solution-step">
                <h3>Step 2: Identify relevant principles</h3>
                <p>Based on the question, we can identify the subject area as 
                ${lowerQuestion.includes('calculate') || lowerQuestion.includes('+') || lowerQuestion.includes('-') || lowerQuestion.includes('=') ? 'Mathematics' : 
                  lowerQuestion.includes('force') || lowerQuestion.includes('velocity') || lowerQuestion.includes('energy') ? 'Physics' : 
                  lowerQuestion.includes('reaction') || lowerQuestion.includes('compound') || lowerQuestion.includes('element') ? 'Chemistry' : 'General Science'}.</p>
            </div>
            
            <div class="solution-step">
                <h3>Step 3: Apply problem-solving approach</h3>
                <p>Following a systematic approach:</p>
                <ol>
                    <li>Identify known quantities and what needs to be found</li>
                    <li>Select appropriate formulas or principles</li>
                    <li>Perform calculations step by step</li>
                    <li>Verify the result for reasonableness</li>
                </ol>
            </div>
            
            <div class="final-answer">
                <h3>Final Answer</h3>
                <p>Based on the analysis, the solution to "${question}" is:</p>
                <p>$$\\boxed{\\text{Result depends on specific values and context}}$$</p>
                <p><em>Note: For a precise numerical answer, please provide all necessary values and units.</em></p>
            </div>
        `;
    }
}

// Copy solution to clipboard
copySolutionBtn.addEventListener('click', () => {
    const solutionText = solutionContent.innerText;
    navigator.clipboard.writeText(solutionText)
        .then(() => {
            const originalText = copySolutionBtn.innerHTML;
            copySolutionBtn.innerHTML = '✓ Copied!';
            setTimeout(() => {
                copySolutionBtn.innerHTML = originalText;
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy solution. Please try again.');
        });
});

// Download solution as PDF
downloadPDFBtn.addEventListener('click', () => {
    alert('In a full implementation, this would download the solution as a PDF. For now, this is a simulation.');
    
    // In a real implementation, you would use a library like jsPDF:
    /*
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text(solutionContent.innerText, 10, 10);
    doc.save("techystudent-solution.pdf");
    */
});

// Share solution link
shareLinkBtn.addEventListener('click', () => {
    const question = questionText.value.trim();
    if (question) {
        // In a real implementation, you would generate a shareable link
        const shareData = {
            title: 'TechyStudent Solution',
            text: `Check out this solution for: "${question}"`,
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData)
                .then(() => console.log('Shared successfully'))
                .catch(err => console.log('Sharing failed:', err));
        } else {
            // Fallback for browsers that don't support Web Share API
            const tempInput = document.createElement('input');
            tempInput.value = window.location.href;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            
            const originalText = shareLinkBtn.innerHTML;
            shareLinkBtn.innerHTML = '✓ Link Copied!';
            setTimeout(() => {
                shareLinkBtn.innerHTML = originalText;
            }, 2000);
        }
    } else {
        alert('Please solve a question first to share the solution.');
    }
});

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    console.log('TechyStudent App Initialized');
});