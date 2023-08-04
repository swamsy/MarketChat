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
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  column-gap: 96px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  margin: 24px 0;
`;

const Category = styled.h3`
  font-size: 20px;
  padding-bottom: 0.5rem;
`;
  
export default InfoSection;
  