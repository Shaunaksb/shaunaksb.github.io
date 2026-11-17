/**
 * Recursively freezes an object graph to preserve single-source-of-truth integrity.
 * @template T
 * @param {T} obj
 * @returns {T}
 */
function deepFreeze(obj) {
    if (obj && typeof obj === 'object' && !Object.isFrozen(obj)) {
        Object.freeze(obj);
        Object.values(obj).forEach(deepFreeze);
    }
    return obj;
}

const ASCII_ART = `
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

/**
 * Canonical portfolio data shared across Terminal and GUI views.
 */
export const portfolioData = deepFreeze({
    profile: {
        username: 'Shaunaksb',
        promptUser: 'shaunaksb@portfolio',
        name: 'Shaunak Balkundi',
        role: 'Full Stack Developer',
        about: "I'm Shaunak Balkundi, a Full Stack Developer. I'm mostly fascinated by anything that goes fast and I try to write code that works fast!",
        avatar: './images/img.webp',
        repoUrl: 'https://github.com/Shaunaksb/shaunaksb.github.io',
        asciiArt: ASCII_ART,
        os: 'PortfolioOS, Made by Shaunak Balkundi',
        terminalName: 'Web'
    },
    focusAreas: [
        { name: 'Building Web Apps', percentage: 90 },
        { name: 'Building CLI Tools', percentage: 70 }
    ],
    skills: [
        { name: 'Python', icon: 'devicon-python-plain', category: 'Languages' },
        { name: 'JavaScript', icon: 'devicon-javascript-plain', category: 'Languages' },
        { name: 'Java', icon: 'devicon-java-plain', category: 'Languages' },
        { name: 'C#', icon: 'devicon-csharp-plain', category: 'Languages' },
        { name: 'Django', icon: 'devicon-django-plain', category: 'Frameworks' },
        { name: 'ReactJS', icon: 'devicon-react-original', category: 'Frameworks' },
        { name: 'Spring', icon: 'devicon-spring-plain', category: 'Frameworks' },
        { name: 'NodeJS', icon: 'devicon-nodejs-plain', category: 'Frameworks' },
        { name: '.NET', icon: 'devicon-dotnetcore-plain', category: 'Frameworks' },
        { name: 'FastAPI', icon: 'devicon-fastapi-plain', category: 'Frameworks' },
        { name: 'MongoDB', icon: 'devicon-mongodb-plain', category: 'Database' },
        { name: 'PostgreSQL', icon: 'devicon-postgresql-plain', category: 'Database' },
        { name: 'MySQL', icon: 'devicon-mysql-plain', category: 'Database' },
        { name: 'Redis', icon: 'devicon-redis-plain', category: 'Database' },
        { name: 'Apache Kafka', icon: 'devicon-apachekafka-original', category: 'Tools' },
        { name: 'Git', icon: 'devicon-git-plain', category: 'Tools' },
        { name: 'Linux', icon: 'devicon-linux-plain', category: 'Tools' },
        { name: 'Docker', icon: 'devicon-docker-plain', category: 'Tools' }
    ],
    experience: [
        {
            role: 'Backend Developer Intern',
            company: 'Assystant',
            period: 'May 2025 - Present',
            highlights: [
                'Migrated a legacy project based on Django MVT architecture to Django Rest Framework.',
                'Dockerised the application and automated the deployment process.'
            ]
        }
    ],
    education: [
        {
            degree: 'M.Sc. Computer Science',
            institution: 'Fergusson College, Pune',
            period: '2025 - 2027'
        },
        {
            degree: 'B.Sc. in Computer Science, Electronics and Mathematics',
            institution: 'RTM Nagpur University (Dharampeth M P Deo Memorial Science College), Nagpur',
            period: '2020 - 2023'
        }
    ],
    projects: [
        {
            title: 'Online Banking & HR Management System',
            subtitle: 'Full Stack Application Written in React and Spring',
            highlights: [
                'Successfully executed a two-phase project, delivering both an Online Banking System and a Human Resource Management System.',
                'Phase 1 focused on creating an intuitive Online Banking Platform with fundamental transaction features, along with additional functionalities like Credit Card, Gift Card, Loan, and Locker Management.',
                'Phase 2 centered on the development of a comprehensive HR Management System, incorporating modules for Employee Roster Tracking, Attendance, Leave, Payroll Management, Internal Job Portal, and Customer Support Portal, resulting in enhanced organizational efficiency and streamlined HR processes.'
            ]
        },
        {
            title: 'Detection and Recognition of Illegally Parked Vehicles',
            subtitle: 'Image Recognition Application Written in Python',
            highlights: [
                'Developed a real-time object detection system using OpenCV and YOLOv3.',
                'Integrated the object detection system with a camera to capture images and detect vehicles parked in no parking zones.',
                'Contributed to the open-source community by releasing the code and documenting the project on GitHub.'
            ]
        }
    ],
    socials: [
        {
            id: 'email',
            label: 'Email',
            value: 'shaunak.balkundi@gmail.com',
            url: 'mailto:shaunak.balkundi@gmail.com',
            ionIcon: 'mail-outline',
            description: 'Email me'
        },
        {
            id: 'github',
            label: 'GitHub',
            value: 'https://github.com/shaunaksb',
            url: 'https://github.com/shaunaksb',
            ionIcon: 'logo-github',
            description: 'Open GitHub profile'
        },
        {
            id: 'linkedin',
            label: 'LinkedIn',
            value: 'https://linkedin.com/in/shaunakbalkundi',
            url: 'https://linkedin.com/in/shaunakbalkundi',
            ionIcon: 'logo-linkedin',
            description: 'Open LinkedIn profile'
        },
        {
            id: 'instagram',
            label: 'Instagram',
            value: 'https://instagram.com/shaunakbalkundi',
            url: 'https://instagram.com/shaunakbalkundi',
            ionIcon: 'logo-instagram',
            description: 'Open Instagram profile'
        },
        {
            id: 'twitter',
            label: 'Twitter',
            value: 'https://twitter.com/ShaunakBalkundi',
            url: 'https://twitter.com/ShaunakBalkundi',
            ionIcon: 'logo-twitter',
            description: 'Open Twitter/X profile'
        }
    ]
});

/**
 * Derives portofetch system summary fields from canonical portfolio data.
 * @param {typeof portfolioData} [data]
 * @returns {Record<string, string>}
 */
export function getSystemInfo(data = portfolioData) {
    const groupedSkills = data.skills.reduce((acc, skill) => {
        if (!acc[skill.category]) {
            acc[skill.category] = [];
        }
        acc[skill.category].push(skill.name);
        return acc;
    }, {});

    return {
        OS: data.profile.os,
        Terminal: data.profile.terminalName,
        Languages: (groupedSkills.Languages || []).join(', '),
        Frameworks: (groupedSkills.Frameworks || []).join(', '),
        Database: (groupedSkills.Database || []).join(', '),
        Tools: (groupedSkills.Tools || []).join(', '),
        'For more information': "type 'help'",
        'For weather information': "type 'weather [station icao code]'"
    };
}
