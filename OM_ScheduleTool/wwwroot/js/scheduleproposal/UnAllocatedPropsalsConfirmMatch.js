var ProposalsForConfirmation;
var StSpotsJson;
var SelTab = 1;
var CurSelRateIds = [];
var currentJson = [];
var NewProposalId = 0;
var redirectFrom = "";
function ShowOverlayPopupConfirmMatch() {
    document.getElementById("DivOverLayPopoupConfirmMatch").style.display = "block";
}
function HideOverlayPopupConfirmMatch() {
    document.getElementById("DivOverLayPopoupConfirmMatch").style.display = "none";
}
function BindConfirmMatchScreenData(selJson) {
    NewProposalId = 0;
    //$("#ImportHeadingDataCM").html($("#MatchingHeadingData").html().replace("Matching ", "Confirmation "));
    //$("#ImportHeadingData").html("Import Proposals : " + selJson[0].clientName + " - " + selJson[0].quarterName);
    $("#dealAction").css("display", "none");
    $("#ImportHeadingDataCM").html("Confirm Matches : " + $("#ddlclients :selected").text() + " - " + ($(".nav-link.active").html().split(' ')[0]).toString().substring(2, 1) + "Q" + $(".nav-link.active").html().split(' ')[1] + " Network: " + $("#spnCurNetworkName").html().replace("<br/>", "").replace("<br>", ""));
    $("#dealAction1").html($("#dealAction").html());
    ProposalsForConfirmation = selJson.filter(o => o.demoName != "");
    if ($.fn.dataTable.isDataTable('#ConfirmMatchedProposals')) {
        $('#ConfirmMatchedProposals').DataTable().clear().destroy();
    }
    $("#modal-UnAllocatedProposalsConfirmMatch .block-content").css("max-height", $(window).height() - 200);
    $("#modal-UnAllocatedProposalsConfirmMatch .block-content").height($(window).height() - 150);
    $("#modal-UnAllocatedProposalsConfirmMatch .block-content").parent().height($(window).height() - 150);
    $("#divUnAllocatedNetworksConfirmMatches").height($(window).height() - 300);
    setTimeout(function () { BindConfirmationProperties() }, 1000);
    setTimeout(function () { $("#modal-UnAllocatedProposalsConfirmMatch .block-content").scrollLeft(0); }, 3000);
    if (IgnoredFilesToProcess.length == SelectedProposalsJson.length - 1 && SelectedProposalsJson.length > 1) {         
        $("#btnConfirmMatches3").prop("value", "Confirm and Open Proposal");
    }
}

function BindConfirmationProperties() {
   // ProposalsForConfirmation.sort()
    ProposalsForConfirmation.sort(function (a, b) {
        return a.propertyName.localeCompare(b.propertyName) || b.buyTypeCode.localeCompare(a.buyTypeCode)
            || a.spotLen.toString().localeCompare(b.spotLen.toString());
    });
    var RateIds = [];
    var maxActWeek = ProposalsForConfirmation[0].actualizedWeekNum;
    var unique = ProposalsForConfirmation.filter(function (itm, i, a) {
        var index = RateIds.findIndex(x => x === itm.rateId);
        if (index < 0) {
            RateIds.push(itm.rateId);
        }
    });
    console.log(unique);

    $.ajax({
        url: '/ScheduleProposal/GetSTSpotsForProposals',
        type: "GET",
        async: false,
        data: {
            "RateIds": RateIds.join(","),
            "ScheduleId": $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("schedule-id"),
            "ActWeekNum": maxActWeek,
            "FromST": true
        },
        success: function (result) {
            StSpotsJson = result.proposalsSpots;
            if (StSpotsJson != null && StSpotsJson != undefined && StSpotsJson.length > 0) {
                for (var x = 0; x < ProposalsForConfirmation.length; x++) {
                    if (ProposalsForConfirmation[x].fileAction == "add") {
                        var curRateId = ProposalsForConfirmation[x].rateId;
                        var curSTSpotsforRateId = StSpotsJson.filter(o => o.rateId == curRateId)[0];
                        if (curSTSpotsforRateId != null && curSTSpotsforRateId != undefined && curSTSpotsforRateId.rateId > 0) {

                            if (ProposalsForConfirmation[x].week01 != null && ProposalsForConfirmation[x].week01 != undefined && ProposalsForConfirmation[x].week01 != "") {
                                ProposalsForConfirmation[x].week01 = parseInt(ProposalsForConfirmation[x].week01) + parseInt(curSTSpotsforRateId.week01);
                            }
                            if (ProposalsForConfirmation[x].week02 != null && ProposalsForConfirmation[x].week02 != undefined && ProposalsForConfirmation[x].week02 != "") {
                                ProposalsForConfirmation[x].week02 = parseInt(ProposalsForConfirmation[x].week02) + parseInt(curSTSpotsforRateId.week02);
                            }
                            if (ProposalsForConfirmation[x].week03 != null && ProposalsForConfirmation[x].week03 != undefined && ProposalsForConfirmation[x].week03 != "") {
                                ProposalsForConfirmation[x].week03 = parseInt(ProposalsForConfirmation[x].week03) + parseInt(curSTSpotsforRateId.week03);
                            }
                            if (ProposalsForConfirmation[x].week04 != null && ProposalsForConfirmation[x].week04 != undefined && ProposalsForConfirmation[x].week04 != "") {
                                ProposalsForConfirmation[x].week04 = parseInt(ProposalsForConfirmation[x].week04) + parseInt(curSTSpotsforRateId.week04);
                            }
                            if (ProposalsForConfirmation[x].week05 != null && ProposalsForConfirmation[x].week05 != undefined && ProposalsForConfirmation[x].week05 != "") {
                                ProposalsForConfirmation[x].week05 = parseInt(ProposalsForConfirmation[x].week05) + parseInt(curSTSpotsforRateId.week05);
                            }
                            if (ProposalsForConfirmation[x].week06 != null && ProposalsForConfirmation[x].week06 != undefined && ProposalsForConfirmation[x].week06 != "") {
                                ProposalsForConfirmation[x].week06 = parseInt(ProposalsForConfirmation[x].week06) + parseInt(curSTSpotsforRateId.week06);
                            }
                            if (ProposalsForConfirmation[x].week07 != null && ProposalsForConfirmation[x].week07 != undefined && ProposalsForConfirmation[x].week07 != "") {
                                ProposalsForConfirmation[x].week07 = parseInt(ProposalsForConfirmation[x].week07) + parseInt(curSTSpotsforRateId.week07);
                            }
                            if (ProposalsForConfirmation[x].week08 != null && ProposalsForConfirmation[x].week08 != undefined && ProposalsForConfirmation[x].week08 != "") {
                                ProposalsForConfirmation[x].week08 = parseInt(ProposalsForConfirmation[x].week08) + parseInt(curSTSpotsforRateId.week08);
                            }
                            if (ProposalsForConfirmation[x].week09 != null && ProposalsForConfirmation[x].week09 != undefined && ProposalsForConfirmation[x].week09 != "") {
                                ProposalsForConfirmation[x].week09 = parseInt(ProposalsForConfirmation[x].week09) + parseInt(curSTSpotsforRateId.week09);
                            }
                            if (ProposalsForConfirmation[x].week10 != null && ProposalsForConfirmation[x].week10 != undefined && ProposalsForConfirmation[x].week10 != "") {
                                ProposalsForConfirmation[x].week10 = parseInt(ProposalsForConfirmation[x].week10) + parseInt(curSTSpotsforRateId.week10);
                            }
                            if (ProposalsForConfirmation[x].week11 != null && ProposalsForConfirmation[x].week11 != undefined && ProposalsForConfirmation[x].week11 != "") {
                                ProposalsForConfirmation[x].week11 = parseInt(ProposalsForConfirmation[x].week11) + parseInt(curSTSpotsforRateId.week11);
                            }
                            if (ProposalsForConfirmation[x].week12 != null && ProposalsForConfirmation[x].week12 != undefined && ProposalsForConfirmation[x].week12 != "") {
                                ProposalsForConfirmation[x].week12 = parseInt(ProposalsForConfirmation[x].week12) + parseInt(curSTSpotsforRateId.week12);
                            }
                            if (ProposalsForConfirmation[x].week13 != null && ProposalsForConfirmation[x].week13 != undefined && ProposalsForConfirmation[x].week13 != "") {
                                ProposalsForConfirmation[x].week13 = parseInt(ProposalsForConfirmation[x].week13) + parseInt(curSTSpotsforRateId.week13);
                            }
                            if (ProposalsForConfirmation[x].week14 != null && ProposalsForConfirmation[x].week14 != undefined && ProposalsForConfirmation[x].week14 != "") {
                                ProposalsForConfirmation[x].week14 = parseInt(ProposalsForConfirmation[x].week14) + parseInt(curSTSpotsforRateId.week14);
                            }
                        }
                        ProposalsForConfirmation[x].totalSpots =
                            parseInt(ProposalsForConfirmation[x].week01)
                            + parseInt(ProposalsForConfirmation[x].week02)
                            + parseInt(ProposalsForConfirmation[x].week03)
                            + parseInt(ProposalsForConfirmation[x].week04)
                            + parseInt(ProposalsForConfirmation[x].week05)
                            + parseInt(ProposalsForConfirmation[x].week06)
                            + parseInt(ProposalsForConfirmation[x].week07)
                            + parseInt(ProposalsForConfirmation[x].week08)
                            + parseInt(ProposalsForConfirmation[x].week09)
                            + parseInt(ProposalsForConfirmation[x].week10)
                            + parseInt(ProposalsForConfirmation[x].week11)
                            + parseInt(ProposalsForConfirmation[x].week12)
                            + parseInt(ProposalsForConfirmation[x].week13)
                            + parseInt(ProposalsForConfirmation[x].week14);
                    }
                }
            }
            BindtableHeadherConfirmMatch('thConfirmMatchedProposals', 'tbConfirmMatchedProposals');
        },
        error: function (response) {
            BindtableHeadherConfirmMatch('thConfirmMatchedProposals', 'tbConfirmMatchedProposals');
        }
    });
    //BindtableHeadherConfirmMatch('thConfirmMatchedProposals', 'tbConfirmMatchedProposals');
}

