var ProposalTotalJson;
var ProposalForMatching;
var ArchivedProposalsJson;
var SelectedProposalsJson;
var PotentialMatchPropsalsArray = [];
var SelectedProposal;
var SelectedProposalNo;
var SelTab = 1;
var primarycolorMulti = "#ffffff";
var secondaryColorMulti = "#e5e5e5";
var StartEDIIdMulti = 0;
var SelColorMulti = "";
//var currentFileIndex = 0;
var currentJsonSelectedForImport;
var maxAculatizedWeekNum;

function ShowOverlayPopupImport() {
    document.getElementById("DivOverLayPopoupImport").style.display = "block";
}
function HideOverlayPopupImport() {
    document.getElementById("DivOverLayPopoupImport").style.display = "none";
}
function BindImportScreenData(selJson) {
    currentJsonSelectedForImport = selJson;
    SetImportScreenData(currentFileIndex);
}
var choosenNetworkList = new Array();
var networkArray = [];

function SetImportScreenData(fileIndex) {
    ShowOverlayPopupImport();
    CurrentNetworkId = currentJsonSelectedForImport[fileIndex].networkId
    if (PreviousNetworkId === 0) {
        PreviousNetworkId = CurrentNetworkId;
    }
    var CountText = "";
    TotalCount = currentJsonSelectedForImport.filter(x => x.networkId === CurrentNetworkId).length;
    if (TotalCount > 1) {
        if (CurrentNetworkId != PreviousNetworkId) {
            CurrentCount = 1;
        }
        else {
            CurrentCount = CurrentCount + 1;
        }
        CountText = CurrentCount + "/" + TotalCount;
        PreviousNetworkId = CurrentNetworkId;
    }
    else {
        CurrentCount = 1;
        CountText = "";
        PreviousNetworkId = CurrentNetworkId;
    }
    $("#ImportHeadingData").html("Import Proposals : " + $("#ddlclients :selected").text() + " - " + ($(".nav-link.active").html().split(' ')[0]).toString().substring(2, 1) + "Q" + $(".nav-link.active").html().split(' ')[1] + " - Network: " + currentJsonSelectedForImport[fileIndex].networkName + "    " + CountText + "");
    $("#ImportHeadingDataPotentialMatches").html("Import Proposals : " + $("#ddlclients :selected").text() + " - " + ($(".nav-link.active").html().split(' ')[0]).toString().substring(2, 1) + "Q" + $(".nav-link.active").html().split(' ')[1] + " - Network: " + currentJsonSelectedForImport[fileIndex].networkName + "");
    $("#spnCurNetworkName").html(" " + currentJsonSelectedForImport[fileIndex].networkName + " - Received Date and Time: <br/>" + currentJsonSelectedForImport[fileIndex].receivedDate + "<br/><div id='dealAction'>" + "Deal - " + currentJsonSelectedForImport[fileIndex].deal + "<br/>" + "Action - " + currentJsonSelectedForImport[fileIndex].selectionType.charAt(0).toUpperCase() + currentJsonSelectedForImport[fileIndex].selectionType.slice(1) + "</div>");
    var _selCountryid = 5;
    if ($('#US').is(':checked')) {
        _selCountryid = 5;
    }
    else if ($('#CA').is(':checked')) {
        _selCountryid = 2;
    }
    var _selClientid = $("#ddlclients :selected").val();
    //alert(_selClientid);
    var _selQtr = ($(".nav-link.active").html().split(' ')[0]).toString().substring(2, 1) + "Q" + $(".nav-link.active").html().split(' ')[1];
    // alert(_selQtr);
    var CanProceedNormal = false;
    $.ajax({
        url: '/ScheduleProposal/GetImportProposals',
        type: "GET",
        async: false,
        data: {
            "ClientId": _selClientid,
            "QuarterName": _selQtr,
            "NetworkId": currentJsonSelectedForImport[fileIndex].networkId,
            "SourceFileName": currentJsonSelectedForImport[fileIndex].sourceFile,
            "FileAction": currentJsonSelectedForImport[fileIndex].selectionType,
            "CountryId": _selCountryid,
            "Mode": currentJsonSelectedForImport[fileIndex].mode,
            "ShowTotals": false
        },
        success: function (result) {
            ImportPropsalsJson = result.proposals;
            maxAculatizedWeekNum = ImportPropsalsJson[0].actualizedWeekNum;
            SelQtrJson = result.selectedQtr;
            UnMatchPropsalsJson = ImportPropsalsJson.filter(o => o.matchType == "UnMatched");
            SingleMatchPropsalsJson = ImportPropsalsJson.filter(o => o.matchType == "Matched" && o.matchStyle == "Single");
            MultiMatchPropsalsJson = ImportPropsalsJson.filter(o => o.matchType == "Matched" && o.matchStyle == "Multiple");
            PotentialMatchPropsalsJson = ImportPropsalsJson.filter(o => o.matchType == "Matched" && o.matchStyle == "PotentialMatched");
            //ST-710 Code Start to log the User Journey
            var Description = "Loaded Import Load screen data";
            var proposalId = 0;
            if ($(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != null && $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != undefined && $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != "")
                proposalId = $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href").split('=')[1];

            AddUserJourneyEntryImportLoad(currentJsonSelectedForImport[fileIndex].clientId, currentJsonSelectedForImport[fileIndex].networkId,
                currentJsonSelectedForImport[fileIndex].quarterName, "ImportLoadScreen",proposalId,
                currentJsonSelectedForImport[fileIndex].deal, currentJsonSelectedForImport[fileIndex].sourceFile,
                "ImportLoadDone", Description);

                        //ST-710 Code End to log the User Journey
            if (SingleMatchPropsalsJson != null && SingleMatchPropsalsJson.length > 1) {
                // ST-614, Fixed By Shariq
                SingleMatchPropsalsJson.sort(function (a, b) {
                    return a.propertyName.localeCompare(b.propertyName) || b.buyTypeCode.localeCompare(a.buyTypeCode)
                        || a.spotLen.toString().localeCompare(b.spotLen.toString());
                });
                GetUniqueDataMerged(SingleMatchPropsalsJson, 1);
            }
            if (UnMatchPropsalsJson != null && UnMatchPropsalsJson.length > 1) {
                GetUniqueUnMatchDataMerge(UnMatchPropsalsJson);
            }
            //if (MultiMatchPropsalsJson != null && MultiMatchPropsalsJson.length > 1)
            //GetUniqueDataMerged(MultiMatchPropsalsJson, 2);
            setTimeout(function () { BindSingleMatchedProperties() }, 1000);
            setTimeout(function () { $("#modal-ImportUnAllocatedProposals .block-content").scrollLeft(0); }, 3000);
        },
        error: function (response) {
            //ST-710 Code Start to log the User Journey
            var Description = "Failed to Load Import Load screen data";
            var proposalId = 0;
            if ($(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != null && $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != undefined && $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != "")
                proposalId = $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href").split('=')[1];

            AddUserJourneyEntryImportLoad(currentJsonSelectedForImport[fileIndex].clientId, currentJsonSelectedForImport[fileIndex].networkId,
                currentJsonSelectedForImport[fileIndex].quarterName, "ImportLoadScreen", proposalId,
                currentJsonSelectedForImport[fileIndex].deal, currentJsonSelectedForImport[fileIndex].sourceFile,
                "ImportLoadFailed", Description);

                        //ST-710 Code End to log the User Journey
            HideOverlayPopupImport();
        }
    });
}

$("#btnbackChooseMatch,#btnbackImportLoad").on("click", function () {
    $("#dealAction").show();
});


function GetUniqueUnMatchDataMerge(curJson) {
    var uniqueProposals = [];
    var uniqueProposal = [];
    var unique = curJson.filter(function (itm, i, a) {
        var curprops = {
            "propertyName": itm.propertyName,
            "monday": itm.m,
            "tuesday": itm.t,
            "wednesday": itm.w,
            "thursday": itm.th,
            "friday": itm.f,
            "saturday": itm.sa,
            "sunday": itm.su,
            "startAndEndTime": itm.startAndEndTime,
            "buyTypeCode": itm.buyTypeCode,
            "dayPart": itm.dayPart,
            "spotLen": itm.spotLen,
            "rateAmt": itm.rateAmt
        }
        var index = uniqueProposals.findIndex(
            x => x.propertyName === itm.propertyName
                && x.monday===itm.m
                && x.tuesday === itm.t
                && x.wednesday === itm.w
                && x.thursday === itm.th
                && x.friday === itm.f
                && x.saturday === itm.sa
                && x.sunday === itm.su
                && x.startAndEndTime === itm.startAndEndTime
                && x.buyTypeCode === itm.buyTypeCode
                && x.dayPart === itm.dayPart
                && x.spotLen === itm.spotLen
                && x.rateAmt === itm.rateAmt

        );
        if (index < 0) {
            uniqueProposal.push(itm);
            uniqueProposals.push(curprops);
        }
        else {
            uniqueProposal.filter(x => x.propertyName === itm.propertyName
                && x.m === itm.m
                && x.t === itm.t
                && x.w === itm.w
                && x.th === itm.th
                && x.f === itm.f
                && x.sa === itm.sa
                && x.su === itm.su
                && x.startAndEndTime === itm.startAndEndTime
                && x.buyTypeCode === itm.buyTypeCode
                && x.dayPart === itm.dayPart
                && x.spotLen === itm.spotLen
                && x.rateAmt === itm.rateAmt)[0].totalSpots = parseInt(
                    uniqueProposal.filter(
                        x => x.propertyName === itm.propertyName
                            && x.m === itm.m
                            && x.t === itm.t
                            && x.w === itm.w
                            && x.th === itm.th
                            && x.f === itm.f
                            && x.sa === itm.sa
                            && x.su === itm.su
                            && x.startAndEndTime === itm.startAndEndTime
                            && x.buyTypeCode === itm.buyTypeCode
                            && x.dayPart === itm.dayPart
                            && x.spotLen === itm.spotLen
                            && x.rateAmt === itm.rateAmt)[0].totalSpots) + parseInt(itm.totalSpots);
            uniqueProposal.filter(x => x.propertyName === itm.propertyName
                && x.m === itm.m
                && x.t === itm.t
                && x.w === itm.w
                && x.th === itm.th
                && x.f === itm.f
                && x.sa === itm.sa
                && x.su === itm.su
                && x.startAndEndTime === itm.startAndEndTime
                && x.buyTypeCode === itm.buyTypeCode
                && x.dayPart === itm.dayPart
                && x.spotLen === itm.spotLen
                && x.rateAmt === itm.rateAmt)[0].week01 = parseInt(uniqueProposal.filter(x => x.propertyName === itm.propertyName
                    && x.m === itm.m
                    && x.t === itm.t
                    && x.w === itm.w
                    && x.th === itm.th
                    && x.f === itm.f
                    && x.sa === itm.sa
                    && x.su === itm.su
                    && x.startAndEndTime === itm.startAndEndTime
                    && x.buyTypeCode === itm.buyTypeCode
                    && x.dayPart === itm.dayPart
                    && x.spotLen === itm.spotLen
                    && x.rateAmt === itm.rateAmt)[0].week01) + parseInt(itm.week01);
            uniqueProposal.filter(x => x.propertyName === itm.propertyName
                && x.m === itm.m
                && x.t === itm.t
                && x.w === itm.w
                && x.th === itm.th
                && x.f === itm.f
                && x.sa === itm.sa
                && x.su === itm.su
                && x.startAndEndTime === itm.startAndEndTime
                && x.buyTypeCode === itm.buyTypeCode
                && x.dayPart === itm.dayPart
                && x.spotLen === itm.spotLen
                && x.rateAmt === itm.rateAmt)[0].week02 = parseInt(uniqueProposal.filter(x => x.propertyName === itm.propertyName
                    && x.m === itm.m
                    && x.t === itm.t
                    && x.w === itm.w
                    && x.th === itm.th
                    && x.f === itm.f
                    && x.sa === itm.sa
                    && x.su === itm.su
                    && x.startAndEndTime === itm.startAndEndTime
                    && x.buyTypeCode === itm.buyTypeCode
                    && x.dayPart === itm.dayPart
                    && x.spotLen === itm.spotLen
                    && x.rateAmt === itm.rateAmt)[0].week02) + parseInt(itm.week02);
            uniqueProposal.filter(x => x.propertyName === itm.propertyName
                && x.m === itm.m
                && x.t === itm.t
                && x.w === itm.w
                && x.th === itm.th
                && x.f === itm.f
                && x.sa === itm.sa
                && x.su === itm.su
                && x.startAndEndTime === itm.startAndEndTime
                && x.buyTypeCode === itm.buyTypeCode
                && x.dayPart === itm.dayPart
                && x.spotLen === itm.spotLen
                && x.rateAmt === itm.rateAmt)[0].week03 = parseInt(uniqueProposal.filter(x => x.propertyName === itm.propertyName
                    && x.m === itm.m
                    && x.t === itm.t
                    && x.w === itm.w
                    && x.th === itm.th
                    && x.f === itm.f
                    && x.sa === itm.sa
                    && x.su === itm.su
                    && x.startAndEndTime === itm.startAndEndTime
                    && x.buyTypeCode === itm.buyTypeCode
                    && x.dayPart === itm.dayPart
                    && x.spotLen === itm.spotLen
                    && x.rateAmt === itm.rateAmt)[0].week03) + parseInt(itm.week03);
            uniqueProposal.filter(x => x.propertyName === itm.propertyName
                && x.m === itm.m
                && x.t === itm.t
                && x.w === itm.w
                && x.th === itm.th
                && x.f === itm.f
                && x.sa === itm.sa
                && x.su === itm.su
                && x.startAndEndTime === itm.startAndEndTime
                && x.buyTypeCode === itm.buyTypeCode
                && x.dayPart === itm.dayPart
                && x.spotLen === itm.spotLen
                && x.rateAmt === itm.rateAmt)[0].week04 = parseInt(uniqueProposal.filter(x => x.propertyName === itm.propertyName
                    && x.m === itm.m
                    && x.t === itm.t
                    && x.w === itm.w
                    && x.th === itm.th
                    && x.f === itm.f
                    && x.sa === itm.sa
                    && x.su === itm.su
                    && x.startAndEndTime === itm.startAndEndTime
                    && x.buyTypeCode === itm.buyTypeCode
                    && x.dayPart === itm.dayPart
                    && x.spotLen === itm.spotLen
                    && x.rateAmt === itm.rateAmt)[0].week04) + parseInt(itm.week04);
            uniqueProposal.filter(x => x.propertyName === itm.propertyName
                && x.m === itm.m
                && x.t === itm.t
                && x.w === itm.w
                && x.th === itm.th
                && x.f === itm.f
                && x.sa === itm.sa
                && x.su === itm.su
                && x.startAndEndTime === itm.startAndEndTime
                && x.buyTypeCode === itm.buyTypeCode
                && x.dayPart === itm.dayPart
                && x.spotLen === itm.spotLen
                && x.rateAmt === itm.rateAmt)[0].week05 = parseInt(uniqueProposal.filter(x => x.propertyName === itm.propertyName
                    && x.m === itm.m
                    && x.t === itm.t
                    && x.w === itm.w
                    && x.th === itm.th
                    && x.f === itm.f
                    && x.sa === itm.sa
                    && x.su === itm.su
                    && x.startAndEndTime === itm.startAndEndTime
                    && x.buyTypeCode === itm.buyTypeCode
                    && x.dayPart === itm.dayPart
                    && x.spotLen === itm.spotLen
                    && x.rateAmt === itm.rateAmt)[0].week05) + parseInt(itm.week05);
            uniqueProposal.filter(x => x.propertyName === itm.propertyName
                && x.m === itm.m
                && x.t === itm.t
                && x.w === itm.w
                && x.th === itm.th
                && x.f === itm.f
                && x.sa === itm.sa
                && x.su === itm.su
                && x.startAndEndTime === itm.startAndEndTime
                && x.buyTypeCode === itm.buyTypeCode
                && x.dayPart === itm.dayPart
                && x.spotLen === itm.spotLen
                && x.rateAmt === itm.rateAmt)[0].week06 = parseInt(uniqueProposal.filter(x => x.propertyName === itm.propertyName
                    && x.m === itm.m
                    && x.t === itm.t
                    && x.w === itm.w
                    && x.th === itm.th
                    && x.f === itm.f
                    && x.sa === itm.sa
                    && x.su === itm.su
                    && x.startAndEndTime === itm.startAndEndTime
                    && x.buyTypeCode === itm.buyTypeCode
                    && x.dayPart === itm.dayPart
                    && x.spotLen === itm.spotLen
                    && x.rateAmt === itm.rateAmt)[0].week06) + parseInt(itm.week06);
            uniqueProposal.filter(x => x.propertyName === itm.propertyName
                && x.m === itm.m
                && x.t === itm.t
                && x.w === itm.w
                && x.th === itm.th
                && x.f === itm.f
                && x.sa === itm.sa
                && x.su === itm.su
                && x.startAndEndTime === itm.startAndEndTime
                && x.buyTypeCode === itm.buyTypeCode
                && x.dayPart === itm.dayPart
                && x.spotLen === itm.spotLen
                && x.rateAmt === itm.rateAmt)[0].week07 = parseInt(uniqueProposal.filter(x => x.propertyName === itm.propertyName
                    && x.m === itm.m
                    && x.t === itm.t
                    && x.w === itm.w
                    && x.th === itm.th
                    && x.f === itm.f
                    && x.sa === itm.sa
                    && x.su === itm.su
                    && x.startAndEndTime === itm.startAndEndTime
                    && x.buyTypeCode === itm.buyTypeCode
                    && x.dayPart === itm.dayPart
                    && x.spotLen === itm.spotLen
                    && x.rateAmt === itm.rateAmt)[0].week07) + parseInt(itm.week07);
            uniqueProposal.filter(x => x.propertyName === itm.propertyName
                && x.m === itm.m
                && x.t === itm.t
                && x.w === itm.w
                && x.th === itm.th
                && x.f === itm.f
                && x.sa === itm.sa
                && x.su === itm.su
                && x.startAndEndTime === itm.startAndEndTime
                && x.buyTypeCode === itm.buyTypeCode
                && x.dayPart === itm.dayPart
                && x.spotLen === itm.spotLen
                && x.rateAmt === itm.rateAmt)[0].week08 = parseInt(uniqueProposal.filter(x => x.propertyName === itm.propertyName
                    && x.m === itm.m
                    && x.t === itm.t
                    && x.w === itm.w
                    && x.th === itm.th
                    && x.f === itm.f
                    && x.sa === itm.sa
                    && x.su === itm.su
                    && x.startAndEndTime === itm.startAndEndTime
                    && x.buyTypeCode === itm.buyTypeCode
                    && x.dayPart === itm.dayPart
                    && x.spotLen === itm.spotLen
                    && x.rateAmt === itm.rateAmt)[0].week08) + parseInt(itm.week08);
            uniqueProposal.filter(x => x.propertyName === itm.propertyName
                && x.m === itm.m
                && x.t === itm.t
                && x.w === itm.w
                && x.th === itm.th
                && x.f === itm.f
                && x.sa === itm.sa
                && x.su === itm.su
                && x.startAndEndTime === itm.startAndEndTime
                && x.buyTypeCode === itm.buyTypeCode
                && x.dayPart === itm.dayPart
                && x.spotLen === itm.spotLen
                && x.rateAmt === itm.rateAmt)[0].week09 = parseInt(uniqueProposal.filter(x => x.propertyName === itm.propertyName
                    && x.m === itm.m
                    && x.t === itm.t
                    && x.w === itm.w
                    && x.th === itm.th
                    && x.f === itm.f
                    && x.sa === itm.sa
                    && x.su === itm.su
                    && x.startAndEndTime === itm.startAndEndTime
                    && x.buyTypeCode === itm.buyTypeCode
                    && x.dayPart === itm.dayPart
                    && x.spotLen === itm.spotLen
                    && x.rateAmt === itm.rateAmt)[0].week09) + parseInt(itm.week09);
            uniqueProposal.filter(x => x.propertyName === itm.propertyName
                && x.m === itm.m
                && x.t === itm.t
                && x.w === itm.w
                && x.th === itm.th
                && x.f === itm.f
                && x.sa === itm.sa
                && x.su === itm.su
                && x.startAndEndTime === itm.startAndEndTime
                && x.buyTypeCode === itm.buyTypeCode
                && x.dayPart === itm.dayPart
                && x.spotLen === itm.spotLen
                && x.rateAmt === itm.rateAmt)[0].week10 = parseInt(uniqueProposal.filter(x => x.propertyName === itm.propertyName
                    && x.m === itm.m
                    && x.t === itm.t
                    && x.w === itm.w
                    && x.th === itm.th
                    && x.f === itm.f
                    && x.sa === itm.sa
                    && x.su === itm.su
                    && x.startAndEndTime === itm.startAndEndTime
                    && x.buyTypeCode === itm.buyTypeCode
                    && x.dayPart === itm.dayPart
                    && x.spotLen === itm.spotLen
                    && x.rateAmt === itm.rateAmt)[0].week10) + parseInt(itm.week10);
            uniqueProposal.filter(x => x.propertyName === itm.propertyName
                && x.m === itm.m
                && x.t === itm.t
                && x.w === itm.w
                && x.th === itm.th
                && x.f === itm.f
                && x.sa === itm.sa
                && x.su === itm.su
                && x.startAndEndTime === itm.startAndEndTime
                && x.buyTypeCode === itm.buyTypeCode
                && x.dayPart === itm.dayPart
                && x.spotLen === itm.spotLen
                && x.rateAmt === itm.rateAmt)[0].week11 = parseInt(uniqueProposal.filter(x => x.propertyName === itm.propertyName
                    && x.m === itm.m
                    && x.t === itm.t
                    && x.w === itm.w
                    && x.th === itm.th
                    && x.f === itm.f
                    && x.sa === itm.sa
                    && x.su === itm.su
                    && x.startAndEndTime === itm.startAndEndTime
                    && x.buyTypeCode === itm.buyTypeCode
                    && x.dayPart === itm.dayPart
                    && x.spotLen === itm.spotLen
                    && x.rateAmt === itm.rateAmt)[0].week11) + parseInt(itm.week11);
            uniqueProposal.filter(x => x.propertyName === itm.propertyName
                && x.m === itm.m
                && x.t === itm.t
                && x.w === itm.w
                && x.th === itm.th
                && x.f === itm.f
                && x.sa === itm.sa
                && x.su === itm.su
                && x.startAndEndTime === itm.startAndEndTime
                && x.buyTypeCode === itm.buyTypeCode
                && x.dayPart === itm.dayPart
                && x.spotLen === itm.spotLen
                && x.rateAmt === itm.rateAmt)[0].week12 = parseInt(uniqueProposal.filter(x => x.propertyName === itm.propertyName
                    && x.m === itm.m
                    && x.t === itm.t
                    && x.w === itm.w
                    && x.th === itm.th
                    && x.f === itm.f
                    && x.sa === itm.sa
                    && x.su === itm.su
                    && x.startAndEndTime === itm.startAndEndTime
                    && x.buyTypeCode === itm.buyTypeCode
                    && x.dayPart === itm.dayPart
                    && x.spotLen === itm.spotLen
                    && x.rateAmt === itm.rateAmt)[0].week12) + parseInt(itm.week12);
            uniqueProposal.filter(x => x.propertyName === itm.propertyName
                && x.m === itm.m
                && x.t === itm.t
                && x.w === itm.w
                && x.th === itm.th
                && x.f === itm.f
                && x.sa === itm.sa
                && x.su === itm.su
                && x.startAndEndTime === itm.startAndEndTime
                && x.buyTypeCode === itm.buyTypeCode
                && x.dayPart === itm.dayPart
                && x.spotLen === itm.spotLen
                && x.rateAmt === itm.rateAmt)[0].week13 = parseInt(uniqueProposal.filter(x => x.propertyName === itm.propertyName
                    && x.m === itm.m
                    && x.t === itm.t
                    && x.w === itm.w
                    && x.th === itm.th
                    && x.f === itm.f
                    && x.sa === itm.sa
                    && x.su === itm.su
                    && x.startAndEndTime === itm.startAndEndTime
                    && x.buyTypeCode === itm.buyTypeCode
                    && x.dayPart === itm.dayPart
                    && x.spotLen === itm.spotLen
                    && x.rateAmt === itm.rateAmt)[0].week13) + parseInt(itm.week13);
            uniqueProposal.filter(x => x.propertyName === itm.propertyName
                && x.m === itm.m
                && x.t === itm.t
                && x.w === itm.w
                && x.th === itm.th
                && x.f === itm.f
                && x.sa === itm.sa
                && x.su === itm.su
                && x.startAndEndTime === itm.startAndEndTime
                && x.buyTypeCode === itm.buyTypeCode
                && x.dayPart === itm.dayPart
                && x.spotLen === itm.spotLen
                && x.rateAmt === itm.rateAmt)[0].week14 = parseInt(uniqueProposal.filter(x => x.propertyName === itm.propertyName
                    && x.m === itm.m
                    && x.t === itm.t
                    && x.w === itm.w
                    && x.th === itm.th
                    && x.f === itm.f
                    && x.sa === itm.sa
                    && x.su === itm.su
                    && x.startAndEndTime === itm.startAndEndTime
                    && x.buyTypeCode === itm.buyTypeCode
                    && x.dayPart === itm.dayPart
                    && x.spotLen === itm.spotLen
                    && x.rateAmt === itm.rateAmt)[0].week14) + parseInt(itm.week14);
        }
    });
    UnMatchPropsalsJson = uniqueProposal;
}
// CheckVal Data 1- Single, 2. Multiple, 3==
function GetUniqueDataMerged(PassedJson, CheckValData) {
    var uniqueRateIds = [];
    var uniqRecord = [];
    var unique = PassedJson.filter(function (itm, i, a) {
        var rateids = { "RateId": itm.rateId}
        var index = uniqueRateIds.findIndex(x => x.RateId === itm.rateId);
        if (index < 0) {
            uniqRecord.push(itm);
            uniqueRateIds.push(rateids);
        }
        else {
            uniqRecord.filter(o => o.rateId == itm.rateId)[0].totalSpots = parseInt(uniqRecord.filter(o => o.rateId == itm.rateId)[0].totalSpots) + parseInt(itm.totalSpots);
            uniqRecord.filter(o => o.rateId == itm.rateId)[0].week01 = parseInt(uniqRecord.filter(o => o.rateId == itm.rateId)[0].week01) + parseInt(itm.week01);
            uniqRecord.filter(o => o.rateId == itm.rateId)[0].week02 = parseInt(uniqRecord.filter(o => o.rateId == itm.rateId)[0].week02) + parseInt(itm.week02);
            uniqRecord.filter(o => o.rateId == itm.rateId)[0].week03 = parseInt(uniqRecord.filter(o => o.rateId == itm.rateId)[0].week03) + parseInt(itm.week03);
            uniqRecord.filter(o => o.rateId == itm.rateId)[0].week04 = parseInt(uniqRecord.filter(o => o.rateId == itm.rateId)[0].week04) + parseInt(itm.week04);
            uniqRecord.filter(o => o.rateId == itm.rateId)[0].week05 = parseInt(uniqRecord.filter(o => o.rateId == itm.rateId)[0].week05) + parseInt(itm.week05);
            uniqRecord.filter(o => o.rateId == itm.rateId)[0].week06 = parseInt(uniqRecord.filter(o => o.rateId == itm.rateId)[0].week06) + parseInt(itm.week06);
            uniqRecord.filter(o => o.rateId == itm.rateId)[0].week07 = parseInt(uniqRecord.filter(o => o.rateId == itm.rateId)[0].week07) + parseInt(itm.week07);
            uniqRecord.filter(o => o.rateId == itm.rateId)[0].week08 = parseInt(uniqRecord.filter(o => o.rateId == itm.rateId)[0].week08) + parseInt(itm.week08);
            uniqRecord.filter(o => o.rateId == itm.rateId)[0].week09 = parseInt(uniqRecord.filter(o => o.rateId == itm.rateId)[0].week09) + parseInt(itm.week09);
            uniqRecord.filter(o => o.rateId == itm.rateId)[0].week10 = parseInt(uniqRecord.filter(o => o.rateId == itm.rateId)[0].week10) + parseInt(itm.week10);
            uniqRecord.filter(o => o.rateId == itm.rateId)[0].week11 = parseInt(uniqRecord.filter(o => o.rateId == itm.rateId)[0].week11) + parseInt(itm.week11);
            uniqRecord.filter(o => o.rateId == itm.rateId)[0].week12 = parseInt(uniqRecord.filter(o => o.rateId == itm.rateId)[0].week12) + parseInt(itm.week12);
            uniqRecord.filter(o => o.rateId == itm.rateId)[0].week13 = parseInt(uniqRecord.filter(o => o.rateId == itm.rateId)[0].week13) + parseInt(itm.week13);
            uniqRecord.filter(o => o.rateId == itm.rateId)[0].week14 = parseInt(uniqRecord.filter(o => o.rateId == itm.rateId)[0].week14) + parseInt(itm.week14);
        }
    });
    if (CheckValData == 1)
        SingleMatchPropsalsJson = uniqRecord;
    //else
    //    MultiMatchPropsalsJson = uniqRecord;
    //if (uniqueRateIds.length != PassedJson.length) {
    //    alert("Not Matching")
    //}
}
function BindSingleMatchedProperties() {
    if ($.fn.dataTable.isDataTable('#SingleMatchedProposals')) {
        $('#SingleMatchedProposals').DataTable().clear().destroy();
        $('#SingleMatchedProposals tbody').html("");
    }
    BindtableHeadher('thSingleMatchedProposals', 'tbSingleMatchedProposals');
}
function BindMultiMatchedProperties() {
    return false;
    if ($.fn.dataTable.isDataTable('#MultiMatchedProposals')) {
        $('#MultiMatchedProposals').DataTable().clear().destroy();
        $('#MultiMatchedProposals tbody').html("");
    }
    BindtableHeadherMultiple('thMultiMatchedProposals', 'tbMultiMatchedProposals');
}

function BindUnMatchedProperties() {
    return false;
    if ($.fn.dataTable.isDataTable('#UnMatchedProposals')) {
        $('#UnMatchedProposals').DataTable().clear().destroy();
        $('#UnMatchedProposals tbody').html("");
    }
    BindtableHeadher('thUnMatchedProposals', 'tbUnMatchedProposals');
}
var TableColumns = [];
function BindtableHeadher(tableHeaderName, tableBodyName) {
    let keys;
    if (SingleMatchPropsalsJson.length > 0)
        keys = Object.keys(SingleMatchPropsalsJson[0]);
    else if (MultiMatchPropsalsJson.length > 0)
        keys = Object.keys(MultiMatchPropsalsJson[0]);
    else
        keys = Object.keys(UnMatchPropsalsJson[0]);

    if (tableBodyName == "tbSingleMatchedProposals")
        currentJson = SingleMatchPropsalsJson;
    if (tableBodyName == "tbMultiMatchedProposals")
        currentJson = MultiMatchPropsalsJson;
    if (tableBodyName == "tbUnMatchedProposals")
        currentJson = UnMatchPropsalsJson;

    let columns = [];
    let columnsTitles = [];
    $.each(keys, function (i, it) {
        columns[i] = { data: it };
    });
    columnsTitles[0] = "MATCHSTYLE";
    columnsTitles[1] = "MATCHTYPE";
    columnsTitles[2] = "PROPERTYID";
    columnsTitles[3] = "RATEID";
    columnsTitles[4] = "PROPERTY NAME";
    columnsTitles[5] = "M";
    columnsTitles[6] = "T";
    columnsTitles[7] = "W";
    columnsTitles[8] = "TH";
    columnsTitles[9] = "F";
    columnsTitles[10] = "SA";
    columnsTitles[11] = "SU";
    columnsTitles[12] = "STARTTIME";
    columnsTitles[13] = "ENDTIME";
    columnsTitles[14] = "START-END";
    columnsTitles[15] = "BUYTYPEID";
    columnsTitles[16] = "BT";
    columnsTitles[17] = "DAYPARTID";
    columnsTitles[18] = "DP";
    columnsTitles[19] = "LEN";
    columnsTitles[20] = "DEMOID";
    columnsTitles[21] = "DEMO NAME";
    columnsTitles[22] = "RATE";
    columnsTitles[23] = "IMP";
    columnsTitles[24] = "CPM";
    columnsTitles[25] = "TOT EDI SPOTS";
    columnsTitles[26] = "TOT SPOTS";
    var startIndexWeek = 26;
    $("#SingleMatchedProposals .HeaderWeekDay").remove();
    $("#MultiMatchedProposals .HeaderWeekDay").remove();
    $("#UnMatchedProposals .HeaderWeekDay").remove();
    for (var x = 1; x < 15; x++) {
        var WeekDayName = (x > 9 ? "wk" : "wk0") + x.toString() + "_Date";
        let idx=parseInt(startIndexWeek) + parseInt(x);
        if (SelQtrJson[WeekDayName] != null && SelQtrJson[WeekDayName] != undefined && SelQtrJson[WeekDayName] != "") {
            columnsTitles[idx] = SelQtrJson[WeekDayName].substring(0, 10).split('-')[1] + "/" + SelQtrJson[WeekDayName].substring(0, 10).split('-')[2] + "/" + (SelQtrJson[WeekDayName].substring(0, 10).split('-')[0]).substr(2);
            var thWeek = "";
            thWeek = thWeek + "<th class='text-center align-text-top HeaderType HeaderWeekDay highZindex'>" + SelQtrJson[WeekDayName].substring(0, 10).split('-')[1] + "/" + SelQtrJson[WeekDayName].substring(0, 10).split('-')[2] + "/" + (SelQtrJson[WeekDayName].substring(0, 10).split('-')[0]).substr(2) + "</th>";
            $("#thSingleMatchedProposals tr").append(thWeek);

            $("#thMultiMatchedProposals tr").append(thWeek);

            $("#thUnMatchedProposals tr").append(thWeek);

        }
    }
    $("#thSingleMatchedProposals tr").append("<th class='text-center align-text-top HeaderType HeaderWeekDay highZindex'></th><th class='text-center align-text-top HeaderType HeaderWeekDay highZindex'></th><th class='text-center align-text-top HeaderType HeaderWeekDay highZindex'></th><th class='text-center align-text-top HeaderType HeaderWeekDay highZindex'></th>");
    $("#thMultiMatchedProposals tr").append("<th class='text-center align-text-top HeaderType HeaderWeekDay highZindex'></th><th class='text-center align-text-top HeaderType HeaderWeekDay highZindex'></th><th class='text-center align-text-top HeaderType HeaderWeekDay highZindex'></th><th class='text-center align-text-top HeaderType HeaderWeekDay highZindex'></th>");
    $("#thUnMatchedProposals tr").append("<th class='text-center align-text-top HeaderType HeaderWeekDay highZindex'></th><th class='text-center align-text-top HeaderType HeaderWeekDay highZindex'></th><th class='text-center align-text-top HeaderType HeaderWeekDay highZindex'></th><th class='text-center align-text-top HeaderType HeaderWeekDay highZindex'></th>");
    columnsTitles[41] = "EDIPROPOSALSID";
    columnsTitles[42] = "TOTALDOLLAR";
    columnsTitles[43] = "CALCDOLLAR";
    columnsTitles[44] = "CALCIMPS";

    console.log(columns);
    console.log(columnsTitles);
    //setTimeout(function () { HideOverlayPopupImport(); }, 3000);    
    initSingleMatchProposals(currentJson, columns, columnsTitles);
}

function ellipsis(cutoff, wordbreak, escapeHtml) {
    var esc = function (t) {
        return ('' + t)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    };
    return function (d, type, row) {
        // Order, search and type get the original data
        if (type !== 'display') {
            return d;
        }
        if (typeof d !== 'number' && typeof d !== 'string') {
            if (escapeHtml) {
                return esc(d);
            }
            return d;
        }
        d = d.toString(); // cast numbers
        if (d.length <= cutoff) {
            if (escapeHtml) {
                return esc(d);
            }
            return d;
        }
        var shortened = d.substr(0, cutoff - 1);
        // Find the last white space character in the string
        if (wordbreak) {
            shortened = shortened.replace(/\s([^\s]*)$/, '');
        }
        // Protect against uncontrolled HTML input
        if (escapeHtml) {
            shortened = esc(shortened);
        }
        return ('<span class="ellipsis" title="' +
            esc(d) +
            '">' +
            shortened +
            '&#8230;</span>');
    };
};
var singleMatchTable = null;
function initSingleMatchProposals(sourceData, columns, columnsTitles) {
    // Codebase.blocks('#SingleMatchedProposals', 'state_loading');
    if ($.fn.dataTable.isDataTable('#SingleMatchedProposals')) {
        // proptable = $('#SingleMatchedProposals').DataTable();
        singleMatchTable = $('#SingleMatchedProposals').DataTable().clear().destroy();
        $('#SingleMatchedProposals tbody').html("");
    }
    singleMatchTable = $('#SingleMatchedProposals').DataTable({
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
        data: sourceData,
        destroy: true,
        "aaSorting": [[4, "asc"], [16, "asc"]],
        autoWidth: false,
        columnDefs: [
            { orderable: false, targets: '_all' }

        ],
        fixedHeader: true,

        columns: [
            {
                targets: 0,
                data: "matchStyle",
                visible: false,
                searchable: false
            },
            {
                targets: 1,
                data: "matchType",
                visible: false,
                searchable: false
            },
            {
                targets: 2,
                data: "propertyId",
                visible: false,
                searchable: false
            },
            {
                targets: 3,
                data: "rateId",
                visible: false,
                searchable: false
            },
            {
                targets: 4,
                data: "propertyName",
                class: "col-8-PropName text-left",
                render: ellipsis(39, true)
                //render: function (data, type, row, meta) {
                //    if (row.hasPotentialMatch) {
                //        return "<span style='color: #42a5f5; cursor:default;'>" + ellipsis(39)(data, type, row); + "</span>";
                //    }
                //    else {
                //        return ellipsis(39)(data, type, row);
                //    }
                //}
            },
            {
                targets: 5,
                data: "dow",
                class: "text-center",
                render: function (data, type, row, meta) {
                    var dow = "";
                    if (row.m == true) {
                        dow += "M";
                    } else { dow += "-"; }
                    if (row.t == true) {
                        dow += "T";
                    } else { dow += "-"; }
                    if (row.w == true) {
                        dow += "W";
                    } else { dow += "-"; }
                    if (row.th == true) {
                        dow += "Th";
                    } else { dow += "-"; }
                    if (row.f == true) {
                        dow += "F";
                    } else { dow += "-"; }
                    if (row.sa == true) {
                        dow += "Sa";
                    } else { dow += "-"; }
                    if (row.su == true) {
                        dow += "Su";
                    } else { dow += "-"; }

                    return dow;
                }
            },
            {
                targets: 6,
                data: "t",
                visible: false,
                searchable: false
            },
            {
                targets: 7,
                data: "w",
                visible: false,
                searchable: false
            },
            {
                targets: 8,
                data: "th",
                visible: false,
                searchable: false
            },
            {
                targets: 9,
                visible: false,
                data: "f",
                searchable: false
            },
            {
                targets: 10,
                data: "sa",
                visible: false,
                searchable: false
            },
            {
                targets: 11,
                data: "su",
                visible: false,
                searchable: false
            },
            {
                targets: 12,
                data: "startTime",
                visible: false,
                searchable: false
            },
            {
                targets: 13,
                data: "endTime",
                visible: false,
                searchable: false
            },
            {
                targets: 14,
                data: "startAndEndTime",
                class: "text-center"
            },
            {
                targets: 15,
                data: "buyTypeId",
                visible: false,
                searchable: false
            },
            {
                targets: 16,
                data: "buyTypeCode",
                class: "text-center"
            },
            {
                targets: 17,
                data: "dayPartId",
                visible: false,
                searchable: false
            },
            {
                targets: 18,
                data: "dayPart",
                class: "text-center"
            },
            {
                targets: 19,
                data: "spotLen",
                class: "text-center",
                render: function (data, type, row, meta) {
                    if (data === 120) {
                        return "<span class='badge badge-pill badge-danger'>" + data + "</span>";
                    }
                    else if (data === 60) {
                        return "<span class='badge badge-pill badge-primary'>" + data + "</span>";
                    }
                    else if (data === 15) {
                        return "<span class='badge badge-pill badge-warning'>" + data + "</span>";
                    }
                    else {
                        return "<span class='badge badge-pill badge-success'>" + data + "</span>";
                    }
                }
            },
            {
                targets: 20,
                data: "demoId",
                visible: false,
                searchable: false
            },
            {
                targets: 21,
                data: "demoName",
                width: 100,
                class: "text-center",
                render: ellipsis(33, true)
            },
            {
                targets: 22,
                data: "rateAmt",
                class: "text-left",
                render: $.fn.dataTable.render.number(',', '.', 2, '$')
            },
            {
                targets: 23,
                data: "impressions",
                class: ".col-28-Impressions text-left",
                render: $.fn.dataTable.render.number(',', '.', 2, '')
            },
            {
                targets: 24, /* CPM */
                data: "cpm",
                class: "text-left",
                render: $.fn.dataTable.render.number(',', '.', 2, '$')

            },
            {
                targets: 25,
                data: "totalEDISpots",
                visible: false,
                searchable: false
            },
            {
                targets: 26,
                width: "105px",
                class: "text-center",
                data: "totalSpots",
                searchable: false,
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }

            },
            {
                targets: [27],
                data: "week01",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [28],
                data: "week02",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [29],
                data: "week03",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [30],
                data: "week04",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [31],
                data: "week05",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [32],
                data: "week06",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [33],
                data: "week07",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [34],
                data: "week08",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [35],
                data: "week09",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [36],
                data: "week10",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [37],
                data: "week11",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '<span style="min-width:130px;"></span>';
                    else
                        return '<span style="min-width:130px;">' + data + '</span>';
                }
            },
            {
                targets: [38],
                data: "week12",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [39],
                data: "week13",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [40],
                data: "week14",
                class: "text-center",
                width: "105px",
                visible: (columnsTitles[40] == null || columnsTitles[40] == undefined || columnsTitles[40] == "") === true ? false : true,
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },

            {
                targets: [41],
                data: "ediProposalsID",
                visible: false
            },
            {
                targets: [42],
                data: "totalDollar",
                visible: false
            },
            {
                targets: [43],
                data: "calcDollar",
                visible: false
            },
            {
                targets: [44],
                data: "calcImps",
                visible: false
            }
        ],
        createdRow: function (row, data, dataIndex) {
            if (data.hasPotentialMatch)
                $('td:eq(0)', row).addClass("potential-match");
            if (data.isFullyActualized) {
                $(row).addClass("fully-actualized");           
                $($(row).find("td")).addClass("fully-actualized-text");
            }
        },       
        "fnDrawCallback": function () {
            //$('#SingleMatchedProposals_info').prepend($('#SingleMatchedProposals_length'));   
        },
        initComplete: function (settings, json) {
            setTimeout(function () {
                initMultiMatchProposals(MultiMatchPropsalsJson, columns, columnsTitles)
            }, 1000);
        },
        scrollX: false,
        scrollCollapse: false
    });
   
    //$(".col-md-7").css({ 'z-index': '-1' });
    $("#SingleMatchedProposals_length").css({ 'position': 'absolute', 'z-index': '1000', 'margin-top': $("#SingleMatchedProposals").height() + 70, 'margin-left': '1280px' });    
    $("#SingleMatchedProposals_info").css("margin-left", "2520px");   
    if ($("#SingleMatchedProposals_paginate").width() > 300) {
        $("#SingleMatchedProposals_paginate").css("margin-right", "2420px");
    }
    else {
        $("#SingleMatchedProposals_paginate").css("margin-right", "2475px");
    }    
    //$("#SingleMatchedProposals_paginate").css("float", "left");
    //$("#SingleMatchedProposals_paginate").css("margin-left", "-1180px");
    //$("#SingleMatchedProposals_length").css("margin-left", "-1230px");
    singleMatchTable.on('length', function (e, settings, len) {
        setTimeout(function () {
            $("#SingleMatchedProposals_length").css({ 'position': 'absolute', 'z-index': '1000', 'margin-top': $("#SingleMatchedProposals").height() + 70, 'margin-left': '1280px' });
        }, 100);        
    });
    $("#SingleMatchedProposals_paginate").on('click', function (e, settings, len) {
        setTimeout(function () {
            $("#SingleMatchedProposals_length").css({ 'position': 'absolute', 'z-index': '1000', 'margin-top': $("#SingleMatchedProposals").height() + 70, 'margin-left': '1280px' });
        }, 100);
    });
}


