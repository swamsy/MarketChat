import { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { searchSymbols } from '../services/api';

import styled from 'styled-components';
import SearchLogo from '../assets/SearchLogo.svg';

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
    <SearchBarContainer>
      <img src={SearchLogo} alt="Search Logo" />
      <SearchInput 
        type="text" 
        value={input} 
        onChange={handleChange} 
        placeholder="Search by symbol or company name" style={{flex: '1 0 0'}}
      />
      <ResultsContainer>
        {results.map(result => (
          <ResultItem 
            key={result['1. symbol']}
            onClick={() => handleButtonClick(result['1. symbol'], result['2. name'])}
          >
              {result.logo ? (
                <img src={result.logo} alt={`${result['2. name']} logo`}/>
              ) : (
                <PlaceholderLogo>
                  <PlaceholderLogoText>{result['1. symbol']}</PlaceholderLogoText>
                </PlaceholderLogo>
              )}
              <ResultText>
                <p>{result['1. symbol']}</p>
                <p>{result['2. name']}</p>
              </ResultText>
          </ResultItem>
        ))}
      </ResultsContainer>
    </SearchBarContainer>
  );
}

const SearchBarContainer = styled.div`
  position: relative;
  display: flex;
  padding: 1rem;
  align-items: center;
  gap: 1.1rem;
  border-radius: 8px;
  border: 2px solid #E3E9ED;
`;

const SearchInput = styled.input`
  flex: 1 0 0;
  border: none;
  outline: none;
`;

const ResultsContainer = styled.div`
  position: absolute;
  top: 115%;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.colors[600]};
`;

const ResultItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.6rem;
  border-bottom: ${props => `1px solid ${props.theme.colors[200]}`};

  img {
    min-width: 55px;
    min-height: 55px;
    object-fit: contain;
    border-radius: 6px;
    margin-right: 0.6rem;

  }
`;

const PlaceholderLogo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: pink;
  margin-right: 0.6rem;
  min-width: 55px;
  min-height: 55px;
  border-radius: 6px;
`;

const PlaceholderLogoText = styled.div`
  color: ${props => props.theme.colors[950]};
  text-align: center;
  font-size: 10px;

`;

const ResultText = styled.div`
  color: ${props => props.theme.colors[950]};
  min-width: 0;
  
  p {
    font-size: 14px;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export default SearchBar;
