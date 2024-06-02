fetch('json/orderedpizza.json')
    .then(response => response.json())
    .then(data => {
        // Parse JSON data and sort by Total_Order
        const sortedData = data.sort((a, b) => parseInt(b.Total_Order.replace(/,/g, '')) - parseInt(a.Total_Order.replace(/,/g, '')));
        
        // Take top 5 pizzas with highest total orders
        const top5Data = sortedData.slice(0, 5);
        
        const pizzaNames = top5Data.map(item => item.Pizza_Name);
        const totalOrders = top5Data.map(item => parseInt(item.Total_Order.replace(/,/g, '')));

        // Create chart
        const ctx = document.getElementById('top5chart').getContext('2d');
        const pizzaChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: pizzaNames,
                datasets: [{
                    label: 'Total Orders',
                    data: totalOrders,
                    backgroundColor: 'rgba(210, 78, 55, 1)',
                    borderColor: 'rgba(210, 78, 55, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {legend: {display: false}},
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true
                    }
                }
            }
        });
    })
    .catch(error => console.error('Error loading the JSON data:', error));
