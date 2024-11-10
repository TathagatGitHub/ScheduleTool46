var _countryid = 5;
var currentUserId = 0;
var publishedData = [];
var publishedUserId = 0;
var mediaPlansJSON;
var Q4DataJson;
var Q3DataJson;
var Q2DataJson;
var Q1DataJson;
var QDataLoaded;
var Q3DataLoaded;
var Q2DataLoaded;
var Q1DataLoaded;
var resultQtrs = [];

$(document).ready(function () {
    $($("#page-footer >div")[0]).removeClass("content");
    $("#US").prop("checked", true);
    $("#CA").attr("disabled", true);
    if ($("#US").prop("checked")) {
        _countryid = 5;
    }
    else {
        _countryid = 2;
    }
    GetClients(5);
    GetQuarters();
    setTimeout(function () { GetMediaPlans(); }, 1000);
});
function GetQuarters() {
    $.ajax({
        url: "/CreateNewProperty/GetQuarters",
        data: {
            Year: $("#ddlplanyear").val()
        },
        cache: false,
        async: false,
        type: "POST",
        success: function (result) {
            resultQtrs = result;
        }
    });
}

function GetClients(_countryid) {
    var procemessage = "<option value='0'> Loading clients...</option>";
    $("#ddlclients").html(procemessage).show();

    var url = "/ManageMedia/GetClientsByCountryId/";

    $.ajax({
        url: url,
        data: { countryid: _countryid },
        cache: false,
        type: "POST",
        success: function (result) {
            var markup = "";

            for (var x = 0; x < result.length; x++) {
                if ($("#hdnLastSelectedClientId").val() == result[x].value) {
                    if (_countryid == 5)
                        markup += "<option selected value=" + result[x].value + ">" + result[x].text + "</option>";
                    else
                        markup += "<option selected value=" + result[x].value + ">" + result[x].text + " (CANADA)" + "</option>";
                }
                else {
                    if (_countryid == 5)
                        markup += "<option value=" + result[x].value + ">" + result[x].text + "</option>";
                    else
                        markup += "<option value=" + result[x].value + ">" + result[x].text + " (CANADA)" + "</option>";
                }
            }
            $("#ddlclients").html(markup).show();

        },
        error: function (response) {
            swal("error : " + response.responseText);
        }
    });
}
function ChangeCountry(_countryid, _countryshort) {
    GetClients(_countryid);
    SaveSettings("PlanningLog_CountryId", _countryid);
    GetQuarters();
    setTimeout(function () { GetMediaPlans(); }, 2000);
}

function ChangePlanYear(_year) {
    SetupQuarters(_year);
    SaveSettings("PlanningLog_PlanYear", _year);
    GetQuarters();
    setTimeout(function () { GetMediaPlans(); }, 2000);

}

function ChangeClient(_clientid) {
    GetQuarters();
    setTimeout(function () { GetMediaPlans(); }, 2000);
    SaveSettings("PlanningLog_ClientId", _clientid);

}

function SetupQuarters(_year) {
    $("#Q4").html("Q4 " + (_year - 1)).show();
    $("#Q1").html("Q1 " + _year).show();
    $("#Q2").html("Q2 " + _year).show();
    $("#Q3").html("Q3 " + _year).show();
    $("#Q4").attr("data-val", "4Q" + (_year - 1));
    $("#Q1").attr("data-val", "1Q" + _year);
    $("#Q2").attr("data-val", "2Q" + _year);
    $("#Q3").attr("data-val", "3Q" + _year);
}

$("#Q1, #Q2, #Q3, #Q4").on('click', function (e) {
    SaveSettings("PlanningLog_BroadcastQuarterNbr", parseInt(this.id.slice(1)) == 4 ? 1 : parseInt(this.id.slice(1)) + 1);
});
function GetMediaPlans() {
    //$("#btabs-animated-slideup-1q,#btabs-animated-slideup-2q,#btabs-animated-slideup-3q,#btabs-animated-slideup-4q").html("");
    ShowOverlayMedia();
    var _selQtr = ($(".nav-link.active").html().split(' ')[0]).toString().substring(2, 1) + "Q" + $(".nav-link.active").html().split(' ')[1];
    setTimeout(function () {
        var url = "/MediaPlan/GetMediaPlanByClient/";
        $.ajax({
            url: url,
            data: {
                clientid: $("#ddlclients").val(),
                broadcastyr: $("#ddlplanyear").val()
            },
            cache: false,
            type: "GET",
            success: function (result) {
                var markup = "";
                if (result) {
                    currentUserId = result.currentUserId;                    
                    mediaPlansJSON = result.mediaPlans;
                    setTimeout(function () {
                        BindMediaPlanDashboard(mediaPlansJSON);
                        // InitMediaPlanDashboard(mediaPlansJSON);
                    }, 1000);
                    console.log(result);
                }

            },
            error: function (response) {
                HideOverlayMedia();
                swal('Wait ...', response, 'error');
            }
        });
    }, 200);
}