function BindtableHeadherConfirmMatch(tableHeaderName, tableBodyName) {
    currentJson = ProposalsForConfirmation;
    let keys;
    if (ProposalsForConfirmation.length > 0)
        keys = Object.keys(ProposalsForConfirmation[0]);

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
    $("#ConfirmMatchedProposals .HeaderWeekDay").remove();
    for (var x = 1; x < 15; x++) {
        var WeekDayName = (x > 9 ? "wk" : "wk0") + x.toString() + "_Date";
        let idx = parseInt(startIndexWeek) + parseInt(x);
        if (SelQtrJson[WeekDayName] != null && SelQtrJson[WeekDayName] != undefined && SelQtrJson[WeekDayName] != "") {
            columnsTitles[idx] = SelQtrJson[WeekDayName].substring(0, 10).split('-')[1] + "/" + SelQtrJson[WeekDayName].substring(0, 10).split('-')[2] + "/" + (SelQtrJson[WeekDayName].substring(0, 10).split('-')[0]).substr(2);
            var thWeek = "";
            thWeek = thWeek + "<th class='d-none d-sm-table-cell text-center align-text-top HeaderType HeaderWeekDay highZindex'>" + SelQtrJson[WeekDayName].substring(0, 10).split('-')[1] + "/" + SelQtrJson[WeekDayName].substring(0, 10).split('-')[2] + "/" + (SelQtrJson[WeekDayName].substring(0, 10).split('-')[0]).substr(2) + "</th>";
            $("#thConfirmMatchedProposals tr").append(thWeek);
        }
    }
    //$("#thConfirmMatchedProposals tr").append("<th></th><th></th><th></th><th></th>");
    $("#thConfirmMatchedProposals tr").append("<th class='d-none d-sm-table-cell text-center align-text-top HeaderType HeaderWeekDay highZindex'></th><th class='d-none d-sm-table-cell text-center align-text-top HeaderType HeaderWeekDay highZindex'></th><th class='d-none d-sm-table-cell text-center align-text-top HeaderType HeaderWeekDay highZindex'></th><th class='d-none d-sm-table-cell text-center align-text-top HeaderType HeaderWeekDay highZindex'></th>");
    columnsTitles[41] = "EDIPROPOSALSID";
    columnsTitles[42] = "TOTALDOLLAR";
    columnsTitles[43] = "CALCDOLLAR";
    columnsTitles[44] = "CALCIMPS";

    console.log(columns);
    console.log(columnsTitles);
    //HideOverlayPopupConfirmMatch();
    initConfirmMatchProposals(currentJson, columns, columnsTitles);
}
function initConfirmMatchProposals(sourceData, columns, columnsTitles) {
    // Codebase.blocks('#ConfirmMatchedProposals', 'state_loading');
    if ($.fn.dataTable.isDataTable('#ConfirmMatchedProposals')) {
        // proptable = $('#ConfirmMatchedProposals').DataTable();
        $('#ConfirmMatchedProposals').DataTable().clear().destroy();
        $('#ConfirmMatchedProposals tbody').html("");
    }

    $('#ConfirmMatchedProposals').DataTable({
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],

        data: sourceData,
        "aaSorting": [[4, "asc"], [16, "asc"]],
        destroy: true,
        autoWidth: false,
        paging: false,
        //ordering: true,
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
                class: "col-8-PropName d-none d-sm-table-cell text-left",
                render: ellipsis(39, true)
            },
            {
                targets: 5,
                data: "dow",
                class: "d-none d-sm-table-cell text-center",
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
                class: "d-none d-sm-table-cell text-center"
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
                class: "d-none d-sm-table-cell text-center"
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
                class: "d-none d-sm-table-cell text-center"
            },
            {
                targets: 19,
                data: "spotLen",
                class: "d-none d-sm-table-cell text-center",
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
                class: "col-6-DemoName d-none d-sm-table-cell text-center",
                render: ellipsis(33, true)
            },
            {
                targets: 22,
                data: "rateAmt",
                class: "d-none d-sm-table-cell text-left",
                render: $.fn.dataTable.render.number(',', '.', 2, '$')
            },
            {
                targets: 23,
                data: "impressions",
                class: ".col-28-Impressions d-none d-sm-table-cell text-left",
                render: $.fn.dataTable.render.number(',', '.', 2, '')
            },
            {
                targets: 24, /* CPM */
                data: "cpm",
                class: "d-none d-sm-table-cell text-left",
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
                data: "totalSpots",
                class: "text-center",
                searchable: false
            },
            {
                targets: [27],
                data: "week01",
                class: "d-none d-sm-table-cell text-center",
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
                class: "d-none d-sm-table-cell text-center",
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
                class: "d-none d-sm-table-cell text-center",
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
                class: "d-none d-sm-table-cell text-center",
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
                class: "d-none d-sm-table-cell text-center",
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
                class: "d-none d-sm-table-cell text-center",
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
                class: "d-none d-sm-table-cell text-center",
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
                class: "d-none d-sm-table-cell text-center",
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
                class: "d-none d-sm-table-cell text-center",
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
                class: "d-none d-sm-table-cell text-center",
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
                class: "d-none d-sm-table-cell text-center",
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
                class: "d-none d-sm-table-cell text-center",
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
                class: "d-none d-sm-table-cell text-center",
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
                class: "d-none d-sm-table-cell text-center",
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


        initComplete: function (settings, json) {

            setTimeout(function () {
                setTimeout(function () { BindTotalsConfirmMatch(); }, 1000);
            }, 1000);
        },
        scrollX: false,
        scrollCollapse: false
    });
}
function initConfirmMatchProposals_OLD(sourceData, columns, columnsTitles) {
    $("#ConfirmMatchedProposals").DataTable({
        destroy: true,
        processing: true,
        "bAutoWidth": false,
        "bSort": false,
        "aaSorting": [[4, "asc"], [16, "asc"]],
        columns: columns,
        data: sourceData,

        columnDefs: [
            {
                defaultContent: "",
                targets: "_all"
            },
            {
                targets: [0],
                title: columnsTitles[0],
                visible: false,
                searchable: false
            },
            {
                targets: [1],
                title: columnsTitles[1],
                visible: false,
                searchable: false
            },
            {
                targets: [2],
                title: columnsTitles[2],
                visible: false,
                searchable: false
            },
            {
                targets: [3],
                title: columnsTitles[3],
                visible: false,
                searchable: false
            },
            {
                targets: [4],
                title: columnsTitles[4],
                width: 400
            },
            {
                targets: [5],
                title: columnsTitles[5],
                width: 25,
                class: "text-center",
                render: (data, type, row) => {
                    if (type === 'display') {
                        if (data === true)
                            return '<i class="fa fa-circle"></i>'
                        else
                            return ''
                    }
                }
            },
            {
                targets: [6],
                width: 25,
                class: "text-center",
                title: columnsTitles[6],
                render: (data, type, row) => {
                    if (type === 'display') {
                        if (data === true)
                            return '<i class="fa fa-circle"></i>'
                        else
                            return ''
                    }
                }
            },
            {
                targets: [7],
                width: 25,
                class: "text-center",
                title: columnsTitles[7],
                render: (data, type, row) => {
                    if (type === 'display') {
                        if (data === true)
                            return '<i class="fa fa-circle"></i>'
                        else
                            return ''
                    }
                }
            },
            {
                targets: [8],
                width: 25,
                class: "text-center",
                title: columnsTitles[8],
                render: (data, type, row) => {
                    if (type === 'display') {
                        if (data === true)
                            return '<i class="fa fa-circle"></i>'
                        else
                            return ''
                    }
                }
            },

            {
                targets: [9],
                width: 25,
                class: "text-center",
                title: columnsTitles[9],
                render: (data, type, row) => {
                    if (type === 'display') {
                        if (data === true)
                            return '<i class="fa fa-circle"></i>'
                        else
                            return ''
                    }
                }
            },
            {
                targets: [10],
                width: 25,
                class: "text-center",
                title: columnsTitles[10],
                render: (data, type, row) => {
                    if (type === 'display') {
                        if (data === true)
                            return '<i class="fa fa-circle"></i>'
                        else
                            return ''
                    }
                }
            },
            {
                targets: [11],
                width: 25,
                class: "text-center",
                title: columnsTitles[11],
                render: (data, type, row) => {
                    if (type === 'display') {
                        if (data === true)
                            return '<i class="fa fa-circle"></i>'
                        else
                            return ''
                    }
                }
            },
            {
                targets: [12],
                visible: false
            },
            {
                targets: [13],
                visible: false
            },
            {
                targets: [14],
                width: 40,
                class: "text-center",
                title: columnsTitles[14],
            },
            {
                targets: [15],
                visible: false
            },
            {
                targets: [16],
                width: 25,
                class: "text-center",
                title: columnsTitles[16],
            },
            {
                targets: [17],
                visible: false
            },
            {
                targets: [18],
                width: 25,
                class: "text-center",
                title: columnsTitles[18],
            },
            {
                targets: [19],
                width: 40,
                class: "text-center",
                title: columnsTitles[19],
                render: (data, type, row) => {
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
                targets: [20],
                visible: false
            },
            {
                targets: [21],
                width: 40,
                class: "text-center",
                title: columnsTitles[21],
            },
            {
                targets: [22],
                width: 40,
                class: "text-center",
                title: columnsTitles[22],
                render: $.fn.dataTable.render.number(',', '.', 2, '$')
            },
            {
                targets: [23],
                width: 40,
                class: "text-center",
                title: columnsTitles[23],
                render: $.fn.dataTable.render.number(',', '.', 2, '')
            },
            {
                targets: [24],
                width: 40,
                class: "text-center",
                title: columnsTitles[24],
                render: $.fn.dataTable.render.number(',', '.', 2, '$')
            },
            {
                targets: [25],
                visible: false
            },
            {
                targets: [26],
                visible: false
            },
            {
                targets: [27],
                width: 105,
                data: "week01",
                title: columnsTitles[27],
                class: "text-center",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [28],
                width: 105,
                title: columnsTitles[28],
                data: "week02",
                class: "text-center",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [29],
                width: 105,
                title: columnsTitles[29],
                data: "week03",
                class: "text-center",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [30],
                width: 105,
                title: columnsTitles[30],
                data: "week04",
                class: "text-center",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [31],
                width: 105,
                title: columnsTitles[31],
                data: "week05",
                class: "text-center",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [32],
                width: 105,
                title: columnsTitles[32],
                data: "week06",
                class: "text-center",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [33],
                width: 105,
                title: columnsTitles[33],
                data: "week07",
                class: "text-center",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [34],
                width: 105,
                title: columnsTitles[34],
                data: "week08",
                class: "text-center",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [35],
                width: 105,
                title: columnsTitles[35],
                data: "week09",
                class: "text-center",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [36],
                width: 105,
                title: columnsTitles[36],
                data: "week10",
                class: "text-center",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [37],
                width: 105,
                title: columnsTitles[37],
                data: "week11",
                class: "text-center",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '<span style="min-width:130px;"></span>';
                    else
                        return '<span style="min-width:130px;">' + data + '</span>';
                }
            },
            {
                targets: [38],
                width: 105,
                title: columnsTitles[38],
                data: "week12",
                class: "text-center",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [39],
                width: 105,
                title: columnsTitles[39],
                data: "week13",
                class: "text-center",
                render: function (data, type, row, meta) {
                    if (data == 0)
                        return '';
                    else
                        return data;
                }
            },
            {
                targets: [40],
                width: 105,
                title: columnsTitles[40],
                data: "week14",
                class: "text-center",
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
                visible: false
            },
            {
                targets: [42],
                visible: false
            },
            {
                targets: [43],
                visible: false
            },
            {
                targets: [44],
                visible: false
            },
        ],
        fixedHeader: true,

        fixedColumns: true,
        initComplete: function (settings, json) {
            $("#ConfirmMatchedProposals").width(2450);
            setTimeout(function () { BindTotalsConfirmMatch(); }, 1000);
        }
    });
};

