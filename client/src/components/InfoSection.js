import Spinner from "./BeatLoader";
import styled from 'styled-components'

function InfoSection({ data, isLoading }) {
    return (
      <InfoSectionContainer>
        {data.map(([key, value], i) => (
          <InfoItem key={i}>
            <Category>{key}</Category>
            <p>{isLoading ? <Spinner/> : value}</p>
          </InfoItem>
        ))}
      </InfoSectionContainer>
    );
  }

const InfoSectionContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 96px; /* Adjust the gap between grid items */
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
  