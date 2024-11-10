var FirstYear;
var FirstDemo;
var defaultYear = 0;
var defaultQuarter = "";
var defaultQuarterId = 0;
var defaultDemoId = 0;
var globalNetworkId = 0;
var globalNetworkName = "";
var globalBuyTypeGroup = "";
var globalQuarters = [];
var curQuarter;
var curYear;
var curDemo;
var globalProperties = [];
var SelProperties = [];
var SelPropertiesAndPlaceHolder = [];
var SelPropertiesBkp = [];
var SelPlaceholder = [];
var PlaceHolderLen;
var PlaceHolderDP;
var PlaceHolderBT;
var BlankPlaceholder;
var Perc15SecData;
var SpendData;
var SpendAtClearanceData;
var ExpectedClearanceData;
var TotalWeeklySpotsData;
var Total15WeeklySpotsData;
var DPData = [];
var curDelRowData;
var isClearanceSpotsFilled = false;
var isValidPlaceHolderEntries = false;
var ClearanceValidationMessage = "";
var isValidEditPlaceHolderEntries = false;
var editPlaceHolderValidationMessage = "";
var curAdjustedRates = 0.0;
var curAdjustedImps = 0.0;
var PrevAdjustedRates = 0.0;
var PrevAdjustedImps = 0.0;
var IsRateAdjusted = false;
var rateTextColor = "#575757";
var impsTextColor = "#575757";
var cpmTextColor = "#575757";
var mediaPlanPropertyIdForUpdateDelete = 0;
var mediaPlanPropertyNameForDelete = "";
var mediaPlanEditSelectedProperty = []
var mediaPlanEditNetworkProperties = [];

$(document).ready(function () {
    $('.modal.draggable>.modal-dialog').draggable({
        cursor: 'move',
        handle: '.modal-header'
    });
    $('.modal.draggable>.modal-dialog>.modal-content>.modal-header').css('cursor', 'move');
    $("#ddlMediaPlanLongPlanYears").val($("#hdnPlanYear").val());
    curYear = $("#ddlMediaPlanLongPlanYears").val();
    FirstYear = $("#ddlMediaPlanLongPlanYears").val();
});

function OpenLongPlan(networkId, networkName, reload) {
    var mediaPlanId = $("#hdnMediaPlanId").val();
    $.ajax({
        url: "/MediaPlan/MediaPlanCheckLock/",
        data: {
            MediaPlanId: mediaPlanId,
            Action: "longplan"
        },
        cache: false,
        type: "POST",
        success: function (response) {
            if (response.responseCode != 200) {
                swal({
                    html: response.responseText,
                    type: 'error',
                });
                setTimeout(function () {
                    window.location.href = "/ManageMedia/Planning";
                }, 3000);
            }
            else {
                $("#tbDayPartLongPlan").html("");
                $("#txtAdjustRates").val("");
                $("#txtAdjustImps").val("");
                $("#icoImps").hide();
                $("#icoRates").hide();
                rateTextColor = "#575757";
                impsTextColor = "#575757";
                curAdjustedImps = 0.00;
                curAdjustedRates = 0.00;
                globalNetworkId = networkId;
                globalNetworkName = networkName;
                SelPlaceholder = [];
                SelProperties = [];

                $("#ddlMediaPlanLongPlanYears").val($("#hdnPlanYear").val());
                FirstYear = $("#ddlMediaPlanLongPlanYears").val()

                curYear = $("#ddlMediaPlanLongPlanYears").val();
                if (FirstYear != null && FirstYear != undefined && FirstYear != '' && curYear != FirstYear) {
                    curYear = FirstYear;
                    $("#ddlMediaPlanLongPlanYears").val(FirstYear);
                }

                MediaPlanGetQuartersAndWeeks($("#ddlMediaPlanLongPlanYears").val());

                MediaPlanGetSelectedDemos();
                var heading = networkName + " (" + $("#hdnBTGroupName").val() + ")";
                $("#mpLongPlanNetworkHeading").html(heading);

                defaultQuarterId = $("#hdnQuarterId").val();
                defaultQuarter = $("#hdnQuarterName").val();
                globalBuyTypeGroup = $("#hdnBTGroupName").val();

                GetWeeklyBudget("longplan");
                setTimeout(function () {
                    MediaPlanGetPropertiesData();
                }, 2000);

                setTimeout(function () {
                    checkUncheckMultiSelectDropdown("mpLongPlan");
                }, 3000);

                if (!reload) {
                    setTimeout(function () {
                        $('#mpLongPlanNetworkModal').modal('show');
                    }, 1000);
                }
                $("#btnSaveAddmpLongPlanNetworkModal, #btnSaveClosempLongPlanNetworkModal").prop("disabled", true);
            }
        },
        error: function (response) {
            var err = response.result;
        }
    });
}

function ValidateNumber(_this, e) {
    MoveFocus(_this, e);
    var keyCode = e.which ? e.which : e.keyCode
    if (keyCode == 8 || keyCode == 46 || keyCode == 9 || keyCode == 35 || keyCode == 37 || keyCode == 38 || keyCode == 39 || keyCode == 40) {
        return true;
    }
    else {
        if ((keyCode < 48 || keyCode > 57) && (keyCode < 96 || keyCode > 105)) {
            return false;
        }
    }
    return true;
}
function ValidateSpots(_this, action) {
    var maxLimit = action == "clearance" ? 101 : 5001;
    if (parseInt($(_this).val()) <= 0) {
        $(_this).val(null);
    }
    else if (parseInt($(_this).val()) >= maxLimit) {
        $(_this).val(null);
    }

}
function setCursorAtEnd(input) {
    setTimeout(function () {
        var val = input.val();
        input[0].selectionStart = input[0].selectionEnd = val.length;
    }, 0); 
}
function MoveFocus(_this, e) {
    var nextInput;
    if (e.which === 37) {
        $(_this).closest('td').prevAll().each(function () {
            nextInput = $(this).find('input:visible').first();
            if (nextInput.length > 0) {
                nextInput.focus();
                setCursorAtEnd(nextInput);
                return false;
            }
        });
    } else if (e.which === 38) {
        var row = $(_this).closest('tr').prev();
        while (row.length > 0) {
            nextInput = row.find('td:eq(' + $(_this).closest('td').index() + ')').find('input:visible').first();
            if (nextInput.length > 0) {
                nextInput.focus();
                setCursorAtEnd(nextInput);
                break;
            }
            row = row.prev();
        }
    } else if (e.which === 39) {
        $(_this).closest('td').nextAll().each(function () {
            nextInput = $(this).find('input:visible').first();
            if (nextInput.length > 0) {
                nextInput.focus();
                setCursorAtEnd(nextInput);
                return false;
            }
        });
    } else if (e.which === 40) {
        var row = $(_this).closest('tr').next();
        while (row.length > 0) {
            nextInput = row.find('td:eq(' + $(_this).closest('td').index() + ')').find('input:visible').first();
            if (nextInput.length > 0) {
                nextInput.focus();
                setCursorAtEnd(nextInput); 
                break;
            }
            row = row.next();
        }
    }
}
function ValidateClearance() {
    isClearanceSpotsFilled = true;
    if ((SelPlaceholder.filter(o => o.spotLen == 15).length > 0) || (SelProperties.filter(o => o.spotLen == 15).length > 0)) {
        for (var x = 1; x < $("#tblmpLongPlanNetwork tbody tr").length - 2; x++) {
            $($("#tblmpLongPlanNetwork tbody tr")[x]).find("input[type=text]").each(function () {
                var col = $(this).attr("col");
                if ($(this).attr("id").toLowerCase().indexOf("txtrate") < 0 && $(this).attr("id").toLowerCase().indexOf("txtimps") < 0) {
                    var value = $(this).val();
                    if (value != "") {
                        //var clearanceVal = $('#tblmpLongPlanNetwork tbody tr:last input[col="' + col + '"]').val();
                        var clearanceVal = $($($("#tblmpLongPlanNetwork tbody tr")[$("#tblmpLongPlanNetwork tbody tr").length - 2]).find("input[col=" + col + "]")).val();//$('#tblmpLongPlanNetwork tbody tr:last input[col="' + col + '"]').val();
                        if (clearanceVal > 0 || clearanceVal != "") {
                            isClearanceSpotsFilled = true;
                        }
                        else {
                            isClearanceSpotsFilled = false;
                            return false;
                        }
                    }
                }
            });
            //$("#tblmpLongPlanNetwork tbody tr:not(:first, :last) input[type=text]").each(function () {
            //    var col = $(this).attr("col");
            //    if ($(this).attr("id").toLowerCase().indexOf("txtrate") < 0 && $(this).attr("id").toLowerCase().indexOf("txtimps") < 0) {
            //        var value = $(this).val();
            //        if (value != "") {
            //            var clearanceVal = $('#tblmpLongPlanNetwork tbody tr:last input[col="' + col + '"]').val();
            //            if (clearanceVal > 0 || clearanceVal != "") {
            //                isClearanceSpotsFilled = true;
            //            }
            //            else {
            //                isClearanceSpotsFilled = false;
            //                return false;
            //            }
            //        }
            //    }
            //});
        }
        return isClearanceSpotsFilled;
    }
    else {
        //$("#tblmpLongPlanNetwork tbody tr:not(:last) input[type=text]").each(function () {
        //    var col = $(this).attr("col");
        //    if ($(this).attr("id").toLowerCase().indexOf("txtrate") < 0 && $(this).attr("id").toLowerCase().indexOf("txtimps") < 0) {
        //        var value = $(this).val();
        //        if (value != "") {
        //            var clearanceVal = $('#tblmpLongPlanNetwork tbody tr:last input[col="' + col + '"]').val();
        //            if (clearanceVal > 0 || clearanceVal != "") {
        //                isClearanceSpotsFilled = true;
        //            }
        //            else {
        //                isClearanceSpotsFilled = false;
        //                return false;
        //            }
        //        }
        //    }
        //});
        for (var x = 0; x < $("#tblmpLongPlanNetwork tbody tr").length - 2; x++) {
            $($("#tblmpLongPlanNetwork tbody tr")[x]).find("input[type=text]").each(function () {
                var col = $(this).attr("col");
                if ($(this).attr("id").toLowerCase().indexOf("txtrate") < 0 && $(this).attr("id").toLowerCase().indexOf("txtimps") < 0) {
                    var value = $(this).val();
                    if (value != "") {
                        var clearanceVal = $($($("#tblmpLongPlanNetwork tbody tr")[$("#tblmpLongPlanNetwork tbody tr").length - 2]).find("input[col=" + col + "]")).val();//$('#tblmpLongPlanNetwork tbody tr:last input[col="' + col + '"]').val();
                        if (clearanceVal > 0 || clearanceVal != "") {
                            isClearanceSpotsFilled = true;
                        }
                        else {
                            isClearanceSpotsFilled = false;
                            return false;
                        }
                    }
                }
            });
            //$("#tblmpLongPlanNetwork tbody tr:not(:first, :last) input[type=text]").each(function () {
            //    var col = $(this).attr("col");
            //    if ($(this).attr("id").toLowerCase().indexOf("txtrate") < 0 && $(this).attr("id").toLowerCase().indexOf("txtimps") < 0) {
            //        var value = $(this).val();
            //        if (value != "") {
            //            var clearanceVal = $('#tblmpLongPlanNetwork tbody tr:last input[col="' + col + '"]').val();
            //            if (clearanceVal > 0 || clearanceVal != "") {
            //                isClearanceSpotsFilled = true;
            //            }
            //            else {
            //                isClearanceSpotsFilled = false;
            //                return false;
            //            }
            //        }
            //    }
            //});
        }
        return isClearanceSpotsFilled;
    }
}

function MediaPlanGetPlanYear() {
    var url = "/MediaPlan/MediaPlanGetPlanYears/";
    $.ajax({
        url: url,
        cache: false,
        type: "POST",
        success: function (result) {
            if (result != undefined || result != null || result.responseData.length > 0) {
                $("#ddlMediaPlanLongPlanYears").empty();
                $("#ddlMediaPlanLongPlanYears").append("<option value=''>Select</option>");
                for (var x = 0; x < result.responseData.length; x++) {
                    var currentYear = new Date().getFullYear();
                    if (result.responseData[x] <= currentYear && result.responseData[x] >= currentYear - 2) {
                        if (result.lastSelectedYear == result.responseData[x]) {
                            $("#ddlMediaPlanLongPlanYears").append("<option value=" + parseInt(result.responseData[x]) + " selected>" + result.responseData[x].toString() + "</option>");
                        }
                        else {
                            $("#ddlMediaPlanLongPlanYears").append("<option value=" + parseInt(result.responseData[x]) + ">" + result.responseData[x].toString() + "</option>");
                        }
                    }
                }
                MediaPlanGetQuartersAndWeeks(result.lastSelectedYear);
                defaultYear = result.lastSelectedYear;
            }

        },
        error: function (response) {
            swal("error : " + response.responseText);
        }
    });
}

function MediaPlanGetQuartersAndWeeks(year) {
    var selectedYear = year;
    var currentYear = FirstYear;
    var today = new Date();
    var currentQuarter = Math.floor((today.getMonth() + 3) / 3);
    var url = "/MediaPlan/MediaPlanGetQuartersAndWeeks/";
    $.ajax({
        url: url,
        data: {
            Year: year,
        },
        cache: false,
        type: "POST",
        success: function (result) {
            if ((result != undefined || result != null) && result.responseData.length > 0) {
                globalQuarters = result.responseData;
                $("#ddlMediaPlanLongPlanQuarter").empty();
                if (selectedYear != currentYear) {
                    for (var x = 0; x < result.responseData.length; x++) {
                        $("#ddlMediaPlanLongPlanQuarter").append("<option value=" + result.responseData[x].quarterId + ">" + result.responseData[x].quarterName + "</option>");
                    }
                    $("#ddlMediaPlanLongPlanQuarter").val(result.responseData[0].quarterId);
                    defaultQuarterId = result.responseData[0].quarterId;
                    defaultQuarter = result.responseData[0].quarterName;
                    curQuarter = result.responseData[0];
                }
                else {
                    currentQuarter = currentQuarter == 4 ? currentQuarter - 1 : currentQuarter;
                    for (var x = 0; x <= currentQuarter; x++) {

                        $("#ddlMediaPlanLongPlanQuarter").append("<option value=" + result.responseData[x].quarterId + ">" + result.responseData[x].quarterName + "</option>");
                    }

                    $("#ddlMediaPlanLongPlanQuarter").val($("#hdnQuarterId").val());
                    defaultQuarterId = $("#hdnQuarterId").val();
                    defaultQuarter = $("#hdnQuarterName").val();
                    curQuarter = globalQuarters.filter(o => o.quarterId == defaultQuarterId)[0];
                }
                if (curQuarter.quarterId == $("#hdnQuarterId").val())
                    MediaPlanSetHeader($("#hdnQuarterId"));
            }
            else {
                $("#ddlMediaPlanLongPlanQuarter").empty();
            }
        },
        error: function (response) {
            swal("error : " + response.responseText);
        }
    });
}

function MediaPlanSetHeader(quarterid) {
    quarter = curQuarter;
    $("#thmpLongPlanNetwork").empty();
    var wk14 = (quarter.wk14_Date == null) ? " " : quarter.wk14_Date;
    var markup = '<tr class="summary-header-row">' +
        '<th scope="col" style="color:white;font-weight:bold;width:900px;max-width:900px;border-right:1px solid white;text-transform: capitalize; text-align:left;">Property Name</th>' +
        '<th scope="col" style="color:white;font-weight:bold;width:50px;max-width:100px;border-right:1px solid white;text-transform: capitalize;text-align:left;">DP</th>' +
        '<th scope="col" style="color:white;font-weight:bold;width:50px;max-width:100px;border-right:1px solid white;text-transform: capitalize;text-align:left;">BT</th>' +
        '<th scope="col" style="color:white;font-weight:bold;width:40px;max-width:100px;border-right:1px solid white;text-transform: capitalize;text-align:right;">Len.</th>' +
        '<th scope="col" style="color:white;font-weight:bold;width:130px;max-width:150px;border-right:1px solid white;text-transform: capitalize;text-align:right;">Rate</th>' +
        '<th scope="col" style="color:white;font-weight:bold;width:130px;max-width:150px;border-right:1px solid white;text-transform: capitalize;text-align:right;">IMP</th>' +
        '<th scope="col" style="color:white;font-weight:bold;width:130px;max-width:150px;border-right:1px solid white;text-transform: capitalize;text-align:right;">CPM</th>';
    markup += '<th scope="col" style="color:white;font-weight:bold;width:130px;max-width:150px;border-right:1px solid white;text-transform: capitalize;text-align:right;padding-right: 5px;">' + quarter.wk01_Date + '</th>'
    markup += '<th scope="col" style="color:white;font-weight:bold;width:130px;max-width:150px;border-right:1px solid white;text-transform: capitalize;text-align:right;padding-right: 5px;">' + quarter.wk02_Date + '</th>'
    markup += '<th scope="col" style="color:white;font-weight:bold;width:130px;max-width:150px;border-right:1px solid white;text-transform: capitalize;text-align:right;padding-right: 5px;">' + quarter.wk03_Date + '</th>'
    markup += '<th scope="col" style="color:white;font-weight:bold;width:130px;max-width:150px;border-right:1px solid white;text-transform: capitalize;text-align:right;padding-right: 5px;">' + quarter.wk04_Date + '</th>'
    markup += '<th scope="col" style="color:white;font-weight:bold;width:130px;max-width:150px;border-right:1px solid white;text-transform: capitalize;text-align:right;padding-right: 5px;">' + quarter.wk05_Date + '</th>'
    markup += '<th scope="col" style="color:white;font-weight:bold;width:130px;max-width:150px;border-right:1px solid white;text-transform: capitalize;text-align:right;padding-right: 5px;">' + quarter.wk06_Date + '</th>'
    markup += '<th scope="col" style="color:white;font-weight:bold;width:130px;max-width:150px;border-right:1px solid white;text-transform: capitalize;text-align:right;padding-right: 5px;">' + quarter.wk07_Date + '</th>'
    markup += '<th scope="col" style="color:white;font-weight:bold;width:130px;max-width:150px;border-right:1px solid white;text-transform: capitalize;text-align:right;padding-right: 5px;">' + quarter.wk08_Date + '</th>'
    markup += '<th scope="col" style="color:white;font-weight:bold;width:130px;max-width:150px;border-right:1px solid white;text-transform: capitalize;text-align:right;padding-right: 5px;">' + quarter.wk09_Date + '</th>'
    markup += '<th scope="col" style="color:white;font-weight:bold;width:130px;max-width:150px;border-right:1px solid white;text-transform: capitalize;text-align:right;padding-right: 5px;">' + quarter.wk10_Date + '</th>'
    markup += '<th scope="col" style="color:white;font-weight:bold;width:130px;max-width:150px;border-right:1px solid white;text-transform: capitalize;text-align:right;padding-right: 5px;">' + quarter.wk11_Date + '</th>'
    markup += '<th scope="col" style="color:white;font-weight:bold;width:130px;max-width:150px;border-right:1px solid white;text-transform: capitalize;text-align:right;padding-right: 5px;">' + quarter.wk12_Date + '</th>'
    markup += '<th scope="col" style="color:white;font-weight:bold;width:130px;max-width:150px;border-right:1px solid white;text-transform: capitalize;text-align:right;padding-right: 5px;">' + quarter.wk13_Date + '</th>'
    if (wk14 != " ") {
        markup += '<th scope="col" style="color:white;font-weight:bold;width:130px;max-width:150px;border-right:1px solid white;text-transform: capitalize;text-align:right;padding-right: 5px;">' + wk14 + '</th>';
    }

    $("#thmpLongPlanNetwork").html(markup).show();
    MediaPlanGetPropertiesData();
}

function MediaPlanGetSelectedDemos() {
    var mediaPlanId = parseInt($("#hdnMediaPlanId").val());
    var url = "/MediaPlan/GetMediaPlanDemos/";
    $.ajax({
        url: url,
        data: {
            "MediaPlanId": mediaPlanId,
            "BuyTypeGroup": $("#hdnBTGroupName").val()
        },
        cache: false,
        type: "POST",
        success: function (result) {
            if ((result != undefined || result != null) && result.responseData.length > 0) {
                $("#ddlMediaPlanLongPlanDemos").empty();
                for (var x = 0; x < result.responseData.length; x++) {
                    if (x == 0) {
                        $("#ddlMediaPlanLongPlanDemos").append("<option value=" + result.responseData[x].demoId + " selected>" + result.responseData[x].demoName + "</option>");
                    }
                    else {
                        $("#ddlMediaPlanLongPlanDemos").append("<option value=" + result.responseData[x].demoId + ">" + result.responseData[x].demoName + "</option>");
                    }
                }
                defaultDemoId = result.responseData[0].demoId;
                FirstDemo = result.responseData[0].demoId;
                curDemo = result.responseData[0].demoId;
            }
        },
        error: function (response) {
            swal("error : " + response.responseText);
        }
    });
}

function MediaPlanGetPropertiesData() {
    $("#tbmpLongPlanNetwork").html("");
    SelProperties = [];
    var _quarterName = defaultQuarter;
    var _countryId = 5;
    var _networkId = globalNetworkId;
    var _demoId = $("#ddlMediaPlanLongPlanDemos").val();
    var _buytypeGroup = $("#hdnBTGroupName").val();
    var _planYear = $("#ddlMediaPlanLongPlanYears").val();

    var url = "/MediaPlan/GetMediaPlanProperties/";
    $.ajax({
        url: url,
        data: {
            QuarterName: _quarterName,
            CountryId: _countryId,
            NetworkId: _networkId,
            DemoId: _demoId,
            BuyTypeGroup: _buytypeGroup,
            PlanYear: _planYear,
            MediaPlanId: $("#hdnMediaPlanId").val()
        },
        cache: false,
        type: "POST",
        success: function (result) {
            let responseData = result.responseData.filter(function (el) {
                return el.clientId == 0 ||
                    el.clientId == $("#hdnClientId").val();
            }
            );
            if (responseData.length > 0) {
                $(".dropdown").removeClass("on");
                $("#ddlMediaPlanProperties").empty();



                globalProperties = jQuery.extend(true, [], responseData);
                SetSpendData();//ST-1178 
                Set15SecDataBlank(0);

                SetDRClearanceDataBlank();
                SetSpendAtClearance();//ST-1178

                var markup = "";
                markup = '<label class="dropdown-option"><input id="chkRate_0" type="checkbox" class="btg-inputs" data-toggle="check-all" name="dropdown-group"  value="-1" onclick="SetSelectedPropertiesTable(-1,this);"/><div style="margin-top: -24px;margin-left: 18px;"> Select All</div></label>'
                for (var x = 0; x < responseData.length; x++) {
                    var propertyHTML = '<table><tbody><tr><td style="width:255px;white-space:nowrap;text-align:left;"> ' + responseData[x].propertyName + '</td><td style="width:130px;white-space:nowrap;text-align:left;"><span style="margin-right:8px; text-align:center;">|</span>' + responseData[x].startTime + '-' + responseData[x].endTime + '</td><td style="width:30px;text-align:left;"><span style="margin-right: 8px; text-align:center;">|</span>' + responseData[x].dp + '</td><td style="width:105px;text-align:left;"><span style="margin-right: 8px; text-align:center;">|</span>' + responseData[x].days + '</td><td style="width:45px;text-align:left;"><span style="margin-right: 8px; text-align:center;">|</span>:' + responseData[x].spotLen + '</td><td style="width:100px;text-align:left;"><span style="margin-right: 8px; text-align:center;">|</span>' + (Number(responseData[x].rateAmt)).toLocaleString('en-US', { style: 'currency', currency: 'USD', }) + '</td><td style="width:60px;text-align:left;"><span style="margin-right: 8px; text-align:center;">|</span>' + (Number(responseData[x].impressions)).toLocaleString('en-US', { style: 'currency', currency: 'USD', }) + '</td><td style="width:30px;white-space:nowrap;text-align:left;"><span style="margin-right: 8px; margin-left: 8px; text-align:center;">|</span>' + responseData[x].status + '</td></tbody></table>'
                    markup += '<label class="dropdown-option"><input type="checkbox" id="chkRate_' + responseData[x].rateId + '" class="btg-inputs" data-toggle="check-all" name="dropdown-group" onclick="SetSelectedPropertiesTable(\'' + x + '\',this);" value=' + x + ' /><div style="margin-top: -24px;margin-left: 18px;">' + propertyHTML + '</div></label>';
                }
            }
            else {
                $(".dropdown").removeClass("on");
                $("#ddlMediaPlanProperties").empty();
                $("#ddlMediaPlanProperties").html("No data Available");
            }
            $("#ddlMediaPlanProperties").html(markup).show();
            IntializePlaceholder();


        },
        error: function (response) {
            swal("error : " + response.responseText);
        }
    });


}

