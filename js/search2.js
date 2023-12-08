const searchInput = document.getElementById('searchInput');
const customResultsContainer = document.getElementById('customResultsContainer');
const jsonFiles = [
    '/json/app-info-compl.json',
    '/json/app-info-rese.json',
    '/json/app-info-que.json',
    '/json/app-info-cnoo.json',
    '/json/app-info-other.json',
    '/json/app-info-cod.json',
    '/json/app-info-tice.json',
    '/json/app-info-tra.json'
];

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
        customResultsContainer.innerHTML = '';
        return;
    }

    try {
        const allResults = await Promise.all(jsonFiles.map(jsonFilePath => fetchAndFilterJSON(jsonFilePath, searchTerm)));
        const filteredResults = allResults.flat();

        displayResults(filteredResults);
        console.log('filtered results: ', filteredResults);

    } catch (error) {
        console.error('Error fetching or parsing JSON: ', error);
    }
}

async function fetchAndFilterJSON(jsonFilePath, searchTerm) {
    try {
        const response = await fetch(jsonFilePath);
        const data = await response.json();

        //shows the results container and display the search results
        customResultsContainer.style.display = 'flex';

        // hgide the cardContainer whenever search results are displayed
        cardContainerHider.style.display = 'none';

        //use a separate container with a class for the flexbox
        const resultsGrid = document.createElement('div');
        resultsGrid.classList.add('results-grid');

        const filteredResults = (data || []).filter(item => {
            // Check if the expected properties exist on the item object
            if (item && typeof item === 'object') {
                const title = (item.cardTitle || '').toLowerCase();
                const subtitle = (item.cardSubtitle || '').toLowerCase();
                const text = (item.cardText || '').toLowerCase();
                const category = (item.cardCat2 || '').toLowerCase();

                return (
                    title.includes(searchTerm) ||
                    subtitle.includes(searchTerm) ||
                    text.includes(searchTerm) ||
                    category.includes(searchTerm)
                );
            }

            return false; // Exclude items that don't have the expected structure
        });

        return filteredResults;

    } catch (error) {
        console.error(`Error processing ${jsonFilePath}:`, error);
        return [];
    }
}

function displayResults(results) {
    const resultsGrid = document.createElement('div');
    resultsGrid.classList.add('results-grid');

    results.forEach(item => {
        const cardTemplate = `
        <div class="card card-hover">
            <img src="${item.cardImgTop}" class="card-img-top"></img>
            <h5 class="card-title">${item.cardTitle}</h5>
            <div class="card-body">
                <p class="card-text">${item.cardText}</p>
                <a href="${item.cardLink}" class="btn btn-primary" align="center">View</a>
            </div>
        </div>
        `;

        const cardElement = document.createElement('div');
        cardElement.innerHTML = cardTemplate.trim();
        resultsGrid.appendChild(cardElement.firstChild);
    });

    customResultsContainer.innerHTML = '';
    customResultsContainer.appendChild(resultsGrid);
}