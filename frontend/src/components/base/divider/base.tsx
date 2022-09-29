type BaseProps = {
  label?: string;
};

export function Divider({ label }: BaseProps) {
  return (
    <div className="flex items-center py-5">
      {label ? (
        <>
          <div className="flex-grow border-t border-neutral-400"></div>
          <span className="mx-4 flex-shrink text-sm text-neutral-400 md:text-base">
            {label}
          </span>
          <div className="flex-grow border-t border-neutral-400"></div>
        </>
      ) : (
        <div className="flex-grow border-t border-neutral-400"></div>
      )}
    </div>
  );
}
