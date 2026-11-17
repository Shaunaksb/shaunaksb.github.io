const METAR_ENDPOINT = 'https://api.met.no/weatherapi/tafmetar/1.0/';

const WEATHER_ABBREVIATIONS = {
    HZ: 'Haze',
    RA: 'Rain',
    DZ: 'Drizzle',
    BR: 'Mist',
    FG: 'Fog',
    TS: 'Thunderstorm',
    SN: 'Snow',
    GR: 'Hail',
    SH: 'Showers',
    FEW: 'Few Clouds',
    SCT: 'Scattered Clouds',
    BKN: 'Broken Clouds',
    OVC: 'Overcast',
    VV: 'Vertical Visibility',
    NOSIG: 'No Significant Change',
    TEMPO: 'Temporary Fluctuations',
    BECMG: 'Becoming',
    CB: 'Cumulonimbus',
    TCU: 'Towering Cumulus'
};

const WEATHER_INTENSITIES = {
    '+': 'Heavy',
    '-': 'Light',
    VC: 'In Vicinity'
};

const WEATHER_DESCRIPTORS = {
    SH: 'Showers',
    TS: 'Thunderstorm',
    FZ: 'Freezing',
    BL: 'Blowing',
    DR: 'Low Drifting',
    MI: 'Shallow',
    PR: 'Partial',
    BC: 'Patches'
};

/**
 * Converts wind speed from knots to km/h.
 * @param {number|string} knots
 * @returns {string}
 */
export function knotsToKmh(knots) {
    return (Number(knots) * 1.852).toFixed(2);
}

/**
 * Converts a UTC hour/minute pair into a localized time string.
 * @param {number|string} utcHours
 * @param {number|string} utcMinutes
 * @returns {string}
 */
