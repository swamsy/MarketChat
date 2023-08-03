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

const BodyWrapper = styled.div`
  padding: 4rem;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 1.8rem;
  //border-bottom: 2px solid ${props => props.theme.colors[100]};
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.12);
`;

const LogoTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

`;

const HeroContainer = styled.div`
  display: grid;
  grid-template-columns: 70% 30%;
  gap: 2rem;

  @media (max-width: 1250px) {
    grid-template-columns: 60% 40%;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
  }
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
          <LogoTitle>
            <img src={MarketChatLogo} alt="MarketChat Logo" height='55px'/>
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

export default App;