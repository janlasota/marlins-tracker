const bases = ["1B", "2B", "3B"];

const InningData = ({
  inning,
  outs,
  runnersOnBase,
}: {
  inning: string | null;
  outs: string | null;
  runnersOnBase: string[];
}) => {
  return (
    <div className="flex flex-col items-end">
      {inning && <div className="font-semibold text-xs">{inning}</div>}
      {outs && <div className="font-semibold text-xs">{outs}</div>}
      <div className="flex gap-1">
        {bases.map((base) => (
          <div
            key={base}
            className={`font-semibold text-xs p-0.25 ${
              runnersOnBase.includes(base)
                ? "bg-black text-white rounded-md"
                : "text-black"
            }`}
          >
            {base}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InningData;
