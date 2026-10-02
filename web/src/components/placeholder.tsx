/**
 * Marks content the organiser has not supplied yet. Rendered visibly on purpose:
 * a first-year event with honest gaps looks trustworthy, one with invented
 * details does not. Search the built site for "NEEDS INPUT" to find them all.
 */
export function Placeholder({
  children,
  block = false,
}: {
  children: React.ReactNode;
  block?: boolean;
}) {
  return (
    <span className={block ? "placeholder placeholder--block" : "placeholder"}>
      <strong>Needs input:</strong> {children}
    </span>
  );
}

/** A whole empty state for a section that cannot be published yet. */
export function PendingBlock({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="notice">
      <div>
        <strong>{title}</strong>
        {children}
      </div>
    </div>
  );
}
