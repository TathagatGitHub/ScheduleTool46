var _mediaPlanId;
var mediaPlansSummaryJSON;
var CurBudgetDisplay;
var AllBTGroups = [];
var curNetworkIds = [];
var curNetworkNames = [];
var curMedpiaTypeIds = [];
var curMedpiaTypeNames = [];
var curTotalSectionBTGroups = [];
var curTotalSectionDemos = [];
var initialLoad = true;
var SelectionChanged = false;
var selNetworkIds = [];
var selBuyTypeGroups = [];
var selMediaTypes = [];
var TotalNetworks = 0;
Dropzone.autoDiscover = false;
$(document).ready(function () {  

    setTimeout(function () {
        MediaPlanCheckLock("querystr");
    }, 500);
    setTimeout(function () {
        LockMediaPlan();
    }, 600);
   
    var myDropzone = new Dropzone("#attachementsDropZone", {
        url: "/file-upload",
        clickable: ["#attachementsDropZone", ".browse-link"],
        addRemoveLinks: false,
        acceptedFiles: ".pdf,.doc,.docx,.msg,.xls,.xlsx,.csv,.png",
        previewTemplate: '<div></div>', init: function () {
            this.on("drop", function (event) {
                event.preventDefault();
                event.stopPropagation();
            });
        }
    });    

    setTimeout(function () {
        GetAllMediaPlanAttachments();
    }, 1000);

   
    async function UploadFileAttachment() {
        var fileCount = myDropzone.files.length;
        var mediaPlanId = $("#hdnMediaPlanId").val();
        var acceptedFileExtensions = ['.pdf', '.doc', '.docx', '.msg', '.xls', '.xlsx', '.csv', '.png'];
        var maxFileSize = 25 * 1024 * 1024;

        if (fileCount > 0) {
            for (let i = 0; i < fileCount; i++) {
                let file = myDropzone.files[i];
                let fileName = file.name;
                let fileSize = file.size;
                let fileExtension = fileName.includes('.') ? fileName.substring(fileName.lastIndexOf('.')).toLowerCase() : '';

                if (!acceptedFileExtensions.includes(fileExtension)) {
                    swal({
                        title: "Invalid File Extension",
                        text: "The file " + fileName + " does not have a valid extension. Please upload a valid file.",
                        icon: "error",
                        button: "OK"
                    }).then(() => {
                        myDropzone.removeFile(file);
                    });
                    return;
                }

                if (fileSize > maxFileSize) {
                    swal({
                        title: "File Too Large",
                        text: "The file " + fileName + " exceeds the maximum allowed size of 25MB. Please upload a file up to 25MB.",
                        icon: "error",
                        button: "OK"
                    }).then(() => {
                        myDropzone.removeFile(file);
                    });
                    return;
                }

                let formData = new FormData();
                formData.append("file", file);
                formData.append("mediaPlanId", mediaPlanId);

                try {
                    let response = await $.ajax({
                        url: "/MediaPlan/UploadFileAttachments",
                        type: "POST",
                        data: formData,
                        contentType: false,
                        processData: false
                    });

                    if (response.success) {
                        var mediaPlanAttachments = response.data;
                        var attachmentCount = mediaPlanAttachments.length;
                        $("#spnAttachmentCount").text(attachmentCount > 0 ? `(${attachmentCount})` : "");
                        $("#div-download-attachments").empty();
                        var displayText = "";
                        mediaPlanAttachments.forEach(function (attachment) {
                            var fileName = attachment.fileName;
                            var truncatedFileName = fileName.length > 25 ? fileName.substring(0, 25) + "..." : fileName;
                            displayText += '<div class="download-attachments" title="' + fileName + '">';
                            displayText += '<span style="color: #42A4F4;font-size:14px;" onclick="DownloadFileAttachments(' + mediaPlanId + ', \'' + fileName + '\')">' + truncatedFileName + '</span>';
                            displayText += '<i class="fa fa-trash attachments-cross-icon" onclick="DeleteFileAttachment(' + mediaPlanId + ', \'' + fileName + '\', ' + attachment.mediaPlanAttachmentId + ')"></i>';
                            displayText += '</div>';
                        });
                        $("#div-download-attachments").append(displayText);                      
                    } else {
                        swal({
                            html: response.responseText,
                            type: 'error',
                        });
                    }
                } catch (error) {
                    console.error("Error saving file:", error);
                    if (error.responseText) {
                        console.error("Error details:", error.responseText);
                    } else {
                        console.error("Error details:", JSON.stringify(error));
                    }
                }
                
                await delay(1000);
            }

            myDropzone.removeAllFiles();
        }
    }
    myDropzone.on("queuecomplete", function () {
        var mediaPlanId = $("#hdnMediaPlanId").val();
        $.ajax({
            url: "/MediaPlan/MediaPlanCheckLock/",
            data: {
                MediaPlanId: mediaPlanId,
                Action: "upload"
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
                    UploadFileAttachment();
                }
            },
            error: function (response) {
                var err = response.result;
            }
        });       
    });   
});

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function GetAllMediaPlanAttachments() {
    var mediaPlanId = $("#hdnMediaPlanId").val();
    $.ajax({
        url: '/MediaPlan/GetAllMediaPlanAttachments',
        data: { MediaPlanId: mediaPlanId },
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                var mediaPlanAttachments = response.data;
                var attachmentCount = mediaPlanAttachments.length;
                $("#spnAttachmentCount").text(attachmentCount > 0 ? `(${attachmentCount})` : "");
                $("#div-download-attachments").empty();
                var displayText = "";
                for (var i = 0; i < mediaPlanAttachments.length; i++) {
                    var attachment = mediaPlanAttachments[i];
                    var fileName = attachment.fileName;
                    var truncatedFileName = fileName.length > 25 ? fileName.substring(0, 25) + "..." : fileName;
                    displayText += '<div class="download-attachments" title="' + fileName + '">';
                    displayText += '<span style="color: #42A4F4; font-size:14px;" onclick="DownloadFileAttachments(' + attachment.mediaPlanId + ', \'' + fileName + '\')">' + truncatedFileName + '</span>';
                    displayText += '<i class="fa fa-trash attachments-cross-icon" onclick="DeleteFileAttachment(' + attachment.mediaPlanId + ', \'' + fileName + '\', ' + attachment.mediaPlanAttachmentId + ')"></i>';
                    displayText += '</div>';
                }
                $("#div-download-attachments").append(displayText);
            } else {
                console.error('Error: ' + response.responseText);
            }
        },
        error: function (xhr, status, error) {
            console.error('AJAX Error: ' + error);
        }
    });
}

function AttachmentsSlideOut() {    
    $("#attachmentsContainer").slideToggle(200);
}

function DownloadFileAttachments(mediaPlanId, fileName) {    
    $.ajax({
        url: "/MediaPlan/MediaPlanCheckLock/",
        data: {
            MediaPlanId: mediaPlanId,
            Action: "upload"
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
                window.location.href = `/MediaPlan/DownloadFileAttachments?MediaPlanId=${mediaPlanId}&FileName=${encodeURIComponent(fileName)}`;
            }
        },
        error: function (response) {
            var err = response.result;
        }
    });   
}

function DeleteFileAttachment(mediaPlanId, fileName, mediaPlanAttachmentId) {
    setTimeout(function () {
    $.ajax({
        url: "/MediaPlan/MediaPlanCheckLock/",
        data: {
            MediaPlanId: mediaPlanId,
            Action: "upload"
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
                $.ajax({
                    url: `/MediaPlan/DeleteFileAttachments`,
                    type: 'POST',
                    data: {
                        MediaPlanId: mediaPlanId,
                        FileName: fileName,
                        MediaPlanAttachmentId: mediaPlanAttachmentId
                    },
                    success: function (response) {
                        if (response.success) {
                            $(`.download-attachments[title="${fileName}"]`).remove();
                            $("#spnAttachmentCount").text(response.responseCode > 0 ? `(${response.responseCode})` : "");
                        } else {
                            console.error('Error deleting file: ' + response.message);
                        }
                    },
                    error: function (xhr, status, error) {
                        console.error('Error deleting file: ' + error);
                    }
                });
            }
        },
        error: function (response) {
            var err = response.result;
        }
    });   
    }, 1000);
}

