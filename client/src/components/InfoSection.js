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
    display: flex;
    flex-flow: wrap;
    margin-left: -48px;
    margin-right: -48px;
    width: calc(100% + 96px);
    box-sizing: border-box;
  `;
  
  const InfoItem = styled.div`
    display: flex;
    flex-direction: column;
    flex: 0 0 calc(20% - 96px);
    margin: 24px 48px;
    width: calc(20% - 96px);
    box-sizing: border-box;
  `;

  const Category = styled.h5`
    padding-bottom: 0.5rem;
  `;
  
  export default InfoSection;
  