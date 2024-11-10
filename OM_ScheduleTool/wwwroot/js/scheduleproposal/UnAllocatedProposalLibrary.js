var ImportPropsalsJson;
var SingleMatchPropsalsJson;
var MultiMatchPropsalsJson;
var PotentialMatchPropsalsJson;
var SelQtrJson;
var UnMatchPropsalsJson;
var ArchivedProposalsJson;
var ProcessedProposalsJson; // ST-691
var SelectedProposalsJson;
var SelectedProposal;
var SelectedProposalNo;
var SelTab = 1;
var currentFileIndex = 0;

var CurrentNetworkId = 0;
var PreviousNetworkId = 0;
var TotalCount = 0;
var CurrentCount = 0;
var Screenparam1 = "";
var screenParam2 = "";
var ScreenParam3 = "";
var screenMode = "";
var NetworkName = [];
var NetworkNameArc = [];
var SelectedValue = []; //ST-724
var FilterData = null;
var FilterDataArchived = null;
var SelProposalId = 0;
var IgnoredFilesToProcess = new Array();
var CompletedFiles = new Array();
var networkDropDownHtml = "";
var lockedProposalId = 0;
var ProposalsNetworkList;
$(document).ready(function () {
    $("#ddlNetworksUnallocated").html("");
    $("#ddlNetworksArchived").html("");
    $("#ddlNetworksProcessed").html(""); //ST-691
    currentFileIndex = 0;
    if ($.fn.dataTable.isDataTable('#UnAllocatedProposalsTable')) {
        $('#UnAllocatedProposalsTable').DataTable().clear().destroy();
        $('#UnAllocatedProposalsTable tbody').html("");
    }
    if ($.fn.dataTable.isDataTable('#ArchivedProposalTable')) {
        $('#ArchivedProposalTable').DataTable().clear().destroy();
        $('#ArchivedProposalTable tbody').html("");
    }
    //ST-691 Added
    if ($.fn.dataTable.isDataTable('#ProcessedProposalTable')) {
        $('#ProcessedProposalTable').DataTable().clear().destroy();
        $('#ProcessedProposalTable tbody').html("");
    }
    // $('.js-dataTable-full').DataTable();
});
function ShowOverlayPopup() {
    document.getElementById("DivOverLayPopoup").style.display = "block";
}
function HideOverlayPopup() {
    document.getElementById("DivOverLayPopoup").style.display = "none";
}

function ProposalAutomation_UnlockScheduleProposal() {
    if (lockedProposalId == 0) {
        window.location.reload();
    }
    else {
        var _url = "/ScheduleProposal/Unlock/";
        var _Id = lockedProposalId;

        if (_Id > 0) {
            $.ajax({
                url: _url,
                data: { ScheduleProposalId: _Id },
                cache: false,
                type: "POST",
                success: function (result) {
                    if (result.success == true) {
                        window.location.reload();
                    }
                    else {
                        if (result.success == undefined) {
                            swal('Error!', "Unexpected error occured! Please try again.", 'error');
                        }
                        else {
                            swal('Wait!', result.responseText, 'warning');
                        }
                    }
                },
                error: function (response) {
                    swal('Error!', response.responseText, 'warning');
                }
            });
        }
        else {
            swal('Error!', "Can't Unlock the Proposal because Id is 0", 'warning');
        }
    }
}
var alreadyLocked = 0;  //HM ST-797
function ProposalAutomation_LockScheduleProposal(param1, param2, param3, Mode, checktype) {
    lockedProposalId = param1;
    var url = "/ScheduleProposal/FullyLockProposal/";
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
    $.ajax({
        url: url,
        data: { proposalId: param1, clientid: _selClientid },
        cache: false,
        type: "POST",
        success: function (result) {
            if (result.success == true) {
                alreadyLocked = 1;
                setTimeout(function () { CheckUnAllocationProposals(param1, param2, param3, Mode, checktype); }, 1000);
            }
            else {
                if (result.success == undefined) {
                    swal('Error!', "Unexpected error occured! Please try again.", 'error');
                }
                else {
                    swal({
                        title: "Wait",
                        html: result.responseText,
                        type: 'warning',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Ok',
                        showLoaderOnConfirm: true,
                        allowOutsideClick:false,
                        preConfirm: function () {
                            return new Promise(function (resolve) {
                                setTimeout(function () {
                                    window.location.reload();
                                }, 50);
                            });
                        }
                    });
                }
            }
        },
        error: function (response) {
            swal('Error!', response.responseText, 'warning');
        }
    });
}

function proceedToUnallocatedProposals(param1, param2, param3, Mode, checktype) {
    ProposalAutomation_LockScheduleProposal(param1, param2, param3, Mode, checktype);
}

function CheckUnAllocationProposals(param1, param2, param3, Mode, checktype) {

    $("#tbodyUnAllocatedProposals").hide();
    if (Mode.toLowerCase() == "edit" || Mode.toLowerCase() == "create") {
        screenMode = Mode;
    }
    if (param1 != "") {
        Screenparam1 = param1;
    }
    if (param2 != "") {
        Screenparam2 = param2;
    }
    if (param3 != "") {
        Screenparam3 = param3;
    }
    currentFileIndex = 0;
    ShowOverlayPopup();
    var unAllocatedProposals = 0;
    var ArchivedProposals = 0;
    if (Mode.toLowerCase() != "edit" && Mode.toLowerCase() != "create") {
        setTimeout(function () { BindUnAllocatedProposals(checktype) }, 1000);
    }
    else if (_UnAllocatedImportScreenOpen)
    {
        setTimeout(function () { BindUnAllocatedProposals(checktype) }, 1000);
        _UnAllocatedImportScreenOpen = false;
    }
    else {
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
            url: '/ScheduleProposal/CheckAvailableUnAllocatedProposalsData',
            type: "GET",
            async: false,
            data: {
                "ClientId": _selClientid,
                "QuarterName": _selQtr,
                "Archived": false,
                "Mode": Mode
            },
            success: function (result) {
                UnAllocatedProposalsJson = result.proposals;
                if (UnAllocatedProposalsJson != null && UnAllocatedProposalsJson.length > 0) {
                    unAllocatedProposals = UnAllocatedProposalsJson[0].totalProposals;
                    ArchivedProposals= UnAllocatedProposalsJson[0].totalArchived;
                    if (parseInt(unAllocatedProposals) > 0 || parseInt(ArchivedProposals)>0) {
                        CanProceedNormal = false;
                    }
                    else {
                        CanProceedNormal = true;
                    }
                }
                else {
                    CanProceedNormal = true;
                }
            },
            error: function (response) {
            }
        });
        if (CanProceedNormal) {
            HideOverlayPopup();
            if (Mode.toString().toLowerCase() == "create") {
                CreateProposal(param1);
                return false;
            }
            if (Mode.toString().toLowerCase() == "edit") {
                OpenProposal(param1, param2, param3);
                // OpenNewWindow(screen.height, screen.width, "", "");
                return false;
            }
        }
        else {
            if (Mode.toString().toLowerCase() == "edit" || Mode.toString().toLowerCase() == "create") {
                if (parseInt(unAllocatedProposals) == parseInt(ArchivedProposals)) {
                    var Titleval = "";
                    if (parseInt(ArchivedProposals) == 1)
                        Titleval = " There is 1 file ";
                    else
                        Titleval = " There are " + ArchivedProposals + " files ";
                    swal({
                        title: "",
                        html: 'No new proposals are available for processing. ' + Titleval + ' in the archived folder.',
                        // html: SelNetworkNames.replace(/,/g, '<br/>') + '<br/><br/>  Are you sure you want to proceed?',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        allowOutsideClick: false,
                        cancelButtonColor: '#d33',
                        cancelButtonText: "No, proceed to " + Mode.toLowerCase() + " Proposal",
                        confirmButtonText: 'Yes, show the archived Proposals',
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
                            $('#modal-UnAllocatedProposals').modal({ backdrop: 'static', keyboard: false }, 'show');
                            setTimeout(function () { CheckArchivedUnAllocationProposals("archived") }, 1000);
                        }, function (dismiss) {
                            // dismiss can be 'cancel', 'overlay', 'esc' or 'timer'
                            CanProceedNormal = true;
                            //HideOverlayPopup();
                            if (Mode.toString().toLowerCase() == "create") {
                                CreateProposal(param1);
                                return false;
                            }
                            if (Mode.toString().toLowerCase() == "edit") {
                                OpenProposal(param1, param2, param3);
                                // OpenNewWindow(screen.height, screen.width, "", "");
                                return false;
                            }
                        }
                    );
                }
                else {
                    $('#modal-UnAllocatedProposals').modal({ backdrop: 'static', keyboard: false }, 'show');
                    //setTimeout(function () { BindUnAllocatedProposals() }, 1000);
                    setTimeout(function () { ShowUnAllocatedProposals("all",0) }, 1000);
                }
            }
        }
    }
}

function BindUnAllocatedProposals(checkMode) {
    CurrentNetworkId = 0;
    PreviousNetworkId = 0;
    TotalCount = 0;
    CurrentCount = 0;
    currentFileIndex = 0;
    var ignoredJson = null;
    $("#chkSelectAllUnAllocated").prop("checked", false);
    $("#chkSelectAllArchived").prop("checked", false);
    $("#HeadingData").html("Unallocated Proposals : " + $("#ddlclients :selected").text() + " - " + ($(".nav-link.active").html().split(' ')[0]).toString().substring(2, 1) + "Q" + $(".nav-link.active").html().split(' ')[1]);

    var filterredJson = new Array();
    var curProps = UnAllocatedProposalsJson;
    if (IgnoredFilesToProcess != null && IgnoredFilesToProcess != undefined && IgnoredFilesToProcess.length > 0) {
        for (var v = 0; v < IgnoredFilesToProcess.length; v++) {
            var curPropsData = curProps;
            curProps = $.grep(curPropsData, function (value) {
                return value != IgnoredFilesToProcess[v];
            });
        }
        //   filterredJson.push(UnAllocatedProposalsJson[x]);
    }

    if (CompletedFiles != null && CompletedFiles != undefined && CompletedFiles.length > 0) {
        for (var v = 0; v < CompletedFiles.length; v++) {
            var completedFilesProps = UnAllocatedProposalsJson;
            UnAllocatedProposalsJson = $.grep(completedFilesProps, function (value) {
                return value != CompletedFiles[v];
            });
        }        
    }
    console.log(curProps);
    ignoredJson = curProps;
    var ignoredCount = ignoredJson.filter(o => o.ignored).length + UnAllocatedProposalsJson.filter(o => o.archived).length;
    if (ignoredCount == ignoredJson.length) {
        if (checkMode == 0) {
            $("#modal-UnAllocatedProposals").modal('hide');
            if (screenMode.toString().toLowerCase() == "create") {
                CreateProposal(Screenparam1);
                return false;
            }
            if (screenMode.toString().toLowerCase() == "edit") {
                OpenProposal(Screenparam1, Screenparam2, Screenparam3);
                return false;
            }
        }
        else {
            Init_UnAllocatedProposals();
        }
    }
    else {
        Init_UnAllocatedProposals();
    }
}

