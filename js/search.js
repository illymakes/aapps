const searchInput = document.getElementById('searchInput');
const customResultsContainer = document.getElementById('customResultsContainer');
const jsonFiles = ['json/app-info-compl.json', 'json/app-info-rese.json'];

//trying link listener stuff to clear search results when link is clicked
const categoryLinks = document.querySelectorAll(".category-link");



searchInput.addEventListener('focus', () => {
    customResultsContainer.style.display='block';
});

searchInput.addEventListener('input', handleSearch);

async function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();

    if (searchTerm.trim() === '') {
        customResultsContainer.style.display = 'none';
        return;
    }

    try {
        const allResults = await Promise.all(jsonFiles.map(jsonFilePath => fetchAndFilterJSON(jsonFilePath, searchTerm)));
        const filteredResults = allResults.flat();

        customResultsContainer.style.display = 'block';
        displayResults(filteredResults);
        
    } catch (error) {
        console.error('Error fetching or parsing JSON: ', error)
    }
}

async function fetchAndFilterJSON(jsonFilePath, searchTerm) {
    try {
        const response = await fetch(jsonFilePath);
        const data = await response.json();

        const filteredResults = data.filter(item => {
            //Customize this condition to match data structure and search logic
            return (item.cardTitle.toLowerCase().includes(searchTerm) ||
                item.cardSubtitle.toLowerCase().includes(searchTerm) ||
                item.cardText.toLowerCase().includes(searchTerm));
        });
        return filteredResults;
    } catch (error) {
        console.error(`Error processing ${jsonFilePath}:`, error);
        return [];
    }
}

function displayResults(results) {
    if (results.length === 0) {
        customResultsContainer.innerHTML = `<p>No results found.</p>`;
        return;
    }
    customResultsContainer.innerHTML = ''; //clear previous results

    results.forEach(item => {
        const cardTemplate =
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
        const cardElement = document.createElement('div');
        cardElement.innerHTML = cardTemplate.trim(); //remove any extra whitespace
        customResultsContainer.appendChild(cardElement.firstchild); //append the card content
    });
};

categoryLinks.forEach(link => {
    link.addEventListener("click", () => updateCards(link.getAttribute("data-category")));
});

//link listener stuff to clear search results when link is clicked
async function updateCards(category) {
    customResultsContainer.innerHTML = ''; //clear search results

    searchInput.addEventListener('focus', () => {
        customResultsContainer.style.display='none';
    });
};