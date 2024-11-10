var checkboxSetFlag = false;
var initialLoadDone = false;
var addnewpropertytable;
var checkedData = [];
var checkedDataForSave;
var finalDataForSave = [];
var arrays = {};
$(document).ready(function () {
    //setTimeout(function () { PopulateAvailableProperties(); }, 2000);

    $('#AddNewPropertyTable').on('click', 'tbody input.editor-active', function () {
        console.log('delegated click event'); // it is never shown
        cb = $(this).prop('checked');
        console.log(cb)
    });


    $('#AddNewPropertyTable').on('change', 'tbody input.editor-active', function () {
        console.log('delegated change event'); // it is never shown
        cb = $(this).prop('checked');
        console.log(cb)
    });

    $('input[type=checkbox]').on('change', function () {
        //var oTable = $('#AddNewPropertyTable').dataTable();
        //var rowcollection = oTable.$(".editor-active:checked", { "page": "all" });
        //rowcollection.each(function (index, elem) {
        //    var checkbox_value = $(elem).val();
        //});

    });


    $('#properties-select-all').on('click', function () {
        // Get all rows with search applied
        var oTable = $('#AddNewPropertyTable').DataTable();
        var rows = oTable.rows({ 'search': 'applied' }).nodes();
        // Check/uncheck checkboxes for all rows in the table
        $('input[type="checkbox"]', rows).prop('checked', this.checked);
        EnableAdd();
    });

    $('#AddNewPropertyTable tbody').on('change', 'input[type="checkbox"]', function () {
        if (!$(this).prop("checked")) {
            $("#properties-select-all").prop("checked", false);
        }
    });

    $('#AddNewPropertyTable tbody').on('click', 'input[type="checkbox"]', function () {
        checkboxSetFlag = true;
        var oTable = $('#AddNewPropertyTable').dataTable();
        var numberOfChecked = oTable.$(".editor-active:checked", { "page": "all" }).length;
        var totalCheckboxes = oTable.$(".editor-active", { "page": "all" }).length;
        if (totalCheckboxes == numberOfChecked) {
            $("#properties-select-all").prop("checked", true);
        }
    });

    $('#AddNewPropertyTable').on('click', 'tbody tr', function () {
        if (!checkboxClick) {

            var checkbox = $(this).find("input[type='checkbox']");
            var oTable = $('#AddNewPropertyTable').dataTable();
            var numberOfChecked = oTable.$(".editor-active:checked", { "page": "all" }).length;
            var totalCheckboxes = oTable.$(".editor-active", { "page": "all" }).length;

            if (!checkboxSetFlag) {
                if (!checkbox.prop('checked')) {
                    checkbox.prop('checked', true);
                    numberOfChecked = oTable.$(".editor-active:checked", { "page": "all" }).length;
                    totalCheckboxes = oTable.$(".editor-active", { "page": "all" }).length;
                    if (totalCheckboxes == numberOfChecked) {
                        $("#properties-select-all").prop("checked", true);
                    }
                    EnableAdd();
                }
                else {
                    checkbox.prop('checked', false);
                    $("#properties-select-all").prop("checked", false);
                    numberOfChecked = oTable.$(".editor-active:checked", { "page": "all" }).length;
                    if (numberOfChecked == 0) {
                        EnableAdd();
                    }
                }
            }
            checkboxSetFlag = false;
        }
        checkboxClick = false;
    });

    $("#ddlNetworks").change(function () {
        PopulateDemoNames($(this).val());
        PopulateAvailableProperties();
    });

    $("#ddlDemoName").change(function () {
        PopulateAvailableProperties();
    });

    $("#ddlStartTime").change(function () {
        var table = $('#AddNewPropertyTable').DataTable();
        table.column(12).search($(this).val(), true, false).draw();
    });

    $("#ddlEndTime").change(function () {
        var table = $('#AddNewPropertyTable').DataTable();
        table.column(13).search($(this).val(), true, false).draw();
    });

    $("#ddlDP").change(function () {
        var table = $('#AddNewPropertyTable').DataTable();
        table.column(3).search($(this).val(), true, false).draw();
    });

    $("#ddlDays").change(function () {
        var table = $('#AddNewPropertyTable').DataTable();
        table.column(4).search($(this).val(), true, false).draw();
    });

    $("#ddlLen").change(function () {
        var table = $('#AddNewPropertyTable').DataTable();
        table.column(5).search($(this).val(), true, false).draw();
    });

    $("#ddlBuyType").change(function () {
        var table = $('#AddNewPropertyTable').DataTable();
        table.column(15).search($(this).val(), true, false).draw();
    });

    $("#ddlStatus").change(function () {
        var table = $('#AddNewPropertyTable').DataTable();
        table.column(9).search($(this).val(), true, false).draw();
    });
});
var checkboxClick = false;
function ValidateSingleSelection(ctrl) {
    checkboxClick = true;
    var checkbox1 = $(ctrl);
    var checkbox = $(this).find("input[type='checkbox']");
    console.log(checkbox1);
    console.log(checkbox);
    var oTable = $('#AddNewPropertyTable').dataTable();
    var numberOfChecked = oTable.$(".editor-active:checked", { "page": "all" }).length;
    var totalCheckboxes = oTable.$(".editor-active", { "page": "all" }).length;
    if (totalCheckboxes == numberOfChecked) {
        $("#properties-select-all").prop("checked", true);
    }
    else {
        $("#properties-select-all").prop("checked", false);
    }
    EnableAdd();

    // if (!checkbox.prop('checked')) {
    //     checkbox.prop('checked', true);
    //     numberOfChecked = oTable.$(".editor-active:checked", { "page": "all" }).length;
    //     totalCheckboxes = oTable.$(".editor-active", { "page": "all" }).length;
    //     if (totalCheckboxes == numberOfChecked) {
    //         $("#properties-select-all").prop("checked", true);
    //     }
    //     EnableAdd();
    // }
    // else {
    //     checkbox.prop('checked', false);
    //     $("#properties-select-all").prop("checked", false);
    //     numberOfChecked = oTable.$(".editor-active:checked", { "page": "all" }).length;
    //     if (numberOfChecked == 0) {
    //         EnableAdd();
    //     }
    // }

    checkboxSetFlag = false;

    return false;
}
function PopulateStartTime() {
    var procemessage = "<option value='0'> Please wait...</option>";
    $("#ddlStartTime").html(procemessage).show();

    var table = $('#AddNewPropertyTable').DataTable();

    var markup = "";
    if (table) {
        var data = table.column(12).data().unique();
        data = data.sort();
        markup = "<option value=''>Please select ...</option>";
        for (var idx = 0; idx < data.length; idx++) {
            markup += "<option value='" + data[idx] + "'>" + FormatTime12Hours(data[idx]) + "</option>";
        }
        $("#ddlStartTime").html(markup).show();
        if (data.length > 1) {
            $("#ddlStartTime").removeAttr('disabled');
        }
        else {
            $("#ddlStartTime").attr('disabled', 'disabled');
        }
    }
}

function PopulateEndTime() {
    var procemessage = "<option value='0'> Please wait...</option>";
    $("#ddlEndTime").html(procemessage).show();

    var table = $('#AddNewPropertyTable').DataTable();

    var markup = "";
    if (table) {
        var data = table.column(13).data().unique();
        data = data.sort();
        markup = "<option value=''>Please select ...</option>";
        for (var idx = 0; idx < data.length; idx++) {
            markup += "<option value='" + data[idx] + "'>" + FormatTime12Hours(data[idx]) + "</option>";
        }
        $("#ddlEndTime").html(markup).show();
        if (data.length > 1) {
            $("#ddlEndTime").removeAttr('disabled');
        }
        else {
            $("#ddlEndTime").attr('disabled', 'disabled');
        }
    }
}
function FormatTime12Hours(timeVal) {
    var originalTime = timeVal;

    // Split the time string into hours and minutes
    var timeParts = originalTime.split(':');
    var hours = parseInt(timeParts[0]);
    var minutes = parseInt(timeParts[1].split(" ")[0]);
    var meridian = timeParts[1].split(" ")[1];

    // Convert 24-hour format to 12-hour format
    var newHours = (hours % 12 || 12).toString().padStart(2, '0');

    // Construct the new time string
    var newTime = newHours + ":" + minutes.toString().padStart(2, '0') + " " + meridian;
    return newTime;
}

function PopulateDP() {
    var procemessage = "<option value='0'> Please wait...</option>";
    $("#ddlDP").html(procemessage).show();

    var table = $('#AddNewPropertyTable').DataTable();

    var markup = "";
    if (table) {
        var data = table.column(3).data().unique();
        markup = "<option value=''>Please select ...</option>";
        for (var idx = 0; idx < data.length; idx++) {
            markup += "<option value='" + data[idx] + "'>" + data[idx] + "</option>";
        }
        $("#ddlDP").html(markup).show();
        if (data.length > 1) {
            $("#ddlDP").removeAttr('disabled');
        }
        else {
            $("#ddlDP").attr('disabled', 'disabled');
        }
    }
}