function BindArchivedProposals() {

    $("#HeadingData").html("Archived Proposals : " + $("#ddlclients :selected").text() + " - " + ($(".nav-link.active").html().split(' ')[0]).toString().substring(2, 1) + "Q" + $(".nav-link.active").html().split(' ')[1]);
    $("#ImportHeadingData").html("Import Proposals : " + $("#ddlclients :selected").text() + " - " + ($(".nav-link.active").html().split(' ')[0]).toString().substring(2, 1) + "Q" + $(".nav-link.active").html().split(' ')[1]);
    Init_ArchivedProposals();
}
var unAllocatedPropTable = null;
var unAllocatedFilteredHtml = "";
function Init_UnAllocatedProposals() {
    if ($.fn.dataTable.isDataTable('#UnAllocatedProposalsTable'))
        unAllocatedPropTable =  $('#UnAllocatedProposalsTable').DataTable().clear().destroy();
    var HTML = "";
    NetworkName = [];
    // Bind the Distinct NetworkName in ddlNetworks
    var HTMLNetworks = "";
    // if ($("#ddlNetworksUnallocated").html() == "") {
    $("#ddlNetworksUnallocated").html("<option value='-1'>All </option>");
    //}
    var unique = UnAllocatedProposalsJson.filter(function (itm, i, a) {
        if (!itm.archived) {
            var ObjNetwork = { "NetworkId": itm.networkId, "NetworkName": itm.networkName }
            var index = NetworkName.findIndex(x => x.NetworkId === itm.networkId && x.NetworkName === itm.networkName);
            if (index < 0) {
                NetworkName.push(ObjNetwork);
                HTMLNetworks += "<option value=" + ObjNetwork.NetworkId + ">" + ObjNetwork.NetworkName + " </option>"
            }
        }
    });
    $("#ddlNetworksUnallocated").append(HTMLNetworks);
    // $("#ddlNetworksUnallocated").hide();
    var _selCntid = 5;
    if ($('#US').is(':checked')) {
        _selCntid = 5;
    }
    else if ($('#CA').is(':checked')) {
        _selCntid = 2;
    }
    var _selClid = $("#ddlclients :selected").val();
    //alert(_selClientid);
    var _selQtrData = ($(".nav-link.active").html().split(' ')[0]).toString().substring(2, 1) + "Q" + $(".nav-link.active").html().split(' ')[1];
    //var CurJsonData = SelectedProposalsJson != undefined || SelectedProposalsJson != null  ? SelectedProposalsJson : UnAllocatedProposalsJson;
    var CurJsonData = UnAllocatedProposalsJson;
    for (var x = 0; x < CurJsonData.length; x++) {
        HTML = HTML + '';
        //if (!CurJsonData[x].ignored && !CurJsonData[x].archived) {
        var dt = CurJsonData[x].processedDate.toString().split("-");
        var processedDt = dt[1] + "/" + dt[2].split("T")[0] + "/" + dt[0];       
        var titleForProcessedDeals = CurJsonData[x].isDealProcessed ? 'A deal file with this number has already been processed on ' + processedDt + '. You may still process this file, but it may result in duplication.' : "";
        if (!CurJsonData[x].archived) {
            HTML = HTML + '<tr id="trNetwork_' + CurJsonData[x].networkId + '" class="' + CurJsonData[x].selectionType + '" file-name="' + CurJsonData[x].sourceFile + '">';
            HTML = HTML + '<td class="text-center"  style="width:180px;!important;" id="tdNetwork_' + CurJsonData[x].networkId + '" title="' + titleForProcessedDeals + '">' + CurJsonData[x].networkName + (CurJsonData[x].isDealProcessed ? ' <i class="fa fa-info-circle" style="color: #42a5f5;"></i>' : "") + '</td>';
            HTML = HTML + '<td class="text-center " style="width:110px;!important;"> <span style="color: #42a5f5;text-decoration: underline; cursor:pointer;" onclick="downloadDealpoint(\'' + _selClid + '\',\'' + _selQtrData + '\',\'' + CurJsonData[x].networkId + '\',\'' + CurJsonData[x].sourceFile + '\',\'' + _selCntid + '\',\'' + CurJsonData[x].clientName + '\',\'' + CurJsonData[x].networkName + '\');" netid-val=' + CurJsonData[x].networkId + ' filename-val="' + CurJsonData[x].sourceFile + '"   style="height:20px;width:20px;text-decoration: underline;" title="Deal: ' + CurJsonData[x].deal + '">' + CurJsonData[x].deal.toString().substring(0, 12) + " (" + CurJsonData[x].revision + ")" + '</span>';
            HTML = HTML + '<td class="text-center" style="width:270px;!important;"> ' + CurJsonData[x].receivedDate + '</td> ';
            HTML = HTML + '<td class="text-center" style="width:100px;!important;"> ' + CurJsonData[x].spots + '</td> ';
            HTML = HTML + '<td class="text-center" style="width:150px;!important;"> ' + $.fn.dataTable.render.number(',', '.', 2, '$').display(CurJsonData[x].totalDollars) + '</td> ';
            HTML = HTML + '<td class="text-center" style="width:100px;!important;"> ' + CurJsonData[x].imps + '</td> ';
            HTML = HTML + '<td class="text-center" style="width:100px;!important;"> ' + $.fn.dataTable.render.number(',', '.', 2, '$').display(CurJsonData[x].cpm) + '</td> ';
            HTML = HTML + '<td class="text-center " style="dislplay:flex;width:220px!important;">';
            HTML = HTML + '<select style="margin-left:57px;" onchange="return CheckSelectionType(this);" file-name="' + CurJsonData[x].sourceFile + '" id="ddlSelectionType_' + x + '" network-id="' + CurJsonData[x].networkId + '" file-name="' + CurJsonData[x].sourceFile + '"><option value="add">Add</option><option value="ignore" selected>Ignore</option><option value="replace">Replace</option></select>';
            HTML = HTML + '<span style="color: #42a5f5;text-decoration: underline; cursor:pointer; padding-left:10px;height:20px;width:60px;text-decoration: underline;" id="btnArchive_' + x + '" network-id="' + CurJsonData[x].networkId + '" file-name="' + CurJsonData[x].sourceFile + '" onclick="ArchiveSingleProposal(this)" data-type="view">Archive</span>';
            HTML = HTML + '</td>';
            HTML = HTML + '</tr>';
        }
    }
    $("#tbodyUnAllocatedProposals").html(HTML);
    unAllocatedPropTable = $('#UnAllocatedProposalsTable').DataTable({
        lengthMenu: [[20, 50, 75, 100], [20, 50, 75, 100]],
        'processing': true,
        'autoWidth': false,
        'scrollX': false,
        scrollCollapse: false,
        "rowHeight": '25px',
        "sDom": 'Rfrtlip',
        // dom: '<"bottom"i>rt<"bottom"flp>',
        "order": [],
        'columnDefs': [{
            'targets': [7], // column index (start from 0)
            'orderable': false// set orderable false for selected columns
        }],
        initComplete: function (settings, json) {
            $("#UnAllocatedProposalsTable_wrapper").prepend('<label  style="margin-top:10px;margin-left:15px;">Network:<select id="ddlNetworksUnallocated2" onchange="FilterUnAllocatedProposals2();" style="margin-left:5px;" placeholder=""></select></label>');
            $("#ddlNetworksUnallocated2").html($("#ddlNetworksUnallocated").html());

        }

    });
    $("#UnAllocatedProposalsTable_info").text("Showing " + CurJsonData.filter(a => a.archived == false).length + " of " + CurJsonData.filter(a => a.archived == false).length + " entries");

    //$("#UnAllocatedProposalsTable th").css("width", "150px!important");
    $($("#UnAllocatedProposalsTable th")[0]).width("180px");
    $($("#UnAllocatedProposalsTable th")[1]).width("110px");
    $($("#UnAllocatedProposalsTable th")[2]).width("270px");
    $($("#UnAllocatedProposalsTable th")[3]).width("100px");
    $($("#UnAllocatedProposalsTable th")[4]).width("150px");
    $($("#UnAllocatedProposalsTable th")[5]).width("100px");
    $($("#UnAllocatedProposalsTable th")[6]).width("100px");
    $($("#UnAllocatedProposalsTable th")[7]).width("220px");

    $("#UnAllocatedProposalsTable_info").css("float", "right");
    $("#UnAllocatedProposalsTable_info").css("margin-top", "-42px");
    $("#UnAllocatedProposalsTable_paginate").css("float", "left");
    $("#UnAllocatedProposalsTable_paginate").css("margin-top", "-42px");
    $("#UnAllocatedProposalsTable_length").css("margin-left","50%");

    setTimeout(function () {
        // $("#modal-UnAllocatedProposals").css("max-height", window.innerHeight - 150);
        $("#UnAllocatedProposalsTable").closest("div").css("max-height", window.innerHeight - 350);
        $("#UnAllocatedProposalsTable").closest("div").css("overflow-y", "auto");
        $("#UnAllocatedProposalsTable").closest("div").css("overflow-x", "hidden");
        SetGridData(1);
        $("#tbodyUnAllocatedProposals").show();
        //HideOverlayPopup();
        //FilterUnAllocatedProposals();
    }, 500);
    setTimeout(function () { HideOverlayPopup(); }, 2000);
    //hunain start
    unAllocatedPropTable.on('length', function (e, settings, len) {
        var selectedNetwork = $("#ddlNetworksUnallocated2 option:selected").val();
        $("#tbodyUnAllocatedProposals").hide();
        ShowOverlayPopup();
        unAllocatedFilteredHtml = "";

        //var selectedUnallocJson = SelectedProposalsJson != undefined || SelectedProposalsJson != null ? SelectedProposalsJson : UnAllocatedProposalsJson;
        //var CurJsonData = selectedNetwork == -1 ? selectedUnallocJson : selectedUnallocJson.filter(o => o.networkId == selectedNetwork);
        var CurJsonData = selectedNetwork == -1 ? UnAllocatedProposalsJson : UnAllocatedProposalsJson.filter(o => o.networkId == selectedNetwork);
        var length = len > CurJsonData.length || len == -1 ? CurJsonData.length : len;
        for (var x = 0; x < length; x++) {
            unAllocatedFilteredHtml = unAllocatedFilteredHtml + '';
            var dt = CurJsonData[x].processedDate.toString().split("-");
            var processedDt = dt[1] + "/" + dt[2].split("T")[0] + "/" + dt[0];
            var titleForProcessedDeals = CurJsonData[x].isDealProcessed ? 'A deal file with this number has already been processed on ' + processedDt + '. You may still process this file, but it may result in duplication.' : "";
            //if (!CurJsonData[x].ignored && !CurJsonData[x].archived) {
            if (!CurJsonData[x].archived) {
                unAllocatedFilteredHtml = unAllocatedFilteredHtml + '<tr id="trNetwork_' + CurJsonData[x].networkId + '" class="' + CurJsonData[x].selectionType + '" file-name="' + CurJsonData[x].sourceFile + '">';
                unAllocatedFilteredHtml = unAllocatedFilteredHtml + '<td class="text-center"  style="width:180px;!important;" id="tdNetwork_' + CurJsonData[x].networkId + '" title="' + titleForProcessedDeals + '">' + CurJsonData[x].networkName + (CurJsonData[x].isDealProcessed ? ' <i class="fa fa-info-circle" style="color: #42a5f5;"></i>' : "") + '</td>';
                unAllocatedFilteredHtml = unAllocatedFilteredHtml + '<td class="text-center " style="width:110px;!important;"> <span style="color: #42a5f5;text-decoration: underline; cursor:pointer;" onclick="downloadDealpoint(\'' + _selClid + '\',\'' + _selQtrData + '\',\'' + CurJsonData[x].networkId + '\',\'' + CurJsonData[x].sourceFile + '\',\'' + _selCntid + '\',\'' + CurJsonData[x].clientName + '\',\'' + CurJsonData[x].networkName + '\');" netid-val=' + CurJsonData[x].networkId + ' filename-val="' + CurJsonData[x].sourceFile + '"   style="height:20px;width:20px;text-decoration: underline;" title="Deal: ' + CurJsonData[x].deal + '">' + CurJsonData[x].deal.toString().substring(0, 12) + " (" + CurJsonData[x].revision + ")" + '</span>';
                unAllocatedFilteredHtml = unAllocatedFilteredHtml + '<td class="text-center" style="width:270px;!important;"> ' + CurJsonData[x].receivedDate + '</td> ';
                unAllocatedFilteredHtml = unAllocatedFilteredHtml + '<td class="text-center" style="width:100px;!important;"> ' + CurJsonData[x].spots + '</td> ';
                unAllocatedFilteredHtml = unAllocatedFilteredHtml + '<td class="text-center" style="width:150px;!important;"> ' + $.fn.dataTable.render.number(',', '.', 2, '$').display(CurJsonData[x].totalDollars) + '</td> ';
                unAllocatedFilteredHtml = unAllocatedFilteredHtml + '<td class="text-center" style="width:100px;!important;"> ' + CurJsonData[x].imps + '</td> ';
                unAllocatedFilteredHtml = unAllocatedFilteredHtml + '<td class="text-center" style="width:100px;!important;"> ' + $.fn.dataTable.render.number(',', '.', 2, '$').display(CurJsonData[x].cpm) + '</td> ';
                unAllocatedFilteredHtml = unAllocatedFilteredHtml + '<td class="text-center " style="dislplay:flex;width:220px!important;">';
                unAllocatedFilteredHtml = unAllocatedFilteredHtml + '<select style="margin-left:57px;" onchange="return CheckSelectionType(this);" file-name="' + CurJsonData[x].sourceFile + '" id="ddlSelectionType_' + x + '" network-id="' + CurJsonData[x].networkId + '" file-name="' + CurJsonData[x].sourceFile + '"><option value="add">Add</option><option value="ignore" selected>Ignore</option><option value="replace">Replace</option></select>';
                unAllocatedFilteredHtml = unAllocatedFilteredHtml + '<span style="color: #42a5f5;text-decoration: underline; cursor:pointer; padding-left:10px;height:20px;width:60px;text-decoration: underline;" id="btnArchive_' + x + '" network-id="' + CurJsonData[x].networkId + '" file-name="' + CurJsonData[x].sourceFile + '" onclick="ArchiveSingleProposal(this)" data-type="view">Archive</span>';
                unAllocatedFilteredHtml = unAllocatedFilteredHtml + '</td>';
                unAllocatedFilteredHtml = unAllocatedFilteredHtml + '</tr>';
            }
        }
        setTimeout(function () {
            $("#tbodyUnAllocatedProposals").empty();
            $("#tbodyUnAllocatedProposals").html(unAllocatedFilteredHtml);
            var filteredLength = len > CurJsonData.filter(a => a.archived == false).length ? CurJsonData.filter(a => a.archived == false).length : len;
            $("#UnAllocatedProposalsTable_info").text("Showing " + filteredLength  + " of " + UnAllocatedProposalsJson.filter(a => a.archived == false).length + " entries");
            selectedNetwork == -1 ? SetGridData(1) : SetGridData(2);
            $("#tbodyUnAllocatedProposals").show();
            HideOverlayPopup();
        }, 300);
    });
}

function downloadDealpointFile(url) {
    var iframe = document.createElement("iframe");
    iframe.src = url;
    iframe.style.display = "none";
    document.body.appendChild(iframe);
}

function downloadDealpoint(clientId, qtrData, networkId, srcFileName, countryId, clientName, networkName) {
    //try {
    //    $.ajax({
    //        url: "/UpfrontRemnant/IsSessionActive",
    //        cache: false,
    //        type: "POST",
    //        success: function (result) {
    //            if (result.success === false) {
    //                window.location.replace("/StatusCode/408");
    //            }
    //            else {
    try {
        var url = "/ManageMedia/ExportRawProposals?ClientId=" + clientId + "&QuarterName=" + qtrData + "&NetworkId=" + networkId + "&SourceFileName=" + srcFileName + "&CountryId=" + countryId + "&ClientName=" + clientName + "&NetworkName=" + networkName
        window.setTimeout(function () {
            downloadDealpointFile(url)
        }, 2000);
    }
    catch (err) {
        swal({
            title: "Error",
            text: err,
            type: 'error',
        });
    }
    //            }
    //        },
    //        error: function (response) {                
    //            swal({
    //                title: "Error",
    //                text: "Unexpected error occured. Please refresh the page and retry.",
    //                type: 'error',
    //            });
    //        }
    //    });
    //}
    //catch (err) {
    //    swal({
    //        title: "Error",
    //        text: err,
    //        type: 'error',
    //    });
    //}

}

$("#btnDRClose,#btnDRCloseAll,#btnDRCloseTop,#btnCloseImport,#btnCloseImport2").on("click", function () {
    SelectedProposalsJson = null;
    ProposalAutomation_UnlockScheduleProposal();
});

