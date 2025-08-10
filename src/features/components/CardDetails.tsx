import type { ExtraGameData, ExtraTeamData, Venue } from "../../types";
import InningData from "./InningData";
import PitcherInfo from "./PitcherInfo";
import StatusAndScore from "./StatusAndScore";
import TeamInfo from "./TeamInfo";

interface CardDetailsProps {
  isAffiliateTeamHome: boolean;
  gameLevel: string;
  gameStatus: string;
  gameStatusCode: string;
  detailedGameStatusCode: string;
  gameTime: string;
  score: string;
  venue: Venue;
  teamData: ExtraTeamData;
  homeTeamName: string;
  awayTeamName: string;
  extraGameData: ExtraGameData;
  winningPitcher: string;
  losingPitcher: string;
  savingPitcher: string;
  inning: string | null;
  outs: string | null;
  runnersOnBase: string[];
}

const CardDetails = ({
  isAffiliateTeamHome,
  gameLevel,
  gameStatus,
  gameStatusCode,
  detailedGameStatusCode,
  gameTime,
  score,
  venue,
  teamData,
  homeTeamName,
  awayTeamName,
  extraGameData,
  winningPitcher,
  losingPitcher,
  savingPitcher,
  inning,
  outs,
  runnersOnBase,
}: CardDetailsProps) => {
  const renderPitcherInfo =
    (gameStatusCode === "P" &&
      (extraGameData?.probablePitchers?.away?.fullName ||
        extraGameData?.probablePitchers?.home?.fullName)) ||
    (gameStatusCode === "F" &&
      (winningPitcher || losingPitcher || savingPitcher)) ||
    gameStatusCode === "L";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <StatusAndScore
          gameLevel={gameLevel}
          gameStatusCode={gameStatusCode}
          detailedGameStatusCode={detailedGameStatusCode}
          gameStatus={gameStatus}
          score={score}
          gameTime={gameTime}
        />
        {(gameStatusCode === "P" || gameStatusCode === "L") && (
          <span className="text-sm">{`Venue: ${venue.name}`}</span>
        )}
        <TeamInfo
          isAffiliateTeamHome={isAffiliateTeamHome}
          teamData={teamData}
          awayTeamName={awayTeamName}
          homeTeamName={homeTeamName}
        />
      </div>
      {renderPitcherInfo && (
        <div className="flex justify-between items-center">
          <PitcherInfo
            gameStatusCode={gameStatusCode}
            isAffiliateTeamHome={isAffiliateTeamHome}
            extraGameData={extraGameData}
            winningPitcher={winningPitcher}
            losingPitcher={losingPitcher}
            savingPitcher={savingPitcher}
          />
          {gameStatusCode === "L" && (
            <InningData
              inning={inning}
              outs={outs}
              runnersOnBase={runnersOnBase}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CardDetails;