function PopulateDays() {
    var procemessage = "<option value='0'> Please wait...</option>";
    $("#ddlDays").html(procemessage).show();

    var table = $('#AddNewPropertyTable').DataTable();

    var markup = "";
    if (table) {
        var data = table.column(4).data().unique();
        markup = "<option value=''>Please select ...</option>";
        for (var idx = 0; idx < data.length; idx++) {
            markup += "<option value='" + data[idx] + "'>" + data[idx] + "</option>";
        }
        $("#ddlDays").html(markup).show();
        if (data.length > 1) {
            $("#ddlDays").removeAttr('disabled');
        }
        else {
            $("#ddlDays").attr('disabled', 'disabled');
        }
    }
}

function PopulateLen() {
    var procemessage = "<option value='0'> Please wait...</option>";
    $("#ddlLen").html(procemessage).show();

    var table = $('#AddNewPropertyTable').DataTable();

    var markup = "";
    if (table) {
        var data = table.column(5).data().unique();
        markup = "<option value=''>Please select ...</option>";
        for (var idx = 0; idx < data.length; idx++) {
            markup += "<option value='" + data[idx] + "'>" + data[idx] + "</option>";
        }
        $("#ddlLen").html(markup).show();
        if (data.length > 1) {
            $("#ddlLen").removeAttr('disabled');
        }
        else {
            $("#ddlLen").attr('disabled', 'disabled');
        }
    }
}

function PopulateBuyType() {
    var procemessage = "<option value='0'> Please wait...</option>";
    $("#ddlBuyType").html(procemessage).show();

    var table = $('#AddNewPropertyTable').DataTable();

    var markup = "";
    if (table) {
        var data = table.column(15).data().unique();
        markup = "<option value=''>Please select ...</option>";
        for (var idx = 0; idx < data.length; idx++) {
            markup += "<option value='" + data[idx] + "'>" + data[idx] + "</option>";
        }
        $("#ddlBuyType").html(markup).show();
        if (data.length > 1) {
            $("#ddlBuyType").removeAttr('disabled');
        }
        else {
            $("#ddlBuyType").attr('disabled', 'disabled');
        }
    }
}

function PopulateStatus() {
    var procemessage = "<option value='0'> Please wait...</option>";
    $("#ddlStatus").html(procemessage).show();

    var table = $('#AddNewPropertyTable').DataTable();

    var markup = "";
    if (table) {
        var data = table.column(9).data().unique();
        markup = "<option value=''>Please select ...</option>";
        for (var idx = 0; idx < data.length; idx++) {
            markup += "<option value='" + data[idx] + "'>" + data[idx] + "</option>";
        }
        $("#ddlStatus").html(markup).show();
        if (data.length > 1) {
            $("#ddlStatus").removeAttr('disabled');
        }
        else {
            $("#ddlStatus").attr('disabled', 'disabled');
        }
    }
}

//$('#AddNewPropertyTable').on('click', 'input[type="checkbox"]', function () {
//    var index = $(this).index;
//});

//$('#AddNewPropertyTable tbody').on('change', 'input[type="checkbox"]', function () {
//   if (!this.checked) {

//   }
//});



function EnableAdd() {
    $('#btnAdd').attr('disabled', 'disabled');
    $('#btnSplitAddChildProperties').attr('disabled', 'disabled');
    //var rowIndex = $(ele).data('id');

    var oTable = $('#AddNewPropertyTable').dataTable();
    // var data = oTable.row(this).data();

    var selRowcollection = oTable.$(".editor-active:checked", { "page": "all" });

    selRowcollection.each(function (index, elem) {
        $('#btnAdd').removeAttr('disabled');
        $('#btnSplitAddChildProperties').removeAttr('disabled');

    });
}

function AddScheduleLines() {
    var _RateIds = "";
    $('#btnAdd').attr('disabled', 'disabled');
    $('#btnSplitAddChildProperties').attr('disabled', 'disabled');
    var oTable = $('#AddNewPropertyTable').dataTable();

    var allRowscollection = oTable.$(".editor-active", { "page": "all" });
    var rowsCount = allRowscollection.length;

    allRowscollection.each(function (index, elem) {

        if ($(elem).is(':checked')) {
            var currentRow_value = $(elem).val();
            var currentRow_rateId = $(elem).attr('id');
            var currentRow_splitId = $(elem).attr('splitId');
            var currentRow_spotLen = $(elem).attr('spotLen');

            if (_RateIds.length > 0) {
                _RateIds = _RateIds + ',';
            }
            _RateIds = _RateIds + currentRow_rateId;

            if ($(elem).attr('spotLen') == 15 && currentRow_splitId == 2) {
                if (index < rowsCount - 1) { //row index starts from 0 so rowsCount - 1
                    var nextRow = allRowscollection[index + 1];
                    var nextRowRateId = 0;
                    var nextRow_rateId = $(nextRow).attr('id');
                    var nextRow_splitId = $(nextRow).attr('splitId');
                    var nextRow_spotLen = $(nextRow).attr('spotLen');

                    //check if next row is also spotLen == 15
                    if ($(nextRow).attr('spotLen') == 15 && nextRow_splitId == 3) {
                        var nextRowCheckbox = $(nextRow).find('td:first-child input[type="checkbox"]');

                        //if ($(nextRowCheckbox).is(':unchecked')) {
                        nextRowRateId = $(nextRow).attr('id');

                        if (_RateIds.length > 0) {
                            _RateIds = _RateIds + ',';
                        }
                        _RateIds = _RateIds + nextRowRateId;
                        //}
                    }
                }
            }
            else if ($(elem).attr('spotLen') == 15 && currentRow_splitId == 3) //check if next row is also spotLen == 15
            {
                if (index > 0) {
                    var previousRow = allRowscollection[index - 1];
                    var previousRowRateId = 0;
                    var previousRow_rateId = $(previousRow).attr('id');
                    var previousRow_splitId = $(previousRow).attr('splitId');
                    var previousRow_spotLen = $(previousRow).attr('spotLen');

                    if ($(previousRow).attr('spotLen') == 15 && previousRow_splitId == 2) {
                        var previousRowCheckbox = $(previousRow).find('td:first-child input[type="checkbox"]');

                        //if ($(previousRowCheckbox).is(':unchecked')) {
                        previousRowRateId = $(previousRow).attr('id');

                        if (_RateIds.length > 0) {
                            _RateIds = _RateIds + ',';
                        }

                        _RateIds = _RateIds + previousRowRateId;
                        // }
                    }
                }
            }


        }
    });

    var rowcollection = oTable.$(".editor-active:checked", { "page": "all" });

    //rowcollection.each(function (index, elem) {
    //    $('#btnAdd').removeAttr('disabled');
    //    //var checkbox_value = $(elem).val();
    //    var checkbox_rateId = $(elem).attr('id');
    //    if (_RateIds.length > 0) {
    //        _RateIds = _RateIds + ',';
    //    }
    //    _RateIds = _RateIds + checkbox_rateId
    //});

    _RateIds = Array.from(new Set(_RateIds.split(','))).toString();

    if (_RateIds != '') {
        $.ajax({
            url: '/ScheduleProposal/AddScheduleLines',
            data: {
                ProposalId: _UniqueId,
                RateIds: _RateIds
            },
            cache: false,
            type: "POST",
            success: function (result) {
                swal('Rates', _RateIds, 'error');
                if (result.success == true) {
                    swal({
                        position: 'top-end',
                        type: 'success',
                        title: 'Success!',
                        text: 'Rates were successfully added.  Page will refresh in 3 seconds.',
                        showConfirmButton: true,
                        timer: 5000
                    });
                    window.setTimeout(function () { window.location.reload() }, 3000);
                }
                else {
                    swal('Error!', result.responseText, 'error');
                }
            },
            error: function (response) {
                var notify = $.notify(response.responseText, {
                    type: 'danger',
                    allow_dismiss: true
                });
            }
        });
    }
    else {
        swal('Wait!', 'None selected for addition', 'error');
    }
}

