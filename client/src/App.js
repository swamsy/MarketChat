import CompanyOverview from './components/CompanyOverview';
import Chatbot from './components/Chatbot';
import SearchBar from './components/SearchBar';

function App() {
  return (  
    <>
      <SearchBar/>
      <Chatbot/>
      <CompanyOverview symbol="GOOGL"/>
    </>
  );
}

export default App;