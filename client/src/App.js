import { useState } from 'react';
import SearchBar from './components/SearchBar';
import StockGraph from './components/StockGraph';
import Chatbot from './components/Chatbot';
import CompanyOverview from './components/CompanyOverview';
import Footer from './components/Footer';

import styled from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import { ThemeProvider } from 'styled-components';
import theme from './styles/Theme';
import MarketChatLogo from './assets/MarketChatLogo.svg';

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
          <LogoTitle>
            <img src={MarketChatLogo} alt="MarketChat Logo" />
            <h1>MarketChat</h1>
          </LogoTitle>
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

const BodyWrapper = styled.div`
  padding: 4rem;
  overflow: auto;

  @media (max-width: 768px) {
    padding: 1.2rem;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 1.8rem;
  gap: 1rem;
  //border-bottom: 2px solid ${props => props.theme.colors[100]};
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.12);

  @media (max-width: 768px) {
    padding: 0.6rem 0.9rem;
  }
`;

const LogoTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  img {
    height: 45px;
  }

  @media (max-width: 768px) {
    h1 {
      display: none;
    }
  }

`;

const HeroContainer = styled.div`
  display: grid;
  grid-template-columns: 68% 1fr;
  gap: 2rem;
  
  @media (max-width: 1440px) {
    grid-template-columns: 58% 1fr;
  }

  @media (max-width: 768px) {
    grid-template-columns: 100%;
    grid-template-rows: auto auto;
  }
`;

export default App;