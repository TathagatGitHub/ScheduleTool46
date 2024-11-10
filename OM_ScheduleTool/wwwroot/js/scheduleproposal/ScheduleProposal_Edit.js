var _Initialize = 1;
var _ReloadTotal = 0;
var _LoadRow = 0;
var dropdownjson;//ST-460
var _UniqueId = getParameterByName('ProposalId');
if (!_UniqueId || parseInt(_UniqueId) === 0) {
    _UniqueId = getParameterByName('ScheduleId');
}
var _GrossIncomeReady = false;
var _selNetworkNames = '';

// These 4 are used to determine which GI is shown on the summary.  I try to keep usage of ths within
// this file and _CalculatorEditTable but there will be checks on _CalculatorEditTable so we don't 
// needlessly crash.
var _Show15 = false;
var _Show30 = false;
var _Show60 = false;
var _Show120 = false;
var editActualizeMode = false;

var proptable = null;
var sortColumnDirection = "asc";
var editProposal = window.location.pathname.split('/')[2] == "EditProposal" ? true : false;
function toggleEditActualizeMode() {

    editActualizeMode = !editActualizeMode;

    if (editActualizeMode) {
        $("#btnEditActualized").text("Exit Edit Actualized");
    }
    else {
        $("#btnEditActualized").text("Edit Actualized");
    }

    if (proptable == null) {

        initProposalTable();
    }
    else {
        proptable.ajax.reload();
    }
}

function cbDropdown(column) {
    if (column[0].innerText == 'Property Name') {
        return $('<input type="textbox" class="clsPropertyName" style="width:390px" id="txtPropertyName" /> <ul class="cb-dropdown">').appendTo($('<div>', {
            'class': 'cb-dropdown-wrap'
        }).appendTo(column));
    }
    else {
        return $('<ul>', {
            'class': 'cb-dropdown'
        }).appendTo($('<div>', {
            'class': 'cb-dropdown-wrap'
        }).appendTo(column));
    }
}

function GetChar(event, that, wk, wkno) {
    //console.log(that.id);

    var row = $(that).closest('tr');
    if (proptable == null) {
        initProposalTable();
    }
    var wkNo = that.id.split('_');
    var suffix = wkNo[0].match(/\d+/);
    if (event.keyCode == 39) {
        var screenSize = $(window).width();
        //window.scrollTo(0, window.scrollX);
        if (suffix[0] <= 14) {
            var spotNo = Number(suffix[0]) + 1;
            if (spotNo < 10) {
                $('input#wk0' + spotNo + '_' + wkNo[1]).focus();                    
            }
            else {
                $('input#wk' + spotNo + '_' + wkNo[1]).focus();                
            }           

            if ((screenSize <= 1905 && spotNo > 1) || (screenSize > 1905 && screenSize < 2385 && spotNo > 2) || (screenSize >= 2540 && spotNo > 5) || (screenSize < 2540 && screenSize >= 2385 && spotNo > 4)) {
                $('.dataTables_scrollBody').scrollLeft($('.dataTables_scrollBody').scrollLeft() + 120);
            }
            if (screenSize <= 2385 && spotNo >= 13) {
                window.scrollTo(75, window.scrollX);
            }
            else {
                window.scrollTo(0, window.scrollX);
            }
            
        }
    }
    if (event.keyCode == 37) {
       
        if (suffix[0] > 1) {
            var spotNo = Number(suffix[0]) - 1;
            if (spotNo < 10) {
                $('input#wk0' + spotNo + '_' + wkNo[1]).focus();
                if (spotNo < 9) {
                    if (spotNo == 1) {
                        $('.dataTables_scrollBody').scrollLeft(0);                        
                    }
                    else {
                        $('.dataTables_scrollBody').scrollLeft($('.dataTables_scrollBody').scrollLeft() - 120);                       
                    }       
                }                        
            }
            else {
                $('input#wk' + spotNo + '_' + wkNo[1]).focus();                
            }
        }
        window.scrollTo(0, window.scrollX);
    }
    if (event.shiftKey && event.keyCode == 9) {
        window.scrollTo(0, window.scrollX);
        var spotNo = Number(suffix[0]) - 1;       
        if (spotNo < 9) {
            if (spotNo == 1) {
                $('.dataTables_scrollBody').scrollLeft(0);                
            }
            else {
                $('.dataTables_scrollBody').scrollLeft($('.dataTables_scrollBody').scrollLeft() - 150);                
            }
        }    
    }
    if (!event.shiftKey && event.keyCode == 9) {
        var screenSize = $(window).width();
        var spotNo = Number(suffix[0]) - 1;         
        //if ((screenSize <= 1905 && spotNo > 1 && suffix[0] < 13) || (screenSize > 1905 && screenSize < 2385 && spotNo > 2 && suffix[0] < 13) || (screenSize >= 2540 && spotNo > 5 && suffix[0] < 13) || (screenSize < 2540 && screenSize >= 2385 && spotNo > 4 && suffix[0] < 13)) {
        //    $('.dataTables_scrollBody').scrollLeft($('.dataTables_scrollBody').scrollLeft() + 150);
        //}      
        if (spotNo >= 3 && spotNo < 7) {           
            $('.dataTables_scrollBody').scrollLeft($('.dataTables_scrollBody').scrollLeft() + 60);
        }  
        if (spotNo >= 7 && spotNo < 13) {
            $('.dataTables_scrollBody').scrollLeft($('.dataTables_scrollBody').scrollLeft() + 120);
        }
        if (spotNo == 12 || spotNo == 13) {
            $('.dataTables_scrollBody').scrollLeft(0);
        }
        window.scrollTo(0, window.scrollX);       
    }   

    try {
        // UP
        if (event.keyCode == 38 && event.ctrlKey) {
            that.value = parseInt(that.value) + 1;
            OnWeeklySpotChange(that, wk, wkno);
        }
        // DOWN
        else if (event.keyCode == 40 && event.ctrlKey) {
            if (parseInt(that.value) > 0) {
                that.value = parseInt(that.value) - 1;
                OnWeeklySpotChange(that, wk, wkno);
            }
        }
        // Move UP a Cell
        else if (event.keyCode == 38) {
            if (row[0]._DT_RowIndex > 0) {
                var data = proptable.row(row[0]._DT_RowIndex - 1).data();
                $("#" + that.id.slice(0, 5) + data.scheduleLineId).focus();
            }
        }
        // Move Down a cell
        else if (event.keyCode == 40) {
            var rowCounts = proptable.data().rows().count();
            if (row[0]._DT_RowIndex < rowCounts - 1) {
                var data = proptable.row(row[0]._DT_RowIndex + 1).data();
                $("#" + that.id.slice(0, 5) + data.scheduleLineId).focus();
            }
        }
    }
    catch (err) {
        var notify = $.notify(err.message, {
            type: 'danger',
            allow_dismiss: true,
        });
    }
}


function GrossIncomeReady(ready) {
    _GrossIncomeReady = ready;
    if (ready == true) {
        if (popupGrossIncome) {
            CalculateTotals($("#MyProposalTable").DataTable());
        }
    }
}

function LoadReloadDropdownFilters(settings) {
    if (dropdownjson == null || dropdownjson == undefined || dropdownjson.language > 0) { //ST-460
        $.ajax({
            type: 'POST',
            url: '/ScheduleProposal/GetProposalDataForDropdowns',
            data: {
                ProposalId: _UniqueId,
                DiscountRate: parseFloat($("#DiscountPrice").find(":selected").text().replace('%', '')),
                ViewOnly: true,
                PageNum: 0,
                PageLength: 6000,
                ShowTotals: false,
                CalledForDropDown: true,//ST-724
                FilterForEdit: true//ST-724
            },
            datatype: 'json',
            success: function (data) {
                dropdownjson = data.data;//ST-460, Added
                //ReloadAll(settings, data.data);//ST-460 Commeneted
                ReloadAll(settings, dropdownjson);//ST-460, Modified
            },
            error: function () {

            }
        });
    }
    else {//ST-460 Added
        ReloadAll(settings, dropdownjson);
    }
}

