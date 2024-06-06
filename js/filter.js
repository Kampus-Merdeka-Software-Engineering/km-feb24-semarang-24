// =============== OPEN DROPDOWN FILTER ===============
const selectBtns = document.querySelectorAll(".select-btn");

selectBtns.forEach((selectBtn) => {
  selectBtn.addEventListener("click", () => {
    const listItems = selectBtn.nextElementSibling;
    const Open = selectBtn.classList.toggle("open-list");

    // Tutup dropdown lain yang terbuka
    selectBtns.forEach((btn) => {
      if (btn !== selectBtn) {
        btn.classList.remove("open-list");
        btn.nextElementSibling.style.maxHeight = "0";
        btn.nextElementSibling.style.opacity = "0";
      }
    });

    if (Open) {
      listItems.style.maxHeight = "285px";
      listItems.style.opacity = "1";
    } else {
      listItems.style.maxHeight = "0";
      listItems.style.opacity = "0";
    }
  }); 
});

fetch("json/data.json")
  .then((response) => response.json())
  .then((data) => {
    createFilter(data, "Name", ".pizza-type");
    createFilter(data, "Category", ".pizza-category");
    createFilter(data, "Size", ".pizza-size");
    bestSellingPizzaTable(data);

    // Membuat Button SELECT ALL di Pizza Type
    const selectAllButton = document.createElement("button");
    selectAllButton.textContent = "Select All";
    selectAllButton.className = "select-all";
    document.querySelector(".pizza-type").prepend(selectAllButton);

    // Menambahkan Event buat button Select ALL
    let selectAllType = false;
    selectAllButton.addEventListener("click", (e) => {
      e.preventDefault();
      selectAllType = !selectAllType;
      document.querySelectorAll(".pizza-type .item input[type=checkbox]").forEach((checkbox) => {
        checkbox.checked = selectAllType;
      });

      if (!selectAllType) {
        // Jika semua checkbox di-uncheck, tampilkan data kosong
        displayData([]);
      } else {
        const selectedFilters = getSelectedFilters();
        updateFilters(data, selectedFilters);
        const filteredData = data.filter(filterData(selectedFilters));
        displayData(filteredData);
      }
    });

    document.querySelectorAll(".pizza-type .item input[type=checkbox]").forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const selectedFilters = getSelectedFilters();
        updateFilters(data, selectedFilters);
        // const filteredData = data.filter(filterData(selectedFilters));
        // displayData(filteredData);
        // console.log(filteredData);
        const filteredData = data.filter(filterData(selectedFilters));
        if (Object.values(selectedFilters).every((filter) => filter.length === 0)) {
          displayData([]); // Tampilkan data kosong jika tidak ada yang di ceklis
        } else {
          displayData(filteredData);
        }
      });
    });

    document.querySelectorAll(".pizza-category .item input[type=checkbox], .pizza-size .item input[type=checkbox]").forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const selectedFilters = getSelectedFilters();
        const filteredData = data.filter(filterData(selectedFilters));
        if (Object.values(selectedFilters).every((filter) => filter.length === 0)) {
          displayData([]);
        } else {
          displayData(filteredData);
        }
      });
    });

    // // Menampilkan Data awal nya 0
    // displayData([]);

    // Menampilkan Data awal dengan semua checkbox terpilih
    const initialFilters = getSelectedFilters();
    updateFilters(data, initialFilters);
    const initialFilteredData = data.filter(filterData(initialFilters));
    displayData(initialFilteredData);
  });

function createFilter(data, attribute, containerSelector) {
  const container = document.querySelector(containerSelector);
  const items = [];

  data.forEach((item) => {
    const value = item[attribute];
    if (items.indexOf(value) === -1) {
      items.push(value);

      const listItem = document.createElement("li");
      listItem.className = "item";
      listItem.setAttribute("data-attribute", attribute);
      listItem.innerHTML = `
          <input type="checkbox" id="${value}" />
          <label for="${value}">${value}</label>
        `;
      container.appendChild(listItem);
    }
  });
}

