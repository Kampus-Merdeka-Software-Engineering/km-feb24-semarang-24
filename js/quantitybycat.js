// // Fungsi untuk memuat data dari file JSON
// async function loadData() {
//   const response = await fetch('/json/data.json');
//   const data = await response.json();
//   return data;
// }

// // Memproses data dan membuat pie chart
// async function createPieChart() {
//   const data = await loadData();

//   // Kategori yang diinginkan dan urutannya
//   const kategoriDiinginkan = ['Classic', 'Supreme', 'Veggie', 'Chicken'];

//   // Memproses data untuk mendapatkan total quantity per kategori
//   const jumlahKategori = data.reduce((acc, pesanan) => {
//     if (pesanan.category && pesanan.quantity && !isNaN(pesanan.quantity) && kategoriDiinginkan.includes(pesanan.category)) {
//       if (acc[pesanan.category]) {
//         acc[pesanan.category] += parseInt(pesanan.quantity, 10);
//       } else {
//         acc[pesanan.category] = parseInt(pesanan.quantity, 10);
//       }
//     }
//     return acc;
//   }, {});

//   // Mengubah quantity menjadi persentase
//   const totalQuantity = Object.values(jumlahKategori).reduce((acc, qty) => acc + qty, 0);
//   const persentaseKategori = Object.keys(jumlahKategori).reduce((acc, kategori) => {
//     acc[kategori] = Math.round((jumlahKategori[kategori] / totalQuantity) * 100); // Membulatkan persentase
//     return acc;
//   }, {});

//   // Menyiapkan data untuk chart sesuai urutan kategori yang diinginkan
//   const labels = kategoriDiinginkan.filter(kategori => jumlahKategori[kategori] !== undefined);
//   const dataPoin = labels.map(kategori => jumlahKategori[kategori]);
//   const dataPersentase = labels.map(kategori => persentaseKategori[kategori]);

//   // Membuat pie chart
//   const ctx = document.getElementById('quantitybycat').getContext('2d');
//   const pieChartSaya = new Chart(ctx, {
//     type: 'pie',
//     data: {
//       labels: labels,
//       datasets: [{
//         data: dataPoin,
//         backgroundColor: ['#D24E37', '#C2564F', '#A85344', '#F18C7D'],
//       }]
//     },
//     options: {
//       responsive: true,
//       plugins: {
//         legend: {
//           position: 'right', // Posisikan legend di kanan
//         },
//         tooltip: {
//           callbacks: {
//             label: function (context) {
//               const label = context.label || '';
//               const value = context.raw;
//               return `${label}: ${value}`;
//             }
//           }
//         },
//         datalabels: {
//           formatter: (value, ctx) => {
//             const index = ctx.dataIndex;
//             return `${dataPersentase[index]}%`;
//           },
//           color: '#fff',
//         }
//       }
//     },
//     plugins: [ChartDataLabels]
//   });
// }

// // Memanggil fungsi untuk membuat pie chart
// createPieChart();


document.addEventListener('DOMContentLoaded', () => { 
  // Fungsi untuk memuat data dari file JSON
  async function loadData() {
    const response = await fetch('/json/data.json');
    const data = await response.json();
    return data;
  }
  
  // Memproses data dan membuat pie chart
  async function createPieChart(selectedCategory) {
    const data = await loadData();
  
    // Mendapatkan kategori yang unik dari data
    const uniqueCategories = [...new Set(data.map(pesanan => pesanan.category))];
  
    // Memproses data untuk mendapatkan total quantity per kategori
    const jumlahKategori = data.reduce((acc, pesanan) => {
      if (pesanan.category && pesanan.quantity && !isNaN(pesanan.quantity) && (selectedCategory === 'all' || pesanan.category === selectedCategory)) {
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
      acc[kategori] = Math.round((jumlahKategori[kategori] / totalQuantity) * 100); // Membulatkan persentase
      return acc;
    }, {});
  
    // Menyiapkan data untuk chart sesuai urutan kategori yang diinginkan
    const labels = uniqueCategories.filter(kategori => jumlahKategori[kategori] !== undefined);
    const dataPoin = labels.map(kategori => jumlahKategori[kategori]);
    const dataPersentase = labels.map(kategori => persentaseKategori[kategori]);
  
    // Definisikan warna untuk setiap kategori
    const backgroundColors = labels.map((kategori, index) => {
      return (kategori === selectedCategory || selectedCategory === 'all') ? 
          // Warna yang menonjol untuk kategori yang dipilih
          ['#D24E37', '#C2564F', '#A85344', '#F18C7D'][index % 4] : 
          // Warna abu-abu untuk kategori yang tidak dipilih
          'rgba(128, 128, 128, 0.3)';
    });
  
    // Membuat pie chart
    const ctx = document.getElementById('quantitybycat').getContext('2d');
    if (window.pieChartSaya) {
      window.pieChartSaya.destroy(); // Menghapus chart yang lama jika ada
    }
    window.pieChartSaya = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: dataPoin,
          backgroundColor: backgroundColors,
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
  createPieChart('all'); // Memanggil fungsi untuk memuat pie chart dengan semua kategori
  
  // Menambahkan event listener untuk filter kategori
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.addEventListener('change', (event) => {
    createPieChart(event.target.value); // Memanggil fungsi untuk membuat pie chart dengan filter kategori yang dipilih
  });
});
