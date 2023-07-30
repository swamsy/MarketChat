import Modal from 'react-modal';
import styled from 'styled-components';

const StyledModal = styled(Modal)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${props => props.theme.colors[100]};
  outline: none;
  border-radius: 8px;
  padding: 20px 36px;
  width: 500px;
  max-width: 90%; 
  max-height: 90%; 

  @media (min-width: 600px) { 
    max-width: 600px; 
    max-height: 600px; 
  }
  
`;

const LearnModalHeader = styled.div`
  position: relative; 
  display: flex;
  justify-content: center; 
  align-items: center;
  margin-bottom: 2rem;
`;

const StyledXMark = styled.svg`
  position: absolute;
  left: 0; 
  cursor: pointer;
  width: 24px;
  height: 24px;

  path {
    stroke: ${props => props.theme.colors[500]};
  }

  &:hover path {
    stroke: ${props => props.theme.colors[600]};
  }
`;

const TitleContainer = styled.div`
  flex-grow: 1; 
  display: flex;
  justify-content: center;
`;

const Definition = styled.div`
  margin-bottom: 1.5rem;
`;

const LearnModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const CloseButton = styled.button`
  cursor: pointer;
  background-color: ${props => props.theme.colors[500]};
  outline: none;
  border: none;
  border-radius: 6px;
  padding: 1rem 4rem;
  
  &:hover {
    background-color: ${props => props.theme.colors[600]};
  }

  &:active {
    background-color: ${props => props.theme.colors[700]};
  }
`;

function LearnModal({ isOpen, onRequestClose }) {
  return (
    <StyledModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Learn About Key Data"
    >
      <LearnModalHeader>
        <StyledXMark onClick={onRequestClose}>
          <path d="M18 6L6 18M18 18L6 6.00001" stroke="black" stroke-width="2" stroke-linecap="round"/>
        </StyledXMark>
        <TitleContainer>
          <h3>Key Data</h3>
        </TitleContainer>
      </LearnModalHeader>
      <Definition><b>Market Cap:</b> This is the total market value of a company's outstanding shares of stock. It is calculated by multiplying a company's shares outstanding by the current market price of one share.</Definition>
      <Definition><b>P/E Ratio:</b> Price-to-earnings ratio is a way to value a company by comparing the price of a stock to its earnings. The ratio is calculated by dividing the company's current stock price by its earnings per share (EPS). The P/E ratio tells you how much you are paying for each dollar of earnings.</Definition>
      <Definition><b>52 Week Range:</b> This shows the lowest and highest price at which a stock has traded during the previous 52 weeks.</Definition>
      <Definition><b>Dividend Yield:</b> This indicates how much a company pays out in dividends each year relative to its share price. It is calculated by dividing the dividend per share by the price per share.</Definition>
      <Definition><b>EPS:</b> Earnings per share is the portion of a company's profit allocated to each outstanding share of common stock. Earnings per share serves as an indicator of a company's profitability.</Definition>
      <LearnModalFooter>
        <CloseButton onClick={onRequestClose}><h6 style={{color: 'white'}}>Close</h6></CloseButton>
      </LearnModalFooter>
    </StyledModal>
  );
}

export default LearnModal;
