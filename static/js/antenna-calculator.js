// Antenna Length Calculator
// Based on K7MEM's End-Fed Antenna Calculator

const bands = {
    '160M': { low: 1.8, high: 2.0 },
    '80M': { low: 3.5, high: 4.0 },
    '60M': { low: 5.3305, high: 5.405 },
    '40M': { low: 7.0, high: 7.3 },
    '30M': { low: 10.100, high: 10.150 },
    '20M': { low: 14.0, high: 14.35 },
    '17M': { low: 18.068, high: 18.168 },
    '15M': { low: 21.0, high: 21.45 },
    '12M': { low: 24.890, high: 24.990 },
    '10M': { low: 28.0, high: 29.7 },
    '6M': { low: 50.0, high: 54.0 }
};

let selectedBands = new Set();

function initCalculator() {
    // Initialize with 40-10M bands selected
    selectBands(['40M', '20M', '15M', '10M']);
    updateChart();
}

function selectAllBands() {
    selectedBands = new Set(Object.keys(bands));
    updateCheckboxes();
    updateChart();
    updatePresetButtons('all');
}

function selectBands(bandList) {
    selectedBands = new Set(bandList);
    updateCheckboxes();
    updateChart();
    updatePresetButtons('hf');
}

function clearBands() {
    selectedBands.clear();
    updateCheckboxes();
    updateChart();
    updatePresetButtons('clear');
}

function updatePresetButtons(activePreset) {
    const buttons = document.querySelectorAll('.preset-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    if (activePreset === 'all') {
        buttons[0].classList.add('active'); // All Bands
    } else if (activePreset === 'hf') {
        buttons[1].classList.add('active'); // HF (40-10M)
    } else if (activePreset === 'clear') {
        // No active button for clear
    }
}

function updateCheckboxes() {
    Object.keys(bands).forEach(band => {
        const checkbox = document.getElementById(band);
        if (checkbox) {
            checkbox.checked = selectedBands.has(band);
        }
    });
}

function setMagicLength(length) {
    document.getElementById('wireLength').value = length;
    updateChart();
}

function updateChart() {
    // Update selected bands based on checkboxes
    selectedBands.clear();
    Object.keys(bands).forEach(band => {
        const checkbox = document.getElementById(band);
        if (checkbox && checkbox.checked) {
            selectedBands.add(band);
        }
    });

    drawChart();
}