function updateFilters(data, selectedFilters) {
  const pizzaTypes = selectedFilters["Name"];
  const categories = new Set();
  const sizes = new Set();

  data.forEach((item) => {
    if (!pizzaTypes.length || pizzaTypes.includes(item["Name"])) {
      categories.add(item["Category"]);
      sizes.add(item["Size"]);
    }
  });

  updateFilterOptions(".pizza-category", categories, selectedFilters["Category"]);
  updateFilterOptions(".pizza-size", sizes, selectedFilters["Size"]);
}

function updateFilterOptions(containerSelector, options, selectedOptions) {
  const container = document.querySelector(containerSelector);
  container.querySelectorAll(".item").forEach((item) => {
    const value = item.querySelector("input").id;
    const checkbox = item.querySelector("input");
    if (options.has(value)) {
      item.style.display = "";
      checkbox.checked = selectedOptions.includes(value);
    } else {
      item.style.display = "none";
      checkbox.checked = false;
    }
  });
}

function getSelectedFilters() {
  const selectedFilters = {
    Name: [],
    Category: [],
    Size: [],
  };

  document.querySelectorAll(".item input[type=checkbox]:checked").forEach((checkbox) => {
    const attribute = checkbox.parentElement.getAttribute("data-attribute");
    selectedFilters[attribute].push(checkbox.id);
  });
  // console.log(selectedFilters);
  return selectedFilters;
}

function filterData(selectedFilters) {
  return (item) => {
    return (
      (!selectedFilters["Name"].length || selectedFilters["Name"].includes(item["Name"])) &&
      (!selectedFilters["Category"].length || selectedFilters["Category"].includes(item["Category"])) &&
      (!selectedFilters["Size"].length || selectedFilters["Size"].includes(item["Size"]))
    );
  };
}

function displayData(data) {
  // Total Pizza = sum(Quantity)
  let pizzaSold = 0;
  if (data.length > 0) {
    pizzaSold = data.reduce((acc, item) => {
      return acc + parseInt(item["Quantity"]);
    }, 0);
  }

  // Total Sales = price * quantity
  let totalSales = 0;
  if (data.length > 0) {
    totalSales = data.reduce((acc, item) => {
      const price = parseFloat(item["Price"].replace("$", ""));
      return acc + price * item["Quantity"];
    }, 0);
    totalSales = Math.floor(totalSales);
  }  

  // Num of Order = count_distinct(Order_id)
  let numOrders = 0;
  if (data.length > 0) {
    const orderIds = data.map((item) => item["Order ID"]);
    const uniqueOrderIds = new Set(orderIds);
    numOrders = uniqueOrderIds.size;
  }

  // AVG Sales = price * quantity / count_distinct(Order_id)
  let averageSales = 0;
  if (numOrders > 0) {
    averageSales = (totalSales / numOrders).toFixed(2);
  }  
  
  document.querySelector(".total-sales h1").textContent = `$${totalSales.toLocaleString()}`;
  document.querySelector(".num-of-orders h1").textContent = `${numOrders.toLocaleString()}`;
  document.querySelector(".average-sales h1").textContent = `$${averageSales.toLocaleString()}`;
  document.querySelector(".pizza-sold h1").textContent = `${pizzaSold.toLocaleString()}`;

  // Update chart
  createSalesSizeChart(data);
  // createAveragePurchasedPriceChart(data);
  createDailyTrendChart(data);
  createTop5BestSellingPizzaTypeChart(data);
  createTop5LeastSellingPizzaTypeChart(data);
  createHourlyTrendChart(data);
  createMonthlyTrendChart(data);
  createQuantityCategoryChart(data);
}

