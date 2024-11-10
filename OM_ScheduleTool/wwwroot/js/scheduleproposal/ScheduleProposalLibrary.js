var PropertyTableJsonFull;
var PropertyTableJsonFiltered;
var selectedColIndex = [];
var editProposal = window.location.pathname.split('/')[2] == "EditProposal" ? true : false;
function ShowHideColumn(columnIdx, that) {
    var proptable = $("#MyProposalTable").DataTable();
    var colStat = proptable.column(columnIdx);
    if (colStat.visible()) {
        that.className = 'btn btn-outline-danger';
        colStat.visible(false);
    }
    else {
        that.className = 'btn btn-outline-secondary';
        colStat.visible(true);
    }
    _Initialize = 0;
}

//function ShowWeeklySpots() {
//    ShowHideColumn(30);
//    ShowHideColumn(31);
//    ShowHideColumn(32);
//    ShowHideColumn(33);
//    ShowHideColumn(34);
//    ShowHideColumn(35);
//    ShowHideColumn(36);
//    ShowHideColumn(37);
//    ShowHideColumn(38);
//    ShowHideColumn(39);
//    ShowHideColumn(40);
//    ShowHideColumn(41);
//    ShowHideColumn(42);
//    ShowHideColumn(43);
//}

function ResetState(proptable) {
    promptExit(0);
    proptable.state.clear();
    $("#hdnPremiereFilter").val("0");//ST-807
    window.location.reload();
}

var wk = [];
var weekCounts = {};
var ifIdIsSame = [];
var wk1, wk2, wk3, wk4, wk5, wk6, wk7, wk8, wk9, wk10, wk11, wk12, wk13, wk14 = false; 

if (editProposal) {
    var WeeklySpot = [];

    var prevSpotVal = "";
    function OnWeeklySpotFocus(that) {
        prevSpotVal = $(that).val();
    }
}
function OnWeeklySpotChange(that, idPrefix, WeekNum, btn) {
    try {
        var id = $(that).attr('id').replace(idPrefix, '');

        if (btn == undefined && editProposal) {
            if (WeeklySpot.length >= 15)
                WeeklySpot.shift();
            WeeklySpot.push($(that).attr('id') + "||" + parseInt($(that).val()) + "||" + prevSpotVal + "||" + WeekNum);
            $("#btnUndoWeeklySpotChange").removeAttr('disabled');
        }
        $.ajax({
            url: '/ScheduleProposal/SaveWeeklySpot',
            type: "POST",
            async: false,
            data: {
                ScheduleLineId: id,
                WeekNo: WeekNum,
                Spots: parseInt($(that).val())
            },
            success: function (result) {
                var sum = 0;
                if (document.getElementById('wk01_' + id)) {
                    if (!isNaN(parseInt($('#wk01_' + id).val()))) {
                        sum = sum + parseInt($('#wk01_' + id).val());
                    }
                }
                if (document.getElementById('wk02_' + id)) {
                    if (!isNaN(parseInt($('#wk02_' + id).val()))) {
                        sum = sum + parseInt($('#wk02_' + id).val());
                    }
                }
                if (document.getElementById('wk03_' + id)) {
                    if (!isNaN(parseInt($('#wk03_' + id).val()))) {
                        sum = sum + parseInt($('#wk03_' + id).val());
                    }
                }
                if (document.getElementById('wk04_' + id)) {
                    if (!isNaN(parseInt($('#wk04_' + id).val()))) {
                        sum = sum + parseInt($('#wk04_' + id).val());
                    }
                }
                if (document.getElementById('wk05_' + id)) {
                    if (!isNaN(parseInt($('#wk05_' + id).val()))) {
                        sum = sum + parseInt($('#wk05_' + id).val());
                    }
                }
                if (document.getElementById('wk06_' + id)) {
                    if (!isNaN(parseInt($('#wk06_' + id).val()))) {
                        sum = sum + parseInt($('#wk06_' + id).val());
                    }
                }
                if (document.getElementById('wk07_' + id)) {
                    if (!isNaN(parseInt($('#wk07_' + id).val()))) {
                        sum = sum + parseInt($('#wk07_' + id).val());
                    }
                }
                if (document.getElementById('wk08_' + id)) {
                    if (!isNaN(parseInt($('#wk08_' + id).val()))) {
                        sum = sum + parseInt($('#wk08_' + id).val());
                    }
                }
                if (document.getElementById('wk09_' + id)) {
                    if (!isNaN(parseInt($('#wk09_' + id).val()))) {
                        sum = sum + parseInt($('#wk09_' + id).val());
                    }
                }
                if (document.getElementById('wk10_' + id)) {
                    if (!isNaN(parseInt($('#wk10_' + id).val()))) {
                        sum = sum + parseInt($('#wk10_' + id).val());
                    }
                }
                if (document.getElementById('wk11_' + id)) {
                    if (!isNaN(parseInt($('#wk11_' + id).val()))) {
                        sum = sum + parseInt($('#wk11_' + id).val());
                    }
                }
                if (document.getElementById('wk12_' + id)) {
                    if (!isNaN(parseInt($('#wk12_' + id).val()))) {
                        sum = sum + parseInt($('#wk12_' + id).val());
                    }
                }
                if (document.getElementById('wk13_' + id)) {
                    if (!isNaN(parseInt($('#wk13_' + id).val()))) {
                        sum = sum + parseInt($('#wk13_' + id).val());
                    }
                }
                if (document.getElementById('wk14_' + id)) {
                    if (!isNaN(parseInt($('#wk14_' + id).val()))) {
                        sum = sum + parseInt($('#wk14_' + id).val());
                    }
                }

                $('#totalSpots_' + id).html(sum);
                
                if (result.success) {                     
                    if (!weekCounts["wk" + WeekNum]) {
                        weekCounts["wk" + WeekNum] = 0;                        
                    } 
                    if (ifIdIsSame.indexOf("wk" + WeekNum + "_" + id) == -1) {
                        weekCounts["wk" + WeekNum]++;
                        ifIdIsSame.push("wk" + WeekNum + "_" + id); 
                    }         
                 
                    $('#wk' + WeekNum + '_' + id).css('color', 'red');
                    $('#divCopyToSchedule > button').attr('disabled', 'disabled').prop('disabled', 'disabled');
                }
                else { 
                    var value = parseInt($("#wk" + WeekNum + "_" + id).val());                   
                    if (value != 0) 
                    {
                        ifIdIsSame.splice(ifIdIsSame.indexOf("wk" + WeekNum + "_" + id), 1);
                        if (Object.values(weekCounts).length > 0) {
                            if (weekCounts["wk" + WeekNum] > 0) {
                                weekCounts["wk" + WeekNum]--;
                            }
                        }
                        if (weekCounts["wk" + WeekNum] == 0) {

                            if (WeekNum == "01") {
                                wk1 = false;
                            }
                            else if (WeekNum == "02") {
                                wk2 = false;
                            }
                            else if (WeekNum == "03") {
                                wk3 = false;
                            }
                            else if (WeekNum == "04") {
                                wk4 = false;
                            }
                            else if (WeekNum == "05") {
                                wk5 = false;
                            }
                            else if (WeekNum == "06") {
                                wk6 = false;
                            }
                            else if (WeekNum == "07") {
                                wk7 = false;
                            }
                            else if (WeekNum == "08") {
                                wk8 = false;
                            }
                            else if (WeekNum == "09") {
                                wk9 = false;
                            }
                            else if (WeekNum == "10") {
                                wk10 = false;
                            }
                            else if (WeekNum == "11") {
                                wk11 = false;
                            }
                            else if (WeekNum == "12") {
                                wk12 = false;
                            }
                            else if (WeekNum == "13") {
                                wk13 = false;
                            }
                            else if (WeekNum == "14") {
                                wk14 = false;
                            }
                        }   
                    }
                                   
                    if (value == 0) {
                        $('#wk' + WeekNum + '_' + id).css('color', 'red');
                        if (!weekCounts["wk" + WeekNum]) {
                            weekCounts["wk" + WeekNum] = 0;
                        }
                        if (ifIdIsSame.indexOf("wk" + WeekNum + "_" + id) == -1) {
                            weekCounts["wk" + WeekNum]++;
                            ifIdIsSame.push("wk" + WeekNum + "_" + id);
                        }
                    }
                    else {
                        $('#wk' + WeekNum + '_' + id).css('color', '#009900');
                    }
                    
                    $('#divCopyToSchedule > button').removeAttr("disabled");
                    if (result.responseText != '') {
                        swal('Failed', result.responseText, 'error');
                    }

                    Codebase.blocks('#ProposalTableDiv', 'state_loading');
                    if (proptable == null) {
                        initProposalTable();
                    }
                    else {
                        proptable.ajax.reload();
                    }
                    Codebase.blocks('#ProposalTableDiv', 'state_normal');
                }
                var proptable = $("#MyProposalTable").DataTable();
                CalculateUE(proptable);
                ReloadTotals();

                //UpdateWeek(WeekNum);

                SetupMenus();
            },
            error: function (response) {
            }
        });
    }
    catch (err) { }
}

function ReloadApproved(proptable, settings, data) {
    // COLINDEX_DEPENDENT 
    var colStat = proptable.column(1);
    if (colStat) {
        if (colStat.visible()) {
            ReloadBool(settings, data, '/ScheduleProposal/GetApproved', _UniqueId, 1, 'HeaderApproved')
        }
    }
}

function ReloadSPBuy(proptable, settings, data) {
    var colStat = proptable.column(21);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetSPBuy', _UniqueId, 21, 'HeaderSPBuy')
        }
    }
}

function ReloadDoNotBuyTypes(proptable, settings, data) {
    // COLINDEX_DEPENDENT 
    var colStat = proptable.column(2);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetDoNotBuyTypes', _UniqueId, 2, 'HeaderDoNotBuyType');
        }
    }
}

function ReloadRev(proptable, settings, data) {
    // COLINDEX_DEPENDENT 
    var colStat = proptable.column(3);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetRevisions', _UniqueId, 3, 'HeaderRevNo');
        }
    }
}

function ReloadRevisedDates(proptable, settings, data) {
    // COLINDEX_DEPENDENT 
    var colStat = proptable.column(4);
    if (colStat) {
        if (colStat.visible()) {
            ReloadDates(settings, data, '/ScheduleProposal/GetRevisedDates', _UniqueId, 4, 'HeaderRateRevisedDate');
        }
    }
}

function ReloadDemoNames(proptable, settings, data) {
    // COLINDEX_DEPENDENT 
    var colStat = proptable.column(6);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetDemoNames', _UniqueId, 6, 'HeaderDemoName');
            // ReloadStringClient(settings, data, proptable, _UniqueId, 6, 'HeaderDemoName');
        }
    }
}

function ReloadNetworkName(proptable, settings, data) {
    // COLINDEX_DEPENDENT 
    var colStat = proptable.column(7);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetNetworkNames', _UniqueId, 7, 'HeaderNetworkName');
        }
    }
}

function ReloadPropertyNames(proptable, settings, data) {
    // COLINDEX_DEPENDENT 
    var colStat = proptable.column(8);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetPropertyNames', _UniqueId, 8, 'HeaderPropertyName');
            // ReloadStringClient(settings, data, proptable, _UniqueId, 8, 'HeaderPropertyName');
        }
    }
}

function ReloadEffectiveDates(proptable, settings, data) {
    // COLINDEX_DEPENDENT 
    var colStat = proptable.column(9);
    if (colStat) {
        if (colStat.visible()) {
            ReloadDates(settings, data, '/ScheduleProposal/GetEffectiveDates', _UniqueId, 9, 'HeaderEffectiveDate');
        }
    }
}

function ReloadExpirationDates(proptable, settings, data) {
    // COLINDEX_DEPENDENT 
    var colStat = proptable.column(10);
    if (colStat) {
        if (colStat.visible()) {
            ReloadDates(settings, data, '/ScheduleProposal/GetExpirationDates', _UniqueId, 10, 'HeaderExpirationDate');
        }
    }
}

function ReloadDayPart(proptable, settings, data) {
    // COLINDEX_DEPENDENT 
    var colStat = proptable.column(18);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetDayParts', _UniqueId, 18, 'HeaderDP');
        }
    }
}

function ReloadStartToEnd(proptable, settings, data) {
    // COLINDEX_DEPENDENT 
    var colStat = proptable.column(19);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetStartToEnd', _UniqueId, 19, 'HeaderStartToEnd');
        }
    }
}

function ReloadOMDP(proptable, settings, data) {
    // COLINDEX_DEPENDENT 
    var colStat = proptable.column(20);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetOMDPs', _UniqueId, 20, 'HeaderOMDP');
        }
    }
}

function ReloadLens(proptable, settings, data) {
    // COLINDEX_DEPENDENT 
    var colStat = proptable.column(22);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetLens', _UniqueId, 22, 'HeaderSpotLen');
        }
    }
}

function ReloadBuyType(proptable, settings, data) {
    // COLINDEX_DEPENDENT 
    var colStat = proptable.column(23);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetBuyTypes', _UniqueId, 23, 'HeaderBuyType');
        }
    }
}

function ReloadRateAmts(proptable, settings, data) {
    // COLINDEX_DEPENDENT 
    var colStat = proptable.column(24);
    if (colStat) {
        if (colStat.visible()) {
            ReloadCurrency(settings, data, '/ScheduleProposal/GetRateAmts', _UniqueId, 24, 'HeaderRateAmt');
        }
    }
}

function ReloadDiscounts(proptable, settings, data) {
    var colStat = proptable.column(25);
    if (colStat) {
        if (colStat.visible()) {
            ReloadDiscount(settings, data, '/ScheduleProposal/GetDiscounts', _UniqueId, 25, 'HeaderDiscount');
        }
    }
}

function ReloadUSD(proptable, settings, data) {
    var colStat = proptable.column(26);
    if (colStat) {
        if (colStat.visible()) {
            ReloadCurrency(settings, data, '/ScheduleProposal/GetUSDRate', _UniqueId, 26, 'HeaderUSD');
        }
    }
}

function ReloadCPMs(proptable, settings, data) {
    var colStat = proptable.column(27);
    if (colStat) {
        if (colStat.visible()) {
            ReloadCurrency(settings, data, '/ScheduleProposal/GetCPM', _UniqueId, 27, 'HeaderCPM');
        }
    }
}

function ReloadImpressions(proptable, settings, data) {
    var colStat = proptable.column(28);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetImpressions', _UniqueId, 28, 'HeaderImpression');
        }
    }
}

function ReloadTotalSpots(proptable, settings, data) {
    var colStat = proptable.column(29);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetTotalSpots', _UniqueId, 29, 'HeaderTotalSpots');
        }
    }
}
function ReloadWK01Spots(proptable, settings, data) {
    var colStat = proptable.column(30);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetWKSpots', _UniqueId, 30, 'HeaderWK01', 1);
        }
    }
}
function ReloadWK02Spots(proptable, settings, data) {
    var colStat = proptable.column(31);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetWKSpots', _UniqueId, 31, 'HeaderWK02', 2);
        }
    }
}
function ReloadWK03Spots(proptable, settings, data) {
    var colStat = proptable.column(32);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetWKSpots', _UniqueId, 32, 'HeaderWK03', 3);
        }
    }
}
function ReloadWK04Spots(proptable, settings, data) {
    var colStat = proptable.column(33);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetWKSpots', _UniqueId, 33, 'HeaderWK04', 4);
        }
    }
}
function ReloadWK05Spots(proptable, settings, data) {
    var colStat = proptable.column(34);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetWKSpots', _UniqueId, 34, 'HeaderWK05', 5);
        }
    }
}
function ReloadWK06Spots(proptable, settings, data) {
    var colStat = proptable.column(35);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetWKSpots', _UniqueId, 35, 'HeaderWK06', 6);
        }
    }
}
function ReloadWK07Spots(proptable, settings, data) {
    var colStat = proptable.column(36);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetWKSpots', _UniqueId, 36, 'HeaderWK07', 7);
        }
    }
}
function ReloadWK08Spots(proptable, settings, data) {
    var colStat = proptable.column(37);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetWKSpots', _UniqueId, 37, 'HeaderWK08', 8);
        }
    }
}
function ReloadWK09Spots(proptable, settings, data) {
    var colStat = proptable.column(38);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetWKSpots', _UniqueId, 38, 'HeaderWK09', 9);
        }
    }
}
function ReloadWK10Spots(proptable, settings, data) {
    var colStat = proptable.column(39);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetWKSpots', _UniqueId, 39, 'HeaderWK10', 10);
        }
    }
}
function ReloadWK11Spots(proptable, settings, data) {
    var colStat = proptable.column(40);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetWKSpots', _UniqueId, 40, 'HeaderWK11', 11);
        }
    }
}
function ReloadWK12Spots(proptable, settings, data) {
    var colStat = proptable.column(41);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetWKSpots', _UniqueId, 41, 'HeaderWK12', 12);
        }
    }
}
function ReloadWK13Spots(proptable, settings, data) {
    var colStat = proptable.column(42);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetWKSpots', _UniqueId, 42, 'HeaderWK13', 13);
        }
    }
}
function ReloadWK14Spots(proptable, settings, data) {
    var colStat = proptable.column(43);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetWKSpots', _UniqueId, 43, 'HeaderWK14', 14);
        }
    }
}
function ReloadWeekDay(proptable, settings, data, weekdayId) {
    var _className = '';
    var weekdaycolumnIndex = -1;
    switch (weekdayId) {
        case 1:// Monday
            weekdaycolumnIndex = 11;
            _className = "HeaderWeekDayM";
            break;
        case 2: // Thuesday
            weekdaycolumnIndex = 12;
            _className = 'HeaderWeekDayT';
            break;
        case 3:// Wednesday
            weekdaycolumnIndex = 13;
            _className = "HeaderWeekDayW";
            break;
        case 4: //Thrusday
            weekdaycolumnIndex = 14;
            _className = 'HeaderWeekDayTH';
            break;
        case 5: // Friday
            weekdaycolumnIndex = 15;
            _className = 'HeaderWeekDayF';
            break;
        case 6: //Saturday
            weekdaycolumnIndex = 16;
            _className = 'HeaderWeekDaySA';
            break;
        case 7: // Sunday
            weekdaycolumnIndex = 17;
            _className = 'HeaderWeekDaySU';

            break;
        default:
    }
    var colStat = proptable.column(weekdaycolumnIndex);
    if (colStat.visible()) {
        ReloadWeekString(settings, data, '/ScheduleProposal/GetWeekDay', _UniqueId, weekdaycolumnIndex, _className, weekdayId);
    }

}