function BindMediaPlanDashboard(result) {

    Q4DataJson = result.filter(o => o.broadcastQuarterNbr == 1);
    Q1DataJson = result.filter(o => o.broadcastQuarterNbr == 2);
    Q2DataJson = result.filter(o => o.broadcastQuarterNbr == 3);
    Q3DataJson = result.filter(o => o.broadcastQuarterNbr == 4);
    Q1DataLoaded = false;
    Q2DataLoaded = false;
    Q3DataLoaded = false;
    Q4DataLoaded = false;
    if ($("#Q4").hasClass("active")) {
        if (resultQtrs.filter(o => o.text.toLowerCase().indexOf("4q") > -1).length > 0)
            $("#ancCreateMediaPlan, #btnCopyMediaPlanModal").show();                   
        else
            $("#ancCreateMediaPlan, #btnCopyMediaPlanModal").hide();
        Q4DataLoaded = true;
        InitMediaPlanDashboard4Q();
    }
    if ($("#Q1").hasClass("active")) {
        if (resultQtrs.filter(o => o.text.toLowerCase().indexOf("1q") > -1).length > 0)
            $("#ancCreateMediaPlan, #btnCopyMediaPlanModal").show();
        else
            $("#ancCreateMediaPlan, #btnCopyMediaPlanModal").hide();
        Q1DataLoaded = true;
        InitMediaPlanDashboard1Q();
    }
    if ($("#Q2").hasClass("active")) {
        if (resultQtrs.filter(o => o.text.toLowerCase().indexOf("2q") > -1).length > 0)
            $("#ancCreateMediaPlan, #btnCopyMediaPlanModal").show();
        else
            $("#ancCreateMediaPlan, #btnCopyMediaPlanModal").hide();
        Q2DataLoaded = true;
        InitMediaPlanDashboard2Q();
    }
    if ($("#Q3").hasClass("active")) {
        if (resultQtrs.filter(o => o.text.toLowerCase().indexOf("3q") > -1).length > 0)
            $("#ancCreateMediaPlan, #btnCopyMediaPlanModal").show();
        else
            $("#ancCreateMediaPlan, #btnCopyMediaPlanModal").hide();
        Q3DataLoaded = true;
        InitMediaPlanDashboard3Q();
    }

}
function InitMediaPlanDashboard4Q() {
    publishedData = Q4DataJson.filter(o => o.planStatus == "Published");
    publishedUserId = publishedData.length > 0 ? publishedData[0].lockedByUserId : 0;

    ShowOverlayMedia();
    var Pagelength = 10;
    var Currpagelength = localStorage.getItem("tblPlans4Q_PageLength");
    if (Currpagelength !== null && Currpagelength !== undefined) {
        Pagelength = Currpagelength
    }
    if (parseInt(Pagelength) != 10) {
        if (Q4DataJson.length > 10) {
            tableWidth = "1940px";
        }
    }
    $('#tblPlans4Q').DataTable({
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
        pageLength: parseInt(Pagelength),
        data: Q4DataJson,
        "aaSorting": [[6, "desc"], [1, "asc"], [9, "desc"]],
        destroy: true,
        autoWidth: false,
        sDom: 'Rfrtlip',
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            if (aData.planStatus == "Published") {
                $(nRow).addClass('row-published');
            }
        },
        columnDefs: [
            { orderable: false, targets: '_all' }

        ],
        fixedHeader: true,
        columns: [
            {
                targets: 0,
                data: "mediaPlanId",
                visible: false,
                searchable: false
            },
            {
                targets: 1,
                class: "text-left",
                data: "mediaPlanName",
                searchable: false,
                render: ellipsis(50, true)
            },
            {
                targets: 2,
                data: "grossBudget",
                class: "d-none d-sm-table-cell text-right",
                render: $.fn.dataTable.render.number(',', '.', 2, '$')
            },
            {
                targets: 3,
                data: "currentSpend",
                class: "d-none d-sm-table-cell text-right",
                render: function (data, type, row, meta) {
                    if (parseFloat(row.currentSpend) > 0) {
                        if (parseFloat(row.currentSpend) > parseFloat(row.grossBudget)) {
                            return "<span class='overbudget'>" + $.fn.dataTable.render.number(',', '.', 2, '$').display(data); +"</span>";
                        }
                        else {
                            return "<span>" + $.fn.dataTable.render.number(',', '.', 2, '$').display(data); +"</span>"
                        }
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                targets: 4,
                class: "d-none d-sm-table-cell text-left",
                data: "selectedBTGroups",
                searchable: false
            },
            {
                targets: 5,
                class: "d-none d-sm-table-cell text-left",
                data: "selectedNetworks",
                searchable: false
            },
            {
                targets: 6,
                class: "d-none d-sm-table-cell text-left",
                data: "planStatus",
                searchable: false
            },
            {
                targets: 7,
                class: "d-none d-sm-table-cell text-left",
                data: "lockedByUserName",
                searchable: false
            },
            {
                targets: [8],
                class: "text-justify",
                render: (data, type, row) => {
                    var actionData = '';
                    var disableEdit = row.lockedByUserId != 0 && row.lockedByUserId != currentUserId ? 'onclick="return false;"' : 'onclick="return OpenMediaPlanSummary(this);"';
                    var disablePublish = row.lockedByUserId != 0 && row.lockedByUserId != currentUserId ? 'onclick="return false;"' : 'onclick="return ToggleMediaPlanStatus(this);"';
                    var disableDelete = row.lockedByUserId != 0 && row.lockedByUserId != currentUserId ? 'onclick="return false;"' : 'onclick="return DeleteMediaPlan(this);"';                    
                    var disableStyleEdit = row.lockedByUserId != 0 && row.lockedByUserId != currentUserId ? 'cursor: not-allowed;color:#d1d1d1;' : '';
                    var disableStylePublish = row.lockedByUserId != 0 && row.lockedByUserId != currentUserId ? 'cursor: not-allowed;' : '';                   
                    var disableStyleDelete = row.lockedByUserId != 0 && row.lockedByUserId != currentUserId ? 'cursor: not-allowed;color:#d1d1d1;' : '';
                    var isPublishedByCurrentUser = (publishedUserId == currentUserId && publishedUserId != 0) ? true : false;
                    actionData = actionData + '<a href="javascript:void(0);" ' + disableEdit + ' data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '"  data-status=\"' + row.planStatus + '" title="Edit Media Plan" style="color:black;padding-right: 10%;padding-left: 6%;"><i class="fa fa-pencil fa-2x" style="' + disableStyleEdit + '" aria-expanded="true"></i></a>';
                    actionData = actionData + '<a href="javascript:void(0);" data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '"  data-status=\"' + row.planStatus + '" title="Copy Media Plan"  onclick="return CopyMediaPlan(this);" style="color:black;padding-right: 10%;"><i class="fa fa-copy fa-2x" aria-expanded="true"></i></a>';
                    if (isPublishedByCurrentUser) {
                        if (row.planStatus.toString().toLowerCase() == "published") {
                            actionData = actionData + '<a href="javascript:void(0);" ' + disablePublish + ' data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '" data-status=\"' + row.planStatus + '" title="Unpublish Media Plan" style="padding-right: 10%;"><i class="fa fa-star fa-2x" style="font-size:2.5em;color:#42a5f5!important;' + disableStylePublish + '" aria-expanded="true"></i></a>';
                        }
                        else {
                            actionData = actionData + '<a href="javascript:void(0);" ' + disablePublish + ' data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '"  data-status=\"' + row.planStatus + '" title="Publish Media Plan"  style="padding-right: 10%;"><i style="color:#d1d1d1;font-size:2.5em;' + disableStylePublish + '" class="fa fa-star-o fa-2x" aria-expanded="true"></i></a>';
                        }
                    }
                    else {
                        if (row.planStatus.toString().toLowerCase() == "published") {
                            if (publishedUserId == 0) {
                                actionData = actionData + '<a href="javascript:void(0);" ' + disablePublish + ' data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '" data-status=\"' + row.planStatus + '" title="Unpublish Media Plan" style="padding-right: 10%;"><i class="fa fa-star fa-2x" style="font-size:2.5em;color:#42a5f5!important;' + disableStylePublish + '" aria-expanded="true"></i></a>';

                            }
                            else {
                                actionData = actionData + '<a href="javascript:void(0);" onclick="return false;" data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '" data-status=\"' + row.planStatus + '" title="Unpublish Media Plan" style="padding-right: 10%;"><i class="fa fa-star fa-2x" style="font-size:2.5em;color:#42a5f5!important;cursor: not-allowed;" aria-expanded="true"></i></a>';
                            }
                        }
                        else {
                            if (publishedUserId == 0) {
                                actionData = actionData + '<a href="javascript:void(0);" ' + disablePublish + ' data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '"  data-status=\"' + row.planStatus + '" title="Publish Media Plan"  style="padding-right: 10%;"><i style="color:#d1d1d1;font-size:2.5em;' + disableStylePublish + '" class="fa fa-star-o fa-2x" aria-expanded="true"></i></a>';

                            }
                            else {
                                actionData = actionData + '<a href="javascript:void(0);" onclick="return false;" data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '"  data-status=\"' + row.planStatus + '" title="Publish Media Plan"  style="padding-right: 10%;"><i style="color:#d1d1d1;font-size:2.5em;cursor: not-allowed;" class="fa fa-star-o fa-2x" aria-expanded="true"></i></a>';
                            }
                        }
                    }
                    
                    //d1d1d1
                    if (row.planStatus.toString().toLowerCase() == "published") {
                        actionData = actionData + '<a  data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '"  data-status=\"' + row.planStatus + '" title="Published Media plan cannot be deleted" style="color:#d1d1d1;"><i class="fa fa-trash fa-2x" aria-expanded="true"></i></a>';
                    }
                    else {
                        actionData = actionData + '<a href="javascript:void(0);" ' + disableDelete + ' data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '"  title="Delete Media plan" data-status=\"' + row.planStatus + '" style="color:black;"><i class="fa fa-trash fa-2x" style="' + disableStyleDelete + '" aria-expanded="true"></i></a>';
                    }
                    return actionData;
                },

            },
            {
                targets: 9,
                class: "d-none d-sm-table-cell text-left",
                data: "parentPlanId",
                searchable: false,
                visible: false
            }

        ],
        initComplete: function (settings, json) {
            setTimeout(function () {
                $("#tblPlans4Q_filter").hide();
                $("#tblPlans4Q_info").css("float", "right");
                $("#tblPlans4Q_info").css("margin-top", "-37px");
                $("#tblPlans4Q_paginate").css("float", "left");
                $("#tblPlans4Q_paginate").css("margin-top", "-37px");
                $("#tblPlans4Q_length").css("margin-left", "45%");
                $("#tblPlans4Q_length").css("padding-top", "0.5%");
                $("#tblPlans4Q").show();
                $("#tblPlans4Q thead tr th").removeClass("sorting_asc");
                $(".sorting_asc").removeClass("sorting_asc");
                $(".sorting_desc").removeClass("sorting_desc");
                $("#tblPlans4Q_wrapper select").change(function () {
                    localStorage.setItem('tblPlans4Q_PageLength', $(this).val())
                });
                if (Q4DataJson.filter(o => o.planStatus.toLowerCase() == 'published').length > 0) {
                    $($("#tblPlans4Q tbody tr")[0]).css("bacckground-color", "#d3eafd !important");
                }
                HideOverlayMedia();
            }, 1000);
        },
        scrollX: false,
        scrollCollapse: false
    });
}

function InitMediaPlanDashboard1Q() {
    publishedData = Q1DataJson.filter(o => o.planStatus == "Published");
    publishedUserId = publishedData.length > 0 ? publishedData[0].lockedByUserId : 0;
    ShowOverlayMedia();
    var Pagelength = 10;
    var Currpagelength = localStorage.getItem("tblPlans1Q_PageLength");
    if (Currpagelength !== null && Currpagelength !== undefined) {
        Pagelength = Currpagelength
    }
    $('#tblPlans1Q').DataTable({
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
        pageLength: parseInt(Pagelength),
        data: Q1DataJson,
        "aaSorting": [[6, "desc"], [1, "asc"], [9, "desc"]],
        destroy: true,
        autoWidth: false,
        sDom: 'Rfrtlip',
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            if (aData.planStatus == "Published") {
                $(nRow).addClass('row-published');
            }
        },
        columnDefs: [
            { orderable: false, targets: '_all' }

        ],
        fixedHeader: true,
        columns: [
            {
                targets: 0,
                data: "mediaPlanId",
                visible: false,
                searchable: false
            },
            {
                targets: 1,
                class: "text-left",
                data: "mediaPlanName",
                searchable: false,
                render: ellipsis(50, true)
            },
            {
                targets: 2,
                data: "grossBudget",
                class: "d-none d-sm-table-cell text-right",
                render: $.fn.dataTable.render.number(',', '.', 2, '$')
            },
            {
                targets: 3,
                data: "currentSpend",
                class: "d-none d-sm-table-cell text-right",
                render: function (data, type, row, meta) {
                    if (parseFloat(row.currentSpend) > 0) {
                        if (parseFloat(row.currentSpend) > parseFloat(row.grossBudget)) {
                            return "<span class='overbudget'>" + $.fn.dataTable.render.number(',', '.', 2, '$').display(data); +"</span>";
                        }
                        else {
                            return "<span>" + $.fn.dataTable.render.number(',', '.', 2, '$').display(data); +"</span>"
                        }
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                targets: 4,
                class: "d-none d-sm-table-cell text-left",
                data: "selectedBTGroups",
                searchable: false
            },
            {
                targets: 5,
                class: "d-none d-sm-table-cell text-left",
                data: "selectedNetworks",
                searchable: false
            },
            {
                targets: 6,
                class: "d-none d-sm-table-cell text-left",
                data: "planStatus",
                searchable: false
            },
            {
                targets: 7,
                class: "d-none d-sm-table-cell text-left",
                data: "lockedByUserName",
                searchable: false
            },
            {
                targets: [8],
                class: "text-justify",
                render: (data, type, row) => {
                    var actionData = '';
                    var disableEdit = row.lockedByUserId != 0 && row.lockedByUserId != currentUserId ? 'onclick="return false;"' : 'onclick="return OpenMediaPlanSummary(this);"';
                    var disablePublish = row.lockedByUserId != 0 && row.lockedByUserId != currentUserId ? 'onclick="return false;"' : 'onclick="return ToggleMediaPlanStatus(this);"';
                    var disableDelete = row.lockedByUserId != 0 && row.lockedByUserId != currentUserId ? 'onclick="return false;"' : 'onclick="return DeleteMediaPlan(this);"';
                    var disableStyleEdit = row.lockedByUserId != 0 && row.lockedByUserId != currentUserId ? 'cursor: not-allowed;color:#d1d1d1;' : '';
                    var disableStylePublish = row.lockedByUserId != 0 && row.lockedByUserId != currentUserId ? 'cursor: not-allowed;' : '';
                    var disableStyleDelete = row.lockedByUserId != 0 && row.lockedByUserId != currentUserId ? 'cursor: not-allowed;color:#d1d1d1;' : '';
                    var isPublishedByCurrentUser = (publishedUserId == currentUserId && publishedUserId != 0) ? true : false;
                    actionData = actionData + '<a href="javascript:void(0);" ' + disableEdit + ' data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '"  data-status=\"' + row.planStatus + '" title="Edit Media Plan" style="color:black;padding-right: 10%;padding-left: 6%;"><i class="fa fa-pencil fa-2x" style="' + disableStyleEdit + '" aria-expanded="true"></i></a>';
                    actionData = actionData + '<a href="javascript:void(0);" data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '"  data-status=\"' + row.planStatus + '" title="Copy Media Plan"  onclick="return CopyMediaPlan(this);" style="color:black;padding-right: 10%;"><i class="fa fa-copy fa-2x" aria-expanded="true"></i></a>';
                    if (isPublishedByCurrentUser) {
                        if (row.planStatus.toString().toLowerCase() == "published") {
                            actionData = actionData + '<a href="javascript:void(0);" ' + disablePublish + ' data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '" data-status=\"' + row.planStatus + '" title="Unpublish Media Plan" style="padding-right: 10%;"><i class="fa fa-star fa-2x" style="font-size:2.5em;color:#42a5f5!important;' + disableStylePublish + '" aria-expanded="true"></i></a>';
                        }
                        else {
                            actionData = actionData + '<a href="javascript:void(0);" ' + disablePublish + ' data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '"  data-status=\"' + row.planStatus + '" title="Publish Media Plan"  style="padding-right: 10%;"><i style="color:#d1d1d1;font-size:2.5em;' + disableStylePublish + '" class="fa fa-star-o fa-2x" aria-expanded="true"></i></a>';
                        }
                    }
                    else {
                        if (row.planStatus.toString().toLowerCase() == "published") {
                            if (publishedUserId == 0) {
                                actionData = actionData + '<a href="javascript:void(0);" ' + disablePublish + ' data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '" data-status=\"' + row.planStatus + '" title="Unpublish Media Plan" style="padding-right: 10%;"><i class="fa fa-star fa-2x" style="font-size:2.5em;color:#42a5f5!important;' + disableStylePublish + '" aria-expanded="true"></i></a>';

                            }
                            else {
                                actionData = actionData + '<a href="javascript:void(0);" onclick="return false;" data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '" data-status=\"' + row.planStatus + '" title="Unpublish Media Plan" style="padding-right: 10%;"><i class="fa fa-star fa-2x" style="font-size:2.5em;color:#42a5f5!important;cursor: not-allowed;" aria-expanded="true"></i></a>';
                            }
                        }
                        else {
                            if (publishedUserId == 0) {
                                actionData = actionData + '<a href="javascript:void(0);" ' + disablePublish + ' data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '"  data-status=\"' + row.planStatus + '" title="Publish Media Plan"  style="padding-right: 10%;"><i style="color:#d1d1d1;font-size:2.5em;' + disableStylePublish + '" class="fa fa-star-o fa-2x" aria-expanded="true"></i></a>';

                            }
                            else {
                                actionData = actionData + '<a href="javascript:void(0);" onclick="return false;" data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '"  data-status=\"' + row.planStatus + '" title="Publish Media Plan"  style="padding-right: 10%;"><i style="color:#d1d1d1;font-size:2.5em;cursor: not-allowed;" class="fa fa-star-o fa-2x" aria-expanded="true"></i></a>';
                            }
                        }
                    }

                    //d1d1d1
                    if (row.planStatus.toString().toLowerCase() == "published") {
                        actionData = actionData + '<a  data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '"  data-status=\"' + row.planStatus + '" title="Published Media plan cannot be deleted" style="color:#d1d1d1;"><i class="fa fa-trash fa-2x" aria-expanded="true"></i></a>';
                    }
                    else {
                        actionData = actionData + '<a href="javascript:void(0);" ' + disableDelete + ' data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '"  title="Delete Media plan" data-status=\"' + row.planStatus + '" style="color:black;"><i class="fa fa-trash fa-2x" style="' + disableStyleDelete + '" aria-expanded="true"></i></a>';
                    }
                    return actionData;
                },

            },
            {
                targets: 9,
                class: "d-none d-sm-table-cell text-left",
                data: "parentPlanId",
                searchable: false,
                visible: false
            }

        ],
        initComplete: function (settings, json) {

            setTimeout(function () {
                $("#tblPlans1Q_filter").hide();
                $("#tblPlans1Q_info").css("float", "right");
                $("#tblPlans1Q_info").css("margin-top", "-37px");
                $("#tblPlans1Q_paginate").css("float", "left");
                $("#tblPlans1Q_paginate").css("margin-top", "-37px");
                $("#tblPlans1Q_length").css("margin-left", "45%");
                $("#tblPlans1Q_length").css("padding-top", "0.5%");
                $("#tblPlans1Q thead tr th").removeClass("sorting_asc")
                $("#tblPlans1Q").show();

                $(".sorting_asc").removeClass("sorting_asc");
                $(".sorting_desc").removeClass("sorting_desc");
                $("#tblPlans1Q_wrapper select").change(function () {
                    localStorage.setItem('tblPlans1Q_PageLength', $(this).val())
                });

                HideOverlayMedia();

            }, 1000);
        },
        scrollX: false,
        scrollCollapse: false
    });
}
function InitMediaPlanDashboard2Q() {
    publishedData = Q2DataJson.filter(o => o.planStatus == "Published");
    publishedUserId = publishedData.length > 0 ? publishedData[0].lockedByUserId : 0;
    ShowOverlayMedia();
    var Pagelength = 10;

    var Currpagelength = localStorage.getItem("tblPlans2Q_PageLength");
    if (Currpagelength !== null && Currpagelength !== undefined) {
        Pagelength = Currpagelength;
    }

    $('#tblPlans2Q').DataTable({
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
        pageLength: parseInt(Pagelength),
        data: Q2DataJson,
        "aaSorting": [[6, "desc"], [1, "asc"], [9, "desc"]],
        destroy: true,
        autoWidth: false,
        sDom: 'Rfrtlip',
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            if (aData.planStatus == "Published") {
                $(nRow).addClass('row-published');
            }
        },
        columnDefs: [
            { orderable: false, targets: '_all' }

        ],
        fixedHeader: true,
        columns: [
            {
                targets: 0,
                data: "mediaPlanId",
                visible: false,
                searchable: false
            },
            {
                targets: 1,
                class: "text-left",
                data: "mediaPlanName",
                searchable: false,
                render: ellipsis(50, true)
            },
            {
                targets: 2,
                data: "grossBudget",
                class: "d-none d-sm-table-cell text-right",
                render: $.fn.dataTable.render.number(',', '.', 2, '$')
            },
            {
                targets: 3,
                data: "currentSpend",
                class: "d-none d-sm-table-cell text-right",
                //  render: $.fn.dataTable.render.number(',', '.', 2, '$')
                render: function (data, type, row, meta) {
                    if (parseFloat(row.currentSpend) > 0) {
                        if (parseFloat(row.currentSpend) > parseFloat(row.grossBudget)) {
                            return "<span class='overbudget'>" + $.fn.dataTable.render.number(',', '.', 2, '$').display(data); +"</span>";
                        }
                        else {
                            return "<span>" + $.fn.dataTable.render.number(',', '.', 2, '$').display(data); +"</span>"
                        }
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                targets: 4,
                class: "d-none d-sm-table-cell text-left",
                data: "selectedBTGroups",
                searchable: false
            },
            {
                targets: 5,
                class: "d-none d-sm-table-cell text-left",
                data: "selectedNetworks",
                searchable: false
            },
            {
                targets: 6,
                class: "d-none d-sm-table-cell text-left",
                data: "planStatus",
                searchable: false
            },
            {
                targets: 7,
                class: "d-none d-sm-table-cell text-left",
                data: "lockedByUserName",
                searchable: false
            },
            {
                targets: [8],
                class: "text-justify",
                render: (data, type, row) => {
                    var actionData = '';
                    var disableEdit = row.lockedByUserId != 0 && row.lockedByUserId != currentUserId ? 'onclick="return false;"' : 'onclick="return OpenMediaPlanSummary(this);"';
                    var disablePublish = row.lockedByUserId != 0 && row.lockedByUserId != currentUserId ? 'onclick="return false;"' : 'onclick="return ToggleMediaPlanStatus(this);"';
                    var disableDelete = row.lockedByUserId != 0 && row.lockedByUserId != currentUserId ? 'onclick="return false;"' : 'onclick="return DeleteMediaPlan(this);"';
                    var disableStyleEdit = row.lockedByUserId != 0 && row.lockedByUserId != currentUserId ? 'cursor: not-allowed;color:#d1d1d1;' : '';
                    var disableStylePublish = row.lockedByUserId != 0 && row.lockedByUserId != currentUserId ? 'cursor: not-allowed;' : '';
                    var disableStyleDelete = row.lockedByUserId != 0 && row.lockedByUserId != currentUserId ? 'cursor: not-allowed;color:#d1d1d1;' : '';
                    var isPublishedByCurrentUser = (publishedUserId == currentUserId && publishedUserId != 0) ? true : false;
                    actionData = actionData + '<a href="javascript:void(0);" ' + disableEdit + ' data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '"  data-status=\"' + row.planStatus + '" title="Edit Media Plan" style="color:black;padding-right: 10%;padding-left: 6%;"><i class="fa fa-pencil fa-2x" style="' + disableStyleEdit + '" aria-expanded="true"></i></a>';
                    actionData = actionData + '<a href="javascript:void(0);" data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '"  data-status=\"' + row.planStatus + '" title="Copy Media Plan"  onclick="return CopyMediaPlan(this);" style="color:black;padding-right: 10%;"><i class="fa fa-copy fa-2x" aria-expanded="true"></i></a>';
                    if (isPublishedByCurrentUser) {
                        if (row.planStatus.toString().toLowerCase() == "published") {
                            actionData = actionData + '<a href="javascript:void(0);" ' + disablePublish + ' data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '" data-status=\"' + row.planStatus + '" title="Unpublish Media Plan" style="padding-right: 10%;"><i class="fa fa-star fa-2x" style="font-size:2.5em;color:#42a5f5!important;' + disableStylePublish + '" aria-expanded="true"></i></a>';
                        }
                        else {
                            actionData = actionData + '<a href="javascript:void(0);" ' + disablePublish + ' data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '"  data-status=\"' + row.planStatus + '" title="Publish Media Plan"  style="padding-right: 10%;"><i style="color:#d1d1d1;font-size:2.5em;' + disableStylePublish + '" class="fa fa-star-o fa-2x" aria-expanded="true"></i></a>';
                        }
                    }
                    else {
                        if (row.planStatus.toString().toLowerCase() == "published") {
                            if (publishedUserId == 0) {
                                actionData = actionData + '<a href="javascript:void(0);" ' + disablePublish + ' data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '" data-status=\"' + row.planStatus + '" title="Unpublish Media Plan" style="padding-right: 10%;"><i class="fa fa-star fa-2x" style="font-size:2.5em;color:#42a5f5!important;' + disableStylePublish + '" aria-expanded="true"></i></a>';

                            }
                            else {
                                actionData = actionData + '<a href="javascript:void(0);" onclick="return false;" data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '" data-status=\"' + row.planStatus + '" title="Unpublish Media Plan" style="padding-right: 10%;"><i class="fa fa-star fa-2x" style="font-size:2.5em;color:#42a5f5!important;cursor: not-allowed;" aria-expanded="true"></i></a>';
                            }
                        }
                        else {
                            if (publishedUserId == 0) {
                                actionData = actionData + '<a href="javascript:void(0);" ' + disablePublish + ' data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '"  data-status=\"' + row.planStatus + '" title="Publish Media Plan"  style="padding-right: 10%;"><i style="color:#d1d1d1;font-size:2.5em;' + disableStylePublish + '" class="fa fa-star-o fa-2x" aria-expanded="true"></i></a>';

                            }
                            else {
                                actionData = actionData + '<a href="javascript:void(0);" onclick="return false;" data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '"  data-status=\"' + row.planStatus + '" title="Publish Media Plan"  style="padding-right: 10%;"><i style="color:#d1d1d1;font-size:2.5em;cursor: not-allowed;" class="fa fa-star-o fa-2x" aria-expanded="true"></i></a>';
                            }
                        }
                    }

                    //d1d1d1
                    if (row.planStatus.toString().toLowerCase() == "published") {
                        actionData = actionData + '<a  data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '"  data-status=\"' + row.planStatus + '" title="Published Media plan cannot be deleted" style="color:#d1d1d1;"><i class="fa fa-trash fa-2x" aria-expanded="true"></i></a>';
                    }
                    else {
                        actionData = actionData + '<a href="javascript:void(0);" ' + disableDelete + ' data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '"  title="Delete Media plan" data-status=\"' + row.planStatus + '" style="color:black;"><i class="fa fa-trash fa-2x" style="' + disableStyleDelete + '" aria-expanded="true"></i></a>';
                    }
                    return actionData;
                },

            },
            {
                targets: 9,
                class: "d-none d-sm-table-cell text-left",
                data: "parentPlanId",
                searchable: false,
                visible: false
            }

        ],


        initComplete: function (settings, json) {

            setTimeout(function () {
                $("#tblPlans2Q_filter").hide();
                $("#tblPlans2Q_info").css("float", "right");
                $("#tblPlans2Q_info").css("margin-top", "-37px");
                $("#tblPlans2Q_paginate").css("float", "left");
                $("#tblPlans2Q_paginate").css("margin-top", "-37px");
                $("#tblPlans2Q_length").css("margin-left", "45%");
                $("#tblPlans2Q_length").css("padding-top", "0.5%");
                $("#tblPlans2Q thead tr th").removeClass("sorting_asc")
                $("#tblPlans2Q").show();
                // $("#tblPlans2Q").css("width", tableWidth);
                $(".sorting_asc").removeClass("sorting_asc");
                $(".sorting_desc").removeClass("sorting_desc");
                $("#tblPlans2Q_wrapper select").change(function () {
                    localStorage.setItem('tblPlans2Q_PageLength', $(this).val())
                });


                HideOverlayMedia();
            }, 1000);
        },
        scrollX: false,
        scrollCollapse: false
    });
}
function InitMediaPlanDashboard3Q() {
    publishedData = Q3DataJson.filter(o => o.planStatus == "Published");
    publishedUserId = publishedData.length > 0 ? publishedData[0].lockedByUserId : 0;
    ShowOverlayMedia();
    var Pagelength = 10;
    //  var tableWidth = "1969px";
    // var btnMarginright="0";
    var Currpagelength = localStorage.getItem("tblPlans3Q_PageLength");
    if (Currpagelength !== null && Currpagelength !== undefined) {
        Pagelength = Currpagelength;
    }

    $('#tblPlans3Q').DataTable({
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
        pageLength: parseInt(Pagelength),
        data: Q3DataJson,
        "aaSorting": [[6, "desc"], [1, "asc"], [9, "desc"]],
        destroy: true,
        autoWidth: false,
        sDom: 'Rfrtlip',
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            if (aData.planStatus == "Published") {
                $(nRow).addClass('row-published');
            }
        },

        columnDefs: [
            { orderable: false, targets: '_all' }

        ],
        fixedHeader: true,
        columns: [
            {
                targets: 0,
                data: "mediaPlanId",
                visible: false,
                searchable: false
            },
            {
                targets: 1,
                class: "text-left",
                data: "mediaPlanName",
                searchable: false,
                render: ellipsis(50, true)
            },
            {
                targets: 2,
                data: "grossBudget",
                class: "d-none d-sm-table-cell text-right",
                render: $.fn.dataTable.render.number(',', '.', 2, '$')
            },
            {
                targets: 3,
                data: "currentSpend",
                class: "d-none d-sm-table-cell text-right",
                //  render: $.fn.dataTable.render.number(',', '.', 2, '$')
                render: function (data, type, row, meta) {
                    if (parseFloat(row.currentSpend) > 0) {
                        if (parseFloat(row.currentSpend) > parseFloat(row.grossBudget)) {
                            return "<span class='overbudget'>" + $.fn.dataTable.render.number(',', '.', 2, '$').display(data); +"</span>";
                        }
                        else {
                            return "<span>" + $.fn.dataTable.render.number(',', '.', 2, '$').display(data); +"</span>"
                        }
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                targets: 4,
                class: "d-none d-sm-table-cell text-left",
                data: "selectedBTGroups",
                searchable: false
            },
            {
                targets: 5,
                class: "d-none d-sm-table-cell text-left",
                data: "selectedNetworks",
                searchable: false
            },
            {
                targets: 6,
                class: "d-none d-sm-table-cell text-left",
                data: "planStatus",
                searchable: false
            },
            {
                targets: 7,
                class: "d-none d-sm-table-cell text-left",
                data: "lockedByUserName",
                searchable: false
            },
            {
                targets: [8],
                class: "text-justify",
                render: (data, type, row) => {
                    var actionData = '';
                    var disableEdit = row.lockedByUserId != 0 && row.lockedByUserId != currentUserId ? 'onclick="return false;"' : 'onclick="return OpenMediaPlanSummary(this);"';
                    var disablePublish = row.lockedByUserId != 0 && row.lockedByUserId != currentUserId ? 'onclick="return false;"' : 'onclick="return ToggleMediaPlanStatus(this);"';
                    var disableDelete = row.lockedByUserId != 0 && row.lockedByUserId != currentUserId ? 'onclick="return false;"' : 'onclick="return DeleteMediaPlan(this);"';
                    var disableStyleEdit = row.lockedByUserId != 0 && row.lockedByUserId != currentUserId ? 'cursor: not-allowed;color:#d1d1d1;' : '';
                    var disableStylePublish = row.lockedByUserId != 0 && row.lockedByUserId != currentUserId ? 'cursor: not-allowed;' : '';
                    var disableStyleDelete = row.lockedByUserId != 0 && row.lockedByUserId != currentUserId ? 'cursor: not-allowed;color:#d1d1d1;' : '';
                    var isPublishedByCurrentUser = (publishedUserId == currentUserId && publishedUserId != 0) ? true : false;
                    actionData = actionData + '<a href="javascript:void(0);" ' + disableEdit + ' data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '"  data-status=\"' + row.planStatus + '" title="Edit Media Plan" style="color:black;padding-right: 10%;padding-left: 6%;"><i class="fa fa-pencil fa-2x" style="' + disableStyleEdit + '" aria-expanded="true"></i></a>';
                    actionData = actionData + '<a href="javascript:void(0);" data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '"  data-status=\"' + row.planStatus + '" title="Copy Media Plan"  onclick="return CopyMediaPlan(this);" style="color:black;padding-right: 10%;"><i class="fa fa-copy fa-2x" aria-expanded="true"></i></a>';
                    if (isPublishedByCurrentUser) {
                        if (row.planStatus.toString().toLowerCase() == "published") {
                            actionData = actionData + '<a href="javascript:void(0);" ' + disablePublish + ' data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '" data-status=\"' + row.planStatus + '" title="Unpublish Media Plan" style="padding-right: 10%;"><i class="fa fa-star fa-2x" style="font-size:2.5em;color:#42a5f5!important;' + disableStylePublish + '" aria-expanded="true"></i></a>';
                        }
                        else {
                            actionData = actionData + '<a href="javascript:void(0);" ' + disablePublish + ' data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '"  data-status=\"' + row.planStatus + '" title="Publish Media Plan"  style="padding-right: 10%;"><i style="color:#d1d1d1;font-size:2.5em;' + disableStylePublish + '" class="fa fa-star-o fa-2x" aria-expanded="true"></i></a>';
                        }
                    }
                    else {
                        if (row.planStatus.toString().toLowerCase() == "published") {
                            if (publishedUserId == 0) {
                                actionData = actionData + '<a href="javascript:void(0);" ' + disablePublish + ' data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '" data-status=\"' + row.planStatus + '" title="Unpublish Media Plan" style="padding-right: 10%;"><i class="fa fa-star fa-2x" style="font-size:2.5em;color:#42a5f5!important;' + disableStylePublish + '" aria-expanded="true"></i></a>';

                            }
                            else {
                                actionData = actionData + '<a href="javascript:void(0);" onclick="return false;" data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '" data-status=\"' + row.planStatus + '" title="Unpublish Media Plan" style="padding-right: 10%;"><i class="fa fa-star fa-2x" style="font-size:2.5em;color:#42a5f5!important;cursor: not-allowed;" aria-expanded="true"></i></a>';
                            }
                        }
                        else {
                            if (publishedUserId == 0) {
                                actionData = actionData + '<a href="javascript:void(0);" ' + disablePublish + ' data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '"  data-status=\"' + row.planStatus + '" title="Publish Media Plan"  style="padding-right: 10%;"><i style="color:#d1d1d1;font-size:2.5em;' + disableStylePublish + '" class="fa fa-star-o fa-2x" aria-expanded="true"></i></a>';

                            }
                            else {
                                actionData = actionData + '<a href="javascript:void(0);" onclick="return false;" data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '"  data-status=\"' + row.planStatus + '" title="Publish Media Plan"  style="padding-right: 10%;"><i style="color:#d1d1d1;font-size:2.5em;cursor: not-allowed;" class="fa fa-star-o fa-2x" aria-expanded="true"></i></a>';
                            }
                        }
                    }

                    //d1d1d1
                    if (row.planStatus.toString().toLowerCase() == "published") {
                        actionData = actionData + '<a  data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '"  data-status=\"' + row.planStatus + '" title="Published Media plan cannot be deleted" style="color:#d1d1d1;"><i class="fa fa-trash fa-2x" aria-expanded="true"></i></a>';
                    }
                    else {
                        actionData = actionData + '<a href="javascript:void(0);" ' + disableDelete + ' data-id=\"' + row.mediaPlanId + '" data-qtr-id=\"' + row.quarterId + '" data-name=\"' + row.mediaPlanName + '"  title="Delete Media plan" data-status=\"' + row.planStatus + '" style="color:black;"><i class="fa fa-trash fa-2x" style="' + disableStyleDelete + '" aria-expanded="true"></i></a>';
                    }
                    return actionData;
                },

            },
            {
                targets: 9,
                class: "d-none d-sm-table-cell text-left",
                data: "parentPlanId",
                searchable: false,
                visible: false
            }

        ],


        initComplete: function (settings, json) {

            setTimeout(function () {
                $("#tblPlans3Q_filter").hide();
                $("#tblPlans3Q_info").css("float", "right");
                $("#tblPlans3Q_info").css("margin-top", "-37px");
                $("#tblPlans3Q_paginate").css("float", "left");
                $("#tblPlans3Q_paginate").css("margin-top", "-37px");
                $("#tblPlans3Q_length").css("margin-left", "45%");
                $("#tblPlans3Q_length").css("padding-top", "0.5%");
                $("#tblPlans3Q thead tr th").removeClass("sorting_asc")
                $("#tblPlans3Q").show();
                //$("#tblPlans3Q").css("width", tableWidth);
                $(".sorting_asc").removeClass("sorting_asc");
                $(".sorting_desc").removeClass("sorting_desc");
                $("#tblPlans3Q_wrapper select").change(function () {

                    localStorage.setItem('tblPlans3Q_PageLength', $(this).val())
                });
                HideOverlayMedia();
            }, 1000);
        },
        scrollX: false,
        scrollCollapse: false
    });
}

function CopyMediaPlan(ctrl) {
    var MediaPlanName = $(ctrl).attr("data-name");
    var MediaPlanId = $(ctrl).attr("data-id");
    swal({
        title: "Copy Media Plan",
        html: 'Are you sure you want to copy <strong>' + MediaPlanName + '</strong>?',
        type: 'warning',
        showCancelButton: true,
        width: 530,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
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
            PerformCopyMediaPlan(MediaPlanId);
        }, function (dismiss) {
            // dismiss can be 'cancel', 'overlay', 'esc' or 'timer'
        }
    );
    return false;
}
function ToggleMediaPlanStatus(ctrl) {
    var qtrId = $(ctrl).attr("data-qtr-id");
    var MediaPlanName = $(ctrl).attr("data-name");
    var MediaPlanId = $(ctrl).attr("data-id");
    var MediaPlanStatus = $(ctrl).attr("data-status");
    var publishedMediaPlanName = "";
    var publishedMediaPlanId = 0;
    var PopupTitle = "Publish Media Plan:";
    var PopupHTML = "";
    var publishedPlan = mediaPlansJSON.filter(o => o.planStatus.toLowerCase() == "published" && o.quarterId == qtrId)[0];
    if (MediaPlanStatus.toLowerCase() == "published") {
        PopupTitle = "Unpublish Media Plan:";
        PopupHTML = "Are you sure you want to unpublish <strong>" + MediaPlanName + "</strong>?";
    }
    else {
        PopupTitle = "Publish Media Plan"
        if (publishedPlan != null && publishedPlan != undefined) {
            publishedMediaPlanName = publishedPlan.mediaPlanName;
            publishedMediaPlanId = publishedPlan.mediaPlaId;
        }
        if (publishedMediaPlanName != null && publishedMediaPlanName != undefined && publishedMediaPlanName != "") {
            PopupHTML = "Are you sure you want to Publish <strong>" + MediaPlanName + "</strong>? This action will replace the currently selected published plan: <strong> " + publishedMediaPlanName + "</strong>.";
        }
        else {
            PopupHTML = "Are you sure you want to Publish <strong>" + MediaPlanName + "</strong>?";
        }
    }
    swal({
        title: PopupTitle,
        html: PopupHTML,
        type: 'warning',
        showCancelButton: true,
        width: 530,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        preConfirm: function () {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    resolve();
                }, 50);
            });
        }
    }).then(
        function (result) {
            PerformToggleMediaPlanStatus(MediaPlanId, MediaPlanStatus, publishedMediaPlanName, publishedMediaPlanId);
        }, function (dismiss) {
            // dismiss can be 'cancel', 'overlay', 'esc' or 'timer'
        }
    );
    return false;
}
function DeleteMediaPlan(ctrl) {
    var MediaPlanName = $(ctrl).attr("data-name");
    var MediaPlanId = $(ctrl).attr("data-id");
    swal({
        title: "Delete Media Plan",
        html: 'You are about to delete <strong>' + MediaPlanName + '</strong>. Do you wish to continue?',
        type: 'warning',
        showCancelButton: true,
        width: 530,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'No',
        confirmButtonText: 'Yes',
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        preConfirm: function () {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    resolve();
                }, 50);
            });
        }
    }).then(
        function (result) {
            PerformDeleteMediaPlan(MediaPlanId);
        }, function (dismiss) {
            // dismiss can be 'cancel', 'overlay', 'esc' or 'timer'
        }
    );
    return false;
}
function PerformCopyMediaPlan(MediaPlanId) {
    var _selQtr = ($(".nav-link.active").html().split(' ')[0]).toString().substring(2, 1) + "Q" + $(".nav-link.active").html().split(' ')[1];
    $.ajax({
        url: "/MediaPlan/CopyMediaPlan/",
        data: {
            mediaPlanid: MediaPlanId,
            clientid: $("#ddlclients").val(),
            qtrName: _selQtr
        },
        cache: false,
        type: "GET",
        success: function (result) {
            var markup = "";
            $("#btabs-animated-slideup-4q").html("");
            $("#btabs-animated-slideup-1q").html("");
            $("#btabs-animated-slideup-2q").html("");
            $("#btabs-animated-slideup-3q").html("");
            if (result != null && result != undefined && result.success) {
                window.location.reload();
                //GetMediaPlans();
            }
        },
        error: function (response) {
            swal('Wait ...', response, 'error');
        }
    });
}
function PerformToggleMediaPlanStatus(MediaPlanId, MediaPlanStatus, publishedMediaPlanName, publishedMediaPlanId) {

    if (MediaPlanStatus.toString().toLowerCase() == "published") {
        MediaPlanStatus = "Draft";
    }
    else {
        MediaPlanStatus = "Published";
    }

    $.ajax({
        url: "/MediaPlan/TogglePublishMediaPlan/",
        data: {
            mediaPlanid: MediaPlanId,
            MediaPlanStatus: MediaPlanStatus
        },
        cache: false,
        type: "GET",
        success: function (result) {
            if (result != null && result != undefined && result.success) {
                window.location.reload();
                //  GetMediaPlans();
            }
        },
        error: function (response) {
            swal('Wait ...', response, 'error');
        }
    });
}

