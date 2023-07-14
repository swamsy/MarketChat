function InfoSection({ data }) {
    return (
      <div className="info-section">
        {data.map(([key, value], i) => (
          <div key={i} className="info-entry">
            <h4>{key}</h4>
            <p>{value}</p>
          </div>
        ))}
      </div>
    );
  }
  
  export default InfoSection;
  