function preventHref() {
    return false;
}
//hunain end
var archivedPropTable = null;
var archivedFilteredHtml = "";
function Init_ArchivedProposals() {
    if ($.fn.dataTable.isDataTable('#ArchivedProposalTable'))
        archivedPropTable = $('#ArchivedProposalTable').DataTable().clear().destroy();
    var HTML = "";
    // Bind the Distinct NetworkName in ddlNetworks
    //if ($("#ddlNetworksArchived").html() == "") {
    $("#ddlNetworksArchived").html("<option value='-1'>All </option>");
    //}

    var HTMLNetworks = "";
    NetworkName = [];
    var uniqueArc = ArchivedProposalsJson.filter(function (itm, i, a) {
        var ObjNetworkArc = { "NetworkId": itm.networkId, "NetworkName": itm.networkName }
        var indexArc = NetworkName.findIndex(x => x.NetworkId === itm.networkId && x.NetworkName === itm.networkName);
        if (indexArc < 0) {
            NetworkName.push(ObjNetworkArc);
            HTMLNetworks += "<option value=" + ObjNetworkArc.NetworkId + ">" + ObjNetworkArc.NetworkName + " </option>";
        }
    });
    $("#ddlNetworksArchived").append(HTMLNetworks);
    var _selCntid = 5;
    if ($('#US').is(':checked')) {
        _selCntid = 5;
    }
    else if ($('#CA').is(':checked')) {
        _selCntid = 2;
    }
    var _selClid = $("#ddlclients :selected").val();
    //alert(_selClientid);
    var _selQtrData = ($(".nav-link.active").html().split(' ')[0]).toString().substring(2, 1) + "Q" + $(".nav-link.active").html().split(' ')[1];
    for (var x = 0; x < ArchivedProposalsJson.length; x++) {
        HTML = HTML + '';
        HTML = HTML + '<tr id="trNetwork_' + ArchivedProposalsJson[x].networkId + '" class="' + ArchivedProposalsJson[x].selectionType + '" file-name="' + ArchivedProposalsJson[x].sourceFile + '">';
        /*HTML = HTML + '<td class="text-center"><input type="hidden" value="' + ArchivedProposalsJson[x].sourceFile + '"/><input type="checkbox" onchange= "return Addnetworktolist(this)" class="networkval" name="select_all" value="' + ArchivedProposalsJson[x].networkId + '-' + ArchivedProposalsJson[x].sourceFile + '" id="' + ArchivedProposalsJson[x].networkId + '-' + ArchivedProposalsJson[x].sourceFile + '"/></td>';*/
        HTML = HTML + '<td class="text-center"  style="width:180px;!important;" id="tdNetwork_' + ArchivedProposalsJson[x].networkId + '">' + ArchivedProposalsJson[x].networkName + '</td>';
        HTML = HTML + '<td class="text-center " style="width:110px;!important;"> <span style="color: #42a5f5;text-decoration: underline; cursor:pointer;" onclick="downloadDealpoint(\'' + _selClid + '\',\'' + _selQtrData + '\',\'' + ArchivedProposalsJson[x].networkId + '\',\'' + ArchivedProposalsJson[x].sourceFile + '\',\'' + _selCntid + '\',\'' + ArchivedProposalsJson[x].clientName + '\',\'' + ArchivedProposalsJson[x].networkName + '\');" netid-val=' + ArchivedProposalsJson[x].networkId + ' filename-val="' + ArchivedProposalsJson[x].sourceFile + '" title="Export" tooltip="Export"   style="padding-left:10px;height:20px;width:60px;text-decoration: underline;">' + ArchivedProposalsJson[x].deal + " (" + ArchivedProposalsJson[x].revision + ")" + '</span>';
        HTML = HTML + '<td class="text-center" style="width:270px;!important;"> ' + ArchivedProposalsJson[x].receivedDate + '</td> ';
        HTML = HTML + '<td class="text-center" style="width:100px;!important;"> ' + ArchivedProposalsJson[x].spots + '</td> ';
        HTML = HTML + '<td class="text-center" style="width:150px;!important;"> ' + $.fn.dataTable.render.number(',', '.', 2, '$').display(ArchivedProposalsJson[x].totalDollars) + '</td> ';
        HTML = HTML + '<td class="text-center" style="width:100px;!important;"> ' + ArchivedProposalsJson[x].imps + '</td> ';
        HTML = HTML + '<td class="text-center" style="width:100px;!important;"> ' + $.fn.dataTable.render.number(',', '.', 2, '$').display(ArchivedProposalsJson[x].cpm) + '</td> ';
        //HTML = HTML + '<td class="text-center"> ' + $.fn.dataTable.render.number(',', '.', 2, '$').display(ArchivedProposalsJson[x].cpm) + '</td> ';
        HTML = HTML + '<td class="text-center " style="dislplay:flex;width:220px!important;">';
        HTML = HTML + '<select style="margin-left:70px;" disabled><option value="add">Add</option><option value="ignore" selected>Ignore</option><option value="replace">Replace</option></select>';
        /*HTML = HTML + '<input type="button" style="padding:5px;margin-left:5px;height:15px!important;" id="btnUnArchive_' + x + '" network-id="' + ArchivedProposalsJson[x].networkId + '" file-name="' + ArchivedProposalsJson[x].sourceFile + '" value="Unarchive" class="btn btn-alt-primary" onclick="UnArchiveSingleProposal(this)" data-type="view" />';*/
        HTML = HTML + '<span style="color: #42a5f5;text-decoration: underline; cursor:pointer;padding-left:10px;height:20px;width:60px;text-decoration: underline;" id="btnUnArchive_' + x + '" network-id="' + ArchivedProposalsJson[x].networkId + '" file-name="' + ArchivedProposalsJson[x].sourceFile + '" onclick="UnArchiveSingleProposal(this)" data-type="view">Unarchive</span>';
        HTML = HTML + '</td>';
        HTML = HTML + '</tr>';


    }
    $("#tbodyArchivedProposal").html(HTML);
    archivedPropTable = $('#ArchivedProposalTable').DataTable({
        lengthMenu: [[20, 50, 75, 100], [20, 50, 75, 100]],
        'processing': true,
        'autoWidth': false,
        "sDom": 'Rfrtlip',
        // dom: '<"bottom"i>rt<"bottom"flp>',
        "order": [],
        "rowHeight": '25px',

        'columnDefs': [{
            'targets': [7], // column index (start from 0)
            'orderable': false// set orderable false for selected columns
        }],
        fixedColumns: {
            heightMatch: 'none'
        },
        initComplete: function (settings, json) {
            $("#ArchivedProposalTable_wrapper").prepend('<label style="margin-top:10px;margin-left:15px;">Network:<select id="ddlNetworksArchived2" onchange="FilterArchivedProposals2();"  style="margin-left:5px;" placeholder=""></select></label>');
            $("#ddlNetworksArchived2").html($("#ddlNetworksArchived").html());
            $("#ArchivedProposalTable tr td").css("background", "white");
        }
    });
    //$(".networkval").prop("checked", false);
    setTimeout(function () { HideOverlayPopup(); }, 2000);
    $("#ArchivedProposalTable_info").text("Showing " + ArchivedProposalsJson.filter(a => a.archived == true).length + " of " + ArchivedProposalsJson.filter(a => a.archived == true).length + " entries");
    $($("#ArchivedProposalTable th")[0]).width("180px");
    $($("#ArchivedProposalTable th")[1]).width("110px");
    $($("#ArchivedProposalTable th")[2]).width("270px");
    $($("#ArchivedProposalTable th")[3]).width("100px");
    $($("#ArchivedProposalTable th")[4]).width("150px");
    $($("#ArchivedProposalTable th")[5]).width("100px");
    $($("#ArchivedProposalTable th")[6]).width("100px");
    $($("#ArchivedProposalTable th")[7]).width("220px");

    $("#ArchivedProposalTable_info").css("float", "right");
    $("#ArchivedProposalTable_info").css("margin-top", "-42px");
    $("#ArchivedProposalTable_paginate").css("float", "left");
    $("#ArchivedProposalTable_paginate").css("margin-top", "-42px");
    $("#ArchivedProposalTable_length").css("margin-left", "50%");

    setTimeout(function () {
        $("#ArchivedProposalTable").closest("div").css("max-height", window.innerHeight - 350);
        $("#ArchivedProposalTable").closest("div").css("overflow-y", "auto");
        $("#ArchivedProposalTable").closest("div").css("overflow-x", "hidden");
        //FilterArchivedProposals();
    }, 1500);
    //hunain start
    archivedPropTable.on('length', function (e, settings, len) {
        var selectedNetwork = $("#ddlNetworksArchived2 option:selected").val();
        $("#tbodyArchivedProposal").hide();
        ShowOverlayPopup();
        archivedFilteredHtml = "";
        var CurArcJsonData = selectedNetwork == -1 ? ArchivedProposalsJson.filter(o => o.archived == true) : ArchivedProposalsJson.filter(o => o.archived == true && o.networkId == selectedNetwork);
        var length = len > CurArcJsonData.length || len == -1 ? CurArcJsonData.length : len;
        for (var x = 0; x < length; x++) {
            archivedFilteredHtml = archivedFilteredHtml + '';
            archivedFilteredHtml = archivedFilteredHtml + '<tr id="trNetwork_' + CurArcJsonData[x].networkId + '" class="' + CurArcJsonData[x].selectionType + '" file-name="' + CurArcJsonData[x].sourceFile + '">';
            /*archivedFilteredHtml = archivedFilteredHtml + '<td class="text-center"><input type="hidden" value="' + CurArcJsonData[x].sourceFile + '"/><input type="checkbox" onchange= "return Addnetworktolist(this)" class="networkval" name="select_all" value="' + CurArcJsonData[x].networkId + '-' + CurArcJsonData[x].sourceFile + '" id="' + CurArcJsonData[x].networkId + '-' + CurArcJsonData[x].sourceFile + '"/></td>';*/
            archivedFilteredHtml = archivedFilteredHtml + '<td class="text-center"  style="width:180px;!important;" id="tdNetwork_' + CurArcJsonData[x].networkId + '">' + CurArcJsonData[x].networkName + '</td>';
            archivedFilteredHtml = archivedFilteredHtml + '<td class="text-center " style="width:110px;!important;"> <span style="color: #42a5f5;text-decoration: underline; cursor:pointer;" onclick="downloadDealpoint(\'' + _selClid + '\',\'' + _selQtrData + '\',\'' + ArchivedProposalsJson[x].networkId + '\',\'' + ArchivedProposalsJson[x].sourceFile + '\',\'' + _selCntid + '\',\'' + ArchivedProposalsJson[x].clientName + '\',\'' + ArchivedProposalsJson[x].networkName + '\');" netid-val=' + CurArcJsonData[x].networkId + ' filename-val="' + CurArcJsonData[x].sourceFile + '" title="Export" tooltip="Export"   style="padding-left:10px;height:20px;width:60px;text-decoration: underline;">' + CurArcJsonData[x].deal + " (" + CurArcJsonData[x].revision + ")" + '</span>';
            archivedFilteredHtml = archivedFilteredHtml + '<td class="text-center" style="width:270px;!important;"> ' + CurArcJsonData[x].receivedDate + '</td> ';
            archivedFilteredHtml = archivedFilteredHtml + '<td class="text-center" style="width:100px;!important;"> ' + CurArcJsonData[x].spots + '</td> ';
            archivedFilteredHtml = archivedFilteredHtml + '<td class="text-center" style="width:150px;!important;"> ' + $.fn.dataTable.render.number(',', '.', 2, '$').display(CurArcJsonData[x].totalDollars) + '</td> ';
            archivedFilteredHtml = archivedFilteredHtml + '<td class="text-center" style="width:100px;!important;"> ' + CurArcJsonData[x].imps + '</td> ';
            archivedFilteredHtml = archivedFilteredHtml + '<td class="text-center" style="width:100px;!important;"> ' + $.fn.dataTable.render.number(',', '.', 2, '$').display(CurArcJsonData[x].cpm) + '</td> ';
            //archivedFilteredHtml = archivedFilteredHtml + '<td class="text-center"> ' + $.fn.dataTable.render.number(',', '.', 2, '$').display(CurArcJsonData[x].cpm) + '</td> ';
            archivedFilteredHtml = archivedFilteredHtml + '<td class="text-center " style="dislplay:flex;width:220px!important;">';
            archivedFilteredHtml = archivedFilteredHtml + '<select style="margin-left:70px;" disabled><option value="add">Add</option><option value="ignore" selected>Ignore</option><option value="replace">Replace</option></select>';
            /*archivedFilteredHtml = archivedFilteredHtml + '<input type="button" style="padding:5px;margin-left:5px;height:15px!important;" id="btnUnArchive_' + x + '" network-id="' + CurArcJsonData[x].networkId + '" file-name="' + CurArcJsonData[x].sourceFile + '" value="Unarchive" class="btn btn-alt-primary" onclick="UnArchiveSingleProposal(this)" data-type="view" />';*/
            archivedFilteredHtml = archivedFilteredHtml + '<span style="color: #42a5f5;text-decoration: underline; cursor:pointer; padding-left:10px;height:20px;width:60px;text-decoration: underline;" id="btnUnArchive_' + x + '" network-id="' + CurArcJsonData[x].networkId + '" file-name="' + CurArcJsonData[x].sourceFile + '" onclick="UnArchiveSingleProposal(this)" data-type="view">Unarchive</span>';
            archivedFilteredHtml = archivedFilteredHtml + '</td>';
            archivedFilteredHtml = archivedFilteredHtml + '</tr>';


        }
        setTimeout(function () {
            $("#tbodyArchivedProposal").empty();
            $("#tbodyArchivedProposal").html(archivedFilteredHtml);
            var filteredLength = len > CurArcJsonData.filter(a => a.archived == true).length ? CurArcJsonData.filter(a => a.archived == true).length : len;
            $("#ArchivedProposalTable_info").text("Showing " + filteredLength + " of " + ArchivedProposalsJson.filter(a => a.archived == true).length + " entries");
            selectedNetwork == -1 ? SetGridData(1) : SetGridData(2);
            $("#tbodyArchivedProposal").show();
            HideOverlayPopup();
        }, 300);
    });
    //hunain end
}

