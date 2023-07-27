import Spinner from "./BeatLoader";
import styled from 'styled-components'

function InfoSection({ data, isLoading }) {
    return (
      <InfoSectionContainer>
        {data.map(([key, value], i) => (
          <div key={i}>
            <Category>{key}</Category>
            <p>{isLoading ? <Spinner/> : value}</p>
          </div>
        ))}
      </InfoSectionContainer>
    );
  }

  const InfoSectionContainer = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding-top: 1rem;
  `;
  

  const Category = styled.h4`
    padding-bottom: 0.5rem;
  `;
  
  export default InfoSection;
  