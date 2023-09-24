document.addEventListener("DOMContentLoaded", function () {
    const categoryLinks = document.querySelectorAll(".category-link");

    const cardContainer = document.getElementById("cardContainer");

    categoryLinks.forEach(link => {
        link.addEventListener("click", () => updateCards(link.getAttribute("data-category")));
    });

    async function updateCards(category) {
        cardContainer.innerHTML = ""; //clears existing cards

        await fetchAndDisplayCards("../json/app-info-compl.json", category);
        await fetchAndDisplayCards("../json/app-info-rese.json", category);
        await fetchAndDisplayCards("../json/app-info-que.json", category);
        await fetchAndDisplayCards("../json/app-info-cnoo.json", category);
        await fetchAndDisplayCards("../json/app-info-other.json", category);
        await fetchAndDisplayCards("../json/app-info-cod.json", category);
        await fetchAndDisplayCards("../json/app-info-tice.json", category);
        await fetchAndDisplayCards("../json/app-info-tra.json", category);
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
                    // card.className = "col-sm-3 mb-4";
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