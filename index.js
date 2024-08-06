const terminal = document.getElementById('terminal');
const inputField = document.getElementById('user-input');
const outputContainer = document.getElementById('auto-run-output');
const switchToMobileButton = document.getElementById('switch-to-mobile');

const terminalCommands = {
    "portofetch": `
OS: Personal Portfolio for Shaunak Balkundi
Terminal: Web Terminal
Languages: Python, JavaScript, Java
Frameworks: Django, ReactJS, Spring, NodeJS
Database: MongoDB, PostgreSQL, MySQL
Tools: Git, Docker, Apache Kafka
    `,
    "skills": `
<i class="fab fa-python skill-icon"></i> Python       [#####     ] 70%
<i class="fab fa-js skill-icon"></i> JavaScript   [######    ] 60%
<i class="fab fa-java skill-icon"></i> Java         [#####     ] 50%
<i class="fab fa-react skill-icon"></i> ReactJS      [#######   ] 70%
<i class="fab fa-node skill-icon"></i> NodeJS       [#####     ] 60%
<i class="fab fa-docker skill-icon"></i> Docker       [#####     ] 50%
<i class="fas fa-database skill-icon"></i> MongoDB      [######    ] 60%
<i class="fas fa-database skill-icon"></i> PostgreSQL   [#####     ] 50%
<i class="fab fa-git-alt skill-icon"></i> Git          [#######   ] 80%
<i class="fab fa-linux skill-icon"></i> Linux       [######    ] 60%
    `,
    "about": `
Hello! I'm Shaunak Balkundi, a Full Stack Developer. I'm fascinated by anything that works fast and I strive to write efficient code.
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
    `,
    "help": `
Available commands:
- <span class="clickable-command">portofetch</span>: Show system information
- <span class="clickable-command">skills</span>: Show my skills
- <span class="clickable-command">about</span>: About me
- <span class="clickable-command">projects</span>: My projects
- <span class="clickable-command">education</span>: My education
- <span class="clickable-command">contact</span>: How to contact me
- <span class="clickable-command">email</span>: Open email client
- <span class="clickable-command">help</span>: Show available commands
    `
};

function autoRun() {
    const command = "portofetch";
    outputContainer.innerHTML = `<div>[shaunaksb@portfolio]~$ <span class="command">${command}</span></div><div>${terminalCommands[command]}</div>`;
}

function executeCommand(command) {
    if (command === 'email') {
        window.location.href = 'mailto:shaunak.balkundi@gmail.com';
        inputField.value = '';
    } else if (terminalCommands[command]) {
        const newOutput = document.createElement('div');
        newOutput.innerHTML = `[shaunaksb@portfolio]~$ <span class="command">${command}</span><div>${terminalCommands[command]}</div>`;
        outputContainer.appendChild(newOutput);
        inputField.value = '';
        outputContainer.scrollTop = outputContainer.scrollHeight;
    } else {
        const errorOutput = document.createElement('div');
        errorOutput.innerHTML = `[shaunaksb@portfolio]~$ <span class="command">${command}</span><div>Command not found</div>`;
        outputContainer.appendChild(errorOutput);
        inputField.value = '';
        outputContainer.scrollTop = outputContainer.scrollHeight;
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

// Add event delegation for clickable commands in the help menu
outputContainer.addEventListener('click', function(e) {
    if (e.target.classList.contains('clickable-command')) {
        const command = e.target.textContent;
        executeCommand(command);
    }
});

window.onload = autoRun;