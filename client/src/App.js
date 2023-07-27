import { useState } from 'react';
import SearchBar from './components/SearchBar';
import StockGraph from './components/StockGraph';
import Chatbot from './components/Chatbot';
import CompanyOverview from './components/CompanyOverview';
import Footer from './components/Footer';

import styled from 'styled-components';
import GlobalStyles from './assets/GlobalStyles';
import { ThemeProvider } from 'styled-components';
import theme from './assets/Theme';
import MarketChatLogo from './assets/MarketChatLogo.svg';


const BodyWrapper = styled.div`
  padding: 4rem;
`;

const HeaderContainer = styled.div`
  display: flex;
  padding: 1.2rem 1.8rem;
  align-items: center;
  gap: 1.25rem;
  //border-bottom: 2px solid ${props => props.theme.colors[100]};
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.12);

`;

const HeroContainer = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 2.5rem;

`;


function App() {
  const [symbol, setSymbol] = useState('AAPL');
  const [companyName, setCompanyName] = useState('Apple Inc');

  const handleSymbolSelected = (selectedSymbol, companyName) => {
    setSymbol(selectedSymbol);
    setCompanyName(companyName);
  };

  return (  
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyles/>
        <HeaderContainer>
          <img src={MarketChatLogo} alt="MarketChat Logo" height='55px'/>
          <h1 style={{flexGrow: 1}}>MarketChat</h1>
          <SearchBar onSymbolSelected={handleSymbolSelected}/>
        </HeaderContainer>
        <BodyWrapper>
          <HeroContainer>
            <StockGraph symbol={symbol} companyName={companyName}/>
            <Chatbot symbol={symbol}/>
          </HeroContainer>
          <CompanyOverview symbol={symbol}/>
        </BodyWrapper>
        <Footer/>
      </ThemeProvider>
    </>
  );
}

export default App;