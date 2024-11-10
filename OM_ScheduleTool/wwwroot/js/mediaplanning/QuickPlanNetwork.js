var curAdjustedRates = 0.0;
var PrevAdjustedRates = 0.0;

var curAdjustedImps = 0.0;
var PrevAdjustedImps = 0.0;

var IsRateAdjusted = false;
var rateTextColor = "#575757";
var impsTextColor = "#575757";
var cpmTextColor = "#575757";

var curYear;
var FirstYear;
var curDemo;
var curBuyType;
var globalQuartersQuickPlan = [];
var defaultQuarterIdQuickPlan;
var globalQuickPlanVal;
var defaultQuarter;
var curQuarter;

var globalNetworkIdQuickPlan;
var globalNetworkNameQuickPlan;

var rate30Sec = 0;
var rate15Sec = 0;
var impressions = 0;
var percentSelectedOnCreate = 0;

var SelPlanYear = $('#ddlMediaPlanQuickPlanYears').val();
var selBuyTypeId = 0;
var curBuyTypeId = 0;
var CanCloseForm = true;
$(document).ready(function () {

    $('.modal.draggable>.modal-dialog').draggable({
        cursor: 'move',
        handle: '.modal-header'
    });
    $('.modal.draggable>.modal-dialog>.modal-content>.modal-header').css('cursor', 'move');
    $("#ddlMediaPlanQuickPlanYears").val($("#hdnPlanYear").val());
    curYear = $("#ddlMediaPlanQuickPlanYears").val();
    FirstYear = $("#ddlMediaPlanQuickPlanYears").val();

    CanCloseForm = true;
    $('#ddlMediaPlanQuickPlanBuyType, #ddlMediaPlanQuickPlanYears, #ddlMediaPlanQuickPlanQuarter, #ddlMediaPlanQuickPlanDemo').on('change', function () {
        GetQuickPlanDetails();
    });
});

$(document).on("click", function (e) {
    if (e.target.id == "btnSaveAndCloseQuickPlan" || e.target.className == "fa fa-angle-down") {
        $(".mpQuickPlanNetwork-DropdownContent").toggle();
    }
    else {
        $(".mpQuickPlanNetwork-DropdownContent").hide();
    }
});


function OpenQuickPlan(networkId, networkName, reload) {
    ClearFormData('initialLoad');
    $("#spnQuickPlanNoDataMsg").hide();
    var QPheading = "Quick Plan " + networkName + " (" + $("#hdnBTGroupName").val() + ")";
    $("#mpQuickPlanNetworkHeading").html(QPheading);
    $("#txt30SecSpots").attr("disabled", true);
    $("#txt15SecSpots").attr("disabled", true);
    var mediaPlanId = $("#hdnMediaPlanId").val();
    $.ajax({
        url: "/MediaPlan/MediaPlanCheckLock/",
        data: {
            MediaPlanId: mediaPlanId,
            Action: "openquickplan"
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
                rateTextColor = "#575757";
                impsTextColor = "#575757";
                curAdjustedImps = 0.00;
                PrevAdjustedImps = 0.00;
                curAdjustedRates = 0.00;
                PrevAdjustedRates = 0.00;
                globalNetworkIdQuickPlan = networkId;
                globalNetworkNameQuickPlan = networkName;

                $("#ddlMediaPlanQuickPlanYears").val($("#hdnPlanYear").val());
                FirstYear = $("#ddlMediaPlanQuickPlanYears").val()

                curYear = $("#ddlMediaPlanQuickPlanYears").val();
                if (FirstYear != null && FirstYear != undefined && FirstYear != '' && curYear != FirstYear) {
                    curYear = FirstYear;
                    $("#ddlMediaPlanQuickPlanYears").val(FirstYear);
                }

                QuickMediaPlanGetQuarters($("#ddlMediaPlanQuickPlanYears").val());
                $('#mpQuickPlanNetworkModal').modal('show');
                GetWeeklyBudget("quickplan");
            }
        },
        error: function (response) {
            var err = response.result;
        }
    });
}

