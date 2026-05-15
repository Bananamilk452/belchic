type DimmerProps = {
  children?: React.ReactNode;
};

export function Dimmer({ children }: DimmerProps) {
  return <div className="fixed inset-0 z-50 bg-black/50">{children}</div>;
}