function Set15SecDataBlank(resetProp) {
    if (parseInt($("#hdn15SecPerc").val()) > 0) {
        var perc15Row;
        if (globalProperties != null && globalProperties != undefined && globalProperties.filter(o => o.spotLen == 15).length > 0) {
            perc15Row = jQuery.extend(true, {}, globalProperties[0]);
            perc15Row.buyTypeId = 0;
            perc15Row.propertyId = 0;
            perc15Row.propertyName = "Percentage of :15s";
        }
        else if (SelPlaceholder != null && SelPlaceholder != undefined && SelPlaceholder.filter(o => o.spotLen == 15).length > 0) {
            perc15Row = jQuery.extend(true, {}, SelPlaceholder[0]);
            perc15Row.buyTypeId = 0;
            perc15Row.propertyId = 0;
            perc15Row.propertyName = "Percentage of :15s";
        }
        else {
            Perc15SecData = null;
        }
        Perc15SecData = perc15Row;
        if (resetProp == 1 || Perc15SecData == null || Perc15SecData == undefined) {
            ResetMediaPlanPropData();
        }
    }
}

function SetSpendData(resetProp) {
    var SpendRow;
    if (globalProperties != null && globalProperties.length > 0) {
        SpendRow = jQuery.extend(true, {}, globalProperties[0]);
        SpendRow.buyTypeId = 0;
        SpendRow.propertyId = 0;
        SpendRow.propertyName = "Spend";
    }
    else if (SelPlaceholder != null && SelPlaceholder != undefined && SelPlaceholder.length > 0) {
        SpendRow = jQuery.extend(true, {}, SelPlaceholder[0]);
        SpendRow.buyTypeId = 0;
        SpendRow.propertyId = 0;
        SpendRow.propertyName = "Spend";
    }
    else {
        SpendData = null;
    }
    SpendData = SpendRow;
    if (SpendData != null && SpendData != undefined) {
        SpendData.wk01Spots = 0;
        SpendData.wk02Spots = 0;
        SpendData.wk03Spots = 0;
        SpendData.wk04Spots = 0;
        SpendData.wk05Spots = 0;
        SpendData.wk06Spots = 0;
        SpendData.wk07Spots = 0;
        SpendData.wk08Spots = 0;
        SpendData.wk09Spots = 0;
        SpendData.wk10Spots = 0;
        SpendData.wk11Spots = 0;
        SpendData.wk12Spots = 0;
        SpendData.wk13Spots = 0;
        SpendData.wk14Spots = 0;
    }
    if (resetProp == 1 || SpendData == null || SpendData == undefined) {
        ResetMediaPlanPropData();
    }
}



// ST-1188 Spont-3 Fix
function SetDRClearanceDataBlank() {
    if (ExpectedClearanceData == null || ExpectedClearanceData == undefined) {
        if (globalProperties != null && globalProperties != undefined && globalProperties.length > 0) {
            var ExpClearance = jQuery.extend(true, {}, globalProperties[0]);
            ExpClearance.buyTypeId = 0
            ExpClearance.propertyId = 0
            ExpClearance.propertyName = "Expected Clearance";
            ExpectedClearanceData = ExpClearance;
        }
        else if (SelPlaceholder != null && SelPlaceholder != undefined && SelPlaceholder.length > 0) {
            var ExpClearance = jQuery.extend(true, {}, SelPlaceholder[0]);
            ExpClearance.buyTypeId = 0
            ExpClearance.propertyId = 0
            ExpClearance.propertyName = "Expected Clearance";
            ExpectedClearanceData = ExpClearance;
        }
    }
}

function SetSpendAtClearance(resetProp) {
    var SpendAtClearanceRow;
    if (globalProperties != null && globalProperties.length > 0) {
        SpendAtClearanceRow = jQuery.extend(true, {}, globalProperties[0]);
        SpendAtClearanceRow.buyTypeId = 0;
        SpendAtClearanceRow.propertyId = 0;
        SpendAtClearanceRow.propertyName = "Spend at Clearance";
    }
    else if (SelPlaceholder != null && SelPlaceholder != undefined && SelPlaceholder.length > 0) {
        SpendAtClearanceRow = jQuery.extend(true, {}, SelPlaceholder[0]);
        SpendAtClearanceRow.buyTypeId = 0;
        SpendAtClearanceRow.propertyId = 0;
        SpendAtClearanceRow.propertyName = "Spend at Clearance";
    }
    else {
        SpendAtClearanceData = null;
    }
    SpendAtClearanceData = SpendAtClearanceRow;
    if (resetProp == 1 || SpendAtClearanceData == null || SpendAtClearanceData == undefined) {
        ResetMediaPlanPropData();
    }
}
function SetSelectedPropertiesTable(index, _this) {

    var checked = $(_this).prop("checked");
    var rid = $(_this).attr("id").split('_')[1];
    var markup = "";
    if (index == -1) {
        if (!checked) {
            var hasSpotData = false;
            if (SelProperties.filter(o => o.spotLen == 15).length > 0 && globalBuyTypeGroup == "DR") {
                $("#tblmpLongPlanNetwork tbody tr:not(:first, :last) input[type=text]").each(function () {
                    var text_value = $(this).val();
                    if (text_value != "") {
                        hasSpotData = true;
                    }
                });
            }
            else {
                $("#tblmpLongPlanNetwork tbody tr input[type=text]").each(function () {
                    var text_value = $(this).val();
                    if (text_value != "") {
                        hasSpotData = true;
                    }
                });
            }
            if (hasSpotData) {
                swal({
                    title: "",
                    html: '<strong style="float:left"> Remove Properties? </strong> <br> <br> <span style="float:left; white-space:nowrap;"> You have chosen to deselect all properties. This will <br> </span> <span style="float:left;"> remove all properties and their allocated spots. </span>  <br> <br> <br> <span style="float:left"> Do you wish to proceed? </span> <br>',
                    type: 'warning',
                    showCancelButton: true,
                    width: 500,
                    height: 302,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'No',
                    confirmButtonText: 'Yes',
                    showLoaderOnConfirm: true,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    reverseButtons: true,
                    preConfirm: function () {
                        return new Promise(function (resolve) {
                            setTimeout(function () {
                                resolve();
                            }, 50);
                        });
                    }
                }).then(
                    function (result) {
                        SelProperties = [];
                        for (i = 0; i < globalProperties.length; i++) {
                            globalProperties[i].wk01Spots = 0;
                            globalProperties[i].wk02Spots = 0;
                            globalProperties[i].wk03Spots = 0;
                            globalProperties[i].wk04Spots = 0;
                            globalProperties[i].wk05Spots = 0;
                            globalProperties[i].wk06Spots = 0;
                            globalProperties[i].wk07Spots = 0;
                            globalProperties[i].wk08Spots = 0;
                            globalProperties[i].wk09Spots = 0;
                            globalProperties[i].wk10Spots = 0;
                            globalProperties[i].wk11Spots = 0;
                            globalProperties[i].wk12Spots = 0;
                            globalProperties[i].wk13Spots = 0;
                            globalProperties[i].wk14Spots = 0;
                        }
                        $("#tbmpLongPlanNetwork").html("");
                        if ((!isNaN(parseFloat($("#txtAdjustRates").val().replace("%", "")).toFixed(2)) && parseFloat($("#txtAdjustRates").val().replace("%", "")).toFixed(2) != 0)
                            || (!isNaN(parseFloat($("#txtAdjustImps").val().replace("%", "")).toFixed(2)) && parseFloat($("#txtAdjustImps").val().replace("%", "")).toFixed(2) != 0)) {
                            CalculateAdjustedRates('create');
                        }
                        else {
                            ResetMediaPlanPropData();
                        }
                    }, function (dismiss) {
                        $('#ddlMediaPlanProperties :input[value="' + index + '"]').click();
                    }
                );
            }
            else {
                SelProperties = [];
                for (i = 0; i < globalProperties.length; i++) {
                    globalProperties[i].wk01Spots = 0;
                    globalProperties[i].wk02Spots = 0;
                    globalProperties[i].wk03Spots = 0;
                    globalProperties[i].wk04Spots = 0;
                    globalProperties[i].wk05Spots = 0;
                    globalProperties[i].wk06Spots = 0;
                    globalProperties[i].wk07Spots = 0;
                    globalProperties[i].wk08Spots = 0;
                    globalProperties[i].wk09Spots = 0;
                    globalProperties[i].wk10Spots = 0;
                    globalProperties[i].wk11Spots = 0;
                    globalProperties[i].wk12Spots = 0;
                    globalProperties[i].wk13Spots = 0;
                    globalProperties[i].wk14Spots = 0;
                }
                $("#tbmpLongPlanNetwork").html("");
                if ((!isNaN(parseFloat($("#txtAdjustRates").val().replace("%", "")).toFixed(2)) && parseFloat($("#txtAdjustRates").val().replace("%", "")).toFixed(2) != 0)
                    || (!isNaN(parseFloat($("#txtAdjustImps").val().replace("%", "")).toFixed(2)) && parseFloat($("#txtAdjustImps").val().replace("%", "")).toFixed(2) != 0)) {
                    CalculateAdjustedRates('create');
                }
                else {
                    ResetMediaPlanPropData();
                }
                setTimeout(function () {
                    if ($('#ddlMediaPlanProperties input[type=checkbox]:checked').length == 0 && SelPlaceholder.length == 0) {
                        $("#btnSaveAddmpLongPlanNetworkModal, #btnSaveClosempLongPlanNetworkModal").prop("disabled", true);
                    }
                    else {
                        $("#btnSaveAddmpLongPlanNetworkModal, #btnSaveClosempLongPlanNetworkModal").prop("disabled", false);
                    }
                }, 1000);
                return;
            }

        }
        else {

            SelProperties = [];
            SelProperties = jQuery.extend(true, [], globalProperties);
            Set15SecDataBlank(0);
            $("#tbmpLongPlanNetwork").html("");

            if ((!isNaN(parseFloat($("#txtAdjustRates").val().replace("%", "")).toFixed(2)) && parseFloat($("#txtAdjustRates").val().replace("%", "")).toFixed(2) != 0)
                || (!isNaN(parseFloat($("#txtAdjustImps").val().replace("%", "")).toFixed(2)) && parseFloat($("#txtAdjustImps").val().replace("%", "")).toFixed(2) != 0)) {
                CalculateAdjustedRates('create');
            }
            else {
                ResetMediaPlanPropData();
            }
        }
    }
    else {
        if (!checked) {
            var hasSpotData = false;
            $("#tr_" + $(_this).attr('id').split('_')[1] + "  input[type=text]").each(function () {
                var text_value = $(this).val();
                if (text_value != "") {
                    hasSpotData = true;
                }
            });
            if (hasSpotData) {
                var propertyToDelete = SelProperties.filter(o => o.rateId == $(_this).attr('id').split('_')[1])[0].propertyName;
                swal({
                    title: "",
                    html: '<strong style="float:left"> Remove Property? </strong> <br> <br> <span style="float:left"> There are spots allocated to <strong>' + propertyToDelete + '.' + '</strong> </span>  <br> <br> <span style="float:left"> Are you sure you want to remove this property? </span> <br>',
                    type: 'warning',
                    showCancelButton: true,
                    width: 500,
                    height: 302,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'No',
                    confirmButtonText: 'Yes',
                    showLoaderOnConfirm: true,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    reverseButtons: true,
                    preConfirm: function () {
                        return new Promise(function (resolve) {
                            setTimeout(function () {
                                resolve();
                            }, 50);
                        });
                    }
                }).then(
                    function (result) {
                        SelProperties.splice(SelProperties.indexOf(SelProperties.filter(o => o.rateId == rid)[0]), 1);
                        globalProperties.filter(o => o.rateId == rid)[0].wk01Spots = 0;
                        globalProperties.filter(o => o.rateId == rid)[0].wk02Spots = 0;
                        globalProperties.filter(o => o.rateId == rid)[0].wk03Spots = 0;
                        globalProperties.filter(o => o.rateId == rid)[0].wk04Spots = 0;
                        globalProperties.filter(o => o.rateId == rid)[0].wk05Spots = 0;
                        globalProperties.filter(o => o.rateId == rid)[0].wk06Spots = 0;
                        globalProperties.filter(o => o.rateId == rid)[0].wk07Spots = 0;
                        globalProperties.filter(o => o.rateId == rid)[0].wk08Spots = 0;
                        globalProperties.filter(o => o.rateId == rid)[0].wk09Spots = 0;
                        globalProperties.filter(o => o.rateId == rid)[0].wk10Spots = 0;
                        globalProperties.filter(o => o.rateId == rid)[0].wk11Spots = 0;
                        globalProperties.filter(o => o.rateId == rid)[0].wk12Spots = 0;
                        globalProperties.filter(o => o.rateId == rid)[0].wk13Spots = 0;
                        globalProperties.filter(o => o.rateId == rid)[0].wk14Spots = 0;
                        $("#tbmpLongPlanNetwork").html("");
                        if ((!isNaN(parseFloat($("#txtAdjustRates").val().replace("%", "")).toFixed(2)) && parseFloat($("#txtAdjustRates").val().replace("%", "")).toFixed(2) != 0)
                            || (!isNaN(parseFloat($("#txtAdjustImps").val().replace("%", "")).toFixed(2)) && parseFloat($("#txtAdjustImps").val().replace("%", "")).toFixed(2) != 0)) {
                            CalculateAdjustedRates('create');
                        }
                        else {
                            ResetMediaPlanPropData();
                        }
                        return false;
                    }, function (dismiss) {
                        var HTML = $(_this).parent('label').text();
                        HTML = HTML.split("|");
                        HTML = HTML[0] + "&nbsp &nbsp &nbsp &nbsp|&nbsp &nbsp &nbsp &nbsp" + HTML[1] + "&nbsp &nbsp &nbsp|&nbsp &nbsp &nbsp" + HTML[2] + "&nbsp &nbsp &nbsp|&nbsp &nbsp &nbsp" + HTML[3] + "&nbsp &nbsp &nbsp|&nbsp &nbsp &nbsp" + HTML[4] + "&nbsp &nbsp &nbsp|&nbsp &nbsp &nbsp" + HTML[5] + "&nbsp &nbsp &nbsp|&nbsp &nbsp &nbsp" + HTML[6] + "&nbsp &nbsp &nbsp|&nbsp &nbsp &nbsp" + HTML[7];
                        $(_this).prop("checked", true);
                        if ($('#ddlMediaPlanProperties input[type=checkbox]:checked').length == 1) {
                            $("#propddlLabel").html(HTML);
                            if (SelPropertiesBkp.length > 0) {
                                SelProperties.push(jQuery.extend(true, {}, SelPropertiesBkp[0]));
                                SelPropertiesBkp.splice(0, 1);
                                $("#btnSaveAddmpLongPlanNetworkModal, #btnSaveClosempLongPlanNetworkModal").prop("disabled", false);
                            }
                        }
                        else {
                            $("#propddlLabel").text($('#ddlMediaPlanProperties input[type=checkbox]:checked').length + ' Selected');
                        }
                        if ((!isNaN(parseFloat($("#txtAdjustRates").val().replace("%", "")).toFixed(2)) && parseFloat($("#txtAdjustRates").val().replace("%", "")).toFixed(2) != 0)
                            || (!isNaN(parseFloat($("#txtAdjustImps").val().replace("%", "")).toFixed(2)) && parseFloat($("#txtAdjustImps").val().replace("%", "")).toFixed(2) != 0)) {
                            CalculateAdjustedRates('create');
                        }
                        else {
                            ResetMediaPlanPropData();
                        }
                        return false;
                    }
                );
            }
            else {
                SelProperties.splice(SelProperties.indexOf(SelProperties.filter(o => o.rateId == rid)[0]), 1);
                globalProperties.filter(o => o.rateId == rid)[0].wk01Spots = 0;
                globalProperties.filter(o => o.rateId == rid)[0].wk02Spots = 0;
                globalProperties.filter(o => o.rateId == rid)[0].wk03Spots = 0;
                globalProperties.filter(o => o.rateId == rid)[0].wk04Spots = 0;
                globalProperties.filter(o => o.rateId == rid)[0].wk05Spots = 0;
                globalProperties.filter(o => o.rateId == rid)[0].wk06Spots = 0;
                globalProperties.filter(o => o.rateId == rid)[0].wk07Spots = 0;
                globalProperties.filter(o => o.rateId == rid)[0].wk08Spots = 0;
                globalProperties.filter(o => o.rateId == rid)[0].wk09Spots = 0;
                globalProperties.filter(o => o.rateId == rid)[0].wk10Spots = 0;
                globalProperties.filter(o => o.rateId == rid)[0].wk11Spots = 0;
                globalProperties.filter(o => o.rateId == rid)[0].wk12Spots = 0;
                globalProperties.filter(o => o.rateId == rid)[0].wk13Spots = 0;
                globalProperties.filter(o => o.rateId == rid)[0].wk14Spots = 0;
                $("#tbmpLongPlanNetwork").html("");
                if ((!isNaN(parseFloat($("#txtAdjustRates").val().replace("%", "")).toFixed(2)) && parseFloat($("#txtAdjustRates").val().replace("%", "")).toFixed(2) != 0)
                    || (!isNaN(parseFloat($("#txtAdjustImps").val().replace("%", "")).toFixed(2)) && parseFloat($("#txtAdjustImps").val().replace("%", "")).toFixed(2) != 0)) {
                    CalculateAdjustedRates('create');
                }
                else {
                    ResetMediaPlanPropData();
                }
                return false;
            }
        }
        else {
            var arrSelectedProperties = jQuery.extend(true, {}, globalProperties[index]);
            SelProperties.push(arrSelectedProperties);
            $("#tbmpLongPlanNetwork").html("");
            if ((!isNaN(parseFloat($("#txtAdjustRates").val().replace("%", "")).toFixed(2)) && parseFloat($("#txtAdjustRates").val().replace("%", "")).toFixed(2) != 0)
                || (!isNaN(parseFloat($("#txtAdjustImps").val().replace("%", "")).toFixed(2)) && parseFloat($("#txtAdjustImps").val().replace("%", "")).toFixed(2) != 0)) {
                CalculateAdjustedRates('create');
            }
            else {
                ResetMediaPlanPropData();
            }
        }
    }
    if ($('#ddlMediaPlanProperties input[type=checkbox]:checked').length == 0 && SelPlaceholder.length == 0) {
        $("#btnSaveAddmpLongPlanNetworkModal, #btnSaveClosempLongPlanNetworkModal").prop("disabled", true);
        if (SelProperties.length == 1)
            SelPropertiesBkp = jQuery.extend(true, [], SelProperties);
        SelProperties = [];
        $("#tbmpLongPlanNetwork").html("");
    }
    else {
        $("#btnSaveAddmpLongPlanNetworkModal, #btnSaveClosempLongPlanNetworkModal").prop("disabled", false);
    }
}

//HM ST-1178
function RenderSpendData(spendData, weekKey) {
    if (spendData && spendData[weekKey] > 0) {
        return $.fn.dataTable.render.number(',', '.', 0, '$').display(spendData[weekKey]);
    }
    return '';
}
//HM ST-1178
function RenderSpendAtClearance(SpendAtClearanceData, weekKey) {
    if (SpendAtClearanceData && SpendAtClearanceData[weekKey] > 0) {
        return $.fn.dataTable.render.number(',', '.', 0, '$').display(SpendAtClearanceData[weekKey]);
    }
    return '';
}

