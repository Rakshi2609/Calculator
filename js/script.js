console.log("🔥 Sexy Calculator Loaded! 🔥");
console.log("⌨️ Keyboard Shortcuts:");
console.log("• Numbers: 0-9");
console.log("• Operators: + - * /");
console.log("• Equals: Enter or =");
console.log("• Clear: Escape or C");
console.log("• Decimal: .");
console.log("• Backspace: Delete last character");

// Custom cursor tracker
const cursorTracker = document.getElementById('cursorTracker');
const cursorGlow = document.getElementById('cursorGlow');

document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    
    cursorTracker.style.left = (x - 10) + 'px';
    cursorTracker.style.top = (y - 10) + 'px';
    
    cursorGlow.style.left = (x - 20) + 'px';
    cursorGlow.style.top = (y - 20) + 'px';
});

// Particle system
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.width = particle.style.height = Math.random() * 10 + 5 + 'px';
    particle.style.animationDuration = Math.random() * 3 + 5 + 's';
    particle.style.animationDelay = Math.random() * 2 + 's';
    
    document.getElementById('particles').appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 8000);
}

// Create particles continuously
setInterval(createParticle, 300);

// Keyboard support
document.addEventListener('keydown', (e) => {
    const key = e.key;
    let buttonToHighlight = null;
    
    // Prevent default for calculator keys
    if ('0123456789+-*/.='.includes(key) || key === 'Enter' || key === 'Escape' || key === 'Backspace') {
        e.preventDefault();
    }
    
    // Handle number keys
    if ('0123456789'.includes(key)) {
        if (document.querySelector("input").value === '0' && key !== '0') {
            string = key;
        } else {
            string = string + key;
        }
        document.querySelector("input").value = string;
        buttonToHighlight = findButtonByText(key);
    }
    // Handle operators
    else if (key === '+') {
        string = string + '+';
        document.querySelector("input").value = string;
        buttonToHighlight = document.querySelector('.addition');
    }
    else if (key === '-') {
        string = string + '-';
        document.querySelector("input").value = string;
        buttonToHighlight = document.querySelector('.subtraction');
    }
    else if (key === '*') {
        string = string + '*';
        document.querySelector("input").value = string;
        buttonToHighlight = document.querySelector('.multiplication');
    }
    else if (key === '/') {
        string = string + '/';
        document.querySelector("input").value = string;
        buttonToHighlight = document.querySelector('.division');
    }
    else if (key === '.') {
        string = string + '.';
        document.querySelector("input").value = string;
        buttonToHighlight = document.querySelector('.point');
    }
    // Handle equals
    else if (key === 'Enter' || key === '=') {
        if (isValidExpression(string)) {
            try {
                const expression = string;
                const result = eval(sanitizeInput(string));
                
                if (isNaN(result) || !isFinite(result)) {
                    document.querySelector("input").value = "Error";
                    string = "";
                } else {
                    string = result.toString();
                    document.querySelector("input").value = string;
                    addToSavedHistory(expression, string);
                }
            } catch {
                document.querySelector("input").value = "Error";
                string = "";
            }
        }
        buttonToHighlight = document.querySelector('.equal');
    }
    // Handle clear
    else if (key === 'Escape' || key === 'c' || key === 'C') {
        if (string !== '') {
            showSavedHistory();
        }
        string = '';
        document.querySelector("input").value = '0';
        buttonToHighlight = document.querySelector('.clear');
    }
    // Handle backspace
    else if (key === 'Backspace') {
        string = string.slice(0, -1);
        document.querySelector("input").value = string || '0';
    }
    
    // Highlight pressed button with enhanced effects
    if (buttonToHighlight) {
        buttonToHighlight.classList.add('keyboard-pressed');
        buttonToHighlight.style.transform = 'scale(0.95)';
        buttonToHighlight.style.boxShadow = '0 0 30px 6px #ff00cc99, 0 0 40px 10px #33339999';
        
        // Create a sparkle effect
        createSparkles(buttonToHighlight);
        
        setTimeout(() => {
            buttonToHighlight.classList.remove('keyboard-pressed');
            buttonToHighlight.style.transform = '';
            buttonToHighlight.style.boxShadow = '';
        }, 300);
    }
});

// Helper function to find button by text content
function findButtonByText(text) {
    const buttons = document.querySelectorAll('.number');
    for (let button of buttons) {
        if (button.textContent.trim() === text) {
            return button;
        }
    }
    return null;
}

