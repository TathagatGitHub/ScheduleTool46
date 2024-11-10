$(document).ready(function () {
    function cbDropdown(column) {
        return $('<ul>', {
            'class': 'cb-dropdown'
        }).appendTo($('<div>', {
            'class': 'cb-dropdown-wrap'
        }).appendTo(column));
    }

    // EXPORT
    $('#btnExportSubmit').click(function () {
        var _postlogid = GetParameterValues('postlogid');
        var params = [
            'height=' + screen.height - 50,
            'width=' + screen.width - 50,
            'resizable=yes',
            'scrollbars=yes'
        ].join(',');

        var _postloglinesids = "";
        var table = $('#PostLogViewTable').DataTable();
        $("#PostLogViewTable tbody tr").each(function () {
            //_postloglinesids.push(table.row(this).data().postLogLineId);
            _postloglinesids += "," + table.row(this).data().postLogLineId;
        });

        window.location.href = "/Logs/Export?postlogid=" + _postlogid + "&postloglinesids=" + _postloglinesids;
    });

    $('#btnExportAllSubmit').click(function () {
        var _postlogid = GetParameterValues('postlogid');
        var params = [
            'height=' + screen.height - 50,
            'width=' + screen.width - 50,
            'resizable=yes',
            'scrollbars=yes'
        ].join(',');

        window.location.href = "/Logs/ExportAll?postlogid=" + _postlogid;
    });

    $('#btnSummary').click(function () {
        var _postlogid = GetParameterValues('postlogid');
        var params = [
            'height=' + screen.height - 50,
            'width=' + screen.width - 50,
            'resizable=yes',
            'scrollbars=yes'
        ].join(',');

        window.location.href = "/Logs/Summary?postlogid=" + _postlogid;
    });

    // RELOAD
    $('#btnReload').on('click', function () {
        postlogviewtable.ajax.reload(null, false);
    });

    // RESET STATE
    $('#btnPropResetColumns').on('click', function (e) {
        var buttonName;
        var table = $('#PostLogViewTable').DataTable();
        table.columns().eq(0).each(function (index) {
            var column = table.column(index);
            if (!column.visible()) {
                column.visible(true);
                buttonName = "#ShowHideButton" + index;
                $(buttonName)[0].className = 'btn btn-outline-secondary';
            }
        });
    });

    // RESET STATE
    $('#btnPropResetFilters').on('click', function (e) {
        var table = $('#PostLogViewTable').DataTable();
        table
            .search('')
            .columns().search('')
            .draw();
        setTimeout(function () {
            window.location.reload();
        }, 1000);

    });

    // Show/Hide columns
    $('#btnPropShowColumns').on('click', function (e) {
        $("#divColumnVisibility").toggle();
    });

})

function ShowHideColumn(columnIdx, that) {
    var postlogtable = $("#PostLogViewTable").DataTable();
    var colStat = postlogtable.column(columnIdx);
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

function cbDropdown(column) {
    return $('<ul>', {
        'class': 'cb-dropdown'
    }).appendTo($('<div>', {
        'class': 'cb-dropdown-wrap'
    }).appendTo(column));
}
function PostLogGetValidISCIs() {    
    $.ajax({
        url: "/Logs/PostLogGetValidISCIs",
        data: { postLogId: GetParameterValues('postlogid') },
        type: "GET",
        success: function (result) {
            var markup = "";
            $.each(result, function (key, value) {
                markup += "<tr>";
                markup += "<td class='d-none d-sm-table-cell bg-secondary-light'>" + value.isci + "</td>";
                markup += "<td class='d-none d-sm-table-cell bg-secondary-light'>" + moment(value.dateStart).format("MM/DD/YYYY") + "</td>";
                markup += "<td class='d-none d-sm-table-cell bg-secondary-light'>" + moment(value.dateEnd).format("MM/DD/YYYY") + "</td>";
                markup += "<td class='d-none d-sm-table-cell bg-secondary-light'>" + value.length + "</td>";
                markup += "<td class='d-none d-sm-table-cell bg-secondary-light'>" + value.mediaType + "</td>";
                markup += "</td>";
                markup += "</tr>";
            });
            markup = (markup == "") ? "<tr><td colspan='5' style='text-align:center'>No ISCI's in Master Traffic List for this given week. Please contact traffic for more details.</tr></td>" : markup;
            $("#divValidISCIs").find('#tblValidISCIs tbody').html(markup);
        },
        error: function (response) {
            swal('Error!', error.responseText, 'warning');
        }
    });
}
