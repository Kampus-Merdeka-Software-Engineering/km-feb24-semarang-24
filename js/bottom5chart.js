// fetch('json/orderedpizza.json')
//     .then(response => response.json())
//     .then(data => {
//         // Parse JSON data and sort by Total_Order
//         const sortedData = data.sort((a, b) => parseInt(a.Total_Order.replace(/,/g, '')) - parseInt(b.Total_Order.replace(/,/g, '')));
        
//         // Take bottom 5 pizzas with lowest total orders
//         const bottom5Data = sortedData.slice(0, 5);
        
//         const pizzaNames = bottom5Data.map(item => item.Pizza_Name);
//         const totalOrders = bottom5Data.map(item => parseInt(item.Total_Order.replace(/,/g, '')));

//         // Create chart
//         const ctx = document.getElementById('bottom5chart').getContext('2d');
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
    async function createBottom5Chart(selectedPizzaName) {
        const data = await loadData();

        // Filter data berdasarkan pizza name yang dipilih
        let filteredData;
        if (selectedPizzaName === 'all') {
            filteredData = data; // Menampilkan semua data jika 'all' dipilih
        } else {
            filteredData = data.filter(pizza => pizza.Pizza_Name === selectedPizzaName);
        }

        // Sort data berdasarkan total order
        const sortedData = filteredData.sort((a, b) => parseInt(a.Total_Order.replace(/,/g, '')) - parseInt(b.Total_Order.replace(/,/g, '')));

        // Ambil top 5 pizza dengan total order tertinggi
        const bottom5Data = sortedData.slice(0, 5);

        const pizzaNames = bottom5Data.map(item => item.Pizza_Name);
        const totalOrders = bottom5Data.map(item => parseInt(item.Total_Order.replace(/,/g, '')));

        // Buat grafik
        const ctx = document.getElementById('bottom5chart').getContext('2d');
        if (window.bottom5Chart) {
            window.bottom5Chart.destroy(); // Hapus grafik sebelumnya jika ada
        }
        window.bottom5Chart = new Chart(ctx, {
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
    createBottom5Chart('all');

    // Menambahkan event listener untuk filter pizza name
    const pizzaSelect = document.getElementById('pizzaSelect');
    pizzaSelect.addEventListener('change', (event) => {
        createBottom5Chart(event.target.value); // Memanggil fungsi untuk membuat grafik dengan filter pizza name yang dipilih
    });
});
