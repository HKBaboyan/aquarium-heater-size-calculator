const getValue = (id) => parseFloat(document.getElementById(id).value) || 0;

function roundToStandardHeater(watts) {
    const standardSizes = [25, 50, 75, 100, 150, 200, 250, 300, 400];
    const recommended = standardSizes.find(size => size >= watts);
    return recommended || 400; 
}

// Calculate function
function calculateHeater() {
    const unit = document.getElementById('unit').value;
    const res = document.getElementById('result');

    
    let vol = getValue('tank-vol');
    const tankTemp = getValue('target-temp');
    const roomTemp = getValue('room-temp');

    if (vol <= 0 || tankTemp <= 0 || roomTemp <= 0) {
        res.innerText = "Please enter valid numbers greater than zero.";
        return;
    }

    let internalVol = vol; // Defaults to Gallons
    let internalTankT = tankTemp; // Defaults to F
    let internalRoomT = roomTemp; // Defaults to F

    if (unit === 'metric') {
        internalVol = vol * 0.264172; // Liters to Gallons
        internalTankT = (tankTemp * 9/5) + 32; // C to F
        internalRoomT = (roomTemp * 9/5) + 32; // C to F
    }

    const deltaF = internalTankT - internalRoomT;

    if (deltaF <= 0) {
        res.innerText = "Your room is warmer than the desired tank temperature. No heater is required.";
        return;
    }

    let wattsPerGallon = 0;

    // Standard Rule of Thumb logic:
    // Minor raise (<9°F / 5°C): 2-3 Watts/Gallon
    // Average raise (10-18°F / 5-10°C): 5 Watts/Gallon
    // Major raise (>18°F / 10°C): 8-10 Watts/Gallon

    if (deltaF <= 9) {
        wattsPerGallon = 3; 
    } else if (deltaF <= 18) {
        wattsPerGallon = 5;
    } else {
        // Cold room/basement scenario
        wattsPerGallon = 8;
    }

    const rawWatts = internalVol * wattsPerGallon;
    const finalWatts = roundToStandardHeater(rawWatts);

    // Output
    res.innerHTML = `
        <strong>Recommended Heater Size: ${finalWatts} Watts</strong><br>
        <span style="font-size: 0.9rem; color: #334e68;">
            (Based on a ${deltaF.toFixed(1)}°F temperature difference)
        </span>
    `;
}

// Keyboard Enter Support
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        calculateHeater();
    }
});

// Clear all function
function clearAll() {
    document.getElementById('tank-vol').value = '';
    document.getElementById('target-temp').value = '';
    document.getElementById('room-temp').value = '';
    document.getElementById('result').innerText = '';
}