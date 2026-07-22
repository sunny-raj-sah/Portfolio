export default function SectionHead({ hash, title, subtitle }) {
  return (
    <>
      <div className="section-head">
        <span className="section-hash">{hash}</span>
        <h2 className="section-title">{title}</h2>
      </div>
      {subtitle && <p className="section-sub">{subtitle}</p>}
    </>
  );
}
