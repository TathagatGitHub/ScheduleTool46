var arrayBuyTypegroup = [];
var _qtrName = "";
var _clId = "";
var _plYr = "";
var isBuyTypeSelected = false;
var isPlanNameEmpty = true;
var isBudgetFieldEmpty = false;
var _mediaPlanId = 0;
var initialLoad = false;
var selectedAction = "";
var mpTotalNetworks = 0;
var mpTotalDemos = 0;

function ValidateWithSlightDelay() {
    setTimeout(function () {
        ValidateBuyTypeGroup();
    }, 500);
}

function ValidateBuyTypeGroup() {
    var buyTypeGroups = "";
    var activeButtons = document.querySelectorAll('#mpBtnGroup button:not(.btnBTG)');
    if (activeButtons.length == 0) {
        isBuyTypeSelected = false;
    }
    if (activeButtons.length > 0) {
        activeButtons.forEach(function (el) {
            if ($(el).hasClass("btn-primary")) {
                if ($(el).text() != "All") {
                    buyTypeGroups += $(el).text().replace("Int.", "Integration") + ",";
                }
            }
        });
        var btgArr = (buyTypeGroups.slice(0, -1)).split(",");

        for (var i = 0; i < btgArr.length; i++) {
            var btgId = btgArr[i].replace(/ /g, "");
            var checkedCount = $('#mediaPlan' + btgId + 'Demos').find('input[type=checkbox]:checked').length;
            if (checkedCount == 0) {
                isBuyTypeSelected = false;
                break;
            }
            else {
                isBuyTypeSelected = true;
            }
        }
    }
    else {
        isBuyTypeSelected = false;
    }
    if (selectedAction == "update" && !initialLoad) {
        if ($("#txtMediaPlanBudget").val().length > 0) {
            isBudgetFieldEmpty = true;
        }
        else {
            isBudgetFieldEmpty = false;
        }
    }
    if (isPlanNameEmpty && isBudgetFieldEmpty && isBuyTypeSelected) {
        $("#btnSaveMediaPlanPopup").prop("disabled", false);
        $("#btnCreateMediaPlanPopup").prop("disabled", false);
        $("#btnUpdateMediaPlanPopup").prop("disabled", false);
    }
    else {
        $("#btnSaveMediaPlanPopup").prop("disabled", true);
        $("#btnCreateMediaPlanPopup").prop("disabled", true);
        $("#btnUpdateMediaPlanPopup").prop("disabled", true);
    }

}

function ToggleBTGroupSelection(selector, type) {

    var buttons = document.querySelectorAll('#mpBtnGroup button')
    if (type == 'all' && $("#btnAll").hasClass("btn-primary")) {
        buttons.forEach(function (el) {
            $(el).removeClass("btn-primary");
            $(el).addClass("btnBTG");
            $("#" + el.value + "NetDemosDD").toggle(false);
        });
        arrayBuyTypegroup = [];
    }
    else if (type == 'all' && $("#btnAll").hasClass("btnBTG")) {
        buttons.forEach(function (el) {
            $(el).removeClass("btnBTG");
            $(el).addClass("btn-primary");
            $("#" + el.value + "NetDemosDD").toggle(true);
            if (arrayBuyTypegroup.indexOf(el.value) == -1 && el.value != "all") {
                arrayBuyTypegroup.push(el.value);
            }
        });
    }
    else {
        $(selector).toggleClass("btn-primary btnBTG");
        if ($(selector).hasClass("btn-primary")) {
            $("#" + type + "NetDemosDD").toggle(true);
        }
        else {
            $("#" + type + "NetDemosDD").toggle(false);
        }

        if (arrayBuyTypegroup.indexOf(type) == -1) {
            arrayBuyTypegroup.push(type);
        }
        else {
            arrayBuyTypegroup.splice(arrayBuyTypegroup.indexOf(type), 1);
        }
    }
    if (arrayBuyTypegroup.length == buttons.length - 1 && arrayBuyTypegroup.length > 0) {
        $("#btnAll").removeClass("btnBTG");
        $("#btnAll").addClass("btn-primary");
    }
    else if (arrayBuyTypegroup.length < buttons.length - 1 && arrayBuyTypegroup.length > 0) {
        $("#btnAll").removeClass("btn-primary");
        $("#btnAll").addClass("btnBTG");
    }

    ValidateWithSlightDelay();

}