function PerformDeleteMediaPlan(MediaPlanId) {
    $.ajax({
        url: "/MediaPlan/DeleteMediaPlan/",
        data: {
            mediaPlanid: MediaPlanId
        },
        cache: false,
        type: "GET",
        success: function (result) {
            if (result != null && result != undefined && result.success) {
                window.location.reload();
                ///GetMediaPlans();
            }
        },
        error: function (response) {
            swal('Wait ...', response, 'error');
        }
    });
}
function ValidateNavLinkClick(SelTabId) {
    // alert(SelTabId);
    if (SelTabId.indexOf("1q") > -1) {
        $(".tab-pane.active").removeClass("active");
        $(".tab-pane.show").removeClass("show");
        $($(".tab-pane")[1]).addClass("active");
        $($(".tab-pane")[1]).addClass("show");
        if (resultQtrs.filter(o => o.text.toLowerCase().indexOf("1q") > -1).length > 0)
            $("#ancCreateMediaPlan, #btnCopyMediaPlanModal").show();
        else
            $("#ancCreateMediaPlan, #btnCopyMediaPlanModal").hide();
        if (!Q1DataLoaded) {
            Q1DataLoaded = true;
            InitMediaPlanDashboard1Q();
        }
    }
    if (SelTabId.indexOf("2q") > -1) {
        $(".tab-pane.active").removeClass("active");
        $(".tab-pane.show").removeClass("show");
        $($(".tab-pane")[2]).addClass("active");
        $($(".tab-pane")[2]).addClass("show");

        if (resultQtrs.filter(o => o.text.toLowerCase().indexOf("2q") > -1).length > 0)
            $("#ancCreateMediaPlan, #btnCopyMediaPlanModal").show();
        else
            $("#ancCreateMediaPlan, #btnCopyMediaPlanModal").hide();
        if (!Q2DataLoaded) {
            Q2DataLoaded = true;
            InitMediaPlanDashboard2Q();
        }
    }
    if (SelTabId.indexOf("3q") > -1) {
        $(".tab-pane.active").removeClass("active");
        $(".tab-pane.show").removeClass("show");
        $($(".tab-pane")[3]).addClass("active");
        $($(".tab-pane")[3]).addClass("show");
        if (resultQtrs.filter(o => o.text.toLowerCase().indexOf("3q") > -1).length > 0)
            $("#ancCreateMediaPlan, #btnCopyMediaPlanModal").show();
        else
            $("#ancCreateMediaPlan, #btnCopyMediaPlanModal").hide();
        if (!Q3DataLoaded) {
            Q3DataLoaded = true;
            InitMediaPlanDashboard3Q();
        }
    }
    if (SelTabId.indexOf("4q") > -1) {
        $(".tab-pane.active").removeClass("active");
        $(".tab-pane.show").removeClass("show");
        $($(".tab-pane")[0]).addClass("active");
        $($(".tab-pane")[0]).addClass("show");
        if (resultQtrs.filter(o => o.text.toLowerCase().indexOf("4q") > -1).length > 0)
            $("#ancCreateMediaPlan, #btnCopyMediaPlanModal").show();
        else
            $("#ancCreateMediaPlan, #btnCopyMediaPlanModal").hide();
        if (!Q4DataLoaded) {
            Q4DataLoaded = true;
            InitMediaPlanDashboard4Q();
        }
    }
}

function ShowOverlayMedia() {
    document.getElementById("DivOverLayMedia").style.display = "block";
}
function HideOverlayMedia() {
    document.getElementById("DivOverLayMedia").style.display = "none";
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
}

function OpenMediaPlanSummary(ctrl) {

    var mediaPlanId = $(ctrl).attr("data-id");

    window.location.href = "/MediaPlan/Summary?MediaPlanId=" + mediaPlanId + "";

}
function OpenMediaPlanModal() {
    $('#MediaPlanModal').modal({ backdrop: 'static', keyboard: false }, 'show');
}