function ShowOverlayMediaSummary() {
    document.getElementById("DivOverLayMediaSummary").style.display = "block";
}
function HideOverlayMediaSummary() {
    document.getElementById("DivOverLayMediaSummary").style.display = "none";
}
function BindMediaPlanSummary(initialLoad) {
    ShowOverlayMediaSummary();
    TotalNetworks = 0;
    var MediaPlanId = $("#hdnMediaPlanId").val();
    var budgetDisplay = $("#ddlBudgetDisplay").val();

    if (!initialLoad)
        selNetworkIds = GetSelectdItems('tdHeaderNetworks', 'Networks');

    if (!initialLoad)
        selBuyTypeGroups = GetSelectdItems('spnAllBuyTypeGroups', 'BTGroups');

    if (!initialLoad)
        selMediaTypes = GetSelectdItems('tdMediaType', 'MediaType');

    setTimeout(function () {
        $.ajax({
            url: "/MediaPlan/GetMediaPlanSummaryData",
            data: {
                "MediaPlanId": MediaPlanId,
                "BudgetDisplay": budgetDisplay,
                "NetworkIds": (selNetworkIds != null && selNetworkIds != undefined && selNetworkIds.length > 0) ? selNetworkIds.join(',') : null,
                "BuyTypeGroups": (selBuyTypeGroups != null && selBuyTypeGroups != undefined && selBuyTypeGroups.length > 0) ? selBuyTypeGroups.join(',') : null,
                MediaTypeIds: (selMediaTypes != null && selMediaTypes != undefined && selMediaTypes.length > 0) ? selMediaTypes.join(',') : null,
                "SelectionChanged": SelectionChanged
            },
            cache: false,
            type: "POST",
            success: function (result) {
                if (result) {
                    initialLoad = false;
                    //SelectionChanged = false;
                    mediaPlansSummaryJSON = result;
                    //console.log(mediaPlansSummaryJSON);
                    HideOverlayMediaSummary();
                    if (mediaPlansSummaryJSON != null) {
                        BindMediaPlanHeader();
                    }
                }

            },
            error: function (response) {
                HideOverlayMediaSummary();
                swal('Wait ...', response, 'error');
            }
        });
    }, 100);
}

$(document).on('click', function (e) {

    if (SelectionChanged) {
        setTimeout(function () {
            BindMediaPlanSummary(initialLoad);
        }, 500);
    }
});

function BindMediaPlanHeader() {
    if (mediaPlansSummaryJSON.mediaPlanSummaryHeader != null) {
        $("#hdnMediaPlanName").val(mediaPlansSummaryJSON.mediaPlanSummaryHeader.mediaPlanName);
        $("#hdnQuarterName").val(mediaPlansSummaryJSON.mediaPlanSummaryHeader.quarterName);
        $("#hdnClientName").val(mediaPlansSummaryJSON.mediaPlanSummaryHeader.clientName);
        $("#hdnQuarterId").val(mediaPlansSummaryJSON.mediaPlanSummaryHeader.quarterId);
        $("#hdnClientId").val(mediaPlansSummaryJSON.mediaPlanSummaryHeader.clientId);
        $("#hdnPlanYear").val(mediaPlansSummaryJSON.mediaPlanSummaryHeader.hdnPlanYear);
        $("#ddlBudgetDisplay").val(mediaPlansSummaryJSON.mediaPlanSummaryHeader.budgetType)
        /*$("#hdnMediaPlanName").html(mediaPlansSummaryJSON.mediaPlanSummaryHeader.mediaPlanName + " (" + mediaPlansSummaryJSON.mediaPlanSummaryHeader.countryShort + ") - " + mediaPlansSummaryJSON.mediaPlanSummaryHeader.planYear);*/
        $("#hdnMediaPlanName").html(mediaPlansSummaryJSON.mediaPlanSummaryHeader.mediaPlanName);
        //$("#spnCountry").html(mediaPlansSummaryJSON.mediaPlanSummaryHeader.CountryShort);
        $("#spnModifiedDate").html(mediaPlansSummaryJSON.mediaPlanSummaryHeader.modifiedDate);
        $("#spnModifiedBy").html(mediaPlansSummaryJSON.mediaPlanSummaryHeader.modifiedBy);
        $("#spnNoteCount").html(mediaPlansSummaryJSON.mediaPlanSummaryHeader.notesCount <= 0 ? "" : "(" + mediaPlansSummaryJSON.mediaPlanSummaryHeader.notesCount + ")");
        $("#spnAttachmentCount").html(mediaPlansSummaryJSON.mediaPlanSummaryHeader.attachmentCount <= 0 ? "" : "(" + mediaPlansSummaryJSON.mediaPlanSummaryHeader.attachmentCount + ")");
        $("#icoPublished").removeAttr("class");
        $("#icoPublished").css("");
        if (mediaPlansSummaryJSON.mediaPlanSummaryHeader.planStatus.toLowerCase() == "published") {
            $("#icoPublished").addClass("fa fa-star fa-2x");
            $("#icoPublished").css("font-size:2.5em;color:#42a5f5!important;");
            $("#ancPublished").attr("title", "Unpublish media plan");
        }
        else {
            $("#icoPublished").addClass("fa fa-star-o fa-2x");
            $("#icoPublished").css("font-size:2.5em");
            $("#ancPublished").attr("title", "Publish media plan");
        }
        // disabling the Budget Display
        if (mediaPlansSummaryJSON.mediaPlanSummaryHeader.disableBudgetToggle) {
            $("#ddlBudgetDisplay").attr("disabled", true);
            $("#ddlBudgetDisplay").css("background-color", "#e5e5e5");
            $("#ddlBudgetDisplay").attr("title", "Commission rate does not existfor the quarter " + mediaPlansSummaryJSON.mediaPlanSummaryHeader.quarterName + ". Budget display toggle is disabled");
        }
        else {
            $("#ddlBudgetDisplay").attr("disabled", false);
            $("#ddlBudgetDisplay").css("background-color", "#ffffff");
            $("#ddlBudgetDisplay").attr("title", "");
        }
    }
    else {
        $("#hdnMediaPlanName").val("");
        $("#hdnQuarterName").val("");
        $("#hdnClientName").val("");
    }

    BindMediaType();
    BindAllNetworks('total');
    for (var x = 0; x < $("span.multi-select-button").length; x++) {
        if ($($("span.multi-select-button")[x]).html().trim() == '') {
            $($("span.multi-select-button")[x]).html('--- Select ----');
        }
    }

    //Select All NEtworkds and Media Types on Initial Load

    if (selNetworkIds.length == 0 && SelectionChanged == false) {
        if (mediaPlansSummaryJSON.lstAllMediaPlanNetwork != null && mediaPlansSummaryJSON.lstAllMediaPlanNetwork.length > 1) {
            $($("#tdHeaderNetworks .multi-select-menuitem").find("input")).prop("checked", true);
            $("#tdHeaderNetworks .multi-select-button").html("All Selected");
            $("#tdHeaderNetworks .multi-select-button").attr("disabled", false);
            $("#tdHeaderNetworks .multi-select-button").css("background-color", "#ffffff");
        }
        else {
            $("#tdHeaderNetworks .multi-select-button").html("--- None Selected ---");
            $("#tdHeaderNetworks .multi-select-button").attr("disabled", true);
            $("#tdHeaderNetworks .multi-select-button").css("background-color", "#e5e5e5");
        }
        if (mediaPlansSummaryJSON.lstMediaType != null && mediaPlansSummaryJSON.lstMediaType.length > 1) {
            $($("#tdMediaType .multi-select-menuitem").find("input")).prop("checked", true);
            $("#tdMediaType .multi-select-button").html("All Selected");
            $("#tdMediaType .multi-select-button").attr("disabled", false);
            $("#tdMediaType .multi-select-button").css("background-color", "#ffffff");
        }
        else {
            $("#tdMediaType .multi-select-button").html("--- None Selected ---");
            $("#tdMediaType .multi-select-button").attr("disabled", true);
            $("#tdMediaType .multi-select-button").css("background-color", "#e5e5e5");
        }
    }
    else {
        var PopulatedNetworks = $("#tdHeaderNetworks .multi-select-menuitem").find("input");
        for (var y = 0; y < PopulatedNetworks.length; y++) {
            if (findValueInArray(selNetworkIds, $(PopulatedNetworks[y]).val())) {
                $($("#tdHeaderNetworks .multi-select-menuitem").find("input")).prop("checked", true);
            }
        }
        CreateToolTips('tdHeaderNetworks');
    }
    $('#tdHeaderNetworks .multi-select-menuitem input').change(function () {
        ValidateMultiSelctCheckbox('tdHeaderNetworks', this);
    });
    $('#tdMediaType .multi-select-menuitem input').change(function () {
        ValidateMultiSelctCheckbox('tdMediaType', this);
    });
    BindMediaPlanSummaryTotal();

}

function BindAllNetworks(SelType) {

    if (mediaPlansSummaryJSON.lstAllMediaPlanNetwork != null && mediaPlansSummaryJSON.lstAllMediaPlanNetwork.length > 1) {
        var result;

        result = mediaPlansSummaryJSON.lstAllMediaPlanNetwork;

        var markup = "";
        for (var x = 0; x < result.length; x++) {
            markup += '<option value=' + result[x].networkId + '>' + result[x].networkName + '</option>';
        }

        $("#ddlNetworkTotal").html(markup).show;

        $('#ddlNetworkTotal').multiSelect();
        $("#ddlNetworkTotal.multi-select-menu").css("width", "175px!important");
    }
    else {
        /*$("#tdHeaderNetworks .multi-select-button").html("All Selected");*/
        $('#ddlNetworkTotal').multiSelect();
        $("#tdHeaderNetworks .multi-select-menuitem").remove();
    }
}