function ClearAll() {
    $("#txtMediaPlanName").val("");
    document.querySelectorAll('#mpBtnGroup button').forEach(function (el) {
        $(el).removeClass("btn-primary");
        $(el).addClass("btnBTG");
    });
    arrayBuyTypegroup = [];
}

$("#ancCreateMediaPlan").on("click", function () {
    selectedAction = "create/save";
    $("#btnSaveMediaPlanPopup").show();
    $("#btnCreateMediaPlanPopup").show();
    var clientName = $("#ddlclients :selected").text();
    var clientId = $("#ddlclients :selected").val();
    var planYr = $("#ddlplanyear :selected").val();
    var qtr = ($(".nav-link.active").html().split(' ')[0]).toString().substring(2, 1) + "Q" + $(".nav-link.active").html().split(' ')[1];
    _qtrName = qtr;
    _clId = clientId;
    _plYr = planYr;
    ClearAll();
    $("#txtMediaPlanName").val(clientName + " - " + qtr);
    GetNetworksForBTDropdowns(5);
    GetDemosBTDropdowns(5, clientId, qtr);
    setTimeout(function () {
        checkUncheckMultiSelectDropdown("mpCreate");
    }, 1500);
});

$("#mediaPlanUpfrontNetworks, #mediaPlanHighProfileNetworks, #mediaPlanScatterNetworks, #mediaPlanDRNetworks, #mediaPlanIntegrationNetworks").on("click", function (e) {
    if (selectedAction == "update") {
        $("#btnUpdateMediaPlanPopup").prop("disabled", false);
    }
});

function btnCloseMediaPlanPopup() {
    window.location.reload();
}

function GetNetworksForBTDropdowns(_countryid) {

    var url = "/ManageMedia/GetNetworkByCountryId/";

    $.ajax({
        url: url,
        data: { countryid: _countryid },
        cache: false,
        type: "POST",
        success: function (result) {
            mpTotalNetworks = result.length;
            var markup = "";
            markup = '<label class="dropdown-option"><input type="checkbox" class="btg-inputs" data-toggle="check-all" name="dropdown-group" value="" /><div style="margin-top: -24px;margin-left: 18px;"> Select All</div></label>'
            for (var x = 0; x < result.length; x++) {
                markup += '<label class="dropdown-option"><input type="checkbox" class="btg-inputs" data-toggle="check-all" name="dropdown-group" value=' + result[x].value + ' />' + '<div style="margin-top: -24px;margin-left: 18px;"> ' + result[x].text + '</div></label>'
            }
            $("#mediaPlanUpfrontNetworks").html(markup).show();
            $("#mediaPlanHighProfileNetworks").html(markup).show();
            $("#mediaPlanScatterNetworks").html(markup).show();
            $("#mediaPlanDRNetworks").html(markup).show();
            $("#mediaPlanIntegrationNetworks").html(markup).show();
        },
        error: function (response) {
            swal("error : " + response.responseText);
        }
    });

}

function GetDemosBTDropdowns(_countryid, clientid, quartername) {

    var url = "/ManageMedia/GetDemoByClientQuarter/";
    var _clientid = clientid;
    var _quartername = quartername;
    $.ajax({
        url: url,
        data: {
            countryid: _countryid,
            quartername: _quartername,
            clientid: _clientid
        },
        cache: false,
        type: "POST",
        success: function (result) {
            mpTotalDemos = result.length;
            var markup = "";
            markup = '<label class="dropdown-option"><input type="checkbox" class="btg-inputs" data-toggle="check-all" name="dropdown-group" onclick="ValidateWithSlightDelay();" value="" /><div style="margin-top: -24px;margin-left: 18px;"> Select All</div></label>'
            for (var x = 0; x < result.length; x++) {
                if (result[x].value == 2) {
                    markup += '<label class="dropdown-option"><input type="checkbox" class="btg-inputs" data-toggle="check-all" name="dropdown-group" checked onclick="ValidateWithSlightDelay();" value=' + result[x].value + ' />' + '<div style="margin-top: -24px;margin-left: 18px;"> ' + result[x].text + '</div></label>'
                }
                else {
                    markup += '<label class="dropdown-option"><input type="checkbox" class="btg-inputs" data-toggle="check-all" name="dropdown-group" onclick="ValidateWithSlightDelay();" value=' + result[x].value + ' />' + '<div style="margin-top: -24px;margin-left: 18px;"> ' + result[x].text + '</div></label>'
                }
            }
            $("#mediaPlanUpfrontDemos").html(markup).show();
            $("#mediaPlanHighProfileDemos").html(markup).show();
            $("#mediaPlanScatterDemos").html(markup).show();
            $("#mediaPlanDRDemos").html(markup).show();
            $("#mediaPlanIntegrationDemos").html(markup).show();
        },
        error: function (response) {
            swal("error : " + response.responseText);
        }
    });

}

