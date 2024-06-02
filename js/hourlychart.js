// Function to process data and get sales count per hour
function getSalesDataByHour(data) {
    const salesByHour = Array(24).fill(0);  // Initialize array for 24 hours

    data.forEach(order => {
        const hour = parseInt(order.time.split(':')[0], 10);
        salesByHour[hour] += parseInt(order.quantity, 10);
    });

    // Filter to include only hours from 9 AM to 11 PM
    const filteredHours = salesByHour.slice(9, 24);
    return filteredHours;
}

// Fetch data from data.json file
fetch('json/data.json')
    .then(response => response.json())
    .then(data => {
        // Get the sales data by hour
        const salesDataByHour = getSalesDataByHour(data);

        // Labels for the chart (9 AM to 11 PM)
        const labels = ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM'];

        // Chart.js configuration
        const ctx = document.getElementById('hourlychart').getContext('2d');
        const salesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total Order per Hour',
                    data: salesDataByHour,
                    borderColor: 'rgba(210, 78, 55, 0.5)',
                    backgroundColor: 'rgba(210, 78, 55, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0, // Set the minimum value for the y-axis
                        max: 8000 // Set the maximum value for the y-axis (adjust as needed)
                    }
                }
            }
        });
    })
    .catch(error => console.error('Error fetching data:', error));
