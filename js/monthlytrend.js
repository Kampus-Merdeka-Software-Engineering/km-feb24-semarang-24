document.addEventListener('DOMContentLoaded', (event) => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // Process the data to get sales per month
            const salesPerMonth = new Array(12).fill(0); // Initialize an array for 12 months

            data.forEach(order => {
                const month = new Date(order.date).getMonth(); // Get month (0-11)
                salesPerMonth[month] += parseInt(order.quantity);
            });

            // Create the chart
            const ctx = document.getElementById('monthlychart').getContext('2d');
            const salesChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    datasets: [{
                        label: 'Jumlah Penjualan',
                        data: salesPerMonth,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        fill: false
                    }]
                },
                options: {
                    scales: {
                        y: {
                            min : 3000,
                            max : 5000
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error loading data:', error));
});
