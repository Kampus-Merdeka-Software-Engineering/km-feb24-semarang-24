fetch('json/orderedpizza.json')
    .then(response => response.json())
    .then(data => {
        // Parse JSON data and sort by Total_Order
        const sortedData = data.sort((a, b) => parseInt(a.Total_Order.replace(/,/g, '')) - parseInt(b.Total_Order.replace(/,/g, '')));
        
        // Take bottom 5 pizzas with lowest total orders
        const bottom5Data = sortedData.slice(0, 5);
        
        const pizzaNames = bottom5Data.map(item => item.Pizza_Name);
        const totalOrders = bottom5Data.map(item => parseInt(item.Total_Order.replace(/,/g, '')));

        // Create chart
        const ctx = document.getElementById('bottom5chart').getContext('2d');
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