function initProposalTable() {
    Codebase.blocks('#ProposalTableDiv', 'state_loading');
    if ($.fn.dataTable.isDataTable('#MyProposalTable'))
        proptable = $('#MyProposalTable').DataTable();
    else {
        proptable = $('#MyProposalTable').DataTable({           
            lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
            dom: 'ifrt',
            ajax: {
                url: '/ScheduleProposal/GetProposalData',
                type: 'POST',
                data: function (d) {
                    d.proposalId = _UniqueId,
                        d.discountRate = parseFloat($("#DiscountPrice").find(":selected").text().replace('%', '')),
                        d.ViewOnly = false,
                        d.pageNum = $("#CurPage").val(),
                        d.pageLength = 200,
                        d.showTotals = false,
                        d.isPremiereFilter = $("#hdnPremiereFilter").val() == "1" ? true : false//ST-807
                }
            },
            paging: true,
            searching: true,
            info: true,
            processing: true,
            language: {
                processing: "<i class='fa fa-refresh fa-.block'></i>"
            },
            serverSide: true,
            deferRender: true,
            stateSave: true,
            destroy: true,
            //autoWidth: false,
            infoCallback: function (settings, start, end, max, total, pre) {
                var table = $('#MyProposalTable').dataTable();

                if (total == max) {
                    return 'Showing ' + 1 + ' to ' + table.fnGetData().length + ' of ' + total;
                }
                else {
                    return 'Showing ' + 1 + ' to ' + table.fnGetData().length + ' of ' + total + ' records (filtered from ' + max + ' records)';
                }
            },
            stateSaveCallback: function (settings, data) {
                if (editProposal) {
                    $("#btnUndoWeeklySpotChange").attr('disabled', 'disabled');
                    for (var i = 0; i <= WeeklySpot.length - 1; i++) {
                        index = WeeklySpot.length - 1 - i;
                        id = WeeklySpot[index].split('||')[0]
                        if ($("#" + id)[0] != undefined) {
                            $("#btnUndoWeeklySpotChange").removeAttr('disabled');
                        }
                    }
                }
                if (_LoadRow == 1) {
                    _LoadRow = 0;
                    return false;
                }
                if (_Initialize == 0) {
                    LoadReloadDropdownFilters(settings);
                    _Initialize = 1;
                }
                var dtStoreKey = 'DataTables_' + window.location.pathname + '_' + _UniqueId;
                localStorage.setItem(dtStoreKey, JSON.stringify(data))
                SaveFilterState(dtStoreKey, settings, data);
                var table = $('#MyProposalTable').DataTable();
                //if (table) {
                //if (_ReloadTotal == 1) {//ST-460 Commented
                //    ReloadTotals();
                //}
                // CalculateTotals(table);

                var selectedNewtworks = table.column(7).data().unique();
                if (selectedNewtworks.length == 1)
                    CalculateUE(table);
                else {
                    $("#TotalScheduleAvailableUE").html('N/A').show();
                    $("#TotalScheduleBookedUE").html('N/A').show();
                    $("#AvailableUESaved").html('N/A').show();
                    $("#BookedUESaved").html('N/A').show();
                }
                if (data.order != null) {
                    sortColumnDirection = data.order[0][1];
                }
                //}
                // ShowHideGIBySpotLen();
            },
            stateLoadCallback: function (settings, data) {
                if (_Initialize == 0) {
                    LoadReloadDropdownFilters(settings);
                    _Initialize = 1;
                }
                var dtStoreKey = 'DataTables_' + window.location.pathname + '_' + _UniqueId;
                var jsondata = JSON.parse(localStorage.getItem(dtStoreKey));
                SaveFilterState(dtStoreKey, settings, jsondata);
                //ReloadTotals();
                return jsondata;
            },
            ordering: true,
            columnDefs: [
                { orderable: false, targets: '_all' }
                /*  { "width": "225px", "targets": 7 },*/
                /*      { width: '335px', targets: 8 },*/
            ],          
            stateDuration: 60 * 60 * 24 * 365,
            fixedHeader: true,  
            //select: {
            //    style: 'os',
            //    selector: 'td:first-child',
            //    blurable: true
            //},   
            columns: [
                {
                    targets: 0,
                    data: null,
                    defaultContent: '',
                    className: 'select-checkbox',
                    searchable: false,
                    orderable: false,
                },
                {
                    targets: 1,
                    data: "approvedDesc",
                    class: "d-none d-sm-table-cell text-center",
                    visible: false,
                    render: function (data, type, row, meta) {
                        if (data === "Approved") {
                            return "<i class='fa fa-check'></i>";
                        }
                        else {
                            return "<i class='fa fa-times'></i>";
                        }
                    },
                    orderable: true
                },
                {
                    targets: 2,
                    data: "doNotBuyTypeDescription",
                    visible: false,
                    class: "d-none d-sm-table-cell text-center"
                },
                {
                    targets: 3,
                    data: null,
                    defaultContent: '',
                    className: '',
                    visible: false,
                    searchable: false,
                    orderable: false,
                },
                {
                    targets: 4,
                    data: null,
                    defaultContent: '',
                    className: '',
                    visible: false,
                    searchable: false,
                    orderable: false,
                },
                {
                    targets: 5,
                    data: "demoUniverse",
                    visible: false,
                    class: "d-none d-sm-table-cell text-left"
                },
                {
                    targets: 6,
                    data: "demoName",
                    class: "col-6-DemoName d-none d-sm-table-cell text-center",
                    render: $.fn.dataTable.render.ellipsis(33, true)
                },
                {
                    targets: 7,
                    data: "networkName",
                    class: "col-7-NetworkName d-none d-sm-table-cell text-center",
                    render: $.fn.dataTable.render.ellipsis(33, true)
                },
                {
                    targets: 8,
                    data: "propertyName",
                    class: "col-8-PropName d-none d-sm-table-cell text-left",
                    render: $.fn.dataTable.render.ellipsis(39, true)
                    //render: function (data, type, row) {
                    //        return "<span style='width:350px'>" + data + "</span>";
                    //}
                },
                {
                    targets: 9,
                    data: "effectiveDate",
                    class: "d-none d-sm-table-cell text-left",
                    visible: false,
                    render: function (d) {
                        return moment(d).format("MM/DD/YYYY");
                    }
                },
                {
                    targets: 10,
                    data: "expirationDate",
                    class: "d-none d-sm-table-cell text-center",
                    visible: false,
                    render: function (d) {
                        return moment(d).format("MM/DD/YYYY");
                    }

                },
                {
                    targets: 11,
                    data: "dow",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (data, type, row, meta) {
                        var dow = "";
                            if (row.monday == true) {
                                dow += "M";
                            } else { dow += "-"; }
                            if (row.tuesday == true) {
                                dow += "T";
                            } else { dow += "-"; }
                            if (row.wednesday == true) {
                                dow += "W";
                            } else { dow += "-"; }
                            if (row.thursday == true) {
                                dow += "Th";
                            } else { dow += "-"; }
                            if (row.friday == true) {
                                dow += "F";
                            } else { dow += "-"; }
                            if (row.saturday == true) {
                                dow += "Sa";
                            } else { dow += "-"; }
                            if (row.sunday == true) {
                                dow += "Su";
                            } else { dow += "-"; }

                            return dow;                       
                    }
                },
                {
                    targets: 12,
                    data: "tuesday",
                    class: "d-none d-sm-table-cell text-center",
                    visible: false,
                    render: function (data, type, row, meta) {
                        if (data === true) {
                            return "<i class='fa fa-circle'></i>";
                        }
                        else {
                            return "";
                        }
                    }
                },
                {
                    targets: 13,
                    data: "wednesday",
                    visible: false,
                    class: "d-none d-sm-table-cell text-center",
                    render: function (data, type, row, meta) {
                        if (data === true) {
                            return "<i class='fa fa-circle'></i>";
                        }
                        else {
                            return "";
                        }
                    }
                },
                {
                    targets: 14,
                    data: "thursday",
                    visible: false,
                    class: "d-none d-sm-table-cell text-center",
                    render: function (data, type, row, meta) {
                        if (data === true) {
                            return "<i class='fa fa-circle'></i>";
                        }
                        else {
                            return "";
                        }
                    }
                },
                {
                    targets: 15,
                    data: "friday",
                    visible: false,
                    class: "d-none d-sm-table-cell text-center",
                    render: function (data, type, row, meta) {
                        if (data === true) {
                            return "<i class='fa fa-circle'></i>";
                        }
                        else {
                            return "";
                        }
                    }
                },
                {
                    targets: 16,
                    data: "saturday",
                    visible: false,
                    class: "d-none d-sm-table-cell text-center",
                    render: function (data, type, row, meta) {
                        if (data === true) {
                            return "<i class='fa fa-circle'></i>";
                        }
                        else {
                            return "";
                        }
                    }
                },
                {
                    targets: 17,
                    data: "sunday",
                    visible: false,
                    class: "d-none d-sm-table-cell text-center",
                    render: function (data, type, row, meta) {
                        if (data === true) {
                            return "<i class='fa fa-circle'></i>";
                        }
                        else {
                            return "";
                        }
                    }
                },
                {
                    targets: 18,
                    data: "dayPartCd",
                    class: "d-none d-sm-table-cell text-center"
                },
                {
                    targets: 19,
                    data: "startToEndTime",
                    class: "d-none d-sm-table-cell text-center"
                },
                {
                    targets: 20,
                    data: "omdp",
                    class: "d-none d-sm-table-cell text-center",
                    visible: true
                },
                {
                    targets: 21,
                    data: "spBuy",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (data, type, row, meta) {
                        if (data === "True") {
                            return "<span>SP</span>";
                        }
                        else if (data === "False") {
                            return "";
                        }
                    }
                },
                {
                    targets: 22,
                    data: "spotLen",
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
                    targets: 23,
                    data: "buyTypeCode",
                    class: "d-none d-sm-table-cell text-center"
                },
                {
                    targets: 24,
                    data: "rateAmt",
                    class: "d-none d-sm-table-cell text-left",
                    render: $.fn.dataTable.render.number(',', '.', 2, '$')
                },
                {
                    targets: 25,
                    data: "discount", /* Discount Rate */
                    class: "col-25-Discount d-none d-sm-table-cell text-left",
                    //visible: false,
                    render: $.fn.dataTable.render.number(',', '.', 2, '$')
                },
                {
                    targets: 26,
                    data: "usdRate", /* USD Rate */
                    class: "d-none d-sm-table-cell text-left",
                    visible: $('th.HeaderUSD').attr('CountryId') == 2 ? true :false,
                    render: $.fn.dataTable.render.number(',', '.', 2, '$')
                },
                {
                    targets: 27, /* CPM */
                    data: "cpm",
                    class: "d-none d-sm-table-cell text-left",
                    render: $.fn.dataTable.render.number(',', '.', 2, '$')

                },
                {
                    targets: 28,
                    data: "impressions",
                    class: ".col-28-Impressions d-none d-sm-table-cell text-left",
                    render: $.fn.dataTable.render.number(',', '.', 2, '')
                },                
                {
                    targets: 29,
                    data: "rateRevision",
                    class: "d-none d-sm-table-cell text-center"
                },
                {
                    targets: 30,
                    data: "rateUpdateDt",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (d) {
                        return moment(d).format("MM/DD");
                    }
                },
                {
                    targets: 31,
                    data: "totalSpots",
                    class: "d-none d-sm-table-cell text-center",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('id', 'totalSpots_' + rowData.scheduleLineId);
                    }
                },
                {
                    targets: 32,
                    data: "wk01_Spots",
                    class: "d-none d-sm-table-cell text-center table-secondary",
                    width: "75px",
                    render: function (data, type, row, meta) {

                        //console.log("wk01_Spots");
                        //console.log(meta.settings.aoColumns[30].sTitle);

                        if (new Date(row.effectiveDate) <= new Date(meta.settings.aoColumns[32].sTitle) &&
                            new Date(row.expirationDate) >= new Date(meta.settings.aoColumns[32].sTitle) &&
                            (editActualizeMode == true ? row.wk01_Locked == true : row.wk01_Locked == false)) {
                            if (data == 0)
                                return  "<input onkeydown='javascript:GetChar(event, this, \"wk01_\", \"01\");' onchange='javascript:OnWeeklySpotChange(this, \"wk01_\", \"01\");' onfocus='" + (editProposal == true ? 'javascript:OnWeeklySpotFocus(this);' : '') +"' style='text-align:center;min-width:113px!important' type='text' id='wk01_" + row.scheduleLineId + "' name='wk01_" + row.scheduleLineId + "' size='10' value=''>";
                            else
                                return  "<input onkeydown='javascript:GetChar(event, this, \"wk01_\", \"01\");' onchange='javascript:OnWeeklySpotChange(this, \"wk01_\", \"01\");' onfocus='" + (editProposal == true ? 'javascript:OnWeeklySpotFocus(this);' : '') +"' style='text-align:center;min-width:113px!important' type='text' id='wk01_" + row.scheduleLineId + "' name='wk01_" + row.scheduleLineId + "' size='10' value='" + data + "'>";
                        }
                        else {
                            if (data == 0)
                                //return '';
                                return "<input style='text-align:center;max-width:113px!important' disabled value=''>";
                            else
                                return "<input style='text-align:center;max-width:113px!important' disabled value='" + data + "'>";
                        }
                    }
                },
                {
                    targets: 33,
                    data: "wk02_Spots",
                    width: "75px",
                    class: "d-none d-sm-table-cell text-center table-secondary",
                    render: function (data, type, row, meta) {
                        if (new Date(row.effectiveDate) <= new Date(meta.settings.aoColumns[33].sTitle) &&
                            new Date(row.expirationDate) >= new Date(meta.settings.aoColumns[33].sTitle) &&
                            (editActualizeMode == true ? row.wk02_Locked == true : row.wk02_Locked == false)) {
                            if (data == 0)
                                return "<input onkeydown='javascript:GetChar(event, this, \"wk02_\", \"02\");' onchange='javascript:OnWeeklySpotChange(this, \"wk02_\", \"02\");' onfocus='" + (editProposal == true ?'javascript:OnWeeklySpotFocus(this);' : '')+"'  style='text-align:center;min-width:113px!important' type='text' id='wk02_" + row.scheduleLineId + "' name='wk02_" + row.scheduleLineId + "' size='10' value=''>";
                            else
                                return "<input onkeydown='javascript:GetChar(event, this, \"wk02_\", \"02\");' onchange='javascript:OnWeeklySpotChange(this, \"wk02_\", \"02\");' onfocus='" + (editProposal == true ? 'javascript:OnWeeklySpotFocus(this);' : '')+"' style='text-align:center;min-width:113px!important' type='text' id='wk02_" + row.scheduleLineId + "' name='wk02_" + row.scheduleLineId + "' size='10' value='" + data + "'>";
                        }
                        else {
                            if (data == 0)
                                return "<input style='text-align:center;max-width:113px!important' disabled value=''>";
                            else
                                return "<input style='text-align:center;max-width:113px!important' disabled value='" + data + "'>";
                        }
                    }

                },
                {
                    targets: 34,
                    data: "wk03_Spots",
                    width: "75px",
                    class: "d-none d-sm-table-cell text-center table-secondary",
                    render: function (data, type, row, meta) {
                        if (new Date(row.effectiveDate) <= new Date(meta.settings.aoColumns[34].sTitle) &&
                            new Date(row.expirationDate) >= new Date(meta.settings.aoColumns[34].sTitle) &&
                            (editActualizeMode == true ? row.wk03_Locked == true : row.wk03_Locked == false)) {
                            if (data == 0)
                                return "<input onkeydown='javascript:GetChar(event, this, \"wk03_\", \"03\");' onchange='javascript:OnWeeklySpotChange(this, \"wk03_\", \"03\");' onfocus='" + (editProposal == true ? 'javascript:OnWeeklySpotFocus(this);' : '') +"' style='text-align:center;min-width:113px!important' type='text' id='wk03_" + row.scheduleLineId + "' name='wk03_" + row.scheduleLineId + "' size='10' value=''>";
                            else
                                return "<input onkeydown='javascript:GetChar(event, this, \"wk03_\", \"03\");' onchange='javascript:OnWeeklySpotChange(this, \"wk03_\", \"03\");' onfocus='" + (editProposal == true ? 'javascript:OnWeeklySpotFocus(this);' : '') +"' style='text-align:center;min-width:113px!important' type='text' id='wk03_" + row.scheduleLineId + "' name='wk03_" + row.scheduleLineId + "' size='10' value='" + data + "'>";
                        }
                        else {
                            if (data == 0)
                                return "<input style='text-align:center;max-width:113px!important' disabled value=''>";
                            else
                                return "<input style='text-align:center;max-width:113px!important' disabled value='" + data + "'>";
                        }
                    }
                },
                {
                    targets: 35,
                    data: "wk04_Spots",
                    width: "75px",
                    class: "d-none d-sm-table-cell text-center table-secondary",
                    render: function (data, type, row, meta) {
                        if (new Date(row.effectiveDate) <= new Date(meta.settings.aoColumns[35].sTitle) &&
                            new Date(row.expirationDate) >= new Date(meta.settings.aoColumns[35].sTitle) &&
                            (editActualizeMode == true ? row.wk04_Locked == true : row.wk04_Locked == false)) {
                            if (data == 0)
                                return "<input onkeydown='javascript:GetChar(event, this, \"wk04_\", \"04\");' onchange='javascript:OnWeeklySpotChange(this, \"wk04_\", \"04\");' onfocus='" + (editProposal == true ? 'javascript:OnWeeklySpotFocus(this);' : '') +"' style='text-align:center;min-width:113px!important' type='text' id='wk04_" + row.scheduleLineId + "' name='wk04_" + row.scheduleLineId + "' size='10' value=''>";
                            else
                                return "<input onkeydown='javascript:GetChar(event, this, \"wk04_\", \"04\");' onchange='javascript:OnWeeklySpotChange(this, \"wk04_\", \"04\");' onfocus='" + (editProposal == true ? 'javascript:OnWeeklySpotFocus(this);' : '') +"' style='text-align:center;min-width:113px!important' type='text' id='wk04_" + row.scheduleLineId + "' name='wk04_" + row.scheduleLineId + "' size='10' value='" + data + "'>";
                        }
                        else {
                            if (data == 0)
                                return "<input style='text-align:center;max-width:113px!important' disabled value=''>";
                            else
                                return "<input style='text-align:center;max-width:113px!important' disabled value='" + data + "'>";
                        }
                    }
                },
                {
                    targets: 36,
                    data: "wk05_Spots",
                    width: "75px",
                    class: "d-none d-sm-table-cell text-center table-secondary",
                    render: function (data, type, row, meta) {
                        if (new Date(row.effectiveDate) <= new Date(meta.settings.aoColumns[36].sTitle) &&
                            new Date(row.expirationDate) >= new Date(meta.settings.aoColumns[36].sTitle) &&
                            (editActualizeMode == true ? row.wk05_Locked == true : row.wk05_Locked == false)) {
                            if (data == 0)
                                return "<input onkeydown='javascript:GetChar(event, this, \"wk05_\", \"05\");' onchange='javascript:OnWeeklySpotChange(this, \"wk05_\", \"05\");' onfocus='" + (editProposal == true ? 'javascript:OnWeeklySpotFocus(this);' : '') +"' style='text-align:center;min-width:113px!important' type='text' id='wk05_" + row.scheduleLineId + "' name='wk05_" + row.scheduleLineId + "' size='10' value=''>";
                            else
                                return "<input onkeydown='javascript:GetChar(event, this, \"wk05_\", \"05\");' onchange='javascript:OnWeeklySpotChange(this, \"wk05_\", \"05\");' onfocus='" + (editProposal == true ? 'javascript:OnWeeklySpotFocus(this);' : '') +"' style='text-align:center;min-width:113px!important' type='text' id='wk05_" + row.scheduleLineId + "' name='wk05_" + row.scheduleLineId + "' size='10' value='" + data + "'>";
                        }
                        else {
                            if (data == 0)
                                return "<input style='text-align:center;max-width:113px!important' disabled value=''>";
                            else
                                return "<input style='text-align:center;max-width:113px!important' disabled value='" + data + "'>";
                        }
                    }
                },
                {
                    targets: 37,
                    data: "wk06_Spots",
                    width: "75px",
                    class: "d-none d-sm-table-cell text-center table-secondary",
                    render: function (data, type, row, meta) {
                        if (new Date(row.effectiveDate) <= new Date(meta.settings.aoColumns[37].sTitle) &&
                            new Date(row.expirationDate) >= new Date(meta.settings.aoColumns[37].sTitle) &&
                            (editActualizeMode == true ? row.wk06_Locked == true : row.wk06_Locked == false)) {
                            if (data == 0)
                                return "<input onkeydown='javascript:GetChar(event, this, \"wk06_\", \"06\");' onchange='javascript:OnWeeklySpotChange(this, \"wk06_\", \"06\");' onfocus='" + (editProposal == true ? 'javascript:OnWeeklySpotFocus(this);' : '') +"' style='text-align:center;min-width:113px!important' type='text' id='wk06_" + row.scheduleLineId + "' name='wk06_" + row.scheduleLineId + "' size='10' value=''>";
                            else
                                return "<input onkeydown='javascript:GetChar(event, this, \"wk06_\", \"06\");' onchange='javascript:OnWeeklySpotChange(this, \"wk06_\", \"06\");' onfocus='" + (editProposal == true ? 'javascript:OnWeeklySpotFocus(this);' : '') +"' style='text-align:center;min-width:113px!important' type='text' id='wk06_" + row.scheduleLineId + "' name='wk06_" + row.scheduleLineId + "' size='10' value='" + data + "'>";
                        }
                        else {
                            if (data == 0)
                                return "<input style='text-align:center;max-width:113px!important' disabled value=''>";
                            else
                                return "<input style='text-align:center;max-width:113px!important' disabled value='" + data + "'>";
                        }
                    }
                },
                {
                    targets: 38,
                    data: "wk07_Spots",
                    width: "75px",
                    class: "d-none d-sm-table-cell text-center table-secondary",
                    render: function (data, type, row, meta) {
                        if (new Date(row.effectiveDate) <= new Date(meta.settings.aoColumns[38].sTitle) &&
                            new Date(row.expirationDate) >= new Date(meta.settings.aoColumns[38].sTitle) &&
                            (editActualizeMode == true ? row.wk07_Locked == true : row.wk07_Locked == false)) {
                            if (data == 0)
                                return "<input onkeydown='javascript:GetChar(event, this, \"wk07_\", \"07\");' onchange='javascript:OnWeeklySpotChange(this, \"wk07_\", \"07\");' onfocus='" + (editProposal == true ? 'javascript:OnWeeklySpotFocus(this);' : '') +"' style='text-align:center;min-width:113px!important' type='text' id='wk07_" + row.scheduleLineId + "' name='wk07_" + row.scheduleLineId + "' size='10' value=''>";
                            else
                                return "<input onkeydown='javascript:GetChar(event, this, \"wk07_\", \"07\");' onchange='javascript:OnWeeklySpotChange(this, \"wk07_\", \"07\");' onfocus='" + (editProposal == true ? 'javascript:OnWeeklySpotFocus(this);' : '') +"' style='text-align:center;min-width:113px!important' type='text' id='wk07_" + row.scheduleLineId + "' name='wk07_" + row.scheduleLineId + "' size='10' value='" + data + "'>";
                        }
                        else {
                            if (data == 0)
                                return "<input style='text-align:center;max-width:113px!important' disabled value=''>";
                            else
                                return "<input style='text-align:center;max-width:113px!important' disabled value='" + data + "'>";
                        }
                    }
                },
                {
                    targets: 39,
                    data: "wk08_Spots",
                    width: "75px",
                    class: "d-none d-sm-table-cell text-center table-secondary",
                    render: function (data, type, row, meta) {
                        if (new Date(row.effectiveDate) <= new Date(meta.settings.aoColumns[39].sTitle) &&
                            new Date(row.expirationDate) >= new Date(meta.settings.aoColumns[39].sTitle) &&
                            (editActualizeMode == true ? row.wk08_Locked == true : row.wk08_Locked == false)) {
                            if (data == 0)
                                return "<input onkeydown='javascript:GetChar(event, this, \"wk08_\", \"08\");' onchange='javascript:OnWeeklySpotChange(this, \"wk08_\", \"08\");' onfocus='" + (editProposal == true ? 'javascript:OnWeeklySpotFocus(this);' : '') +"' style='text-align:center;min-width:113px!important' type='text' id='wk08_" + row.scheduleLineId + "' name='wk08_" + row.scheduleLineId + "' size='10' value=''>";
                            else
                                return "<input onkeydown='javascript:GetChar(event, this, \"wk08_\", \"08\");' onchange='javascript:OnWeeklySpotChange(this, \"wk08_\", \"08\");' onfocus='" + (editProposal == true ? 'javascript:OnWeeklySpotFocus(this);' : '') +"' style='text-align:center;min-width:113px!important' type='text' id='wk08_" + row.scheduleLineId + "' name='wk08_" + row.scheduleLineId + "' size='10' value='" + data + "'>";
                        }
                        else {
                            if (data == 0)
                                return "<input style='text-align:center;max-width:113px!important' disabled value=''>";
                            else
                                return "<input style='text-align:center;max-width:113px!important' disabled value='" + data + "'>";
                        }
                    }
                },
                {
                    targets: 40,
                    data: "wk09_Spots",
                    width: "75px",
                    class: "d-none d-sm-table-cell text-center table-secondary",
                    render: function (data, type, row, meta) {
                        if (new Date(row.effectiveDate) <= new Date(meta.settings.aoColumns[40].sTitle) &&
                            new Date(row.expirationDate) >= new Date(meta.settings.aoColumns[40].sTitle) &&
                            (editActualizeMode == true ? row.wk09_Locked == true : row.wk09_Locked == false)) {
                            if (data == 0)
                                return "<input onkeydown='javascript:GetChar(event, this, \"wk09_\", \"09\");' onchange='javascript:OnWeeklySpotChange(this, \"wk09_\", \"09\");' onfocus='" + (editProposal == true ? 'javascript:OnWeeklySpotFocus(this);' : '') +"' style='text-align:center;min-width:113px!important' type='text' id='wk09_" + row.scheduleLineId + "' name='wk09_" + row.scheduleLineId + "' size='10' value=''>";
                            else
                                return "<input onkeydown='javascript:GetChar(event, this, \"wk09_\", \"09\");' onchange='javascript:OnWeeklySpotChange(this, \"wk09_\", \"09\");' onfocus='" + (editProposal == true ? 'javascript:OnWeeklySpotFocus(this);' : '') +"' style='text-align:center;min-width:113px!important' type='text' id='wk09_" + row.scheduleLineId + "' name='wk09_" + row.scheduleLineId + "' size='10' value='" + data + "'>";
                        }
                        else {
                            if (data == 0)
                                return "<input style='text-align:center;max-width:113px!important' disabled value=''>";
                            else
                                return "<input style='text-align:center;max-width:113px!important' disabled value='" + data + "'>";
                        }
                    }
                },
                {
                    targets: 41,
                    data: "wk10_Spots",
                    width: "75px",
                    class: "d-none d-sm-table-cell text-center table-secondary",
                    render: function (data, type, row, meta) {
                        if (new Date(row.effectiveDate) <= new Date(meta.settings.aoColumns[41].sTitle) &&
                            new Date(row.expirationDate) >= new Date(meta.settings.aoColumns[41].sTitle) &&
                            (editActualizeMode == true ? row.wk10_Locked == true : row.wk10_Locked == false)) {
                            if (data == 0)
                                return "<input onkeydown='javascript:GetChar(event, this, \"wk10_\", \"10\");' onchange='javascript:OnWeeklySpotChange(this, \"wk10_\", \"10\");' onfocus='" + (editProposal == true ? 'javascript:OnWeeklySpotFocus(this);' : '') +"' style='text-align:center;min-width:113px!important' type='text' id='wk10_" + row.scheduleLineId + "' name='wk10_" + row.scheduleLineId + "' size='10' value=''>";
                            else
                                return "<input onkeydown='javascript:GetChar(event, this, \"wk10_\", \"10\");' onchange='javascript:OnWeeklySpotChange(this, \"wk10_\", \"10\");' onfocus='" + (editProposal == true ? 'javascript:OnWeeklySpotFocus(this);' : '') +"' style='text-align:center;min-width:113px!important' type='text' id='wk10_" + row.scheduleLineId + "' name='wk10_" + row.scheduleLineId + "' size='10' value='" + data + "'>";
                        }
                        else {
                            if (data == 0)
                                return "<input style='text-align:center;max-width:113px!important' disabled value=''>";
                            else
                                return "<input style='text-align:center;max-width:113px!important' disabled value='" + data + "'>";
                        }
                    }
                },
                {
                    targets: 42,
                    data: "wk11_Spots",
                    width: "75px",
                    class: "d-none d-sm-table-cell text-center table-secondary",
                    render: function (data, type, row, meta) {
                        if (new Date(row.effectiveDate) <= new Date(meta.settings.aoColumns[42].sTitle) &&
                            new Date(row.expirationDate) >= new Date(meta.settings.aoColumns[42].sTitle) &&
                            (editActualizeMode == true ? row.wk11_Locked == true : row.wk11_Locked == false)) {
                            if (data == 0)
                                return "<input onkeydown='javascript:GetChar(event, this, \"wk11_\", \"11\");' onchange='javascript:OnWeeklySpotChange(this, \"wk11_\", \"11\");' onfocus='" + (editProposal == true ? 'javascript:OnWeeklySpotFocus(this);' : '') +"' style='text-align:center;min-width:113px!important' type='text' id='wk11_" + row.scheduleLineId + "' name='wk11_" + row.scheduleLineId + "' size='10' value=''>";
                            else
                                return "<input onkeydown='javascript:GetChar(event, this, \"wk11_\", \"11\");' onchange='javascript:OnWeeklySpotChange(this, \"wk11_\", \"11\");' onfocus='" + (editProposal == true ? 'javascript:OnWeeklySpotFocus(this);' : '') +"' style='text-align:center;min-width:113px!important' type='text' id='wk11_" + row.scheduleLineId + "' name='wk11_" + row.scheduleLineId + "' size='10' value='" + data + "'>";
                        }
                        else {
                            if (data == 0)
                                return "<input style='text-align:center;max-width:113px!important' disabled value=''>";
                            else
                                return "<input style='text-align:center;max-width:113px!important' disabled value='" + data + "'>";
                        }
                    }
                },
                {
                    targets: 43,
                    data: "wk12_Spots",
                    width: "75px",
                    class: "d-none d-sm-table-cell text-center table-secondary",
                    render: function (data, type, row, meta) {
                        if (new Date(row.effectiveDate) <= new Date(meta.settings.aoColumns[43].sTitle) &&
                            new Date(row.expirationDate) >= new Date(meta.settings.aoColumns[43].sTitle) &&
                            (editActualizeMode == true ? row.wk12_Locked == true : row.wk12_Locked == false)) {
                            if (data == 0)
                                return "<input onkeydown='javascript:GetChar(event, this, \"wk12_\", \"12\");' onchange='javascript:OnWeeklySpotChange(this, \"wk12_\", \"12\");' onfocus='" + (editProposal == true ? 'javascript:OnWeeklySpotFocus(this);' : '') +"' style='text-align:center;min-width:113px!important' type='text' id='wk12_" + row.scheduleLineId + "' name='wk12_" + row.scheduleLineId + "' size='10' value=''>";
                            else
                                return "<input onkeydown='javascript:GetChar(event, this, \"wk12_\", \"12\");' onchange='javascript:OnWeeklySpotChange(this, \"wk12_\", \"12\");' onfocus='" + (editProposal == true ? 'javascript:OnWeeklySpotFocus(this);' : '') +"' style='text-align:center;min-width:113px!important' type='text' id='wk12_" + row.scheduleLineId + "' name='wk12_" + row.scheduleLineId + "' size='10' value='" + data + "'>";
                        }
                        else {
                            if (data == 0)
                                return "<input style='text-align:center;max-width:113px!important' disabled value=''>";
                            else
                                return "<input style='text-align:center;max-width:113px!important' disabled value='" + data + "'>";
                        }
                    }
                },
                {
                    targets: 44,
                    data: "wk13_Spots",
                    width: "75px",
                    class: "d-none d-sm-table-cell text-center table-secondary",
                    render: function (data, type, row, meta) {
                        if (new Date(row.effectiveDate) <= new Date(meta.settings.aoColumns[44].sTitle) &&
                            new Date(row.expirationDate) >= new Date(meta.settings.aoColumns[44].sTitle) &&
                            (editActualizeMode == true ? row.wk13_Locked == true : row.wk13_Locked == false)) {
                            if (data == 0)
                                return "<input onkeydown='javascript:GetChar(event, this, \"wk13_\", \"13\");' onchange='javascript:OnWeeklySpotChange(this, \"wk13_\", \"13\");' onfocus='" + (editProposal == true ? 'javascript:OnWeeklySpotFocus(this);' : '') +"' style='text-align:center;min-width:113px!important' type='text' id='wk13_" + row.scheduleLineId + "' name='wk13_" + row.scheduleLineId + "' size='10' value=''>";
                            else
                                return "<input onkeydown='javascript:GetChar(event, this, \"wk13_\", \"13\");' onchange='javascript:OnWeeklySpotChange(this, \"wk13_\", \"13\");' onfocus='" + (editProposal == true ? 'javascript:OnWeeklySpotFocus(this);' : '') +"' style='text-align:center;min-width:113px!important' type='text' id='wk13_" + row.scheduleLineId + "' name='wk13_" + row.scheduleLineId + "' size='10' value='" + data + "'>";
                        }
                        else {
                            if (data == 0)
                                return "<input style='text-align:center;max-width:113px!important' disabled value=''>";
                            else
                                return "<input style='text-align:center;max-width:113px!important' disabled value='" + data + "'>";
                        }
                    }
                },
                {
                    targets: 45,
                    data: "wk14_Spots",
                    width: "75px",
                    class: "d-none d-sm-table-cell text-center table-secondary",
                    render: function (data, type, row, meta) {

                        if (new Date(row.effectiveDate) <= new Date(meta.settings.aoColumns[45].sTitle) &&
                            new Date(row.expirationDate) >= new Date(meta.settings.aoColumns[45].sTitle) &&
                            (editActualizeMode == true ? row.wk14_Locked == true : row.wk14_Locked == false)) {
                            if (data == 0)
                                return "<input onkeydown='javascript:GetChar(event, this, \"wk14_\", \"14\");' onchange='javascript:OnWeeklySpotChange(this, \"wk14_\", \"14\");' onfocus='" + (editProposal == true ? 'javascript:OnWeeklySpotFocus(this);' : '') +"' style='text-align:center;min-width:113px!important' type='text' id='wk14_" + row.scheduleLineId + "' name='wk14_" + row.scheduleLineId + "' size='10' value=''>";
                            else
                                return "<input onkeydown='javascript:GetChar(event, this, \"wk14_\", \"14\");' onchange='javascript:OnWeeklySpotChange(this, \"wk14_\", \"14\");' onfocus='" + (editProposal == true ? 'javascript:OnWeeklySpotFocus(this);' : '') +"' style='text-align:center;min-width:113px!important' type='text' id='wk14_" + row.scheduleLineId + "' name='wk14_" + row.scheduleLineId + "' size='10' value='" + data + "'>";
                        }
                        else {
                            if (data == 0)
                                return "<input style='text-align:center;max-width:113px!important' disabled value=''>";
                            else
                                return "<input style='text-align:center;max-width:113px!important' disabled value='" + data + "'>";
                        }
                    }
                },

                {
                    targets: 46,
                    defaultContent:'',
                    render: function (data, type, row, meta) {
                        return "<input style='width:0px!important;border-right-style:hidden;border-left-style:hidden;border-top-style:hidden;border-bottom-style:hidden;background-color: white;max-height:0px;' disabled>";
                    }
                },
                {
                    targets: 47,
                    data: "scheduleLineId",
                    class: "d-none d-sm-table-cell text-center",
                    visible: false,
                }


            ],            
            drawCallback: function (settings) {                
                //$('#btn-example-load-more').hide();

                // If there is some more data
                //if($('#btn-example-load-more').is(':visible')){
                // Scroll to the "Load more" button
                //   $('html, body').animate({
                //      scrollTop: $('#btn-example-load-more').offset().top
                //   }, 1000);
                //}

                // Show or hide "Load more" button based on whether there is more data available
                // $('#btn-example-load-more').toggle(this.api().page.hasMore());
                // $('#btn-example-load-less').toggle(this.api().page.hasLess());
            },
            createdRow: function (row, data, dataIndex) {


                if (data.doNotBuyTypeId === 5) /* DO NOT BUY */ {
                    $(row).addClass('table-danger');
                }
                else if (data.doNotBuyTypeId === 2) /* BUY AT YOUR RISK */ {
                    $(row).addClass('table-info');
                }
                else if (data.doNotBuyTypeId === 3) /* CLIENT MANDATE */ {
                    $(row).addClass('table-success');
                }
                else if (data.doNotBuyTypeId === 4) /* CLIENT SPECIFIC */ {
                    $(row).addClass('table-warning');
                }
                else if (data.doNotBuyTypeId === 6) /* LOG ACTUAL */ {
                    $(row).addClass('table-primary');
                }
                else {
                    $(row).addClass('active');
                }

                if (data.approved == true) {
                    $(row).addClass('upfront-approved');
                }
                //ST-1185, Change the color if the DOW or Start and End Time has been changed
                if (data.isDowChanged) {
                    $($(row).find("td")[4]).css("color", "#2971B9!important");
                }
                if (data.isTimeChanged) {
                    $($(row).find("td")[6]).css("color", "#2971B9!important");
                }

                //if (data.doNotBuyTypeId != 2  data.doNotBuyTypeId != 3 || data.doNotBuyTypeId != 4 || data.doNotBuyTypeId != 5 || data.doNotBuyTypeId != 6) {
                //    $(row).addClass('active');
                //}


            },
            rowCallback: function (row, data) {                 
                var rowStart = 30;
                var hasUnsavedVal = false;                
                
                for (var idx = 0; idx < row.cells.length; idx++) {

                    /*Proposal Redesign - Added for "Totals" fixed colmns back-ground color for CANADA to remove H-Scroll columns overlay transperancy*/
                    if (row.cells[idx]._DT_CellIndex.column == 31) {
                        if ($('th.HeaderUSD').attr('CountryId') == 2) {
                            $(row.cells[idx]).addClass('dtBackgroundColor');                           
                        }
                    }
                    // COLINDEX_DEPENDENT 
                    if (row.cells[idx]._DT_CellIndex.column == 32) {
                        if (data.wk01_UpdateDt) {                            
                            row.cells[idx].style.color = 'red';
                            hasUnsavedVal = true;
                            var id = data.scheduleLineId.toString();
                            if (!weekCounts["wk01"]) {
                                weekCounts["wk01"] = 0;
                            }
                            if (ifIdIsSame.indexOf("wk01_" + id) == -1) {
                                weekCounts["wk01"]++;
                                ifIdIsSame.push("wk01_" + id);
                            } 
                            wk1 = true;                                                  
                        }                        
                    }
                    else if (row.cells[idx]._DT_CellIndex.column == 33) {
                        if (data.wk02_UpdateDt) {
                            row.cells[idx].style.color = 'red';
                            hasUnsavedVal = true;
                            var id = data.scheduleLineId.toString();
                            if (!weekCounts["wk02"]) {
                                weekCounts["wk02"] = 0;
                            }
                            if (ifIdIsSame.indexOf("wk02_" + id) == -1) {
                                weekCounts["wk02"]++;
                                ifIdIsSame.push("wk02_" + id);
                            } 
                            wk2 = true;
                        }                       
                    }
                    else if (row.cells[idx]._DT_CellIndex.column == 34) {
                        if (data.wk03_UpdateDt) {
                            row.cells[idx].style.color = 'red';
                            hasUnsavedVal = true;
                            var id = data.scheduleLineId.toString();
                            if (!weekCounts["wk03"]) {
                                weekCounts["wk03"] = 0;
                            }
                            if (ifIdIsSame.indexOf("wk03_" + id) == -1) {
                                weekCounts["wk03"]++;
                                ifIdIsSame.push("wk03_" + id);
                            }                            
                            wk3 = true;
                        }                        
                    }
                    else if (row.cells[idx]._DT_CellIndex.column == 35) {
                        if (data.wk04_UpdateDt) {
                            row.cells[idx].style.color = 'red';
                            hasUnsavedVal = true; 
                            var id = data.scheduleLineId.toString();
                            if (!weekCounts["wk04"]) {
                                weekCounts["wk04"] = 0;
                            }
                            if (ifIdIsSame.indexOf("wk04_" + id) == -1) {
                                weekCounts["wk04"]++;
                                ifIdIsSame.push("wk04_" + id);
                            }                            
                            wk4 = true;
                        }                       
                    }
                    else if (row.cells[idx]._DT_CellIndex.column == 36) {
                        if (data.wk05_UpdateDt) {
                            row.cells[idx].style.color = 'red';
                            hasUnsavedVal = true; 
                            var id = data.scheduleLineId.toString();
                            if (!weekCounts["wk05"]) {
                                weekCounts["wk05"] = 0;
                            }
                            if (ifIdIsSame.indexOf("wk05_" + id) == -1) {
                                weekCounts["wk05"]++;
                                ifIdIsSame.push("wk05_" + id);
                            }                       
                            wk5 = true;
                        }                        
                    }
                    else if (row.cells[idx]._DT_CellIndex.column == 37) {
                        if (data.wk06_UpdateDt) {
                            row.cells[idx].style.color = 'red';
                            hasUnsavedVal = true;
                            var id = data.scheduleLineId.toString();
                            if (!weekCounts["wk06"]) {
                                weekCounts["wk06"] = 0;
                            }
                            if (ifIdIsSame.indexOf("wk06_" + id) == -1) {
                                weekCounts["wk06"]++;
                                ifIdIsSame.push("wk06_" + id);
                            }                       
                            wk6 = true;
                        }                        
                    }
                    else if (row.cells[idx]._DT_CellIndex.column == 38) {
                        if (data.wk07_UpdateDt) {
                            row.cells[idx].style.color = 'red';
                            hasUnsavedVal = true;
                            var id = data.scheduleLineId.toString();
                            if (!weekCounts["wk07"]) {
                                weekCounts["wk07"] = 0;
                            }
                            if (ifIdIsSame.indexOf("wk07_" + id) == -1) {
                                weekCounts["wk07"]++;
                                ifIdIsSame.push("wk07_" + id);
                            }                       
                            wk7 = true;
                        }                        
                    }
                    else if (row.cells[idx]._DT_CellIndex.column == 39) {
                        if (data.wk08_UpdateDt) {
                            row.cells[idx].style.color = 'red';
                            hasUnsavedVal = true;
                            var id = data.scheduleLineId.toString();
                            if (!weekCounts["wk08"]) {
                                weekCounts["wk08"] = 0;
                            }
                            if (ifIdIsSame.indexOf("wk08_" + id) == -1) {
                                weekCounts["wk08"]++;
                                ifIdIsSame.push("wk08_" + id);
                            }                       
                            wk8 = true;
                        }                        
                    }
                    else if (row.cells[idx]._DT_CellIndex.column == 40) {
                        if (data.wk09_UpdateDt) {
                            row.cells[idx].style.color = 'red';
                            hasUnsavedVal = true;
                            var id = data.scheduleLineId.toString();
                            if (!weekCounts["wk09"]) {
                                weekCounts["wk09"] = 0;
                            }
                            if (ifIdIsSame.indexOf("wk09_" + id) == -1) {
                                weekCounts["wk09"]++;
                                ifIdIsSame.push("wk09_" + id);
                            }   
                            wk9 = true;                                                      
                        }                        
                    }
                    else if (row.cells[idx]._DT_CellIndex.column == 41) {
                        if (data.wk10_UpdateDt) {
                            row.cells[idx].style.color = 'red';
                            hasUnsavedVal = true;
                            var id = data.scheduleLineId.toString();
                            if (!weekCounts["wk10"]) {
                                weekCounts["wk10"] = 0;
                            }
                            if (ifIdIsSame.indexOf("wk11_" + id) == -1) {
                                weekCounts["wk10"]++;
                                ifIdIsSame.push("wk10_" + id);
                            }   
                            wk10 = true;                            
                        }                        
                    }
                    else if (row.cells[idx]._DT_CellIndex.column == 42) {
                        if (data.wk11_UpdateDt) {
                            row.cells[idx].style.color = 'red';
                            hasUnsavedVal = true;  
                            var id = data.scheduleLineId.toString();
                            if (!weekCounts["wk11"]) {
                                weekCounts["wk11"] = 0;
                            }
                            if (ifIdIsSame.indexOf("wk11_" + id) == -1) {
                                weekCounts["wk11"]++;
                                ifIdIsSame.push("wk11_" + id);
                            }   
                            wk11 = true;
                        }                       
                    }
                    else if (row.cells[idx]._DT_CellIndex.column == 43) {
                        if (data.wk12_UpdateDt) {
                            row.cells[idx].style.color = 'red';
                            hasUnsavedVal = true;
                            var id = data.scheduleLineId.toString();
                            if (!weekCounts["wk12"]) {
                                weekCounts["wk12"] = 0;
                            }
                            if (ifIdIsSame.indexOf("wk12_" + id) == -1) {
                                weekCounts["wk12"]++;
                                ifIdIsSame.push("wk12_" + id);
                            }   
                            wk12 = true;
                        }                        
                    }
                    else if (row.cells[idx]._DT_CellIndex.column == 44) {
                        if (data.wk13_UpdateDt) {
                            row.cells[idx].style.color = 'red';
                            hasUnsavedVal = true;
                            var id = data.scheduleLineId.toString();
                            if (!weekCounts["wk13"]) {
                                weekCounts["wk13"] = 0;
                            }
                            if (ifIdIsSame.indexOf("wk13_" + id) == -1) {
                                weekCounts["wk13"]++;
                                ifIdIsSame.push("wk13_" + id);
                            }   
                            wk13 = true;
                        }                      
                    }
                    else if (row.cells[idx]._DT_CellIndex.column == 45) {
                        if (data.wk14_UpdateDt) {
                            row.cells[idx].style.color = 'red';
                            hasUnsavedVal = true;
                            var id = data.scheduleLineId.toString();
                            if (!weekCounts["wk14"]) {
                                weekCounts["wk14"] = 0;
                            }
                            if (ifIdIsSame.indexOf("wk14_" + id) == -1) {
                                weekCounts["wk14"]++;
                                ifIdIsSame.push("wk14_" + id);
                            }   
                            wk14 = true;                           
                        }                        
                    }
                }

                if (data.canDelete == false) {
                    $(row.cells[0]).removeClass('select-checkbox');
                }

                if (hasUnsavedVal == true)
                    $('#divCopyToSchedule > button').attr('disabled', 'disabled').prop('disabled', 'disabled');
                                 
            },            
            initComplete: function (settings, json) {
                PropertyTableJsonFull = json; 

                var uniqueNetworks = new Set(); //HM ST-955 starts here
                var columnData = this.api().column().data();

                columnData.each(function (value, index) {
                    uniqueNetworks.add(value.networkName);
                });

                if (uniqueNetworks.size === 1) {
                    $('#btnCopySpots').prop('disabled', false);
                } else {
                    $('#btnCopySpots').prop('disabled', true);
                }                               //HM ST-955 starts here
                
                //disable CopyToSchedule if any textbox is colored (not saved value)
                //$("#MyProposalTable tr td input[type=text]").each(function () {
                //    var ctrlColor = $(this).css('color');
                //    if (ctrlColor =='rgb(255 0 0)') {
                //        $('#divCopyToSchedule > button').attr('disabled', 'disabled').prop('disabled', 'disabled');
                //        return false;
                //    }
                //});

                //$("#DiscountPriceHeader").html($("#DiscountPrice").find(":selected").text() + " Rate").show();

                //$('table.dtfc-has-left thead#dtHeader tr').addClass('hidden');

                var colIndex = -1;
                var selValue = '-1';
                this.api().columns('.HeaderType').every(function () {
                    //console.log("TEsT Shariq");
                  //  alert("Shariq Edit");
                    var column = this;
                    var ddmenu = cbDropdown($(column.header()))
                        .on('change', ':checkbox', function () {
                            _Initialize = 0;
                            colIndex = column.index();
                            Codebase.blocks('#ProposalTableDiv', 'state_loading');
                            //  if ($(this).val() == "Select All" && $(this).prop("checked")) { 
                            var vals = $(':checked', ddmenu).map(function (index, element) {
                                return $.fn.dataTable.util.escapeRegex($(element).val());
                            }).toArray().join('~');
                            var valsArr = vals.split("~");

                            /*
                            try {
                                if ($(this).parent().parent().parent().parent().parent().hasClass('HeaderSpotLen')) {
                                    _Show15 = (jQuery.inArray('15', valsArr) !== -1 ? true : false);
                                    _Show30 = (jQuery.inArray('30', valsArr) !== -1 ? true : false);
                                    _Show60 = (jQuery.inArray('60', valsArr) !== -1 ? true : false);
                                    _Show120 = (jQuery.inArray('120', valsArr) !== -1 ? true : false);
                                }
                            }
                            catch (err) { }
                            */
                            // console.log(valsArr);
                            // console.log($(this).val());

                            try {
                                if ($(this).parent().parent().parent().parent().parent().hasClass('HeaderNetworkName')) {
                                    var _NetworkNames = vals.replace("Select All,", "").replace("Select All", "");
                                    if (_NetworkNames.length == 0) {
                                        $("#btnCopySpots").attr("disabled", "disabled");
                                    }
                                    else {
                                        var _ArrNetworkNames = _NetworkNames.split('~');
                                        if (_ArrNetworkNames.length == 1) {
                                            $("#btnCopySpots").removeAttr("disabled");
                                        }
                                        else {
                                            $("#btnCopySpots").attr("disabled", "disabled");
                                        }
                                    }
                                    _selNetworkNames = _NetworkNames;
                                }
                            }
                            catch (err) { }

                            // Select All was clicked
                            if ($(this).val() == "Select All") {
                                // If Select All is checked by user
                                if (valsArr[0] == "Select All") {
                                    $(':checkbox', ddmenu).map(function (index, element) {
                                        if (index > 0) {
                                            $(element).prop("checked", true);
                                        }
                                    });
                                    selValue = '';
                                    $(this).parent().parent().parent().parent().parent().removeClass("factive");
                                    $(this).parent().parent().parent().removeClass("factive");
                                }
                                // If Select All is unchecked by user
                                else {
                                    $(':checkbox', ddmenu).map(function (index, element) {
                                        if (index > 0) {
                                            $(element).prop("checked", false);
                                        }
                                    });
                                    // Yes, this is my birthday.  My magical default that will never exist and thus
                                    // when we search using this key, we will end up with a blank list.  Hence "SELECT ALL" Unchecked.
                                    selValue = '12:06';
                                    $(this).parent().parent().parent().addClass("factive");
                                    $(this).parent().parent().parent().parent().parent().addClass("factive");
                                }
                            }
                            else {
                                var AvailableLength = $(this).parent().parent().parent()[0].children.length; // Number of checkboxes
                                var CheckedLength = valsArr.length; // Number checked

                                var className = $(this).parent().parent().parent().parent().parent()[0].className; 
                                if (className.indexOf("HeaderNetworkName") != -1) {                                    
                                    localStorage.setItem("isNetworkFilter", true);                                   
                                }
                                else {                                    
                                    localStorage.setItem("isNetworkFilter", false);
                                }
                                if (className.indexOf("HeaderPropertyName") != -1) {
                                    localStorage.setItem("isPropertyFilter", true);
                                }
                                else {
                                    localStorage.setItem("isPropertyFilter", false);
                                }
                                if ((className.indexOf("HeaderTotalSpots") == -1)
                                    && (className.indexOf("HeaderWK01") == -1)
                                    && (className.indexOf("HeaderWK02") == -1)
                                    && (className.indexOf("HeaderWK03") == -1)
                                    && (className.indexOf("HeaderWK04") == -1)
                                    && (className.indexOf("HeaderWK05") == -1)
                                    && (className.indexOf("HeaderWK06") == -1)
                                    && (className.indexOf("HeaderWK07") == -1)
                                    && (className.indexOf("HeaderWK08") == -1)
                                    && (className.indexOf("HeaderWK09") == -1)
                                    && (className.indexOf("HeaderWK10") == -1)
                                    && (className.indexOf("HeaderWK11") == -1)
                                    && (className.indexOf("HeaderWK12") == -1)
                                    && (className.indexOf("HeaderWK13") == -1)
                                    && (className.indexOf("HeaderWK14") == -1)
                                    && (className.indexOf("HeaderImpression") == -1)
                                    && (className.indexOf("HeaderCPM") == -1)
                                    && (className.indexOf("HeaderUSD") == -1)
                                    && (className.indexOf("HeaderDiscount") == -1)
                                    && (className.indexOf("HeaderRateAmt") == -1))
                                {
                                    AvailableLength = AvailableLength - 1;
                                }                              

                                if (vals == '') {
                                    $(':checkbox', ddmenu).map(function (index, element) {
                                        if (index > 0) {
                                            $(element).prop("checked", false);
                                        }
                                    });
                                    selValue = '12:06';
                                    $(this).parent().parent().parent().addClass("factive");
                                    $(this).parent().parent().parent().parent().parent().addClass("factive");
                                }
                                else if (CheckedLength == AvailableLength) {
                                    // All seems to be checked
                                    $(':checkbox', ddmenu).map(function (index, element) {
                                        if (index > 0) {
                                            $(element).prop("checked", true);
                                        }
                                    });
                                    selValue = '';
                                    $(this).parent().parent().parent().parent().parent().removeClass("factive");
                                    $(this).parent().parent().parent().removeClass("factive");
                                }
                                else if (CheckedLength == AvailableLength - 1) {
                                    if (valsArr[0] == "Select All") {
                                        // Not all are checked
                                        // all are checked
                                        $(':checkbox', ddmenu).map(function (index, element) {
                                            if (index == 0) {
                                                $(element).prop("checked", false);
                                            }
                                        });
                                        selValue = vals;
                                        $(this).parent().parent().parent().parent().parent().addClass("factive");
                                        $(this).parent().parent().parent().addClass("factive");
                                    }
                                    else {
                                        // all are checked
                                        $(':checkbox', ddmenu).map(function (index, element) {
                                            if (index == 0) {
                                                $(element).prop("checked", true);
                                            }
                                        });
                                        selValue = '';
                                        $(this).parent().parent().parent().parent().parent().removeClass("factive");
                                        $(this).parent().parent().parent().removeClass("factive");
                                    }
                                }                                
                                else if (CheckedLength < AvailableLength - 1) {
                                    selValue = vals;
                                    $(this).parent().parent().parent().addClass("factive");
                                    $(this).parent().parent().parent().parent().parent().addClass("factive");
                                }
                                else {
                                    // This should never happen
                                }

                            }

                            /*
                            var table = $('#MyProposalTable').DataTable();
                            if (table) {
                                var oSettings = table.settings();
                                var oData = table.data();
                                ReloadByHeader($(column.header()), oSettings, oData);
                                if ($(column.header()) != null && $(column.header()).hasClass("HeaderSpotLen")) {
                                    ShowHideGIBySpotLen();
                                }
                            }
                            */
                            if (colIndex == 8) {
                                if ($(this).parent().parent().parent().hasClass("factive")) {
                                    $("#txtPropertyName").addClass("factive");
                                } else {
                                    $("#txtPropertyName").removeClass("factive");
                                }

                            }
                            Codebase.blocks('#ProposalTableDiv', 'state_normal');
                        });
                });
                this.api().columns('.HeaderSpotLen').every(function () {
                    var column = this;
                    var _changed = false;
                    _Show15 = false;
                    _Show30 = false;
                    _Show60 = false;
                    _Show120 = false;

                    column.data().unique().sort().each(function (d, j) {
                        if (d == 30) {
                            if (_Show30 == false) {
                                _Show30 = true;
                                _changed = true;
                            }
                        }
                        else if (d == 15) {
                            if (_Show15 == false) {
                                _Show15 = true;
                                _changed = true;
                            }
                        }
                        else if (d == 60) {
                            if (_Show60 == false) {
                                _Show60 = true;
                                _changed = true;
                            }
                        }
                        else if (d == 120) {
                            if (_Show120 == false) {
                                _Show120 = true;
                                _changed = true;
                            }
                        }
                    });
                    if (_changed == true) {
                        ShowHideGIBySpotLen();
                    }

                });
                $("#txtPropertyName").on("change", function () {
                    var propertyName = $(this).val().toLowerCase();
                    colIndex = 8;
                    $(".dataTables_scrollHead .HeaderPropertyName .cb-dropdown-wrap .cb-dropdown li").each(function () {
                        if ($(this).text().toLowerCase().indexOf(propertyName) >= 0 && $(this).text().toLowerCase()!= "select all") {
                            $(this).find("input").prop("checked", true);
                            if (selValue == "-1") {
                                selValue = $(this).text();
                            } else {
                                selValue += "~" + $(this).text();
                            }
                        }
                        else {
                            $(this).find("input").prop("checked", false);
                        }

                    });
                    if ($(".dataTables_scrollHead .HeaderPropertyName .cb-dropdown-wrap .cb-dropdown li").length - 1 == selValue.split("~").length) {
                        $(".dataTables_scrollHead .HeaderPropertyName .cb-dropdown-wrap .cb-dropdown li input[value='Select All']").prop("checked", true);
                        $(".dataTables_scrollHead .HeaderPropertyName .cb-dropdown-wrap .cb-dropdown").removeClass("factive");
                        $("#txtPropertyName").removeClass("factive");
                    } else {
                        $(".dataTables_scrollHead .HeaderPropertyName .cb-dropdown-wrap .cb-dropdown li input[value='Select All']").prop("checked", false);
                        $(".dataTables_scrollHead .HeaderPropertyName .cb-dropdown-wrap .cb-dropdown").addClass("factive");
                        $("#txtPropertyName").addClass("factive");
                    }
                    if (propertyName == "" || selValue == "-1") {
                        selValue = propertyName;
                    }
                });
                $(document).on("click", function (event) {
                    //alert("KHAN EDIT");
                    if (!$(event.target).hasClass("clsPropertyName") && !$(event.target).hasClass("cb-dropdown") && !$(event.target).parent().parent().hasClass("cb-dropdown") && !$(event.target).parent().parent().parent().hasClass("cb-dropdown") && colIndex != -1 && selValue != '-1') {
                        ShowOverlayMain();  // Added By Shariq H Khan, ST-307,308, Add Loader on Property Filter
                        var table = $("#MyProposalTable").DataTable();
                        table.columns(colIndex).search(selValue).draw(); // Added By Shariq H Khan, ST-307,308, Add Loader on Property Filter.draw();                     
                        table.on('draw', function () {
                            //alert("DDD");
                            ReloadTotals();
                            console.log("Drawing Table");
                            setTimeout(function () { HideOverlayMain(); }, 2000);
                        });
                    }
                    colIndex = -1;
                    selValue = '-1';
                });
                //this.api().columns('.DefaultHeaderType').every(function () {
                //    var column = this;
                //    var ddmenu = cbDropdown($(column.header()))
                //        .on('change', ':checkbox', function () {
                //            Codebase.blocks('#ProposalTableDiv', 'state_loading');
                //            var active;
                //            var vals = $(':checked', ddmenu).map(function (index, element) {
                //                active = true;
                //                return $.fn.dataTable.util.escapeRegex($(element).val());
                //            }).toArray().join('|');

                //            column
                //                .search(vals.length > 0 ? '^(' + vals + ')$' : '', true, false)
                //                .draw();

                //            // Highlight the current item if selected.
                //            if (this.checked) {
                //                $(this).closest('li').addClass('active');
                //            } else {
                //                $(this).closest('li').removeClass('active');
                //            }

                //            // Highlight the current filter if selected.
                //            var active2 = ddmenu.parent().is('.active');
                //            if (active && !active2) {
                //                ddmenu.parent().addClass('active');
                //            } else if (!active && active2) {
                //                ddmenu.parent().removeClass('active');
                //            }
                //            Codebase.blocks('#ProposalTableDiv', 'state_normal');
                //        });

                //    column.data().unique().sort().each(function (d, j) {
                //        var // wrapped
                //            $label = $('<label>'),
                //            $text = $('<span>', {
                //                text: d
                //            }),
                //            $cb = $('<input>', {
                //                type: 'checkbox',
                //                value: d
                //            });

                //        $text.appendTo($label);
                //        $cb.appendTo($label);

                //        ddmenu.append($('<li>').append($label));
                //    });

                //});
                //this.api().columns('.DateHeaderType').every(function () {
                //    var column = this;
                //    var ddmenu = cbDropdown($(column.header()))
                //        .on('change', ':checkbox', function () {
                //            var vals = $(':checked', ddmenu).map(function (index, element) {
                //                return $.fn.dataTable.util.escapeRegex($(element).val());
                //            }).toArray().join(',');

                //            column
                //                .search(vals.length > 0 ? vals : '', true, false)
                //                .draw();
                //            if (vals === "") {
                //                $(this).parent().parent().parent().removeClass("factive");
                //            } else {
                //                $(this).parent().parent().parent().addClass("factive");
                //            }
                //        });
                //});
                document.body.style.width = "4481px";
                $("#ProposalTableDiv").width(2502);//($("#MyProposalTable").width() + 120) + 'px';
                $("#divHeader").width(1218);
                $("#divCalculatorEdit").width(1263);
                $("#divCalculatorEdit").css("margin-left", "590px");
                $(".cb-dropdown-wrap").each(function () {
                    $(this).width($(this).parent().width());
                });
                //setTimeout(function () {
                Codebase.blocks('#ProposalTableDiv', 'state_normal');
                //}, 3000);
                _Initialize = 0;
                _ReloadTotal = 1;
                ResizeMainTable();
                setTimeout(function () {
                    console.log("Checking Totals");
                    ReloadTotals();
                    HideOverlayMain();
                }, 5000);
            },
            scrollX: true,
            //scrollY: '430px',
            scrollCollapse: true,
            fixedColumns: {
                leftColumns: $('th.HeaderUSD').attr('CountryId') == 2 ? 19 : 18,
            }
        });
    }    
}
// HM ST-858 start
$(window).on('load', function (e) { 
    if (sessionStorage.getItem("firstTimeLoad") != null) {
        UnlockOnPageRefresh();
    }   
    sessionStorage.setItem("firstTimeLoad", "true");
});

