// document.addEventListener('DOMContentLoaded', () => {
//   // Fetch data from JSON file
//   fetch('json/data.json')
//       .then(response => response.json())
//       .then(data => {
//           // Menghitung total order berdasarkan ukuran
//           const ordersBySize = data.reduce((acc, order) => {
//               const size = order.size;
//               const quantity = parseInt(order.quantity); // Mengonversi quantity ke tipe data integer
//               if (!acc[size]) {
//                   acc[size] = 0;
//               }
//               acc[size] += quantity;
//               return acc;
//           }, {});

//           // Mengurutkan berdasarkan jumlah order terbanyak
//           const sortedSizes = Object.keys(ordersBySize).sort((a, b) => ordersBySize[b] - ordersBySize[a]);

//           // Membuat data terurut
//           const sortedOrdersData = sortedSizes.map(size => ordersBySize[size]);

//           // Membuat label terurut
//           const sortedLabels = sortedSizes;

//           // Membuat bar chart menggunakan Chart.js
//           const ctx = document.getElementById('salesbysize').getContext('2d');
//           new Chart(ctx, {
//               type: 'bar',
//               data: {
//                   labels: sortedLabels,
//                   datasets: [{
//                       label: 'Total Orders',
//                       data: sortedOrdersData,
//                       backgroundColor: 'rgba(210, 78, 55, 1)',
//                       borderColor: 'rgba(210, 78, 55, 1)',
//                       borderWidth: 1
//                   }]
//               },
//               options: {
//                   plugins: {legend: {display: false}},
//                   scales: {
//                       y: {
//                           beginAtZero: true
//                       }
//                   }
//               }
//           });
//       })
//       .catch(error => console.error('Error fetching the data:', error));
// });


document.addEventListener('DOMContentLoaded', () => {
    // Fetch data from JSON file
    fetch('json/data.json')
        .then(response => response.json())
        .then(data => {
            // Menghitung total order berdasarkan ukuran
            const ordersBySize = data.reduce((acc, order) => {
                const size = order.size;
                const quantity = parseInt(order.quantity); // Mengonversi quantity ke tipe data integer
                if (!acc[size]) {
                    acc[size] = 0;
                }
                acc[size] += quantity;
                return acc;
            }, {});

            // Mengurutkan berdasarkan jumlah order terbanyak
            const sortedSizes = Object.keys(ordersBySize).sort((a, b) => ordersBySize[b] - ordersBySize[a]);

            // Membuat data terurut
            const sortedOrdersData = sortedSizes.map(size => ordersBySize[size]);

            // Membuat label terurut
            const sortedLabels = sortedSizes;

            // Membuat bar chart menggunakan Chart.js
            const ctx = document.getElementById('salesbysize').getContext('2d');
            const chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: sortedLabels,
                    datasets: [{
                        label: 'Total Orders',
                        data: sortedOrdersData,
                        backgroundColor: 'rgba(210, 78, 55, 1)',
                        borderColor: 'rgba(210, 78, 55, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    plugins: { legend: { display: false } },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            document.getElementById('pizzaSizeSelect').addEventListener('change', function () {
                const selectedSize = this.value;

                if (selectedSize === 'all') {
                    // Jika ukuran yang dipilih adalah "All", tampilkan semua data
                    chart.data.labels = sortedLabels;
                    chart.data.datasets[0].data = sortedOrdersData;
                } else {
                    // Filter data berdasarkan ukuran yang dipilih
                    const filteredData = data.filter(order => order.size === selectedSize);

                    // Hitung total order berdasarkan ukuran yang dipilih
                    const filteredOrdersBySize = filteredData.reduce((acc, order) => {
                        const size = order.size;
                        const quantity = parseInt(order.quantity); // Mengonversi quantity ke tipe data integer
                        if (!acc[size]) {
                            acc[size] = 0;
                        }
                        acc[size] += quantity;
                        return acc;
                    }, {});

                    // Urutkan berdasarkan jumlah order terbanyak
                    const filteredSortedSizes = Object.keys(filteredOrdersBySize).sort((a, b) => filteredOrdersBySize[b] - filteredOrdersBySize[a]);

                    // Buat data terurut
                    const filteredSortedOrdersData = filteredSortedSizes.map(size => filteredOrdersBySize[size]);

                    // Update chart dengan data yang difilter
                    chart.data.labels = filteredSortedSizes;
                    chart.data.datasets[0].data = filteredSortedOrdersData;
                }

                // Perbarui chart
                chart.update();
            });
        })
        .catch(error => console.error('Error fetching the data:', error));
});
