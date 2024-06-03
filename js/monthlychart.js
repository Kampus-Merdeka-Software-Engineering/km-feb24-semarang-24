// document.addEventListener('DOMContentLoaded', (event) => {
//     fetch('json/data.json')
//         .then(response => response.json())
//         .then(data => {
//             // Process the data to get sales per month
//             const salesPerMonth = new Array(12).fill(0); // Initialize an array for 12 months

//             data.forEach(order => {
//                 const month = new Date(order.date).getMonth(); // Get month (0-11)
//                 salesPerMonth[month] += parseInt(order.quantity);
//             });

//             // Calculate the maximum value of sales
//             const maxSales = Math.max(...salesPerMonth);
//             const minY = 3800;
//             const maxY = 4500;

//             // Create the chart
//             const ctx = document.getElementById('monthlychart').getContext('2d');
//             const salesChart = new Chart(ctx, {
//                 type: 'line',
//                 data: {
//                     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
//                     datasets: [{
//                         label: 'Total Orders per Month',
//                         data: salesPerMonth,
//                         borderColor: 'rgba(210, 78, 55, 0.5)',
//                         backgroundColor: 'rgba(210, 78, 55, 1)',
//                         borderWidth: 1,
//                         fill: false
//                     }]
//                 },
//                 options: {
//                     plugins: {legend: {display: false}},
//                     scales: {
//                         y: {
//                             min: Math.min(minY, Math.min(...salesPerMonth)),
//                             max: Math.max(maxY, Math.max(...salesPerMonth))
//                         }
//                     }
//                 }
//             });
//         })
//         .catch(error => console.error('Error loading data:', error));
// });


document.addEventListener('DOMContentLoaded', (event) => {
    let dataCache = [];

    fetch('json/data.json')
        .then(response => response.json())
        .then(data => {
            dataCache = data; // Cache data for later use
            updateChart(dataCache);
        })
        .catch(error => console.error('Error loading data:', error));

    document.getElementById('applyFilters').addEventListener('click', () => {
        updateChart(dataCache);
    });

    function updateChart(data) {
        const startDate = new Date(document.getElementById('start-date').value);
        const endDate = new Date(document.getElementById('end-date').value);
        
        const filteredData = data.filter(order => {
            const orderDate = new Date(order.date);
            return (!isNaN(startDate) ? orderDate >= startDate : true) && 
                   (!isNaN(endDate) ? orderDate <= endDate : true);
        });

        const salesPerMonth = new Array(12).fill(0); // Initialize an array for 12 months

        filteredData.forEach(order => {
            const month = new Date(order.date).getMonth(); // Get month (0-11)
            salesPerMonth[month] += parseInt(order.quantity);
        });

        // Calculate the maximum value of sales
        const maxSales = Math.max(...salesPerMonth);
        const minY = 3800;
        const maxY = 4500;

        // Create the chart
        const ctx = document.getElementById('monthlychart').getContext('2d');
        if (window.salesChart) {
            window.salesChart.destroy();
        }
        window.salesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Total Orders per Month',
                    data: salesPerMonth,
                    borderColor: 'rgba(210, 78, 55, 0.5)',
                    backgroundColor: 'rgba(210, 78, 55, 1)',
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        min: Math.min(minY, Math.min(...salesPerMonth)),
                        max: Math.max(maxY, Math.max(...salesPerMonth))
                    }
                }
            }
        });
    }
});