$(window).on('unload', function (e) {  
    promptExit(0);
    proptable.state.clear(); 
    UnlockOnClose();   
});

function UnlockOnClose() {
    var _url = "/ScheduleProposal/Unlock/";
    var _Id = getParameterByName('ProposalId');
    if (!_Id || parseInt(_Id) === 0) {
        _Id = getParameterByName('ScheduleId');
    }   
    if (_Id > 0) {
        $.ajax({
            url: _url,
            data: { ScheduleProposalId: _Id },
            cache: false,
            type: "POST",
            success: function (result) {
                
            },
            error: function (response) {
                swal('Stop!', response.responseText, 'error');
            }
        });
    }
}

function UnlockOnPageRefresh() {
    var _url = "/ScheduleProposal/UnlockOnRefresh/";
    var _Id = getParameterByName('ProposalId');
    if (!_Id || parseInt(_Id) === 0) {
        _Id = getParameterByName('ScheduleId');
    }

    if (_Id > 0) {
        $.ajax({
            url: _url,
            data: { ScheduleProposalId: _Id },
            cache: false,
            type: "POST",
            success: function (result) {
               
            },
            error: function (response) {
                swal('Stop!', response.responseText, 'error');
            }
        });
    }
}

// HM ST-858 end


function loadMorePages(loadmore) {
    Codebase.blocks('#ProposalTableDiv', 'state_loading');
    if (loadmore) {
        $("#CurPage").val(parseInt($("#CurPage").val()) + 1);
    }
    else {
        $("#CurPage").val(1);
    }

    if (proptable == null) {
        initProposalTable();
    }
    else {
        proptable.ajax.reload(); }
    //$.ajax({
    //    url: '/ScheduleProposal/GetProposalData',
    //    type: 'POST',
    //    data: {
    //        proposalId: _UniqueId,
    //        discountRate: parseFloat($("#DiscountPrice").find(":selected").text().replace('%', '')),
    //        ViewOnly: false,
    //        pageNum: $("#CurPage").val(),
    //        pageLength: 200
    //    },
    //    cache: false,
    //    success: function (result) {
    //        if (result.success) {
    //            proptable.rows.add(result.data).draw();                
    //        }
    //    },
    //    error: function (response) {
    //        swal({
    //            title: "Error",
    //            text: response.responseText,
    //            type: 'error',
    //        });
    //    }
    //});
    //$("#DiscountPriceHeader").html($("#DiscountPrice").find(":selected").text() + " Rate").show();
    //setTimeout(function () {
    Codebase.blocks('#ProposalTableDiv', 'state_normal');
    // }, 3000);
}

