var TotalMatchingSpots = new Array();
var StartEDIId = 0;
var PropTotalTotalArray = new Array();
var UniquePropsalIds = [];
var FinalMatchedProposals;
var primarycolorMulti = "#ffffff";
var secondaryColorMulti = "#e5e5e5";
function ShowOverlayPopupMacthing() {
    document.getElementById("DivOverLayPopoupMatching").style.display = "block";
}
function HideOverlayPopupMatching() {
    document.getElementById("DivOverLayPopoupMatching").style.display = "none";
}
function BindMatchingScreenData() {
    if ($.fn.dataTable.isDataTable('#MultiMatchedProposalsMatching'))
        $('#MultiMatchedProposalsMatching').DataTable().clear().destroy();
    $("#modal-UnAllocatedProposalsMatching .block-content").css("max-height", $(window).height() - 200);
    $("#modal-UnAllocatedProposalsMatching .block-content").height($(window).height() - 150);
    $("#modal-UnAllocatedProposalsMatching .block-content").parent().height($(window).height() - 150);
    $("#divUnAllocatedNetworksMatching").height($(window).height() - 300);
    setTimeout(function () { $("#modal-UnAllocatedProposalsMatching .block-content").scrollLeft(0); }, 3000);
    setTimeout(function () { $("#modal-UnAllocatedProposalsMatching .block-content").scrollTop(0); }, 3000);
    if (ProposalForMatching == null || ProposalForMatching == undefined || ProposalForMatching.length > 0)
        ProposalForMatching = MultiMatchPropsalsJson.filter(o => o.isFullyActualized === false);
        //ST-720 Updating EDI DOllars and Other Calculations To the updated Spots
    for (var n = 0; n < ProposalForMatching.length; n++) {
        if (parseInt(ProposalForMatching[n].rateId) > 0) {
            ProposalForMatching[n].totalDollar = parseFloat(ProposalForMatching[n].rateAmt) * parseFloat(ProposalForMatching[n].totalSpots);
            //ProposalForMatching[n].calcDollar = parseFloat(ProposalForMatching[n].rateAmt) * parseFloat(ProposalForMatching[n].totalSpots);
        }
    }
    $("#dealAction").css("display", "none");
    $("#MatchingHeadingData").html("Choose Matches : " + $("#ddlclients :selected").text() + " - " + ($(".nav-link.active").html().split(' ')[0]).toString().substring(2, 1) + "Q" + $(".nav-link.active").html().split(' ')[1] + " Network: " + $("#spnCurNetworkName").html().replace("<br/>", "").replace("<br>", ""));
    $("#dealAction1").html($("#dealAction").html());
    MismatchProposalArray = new Array();
    SetMatchingScreenData();    
}
function SetMatchingScreenData() {
//    console.log(ProposalForMatching);     
    BindMatchingTableHeadher('thMultiMatchedProposalsMatching', 'tbMultiMatchedProposalsMatching');
    //setTimeout(function () { BindSingleMatchedProperties() }, 1000);
    //HideOverlayPopupMatching();
}
var SelColor = "";
var primarycolor = "#ffffff";
var secondaryColor = "#e5e5e5";
function BindMatchingTableHeadher(tableHeaderName,tableBodyName) {
    //BindMatchingTableBody(tableBodyName);
    let keys = Object.keys(ProposalForMatching[0]);
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
    for (var x = 1; x < 15; x++) {
        var WeekDayName = (x > 9 ? "wk" : "wk0") + x.toString() + "_Date";
        let idx = parseInt(startIndexWeek) + parseInt(x);
        if (SelQtrJson[WeekDayName] != null && SelQtrJson[WeekDayName] != undefined && SelQtrJson[WeekDayName] != "") {
            columnsTitles[idx] = SelQtrJson[WeekDayName].substring(0, 10).split('-')[1] + "/" + SelQtrJson[WeekDayName].substring(0, 10).split('-')[2] + "/" + (SelQtrJson[WeekDayName].substring(0, 10).split('-')[0]).substr(2);
        }
    }
    columnsTitles[41] = "EDIPROPOSALSID";
    //columnsTitles[42] = "TOT DOLLAR";
    //columnsTitles[43] = "CALC DOLLAR";
    //columnsTitles[44] = "CALC IMPS";
    
    columnsTitles[42] = "EDI DOLLARS";
    columnsTitles[43] = "TOT DOLLARS";
    columnsTitles[44] = "TOT IMPS";

    console.log(columns);
    console.log(columnsTitles);
    //HideOverlayPopupImport();
    InitChooseMatchesTable(ProposalForMatching, columns, columnsTitles);
}
function InitChooseMatchesTable(sourceDataMulti, columns, columnsTitles) {
    if ($.fn.dataTable.isDataTable('#MultiMatchedProposalsMatching')) {
        //proptable = $('#UnMatchedProposals').DataTable();   
        $('#MultiMatchedProposalsMatching').DataTable().clear().destroy();
        $('#MultiMatchedProposalsMatching tbody').html("");
    }
    $("#MultiMatchedProposalsMatching").DataTable({
        destroy: true,
        processing: true,
        "bAutoWidth": false,
        paging: false,
        "bSort": false,
        columns: columns,
        data: sourceDataMulti,
        "lengthMenu": [[sourceDataMulti.length], [sourceDataMulti.length]],
        "pageLength": sourceDataMulti.length,
        //colReorder: {
        //    order: [25,26]
        //},
        columnDefs: [
            {
                defaultContent: "",
                targets: "_all"
            },
            {
                targets: [0],
                title: '',// columnsTitles[0],
                width: 25,
                class: "text-center",
                //render: function (data, type, row, meta) {
                //        return '<input type="checkbox"/>';
                //},
                render: function (data, type, row, meta) {
                    if (row.demoName == "") {
                        return '';
                    }
                    else {
                        return '<input type="radio" name="RowSel_' + row.ediProposalsID + '"/>';
                    }
                },
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
                width: 300,
                render: ellipsis(39, true)
            },
            {
                targets: [5],
                title: "DOW",
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
                targets: [6],
                width: 25,
                visible: false,
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
                visible: false,
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
                visible: false,
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
                visible: false,
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
                visible: false,
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
                visible: false,
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
                width: 120,
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
                width: 50,
                class: "text-center",
                title: columnsTitles[19],
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
                targets: [20],
                visible: false
            },
            {
                targets: [21],
                width: 100,
                class: "text-center",
                title: columnsTitles[21],
            },
            {
                targets: [22],
                width: 80,
                class: "text-center",
                title: columnsTitles[22],
                //  render: $.fn.dataTable.render.number(',', '.', 2, '$')
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
                targets: [23],
                width: 80,
                class: "text-center",
                title: columnsTitles[23],
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
                targets: [24],
                width: 80,
                class: "text-center",
                title: columnsTitles[24],
                //  render: $.fn.dataTable.render.number(',', '.', 2, '$')
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
                targets: [25],
                width: 100,
                class: "text-center",
                title: columnsTitles[25],
                render: $.fn.dataTable.render.number(',', '', 0, '')
                //render: function (data, type, row, meta) {
                //    if (row.demoName != "") {
                //        return $.fn.dataTable.render.number(',', '', 0, '').display(data);
                //    }
                //    else {
                //        return "";
                //    }
                //}
            },
            {
                targets: [26],
                width: 75,
                class: "text-center",
                title: columnsTitles[26],
                render: function (data, type, row, meta) {
                    if (row.demoName != "") {
                        return ""
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                targets: [27],
                width: 70,
                data: "week01",
                title: columnsTitles[27],
                class: "text-center",
                render: function (data, type, row, meta) {
                    if (row.demoName == "") {
                        if (data == 0)
                            return '';
                        else
                            return data;
                    }
                    else {
                        if (data == 0)
                            return ' <input data-val="' + data + '" item-val="' + data + '" style ="width:60px;float:left;" class="text-center" disabled type="text" value=""/>';
                        else {
                            return '<input data-val="' + data + '" item-val="' + data + '" style ="width:60px;float:left;" class="text-center" type="text" value=""/>';
                        }

                    }
                }
            },
            {
                targets: [28],
                width: 70,
                title: columnsTitles[28],
                data: "week02",
                class: "text-center",
                //render: function (data, type, row, meta) {
                //    if (data == 0)
                //        return ' <input data-val="' + data + '" style ="width:60px;float:left;" class="text-center" disabled type="text" value=""/>';
                //    else
                //        return '<input data-val="' + data + '" style ="width:60px;float:left;" class="text-center" disabled type="text" value="' + data + '"/>';
                //}
                render: function (data, type, row, meta) {
                    if (row.demoName == "") {
                        if (data == 0)
                            return '';
                        else
                            return data;
                    }
                    else {
                        if (data == 0)
                            return ' <input data-val="' + data + '"  item-val="' + data + '" style ="width:60px;float:left;" class="text-center" disabled type="text" value=""/>';
                        else {
                            return '<input data-val="' + data + '" item-val="' + data + '" style ="width:60px;float:left;" class="text-center" type="text" value=""/>';
                        }
                    }
                }
            },
            {
                targets: [29],
                width: 70,
                title: columnsTitles[29],
                data: "week03",
                class: "text-center",
                render: function (data, type, row, meta) {
                    if (row.demoName == "") {
                        if (data == 0)
                            return '';
                        else
                            return data;
                    }
                    else {
                        //if (data == 0)
                        //    return ' <input data-val="' + data + '" style ="width:60px;float:left;" class="text-center" disabled type="text" value=""/>';
                        //else
                        //    return '<input data-val="' + data + '" style ="width:60px;float:left;" class="text-center" disabled type="text" value="' + data + '"/>';
                        if (data == 0)
                            return ' <input data-val="' + data + '" item-val="' + data + '" style ="width:60px;float:left;" class="text-center" disabled type="text" value=""/>';
                        else {
                            return '<input data-val="' + data + '" item-val="' + data + '" style ="width:60px;float:left;" class="text-center" type="text" value=""/>';
                        }

                    }
                }
            },
            {
                targets: [30],
                width: 70,
                title: columnsTitles[30],
                data: "week04",
                class: "text-center",
                render: function (data, type, row, meta) {
                    if (row.demoName == "") {
                        if (data == 0)
                            return '';
                        else
                            return data;
                    }
                    else {
                        if (data == 0)
                            return ' <input data-val="' + data + '" item-val="' + data + '" style ="width:60px;float:left;" class="text-center" disabled type="text" value=""/>';
                        else {
                            return '<input data-val="' + data + '" item-val="' + data + '" style ="width:60px;float:left;" class="text-center" type="text" value=""/>';
                        }

                    }
                }
            },
            {
                targets: [31],
                width: 70,
                title: columnsTitles[31],
                data: "week05",
                class: "text-center",
                render: function (data, type, row, meta) {
                    if (row.demoName == "") {
                        if (data == 0)
                            return '';
                        else
                            return data;
                    }
                    else {
                        if (data == 0)
                            return ' <input data-val="' + data + '" item-val="' + data + '" style ="width:60px;float:left;" class="text-center" disabled type="text" value=""/>';
                        else {
                            return '<input data-val="' + data + '" item-val="' + data + '" style ="width:60px;float:left;" class="text-center" type="text" value=""/>';
                        }

                    }
                }
            },
            {
                targets: [32],
                width: 70,
                title: columnsTitles[32],
                data: "week06",
                class: "text-center",
                render: function (data, type, row, meta) {
                    if (row.demoName == "") {
                        if (data == 0)
                            return '';
                        else
                            return data;
                    }
                    else {
                        if (data == 0)
                            return ' <input data-val="' + data + '" item-val="' + data + '" style ="width:60px;float:left;" class="text-center" disabled type="text" value=""/>';
                        else {
                            return '<input data-val="' + data + '" item-val="' + data + '" style ="width:60px;float:left;" class="text-center" type="text" value=""/>';
                        }

                    }
                }
            },
            {
                targets: [33],
                width: 70,
                title: columnsTitles[33],
                data: "week07",
                class: "text-center",
                render: function (data, type, row, meta) {
                    if (row.demoName == "") {
                        if (data == 0)
                            return '';
                        else
                            return data;
                    }
                    else {
                        if (data == 0)
                            return ' <input data-val="' + data + '" item-val="' + data + '" style ="width:60px;float:left;" class="text-center" disabled type="text" value=""/>';
                        else {
                            return '<input data-val="' + data + '" item-val="' + data + '" style ="width:60px;float:left;" class="text-center" type="text" value=""/>';
                        }

                    }
                }
            },
            {
                targets: [34],
                width: 70,
                title: columnsTitles[34],
                data: "week08",
                class: "text-center",
                render: function (data, type, row, meta) {
                    if (row.demoName == "") {
                        if (data == 0)
                            return '';
                        else
                            return data;
                    }
                    else {
                        if (data == 0)
                            return ' <input data-val="' + data + '"  item-val="' + data + '" style ="width:60px;float:left;" class="text-center" disabled type="text" value=""/>';
                        else {
                            return '<input data-val="' + data + '" item-val="' + data + '" style ="width:60px;float:left;" class="text-center" type="text" value=""/>';
                        }

                    }
                }
            },
            {
                targets: [35],
                width: 70,
                title: columnsTitles[35],
                data: "week09",
                class: "text-center",
                render: function (data, type, row, meta) {
                    if (row.demoName == "") {
                        if (data == 0)
                            return '';
                        else
                            return data;
                    }
                    else {
                        if (data == 0)
                            return ' <input data-val="' + data + '" item-val="' + data + '" style ="width:60px;float:left;" class="text-center" disabled type="text" value=""/>';
                        else {
                            return '<input data-val="' + data + '" item-val="' + data + '" style ="width:60px;float:left;" class="text-center" type="text" value=""/>';
                        }

                    }
                }
            },
            {
                targets: [36],
                width: 70,
                title: columnsTitles[36],
                data: "week10",
                class: "text-center",
                render: function (data, type, row, meta) {
                    if (row.demoName == "") {
                        if (data == 0)
                            return '';
                        else
                            return data;
                    }
                    else {
                        if (data == 0)
                            return ' <input data-val="' + data + '"  item-val="' + data + '" style ="width:60px;float:left;" class="text-center" disabled type="text" value=""/>';
                        else {
                            return '<input data-val="' + data + '" item-val="' + data + '" style ="width:60px;float:left;" class="text-center" type="text" value=""/>';
                        }

                    }
                }
            },
            {
                targets: [37],
                width: 70,
                title: columnsTitles[37],
                data: "week11",
                class: "text-center",
                render: function (data, type, row, meta) {
                    if (row.demoName == "") {
                        if (data == 0)
                            return '';
                        else
                            return data;
                    }
                    else {
                        if (data == 0)
                            return ' <input data-val="' + data + '" item-val="' + data + '" style ="width:60px;float:left;" class="text-center" disabled type="text" value=""/>';
                        else {
                            return '<input data-val="' + data + '" item-val="' + data + '" style ="width:60px;float:left;" class="text-center" type="text" value=""/>';
                        }

                    }
                }
            },
            {
                targets: [38],
                width: 70,
                title: columnsTitles[38],
                data: "week12",
                class: "text-center",
                render: function (data, type, row, meta) {
                    if (row.demoName == "") {
                        if (data == 0)
                            return '';
                        else
                            return data;
                    }
                    else {
                        if (data == 0)
                            return ' <input data-val="' + data + '" item-val="' + data + '" style ="width:60px;float:left;" class="text-center" disabled type="text" value=""/>';
                        else {
                            return '<input data-val="' + data + '" item-val="' + data + '" style ="width:60px;float:left;" class="text-center" type="text" value=""/>';
                        }
                    }
                }
            },
            {
                targets: [39],
                width: 70,
                title: columnsTitles[39],
                data: "week13",
                class: "text-center",
                render: function (data, type, row, meta) {
                    if (row.demoName == "") {
                        if (data == 0)
                            return '';
                        else
                            return data;
                    }
                    else {
                        if (data == 0)
                            return ' <input data-val="' + data + '" item-val="' + data + '" style ="width:60px;float:left;" class="text-center" disabled type="text" value=""/>';
                        else {
                            return '<input data-val="' + data + '"item-val="' + data + '" item-val="' + data + '" style ="width:60px;float:left;" class="text-center" type="text" value=""/>';
                        }

                    }
                }
            },
            {
                targets: [40],
                width: 70,
                title: columnsTitles[40],
                data: "week14",
                class: "text-center",
                visible: (columnsTitles[40] == null || columnsTitles[40] == undefined || columnsTitles[40] == "") === true ? false : true,
                render: function (data, type, row, meta) {
                    if (row.demoName == "") {
                        if (data == 0)
                            return '';
                        else
                            return data;
                    }
                    else {
                        if (data == 0)
                            return ' <input data-val="' + data + '" item-val="' + data + '" style ="width:60px;float:left;" class="text-center" disabled type="text" value=""/>';
                        else {
                            return '<input data-val="' + data + '" item-val="' + data + '" style ="width:60px;float:left;" class="text-center" type="text" value=""/>';
                        }

                    }
                }
            },
            {
                targets: [41],
                visible: false
            },
            {
                targets: [42],
                class: "text-center",
                width: 120,
                title: columnsTitles[42],

                render: $.fn.dataTable.render.number(',', '.', 2, '$')
            },
            {
                targets: [43],
                class: "text-center",
                width: 105,
                title: columnsTitles[43],
                render: $.fn.dataTable.render.number(',', '.', 2, '$')
            },
            {
                targets: [44],
                class: "text-center",
                width: 105,
                title: columnsTitles[44],
                render: $.fn.dataTable.render.number(',', '.', 2, '')
            }
            ,
            {
                targets: [45],
                class: "hideThis",
            }
            ,
            {
                targets: [46],
                class: "hideThis",
            }
            ,
            {
                targets: [47],
                class: "hideThis",
            },
            {
                targets: [48],
                class: "hideThis",
            }
            ,
            {
                targets: [49],
                class: "hideThis",
            }
            ,
            {
                targets: [50],
                class: "hideThis",
            }
            ,
            {
                targets: [51],
                class: "hideThis",
            }
            ,
            {
                targets: [52],
                class: "hideThis",
            }
            ,
            {
                targets: [53],
                class: "hideThis",
            }
            ,
            {
                targets: [54],
                class: "hideThis",
            }
        ],
        fixedHeader: true,

        fixedColumns: true,
        createdRow: function (row, data, dataIndex) {
            if (data.demoName == "") {
                $('td:eq(1)', row).text("");
                $('td:eq(11)', row).text("");
                $('td:eq(0)', row).css("border-right", "transparent");
                $('td:eq(1)', row).css("border-right", "transparent");
                $('td:eq(2)', row).css("border-right", "transparent");
                $('td:eq(3)', row).css("border-right", "transparent");
                $('td:eq(4)', row).css("border-right", "transparent");
                $('td:eq(5)', row).css("border-right", "transparent");
                $('td:eq(6)', row).css("border-right", "transparent");
                $('td:eq(6)', row).text("Network Spot Totals");
                $('td:eq(6)', row).css("font-weight", 700);
               
                $('td:eq(7)', row).css("border-right", "transparent");
                $('td:eq(8)', row).css("border-right", "transparent");
                $('td:eq(9)', row).css("border-right", "transparent");
                $('td:eq(10)', row).css("border-right", "transparent");
                $('td:eq(11)', row).css("border-right", "transparent");
                // $('td:eq(12)', row).css("border-right", "transparent");
            }
        },
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {


            $(nRow).attr("id", "trMathingProposals_" + aData.ediProposalsID + '_' + iDisplayIndex);
            $(nRow).addClass("tr_" + aData.ediProposalsID);
            if (aData.demoName == "") {
                $(nRow).addClass("emptyrow");
            }
            else {
                $(nRow).addClass("valuerow");
            }
            $(nRow).find("input[type=radio]").attr("id", "chkSelectMatchingProposal_" + aData.ediProposalsID + '_' + iDisplayIndex);
            $(nRow).find("input[type=radio]").attr("onchange", "return SelectMathingRow(this, " + aData.ediProposalsID + "," + iDisplayIndex + ")");
            $(nRow).find("input[type=radio]").attr("onclick", "return deSelectRadioBtn(this, " + aData.ediProposalsID + "," + iDisplayIndex + ")");
            $(nRow).find("input[type=radio]").data("ischecked", "true");
            $($(nRow).find("td")[8]).attr("id", "tdRateAmt_" + aData.ediProposalsID + '_' + iDisplayIndex);
            $($(nRow).find("td")[9]).attr("id", "tdImps_" + aData.ediProposalsID + '_' + iDisplayIndex);
            $($(nRow).find("td")[10]).attr("id", "tdCPM_" + aData.ediProposalsID + '_' + iDisplayIndex);
            $($(nRow).find("td")[11]).addClass("cls_" + aData.ediProposalsID + '_edispots');
            $($(nRow).find("td")[12]).attr("id", "tdSpots_" + aData.ediProposalsID + '_' + iDisplayIndex);
            $($(nRow).find("td")[12]).addClass("cls_" + aData.ediProposalsID + ' calcspots');
            $($(nRow).find("td")[26]).addClass("cls_" + aData.ediProposalsID + '_edidollars');
            $($(nRow).find("td")[27]).addClass("cls_" + aData.ediProposalsID + '_calcdollars');
            $($(nRow).find("td")[28]).addClass("cls_" + aData.ediProposalsID + '_calcImp');
            // Adding background colors to cells week data
            // if (aData.week01 == "0") {
            if (ProposalForMatching.filter(o => o.ediProposalsID == aData.ediProposalsID && o.demoName == "")[0].week01 == "0") {
                $($(nRow).find("td")[13]).addClass("emptycell")
            }
            else {
                $($(nRow).find("td")[13]).addClass("valuecell")
            }
            //if (aData.week02 == "0") {
            if (ProposalForMatching.filter(o => o.ediProposalsID == aData.ediProposalsID && o.demoName == "")[0].week02 == "0") {
                $($(nRow).find("td")[14]).addClass("emptycell")
            }
            else {
                $($(nRow).find("td")[14]).addClass("valuecell")
            }
            // if (aData.week03 == "0") {
            if (ProposalForMatching.filter(o => o.ediProposalsID == aData.ediProposalsID && o.demoName == "")[0].week03 == "0") {
                $($(nRow).find("td")[15]).addClass("emptycell")
            }
            else {
                $($(nRow).find("td")[15]).addClass("valuecell")
            }
            //if (aData.week04 == "0") {
            if (ProposalForMatching.filter(o => o.ediProposalsID == aData.ediProposalsID && o.demoName == "")[0].week04 == "0") {
                $($(nRow).find("td")[16]).addClass("emptycell")
            }
            else {
                $($(nRow).find("td")[16]).addClass("valuecell")
            }
            //if (aData.week05 == "0") {
            if (ProposalForMatching.filter(o => o.ediProposalsID == aData.ediProposalsID && o.demoName == "")[0].week05 == "0") {
                $($(nRow).find("td")[17]).addClass("emptycell")
            }
            else {
                $($(nRow).find("td")[17]).addClass("valuecell")
            }
            //if (aData.week06 == "0") {
            if (ProposalForMatching.filter(o => o.ediProposalsID == aData.ediProposalsID && o.demoName == "")[0].week06 == "0") {
                $($(nRow).find("td")[18]).addClass("emptycell")
            }
            else {
                $($(nRow).find("td")[18]).addClass("valuecell")
            }
            //if (aData.week07 == "0") {
            if (ProposalForMatching.filter(o => o.ediProposalsID == aData.ediProposalsID && o.demoName == "")[0].week07 == "0") {
                $($(nRow).find("td")[19]).addClass("emptycell")
            }
            else {
                $($(nRow).find("td")[19]).addClass("valuecell")
            }
            //if (aData.week08 == "0") {
            if (ProposalForMatching.filter(o => o.ediProposalsID == aData.ediProposalsID && o.demoName == "")[0].week08 == "0") {
                $($(nRow).find("td")[20]).addClass("emptycell")
            }
            else {
                $($(nRow).find("td")[20]).addClass("valuecell")
            }
            //if (aData.week09 == "0") {
            if (ProposalForMatching.filter(o => o.ediProposalsID == aData.ediProposalsID && o.demoName == "")[0].week09 == "0") {
                $($(nRow).find("td")[21]).addClass("emptycell")
            }
            else {
                $($(nRow).find("td")[21]).addClass("valuecell")
            }
            //if (aData.week10 == "0") {
            if (ProposalForMatching.filter(o => o.ediProposalsID == aData.ediProposalsID && o.demoName == "")[0].week10 == "0") {
                $($(nRow).find("td")[22]).addClass("emptycell")
            }
            else {
                $($(nRow).find("td")[22]).addClass("valuecell")
            }
            //if (aData.week11 == "0") {
            if (ProposalForMatching.filter(o => o.ediProposalsID == aData.ediProposalsID && o.demoName == "")[0].week11 == "0") {
                $($(nRow).find("td")[23]).addClass("emptycell")
            }
            else {
                $($(nRow).find("td")[23]).addClass("valuecell")
            }
            //if (aData.week12 == "0") {
            if (ProposalForMatching.filter(o => o.ediProposalsID == aData.ediProposalsID && o.demoName == "")[0].week12 == "0") {
                $($(nRow).find("td")[24]).addClass("emptycell")
            }
            else {
                $($(nRow).find("td")[24]).addClass("valuecell")
            }
            //if (aData.week13 == "0") {
            if (ProposalForMatching.filter(o => o.ediProposalsID == aData.ediProposalsID && o.demoName == "")[0].week13 == "0") {
                $($(nRow).find("td")[25]).addClass("emptycell")
            }
            else {
                $($(nRow).find("td")[25]).addClass("valuecell")
            }

            if (aData.demoName == "") {
                $($($(nRow).find("td"))[$($(nRow).find("td")).length - 11]).html("");
                $($($(nRow).find("td"))[$($(nRow).find("td")).length - 12]).html("");
                $($($(nRow).find("td"))[$($(nRow).find("td")).length - 13]).html("");
            }
                $($($(nRow).find("td"))[$($(nRow).find("td")).length - 12]).attr("id", "tdCalcDollar_" + aData.ediProposalsID + '_' + iDisplayIndex);
                $($($(nRow).find("td"))[$($(nRow).find("td")).length - 11]).attr("id", "tdCalcImps_" + aData.ediProposalsID + '_' + iDisplayIndex);
            if ($(nRow).find("td").length == 30) {
                
                //$($(nRow).find("td")[28]).attr("id", "tdCalcDollar_" + aData.ediProposalsID + '_' + iDisplayIndex);
                //$($(nRow).find("td")[29]).attr("id", "tdCalcImps_" + aData.ediProposalsID + '_' + iDisplayIndex);
                //if (aData.week14 == "0") {
                if (ProposalForMatching.filter(o => o.ediProposalsID == aData.ediProposalsID && o.demoName == "")[0].week14 == "0") {
                    $($(nRow).find("td")[26]).addClass("emptycell")
                }
                else {
                    $($(nRow).find("td")[14]).addClass("valuecell")
                }
            }
            $(nRow).find("input[type=text]").addClass("cls_" + aData.ediProposalsID + "_spottext");
            for (var nm = 1; nm < 15; nm++) {
                var weekInnerNm = (nm > 9 ? "week" : "week0") + nm.toString();
                $($(nRow).find("input[type=text]")[nm - 1]).attr("id", "txtSpots_" + aData.ediProposalsID + '_' + iDisplayIndex + '_' + weekInnerNm);
                $($(nRow).find("input[type=text]")[nm - 1]).attr("data-val", weekInnerNm);
                
                $($(nRow).find("input[type=text]")[nm - 1]).attr("onchange", "return CalcTotalSpotsMatching(this, " + aData.ediProposalsID + "," + iDisplayIndex + ")");
            }
            //id = "chkSelectMatchingProposal_' + ProposalForMatching[x].ediProposalsID + '_' + x + '" onchange = "return SelectMathingRow(this,' + ProposalForMatching[x].ediProposalsID + ',' + x + ')"
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
            $(nRow).css("background-color", SelColorMulti);
         
        },
        initComplete: function (settings, json) {
            $("#MultiMatchedProposalsMatching").width(2400);
            //$($("#thMultiMatchedProposalsMatching tr th")[0]).html('<input type="checkbox" id="chkMathingPoposals" onChange="return SelectAllMatchingProposals(this);"/></th>');
            //$($("#thMultiMatchedProposalsMatching tr th")).css("border-bottom", "1px solid e5e5e5");
            $("#thMultiMatchedProposalsMatching").css("border", "1px solid #e5e5e5");
            for (var x = 13; x <= parseInt(12) + parseInt(maxAculatizedWeekNum); x++) {
                $($("#thMultiMatchedProposalsMatching tr th")[x]).addClass("fully-actualized-header");
            }
            ValidateDataAndMerge();
            //initUnMatchProposals(UnMatchPropsalsJson, columns, columnsTitles);
        }
    });
};

function ValidateDataAndMerge() {
    MismatchProposalArray = new Array();
    if (ProposalForMatching != null && ProposalForMatching != undefined && ProposalForMatching.length > 0) {
        for (var x = 0; x < ProposalForMatching.length; x++) {
            //for (var x = 0; x < 2; x++) {
            if (x == 0) {
                TotalEDISpots = parseInt(ProposalForMatching[x].totalEDISpots);
                StartEDIId = ProposalForMatching[x].ediProposalsID;
                SelColor = primarycolor;
                TotalSpots = 0;
                TotalSpots = parseInt(TotalSpots) + parseInt(ProposalForMatching[x].totalSpots);
            }
            else {
                if (x == ProposalForMatching.length - 1) {
                    ///TotalSpots = parseInt(TotalSpots) + parseInt(ProposalForMatching[x].totalSpots);
                    TotalSpots = 0;
                    var MisMatchProposals = {};
                    MisMatchProposals.ediProposalsId = StartEDIId;
                    MisMatchProposals.totalEDISpots = TotalEDISpots;
                    MisMatchProposals.totalSpots = TotalSpots;
                    MismatchProposalArray.push(MisMatchProposals);
                    StartEDIId = ProposalForMatching[x].ediProposalsID;
                }
                else {
                    if (StartEDIId != ProposalForMatching[x].ediProposalsID) {
                        var MisMatchProposals = {};
                        MisMatchProposals.ediProposalsId = StartEDIId;
                        MisMatchProposals.totalEDISpots = TotalEDISpots;
                        //MisMatchProposals.totalSpots = TotalSpots;
                        MisMatchProposals.totalSpots = 0;
                        MismatchProposalArray.push(MisMatchProposals);
                        StartEDIId = ProposalForMatching[x].ediProposalsID;
                        if (SelColor == primarycolor)
                            SelColor = secondaryColor;
                        else
                            SelColor = primarycolor;
                        TotalEDISpots = ProposalForMatching[x].totalSpots;
                        TotalSpots = 0;
                        TotalSpots = parseInt(TotalSpots) + parseInt(ProposalForMatching[x].totalSpots);
                    }
                    else {
                        TotalSpots = parseInt(TotalSpots) + parseInt(ProposalForMatching[x].totalSpots);
                    }
                }
            }
        }
        UniquePropsalIds = [];
        var unique = MultiMatchPropsalsJson.filter(function (itm, i, a) {
            var propId = { "EDIPropId": itm.ediProposalsID }
            var index = UniquePropsalIds.findIndex(x => x.EDIPropId === itm.ediProposalsID);
            if (index < 0) {
                UniquePropsalIds.push(propId);
            }
        });
        //console.log(PropsalIds);
        for (var m = 0; m < UniquePropsalIds.length; m++) {
            $($(".cls_" + UniquePropsalIds[m].EDIPropId + "_edispots")).hide();
            $($(".cls_" + UniquePropsalIds[m].EDIPropId + "_edidollars")).hide();
            $($(".cls_" + UniquePropsalIds[m].EDIPropId + "_edispots")[0]).show();
            $($(".cls_" + UniquePropsalIds[m].EDIPropId + "_edidollars")[0]).show();
            $($(".cls_" + UniquePropsalIds[m].EDIPropId + "_edispots")[1]).show();
            $($(".cls_" + UniquePropsalIds[m].EDIPropId + "_edidollars")[1]).show();
            
            $($(".cls_" + UniquePropsalIds[m].EDIPropId + "_edispots")[1]).attr("rowspan", $(".cls_" + UniquePropsalIds[m].EDIPropId + "_edispots").length-1);
            $($(".cls_" + UniquePropsalIds[m].EDIPropId + "_edidollars")[1]).attr("rowspan", $(".cls_" + UniquePropsalIds[m].EDIPropId + "_edidollars").length-1);
            //$($(".cls_" + UniquePropsalIds[m].EDIPropId + "_edispots")[0]).attr("rowspan", $(".cls_" + PropsalIds[m].EDIPropId + "_edispots").length);
        }
    }
    $(".valuecell  input[type=text]").attr("disabled", false);
    setTimeout(function () {
        ValidateSpots();
    }, 500);
}
var TotalEDISpots = 0;
var TotalSpots = 0;

var MismatchProposalArray = new Array();
function BindMatchingTableBody(tableBodyName) {
    var HTMLBody = "";
    if (ProposalForMatching != null && ProposalForMatching != undefined && ProposalForMatching.length > 0) {
        for (var x = 0; x < ProposalForMatching.length; x++) {
        //for (var x = 0; x < 2; x++) {
            if (x == 0) {
                TotalEDISpots = parseInt(ProposalForMatching[x].totalEDISpots);
                StartEDIId = ProposalForMatching[x].ediProposalsID;
                SelColor = primarycolor;
                TotalSpots = 0;
                TotalSpots = parseInt(TotalSpots) + parseInt(ProposalForMatching[x].totalSpots);
            }
            else {
                if (x == ProposalForMatching.length - 1) {
                    TotalSpots = parseInt(TotalSpots) + parseInt(ProposalForMatching[x].totalSpots);
                    var MisMatchProposals = {};
                    MisMatchProposals.ediProposalsId = StartEDIId;
                    MisMatchProposals.totalEDISpots = TotalEDISpots;
                    MisMatchProposals.totalSpots = TotalSpots;
                    MismatchProposalArray.push(MisMatchProposals);
                    StartEDIId = ProposalForMatching[x].ediProposalsID;
                }
                else {
                    if (StartEDIId != ProposalForMatching[x].ediProposalsID) {
                        var MisMatchProposals = {};
                        MisMatchProposals.ediProposalsId = StartEDIId;
                        MisMatchProposals.totalEDISpots = TotalEDISpots;
                        MisMatchProposals.totalSpots = TotalSpots;
                        MismatchProposalArray.push(MisMatchProposals);
                        StartEDIId = ProposalForMatching[x].ediProposalsID;
                        if (SelColor == primarycolor)
                            SelColor = secondaryColor;
                        else
                            SelColor = primarycolor;
                        TotalEDISpots = ProposalForMatching[x].totalSpots;
                        TotalSpots = 0;
                        TotalSpots = parseInt(TotalSpots) + parseInt(ProposalForMatching[x].totalSpots);
                    }
                    else {
                        TotalSpots = parseInt(TotalSpots) + parseInt(ProposalForMatching[x].totalSpots);
                    }
                }
            }
            HTMLBody = HTMLBody + '<tr id="trMathingProposals_' + ProposalForMatching[x].ediProposalsID + '_' + x + '" class="tr_' + ProposalForMatching[x].ediProposalsID + '" style="background-color:' + SelColor + '">';
            HTMLBody = HTMLBody + '<td><input type="checkbox" id="chkSelectMatchingProposal_' + ProposalForMatching[x].ediProposalsID + '_' + x + '" onchange="return SelectMathingRow(this,' + ProposalForMatching[x].ediProposalsID + ',' + x + ')"/></td>';
            HTMLBody = HTMLBody + '<td class="text-center">' + ProposalForMatching[x].propertyName + '</td>';
            if (ProposalForMatching[x].m == true) {
                HTMLBody = HTMLBody + '<td class="text-center" data-val="' + ProposalForMatching[x].m + '"><i class="fa fa-circle"></i></td>';
            }
            else {
                HTMLBody = HTMLBody + '<td class="text-center"  data-val="' + ProposalForMatching[x].m + '"></td>';
            }
            if (ProposalForMatching[x].t == true) {
                HTMLBody = HTMLBody + '<td class="text-center" data-val="' + ProposalForMatching[x].t + '"><i class="fa fa-circle"></i></td>';
            }
            else {
                HTMLBody = HTMLBody + '<td class="text-center" data-val="' + ProposalForMatching[x].t + '"></td>';
            }
            if (ProposalForMatching[x].w == true) {
                HTMLBody = HTMLBody + '<td class="text-center" data-val="' + ProposalForMatching[x].w + '"><i class="fa fa-circle"></i></td>';
            }
            else {
                HTMLBody = HTMLBody + '<td class="text-center" data-val="' + ProposalForMatching[x].w + '"></td>';
            }
            if (ProposalForMatching[x].th == true) {
                HTMLBody = HTMLBody + '<td class="text-center" data-val="' + ProposalForMatching[x].th + '"><i class="fa fa-circle"></i></td>';
            }
            else {
                HTMLBody = HTMLBody + '<td class="text-center" data-val="' + ProposalForMatching[x].th + '"></td>';
            }
            if (ProposalForMatching[x].f == true) {
                HTMLBody = HTMLBody + '<td class="text-center" data-val="' + ProposalForMatching[x].f + '"><i class="fa fa-circle"></i></td>';
            }
            else {
                HTMLBody = HTMLBody + '<td class="text-center" data-val="' + ProposalForMatching[x].f + '"></td>';
            }
            if (ProposalForMatching[x].sa == true) {
                HTMLBody = HTMLBody + '<td class="text-center" data-val="' + ProposalForMatching[x].sa + '"><i class="fa fa-circle"></i></td>';
            }
            else {
                HTMLBody = HTMLBody + '<td class="text-center" data-val="' + ProposalForMatching[x].sa + '"></td>';
            }
            if (ProposalForMatching[x].su == true) {
                HTMLBody = HTMLBody + '<td class="text-center" data-val="' + ProposalForMatching[x].su + '"><i class="fa fa-circle"></i></td>';
            }
            else {
                HTMLBody = HTMLBody + '<td class="text-center" data-val="' + ProposalForMatching[x].su + '"></td>';
            }
            HTMLBody = HTMLBody + '<td class="text-center" >' + ProposalForMatching[x].startAndEndTime + '</td>';
            HTMLBody = HTMLBody + '<td class="text-center" >' + ProposalForMatching[x].buyTypeCode + '</td>';
            HTMLBody = HTMLBody + '<td class="text-center" >' + ProposalForMatching[x].dayPart + '</td>';
            //HTMLBody = HTMLBody + '<td class="text-center" >' + ProposalForMatching[x].spotLen + '</td>';
            HTMLBody = HTMLBody + '<td class="text-center" >';
            if (ProposalForMatching[x].spotLen === 120) {
                HTMLBody = HTMLBody + '<span class="badge badge-pill badge-danger">' + ProposalForMatching[x].spotLen + '</span>';
            }
            else if (ProposalForMatching[x].spotLen === 60) {
                HTMLBody = HTMLBody + '<span class="badge badge-pill badge-primary">' + ProposalForMatching[x].spotLen + '</span>';
            }
            else if (ProposalForMatching[x].spotLen === 15) {
                HTMLBody = HTMLBody + '<span class="badge badge-pill badge-warning">' + ProposalForMatching[x].spotLen + '</span>';
            }
            else {
                HTMLBody = HTMLBody + '<span class="badge badge-pill badge-success">' + ProposalForMatching[x].spotLen + '</span>';
            }
            HTMLBody = HTMLBody + '</td>';
            HTMLBody = HTMLBody + '<td class="text-center" >' + ProposalForMatching[x].demoName + '</td>';
            HTMLBody = HTMLBody + '<td class="text-right" id="tdRateAmt_' + ProposalForMatching[x].ediProposalsID + '_' + x + '">' + $.fn.dataTable.render.number(',', '.', 2, '$').display(ProposalForMatching[x].rateAmt) + '</td>';
            HTMLBody = HTMLBody + '<td class="text-right" id="tdImps_' + ProposalForMatching[x].ediProposalsID + '_' + x + '">' + $.fn.dataTable.render.number(',', '.', 2, '').display(ProposalForMatching[x].impressions) + '</td>';
            HTMLBody = HTMLBody + '<td class="text-right" id="tdCPM_' + ProposalForMatching[x].ediProposalsID + '_' + x + '">' + $.fn.dataTable.render.number(',', '.', 2, '$').display(ProposalForMatching[x].cpm) + '</td>';
            HTMLBody = HTMLBody + '<td class="text-center cls_' + ProposalForMatching[x].ediProposalsID + '_edispots">' + $.fn.dataTable.render.number(',', '.', 0, '').display(ProposalForMatching[x].totalEDISpots) + '</td>';
            HTMLBody = HTMLBody + '<td class="text-center cls_' + ProposalForMatching[x].ediProposalsID + ' calcspots" id="tdSpots_' + ProposalForMatching[x].ediProposalsID + '_' + x + '" >' + $.fn.dataTable.render.number(',', '.', 0, '').display(ProposalForMatching[x].totalSpots) + '</td>';
            for (var n = 1; n < 15; n++) {
                var weekInnerName = (n > 9 ? "week" : "week0") + n.toString();
                if (n == 14) {
                    if (SelQtrJson["wk14_Date"] != null && SelQtrJson["wk14_Date"] != undefined && SelQtrJson["wk14_Date"] != "") {
                        if (ProposalForMatching[x][weekInnerName] != '0') {
                            HTMLBody = HTMLBody + '<td class="text-center cls_' + ProposalForMatching[x].ediProposalsID + '"><input data-val="' + weekInnerName + '" onchange="return CalcTotalSpotsMatching(this,' + ProposalForMatching[x].ediProposalsID + ',' + x + ');" style ="width:60px;float:left;" id="txtSpots_' + ProposalForMatching[x].ediProposalsID + '_' + x + '_' + weekInnerName + '" class="text-center" disabled type="text" value="' + ProposalForMatching[x][weekInnerName] + '"/></td>';
                        }
                        else {
                            HTMLBody = HTMLBody + '<td class="text-center cls_' + ProposalForMatching[x].ediProposalsID + '"><input data-val="' + weekInnerName + '" onchange="return CalcTotalSpotsMatching(this,' + ProposalForMatching[x].ediProposalsID + ',' + x + ');" style ="width:60px;float:left;" id="txtSpots_' + ProposalForMatching[x].ediProposalsID + '_' + x + '_' + weekInnerName + '" class="text-center" disabled type="text" value=""/></td>';
                        }
                    }
                }
                else {
                    if (ProposalForMatching[x][weekInnerName] != '0') {
                        HTMLBody = HTMLBody + '<td class="text-center cls_' + ProposalForMatching[x].ediProposalsID + '"><input data-val="' + weekInnerName + '" onchange="return CalcTotalSpotsMatching(this,' + ProposalForMatching[x].ediProposalsID + ',' + x + ');" style ="width:60px;float:left;" id="txtSpots_' + ProposalForMatching[x].ediProposalsID + '_' + x + '_' + weekInnerName + '" class="text-center" disabled type="text" value="' + ProposalForMatching[x][weekInnerName] + '"/></td>';
                    }
                    else {
                        HTMLBody = HTMLBody + '<td class="text-center cls_' + ProposalForMatching[x].ediProposalsID + '"><input data-val="' + weekInnerName + '" onchange="return CalcTotalSpotsMatching(this,' + ProposalForMatching[x].ediProposalsID + ',' + x + ');" style ="width:60px;float:left;" id="txtSpots_' + ProposalForMatching[x].ediProposalsID + '_' + x + '_' + weekInnerName + '" class="text-center" disabled type="text" value=""/></td>';
                    }
                }
            }
            HTMLBody = HTMLBody + '<td class="text-center cls_' + ProposalForMatching[x].ediProposalsID + '_edidollars" edidollarsdata" id="tdEDIDolllars_' + ProposalForMatching[x].ediProposalsID + '_' + x + '">' + $.fn.dataTable.render.number(',', '.', 2, '$').display(ProposalForMatching[x].totalDollar) + '</td>';
            HTMLBody = HTMLBody + '<td class="text-center cls_' + ProposalForMatching[x].ediProposalsID + ' calcdollardata" id="tdCalcDollar_' + ProposalForMatching[x].ediProposalsID + '_' + x + '">' + $.fn.dataTable.render.number(',', '.', 2, '$').display(ProposalForMatching[x].calcDollar) + '</td>';
            HTMLBody = HTMLBody + '<td class="text-center cls_' + ProposalForMatching[x].ediProposalsID + ' calimpsdata" id="tdCalcImps_' + ProposalForMatching[x].ediProposalsID + '_' + x + '">' + $.fn.dataTable.render.number(',', '.', 2, '').display(ProposalForMatching[x].calcImps) + '</td>';
            HTMLBody = HTMLBody + '</tr>';
        }
        //console.log(tableBodyName.substring(2));
        $("#" + tableBodyName).html(HTMLBody);
        //$("#" + tableBodyName.substring(2)).dataTable({
        //    'pageLength': 50,
        //    'bSort':false
        //});
        $("#" + tableBodyName.substring(2)).dataTable({
            'pageLength': 50,
            'bSort': false,
            initComplete: function (settings, json) {
                $($("#" + tableBodyName.substring(2) + " th")[2]).width("270px");
            }
        });
        $("#" + tableBodyName.substring(2) + " th").css("width", "150px!important");
        $($("#" + tableBodyName.substring(2) + " th")[0]).width("3000px");
        $($("#" + tableBodyName.substring(2) + " th")[1]).width("120px");
        $($("#" + tableBodyName.substring(2) + " th")[2]).width("270px");
        $($("#" + tableBodyName.substring(2) + " th")[3]).width("100px");
        $($("#" + tableBodyName.substring(2) + " th")[4]).width("150px");
        $($("#" + tableBodyName.substring(2) + " th")[5]).width("150px");
        $($("#" + tableBodyName.substring(2) + " th")[6]).width("150px");
        //$("#" + tableBodyName.substring(2)).margetable({
        //    type: 2,
        //    colindex: [17]
        //});
        UniquePropsalIds = [];
        var unique = MultiMatchPropsalsJson.filter(function (itm, i, a) {
            var propId = { "EDIPropId": itm.ediProposalsID }
            var index = UniquePropsalIds.findIndex(x => x.EDIPropId === itm.ediProposalsID);
            if (index < 0) {
                UniquePropsalIds.push(propId);
            }
        });
        //console.log(PropsalIds);
        for (var m = 0; m < UniquePropsalIds.length; m++) {
            $($(".cls_" + UniquePropsalIds[m].EDIPropId + "_edispots")).hide();
            $($(".cls_" + UniquePropsalIds[m].EDIPropId + "_edispots")[0]).show();
            $($(".cls_" + UniquePropsalIds[m].EDIPropId + "_edispots")[0]).attr("rowspan", $(".cls_" + UniquePropsalIds[m].EDIPropId + "_edispots").length);
            $($(".cls_" + UniquePropsalIds[m].EDIPropId + "_edidollars")).hide();
            $($(".cls_" + UniquePropsalIds[m].EDIPropId + "_edidollars")[0]).show();
            $($(".cls_" + UniquePropsalIds[m].EDIPropId + "_edidollars")[0]).attr("rowspan", $(".cls_" + UniquePropsalIds[m].EDIPropId + "_edidollars").length);
            //$($(".cls_" + UniquePropsalIds[m].EDIPropId + "_edispots")[0]).attr("rowspan", $(".cls_" + PropsalIds[m].EDIPropId + "_edispots").length);
        }
    }

    setTimeout(function () {
        ValidateSpots();
    }, 500);
}

function ValidateSpots1() {
    for (var x = 0; x < MismatchProposalArray.length; x++) {
        if (MismatchProposalArray[x].demoName != "") {         
            if (MismatchProposalArray.filter(o => parseInt(o.totalEDISpots) != parseInt(o.totalSpots)) == 0) {
                $("#btnConfirmMatches").attr("disabled", false);
            }
            else {
                $("#btnConfirmMatches").attr("disabled", true);
            }
        }
    }
    HideOverlayPopupMatching();
}

function ValidateSpots2(propId) {
    for (var x = 0; x < MismatchProposalArray.length; x++) {
        if (MismatchProposalArray[x].demoName != "") {
         
            if (MismatchProposalArray.filter(o => parseInt(o.totalEDISpots) != parseInt(o.totalSpots)) == 0) {
                $("#btnConfirmMatches").attr("disabled", false);
            }
            else {
                $("#btnConfirmMatches").attr("disabled", true);
            }
        }
    }  
    var ediSpots = 0;    
    $($(".cls_" + propId + "_edispots")).each(function () {
        if ($(this).css("display") != "none") {
            var edispotss = parseInt($(this).text());
            if (!isNaN(edispotss)) {
                ediSpots = edispotss;
            }
        }
       
    });
    var totSpots = 0;
    $(".cls_" + propId + ".calcspots").each(function () {        
        var spots = parseInt($(this).text());
        if (!isNaN(spots)) {
            totSpots += spots;
        }        
    });
    if (ediSpots != totSpots) {
        if ($(".cls_" + propId + "_edispots").hasClass("matchedcell")) {
            $(".cls_" + propId + "_edispots").removeClass("matchedcell");
            $(".cls_" + propId + "_edispots").addClass("unmatchedcell");
        }
        if ($(".cls_" + propId + ".calcspots").hasClass("matchedcell")) {
            $(".cls_" + propId + ".calcspots").removeClass("matchedcell");
            $(".cls_" + propId + ".calcspots").addClass("unmatchedcell");
        }
        $($(".cls_" + propId + "_edispots")[0]).removeClass("unmatchedcell");
        $($(".cls_" + propId + ".calcspots")[0]).removeClass("unmatchedcell");
        $($(".cls_" + propId + "_edispots")[0]).removeClass("matchedcell");
        $($(".cls_" + propId + ".calcspots")[0]).removeClass("matchedcell");

        $(".cls_" + propId + "_edispots").addClass("unmatchedcell");
        $(".cls_" + propId + ".calcspots").addClass("unmatchedcell");
        $($(".cls_" + propId + "_edispots")[0]).removeClass("unmatchedcell");
        $($(".cls_" + propId + ".calcspots")[0]).removeClass("unmatchedcell");
    }
    else {
        $(".cls_" + propId).css("color", "black");
        $(".cls_" + propId + "_edispots").css("color", "black");
        if ($(".cls_" + propId + "_edispots").hasClass("unmatchedcell")) {
            $(".cls_" + propId + "_edispots").removeClass("unmatchedcell");
            $(".cls_" + propId + "_edispots").addClass("matchedcell");
        }
        if ($(".cls_" + propId + ".calcspots").hasClass("unmatchedcell")) {
            $(".cls_" + propId + ".calcspots").removeClass("unmatchedcell");
            $(".cls_" + propId + ".calcspots").addClass("matchedcell");
        }
     
        $($(".cls_" + propId + "_edispots")[0]).removeClass("unmatchedcell");
        $($(".cls_" + propId + ".calcspots")[0]).removeClass("unmatchedcell");
        $($(".cls_" + propId + "_edispots")[0]).removeClass("matchedcell");
        $($(".cls_" + propId + ".calcspots")[0]).removeClass("matchedcell");
    }
    HideOverlayPopupMatching();
}

function ValidateSpots() {
    for (var x = 0; x < MismatchProposalArray.length; x++) {
        if (MismatchProposalArray[x].demoName != "") {
            if (parseInt(MismatchProposalArray[x].totalEDISpots) != parseInt(MismatchProposalArray[x].totalSpots)) {
                //$(".cls_" + MismatchProposalArray[x].ediProposalsId).css("color", "red");
                //$(".cls_" + MismatchProposalArray[x].ediProposalsId+"_edispots").css("color", "red");
                if ($(".cls_" + MismatchProposalArray[x].ediProposalsId + "_edispots").hasClass("matchedcell")) {
                    $(".cls_" + MismatchProposalArray[x].ediProposalsId + "_edispots").removeClass("matchedcell");
                    $(".cls_" + MismatchProposalArray[x].ediProposalsId + "_edispots").addClass("unmatchedcell");
                }
                if ($(".cls_" + MismatchProposalArray[x].ediProposalsId + ".calcspots").hasClass("matchedcell")) {
                    $(".cls_" + MismatchProposalArray[x].ediProposalsId + ".calcspots").removeClass("matchedcell");
                    $(".cls_" + MismatchProposalArray[x].ediProposalsId + ".calcspots").addClass("unmatchedcell");
                }
                $($(".cls_" + MismatchProposalArray[x].ediProposalsId + "_edispots")[0]).removeClass("unmatchedcell");
                $($(".cls_" + MismatchProposalArray[x].ediProposalsId + ".calcspots")[0]).removeClass("unmatchedcell");
                $($(".cls_" + MismatchProposalArray[x].ediProposalsId + "_edispots")[0]).removeClass("matchedcell");
                $($(".cls_" + MismatchProposalArray[x].ediProposalsId + ".calcspots")[0]).removeClass("matchedcell");

                $(".cls_" + MismatchProposalArray[x].ediProposalsId + "_edispots").addClass("unmatchedcell");
                $(".cls_" + MismatchProposalArray[x].ediProposalsId + ".calcspots").addClass("unmatchedcell");
                $($(".cls_" + MismatchProposalArray[x].ediProposalsId + "_edispots")[0]).removeClass("unmatchedcell");
                $($(".cls_" + MismatchProposalArray[x].ediProposalsId + ".calcspots")[0]).removeClass("unmatchedcell");
            }
            else {
                //$(".cls_" + MismatchProposalArray[x].ediProposalsId).css("color", "black");
                //$(".cls_" + MismatchProposalArray[x].ediProposalsId + "_edispots").css("color", "black");
                if ($(".cls_" + MismatchProposalArray[x].ediProposalsId + "_edispots").hasClass("unmatchedcell")) {
                    $(".cls_" + MismatchProposalArray[x].ediProposalsId + "_edispots").removeClass("unmatchedcell");
                    $(".cls_" + MismatchProposalArray[x].ediProposalsId + "_edispots").addClass("matchedcell");
                }
                if ($(".cls_" + MismatchProposalArray[x].ediProposalsId + ".calcspots").hasClass("unmatchedcell")) {
                    $(".cls_" + MismatchProposalArray[x].ediProposalsId + ".calcspots").removeClass("unmatchedcell");
                    $(".cls_" + MismatchProposalArray[x].ediProposalsId + ".calcspots").addClass("matchedcell");
                }

                //$(".cls_" + MismatchProposalArray[x].ediProposalsId + ".calcspots").addClass("matchedcell");

                //$(".cls_" + MismatchProposalArray[x].ediProposalsId + "_edispots").addClass("matchedcell");
                //$(".cls_" + MismatchProposalArray[x].ediProposalsId + ".calcspots").addClass("matchedcell");
                $($(".cls_" + MismatchProposalArray[x].ediProposalsId + "_edispots")[0]).removeClass("unmatchedcell");
                $($(".cls_" + MismatchProposalArray[x].ediProposalsId + ".calcspots")[0]).removeClass("unmatchedcell");
                $($(".cls_" + MismatchProposalArray[x].ediProposalsId + "_edispots")[0]).removeClass("matchedcell");
                $($(".cls_" + MismatchProposalArray[x].ediProposalsId + ".calcspots")[0]).removeClass("matchedcell");
            }
            if (MismatchProposalArray.filter(o => parseInt(o.totalEDISpots) != parseInt(o.totalSpots)) == 0) {
                $("#btnConfirmMatches").attr("disabled", false);
            }
            else {
                $("#btnConfirmMatches").attr("disabled", true);
            }
        }
    }
    HideOverlayPopupMatching();
}

function CalcTotalSpotsMatching(ctrl, EDIPorpId, SelIndex) {
    
    let TotalRowSpots = 0;
    $("#chkSelectMatchingProposal_" + EDIPorpId + "_" + SelIndex).prop("checked", false);
    $('input[name="RowSel_' + EDIPorpId + '"]').each(function () {
        var thisRadio = $(this);
        $(thisRadio[0]).data("ischecked", true);        
    });  
    //$("#trMathingProposals_" + EDIPorpId + "_" + SelIndex + " input[type=text]").length
    for (j = 0; j < $(".tr_"+EDIPorpId+".valuerow input[type=text]").length; j++) {
        var curInput = $(".tr_" + EDIPorpId + ".valuerow input[type=text]")[j];
        if ($($(curInput).closest("td")).hasClass("valuecell")) {
            $(curInput).attr("disabled", false);
        }
    }
    //$(".cls_" + ediPropId + "_spottext").attr("disabled", false);
    for (var m = 0; m < $("#trMathingProposals_" + EDIPorpId + "_" + SelIndex + " input[type=text]").length; m++) {
        if ($($($("#trMathingProposals_" + EDIPorpId + "_" + SelIndex + " input[type=text]")[m]).closest("td")).hasClass("valuecell")) {
            var WeekNum = "";
            if (m > 8) {
                WeekNum = "week" + parseInt(m + 1);
            }
            else {
                WeekNum = "week0" + parseInt(m + 1);
            }
            ProposalForMatching[SelIndex][WeekNum] = $($("#trMathingProposals_" + EDIPorpId + "_" + SelIndex + " input[type=text]")[m]).val() == "" ? "0" : $($("#trMathingProposals_" + EDIPorpId + "_" + SelIndex + " input[type=text]")[m]).val();
        }
    }

    $(ctrl).closest("tr").find("input[type=text]").each(function () {
        var curCellVal = 0;
        if ($(this).val() == null || $(this).val() == undefined || $(this).val() == "" || $(this).val() == "0") {
            $(this).val("");
            curCellVal = "0";
        }
        else {
            curCellVal = $(this).val();
        }
        //TotalRowSpots = parseInt(TotalRowSpots) + parseInt($(this).val());
        TotalRowSpots = parseInt(TotalRowSpots) + parseInt(curCellVal);
    });
    
    $("#tdSpots_" + EDIPorpId + "_" + SelIndex).html(TotalRowSpots);
    let RowDollar = parseFloat(parseFloat($("#tdRateAmt_" + EDIPorpId + "_" + SelIndex).html().trim().substring(1).replace(/,/g,'')).toFixed(2) * parseFloat(TotalRowSpots).toFixed(2)).toFixed(2);
    let RowImps = parseFloat(parseFloat($("#tdImps_" + EDIPorpId + "_" + SelIndex).html().trim()).toFixed(2) * parseFloat(TotalRowSpots).toFixed(2)).toFixed(2);

    $("#tdCalcDollar_" + EDIPorpId + "_" + SelIndex).html($.fn.dataTable.render.number(',', '.', 2, '$').display(RowDollar));
    $("#tdCalcImps_" + EDIPorpId + "_" + SelIndex).html($.fn.dataTable.render.number(',', '.', 2, '').display(RowImps));
    //if (RowDollar == "0.00") {
    //    $("#tdCalcDollar_" + EDIPorpId + "_" + SelIndex + "").css("color", "transparent");
    //}
    //else {
    //    $("#tdCalcDollar_" + EDIPorpId + "_" + SelIndex + "").css("color", "#575757");
    //}
    //if (RowImps == "0.00") {
    //    $("#tdCalcImps_" + EDIPorpId + "_" + SelIndex + "").css("color", "transparent");
    //}
    //else {
    //    $("#tdCalcImps_" + EDIPorpId + "_" + SelIndex + "").css("color", "#575757");
    //}    
    $("#tdCalcDollar_" + EDIPorpId + "_" + SelIndex + "").css("color", "#575757");
    $("#tdCalcImps_" + EDIPorpId + "_" + SelIndex + "").css("color", "#575757");
    let CalSpotGroup = 0;
    $(".tr_" + EDIPorpId + " .calcspots").each(function () {
        var CurSpots = $(this).html().trim() == '' ? '0' : $(this).html().trim();
        CalSpotGroup = parseInt(CalSpotGroup) + parseInt(CurSpots);
    });
    MismatchProposalArray.filter(o => o.ediProposalsId == EDIPorpId)[0].totalSpots = CalSpotGroup;
    ProposalForMatching[SelIndex].calcDollar = RowDollar;
    ProposalForMatching[SelIndex].calcImps = RowImps;
    ProposalForMatching[SelIndex].totalSpots = TotalRowSpots;
    ProposalForMatching[SelIndex][$(ctrl).attr("data-val")] = $(ctrl).val();
    ValidateSpots2(EDIPorpId);
}
function SelectAllMatchingProposals(ctrl) {
    if ($(ctrl).prop("checked")) {
        $("#tbMultiMatchedProposalsMatching input[type=checkbox]").prop("checked", true);
        $("#tbMultiMatchedProposalsMatching input[type=text]").attr("disabled", false);
    }
    else {
        $("#tbMultiMatchedProposalsMatching input[type=checkbox]").prop("checked", false);
        $("#tbMultiMatchedProposalsMatching input[type=text]").attr("disabled", true);
    }
}

function deSelectRadioBtn(ctrl, propId, selIndex) {
    var ischecked = $(ctrl).data("ischecked");
    if (ischecked) {
        $(ctrl).prop("checked", true);   
        $(ctrl).data("ischecked", false);
        //if ($(".cls_" + propId + "_edispots").hasClass("unmatchedcell")) {
            $(".cls_" + propId + "_edispots").removeClass("unmatchedcell");
            $(".cls_" + propId + "_edispots").addClass("matchedcell");
        //}
        //if ($(".cls_" + propId + ".calcspots").hasClass("unmatchedcell")) {
            $(".cls_" + propId + ".calcspots").removeClass("unmatchedcell");
            $(".cls_" + propId + ".calcspots").addClass("matchedcell");
        //}
        $($(".cls_" + propId + "_edispots")[0]).removeClass("matchedcell");
        $($(".cls_" + propId + ".calcspots")[0]).removeClass("matchedcell");
        $(".cls_" + propId + "_spottext").val("");
        $(".cls_" + propId + "_spottext").attr("disabled", true);
    }
    else {
        $(".cls_" + propId + "_spottext").val("");
        $(".cls_" + propId + "_spottext").each(function () {
            var isZero = parseInt($(this).attr("item-val"));
            if (isZero != 0) {
                $(this).prop("disabled", false);
            }
        })
        //$(".cls_" + propId + "_spottext").attr("disabled", false);
        $(".cls_" + propId + ".calcspots").html("");
        $(".cls_" + propId + "_calcdollars").html("");
        $(".cls_" + propId + "_calcImp").html("");
        //$(".cls_" + propId + "_edispots").removeClass("matchedcell");
        //$(".cls_" + propId + "_edispots").addClass("unmatchedcell");
        //$(".cls_" + propId + ".calcspots").removeClass("matchedcell");
        //$(".cls_" + propId + " .calcspots").addClass("unmatchedcell");
        if ($(".cls_" + propId + "_edispots").hasClass("matchedcell")) {
            $(".cls_" + propId + "_edispots").removeClass("matchedcell");
            $(".cls_" + propId + "_edispots").addClass("unmatchedcell");
        }
        if ($(".cls_" + propId + ".calcspots").hasClass("matchedcell")) {
            $(".cls_" + propId + ".calcspots").removeClass("matchedcell");
            $(".cls_" + propId + ".calcspots").addClass("unmatchedcell");
        }
        $($(".cls_" + propId + "_edispots")[0]).removeClass("unmatchedcell");
        $($(".cls_" + propId + ".calcspots")[0]).removeClass("unmatchedcell");
       
        //$($("#trMathingProposals_" + propId + "_" + selIndex + " input[type=text]")).each(function () {
        //    $(this).prop("disabled", "false");
        //});
        $(ctrl).prop("checked", false); 
        $(ctrl).data("ischecked", true);

        var proposalSpecificData = MultiMatchPropsalsJson.filter(f => f.ediProposalsID == propId)[1];
        //for (var i = 0; i < proposalSpecificData.length; i++) {
        var TotalDollars = parseFloat(proposalSpecificData.totalDollar).toFixed(2);
        var TotalImp = parseFloat(proposalSpecificData.impressions).toFixed(2);
        var formattedDollarVal = parseFloat(TotalDollars).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        });

        var TotalRowSpots = 0;       
        var FirstRowVal = MultiMatchPropsalsJson.filter(o => o.ediProposalsID == propId && o.demoName == "")[0];
        for (var m = 0; m < $("#trMathingProposals_" + propId + "_" + selIndex + " input[type=text]").length; m++) {
            if ($($($("#trMathingProposals_" + propId + "_" + selIndex + " input[type=text]")[m]).closest("td")).hasClass("valuecell")) {                
                var WeekNum = "";
                if (m > 8) {
                    WeekNum = "week" + parseInt(m + 1);
                }
                else {
                    WeekNum = "week0" + parseInt(m + 1);
                }                
                TotalRowSpots = parseInt(TotalRowSpots) + parseInt(FirstRowVal[WeekNum]);
            }
        }

        var formattedImpressionVal = parseFloat(parseFloat(TotalImp).toFixed(2) * TotalRowSpots).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        });      

        $(".cls_" + propId + "_calcdollars").html(formattedDollarVal);
        $(".cls_" + propId + "_calcImp").html(formattedImpressionVal.substring(1));
        $($(".cls_" + propId + "_calcdollars")[0]).html("");
        $($(".cls_" + propId + "_calcImp")[0]).html("");
        MismatchProposalArray.filter(o => o.ediProposalsId == propId)[0].totalSpots = 0;
        ValidateSpots1();
    }
    $('input[name="RowSel_' + propId + '"]').each(function () {
        var thisRadio = $(this);
        if (thisRadio[0].id != ctrl.id) {
            $(thisRadio[0]).data("ischecked", true);
        }
    });   
}

