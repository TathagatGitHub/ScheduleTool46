
var calctable;
var pathName = window.location.pathname;
function initCalcTable() {
    Codebase.blocks('#divCalculatorEdit', 'state_loading');
    if ($.fn.dataTable.isDataTable('#CalculatorEditTable'))

    {//calctable = $('#CalculatorEditTable').DataTable();
        $('#CalculatorEditTable').DataTable().clear().destroy();
    }
  //  else {
        calctable = $('#CalculatorEditTable').DataTable({
            ajax: {
                url: '/ScheduleProposal/GetProposalData',
                type: 'POST',
                data: function (d) {
                    d.proposalId = _UniqueId,
                        d.discountRate = parseFloat($("#DiscountPrice").find(":selected").text().replace('%', '')),
                        d.ViewOnly = (pathName.includes("ViewSchedule") || pathName.includes("ViewProposal")) ? true : false,
                        d.pageNum = $("#CurPage").val(),
                        d.pageLength = 200,
                        d.showTotals = true,
                        d.isPremiereFilter = $("#hdnPremiereFilter").val() == "1" ? true : false,//ST-807
                        d.calcExch = ($('#CalcExch').val() == '1' ? true : false),
                        d.schedule = (pathName.includes("EditSchedule") || pathName.includes("ViewSchedule")) ? true : false
                }
            },
            drawCallback: function (settings) {
            },
            initComplete: function () {                
                Codebase.blocks('#divCalculatorEdit', 'state_normal');
                //alert('complete');
            },
            columns: [
                {
                    targets: 0,
                    data: "description",
                    class: "d-none d-sm-table-cell"
                },
                {
                    targets: 1,
                    data: "total",
                    class: "d-none d-sm-table-cell text-center"
                },
                {
                    targets: 2,
                    data: "wk01",
                    class: "d-none d-sm-table-cell text-center no-color"
                },
                {
                    targets: 3,
                    data: "wk02",
                    class: "d-none d-sm-table-cell text-center no-color"
                },
                {
                    targets: 4,
                    data: "wk03",
                    class: "d-none d-sm-table-cell text-center no-color"
                },
                {
                    targets: 5,
                    data: "wk04",
                    class: "d-none d-sm-table-cell text-center no-color"
                },
                {
                    targets: 6,
                    data: "wk05",
                    class: "d-none d-sm-table-cell text-center no-color"
                },
                {
                    targets: 7,
                    data: "wk06",
                    class: "d-none d-sm-table-cell text-center no-color"
                },
                {
                    targets: 8,
                    data: "wk07",
                    class: "d-none d-sm-table-cell text-center no-color"
                },
                {
                    targets: 9,
                    data: "wk08",
                    class: "d-none d-sm-table-cell text-center no-color"
                },
                {
                    targets: 10,
                    data: "wk09",
                    class: "d-none d-sm-table-cell text-center no-color"
                },
                {
                    targets: 11,
                    data: "wk10",
                    class: "d-none d-sm-table-cell text-center no-color"
                },
                {
                    targets: 12,
                    data: "wk11",
                    class: "d-none d-sm-table-cell text-center no-color"
                },
                {
                    targets: 13,
                    data: "wk12",
                    class: "d-none d-sm-table-cell text-center no-color"
                },
                {
                    targets: 14,
                    data: "wk13",
                    class: "d-none d-sm-table-cell text-center no-color"
                },
                {
                    targets: 15,
                    data: "wk14",
                    class: "d-none d-sm-table-cell text-center no-color"
                },
                {
                    targets: 17,
                    defaultContent: '',
                    render: function (data, type, row, meta) {
                        return "<input style='width:0px!important;border-right-style:hidden;border-left-style:hidden;border-top-style:hidden;border-bottom-style:hidden;background-color: white;max-height:0px;' disabled>";
                        //border - right - style: hidden; border - left - style: hidden; border - top - style: hidden; border - bottom - style: hidden
                    }
                },

            ],
            paging: false,
            searching: true,
            info: false,
            ordering: false,
            autoWidth: false,
            dom: 'lrtip',
            scrollX: true,
            scrollCollapse: true,
            fixedColumns: {
                leftColumns: 2
            },
            rowCallback: function (row, data) {                              
                if (weekCounts["wk01"] > 0 || wk1 == true) {
                    $('td:eq(2)', row).addClass('text-danger');
                }
                else if (weekCounts["wk01"] == 0 ) {
                    $('td:eq(2)', row).removeClass('text-danger');
                }
                if (weekCounts["wk02"] > 0 || wk2 == true) {
                    $('td:eq(3)', row).addClass('text-danger');
                }
                else if (weekCounts["wk02"] == 0) {
                    $('td:eq(3)', row).removeClass('text-danger');
                }
                if (weekCounts["wk03"] > 0 || wk3 == true) {
                    $('td:eq(4)', row).addClass('text-danger');
                }
                else if (weekCounts["wk03"] == 0) {
                    $('td:eq(4)', row).removeClass('text-danger');
                }
                if (weekCounts["wk04"] > 0 || wk4 == true) {
                    $('td:eq(5)', row).addClass('text-danger');
                }
                else if (weekCounts["wk04"] == 0) {
                    $('td:eq(5)', row).removeClass('text-danger');
                }
                if (weekCounts["wk05"] > 0 || wk5 == true) {
                    $('td:eq(6)', row).addClass('text-danger');
                }
                else if (weekCounts["wk05"] == 0) {
                    $('td:eq(6)', row).removeClass('text-danger');
                }
                if (weekCounts["wk06"] > 0 || wk6 == true) {
                    $('td:eq(7)', row).addClass('text-danger');
                }
                else if (weekCounts["wk06"] == 0) {
                    $('td:eq(7)', row).removeClass('text-danger');
                }
                if (weekCounts["wk07"] > 0 || wk7 == true) {
                    $('td:eq(8)', row).addClass('text-danger');
                }
                else if (weekCounts["wk07"] == 0) {
                    $('td:eq(8)', row).removeClass('text-danger');
                }
                if (weekCounts["wk08"] > 0 || wk8 == true) {
                    $('td:eq(9)', row).addClass('text-danger');
                }
                else if (weekCounts["wk08"] == 0) {
                    $('td:eq(9)', row).removeClass('text-danger');
                }
                if (weekCounts["wk09"] > 0 || wk9 == true) {
                    $('td:eq(10)', row).addClass('text-danger');
                }
                else if (weekCounts["wk09"] == 0) {
                    $('td:eq(10)', row).removeClass('text-danger');
                }
                if (weekCounts["wk10"] > 0 || wk10 == true) {
                    $('td:eq(11)', row).addClass('text-danger');
                }
                else if (weekCounts["wk10"] == 0) {
                    $('td:eq(11)', row).removeClass('text-danger');
                }
                if (weekCounts["wk11"] > 0 || wk11 == true) {
                    $('td:eq(12)', row).addClass('text-danger');
                }
                else if (weekCounts["wk11"] == 0) {
                    $('td:eq(12)', row).removeClass('text-danger');
                }
                if (weekCounts["wk12"] > 0 || wk12 == true) {
                    $('td:eq(13)', row).addClass('text-danger');
                }
                else if (weekCounts["wk12"] == 0) {
                    $('td:eq(13)', row).removeClass('text-danger');
                }
                if (weekCounts["wk13"] > 0 || wk13 == true) {
                    $('td:eq(14)', row).addClass('text-danger');
                }
                else if (weekCounts["wk13"] == 0) {
                    $('td:eq(14)', row).removeClass('text-danger');
                }
                if (weekCounts["wk14"] > 0 || wk14 == true)  {
                    $('td:eq(15)', row).addClass('text-danger');
                }
                else if (weekCounts["wk14"] == 0) {
                    $('td:eq(15)', row).removeClass('text-danger');
                }                
            }
        });
    //}
}
function CalculateUE(proptable) {
    var AvailableUE = "N/A";
    var BookedUE = "N/A"
    var UECount = 0;
    var SessionUE = "N/A";
    var StaticUE = "N/A";
    var BuyTypeCode = 'UE';

    var _Id = getParameterByName('ProposalId');
    if (!_Id || parseInt(_Id) === 0) {
        _Id = getParameterByName('ScheduleId');
    }

    var _NetworkNames = '';
    try {
        // COLINDEX_DEPENDENT 
        // 7 is currently the networkname column
        var data = proptable.column(7).data().unique();
        // $("#TotalScheduleNetworkCount").html(data.length).show();
        for (var idx = 0; idx < data.length; idx++) {
            _NetworkNames = _NetworkNames + ',' + data[idx];
        }
    }
    catch (err) { }

    var _BuyTypeCodes = "";
    try {
        // COLINDEX_DEPENDENT 
        // 22 is currently the buytype column
        var data = proptable.column(22).data().unique();
        for (var idx = 0; idx < data.length; idx++) {
            _BuyTypeCodes = _BuyTypeCodes + ',' + data[idx];
        }
    }
    catch (err) { }

    $.ajax({
        type: "POST",
        data: {
            ScheduleProposalId: _Id,
            NetworkNames: _NetworkNames,
            BuyTypeCodes: BuyTypeCode, //_BuyTypeCodes
            CalcExch: ($('#CalcExch').val() == '1' ? true : false)
            //CurStaticAvailableUE: unformatCurrency($("#AvailableUESaved").html()),
            //CurStaticBookedUE: unformatCurrency($("#BookedUESaved").html())
        },
        url: '/ScheduleProposal/GetUpfrontExpansionInfo',
        async: true,
        success: function (result) {
            console.log(result);
            if (result.responseCode == -2) {
                // Show or Hide UE depending on quarter.  It would prbabky be faster if I just loook at the ViewModel for info
                // but this way we keep all the logic in the stored procedure.  We can change later if necessary to speed up.
                $("#HeaderCol1").attr("class", "col-md-6");
                $("#HeaderCol2").attr("class", "col-md-6");
                $("#HeaderCol3").attr("style", "display:none");
            }
            else {
                $("#HeaderCol1").attr("class", "col-md-5");
                $("#HeaderCol2").attr("class", "col-md-4");
                $("#HeaderCol3").attr("class", "col-md-3");
                $("#HeaderCol3").removeAttr("style");

                if (result.responseCode <= 0) {
                    $("#TotalScheduleAvailableUE").html('N/A').show();
                    document.getElementById('TotalScheduleAvailableUE').setAttribute("class", "font-size-h3 font-w600 text-danger");
                    $("#TotalScheduleBookedUE").html('N/A').show();
                    //$("#TotalScheduleBookedUELabel").html("Booked UE (" + result.ueCount + ")").show();
                    $("#TotalScheduleNetworkCount").html(result.networkCount).show();
                    $("#TotalScheduleBillingType").html(result.billingType).show();
                    $("#AvailableUESaved").html('N/A').show();
                    $("#BookedUESaved").html('N/A').show();
                    $("#ErrorDescription").html(result.errorDescription).show();
                }
                else {
                    $("#TotalScheduleAvailableUE").html(formatCurrency(result.availableUE, 0)).show();
                    if (parseFloat(result.availableUE) < 0) {
                        document.getElementById('TotalScheduleAvailableUE').setAttribute("class", "font-size-h3 font-w600 text-danger");
                    }
                    else {
                        document.getElementById('TotalScheduleAvailableUE').setAttribute("class", "font-size-h3 font-w600 text-success");
                    }
                    $("#TotalScheduleBookedUE").html(formatCurrency(result.bookedUE, 0)).show();
                    //$("#TotalScheduleBookedUELabel").html("Booked UE (" + result.ueCount + ")").show();
                    $("#TotalScheduleNetworkCount").html(result.networkCount).show();
                    $("#TotalScheduleBillingType").html(result.billingType).show();
                    $("#AvailableUESaved").html(formatCurrency(result.staticAvailableUE, 0)).show();
                    $("#BookedUESaved").html(formatCurrency(result.staticBookedUE, 0)).show();
                    $("#ErrorDescription").html(result.errorDescription).show();
                }
            }
        },
        error: function (response) {
            $("#ErrorDescription").html(response.responseText).show();
        }
    });



}