function FilterUnAllocatedProposals2() {
    $("#ddlNetworksUnallocated").val($("#ddlNetworksUnallocated2").val());
    networkDropDownHtml = $("#ddlNetworksUnallocated2").html();
    FilterUnAllocatedProposals();
}
function FilterUnAllocatedProposals() {

    if ($("#UlUnAllocatedProposals a.active-tab").html().toLowerCase() == "archived") {
        FilterArchivedProposals();
    }
    else {
        if ($.fn.dataTable.isDataTable('#UnAllocatedProposalsTable'))
            $('#UnAllocatedProposalsTable').DataTable().clear().destroy();
        var SelectNetID = $("#ddlNetworksUnallocated").val();

        FilterData = null;
        if (SelectNetID !== "-1") {
            FilterData = UnAllocatedProposalsJson.filter(x => parseInt(x.networkId) === parseInt(SelectNetID));
        }
        else {
            FilterData = UnAllocatedProposalsJson;
        }
        var _selCntid = 5;
        if ($('#US').is(':checked')) {
            _selCntid = 5;
        }
        else if ($('#CA').is(':checked')) {
            _selCntid = 2;
        }
        var _selClid = $("#ddlclients :selected").val();
        //alert(_selClientid);
        var _selQtrData = ($(".nav-link.active").html().split(' ')[0]).toString().substring(2, 1) + "Q" + $(".nav-link.active").html().split(' ')[1];
        var HTML = "";
        for (var x = 0; x < FilterData.length; x++) {
            var dt = FilterData[x].processedDate.toString().split("-");
            var processedDt = dt[1] + "/" + dt[2].split("T")[0] + "/" + dt[0];
            var titleForProcessedDeals = FilterData[x].isDealProcessed ? 'A deal file with this number has already been processed on ' + processedDt + '. You may still process this file, but it may result in duplication.' : "";

            //if (!FilterData[x].ignored && !FilterData[x].archived) {
            if (!FilterData[x].archived) {
                HTML = HTML + '';
                HTML = HTML + '<tr id="trNetwork_' + FilterData[x].networkId + '" class="' + FilterData[x].selectionType + '" file-name="' + FilterData[x].sourceFile + '">';
                /*HTML = HTML + '<td class="text-center"><input type="hidden" value="' + FilterData[x].sourceFile + '"/> <input type="checkbox" onchange= "return Addnetworktolist(this)" class="networkval" name="select_all" value="' + FilterData[x].networkId + '-' + FilterData[x].sourceFile + '" id="' + FilterData[x].networkId + '-' + FilterData[x].sourceFile + '"/></td>';*/
                HTML = HTML + '<td class="text-center" style="width:180px;!important;" id="tdNetwork_' + FilterData[x].networkId + '" title="' + titleForProcessedDeals + '">' + FilterData[x].networkName + (FilterData[x].isDealProcessed ? ' <i class="fa fa-info-circle" style="color: #42a5f5;"></i>' : "") + '</td>';
                HTML = HTML + '<td class="text-center " style="width:110px;!important;"> <span style="color: #42a5f5;text-decoration: underline; cursor:pointer;" onclick="downloadDealpoint(\'' + _selClid + '\',\'' + _selQtrData + '\',\'' + FilterData[x].networkId + '\',\'' + FilterData[x].sourceFile + '\',\'' + _selCntid + '\',\'' + FilterData[x].clientName + '\',\'' + FilterData[x].networkName + '\');" netid-val=' + FilterData[x].networkId + ' filename-val="' + FilterData[x].sourceFile + '" title="Export" tooltip="Export"   style="height:20px;width:20px;text-decoration: underline;">' + FilterData[x].deal + " (" + FilterData[x].revision + ")" + '</span>';
                HTML = HTML + '<td class="text-center" style="width:270px;!important;"> ' + FilterData[x].receivedDate + '</td> ';
                HTML = HTML + '<td class="text-center" style="width:100px;!important;"> ' + FilterData[x].spots + '</td> ';
                HTML = HTML + '<td class="text-center" style="width:150px;!important;"> ' + $.fn.dataTable.render.number(',', '.', 2, '$').display(FilterData[x].totalDollars) + '</td> ';
                HTML = HTML + '<td class="text-center" style="width:100px;!important;"> ' + FilterData[x].imps + '</td> ';
                HTML = HTML + '<td class="text-center" style="width:100px;!important;"> ' + $.fn.dataTable.render.number(',', '.', 2, '$').display(FilterData[x].cpm) + '</td> ';
                HTML = HTML + '<td class="text-center " style="display:flex;width:220px!important;">';
                HTML = HTML + '<select style="margin-left:57px;" onchange="return CheckSelectionType(this);" file-name="' + FilterData[x].sourceFile + '" id="ddlSelectionType_' + x + '" network-id="' + FilterData[x].networkId + '" file-name="' + FilterData[x].sourceFile + '"><option value="add">Add</option><option value="ignore" selected>Ignore</option><option value="replace">Replace</option></select>';
                // HTML = HTML + '<input type="button"  style="padding:5px;margin-left:5px;height:15px!important;" id="btnArchive_' + x + '" network-id="' + FilterData[x].networkId + '" file-name="' + FilterData[x].sourceFile + '" value="Archive" class="btn btn-alt-primary" onclick="ArchiveSingleProposal(this)" data-type="view" />';
                HTML = HTML + '<span style="color: #42a5f5;text-decoration: underline; cursor:pointer;padding-left:10px;height:20px;width:60px;text-decoration: underline;" id="btnArchive_' + x + '" network-id="' + FilterData[x].networkId + '" file-name="' + FilterData[x].sourceFile + '" onclick="ArchiveSingleProposal(this)" data-type="view">Archive</span>';
                HTML = HTML + '</td>';
                HTML = HTML + '</tr>';
            }
        }
        $("#tbodyUnAllocatedProposals").html(HTML);
        $('#UnAllocatedProposalsTable').DataTable({
            lengthMenu: [[20, 50, 75, 100], [20, 50, 75, 100]],
            'processing': true,
            'autoWidth': false,
            "rowHeight": '25px',
            "sDom": 'Rfrtlip',
            // dom: '<"bottom"i>rt<"bottom"flp>',
            "order": [],
            'columnDefs': [{
                'targets': [7], // column index (start from 0)
                'orderable': false// set orderable false for selected columns
            }],
            fixedColumns: {
                heightMatch: 'none'
            },
            initComplete: function (settings, json) {
                $("#UnAllocatedProposalsTable_wrapper").prepend('<label style="margin-top:10px;margin-left:15px;">Network:<select id="ddlNetworksUnallocated2" onchange="FilterUnAllocatedProposals2();"  style="margin-left:5px;" placeholder=""></select></label>');
                //$("#ddlNetworksUnallocated2").html($("#ddlNetworksUnallocated").html());
                $("#ddlNetworksUnallocated2").html(networkDropDownHtml);
                $("#ddlNetworksUnallocated2").val(SelectNetID);
                setTimeout(function () {
                    SetGridData(2);
                }, 500);
            }
        });
        $("#UnAllocatedProposalsTable_info").text("Showing " + FilterData.filter(a => a.archived == false).length + " of " + UnAllocatedProposalsJson.filter(a => a.archived == false).length + " entries");
        $($("#UnAllocatedProposalsTable th")[0]).width("180px");
        $($("#UnAllocatedProposalsTable th")[1]).width("110px");
        $($("#UnAllocatedProposalsTable th")[2]).width("270px");
        $($("#UnAllocatedProposalsTable th")[3]).width("100px");
        $($("#UnAllocatedProposalsTable th")[4]).width("150px");
        $($("#UnAllocatedProposalsTable th")[5]).width("100px");
        $($("#UnAllocatedProposalsTable th")[6]).width("100px");
        $($("#UnAllocatedProposalsTable th")[7]).width("220px");

        $("#UnAllocatedProposalsTable_info").css("float", "right");
        $("#UnAllocatedProposalsTable_info").css("margin-top", "-42px");
        $("#UnAllocatedProposalsTable_paginate").css("float", "left");
        $("#UnAllocatedProposalsTable_paginate").css("margin-top", "-42px");
        $("#UnAllocatedProposalsTable_length").css("margin-left", "50%");
        setTimeout(function () {
            $("#UnAllocatedProposalsTable").closest("div").css("max-height", window.innerHeight - 350);
            $("#UnAllocatedProposalsTable").closest("div").css("overflow-y", "auto");
            $("#UnAllocatedProposalsTable").closest("div").css("overflow-x", "hidden");
        }, 1500);

    }
}
//hunain start
function SetGridData(setOption) {
    var CurJson = setOption == 1 ? UnAllocatedProposalsJson.filter(o => o.archived == false) : FilterData != null ? FilterData.filter(o => o.archived == false) : null;
    if (CurJson == null) {
        return;
    }
    var RecordsToSet = $("#tbodyUnAllocatedProposals td select");
    for (var x = 0; x < RecordsToSet.length; x++) {
        var netId = $(RecordsToSet[x]).attr("network-id");
        var FilName = $(RecordsToSet[x]).attr("file-name");
        var isNetExist = CurJson.filter(o => o.sourceFile == FilName);
        if (isNetExist.length == 0) {
            $("tr[file-name=" + '"' + FilName + '"' + "]").remove();
            continue;
        }
        var selType = CurJson.filter(o => o.networkId == netId && o.sourceFile == FilName)[0].selectionType;
        $(RecordsToSet[x]).val(selType);
        $(RecordsToSet[x]).closest("tr").removeClass("add");
        $(RecordsToSet[x]).closest("tr").removeClass("replace");
        $(RecordsToSet[x]).closest("tr").removeClass("ignore");
        $(RecordsToSet[x]).closest("tr").addClass(selType);
        if (selType == "replace") {
            $("select[network-id=" + '"' + netId + '"' + "] option").each(function (index, val) {
                var option = $(this).val();
                if (option == "replace") {
                    $(this).prop("disabled", true);
                    $(this).css("color", "#D1D0D0");
                }
            });
        }
    }
} //hunain end
function FilterArchivedProposals2() {
    $("#ddlNetworksArchived").val($("#ddlNetworksArchived2").val());
    networkDropDownHtml = $("#ddlNetworksArchived2").html();
    FilterArchivedProposals();
}
function FilterArchivedProposals() {

    if ($.fn.dataTable.isDataTable('#ArchivedProposalTable'))
        $('#ArchivedProposalTable').DataTable().clear().destroy();
    var SelectNetID = $("#ddlNetworksArchived").val();

    FilterDataArchived = null;
    if (SelectNetID !== "-1") {
        FilterDataArchived = ArchivedProposalsJson.filter(x => parseInt(x.networkId) === parseInt(SelectNetID));
    }
    else {
        FilterDataArchived = ArchivedProposalsJson;
    }
    var _selCntid = 5;
    if ($('#US').is(':checked')) {
        _selCntid = 5;
    }
    else if ($('#CA').is(':checked')) {
        _selCntid = 2;
    }
    var _selClid = $("#ddlclients :selected").val();
    //alert(_selClientid);
    var _selQtrData = ($(".nav-link.active").html().split(' ')[0]).toString().substring(2, 1) + "Q" + $(".nav-link.active").html().split(' ')[1];
    var HTML = "";
    for (var x = 0; x < FilterDataArchived.length; x++) {
        //if (!FilterDataArchived[x].ignored && !FilterDataArchived[x].archived) {
        if (!FilterDataArchived[x].ignored && FilterDataArchived[x].archived) {
            HTML = HTML + '';
            HTML = HTML + '<tr id="trNetwork_' + FilterDataArchived[x].networkId + '"  class="' + FilterDataArchived[x].selectionType + '" file-name="' + FilterDataArchived[x].sourceFile + '">';
            /*HTML = HTML + '<td class="text-center"><input type="hidden" value="' + FilterDataArchived[x].sourceFile + '"/> <input type="checkbox" onchange= "return Addnetworktolist(this)" class="networkval" name="select_all" value="' + FilterDataArchived[x].networkId + '-' + FilterDataArchived[x].sourceFile + '" id="' + FilterDataArchived[x].networkId + '-' + FilterDataArchived[x].sourceFile + '"/></td>';*/
            HTML = HTML + '<td style="width:180px;!important;" class="text-center" id="tdNetwork_' + FilterDataArchived[x].networkId + '">' + FilterDataArchived[x].networkName + '</td>';
            HTML = HTML + '<td class="text-center " style="width:110px;!important;"> <span style="color: #42a5f5;text-decoration: underline; cursor:pointer;" onclick="downloadDealpoint(\'' + _selClid + '\',\'' + _selQtrData + '\',\'' + FilterDataArchived[x].networkId + '\',\'' + FilterDataArchived[x].sourceFile + '\',\'' + _selCntid + '\',\'' + FilterDataArchived[x].clientName + '\',\'' + FilterDataArchived[x].networkName + '\');" netid-val=' + FilterDataArchived[x].networkId + ' filename-val="' + FilterDataArchived[x].sourceFile + '" title="Export" tooltip="Export"   style="height:20px;width:20px;text-decoration: underline;">' + FilterDataArchived[x].deal + " (" + FilterDataArchived[x].revision + ")" + '</span>';

            HTML = HTML + '<td class="text-center" style="width:270px;!important;"> ' + FilterDataArchived[x].receivedDate + '</td> ';
            HTML = HTML + '<td class="text-center" style="width:100px;!important;"> ' + FilterDataArchived[x].spots + '</td> ';
            HTML = HTML + '<td class="text-center" style="width:150px;!important;"> ' + $.fn.dataTable.render.number(',', '.', 2, '$').display(FilterDataArchived[x].totalDollars) + '</td> ';
            HTML = HTML + '<td class="text-center" style="width:100px;!important;"> ' + FilterDataArchived[x].imps + '</td> ';
            HTML = HTML + '<td class="text-center" style="width:100px;!important;"> ' + $.fn.dataTable.render.number(',', '.', 2, '$').display(FilterDataArchived[x].cpm) + '</td> ';
            //HTML = HTML + '<td class="text-center"> ' + $.fn.dataTable.render.number(',', '.', 2, '$').display(FilterDataArchived[x].cpm) + '</td> '; 
            HTML = HTML + '<td class="text-center " style="dislplay:flex;width:220px!important;">';
            HTML = HTML + '<select style="margin-left:70px;" disabled><option value="add">Add</option><option value="ignore" selected>Ignore</option><option value="replace">Replace</option></select>';
            //HTML = HTML + '<input type="button"  style="padding:5px;margin-left:5px;height:15px!important;" id="btnArchive_' + x + '" network-id="' + FilterDataArchived[x].networkId + '" file-name="' + FilterDataArchived[x].sourceFile + '" value="Unarchive" class="btn btn-alt-primary" onclick="UnArchiveSingleProposal(this);" data-type="view" />';
            HTML = HTML + '<span style="color: #42a5f5;text-decoration: underline; cursor:pointer; padding-left:10px;height:20px;width:60px;text-decoration: underline;" id="btnUnArchive_' + x + '" network-id="' + FilterDataArchived[x].networkId + '" file-name="' + FilterDataArchived[x].sourceFile + '" onclick="UnArchiveSingleProposal(this)" data-type="view">Unarchive</span>';
            HTML = HTML + '</td>';
            HTML = HTML + '</tr>';
        }
    }
    $("#tbodyArchivedProposal").html(HTML);
    $('#ArchivedProposalTable').DataTable({
        lengthMenu: [[20, 50, 75, 100], [20, 50, 75, 100]],
        'processing': true,
        'autoWidth': false,
        "rowHeight": '25px',
        "sDom": 'Rfrtlip',
        // dom: '<"bottom"i>rt<"bottom"flp>',
        'columnDefs': [{
            'bSortable': false, "aTargets": [0,1,2] ,
            'targets': [7], // column index (start from 0)
            'orderable': false, // set orderable false for selected columns
        }],
        fixedColumns: {
            heightMatch: 'none'
        },
        initComplete: function (settings, json) {
            $("#ArchivedProposalTable_wrapper").prepend('<label style="margin-top:10px;margin-left:15px;">Network:<select id="ddlNetworksArchived2" onchange="FilterArchivedProposals2();"  style="margin-left:5px;" placeholder=""></select></label>');
            //$("#ddlNetworksArchived2").html($("#ddlNetworksArchived").html());
            $("#ddlNetworksArchived2").html(networkDropDownHtml);
            $("#ddlNetworksArchived2").val(SelectNetID);
            setTimeout(function () {
                //$("#ddlNetworksArchived2").val($("#ddlNetworksArchived").val());

                $("#ArchivedProposalTable tr td").css("background", "white");
            }, 500);
        }
    });
    $("#ArchivedProposalTable_info").text("Showing " + FilterDataArchived.filter(a => a.archived == true).length + " of " + ArchivedProposalsJson.filter(a => a.archived == true).length + " entries");
    $($("#ArchivedProposalTable th")[0]).width("180px");
    $($("#ArchivedProposalTable th")[1]).width("110px");
    $($("#ArchivedProposalTable th")[2]).width("270px");
    $($("#ArchivedProposalTable th")[3]).width("100px");
    $($("#ArchivedProposalTable th")[4]).width("150px");
    $($("#ArchivedProposalTable th")[5]).width("100px");
    $($("#ArchivedProposalTable th")[6]).width("100px");
    $($("#ArchivedProposalTable th")[7]).width("220px");

    $("#ArchivedProposalTable_info").css("float", "right");
    $("#ArchivedProposalTable_info").css("margin-top", "-42px");
    $("#ArchivedProposalTable_paginate").css("float", "left");
    $("#ArchivedProposalTable_paginate").css("margin-top", "-42px");
    $("#ArchivedProposalTable_length").css("margin-left", "50%");

    setTimeout(function () {
        $("#ArchivedProposalTable").closest("div").css("max-height", window.innerHeight - 350);
        $("#ArchivedProposalTable").closest("div").css("overflow-y", "auto");
        $("#ArchivedProposalTable").closest("div").css("overflow-x", "hidden");
    }, 1500);
}
//var SelNetworks = $('input[name="select_all"]:checked').serialize();
function Addnetworktolist(ctrl) {
    if ($(ctrl).prop("checked") || $('input[name="select_all"]:checked').serialize() != '') {
        if (SelTab == 1) {
            $("#btnImport").attr("disabled", false);
            $("#btnIgnore").attr("disabled", false);
            $("#btnArchive").attr("disabled", false);
        }
        else {
            $("#btnUnArchive").attr("disabled", false);
        }
        //  $("#chkSelectAllUnAllocated").prop("checked", false);
    }
    else {
        if (SelTab == 1) {
            $("#btnImport").attr("disabled", true);
            $("#btnIgnore").attr("disabled", true);
            $("#btnArchive").attr("disabled", true);
        }
        else {
            $("#btnUnArchive").attr("disabled", true);
        }

    }
    if ($(".networkval:checked").length == $(".networkval").length) {
        $("#chkSelectAllUnAllocated").prop("checked", true);
    }
    else {
        $("#chkSelectAllUnAllocated").prop("checked", false);
        if ($(".networkval:checked").length == 0) {
            $("#btnImport").attr("disabled", true);
            $("#btnIgnore").attr("disabled", true);
            $("#btnArchive").attr("disabled", true);
        }
        else {
            $("#btnImport").attr("disabled", false);
            $("#btnIgnore").attr("disabled", false);
            $("#btnArchive").attr("disabled", false);
        }
    }

    if ($("#ArchivedProposalTable .networkval:checked").length == $("#ArchivedProposalTable .networkval").length) {
        $("#chkSelectAllArchived").prop("checked", true);
    }
    else {
        $("#chkSelectAllArchived").prop("checked", false);
        if ($("#ArchivedProposalTable .networkval:checked").length == 0) {
            $("#btnUnArchive").attr("disabled", true);
        }
        else {
            $("#btnUnArchive").attr("disabled", false);
        }
    }
}

function SelectAllNetworks(ctrl) {
    if ($(ctrl).prop("checked")) {
        $(".networkval").prop("checked", true);
        if (SelTab == 1) {
            $("#tbodyArchivedProposal .networkval").prop("checked", false);
            $("#tbodyUnAllocatedProposals .networkval").prop("checked", true);
            $("#btnImport").attr("disabled", false);
            $("#btnIgnore").attr("disabled", false);
            $("#btnArchive").attr("disabled", false);
        }
        else {
            $("#tbodyUnAllocatedProposals .networkval").prop("checked", false);
            $("#tbodyArchivedProposal .networkval").prop("checked", true);
            $("#btnUnArchive").attr("disabled", false);
        }
    }
    else {
        $("#tbodyArchivedProposal .networkval").prop("checked", false);
        $("#tbodyUnAllocatedProposals .networkval").prop("checked", false);
        if (SelTab == 1) {
            $("#btnImport").attr("disabled", true);
            $("#btnIgnore").attr("disabled", true);
            $("#btnArchive").attr("disabled", true);
        }
        else {
            $("#btnUnArchive").attr("disabled", true);
        }
        $(".networkval:checked").length = 0;
    }

    //networkval
}

