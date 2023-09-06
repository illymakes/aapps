document.addEventListener("DOMContentLoaded", function () {
    const categoryLinks = document.querySelectorAll(".category-link");

    // const complButton = document.getElementByID("complButton1");
    //const reseButton = document.getElementByID("reseButton1");
    const cardContainer = document.getElementById("cardContainer");

    //complButton.addEventListener("click", () => updateCards("category1"));
    //reseButton.addEventListener("click", () => updateCards("category2"));

    categoryLinks.forEach(link => {
        link.addEventListener("click", () => updateCards(link.getAttribute("data-category")));
    });

    async function updateCards(category) {
        cardContainer.innerHTML = ""; //clears existing cards

        await fetchAndDisplayCards("json/app-info-compl.json", category);
        await fetchandDisplayCards("json/app-info-rese.json", category);
        //will add the rest later
    
    }

    async function fetchAndDisplayCards(jsonfile, category) {
        try {
            const response = await fetch(jsonfile);
            const data = await response.json();

            data.forEach(item => {
                //check if the cardCat field in the JSON contains the desired category
                if (item.cardCat === category) {
                    const card = document.createElement("div");
                    card.className = "col-md-4 mb-4";
                    card.innerHTML =
                    `
                    <div class="card card-hover">
                        <img src="${item.cardImgTop}" class="card-img-top"></img>
                        <h5 class="card-title">${item.cardTitle}</h5>
                        <div class="card-body">
                            <p class="card-text">${item.cardText}</p>
                            <a href="${item.cardLink}" class="btn btn-primary" align="center">${item.cardSubtitle}</a>
                        </div>
                    </div>
                    `;
                    cardContainer.appendChild(card); //append the card content
                }
            });
        } catch (error) {
            console.error("Error generating the cards yo: ", error);
        }
    }
});