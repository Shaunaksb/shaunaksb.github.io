// Function to convert wind speed from knots to km/h
function knotsToKmh(knots) {
    return (knots * 1.852).toFixed(2);
}

// Function to convert UTC time to local time
function convertToLocalTime(utcTime) {
    const [hours, minutes] = utcTime.split(':');
    const date = new Date();
    date.setUTCHours(hours);
    date.setUTCMinutes(minutes);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Function to decode significant weather and cloud abbreviations
function decodeAbbreviation(abbreviation) {
    const decodingTable = {
        'HZ': 'Haze',
        'RA': 'Rain',
        'DZ': 'Drizzle',
        'BR': 'Mist',
        'TS': 'Thunderstorm',
        'FEW': 'Few Clouds',
        'SCT': 'Scattered Clouds',
        'BKN': 'Broken Clouds',
        'OVC': 'Overcast',
        'NOSIG': 'No Significant Change',
        'CB': 'Cumulonimbus',
        'TCU': 'Towering Cumulus'
    };
    return decodingTable[abbreviation] || abbreviation;
}

// Function to parse a single METAR report
function parseMetar(metar) {
    const result = { raw: metar };

    // Split the METAR into parts
    const parts = metar.split(' ');

    // Extract the station identifier
    result.station = parts[0];

    // Extract the date and time
    const dateTime = parts[1].match(/(\d{2})(\d{2})(\d{2})Z/);
    result.day = dateTime[1];
    result.utcTime = `${dateTime[2]}:${dateTime[3]} UTC`;
    result.localTime = convertToLocalTime(`${dateTime[2]}:${dateTime[3]}`);

    // Extract wind information
    const wind = parts[2].match(/(\d{3})(\d{2})G?(\d{2})?KT/);
    result.windDirection = `${wind[1]}°`;
    result.windSpeed = `${wind[2]} KT (${knotsToKmh(wind[2])} km/h)`;
    if (wind[3]) {
        result.windGust = `${wind[3]} KT (${knotsToKmh(wind[3])} km/h)`;
    }

    // Extract visibility
    result.visibility = parts[3] + ' meters';

    // Initialize clouds array and weather phenomena array
    result.clouds = [];
    result.weather = [];

    // Loop through parts to find and parse different elements
    for (let i = 4; i < parts.length; i++) {
        if (parts[i].startsWith('FEW') || parts[i].startsWith('SCT') || parts[i].startsWith('BKN') || parts[i].startsWith('OVC')) {
            const cloudMatch = parts[i].match(/(FEW|SCT|BKN|OVC)(\d{3})(CB|TCU)?/);
            result.clouds.push({
                coverage: decodeAbbreviation(cloudMatch[1]),
                altitude: parseInt(cloudMatch[2]) * 100 + ' feet',
                type: cloudMatch[3] ? decodeAbbreviation(cloudMatch[3]) : ''
            });
        } else if (parts[i].match(/^\d{2}\/\d{2}$/)) {
            // Extract temperature and dew point
            const tempDew = parts[i].split('/');
            result.temperature = tempDew[0] + '°C';
            result.dewPoint = tempDew[1] + '°C';
        } else if (parts[i].startsWith('Q')) {
            // Extract pressure
            result.pressure = parts[i].substring(1) + ' hPa';
        } else if (decodeAbbreviation(parts[i]) !== parts[i]) {
            // Extract and decode weather conditions (like HZ, RA)
            result.weather.push(decodeAbbreviation(parts[i]));
        } else if (parts[i] === 'NOSIG' || parts[i] === 'TEMPO') {
            // Extract trend information (if available)
            result.trend = decodeAbbreviation(parts[i]);
        }
    }

    return result;
}

// Function to fetch and decode METAR data for multiple stations
const getwx = async (container, stations) => {
    const response = await fetch(`https://api.met.no/weatherapi/tafmetar/1.0/?content=metar&content_type=text%2Fplain&icao=${stations}`, {
            method: 'GET',
            headers: {
                "Accept": "*/*",
            },
    });
    const mywx = await response.text();

    // Split the response by newlines into individual METAR lines
    const lines = mywx.trim().split('\n');

    // Create an object to hold the latest METAR report for each station
    const latestReports = {};

    // Iterate over each line and update the latest report for each station
    lines.forEach(line => {
        const stationCode = line.split(' ')[0];  // Extract the station code from the line
        latestReports[stationCode] = line;  // Update with the latest line seen for this station
    });

    // Build the output HTML by decoding the latest reports for all stations
    let weatherInfo = '';
    for (let station in latestReports) {
        const parsedMetar = parseMetar(latestReports[station]);

        // Construct the decoded information for each station
        weatherInfo += `<h3>Weather at airport ${station}:</h3>`;
        weatherInfo += `<p><strong>Raw METAR:</strong> ${parsedMetar.raw}</p>`;
        weatherInfo += `<p><strong>Date:</strong> ${parsedMetar.day}</p>`;
        weatherInfo += `<p><strong>Time:</strong> ${parsedMetar.utcTime} (UTC), ${parsedMetar.localTime} (Local)</p>`;
        weatherInfo += `<p><strong>Wind:</strong> ${parsedMetar.windDirection} at ${parsedMetar.windSpeed}`;
        if (parsedMetar.windGust) weatherInfo += `, Gusting to ${parsedMetar.windGust}`;
        weatherInfo += `</p>`;
        weatherInfo += `<p><strong>Visibility:</strong> ${parsedMetar.visibility}</p>`;
        weatherInfo += `<p><strong>Temperature:</strong> ${parsedMetar.temperature}, <strong>Dew Point:</strong> ${parsedMetar.dewPoint}</p>`;
        weatherInfo += `<p><strong>Pressure:</strong> ${parsedMetar.pressure}</p>`;
        if (parsedMetar.weather.length > 0) {
            weatherInfo += `<p><strong>Weather:</strong> ${parsedMetar.weather.join(', ')}</p>`;
        }
        if (parsedMetar.clouds.length > 0) {
            weatherInfo += `<p><strong>Clouds:</strong></p><ul>`;
            parsedMetar.clouds.forEach(cloud => {
                weatherInfo += `<li>${cloud.coverage} at ${cloud.altitude}`;
                if (cloud.type) weatherInfo += ` (${cloud.type})`;
                weatherInfo += `</li>`;
            });
            weatherInfo += `</ul>`;
        }
        if (parsedMetar.trend) {
            weatherInfo += `<p><strong>Trend:</strong> ${parsedMetar.trend}</p>`;
        }
        weatherInfo += `<hr>`;
    }

    // Display the collected weather information in the container
    container.innerHTML = weatherInfo;
}

// Function to handle user input and trigger the weather fetching
function wx(container, args){
    if (args.length > 0) {
        const stations = args[0];
        getwx(container, stations);
    } else {
        container.innerHTML = 'Please specify at least one station';
    }
}
