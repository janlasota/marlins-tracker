import type { ExtraGameData } from "../../types";

const getProbablePitchers = ({
  extraGameData,
  isAffiliateTeamHome,
}: {
  extraGameData: ExtraGameData;
  isAffiliateTeamHome: boolean;
}) => {
  const home = extraGameData?.probablePitchers?.home;
  const away = extraGameData?.probablePitchers?.away;
  const ourPitcher = isAffiliateTeamHome ? home?.fullName : away?.fullName;
  const theirPitcher = isAffiliateTeamHome ? away?.fullName : home?.fullName;

  return (
    <div className="flex flex-col gap-1">
      {ourPitcher && (
        <span className="text-sm">{`Our probable pitcher: ${ourPitcher}`}</span>
      )}
      {theirPitcher && (
        <span className="text-sm">
          {`Their probable pitcher: ${theirPitcher}`}
        </span>
      )}
    </div>
  );
};

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
      {gameStatusCode === "P" &&
        getProbablePitchers({ extraGameData, isAffiliateTeamHome })}
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