function BindTableBodyConfirmMatch(tableBodyName) {
    currentJson = ProposalsForConfirmation;
    var HTMLBody = "";
    for (var x = 0; x < currentJson.length; x++) {
        CurSelRateIds.push(currentJson[x].rateId);
        HTMLBody = HTMLBody + '<tr>';
        HTMLBody = HTMLBody + '<td class="text-center">' + currentJson[x].propertyName + '</td>';
        if (currentJson[x].m == true) {
            HTMLBody = HTMLBody + '<td class="text-center" data-val="' + currentJson[x].m + '"><i class="fa fa-circle"></i></td>';
        }
        else {
            HTMLBody = HTMLBody + '<td class="text-center"  data-val="' + currentJson[x].m + '"></td>';
        }
        if (currentJson[x].t == true) {
            HTMLBody = HTMLBody + '<td class="text-center" data-val="' + currentJson[x].t + '"><i class="fa fa-circle"></i></td>';
        }
        else {
            HTMLBody = HTMLBody + '<td class="text-center" data-val="' + currentJson[x].t + '"></td>';
        }
        if (currentJson[x].w == true) {
            HTMLBody = HTMLBody + '<td class="text-center" data-val="' + currentJson[x].w + '"><i class="fa fa-circle"></i></td>';
        }
        else {
            HTMLBody = HTMLBody + '<td class="text-center" data-val="' + currentJson[x].w + '"></td>';
        }
        if (currentJson[x].th == true) {
            HTMLBody = HTMLBody + '<td class="text-center" data-val="' + currentJson[x].th + '"><i class="fa fa-circle"></i></td>';
        }
        else {
            HTMLBody = HTMLBody + '<td class="text-center" data-val="' + currentJson[x].th + '"></td>';
        }
        if (currentJson[x].f == true) {
            HTMLBody = HTMLBody + '<td class="text-center" data-val="' + currentJson[x].f + '"><i class="fa fa-circle"></i></td>';
        }
        else {
            HTMLBody = HTMLBody + '<td class="text-center" data-val="' + currentJson[x].f + '"></td>';
        }
        if (currentJson[x].sa == true) {
            HTMLBody = HTMLBody + '<td class="text-center" data-val="' + currentJson[x].sa + '"><i class="fa fa-circle"></i></td>';
        }
        else {
            HTMLBody = HTMLBody + '<td class="text-center" data-val="' + currentJson[x].sa + '"></td>';
        }
        if (currentJson[x].su == true) {
            HTMLBody = HTMLBody + '<td class="text-center" data-val="' + currentJson[x].su + '"><i class="fa fa-circle"></i></td>';
        }
        else {
            HTMLBody = HTMLBody + '<td class="text-center" data-val="' + currentJson[x].su + '"></td>';
        }
        HTMLBody = HTMLBody + '<td class="text-center" >' + currentJson[x].startAndEndTime + '</td>';
        HTMLBody = HTMLBody + '<td class="text-center" >' + currentJson[x].buyTypeCode + '</td>';
        HTMLBody = HTMLBody + '<td class="text-center" >' + currentJson[x].dayPart + '</td>';
        //HTMLBody = HTMLBody + '<td class="text-center" >' + currentJson[x].spotLen + '</td>';
        HTMLBody = HTMLBody + '<td class="text-center" >';
        if (currentJson[x].spotLen === 120) {
            HTMLBody = HTMLBody + '<span class="badge badge-pill badge-danger">' + currentJson[x].spotLen + '</span>';
        }
        else if (currentJson[x].spotLen === 60) {
            HTMLBody = HTMLBody + '<span class="badge badge-pill badge-primary">' + currentJson[x].spotLen + '</span>';
        }
        else if (currentJson[x].spotLen === 15) {
            HTMLBody = HTMLBody + '<span class="badge badge-pill badge-warning">' + currentJson[x].spotLen + '</span>';
        }
        else {
            HTMLBody = HTMLBody + '<span class="badge badge-pill badge-success">' + currentJson[x].spotLen + '</span>';
        }
        HTMLBody = HTMLBody + '</td>';
        HTMLBody = HTMLBody + '<td class="text-center" >' + currentJson[x].demoName + '</td>';
        HTMLBody = HTMLBody + '<td class="text-right" >' + $.fn.dataTable.render.number(',', '.', 2, '$').display(currentJson[x].rateAmt) + '</td>';
        HTMLBody = HTMLBody + '<td class="text-right">' + $.fn.dataTable.render.number(',', '.', 2, '').display(currentJson[x].impressions) + '</td>';
        HTMLBody = HTMLBody + '<td class="text-right">' + $.fn.dataTable.render.number(',', '.', 2, '$').display(currentJson[x].cpm) + '</td>';
        HTMLBody = HTMLBody + '<td class="text-center">' + $.fn.dataTable.render.number(',', '.', 0, '').display(currentJson[x].totalSpots) + '</td>';
        for (var n = 1; n < 15; n++) {
            var weekInnerName = (n > 9 ? "week" : "week0") + n.toString();
            if (n == 14) {
                if (SelQtrJson["wk14_Date"] != null && SelQtrJson["wk14_Date"] != undefined && SelQtrJson["wk14_Date"] != "") {
                    if (currentJson[x][weekInnerName] != '0') {
                        HTMLBody = HTMLBody + '<td class="text-center cls_' + currentJson[x].ediProposalsID + '">' + currentJson[x][weekInnerName] + '</td>';
                    }
                    else {
                        HTMLBody = HTMLBody + '<td class="text-center cls_' + currentJson[x].ediProposalsID + '"></td>';
                    }
                }
            }
            else {
                if (currentJson[x][weekInnerName] != '0') {
                    HTMLBody = HTMLBody + '<td class="text-center cls_' + currentJson[x].ediProposalsID + '">' + currentJson[x][weekInnerName] + '</td>';
                }
                else {
                    HTMLBody = HTMLBody + '<td class="text-center cls_' + currentJson[x].ediProposalsID + '"></td>';
                }
            }
        }

        HTMLBody = HTMLBody + '</tr>';
    }
    //console.log(tableBodyName.substring(2));
    $("#" + tableBodyName).html(HTMLBody);
    $("#" + tableBodyName.substring(2)).dataTable();
    setTimeout(function () { BindTotalsConfirmMatch(); }, 1000);
}