function BindMediaType() {
    if (mediaPlansSummaryJSON.lstMediaType != null && mediaPlansSummaryJSON.lstMediaType.length > 1) {
        var result = mediaPlansSummaryJSON.lstMediaType;

        var markup = "";
        for (var x = 0; x < result.length; x++) {
            markup += '<option value=' + result[x].mediaTypeId + '>' + result[x].mediaTypeName + '</option>';
        }

        $("#ddlMediaType").html(markup).show;
        $('#ddlMediaType').multiSelect();
        $("#ddlMediaType.multi-select-menu").css("width", "175px!important");
    }
    else {
        $('#ddlMediaType').multiSelect();
        $("#tdMediaType .multi-select-menuitem").remove();
    }
}
function ToggleMediaPlanStatus() {
    var MediaPlanId = $("#hdnMediaPlanId").val();
    var MediaPlanName = $("#hdnMediaPlanName").val();
    $.ajax({
        url: "/MediaPlan/GetSummaryPublishedToggleMessage",
        data: {
            "MediaPlanId": MediaPlanId,
            "MediaPlanName": MediaPlanName
        },
        cache: false,
        type: "GET",
        success: function (result) {
            if (result.success) {
                swal({
                    title: result.responseCodeStr,
                    html: result.responseText,
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
                    function (resultSuccess) {
                        var MediaPlanStatus = "Published";
                        if (result.responseCode == 2) {
                            MediaPlanStatus = "Draft";
                        }
                        TogglePlanConfirm(MediaPlanId, MediaPlanStatus);
                    }, function (dismiss) {
                        // dismiss can be 'cancel', 'overlay', 'esc' or 'timer'
                    }
                );
            }
        },
        error: function (response) {
            HideOverlayMediaSummary();
            swal('Wait ...', response, 'error');
        }
    });
}
function TogglePlanConfirm(MediaPlanId, MediaPlanStatus) {
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
                $("#icoPublished").removeAttr("class");
                $("#icoPublished").css("");
                mediaPlansSummaryJSON.mediaPlanSummaryHeader.planStatus = MediaPlanStatus;
                if (mediaPlansSummaryJSON.mediaPlanSummaryHeader.planStatus.toLowerCase() == "published") {
                    $("#icoPublished").addClass("fa fa-star fa-2x");
                    $("#icoPublished").css("font-size:2.5em;color:#42a5f5!important;");
                    $("#ancPublished").attr("title", "Unpublish media plan");
                }
                else {
                    $("#icoPublished").addClass("fa fa-star-o fa-2x");
                    $("#icoPublished").css("font-size:2.5em");
                    $("#ancPublished").attr("title", "Publish media plan");
                }
            }
        },
        error: function (response) {
            swal('Wait ...', response, 'error');
        }
    });
}

//Functions For Total Section Data Binding Start Here
function BindMediaPlanSummaryTotal() {
    BindAllBuyTypeGroups();
    BindAllDemos();
    BindMediaPlanTotals();
    SelectionChanged = false;
}

function BindAllBuyTypeGroups() {
    if (mediaPlansSummaryJSON.lstMediaPlanBuyTypeGroups != null && mediaPlansSummaryJSON.lstMediaPlanBuyTypeGroups.length > 0) {
        var result;
        result = mediaPlansSummaryJSON.lstMediaPlanBuyTypeGroups;
    }
    var markup = "";
    markup += '<option value="0">All</option>';
    for (var x = 1; x < result.length; x++) {
        markup += '<option value=' + result[x].buyTypeGroup + '>' + result[x].buyTypeGroup + '</option>';
    }
    $("#ddlAllBuyTypeGroups").html(markup).show;
    $('#ddlAllBuyTypeGroups').multiSelect();
    // $("#ddlAllBuyTypeGroups.multi-select-menu").css("width", "175px!important");

    if (selBuyTypeGroups.length == 0 && SelectionChanged == false) {
        $($("#spnAllBuyTypeGroups .multi-select-menuitem").find("input")).prop("checked", true);
        $("#spnAllBuyTypeGroups .multi-select-button").html("All Selected");
    }
    else {
        var PopulatedBTGroups = $("#spnAllBuyTypeGroups .multi-select-menuitem").find("input");
        for (var y = 0; y < PopulatedBTGroups.length; y++) {
            if (findValueInArray(selBuyTypeGroups, $(PopulatedBTGroups[y]).val())) {
                $($("#spnAllBuyTypeGroups .multi-select-menuitem").find("input")).prop("checked", true);
            }
        }
        CreateToolTips('spnAllBuyTypeGroups');
    }

    $('#spnAllBuyTypeGroups .multi-select-menuitem input').change(function () {
        ValidateMultiSelctCheckbox('spnAllBuyTypeGroups', this);
    });
    $("#spnAllBuyTypeGroups .multi-select-menu").css("margin-top", "25px");
}
function BindAllDemos() {
    if (mediaPlansSummaryJSON.lstAllMediaPlanDemo != null && mediaPlansSummaryJSON.lstAllMediaPlanDemo.length > 0) {
        var result;
        result = mediaPlansSummaryJSON.lstAllMediaPlanDemo;
    }
    var markup = "";
    for (var x = 0; x < result.length; x++) {
        markup += '<option value=' + result[x].demoId + '>' + result[x].demoName + '</option>';
    }
    $("#ddlAllDemos").html(markup).show;
    $('#ddlAllDemos').multiSelect();
    $("#spnAllDemos .multi-select-button").html("--- Select ---");
    $('#spnAllDemos .multi-select-menuitem input').change(function () {
        ValidateMultiSelctCheckbox('spnAllDemos', this);
    });
    $("#spnAllDemos .multi-select-menu").css("margin-top", "25px");

}

