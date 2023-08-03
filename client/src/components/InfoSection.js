import { CustomBeatLoader } from './Loaders';
import styled from 'styled-components'

function InfoSection({ data, isLoading }) {
    return (
      <InfoSectionContainer>
        {data.map(([key, value], i) => (
          <InfoItem key={i}>
            <Category>{key}</Category>
            <p>{isLoading ? <CustomBeatLoader/> : value}</p>
          </InfoItem>
        ))}
      </InfoSectionContainer>
    );
  }

const InfoSectionContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); /* adjust 150px to your minimum desirable width */
  column-gap: 96px;
  box-sizing: border-box;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  margin: 24px 0;
`;

const Category = styled.h5`
  padding-bottom: 0.5rem;
`;
  
export default InfoSection;
  