function SelectMathingRow(ctrl, ediPropId, selIndex) {    
    if ($(ctrl).prop("checked")) {
        

        for (x = 0; x < ProposalForMatching.filter(o => o.ediProposalsID == ediPropId).length; x++) {
            if (ProposalForMatching.filter(o => o.ediProposalsID == ediPropId)[x].demoName != "" && x != selIndex) {
                ProposalForMatching.filter(o => o.ediProposalsID == ediPropId)[x].totalSpots = 0;
                ProposalForMatching.filter(o => o.ediProposalsID == ediPropId)[x].week01 = 0;
                ProposalForMatching.filter(o => o.ediProposalsID == ediPropId)[x].week02 = 0;
                ProposalForMatching.filter(o => o.ediProposalsID == ediPropId)[x].week03 = 0;
                ProposalForMatching.filter(o => o.ediProposalsID == ediPropId)[x].week04 = 0;
                ProposalForMatching.filter(o => o.ediProposalsID == ediPropId)[x].week05 = 0;
                ProposalForMatching.filter(o => o.ediProposalsID == ediPropId)[x].week06 = 0;
                ProposalForMatching.filter(o => o.ediProposalsID == ediPropId)[x].week07 = 0;
                ProposalForMatching.filter(o => o.ediProposalsID == ediPropId)[x].week08 = 0;
                ProposalForMatching.filter(o => o.ediProposalsID == ediPropId)[x].week09 = 0;
                ProposalForMatching.filter(o => o.ediProposalsID == ediPropId)[x].week10 = 0;
                ProposalForMatching.filter(o => o.ediProposalsID == ediPropId)[x].week11 = 0;
                ProposalForMatching.filter(o => o.ediProposalsID == ediPropId)[x].week12 = 0;
                ProposalForMatching.filter(o => o.ediProposalsID == ediPropId)[x].week13 = 0;
                ProposalForMatching.filter(o => o.ediProposalsID == ediPropId)[x].week14 = 0;
            }
        }
        
        var TotalRowSpots = 0;
        var TotalDollars = 0.00; 
        var TotalImp = 0.00;
        var FirstRowVal = MultiMatchPropsalsJson.filter(o => o.ediProposalsID == ediPropId && o.demoName == "")[0];
        for (var m = 0; m < $("#trMathingProposals_" + ediPropId + "_" + selIndex + " input[type=text]").length; m++) {
            if ($($($("#trMathingProposals_" + ediPropId + "_" + selIndex + " input[type=text]")[m]).closest("td")).hasClass("valuecell")) {
                ///$($("#trMathingProposals_" + ediPropId + "_" + selIndex + " input[type=text]")[m]).val($($("#trMathingProposals_" + ediPropId + "_" + selIndex + " input[type=text]")[m]).attr("item-val"));
                var WeekNum = "";
                if (m > 8) {
                    WeekNum = "week" + parseInt(m + 1);
                }
                else {
                    WeekNum = "week0" + parseInt(m + 1);
                }
                $($("#trMathingProposals_" + ediPropId + "_" + selIndex + " input[type=text]")[m]).val(FirstRowVal[WeekNum]);
                $($("#trMathingProposals_" + ediPropId + "_" + selIndex + " input[type=text]")[m]).attr("disabled", false);
                //ProposalForMatching.filter(o => o.ediProposalsID == ediPropId)[selIndex][WeekNum] = FirstRowVal[WeekNum];
                ProposalForMatching[selIndex][WeekNum] = FirstRowVal[WeekNum];
                //TotalRowSpots = parseInt(TotalRowSpots) + parseInt($($("#trMathingProposals_" + ediPropId + "_" + selIndex + " input[type=text]")[m]).attr("item-val"));
                TotalRowSpots = parseInt(TotalRowSpots) + parseInt(FirstRowVal[WeekNum]);                
            }
        }

        var proposalSpecificData = MultiMatchPropsalsJson.filter(f => f.ediProposalsID == ediPropId)[1];
        //for (var i = 0; i < proposalSpecificData.length; i++) {
        TotalDollars = parseFloat(proposalSpecificData.totalDollar).toFixed(2);
        TotalImp = parseFloat(proposalSpecificData.impressions).toFixed(2);
        //}
        
        $(".cls_" + ediPropId + ".calcspots").html("");
        $(".cls_" + ediPropId + "_calcdollars").html("");
        $(".cls_" + ediPropId + "_calcImp").html("");
        //$(".cls_" + ediPropId + "_calcdollars").css("color", "transparent");
        //$("#tdCalcDollar_" + ediPropId + "_" + selIndex + "").css("color", "#575757");
        //$(".cls_" + ediPropId + "_calcImp").css("color", "transparent");
        //$("#tdCalcImps_" + ediPropId + "_" + selIndex + "").css("color", "#575757");
        $("#tdSpots_" + ediPropId + "_" + selIndex + "").html(TotalRowSpots);
        var formattedDollarVal = parseFloat(TotalDollars).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        });
        var formattedImpressionVal = parseFloat(parseFloat(TotalImp).toFixed(2) * TotalRowSpots).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        });
        $("#tdCalcDollar_" + ediPropId + "_" + selIndex + "").html(formattedDollarVal);
        $("#tdCalcImps_" + ediPropId + "_" + selIndex + "").html(formattedImpressionVal.substring(1));
       // ProposalForMatching.filter(o => o.ediProposalsID == ediPropId)[selIndex].totalSpots = TotalRowSpots;
        ProposalForMatching[selIndex].totalSpots = TotalRowSpots;
        MismatchProposalArray.filter(o => o.ediProposalsId == ediPropId)[0].totalSpots = TotalRowSpots;
    }
    ValidateSpots1();
    //else {
    //    $("#trMathingProposals_" + ediPropId + "_" + selIndex + " input[type=text]").attr("disabled", true);
    //}
}
function BackToLoadImportscreen() {
    ShowOverlayPopupImport();
    $("#modal-UnAllocatedProposalsMatching").modal('hide');
    $('#modal-ImportUnAllocatedProposals').modal({ backdrop: 'static', keyboard: false, draggable: true }, 'show');
    
    //BindImportScreenData(currentJsonSelectedForImport);
    setTimeout(function () { $("#modal-ImportUnAllocatedProposals .block-content").scrollLeft(0); }, 3000);
    setTimeout(function () { $("#modal-ImportUnAllocatedProposals .block-content").scrollTop(0); }, 2000);
    setTimeout(function () { HideOverlayPopupImport(); }, 3000);
}

