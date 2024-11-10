using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public interface IClientCommissionRepository 
    {
        List<ExportPostLog> GenerateExportPostLog(int ClientId, int NetworkId, DateTime DateFrom, DateTime DateTo, int LoggedOnUserId);

        ErrorMessage SaveClientCommission(int LoggedOnUserId,
            int ClientId,
            int QuarterId,
            string Anniversary,
            bool Tiered,
            string CommStructure,
            string Rate,
            string StartWeekNo,
            string EndWeekNo,
            string Week01Rate,
            string Week02Rate,
            string Week03Rate,
            string Week04Rate,
            string Week05Rate,
            string Week06Rate,
            string Week07Rate,
            string Week08Rate,
            string Week09Rate,
            string Week10Rate,
            string Week11Rate,
            string Week12Rate,
            string Week13Rate,
            string Week14Rate
            );

        List<ClientCommissionRateExport>  GetClientCommissionRateExport(int CountryId, string ClientId, int QuarterId, int loggedOnUserId);
    }
}
