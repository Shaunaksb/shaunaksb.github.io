const terminal = document.getElementById('terminal');
const inputField = document.getElementById('user-input');
const outputContainer = document.getElementById('auto-run-output');
const switchToMobileButton = document.getElementById('switch-to-mobile');
const neofetchContainer = document.getElementById('neofetch-container');
const asciiArt = `
         888                                          888               888      
         888                                          888               888      
         888                                          888               888      
.d8888b  88888b.   8888b.  888  888 88888b.   8888b.  888  888 .d8888b  88888b.  
88K      888 "88b     "88b 888  888 888 "88b     "88b 888 .88P 88K      888 "88b 
"Y8888b. 888  888 .d888888 888  888 888  888 .d888888 888888K  "Y8888b. 888  888 
     X88 888  888 888  888 Y88b 888 888  888 888  888 888 "88b      X88 888 d88P 
 88888P' 888  888 "Y888888  "Y88888 888  888 "Y888888 888  888  88888P' 88888P"

                             Full Stack Developer                               

`;

const systemInfo = {
    "OS": "PortfolioOS, Made by Shaunak Balkundi",
    "Terminal": "Web",
    "Languages": "Python, JavaScript, Java, C#",
    "Frameworks": "Django, ReactJS, Spring, NodeJS, .NET",
    "Database": "MongoDB, PostgreSQL, MySQL",
    "Tools": "Git, Docker, Apache Kafka",
    "For more information":" type 'help'"
};

const terminalCommands = {
    "portofetch": function(container) {
        container.innerHTML = `
            <div class="portofetch-container">
                <pre id="ascii-art">${asciiArt}</pre>
                <div id="system-info">
                    ${Object.entries(systemInfo).map(([key, value]) => `<p class="info-line"><span class="info-label">${key}:</span> ${value}</p>`).join('')}
                </div>
            </div>
        `;
    },

    "history": function(container) {
        container.innerHTML = `
            <div class="command-output">
                <pre>${commandHistory.join('\n')}</pre>
            </div>
        `;
    },
    "clear": function() {
        outputContainer.innerHTML = '';
    },
    "about": function(container) {
        container.innerHTML = window.terminalCommands.about;
    },
    "skills": function(container) {
        window.terminalCommands.skills(container);
    },
    "projects": function(container) {
        container.innerHTML = window.terminalCommands.projects;
    },
    "education": function(container) {
        container.innerHTML = window.terminalCommands.education;
    },
    "contact": function(container) {
        container.innerHTML = window.terminalCommands.contact;
    },
    "allinfo": function(container) {
        const commands = ['about', 'skills', 'projects', 'education', 'contact'];
        commands.forEach(cmd => {
            const cmdHeader = document.createElement('div');
            cmdHeader.innerHTML = `<br><strong>==== ${cmd.toUpperCase()} ====</strong><br>`;
            container.appendChild(cmdHeader);
            
            if (typeof terminalCommands[cmd] === 'function') {
                const cmdOutput = document.createElement('div');
                terminalCommands[cmd](cmdOutput);
                container.appendChild(cmdOutput);
            } else {
                container.innerHTML += terminalCommands[cmd];
            }
        });
    },
    "help": `
Available commands:
- <span class="clickable-command">help</span>: Show available commands
- <span class="clickable-command">portofetch</span>: Brief Information about me
- <span class="clickable-command">about</span>: About me
- <span class="clickable-command">skills</span>: Show my skills
- <span class="clickable-command">projects</span>: My projects
- <span class="clickable-command">education</span>: My education
- <span class="clickable-command">contact</span>: How to contact me
- <span class="clickable-command">allinfo</span>: Display all information
- <span class="clickable-command">email</span>: Email me
- <span class="clickable-command">linkedin</span>: Open LinkedIn profile
- <span class="clickable-command">github</span>: Open GitHub profile
- <span class="clickable-command">instagram</span>: Open Instagram profile
- <span class="clickable-command">history</span>: Show command history
- <span class="clickable-command">clear</span>: Clear the screen
- <span class="clickable-command">exit</span>: Close the terminal
`
};