/* 
 * ReloadTotals()
 * -- This refreshes the totals on the upper right of proposal/schedule pages
 */
function ReloadTotals() {
    try {        
        Codebase.blocks('#divCalculatorEdit', 'state_loading');
        if (typeof calctable === 'undefined' || calctable == null) {
            initCalcTable();
        }
        else {
            calctable.ajax.reload();          
        }
        Codebase.blocks('#divCalculatorEdit', 'state_normal');
    }
    catch (err) {
        swal(err.message);
    }
}



function ShowHideGIBySpotLen() {
    var table = $("#CalculatorEditTable").DataTable();
    if (table) {
        table.rows().every(function (index, element) {
            var row = $(this.node());
            var data = $(this.data());
            // console.log(data[0]);
            if (data[0] == "GI % - :15") {
                console.log(_Show15);
                if (_Show15 == false) {
                    $(row).hide();
                }
                else {
                    $(row).show();
                }
            }
            if (data[0] == "GI % - :30") {
                console.log(_Show30);
                if (_Show30 == false) {
                    $(row).hide();
                }
                else {
                    $(row).show();
                }
            }
            if (data[0] == "GI % - :60") {
                console.log(_Show60);
                if (_Show60 == false) {
                    $(row).hide();
                }
                else {
                    $(row).show();
                }
            }
            if (data[0] == "GI % - :120") {
                console.log(_Show120);
                if (_Show120 == false) {
                    $(row).hide();
                }
                else {
                    $(row).show();
                }
            }
        });
    }

    if ($("#countryid").val() == 2) {
        var tableUSD = $("#CalculatorUSDTable").DataTable();
        if (tableUSD) {
            tableUSD.rows().every(function (index, element) {
                var row = $(this.node());
                var data = $(this.data());
                // console.log(data[0]);
                if (data[0] == "GI % - :15") {
                    console.log(_Show15);
                    if (_Show15 == false) {
                        $(row).hide();
                    }
                    else {
                        $(row).show();
                    }
                }
                if (data[0] == "GI % - :30") {
                    console.log(_Show30);
                    if (_Show30 == false) {
                        $(row).hide();
                    }
                    else {
                        $(row).show();
                    }
                }
                if (data[0] == "GI % - :60") {
                    console.log(_Show60);
                    if (_Show60 == false) {
                        $(row).hide();
                    }
                    else {
                        $(row).show();
                    }
                }
                if (data[0] == "GI % - :120") {
                    console.log(_Show120);
                    if (_Show120 == false) {
                        $(row).hide();
                    }
                    else {
                        $(row).show();
                    }
                }
            });
        }
    }
}