function checkUncheckMultiSelectDropdown(calledFrom) {

    var CheckboxDropdown = function (el) {
        var _this = this;
        this.isOpen = false;
        this.areAllChecked = false;
        this.$el = $(el);
        this.$label = this.$el.find('.dropdown-label');
        this.$checkAll = this.$el.find('[data-toggle="check-all"]').first();
        this.$inputs = this.$el.find('[type="checkbox"]');

        this.onCheckBox();

        this.$label.unbind().on('click', function (e) {
            e.preventDefault();
            _this.toggleOpen();
        });

        this.$checkAll.on('click', function (e) {
            _this.onCheckAll();
        });

        this.$inputs.on('change', function (e) {
            _this.onCheckBox();
        });
    };

    CheckboxDropdown.prototype.onCheckBox = function () {
        this.updateStatus();
    };

    CheckboxDropdown.prototype.updateStatus = function () {
        var checked = this.$el.find(':checked');
        var isSelectAllChecked = $(this.$checkAll).is(':checked');
        this.areAllChecked = false;
        if (checked.length <= 0) {
            this.$label.html('Select');
            this.$label.css("color", "#575757");
        }
        else if (checked.length === 1) {
            if (calledFrom == "mpLongPlan") {
                var HTML = checked.parent('label').text();
                HTML = HTML.split("|");
                HTML = HTML[0] + "&nbsp &nbsp &nbsp &nbsp|&nbsp &nbsp &nbsp &nbsp" + HTML[1] + "&nbsp &nbsp &nbsp|&nbsp &nbsp &nbsp" + HTML[2] + "&nbsp &nbsp &nbsp|&nbsp &nbsp &nbsp" + HTML[3] + "&nbsp &nbsp &nbsp|&nbsp &nbsp &nbsp" + HTML[4] + "&nbsp &nbsp &nbsp|&nbsp &nbsp &nbsp" + HTML[5] + "&nbsp &nbsp &nbsp|&nbsp &nbsp &nbsp" + HTML[6] + "&nbsp &nbsp &nbsp|&nbsp &nbsp &nbsp" + HTML[7];
                this.$label.html(HTML);
            }
            else {
                this.$label.html(checked.parent('label').text());
                if (calledFrom == "addNewProp") {
                    var finalChecked = this.$el.find(':checked');
                    var allEnabled = this.$el.find(':enabled');
                    if (finalChecked.length != allEnabled.length) {
                        this.$label.css("color", "#2971B9");
                    }
                    else {
                        this.$label.css("color", "#575757");
                    }
                }
            }
        }
        else if (checked.length === this.$inputs.length - 1) {
            if (isSelectAllChecked) {
                this.$checkAll.prop('checked', false);
                var finalChecked = this.$el.find(':checked');
                if (calledFrom == "addNewProp") {
                    var text = "";
                    finalChecked.each(function () {
                        text += $(this).parent('label').text();
                    });
                    this.$label.html(text);
                    var allEnabled = this.$el.find(':enabled');
                    if (finalChecked.length != allEnabled.length) {
                        this.$label.css("color", "#2971B9");
                    }
                    else {
                        this.$label.css("color", "#575757");
                    }
                }
                else {
                    this.$label.html(finalChecked.length + ' Selected');
                }
            }
            else {
                if (calledFrom == "addNewProp") {
                    var allChecked = this.$el.find(':checked');
                    var text = "";
                    allChecked.each(function () {
                        if ($(this).parent('label').text() != " All") {
                            text += $(this).parent('label').text();
                        }
                    });
                    this.$label.html(text);
                    var allEnabled = this.$el.find(':enabled');
                    if (allChecked.length != allEnabled.length && allChecked.length < 7) {
                        this.$label.css("color", "#2971B9");
                    }
                    else {
                        this.$label.css("color", "#575757");
                    }
                }
                else {
                    this.$label.html('Select All');
                }
                this.areAllChecked = true;
                this.$checkAll.prop('checked', true);
            }
        }
        else if (checked.length === this.$inputs.length) {
            if (calledFrom == "addNewProp") {
                var allChecked = this.$el.find(':checked');
                var text = "";
                allChecked.each(function () {
                    if ($(this).parent('label').text() != " All") {
                        text += $(this).parent('label').text();
                    }
                });
                this.$label.html(text);
                var allEnabled = this.$el.find(':enabled');
                if (allChecked.length != allEnabled.length) {
                    this.$label.css("color", "#2971B9");
                }
                else {
                    this.$label.css("color", "#575757");
                }
            }
            else {
                this.$label.html('Select All');
            }
            this.areAllChecked = true;
            this.$checkAll.prop('checked', true);
        }
        else if (checked.length < this.$inputs.length - 1) {
            this.$checkAll.prop('checked', false);
            var finalChecked = this.$el.find(':checked');
            if (calledFrom == "addNewProp") {
                var text = "";
                finalChecked.each(function () {
                    text += $(this).parent('label').text();
                });
                this.$label.html(text);
                var allEnabled = this.$el.find(':enabled');
                if (finalChecked.length != allEnabled.length) {
                    this.$label.css("color", "#2971B9");
                }
                else {
                    this.$label.css("color", "#575757");
                }
            }
            else {
                this.$label.html(finalChecked.length + ' Selected');
            }
        }
    };

    CheckboxDropdown.prototype.onCheckAll = function (checkAll) {
        if (!this.areAllChecked || checkAll) {
            this.areAllChecked = true;
            this.$checkAll.prop('checked', true);
            this.$inputs.prop('checked', true);
        }
        else {
            this.areAllChecked = false;
            this.$checkAll.prop('checked', false);
            this.$inputs.prop('checked', false);
        }

        this.updateStatus();
    };
    var _prevElement = null;
    CheckboxDropdown.prototype.toggleOpen = function (forceOpen) {
        if (_prevElement != this && _prevElement != null) {
            _prevElement.$el.removeClass('on');
        }
        this.$el.toggleClass('on');
        //var _this = this;
        //if (_prevElement == _this) {
        //    //if (this.$el.hasClass('on')) {
        //    //    this.$el.toggleClass('on');
        //    //}
        //    //else {
        //    //    this.$el.addClass('on');
        //    //}
        //    this.$el.toggleClass('on');
        //    return;
        //}
        //if (_prevElement != null && _prevElement.isOpen) {
        //    _prevElement.isOpen = false;
        //    _prevElement.$el.removeClass('on');
        //}

        //if (!this.isOpen || forceOpen) {
        //    this.isOpen = true;
        //    this.$el.addClass('on');
        //}
        //else {
        //    this.isOpen = false;
        //    this.$el.removeClass('on');
        //    $(document).off('click');
        //}
        _prevElement = this;
    };

    var checkboxesDropdowns = document.querySelectorAll('[data-control="checkbox-dropdown"]');
    for (var i = 0, length = checkboxesDropdowns.length; i < length; i++) {
        new CheckboxDropdown(checkboxesDropdowns[i]);
    }
}