function ResetMediaPlanPropData() {
    $("#tbDayPartLongPlan").html("");
    if ((SelPlaceholder != null && SelPlaceholder.length > 0) || (SelProperties != null && SelProperties != undefined && SelProperties.length > 0)) {
        var HTML = "";
        var wk14 = (quarter.wk14_Date == null) ? " " : quarter.wk14_Date;
        if ((SelPlaceholder.length > 0 && SelPlaceholder.filter(o => o.spotLen == 15).length > 0) || (SelProperties.length > 0 && SelProperties.filter(o => o.spotLen == 15).length > 0)) {   /* ST-1109 Changed by Shariq*/
            HTML += '<tr class="per15row" id = "row-15percent">';
            HTML += '<td style="text-align:left;font-weight:bold;">Percentage of :15s</td>';
            HTML += '<td style="text-align:left;"></td>';
            HTML += '<td style="text-align:left;"></td>';
            HTML += '<td></td>';
            HTML += '<td></td>';
            HTML += '<td></td>';
            HTML += '<td></td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;" id="td15swk01Spots">' + (Perc15SecData["wk01Spots"] > 0 ? FormatNumber(Perc15SecData["wk01Spots"], "decimalpercentage", 2) : '') + '</td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;" id="td15swk02Spots">' + (Perc15SecData["wk02Spots"] > 0 ? FormatNumber(Perc15SecData["wk02Spots"], "decimalpercentage", 2) : '') + '</td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;" id="td15swk03Spots">' + (Perc15SecData["wk03Spots"] > 0 ? FormatNumber(Perc15SecData["wk03Spots"], "decimalpercentage", 2) : '') + '</td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;" id="td15swk04Spots">' + (Perc15SecData["wk04Spots"] > 0 ? FormatNumber(Perc15SecData["wk04Spots"], "decimalpercentage", 2) : '') + '</td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;" id="td15swk05Spots">' + (Perc15SecData["wk05Spots"] > 0 ? FormatNumber(Perc15SecData["wk05Spots"], "decimalpercentage", 2) : '') + '</td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;" id="td15swk06Spots">' + (Perc15SecData["wk06Spots"] > 0 ? FormatNumber(Perc15SecData["wk06Spots"], "decimalpercentage", 2) : '') + '</td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;" id="td15swk07Spots">' + (Perc15SecData["wk07Spots"] > 0 ? FormatNumber(Perc15SecData["wk07Spots"], "decimalpercentage", 2) : '') + '</td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;" id="td15swk08Spots">' + (Perc15SecData["wk08Spots"] > 0 ? FormatNumber(Perc15SecData["wk08Spots"], "decimalpercentage", 2) : '') + '</td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;" id="td15swk09Spots">' + (Perc15SecData["wk09Spots"] > 0 ? FormatNumber(Perc15SecData["wk09Spots"], "decimalpercentage", 2) : '') + '</td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;" id="td15swk10Spots">' + (Perc15SecData["wk10Spots"] > 0 ? FormatNumber(Perc15SecData["wk10Spots"], "decimalpercentage", 2) : '') + '</td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;" id="td15swk11Spots">' + (Perc15SecData["wk11Spots"] > 0 ? FormatNumber(Perc15SecData["wk11Spots"], "decimalpercentage", 2) : '') + '</td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;" id="td15swk12Spots">' + (Perc15SecData["wk12Spots"] > 0 ? FormatNumber(Perc15SecData["wk12Spots"], "decimalpercentage", 2) : '') + '</td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;" id="td15swk13Spots">' + (Perc15SecData["wk13Spots"] > 0 ? FormatNumber(Perc15SecData["wk13Spots"], "decimalpercentage", 2) : '') + '</td>';
            if (wk14 != " ") {
                HTML += '<td style="padding-left: 1px; padding-right:1px;" id="td15swk14Spots">' + (Perc15SecData["wk13Spots"] > 0 ? FormatNumber(Perc15SecData["wk13Spots"], "decimalpercentage", 2) : '') + '</td>';
            }
            HTML += '</tr>';
        }

        if (SelPlaceholder !== null && SelPlaceholder != undefined && SelPlaceholder.length > 0) {
            SelPlaceholder.sort((a, b) => b.rateId - a.rateId);
            for (var i = 0; i < SelPlaceholder.length; i++) {
                HTML += '<tr id="tr_' + i + '" class="placeholder" style="font-weight:bold;" id="row-' + i + '" data-rid="' + SelPlaceholder[i].rateId + '">';
                HTML += '<td onclick="return TogglePlaceHolderPropertyData(this, ' + SelPlaceholder[i].rateId + ')" class="clickable" id="txtPlaceholder" style="text-align:left;">';
                HTML += '<span id="spnPropertyName_' + SelPlaceholder[i].rateId + '"> ' + SelPlaceholder[i].propertyName + '</span> ';
                HTML += '<input autocomplete="off" type"text" id="txtPlaceHolder_' + SelPlaceholder[i].rateId + '" value="' + SelPlaceholder[i].propertyName + '" onblur="SetPlaceHolderPropertyName(this);" style="display:none;width:80%"/>';
                HTML += '<span class="mp-cross-icon" onclick="RemovePlaceholder(this,\'' + i + '\');" > <i class="fa fa-trash" id="spnDeletePlaceholder_' + SelPlaceholder[i].rateId + '" aria-hidden="true"></i></span >';
                HTML += '</td > ';
                HTML += '<td style="text-align:left;"><select id = "ddlDP_' + SelPlaceholder[i].rateId + '" onchange = "return SetPlaceHolderData(this,' + i + ');"></td>';
                HTML += '<td style="text-align:left;"><select id = "ddlBT_' + SelPlaceholder[i].rateId + '" onchange = "return SetPlaceHolderData(this,' + i + ');"></td>';
                HTML += '<td style="text-align:left;"><select id = "ddlLen_' + SelPlaceholder[i].rateId + '" onchange = "return SetPlaceHolderData(this,' + i + ');"></td>';

                HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" class="numeric" onkeydown="return MoveFocus(this,event);" onkeyup="return ValidatePlaceholderInputs(this,\'rates\', \'create\');" onchange="return CheckInputData(this,\'rates\', \'create\');" oninput=\"this.value=appendDollarSignToInput(this.value, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])\" value="' + (SelPlaceholder[i].rateAmt > 0 ? $.fn.dataTable.render.number(',', '.', 2, '$').display(SelPlaceholder[i].rateAmt) : "") + '" id="txtRate_' + SelPlaceholder[i].rateId + '" row="' + i + '" col="01" data-pid="' + SelPlaceholder[i].propertyId + '" data-rid="' + SelPlaceholder[i].rateId + '"    data-len="" style="width: 126px;text-align:right;" /></td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" id="txtImps_' + SelPlaceholder[i].rateId + '" class="numeric" onkeydown="return MoveFocus(this,event);" onkeyup="return ValidatePlaceholderInputs(this,\'imps\',\'create\');" onchange="return CheckInputData(this,\'imps\', \'create\');" col="01" data-pid="" data-rid=""    data-len="" style="width: 126px;text-align:right;" value="' + (SelPlaceholder[i].impressions > 0 ? $.fn.dataTable.render.number(',', '.', 2, '').display(SelPlaceholder[i].impressions) : "") + '"/></td>';
                HTML += '<td id="tdCPM_' + SelPlaceholder[i].rateId + '">' + (SelPlaceholder[i].cpm > 0 ? $.fn.dataTable.render.number(',', '.', 2, '$').display(SelPlaceholder[i].cpm) : "") + '</td>';

                var disableEnablePlaceholder = "";
                if (parseInt(SelPlaceholder[i].dayPartId) == 0 || parseInt(SelPlaceholder[i].buyTypeId) == 0 || parseInt(SelPlaceholder[i].spotLen) == 0) {
                    disableEnablePlaceholder = "disabled";
                }
                HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" class="numeric clsactive_' + SelPlaceholder[i].rateId + '" onkeydown="return ValidateNumber(this,event);" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');" onchange="CalculatePercentages(this);" id="txtxSpots_' + SelPlaceholder[i].rateId + '" row="' + i + '" col="01" data-pid="' + SelPlaceholder[i].propertyId + '" data-rid="' + SelPlaceholder[i].rateId + '"    data-len="' + SelPlaceholder[i].spotLen + '" value="' + SetSpotVal(SelPlaceholder[i].wk01Spots) + '" style="width: 58px;text-align:right;" ' + disableEnablePlaceholder + ' /></td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text"  onkeydown="return ValidateNumber(this,event);" class="numeric clsactive_' + SelPlaceholder[i].rateId + '" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');"  onchange="CalculatePercentages(this);" id="txtxSpots_' + SelPlaceholder[i].rateId + '"  row="' + i + '" col="02"  data-dp="' + SelPlaceholder[i].dp + '"  data-pid="' + SelPlaceholder[i].propertyId + ' "  data-rid="' + SelPlaceholder[i].rateId + '"   data-len="" style="width: 58px;text-align:right;"  value="' + SetSpotVal(SelPlaceholder[i].wk02Spots) + '" ' + disableEnablePlaceholder + '  /></td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);" class="numeric clsactive_' + SelPlaceholder[i].rateId + '" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');"  onchange="CalculatePercentages(this);" id="txtxSpots_' + SelPlaceholder[i].rateId + '"  row="' + i + '" col="03"  data-dp="' + SelPlaceholder[i].dp + '"  data-pid="' + SelPlaceholder[i].propertyId + ' "  data-rid="' + SelPlaceholder[i].rateId + '"   data-len="" style="width: 58px;text-align:right;"  value="' + SetSpotVal(SelPlaceholder[i].wk03Spots) + '" ' + disableEnablePlaceholder + '  /></td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off"  type="text" onkeydown="return ValidateNumber(this,event);" class="numeric clsactive_' + SelPlaceholder[i].rateId + '" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');"  onchange="CalculatePercentages(this);" id="txtxSpots_' + SelPlaceholder[i].rateId + '"  row="' + i + '" col="04"  data-dp="' + SelPlaceholder[i].dp + '"  data-pid="' + SelPlaceholder[i].propertyId + ' "  data-rid="' + SelPlaceholder[i].rateId + '"   data-len="" style="width: 58px;text-align:right;"  value="' + SetSpotVal(SelPlaceholder[i].wk04Spots) + '" ' + disableEnablePlaceholder + '  /></td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);" class="numeric clsactive_' + SelPlaceholder[i].rateId + '" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');"  onchange="CalculatePercentages(this);" id="txtxSpots_' + SelPlaceholder[i].rateId + '"  row="' + i + '" col="05"  data-dp="' + SelPlaceholder[i].dp + '"  data-pid="' + SelPlaceholder[i].propertyId + ' "  data-rid="' + SelPlaceholder[i].rateId + '"   data-len="" style="width: 58px;text-align:right;"  value="' + SetSpotVal(SelPlaceholder[i].wk05Spots) + '" ' + disableEnablePlaceholder + '  /></td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);" class="numeric clsactive_' + SelPlaceholder[i].rateId + '" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');"  onchange="CalculatePercentages(this);" id="txtxSpots_' + SelPlaceholder[i].rateId + '"  row="' + i + '" col="06"  data-dp="' + SelPlaceholder[i].dp + '"  data-pid="' + SelPlaceholder[i].propertyId + ' "  data-rid="' + SelPlaceholder[i].rateId + '"   data-len="" style="width: 58px;text-align:right;"  value="' + SetSpotVal(SelPlaceholder[i].wk06Spots) + '" ' + disableEnablePlaceholder + '  /></td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);" class="numeric clsactive_' + SelPlaceholder[i].rateId + '" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');"  onchange="CalculatePercentages(this);" id="txtxSpots_' + SelPlaceholder[i].rateId + '"  row="' + i + '" col="07"  data-dp="' + SelPlaceholder[i].dp + '"  data-pid="' + SelPlaceholder[i].propertyId + ' "  data-rid="' + SelPlaceholder[i].rateId + '"   data-len="" style="width: 58px;text-align:right;"  value="' + SetSpotVal(SelPlaceholder[i].wk07Spots) + '" ' + disableEnablePlaceholder + '  /></td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);" class="numeric clsactive_' + SelPlaceholder[i].rateId + '" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');"  onchange="CalculatePercentages(this);" id="txtxSpots_' + SelPlaceholder[i].rateId + '"  row="' + i + '" col="08"  data-dp="' + SelPlaceholder[i].dp + '"  data-pid="' + SelPlaceholder[i].propertyId + ' "  data-rid="' + SelPlaceholder[i].rateId + '"   data-len="" style="width: 58px;text-align:right;"  value="' + SetSpotVal(SelPlaceholder[i].wk08Spots) + '" ' + disableEnablePlaceholder + '  /></td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);" class="numeric clsactive_' + SelPlaceholder[i].rateId + '" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');"  onchange="CalculatePercentages(this);" id="txtxSpots_' + SelPlaceholder[i].rateId + '"  row="' + i + '" col="09"  data-dp="' + SelPlaceholder[i].dp + '"  data-pid="' + SelPlaceholder[i].propertyId + ' "  data-rid="' + SelPlaceholder[i].rateId + '"   data-len="" style="width: 58px;text-align:right;"  value="' + SetSpotVal(SelPlaceholder[i].wk09Spots) + '" ' + disableEnablePlaceholder + '  /></td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);" class="numeric clsactive_' + SelPlaceholder[i].rateId + '" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');"  onchange="CalculatePercentages(this);" id="txtxSpots_' + SelPlaceholder[i].rateId + '"  row="' + i + '" col="10"  data-dp="' + SelPlaceholder[i].dp + '"  data-pid="' + SelPlaceholder[i].propertyId + ' "  data-rid="' + SelPlaceholder[i].rateId + '"   data-len="" style="width: 58px;text-align:right;"  value="' + SetSpotVal(SelPlaceholder[i].wk10Spots) + '" ' + disableEnablePlaceholder + '  /></td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);" class="numeric clsactive_' + SelPlaceholder[i].rateId + '" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');"  onchange="CalculatePercentages(this);" id="txtxSpots_' + SelPlaceholder[i].rateId + '"  row="' + i + '" col="11"  data-dp="' + SelPlaceholder[i].dp + '"  data-pid="' + SelPlaceholder[i].propertyId + ' "  data-rid="' + SelPlaceholder[i].rateId + '"   data-len="" style="width: 58px;text-align:right;"  value="' + SetSpotVal(SelPlaceholder[i].wk11Spots) + '" ' + disableEnablePlaceholder + '  /></td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);" class="numeric clsactive_' + SelPlaceholder[i].rateId + '" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');"  onchange="CalculatePercentages(this);" id="txtxSpots_' + SelPlaceholder[i].rateId + '"  row="' + i + '" col="12"  data-dp="' + SelPlaceholder[i].dp + '"  data-pid="' + SelPlaceholder[i].propertyId + ' "  data-rid="' + SelPlaceholder[i].rateId + '"   data-len="" style="width: 58px;text-align:right;"  value="' + SetSpotVal(SelPlaceholder[i].wk12Spots) + '" ' + disableEnablePlaceholder + '  /></td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);" class="numeric clsactive_' + SelPlaceholder[i].rateId + '" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');"  onchange="CalculatePercentages(this);" id="txtxSpots_' + SelPlaceholder[i].rateId + '"  row="' + i + '" col="13"  data-dp="' + SelPlaceholder[i].dp + '"  data-pid="' + SelPlaceholder[i].propertyId + ' "  data-rid="' + SelPlaceholder[i].rateId + '"   data-len="" style="width: 58px;text-align:right;"  value="' + SetSpotVal(SelPlaceholder[i].wk13Spots) + '" ' + disableEnablePlaceholder + '  /></td>';
                if (wk14 != " ") {
                    HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" class="numeric clsactive_' + SelPlaceholder[i].rateId + '"  onkeydown="return ValidateNumber(this,event);"   onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');" onchange="CalculatePercentages(this);" id="txtxSpots_' + SelPlaceholder[i].rateId + '" row="' + i + '" col="14" data-pid="' + SelPlaceholder[i].propertyId + '" data-rid="' + SelPlaceholder[i].rateId + '"  data-dp="' + SelPlaceholder[i].dp + '"  data-len="' + SelPlaceholder[i].spotLen + '" style="width: 58px;text-align:right;" value="' + SetSpotVal(SelPlaceholder[i].wk14Spots) + '" ' + disableEnablePlaceholder + ' /></td>';
                }
                HTML += '</tr>';
            }
        }

        SelProperties.sort(function (a, b) {
            return a.propertyName.localeCompare(b.propertyName);
        });


        for (var index = 0; index < SelProperties.length; index++) {

            HTML += '<tr id="tr_' + SelProperties[index].rateId + '" class="clsProperties" style="font-weight:bold;" id="row-' + index + '" data-rid="' + SelProperties[index].rateId + '">';
            HTML += '<td style="text-align:left;">' + SelProperties[index].propertyName + '<span class="mp-cross-icon" onclick="RemoveProperty(this,\'' + index + '\');" ><i class="fa fa-trash" aria-hidden="true"></i></span></td>';
            HTML += '<td style="text-align:left;">' + SelProperties[index].dp + '</td>';
            HTML += '<td style="text-align:left;">' + SelProperties[index].buyTypeCode + '</td>';
            HTML += '<td>' + ':' + SelProperties[index].spotLen + '</td>';
            HTML += '<td style="color:' + rateTextColor + '">' + $.fn.dataTable.render.number(',', '.', 2, '$').display(SelProperties[index].rateAmt) + '</td>';
            HTML += '<td style="color:' + impsTextColor + '">' + $.fn.dataTable.render.number(',', '.', 2, '').display(SelProperties[index].impressions) + '</td>';
            HTML += '<td style="color:' + cpmTextColor + '">' + $.fn.dataTable.render.number(',', '.', 2, '$').display(SelProperties[index].cpm) + '</td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" class="numeric" onkeydown="return ValidateNumber(this,event);"  onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');" onchange="CalculatePercentages(this);" id="txtxSpots_' + SelProperties[index].rateId + '" row="' + index + '" col="01" data-pid="' + SelProperties[index].propertyId + '" data-rid="' + SelProperties[index].rateId + '"  data-dp="' + SelProperties[index].dp + '"  data-len="' + SelProperties[index].spotLen + '" style="width: 58px;text-align:right;" value="' + SetSpotVal(SelProperties[index].wk01Spots) + '"/></td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);"    class="numeric" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');" onchange="CalculatePercentages(this);" id="txtxSpots_' + SelProperties[index].rateId + '" row="' + index + '" col="02"  data-dp="' + SelProperties[index].dp + '"  data-pid="' + SelProperties[index].propertyId + '"  data-rid="' + SelProperties[index].rateId + '"   data-len="' + SelProperties[index].spotLen + '" style="width: 58px;text-align:right;"  value="' + SetSpotVal(SelProperties[index].wk02Spots) + '"/></td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);"    class="numeric" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');" onchange="CalculatePercentages(this);" id="txtxSpots_' + SelProperties[index].rateId + '" row="' + index + '" col="03"  data-dp="' + SelProperties[index].dp + '"  data-pid="' + SelProperties[index].propertyId + '"  data-rid="' + SelProperties[index].rateId + '"   data-len="' + SelProperties[index].spotLen + '" style="width: 58px;text-align:right;"  value="' + SetSpotVal(SelProperties[index].wk03Spots) + '"/></td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);"    class="numeric" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');" onchange="CalculatePercentages(this);" id="txtxSpots_' + SelProperties[index].rateId + '" row="' + index + '" col="04"  data-dp="' + SelProperties[index].dp + '"  data-pid="' + SelProperties[index].propertyId + '"  data-rid="' + SelProperties[index].rateId + '"   data-len="' + SelProperties[index].spotLen + '" style="width: 58px;text-align:right;"  value="' + SetSpotVal(SelProperties[index].wk04Spots) + '"/></td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);"    class="numeric" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');" onchange="CalculatePercentages(this);" id="txtxSpots_' + SelProperties[index].rateId + '" row="' + index + '" col="05"  data-dp="' + SelProperties[index].dp + '"  data-pid="' + SelProperties[index].propertyId + '"  data-rid="' + SelProperties[index].rateId + '"   data-len="' + SelProperties[index].spotLen + '" style="width: 58px;text-align:right;"  value="' + SetSpotVal(SelProperties[index].wk05Spots) + '"/></td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);"    class="numeric" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');" onchange="CalculatePercentages(this);" id="txtxSpots_' + SelProperties[index].rateId + '" row="' + index + '" col="06"  data-dp="' + SelProperties[index].dp + '"  data-pid="' + SelProperties[index].propertyId + '"  data-rid="' + SelProperties[index].rateId + '"   data-len="' + SelProperties[index].spotLen + '" style="width: 58px;text-align:right;"  value="' + SetSpotVal(SelProperties[index].wk06Spots) + '"/></td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);"    class="numeric" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');" onchange="CalculatePercentages(this);" id="txtxSpots_' + SelProperties[index].rateId + '" row="' + index + '" col="07"  data-dp="' + SelProperties[index].dp + '"  data-pid="' + SelProperties[index].propertyId + '"  data-rid="' + SelProperties[index].rateId + '"   data-len="' + SelProperties[index].spotLen + '" style="width: 58px;text-align:right;"  value="' + SetSpotVal(SelProperties[index].wk07Spots) + '"/></td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);"    class="numeric" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');" onchange="CalculatePercentages(this);" id="txtxSpots_' + SelProperties[index].rateId + '" row="' + index + '" col="08"  data-dp="' + SelProperties[index].dp + '"  data-pid="' + SelProperties[index].propertyId + '"  data-rid="' + SelProperties[index].rateId + '"   data-len="' + SelProperties[index].spotLen + '" style="width: 58px;text-align:right;"  value="' + SetSpotVal(SelProperties[index].wk08Spots) + '"/></td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);"    class="numeric" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');" onchange="CalculatePercentages(this);" id="txtxSpots_' + SelProperties[index].rateId + '" row="' + index + '" col="09"  data-dp="' + SelProperties[index].dp + '"  data-pid="' + SelProperties[index].propertyId + '"  data-rid="' + SelProperties[index].rateId + '"   data-len="' + SelProperties[index].spotLen + '" style="width: 58px;text-align:right;"  value="' + SetSpotVal(SelProperties[index].wk09Spots) + '"/></td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);"    class="numeric" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');" onchange="CalculatePercentages(this);" id="txtxSpots_' + SelProperties[index].rateId + '" row="' + index + '" col="10"  data-dp="' + SelProperties[index].dp + '"  data-pid="' + SelProperties[index].propertyId + '"  data-rid="' + SelProperties[index].rateId + '"   data-len="' + SelProperties[index].spotLen + '" style="width: 58px;text-align:right;"  value="' + SetSpotVal(SelProperties[index].wk10Spots) + '"/></td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);"    class="numeric" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');" onchange="CalculatePercentages(this);" id="txtxSpots_' + SelProperties[index].rateId + '" row="' + index + '" col="11"  data-dp="' + SelProperties[index].dp + '"  data-pid="' + SelProperties[index].propertyId + '"  data-rid="' + SelProperties[index].rateId + '"   data-len="' + SelProperties[index].spotLen + '" style="width: 58px;text-align:right;"  value="' + SetSpotVal(SelProperties[index].wk11Spots) + '"/></td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);"    class="numeric" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');" onchange="CalculatePercentages(this);" id="txtxSpots_' + SelProperties[index].rateId + '" row="' + index + '" col="12"  data-dp="' + SelProperties[index].dp + '"  data-pid="' + SelProperties[index].propertyId + '"  data-rid="' + SelProperties[index].rateId + '"   data-len="' + SelProperties[index].spotLen + '" style="width: 58px;text-align:right;"  value="' + SetSpotVal(SelProperties[index].wk12Spots) + '"/></td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);"    class="numeric" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');" onchange="CalculatePercentages(this);" id="txtxSpots_' + SelProperties[index].rateId + '" row="' + index + '" col="13"  data-dp="' + SelProperties[index].dp + '"  data-pid="' + SelProperties[index].propertyId + '"  data-rid="' + SelProperties[index].rateId + '"   data-len="' + SelProperties[index].spotLen + '" style="width: 58px;text-align:right;"  value="' + SetSpotVal(SelProperties[index].wk13Spots) + '"/></td>';
            if (wk14 != " ") {
                HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" class="numeric" onkeydown="return ValidateNumber(this,event);"   onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');" onchange="CalculatePercentages(this);" id="txtxSpots_' + SelProperties[index].rateId + '" row="' + index + '" col="14" data-pid="' + SelProperties[index].propertyId + '" data-rid="' + SelProperties[index].rateId + '"  data-dp="' + SelProperties[index].dp + '"  data-len="' + SelProperties[index].spotLen + '" style="width: 58px;text-align:right;" value="' + SetSpotVal(SelProperties[index].wk14Spots) + '"/></td>';
            }
            HTML += '</tr>';
        }

        //ST-1178 Binding Spend Data All BT Groups Start here

        if ((SelPlaceholder != null && SelPlaceholder.length > 0) || SelProperties.length > 0) {
            HTML += '<tr class="spend" style="font-weight:bold;" id="row-SpendData">';
            HTML += '<td style="text-align:left;">Spend</td>';
            HTML += '<td style="text-align:left;"></td>';
            HTML += '<td style="text-align:left;"></td>';
            HTML += '<td></td>';
            HTML += '<td></td>';
            HTML += '<td></td>';
            HTML += '<td></td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;" id="lblwk01Spend">' + RenderSpendData(SpendData, "wk01Spots") + '</td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;" id="lblwk02Spend">' + RenderSpendData(SpendData, "wk02Spots") + '</td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;" id="lblwk03Spend">' + RenderSpendData(SpendData, "wk03Spots") + '</td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;" id="lblwk04Spend">' + RenderSpendData(SpendData, "wk04Spots") + '</td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;" id="lblwk05Spend">' + RenderSpendData(SpendData, "wk05Spots") + '</td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;" id="lblwk06Spend">' + RenderSpendData(SpendData, "wk06Spots") + '</td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;" id="lblwk07Spend">' + RenderSpendData(SpendData, "wk07Spots") + '</td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;" id="lblwk08Spend">' + RenderSpendData(SpendData, "wk08Spots") + '</td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;" id="lblwk09Spend">' + RenderSpendData(SpendData, "wk09Spots") + '</td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;" id="lblwk10Spend">' + RenderSpendData(SpendData, "wk10Spots") + '</td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;" id="lblwk11Spend">' + RenderSpendData(SpendData, "wk11Spots") + '</td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;" id="lblwk12Spend">' + RenderSpendData(SpendData, "wk12Spots") + '</td>';
            HTML += '<td style="padding-left: 1px; padding-right:1px;" id="lblwk13Spend">' + RenderSpendData(SpendData, "wk13Spots") + '</td>';
            if (wk14 != " ") {
                HTML += '<td style="padding-left: 1px; padding-right:1px;" id="lblwk14Spend">' + RenderSpendData(SpendData, "wk14Spots") + '</td>';
            }
            HTML += '</tr>'; 
        }
        //ST-1178 Binding Spend Data All BT Groups Start here


        if ((SelPlaceholder != null && SelPlaceholder.length > 0) || (SelProperties != null && SelProperties != undefined && SelProperties.length > 0)) {
            if (globalBuyTypeGroup == "DR") {
                HTML += '<tr class="clearance" style="font-weight:bold;" id="row-ExpectedClearance">';
                HTML += '<td style="text-align:left;">Expected Clearance</td>';
                HTML += '<td style="text-align:left;"></td>';
                HTML += '<td style="text-align:left;"></td>';
                HTML += '<td></td>';
                HTML += '<td></td>';
                HTML += '<td></td>';
                HTML += '<td></td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);" onkeyup="ValidateSpots(this, \'clearance\');" onchange="CalculateClearance(this);" row="last" col="01" style="width: 58px;text-align:right;" value="' + SetSpotVal(ExpectedClearanceData.wk01Spots) + '"/></td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);" onkeyup="ValidateSpots(this, \'clearance\');" onchange="CalculateClearance(this);" row="last" col="02" style="width: 58px;text-align:right;" value="' + SetSpotVal(ExpectedClearanceData.wk02Spots) + '"/></td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);" onkeyup="ValidateSpots(this, \'clearance\');" onchange="CalculateClearance(this);" row="last" col="03" style="width: 58px;text-align:right;" value="' + SetSpotVal(ExpectedClearanceData.wk03Spots) + '"/></td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);" onkeyup="ValidateSpots(this, \'clearance\');" onchange="CalculateClearance(this);" row="last" col="04" style="width: 58px;text-align:right;" value="' + SetSpotVal(ExpectedClearanceData.wk04Spots) + '"/></td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);" onkeyup="ValidateSpots(this, \'clearance\');" onchange="CalculateClearance(this);" row="last" col="05" style="width: 58px;text-align:right;" value="' + SetSpotVal(ExpectedClearanceData.wk05Spots) + '"/></td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);" onkeyup="ValidateSpots(this, \'clearance\');" onchange="CalculateClearance(this);" row="last" col="06" style="width: 58px;text-align:right;" value="' + SetSpotVal(ExpectedClearanceData.wk06Spots) + '"/></td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);" onkeyup="ValidateSpots(this, \'clearance\');" onchange="CalculateClearance(this);" row="last" col="07" style="width: 58px;text-align:right;" value="' + SetSpotVal(ExpectedClearanceData.wk07Spots) + '"/></td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);" onkeyup="ValidateSpots(this, \'clearance\');" onchange="CalculateClearance(this);" row="last" col="08" style="width: 58px;text-align:right;" value="' + SetSpotVal(ExpectedClearanceData.wk08Spots) + '"/></td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);" onkeyup="ValidateSpots(this, \'clearance\');" onchange="CalculateClearance(this);" row="last" col="09" style="width: 58px;text-align:right;" value="' + SetSpotVal(ExpectedClearanceData.wk09Spots) + '"/></td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);" onkeyup="ValidateSpots(this, \'clearance\');" onchange="CalculateClearance(this);" row="last" col="10" style="width: 58px;text-align:right;" value="' + SetSpotVal(ExpectedClearanceData.wk10Spots) + '"/></td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);" onkeyup="ValidateSpots(this, \'clearance\');" onchange="CalculateClearance(this);" row="last" col="11" style="width: 58px;text-align:right;" value="' + SetSpotVal(ExpectedClearanceData.wk11Spots) + '"/></td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);" onkeyup="ValidateSpots(this, \'clearance\');" onchange="CalculateClearance(this);" row="last" col="12" style="width: 58px;text-align:right;" value="' + SetSpotVal(ExpectedClearanceData.wk12Spots) + '"/></td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);" onkeyup="ValidateSpots(this, \'clearance\');" onchange="CalculateClearance(this);" row="last" col="13" style="width: 58px;text-align:right;" value="' + SetSpotVal(ExpectedClearanceData.wk13Spots) + '"/></td>';
                if (wk14 != " ") {
                    HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);" onkeyup="ValidateSpots(this, \'clearance\');" onchange="CalculateClearance(this);" row="last" col="14" style="width: 58px;text-align:right;" value="' + SetSpotVal(ExpectedClearanceData.wk14Spots) + '"/></td>'
                }
                HTML += '</tr>';

                //ST-1178
                HTML += '<tr class="clearance" style="font-weight:bold;" id="row-SpendatClearance">';
                HTML += '<td style="text-align:left;">Spend at Clearance</td>';
                HTML += '<td style="text-align:left;"></td>';
                HTML += '<td style="text-align:left;"></td>';
                HTML += '<td></td>';
                HTML += '<td></td>';
                HTML += '<td></td>';
                HTML += '<td></td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;" id="lblwk01SpendAtClearance">' + RenderSpendAtClearance(SpendAtClearanceData, "wk01Spots") + '</td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;" id="lblwk02SpendAtClearance">' + RenderSpendAtClearance(SpendAtClearanceData, "wk02Spots") + '</td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;" id="lblwk03SpendAtClearance">' + RenderSpendAtClearance(SpendAtClearanceData, "wk03Spots") + '</td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;" id="lblwk04SpendAtClearance">' + RenderSpendAtClearance(SpendAtClearanceData, "wk04Spots") + '</td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;" id="lblwk05SpendAtClearance">' + RenderSpendAtClearance(SpendAtClearanceData, "wk05Spots") + '</td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;" id="lblwk06SpendAtClearance">' + RenderSpendAtClearance(SpendAtClearanceData, "wk06Spots") + '</td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;" id="lblwk07SpendAtClearance">' + RenderSpendAtClearance(SpendAtClearanceData, "wk07Spots") + '</td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;" id="lblwk08SpendAtClearance">' + RenderSpendAtClearance(SpendAtClearanceData, "wk08Spots") + '</td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;" id="lblwk09SpendAtClearance">' + RenderSpendAtClearance(SpendAtClearanceData, "wk09Spots") + '</td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;" id="lblwk10SpendAtClearance">' + RenderSpendAtClearance(SpendAtClearanceData, "wk10Spots") + '</td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;" id="lblwk11SpendAtClearance">' + RenderSpendAtClearance(SpendAtClearanceData, "wk11Spots") + '</td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;" id="lblwk12SpendAtClearance">' + RenderSpendAtClearance(SpendAtClearanceData, "wk12Spots") + '</td>';
                HTML += '<td style="padding-left: 1px; padding-right:1px;" id="lblwk13SpendAtClearance">' + RenderSpendAtClearance(SpendAtClearanceData, "wk13Spots") + '</td>';
                if (wk14 != " ") {
                    HTML += '<td style="padding-left: 1px; padding-right:1px;" id="lblwk14SpendAtClearance" >' + RenderSpendAtClearance(SpendAtClearanceData, "wk14Spots") + '</td>';
                }
                HTML += '</tr>';

            }
        }
        $("#tbmpLongPlanNetwork").html(HTML);
        if (SelPlaceholder != null && SelPlaceholder != undefined && SelPlaceholder.length > 0) {
            SetPlaceHolderDropDowns();
        }
        CalculateTotals();
    }
    else {
        $("#tbmpLongPlanNetwork").html("");
    }
    if ($('#ddlMediaPlanProperties input[type=checkbox]:checked').length == 0 && SelPlaceholder.length == 0) {
        $("#btnSaveAddmpLongPlanNetworkModal, #btnSaveClosempLongPlanNetworkModal").prop("disabled", true);
    }
    else {
        $("#btnSaveAddmpLongPlanNetworkModal, #btnSaveClosempLongPlanNetworkModal").prop("disabled", false);
    }
    setTimeout(function () { rateImpEnableDisable(SelPlaceholder); }, 500);
    setTimeout(function () { ValidatePlaceHolderData(2); }, 2000);
}

