import { useState } from 'react';
import SearchBar from './components/SearchBar';
import Chatbot from './components/Chatbot';
import CompanyOverview from './components/CompanyOverview';
import Footer from './components/Footer';

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
      <Footer/>
    </>
  );
}

export default App;