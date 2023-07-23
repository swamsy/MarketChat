import { useState } from 'react';
import SearchBar from './components/SearchBar';
import Chatbot from './components/Chatbot';
import CompanyOverview from './components/CompanyOverview';
import Footer from './components/Footer';
import StockGraph from './components/StockGraph';


function App() {
  const [symbol, setSymbol] = useState('AAPL');
  const [companyName, setCompanyName] = useState('Apple Inc');

  const handleSymbolSelected = (selectedSymbol, companyName) => {
    setSymbol(selectedSymbol);
    setCompanyName(companyName);
  };

  return (  
    <>
      <div className="header">
        <h1>MarketChat</h1>
        <SearchBar onSymbolSelected={handleSymbolSelected}/>
      </div>
      <StockGraph symbol={symbol} companyName={companyName}/>
      <Chatbot symbol={symbol}/>
      <CompanyOverview symbol={symbol}/>
      <Footer/>
    </>
  );
}

export default App;