function BindMediaPlanTotals() {
    var result = mediaPlansSummaryJSON.lstMediaPlanSummary.filter(o => o.groupName == 'Media Plan Totals');
    if (result != null && result.length > 0) {
        var ShowZeros = result.filter(o => o.title == "IMPs" && o.grandTotal != '').length > 0 ? true : false;
        var TotalWeek = 13;
        var HeaderData = result[0];
        if (HeaderData.wk14_Data != null && HeaderData.wk14_Data != undefined && HeaderData.wk14_Data != "") {
            TotalWeek = 14;
        }
        var HTMLHeaderTotal = '<tr>';
        HTMLHeaderTotal += '<th scope="col" style="font-weight:bold;width:240px;max-width:240px;">' + HeaderData.title + '</th>';
        
        HTMLHeaderTotal += '<th scope="col" style="font-weight:bold;width:110px;max-width:110px;text-transform: capitalize;">' + HeaderData.grandTotal + '</th>';
        HTMLHeaderTotal += '<th scope="col" style="font-weight:bold;width:110px;max-width:110px;">' + HeaderData.wk01_Data + '</th>';
        HTMLHeaderTotal += '<th scope="col" style="font-weight:bold;width:110px;max-width:110px;">' + HeaderData.wk02_Data + '</th>';
        HTMLHeaderTotal += '<th scope="col" style="font-weight:bold;width:110px;max-width:110px;">' + HeaderData.wk03_Data + '</th>';
        HTMLHeaderTotal += '<th scope="col" style="font-weight:bold;width:110px;max-width:110px;">' + HeaderData.wk04_Data + '</th>';
        HTMLHeaderTotal += '<th scope="col" style="font-weight:bold;width:110px;max-width:110px;">' + HeaderData.wk05_Data + '</th>';
        HTMLHeaderTotal += '<th scope="col" style="font-weight:bold;width:110px;max-width:110px;">' + HeaderData.wk06_Data + '</th>';
        HTMLHeaderTotal += '<th scope="col" style="font-weight:bold;width:110px;max-width:110px;">' + HeaderData.wk07_Data + '</th>';
        HTMLHeaderTotal += '<th scope="col" style="font-weight:bold;width:110px;max-width:110px;">' + HeaderData.wk08_Data + '</th>';
        HTMLHeaderTotal += '<th scope="col" style="font-weight:bold;width:110px;max-width:110px;">' + HeaderData.wk09_Data + '</th>';
        HTMLHeaderTotal += '<th scope="col" style="font-weight:bold;width:110px;max-width:110px;">' + HeaderData.wk10_Data + '</th>';
        HTMLHeaderTotal += '<th scope="col" style="font-weight:bold;width:110px;max-width:110px;">' + HeaderData.wk11_Data + '</th>';
        HTMLHeaderTotal += '<th scope="col" style="font-weight:bold;width:110px;max-width:110px;">' + HeaderData.wk12_Data + '</th>';
        HTMLHeaderTotal += '<th scope="col" style="font-weight:bold;width:110px;max-width:110px;">' + HeaderData.wk13_Data + '</th>';

        if (TotalWeek == 14)
            HTMLHeaderTotal += '<th scope="col" style="font-weight:bold;width:110px;max-width:110px;">' + HeaderData.wk14_Data + '</th>';
        HTMLHeaderTotal += '</tr>';
        $("#thSummaryTotalHeaderAll").html(HTMLHeaderTotal);
        var HTMLBodyTotal = '';
        for (var x = 1; x < result.length; x++) {
            HTMLBodyTotal += '<tr>';
            HTMLBodyTotal += '<th scope="row" style="width:240px;max-width:240px;">' + result[x].title + '</th>';
            if (result[x].title.toString().toLowerCase().trim() == "networks") {
                ShowZeros = false;
                if (x > 1 && parseInt(result[1].grandTotal) > 0)
                    HTMLBodyTotal += '<td style="width:110px;max-width:110px;" id="tdHeaderNetworkTotals">' + FormatNumber(result[x].grandTotal, result[x].valueType, true) + '</td>';
                else
                    HTMLBodyTotal += '<td style="width:110px;max-width:110px;" id="tdHeaderNetworkTotals">' + FormatNumber(result[x].grandTotal, result[x].valueType, false) + '</td>';
            }
            else {
                if (x == 6) {
                    HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].grandTotal, result[x].valueType) + '</td>';
                }
                else {
                    if (x > 1 && parseInt(result[1].grandTotal) > 0) {
                        if (result[x].title.toString().toLowerCase().trim() == "grps")
                            HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + ellipsis(15)(result[x].grandTotal == "" ? "0.00" : result[x].grandTotal, 'display', null) + '</td>';
                        else
                            HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].grandTotal, result[x].valueType, true) + '</td>';
                    }
                    else {
                        HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].grandTotal, result[x].valueType, false) + '</td>';
                    }
                }
            }
            if (x > 1 && parseInt(result[1].wk01_Data) > 0) {
                if (result[x].title.toString().toLowerCase().trim() == "grps")
                    HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + ellipsis(15)(result[x].wk01_Data == "" ? "0.00" : result[x].wk01_Data, 'display', null) + '</td>';
                else
                    HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk01_Data, result[x].valueType, result[x].title.toString().toLowerCase().trim() == "networks" ? false : true) + '</td>';
            }
            else {
                HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk01_Data, result[x].valueType, result[x].title.toString().toLowerCase().trim() == "networks" ? false : false) + '</td>';
            }
            if (x > 1 && parseInt(result[1].wk02_Data) > 0) {
                if (result[x].title.toString().toLowerCase().trim() == "grps")
                    HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + ellipsis(15)(result[x].wk02_Data == "" ? "0.00" : result[x].wk02_Data, 'display', null) + '</td>';
                else
                    HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk02_Data, result[x].valueType, result[x].title.toString().toLowerCase().trim() == "networks" ? false : true) + '</td>';
            }
            else {
                HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk02_Data, result[x].valueType, result[x].title.toString().toLowerCase().trim() == "networks" ? false : ShowZeros) + '</td>';
            }
            if (x > 1 && parseInt(result[1].wk03_Data) > 0) {
                if (result[x].title.toString().toLowerCase().trim() == "grps")
                    HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + ellipsis(15)(result[x].wk03_Data == "" ? "0.00" : result[x].wk03_Data, 'display', null) + '</td>';
                else
                    HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk03_Data, result[x].valueType, result[x].title.toString().toLowerCase().trim() == "networks" ? false : true) + '</td>';
            }
            else {
                HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk03_Data, result[x].valueType, result[x].title.toString().toLowerCase().trim() == "networks" ? false : ShowZeros) + '</td>';
            }
            if (x > 1 && parseInt(result[1].wk04_Data) > 0) {
                if (result[x].title.toString().toLowerCase().trim() == "grps")
                    HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + ellipsis(15)(result[x].wk04_Data == "" ? "0.00" : result[x].wk04_Data, 'display', null) + '</td>';
                else
                    HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk04_Data, result[x].valueType, result[x].title.toString().toLowerCase().trim() == "networks" ? false : true) + '</td>';
            }
            else {
                HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk04_Data, result[x].valueType, result[x].title.toString().toLowerCase().trim() == "networks" ? false : ShowZeros) + '</td>';
            }
            if (x > 1 && parseInt(result[1].wk05_Data) > 0) {
                if (result[x].title.toString().toLowerCase().trim() == "grps")
                    HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + ellipsis(15)(result[x].wk05_Data == "" ? "0.00" : result[x].wk05_Data, 'display', null) + '</td>';
                else
                    HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk05_Data, result[x].valueType, result[x].title.toString().toLowerCase().trim() == "networks" ? false : true) + '</td>';
            }
            else {
                HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk05_Data, result[x].valueType, result[x].title.toString().toLowerCase().trim() == "networks" ? false : ShowZeros) + '</td>';
            }
            if (x > 1 && parseInt(result[1].wk06_Data) > 0) {
                if (result[x].title.toString().toLowerCase().trim() == "grps")
                    HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + ellipsis(15)(result[x].wk06_Data == "" ? "0.00" : result[x].wk06_Data, 'display', null) + '</td>';
                else
                    HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk06_Data, result[x].valueType, result[x].title.toString().toLowerCase().trim() == "networks" ? false : true) + '</td>';
            }
            else {
                HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk06_Data, result[x].valueType, result[x].title.toString().toLowerCase().trim() == "networks" ? false : false) + '</td>';
            }
            if (x > 1 && parseInt(result[1].wk07_Data) > 0) {
                if (result[x].title.toString().toLowerCase().trim() == "grps")
                    HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + ellipsis(15)(result[x].wk07_Data == "" ? "0.00" : result[x].wk07_Data, 'display', null) + '</td>';
                else
                    HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk07_Data, result[x].valueType, result[x].title.toString().toLowerCase().trim() == "networks" ? false : true) + '</td>';
            }
            else {
                HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk07_Data, result[x].valueType, result[x].title.toString().toLowerCase().trim() == "networks" ? false : false) + '</td>';
            }
            if (x > 1 && parseInt(result[1].wk08_Data) > 0) {
                if (result[x].title.toString().toLowerCase().trim() == "grps")
                    HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + ellipsis(15)(result[x].wk08_Data == "" ? "0.00" : result[x].wk08_Data, 'display', null) + '</td>';
                else
                    HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk08_Data, result[x].valueType, result[x].title.toString().toLowerCase().trim() == "networks" ? false : true) + '</td>';
            }
            else {
                HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk08_Data, result[x].valueType, result[x].title.toString().toLowerCase().trim() == "networks" ? false : false) + '</td>';
            }
            if (x > 1 && parseInt(result[1].wk09_Data) > 0) {
                if (result[x].title.toString().toLowerCase().trim() == "grps")
                    HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + ellipsis(15)(result[x].wk09_Data == "" ? "0.00" : result[x].wk09_Data, 'display', null) + '</td>';
                else
                    HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk09_Data, result[x].valueType, result[x].title.toString().toLowerCase().trim() == "networks" ? false : true) + '</td>';
            }
            else {
                HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk09_Data, result[x].valueType, result[x].title.toString().toLowerCase().trim() == "networks" ? false : false) + '</td>';
            }
            if (x > 1 && parseInt(result[1].wk10_Data) > 0) {
                if (result[x].title.toString().toLowerCase().trim() == "grps")
                    HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + ellipsis(15)(result[x].wk10_Data == "" ? "0.00" : result[x].wk10_Data, 'display', null) + '</td>';
                else
                    HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk10_Data, result[x].valueType, result[x].title.toString().toLowerCase().trim() == "networks" ? false : true) + '</td>';
            }
            else {
                HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk10_Data, result[x].valueType, result[x].title.toString().toLowerCase().trim() == "networks" ? false : false) + '</td>';
            }
            if (x > 1 && parseInt(result[1].wk11_Data) > 0) {
                if (result[x].title.toString().toLowerCase().trim() == "grps")
                    HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + ellipsis(15)(result[x].wk11_Data == "" ? "0.00" : result[x].wk11_Data, 'display', null) + '</td>';
                else
                    HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk11_Data, result[x].valueType, result[x].title.toString().toLowerCase().trim() == "networks" ? false : true) + '</td>';
            }
            else {
                HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk11_Data, result[x].valueType, result[x].title.toString().toLowerCase().trim() == "networks" ? false : false) + '</td>';
            }
            if (x > 1 && parseInt(result[1].wk12_Data) > 0) {
                if (result[x].title.toString().toLowerCase().trim() == "grps")
                    HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + ellipsis(15)(result[x].wk12_Data == "" ? "0.00" : result[x].wk12_Data, 'display', null) + '</td>';
                else
                    HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk12_Data, result[x].valueType, result[x].title.toString().toLowerCase().trim() == "networks" ? false : true) + '</td>';
            }
            else {
                HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk12_Data, result[x].valueType, result[x].title.toString().toLowerCase().trim() == "networks" ? false : false) + '</td>';
            }
            if (x > 1 && parseInt(result[1].wk13_Data) > 0) {
                if (result[x].title.toString().toLowerCase().trim() == "grps")
                    HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + ellipsis(15)(result[x].wk13_Data == "" ? "0.00" : result[x].wk13_Data, 'display', null) + '</td>';
                else
                    HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk13_Data, result[x].valueType, result[x].title.toString().toLowerCase().trim() == "networks" ? false : true) + '</td>';
            }
            else {
                HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk13_Data, result[x].valueType, result[x].title.toString().toLowerCase().trim() == "networks" ? false : false) + '</td>';
            }
            if (TotalWeek == 14) {
                if (x > 1 && parseInt(result[1].wk14_Data) > 0) {
                    if (result[x].title.toString().toLowerCase().trim() == "grps")
                        HTMLBodyTotal += '<td style="width:110px;max-width:110px;">' + ellipsis(15)(result[x].wk14_Data == "" ? "0.00" : result[x].wk14_Data, 'display', null) + '</td>';
                    else
                        HTMLBodyTotal += '<td  style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk14_Data, result[x].valueType, result[x].title.toString().toLowerCase().trim() == "networks" ? false : true) + '</td>';
                }
                else {
                    HTMLBodyTotal += '<td  style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk14_Data, result[x].valueType, result[x].title.toString().toLowerCase().trim() == "networks" ? false : false) + '</td>';
                }
            }

            HTMLBodyTotal += ' </tr>';
        }
        $("#tbSummaryTotalBodyAll").html(HTMLBodyTotal);
        // $("#divMediaPlanSummaryTotal").show();
        $(".content.planning-dash").show();
    }
    var SelBTGroups = $($("#spnAllBuyTypeGroups .multi-select-menuitem").find("input:checked"));
    AllBTGroups = [];
    for (var x = 0; x < SelBTGroups.length; x++) {
        if ($(SelBTGroups[x]).val() != '0') {
            AllBTGroups.push($($(SelBTGroups[x]).parent()).text().trim());
        }
    }

    $("#divMediaPlanSummaryBuyTypeGroup").html("");
    //console.log("Sel BT GROUP " + SelBTGroups.join(', '));
    BindMediaPlanSummaryBTGroups(0);
}


