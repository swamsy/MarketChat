import { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { searchSymbols } from '../services/api';

import styled from 'styled-components';
import SearchIcon from '../assets/SearchIcon.svg';

function SearchBar( { onSymbolSelected }) {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [isInputFocused, setInputFocused] = useState(false);
  const [isMouseOverResults, setMouseOverResults] = useState(false);
  
  // eslint-disable-next-line
  const search = useCallback(debounce(async (query) => {
    try {
      const matches = await searchSymbols(query)
      setResults(matches.slice(0, 4))
    } catch (err) {
      console.error(err)
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
    <SearchBarContainer $isInputFocused={isInputFocused}> {/* transient prop */}
      <img src={SearchIcon} alt="Search Logo" height='15'/>
      <SearchInput 
        type="text" 
        value={input} 
        onChange={handleChange} 
        placeholder="Search by symbol or company name"
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
      />
      <ResultsContainer
        onMouseEnter={() => setMouseOverResults(true)}
        onMouseLeave={() => setMouseOverResults(false)}      
      >
        {isInputFocused || isMouseOverResults ? (
          results.map(result => (
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
          ))  
        ) : null}
      </ResultsContainer>
    </SearchBarContainer>
  );
}

const SearchBarContainer = styled.div`
  position: relative;
  display: flex;
  padding: 0.6rem;
  align-items: center;
  gap: 0.5rem;
  border-radius: 8px;
  border: ${props => props.$isInputFocused ? `1px solid ${props.theme.colors[400]}` : `1px solid ${props.theme.colors[100]}`};  
  min-width: 280px;

`;

const SearchInput = styled.input`
  flex-grow: 1;
  border: none;
  outline: none;
  overflow: hidden;
  font-size: 14px;
`;

const ResultsContainer = styled.div`
  position: absolute;
  top: 115%;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.colors[900]};
`;

const ResultItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.6rem;
  gap: 0.6rem;
  border-bottom: ${props => `1px solid ${props.theme.colors[200]}`};

  &:hover {
    background-color: ${props => props.theme.colors[700]};
    cursor: pointer;
  }

  img {
    height: 55px;
    width: 55px;
    object-fit: contain;
    border-radius: 6px;
  }
`;

const PlaceholderLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors[400]};
  min-width: 55px;
  min-height: 55px;
  border-radius: 6px;
`;

const PlaceholderLogoText = styled.div`
  color: ${props => props.theme.colors[100]};
  text-align: center;
  font-size: 10px;
`;

const ResultText = styled.div`
  min-width: 0;
  
  p {
    color: ${props => props.theme.colors[100]};
    font-size: 14px;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export default SearchBar;