function rateImpEnableDisable(SelPlaceholder) {
    for (var x = 0; x < SelPlaceholder.length; x++) {
        if (SelPlaceholder[x].buyTypeId == 1 || SelPlaceholder[x].buyTypeId == 3 || SelPlaceholder[x].buyTypeId == 9) {
            SelPlaceholder[x].rateAmt = 0.00;
            SelPlaceholder[x].cpm = 0.00;
            $("#txtRate_" + SelPlaceholder[x].rateId).val("0.00");
            $("#tdCPM_" + SelPlaceholder[x].rateId).html("0.00");
            $("#txtRate_" + SelPlaceholder[x].rateId).attr("disabled", true);
        }
        else {
            $("#txtRate_" + SelPlaceholder[x].rateId).attr("disabled", false);
        }
        if (SelPlaceholder[x].buyTypeId == 1 || SelPlaceholder[x].buyTypeId == 4 || SelPlaceholder[x].buyTypeId == 9) {
            SelPlaceholder[x].impressions = 0.00;
            SelPlaceholder[x].cpm = 0.00;
            $("#txtImps_" + SelPlaceholder[x].rateId).val("0.00");
            $("#tdCPM_" + SelPlaceholder[x].rateId).html("0.00");
            $("#txtImps_" + SelPlaceholder[x].rateId).attr("disabled", true);
        }
        else {
            $("#txtImps_" + SelPlaceholder[x].rateId).attr("disabled", false);
        }
    }
}
function TogglePlaceHolderPropertyData(ctrl, rid) {
    $("#spnPropertyName_" + rid).hide();
    $("#txtPlaceHolder_" + rid).show();
    $("#spnDeletePlaceholder_" + rid).hide();
    $("#txtPlaceHolder_" + rid).focus();
}

function SetPlaceHolderPropertyName(ctrl) {
    if (event.relatedTarget.id == "btnCancelmpLongPlanNetworkModal") {
        return false;
    }
    var rid = $(ctrl).attr("id").split('_')[1];
    var prevPropertyName = SelPlaceholder.filter(o => o.rateId == rid)[0].propertyName;
    if ($(ctrl).val().trim() == "") {
        if (!swal.isVisible()) {
            swal({
                html: "Placeholder name cannot be blank.",
                type: 'warning',
            });
        }
        $(ctrl).focus();
        return false;
    }
    else {
        SelPlaceholder.filter(o => o.rateId == rid)[0].propertyName = $(ctrl).val().trim();
    }
    $("#spnPropertyName_" + rid).html(SelPlaceholder.filter(o => o.rateId == rid)[0].propertyName);
    $("#txtPlaceHolder_" + rid).html(SelPlaceholder.filter(o => o.rateId == rid)[0].propertyName);
    $("#txtPlaceHolder_" + rid).hide();
    $("#spnPropertyName_" + rid).show();
    $("#spnDeletePlaceholder_" + rid).show();
}

function SetSpotVal(dataval) {
    if (dataval != "" && parseInt(dataval) > 0) {
        return dataval;
    }
    else
        return "";
}
function CalculateTotals() {


    DPData = [];
    var TotalSpots = 0;
    var uniqueArc;

    var CurSelectionArray = [];
    if (SelProperties.length > 0) {
        CurSelectionArray = jQuery.extend(true, [], SelProperties);
    }
    if (SelPlaceholder.length > 0) {
        for (var x = 0; x < SelPlaceholder.length; x++) {
            CurSelectionArray.push(jQuery.extend(true, {}, SelPlaceholder[x]));
        }

    }
    console.log(CurSelectionArray);

    // ST-1178 Code for Calculate Spend Start here
    if (SpendData != null && SpendData != undefined) {
        SpendData.wk01Spots = 0;
        SpendData.wk02Spots = 0;
        SpendData.wk03Spots = 0;
        SpendData.wk04Spots = 0;
        SpendData.wk05Spots = 0;
        SpendData.wk06Spots = 0;
        SpendData.wk07Spots = 0;
        SpendData.wk08Spots = 0;
        SpendData.wk09Spots = 0;
        SpendData.wk10Spots = 0;
        SpendData.wk11Spots = 0;
        SpendData.wk12Spots = 0;
        SpendData.wk13Spots = 0;
        SpendData.wk14Spots = 0;
    }
    // ST-1178 Code for Calculate Spend End here

    uniqueArc = CurSelectionArray.filter(function (itm, i, a) {
        var objDP = { "dayPartId": itm.dayPartId, "dayPart": itm.dayPartDesc, "totalSpots": 0, "percVal": 0 }
        var indexArc = DPData.findIndex(x => x.dayPartId === itm.dayPartId);
        if (indexArc < 0) {
            DPData.push(objDP);
        }
    });
    DPData.sort(function (a, b) {
        return a.dayPart.localeCompare(b.dayPart);
    });

    TotalWeeklySpotsData = jQuery.extend(true, [], CurSelectionArray[0]);
    if (Perc15SecData != null && Perc15SecData != undefined) {
        Total15WeeklySpotsData = jQuery.extend(true, [], CurSelectionArray.filter(o => o.spotLen == 15)[0]);
        Total15WeeklySpotsData.wk01Spots = 0;
        Total15WeeklySpotsData.wk02Spots = 0;
        Total15WeeklySpotsData.wk03Spots = 0;
        Total15WeeklySpotsData.wk04Spots = 0;
        Total15WeeklySpotsData.wk05Spots = 0;
        Total15WeeklySpotsData.wk06Spots = 0;
        Total15WeeklySpotsData.wk07Spots = 0;
        Total15WeeklySpotsData.wk08Spots = 0;
        Total15WeeklySpotsData.wk09Spots = 0;
        Total15WeeklySpotsData.wk10Spots = 0;
        Total15WeeklySpotsData.wk11Spots = 0;
        Total15WeeklySpotsData.wk12Spots = 0;
        Total15WeeklySpotsData.wk13Spots = 0;
        Total15WeeklySpotsData.wk14Spots = 0;
    }

    TotalWeeklySpotsData.wk01Spots = 0;
    TotalWeeklySpotsData.wk02Spots = 0;
    TotalWeeklySpotsData.wk03Spots = 0;
    TotalWeeklySpotsData.wk04Spots = 0;
    TotalWeeklySpotsData.wk05Spots = 0;
    TotalWeeklySpotsData.wk06Spots = 0;
    TotalWeeklySpotsData.wk07Spots = 0;
    TotalWeeklySpotsData.wk08Spots = 0;
    TotalWeeklySpotsData.wk09Spots = 0;
    TotalWeeklySpotsData.wk10Spots = 0;
    TotalWeeklySpotsData.wk11Spots = 0;
    TotalWeeklySpotsData.wk12Spots = 0;
    TotalWeeklySpotsData.wk13Spots = 0;
    TotalWeeklySpotsData.wk14Spots = 0;



    for (var x = 0; x < CurSelectionArray.length; x++) {
        for (var y = 1; y <= 14; y++) {
            var WkNum = y > 9 ? y : "0" + y;
            var curRateAmt = parseFloat(CurSelectionArray[x].rateAmt);

            var CurSpot = CurSelectionArray[x]["wk" + WkNum + "Spots"];
            if (CurSpot != null && CurSpot != undefined && CurSpot != '' && parseInt(CurSpot) > 0) {


                TotalSpots = parseInt(TotalSpots) + parseInt(CurSpot);
                TotalWeeklySpotsData["wk" + WkNum + "Spots"] = parseInt(TotalWeeklySpotsData["wk" + WkNum + "Spots"]) + parseInt(CurSpot);

                //ST-1178 Code For Calculating Spend Start Here
                SpendData["wk" + WkNum + "Spots"] = parseFloat(SpendData["wk" + WkNum + "Spots"]) + (parseFloat(curRateAmt) * parseFloat(CurSpot));
                if (parseFloat(SpendData["wk" + WkNum + "Spots"]) > 0)
                    $("#lblwk" + WkNum + "Spend").text($.fn.dataTable.render.number(',', '.', 2, '$').display(SpendData["wk" + WkNum + "Spots"]));
                else {
                    if (TotalWeeklySpotsData["wk" + WkNum + "Spots"] != null && TotalWeeklySpotsData["wk" + WkNum + "Spots"] != undefined && parseInt(TotalWeeklySpotsData["wk" + WkNum + "Spots"]) > 0)
                        $("#lblwk" + WkNum + "Spend").text("$0.00");
                    else
                        $("#lblwk" + WkNum + "Spend").text("");
                }


                //ST-1178 Code For Calculating Spend End Here

                if (CurSelectionArray[x].spotLen == 15) {
                    Total15WeeklySpotsData["wk" + WkNum + "Spots"] = parseInt(Total15WeeklySpotsData["wk" + WkNum + "Spots"]) + parseInt(CurSpot);
                }
                for (var m = 0; m < DPData.length; m++) {
                    if (CurSelectionArray[x].dayPartDesc == DPData[m].dayPart) {
                        DPData[m].totalSpots = parseInt(DPData[m].totalSpots) + parseInt(CurSpot);
                    }
                }
            }
            else {
                SpendData["wk" + WkNum + "Spots"] = parseFloat(SpendData["wk" + WkNum + "Spots"]) + 0;//ST-1178
                if (parseFloat(SpendData["wk" + WkNum + "Spots"]) > 0)
                    $("#lblwk" + WkNum + "Spend").text($.fn.dataTable.render.number(',', '.', 2, '$').display(SpendData["wk" + WkNum + "Spots"]));
                else {
                    if (TotalWeeklySpotsData["wk" + WkNum + "Spots"] != null && TotalWeeklySpotsData["wk" + WkNum + "Spots"]!=undefined && parseInt(TotalWeeklySpotsData["wk" + WkNum + "Spots"]) > 0)
                        $("#lblwk" + WkNum + "Spend").text("$0.00");
                    else
                        $("#lblwk" + WkNum + "Spend").text("");
                }
            }
            if (ExpectedClearanceData != null && ExpectedClearanceData != undefined) {
                if (ExpectedClearanceData["wk" + WkNum + "Spots"] != '' && parseFloat(ExpectedClearanceData["wk" + WkNum + "Spots"]) > 0) {
                    SpendAtClearanceData["wk" + WkNum + "Spots"] = parseFloat(parseFloat(SpendData["wk" + WkNum + "Spots"]) * parseFloat(ExpectedClearanceData["wk" + WkNum + "Spots"]) / 100.00).toFixed(2);
                    if (parseFloat(SpendAtClearanceData["wk" + WkNum + "Spots"]) > 0)
                        $("#lblwk" + WkNum + "SpendAtClearance").text($.fn.dataTable.render.number(',', '.', 2, '$').display(SpendAtClearanceData["wk" + WkNum + "Spots"]));
                    else
                        if (TotalWeeklySpotsData["wk" + WkNum + "Spots"] != null && TotalWeeklySpotsData["wk" + WkNum + "Spots"] != undefined && parseInt(TotalWeeklySpotsData["wk" + WkNum + "Spots"]) > 0)
                            $("#lblwk" + WkNum + "SpendAtClearance").text("$0.00");
                        else
                            $("#lblwk" + WkNum + "SpendAtClearance").text("");

                }
                else {
                    SpendAtClearanceData["wk" + WkNum + "Spots"] = 0;
                    $("#lblwk" + WkNum + "SpendAtClearance").text("");
                }
            }
        }
    }
    if (Perc15SecData != null && Perc15SecData != undefined) {
        for (var j = 1; j <= 14; j++) {
            var CalcWkNum = j > 9 ? j : "0" + j;
            if (parseInt(Total15WeeklySpotsData["wk" + CalcWkNum + "Spots"]) > 0)
                Perc15SecData["wk" + CalcWkNum + "Spots"] = (parseFloat(Total15WeeklySpotsData["wk" + CalcWkNum + "Spots"]).toFixed(2) / parseFloat(TotalWeeklySpotsData["wk" + CalcWkNum + "Spots"]).toFixed(2)) * 100;
            else
                Perc15SecData["wk" + CalcWkNum + "Spots"] = 0;

            $("#td15swk" + CalcWkNum + "Spots").html(Perc15SecData["wk" + CalcWkNum + "Spots"] > 0 ? FormatNumber(Perc15SecData["wk" + CalcWkNum + "Spots"], "decimalpercentagezero", 0) : ""); /* ST-1109 Changed by Shariq*/
        }
    }
    for (var k = 0; k < DPData.length; k++) {
        if (DPData[k].totalSpots > 0) {
            DPData[k].percVal = FormatNumber((parseFloat((parseFloat(DPData[k].totalSpots) / parseFloat(TotalSpots))).toFixed(2) * 100), "decimalpercentagezero", 0); /* ST-1109 Changed by Shariq*/
        }
    }
    BindDayPartLongPlan(DPData.filter(o => o.totalSpots > 0));

}
function BindDayPartLongPlan(lstDayPart) {
    var HTMLDayPart = '';
    if ((SelProperties.length > 0 || SelPlaceholder.length > 0) && lstDayPart != null && lstDayPart != undefined && lstDayPart.length > 0) {
        if (lstDayPart.length > 4) {
            for (var z = 0; z < 4; z++) {
                HTMLDayPart += '<tr>';
                if (lstDayPart[z + 4] != null && lstDayPart[z + 4] != undefined) {
                    HTMLDayPart += '<td id="tdDay" style="width:50%!important;">';
                    HTMLDayPart += '<label for="" style="font-size: 16px;font-weight: bold;float:right;margin-left: 5px!important;margin-bottom:-5px;">' + lstDayPart[z + 4].dayPart + ': <span style="font-weight:400">' + FormatNumber(lstDayPart[z + 4].percVal, 'decimalpercentagezero', 0) + '</span></label>';
                    HTMLDayPart += '</td>';
                    HTMLDayPart += '<td id="tdDay" style="width:50%!important;">';
                    HTMLDayPart += '<label for="" style="font-size: 16px;font-weight: bold;float:right;margin-left: 5px!important;margin-bottom:-5px;">' + lstDayPart[z].dayPart + ': <span style="font-weight:400">' + FormatNumber(lstDayPart[z].percVal, 'decimalpercentagezero', 0) + '</span></label>';
                    HTMLDayPart += '</td>';
                }
                else {
                    HTMLDayPart += '<td id="tdDay" style="width:50%!important;">';
                    HTMLDayPart += '<label for="" style="font-size: 16px;font-weight: bold;float:right;margin-left: 5px!important;margin-bottom:-5px;"></span></label>';
                    HTMLDayPart += '</td>';
                    HTMLDayPart += '<td id="tdDay" style="width:50%!important;">';
                    HTMLDayPart += '<label for="" style="font-size: 16px;font-weight: bold;float:right;margin-left: 5px!important;margin-bottom:-5px;">' + lstDayPart[z].dayPart + ': <span style="font-weight:400">' + FormatNumber(lstDayPart[z].percVal, 'decimalpercentagezero', 0) + '</span></label>';
                    HTMLDayPart += '</td>';
                }
                HTMLDayPart += '</tr>';
            }
        } else {
            for (var z = 0; z < lstDayPart.length; z++) {
                HTMLDayPart += '<tr>';

                HTMLDayPart += '<td id="tdDay" style="width:50%!important;">';
                HTMLDayPart += '<label for="" style="font-size: 16px;font-weight: bold;float:right;margin-left: 5px!important;margin-bottom:-5px;">' + lstDayPart[z].dayPart + ': <span style="font-weight:400">' + FormatNumber(lstDayPart[z].percVal, 'decimalpercentagezero', 0) + '</span></label>';
                HTMLDayPart += '</td>';
                HTMLDayPart += '</tr>';
            }
        }
    }
    $("#tbDayPartLongPlan").html(HTMLDayPart);
}
var totalSpotsPerWeek = [];
var total15sSpotsPerWeek = [];
var totaltotalDpSpotsPerWeek = [];

function CalculatePercentages(ctrl) {
    var PropertyId = $(ctrl).attr("data-pid");
    var rateId = $(ctrl).attr("data-rid");
    var WeekNo = $(ctrl).attr("col");
    if (parseInt($(ctrl).val()) < 1 || parseInt($(ctrl).val()) > 5000) {
        $(ctrl).val("");
    }
    if (SelProperties.filter(o => o.rateId == rateId).length > 0) {
        SelProperties.filter(o => o.rateId == rateId)[0]["wk" + WeekNo + "Spots"] = $(ctrl).val();
        globalProperties.filter(o => o.rateId == rateId)[0]["wk" + WeekNo + "Spots"] = $(ctrl).val();
    }
    else {
        SelPlaceholder.filter(o => o.rateId == rateId)[0]["wk" + WeekNo + "Spots"] = $(ctrl).val();
    }
    CalculateTotals();

}

function CalculateClearance(ctrl) {
    var WeekNo = $(ctrl).attr("col");
    var CalcSpendAtClearance = 0;
    if (parseInt($(ctrl).val()) < 1 || parseInt($(ctrl).val()) > 100) {
        $(ctrl).val("");
    }
    ExpectedClearanceData["wk" + WeekNo + "Spots"] = $(ctrl).val();
    if (parseFloat(SpendData["wk" + WeekNo + "Spots"]) <= 0 || $(ctrl).val() == '') {

        CalcSpendAtClearance = 0;
    }
    else {
        CalcSpendAtClearance = parseFloat(parseFloat(SpendData["wk" + WeekNo + "Spots"]) * parseFloat($(ctrl).val()) / 100.00).toFixed(2);
    }
    SpendAtClearanceData["wk" + WeekNo + "Spots"] = CalcSpendAtClearance;
    if ((CalcSpendAtClearance > 0 || parseInt(ExpectedClearanceData["wk" + WeekNo + "Spots"]) > 0) && $("#lblwk" + WeekNo + "Spend").text() != "")
        $("#lblwk" + WeekNo + "SpendAtClearance").text($.fn.dataTable.render.number(',', '.', 2, '$').display(CalcSpendAtClearance));
    else
        $("#lblwk" + WeekNo + "SpendAtClearance").text("");
}