// =====================================SIZE====================
let bestSellingPizzaSizeChart;
function createSalesSizeChart(data) {
  const ctx = document.getElementById("bestSellingPizzaSizeChart").getContext("2d");

  if (bestSellingPizzaSizeChart) {
    bestSellingPizzaSizeChart.destroy();
  }

  const pizzaSizes = [...new Set(data.map((item) => item.Size))];

  pizzaSizes.sort((a, b) => {
    const totalSalesA = data.filter((item) => item.Size === a).reduce((total, item) => total + parseInt(item.Quantity), 0);
    const totalSalesB = data.filter((item) => item.Size === b).reduce((total, item) => total + parseInt(item.Quantity), 0);
    return totalSalesB - totalSalesA; // Urutkan dari yang tertinggi ke terendah
  });
  const sizeSales = pizzaSizes.map((size) => {
    return data.filter((item) => item.Size === size).reduce((total, item) => total + parseInt(item.Quantity), 0);
  });

  const sizeColors = { 
    S: "#C2564F",
    M: "#F18C7D",
    L: "#A85344",
    XL: "D24E37",
    XXL: "#E4B400",
  };

  const colors = pizzaSizes.map((size) => sizeColors[size] || "#000");

  let tickColor = "#000";
  if (document.body.classList.contains("dark")) {
    tickColor = "#fff";
  }

  bestSellingPizzaSizeChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: pizzaSizes,
      datasets: [
        {
          label: "Total Sales",
          data: sizeSales,
          backgroundColor: colors,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        animateRotate: true,
        duration: 1500,
        easing: "easeInOutCirc",
      },
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: tickColor,
            usePointStyle: true,
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || "";
              const value = context.raw || 0;
              // const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
              // const percentage = ((value / total) * 100).toFixed(2);
              // return `${label}: $${value.toFixed(2)} (${percentage}%)`;
              // return `${label}: ${value.toFixed(2)}`;
              return `${label}: ${value}`;
            },
          },
        },
        datalabels: {
          display: true,
          // formatter: (value, context) => {
            formatter: (value) => {
            // const total = context.chart.data.datasets[0].data.reduce((sum, val) => sum + val, 0);
            // const percentage = ((value / total) * 100).toFixed(2);
            // return `${percentage}%`;
            return value;
          },
          color: "#fff",
          labels: {
            title: {
              font: {
                weight: "bold",
              },
            },
          },
        },
      },
    },
    plugins: [ChartDataLabels],
  });
  bestSellingPizzaSizeChart.update();
}

// ==============================CATEGORY=========================
let quantityCategory;
function createQuantityCategoryChart(data) {
  const ctx = document.getElementById("quantityCategory").getContext("2d");

  if (quantityCategory) {
    quantityCategory.destroy();
  }

  const pizzaSizes = [...new Set(data.map((item) => item.Category))];
  const sizeSales = pizzaSizes.map((size) => {
    return data.filter((item) => item.Category === size).reduce((total, item) => total + parseInt(item.Quantity), 0);
  });

  const categoryColors = {
    Classic: "#D24E37",
    Veggie: "#C2564F",
    Supreme: "#A85344",
    Chicken: "#F18C7D",
  };

  const colors = pizzaSizes.map((size) => categoryColors[size] || "#000");

  let tickColor = "#000";
  if (document.body.classList.contains("dark")) {
    tickColor = "#fff";
  }

  quantityCategory = new Chart(ctx, {
    type: "pie",
    data: {
      labels: pizzaSizes,
      datasets: [
        {
          label: "Total Sales",
          data: sizeSales,
          backgroundColor: colors,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        animateRotate: true,
        duration: 1500,
        easing: "easeInOutCirc",
      },
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: tickColor,
            usePointStyle: true,
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || "";
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value.toFixed()} (${percentage}%)`;
            },
          },
        },
        datalabels: {
          display: true,
          formatter: (value, context) => {
            const total = context.chart.data.datasets[0].data.reduce((sum, val) => sum + val, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${percentage}%`;
          },
          color: "#fff",
          labels: {
            title: {
              font: {
                weight: "bold",
              },
            },
          },
        },
      },
    },
    plugins: [ChartDataLabels],
  });
  quantityCategory.update();
}