function BindMediaPlanSummaryBTGroups(curIndex) {
    var result = mediaPlansSummaryJSON.lstMediaPlanSummary.filter(o => o.groupName == AllBTGroups[curIndex]);
    if (result != null && result.length > 0) {
        var ShowZeros = result.filter(o => o.title == "IMPs" && o.grandTotal != '').length > 0 ? true : false;
        //console.log(result);
        var TotalWeek = 13;
        var HeaderData = result[0];
        if (HeaderData.wk14_Data != null && HeaderData.wk14_Data != undefined && HeaderData.wk14_Data != "") {
            TotalWeek = 14;
        }
        var BTGroupHTML = '';
        // Code for BT Group Title Section Start Here
        BTGroupHTML += '<div class="col-md-12 summary-header-row" id="divSummarySection_' + HeaderData.groupName.replace(/ /g, "_") + '"> ';
        BTGroupHTML += '<table style="width:100%"> ';
        BTGroupHTML += '<tbody> ';
        BTGroupHTML += '<tr> ';
        BTGroupHTML += '<td style="text-align:left;display:flex;margin-left: -30px "> ';
        BTGroupHTML += '<a style="cursor:pointer"  onclick="return MediaPlanCheckLock(\'editbtg\',\'' + HeaderData.groupName.replace(/ /g, "_").trim() + '\')" id="ancEditBuyTypeGroup_' + HeaderData.groupName.replace(/ /g, "_") + '" title="Edit" class="item-publish" style="margin-left:10px;margin-top:8px;"><i class="fa fa-pencil fa-2x" aria-expanded="true"></i></a> ';
        BTGroupHTML += '<h2 id="hdMediaPlanNameBtGroup_' + HeaderData.groupName.replace(/ /g, "_") + '" class="media-plan-name"> ';
        BTGroupHTML += HeaderData.groupName;
        BTGroupHTML += '</h2> ';
        BTGroupHTML += '</td> ';
        BTGroupHTML += '<td> ';
        BTGroupHTML += '<div style="display:flex;float: right;margin-top: -15px;margin-right:-10px;"> ';
        BTGroupHTML += '<span id="SpnBTGroupDemos_' + HeaderData.groupName.replace(/ /g, "_") + '"> ';
        BTGroupHTML += '<select id="ddlBTGroupDemos_' + HeaderData.groupName.replace(/ /g, "_") + '" style="float: left; display: none;" name="ddlBTGroupDemos_' + HeaderData.groupName.replace(/ /g, "_") + '" multiple>';
        BTGroupHTML += '</select>';
        BTGroupHTML += '</span> ';
        BTGroupHTML += '<a href="javascript:function ce2() { return false; }"  title="Export Total to Excel" class="item-publish" style="margin-left:15px;margin-top:7px;"><i class="fa fa-file-excel-o fa-2x"></i></a> ';
        BTGroupHTML += '</div> ';
        BTGroupHTML += '</td> ';
        BTGroupHTML += '</tr> ';
        BTGroupHTML += '</tbody> ';
        BTGroupHTML += '</table> ';
        BTGroupHTML += '</div> ';
        // Code for BT Group Title Section End Here
        BTGroupHTML += '<div>';
        BTGroupHTML += '<table class="table table-striped" id = "tblMediaPlanSummaryBTGroup_' + HeaderData.groupName.replace(/ /g, "_") + '" > ';
        BTGroupHTML += '<thead id="thSummaryTotalHeaderBTGroup_' + HeaderData.groupName.replace(/ /g, "_") + '">';
        BTGroupHTML += '<tr>';
        BTGroupHTML += '<th scope="col" style="font-weight:bold;width:240px;max-width:240px;">' + HeaderData.title + '</th>';
        BTGroupHTML += '<th scope="col" style="font-weight:bold;width:110px;max-width:110px;text-transform: capitalize;">' + HeaderData.grandTotal + '</th>';
        BTGroupHTML += '<th scope="col" style="font-weight:bold;width:110px;max-width:110px;">' + HeaderData.wk01_Data + '</th>';
        BTGroupHTML += '<th scope="col" style="font-weight:bold;width:110px;max-width:110px;">' + HeaderData.wk02_Data + '</th>';
        BTGroupHTML += '<th scope="col" style="font-weight:bold;width:110px;max-width:110px;">' + HeaderData.wk03_Data + '</th>';
        BTGroupHTML += '<th scope="col" style="font-weight:bold;width:110px;max-width:110px;">' + HeaderData.wk04_Data + '</th>';
        BTGroupHTML += '<th scope="col" style="font-weight:bold;width:110px;max-width:110px;">' + HeaderData.wk05_Data + '</th>';
        BTGroupHTML += '<th scope="col" style="font-weight:bold;width:110px;max-width:110px;">' + HeaderData.wk06_Data + '</th>';
        BTGroupHTML += '<th scope="col" style="font-weight:bold;width:110px;max-width:110px;">' + HeaderData.wk07_Data + '</th>';
        BTGroupHTML += '<th scope="col" style="font-weight:bold;width:110px;max-width:110px;">' + HeaderData.wk08_Data + '</th>';
        BTGroupHTML += '<th scope="col" style="font-weight:bold;width:110px;max-width:110px;">' + HeaderData.wk09_Data + '</th>';
        BTGroupHTML += '<th scope="col" style="font-weight:bold;width:110px;max-width:110px;">' + HeaderData.wk10_Data + '</th>';
        BTGroupHTML += '<th scope="col" style="font-weight:bold;width:110px;max-width:110px;">' + HeaderData.wk11_Data + '</th>';
        BTGroupHTML += '<th scope="col" style="font-weight:bold;width:110px;max-width:110px;">' + HeaderData.wk12_Data + '</th>';
        BTGroupHTML += '<th scope="col" style="font-weight:bold;width:110px;max-width:110px;">' + HeaderData.wk13_Data + '</th>';
        if (TotalWeek == 14)
            BTGroupHTML += '<th scope="col" style="font-weight:bold;width:110px;max-width:110px;">' + HeaderData.wk14_Data + '</th>';
        BTGroupHTML += '</tr>';
        //$("#thSummaryTotalHeaderAll").html(HTMLHeaderTotal);
        BTGroupHTML += '<tbody id="tbSummaryTotalBodyBTGroup_' + HeaderData.groupName.replace(/ /g, "_") + '">';
        for (var x = 1; x < result.length; x++) {
            BTGroupHTML += '<tr>';
            BTGroupHTML += '<th scope="row"  style="width:240px;max-width:240px;">' + result[x].title + '</th>';
            if (x > 1 && parseInt(result[1].grandTotal) > 0) {
                if (result[x].title.toLowerCase() == "grps")
                    BTGroupHTML += '<td style="width:110px;max-width:110px;">' + ellipsis(15)(result[x].grandTotal == "" ? "0.00" : result[x].grandTotal, 'display', null) + '</td>';
                else
                    BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].grandTotal, result[x].valueType, true) + '</td>';
            }
            else {
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].grandTotal, result[x].valueType, false) + '</td>';
            }
            if (x > 1 && parseInt(result[1].wk01_Data) > 0) {
                if (result[x].title.toLowerCase() == "grps")
                    BTGroupHTML += '<td style="width:110px;max-width:110px;">' + ellipsis(15)(result[x].wk01_Data == "" ? "0.00" : result[x].wk01_Data, 'display', null) + '</td>';
                else
                    BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk01_Data, result[x].valueType, true) + '</td>';
            }
            else {
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk01_Data, result[x].valueType, false) + '</td>';
            }
            if (x > 1 && parseInt(result[1].wk02_Data) > 0) {
                if (result[x].title.toLowerCase() == "grps")
                    BTGroupHTML += '<td style="width:110px;max-width:110px;">' + ellipsis(15)(result[x].wk02_Data == "" ? "0.00" : result[x].wk02_Data, 'display', null) + '</td>';
                else
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk02_Data, result[x].valueType, true) + '</td>';
            }
            else {
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk02_Data, result[x].valueType, false) + '</td>';
            }
            if (x > 1 && parseInt(result[1].wk03_Data) > 0) {
                if (result[x].title.toLowerCase() == "grps")
                    BTGroupHTML += '<td style="width:110px;max-width:110px;">' + ellipsis(15)(result[x].wk03_Data == "" ? "0.00" : result[x].wk03_Data, 'display', null) + '</td>';
                else
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk03_Data, result[x].valueType, true) + '</td>';
            }
            else {
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk03_Data, result[x].valueType, false) + '</td>';
            }
            if (x > 1 && parseInt(result[1].wk04_Data) > 0) {
                if (result[x].title.toLowerCase() == "grps")
                    BTGroupHTML += '<td style="width:110px;max-width:110px;">' + ellipsis(15)(result[x].wk04_Data == "" ? "0.00" : result[x].wk04_Data, 'display', null) + '</td>';
                else
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk04_Data, result[x].valueType, true) + '</td>';
            }
            else {
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk04_Data, result[x].valueType, false) + '</td>';
            }
            if (x > 1 && parseInt(result[1].wk05_Data) > 0) {
                if (result[x].title.toLowerCase() == "grps")
                    BTGroupHTML += '<td style="width:110px;max-width:110px;">' + ellipsis(15)(result[x].wk05_Data == "" ? "0.00" : result[x].wk05_Data, 'display', null) + '</td>';
                else
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk05_Data, result[x].valueType, true) + '</td>';
            }
            else {
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk05_Data, result[x].valueType, false) + '</td>';
            }
            if (x > 1 && parseInt(result[1].wk06_Data) > 0) {
                if (result[x].title.toLowerCase() == "grps")
                    BTGroupHTML += '<td style="width:110px;max-width:110px;">' + ellipsis(15)(result[x].wk06_Data == "" ? "0.00" : result[x].wk06_Data, 'display', null) + '</td>';
                else
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk06_Data, result[x].valueType, true) + '</td>';
            }
            else {
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk06_Data, result[x].valueType, false) + '</td>';
            }
            if (x > 1 && parseInt(result[1].wk07_Data) > 0) {
                if (result[x].title.toLowerCase() == "grps")
                    BTGroupHTML += '<td style="width:110px;max-width:110px;">' + ellipsis(15)(result[x].wk07_Data == "" ? "0.00" : result[x].wk07_Data, 'display', null) + '</td>';
                else
                    BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk07_Data, result[x].valueType, true) + '</td>';
            }
            else {
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk07_Data, result[x].valueType, false) + '</td>';
            }
            if (x > 1 && parseInt(result[1].wk08_Data) > 0) {
                if (result[x].title.toLowerCase() == "grps")
                    BTGroupHTML += '<td style="width:110px;max-width:110px;">' + ellipsis(15)(result[x].wk08_Data == "" ? "0.00" : result[x].wk08_Data, 'display', null) + '</td>';
                else
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk08_Data, result[x].valueType, true) + '</td>';
            }
            else {
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk08_Data, result[x].valueType, false) + '</td>';
            }
            if (x > 1 && parseInt(result[1].wk09_Data) > 0) {
                if (result[x].title.toLowerCase() == "grps")
                    BTGroupHTML += '<td style="width:110px;max-width:110px;">' + ellipsis(15)(result[x].wk09_Data == "" ? "0.00" : result[x].wk09_Data, 'display', null) + '</td>';
                else
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk09_Data, result[x].valueType, true) + '</td>';
            }
            else {
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk09_Data, result[x].valueType, false) + '</td>';
            }
            if (x > 1 && parseInt(result[1].wk10_Data) > 0) {
                if (result[x].title.toLowerCase() == "grps")
                    BTGroupHTML += '<td style="width:110px;max-width:110px;">' + ellipsis(15)(result[x].wk10_Data == "" ? "0.00" : result[x].wk10_Data, 'display', null) + '</td>';
                else
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk10_Data, result[x].valueType, true) + '</td>';
            }
            else {
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk10_Data, result[x].valueType, false) + '</td>';
            }
            if (x > 1 && parseInt(result[1].wk11_Data) > 0) {
                if (result[x].title.toLowerCase() == "grps")
                    BTGroupHTML += '<td style="width:110px;max-width:110px;">' + ellipsis(15)(result[x].wk11_Data == "" ? "0.00" : result[x].wk11_Data, 'display', null) + '</td>';
                else
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk11_Data, result[x].valueType, true) + '</td>';
            }
            else {
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk11_Data, result[x].valueType, false) + '</td>';
            }
            if (x > 1 && parseInt(result[1].wk12_Data) > 0) {
                if (result[x].title.toLowerCase() == "grps")
                    BTGroupHTML += '<td style="width:110px;max-width:110px;">' + ellipsis(15)(result[x].wk12_Data == "" ? "0.00" : result[x].wk12_Data, 'display', null) + '</td>';
                else
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk12_Data, result[x].valueType, true) + '</td>';
            }
            else {
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk12_Data, result[x].valueType, false) + '</td>';
            }
            if (x > 1 && parseInt(result[1].wk13_Data) > 0) {
                if (result[x].title.toLowerCase() == "grps")
                    BTGroupHTML += '<td style="width:110px;max-width:110px;">' + ellipsis(15)(result[x].wk13_Data == "" ? "0.00" : result[x].wk13_Data, 'display', null) + '</td>';
                else
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk13_Data, result[x].valueType, true) + '</td>';
            }
            else {
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk13_Data, result[x].valueType, false) + '</td>';
            }
            if (TotalWeek == 14) {
                if (x > 1 && parseInt(result[1].wk14_Data) > 0) {
                    if (result[x].title.toLowerCase() == "grps")
                        BTGroupHTML += '<td style="width:110px;max-width:110px;">' + ellipsis(15)(result[x].wk14_Data == "" ? "0.00" : result[x].wk14_Data, 'display', null) + '</td>';
                    else
                    BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk14_Data, result[x].valueType, true) + '</td>';
                }
                else {
                    BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(result[x].wk14_Data, result[x].valueType, false) + '</td>';
                }
            }

            BTGroupHTML += ' </tr>';
        }
        // Code for Binding Networks List for BT Group
        var BTGroupNetworks = mediaPlansSummaryJSON.lstMediaPlanSummary.filter(o => o.groupName == 'Networks_' + HeaderData.groupName);
        //ST-1133
        BTGroupNetworks.sort(function (a, b) {
            return a.title.localeCompare(b.title);
        });

        if (BTGroupNetworks != null && BTGroupNetworks != undefined) {

            BTGroupHTML += '<tr style="background:rgb(0 0 0 / 57%)" id="trMediaPlanSummaryBTGroupNetworksMain_' + HeaderData.groupName.replace(/ /g, "_") + '">';
            BTGroupHTML += ' <td style="border-right:1px solid #fff; text-align:left;width:240px;max-width:240px;">';

            BTGroupHTML += '<a onclick="return ToggleNetworkClass(this)"; style="background:#42a5f500; border:none;color:#ffffff!important;display:flex;text-decoration:none;" data-toggle="collapse" href="#collapseExample_' + HeaderData.groupName.replace(/ /g, "_") + '" role="button" aria-expanded="false" aria-controls="collapseExample_' + HeaderData.groupName.replace(/ /g, "_") + '">';
            BTGroupHTML += '<i class="fa fa-angle-double-down" aria-hidden="true" style="padding-right:6px;font-size: 20px;"></i>';
            BTGroupHTML += '<span style="font-weight:bold;font-size:16px;">Networks</span>';
            BTGroupHTML += '</a>';
            BTGroupHTML += '</td>';
            BTGroupHTML += '<td style="border-right:1px solid #fff; color:#fff;width:110px;max-width:110px;" id="tdBTGroupNetworksCount_' + HeaderData.groupName.replace(/ /g, "_") + '">' + BTGroupNetworks.length + '</td>';
            BTGroupHTML += '<td style="border-right:1px solid #fff;width:110px;max-width:110px;"></td>';
            BTGroupHTML += '<td style="border-right:1px solid #fff;width:110px;max-width:110px;"></td>';
            BTGroupHTML += '<td style="border-right:1px solid #fff;width:110px;max-width:110px;"></td>';
            BTGroupHTML += '<td style="border-right:1px solid #fff;width:110px;max-width:110px;"></td>';
            BTGroupHTML += '<td style="border-right:1px solid #fff;width:110px;max-width:110px;"></td>';
            BTGroupHTML += '<td style="border-right:1px solid #fff;width:110px;max-width:110px;"></td> ';
            BTGroupHTML += '<td style="border-right:1px solid #fff;width:110px;max-width:110px;"></td>';
            BTGroupHTML += '<td style="border-right:1px solid #fff;width:110px;max-width:110px;"></td>';
            BTGroupHTML += '<td style="border-right:1px solid #fff;width:110px;max-width:110px;"></td>';
            BTGroupHTML += '<td style="border-right:1px solid #fff;width:110px;max-width:110px;"></td> ';
            BTGroupHTML += '<td style="border-right:1px solid #fff;width:110px;max-width:110px;"></td>';
            BTGroupHTML += '<td style="border-right:1px solid #fff;width:110px;max-width:110px;"></td>';
            if (TotalWeek == 14)
                BTGroupHTML += '<td style="border-right:1px solid #fff;width:110px;max-width:110px;"></td>';
            BTGroupHTML += '<td style="width:110px;max-width:110px;"></td>';
            BTGroupHTML += '</tr>';

            // Table for Networks Starts Here
            BTGroupHTML += '<tr id="trMediaPlanSummaryBTGroupNetworksList_' + HeaderData.groupName.replace(/ /g, "_") + '">';
            if (TotalWeek == 14)
                BTGroupHTML += '<td colspan="16" style="padding:0!important;">';
            else
                BTGroupHTML += '<td colspan="15" style="padding:0!important;">';
            BTGroupHTML += '<div class="collapse" id="collapseExample_' + HeaderData.groupName.replace(/ /g, "_") + '">';
            BTGroupHTML += '<div class="card card-body">';
            BTGroupHTML += '<table class="table table-striped" id="tblNetworks_' + HeaderData.groupName.replace(/ /g, "_") + '">';
            BTGroupHTML += '<tbody>';
            TotalNetworks = TotalNetworks + BTGroupNetworks.length;
            for (var k = 0; k < BTGroupNetworks.length; k++) {
                BTGroupHTML += '<tr>';

                BTGroupHTML += '<th scope="row" style="width:240px;max-width:240px;">' + ellipsis(25)(BTGroupNetworks[k].title, 'display', null) + '</th>';
                BTGroupHTML += '<td  style="width:110px;max-width:110px;">' + FormatNumber(BTGroupNetworks[k].grandTotal, BTGroupNetworks[k].valueType) + '</td>';

                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(BTGroupNetworks[k].wk01_Data, BTGroupNetworks[k].valueType) + '</td>';
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(BTGroupNetworks[k].wk02_Data, BTGroupNetworks[k].valueType) + '</td>';
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(BTGroupNetworks[k].wk03_Data, BTGroupNetworks[k].valueType) + '</td>';
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(BTGroupNetworks[k].wk04_Data, BTGroupNetworks[k].valueType) + '</td>';
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(BTGroupNetworks[k].wk05_Data, BTGroupNetworks[k].valueType) + '</td>';
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(BTGroupNetworks[k].wk06_Data, BTGroupNetworks[k].valueType) + '</td>';
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(BTGroupNetworks[k].wk07_Data, BTGroupNetworks[k].valueType) + '</td>';
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(BTGroupNetworks[k].wk08_Data, BTGroupNetworks[k].valueType) + '</td>';
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(BTGroupNetworks[k].wk09_Data, BTGroupNetworks[k].valueType) + '</td>';
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(BTGroupNetworks[k].wk10_Data, BTGroupNetworks[k].valueType) + '</td>';
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(BTGroupNetworks[k].wk11_Data, BTGroupNetworks[k].valueType) + '</td>';
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(BTGroupNetworks[k].wk12_Data, BTGroupNetworks[k].valueType) + '</td>';
                BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(BTGroupNetworks[k].wk13_Data, BTGroupNetworks[k].valueType) + '</td>';
                if (TotalWeek == 14)
                    BTGroupHTML += '<td style="width:110px;max-width:110px;">' + FormatNumber(BTGroupNetworks[k].wk14_Data, BTGroupNetworks[k].valueType) + '</td>';
                BTGroupHTML += ' </tr>';
            }

            BTGroupHTML += '</tbody>';
            BTGroupHTML += '</table>';
            BTGroupHTML += '</div>';
            BTGroupHTML += '</div>';
            BTGroupHTML += '</td>';
            BTGroupHTML += '</tr>';
            // Table For Networks Ends here
        }
        BTGroupHTML += '</tbody>';
        BTGroupHTML += '</table>';
        BTGroupHTML += '</div>';

        if (curIndex == 0)
            $("#divMediaPlanSummaryBuyTypeGroup").html(BTGroupHTML);
        else
            $("#divMediaPlanSummaryBuyTypeGroup").append(BTGroupHTML);

        BindBTGroupDemos(curIndex, HeaderData.groupName);
    }
    else {
        if (curIndex <= AllBTGroups.length) {
            BindMediaPlanSummaryBTGroups(curIndex + 1);
        }
        else {
            $("#tdHeaderNetworkTotals").html(TotalNetworks);
        }
    }


}