function ValidateCancelQuickPlan(ctrl) {
    ClearFormData('cancel');
    $('#mpQuickPlanNetworkModal').modal('hide');
}
function ClearFormData(clearType) {
    globalQuickPlanVal = null;
    curBuyTypeId = 0;
    $("#icoRatesQuickPlan").hide();
    $("#icoImpsQuickPlan").hide();
    $("#txtAdjustRatesQuickPlan").val('');
    $("#txtAdjustImpsQuickPlan").val('');
    //$("#ddlMediaPlanQuickPlanDemo").val('');    
    $("#spn30SecAvgRates").html('');
    $("#spnIMPS").html('');
    $("#spn15SecAvgRates").html('');
    $("#spn30SecTotal").html('');
    $("#spn15SecTotal").html('');
    $("#spnTotalsSpend").html('');
    $("#spnTotalCPM").html('');
    $("#spnCPM").html('');
    $("#spnSpend").html('');
    $("#txt30SecSpots").val("");
    $("#txt15SecSpots").val("");
    $("#spn15SecSpotPerc").html("");
    $("#spnTotalIMPS").html("");
    if (clearType == "selchange" || clearType == "save") {
        $("#ddlMediaPlanQuickPlanDemo").val($($("#ddlMediaPlanQuickPlanDemo option")[0]).attr("value"))
        $("#ddlMediaPlanQuickPlanBuyType").val('');
    }
}
var total30sec = 0;
var total15sec = 0;
function convertCurrencyToNumber(currency) {
    return parseFloat(currency.replace(/[$,%]/g, '').replace(/,/g, ''));
}
function CalculateTotalsQuickPlan(ctrl, action) {
    var value = $(ctrl).val() ? parseInt($(ctrl).val()) : 0;
    if (value < 1 || value > 5000) {
        $(ctrl).val("");
        var totalRate = 0;
        var totalSpots = 0;
        if (action === '30sec') {
            $("#spn30SecTotal").html("");
            var value15Sec = parseInt($("#txt15SecSpots").val()) || 0;
            totalRate = rate15Sec > 0 ? (parseInt(value15Sec) * rate15Sec) : "";
            totalSpots = value15Sec;
        } else if (action === '15sec') {
            $("#spn15SecTotal").html("");
            $("#spn15SecSpotPerc").html("");
            var value30Sec = parseInt($("#txt30SecSpots").val()) || 0;
            totalRate = rate30Sec > 0 ? (parseInt(value30Sec) * rate30Sec) : "";
            totalSpots = value30Sec;
        }

        //  var cpm = totalRate > 0 ? ((totalRate * totalSpots) / impressions).toFixed(2) : "";
        //    $("#spnCPM").html($.fn.dataTable.render.number(',', '.', 2, '$').display(cpm));

        var spend = totalRate;
        if (!isNaN(spend) && spend != "") {
            spend = spend.toFixed(2);
        } else {
            spend = "";
        }
        //$("#spnSpend").html($.fn.dataTable.render.number(',', '.', 2, '$').display(spend));

        var totalSpend = totalRate > 0 ? totalRate.toFixed(2) : "";
        //$("#spnTotalsSpend").html(totalSpend);

        $("#spnTotalsSpend").html($.fn.dataTable.render.number(',', '.', 2, '$').display(totalSpend));

        var imps = $("#spnIMPS").html();
        var totalImps = (totalSpots * imps).toFixed(2);
        totalImps = totalImps > 0 ? totalImps : "";
        $("#spnTotalIMPS").html(totalImps);
        var totalcpm = totalImps > 0 ? (totalSpend / totalImps) : "";
        totalcpm = totalcpm != "" ? totalcpm.toFixed(2) : "";
        //$("#spnTotalCPM").html(totalcpm);
        $("#spnTotalCPM").html($.fn.dataTable.render.number(',', '.', 2, '$').display(totalcpm));
        return;
    }

    if (action === '30sec') {
        //total30sec = rate30Sec > 0 ? (parseInt(value) * rate30Sec) : "";
        total30sec = convertCurrencyToNumber($("#spn30SecAvgRates").html()) > 0 ? (parseInt(value) * convertCurrencyToNumber($("#spn30SecAvgRates").html())) : "0";
        total30sec = parseFloat(total30sec) != "" ? parseFloat(total30sec).toFixed(2) : "";
        //$("#spn30SecTotal").html(parseFloat(total30sec).toFixed(2));
       // $("#spn30SecTotal").html($.fn.dataTable.render.number(',', '.', 2, '$').display(total30sec));

        if ($("#spn30SecAvgRates").html().trim() != "$0.00")
            $("#spn30SecTotal").html($.fn.dataTable.render.number(',', '.', 2, '$').display(total30sec));
        else
            $("#spn30SecTotal").html("$0.00");

        total15sec = convertCurrencyToNumber($("#spn15SecTotal").html()) > 0 ? convertCurrencyToNumber($("#spn15SecTotal").html()) : "0";
    } else if (action === '15sec') {
        //total15sec = rate15Sec > 0 ? (parseInt(value) * rate15Sec) : "";
        total15sec = convertCurrencyToNumber($("#spn15SecAvgRates").html()) > 0 ? (parseInt(value) * convertCurrencyToNumber($("#spn15SecAvgRates").html())) : "";
        total15sec = total15sec != "" ? total15sec.toFixed(2) : "";
        if ($("#spn15SecAvgRates").html().trim() != "$0.00")
            $("#spn15SecTotal").html($.fn.dataTable.render.number(',', '.', 2, '$').display(total15sec));
        else 
            $("#spn15SecTotal").html("$0.00");

        total30sec = convertCurrencyToNumber($("#spn30SecTotal").html()) > 0 ? convertCurrencyToNumber($("#spn30SecTotal").html()) : "0";
    }

    var value30Sec = parseInt($("#txt30SecSpots").val()) || 0;
    var value15Sec = parseInt($("#txt15SecSpots").val()) || 0;
    var totalSpots = value30Sec + value15Sec;

    var percentage15Sec = totalSpots > 0 ? (value15Sec / totalSpots) * 100 : 0;
    percentage15Sec = percentage15Sec > 0 ? percentage15Sec.toFixed(0) + "%" : "";
    /*if (percentSelectedOnCreate == true) {*/
    if (globalQuickPlanVal[0].percent15Selected == true) {
        $("#spn15SecSpotPerc").html(percentage15Sec);
    } else {
        $("#spn15SecSpotPerc").html('');
    }
    var totalRate = parseFloat(total30sec) + parseFloat(total15sec);
    var cpm = totalRate > 0 ? ((totalRate * totalSpots) / impressions).toFixed(2) : "";
    // $("#spnCPM").html($.fn.dataTable.render.number(',', '.', 2, '$').display(cpm));

    var spend = parseFloat(rate30Sec) + parseFloat(rate15Sec);
    if (!isNaN(spend)) {
        spend = spend.toFixed(2);
    } else {
        spend = "";
    }
    //$("#spnSpend").html($.fn.dataTable.render.number(',', '.', 2, '$').display(spend));

    var totalSpend = totalRate > 0 ? totalRate.toFixed(2) : "";
    //$("#spnTotalsSpend").html(totalSpend);
    $("#spnTotalsSpend").html($.fn.dataTable.render.number(',', '.', 2, '$').display(totalSpend));

    var imps = $("#spnIMPS").html();
    var totalImps = (totalSpots * imps).toFixed(2);
    $("#spnTotalIMPS").html(parseFloat(totalImps).toFixed(2));
    var totalcpm = totalImps > 0 ? (totalSpend / totalImps) : "";
    //$("#spnTotalCPM").html(parseFloat(totalcpm).toFixed(2));
    $("#spnTotalCPM").html($.fn.dataTable.render.number(',', '.', 2, '$').display(totalcpm));

    if ($("#ddlMediaPlanQuickPlanBuyType").val() == "1" || $("#ddlMediaPlanQuickPlanBuyType").val() == "3" || $("#ddlMediaPlanQuickPlanBuyType").val() == "9")
    {  
        if ($("#spnQuickPlanNoDataMsg").css("display") == 'none') {
            $("#spnTotalsSpend").html('$0.00');
            $("#spnTotalIMPS").html('$0.00');
            $("#spnTotalCPM").html('$0.00');
        }
    }

}

function ResetQuickPlanData(resetVal, realod) {

    $("#txtAdjustRates").val("");
    $("#txtAdjustImps").val("");
    $("#icoImps").hide();
    $("#icoRates").hide();
    rateTextColor = "#575757";
    impsTextColor = "#575757";
    curAdjustedImps = 0.00;
    curAdjustedRates = 0.00;

    if (resetVal == 'quarter') {
        //defaultQuarterIdQuickPlan = $("#ddlMediaPlanLongPlanQuarter").val();
        //curQuarter = globalQuartersQuickPlan.filter(o => o.quarterId == defaultQuarterIdQuickPlan)[0];
        //defaultQuarterQuickPlan = curQuarter.quarterName;
        MediaPlanGetSelectedDemosQuickPlan();
        PopulateQuickPlanBuyType();
        setTimeout(function () {
            checkUncheckMultiSelectDropdown("mpLongPlan");
        }, 1000);
    }
    else if (resetVal == 'year') {
        QuickMediaPlanGetQuarters(parseInt($("#ddlMediaPlanQuickPlanYears").val()));
        MediaPlanGetSelectedDemosQuickPlan();
        curYear = $("#ddlMediaPlanQuickPlanYears").val();
        PopulateQuickPlanBuyType();
        setTimeout(function () {
            MediaPlanGetPropertiesData();
        }, 1000);
        setTimeout(function () {
            checkUncheckMultiSelectDropdown("mpLongPlan");
        }, 2000);
    }
    else if (resetVal == 'demo') {
        curDemo = $("#ddlMediaPlanLongPlanDemos").val();
        // MediaPlanGetPropertiesData();
        setTimeout(function () {
            // checkUncheckMultiSelectDropdown("mpLongPlan");
        }, 2000);
    }
}

