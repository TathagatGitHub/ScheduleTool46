$(document).ready(function () {
    PopulateCopyWeek(_UniqueId);    
});

function ProcessCopyRight() { 
    var _NetworkNames = "";
    var _scheduleLineIds = "";   
    try {
        var proptable = $("#MyProposalTable").DataTable();
        if (proptable) {          
            // COLINDEX_DEPENDENT 
            // 7 is currently the networkname column
            var data = proptable.column(7).data().unique();

            $("#MyProposalTable tbody tr").each(function () {
                if (_scheduleLineIds.length == 0) {
                    _scheduleLineIds = proptable.row(this).data().scheduleLineId;
                }
                else {
                    _scheduleLineIds += "," + proptable.row(this).data().scheduleLineId;
                }
            });
            if (data.length > 1) {               
                swal('Error', 'There is more than one network active.', 'error');
                return;
            }
            else {               
                $.ajax({
                    url: '/ScheduleProposal/CopySpots',
                    type: 'POST',
                    data: {
                        proposalId: _UniqueId,
                        copyWeek: $("#ddlCopyWeek").val(),
                        endCopyWeek: $("#ddlEndCopyWeek").val(),
                        networkName: data[0],
                        scheduleLineIds: _scheduleLineIds
                    },
                    cache: false,
                    success: function (result) {                        
                        if (result.success) { 
                            //window.onunload = null;
                            proptable.ajax.reload();
                            //for (var i = startWk + 1; i <= endWk; i++) {
                            //    if(i < 10){
                            //        weekCounts["wk0" + i] = proptable.data().rows().count();
                            //    }
                            //    else{
                            //        weekCounts["wk" + i] = proptable.data().rows().count();
                            //    }                                    
                            //}
                            $("#modal-copyright").modal('hide');
                            $("#btnSaveChanges").removeAttr("disabled");
                            ReloadTotals();
                            WeeklySpot = [];
                            $("#btnUndoWeeklySpotChange").attr('disabled', 'disabled');
                        }
                    },
                    error: function (response) {                       
                        swal({
                            title: "Error",
                            text: response.responseText,
                            type: 'error',
                        });
                    }
                });
            }
        }        
    }
    catch (err) {       
        swal({
            title: "Error",
            text: err,
            type: 'error',
        });
    }

}