// Moment prototype object
function Moment(config) {
    copyConfig(this, config);
    this._d = new Date(config._d != null ? config._d.getTime() : NaN);
    if (!this.isValid()) {
        this._d = new Date(NaN);
    }
    // Prevent infinite loop in case updateOffset creates new moment
    // objects.
    if (updateInProgress === false) {
        updateInProgress = true;
        hooks.updateOffset(this);
        updateInProgress = false;
    }
}

function AcceptProposals() {
    var SelNetworks = $("#tbodyUnAllocatedProposals .networkval:checked");
    var SelNetworkIds = "";
    var SelNetworkNames = "";
    for (var x = 0; x < SelNetworks.length; x++) {
        if (SelNetworkIds == "") {
            SelNetworkIds = "," + $(SelNetworks[x]).attr("id").split('-')[0] + ",";
            SelNetworkNames = "," + $("#tdNetwork_" + $(SelNetworks[x]).attr("id").split('-')[0]).html().trim() + ",";
        }
        else {
            if (SelNetworkIds.indexOf("," + $(SelNetworks[x]).attr("id").split('-')[0] + ",") < 0) {
                SelNetworkIds = SelNetworkIds + $(SelNetworks[x]).attr("id").split('-')[0] + ",";
                SelNetworkNames = SelNetworkNames + $("#tdNetwork_" + $(SelNetworks[x]).attr("id").split('-')[0]).html().trim() + ",";
            }
        }
    }
    if (SelNetworkIds.startsWith(",")) {
        SelNetworkIds = SelNetworkIds.substring(1);
        SelNetworkNames = SelNetworkNames.substring(1);
    }
    if (SelNetworkIds.endsWith(",")) {
        SelNetworkIds = SelNetworkIds.substring(0, SelNetworkIds.length - 1);
        SelNetworkNames = SelNetworkNames.substring(0, SelNetworkNames.length - 1);
    }

    swal({
        title: "The following networks will be imported:",
        html: SelNetworkNames.replace(/,/g, '<br/>') + '<br/><br/>  Are you sure you want to proceed?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        allowOutsideClick: false,
        confirmButtonText: 'Yes, I am okay  to import',
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
            // console.log(ArchivedProposalsJson);
            SelectedProposalsJson = [];
            var SelNetworks = $("#tbodyUnAllocatedProposals .networkval:checked");
            for (var x = 0; x < SelNetworks.length; x++) {
                // $("#trNetwork_" + $(SelNetworks[x]).attr("id").split('-')[0]).remove();
                $(SelNetworks[0]).parent().parent().remove();
                for (var n = 0; n < UnAllocatedProposalsJson.length; n++) {
                    if (UnAllocatedProposalsJson[n].sourceFile.toString() == $(SelNetworks[x]).attr("id").split('-')[1]) {
                        var index = SelectedProposalsJson.findIndex(x => x.sourceFile === UnAllocatedProposalsJson[n].sourceFile);
                        if (index < 0) {
                            SelectedProposalsJson.push(UnAllocatedProposalsJson[n]);
                        }
                    }
                }
            }
            _UnAllocatedImportScreenOpen = true;
            $("#modal-UnAllocatedProposals").modal('hide');
            $('#modal-ImportUnAllocatedProposals').modal({ backdrop: 'static', keyboard: false }, 'show');
            $("#modal-ImportUnAllocatedProposals").height(window.innerHeight - 50);
            $("#modal-ImportUnAllocatedProposals .block-content").css("max-height", $(window).height() - 200);
            $("#modal-ImportUnAllocatedProposals .block-content").height($(window).height() - 150);
            $("#modal-ImportUnAllocatedProposals.block-content").parent().height($(window).height() - 150);
            setTimeout(function () { $("#modal-ImportUnAllocatedProposals .block-content").scrollLeft(0); }, 3000);
            setTimeout(function () { $("#modal-ImportUnAllocatedProposals .block-content").scrollTop(0); }, 3000);
            SelectedProposal = SelectedProposalsJson[0];
            SelectedProposalNo = 1;

            BindImportScreenData(SelectedProposalsJson);
        }, function (dismiss) {
            // dismiss can be 'cancel', 'overlay', 'esc' or 'timer'
        }
    );
    return false;
}

function ArchiveProposals() {
    var SelNetworks = $("#tbodyUnAllocatedProposals .networkval:checked");
    var SelNetworkIds = "";
    var SelNetworkNames = "";
    var selFiles = "";
    for (var x = 0; x < SelNetworks.length; x++) {
        if (SelNetworkIds == "") {
            SelNetworkIds = "," + $(SelNetworks[x]).attr("id").split('-')[0] + ",";
            selFiles = "," + $(SelNetworks[x]).attr("id").split('-')[1] + ",";
            SelNetworkNames = "," + $("#tdNetwork_" + $(SelNetworks[x]).attr("id").split('-')[0]).html().trim() + ",";
        }
        else {
            if (selFiles.indexOf("," + $(SelNetworks[x]).attr("id").split('-')[1] + ",") < 0) {
                selFiles = selFiles + $(SelNetworks[x]).attr("id").split('-')[1] + ",";
            }
            if (SelNetworkIds.indexOf("," + $(SelNetworks[x]).attr("id").split('-')[0] + ",") < 0) {
                SelNetworkIds = SelNetworkIds + $(SelNetworks[x]).attr("id").split('-')[0] + ",";
                SelNetworkNames = SelNetworkNames + $("#tdNetwork_" + $(SelNetworks[x]).attr("id").split('-')[0]).html().trim() + ",";
            }
        }
    }
    if (SelNetworkIds.startsWith(",")) {
        SelNetworkIds = SelNetworkIds.substring(1);
        selFiles = selFiles.substring(1);
        SelNetworkNames = SelNetworkNames.substring(1);
    }
    if (SelNetworkIds.endsWith(",")) {
        SelNetworkIds = SelNetworkIds.substring(0, SelNetworkIds.length - 1);
        selFiles = selFiles.substring(0, selFiles.length - 1);
        SelNetworkNames = SelNetworkNames.substring(0, SelNetworkNames.length - 1);
    }
    //alert(SelNetworkIds);
    //alert(SelNetworkNames);
    swal({
        title: "The following networks will be archived:",
        html: SelNetworkNames.replace(/,/g, '<br/>') + '<br/><br/>  Are you sure you want to proceed?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        allowOutsideClick: false,
        confirmButtonText: 'Yes, I am okay  to archive',
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
            CompleteArchive(SelNetworkIds,selFiles);
        }, function (dismiss) {
            // dismiss can be 'cancel', 'overlay', 'esc' or 'timer'
        }
    );
    return false;


}



function IgnoreProposals() {
    var SelNetworks = $("#tbodyUnAllocatedProposals .networkval:checked");
    var SelNetworkIds = "";
    var SelNetworkNames = "";
    var selFiles = "";
    for (var x = 0; x < SelNetworks.length; x++) {
        if (SelNetworkIds == "") {
            SelNetworkIds = "," + $(SelNetworks[x]).attr("id").split('-')[0] + ",";
            selFiles = "," + $(SelNetworks[x]).attr("id").split('-')[1] + ",";
            SelNetworkNames = "," + $("#tdNetwork_" + $(SelNetworks[x]).attr("id").split('-')[0]).html().trim() + ",";
        }
        else {
            if (selFiles.indexOf("," + $(SelNetworks[x]).attr("id").split('-')[1] + ",") < 0) {
                selFiles = selFiles + $(SelNetworks[x]).attr("id").split('-')[1] + ",";
            }
            if (SelNetworkIds.indexOf("," + $(SelNetworks[x]).attr("id").split('-')[0] + ",") < 0) {
                SelNetworkIds = SelNetworkIds + $(SelNetworks[x]).attr("id").split('-')[0] + ",";
                SelNetworkNames = SelNetworkNames + $("#tdNetwork_" + $(SelNetworks[x]).attr("id").split('-')[0]).html().trim() + ",";
            }
        }
    }
    if (SelNetworkIds.startsWith(",")) {
        SelNetworkIds = SelNetworkIds.substring(1);
        selFiles = selFiles.substring(1);
        SelNetworkNames = SelNetworkNames.substring(1);
    }
    if (SelNetworkIds.endsWith(",")) {
        SelNetworkIds = SelNetworkIds.substring(0, SelNetworkIds.length - 1);
        selFiles = selFiles.substring(0, selFiles.length - 1);
        SelNetworkNames = SelNetworkNames.substring(0, SelNetworkNames.length - 1);
    }
    //alert(SelNetworkIds);
    //alert(SelNetworkNames);
    var MsgHeading = SelNetworkNames.replace(/,/g, '<br/>') + '<br/> <br/> Are you sure you want to proceed?';
    var msgConfirm = 'Yes, I am okay  to ignore';
    if ($("#chkSelectAllUnAllocated").prop("checked")) {
        msgConfirm = 'Yes, procced to Edit Proposals';
        var MsgHeading = SelNetworkNames.replace(/,/g, '<br/>') + '<br/> <br/> Are you sure you want to proceed to edit proposal?';
    }
    swal({
        title: "The following networks will be ignored:",
        html: SelNetworkNames.replace(/,/g, '<br/>') + '<br/> <br/> Are you sure you want to proceed?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        allowOutsideClick: false,
        confirmButtonText: msgConfirm,
        showLoaderOnConfirm: true,
        preConfirm: function () {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    resolve();
                }, 50);
            });
        }
    }).then(
        function () {
            $("#btnImport").attr("disabled", true);
            $("#btnArchive").attr("disabled", true);
            $("#btnIgnore").attr("disabled", true);
            var SelIgnoreNetworksAfter = $("#tbodyUnAllocatedProposals .networkval:checked");
            for (var x = 0; x < SelIgnoreNetworksAfter.length; x++) {
                var curNetId = $(SelIgnoreNetworksAfter[x]).attr("id").split('-')[0];
                var curFile = $(SelIgnoreNetworksAfter[x]).attr("id").split('-')[1];
                $(SelIgnoreNetworksAfter[x]).parent().parent().remove();
                UnAllocatedProposalsJson.filter(o => o.networkId.toString() == curNetId.toString() && o.sourceFile.toString() == curFile.toString())[0].ignored = true;
                if ($("#ddlNetworksUnallocated").val() != "-1") {
                    if (FilterData != null && FilterData != undefined && FilterData.length > 0) {
                        FilterData.filter(o => o.networkId.toString() == curNetId.toString() && o.sourceFile.toString() == curFile.toString())[0].ignored = true;
                    }
                }

            }

            $("#chkSelectAllUnAllocated").prop("checked", false);

            var ignoredCount = UnAllocatedProposalsJson.filter(o => o.ignored).length + UnAllocatedProposalsJson.filter(o => o.archived).length;
            if (ignoredCount == UnAllocatedProposalsJson.length) {
                $("#modal-UnAllocatedProposals").modal('hide');
                if (screenMode.toString().toLowerCase() == "create") {
                    CreateProposal(Screenparam1);
                    return false;
                }
                if (screenMode.toString().toLowerCase() == "edit") {
                    OpenProposal(Screenparam1, Screenparam2, Screenparam3);
                    return false;
                }
            }

        }, function (dismiss) {
            // dismiss can be 'cancel', 'overlay', 'esc' or 'timer'
        }
    );
    return false;


}

function BacktoUnAllocatedProposals(checkmode) {
    $("#tbodyUnAllocatedProposals").hide();
    ShowOverlayPopup();
    $("#modal-UnAllocatedProposals").modal('show');
    $("#modal-ImportUnAllocatedProposals").modal('hide');
    CurrentNetworkId = 0;
    PreviousNetworkId = 0;
    TotalCount = 0;
    CurrentCount = 0;

    setTimeout(function () {
        BindUnAllocatedProposals(checkmode);
    }, 1000);
}

function ShowUnAllocatedProposals(ctrl,checktype) {
    $("#chkSelectAllUnAllocated").prop("checked", false);
    $("#chkSelectAllArchived").prop("checked", false);
    $("#archived").removeClass("active-tab");
    $("#processed").removeClass("active-tab");//ST-719
    $("#all").addClass("active-tab");
    if ($("#divArvhivedProposalSection").hasClass("active")) {
        $("#divArvhivedProposalSection").removeClass("active");
        $("#divArvhivedProposalSection").removeClass("show");
    }
    //ST-719 Added Logic for Processed Proposal Section
    if ($("#divProcessedProposalSection").hasClass("active")) {
        $("#divProcessedProposalSection").removeClass("active");
        $("#divProcessedProposalSection").removeClass("show");
    }
    if (!$("#divUnAllocatedNetworksSection").hasClass("active")) {
        $("#divUnAllocatedNetworksSection").addClass("show");
        $("#divUnAllocatedNetworksSection").addClass("active");
    }
    SelTab = 1;

    $("#btnUnArchive").hide();
    $("#btnImport").show();
    $("#btnArchive").show();
    $("#btnIgnore").show();
    CheckUnAllocationProposals("", "", "", "view", checktype);
}

function CheckArchivedUnAllocationProposals() {
    ShowOverlayPopup();
//    $("#tbodyUnAllocatedProposals").hide();
    $("#tbodyArchivedProposal").show();
    $("#chkSelectAllUnAllocated").prop("checked", false);
    $("#chkSelectAllArchived").prop("checked", false);
    $("#all").removeClass("active-tab");
    $("#processed").removeClass("active-tab");//ST-719
    $("#archived").addClass("active-tab");
    if ($("#divUnAllocatedNetworksSection").hasClass("active")) {
        $("#divUnAllocatedNetworksSection").removeClass("active");
        $("#divUnAllocatedNetworksSection").removeClass("show");
    }
    //ST-719 Added Logic for Processed Proposal Section
    if ($("#divProcessedProposalSection").hasClass("active")) {
        $("#divProcessedProposalSection").removeClass("active");
        $("#divProcessedProposalSection").removeClass("show");
    }
    if (!$("#divArvhivedProposalSection").hasClass("active")) {
        $("#divArvhivedProposalSection").addClass("show");
        $("#divArvhivedProposalSection").addClass("active");
    }
    SelTab = 2;
    $("#btnImport").hide();
    $("#btnArchive").hide();
    $("#btnIgnore").hide();
    $("#btnUnArchive").show();
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
        url: '/ScheduleProposal/CheckAvailableUnAllocatedProposalsData',
        type: "GET",
        async: false,
        data: {
            "ClientId": _selClientid,
            "QuarterName": _selQtr,
            "Archived": true

        },
        success: function (result) {
            ArchivedProposalsJson = result.proposals;
            setTimeout(function () { BindArchivedProposals() }, 1000);
        },
        error: function (response) {
            HideOverlayPopup();
        }
    });
}

