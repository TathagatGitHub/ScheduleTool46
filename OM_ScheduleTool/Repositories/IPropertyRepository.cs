using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public interface IPropertyRepository 
    {
        IEnumerable<DoNotBuyType> GetDoNotBuyTypes();
        IEnumerable<BuyType> GetBuyTypes(int NetworkId, int LoggedOnUserId, bool Upfront);
        IEnumerable<DayPart> GetDayParts();
        Quarter GetQuarter (string QtrName);
        List<Network> GetNetworks(int CountryId);
        List<DemographicSettings> GetDemoNames(int CountryId);
        ChangeProgramModel ChangeProgram(int LoggedOnUserId
            , int UpfrontLineId
            , string PropertyName
            , decimal Rate
            , decimal Imp
            , int DayPartId
            , bool Monday
            , bool Tuesday
            , bool Wednesday
            , bool Thursday
            , bool Friday
            , bool Saturday
            , bool Sunday
            , string StartTime
            , string EndTime
            , string EffectiveDate
            , string ExpirationDate);
        string AddNewProperty(int LoggedOnUserId
            , int NetworkId
            , int QuarterId
            , string PropertyName
            , int DayPartId
            , bool Monday
            , bool Tuesday
            , bool Wednesday
            , bool Thursday
            , bool Friday
            , bool Saturday
            , bool Sunday
            , string StartTime
            , string EndTime
            , int BuyTypeId
            , int DoNotBuyTypeId
            , int MandateClientId
            , bool Upfront
            , bool SPBuy);
        ErrorMessage UpdateProperty(int LoggedOnUserId, Microsoft.AspNetCore.Http.HttpRequest request);

        ErrorMessage AutoApprove(int LoggedOnUserId, int UpfrontId);

        ErrorMessage SavePropertyName(int LoggedOnUserId, int UpfrontLineId, string PropertyName);
        ErrorMessage SaveDay(int LoggedOnUserId, int UpfrontLineId, bool Checked, int Day /* Monday=1,...*/);
        ErrorMessage SaveStartTime(int LoggedOnUserId, int UpfrontLineId, string StartTime);
        ErrorMessage SaveEndTime(int LoggedOnUserId, int UpfrontLineId, string EndTime);
        ErrorMessage SaveRateAmt(int LoggedOnUserId, int UpfrontLineId, decimal RateAmt);
        ErrorMessage SaveImpressions(int LoggedOnUserId, int UpfrontLineId, decimal Impressions);
        ErrorMessage SaveBuyTypeId(int LoggedOnUserId, int UpfrontLineId, int BuyTypeId);
        ErrorMessage SaveDayPartId(int LoggedOnUserId, int UpfrontLineId, int DayPartId);
        ErrorMessage SaveDoNotBuyTypeId(int LoggedOnUserId, int UpfrontLineId, int DoNotBuyTypeId);
        ErrorMessage SaveMandateClientId(int LoggedOnUserId, int UpfrontLineId, int MandateClientId);
        ErrorMessage SaveEffectiveDate(int LoggedOnUserId, int UpfrontLineId, string EffectiveDate);
        ErrorMessage SaveExpirationDate(int LoggedOnUserId, int UpfrontLineId, string ExpirationDate);

        ErrorMessage UpdateProperty(int LoggedOnUserId
            , int UpfrontLineId
            , bool Approved
            , string PropertyName
            , int Monday
            , int Tuesday
            , int Wednesday
            , int Thursday
            , int Friday
            , int Saturday
            , int Sunday
            , string StartTime
            , string EndTime
            , int DayPartId
            , int BuyTypeId
            , string Rate
            , string Impressions
            , int Status
            , int DoNotBuyTypeId
            , int MandateClientId
            , string EffectiveDate
            , string ExpirationDate);
        ErrorMessage AddNewPropertyRates(int LoggedOnUserId
            , int PropertyId
            , int QuarterId
            , int DemographicSettingsId
            , int BuyTypeId
            , decimal Rate
            , decimal Impressions
            , int DoNotBuyTypeId
            , string EffectiveDate
            , string ExpirationDate
            , int MandateClientId
            , bool IsUpfront);
        Property GetPropertyById(int LoggedOnUserId, int PropertyId);
        //string DeleteProperty(int LoggedOnUserId, int PropertyId);
        string DeleteProperty(int LoggedOnUserId, params int[] UpfrontLineIds);
        ErrorMessage GetPropertyChangedCount(int LoggedOnUserId, int UpfrontId);
        ErrorMessage SaveUpfrontChanges(int LoggedOnUserId, int UpfrontId);
        ErrorMessage SaveSPBuy(int LoggedOnUserId, int UpfrontLineId, string SPBuy);
    }
}