function RemoveProperty(ctrl, index) {

    var hasSpotData = false;
    var rid = $(ctrl).closest("tr").attr("data-rid");
    var WeekNo = $(ctrl).attr("col");
    var checked = $("#chkRate_" + rid).prop("checked");
    $("#tr_" + rid + " input[type=text]").each(function () {
        var text_value = $(this).val();
        if (text_value != "") {
            hasSpotData = true;
        }
    });  
    if (hasSpotData) {
        var propertyToRemove = SelProperties.filter(o => o.rateId == rid)[0].propertyName;
        //if (!swal.isVisible()) {
            swal({
                title: "",
                html: '<strong style="float:left"> Remove Property? </strong> <br> <br> <span style="float:left"> There are spots allocated to <strong>' + propertyToRemove + '.' + '</strong> </span>  <br> <br> <span style="float:left"> Are you sure you want to remove this property? </span> <br>',
                type: 'warning',
                showCancelButton: true,
                width: 500,
                height: 302,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'No',
                confirmButtonText: 'Yes',
                showLoaderOnConfirm: true,
                allowOutsideClick: false,
                allowEscapeKey: false,
                reverseButtons: true,
                preConfirm: function () {
                    return new Promise(function (resolve) {
                        setTimeout(function () {
                            resolve();
                        }, 50);
                    });
                }
            }).then(
                function (result) {
                    if (checked) {
                        globalProperties.filter(o => o.rateId == rid)[0].wk01Spots = 0;
                        globalProperties.filter(o => o.rateId == rid)[0].wk02Spots = 0;
                        globalProperties.filter(o => o.rateId == rid)[0].wk03Spots = 0;
                        globalProperties.filter(o => o.rateId == rid)[0].wk04Spots = 0;
                        globalProperties.filter(o => o.rateId == rid)[0].wk05Spots = 0;
                        globalProperties.filter(o => o.rateId == rid)[0].wk06Spots = 0;
                        globalProperties.filter(o => o.rateId == rid)[0].wk07Spots = 0;
                        globalProperties.filter(o => o.rateId == rid)[0].wk08Spots = 0;
                        globalProperties.filter(o => o.rateId == rid)[0].wk09Spots = 0;
                        globalProperties.filter(o => o.rateId == rid)[0].wk10Spots = 0;
                        globalProperties.filter(o => o.rateId == rid)[0].wk11Spots = 0;
                        globalProperties.filter(o => o.rateId == rid)[0].wk12Spots = 0;
                        globalProperties.filter(o => o.rateId == rid)[0].wk13Spots = 0;
                        globalProperties.filter(o => o.rateId == rid)[0].wk14Spots = 0;
                        $("#chkRate_" + rid).prop("checked", false);
                        SelProperties.splice(SelProperties.indexOf(SelProperties.filter(o => o.rateId == rid)[0]), 1);
                        var HTML = $('#ddlMediaPlanProperties input[type=checkbox]:checked').parent('label').text();
                        HTML = HTML.split("|");
                        HTML = HTML[0] + "&nbsp &nbsp &nbsp &nbsp|&nbsp &nbsp &nbsp &nbsp" + HTML[1] + "&nbsp &nbsp &nbsp|&nbsp &nbsp &nbsp" + HTML[2] + "&nbsp &nbsp &nbsp|&nbsp &nbsp &nbsp" + HTML[3] + "&nbsp &nbsp &nbsp|&nbsp &nbsp &nbsp" + HTML[4] + "&nbsp &nbsp &nbsp|&nbsp &nbsp &nbsp" + HTML[5] + "&nbsp &nbsp &nbsp|&nbsp &nbsp &nbsp" + HTML[6] + "&nbsp &nbsp &nbsp|&nbsp &nbsp &nbsp" + HTML[7];
                        if ($('#ddlMediaPlanProperties input[type=checkbox]:checked').length == 1) {
                            $("#propddlLabel").html(HTML);                           
                            $("#btnSaveAddmpLongPlanNetworkModal, #btnSaveClosempLongPlanNetworkModal").prop("disabled", false);                           
                        }
                        else {
                            if ($('#ddlMediaPlanProperties input[type=checkbox]:checked').length == 0) {
                                $("#propddlLabel").text('Select');
                            }
                            else {
                                $("#propddlLabel").text($('#ddlMediaPlanProperties input[type=checkbox]:checked').length + ' Selected');
                            }                            
                        }
                        $("#tbmpLongPlanNetwork").html("");
                        ResetMediaPlanPropData();
                    }
                }, function (dismiss) {
                    return false;
                }
            );
       // }

    }
    else {
        if (checked) {
            globalProperties.filter(o => o.rateId == rid)[0].wk01Spots = 0;
            globalProperties.filter(o => o.rateId == rid)[0].wk02Spots = 0;
            globalProperties.filter(o => o.rateId == rid)[0].wk03Spots = 0;
            globalProperties.filter(o => o.rateId == rid)[0].wk04Spots = 0;
            globalProperties.filter(o => o.rateId == rid)[0].wk05Spots = 0;
            globalProperties.filter(o => o.rateId == rid)[0].wk06Spots = 0;
            globalProperties.filter(o => o.rateId == rid)[0].wk07Spots = 0;
            globalProperties.filter(o => o.rateId == rid)[0].wk08Spots = 0;
            globalProperties.filter(o => o.rateId == rid)[0].wk09Spots = 0;
            globalProperties.filter(o => o.rateId == rid)[0].wk10Spots = 0;
            globalProperties.filter(o => o.rateId == rid)[0].wk11Spots = 0;
            globalProperties.filter(o => o.rateId == rid)[0].wk12Spots = 0;
            globalProperties.filter(o => o.rateId == rid)[0].wk13Spots = 0;
            globalProperties.filter(o => o.rateId == rid)[0].wk14Spots = 0;
            $("#chkRate_" + rid).prop("checked", false);
            SelProperties.splice(SelProperties.indexOf(SelProperties.filter(o => o.rateId == rid)[0]), 1);
            var HTML = $("#chkRate_" + rid).parent('label').text();
            HTML = HTML.split("|");
            HTML = HTML[0] + "&nbsp &nbsp &nbsp &nbsp|&nbsp &nbsp &nbsp &nbsp" + HTML[1] + "&nbsp &nbsp &nbsp|&nbsp &nbsp &nbsp" + HTML[2] + "&nbsp &nbsp &nbsp|&nbsp &nbsp &nbsp" + HTML[3] + "&nbsp &nbsp &nbsp|&nbsp &nbsp &nbsp" + HTML[4] + "&nbsp &nbsp &nbsp|&nbsp &nbsp &nbsp" + HTML[5] + "&nbsp &nbsp &nbsp|&nbsp &nbsp &nbsp" + HTML[6] + "&nbsp &nbsp &nbsp|&nbsp &nbsp &nbsp" + HTML[7];
            if ($('#ddlMediaPlanProperties input[type=checkbox]:checked').length == 1) {
                $("#propddlLabel").html(HTML);
                $("#btnSaveAddmpLongPlanNetworkModal, #btnSaveClosempLongPlanNetworkModal").prop("disabled", false);
            }
            else {
                if ($('#ddlMediaPlanProperties input[type=checkbox]:checked').length == 0) {
                    $("#propddlLabel").text('Select');
                }
                else {
                    $("#propddlLabel").text($('#ddlMediaPlanProperties input[type=checkbox]:checked').length + ' Selected');
                } 
            }
            
            $("#tbmpLongPlanNetwork").html("");
            ResetMediaPlanPropData();
        }
    }
    if ($('#ddlMediaPlanProperties input[type=checkbox]:checked').length == 0 && SelPlaceholder.length == 0) {
        $("#btnSaveAddmpLongPlanNetworkModal, #btnSaveClosempLongPlanNetworkModal").prop("disabled", true);
    }
    else {
        $("#btnSaveAddmpLongPlanNetworkModal, #btnSaveClosempLongPlanNetworkModal").prop("disabled", false);
    }
}
function ResetPropertyData(resetVal, doFilter) {
    if (doFilter) {
        if ($('#ddlMediaPlanProperties input[type=checkbox]:checked').length == 0 && SelPlaceholder.length == 0) {
            BindFormDataBasedUponReset(resetVal);
        }
        else {
            swal({
                title: "",
                html: 'You have unsaved changes. If you proceed without saving, your work may be lost. <br> <br> <strong style="float:left;margin-left:11px;"> Do you wish to continue? </strong>',
                type: 'warning',
                showCancelButton: true,
                width: 458,
                height: 302,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'No',
                confirmButtonText: 'Yes',
                showLoaderOnConfirm: true,
                allowOutsideClick: false,
                allowEscapeKey: false,
                reverseButtons: true,
                preConfirm: function () {
                    return new Promise(function (resolve) {
                        setTimeout(function () {
                            resolve();
                        }, 50);
                    });
                }
            }).then(
                function (result) {
                    SelProperties = [];
                    SelPlaceholder = [];
                    $("#tbmpLongPlanNetwork").html("");
                    $("#tbDayPartLongPlan").html("");

                    BindFormDataBasedUponReset(resetVal);
                }, function (dismiss) {
                    UndoReset(resetVal);
                }
            );
        }
    }
}
function UndoReset(resetVal) {
    if (resetVal == 'quarter') {
        $("#ddlMediaPlanLongPlanQuarter").val(curQuarter.quarterId);
    }
    else if (resetVal == 'year') {
        $("#ddlMediaPlanLongPlanYears").val(curYear);
    }
    else if (resetVal == 'demo') {
        $("#ddlMediaPlanLongPlanDemos").val(curDemo);
    }
    return false;
}
function BindFormDataBasedUponReset(resetVal) {

    $("#row-15percent").hide();
    $("#row-ExpectedClearance").hide();
    $("#txtAdjustRates").val("");
    $("#txtAdjustImps").val("");
    $("#icoImps").hide();
    $("#icoRates").hide();
    rateTextColor = "#575757";
    impsTextColor = "#575757";
    curAdjustedImps = 0.00;
    curAdjustedRates = 0.00;

    if (resetVal == 'quarter') {
        defaultQuarterId = $("#ddlMediaPlanLongPlanQuarter").val();
        curQuarter = globalQuarters.filter(o => o.quarterId == defaultQuarterId)[0];
        defaultQuarter = curQuarter.quarterName;

        MediaPlanGetPropertiesData();
        setTimeout(function () {
            checkUncheckMultiSelectDropdown("mpLongPlan");
        }, 1000);
    }
    else if (resetVal == 'year') {
        MediaPlanGetQuartersAndWeeks(parseInt($("#ddlMediaPlanLongPlanYears").val()));
        curYear = $("#ddlMediaPlanLongPlanYears").val();
        MediaPlanGetSelectedDemos();
        setTimeout(function () {
            MediaPlanGetPropertiesData();
        }, 1000);
        setTimeout(function () {
            checkUncheckMultiSelectDropdown("mpLongPlan");
        }, 2000);
    }
    else if (resetVal == 'demo') {
        curDemo = $("#ddlMediaPlanLongPlanDemos").val();
        MediaPlanGetPropertiesData();
        setTimeout(function () {
            checkUncheckMultiSelectDropdown("mpLongPlan");
        }, 2000);
    }
}


$(document).on("click", function (e) {
    if (e.target.id == "btnSaveClosempLongPlanNetworkModal" || e.target.className == "fa fa-angle-down") {
        $(".mpLongPlanNetwork-DropdownContent").toggle();
    }
    else {
        $(".mpLongPlanNetwork-DropdownContent").hide();
    }
});

$('#mpLongPlanNetworkModal').on('hide.bs.modal', function (e) {
    $("#tbmpLongPlanNetworkEdit").html("");
    var hasSpotData = false;
    $(".clsProperties input[type=text], .clearance input[type=text], .placeholder input[type=text]").each(function () {
        if ($(this).attr("id") != null && $(this).attr("id") != undefined && $(this).attr("id").toLowerCase().indexOf("txtrate_") < 0 && $(this).attr("id").toLowerCase().indexOf("txtimps_") < 0) {
            var text_value = $(this).val();
            if (text_value != "") {
                hasSpotData = true;
            }
        }
    });

    if (!hasSpotData && $('#ddlMediaPlanProperties input[type=checkbox]:checked').length == 0) {
        $('#mpLongPlanNetworkModal').modal('hide');
    }
    else {
        $('#mpLongPlanNetworkModal').modal('show');
        e.stopPropagation();
        swal({
            title: "",
            html: 'You have unsaved changes. Are you sure you want to close the window?',
            type: 'warning',
            showCancelButton: true,
            width: 458,
            height: 302,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'No',
            confirmButtonText: 'Yes',
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            reverseButtons: true,
            preConfirm: function () {
                return new Promise(function (resolve) {
                    setTimeout(function () {
                        resolve();
                    }, 50);
                });
            }
        }).then(
            function (result) {
                $('#mpLongPlanNetworkModal').modal('hide');
                location.reload();
            }, function (dismiss) {
                $('#mpLongPlanNetworkModal').modal('show');
            }
        );
    }
})
function SaveMediaPlanProperties(action) {
    var mediaPlanId = $("#hdnMediaPlanId").val();
    $.ajax({
        url: "/MediaPlan/MediaPlanCheckLock/",
        data: {
            MediaPlanId: mediaPlanId,
            Action: "savempproperties"
        },
        cache: false,
        type: "POST",
        success: function (response) {
            if (response.responseCode != 200) {
                swal({
                    html: response.responseText,
                    type: 'error',
                });
                setTimeout(function () {
                    window.location.href = "/ManageMedia/Planning";
                }, 3000);
            }
            else {
                if (globalBuyTypeGroup == "DR") {
                    isClearanceSpotsFilled = ValidateClearance();
                    if (!isClearanceSpotsFilled) {
                        swal({
                            html: "Clearance spot is required field if week has any spot data.",
                            type: 'warning',
                        });
                        return false;
                    }
                }
                isValidPlaceHolderEntries = ValidatePlaceHolderData(1);
                if (!isValidPlaceHolderEntries) {
                    swal({
                        html: "Placeholder data must contain the Day Part, Buy Type, SpotLength, Rates and Impressions for each record.",
                        type: 'warning',
                    });
                    return false;
                }
                ShowOverlayMediaSummary();
                if (SelProperties.length > 0)
                    SelPropertiesAndPlaceHolder = jQuery.extend(true, [], SelProperties);
                if (SelPlaceholder.length > 0) {
                    for (var x = 0; x < SelPlaceholder.length; x++) {
                        var curPalaceholder = jQuery.extend(true, {}, SelPlaceholder[x]);
                        SelPropertiesAndPlaceHolder.push(curPalaceholder);
                    }
                }
                setTimeout(function () {
                    PostDataForSaveProperties(0, action);
                }, 100);
            }
        },
        error: function (response) {
            var err = response.result;
        }
    });    
}
function ValidatePlaceHolderData(CheckType) {
    isValidPlaceHolderEntries = true;
    if (SelPlaceholder != null && SelPlaceholder.length > 0) {
        for (var x = 0; x < SelPlaceholder.length; x++) {
            if (SelPlaceholder[x].propertyName.trim() == "") {
                isValidPlaceHolderEntries = false;
                ClearanceValidationMessage = "Placeholder property name cannot be blank";
                break;
            }
            else if (SelPlaceholder[x].dayPartId == 0 || SelPlaceholder[x].buyTypeId == 0 || SelPlaceholder[x].spotLen == 0) {
                isValidPlaceHolderEntries = false;
                ClearanceValidationMessage = "Placeholder property must contain the day part, buytype, spot length, rate and Impressions for each record";
                break;
            }
            else {
                if ((SelPlaceholder[x].buyTypeId == 1 || SelPlaceholder[x].buyTypeId == 9) && (SelPlaceholder[x].rateAmt > 0 || SelPlaceholder[x].impressions > 0)) {
                    isValidPlaceHolderEntries = false;
                    ClearanceValidationMessage = "Placeholder property with buytype ADU & Mirror cannot have values other than zero in rates and impressions";
                    break;
                }
                else if ((SelPlaceholder[x].buyTypeId == 3) && (SelPlaceholder[x].rateAmt > 0)) {
                    isValidPlaceHolderEntries = false;
                    ClearanceValidationMessage = "Placeholder property with buytype Bonus cannot have values other than zero in rates";
                    break;
                }
                else {
                    if ($("#txtRate_" + SelPlaceholder[x].rateId).val() == "" || $("#txtImps_" + SelPlaceholder[x].rateId).val() == "") {
                        isValidPlaceHolderEntries = false;
                        ClearanceValidationMessage = "Placeholder property must contain the day part, buytype, spot length, rate and Impressions for each record";
                        break;
                    }
                }
            }
        }
    }
    return isValidPlaceHolderEntries;
}

function PostDataForSaveProperties(index, action) {
    var url = "/MediaPlan/SaveMediaPlanProperties/";
    $.ajax({
        url: url,
        data: {
            "MediaPlanid": $("#hdnMediaPlanId").val(),
            "MediaPlanName": $("#hdnMediaPlanName").val(),
            "ClientId": $("#hdnClientId").val(),
            "lstProps": SelPropertiesAndPlaceHolder[index]
        },
        cache: false,
        type: "POST",
        success: function (result) {
            if (index < SelPropertiesAndPlaceHolder.length - 1) {
                index = parseInt(index) + 1;
                PostDataForSaveProperties(index, action);
            }
            else {
                if (globalBuyTypeGroup == "DR") {
                    SaveMediaPlanPropertiesDRClearance(action);
                    SelPropertiesAndPlaceHolder = [];
                }
                else {
                    if (action == "save and add") {
                        MediaPlanGetPropertiesData();
                        ResetMediaPlanPropData();
                        HideOverlayMediaSummary();
                        defaultQuarterId = $("#hdnQuarterId").val();
                        defaultQuarter = $("#hdnQuarterName").val();
                        $("#ddlMediaPlanLongPlanYears").val(FirstYear);
                        $("#ddlMediaPlanLongPlanQuarter").val($("#hdnQuarterId").val());
                        OpenLongPlan(globalNetworkId, globalNetworkName, true);
                        setTimeout(function () { BindBTGroupSummaryView(true); }, 500);
                        SelPropertiesAndPlaceHolder = [];
                    }
                    else {
                        window.location.reload();
                    }
                }
            }
        },
        error: function (response) {
            HideOverlayMediaSummary();
            swal("error : " + response.responseText);
        }
    });
}
function SaveMediaPlanPropertiesDRClearance(action) {

    var url = "/MediaPlan/SaveMediaPlanDRClearance/";
    $.ajax({
        url: url,
        data: {
            "MediaPlanid": $("#hdnMediaPlanId").val(),
            "MediaPlanName": $("#hdnMediaPlanName").val(),
            "ClientId": $("#hdnClientId").val(),
            "drClearance": ExpectedClearanceData
        },
        cache: false,
        type: "POST",
        success: function (result) {
            if (result.success == false) {
                swal({
                    html: result.responseText,
                    type: 'success',
                })
            }
            if (action == "save and add") {
                MediaPlanGetPropertiesData();
                ResetMediaPlanPropData();
                HideOverlayMediaSummary();
                defaultQuarterId = $("#hdnQuarterId").val();
                defaultQuarter = $("#hdnQuarterName").val();
                $("#ddlMediaPlanLongPlanYears").val(FirstYear);
                $("#ddlMediaPlanLongPlanQuarter").val($("#hdnQuarterId").val());
                OpenLongPlan(globalNetworkId, globalNetworkName, true);
                ExpectedClearanceData.wk01Spots = 0;
                ExpectedClearanceData.wk02Spots = 0;
                ExpectedClearanceData.wk03Spots = 0;
                ExpectedClearanceData.wk04Spots = 0;
                ExpectedClearanceData.wk05Spots = 0;
                ExpectedClearanceData.wk06Spots = 0;
                ExpectedClearanceData.wk07Spots = 0;
                ExpectedClearanceData.wk08Spots = 0;
                ExpectedClearanceData.wk09Spots = 0;
                ExpectedClearanceData.wk10Spots = 0;
                ExpectedClearanceData.wk11Spots = 0;
                ExpectedClearanceData.wk12Spots = 0;
                ExpectedClearanceData.wk13Spots = 0;
                ExpectedClearanceData.wk14Spots = 0;
                setTimeout(function () { BindBTGroupSummaryView(true); }, 500);
            }
            else {
                window.location.reload();
            }
        },
        error: function (response) {
            HideOverlayMediaSummary();
            swal("error : " + response.responseText);
        }
    });
}
function ValidateCancel(ctrl) {
    $("#tbmpLongPlanNetworkEdit").html("");
    var hasSpotData = false;
    $(".clsProperties input[type=text], .clearance input[type=text],.placeholder input[type=text]").each(function () {
        if ($(this).attr("id") != null && $(this).attr("id") != undefined && $(this).attr("id").toLowerCase().indexOf("txtrate_") < 0 && $(this).attr("id").toLowerCase().indexOf("txtimps_") < 0) {
            var text_value = $(this).val();
            if (text_value != "") {
                hasSpotData = true;
            }
        }
    });
    if (!hasSpotData && $('#ddlMediaPlanProperties input[type=checkbox]:checked').length == 0) {
        $('#mpLongPlanNetworkModal').modal('hide');
    }
    else {
        if (!swal.isVisible()) {
            swal({
                title: "",
                html: '<span style="float:left"> You have unsaved changes. </span> <br> <strong style="float:left; margin-top:20px;" >Are you sure you want to close the window?</strong> <br>',
                type: 'warning',
                showCancelButton: true,
                width: 500,
                height: 302,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'No',
                confirmButtonText: 'Yes',
                showLoaderOnConfirm: true,
                allowOutsideClick: false,
                allowEscapeKey: false,
                reverseButtons: true,
                preConfirm: function () {
                    return new Promise(function (resolve) {
                        setTimeout(function () {
                            resolve();
                        }, 50);
                    });
                }
            }).then(
                function (result) {
                    if (result) {
                        window.location.reload();
                    }
                }, function (dismiss) {

                }
            );
        }
    }
}
function ValidateAdjustmentFormat(event) {
    if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110, 190, 189, 107, 109, 37, 39]) !== -1 ||
        // Allow: Ctrl+A, Command+A
        (event.keyCode == 65 && (event.ctrlKey === true || event.metaKey === true)) ||
        // Allow: Ctrl+C, Command+C
        (event.keyCode == 67 && (event.ctrlKey === true || event.metaKey === true)) ||
        // Allow: Ctrl+V, Command+V
        (event.keyCode == 86 && (event.ctrlKey === true || event.metaKey === true)) ||
        // Allow: Ctrl+X, Command+X
        (event.keyCode == 88 && (event.ctrlKey === true || event.metaKey === true)) ||
        // Allow: home, end, left, right
        (event.keyCode >= 35 && event.keyCode <= 39)) {
        // let it happen, don't do anything
        return;
    }
    // Ensure that it is a number or minus or plus or period
    if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) &&
        (event.keyCode < 96 || event.keyCode > 105) &&
        (event.keyCode != 190) && (event.keyCode != 189) && (event.keyCode != 107) && (event.keyCode != 109)) {
        event.preventDefault();
    }
}



function ValidateAdjustment(_this, action, event, calledFrom) {
    if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110, 190, 189, 107, 109, 37, 39]) !== -1 ||
        // Allow: Ctrl+A, Command+A
        (event.keyCode == 65 && (event.ctrlKey === true || event.metaKey === true)) ||
        // Allow: Ctrl+C, Command+C
        (event.keyCode == 67 && (event.ctrlKey === true || event.metaKey === true)) ||
        // Allow: Ctrl+V, Command+V
        (event.keyCode == 86 && (event.ctrlKey === true || event.metaKey === true)) ||
        // Allow: Ctrl+X, Command+X
        (event.keyCode == 88 && (event.ctrlKey === true || event.metaKey === true)) ||
        // Allow: home, end, left, right
        (event.keyCode >= 35 && event.keyCode <= 39) ||
        // Allow 1-9
        (event.keyCode >= 48 && event.keyCode <= 57) ||
        // Allow 1-9
        (event.keyCode >= 96 && event.keyCode <= 105)
    ) {
        // let it happen, don't do anything

        var inputVal = $(_this).val();
        if (inputVal.length > 0) {
            console.log("PMIndex", inputVal.toString().indexOf("-"));
            if (inputVal.toString().startsWith(".")) {
                inputVal = inputVal.replace(".", "0.");
            }
            else if (inputVal.toString().startsWith("+") || inputVal.toString().startsWith("-")) {
                if (inputVal.substr(1, 1) == ".") {
                    inputVal = inputVal.replace(".", "0.");
                }
            }
            console.log("IP VAL: " + inputVal);
            if (inputVal.toString().indexOf("-") > 0 || inputVal.toString().indexOf("+") > 0) {
                inputVal = "";
            }
            else {
                if (inputVal.split(".").length > 2 || inputVal.split("-").length > 2 || inputVal.split("+").length > 2) {
                    inputVal = "";
                }
                else {
                    if (inputVal.split(".").length == 2 && inputVal.split(".")[1].length > 2) {
                        inputVal = inputVal.toString().substr(0, inputVal.toString().length - 1);
                    }
                }
            }
        }
        else {
            if (calledFrom == "edit") {
                $("#ico" + action + "Edit").hide();
            }
            else {
                $("#ico" + action).hide();
            }

            return;
        }

        if (Math.abs(inputVal.replace("%", "")) > 10) {
            if (calledFrom == "edit") {
                $("#ico" + action + "Edit").hide();
            }
            else {
                $("#ico" + action).hide();
            }

            inputVal = "";
        }
        else {
            if (calledFrom == "edit") {
                $("#ico" + action + "Edit").show();
            }
            else {
                $("#ico" + action).show();
            }

            inputVal = inputVal

        }

        $(_this).val(inputVal);


        return;
    }
    // Ensure that it is a number or minus or plus or period
    if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) &&
        (event.keyCode < 96 || event.keyCode > 105) &&
        (event.keyCode != 190) && (event.keyCode != 189) && (event.keyCode != 107) && (event.keyCode != 109)) {
        event.preventDefault();
    }
}

function FormatAdjustmentData(ctrl, valType, calledFrom) {
    if ($(ctrl).val() == "") {
        if (valType.toString().toLowerCase() == "rates")
            curAdjustedRates = 0.0;
        else
            curAdjustedImps = 0.0;
    }
    else {
        if ($(ctrl).val().startsWith("-") || $(ctrl).val().startsWith("+")) {
            if (!$(ctrl).val().endsWith("%"))
                $(ctrl).val($(ctrl).val() + "%");
        }
        else {
            if (!$(ctrl).val().endsWith("%"))
                $(ctrl).val("+" + $(ctrl).val() + "%");
        }
        if (valType.toString().toLowerCase() == "rates")
            curAdjustedRates = $(ctrl).val() != "" ? parseFloat($(ctrl).val().replace("%", "")).toFixed(2) : 0.00;
        else
            curAdjustedImps = $(ctrl).val() != "" ? parseFloat($(ctrl).val().replace("%", "")).toFixed(2) : 0.00;
    }
    if (!isNaN(curAdjustedRates) && curAdjustedRates != 0) {
        $("#txtAdjustRatesEdit").css("color", "#2971B9");
        rateTextColor = "#2971B9";
    }
    else {
        rateTextColor = "#575757";
        $("#txtAdjustRates").val("");
        $("#icoRates").hide();
        $("#txtAdjustRatesEdit").val("");
        $("#icoRatesEdit").hide();
    }
    if (!isNaN(curAdjustedImps) && curAdjustedImps != 0) {
        $("#txtAdjustImpsEdit").css("color", "#2971B9");
        impsTextColor = "#2971B9";
    }
    else {
        $("#txtAdjustImps").val("");
        $("#icoImps").hide();
        $("#txtAdjustImpsEdit").val("");
        $("#icoImpsEdit").hide();
        impsTextColor = "#575757";
    }
    if (calledFrom == "edit") {
        SelProperties = [];
        SelProperties.push(mediaPlanEditSelectedProperty);
    }
    if (SelProperties.length > 0) {
        CalculateAdjustedRates(calledFrom);
    }
}
function ClearAdjustments(action, calledFrom) {
    if (calledFrom == "edit") {
        $("#txtAdjust" + action + "Edit").val("");
        $("#ico" + action + "Edit").hide();
        $("#txtAdjust" + action + "Edit").focus();
    }
    else {
        $("#txtAdjust" + action).val("");
        $("#ico" + action).hide();
        $("#txtAdjust" + action).focus();
    }

    PrevAdjustedImps = curAdjustedImps;
    PrevAdjustedRates = curAdjustedRates;
    if (action.toString().toLowerCase() == "rates") {
        if (calledFrom == "edit") {
            curAdjustedRates = $("#txtAdjust" + action + "Edit").val() != "" ? parseFloat($("#txtAdjust" + action + "Edit").val().replace("%", "")).toFixed(2) : 0.00;
        }
        else {
            curAdjustedRates = $("#txtAdjust" + action).val() != "" ? parseFloat($("#txtAdjust" + action).val().replace("%", "")).toFixed(2) : 0.00;
        }
    }
    else {
        if (calledFrom == "edit") {
            curAdjustedImps = $("#txtAdjust" + action + "Edit").val() != "" ? parseFloat($("#txtAdjust" + action + "Edit").val().replace("%", "")).toFixed(2) : 0.00;
        }
        else {
            curAdjustedImps = $("#txtAdjust" + action).val() != "" ? parseFloat($("#txtAdjust" + action).val().replace("%", "")).toFixed(2) : 0.00;
        }
    }
    if (curAdjustedRates != 0) {
        rateTextColor = "#2971B9";
    }
    else {
        rateTextColor = "#575757";
    }
    if (curAdjustedImps != 0) {
        impsTextColor = "#2971B9";
    }
    else {
        impsTextColor = "#575757";
    }

    curAdjustedRates = 0.0;
    curAdjustedImps = 0.0;
    if (calledFrom == "edit") {
        SelProperties = [];
        SelProperties.push(mediaPlanEditSelectedProperty);
    }
    if (SelProperties.length > 0) {
        CalculateAdjustedRates(calledFrom);
    }
}

