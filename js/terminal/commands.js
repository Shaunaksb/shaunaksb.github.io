/**
 * Registers all default terminal commands into the given CommandRegistry.
 * @param {import('./CommandRegistry.js').CommandRegistry} registry
 * @param {{
 *   data: object,
 *   weatherService: { fetchMetarReports: Function },
 *   clipboardService: { copyToClipboard: Function },
 *   renderer: object
 * }} deps
 */
export function registerDefaultCommands(registry, { data, weatherService, clipboardService, renderer }) {
    registry.register({
        name: 'help',
        description: 'Show available commands',
        execute: (_, api) => {
            api.printElement(renderer.renderHelp(registry.getAll()));
        }
    });

    registry.register({
        name: 'portofetch',
        description: 'Brief information about me',
        execute: (_, api) => {
            api.printElement(renderer.renderPortofetch(data));
        }
    });

    registry.register({
        name: 'about',
        description: 'About me',
        includeInAllInfo: true,
        execute: (_, api) => {
            api.printElement(renderer.renderAbout(data));
        }
    });

    registry.register({
        name: 'skills',
        description: 'Show my skills',
        includeInAllInfo: true,
        execute: (_, api) => {
            api.printElement(renderer.renderSkills(data.skills));
        }
    });

    registry.register({
        name: 'projects',
        description: 'My projects',
        includeInAllInfo: true,
        execute: (_, api) => {
            api.printElement(renderer.renderProjects(data.projects));
        }
    });

    registry.register({
        name: 'experience',
        description: 'My experience',
        includeInAllInfo: true,
        execute: (_, api) => {
            api.printElement(renderer.renderExperience(data.experience));
        }
    });

    registry.register({
        name: 'education',
        description: 'My education',
        includeInAllInfo: true,
        execute: (_, api) => {
            api.printElement(renderer.renderEducation(data.education));
        }
    });

    registry.register({
        name: 'contact',
        description: 'How to contact me',
        includeInAllInfo: true,
        execute: (_, api) => {
            api.printElement(renderer.renderContact(data.socials));
        }
    });

    registry.register({
        name: 'allinfo',
        description: 'Display all information',
        execute: async (_, api) => {
            const sections = registry.getAllInfoCommands();
            for (const cmd of sections) {
                api.printText(`==== ${cmd.name.toUpperCase()} ====`, 'command-section-header');
                await cmd.execute([], api);
            }
        }
    });

    for (const social of data.socials) {
        registry.register({
            name: social.id,
            description: social.description,
            execute: async (_, api) => {
                const copied = await clipboardService.copyToClipboard(social.value);
                const status = copied
                    ? `Copied ${social.label} to clipboard and opening: ${social.value}`
                    : `Opening ${social.label}: ${social.value}`;
                api.printText(status);
                api.openLink(social.url, social.id === 'email' ? '_self' : '_blank');
            }
        });
    }

    registry.register({
        name: 'greet',
        usage: 'greet [name]',
        usageCommand: 'greet Visitor',
        description: 'Greet a visitor by name',
        execute: (args, api) => {
            if (args.length > 0) {
                api.printText(`Hi, ${args.join(' ')}!`);
            } else {
                api.printText('Please specify a name to greet. Usage: greet [name]');
            }
        }
    });

    registry.register({
        name: 'weather',
        usage: 'weather VANP',
        usageCommand: 'weather VANP',
        description: 'Get weather information for an airport in form of METAR. Example: weather at Nagpur Airport',
        execute: async (args, api) => {
            if (args.length === 0) {
                api.printText('Please specify at least one station ICAO code. Usage: weather [station_icao]');
                return;
            }

            const statusEl = api.printText(`Fetching METAR for ${args.join(',').toUpperCase()}...`);
            try {
                const reports = await weatherService.fetchMetarReports(args.join(','));
                const rendered = renderer.renderWeatherReports(reports);
                statusEl.replaceWith(rendered);
            } catch (error) {
                statusEl.textContent = `Unable to fetch weather data: ${error.message}`;
            }
        }
    });

    registry.register({
        name: 'blog',
        description: 'Open my blog & research notes',
        execute: (_, api) => {
            api.printText('Opening /blog/...');
            api.openLink('/blog/', '_self');
        }
    });

    registry.register({
        name: 'cd',
        usage: 'cd [target]',
        usageCommand: 'cd blog',
        description: 'Navigate to a section (e.g. cd blog, cd gui, cd ~)',
        execute: (args, api) => {
            const target = (args[0] || '~').trim().toLowerCase().replace(/\/+$/, '');
            if (target === 'blog' || target === '/blog' || target === '~/blog') {
                api.printText('Navigating to /blog/...');
                api.openLink('/blog/', '_self');
                return;
            }
            if (target === 'gui' || target === 'mobile') {
                api.printText('Switching to GUI mode...');
                api.openLink('/mobile.html', '_self');
                return;
            }
            if (target === '~' || target === '/' || target === '.') {
                api.printText('Already at ~');
                return;
            }
            api.printText(`cd: no such directory: ${args[0]}. Try: cd blog, cd gui`);
        }
    });

    registry.register({
        name: 'history',
        description: 'Show command history',
        execute: (_, api) => {
            api.printElement(renderer.renderHistory(api.getHistory()));
        }
    });

    registry.register({
        name: 'clear',
        description: 'Clear the screen',
        execute: (_, api) => {
            api.clear();
        }
    });

    registry.register({
        name: 'exit',
        description: 'Close the terminal',
        execute: (_, api) => {
            api.exit();
        }
    });
}
