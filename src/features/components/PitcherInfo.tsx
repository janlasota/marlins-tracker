import type { ExtraGameData } from "../../types";

interface PitcherInfoProps {
  gameStatusCode: string;
  isAffiliateTeamHome: boolean;
  extraGameData: ExtraGameData;
  winningPitcher: string;
  losingPitcher: string;
  savingPitcher: string;
}

const PitcherInfo = ({
  gameStatusCode,
  isAffiliateTeamHome,
  extraGameData,
  winningPitcher,
  losingPitcher,
  savingPitcher,
}: PitcherInfoProps) => {
  return (
    <>
      {gameStatusCode === "P" && (
        <div className="flex flex-col gap-1">
          {isAffiliateTeamHome ? (
            <>
              {extraGameData?.probablePitchers?.home?.fullName && (
                <span className="text-sm">
                  {`Our probable pitcher: ${extraGameData.probablePitchers.home.fullName}`}
                </span>
              )}
              {extraGameData?.probablePitchers?.away?.fullName && (
                <span className="text-sm">
                  {`Their probable pitcher: ${extraGameData.probablePitchers.away.fullName}`}
                </span>
              )}
            </>
          ) : (
            <>
              {extraGameData?.probablePitchers?.away?.fullName && (
                <span className="text-sm">
                  {`Our probable pitcher: ${extraGameData.probablePitchers.away.fullName}`}
                </span>
              )}
              {extraGameData?.probablePitchers?.home?.fullName && (
                <span className="text-sm">
                  {`Their probable pitcher: ${extraGameData.probablePitchers.home.fullName}`}
                </span>
              )}
            </>
          )}
        </div>
      )}
      {gameStatusCode === "F" &&
        (winningPitcher || losingPitcher || savingPitcher) && (
          <div className="flex flex-col gap-1">
            {winningPitcher && (
              <span className="text-sm">{`Winning pitcher: ${winningPitcher}`}</span>
            )}
            {losingPitcher && (
              <span className="text-sm">{`Losing pitcher: ${losingPitcher}`}</span>
            )}
            {savingPitcher && (
              <span className="text-sm">{`Saving pitcher: ${savingPitcher}`}</span>
            )}
          </div>
        )}
      {gameStatusCode === "L" && (
        <div className="flex flex-col gap-1">
          <span className="text-sm">
            {`Current pitcher: ${extraGameData?.pitcher}`}
          </span>
          <span className="text-sm">
            {`Up-to-bat: ${extraGameData?.batter}`}
          </span>
        </div>
      )}
    </>
  );
};

export default PitcherInfo;
