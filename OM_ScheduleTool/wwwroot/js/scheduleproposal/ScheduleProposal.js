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
    window.location.reload();
}


function OnWeeklySpotChange(that, idPrefix, WeekNum) {
    try {
        var id = $(that).attr('id').replace(idPrefix, '');

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
                    if (!isNaN(parseInt($('#wk01_' + id).val())))  {
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
                    $('#wk' + WeekNum + '_' + id).css('color', 'red');
                    $('#divCopyToSchedule > button').attr('disabled', 'disabled').prop('disabled', 'disabled');
                }
                else {
                    $('#wk' + WeekNum + '_' + id).css('color', '');
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
            ReloadString(settings, data, '/ScheduleProposal/GetWKSpots', _UniqueId, 30, 'HeaderWK01',1);
        }
    }
}
function ReloadWK02Spots(proptable, settings, data) {
    var colStat = proptable.column(31);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetWKSpots', _UniqueId, 31, 'HeaderWK02',2);
        }
    }
}
function ReloadWK03Spots(proptable, settings, data) {
    var colStat = proptable.column(32);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetWKSpots', _UniqueId, 32, 'HeaderWK03',3);
        }
    }
}
function ReloadWK04Spots(proptable, settings, data) {
    var colStat = proptable.column(33);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetWKSpots', _UniqueId, 33, 'HeaderWK04',4);
        }
    }
}
function ReloadWK05Spots(proptable, settings, data) {
    var colStat = proptable.column(34);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetWKSpots', _UniqueId, 34, 'HeaderWK05',5);
        }
    }
}
function ReloadWK06Spots(proptable, settings, data) {
    var colStat = proptable.column(35);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetWKSpots', _UniqueId, 35, 'HeaderWK06',6);
        }
    }
}
function ReloadWK07Spots(proptable, settings, data) {
    var colStat = proptable.column(36);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetWKSpots', _UniqueId, 36, 'HeaderWK07',7);
        }
    }
}
function ReloadWK08Spots(proptable, settings, data) {
    var colStat = proptable.column(37);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetWKSpots', _UniqueId, 37, 'HeaderWK08',8);
        }
    }
}
function ReloadWK09Spots(proptable, settings, data) {
    var colStat = proptable.column(38);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetWKSpots', _UniqueId, 38, 'HeaderWK09',9);
        }
    }
}
function ReloadWK10Spots(proptable, settings, data) {
    var colStat = proptable.column(39);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetWKSpots', _UniqueId, 39, 'HeaderWK10',10);
        }
    }
}
function ReloadWK11Spots(proptable, settings, data) {
    var colStat = proptable.column(40);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetWKSpots', _UniqueId, 40, 'HeaderWK11',11);
        }
    }
}
function ReloadWK12Spots(proptable, settings, data) {
    var colStat = proptable.column(41);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetWKSpots', _UniqueId, 41, 'HeaderWK12',12);
        }
    }
}
function ReloadWK13Spots(proptable, settings, data) {
    var colStat = proptable.column(42);
    if (colStat) {
        if (colStat.visible()) {
            ReloadString(settings, data, '/ScheduleProposal/GetWKSpots', _UniqueId, 42, 'HeaderWK13',13);
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

function ReloadAll(settings, data) {
    var proptable = $("#MyProposalTable").DataTable();
    if (proptable) {

        // ReloadBool
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
    console.log(discount);
    console.log(usd);
    console.log(cpm);
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
        async:false,
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



