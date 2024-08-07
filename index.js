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

    "skills": function(container) {
        const skills = [
            { name: "Python", icon: "devicon-python-plain" },
            { name: "JavaScript", icon: "devicon-javascript-plain" },
            { name: "Java", icon: "devicon-java-plain" },
            { name: "Django", icon: "devicon-django-plain" },
            { name: "ReactJS", icon: "devicon-react-original" },
            { name: "Spring", icon: "devicon-spring-plain" },
            { name: "NodeJS", icon: "devicon-nodejs-plain" },
            { name: "FastAPI", icon: "devicon-fastapi-plain" },
            { name: "MongoDB", icon: "devicon-mongodb-plain" },
            { name: "PostgreSQL", icon: "devicon-postgresql-plain" },
            { name: "MySQL", icon: "devicon-mysql-plain" },
            { name: "Apache Kafka", icon: "devicon-apachekafka-plain" },
            { name: "Git", icon: "devicon-git-plain" },
            { name: "Linux", icon: "devicon-linux-plain" },
            { name: "Docker", icon: "devicon-docker-plain" },
            { name: "Redis", icon: "devicon-redis-plain" }
        ];

        const skillsHtml = skills.map(skill => `
            <div class="skill-item">
                <i class="${skill.icon}"></i>   ${skill.name}
            </div>
        `).join('');

        container.innerHTML = `
            <div class="skills-container">
                ${skillsHtml}
            </div>
        `;
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
    "clear": function() {
        outputContainer.innerHTML = '';
    },
    "about": `
I'm Shaunak Balkundi, a Full Stack Developer. I'm mostly fascinated by anything that goes fast and I try to write code that works fast!
    `,
    "projects": `
1. Online Banking & HR Management System
   - Full Stack Application Written in React and Spring
   - Successfully executed a two-phase project, delivering both an Online Banking System and a Human Resource Management System.
   - Phase 1 focused on creating an intuitive Online Banking Platform with fundamental transaction features, along with additional functionalities like Credit Card, Gift Card, Loan, and Locker Management.
   - Phase 2 centered on the development of a comprehensive HR Management System, incorporating modules for Employee Roster Tracking, Attendance, Leave, Payroll Management, Internal Job Portal, and Customer Support Portal, resulting in enhanced organizational efficiency and streamlined HR processes.

2. Detection and Recognition of Illegally Parked Vehicles
   - Image Recognition Application Written in Python
   - Developed a real-time object detection system using OpenCV and YOLOv3.
   - Integrated the object detection system with a camera to capture images and detect vehicles parked in no parking zones.
   - Contributed to the open-source community by releasing the code and documenting the project on GitHub.
    `,
    "education": `
B.Sc. in Computer Science, Electronics and Mathematics
Dharampeth M P Deo Memorial Science College
2020 - 2023
    `,
    "contact": `
Email: shaunakbalkundi@example.com
LinkedIn: https://linkedin.com/in/shaunakbalkundi
GitHub: https://github.com/shaunaksb
Instagram: https://instagram.com/shaunakbalkundi
    `,
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
    } else if (command === 'email') {
        window.location.href = 'mailto:shaunak.balkundi@gmail.com';
        inputField.value = '';
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
    } else if (command === 'linkedin') {
        window.open('https://linkedin.com/in/shaunakbalkundi', '_blank');
        inputField.value = '';
    } else if (command === 'github') {
        window.open('https://github.com/shaunaksb', '_blank');
        inputField.value = '';
    } else if (command === 'instagram') { 
        window.open('https://instagram.com/shaunakbalkundi', '_blank');
        inputField.value = '';
    } else {
        const errorOutput = document.createElement('div');
        errorOutput.innerHTML = `Command not found: ${command}`;
        outputContainer.appendChild(errorOutput);
        inputField.value = '';
        checkAndScroll();
    }
}

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