// ===============================HOURLY=====================
let hourlyTrend;
function createHourlyTrendChart(data) {
  const ctx = document.getElementById("hourlyTrend").getContext("2d");

  if (hourlyTrend) {
    hourlyTrend.destroy();
  }

  // Process data to get daily sales trend
  const dailySales = data.reduce((acc, item) => {
    const hour = parseInt(item["Hour"], 10); // Convert hour to integer
    const price = parseFloat(item["Quantity"].replace("$", ""));
    if (!acc[hour]) {
      acc[hour] = 0;
    }
    acc[hour] += price;
    return acc;
  }, {});

  const labels = Object.keys(dailySales).sort((a, b) => a - b); // Sort keys numerically
  const sales = labels.map((hour) => dailySales[hour]);

  let tickColor = "#000";
  if (document.body.classList.contains("dark")) {
    tickColor = "#fff";
  }

  hourlyTrend = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Total Sales ($)",
          data: sales,
          backgroundColor: "transparent",
          borderColor: 'rgba(210, 78, 55, 0.5)',
          borderWidth: 2,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        tension: {
          duration: 2000, // Durasi animasi
          easing: "linear", 
          from: 1.2, 
          to: 0.5, 
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${Math.round(context.raw).toLocaleString()}`;
            },
          },
        },
        datalabels: {
          color: tickColor,
          anchor: "start",
          align: "start",
          formatter: function (value) {
            return `${Math.round(value).toLocaleString()}`;
          },
          font: {
            weight: "bold",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: tickColor
          },
          grid: {
            display: false,
          },
        },
        y: {
          ticks: {
            stepSize: 50000,
            beginAtZero: true,
            color: tickColor,
            callback: function (value) {
              return `${value.toLocaleString()}`;
            },
          },
          grid: {
            display: false,
          },
        },
      },
    },
    plugins: [ChartDataLabels],
  });
}


// =====================MONTHLY=============================
let monthlyTrend;
function createMonthlyTrendChart(data) {
  const ctx = document.getElementById("monthlyTrend").getContext("2d");

  if (monthlyTrend) {
    monthlyTrend.destroy();
  }

  // Define the order of the months with abbreviated names
  const monthOrder = [
    { full: "January", short: "Jan" },
    { full: "February", short: "Feb" },
    { full: "March", short: "Mar" },
    { full: "April", short: "Apr" },
    { full: "May", short: "May" },
    { full: "June", short: "Jun" },
    { full: "July", short: "Jul" },
    { full: "August", short: "Aug" },
    { full: "September", short: "Sep" },
    { full: "October", short: "Oct" },
    { full: "November", short: "Nov" },
    { full: "December", short: "Dec" },
  ];

  // Process data to get monthly sales trend
  const monthlySales = data.reduce((acc, item) => {
    const month = item["Month"];
    const quantity = parseFloat(item["Quantity"].replace("$", ""));
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += quantity;
    return acc;
  }, {});

  // Sort the labels according to the predefined order of months
  const labels = monthOrder
    .filter(monthObj => monthlySales.hasOwnProperty(monthObj.full))
    .map(monthObj => monthObj.short);
  const sales = monthOrder
    .filter(monthObj => monthlySales.hasOwnProperty(monthObj.full))
    .map(monthObj => monthlySales[monthObj.full]);

  let tickColor = "#000";
  if (document.body.classList.contains("dark")) {
    tickColor = "#fff";
  }

  monthlyTrend = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Total Sales ($)",
          data: sales,
          backgroundColor: "transparent",
          borderColor: 'rgba(210, 78, 55, 0.5)',
          borderWidth: 2,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        tension: {
          duration: 2000, // Durasi animasi
          easing: "linear", 
          from: 1.2, 
          to: 0.5, 
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${Math.round(context.raw).toLocaleString()}`;
            },
          },
        },
        datalabels: {
          color: tickColor,
          anchor: "start",
          align: "start",
          formatter: function (value) {
            return `${Math.round(value).toLocaleString()}`;
          },
          font: {
            weight: "bold",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: tickColor
          },
          grid: {
            display: false,
          },
        },
        y: {
          ticks: {
            stepSize: 500,
            beginAtZero: false,
            min: 3000,
            max: 4500,
            color: tickColor,
            callback: function (value) {
              return `${value.toLocaleString()}`;
            },
          },
          grid: {
            display: false,
          },
        },
      },
    },
    plugins: [ChartDataLabels],
  });
}

