// Function to process data and get sales count per hour
function getSalesDataByHour(data) {
    const salesByHour = Array(24).fill(0);  // Initialize array for 24 hours

    data.forEach(order => {
        const hour = parseInt(order.time.split(':')[0], 10);
        salesByHour[hour] += parseInt(order.quantity, 10);
    });

    // Filter to include only hours from 9 AM to 9 PM
    const filteredHours = salesByHour.slice(9, 22);
    return filteredHours;
}

// Fetch data from data.json file
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        // Get the sales data by hour
        const salesDataByHour = getSalesDataByHour(data);

        // Labels for the chart (9 AM to 9 PM)
        const labels = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM'];

        // Chart.js configuration
        const ctx = document.getElementById('salesChart').getContext('2d');
        const salesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Sales by Hour',
                    data: salesDataByHour,
                    borderColor: 'rgba(210, 78, 55, 0.5)',
                    backgroundColor: 'rgba(210, 78, 55, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    })
    .catch(error => console.error('Error fetching data:', error));