function BindBTGroupDemos(curIndex, groupName) {
    //alert(curIndex);
    //alert(groupName);

    if (mediaPlansSummaryJSON.lstMediaPlanDemo != null && mediaPlansSummaryJSON.lstMediaPlanDemo.length > 0) {
        var result = mediaPlansSummaryJSON.lstMediaPlanDemo.filter(o => o.buyTypeGroup == 'All' || o.buyTypeGroup == groupName);

        var markup = "";
        for (var x = 0; x < result.length; x++) {
            markup += '<option value=' + result[x].demoId + '>' + result[x].demoName + '</option>';
        }
        $("#ddlBTGroupDemos_" + groupName.replace(/ /g, "_")).html(markup).show;
        $("#ddlBTGroupDemos_" + groupName.replace(/ /g, "_")).multiSelect();
        $("#ddlBTGroupDemos_" + groupName.replace(/ /g, "_") + ".multi-select-menu").css("width", "175px!important");

        $("#SpnBTGroupDemos_" + groupName.replace(/ /g, "_") + " .multi-select-button").html("--- Select ---");

        $("#SpnBTGroupDemos_" + groupName.replace(/ /g, "_") + " .multi-select-menuitem input").change(function () {
            ValidateMultiSelctCheckbox('SpnBTGroupDemos_' + groupName.replace(/ /g, "_"), this);
        });
        $("#SpnBTGroupDemos_" + groupName.replace(/ /g, "_") + " .multi-select-menu").css("margin-top", "25px");

    }

    if (curIndex < AllBTGroups.length - 1) {
        setTimeout(function () {
            BindMediaPlanSummaryBTGroups(curIndex + 1);
        }, 200);
    }
    else {
        $("#tdHeaderNetworkTotals").html(TotalNetworks);
    }
}
function FormatNumber(value, format,ShowZero) {
    if (format == "integer") {
        if (value != '')
            return $.fn.dataTable.render.number(',', '', 0, '').display(value);
        else {
            if (ShowZero)
                return $.fn.dataTable.render.number(',', '', 0, '').display('0');
            else
                return value;
        }
    }
    else if (format == "integerpercentage") {
        if (value != '')
            return $.fn.dataTable.render.number(',', '', 0, '').display(value) + "%";
        else {
            if (ShowZero)
                return $.fn.dataTable.render.number(',', '', 0, '').display('0') + "%";
            else
                return value;
        }
    }
    else if (format == "decimal") {
        if (value != '')
            return $.fn.dataTable.render.number(',', '.', 2, '').display(value);
        else {
            if (ShowZero)
                return $.fn.dataTable.render.number(',', '.', 2, '').display('0');
            else
                return value;
        }
    }
    else if (format == "decimalmoney") {
        if (value != '')
            return $.fn.dataTable.render.number(',', '.', 2, '$').display(value);
        else {
            if (ShowZero)
                return $.fn.dataTable.render.number(',', '.', 2, '$').display('0');
            else
                return value;
        }
    }
    else if (format == "decimalpercentage") {
        if (value != '')
            return $.fn.dataTable.render.number(',', '.', 2, '').display(value) + "%";
        else {
            if (ShowZero)
              return $.fn.dataTable.render.number(',', '.', 2, '').display('0') + "%";
            else
                return value;
        }
    }
    else if (format == "decimalpercentagecc") {
        if (value != '')
            return $.fn.dataTable.render.number(',', '.', 3, '').display(value) + "%";
        else {
            if (ShowZero)
                return $.fn.dataTable.render.number(',', '.', 3, '').display('0') + "%";
            else
                return value;
        }
    }
}
//Functions For Total Section Data Binding End Here
function ValidateMultiSelctCheckbox(parentTD, ctrlOption) {
    // alert($(ctrlOption).prop("checked"));
    if ($(ctrlOption).val() == 0) {
        if ($(ctrlOption).prop("checked")) {
            $("#" + parentTD + " .multi-select-menuitem").find("input").prop("checked", true);
        }
        else {
            $("#" + parentTD + " .multi-select-menuitem").find("input").prop("checked", false);
        }
    }
    else {
        if ($(ctrlOption).prop("checked")) {
            if ($("#" + parentTD + " .multi-select-menuitem").find("input:checked").length == $("#" + parentTD + " .multi-select-menuitem").find("input").length - 1) {
                $($("#" + parentTD + " .multi-select-menuitem").find("input")[0]).prop("checked", true);
            }
        }
        else {
            $($("#" + parentTD + " .multi-select-menuitem").find("input")[0]).prop("checked", false);
        }
    }
    if (parentTD != 'spnAllDemos' && parentTD.toLowerCase().trim().indexOf('spnbtgroupdemos_') < 0)
        SelectionChanged = true;
    CreateToolTips(parentTD);
}