function UnArchiveProposals() {

    var SelNetworks = $("#tbodyArchivedProposal .networkval:checked");
    var SelNetworkIds = "";
    var SelNetworkNames = "";
    var selFiles = "";
    for (var x = 0; x < SelNetworks.length; x++) {
        if (SelNetworkIds == "") {
            SelNetworkIds = "," + $(SelNetworks[x]).attr("id").split('-')[0] + ",";
            selFiles = "," + $(SelNetworks[x]).attr("id").split('-')[1] + ",";
            SelNetworkNames = "," + $("#tdNetwork_" + $(SelNetworks[x]).attr("id").split('-')[0]).html().trim() + ",";
        }
        else {
            if (selFiles.indexOf("," + $(SelNetworks[x]).attr("id").split('-')[1] + ",") < 0) {
                selFiles = selFiles + $(SelNetworks[x]).attr("id").split('-')[1] + ",";
            }
            if (SelNetworkIds.indexOf("," + $(SelNetworks[x]).attr("id").split('-')[0] + ",") < 0) {
                SelNetworkIds = SelNetworkIds + $(SelNetworks[x]).attr("id").split('-')[0] + ",";
                SelNetworkNames = SelNetworkNames + $("#tdNetwork_" + $(SelNetworks[x]).attr("id").split('-')[0]).html().trim() + ",";
            }
        }
    }
    if (SelNetworkIds.startsWith(",")) {
        SelNetworkIds = SelNetworkIds.substring(1);
        selFiles = selFiles.substring(1);
        SelNetworkNames = SelNetworkNames.substring(1);
    }
    if (SelNetworkIds.endsWith(",")) {
        SelNetworkIds = SelNetworkIds.substring(0, SelNetworkIds.length - 1);
        selFiles = selFiles.substring(0, selFiles.length - 1);
        SelNetworkNames = SelNetworkNames.substring(0, SelNetworkNames.length - 1);
    }
    //alert(SelNetworkIds);
    //alert(SelNetworkNames);
    swal({
        title: "The following networks will be unarchived:",
        html: SelNetworkNames.replace(/,/g, '<br/>') + '<br/><br/>  Are you sure you want to proceed?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        allowOutsideClick: false,
        confirmButtonText: 'Yes, I am okay  to unarchive',
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
            CompleteUnArchive(SelNetworkIds, selFiles);
        }, function (dismiss) {
            // dismiss can be 'cancel', 'overlay', 'esc' or 'timer'
        }
    );
    return false;
}


function ClosedImportPopup() {
    window.location.reload()
}
//hunain start
function ArchiveSingleProposal(ctrl) {

    var SelNetId = $(ctrl).attr("network-id");
    var SelFileName = $(ctrl).attr("file-name");
    var currentId = $("select[file-name=" + '"' + SelFileName + '"' + "]").attr("id");
    var currentSelection = $("select[id=" + '"' + currentId + '"' + "] option:selected").val();
    CompleteArchive(SelNetId, SelFileName, ctrl);
    if (currentSelection == "replace") {
        UnAllocatedProposalsJson.filter(o => o.networkId.toString() == SelNetId.toString() && o.sourceFile.toString() == SelFileName.toString())[0].selectionType = "ignore";
        replaceUniqueId.splice(replaceUniqueId.indexOf(currentId), 1);
        $("select[network-id=" + '"' + SelNetId + '"' + "] option").each(function (index, val) {
            var option = $(this).val();
            if (option == "replace") {
                $(this).prop("disabled", false);
                $(this).css("color", "#575757");
            }
        });
    }

    var unAllocJson = SelectedProposalsJson != undefined || SelectedProposalsJson != null ? SelectedProposalsJson.filter(a => a.networkId == SelNetId && a.archived == false) : UnAllocatedProposalsJson.filter(a => a.networkId == SelNetId && a.archived == false);

    $("#ddlNetworksUnallocated2 option").each(function (index, val) {
        var option = $(this).val();
        if (unAllocJson.length == 0 && option == SelNetId) {
            $(this).hide();
        }
    });
    var archivedJson = SelectedProposalsJson != undefined || SelectedProposalsJson != null ? SelectedProposalsJson.filter(a => a.networkId == SelNetId && a.archived == true) : UnAllocatedProposalsJson.filter(a => a.networkId == SelNetId && a.archived == true);

    $("#ddlNetworksArchived2 option").each(function (index, val) {
        var option = $(this).val();
        if (archivedJson.length == 0 && option == SelNetId) {
            $(this).show();
        }
    });


} //hunain end
function UnArchiveSingleProposal(ctrl) {
    var SelNetId = $(ctrl).attr("network-id");
    var SelFileName = $(ctrl).attr("file-name");
    CompleteUnArchive(SelNetId, SelFileName, ctrl);
    var unAllocJson = SelectedProposalsJson != undefined || SelectedProposalsJson != null ? SelectedProposalsJson.filter(a => a.networkId == SelNetId && a.archived == false) : UnAllocatedProposalsJson.filter(a => a.networkId == SelNetId && a.archived == false);

    $("#ddlNetworksUnallocated2 option").each(function (index, val) {
        var option = $(this).val();
        if (unAllocJson.length == 0 && option == SelNetId) {
            $(this).show();
        }
    });
    var archivedJson = SelectedProposalsJson != undefined || SelectedProposalsJson != null ? SelectedProposalsJson.filter(a => a.networkId == SelNetId && a.archived == true) : UnAllocatedProposalsJson.filter(a => a.networkId == SelNetId && a.archived == true);

    $("#ddlNetworksArchived2 option").each(function (index, val) {
        var option = $(this).val();
        if (archivedJson.length == 0 && option == SelNetId) {
            $(this).hide();
        }
    });

}

function CompleteArchive(NetworkId, SourceFileName,ctrl) {
    var _selCid = $("#ddlclients :selected").val();
    var _selQtrName = ($(".nav-link.active").html().split(' ')[0]).toString().substring(2, 1) + "Q" + $(".nav-link.active").html().split(' ')[1];
    $.ajax({
        url: '/ScheduleProposal/ArchiveUnAllocatedProposals',
        type: "GET",
        async: false,
        data: {
            "ClientId": _selCid,
            "QuarterName": _selQtrName,
            "Networkids": NetworkId,
            "SourceFileNames": SourceFileName,
        },
        success: function (result) {
            if (result != null && result != "0") {
                $(ctrl).closest("tr").remove();
                UnAllocatedProposalsJson.filter(o => o.networkId.toString() == NetworkId.toString() && o.sourceFile.toString() == SourceFileName.toString())[0].archived = true;
                if ($("#ddlNetworksArchived").val() != "-1") {
                    if (FilterData != null && FilterData != undefined && FilterData.length > 0) {
                        FilterData.filter(o => o.networkId.toString() == NetworkId.toString() && o.sourceFile.toString() == SourceFileName.toString())[0].archived = true;
                    }
                }
                $("#UnAllocatedProposalsTable_info").text("Showing " + UnAllocatedProposalsJson.filter(a => a.archived == false).length + " of " + UnAllocatedProposalsJson.filter(a => a.archived == false).length + " entries");
            }

        },
        error: function (response) {
        }
    });
}