// Create sparkle effect for button presses
function createSparkles(element) {
    const rect = element.getBoundingClientRect();
    const sparkleCount = 5;
    
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'fixed';
        sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
        sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
        sparkle.style.width = '4px';
        sparkle.style.height = '4px';
        sparkle.style.background = '#ff00cc';
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '10000';
        sparkle.style.animation = 'sparkle 0.6s ease-out forwards';
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 600);
    }
}

// Add sparkle animation CSS dynamically
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkle {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: scale(1) rotate(180deg) translateY(-20px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(sparkleStyle);



let string = ""; 
let savedHistory = [];

// Input validation functions
function isValidExpression(expr) {
    // Check for invalid patterns that cause NaN
    if (!expr || expr.trim() === '') return false;
    if (/[+\-*/]{2,}/.test(expr)) return false; // Multiple operators
    if (/^[+\-*/]/.test(expr.trim())) return false; // Starts with operator (except -)
    if (/[+\-*/]$/.test(expr.trim())) return false; // Ends with operator
    if (/\.\./.test(expr)) return false; // Multiple dots
    return true;
}

function sanitizeInput(input) {
    // Remove any non-calculator characters
    return input.replace(/[^0-9+\-*/.]/g, '');
}

function addToSavedHistory(expression, result) {
    const historyItem = { expression, result, timestamp: new Date() };
    savedHistory.unshift(historyItem);
    if (savedHistory.length > 20) savedHistory = savedHistory.slice(0, 20);
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const savedContainer = document.getElementById('savedHistory');
    
    // Update saved history
    if (savedContainer) {
        savedContainer.innerHTML = savedHistory.map(item => 
            `<div class="history-item" onclick="loadFromHistory('${item.expression}', '${item.result}')">
                <div class="expression">${item.expression}</div>
                <div class="result">= ${item.result}</div>
            </div>`
        ).join('');
    }
}

function loadFromHistory(expression, result) {
    string = result;
    document.querySelector("input").value = string;
}

function showSavedHistory() {
    // Show left panel
    const leftPanel = document.getElementById('historyLeft');
    if (leftPanel) {
        leftPanel.classList.add('show');
    }
}

let numbers = document.querySelectorAll(".number");

Array.from(numbers).forEach((number) => {
    // Enhanced hover effects
    number.addEventListener('mouseenter', () => {
        cursorTracker.style.transform = 'scale(1.5)';
        cursorGlow.style.transform = 'scale(1.8)';
    });
    
    number.addEventListener('mouseleave', () => {
        cursorTracker.style.transform = 'scale(1)';
        cursorGlow.style.transform = 'scale(1)';
    });
    
    number.addEventListener("click", (e) => {
        // Enhanced ripple effect
        const ripple = document.createElement("span");
        ripple.className = "ripple";
        ripple.style.left = e.offsetX + "px";
        ripple.style.top = e.offsetY + "px";
        number.appendChild(ripple);
        setTimeout(() => ripple.remove(), 500);
        
        // Cursor pulse effect
        cursorTracker.style.transform = 'scale(2)';
        setTimeout(() => cursorTracker.style.transform = 'scale(1)', 200);

        // Get the actual button text content, not HTML
        const buttonValue = e.currentTarget.textContent.trim();
        console.log("Button clicked:", buttonValue);

        if (buttonValue === "=") {
            if (isValidExpression(string)) {
                try {
                    const expression = string;
                    const result = eval(sanitizeInput(string));
                    
                    if (isNaN(result) || !isFinite(result)) {
                        document.querySelector("input").value = "Error";
                        string = "";
                    } else {
                        string = result.toString();
                        document.querySelector("input").value = string;
                        addToSavedHistory(expression, string);
                    }
                } catch {
                    document.querySelector("input").value = "Error";
                    string = "";
                }
            } else {
                document.querySelector("input").value = "Invalid";
                setTimeout(() => {
                    document.querySelector("input").value = string;
                }, 1000);
            }
        }
        else if(buttonValue === 'Clear'){
            if (string !== '') {
                showSavedHistory();
            }
            string = '';
            document.querySelector("input").value = '0';
        }
        else {
            if (document.querySelector("input").value === '0' && '0123456789'.includes(buttonValue)) {
                string = buttonValue;
            } else {
                string = string + buttonValue;
            }
            document.querySelector("input").value = string;
        }
    });
});
