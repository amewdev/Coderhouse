const deleteButton = document.getElementById("deleteButton");
const deleteSelect = document.getElementById("select");
const tbody = document.getElementById("tbody");

const socket = io();

deleteButton.onclick = () => {
    const id = Number(select.value);

    if (id > 0) {
        socket.emit("deleteProduct", { id });
    }
};

socket.on("listProducts", (data) => {
    const productsList = data.products ?? [];
    tbody.innerText = "";

    productsList.forEach((product) => {
        const tr = document.createElement("tr");

        Object.keys(product).forEach((key) => {
            if (key !== "status" && key !== "thumbnails") {
                const td = document.createElement("td");
                td.innerHTML = `${product[key]}`;
                tr.append(td);
            }
        });

        const td = document.createElement("td");
        td.innerHTML="x";

        const id = product.id;
        td.onclick = () => {
            socket.emit("deleteProduct", { id });
        };
        tr.append(td);
        tbody.append(tr);
    });

    deleteSelect.innerHTML = "";

    productsList.forEach((product) => {
        const option = document.createElement("option");
        option.value = product.id;
        option.textContent = product.id;
        deleteSelect.appendChild(option);
    });

});