function BindTotalsConfirmMatch() {
    var HTMLTotals = "";
    HTMLTotals = HTMLTotals + '<tr>';
    HTMLTotals = HTMLTotals + '<th class="text-center totalcell" style="width:167px;">TOTALS</th>';
    HTMLTotals = HTMLTotals + '<th class="text-center totalcell" style="width:100px;">' + SelQtrJson.quarterName + '</th>';

    for (var x = 1; x < 15; x++) {
        var WeekDayName = (x > 9 ? "wk" : "wk0") + x.toString() + "_Date";

        if (SelQtrJson[WeekDayName] != null && SelQtrJson[WeekDayName] != undefined && SelQtrJson[WeekDayName] != "") {
            HTMLTotals = HTMLTotals + '<th class="totalcell" style="text-align:center;width:105px;">' + SelQtrJson[WeekDayName].substring(0, 10).split('-')[1] + "/" + SelQtrJson[WeekDayName].substring(0, 10).split('-')[2] + "/" + (SelQtrJson[WeekDayName].substring(0, 10).split('-')[0]).substr(2) + '</th>';
        }
    }
    HTMLTotals = HTMLTotals + '</tr>';
    $("#thTotalDataConfirmMatch").html(HTMLTotals);
    CalculateTotalConfirmMatch();
    //BindTotalBodyConfirmMatch();
}
var TotalSectionArray = new Array();
function CalculateTotalConfirmMatch() {
    TotalSectionArray = new Array();

    //var CurObject = { propertyId: 0, propertyName: 'NETWORK TOTALS(ALL SECTIONS COMBINED)', totalSpots: 0, week01: 0, week02: 0, week03: 0, week04: 0, week05: 0, week06: 0, week07: 0, week08: 0, week09: 0, week10: 0, week11: 0, week12: 0, week13: 0, week14: 0 }
    //TotalSectionArray.push(CurObject);

    var CurObject = { propertyId: 0, propertyName: 'SPOTS', totalSpots: 0, week01: 0, week02: 0, week03: 0, week04: 0, week05: 0, week06: 0, week07: 0, week08: 0, week09: 0, week10: 0, week11: 0, week12: 0, week13: 0, week14: 0 }
    TotalSectionArray.push(CurObject);

    CurObject = { propertyId: 1, propertyName: 'DOLLARS', totalSpots: 0, week01: 0, week02: 0, week03: 0, week04: 0, week05: 0, week06: 0, week07: 0, week08: 0, week09: 0, week10: 0, week11: 0, week12: 0, week13: 0, week14: 0 }
    TotalSectionArray.push(CurObject);

    CurObject = { propertyId: 2, propertyName: 'CPM', totalSpots: 0, week01: 0, week02: 0, week03: 0, week04: 0, week05: 0, week06: 0, week07: 0, week08: 0, week09: 0, week10: 0, week11: 0, week12: 0, week13: 0, week14: 0 }
    TotalSectionArray.push(CurObject);

    CurObject = { propertyId: 3, propertyName: 'GI', totalSpots: 0, week01: 0, week02: 0, week03: 0, week04: 0, week05: 0, week06: 0, week07: 0, week08: 0, week09: 0, week10: 0, week11: 0, week12: 0, week13: 0, week14: 0 }
    TotalSectionArray.push(CurObject);

    //CurObject = { propertyId: 5, propertyName: 'OM TOTALS(MATCHED)', totalSpots: 0, week01: 0, week02: 0, week03: 0, week04: 0, week05: 0, week06: 0, week07: 0, week08: 0, week09: 0, week10: 0, week11: 0, week12: 0, week13: 0, week14: 0 }
    //TotalSectionArray.push(CurObject);

    //CurObject = { propertyId: 6, propertyName: 'OM DOLLARS', totalSpots: 0, week01: 0, week02: 0, week03: 0, week04: 0, week05: 0, week06: 0, week07: 0, week08: 0, week09: 0, week10: 0, week11: 0, week12: 0, week13: 0, week14: 0 }
    //TotalSectionArray.push(CurObject);

    //CurObject = { propertyId: 7, propertyName: 'OM CPM', totalSpots: 0, week01: 0, week02: 0, week03: 0, week04: 0, week05: 0, week06: 0, week07: 0, week08: 0, week09: 0, week10: 0, week11: 0, week12: 0, week13: 0, week14: 0 }
    //TotalSectionArray.push(CurObject);

    //CurObject = { propertyId: 8, propertyName: 'OM GI', totalSpots: 0, week01: 0, week02: 0, week03: 0, week04: 0, week05: 0, week06: 0, week07: 0, week08: 0, week09: 0, week10: 0, week11: 0, week12: 0, week13: 0, week14: 0 }
    //TotalSectionArray.push(CurObject);
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

    for (var x = 0; x < ProposalsForConfirmation.length; x++) {
        //TOTAL SPOTS
        TotalSpots = parseInt(TotalSpots) + parseInt(ProposalsForConfirmation[x].totalSpots);
        wk1Spots = parseInt(wk1Spots) + (ProposalsForConfirmation[x].week01 == "" ? 0 : parseInt(ProposalsForConfirmation[x].week01));
        wk2Spots = parseInt(wk2Spots) + (ProposalsForConfirmation[x].week02 == "" ? 0 : parseInt(ProposalsForConfirmation[x].week02));
        wk3Spots = parseInt(wk3Spots) + (ProposalsForConfirmation[x].week03 == "" ? 0 : parseInt(ProposalsForConfirmation[x].week03));
        wk4Spots = parseInt(wk4Spots) + (ProposalsForConfirmation[x].week04 == "" ? 0 : parseInt(ProposalsForConfirmation[x].week04));
        wk5Spots = parseInt(wk5Spots) + (ProposalsForConfirmation[x].week05 == "" ? 0 : parseInt(ProposalsForConfirmation[x].week05));
        wk6Spots = parseInt(wk6Spots) + (ProposalsForConfirmation[x].week06 == "" ? 0 : parseInt(ProposalsForConfirmation[x].week06));
        wk7Spots = parseInt(wk7Spots) + (ProposalsForConfirmation[x].week07 == "" ? 0 : parseInt(ProposalsForConfirmation[x].week07));
        wk8Spots = parseInt(wk8Spots) + (ProposalsForConfirmation[x].week08 == "" ? 0 : parseInt(ProposalsForConfirmation[x].week08));
        wk9Spots = parseInt(wk9Spots) + (ProposalsForConfirmation[x].week09 == "" ? 0 : parseInt(ProposalsForConfirmation[x].week09));
        wk10Spots = parseInt(wk10Spots) + (ProposalsForConfirmation[x].week10 == "" ? 0 : parseInt(ProposalsForConfirmation[x].week10));
        wk11Spots = parseInt(wk11Spots) + (ProposalsForConfirmation[x].week11 == "" ? 0 : parseInt(ProposalsForConfirmation[x].week11));
        wk12Spots = parseInt(wk12Spots) + (ProposalsForConfirmation[x].week12 == "" ? 0 : parseInt(ProposalsForConfirmation[x].week12));
        wk13Spots = parseInt(wk13Spots) + (ProposalsForConfirmation[x].week13 == "" ? 0 : parseInt(ProposalsForConfirmation[x].week13));
        wk14Spots = parseInt(wk14Spots) + (ProposalsForConfirmation[x].week14 == "" ? 0 : parseInt(ProposalsForConfirmation[x].week14));
        // DOLLAR
        TotalDollars = parseFloat(TotalDollars) + (parseFloat(ProposalsForConfirmation[x].rateAmt) * parseFloat(ProposalsForConfirmation[x].totalSpots));
        wk1Dollars = parseFloat(wk1Dollars) + (parseFloat(ProposalsForConfirmation[x].rateAmt) * (ProposalsForConfirmation[x].week01 == "" ? 0.0 : parseInt(ProposalsForConfirmation[x].week01)));
        wk2Dollars = parseFloat(wk2Dollars) + (parseFloat(ProposalsForConfirmation[x].rateAmt) * (ProposalsForConfirmation[x].week02 == "" ? 0.0 : parseInt(ProposalsForConfirmation[x].week02)));
        wk3Dollars = parseFloat(wk3Dollars) + (parseFloat(ProposalsForConfirmation[x].rateAmt) * (ProposalsForConfirmation[x].week03 == "" ? 0.0 : parseInt(ProposalsForConfirmation[x].week03)));
        wk4Dollars = parseFloat(wk4Dollars) + (parseFloat(ProposalsForConfirmation[x].rateAmt) * (ProposalsForConfirmation[x].week04 == "" ? 0.0 : parseInt(ProposalsForConfirmation[x].week04)));
        wk5Dollars = parseFloat(wk5Dollars) + (parseFloat(ProposalsForConfirmation[x].rateAmt) * (ProposalsForConfirmation[x].week05 == "" ? 0.0 : parseInt(ProposalsForConfirmation[x].week05)));
        wk6Dollars = parseFloat(wk6Dollars) + (parseFloat(ProposalsForConfirmation[x].rateAmt) * (ProposalsForConfirmation[x].week06 == "" ? 0.0 : parseInt(ProposalsForConfirmation[x].week06)));
        wk7Dollars = parseFloat(wk7Dollars) + (parseFloat(ProposalsForConfirmation[x].rateAmt) * (ProposalsForConfirmation[x].week07 == "" ? 0.0 : parseInt(ProposalsForConfirmation[x].week07)));
        wk8Dollars = parseFloat(wk8Dollars) + (parseFloat(ProposalsForConfirmation[x].rateAmt) * (ProposalsForConfirmation[x].week08 == "" ? 0.0 : parseInt(ProposalsForConfirmation[x].week08)));
        wk9Dollars = parseFloat(wk9Dollars) + (parseFloat(ProposalsForConfirmation[x].rateAmt) * (ProposalsForConfirmation[x].week09 == "" ? 0.0 : parseInt(ProposalsForConfirmation[x].week09)));
        wk10Dollars = parseFloat(wk10Dollars) + (parseFloat(ProposalsForConfirmation[x].rateAmt) * (ProposalsForConfirmation[x].week10 == "" ? 0.0 : parseInt(ProposalsForConfirmation[x].week10)));
        wk11Dollars = parseFloat(wk11Dollars) + (parseFloat(ProposalsForConfirmation[x].rateAmt) * (ProposalsForConfirmation[x].week11 == "" ? 0.0 : parseInt(ProposalsForConfirmation[x].week11)));
        wk12Dollars = parseFloat(wk12Dollars) + (parseFloat(ProposalsForConfirmation[x].rateAmt) * (ProposalsForConfirmation[x].week12 == "" ? 0.0 : parseInt(ProposalsForConfirmation[x].week12)));
        wk13Dollars = parseFloat(wk13Dollars) + (parseFloat(ProposalsForConfirmation[x].rateAmt) * (ProposalsForConfirmation[x].week13 == "" ? 0.0 : parseInt(ProposalsForConfirmation[x].week13)));
        wk14Dollars = parseFloat(wk14Dollars) + (parseFloat(ProposalsForConfirmation[x].rateAmt) * (ProposalsForConfirmation[x].week14 == "" ? 0.0 : parseInt(ProposalsForConfirmation[x].week14)));

        // GI
        if (!isNaN(ProposalsForConfirmation[x].week01) && parseInt(ProposalsForConfirmation[x].week01) > 0) {
            if (!isNaN(ProposalsForConfirmation[x].impressions) && parseInt(ProposalsForConfirmation[x].impressions) > 0) {
                wk1GI = parseFloat(wk1GI) + (parseFloat(ProposalsForConfirmation[x].impressions) * parseFloat(ProposalsForConfirmation[x].week01));
            }
        }
        if (!isNaN(ProposalsForConfirmation[x].week02) && parseInt(ProposalsForConfirmation[x].week02) > 0) {
            if (!isNaN(ProposalsForConfirmation[x].impressions) && parseInt(ProposalsForConfirmation[x].impressions) > 0) {
                wk2GI = parseFloat(wk2GI) + (parseFloat(ProposalsForConfirmation[x].impressions) * parseFloat(ProposalsForConfirmation[x].week02));
            }
        }
        if (!isNaN(ProposalsForConfirmation[x].week03) && parseInt(ProposalsForConfirmation[x].week03) > 0) {
            if (!isNaN(ProposalsForConfirmation[x].impressions) && parseInt(ProposalsForConfirmation[x].impressions) > 0) {
                wk3GI = parseFloat(wk3GI) + (parseFloat(ProposalsForConfirmation[x].impressions) * parseFloat(ProposalsForConfirmation[x].week03));
            }
        }

        if (!isNaN(ProposalsForConfirmation[x].week04) && parseInt(ProposalsForConfirmation[x].week04) > 0) {
            if (!isNaN(ProposalsForConfirmation[x].impressions) && parseInt(ProposalsForConfirmation[x].impressions) > 0) {
                wk4GI = parseFloat(wk4GI) + (parseFloat(ProposalsForConfirmation[x].impressions) * parseFloat(ProposalsForConfirmation[x].week04));
            }
        }
        if (!isNaN(ProposalsForConfirmation[x].week05) && parseInt(ProposalsForConfirmation[x].week05) > 0) {
            if (!isNaN(ProposalsForConfirmation[x].impressions) && parseInt(ProposalsForConfirmation[x].impressions) > 0) {
                wk5GI = parseFloat(wk5GI) + (parseFloat(ProposalsForConfirmation[x].impressions) * parseFloat(ProposalsForConfirmation[x].week05));
            }
        }
        if (!isNaN(ProposalsForConfirmation[x].week06) && parseInt(ProposalsForConfirmation[x].week06) > 0) {
            if (!isNaN(ProposalsForConfirmation[x].impressions) && parseInt(ProposalsForConfirmation[x].impressions) > 0) {
                wk6GI = parseFloat(wk6GI) + (parseFloat(ProposalsForConfirmation[x].impressions) * parseFloat(ProposalsForConfirmation[x].week06));
            }
        }
        if (!isNaN(ProposalsForConfirmation[x].week07) && parseInt(ProposalsForConfirmation[x].week07) > 0) {
            if (!isNaN(ProposalsForConfirmation[x].impressions) && parseInt(ProposalsForConfirmation[x].impressions) > 0) {
                wk7GI = parseFloat(wk7GI) + (parseFloat(ProposalsForConfirmation[x].impressions) * parseFloat(ProposalsForConfirmation[x].week07));
            }
        }
        if (!isNaN(ProposalsForConfirmation[x].week08) && parseInt(ProposalsForConfirmation[x].week08) > 0) {
            if (!isNaN(ProposalsForConfirmation[x].impressions) && parseInt(ProposalsForConfirmation[x].impressions) > 0) {
                wk8GI = parseFloat(wk8GI) + (parseFloat(ProposalsForConfirmation[x].impressions) * parseFloat(ProposalsForConfirmation[x].week08));
            }
        }
        if (!isNaN(ProposalsForConfirmation[x].week09) && parseInt(ProposalsForConfirmation[x].week09) > 0) {
            if (!isNaN(ProposalsForConfirmation[x].impressions) && parseInt(ProposalsForConfirmation[x].impressions) > 0) {
                wk9GI = parseFloat(wk9GI) + (parseFloat(ProposalsForConfirmation[x].impressions) * parseFloat(ProposalsForConfirmation[x].week09));
            }
        }
        if (!isNaN(ProposalsForConfirmation[x].week10) && parseInt(ProposalsForConfirmation[x].week10) > 0) {
            if (!isNaN(ProposalsForConfirmation[x].impressions) && parseInt(ProposalsForConfirmation[x].impressions) > 0) {
                wk10GI = parseFloat(wk10GI) + (parseFloat(ProposalsForConfirmation[x].impressions) * parseFloat(ProposalsForConfirmation[x].week10));
            }
        }
        if (!isNaN(ProposalsForConfirmation[x].week11) && parseInt(ProposalsForConfirmation[x].week11) > 0) {
            if (!isNaN(ProposalsForConfirmation[x].impressions) && parseInt(ProposalsForConfirmation[x].impressions) > 0) {
                wk11GI = parseFloat(wk11GI) + (parseFloat(ProposalsForConfirmation[x].impressions) * parseFloat(ProposalsForConfirmation[x].week11));
            }
        }
        if (!isNaN(ProposalsForConfirmation[x].week12) && parseInt(ProposalsForConfirmation[x].week12) > 0) {
            if (!isNaN(ProposalsForConfirmation[x].impressions) && parseInt(ProposalsForConfirmation[x].impressions) > 0) {
                wk12GI = parseFloat(wk12GI) + (parseFloat(ProposalsForConfirmation[x].impressions) * parseFloat(ProposalsForConfirmation[x].week12));
            }
        }
        if (!isNaN(ProposalsForConfirmation[x].week13) && parseInt(ProposalsForConfirmation[x].week13) > 0) {
            if (!isNaN(ProposalsForConfirmation[x].impressions) && parseInt(ProposalsForConfirmation[x].impressions) > 0) {
                wk13GI = parseFloat(wk13GI) + (parseFloat(ProposalsForConfirmation[x].impressions) * parseFloat(ProposalsForConfirmation[x].week13));
            }
        }
        if (!isNaN(ProposalsForConfirmation[x].week14) && parseInt(ProposalsForConfirmation[x].week14) > 0) {
            if (!isNaN(ProposalsForConfirmation[x].impressions) && parseInt(ProposalsForConfirmation[x].impressions) > 0) {
                wk14GI = parseFloat(wk14GI) + (parseFloat(ProposalsForConfirmation[x].impressions) * parseFloat(ProposalsForConfirmation[x].week14));
            }
        }
        if (!isNaN(ProposalsForConfirmation[x].impressions) && parseFloat(ProposalsForConfirmation[x].impressions) > 0
            && !isNaN(ProposalsForConfirmation[x].totalSpots) && parseFloat(ProposalsForConfirmation[x].totalSpots) > 0)
            TotalGI = parseFloat(TotalGI) + (parseFloat(ProposalsForConfirmation[x].impressions) * parseFloat(ProposalsForConfirmation[x].totalSpots));
        else
            TotalGI = parseFloat(TotalGI) + 0.00;

        //TotalGI =
        //    parseFloat(wk1GI)
        //    + parseFloat(wk2GI)
        //    + parseFloat(wk3GI)
        //    + parseFloat(wk4GI)
        //    + parseFloat(wk5GI)
        //    + parseFloat(wk6GI)
        //    + parseFloat(wk7GI)
        //    + parseFloat(wk8GI)
        //    + parseFloat(wk9GI)
        //    + parseFloat(wk10GI)
        //    + parseFloat(wk11GI)
        //    + parseFloat(wk12GI)
        //    + parseFloat(wk13GI)
        //    + parseFloat(wk14GI);

        // CPM
        if (!isNaN(ProposalsForConfirmation[x].week01) && parseInt(ProposalsForConfirmation[x].week01) > 0) {
            if (!isNaN(ProposalsForConfirmation[x].impressions) && parseInt(ProposalsForConfirmation[x].impressions) > 0
                && !isNaN(ProposalsForConfirmation[x].rateAmt) && parseInt(ProposalsForConfirmation[x].rateAmt) > 0) {
               // wk1CPM = parseFloat(wk1CPM) + (parseFloat(ProposalsForConfirmation[x].rateAmt) / parseFloat(ProposalsForConfirmation[x].impressions)) / parseFloat(ProposalsForConfirmation[x].week01);
                if (wk1GI > 0) {
                    wk1CPM=parseFloat(wk1Dollars/wk1GI)
                }
                else {
                    wk1CPM = parseFloat(0);
                }
            }
        }
        if (!isNaN(ProposalsForConfirmation[x].week02) && parseInt(ProposalsForConfirmation[x].week02) > 0) {
            if (!isNaN(ProposalsForConfirmation[x].impressions) && parseInt(ProposalsForConfirmation[x].impressions) > 0
               && !isNaN(ProposalsForConfirmation[x].rateAmt) && parseInt(ProposalsForConfirmation[x].rateAmt) > 0) {
               // wk2CPM = parseFloat(wk2CPM) + (parseFloat(ProposalsForConfirmation[x].rateAmt) / parseFloat(ProposalsForConfirmation[x].impressions)) / parseFloat(ProposalsForConfirmation[x].week02);
                if (wk2GI > 0) {
                    wk2CPM = parseFloat(wk2Dollars / wk2GI)
                }
                else {
                    wk2CPM = parseFloat(0);
                }
            }
        }
        if (!isNaN(ProposalsForConfirmation[x].week03) && parseInt(ProposalsForConfirmation[x].week03) > 0) {
            if (!isNaN(ProposalsForConfirmation[x].impressions) && parseInt(ProposalsForConfirmation[x].impressions) > 0
               && !isNaN(ProposalsForConfirmation[x].rateAmt) && parseInt(ProposalsForConfirmation[x].rateAmt) > 0) {
               // wk3CPM = parseFloat(wk3CPM) + (parseFloat(ProposalsForConfirmation[x].rateAmt) / parseFloat(ProposalsForConfirmation[x].impressions)) / parseFloat(ProposalsForConfirmation[x].week03);
                if (wk3GI > 0) {
                    wk3CPM = parseFloat(wk3Dollars / wk3GI)
                }
                else {
                    wk3CPM = parseFloat(0);
                }
            }
        }
        if (!isNaN(ProposalsForConfirmation[x].week04) && parseInt(ProposalsForConfirmation[x].week04) > 0) {
            if (!isNaN(ProposalsForConfirmation[x].impressions) && parseInt(ProposalsForConfirmation[x].impressions) > 0
               && !isNaN(ProposalsForConfirmation[x].rateAmt) && parseInt(ProposalsForConfirmation[x].rateAmt) > 0) {
                //wk4CPM = parseFloat(wk4CPM) + (parseFloat(ProposalsForConfirmation[x].rateAmt) / parseFloat(ProposalsForConfirmation[x].impressions)) / parseFloat(ProposalsForConfirmation[x].week04);
                if (wk4GI > 0) {
                    wk4CPM = parseFloat(wk4Dollars / wk4GI)
                }
                else {
                    wk4CPM = parseFloat(0);
                }
            }
        }
        if (!isNaN(ProposalsForConfirmation[x].week05) && parseInt(ProposalsForConfirmation[x].week05) > 0) {
            if (!isNaN(ProposalsForConfirmation[x].impressions) && parseInt(ProposalsForConfirmation[x].impressions) > 0
               && !isNaN(ProposalsForConfirmation[x].rateAmt) && parseInt(ProposalsForConfirmation[x].rateAmt) > 0) {
                //wk5CPM = parseFloat(wk5CPM) + (parseFloat(ProposalsForConfirmation[x].rateAmt) / parseFloat(ProposalsForConfirmation[x].impressions)) / parseFloat(ProposalsForConfirmation[x].week05);
                if (wk5GI > 0) {
                    wk5CPM = parseFloat(wk5Dollars / wk5GI)
                }
                else {
                    wk5CPM = parseFloat(0);
                }
            }
        }

        if (!isNaN(ProposalsForConfirmation[x].week06) && parseInt(ProposalsForConfirmation[x].week06) > 0) {
            if (!isNaN(ProposalsForConfirmation[x].impressions) && parseInt(ProposalsForConfirmation[x].impressions) > 0
               && !isNaN(ProposalsForConfirmation[x].rateAmt) && parseInt(ProposalsForConfirmation[x].rateAmt) > 0) {
                //wk6CPM = parseFloat(wk6CPM) + (parseFloat(ProposalsForConfirmation[x].rateAmt) / parseFloat(ProposalsForConfirmation[x].impressions)) / parseFloat(ProposalsForConfirmation[x].week06);
                if (wk6GI > 0) {
                    wk6CPM = parseFloat(wk6Dollars / wk6GI)
                }
                else {
                    wk6CPM = parseFloat(0);
                }
            }
        }

        if (!isNaN(ProposalsForConfirmation[x].week07) && parseInt(ProposalsForConfirmation[x].week07) > 0) {
            if (!isNaN(ProposalsForConfirmation[x].impressions) && parseInt(ProposalsForConfirmation[x].impressions) > 0
               && !isNaN(ProposalsForConfirmation[x].rateAmt) && parseInt(ProposalsForConfirmation[x].rateAmt) > 0) {
               // wk7CPM = parseFloat(wk7CPM) + (parseFloat(ProposalsForConfirmation[x].rateAmt) / parseFloat(ProposalsForConfirmation[x].impressions)) / parseFloat(ProposalsForConfirmation[x].week07);
                if (wk7GI > 0) {
                    wk7CPM = parseFloat(wk7Dollars / wk7GI)
                }
                else {
                    wk7CPM = parseFloat(0);
                }
            }
        }
        if (!isNaN(ProposalsForConfirmation[x].week08) && parseInt(ProposalsForConfirmation[x].week08) > 0) {
            if (!isNaN(ProposalsForConfirmation[x].impressions) && parseInt(ProposalsForConfirmation[x].impressions) > 0
               && !isNaN(ProposalsForConfirmation[x].rateAmt) && parseInt(ProposalsForConfirmation[x].rateAmt) > 0) {
               // wk8CPM = parseFloat(wk8CPM) + (parseFloat(ProposalsForConfirmation[x].rateAmt) / parseFloat(ProposalsForConfirmation[x].impressions)) / parseFloat(ProposalsForConfirmation[x].week08);
                if (wk8GI > 0) {
                    wk8CPM = parseFloat(wk8Dollars / wk8GI)
                }
                else {
                    wk8CPM = parseFloat(0);
                }
            }
        }
        if (!isNaN(ProposalsForConfirmation[x].week09) && parseInt(ProposalsForConfirmation[x].week09) > 0) {
            if (!isNaN(ProposalsForConfirmation[x].impressions) && parseInt(ProposalsForConfirmation[x].impressions) > 0
               && !isNaN(ProposalsForConfirmation[x].rateAmt) && parseInt(ProposalsForConfirmation[x].rateAmt) > 0) {
                //wk9CPM = parseFloat(wk9CPM) + (parseFloat(ProposalsForConfirmation[x].rateAmt) / parseFloat(ProposalsForConfirmation[x].impressions)) / parseFloat(ProposalsForConfirmation[x].week09);
                if (wk9GI > 0) {
                    wk9CPM = parseFloat(wk9Dollars / wk9GI)
                }
                else {
                    wk9CPM = parseFloat(0);
                }
            }
        }
        if (!isNaN(ProposalsForConfirmation[x].week10) && parseInt(ProposalsForConfirmation[x].week10) > 0) {
            if (!isNaN(ProposalsForConfirmation[x].impressions) && parseInt(ProposalsForConfirmation[x].impressions) > 0
               && !isNaN(ProposalsForConfirmation[x].rateAmt) && parseInt(ProposalsForConfirmation[x].rateAmt) > 0) {
                //wk10CPM = parseFloat(wk10CPM) + (parseFloat(ProposalsForConfirmation[x].rateAmt) / parseFloat(ProposalsForConfirmation[x].impressions)) / parseFloat(ProposalsForConfirmation[x].week10);
                if (wk10GI > 0) {
                    wk10CPM = parseFloat(wk10Dollars / wk10GI)
                }
                else {
                    wk10CPM = parseFloat(0);
                }
            }
        }
        if (!isNaN(ProposalsForConfirmation[x].week11) && parseInt(ProposalsForConfirmation[x].week11) > 0) {
            if (!isNaN(ProposalsForConfirmation[x].impressions) && parseInt(ProposalsForConfirmation[x].impressions) > 0
               && !isNaN(ProposalsForConfirmation[x].rateAmt) && parseInt(ProposalsForConfirmation[x].rateAmt) > 0) {
                //wk11CPM = parseFloat(wk11CPM) + (parseFloat(ProposalsForConfirmation[x].rateAmt) / parseFloat(ProposalsForConfirmation[x].impressions)) / parseFloat(ProposalsForConfirmation[x].week11);
                if (wk11GI > 0) {
                    wk11CPM = parseFloat(wk11Dollars / wk11GI)
                }
                else {
                    wk11CPM = parseFloat(0);
                }
            }
        }
        if (!isNaN(ProposalsForConfirmation[x].week12) && parseInt(ProposalsForConfirmation[x].week12) > 0) {
            if (!isNaN(ProposalsForConfirmation[x].impressions) && parseInt(ProposalsForConfirmation[x].impressions) > 0
               && !isNaN(ProposalsForConfirmation[x].rateAmt) && parseInt(ProposalsForConfirmation[x].rateAmt) > 0) {
                //wk12CPM = parseFloat(wk12CPM) + (parseFloat(ProposalsForConfirmation[x].rateAmt) / parseFloat(ProposalsForConfirmation[x].impressions)) / parseFloat(ProposalsForConfirmation[x].week12);
                if (wk12GI > 0) {
                    wk12CPM = parseFloat(wk12Dollars / wk12GI)
                }
                else {
                    wk12CPM = parseFloat(0);
                }
            }
        }
        if (!isNaN(ProposalsForConfirmation[x].week13) && parseInt(ProposalsForConfirmation[x].week13) > 0) {
            if (!isNaN(ProposalsForConfirmation[x].impressions) && parseInt(ProposalsForConfirmation[x].impressions) > 0
               && !isNaN(ProposalsForConfirmation[x].rateAmt) && parseInt(ProposalsForConfirmation[x].rateAmt) > 0) {
                //wk13CPM = parseFloat(wk13CPM) + (parseFloat(ProposalsForConfirmation[x].rateAmt) / parseFloat(ProposalsForConfirmation[x].impressions)) / parseFloat(ProposalsForConfirmation[x].week13);
                if (wk13GI > 0) {
                    wk13CPM = parseFloat(wk13Dollars / wk13GI)
                }
                else {
                    wk13CPM = parseFloat(0);
                }
            }
        }

        if (!isNaN(ProposalsForConfirmation[x].week14) && parseInt(ProposalsForConfirmation[x].week14) > 0) {
            if (!isNaN(ProposalsForConfirmation[x].impressions) && parseInt(ProposalsForConfirmation[x].impressions) > 0
               && !isNaN(ProposalsForConfirmation[x].rateAmt) && parseInt(ProposalsForConfirmation[x].rateAmt) > 0) {
                //wk14CPM = parseFloat(wk14CPM) + (parseFloat(ProposalsForConfirmation[x].rateAmt) / parseFloat(ProposalsForConfirmation[x].impressions)) / parseFloat(ProposalsForConfirmation[x].week14);
                if (wk14GI > 0) {
                    wk14CPM = parseFloat(wk14Dollars / wk14GI)
                }
                else {
                    wk14CPM = parseFloat(0);
                }
            }
        }
        //if (!isNaN(ProposalsForConfirmation[x].cpm) && parseFloat(ProposalsForConfirmation[x].cpm) > 0)
        //    TotalCPM = parseFloat( parseFloat(TotalCPM) + parseFloat(ProposalsForConfirmation[x].cpm)).toFixed(2);
        //else
        //    TotalCPM = parseFloat(TotalCPM) + 0.00;
        if (TotalGI > 0) {
            parseFloat(TotalDollars / TotalGI);
        }
        else {
            TotalCPM = parseFloat(0);
        }
        //if (!isNaN(ProposalsForConfirmation[x].impressions) && parseFloat(ProposalsForConfirmation[x].impressions) > 0)
        //    TotalCPM = parseFloat(TotalCPM) + (parseFloat(ProposalsForConfirmation[x].rateAmt) / parseFloat(ProposalsForConfirmation[x].impressions)).toFixed(2);
        //else
        //    TotalCPM = parseFloat(TotalCPM) + 0.00;

        //TotalCPM =
        //    parseFloat(wk1CPM)
        //+ parseFloat(wk2CPM)
        //+ parseFloat(wk3CPM)
        //+ parseFloat(wk4CPM)
        //+ parseFloat(wk5CPM)
        //+ parseFloat(wk6CPM)
        //+ parseFloat(wk7CPM)
        //+ parseFloat(wk8CPM)
        //+ parseFloat(wk9CPM)
        //+ parseFloat(wk10CPM)
        //+ parseFloat(wk11CPM)
        //+ parseFloat(wk12CPM)
        //+ parseFloat(wk13CPM)
        //+ parseFloat(wk14CPM);

        
    }
    //ToTAL SPOTS
    TotalSectionArray.filter(o => o.propertyId == 0)[0].totalSpots = parseInt(TotalSpots);
    TotalSectionArray.filter(o => o.propertyId == 0)[0].week01 = isNaN(wk1Spots) ? 0 :parseInt(wk1Spots);
    TotalSectionArray.filter(o => o.propertyId == 0)[0].week02 = isNaN(wk2Spots) ? 0 :parseInt(wk2Spots);
    TotalSectionArray.filter(o => o.propertyId == 0)[0].week03 = isNaN(wk3Spots) ? 0 :parseInt(wk3Spots);
    TotalSectionArray.filter(o => o.propertyId == 0)[0].week04 = isNaN(wk4Spots) ? 0 :parseInt(wk4Spots);
    TotalSectionArray.filter(o => o.propertyId == 0)[0].week05 = isNaN(wk5Spots) ? 0 :parseInt(wk5Spots);
    TotalSectionArray.filter(o => o.propertyId == 0)[0].week06 = isNaN(wk6Spots) ? 0 :parseInt(wk6Spots);
    TotalSectionArray.filter(o => o.propertyId == 0)[0].week07 = isNaN(wk7Spots) ? 0 :parseInt(wk7Spots);
    TotalSectionArray.filter(o => o.propertyId == 0)[0].week08 = isNaN(wk8Spots) ? 0 : parseInt(wk8Spots);
    TotalSectionArray.filter(o => o.propertyId == 0)[0].week09 = isNaN(wk9Spots) ? 0 : parseInt(wk9Spots);
    TotalSectionArray.filter(o => o.propertyId == 0)[0].week10 = isNaN(wk10Spots) ? 0 :parseInt(wk10Spots);
    TotalSectionArray.filter(o => o.propertyId == 0)[0].week11 = isNaN(wk11Spots) ? 0 :parseInt(wk11Spots);
    TotalSectionArray.filter(o => o.propertyId == 0)[0].week12 = isNaN(wk12Spots) ? 0 :parseInt(wk12Spots);
    TotalSectionArray.filter(o => o.propertyId == 0)[0].week13 = isNaN(wk13Spots) ? 0 : parseInt(wk13Spots);
    TotalSectionArray.filter(o => o.propertyId == 0)[0].week14 = isNaN(wk14Spots) ? 0 : parseInt(wk14Spots);
    // TOTAL DOLLARS
    TotalSectionArray.filter(o => o.propertyId == 1)[0].totalSpots = parseFloat(TotalDollars).toFixed(2);
    TotalSectionArray.filter(o => o.propertyId == 1)[0].week01 = isNaN(wk1Dollars) ? 0 : wk1Dollars;
    TotalSectionArray.filter(o => o.propertyId == 1)[0].week02 = isNaN(wk2Dollars) ? 0 : wk2Dollars;
    TotalSectionArray.filter(o => o.propertyId == 1)[0].week03 = isNaN(wk3Dollars) ? 0 : wk3Dollars;
    TotalSectionArray.filter(o => o.propertyId == 1)[0].week04 = isNaN(wk4Dollars) ? 0 : wk4Dollars;
    TotalSectionArray.filter(o => o.propertyId == 1)[0].week05 = isNaN(wk5Dollars) ? 0 : wk5Dollars;
    TotalSectionArray.filter(o => o.propertyId == 1)[0].week06 = isNaN(wk6Dollars) ? 0 : wk6Dollars;
    TotalSectionArray.filter(o => o.propertyId == 1)[0].week07 = isNaN(wk7Dollars) ? 0 : wk7Dollars;
    TotalSectionArray.filter(o => o.propertyId == 1)[0].week08 = isNaN(wk8Dollars) ? 0 : wk8Dollars;
    TotalSectionArray.filter(o => o.propertyId == 1)[0].week09 = isNaN(wk9Dollars) ? 0 : wk9Dollars;
    TotalSectionArray.filter(o => o.propertyId == 1)[0].week10 = isNaN(wk10Dollars) ? 0 : wk10Dollars;
    TotalSectionArray.filter(o => o.propertyId == 1)[0].week11 = isNaN(wk11Dollars) ? 0 : wk11Dollars;
    TotalSectionArray.filter(o => o.propertyId == 1)[0].week12 = isNaN(wk12Dollars) ? 0 : wk12Dollars;
    TotalSectionArray.filter(o => o.propertyId == 1)[0].week13 = isNaN(wk13Dollars) ? 0 : wk13Dollars;
    TotalSectionArray.filter(o => o.propertyId == 1)[0].week14 = isNaN(wk14Dollars) ? 0 : wk14Dollars;
    // NETWORK CPM

    if (TotalGI > 0)
        TotalSectionArray.filter(o => o.propertyId == 2)[0].totalSpots = parseFloat(TotalDollars/TotalGI).toFixed(2);
    else 
        TotalSectionArray.filter(o => o.propertyId == 2)[0].totalSpots = 0;
//    TotalSectionArray.filter(o => o.propertyId == 2)[0].totalSpots = parseFloat(TotalCPM).toFixed(2);
    TotalSectionArray.filter(o => o.propertyId == 2)[0].week01 = isNaN(wk1CPM) ? 0 : wk1CPM;
    TotalSectionArray.filter(o => o.propertyId == 2)[0].week02 = isNaN(wk2CPM) ? 0 : wk2CPM;
    TotalSectionArray.filter(o => o.propertyId == 2)[0].week03 = isNaN(wk3CPM) ? 0 : wk3CPM;
    TotalSectionArray.filter(o => o.propertyId == 2)[0].week04 = isNaN(wk4CPM) ? 0 : wk4CPM;
    TotalSectionArray.filter(o => o.propertyId == 2)[0].week05 = isNaN(wk5CPM) ? 0 : wk5CPM;
    TotalSectionArray.filter(o => o.propertyId == 2)[0].week06 = isNaN(wk6CPM) ? 0 : wk6CPM;
    TotalSectionArray.filter(o => o.propertyId == 2)[0].week07 = isNaN(wk7CPM) ? 0 : wk7CPM;
    TotalSectionArray.filter(o => o.propertyId == 2)[0].week08 = isNaN(wk8CPM) ? 0 : wk8CPM;
    TotalSectionArray.filter(o => o.propertyId == 2)[0].week09 = isNaN(wk9CPM) ? 0 : wk9CPM;
    TotalSectionArray.filter(o => o.propertyId == 2)[0].week10 = isNaN(wk10CPM) ? 0 : wk10CPM;
    TotalSectionArray.filter(o => o.propertyId == 2)[0].week11 = isNaN(wk11CPM) ? 0 : wk11CPM;
    TotalSectionArray.filter(o => o.propertyId == 2)[0].week12 = isNaN(wk12CPM) ? 0 : wk12CPM;
    TotalSectionArray.filter(o => o.propertyId == 2)[0].week13 = isNaN(wk13CPM) ? 0 : wk13CPM;
    TotalSectionArray.filter(o => o.propertyId == 2)[0].week14 = isNaN(wk14CPM) ? 0 : wk14CPM;

    // NETWORK GI
    TotalSectionArray.filter(o => o.propertyId == 3)[0].totalSpots = parseFloat(TotalGI).toFixed(2);
    TotalSectionArray.filter(o => o.propertyId == 3)[0].week01 = isNaN(wk1GI) ? 0 : wk1GI;
    TotalSectionArray.filter(o => o.propertyId == 3)[0].week02 = isNaN(wk2GI) ? 0 : wk2GI;
    TotalSectionArray.filter(o => o.propertyId == 3)[0].week03 = isNaN(wk3GI) ? 0 : wk3GI;
    TotalSectionArray.filter(o => o.propertyId == 3)[0].week04 = isNaN(wk4GI) ? 0 : wk4GI;
    TotalSectionArray.filter(o => o.propertyId == 3)[0].week05 = isNaN(wk5GI) ? 0 : wk5GI;
    TotalSectionArray.filter(o => o.propertyId == 3)[0].week06 = isNaN(wk6GI) ? 0 : wk6GI;
    TotalSectionArray.filter(o => o.propertyId == 3)[0].week07 = isNaN(wk7GI) ? 0 : wk7GI;
    TotalSectionArray.filter(o => o.propertyId == 3)[0].week08 = isNaN(wk8GI) ? 0 : wk8GI;
    TotalSectionArray.filter(o => o.propertyId == 3)[0].week09 = isNaN(wk9GI) ? 0 : wk9GI;
    TotalSectionArray.filter(o => o.propertyId == 3)[0].week10 = isNaN(wk10GI) ? 0 : wk10GI;
    TotalSectionArray.filter(o => o.propertyId == 3)[0].week11 = isNaN(wk11GI) ? 0 : wk11GI;
    TotalSectionArray.filter(o => o.propertyId == 3)[0].week12 = isNaN(wk12GI) ? 0 : wk12GI;
    TotalSectionArray.filter(o => o.propertyId == 3)[0].week13 = isNaN(wk13GI) ? 0 : wk13GI;
    TotalSectionArray.filter(o => o.propertyId == 3)[0].week14 = isNaN(wk14GI) ? 0 : wk14GI;

    // TOTAL DOLLARS
    //TotalSectionArray.filter(o => o.propertyId == 6)[0].totalSpots = parseFloat(TotalDollars).toFixed(2);
    //TotalSectionArray.filter(o => o.propertyId == 6)[0].week01 = isNaN(wk1Dollars) ? 0 : wk1Dollars;
    //TotalSectionArray.filter(o => o.propertyId == 6)[0].week02 = isNaN(wk2Dollars) ? 0 : wk2Dollars;
    //TotalSectionArray.filter(o => o.propertyId == 6)[0].week03 = isNaN(wk3Dollars) ? 0 : wk3Dollars;
    //TotalSectionArray.filter(o => o.propertyId == 6)[0].week04 = isNaN(wk4Dollars) ? 0 : wk4Dollars;
    //TotalSectionArray.filter(o => o.propertyId == 6)[0].week05 = isNaN(wk5Dollars) ? 0 : wk5Dollars;
    //TotalSectionArray.filter(o => o.propertyId == 6)[0].week06 = isNaN(wk6Dollars) ? 0 : wk6Dollars;
    //TotalSectionArray.filter(o => o.propertyId == 6)[0].week07 = isNaN(wk7Dollars) ? 0 : wk7Dollars;
    //TotalSectionArray.filter(o => o.propertyId == 6)[0].week08 = isNaN(wk8Dollars) ? 0 : wk8Dollars;
    //TotalSectionArray.filter(o => o.propertyId == 6)[0].week09 = isNaN(wk9Dollars) ? 0 : wk9Dollars;
    //TotalSectionArray.filter(o => o.propertyId == 6)[0].week10 = isNaN(wk10Dollars) ? 0 : wk10Dollars;
    //TotalSectionArray.filter(o => o.propertyId == 6)[0].week11 = isNaN(wk11Dollars) ? 0 : wk11Dollars;
    //TotalSectionArray.filter(o => o.propertyId == 6)[0].week12 = isNaN(wk12Dollars) ? 0 : wk12Dollars;
    //TotalSectionArray.filter(o => o.propertyId == 6)[0].week13 = isNaN(wk13Dollars) ? 0 : wk13Dollars;
    //TotalSectionArray.filter(o => o.propertyId == 6)[0].week14 = isNaN(wk14Dollars) ? 0 : wk14Dollars;
    //// NETWORK CPM
    //TotalSectionArray.filter(o => o.propertyId == 7)[0].totalSpots = parseFloat(TotalCPM).toFixed(2);
    //TotalSectionArray.filter(o => o.propertyId == 7)[0].week01 = isNaN(wk1CPM) ? 0 : wk1CPM;
    //TotalSectionArray.filter(o => o.propertyId == 7)[0].week02 = isNaN(wk2CPM) ? 0 : wk2CPM;
    //TotalSectionArray.filter(o => o.propertyId == 7)[0].week03 = isNaN(wk3CPM) ? 0 : wk3CPM;
    //TotalSectionArray.filter(o => o.propertyId == 7)[0].week04 = isNaN(wk4CPM) ? 0 : wk4CPM;
    //TotalSectionArray.filter(o => o.propertyId == 7)[0].week05 = isNaN(wk5CPM) ? 0 : wk5CPM;
    //TotalSectionArray.filter(o => o.propertyId == 7)[0].week06 = isNaN(wk6CPM) ? 0 : wk6CPM;
    //TotalSectionArray.filter(o => o.propertyId == 7)[0].week07 = isNaN(wk7CPM) ? 0 : wk7CPM;
    //TotalSectionArray.filter(o => o.propertyId == 7)[0].week08 = isNaN(wk8CPM) ? 0 : wk8CPM;
    //TotalSectionArray.filter(o => o.propertyId == 7)[0].week09 = isNaN(wk9CPM) ? 0 : wk9CPM;
    //TotalSectionArray.filter(o => o.propertyId == 7)[0].week10 = isNaN(wk10CPM) ? 0 : wk10CPM;
    //TotalSectionArray.filter(o => o.propertyId == 7)[0].week11 = isNaN(wk11CPM) ? 0 : wk11CPM;
    //TotalSectionArray.filter(o => o.propertyId == 7)[0].week12 = isNaN(wk12CPM) ? 0 : wk12CPM;
    //TotalSectionArray.filter(o => o.propertyId == 7)[0].week13 = isNaN(wk13CPM) ? 0 : wk13CPM;
    //TotalSectionArray.filter(o => o.propertyId == 7)[0].week14 = isNaN(wk14CPM) ? 0 : wk14CPM;

    //// NETWORK GI
    //TotalSectionArray.filter(o => o.propertyId == 8)[0].totalSpots = parseFloat(TotalGI).toFixed(2);
    //TotalSectionArray.filter(o => o.propertyId == 8)[0].week01 = isNaN(wk1GI) ? 0 : wk1GI;
    //TotalSectionArray.filter(o => o.propertyId == 8)[0].week02 = isNaN(wk2GI) ? 0 : wk2GI;
    //TotalSectionArray.filter(o => o.propertyId == 8)[0].week03 = isNaN(wk3GI) ? 0 : wk3GI;
    //TotalSectionArray.filter(o => o.propertyId == 8)[0].week04 = isNaN(wk4GI) ? 0 : wk4GI;
    //TotalSectionArray.filter(o => o.propertyId == 8)[0].week05 = isNaN(wk5GI) ? 0 : wk5GI;
    //TotalSectionArray.filter(o => o.propertyId == 8)[0].week06 = isNaN(wk6GI) ? 0 : wk6GI;
    //TotalSectionArray.filter(o => o.propertyId == 8)[0].week07 = isNaN(wk7GI) ? 0 : wk7GI;
    //TotalSectionArray.filter(o => o.propertyId == 8)[0].week08 = isNaN(wk8GI) ? 0 : wk8GI;
    //TotalSectionArray.filter(o => o.propertyId == 8)[0].week09 = isNaN(wk9GI) ? 0 : wk9GI;
    //TotalSectionArray.filter(o => o.propertyId == 8)[0].week10 = isNaN(wk10GI) ? 0 : wk10GI;
    //TotalSectionArray.filter(o => o.propertyId == 8)[0].week11 = isNaN(wk11GI) ? 0 : wk11GI;
    //TotalSectionArray.filter(o => o.propertyId == 8)[0].week12 = isNaN(wk12GI) ? 0 : wk12GI;
    //TotalSectionArray.filter(o => o.propertyId == 8)[0].week13 = isNaN(wk13GI) ? 0 : wk13GI;
    //TotalSectionArray.filter(o => o.propertyId == 8)[0].week14 = isNaN(wk14GI) ? 0 : wk14GI;

    BindTotalDataConfirmMatchTableConfirmMatch(TotalSectionArray);
}