function CompleteUnArchive(NetworkId, SourceFileName, ctrl) {
    $(ctrl).attr("disabled", true);
    var _selCid = $("#ddlclients :selected").val();
    var _selQtrName = ($(".nav-link.active").html().split(' ')[0]).toString().substring(2, 1) + "Q" + $(".nav-link.active").html().split(' ')[1];
    $.ajax({
        url: '/ScheduleProposal/UnArchiveUnAllocatedProposals',
        type: "GET",
        async: false,
        data: {
            "ClientId": _selCid,
            "QuarterName": _selQtrName,
            "Networkids": NetworkId,
            "SourceFileNames": SourceFileName
        },
        success: function (result) {
            if (result != null && result != "0") {
                $(ctrl).closest("tr").remove();
                ArchivedProposalsJson.filter(o => o.networkId.toString() == NetworkId.toString() && o.sourceFile.toString() == SourceFileName.toString())[0].archived = false;
                //hunain start
                ArchivedProposalsJson.filter(o => o.networkId.toString() == NetworkId.toString() && o.sourceFile.toString() == SourceFileName.toString())[0].selectionType = 'ignore';
                var index = UnAllocatedProposalsJson.findIndex(x => x.sourceFile === ArchivedProposalsJson.filter(o => o.networkId.toString() == NetworkId.toString() && o.sourceFile.toString() == SourceFileName.toString())[0].sourceFile);
                if (index < 0) {
                    UnAllocatedProposalsJson.push(ArchivedProposalsJson.filter(o => o.networkId.toString() == NetworkId.toString() && o.sourceFile.toString() == SourceFileName.toString())[0]);
                }
                else {
                    UnAllocatedProposalsJson.filter(o => o.networkId.toString() == NetworkId.toString() && o.sourceFile.toString() == SourceFileName.toString())[0].archived = false;
                    UnAllocatedProposalsJson.filter(o => o.networkId.toString() == NetworkId.toString() && o.sourceFile.toString() == SourceFileName.toString())[0].selectionType = 'ignore';
                }
                if ($("#ddlNetworksArchived").val() != "-1") {
                    if (FilterDataArchived != null && FilterDataArchived != undefined && FilterDataArchived.length > 0) {
                        FilterDataArchived.filter(o => o.networkId.toString() == NetworkId.toString() && o.sourceFile.toString() == SourceFileName.toString())[0].archived = false;
                        FilterDataArchived.filter(o => o.networkId.toString() == NetworkId.toString() && o.sourceFile.toString() == SourceFileName.toString())[0].selectionType = 'ignore';
                        var index2 = UnAllocatedProposalsJson.findIndex(x => x.sourceFile === FilterDataArchived.filter(o => o.networkId.toString() == NetworkId.toString() && o.sourceFile.toString() == SourceFileName.toString())[0].sourceFile);
                        if (index2 < 0) {
                            UnAllocatedProposalsJson.push(FilterDataArchived.filter(o => o.networkId.toString() == NetworkId.toString() && o.sourceFile.toString() == SourceFileName.toString())[0]);
                        }
                        else {
                            UnAllocatedProposalsJson.filter(o => o.networkId.toString() == NetworkId.toString() && o.sourceFile.toString() == SourceFileName.toString())[0].archived = false;
                            UnAllocatedProposalsJson.filter(o => o.networkId.toString() == NetworkId.toString() && o.sourceFile.toString() == SourceFileName.toString())[0].selectionType = 'ignore';
                        }
                    }
                }
                $("#ArchivedProposalTable_info").text("Showing " + UnAllocatedProposalsJson.filter(a => a.archived == true).length + " of " + UnAllocatedProposalsJson.filter(a => a.archived == true).length + " entries");
                //hunain end
            }
        },
        error: function (response) {
        }
    });
}
var replaceUniqueId = [];
function CheckSelectionType(ctrl) {
    var curSelection = $(ctrl).val();
    var TotalRecords = 0;
    var SelNetId = $(ctrl).attr("network-id");
    var SelId = $(ctrl).attr("file-name");

    var SelFileName = $(ctrl).attr("file-name");
    if (curSelection == "replace") {
        if ($("#ddlNetworksUnallocated").val() != "-1") {
            TotalRecords = FilterData.filter(o => o.networkId.toString() == SelNetId.toString() && o.selectionType == "replace").length;
        }
        else {
            TotalRecords = UnAllocatedProposalsJson.filter(o => o.networkId.toString() == SelNetId.toString() && o.selectionType == "replace").length;
        }
    }

    if (curSelection == "add") {
        $(ctrl).closest("tr").removeClass("add");
        $(ctrl).closest("tr").removeClass("replace");
        $(ctrl).closest("tr").removeClass("ignore");
        $(ctrl).closest("tr").addClass("add");
    }
    else if (curSelection == "replace") {

        if (TotalRecords <= 0) {
            $(ctrl).closest("tr").removeClass("add");
            $(ctrl).closest("tr").removeClass("replace");
            $(ctrl).closest("tr").removeClass("ignore");
            $(ctrl).closest("tr").addClass("replace");
        }
        else {
            $(ctrl).closest("tr").removeClass("add");
            $(ctrl).closest("tr").removeClass("replace");
            $(ctrl).closest("tr").removeClass("ignore");
            if ($("#ddlNetworksUnallocated").val() != "-1") {
                $(ctrl).closest("tr").addClass(FilterData.filter(o => o.networkId.toString() == SelNetId.toString() && o.sourceFile.toString() == SelFileName.toString())[0].selectionType);
                $(ctrl).val(FilterData.filter(o => o.networkId.toString() == SelNetId.toString() && o.sourceFile.toString() == SelFileName.toString())[0].selectionType);
            }
            else {
                $(ctrl).closest("tr").addClass(UnAllocatedProposalsJson.filter(o => o.networkId.toString() == SelNetId.toString() && o.sourceFile.toString() == SelFileName.toString())[0].selectionType);
                $(ctrl).val(UnAllocatedProposalsJson.filter(o => o.networkId.toString() == SelNetId.toString() && o.sourceFile.toString() == SelFileName.toString())[0].selectionType);
            }
        }
    }
    else {
        $(ctrl).closest("tr").removeClass("add");
        $(ctrl).closest("tr").removeClass("replace");
        $(ctrl).closest("tr").removeClass("ignore");
        $(ctrl).closest("tr").addClass("ignore");
    }

    UnAllocatedProposalsJson.filter(o => o.networkId.toString() == SelNetId.toString() && o.sourceFile.toString() == SelFileName.toString())[0].selectionType = $(ctrl).val();
    if ($("#ddlNetworksUnallocated").val() != "-1") {
        if (FilterData != null && FilterData != undefined && FilterData.length > 0) {
            FilterData.filter(o => o.networkId.toString() == SelNetId.toString() && o.sourceFile.toString() == SelFileName.toString())[0].selectionType = $(ctrl).val();
        }
    }
    if (curSelection == "replace") {    // hunain.manzoor  start
        replaceUniqueId.push(SelId);
        $("select[network-id=" + '"' + SelNetId + '"' + "] option").each(function (index, val) {
            var option = $(this).val();
            if (option == "replace") {
                $(this).prop("disabled", true);
                $(this).css("color", "#D1D0D0");
            }
        });
    }
    else {
        if (replaceUniqueId.indexOf(SelId) != -1) {
            $("select[network-id=" + '"' + SelNetId + '"' + "] option").each(function (index, val) {
                var option = $(this).val();
                if (option == "replace") {
                    $(this).prop("disabled", false);
                    $(this).css("color", "#575757");
                }
            });
            replaceUniqueId.splice(replaceUniqueId.indexOf(SelId), 1);
        }
    }  // hunain.manzoor  end
}
function PerformNext() {
    var ignoredResult;
    var remainingResult;
    var Totalresult;
    if ($("#ddlNetworksUnallocated").val() != "-1") {
        ignoredResult = FilterData.filter(o => o.selectionType == "ignore" && o.archived == false);
        remainingResult = FilterData.filter(o => o.selectionType != "ignore" && o.archived == false);
        Totalresult = FilterData.filter(o => o.archived == false);
    }
    else {
        ignoredResult = UnAllocatedProposalsJson.filter(o => o.selectionType == "ignore" && o.archived == false);
        remainingResult = UnAllocatedProposalsJson.filter(o => o.selectionType != "ignore" && o.archived == false);
        Totalresult = UnAllocatedProposalsJson.filter(o => o.archived == false);
    }
    if (Totalresult.length == ignoredResult.length) {
        CanProceedNormal = true;
        HideOverlayPopup();
        $("#modal-UnAllocatedProposals").modal('hide');
        if (screenMode.toString().toLowerCase() == "create") {
            CreateProposal(Screenparam1);
            return false;
        }
        if (screenMode.toString().toLowerCase() == "edit") {
            OpenProposal(Screenparam1, Screenparam2, Screenparam3);
            return false;
        }
    }
    else {
        for (m = 0; m < ignoredResult.length; m++) {
            if ($("#ddlNetworksUnallocated").val() != "-1") {
                FilterData.filter(o => o.networkId == ignoredResult[m].networkId && o.sourceFile == ignoredResult[m].sourceFile)[0].ignored = true;
            }
            else {
                UnAllocatedProposalsJson.filter(o => o.networkId == ignoredResult[m].networkId && o.sourceFile == ignoredResult[m].sourceFile)[0].ignored = true;
            }
        }
        //console.log("Result Remaining");
        //console.log(remainingResult);
        SelectedProposalsJson = remainingResult;
        remainingResult.sort(function (a, b) {
            return a.networkName.localeCompare(b.networkName) || a.selectionType.localeCompare(b.selectionType);
        });

        SelectedProposalsJson.sort(function (a, b) {
            return a.networkName.localeCompare(b.networkName) || a.selectionType.localeCompare(b.selectionType);
        });
        //sortResults(networkName, asc);
        var HTML = "<div>";
        HTML = HTML + "<p>The following action(s) will take place:</p>";
        HTML = HTML + "<table style='width:700px;'>";
        HTML = HTML + "<thead style='background-color: rgb(215, 228, 188);font-weight:bold;'><tr><th>NETWORK</th><th>DEAL</th><th>ACTION</th></tr></thead>";
        HTML = HTML + "<tbody>";
        for (var x = 0; x < remainingResult.length; x++) {
            HTML = HTML + "<tr>";
            HTML = HTML + '<td style="text-align: left;">' + remainingResult[x].networkName + '</td>';
            HTML = HTML + '<td style="text-align: left;">' + remainingResult[x].deal + '</td>';
            HTML = HTML + '<td style="text-align: left;">' + capitalizeFirstLetter(remainingResult[x].selectionType) + '</td>';
            HTML = HTML + "<tr>";
        }
        HTML = HTML + "</tbody>";
        HTML = HTML + "</table>"
        HTML = HTML + "<br>";
        HTML = HTML + "<p style='float: left;' >Do you wish to continue?</p>";
        HTML = HTML + "</div>";
        swal({
            title: "",
            html: HTML.replace("///",""),
            width: '750px',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            allowOutsideClick: false,
            cancelButtonColor: '#171717',
            cancelButtonText: "No",
            confirmButtonText: "Yes",
            showLoaderOnConfirm: true,
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
                // console.log(ArchivedProposalsJson);
                SelectedProposalsJson = remainingResult.sort(function (a, b) {
                    return a.networkName.localeCompare(b.networkName) || b.selectionType.localeCompare(a.selectionType);
                });;

                _UnAllocatedImportScreenOpen = true;
                $("#modal-UnAllocatedProposals").modal('hide');
                $('#modal-ImportUnAllocatedProposals').modal({ backdrop: 'static', keyboard: false }, 'show');
                $("#modal-ImportUnAllocatedProposals").height(window.innerHeight - 50);
                $("#modal-ImportUnAllocatedProposals .block-content").css("max-height", $(window).height() - 200);
                $("#modal-ImportUnAllocatedProposals .block-content").height($(window).height() - 150);
                $("#modal-ImportUnAllocatedProposals.block-content").parent().height($(window).height() - 150);
                setTimeout(function () { $("#modal-ImportUnAllocatedProposals .block-content").scrollLeft(0); }, 3000);
                setTimeout(function () { $("#modal-ImportUnAllocatedProposals .block-content").scrollTop(0); }, 3000);
                //ST-710 Code Start to log the User Journey
                SelectedProposal = SelectedProposalsJson[0];
                SelectedProposalNo = 1;
                var Description = "User Click Next on File Selection Screen:<br/>";
                Description = Description + $.map(SelectedProposalsJson, function (item) {
                    return "<br/>NetId:" + item.networkId + "~File:" + item.sourceFile + "~Deal:" + item.deal + "~Action:" + item.selectionType;
                }).join(",");
                var proposalId = 0;
                if ($(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != null && $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != undefined && $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href") != "")
                    proposalId = $(".tab-pane.fade.fade-up.show.active #ancEditProposal").attr("href").split('=')[1];

                AddUserJourneyEntry(SelectedProposalsJson[0].clientId, 0, SelectedProposalsJson[0].quarterName, "FileSelectionScreen", proposalId, "", "", "NextOnFileSelection", Description);

                //ST-710 Code End to log the User Journey
             /*   BindImportScreenData(SelectedProposalsJson);*/
            }, function (dismiss) {
                // dismiss can be 'cancel', 'overlay', 'esc' or 'timer'
            }
        );



    }
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function sortResults(prop, asc) {
    people.sort(function (a, b) {
        if (asc) {
            return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
        } else {
            return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
        }
    });
    renderResults();
}

function AddUserJourneyEntry(clientId, networkId, quarterName,screenName, proposalId, deal, sourcefile, action, description) {
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
            BindImportScreenData(SelectedProposalsJson);
        },
        error: function (response) {
            BindImportScreenData(SelectedProposalsJson);
            //swal('Error!', response.responseText, 'warning');
        }
    });
}
// ST-691 Processed Proposal Functions Start Here
function CheckProcessedProposals() {
    $("#tbodyUnAllocatedProposals").hide();
    $("#tbodyArchivedProposal").hide();
    ShowOverlayPopup();

    var _selCountryid = 5;
    if ($('#US').is(':checked')) {
        _selCountryid = 5;
    }
    else if ($('#CA').is(':checked')) {
        _selCountryid = 2;
    }
    var _selClientid = $("#ddlclients :selected").val();
    var _selQtr = ($(".nav-link.active").html().split(' ')[0]).toString().substring(2, 1) + "Q" + $(".nav-link.active").html().split(' ')[1];
    $.ajax({
        url: '/ScheduleProposal/GetProcessedProposalsData',
        type: "GET",
        async: false,
        data: {
            "ClientId": _selClientid,
            "QuarterName": _selQtr,
            "CountryId": _selCountryid
        },
        success: function (result) {
            ProcessedProposalsJson = result;
            setTimeout(function () { Init_ProcessedProposalsTable() }, 1000);
        },
        error: function (response) {
        }
    });
}
var processedPropTable = null;
var processedFilteredHtml = "";
function Init_ProcessedProposalsTable() {
    $("#archived").removeClass("active-tab");
    $("#all").removeClass("active-tab");
    $("#processed").addClass("active-tab");
    if ($("#divArvhivedProposalSection").hasClass("active")) {
        $("#divArvhivedProposalSection").removeClass("active");
        $("#divArvhivedProposalSection").removeClass("show");

    }
    if ($("#divUnAllocatedNetworksSection").hasClass("active")) {
        $("#divUnAllocatedNetworksSection").removeClass("show");
        $("#divUnAllocatedNetworksSection").removeClass("active");
    }
    if (!$("#divProcessedProposalSection").hasClass("active")) {
        $("#divProcessedProposalSection").addClass("active");
        $("#divProcessedProposalSection").addClass("show");
    }
    $("#btnImport").hide();
    $("#HeadingData").html("Processed Proposals : " + $("#ddlclients :selected").text() + " - " + ($(".nav-link.active").html().split(' ')[0]).toString().substring(2, 1) + "Q" + $(".nav-link.active").html().split(' ')[1]);
    if ($.fn.dataTable.isDataTable('#ProcessedProposalTable'))
        processedPropTable = $('#ProcessedProposalTable').DataTable().clear().destroy();
    var HTML = "";
    NetworkName = [];
    // Bind the Distinct NetworkName in ddlNetworks
    var HTMLNetworks = "";
    $("#ddlNetworksProcessed").html("<option value='-1'>All </option>");
    //}
    var unique = ProcessedProposalsJson.filter(function (itm, i, a) {
        if (!itm.archived) {
            var ObjNetwork = { "NetworkId": itm.networkId, "NetworkName": itm.networkName }
            var index = NetworkName.findIndex(x => x.NetworkId === itm.networkId && x.NetworkName === itm.networkName);
            if (index < 0) {
                NetworkName.push(ObjNetwork);
                HTMLNetworks += "<option value=" + ObjNetwork.NetworkId + ">" + ObjNetwork.NetworkName + " </option>"
            }
        }
    });
    $("#ddlNetworksProcessed").append(HTMLNetworks);
    var _selCntid = 5;
    if ($('#US').is(':checked')) {
        _selCntid = 5;
    }
    else if ($('#CA').is(':checked')) {
        _selCntid = 2;
    }
    var _selClid = $("#ddlclients :selected").val();
    var _selQtrData = ($(".nav-link.active").html().split(' ')[0]).toString().substring(2, 1) + "Q" + $(".nav-link.active").html().split(' ')[1];
    for (var x = 0; x < ProcessedProposalsJson.length; x++) {
        HTML = HTML + '';
        //class="' + ProcessedProposalsJson[x].selectionType + '"
        HTML = HTML + '<tr id="trNetwork_' + ProcessedProposalsJson[x].networkId + '" file-name="' + ProcessedProposalsJson[x].sourceFile + '">';
        HTML = HTML + '<td class="text-center"  style="width:180px;!important;" id="tdNetwork_' + ProcessedProposalsJson[x].networkId + '">' + ProcessedProposalsJson[x].networkName + '</td>';
        HTML = HTML + '<td class="text-center " style="width:110px;!important;"> <span style="color: #42a5f5;text-decoration: underline; cursor:pointer;" onclick="downloadDealpoint(\'' + _selClid + '\',\'' + _selQtrData + '\',\'' + ProcessedProposalsJson[x].networkId + '\',\'' + ProcessedProposalsJson[x].sourceFile + '\',\'' + _selCntid + '\',\'' + ProcessedProposalsJson[x].clientName + '\',\'' + ProcessedProposalsJson[x].networkName + '\');" netid-val=' + ProcessedProposalsJson[x].networkId + ' filename-val="' + ProcessedProposalsJson[x].sourceFile + '"   style="height:20px;width:20px;text-decoration: underline;" title="Deal: ' + ProcessedProposalsJson[x].deal.toString().substring(0, 12) + " (" + ProcessedProposalsJson[x].revision + ")" + '">' + ProcessedProposalsJson[x].deal.toString().substring(0, 12) + " (" + ProcessedProposalsJson[x].revision + ")" + '</span>';
        HTML = HTML + '<td class="text-center" style="width:270px;!important;"> ' + ProcessedProposalsJson[x].receivedDate + '</td> ';
        HTML = HTML + '<td class="text-center" style="width:100px;!important;"> ' + ProcessedProposalsJson[x].spots + '</td> ';
        HTML = HTML + '<td class="text-center" style="width:150px;!important;"> ' + $.fn.dataTable.render.number(',', '.', 2, '$').display(ProcessedProposalsJson[x].totalDollars) + '</td> ';
        HTML = HTML + '<td class="text-center" style="width:100px;!important;"> ' + ProcessedProposalsJson[x].imps + '</td> ';
        HTML = HTML + '<td class="text-center" style="width:100px;!important;"> ' + $.fn.dataTable.render.number(',', '.', 2, '$').display(ProcessedProposalsJson[x].cpm) + '</td> ';
        /*HTML = HTML + '<td class="text-center " style="dislplay:flex;width:100px!important;"><span style="margin-left:-8px;">' + capitalizeFirstLetter(ProcessedProposalsJson[x].selectionType) + '</span></td> ';*/
        HTML = HTML + '<td class="text-center" style="dislplay:flex;width:100px!important;">' + capitalizeFirstLetter(ProcessedProposalsJson[x].selectionType) + '</td> ';
        HTML = HTML + '</tr>';
    }
    $("#tbodyProcessedProposalTable").html(HTML);
   // $('#ProcessedProposalTable').DataTable();
    processedPropTable = $('#ProcessedProposalTable').DataTable({
        lengthMenu: [[20, 50, 75, 100], [20, 50, 75, 100]],
        'processing': true,
        'autoWidth': false,
        'scrollX': false,
        scrollCollapse: false,
        "rowHeight": '25px',
        "sDom": 'Rfrtlip',
        "order": [],
        'columnDefs': [{
            'targets': [7], // column index (start from 0)
            'orderable': false// set orderable false for selected columns
        }],
        initComplete: function (settings, json) {
            $("#ProcessedProposalTable_wrapper").prepend('<label  style="margin-top:10px;margin-left:15px;">Network:<select id="ddlNetworksProcessed2" onchange="FilterProcessedProposals();" style="margin-left:5px;" placeholder=""></select></label>');
            $("#ddlNetworksProcessed2").html($("#ddlNetworksProcessed").html());

        }

    });
   // $("#ProcessedProposalTable_info").text("Showing " + ProcessedProposalsJson.length + " of " + CurJsonData.filter(a => a.archived == false).length + " entries");

    $($("#ProcessedProposalTable th")[0]).width("180px");
    $($("#ProcessedProposalTable th")[1]).width("110px");
    $($("#ProcessedProposalTable th")[2]).width("270px");
    $($("#ProcessedProposalTable th")[3]).width("100px");
    $($("#ProcessedProposalTable th")[4]).width("150px");
    $($("#ProcessedProposalTable th")[5]).width("100px");
    $($("#ProcessedProposalTable th")[6]).width("100px");
    $($("#ProcessedProposalTable th")[7]).width("100px");

    $("#ProcessedProposalTable_info").css("float", "right");
    $("#ProcessedProposalTable_info").css("margin-top", "-42px");
    $("#ProcessedProposalTable_paginate").css("float", "left");
    $("#ProcessedProposalTable_paginate").css("margin-top", "-42px");
    $("#ProcessedProposalTable_length").css("margin-left", "50%");

    setTimeout(function () {
        $("#ProcessedProposalTable").closest("div").css("max-height", window.innerHeight - 350);
        $("#ProcessedProposalTable").closest("div").css("overflow-y", "auto");
        $("#ProcessedProposalTable").closest("div").css("overflow-x", "hidden");
        $("#tbodyProcessedProposalTable").show();
    }, 500);
    setTimeout(function () { HideOverlayPopup(); }, 2000);
    processedPropTable.on('length', function (e, settings, len) {
        var selectedNetwork = $("#ddlNetworksUnallocated2 option:selected").val();
        $("#tbodyProcessedProposalTable").hide();
        ShowOverlayPopup();
        processedFilteredHtml = "";

        var CurJsonData = selectedNetwork == -1 ? ProcessedProposalsJson : ProcessedProposalsJson.filter(o => o.networkId == selectedNetwork);
        var length = len > CurJsonData.length || len == -1 ? CurJsonData.length : len;
        for (var x = 0; x < length; x++) {
            processedFilteredHtml = processedFilteredHtml + '';
            processedFilteredHtml = processedFilteredHtml + '<tr id="trNetwork_' + CurJsonData[x].networkId + '" file-name="' + CurJsonData[x].sourceFile + '">';
            processedFilteredHtml = processedFilteredHtml + '<td class="text-center"  style="width:180px;!important;" id="tdNetwork_' + CurJsonData[x].networkId + '">' + CurJsonData[x].networkName + '</td>';
            processedFilteredHtml = processedFilteredHtml + '<td class="text-center " style="width:110px;!important;"> <span style="color: #42a5f5;text-decoration: underline; cursor:pointer;" onclick="downloadDealpoint(\'' + _selClid + '\',\'' + _selQtrData + '\',\'' + CurJsonData[x].networkId + '\',\'' + CurJsonData[x].sourceFile + '\',\'' + _selCntid + '\',\'' + CurJsonData[x].clientName + '\',\'' + CurJsonData[x].networkName + '\');" netid-val=' + CurJsonData[x].networkId + ' filename-val="' + CurJsonData[x].sourceFile + '"   style="height:20px;width:20px;text-decoration: underline;" title="Deal: ' + CurJsonData[x].deal.toString().substring(0, 12) + " (" + CurJsonData[x].revision + ")" + '">' + CurJsonData[x].deal.toString().substring(0, 12) + " (" + CurJsonData[x].revision + ")" + '</span>';
            processedFilteredHtml = processedFilteredHtml + '<td class="text-center" style="width:270px;!important;"> ' + CurJsonData[x].receivedDate + '</td> ';
            processedFilteredHtml = processedFilteredHtml + '<td class="text-center" style="width:100px;!important;"> ' + CurJsonData[x].spots + '</td> ';
            processedFilteredHtml = processedFilteredHtml + '<td class="text-center" style="width:150px;!important;"> ' + $.fn.dataTable.render.number(',', '.', 2, '$').display(CurJsonData[x].totalDollars) + '</td> ';
            processedFilteredHtml = processedFilteredHtml + '<td class="text-center" style="width:100px;!important;"> ' + CurJsonData[x].imps + '</td> ';
            processedFilteredHtml = processedFilteredHtml + '<td class="text-center" style="width:100px;!important;"> ' + $.fn.dataTable.render.number(',', '.', 2, '$').display(CurJsonData[x].cpm) + '</td> ';
            //processedFilteredHtml = processedFilteredHtml + '<td class="text-center " style="dislplay:flex;width:100px!important;"><span style="margin-left:-8px;">' + capitalizeFirstLetter(CurJsonData[x].selectionType) + '</span></td> ';
            processedFilteredHtml = processedFilteredHtml + '<td class="text-center" style="dislplay:flex;width:100px!important;">' + capitalizeFirstLetter(CurJsonData[x].selectionType) + '</td> ';
            processedFilteredHtml = processedFilteredHtml + '</tr>';
        }
        setTimeout(function () {
            $("#tbodyProcessedProposalTable").show();
            HideOverlayPopup();
        }, 300);
    });
}