function ClearAdjustmentsQuickPlan(action, calledFrom) {

    $("#txtAdjust" + action + "QuickPlan").val("");
    $("#ico" + action + "QuickPlan").hide();
    $("#txtAdjust" + action + "QuickPlan").focus();

    PrevAdjustedImps = curAdjustedImps;
    PrevAdjustedRates = curAdjustedRates;
    if (action.toString().toLowerCase() == "rates") {
        curAdjustedRates = $("#txtAdjust" + action).val() != "" ? parseFloat($("#txtAdjust" + action).val().replace("%", "")).toFixed(2) : 0.00;
    }
    else {
        curAdjustedImps = $("#txtAdjust" + action).val() != "" ? parseFloat($("#txtAdjust" + action).val().replace("%", "")).toFixed(2) : 0.00;
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
    if (action.toString().toLowerCase() == "rates") {
        FormatAdjustRates($("#txtAdjust" + action), action, "quickPlan");
    }
    else {
        FormatAdjustIMPS($("#txtAdjust" + action), action, "quickPlan");
    }
}

function QuickMediaPlanGetQuarters(year) {
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
                globalQuartersQuickPlan = result.responseData;
                $("#ddlMediaPlanQuickPlanQuarter").empty();
                if (selectedYear != currentYear) {
                    for (var x = 0; x < result.responseData.length; x++) {
                        $("#ddlMediaPlanQuickPlanQuarter").append("<option value=" + result.responseData[x].quarterId + ">" + result.responseData[x].quarterName.substring(0, 2).split("").reverse().join("") + "</option>");
                    }
                    $("#ddlMediaPlanQuickPlanQuarter").val(result.responseData[0].quarterId);
                    defaultQuarterIdQuickPlan = result.responseData[0].quarterId;
                    defaultQuarterQuickPlan = result.responseData[0].quarterName;
                    curQuarter = result.responseData[0];
                    MediaPlanGetSelectedDemosQuickPlan();
                }
                else {
                    currentQuarter = currentQuarter == 4 ? currentQuarter - 1 : currentQuarter;
                    for (var x = 0; x <= currentQuarter; x++) {

                        //$("#ddlMediaPlanQuickPlanQuarter").append("<option value=" + result.responseData[x].quarterId + ">" + result.responseData[x].quarterName.substring(0, 2).split("").reverse().join("") + "</option>");
                        if (x <= result.responseData.length - 1) {
                            $("#ddlMediaPlanQuickPlanQuarter").append("<option value=" + result.responseData[x].quarterId + ">" + result.responseData[x].quarterName.substring(0, 2).split("").reverse().join("") + "</option>");
                        }
                    }

                    $("#ddlMediaPlanQuickPlanQuarter").val($("#hdnQuarterId").val());
                    defaultQuarterIdQuickPlan = $("#hdnQuarterId").val();
                    defaultQuarterQuickPlan = $("#hdnQuarterName").val();
                    curQuarter = globalQuartersQuickPlan.filter(o => o.quarterId == defaultQuarterIdQuickPlan)[0];
                    MediaPlanGetSelectedDemosQuickPlan();
                }
                if (curQuarter.quarterId == $("#hdnQuarterId").val())
                    MediaPlanSetHeader($("#hdnQuarterId"));
            }
            else {
                $("#ddlMediaPlanQuickPlanQuarter").empty();
            }
        },
        error: function (response) {
            swal("error : " + response.responseText);
        }
    });
}

function MediaPlanGetSelectedDemosQuickPlan() {
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
                $("#ddlMediaPlanQuickPlanDemo").empty();
                //$("#ddlMediaPlanQuickPlanDemo").append("<option></option>");
                for (var x = 0; x < result.responseData.length; x++) {
                    if (x == 0) {
                        $("#ddlMediaPlanQuickPlanDemo").append("<option value=" + result.responseData[x].demoId + " selected>" + result.responseData[x].demoName + "</option>");
                    }
                    else {
                        $("#ddlMediaPlanQuickPlanDemo").append("<option value=" + result.responseData[x].demoId + ">" + result.responseData[x].demoName + "</option>");
                    }
                }
                defaultDemoId = result.responseData[0].demoId;
                FirstDemo = result.responseData[0].demoId;
                curDemo = result.responseData[0].demoId;
                PopulateQuickPlanBuyType();
            }
        },
        error: function (response) {
            swal("error : " + response.responseText);
        }
    });
}

function PopulateQuickPlanBuyType() {

    $.ajax({
        url: "/MediaPlan/GetMediaPlanBuyTypes",
        data: {
            "BuyTypeGroup": $("#hdnBTGroupName").val()
        },
        cache: false,
        type: "GET",
        success: function (result) {
            console.log(result);
            curBuyTypeId = 0;
            var markup = "";
            markup += "<option></option>";
            for (var x = 0; x < result.length; x++) {
                //if (x == 0) {
                //    curBuyTypeId = result[x].value;
                //}
                markup += "<option value=" + result[x].value + ">" + result[x].text + "</option>";
            }
            $("#ddlMediaPlanQuickPlanBuyType").html(markup);
            //GetQuickPlanDetails();
        },
        error: function (response) {
            swal('Ooops ...', 'Error Populating Buy Types:  ' + response, 'error');
        }
    });
}

var isValidForSaving = true;
var ValidationMessage = "Please fill the required fields mentioned below:";

