import { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import debounce from 'lodash.debounce';
import { searchSymbols } from '../services/api';

function SearchBar( { onSymbolSelected }) {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  
  // eslint-disable-next-line
  const search = useCallback(debounce(async (query) => {
    try {
      const matches = await searchSymbols(query)
      setResults(matches.slice(0, 4))
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

  const handleButtonClick = (symbol, companyName) => {
    onSymbolSelected(symbol, companyName);
    setInput('');
  };

  return (
    <div>
      <input type="text" value={input} onChange={handleChange} placeholder="Search by symbol or company name" />
      {results.map(result => (
      <div key={result['1. symbol']}>
        <button onClick={() => handleButtonClick(result['1. symbol'], result['2. name'])}>
          {result.logo ? (
            <img src={result.logo} alt={`${result['2. name']} logo`} />
          ) : (
            <PlaceholderLogo>
              {result['1. symbol']}
            </PlaceholderLogo>
          )}
          <p>{result['2. name']} ({result['1. symbol']})</p>
        </button>
      </div>
      ))}
    </div>
  );
}

const PlaceholderLogo = styled.div`
  background-color: #ddd;
  color: #333;
  text-align: center;
  line-height: 50px;
  width: 50px;
  height: 50px;
  display: inline-block;
`;

export default SearchBar;
