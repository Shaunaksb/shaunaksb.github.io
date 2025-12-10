var contactInfo = {
    email: 'shaunak.balkundi@gmail.com',
    linkedin: 'https://linkedin.com/in/shaunakbalkundi',
    github: 'https://github.com/shaunaksb',
    instagram: 'https://instagram.com/shaunakbalkundi'
};

window.terminalCommands = window.terminalCommands || {};

window.terminalCommands.about = `
I'm Shaunak Balkundi, a Full Stack Developer. I'm mostly fascinated by anything that goes fast and I try to write code that works fast!
`;

window.terminalCommands.skills = function(container) {
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
};

window.terminalCommands.projects = `
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
`;
window.terminalCommands.education = `
M.Sc. Computer Science
Fergusson College, Pune
2025 - 2027

B.Sc. in Computer Science, Electronics and Mathematics
RTM Nagpur University, Nagpur
2020 - 2023
`;
window.terminalCommands.contact = `
Email: ${contactInfo.email}
LinkedIn: ${contactInfo.linkedin}  
GitHub: ${contactInfo.github}
Instagram: ${contactInfo.instagram}
Run a commnand to go to the respective link. The link gets copied to the clipboard as well.
`;

window.terminalCommands.experience = `
Backend Developer Intern
Assystant
Migrated a legacy proect based on Django MVT architecture to Django Rest Framework
Dockerised the application and autmated the deployment process
May 2025 - Present
`;