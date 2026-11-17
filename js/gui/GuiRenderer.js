/**
 * Renders portfolio data into the GUI view (mobile.html) using safe DOM construction.
 */
export class GuiRenderer {
    /**
     * @param {{ data: object, documentRef?: Document }} options
     */
    constructor({ data, documentRef = document }) {
        this.data = data;
        this.doc = documentRef;
    }

    /**
     * Populates all sections of the GUI page from portfolioData.
     */
    render() {
        this.renderHeader();
        this.renderAbout();
        this.renderFocusAreas();
        this.renderSkills();
        this.renderExperience();
        this.renderEducation();
        this.renderProjects();
        this.renderContact();
    }

    /**
     * Helper to create a DOM element with classes, text, and attributes.
     * @param {string} tag
     * @param {{ className?: string, text?: string, attrs?: Record<string, string>, children?: Array<Node|string> }} [options]
     * @returns {HTMLElement}
     */
    createEl(tag, options = {}) {
        const el = this.doc.createElement(tag);
        if (options.className) {
            el.className = options.className;
        }
        if (options.text !== undefined) {
            el.textContent = options.text;
        }
        if (options.attrs) {
            Object.entries(options.attrs).forEach(([key, value]) => {
                el.setAttribute(key, value);
            });
        }
        if (options.children) {
            options.children.forEach((child) => {
                if (typeof child === 'string') {
                    el.appendChild(this.doc.createTextNode(child));
                } else if (child) {
                    el.appendChild(child);
                }
            });
        }
        return el;
    }

    /**
     * Populates a social links `<ul>` container using a single shared helper.
     * @param {HTMLElement|null} listEl
     */
    populateSocialLinks(listEl) {
        if (!listEl) {
            return;
        }

        const items = this.data.socials.map((social) => {
            const isMailto = social.url.startsWith('mailto:');
            const attrs = {
                href: social.url,
                'aria-label': social.label,
                title: social.label
            };
            if (!isMailto) {
                attrs.target = '_blank';
                attrs.rel = 'noopener noreferrer';
            }

            return this.createEl('li', {
                children: [
                    this.createEl('a', {
                        attrs,
                        children: [this.createEl('ion-icon', { attrs: { name: social.ionIcon } })]
                    })
                ]
            });
        });

        listEl.replaceChildren(...items);
    }

    renderHeader() {
        const navUser = this.doc.getElementById('gui-nav-username');
        const githubSocial = this.data.socials.find((s) => s.id === 'github');
        if (navUser) {
            navUser.textContent = this.data.profile.username;
            if (githubSocial) {
                navUser.setAttribute('href', githubSocial.url);
                navUser.setAttribute('target', '_blank');
                navUser.setAttribute('rel', 'noopener noreferrer');
            }
        }

        const heroName = this.doc.getElementById('gui-hero-name');
        if (heroName) {
            heroName.textContent = this.data.profile.name;
        }

        const heroRole = this.doc.getElementById('gui-hero-role');
        if (heroRole) {
            heroRole.textContent = this.data.profile.role;
        }

        const heroAvatar = this.doc.getElementById('gui-hero-avatar');
        if (heroAvatar) {
            heroAvatar.setAttribute('src', this.data.profile.avatar);
            heroAvatar.setAttribute('alt', this.data.profile.name);
        }
    }

    renderAbout() {
        const aboutText = this.doc.getElementById('gui-about-text');
        if (aboutText) {
            aboutText.textContent = this.data.profile.about;
        }
        this.populateSocialLinks(this.doc.getElementById('gui-about-socials'));
    }

    renderFocusAreas() {
        const container = this.doc.getElementById('gui-focus-areas');
        if (!container) {
            return;
        }

        const items = this.data.focusAreas.map((area) => {
            const bar = this.createEl('div', {
                className: 'progress-bar color-1',
                attrs: {
                    role: 'progressbar',
                    'aria-valuenow': String(area.percentage),
                    'aria-valuemin': '0',
                    'aria-valuemax': '100'
                }
            });
            bar.style.width = `${area.percentage}%`;

            return this.createEl('div', {
                className: 'col-md-6 mt-3',
                children: [
                    this.createEl('div', {
                        className: 'progress-wrap',
                        children: [
                            this.createEl('h4', { text: area.name }),
                            this.createEl('div', {
                                className: 'progress progress-style',
                                children: [bar]
                            })
                        ]
                    })
                ]
            });
        });

        container.replaceChildren(...items);
    }

    renderSkills() {
        const grid = this.doc.getElementById('gui-skills-grid');
        if (!grid) {
            return;
        }

        const cards = this.data.skills.map((skill) =>
            this.createEl('div', {
                className: 'col-lg-3 col-md-4 mt-4',
                children: [
                    this.createEl('div', {
                        className: 'icon-box',
                        children: [
                            this.createEl('i', { className: skill.icon }),
                            this.createEl('h3', { text: skill.name })
                        ]
                    })
                ]
            })
        );

        grid.replaceChildren(...cards);
    }

    renderExperience() {
        const list = this.doc.getElementById('gui-experience-list');
        if (!list) {
            return;
        }

        const entries = this.data.experience.map((item) =>
            this.createEl('div', {
                className: 'mt-3',
                children: [
                    this.createEl('div', {
                        className: 'py-4',
                        children: [
                            this.createEl('div', {
                                className: 'desc',
                                children: [
                                    this.createEl('h4', { text: item.role }),
                                    this.createEl('p', { text: `${item.company} | ${item.period}` })
                                ]
                            }),
                            this.createEl('div', {
                                children: item.highlights.map((line) => this.createEl('p', { text: line }))
                            })
                        ]
                    })
                ]
            })
        );

        list.replaceChildren(...entries);
    }

    renderEducation() {
        const list = this.doc.getElementById('gui-education-list');
        if (!list) {
            return;
        }

        const entries = this.data.education.map((item) =>
            this.createEl('div', {
                className: 'mt-3',
                children: [
                    this.createEl('div', {
                        className: 'py-4',
                        children: [
                            this.createEl('div', {
                                className: 'desc',
                                children: [
                                    this.createEl('h4', { text: item.degree }),
                                    this.createEl('p', { text: item.institution })
                                ]
                            }),
                            this.createEl('div', {
                                children: [this.createEl('p', { text: item.period })]
                            })
                        ]
                    })
                ]
            })
        );

        list.replaceChildren(...entries);
    }

    renderProjects() {
        const list = this.doc.getElementById('gui-projects-list');
        if (!list) {
            return;
        }

        const entries = this.data.projects.map((project) =>
            this.createEl('div', {
                className: 'mt-3',
                children: [
                    this.createEl('div', {
                        className: 'py-4',
                        children: [
                            this.createEl('div', {
                                className: 'desc',
                                children: [
                                    this.createEl('h4', { text: project.title }),
                                    this.createEl('p', { text: project.subtitle })
                                ]
                            }),
                            this.createEl('div', {
                                children: project.highlights.map((line) => this.createEl('p', { text: line }))
                            })
                        ]
                    })
                ]
            })
        );

        list.replaceChildren(...entries);
    }

    renderContact() {
        const heading = this.doc.getElementById('gui-contact-heading');
        if (heading) {
            heading.replaceChildren(
                this.doc.createTextNode(
                    `Have a great product and need a ${this.data.profile.role} or just want to have a chat?`
                ),
                this.doc.createElement('br'),
                this.doc.createTextNode('My inbox is always open!')
            );
        }
        this.populateSocialLinks(this.doc.getElementById('gui-contact-socials'));
    }
}