function GetSelectdItems(ParentID, ItemName) {
    var SelectedItems = [];
    var SelItemArr = $("#" + ParentID + " .multi-select-menuitem").find("input:checked");
    if (SelItemArr.length > 0) {
        for (var x = 0; x < SelItemArr.length; x++) {
            if ($(SelItemArr[x]).parent().text().trim() != "All")
                if (ItemName == "BTGroups")
                    SelectedItems.push($($(SelItemArr[x]).parent()).text().trim());
                else
                    SelectedItems.push($(SelItemArr[x]).val());
        }
    }
    //else {
    //    SelectedItems.push('');
    //}

    return SelectedItems;
}
function CreateToolTips(parentTD) {
    if ($($("#" + parentTD + " .multi-select-menuitem").find("input")[0]).prop("checked")) {
        $("#" + parentTD + " .multi-select-button").html("All Selected");
    }
    else {
        if ($("#" + parentTD + " .multi-select-menuitem").find("input").length == 0) {
            $("#" + parentTD + " .multi-select-button").html("--- None Selected ---");
        }
        else if ($("#" + parentTD + " .multi-select-menuitem").find("input:checked").length == 0) {
            $("#" + parentTD + " .multi-select-button").html("--- Select ---");
        }
        else if ($("#" + parentTD + " .multi-select-menuitem").find("input:checked") == 1) {
            $("#" + parentTD + " .multi-select-button").html($("#" + parentTD + " .multi-select-menuitem").find("input:checked").parent().text());
        }
        else {
            $("#" + parentTD + " .multi-select-button").html($("#" + parentTD + " .multi-select-menuitem").find("input:checked").length + " selected");
        }
    }
}