function FilterProcessedProposals() {
    $("#ddlNetworksProcessed").val($("#ddlNetworksProcessed2").val());
    networkDropDownHtml = $("#ddlNetworksProcessed2").html();

    if ($.fn.dataTable.isDataTable('#ProcessedProposalTable'))
        $('#ProcessedProposalTable').DataTable().clear().destroy();
    var SelectNetID = $("#ddlNetworksProcessed").val();

    FilterDataProcessed = null;
    if (SelectNetID !== "-1") {
        FilterDataProcessed = ProcessedProposalsJson.filter(x => parseInt(x.networkId) === parseInt(SelectNetID));
    }
    else {
        FilterDataProcessed = ProcessedProposalsJson;
    }
    var _selCntid = 5;
    if ($('#US').is(':checked')) {
        _selCntid = 5;
    }
    else if ($('#CA').is(':checked')) {
        _selCntid = 2;
    }
    var _selClid = $("#ddlclients :selected").val();
    //alert(_selClientid);
    var _selQtrData = ($(".nav-link.active").html().split(' ')[0]).toString().substring(2, 1) + "Q" + $(".nav-link.active").html().split(' ')[1];
    var HTML = "";
    for (var x = 0; x < FilterDataProcessed.length; x++) {
        HTML = HTML + '';
        HTML = HTML + '<tr id="trNetwork_' + FilterDataProcessed[x].networkId + '" file-name="' + FilterDataProcessed[x].sourceFile + '">';
        HTML = HTML + '<td style="width:180px;!important;" class="text-center" id="tdNetwork_' + FilterDataProcessed[x].networkId + '">' + FilterDataProcessed[x].networkName + '</td>';
        HTML = HTML + '<td class="text-center " style="width:110px;!important;"> <span style="color: #42a5f5;text-decoration: underline; cursor:pointer;" onclick="downloadDealpoint(\'' + _selClid + '\',\'' + _selQtrData + '\',\'' + FilterDataProcessed[x].networkId + '\',\'' + FilterDataProcessed[x].sourceFile + '\',\'' + _selCntid + '\',\'' + FilterDataProcessed[x].clientName + '\',\'' + FilterDataProcessed[x].networkName + '\');" netid-val=' + FilterDataProcessed[x].networkId + ' filename-val="' + FilterDataProcessed[x].sourceFile + '"   style="height:20px;width:20px;text-decoration: underline;" title="Deal: ' + FilterDataProcessed[x].deal.toString().substring(0, 12) + " (" + FilterDataProcessed[x].revision + ")" + '">' + FilterDataProcessed[x].deal.toString().substring(0, 12) + " (" + FilterDataProcessed[x].revision + ")" + '</span>';
        HTML = HTML + '<td class="text-center" style="width:270px;!important;"> ' + FilterDataProcessed[x].receivedDate + '</td> ';
        HTML = HTML + '<td class="text-center" style="width:100px;!important;"> ' + FilterDataProcessed[x].spots + '</td> ';
        HTML = HTML + '<td class="text-center" style="width:150px;!important;"> ' + $.fn.dataTable.render.number(',', '.', 2, '$').display(FilterDataProcessed[x].totalDollars) + '</td> ';
        HTML = HTML + '<td class="text-center" style="width:100px;!important;"> ' + FilterDataProcessed[x].imps + '</td> ';
        HTML = HTML + '<td class="text-center" style="width:100px;!important;"> ' + $.fn.dataTable.render.number(',', '.', 2, '$').display(FilterDataProcessed[x].cpm) + '</td> ';
        //HTML = HTML + '<td class="text-center " style="dislplay:flex;width:100px!important;"><span style="margin-left:-8px;">' + capitalizeFirstLetter(FilterDataProcessed[x].selectionType) + '</span></td> ';
        HTML = HTML + '<td class="text-center" style="dislplay:flex;width:100px!important;">' + capitalizeFirstLetter(FilterDataProcessed[x].selectionType) + '</td> ';
        HTML = HTML + '</tr>';
    }
    $("#tbodyProcessedProposalTable").html(HTML);
    $('#ProcessedProposalTable').DataTable({
        lengthMenu: [[20, 50, 75, 100], [20, 50, 75, 100]],
        'processing': true,
        'autoWidth': false,
        "rowHeight": '25px',
        "sDom": 'Rfrtlip',
        // dom: '<"bottom"i>rt<"bottom"flp>',
        'columnDefs': [{
            'bSortable': false, "aTargets": [0, 1, 2],
            'targets': [7], // column index (start from 0)
            'orderable': false, // set orderable false for selected columns
        }],
        fixedColumns: {
            heightMatch: 'none'
        },
        initComplete: function (settings, json) {
            $("#ProcessedProposalTable_wrapper").prepend('<label style="margin-top:10px;margin-left:15px;">Network:<select id="ddlNetworksProcessed2" onchange="FilterProcessedProposals();"  style="margin-left:5px;" placeholder=""></select></label>');
            $("#ddlNetworksProcessed2").html(networkDropDownHtml);
            $("#ddlNetworksProcessed2").val(SelectNetID);
            setTimeout(function () {
                $("#ProcessedProposalTable tr td").css("background", "white");
            }, 500);
        }
    });
    //$("#ProcessedProposalTable_info").text("Showing " + FilterDataProcessed.filter(a => a.archived == true).length + " of " + ProcessedProposalsJson.filter(a => a.archived == true).length + " entries");
    $($("#ProcessedProposalTable th")[0]).width("180px");
    $($("#ProcessedProposalTable th")[1]).width("110px");
    $($("#ProcessedProposalTable th")[2]).width("270px");
    $($("#ProcessedProposalTable th")[3]).width("100px");
    $($("#ProcessedProposalTable th")[4]).width("150px");
    $($("#ProcessedProposalTable th")[5]).width("100px");
    $($("#ProcessedProposalTable th")[6]).width("100px");
    $($("#ProcessedProposalTable th")[7]).width("100px");

    $("#ProcessedProposalTable_info").css("float", "right");
    $("#ProcessedProposalTable_info").css("margin-top", "-42px");
    $("#ProcessedProposalTable_paginate").css("float", "left");
    $("#ProcessedProposalTable_paginate").css("margin-top", "-42px");
    $("#ProcessedProposalTable_length").css("margin-left", "50%");

    setTimeout(function () {
        $("#ProcessedProposalTable").closest("div").css("max-height", window.innerHeight - 350);
        $("#ProcessedProposalTable").closest("div").css("overflow-y", "auto");
        $("#ProcessedProposalTable").closest("div").css("overflow-x", "hidden");
    }, 1500);
}
// ST-691 Processed Proposal Functions End Here


// ST-724 Open Proposal NetworkPopup Function Start Here

function OpenProposalNetworkPopup(param1, param2, param3, Mode, checktype) {
    LoadProposalNetworkData(param1, param2, param3, Mode, checktype);
}

function LoadProposalNetworkData(ScheduleId, param2, param3, Mode, checktype) {
    var _selCountryid = 5;
    if ($('#US').is(':checked')) {
        _selCountryid = 5;
    }
    else if ($('#CA').is(':checked')) {
        _selCountryid = 2;
    }
    var _selClientid = $("#ddlclients :selected").val();
    var _selClientName = $("#ddlclients :selected").text();
    //alert(_selClientid);
    var _selQtr = ($(".nav-link.active").html().split(' ')[0]).toString().substring(2, 1) + "Q" + $(".nav-link.active").html().split(' ')[1];
    $.ajax({
        url: "/ScheduleProposal/GetNetworkListForSchedule",
        data: {
            ClientId: _selClientid,
            ScheduleId: ScheduleId                        
        },
        cache: false,
        type: "GET",
        success: function (result) {
            var responseMsg = result.responseText;
            if (result != null && result != undefined && result.success) {
                $("#ProposalNetworkHeading").html("Edit Proposal: " + _selClientName + " - " + _selQtr);
                $('#modal-ProposalNetwork').modal({ backdrop: 'static', keyboard: false }, 'show');
                $("#modal-ProposalNetwork").draggable();
                ProposalsNetworkList = result.networkList;
                BindProposalNetworkData(ScheduleId, param2, param3, Mode, checktype);
            }
            else {
                swal({
                    title: "Wait",
                    html: responseMsg,
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Ok',
                    showLoaderOnConfirm: true,
                    allowOutsideClick: false,
                    preConfirm: function () {
                        return new Promise(function (resolve) {
                            setTimeout(function () {
                                window.location.reload();
                            }, 50);
                        });
                    }
                });
            }
        },
        error: function (response) {
           // BindProposalNetworkData(networkList);
            swal({
                title: "Error",
                html: "There is  some error during the processing of your request. Please try again",
                type: 'error',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ok',
                showLoaderOnConfirm: true,
                allowOutsideClick: false,
                preConfirm: function () {
                    return new Promise(function (resolve) {
                        setTimeout(function () {
                            window.location.reload();
                        }, 50);
                    });
                }
            });
        }
    });
}

function BindProposalNetworkData(ScheduleId, param2, param3, Mode, checktype) {
    var HTML = "";
    HTML = HTML + '';
    HTML = HTML + ' <tbody>';
    for (var x = 0; x < ProposalsNetworkList.length; x++) {
        if (ProposalsNetworkList[x].checkedVal == 'checked') {
            var chkid = "";
            chkid = ('chk_' + ScheduleId + '_' + ProposalsNetworkList[x].networkId + '');
            SelectedValue.push(chkid);
            SelectedValue.join(", ");
        }
        HTML = HTML + '<tr>';
        if (ProposalsNetworkList[x].selectionDisabled == "disabled") {
            HTML = HTML + '<td><div style="vertical-align: middle;"><input style="vertical-align:middle;" netid-val="' + ProposalsNetworkList[x].networkId + '"  type="checkbox" id ="chk_' + ScheduleId + '_' + ProposalsNetworkList[x].networkId + '" ' + ProposalsNetworkList[x].checkedVal + ' disabled class="proposal-table-checkbox" />';
        }
        else {
            HTML = HTML + '<td><div style="vertical-align: middle;"><input style="vertical-align:middle;" netid-val="' + ProposalsNetworkList[x].networkId + '" type="checkbox" id ="chk_' + ScheduleId + '_' + ProposalsNetworkList[x].networkId + '" ' + ProposalsNetworkList[x].checkedVal + ' onchange = "return GetSelectedValue(this,' + ProposalsNetworkList[x].networkId +');" class="proposal-table-checkbox" />';
        }
        HTML = HTML + '<label style="vertical-align:sub;"   class="proposal-table-label" for="chk_' + ScheduleId + '_' + ProposalsNetworkList[x].networkId + '" >' + ProposalsNetworkList[x].networkName+ '</label>';
        //if (ProposalsNetworkList[x].selectionDisabled == "disabled") {
        //    HTML = HTML + '<td> <label class="css-control css-control-sm css-control-primary css-checkbox">';
        //    HTML = HTML + ' <input class="css-control-input" type="checkbox" disabled netid-val="' + ProposalsNetworkList[x].networkId + '"  type="checkbox" name="chk_' + ScheduleId + '_' + ProposalsNetworkList[x].networkId + '" ' + ProposalsNetworkList[x].checkedVal + ' id ="chk_' + ScheduleId + '_' + ProposalsNetworkList[x].networkId + '" ' + ProposalsNetworkList[x].checkedVal + ' disabled>';
        //    HTML = HTML + '  <span class="css-control-indicator"></span> ' + ProposalsNetworkList[x].networkName;
        //    HTML = HTML + ' </label>';
        //}
        //else {
        //    HTML = HTML + '<td> <label class="css-control css-control-sm css-control-primary css-checkbox">';
        //    HTML = HTML + ' <input class="css-control-input" type="checkbox"  netid-val="' + ProposalsNetworkList[x].networkId + '"  type="checkbox" name="chk_' + ScheduleId + '_' + ProposalsNetworkList[x].networkId + '" ' + ProposalsNetworkList[x].checkedVal + ' id ="chk_' + ScheduleId + '_' + ProposalsNetworkList[x].networkId + '" ' + ProposalsNetworkList[x].checkedVal + ' disabled>';
        //    HTML = HTML + '  <span class="css-control-indicator"></span> ' + ProposalsNetworkList[x].networkName;
        //    HTML = HTML + ' </label>';
        //}
        HTML = HTML + '</div></td>';
        HTML = HTML + '<td><label  class="proposal-table-label" >' + ProposalsNetworkList[x].lockedByUserName + '</label></td>';
        HTML = HTML + '</tr >';
        
    }
    HTML = HTML + '</tbody>';
    $("#ProposalNetworksList").html(HTML);
}

function GetSelectedValue(ctrl,selnetId) {   
    //SelectedValue.push(param.id);
    //var str = SelectedValue.join(",");
    if ($(ctrl).prop("checked"))
        ProposalsNetworkList.filter(o => o.networkId == selnetId)[0].checkedVal = "checked";
    else
        ProposalsNetworkList.filter(o => o.networkId == selnetId)[0].checkedVal = "";

}


function SaveProposalNetworkData() {

    var ScheduleId = [];
    var NetworkId = [];
    var SelNetworkId = ProposalsNetworkList.filter(o => o.checkedVal == "checked" && o.selectionDisabled == "");
    if (SelNetworkId.length >0) {
        for (i = 0; i < SelNetworkId.length; i++) {
            SelectedData = SelNetworkId[i].networkId;
            ScheduleId.push(SelNetworkId[i].scheduleId);
            ScheduleId.join(",");
            NetworkId.push(SelNetworkId[i].networkId);
            NetworkId.join(",");
        }
        var model = {
            NetworkIdList: NetworkId,
            ScheduleId: ProposalsNetworkList[0].scheduleId,
            TotalNetworks: ProposalsNetworkList.length
        };       
        $.ajax({
            url: "/ScheduleProposal/InsertProposalLockDetail",
            data: model,
            cache: false,
            type: "POST",
            success: function (result) {
                if (result != null && result != undefined && result == "") {
                    alreadyLocked = 1;
                    $("#modal-ProposalNetwork").modal('hide');
                    OpenProposalPartial(ProposalsNetworkList[0].scheduleId, window.location.origin + "/ScheduleProposal/EditProposal?ProposalId=" + ProposalsNetworkList[0].scheduleId, '/ManageMedia/Proposal?ProposalId=' + ProposalsNetworkList[0].scheduleId);
                }
                else { 
                    swal({
                        title: "warning",
                        html: result,
                        type: 'warning',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Ok',
                        showLoaderOnConfirm: true,
                        allowOutsideClick:false,
                        preConfirm: function () {
                            return new Promise(function (resolve) {
                                setTimeout(function () {
                                    window.location.reload();
                                }, 50);
                            });
                        }
                    });
                }
            },
            error: function (response) {
                //swal('Error!', response.responseText, 'warning');
            }
        });
    }
    else {
        alert("Please select at least one network to proceed");
        return false;
    }
}



function CloseProposalNetworkPopup() {
    $("#modal-ProposalNetwork").modal('hide');
}   


// ST-724 Open Proposal NetworkPopup Function End Here

