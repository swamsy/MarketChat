import { useState } from 'react';
import CompanyOverview from './components/CompanyOverview';
import Chatbot from './components/Chatbot';
import SearchBar from './components/SearchBar';

function App() {
  const [symbol, setSymbol] = useState('AAPL');

  const handleSymbolSelected = (selectedSymbol) => {
    setSymbol(selectedSymbol);
  };


  return (  
    <>
      <SearchBar onSymbolSelected={handleSymbolSelected}/>
      <Chatbot symbol={symbol}/>
      <CompanyOverview symbol={symbol}/>
    </>
  );
}

export default App;