function CalculateAdjustedRates(calledFrom) {
    if (calledFrom == "edit") {
        SelProperties = [];
        SelProperties.push(mediaPlanEditSelectedProperty);
        curAdjustedRates = $("#txtAdjustRatesEdit").val() != "" ? parseFloat($("#txtAdjustRatesEdit").val().replace("%", "")).toFixed(2) : 0.00;
        curAdjustedImps = $("#txtAdjustImpsEdit").val() != "" ? parseFloat($("#txtAdjustImpsEdit").val().replace("%", "")).toFixed(2) : 0.00;
    }
    else {
        curAdjustedRates = $("#txtAdjustRates").val() != "" ? parseFloat($("#txtAdjustRates").val().replace("%", "")).toFixed(2) : 0.00;
        curAdjustedImps = $("#txtAdjustImps").val() != "" ? parseFloat($("#txtAdjustImps").val().replace("%", "")).toFixed(2) : 0.00;
    }

    var calcRate = false;
    var calcImps = false;
    for (var x = 0; x < SelProperties.length; x++) {
        if (parseFloat(SelProperties[x].adjustedRatesPerc) != parseFloat(curAdjustedRates)) {
            calcRate = true;
            if (parseFloat(SelProperties[x].adjustedRatesPerc) != parseFloat(0)) {
                if (calledFrom == "edit") {
                    SelProperties[x].rateAmount = (SelProperties[x].rateAmount * 100) / (parseFloat(SelProperties[x].adjustedRatesPerc) + parseFloat(100));
                    SelProperties[x].rateAmt = SelProperties[x].rateAmount;
                }
                else {
                    SelProperties[x].rateAmt = (SelProperties[x].rateAmt * 100) / (parseFloat(SelProperties[x].adjustedRatesPerc) + parseFloat(100));
                }

            }
        }
        else {
            calcRate = false;
        }
        if (parseFloat(SelProperties[x].adjustedImpsPerc) != parseFloat(curAdjustedImps)) {
            calcImps = true;
            if (parseFloat(SelProperties[x].adjustedImpsPerc) != parseFloat(0)) {
                SelProperties[x].impressions = (SelProperties[x].impressions * 100) / (parseFloat(SelProperties[x].adjustedImpsPerc) + parseFloat(100));
            }
        }
        else {
            calcImps = false;
        }

        SelProperties[x].adjustedRatesPerc = curAdjustedRates;
        SelProperties[x].adjustedImpsPerc = curAdjustedImps;
        if (calcRate) {
            if (calledFrom == "edit") {
                SelProperties[x].rateAmount = parseFloat(SelProperties[x].rateAmount) + (parseFloat(SelProperties[x].rateAmount) * (curAdjustedRates / 100));
                SelProperties[x].rateAmt = SelProperties[x].rateAmount;
            }
            else {
                SelProperties[x].rateAmt = parseFloat(SelProperties[x].rateAmt) + (parseFloat(SelProperties[x].rateAmt) * (curAdjustedRates / 100));
            }
        }
        if (calcImps) {
            SelProperties[x].impressions = parseFloat(SelProperties[x].impressions) + (parseFloat(SelProperties[x].impressions) * (curAdjustedImps / 100));
        }
        if (calledFrom == "edit") {
            if (parseFloat(SelProperties[x].impressions) > 0 && parseFloat(SelProperties[x].rateAmount) > 0) {
                SelProperties[x].cpm = parseFloat(parseFloat(SelProperties[x].rateAmount) / parseFloat(SelProperties[x].impressions)).toFixed(2);
            }
            else {
                SelProperties[x].cpm = 0.00;
            }
        }
        else {
            if (parseFloat(SelProperties[x].impressions) > 0 && parseFloat(SelProperties[x].rateAmt) > 0) {
                SelProperties[x].cpm = parseFloat(parseFloat(SelProperties[x].rateAmt) / parseFloat(SelProperties[x].impressions)).toFixed(2);
            }
            else {
                SelProperties[x].cpm = 0.00;
            }
        }

    }
    if (calledFrom == "create") {
        ResetMediaPlanPropData();
    }
    else {
        PopulateEditPropertyTable(SelProperties[0]);
    }
}
function IntializePlaceholder() {
    BlankPlaceholder = {
        "buyTypeGroupId": 0, "mediaPlanId": 0, "networkId": 0, "propertyId": 0, "rateId": 0, "propertyName": "Placeholder", "startTime": "", "endTime": "", "dayPartId": 0, "dp": "", "dayPartDesc": "", "days": "", "spotLen": 0, "status": "", "rateAmt": 0,
        "impressions": 0, "cpm": 0, "universe": 0, "clientId": 0, "buyTypeId": 0, "demoId": 0, "planYear": 0, "quarterId": 0, "dow": "", "buyTypeCode": "", "totalSpots": 0, "wk01Spots": 0, "wk02Spots": 0, "wk03Spots": 0,
        "wk04Spots": 0, "wk05Spots": 0, "wk06Spots": 0, "wk07Spots": 0, "wk08Spots": 0, "wk09Spots": 0, "wk10Spots": 0, "wk11Spots": 0, "wk12Spots": 0, "wk13Spots": 0, "wk14Spots": 0, "adjustedRatesPerc": 0, "adjustedImpsPerc": 0, "IsPlaceHolder": true
    };
    PopulateDayPart();
    PopulateBuyType();
    PopulateLength();
}

function PopulateBuyType() {

    $.ajax({
        url: "/MediaPlan/GetMediaPlanBuyTypes",
        data: {
            "BuyTypeGroup": globalBuyTypeGroup
        },
        cache: false,
        type: "GET",
        success: function (result) {
            PlaceHolderBT = result;
        },
        error: function (response) {
            swal('Ooops ...', 'Error Populating Buy Types:  ' + response, 'error');
        }
    });
}

function PopulateDayPart() {
    $.ajax({
        url: "/MediaPlan/GetMediPlanDayPart",
        data: {
            "BuyTypeGroup": globalBuyTypeGroup
        },
        cache: false,
        type: "GET",
        success: function (result) {
            PlaceHolderDP = result;
        },
        error: function (response) {
            swal('Ooops ...', 'Error Populating Buy Types:  ' + response, 'error');
        }
    });
}
function PopulateLength() {
    if (parseFloat($("#hdn15SecPerc").val()) > 0)
        PlaceHolderLen = [{ "value": "30", "text": ":30" }, { "value": "15", "text": ":15" }, { "value": "60", "text": ":60" }, { "value": "120", "text": ":120" }];
    else
        PlaceHolderLen = [{ "value": "30", "text": ":30" }, { "value": "60", "text": ":60" }, { "value": "120", "text": ":120" }];
}

function AddNewPlaceholder() {
    var arrSelectedPlaceholder = jQuery.extend(true, {}, BlankPlaceholder);
    if (SelPlaceholder.length == 0) {
        arrSelectedPlaceholder.rateId = 111111;
        if (ExpectedClearanceData == null || ExpectedClearanceData == undefined) {
            ExpectedClearanceData = null;
            SpendAtClearanceData = null;
        }

    }
    else {
        arrSelectedPlaceholder.rateId = parseInt(getMaxRateIdFromPlaceHodlerArrary(SelPlaceholder, "rateId")) + 1;

    }
    arrSelectedPlaceholder.buyTypeGroupId = parseInt($("#hdnBuyTypeGroupId").val());
    arrSelectedPlaceholder.networkId = globalNetworkId;
    arrSelectedPlaceholder.planYear = parseInt($("#ddlMediaPlanLongPlanYears").val());
    arrSelectedPlaceholder.quarterId = parseInt($("#ddlMediaPlanLongPlanQuarter").val());
    arrSelectedPlaceholder.demoId = parseInt($("#ddlMediaPlanLongPlanDemos").val());
    arrSelectedPlaceholder.isPlaceHolder = true;

    SelPlaceholder.push(arrSelectedPlaceholder);
    SetSpendData();
    if (globalBuyTypeGroup == "DR") {
        SetDRClearanceDataBlank();
        SetSpendAtClearance();// ST-1178
    }
    ResetMediaPlanPropData();
}
function getMaxRateIdFromPlaceHodlerArrary(jsonArray, property) {
    // Initialize max value with negative infinity
    let maxValue = Number.NEGATIVE_INFINITY;
    // Iterate through the array
    jsonArray.forEach(function (item) {
        // Check if the property exists in the item
        if (item.hasOwnProperty(property)) {
            // Update maxValue if the current value is greater
            maxValue = Math.max(maxValue, item[property]);
        }
    });
    // Return the maximum value
    return maxValue;
}

function SetPlaceHolderDropDowns() {
    if (SelPlaceholder != null && SelPlaceholder != undefined && SelPlaceholder.length > 0) {
        for (var j = 0; j < SelPlaceholder.length; j++) {
            SetDDLHTML(SelPlaceholder[j].rateId);
        }
    }
}
function SetDDLHTML(uniqueId) {
    var CurArrayLen = jQuery.extend(true, [], PlaceHolderLen);
    var CurArrayDP = jQuery.extend(true, [], PlaceHolderDP);
    var CurArrayBT = jQuery.extend(true, [], PlaceHolderBT);
    BindDDLdata("ddlDP", uniqueId, CurArrayDP, SelPlaceholder.filter(o => o.rateId == uniqueId)[0].dayPartId);
    BindDDLdata("ddlBT", uniqueId, CurArrayBT, SelPlaceholder.filter(o => o.rateId == uniqueId)[0].buyTypeId);
    BindDDLdata("ddlLen", uniqueId, CurArrayLen, SelPlaceholder.filter(o => o.rateId == uniqueId)[0].spotLen);
}

function BindDDLdata(ddlId, uniqueId, dataArray, SelVal) {
    var markup = "<option></option>";
    for (var x = 0; x < dataArray.length; x++) {
        markup += "<option value=" + dataArray[x].value + ">" + dataArray[x].text + "</option>";
    }
    $("#" + ddlId + "_" + uniqueId).html(markup);
    $("#" + ddlId + "_" + uniqueId).val(SelVal);
}

function SetPlaceHolderData(ctrl, index) {
    var SelVal = $(ctrl).val() == "" ? 0 : parseInt($(ctrl).val());
    var ctrlArr = $(ctrl).attr("id");
    var valType = (ctrlArr.split('_')[0]).replace("ddl", "");
    var uniqueId = (ctrlArr.split('_')[1]);
    var btVal = $("#ddlBT_" + uniqueId).val();
    if (valType.toLowerCase() == "dp") {
        SelPlaceholder.filter(o => o.rateId == uniqueId)[0].dayPartId = SelVal;
        if (SelVal > 0) {
            SelPlaceholder.filter(o => o.rateId == uniqueId)[0].dayPart = $(ctrl).find(":selected").text().split('(')[0].replace(")", "").trim();
            SelPlaceholder.filter(o => o.rateId == uniqueId)[0].dayPartDesc = $(ctrl).find(":selected").text().split('(')[1].replace(")", "").trim();
        }
    }
    if (valType.toLowerCase() == "bt") {
        SelPlaceholder.filter(o => o.rateId == uniqueId)[0].buyTypeId = SelVal;
        if (parseInt(SelVal) == 1 || parseInt(SelVal) == 3 || parseInt(SelVal) == 9) {
            SelPlaceholder.filter(o => o.rateId == uniqueId)[0].rateAmt = 0.00;
            SelPlaceholder.filter(o => o.rateId == uniqueId)[0].cpm = 0.00;
            $("#txtRate_" + uniqueId).val("$0.00");
            $("#tdCPM_" + uniqueId).html("$0.00");
            $("#txtRate_" + uniqueId).attr("disabled", true);
        }
        else {
            $("#txtRate_" + uniqueId).attr("disabled", false);
        }
        if (parseInt(SelVal) == 1 || parseInt(SelVal) == 4 || parseInt(SelVal) == 9) {
            SelPlaceholder.filter(o => o.rateId == uniqueId)[0].impressions = 0.00;
            SelPlaceholder.filter(o => o.rateId == uniqueId)[0].cpm = 0.00;
            $("#txtImps_" + uniqueId).val("0.00");
            $("#tdCPM_" + uniqueId).html("$0.00");
            $("#txtImps_" + uniqueId).attr("disabled", true);
        }
        else {
            $("#txtImps_" + uniqueId).attr("disabled", false);
        }

    }
    if (valType.toLowerCase() == "len") {
        SelPlaceholder.filter(o => o.rateId == uniqueId)[0].spotLen = SelVal;
        Set15SecDataBlank(1);
        if (btVal != null) {
            if (parseInt(btVal) == 1 || parseInt(btVal) == 3 || parseInt(btVal) == 9) {
                SelPlaceholder.filter(o => o.rateId == uniqueId)[0].rateAmt = 0.00;
                SelPlaceholder.filter(o => o.rateId == uniqueId)[0].cpm = 0.00;
                $("#txtRate_" + uniqueId).val("$0.00");
                $("#tdCPM_" + uniqueId).html("$0.00");
                $("#txtRate_" + uniqueId).attr("disabled", true);
            }
            else {
                $("#txtRate_" + uniqueId).attr("disabled", false);
            }
            if (parseInt(btVal) == 1 || parseInt(btVal) == 4 || parseInt(btVal) == 9) {
                SelPlaceholder.filter(o => o.rateId == uniqueId)[0].impressions = 0.00;
                SelPlaceholder.filter(o => o.rateId == uniqueId)[0].cpm = 0.00;
                $("#txtImps_" + uniqueId).val("0.00");
                $("#tdCPM_" + uniqueId).html("$0.00");
                $("#txtImps_" + uniqueId).attr("disabled", true);
            }
            else {
                $("#txtImps_" + uniqueId).attr("disabled", false);
            }
        }
    }
    CheckSpotsEnable(uniqueId);
    ValidatePlaceHolderData(2);
    CalculateTotals();
}
function CheckSpotsEnable(rid) {
    var CurPlaceHolder = SelPlaceholder.filter(o => o.rateId == rid)[0];
    if (CurPlaceHolder.dayPartId > 0 && CurPlaceHolder.buyTypeId > 0 && CurPlaceHolder.spotLen > 0) {
        if ($("#txtImps_" + rid).val() != "" && $("#txtRate_" + rid).val() != "" && $("#tdCPM_" + rid).html().trim() != "")
            $(".clsactive_" + rid).prop("disabled", false);
        else
            $(".clsactive_" + rid).prop("disabled", true);
    }
    else {
        $(".clsactive_" + rid).prop("disabled", true);
    }
}

function RemovePlaceholder(ctrl, index) {

    var rid = $(ctrl).closest("tr").attr("data-rid");
    var checked = $("#chkRate_" + rid).prop("checked");
    var curPlaceHolderData = SelPlaceholder.filter(o => o.rateId == rid)[0];
    var propertyToRemove = curPlaceHolderData.propertyName;
    var hasPlaceData = false;
    var id = $(ctrl).closest("tr").attr('id');
    $("#" + id + " input[type=text]").each(function () {
        if ($(this).attr("id") != null && $(this).attr("id") != undefined && $(this).attr("id").toLowerCase().indexOf("txtrate_") < 0 && $(this).attr("id").toLowerCase().indexOf("txtimps_") < 0) {
            var text_value = $(this).val();
            if (text_value != null && text_value != undefined && text_value != "") {
                hasPlaceData = true;
            }
        }
    });

    if (hasPlaceData) {

        if (!swal.isVisible()) {
            swal({
                title: "",
                html: '<strong style="float:left"> Remove Property? </strong> <br> <br> <span style="float:left"> There are spots allocated to <strong>' + propertyToRemove + '.' + '</strong> </span>  <br> <br> <span style="float:left"> Are you sure you want to remove this property? </span> <br>',
                type: 'warning',
                showCancelButton: true,
                width: 500,
                height: 302,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'No',
                confirmButtonText: 'Yes',
                showLoaderOnConfirm: true,
                allowOutsideClick: false,
                allowEscapeKey: false,
                reverseButtons: true,
                preConfirm: function () {
                    return new Promise(function (resolve) {
                        setTimeout(function () {
                            resolve();
                        }, 50);
                    });
                }
            }).then(
                function (result) {
                    SelPlaceholder.splice(SelPlaceholder.indexOf(SelPlaceholder.filter(o => o.rateId == rid)[0]), 1);
                    $("#tbmpLongPlanNetwork").html("");
                    ResetMediaPlanPropData();
                }, function (dismiss) {
                    return false;
                }
            );
        }

    }
    else {

        SelPlaceholder.splice(SelPlaceholder.indexOf(SelPlaceholder.filter(o => o.rateId == rid)[0]), 1);
        $("#tbmpLongPlanNetwork").html("");
        ResetMediaPlanPropData();
    }
    if ($('#ddlMediaPlanProperties input[type=checkbox]:checked').length == 0 && SelPlaceholder.length == 0) {
        $("#btnSaveAddmpLongPlanNetworkModal, #btnSaveClosempLongPlanNetworkModal").prop("disabled", true);
    }
    else {
        $("#btnSaveAddmpLongPlanNetworkModal, #btnSaveClosempLongPlanNetworkModal").prop("disabled", false);
    }
}

function appendDollarSignToInput(txt) {
    if (txt != '') {
        if (!isNaN(txt.replace('$', ''))) {
            if (txt.indexOf('$') != -1) {
                return txt;
            }
            else {
                return '$' + txt;
            }
        }
        else {
            return '';
        }
    }
    else {
        return '';
    }
}
function ValidatePlaceholderInputs(_this, inputType, action) {
    var rid = $(_this).attr("id").split('_')[1];
    var amount = $(_this).val();
    amount = amount.trim();
    amount = amount.replace(/\$|\,/g, "");

    if (inputType == 'rates') {
        if (action == "edit") {
            if (mediaPlanEditSelectedProperty.buyTypeId == 0 || mediaPlanEditSelectedProperty.buyTypeId == 1 || mediaPlanEditSelectedProperty.buyTypeId == 3 || mediaPlanEditSelectedProperty.buyTypeId == 9) {
                amount = 0.00;
            }
        }
        else {
            if (SelPlaceholder.filter(o => o.rateId == rid)[0].buyTypeId == 0 || SelPlaceholder.filter(o => o.rateId == rid)[0].buyTypeId == 1 || SelPlaceholder.filter(o => o.rateId == rid)[0].buyTypeId == 3 || SelPlaceholder.filter(o => o.rateId == rid)[0].buyTypeId == 9) {
                amount = 0.00;
            }
        }

        amount = amount > 9000000000 ? 9000000000 : amount;
        amount == "" ? $(_this).val("") : $(_this).val("$" + amount);

    }
    else {
        if (action == "edit") {
            if (mediaPlanEditSelectedProperty.buyTypeId == 0 || mediaPlanEditSelectedProperty.buyTypeId == 1 || mediaPlanEditSelectedProperty.buyTypeId == 4 || mediaPlanEditSelectedProperty.buyTypeId == 9) {
                amount = 0.00;
            }
        }
        else {
            if (SelPlaceholder.filter(o => o.rateId == rid)[0].buyTypeId == 0 || SelPlaceholder.filter(o => o.rateId == rid)[0].buyTypeId == 1 || mediaPlanEditSelectedProperty.buyTypeId == 4 || SelPlaceholder.filter(o => o.rateId == rid)[0].buyTypeId == 9) {
                amount = 0.00;
            }
        }
        amount = amount > 600000 ? 600000 : amount;
        amount == "" ? $(_this).val("") : $(_this).val(amount);
    }

    CalculatePlaceHolderCPM(rid, action);
}

function CheckInputData(_this, inputType, action) {

    if (inputType == 'rates' && $(_this).val() != "") {
        var val = Number($(_this).val().replace(/\$|\,/g, "")).toFixed(2);
        var formattedVal = (Number(val)).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        });
        $(_this).val(formattedVal);
    }
    if (inputType == 'imps' && $(_this).val() != "") {
        var val = Number($(_this).val().replace(/\$|\,/g, "")).toFixed(2);
        var formattedVal = (Number(val)).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        });
        $(_this).val(formattedVal.replace("$", ""));
    }

    if (inputType == 'rates' && $(_this).val() == "$") {
        $(_this).val("");
    }

    var rid = $(_this).attr("id").split('_')[1];
    CalculatePlaceHolderCPM(rid, action);
    CalculateTotals();
}
function CalculatePlaceHolderCPM(rid, action) {
    var inputRate = 0.00;
    var inputImps = 0.00;
    var CalcCPMM = 0.00;
    if (action == "edit") {
        if ($("#txtRateForEdit").val() != null && $("#txtRateForEdit").val() != undefined && $("#txtRateForEdit").val() != "") {
            inputRate = $("#txtRateForEdit").val().replace(/\$|\,/g, "");
        }
        if ($("#txtImpsForEdit").val() != null && $("#txtImpsForEdit").val() != undefined && $("#txtImpsForEdit").val() != "") {
            inputImps = $("#txtImpsForEdit").val().replace(/\$|\,/g, "");
        }
        else {
            $("#txtImpsForEdit").val("0");
        }
        if (inputImps > 0 && inputRate > 0) {
            CalcCPMM = inputRate / inputImps;
        }
        if (CalcCPMM > 0) {
            var formattedVal = (Number(CalcCPMM)).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
            });
            $("#txtCPMForEdit").html(formattedVal);
        }
        else {
            $("#txtCPMForEdit").html("$0.00");
        }
        if (inputImps > 0) {
            mediaPlanEditSelectedProperty.impressions = inputImps;
        }
        else {
            mediaPlanEditSelectedProperty.impressions = 0;
        }
        if (inputRate > 0) {
            mediaPlanEditSelectedProperty.rateAmount = inputRate;
        }
        else {
            mediaPlanEditSelectedProperty.rateAmount = 0;
        }
        if (CalcCPMM > 0) {
            mediaPlanEditSelectedProperty.cpm = CalcCPMM;
        }
        else {
            mediaPlanEditSelectedProperty.cpm = 0;
        }
    }
    else {
        if ($("#txtRate_" + rid).val() != null && $("#txtRate_" + rid).val() != undefined && $("#txtRate_" + rid).val() != "") {
            inputRate = $("#txtRate_" + rid).val().replace(/\$|\,/g, "");
        }
        if ($("#txtImps_" + rid).val() != null && $("#txtImps_" + rid).val() != undefined && $("#txtImps_" + rid).val() != "") {
            inputImps = $("#txtImps_" + rid).val().replace(/\$|\,/g, "");
        }
        else {
            $("#txtImps_" + rid).val("0");
        }
        if (inputImps > 0 && inputRate > 0) {
            CalcCPMM = inputRate / inputImps;
        }
        if (CalcCPMM > 0) {
            var formattedVal = (Number(CalcCPMM)).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
            });
            $("#tdCPM_" + rid).html(formattedVal);
        }
        else {
            $("#tdCPM_" + rid).html("$0.00");
        }
        if (inputImps > 0) {
            SelPlaceholder.filter(o => o.rateId == rid)[0].impressions = inputImps;
        }
        else {
            SelPlaceholder.filter(o => o.rateId == rid)[0].impressions = 0;
        }
        if (inputRate > 0) {
            SelPlaceholder.filter(o => o.rateId == rid)[0].rateAmt = inputRate;
        }
        else {
            SelPlaceholder.filter(o => o.rateId == rid)[0].rateAmt = 0;
        }
        if (CalcCPMM > 0) {
            SelPlaceholder.filter(o => o.rateId == rid)[0].cpm = CalcCPMM;
        }
        else {
            SelPlaceholder.filter(o => o.rateId == rid)[0].cpm = 0;
        }
        CheckSpotsEnable(rid);
    }
}
function SetDayPart(selected) {
    mediaPlanEditSelectedProperty.dayPartId = parseInt(selected.value);
}
function SetBuyType(selected, action) {
    var selectedValue = (action == "default") ? selected : selected.value;
    mediaPlanEditSelectedProperty.buyTypeId = parseInt(selectedValue);
    if (selectedValue == 1 || selectedValue == 3 || selectedValue == 9) {
        mediaPlanEditSelectedProperty.rateAmount = 0.00;
        mediaPlanEditSelectedProperty.cpm = 0.00;
        $("#txtRateForEdit").val("0.00");
        $("#txtCPMForEdit").html("$0.00");
        $("#txtRateForEdit").attr("disabled", true);
    }
    else {
        $("#txtRateForEdit").attr("disabled", false);
    }
    if (selectedValue == 1 || selectedValue == 4 || selectedValue == 9) {
        mediaPlanEditSelectedProperty.impressions = 0.00;
        mediaPlanEditSelectedProperty.cpm = 0.00;
        $("#txtImpsForEdit").val("0.00");
        $("#txtCPMForEdit").html("$0.00");
        $("#txtImpsForEdit").attr("disabled", true);
    }
    else {
        $("#txtImpsForEdit").attr("disabled", false);
    }
}