function initMultiMatchProposals(sourceData, columns, columnsTitles) {
    if ($.fn.dataTable.isDataTable('#MultiMatchedProposals')) {
        $('#MultiMatchedProposals').DataTable().clear().destroy();
        $('#MultiMatchedProposals tbody').html("");
    }
    $('#MultiMatchedProposals').DataTable({
        destroy: true,
        processing: true,
        "bAutoWidth": false,
        paging: false,
        "bSort": false,
        // columns: columns,
        data: sourceData,
        "lengthMenu": [[sourceData.length], [sourceData.length]],
        "pageLength": sourceData.length,
        //columnDefs: [
        //    {
        //        defaultContent: "",
        //        targets: "_all"
        //    },
        columns: [
            {
                targets: 0,
                data: "matchStyle",
                visible: false,
                searchable: false
            },
            {
                targets: 1,
                data: "matchType",
                visible: false,
                searchable: false
            },
            {
                targets: 2,
                data: "propertyId",
                visible: false,
                searchable: false
            },
            {
                targets: 3,
                data: "rateId",
                visible: false,
                searchable: false
            },
            {
                targets: 4,
                data: "propertyName",
                width: 400,
                class: "col-8-PropName text-left",
                render: ellipsis(39, true)
                //render: function (data, type, row, meta) {
                //    if (row.hasPotentialMatch) {
                //        return "<span style='color: #42a5f5; cursor:default;'>" + ellipsis(39)(data, type, row); + "</span>";
                //    }
                //    else {
                //        return ellipsis(39)(data, type, row);
                //    }
                //}
            },
            {
                targets: 5,
                data: "dow",
                width: 165,
                class: "text-center",
                render: function (data, type, row, meta) {
                    var dow = "";
                    if (row.demoName != "") {
                        if (row.m == true) {
                            dow += "M";
                        } else { dow += "-"; }
                        if (row.t == true) {
                            dow += "T";
                        } else { dow += "-"; }
                        if (row.w == true) {
                            dow += "W";
                        } else { dow += "-"; }
                        if (row.th == true) {
                            dow += "Th";
                        } else { dow += "-"; }
                        if (row.f == true) {
                            dow += "F";
                        } else { dow += "-"; }
                        if (row.sa == true) {
                            dow += "Sa";
                        } else { dow += "-"; }
                        if (row.su == true) {
                            dow += "Su";
                        } else { dow += "-"; }

                    }
                    else {
                        dow = "";
                    }
                    return dow;
                }
            },
            {
                targets: 6,
                data: "t",
                visible: false,
                searchable: false
            },
            {
                targets: 7,
                data: "w",
                visible: false,
                searchable: false
            },
            {
                targets: 8,
                data: "th",
                visible: false,
                searchable: false
            },
            {
                targets: 9,
                visible: false,
                data: "f",
                searchable: false
            },
            {
                targets: 10,
                data: "sa",
                visible: false,
                searchable: false
            },
            {
                targets: 11,
                data: "su",
                visible: false,
                searchable: false
            },
            {
                targets: 12,
                data: "startTime",
                visible: false,
                searchable: false
            },
            {
                targets: 13,
                data: "endTime",
                visible: false,
                searchable: false
            },
            {
                targets: 14,
                width: 120,
                data: "startAndEndTime",
                class: "text-center"
            },
            {
                targets: 15,
                data: "buyTypeId",
                visible: false,
                searchable: false
            },
            {
                targets: 16,
                width: 25,
                data: "buyTypeCode",
                class: "text-center"
            },
            {
                targets: 17,
                data: "dayPartId",
                visible: false,
                searchable: false
            },
            {
                targets: 18,
                data: "dayPart",
                width: 25,
                class: "text-center"
            },
            {
                targets: 19,
                data: "spotLen",
                width: 50,
                class: "text-center",
                render: function (data, type, row, meta) {
                    if (row.demoName != "") {
                        if (data === 120) {
                            return "<span class='badge badge-pill badge-danger'>" + data + "</span>";
                        }
                        else if (data === 60) {
                            return "<span class='badge badge-pill badge-primary'>" + data + "</span>";
                        }
                        else if (data === 15) {
                            return "<span class='badge badge-pill badge-warning'>" + data + "</span>";
                        }
                        else {
                            return "<span class='badge badge-pill badge-success'>" + data + "</span>";
                        }
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                targets: 20,
                data: "demoId",
                visible: false,
                searchable: false
            },
            {
                targets: 21,
                data: "demoName",
                width:100,
                class: "text-center",
                render: ellipsis(33, true)
            },
            {
                targets: 22,
                width: 80,
                data: "rateAmt",
                class: "text-left",
                render: function (data, type, row, meta) {
                    if (row.demoName != "") {
                        return $.fn.dataTable.render.number(',', '.', 2, '$').display(data);
                    }
                    else {
                        return "";
                    }
                }
                //render: $.fn.dataTable.render.number(',', '.', 2, '$')
            },
            {
                targets: 23,
                width: 80,
                data: "impressions",
                class: ".col-28-Impressions text-left",
                //render: $.fn.dataTable.render.number(',', '.', 2, '')
                render: function (data, type, row, meta) {
                    if (row.demoName != "") {
                        return $.fn.dataTable.render.number(',', '.', 2, '').display(data);
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                targets: 24, /* CPM */
                width: 80,
                data: "cpm",
                class: "text-left",
                //render: $.fn.dataTable.render.number(',', '.', 2, '$')
                render: function (data, type, row, meta) {
                    if (row.demoName != "") {
                        return $.fn.dataTable.render.number(',', '.', 2, '$').display(data);
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                targets: 25,
                class: "",
                data: "totalEDISpots",
                width: 100,
                searchable: false,
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: 26,
                visible: false,
                width: "105px",
                data: "totalSpots",
                searchable: false,
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [27],
                data: "week01",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (row.demoName == "") {
                        if (data == 0)
                            return '';
                        else
                            return data;
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                targets: [28],
                data: "week02",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (row.demoName == "") {
                        if (data == 0)
                            return '';
                        else
                            return data;
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                targets: [29],
                data: "week03",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (row.demoName == "") {
                        if (data == 0)
                            return '';
                        else
                            return data;
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                targets: [30],
                data: "week04",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (row.demoName == "") {
                        if (data == 0)
                            return '';
                        else
                            return data;
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                targets: [31],
                data: "week05",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (row.demoName == "") {
                        if (data == 0)
                            return '';
                        else
                            return data;
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                targets: [32],
                data: "week06",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (row.demoName == "") {
                        if (data == 0)
                            return '';
                        else
                            return data;
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                targets: [33],
                data: "week07",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (row.demoName == "") {
                        if (data == 0)
                            return '';
                        else
                            return data;
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                targets: [34],
                data: "week08",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (row.demoName == "") {
                        if (data == 0)
                            return '';
                        else
                            return data;
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                targets: [35],
                data: "week09",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (row.demoName == "") {
                        if (data == 0)
                            return '';
                        else
                            return data;
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                targets: [36],
                data: "week10",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (row.demoName == "") {
                        if (data == 0)
                            return '';
                        else
                            return data;
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                targets: [37],
                data: "week11",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (row.demoName == "") {
                        if (data == 0)
                            return '';
                        else
                            return data;
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                targets: [38],
                data: "week12",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (row.demoName == "") {
                        if (data == 0)
                            return '';
                        else
                            return data;
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                targets: [39],
                data: "week13",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (row.demoName == "") {
                        if (data == 0)
                            return '';
                        else
                            return data;
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                targets: [40],
                data: "week14",
                class: "text-center",
                width: "105px",
                visible: (columnsTitles[40] == null || columnsTitles[40] == undefined || columnsTitles[40] == "") === true ? false : true,
                render: function (data, type, row, meta) {
                    if (row.demoName == "") {
                        if (data == 0)
                            return '';
                        else
                            return data;
                    }
                    else {
                        return "";
                    }
                }
            },

            {
                targets: [41],
                data: "ediProposalsID",
                visible: false
            },
            {
                targets: [42],
                data: "totalDollar",
                visible: false
            },
            {
                targets: [43],
                data: "calcDollar",
                visible: false
            },
            {
                targets: [44],
                data: "calcImps",
                visible: false
            }
        ],
        createdRow: function (row, data, dataIndex) { // hunain.manzoor  start
            if (data.demoName == "") {
                $(row).addClass("blankmultirow");
                $('td:eq(0)', row).text("");
                $('td:eq(0)', row).css("border-right", "transparent");
                $('td:eq(1)', row).css("border-right", "transparent");
                $('td:eq(2)', row).css("border-right", "transparent");
                $('td:eq(3)', row).css("border-right", "transparent");
                $('td:eq(4)', row).css("border-right", "transparent");
                $('td:eq(5)', row).css("border-right", "transparent");
                $('td:eq(5)', row).text("Network Spot Totals");
                $('td:eq(5)', row).css("font-weight", 700);
                $('td:eq(6)', row).css("font-size", "12.5px");
                $('td:eq(6)', row).css("border-right", "transparent");

                $('td:eq(7)', row).css("border-right", "transparent");
                $('td:eq(8)', row).css("border-right", "transparent");
                $('td:eq(9)', row).css("border-right", "transparent");
                $('td:eq(10)', row).text("");
            }
            else {
                if (data.hasPotentialMatch)
                    $('td:eq(0)', row).addClass("potential-match");
                if (data.isFullyActualized) {
                    $(row).addClass("fully-actualized");
                    $($(row).find("td")).addClass("fully-actualized-text");
                }
            }
        }, // hunain.manzoor  end
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            if (StartEDIIdMulti == 0) {
                StartEDIIdMulti = aData.ediProposalsID;
                SelColorMulti = primarycolorMulti;
            }
            else {

                if (StartEDIIdMulti != aData.ediProposalsID) {
                    StartEDIIdMulti = aData.ediProposalsID;
                    if (SelColorMulti == primarycolorMulti)
                        SelColorMulti = secondaryColorMulti;
                    else
                        SelColorMulti = primarycolorMulti;
                }
            }
            $($(nRow).find("td")[10]).addClass("cls_" + aData.ediProposalsID + '_edispotsimport');
            $(nRow).css("background-color", SelColorMulti);
        },

        initComplete: function (settings, json) {
            setTimeout(function () {
                MergeMultiMatchCells();
                // $("blankmultirow")
                initUnMatchProposals(UnMatchPropsalsJson, columns, columnsTitles);
            }, 1000);
        },
        scrollX: false,
        scrollCollapse: false
    });    
    var filteredMultiMatchDataLength = sourceData.filter(a => a.propertyName != 'Network Spot Totals').length;
    var conditionalStartingCount = filteredMultiMatchDataLength == 0 ? "0" : "1";
    $("#MultiMatchedProposals_info").text("Showing " + conditionalStartingCount  + " to " + filteredMultiMatchDataLength + " of " + filteredMultiMatchDataLength + " entries");
    $("#MultiMatchedProposals_info").css("float", "right");
    $("#MultiMatchedProposals_info").css("margin-right", "-1580px");
    $("#MultiMatchedProposals_paginate").css("float", "left");
    $("#MultiMatchedProposals_paginate").css("margin-left", "-1180px");
}

function MergeMultiMatchCells() {
    ImportMismatchProposalArray = new Array();
    if (MultiMatchPropsalsJson != null && MultiMatchPropsalsJson != undefined && MultiMatchPropsalsJson.length > 0) {
        ImportUniquePropsalIds = [];
        var Importunique = MultiMatchPropsalsJson.filter(function (itm, i, a) {
            var ImportpropId = { "EDIPropId": itm.ediProposalsID }
            var Importindex = ImportUniquePropsalIds.findIndex(x => x.EDIPropId === itm.ediProposalsID);
            if (Importindex < 0) {
                ImportUniquePropsalIds.push(ImportpropId);
            }
        });
        //console.log(PropsalIds);
        for (var m = 0; m < ImportUniquePropsalIds.length; m++) {

            $($(".cls_" + ImportUniquePropsalIds[m].EDIPropId + "_edispotsimport")).hide();
            $($(".cls_" + ImportUniquePropsalIds[m].EDIPropId + "_edispotsimport")[0]).show();
            $($(".cls_" + ImportUniquePropsalIds[m].EDIPropId + "_edispotsimport")[1]).show();
            $($(".cls_" + ImportUniquePropsalIds[m].EDIPropId + "_edispotsimport")[1]).attr("rowspan", $(".cls_" + ImportUniquePropsalIds[m].EDIPropId + "_edispotsimport").length - 1);
            $($(".cls_" + ImportUniquePropsalIds[m].EDIPropId + "_edispotsimport")[1]).addClass("text-center");
            //$($(".cls_" + ImportUniquePropsalIds[m].EDIPropId + "_edispotsimport")[1]).remove();
            //for (var j = 1; x < $(".cls_" + ImportUniquePropsalIds[m].EDIPropId + "_edispotsimport").length; j++) {
            //    $($(".cls_" + ImportUniquePropsalIds[m].EDIPropId + "_edispotsimport")[j]).remove();
            //}
        }
        var blankRows = $('.blankmultirow');
        for (var j = 0; j < blankRows.length; j++) {
            $($(blankRows[j]).find("td")[5]).attr("colspan", "2");
            $($(blankRows[j]).find("td")[6]).hide();
        }
    }

}
var unMatchTable = null;
function initUnMatchProposals(sourceData, columns, columnsTitles) {
    if ($.fn.dataTable.isDataTable('#UnMatchedProposals')) {
        $('#UnMatchedProposals').DataTable().clear().destroy();
        $('#UnMatchedProposals tbody').html("");
    }
    proptable = $('#UnMatchedProposals').DataTable({
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],        
        data: sourceData,
        destroy: true,
        autoWidth: false,
        columnDefs: [
            { orderable: false, targets: '_all' }
        ],
        fixedHeader: true,
        createdRow: function (row, data, dataIndex) { 
            if (data.hasPotentialMatch && data.potentialMatchBGClass !== null && data.potentialMatchBGClass !== undefined && data.potentialMatchBGClass !== "") {
                $(row).addClass(data.potentialMatchBGClass);
            }
            if (data.isFullyActualized && data.FullyActuaizedBGClass !== null && data.FullyActuaizedBGClass !== undefined && data.FullyActuaizedBGClass !== "") {
                $(row).addClass(data.FullyActuaizedBGClass);
            }
        }, 
        columns: [
            {
                targets: 0,
                data: "matchStyle",
                visible: false,
                searchable: false
            },
            {
                targets: 1,
                data: "matchType",
                visible: false,
                searchable: false
            },
            {
                targets: 2,
                data: "propertyId",
                visible: false,
                searchable: false
            },
            {
                targets: 3,
                data: "rateId",
                visible: false,
                searchable: false
            },
            {
                targets: 4,
                data: "propertyName",
                class: "col-8-PropName text-left",
                //render: ellipsis(39, true)
                render: function (data, type, row, meta) {
                    if (row.hasPotentialMatch) {
                        return "<span style='color: #42a5f5;text-decoration: underline; cursor:pointer;'  title='Show Potential Matches' tooltip='Show Potential Matches' onclick='return OpenPotentialMatches(" + row.ediProposalsID + ");'>" + ellipsis(39)(data, type, row); + "</span>";
                    }
                    else {
                        return ellipsis(39)(data, type, row);
                    }
                }
            },
            {
                targets: 5,
                data: "dow",
                class: "text-center",
                render: function (data, type, row, meta) {
                    var dow = "";
                    if (row.m == true) {
                        dow += "M";
                    } else { dow += "-"; }
                    if (row.t == true) {
                        dow += "T";
                    } else { dow += "-"; }
                    if (row.w == true) {
                        dow += "W";
                    } else { dow += "-"; }
                    if (row.th == true) {
                        dow += "Th";
                    } else { dow += "-"; }
                    if (row.f == true) {
                        dow += "F";
                    } else { dow += "-"; }
                    if (row.sa == true) {
                        dow += "Sa";
                    } else { dow += "-"; }
                    if (row.su == true) {
                        dow += "Su";
                    } else { dow += "-"; }

                    return dow;
                }
            },
            {
                targets: 6,
                data: "t",
                visible: false,
                searchable: false
            },
            {
                targets: 7,
                data: "w",
                visible: false,
                searchable: false
            },
            {
                targets: 8,
                data: "th",
                visible: false,
                searchable: false
            },
            {
                targets: 9,
                visible: false,
                data: "f",
                searchable: false
            },
            {
                targets: 10,
                data: "sa",
                visible: false,
                searchable: false
            },
            {
                targets: 11,
                data: "su",
                visible: false,
                searchable: false
            },
            {
                targets: 12,
                data: "startTime",
                visible: false,
                searchable: false
            },
            {
                targets: 13,
                data: "endTime",
                visible: false,
                searchable: false
            },
            {
                targets: 14,
                data: "startAndEndTime",
                class: "text-center"
            },
            {
                targets: 15,
                data: "buyTypeId",
                visible: false,
                searchable: false
            },
            {
                targets: 16,
                data: "buyTypeCode",
                class: "text-center"
            },
            {
                targets: 17,
                data: "dayPartId",
                visible: false,
                searchable: false
            },
            {
                targets: 18,
                data: "dayPart",
                class: "text-center"
            },
            {
                targets: 19,
                data: "spotLen",
                class: "text-center",
                render: function (data, type, row, meta) {
                    if (data === 120) {
                        return "<span class='badge badge-pill badge-danger'>" + data + "</span>";
                    }
                    else if (data === 60) {
                        return "<span class='badge badge-pill badge-primary'>" + data + "</span>";
                    }
                    else if (data === 15) {
                        return "<span class='badge badge-pill badge-warning'>" + data + "</span>";
                    }
                    else {
                        return "<span class='badge badge-pill badge-success'>" + data + "</span>";
                    }
                }
            },
            {
                targets: 20,
                data: "demoId",
                visible: false,
                searchable: false
            },
            {
                targets: 21,
                width:100,
                data: "demoName",
                class: " text-center",
                render: ellipsis(33, true)
            },
            {
                targets: 22,
                data: "rateAmt",
                class: "text-left",
                render: $.fn.dataTable.render.number(',', '.', 2, '$')
            },
            {
                targets: 23,
                data: "impressions",
                class: ".col-28-Impressions text-left",
                render: $.fn.dataTable.render.number(',', '.', 2, '')
            },
            {
                targets: 24, /* CPM */
                data: "cpm",
                class: "text-left",
                render: $.fn.dataTable.render.number(',', '.', 2, '$')

            },
            {
                targets: 25,
                data: "totalEDISpots",
                visible: false,
                searchable: false
            },
            {
                targets: 26,
                class: "text-center",
                width: "105px",
                data: "totalSpots",
                searchable: false,
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [27],
                data: "week01",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [28],
                data: "week02",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [29],
                data: "week03",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [30],
                data: "week04",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [31],
                data: "week05",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [32],
                data: "week06",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [33],
                data: "week07",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [34],
                data: "week08",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [35],
                data: "week09",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [36],
                data: "week10",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [37],
                data: "week11",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '<span style="min-width:130px;"></span>';
                    else
                        return '<span style="min-width:130px;">' + data + '</span>';
                }
            },
            {
                targets: [38],
                data: "week12",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [39],
                data: "week13",
                class: "text-center",
                width: "105px",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [40],
                data: "week14",
                class: "text-center",
                width: "105px",
                visible: (columnsTitles[40] == null || columnsTitles[40] == undefined || columnsTitles[40] == "") === true ? false : true,
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },

            {
                targets: [41],
                data: "ediProposalsID",
                visible: false
            },
            {
                targets: [42],
                data: "totalDollar",
                visible: false
            },
            {
                targets: [43],
                data: "calcDollar",
                visible: false
            },
            {
                targets: [44],
                data: "calcImps",
                visible: false
            }
        ],
        createdRow: function (row, data, dataIndex) {
            if (data.hasPotentialMatch)
                $('td:eq(0)', row).addClass("potential-match");
            if (data.isFullyActualized) {
                $(row).addClass("fully-actualized");
                $($(row).find("td")).addClass("fully-actualized-text");
            }
        },
        "fnDrawCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
           // $('#UnMatchedProposals_info').prepend($('#UnMatchedProposals_length'));
        },
        initComplete: function (settings, json) {
            setTimeout(function () {
                $(".dataTables_scrollBody thead").hide();
                BindTotals();
            }, 1000);
        },
        scrollX: false,
        scrollCollapse: false
    });
    unMatchTable = proptable;
    $("#UnMatchedProposals_length").css({ 'position': 'absolute', 'z-index': '1000', 'margin-top': $("#UnMatchedProposals").height() + 70, 'margin-left': '1280px' });
    $("#UnMatchedProposals_info").css("margin-left", "2520px");
    if ($("#UnMatchedProposals_paginate").width() > 300) {
        $("#UnMatchedProposals_paginate").css("margin-right", "2420px"); 
    }
    else {
        $("#UnMatchedProposals_paginate").css("margin-right", "2475px"); 
    }    
    //$(".col-md-7").css({ 'z-index': '-1' });
    //$("#UnMatchedProposals_info").css("float", "right");
    //$("#UnMatchedProposals_info").css("margin-right", "-1580px");
    //$("#UnMatchedProposals_paginate").css("float", "left");
    //$("#UnMatchedProposals_paginate").css("margin-left", "-1180px");
    //$("#UnMatchedProposals_length").css("margin-left", "-1230px");
    var width = $("#UnMatchedProposals_paginate").width();
    unMatchTable.on('length', function (e, settings, len) {
        setTimeout(function () {
            $("#UnMatchedProposals_length").css({ 'position': 'absolute', 'z-index': '1000', 'margin-top': $("#UnMatchedProposals").height() + 70, 'margin-left': '1280px' });
        }, 100);

       
    });
    $("#UnMatchedProposals_paginate").on('click', function (e, settings, len) {
        setTimeout(function () {
            $("#UnMatchedProposals_length").css({ 'position': 'absolute', 'z-index': '1000', 'margin-top': $("#UnMatchedProposals").height() + 70, 'margin-left': '1280px' });
        }, 100);

    });
}

function BindTotals() {
    var HTMLTotals = "";
    HTMLTotals = HTMLTotals + '<tr>';
    HTMLTotals = HTMLTotals + '<th class="totalcell" style="text-align:center;width:229px;">TOTALS</th>';
    HTMLTotals = HTMLTotals + '<th class="totalcell" style="text-align:center;width:100px;">' + SelQtrJson.quarterName + '</th>';

    for (var x = 1; x < 15; x++) {
        var WeekDayName = (x > 9 ? "wk" : "wk0") + x.toString() + "_Date";

        if (SelQtrJson[WeekDayName] != null && SelQtrJson[WeekDayName] != undefined && SelQtrJson[WeekDayName] != "") {
            HTMLTotals = HTMLTotals + '<th class="totalcell" style="text-align:center; width:105px;">' + SelQtrJson[WeekDayName].substring(0, 10).split('-')[1] + "/" + SelQtrJson[WeekDayName].substring(0, 10).split('-')[2] + "/" + (SelQtrJson[WeekDayName].substring(0, 10).split('-')[0]).substr(2) + '</th>';
        }
    }
    HTMLTotals = HTMLTotals + '</tr>';
    $("#thTotalData").html(HTMLTotals);

    BindTotalBody();
}

function BindTotalBody() {
    //return false;
    var _selCountryid = 5;
    if ($('#US').is(':checked')) {
        _selCountryid = 5;
    }
    else if ($('#CA').is(':checked')) {
        _selCountryid = 2;
    }
    var _selClientid = $("#ddlclients :selected").val();
    //alert(_selClientid);
    var _selQtr = ($(".nav-link.active").html().split(' ')[0]).toString().substring(2, 1) + "Q" + $(".nav-link.active").html().split(' ')[1];
    // alert(_selQtr);
    $.ajax({
        url: '/ScheduleProposal/GetImportProposals',
        type: "GET",
        async: false,
        data: {
            "ClientId": _selClientid,
            "QuarterName": _selQtr,
            "NetworkId": currentJsonSelectedForImport[currentFileIndex].networkId,
            "SourceFileName": currentJsonSelectedForImport[currentFileIndex].sourceFile,
            "FileAction": currentJsonSelectedForImport[currentFileIndex].selectionType,
            "CountryId": _selCountryid,
            "ShowTotals": true
        },
        success: function (result) {
            ProposalTotalJson = result.totalSection;
            //BindTotalDataTable(ProposalTotalJson);
            CalculateTotalPotentialMatch();
        },
        error: function (response) {
        }
    });
}

function BindTotalDataTable(content) {
    var HTMLTotals = "";
    for (var i = 0; i < content.length; i++) {
        HTMLTotals = HTMLTotals + '<tr>';
        if (i == 0) {
            HTMLTotals = HTMLTotals + '<td colspan="16" class="text-center" style="font-weight:bold;background-color: #e5e5e5;opacity:0.5color:#FFF!important;padding: 10px;vertical-align: middle;">' + content[i].propertyName + '</td>';
            continue;
        }
        if (i == 5) {
            HTMLTotals = HTMLTotals + '<td colspan="16" class="text-center" style="font-weight:bold;background-color: #e2e5d1;color:#000;padding: 10px;vertical-align: middle;">' + content[i].propertyName + '</td>';
            continue;
        }
        HTMLTotals = HTMLTotals + '<td class="text-center totalcell" style="padding:1px;font-weight:bold;text-align:center;">' + content[i].propertyName.toUpperCase() + '</td>';
        if (i == 1) {
            if (content[i].totalSpots>0)
                HTMLTotals = HTMLTotals + '<td class="text-center totalcell" style="padding:1px;">' + $.fn.dataTable.render.number(',', '.', 0, '').display(content[i].totalSpots) + '</td>';
            else
                HTMLTotals = HTMLTotals + '<td class="text-center totalcell" style="padding:1px;"></td>';
        }
        else if (i == 2 || i == 6) {

            if (parseFloat(content[2].totalSpots).toFixed(2) != parseFloat(content[6].totalSpots).toFixed(2)) {
                HTMLTotals = HTMLTotals + '<td class="text-center totalcell" style="padding:1px;color:red;">' + $.fn.dataTable.render.number(',', '.', 2, '$').display(content[i].totalSpots) + '</td>';
            }
            else {
                HTMLTotals = HTMLTotals + '<td class="text-center totalcell" style="padding:1px;">' + $.fn.dataTable.render.number(',', '.', 2, '$').display(content[i].totalSpots) + '</td>';
            }
        }
        else if (i == 3 || i == 7) {
            if (parseFloat(content[3].totalSpots).toFixed(2) != parseFloat(content[7].totalSpots).toFixed(2)) {
                HTMLTotals = HTMLTotals + '<td class="text-center totalcell" style="padding:1px;color:red;">' + $.fn.dataTable.render.number(',', '.', 2, '$').display(content[i].totalSpots) + '</td>';
            }
            else {
                HTMLTotals = HTMLTotals + '<td class="text-center totalcell" style="padding:1px;">' + $.fn.dataTable.render.number(',', '.', 2, '$').display(content[i].totalSpots) + '</td>';
            }
        }
        else if (i == 4 || i == 8) {

            if (parseFloat(content[4].totalSpots).toFixed(2) != parseFloat(content[8].totalSpots).toFixed(2)) {
                HTMLTotals = HTMLTotals + '<td class="text-center totalcell" style="padding:1px;color:red;">' + $.fn.dataTable.render.number(',', '.', 2, '').display(content[i].totalSpots) + '</td>';
            }
            else {
                HTMLTotals = HTMLTotals + '<td class="text-center totalcell" style="padding:1px;">' + $.fn.dataTable.render.number(',', '.', 2, '').display(content[i].totalSpots) + '</td>';
            }
        }
        else {
            //|| parseFloat(content[3].totalSpots).toFixed(2) != parseFloat(content[7].totalSpots).toFixed(2)
            if (parseFloat(content[2].totalSpots).toFixed(2) != parseFloat(content[6].totalSpots).toFixed(2) ) {
                HTMLTotals = HTMLTotals + '<td class="text-center totalcell" style="padding:1px;color:red;">' + $.fn.dataTable.render.number(',', '.', 2, '$').display(content[i].totalSpots) + '</td>';
            }
            else {
                HTMLTotals = HTMLTotals + '<td class="text-center totalcell" style="padding:1px;">' + $.fn.dataTable.render.number(',', '.', 2, '$').display(content[i].totalSpots) + '</td>';
            }
        }
        for (var x = 1; x < 15; x++) {
            var WeekDayName = (x > 9 ? "wk" : "wk0") + x.toString() + "_Date";
            var FinalWeekDayName = (x > 9 ? "week" : "week0") + x.toString();

            if (SelQtrJson[WeekDayName] != null && SelQtrJson[WeekDayName] != undefined && SelQtrJson[WeekDayName] != "") {
                if (i == 1) {
                    if (parseInt(content[i][FinalWeekDayName]) > 0)
                        HTMLTotals = HTMLTotals + '<td class="text-center totalcell" style="padding:1px;">' + $.fn.dataTable.render.number(',', '.', 0, '').display(content[i][FinalWeekDayName]) + '</td>';
                    else
                        HTMLTotals = HTMLTotals + '<td class="text-center totalcell" style="padding:1px;"></td>';
                }
                else if (i == 2 || i == 6) {
                    if (parseFloat(content[2][FinalWeekDayName]).toFixed(2) != parseFloat(content[6][FinalWeekDayName]).toFixed(2)) {
                        HTMLTotals = HTMLTotals + '<td class="text-center totalcell" style="padding:1px;color:red;">' + $.fn.dataTable.render.number(',', '.', 2, '$').display(content[i][FinalWeekDayName]) + '</td>';
                    }
                    else {
                        HTMLTotals = HTMLTotals + '<td class="text-center totalcell" style="padding:1px;">' + $.fn.dataTable.render.number(',', '.', 2, '$').display(content[i][FinalWeekDayName]) + '</td>';
                    }
                }
                else if (i == 3 || i == 7) {
                    if (parseFloat(content[3][FinalWeekDayName]).toFixed(2) != parseFloat(content[7][FinalWeekDayName]).toFixed(2)) {
                        HTMLTotals = HTMLTotals + '<td class="text-center totalcell" style="padding:1px;color:red;">' + $.fn.dataTable.render.number(',', '.', 2, '$').display(content[i][FinalWeekDayName]) + '</td>';
                    }
                    else {
                        HTMLTotals = HTMLTotals + '<td class="text-center totalcell" style="padding:1px;">' + $.fn.dataTable.render.number(',', '.', 2, '$').display(content[i][FinalWeekDayName]) + '</td>';
                    }
                }
                else if (i == 4 || i == 8) {
                    if (parseFloat(content[4][FinalWeekDayName]).toFixed(2) != parseFloat(content[8][FinalWeekDayName]).toFixed(2)) {
                        HTMLTotals = HTMLTotals + '<td class="text-center totalcell" style="padding:1px;color:red;">' + $.fn.dataTable.render.number(',', '.', 2, '').display(content[i][FinalWeekDayName]) + '</td>';
                    }
                    else {
                        HTMLTotals = HTMLTotals + '<td class="text-center totalcell" style="padding:1px;">' + $.fn.dataTable.render.number(',', '.', 2, '').display(content[i][FinalWeekDayName]) + '</td>';
                    }
                }
                else {
                    if (parseFloat(content[2][FinalWeekDayName]).toFixed(2) != parseFloat(content[6][FinalWeekDayName]).toFixed(2) || parseFloat(content[3][FinalWeekDayName]).toFixed(2) != parseFloat(content[7][FinalWeekDayName]).toFixed(2)) {
                        HTMLTotals = HTMLTotals + '<td class="text-center totalcell" style="padding:1px;color:red;">' + $.fn.dataTable.render.number(',', '.', 2, '$').display(content[i][FinalWeekDayName]) + '</td>';
                    }
                    else {
                        HTMLTotals = HTMLTotals + '<td class="text-center totalcell" style="padding:1px;">' + $.fn.dataTable.render.number(',', '.', 2, '$').display(content[i][FinalWeekDayName]) + '</td>';
                    }
                }
            }
        }
        HTMLTotals = HTMLTotals + '</tr>';
    }
    $("#tbTotalData").html(HTMLTotals);
    //$(".propheading").css("width", $("#SingleMatchedProposals").css("width"));
    //$("#divTotalSectionData").css("width", $("#SingleMatchedProposals").css("width"));
    //Setting Popup height
    $("#modal-ImportUnAllocatedProposals").height(window.innerHeight - 50);
    $("#modal-ImportUnAllocatedProposals .block-content").css("max-height", $(window).height() - 200);
    $("#modal-ImportUnAllocatedProposals .block-content").height($(window).height() - 150);
    $("#modal-ImportUnAllocatedProposals.block-content").parent().height($(window).height() - 150);
    setTimeout(function () { $("#modal-ImportUnAllocatedProposals .block-content").scrollLeft(0); }, 3000);
    $(".dataTables_scrollBody thead").hide();
    $(".propheading").width($("#SingleMatchedProposals").css("width"));
    $("#divTotalSectionData").width($("#SingleMatchedProposals").css("width"));
    //$(".totalcell").width($($("#thSingleMatchedProposals th")[11]).width());
    $(".importtotal").width($("#TotalData thead th").length * $($("#thSingleMatchedProposals th")[11]).width());

    var TotalWidth = 0.0;
    for (var x = 0; x < $("#thSingleMatchedProposals th").length; x++) {
        TotalWidth = TotalWidth + ($($("#thSingleMatchedProposals th")[x]).width());
    }
    var TotalTableWdth = 0.0;
    for (var x = 0; x < $("#thTotalData th").length; x++) {
        TotalTableWdth = TotalTableWdth + 105.667;
        $($("#thTotalData th")[x]).css("width", "105!important");
        $($("#tbTotalData td")[x]).css("width", "105!important");
        $(".totalcell").css("width", "105.667px!important");

        //  TotalWidth = TotalWidth + ($($("#thSingleMatchedProposals th")[x]).width());
    }
    $("#modal-ImportUnAllocatedProposals .col-sm-12").removeClass("col-sm-12");
    $("#divTotalSectionData").width(TotalWidth);
    $(".importtotal").width(TotalTableWdth);
    $("#TotalData").width(1781.67);
    //$(".importtotal").css("margin-left", (TotalWidth - TotalTableWdth));
    $(".importtotal").css("margin-left", "927.5px");
    $("#SingleMatchedProposals_wrapper").width($("#SingleMatchedProposals").width());
    $("#MultiMatchedProposals_wrapper").width($("#SingleMatchedProposals").width());
    $("#UnMatchedProposals_wrapper").width($("#SingleMatchedProposals").width());
    $("#divChooseMaches").width($("#SingleMatchedProposals").width());


    $("#SingleMatchedProposals_wrapper").css("margin", "0");
    $("#MultiMatchedProposals_wrapper").css("margin", "0");
    $("#UnMatchedProposals_wrapper").css("margin", "0");
    if (MultiMatchPropsalsJson.length > 0) {
        //$("#btnChooseMatches").attr("disabled", false);
        $("#btnConfirmMatches2").hide();
        $("#btnChooseMatches").show();
    }
    else {
        $("#btnChooseMatches").hide();
        $("#btnConfirmMatches2").show();

    }
  //  console.log(TotalWidth);


    //$(".importtotal").css("margin-left", $("#SingleMatchedProposals").width() - $(".importtotal").width() + "px")
    setTimeout(function () {
        for (var x = 11; x <= parseInt(10) + parseInt(maxAculatizedWeekNum); x++) {
            $($("#thSingleMatchedProposals tr th")[x]).addClass("fully-actualized-header");
            $($("#thMultiMatchedProposals tr th")[x]).addClass("fully-actualized-header");
            $($("#thUnMatchedProposals tr th")[x]).addClass("fully-actualized-header");
            $($("#thTotalData tr th")[x-9]).addClass("fully-actualized-header");
        }
        if ($("#thSingleMatchedProposals th").length <= (parseInt(maxAculatizedWeekNum) + parseInt(11))) {
            if (MultiMatchPropsalsJson.length >0) {
                $("#btnChooseMatches").css("display", "none");
            }
            $("#btnConfirmMatches2").css("display", "none");
            $("#divFullyActualizedWarning").show();
        }
        else {
            $("#divFullyActualizedWarning").hide();
            if (MultiMatchPropsalsJson.filter(o => o.isFullyActualized == false).length > 0) {
                $("#btnChooseMatches").css("display", "");
            }
            else {
                $("#btnChooseMatches").css("display", "none");
                if (SingleMatchPropsalsJson.filter(o => o.isFullyActualized == false).length > 0
                    || UnMatchPropsalsJson.filter(o => o.isFullyActualized == false).length > 0
                ) {
                    $("#btnConfirmMatches2").css("display", "");
                }
                else {
                    $("#btnConfirmMatches2").css("display", "none");
                    $("#divFullyActualizedWarning").show();

                }
            }
        }
        HideOverlayPopupImport();
    }, 3000);

}
function IgnoreImportingNetwork() {
    //ST-720 Mark Proposal as Ignored and Allocated
    if ($("#thSingleMatchedProposals th").length <= (parseInt(maxAculatizedWeekNum) + parseInt(11))) {
        IgnoreAndAllocateProposals();
    }
    else if (
        (MultiMatchPropsalsJson.length == 0 || MultiMatchPropsalsJson.filter(o => o.isFullyActualized == false).length == 0)
        && (SingleMatchPropsalsJson.length == 0 || SingleMatchPropsalsJson.filter(o => o.isFullyActualized == false).length == 0) 
        && (UnMatchPropsalsJson.length == 0 || UnMatchPropsalsJson.filter(o => o.isFullyActualized == false).length == 0)
    ) {
        IgnoreAndAllocateProposals();
    }
    
    else {

        ProposalForMatching = null;

        if (currentFileIndex < currentJsonSelectedForImport.length - 1) {
            IgnoredFilesToProcess.push(currentJsonSelectedForImport[currentFileIndex]);
            UnAllocatedProposalsJson.filter(o => o.networkId.toString() == currentJsonSelectedForImport[currentFileIndex].networkId.toString() && o.sourceFile.toString() == currentJsonSelectedForImport[currentFileIndex].sourceFile.toString())[0].selectionType = 'ignore';

            //ST-710 Code Start to log the User Journey
            var Description = "Action performed by user: Ignored File";
            var proposalId = 0;
            if ($(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != null && $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != undefined && $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != "")
                proposalId = $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href").split('=')[1];

            AddUserJourneyEntryImportLoad(currentJsonSelectedForImport[currentFileIndex].clientId, currentJsonSelectedForImport[currentFileIndex].networkId,
                currentJsonSelectedForImport[currentFileIndex].quarterName, "ImportLoadScreen", proposalId,
                currentJsonSelectedForImport[currentFileIndex].deal, currentJsonSelectedForImport[currentFileIndex].sourceFile,
                "Ignored", Description);

            //ST-710 Code End to log the User Journey

            currentFileIndex = parseInt(currentFileIndex) + 1;
            setTimeout(function () {
                SetImportScreenData(currentFileIndex);
            }, 2000);
        }
        else {
            IgnoredFilesToProcess.push(currentJsonSelectedForImport[currentFileIndex]);
            UnAllocatedProposalsJson.filter(o => o.networkId.toString() == currentJsonSelectedForImport[currentFileIndex].networkId.toString() && o.sourceFile.toString() == currentJsonSelectedForImport[currentFileIndex].sourceFile.toString())[0].selectionType = 'ignore';
            //ST-710 Code Start to log the User Journey
            var Description = "Action performed by user: Ignored File";
            var proposalId = 0;
            if ($(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != null && $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != undefined && $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != "")
                proposalId = $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href").split('=')[1];

            AddUserJourneyEntryImportLoad(currentJsonSelectedForImport[currentFileIndex].clientId, currentJsonSelectedForImport[currentFileIndex].networkId,
                currentJsonSelectedForImport[currentFileIndex].quarterName, "ImportLoadScreen", proposalId,
                currentJsonSelectedForImport[currentFileIndex].deal, currentJsonSelectedForImport[currentFileIndex].sourceFile,
                "Ignored", Description);

            //ST-710 Code End to log the User Journey
            $("#modal-UnAllocatedProposals").modal('hide');
            $("#modal-ImportUnAllocatedProposals").modal('hide');
            if (SelProposalId > 0) {
                OpenProposal(SelProposalId, window.location.origin + "/ScheduleProposal/EditProposal?ProposalId=" + SelProposalId, '/ManageMedia/Proposal?ProposalId=' + SelProposalId);
            }
            else {
                if (screenMode.toString().toLowerCase() == "create") {
                    CreateProposal(currentJsonSelectedForImport[currentFileIndex].quarterName);
                    return false;
                }
                if (screenMode.toString().toLowerCase() == "edit") {
                    OpenProposal(proposalId, window.location.origin + "/ScheduleProposal/EditProposal?ProposalId=" + proposalId, '/ManageMedia/Proposal?ProposalId=' + proposalId);
                    return false;
                }

            }
            
            //BacktoUnAllocatedProposals(0);
        }
    }
}

function ChooseMatches() {
    ShowOverlayPopupMacthing();
   //if (UnMatchPropsalsJson.length > 0) { // ST-720, Commented
    if (UnMatchPropsalsJson.length > UnMatchPropsalsJson.filter(o => o.isFullyActualized == true).length) {
        HideOverlayPopupMatching();
        swal({
            title: "Information",
            html: 'There are some properties in NO MATCHED PROPERTIES section. Please create the properties and try again. You can proceed to choose matches when there is no property in NO MATCHED PROPERTIES section.',
            type: 'info',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok',
            showLoaderOnConfirm: true,
            preConfirm: function () {
                return new Promise(function (resolve) {
                    setTimeout(function () {
                        resolve();
                    }, 50);
                });
            }
        });
    }
    else {
        $("#modal-ImportUnAllocatedProposals").modal('hide');
        $('#modal-UnAllocatedProposalsMatching').modal({ backdrop: 'static', keyboard: false }, 'show');
        console.log("Opening Matching Screen");
        if (!($.fn.dataTable.isDataTable('#MultiMatchedProposalsMatching'))) {
            //ST-710 Code Start to log the User Journey
            var Description = "Action performed by user: Load Choose Match Screen data:";
            var proposalId = 0;
            if ($(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != null && $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != undefined && $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != "")
                proposalId = $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href").split('=')[1];

            AddUserJourneyEntryImportLoad(currentJsonSelectedForImport[currentFileIndex].clientId, currentJsonSelectedForImport[currentFileIndex].networkId,
                currentJsonSelectedForImport[currentFileIndex].quarterName, "ChooseaMatchesScreen", proposalId,
                currentJsonSelectedForImport[currentFileIndex].deal, currentJsonSelectedForImport[currentFileIndex].sourceFile,
                "ChooseMatchLoad", Description);

                        //ST-710 Code End to log the User Journey
            BindMatchingScreenData();
        }
        setTimeout(function () { $("#modal-UnAllocatedProposalsMatching .block-content").scrollLeft(0); }, 3000);
        setTimeout(function () { $("#modal-UnAllocatedProposalsMatching .block-content").scrollTop(0); }, 3000);
        setTimeout(function () { HideOverlayPopupMatching(); }, 3000);
        return false;
    }
}

$("#btnbackImport,#btnDRCloseAll,#btnCloseImport2,#btnCloseImport,#btnIgnoreImport,#btnDRCloseTop").on("click", function () {
    if ($.fn.dataTable.isDataTable('#MultiMatchedProposalsMatching')) {
        $('#MultiMatchedProposalsMatching').DataTable().clear().destroy();
    }
});

function GoToNextProposal() {
    var index = SelectedProposalsJson.findIndex(x => x.sourceFile === SelectedProposal.sourceFile);
    if (index !== SelectedProposalsJson.length - 1) {
        SelectedProposal = SelectedProposalsJson[index + 1];
    }
    SelectedProposalNo = SelectedProposalNo + 1;
    if (SelectedProposalNo == SelectedProposalsJson.length) {
        $("#btnNext").css("display", "none");
    }
    $("#btnPrevious").css("display", "block");
    $("#lblRecords").text(SelectedProposalNo + "/" + SelectedProposalsJson.length);
}
function GoToPreviousProposal() {
    var index = SelectedProposalsJson.findIndex(x => x.sourceFile === SelectedProposal.sourceFile);
    SelectedProposal = SelectedProposalsJson[index - 1];
    SelectedProposalNo = SelectedProposalNo - 1;
    if (SelectedProposalNo === 1) {
        $("#btnPrevious").css("display", "none");
    }
    $("#btnNext").css("display", "block");
    $("#lblRecords").text(SelectedProposalNo + "/" + SelectedProposalsJson.length);
}
function GotoConfirmMatches() {
    ShowOverlayPopupConfirmMatch();
  //  if (UnMatchPropsalsJson.length > 0) { /?ST-720, Commented
    if (UnMatchPropsalsJson.length > UnMatchPropsalsJson.filter(o => o.isFullyActualized == true).length) {
        HideOverlayPopupConfirmMatch();
        swal({
            title: "Information",
            html: 'There are some properties in NO MATCHED PROPERTIES section. Please create the properties and try again. You can proceed to choose matches when there is no property in NO MATCHED PROPERTIES section.',
            type: 'info',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok',
            showLoaderOnConfirm: true,
            preConfirm: function () {
                return new Promise(function (resolve) {
                    setTimeout(function () {
                        resolve();
                    }, 50);
                });
            }
        });
    }
    else {
        $("#modal-ImportUnAllocatedProposals").modal('hide');
        $('#modal-UnAllocatedProposalsConfirmMatch').modal({ backdrop: 'static', keyboard: false, draggable: true }, 'show');
        //FinalMatchedProposals = [...SingleMatchPropsalsJson.filter(o => o.demoName != "" && o.isFullyActualized == false)];

        FinalMatchedProposals = jQuery.extend(true, [], SingleMatchPropsalsJson.filter(o => o.demoName != "" && o.isFullyActualized == false));
        redirectFrom = "import";
        //ST-710 Code Start to log the User Journey
        var Description = "Action performed by user: No Multi Match Property Exist. Loading Confirm Match Screen Data:";
        var proposalId = 0;
        if ($(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != null && $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != undefined && $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != "")
            proposalId = $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href").split('=')[1];

        AddUserJourneyEntryImportLoad(currentJsonSelectedForImport[currentFileIndex].clientId, currentJsonSelectedForImport[currentFileIndex].networkId,
            currentJsonSelectedForImport[currentFileIndex].quarterName, "ImportLoadScreen", proposalId,
            currentJsonSelectedForImport[currentFileIndex].deal, currentJsonSelectedForImport[currentFileIndex].sourceFile,
            "ChooseMatchLoad", Description);

                        //ST-710 Code End to log the User Journey

        setTimeout(function () { BindConfirmMatchScreenData(FinalMatchedProposals); }, 500);
        setTimeout(function () { HideOverlayPopupConfirmMatch(); }, 3000);

    }
}
function OpenPotentialMatches(EdiPropId) {
    $('#modal-PotentialMatches').modal({ backdrop: 'static', keyboard: false }, 'show');
    $("#modal-PotentialMatches").draggable();
    LoadPotentialMatchScreenData(EdiPropId);
}

function LoadPotentialMatchScreenData(EdiPropId) {
    //console.log("Potential Match");
    //console.log(PotentialMatchPropsalsJson);

    PotentialMatchPropsalsArray = [];
    var FilteredData = PotentialMatchPropsalsJson.filter(x => x.ediProposalsID === EdiPropId);
    if (FilteredData !== null && FilteredData !== undefined && FilteredData.length > 0) {
        for (var i = 0; i < FilteredData.length; i++) {
            var ObjPotentioalMatchProposal = {
                "ediProposalsID": FilteredData[i].ediProposalsID,
                "propertyId": FilteredData[i].propertyId,
                "rateId": FilteredData[i].rateId,
                "propertyName": FilteredData[i].propertyName,
                "m": FilteredData[i].m,
                "t": FilteredData[i].t,
                "w": FilteredData[i].w,
                "th": FilteredData[i].th,
                "f": FilteredData[i].f,
                "sa": FilteredData[i].sa,
                "su": FilteredData[i].su,
                "startAndEndTime": FilteredData[i].startAndEndTime,
                "demoName": FilteredData[i].demoName,
                "spotLen": FilteredData[i].spotLen,
                "buyTypeCode": FilteredData[i].buyTypeCode,
                "rateAmt": FilteredData[i].rateAmt
            }
            PotentialMatchPropsalsArray.push(ObjPotentioalMatchProposal);
        }
    }
    //console.log(PotentialMatchPropsalsArray);
    init_PotentialMatchTable(PotentialMatchPropsalsArray);
}
function init_PotentialMatchTable(PotentialMatchPropsalsArray) {
    if ($.fn.dataTable.isDataTable('#PotentialMatchesProposals')) {
        $('#PotentialMatchesProposals').DataTable().clear().destroy();
        $('#PotentialMatchesProposals tbody').html("");
    }
    $('#PotentialMatchesProposals').DataTable({
        //lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
        data: PotentialMatchPropsalsArray,
        paging: false,
        destroy: true,
        autoWidth: false,
        columnDefs: [
            { orderable: false, targets: '_all' }

        ],
        fixedHeader: true,
        columns: [
            {
                targets: 0,
                title: '',
                width: 25,
                class: "text-center chkpotential",
                render: function (data, type, row, meta) {
                    return '<input type="radio" name="RowSel_' + row.ediProposalsID + '" />';
                },
                searchable: false
            },
            {
                targets: 1,
                data: "propertyId",
                visible: false,
                searchable: false
            },
            {
                targets: 2,
                data: "rateId",
                visible: false,
                searchable: false
            },
            {
                targets: 3,
                data: "propertyName",
                width: 300,
                class: "col-8-PropName text-left",
                render: ellipsis(39, true)
            },
            {
                targets: 4,
                data: "dow",
                width: 90,
                class: "text-center",
                render: function (data, type, row, meta) {
                    var dow = "";
                    if (row.m == true) {
                        dow += "M";
                    } else { dow += "-"; }
                    if (row.t == true) {
                        dow += "T";
                    } else { dow += "-"; }
                    if (row.w == true) {
                        dow += "W";
                    } else { dow += "-"; }
                    if (row.th == true) {
                        dow += "Th";
                    } else { dow += "-"; }
                    if (row.f == true) {
                        dow += "F";
                    } else { dow += "-"; }
                    if (row.sa == true) {
                        dow += "Sa";
                    } else { dow += "-"; }
                    if (row.su == true) {
                        dow += "Su";
                    } else { dow += "-"; }

                    return dow;
                }
            },
            {
                targets: 5,
                data: "t",
                visible: false,
                searchable: false
            },
            {
                targets: 6,
                data: "w",
                visible: false,
                searchable: false
            },
            {
                targets: 7,
                data: "th",
                visible: false,
                searchable: false
            },
            {
                targets: 8,
                visible: false,
                data: "f",
                searchable: false
            },
            {
                targets: 9,
                data: "sa",
                visible: false,
                searchable: false
            },
            {
                targets: 10,
                data: "su",
                visible: false,
                searchable: false
            },
            {
                targets: 11,
                width: 110,
                data: "startAndEndTime",
                class: "text-center"
            },
            {
                targets: 12,
                width: 35,
                data: "buyTypeCode",
                class: "text-center"
            },
            {
                targets: 13,
                data: "spotLen",
                width: 65,
                class: "text-center",
                render: function (data, type, row, meta) {
                    if (data === 120) {
                        return "<span class='badge badge-pill badge-danger'>" + data + "</span>";
                    }
                    else if (data === 60) {
                        return "<span class='badge badge-pill badge-primary'>" + data + "</span>";
                    }
                    else if (data === 15) {
                        return "<span class='badge badge-pill badge-warning'>" + data + "</span>";
                    }
                    else {
                        return "<span class='badge badge-pill badge-success'>" + data + "</span>";
                    }
                }
            },
            {
                targets: 14,
                data: "demoName",
                width: 100,
                class: "text-center",
                render: ellipsis(33, true)
            },
            {
                targets: 15,
                width: 105,
                data: "rateAmt",
                class: "text-left",
                render: $.fn.dataTable.render.number(',', '.', 2, '$')
            }
        ],

        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $(nRow).find("input[type=radio]").attr("id", "chkSelectPotentialMatch_" + aData.ediProposalsID + '_' + iDisplayIndex);
            $(nRow).find("input[type=radio]").attr("id", "chkSelectPotentialMatch_" + aData.ediProposalsID + '_' + iDisplayIndex);
            $(nRow).find("input[type=radio]").attr("onclick", "return deSelectRadioBtnPotentialMatch(this, " + aData.ediProposalsID + "," + iDisplayIndex + ")");
            $(nRow).find("input[type=radio]").data("ischecked", false);
        },

        initComplete: function (settings, json) {
            $("#PotentialMatchesProposals_info").hide();
            $("#PotentialMatchesProposals_filter").hide();
            if ($("#tbPotentialMatchesProposals input[type=radio]").length == 1) {
                $("#tbPotentialMatchesProposals input[type=radio]").prop("checked", true);
                $("#tbPotentialMatchesProposals input[type=radio]").attr("disabled", true);
                $("#btnMergePotentialMatches").attr("disabled", false);
            }
            else
                $("#btnMergePotentialMatches").attr("disabled", true);
        },
        scrollX: false,
        scrollCollapse: false
    });
}
function deSelectRadioBtnPotentialMatch(ctrl, propId, selIndex) {
    var ischecked = $(ctrl).data("ischecked");
    $("#tbPotentialMatchesProposals input[type=radio]").data("ischecked", false);
    if (ischecked) {
        $(ctrl).prop("checked", false);
        $(ctrl).data("ischecked", false);
    }
    else {
        $(ctrl).prop("checked", true);
        $(ctrl).data("ischecked", true);
    }
    if ($("#tbPotentialMatchesProposals input[type=radio]:checked").length > 0) {
        $("#btnMergePotentialMatches").attr("disabled", false);
    }
    else {
        $("#btnMergePotentialMatches").attr("disabled", true);
    }
}
function ClosedPotentialMatchPopup() {
    $("#modal-PotentialMatches").modal('hide');
}
function MergePotentialMatches() {
    $("#btnMergePotentialMatches").attr("disabled", true);
    $("#modal-PotentialMatches").modal('hide');
    ShowOverlayPopupImport();
    setTimeout(function () {
        var PotentialSelectedProps = $("#tbPotentialMatchesProposals input[type=radio]:checked");
        //alert($(alert(PotentialSelectedProps[0])).attr("id"));
        for (var x = 0; x < PotentialSelectedProps.length; x++) {
            //alert($(PotentialSelectedProps[x]).attr("id"));
            var CurIndex = $(PotentialSelectedProps[x]).attr("id").split('_')[2];
            var CurUMEDIPropId = $(PotentialSelectedProps[x]).attr("id").split('_')[1];
            var FilteredPotentialMatch = PotentialMatchPropsalsArray[CurIndex];
            console.log(FilteredPotentialMatch);
            var CurPotentialMatch = PotentialMatchPropsalsJson.filter(o => o.ediProposalsID == FilteredPotentialMatch.ediProposalsID
                && o.propertyId == FilteredPotentialMatch.propertyId && o.rateId == FilteredPotentialMatch.rateId
                && o.demoName == FilteredPotentialMatch.demoName && o.spotLen == FilteredPotentialMatch.spotLen
            );
            if (MultiMatchPropsalsJson != null && MultiMatchPropsalsJson.length > 0) {
                if (MultiMatchPropsalsJson.filter(o => o.propertyId == FilteredPotentialMatch.propertyId && o.spotLen == FilteredPotentialMatch.spotLen
                    && o.rateAmt == FilteredPotentialMatch.rateAmt && o.demoName == FilteredPotentialMatch.demoName) != null
                    && MultiMatchPropsalsJson.filter(o => o.propertyId == FilteredPotentialMatch.propertyId && o.spotLen == FilteredPotentialMatch.spotLen
                        && o.rateAmt == FilteredPotentialMatch.rateAmt && o.demoName == FilteredPotentialMatch.demoName).length > 0
                ) {

                    var CurPMPropMulti = UnMatchPropsalsJson.filter(o => o.ediProposalsID == CurUMEDIPropId)[0];
                    var SelEdiPropIdPM = MultiMatchPropsalsJson.filter(o => o.propertyId == FilteredPotentialMatch.propertyId && o.spotLen == FilteredPotentialMatch.spotLen
                        && o.rateAmt == FilteredPotentialMatch.rateAmt && o.demoName == FilteredPotentialMatch.demoName)[0].ediProposalsID;

                    for (var k = 0; k < MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM).length; k++) {
                        MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].totalEDISpots =
                            parseInt(MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].totalEDISpots) +
                            parseInt(CurPMPropMulti.totalSpots);

                        MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].totalSpots =
                            parseInt(MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].totalSpots) +
                            parseInt(CurPMPropMulti.totalSpots);

                        MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week01 =
                            parseInt(MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week01) +
                            parseInt(CurPMPropMulti.week01);

                        MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week02 =
                            parseInt(MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week02) +
                            parseInt(CurPMPropMulti.week02);

                        MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week03 =
                            parseInt(MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week03) +
                            parseInt(CurPMPropMulti.week03);

                        MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week04 =
                            parseInt(MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week04) +
                            parseInt(CurPMPropMulti.week04);

                        MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week05 =
                            parseInt(MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week05) +
                            parseInt(CurPMPropMulti.week05);

                        MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week06 =
                            parseInt(MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week06) +
                            parseInt(CurPMPropMulti.week06);

                        MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week07 =
                            parseInt(MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week07) +
                            parseInt(CurPMPropMulti.week07);

                        MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week08 =
                            parseInt(MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week08) +
                            parseInt(CurPMPropMulti.week08);

                        MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week09 =
                            parseInt(MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week09) +
                            parseInt(CurPMPropMulti.week09);

                        MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week10 =
                            parseInt(MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week10) +
                            parseInt(CurPMPropMulti.week10);

                        MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week11 =
                            parseInt(MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week11) +
                            parseInt(CurPMPropMulti.week11);

                        MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week12 =
                            parseInt(MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week12) +
                            parseInt(CurPMPropMulti.week12);

                        MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week13 =
                            parseInt(MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week13) +
                            parseInt(CurPMPropMulti.week13);

                        MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week14 =
                            parseInt(MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week14) +
                            parseInt(CurPMPropMulti.week14);

                        MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM && o.propertyId == FilteredPotentialMatch.propertyId && o.rateId == FilteredPotentialMatch.rateId)[0].hasPotentialMatch = true;
                    }
                    //ST-710 Code Start to log the User Journey
                    var Description = "Action performed by user:";
                    Description = Description + "<br/>PropertyName:" + CurPMPropMulti.propertyName + ", DemoName:" + CurPMPropMulti.demoName + ",SpotLen:" + CurPMPropMulti.spotLen + "" +
                        ",StartAndEndTime:" + CurPMPropMulti.startAndEndTime + ",RateAmt:" + CurPMPropMulti.rateAmt + "<br/> has merged into Multiple Match Properties with " +
                        "<br/>PropertyName:" + MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM && o.propertyId == FilteredPotentialMatch.propertyId && o.rateId == FilteredPotentialMatch.rateId)[0].propertyName +
                        ", DemoName:" + MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM && o.propertyId == FilteredPotentialMatch.propertyId && o.rateId == FilteredPotentialMatch.rateId)[0].demoName +
                        ", SpotLen: " + MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM && o.propertyId == FilteredPotentialMatch.propertyId && o.rateId == FilteredPotentialMatch.rateId)[0].spotLen +
                        ",StartAndEndTime:" + MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM && o.propertyId == FilteredPotentialMatch.propertyId && o.rateId == FilteredPotentialMatch.rateId)[0].startAndEndTime +
                        ",RateAmt:" + MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM && o.propertyId == FilteredPotentialMatch.propertyId && o.rateId == FilteredPotentialMatch.rateId)[0].rateAmt +
                        " ,Buytype:" + MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM && o.propertyId == FilteredPotentialMatch.propertyId && o.rateId == FilteredPotentialMatch.rateId)[0].buyTypeCode;

                    var proposalId = 0;
                    if ($(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != null && $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != undefined && $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != "")
                        proposalId = $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href").split('=')[1];

                    AddUserJourneyEntryImportLoad(currentJsonSelectedForImport[currentFileIndex].clientId, currentJsonSelectedForImport[currentFileIndex].networkId,
                        currentJsonSelectedForImport[currentFileIndex].quarterName, "ImportLoadScreen", proposalId,
                        currentJsonSelectedForImport[currentFileIndex].deal, currentJsonSelectedForImport[currentFileIndex].sourceFile,
                        "MergedInMultiple", Description);

                        //ST-710 Code End to log the User Journey
                }
                else {
                    if (SingleMatchPropsalsJson == null || SingleMatchPropsalsJson.length == 0) {
                        
                        CurPotentialMatch[0].hasPotentialMatch = true;
                        SingleMatchPropsalsJson = CurPotentialMatch;
                        var CurPMPropSM = UnMatchPropsalsJson.filter(o => o.ediProposalsID == CurUMEDIPropId)[0];
                        //ST-710 Code Start to log the User Journey
                        var Description = "Action performed by user:";
                        Description = Description + "<br/>PropertyName:" + CurPMPropSM.propertyName + ", DemoName:" + CurPMPropSM.demoName + ",SpotLen:" + CurPMPropSM.spotLen + "" +
                            ",StartAndEndTime:" + CurPMPropSM.startAndEndTime + ",RateAmt:" + CurPMPropSM.rateAmt + "<br/> has merged into Single Match Properties with " +
                            "<br/>PropertyName:" + CurPotentialMatch[0].propertyName +
                            ", DemoName:" + CurPotentialMatch[0].demoName +
                            ", SpotLen: " + CurPotentialMatch[0].spotLen +
                            ",StartAndEndTime:" + CurPotentialMatch[0].startAndEndTime +
                            ",RateAmt:" + CurPotentialMatch[0].rateAmt +
                            " ,Buytype:" + CurPotentialMatch[0].buyTypeCode;

                        var proposalId = 0;
                        if ($(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != null && $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != undefined && $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != "")
                            proposalId = $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href").split('=')[1];

                        AddUserJourneyEntryImportLoad(currentJsonSelectedForImport[currentFileIndex].clientId, currentJsonSelectedForImport[currentFileIndex].networkId,
                            currentJsonSelectedForImport[currentFileIndex].quarterName, "ImportLoadScreen", proposalId,
                            currentJsonSelectedForImport[currentFileIndex].deal, currentJsonSelectedForImport[currentFileIndex].sourceFile,
                            "MergedInSingle", Description);

                        //ST-710 Code End to log the User Journey
                    }
                    else {
                        if (SingleMatchPropsalsJson.filter(o => o.propertyId == FilteredPotentialMatch.propertyId && o.spotLen == FilteredPotentialMatch.spotLen
                            && o.rateAmt == FilteredPotentialMatch.rateAmt && o.demoName == FilteredPotentialMatch.demoName) != null
                            && SingleMatchPropsalsJson.filter(o => o.propertyId == FilteredPotentialMatch.propertyId && o.spotLen == FilteredPotentialMatch.spotLen
                                && o.rateAmt == FilteredPotentialMatch.rateAmt && o.demoName == FilteredPotentialMatch.demoName).length > 0
                        ) {

                            var CurPMPropSingle = UnMatchPropsalsJson.filter(o => o.ediProposalsID == CurUMEDIPropId)[0];
                            var SelEdiPropIdPM = SingleMatchPropsalsJson.filter(o => o.propertyId == FilteredPotentialMatch.propertyId && o.spotLen == FilteredPotentialMatch.spotLen
                                && o.rateAmt == FilteredPotentialMatch.rateAmt && o.demoName == FilteredPotentialMatch.demoName)[0].ediProposalsID;

                            for (var k = 0; k < SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM).length; k++) {
                                SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].totalEDISpots =
                                    parseInt(SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].totalEDISpots) +
                                    parseInt(CurPMPropSingle.totalSpots);

                                SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].totalSpots =
                                    parseInt(SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].totalSpots) +
                                    parseInt(CurPMPropSingle.totalSpots);

                                SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week01 =
                                    parseInt(SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week01) +
                                    parseInt(CurPMPropSingle.week01);

                                SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week02 =
                                    parseInt(SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week02) +
                                    parseInt(CurPMPropSingle.week02);

                                SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week03 =
                                    parseInt(SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week03) +
                                    parseInt(CurPMPropSingle.week03);

                                SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week04 =
                                    parseInt(SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week04) +
                                    parseInt(CurPMPropSingle.week04);

                                SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week05 =
                                    parseInt(SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week05) +
                                    parseInt(CurPMPropSingle.week05);

                                SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week06 =
                                    parseInt(SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week06) +
                                    parseInt(CurPMPropSingle.week06);

                                SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week07 =
                                    parseInt(SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week07) +
                                    parseInt(CurPMPropSingle.week07);

                                SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week08 =
                                    parseInt(SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week08) +
                                    parseInt(CurPMPropSingle.week08);

                                SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week09 =
                                    parseInt(SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week09) +
                                    parseInt(CurPMPropSingle.week09);

                                SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week10 =
                                    parseInt(SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week10) +
                                    parseInt(CurPMPropSingle.week10);

                                SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week11 =
                                    parseInt(SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week11) +
                                    parseInt(CurPMPropSingle.week11);

                                SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week12 =
                                    parseInt(SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week12) +
                                    parseInt(CurPMPropSingle.week12);

                                SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week13 =
                                    parseInt(SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week13) +
                                    parseInt(CurPMPropSingle.week13);

                                SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week14 =
                                    parseInt(SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week14) +
                                    parseInt(CurPMPropSingle.week14);

                                SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM && o.propertyId == FilteredPotentialMatch.propertyId && o.rateId == FilteredPotentialMatch.rateId)[0].hasPotentialMatch = true;
                            }
                            var CurPMPropSM2 = UnMatchPropsalsJson.filter(o => o.ediProposalsID == CurUMEDIPropId)[0];
                            //ST-710 Code Start to log the User Journey
                            var Description = "Action performed by user:";
                            Description = Description + "<br/>PropertyName:" + CurPMPropSM2.propertyName + ", DemoName:" + CurPMPropSM2.demoName + ",SpotLen:" + CurPMPropSM2.spotLen + "" +
                                ",StartAndEndTime:" + CurPMPropSM2.startAndEndTime + ",RateAmt:" + CurPMPropSM2.rateAmt + "<br/> has merged into Single Match Properties with " +
                                "<br/>PropertyName:" + CurPotentialMatch[0].propertyName +
                                ", DemoName:" + CurPotentialMatch[0].demoName +
                                ", SpotLen: " + CurPotentialMatch[0].spotLen +
                                ",StartAndEndTime:" + CurPotentialMatch[0].startAndEndTime +
                                ",RateAmt:" + CurPotentialMatch[0].rateAmt +
                                " ,Buytype:" + CurPotentialMatch[0].buyTypeCode;

                            var proposalId = 0;
                            if ($(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != null && $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != undefined && $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != "")
                                proposalId = $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href").split('=')[1];

                            AddUserJourneyEntryImportLoad(currentJsonSelectedForImport[currentFileIndex].clientId, currentJsonSelectedForImport[currentFileIndex].networkId,
                                currentJsonSelectedForImport[currentFileIndex].quarterName, "ImportLoadScreen", proposalId,
                                currentJsonSelectedForImport[currentFileIndex].deal, currentJsonSelectedForImport[currentFileIndex].sourceFile,
                                "MergedInSingle", Description);

                            //ST-710 Code End to log the User Journey
                        }
                        else {
                            CurPotentialMatch[0].hasPotentialMatch = true;
                            SingleMatchPropsalsJson.push(CurPotentialMatch[0]);
                            var CurPMPropSM3 = UnMatchPropsalsJson.filter(o => o.ediProposalsID == CurUMEDIPropId)[0];
                            //ST-710 Code Start to log the User Journey
                            var Description = "Action performed by user:";
                            Description = Description + "<br/>PropertyName:" + CurPMPropSM3.propertyName + ", DemoName:" + CurPMPropSM3.demoName + ",SpotLen:" + CurPMPropSM3.spotLen + "" +
                                ",StartAndEndTime:" + CurPMPropSM3.startAndEndTime + ",RateAmt:" + CurPMPropSM3.rateAmt + "<br/> has merged into Single Match Properties with " +
                                "<br/>PropertyName:" + CurPotentialMatch[0].propertyName +
                                ", DemoName:" + CurPotentialMatch[0].demoName +
                                ", SpotLen: " + CurPotentialMatch[0].spotLen +
                                ",StartAndEndTime:" + CurPotentialMatch[0].startAndEndTime +
                                ",RateAmt:" + CurPotentialMatch[0].rateAmt +
                                " ,Buytype:" + CurPotentialMatch[0].buyTypeCode;

                            var proposalId = 0;
                            if ($(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != null && $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != undefined && $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != "")
                                proposalId = $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href").split('=')[1];

                            AddUserJourneyEntryImportLoad(currentJsonSelectedForImport[currentFileIndex].clientId, currentJsonSelectedForImport[currentFileIndex].networkId,
                                currentJsonSelectedForImport[currentFileIndex].quarterName, "ImportLoadScreen", proposalId,
                                currentJsonSelectedForImport[currentFileIndex].deal, currentJsonSelectedForImport[currentFileIndex].sourceFile,
                                "MergedInSingle", Description);

                            //ST-710 Code End to log the User Journey
                        }

                    }
                    //$($("#tbPotentialMatchesProposals tr")[UnMatchPropsalsJson.findIndex(x => x.ediProposalsID == FilteredPotentialMatch.ediProposalsID)]).remove();
                    //UnMatchPropsalsJson.splice(UnMatchPropsalsJson.findIndex(x => x.ediProposalsID == FilteredPotentialMatch.ediProposalsID), 1);

                    SingleMatchPropsalsJson.sort(function (a, b) {
                        return a.propertyName.localeCompare(b.propertyName) || b.buyTypeCode.localeCompare(a.buyTypeCode)
                            || a.spotLen.toString().localeCompare(b.spotLen.toString());
                    });
                }
                // MultiMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)
            }
            else {
                //if (SingleMatchPropsalsJson == null || SingleMatchPropsalsJson.length == 0) {
                //    CurPotentialMatch[0].hasPotentialMatch = true;
                //    SingleMatchPropsalsJson = CurPotentialMatch;
                //}
                //else {
                //    // Addd Code for ST-709 Defect
                //    CurPotentialMatch[0].hasPotentialMatch = true;
                //    SingleMatchPropsalsJson.push(CurPotentialMatch[0]);
                //}
                if (SingleMatchPropsalsJson.filter(o => o.propertyId == FilteredPotentialMatch.propertyId && o.spotLen == FilteredPotentialMatch.spotLen
                    && o.rateAmt == FilteredPotentialMatch.rateAmt && o.demoName == FilteredPotentialMatch.demoName) != null
                    && SingleMatchPropsalsJson.filter(o => o.propertyId == FilteredPotentialMatch.propertyId && o.spotLen == FilteredPotentialMatch.spotLen
                        && o.rateAmt == FilteredPotentialMatch.rateAmt && o.demoName == FilteredPotentialMatch.demoName).length > 0
                ) {

                    var CurPMPropSingle = UnMatchPropsalsJson.filter(o => o.ediProposalsID == CurUMEDIPropId)[0];
                    var SelEdiPropIdPM = SingleMatchPropsalsJson.filter(o => o.propertyId == FilteredPotentialMatch.propertyId && o.spotLen == FilteredPotentialMatch.spotLen
                        && o.rateAmt == FilteredPotentialMatch.rateAmt && o.demoName == FilteredPotentialMatch.demoName)[0].ediProposalsID;

                    for (var k = 0; k < SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM).length; k++) {
                        SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].totalEDISpots =
                            parseInt(SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].totalEDISpots) +
                            parseInt(CurPMPropSingle.totalSpots);

                        SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].totalSpots =
                            parseInt(SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].totalSpots) +
                            parseInt(CurPMPropSingle.totalSpots);

                        SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week01 =
                            parseInt(SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week01) +
                            parseInt(CurPMPropSingle.week01);

                        SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week02 =
                            parseInt(SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week02) +
                            parseInt(CurPMPropSingle.week02);

                        SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week03 =
                            parseInt(SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week03) +
                            parseInt(CurPMPropSingle.week03);

                        SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week04 =
                            parseInt(SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week04) +
                            parseInt(CurPMPropSingle.week04);

                        SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week05 =
                            parseInt(SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week05) +
                            parseInt(CurPMPropSingle.week05);

                        SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week06 =
                            parseInt(SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week06) +
                            parseInt(CurPMPropSingle.week06);

                        SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week07 =
                            parseInt(SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week07) +
                            parseInt(CurPMPropSingle.week07);

                        SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week08 =
                            parseInt(SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week08) +
                            parseInt(CurPMPropSingle.week08);

                        SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week09 =
                            parseInt(SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week09) +
                            parseInt(CurPMPropSingle.week09);

                        SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week10 =
                            parseInt(SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week10) +
                            parseInt(CurPMPropSingle.week10);

                        SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week11 =
                            parseInt(SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week11) +
                            parseInt(CurPMPropSingle.week11);

                        SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week12 =
                            parseInt(SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week12) +
                            parseInt(CurPMPropSingle.week12);

                        SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week13 =
                            parseInt(SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week13) +
                            parseInt(CurPMPropSingle.week13);

                        SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week14 =
                            parseInt(SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM)[k].week14) +
                            parseInt(CurPMPropSingle.week14);

                        SingleMatchPropsalsJson.filter(o => o.ediProposalsID == SelEdiPropIdPM && o.propertyId == FilteredPotentialMatch.propertyId && o.rateId == FilteredPotentialMatch.rateId)[0].hasPotentialMatch = true;
                    }
                    var CurPMPropSM5 = UnMatchPropsalsJson.filter(o => o.ediProposalsID == CurUMEDIPropId)[0];
                    //ST-710 Code Start to log the User Journey
                    var Description = "Action performed by user:";
                    Description = Description + "<br/>PropertyName:" + CurPMPropSM5.propertyName + ", DemoName:" + CurPMPropSM5.demoName + ",SpotLen:" + CurPMPropSM5.spotLen + "" +
                        ",StartAndEndTime:" + CurPMPropSM5.startAndEndTime + ",RateAmt:" + CurPMPropSM5.rateAmt + " <br/>has merged into Single Match Properties with " +
                        "<br/>PropertyName:" + CurPotentialMatch[0].propertyName +
                        ", DemoName:" + CurPotentialMatch[0].demoName +
                        ", SpotLen: " + CurPotentialMatch[0].spotLen +
                        ",StartAndEndTime:" + CurPotentialMatch[0].startAndEndTime +
                        ",RateAmt:" + CurPotentialMatch[0].rateAmt +
                        " ,Buytype:" + CurPotentialMatch[0].buyTypeCode;

                    var proposalId = 0;
                    if ($(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != null && $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != undefined && $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != "")
                        proposalId = $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href").split('=')[1];

                    AddUserJourneyEntryImportLoad(currentJsonSelectedForImport[currentFileIndex].clientId, currentJsonSelectedForImport[currentFileIndex].networkId,
                        currentJsonSelectedForImport[currentFileIndex].quarterName, "ImportLoadScreen", proposalId,
                        currentJsonSelectedForImport[currentFileIndex].deal, currentJsonSelectedForImport[currentFileIndex].sourceFile,
                        "MergedInSingle", Description);
                       
                        //ST-710 Code End to log the User Journey
                }
                else {
                    CurPotentialMatch[0].hasPotentialMatch = true;
                    SingleMatchPropsalsJson.push(CurPotentialMatch[0]);
                    var CurPMPropSM6 = UnMatchPropsalsJson.filter(o => o.ediProposalsID == CurUMEDIPropId)[0];
                    //ST-710 Code Start to log the User Journey
                    var Description = "Action performed by user:";
                    Description = Description + "<br/>PropertyName:" + CurPMPropSM6.propertyName + ", DemoName:" + CurPMPropSM6.demoName + ",SpotLen:" + CurPMPropSM6.spotLen + "" +
                        ",StartAndEndTime:" + CurPMPropSM6.startAndEndTime + ",RateAmt:" + CurPMPropSM6.rateAmt + "<br/> has merged into Single Match Properties with " +
                        "<br/>PropertyName:" + CurPotentialMatch[0].propertyName +
                        ", DemoName:" + CurPotentialMatch[0].demoName +
                        ", SpotLen: " + CurPotentialMatch[0].spotLen +
                        ",StartAndEndTime:" + CurPotentialMatch[0].startAndEndTime +
                        ",RateAmt:" + CurPotentialMatch[0].rateAmt +
                        " ,Buytype:" + CurPotentialMatch[0].buyTypeCode;

                    var proposalId = 0;
                    if ($(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != null && $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != undefined && $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != "")
                        proposalId = $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href").split('=')[1];

                    AddUserJourneyEntryImportLoad(currentJsonSelectedForImport[currentFileIndex].clientId, currentJsonSelectedForImport[currentFileIndex].networkId,
                        currentJsonSelectedForImport[currentFileIndex].quarterName, "ImportLoadScreen", proposalId,
                        currentJsonSelectedForImport[currentFileIndex].deal, currentJsonSelectedForImport[currentFileIndex].sourceFile,
                        "MergedInSingle", Description);

                        //ST-710 Code End to log the User Journey
                }
                //$($("#tbPotentialMatchesProposals tr")[UnMatchPropsalsJson.findIndex(x => x.ediProposalsID == FilteredPotentialMatch.ediProposalsID)]).remove();
                //UnMatchPropsalsJson.splice(UnMatchPropsalsJson.findIndex(x => x.ediProposalsID == FilteredPotentialMatch.ediProposalsID), 1);

                SingleMatchPropsalsJson.sort(function (a, b) {
                    return a.propertyName.localeCompare(b.propertyName) || b.buyTypeCode.localeCompare(a.buyTypeCode)
                        || a.spotLen.toString().localeCompare(b.spotLen.toString());
                });
            }
            $($("#tbPotentialMatchesProposals tr")[UnMatchPropsalsJson.findIndex(x => x.ediProposalsID == FilteredPotentialMatch.ediProposalsID)]).remove();
            UnMatchPropsalsJson.splice(UnMatchPropsalsJson.findIndex(x => x.ediProposalsID == FilteredPotentialMatch.ediProposalsID), 1);
            // ST-720 Update The Fully Actualized to false
            for (var x = 0; x < MultiMatchPropsalsJson.length; x++) {
                if (parseInt(MultiMatchPropsalsJson[x].totalSpots) > 0) {
                    MultiMatchPropsalsJson[x].isFullyActualized = false;
                }
            }
            for (var x = 0; x < SingleMatchPropsalsJson.length; x++) {
                if (parseInt(SingleMatchPropsalsJson[x].totalSpots) > 0) {
                    SingleMatchPropsalsJson[x].isFullyActualized = false;
                }
            }

            GetUniqueDataMerged(SingleMatchPropsalsJson, 1);
            setTimeout(function () { BindSingleMatchedProperties() }, 250);

            // HideOverlayPopupImport();

        }
    }, 500);
}
var TotalSectionArrayPM = new Array();
function CalculateTotalPotentialMatch() {
    TotalSectionArrayPM = new Array();

    CurObject = ProposalTotalJson.filter(o => o.propertyId == 1 && o.propertyName == "NETWORK SPOTS")[0];
    TotalSectionArrayPM.push(CurObject);

    CurObject = ProposalTotalJson.filter(o => o.propertyId == 2 && o.propertyName == "NETWORK DOLLARS")[0];
    TotalSectionArrayPM.push(CurObject);

    CurObject = ProposalTotalJson.filter(o => o.propertyId == 2 && o.propertyName == "Network CPM")[0];
    TotalSectionArrayPM.push(CurObject);

    CurObject = ProposalTotalJson.filter(o => o.propertyId == 4 && o.propertyName == "NETWORK GI")[0];
    TotalSectionArrayPM.push(CurObject);

    CurObject = ProposalTotalJson.filter(o => o.propertyId == 6 && o.propertyName == "OM DOLLARS")[0];
    TotalSectionArrayPM.push(CurObject);

    CurObject = ProposalTotalJson.filter(o => o.propertyId == 7 && o.propertyName == "OM CPM")[0];
    TotalSectionArrayPM.push(CurObject);

    CurObject = ProposalTotalJson.filter(o => o.propertyId == 8 && o.propertyName == "OM GI")[0];
    TotalSectionArrayPM.push(CurObject);

    //SPOTS
    var TotalSpots = 0;
    var wk1Spots = 0;
    var wk2Spots = 0;
    var wk3Spots = 0;
    var wk4Spots = 0;
    var wk5Spots = 0;
    var wk6Spots = 0;
    var wk7Spots = 0;
    var wk8Spots = 0;
    var wk9Spots = 0;
    var wk10Spots = 0;
    var wk11Spots = 0;
    var wk12Spots = 0;
    var wk13Spots = 0;
    var wk14Spots = 0;
    //DOLLAR
    var TotalDollars = 0.0;
    var wk1Dollars = 0.0;
    var wk2Dollars = 0.0;
    var wk3Dollars = 0.0;
    var wk4Dollars = 0.0;
    var wk5Dollars = 0.0;
    var wk6Dollars = 0.0;
    var wk7Dollars = 0.0;
    var wk8Dollars = 0.0;
    var wk9Dollars = 0.0;
    var wk10Dollars = 0.0;
    var wk11Dollars = 0.0;
    var wk12Dollars = 0.0;
    var wk13Dollars = 0.0;
    var wk14Dollars = 0.0;
    // CPM
    var TotalCPM = 0.0;
    var wk1CPM = 0.0;
    var wk2CPM = 0.0;
    var wk3CPM = 0.0;
    var wk4CPM = 0.0;
    var wk5CPM = 0.0;
    var wk6CPM = 0.0;
    var wk7CPM = 0.0;
    var wk8CPM = 0.0;
    var wk9CPM = 0.0;
    var wk10CPM = 0.0;
    var wk11CPM = 0.0;
    var wk12CPM = 0.0;
    var wk13CPM = 0.0;
    var wk14CPM = 0.0;

    // GI
    var TotalGI = 0.0;
    var wk1GI = 0.0;
    var wk2GI = 0.0;
    var wk3GI = 0.0;
    var wk4GI = 0.0;
    var wk5GI = 0.0;
    var wk6GI = 0.0;
    var wk7GI = 0.0;
    var wk8GI = 0.0;
    var wk9GI = 0.0;
    var wk10GI = 0.0;
    var wk11GI = 0.0;
    var wk12GI = 0.0;
    var wk13GI = 0.0;
    var wk14GI = 0.0;

    for (var x = 0; x < SingleMatchPropsalsJson.length; x++) {
        //TOTAL SPOTS
        {
            TotalSpots = parseInt(TotalSpots) + parseInt(SingleMatchPropsalsJson[x].totalSpots);
            wk1Spots = parseInt(wk1Spots) + (SingleMatchPropsalsJson[x].week01 == "" ? 0 : parseInt(SingleMatchPropsalsJson[x].week01));
            wk2Spots = parseInt(wk2Spots) + (SingleMatchPropsalsJson[x].week02 == "" ? 0 : parseInt(SingleMatchPropsalsJson[x].week02));
            wk3Spots = parseInt(wk3Spots) + (SingleMatchPropsalsJson[x].week03 == "" ? 0 : parseInt(SingleMatchPropsalsJson[x].week03));
            wk4Spots = parseInt(wk4Spots) + (SingleMatchPropsalsJson[x].week04 == "" ? 0 : parseInt(SingleMatchPropsalsJson[x].week04));
            wk5Spots = parseInt(wk5Spots) + (SingleMatchPropsalsJson[x].week05 == "" ? 0 : parseInt(SingleMatchPropsalsJson[x].week05));
            wk6Spots = parseInt(wk6Spots) + (SingleMatchPropsalsJson[x].week06 == "" ? 0 : parseInt(SingleMatchPropsalsJson[x].week06));
            wk7Spots = parseInt(wk7Spots) + (SingleMatchPropsalsJson[x].week07 == "" ? 0 : parseInt(SingleMatchPropsalsJson[x].week07));
            wk8Spots = parseInt(wk8Spots) + (SingleMatchPropsalsJson[x].week08 == "" ? 0 : parseInt(SingleMatchPropsalsJson[x].week08));
            wk9Spots = parseInt(wk9Spots) + (SingleMatchPropsalsJson[x].week09 == "" ? 0 : parseInt(SingleMatchPropsalsJson[x].week09));
            wk10Spots = parseInt(wk10Spots) + (SingleMatchPropsalsJson[x].week10 == "" ? 0 : parseInt(SingleMatchPropsalsJson[x].week10));
            wk11Spots = parseInt(wk11Spots) + (SingleMatchPropsalsJson[x].week11 == "" ? 0 : parseInt(SingleMatchPropsalsJson[x].week11));
            wk12Spots = parseInt(wk12Spots) + (SingleMatchPropsalsJson[x].week12 == "" ? 0 : parseInt(SingleMatchPropsalsJson[x].week12));
            wk13Spots = parseInt(wk13Spots) + (SingleMatchPropsalsJson[x].week13 == "" ? 0 : parseInt(SingleMatchPropsalsJson[x].week13));
            wk14Spots = parseInt(wk14Spots) + (SingleMatchPropsalsJson[x].week14 == "" ? 0 : parseInt(SingleMatchPropsalsJson[x].week14));
        }
        // DOLLAR
        {
            TotalDollars = parseFloat(TotalDollars) + (parseFloat(SingleMatchPropsalsJson[x].rateAmt) * parseFloat(SingleMatchPropsalsJson[x].totalSpots));
            wk1Dollars = parseFloat(wk1Dollars) + (parseFloat(SingleMatchPropsalsJson[x].rateAmt) * (SingleMatchPropsalsJson[x].week01 == "" ? 0.0 : parseInt(SingleMatchPropsalsJson[x].week01)));
            wk2Dollars = parseFloat(wk2Dollars) + (parseFloat(SingleMatchPropsalsJson[x].rateAmt) * (SingleMatchPropsalsJson[x].week02 == "" ? 0.0 : parseInt(SingleMatchPropsalsJson[x].week02)));
            wk3Dollars = parseFloat(wk3Dollars) + (parseFloat(SingleMatchPropsalsJson[x].rateAmt) * (SingleMatchPropsalsJson[x].week03 == "" ? 0.0 : parseInt(SingleMatchPropsalsJson[x].week03)));
            wk4Dollars = parseFloat(wk4Dollars) + (parseFloat(SingleMatchPropsalsJson[x].rateAmt) * (SingleMatchPropsalsJson[x].week04 == "" ? 0.0 : parseInt(SingleMatchPropsalsJson[x].week04)));
            wk5Dollars = parseFloat(wk5Dollars) + (parseFloat(SingleMatchPropsalsJson[x].rateAmt) * (SingleMatchPropsalsJson[x].week05 == "" ? 0.0 : parseInt(SingleMatchPropsalsJson[x].week05)));
            wk6Dollars = parseFloat(wk6Dollars) + (parseFloat(SingleMatchPropsalsJson[x].rateAmt) * (SingleMatchPropsalsJson[x].week06 == "" ? 0.0 : parseInt(SingleMatchPropsalsJson[x].week06)));
            wk7Dollars = parseFloat(wk7Dollars) + (parseFloat(SingleMatchPropsalsJson[x].rateAmt) * (SingleMatchPropsalsJson[x].week07 == "" ? 0.0 : parseInt(SingleMatchPropsalsJson[x].week07)));
            wk8Dollars = parseFloat(wk8Dollars) + (parseFloat(SingleMatchPropsalsJson[x].rateAmt) * (SingleMatchPropsalsJson[x].week08 == "" ? 0.0 : parseInt(SingleMatchPropsalsJson[x].week08)));
            wk9Dollars = parseFloat(wk9Dollars) + (parseFloat(SingleMatchPropsalsJson[x].rateAmt) * (SingleMatchPropsalsJson[x].week09 == "" ? 0.0 : parseInt(SingleMatchPropsalsJson[x].week09)));
            wk10Dollars = parseFloat(wk10Dollars) + (parseFloat(SingleMatchPropsalsJson[x].rateAmt) * (SingleMatchPropsalsJson[x].week10 == "" ? 0.0 : parseInt(SingleMatchPropsalsJson[x].week10)));
            wk11Dollars = parseFloat(wk11Dollars) + (parseFloat(SingleMatchPropsalsJson[x].rateAmt) * (SingleMatchPropsalsJson[x].week11 == "" ? 0.0 : parseInt(SingleMatchPropsalsJson[x].week11)));
            wk12Dollars = parseFloat(wk12Dollars) + (parseFloat(SingleMatchPropsalsJson[x].rateAmt) * (SingleMatchPropsalsJson[x].week12 == "" ? 0.0 : parseInt(SingleMatchPropsalsJson[x].week12)));
            wk13Dollars = parseFloat(wk13Dollars) + (parseFloat(SingleMatchPropsalsJson[x].rateAmt) * (SingleMatchPropsalsJson[x].week13 == "" ? 0.0 : parseInt(SingleMatchPropsalsJson[x].week13)));
            wk14Dollars = parseFloat(wk14Dollars) + (parseFloat(SingleMatchPropsalsJson[x].rateAmt) * (SingleMatchPropsalsJson[x].week14 == "" ? 0.0 : parseInt(SingleMatchPropsalsJson[x].week14)));
        }
        // GI
        {
            if (!isNaN(SingleMatchPropsalsJson[x].week01) && parseInt(SingleMatchPropsalsJson[x].week01) > 0) {
                if (!isNaN(SingleMatchPropsalsJson[x].impressions) && parseInt(SingleMatchPropsalsJson[x].impressions) > 0) {
                    wk1GI = parseFloat(wk1GI) + (parseFloat(SingleMatchPropsalsJson[x].impressions) * parseFloat(SingleMatchPropsalsJson[x].week01));
                }
            }
            if (!isNaN(SingleMatchPropsalsJson[x].week02) && parseInt(SingleMatchPropsalsJson[x].week02) > 0) {
                if (!isNaN(SingleMatchPropsalsJson[x].impressions) && parseInt(SingleMatchPropsalsJson[x].impressions) > 0) {
                    wk2GI = parseFloat(wk2GI) + (parseFloat(SingleMatchPropsalsJson[x].impressions) * parseFloat(SingleMatchPropsalsJson[x].week02));
                }
            }
            if (!isNaN(SingleMatchPropsalsJson[x].week03) && parseInt(SingleMatchPropsalsJson[x].week03) > 0) {
                if (!isNaN(SingleMatchPropsalsJson[x].impressions) && parseInt(SingleMatchPropsalsJson[x].impressions) > 0) {
                    wk3GI = parseFloat(wk3GI) + (parseFloat(SingleMatchPropsalsJson[x].impressions) * parseFloat(SingleMatchPropsalsJson[x].week03));
                }
            }

            if (!isNaN(SingleMatchPropsalsJson[x].week04) && parseInt(SingleMatchPropsalsJson[x].week04) > 0) {
                if (!isNaN(SingleMatchPropsalsJson[x].impressions) && parseInt(SingleMatchPropsalsJson[x].impressions) > 0) {
                    wk4GI = parseFloat(wk4GI) + (parseFloat(SingleMatchPropsalsJson[x].impressions) * parseFloat(SingleMatchPropsalsJson[x].week04));
                }
            }
            if (!isNaN(SingleMatchPropsalsJson[x].week05) && parseInt(SingleMatchPropsalsJson[x].week05) > 0) {
                if (!isNaN(SingleMatchPropsalsJson[x].impressions) && parseInt(SingleMatchPropsalsJson[x].impressions) > 0) {
                    wk5GI = parseFloat(wk5GI) + (parseFloat(SingleMatchPropsalsJson[x].impressions) * parseFloat(SingleMatchPropsalsJson[x].week05));
                }
            }
            if (!isNaN(SingleMatchPropsalsJson[x].week06) && parseInt(SingleMatchPropsalsJson[x].week06) > 0) {
                if (!isNaN(SingleMatchPropsalsJson[x].impressions) && parseInt(SingleMatchPropsalsJson[x].impressions) > 0) {
                    wk6GI = parseFloat(wk6GI) + (parseFloat(SingleMatchPropsalsJson[x].impressions) * parseFloat(SingleMatchPropsalsJson[x].week06));
                }
            }
            if (!isNaN(SingleMatchPropsalsJson[x].week07) && parseInt(SingleMatchPropsalsJson[x].week07) > 0) {
                if (!isNaN(SingleMatchPropsalsJson[x].impressions) && parseInt(SingleMatchPropsalsJson[x].impressions) > 0) {
                    wk7GI = parseFloat(wk7GI) + (parseFloat(SingleMatchPropsalsJson[x].impressions) * parseFloat(SingleMatchPropsalsJson[x].week07));
                }
            }
            if (!isNaN(SingleMatchPropsalsJson[x].week08) && parseInt(SingleMatchPropsalsJson[x].week08) > 0) {
                if (!isNaN(SingleMatchPropsalsJson[x].impressions) && parseInt(SingleMatchPropsalsJson[x].impressions) > 0) {
                    wk8GI = parseFloat(wk8GI) + (parseFloat(SingleMatchPropsalsJson[x].impressions) * parseFloat(SingleMatchPropsalsJson[x].week08));
                }
            }
            if (!isNaN(SingleMatchPropsalsJson[x].week09) && parseInt(SingleMatchPropsalsJson[x].week09) > 0) {
                if (!isNaN(SingleMatchPropsalsJson[x].impressions) && parseInt(SingleMatchPropsalsJson[x].impressions) > 0) {
                    wk9GI = parseFloat(wk9GI) + (parseFloat(SingleMatchPropsalsJson[x].impressions) * parseFloat(SingleMatchPropsalsJson[x].week09));
                }
            }
            if (!isNaN(SingleMatchPropsalsJson[x].week10) && parseInt(SingleMatchPropsalsJson[x].week10) > 0) {
                if (!isNaN(SingleMatchPropsalsJson[x].impressions) && parseInt(SingleMatchPropsalsJson[x].impressions) > 0) {
                    wk10GI = parseFloat(wk10GI) + (parseFloat(SingleMatchPropsalsJson[x].impressions) * parseFloat(SingleMatchPropsalsJson[x].week10));
                }
            }
            if (!isNaN(SingleMatchPropsalsJson[x].week11) && parseInt(SingleMatchPropsalsJson[x].week11) > 0) {
                if (!isNaN(SingleMatchPropsalsJson[x].impressions) && parseInt(SingleMatchPropsalsJson[x].impressions) > 0) {
                    wk11GI = parseFloat(wk11GI) + (parseFloat(SingleMatchPropsalsJson[x].impressions) * parseFloat(SingleMatchPropsalsJson[x].week11));
                }
            }
            if (!isNaN(SingleMatchPropsalsJson[x].week12) && parseInt(SingleMatchPropsalsJson[x].week12) > 0) {
                if (!isNaN(SingleMatchPropsalsJson[x].impressions) && parseInt(SingleMatchPropsalsJson[x].impressions) > 0) {
                    wk12GI = parseFloat(wk12GI) + (parseFloat(SingleMatchPropsalsJson[x].impressions) * parseFloat(SingleMatchPropsalsJson[x].week12));
                }
            }
            if (!isNaN(SingleMatchPropsalsJson[x].week13) && parseInt(SingleMatchPropsalsJson[x].week13) > 0) {
                if (!isNaN(SingleMatchPropsalsJson[x].impressions) && parseInt(SingleMatchPropsalsJson[x].impressions) > 0) {
                    wk13GI = parseFloat(wk13GI) + (parseFloat(SingleMatchPropsalsJson[x].impressions) * parseFloat(SingleMatchPropsalsJson[x].week13));
                }
            }
            if (!isNaN(SingleMatchPropsalsJson[x].week14) && parseInt(SingleMatchPropsalsJson[x].week14) > 0) {
                if (!isNaN(SingleMatchPropsalsJson[x].impressions) && parseInt(SingleMatchPropsalsJson[x].impressions) > 0) {
                    wk14GI = parseFloat(wk14GI) + (parseFloat(SingleMatchPropsalsJson[x].impressions) * parseFloat(SingleMatchPropsalsJson[x].week14));
                }
            }
            if (!isNaN(SingleMatchPropsalsJson[x].impressions) && parseFloat(SingleMatchPropsalsJson[x].impressions) > 0
                && !isNaN(SingleMatchPropsalsJson[x].totalSpots) && parseFloat(SingleMatchPropsalsJson[x].totalSpots) > 0)
                TotalGI = parseFloat(TotalGI) + (parseFloat(SingleMatchPropsalsJson[x].impressions) * parseFloat(SingleMatchPropsalsJson[x].totalSpots));
            else
                TotalGI = parseFloat(TotalGI) + 0.00;
        }
        // CPM
        {
            if (!isNaN(SingleMatchPropsalsJson[x].week01) && parseInt(SingleMatchPropsalsJson[x].week01) > 0) {
                if (!isNaN(SingleMatchPropsalsJson[x].impressions) && parseInt(SingleMatchPropsalsJson[x].impressions) > 0
                    && !isNaN(SingleMatchPropsalsJson[x].rateAmt) && parseInt(SingleMatchPropsalsJson[x].rateAmt) > 0) {
                    // wk1CPM = parseFloat(wk1CPM) + (parseFloat(SingleMatchPropsalsJson[x].rateAmt) / parseFloat(SingleMatchPropsalsJson[x].impressions)) / parseFloat(SingleMatchPropsalsJson[x].week01);
                    if (wk1GI > 0) {
                        wk1CPM = parseFloat(wk1Dollars / wk1GI)
                    }
                    else {
                        wk1CPM = parseFloat(0);
                    }
                }
            }
            if (!isNaN(SingleMatchPropsalsJson[x].week02) && parseInt(SingleMatchPropsalsJson[x].week02) > 0) {
                if (!isNaN(SingleMatchPropsalsJson[x].impressions) && parseInt(SingleMatchPropsalsJson[x].impressions) > 0
                    && !isNaN(SingleMatchPropsalsJson[x].rateAmt) && parseInt(SingleMatchPropsalsJson[x].rateAmt) > 0) {
                    // wk2CPM = parseFloat(wk2CPM) + (parseFloat(SingleMatchPropsalsJson[x].rateAmt) / parseFloat(SingleMatchPropsalsJson[x].impressions)) / parseFloat(SingleMatchPropsalsJson[x].week02);
                    if (wk2GI > 0) {
                        wk2CPM = parseFloat(wk2Dollars / wk2GI)
                    }
                    else {
                        wk2CPM = parseFloat(0);
                    }
                }
            }
            if (!isNaN(SingleMatchPropsalsJson[x].week03) && parseInt(SingleMatchPropsalsJson[x].week03) > 0) {
                if (!isNaN(SingleMatchPropsalsJson[x].impressions) && parseInt(SingleMatchPropsalsJson[x].impressions) > 0
                    && !isNaN(SingleMatchPropsalsJson[x].rateAmt) && parseInt(SingleMatchPropsalsJson[x].rateAmt) > 0) {
                    // wk3CPM = parseFloat(wk3CPM) + (parseFloat(SingleMatchPropsalsJson[x].rateAmt) / parseFloat(SingleMatchPropsalsJson[x].impressions)) / parseFloat(SingleMatchPropsalsJson[x].week03);
                    if (wk3GI > 0) {
                        wk3CPM = parseFloat(wk3Dollars / wk3GI)
                    }
                    else {
                        wk3CPM = parseFloat(0);
                    }
                }
            }
            if (!isNaN(SingleMatchPropsalsJson[x].week04) && parseInt(SingleMatchPropsalsJson[x].week04) > 0) {
                if (!isNaN(SingleMatchPropsalsJson[x].impressions) && parseInt(SingleMatchPropsalsJson[x].impressions) > 0
                    && !isNaN(SingleMatchPropsalsJson[x].rateAmt) && parseInt(SingleMatchPropsalsJson[x].rateAmt) > 0) {
                    //wk4CPM = parseFloat(wk4CPM) + (parseFloat(SingleMatchPropsalsJson[x].rateAmt) / parseFloat(SingleMatchPropsalsJson[x].impressions)) / parseFloat(SingleMatchPropsalsJson[x].week04);
                    if (wk4GI > 0) {
                        wk4CPM = parseFloat(wk4Dollars / wk4GI)
                    }
                    else {
                        wk4CPM = parseFloat(0);
                    }
                }
            }
            if (!isNaN(SingleMatchPropsalsJson[x].week05) && parseInt(SingleMatchPropsalsJson[x].week05) > 0) {
                if (!isNaN(SingleMatchPropsalsJson[x].impressions) && parseInt(SingleMatchPropsalsJson[x].impressions) > 0
                    && !isNaN(SingleMatchPropsalsJson[x].rateAmt) && parseInt(SingleMatchPropsalsJson[x].rateAmt) > 0) {
                    //wk5CPM = parseFloat(wk5CPM) + (parseFloat(SingleMatchPropsalsJson[x].rateAmt) / parseFloat(SingleMatchPropsalsJson[x].impressions)) / parseFloat(SingleMatchPropsalsJson[x].week05);
                    if (wk5GI > 0) {
                        wk5CPM = parseFloat(wk5Dollars / wk5GI)
                    }
                    else {
                        wk5CPM = parseFloat(0);
                    }
                }
            }

            if (!isNaN(SingleMatchPropsalsJson[x].week06) && parseInt(SingleMatchPropsalsJson[x].week06) > 0) {
                if (!isNaN(SingleMatchPropsalsJson[x].impressions) && parseInt(SingleMatchPropsalsJson[x].impressions) > 0
                    && !isNaN(SingleMatchPropsalsJson[x].rateAmt) && parseInt(SingleMatchPropsalsJson[x].rateAmt) > 0) {
                    //wk6CPM = parseFloat(wk6CPM) + (parseFloat(SingleMatchPropsalsJson[x].rateAmt) / parseFloat(SingleMatchPropsalsJson[x].impressions)) / parseFloat(SingleMatchPropsalsJson[x].week06);
                    if (wk6GI > 0) {
                        wk6CPM = parseFloat(wk6Dollars / wk6GI)
                    }
                    else {
                        wk6CPM = parseFloat(0);
                    }
                }
            }

            if (!isNaN(SingleMatchPropsalsJson[x].week07) && parseInt(SingleMatchPropsalsJson[x].week07) > 0) {
                if (!isNaN(SingleMatchPropsalsJson[x].impressions) && parseInt(SingleMatchPropsalsJson[x].impressions) > 0
                    && !isNaN(SingleMatchPropsalsJson[x].rateAmt) && parseInt(SingleMatchPropsalsJson[x].rateAmt) > 0) {
                    // wk7CPM = parseFloat(wk7CPM) + (parseFloat(SingleMatchPropsalsJson[x].rateAmt) / parseFloat(SingleMatchPropsalsJson[x].impressions)) / parseFloat(SingleMatchPropsalsJson[x].week07);
                    if (wk7GI > 0) {
                        wk7CPM = parseFloat(wk7Dollars / wk7GI)
                    }
                    else {
                        wk7CPM = parseFloat(0);
                    }
                }
            }
            if (!isNaN(SingleMatchPropsalsJson[x].week08) && parseInt(SingleMatchPropsalsJson[x].week08) > 0) {
                if (!isNaN(SingleMatchPropsalsJson[x].impressions) && parseInt(SingleMatchPropsalsJson[x].impressions) > 0
                    && !isNaN(SingleMatchPropsalsJson[x].rateAmt) && parseInt(SingleMatchPropsalsJson[x].rateAmt) > 0) {
                    // wk8CPM = parseFloat(wk8CPM) + (parseFloat(SingleMatchPropsalsJson[x].rateAmt) / parseFloat(SingleMatchPropsalsJson[x].impressions)) / parseFloat(SingleMatchPropsalsJson[x].week08);
                    if (wk8GI > 0) {
                        wk8CPM = parseFloat(wk8Dollars / wk8GI)
                    }
                    else {
                        wk8CPM = parseFloat(0);
                    }
                }
            }
            if (!isNaN(SingleMatchPropsalsJson[x].week09) && parseInt(SingleMatchPropsalsJson[x].week09) > 0) {
                if (!isNaN(SingleMatchPropsalsJson[x].impressions) && parseInt(SingleMatchPropsalsJson[x].impressions) > 0
                    && !isNaN(SingleMatchPropsalsJson[x].rateAmt) && parseInt(SingleMatchPropsalsJson[x].rateAmt) > 0) {
                    //wk9CPM = parseFloat(wk9CPM) + (parseFloat(SingleMatchPropsalsJson[x].rateAmt) / parseFloat(SingleMatchPropsalsJson[x].impressions)) / parseFloat(SingleMatchPropsalsJson[x].week09);
                    if (wk9GI > 0) {
                        wk9CPM = parseFloat(wk9Dollars / wk9GI)
                    }
                    else {
                        wk9CPM = parseFloat(0);
                    }
                }
            }
            if (!isNaN(SingleMatchPropsalsJson[x].week10) && parseInt(SingleMatchPropsalsJson[x].week10) > 0) {
                if (!isNaN(SingleMatchPropsalsJson[x].impressions) && parseInt(SingleMatchPropsalsJson[x].impressions) > 0
                    && !isNaN(SingleMatchPropsalsJson[x].rateAmt) && parseInt(SingleMatchPropsalsJson[x].rateAmt) > 0) {
                    //wk10CPM = parseFloat(wk10CPM) + (parseFloat(SingleMatchPropsalsJson[x].rateAmt) / parseFloat(SingleMatchPropsalsJson[x].impressions)) / parseFloat(SingleMatchPropsalsJson[x].week10);
                    if (wk10GI > 0) {
                        wk10CPM = parseFloat(wk10Dollars / wk10GI)
                    }
                    else {
                        wk10CPM = parseFloat(0);
                    }
                }
            }
            if (!isNaN(SingleMatchPropsalsJson[x].week11) && parseInt(SingleMatchPropsalsJson[x].week11) > 0) {
                if (!isNaN(SingleMatchPropsalsJson[x].impressions) && parseInt(SingleMatchPropsalsJson[x].impressions) > 0
                    && !isNaN(SingleMatchPropsalsJson[x].rateAmt) && parseInt(SingleMatchPropsalsJson[x].rateAmt) > 0) {
                    //wk11CPM = parseFloat(wk11CPM) + (parseFloat(SingleMatchPropsalsJson[x].rateAmt) / parseFloat(SingleMatchPropsalsJson[x].impressions)) / parseFloat(SingleMatchPropsalsJson[x].week11);
                    if (wk11GI > 0) {
                        wk11CPM = parseFloat(wk11Dollars / wk11GI)
                    }
                    else {
                        wk11CPM = parseFloat(0);
                    }
                }
            }
            if (!isNaN(SingleMatchPropsalsJson[x].week12) && parseInt(SingleMatchPropsalsJson[x].week12) > 0) {
                if (!isNaN(SingleMatchPropsalsJson[x].impressions) && parseInt(SingleMatchPropsalsJson[x].impressions) > 0
                    && !isNaN(SingleMatchPropsalsJson[x].rateAmt) && parseInt(SingleMatchPropsalsJson[x].rateAmt) > 0) {
                    //wk12CPM = parseFloat(wk12CPM) + (parseFloat(SingleMatchPropsalsJson[x].rateAmt) / parseFloat(SingleMatchPropsalsJson[x].impressions)) / parseFloat(SingleMatchPropsalsJson[x].week12);
                    if (wk12GI > 0) {
                        wk12CPM = parseFloat(wk12Dollars / wk12GI)
                    }
                    else {
                        wk12CPM = parseFloat(0);
                    }
                }
            }
            if (!isNaN(SingleMatchPropsalsJson[x].week13) && parseInt(SingleMatchPropsalsJson[x].week13) > 0) {
                if (!isNaN(SingleMatchPropsalsJson[x].impressions) && parseInt(SingleMatchPropsalsJson[x].impressions) > 0
                    && !isNaN(SingleMatchPropsalsJson[x].rateAmt) && parseInt(SingleMatchPropsalsJson[x].rateAmt) > 0) {
                    //wk13CPM = parseFloat(wk13CPM) + (parseFloat(SingleMatchPropsalsJson[x].rateAmt) / parseFloat(SingleMatchPropsalsJson[x].impressions)) / parseFloat(SingleMatchPropsalsJson[x].week13);
                    if (wk13GI > 0) {
                        wk13CPM = parseFloat(wk13Dollars / wk13GI)
                    }
                    else {
                        wk13CPM = parseFloat(0);
                    }
                }
            }

            if (!isNaN(SingleMatchPropsalsJson[x].week14) && parseInt(SingleMatchPropsalsJson[x].week14) > 0) {
                if (!isNaN(SingleMatchPropsalsJson[x].impressions) && parseInt(SingleMatchPropsalsJson[x].impressions) > 0
                    && !isNaN(SingleMatchPropsalsJson[x].rateAmt) && parseInt(SingleMatchPropsalsJson[x].rateAmt) > 0) {
                    //wk14CPM = parseFloat(wk14CPM) + (parseFloat(SingleMatchPropsalsJson[x].rateAmt) / parseFloat(SingleMatchPropsalsJson[x].impressions)) / parseFloat(SingleMatchPropsalsJson[x].week14);
                    if (wk14GI > 0) {
                        wk14CPM = parseFloat(wk14Dollars / wk14GI)
                    }
                    else {
                        wk14CPM = parseFloat(0);
                    }
                }
            }
            if (TotalGI > 0) {
                TotalCPM = parseFloat(TotalDollars / TotalGI);
            }
            else {
                TotalCPM = parseFloat(0);
            }
        }
    }

    // OM DOLLARS
    {
        TotalSectionArrayPM.filter(o => o.propertyId == 6)[0].totalSpots = parseFloat(TotalDollars).toFixed(2);
        TotalSectionArrayPM.filter(o => o.propertyId == 6)[0].week01 = isNaN(wk1Dollars) ? 0 : wk1Dollars;
        TotalSectionArrayPM.filter(o => o.propertyId == 6)[0].week02 = isNaN(wk2Dollars) ? 0 : wk2Dollars;
        TotalSectionArrayPM.filter(o => o.propertyId == 6)[0].week03 = isNaN(wk3Dollars) ? 0 : wk3Dollars;
        TotalSectionArrayPM.filter(o => o.propertyId == 6)[0].week04 = isNaN(wk4Dollars) ? 0 : wk4Dollars;
        TotalSectionArrayPM.filter(o => o.propertyId == 6)[0].week05 = isNaN(wk5Dollars) ? 0 : wk5Dollars;
        TotalSectionArrayPM.filter(o => o.propertyId == 6)[0].week06 = isNaN(wk6Dollars) ? 0 : wk6Dollars;
        TotalSectionArrayPM.filter(o => o.propertyId == 6)[0].week07 = isNaN(wk7Dollars) ? 0 : wk7Dollars;
        TotalSectionArrayPM.filter(o => o.propertyId == 6)[0].week08 = isNaN(wk8Dollars) ? 0 : wk8Dollars;
        TotalSectionArrayPM.filter(o => o.propertyId == 6)[0].week09 = isNaN(wk9Dollars) ? 0 : wk9Dollars;
        TotalSectionArrayPM.filter(o => o.propertyId == 6)[0].week10 = isNaN(wk10Dollars) ? 0 : wk10Dollars;
        TotalSectionArrayPM.filter(o => o.propertyId == 6)[0].week11 = isNaN(wk11Dollars) ? 0 : wk11Dollars;
        TotalSectionArrayPM.filter(o => o.propertyId == 6)[0].week12 = isNaN(wk12Dollars) ? 0 : wk12Dollars;
        TotalSectionArrayPM.filter(o => o.propertyId == 6)[0].week13 = isNaN(wk13Dollars) ? 0 : wk13Dollars;
        TotalSectionArrayPM.filter(o => o.propertyId == 6)[0].week14 = isNaN(wk14Dollars) ? 0 : wk14Dollars;
    }
    // OM CPM
    {
        if (TotalGI > 0)
            TotalSectionArrayPM.filter(o => o.propertyId == 7)[0].totalSpots = parseFloat(TotalDollars / TotalGI).toFixed(2);
        else
            TotalSectionArrayPM.filter(o => o.propertyId == 7)[0].totalSpots = 0;

        TotalSectionArrayPM.filter(o => o.propertyId == 7)[0].week01 = isNaN(wk1CPM) ? 0 : wk1CPM;
        TotalSectionArrayPM.filter(o => o.propertyId == 7)[0].week02 = isNaN(wk2CPM) ? 0 : wk2CPM;
        TotalSectionArrayPM.filter(o => o.propertyId == 7)[0].week03 = isNaN(wk3CPM) ? 0 : wk3CPM;
        TotalSectionArrayPM.filter(o => o.propertyId == 7)[0].week04 = isNaN(wk4CPM) ? 0 : wk4CPM;
        TotalSectionArrayPM.filter(o => o.propertyId == 7)[0].week05 = isNaN(wk5CPM) ? 0 : wk5CPM;
        TotalSectionArrayPM.filter(o => o.propertyId == 7)[0].week06 = isNaN(wk6CPM) ? 0 : wk6CPM;
        TotalSectionArrayPM.filter(o => o.propertyId == 7)[0].week07 = isNaN(wk7CPM) ? 0 : wk7CPM;
        TotalSectionArrayPM.filter(o => o.propertyId == 7)[0].week08 = isNaN(wk8CPM) ? 0 : wk8CPM;
        TotalSectionArrayPM.filter(o => o.propertyId == 7)[0].week09 = isNaN(wk9CPM) ? 0 : wk9CPM;
        TotalSectionArrayPM.filter(o => o.propertyId == 7)[0].week10 = isNaN(wk10CPM) ? 0 : wk10CPM;
        TotalSectionArrayPM.filter(o => o.propertyId == 7)[0].week11 = isNaN(wk11CPM) ? 0 : wk11CPM;
        TotalSectionArrayPM.filter(o => o.propertyId == 7)[0].week12 = isNaN(wk12CPM) ? 0 : wk12CPM;
        TotalSectionArrayPM.filter(o => o.propertyId == 7)[0].week13 = isNaN(wk13CPM) ? 0 : wk13CPM;
        TotalSectionArrayPM.filter(o => o.propertyId == 7)[0].week14 = isNaN(wk14CPM) ? 0 : wk14CPM;
    }
    // OM GI
    {
        TotalSectionArrayPM.filter(o => o.propertyId == 8)[0].totalSpots = parseFloat(TotalGI).toFixed(2);
        TotalSectionArrayPM.filter(o => o.propertyId == 8)[0].week01 = isNaN(wk1GI) ? 0 : wk1GI;
        TotalSectionArrayPM.filter(o => o.propertyId == 8)[0].week02 = isNaN(wk2GI) ? 0 : wk2GI;
        TotalSectionArrayPM.filter(o => o.propertyId == 8)[0].week03 = isNaN(wk3GI) ? 0 : wk3GI;
        TotalSectionArrayPM.filter(o => o.propertyId == 8)[0].week04 = isNaN(wk4GI) ? 0 : wk4GI;
        TotalSectionArrayPM.filter(o => o.propertyId == 8)[0].week05 = isNaN(wk5GI) ? 0 : wk5GI;
        TotalSectionArrayPM.filter(o => o.propertyId == 8)[0].week06 = isNaN(wk6GI) ? 0 : wk6GI;
        TotalSectionArrayPM.filter(o => o.propertyId == 8)[0].week07 = isNaN(wk7GI) ? 0 : wk7GI;
        TotalSectionArrayPM.filter(o => o.propertyId == 8)[0].week08 = isNaN(wk8GI) ? 0 : wk8GI;
        TotalSectionArrayPM.filter(o => o.propertyId == 8)[0].week09 = isNaN(wk9GI) ? 0 : wk9GI;
        TotalSectionArrayPM.filter(o => o.propertyId == 8)[0].week10 = isNaN(wk10GI) ? 0 : wk10GI;
        TotalSectionArrayPM.filter(o => o.propertyId == 8)[0].week11 = isNaN(wk11GI) ? 0 : wk11GI;
        TotalSectionArrayPM.filter(o => o.propertyId == 8)[0].week12 = isNaN(wk12GI) ? 0 : wk12GI;
        TotalSectionArrayPM.filter(o => o.propertyId == 8)[0].week13 = isNaN(wk13GI) ? 0 : wk13GI;
        TotalSectionArrayPM.filter(o => o.propertyId == 8)[0].week14 = isNaN(wk14GI) ? 0 : wk14GI;
    }
    // NETWORK TOTAL SECTION
    for (var x = 0; x < UnMatchPropsalsJson.length; x++) {
        //TOTAL SPOTS
        {
            TotalSpots = parseInt(TotalSpots) + parseInt(UnMatchPropsalsJson[x].totalSpots);
            wk1Spots = parseInt(wk1Spots) + (UnMatchPropsalsJson[x].week01 == "" ? 0 : parseInt(UnMatchPropsalsJson[x].week01));
            wk2Spots = parseInt(wk2Spots) + (UnMatchPropsalsJson[x].week02 == "" ? 0 : parseInt(UnMatchPropsalsJson[x].week02));
            wk3Spots = parseInt(wk3Spots) + (UnMatchPropsalsJson[x].week03 == "" ? 0 : parseInt(UnMatchPropsalsJson[x].week03));
            wk4Spots = parseInt(wk4Spots) + (UnMatchPropsalsJson[x].week04 == "" ? 0 : parseInt(UnMatchPropsalsJson[x].week04));
            wk5Spots = parseInt(wk5Spots) + (UnMatchPropsalsJson[x].week05 == "" ? 0 : parseInt(UnMatchPropsalsJson[x].week05));
            wk6Spots = parseInt(wk6Spots) + (UnMatchPropsalsJson[x].week06 == "" ? 0 : parseInt(UnMatchPropsalsJson[x].week06));
            wk7Spots = parseInt(wk7Spots) + (UnMatchPropsalsJson[x].week07 == "" ? 0 : parseInt(UnMatchPropsalsJson[x].week07));
            wk8Spots = parseInt(wk8Spots) + (UnMatchPropsalsJson[x].week08 == "" ? 0 : parseInt(UnMatchPropsalsJson[x].week08));
            wk9Spots = parseInt(wk9Spots) + (UnMatchPropsalsJson[x].week09 == "" ? 0 : parseInt(UnMatchPropsalsJson[x].week09));
            wk10Spots = parseInt(wk10Spots) + (UnMatchPropsalsJson[x].week10 == "" ? 0 : parseInt(UnMatchPropsalsJson[x].week10));
            wk11Spots = parseInt(wk11Spots) + (UnMatchPropsalsJson[x].week11 == "" ? 0 : parseInt(UnMatchPropsalsJson[x].week11));
            wk12Spots = parseInt(wk12Spots) + (UnMatchPropsalsJson[x].week12 == "" ? 0 : parseInt(UnMatchPropsalsJson[x].week12));
            wk13Spots = parseInt(wk13Spots) + (UnMatchPropsalsJson[x].week13 == "" ? 0 : parseInt(UnMatchPropsalsJson[x].week13));
            wk14Spots = parseInt(wk14Spots) + (UnMatchPropsalsJson[x].week14 == "" ? 0 : parseInt(UnMatchPropsalsJson[x].week14));
        }
        // DOLLAR
        {

            TotalDollars = parseFloat(TotalDollars) + (parseFloat(UnMatchPropsalsJson[x].rateAmt) * parseFloat(UnMatchPropsalsJson[x].totalSpots));
            wk1Dollars = parseFloat(wk1Dollars) + (parseFloat(UnMatchPropsalsJson[x].rateAmt) * (UnMatchPropsalsJson[x].week01 == "" ? 0.0 : parseInt(UnMatchPropsalsJson[x].week01)));
            wk2Dollars = parseFloat(wk2Dollars) + (parseFloat(UnMatchPropsalsJson[x].rateAmt) * (UnMatchPropsalsJson[x].week02 == "" ? 0.0 : parseInt(UnMatchPropsalsJson[x].week02)));
            wk3Dollars = parseFloat(wk3Dollars) + (parseFloat(UnMatchPropsalsJson[x].rateAmt) * (UnMatchPropsalsJson[x].week03 == "" ? 0.0 : parseInt(UnMatchPropsalsJson[x].week03)));
            wk4Dollars = parseFloat(wk4Dollars) + (parseFloat(UnMatchPropsalsJson[x].rateAmt) * (UnMatchPropsalsJson[x].week04 == "" ? 0.0 : parseInt(UnMatchPropsalsJson[x].week04)));
            wk5Dollars = parseFloat(wk5Dollars) + (parseFloat(UnMatchPropsalsJson[x].rateAmt) * (UnMatchPropsalsJson[x].week05 == "" ? 0.0 : parseInt(UnMatchPropsalsJson[x].week05)));
            wk6Dollars = parseFloat(wk6Dollars) + (parseFloat(UnMatchPropsalsJson[x].rateAmt) * (UnMatchPropsalsJson[x].week06 == "" ? 0.0 : parseInt(UnMatchPropsalsJson[x].week06)));
            wk7Dollars = parseFloat(wk7Dollars) + (parseFloat(UnMatchPropsalsJson[x].rateAmt) * (UnMatchPropsalsJson[x].week07 == "" ? 0.0 : parseInt(UnMatchPropsalsJson[x].week07)));
            wk8Dollars = parseFloat(wk8Dollars) + (parseFloat(UnMatchPropsalsJson[x].rateAmt) * (UnMatchPropsalsJson[x].week08 == "" ? 0.0 : parseInt(UnMatchPropsalsJson[x].week08)));
            wk9Dollars = parseFloat(wk9Dollars) + (parseFloat(UnMatchPropsalsJson[x].rateAmt) * (UnMatchPropsalsJson[x].week09 == "" ? 0.0 : parseInt(UnMatchPropsalsJson[x].week09)));
            wk10Dollars = parseFloat(wk10Dollars) + (parseFloat(UnMatchPropsalsJson[x].rateAmt) * (UnMatchPropsalsJson[x].week10 == "" ? 0.0 : parseInt(UnMatchPropsalsJson[x].week10)));
            wk11Dollars = parseFloat(wk11Dollars) + (parseFloat(UnMatchPropsalsJson[x].rateAmt) * (UnMatchPropsalsJson[x].week11 == "" ? 0.0 : parseInt(UnMatchPropsalsJson[x].week11)));
            wk12Dollars = parseFloat(wk12Dollars) + (parseFloat(UnMatchPropsalsJson[x].rateAmt) * (UnMatchPropsalsJson[x].week12 == "" ? 0.0 : parseInt(UnMatchPropsalsJson[x].week12)));
            wk13Dollars = parseFloat(wk13Dollars) + (parseFloat(UnMatchPropsalsJson[x].rateAmt) * (UnMatchPropsalsJson[x].week13 == "" ? 0.0 : parseInt(UnMatchPropsalsJson[x].week13)));
            wk14Dollars = parseFloat(wk14Dollars) + (parseFloat(UnMatchPropsalsJson[x].rateAmt) * (UnMatchPropsalsJson[x].week14 == "" ? 0.0 : parseInt(UnMatchPropsalsJson[x].week14)));
        }
        // GI
        {
            if (!isNaN(UnMatchPropsalsJson[x].week01) && parseInt(UnMatchPropsalsJson[x].week01) > 0) {
                if (!isNaN(UnMatchPropsalsJson[x].impressions) && parseInt(UnMatchPropsalsJson[x].impressions) > 0) {
                    wk1GI = parseFloat(wk1GI) + (parseFloat(UnMatchPropsalsJson[x].impressions) * parseFloat(UnMatchPropsalsJson[x].week01));
                }
            }
            if (!isNaN(UnMatchPropsalsJson[x].week02) && parseInt(UnMatchPropsalsJson[x].week02) > 0) {
                if (!isNaN(UnMatchPropsalsJson[x].impressions) && parseInt(UnMatchPropsalsJson[x].impressions) > 0) {
                    wk2GI = parseFloat(wk2GI) + (parseFloat(UnMatchPropsalsJson[x].impressions) * parseFloat(UnMatchPropsalsJson[x].week02));
                }
            }
            if (!isNaN(UnMatchPropsalsJson[x].week03) && parseInt(UnMatchPropsalsJson[x].week03) > 0) {
                if (!isNaN(UnMatchPropsalsJson[x].impressions) && parseInt(UnMatchPropsalsJson[x].impressions) > 0) {
                    wk3GI = parseFloat(wk3GI) + (parseFloat(UnMatchPropsalsJson[x].impressions) * parseFloat(UnMatchPropsalsJson[x].week03));
                }
            }

            if (!isNaN(UnMatchPropsalsJson[x].week04) && parseInt(UnMatchPropsalsJson[x].week04) > 0) {
                if (!isNaN(UnMatchPropsalsJson[x].impressions) && parseInt(UnMatchPropsalsJson[x].impressions) > 0) {
                    wk4GI = parseFloat(wk4GI) + (parseFloat(UnMatchPropsalsJson[x].impressions) * parseFloat(UnMatchPropsalsJson[x].week04));
                }
            }
            if (!isNaN(UnMatchPropsalsJson[x].week05) && parseInt(UnMatchPropsalsJson[x].week05) > 0) {
                if (!isNaN(UnMatchPropsalsJson[x].impressions) && parseInt(UnMatchPropsalsJson[x].impressions) > 0) {
                    wk5GI = parseFloat(wk5GI) + (parseFloat(UnMatchPropsalsJson[x].impressions) * parseFloat(UnMatchPropsalsJson[x].week05));
                }
            }
            if (!isNaN(UnMatchPropsalsJson[x].week06) && parseInt(UnMatchPropsalsJson[x].week06) > 0) {
                if (!isNaN(UnMatchPropsalsJson[x].impressions) && parseInt(UnMatchPropsalsJson[x].impressions) > 0) {
                    wk6GI = parseFloat(wk6GI) + (parseFloat(UnMatchPropsalsJson[x].impressions) * parseFloat(UnMatchPropsalsJson[x].week06));
                }
            }
            if (!isNaN(UnMatchPropsalsJson[x].week07) && parseInt(UnMatchPropsalsJson[x].week07) > 0) {
                if (!isNaN(UnMatchPropsalsJson[x].impressions) && parseInt(UnMatchPropsalsJson[x].impressions) > 0) {
                    wk7GI = parseFloat(wk7GI) + (parseFloat(UnMatchPropsalsJson[x].impressions) * parseFloat(UnMatchPropsalsJson[x].week07));
                }
            }
            if (!isNaN(UnMatchPropsalsJson[x].week08) && parseInt(UnMatchPropsalsJson[x].week08) > 0) {
                if (!isNaN(UnMatchPropsalsJson[x].impressions) && parseInt(UnMatchPropsalsJson[x].impressions) > 0) {
                    wk8GI = parseFloat(wk8GI) + (parseFloat(UnMatchPropsalsJson[x].impressions) * parseFloat(UnMatchPropsalsJson[x].week08));
                }
            }
            if (!isNaN(UnMatchPropsalsJson[x].week09) && parseInt(UnMatchPropsalsJson[x].week09) > 0) {
                if (!isNaN(UnMatchPropsalsJson[x].impressions) && parseInt(UnMatchPropsalsJson[x].impressions) > 0) {
                    wk9GI = parseFloat(wk9GI) + (parseFloat(UnMatchPropsalsJson[x].impressions) * parseFloat(UnMatchPropsalsJson[x].week09));
                }
            }
            if (!isNaN(UnMatchPropsalsJson[x].week10) && parseInt(UnMatchPropsalsJson[x].week10) > 0) {
                if (!isNaN(UnMatchPropsalsJson[x].impressions) && parseInt(UnMatchPropsalsJson[x].impressions) > 0) {
                    wk10GI = parseFloat(wk10GI) + (parseFloat(UnMatchPropsalsJson[x].impressions) * parseFloat(UnMatchPropsalsJson[x].week10));
                }
            }
            if (!isNaN(UnMatchPropsalsJson[x].week11) && parseInt(UnMatchPropsalsJson[x].week11) > 0) {
                if (!isNaN(UnMatchPropsalsJson[x].impressions) && parseInt(UnMatchPropsalsJson[x].impressions) > 0) {
                    wk11GI = parseFloat(wk11GI) + (parseFloat(UnMatchPropsalsJson[x].impressions) * parseFloat(UnMatchPropsalsJson[x].week11));
                }
            }
            if (!isNaN(UnMatchPropsalsJson[x].week12) && parseInt(UnMatchPropsalsJson[x].week12) > 0) {
                if (!isNaN(UnMatchPropsalsJson[x].impressions) && parseInt(UnMatchPropsalsJson[x].impressions) > 0) {
                    wk12GI = parseFloat(wk12GI) + (parseFloat(UnMatchPropsalsJson[x].impressions) * parseFloat(UnMatchPropsalsJson[x].week12));
                }
            }
            if (!isNaN(UnMatchPropsalsJson[x].week13) && parseInt(UnMatchPropsalsJson[x].week13) > 0) {
                if (!isNaN(UnMatchPropsalsJson[x].impressions) && parseInt(UnMatchPropsalsJson[x].impressions) > 0) {
                    wk13GI = parseFloat(wk13GI) + (parseFloat(UnMatchPropsalsJson[x].impressions) * parseFloat(UnMatchPropsalsJson[x].week13));
                }
            }
            if (!isNaN(UnMatchPropsalsJson[x].week14) && parseInt(UnMatchPropsalsJson[x].week14) > 0) {
                if (!isNaN(UnMatchPropsalsJson[x].impressions) && parseInt(UnMatchPropsalsJson[x].impressions) > 0) {
                    wk14GI = parseFloat(wk14GI) + (parseFloat(UnMatchPropsalsJson[x].impressions) * parseFloat(UnMatchPropsalsJson[x].week14));
                }
            }
            if (!isNaN(UnMatchPropsalsJson[x].impressions) && parseFloat(UnMatchPropsalsJson[x].impressions) > 0
                && !isNaN(UnMatchPropsalsJson[x].totalSpots) && parseFloat(UnMatchPropsalsJson[x].totalSpots) > 0)
                TotalGI = parseFloat(TotalGI) + (parseFloat(UnMatchPropsalsJson[x].impressions) * parseFloat(UnMatchPropsalsJson[x].totalSpots));
            else
                TotalGI = parseFloat(TotalGI) + 0.00;
        }
        // CPM
        {
            if (!isNaN(UnMatchPropsalsJson[x].week01) && parseInt(UnMatchPropsalsJson[x].week01) > 0) {
                if (!isNaN(UnMatchPropsalsJson[x].impressions) && parseInt(UnMatchPropsalsJson[x].impressions) > 0
                    && !isNaN(UnMatchPropsalsJson[x].rateAmt) && parseInt(UnMatchPropsalsJson[x].rateAmt) > 0) {
                    // wk1CPM = parseFloat(wk1CPM) + (parseFloat(UnMatchPropsalsJson[x].rateAmt) / parseFloat(UnMatchPropsalsJson[x].impressions)) / parseFloat(UnMatchPropsalsJson[x].week01);
                    if (wk1GI > 0) {
                        wk1CPM = parseFloat(wk1Dollars / wk1GI)
                    }
                    else {
                        wk1CPM = parseFloat(0);
                    }
                }
            }
            if (!isNaN(UnMatchPropsalsJson[x].week02) && parseInt(UnMatchPropsalsJson[x].week02) > 0) {
                if (!isNaN(UnMatchPropsalsJson[x].impressions) && parseInt(UnMatchPropsalsJson[x].impressions) > 0
                    && !isNaN(UnMatchPropsalsJson[x].rateAmt) && parseInt(UnMatchPropsalsJson[x].rateAmt) > 0) {
                    // wk2CPM = parseFloat(wk2CPM) + (parseFloat(UnMatchPropsalsJson[x].rateAmt) / parseFloat(UnMatchPropsalsJson[x].impressions)) / parseFloat(UnMatchPropsalsJson[x].week02);
                    if (wk2GI > 0) {
                        wk2CPM = parseFloat(wk2Dollars / wk2GI)
                    }
                    else {
                        wk2CPM = parseFloat(0);
                    }
                }
            }
            if (!isNaN(UnMatchPropsalsJson[x].week03) && parseInt(UnMatchPropsalsJson[x].week03) > 0) {
                if (!isNaN(UnMatchPropsalsJson[x].impressions) && parseInt(UnMatchPropsalsJson[x].impressions) > 0
                    && !isNaN(UnMatchPropsalsJson[x].rateAmt) && parseInt(UnMatchPropsalsJson[x].rateAmt) > 0) {
                    // wk3CPM = parseFloat(wk3CPM) + (parseFloat(UnMatchPropsalsJson[x].rateAmt) / parseFloat(UnMatchPropsalsJson[x].impressions)) / parseFloat(UnMatchPropsalsJson[x].week03);
                    if (wk3GI > 0) {
                        wk3CPM = parseFloat(wk3Dollars / wk3GI)
                    }
                    else {
                        wk3CPM = parseFloat(0);
                    }
                }
            }
            if (!isNaN(UnMatchPropsalsJson[x].week04) && parseInt(UnMatchPropsalsJson[x].week04) > 0) {
                if (!isNaN(UnMatchPropsalsJson[x].impressions) && parseInt(UnMatchPropsalsJson[x].impressions) > 0
                    && !isNaN(UnMatchPropsalsJson[x].rateAmt) && parseInt(UnMatchPropsalsJson[x].rateAmt) > 0) {
                    //wk4CPM = parseFloat(wk4CPM) + (parseFloat(UnMatchPropsalsJson[x].rateAmt) / parseFloat(UnMatchPropsalsJson[x].impressions)) / parseFloat(UnMatchPropsalsJson[x].week04);
                    if (wk4GI > 0) {
                        wk4CPM = parseFloat(wk4Dollars / wk4GI)
                    }
                    else {
                        wk4CPM = parseFloat(0);
                    }
                }
            }
            if (!isNaN(UnMatchPropsalsJson[x].week05) && parseInt(UnMatchPropsalsJson[x].week05) > 0) {
                if (!isNaN(UnMatchPropsalsJson[x].impressions) && parseInt(UnMatchPropsalsJson[x].impressions) > 0
                    && !isNaN(UnMatchPropsalsJson[x].rateAmt) && parseInt(UnMatchPropsalsJson[x].rateAmt) > 0) {
                    //wk5CPM = parseFloat(wk5CPM) + (parseFloat(UnMatchPropsalsJson[x].rateAmt) / parseFloat(UnMatchPropsalsJson[x].impressions)) / parseFloat(UnMatchPropsalsJson[x].week05);
                    if (wk5GI > 0) {
                        wk5CPM = parseFloat(wk5Dollars / wk5GI)
                    }
                    else {
                        wk5CPM = parseFloat(0);
                    }
                }
            }

            if (!isNaN(UnMatchPropsalsJson[x].week06) && parseInt(UnMatchPropsalsJson[x].week06) > 0) {
                if (!isNaN(UnMatchPropsalsJson[x].impressions) && parseInt(UnMatchPropsalsJson[x].impressions) > 0
                    && !isNaN(UnMatchPropsalsJson[x].rateAmt) && parseInt(UnMatchPropsalsJson[x].rateAmt) > 0) {
                    //wk6CPM = parseFloat(wk6CPM) + (parseFloat(UnMatchPropsalsJson[x].rateAmt) / parseFloat(UnMatchPropsalsJson[x].impressions)) / parseFloat(UnMatchPropsalsJson[x].week06);
                    if (wk6GI > 0) {
                        wk6CPM = parseFloat(wk6Dollars / wk6GI)
                    }
                    else {
                        wk6CPM = parseFloat(0);
                    }
                }
            }

            if (!isNaN(UnMatchPropsalsJson[x].week07) && parseInt(UnMatchPropsalsJson[x].week07) > 0) {
                if (!isNaN(UnMatchPropsalsJson[x].impressions) && parseInt(UnMatchPropsalsJson[x].impressions) > 0
                    && !isNaN(UnMatchPropsalsJson[x].rateAmt) && parseInt(UnMatchPropsalsJson[x].rateAmt) > 0) {
                    // wk7CPM = parseFloat(wk7CPM) + (parseFloat(UnMatchPropsalsJson[x].rateAmt) / parseFloat(UnMatchPropsalsJson[x].impressions)) / parseFloat(UnMatchPropsalsJson[x].week07);
                    if (wk7GI > 0) {
                        wk7CPM = parseFloat(wk7Dollars / wk7GI)
                    }
                    else {
                        wk7CPM = parseFloat(0);
                    }
                }
            }
            if (!isNaN(UnMatchPropsalsJson[x].week08) && parseInt(UnMatchPropsalsJson[x].week08) > 0) {
                if (!isNaN(UnMatchPropsalsJson[x].impressions) && parseInt(UnMatchPropsalsJson[x].impressions) > 0
                    && !isNaN(UnMatchPropsalsJson[x].rateAmt) && parseInt(UnMatchPropsalsJson[x].rateAmt) > 0) {
                    // wk8CPM = parseFloat(wk8CPM) + (parseFloat(UnMatchPropsalsJson[x].rateAmt) / parseFloat(UnMatchPropsalsJson[x].impressions)) / parseFloat(UnMatchPropsalsJson[x].week08);
                    if (wk8GI > 0) {
                        wk8CPM = parseFloat(wk8Dollars / wk8GI)
                    }
                    else {
                        wk8CPM = parseFloat(0);
                    }
                }
            }
            if (!isNaN(UnMatchPropsalsJson[x].week09) && parseInt(UnMatchPropsalsJson[x].week09) > 0) {
                if (!isNaN(UnMatchPropsalsJson[x].impressions) && parseInt(UnMatchPropsalsJson[x].impressions) > 0
                    && !isNaN(UnMatchPropsalsJson[x].rateAmt) && parseInt(UnMatchPropsalsJson[x].rateAmt) > 0) {
                    //wk9CPM = parseFloat(wk9CPM) + (parseFloat(UnMatchPropsalsJson[x].rateAmt) / parseFloat(UnMatchPropsalsJson[x].impressions)) / parseFloat(UnMatchPropsalsJson[x].week09);
                    if (wk9GI > 0) {
                        wk9CPM = parseFloat(wk9Dollars / wk9GI)
                    }
                    else {
                        wk9CPM = parseFloat(0);
                    }
                }
            }
            if (!isNaN(UnMatchPropsalsJson[x].week10) && parseInt(UnMatchPropsalsJson[x].week10) > 0) {
                if (!isNaN(UnMatchPropsalsJson[x].impressions) && parseInt(UnMatchPropsalsJson[x].impressions) > 0
                    && !isNaN(UnMatchPropsalsJson[x].rateAmt) && parseInt(UnMatchPropsalsJson[x].rateAmt) > 0) {
                    //wk10CPM = parseFloat(wk10CPM) + (parseFloat(UnMatchPropsalsJson[x].rateAmt) / parseFloat(UnMatchPropsalsJson[x].impressions)) / parseFloat(UnMatchPropsalsJson[x].week10);
                    if (wk10GI > 0) {
                        wk10CPM = parseFloat(wk10Dollars / wk10GI)
                    }
                    else {
                        wk10CPM = parseFloat(0);
                    }
                }
            }
            if (!isNaN(UnMatchPropsalsJson[x].week11) && parseInt(UnMatchPropsalsJson[x].week11) > 0) {
                if (!isNaN(UnMatchPropsalsJson[x].impressions) && parseInt(UnMatchPropsalsJson[x].impressions) > 0
                    && !isNaN(UnMatchPropsalsJson[x].rateAmt) && parseInt(UnMatchPropsalsJson[x].rateAmt) > 0) {
                    //wk11CPM = parseFloat(wk11CPM) + (parseFloat(UnMatchPropsalsJson[x].rateAmt) / parseFloat(UnMatchPropsalsJson[x].impressions)) / parseFloat(UnMatchPropsalsJson[x].week11);
                    if (wk11GI > 0) {
                        wk11CPM = parseFloat(wk11Dollars / wk11GI)
                    }
                    else {
                        wk11CPM = parseFloat(0);
                    }
                }
            }
            if (!isNaN(UnMatchPropsalsJson[x].week12) && parseInt(UnMatchPropsalsJson[x].week12) > 0) {
                if (!isNaN(UnMatchPropsalsJson[x].impressions) && parseInt(UnMatchPropsalsJson[x].impressions) > 0
                    && !isNaN(UnMatchPropsalsJson[x].rateAmt) && parseInt(UnMatchPropsalsJson[x].rateAmt) > 0) {
                    //wk12CPM = parseFloat(wk12CPM) + (parseFloat(UnMatchPropsalsJson[x].rateAmt) / parseFloat(UnMatchPropsalsJson[x].impressions)) / parseFloat(UnMatchPropsalsJson[x].week12);
                    if (wk12GI > 0) {
                        wk12CPM = parseFloat(wk12Dollars / wk12GI)
                    }
                    else {
                        wk12CPM = parseFloat(0);
                    }
                }
            }
            if (!isNaN(UnMatchPropsalsJson[x].week13) && parseInt(UnMatchPropsalsJson[x].week13) > 0) {
                if (!isNaN(UnMatchPropsalsJson[x].impressions) && parseInt(UnMatchPropsalsJson[x].impressions) > 0
                    && !isNaN(UnMatchPropsalsJson[x].rateAmt) && parseInt(UnMatchPropsalsJson[x].rateAmt) > 0) {
                    //wk13CPM = parseFloat(wk13CPM) + (parseFloat(UnMatchPropsalsJson[x].rateAmt) / parseFloat(UnMatchPropsalsJson[x].impressions)) / parseFloat(UnMatchPropsalsJson[x].week13);
                    if (wk13GI > 0) {
                        wk13CPM = parseFloat(wk13Dollars / wk13GI)
                    }
                    else {
                        wk13CPM = parseFloat(0);
                    }
                }
            }

            if (!isNaN(UnMatchPropsalsJson[x].week14) && parseInt(UnMatchPropsalsJson[x].week14) > 0) {
                if (!isNaN(UnMatchPropsalsJson[x].impressions) && parseInt(UnMatchPropsalsJson[x].impressions) > 0
                    && !isNaN(UnMatchPropsalsJson[x].rateAmt) && parseInt(UnMatchPropsalsJson[x].rateAmt) > 0) {
                    //wk14CPM = parseFloat(wk14CPM) + (parseFloat(UnMatchPropsalsJson[x].rateAmt) / parseFloat(UnMatchPropsalsJson[x].impressions)) / parseFloat(UnMatchPropsalsJson[x].week14);
                    if (wk14GI > 0) {
                        wk14CPM = parseFloat(wk14Dollars / wk14GI)
                    }
                    else {
                        wk14CPM = parseFloat(0);
                    }
                }
            }
            if (TotalGI > 0) {
                TotalCPM =  parseFloat(TotalDollars / TotalGI);
            }
            else {
                TotalCPM = parseFloat(0);
            }
        }
    }

    for (var x = 0; x < MultiMatchPropsalsJson.length; x++) {
        if (MultiMatchPropsalsJson[x].demoName == "") {
            var CurPropsMulti = MultiMatchPropsalsJson.filter(o => o.ediProposalsID == MultiMatchPropsalsJson[x].ediProposalsID && o.demoName != "")[0];
            //TOTAL SPOTS
            {
                TotalSpots = parseInt(TotalSpots) + parseInt(CurPropsMulti.totalSpots);
                wk1Spots = parseInt(wk1Spots) + (CurPropsMulti.week01 == "" ? 0 : parseInt(CurPropsMulti.week01));
                wk2Spots = parseInt(wk2Spots) + (CurPropsMulti.week02 == "" ? 0 : parseInt(CurPropsMulti.week02));
                wk3Spots = parseInt(wk3Spots) + (CurPropsMulti.week03 == "" ? 0 : parseInt(CurPropsMulti.week03));
                wk4Spots = parseInt(wk4Spots) + (CurPropsMulti.week04 == "" ? 0 : parseInt(CurPropsMulti.week04));
                wk5Spots = parseInt(wk5Spots) + (CurPropsMulti.week05 == "" ? 0 : parseInt(CurPropsMulti.week05));
                wk6Spots = parseInt(wk6Spots) + (CurPropsMulti.week06 == "" ? 0 : parseInt(CurPropsMulti.week06));
                wk7Spots = parseInt(wk7Spots) + (CurPropsMulti.week07 == "" ? 0 : parseInt(CurPropsMulti.week07));
                wk8Spots = parseInt(wk8Spots) + (CurPropsMulti.week08 == "" ? 0 : parseInt(CurPropsMulti.week08));
                wk9Spots = parseInt(wk9Spots) + (CurPropsMulti.week09 == "" ? 0 : parseInt(CurPropsMulti.week09));
                wk10Spots = parseInt(wk10Spots) + (CurPropsMulti.week10 == "" ? 0 : parseInt(CurPropsMulti.week10));
                wk11Spots = parseInt(wk11Spots) + (CurPropsMulti.week11 == "" ? 0 : parseInt(CurPropsMulti.week11));
                wk12Spots = parseInt(wk12Spots) + (CurPropsMulti.week12 == "" ? 0 : parseInt(CurPropsMulti.week12));
                wk13Spots = parseInt(wk13Spots) + (CurPropsMulti.week13 == "" ? 0 : parseInt(CurPropsMulti.week13));
                wk14Spots = parseInt(wk14Spots) + (CurPropsMulti.week14 == "" ? 0 : parseInt(CurPropsMulti.week14));
            }
            // DOLLAR
            {
                TotalDollars = parseFloat(TotalDollars) + (parseFloat(CurPropsMulti.rateAmt) * parseFloat(CurPropsMulti.totalSpots));
                wk1Dollars = parseFloat(wk1Dollars) + (parseFloat(CurPropsMulti.rateAmt) * (CurPropsMulti.week01 == "" ? 0.0 : parseInt(CurPropsMulti.week01)));
                wk2Dollars = parseFloat(wk2Dollars) + (parseFloat(CurPropsMulti.rateAmt) * (CurPropsMulti.week02 == "" ? 0.0 : parseInt(CurPropsMulti.week02)));
                wk3Dollars = parseFloat(wk3Dollars) + (parseFloat(CurPropsMulti.rateAmt) * (CurPropsMulti.week03 == "" ? 0.0 : parseInt(CurPropsMulti.week03)));
                wk4Dollars = parseFloat(wk4Dollars) + (parseFloat(CurPropsMulti.rateAmt) * (CurPropsMulti.week04 == "" ? 0.0 : parseInt(CurPropsMulti.week04)));
                wk5Dollars = parseFloat(wk5Dollars) + (parseFloat(CurPropsMulti.rateAmt) * (CurPropsMulti.week05 == "" ? 0.0 : parseInt(CurPropsMulti.week05)));
                wk6Dollars = parseFloat(wk6Dollars) + (parseFloat(CurPropsMulti.rateAmt) * (CurPropsMulti.week06 == "" ? 0.0 : parseInt(CurPropsMulti.week06)));
                wk7Dollars = parseFloat(wk7Dollars) + (parseFloat(CurPropsMulti.rateAmt) * (CurPropsMulti.week07 == "" ? 0.0 : parseInt(CurPropsMulti.week07)));
                wk8Dollars = parseFloat(wk8Dollars) + (parseFloat(CurPropsMulti.rateAmt) * (CurPropsMulti.week08 == "" ? 0.0 : parseInt(CurPropsMulti.week08)));
                wk9Dollars = parseFloat(wk9Dollars) + (parseFloat(CurPropsMulti.rateAmt) * (CurPropsMulti.week09 == "" ? 0.0 : parseInt(CurPropsMulti.week09)));
                wk10Dollars = parseFloat(wk10Dollars) + (parseFloat(CurPropsMulti.rateAmt) * (CurPropsMulti.week10 == "" ? 0.0 : parseInt(CurPropsMulti.week10)));
                wk11Dollars = parseFloat(wk11Dollars) + (parseFloat(CurPropsMulti.rateAmt) * (CurPropsMulti.week11 == "" ? 0.0 : parseInt(CurPropsMulti.week11)));
                wk12Dollars = parseFloat(wk12Dollars) + (parseFloat(CurPropsMulti.rateAmt) * (CurPropsMulti.week12 == "" ? 0.0 : parseInt(CurPropsMulti.week12)));
                wk13Dollars = parseFloat(wk13Dollars) + (parseFloat(CurPropsMulti.rateAmt) * (CurPropsMulti.week13 == "" ? 0.0 : parseInt(CurPropsMulti.week13)));
                wk14Dollars = parseFloat(wk14Dollars) + (parseFloat(CurPropsMulti.rateAmt) * (CurPropsMulti.week14 == "" ? 0.0 : parseInt(CurPropsMulti.week14)));
            }
            // GI
            {
                if (!isNaN(CurPropsMulti.week01) && parseInt(CurPropsMulti.week01) > 0) {
                    if (!isNaN(CurPropsMulti.impressions) && parseInt(CurPropsMulti.impressions) > 0) {
                        wk1GI = parseFloat(wk1GI) + (parseFloat(CurPropsMulti.impressions) * parseFloat(CurPropsMulti.week01));
                    }
                }
                if (!isNaN(CurPropsMulti.week02) && parseInt(CurPropsMulti.week02) > 0) {
                    if (!isNaN(CurPropsMulti.impressions) && parseInt(CurPropsMulti.impressions) > 0) {
                        wk2GI = parseFloat(wk2GI) + (parseFloat(CurPropsMulti.impressions) * parseFloat(CurPropsMulti.week02));
                    }
                }
                if (!isNaN(CurPropsMulti.week03) && parseInt(CurPropsMulti.week03) > 0) {
                    if (!isNaN(CurPropsMulti.impressions) && parseInt(CurPropsMulti.impressions) > 0) {
                        wk3GI = parseFloat(wk3GI) + (parseFloat(CurPropsMulti.impressions) * parseFloat(CurPropsMulti.week03));
                    }
                }

                if (!isNaN(CurPropsMulti.week04) && parseInt(CurPropsMulti.week04) > 0) {
                    if (!isNaN(CurPropsMulti.impressions) && parseInt(CurPropsMulti.impressions) > 0) {
                        wk4GI = parseFloat(wk4GI) + (parseFloat(CurPropsMulti.impressions) * parseFloat(CurPropsMulti.week04));
                    }
                }
                if (!isNaN(CurPropsMulti.week05) && parseInt(CurPropsMulti.week05) > 0) {
                    if (!isNaN(CurPropsMulti.impressions) && parseInt(CurPropsMulti.impressions) > 0) {
                        wk5GI = parseFloat(wk5GI) + (parseFloat(CurPropsMulti.impressions) * parseFloat(CurPropsMulti.week05));
                    }
                }
                if (!isNaN(CurPropsMulti.week06) && parseInt(CurPropsMulti.week06) > 0) {
                    if (!isNaN(CurPropsMulti.impressions) && parseInt(CurPropsMulti.impressions) > 0) {
                        wk6GI = parseFloat(wk6GI) + (parseFloat(CurPropsMulti.impressions) * parseFloat(CurPropsMulti.week06));
                    }
                }
                if (!isNaN(CurPropsMulti.week07) && parseInt(CurPropsMulti.week07) > 0) {
                    if (!isNaN(CurPropsMulti.impressions) && parseInt(CurPropsMulti.impressions) > 0) {
                        wk7GI = parseFloat(wk7GI) + (parseFloat(CurPropsMulti.impressions) * parseFloat(CurPropsMulti.week07));
                    }
                }
                if (!isNaN(CurPropsMulti.week08) && parseInt(CurPropsMulti.week08) > 0) {
                    if (!isNaN(CurPropsMulti.impressions) && parseInt(CurPropsMulti.impressions) > 0) {
                        wk8GI = parseFloat(wk8GI) + (parseFloat(CurPropsMulti.impressions) * parseFloat(CurPropsMulti.week08));
                    }
                }
                if (!isNaN(CurPropsMulti.week09) && parseInt(CurPropsMulti.week09) > 0) {
                    if (!isNaN(CurPropsMulti.impressions) && parseInt(CurPropsMulti.impressions) > 0) {
                        wk9GI = parseFloat(wk9GI) + (parseFloat(CurPropsMulti.impressions) * parseFloat(CurPropsMulti.week09));
                    }
                }
                if (!isNaN(CurPropsMulti.week10) && parseInt(CurPropsMulti.week10) > 0) {
                    if (!isNaN(CurPropsMulti.impressions) && parseInt(CurPropsMulti.impressions) > 0) {
                        wk10GI = parseFloat(wk10GI) + (parseFloat(CurPropsMulti.impressions) * parseFloat(CurPropsMulti.week10));
                    }
                }
                if (!isNaN(CurPropsMulti.week11) && parseInt(CurPropsMulti.week11) > 0) {
                    if (!isNaN(CurPropsMulti.impressions) && parseInt(CurPropsMulti.impressions) > 0) {
                        wk11GI = parseFloat(wk11GI) + (parseFloat(CurPropsMulti.impressions) * parseFloat(CurPropsMulti.week11));
                    }
                }
                if (!isNaN(CurPropsMulti.week12) && parseInt(CurPropsMulti.week12) > 0) {
                    if (!isNaN(CurPropsMulti.impressions) && parseInt(CurPropsMulti.impressions) > 0) {
                        wk12GI = parseFloat(wk12GI) + (parseFloat(CurPropsMulti.impressions) * parseFloat(CurPropsMulti.week12));
                    }
                }
                if (!isNaN(CurPropsMulti.week13) && parseInt(CurPropsMulti.week13) > 0) {
                    if (!isNaN(CurPropsMulti.impressions) && parseInt(CurPropsMulti.impressions) > 0) {
                        wk13GI = parseFloat(wk13GI) + (parseFloat(CurPropsMulti.impressions) * parseFloat(CurPropsMulti.week13));
                    }
                }
                if (!isNaN(CurPropsMulti.week14) && parseInt(CurPropsMulti.week14) > 0) {
                    if (!isNaN(CurPropsMulti.impressions) && parseInt(CurPropsMulti.impressions) > 0) {
                        wk14GI = parseFloat(wk14GI) + (parseFloat(CurPropsMulti.impressions) * parseFloat(CurPropsMulti.week14));
                    }
                }
                if (!isNaN(CurPropsMulti.impressions) && parseFloat(CurPropsMulti.impressions) > 0
                    && !isNaN(CurPropsMulti.totalSpots) && parseFloat(CurPropsMulti.totalSpots) > 0)
                    TotalGI = parseFloat(TotalGI) + (parseFloat(CurPropsMulti.impressions) * parseFloat(CurPropsMulti.totalSpots));
                else
                    TotalGI = parseFloat(TotalGI) + 0.00;
            }
            // CPM
            {
                if (!isNaN(CurPropsMulti.week01) && parseInt(CurPropsMulti.week01) > 0) {
                    if (!isNaN(CurPropsMulti.impressions) && parseInt(CurPropsMulti.impressions) > 0
                        && !isNaN(CurPropsMulti.rateAmt) && parseInt(CurPropsMulti.rateAmt) > 0) {
                        // wk1CPM = parseFloat(wk1CPM) + (parseFloat( CurPropsMulti.rateAmt) / parseFloat( CurPropsMulti.impressions)) / parseFloat( CurPropsMulti.week01);
                        if (wk1GI > 0) {
                            wk1CPM = parseFloat(wk1Dollars / wk1GI)
                        }
                        else {
                            wk1CPM = parseFloat(0);
                        }
                    }
                }
                if (!isNaN(CurPropsMulti.week02) && parseInt(CurPropsMulti.week02) > 0) {
                    if (!isNaN(CurPropsMulti.impressions) && parseInt(CurPropsMulti.impressions) > 0
                        && !isNaN(CurPropsMulti.rateAmt) && parseInt(CurPropsMulti.rateAmt) > 0) {
                        // wk2CPM = parseFloat(wk2CPM) + (parseFloat( CurPropsMulti.rateAmt) / parseFloat( CurPropsMulti.impressions)) / parseFloat( CurPropsMulti.week02);
                        if (wk2GI > 0) {
                            wk2CPM = parseFloat(wk2Dollars / wk2GI)
                        }
                        else {
                            wk2CPM = parseFloat(0);
                        }
                    }
                }
                if (!isNaN(CurPropsMulti.week03) && parseInt(CurPropsMulti.week03) > 0) {
                    if (!isNaN(CurPropsMulti.impressions) && parseInt(CurPropsMulti.impressions) > 0
                        && !isNaN(CurPropsMulti.rateAmt) && parseInt(CurPropsMulti.rateAmt) > 0) {
                        // wk3CPM = parseFloat(wk3CPM) + (parseFloat( CurPropsMulti.rateAmt) / parseFloat( CurPropsMulti.impressions)) / parseFloat( CurPropsMulti.week03);
                        if (wk3GI > 0) {
                            wk3CPM = parseFloat(wk3Dollars / wk3GI)
                        }
                        else {
                            wk3CPM = parseFloat(0);
                        }
                    }
                }
                if (!isNaN(CurPropsMulti.week04) && parseInt(CurPropsMulti.week04) > 0) {
                    if (!isNaN(CurPropsMulti.impressions) && parseInt(CurPropsMulti.impressions) > 0
                        && !isNaN(CurPropsMulti.rateAmt) && parseInt(CurPropsMulti.rateAmt) > 0) {
                        //wk4CPM = parseFloat(wk4CPM) + (parseFloat( CurPropsMulti.rateAmt) / parseFloat( CurPropsMulti.impressions)) / parseFloat( CurPropsMulti.week04);
                        if (wk4GI > 0) {
                            wk4CPM = parseFloat(wk4Dollars / wk4GI)
                        }
                        else {
                            wk4CPM = parseFloat(0);
                        }
                    }
                }
                if (!isNaN(CurPropsMulti.week05) && parseInt(CurPropsMulti.week05) > 0) {
                    if (!isNaN(CurPropsMulti.impressions) && parseInt(CurPropsMulti.impressions) > 0
                        && !isNaN(CurPropsMulti.rateAmt) && parseInt(CurPropsMulti.rateAmt) > 0) {
                        //wk5CPM = parseFloat(wk5CPM) + (parseFloat( CurPropsMulti.rateAmt) / parseFloat( CurPropsMulti.impressions)) / parseFloat( CurPropsMulti.week05);
                        if (wk5GI > 0) {
                            wk5CPM = parseFloat(wk5Dollars / wk5GI)
                        }
                        else {
                            wk5CPM = parseFloat(0);
                        }
                    }
                }

                if (!isNaN(CurPropsMulti.week06) && parseInt(CurPropsMulti.week06) > 0) {
                    if (!isNaN(CurPropsMulti.impressions) && parseInt(CurPropsMulti.impressions) > 0
                        && !isNaN(CurPropsMulti.rateAmt) && parseInt(CurPropsMulti.rateAmt) > 0) {
                        //wk6CPM = parseFloat(wk6CPM) + (parseFloat( CurPropsMulti.rateAmt) / parseFloat( CurPropsMulti.impressions)) / parseFloat( CurPropsMulti.week06);
                        if (wk6GI > 0) {
                            wk6CPM = parseFloat(wk6Dollars / wk6GI)
                        }
                        else {
                            wk6CPM = parseFloat(0);
                        }
                    }
                }

                if (!isNaN(CurPropsMulti.week07) && parseInt(CurPropsMulti.week07) > 0) {
                    if (!isNaN(CurPropsMulti.impressions) && parseInt(CurPropsMulti.impressions) > 0
                        && !isNaN(CurPropsMulti.rateAmt) && parseInt(CurPropsMulti.rateAmt) > 0) {
                        // wk7CPM = parseFloat(wk7CPM) + (parseFloat( CurPropsMulti.rateAmt) / parseFloat( CurPropsMulti.impressions)) / parseFloat( CurPropsMulti.week07);
                        if (wk7GI > 0) {
                            wk7CPM = parseFloat(wk7Dollars / wk7GI)
                        }
                        else {
                            wk7CPM = parseFloat(0);
                        }
                    }
                }
                if (!isNaN(CurPropsMulti.week08) && parseInt(CurPropsMulti.week08) > 0) {
                    if (!isNaN(CurPropsMulti.impressions) && parseInt(CurPropsMulti.impressions) > 0
                        && !isNaN(CurPropsMulti.rateAmt) && parseInt(CurPropsMulti.rateAmt) > 0) {
                        // wk8CPM = parseFloat(wk8CPM) + (parseFloat( CurPropsMulti.rateAmt) / parseFloat( CurPropsMulti.impressions)) / parseFloat( CurPropsMulti.week08);
                        if (wk8GI > 0) {
                            wk8CPM = parseFloat(wk8Dollars / wk8GI)
                        }
                        else {
                            wk8CPM = parseFloat(0);
                        }
                    }
                }
                if (!isNaN(CurPropsMulti.week09) && parseInt(CurPropsMulti.week09) > 0) {
                    if (!isNaN(CurPropsMulti.impressions) && parseInt(CurPropsMulti.impressions) > 0
                        && !isNaN(CurPropsMulti.rateAmt) && parseInt(CurPropsMulti.rateAmt) > 0) {
                        //wk9CPM = parseFloat(wk9CPM) + (parseFloat( CurPropsMulti.rateAmt) / parseFloat( CurPropsMulti.impressions)) / parseFloat( CurPropsMulti.week09);
                        if (wk9GI > 0) {
                            wk9CPM = parseFloat(wk9Dollars / wk9GI)
                        }
                        else {
                            wk9CPM = parseFloat(0);
                        }
                    }
                }
                if (!isNaN(CurPropsMulti.week10) && parseInt(CurPropsMulti.week10) > 0) {
                    if (!isNaN(CurPropsMulti.impressions) && parseInt(CurPropsMulti.impressions) > 0
                        && !isNaN(CurPropsMulti.rateAmt) && parseInt(CurPropsMulti.rateAmt) > 0) {
                        //wk10CPM = parseFloat(wk10CPM) + (parseFloat( CurPropsMulti.rateAmt) / parseFloat( CurPropsMulti.impressions)) / parseFloat( CurPropsMulti.week10);
                        if (wk10GI > 0) {
                            wk10CPM = parseFloat(wk10Dollars / wk10GI)
                        }
                        else {
                            wk10CPM = parseFloat(0);
                        }
                    }
                }
                if (!isNaN(CurPropsMulti.week11) && parseInt(CurPropsMulti.week11) > 0) {
                    if (!isNaN(CurPropsMulti.impressions) && parseInt(CurPropsMulti.impressions) > 0
                        && !isNaN(CurPropsMulti.rateAmt) && parseInt(CurPropsMulti.rateAmt) > 0) {
                        //wk11CPM = parseFloat(wk11CPM) + (parseFloat( CurPropsMulti.rateAmt) / parseFloat( CurPropsMulti.impressions)) / parseFloat( CurPropsMulti.week11);
                        if (wk11GI > 0) {
                            wk11CPM = parseFloat(wk11Dollars / wk11GI)
                        }
                        else {
                            wk11CPM = parseFloat(0);
                        }
                    }
                }
                if (!isNaN(CurPropsMulti.week12) && parseInt(CurPropsMulti.week12) > 0) {
                    if (!isNaN(CurPropsMulti.impressions) && parseInt(CurPropsMulti.impressions) > 0
                        && !isNaN(CurPropsMulti.rateAmt) && parseInt(CurPropsMulti.rateAmt) > 0) {
                        //wk12CPM = parseFloat(wk12CPM) + (parseFloat( CurPropsMulti.rateAmt) / parseFloat( CurPropsMulti.impressions)) / parseFloat( CurPropsMulti.week12);
                        if (wk12GI > 0) {
                            wk12CPM = parseFloat(wk12Dollars / wk12GI)
                        }
                        else {
                            wk12CPM = parseFloat(0);
                        }
                    }
                }
                if (!isNaN(CurPropsMulti.week13) && parseInt(CurPropsMulti.week13) > 0) {
                    if (!isNaN(CurPropsMulti.impressions) && parseInt(CurPropsMulti.impressions) > 0
                        && !isNaN(CurPropsMulti.rateAmt) && parseInt(CurPropsMulti.rateAmt) > 0) {
                        //wk13CPM = parseFloat(wk13CPM) + (parseFloat( CurPropsMulti.rateAmt) / parseFloat( CurPropsMulti.impressions)) / parseFloat( CurPropsMulti.week13);
                        if (wk13GI > 0) {
                            wk13CPM = parseFloat(wk13Dollars / wk13GI)
                        }
                        else {
                            wk13CPM = parseFloat(0);
                        }
                    }
                }

                if (!isNaN(CurPropsMulti.week14) && parseInt(CurPropsMulti.week14) > 0) {
                    if (!isNaN(CurPropsMulti.impressions) && parseInt(CurPropsMulti.impressions) > 0
                        && !isNaN(CurPropsMulti.rateAmt) && parseInt(CurPropsMulti.rateAmt) > 0) {
                        //wk14CPM = parseFloat(wk14CPM) + (parseFloat( CurPropsMulti.rateAmt) / parseFloat( CurPropsMulti.impressions)) / parseFloat( CurPropsMulti.week14);
                        if (wk14GI > 0) {
                            wk14CPM = parseFloat(wk14Dollars / wk14GI)
                        }
                        else {
                            wk14CPM = parseFloat(0);
                        }
                    }
                }
                if (TotalGI > 0) {
                    TotalCPM = parseFloat(TotalDollars / TotalGI);
                }
                else {
                    TotalCPM = parseFloat(0);
                }
            }
        }
    }

    // NETWORK DOLLARS
    TotalSectionArrayPM.filter(o => o.propertyId == 2 && o.propertyName=="NETWORK DOLLARS")[0].totalSpots = parseFloat(TotalDollars).toFixed(2);
    TotalSectionArrayPM.filter(o => o.propertyId == 2 && o.propertyName=="NETWORK DOLLARS")[0].week01 = isNaN(wk1Dollars) ? 0 : wk1Dollars;
    TotalSectionArrayPM.filter(o => o.propertyId == 2 && o.propertyName=="NETWORK DOLLARS")[0].week02 = isNaN(wk2Dollars) ? 0 : wk2Dollars;
    TotalSectionArrayPM.filter(o => o.propertyId == 2 && o.propertyName=="NETWORK DOLLARS")[0].week03 = isNaN(wk3Dollars) ? 0 : wk3Dollars;
    TotalSectionArrayPM.filter(o => o.propertyId == 2 && o.propertyName=="NETWORK DOLLARS")[0].week04 = isNaN(wk4Dollars) ? 0 : wk4Dollars;
    TotalSectionArrayPM.filter(o => o.propertyId == 2 && o.propertyName=="NETWORK DOLLARS")[0].week05 = isNaN(wk5Dollars) ? 0 : wk5Dollars;
    TotalSectionArrayPM.filter(o => o.propertyId == 2 && o.propertyName=="NETWORK DOLLARS")[0].week06 = isNaN(wk6Dollars) ? 0 : wk6Dollars;
    TotalSectionArrayPM.filter(o => o.propertyId == 2 && o.propertyName=="NETWORK DOLLARS")[0].week07 = isNaN(wk7Dollars) ? 0 : wk7Dollars;
    TotalSectionArrayPM.filter(o => o.propertyId == 2 && o.propertyName=="NETWORK DOLLARS")[0].week08 = isNaN(wk8Dollars) ? 0 : wk8Dollars;
    TotalSectionArrayPM.filter(o => o.propertyId == 2 && o.propertyName=="NETWORK DOLLARS")[0].week09 = isNaN(wk9Dollars) ? 0 : wk9Dollars;
    TotalSectionArrayPM.filter(o => o.propertyId == 2 && o.propertyName=="NETWORK DOLLARS")[0].week10 = isNaN(wk10Dollars) ? 0 : wk10Dollars;
    TotalSectionArrayPM.filter(o => o.propertyId == 2 && o.propertyName=="NETWORK DOLLARS")[0].week11 = isNaN(wk11Dollars) ? 0 : wk11Dollars;
    TotalSectionArrayPM.filter(o => o.propertyId == 2 && o.propertyName=="NETWORK DOLLARS")[0].week12 = isNaN(wk12Dollars) ? 0 : wk12Dollars;
    TotalSectionArrayPM.filter(o => o.propertyId == 2 && o.propertyName=="NETWORK DOLLARS")[0].week13 = isNaN(wk13Dollars) ? 0 : wk13Dollars;
    TotalSectionArrayPM.filter(o => o.propertyId == 2 && o.propertyName =="NETWORK DOLLARS")[0].week14 = isNaN(wk14Dollars) ? 0 : wk14Dollars;
    // NETWORK CPM

    if (TotalGI > 0)
        TotalSectionArrayPM.filter(o => o.propertyId == 2 && o.propertyName == "Network CPM")[0].totalSpots = parseFloat(TotalDollars / TotalGI).toFixed(2);
    else
        TotalSectionArrayPM.filter(o => o.propertyId == 2 && o.propertyName == "Network CPM")[0].totalSpots = 0;

    TotalSectionArrayPM.filter(o => o.propertyId == 2 && o.propertyName == "Network CPM")[0].week01 = isNaN(wk1CPM) ? 0 : wk1CPM;
    TotalSectionArrayPM.filter(o => o.propertyId == 2 && o.propertyName == "Network CPM")[0].week02 = isNaN(wk2CPM) ? 0 : wk2CPM;
    TotalSectionArrayPM.filter(o => o.propertyId == 2 && o.propertyName == "Network CPM")[0].week03 = isNaN(wk3CPM) ? 0 : wk3CPM;
    TotalSectionArrayPM.filter(o => o.propertyId == 2 && o.propertyName == "Network CPM")[0].week04 = isNaN(wk4CPM) ? 0 : wk4CPM;
    TotalSectionArrayPM.filter(o => o.propertyId == 2 && o.propertyName == "Network CPM")[0].week05 = isNaN(wk5CPM) ? 0 : wk5CPM;
    TotalSectionArrayPM.filter(o => o.propertyId == 2 && o.propertyName == "Network CPM")[0].week06 = isNaN(wk6CPM) ? 0 : wk6CPM;
    TotalSectionArrayPM.filter(o => o.propertyId == 2 && o.propertyName == "Network CPM")[0].week07 = isNaN(wk7CPM) ? 0 : wk7CPM;
    TotalSectionArrayPM.filter(o => o.propertyId == 2 && o.propertyName == "Network CPM")[0].week08 = isNaN(wk8CPM) ? 0 : wk8CPM;
    TotalSectionArrayPM.filter(o => o.propertyId == 2 && o.propertyName == "Network CPM")[0].week09 = isNaN(wk9CPM) ? 0 : wk9CPM;
    TotalSectionArrayPM.filter(o => o.propertyId == 2 && o.propertyName == "Network CPM")[0].week10 = isNaN(wk10CPM) ? 0 : wk10CPM;
    TotalSectionArrayPM.filter(o => o.propertyId == 2 && o.propertyName == "Network CPM")[0].week11 = isNaN(wk11CPM) ? 0 : wk11CPM;
    TotalSectionArrayPM.filter(o => o.propertyId == 2 && o.propertyName == "Network CPM")[0].week12 = isNaN(wk12CPM) ? 0 : wk12CPM;
    TotalSectionArrayPM.filter(o => o.propertyId == 2 && o.propertyName == "Network CPM")[0].week13 = isNaN(wk13CPM) ? 0 : wk13CPM;
    TotalSectionArrayPM.filter(o => o.propertyId == 2 && o.propertyName == "Network CPM")[0].week14 = isNaN(wk14CPM) ? 0 : wk14CPM;

    // OM GI
    TotalSectionArrayPM.filter(o => o.propertyId == 4)[0].totalSpots = parseFloat(TotalGI).toFixed(2);
    TotalSectionArrayPM.filter(o => o.propertyId == 4)[0].week01 = isNaN(wk1GI) ? 0 : wk1GI;
    TotalSectionArrayPM.filter(o => o.propertyId == 4)[0].week02 = isNaN(wk2GI) ? 0 : wk2GI;
    TotalSectionArrayPM.filter(o => o.propertyId == 4)[0].week03 = isNaN(wk3GI) ? 0 : wk3GI;
    TotalSectionArrayPM.filter(o => o.propertyId == 4)[0].week04 = isNaN(wk4GI) ? 0 : wk4GI;
    TotalSectionArrayPM.filter(o => o.propertyId == 4)[0].week05 = isNaN(wk5GI) ? 0 : wk5GI;
    TotalSectionArrayPM.filter(o => o.propertyId == 4)[0].week06 = isNaN(wk6GI) ? 0 : wk6GI;
    TotalSectionArrayPM.filter(o => o.propertyId == 4)[0].week07 = isNaN(wk7GI) ? 0 : wk7GI;
    TotalSectionArrayPM.filter(o => o.propertyId == 4)[0].week08 = isNaN(wk8GI) ? 0 : wk8GI;
    TotalSectionArrayPM.filter(o => o.propertyId == 4)[0].week09 = isNaN(wk9GI) ? 0 : wk9GI;
    TotalSectionArrayPM.filter(o => o.propertyId == 4)[0].week10 = isNaN(wk10GI) ? 0 : wk10GI;
    TotalSectionArrayPM.filter(o => o.propertyId == 4)[0].week11 = isNaN(wk11GI) ? 0 : wk11GI;
    TotalSectionArrayPM.filter(o => o.propertyId == 4)[0].week12 = isNaN(wk12GI) ? 0 : wk12GI;
    TotalSectionArrayPM.filter(o => o.propertyId == 4)[0].week13 = isNaN(wk13GI) ? 0 : wk13GI;
    TotalSectionArrayPM.filter(o => o.propertyId == 4)[0].week14 = isNaN(wk14GI) ? 0 : wk14GI;

    //ProposalTotalJson.splice(6);
    var TempTotalTable = ProposalTotalJson;

    ProposalTotalJson = new Array();
    ProposalTotalJson.push(TempTotalTable[0]);
    ProposalTotalJson.push(TotalSectionArrayPM[0]);
    ProposalTotalJson.push(TotalSectionArrayPM[1]);
    ProposalTotalJson.push(TotalSectionArrayPM[2]);
    ProposalTotalJson.push(TotalSectionArrayPM[3]);
    ProposalTotalJson.push(TempTotalTable[5]);
    ProposalTotalJson.push(TotalSectionArrayPM[4]);
    ProposalTotalJson.push(TotalSectionArrayPM[5]);
    ProposalTotalJson.push(TotalSectionArrayPM[6]);
    BindTotalDataTable(ProposalTotalJson);
    // BindTotalDataConfirmMatchTableConfirmMatch(TotalSectionArray);
}

