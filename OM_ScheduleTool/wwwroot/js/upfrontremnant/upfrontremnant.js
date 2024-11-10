function ShowHideColumn(columnIdx, that) {
    var upfronttable = $("#UpfrontTable").DataTable();
    var colStat = upfronttable.column(columnIdx);
    //colStat.visible(!colStat.visible());
    if (colStat.visible()) {
        that.className = 'btn btn-outline-danger';
        colStat.visible(false);
    }
    else {
        that.className = 'btn btn-outline-secondary';
        colStat.visible(true);
    }
}

function ShowHideColumnGray(columnIdx, that) {
    var upfronttable = $("#UpfrontTable").DataTable();
    var colStat = upfronttable.column(columnIdx);
    //colStat.visible(!colStat.visible());
    if (colStat.visible()) {
        that.className = 'btn btn-outline-secondary';
        colStat.visible(false);
    }
    else {
        that.className = 'btn btn-secondary';
        colStat.visible(true);
    }
}
function ResetState(upfronttable) {
    promptExit(0);
    upfronttable.state.clear();
    window.location.reload();
}

function ResetFilters(upfronttable) {
    upfronttable
        .search('')
        .columns().search('')
        .draw();
}
ShowPopup = function () {
    var url = '/StatusCode/299/';
    approvalPopup = window.open(url, "approvalPopup", 'width=640px,height=480px,top=150,left=250');
    approvalPopup.focus();
}

function Approve(UpfrontLineId, IsToApprove) {
    var url = '/StatusCode/299/';
    var _upfrontlineid = UpfrontLineId;
    var url = "/UpfrontRemnant/ApproveProperty";
    if (IsToApprove == false) {
        url = "/UpfrontRemnant/UnapproveProperty";
    }

    $.ajax({
        url: url,
        data: { upfrontlineid: _upfrontlineid },
        cache: false,
        type: "POST",
        success: function (result) {
            if (result.success) {
                try {
                    $('#edtApprovalStatus').val($('#edtApprovalStatus').val() + ';1' + result.responseText.replace('/', ' '));
                    ShowPopup();
                } catch (err) {
                    swal('Error!', err.message, 'warning');
                    $("#shouldRefresh").val(err.message);
                }
            }
            else {
                try {
                    //var notify = $.notify(result.responseText, {
                    //    type: 'danger',
                    //    allow_dismiss: true
                    //});
                    $('#edtApprovalStatus').val($('#edtApprovalStatus').val() + ';0' + result.responseText.replace('/', ' '));
                    ShowPopup();
                } catch (err) {
                    swal('Error!', err.message, 'warning');
                    $("#shouldRefresh").val(err.message);
                }
            }

        },
        error: function (response) {
            swal('Error1!', response.responseText, 'warning');
        }
    });
}


function ChangeProgram(_UpfrontLineId) {

    $.ajax({
        url: "/UpfrontRemnant/CanChangeProgram",
        data: {
            UpfrontLineId: _UpfrontLineId
        },
        cache: false,
        type: "POST",
        success: function (result) {
        },
        error: function (response) {
            var notify = $.notify(response.responseText, {
                type: 'danger',
                allow_dismiss: true
            });
        }

    });
}


/*
 *  Does this ever get called?  There's an alert.  
 *  Better test this.
 *  I think we can clean this up
 *  */

//function SaveRateAmt(
//    _upfrontLineId
//    , _rateAmt) {

//    // alert('save rate');
//    $.ajax({
//        url: "/CreateNewProperty/SaveRateAmount",
//        data: {
//            UpfrontLineId: _upfrontLineId,
//            Rate: _rateAmt,
//        },
//        cache: false,
//        type: "POST",
//        success: function (result) {
//            if (result.success == true) {
//                $('#btnReload').click();
//                $('#btnSaveChanges').removeAttr('disabled');
//                promptExit(1);
//            }
//            else {
//                var notify = $.notify(result.responseText, {
//                    type: 'danger',
//                    allow_dismiss: true
//                });
//            }

//        },
//        error: function (response) {
//            var notify = $.notify(response.responseText, {
//                type: 'danger',
//                allow_dismiss: true
//            });
//        }

//    });
//}

//function SaveImpressions(
//    _upfrontLineId
//    , _impressions) {

//    $.ajax({
//        url: "/CreateNewProperty/UpdateProperty",
//        data: {
//            UpfrontLineId: _upfrontLineId,
//            Impressions: _impressions,
//        },
//        cache: false,
//        type: "POST",
//        success: function (result) {
//            if (result.success == true) {
//                $('#btnReload').click();
//                $('#btnSaveChanges').removeAttr('disabled');
//                promptExit(1);
//            }
//            else {
//                var notify = $.notify(result.responseText, {
//                    type: 'danger',
//                    allow_dismiss: true
//                });
//            }

//        },
//        error: function (response) {
//            var notify = $.notify(response.responseText, {
//                type: 'danger',
//                allow_dismiss: true
//            });
//        }

//    });
//}


function SaveChanges(_UpfrontId) {
    var counter = 0;
    var myQuestion = "";

    ajax: ({
        url: '/UpfrontRemnant/GetUpdatedPropertyChangedCount',
        type: 'POST',
        data: {
            upfrontId: _UpfrontId
        },
        success: function (result) {
            if (result.success) {
                counter = result.responseCode;
            }
            else {
                swal('Error!', result.responseText, 'warning');
                return;
            }

        },
        error: function (response) {
            swal('Error1!', response.responseText, 'warning');
            return;
        }
    });

    if (counter == 0) {
        swal('', 'No properties selected for saving.', 'info');
        return;
    }
    if (counter == 1) {
        myQuestion = counter + ' property was updated.  Are you sure you want to save changes to database?';
    }
    else {
        myQuestion = counter + ' properties were updated.  Are you sure you want to save changes to database?';
    }
    swal({
        title: UpfrontName,
        text: myQuestion,
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, save it!',
        preConfirm: function () {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    resolve();
                }, 50);
            });
        }
    }).then(
    );


}