// Fungsi untuk memuat data dari file JSON dan membuat chart
async function loadAndCreateChart() {
    try {
      const response = await fetch('data.JSON');
      const data = await response.json();
  
      // Menghitung total quantity untuk setiap ukuran pizza
      const sizeQuantities = data.reduce((acc, order) => {
        if (acc[order.size]) {
          acc[order.size] += parseInt(order.quantity, 10);
        } else {
          acc[order.size] = parseInt(order.quantity, 10);
        }
        return acc;
      }, {});
  
      // Mengonversi objek menjadi array
      const sizeData = Object.entries(sizeQuantities)
        .map(([size, total_quantity]) => ({ size, total_quantity }));
  
      // Membuat chart
      const ctx = document.getElementById('salesbySize').getContext('2d');
      const sizeChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: sizeData.map(data => data.size),
          datasets: [{
            label: 'Total Quantity',
            data: sizeData.map(data => data.total_quantity),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
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
    } catch (error) {
      console.error('Error loading or processing data:', error);
    }
  }
  
  // Panggil fungsi untuk memuat data dan membuat chart
  loadAndCreateChart();
  