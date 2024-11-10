var mediaPlanLst = [];
var lastQuarterSelected = "";
$(document).ready(function () {    
    
    $("#ddlCopyMediaPlanYear").val($("#ddlplanyear").val());
    $("#ddlCopyMediaPlanName").val("");
    $("#ddlCopyMediaPlanName").prop("disabled", true);
    $("#btnMediaPlanCopy").prop("disabled", true);
    var $buttons = $('#cmpBtnGroup button'); 
    $buttons.each(function () {        
        $(this).removeClass("btn-primary").addClass("btnBTG");      
    });
});
$(document).on("click", function (e) {
    if (e.target.id == "btnCopyMediaPlanModal" || e.target.className == "fa fa-angle-down") {
        $(".mpCopy-DropdownContent").toggle();
    }
    else {
        $(".mpCopy-DropdownContent").hide();
    }
});

function GetMediaPlansData() {
    $.ajax({
        url: '/MediaPlan/GetAllMediaPlans',
        type: 'GET',       
        success: function (responseData) {
            mediaPlanLst = responseData.mediaPlans;
            var years = responseData.mediaPlans.map(function (item) { return item.planYear; })
                .filter(function (value, index, self) { return self.indexOf(value) === index; })
                .sort(function (a, b) {
                    return a - b;
                });
            var $ddlCopyMediaPlanYear = $('#ddlCopyMediaPlanYear');
            $ddlCopyMediaPlanYear.empty();             
            $.each(years, function (index, year) {
                $ddlCopyMediaPlanYear.append($('<option></option>').val(year).html(year));
            });
            var defaultYear = $("#ddlplanyear").val();
            if (years.indexOf(parseInt(defaultYear, 10)) !== -1) {
                $("#ddlCopyMediaPlanYear").val(defaultYear);
            } else if (years.length > 0) {               
                $("#ddlCopyMediaPlanYear").val(years[0]);
            }  
            lastQuarterSelected = responseData.lastQuarterSelected;
        },
        error: function (xhr, status, error) {
            
            swal("Error!", "Failed to load data: " + error, "error");
        }
    });
}

function GetFilteredMediaPlanData() {    
    var year = parseInt($("#ddlCopyMediaPlanYear").val(), 10);
    $("#btncmpQ1").text("1Q" + year).val("1Q" + year);
    $("#btncmpQ2").text("2Q" + year).val("2Q" + year);
    $("#btncmpQ3").text("3Q" + year).val("3Q" + year);
    $("#btncmpQ4").text("4Q" + (year - 1)).val("4Q" + (year - 1)); 

    var selectedQuarterButton = $('#cmpBtnGroup button.btn-primary');
    var isFourthQuarter = selectedQuarterButton.val().startsWith("4Q");
    var quarterSuffix = selectedQuarterButton.length > 0 ? selectedQuarterButton.val().replace(isFourthQuarter ? (year - 1).toString() : year.toString(), '') : '';
    var broadcastQuarterNbr = quarterSuffix === "4Q" ? 1 : quarterSuffix === "1Q" ? 2 : quarterSuffix === "2Q" ? 3 : quarterSuffix === "3Q" ? 4 : 0;
    var adjustedYear = quarterSuffix === "4Q" ? year - 1 : year;
    var quarter = quarterSuffix + adjustedYear;
    var clientId = $("#ddlclients").val();
    var filteredMediaPlans = mediaPlanLst.filter(function (item) {
        return item.planYear === parseInt(year) && item.quarterName === quarter && item.broadcastQuarterNbr === broadcastQuarterNbr.toString() && item.clientId === parseInt(clientId);
    });
    var mediaPlanOptions = filteredMediaPlans.map(function (item) {
        return { id: item.mediaPlanId, name: item.mediaPlanName };
    })        
        .filter(function (value, index, self) {
            return self.findIndex(function (item) { return item.id === value.id; }) === index;
        });

    var $ddlCopyMediaPlanName = $('#ddlCopyMediaPlanName');
    $ddlCopyMediaPlanName.empty();

    if (mediaPlanOptions.length == 0 && quarterSuffix != '') {
        $ddlCopyMediaPlanName.append($('<option></option>').val("").html("No results found."));
        $("#btnMediaPlanCopy").prop("disabled", true);
    } else {
        $.each(mediaPlanOptions, function (index, option) {
            $ddlCopyMediaPlanName.append($('<option></option>').val(option.id).html(option.name));
            $("#btnMediaPlanCopy").prop("disabled", false);
        });
    }     
}
function OpenCopyMediaPlanModal() {
    var planYear = $("#ddlplanyear").val();
    $("#ddlCopyMediaPlanYear").val(planYear);   
    $("#btncmpQ1").text("1Q" + planYear).val("1Q" + planYear);
    $("#btncmpQ2").text("2Q" + planYear).val("2Q" + planYear);
    $("#btncmpQ3").text("3Q" + planYear).val("3Q" + planYear);
    $("#btncmpQ4").text("4Q" + (planYear - 1)).val("4Q" + (planYear - 1)); 
    $("#ddlCopyMediaPlanName").val("").prop("disabled", true);
    $("#btnMediaPlanCopy").prop("disabled", true);
    $('#cmpBtnGroup button').removeClass("btn-primary").addClass("btnBTG");
    GetMediaPlansData();    
    $("#CopyMediaPlanModal").modal("show");
    setTimeout(function () {
        var mediaPlanSelectedQuarter = lastQuarterSelected;

        $("#Q1, #Q2, #Q3, #Q4").removeClass("active");

        var quarterMap = { "1": "#Q4", "2": "#Q1", "3": "#Q2", "4": "#Q3" };
        var selectedButtonId = quarterMap[mediaPlanSelectedQuarter];
        if (selectedButtonId) {
            $(selectedButtonId).addClass("active");
        }
    }, 400);    
}