function ValidateQuickPlanForm() {
    if ($("#ddlMediaPlanQuickPlanDemo").val() == "" || $("#ddlMediaPlanQuickPlanDemo").val() == "0") {
        ValidationMessage = ValidationMessage + "<br/>Demographic";
        isValidForSaving = false;
    }
    if ($("#ddlMediaPlanQuickPlanBuyType").val() == "" || $("#ddlMediaPlanQuickPlanBuyType").val() == "0") {
        ValidationMessage = ValidationMessage + "<br/>Buytype";
        isValidForSaving = false;
    }
    if ($("#txt30SecSpots").val() == "" && $("#txt15SecSpots").val() == "") {
        ValidationMessage = ValidationMessage + "<br/>Enter spots in any of the 30 sec or 15 sec fields";
        isValidForSaving = false;
    }
}
function SaveQuickPlan(action) {
    isValidForSaving = true;
    ValidationMessage = "Please fill the required fields mentioned below:";
    ValidateQuickPlanForm();
    if (!isValidForSaving) {
        swal({
            html: ValidationMessage,
            type: 'error',
        });
        return false;
    }
    var mediaPlanId = $("#hdnMediaPlanId").val();
    $.ajax({
        url: "/MediaPlan/MediaPlanCheckLock/",
        data: {
            MediaPlanId: mediaPlanId,
            Action: "savempquickplan"
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
                setTimeout(function () {
                    PostDataForSaveQuickPlan(action);
                }, 100);
            }
        },
        error: function (response) {
            var err = response.result;
        }
    });
}

function PostDataForSaveQuickPlan(action) {
    var data = {
        "QuickPlanId": globalQuickPlanVal[0].quickPlanId == 0 ? 0 : globalQuickPlanVal[0].quickPlanId,
        "MediaPlanId": $("#hdnMediaPlanId").val(),
        "NetworkId": globalNetworkIdQuickPlan,
        "BuyTypeGroupId": $("#hdnBuyTypeGroupId").val(),
        "Year": $("#hdnPlanYear").val(),
        "QuarterId": $("#hdnQuarterId").val(),
        "DemographicId": $("#ddlMediaPlanQuickPlanDemo").val(),
        "BuyTypeId": $("#ddlMediaPlanQuickPlanBuyType").val(),
        "AdjustedRates": curAdjustedRates,
        //"AdjustedRates": $("#txtAdjustRatesQuickPlan").val() == "" ? 0 : $("#txtAdjustRatesQuickPlan").val(),
        //"AdjustedImpls": $("#txtAdjustRatesQuickPlan").val() == "" ? 0 : $("#txtAdjustRatesQuickPlan").val(),
        "AdjustedImps": curAdjustedImps,
        "AvgRates30Sec": convertCurrencyToNumber($("#spn30SecAvgRates").html()),
        "AvgRates15Sec": convertCurrencyToNumber($("#spn15SecAvgRates").html()),
        "Imps": $("#spnIMPS").html(),
        "TotalSpots30Sec": $("#txt30SecSpots").val() == "" ? 0 : $("#txt30SecSpots").val(),
        "TotalSpots15Sec": $("#txt15SecSpots").val() == "" ? 0 : $("#txt15SecSpots").val(),
        "Total30SecSpend": convertCurrencyToNumber($("#spn30SecTotal").html()),
        "Total15SecSpend": convertCurrencyToNumber($("#spn15SecTotal").html()),
        //spn15SecSpotPerc
        "TotalSpend": convertCurrencyToNumber($("#spnTotalsSpend").html()),
        "TotalImps": $("#spnTotalIMPS").html().trim() == "" ? 0 : $("#spnTotalIMPS").html().trim(),
        "CPM": convertCurrencyToNumber($("#spnTotalCPM").html()),
        "CreateDt": new Date(),
        "CreatedBy": 1,
        "Percent15Selected": false,
        "Universe": globalQuickPlanVal[0].universe,
        "Percent15Sec": $("#spn15SecSpotPerc").html().replace("%", "") 

    }
    console.log(data);

    $.ajax({
        type: "POST",
        url: "/MediaPlan/SaveMediaQuickPlan",
        data: data,
        success: function (response) {
            if (action == "save and add") {
                ClearFormData('save');
                setTimeout(function () { BindBTGroupSummaryView(true); }, 500);
                CanCloseForm = false;
            }
            else {
                window.location.reload();
            }
        },
        error: function (response) {
            console.log("Error", response);
            //swal({
            //    html: "Error occurred while saving quick plan.",
            //    type: 'error',
            //});
        }
    });
}

