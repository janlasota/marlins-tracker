import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import type { ExtraGameData, ExtraTeamData, Venue } from "../../types";
import InningData from "./InningData";
import PitcherInfo from "./PitcherInfo";
import StatusAndScore from "./StatusAndScore";

interface CardDetailsProps {
  isAffiliateTeamHome: boolean;
  gameLevel: string;
  gameStatus: string;
  gameStatusCode: string;
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
          gameStatus={gameStatus}
          score={score}
          gameTime={gameTime}
        />
        {(gameStatusCode === "P" || gameStatusCode === "L") && (
          <span className="text-sm">{`Venue: ${venue.name}`}</span>
        )}
        <div className="flex items-center gap-1">
          {isAffiliateTeamHome ? (
            <>
              {teamData?.parentOrgName ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-pointer text-blue-500 underline">
                      {awayTeamName}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {`Parent club: ${teamData.parentOrgName}`}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <span>{awayTeamName}</span>
              )}
              <span>{" vs. "}</span>
              <span>{homeTeamName}</span>
            </>
          ) : (
            <>
              <span>{awayTeamName}</span>
              <span>{" @ "}</span>
              {teamData?.parentOrgName ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-pointer text-blue-500 underline">
                      {homeTeamName}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {`Parent club: ${teamData.parentOrgName}`}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <span>{homeTeamName}</span>
              )}
            </>
          )}
        </div>
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