function PopulateAvailableProperties(_NetworkId, _DemoId) {
    // if ($.fn.DataTable.isDataTable('#AddNewPropertyTable')) {
    //    return;
    //}
    addnewpropertytable = $('#AddNewPropertyTable').DataTable({
        info: false,
        scrollX: false,
        scrollY: 400,
        scrollCollapse: true,
        paging: false,
        destroy: true,
        "stripeClasses": ['odd-row', 'even-row'],
        //deferRender: true,
        //processing: true,
        ordering: true,
        autoWidth: false,
        language: {
            infoFiltered: "",
            processing: "<i class='fa fa-refresh fa-spin'></i>"
        },
        ajax: {
            url: '/ScheduleProposal/GetAvailableProperties',
            type: 'POST',
            data: function (d) {
                d.proposalId = _UniqueId,
                    d.NetworkId = $('#ddlNetworks').val(),
                    d.DemoId = $('#ddlDemoName').val()
            }
        },
        //columns: [
        columnDefs: [
            {
                targets: 0,
                data: null,
                defaultContent: '',
                class: "d-none d-sm-table-cell text-left",
                render: function (data, type, row) {
                    if (type === 'display') {

                        //return '<input type="checkbox" class="editor-active" id="' + data.rateId + '", splitId="' + data.splitId + '" onclick="javascript:EnableAdd();">';
                        return '<input type="checkbox" class="editor-active" id="' + data.rateId + '", splitId="' + data.splitId + '", spotLen="' + data.spotLen + '" onclick="javascript:ValidateSingleSelection(this);">';
                        //return '<input type="checkbox" class="editor-active">';
                    }
                    return data;
                },
                //className: 'select-checkbox',
                width: 10,
                orderable: false,
                searchable: false,
                selectRow: true
            },
            {
                targets: 1,
                data: "propertyName",
                class: "d-none d-sm-table-cell text-left",
                render: $.fn.dataTable.render.ellipsis(2000, true),
                //visible: true,
                width: 300
            },
            {
                targets: 2,
                data: "time",
                class: "d-none d-sm-table-cell text-left",
                // visible: true,
                width: 100
            },
            {
                targets: 3,
                data: "dp",
                class: "d-none d-sm-table-cell text-left",
                // visible: true,
                width: 25
            },
            {
                targets: 4,
                data: "days",
                class: "d-none d-sm-table-cell text-left",
                //visible: true,
                width: 35
            },
            {
                targets: 5,
                data: "spotLen",
                //visible: true,
                width: 30,
                class: "d-none d-sm-table-cell text-center",
                render: function (data, type, row, meta) {
                    if (data === 120) {
                        return "<span class='badge badge-pill badge-danger'>" + data + "</span>";
                    }
                    else if (data === 60) {
                        return "<span class='badge badge-pill badge-primary'>" + data + "</span>";
                    }
                    else if (data === 15) {
                        return "<span class='badge badge-pill badge-warning'>" + data + "</span>";
                    }
                    else {
                        return "<span class='badge badge-pill badge-success'>" + data + "</span>";
                    }
                }
            },
            {
                targets: 6,
                data: "rateAmt",
                class: "d-none d-sm-table-cell text-right",
                render: $.fn.dataTable.render.number(',', '.', 2, '$'),
                //visible: true,
                width: 80
            },
            {
                targets: 7,
                data: "imp",
                class: "d-none d-sm-table-cell text-right",
                render: $.fn.dataTable.render.number(',', '.', 2, ''),
                // visible: true,
                width: 35
            },
            {
                targets: 8,
                data: "cpm",
                class: "d-none d-sm-table-cell text-right",
                render: $.fn.dataTable.render.number(',', '.', 2, '$'),
                // visible: true,
                width: 35
            },
            {
                targets: 9,
                data: "status",
                class: "d-none d-sm-table-cell text-left",
                // visible: true,
                width: 80
            },
            {
                targets: 10,
                data: "effExp",
                class: "d-none d-sm-table-cell text-right",
                // visible: true,
                width: 85
            },
            {
                targets: 11,
                width: 80,
                data: "reviseDt",
                class: "d-none d-sm-table-cell text-right",
                //   visible: true,
                render: function (d) {
                    return "<span style='display:none;'>" + d + "</span>" + moment(d).format("MM/DD/YYYY hh:mm A");
                }
            },
            {
                targets: 12,
                width: 80,
                data: "startTimeFormatted",
                class: "d-none d-sm-table-cell text-left",
                visible: false
            },
            {
                targets: 13,
                width: 80,
                data: "endTimeFormatted",
                class: "d-none d-sm-table-cell text-left",
                visible: false
            },
            {
                targets: 14,
                width: 30,
                //data: "buyTypeDescription",
                data: "spBuy",
                class: "d-none d-sm-table-cell text-left",
                //  visible: true
            },
            {
                targets: 15,
                width: 25,
                //data: "buyTypeDescription",
                data: "buyTypeCode",
                class: "d-none d-sm-table-cell text-left",
                //  visible: true
            }
        ],
        fixedColumns: true,
        createdRow: function (row, data, dataIndex) {
            // if (dataIndex == 0 || dataIndex % 2 != 0) {
            //     $(row).addClass('even-row');
            // }
            // else {
            //     $(row).addClass('odd-row');
            // }
            if (dataIndex == 0 || dataIndex % 2 == 0) {
                $($(row).find("td")[0]).css("background-color", "#FFFFFF");
                $($(row).find("td")[1]).css("background-color", "#FFFFFF");
                $($(row).find("td")[2]).css("background-color", "#FFFFFF");
                $($(row).find("td")[3]).css("background-color", "#FFFFFF");
                $($(row).find("td")[4]).css("background-color", "#FFFFFF");
                $($(row).find("td")[5]).css("background-color", "#FFFFFF");
                $($(row).find("td")[6]).css("background-color", "#FFFFFF");
                $($(row).find("td")[7]).css("background-color", "#FFFFFF");
                $($(row).find("td")[8]).css("background-color", "#FFFFFF");
                $($(row).find("td")[9]).css("background-color", "#FFFFFF");
                $($(row).find("td")[10]).css("background-color", "#FFFFFF");
                $($(row).find("td")[11]).css("background-color", "#FFFFFF");
                $($(row).find("td")[12]).css("background-color", "#FFFFFF");
                $($(row).find("td")[13]).css("background-color", "#FFFFFF");
            }
            else {
                $($(row).find("td")[0]).css("background-color", "#f9f9f9");
                $($(row).find("td")[1]).css("background-color", "#f9f9f9");
                $($(row).find("td")[2]).css("background-color", "#f9f9f9");
                $($(row).find("td")[3]).css("background-color", "#f9f9f9");
                $($(row).find("td")[4]).css("background-color", "#f9f9f9");
                $($(row).find("td")[5]).css("background-color", "#f9f9f9");
                $($(row).find("td")[6]).css("background-color", "#f9f9f9");
                $($(row).find("td")[7]).css("background-color", "#f9f9f9");
                $($(row).find("td")[8]).css("background-color", "#f9f9f9");
                $($(row).find("td")[9]).css("background-color", "#f9f9f9");
                $($(row).find("td")[10]).css("background-color", "#f9f9f9");
                $($(row).find("td")[11]).css("background-color", "#f9f9f9");
                $($(row).find("td")[12]).css("background-color", "#f9f9f9");
                $($(row).find("td")[13]).css("background-color", "#f9f9f9");
            }

            $($(row).find("td")[0]).width(21);
            $($(row).find("td")[1]).width(300);
            $($(row).find("td")[2]).width(100);
            $($(row).find("td")[3]).width(25);
            $($(row).find("td")[4]).width(35);
            $($(row).find("td")[5]).width(30);
            $($(row).find("td")[6]).width(80);
            $($(row).find("td")[7]).width(35);
            $($(row).find("td")[8]).width(35);
            $($(row).find("td")[9]).width(80);
            $($(row).find("td")[10]).width(85);
            $($(row).find("td")[11]).width(80);
            $($(row).find("td")[12]).width(30);
            $($(row).find("td")[13]).width(25);

            $($(row).find("td")[0]).css("padding-left", "5px")
            $($(row).find("td")[1]).css("padding-left", "5px")
            // $($(row).find("td")[2]).width(100);
            // $($(row).find("td")[3]).width(25);
            // $($(row).find("td")[4]).width(35);
            // $($(row).find("td")[5]).width(30);
            // $($(row).find("td")[6]).width(80);
            // $($(row).find("td")[7]).width(35);
            // $($(row).find("td")[8]).width(35);
            // $($(row).find("td")[9]).width(80);
            // $($(row).find("td")[10]).width(85);
            // $($(row).find("td")[11]).width(80);
            // $($(row).find("td")[12]).width(30);
            // $($(row).find("td")[13]).width(25);
        },
        initComplete: function () {
            PopulateStartTime();
            PopulateEndTime();
            PopulateDP();
            PopulateDays();
            PopulateLen();
            PopulateBuyType();
            PopulateStatus();
            setTimeout(function () {
                $($("#divAvailableProperties table th")[0]).width(0);
                $($("#divAvailableProperties table th")[1]).width(300);
                $($("#divAvailableProperties table th")[2]).width(100);
                $($("#divAvailableProperties table th")[3]).width(25);
                $($("#divAvailableProperties table th")[4]).width(35);
                $($("#divAvailableProperties table th")[5]).width(55);
                $($("#divAvailableProperties table th")[6]).width(80);
                $($("#divAvailableProperties table th")[7]).width(35);
                $($("#divAvailableProperties table th")[8]).width(35);
                $($("#divAvailableProperties table th")[9]).width(80);
                $($("#divAvailableProperties table th")[10]).width(85);
                $($("#divAvailableProperties table th")[11]).width(80);
                $($("#divAvailableProperties table th")[12]).width(30);
                $($("#divAvailableProperties table th")[13]).width(25);

                $($("#divAvailableProperties .dataTables_scrollBody th")[0]).width(0);
                $($("#divAvailableProperties .dataTables_scrollBody th")[1]).width(300);
                $($("#divAvailableProperties .dataTables_scrollBody th")[2]).width(100);
                $($("#divAvailableProperties .dataTables_scrollBody th")[3]).width(25);
                $($("#divAvailableProperties .dataTables_scrollBody th")[4]).width(35);
                $($("#divAvailableProperties .dataTables_scrollBody th")[5]).width(55);
                $($("#divAvailableProperties .dataTables_scrollBody th")[6]).width(80);
                $($("#divAvailableProperties .dataTables_scrollBody th")[7]).width(35);
                $($("#divAvailableProperties .dataTables_scrollBody th")[8]).width(35);
                $($("#divAvailableProperties .dataTables_scrollBody th")[9]).width(80);
                $($("#divAvailableProperties .dataTables_scrollBody th")[10]).width(85);
                $($("#divAvailableProperties .dataTables_scrollBody th")[11]).width(80);
                $($("#divAvailableProperties .dataTables_scrollBody th")[12]).width(30);
                $($("#divAvailableProperties .dataTables_scrollBody th")[13]).width(25);

                $("#divAvailableProperties .dataTables_scrollHeadInner th").css("padding-left", "5px");
                $("#divAvailableProperties .dataTables_scrollBody th").css("padding-left", "5px");
                if ($($("#divAvailableProperties .dataTables_scrollHeadInner table thead tr th")[0]).hasClass("sorting_asc"))
                    $($("#divAvailableProperties .dataTables_scrollHeadInner table thead tr th")[0]).removeClass("sorting_asc");
                if ($($(".dataTables_scrollBody table thead tr th")[0]).hasClass("sorting_asc"))
                    $($(".dataTables_scrollBody table thead tr th")[0]).removeClass("sorting_asc");

                $("#AddNewPropertyTable_wrapper .dataTables_scrollHead").css("background-color", "#42A4F4");
                $(".dtfc-right-top-blocker").css("background-color", "#42A4F4");


                $("#divAvailableProperties .dataTables_scrollBody").css("overflow-x", "hidden");
                $(".AddNewPropertyTable_filter").css("margin-right", "22px");

                if (!initialLoadDone) {
                    initialLoadDone = true;
                    ResetPropData(1);
                }
            }, 100);
            setTimeout(function () {
                addnewpropertytable.order([1, 'asc']).draw();
                if ($($("#divAvailableProperties .dataTables_scrollHeadInner table thead tr th")[1]).hasClass("sorting_asc"))
                    $($("#divAvailableProperties .dataTables_scrollHeadInner table thead tr th")[1]).removeClass("sorting_asc");
                if ($($(".dataTables_scrollBody table thead tr th")[1]).hasClass("sorting_asc"))
                    $($(".dataTables_scrollBody table thead tr th")[1]).removeClass("sorting_asc");
                $($("#divAvailableProperties .dataTables_scrollHeadInner table thead tr th")[1]).addClass("sorting");
                $($(".dataTables_scrollBody table thead tr th")[1]).addClass("sorting");
            }, 500);

        }
    });

    // Filter event handler
    $(addnewpropertytable.table().container()).on('change', '#ddlStartTime', function () {
        table
            .column($(this).data('index'))
            .search(this.value)
            .draw();
    });

    $('#AddNewPropertyTable tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {

        }
    });

    $('#AddNewPropertyTable').on('click', 'tbody input.editor-active', function () {
        console.log('delegated click event'); // it is never shown
        cb = $(this).prop('checked');
        console.log(cb)
    });

}