function CancelCopyMediaPlanPopUp() {    
    $("#CopyMediaPlanModal").modal("hide");    
    var planYear = $("#ddlplanyear").val();
    $("#ddlCopyMediaPlanYear").val(planYear);
    $("#ddlCopyMediaPlanName").val("").prop("disabled", true);    
    $("#btnMediaPlanCopy").prop("disabled", true);    
    $('#cmpBtnGroup button').removeClass("btn-primary").addClass("btnBTG");
}

function ToggleQuarterSelection(selector) {    
    var $selector = $(selector);
    var $buttons = $('#cmpBtnGroup button');
    var $ddlCopyMediaPlanName = $("#ddlCopyMediaPlanName");
    var $btnMediaPlanCopy = $("#btnMediaPlanCopy");
    
    $buttons.each(function () {
        if ($(this).is($selector)) {
            $(this).toggleClass("btnBTG btn-primary");
        } else {
            $(this).removeClass("btn-primary").addClass("btnBTG");
        }
    });
    
    var isPrimary = $selector.hasClass("btn-primary");
    $ddlCopyMediaPlanName.prop("disabled", !isPrimary);
    $btnMediaPlanCopy.prop("disabled", !isPrimary);

    GetFilteredMediaPlanData();
}

function CopyMediaPlanFromYrQtr() {
    var year = parseInt($("#ddlplanyear").val(), 10);    
    var mediaPlanSelectedQuarter = lastQuarterSelected;
    var quarterMap = { "1": ("4Q" + (year - 1)), "2": ("1Q"+ year), "3": ("2Q"+ year), "4": ("3Q"+ year) };
    var selectedQuarter = quarterMap[mediaPlanSelectedQuarter];   
    
    $.ajax({
        url: "/MediaPlan/CopyMediaPlanFromYrAndQtr/",
        data: {
            mediaPlanid: $('#ddlCopyMediaPlanName').val(),
            clientid: $("#ddlclients").val(),
            qtrName: selectedQuarter,
            Year: $("#ddlplanyear").val()
        },
        cache: false,
        type: "GET",
        success: function (result) {          
    
            if (result != null && result != undefined && result.success) {
                window.location.reload();               
            }
        },
        error: function (response) {
            swal('Wait ...', response, 'error');
        }
    });
}
