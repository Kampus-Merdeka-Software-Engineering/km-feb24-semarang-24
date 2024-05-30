// Fungsi untuk mengambil data dari file JSON
function ambilDataJSON(callback) {
    fetch('data.json')
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => console.error('Error:', error));
}

// Fungsi untuk menghitung total quantity pizza
function hitungTotalQuantity(dataPizza) {
    const totalQuantity = {};

    dataPizza.forEach(pizza => {
        if (totalQuantity[pizza.name]) {
            totalQuantity[pizza.name] += parseInt(pizza.quantity);
        } else {
            totalQuantity[pizza.name] = parseInt(pizza.quantity);
        }
    });

    return totalQuantity;
}

// Fungsi untuk mendapatkan bottom 5 pizza dengan quantity terendah
function bottom5Pizza(dataPizza) {
    const totalQuantity = hitungTotalQuantity(dataPizza);
    const sortedPizzas = Object.entries(totalQuantity).sort((a, b) => a[1] - b[1]);

    return sortedPizzas.slice(0, 5).map(pizza => pizza[0]);
}

// Fungsi untuk membuat grafik batang
function buatGrafik(dataPizza) {
    const bottom5 = bottom5Pizza(dataPizza);
    const labels = bottom5;
    const data = labels.map(pizza => hitungTotalQuantity(dataPizza)[pizza]);

    const ctx = document.getElementById('bottom5Chart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Quantity',
                data: data,
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
}

// Panggil fungsi untuk mengambil data JSON dan membuat grafik
ambilDataJSON(dataPizza => {
    buatGrafik(dataPizza);
});
