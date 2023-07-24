import { useEffect } from 'react';
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
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  return (
    <StyledModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Learn About Key Data"
    >
      <h2>Key Data</h2>
      <ul>
          <li><b>Market Cap:</b> This is the total market value of a company's outstanding shares of stock. It is calculated by multiplying a company's shares outstanding by the current market price of one share.</li>
          <li><b>P/E Ratio:</b> Price-to-earnings ratio is a way to value a company by comparing the price of a stock to its earnings. The ratio is calculated by dividing the company's current stock price by its earnings per share (EPS). The P/E ratio tells you how much you are paying for each dollar of earnings.</li>
          <li><b>52 Week Range:</b> This shows the lowest and highest price at which a stock has traded during the previous 52 weeks.</li>
          <li><b>Dividend Yield:</b> This indicates how much a company pays out in dividends each year relative to its share price. It is calculated by dividing the dividend per share by the price per share.</li>
          <li><b>EPS:</b> Earnings per share is the portion of a company's profit allocated to each outstanding share of common stock. Earnings per share serves as an indicator of a company's profitability.</li>
      </ul>
    </StyledModal>
  );
}

export default LearnModal;