function ReloadBool(settings, data, _url, _scheduleProposalId, _col, _className) {
    $.ajax({
        url: _url,
        type: 'POST',
        async: true,
        data: {
            scheduleProposalId: _scheduleProposalId,
        },
        success: function (result) {
            try {
                var header = $('.' + _className).find('.cb-dropdown');
                var sel = data.columns[_col].search.search;
                var sels = sel.split(',');
                var withNonSelected = false;
                if (header) {
                    // First, empty list
                    header.empty();

                    if (sel !== '') {
                        for (var x = 0; x < result.data.length; x++) {
                            // Mark if any is not selected
                            if (jQuery.inArray(result.data[x], sels) == -1) {
                                withNonSelected = true;
                            }
                        }
                    }

                    for (var x = 0; x < result.data.length; x++) {
                        var // wrapped
                            $label = $('<label>'),
                            $text = $('<span>', {
                                text: result.data[x]
                            }),
                            $cb = $('<input>', {
                                type: 'checkbox',
                                checked: (sel === '' ? true : (jQuery.inArray(result.data[x], sels) == -1 ? false : true)),
                                value: result.data[x]
                            });

                        $text.appendTo($label);
                        $cb.appendTo($label);
                        header.append($('<li>').append($label));
                    }

                    // Add Select All
                    var // wrapped
                        $label = $('<label>'),
                        $text = $('<span>', {
                            text: 'Select All'
                        }),
                        $cb = $('<input>', {
                            type: 'checkbox',
                            checked: (sel === '' ? true : (withNonSelected == true ? false : true)),
                            value: 'Select All'
                        });

                    $text.appendTo($label);
                    $cb.appendTo($label);
                    header.prepend($('<li>').append($label));

                    if (withNonSelected === true) {
                        header.addClass("factive");
                    }
                    else {
                        header.removeClass("factive");
                    }

                }
            }
            catch (err) {
                /*
                var notify = $.notify('ReloadBool():  ' + err.message, {
                    type: 'danger',
                    allow_dismiss: true,
                });
                */
            }
        },
        error: function (response) {
            var notify = $.notify(response.responseText, {
                type: 'danger',
                allow_dismiss: true,
            });
        }


    });
}

function ReloadCurrency(settings, data, _url, _scheduleId, _col, _className) {
    var _networkNames = null;
    var _sels = data.columns[_col].search.search.replace(/[\/\\^*?|[\]{}]/g, '');
    if (data.columns.length >= 7) {
        _networkNames = data.columns[7].search.search.replace(/[\/\\^$*?.|[\]{}]/g, '')
    }
    $.ajax({
        url: _url,
        type: 'POST',
        async: true,
        data: {
            scheduleId: _scheduleId,
            sels: _sels,
            filterNetworkNames: _networkNames
        },
        success: function (result) {
            try {
                var thisHeader = $('.' + _className).find('.cb-dropdown');
                //var selCPM = data.columns[_col].search.search.replace(/[\/\\^*?|[\]{}]/g, '');
                //var selCPMs = selCPM.split(',');
                //var withNonSelected = false;
                if (thisHeader) {
                    // First, empty list
                    thisHeader.empty();
                    thisHeader.html(result);

                    //if (selCPM !== '') {
                    //    for (var x = 0; x < result.data.length; x++) {
                    //        // Mark if any is not selected
                    //        if (jQuery.inArray(result.data[x].toString(), selCPMs) == -1) {
                    //            withNonSelected = true;
                    //        }
                    //    }
                    //}

                    //for (var x = 0; x < result.data.length; x++) {
                    //    var // wrapped
                    //        $label = $('<label>'),
                    //        $text = $('<span>', {
                    //            text: $.fn.dataTable.render.number(',', '.', 2, '$').display(result.data[x])
                    //        }),
                    //        $cb = $('<input>', {
                    //            type: 'checkbox',
                    //            checked: (selCPM === '' ? true : (jQuery.inArray(result.data[x].toString(), selCPMs) == -1 ? false : true)),
                    //            value: result.data[x]
                    //        });

                    //    $text.appendTo($label);
                    //    $cb.appendTo($label);
                    //    if (thisHeader.length > 0) {
                    //        if (thisHeader[0].innerText.indexOf($.fn.dataTable.render.number(',', '.', 2, '$').display(result.data[x])) == -1) {
                    //            thisHeader.append($('<li>').append($label));
                    //        }
                    //    }
                    //}

                    //// Add Select All
                    //var // wrapped
                    //    $label = $('<label>'),
                    //    $text = $('<span>', {
                    //        text: 'Select All'
                    //    }),
                    //    $cb = $('<input>', {
                    //        type: 'checkbox',
                    //        checked: (selCPM === '' ? true : (withNonSelected == true ? false : true)),
                    //        value: 'Select All'
                    //    });

                    //$text.appendTo($label);
                    //$cb.appendTo($label);
                    //thisHeader.prepend($('<li>').append($label));

                    //if (withNonSelected === true) {
                    //    thisHeader.addClass("factive");
                    //}
                    //else {
                    //    thisHeader.removeClass("factive");
                    //}

                }
            }
            catch (err) {
                /*
                var notify = $.notify('ReloadCurrency(): ' + err.message, {
                    type: 'danger',
                    allow_dismiss: true,
                });
                */
            }
        },
        error: function (response) {
            var notify = $.notify(response.responseText, {
                type: 'danger',
                allow_dismiss: true,
            });
        }


    });
}

function ReloadDiscount(settings, data, _url, _scheduleId, _col, _className) {
    var _networkNames = null;
    if (data.columns.length >= 7) {
        _networkNames = data.columns[7].search.search.replace(/[\/\\^$*?.|[\]{}]/g, '')
    }
    $.ajax({
        url: _url,
        type: 'POST',
        data: {
            scheduleId: _scheduleId,
            discountRate: parseFloat($("#DiscountPrice").find(":selected").text().replace('%', '')),
            filterNetworkNames: _networkNames
        },
        success: function (result) {
            try {
                var thisHeader = $('.' + _className).find('.cb-dropdown');
                var selCPM = data.columns[_col].search.search.replace(/[\/\\^*?|[\]{}]/g, '');
                var selCPMs = selCPM.split('~');
                var withNonSelected = false;
                if (thisHeader) {
                    // First, empty list
                    thisHeader.empty();

                    if (selCPM !== '') {
                        for (var x = 0; x < result.data.length; x++) {
                            // Mark if any is not selected
                            if (jQuery.inArray(result.data[x].toString(), selCPMs) == -1) {
                                withNonSelected = true;
                            }
                        }
                    }

                    for (var x = 0; x < result.data.length; x++) {
                        var // wrapped
                            $label = $('<label>'),
                            $text = $('<span>', {
                                text: $.fn.dataTable.render.number(',', '.', 2, '$').display(result.data[x])
                            }),
                            $cb = $('<input>', {
                                type: 'checkbox',
                                checked: (selCPM === '' ? true : (jQuery.inArray(result.data[x].toString(), selCPMs) == -1 ? false : true)),
                                value: result.data[x]
                            });

                        $text.appendTo($label);
                        $cb.appendTo($label);
                        if (thisHeader.length > 0) {
                            if (thisHeader[0].innerText.indexOf($.fn.dataTable.render.number(',', '.', 2, '$').display(result.data[x])) == -1) {
                                thisHeader.append($('<li>').append($label));
                            }
                        }
                    }

                    // Add Select All
                    var // wrapped
                        $label = $('<label>'),
                        $text = $('<span>', {
                            text: 'Select All'
                        }),
                        $cb = $('<input>', {
                            type: 'checkbox',
                            checked: (selCPM === '' ? true : (withNonSelected == true ? false : true)),
                            value: 'Select All'
                        });

                    $text.appendTo($label);
                    $cb.appendTo($label);
                    thisHeader.prepend($('<li>').append($label));

                    if (withNonSelected === true) {
                        thisHeader.addClass("factive");
                    }
                    else {
                        thisHeader.removeClass("factive");
                    }

                }
            }
            catch (err) {
                /*
                var notify = $.notify('ReloadCurrency(): ' + err.message, {
                    type: 'danger',
                    allow_dismiss: true,
                });
                */
            }
        },
        error: function (response) {
            var notify = $.notify(response.responseText, {
                type: 'danger',
                allow_dismiss: true,
            });
        }


    });
}

function ReloadStringClient(settings, data, proptable, _scheduleProposalId, _col, _className) {
    var data = proptable.column(_col).data().unique();
    try {
        var header = $('.' + _className).find('.cb-dropdown');
        if (header) {
            header.empty();
            for (var idx = 0; idx < data.length; idx++) {
                var // wrapped
                    $label = $('<label>'),
                    $text = $('<span>', {
                        text: data[x]
                    }),
                    $cb = $('<input>', {
                        type: 'checkbox',
                        checked: true,
                        value: data[x]
                    });

                $text.appendTo($label);
                $cb.appendTo($label);
                if (header.length > 0) {
                    if (header[0].innerText.indexOf(result.data[x]) == -1) {
                        header.append($('<li>').append($label));
                    }
                }
            }
        }
    }
    catch (err) {
    }
}

function ReloadString(settings, data, _url, _scheduleProposalId, _col, _className, _weekNo) {
    try {
        var _networkNames = null;
        var _sels = data.columns[_col].search.search.replace(/[\/\\^$*?|[\]{}]/g, '');
        var _reload = '';

        if (_className == 'HeaderNetworkName' || _className == 'HeaderBuyType' || _className == 'HeaderDemoName') {
            _reload = 'true';
        }
        // Network Names is usually column 7
        // COLINDEX_DEPENDENT 
        if (data.columns.length >= 7) {
            _networkNames = data.columns[7].search.search.replace(/[\/\\^$*?.|[\]{}]/g, '')
        }
        $.ajax({
            url: _url,
            type: 'POST',
            async: true,
            data: {
                scheduleProposalId: _scheduleProposalId,
                filterNetworkNames: _networkNames,
                sels: _sels,
                reload: _reload,
                weekNo: _weekNo
            },
            success: function (result) {
                //var withNonSelected = false;
                try {
                    var header = $('.' + _className).find('.cb-dropdown');
                    //var sel = data.columns[_col].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '');
                    // var sels = sels.split(',');
                    if (header) {
                        // First, empty list
                        header.empty();
                        header.html(result);

                        //if (sel !== '') {
                        //    for (var x = 0; x < result.data.length; x++) {
                        //        // Mark if any is not selected
                        //        if (jQuery.inArray(result.data[x], sels) == -1) {
                        //            withNonSelected = true;
                        //        }
                        //    }
                        //}

                        //for (var x = 0; x < result.data.length; x++) {
                        //    var // wrapped
                        //        $label = $('<label>'),
                        //        $text = $('<span>', {
                        //            text: result.data[x]
                        //        }),
                        //        $cb = $('<input>', {
                        //            type: 'checkbox',
                        //            checked: (sel === '' ? true : (jQuery.inArray(result.data[x], sels) == -1 ? false : true)),
                        //            value: result.data[x]
                        //        });

                        //    $text.appendTo($label);
                        //    $cb.appendTo($label);
                        //    if (header.length > 0) {
                        //        if (header[0].innerText.indexOf(result.data[x]) == -1) {
                        //            header.append($('<li>').append($label));
                        //        }
                        //    }
                        //}
                        // var test = $.parseHTML(result.data.m_StringValue);

                        // Add Select All
                        //var // wrapped
                        //    $label = $('<label>'),
                        //    $text = $('<span>', {
                        //        text: 'Select All'
                        //    }),
                        //    $cb = $('<input>', {
                        //        type: 'checkbox',
                        //        checked: (sel === '' ? true : (withNonSelected == true ? false : true)),
                        //        value: 'Select All'
                        //    });

                        //$text.appendTo($label);
                        //$cb.appendTo($label);
                        //header.prepend($('<li>').append($label));

                        //if (withNonSelected === true) {
                        //    header.addClass("factive");
                        //}
                        //else {
                        //    header.removeClass("factive");
                        //}

                    }
                }
                catch (err) {
                    /*
                    var notify = $.notify('ReloadString():  ' + err.message, {
                        type: 'danger',
                        allow_dismiss: true,
                    });
                    */
                }
            },
            error: function (response) {
                var notify = $.notify(response.responseText, {
                    type: 'danger',
                    allow_dismiss: true,
                });
            }


        });
    }
    catch (err) {
        if (err.message != '') {
            var notify = $.notify('ReloadString():  ' + err.message, {
                type: 'danger',
                allow_dismiss: true,
            });
        }
    }
}
function ReloadWeekString(settings, data, _url, _scheduleProposalId, _col, _className, weekDayId) {
    try {
        var _networkNames = null;
        var _sels = data.columns[_col].search.search.replace(/[\/\\^$*?.|[\]{}]/g, '');
        var _reload = '';

        if (_className == 'HeaderNetworkName' || _className == 'HeaderBuyType' || _className == 'HeaderDemoName') {
            _reload = 'true';
        }
        if (data.columns.length >= 7) {
            _networkNames = data.columns[7].search.search.replace(/[\/\\^$*?.|[\]{}]/g, '')
        }
        $.ajax({
            url: _url,
            type: 'POST',
            async: true,
            data: {
                scheduleProposalId: _scheduleProposalId,
                filterNetworkNames: _networkNames,
                sels: _sels,
                reload: _reload,
                weekDayId: weekDayId
            },
            success: function (result) {
                //var withNonSelected = false;
                try {
                    var header = $('.' + _className).find('.cb-dropdown');
                    if (header) {
                        // First, empty list
                        header.empty();
                        header.html(result);
                    }
                    // Hide Main Overlay After Full Page Load, BY Shariq 2022-08-31
                    if (_col === 17) {
                        setTimeout(function () {
                            HideOverlayMain();
                        }, 2500);
                    }
                }
                catch (err) {
                    /*
                    var notify = $.notify('ReloadString():  ' + err.message, {
                        type: 'danger',
                        allow_dismiss: true,
                    });
                    */
                }
            },
            error: function (response) {
                var notify = $.notify(response.responseText, {
                    type: 'danger',
                    allow_dismiss: true,
                });
            }


        });
    }
    catch (err) {
        if (err.message != '') {
            var notify = $.notify('ReloadString():  ' + err.message, {
                type: 'danger',
                allow_dismiss: true,
            });
        }
    }
}
function ReloadDates(settings, data, _url, _scheduleProposalId, _col, _className) {
    var _networkNames = null;
    var _sels = data.columns[_col].search.search.replace(/[\\^$*?.|[\]{}]/g, '');
    if (data.columns.length >= 7) {
        _networkNames = data.columns[7].search.search.replace(/[\/\\^$*?.|[\]{}]/g, '')
    }
    $.ajax({
        url: _url,
        type: 'POST',
        async: true,
        data: {
            scheduleId: _UniqueId,
            sels: _sels,
            filterNetworkNames: _networkNames
        },
        success: function (result) {
            try {
                var header = $('.' + _className).find('.cb-dropdown');
                // var sel = data.columns[_col].search.search.replace(/\\/g, '');
                //var sels = sels.split(',');
                //var withNonSelected = false;
                if (header) {
                    // First, empty list
                    header.empty();
                    header.html(result);
                    //if (sel !== '') {
                    //    for (var x = 0; x < result.data.length; x++) {
                    //        // Mark if any is not selected
                    //        if (jQuery.inArray(moment(result.data[x]).format("MM/DD/YYYY"), sels) == -1) {
                    //            withNonSelected = true;
                    //        }
                    //    }
                    //}

                    //for (var x = 0; x < result.data.length; x++) {
                    //    var // wrapped
                    //        $label = $('<label>'),
                    //        $text = $('<span>', {
                    //            text: moment(result.data[x]).format("MM/DD/YYYY")
                    //        }),
                    //        $cb = $('<input>', {
                    //            type: 'checkbox',
                    //            checked: (sel === '' ? true : (jQuery.inArray(moment(result.data[x]).format("MM/DD/YYYY"), sels) == -1 ? false : true)),
                    //            value: moment(result.data[x]).format("MM/DD/YYYY")
                    //        });

                    //    $text.appendTo($label);
                    //    $cb.appendTo($label);
                    //    if (header.length > 0) {
                    //        if (header[0].innerText.indexOf(moment(result.data[x]).format("MM/DD/YYYY")) == -1) {
                    //            header.append($('<li>').append($label));
                    //        }
                    //    }
                    //}

                    //// Add Select All
                    //var // wrapped
                    //    $label = $('<label>'),
                    //    $text = $('<span>', {
                    //        text: 'Select All'
                    //    }),
                    //    $cb = $('<input>', {
                    //        type: 'checkbox',
                    //        checked: (sel === '' ? true : (withNonSelected == true ? false : true)),
                    //        value: 'Select All'
                    //    });

                    //$text.appendTo($label);
                    //$cb.appendTo($label);
                    //header.prepend($('<li>').append($label));

                    //if (withNonSelected === true) {
                    //    header.addClass("factive");
                    //}
                    //else {
                    //    header.removeClass("factive");
                    //}

                }
            }
            catch (err) {
                /*
                var notify = $.notify('ReloadDates():  ' + err.message, {
                    type: 'danger',
                    allow_dismiss: true,
                });
                */
            }
        },
        error: function (response) {
            var notify = $.notify(response.responseText, {
                type: 'danger',
                allow_dismiss: true,
            });
        }


    });
}