let commandHistory = [];
let historyIndex = -1;
function executeCommand(command, displayPrompt = true) {
    commandHistory.push(command);
    if (displayPrompt) {
        const promptLine = document.createElement('div');
        promptLine.innerHTML = `[shaunaksb@portfolio]~$ <span class="command">${command}</span>`;
        outputContainer.appendChild(promptLine);
    }
    if (command.toLowerCase() === 'exit') {
        handleExit();
    } else if (command in terminalCommands) {
        const newOutput = document.createElement('div');
        if (typeof terminalCommands[command] === 'function') {
            terminalCommands[command](newOutput);
        } else {
            newOutput.innerHTML = terminalCommands[command];
        }
        outputContainer.appendChild(newOutput);
        inputField.value = '';
        checkAndScroll();
    } else if (command === 'email') {
        window.location.href = `mailto:${contactInfo.email}`;
        inputField.value = '';    
    } else if (command === 'linkedin') {
        window.open(contactInfo.linkedin, '_blank');
        inputField.value = '';
    } else if (command === 'github') {
        window.open(contactInfo.github, '_blank');
        inputField.value = '';
    } else if (command === 'instagram') { 
        window.open(contactInfo.instagram, '_blank');
        inputField.value = '';
    } else {
        const errorOutput = document.createElement('div');
        errorOutput.innerHTML = `Command not found: ${command}`;
        outputContainer.appendChild(errorOutput);
        inputField.value = '';
        checkAndScroll();
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const portraitBg = document.getElementById('portrait-bg');
    const landscapeBg = document.getElementById('landscape-bg');

    function loadImage(element) {
        if (element.dataset.loaded) return;
        const img = new Image();
        const imageUrl = element.style.backgroundImage.slice(5, -2).replace(/['"]/g, '');
        img.src = imageUrl;
        img.onload = () => {
            element.dataset.loaded = true;
            updateOrientation();
        };
    }

    function updateOrientation() {
        if (window.innerHeight > window.innerWidth) {
        document.body.classList.add('portrait');
        document.body.classList.remove('landscape');
        loadImage(portraitBg);
        } else {
        document.body.classList.add('landscape');
        document.body.classList.remove('portrait');
        loadImage(landscapeBg);
        }
    }
    window.addEventListener('resize', updateOrientation);
    updateOrientation();
});

function handleExit() {
    const exitMessage = document.createElement('div');
    exitMessage.innerHTML = 'Exiting the terminal. Thank you for visiting!';
    outputContainer.appendChild(exitMessage);
    checkAndScroll();
    // Disable input
    inputField.disabled = true;
    // Add a visual indicator that the terminal is closing
    terminal.style.opacity = '0.5';
    // Attempt to close the tab
    setTimeout(() => {
        try {
            window.close();
        } catch (e) {
            // If closing fails, inform the user
            const cannotCloseMessage = document.createElement('div');
            cannotCloseMessage.innerHTML = 'Unable to close the tab automatically. You can close this tab manually. Thank you for using the terminal!';
            outputContainer.appendChild(cannotCloseMessage);
            checkAndScroll();
            // Re-enable input in case the user wants to continue
            inputField.disabled = false;
            terminal.style.opacity = '1';
        }
    }, 2000);
}

function checkAndScroll() {
    if (outputContainer.scrollHeight > outputContainer.clientHeight) {
        outputContainer.scrollTop = outputContainer.scrollHeight - outputContainer.clientHeight;
    }
}

inputField.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const command = inputField.value.trim();
        executeCommand(command);
    }
});

switchToMobileButton.addEventListener('click', function() {
    window.location.href = 'mobile.html';
});

outputContainer.addEventListener('click', function(e) {
    if (e.target.classList.contains('clickable-command')) {
        const command = e.target.textContent;
        executeCommand(command);
    }
});

window.onload = function() {
    executeCommand('portofetch', true);
};

const observer = new MutationObserver(checkAndScroll);
observer.observe(outputContainer, { childList: true, subtree: true });

inputField.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp') {
        if (historyIndex > 0) {
            historyIndex--;
            inputField.value = commandHistory[historyIndex];
        }
    } else if (event.key === 'ArrowDown') {
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            inputField.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            inputField.value = '';
        }
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const portraitBg = document.getElementById('portrait-bg');
    const landscapeBg = document.getElementById('landscape-bg');

    function loadImage(element) {
        if (element.dataset.loaded) return;
        const img = new Image();
        const imageUrl = element.style.backgroundImage.slice(5, -2).replace(/['"]/g, '');
        img.src = imageUrl;
        img.onload = () => {
            element.dataset.loaded = true;
            updateOrientation();
        };
    }

    function updateOrientation() {
        if (window.innerHeight > window.innerWidth) {
            document.body.classList.add('portrait');
            document.body.classList.remove('landscape');
            loadImage(portraitBg);
        } else {
            document.body.classList.add('landscape');
            document.body.classList.remove('portrait');
            loadImage(landscapeBg);
        }
    }

    window.addEventListener('resize', updateOrientation);
    updateOrientation();
});