function CalculateGIPercentage(proptable, SpotLen,
    TotalWk01, TotalWk02, TotalWk03, TotalWk04, TotalWk05, TotalWk06, TotalWk07, TotalWk08, TotalWk09, TotalWk10, TotalWk11, TotalWk12, TotalWk13, TotalWk14,
    TotalGrossImpressionsWk01, TotalGrossImpressionsWk02, TotalGrossImpressionsWk03, TotalGrossImpressionsWk04, TotalGrossImpressionsWk05, TotalGrossImpressionsWk06, TotalGrossImpressionsWk07,
    TotalGrossImpressionsWk08, TotalGrossImpressionsWk09, TotalGrossImpressionsWk10, TotalGrossImpressionsWk11, TotalGrossImpressionsWk12, TotalGrossImpressionsWk13, TotalGrossImpressionsWk14
) {

    var TotalGIWk01 = (TotalGrossImpressionsWk01 == 0 ? 0 : parseFloat(TotalWk01) / parseFloat(TotalGrossImpressionsWk01));
    var TotalGIWk02 = (TotalGrossImpressionsWk02 == 0 ? 0 : parseFloat(TotalWk02) / parseFloat(TotalGrossImpressionsWk02));
    var TotalGIWk03 = (TotalGrossImpressionsWk03 == 0 ? 0 : parseFloat(TotalWk03) / parseFloat(TotalGrossImpressionsWk03));
    var TotalGIWk04 = (TotalGrossImpressionsWk04 == 0 ? 0 : parseFloat(TotalWk04) / parseFloat(TotalGrossImpressionsWk04));
    var TotalGIWk05 = (TotalGrossImpressionsWk05 == 0 ? 0 : parseFloat(TotalWk05) / parseFloat(TotalGrossImpressionsWk05));
    var TotalGIWk06 = (TotalGrossImpressionsWk06 == 0 ? 0 : parseFloat(TotalWk06) / parseFloat(TotalGrossImpressionsWk06));
    var TotalGIWk07 = (TotalGrossImpressionsWk07 == 0 ? 0 : parseFloat(TotalWk07) / parseFloat(TotalGrossImpressionsWk07));
    var TotalGIWk08 = (TotalGrossImpressionsWk08 == 0 ? 0 : parseFloat(TotalWk08) / parseFloat(TotalGrossImpressionsWk08));
    var TotalGIWk09 = (TotalGrossImpressionsWk09 == 0 ? 0 : parseFloat(TotalWk09) / parseFloat(TotalGrossImpressionsWk09));
    var TotalGIWk10 = (TotalGrossImpressionsWk10 == 0 ? 0 : parseFloat(TotalWk10) / parseFloat(TotalGrossImpressionsWk10));
    var TotalGIWk11 = (TotalGrossImpressionsWk11 == 0 ? 0 : parseFloat(TotalWk11) / parseFloat(TotalGrossImpressionsWk11));
    var TotalGIWk12 = (TotalGrossImpressionsWk12 == 0 ? 0 : parseFloat(TotalWk12) / parseFloat(TotalGrossImpressionsWk12));
    var TotalGIWk13 = (TotalGrossImpressionsWk13 == 0 ? 0 : parseFloat(TotalWk13) / parseFloat(TotalGrossImpressionsWk13));
    var TotalGIWk14 = (TotalGrossImpressionsWk14 == 0 ? 0 : parseFloat(TotalWk14) / parseFloat(TotalGrossImpressionsWk14));

    var Total = TotalWk01 + TotalWk02 + TotalWk03 + TotalWk04 + TotalWk05 + TotalWk06 + TotalWk07 +
        TotalWk08 + TotalWk09 + TotalWk10 + TotalWk11 + TotalWk12 + TotalWk13 + TotalWk14;

    var TotalGrossImpressions = TotalGrossImpressionsWk01 + TotalGrossImpressionsWk02 +
        TotalGrossImpressionsWk03 + TotalGrossImpressionsWk04 +
        TotalGrossImpressionsWk05 + TotalGrossImpressionsWk06 +
        TotalGrossImpressionsWk07 + TotalGrossImpressionsWk08 +
        TotalGrossImpressionsWk09 + TotalGrossImpressionsWk10 +
        TotalGrossImpressionsWk11 + TotalGrossImpressionsWk12 +
        TotalGrossImpressionsWk13 + TotalGrossImpressionsWk14;

    var TotalGI = (TotalGrossImpressions == 0 ? 0 : parseFloat(Total) / parseFloat(TotalGrossImpressions));

    try {
        if (popupGrossIncome) {
            popupGrossIncome.SetGI(SpotLen, TotalGI, TotalGIWk01, TotalGIWk02, TotalGIWk03, TotalGIWk04, TotalGIWk05, TotalGIWk06, TotalGIWk07, TotalGIWk08,
                TotalGIWk09, TotalGIWk10, TotalGIWk11, TotalGIWk12, TotalGIWk13, TotalGIWk14);
        }
    }
    catch (err) {
        console.log(err.message);
    }

    $('#TotalGIPercent' + SpotLen).html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI)).show();
    $('#TotalGIPercent' + SpotLen + 'Wk01').html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGIWk01)).show();
    $('#TotalGIPercent' + SpotLen + 'Wk02').html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGIWk02)).show();
    $('#TotalGIPercent' + SpotLen + 'Wk03').html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGIWk03)).show();
    $('#TotalGIPercent' + SpotLen + 'Wk04').html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGIWk04)).show();
    $('#TotalGIPercent' + SpotLen + 'Wk05').html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGIWk05)).show();
    $('#TotalGIPercent' + SpotLen + 'Wk06').html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGIWk06)).show();
    $('#TotalGIPercent' + SpotLen + 'Wk07').html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGIWk07)).show();
    $('#TotalGIPercent' + SpotLen + 'Wk08').html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGIWk08)).show();
    $('#TotalGIPercent' + SpotLen + 'Wk09').html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGIWk09)).show();
    $('#TotalGIPercent' + SpotLen + 'Wk10').html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGIWk10)).show();
    $('#TotalGIPercent' + SpotLen + 'Wk11').html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGIWk11)).show();
    $('#TotalGIPercent' + SpotLen + 'Wk12').html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGIWk12)).show();
    $('#TotalGIPercent' + SpotLen + 'Wk13').html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGIWk13)).show();
    $('#TotalGIPercent' + SpotLen + 'Wk14').html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGIWk14)).show();

    if ($("#countryid").val() == 2) {
        $('#TotalGIPercentUSD' + SpotLen).html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI)).show();
        $('#TotalGIPercentUSD' + SpotLen + 'Wk01').html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGIWk01)).show();
        $('#TotalGIPercentUSD' + SpotLen + 'Wk02').html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGIWk02)).show();
        $('#TotalGIPercentUSD' + SpotLen + 'Wk03').html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGIWk03)).show();
        $('#TotalGIPercentUSD' + SpotLen + 'Wk04').html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGIWk04)).show();
        $('#TotalGIPercentUSD' + SpotLen + 'Wk05').html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGIWk05)).show();
        $('#TotalGIPercentUSD' + SpotLen + 'Wk06').html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGIWk06)).show();
        $('#TotalGIPercentUSD' + SpotLen + 'Wk07').html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGIWk07)).show();
        $('#TotalGIPercentUSD' + SpotLen + 'Wk08').html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGIWk08)).show();
        $('#TotalGIPercentUSD' + SpotLen + 'Wk09').html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGIWk09)).show();
        $('#TotalGIPercentUSD' + SpotLen + 'Wk10').html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGIWk10)).show();
        $('#TotalGIPercentUSD' + SpotLen + 'Wk11').html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGIWk11)).show();
        $('#TotalGIPercentUSD' + SpotLen + 'Wk12').html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGIWk12)).show();
        $('#TotalGIPercentUSD' + SpotLen + 'Wk13').html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGIWk13)).show();
        $('#TotalGIPercentUSD' + SpotLen + 'Wk14').html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGIWk14)).show();
    }
}

