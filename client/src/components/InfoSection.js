import Spinner from "./BeatLoader";

function InfoSection({ data, isLoading }) {
    return (
      <div className="info-section">
        {data.map(([key, value], i) => (
          <div key={i} className="info-entry">
            <h4>{key}</h4>
            <p>{isLoading ? <Spinner/> : value}</p>
          </div>
        ))}
      </div>
    );
  }
  
  export default InfoSection;
  