// ==============DAILY============================
let dailyPizzaSalesTrendChart;
function createDailyTrendChart(data) {
  const ctx = document.getElementById("dailyPizzaSalesTrendChart").getContext("2d");

  if (dailyPizzaSalesTrendChart) {
    dailyPizzaSalesTrendChart.destroy();
  }

  // Process data to get daily sales trend
  const dailySales = data.reduce((acc, item) => {
    const day = item["Day"];
    const price = parseInt(item["Quantity"].replace("$", ""));
    if (!acc[day]) {
      acc[day] = 0;
    }
    acc[day] += price;
    return acc;
  }, {});

  // Ensure labels start from Sunday
  const daysOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const labels = daysOrder.filter(day => dailySales.hasOwnProperty(day));
  const sales = labels.map((day) => dailySales[day]);

  let tickColor = "#000";
  if (document.body.classList.contains("dark")) {
    tickColor = "#fff";
  }
  
  dailyPizzaSalesTrendChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Total Sales ($)",
          data: sales,
          backgroundColor: 
          [
            'rgba(210, 78, 55, 1)',
            'rgba(168, 83, 68, 1)',
            'rgba(168, 83, 68, 1)',
            'rgba(184, 87, 67, 1)',
            'rgba(219, 104, 86, 1)',
            'rgba(229, 116, 104, 1)',
            'rgba(241, 140, 125, 1)'
          ],
          borderColor: 
          [
            'rgba(210, 78, 55, 1)',
            'rgba(168, 83, 68, 1)',
            'rgba(168, 83, 68, 1)',
            'rgba(184, 87, 67, 1)',
            'rgba(219, 104, 86, 1)',
            'rgba(229, 116, 104, 1)',
            'rgba(241, 140, 125, 1)'
          ],
          borderWidth: 1,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        tension: {
          duration: 2000, // Durasi animasi
          easing: "linear", 
          from: 1.2, 
          to: 0.5, 
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${Math.round(context.raw).toLocaleString()}`;
            },
          },
        },
        datalabels: {
          color: "#fff",
          anchor: "end",
          align: "start",
          formatter: function (value) {
            return `${Math.round(value).toLocaleString()}`;
          },
          font: {
            weight: "bold",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: tickColor
          },
          grid: {
            display: false,
          },
        },
        y: {
          ticks: {
            stepSize: 50000,
            beginAtZero: true,
            color: tickColor,
            callback: function (value) {
              return `${value.toLocaleString()}`;
            },
          },
          grid: {
            display: false,
          },
        },
      },
    },
    plugins: [ChartDataLabels],
  });
}


// TOP 5
let top5BestSellingPizzaTypeChart;
function createTop5BestSellingPizzaTypeChart(data) {
  const ctx = document.getElementById("top5BestSellingPizzaTypeChart").getContext("2d");

  if (top5BestSellingPizzaTypeChart) {
    top5BestSellingPizzaTypeChart.destroy();
  }

  const pizzaTypes = [...new Set(data.map((item) => item["Pizza ID"]))];
  const typeSales = pizzaTypes.map((type) => {
    return data.filter((item) => item["Pizza ID"] === type).reduce((total, item) => total + parseInt(item["Quantity"]), 0);
  });

  const top5Data = pizzaTypes
    .map((type, index) => ({ type, sales: typeSales[index] }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  const top5Labels = top5Data.map((item) => item.type);
  const top5Sales = top5Data.map((item) => item.sales);

  let tickColor = "#000";
  if (document.body.classList.contains("dark")) {
    tickColor = "#fff";
  }

  top5BestSellingPizzaTypeChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: top5Labels,
      datasets: [
        {
          label: "Total Sales",
          data: top5Sales,
          backgroundColor: 
          [
                      'rgba(210, 78, 55, 1)',
                      'rgba(168, 83, 68, 1)',
                      'rgba(168, 83, 68, 1)',
                      'rgba(184, 87, 67, 1)',
                      'rgba(219, 104, 86, 1)',
                      'rgba(229, 116, 104, 1)',
                      'rgba(241, 140, 125, 1)'
                    ],
          borderRadius: 2,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000,
        easing: "easeInOutQuad",
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            color: tickColor,
          },
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 10000,
            color: tickColor,
            callback: function (value) {
              return value.toLocaleString();
            },
          },
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = Math.round(context.raw || 0).toLocaleString();
              return `${value}`;
            },
          },
        },
        datalabels: {
          anchor: "center",
          align: "center",
          formatter: (value) => `${Math.round(value).toLocaleString()}`,
          color: "#fff",
          font: {
            weight: "bold",
          },
        },
      },
    },
    plugins: [ChartDataLabels],
  });
}

//BOTTOM
let top5LeastSellingPizzaTypeChart;
function createTop5LeastSellingPizzaTypeChart(data) {
  const ctx = document.getElementById("top5LeastSellingPizzaTypeChart").getContext("2d");

  if (top5LeastSellingPizzaTypeChart) {
    top5LeastSellingPizzaTypeChart.destroy();
  }

  const pizzaTypes = [...new Set(data.map((item) => item["Pizza ID"]))];
  const typeSales = pizzaTypes.map((type) => {
    return data.filter((item) => item["Pizza ID"] === type).reduce((total, item) => total + parseInt(item["Quantity"]), 0);
  });

  const top5Data = pizzaTypes
    .map((type, index) => ({ type, sales: typeSales[index] }))
    .sort((a, b) => a.sales - b.sales)
    .slice(0, 5);

  const top5Labels = top5Data.map((item) => item.type);
  const top5Sales = top5Data.map((item) => item.sales);

  let tickColor = "#000";
  if (document.body.classList.contains("dark")) {
    tickColor = "#fff";
  }

  top5LeastSellingPizzaTypeChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: top5Labels,
      datasets: [
        {
          label: "Total Sales",
          data: top5Sales,
          backgroundColor: [
            'rgba(210, 78, 55, 1)',
            'rgba(168, 83, 68, 1)',
            'rgba(168, 83, 68, 1)',
            'rgba(184, 87, 67, 1)',
            'rgba(219, 104, 86, 1)',
            'rgba(229, 116, 104, 1)',
            'rgba(241, 140, 125, 1)'
          ],
          borderRadius: 2,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000,
        easing: "easeInOutQuad",
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            color: tickColor,
          },
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            color: tickColor,
          },
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = Math.round(context.raw || 0).toLocaleString();
              return `${value}`;
            },
          },
        },
        datalabels: {
          anchor: "center",
          align: "center",
          formatter: (value) => `${Math.round(value).toLocaleString()}`,
          color: "#fff",
          font: {
            weight: "bold",
          },
        },
      },
    },
    plugins: [ChartDataLabels],
  });
}

function bestSellingPizzaTable(data) {
  const pizzaSales = data.reduce((acc, item) => {
    const name = item["Name"];
    const price = parseFloat(item["Price"].replace("$", ""));
    const totalSales = price * item["Quantity"];

    if (acc[name]) {
      acc[name] += totalSales;
    } else {
      acc[name] = totalSales;
    }
    return acc;
  }, {});

  const sortedPizzaSales = Object.entries(pizzaSales).sort((a, b) => b[1] - a[1]);

  const tableData = sortedPizzaSales.map((pizza, index) => [index + 1, pizza[0], `$ ${Math.round(pizza[1]).toLocaleString()}`]);

  $(document).ready(function () {
    $(".content-table").DataTable({
      data: tableData,
      destroy: true,
      responsive: true,
    });
    $(".content-table tbody").on("click", "td", function () {
      $(".content-table tbody td").removeClass("active");
      $(this).addClass("active");
    });
  });
}

