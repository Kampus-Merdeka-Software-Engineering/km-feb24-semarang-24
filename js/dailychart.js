// Data penjualan per hari
const salesData = {
  Mon: 0,
  Tue: 0,
  Wed: 0,
  Thu: 0,
  Fri: 0,
  Sat: 0,
  Sun: 0
};

// Placeholder untuk label hari
const daysOfWeek = Object.keys(salesData);

// Ambil data dari JSON atau sumber data lainnya
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    data.forEach(order => {
      const date = new Date(order.date);
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' }); // Menggunakan 'short' untuk tiga huruf
      salesData[dayOfWeek] += parseInt(order.quantity);
    });
    updateChart();
  })
  .catch(error => console.error('Error fetching data:', error));

// Fungsi untuk mengupdate chart
function updateChart() {
  const ctx = document.getElementById('dailyChart').getContext('2d');

  const salesChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: daysOfWeek,
      datasets: [{
        label: 'Total Orders per Hour',
        data: Object.values(salesData),
        backgroundColor: [
          'rgba(210, 78, 55, 1)',
          'rgba(168, 83, 68, 1)',
          'rgba(168, 83, 68, 1)',
          'rgba(184, 87, 67, 1)',
          'rgba(219, 104, 86, 1)',
          'rgba(229, 116, 104, 1)',
          'rgba(241, 140, 125, 1)'
        ],
        borderColor: [
          'rgba(210, 78, 55, 1)',
          'rgba(168, 83, 68, 1)',
          'rgba(168, 83, 68, 1)',
          'rgba(184, 87, 67, 1)',
          'rgba(219, 104, 86, 1)',
          'rgba(229, 116, 104, 1)',
          'rgba(241, 140, 125, 1)'
        ],
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
}
