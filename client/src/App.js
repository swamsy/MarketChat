import { useState, useEffect } from 'react';
import { getCompanyOverview } from './services/api';
import SearchBar from './components/SearchBar';
import Chatbot from './components/Chatbot';
import CompanyOverview from './components/CompanyOverview';
import Footer from './components/Footer';
import StockGraph from './components/StockGraph';


function App() {
  const [symbol, setSymbol] = useState('AAPL');
  const [companyName, setCompanyName] = useState('Apple Inc.');

  useEffect(() => {
    getCompanyOverview(symbol).then((data) => {
      setCompanyName(data.Name);
    });
  }, [symbol]);

  const handleSymbolSelected = (selectedSymbol) => {
    setSymbol(selectedSymbol);
  };

  return (  
    <>
      <SearchBar onSymbolSelected={handleSymbolSelected}/>
      <StockGraph symbol={symbol} name={companyName}/>
      <Chatbot symbol={symbol}/>
      <CompanyOverview symbol={symbol}/>
      <Footer/>
    </>
  );
}

export default App;