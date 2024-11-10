function removeSelectedNetwork(network) {    
    countNetworks--;    
    if (countNetworks == 0) {
        $("#lblProcessExportErrors").hide();
        $("#divProcessExportErrors").hide();
        $("#processExportErrorDiv").empty();
        $("#processExportInfoDiv").empty();       
        $('#btnProcessExportProposal').attr('disabled', 'disabled');
    }
    if (countNetworks <= 9) {
        $("#networkLimit").css({ 'color': '' });
        $("#ddlnetworks").css({ 'border-color': '' });
        $("#ddlnetworks").val("");
    }
    $("#" + network.replace(/\&|\!|\~|\`|\@|\#|\$|\%|\^|\&|\*|\_|\+|\=|\:|\;|\"|\'|\<|\>|\,|\.|\?|\\|\/|\{|\}|\[|\]|-|\|| |\(|\)/g, "")).remove();
    $('label[name="' + network.replace(/\&|\!|\~|\`|\@|\#|\$|\%|\^|\&|\*|\_|\+|\=|\:|\;|\"|\'|\<|\>|\,|\.|\?|\\|\/|\{|\}|\[|\]|-|\|| |\(|\)/g, "") + '"]').remove();
    $('label[name="' + network.replace(/\&|\!|\~|\`|\@|\#|\$|\%|\^|\&|\*|\_|\+|\=|\:|\;|\"|\'|\<|\>|\,|\.|\?|\\|\/|\{|\}|\[|\]|-|\|| |\(|\)/g, "") + '"]').remove(); 
    $('hr[name="' + network.replace(/\&|\!|\~|\`|\@|\#|\$|\%|\^|\&|\*|\_|\+|\=|\:|\;|\"|\'|\<|\>|\,|\.|\?|\\|\/|\{|\}|\[|\]|-|\|| |\(|\)/g, "") + '"]').remove();
    $("#divExportProposalBuyType > br").remove();
    $("#divExportProposalDemo > br").remove();
    $("#divExportProposalNetworks > br").remove();
    $("." + network.replace(/\&|\!|\~|\`|\@|\#|\$|\%|\^|\&|\*|\_|\+|\=|\:|\;|\"|\'|\<|\>|\,|\.|\?|\\|\/|\{|\}|\[|\]|-|\|| |\(|\)/g, "") + "-Info").remove();
    $("." + network.replace(/\&|\!|\~|\`|\@|\#|\$|\%|\^|\&|\*|\_|\+|\=|\:|\;|\"|\'|\<|\>|\,|\.|\?|\\|\/|\{|\}|\[|\]|-|\|| |\(|\)/g, "") + "-Error").remove();
    var isErrorAvailable = $("#processExportErrorDiv").html();
    var isInfoAvailable = $("#processExportInfoDiv").html();
    if (isErrorAvailable == "" && isInfoAvailable == "") {
        $("#lblProcessExportErrors").hide();
        $("#divProcessExportErrors").hide();
    }
    exportData.splice(exportData.indexOf(network), 1);
    ddlSelectedNetwork = "";
} 

var isKeyPressed = 0;
function keyPressed() {
    isKeyPressed = 1;
}

function mouseClicked() {
    isKeyPressed = 0;
}

var ddlSelectedNetwork = "";
var countNetworks = 0;
function selectANetwork(network) {
    if (isKeyPressed == 1) {
        $("#ddlnetworks").val("");
        return;
    }
    if (network == '') {
        $("#ddlnetworks").val("");
        return;
    }
    if (countNetworks > 9) {
        $("#networkLimit").css('color', 'red');
        $("#ddlnetworks").css('border-color', 'red');
        $("#ddlnetworks").val("");
        return;
    }    
    //var isAlreadySelected = '';
    //isAlreadySelected = $("#" + network.replace(/\&|\!|\~|\`|\@|\#|\$|\%|\^|\&|\*|\_|\+|\=|\:|\;|\"|\'|\<|\>|\,|\.|\?|\\|\/|\{|\}|\[|\]|-|\|| |\(|\)/g, "")).html();
    //if (isAlreadySelected != undefined) {
    if (exportData.indexOf(network) != -1) {
        swal("Error: Network already selected!");
        $("#ddlnetworks").val("");
        return;
    }   
    exportData.push(network);
    ddlSelectedNetwork = "~" + network;
    PopulateExportBuyTypes(_UniqueId, null);
    $("#ddlnetworks").val("");
    countNetworks++;
}

function PopulateExportNetworks(_scheduleProposalId) {
    var procemessage = "<option value='0'>Select Network...</option>";
    $("#ddlExportProposalNetwork").html(procemessage).show();
    try {
        $.ajax({
            url: '/ScheduleProposal/GetNetworkNames',
            type: 'POST',
            async: true,
            data: {
                scheduleProposalId: _scheduleProposalId
            },
            success: function (result) {
                if (result.success && result.data.length > 0) {
                    
                    var markup = "<select name='ddlnetworks' id='ddlnetworks' class='form-control'  onchange='javascript: selectANetwork(this.value);' onkeypress='javascript: keyPressed();' onmousedown='javascript: mouseClicked();'>";
                    markup += '<option value="">Networks:</option>';                   
                    for (var x = 0; x < result.data.length; x++) {                        
                        markup += '<option value="' + result.data[x] + '">' + result.data[x] + '</option>';                       
                    }
                    markup += '</select>'
                    markup += '<div id="networkLimit" style="margin-top: 5px; margin-left: 3px; font-size: 12px;"><label><span>Note: Max. 10 selections are allowed.</span></label></div>'
                    $("#selectNetworks").html(markup).show();
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

$("#divExportProposalDemo").change(function () {
    if ($('input[id=demos]:checked').length == 0) {
        $('#btnProcessExportProposal').attr('disabled', 'disabled');
    }
    else {
        $('#btnProcessExportProposal').removeAttr('disabled');
    }
});

function removeDemo(id, count) { 
    var btId = id.split("-");
    if ($('input[id=buytypes]:checked').length == 0) {
        $('#btnProcessExportProposal').attr('disabled', 'disabled');
    } else {
        $('#btnProcessExportProposal').removeAttr('disabled');
    }    
    var isChecked = $("label#" + btId[0] + count + " :input").is(":checked");    
    if (isChecked) {        
        $("label#" + id + " :input").prop("checked", true);
        $("label#" + id + " :input").prop("disabled", false);
    }
    else {
        $("label#" + id + " :input").prop("checked", false); 
        $("label#" + id + " :input").prop("disabled", true);
    }        
}

var exportData = [];
function PopulateExportBuyTypes(_scheduleProposalId, filterBuyTypes) {

    var url = "/ScheduleProposal/GetBuyTypesAndDemos/";   
    $.ajax({
        url: url,
        data: {
            scheduleProposalId: _scheduleProposalId,
            filterNetworkNames: ddlSelectedNetwork,
            filterBuyTypes: filterBuyTypes
        },
        cache: false,
        type: "POST",
        success: function (result) {
            if (result.data.length == 0) {
                $("#divExportProposalBuyType").empty();
                $("#divExportProposalBuyType").html('<p><i>Please select buy type to list demos available.</i></p>').show()
                $("#divExportProposalDemo").empty();
            }
            else if (result.success && result.data.length > 0) {
                $("#divExportProposalBuyType > p").remove();
                var buyTypeMarkup = "";
                var demoMarkup = "";
                var networkMarkup = "";
                var prevNetName = "";               
                var prevBuyType = [];               
                var idCount = 0;
                var fnCount = 0;
                for (var x = 0; x < result.data.length; x++) {
                    if (result.data[x].stdNetName != prevNetName) {
                        networkMarkup = '<div class="css-control css-control-sm css-control-secondary css-checkbox" id="' + result.data[x].stdNetName.replace(/\&|\!|\~|\`|\@|\#|\$|\%|\^|\&|\*|\_|\+|\=|\:|\;|\"|\'|\<|\>|\,|\.|\?|\\|\/|\{|\}|\[|\]|-|\|| |\(|\)/g, "") + '" style="cursor: pointer;margin-top: 11px;" onclick="javascript: removeSelectedNetwork(\'' + result.data[x].stdNetName + '\');">' +
                        '<span style="display: inline-block;border: 1px;border-style: solid;text-align: center;background-color: #868e96;border-color: #60686f;width: 16px;height: 16px;">' +
                        '<p class="" style="color: white;font-size: 9px;font-weight: bold;">&#x2715;</p></span>' +
                        '<div style="margin-top:-18px;margin-left:16px;"><label class="css-control css-control-sm css-control-secondary css-checkbox" style="margin-left:7px;">' + result.data[x].stdNetName + '</label></div>' +
                        '</div>';
                    }
                    if (prevBuyType.indexOf(result.data[x].buyType) == -1) {
                        buyTypeMarkup += '<label name="' + result.data[x].stdNetName.replace(/\&|\!|\~|\`|\@|\#|\$|\%|\^|\&|\*|\_|\+|\=|\:|\;|\"|\'|\<|\>|\,|\.|\?|\\|\/|\{|\}|\[|\]|-|\|| |\(|\)/g, "") + '" class="css-control css-control-sm css-control-secondary css-checkbox" id="' + result.data[x].stdNetName.replace(/\&|\!|\~|\`|\@|\#|\$|\%|\^|\&|\*|\_|\+|\=|\:|\;|\"|\'|\<|\>|\,|\.|\?|\\|\/|\{|\}|\[|\]|-|\|| |\(|\)/g, "") + idCount++ + '">';
                        buyTypeMarkup += "<input id='buytypes' type='checkbox' class='css-control-input' name='checks-buytypes-" + result.data[x].stdNetName.replace(/\&|\!|\~|\`|\@|\#|\$|\%|\^|\&|\*|\_|\+|\=|\:|\;|\"|\'|\<|\>|\,|\.|\?|\\|\/|\{|\}|\[|\]|-|\|| |\(|\)/g, "") + "' checked='' value='" + result.data[x].buyType + "' onchange='javascript: removeDemo(\"" + (result.data[x].stdNetName.replace(/\&|\!|\~|\`|\@|\#|\$|\%|\^|\&|\*|\_|\+|\=|\:|\;|\"|\'|\<|\>|\,|\.|\?|\\|\/|\{|\}|\[|\]|-|\|| |\(|\)/g, "") + "-" + result.data[x].buyType) + "\",\"" + fnCount++ + "\");'>";
                    buyTypeMarkup += "<span class='css-control-indicator'></span> " + result.data[x].buyType + "</label>";
                    }
                    demoMarkup += "<label name='" + result.data[x].stdNetName.replace(/\&|\!|\~|\`|\@|\#|\$|\%|\^|\&|\*|\_|\+|\=|\:|\;|\"|\'|\<|\>|\,|\.|\?|\\|\/|\{|\}|\[|\]|-|\|| |\(|\)/g, "") + "' class='css-control css-control-sm css-control-secondary css-checkbox' id='" + result.data[x].stdNetName.replace(/\&|\!|\~|\`|\@|\#|\$|\%|\^|\&|\*|\_|\+|\=|\:|\;|\"|\'|\<|\>|\,|\.|\?|\\|\/|\{|\}|\[|\]|-|\|| |\(|\)/g, "") + "-" + result.data[x].buyType + "'>";
                    demoMarkup += "<input id='demos' type='checkbox' class='css-control-input' name='checks-demos-" + result.data[x].stdNetName.replace(/\&|\!|\~|\`|\@|\#|\$|\%|\^|\&|\*|\_|\+|\=|\:|\;|\"|\'|\<|\>|\,|\.|\?|\\|\/|\{|\}|\[|\]|-|\|| |\(|\)/g, "") + "' checked='' value='" + result.data[x].demoName + "'>";
                    demoMarkup += "<span class='css-control-indicator'></span> " + result.data[x].demoName + " (" + result.data[x].buyType + ")" + "</label>";

                    prevNetName = result.data[x].stdNetName;
                    prevBuyType.push(result.data[x].buyType);
                    if (x == result.data.length - 1) {
                        networkMarkup += "<br/>";
                        networkMarkup += "<hr name='" + result.data[x].stdNetName.replace(/\&|\!|\~|\`|\@|\#|\$|\%|\^|\&|\*|\_|\+|\=|\:|\;|\"|\'|\<|\>|\,|\.|\?|\\|\/|\{|\}|\[|\]|-|\|| |\(|\)/g, "") + "' style='margin-top: 9px; border: none;'>";
                        buyTypeMarkup += "<br/>";
                        buyTypeMarkup += "<hr name='" + result.data[x].stdNetName.replace(/\&|\!|\~|\`|\@|\#|\$|\%|\^|\&|\*|\_|\+|\=|\:|\;|\"|\'|\<|\>|\,|\.|\?|\\|\/|\{|\}|\[|\]|-|\|| |\(|\)/g, "") + "' style='width: 1385px;margin-left: -243px;'>";
                        demoMarkup += "<br/>";
                        demoMarkup += "<hr name='" + result.data[x].stdNetName.replace(/\&|\!|\~|\`|\@|\#|\$|\%|\^|\&|\*|\_|\+|\=|\:|\;|\"|\'|\<|\>|\,|\.|\?|\\|\/|\{|\}|\[|\]|-|\|| |\(|\)/g, "") + "'>";
                    }
                }
                    
                $("#divExportProposalNetworks").append(networkMarkup).show();
                $("#divExportProposalBuyType").append(buyTypeMarkup).show();
                $("#divExportProposalDemo").append(demoMarkup).show();
                $('#btnProcessExportProposal').removeAttr('disabled');                 
            }                
        },
        error: function (response) {
            swal("error: " + response);
        }
    });
}

function ProcessExportProposal(_scheduleProposalId) { 
    ShowOverlayMain();
    $("#networkLimit").css({ 'color': '' });
    $("#ddlnetworks").css({ 'border-color': '' });
    $("#ddlnetworks").val("");
    $('#btnProcessExportProposal').text("Processing...");
    $('#btnProcessExportProposal').attr('disabled', 'disabled');
    var hasAtleastOneBtError = false;  
    var hasAtleastOneDpInfo = false;
    var urls = [];    
    var rtError = "";
    var rtInfo = "";
    var btDeError = "";   
    for (var i = 0; i < exportData.length; i++) {       
        var bt = "";
        var prevBt = "";
        if ($('input:checkbox[name=checks-buytypes-' + exportData[i].replace(/\&|\!|\~|\`|\@|\#|\$|\%|\^|\&|\*|\_|\+|\=|\:|\;|\"|\'|\<|\>|\,|\.|\?|\\|\/|\{|\}|\[|\]|-|\|| |\(|\)/g, "") + ']:checked').length == 0) {
            btDeError += "<span class='" + exportData[i].replace(/\&|\!|\~|\`|\@|\#|\$|\%|\^|\&|\*|\_|\+|\=|\:|\;|\"|\'|\<|\>|\,|\.|\?|\\|\/|\{|\}|\[|\]|-|\|| |\(|\)/g, "") + "-Error" + "'>" + exportData[i] + ' - ' + "Select atleast one buytype" + "\n" + "</span>"; 
        }
        else {
            btDeError += "";
        }
        if ($('input:checkbox[name=checks-demos-' + exportData[i].replace(/\&|\!|\~|\`|\@|\#|\$|\%|\^|\&|\*|\_|\+|\=|\:|\;|\"|\'|\<|\>|\,|\.|\?|\\|\/|\{|\}|\[|\]|-|\|| |\(|\)/g, "") + ']:checked').length == 0) {
            btDeError += "<span class='" + exportData[i].replace(/\&|\!|\~|\`|\@|\#|\$|\%|\^|\&|\*|\_|\+|\=|\:|\;|\"|\'|\<|\>|\,|\.|\?|\\|\/|\{|\}|\[|\]|-|\|| |\(|\)/g, "") + "-Error" + "'>" + exportData[i] + ' - ' + "Select atleast one demo" + "\n" + "</span>"; 
        }
        else {
            btDeError += "";
        }
        
        $('input:checkbox[name=checks-buytypes-' + exportData[i].replace(/\&|\!|\~|\`|\@|\#|\$|\%|\^|\&|\*|\_|\+|\=|\:|\;|\"|\'|\<|\>|\,|\.|\?|\\|\/|\{|\}|\[|\]|-|\|| |\(|\)/g, "") + ']:checked').each(function () {
            if ($(this).val() != prevBt) {

                bt += '~' + $(this).val();
            }
            prevBt = $(this).val();
        });
        $.ajax({
            url: '/ScheduleProposal/BuyTypeValidation',
            type: 'POST',
            async: false,
            data: {
                bt: bt
            },
            success: function (responseText) {
                if (responseText.responseText != "") {
                    rtError += "<span class='" + exportData[i].replace(/\&|\!|\~|\`|\@|\#|\$|\%|\^|\&|\*|\_|\+|\=|\:|\;|\"|\'|\<|\>|\,|\.|\?|\\|\/|\{|\}|\[|\]|-|\|| |\(|\)/g, "") + "-Error" + "'>" + exportData[i] + ' - ' + responseText.responseText + "\n" + "</span>";                    
                    hasAtleastOneBtError = true;
                }
                else {
                    rtError += "";
                }
            },
            error: function (response) {
                var notify = $.notify(response.responseText, {
                    type: 'danger',
                    allow_dismiss: true,
                });
            }
        });

        $.ajax({
            url: '/ScheduleProposal/CheckDealPoint',
            type: 'POST',
            async: false,
            data: {
                proposalId: _scheduleProposalId,
                bt: bt,
                networkName: exportData[i]
            },
            success: function (response) {
                if (response.responseText != "") {
                    rtInfo += "<span class='" + exportData[i].replace(/\&|\!|\~|\`|\@|\#|\$|\%|\^|\&|\*|\_|\+|\=|\:|\;|\"|\'|\<|\>|\,|\.|\?|\\|\/|\{|\}|\[|\]|-|\|| |\(|\)/g, "") + "-Info" + "'>" + exportData[i] + ' - ' + response.responseText + "\n" + "</span>";                    
                    hasAtleastOneDpInfo = true;
                }
                else {
                    rtInfo += "";
                }
            },
            error: function (response) {
                var notify = $.notify(response.responseText, {
                    type: 'danger',
                    allow_dismiss: true,
                });
            }
        });
        
        var demo = '';
        var prevDemo = '';
        $('input:checkbox[name=checks-demos-' + exportData[i].replace(/\&|\!|\~|\`|\@|\#|\$|\%|\^|\&|\*|\_|\+|\=|\:|\;|\"|\'|\<|\>|\,|\.|\?|\\|\/|\{|\}|\[|\]|-|\|| |\(|\)/g, "") + ']:checked').each(function () {
            if ($(this).val() != prevDemo) {
                demo += '~' + $(this).val();
            }
            prevDemo = $(this).val();
        });
        
        urls.push("/ScheduleProposal/ExportToExcel?proposalId=" + _scheduleProposalId + "&disc=" + $("#DiscountPrice").find(":selected").text().replace('%', '') + "&networkName=" + encodeURIComponent(exportData[i]) + "&de=" + encodeURIComponent(demo) + "&bt=" + encodeURIComponent(bt));

    }    
     
    if (rtError != "" && hasAtleastOneBtError == true || btDeError != "") {  
        $("#lblProcessExportErrors").show();
        $("#divProcessExportErrors").show();
        $("#processExportErrorDiv").html(rtError + btDeError);         
        $("#processExportInfoDiv").html(rtInfo);
              
        setTimeout(function () {
            HideOverlayMain();
            $('#btnProcessExportProposal').removeAttr('disabled');
            $('#btnProcessExportProposal').text("Export");
        }, 3000);        
        return;
    }
    else {       
        $("#processExportErrorDiv").html(""); 
        if (urls.length != 0) {
            downloadFiles(urls);                                  
        }   
        if (rtInfo != "" && hasAtleastOneDpInfo == true) {  
            $("#lblProcessExportErrors").show();
            $("#divProcessExportErrors").show();            
            $("#processExportInfoDiv").html(rtInfo);                       
        }
        if (urls.length == 1) {
            setTimeout(function () {
                HideOverlayMain();
                $('#btnProcessExportProposal').removeAttr('disabled');
                $('#btnProcessExportProposal').text("Export");
            }, 3000);
        }
        if (urls.length == 2) {
            setTimeout(function () {
                HideOverlayMain();
                $('#btnProcessExportProposal').removeAttr('disabled');
                $('#btnProcessExportProposal').text("Export");
            }, 6000);
        }
        if (urls.length == 3) {
            setTimeout(function () {
                HideOverlayMain();
                $('#btnProcessExportProposal').removeAttr('disabled');
                $('#btnProcessExportProposal').text("Export");
            }, 9000);
        }
        if (urls.length == 4) {
            setTimeout(function () {
                HideOverlayMain();
                $('#btnProcessExportProposal').removeAttr('disabled');
                $('#btnProcessExportProposal').text("Export");
            }, 12000);
        }
        if (urls.length == 5) {
            setTimeout(function () {
                HideOverlayMain();
                $('#btnProcessExportProposal').removeAttr('disabled');
                $('#btnProcessExportProposal').text("Export");
            }, 15000);
        }
        if (urls.length == 6) {
            setTimeout(function () {
                HideOverlayMain();
                $('#btnProcessExportProposal').removeAttr('disabled');
                $('#btnProcessExportProposal').text("Export");
            }, 18000);
        }
        if (urls.length == 7) {
            setTimeout(function () {
                HideOverlayMain();
                $('#btnProcessExportProposal').removeAttr('disabled');
                $('#btnProcessExportProposal').text("Export");
            }, 21000);
        }
        if (urls.length == 8) {
            setTimeout(function () {
                HideOverlayMain();
                $('#btnProcessExportProposal').removeAttr('disabled');
                $('#btnProcessExportProposal').text("Export");
            }, 24000);
        }
        if (urls.length == 9) {
            setTimeout(function () {
                HideOverlayMain();
                $('#btnProcessExportProposal').removeAttr('disabled');
                $('#btnProcessExportProposal').text("Export");
            }, 27000);
        }
        if (urls.length == 10) {
            setTimeout(function () {
                HideOverlayMain();
                $('#btnProcessExportProposal').removeAttr('disabled');
                $('#btnProcessExportProposal').text("Export");
            }, 30000);
        }        
    }
}

function downloadFile(url) {
    var iframe = document.createElement("iframe");
    iframe.src = url;
    iframe.style.display = "none";
    document.body.appendChild(iframe);
}

function downloadFiles(urls) {
    downloadFile(urls[0]);
    if (urls.length > 1)
        window.setTimeout(function () { downloadFiles(urls.slice(1)) }, 3000);
}


$(document).ready(function () {
    PopulateExportNetworks(_UniqueId);
    $('#btnProcessExportProposal').attr('disabled', 'disabled');
    $("#btnCancelProcessExportProposal, #btnCloseProcessExportProposal").click(function () {
        $("#divExportProposalBuyType").empty();
        $("#divExportProposalDemo").empty();
        $("#divExportProposalNetworks").empty();        
        $("#lblProcessExportErrors").hide();
        $("#divProcessExportErrors").hide();
        $("#processExportErrorDiv").empty();
        $("#processExportInfoDiv").empty();      
        exportData = [];
        countNetworks = 0;        
        $("#networkLimit").css({ 'color': '' });
        $("#ddlnetworks").css({ 'border-color': '' });
        $("#ddlnetworks").val("");
    });
});
