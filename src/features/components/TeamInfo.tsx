import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import type { ExtraTeamData } from "../../types";

interface TeamInfoProps {
  isAffiliateTeamHome: boolean;
  homeTeamData: ExtraTeamData;
  homeTeamName: string;
  awayTeamData: ExtraTeamData;
  awayTeamName: string;
}

const TeamInfo = ({
  isAffiliateTeamHome,
  homeTeamData,
  homeTeamName,
  awayTeamData,
  awayTeamName,
}: TeamInfoProps) => {
  return (
    <div className="flex items-center gap-1">
      {isAffiliateTeamHome ? (
        <>
          {awayTeamData?.parentOrgName ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer text-blue-500 underline truncate">
                  {awayTeamName}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {`Parent club: ${awayTeamData.parentOrgName}`}
              </TooltipContent>
            </Tooltip>
          ) : (
            <span className="truncate">{awayTeamName}</span>
          )}
          <span>{" vs. "}</span>
          <span className="truncate">{homeTeamName}</span>
        </>
      ) : (
        <>
          <span className="truncate">{awayTeamName}</span>
          <span>{" @ "}</span>
          {homeTeamData?.parentOrgName ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer text-blue-500 underline truncate">
                  {homeTeamName}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {`Parent club: ${homeTeamData.parentOrgName}`}
              </TooltipContent>
            </Tooltip>
          ) : (
            <span className="truncate">{homeTeamName}</span>
          )}
        </>
      )}
    </div>
  );
};

export default TeamInfo;