function BindTotalDataConfirmMatchTableConfirmMatch(content) {
    var HTMLTotals = "";
    for (var i = 0; i < content.length; i++) {
        HTMLTotals = HTMLTotals + '<tr>';

        HTMLTotals = HTMLTotals + '<td class="text-center totalcell" style="padding:1px;width:155px;font-weight:bold;">' + content[i].propertyName + '</td>';
        if (i == 0) {
            if (content[i].totalSpots>0)
                HTMLTotals = HTMLTotals + '<td class="text-center totalcell" style="padding:1px;">' + $.fn.dataTable.render.number(',', '', 0, '').display(content[i].totalSpots) + '</td>';
            else
                HTMLTotals = HTMLTotals + '<td class="text-center totalcell" style="padding:1px;"></td>';
        }
        else if (i == 1 || i == 2) {
            HTMLTotals = HTMLTotals + '<td class="text-center totalcell" style="padding:1px;">' + $.fn.dataTable.render.number(',', '.', 2, '$').display(content[i].totalSpots) + '</td>';
        } else {
            HTMLTotals = HTMLTotals + '<td class="text-center totalcell" style="padding:1px;">' + $.fn.dataTable.render.number(',', '.', 2, '').display(content[i].totalSpots) + '</td>';
        }

        for (var x = 1; x < 15; x++) {
            var WeekDayName = (x > 9 ? "wk" : "wk0") + x.toString() + "_Date";
            var FinalWeekDayName = (x > 9 ? "week" : "week0") + x.toString();

            if (SelQtrJson[WeekDayName] != null && SelQtrJson[WeekDayName] != undefined && SelQtrJson[WeekDayName] != "") {

                if (i == 0) {
                    if (parseInt(content[i][FinalWeekDayName])>0)
                        HTMLTotals = HTMLTotals + '<td class="text-center totalcell" style="padding:1px;">' + $.fn.dataTable.render.number(',', '', 0, '').display(content[i][FinalWeekDayName]) + '</td>';
                    else
                        HTMLTotals = HTMLTotals + '<td class="text-center totalcell" style="padding:1px;"></td>';
                }
                else if (i == 1 || i == 2) {
                    HTMLTotals = HTMLTotals + '<td class="text-center totalcell" style="padding:1px;">' + $.fn.dataTable.render.number(',', '.', 2, '$').display(content[i][FinalWeekDayName]) + '</td>';
                }
                else if (i == 3) {
                    HTMLTotals = HTMLTotals + '<td class="text-center totalcell" style="padding:1px;">' + $.fn.dataTable.render.number(',', '.', 2, '').display(content[i][FinalWeekDayName]) + '</td>';
                }
                else {
                    HTMLTotals = HTMLTotals + '<td class="text-center totalcell" style="padding:1px;">' + $.fn.dataTable.render.number(',', '.', 2, '').display(content[i][FinalWeekDayName]) + '</td>';
                }

            }
        }
        HTMLTotals = HTMLTotals + '</tr>';
    }
    $("#tbTotalDataConfirmMatch").html(HTMLTotals);

    $("#modal-UnAllocatedProposalsConfirmMatch").height(window.innerHeight - 50);
    $("#modal-UnAllocatedProposalsConfirmMatch .block-content").css("max-height", $(window).height() - 200);
    $("#modal-UnAllocatedProposalsConfirmMatch .block-content").height($(window).height() - 150);
    $("#modal-UnAllocatedProposalsConfirmMatch.block-content").parent().height($(window).height() - 150);
    setTimeout(function () { $("#modal-UnAllocatedProposalsConfirmMatch .block-content").scrollLeft(0); }, 3000);
    $(".dataTables_scrollBody thead").hide();
    $(".propheading").width($("#ConfirmMatchedProposals").css("width"));
    $("#divTotalSectionData").width($("#ConfirmMatchedProposals").css("width"));
    //$(".totalcell").width($($("#thConfirmMatchedProposals th")[11]).width());
    $(".importtotalconfirm").width($("#TotalDataConfirmMatch thead th").length * $($("#thConfirmMatchedProposals th")[11]).width());

    var TotalWidth = 0.0;
    for (var x = 0; x < $("#thConfirmMatchedProposals th").length; x++) {
        TotalWidth = TotalWidth + ($($("#thConfirmMatchedProposals th")[x]).width());
    }
    var TotalTableWdth = 0.0;
    for (var x = 0; x < $("#thTotalDataConfirmMatch th").length; x++) {
        TotalTableWdth = TotalTableWdth + 105.667;
        $($("#thTotalDataConfirmMatch th")[x]).css("width", "105!important");
        $($("#tbTotalDataConfirmMatch td")[x]).css("width", "105!important");
        $(".totalcell").css("width", "105.667px!important");

        //  TotalWidth = TotalWidth + ($($("#thConfirmMatchedProposals th")[x]).width());
    }
    $("#modal-UnAllocatedProposalsConfirmMatch .col-sm-12").removeClass("col-sm-12");
    $("#divTotalSectionData").width(TotalWidth);
    $(".importtotalconfirm").width(TotalTableWdth);
    $("#TotalDataConfirmMatch").width(1710);
    //$(".importtotalconfirm").css("margin-left", (TotalWidth - TotalTableWdth));
    $(".importtotalconfirm").css("margin-left", "998px");
    $("#ConfirmMatchedProposals_wrapper").width($("#ConfirmMatchedProposals").width());
    $("#ConfirmMatchedProposals_wrapper").css("margin", "0");
    for (var x = 11; x <= parseInt(10) + parseInt(maxAculatizedWeekNum); x++) {
        $($("#thConfirmMatchedProposals tr th")[x]).addClass("fully-actualized-header");
        $($("#thTotalDataConfirmMatch tr th")[x - 9]).addClass("fully-actualized-header");
    }
    HideOverlayPopupConfirmMatch();
}

