import { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { searchSymbols } from '../services/api';

function SearchBar( { onSymbolSelected }) {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  
  const search = useCallback(debounce(async (query) => {
    try {
      const matches = await searchSymbols(query)
      setResults(matches.slice(0, 5))
    } catch (error) {
      console.error(error)
    }
  }, 300), []);

  useEffect(() => {
    if (input) {  
      search(input);
    } else {
      setResults([]);
    }
  }, [input, search]);

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  const handleButtonClick = (symbol) => {
    onSymbolSelected(symbol);
    setInput('');
  };

  return (
    <div>
      <input type="text" value={input} onChange={handleChange} placeholder="Search by symbol or company name" />
      {results.map(result => (
        <div key={result['1. symbol']}>
          <button onClick={() => handleButtonClick(result['1. symbol'])}>
            <p>{result['2. name']} ({result['1. symbol']})</p>
          </button>
        </div>
      ))}
    </div>
  );
}

export default SearchBar;
