const searchInput = document.getElementById('searchInput');
const customResultsContainer = document.getElementById('customResultsContainer');
const jsonFiles = ['/json/app-info-compl.json', '/json/app-info-rese.json'];

//adding to the search bar input listener to hide the cardContainer when search is used
const cardContainerHider = document.getElementById('cardContainer');

//Add an event listener to the category-links
const categoryLink = document.querySelectorAll('.category-link');
categoryLink.forEach(link => {
    link.addEventListener('click', () => {
        //Hide the results container when a category-link is clicked
        customResultsContainer.style.display = 'none';
        //Reshow the cardContainer when a category-link is clicked
        cardContainerHider.style.display = 'flex';
        //clear whatever is typed in the search bar
        searchInput.value = '';
    });
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

        //shows the results container and display the search results
        customResultsContainer.style.display = 'flex';

        // hgide the cardContainer whenever search results are displayed
        cardContainerHider.style.display = 'none';
        
        //use a separate container with a class for the flexbox
        const resultsGrid = document.createElement('div');
        resultsGrid.classList.add('results-grid');

        filteredResults.forEach(item => {
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
                    resultsGrid.appendchild(cardElement.firstChild); //append the card content
        });
        
        //replace the content of customResultsContainer with the resultsGrid
        customResultsContainer.innerHTML = '';
        customResultsContainer.appendChild(resultsGrid);

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