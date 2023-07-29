import { useState } from 'react';
import LearnModal from './LearnModal';
import InfoSection from './InfoSection';
import { formatLargeNum } from '../utilities/helperFunctions';
import styled from 'styled-components'

function KeyData({ companyData, isLoading }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <KeyDataContainer>
      <KeyDataContent>
        <KeyDataHeader>
          <h2>Key Data</h2>
          <LearnAboutKeyData onClick={() => setIsModalOpen(true)}>Learn about Key Data</LearnAboutKeyData>
          <LearnModal 
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
          />
        </KeyDataHeader>
        <InfoSection 
          data={[
            ["Market cap", companyData ? formatLargeNum(companyData.MarketCapitalization) : "—"],
            ["P/E ratio", companyData ? companyData.PERatio : "—"],
            ["52 week range", companyData ? `$${companyData['52WeekLow']} - $${companyData['52WeekHigh']}` : "—"],
            ["Dividend yield", companyData ? `${(companyData.DividendYield * 100).toFixed(2)}%` : "—"],
            ["EPS", companyData ? companyData.EPS : "—"],
          ]}
          isLoading={isLoading} 
        />
      </KeyDataContent>
    </KeyDataContainer>
  );
}

const KeyDataContainer = styled.div`
  padding-top: 2.5rem;
`;

const KeyDataContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const KeyDataHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  h4 {
    color: ${props => props.theme.colors[500]};
  }
`;

const LearnAboutKeyData = styled.h4`
  color: ${props => props.theme.colors[500]};
  
  &:hover {
    cursor: pointer;
    color: ${props => props.theme.colors[600]};
  }

  &:active {
    color: ${props => props.theme.colors[700]};
  }
`;


export default KeyData;