function ConfirmAndSave() {
    swal({
        title: "Proposal update:",
        html: 'Are you sure you want to proceed?',
        type: 'warning',
        showCancelButton: true,
        width:530,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, I am okay to update the Proposal',
        showLoaderOnConfirm: true,
        preConfirm: function () {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    resolve();
                }, 50);
            });
        }
    }).then(
        function (result) {
            var CurPropsForSaving = FinalMatchedProposals.filter(o => o.demoName != "");
            FinalMatchedProposals = CurPropsForSaving;
            CompleteProposalUpdate();
            // As per Shariq's' recommendation, ST-712 clear the table when file processed and come back to process second file while multiselection.
            //start
            if (($.fn.dataTable.isDataTable('#MultiMatchedProposalsMatching'))) {
                $('#MultiMatchedProposalsMatching').DataTable().clear().destroy();
            }
            //end
        }, function (dismiss) {
            // dismiss can be 'cancel', 'overlay', 'esc' or 'timer'
        }
    );
    return false;
}

//function CompleteProposalUpdate() {
//    CheckAndUpdateProposal(0);
//}
function CompleteProposalUpdate() {
    // Add A cheeck whether the Schedule Exists or not
    // If not then Call you SP to Create the Schedule and Return the Schedule ID
    // If Exists then return the Schedule Id
    //Then  Let the below line executing as is
    //CheckAndUpdateProposal(0);
    CheckAndCreateProposal();
}

