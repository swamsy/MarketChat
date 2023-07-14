import CompanyOverview from './components/CompanyOverview';
import Chatbot from './components/Chatbot';

function App() {
  return (  
    <div clasName="App">
      <Chatbot/>
      <CompanyOverview symbol="AAPL"/>
    </div>
  );
}

export default App;