import { useState } from 'react';
import SearchBar from './components/SearchBar';
import Chatbot from './components/Chatbot';
import CompanyOverview from './components/CompanyOverview';
import Footer from './components/Footer';
import StockGraph from './components/StockGraph';


function App() {
  const [symbol, setSymbol] = useState('AAPL');

  const handleSymbolSelected = (selectedSymbol) => {
    setSymbol(selectedSymbol);
  };

  return (  
    <>
      <SearchBar onSymbolSelected={handleSymbolSelected}/>
      <StockGraph symbol={symbol}/>
      <Chatbot symbol={symbol}/>
      <CompanyOverview symbol={symbol}/>
      <Footer/>
    </>
  );
}

export default App;