function CheckAndCreateProposal() {
    var _selClientid = $("#ddlclients :selected").val();
    var _selQtr = ($(".nav-link.active").html().split(' ')[0]).toString().substring(2, 1) + "Q" + $(".nav-link.active").html().split(' ')[1];
    var NewProposalId = 0;
    $.ajax({
        url: '/ScheduleProposal/SaveProposalVersionHistory',
        type: "GET",
        async: false,
        data: {
            "ClientId": _selClientid,
            "QuarterName": _selQtr,
            "Mode": FinalMatchedProposals[0].mode,
            "SourceFileName": FinalMatchedProposals[0].sourceFile,
            "FileAction": FinalMatchedProposals[0].fileAction,
        },
        success: function (result) {
            if (result.retvalData.success) {
                NewProposalId = result.retvalData.responseCode;
                var DescConfrimProposal = "User Performed Confirm And Update Proposal: Total Record(s): " + FinalMatchedProposals.length + "";
                AddUserJourneyEntryConfirmMatch(currentJsonSelectedForImport[currentFileIndex].clientId, currentJsonSelectedForImport[currentFileIndex].networkId,
                    currentJsonSelectedForImport[currentFileIndex].quarterName,"ConfirmMatchesScreen", NewProposalId,
                    currentJsonSelectedForImport[currentFileIndex].deal,
                    currentJsonSelectedForImport[currentFileIndex].sourceFile, "ConfirmAndUpdate", DescConfrimProposal);
                //CheckAndUpdateProposal(0, NewProposalId);// ST-710, Commented by Shariq, Now it will called after the Add User Journey entry
            }
        },
        error: function (response) {
        }
    });
}
// Added PAJourneyId ST-710
function CheckAndUpdateProposal(SelIndex, propId,PAJourneyId) {
    

    if (SelIndex < FinalMatchedProposals.length) {
        let SelRateId = FinalMatchedProposals[SelIndex].rateId;
        let SelPropertyId = FinalMatchedProposals[SelIndex].propertyId;// Added for ST-710
        let Selwk1 = maxAculatizedWeekNum < 1 ? FinalMatchedProposals[SelIndex].week01 : '-1';//FinalMatchedProposals[SelIndex].week01;
        let Selwk2 = maxAculatizedWeekNum < 2 ? FinalMatchedProposals[SelIndex].week02: '-1';
        let Selwk3 = maxAculatizedWeekNum < 3 ? FinalMatchedProposals[SelIndex].week03: '-1';
        let Selwk4 = maxAculatizedWeekNum < 4 ? FinalMatchedProposals[SelIndex].week04: '-1';
        let Selwk5 = maxAculatizedWeekNum < 5 ? FinalMatchedProposals[SelIndex].week05: '-1';
        let Selwk6 = maxAculatizedWeekNum < 6 ? FinalMatchedProposals[SelIndex].week06: '-1';
        let Selwk7 = maxAculatizedWeekNum < 7 ? FinalMatchedProposals[SelIndex].week07: '-1';
        let Selwk8 = maxAculatizedWeekNum < 8 ? FinalMatchedProposals[SelIndex].week08: '-1';
        let Selwk9 = maxAculatizedWeekNum < 9 ? FinalMatchedProposals[SelIndex].week09 : '-1';
        let Selwk10 = maxAculatizedWeekNum < 10 ? FinalMatchedProposals[SelIndex].week10: '-1';
        let Selwk11 = maxAculatizedWeekNum < 11 ? FinalMatchedProposals[SelIndex].week11: '-1';
        let Selwk12 = maxAculatizedWeekNum < 12 ? FinalMatchedProposals[SelIndex].week12: '-1';
        let Selwk13 = maxAculatizedWeekNum < 13 ? FinalMatchedProposals[SelIndex].week13: '-1';
        let Selwk14 = maxAculatizedWeekNum < 14 ? FinalMatchedProposals[SelIndex].week14 : '-1';
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
            url: '/ScheduleProposal/SaveProposalAutomationData',
            type: "GET",
            async: false,
            data: {
                "ProposalId": propId,
                "RateId": SelRateId,
                "PropertyId": SelPropertyId,// Added for ST-710
                "ClientId": _selClientid,
                "QuarterName": _selQtr,
                "PAJourneyId": PAJourneyId,// Added for ST-710
                "wk1": Selwk1,
                "wk2": Selwk2,
                "wk3": Selwk3,
                "wk4": Selwk4,
                "wk5": Selwk5,
                "wk6": Selwk6,
                "wk7": Selwk7,
                "wk8": Selwk8,
                "wk9": Selwk9,
                "wk10": Selwk10,
                "wk11": Selwk11,
                "wk12": Selwk12,
                "wk13": Selwk13,
                "wk14": Selwk14,
            },
            success: function (result) {
                if (result.retvalData.success) {
                    NewProposalId = result.retvalData.responseCode;
                    SelProposalId = NewProposalId;
                }
                if (SelIndex < FinalMatchedProposals.length - 1) {
                    SelIndex = parseInt(SelIndex) + 1;
                    CheckAndUpdateProposal(SelIndex, propId, PAJourneyId);// ST-710, Added PAJourneyId
                }
                else {
                    var DescConfrimProposal = "Marked EDI Proposal File as Complete and Allocated";
                    AddUserJourneyEntryConfirmMatch(currentJsonSelectedForImport[currentFileIndex].clientId, currentJsonSelectedForImport[currentFileIndex].networkId,
                        currentJsonSelectedForImport[currentFileIndex].quarterName,"ConfirmMatchesScreen", propId, currentJsonSelectedForImport[currentFileIndex].deal,
                        currentJsonSelectedForImport[currentFileIndex].sourceFile, "MarkAsDone", DescConfrimProposal);
                    MarkProposalAsCompleteAllocated(propId);// ST-691 Passed ProposalId as parameter
                }
            },
            error: function (response) {
            }
        });
    }
}