$(document).on('click', function (e) {
    var className = ["dropdown-list", "dropdown-label", "dropdown-option", "btg-inputs"];
    var e = $(e.target);
    if (className.indexOf(e[0].className) == -1) {
        var el = $("#MediaPlanModal, #mpLongPlanNetworkModal, #modal_AddCustomizeProperty").find('.on');
        if (el != undefined || el != null || el.length > 0) {
            el.removeClass("on");
        }
    }
});

function createEditMediaPlan(action) {

    var url = "/MediaPlan/CreateEditMediaPlan/";
    var _mediaPlanName = $("#txtMediaPlanName").val();
    var _budgetPeriod = $("#ddlMediaPlanBudgetPeriod :selected").val();
    var _mediaPlanBudget = $("#txtMediaPlanBudget").val();
    var _percentage = $("#txtMediaPlanPercentage").val();
    var _clientid = _clId;
    var _quartername = _qtrName;
    var _planYear = _plYr;
    var _buyTypeGroups = "";
    var _mediaPlanNetworks = [];
    var _mediaPlanDemos = [];
    var BTGButtons = document.querySelectorAll('#mpBtnGroup button:not(.btnBTG)');
    BTGButtons.forEach(function (el) {
        if ($(el).hasClass("btn-primary")) {
            if ($(el).text() != "All") {
                _buyTypeGroups += $(el).text().replace("Int.", "Integration") + ",";
            }
        }
    });
    var btgGroupsArr = _buyTypeGroups.split(",");

    for (var i = 0; i < btgGroupsArr.length; i++) {
        var btgId = btgGroupsArr[i].replace(/ /g, "");
        $('#mediaPlan' + btgId + 'Networks input:checked').each(function (index) {
            var val = $(this).attr('value');
            if (val != "") {
                _mediaPlanNetworks.push({ "BuyTypeGroup": btgGroupsArr[i], "MediaPlanId": 0, "NetDemoId": val });
            }
        });
    }

    for (var i = 0; i < btgGroupsArr.length; i++) {
        var btgId = btgGroupsArr[i].replace(/ /g, "");
        $('#mediaPlan' + btgId + 'Demos input:checked').each(function () {
            var val = $(this).attr('value');
            if (val != "") {
                _mediaPlanDemos.push({ "BuyTypeGroup": btgGroupsArr[i], "MediaPlanId": 0, "NetDemoId": val });
            }
        });
    }

    $.ajax({
        url: url,
        data: {
            MediaPlanName: _mediaPlanName,
            BudgetPeriod: _budgetPeriod,
            GrossBudget: _mediaPlanBudget.replace(/\$|\,/g, ""),
            Percentage: _percentage,
            ClientId: _clientid,
            PlanYear: _planYear,
            QuarterName: _quartername,
            BTGDemos: JSON.stringify(_mediaPlanDemos),
            BTGNetworks: JSON.stringify(_mediaPlanNetworks),
            Action: action,
            MediaPlanId: _mediaPlanId
        },
        cache: false,
        type: "POST",
        success: function (result) {
            if (result.responseCode < 0 && result.success == false) {
                swal({
                    html: result.responseText,
                    type: 'warning',
                })
            }
            else {
                // ST-914 Added Check to Open the Sumary Page After the media Plan is created using Created Button (Shariq-2024-01-23)
                if (action == "save" || action == "update") {
                    setTimeout(function () {
                        btnCloseMediaPlanPopup();
                    }, 2000);
                }
                else {
                    setTimeout(function () {
                        window.location.href = "/MediaPlan/Summary?MediaPlanId=" + result.responseCode;// ST-914 Code to redirect to Sumary page after the Media Plan is created using create button. (Shariq-2024-01-23) 
                    }, 1000);
                }
            }
        },
        error: function (response) {
            swal("error : " + response.responseText);
        }
    });
}

