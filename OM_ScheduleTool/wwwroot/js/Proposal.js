$(document).ready(function () {
    $('select.DiscountPrice').change(function () {
    });
});

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function RecalculateProposalDataTable(DiscountPrice) {
    // or your data in the format that will be used ??
    $.ajax({
        type: "POST",
        data: {
            ProposalId: getParameterByName('ProposalId')
            , DiscountPrice: DiscountPrice.find('option:selected').attr('value')
        },
        url: '/ManageMedia/_Proposal_DataTable',
        success: function (result) {
            $('#ProposalTableDiv').html(result);
        },
        error: function (response) {
            $('#ProposalTableDiv').html(response.responseText);
        }
    });


    //alert(DiscountPrice.find('option:selected').attr('value'));
    //$('#ProposalTableDiv').html(DiscountPrice.find('option:selected').attr('value'));

    //$('#ProposalTableDiv').load("~/ManageMedia/_Proposal_DataTable?ProposalId=251&DiscountPrice=0.07");
    //    '@(Url.Action("_Proposal_DataTable","ManageMedia",null, Request.Url.Scheme))?ProposalId=' + getParameterByName('ProposalId') + '&DiscountPrice=' + DiscountPrice
    //);

}
