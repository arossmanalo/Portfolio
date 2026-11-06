// Broadcast-style section header: position block, title, plain-English note
export default function ScreenHead({ idx, title, note }) {
  return (
    <div className="screen-head" data-reveal>
      <span className="idx">{idx}</span>
      <h2>{title}</h2>
      <small>{note}</small>
    </div>
  );
}
