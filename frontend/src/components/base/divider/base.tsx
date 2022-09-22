type BaseProps = {
  label?: string;
};

export function Divider({ label }: BaseProps) {
  return (
    <div className="flex py-5 items-center">
      {label ? (
        <>
          <div className="flex-grow border-t border-neutral-400"></div>
          <span className="text-sm md:text-base flex-shrink mx-4 text-neutral-400">
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