var HeaderFilterList = {};
var PropTableDataSource;
function ReloadAll(settings, dataForDropdown) {
    var proptable = $("#MyProposalTable").DataTable();
    if (proptable) {
        var networkFilter = dataForDropdown;
        selectedColIndex = [];
        for (let n = 0; n < settings.aoPreSearchCols.length; n++) {
            if (settings.aoPreSearchCols[n].sSearch != '') {
                GetFilterColIndex(n);
            }
        }

        if (selectedColIndex.indexOf(7) == -1 && selectedColIndex.length >= 0) {
            HeaderFilterList = {};
            PropTableDataSource = dataForDropdown;
        }
        var isNetworkFilter = localStorage.getItem("isNetworkFilter");
        if (selectedColIndex.indexOf(7) != -1 && isNetworkFilter == 'true') {
            HeaderFilterList = {};
            PropTableDataSource = proptable.data();
        }

        if (selectedColIndex.indexOf(7) != -1 && selectedColIndex.length == 1 && isNetworkFilter == 'false') {
            HeaderFilterList = {};
            PropTableDataSource = proptable.data();
        }

        var isPropertyFilter = localStorage.getItem("isPropertyFilter");
        if (selectedColIndex.indexOf(8) != -1 && isPropertyFilter == 'true') {
            HeaderFilterList = {};
            PropTableDataSource = proptable.data();
        }

        if (Object.values(HeaderFilterList).length == 0) {


            if (!HeaderFilterList["approvedDesc"])
                HeaderFilterList["approvedDesc"] = [];
            if (!HeaderFilterList["approvedDescFilter"])
                HeaderFilterList["approvedDescFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            if (!HeaderFilterList["doNotBuyTypeDescription"])
                HeaderFilterList["doNotBuyTypeDescription"] = [];
            if (!HeaderFilterList["doNotBuyTypeDescriptionFilter"])
                HeaderFilterList["doNotBuyTypeDescriptionFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            if (!HeaderFilterList["propertyName"])
                HeaderFilterList["propertyName"] = [];
            if (!HeaderFilterList["propertyNameFilter"])
                HeaderFilterList["propertyNameFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            if (!HeaderFilterList["dayPartCd"])
                HeaderFilterList["dayPartCd"] = [];
            if (!HeaderFilterList["dayPartCdFilter"])
                HeaderFilterList["dayPartCdFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            if (!HeaderFilterList["omdp"])
                HeaderFilterList["omdp"] = [];
            if (!HeaderFilterList["omdpFilter"])
                HeaderFilterList["omdpFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            if (!HeaderFilterList["startToEndTime"])
                HeaderFilterList["startToEndTime"] = [];
            if (!HeaderFilterList["startToEndTimeFilter"])
                HeaderFilterList["startToEndTimeFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            if (!HeaderFilterList["buyTypeCode"])
                HeaderFilterList["buyTypeCode"] = [];
            if (!HeaderFilterList["buyTypeCodeFilter"])
                HeaderFilterList["buyTypeCodeFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            if (!HeaderFilterList["spotLen"])
                HeaderFilterList["spotLen"] = [];
            if (!HeaderFilterList["spotLenFilter"])
                HeaderFilterList["spotLenFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            if (!HeaderFilterList["impressions"])
                HeaderFilterList["impressions"] = [];
            if (!HeaderFilterList["impressionsFilter"])
                HeaderFilterList["impressionsFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            if (!HeaderFilterList["demoName"])
                HeaderFilterList["demoName"] = [];
            if (!HeaderFilterList["demoNameFilter"])
                HeaderFilterList["demoNameFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            if (!HeaderFilterList["networkName"])
                HeaderFilterList["networkName"] = [];
            if (!HeaderFilterList["networkNameFilter"])
                HeaderFilterList["networkNameFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            if (!HeaderFilterList["totalSpots"])
                HeaderFilterList["totalSpots"] = [];
            if (!HeaderFilterList["totalSpotsFilter"])
                HeaderFilterList["totalSpotsFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            if (!HeaderFilterList["rateAmt"])
                HeaderFilterList["rateAmt"] = [];
            if (!HeaderFilterList["rateAmtFilter"])
                HeaderFilterList["rateAmtFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            if (!HeaderFilterList["cpm"])
                HeaderFilterList["cpm"] = [];
            if (!HeaderFilterList["cpmFilter"])
                HeaderFilterList["cpmFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            if (!HeaderFilterList["rateRevision"])
                HeaderFilterList["rateRevision"] = [];
            if (!HeaderFilterList["rateRevisionFilter"])
                HeaderFilterList["rateRevisionFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            if (!HeaderFilterList["discount"])
                HeaderFilterList["discount"] = [];
            if (!HeaderFilterList["discountFilter"])
                HeaderFilterList["discountFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            if (!HeaderFilterList["rateUpdateDt"])
                HeaderFilterList["rateUpdateDt"] = [];
            if (!HeaderFilterList["rateUpdateDtFilter"])
                HeaderFilterList["rateUpdateDtFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            if (!HeaderFilterList["effectiveDate"])
                HeaderFilterList["effectiveDate"] = [];
            if (!HeaderFilterList["effectiveDateFilter"])
                HeaderFilterList["effectiveDateFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            if (!HeaderFilterList["expirationDate"])
                HeaderFilterList["expirationDate"] = [];
            if (!HeaderFilterList["expirationDateFilter"])
                HeaderFilterList["expirationDateFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            if (!HeaderFilterList["usdRate"])
                HeaderFilterList["usdRate"] = [];
            if (!HeaderFilterList["usdRateFilter"])
                HeaderFilterList["usdRateFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            if (!HeaderFilterList["spBuy"])
                HeaderFilterList["spBuy"] = [];
            if (!HeaderFilterList["spBuyFilter"])
                HeaderFilterList["spBuyFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            //Weekly Spots
            if (!HeaderFilterList["wk01_Spots"])
                HeaderFilterList["wk01_Spots"] = [];
            if (!HeaderFilterList["wk01_SpotsFilter"])
                HeaderFilterList["wk01_SpotsFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            if (!HeaderFilterList["wk02_Spots"])
                HeaderFilterList["wk02_Spots"] = [];
            if (!HeaderFilterList["wk02_SpotsFilter"])
                HeaderFilterList["wk02_SpotsFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            if (!HeaderFilterList["wk03_Spots"])
                HeaderFilterList["wk03_Spots"] = [];
            if (!HeaderFilterList["wk03_SpotsFilter"])
                HeaderFilterList["wk03_SpotsFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            if (!HeaderFilterList["wk04_Spots"])
                HeaderFilterList["wk04_Spots"] = [];
            if (!HeaderFilterList["wk04_SpotsFilter"])
                HeaderFilterList["wk04_SpotsFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            if (!HeaderFilterList["wk05_Spots"])
                HeaderFilterList["wk05_Spots"] = [];
            if (!HeaderFilterList["wk05_SpotsFilter"])
                HeaderFilterList["wk05_SpotsFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            if (!HeaderFilterList["wk06_Spots"])
                HeaderFilterList["wk06_Spots"] = [];
            if (!HeaderFilterList["wk06_SpotsFilter"])
                HeaderFilterList["wk06_SpotsFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            if (!HeaderFilterList["wk07_Spots"])
                HeaderFilterList["wk07_Spots"] = [];
            if (!HeaderFilterList["wk07_SpotsFilter"])
                HeaderFilterList["wk07_SpotsFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            if (!HeaderFilterList["wk08_Spots"])
                HeaderFilterList["wk08_Spots"] = [];
            if (!HeaderFilterList["wk08_SpotsFilter"])
                HeaderFilterList["wk08_SpotsFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            if (!HeaderFilterList["wk09_Spots"])
                HeaderFilterList["wk09_Spots"] = [];
            if (!HeaderFilterList["wk09_SpotsFilter"])
                HeaderFilterList["wk09_SpotsFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            if (!HeaderFilterList["wk10_Spots"])
                HeaderFilterList["wk10_Spots"] = [];
            if (!HeaderFilterList["wk10_SpotsFilter"])
                HeaderFilterList["wk10_SpotsFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            if (!HeaderFilterList["wk11_Spots"])
                HeaderFilterList["wk11_Spots"] = [];
            if (!HeaderFilterList["wk11_SpotsFilter"])
                HeaderFilterList["wk11_SpotsFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            if (!HeaderFilterList["wk12_Spots"])
                HeaderFilterList["wk12_Spots"] = [];
            if (!HeaderFilterList["wk12_SpotsFilter"])
                HeaderFilterList["wk12_SpotsFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            if (!HeaderFilterList["wk13_Spots"])
                HeaderFilterList["wk13_Spots"] = [];
            if (!HeaderFilterList["wk13_SpotsFilter"])
                HeaderFilterList["wk13_SpotsFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            if (!HeaderFilterList["wk14_Spots"])
                HeaderFilterList["wk14_Spots"] = [];
            if (!HeaderFilterList["wk14_SpotsFilter"])
                HeaderFilterList["wk14_SpotsFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';


            if (!HeaderFilterList["dow"])
                HeaderFilterList["dow"] = [];
            if (!HeaderFilterList["dowFilter"])
                HeaderFilterList["dowFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            // Week Days
            //if (!HeaderFilterList["monday"])
            //    HeaderFilterList["monday"] = [];
            //if (!HeaderFilterList["mondayFilter"])
            //    HeaderFilterList["mondayFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            //if (!HeaderFilterList["tuesday"])
            //    HeaderFilterList["tuesday"] = [];
            //if (!HeaderFilterList["tuesdayFilter"])
            //    HeaderFilterList["tuesdayFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            //if (!HeaderFilterList["wednesday"])
            //    HeaderFilterList["wednesday"] = [];
            //if (!HeaderFilterList["wednesdayFilter"])
            //    HeaderFilterList["wednesdayFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            //if (!HeaderFilterList["thursday"])
            //    HeaderFilterList["thursday"] = [];
            //if (!HeaderFilterList["thursdayFilter"])
            //    HeaderFilterList["thursdayFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            //if (!HeaderFilterList["friday"])
            //    HeaderFilterList["friday"] = [];
            //if (!HeaderFilterList["fridayFilter"])
            //    HeaderFilterList["fridayFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            //if (!HeaderFilterList["saturday"])
            //    HeaderFilterList["saturday"] = [];
            //if (!HeaderFilterList["saturdayFilter"])
            //    HeaderFilterList["saturdayFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            //if (!HeaderFilterList["sunday"])
            //    HeaderFilterList["sunday"] = [];
            //if (!HeaderFilterList["sundayFilter"])
            //    HeaderFilterList["sundayFilter"] = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';

            if (selectedColIndex.indexOf(7) != -1 && isNetworkFilter == 'false' || selectedColIndex.indexOf(8) != -1 && isPropertyFilter == 'false') {
                if (PropTableDataSource == undefined) {
                    HeaderFilterList = JSON.parse(localStorage.getItem("HeaderFilterList"));
                }
            }
            if (PropTableDataSource != undefined) {
                $.each(PropTableDataSource, function () {
                    // ReloadApproved                
                    if (HeaderFilterList["approvedDesc"].length == 0) {
                        HeaderFilterList["approvedDesc"].push(this["approvedDesc"].trim());
                        HeaderFilterList["approvedDescFilter"] = HeaderFilterList["approvedDescFilter"] + '<li><label><span>' + this["approvedDesc"].trim() + '</span><input type=checkbox checked value="' + this["approvedDesc"].trim() + '"></label></li>';
                    }
                    else {
                        if (HeaderFilterList["approvedDesc"].length > 0 && HeaderFilterList["approvedDesc"].indexOf(this["approvedDesc"].trim()) === -1) {
                            HeaderFilterList["approvedDesc"].push(this["approvedDesc"].trim());
                            HeaderFilterList["approvedDescFilter"] = HeaderFilterList["approvedDescFilter"] + '<li><label><span>' + this["approvedDesc"].trim() + '</span><input type=checkbox checked value="' + this["approvedDesc"].trim() + '"></label></li>';
                        }
                    }
                    // ReloadDoNotBuyTypes
                    if (HeaderFilterList["doNotBuyTypeDescription"].length == 0) {
                        HeaderFilterList["doNotBuyTypeDescription"].push(this["doNotBuyTypeDescription"].trim());
                        HeaderFilterList["doNotBuyTypeDescriptionFilter"] = HeaderFilterList["doNotBuyTypeDescriptionFilter"] + '<li><label><span>' + this["doNotBuyTypeDescription"].trim() + '</span><input type=checkbox checked value="' + this["doNotBuyTypeDescription"].trim() + '"></label></li>';
                    }
                    else {
                        if (HeaderFilterList["doNotBuyTypeDescription"].length > 0 && HeaderFilterList["doNotBuyTypeDescription"].indexOf(this["doNotBuyTypeDescription"].trim()) === -1) {
                            HeaderFilterList["doNotBuyTypeDescription"].push(this["doNotBuyTypeDescription"].trim());
                            HeaderFilterList["doNotBuyTypeDescriptionFilter"] = HeaderFilterList["doNotBuyTypeDescriptionFilter"] + '<li><label><span>' + this["doNotBuyTypeDescription"].trim() + '</span><input type=checkbox checked value="' + this["doNotBuyTypeDescription"].trim() + '"></label></li>';
                        }
                    }
                    //ReloadPropertyNames
                    if (selectedColIndex.indexOf(7) != -1 && selectedColIndex.length == 1) {
                    if (HeaderFilterList["propertyName"].length == 0) {
                        HeaderFilterList["propertyName"].push(this["propertyName"].trim());
                        HeaderFilterList["propertyNameFilter"] = HeaderFilterList["propertyNameFilter"] + '<li><label><span>' + this["propertyName"].trim() + '</span><input type=checkbox checked value="' + this["propertyName"].trim() + '"></label></li>';

                    }
                    else {
                        if (HeaderFilterList["propertyName"].length > 0 && HeaderFilterList["propertyName"].indexOf(this["propertyName"].trim()) === -1) {
                            HeaderFilterList["propertyName"].push(this["propertyName"].trim());
                            HeaderFilterList["propertyNameFilter"] = HeaderFilterList["propertyNameFilter"] + '<li><label><span>' + this["propertyName"].trim() + '</span><input type=checkbox checked value="' + this["propertyName"].trim() + '"></label></li>';
                        }
                    }
                    }
                    if (selectedColIndex.indexOf(7) != -1 && selectedColIndex.length > 1) { 
                        var HeaderFilterList1 = JSON.parse(localStorage.getItem("HeaderFilterList"));
                        HeaderFilterList["propertyName"] = HeaderFilterList1["propertyName"];
                        HeaderFilterList["propertyNameFilter"] = HeaderFilterList1["propertyNameFilter"];                                 
                    }
                   
                    // ReloadDayPart
                    if (HeaderFilterList["dayPartCd"].length == 0) {
                        HeaderFilterList["dayPartCd"].push(this["dayPartCd"].trim());
                        HeaderFilterList["dayPartCdFilter"] = HeaderFilterList["dayPartCdFilter"] + '<li><label><span>' + this["dayPartCd"].trim() + '</span><input type=checkbox checked value="' + this["dayPartCd"].trim() + '"></label></li>';
                    }
                    else {
                        if (HeaderFilterList["dayPartCd"].length > 0 && HeaderFilterList["dayPartCd"].indexOf(this["dayPartCd"].trim()) === -1) {
                            HeaderFilterList["dayPartCd"].push(this["dayPartCd"].trim());
                            HeaderFilterList["dayPartCdFilter"] = HeaderFilterList["dayPartCdFilter"] + '<li><label><span>' + this["dayPartCd"].trim() + '</span><input type=checkbox checked value="' + this["dayPartCd"].trim() + '"></label></li>';
                        }
                    }
                    // ReloadOMDP
                    if (HeaderFilterList["omdp"].length == 0) {
                        HeaderFilterList["omdp"].push(this["omdp"].trim());
                        HeaderFilterList["omdpFilter"] = HeaderFilterList["omdpFilter"] + '<li><label><span>' + this["omdp"].trim() + '</span><input type=checkbox checked value="' + this["omdp"].trim() + '"></label></li>';
                    }
                    else {
                        if (HeaderFilterList["omdp"].length > 0 && HeaderFilterList["omdp"].indexOf(this["omdp"].trim()) === -1) {
                            HeaderFilterList["omdp"].push(this["omdp"].trim());
                            HeaderFilterList["omdpFilter"] = HeaderFilterList["omdpFilter"] + '<li><label><span>' + this["omdp"].trim() + '</span><input type=checkbox checked value="' + this["omdp"].trim() + '"></label></li>';
                        }
                    }
                    // ReloadStartToEnd
                    if (HeaderFilterList["startToEndTime"].length == 0) {
                        HeaderFilterList["startToEndTime"].push(this["startToEndTime"].trim());
                        HeaderFilterList["startToEndTimeFilter"] = HeaderFilterList["startToEndTimeFilter"] + '<li><label><span>' + this["startToEndTime"].trim() + '</span><input type=checkbox checked value="' + this["startToEndTime"].trim() + '"></label></li>';
                    }
                    else {
                        if (HeaderFilterList["startToEndTime"].length > 0 && HeaderFilterList["startToEndTime"].indexOf(this["startToEndTime"].trim()) === -1) {
                            HeaderFilterList["startToEndTime"].push(this["startToEndTime"].trim());
                            HeaderFilterList["startToEndTimeFilter"] = HeaderFilterList["startToEndTimeFilter"] + '<li><label><span>' + this["startToEndTime"].trim() + '</span><input type=checkbox checked value="' + this["startToEndTime"].trim() + '"></label></li>';
                        }
                    }
                    //ReloadBuyType
                    if (HeaderFilterList["buyTypeCode"].length == 0) {
                        HeaderFilterList["buyTypeCode"].push(this["buyTypeCode"].trim());
                        HeaderFilterList["buyTypeCodeFilter"] = HeaderFilterList["buyTypeCodeFilter"] + '<li><label><span>' + this["buyTypeCode"].trim() + '</span><input type=checkbox checked value="' + this["buyTypeCode"].trim() + '"></label></li>';
                    }
                    else {
                        if (HeaderFilterList["buyTypeCode"].length > 0 && HeaderFilterList["buyTypeCode"].indexOf(this["buyTypeCode"].trim()) === -1) {
                            HeaderFilterList["buyTypeCode"].push(this["buyTypeCode"].trim());
                            HeaderFilterList["buyTypeCodeFilter"] = HeaderFilterList["buyTypeCodeFilter"] + '<li><label><span>' + this["buyTypeCode"].trim() + '</span><input type=checkbox checked value="' + this["buyTypeCode"].trim() + '"></label></li>';
                        }
                    }
                    //Reload spotLen
                    if (HeaderFilterList["spotLen"].length == 0) {
                        HeaderFilterList["spotLen"].push(this["spotLen"]);
                        HeaderFilterList["spotLenFilter"] = HeaderFilterList["spotLenFilter"] + '<li><label><span>' + this["spotLen"] + '</span><input type=checkbox checked value="' + this["spotLen"] + '"></label></li>';
                    }
                    else {
                        if (HeaderFilterList["spotLen"].length > 0 && HeaderFilterList["spotLen"].indexOf(this["spotLen"]) === -1) {
                            HeaderFilterList["spotLen"].push(this["spotLen"]);
                            HeaderFilterList["spotLenFilter"] = HeaderFilterList["spotLenFilter"] + '<li><label><span>' + this["spotLen"] + '</span><input type=checkbox checked value="' + this["spotLen"] + '"></label></li>';
                        }
                    }
                    //Reload impressions
                    if (HeaderFilterList["impressions"].length == 0) {

                        HeaderFilterList["impressions"].push(this["impressions"]);
                        HeaderFilterList["impressionsFilter"] = HeaderFilterList["impressionsFilter"] + '<li><label><span>' + this["impressions"] + '</span><input type=checkbox checked value="' + this["impressions"] + '"></label></li>';
                    }
                    else {

                        if (HeaderFilterList["impressions"].length > 0 && HeaderFilterList["impressions"].indexOf(this["impressions"]) === -1) {
                            HeaderFilterList["impressions"].push(this["impressions"]);
                            HeaderFilterList["impressionsFilter"] = HeaderFilterList["impressionsFilter"] + '<li><label><span>' + this["impressions"] + '</span><input type=checkbox checked value="' + this["impressions"] + '"></label></li>';
                        }
                    }
                    //Reload demoName
                    if (HeaderFilterList["demoName"].length == 0) {
                        HeaderFilterList["demoName"].push(this["demoName"].trim());
                        HeaderFilterList["demoNameFilter"] = HeaderFilterList["demoNameFilter"] + '<li><label><span>' + this["demoName"].trim() + '</span><input type=checkbox checked value="' + this["demoName"].trim() + '"></label></li>';
                    }
                    else {
                        if (HeaderFilterList["demoName"].length > 0 && HeaderFilterList["demoName"].indexOf(this["demoName"].trim()) === -1) {
                            HeaderFilterList["demoName"].push(this["demoName"].trim());
                            HeaderFilterList["demoNameFilter"] = HeaderFilterList["demoNameFilter"] + '<li><label><span>' + this["demoName"].trim() + '</span><input type=checkbox checked value="' + this["demoName"].trim() + '"></label></li>';
                        }
                    }
                    ////Reload networkName                

                    //if (HeaderFilterList["networkName"].length == 0) {
                    //    HeaderFilterList["networkName"].push(this["networkName"].trim());
                    //    HeaderFilterList["networkNameFilter"] = HeaderFilterList["networkNameFilter"] + '<li><label><span>' + this["networkName"].trim() + '</span><input type=checkbox checked value="' + this["networkName"].trim() + '"></label></li>';
                    //}
                    //else {
                    //    if (HeaderFilterList["networkName"].length > 0 && HeaderFilterList["networkName"].indexOf(this["networkName"].trim()) === -1) {
                    //        HeaderFilterList["networkName"].push(this["networkName"].trim());
                    //        HeaderFilterList["networkNameFilter"] = HeaderFilterList["networkNameFilter"] + '<li><label><span>' + this["networkName"].trim() + '</span><input type=checkbox checked value="' + this["networkName"].trim() + '"></label></li>';
                    //    }
                    //}                                
                    //Reload totalSpots
                    if (HeaderFilterList["totalSpots"].length == 0) {
                        HeaderFilterList["totalSpots"].push(this["totalSpots"]);
                        HeaderFilterList["totalSpotsFilter"] = HeaderFilterList["totalSpotsFilter"] + '<li><label><span>' + this["totalSpots"] + '</span><input type=checkbox checked value="' + this["totalSpots"] + '"></label></li>';
                    }
                    else {
                        if (HeaderFilterList["totalSpots"].length > 0 && HeaderFilterList["totalSpots"].indexOf(this["totalSpots"]) === -1) {
                            HeaderFilterList["totalSpots"].push(this["totalSpots"]);
                            HeaderFilterList["totalSpotsFilter"] = HeaderFilterList["totalSpotsFilter"] + '<li><label><span>' + this["totalSpots"] + '</span><input type=checkbox checked value="' + this["totalSpots"] + '"></label></li>';
                        }
                    }
                    //Reload rateAmt
                    if (HeaderFilterList["rateAmt"].length == 0) {

                        HeaderFilterList["rateAmt"].push(this["rateAmt"]);
                        HeaderFilterList["rateAmtFilter"] = HeaderFilterList["rateAmtFilter"] + '<li><label><span>' + this["rateAmt"] + '</span><input type=checkbox checked value="' + this["rateAmt"] + '"></label></li>';
                    }
                    else {

                        if (HeaderFilterList["rateAmt"].length > 0 && HeaderFilterList["rateAmt"].indexOf(this["rateAmt"]) === -1) {
                            HeaderFilterList["rateAmt"].push(this["rateAmt"]);
                            HeaderFilterList["rateAmtFilter"] = HeaderFilterList["rateAmtFilter"] + '<li><label><span>' + this["rateAmt"] + '</span><input type=checkbox checked value="' + this["rateAmt"] + '"></label></li>';
                        }
                    }
                    //Reload discountRate/Rate
                    if (HeaderFilterList["discount"].length == 0) {

                        HeaderFilterList["discount"].push(this["discount"]);
                        HeaderFilterList["discountFilter"] = HeaderFilterList["discountFilter"] + '<li><label><span>' + this["discount"] + '</span><input type=checkbox checked value="' + this["discount"] + '"></label></li>';
                    }
                    else {

                        if (HeaderFilterList["discount"].length > 0 && HeaderFilterList["discount"].indexOf(this["discount"]) === -1) {
                            HeaderFilterList["discount"].push(this["discount"]);
                            HeaderFilterList["discountFilter"] = HeaderFilterList["discountFilter"] + '<li><label><span>' + this["discount"] + '</span><input type=checkbox checked value="' + this["discount"] + '"></label></li>';
                        }
                    }

                    //Reload cpm
                    if (HeaderFilterList["cpm"].length == 0) {

                        HeaderFilterList["cpm"].push(this["cpm"]);
                        HeaderFilterList["cpmFilter"] = HeaderFilterList["cpmFilter"] + '<li><label><span>' + this["cpm"] + '</span><input type=checkbox checked value="' + this["cpm"] + '"></label></li>';
                    }
                    else {

                        if (HeaderFilterList["cpm"].length > 0 && HeaderFilterList["cpm"].indexOf(this["cpm"]) === -1) {
                            HeaderFilterList["cpm"].push(this["cpm"]);
                            HeaderFilterList["cpmFilter"] = HeaderFilterList["cpmFilter"] + '<li><label><span>' + this["cpm"] + '</span><input type=checkbox checked value="' + this["cpm"] + '"></label></li>';
                        }
                    }

                    //Reload rateRevision
                    if (HeaderFilterList["rateRevision"].length == 0) {
                        if (this["rateRevision"].trim() != -1) {
                            HeaderFilterList["rateRevision"].push(this["rateRevision"].trim());
                            HeaderFilterList["rateRevisionFilter"] = HeaderFilterList["rateRevisionFilter"] + '<li><label><span>' + this["rateRevision"].trim() + '</span><input type=checkbox checked value="' + this["rateRevision"].trim() + '"></label></li>';
                        }
                    }
                    else {
                        if (this["rateRevision"].trim() != -1) {
                            if (HeaderFilterList["rateRevision"].length > 0 && HeaderFilterList["rateRevision"].indexOf(this["rateRevision"].trim()) === -1) {
                                HeaderFilterList["rateRevision"].push(this["rateRevision"].trim());
                                HeaderFilterList["rateRevisionFilter"] = HeaderFilterList["rateRevisionFilter"] + '<li><label><span>' + this["rateRevision"].trim() + '</span><input type=checkbox checked value="' + this["rateRevision"].trim() + '"></label></li>';
                            }
                        }
                    }
                    //Reload rateUpdateDt
                    if (HeaderFilterList["rateUpdateDt"].length == 0) {                        
                        var incomingDt = this["rateUpdateDt"].toString().split("-");
                        var dtValue = incomingDt[1] + "/" + incomingDt[2].split("T")[0] + "/" + incomingDt[0] + " 12:00:00" + ' AM';
                        var formattedDate = incomingDt[1] + "/" + incomingDt[2].split("T")[0];// + "/" + incomingDt[0] + " 12:00:00" + ' AM';
                        HeaderFilterList["rateUpdateDt"].push(formattedDate);
                        HeaderFilterList["rateUpdateDtFilter"] = HeaderFilterList["rateUpdateDtFilter"] + '<li><label><span>' + formattedDate + '</span><input type=checkbox checked value="' + dtValue + '"></label></li>';
                    }
                    else {                        
                        var incomingDt = this["rateUpdateDt"].toString().split("-");
                        var dtValue = incomingDt[1] + "/" + incomingDt[2].split("T")[0] + "/" + incomingDt[0] + " 12:00:00" + ' AM';
                        var formattedDate = incomingDt[1] + "/" + incomingDt[2].split("T")[0];// + "/" + incomingDt[0] + " 12:00:00" + ' AM';
                        if (HeaderFilterList["rateUpdateDt"].length > 0 && HeaderFilterList["rateUpdateDt"].indexOf(formattedDate) === -1) {
                            HeaderFilterList["rateUpdateDt"].push(formattedDate);
                            HeaderFilterList["rateUpdateDtFilter"] = HeaderFilterList["rateUpdateDtFilter"] + '<li><label><span>' + formattedDate + '</span><input type=checkbox checked value="' + dtValue + '"></label></li>';
                        }
                    }
                    //Reload effectiveDate
                    if (HeaderFilterList["effectiveDate"].length == 0) {
                        HeaderFilterList["effectiveDate"].push(this["effectiveDate"].trim());
                        HeaderFilterList["effectiveDateFilter"] = HeaderFilterList["effectiveDateFilter"] + '<li><label><span>' + this["effectiveDate"].trim() + '</span><input type=checkbox checked value="' + this["effectiveDate"].trim() + '"></label></li>';
                    }
                    else {
                        if (HeaderFilterList["effectiveDate"].length > 0 && HeaderFilterList["effectiveDate"].indexOf(this["effectiveDate"].trim()) === -1) {
                            HeaderFilterList["effectiveDate"].push(this["effectiveDate"].trim());
                            HeaderFilterList["effectiveDateFilter"] = HeaderFilterList["effectiveDateFilter"] + '<li><label><span>' + this["effectiveDate"].trim() + '</span><input type=checkbox checked value="' + this["effectiveDate"].trim() + '"></label></li>';
                        }
                    }

                    //Reload expirationDate
                    if (HeaderFilterList["expirationDate"].length == 0) {
                        HeaderFilterList["expirationDate"].push(this["expirationDate"].trim());
                        HeaderFilterList["expirationDateFilter"] = HeaderFilterList["expirationDateFilter"] + '<li><label><span>' + this["expirationDate"].trim() + '</span><input type=checkbox checked value="' + this["expirationDate"].trim() + '"></label></li>';
                    }
                    else {
                        if (HeaderFilterList["expirationDate"].length > 0 && HeaderFilterList["expirationDate"].indexOf(this["expirationDate"].trim()) === -1) {
                            HeaderFilterList["expirationDate"].push(this["expirationDate"].trim());
                            HeaderFilterList["expirationDateFilter"] = HeaderFilterList["expirationDateFilter"] + '<li><label><span>' + this["expirationDate"].trim() + '</span><input type=checkbox checked value="' + this["expirationDate"].trim() + '"></label></li>';
                        }
                    }
                    //Reload usdRate
                    if (HeaderFilterList["usdRate"].length == 0) {
                        HeaderFilterList["usdRate"].push(this["usdRate"]);
                        HeaderFilterList["usdRateFilter"] = HeaderFilterList["usdRateFilter"] + '<li><label><span>' + this["usdRate"] + '</span><input type=checkbox checked value="' + this["usdRate"] + '"></label></li>';
                    }
                    else {
                        if (HeaderFilterList["usdRate"].length > 0 && HeaderFilterList["usdRate"].indexOf(this["usdRate"]) === -1) {
                            HeaderFilterList["usdRate"].push(this["usdRate"]);
                            HeaderFilterList["usdRateFilter"] = HeaderFilterList["usdRateFilter"] + '<li><label><span>' + this["usdRate"] + '</span><input type=checkbox checked value="' + this["usdRate"] + '"></label></li>';
                        }
                    }

                    //Reload spBuy
                    if (HeaderFilterList["spBuy"].length == 0) {
                        var spBuy = this["spBuy"].trim() == "True" ? "SP" : "";
                        HeaderFilterList["spBuy"].push(spBuy);
                        HeaderFilterList["spBuyFilter"] = HeaderFilterList["spBuyFilter"] + '<li><label><span>' + spBuy + '</span><input type=checkbox checked value="' + this["spBuy"].trim() + '"></label></li>';
                    }
                    else {
                        var spBuy = this["spBuy"].trim() == "True" ? "SP" : "";
                        if (HeaderFilterList["spBuy"].length > 0 && HeaderFilterList["spBuy"].indexOf(spBuy) === -1) {
                            HeaderFilterList["spBuy"].push(spBuy);
                            HeaderFilterList["spBuyFilter"] = HeaderFilterList["spBuyFilter"] + '<li><label><span>' + spBuy + '</span><input type=checkbox checked value="' + this["spBuy"].trim() + '"></label></li>';
                        }
                    }


                    // Reaload wekkkly Spots
                    //Reload wk01_Spots
                    if (HeaderFilterList["wk01_Spots"].length == 0) {
                        HeaderFilterList["wk01_Spots"].push(this["wk01_Spots"]);
                        HeaderFilterList["wk01_SpotsFilter"] = HeaderFilterList["wk01_SpotsFilter"] + '<li><label><span>' + this["wk01_Spots"] + '</span><input type=checkbox checked value="' + this["wk01_Spots"] + '"></label></li>';
                    }
                    else {
                        if (HeaderFilterList["wk01_Spots"].length > 0 && HeaderFilterList["wk01_Spots"].indexOf(this["wk01_Spots"]) === -1) {
                            HeaderFilterList["wk01_Spots"].push(this["wk01_Spots"]);
                            HeaderFilterList["wk01_SpotsFilter"] = HeaderFilterList["wk01_SpotsFilter"] + '<li><label><span>' + this["wk01_Spots"] + '</span><input type=checkbox checked value="' + this["wk01_Spots"] + '"></label></li>';
                        }
                    }

                    //Reload wk02_Spots
                    if (HeaderFilterList["wk02_Spots"].length == 0) {
                        HeaderFilterList["wk02_Spots"].push(this["wk02_Spots"]);
                        HeaderFilterList["wk02_SpotsFilter"] = HeaderFilterList["wk02_SpotsFilter"] + '<li><label><span>' + this["wk02_Spots"] + '</span><input type=checkbox checked value="' + this["wk02_Spots"] + '"></label></li>';
                    }
                    else {
                        if (HeaderFilterList["wk02_Spots"].length > 0 && HeaderFilterList["wk02_Spots"].indexOf(this["wk02_Spots"]) === -1) {
                            HeaderFilterList["wk02_Spots"].push(this["wk02_Spots"]);
                            HeaderFilterList["wk02_SpotsFilter"] = HeaderFilterList["wk02_SpotsFilter"] + '<li><label><span>' + this["wk02_Spots"] + '</span><input type=checkbox checked value="' + this["wk02_Spots"] + '"></label></li>';
                        }
                    }
                    //Reload wk03_Spots
                    if (HeaderFilterList["wk03_Spots"].length == 0) {
                        HeaderFilterList["wk03_Spots"].push(this["wk03_Spots"]);
                        HeaderFilterList["wk03_SpotsFilter"] = HeaderFilterList["wk03_SpotsFilter"] + '<li><label><span>' + this["wk03_Spots"] + '</span><input type=checkbox checked value="' + this["wk03_Spots"] + '"></label></li>';
                    }
                    else {
                        if (HeaderFilterList["wk03_Spots"].length > 0 && HeaderFilterList["wk03_Spots"].indexOf(this["wk03_Spots"]) === -1) {
                            HeaderFilterList["wk03_Spots"].push(this["wk03_Spots"]);
                            HeaderFilterList["wk03_SpotsFilter"] = HeaderFilterList["wk03_SpotsFilter"] + '<li><label><span>' + this["wk03_Spots"] + '</span><input type=checkbox checked value="' + this["wk03_Spots"] + '"></label></li>';
                        }
                    }
                    //Reload wk04_Spots
                    if (HeaderFilterList["wk04_Spots"].length == 0) {
                        HeaderFilterList["wk04_Spots"].push(this["wk04_Spots"]);
                        HeaderFilterList["wk04_SpotsFilter"] = HeaderFilterList["wk04_SpotsFilter"] + '<li><label><span>' + this["wk04_Spots"] + '</span><input type=checkbox checked value="' + this["wk04_Spots"] + '"></label></li>';
                    }
                    else {
                        if (HeaderFilterList["wk04_Spots"].length > 0 && HeaderFilterList["wk04_Spots"].indexOf(this["wk04_Spots"]) === -1) {
                            HeaderFilterList["wk04_Spots"].push(this["wk04_Spots"]);
                            HeaderFilterList["wk04_SpotsFilter"] = HeaderFilterList["wk04_SpotsFilter"] + '<li><label><span>' + this["wk04_Spots"] + '</span><input type=checkbox checked value="' + this["wk04_Spots"] + '"></label></li>';
                        }
                    }
                    //Reload wk05_Spots
                    if (HeaderFilterList["wk05_Spots"].length == 0) {
                        HeaderFilterList["wk05_Spots"].push(this["wk05_Spots"]);
                        HeaderFilterList["wk05_SpotsFilter"] = HeaderFilterList["wk05_SpotsFilter"] + '<li><label><span>' + this["wk05_Spots"] + '</span><input type=checkbox checked value="' + this["wk05_Spots"] + '"></label></li>';
                    }
                    else {
                        if (HeaderFilterList["wk05_Spots"].length > 0 && HeaderFilterList["wk05_Spots"].indexOf(this["wk05_Spots"]) === -1) {
                            HeaderFilterList["wk05_Spots"].push(this["wk05_Spots"]);
                            HeaderFilterList["wk05_SpotsFilter"] = HeaderFilterList["wk05_SpotsFilter"] + '<li><label><span>' + this["wk05_Spots"] + '</span><input type=checkbox checked value="' + this["wk05_Spots"] + '"></label></li>';
                        }
                    }
                    //Reload wk06_Spots
                    if (HeaderFilterList["wk06_Spots"].length == 0) {
                        HeaderFilterList["wk06_Spots"].push(this["wk06_Spots"]);
                        HeaderFilterList["wk06_SpotsFilter"] = HeaderFilterList["wk06_SpotsFilter"] + '<li><label><span>' + this["wk06_Spots"] + '</span><input type=checkbox checked value="' + this["wk06_Spots"] + '"></label></li>';
                    }
                    else {
                        if (HeaderFilterList["wk06_Spots"].length > 0 && HeaderFilterList["wk06_Spots"].indexOf(this["wk06_Spots"]) === -1) {
                            HeaderFilterList["wk06_Spots"].push(this["wk06_Spots"]);
                            HeaderFilterList["wk06_SpotsFilter"] = HeaderFilterList["wk06_SpotsFilter"] + '<li><label><span>' + this["wk06_Spots"] + '</span><input type=checkbox checked value="' + this["wk06_Spots"] + '"></label></li>';
                        }
                    }
                    //Reload wk07_Spots
                    if (HeaderFilterList["wk07_Spots"].length == 0) {
                        HeaderFilterList["wk07_Spots"].push(this["wk07_Spots"]);
                        HeaderFilterList["wk07_SpotsFilter"] = HeaderFilterList["wk07_SpotsFilter"] + '<li><label><span>' + this["wk07_Spots"] + '</span><input type=checkbox checked value="' + this["wk07_Spots"] + '"></label></li>';
                    }
                    else {
                        if (HeaderFilterList["wk07_Spots"].length > 0 && HeaderFilterList["wk07_Spots"].indexOf(this["wk07_Spots"]) === -1) {
                            HeaderFilterList["wk07_Spots"].push(this["wk07_Spots"]);
                            HeaderFilterList["wk07_SpotsFilter"] = HeaderFilterList["wk07_SpotsFilter"] + '<li><label><span>' + this["wk07_Spots"] + '</span><input type=checkbox checked value="' + this["wk07_Spots"] + '"></label></li>';
                        }
                    }
                    //Reload wk08_Spots
                    if (HeaderFilterList["wk08_Spots"].length == 0) {
                        HeaderFilterList["wk08_Spots"].push(this["wk08_Spots"]);
                        HeaderFilterList["wk08_SpotsFilter"] = HeaderFilterList["wk08_SpotsFilter"] + '<li><label><span>' + this["wk08_Spots"] + '</span><input type=checkbox checked value="' + this["wk08_Spots"] + '"></label></li>';
                    }
                    else {
                        if (HeaderFilterList["wk08_Spots"].length > 0 && HeaderFilterList["wk08_Spots"].indexOf(this["wk08_Spots"]) === -1) {
                            HeaderFilterList["wk08_Spots"].push(this["wk08_Spots"]);
                            HeaderFilterList["wk08_SpotsFilter"] = HeaderFilterList["wk08_SpotsFilter"] + '<li><label><span>' + this["wk08_Spots"] + '</span><input type=checkbox checked value="' + this["wk08_Spots"] + '"></label></li>';
                        }
                    }
                    //Reload wk09_Spots
                    if (HeaderFilterList["wk09_Spots"].length == 0) {
                        HeaderFilterList["wk09_Spots"].push(this["wk09_Spots"]);
                        HeaderFilterList["wk09_SpotsFilter"] = HeaderFilterList["wk09_SpotsFilter"] + '<li><label><span>' + this["wk09_Spots"] + '</span><input type=checkbox checked value="' + this["wk09_Spots"] + '"></label></li>';
                    }
                    else {
                        if (HeaderFilterList["wk09_Spots"].length > 0 && HeaderFilterList["wk09_Spots"].indexOf(this["wk09_Spots"]) === -1) {
                            HeaderFilterList["wk09_Spots"].push(this["wk09_Spots"]);
                            HeaderFilterList["wk09_SpotsFilter"] = HeaderFilterList["wk09_SpotsFilter"] + '<li><label><span>' + this["wk09_Spots"] + '</span><input type=checkbox checked value="' + this["wk09_Spots"] + '"></label></li>';
                        }
                    }
                    //Reload wk10_Spots
                    if (HeaderFilterList["wk10_Spots"].length == 0) {
                        HeaderFilterList["wk10_Spots"].push(this["wk10_Spots"]);
                        HeaderFilterList["wk10_SpotsFilter"] = HeaderFilterList["wk10_SpotsFilter"] + '<li><label><span>' + this["wk10_Spots"] + '</span><input type=checkbox checked value="' + this["wk10_Spots"] + '"></label></li>';
                    }
                    else {
                        if (HeaderFilterList["wk10_Spots"].length > 0 && HeaderFilterList["wk10_Spots"].indexOf(this["wk10_Spots"]) === -1) {
                            HeaderFilterList["wk10_Spots"].push(this["wk10_Spots"]);
                            HeaderFilterList["wk10_SpotsFilter"] = HeaderFilterList["wk10_SpotsFilter"] + '<li><label><span>' + this["wk10_Spots"] + '</span><input type=checkbox checked value="' + this["wk10_Spots"] + '"></label></li>';
                        }
                    }
                    //Reload wk11_Spots
                    if (HeaderFilterList["wk11_Spots"].length == 0) {
                        HeaderFilterList["wk11_Spots"].push(this["wk11_Spots"]);
                        HeaderFilterList["wk11_SpotsFilter"] = HeaderFilterList["wk11_SpotsFilter"] + '<li><label><span>' + this["wk11_Spots"] + '</span><input type=checkbox checked value="' + this["wk11_Spots"] + '"></label></li>';
                    }
                    else {
                        if (HeaderFilterList["wk11_Spots"].length > 0 && HeaderFilterList["wk11_Spots"].indexOf(this["wk11_Spots"]) === -1) {
                            HeaderFilterList["wk11_Spots"].push(this["wk11_Spots"]);
                            HeaderFilterList["wk11_SpotsFilter"] = HeaderFilterList["wk11_SpotsFilter"] + '<li><label><span>' + this["wk11_Spots"] + '</span><input type=checkbox checked value="' + this["wk11_Spots"] + '"></label></li>';
                        }
                    }
                    //Reload wk12_Spots
                    if (HeaderFilterList["wk12_Spots"].length == 0) {
                        HeaderFilterList["wk12_Spots"].push(this["wk12_Spots"]);
                        HeaderFilterList["wk12_SpotsFilter"] = HeaderFilterList["wk12_SpotsFilter"] + '<li><label><span>' + this["wk12_Spots"] + '</span><input type=checkbox checked value="' + this["wk12_Spots"] + '"></label></li>';
                    }
                    else {
                        if (HeaderFilterList["wk12_Spots"].length > 0 && HeaderFilterList["wk12_Spots"].indexOf(this["wk12_Spots"]) === -1) {
                            HeaderFilterList["wk12_Spots"].push(this["wk12_Spots"]);
                            HeaderFilterList["wk12_SpotsFilter"] = HeaderFilterList["wk12_SpotsFilter"] + '<li><label><span>' + this["wk12_Spots"] + '</span><input type=checkbox checked value="' + this["wk12_Spots"] + '"></label></li>';
                        }
                    }
                    //Reload wk13_Spots
                    if (HeaderFilterList["wk13_Spots"].length == 0) {
                        HeaderFilterList["wk13_Spots"].push(this["wk13_Spots"]);
                        HeaderFilterList["wk13_SpotsFilter"] = HeaderFilterList["wk13_SpotsFilter"] + '<li><label><span>' + this["wk13_Spots"] + '</span><input type=checkbox checked value="' + this["wk13_Spots"] + '"></label></li>';
                    }
                    else {
                        if (HeaderFilterList["wk13_Spots"].length > 0 && HeaderFilterList["wk13_Spots"].indexOf(this["wk13_Spots"]) === -1) {
                            HeaderFilterList["wk13_Spots"].push(this["wk13_Spots"]);
                            HeaderFilterList["wk13_SpotsFilter"] = HeaderFilterList["wk13_SpotsFilter"] + '<li><label><span>' + this["wk13_Spots"] + '</span><input type=checkbox checked value="' + this["wk13_Spots"] + '"></label></li>';
                        }
                    }
                    //Reload wk14_Spots
                    if (HeaderFilterList["wk14_Spots"].length == 0) {
                        HeaderFilterList["wk14_Spots"].push(this["wk14_Spots"]);
                        HeaderFilterList["wk14_SpotsFilter"] = HeaderFilterList["wk14_SpotsFilter"] + '<li><label><span>' + this["wk14_Spots"] + '</span><input type=checkbox checked value="' + this["wk14_Spots"] + '"></label></li>';
                    }
                    else {
                        if (HeaderFilterList["wk14_Spots"].length > 0 && HeaderFilterList["wk14_Spots"].indexOf(this["wk14_Spots"]) === -1) {
                            HeaderFilterList["wk14_Spots"].push(this["wk14_Spots"]);
                            HeaderFilterList["wk14_SpotsFilter"] = HeaderFilterList["wk14_SpotsFilter"] + '<li><label><span>' + this["wk14_Spots"] + '</span><input type=checkbox checked value="' + this["wk14_Spots"] + '"></label></li>';
                        }
                    }

                    if (HeaderFilterList["dow"].length == 0) {
                        HeaderFilterList["dow"].push(this["dow"]);
                        HeaderFilterList["dowFilter"] = HeaderFilterList["dowFilter"] + '<li><label><span>' + this["dow"] + '</span><input type=checkbox checked value="' + this["dow"] + '"></label></li>';
                    }
                    else {
                        if (HeaderFilterList["dow"].length > 0 && HeaderFilterList["dow"].indexOf(this["dow"]) === -1) {
                            HeaderFilterList["dow"].push(this["dow"]);
                            HeaderFilterList["dowFilter"] = HeaderFilterList["dowFilter"] + '<li><label><span>' + this["dow"] + '</span><input type=checkbox checked value="' + this["dow"] + '"></label></li>';
                        }
                    }

                    //Reaload Weekdays
                    //Reload monday
                    //if (HeaderFilterList["monday"].length == 0) {
                    //    var monday = this["monday"] == true ? "Yes" : "No";
                    //    HeaderFilterList["monday"].push(monday);
                    //    HeaderFilterList["mondayFilter"] = HeaderFilterList["mondayFilter"] + '<li><label><span>' + monday + '</span><input type=checkbox checked value="' + this["monday"] + '"></label></li>';
                    //}
                    //else {
                    //    var monday = this["monday"] == true ? "Yes" : "No";
                    //    if (HeaderFilterList["monday"].length > 0 && HeaderFilterList["monday"].indexOf(monday) === -1) {
                    //        HeaderFilterList["monday"].push(monday);
                    //        HeaderFilterList["mondayFilter"] = HeaderFilterList["mondayFilter"] + '<li><label><span>' + monday + '</span><input type=checkbox checked value="' + this["monday"] + '"></label></li>';
                    //    }
                    //}
                    ////Reload tuesday
                    //if (HeaderFilterList["tuesday"].length == 0) {
                    //    var tuesday = this["tuesday"] == true ? "Yes" : "No";
                    //    HeaderFilterList["tuesday"].push(tuesday);
                    //    HeaderFilterList["tuesdayFilter"] = HeaderFilterList["tuesdayFilter"] + '<li><label><span>' + tuesday + '</span><input type=checkbox checked value="' + this["tuesday"] + '"></label></li>';
                    //}
                    //else {
                    //    var tuesday = this["tuesday"] == true ? "Yes" : "No";
                    //    if (HeaderFilterList["tuesday"].length > 0 && HeaderFilterList["tuesday"].indexOf(tuesday) === -1) {
                    //        HeaderFilterList["tuesday"].push(tuesday);
                    //        HeaderFilterList["tuesdayFilter"] = HeaderFilterList["tuesdayFilter"] + '<li><label><span>' + tuesday + '</span><input type=checkbox checked value="' + this["tuesday"] + '"></label></li>';
                    //    }
                    //}
                    ////Reload wednesday
                    //if (HeaderFilterList["wednesday"].length == 0) {
                    //    var wednesday = this["wednesday"] == true ? "Yes" : "No";
                    //    HeaderFilterList["wednesday"].push(wednesday);
                    //    HeaderFilterList["wednesdayFilter"] = HeaderFilterList["wednesdayFilter"] + '<li><label><span>' + wednesday + '</span><input type=checkbox checked value="' + this["wednesday"] + '"></label></li>';
                    //}
                    //else {
                    //    var wednesday = this["wednesday"] == true ? "Yes" : "No";
                    //    if (HeaderFilterList["wednesday"].length > 0 && HeaderFilterList["wednesday"].indexOf(wednesday) === -1) {
                    //        HeaderFilterList["wednesday"].push(wednesday);
                    //        HeaderFilterList["wednesdayFilter"] = HeaderFilterList["wednesdayFilter"] + '<li><label><span>' + wednesday + '</span><input type=checkbox checked value="' + this["wednesday"] + '"></label></li>';
                    //    }
                    //}
                    ////Reload thursday
                    //if (HeaderFilterList["thursday"].length == 0) {
                    //    var thursday = this["thursday"] == true ? "Yes" : "No";
                    //    HeaderFilterList["thursday"].push(thursday);
                    //    HeaderFilterList["thursdayFilter"] = HeaderFilterList["thursdayFilter"] + '<li><label><span>' + thursday + '</span><input type=checkbox checked value="' + this["thursday"] + '"></label></li>';
                    //}
                    //else {
                    //    var thursday = this["thursday"] == true ? "Yes" : "No";
                    //    if (HeaderFilterList["thursday"].length > 0 && HeaderFilterList["thursday"].indexOf(thursday) === -1) {
                    //        HeaderFilterList["thursday"].push(thursday);
                    //        HeaderFilterList["thursdayFilter"] = HeaderFilterList["thursdayFilter"] + '<li><label><span>' + thursday + '</span><input type=checkbox checked value="' + this["thursday"] + '"></label></li>';
                    //    }
                    //}
                    ////Reload friday
                    //if (HeaderFilterList["friday"].length == 0) {
                    //    var friday = this["friday"] == true ? "Yes" : "No";
                    //    HeaderFilterList["friday"].push(friday);
                    //    HeaderFilterList["fridayFilter"] = HeaderFilterList["fridayFilter"] + '<li><label><span>' + friday + '</span><input type=checkbox checked value="' + this["friday"] + '"></label></li>';
                    //}
                    //else {
                    //    var friday = this["friday"] == true ? "Yes" : "No";
                    //    if (HeaderFilterList["friday"].length > 0 && HeaderFilterList["friday"].indexOf(friday) === -1) {
                    //        HeaderFilterList["friday"].push(friday);
                    //        HeaderFilterList["fridayFilter"] = HeaderFilterList["fridayFilter"] + '<li><label><span>' + friday + '</span><input type=checkbox checked value="' + this["friday"] + '"></label></li>';
                    //    }
                    //}
                    ////Reload saturday
                    //if (HeaderFilterList["saturday"].length == 0) {
                    //    var saturday = this["saturday"] == true ? "Yes" : "No";
                    //    HeaderFilterList["saturday"].push(saturday);
                    //    HeaderFilterList["saturdayFilter"] = HeaderFilterList["saturdayFilter"] + '<li><label><span>' + saturday + '</span><input type=checkbox checked value="' + this["saturday"] + '"></label></li>';
                    //}
                    //else {
                    //    var saturday = this["saturday"] == true ? "Yes" : "No";
                    //    if (HeaderFilterList["saturday"].length > 0 && HeaderFilterList["saturday"].indexOf(saturday) === -1) {
                    //        HeaderFilterList["saturday"].push(saturday);
                    //        HeaderFilterList["saturdayFilter"] = HeaderFilterList["saturdayFilter"] + '<li><label><span>' + saturday + '</span><input type=checkbox checked value="' + this["saturday"] + '"></label></li>';
                    //    }
                    //}

                    ////Reload sunday
                    //if (HeaderFilterList["sunday"].length == 0) {
                    //    var sunday = this["sunday"] == true ? "Yes" : "No";
                    //    HeaderFilterList["sunday"].push(sunday);
                    //    HeaderFilterList["sundayFilter"] = HeaderFilterList["sundayFilter"] + '<li><label><span>' + sunday + '</span><input type=checkbox checked value="' + this["sunday"] + '"></label></li>';
                    //}
                    //else {
                    //    var sunday = this["sunday"] == true ? "Yes" : "No";
                    //    if (HeaderFilterList["sunday"].length > 0 && HeaderFilterList["sunday"].indexOf(sunday) === -1) {
                    //        HeaderFilterList["sunday"].push(sunday);
                    //        HeaderFilterList["sundayFilter"] = HeaderFilterList["sundayFilter"] + '<li><label><span>' + sunday + '</span><input type=checkbox checked value="' + this["sunday"] + '"></label></li>';
                    //    }
                    //}
                });
                $.each(networkFilter, function () {
                    //Reload networkName
                    if (HeaderFilterList["networkName"].length == 0) {
                        HeaderFilterList["networkName"].push(this["networkName"].trim());
                        HeaderFilterList["networkNameFilter"] = HeaderFilterList["networkNameFilter"] + '<li><label><span>' + this["networkName"].trim() + '</span><input type=checkbox checked value="' + this["networkName"].trim() + '"></label></li>';
                    }
                    else {
                        if (HeaderFilterList["networkName"].length > 0 && HeaderFilterList["networkName"].indexOf(this["networkName"].trim()) === -1) {
                            HeaderFilterList["networkName"].push(this["networkName"].trim());
                            HeaderFilterList["networkNameFilter"] = HeaderFilterList["networkNameFilter"] + '<li><label><span>' + this["networkName"].trim() + '</span><input type=checkbox checked value="' + this["networkName"].trim() + '"></label></li>';
                        }
                    }
                    //ReloadPropertyNames
                    if (selectedColIndex.indexOf(7) == -1) {
                        if (HeaderFilterList["propertyName"].length == 0) {
                            HeaderFilterList["propertyName"].push(this["propertyName"].trim());
                            HeaderFilterList["propertyNameFilter"] = HeaderFilterList["propertyNameFilter"] + '<li><label><span>' + this["propertyName"].trim() + '</span><input type=checkbox checked value="' + this["propertyName"].trim() + '"></label></li>';

                        }
                        else {
                            if (HeaderFilterList["propertyName"].length > 0 && HeaderFilterList["propertyName"].indexOf(this["propertyName"].trim()) === -1) {
                                HeaderFilterList["propertyName"].push(this["propertyName"].trim());
                                HeaderFilterList["propertyNameFilter"] = HeaderFilterList["propertyNameFilter"] + '<li><label><span>' + this["propertyName"].trim() + '</span><input type=checkbox checked value="' + this["propertyName"].trim() + '"></label></li>';
                            }
                        }
                    }                   
                });
            }

            if (selectedColIndex.indexOf(7) != -1 && isNetworkFilter == 'true') {
                localStorage.setItem("HeaderFilterList", JSON.stringify(HeaderFilterList));
            }
        }

        setTimeout(function () {

            if (selectedColIndex.length == 0) {
                ReloadString_New(proptable, 1, HeaderFilterList.approvedDescFilter, "HeaderApproved");

                ReloadString_New(proptable, 2, HeaderFilterList.doNotBuyTypeDescriptionFilter, "HeaderDoNotBuyType");                

                ReloadString_New(proptable, 6, HeaderFilterList.demoNameFilter, "HeaderDemoName");

                ReloadString_New(proptable, 7, HeaderFilterList.networkNameFilter, "HeaderNetworkName");

                ReloadString_New(proptable, 8, HeaderFilterList.propertyNameFilter, "HeaderPropertyName");

                ReloadString_New(proptable, 9, HeaderFilterList.effectiveDateFilter, "HeaderEffectiveDate");

                ReloadString_New(proptable, 10, HeaderFilterList.expirationDateFilter, "HeaderExpirationDate");

                ReloadString_New(proptable, 11, HeaderFilterList.dowFilter, "HeaderWeekDOW");

                //ReloadString_New(proptable, 11, HeaderFilterList.mondayFilter, "HeaderWeekDayM");

                //ReloadString_New(proptable, 12, HeaderFilterList.tuesdayFilter, "HeaderWeekDayT");

                //ReloadString_New(proptable, 13, HeaderFilterList.wednesdayFilter, "HeaderWeekDayW");

                //ReloadString_New(proptable, 14, HeaderFilterList.thursdayFilter, "HeaderWeekDayTH");

                //ReloadString_New(proptable, 15, HeaderFilterList.fridayFilter, "HeaderWeekDayF");

                //ReloadString_New(proptable, 16, HeaderFilterList.saturdayFilter, "HeaderWeekDaySA");

                //ReloadString_New(proptable, 17, HeaderFilterList.sundayFilter, "HeaderWeekDaySU");

                ReloadString_New(proptable, 18, HeaderFilterList.dayPartCdFilter, "HeaderDP");

                ReloadString_New(proptable, 19, HeaderFilterList.startToEndTimeFilter, "HeaderStartToEnd");

                ReloadString_New(proptable, 20, HeaderFilterList.omdpFilter, "HeaderOMDP");

                ReloadString_New(proptable, 21, HeaderFilterList.spBuyFilter, "HeaderSPBuy");

                ReloadString_New(proptable, 22, HeaderFilterList.spotLenFilter, "HeaderSpotLen");

                ReloadString_New(proptable, 23, HeaderFilterList.buyTypeCodeFilter, "HeaderBuyType");

                ReloadString_New(proptable, 24, HeaderFilterList.rateAmtFilter, "HeaderRateAmt", HeaderFilterList.rateAmt);

                ReloadString_New(proptable, 25, HeaderFilterList.discountFilter, "HeaderDiscount", HeaderFilterList.discount);

                ReloadString_New(proptable, 26, HeaderFilterList.usdRateFilter, "HeaderUSD", HeaderFilterList.usdRate);

                ReloadString_New(proptable, 27, HeaderFilterList.cpmFilter, "HeaderCPM", HeaderFilterList.cpm);

                ReloadString_New(proptable, 28, HeaderFilterList.impressionsFilter, "HeaderImpression", HeaderFilterList.impressions);

                ReloadString_New(proptable, 29, HeaderFilterList.rateRevisionFilter, "HeaderRevNo");

                ReloadString_New(proptable, 30, HeaderFilterList.rateUpdateDtFilter, "HeaderRateRevisedDate");

                ReloadString_New(proptable, 31, HeaderFilterList.totalSpotsFilter, "HeaderTotalSpots", HeaderFilterList.totalSpots);

                ReloadString_New(proptable, 32, HeaderFilterList.wk01_SpotsFilter, "HeaderWK01", HeaderFilterList.wk01_Spots);

                ReloadString_New(proptable, 33, HeaderFilterList.wk02_SpotsFilter, "HeaderWK02", HeaderFilterList.wk02_Spots);

                ReloadString_New(proptable, 34, HeaderFilterList.wk03_SpotsFilter, "HeaderWK03", HeaderFilterList.wk03_Spots);

                ReloadString_New(proptable, 35, HeaderFilterList.wk04_SpotsFilter, "HeaderWK04", HeaderFilterList.wk04_Spots);

                ReloadString_New(proptable, 36, HeaderFilterList.wk05_SpotsFilter, "HeaderWK05", HeaderFilterList.wk05_Spots);

                ReloadString_New(proptable, 37, HeaderFilterList.wk06_SpotsFilter, "HeaderWK06", HeaderFilterList.wk06_Spots);

                ReloadString_New(proptable, 38, HeaderFilterList.wk07_SpotsFilter, "HeaderWK07", HeaderFilterList.wk07_Spots);

                ReloadString_New(proptable, 39, HeaderFilterList.wk08_SpotsFilter, "HeaderWK08", HeaderFilterList.wk08_Spots);

                ReloadString_New(proptable, 40, HeaderFilterList.wk09_SpotsFilter, "HeaderWK09", HeaderFilterList.wk09_Spots);

                ReloadString_New(proptable, 41, HeaderFilterList.wk10_SpotsFilter, "HeaderWK10", HeaderFilterList.wk10_Spots);

                ReloadString_New(proptable, 42, HeaderFilterList.wk11_SpotsFilter, "HeaderWK11", HeaderFilterList.wk11_Spots);

                ReloadString_New(proptable, 43, HeaderFilterList.wk12_SpotsFilter, "HeaderWK12", HeaderFilterList.wk12_Spots);

                ReloadString_New(proptable, 44, HeaderFilterList.wk13_SpotsFilter, "HeaderWK13", HeaderFilterList.wk13_Spots);

                ReloadString_New(proptable, 45, HeaderFilterList.wk14_SpotsFilter, "HeaderWK14", HeaderFilterList.wk14_Spots);
            }
            else if (selectedColIndex.length > 0) {
                //alert($("#hdnPremiereFilter").val());
                ResetDataForFilterAdditionalApply(parseInt($("#hdnPremiereFilter").val()));//Load Val zero when it is normal filter, 1 when premiere filter
            }        
          
                //setTimeout(function () {
                //    console.log("Checking Totals Inside");
                //    ReloadTotals();
                //    HideOverlayMain(); 
                //}, 500);
            }, 2000);          
                 
    }
}
// ST-807
function ApplyPremeireFilter(ctrl) {
    if ($(ctrl).hasClass("active-premiere")) {
        $(ctrl).removeClass("active-premiere")
    }
    else {
        $(ctrl).addClass("active-premiere")
    }
    if ($("#hdnPremiereFilter").val() == "0") {
        $("#hdnPremiereFilter").val("1");
    }
    else {
        $("#hdnPremiereFilter").val("0");
    }
    ShowOverlayMain();
    setTimeout(function () {
        Codebase.blocks('#ProposalTableDiv', 'state_loading');
        if (proptable == null) {
            initProposalTable();
        }
        else {
            proptable.ajax.reload();
        }
        Codebase.blocks('#ProposalTableDiv', 'state_normal');
        ReloadTotals();

    }, 1000);
    setTimeout(function () {
        ResetDataForFilterAdditionalApply(parseInt($("#hdnPremiereFilter").val()));
        HideOverlayMain();
    }, 6000);
}
// ST-807 Added due to premiere filter implementation
function ResetDataForFilterAdditionalApply(loadval) {
    if (loadval == 1) {
        ReloadString_New(proptable, 8, HeaderFilterList.propertyNameFilter, "HeaderPropertyName");
            ResetFilters(proptable, 8, 'HeaderPropertyName', HeaderFilterList.propertyName);
            ResetFilters(proptable, 7, 'HeaderNetworkName', HeaderFilterList.networkName);
    }
    else {
        ReloadString_New(proptable, 1, HeaderFilterList.approvedDescFilter, "HeaderApproved");
        if (loadval == 1) {
            ResetFilters(proptable, 1, 'HeaderApproved', HeaderFilterList.approvedDesc);
        }
        else {
            if (selectedColIndex.indexOf(1) != -1) {
                ResetFilters(proptable, 1, 'HeaderApproved', HeaderFilterList.approvedDesc);
            }
        }
        ReloadString_New(proptable, 2, HeaderFilterList.doNotBuyTypeDescriptionFilter, "HeaderDoNotBuyType");
        if (loadval == 1) {
            ResetFilters(proptable, 2, 'HeaderDoNotBuyType', HeaderFilterList.doNotBuyTypeDescription);
        }
        else {
            if (selectedColIndex.indexOf(2) != -1) {
                ResetFilters(proptable, 2, 'HeaderDoNotBuyType', HeaderFilterList.doNotBuyTypeDescription);
            }
        }
        ReloadString_New(proptable, 6, HeaderFilterList.demoNameFilter, "HeaderDemoName");

        if (loadval == 1) {
            ResetFilters(proptable, 6, 'HeaderDemoName', HeaderFilterList.demoName);
        }
        else {
            if (selectedColIndex.indexOf(6) != -1) {
                ResetFilters(proptable, 6, 'HeaderDemoName', HeaderFilterList.demoName);
            }
        }

        ReloadString_New(proptable, 7, HeaderFilterList.networkNameFilter, "HeaderNetworkName");
        if (loadval == 1) {
            let UniqueFilter = proptable.column(7).data().unique();
            if (UniqueFilter.length == 1) {
                $("#btnCopySpots").removeAttr("disabled");
            }
            else {
                $("#btnCopySpots").attr("disabled", "disabled");
            }
            ResetFilters(proptable, 7, 'HeaderNetworkName', HeaderFilterList.networkName);
            ResetFilters(proptable, 8, 'HeaderPropertyName', HeaderFilterList.propertyName);
        }
        else {
            if (selectedColIndex.indexOf(7) != -1) {
                let UniqueFilter = proptable.column(7).data().unique();
                if (UniqueFilter.length == 1) {
                    $("#btnCopySpots").removeAttr("disabled");
                }
                else {
                    $("#btnCopySpots").attr("disabled", "disabled");
                }
                ResetFilters(proptable, 7, 'HeaderNetworkName', HeaderFilterList.networkName);
                ResetFilters(proptable, 8, 'HeaderPropertyName', HeaderFilterList.propertyName);
            }
        }

        ReloadString_New(proptable, 8, HeaderFilterList.propertyNameFilter, "HeaderPropertyName");
        if (loadval == 1) {
            ResetFilters(proptable, 8, 'HeaderPropertyName', HeaderFilterList.propertyName);
            ResetFilters(proptable, 7, 'HeaderNetworkName', HeaderFilterList.networkName);
        }
        else {
            if (selectedColIndex.indexOf(8) != -1) {
                ResetFilters(proptable, 8, 'HeaderPropertyName', HeaderFilterList.propertyName);
                ResetFilters(proptable, 7, 'HeaderNetworkName', HeaderFilterList.networkName);
            }
        }

        ReloadString_New(proptable, 9, HeaderFilterList.effectiveDateFilter, "HeaderEffectiveDate");
        if (loadval == 1) {
            ResetFilters(proptable, 9, 'HeaderEffectiveDate', HeaderFilterList.effectiveDate);
        }
        else {
            if (selectedColIndex.indexOf(9) != -1) {
                ResetFilters(proptable, 9, 'HeaderEffectiveDate', HeaderFilterList.effectiveDate);
            }
        }

        ReloadString_New(proptable, 10, HeaderFilterList.expirationDateFilter, "HeaderExpirationDate");
        if (loadval == 1) {
            ResetFilters(proptable, 10, 'HeaderExpirationDate', HeaderFilterList.expirationDate);
        }
        else {
            if (selectedColIndex.indexOf(10) != -1) {
                ResetFilters(proptable, 10, 'HeaderExpirationDate', HeaderFilterList.expirationDate);
            }
        }

        ReloadString_New(proptable, 11, HeaderFilterList.dowFilter, "HeaderWeekDOW");
        if (loadval == 1) {
            ResetFilters(proptable, 11, 'HeaderWeekDOW', HeaderFilterList.dow);
        }
        else {
            if (selectedColIndex.indexOf(11) != -1) {
                ResetFilters(proptable, 11, 'HeaderWeekDOW', HeaderFilterList.dow);
            }
        }

        ReloadString_New(proptable, 18, HeaderFilterList.dayPartCdFilter, "HeaderDP");
        if (loadval == 1) {
            ResetFilters(proptable, 18, 'HeaderDP', HeaderFilterList.dayPartCd);
        }
        else {
            if (selectedColIndex.indexOf(18) != -1) {
                ResetFilters(proptable, 18, 'HeaderDP', HeaderFilterList.dayPartCd);
            }
        }

        ReloadString_New(proptable, 19, HeaderFilterList.startToEndTimeFilter, "HeaderStartToEnd");
        if (loadval == 1) {
            ResetFilters(proptable, 19, 'HeaderStartToEnd', HeaderFilterList.startToEndTime);
        }
        else {
            if (selectedColIndex.indexOf(19) != -1) {
                ResetFilters(proptable, 19, 'HeaderStartToEnd', HeaderFilterList.startToEndTime);
            }
        }

        ReloadString_New(proptable, 20, HeaderFilterList.omdpFilter, "HeaderOMDP");

        if (loadval == 1) {
            ResetFilters(proptable, 20, 'HeaderOMDP', HeaderFilterList.omdp);
        }
        else {
            if (selectedColIndex.indexOf(20) != -1) {
                ResetFilters(proptable, 20, 'HeaderOMDP', HeaderFilterList.omdp);
            }
        }

        ReloadString_New(proptable, 21, HeaderFilterList.spBuyFilter, "HeaderSPBuy");
        if (loadval == 1) {
            ResetFilters(proptable, 21, 'HeaderSPBuy', HeaderFilterList.spBuy);
        }
        else {
            if (selectedColIndex.indexOf(21) != -1) {
                ResetFilters(proptable, 21, 'HeaderSPBuy', HeaderFilterList.spBuy);
            }
        }
        ReloadString_New(proptable, 22, HeaderFilterList.spotLenFilter, "HeaderSpotLen");

        if (loadval == 1) {
            ResetFilters(proptable, 22, 'HeaderSpotLen', HeaderFilterList.spotLen);
        }
        else {
            if (selectedColIndex.indexOf(22) != -1) {
                ResetFilters(proptable, 22, 'HeaderSpotLen', HeaderFilterList.spotLen);
            }
        }
        ReloadString_New(proptable, 23, HeaderFilterList.buyTypeCodeFilter, "HeaderBuyType");
        if (loadval == 1) {
            ResetFilters(proptable, 23, 'HeaderBuyType', HeaderFilterList.buyTypeCode);
        }
        else {
            if (selectedColIndex.indexOf(23) != -1) {
                ResetFilters(proptable, 23, 'HeaderBuyType', HeaderFilterList.buyTypeCode);
            }
        }

        ReloadString_New(proptable, 24, HeaderFilterList.rateAmtFilter, "HeaderRateAmt", HeaderFilterList.rateAmt);

        if (loadval == 1) {
        }
        else {
            if (selectedColIndex.indexOf(24) != -1) {
                ResetFilters(proptable, 24, 'HeaderRateAmt', HeaderFilterList.rateAmt);
            }
        }
        ReloadString_New(proptable, 25, HeaderFilterList.discountFilter, "HeaderDiscount", HeaderFilterList.discount);
        if (loadval == 1) {
            ResetFilters(proptable, 25, 'HeaderDiscount', HeaderFilterList.discount);
        }
        else {
            if (selectedColIndex.indexOf(25) != -1) {
                ResetFilters(proptable, 25, 'HeaderDiscount', HeaderFilterList.discount);
            }
        }
        ReloadString_New(proptable, 26, HeaderFilterList.usdRateFilter, "HeaderUSD", HeaderFilterList.usdRate);

        if (loadval == 1) {
            ResetFilters(proptable, 26, 'HeaderUSD', HeaderFilterList.usdRate);
        }
        else {
            if (selectedColIndex.indexOf(26) != -1) {
                ResetFilters(proptable, 26, 'HeaderUSD', HeaderFilterList.usdRate);
            }
        }
        ReloadString_New(proptable, 27, HeaderFilterList.cpmFilter, "HeaderCPM", HeaderFilterList.cpm);
        if (loadval == 1) {
            ResetFilters(proptable, 27, 'HeaderCPM', HeaderFilterList.cpm);
        }
        else {
            if (selectedColIndex.indexOf(27) != -1) {
                ResetFilters(proptable, 27, 'HeaderCPM', HeaderFilterList.cpm);
            }
        }

        ReloadString_New(proptable, 28, HeaderFilterList.impressionsFilter, "HeaderImpression", HeaderFilterList.impressions);

        if (loadval == 1) {
            ResetFilters(proptable, 28, 'HeaderImpression', HeaderFilterList.impressions);
        }
        else {
            if (selectedColIndex.indexOf(28) != -1) {
                ResetFilters(proptable, 28, 'HeaderImpression', HeaderFilterList.impressions);
            }
        }

        ReloadString_New(proptable, 29, HeaderFilterList.rateRevisionFilter, "HeaderRevNo");
        if (loadval == 1) {
            ResetFilters(proptable, 29, 'HeaderRevNo', HeaderFilterList.rateRevision);
        }
        else {
            if (selectedColIndex.indexOf(29) != -1) {
                ResetFilters(proptable, 29, 'HeaderRevNo', HeaderFilterList.rateRevision);
            }
        }

        ReloadString_New(proptable, 30, HeaderFilterList.rateUpdateDtFilter, "HeaderRateRevisedDate");
        if (loadval == 1) {
            ResetFilters(proptable, 30, 'HeaderRateRevisedDate', HeaderFilterList.rateUpdateDt);
        }
        else {
            if (selectedColIndex.indexOf(30) != -1) {
                ResetFilters(proptable, 30, 'HeaderRateRevisedDate', HeaderFilterList.rateUpdateDt);
            }
        }

        ReloadString_New(proptable, 31, HeaderFilterList.totalSpotsFilter, "HeaderTotalSpots", HeaderFilterList.totalSpots);
        if (loadval == 1) {
            ResetFilters(proptable, 31, 'HeaderTotalSpots', HeaderFilterList.totalSpots);
        }
        else {
            if (selectedColIndex.indexOf(31) != -1) {
                ResetFilters(proptable, 31, 'HeaderTotalSpots', HeaderFilterList.totalSpots);
            }
        }

        ReloadString_New(proptable, 32, HeaderFilterList.wk01_SpotsFilter, "HeaderWK01", HeaderFilterList.wk01_Spots);
        if (loadval == 1) {
            ResetFilters(proptable, 32, 'HeaderWK01', HeaderFilterList.wk01_Spots);
        }
        else {
            if (selectedColIndex.indexOf(32) != -1) {
                ResetFilters(proptable, 32, 'HeaderWK01', HeaderFilterList.wk01_Spots);
            }
        }
        ReloadString_New(proptable, 33, HeaderFilterList.wk02_SpotsFilter, "HeaderWK02", HeaderFilterList.wk02_Spots);
        if (loadval == 1) {
            ResetFilters(proptable, 33, 'HeaderWK02', HeaderFilterList.wk02_Spots);
        }
        else {
            if (selectedColIndex.indexOf(33) != -1) {
                ResetFilters(proptable, 33, 'HeaderWK02', HeaderFilterList.wk02_Spots);
            }
        }
        ReloadString_New(proptable, 34, HeaderFilterList.wk03_SpotsFilter, "HeaderWK03", HeaderFilterList.wk03_Spots);
        if (loadval == 1) {
            ResetFilters(proptable, 34, 'HeaderWK03', HeaderFilterList.wk03_Spots);
        }
        else {
            if (selectedColIndex.indexOf(34) != -1) {
                ResetFilters(proptable, 34, 'HeaderWK03', HeaderFilterList.wk03_Spots);
            }
        }
        ReloadString_New(proptable, 35, HeaderFilterList.wk04_SpotsFilter, "HeaderWK04", HeaderFilterList.wk04_Spots);
        if (loadval == 1) {
            ResetFilters(proptable, 33, 'HeaderWK04', HeaderFilterList.wk04_Spots);
        }
        else {
            if (selectedColIndex.indexOf(35) != -1) {
                ResetFilters(proptable, 33, 'HeaderWK04', HeaderFilterList.wk04_Spots);
            }
        }
        ReloadString_New(proptable, 36, HeaderFilterList.wk05_SpotsFilter, "HeaderWK05", HeaderFilterList.wk05_Spots);
        if (loadval == 1) {
            ResetFilters(proptable, 36, 'HeaderWK05', HeaderFilterList.wk05_Spots);
        }
        else {
            if (selectedColIndex.indexOf(36) != -1) {
                ResetFilters(proptable, 36, 'HeaderWK05', HeaderFilterList.wk05_Spots);
            }
        }
        ReloadString_New(proptable, 37, HeaderFilterList.wk06_SpotsFilter, "HeaderWK06", HeaderFilterList.wk06_Spots);
        if (loadval == 1) {
            ResetFilters(proptable, 37, 'HeaderWK06', HeaderFilterList.wk06_Spots);
        }
        else {
            if (selectedColIndex.indexOf(37) != -1) {
                ResetFilters(proptable, 37, 'HeaderWK06', HeaderFilterList.wk06_Spots);
            }
        }

        ReloadString_New(proptable, 38, HeaderFilterList.wk07_SpotsFilter, "HeaderWK07", HeaderFilterList.wk07_Spots);
        if (loadval == 1) {
            ResetFilters(proptable, 38, 'HeaderWK07', HeaderFilterList.wk07_Spots);
        }
        else {
            if (selectedColIndex.indexOf(38) != -1) {
                ResetFilters(proptable, 38, 'HeaderWK07', HeaderFilterList.wk07_Spots);
            }
        }

        ReloadString_New(proptable, 39, HeaderFilterList.wk08_SpotsFilter, "HeaderWK08", HeaderFilterList.wk08_Spots);
        if (loadval == 1) {
            ResetFilters(proptable, 39, 'HeaderWK08', HeaderFilterList.wk08_Spots);
        }
        else {
            if (selectedColIndex.indexOf(39) != -1) {
                ResetFilters(proptable, 39, 'HeaderWK08', HeaderFilterList.wk08_Spots);
            }
        }

        ReloadString_New(proptable, 40, HeaderFilterList.wk09_SpotsFilter, "HeaderWK09", HeaderFilterList.wk09_Spots);
        if (loadval == 1) {
            ResetFilters(proptable, 40, 'HeaderWK09', HeaderFilterList.wk09_Spots);
        }
        else {
            if (selectedColIndex.indexOf(40) != -1) {
                ResetFilters(proptable, 40, 'HeaderWK09', HeaderFilterList.wk09_Spots);
            }
        }
        ReloadString_New(proptable, 41, HeaderFilterList.wk10_SpotsFilter, "HeaderWK10", HeaderFilterList.wk10_Spots);
        if (loadval == 1) {
            ResetFilters(proptable, 41, 'HeaderWK10', HeaderFilterList.wk10_Spots);
        }
        else {
            if (selectedColIndex.indexOf(41) != -1) {
                ResetFilters(proptable, 41, 'HeaderWK10', HeaderFilterList.wk10_Spots);
            }
        }
        ReloadString_New(proptable, 42, HeaderFilterList.wk11_SpotsFilter, "HeaderWK11", HeaderFilterList.wk11_Spots);
        if (loadval == 1) {
            ResetFilters(proptable, 42, 'HeaderWK11', HeaderFilterList.wk11_Spots);
        }
        else {
            if (selectedColIndex.indexOf(42) != -1) {
                ResetFilters(proptable, 42, 'HeaderWK11', HeaderFilterList.wk11_Spots);
            }
        }
        ReloadString_New(proptable, 43, HeaderFilterList.wk12_SpotsFilter, "HeaderWK12", HeaderFilterList.wk12_Spots);
        if (loadval == 1) {
            ResetFilters(proptable, 43, 'HeaderWK12', HeaderFilterList.wk12_Spots);
        }
        else {
            if (selectedColIndex.indexOf(43) != -1) {
                ResetFilters(proptable, 43, 'HeaderWK12', HeaderFilterList.wk12_Spots);
            }
        }
        ReloadString_New(proptable, 44, HeaderFilterList.wk13_SpotsFilter, "HeaderWK13", HeaderFilterList.wk13_Spots);
        if (loadval == 1) {
            ResetFilters(proptable, 44, 'HeaderWK13', HeaderFilterList.wk13_Spots);
        }
        else {
            if (selectedColIndex.indexOf(44) != -1) {
                ResetFilters(proptable, 44, 'HeaderWK13', HeaderFilterList.wk13_Spots);
            }
        }

        ReloadString_New(proptable, 45, HeaderFilterList.wk14_SpotsFilter, "HeaderWK14", HeaderFilterList.wk14_Spots);
        if (loadval == 1) {
            ResetFilters(proptable, 45, 'HeaderWK14', HeaderFilterList.wk14_Spots);
        }
        else {
            if (selectedColIndex.indexOf(45) != -1) {
                ResetFilters(proptable, 45, 'HeaderWK14', HeaderFilterList.wk14_Spots);
            }
        }
    }
}
function ReloadAll_OLD(settings, data) {
    var proptable = $("#MyProposalTable").DataTable();
    if (proptable) {

        //// ReloadBool
        ReloadApproved(proptable, settings, data);

        // ReloadString
        ReloadDoNotBuyTypes(proptable, settings, data);
        ReloadPropertyNames(proptable, settings, data);
        ReloadDayPart(proptable, settings, data);
        ReloadOMDP(proptable, settings, data);
        ReloadStartToEnd(proptable, settings, data);
        ReloadBuyType(proptable, settings, data);
        ReloadLens(proptable, settings, data);
        ReloadImpressions(proptable, settings, data);
        ReloadDemoNames(proptable, settings, data);
        ReloadNetworkName(proptable, settings, data);
        ReloadTotalSpots(proptable, settings, data);

        // ReloadCurrency
        ReloadRateAmts(proptable, settings, data);
        ReloadCPMs(proptable, settings, data);
        ReloadRev(proptable, settings, data);

        // ReloadDiscount
        ReloadDiscounts(proptable, settings, data);

        // ReloadDates
        ReloadRevisedDates(proptable, settings, data);
        ReloadEffectiveDates(proptable, settings, data);
        ReloadExpirationDates(proptable, settings, data);

        ReloadUSD(proptable, settings, data);
        ReloadSPBuy(proptable, settings, data);
        ReloadWK01Spots(proptable, settings, data);
        ReloadWK02Spots(proptable, settings, data);
        ReloadWK03Spots(proptable, settings, data);
        ReloadWK04Spots(proptable, settings, data);
        ReloadWK05Spots(proptable, settings, data);
        ReloadWK06Spots(proptable, settings, data);
        ReloadWK07Spots(proptable, settings, data);
        ReloadWK08Spots(proptable, settings, data);
        ReloadWK09Spots(proptable, settings, data);
        ReloadWK10Spots(proptable, settings, data);
        ReloadWK11Spots(proptable, settings, data);
        ReloadWK12Spots(proptable, settings, data);
        ReloadWK13Spots(proptable, settings, data);
        ReloadWK14Spots(proptable, settings, data);
        ReloadWeekDay(proptable, settings, data, 1); //Monday
        ReloadWeekDay(proptable, settings, data, 2); //tuesday
        ReloadWeekDay(proptable, settings, data, 3); //Wednesday
        ReloadWeekDay(proptable, settings, data, 4); // Thursday
        ReloadWeekDay(proptable, settings, data, 5); // Friday
        ReloadWeekDay(proptable, settings, data, 6); //Saturday
         ReloadWeekDay(proptable, settings, data, 7); // Sunday
        HideOverlayMain();
    }
}
function ReloadByHeader(header, settings, data) {
    // This doesn't work so for now, let's not run this code;
    /*
    if (header != null && header.hasClass("HeaderApproved")) {
        ReloadApproved(settings, data);
    }
    if (header != null && header.hasClass("HeaderDoNotBuyType")) {
        ReloadDoNotBuyTypes(settings, data);
    }
    if (header != null && header.hasClass("HeaderRevNo")) {
        ReloadRev(settings, data);
    }
    if (header != null && header.hasClass("HeaderRateRevisedDate")) {
        ReloadRevisedDates(settings, data);
    }
    if (header != null && header.hasClass("HeaderEffectiveDate")) {
        ReloadEffectiveDates(settings, data);
    }
    if (header != null && header.hasClass("HeaderExpirationDaet")) {
        ReloadExpirationDates(settings, data);
    }
    if (header != null && header.hasClass("HeaderDemoName")) {
        ReloadDemoNames(settings, data);
    }
    if (header != null && header.hasClass("HeaderNetworkName")) {
        ReloadNetworkName(settings, data);
    }
    if (header != null && header.hasClass("HeaderPropertyName")) {
        ReloadPropertyNames(settings, data);
    }
    if (header != null && header.hasClass("HeaderDP")) {
        ReloadDayPart(settings, data);
    }
    if (header != null && header.hasClass("HeaderStartToEnd")) {
        ReloadStartToEnd(settings, data);
    }
    if (header != null && header.hasClass("HeaderOMDP")) {
        ReloadOMDP(settings, data);
    }
    if (header != null && header.hasClass("HeaderSpotLen")) {
        ReloadLens(settings, data);
    }
    if (header != null && header.hasClass("HeaderBuyType")) {
        ReloadBuyType(settings, data);
    }
    if (header != null && header.hasClass("HeaderRateAmt")) {
        ReloadRateAmts(settings, data);
    }
    if (header != null && header.hasClass("HeaderDiscount")) {
        ReloadDiscounts(settings, data);
    }
    if (header != null && header.hasClass("HeaderCPM")) {
        ReloadCPM(settings, data);
    }
    if (header != null && header.hasClass("HeaderUSD")) {
        ReloadUSD(settings, data);
    }
    if (header != null && header.hasClass("HeaderImpression")) {
        ReloadImpressions(settings, data);
    }
    */
}

// HERE ARE SOME FUNCTIONS THAT MAY NEED TO BE REMOVED LATER
function RecalculateDataTable(_Id, _DiscountPrice) {
    $.ajax({
        type: "POST",
        data: {
            ProposalId: _Id,
            DiscountPrice: _DiscountPrice
        },
        url: '/ScheduleProposal/_Proposal_DataTable',
        success: function (result) {
            $('#ProposalTableDiv').html(result);
        },
        error: function (response) {
            $('#ProposalTableDiv').html(response.responseText);
        }
    });


    //alert(DiscountPrice.find('option:selected').attr('value'));
    //$('#ProposalTableDiv').html(DiscountPrice.find('option:selected').attr('value'));

    //$('#ProposalTableDiv').load("~/ScheduleProposal/_Proposal_DataTable?ProposalId=251&DiscountPrice=0.07");
    //    @*'@(Url.Action("_Proposal_DataTable","ManageMedia",null, Request.Url.Scheme))?ProposalId=' + getParameterByName('ProposalId') + '&DiscountPrice=' + DiscountPrice *@
    //);

}

function CalculateDiscountPrices(proptable, discount, usd, cpm) {
    var _UniqueId = getParameterByName('ProposalId');
    if (!_UniqueId || parseInt(_UniqueId) === 0) {
        _UniqueId = getParameterByName('ScheduleId');
    }
    var Discount = parseFloat($("#DiscountPrice").find(":selected").text().replace('%', ''));
    // Change Header to Discount Percent
    $("#DiscountPriceHeader").html($("#DiscountPrice").find(":selected").text() + " Rate").show();
    proptable.rows().every(function (rowIdx, tableLoop, rowLoop) {
        var data = this.data();
        //var node = this.node();

        // Discount Rate
        if (discount == 1) {
            var cellPercent = proptable.cell({ row: rowIdx, column: 24 }).node();
            var discountRate = formatCurrency((data.rateAmt * .85) + (data.rateAmt * (Discount / 100)));
            $(cellPercent).html(discountRate).show();
        }

        if (cpm == 1) {
            // CPM
            var cellCPM = proptable.cell({ row: rowIdx, column: 26 }).node();
            if (data.impressions === 0) {
                $(cellCPM).html('$1.00').show();
            }
            else {
                var cpmval = formatCurrency(parseFloat(data.rateAmt) / parseFloat(data.impressions));
                $(cellCPM).html(cpmval).show();
            }
        }

        // USD Rate
        //if (usd == 1) {
        //    var cellUSDRate = proptable.cell({ row: rowIdx, column: 25 }).node();
        //    var usdRate = formatCurrency(data.rateAmt);
        //    $(cellUSDRate).html(usdRate).show();
        //}

    });
    proptable.columns.adjust().draw();
};

function CalculateDiscountPricesFiltered(proptable, discount, usd, cpm) {
    console.log('CalculateDiscountPrices');
    //console.log(discount);
    //console.log(usd);
    //console.log(cpm);
    var Discount = parseFloat($("#DiscountPrice").find(":selected").text().replace('%', ''));
    // Change Header to Discount Percent
    $("#DiscountPriceHeader").html($("#DiscountPrice").find(":selected").text() + " Rate").show();
    proptable.rows({ search: 'applied' }).every(function (rowIdx, tableLoop, rowLoop) {
        var data = this.data();
        //var node = this.node();

        // Discount Rate
        if (discount == 1) {
            var cellPercent = proptable.cell({ row: rowIdx, column: 24 }).node();
            var discountRate = formatCurrency((data.rateAmt * .85) + (data.rateAmt * (Discount / 100)));
            $(cellPercent).html(discountRate).show();
        }

        if (cpm == 1) {
            // CPM
            var cellCPM = proptable.cell({ row: rowIdx, column: 26 }).node();
            if (data.impressions === 0) {
                $(cellCPM).html('$1.00').show();
            }
            else {
                var cpmval = formatCurrency(parseFloat(data.rateAmt) / parseFloat(data.impressions));
                $(cellCPM).html(cpmval).show();
            }
        }


        // USD Rate
        //if (usd == 1) {
        //    var cellUSDRate = proptable.cell({ row: rowIdx, column: 25 }).node();
        //    var usdRate = formatCurrency(data.rateAmt);
        //    $(cellUSDRate).html(usdRate).show();
        //}

    });
    proptable.columns.adjust().draw();
};

function SaveFilterState(profilekey, settings, data) {
    $.ajax({
        url: '/ScheduleProposal/SaveFilterState',
        type: 'POST',
        data: {
            currentFilters: JSON.stringify(data),
            profileKey: profilekey,
            proposalId: _UniqueId
        },
        cache: false,
        async: false,
        success: function (result) {
            if (result.success) {
                //ReloadTotals();
            }
            else {
                var notify = $.notify(result.responseText, {
                    type: 'danger',
                    allow_dismiss: true,
                });
            }
        },
        error: function (response) {
            swal({
                title: "Error",
                text: response.responseText,
                type: 'error',
            });
        }
    });

}
//function Filter_DataReset(proptable, _colIndex, _className, searchColIndex) {
//    if (proptable.column(_colIndex).visible()) {
   
//            let headerFilterData = $('.' + _className).find('.cb-dropdown >li');
//            let UniqueFilter = proptable.column(_colIndex).data().unique();
           
//        if (headerFilterData) {
//            //if (searchColIndex != _colIndex) {
//            //    headerFilterData.hide();
//            //}
//            //if (headerFilterData.length - 1 != UniqueFilter.length) {
//            //    $('.' + _className).find('.cb-dropdown input[type=checkbox]').prop("checked", false);

//            //    $($(headerFilterData[0])).show();
//            //    if (searchColIndex != _colIndex) {
//            //        $($(headerFilterData[0]).find("input[type=checkbox]")).prop("checked", true);
//            //    }
//            $('.' + _className).find('.cb-dropdown input[type=checkbox]').prop("checked", false);
//            var count = 0;
//            for1(let i = 0; i < headerFilterData.length; i++) {
//                count = count + 1;
//                for (let y = 0; y < UniqueFilter.length                        ).trim());
//                if ($($(headerFilterData[i]).find("span")).text =).trim() != UniqueFilter[y].toString()
//                    .t                                $($(headerFil).find("input[type=checkbox]")).prop("checked", true);
//            }
//            $($(headerFilterData[i])).show();

//            //}
//            //             }

//        }}
//            }
//        }
//        catch (err) {
//            if (err.message != '') {
//                console.log(+ err.message);
//                var notify = $.notify('ReloadString():  ' + err.message + " " + count, {
//                    type: 'danger',
//                    allow_dismiss: true,
//                });
//            }
//        }
//    }
//}
function FilterReset(proptable, searchColIndex) {
    

    Filter_DataReset(proptable, 1, "HeaderApproved", searchColIndex);
    Filter_DataReset(proptable, 2, "HeaderDoNotBuyType", searchColIndex);
    Filter_DataReset(proptable, 3, "HeaderRevNo", searchColIndex);
    Filter_DataReset(proptable, 4, "HeaderRateRevisedDate", searchColIndex);
    Filter_DataReset(proptable, 6, "HeaderDemoName", searchColIndex);
    Filter_DataReset(proptable, 7, "HeaderNetworkName", searchColIndex);
    Filter_DataReset(proptable, 8, "HeaderPropertyName", searchColIndex);
    Filter_DataReset(proptable, 9, "HeaderEffectiveDate", searchColIndex);
    Filter_DataReset(proptable, 10,"HeaderExpirationDate", searchColIndex);
    // Weekday
    Filter_DataReset(proptable, 11, "HeaderWeekDOW", searchColIndex);
    //Filter_DataReset(proptable, 11, "HeaderWeekDayM", searchColIndex);
    //Filter_DataReset(proptable, 12, "HeaderWeekDayT", searchColIndex);
    //Filter_DataReset(proptable, 13, "HeaderWeekDayW", searchColIndex);
    //Filter_DataReset(proptable, 14, "HeaderWeekDayTH", searchColIndex);
    //Filter_DataReset(proptable, 15, "HeaderWeekDayF", searchColIndex);
    //Filter_DataReset(proptable, 16, "HeaderWeekDaySA", searchColIndex);
    //Filter_DataReset(proptable, 17, "HeaderWeekDaySU", searchColIndex);

    Filter_DataReset(proptable, 18, "HeaderDP", searchColIndex);
    Filter_DataReset(proptable, 19, "HeaderStartToEnd", searchColIndex);
    Filter_DataReset(proptable, 20, "HeaderOMDP", searchColIndex);
    Filter_DataReset(proptable, 21, "HeaderSPBuy", searchColIndex);
    Filter_DataReset(proptable, 22, "HeaderSpotLen", searchColIndex);
    Filter_DataReset(proptable, 23, "HeaderBuyType", searchColIndex);
    Filter_DataReset(proptable, 24, "HeaderRateAmt", searchColIndex);
    Filter_DataReset(proptable, 25, "HeaderDiscount", searchColIndex);
    Filter_DataReset(proptable, 26, "HeaderUSD", searchColIndex);
    Filter_DataReset(proptable, 27, "HeaderCPM", searchColIndex);
    Filter_DataReset(proptable, 28, "HeaderImpression", searchColIndex);
    Filter_DataReset(proptable, 29, "HeaderTotalSpots", searchColIndex);
    // Week Filter
    Filter_DataReset(proptable, 30, "HeaderWK01", searchColIndex);
    Filter_DataReset(proptable, 31, "HeaderWK02", searchColIndex);
    Filter_DataReset(proptable, 32, "HeaderWK03", searchColIndex);
    Filter_DataReset(proptable, 33, "HeaderWK04", searchColIndex);
    Filter_DataReset(proptable, 34, "HeaderWK05", searchColIndex);
    Filter_DataReset(proptable, 35, "HeaderWK06", searchColIndex);
    Filter_DataReset(proptable, 36, "HeaderWK07", searchColIndex);
    Filter_DataReset(proptable, 37, "HeaderWK08", searchColIndex);
    Filter_DataReset(proptable, 38, "HeaderWK09", searchColIndex);
    Filter_DataReset(proptable, 39, "HeaderWK10", searchColIndex);
    Filter_DataReset(proptable, 40, "HeaderWK11", searchColIndex);
    Filter_DataReset(proptable, 41, "HeaderWK12", searchColIndex);
    Filter_DataReset(proptable, 42, "HeaderWK13", searchColIndex);
    Filter_DataReset(proptable, 43, "HeaderWK14", searchColIndex);

       

}
function ReloadString_New(proptable, colIndex, FilterData, _className, _filterList) {
    //alert(FilterData);
    try {
        let UniqueFilter = proptable.column(colIndex).data().unique();
        if (UniqueFilter.length == 0) {
            return;
        }
        let colStat = proptable.column(colIndex);
        let header = $('.' + _className).find('.cb-dropdown'); 
        var sortedData = ReturnSortedHtml(FilterData, _filterList, _className);       
        if (colStat) {
            if (colStat.visible()) {
                if (header) {
                    // First, empty list 
                    header.empty();
                    header.html(sortedData);
                }
            }
        }
    }
    catch (err) {
        if (err.message != '') {
            var notify = $.notify('ReloadString():  ' + err.message, {
                type: 'danger',
                allow_dismiss: true,
            });
        }
    }
}

function ReturnSortedHtml(filterData, filterList, className) {
    if (filterList != undefined) {
        var arrList = [];
        for (var i = 0; i < filterList.length; i++) {
            arrList.push(filterList[i].toString());
        }       
        var sortByAsc = arrList.sort(function (a, b) {           
            return a.localeCompare(b, false, { numeric: true })
        })
        var sortedList = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';
        for (var i = 0; i < sortByAsc.length; i++) {
            if (sortByAsc[i] != '<label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>') {
                var formattedValue;
                if (className === "HeaderTotalSpots"
                    || className === "HeaderWK01"
                    || className === "HeaderWK02"
                    || className === "HeaderWK03"
                    || className === "HeaderWK04"
                    || className === "HeaderWK05"
                    || className === "HeaderWK06"
                    || className === "HeaderWK07"
                    || className === "HeaderWK08"
                    || className === "HeaderWK09"
                    || className === "HeaderWK10"
                    || className === "HeaderWK11"
                    || className === "HeaderWK12"
                    || className === "HeaderWK13"
                    || className === "HeaderWK14")
                {
                    formattedValue = Number(sortByAsc[i]);
                }
                else if (className === "HeaderImpression") {
                    formattedValue = Number(sortByAsc[i]).toFixed(2);
                }
                else {
                    formattedValue = (Number(sortByAsc[i])).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                    });
                }
                
                sortedList = sortedList + '<li><label><span>' + formattedValue + '</span><input type=checkbox checked value="' + sortByAsc[i] + '"></label></li>';
            }                
        }
        return sortedList;
    }
    else {
        var sortByAsc = filterData.split("<li>").sort();
        var sortedList = '<li><label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>';
        for (var i = 0; i < sortByAsc.length; i++) {
            if (sortByAsc[i] != '<label><span>Select All</span><input type=checkbox checked value="Select All"></label></li>') {
                sortedList = sortedList + "<li>" + sortByAsc[i];
            }               
        }
        return sortedList;
    }
   
}

function GetFilterColIndex(index) {
    selectedColIndex.push(index);
}

function ResetFilters(proptable, _colIndex, _className, filterArray) {
    if (proptable.column(_colIndex).visible()) {

        let headerFilterData = $('.' + _className).find('.cb-dropdown');
        let UniqueFilter = proptable.column(_colIndex).data().unique();       
        var filterHtml = headerFilterData.html();
        var replace = "";
        var replaceWith = "";
        if (headerFilterData) {
            filterHtml = filterHtml.replace(/checked=""/g, '');
            filterHtml = filterHtml.replace(/A&amp;E/g, 'A&E');            
            for (var i = 0; i < UniqueFilter.length; i++) {
                if (!$.isNumeric(UniqueFilter[i])) {
                    UniqueFilter[i] = UniqueFilter[i].trim();
                }                              
                if (_className == 'HeaderRateRevisedDate') {
                    var incomingDt = UniqueFilter[i].toString().split("-");
                    var formattedDate = incomingDt[1] + "/" + incomingDt[2].split("T")[0] + "/" + incomingDt[0] + " 12:00:00" + ' AM';
                    replace = 'value="' + formattedDate + '"';
                    replaceWith = ' checked value="' + formattedDate + '"';
                }
                else if (_className == 'HeaderRevNo') {
                    replace = 'value="' + UniqueFilter[i].trim() + '"';
                    replaceWith = ' checked value="' + UniqueFilter[i].trim() + '"'; 
                }
                else {
                    replace = 'value="' + UniqueFilter[i] + '"';
                    replaceWith = ' checked value="' + UniqueFilter[i] + '"'; 
                }   
                if (selectedColIndex.indexOf(_colIndex) == -1) {
                    filterHtml = filterHtml.replace(/value="Select All"/g, 'checked value="Select All"');
                }
                if (filterArray.length == UniqueFilter.length) {
                    filterHtml = filterHtml.replace(/value="Select All"/g, 'checked value="Select All"');
                }
                if (filterArray.length != UniqueFilter.length) {
                    filterHtml = filterHtml.replace(/checked value="Select All"/g, 'value="Select All"');
                }
                filterHtml = filterHtml.replace(replace, replaceWith);
                headerFilterData.empty();
                headerFilterData.html(filterHtml);
            }
        }
    }     
}

window.onbeforeunload = function () {
    localStorage.removeItem("HeaderFilterList");
    return '';
};