function PopulateAvailableProperties_OLD(_NetworkId, _DemoId) {
    // if ($.fn.DataTable.isDataTable('#AddNewPropertyTable')) {
    //    return;
    //}    
    var addnewpropertytable = $('#AddNewPropertyTable').DataTable({
        info: false,
        scrollX: false,
        scrollY: 400,
        scrollCollapse: true,
        paging: false,
        destroy: true,
        "stripeClasses": ['odd-row', 'even-row'],
        //deferRender: true,
        //processing: true,
        ordering: true,
        autoWidth: false,
        language: {
            infoFiltered: "",
            processing: "<i class='fa fa-refresh fa-spin'></i>"
        },
        ajax: {
            url: '/ScheduleProposal/GetAvailableProperties',
            type: 'POST',
            data: function (d) {
                d.proposalId = _UniqueId,
                    d.NetworkId = $('#ddlNetworks').val(),
                    d.DemoId = $('#ddlDemoName').val()
            }
        },
        //columns: [
        columnDefs: [
            {
                targets: 0,
                data: null,
                defaultContent: '',
                class: "d-none d-sm-table-cell text-left",
                render: function (data, type, row) {
                    
                    if (type === 'display') {

                        //return '<input type="checkbox" class="editor-active" id="' + data.rateId + '", splitId="' + data.splitId + '" onclick="javascript:EnableAdd();">';
                        return '<input type="checkbox" class="editor-active" id="' + data.rateId + '", splitId="' + data.splitId + '", spotLen="' + data.spotLen + '"onclick="javascript:EnableAdd();">';
                        //return '<input type="checkbox" class="editor-active">';
                    }
                    return data;
                },
                //className: 'select-checkbox',
                width: 10,
                orderable: false,
                searchable: false,
                selectRow: true
            },
            {
                targets: 1,
                data: "propertyName",
                class: "d-none d-sm-table-cell text-left",
                render: $.fn.dataTable.render.ellipsis(2000, true),
                //visible: true,
                width: 300
            },
            {
                targets: 2,
                data: "time",
                class: "d-none d-sm-table-cell text-left",
                // visible: true,
                width: 100
            },
            {
                targets: 3,
                data: "dp",
                class: "d-none d-sm-table-cell text-left",
                // visible: true,
                width: 25
            },
            {
                targets: 4,
                data: "days",
                class: "d-none d-sm-table-cell text-left",
                //visible: true,
                width: 35
            },
            {
                targets: 5,
                data: "spotLen",
                //visible: true,
                width: 30,
                class: "d-none d-sm-table-cell text-right",
                render: function (data, type, row, meta) {
                    if (data === 120) {
                        return "<span class='badge badge-pill badge-danger'>" + data + "</span>";
                    }
                    else if (data === 60) {
                        return "<span class='badge badge-pill badge-primary'>" + data + "</span>";
                    }
                    else if (data === 15) {
                        return "<span class='badge badge-pill badge-warning'>" + data + "</span>";
                    }
                    else {
                        return "<span class='badge badge-pill badge-success'>" + data + "</span>";
                    }
                }
            },
            {
                targets: 6,
                data: "rateAmt",
                class: "d-none d-sm-table-cell text-right",
                render: $.fn.dataTable.render.number(',', '.', 2, '$'),
                //visible: true,
                width: 80
            },
            {
                targets: 7,
                data: "imp",
                class: "d-none d-sm-table-cell text-right",
                render: $.fn.dataTable.render.number(',', '.', 2, ''),
                // visible: true,
                width: 35
            },
            {
                targets: 8,
                data: "cpm",
                class: "d-none d-sm-table-cell text-right",
                render: $.fn.dataTable.render.number(',', '.', 2, '$'),
                // visible: true,
                width: 35
            },
            {
                targets: 9,
                data: "status",
                class: "d-none d-sm-table-cell text-right",
                // visible: true,
                width: 80
            },
            {
                targets: 10,
                data: "effExp",
                class: "d-none d-sm-table-cell text-right",
                // visible: true,
                width: 85
            },
            {
                targets: 11,
                width: 80,
                data: "reviseDt",
                class: "d-none d-sm-table-cell text-right",
                //   visible: true,
                render: function (d) {
                    return "<span style='display:none;'>" + d + "</span>" + moment(d).format("MM/DD/YYYY hh:mm A");
                }
            },
            {
                targets: 12,
                width: 80,
                data: "startTimeFormatted",
                class: "d-none d-sm-table-cell text-center",
                visible: false
            },
            {
                targets: 13,
                width: 80,
                data: "endTimeFormatted",
                class: "d-none d-sm-table-cell text-center",
                visible: false
            },
            {
                targets: 14,
                width: 30,
                //data: "buyTypeDescription",
                data: "spBuy",
                class: "d-none d-sm-table-cell text-right",
                //  visible: true
            },
            {
                targets: 15,
                width: 25,
                //data: "buyTypeDescription",
                data: "buyTypeCode",
                class: "d-none d-sm-table-cell text-right",
                //  visible: true
            }
        ],
        fixedColumns: true,
        createdRow: function (row, data, dataIndex) {
            // if (dataIndex == 0 || dataIndex % 2 != 0) {
            //     $(row).addClass('even-row');
            // }
            // else { 
            //     $(row).addClass('odd-row');
            // }
            if (dataIndex == 0 || dataIndex % 2 == 0) {
                $($(row).find("td")[0]).css("background-color", "#FFFFFF");
                $($(row).find("td")[1]).css("background-color", "#FFFFFF");
                $($(row).find("td")[2]).css("background-color", "#FFFFFF");
                $($(row).find("td")[3]).css("background-color", "#FFFFFF");
                $($(row).find("td")[4]).css("background-color", "#FFFFFF");
                $($(row).find("td")[5]).css("background-color", "#FFFFFF");
                $($(row).find("td")[6]).css("background-color", "#FFFFFF");
                $($(row).find("td")[7]).css("background-color", "#FFFFFF");
                $($(row).find("td")[8]).css("background-color", "#FFFFFF");
                $($(row).find("td")[9]).css("background-color", "#FFFFFF");
                $($(row).find("td")[10]).css("background-color", "#FFFFFF");
                $($(row).find("td")[11]).css("background-color", "#FFFFFF");
                $($(row).find("td")[12]).css("background-color", "#FFFFFF");
                $($(row).find("td")[13]).css("background-color", "#FFFFFF");
            }
            else {
                $($(row).find("td")[0]).css("background-color", "#f9f9f9");
                $($(row).find("td")[1]).css("background-color", "#f9f9f9");
                $($(row).find("td")[2]).css("background-color", "#f9f9f9");
                $($(row).find("td")[3]).css("background-color", "#f9f9f9");
                $($(row).find("td")[4]).css("background-color", "#f9f9f9");
                $($(row).find("td")[5]).css("background-color", "#f9f9f9");
                $($(row).find("td")[6]).css("background-color", "#f9f9f9");
                $($(row).find("td")[7]).css("background-color", "#f9f9f9");
                $($(row).find("td")[8]).css("background-color", "#f9f9f9");
                $($(row).find("td")[9]).css("background-color", "#f9f9f9");
                $($(row).find("td")[10]).css("background-color", "#f9f9f9");
                $($(row).find("td")[11]).css("background-color", "#f9f9f9");
                $($(row).find("td")[12]).css("background-color", "#f9f9f9");
                $($(row).find("td")[13]).css("background-color", "#f9f9f9");
            }

            $($(row).find("td")[0]).width(21);
            $($(row).find("td")[1]).width(300);
            $($(row).find("td")[2]).width(100);
            $($(row).find("td")[3]).width(25);
            $($(row).find("td")[4]).width(35);
            $($(row).find("td")[5]).width(30);
            $($(row).find("td")[6]).width(80);
            $($(row).find("td")[7]).width(35);
            $($(row).find("td")[8]).width(35);
            $($(row).find("td")[9]).width(80);
            $($(row).find("td")[10]).width(85);
            $($(row).find("td")[11]).width(80);
            $($(row).find("td")[12]).width(30);
            $($(row).find("td")[13]).width(25);

            $($(row).find("td")[0]).css("padding-left", "5px")
            $($(row).find("td")[1]).css("padding-left", "5px")
            // $($(row).find("td")[2]).width(100);
            // $($(row).find("td")[3]).width(25);
            // $($(row).find("td")[4]).width(35);
            // $($(row).find("td")[5]).width(30);
            // $($(row).find("td")[6]).width(80);
            // $($(row).find("td")[7]).width(35);
            // $($(row).find("td")[8]).width(35);
            // $($(row).find("td")[9]).width(80);
            // $($(row).find("td")[10]).width(85);
            // $($(row).find("td")[11]).width(80);
            // $($(row).find("td")[12]).width(30);
            // $($(row).find("td")[13]).width(25);
        },
        initComplete: function () {
            PopulateStartTime();
            PopulateEndTime();
            PopulateDP();
            PopulateDays();
            PopulateLen();
            PopulateBuyType();
            PopulateStatus();
            setTimeout(function () {
                $($("#divAvailableProperties table th")[0]).width(0);
                $($("#divAvailableProperties table th")[1]).width(300);
                $($("#divAvailableProperties table th")[2]).width(100);
                $($("#divAvailableProperties table th")[3]).width(25);
                $($("#divAvailableProperties table th")[4]).width(35);
                $($("#divAvailableProperties table th")[5]).width(30);
                $($("#divAvailableProperties table th")[6]).width(80);
                $($("#divAvailableProperties table th")[7]).width(35);
                $($("#divAvailableProperties table th")[8]).width(35);
                $($("#divAvailableProperties table th")[9]).width(80);
                $($("#divAvailableProperties table th")[10]).width(85);
                $($("#divAvailableProperties table th")[11]).width(80);
                $($("#divAvailableProperties table th")[12]).width(30);
                $($("#divAvailableProperties table th")[13]).width(25);

                $($("#divAvailableProperties .dataTables_scrollBody th")[0]).width(0);
                $($("#divAvailableProperties .dataTables_scrollBody th")[1]).width(300);
                $($("#divAvailableProperties .dataTables_scrollBody th")[2]).width(100);
                $($("#divAvailableProperties .dataTables_scrollBody th")[3]).width(25);
                $($("#divAvailableProperties .dataTables_scrollBody th")[4]).width(35);
                $($("#divAvailableProperties .dataTables_scrollBody th")[5]).width(30);
                $($("#divAvailableProperties .dataTables_scrollBody th")[6]).width(80);
                $($("#divAvailableProperties .dataTables_scrollBody th")[7]).width(35);
                $($("#divAvailableProperties .dataTables_scrollBody th")[8]).width(35);
                $($("#divAvailableProperties .dataTables_scrollBody th")[9]).width(80);
                $($("#divAvailableProperties .dataTables_scrollBody th")[10]).width(85);
                $($("#divAvailableProperties .dataTables_scrollBody th")[11]).width(80);
                $($("#divAvailableProperties .dataTables_scrollBody th")[12]).width(30);
                $($("#divAvailableProperties .dataTables_scrollBody th")[13]).width(25);

                $("#divAvailableProperties .dataTables_scrollHeadInner th").css("padding-left", "5px");
                $("#divAvailableProperties .dataTables_scrollBody th").css("padding-left", "5px");




                $("#divAvailableProperties .dataTables_scrollBody").css("overflow-x", "hidden");
                $(".AddNewPropertyTable_filter").css("margin-right", "22px");
                if (!initialLoadDone) {
                    initialLoadDone = true;
                    ResetPropData(1);
                }
            }, 100);
        }
    });

    // Filter event handler
    $(addnewpropertytable.table().container()).on('change', '#ddlStartTime', function () {
        table
            .column($(this).data('index'))
            .search(this.value)
            .draw();
    });

    $('#AddNewPropertyTable tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {

        }
    });

    $('#AddNewPropertyTable').on('click', 'tbody input.editor-active', function () {
        console.log('delegated click event'); // it is never shown
        cb = $(this).prop('checked');
        console.log(cb)
    });

}

