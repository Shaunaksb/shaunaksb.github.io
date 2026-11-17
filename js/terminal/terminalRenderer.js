import { getSystemInfo } from '../data/portfolioData.js';

/**
 * Creates a DOM element safely without using innerHTML.
 * @param {Document} doc
 * @param {string} tag
 * @param {{ className?: string, id?: string, text?: string, dataset?: Record<string, string>, children?: Array<Node|string> }} [options]
 * @returns {HTMLElement}
 */
function createEl(doc, tag, options = {}) {
    const el = doc.createElement(tag);
    if (options.className) {
        el.className = options.className;
    }
    if (options.id) {
        el.id = options.id;
    }
    if (options.text !== undefined) {
        el.textContent = options.text;
    }
    if (options.dataset) {
        Object.entries(options.dataset).forEach(([key, value]) => {
            el.dataset[key] = value;
        });
    }
    if (options.children) {
        options.children.forEach((child) => {
            if (typeof child === 'string') {
                el.appendChild(doc.createTextNode(child));
            } else if (child) {
                el.appendChild(child);
            }
        });
    }
    return el;
}

/**
 * Creates a labeled paragraph line (`<p><strong>label:</strong> value</p>`).
 * @param {Document} doc
 * @param {string} label
 * @param {string} value
 * @returns {HTMLElement}
 */
function createLabeledParagraph(doc, label, value) {
    return createEl(doc, 'p', {
        children: [
            createEl(doc, 'strong', { text: `${label}:` }),
            ` ${value}`
        ]
    });
}

/**
 * Renders the portofetch banner and derived system summary.
 * @param {object} data
 * @param {Document} [doc]
 * @returns {HTMLElement}
 */
export function renderPortofetch(data, doc = document) {
    const systemInfo = getSystemInfo(data);
    const infoLines = Object.entries(systemInfo).map(([key, value]) =>
        createEl(doc, 'p', {
            className: 'info-line',
            children: [
                createEl(doc, 'span', { className: 'info-label', text: `${key}:` }),
                ` ${value}`
            ]
        })
    );

    return createEl(doc, 'div', {
        className: 'portofetch-container',
        children: [
            createEl(doc, 'pre', { id: 'ascii-art', text: data.profile.asciiArt }),
            createEl(doc, 'div', { id: 'system-info', children: infoLines })
        ]
    });
}

/**
 * Renders the about summary.
 * @param {object} data
 * @param {Document} [doc]
 * @returns {HTMLElement}
 */
export function renderAbout(data, doc = document) {
    return createEl(doc, 'div', {
        className: 'command-output',
        children: [createEl(doc, 'p', { text: data.profile.about })]
    });
}

/**
 * Renders the tech stack grid.
 * @param {Array<{ name: string, icon: string }>} skills
 * @param {Document} [doc]
 * @returns {HTMLElement}
 */
export function renderSkills(skills, doc = document) {
    const items = skills.map((skill) =>
        createEl(doc, 'div', {
            className: 'skill-item',
            children: [
                createEl(doc, 'i', { className: skill.icon }),
                ` ${skill.name}`
            ]
        })
    );

    return createEl(doc, 'div', {
        className: 'skills-container',
        children: items
    });
}

/**
 * Renders the projects list.
 * @param {Array<{ title: string, subtitle: string, highlights: string[] }>} projects
 * @param {Document} [doc]
 * @returns {HTMLElement}
 */
export function renderProjects(projects, doc = document) {
    const items = projects.map((project, index) =>
        createEl(doc, 'div', {
            className: 'terminal-item',
            children: [
                createEl(doc, 'div', {
                    className: 'terminal-item-title',
                    text: `${index + 1}. ${project.title}`
                }),
                createEl(doc, 'div', {
                    className: 'terminal-item-subtitle',
                    text: project.subtitle
                }),
                createEl(doc, 'ul', {
                    className: 'terminal-list',
                    children: project.highlights.map((item) => createEl(doc, 'li', { text: item }))
                })
            ]
        })
    );

    return createEl(doc, 'div', {
        className: 'command-output',
        children: items
    });
}

/**
 * Renders work experience items.
 * @param {Array<{ role: string, company: string, period: string, highlights: string[] }>} experience
 * @param {Document} [doc]
 * @returns {HTMLElement}
 */
export function renderExperience(experience, doc = document) {
    const items = experience.map((entry) =>
        createEl(doc, 'div', {
            className: 'terminal-item',
            children: [
                createEl(doc, 'div', {
                    className: 'terminal-item-title',
                    text: `${entry.role} — ${entry.company}`
                }),
                createEl(doc, 'div', {
                    className: 'terminal-item-subtitle',
                    text: entry.period
                }),
                createEl(doc, 'ul', {
                    className: 'terminal-list',
                    children: entry.highlights.map((item) => createEl(doc, 'li', { text: item }))
                })
            ]
        })
    );

    return createEl(doc, 'div', {
        className: 'command-output',
        children: items
    });
}

/**
 * Renders education history.
 * @param {Array<{ degree: string, institution: string, period: string }>} education
 * @param {Document} [doc]
 * @returns {HTMLElement}
 */