$("#txtMediaPlanName").keyup(function () {
    if ($(this).val().length > 0) {
        isPlanNameEmpty = true;
    }
    else {
        isPlanNameEmpty = false;
    }
    initialLoad = false;
    ValidateWithSlightDelay();
});


$("#txtMediaPlanBudget").keyup(function () {
    if ($(this).val().replace(/\$|\,/g, "").length > 0) {
        isBudgetFieldEmpty = true;
    }
    else {
        isBudgetFieldEmpty = false;
    }
    initialLoad = false;
    ValidateWithSlightDelay();
});


$("#ddlMediaPlanBudgetPeriod").on("change", function () {
    initialLoad = false;
    ValidateWithSlightDelay();
});

$("#txtMediaPlanBudget").keyup(function () {
    var val = $(this).val();
    val = val.replace(/\$|\,/g, "");
    val = val.toString().substring(0, 10);
    var formattedVal = (Number(val)).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    formattedVal = formattedVal.slice(0, -3);
    if (formattedVal.length > 14) {

        $(this).val(formattedVal.toString().substring(0, 14));
    }
    else {
        if (formattedVal == "$0") {
            $(this).val("$");
        }
        else {
            $(this).val(formattedVal);
        }
    }
});

function isInt(n) {
    return n != "" && !isNaN(n) && Math.round(n) == n;
}

