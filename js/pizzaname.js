async function loadPizzaNames(category) {
    try {
        const response = await fetch("../json/pizzaname.json");
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        const data = await response.json();
        const selectBox = document.getElementById("pizzaSelect");
        selectBox.innerHTML = '';
        
        const pizzasFilteredByCategory = data.pizzas.filter(pizza => category === 'All' || pizza.category === category);

        pizzasFilteredByCategory.forEach((pizza) => {
            const option = document.createElement("option");
            option.textContent = pizza.name;
            selectBox.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching the JSON:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    loadPizzaNames("All");

    document.getElementById('category').addEventListener('change', function () {
        const selectedCategory = this.value;
        loadPizzaNames(selectedCategory);
    });
});

