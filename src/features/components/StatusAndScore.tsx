const StatusAndScore = ({
  gameLevel,
  gameStatusCode,
  gameStatus,
  score,
  gameTime,
}: {
  gameLevel: string;
  gameStatusCode: string;
  gameStatus: string;
  score: string;
  gameTime: string;
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="font-bold">{gameLevel}</div>
      <div className="flex flex-col gap-1">
        {gameStatusCode !== "P" && (
          <div className="font-semibold text-xs">{gameStatus}</div>
        )}
        {(gameStatusCode === "F" || gameStatusCode === "L") && score && (
          <div className="font-semibold text-xs">{score}</div>
        )}
        {gameStatusCode === "P" && (
          <div className="font-semibold text-xs">{gameTime}</div>
        )}
      </div>
    </div>
  );
};

export default StatusAndScore;
