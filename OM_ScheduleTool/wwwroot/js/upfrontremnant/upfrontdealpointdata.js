$(document).ready(function () {
    $('#btnSaveUpfrontDeal').click(function () {
        // Save the cancellation policies
        SaveUpfrontDeal(
            $('#btnUpdateDealPointData').attr('NetworkId'),
            $('#btnUpdateDealPointData').attr('PlanYr'),
            'UP',
            $('#txtBillboardAddedValue').val(),
            $('#txtUpfrontSponsorship').val(),
            $('#txtUpfrontCancellation').val(),
            $('#txtScatterCancellation').val(),
            $('#txtNetworkSeparation').val()
        );
    });

    $('#btnUpdateDealPointData').click(function () {
        var Country = $(this).attr('Country');
        var NetworkName = $(this).attr('NetworkName');
        var NetworkId = $(this).attr('NetworkId');
        var PlanYear = $(this).attr('PlanYr');
        if (Country == 'CA') {
            swal({
                text: 'Select your media type to DEAL POINT edits:',
                type: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                input: 'radio',
                inputOptions: {
                    'National Upfront/Scatter': 'National Upfront/Scatter',
                    'DR': 'DR',
                },

                // validator is optional
                inputValidator: function (result) {
                    return new Promise(function (resolve, reject) {
                        if (result) {
                            resolve();
                        } else {
                            reject('You need to select something!');
                        }
                    });
                }
            }).then(function (result) {
                if (result) {
                    if (result == 'National Upfront/Scatter') {
                        // Launch the Deal
                        var FineLine3 = 'Not withstanding anything herein or elsewhere contained to the company, ';
                        FineLine3 = FineLine3 + '<strong>' + NetworkName + '</strong>';
                        FineLine3 = FineLine3 + ' acknowledges that Ocean Media is an agent for a disclosed principal and, accordingly, has no liability to ';
                        FineLine3 = FineLine3 + '<strong>' + NetworkName + '</strong>';
                        FineLine3 = FineLine3 + ' unless and until said principal has paid Ocean Media. ';

                        LoadUpfrontDeal(NetworkId, PlanYear, 'UP');

                        $('#lblFineLine3').html(FineLine3);
                        $('#modal-upfrontdeal').modal();
                    }
                    else {
                        // Launch the Deal
                        var FineLineCA = 'Not withstanding anything herein or elsewhere contained to the company, ';
                        FineLineCA = FineLineCA + '<strong>' + NetworkName + '</strong>';
                        FineLineCA = FineLineCA + ' acknowledges that Ocean Media is an agent for a disclosed principal and, accordingly, has no liability to ';
                        FineLineCA = FineLineCA + '<strong>' + NetworkName + '</strong>';
                        FineLineCA = FineLineCA + ' unless and until said principal has paid Ocean Media. ';

                        LoadUpfrontDealCA(NetworkId, PlanYear, 'DR');

                        $('#lblFineLineCA').html(FineLineCA);
                        $('#modal-upfrontdealca').modal();

                    }
                }
            })
        }
        else {
            // Launch the Deal
            var FineLine3 = 'Not withstanding anything herein or elsewhere contained to the company, ';
            FineLine3 = FineLine3 + '<strong>' + $(this).attr('NetworkName') + '</strong>';
            FineLine3 = FineLine3 + ' acknowledges that Ocean Media is an agent for a disclosed principal and, accordingly, has no liability to ';
            FineLine3 = FineLine3 + '<strong>' + $(this).attr('NetworkName') + '</strong>';
            FineLine3 = FineLine3 + ' unless and until said principal has paid Ocean Media. ';

            LoadUpfrontDeal($(this).attr('NetworkId'), $(this).attr('PlanYr'), 'UP');

            $('#lblFineLine3').html(FineLine3);
            $('#modal-upfrontdeal').modal();
        }
    });

    $('#btnSaveUpfrontDealCA').click(function () {      
        SaveUpfrontDeal($('#btnUpdateDealPointData').attr('NetworkId'),$('#btnUpdateDealPointData').attr('PlanYr'),'DR',        
           null, null, $('#txtUpfrontCancellationCA').val(),$('#txtScatterCancellationCA').val(),$('#txtNetworkSeparationCA').val());
    });
});

function SaveUpfrontDeal(_networkId, _planyr, _dr, _cancelLine1, _cancelLine2, _cancelLine3, _cancelLine4, _cancelLine5) {
    var url = "/ManageMedia/SaveCancellationPolicy";

    $.ajax({
        url: url,
        data: {
            networkid: _networkId,
            planyr: _planyr,
            dr: _dr,            
            cancelline1: _cancelLine1,
            cancelline2: _cancelLine2,
            cancelline3: _cancelLine3,
            cancelline4: _cancelLine4,
            cancelline5: _cancelLine5
        },
        cache: false,
        type: "POST",
        success: function (result) {
            if (result.success) {
                var notify = $.notify(result.responseText, {
                    type: 'success',
                    allow_dismiss: true
                });
            }
            else {
                swal('Error!', result.responseText, 'warning');
            }
        },
        error: function (response) {
            swal('Error!', response.responseText, 'warning');
        }
    });

}

function LoadUpfrontDeal(_networkId, _planyr, _dr) {
    var url = "/ManageMedia/LoadCancellationPolicy";

    $.ajax({
        url: url,
        data: {
            networkid: _networkId,
            planyr: _planyr,
            dr: _dr
        },
        cache: false,
        type: "POST",
        success: function (result) {
            if (result.success) {
                $('#txtBillboardAddedValue').val(result.cancelline1),
                    $('#txtUpfrontSponsorship').val(result.cancelline2),
                    $('#txtUpfrontCancellation').val(result.cancelline3),
                    $('#txtScatterCancellation').val(result.cancelline4),
                    $('#txtNetworkSeparation').val(result.cancelline5)
            }
            else {
                swal('Error!', result.responseText, 'warning');
            }
        },
        error: function (response) {
            swal('Error!', response.responseText, 'warning');
        }
    });

}

function LoadUpfrontDealCA(_networkId, _planyr, _dr) {
    var url = "/ManageMedia/LoadCancellationPolicy";

    $.ajax({
        url: url,
        data: {
            networkid: _networkId,
            planyr: _planyr,
            dr: _dr
        },
        cache: false,
        type: "POST",
        success: function (result) {
            if (result.success) {
                $('#txtUpfrontCancellationCA').val(result.cancelline3),
                    $('#txtScatterCancellationCA').val(result.cancelline4),
                    $('#txtNetworkSeparationCA').val(result.cancelline5)
            }
            else {
                swal('Error!', result.responseText, 'warning');
            }
        },
        error: function (response) {
            swal('Error!', response.responseText, 'warning');
        }
    });

}