function GetQuickPlanDetails() {
    ClearFormData('nobuytype');
    setTimeout(function () {
        selQuarterId = $('#ddlMediaPlanQuickPlanQuarter').val();
        selCountryId = 5;
        selNetworkId = globalNetworkIdQuickPlan;
        curDemo = $('#ddlMediaPlanQuickPlanDemo').val();
        selBuyTypeGroupId = $("#hdnBuyTypeGroupId").val();
        SelYear = $('#ddlMediaPlanQuickPlanYears').val();
        selBuyTypeId = $("#ddlMediaPlanQuickPlanBuyType").val();
        if (selBuyTypeId == "") {
            ClearFormData('nobuytype');
            $('#ddlMediaPlanQuickPlanDemo').val(curDemo);
            $("#spnQuickPlanNoDataMsg").hide();
            return false;
        }
        var selMediaPlanId = $("#hdnMediaPlanId").val();

        $.ajax({
            url: '/MediaPlan/GetQuickPlanDetails',
            type: 'GET',
            data: {
                QuarterId: selQuarterId,
                CountryId: selCountryId,
                NetworkId: selNetworkId,
                DemoId: curDemo,
                BuyTypeGroupId: selBuyTypeGroupId,
                CurYear: SelYear,
                BuytypeId: selBuyTypeId,
                MediaPlanId: selMediaPlanId,
                PlanYear: $("#hdnPlanYear").val(),
                PlanQuarterId: $("#hdnQuarterId").val()
            },
            success: function (response) {
                if (response.success) {
                    CanCloseForm = false;
                    globalQuickPlanVal = response.responseData;
                    var data = response.responseData;
                    if (data != null && data.length > 0) {
                        if (data[0].propertyCount == 0 && !data[0].alreadyExists) {
                            //if (!data[0].alreadyExists)
                            $("#spnQuickPlanNoDataMsg").show();
                        }
                        else {
                            $("#spnQuickPlanNoDataMsg").hide();
                        }
                        if (data[0].alreadyExists) {
                            if (data[0].propertyCount > 0 && ($("#ddlMediaPlanQuickPlanBuyType").val() == "1" || $("#ddlMediaPlanQuickPlanBuyType").val() == "3" || $("#ddlMediaPlanQuickPlanBuyType").val() == "9")) {
                                $("#txt30SecSpots").attr("disabled", false);
                                $("#txt15SecSpots").attr("disabled", false);
                                $("#spn30SecAvgRates").html("$0.00");
                                $("#spn15SecAvgRates").html("$0.00");
                                $("#spnIMPS").html("0.00");
                                $("#txt30SecSpots").val(data[0].totalSpots30Sec || "");
                                $("#txt15SecSpots").val(data[0].totalSpots15Sec || "");
                                if (data[0].percent15Selected && parseInt(data[0].percent15Sec) > 0) {
                                    $("#spn15SecSpotPerc").html(data[0].percent15Sec + "%");
                                }
                                else {
                                    $("#spn15SecSpotPerc").html("");
                                }
                                

                                $("#spn30SecTotal").html("$0.00");
                                //$("#spn15SecTotal").html(data[0].total15SecSpend || "");
                                $("#spn15SecTotal").html("$0.00");
                                $("#spnTotalsSpend").html("$0.00");
                                $("#spnTotalCPM").html("$0.00");
                                $("#spnTotalIMPS").html("$0.00");

                                return;
                            }
                            rate30Sec = FormatRate(data[0].avgRates30Sec);
                            rate15Sec = FormatRate(data[0].avgRates15Sec);
                            curAdjustedImps = data[0].adjustedImps;
                            curAdjustedRates = data[0].adjustedRates;
                            PrevAdjustedImps = data[0].adjustedImps;
                            PrevAdjustedRates = data[0].adjustedRates;
                            percentSelectedOnCreate = data[0].percent15Selected;
                            rate30Sec != "" ? $("#txt30SecSpots").attr("disabled", false) : $("#txt30SecSpots").attr("disabled", true);
                            rate15Sec != "" ? $("#txt15SecSpots").attr("disabled", false) : $("#txt15SecSpots").attr("disabled", true);

                            if (curAdjustedRates != null) {

                                $("#spn30SecAvgRates").html($.fn.dataTable.render.number(',', '.', 2, '$').display(rate30Sec));
                                $("#spn15SecAvgRates").html($.fn.dataTable.render.number(',', '.', 2, '$').display(rate15Sec));
                                $("#spn30SecAvgRates").css("color", "#2971B9");
                                $("#spn15SecAvgRates").css("color", "#2971B9");
                                if (curAdjustedRates > 0) {
                                    $("#txtAdjustRatesQuickPlan").val("+" + curAdjustedRates + "%");
                                    $("#icoRatesQuickPlan").show();
                                }
                                else if (curAdjustedRates < 0) {
                                    $("#txtAdjustRatesQuickPlan").val(curAdjustedRates + "%");
                                    $("#icoRatesQuickPlan").show();
                                }
                                else {
                                    $("#txtAdjustRatesQuickPlan").val("");
                                    $("#spn30SecAvgRates").css("color", "#575757");
                                    $("#spn15SecAvgRates").css("color", "#575757");
                                    $("#icoRatesQuickPlan").hide();
                                }
                            }
                            else {
                                $("#spn30SecAvgRates").css("color", "#575757");
                                $("#spn15SecAvgRates").css("color", "#575757");
                                $("#icoRatesQuickPlan").hide();
                            }

                            var avgImpressions = data[0].avgImpressions > 0 ? data[0].avgImpressions.toFixed(2) : 0.00;
                            impressions = avgImpressions;
                            if (curAdjustedImps != null) {
                                $("#spnIMPS").html(avgImpressions);

                                if (curAdjustedImps > 0) {
                                    $("#txtAdjustImpsQuickPlan").val("+" + curAdjustedImps + "%");
                                    $("#spnIMPS").css("color", "#2971B9");
                                    $("#icoImpsQuickPlan").show();
                                }
                                else if (curAdjustedImps < 0) {
                                    $("#txtAdjustImpsQuickPlan").val(curAdjustedImps + "%");
                                    $("#spnIMPS").css("color", "#2971B9");
                                    $("#icoImpsQuickPlan").show();
                                }
                                else {
                                    $("#txtAdjustImpsQuickPlan").val("");
                                    $("#spnIMPS").css("color", "#575757");
                                    $("#icoImpsQuickPlan").hide();
                                }
                            }
                            else {
                                //$("#spnIMPS").html(avgImpressions > 0 ? parseFloat(avgImpressions) : "");
                                $("#spnIMPS").css("color", "#575757");
                                $("#icoImpsQuickPlan").hide();
                            }

                            $("#txt30SecSpots").val(data[0].totalSpots30Sec || "");
                            $("#txt15SecSpots").val(data[0].totalSpots15Sec || "");
                            //$("#spnCPM").html($.fn.dataTable.render.number(',', '.', 2, '$').display(data[0].cpm));


                            var Imps = data[0].avgImpressions > 0 ? data[0].avgImpressions.toFixed(2) : "";
                            var totalImps = data[0].totalImps > 0 ? data[0].totalImps.toFixed(2) : "";
                            $("#spnIMPS").html(Imps);
                            $("#spnTotalIMPS").html(totalImps);

                            var totalcpm = totalImps > 0 ? (data[0].totalSpend / totalImps) : "";
                            totalcpm = totalcpm.toFixed(2);
                            //$("#spnTotalCPM").html(totalcpm || "");
                            $("#spnTotalCPM").html($.fn.dataTable.render.number(',', '.', 2, '$').display(totalcpm));

                            //$("#spn30SecTotal").html(data[0].total30SecSpend || "");
                            if ($("#txt30SecSpots").val() != "" && parseInt($("#txt30SecSpots").val()) > 0)
                                $("#spn30SecTotal").html($.fn.dataTable.render.number(',', '.', 2, '$').display(data[0].total30SecSpend));
                            if ($("#txt15SecSpots").val() != "" && parseInt($("#txt15SecSpots").val()) > 0)
                                $("#spn15SecTotal").html($.fn.dataTable.render.number(',', '.', 2, '$').display(data[0].total15SecSpend));
                            var spend = parseFloat(rate30Sec) + parseFloat(rate15Sec);
                            if (!isNaN(spend)) {
                                spend = spend.toFixed(2);
                            } else {
                                spend = "";
                            }
                            //$("#spnSpend").html($.fn.dataTable.render.number(',', '.', 2, '$').display(spend));


                            //$("#spnTotalsSpend").html(data[0].totalSpend || "");
                            $("#spnTotalsSpend").html($.fn.dataTable.render.number(',', '.', 2, '$').display(data[0].totalSpend));
                            var value30Sec = parseInt($("#txt30SecSpots").val()) || 0;
                            var value15Sec = parseInt($("#txt15SecSpots").val()) || 0;
                            var totalSpots = value30Sec + value15Sec;
                            //if (data[0].percent15Selected == false) {
                            //    $("#th15SecAvgRates").hide();
                            //    $("#th15SecPercent").hide();
                            //    $("#td15SecPercentRates").hide();
                            //    $("#td15SecAvgSpots").hide();
                            //    $("#td15SecPercentSpots").hide();
                            //    $("#td15SecTotal").hide();
                            //    $("#td15SecSpotPerc").hide();
                            //} else {
                            //    $("#th15SecAvgRates").show();
                            //    $("#th15SecPercent").show();
                            //    $("#td15SecPercentRates").show();
                            //    $("#td15SecAvgSpots").show();
                            //    $("#td15SecPercentSpots").show();
                            //    $("#td15SecTotal").show();
                            //    $("#td15SecSpotPerc").show();

                            var percentage15Sec = totalSpots > 0 ? (data[0].totalSpots15Sec / totalSpots) * 100 : 0;
                            percentage15Sec = percentage15Sec > 0 ? percentage15Sec.toFixed(0) + "%" : "";
                            $("#spn15SecSpotPerc").html(percentage15Sec);
                            //}
                        }
                        else {
                            if (data[0].propertyCount > 0 && ($("#ddlMediaPlanQuickPlanBuyType").val() == "1" || $("#ddlMediaPlanQuickPlanBuyType").val() == "3" || $("#ddlMediaPlanQuickPlanBuyType").val() == "9")) {
                                $("#txt30SecSpots").attr("disabled", false);
                                $("#txt15SecSpots").attr("disabled", false);
                                $("#spn30SecAvgRates").html("$0.00");
                                $("#spn15SecAvgRates").html("$0.00");
                                $("#spnIMPS").html("0.00");
                                return;
                            }
                            rate30Sec = FormatRate(data[0].avgRates30Sec);
                            rate15Sec = FormatRate(data[0].avgRates15Sec);
                            percentSelectedOnCreate = data[0].percent15Selected;
                            curAdjustedRates = parseFloat($("#txtAdjustRatesQuickPlan").val().replace("%", "")) || 0.00;
                            curAdjustedImps = parseFloat($("#txtAdjustImpsQuickPlan").val().replace("%", "")) || 0.00;
                            var AvgRates30 = 0.00;
                            var AvgRates15 = 0.00;
                            var avgImps = 0.00;
                            rate30Sec != "" ? $("#txt30SecSpots").attr("disabled", false) : $("#txt30SecSpots").attr("disabled", true);
                            rate15Sec != "" ? $("#txt15SecSpots").attr("disabled", false) : $("#txt15SecSpots").attr("disabled", true);
                            //$("#spn30SecAvgRates").html(rate30Sec);
                            if (curAdjustedRates != 0) {
                                if (curAdjustedRates > 0) {
                                    AvgRates30 = parseFloat(rate30Sec) + parseFloat(rate30Sec * Math.abs(curAdjustedRates) / 100.00);
                                    AvgRates15 = parseFloat(rate15Sec) + parseFloat(rate15Sec * Math.abs(curAdjustedRates) / 100.00);

                                } else {
                                    AvgRates30 = parseFloat(rate30Sec) - parseFloat(rate30Sec * Math.abs(curAdjustedRates) / 100.00);
                                    AvgRates15 = parseFloat(rate15Sec) - parseFloat(rate15Sec * Math.abs(curAdjustedRates) / 100.00);
                                }
                                $("#spn30SecAvgRates").html($.fn.dataTable.render.number(',', '.', 2, '$').display(AvgRates30));
                                $("#spn15SecAvgRates").html($.fn.dataTable.render.number(',', '.', 2, '$').display(AvgRates15));
                                $("#spn30SecAvgRates").css("color", "#2971B9");
                                $("#spn15SecAvgRates").css("color", "#2971B9");
                            }
                            else {
                                $("#spn30SecAvgRates").html($.fn.dataTable.render.number(',', '.', 2, '$').display(rate30Sec));
                                $("#spn15SecAvgRates").html($.fn.dataTable.render.number(',', '.', 2, '$').display(rate15Sec));
                                $("#spn30SecAvgRates").css("color", "#575757");
                                $("#spn15SecAvgRates").css("color", "#575757");
                            }
                            impressions = data[0].avgImpressions > 0 ? data[0].avgImpressions.toFixed(2) : 0;

                            if (curAdjustedImps != 0) {
                                if (curAdjustedImps > 0) {
                                    avgImps = parseFloat(impressions) + parseFloat(impressions * Math.abs(curAdjustedImps) / 100.00);

                                } else {
                                    avgImps = parseFloat(impressions) - parseFloat(impressions * Math.abs(curAdjustedImps) / 100.00);
                                }
                                $("#spnIMPS").html(avgImps <= 0 ? "" : parseFloat(avgImps).toFixed(2));
                                //$("#spnIMPS").html(parseFloat(avgImps).toFixed(2));

                                $("#spnIMPS").css("color", "#2971B9");
                            }
                            else {
                                $("#spnIMPS").html(impressions <= 0 ? "" : parseFloat(impressions).toFixed(2));
                                $("#spnIMPS").css("color", "#575757");
                            }

                            var spend = parseFloat(rate30Sec) + parseFloat(rate15Sec);
                            if (!isNaN(spend)) {
                                spend = spend.toFixed(2);
                            } else {
                                spend = "";
                            }
                            // $("#spnSpend").html($.fn.dataTable.render.number(',', '.', 2, '$').display(spend));

                            $("#txt30SecSpots").val("");
                            $("#txt15SecSpots").val("");
                            $("#spnCPM").html("");
                            $("#spnTotalsSpend").html("");
                            $("#spnTotalCPM").html("");
                            $("#spnTotalIMPS").html("");
                            $("#spn30SecTotal").html("");
                            $("#spn15SecTotal").html("");
                            $("#spn15SecSpotPerc").html("");


                            //if (data[0].percent15Selected == false) {
                            //    $("#th15SecAvgRates").hide();
                            //    $("#th15SecPercent").hide();
                            //    $("#td15SecPercentRates").hide();
                            //    $("#td15SecAvgSpots").hide();
                            //    $("#td15SecPercentSpots").hide();
                            //    $("#td15SecTotal").hide();
                            //    $("#td15SecSpotPerc").hide();

                            //} else {
                            //    $("#th15SecAvgRates").show();
                            //    $("#th15SecPercent").show();
                            //    $("#td15SecPercentRates").show();
                            //    $("#td15SecAvgSpots").show();
                            //    $("#td15SecPercentSpots").show();
                            //    $("#td15SecTotal").show();
                            //    $("#td15SecSpotPerc").show();
                            //}                                                 
                        }
                    }
                    else {
                        $("#txtAdjustRatesQuickPlan").val("");
                        $("#txtAdjustImpsQuickPlan").val("");
                        $("#spn30SecAvgRates").html("");
                        $("#spn15SecAvgRates").html("");
                        $("#spnSpend").html("");
                        $("#spnIMPS").html("");
                        $("#spnCPM").html("");
                        $("#txt30SecSpots").val("");
                        $("#txt15SecSpots").val("");
                        $("#spn30SecTotal").html("");
                        $("#spn15SecTotal").html("");
                        $("#spn15SecSpotPerc").html("");
                        $("#spnTotalsSpend").html("");
                        $("#spnTotalIMPS").html("");
                        $("#spnTotalCPM").html("");
                        $("#txt30SecSpots").attr("disabled", true);
                        $("#txt15SecSpots").attr("disabled", true);
                        $("#spnQuickPlanNoDataMsg").show();
                    }

                } else {
                    console.log("Error:", response.responseText);
                }
            },
            error: function (xhr, status, error) {
                console.log("AJAX Error:", error);
            }
        });
    }, 400);
}

