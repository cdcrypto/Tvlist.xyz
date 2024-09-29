// Define the URL for the CoinGecko categories endpoint
const apiUrl = 'https://api.coingecko.com/api/v3/coins/categories';

// Function to fetch categories from the CoinGecko API and export them as a .txt file
async function getCategoriesAndExport() {
    try {
        // Fetch data from the API
        const response = await fetch(apiUrl);

        // Check if the response is ok (status code 200)
        if (!response.ok) {
            throw new Error(`An error occurred: ${response.statusText}`);
        }

        // Parse the JSON response
        const data = await response.json();

        // Create a string with the category data
        let categoryText = 'Cryptocurrency Categories:\n\n';
        data.forEach(category => {
            categoryText += `Name: ${category.name}, ID: ${category.id}\n`;
        });

        // Create a Blob from the text
        const blob = new Blob([categoryText], { type: 'text/plain' });

        // Create a download link
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'cryptocurrency_categories.txt';

        // Append the link, trigger the download, and then remove the link
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        console.log('The categories have been exported to cryptocurrency_categories.txt');
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

// Call the function to get categories and export them when the page loads
getCategoriesAndExport();