function PopulateDemoNames(_NetworkId) {
    var procemessage = "<option value='0'> Please wait...</option>";
    $("#ddlDemoName").html(procemessage).show();
    var url = "/ScheduleProposal/GetDemoNamesForAddProperty";

    $.ajax({
        url: url,
        data: {
            NetworkId: _NetworkId,
            ClientId: $("#hdnAddNewPropClientId").val(),
            QuarterId: $("#hdnAddNewPropQuarterId").val(),
            ScheduleProposalId: $("#hdnAddNewPropScheduleId").val()
        },
        cache: false,
        type: "POST",
        success: function (result) {
            var markup = "";
            if (result.success) {
                markup = "<option value='-1'>Please select ...</option>";
                for (var x = 0; x < result.data.length; x++) {
                    markup += "<option value='" + result.data[x].demoNamesId + "'>" + result.data[x].description + "</option>";
                }
            }
            else {
                markup = "<option value='0'>No demos found</option>";
            }
            $("#ddlDemoName").html(markup).show();
            $("#ddlDemoName").removeAttr('disabled');
        },
        error: function (response) {
            swal('Ooops ...', 'Error Populating Demo Names:  ' + response, 'error');
        }
    });
}

// This is actually never used and is loaded when the Model is loaded but I'm keeping this here in case later
// We don't refresh the entire page after a property has been added.
function PopulateNetworks() {
    var procemessage = "<option value='0'> Please wait...</option>";
    $("#val-select2-network").html(procemessage).show();
    var url = "/ScheduleProposal/GetNetworksForProposal";

    $.ajax({
        url: url,
        data: {
            ClientId: $("#hdnAddNewPropClientId").val(),
            QuarterId: $("#hdnAddNewPropQuarterId").val(),
            ProposalId: $("#hdnAddNewPropScheduleId").val(),
            CountryId: $("#hdnAddNewPropCountryId").val()
        },
        cache: false,
        type: "POST",
        success: function (result) {
            var markup = "";
            if (result.length == 0) {
                if (MyCountryId == 5) {
                    markup = "<option value='0'>No network assigned (US)</option>";
                }
                else {
                    markup = "<option value='0'>No network assigned (CA)</option>";
                }
            }
            else {
                markup = "<option></option>";
                for (var x = 0; x < result.length; x++) {
                    markup += "<option value='" + result[x].value + "'>" + result[x].text + "</option>";
                }
            }
            $("#val-select2-network").html(markup).show();
        },
        error: function (response) {
            swal('Ooops ...', 'Error Populating Networks:  ' + response, 'error');
        }
    });
}

