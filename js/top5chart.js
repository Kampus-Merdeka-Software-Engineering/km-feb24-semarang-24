// fetch('json/orderedpizza.json')
//     .then(response => response.json())
//     .then(data => {
//         // Parse JSON data and sort by Total_Order
//         const sortedData = data.sort((a, b) => parseInt(b.Total_Order.replace(/,/g, '')) - parseInt(a.Total_Order.replace(/,/g, '')));
        
//         // Take top 5 pizzas with highest total orders
//         const top5Data = sortedData.slice(0, 5);
        
//         const pizzaNames = top5Data.map(item => item.Pizza_Name);
//         const totalOrders = top5Data.map(item => parseInt(item.Total_Order.replace(/,/g, '')));

//         // Create chart
//         const ctx = document.getElementById('top5chart').getContext('2d');
//         const pizzaChart = new Chart(ctx, {
//             type: 'bar',
//             data: {
//                 labels: pizzaNames,
//                 datasets: [{
//                     label: 'Total Orders',
//                     data: totalOrders,
//                     backgroundColor: 'rgba(210, 78, 55, 1)',
//                     borderColor: 'rgba(210, 78, 55, 1)',
//                     borderWidth: 1
//                 }]
//             },
//             options: {
//                 plugins: {legend: {display: false}},
//                 indexAxis: 'y',
//                 scales: {
//                     x: {
//                         beginAtZero: true
//                     }
//                 }
//             }
//         });
//     })
//     .catch(error => console.error('Error loading the JSON data:', error));


document.addEventListener('DOMContentLoaded', () => {
    // Fungsi untuk memuat data dari file JSON
    async function loadData() {
        const response = await fetch('json/orderedpizza.json');
        const data = await response.json();
        return data;
    }

    // Fungsi untuk membuat pie chart
    async function createTop5Chart(selectedPizzaName) {
        const data = await loadData();

        // Filter data berdasarkan pizza name yang dipilih
        let filteredData;
        if (selectedPizzaName === 'all') {
            filteredData = data; // Menampilkan semua data jika 'all' dipilih
        } else {
            filteredData = data.filter(pizza => pizza.Pizza_Name === selectedPizzaName);
        }

        // Sort data berdasarkan total order
        const sortedData = filteredData.sort((a, b) => parseInt(b.Total_Order.replace(/,/g, '')) - parseInt(a.Total_Order.replace(/,/g, '')));

        // Ambil top 5 pizza dengan total order tertinggi
        const top5Data = sortedData.slice(0, 5);

        const pizzaNames = top5Data.map(item => item.Pizza_Name);
        const totalOrders = top5Data.map(item => parseInt(item.Total_Order.replace(/,/g, '')));

        // Buat grafik
        const ctx = document.getElementById('top5chart').getContext('2d');
        if (window.top5Chart) {
            window.top5Chart.destroy(); // Hapus grafik sebelumnya jika ada
        }
        window.top5Chart = new Chart(ctx, {
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
                plugins: { legend: { display: false } },
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Memanggil fungsi untuk membuat grafik dengan filter pizza name 'All' secara default
    createTop5Chart('all');

    // Menambahkan event listener untuk filter pizza name
    const pizzaSelect = document.getElementById('pizzaSelect');
    pizzaSelect.addEventListener('change', (event) => {
        createTop5Chart(event.target.value); // Memanggil fungsi untuk membuat grafik dengan filter pizza name yang dipilih
    });
});
