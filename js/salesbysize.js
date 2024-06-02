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
          new Chart(ctx, {
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
                  plugins: {legend: {display: false}},
                  scales: {
                      y: {
                          beginAtZero: true
                      }
                  }
              }
          });
      })
      .catch(error => console.error('Error fetching the data:', error));
});