function AddUserJourneyEntryImportLoad(clientId, networkId, quarterName, screenName, proposalId, deal, sourcefile, action, description) {
    $.ajax({
        url: "/ScheduleProposal/AddUserJourneyMaster",
        data: {
            ClientId: clientId,
            NetworkId: networkId,
            QuarterName: quarterName,
            ScreenName: screenName,
            ScheduleId: proposalId, Deal: deal,
            SourceFile: sourcefile,
            ActionTaken: action,
            Description: description
        },
        cache: false,
        type: "GET",
        success: function (result) {
        },
        error: function (response) {
        }
    });
}

// ST-720 Mark Proposal Ignore and Allocated
function IgnoreAndAllocateProposals() {
    ShowOverlayPopupImport();
    var proposalId = $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href").split('=')[1];
    //return false;
    var _selCountryid = 5;
    if ($('#US').is(':checked')) {
        _selCountryid = 5;
    }
    else if ($('#CA').is(':checked')) {
        _selCountryid = 2;
    }
    var _selClientid = $("#ddlclients :selected").val();
    //alert(_selClientid);
    var _selQtr = ($(".nav-link.active").html().split(' ')[0]).toString().substring(2, 1) + "Q" + $(".nav-link.active").html().split(' ')[1];
    // alert(_selQtr);
    $.ajax({
        url: '/ScheduleProposal/UnAllocatedProposalsMarkAsAllocatedIgnored',
        type: "GET",
        async: false,
        data: {
            "ClientId": _selClientid,
            "QuarterName": _selQtr,
            "NetworkId": currentJsonSelectedForImport[currentFileIndex].networkId,
            "SourceFile": currentJsonSelectedForImport[currentFileIndex].sourceFile,
            "ProposalId": proposalId,
            "Mode": currentJsonSelectedForImport[currentFileIndex].mode,
            "SourceFileName": currentJsonSelectedForImport[currentFileIndex].sourceFile,
            "FileAction": "Actualized",

        },
        success: function (result) {
            var Description = "Deal file only contains spot data for actualized weeks. Ignored File Automatically Marked as completed";
            var proposalId = 0;
            if ($(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != null && $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != undefined && $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != "")
                proposalId = $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href").split('=')[1];

            AddUserJourneyEntryImportLoad(currentJsonSelectedForImport[currentFileIndex].clientId, currentJsonSelectedForImport[currentFileIndex].networkId,
                currentJsonSelectedForImport[currentFileIndex].quarterName, "ImportLoadScreen", proposalId,
                currentJsonSelectedForImport[currentFileIndex].deal, currentJsonSelectedForImport[currentFileIndex].sourceFile,
                "Ignored", Description);

            if (currentFileIndex < currentJsonSelectedForImport.length - 1) {
                CompletedFiles.push(currentJsonSelectedForImport[currentFileIndex]);
                UnAllocatedProposalsJson.filter(o => o.networkId.toString() == currentJsonSelectedForImport[currentFileIndex].networkId.toString() && o.sourceFile.toString() == currentJsonSelectedForImport[currentFileIndex].sourceFile.toString())[0].selectionType = 'complated';

                var Description = "Deal file only contains spot data for actualized weeks. Ignored File Automatically Marked as completed";
                var proposalId = 0;
                if ($(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != null && $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != undefined && $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != "")
                    proposalId = $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href").split('=')[1];

                AddUserJourneyEntryImportLoad(currentJsonSelectedForImport[currentFileIndex].clientId, currentJsonSelectedForImport[currentFileIndex].networkId,
                    currentJsonSelectedForImport[currentFileIndex].quarterName, "ImportLoadScreen", proposalId,
                    currentJsonSelectedForImport[currentFileIndex].deal, currentJsonSelectedForImport[currentFileIndex].sourceFile,
                    "Ignored", Description);

                currentFileIndex = parseInt(currentFileIndex) + 1;
                SetImportScreenData(currentFileIndex);
            }
            else {
                CompletedFiles.push(currentJsonSelectedForImport[currentFileIndex]);
                UnAllocatedProposalsJson.filter(o => o.networkId.toString() == currentJsonSelectedForImport[currentFileIndex].networkId.toString() && o.sourceFile.toString() == currentJsonSelectedForImport[currentFileIndex].sourceFile.toString())[0].selectionType = 'completed';
                var Description = "Deal file only contains spot data for actualized weeks. Ignored File Automatically Marked as completed";
                var proposalId = 0;
                if ($(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != null && $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != undefined && $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != "")
                    proposalId = $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href").split('=')[1];

                AddUserJourneyEntryImportLoad(currentJsonSelectedForImport[currentFileIndex].clientId, currentJsonSelectedForImport[currentFileIndex].networkId,
                    currentJsonSelectedForImport[currentFileIndex].quarterName, "ImportLoadScreen", proposalId,
                    currentJsonSelectedForImport[currentFileIndex].deal, currentJsonSelectedForImport[currentFileIndex].sourceFile,
                    "Ignored", Description);
                OpenProposal(proposalId, window.location.origin + "/ScheduleProposal/EditProposal?ProposalId=" + proposalId, '/ManageMedia/Proposal?ProposalId=' + proposalId);
                //BacktoUnAllocatedProposals(0);
            }
        },
        error: function (response) {
        }
    });
}