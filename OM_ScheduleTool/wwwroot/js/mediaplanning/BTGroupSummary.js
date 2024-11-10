var _mediaPlanId;
var BTGroupsSummaryJSON;
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
        BindBTGroupSummaryView();
    }, 500);
    setTimeout(function () {
        LockBTGMediaPlan();
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
function BindBTGroupSummaryView(initialLoad) {
    ShowOverlayMediaSummary();
    var MediaPlanId = $("#hdnMediaPlanId").val();
    var BuyTypeGroup = GetParameterValues("BTGroup");

    setTimeout(function () {
        $.ajax({
            url: "/MediaPlan/GetMediaPlanBTGroupNetworks",
            data: {
                "MediaPlanId": MediaPlanId,
                "BuyTypeGroup": BuyTypeGroup.replace("_", " "),
            },
            cache: false,
            type: "POST",
            success: function (result) {
                if (result) {
                    console.log(result);
                    initialLoad = false;
                    //SelectionChanged = false;
                    BTGroupsSummaryJSON = result;
                    //console.log(BTGroupsSummaryJSON);
                    HideOverlayMediaSummary();
                    if (BTGroupsSummaryJSON != null) {
                        BindMediaPlanBTSummaryHeader();
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

function BindMediaPlanBTSummaryHeader() {
    if (BTGroupsSummaryJSON.mediaPlanSummaryHeader != null) {
        $("#hdPageHeading").val($("#hdnPageHeading").val());
        $("#hdnMediaPlanName").val(BTGroupsSummaryJSON.mediaPlanSummaryHeader.mediaPlanName);
        $("#hdnQuarterName").val(BTGroupsSummaryJSON.mediaPlanSummaryHeader.quarterName);
        $("#hdnClientName").val(BTGroupsSummaryJSON.mediaPlanSummaryHeader.clientName);
        $("#hdnQuarterId").val(BTGroupsSummaryJSON.mediaPlanSummaryHeader.quarterId);
        $("#hdnClientId").val(BTGroupsSummaryJSON.mediaPlanSummaryHeader.clientId);
        $("#hdnPlanYear").val(BTGroupsSummaryJSON.mediaPlanSummaryHeader.planYear);
        $("#hdn15SecPerc").val(BTGroupsSummaryJSON.mediaPlanSummaryHeader.per15Sec);
        $("#ddlBudgetDisplay").val(BTGroupsSummaryJSON.mediaPlanSummaryHeader.budgetType);
        $("#hdnBuyTypeGroupId").val(BTGroupsSummaryJSON.buyTypeGroupId);
        
        /*$("#hdnMediaPlanName").html(BTGroupsSummaryJSON.mediaPlanSummaryHeader.mediaPlanName + " (" + BTGroupsSummaryJSON.mediaPlanSummaryHeader.countryShort + ") - " + BTGroupsSummaryJSON.mediaPlanSummaryHeader.planYear);*/
        $("#hdnMediaPlanName").html(BTGroupsSummaryJSON.mediaPlanSummaryHeader.mediaPlanName);
        //$("#spnCountry").html(BTGroupsSummaryJSON.mediaPlanSummaryHeader.CountryShort);
        $("#spnModifiedDate").html(BTGroupsSummaryJSON.mediaPlanSummaryHeader.modifiedDate);
        $("#spnModifiedBy").html(BTGroupsSummaryJSON.mediaPlanSummaryHeader.modifiedBy);
        $("#hdPageHeading").html($("#hdnPageHeading").val());
        $("#spnNoteCount").html(BTGroupsSummaryJSON.mediaPlanSummaryHeader.notesCount <= 0 ? "" : "(" + BTGroupsSummaryJSON.mediaPlanSummaryHeader.notesCount + ")");
        $("#spnAttachmentCount").html(BTGroupsSummaryJSON.mediaPlanSummaryHeader.attachmentCount <= 0 ? "" : "(" + BTGroupsSummaryJSON.mediaPlanSummaryHeader.attachmentCount + ")");
        $("#icoPublished").removeAttr("class");
        $("#icoPublished").css("");
        if (BTGroupsSummaryJSON.mediaPlanSummaryHeader.planStatus.toLowerCase() == "published") {
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
        if (BTGroupsSummaryJSON.mediaPlanSummaryHeader.disableBudgetToggle) {
            $("#ddlBudgetDisplay").attr("disabled", true);
            $("#ddlBudgetDisplay").css("background-color", "#e5e5e5");
            $("#ddlBudgetDisplay").attr("title", "Commission rate does not existfor the quarter " + BTGroupsSummaryJSON.mediaPlanSummaryHeader.quarterName + ". Budget display toggle is disabled");
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
    BindBTGroupNetworks();
}

function BindDayPart() {
    var HTMLDayPart = '';
    if (BTGroupsSummaryJSON.lstDayPart != null && BTGroupsSummaryJSON.lstDayPart != undefined && BTGroupsSummaryJSON.lstDayPart.length > 0) {
        if (BTGroupsSummaryJSON.lstDayPart.length > 4) {
            for (var z = 0; z < 4; z++) {                
                HTMLDayPart += '<tr>';
                if (BTGroupsSummaryJSON.lstDayPart[z + 4] != null && BTGroupsSummaryJSON.lstDayPart[z + 4] != undefined) {
                    HTMLDayPart += '<td id="tdDay" style="width:50%!important;">';
                    HTMLDayPart += '<label for="" style="font-size: 16px;font-weight: bold;float:right;margin-left: 5px!important;margin-bottom:-5px;">' + BTGroupsSummaryJSON.lstDayPart[z + 4].dayPart + ': <span style="font-weight:400">' + FormatNumber(BTGroupsSummaryJSON.lstDayPart[z + 4].percVal, 'decimalpercentagezero', 0) + '</span></label>';
                    HTMLDayPart += '</td>';
                    HTMLDayPart += '<td id="tdDay" style="width:50%!important;">';
                    HTMLDayPart += '<label for="" style="font-size: 16px;font-weight: bold;float:right;margin-left: 5px!important;margin-bottom:-5px;">' + BTGroupsSummaryJSON.lstDayPart[z].dayPart + ': <span style="font-weight:400">' + FormatNumber(BTGroupsSummaryJSON.lstDayPart[z].percVal, 'decimalpercentagezero', 0) + '</span></label>';
                    HTMLDayPart += '</td>';
                }
                else {
                    HTMLDayPart += '<td id="tdDay" style="width:50%!important;">';
                    HTMLDayPart += '<label for="" style="font-size: 16px;font-weight: bold;float:right;margin-left: 5px!important;margin-bottom:-5px;"></span></label>';
                    HTMLDayPart += '</td>';
                    HTMLDayPart += '<td id="tdDay" style="width:50%!important;">';
                    HTMLDayPart += '<label for="" style="font-size: 16px;font-weight: bold;float:right;margin-left: 5px!important;margin-bottom:-5px;">' + BTGroupsSummaryJSON.lstDayPart[z].dayPart + ': <span style="font-weight:400">' + FormatNumber(BTGroupsSummaryJSON.lstDayPart[z].percVal, 'decimalpercentagezero', 0) + '</span></label>';
                    HTMLDayPart += '</td>';
                }
                HTMLDayPart += '</tr>';
            }
        } else {
            for (var z = 0; z < BTGroupsSummaryJSON.lstDayPart.length; z++) {
                HTMLDayPart += '<tr>';

                HTMLDayPart += '<td id="tdDay" style="width:50%!important;">';
                HTMLDayPart += '<label for="" style="font-size: 16px;font-weight: bold;float:right;margin-left: 5px!important;margin-bottom:-5px;">' + BTGroupsSummaryJSON.lstDayPart[z].dayPart + ': <span style="font-weight:400">' + FormatNumber(BTGroupsSummaryJSON.lstDayPart[z].percVal, 'decimalpercentagezero', 0) + '</span></label>';
                HTMLDayPart += '</td>';
                HTMLDayPart += '</tr>';
            }
        }
    }
    $("#tbDayPart").append(HTMLDayPart);
}


function BindBTGroupNetworks() {
    var result = BTGroupsSummaryJSON.lstNetworks;
    var HTMLHeaderBTGroups = '';

    BindDayPart();

    if (result != null && result.length >= 0) {
        for (var x = 0; x < result.length; x++) {
            HTMLHeaderBTGroups += '<tr style="background-color:#cccccc" class="parent">';
            HTMLHeaderBTGroups += '<td style="font-weight:bold;border-right:1px solid #fff; display:flex; justify-content:flex-end;align-items: center;">';
            HTMLHeaderBTGroups += '<a onclick="return ToggleNetworkClass(this,' + result[x].networkId + ')" ; style="background:#42a5f500; border:none;color:#ffffff!important;margin-right:auto;text-decoration:none;" data-toggle="collapse" href="#" role="button" aria-expanded="false" aria-controls="">';
            HTMLHeaderBTGroups += '<span style="font-weight:bold;font-size:16px;color: #205B82;">' + result[x].networkName + '</span>';
            HTMLHeaderBTGroups += '</a>';

            if (result[x].planType == "") {
                HTMLHeaderBTGroups += "<a onclick='OpenLongPlan(\"" + result[x].networkId + "\",\"" + result[x].networkName + "\",false)' style='border:none;text-decoration:none;'>";
                HTMLHeaderBTGroups += '<i class="fa fa-book fa-2x" aria-hidden="true" style="font-size: 28px;color: gray; cursor:pointer;"></i>';
                HTMLHeaderBTGroups += '</a>';
                HTMLHeaderBTGroups += "<a onclick='OpenQuickPlan(\"" + result[x].networkId + "\",\"" + result[x].networkName + "\",false)' style='border:none;text-decoration:none;'>";
                HTMLHeaderBTGroups += '<img src="../img/speeding-clock.png" style="width:36px;margin-left:10px; cursor:pointer;" />';
                HTMLHeaderBTGroups += '</a>';
            }
            else if (result[x].planType.toLowerCase() == "long") {
                HTMLHeaderBTGroups += "<a onclick='OpenLongPlan(\"" + result[x].networkId + "\",\"" + result[x].networkName + "\",false)' style='border:none;text-decoration:none;'>";
                HTMLHeaderBTGroups += '<i class="fa fa-book fa-2x" aria-hidden="true" style="font-size: 28px;color: green; cursor:pointer;"></i>';
                HTMLHeaderBTGroups += '</a>';
                HTMLHeaderBTGroups += "<a style='border:none;text-decoration:none;' disabled>";
                HTMLHeaderBTGroups += '<img src="../img/speeding-clock.png" style="width:36px;margin-left:10px; cursor:default;" />';
                HTMLHeaderBTGroups += '</a>';
            }
            else if (result[x].planType.toLowerCase() == "quick") {
                HTMLHeaderBTGroups += "<a style='border:none;text-decoration:none;' disabled>";
                HTMLHeaderBTGroups += '<i class="fa fa-book fa-2x" aria-hidden="true" style="font-size: 28px;color: gray; cursor:default;"></i>';
                HTMLHeaderBTGroups += '</a>';
                HTMLHeaderBTGroups += "<a onclick='OpenQuickPlan(\"" + result[x].networkId + "\",\"" + result[x].networkName + "\",false)' style='border:none;text-decoration:none;'>";
                HTMLHeaderBTGroups += '<img src="../img/speeding-clock-green.png" style="width:36px;margin-left:10px; cursor:pointer;" />';
                HTMLHeaderBTGroups += '</a>';
            }

            //    HTMLHeaderBTGroups += "<a onclick='OpenLongPlan(\"" + result[x].networkId + "\",\"" + result[x].networkName + "\",false)' style='border:none;text-decoration:none;'>";
            //    HTMLHeaderBTGroups += '<i class="fa fa-book fa-2x" aria-hidden="true" style="font-size: 28px;color: green; cursor:pointer;"></i>';
            //    HTMLHeaderBTGroups += '</a>';
            //    HTMLHeaderBTGroups += "<a onclick='OpenQuickPlan(\"" + result[x].networkId + "\",\"" + result[x].networkName + "\",false)' style='border:none;text-decoration:none;'>";
            //    HTMLHeaderBTGroups += '<img src="../img/speeding-clock.png" style="width:36px;margin-left:10px; cursor:pointer;" />';
            //    HTMLHeaderBTGroups += '</a>';
            //}
            //else {
            //    HTMLHeaderBTGroups += "<a onclick='OpenLongPlan(\"" + result[x].networkId + "\",\"" + result[x].networkName + "\",false)' style='border:none;text-decoration:none;'>";
            //    HTMLHeaderBTGroups += '<i class="fa fa-book fa-2x" aria-hidden="true" style="font-size: 28px;color: gray; cursor:pointer;"></i>';
            //    HTMLHeaderBTGroups += '</a>';
            //    HTMLHeaderBTGroups += "<a onclick='OpenQuickPlan(\"" + result[x].networkId + "\",\"" + result[x].networkName + "\",false)' style='border:none;text-decoration:none;'>";
            //    HTMLHeaderBTGroups += '<img src="../img/speeding-clock.png" style="width:36px;margin-left:10px; cursor:pointer;" />';
            //    HTMLHeaderBTGroups += '</a>';
            //}
            

            HTMLHeaderBTGroups += '</td>';
            if (result[x].planType.toLowerCase() == "long") {

                if (BTGroupsSummaryJSON.lstProperties != null && BTGroupsSummaryJSON.lstProperties != undefined && BTGroupsSummaryJSON.lstProperties.length > 0
                    && BTGroupsSummaryJSON.lstProperties.filter(o => o.networkId == result[x].networkId).length > 0
                ) {
                    var totalSpots = result[x].totalSpots != 0 ? result[x].totalSpots : "";
                    HTMLHeaderBTGroups += '<td style="font-weight:bold;width:110px;max-width:110px;border-right:1px solid #fff;">' + FormatNumber(result[x].totalSpend, 'decimalmoneyzero', 2) + '</td>';
                    HTMLHeaderBTGroups += '<td style="font-weight:bold;width:110px;max-width:110px;border-right:1px solid #fff;">' + FormatNumber(totalSpots, 'integerzero', 0) + '</td>';
                    HTMLHeaderBTGroups += '<td style="font-weight:bold;width:110px;max-width:110px;border-right:1px solid #fff;">' + FormatNumber(result[x].perc15, 'decimalpercentagezero', 0) + '</td>'; /* ST-1109 Changed by Shariq*/
                    HTMLHeaderBTGroups += '<td style="font-weight:bold;width:110px;max-width:110px;border-right:1px solid #fff;">' + FormatNumber(result[x].totalIMPS, 'decimalzero', 2) + '</td>';
                }
                else {
                    HTMLHeaderBTGroups += '<td style="font-weight:bold;width:110px;max-width:110px;border-right:1px solid #fff;"></td>';
                    HTMLHeaderBTGroups += '<td style="font-weight:bold;width:110px;max-width:110px;border-right:1px solid #fff;"></td>';
                    HTMLHeaderBTGroups += '<td style="font-weight:bold;width:110px;max-width:110px;border-right:1px solid #fff;"></td>';
                    HTMLHeaderBTGroups += '<td style="font-weight:bold;width:110px;max-width:110px;border-right:1px solid #fff;"></td>';
                }
                HTMLHeaderBTGroups += '<td style="font-weight:bold;width:110px;max-width:110px;border-right:1px solid #fff;"></td>';
                HTMLHeaderBTGroups += '</tr> ';
                // Code For Properties & Place Holder Rows
                HTMLHeaderBTGroups += '<tr class="' + result[x].networkId + ' child header" style="display:none;">';
                HTMLHeaderBTGroups += '<td style="font-weight:bold;border-right:1px solid #e5e5e5e5;border-left:1px solid #e5e5e5e5; display:flex;align-items: center;">';
                HTMLHeaderBTGroups += 'Property or Placeholder';
                HTMLHeaderBTGroups += '</td>';
                HTMLHeaderBTGroups += '<td style="font-weight:bold;width:110px;max-width:110px;border-right:1px solid #e5e5e5e5;">';
                HTMLHeaderBTGroups += '<div style="display:flex;">';
                HTMLHeaderBTGroups += '<span style="width: 50%;text-align: end;">Rate</span>';
                HTMLHeaderBTGroups += '<span style="width: 50%;text-align: end;">Length</span>';
                HTMLHeaderBTGroups += '</div>';
                HTMLHeaderBTGroups += '</td>';
                HTMLHeaderBTGroups += '<td style="font-weight:bold;width:110px;max-width:110px;border-right:1px solid #e5e5e5e5;">Spots</td>';
                HTMLHeaderBTGroups += '<td style="font-weight:bold;width:110px;max-width:110px;border-right:1px solid #e5e5e5e5;"></td>';
                HTMLHeaderBTGroups += '<td style="font-weight:bold;width:110px;max-width:110px;border-right:1px solid #e5e5e5e5;">';
                HTMLHeaderBTGroups += '<div style="display:flex;">';
                HTMLHeaderBTGroups += '<span style="width: 33%;text-align: end;">CPM</span>';
                HTMLHeaderBTGroups += '<span style="width: 33%;text-align: end;">IMPs</span>';
                HTMLHeaderBTGroups += '<span style="width: 33%;text-align: end;">GRPs</span>';
                HTMLHeaderBTGroups += '</div>';
                HTMLHeaderBTGroups += '</td>';
                HTMLHeaderBTGroups += '<td style="font-weight:bold;width:110px;max-width:110px;border-right:1px solid #e5e5e5e5;">';
                HTMLHeaderBTGroups += '<div style="display:flex;">';
                HTMLHeaderBTGroups += '<span style="width: 15%;text-align: start;">DP</span>';
                HTMLHeaderBTGroups += '<span style="width: 10%;text-align: end;margin-right:4%;">DP %</span>';
                HTMLHeaderBTGroups += '<span style="width: 20%;text-align: start;">Demo</span>';
                HTMLHeaderBTGroups += '<span style="width: 20%;text-align: start;">Buy Type</span>';
                HTMLHeaderBTGroups += '</div>';
                HTMLHeaderBTGroups += '</td>';
                HTMLHeaderBTGroups += '</tr>';
                if (BTGroupsSummaryJSON.lstProperties != null && BTGroupsSummaryJSON.lstProperties != undefined && BTGroupsSummaryJSON.lstProperties.length > 0) {
                    var curCurNetworkProeprties = BTGroupsSummaryJSON.lstProperties.filter(o => o.networkId == result[x].networkId)
                    {
                        if (curCurNetworkProeprties != null && curCurNetworkProeprties != undefined && curCurNetworkProeprties.length > 0) {
                            for (var y = 0; y < curCurNetworkProeprties.length; y++) {
                                var dow = "";
                                if (BTGroupsSummaryJSON.lstProperties[y].dow != null && BTGroupsSummaryJSON.lstProperties[y].dow != undefined && BTGroupsSummaryJSON.lstProperties[y].dow != "") {
                                    if (BTGroupsSummaryJSON.lstProperties[y].dow.toString().startsWith(",")) {
                                        dow = BTGroupsSummaryJSON.lstProperties[y].dow.toString().substr(1).trim();
                                    }
                                    else {
                                        dow = BTGroupsSummaryJSON.lstProperties[y].dow.toString().trim();
                                    }
                                    if (dow.trim().endsWith(",")) {
                                        dow = dow.toString().substr(0, dow.length - 1);
                                    }
                                }
                                var spots = curCurNetworkProeprties[y].totalSpots != 0 ? curCurNetworkProeprties[y].totalSpots : "";
                                var Tooltip = "";
                                if (dow != "" && BTGroupsSummaryJSON.lstProperties[y].startTime != null && BTGroupsSummaryJSON.lstProperties[y].endTime != null)
                                    Tooltip = dow + " / " + BTGroupsSummaryJSON.lstProperties[y].startTime.toString().toLowerCase() + " - " + BTGroupsSummaryJSON.lstProperties[y].endTime.toString().toLowerCase();

                                HTMLHeaderBTGroups += '<tr class="' + curCurNetworkProeprties[y].networkId + ' child data" style="display:none;">';
                                HTMLHeaderBTGroups += '<td style="border-right:1px solid #e5e5e5e5; border-left:1px solid #e5e5e5e5; display:flex;align-items: center;">';
                                HTMLHeaderBTGroups += '<a  title="' + Tooltip + '" style="text-decoration: none!important;color: #575757!important; margin-left:10px;" href="javascript:function stoppropclickedit() { return false; }" onclick="return OpenEditPropertyModal(' + curCurNetworkProeprties[y].mediaPlanPropertyId + ');">' + curCurNetworkProeprties[y].propertyName + '</a>';
                                HTMLHeaderBTGroups += '</td>';
                                HTMLHeaderBTGroups += '<td style="width:110px;max-width:110px;border-right:1px solid #e5e5e5e5;">';
                                HTMLHeaderBTGroups += '<div style="display:flex;">';
                                HTMLHeaderBTGroups += '<span style="width: 50%;text-align: end;">' + FormatNumber(curCurNetworkProeprties[y].rateAmount, 'decimalmoneyzero', 2) + '</span>';
                                HTMLHeaderBTGroups += '<span style="width: 50%;text-align: end;">:' + curCurNetworkProeprties[y].spotLen + '</span>';
                                HTMLHeaderBTGroups += '</div>';
                                HTMLHeaderBTGroups += '</td>';
                                HTMLHeaderBTGroups += '<td style="width:110px;max-width:110px;border-right:1px solid #e5e5e5e5;">' + spots + '</td>';
                                HTMLHeaderBTGroups += '<td style="width:110px;max-width:110px;border-right:1px solid #e5e5e5e5;"></td>';
                                HTMLHeaderBTGroups += '<td style="width:110px;max-width:110px;border-right:1px solid #e5e5e5e5;">';
                                HTMLHeaderBTGroups += '<div style="display:flex;">';
                                HTMLHeaderBTGroups += '<span style="width: 33%;text-align: end;">' + FormatNumber(curCurNetworkProeprties[y].cpm, 'decimalmoneyzero', 2) + '</span>';
                                HTMLHeaderBTGroups += '<span style="width: 33%;text-align: end;">' + FormatNumber(curCurNetworkProeprties[y].impressions, 'decimalzero', 2) + '</span>';
                                /*HTMLHeaderBTGroups += '<span style="width: 33%;text-align: end;">' + FormatNumber(curCurNetworkProeprties[y].grps, 'decimalzero', 1)  + '</span>';*/ /*ST-1127 Commented*/
                                HTMLHeaderBTGroups += '<span style="width: 33%;text-align: end;">' + ellipsis(15)(curCurNetworkProeprties[y].grps, 'display', null) + '</span>';
                                HTMLHeaderBTGroups += '</div>';
                                HTMLHeaderBTGroups += '</td>';
                                HTMLHeaderBTGroups += '<td style="width:110px;max-width:110px;border-right:1px solid #e5e5e5e5;">';
                                HTMLHeaderBTGroups += '<div style="display:flex;">';
                                HTMLHeaderBTGroups += '<span style="width: 15%;text-align: start;">' + curCurNetworkProeprties[y].dayPartDesc + '</span>';
                                HTMLHeaderBTGroups += '<span style="width: 10%;text-align: end;margin-right:4%;">' + FormatNumber(curCurNetworkProeprties[y].dpPerc, 'decimalpercentagezero', 0) + '</span>';
                                HTMLHeaderBTGroups += '<span style="width: 20%;text-align: start;">' + curCurNetworkProeprties[y].demoName + '</span>';
                                HTMLHeaderBTGroups += '<span style="width: 20%;text-align: start;">' + curCurNetworkProeprties[y].buyTypeCode + '</span>';
                                HTMLHeaderBTGroups += '</div>';
                                HTMLHeaderBTGroups += '</td>';
                                HTMLHeaderBTGroups += '</tr>';
                            }
                        }

                    }
                }
            }
            else { 
                //Binding of quick plan network start here
                if (BTGroupsSummaryJSON.lstQuickPlan != null && BTGroupsSummaryJSON.lstQuickPlan != undefined && BTGroupsSummaryJSON.lstQuickPlan.length > 0
                    && BTGroupsSummaryJSON.lstQuickPlan.filter(o => o.networkId == result[x].networkId).length > 0) {                  
                    HTMLHeaderBTGroups += '<td style="font-weight:bold;width:110px;max-width:110px;border-right:1px solid #fff;">' + FormatNumber(BTGroupsSummaryJSON.lstQuickPlan[0].rate, 'decimalmoneyzero', 2) + '</td>';
                    HTMLHeaderBTGroups += '<td style="font-weight:bold;width:110px;max-width:110px;border-right:1px solid #fff;">' + FormatNumber(BTGroupsSummaryJSON.lstQuickPlan[0].spots, 'integerzero', 0) + '</td>';
                    HTMLHeaderBTGroups += '<td style="font-weight:bold;width:110px;max-width:110px;border-right:1px solid #fff;">' + FormatNumber(BTGroupsSummaryJSON.lstQuickPlan[0].percent15Sec, 'decimalpercentagezero', 0) + '</td>';
                    HTMLHeaderBTGroups += '<td style="font-weight:bold;width:110px;max-width:110px;border-right:1px solid #fff;">' + FormatNumber(BTGroupsSummaryJSON.lstQuickPlan[0].imps, 'decimalzero', 2) + '</td>';
                }
                else {
                    HTMLHeaderBTGroups += '<td style="font-weight:bold;width:110px;max-width:110px;border-right:1px solid #fff;"></td>';
                    HTMLHeaderBTGroups += '<td style="font-weight:bold;width:110px;max-width:110px;border-right:1px solid #fff;"></td>';
                    HTMLHeaderBTGroups += '<td style="font-weight:bold;width:110px;max-width:110px;border-right:1px solid #fff;"></td>';
                    HTMLHeaderBTGroups += '<td style="font-weight:bold;width:110px;max-width:110px;border-right:1px solid #fff;"></td>';
                }
                HTMLHeaderBTGroups += '<td style="font-weight:bold;width:110px;max-width:110px;border-right:1px solid #fff;"></td>';
                HTMLHeaderBTGroups += '</tr> ';
               
                HTMLHeaderBTGroups += '<tr class="' + result[x].networkId + ' child header" style="display:none;">';
                HTMLHeaderBTGroups += '<td style="font-weight:bold;border-right:1px solid #e5e5e5e5;border-left:1px solid #e5e5e5e5; display:flex;align-items: center;">';
                HTMLHeaderBTGroups += 'Property or Placeholder';
                HTMLHeaderBTGroups += '</td>';
                HTMLHeaderBTGroups += '<td style="font-weight:bold;width:110px;max-width:110px;border-right:1px solid #e5e5e5e5;">';
                HTMLHeaderBTGroups += '<div style="display:flex;">';
                HTMLHeaderBTGroups += '<span style="width: 50%;text-align: end;">Rate</span>';
                HTMLHeaderBTGroups += '<span style="width: 50%;text-align: end;">Length</span>';
                HTMLHeaderBTGroups += '</div>';
                HTMLHeaderBTGroups += '</td>';
                HTMLHeaderBTGroups += '<td style="font-weight:bold;width:110px;max-width:110px;border-right:1px solid #e5e5e5e5;">Spots</td>';
                HTMLHeaderBTGroups += '<td style="font-weight:bold;width:110px;max-width:110px;border-right:1px solid #e5e5e5e5;"></td>';
                HTMLHeaderBTGroups += '<td style="font-weight:bold;width:110px;max-width:110px;border-right:1px solid #e5e5e5e5;">';
                HTMLHeaderBTGroups += '<div style="display:flex;">';
                HTMLHeaderBTGroups += '<span style="width: 33%;text-align: end;">CPM</span>';
                HTMLHeaderBTGroups += '<span style="width: 33%;text-align: end;">IMPs</span>';
                HTMLHeaderBTGroups += '<span style="width: 33%;text-align: end;">GRPs</span>';
                HTMLHeaderBTGroups += '</div>';
                HTMLHeaderBTGroups += '</td>';
                HTMLHeaderBTGroups += '<td style="font-weight:bold;width:110px;max-width:110px;border-right:1px solid #e5e5e5e5;">';
                HTMLHeaderBTGroups += '<div style="display:flex;">';
                HTMLHeaderBTGroups += '<span style="width: 15%;text-align: start;">DP</span>';
                HTMLHeaderBTGroups += '<span style="width: 10%;text-align: end;margin-right:4%;">DP %</span>';
                HTMLHeaderBTGroups += '<span style="width: 20%;text-align: start;">Demo</span>';
                HTMLHeaderBTGroups += '<span style="width: 20%;text-align: start;">Buy Type</span>';
                HTMLHeaderBTGroups += '</div>';
                HTMLHeaderBTGroups += '</td>';
                HTMLHeaderBTGroups += '</tr>';
                if (BTGroupsSummaryJSON.lstQuickPlan != null && BTGroupsSummaryJSON.lstQuickPlan != undefined && BTGroupsSummaryJSON.lstQuickPlan.length > 0) {
                    var curCurNetworkProperties = BTGroupsSummaryJSON.lstQuickPlan.filter(o => o.networkId == result[x].networkId);
                    {
                        if (curCurNetworkProperties != null && curCurNetworkProperties != undefined && curCurNetworkProperties.length > 0) {
                            for (var y = 0; y < curCurNetworkProperties.length; y++) {                

                                HTMLHeaderBTGroups += '<tr class="' + curCurNetworkProperties[y].networkId + ' child data" style="display:none;">';
                                HTMLHeaderBTGroups += '<td style="border-right:1px solid #e5e5e5e5; border-left:1px solid #e5e5e5e5; display:flex;align-items: center;">';
                                HTMLHeaderBTGroups += '<a  title="' + Tooltip + '" style="text-decoration: none!important;color: #575757!important; margin-left:10px;" href="javascript:function stoppropclickedit() { return false; }">' + curCurNetworkProperties[y].propertyName + '</a>';
                                HTMLHeaderBTGroups += '</td>';
                                HTMLHeaderBTGroups += '<td style="width:110px;max-width:110px;border-right:1px solid #e5e5e5e5;">';
                                HTMLHeaderBTGroups += '<div style="display:flex;">';
                                HTMLHeaderBTGroups += '<span style="width: 50%;text-align: end;">' + FormatNumber(curCurNetworkProperties[y].rate, 'decimalmoneyzero', 2) + '</span>';
                                HTMLHeaderBTGroups += '<span style="width: 50%;text-align: end;">:' + curCurNetworkProperties[y].length + '</span>';
                                HTMLHeaderBTGroups += '</div>';
                                HTMLHeaderBTGroups += '</td>';
                                HTMLHeaderBTGroups += '<td style="width:110px;max-width:110px;border-right:1px solid #e5e5e5e5;">' + curCurNetworkProperties[y].spots + '</td>';
                                HTMLHeaderBTGroups += '<td style="width:110px;max-width:110px;border-right:1px solid #e5e5e5e5;"></td>';
                                HTMLHeaderBTGroups += '<td style="width:110px;max-width:110px;border-right:1px solid #e5e5e5e5;">';
                                HTMLHeaderBTGroups += '<div style="display:flex;">';
                                HTMLHeaderBTGroups += '<span style="width: 33%;text-align: end;">' + FormatNumber(curCurNetworkProperties[y].cpm, 'decimalmoneyzero', 2) + '</span>';
                                HTMLHeaderBTGroups += '<span style="width: 33%;text-align: end;">' + FormatNumber(curCurNetworkProperties[y].imps, 'decimalzero', 2) + '</span>';                               
                                HTMLHeaderBTGroups += '<span style="width: 33%;text-align: end;">' + ellipsis(15)(curCurNetworkProperties[y].grps, 'display', null) + '</span>';
                                HTMLHeaderBTGroups += '</div>';
                                HTMLHeaderBTGroups += '</td>';
                                HTMLHeaderBTGroups += '<td style="width:110px;max-width:110px;border-right:1px solid #e5e5e5e5;">';
                                HTMLHeaderBTGroups += '<div style="display:flex;">';
                                HTMLHeaderBTGroups += '<span style="width: 15%;text-align: start;">' + 'n/a' + '</span>';
                                HTMLHeaderBTGroups += '<span style="width: 10%;text-align: end;margin-right:4%;">' + 'n/a' + '</span>';
                                HTMLHeaderBTGroups += '<span style="width: 20%;text-align: start;">' + curCurNetworkProperties[y].demoName + '</span>';
                                HTMLHeaderBTGroups += '<span style="width: 20%;text-align: start;">' + curCurNetworkProperties[y].buyType + '</span>';
                                HTMLHeaderBTGroups += '</div>';
                                HTMLHeaderBTGroups += '</td>';
                                HTMLHeaderBTGroups += '</tr>';
                            }
                        }

                    }
                }

            }
            //Binding of quick plan network end here
        }
        $("#tbBuyTypeGroupSummary").html(HTMLHeaderBTGroups);

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
                BTGroupsSummaryJSON.mediaPlanSummaryHeader.planStatus = MediaPlanStatus;
                if (BTGroupsSummaryJSON.mediaPlanSummaryHeader.planStatus.toLowerCase() == "published") {
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
function FormatNumber(value, format, decimalPoitns) {
    if (format == "integer") {
        if (parseFloat(value) > 0)
            return $.fn.dataTable.render.number(',', '', 0, '').display(value);
        else
            return "";
    }
    else if (format == "integerzero") {
        return $.fn.dataTable.render.number(',', '', 0, '').display(value);
    }
    else if (format == "decimal") {
        if (parseFloat(value) > 0)
            return $.fn.dataTable.render.number(',', '.', decimalPoitns, '').display(value);
        else
            return "";
    }
    else if (format == "decimalzero") {
        return $.fn.dataTable.render.number(',', '.', decimalPoitns, '').display(value);
    }
    else if (format == "decimalmoney") {
        if (parseFloat(value) > 0)
            return $.fn.dataTable.render.number(',', '.', decimalPoitns, '$').display(value);
        else
            return "";
    }
    else if (format == "decimalmoneyzero") {
        return $.fn.dataTable.render.number(',', '.', decimalPoitns, '$').display(value);
    }
    else if (format == "decimalpercentage") {
        if (parseFloat(value) > 0)
            return $.fn.dataTable.render.number(',', '.', decimalPoitns, '').display(value) + "%";
        else
            return "";
    }
    else if (format == "decimalpercentagezero") {
        return $.fn.dataTable.render.number(',', '.', decimalPoitns, '').display(value) + "%";
    }
    //    integer
    //decimal
    //decimalpercentage
    //decimalmoney
    //return $.fn.dataTable.render.number(',', '.', 2, '$').display(value)
    //return '$' + value;
}
//Functions For Total Section Data Binding End Here

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

function ToggleNetworkClass(ctrl, netid) {
    if ($($($(ctrl).closest("table")).find("tr." + netid)).css("display") == 'none') {
        $($($(ctrl).closest("table")).find("tr." + netid)).show(400);
    }
    else {
        $($($(ctrl).closest("table")).find("tr." + netid)).hide(400);
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

function ExportBTSummaryViewToExcel() {
    return false;
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
function LockBTGMediaPlan() {
    var mediaPlanId = $("#hdnMediaPlanId").val();
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

var unloadEvent = function (e) {
    var mediaPlanId = $("#hdnMediaPlanId").val();

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
