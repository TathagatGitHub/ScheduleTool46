using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using OM_ScheduleTool.Models;
using OM_ScheduleTool.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static Microsoft.ApplicationInsights.MetricDimensionNames.TelemetryContext;

namespace OM_ScheduleTool.Repositories
{
    public interface IMediaPlanRepository
    {
        // TO Get the Media Plans for the Selected year Client and Country
        List<MediaPlan> GetAllMediaPlansForClientAndYear(int LoggedOnUserId, int ClientId, int BroadCastYear);


        // TO Copy the Media Plans for the Selected MediaPlanId
        int CopyMediaPlan(int LoggedOnUserId, int MediaPlanId, int ClientId, string QtrName, int Year);

        // TO Change the Publish Status for the Media Plans for the Selected MediaPlanId
        int TogglePublishMediaPlan(int LoggedOnUserId, int MediaPlanId, string Action);


        // TO Delete the Media Plan for the Selected MediaPlanId
        int DeleteMediaPlan(int LoggedOnUserId, int MediaPlanId, string Action);
        int DeleteMediaPlanPropertyById(int LoggedOnUserId, int MediaPlanPropertyId);
        // TO Get the Permission for the user if they can view
        bool GetMediaPlanPermission(int LoggedOnUserId);
        void MediaPlanUnlock(int LoggedOnUserId, int MediaPlanId);
        void MediaPlanLock(int LoggedOnUserId, int MediaPlanId);
        ErrorMessage MediaPlanCheckLock(int LoggedOnUserId, int MediaPlanId, string Action);
        IEnumerable<MediaPlanLocked> GetLockedMediaPlans(int LoggedOnUserId);
        ErrorMessage CreateEditMediaPlan(int LoggedOnUserId, string MediaPlanName, string BudgetPeriod, decimal GrossBudget, decimal Percentage, int ClientId, int PlanYear, string QuarterName, string BTGDemos, string BTGNetworks, string Action, int MediaPlanId);
        ErrorMessage UpdateMediaPlanPropertyById(int LoggedOnUserId, int MediaPlanPropertyId, decimal AdjustedRatePercentage, decimal AdjustedImpressionPercentage, string MediaPlanPropertyName,
            int DayPartId, int BuyTypeId, int SpotLen, decimal RateAmount, decimal Impressions, decimal CPM, int Wk01Spots, int Wk02Spots, int Wk03Spots, int Wk04Spots, int Wk05Spots
            , int Wk06Spots, int Wk07Spots, int Wk08Spots, int Wk09Spots, int Wk10Spots, int Wk11Spots, int Wk12Spots, int Wk13Spots, int Wk14Spots);
        EditMediaPlanViewModel EditMediaPlanByMediaPlanId(int MediaPlanId);
        MediaPlanPropertyEditGet GetMediaPlanPropertyById(int MediaPlanPropertyId, int QuarterId);
        //ErrorMessage CreateMediaPlan(int LoggedOnUserId, string MediaPlanName, string BudgetPeriod, decimal GrossBudget, decimal Percentage, int ClientId, int PlanYear, string QuarterName, string BTGDemos, string BTGNetworks);

        MediaPlanSummaryViewModel GetMeadiaPlanSummaryHeaderAndDropDown(int MediaPlanId, int LoggedOnUserId, string BudgetDisplay, string BuyTypeGroups = null, string NetwokIds = null, string MediaTypeIds = null, string DemoIds = null);
        ErrorMessage GetSummaryPublishedToggleMessage(int MediaPlanId, int LoggedOnUserId, string MediaPlanName);

        //ST-896 Specific BT Page
        MediaPlanBTPageSummaryViewModel GetMeadiaPlanBTPageSummary(int MediaPlanId, int LoggedOnUserId, string BuyTypeGroup);
        IEnumerable<MediaPlanQuarter> GetMediaPlanQuartersAndWeeks(int Year, int LoggedOnUserId);
        List<MediaPlanDemo> GetMediaPlanDemos(int MediaPlanId, string BuyTypeGroup);
        List<MediaPlanProperties> GetMediaPlanProperties(string QuarterName, int CountryId, int NetworkId, int DemoId, string BuyTypeGroup, int PlanYear, int MediaPlanId);
        // Save Medpa Plan properties from Long Plan Networks
        ErrorMessage SaveMediaPlanProperties(int LoggedOnUserId, int MediaPlanId, string MediaPlanName, int ClientId, MediaPlanProperties lstProp);
        ErrorMessage SaveMediaPlanDRClearance(int LoggedOnUserId, int MediaPlanId, string MediaPlanName, int ClientId, MediaPlanProperties drClearance);

        // Fumnctions for PlaceHolder
        IEnumerable<SelectListItem> GetMediaPlanBuyTypes(string BuyTypeGroup, int LoggedOnUserId);
        ErrorMessage GetWeeklyBudget(int LoggedOnUserId, int MediaPlanId);
        List<MediaPlan> GetAllMediaPlans(int LoggedOnUserId);
        Task<IEnumerable<MediaPlanAttachment>> GetAllMediaPlanAttachmentsAsync(int MediaPlanId);
        Task<FileAttachementResult> UploadFileAsync(IFormFile File, int MediaPlanId, int UserId);
        Task<FileStreamResult> DownloadFileAsync(int MediaPlanId, string FileName);
        Task<ErrorMessage> DeleteFileAsync(int MediaPlanId, string FileName, int MediaPlanAttachmentId);
        List<MediaPlanQuickPlan> GetQuickPlanDetails(int QuarterId, int CountryId, int NetworkId, int DemoId, int BuyTypeGroupId, int Year, int BuytypeId, int MediaPlanId, int PlanYear, int PlanQuarterId);

        #region Media Plan Notes Functions
        ErrorMessage SaveMedialPlanNote(int MediaPlanId, int LoggedOnUserId, string Note, string Author);
        ErrorMessage UpdateMedialPlanNote(int MediaPlanNoteId, int LoggedOnUserId, string Note);
        ErrorMessage DeleteMediaPlanNote(int MediaPlanNoteId, int LoggedOnUserId);        
        List<MediaPlanNotesModel> GetAllMediaPlansNotes(int MediaPlanId, int LoggedOnUserId);
        #endregion

        #region Media Plan Quick Plan Functions
        ErrorMessage SaveMedialQuickPlan(MediaPlanQuickPlan mediaPlanQuickPlan);
        #endregion
    }
}