function CalculateSummaryRows(Total, Type, Currency,
    TotalWk01, TotalWk02, TotalWk03, TotalWk04, TotalWk05, TotalWk06, TotalWk07, TotalWk08, TotalWk09, TotalWk10, TotalWk11, TotalWk12, TotalWk13, TotalWk14,
    TotalGrossImpressionsWk01, TotalGrossImpressionsWk02, TotalGrossImpressionsWk03, TotalGrossImpressionsWk04, TotalGrossImpressionsWk05, TotalGrossImpressionsWk06, TotalGrossImpressionsWk07,
    TotalGrossImpressionsWk08, TotalGrossImpressionsWk09, TotalGrossImpressionsWk10, TotalGrossImpressionsWk11, TotalGrossImpressionsWk12, TotalGrossImpressionsWk13, TotalGrossImpressionsWk14,
    Week01Rate, Week02Rate, Week03Rate, Week04Rate, Week05Rate, Week06Rate, Week07Rate, Week08Rate, Week09Rate, Week10Rate, Week11Rate, Week12Rate, Week13Rate, Week14Rate, ClientExchangeRate
) {
    var TotalGrossImpressions = TotalGrossImpressionsWk01 + TotalGrossImpressionsWk02 + TotalGrossImpressionsWk03 + TotalGrossImpressionsWk04 + TotalGrossImpressionsWk05 + TotalGrossImpressionsWk06 + TotalGrossImpressionsWk07 + TotalGrossImpressionsWk08 + TotalGrossImpressionsWk09 + TotalGrossImpressionsWk10 + TotalGrossImpressionsWk11 + TotalGrossImpressionsWk12 + TotalGrossImpressionsWk13 + TotalGrossImpressionsWk14;

    if (Currency == false) {
        $("#" + Type + "Wk01").html(TotalWk01.toLocaleString()).show();
        $("#" + Type + "Wk02").html(TotalWk02.toLocaleString()).show();
        $("#" + Type + "Wk03").html(TotalWk03.toLocaleString()).show();
        $("#" + Type + "Wk04").html(TotalWk04.toLocaleString()).show();
        $("#" + Type + "Wk05").html(TotalWk05.toLocaleString()).show();
        $("#" + Type + "Wk06").html(TotalWk06.toLocaleString()).show();
        $("#" + Type + "Wk07").html(TotalWk07.toLocaleString()).show();
        $("#" + Type + "Wk08").html(TotalWk08.toLocaleString()).show();
        $("#" + Type + "Wk09").html(TotalWk09.toLocaleString()).show();
        $("#" + Type + "Wk10").html(TotalWk10.toLocaleString()).show();
        $("#" + Type + "Wk11").html(TotalWk11.toLocaleString()).show();
        $("#" + Type + "Wk12").html(TotalWk12.toLocaleString()).show();
        $("#" + Type + "Wk13").html(TotalWk13.toLocaleString()).show();
        $("#" + Type + "Wk14").html(TotalWk14.toLocaleString()).show();

        $("#" + Type + "").html(Total.toLocaleString()).show();

        $("#" + Type + "Wk01_Converted").html(TotalWk01.toLocaleString()).show();
        $("#" + Type + "Wk02_Converted").html(TotalWk02.toLocaleString()).show();
        $("#" + Type + "Wk03_Converted").html(TotalWk03.toLocaleString()).show();
        $("#" + Type + "Wk04_Converted").html(TotalWk04.toLocaleString()).show();
        $("#" + Type + "Wk05_Converted").html(TotalWk05.toLocaleString()).show();
        $("#" + Type + "Wk06_Converted").html(TotalWk06.toLocaleString()).show();
        $("#" + Type + "Wk07_Converted").html(TotalWk07.toLocaleString()).show();
        $("#" + Type + "Wk08_Converted").html(TotalWk08.toLocaleString()).show();
        $("#" + Type + "Wk09_Converted").html(TotalWk09.toLocaleString()).show();
        $("#" + Type + "Wk10_Converted").html(TotalWk10.toLocaleString()).show();
        $("#" + Type + "Wk11_Converted").html(TotalWk11.toLocaleString()).show();
        $("#" + Type + "Wk12_Converted").html(TotalWk12.toLocaleString()).show();
        $("#" + Type + "Wk13_Converted").html(TotalWk13.toLocaleString()).show();
        $("#" + Type + "Wk14_Converted").html(TotalWk14.toLocaleString()).show();

        $("#" + Type + "_Converted").html(Total.toLocaleString()).show();

        $("#TotalGrossImpressionsWk01").html(TotalGrossImpressionsWk01.toLocaleString()).show();
        $("#TotalGrossImpressionsWk02").html(TotalGrossImpressionsWk02.toLocaleString()).show();
        $("#TotalGrossImpressionsWk03").html(TotalGrossImpressionsWk03.toLocaleString()).show();
        $("#TotalGrossImpressionsWk04").html(TotalGrossImpressionsWk04.toLocaleString()).show();
        $("#TotalGrossImpressionsWk05").html(TotalGrossImpressionsWk05.toLocaleString()).show();
        $("#TotalGrossImpressionsWk06").html(TotalGrossImpressionsWk06.toLocaleString()).show();
        $("#TotalGrossImpressionsWk07").html(TotalGrossImpressionsWk07.toLocaleString()).show();
        $("#TotalGrossImpressionsWk08").html(TotalGrossImpressionsWk08.toLocaleString()).show();
        $("#TotalGrossImpressionsWk09").html(TotalGrossImpressionsWk09.toLocaleString()).show();
        $("#TotalGrossImpressionsWk10").html(TotalGrossImpressionsWk10.toLocaleString()).show();
        $("#TotalGrossImpressionsWk11").html(TotalGrossImpressionsWk11.toLocaleString()).show();
        $("#TotalGrossImpressionsWk12").html(TotalGrossImpressionsWk12.toLocaleString()).show();
        $("#TotalGrossImpressionsWk13").html(TotalGrossImpressionsWk13.toLocaleString()).show();
        $("#TotalGrossImpressionsWk14").html(TotalGrossImpressionsWk14.toLocaleString()).show();
        $("#TotalGrossImpressions").html(TotalGrossImpressions.toLocaleString()).show();

        $("#TotalGrossImpressionsWk01_Converted").html(TotalGrossImpressionsWk01.toLocaleString()).show();
        $("#TotalGrossImpressionsWk02_Converted").html(TotalGrossImpressionsWk02.toLocaleString()).show();
        $("#TotalGrossImpressionsWk03_Converted").html(TotalGrossImpressionsWk03.toLocaleString()).show();
        $("#TotalGrossImpressionsWk04_Converted").html(TotalGrossImpressionsWk04.toLocaleString()).show();
        $("#TotalGrossImpressionsWk05_Converted").html(TotalGrossImpressionsWk05.toLocaleString()).show();
        $("#TotalGrossImpressionsWk06_Converted").html(TotalGrossImpressionsWk06.toLocaleString()).show();
        $("#TotalGrossImpressionsWk07_Converted").html(TotalGrossImpressionsWk07.toLocaleString()).show();
        $("#TotalGrossImpressionsWk08_Converted").html(TotalGrossImpressionsWk08.toLocaleString()).show();
        $("#TotalGrossImpressionsWk09_Converted").html(TotalGrossImpressionsWk09.toLocaleString()).show();
        $("#TotalGrossImpressionsWk10_Converted").html(TotalGrossImpressionsWk10.toLocaleString()).show();
        $("#TotalGrossImpressionsWk11_Converted").html(TotalGrossImpressionsWk11.toLocaleString()).show();
        $("#TotalGrossImpressionsWk12_Converted").html(TotalGrossImpressionsWk12.toLocaleString()).show();
        $("#TotalGrossImpressionsWk13_Converted").html(TotalGrossImpressionsWk13.toLocaleString()).show();
        $("#TotalGrossImpressionsWk14_Converted").html(TotalGrossImpressionsWk14.toLocaleString()).show();
        $("#TotalGrossImpressions_Converted").html(TotalGrossImpressions.toLocaleString()).show();
    }
    else {
        $("#" + Type + "Wk01").html(formatCurrency(TotalWk01)).show();
        $("#" + Type + "Wk02").html(formatCurrency(TotalWk02)).show();
        $("#" + Type + "Wk03").html(formatCurrency(TotalWk03)).show();
        $("#" + Type + "Wk04").html(formatCurrency(TotalWk04)).show();
        $("#" + Type + "Wk05").html(formatCurrency(TotalWk05)).show();
        $("#" + Type + "Wk06").html(formatCurrency(TotalWk06)).show();
        $("#" + Type + "Wk07").html(formatCurrency(TotalWk07)).show();
        $("#" + Type + "Wk08").html(formatCurrency(TotalWk08)).show();
        $("#" + Type + "Wk09").html(formatCurrency(TotalWk09)).show();
        $("#" + Type + "Wk10").html(formatCurrency(TotalWk10)).show();
        $("#" + Type + "Wk11").html(formatCurrency(TotalWk11)).show();
        $("#" + Type + "Wk12").html(formatCurrency(TotalWk12)).show();
        $("#" + Type + "Wk13").html(formatCurrency(TotalWk13)).show();
        $("#" + Type + "Wk14").html(formatCurrency(TotalWk14)).show();

        $("#" + Type).html(formatCurrency(Total)).show();

        $("#" + Type + "Wk01_Converted").html(formatCurrency(TotalWk01 *Week01Rate)).show();
        $("#" + Type + "Wk02_Converted").html(formatCurrency(TotalWk02 *Week02Rate)).show();
        $("#" + Type + "Wk03_Converted").html(formatCurrency(TotalWk03 *Week03Rate)).show();
        $("#" + Type + "Wk04_Converted").html(formatCurrency(TotalWk04 *Week04Rate)).show();
        $("#" + Type + "Wk05_Converted").html(formatCurrency(TotalWk05 *Week05Rate)).show();
        $("#" + Type + "Wk06_Converted").html(formatCurrency(TotalWk06 *Week06Rate)).show();
        $("#" + Type + "Wk07_Converted").html(formatCurrency(TotalWk07 *Week07Rate)).show();
        $("#" + Type + "Wk08_Converted").html(formatCurrency(TotalWk08 *Week08Rate)).show();
        $("#" + Type + "Wk09_Converted").html(formatCurrency(TotalWk09 *Week09Rate)).show();
        $("#" + Type + "Wk10_Converted").html(formatCurrency(TotalWk10 *Week10Rate)).show();
        $("#" + Type + "Wk11_Converted").html(formatCurrency(TotalWk11 *Week11Rate)).show();
        $("#" + Type + "Wk12_Converted").html(formatCurrency(TotalWk12 *Week12Rate)).show();
        $("#" + Type + "Wk13_Converted").html(formatCurrency(TotalWk13 *Week13Rate)).show();
        $("#" + Type + "Wk14_Converted").html(formatCurrency(TotalWk14 *Week14Rate)).show();

        $("#" + Type + "_Converted").html(formatCurrency(Total *ClientExchangeRate)).show();
    }
}