function Toggle() {
    var div = document.getElementById("divChild");
    if (div.style.display === "none") {
        $("#divToggleCtrl").html("Less filters")
        div.style.display = "";
    } else {
        div.style.display = "none";
        $("#divToggleCtrl").html("More filters")
    }
}
function CloseAddNewPropModal() {
    $("#properties-select-all").prop("checked", false);
    $('#btnAdd').attr('disabled', 'disabled');
    $('#btnSplitAddChildProperties').attr('disabled', 'disabled');
    $("#modal-addnewpropertyProposal #ddlNetworks").val("");
    PopulateDemoNames($("#modal-addnewpropertyProposal #ddlNetworks").val());
    PopulateAvailableProperties();
    if ($("#divToggleCtrl").html().indexOf("Less") > -1) {
        Toggle();
    }
}
function OpenChildPropertyModal() {   
    
    checkedData = [];
    var hasZero15Split = false;
    $("#childPropertiesBody").html("");
    $("#DuplicatePropertyErrHdn").hide();
    var table = $("#AddNewPropertyTable").DataTable();    
    table.rows().every(function () {
        var data = this.data();
        var rowNode = this.node();
        if ($(rowNode).find('input[type="checkbox"]').prop('checked')) {
            if (data.spotLen == 15 && data.rateAmt == 0 && data.splitId == 3) {
                hasZero15Split = true;
            }
            else {
                checkedData.push(data);
            }
        }
    });
    if (hasZero15Split) {
        swal("", "Child properties cannot be created for a $0 split", "info");
    }
    if (checkedData.length == checkedData.filter(o => o.spotLen == 15 && o.rateAmt == 0 && o.splitId == 3).length) {
        return false;
    }
    $('#modal-addnewpropertyProposal').modal("hide");
    var html = "";
    for (var i = 0; i < checkedData.length; i++) {
        html += "<tr role='row' id='row_" + checkedData[i].rateId + "' data-rate-id=" + checkedData[i].rateId + " data-index-tr=" + i + ">";
        html += "<td class='d-none d-sm-table-cell text-left' id='propertyName_" + i + "' style='width:400px;'>";
        html += checkedData[i].propertyName;
        html += "<span style='float:right' class='child-prop-cross-icon' onclick='return DeleteChildPropertyLine(" + checkedData[i].rateId + ");'> <i class='fa fa-trash' aria-hidden='true'></i></span>";
        html += "</td>";
        html += "<td id='tdStartTime_" + i + "' style='width:140px;'>";      
        html += "<input class='cls-start-end-time-dropdown' id='startTime_" + i + "' value='" + moment(checkedData[i].startTimeFormatted, "hh:mm").format("hh:mm A") + "' onfocusout='return OnChangeTime(this," + i + ");'>";        
        html += "</td>";
        html += "<td id='tdEndTime_" + i + "' style='width:140px;'>";       
        html += "<input class='cls-start-end-time-dropdown' id='endTime_" + i + "' value='" + moment(checkedData[i].endTimeFormatted, "hh:mm").format("hh:mm A") + "' onfocusout='return OnChangeTime(this," + i + ");'>";  
        html += "</td>";
        html += "<td id='tdDOW_" + i + "' class='dow' style='width:180px;'>";      
        html += "<div class='dropdown' data-control='checkbox-dropdown'>";
        html += "<label id='addNewPropddlLabel' class='dropdown-label' style='width:160px;'>" + checkedData[i].days + "</label>";
        html += "<div id='ddlDOW_" + i + "' class='dropdown-list'>";
        html += "</div>";
        html += "</div>";
        html += "</td>";
        html += "<td class='d-none d-sm-table-cell text-right' style='width:50px;'>";
        html += checkedData[i].spotLen;
        html += "</td>";
        html += "<td class='d-none d-sm-table-cell text-right' style='width:110px;'>";
        html += (Number(checkedData[i].rateAmt)).toLocaleString('en-US', { style: 'currency', currency: 'USD', });
        html += "</td>";
        html += "<td class='d-none d-sm-table-cell text-right' style='width:110px;'>";
        html += Number(checkedData[i].imp).toFixed(2);
        html += "</td>";
        html += "<td class='d-none d-sm-table-cell text-right' style='width:110px;padding-right:15px;'>";
        html += (Number(checkedData[i].cpm)).toLocaleString('en-US', { style: 'currency', currency: 'USD', });
        html += "</td>";
        html += "</tr>";            
    }
  
    $("#childPropertiesBody").html(html);   
    arrays = {};
    for (var i = 0; i < checkedData.length; i++) {
        (function (i) {
        arrays['startTimeArray' + i] = [];
        arrays['endTimeArray' + i] = [];        
        var startTime = moment(checkedData[i].startTimeFormatted, "HH:mm A");
        var endTime = moment(checkedData[i].endTimeFormatted, "HH:mm A");

        if (endTime.isBefore(startTime)) {
            endTime.add(1, 'days');
        }

        for (var m = moment(startTime); m.isSameOrBefore(endTime); m.add(30, "minutes")) {
            arrays['startTimeArray' + i].push(m.format("hh:mm A"));            
            arrays['endTimeArray' + i].push(m.format("hh:mm A"));           
        }
        $("#startTime_" + i).autoComplete({
            minChars: 0,
            source: function (term, suggest) {
                term = term.toLowerCase();
                var suggestions = [];
                for (var j = 0; j < arrays['startTimeArray' + i].length - 1; j++) {
                    if (~arrays['startTimeArray' + i][j].toLowerCase().indexOf(term)) suggestions.push(arrays['startTimeArray' + i][j]);
                }
                suggest(suggestions);
            },            
        });
        $("#endTime_" + i).autoComplete({
            minChars: 0,
            source: function (term, suggest) {
                term = term.toLowerCase();
                var suggestions = [];
                for (var j = 1; j < arrays['endTimeArray' + i].length; j++) {
                    if (~arrays['endTimeArray' + i][j].toLowerCase().indexOf(term)) suggestions.push(arrays['endTimeArray' + i][j]);
                }
                suggest(suggestions);
            },           
        });
        })(i);
        $("#ddlDOW_" + i).html(GenerateDaysRangeDropdown(checkedData[i]));       
    }
    if ($("#properties-select-all").prop("checked")) {
        $("#childPropertiesBody").css("position", "relative");
    }
    $('#modal_AddCustomizeProperty').modal("show");
    setTimeout(function () {
        checkUncheckMultiSelectDropdown("addNewProp"); 
        setTimeout(function () {
            $("#childPropertiesBody .dropdown-label").on("click", function () {
                $(window).scrollTop(0);
                var clickedCtrlLeft = $(this).offset().left;
                var clickedCtrlTop = $(this).offset().top;
                var ddlLeft = $(this).offset().left - $("#modal_AddCustomizeProperty .modal-content").offset().left;
                var tdTop = $(this).closest("td").offset().top;
                var ddltop = 0;
                if ($(this).offset().top > tdTop) {
                    ddltop = tdTop;
                }
                else {
                    ddltop = $(this).offset().top;
                }
                
                $(this).closest("td").find(".dropdown-list").css("left", ddlLeft);
                $(this).closest("td").find(".dropdown-list").css("top", ddltop);
                if ($(this).closest("td").find(".dropdown-list").offset().top > $(this).closest("td").offset().top) {
                    $(this).closest("td").find(".dropdown-list").css("top", $(this).closest("td").offset().top+5);
                }
            });
        }, 1000);
    }, 1000);
    $("#btnAddChildProperties").attr("disabled", false);
   
}

