/*should retrun 9 rows*/
SELECT *
  FROM dbo.dbo.DisplayAppsDefaultEventVerCampaignWeb
  where precisetimestamp > '2014-08-04T01:18:40.0000000Z'
  and precisetimestamp < '2014-08-08T03:45:16.0000000Z'
  and Message like '%Collect%'
  and RoleInstance = 'CampaignWeb_IN_1'