function CalculateGIBuyType(proptable, Type,
    TotalWk01, TotalWk02, TotalWk03, TotalWk04, TotalWk05, TotalWk06, TotalWk07, TotalWk08, TotalWk09, TotalWk10, TotalWk11, TotalWk12, TotalWk13, TotalWk14,
    TotalGrossImpressionsWk01, TotalGrossImpressionsWk02, TotalGrossImpressionsWk03, TotalGrossImpressionsWk04, TotalGrossImpressionsWk05, TotalGrossImpressionsWk06, TotalGrossImpressionsWk07,
    TotalGrossImpressionsWk08, TotalGrossImpressionsWk09, TotalGrossImpressionsWk10, TotalGrossImpressionsWk11, TotalGrossImpressionsWk12, TotalGrossImpressionsWk13, TotalGrossImpressionsWk14
) {
    CalculateGIDayPart(proptable, Type,
        TotalWk01, TotalWk02, TotalWk03, TotalWk04, TotalWk05, TotalWk06, TotalWk07, TotalWk08, TotalWk09, TotalWk10, TotalWk11, TotalWk12, TotalWk13, TotalWk14,
        TotalGrossImpressionsWk01, TotalGrossImpressionsWk02, TotalGrossImpressionsWk03, TotalGrossImpressionsWk04, TotalGrossImpressionsWk05, TotalGrossImpressionsWk06, TotalGrossImpressionsWk07,
        TotalGrossImpressionsWk08, TotalGrossImpressionsWk09, TotalGrossImpressionsWk10, TotalGrossImpressionsWk11, TotalGrossImpressionsWk12, TotalGrossImpressionsWk13, TotalGrossImpressionsWk14
    );
}
function CalculateGIDayPart(proptable, Type,
    TotalWk01, TotalWk02, TotalWk03, TotalWk04, TotalWk05, TotalWk06, TotalWk07, TotalWk08, TotalWk09, TotalWk10, TotalWk11, TotalWk12, TotalWk13, TotalWk14,
    TotalGrossImpressionsWk01, TotalGrossImpressionsWk02, TotalGrossImpressionsWk03, TotalGrossImpressionsWk04, TotalGrossImpressionsWk05, TotalGrossImpressionsWk06, TotalGrossImpressionsWk07,
    TotalGrossImpressionsWk08, TotalGrossImpressionsWk09, TotalGrossImpressionsWk10, TotalGrossImpressionsWk11, TotalGrossImpressionsWk12, TotalGrossImpressionsWk13, TotalGrossImpressionsWk14
) {

    var TotalGIWk01 = (TotalGrossImpressionsWk01 == 0 ? 0 : parseFloat(TotalWk01) / parseFloat(TotalGrossImpressionsWk01));
    var TotalGIWk02 = (TotalGrossImpressionsWk02 == 0 ? 0 : parseFloat(TotalWk02) / parseFloat(TotalGrossImpressionsWk02));
    var TotalGIWk03 = (TotalGrossImpressionsWk03 == 0 ? 0 : parseFloat(TotalWk03) / parseFloat(TotalGrossImpressionsWk03));
    var TotalGIWk04 = (TotalGrossImpressionsWk04 == 0 ? 0 : parseFloat(TotalWk04) / parseFloat(TotalGrossImpressionsWk04));
    var TotalGIWk05 = (TotalGrossImpressionsWk05 == 0 ? 0 : parseFloat(TotalWk05) / parseFloat(TotalGrossImpressionsWk05));
    var TotalGIWk06 = (TotalGrossImpressionsWk06 == 0 ? 0 : parseFloat(TotalWk06) / parseFloat(TotalGrossImpressionsWk06));
    var TotalGIWk07 = (TotalGrossImpressionsWk07 == 0 ? 0 : parseFloat(TotalWk07) / parseFloat(TotalGrossImpressionsWk07));
    var TotalGIWk08 = (TotalGrossImpressionsWk08 == 0 ? 0 : parseFloat(TotalWk08) / parseFloat(TotalGrossImpressionsWk08));
    var TotalGIWk09 = (TotalGrossImpressionsWk09 == 0 ? 0 : parseFloat(TotalWk09) / parseFloat(TotalGrossImpressionsWk09));
    var TotalGIWk10 = (TotalGrossImpressionsWk10 == 0 ? 0 : parseFloat(TotalWk10) / parseFloat(TotalGrossImpressionsWk10));
    var TotalGIWk11 = (TotalGrossImpressionsWk11 == 0 ? 0 : parseFloat(TotalWk11) / parseFloat(TotalGrossImpressionsWk11));
    var TotalGIWk12 = (TotalGrossImpressionsWk12 == 0 ? 0 : parseFloat(TotalWk12) / parseFloat(TotalGrossImpressionsWk12));
    var TotalGIWk13 = (TotalGrossImpressionsWk13 == 0 ? 0 : parseFloat(TotalWk13) / parseFloat(TotalGrossImpressionsWk13));
    var TotalGIWk14 = (TotalGrossImpressionsWk14 == 0 ? 0 : parseFloat(TotalWk14) / parseFloat(TotalGrossImpressionsWk14));

    var Total = TotalWk01 + TotalWk02 + TotalWk03 + TotalWk04 + TotalWk05 + TotalWk06 + TotalWk07 +
        TotalWk08 + TotalWk09 + TotalWk10 + TotalWk11 + TotalWk12 + TotalWk13 + TotalWk14;

    var TotalGrossImpressions = TotalGrossImpressionsWk01 + TotalGrossImpressionsWk02 +
        TotalGrossImpressionsWk03 + TotalGrossImpressionsWk04 +
        TotalGrossImpressionsWk05 + TotalGrossImpressionsWk06 +
        TotalGrossImpressionsWk07 + TotalGrossImpressionsWk08 +
        TotalGrossImpressionsWk09 + TotalGrossImpressionsWk10 +
        TotalGrossImpressionsWk11 + TotalGrossImpressionsWk12 +
        TotalGrossImpressionsWk13 + TotalGrossImpressionsWk14;

    var TotalGI = (TotalGrossImpressions == 0 ? 0 : parseFloat(Total) / parseFloat(TotalGrossImpressions));

    try {
        popupGrossIncome.SetGI(Type, TotalGI, TotalGIWk01, TotalGIWk02, TotalGIWk03, TotalGIWk04, TotalGIWk05, TotalGIWk06, TotalGIWk07, TotalGIWk08,
            TotalGIWk09, TotalGIWk10, TotalGIWk11, TotalGIWk12, TotalGIWk13, TotalGIWk14);
    }
    catch (err) {
        console.log(err.message);
    }
}

function ShowHideExchangeRates() {
    if ($('#CalcExch').val() == '1') {
        $('#CalcExch').val('0');
    }
    else {
        $('#CalcExch').val('1');
    }
    ReloadTotals();

    /*
    if ($('#hideUSD').css('display') == 'none') {
        $('#hideUSD').css('display', 'block');
    }
    else {
        $('#hideUSD').css('display', 'none');

    }

    if ($('#hideEdit').css('display') == 'none') {
        $('#hideEdit').css('display', 'block');
    }
    else {
        $('#hideEdit').css('display', 'none');

    }
    */
}
