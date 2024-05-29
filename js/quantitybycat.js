// Fungsi untuk memuat data dari file JSON
async function loadData() {
  const response = await fetch('data.json');
  const data = await response.json();
  return data;
}

// Memproses data dan membuat pie chart
async function createPieChart() {
  const data = await loadData();

  // Kategori yang diinginkan dan urutannya
  const kategoriDiinginkan = ['Classic', 'Supreme', 'Veggie', 'Chicken'];

  // Memproses data untuk mendapatkan total quantity per kategori
  const jumlahKategori = data.reduce((acc, pesanan) => {
    if (pesanan.category && pesanan.quantity && !isNaN(pesanan.quantity) && kategoriDiinginkan.includes(pesanan.category)) {
      if (acc[pesanan.category]) {
        acc[pesanan.category] += parseInt(pesanan.quantity, 10);
      } else {
        acc[pesanan.category] = parseInt(pesanan.quantity, 10);
      }
    }
    return acc;
  }, {});

  // Mengubah quantity menjadi persentase
  const totalQuantity = Object.values(jumlahKategori).reduce((acc, qty) => acc + qty, 0);
  const persentaseKategori = Object.keys(jumlahKategori).reduce((acc, kategori) => {
    acc[kategori] = ((jumlahKategori[kategori] / totalQuantity) * 100).toFixed(1);
    return acc;
  }, {});

  // Menyiapkan data untuk chart sesuai urutan kategori yang diinginkan
  const labels = kategoriDiinginkan.filter(kategori => jumlahKategori[kategori] !== undefined);
  const dataPoin = labels.map(kategori => jumlahKategori[kategori]);
  const dataPersentase = labels.map(kategori => persentaseKategori[kategori]);

  // Membuat pie chart
  const ctx = document.getElementById('pieChartSaya').getContext('2d');
  const pieChartSaya = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: dataPoin,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FFA500'],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'right', // Posisikan legend di kanan
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || '';
              const value = context.raw;
              return `${label}: ${value}`;
            }
          }
        },
        datalabels: {
          formatter: (value, ctx) => {
            const index = ctx.dataIndex;
            return `${dataPersentase[index]}%`;
          },
          color: '#fff',
        }
      }
    },
    plugins: [ChartDataLabels]
  });
}

// Memanggil fungsi untuk membuat pie chart
createPieChart();