function MarkProposalAsCompleteAllocated(propId) {
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
        url: '/ScheduleProposal/UnAllocatedProposalsMarkAsAllocated',
        type: "GET",
        async: false,
        data: {
            "ClientId": _selClientid,
            "QuarterName": _selQtr,
            "NetworkId": currentJsonSelectedForImport[currentFileIndex].networkId,
            "SourceFile": currentJsonSelectedForImport[currentFileIndex].sourceFile,
            "ProposalId": propId// ST-691
        },
        success: function (result) {
            swal({
                title: "Success",
                html: 'Proposal Updated Successfully',
                type: 'success',
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
            IgnoreImportingConfirmNetwork();
        },
        error: function (response) {
        }
    });
}


function IgnoreImportingConfirmNetwork() {
    ProposalForMatching = null;
    if (currentFileIndex < currentJsonSelectedForImport.length - 1) {
        $("#modal-UnAllocatedProposalsConfirmMatch").modal('hide');
        //$('#modal-UnAllocatedProposalsConfirmMatch').modal({ backdrop: 'static', keyboard: false }, 'show');
        //$("#modal-UnAllocatedProposalsConfirmMatch").height(window.innerHeight - 50);
        //$("#modal-UnAllocatedProposalsConfirmMatch .block-content").css("max-height", $(window).height() - 200);
        //$("#modal-UnAllocatedProposalsConfirmMatch .block-content").height($(window).height() - 150);
        //$("#modal-UnAllocatedProposalsConfirmMatch.block-content").parent().height($(window).height() - 150);
        $('#modal-ImportUnAllocatedProposals').modal({ backdrop: 'static', keyboard: false }, 'show');
        $("#modal-ImportUnAllocatedProposals").height(window.innerHeight - 50);
        $("#modal-ImportUnAllocatedProposals .block-content").css("max-height", $(window).height() - 200);
        $("#modal-ImportUnAllocatedProposals .block-content").height($(window).height() - 150);
        $("#modal-ImportUnAllocatedProposals.block-content").parent().height($(window).height() - 150);
        setTimeout(function () { $("#modal-ImportUnAllocatedProposals .block-content").scrollLeft(0); }, 3000);
        IgnoredFilesToProcess.push(currentJsonSelectedForImport[currentFileIndex]);
        CompletedFiles.push(currentJsonSelectedForImport[currentFileIndex]);
        currentFileIndex = parseInt(currentFileIndex) + 1;
        SetImportScreenData(currentFileIndex);
    }
    else {
        IgnoredFilesToProcess.push(currentJsonSelectedForImport[currentFileIndex]);
        CompletedFiles.push(currentJsonSelectedForImport[currentFileIndex]);
        $("#modal-UnAllocatedProposalsConfirmMatch").modal('hide');
        $('#modal-UnAllocatedProposals').modal({ backdrop: 'static', keyboard: false }, 'show');
        //setTimeout(function () { BindUnAllocatedProposals() }, 1000);
        OpenProposal(NewProposalId, window.location.origin + "/ScheduleProposal/EditProposal?ProposalId=" + NewProposalId, '/ManageMedia/Proposal?ProposalId=' + NewProposalId);
        // setTimeout(function () { ShowUnAllocatedProposals("all", 0) }, 1000);
    }
}

function BackToChooseMatches() {
    ShowOverlayPopupMacthing();
    $("#modal-UnAllocatedProposalsConfirmMatch").modal('hide');
    if (redirectFrom == "import") {
        $('#modal-ImportUnAllocatedProposals').modal({ backdrop: 'static', keyboard: false }, 'show');
        //BindImportScreenData(currentJsonSelectedForImport);
        setTimeout(function () { HideOverlayPopupMatching(); }, 3000);
    }
    else {        
        $('#modal-UnAllocatedProposalsMatching').modal({ backdrop: 'static', keyboard: false }, 'show');
        setTimeout(function () { HideOverlayPopupMatching(); }, 3000);
        if (!($.fn.dataTable.isDataTable('#MultiMatchedProposalsMatching'))) {
            BindMatchingScreenData();            
        }  
        setTimeout(function () { $("#modal-UnAllocatedProposalsMatching .block-content").scrollLeft(0); }, 3000);
        setTimeout(function () { $("#modal-UnAllocatedProposalsMatching .block-content").scrollTop(0); }, 3000);
    }
   
    return false;
}

//Added below function for ST-710
var PAJourneyId = 0;
function AddUserJourneyEntryConfirmMatch(clientId, networkId, quarterName, screenName, proposalId, deal, sourcefile, action, description) {
    $.ajax({
        url: "/ScheduleProposal/AddUserJourneyMaster",
        data: {
            ClientId: clientId,
            NetworkId: networkId,
            QuarterName: quarterName,
            ScreenName: screenName,
            ScheduleId: proposalId,
            Deal: deal,
            SourceFile: sourcefile,
            ActionTaken: action,
            Description: description
        },
        cache: false,
        type: "GET",
        success: function (result) {
            if (result != null) {
                PAJourneyId = result.paJourneyId;
                if (action.toString().toLowerCase() == "confirmandupdate")
                    CheckAndUpdateProposal(0, proposalId, PAJourneyId);
            }
        },
        error: function (response) {
        }
    });
}