function isFloat(n) {
    return n != "" && !isNaN(n) && Math.round(n) != n;
}


$("#txtMediaPlanPercentage").keyup(function (e) {
    if (selectedAction == "update" && $("#txtMediaPlanBudget").val().replace(/\$|\,/g, "").length > 0 && $("#txtMediaPlanName").val().length > 0) {
        $("#btnUpdateMediaPlanPopup").prop("disabled", false);
    }
});

$("#txtMediaPlanCommissionRate").change(function (e) {

    var val = $(this).val();
    val = val.toString().replace(/\%/g, "");
    if ((isInt(val) && val > 0) || (isFloat(val) && val > 0)) {
        if (val.indexOf(".") != -1) {
            val = parseFloat(val, 10).toFixed(2);
        }
        if (val > 100) {
            $(this).val(100 + "%");
        }
        else {
            $(this).val(val + "%");
        }
    }
    else {
        $(this).val("");
    }
});

$("#txtMediaPlanPercentage").keyup(function () {
    var val = $(this).val();
    if (isInt(val) && val > 0) {
        if (val.indexOf(".") != -1) {
            val = Math.trunc($(this).val());
        }
        if (val > 100) {
            $(this).val(100);
        }
        else {
            $(this).val(val);
        }
    }
    else {
        $(this).val("");
    }
});


