import React, { useState } from 'react';

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  // MeiliSearch URL with environment variable fallback
  const meiliSearchUrl = process.env.NEXT_PUBLIC_SEARCH_ENDPOINT || 'http://localhost:7700';
  const searchApiKey = process.env.NEXT_PUBLIC_SEARCH_API_KEY; // Ensure this is set in your environment

  const handleSearch = async () => {
    try {
      const response = await fetch(`${meiliSearchUrl}/indexes/products/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${searchApiKey}` // Use the search-only API key
        },
        body: JSON.stringify({ q: query })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }

      const data = await response.json();
      setResults(data.hits);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input
        type='text'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='Search for products...'
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {results.map((result) => (
          <li key={result.id}>{result.title}</li> // Adjust based on your index structure
        ))}
      </ul>
    </div>
  );
};

export default SearchComponent;