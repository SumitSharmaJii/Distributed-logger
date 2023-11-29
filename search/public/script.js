
function searchLogs() {
    const column = document.getElementById('column').value;
    const searchQuery = document.getElementById('search').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;

    const url = `/search?column=${column}&query=${searchQuery}&startTime=${startTime}&endTime=${endTime}`;

    fetch(url)
        .then(response => response.json())
        .then(data => displayResults(data))
        .catch(error => console.error('Error:', error));
}

function displayResults(results) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = 'No results found.';
        return;
    }

    // Create a table to display results
    const table = document.createElement('table');
    table.border = '1';

    // Create header row
    const headerRow = table.insertRow(0);
    for (const key in results[0]) {
        const headerCell = headerRow.insertCell(-1);
        headerCell.textContent = key;
    }

    // Create data rows
    for (const result of results) {
        const row = table.insertRow(-1);
        for (const key in result) {
            const cell = row.insertCell(-1);
            cell.textContent = result[key];
        }
    }

    resultsContainer.appendChild(table);
}
