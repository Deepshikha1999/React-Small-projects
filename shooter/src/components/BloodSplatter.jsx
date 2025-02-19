export default function BloodSplatter({ shotPos,blood }) {
  if (!shotPos || shotPos.top === 0 || shotPos.left === 0) {
    console.warn("Invalid shotPos:", shotPos);
    return null; // Prevent rendering if position is invalid
  }
  
  return (
    <>
      {shotPos && (
        <div
          className={blood?'Blood-shot':'Gun-shot'}
          style={{
            top: `${shotPos.top}px`,
            left: `${shotPos.left}px`,
          }}
        >
        </div>
      )}
    </>
  );
}