function drawChart() {
    const svg = document.getElementById('antennaChart');
    if (!svg) return;

    // Clear previous content
    svg.innerHTML = '';

    // Only show selected bands
    const selectedBandsArray = Array.from(selectedBands).sort((a, b) => {
        const bandOrder = ['160M', '80M', '60M', '40M', '30M', '20M', '17M', '15M', '12M', '10M', '6M'];
        return bandOrder.indexOf(a) - bandOrder.indexOf(b);
    });

    if (selectedBandsArray.length === 0) {
        // Show message when no bands selected
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', '400');
        text.setAttribute('y', '200');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#666');
        text.setAttribute('font-size', '16px');
        text.textContent = 'Select bands to view analysis';
        svg.appendChild(text);
        return;
    }

    const width = 800;
    const height = 400;
    const margin = { top: 30, right: 80, bottom: 60, left: 70 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Create main group
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${margin.left},${margin.top})`);
    svg.appendChild(g);

    // Draw axes with improved styling
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', '0');
    xAxis.setAttribute('y1', chartHeight);
    xAxis.setAttribute('x2', chartWidth);
    xAxis.setAttribute('y2', chartHeight);
    xAxis.setAttribute('stroke', '#666');
    xAxis.setAttribute('stroke-width', '2');
    g.appendChild(xAxis);

    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', '0');
    yAxis.setAttribute('y1', '0');
    yAxis.setAttribute('x2', '0');
    yAxis.setAttribute('y2', chartHeight);
    yAxis.setAttribute('stroke', '#666');
    yAxis.setAttribute('stroke-width', '2');
    g.appendChild(yAxis);

    // X-axis labels (only selected bands) with improved styling
    const bandWidth = selectedBandsArray.length > 1 ? Math.min(chartWidth / selectedBandsArray.length * 0.7, 30) : 60;
    const availableWidth = chartWidth - bandWidth;
    const bandSpacing = selectedBandsArray.length > 1 ? availableWidth / (selectedBandsArray.length - 1) : 0;

    selectedBandsArray.forEach((band, index) => {
        const x = selectedBandsArray.length > 1 ? index * bandSpacing + bandWidth/2 : chartWidth / 2;

        // Band label
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', chartHeight + 25);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#cccccc');
        text.setAttribute('font-size', '13px');
        text.setAttribute('font-weight', '500');
        text.textContent = band;
        g.appendChild(text);

        // Frequency range
        if (bands[band]) {
            const freqText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            freqText.setAttribute('x', x);
            freqText.setAttribute('y', chartHeight + 40);
            freqText.setAttribute('text-anchor', 'middle');
            freqText.setAttribute('fill', '#888');
            freqText.setAttribute('font-size', '10px');
            freqText.textContent = `${bands[band].low}-${bands[band].high} MHz`;
            g.appendChild(freqText);
        }
    });

    // Y-axis labels (length in feet) with improved styling
    for (let i = 0; i <= 150; i += 25) {
        const y = chartHeight - (i / 150) * chartHeight;

        // Label
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', '-15');
        text.setAttribute('y', y + 4);
        text.setAttribute('text-anchor', 'end');
        text.setAttribute('fill', '#cccccc');
        text.setAttribute('font-size', '12px');
        text.setAttribute('font-weight', '500');
        text.textContent = `${i} ft`;
        g.appendChild(text);

        // Grid line with subtle styling
        const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        gridLine.setAttribute('x1', '0');
        gridLine.setAttribute('y1', y);
        gridLine.setAttribute('x2', chartWidth);
        gridLine.setAttribute('y2', y);
        gridLine.setAttribute('stroke', '#333');
        gridLine.setAttribute('stroke-width', '1');
        gridLine.setAttribute('opacity', '0.5');
        g.appendChild(gridLine);
    }

    // Draw problematic length regions with improved styling (only for selected bands)
    const barBandWidth = bandWidth; // Use the same bandWidth calculated above
    selectedBandsArray.forEach((band, index) => {
        const x = selectedBandsArray.length > 1 ? index * bandSpacing + bandWidth/2 : chartWidth / 2;

        // Calculate problematic length ranges for this band
        const badRanges = calculateBadRanges(band);

        badRanges.forEach(range => {
            const y1 = chartHeight - (range.max / 150) * chartHeight;
            const y2 = chartHeight - (range.min / 150) * chartHeight;
            const rectHeight = y2 - y1;

            if (rectHeight > 0) {
                const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('x', x - barBandWidth/2);
                rect.setAttribute('y', y1);
                rect.setAttribute('width', barBandWidth);
                rect.setAttribute('height', rectHeight);
                rect.setAttribute('fill', '#ff4444');
                rect.setAttribute('opacity', '0.6');
                rect.setAttribute('rx', '2');
                g.appendChild(rect);
            }
        });
    });

    // Draw user wire length line with improved styling
    const userLength = parseFloat(document.getElementById('wireLength').value) || 0;
    if (userLength > 0 && userLength <= 150) {
        const y = chartHeight - (userLength / 150) * chartHeight;

        // Main line
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', '0');
        line.setAttribute('y1', y);
        line.setAttribute('x2', chartWidth);
        line.setAttribute('y2', y);
        line.setAttribute('stroke', '#00ff00');
        line.setAttribute('stroke-width', '3');
        line.setAttribute('stroke-dasharray', 'none');
        g.appendChild(line);

        // Length label with background
        const labelBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        labelBg.setAttribute('x', chartWidth + 5);
        labelBg.setAttribute('y', y - 10);
        labelBg.setAttribute('width', '50');
        labelBg.setAttribute('height', '16');
        labelBg.setAttribute('fill', '#00ff00');
        labelBg.setAttribute('rx', '2');
        g.appendChild(labelBg);

        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', chartWidth + 30);
        label.setAttribute('y', y + 2);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('fill', '#000');
        label.setAttribute('font-size', '11px');
        label.setAttribute('font-weight', 'bold');
        label.textContent = `${userLength} ft`;
        g.appendChild(label);
    }

    // Update analysis summary
    updateAnalysisSummary();
}

function calculateBadRanges(band) {
    const bandData = bands[band];
    if (!bandData) return [];

    const ranges = [];

    // Lengths less than λ/4 are bad
    const minLength = 234 / bandData.low; // λ/4 in feet
    if (minLength < 150) {
        ranges.push({ min: 0, max: minLength });
    }

    // Multiples of λ/2 are bad
    const halfWavelengthLow = 468 / bandData.high; // λ/2 at high end of band
    const halfWavelengthHigh = 468 / bandData.low;  // λ/2 at low end of band

    // Find the range where λ/2 multiples fall
    let currentLength = halfWavelengthLow;
    while (currentLength <= 150) {
        const rangeStart = currentLength - 1; // Small tolerance
        const rangeEnd = currentLength + 1;
        ranges.push({ min: Math.max(0, rangeStart), max: Math.min(150, rangeEnd) });
        currentLength += halfWavelengthLow;
    }

    return ranges;
}

function updateAnalysisSummary() {
    const summaryElement = document.getElementById('analysisSummary');
    if (!summaryElement) return;

    const userLength = parseFloat(document.getElementById('wireLength').value) || 0;

    if (selectedBands.size === 0) {
        summaryElement.innerHTML = '<p>Please select at least one amateur band to analyze your end-fed random wire antenna performance with a 9:1 unun.</p>';
        return;
    }

    if (userLength < 1 || userLength > 150) {
        summaryElement.innerHTML = '<p>Please enter a valid random wire length between 1 and 150 feet for 9:1 unun matching.</p>';
        return;
    }

    let goodBands = [];
    let problematicBands = [];
    let analysisDetails = [];

    selectedBands.forEach(band => {
        const badRanges = calculateBadRanges(band);
        let isGoodLength = true;
        let issues = [];

        badRanges.forEach(range => {
            if (userLength >= range.min && userLength <= range.max) {
                isGoodLength = false;
                if (userLength < bands[band].low * 234 / 4) {
                    issues.push(`too short for ${band} band`);
                } else {
                    issues.push(`high impedance on ${band} harmonics`);
                }
            }
        });

        if (isGoodLength) {
            goodBands.push(band);
        } else {
            const issueDescriptions = issues.map(issue => {
                if (issue.includes('too short')) {
                    return 'insufficient length for efficient radiation';
                } else if (issue.includes('high impedance')) {
                    return 'potential impedance mismatch beyond 9:1 unun capability';
                }
                return issue;
            });
            problematicBands.push(`${band} (${issueDescriptions.join(', ')})`);
        }
    });

    let summaryHTML = '<div class="analysis-content">';

    if (goodBands.length > 0) {
        summaryHTML += `<div class="analysis-good">
            <strong>✓ Optimal Performance:</strong> ${userLength} ft provides good matching on ${goodBands.join(', ')}
        </div>`;
    }

    if (problematicBands.length > 0) {
        summaryHTML += `<div class="analysis-warning">
            <strong>⚠ Performance Issues:</strong> ${userLength} ft may have impedance problems on ${problematicBands.join(', ')}
        </div>`;
    }

    if (goodBands.length > 0 && problematicBands.length === 0) {
        summaryHTML += '<div class="analysis-recommendation">This wire length is well-suited for end-fed operation with a 9:1 unun across your selected bands. The impedance transformation should provide reasonable SWR for most transceivers.</div>';
    } else if (goodBands.length === 0) {
        summaryHTML += '<div class="analysis-recommendation">This length may exceed the impedance transformation range of a typical 9:1 unun. Consider a different wire length or evaluate with an antenna analyzer before deployment.</div>';
    } else {
        summaryHTML += '<div class="analysis-recommendation">This length provides good performance on some bands but may require careful positioning or additional matching for optimal results with your 9:1 unun.</div>';
    }

    summaryHTML += '</div>';
    summaryElement.innerHTML = summaryHTML;
}

// Initialize calculator when page loads
document.addEventListener('DOMContentLoaded', initCalculator);