function SetSpotLen(selected) {
    mediaPlanEditSelectedProperty.spotLen = parseInt(selected.value);
    mediaPlanEditNetworkProperties.filter(o => o.mediaPlanPropertyId == mediaPlanEditSelectedProperty.mediaPlanPropertyId)[0].spotLen = selected.value;
    Set15SecDataBlankForEdit();
    PopulateEditPropertyTable(mediaPlanEditSelectedProperty);
    if (selected.value == 15) {
        Calculate15secPercentagesForEdit(mediaPlanEditSelectedProperty, mediaPlanEditNetworkProperties);
        $("#row-15percent").show();
    }
}
function UpdateMediaPlanPropertyById() {
    var mediaPlanId = $("#hdnMediaPlanId").val();
    $.ajax({
        url: "/MediaPlan/MediaPlanCheckLock/",
        data: {
            MediaPlanId: mediaPlanId,
            Action: "updatempproperty"
        },
        cache: false,
        type: "POST",
        success: function (response) {
            if (response.responseCode != 200) {
                swal({
                    html: response.responseText,
                    type: 'error',
                });
                setTimeout(function () {
                    window.location.href = "/ManageMedia/Planning";
                }, 3000);
            }
            else {
                isValidEditPlaceHolderEntries = ValidateEditPlaceHolderData();
                if (!isValidEditPlaceHolderEntries) {
                    swal({
                        html: editPlaceHolderValidationMessage,
                        type: 'warning',
                    });
                    return false;
                }
                var url = "/MediaPlan/UpdateMediaPlanPropertyById/";
                $.ajax({
                    url: url,
                    data: {
                        "MediaPlanPropertyId": mediaPlanEditSelectedProperty.mediaPlanPropertyId,
                        "AdjustedRatePercentage": mediaPlanEditSelectedProperty.adjustedRatesPerc,
                        "AdjustedImpressionPercentage": mediaPlanEditSelectedProperty.adjustedImpsPerc,
                        "MediaPlanPropertyName": mediaPlanEditSelectedProperty.mediaPlanPropertyName,
                        "DayPartId": mediaPlanEditSelectedProperty.dayPartId,
                        "BuyTypeId": mediaPlanEditSelectedProperty.buyTypeId,
                        "SpotLen": mediaPlanEditSelectedProperty.spotLen,
                        "RateAmount": mediaPlanEditSelectedProperty.rateAmount,
                        "Impressions": mediaPlanEditSelectedProperty.impressions,
                        "CPM": mediaPlanEditSelectedProperty.cpm,
                        "Wk01Spots": mediaPlanEditSelectedProperty.wk01Spots,
                        "Wk02Spots": mediaPlanEditSelectedProperty.wk02Spots,
                        "Wk03Spots": mediaPlanEditSelectedProperty.wk03Spots,
                        "Wk04Spots": mediaPlanEditSelectedProperty.wk04Spots,
                        "Wk05Spots": mediaPlanEditSelectedProperty.wk05Spots,
                        "Wk06Spots": mediaPlanEditSelectedProperty.wk06Spots,
                        "Wk07Spots": mediaPlanEditSelectedProperty.wk07Spots,
                        "Wk08Spots": mediaPlanEditSelectedProperty.wk08Spots,
                        "Wk09Spots": mediaPlanEditSelectedProperty.wk09Spots,
                        "Wk10Spots": mediaPlanEditSelectedProperty.wk10Spots,
                        "Wk11Spots": mediaPlanEditSelectedProperty.wk11Spots,
                        "Wk12Spots": mediaPlanEditSelectedProperty.wk12Spots,
                        "Wk13Spots": mediaPlanEditSelectedProperty.wk13Spots,
                        "Wk14Spots": mediaPlanEditSelectedProperty.wk14Spots
                    },
                    cache: false,
                    type: "POST",
                    success: function (result) {
                        if (result.success == true) {
                            LongPlanEditReload();
                        }
                        else {
                            swal("error : " + result.responseText);
                        }
                    },
                    error: function (response) {
                        swal("error : " + response.responseText);
                    }
                });
            }
        },
        error: function (response) {
            var err = response.result;
        }
    });
}

function DeleteMediaPlanPropertyById() {
    var mediaPlanId = $("#hdnMediaPlanId").val();
    $.ajax({
        url: "/MediaPlan/MediaPlanCheckLock/",
        data: {
            MediaPlanId: mediaPlanId,
            Action: "deleteproperty"
        },
        cache: false,
        type: "POST",
        success: function (response) {
            if (response.responseCode != 200) {
                swal({
                    html: response.responseText,
                    type: 'error',
                });
                setTimeout(function () {
                    window.location.href = "/ManageMedia/Planning";
                }, 3000);
            }
            else {
                var url = "/MediaPlan/DeleteMediaPlanPropertyById/";
                swal({
                    title: "",
                    html: 'Do you wish to delete ' + mediaPlanPropertyNameForDelete + ' from ' + $("#hdnMediaPlanName").val() + '?',
                    type: 'warning',
                    showCancelButton: true,
                    width: 650,
                    height: 302,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'No',
                    confirmButtonText: 'Yes',
                    showLoaderOnConfirm: true,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    reverseButtons: true,
                    preConfirm: function () {
                        return new Promise(function (resolve) {
                            setTimeout(function () {
                                resolve();
                            }, 50);
                        });
                    }
                }).then(
                    function (result) {
                        $.ajax({
                            url: url,
                            data: {
                                "MediaPlanPropertyId": mediaPlanPropertyIdForUpdateDelete
                            },
                            cache: false,
                            type: "POST",
                            success: function (result) {
                                if (result.success == true) {
                                    LongPlanEditReload();
                                }
                                else {
                                    swal("error : " + result.responseText);
                                }

                            },
                            error: function (response) {
                                swal("error : " + response.responseText);
                            }
                        });
                    }, function (dismiss) {
                        return false;
                    }
                );
            }
        },
        error: function (response) {
            var err = response.result;
        }
    });
}
function OpenEditPropertyModal(mediaPlanPropertyId) {
    var mediaPlanId = $("#hdnMediaPlanId").val();
    $.ajax({
        url: "/MediaPlan/MediaPlanCheckLock/",
        data: {
            MediaPlanId: mediaPlanId,
            Action: "editproperty"
        },
        cache: false,
        type: "POST",
        success: function (response) {
            if (response.responseCode != 200) {
                swal({
                    html: response.responseText,
                    type: 'error',
                });
                setTimeout(function () {
                    window.location.href = "/ManageMedia/Planning";
                }, 3000);
            }
            else {
                $("#txtAdjustRatesEdit").css("color", "#575757");
                $("#txtAdjustImpsEdit").css("color", "#575757");
                curAdjustedRates = 0.00;
                curAdjustedImps = 0.00;
                rateTextColor = "#575757";
                impsTextColor = "#575757";
                $("#icoRatesEdit").hide();
                $("#icoImpsEdit").hide();
                var url = "/MediaPlan/GetMediaPlanPropertyById/";
                $.ajax({
                    url: url,
                    data: {
                        "MediaPlanPropertyId": mediaPlanPropertyId,
                        "QuarterId": $("#hdnQuarterId").val()
                    },
                    cache: false,
                    type: "POST",
                    success: function (result) {
                        if (result.responseData != null) {
                            var property = result.responseData;
                            var properties = BTGroupsSummaryJSON.lstProperties;
                            mediaPlanEditSelectedProperty = property
                            mediaPlanEditNetworkProperties = properties;
                            PopulateEditPropertyControls(property);
                            PopulatedEditPropertyHeader(property);
                            Set15SecDataBlankForEdit();
                            PopulateEditPropertyTable(property);
                            if (property.spotLen == 15) {
                                Calculate15secPercentagesForEdit(property, properties);
                                $("#row-15percent").show();
                            }
                            CalculateDPPercentageForEdit(property, properties);
                            mediaPlanPropertyIdForUpdateDelete = property.mediaPlanPropertyId;
                            mediaPlanPropertyNameForDelete = property.mediaPlanPropertyName;
                            $('#mpPropertyEditModal').modal('show');
                        }
                    },
                    error: function (response) {
                        swal("error : " + response.responseText);
                    }
                });
            }
        },
        error: function (response) {
            var err = response.result;
        }
    });  
}
function Set15SecDataBlankForEdit() {
    if (mediaPlanEditSelectedProperty.spotLen == 15) {
        var perc15Row;
        if (mediaPlanEditSelectedProperty != null && mediaPlanEditSelectedProperty != undefined) {
            perc15Row = jQuery.extend(true, {}, mediaPlanEditSelectedProperty);
            perc15Row.buyTypeId = 0;
            perc15Row.propertyId = 0;
            perc15Row.propertyName = "Percentage of :15s";
            Perc15SecData = perc15Row;
        }
    }
}
function CalculatePercentagesForEdit(ctrl) {

    var WeekNo = $(ctrl).attr("col");
    mediaPlanEditSelectedProperty["wk" + WeekNo + "Spots"] = parseInt($(ctrl).val());
    mediaPlanEditNetworkProperties.filter(o => o.mediaPlanPropertyId == mediaPlanEditSelectedProperty.mediaPlanPropertyId)[0]["wk" + WeekNo + "Spots"] = parseInt($(ctrl).val());
    if (mediaPlanEditSelectedProperty.spotLen == 15) {
        Calculate15secPercentagesForEdit(mediaPlanEditSelectedProperty, mediaPlanEditNetworkProperties);
    }
    CalculateDPPercentageForEdit(mediaPlanEditSelectedProperty, mediaPlanEditNetworkProperties);
}
function Calculate15secPercentagesForEdit(selectedProperty, allProperties) {

    TotalWeeklySpotsData = jQuery.extend(true, [], selectedProperty);
    Total15WeeklySpotsData = jQuery.extend(true, [], selectedProperty);
    TotalWeeklySpotsData.wk01Spots = 0;
    TotalWeeklySpotsData.wk02Spots = 0;
    TotalWeeklySpotsData.wk03Spots = 0;
    TotalWeeklySpotsData.wk04Spots = 0;
    TotalWeeklySpotsData.wk05Spots = 0;
    TotalWeeklySpotsData.wk06Spots = 0;
    TotalWeeklySpotsData.wk07Spots = 0;
    TotalWeeklySpotsData.wk08Spots = 0;
    TotalWeeklySpotsData.wk09Spots = 0;
    TotalWeeklySpotsData.wk10Spots = 0;
    TotalWeeklySpotsData.wk11Spots = 0;
    TotalWeeklySpotsData.wk12Spots = 0;
    TotalWeeklySpotsData.wk13Spots = 0;
    TotalWeeklySpotsData.wk14Spots = 0;

    Total15WeeklySpotsData.wk01Spots = 0;
    Total15WeeklySpotsData.wk02Spots = 0;
    Total15WeeklySpotsData.wk03Spots = 0;
    Total15WeeklySpotsData.wk04Spots = 0;
    Total15WeeklySpotsData.wk05Spots = 0;
    Total15WeeklySpotsData.wk06Spots = 0;
    Total15WeeklySpotsData.wk07Spots = 0;
    Total15WeeklySpotsData.wk08Spots = 0;
    Total15WeeklySpotsData.wk09Spots = 0;
    Total15WeeklySpotsData.wk10Spots = 0;
    Total15WeeklySpotsData.wk11Spots = 0;
    Total15WeeklySpotsData.wk12Spots = 0;
    Total15WeeklySpotsData.wk13Spots = 0;
    Total15WeeklySpotsData.wk14Spots = 0;
    var filtered15secProperties = allProperties.filter(o => o.spotLen == 15 && o.networkId == selectedProperty.networkId);
    for (var x = 0; x < filtered15secProperties.length; x++) {
        for (var y = 1; y <= 14; y++) {
            var WkNum = y > 9 ? y : "0" + y;
            var CurSpot = filtered15secProperties[x]["wk" + WkNum + "Spots"];
            if (CurSpot != null && CurSpot != undefined && CurSpot != '' && parseInt(CurSpot) > 0) {
                TotalWeeklySpotsData["wk" + WkNum + "Spots"] = parseInt(TotalWeeklySpotsData["wk" + WkNum + "Spots"]) + parseInt(CurSpot);
                if (filtered15secProperties[x].mediaPlanPropertyId == selectedProperty.mediaPlanPropertyId) {
                    Total15WeeklySpotsData["wk" + WkNum + "Spots"] = parseInt(Total15WeeklySpotsData["wk" + WkNum + "Spots"]) + parseInt(CurSpot);
                }
            }
        }
    }

    for (var j = 1; j <= 14; j++) {
        var CalcWkNum = j > 9 ? j : "0" + j;
        if (parseInt(Total15WeeklySpotsData["wk" + CalcWkNum + "Spots"]) > 0)
            Perc15SecData["wk" + CalcWkNum + "Spots"] = (parseFloat(Total15WeeklySpotsData["wk" + CalcWkNum + "Spots"]).toFixed(2) / parseFloat(TotalWeeklySpotsData["wk" + CalcWkNum + "Spots"]).toFixed(2)) * 100;
        else
            Perc15SecData["wk" + CalcWkNum + "Spots"] = 0;
        var spotsForWk = mediaPlanEditSelectedProperty["wk" + CalcWkNum + "Spots"];
        if (spotsForWk == 0) {
            $("#td15swk" + CalcWkNum + "EditSpots").html("");
        }
        else {
            $("#td15swk" + CalcWkNum + "EditSpots").html(Perc15SecData["wk" + CalcWkNum + "Spots"] > 0 ? FormatNumber(Perc15SecData["wk" + CalcWkNum + "Spots"], "decimalpercentagezero", 0) : "");
        }
    }
}

function CalculateDPPercentageForEdit(selectedProperty, allProperties) {
    DPData = [];
    var TotalSpots = 0;
    var uniqueDp = allProperties.filter(function (itm, i, a) {
        if (itm.mediaPlanPropertyId == selectedProperty.mediaPlanPropertyId) {
            var objDP = { "dayPartId": itm.dayPartId, "dayPart": itm.dayPartDesc, "totalSpots": 0, "percVal": 0 }
            var indexArc = DPData.findIndex(x => x.dayPartId === itm.dayPartId && x.networkId == selectedProperty.networkId);
            if (indexArc < 0) {
                DPData.push(objDP);
            }
        }
    });
    DPData.sort(function (a, b) {
        return a.dayPart.localeCompare(b.dayPart);
    });
    var filteredDpProperties = allProperties.filter(o => o.networkId == selectedProperty.networkId);
    for (var x = 0; x < filteredDpProperties.length; x++) {
        for (var y = 1; y <= 14; y++) {
            var WkNum = y > 9 ? y : "0" + y;
            var CurSpot = filteredDpProperties[x]["wk" + WkNum + "Spots"];
            if (CurSpot != null && CurSpot != undefined && CurSpot != '' && parseInt(CurSpot) > 0) {
                TotalSpots = parseInt(TotalSpots) + parseInt(CurSpot);
                for (var m = 0; m < DPData.length; m++) {
                    if (filteredDpProperties[x].dayPartDesc == DPData[m].dayPart) {
                        DPData[m].totalSpots = parseInt(DPData[m].totalSpots) + parseInt(CurSpot);
                    }
                }
            }
        }
    }
    for (var k = 0; k < DPData.length; k++) {
        if (DPData[k].totalSpots > 0) {
            DPData[k].percVal = FormatNumber((parseFloat((parseFloat(DPData[k].totalSpots) / parseFloat(TotalSpots))).toFixed(2) * 100), "decimalpercentagezero", 0);
        }
    }
    BindDayPartPercentageForEdit(DPData.filter(o => o.totalSpots > 0));

}
function BindDayPartPercentageForEdit(lstDayPart) {
    var HTMLDayPart = '';
    if (lstDayPart != null && lstDayPart != undefined && lstDayPart.length > 0) {
        if (lstDayPart.length > 4) {
            for (var z = 0; z < 4; z++) {
                HTMLDayPart += '<tr>';
                if (lstDayPart[z + 4] != null && lstDayPart[z + 4] != undefined) {
                    HTMLDayPart += '<td id="tdDay" style="width:50%!important;">';
                    HTMLDayPart += '<label for="" style="font-size: 16px;font-weight: bold;float:right;margin-left: 5px!important;margin-bottom:-5px;">' + lstDayPart[z + 4].dayPart + ': <span style="font-weight:400">' + FormatNumber(lstDayPart[z + 4].percVal, 'decimalpercentagezero', 0) + '</span></label>';
                    HTMLDayPart += '</td>';
                    HTMLDayPart += '<td id="tdDay" style="width:50%!important;">';
                    HTMLDayPart += '<label for="" style="font-size: 16px;font-weight: bold;float:right;margin-left: 5px!important;margin-bottom:-5px;">' + lstDayPart[z].dayPart + ': <span style="font-weight:400">' + FormatNumber(lstDayPart[z].percVal, 'decimalpercentagezero', 0) + '</span></label>';
                    HTMLDayPart += '</td>';
                }
                else {
                    HTMLDayPart += '<td id="tdDay" style="width:50%!important;">';
                    HTMLDayPart += '<label for="" style="font-size: 16px;font-weight: bold;float:right;margin-left: 5px!important;margin-bottom:-5px;"></span></label>';
                    HTMLDayPart += '</td>';
                    HTMLDayPart += '<td id="tdDay" style="width:50%!important;">';
                    HTMLDayPart += '<label for="" style="font-size: 16px;font-weight: bold;float:right;margin-left: 5px!important;margin-bottom:-5px;">' + lstDayPart[z].dayPart + ': <span style="font-weight:400">' + FormatNumber(lstDayPart[z].percVal, 'decimalpercentagezero', 0) + '</span></label>';
                    HTMLDayPart += '</td>';
                }
                HTMLDayPart += '</tr>';
            }
        } else {
            for (var z = 0; z < lstDayPart.length; z++) {
                HTMLDayPart += '<tr>';

                HTMLDayPart += '<td id="tdDay" style="width:50%!important;">';
                HTMLDayPart += '<label for="" style="font-size: 16px;font-weight: bold;float:right;margin-left: 5px!important;margin-bottom:-5px;">' + lstDayPart[z].dayPart + ': <span style="font-weight:400">' + FormatNumber(lstDayPart[z].percVal, 'decimalpercentagezero', 0) + '</span></label>';
                HTMLDayPart += '</td>';
                HTMLDayPart += '</tr>';
            }
        }
    }
    var hasWKlySpots = false;
    for (var j = 1; j <= 14; j++) {
        var CalcWkNum = j > 9 ? j : "0" + j;
        var spotsForWk = mediaPlanEditSelectedProperty["wk" + CalcWkNum + "Spots"];
        if (spotsForWk > 0) {
            hasWKlySpots = true;
            break;
        }
    }
    if (hasWKlySpots) {
        $("#tbDayPartLongPlanEdit").html(HTMLDayPart);
    }
    else {
        $("#tbDayPartLongPlanEdit").html("");
    }

}
function PopulateEditPropertyControls(property) {
    $("#ddlMpPropertyEditPlanYear").append("<option value=" + property.planYear + " selected>" + property.planYear + "</option>");
    $("#ddlMpPropertyEditPlanYear").attr("disabled", "disabled");
    $("#ddlMpPropertyEditQuarter").append("<option value=" + property.quarterName + " selected>" + property.quarterName + "</option>");
    $("#ddlMpPropertyEditQuarter").attr("disabled", "disabled");
    if (property.isPlaceHolder) {
        $("#propddlLabelEdit").html("");
    }
    else {
        var propertyHtml = property.mediaPlanPropertyName + "&nbsp &nbsp &nbsp &nbsp|&nbsp &nbsp &nbsp &nbsp" + property.startTime + "-" + property.endTime + "&nbsp &nbsp &nbsp|&nbsp &nbsp &nbsp" + property.dp + "&nbsp &nbsp &nbsp|&nbsp &nbsp &nbsp" + property.dow + "&nbsp &nbsp &nbsp|&nbsp &nbsp &nbsp" + property.spotLen + "&nbsp &nbsp &nbsp|&nbsp &nbsp &nbsp" + (Number(property.rateAmount)).toLocaleString('en-US', { style: 'currency', currency: 'USD', }) + "&nbsp &nbsp &nbsp|&nbsp &nbsp &nbsp" + (Number(property.impressions)).toLocaleString('en-US', { style: 'currency', currency: 'USD', }) + "&nbsp &nbsp &nbsp|&nbsp &nbsp &nbsp" + property.status;
        $("#propddlLabelEdit").html(propertyHtml);
    }
    $("#propddlLabelEdit").css({ "background-color": "#e9ecef", "cursor": "not-allowed" });
    $("#ddlMpPropertyEditDemos").append("<option value=" + property.demoName + " selected>" + property.demoName + "</option>");
    $("#ddlMpPropertyEditDemos").attr("disabled", "disabled");
    if (property.isPlaceHolder == 1) {
        $("#txtAdjustRatesEdit").val("");
        $("#txtAdjustRatesEdit").prop("disabled", true);
        $("#txtAdjustImpsEdit").val("");
        $("#txtAdjustImpsEdit").prop("disabled", true);
    }
    else {
        var savedAdjustedRates = property.adjustedRatesPerc == 0 ? null : ((property.adjustedRatesPerc > 0) ? "+" + property.adjustedRatesPerc + "%" : property.adjustedRatesPerc + "%");
        $("#txtAdjustRatesEdit").val(savedAdjustedRates);
        if (savedAdjustedRates != null) {
            $("#txtAdjustRatesEdit").css("color", "#2971B9");
            rateTextColor = "#2971B9";
            $("#icoRatesEdit").show();
        }
        var savedAdjustedImps = property.adjustedImpsPerc == 0 ? null : ((property.adjustedImpsPerc > 0) ? "+" + property.adjustedImpsPerc + "%" : property.adjustedImpsPerc + "%");
        $("#txtAdjustImpsEdit").val(savedAdjustedImps);
        if (savedAdjustedImps != null) {
            $("#txtAdjustImpsEdit").css("color", "#2971B9");
            impsTextColor = "#2971B9";
            $("#icoImpsEdit").show();
        }
    }
}