function ConfirmMathes() {
    //alert("This functionality is under development.");
    //return false;
    ShowOverlayPopupConfirmMatch();
    $("#modal-UnAllocatedProposalsMatching").modal('hide');
    $('#modal-UnAllocatedProposalsConfirmMatch').modal({ backdrop: 'static', keyboard: false, draggable: true }, 'show');
    //FinalMatchedProposals = SingleMatchPropsalsJson.filter(o => o.demoName != "" && o.isFullyActualized == false);//ST-720 Added Logic for Excluding Fully Actualized Rows
    FinalMatchedProposals = jQuery.extend(true, [], SingleMatchPropsalsJson.filter(o => o.demoName != "" && o.isFullyActualized == false));//ST-720 Added Logic for Excluding Fully Actualized Rows

    for (var n = 0; n < FinalMatchedProposals.filter(o => o.demoName != "").length; n++) {        
        for (var m = 0; m < FinalMatchedProposals.length; m++) {
            if (n < MultiMatchPropsalsJson.length) {
                if (FinalMatchedProposals[m].ediProposalsID == MultiMatchPropsalsJson[n].ediProposalsID) {
                    FinalMatchedProposals.splice(m, 1);
                }
            }
            
        }
    }
    redirectFrom = "choosematches";
   // var CurMultiMatch = ProposalForMatching.filter(o => o.demoName != "");
    //MultiMatchPropsalsJson = CurMultiMatch;

    //for (var n = 0; n < ProposalForMatching.length; n++) {
    //    if (ProposalForMatching[n].totalSpots != null && ProposalForMatching[n].totalSpots != undefined
    //        && ProposalForMatching[n].totalSpots != "" && ProposalForMatching[n].totalSpots != "0"
    //        && parseInt(ProposalForMatching[n].totalSpots) > 0) {
    //        FinalMatchedProposals.push(ProposalForMatching[n]);
    //    }
    //}
    //Added below lines for ST-710
    var proposalId = 0;
    if ($(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != null && $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != undefined && $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != "")
        proposalId = $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href").split('=')[1];
    var ChooseMatchDescription = "User Selected following proeprties on Choose matches screen:\n";
    //Added above lines for ST-710
    var TotalRowsMatching = $("#tbMultiMatchedProposalsMatching tr");
    for (var n = 0; n < TotalRowsMatching.length; n++) {
        if ($($(TotalRowsMatching[n]).find("td")[12]).html() != null && $($(TotalRowsMatching[n]).find("td")[12]).html() != undefined
            && $($(TotalRowsMatching[n]).find("td")[12]).html() != "" && $($(TotalRowsMatching[n]).find("td")[12]).html() != "0"
            //&& parseInt(ProposalForMatching[n].totalSpots) > 0
        ) {
            ChooseMatchDescription = ChooseMatchDescription + "\nProperty :" + ProposalForMatching[n].propertyName + ",DemoName:" + ProposalForMatching[n].demoName + ",StartAndEndTime:" + ProposalForMatching[n].startAndEndTime +
                ",BuyType:" + ProposalForMatching[n].buyTypeCode + ",SpotLen:" + ProposalForMatching[n].spotLen + ",RateAmt:" + ProposalForMatching[n].rateAmt + ",TotalSpots:" + ProposalForMatching[n].totalSpots;
            FinalMatchedProposals.push(ProposalForMatching[n]);
        }
    }//Added below line for ST-710//Added for ST-710
    AddUserJourneyEntryChooseMatch(currentJsonSelectedForImport[currentFileIndex].clientId, currentJsonSelectedForImport[currentFileIndex].networkId,
        currentJsonSelectedForImport[currentFileIndex].quarterName, "ChooseMatchesScreen", proposalId, currentJsonSelectedForImport[currentFileIndex].deal, currentJsonSelectedForImport[currentFileIndex].sourceFile, "ConfirmMatch", ChooseMatchDescription);
    setTimeout(function () { BindConfirmMatchScreenData(FinalMatchedProposals); }, 500);
    setTimeout(function () { HideOverlayPopupConfirmMatch(); }, 4000);

}

//Added below function for ST-710
function AddUserJourneyEntryChooseMatch(clientId, networkId, quarterName,screenName, proposalId, deal, sourcefile, action, description) {
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
            //if (result != null) {
            //}
        },
        error: function (response) {
        }
    });
}