$(document).on('load', 'select', function () {
    Codebase.loader('show', 'bg-gd-dusk');
    setTimeout(function () {
        Codebase.loader('hide');
    });
});
$(document).ready(function () {
    ShowOverlayMain();//Added Displaying Overlay On Page Load By Shariq, 2022-08-31
    _GrossIncomeReady = false;
    $("#btnUndoWeeklySpotChange").attr('disabled', 'disabled');
    if (proptable == null) {
        initProposalTable();       
    }

    // Handle click on "Load more" buttonshow
    $('#btn-example-load-more').on('click', function () {
        _LoadRow = 1;
        loadMorePages(true);
        //CalculateDiscountPrices(proptable, 1, 0, 1);
    });

    $('#btn-example-load-less').on('click', function () {
        _LoadRow = 1;
        loadMorePages(false);
        //CalculateDiscountPrices(proptable, 1, 0, 1);
    });

    $('#DiscountPrice').on('change', function (e) {
        var table = $('#MyProposalTable').DataTable();
        if (table) {
            _Initialize = 0;
            table.ajax.reload(function () {
                // Change Header to Discount Percent
                // $("#DiscountPriceHeader").html($("#DiscountPrice").find(":selected").text() + " Rate").show();
            }, false);
        }
    });

    $('#btnPropResetColumns').on('click', function (e) {
        _Initialize = 1;
        ResetState(proptable);
    });

    $('#btnPropShowDates').on('click', function (e) {
        _Initialize = 0;

        // COLINDEX_DEPENDENT 
        ShowHideColumn(9);
        ShowHideColumn(10);
    });

    $('#btnPropShowSpots').on('click', function (e) {
        ShowHideColumn(1);
        ShowHideColumn(2);
        ShowHideColumn(3);
        ShowHideColumn(4);
        ShowHideColumn(11);
        ShowHideColumn(12);
        ShowHideColumn(13);
        ShowHideColumn(14);
        ShowHideColumn(15);
        ShowHideColumn(16);
        ShowHideColumn(17);
        ShowHideColumn(18);
        ShowHideColumn(20);
        ShowHideColumn(22);
        ShowHideColumn(23);
        ShowHideColumn(24);
        ShowHideColumn(25);
        ShowHideColumn(27);
        ShowHideColumn(28);
    });

    $('#btnShowGI').on('click', function (e) {
        var params = [
            'height=' + 650,
            'width=' + (screen.width < 1500? screen.width : 1500),
            'resizable=yes',
            'directories=0',
            'titlebar=0',
            'toolbar=0',
            'location=0',
            'status=0',
            'menubar=0'
        ].join(',');
        if (popupGrossIncome && !popupGrossIncome.Closed) {
            popupGrossIncome.close();
        }
        setTimeout(function () {
            popupGrossIncome = window.open('/ScheduleProposal/GrossIncome?ProposalId=' + _UniqueId, 'popupGrossIncome', params);
            var x = screen.width / 2;
            var y = screen.height / 4;
            if (popupGrossIncome) {
                if (_GrossIncomeReady == true) {
                    popupGrossIncome.moveTo(x, y);
                }
            }
        }, 500);

    });

    $('#btnShowExchangeRates').on('click', function (e) {
        var params = [
            'height=' + 100,
            'width=' + 400
        ].join(',');
        if (popupExchangeRates && !popupExchangeRates.Closed) {
            popupExchangeRates.close();
        }
        setTimeout(function () {
            popupExchangeRates = window.open('/ScheduleProposal/ExchangeRates', 'popupExchangeRates', params);
            var x = screen.width / 2;
            var y = screen.height / 3;
            popupExchangeRates.moveTo(x, y);
        }, 500);
    });

    $('.dataTables_scrollBody').on('DOMMouseScroll mousewheel', function (ev) {
        var $this = $(this),
            scrollTop = this.scrollTop,
            scrollHeight = this.scrollHeight,
            height = $this.innerHeight(),
            delta = ev.originalEvent.wheelDelta,
            up = delta > 0;

        var prevent = function () {
            ev.stopPropagation();
            ev.preventDefault();
            ev.returnValue = false;
            return false;
        }

        if (!up && -delta > scrollHeight - height - scrollTop) {
            // Scrolling down, but this will take us past the bottom.
            //if ($('#btn-example-load-more').is(':visible')) {
            //    proptable.page.loadMore();
            //    CalculateDiscountPrices(proptable);
            //}
            $this.scrollTop(scrollHeight);
            return prevent();
        } else if (up && delta > scrollTop) {
            // Scrolling up, but this will take us past the top.
            $this.scrollTop(0);
            return prevent();
        }
    });

    /*Proposal Redesign - Added for Synchronous H-Scrolling for Proposal records Week SPOTS and Top right TOTALs Weeks*/
    $('.dataTables_scrollBody').on('scroll', function () {
        $('.dataTables_scrollBody').scrollLeft($(this).scrollLeft());
    });
     
    var prevSelectedRow = 0;  // HM ST-678/721 START
    
    // Selecting a row
    $('#MyProposalTable tbody').on('click', 'tr', function (e) {
        ["keyup", "keydown"].forEach((event) => {
            window.addEventListener(event, (e) => {
                document.onselectstart = function () {
                    return !(e.key == "Shift" && e.shiftKey);
                }
            });
        });
        if (e.shiftKey) {           
        if (prevSelectedRow == e.target._DT_CellIndex.row) {
            var element = $('#MyProposalTable tbody tr')[e.target._DT_CellIndex.row];
            $(element).toggleClass('selected');
        }
        if (prevSelectedRow < e.target._DT_CellIndex.row) { 
            for (var i = prevSelectedRow; i <= e.target._DT_CellIndex.row; i++) {
                var selElement = $('#MyProposalTable tbody tr')[prevSelectedRow + 1]; 
                var element = $('#MyProposalTable tbody tr')[i];
                
                if (!$(element).hasClass('selected')) {
                    $(element).addClass('selected');
                }  
                else if ($(element).hasClass('selected')) {
                    $(element).removeClass('selected');
                }
                if (i == prevSelectedRow && !$(selElement).hasClass('selected')) {
                    $(element).addClass('selected');
                }
                else if (i == prevSelectedRow && $(selElement).hasClass('selected')) {
                    $(element).removeClass('selected');
                }
            }
        }
        if (prevSelectedRow > e.target._DT_CellIndex.row) {
                for (var i = e.target._DT_CellIndex.row; i <= prevSelectedRow; i++) {
                    var selElement = $('#MyProposalTable tbody tr')[prevSelectedRow - 1];     
                    var element = $('#MyProposalTable tbody tr')[i];                    
                    if ($(element).hasClass('selected') && i < prevSelectedRow) {
                        $(element).removeClass('selected');
                    }
                    else if (!$(element).hasClass('selected') && i < prevSelectedRow) {
                        $(element).addClass('selected');
                    }
                    if (i == prevSelectedRow && $(selElement).hasClass('selected')) {
                        $(element).addClass('selected');
                    }
                    else if (i == prevSelectedRow && !$(selElement).hasClass('selected')) {
                        $(element).removeClass('selected');
                    }
                }
            }
            prevSelectedRow = e.target._DT_CellIndex.row;
        }
        else {
            if (e.target.cellIndex == 0) {
                $(this).toggleClass('selected');
                SetupMenus();
                e.stopImmediatePropagation();
            }
            prevSelectedRow = e.target._DT_CellIndex.row;
        }  // HM ST-678/721  END   
    });

    function AutoLoadMorePages() {
        var idleState = false;
        var idleTimer = null;
        $('*').bind('mousemove click mouseup mousedown keydown keypress keyup submit change mouseenter scroll resize dblclick', function () {
            clearTimeout(idleTimer);
            if (idleState == true) {
                idleState = false;
                if ($('#btn-example-load-more').is(':visible')) {
                    $("body").css('background-color', '#fff');
                    proptable.page.loadMore();
                    CalculateDiscountPrices(proptable, 1, 0, 0);
                    $("body").css('background-color', '#000');
                }
            }
            else {
                idleState = false;
                idleTimer = setTimeout(function () {
                    $("body").css('background-color', '#000');
                    idleState = true;
                }, 20000);
            }
        });
        $("body").trigger("mousemove");
    };

    $(window).resize(function () {
        ResizeMainTable();
    });

    ResizeMainTable();

    proptable.columns().eq(0).each(function (colIdx) {
        var title = proptable.columns(colIdx).header().to$().text();
        if (title.toLowerCase().indexOf('12/06/71') == 0) {
            var columnWk = proptable.column(colIdx);
            columnWk.visible(false);
        }
    });

    // Add icons to all show/hide buttons
    proptable.columns().eq(0).each(function (index) {
        var colStat = proptable.column(index);
        var that = $('#ShowHideButton' + index.toString());
        if (colStat.visible()) {
            $(that).attr('class', 'btn btn-outline-secondary');
        }
        else {
            $(that).attr('class', 'btn btn-outline-danger');
        }
    });
    $(".HeaderPropertyName").on("click", function () {
        if (!$(event.target).hasClass("clsPropertyName") &&!$(event.target).hasClass("cb-dropdown") && !$(event.target).parent().parent().hasClass("cb-dropdown") && !$(event.target).parent().parent().parent().hasClass("cb-dropdown")) {
            if (sortColumnDirection == "asc") {
                sortColumnDirection = "desc";
            }
            else {
                sortColumnDirection = "asc";
            }
            proptable.order([8, sortColumnDirection]).draw();
        }
    });
    _GrossIncomeReady = true;
    _Initialize = 0;
    proptable.order([8, sortColumnDirection]);
});