function FormatRate(rate) {
    return rate === 0 ? "" : (rate % 1 === 0 ? rate : rate.toFixed(2));
}

function FormatAdjustRates(ctrl, valType, calledFrom) {
    var avgRates30Sec = 0.00;
    var avgRates15Sec = 0.00;
    var Rate30WithoutAdj = 0.00;
    var Rate15WithoutAdj = 0.00;

    if (globalQuickPlanVal != null && globalQuickPlanVal.length > 0) {
        avgRates30Sec = globalQuickPlanVal[0].avgRates30Sec == null || globalQuickPlanVal[0].avgRates30Sec == undefined ? 0.00 : parseFloat(globalQuickPlanVal[0].avgRates30Sec).toFixed(2);
        avgRates15Sec = globalQuickPlanVal[0].avgRates15Sec == null || globalQuickPlanVal[0].avgRates15Sec == undefined ? 0.00 : parseFloat(globalQuickPlanVal[0].avgRates15Sec).toFixed(2);
        if (globalQuickPlanVal[0].adjustedRates != 0) {
            Rate30WithoutAdj = parseFloat(parseFloat(globalQuickPlanVal[0].avgRates30Sec * 100) / (globalQuickPlanVal[0].adjustedRates + 100)).toFixed(2);
            Rate15WithoutAdj = parseFloat(parseFloat(globalQuickPlanVal[0].avgRates15Sec * 100) / (globalQuickPlanVal[0].adjustedRates + 100)).toFixed(2);
        }
        else {
            Rate30WithoutAdj = avgRates30Sec;
            Rate15WithoutAdj = avgRates15Sec;
        }
    }
    
    if ($(ctrl).val() == "" || parseFloat($(ctrl).val()) == 0) {
        if (valType.toString().toLowerCase() == "rates") {
            $("#icoRatesQuickPlan").hide();
            $(ctrl).val("");
            curAdjustedRates = 0.0;
        }
    }
    else if (Math.abs($(ctrl).val().replace("%", "")) > 10) {
        $(ctrl).val("");
        $("#icoRatesQuickPlan").hide();
        curAdjustedRates = 0.00;
    }
    else {
        $("#icoRatesQuickPlan").show();
        if ($(ctrl).val().startsWith("-") || $(ctrl).val().startsWith("+")) {
            if (!$(ctrl).val().endsWith("%"))
                $(ctrl).val($(ctrl).val() + "%");
        }
        else {
            if (!$(ctrl).val().endsWith("%"))
                $(ctrl).val("+" + $(ctrl).val() + "%");
        }
        if (valType.toString().toLowerCase() == "rates") {
            curAdjustedRates = $(ctrl).val() != "" ? parseFloat($(ctrl).val().replace("%", "")).toFixed(2) : 0.00;
        }
    }
    if (curAdjustedRates != 0) {        
        if (curAdjustedRates > 0) {
            avgRates30Sec = parseFloat(Rate30WithoutAdj) + parseFloat(Rate30WithoutAdj * Math.abs(curAdjustedRates) / 100.00);
            avgRates15Sec = parseFloat(Rate15WithoutAdj) + parseFloat(Rate15WithoutAdj * Math.abs(curAdjustedRates) / 100.00);


        } else {
            avgRates30Sec = parseFloat(Rate30WithoutAdj) - parseFloat(Rate30WithoutAdj * Math.abs(curAdjustedRates) / 100.00);
            avgRates15Sec = parseFloat(Rate15WithoutAdj) - parseFloat(Rate15WithoutAdj * Math.abs(curAdjustedRates) / 100.00);
        }
        if (parseFloat(avgRates30Sec) > 0) {
            $("#spn30SecAvgRates").html($.fn.dataTable.render.number(',', '.', 2, '$').display(avgRates30Sec));
            $("#spn30SecAvgRates").css("color", "#2971B9");
            if (parseFloat($("#txt30SecSpots").val()) > 0) {
                total30sec = convertCurrencyToNumber($("#spn30SecAvgRates").html()) > 0 ? (parseFloat($("#txt30SecSpots").val()) * convertCurrencyToNumber($("#spn30SecAvgRates").html())) : "0";
                $("#spn30SecTotal").html($.fn.dataTable.render.number(',', '.', 2, '$').display(total30sec));
            }
        }
        else {
            $("#spn30SecAvgRates").html("");
            $("#spn30SecAvgRates").css("color", "#575757");
        }
        if (parseFloat(avgRates15Sec) > 0) {
            $("#spn15SecAvgRates").html($.fn.dataTable.render.number(',', '.', 2, '$').display(avgRates15Sec));
            //("#spn15SecAvgRates").html();
            $("#spn15SecAvgRates").css("color", "#2971B9");
            if (parseFloat($("#txt15SecSpots").val()) > 0) {
                //  total30sec = $("#spn15SecAvgRates").html() > 0 ? (parseFloat($("#txt15SecSpots").val()) * $("#spn15SecAvgRates").html()) : "0";
                total30sec = convertCurrencyToNumber($("#spn15SecAvgRates").html()) > 0 ? (parseFloat($("#txt15SecSpots").val()) * convertCurrencyToNumber($("#spn15SecAvgRates").html())) : "0";
                //$("#spn15SecTotal").html(parseFloat(total30sec).toFixed(2));
                $("#spn15SecTotal").html($.fn.dataTable.render.number(',', '.', 2, '$').display(total30sec));
            }
        }
        else {
            $("#spn15SecAvgRates").html("");
            $("#spn15SecAvgRates").css("color", "#575757");
        }
    }
    else {
        $("#spn30SecAvgRates").css("color", "#575757");
        $("#spn15SecAvgRates").css("color", "#575757");
        if (parseFloat(Rate30WithoutAdj) > 0) {
            //$("#spn30SecAvgRates").html(parseFloat(avgRates30Sec).toFixed(2));
            $("#spn30SecAvgRates").html($.fn.dataTable.render.number(',', '.', 2, '$').display(Rate30WithoutAdj));
            if (parseFloat($("#txt30SecSpots").val()) > 0) {
                total30sec = convertCurrencyToNumber($("#spn30SecAvgRates").html()) > 0 ? (parseFloat($("#txt30SecSpots").val()) * convertCurrencyToNumber($("#spn30SecAvgRates").html())) : "0";
                total30sec = parseFloat(total30sec) != "" ? parseFloat(total30sec).toFixed(2) : "";
                //$("#spn30SecTotal").html(parseFloat(total30sec).toFixed(2));
                $("#spn30SecTotal").html($.fn.dataTable.render.number(',', '.', 2, '$').display(total30sec));
            }
        }
        else {
            $("#spn30SecAvgRates").html("");
        }

        if (parseFloat(Rate15WithoutAdj) > 0) {
            $("#spn15SecAvgRates").html($.fn.dataTable.render.number(',', '.', 2, '$').display(Rate15WithoutAdj));
            if (parseFloat($("#txt15SecSpots").val()) > 0) {
                // total30sec = $("#spn15SecAvgRates").html() > 0 ? (parseFloat($("#txt15SecSpots").val()) * $("#spn15SecAvgRates").html()) : "0";
                total15sec = convertCurrencyToNumber($("#spn15SecAvgRates").html()) > 0 ? (parseFloat($("#txt15SecSpots").val()) * convertCurrencyToNumber($("#spn15SecAvgRates").html())) : "0";
                total15sec = parseFloat(total15sec) != "" ? parseFloat(total15sec).toFixed(2) : "";
                //$("#spn15SecTotal").html(parseFloat(total30sec).toFixed(2));
                $("#spn15SecTotal").html($.fn.dataTable.render.number(',', '.', 2, '$').display(total15sec));
            }
        }
        else {
            $("#spn15SecAvgRates").html("");
        }
    }
    CalculateTotalsQuickPlan($("#txt30SecSpots"), "30sec");

}