function ResetValue(ctrl) { 
    $(ctrl).val("");
}
function GenerateDaysRangeDropdown(data) {  
    var days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    var markup = "";   
    var markupAll = "";
    var daysCount = 0;
    
    days.forEach(function (day, x) {     
        var dayAlias = day == "thursday" || day == "sunday" ? day.charAt(0).toUpperCase() + day.charAt(1).toLowerCase() : day.charAt(0).toUpperCase();
        if (data[day]) {
            daysCount++;            
            markup += '<label class="dropdown-option"><input type="checkbox" id="addChildProp' + x + '" class="btg-inputs" checked data-toggle="check-all" name="dropdown-group" onclick="return clearError(\'' + data.rateId + '\');" value=' + dayAlias + ' /><div style="margin-top: -24px;margin-left: 18px;">' + dayAlias + '</div></label>';
        }
        else {
            markup += '<label class="dropdown-option"><input type="checkbox" id="addChildProp' + x + '" class="btg-inputs" disabled data-toggle="check-all" name="dropdown-group" onclick="return clearError(\'' + data.rateId + '\');" value=' + dayAlias + ' /><div style="margin-top: -24px;margin-left: 18px;">' + dayAlias + '</div></label>';
        }      
    });
    if (daysCount < 7) {
        markupAll = '<label class="dropdown-option"><input id="addChildPropAll_' + data.rateId + '" type="checkbox" class="btg-inputs" disabled data-toggle="check-all" name="dropdown-group"  value="-1" onclick="return clearError(\'' + data.rateId + '\');"/><div style="margin-top: -24px;margin-left: 18px;"> All</div></label>'
    }
    else {
        markupAll = '<label class="dropdown-option"><input id="addChildPropAll_' + data.rateId + '" type="checkbox" class="btg-inputs" data-toggle="check-all" name="dropdown-group"  value="-1" onclick="return clearError(\'' + data.rateId + '\');"/><div style="margin-top: -24px;margin-left: 18px;"> All</div></label>'
    }
    markup = markupAll + markup;
    return markup;
}

function OnChangeTime(time, i) {    
    $("#propertyName_" + i).css("color", "#575757");
    var isAnyRed = false;
    $("[id^='propertyName_']").each(function() {
        if ($(this).css("color") == "rgb(210, 43, 43)") { 
            isAnyRed = true;
            return false; 
        }
    });
    if (!isAnyRed) {
        $("#DuplicatePropertyErrHdn").hide();
        $("#btnAddChildProperties").attr("disabled", false);
    }
    AutoFillTime(time, i);    
}

