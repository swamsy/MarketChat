import Modal from 'react-modal';
import styled from 'styled-components';

const StyledModal = styled(Modal)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: gray;
  border-radius: 4px;
  padding: 20px;
  outline: none;
  max-width: 90%; 
  max-height: 90%; 
  overflow-y: auto; 

  @media (min-width: 600px) { 
    max-width: 600px; 
    max-height: 600px; 
  }
  
`;

function LearnModal({ isOpen, onRequestClose }) {
  return (
    <StyledModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Learn About Key Data"
    >
      <h2>Learn About Key Data</h2>
      <ul>
          <li>Market Cap: This is the total market value of a company's outstanding shares of stock. It is calculated by multiplying a company's shares outstanding by the current market price of one share.</li>
          <li>P/E Ratio: This is the ratio for valuing a company that measures its current share price relative to its per-share earnings (EPS).</li>
          <li>52 Week Range: This shows the lowest and highest price at which a stock has traded in the last year.</li>
          <li>Dividend Yield: This indicates how much a company pays out in dividends each year relative to its share price.</li>
          <li>EPS: Earnings per share (EPS) is the portion of a company's profit allocated to each outstanding share of common stock. Earnings per share serves as an indicator of a company's profitability.</li>
      </ul>
    </StyledModal>
  );
}

export default LearnModal;