function ToggleNetworkClass(ctrl) {
    if ($($(ctrl).find("i")).hasClass("fa-angle-double-up")) {
        $($(ctrl).find("i")).removeClass("fa-angle-double-up");
        $($(ctrl).find("i")).addClass("fa-angle-double-down");
    }
    else {
        $($(ctrl).find("i")).removeClass("fa-angle-double-down");
        $($(ctrl).find("i")).addClass("fa-angle-double-up");
    }
}

//ST-1006
function SetBudgetDisplay(ctrl) {
    $.ajax({
        url: "/MediaPlan/SetUserBudgetDisplay",
        data: {
            "MediaPlanId": $("#hdnMediaPlanId").val(),
            "DisplayBudgetValue": $(ctrl).val()
        },
        cache: false,
        type: "GET",
        success: function (result) {
            if (result.success) {
                SelectionChanged = true;
                setTimeout(function () { BindMediaPlanSummary(); }, 500);
                // Code for Refresh Summary Page Data
            }
        },
        error: function (response) {
            console.log(response);
        }
    });
}

function findValueInArray(value, arr) {
    let valueExists = false;

    for (let i = 0; i < arr.length; i++) {
        let name = arr[i];
        if (name.toString().toLowerCase().trim() == value.toString().toLowerCase().trim()) {
            valueExists = true;
            break;
        }
    }
    return valueExists;
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

function OpenBTGroupSummary(mpId, BTGroup) {    
    window.location.href = "/MediaPlan/BuyTypeGroupSummary?MediaPlanId=" + mpId + "&BTGroup=" + BTGroup.trim();
}

function LockMediaPlan() {
    var mediaPlanId = GetParameterValues('MediaPlanId');
    if (mediaPlanId != 0 || mediaPlanId != null) {
        $.ajax({
            url: "/MediaPlan/MediaPlanLock/",
            data: { MediaPlanId: mediaPlanId },
            cache: false,
            type: "POST",
            success: function (result) {

            },
            error: function (response) {

            }
        });
    }
}
function MediaPlanBTGCheckLock(action, hdrData) {
    var mediaPlanId = GetParameterValues('MediaPlanId');
    if (mediaPlanId != 0 || mediaPlanId != null) {
        $.ajax({
            url: "/MediaPlan/MediaPlanCheckLock/",
            data: {
                MediaPlanId: mediaPlanId,
                Action: action
            },
            cache: false,
            type: "POST",
            success: function (response) {
                if (response.responseCode != 200) {
                    HideOverlayMediaSummary();
                    swal({
                        html: response.responseText,
                        type: 'error',
                    });
                    setTimeout(function () {
                        window.location.href = "/ManageMedia/Planning";
                    }, 3000);
                }
                else {
                    switch (action) {
                        case "update":
                            createEditMediaPlan(action);
                            break;
                        default:
                    }
                }
            },
            error: function (response) {
                var err = response.result;
            }
        });
    }
}
function MediaPlanCheckLock(action, hdrData) {
    var mediaPlanId = GetParameterValues('MediaPlanId');
    if (mediaPlanId != 0 || mediaPlanId != null) {
        $.ajax({
            url: "/MediaPlan/MediaPlanCheckLock/",
            data: {
                MediaPlanId: mediaPlanId,
                Action: action
            },
            cache: false,
            type: "POST",
            success: function (response) {
                if (response.responseCode != 200) {
                    HideOverlayMediaSummary();
                    swal({
                        html: response.responseText,
                        type: 'error',
                    });
                    setTimeout(function () {
                        window.location.href = "/ManageMedia/Planning";
                    }, 3000);
                }
                else {
                    switch (action) {
                        case "editbtg":
                            OpenBTGroupSummary($("#hdnMediaPlanId").val(), hdrData);
                            break;
                        case "editbgt":
                            EditMediaPlan();
                            break;
                        case "quickdtl":
                           
                            break;
                        case "notes":
                            OpenMediaPlanNotes();
                            break;
                        case "attachments":
                            
                            break;
                        case "querystr":
                            BindMediaPlanSummary();
                            break;
                        case "publish":
                            ToggleMediaPlanStatus();
                            break;                       
                        case "createnote":
                            SaveMediaNote();
                            break;                            
                        default:
                        
                    }
                }
            },
            error: function (response) {
                var err = response.result;
            }
        });
    }
}

var unloadEvent = function (e) {
    var mediaPlanId = GetParameterValues('MediaPlanId');

    if (mediaPlanId != 0 || mediaPlanId != null) {
        $.ajax({
            url: "/MediaPlan/MediaPlanUnlock/",
            data: { MediaPlanId: mediaPlanId },
            cache: false,
            type: "POST",
            success: function (result) {

            },
            error: function (response) {

            }
        });
    }
};
$(window).on('beforeunload', function () {
    try {  
        unloadEvent();        
    }
    catch (err) {
    }
});

