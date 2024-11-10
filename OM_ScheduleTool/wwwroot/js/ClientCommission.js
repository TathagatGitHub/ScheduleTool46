$(document).ready(function () {
    $("#ddlClientCommissionExport_Client").select2({
        placeholder: "Please select...",
        allowClear: true,
        width: "100%"
    });

    $("div#modal-ClientCommissionExport div.block-content select").on("change", function () {
        var drpDwn = $(this);
        if (drpDwn.prop('selectedIndex') > 0)
            drpDwn.removeClass("is-invalid");
        
    });

    $('#ddlClientCommissionExport_Client').on("change", function () {
        $('#ddlClientCommissionExport_Client').siblings(".select2-container").css('border', '0 solid red');
    });

    $('#modal-ClientCommissionExport').on('hidden.bs.modal', function () {
        $("div#modal-ClientCommissionExport div.block-content select").each(function () {
            var drpDwn = $(this);
            drpDwn.removeClass("is-invalid");
        });
        $('#ddlClientCommissionExport_Client').siblings(".select2-container").css('border', '0 solid red');
        $("#errorMessage").text('');
    });
    $("#ddlClientCommissionExport_Country").change(function () {
        if ($("#ddlClientCommissionExport_Country option:selected").val() == "") {
            alert("Please select Country");
            return false;
        }
        else {
            $.ajax({
                url: urlGetClientByCountryId,
                data: { countryid: $("#ddlClientCommissionExport_Country option:selected").val() },
                cache: false,
                type: "POST",
                success: function (result) {
                    $('#ddlClientCommissionExport_Client').empty();
                    $('#ddlClientCommissionExport_Client').append($('<option></option>').val(0).html('Please select...'));
                    $(result).each(function () {
                        var client = $(this)[0];
                        $('#ddlClientCommissionExport_Client').append($('<option></option>').val(client.value).html(client.text));
                    });
                },
                error: function (response) {
                    alert("error : " + response.responseText);
                }
            });
        }
    });

    $("#ddlClientCommissionExport_PlanYear").change(function () {
        if ($("#ddlClientCommissionExport_PlanYear option:selected").val() == "") {
            alert("Please select Plan Year");
            return false;
        }
        else {
            $.ajax({
                url: urlGetQuarters,
                data: { Year: $("#ddlClientCommissionExport_PlanYear option:selected").val() },
                cache: false,
                type: "POST",
                success: function (result) {
                    $('#ddlClientCommissionExport_Quarter').empty();
                    $('#ddlClientCommissionExport_Quarter').append($('<option></option>').val(0).html('Please select...'));
                    $(result).each(function () {
                        var quarter = $(this)[0];
                        $('#ddlClientCommissionExport_Quarter').append($('<option></option>').val(quarter.value).html(quarter.text));
                    });
                },
                error: function (response) {
                    alert("error : " + response.responseText);
                }
            });
        }

    });

    $("#btnClientCommissionExport").click(function () {
        $("#errorMessage").text('');
        if (!validateRequiredFields()) {
            $("#errorMessage").text('Please select required fields');
            return;
        }
        window.location.href = '/ClientCommission/ExportToExcel?CountryId=' + $("#ddlClientCommissionExport_Country option:selected").val() +
            '&ClientId=' + $("#ddlClientCommissionExport_Client option:selected").val() +
            '&PlanYear=' + $("#ddlClientCommissionExport_PlanYear option:selected").val() +
            '&QuarterId=' + $("#ddlClientCommissionExport_Quarter option:selected").val();
        return false;
    });
});

validateRequiredFields = function () {
    var isValid = true;
    $("div#modal-ClientCommissionExport select").each(function () {
        var drpDwn = $(this);
        if (drpDwn.prop('selectedIndex') <= 0) {
            var id = drpDwn.attr("id");
            if (id == 'ddlClientCommissionExport_Client')
                $('#ddlClientCommissionExport_Client').siblings(".select2-container").css('border', '1px solid red');
            else
                drpDwn.addClass("is-invalid");
            isValid = false;
        }
        
    });
    return isValid;
};
