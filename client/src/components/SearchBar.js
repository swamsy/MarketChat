import { useState, useEffect } from 'react';
import { searchSymbols } from '../services/api';

import styled from 'styled-components';
import SearchIcon from '../assets/SearchIcon.svg';

function SearchBar({ onSymbolSelected }) {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [isInputFocused, setInputFocused] = useState(false);
  const [isMouseOverResults, setMouseOverResults] = useState(false);
  const [placeholderText, setPlaceholderText] = useState('');

  async function search(query) {
    try {
      const matches = await searchSymbols(query);
      setResults(matches);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (input) {
      search(input);
    } else {
      setResults([]);
    }
  }, [input]);

  // Adjust placeholder text based on screen size
  useEffect(() => {
    const adjustPlaceholder = () => {
        if (window.innerWidth <= 768) {
            setPlaceholderText('Search');
        } else {
            setPlaceholderText('Search by symbol or company name');
        }
    };
    adjustPlaceholder();
    window.addEventListener('resize', adjustPlaceholder);

    return () => {
        window.removeEventListener('resize', adjustPlaceholder);
    };
}, []);


  const handleChange = (event) => {
    setInput(event.target.value);
  };

  const handleButtonClick = (symbol, companyName) => {
    onSymbolSelected(symbol, companyName);
    setInput('');
  };

  return (
    <SearchBarContainer $isInputFocused={isInputFocused}> {/* transient prop */}
      <img src={SearchIcon} alt="Search Logo" height='15px' />
      <SearchInput
        type="text"
        value={input}
        onChange={handleChange}
        placeholder={placeholderText}
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
              key={result.symbol}
              onClick={() => handleButtonClick(result.symbol, result.name)}
            >
              {result.logo ? (
                <img src={result.logo} alt={`${result.name} logo`} />
              ) : (
                <PlaceholderLogo>
                  <PlaceholderLogoText>{result.symbol}</PlaceholderLogoText>
                </PlaceholderLogo>
              )}
              <ResultText>
                <p>{result.symbol}</p>
                <p>{result.name}</p>
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
  align-items: center;
  padding: 0.6rem;
  gap: 0.3rem;
  border-radius: 8px;
  border: ${props => props.$isInputFocused ? `1px solid ${props.theme.colors[400]}` : `1px solid ${props.theme.colors[100]}`};  
  max-width: 290px;
  min-width: 290px;

  @media (max-width: 768px) {
   max-width: 200px;
   min-width: 200px;
  }
`;

const SearchInput = styled.input`
  flex-grow: 1;
  border: none;
  outline: none;
  overflow: hidden;
  font-size: 14px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
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

  @media (max-width: 768px) {
    padding: 0.5rem;
    img {
      height: 45px;
      width: 45px;
    }
    
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

  @media (max-width: 768px) {
    min-width: 45px;
    min-height: 45px;
  }
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