function PopulatedEditPropertyHeader(property) {
    var wk14 = (property.wk14_Date == null) ? " " : property.wk14_Date;
    var markup = '<tr class="summary-header-row">' +
        '<th scope="col" style="color:white;font-weight:bold;width:700px;max-width:700px;border-right:1px solid white;text-transform: capitalize; text-align:left;">Property Name</th>' +
        '<th scope="col" style="color:white;font-weight:bold;width:50px;max-width:100px;border-right:1px solid white;text-transform: capitalize;text-align:left;">DP</th>' +
        '<th scope="col" style="color:white;font-weight:bold;width:50px;max-width:100px;border-right:1px solid white;text-transform: capitalize;text-align:left;">BT</th>' +
        '<th scope="col" style="color:white;font-weight:bold;width:40px;max-width:100px;border-right:1px solid white;text-transform: capitalize;text-align:right;">Len.</th>' +
        '<th scope="col" style="color:white;font-weight:bold;width:130px;max-width:150px;border-right:1px solid white;text-transform: capitalize;text-align:right;">Rate</th>' +
        '<th scope="col" style="color:white;font-weight:bold;width:130px;max-width:150px;border-right:1px solid white;text-transform: capitalize;text-align:right;">IMP</th>' +
        '<th scope="col" style="color:white;font-weight:bold;width:130px;max-width:150px;border-right:1px solid white;text-transform: capitalize;text-align:right;">CPM</th>';
    markup += '<th scope="col" style="color:white;font-weight:bold;width:60px;max-width:80px;border-right:1px solid white;text-transform: capitalize;text-align:right;padding-right: 5px;">' + property.wk01_Date + '</th>'
    markup += '<th scope="col" style="color:white;font-weight:bold;width:60px;max-width:80px;border-right:1px solid white;text-transform: capitalize;text-align:right;padding-right: 5px;">' + property.wk02_Date + '</th>'
    markup += '<th scope="col" style="color:white;font-weight:bold;width:60px;max-width:80px;border-right:1px solid white;text-transform: capitalize;text-align:right;padding-right: 5px;">' + property.wk03_Date + '</th>'
    markup += '<th scope="col" style="color:white;font-weight:bold;width:60px;max-width:80px;border-right:1px solid white;text-transform: capitalize;text-align:right;padding-right: 5px;">' + property.wk04_Date + '</th>'
    markup += '<th scope="col" style="color:white;font-weight:bold;width:60px;max-width:80px;border-right:1px solid white;text-transform: capitalize;text-align:right;padding-right: 5px;">' + property.wk05_Date + '</th>'
    markup += '<th scope="col" style="color:white;font-weight:bold;width:60px;max-width:80px;border-right:1px solid white;text-transform: capitalize;text-align:right;padding-right: 5px;">' + property.wk06_Date + '</th>'
    markup += '<th scope="col" style="color:white;font-weight:bold;width:60px;max-width:80px;border-right:1px solid white;text-transform: capitalize;text-align:right;padding-right: 5px;">' + property.wk07_Date + '</th>'
    markup += '<th scope="col" style="color:white;font-weight:bold;width:60px;max-width:80px;border-right:1px solid white;text-transform: capitalize;text-align:right;padding-right: 5px;">' + property.wk08_Date + '</th>'
    markup += '<th scope="col" style="color:white;font-weight:bold;width:60px;max-width:80px;border-right:1px solid white;text-transform: capitalize;text-align:right;padding-right: 5px;">' + property.wk09_Date + '</th>'
    markup += '<th scope="col" style="color:white;font-weight:bold;width:60px;max-width:80px;border-right:1px solid white;text-transform: capitalize;text-align:right;padding-right: 5px;">' + property.wk10_Date + '</th>'
    markup += '<th scope="col" style="color:white;font-weight:bold;width:60px;max-width:80px;border-right:1px solid white;text-transform: capitalize;text-align:right;padding-right: 5px;">' + property.wk11_Date + '</th>'
    markup += '<th scope="col" style="color:white;font-weight:bold;width:60px;max-width:80px;border-right:1px solid white;text-transform: capitalize;text-align:right;padding-right: 5px;">' + property.wk12_Date + '</th>'
    markup += '<th scope="col" style="color:white;font-weight:bold;width:60px;max-width:80px;border-right:1px solid white;text-transform: capitalize;text-align:right;padding-right: 5px;">' + property.wk13_Date + '</th>'
    if (wk14 != " ") {
        markup += '<th scope="col" style="color:white;font-weight:bold;width:60px;max-width:80px;border-right:1px solid white;text-transform: capitalize;text-align:right;padding-right: 5px;">' + wk14 + '</th>';
    }
    $("#thmpLongPlanNetworkEdit").html(markup).show();
}

function SetPlaceHolderPropertyNameForEdit(ctrl) {
    if (event.relatedTarget.id == "btnCancelmpLongPlanNetworkModal") {
        return false;
    }
    if ($(ctrl).val().trim() == "") {
        if (!swal.isVisible()) {
            swal({
                html: "Placeholder name cannot be blank.",
                type: 'warning',
            });
        }
        $(ctrl).focus();
        return false;
    }
    else {
        mediaPlanEditSelectedProperty.mediaPlanPropertyName = $(ctrl).val().trim();
    }
    $("#spnPropertyNameEdit").html(mediaPlanEditSelectedProperty.mediaPlanPropertyName);
    $("#txtPropertyNameForEdit").html(mediaPlanEditSelectedProperty.mediaPlanPropertyName);
    $("#txtPropertyNameForEdit").hide();
    $("#spnPropertyNameEdit").show();
}
function PopulateEditPropertyTable(property) {
    $("#tbmpLongPlanNetworkEdit").html("");
    curAdjustedRates = property.adjustedRatesPerc;
    curAdjustedImps = property.adjustedImpsPerc;
    var wk14 = (property.wk14_Date == null) ? " " : property.wk14_Date;
    var HTML = "";
    if (property.spotLen == 15) {
        HTML += '<tr class="per15row" id="row-15percent" style="display:none;">';
        HTML += '<td style="text-align:left;font-weight:bold;">Percentage of :15s</td>';
        HTML += '<td style="text-align:left;"></td>';
        HTML += '<td style="text-align:left;"></td>';
        HTML += '<td></td>';
        HTML += '<td></td>';
        HTML += '<td></td>';
        HTML += '<td></td>';
        HTML += '<td style="padding-left: 1px; padding-right:1px;" id="td15swk01EditSpots">' + (Perc15SecData["wk01Spots"] > 0 ? FormatNumber(Perc15SecData["wk01Spots"], "decimalpercentage", 2) : '') + '</td>';
        HTML += '<td style="padding-left: 1px; padding-right:1px;" id="td15swk02EditSpots">' + (Perc15SecData["wk02Spots"] > 0 ? FormatNumber(Perc15SecData["wk02Spots"], "decimalpercentage", 2) : '') + '</td>';
        HTML += '<td style="padding-left: 1px; padding-right:1px;" id="td15swk03EditSpots">' + (Perc15SecData["wk03Spots"] > 0 ? FormatNumber(Perc15SecData["wk03Spots"], "decimalpercentage", 2) : '') + '</td>';
        HTML += '<td style="padding-left: 1px; padding-right:1px;" id="td15swk04EditSpots">' + (Perc15SecData["wk04Spots"] > 0 ? FormatNumber(Perc15SecData["wk04Spots"], "decimalpercentage", 2) : '') + '</td>';
        HTML += '<td style="padding-left: 1px; padding-right:1px;" id="td15swk05EditSpots">' + (Perc15SecData["wk05Spots"] > 0 ? FormatNumber(Perc15SecData["wk05Spots"], "decimalpercentage", 2) : '') + '</td>';
        HTML += '<td style="padding-left: 1px; padding-right:1px;" id="td15swk06EditSpots">' + (Perc15SecData["wk06Spots"] > 0 ? FormatNumber(Perc15SecData["wk06Spots"], "decimalpercentage", 2) : '') + '</td>';
        HTML += '<td style="padding-left: 1px; padding-right:1px;" id="td15swk07EditSpots">' + (Perc15SecData["wk07Spots"] > 0 ? FormatNumber(Perc15SecData["wk07Spots"], "decimalpercentage", 2) : '') + '</td>';
        HTML += '<td style="padding-left: 1px; padding-right:1px;" id="td15swk08EditSpots">' + (Perc15SecData["wk08Spots"] > 0 ? FormatNumber(Perc15SecData["wk08Spots"], "decimalpercentage", 2) : '') + '</td>';
        HTML += '<td style="padding-left: 1px; padding-right:1px;" id="td15swk09EditSpots">' + (Perc15SecData["wk09Spots"] > 0 ? FormatNumber(Perc15SecData["wk09Spots"], "decimalpercentage", 2) : '') + '</td>';
        HTML += '<td style="padding-left: 1px; padding-right:1px;" id="td15swk10EditSpots">' + (Perc15SecData["wk10Spots"] > 0 ? FormatNumber(Perc15SecData["wk10Spots"], "decimalpercentage", 2) : '') + '</td>';
        HTML += '<td style="padding-left: 1px; padding-right:1px;" id="td15swk11EditSpots">' + (Perc15SecData["wk11Spots"] > 0 ? FormatNumber(Perc15SecData["wk11Spots"], "decimalpercentage", 2) : '') + '</td>';
        HTML += '<td style="padding-left: 1px; padding-right:1px;" id="td15swk12EditSpots">' + (Perc15SecData["wk12Spots"] > 0 ? FormatNumber(Perc15SecData["wk12Spots"], "decimalpercentage", 2) : '') + '</td>';
        HTML += '<td style="padding-left: 1px; padding-right:1px;" id="td15swk13EditSpots">' + (Perc15SecData["wk13Spots"] > 0 ? FormatNumber(Perc15SecData["wk13Spots"], "decimalpercentage", 2) : '') + '</td>';
        if (wk14 != " ") {
            HTML += '<td style="padding-left: 1px; padding-right:1px;" id="td15swk14EditSpots">' + (Perc15SecData["wk13Spots"] > 0 ? FormatNumber(Perc15SecData["wk13Spots"], "decimalpercentage", 2) : '') + '</td>';
        }
        HTML += '</tr>';
    }

    if (property.isPlaceHolder) {
        HTML += '<tr id="tr_' + property.rateId + '" class="placeholder" style="font-weight:bold;" id="row-' + 0 + '" data-rid="' + property.rateId + '">';
        HTML += '<td onclick="return TogglePropertyNameForEdit()" class="clickable" id="txtPlaceholder1" style="text-align:left;">';
        HTML += '<span id="spnPropertyNameEdit">' + property.mediaPlanPropertyName + '</span> ';
        HTML += '<input autocomplete="off" type"text" id="txtPropertyNameForEdit" value="' + property.mediaPlanPropertyName + '" onblur="SetPlaceHolderPropertyNameForEdit(this);" style="display:none;width:80%"/>';
        HTML += '<td style="text-align:left;"><select id="ddlDPForEdit" onchange="SetDayPart(this)"></select></td>';
        HTML += '<td style="text-align:left;"><select id="ddlDPBuyTypeCodeForEdit" onchange="SetBuyType(this,\'onchange\')"></select></td>';
        HTML += '<td><select id="ddlSpotLenForEdit" onchange="SetSpotLen(this)"></select></td>';
        HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" id="txtRateForEdit" class="numeric" onkeydown="return MoveFocus(this,event);" onkeyup="return ValidatePlaceholderInputs(this,\'rates\', \'edit\');" onchange="return CheckInputData(this,\'rates\', \'edit\');" oninput=\"this.value=appendDollarSignToInput(this.value, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])\" value="' + (property.rateAmount > 0 ? $.fn.dataTable.render.number(',', '.', 2, '$').display(property.rateAmount) : "$" + 0.00) + '" row="' + 0 + '" col="01" data-pid="' + property.mediaPlanPropertyId + '" style="width: 126px;text-align:right;" /></td>';
        HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" id="txtImpsForEdit" class="numeric" onkeydown="return MoveFocus(this,event);" onkeyup="return ValidatePlaceholderInputs(this,\'imps\', \'edit\');" onchange="return CheckInputData(this,\'imps\', \'edit\');" col="01" data-pid="" data-rid=""    data-len="" style="width: 126px;text-align:right;" value="' + (property.impressions > 0 ? $.fn.dataTable.render.number(',', '.', 2, '').display(property.impressions) : 0.00) + '"/></td>';
        HTML += '<td id="txtCPMForEdit">' + (property.cpm > 0 ? $.fn.dataTable.render.number(',', '.', 2, '$').display(property.cpm) : 0.00) + '</td>';
    }
    else {
        HTML += '<tr id="tr_' + property.rateId + '" class="clsProperties" style="font-weight:bold;" id="row-' + 0 + '" data-rid="' + property.rateId + '">';
        HTML += '<td style="text-align:left;">' + property.mediaPlanPropertyName + '</td>';
        HTML += '<td style="text-align:left;">' + property.dp + '</td>';
        HTML += '<td style="text-align:left;">' + property.buyTypeCode + '</td>';
        HTML += '<td>' + ':' + property.spotLen + '</td>';
        HTML += '<td style="color:' + rateTextColor + '">' + $.fn.dataTable.render.number(',', '.', 2, '$').display(property.rateAmount) + '</td>';
        HTML += '<td style="color:' + impsTextColor + '">' + $.fn.dataTable.render.number(',', '.', 2, '').display(property.impressions) + '</td>';
        HTML += '<td style="color:' + cpmTextColor + '">' + $.fn.dataTable.render.number(',', '.', 2, '$').display(property.cpm) + '</td>';
    }

    HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" class="numeric" onkeydown="return ValidateNumber(this,event);"  onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');" onchange="CalculatePercentagesForEdit(this);"   id="txtxSpots_' + 1 + '" row="' + 0 + '" col="01"  data-dp="' + property.dp + '"  data-pid="' + property.mediaPlanPropertyId + '"  data-rid="' + property.rateId + '"   data-len="' + property.spotLen + '" style="width: 58px;text-align:right;" value="' + SetSpotVal(property.wk01Spots) + '"/></td>';
    HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);"    class="numeric" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');" onchange="CalculatePercentagesForEdit(this);" id="txtxSpots_' + 2 + '" row="' + 0 + '" col="02"  data-dp="' + property.dp + '"  data-pid="' + property.mediaPlanPropertyId + '"  data-rid="' + property.rateId + '"   data-len="' + property.spotLen + '" style="width: 58px;text-align:right;"  value="' + SetSpotVal(property.wk02Spots) + '"/></td>';
    HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);"    class="numeric" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');" onchange="CalculatePercentagesForEdit(this);" id="txtxSpots_' + 3 + '" row="' + 0 + '" col="03"  data-dp="' + property.dp + '"  data-pid="' + property.mediaPlanPropertyId + '"  data-rid="' + property.rateId + '"   data-len="' + property.spotLen + '" style="width: 58px;text-align:right;"  value="' + SetSpotVal(property.wk03Spots) + '"/></td>';
    HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);"    class="numeric" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');" onchange="CalculatePercentagesForEdit(this);" id="txtxSpots_' + 4 + '" row="' + 0 + '" col="04"  data-dp="' + property.dp + '"  data-pid="' + property.mediaPlanPropertyId + '"  data-rid="' + property.rateId + '"   data-len="' + property.spotLen + '" style="width: 58px;text-align:right;"  value="' + SetSpotVal(property.wk04Spots) + '"/></td>';
    HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);"    class="numeric" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');" onchange="CalculatePercentagesForEdit(this);" id="txtxSpots_' + 5 + '" row="' + 0 + '" col="05"  data-dp="' + property.dp + '"  data-pid="' + property.mediaPlanPropertyId + '"  data-rid="' + property.rateId + '"   data-len="' + property.spotLen + '" style="width: 58px;text-align:right;"  value="' + SetSpotVal(property.wk05Spots) + '"/></td>';
    HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);"    class="numeric" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');" onchange="CalculatePercentagesForEdit(this);" id="txtxSpots_' + 6 + '" row="' + 0 + '" col="06"  data-dp="' + property.dp + '"  data-pid="' + property.mediaPlanPropertyId + '"  data-rid="' + property.rateId + '"   data-len="' + property.spotLen + '" style="width: 58px;text-align:right;"  value="' + SetSpotVal(property.wk06Spots) + '"/></td>';
    HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);"    class="numeric" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');" onchange="CalculatePercentagesForEdit(this);" id="txtxSpots_' + 7 + '" row="' + 0 + '" col="07"  data-dp="' + property.dp + '"  data-pid="' + property.mediaPlanPropertyId + '"  data-rid="' + property.rateId + '"   data-len="' + property.spotLen + '" style="width: 58px;text-align:right;"  value="' + SetSpotVal(property.wk07Spots) + '"/></td>';
    HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);"    class="numeric" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');" onchange="CalculatePercentagesForEdit(this);" id="txtxSpots_' + 8 + '" row="' + 0 + '" col="08"  data-dp="' + property.dp + '"  data-pid="' + property.mediaPlanPropertyId + '"  data-rid="' + property.rateId + '"   data-len="' + property.spotLen + '" style="width: 58px;text-align:right;"  value="' + SetSpotVal(property.wk08Spots) + '"/></td>';
    HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);"    class="numeric" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');" onchange="CalculatePercentagesForEdit(this);" id="txtxSpots_' + 9 + '" row="' + 0 + '" col="09"  data-dp="' + property.dp + '"  data-pid="' + property.mediaPlanPropertyId + '"  data-rid="' + property.rateId + '"   data-len="' + property.spotLen + '" style="width: 58px;text-align:right;"  value="' + SetSpotVal(property.wk09Spots) + '"/></td>';
    HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);"    class="numeric" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');" onchange="CalculatePercentagesForEdit(this);" id="txtxSpots_' + 10 + '" row="' + 0 + '" col="10"  data-dp="' + property.dp + '"  data-pid="' + property.mediaPlanPropertyId + '"  data-rid="' + property.rateId + '"   data-len="' + property.spotLen + '" style="width: 58px;text-align:right;"  value="' + SetSpotVal(property.wk10Spots) + '"/></td>';
    HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);"    class="numeric" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');" onchange="CalculatePercentagesForEdit(this);" id="txtxSpots_' + 11 + '" row="' + 0 + '" col="11"  data-dp="' + property.dp + '"  data-pid="' + property.mediaPlanPropertyId + '"  data-rid="' + property.rateId + '"   data-len="' + property.spotLen + '" style="width: 58px;text-align:right;"  value="' + SetSpotVal(property.wk11Spots) + '"/></td>';
    HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);"    class="numeric" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');" onchange="CalculatePercentagesForEdit(this);" id="txtxSpots_' + 12 + '" row="' + 0 + '" col="12"  data-dp="' + property.dp + '"  data-pid="' + property.mediaPlanPropertyId + '"  data-rid="' + property.rateId + '"   data-len="' + property.spotLen + '" style="width: 58px;text-align:right;"  value="' + SetSpotVal(property.wk12Spots) + '"/></td>';
    HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" onkeydown="return ValidateNumber(this,event);"    class="numeric" onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');" onchange="CalculatePercentagesForEdit(this);" id="txtxSpots_' + 13 + '" row="' + 0 + '" col="13"  data-dp="' + property.dp + '"  data-pid="' + property.mediaPlanPropertyId + '"  data-rid="' + property.rateId + '"   data-len="' + property.spotLen + '" style="width: 58px;text-align:right;"  value="' + SetSpotVal(property.wk13Spots) + '"/></td>';
    if (wk14 != " ") {
        HTML += '<td style="padding-left: 1px; padding-right:1px;"> <input autocomplete="off" type="text" class="numeric" onkeydown="return ValidateNumber(this,event);"   onkeyup="ValidateSpots(this,\'' + "weeklySpots" + '\');" onchange="CalculatePercentagesForEdit(this);" id="txtxSpots_' + 14 + '" row="' + 0 + '" col="14" data-pid="' + property.mediaPlanPropertyId + '" data-rid="' + property.rateId + '"  data-dp="' + property.dp + '"  data-len="' + property.spotLen + '" style="width: 58px;text-align:right;" value="' + SetSpotVal(property.wk14Spots) + '"/></td>';
    }
    HTML += '</tr>';
    setTimeout(function () {
        PopulateDayPartForEdit();
    }, 100);
    setTimeout(function () {
        PopulateBuyTypeForEdit();
    }, 200);
    setTimeout(function () {
        PopulateLengthForEdit();
    }, 300);

    $("#tbmpLongPlanNetworkEdit").html(HTML);
    setTimeout(function () {
        SetBuyType(property.buyTypeId, "default");
    }, 400);
}
function TogglePropertyNameForEdit() {
    $("#spnPropertyNameEdit").hide();
    $("#txtPropertyNameForEdit").show();
    $("#txtPropertyNameForEdit").focus();
}
function PopulateBuyTypeForEdit() {

    $.ajax({
        url: "/MediaPlan/GetMediaPlanBuyTypes",
        data: {
            "BuyTypeGroup": $("#hdnBTGroupName").val()
        },
        cache: false,
        type: "GET",
        success: function (result) {
            var markup = "";
            for (var x = 0; x < result.length; x++) {
                if (mediaPlanEditSelectedProperty.buyTypeId == result[x].value) {
                    markup += "<option selected value=" + result[x].value + ">" + result[x].text + "</option>";
                }
                else {
                    markup += "<option value=" + result[x].value + ">" + result[x].text + "</option>";
                }
            }
            $("#ddlDPBuyTypeCodeForEdit").html(markup).show();

        },
        error: function (response) {
            swal('Ooops ...', 'Error Populating Buy Types:  ' + response, 'error');
        }
    });
}
function PopulateDayPartForEdit() {
    $.ajax({
        url: "/MediaPlan/GetMediPlanDayPart",
        data: {
            "BuyTypeGroup": $("#hdnBTGroupName").val()
        },
        cache: false,
        type: "GET",
        success: function (result) {

            var markup = "";
            for (var x = 0; x < result.length; x++) {
                if (mediaPlanEditSelectedProperty.dayPartId == result[x].value) {
                    markup += "<option selected value=" + result[x].value + ">" + result[x].text + "</option>";
                }
                else {
                    markup += "<option value=" + result[x].value + ">" + result[x].text + "</option>";
                }
            }
            $("#ddlDPForEdit").html(markup).show();
        },
        error: function (response) {
            swal('Ooops ...', 'Error Populating Buy Types:  ' + response, 'error');
        }
    });
}
function PopulateLengthForEdit() {
    var spotLen = [];
    var markup = "";
    if (parseFloat($("#hdn15SecPerc").val()) > 0)
        spotLen = [{ "value": "30", "text": ":30" }, { "value": "15", "text": ":15" }, { "value": "60", "text": ":60" }, { "value": "120", "text": ":120" }];
    else
        spotLen = [{ "value": "30", "text": ":30" }, { "value": "60", "text": ":60" }, { "value": "120", "text": ":120" }];
    for (var x = 0; x < spotLen.length; x++) {
        if (mediaPlanEditSelectedProperty.spotLen == spotLen[x].value) {
            markup += "<option selected value=" + spotLen[x].value + ">" + spotLen[x].text + "</option>";
        }
        else {
            markup += "<option value=" + spotLen[x].value + ">" + spotLen[x].text + "</option>";
        }
    }
    $("#ddlSpotLenForEdit").append(markup);
}
$('#mpPropertyEditModal').on('hide.bs.modal', function (e) {
    $("#tbmpLongPlanNetwork").html("");
    var valueForTotalSpots = 0;
    if (!mediaPlanEditSelectedProperty.isPlaceHolder) {
        $(".clsProperties input[type=text]").each(function () {
            if ($(this).val() != "") {
                valueForTotalSpots += parseInt($(this).val());
            }

        });
    }
    else {
        $(".placeholder input[type=text]").each(function () {
            if (($(this).attr("id") != "txtPropertyNameForEdit" && $(this).attr("id") != "txtRateForEdit" && $(this).attr("id") != "txtImpsForEdit") && $(this).val() != "") {
                valueForTotalSpots += parseInt($(this).val());
            }
        });
    }

    var selectedProperty = BTGroupsSummaryJSON.lstProperties.filter(p => p.mediaPlanPropertyId == mediaPlanEditSelectedProperty.mediaPlanPropertyId)[0];

    if (valueForTotalSpots == selectedProperty.totalSpots) {
        $('#mpPropertyEditModal').modal('hide');
    }
    else {
        $('#mpPropertyEditModal').modal('show');
        e.stopPropagation();
        swal({
            title: "",
            html: 'You have unsaved changes. Are you sure you want to close the window?',
            type: 'warning',
            showCancelButton: true,
            width: 458,
            height: 302,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'No',
            confirmButtonText: 'Yes',
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            reverseButtons: true,
            preConfirm: function () {
                return new Promise(function (resolve) {
                    setTimeout(function () {
                        resolve();
                    }, 50);
                });
            }
        }).then(
            function (result) {
                $('#mpPropertyEditModal').modal('hide');
                location.reload();
            }, function (dismiss) {
                $('#mpPropertyEditModal').modal('show');
            }
        );
    }
})

function ValidateEditPlaceHolderData() {
    isValidEditPlaceHolderEntries = true;
    if ($("#txtPropertyNameForEdit").val() == "") {
        isValidEditPlaceHolderEntries = false;
        editPlaceHolderValidationMessage = "Placeholder property name cannot be blank.";
    }
    if ((mediaPlanEditSelectedProperty.buyTypeId == 1 || mediaPlanEditSelectedProperty.buyTypeId == 9) && (mediaPlanEditSelectedProperty.rateAmount > 0 || mediaPlanEditSelectedProperty.impressions > 0)) {
        isValidEditPlaceHolderEntries = false;
        editPlaceHolderValidationMessage = "Placeholder property with buytype ADU & Mirror cannot have values other than zero in rates and impressions.";
    }
    if ((mediaPlanEditSelectedProperty.buyTypeId == 3) && (mediaPlanEditSelectedProperty.rateAmount > 0)) {
        isValidEditPlaceHolderEntries = false;
        editPlaceHolderValidationMessage = "Placeholder property with buytype Bonus cannot have values other than zero in rates.";
    }
    if ($("#txtRateForEdit").val() == "" || $("#txtImpsForEdit").val() == "") {
        isValidEditPlaceHolderEntries = false;
        editPlaceHolderValidationMessage = "Placeholder property must contain the day part, buytype, spot length, rate and Impressions for each record.";
    }
    return isValidEditPlaceHolderEntries;
}
function LongPlanEditCancel() {
    $('#mpPropertyEditModal').modal('hide');
}
function LongPlanEditReload() {
    window.location.reload();
}


//ST-1180
function GetWeeklyBudget(planType) {
    var mediaPlanId = parseInt($("#hdnMediaPlanId").val());
    $.ajax({
        url: "/MediaPlan/GetWeeklyBudget",
        data: {
            "mediaPlanId": mediaPlanId
        },
        cache: false,
        type: "GET",
        success: function (result) {
            if (planType.toString().toLowerCase() == "quickplan") {
                $("#spnWeeklyBudgetQuickPlan").html($.fn.dataTable.render.number(',', '.', 0, '$').display(result.responseCode));
            }
            else {
                $("#spnWeekluBudget").html($.fn.dataTable.render.number(',', '.', 0, '$').display(result.responseCode));
            }

        },
        error: function (response) {
            swal('Ooops ...', 'Error Populating Buy Types:  ' + response, 'error');
        }
    });

}