export function convertToLocalTime(utcHours, utcMinutes) {
    const date = new Date();
    date.setUTCHours(Number(utcHours), Number(utcMinutes), 0, 0);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Decodes a single METAR weather or cloud abbreviation.
 * @param {string} abbreviation
 * @returns {string}
 */
export function decodeAbbreviation(abbreviation) {
    return WEATHER_ABBREVIATIONS[abbreviation] || abbreviation;
}

/**
 * Formats a METAR temperature group (supporting negative 'M' prefixes).
 * @param {string} rawTemp
 * @returns {string}
 */
function formatTemperature(rawTemp) {
    if (!rawTemp) {
        return '';
    }
    return `${rawTemp.replace(/^M/, '-')}°C`;
}

/**
 * Decodes composite weather phenomenon tokens (e.g. "+TSRA", "-DZ", "HZ").
 * @param {string} token
 * @returns {string|null}
 */
function decodeWeatherToken(token) {
    if (WEATHER_ABBREVIATIONS[token] && !['FEW', 'SCT', 'BKN', 'OVC', 'VV', 'NOSIG', 'TEMPO', 'BECMG', 'CB', 'TCU'].includes(token)) {
        return WEATHER_ABBREVIATIONS[token];
    }

    const match = token.match(/^(\+|-|VC)?(SH|TS|FZ|BL|DR|MI|PR|BC)?(HZ|RA|DZ|BR|FG|SN|GR)$/);
    if (!match) {
        return null;
    }

    const [, intensity, descriptor, phenomenon] = match;
    const parts = [];
    if (intensity && WEATHER_INTENSITIES[intensity]) {
        parts.push(WEATHER_INTENSITIES[intensity]);
    }
    if (descriptor && WEATHER_DESCRIPTORS[descriptor]) {
        parts.push(WEATHER_DESCRIPTORS[descriptor]);
    }
    if (phenomenon && WEATHER_ABBREVIATIONS[phenomenon]) {
        parts.push(WEATHER_ABBREVIATIONS[phenomenon]);
    }
    return parts.join(' ');
}

/**
 * Parses a single raw METAR string into structured weather data.
 * @param {string} metar
 * @returns {object}
 */
export function parseMetar(metar) {
    const raw = (metar || '').trim();
    const parts = raw.split(/\s+/).filter(Boolean);

    const result = {
        raw,
        station: 'Unknown',
        day: null,
        utcTime: null,
        localTime: null,
        windDirection: null,
        windSpeed: null,
        windGust: null,
        visibility: null,
        temperature: null,
        dewPoint: null,
        pressure: null,
        clouds: [],
        weather: [],
        trend: null
    };

    if (parts.length === 0) {
        return result;
    }

    let index = 0;
    if (parts[index] === 'METAR' || parts[index] === 'SPECI') {
        index += 1;
    }

    if (parts[index] && /^[A-Z0-9]{4}$/.test(parts[index])) {
        result.station = parts[index];
        index += 1;
    }

    for (let i = index; i < parts.length; i += 1) {
        const token = parts[i];

        // Stop before remarks section so remark tokens do not pollute parsed fields.
        if (token === 'RMK') {
            break;
        }

        if (token === 'AUTO' || token === 'COR') {
            continue;
        }

        const dateTimeMatch = token.match(/^(\d{2})(\d{2})(\d{2})Z$/);
        if (dateTimeMatch && !result.utcTime) {
            const [, day, hours, minutes] = dateTimeMatch;
            result.day = day;
            result.utcTime = `${hours}:${minutes} UTC`;
            result.localTime = convertToLocalTime(hours, minutes);
            continue;
        }

        const windMatch = token.match(/^(\d{3}|VRB)(\d{2,3})(?:G(\d{2,3}))?KT$/);
        if (windMatch && !result.windSpeed) {
            const [, direction, speed, gust] = windMatch;
            result.windDirection = direction === 'VRB' ? 'Variable' : `${direction}°`;
            result.windSpeed = `${speed} KT (${knotsToKmh(speed)} km/h)`;
            if (gust) {
                result.windGust = `${gust} KT (${knotsToKmh(gust)} km/h)`;
            }
            continue;
        }

        if (token === 'CAVOK') {
            result.visibility = 'CAVOK (10 km or more, no significant weather/clouds)';
            continue;
        }

        if (/^\d{4}$/.test(token) && !result.visibility) {
            result.visibility = `${token} meters`;
            continue;
        }

        if (/^(?:\d{1,2}\/)?\d+SM$/.test(token) && !result.visibility) {
            result.visibility = token;
            continue;
        }

        const cloudMatch = token.match(/^(FEW|SCT|BKN|OVC|VV)(\d{3}|\/\/\/)(CB|TCU)?$/);
        if (cloudMatch) {
            const [, coverage, height, cloudType] = cloudMatch;
            result.clouds.push({
                coverage: decodeAbbreviation(coverage),
                altitude: height === '///' ? 'Unknown altitude' : `${parseInt(height, 10) * 100} feet`,
                type: cloudType ? decodeAbbreviation(cloudType) : ''
            });
            continue;
        }

        const tempMatch = token.match(/^(M?\d{2})\/(M?\d{2})?$/);
        if (tempMatch && !result.temperature) {
            result.temperature = formatTemperature(tempMatch[1]);
            result.dewPoint = tempMatch[2] ? formatTemperature(tempMatch[2]) : null;
            continue;
        }

        const qnhMatch = token.match(/^Q(\d{4})$/);
        if (qnhMatch && !result.pressure) {
            result.pressure = `${qnhMatch[1]} hPa`;
            continue;
        }

        const altimeterMatch = token.match(/^A(\d{4})$/);
        if (altimeterMatch && !result.pressure) {
            const inches = (Number(altimeterMatch[1]) / 100).toFixed(2);
            result.pressure = `${inches} inHg`;
            continue;
        }

        if (token === 'NOSIG' || token === 'TEMPO' || token === 'BECMG') {
            result.trend = decodeAbbreviation(token);
            continue;
        }

        const decodedWeather = decodeWeatherToken(token);
        if (decodedWeather) {
            result.weather.push(decodedWeather);
        }
    }

    return result;
}

/**
 * Fetches and parses the latest METAR reports for one or more comma-separated ICAO codes.
 * @param {string} stationQuery
 * @param {typeof fetch} [fetchImpl]
 * @returns {Promise<Array<ReturnType<typeof parseMetar>>>}
 */
export async function fetchMetarReports(stationQuery, fetchImpl = fetch) {
    const normalized = (stationQuery || '')
        .trim()
        .toUpperCase()
        .replace(/[\s,]+/g, ',')
        .replace(/^,|,$/g, '');

    if (!normalized || !/^[A-Z0-9,]+$/.test(normalized)) {
        throw new Error('Invalid ICAO station code(s). Example: weather VANP');
    }

    const url = `${METAR_ENDPOINT}?content=metar&content_type=text%2Fplain&icao=${encodeURIComponent(normalized)}`;
    const response = await fetchImpl(url, {
        method: 'GET',
        headers: {
            Accept: 'text/plain, */*'
        }
    });

    if (!response.ok) {
        throw new Error(`Weather API request failed with status ${response.status}.`);
    }

    const body = await response.text();
    const lines = body
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

    const latestReports = {};
    for (const line of lines) {
        const parsed = parseMetar(line);
        latestReports[parsed.station] = parsed;
    }

    return Object.values(latestReports);
}
