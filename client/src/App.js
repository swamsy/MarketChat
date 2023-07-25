import { useState } from 'react';
import SearchBar from './components/SearchBar';
import Chatbot from './components/Chatbot';
import CompanyOverview from './components/CompanyOverview';
import Footer from './components/Footer';
import StockGraph from './components/StockGraph';

import styled from 'styled-components';
import GlobalStyles from './assets/GlobalStyles';
import { ThemeProvider } from 'styled-components';
import theme from './assets/Theme';
import Logo from './assets/Logo.svg';


const BodyWrapper = styled.div`
  padding: 50px 150px;
`;

const HeaderContainer = styled.div`
  display: flex;
  padding: 1.5rem;
  align-items: center;
  gap: 1.25rem;

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
          <img src={Logo} alt="MarketChat Logo"/>
          <h1 style={{flex: '1 0 0', margin: 0}} >MarketChat</h1>
          <SearchBar onSymbolSelected={handleSymbolSelected}/>
        </HeaderContainer>
        <BodyWrapper>
          <StockGraph symbol={symbol} companyName={companyName}/>
          <Chatbot symbol={symbol}/>
          <CompanyOverview symbol={symbol}/>
        </BodyWrapper>
        <Footer/>
      </ThemeProvider>
    </>
  );
}

export default App;