// Data penjualan per hari
const salesData = {
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
    Sunday: 0
  };

  // Placeholder untuk label hari
  const daysOfWeek = Object.keys(salesData);

  // Ambil data dari JSON atau sumber data lainnya
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      data.forEach(order => {
        const date = new Date(order.date);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
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
          label: 'Total Penjualan per Hari',
          data: Object.values(salesData),
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
            'rgba(231, 233, 237, 0.5)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(231, 233, 237, 1)'
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