function AutoFillTime(TimeTextBox, i) {
    if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:0a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:00a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12: a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:0 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0000'
    ) {
        $(TimeTextBox).val('12:00 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:3a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:30a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:3 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:30 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0030'
    ) {
        $(TimeTextBox).val('12:30 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase().toLowerCase() == '1a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:0a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:00a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1: a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:0 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0100'
    ) {
        $(TimeTextBox).val('01:00 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:3a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:30a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:3 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:30 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0130'
    ) {
        $(TimeTextBox).val('01:30 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:0a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:00a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2: a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:0 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0200'
    ) {
        $(TimeTextBox).val('02:00 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:3a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:30a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:3 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:30 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0230'
    ) {
        $(TimeTextBox).val('02:30 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:0a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:00a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3: a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:0 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0300'
    ) {
        $(TimeTextBox).val('03:00 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:3a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:30a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:3 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:30 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0330'
    ) {
        $(TimeTextBox).val('03:30 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:0a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:00a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4: a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:0 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0400'
    ) {
        $(TimeTextBox).val('04:00 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:3a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:30a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:3 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:30 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0430'
    ) {
        $(TimeTextBox).val('04:30 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:0a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:00a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5: a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:0 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0500'
    ) {
        $(TimeTextBox).val('05:00 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:3a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:30a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:3 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:30 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0530'
    ) {
        $(TimeTextBox).val('05:30 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:0a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:00a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6: a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:0 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0600'
    ) {
        $(TimeTextBox).val('06:00 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:3a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:30a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:3 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:30 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0630'
    ) {
        $(TimeTextBox).val('06:30 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:0a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:00a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7: a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:0 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0700'
    ) {
        $(TimeTextBox).val('07:00 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:3a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:30a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:3 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:30 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0730'
    ) {
        $(TimeTextBox).val('07:30 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:0a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:00a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8: a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:0 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0800'
    ) {
        $(TimeTextBox).val('08:00 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:3a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:30a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:3 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:30 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0830'
    ) {
        $(TimeTextBox).val('08:30 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:0a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:00a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9: a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:0 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0900'
    ) {
        $(TimeTextBox).val('09:00 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:3a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:30a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:3 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:30 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0930'
    ) {
        $(TimeTextBox).val('09:30 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:0a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:00a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10: a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:0 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1000'
    ) {
        $(TimeTextBox).val('10:00 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:3a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:30a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:3 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:30 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1030'
    ) {
        $(TimeTextBox).val('10:30 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:0a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:00a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11: a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:0 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1100'
    ) {
        $(TimeTextBox).val('11:00 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:3a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:30a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:3 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:30 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1130'
    ) {
        $(TimeTextBox).val('11:30 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:0p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:00p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12: p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:0 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1200'
    ) {
        $(TimeTextBox).val('12:00 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:3p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:30p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:3 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:30 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1230'
    ) {
        $(TimeTextBox).val('12:30 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:0p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:00p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1: p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:0 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1300'
    ) {
        $(TimeTextBox).val('01:00 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:3p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:30p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:3 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:30 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1330'
    ) {
        $(TimeTextBox).val('01:30 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:0p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:00p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2: p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:0 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1400'
    ) {
        $(TimeTextBox).val('02:00 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:3p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:30p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:3 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:30 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1430'
    ) {
        $(TimeTextBox).val('02:30 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:0p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:00p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3: p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:0 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1500'
    ) {
        $(TimeTextBox).val('03:00 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:3p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:30p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:3 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:30 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1530'
    ) {
        $(TimeTextBox).val('03:30 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:0p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:00p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4: p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:0 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1600'
    ) {
        $(TimeTextBox).val('04:00 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:3p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:30p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:3 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:30 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1630'
    ) {
        $(TimeTextBox).val('04:30 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:0p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:00p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5: p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:0 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1700'
    ) {
        $(TimeTextBox).val('05:00 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:3p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:30p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:3 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:30 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1730'
    ) {
        $(TimeTextBox).val('05:30 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:0p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:00p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6: p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:0 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1800'
    ) {
        $(TimeTextBox).val('06:00 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:3p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:30p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:3 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:30 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1830'
    ) {
        $(TimeTextBox).val('06:30 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:0p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:00p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7: p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:0 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1900'
    ) {
        $(TimeTextBox).val('07:00 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:3p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:30p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:3 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:30 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1930'
    ) {
        $(TimeTextBox).val('07:30 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:0p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:00p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8: p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:0 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2000'
    ) {
        $(TimeTextBox).val('08:00 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:3p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:30p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:3 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:30 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2030'
    ) {
        $(TimeTextBox).val('08:30 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:0p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:00p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9: p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:0 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2100'
    ) {
        $(TimeTextBox).val('09:00 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:3p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:30p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:3 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:30 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2130'
    ) {
        $(TimeTextBox).val('09:30 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:0p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:00p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10: p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:0 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2200'
    ) {
        $(TimeTextBox).val('10:00 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:3p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:30p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:3 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:30 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2230'
    ) {
        $(TimeTextBox).val('10:30 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:0p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:00p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11: p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:0 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2300'
    ) {
        $(TimeTextBox).val('11:00 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:3p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:30p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:3 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:30 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2330'
    ) {
        $(TimeTextBox).val('11:30 PM');
    }
    const timeRange = arrays[`startTimeArray${i}`];
    const [startRange, endRange] = [timeRange[0], timeRange[timeRange.length - 1]];
    arrays['timeRange' + i] = [];
    var st = moment(startRange, "HH:mm A");
    var et = moment(endRange, "HH:mm A");

    if (et.isBefore(st)) {
        et.add(1, 'days');
    }
    for (var m = moment(st); m.isSameOrBefore(et); m.add(1, "minutes")) {
        arrays['timeRange' + i].push(m.format("hh:mm A"));       
    }
    const givenRange = arrays[`timeRange${i}`];
    const startTimeId = $(TimeTextBox).attr("id").replace("end", "start");
    const endTimeId = $(TimeTextBox).attr("id").replace("start", "end");

    let [strtInputVal, endInputVal] = [
        moment($("#" + startTimeId).val(), "hh:mm A").format("hh:mm A"),
        moment($("#" + endTimeId).val(), "hh:mm A").format("hh:mm A")
    ];

    if (strtInputVal === 'Invalid date' && endInputVal === 'Invalid date') {
        return;
    }

    const savedtime = $(TimeTextBox).attr("id").toLowerCase().startsWith("start") ? startRange : endRange;
    const editedtime = $(TimeTextBox).attr("id").toLowerCase().startsWith("start") ? strtInputVal : endInputVal;

    const showError = (message) => {
        swal({
            html: message,
            type: 'warning',
        });
        $(TimeTextBox).val("");
    }

    if (givenRange.indexOf(editedtime) !== -1) {
        strtInputVal = moment(strtInputVal, "hh:mm A");
        endInputVal = moment(endInputVal, "hh:mm A");
        if (endInputVal.format("A") == "AM" && strtInputVal.format("A") !== "AM") {
            endInputVal.add(1, 'days');
        }
        if (strtInputVal !== endInputVal && strtInputVal < endInputVal && endInputVal > strtInputVal) {
            const color = savedtime === editedtime ? "#575757" : "#2971B9";
            $(TimeTextBox).css("color", color);
            return;
        }
        else if (strtInputVal.isSame(endInputVal) || strtInputVal.isAfter(endInputVal) || endInputVal.isBefore(strtInputVal)) {
            showError("You have selected an invalid start/end time combination. Please try again.");
            return;
        }        
    }
    else {
        showError(`Please enter a time between ${startRange} and ${endRange}`);
        return;
    }
}

function clearError(i) {
    var index = $("#row_" + i).attr("data-index-tr");
    $("#propertyName_" + index).css("color", "#575757");
    var isAnyRed = false;
    $("[id^='propertyName_']").each(function () {
        if ($(this).css("color") == "rgb(210, 43, 43)") {
            isAnyRed = true;
            return false;
        }
    });
    if (!isAnyRed) {
        $("#DuplicatePropertyErrHdn").hide();
        $("#btnAddChildProperties").attr("disabled", false);
    }  
}
var containsInvalidPropertyLine = false;
function ProcessChildProperties(i) {
    if (i == 0) {
        containsInvalidPropertyLine = false;
        finalDataForSave = [];
    }
    $("#btnAddChildProperties").attr("disabled", true);  
   
    var isValidProp = true;
    var isUnique = true;

    checkedDataForSave = jQuery.extend(true, {}, checkedData[i]);
    //$($($("#childPropertiesBody tr")[i]).find(".cls-start-end-time-dropdown")[0]).val()
    //var startTimeField = $("#startTime_" + i).val();
    //var endTimeField = $("#endTime_" + i).val();
    var startTimeField = $($($("#childPropertiesBody tr")[i]).find(".cls-start-end-time-dropdown")[0]).val();
    var endTimeField = $($($("#childPropertiesBody tr")[i]).find(".cls-start-end-time-dropdown")[1]).val();
    checkedDataForSave.startTimeFormatted = startTimeField;
    checkedDataForSave.endTimeFormatted = endTimeField;

    var dowField = "";
    checkedDataForSave.monday = false;
    checkedDataForSave.tuesday = false;
    checkedDataForSave.wednesday = false;
    checkedDataForSave.thursday = false;
    checkedDataForSave.friday = false;
    checkedDataForSave.saturday = false;
    checkedDataForSave.sunday = false;
    //$("#ddlDOW_" + i + " input[type=checkbox]:checked").each(function () {
    $($($("#childPropertiesBody tr")[i]).find(".dropdown-list")[0]).find(" input[type=checkbox]:checked").each(function () {
        var checkboxText = $(this).attr('value');
        dowField += checkboxText;
        switch (checkboxText) {
            case "M":
                checkedDataForSave.monday = true;
                break;
            case "T":
                checkedDataForSave.tuesday = true;
                break;
            case "W":
                checkedDataForSave.wednesday = true;
                break;
            case "Th":
                checkedDataForSave.thursday = true;
                break;
            case "F":
                checkedDataForSave.friday = true;
                break;
            case "S":
                checkedDataForSave.saturday = true;
                break;
            case "Su":
                checkedDataForSave.sunday = true;
                break;
        }
    });

    if (startTimeField == "" || endTimeField == "" || dowField == "") {
        isValidProp = false;
    }
    var currentDate = new Date();
    var formattedDate = currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1).toString().padStart(2, '0') + "-" + currentDate.getDate().toString().padStart(2, '0');
    if (startTimeField != "" && endTimeField != "" && dowField != "") {
        if (new Date(formattedDate + " " + checkedDataForSave.startTimeFormatted).getTime() == new Date(formattedDate + " " + checkedData[i].startTime).getTime()
            && new Date(formattedDate + " " + checkedDataForSave.endTimeFormatted).getTime() == new Date(formattedDate + " " + checkedData[i].endTime).getTime()
            && checkedDataForSave.monday == checkedData[i].monday
            && checkedDataForSave.tuesday == checkedData[i].tuesday
            && checkedDataForSave.wednesday == checkedData[i].wednesday
            && checkedDataForSave.thursday == checkedData[i].thursday
            && checkedDataForSave.friday == checkedData[i].friday
            && checkedDataForSave.saturday == checkedData[i].saturday
            && checkedDataForSave.sunday == checkedData[i].sunday
        ) {
            $("#propertyName_" + i).css("color", "#D22B2B");
            $("#DuplicatePropertyErrHdn").show();
            isValidProp = false;
            containsInvalidPropertyLine = true;
        }
        else {
            $("#propertyName_" + i).css("color", "#575757");
            isValidProp = true;
            containsInvalidPropertyLine = false;
        }
    }
    if (!isValidProp) {
        if (i < checkedData.length - 1) {            
            ProcessChildProperties(parseInt(i) + 1);
        }
        else {
            if (!containsInvalidPropertyLine && isUnique && finalDataForSave.length > 0) {
                AddChildProperties(0);
            }
        }
    }
    else {

        $.ajax({
            url: '/ScheduleProposal/CheckChildPropertiesUniqueness',
            type: 'POST',
            data: {
                "PropertyModel": checkedDataForSave
            },
            cache: false,
            success: function (response) {
                if (!response.success || response.responseCode !== 0) {
                    isUnique = false;                  
                    var rid = checkedDataForSave.rateId;
                    $($("#row_" + rid + " td")[0]).css("color", "#D22B2B");
                    $("#DuplicatePropertyErrHdn").show();
                    $("#btnAddChildProperties").attr("disabled", true);
                    if (i < checkedData.length - 1) {
                        containsInvalidPropertyLine = true;
                        ProcessChildProperties(parseInt(i) + 1);
                    }
                }
                else {
                    var obj = jQuery.extend(true, {}, checkedDataForSave);
                    finalDataForSave.push(obj);
                    if (i < checkedData.length - 1) {
                        containsInvalidPropertyLine = false;
                        ProcessChildProperties(parseInt(i) + 1);
                    }
                    else {
                        if (!containsInvalidPropertyLine && isUnique && finalDataForSave.length > 0) {
                            AddChildProperties(0);
                        }
                    }
                }                
            },
            error: function (error) {
                swal('Error!', error.responseText, 'error');
            }
        });
       
    }
    
}

function AddChildProperties(index) {

    $.ajax({
        url: '/ScheduleProposal/AddChildProperties',
        type: 'POST',
        data: {
            "PropertyModel": finalDataForSave[index],
            "ProposalId": _UniqueId
        },
        cache: false,
        success: function (response) {
            if (index < finalDataForSave.length - 1) {
                AddChildProperties(parseInt(index) + 1);
            }
            else {
                window.location.reload();
            }
        },
        error: function (error) {
            swal('Error!', error.responseText, 'error');
        }
    });

}

$(document).on("click", function (e) {
    if (e.target.id == "btnSplitAddChildProperties" || e.target.className == "fa fa-angle-down") {
        $(".childPropertySplit-DropdownContent").toggle();
    }
    else {
        $(".childPropertySplit-DropdownContent").hide();
    }
});
function ResetPropData(scheduleTypeId) {
    initialLoad = true;
    if (scheduleTypeId == 1) {
        setTimeout(function () { PopulateAvailableProperties(); }, 1000);
    }
}
function ClearAndBack() {  
    var oTable = $('#AddNewPropertyTable').DataTable();
    var propertyRowsChecked = oTable.$(".editor-active:checked", { "page": "all" });
    if (checkedData.length == 0) {      
        propertyRowsChecked.each(function (index, elem) {
            if ($(elem).is(':checked')) {                
                $(elem).prop('checked', false);
            }
        });
        $('#btnAdd').attr('disabled', 'disabled');
        $('#btnSplitAddChildProperties').attr('disabled', 'disabled');
    }
    if (checkedData.length > 0) {
        var rateIdMap = {};
        checkedData.forEach(function (item) {
            rateIdMap[item.rateId] = true;
        });
        propertyRowsChecked.each(function (index, elem) {
            if ($(elem).is(':checked')) {
                var currentRow_rateId = $(elem).attr('id');
                if (!rateIdMap[currentRow_rateId]) {
                    $(elem).prop('checked', false);
                }
            }
        });
    }    
    $('#modal_AddCustomizeProperty').modal('hide');        
    $('#modal-addnewpropertyProposal').modal('show');    
}
function CancelChildProperties() {
    $("#btnAddPropProposalClose").click();
    setTimeout(function () {
        $('#modal_AddCustomizeProperty').modal('hide');
    }, 500);
}

function DeleteChildPropertyLine(id) {
    var index = checkedData.findIndex(item => item.rateId === id);
    if (index !== -1) {
        checkedData.splice(index, 1);
    }
    $("#row_" + id).remove();
    
    var isAnyRed = false;
    $("[id^='propertyName_']").each(function () {
        if ($(this).css("color") == "rgb(210, 43, 43)") {
            isAnyRed = true;
            return false;
        }
    });
    if (isAnyRed || $("#childPropertiesBody tr").length ==0) {
        $("#btnAddChildProperties").attr("disabled", true);
    }
    else {
        $("#DuplicatePropertyErrHdn").hide();
        $("#btnAddChildProperties").attr("disabled", false);
    }
}