function FormatAdjustIMPS(ctrl, valType, calledFrom) {
    var avgImps = 0.00;
    var ImpsWithoutAdj = 0.00;

    if (globalQuickPlanVal != null && globalQuickPlanVal.length > 0) {
        avgImps = globalQuickPlanVal[0].avgImpressions == null || globalQuickPlanVal[0].avgImpressions == undefined ? 0.00 : parseFloat(globalQuickPlanVal[0].avgImpressions).toFixed(2);
        if (globalQuickPlanVal[0].adjustedImps != 0) {
            ImpsWithoutAdj = parseFloat(parseFloat(globalQuickPlanVal[0].avgImpressions * 100) / (globalQuickPlanVal[0].adjustedImps + 100)).toFixed(2);
        }
        else {
            ImpsWithoutAdj = avgImps;
        }
    }
    var TotalAddedSpots = (parseInt($("#txt30SecSpots").val()) || 0) + (parseInt($("#txt15SecSpots").val()) || 0);
    if ($(ctrl).val() == "" || parseFloat($(ctrl).val()) == 0) {
        if (valType.toString().toLowerCase() == "imps") {
            curAdjustedImps = 0.0;
            $(ctrl).val("");
            $("#icoImpsQuickPlan").hide();
        }
    }
    else if (Math.abs($(ctrl).val().replace("%", "")) > 10) {
        $(ctrl).val("");
        $("#icoImpsQuickPlan").hide();
        curAdjustedImps = 0.00;
    }
    else {
        $("#icoImpsQuickPlan").show();
        if ($(ctrl).val().startsWith("-") || $(ctrl).val().startsWith("+")) {
            if (!$(ctrl).val().endsWith("%"))
                $(ctrl).val($(ctrl).val() + "%");
        }
        else {
            if (!$(ctrl).val().endsWith("%"))
                $(ctrl).val("+" + $(ctrl).val() + "%");
        }
        if (valType.toString().toLowerCase() == "imps") {
            curAdjustedImps = $(ctrl).val() != "" ? parseFloat($(ctrl).val().replace("%", "")).toFixed(2) : 0.00;
        }
    }
    if (curAdjustedImps != 0) {
        var AdjustedRates = 0.00;
        if (curAdjustedImps > 0) {
            avgImps = parseFloat(ImpsWithoutAdj) + parseFloat(ImpsWithoutAdj * Math.abs(curAdjustedImps) / 100.00);

        } else {
            avgImps = parseFloat(ImpsWithoutAdj) - parseFloat(ImpsWithoutAdj * Math.abs(curAdjustedImps) / 100.00);
        }

        if (parseFloat(avgImps) > 0) {
            $("#spnIMPS").html(parseFloat(avgImps).toFixed(2));
            $("#spnIMPS").css("color", "#2971B9");
        }
        else {
            $("#spnIMPS").html("");
            $("#spnIMPS").css("color", "#575757");
        }
    }
    else {
        $("#spnIMPS").css("color", "#575757");
        $("#spnIMPS").css("color", "#575757");
        if (parseFloat(ImpsWithoutAdj) > 0) {
            $("#spnIMPS").html(parseFloat(ImpsWithoutAdj).toFixed(2));
        }
        else {
            $("#spnIMPS").html("");
        }
    }
    if (TotalAddedSpots > 0) {
        var curImps = parseFloat($("#spnIMPS").html()) || 0.00;
        var TotalImpsCalc = curImps * TotalAddedSpots;
        var TotalSpendCalc = parseFloat(convertCurrencyToNumber($("#spnTotalsSpend").html())) || 0.00;

        if (TotalImpsCalc > 0) {
            $("#spnTotalIMPS").html(parseFloat(TotalImpsCalc).toFixed(2));
            var totalcpmCalc = parseFloat(TotalSpendCalc) / parseFloat(TotalImpsCalc);
            $("#spnTotalCPM").html($.fn.dataTable.render.number(',', '.', 2, '$').display(totalcpmCalc));
        }
        else {
            $("#spnTotalCPM").html("");
            $("#spnTotalIMPS").html("");
        }
    }
    CalculateTotalsQuickPlan($("#txt30SecSpots"), "30sec");
}

$('#mpQuickPlanNetworkModal').on('hide.bs.modal', function (e) {

    if ($("#txt15SecSpots").val() == "" && $("#txt30SecSpots").val() == "" && $("#spn15SecAvgRates").html() == "" && $("#spn30SecAvgRates").html() == "" && $("#txtAdjustRatesQuickPlan").val() == ""
     && $("#txtAdjustImpsQuickPlan").val() == "") {
        $('#mpQuickPlanNetworkModal').modal('hide');
    }
    else {
        $('#mpQuickPlanNetworkModal').modal('show');
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
                $('#mpQuickPlanNetworkModal').modal('hide');
                location.reload();
            }, function (dismiss) {
                $('#mpQuickPlanNetworkModal').modal('show');
            }
        );
    }
})
