$(document).ready(function () {
    $("div#modal-add-network select").on("change", function () {
        var drpDwn = $(this);
        if (drpDwn.prop('selectedIndex') > 0)
            drpDwn.removeClass("is-invalid");
    });
    $('#btnSaveNewNetwork').on('click', function () {
        if (validateNetworkFields())
            SaveNewNetwork();
        else
            $("#errorMessage").text('Please select required fields.');
    });


    $('#modal-add-network').on('hidden.bs.modal', function () {
        ResetAddNetworkDialog();
    });

    $('#btnNetworkCancel').on('click', function () {
        ResetAddNetworkDialog();
    });
    $('body').on('click', '#btnAliasCreate', function () {
        CreateAlias();
    });

    $('#modal-add-alias').on('hidden.bs.modal', function () {
        $('#loading-ajax-image_btnAliasCreate').hide();
        $("#aliasSuccessMessage").text('');
        $('#txtAddAlias').empty();
        $('#txtAddAlias').val('');
        BeFormValidation.resetValidationMaterial();
    });
});

validateNetworkFields = function () {
    var isValid = true;
    if ($("#txtNetworkName").val() == '' || $("#txtNetworkName").val() == null || $("#txtNetworkName").val() == undefined) {
        isValid = false;
        $("#txtNetworkName").addClass("is-invalid");
    }

    $("div#modal-add-network select").each(function () {
        var drpDwn = $(this);
        if (drpDwn.prop('selectedIndex') <=0) {
            drpDwn.addClass("is-invalid");
            isValid = false;
        }
    });
    return isValid;
};
SaveNewNetwork = function () {
    $('#loading-ajax-image').show();
    $("#errorMessage").text('');
    $.ajax({
        url: urlNetworkSave,
        data: {
            NetworkName: $("#txtNetworkName").val(),
            MediaTypeId: $("#ddlAddNetworkMediaType").val(),
            FeedTypeId: $("#ddlAddNetworkFeedType").val(),
            CountryId: $("#ddlAddNetworkCountry").val()
        },
        cache: false,
        type: "POST",
        success: function (result) {
            if (result.success == true) {
                GetNetworks($("#ddlCountry").val(), result.responseCode);// Refresh the network listbox                
                ResetAddNetworkDialog();// Empty dialog
                //$("#errorMessage").text(result.responseText + " ( " + result.responseCode+" )");
                swal({
                    position: 'top-end',
                    type: 'success',
                    title: 'Success!',
                    text: result.responseText,
                    showConfirmButton: true,
                    timer: 5000
                });
            }
            else {
                //$("#errorMessage").text(result.responseText);
                swal({
                    position: 'top-end',
                    type: 'error',
                    title: 'Error!',
                    text: result.responseText,
                    timer: 5000
                })  

            }
            $('#loading-ajax-image').hide();
        },
        error: function (response) {
            $('#loading-ajax-image').hide();
            //swal('', response.responseText, 'error');
            swal({
                position: 'top-end',
                type: 'error',
                title: 'Error!',
                text: response.responseText,
                timer: 5000
            }) 
        }        
    });
    return false;
};

ResetAddNetworkDialog = function () {
    var optionIndex = 0;
    $("#txtNetworkName").val(''); 
    $("#txtNetworkName").removeClass('is-invalid');
    $("div#modal-add-network select").each(function () {
        var drpDwn = $(this);
        drpDwn.prop('selectedIndex', optionIndex);
        drpDwn.removeClass('is-invalid');
    });
    $("#errorMessage").text('');
};

/*  Netwrok Alias Codes Here...  */
CreateAlias = function () {    
    $("#aliasSuccessMessage").text('');
    var networkId = $("#ddlnetwork option:selected").val();
    //$('#modal-add-alias div.modal-footer').prepend('<img id="loading-ajax-image" src="~/img/loadingImg.gif" width="32" alt="Loading..."/>');
    BeFormValidation.resetValidationMaterial();
    if (!$('.js-validation-material').validate().element("#txtAddAlias"))
        return false;
    $('#loading-ajax-image_btnAliasCreate').show();
    $.ajax({
        url: urlCreateNetworkAlias,
        data: {
            NetworkId: networkId,
            AliasName: $("#txtAddAlias").val()
        },
        cache: false,
        type: "POST",
        success: function (result) {
            if (result.success == true) {
                GetAliases(networkId);
                document.getElementById("txtAddAlias").value = "";
                //$('#aliasSuccessMessage').text(result.responseText);
                swal({
                    position: 'top-end',
                    type: 'success',
                    title: 'Success!',
                    text: result.responseText,
                    showConfirmButton: true,
                    timer: 5000
                });
            } else {
                //swal('', result.responseText, 'error');
                swal({
                    position: 'top-end',
                    type: 'error',
                    title: 'Error!',
                    text: result.responseText,
                    timer: 5000
                })   

            }
            $('#loading-ajax-image_btnAliasCreate').hide();
        },
        error: function (response) {
            $('#loading-ajax-image_btnAliasCreate').hide();
            //swal('', response.responseText, 'error');    
            swal({
                position: 'top-end',
                type: 'error',
                title: 'Error!',
                text: response.responseText,
                timer: 5000
            })   
        }
    });
    return false;
};

