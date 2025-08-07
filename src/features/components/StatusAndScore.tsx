const StatusAndScore = ({
  gameLevel,
  gameStatusCode,
  detailedGameStatusCode,
  gameStatus,
  score,
  gameTime,
}: {
  gameLevel: string;
  gameStatusCode: string;
  detailedGameStatusCode: string;
  gameStatus: string;
  score: string;
  gameTime: string;
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="font-bold">{gameLevel}</div>
      <div className="flex flex-col gap-1">
        {gameStatusCode !== "P" && (
          <div className="font-semibold text-xs self-end">{gameStatus}</div>
        )}
        {(gameStatusCode === "F" || gameStatusCode === "L") && score && (
          <div className="font-semibold text-xs self-end">{score}</div>
        )}
        {gameStatusCode === "P" && (
          <div className="flex gap-1 self-end">
            {detailedGameStatusCode === "PW" ? (
              <div className="font-semibold text-xs">Warm up</div>
            ) : (
              <>
                <div className="font-semibold text-xs">{gameTime}</div>
                {detailedGameStatusCode === "PI" && (
                  <div className="font-semibold text-xs">(Delayed)</div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusAndScore;
