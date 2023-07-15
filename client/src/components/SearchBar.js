import { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash.debounce';

function SearchBar() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  
  const search = useCallback(debounce((query) => {
    fetch(`http://localhost:5000/alphavantage/search/${query}`)
      .then(response => response.json())
      .then(data => setResults(data.bestMatches.slice(0, 5)))
      .catch(error => console.error(error));
  }, 500), []);

  useEffect(() => {
    if (input.length >= 2) {
      search(input);
    }
  }, [input, search]);

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  return (
    <div>
      <input type="text" value={input} onChange={handleChange} />
      <pre>{JSON.stringify(results, null, 2)}</pre>
      {results.map(result => (
        <div key={result['1. symbol']}>
          <p>{result['2. name']} ({result['1. symbol']})</p>
        </div>
      ))}
    </div>
  );
}

export default SearchBar;