$(window).on('scroll', function () {  
   
    if ($(this).scrollLeft() == 0) {
        $("#ProposalTableDiv").width(2502);
        $("#divCalculatorEdit").width(1263);
        $("#divCalculatorEdit").css("margin-left", "511px");
    }
    else if ($(this).scrollLeft() > 250 && $(this).scrollLeft() < 500) {
        $("#ProposalTableDiv").width(3019);
        $("#divCalculatorEdit").width(1780);
        $("#divCalculatorEdit").css("margin-left", "511px");
    }
    else if ($(this).scrollLeft() < 250) {
        $("#ProposalTableDiv").width(2502);
        $("#divCalculatorEdit").width(1263);
        $("#divCalculatorEdit").css("margin-left", "511px");
    }
    else if ($(this).scrollLeft() > 500 && $(this).scrollLeft() < 750) {
        $("#ProposalTableDiv").width(3390);
        $("#divCalculatorEdit").width(2150);
        $("#divCalculatorEdit").css("margin-left", "511px");
    }
    else if ($(this).scrollLeft() < 500) {
        $("#ProposalTableDiv").width(3390);
        $("#divCalculatorEdit").width(2150);
        $("#divCalculatorEdit").css("margin-left", "511px");
    } 
    else if ($(this).scrollLeft() > 750 && $(this).scrollLeft() < 1000) {
        $("#ProposalTableDiv").width(3390);
        $("#divCalculatorEdit").width(2150);
        $("#divCalculatorEdit").css("margin-left", "511px");
    }
    else if ($(this).scrollLeft() < 750) {
        $("#ProposalTableDiv").width(3390);
        $("#divCalculatorEdit").width(2150);
        $("#divCalculatorEdit").css("margin-left", "511px");
    }
    else if ($(this).scrollLeft() > 1000 && $(this).scrollLeft() < 1250) {
        $("#ProposalTableDiv").width(3390);
        $("#divCalculatorEdit").width(2150);
        $("#divCalculatorEdit").css("margin-left", "511px");
    }
    else if ($(this).scrollLeft() < 1000) {
        $("#ProposalTableDiv").width(3390);
        $("#divCalculatorEdit").width(2150);
        $("#divCalculatorEdit").css("margin-left", "511px");
    }
    else if ($(this).scrollLeft() > 1250 && $(this).scrollLeft() < 1500) {
        $("#ProposalTableDiv").width(3390);
        $("#divCalculatorEdit").width(2150);
        $("#divCalculatorEdit").css("margin-left", "511px");
    }
    else if ($(this).scrollLeft() < 1250) {
        $("#ProposalTableDiv").width(3390);
        $("#divCalculatorEdit").width(2150);
        $("#divCalculatorEdit").css("margin-left", "511px");
    } 
    else if ($(this).scrollLeft() > 1500 && $(this).scrollLeft() < 1750) {
        $("#ProposalTableDiv").width(3390);
        $("#divCalculatorEdit").width(2150);
        $("#divCalculatorEdit").css("margin-left", "518px");
    }
    else if ($(this).scrollLeft() < 1500) {
        $("#ProposalTableDiv").width(3390);
        $("#divCalculatorEdit").width(2150);
        $("#divCalculatorEdit").css("margin-left", "511px");
    } 
   
});

