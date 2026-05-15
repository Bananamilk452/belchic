type DimmerProps = {
  children?: React.ReactNode;
  onClick?: () => void;
};

export function Dimmer({ children, onClick }: DimmerProps) {
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/no-noninteractive-tabindex
    <div
      className="fixed inset-0 z-50 bg-black/50"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onClick?.();
        }
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="presentation"
      >
        {children}
      </div>
    </div>
  );
}