function EditMediaPlan() {
    //$("#mpCreateEditModal").hide();
    $("#MediaPlanModal").modal('hide');
    document.getElementById("DivOverLayMediaSummary").style.display = "block";
    selectedAction = "update";
    $("#btnSaveMediaPlanPopup").hide();
    $("#btnUpdateMediaPlanPopup").show();
    var MediaPlanId = GetParameterValues("MediaPlanId");
    _mediaPlanId = Number(MediaPlanId);
    var url = "/MediaPlan/GetMediaPlanForEdit/";
    $.ajax({
        url: url,
        data: {
            MediaPlanId: MediaPlanId
        },
        cache: false,
        type: "GET",
        success: function (result) {
            if (result.responseCode < 0 && result.success == false) {
                swal({
                    html: result.responseText,
                    type: 'warning',
                })
            }
            else {
                _qtrName = result.responseData.mediaPlan.quarterName;
                _clId = result.responseData.mediaPlan.clientId;
                _plYr = result.responseData.mediaPlan.planYear;
                GetNetworksForBTDropdowns(5);
                GetDemosBTDropdowns(5, result.responseData.mediaPlan.clientId, result.responseData.mediaPlan.quarterName);
                setTimeout(function () {
                    checkUncheckMultiSelectDropdown("mpEdit");
                }, 1500);
                $("#CreateMediaPlanHeading").html("Edit Media Plan");
                $("#txtMediaPlanName").val(result.responseData.mediaPlan.mediaPlanName);
                $("#ddlMediaPlanBudgetPeriod").val(result.responseData.mediaPlan.budgetPeriod)
                $("#txtMediaPlanPercentage").val(result.responseData.mediaPlan.percentage);
                var formattedVal = (Number(result.responseData.mediaPlan.grossBudget)).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                });
                $("#txtMediaPlanBudget").val(formattedVal);

                var buytypeGroupsNetworks = result.responseData.mediaPlanNetwork;
                var buytypeGroupsDemos = result.responseData.mediaPlanDemos;
                const uniqueDemoBTG = [...new Set(buytypeGroupsDemos.map((item) => item.buyTypeGroup))];
                setTimeout(function () {
                    for (var i = 0; i < buytypeGroupsNetworks.length; i++) {
                        $('#mediaPlan' + buytypeGroupsNetworks[i].buyTypeGroup.replace(/ /g, "") + 'Networks input[type=checkbox][value=' + buytypeGroupsNetworks[i].networkId + ']').prop("checked", true);
                        initialLoad = true;
                    }
                    for (var i = 0; i < uniqueDemoBTG.length; i++) {
                        $('#mediaPlan' + uniqueDemoBTG[i].replace(/ /g, "") + 'Demos input[type=checkbox][value=2]').prop("checked", false);
                        ToggleBTGroupSelection($("#btn" + uniqueDemoBTG[i].replace(/ /g, "")), uniqueDemoBTG[i].replace(/ /g, "").toLowerCase());
                        initialLoad = true;
                    }
                    for (var i = 0; i < buytypeGroupsDemos.length; i++) {
                        $('#mediaPlan' + buytypeGroupsDemos[i].buyTypeGroup.replace(/ /g, "") + 'Demos input[type=checkbox][value=' + buytypeGroupsDemos[i].demoId + ']').prop("checked", true);
                        initialLoad = true;

                    }

                }, 1000);

                setTimeout(function () {
                    if (mpTotalNetworks == $('#mediaPlanUpfrontNetworks input[type=checkbox]:checked').length) {
                        $('#mediaPlanUpfrontNetworks input[type=checkbox]').not(':checked').click();
                    }
                    if (mpTotalNetworks == $('#mediaPlanHighProfileNetworks input[type=checkbox]:checked').length) {
                        $('#mediaPlanHighProfileNetworks input[type=checkbox]').not(':checked').click();
                    }
                    if (mpTotalNetworks == $('#mediaPlanScatterNetworks input[type=checkbox]:checked').length) {
                        $('#mediaPlanScatterNetworks input[type=checkbox]').not(':checked').click();
                    }
                    if (mpTotalNetworks == $('#mediaPlanDRNetworks input[type=checkbox]:checked').length) {
                        $('#mediaPlanDRNetworks input[type=checkbox]').not(':checked').click();
                    }
                    if (mpTotalNetworks == $('#mediaPlanIntegrationNetworks input[type=checkbox]:checked').length) {
                        $('#mediaPlanIntegrationNetworks input[type=checkbox]').not(':checked').click();
                    }

                    if (mpTotalDemos == $('#mediaPlanUpfrontDemos input[type=checkbox]:checked').length) {
                        $('#mediaPlanUpfrontDemos input[type=checkbox]').not(':checked').click();
                    }
                    if (mpTotalDemos == $('#mediaPlanHighProfileDemos input[type=checkbox]:checked').length) {
                        $('#mediaPlanHighProfileDemos input[type=checkbox]').not(':checked').click();
                    }
                    if (mpTotalDemos == $('#mediaPlanScatterDemos input[type=checkbox]:checked').length) {
                        $('#mediaPlanScatterDemos input[type=checkbox]').not(':checked').click();
                    }
                    if (mpTotalDemos == $('#mediaPlanDRDemos input[type=checkbox]:checked').length) {
                        $('#mediaPlanDRDemos input[type=checkbox]').not(':checked').click();
                    }
                    if (mpTotalDemos == $('#mediaPlanIntegrationDemos input[type=checkbox]:checked').length) {
                        $('#mediaPlanIntegrationDemos input[type=checkbox]').not(':checked').click();
                    }

                    //$("#mpCreateEditModal").show();
                    $('#MediaPlanModal').modal({ backdrop: 'static', keyboard: false }, 'show');
                    //$('#mpCreateEditModal').modal({ backdrop: 'static', keyboard: false }, 'show');
                    document.getElementById("DivOverLayMediaSummary").style.display = "none";
                    $("#btnUpdateMediaPlanPopup").prop("disabled", true);
                }, 2000);
                setTimeout(function () {
                    initialLoad = false;
                }, 4000);

            }
        },
        error: function (response) {
            swal("error : " + response.responseText);
        }
    });
}

$(document).ready(function () {
    $("#btnSaveMediaPlanPopup").prop("disabled", true);
    $("#btnCreateMediaPlanPopup").prop("disabled", true);
    $("#btnUpdateMediaPlanPopup").prop("disabled", true);
    $('.modal.draggable>.modal-dialog').draggable({
        cursor: 'move',
        handle: '.modal-header'
    });
    $('.modal.draggable>.modal-dialog>.modal-content>.modal-header').css('cursor', 'move');
});
