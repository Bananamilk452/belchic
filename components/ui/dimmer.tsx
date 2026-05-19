type DimmerProps = {
  children?: React.ReactNode;
  onClick?: () => void;
};

export function Dimmer({ children, onClick }: DimmerProps) {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClick} role="presentation">
      <div onClick={(e) => e.stopPropagation()} role="presentation">
        {children}
      </div>
    </div>
  );
}
