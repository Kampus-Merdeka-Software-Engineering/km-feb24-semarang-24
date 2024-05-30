// Fungsi untuk memuat data dari file JSON dan membuat chart
async function loadAndCreateChart() {
    try {
      const response = await fetch('data.JSON');
      const data = await response.json();
  
      // Menghitung total quantity untuk setiap pizza
      const pizzaQuantities = data.reduce((acc, order) => {
        if (acc[order.name]) {
          acc[order.name] += parseInt(order.quantity, 10);
        } else {
          acc[order.name] = parseInt(order.quantity, 10);
        }
        return acc;
      }, {});
  
      // Mengonversi objek menjadi array dan mengurutkannya berdasarkan quantity
      const sortedPizzas = Object.entries(pizzaQuantities)
        .map(([name, total_quantity]) => ({ name, total_quantity }))
        .sort((a, b) => b.total_quantity - a.total_quantity);
  
      // Mengambil top 5 pizzas
      const topPizzas = sortedPizzas.slice(0, 5);
  
      // Membuat chart
      const ctx = document.getElementById('top5Chart').getContext('2d');
      const topPizzasChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: topPizzas.map(pizza => pizza.name),
          datasets: [{
            label: 'Total Quantity',
            data: topPizzas.map(pizza => pizza.total_quantity),
            backgroundColor: 'rgba(210, 78, 55, 1)',
            borderColor: 'rgba(210, 78, 55, 1)',
            borderWidth: 1
          }]
        },
        options: {
          indexAxis : 'y',
          scales: {
            x: {
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
  