export function renderEducation(education, doc = document) {
    const items = education.map((entry) =>
        createEl(doc, 'div', {
            className: 'terminal-item',
            children: [
                createEl(doc, 'div', { className: 'terminal-item-title', text: entry.degree }),
                createEl(doc, 'div', { text: entry.institution }),
                createEl(doc, 'div', { className: 'terminal-item-subtitle', text: entry.period })
            ]
        })
    );

    return createEl(doc, 'div', {
        className: 'command-output',
        children: items
    });
}

/**
 * Renders contact entries with clickable command triggers.
 * @param {Array<{ id: string, label: string, value: string }>} socials
 * @param {Document} [doc]
 * @returns {HTMLElement}
 */
export function renderContact(socials, doc = document) {
    const lines = socials.map((social) =>
        createEl(doc, 'p', {
            className: 'info-line',
            children: [
                createEl(doc, 'span', { className: 'info-label', text: `${social.label}:` }),
                ` ${social.value} (`,
                createEl(doc, 'span', {
                    className: 'clickable-command',
                    text: social.id,
                    dataset: { command: social.id }
                }),
                ')'
            ]
        })
    );

    lines.push(
        createEl(doc, 'p', {
            className: 'info-line',
            text: 'Run any command above to open the link and copy it to your clipboard.'
        })
    );

    return createEl(doc, 'div', {
        className: 'command-output',
        children: lines
    });
}

/**
 * Renders the command help list dynamically from registered commands.
 * @param {Array<{ name: string, usage: string, usageCommand: string, description: string }>} commands
 * @param {Document} [doc]
 * @returns {HTMLElement}
 */
export function renderHelp(commands, doc = document) {
    const header = createEl(doc, 'div', { text: 'Available commands:' });
    const lines = commands.map((cmd) =>
        createEl(doc, 'div', {
            children: [
                '- ',
                createEl(doc, 'span', {
                    className: 'clickable-command',
                    text: cmd.usage,
                    dataset: { command: cmd.usageCommand }
                }),
                `: ${cmd.description}`
            ]
        })
    );

    return createEl(doc, 'div', {
        className: 'command-output',
        children: [header, ...lines]
    });
}

/**
 * Renders command history safely using textContent.
 * @param {string[]} historyList
 * @param {Document} [doc]
 * @returns {HTMLElement}
 */
export function renderHistory(historyList, doc = document) {
    return createEl(doc, 'div', {
        className: 'command-output',
        children: [
            createEl(doc, 'pre', {
                text: historyList.length > 0 ? historyList.join('\n') : 'No commands in history.'
            })
        ]
    });
}

/**
 * Renders parsed METAR weather reports safely.
 * @param {Array<object>} reports
 * @param {Document} [doc]
 * @returns {HTMLElement}
 */
export function renderWeatherReports(reports, doc = document) {
    if (!reports || reports.length === 0) {
        return createEl(doc, 'div', {
            className: 'command-output',
            text: 'No METAR reports found for the specified station(s).'
        });
    }

    const reportNodes = reports.map((report) => {
        const children = [
            createEl(doc, 'h3', { text: `Weather at airport ${report.station}:` }),
            createLabeledParagraph(doc, 'Raw METAR', report.raw)
        ];

        if (report.day) {
            children.push(createLabeledParagraph(doc, 'Date', report.day));
        }
        if (report.utcTime) {
            children.push(createLabeledParagraph(doc, 'Time', `${report.utcTime}, ${report.localTime} (Local)`));
        }
        if (report.windSpeed) {
            const windText = report.windGust
                ? `${report.windDirection} at ${report.windSpeed}, Gusting to ${report.windGust}`
                : `${report.windDirection} at ${report.windSpeed}`;
            children.push(createLabeledParagraph(doc, 'Wind', windText));
        }
        if (report.visibility) {
            children.push(createLabeledParagraph(doc, 'Visibility', report.visibility));
        }
        if (report.temperature) {
            const tempText = report.dewPoint
                ? `${report.temperature}, Dew Point: ${report.dewPoint}`
                : report.temperature;
            children.push(createLabeledParagraph(doc, 'Temperature', tempText));
        }
        if (report.pressure) {
            children.push(createLabeledParagraph(doc, 'Pressure', report.pressure));
        }
        if (report.weather && report.weather.length > 0) {
            children.push(createLabeledParagraph(doc, 'Weather', report.weather.join(', ')));
        }
        if (report.clouds && report.clouds.length > 0) {
            children.push(createEl(doc, 'p', { children: [createEl(doc, 'strong', { text: 'Clouds:' })] }));
            children.push(
                createEl(doc, 'ul', {
                    children: report.clouds.map((cloud) => {
                        const cloudText = cloud.type
                            ? `${cloud.coverage} at ${cloud.altitude} (${cloud.type})`
                            : `${cloud.coverage} at ${cloud.altitude}`;
                        return createEl(doc, 'li', { text: cloudText });
                    })
                })
            );
        }
        if (report.trend) {
            children.push(createLabeledParagraph(doc, 'Trend', report.trend));
        }

        children.push(createEl(doc, 'hr'));

        return createEl(doc, 'div', {
            className: 'weather-report',
            children
        });
    });

    return createEl(doc, 'div', {
        className: 'command-output',
        children: reportNodes
    });
}
