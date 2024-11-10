var _Initialize = 1;
var _ReloadTotal = 0;
var dropdownjson;//ST-460
var _UniqueId = getParameterByName('ProposalId');
if (!_UniqueId || parseInt(_UniqueId) === 0) {
    _UniqueId = getParameterByName('ScheduleId');
}
var _GrossIncomeReady = false;

// These 4 are used to determine which GI is shown on the summary.  I try to keep usage of ths within
// this file and _CalculatorEditTable but there will be checks on _CalculatorEditTable so we don't 
// needlessly crash.
var _Show15 = false;
var _Show30 = false;
var _Show60 = false;
var _Show120 = false;
var sortColumnDirection = "asc";

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

function GrossIncomeReady(ready) {
    _GrossIncomeReady = ready;
    if (ready == true) {
        if (popupGrossIncome) {
            CalculateTotals($("#MyProposalTable").DataTable());
        }
    }
}

function LoadReloadDropdownFilters(settings) {
    if (dropdownjson == null || dropdownjson == undefined || dropdownjson.language > 0) {// ST-460
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
                CalledForDropDown: false,//ST-724
                FilterForEdit: false//ST-724
            },
            datatype: 'json',
            success: function (data) {
                dropdownjson = data.data;// ST-460 Added
                //ReloadAll(settings, data.data); // ST-460 Commented
                ReloadAll(settings, dropdownjson); // ST-460 Modified
            },
            error: function () {

            }
        });
    }
    else {// ST-460
        ReloadAll(settings, dropdownjson);
    }
}

var _LoadRow = 0;
var proptable = null;

function initProposalTable() {
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
                processing: "<i class='fa fa-refresh fa-spin'></i>"
            },
            serverSide: true,
            deferRender: true,
            stateSave: true,
            destroy: true,
            //scrollX: true,
            //scrollY: '430px',
            //scrollCollapse: true,
            //fixedColumns: {
            //    leftColumns: $('th.HeaderUSD').attr('CountryId') == 2 ? 24 : 23,
            //},
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
                //if (_ReloadTotal == 1) { ST-460 Commented
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
                //ShowHideGIBySpotLen();
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
            ],
            //order: [[8, "asc"]],
            stateDuration: 60 * 60 * 24 * 365,
            fixedHeader: true,
            columns: [
                {
                    targets: 0,
                    data: "scheduleLineId",
                    visible: false
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
                    class: "d-none d-sm-table-cell text-center"
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
                },
                {
                    targets: 9,
                    data: "effectiveDate",
                    class: "d-none d-sm-table-cell text-center",
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
                    class: "d-none d-sm-table-cell text-right",
                    render: $.fn.dataTable.render.number(',', '.', 2, '$')
                },
                {
                    targets: 25,
                    data: "discount", /* Discount Rate */
                    class: "d-none d-sm-table-cell text-right",
                    //visible: false,
                    render: $.fn.dataTable.render.number(',', '.', 2, '$')
                },
                {
                    targets: 26,
                    data: "usdRate", /* USD Rate */
                    class: "d-none d-sm-table-cell text-right",
                    visible: $('th.HeaderUSD').attr('CountryId') == 2 ? true : false,
                    render: $.fn.dataTable.render.number(',', '.', 2, '$')
                },
                {
                    targets: 27, /* CPM */
                    data: "cpm",
                    class: "d-none d-sm-table-cell text-right",
                    render: $.fn.dataTable.render.number(',', '.', 2, '$')

                },
                {
                    targets: 28,
                    data: "impressions",
                    class: "d-none d-sm-table-cell text-center",
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
                    render: function (data, type, row, meta) {
                        if (data == 0)
                            return "<input style='text-align:center;max-width:113px!important' disabled value=''>";
                        else
                            return "<input style='text-align:center;max-width:113px!important' disabled value='" + data + "'>";
                    }

                },
                {
                    targets: 33,
                    data: "wk02_Spots",
                    class: "d-none d-sm-table-cell text-center table-secondary",
                    render: function (data, type, row, meta) {
                        if (data == 0)
                            //return '';
                            return "<input style='text-align:center;max-width:113px!important' disabled value=''>";
                        else
                            //return data;
                            return "<input style='text-align:center;max-width:113px!important' disabled value='" + data + "'>";
                    }
                },
                {
                    targets: 34,
                    data: "wk03_Spots",
                    class: "d-none d-sm-table-cell text-center table-secondary",
                    render: function (data, type, row, meta) {
                        if (data == 0)
                            //return '';
                            return "<input style='text-align:center;max-width:113px!important' disabled value=''>";
                        else
                            return "<input style='text-align:center;max-width:113px!important' disabled value='" + data + "'>";
                    }
                },
                {
                    targets: 35,
                    data: "wk04_Spots",
                    class: "d-none d-sm-table-cell text-center table-secondary",
                    render: function (data, type, row, meta) {
                        if (data == 0)
                            //return '';
                            return "<input style='text-align:center;max-width:113px!important' disabled value=''>";
                        else
                            return "<input style='text-align:center;max-width:113px!important' disabled value='" + data + "'>";
                    }
                },
                {
                    targets: 36,
                    data: "wk05_Spots",
                    class: "d-none d-sm-table-cell text-center table-secondary",
                    render: function (data, type, row, meta) {
                        if (data == 0)
                            //return '';
                            return "<input style='text-align:center;max-width:113px!important' disabled value=''>";
                        else
                            return "<input style='text-align:center;max-width:113px!important' disabled value='" + data + "'>";
                    }
                },
                {
                    targets: 37,
                    data: "wk06_Spots",
                    class: "d-none d-sm-table-cell text-center table-secondary table-secondary",
                    render: function (data, type, row, meta) {
                        if (data == 0)
                            //return '';
                            return "<input style='text-align:center;max-width:113px!important' disabled value=''>";
                        else
                            return "<input style='text-align:center;max-width:113px!important' disabled value='" + data + "'>";
                    }
                },
                {
                    targets: 38,
                    data: "wk07_Spots",
                    class: "d-none d-sm-table-cell text-center table-secondary",
                    render: function (data, type, row, meta) {
                        if (data == 0)
                            //return '';
                            return "<input style='text-align:center;max-width:113px!important' disabled value=''>";
                        else
                            return "<input style='text-align:center;max-width:113px!important' disabled value='" + data + "'>";
                    }
                },
                {
                    targets: 39,
                    data: "wk08_Spots",
                    class: "d-none d-sm-table-cell text-center table-secondary",
                    render: function (data, type, row, meta) {
                        if (data == 0)
                            //return '';
                            return "<input style='text-align:center;max-width:113px!important' disabled value=''>";
                        else
                            return "<input style='text-align:center;max-width:113px!important' disabled value='" + data + "'>";
                    }
                },
                {
                    targets: 40,
                    data: "wk09_Spots",
                    class: "d-none d-sm-table-cell text-center table-secondary",
                    render: function (data, type, row, meta) {
                        if (data == 0)
                            //return '';
                            return "<input style='text-align:center;max-width:113px!important' disabled value=''>";
                        else
                            return "<input style='text-align:center;max-width:113px!important' disabled value='" + data + "'>";
                    }
                },
                {
                    targets: 41,
                    data: "wk10_Spots",
                    class: "d-none d-sm-table-cell text-center table-secondary",
                    render: function (data, type, row, meta) {
                        if (data == 0)
                            return "<input style='text-align:center;max-width:113px!important' disabled value=''>";
                        else
                            return "<input style='text-align:center;max-width:113px!important' disabled value='" + data + "'>";
                    }
                },
                {
                    targets: 42,
                    data: "wk11_Spots",
                    class: "d-none d-sm-table-cell text-center table-secondary",
                    render: function (data, type, row, meta) {
                        if (data == 0)
                            //return '';
                            return "<input style='text-align:center;max-width:113px!important' disabled value=''>";
                        else
                            return "<input style='text-align:center;max-width:113px!important' disabled value='" + data + "'>";
                    }
                },
                {
                    targets: 43,
                    data: "wk12_Spots",
                    class: "d-none d-sm-table-cell text-center table-secondary",
                    render: function (data, type, row, meta) {
                        if (data == 0)
                            //return '';
                            return "<input style='text-align:center;max-width:113px!important' disabled value=''>";
                        else
                            return "<input style='text-align:center;max-width:113px!important' disabled value='" + data + "'>";
                    }
                },
                {
                    targets: 44,
                    data: "wk13_Spots",
                    class: "d-none d-sm-table-cell text-center table-secondary",
                    render: function (data, type, row, meta) {
                        if (data == 0)
                            //return '';
                            return "<input style='text-align:center;max-width:113px!important' disabled value=''>";
                        else
                            return "<input style='text-align:center;max-width:113px!important' disabled value='" + data + "'>";
                    }
                },
                {
                    targets: 45,
                    data: "wk14_Spots",
                    class: "d-none d-sm-table-cell text-center table-secondary",
                    render: function (data, type, row, meta) {
                        if (data == 0)
                            //return '';
                            return "<input style='text-align:center;max-width:113px!important' disabled value=''>";
                        else
                            return "<input style='text-align:center;max-width:113px!important' disabled value='" + data + "'>";
                    }
                },
                {
                    targets: 46,
                    defaultContent: '',
                    render: function (data, type, row, meta) {
                        return "<input style='width:0px!important;border-right-style:hidden;border-left-style:hidden;border-top-style:hidden;border-bottom-style:hidden;background-color: white;max-height:0px;' disabled>";
                    }
                },
            ],
            drawCallback: function () {
               // $('#btn-example-load-more').hide();

                /*
                // If there is some more data
                if($('#btn-example-load-more').is(':visible')){
                   // Scroll to the "Load more" button
                   $('html, body').animate({
                      scrollTop: $('#btn-example-load-more').offset().top
                   }, 1000);
                }
     
                // Show or hide "Load more" button based on whether there is more data available
                $('#btn-example-load-more').toggle(this.api().page.hasMore());
                */
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
                    $($(row).find("td")[3]).css("color", "#2971B9!important");
                }
                if (data.isTimeChanged) {
                    $($(row).find("td")[5]).css("color", "#2971B9!important");
                }
            },
            rowCallback: function (row, data) {
                /*Proposal Redesign - Added for "Totals" fixed colmns back-ground color for CANADA to remove H-Scroll columns overlay transperancy*/
                for (var idx = 0; idx < row.cells.length; idx++) {
                    if (row.cells[idx]._DT_CellIndex.column == 31) {
                        if ($('th.HeaderUSD').attr('CountryId') == 2) {
                            $(row.cells[idx]).addClass('dtBackgroundColor');
                        }
                    }
                }
            },
            initComplete: function (settings, json) {
                PropertyTableJsonFull = json;
                //$("#DiscountPriceHeader").html($("#DiscountPrice").find(":selected").text() + " Rate").show();
                /*
                var columnUSDRate = proptable.column(25);
                if ($("#CountryID").val() == '5') {
                    columnUSDRate.visible(false);
                }
                else {
                    columnUSDRate.visible(true);
                }
                */

                var colIndex = -1;
                var selValue = '-1';
                this.api().columns('.HeaderType').every(function () {
                    var column = this;
                    var ddmenu = cbDropdown($(column.header()))
                        .on('change', ':checkbox', function () {
                            _Initialize = 0;
                            colIndex = column.index();
                            var vals = $(':checked', ddmenu).map(function (index, element) {
                                return $.fn.dataTable.util.escapeRegex($(element).val());
                            }).toArray().join('~');
                            var valsArr = vals.split('~');
                            try {
                                if ($(this).parent().parent().parent().parent().parent().hasClass('HeaderSpotLen')) {
                                    _Show15 = (jQuery.inArray('15', valsArr) !== -1 ? true : false);
                                    _Show30 = (jQuery.inArray('30', valsArr) !== -1 ? true : false);
                                    _Show60 = (jQuery.inArray('60', valsArr) !== -1 ? true : false);
                                    _Show120 = (jQuery.inArray('120', valsArr) !== -1 ? true : false);
                                }
                            }
                            catch (err) { }
                            // console.log(valsArr);
                            // console.log($(this).val());
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
                                    $(this).parent().parent().parent().parent().parent().addClass("factive");
                                    $(this).parent().parent().parent().addClass("factive");
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
                                    && (className.indexOf("HeaderRateAmt") == -1)) {
                                    AvailableLength = AvailableLength - 1;
                                }

                                if (vals == '') {
                                    $(':checkbox', ddmenu).map(function (index, element) {
                                        if (index > 0) {
                                            $(element).prop("checked", false);
                                        }
                                    });
                                    selValue = '12:06';
                                    $(this).parent().parent().parent().parent().parent().addClass("factive");
                                    $(this).parent().parent().parent().addClass("factive");
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
                                    $(this).parent().parent().parent().parent().parent().addClass("factive");
                                    $(this).parent().parent().parent().addClass("factive");

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
                        });                    
                        //ST-460 Commented
                    //if ($('#CalculatorEditTable').DataTable() == null || $('#CalculatorEditTable').DataTable() == undefined || $('#CalculatorEditTable').DataTable().data().length == 0) {
                    //    ReloadTotals();
                    //}
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
                this.api().columns('.DefaultHeaderType').every(function () {
                    var column = this;
                    var ddmenu = cbDropdown($(column.header()))
                        .on('change', ':checkbox', function () {
                            var active;
                            var vals = $(':checked', ddmenu).map(function (index, element) {
                                active = true;
                                return $.fn.dataTable.util.escapeRegex($(element).val());
                            }).toArray().join('|');

                            column
                                .search(vals.length > 0 ? '^(' + vals + ')$' : '', true, false)
                                .draw();

                            // Highlight the current item if selected.
                            if (this.checked) {
                                $(this).closest('li').addClass('active');
                            } else {
                                $(this).closest('li').removeClass('active');
                            }

                            // Highlight the current filter if selected.
                            var active2 = ddmenu.parent().is('.active');
                            if (active && !active2) {
                                ddmenu.parent().addClass('active');
                            } else if (!active && active2) {
                                ddmenu.parent().removeClass('active');
                            }
                        });

                    column.data().unique().sort().each(function (d, j) {
                        var // wrapped
                            $label = $('<label>'),
                            $text = $('<span>', {
                                text: d
                            }),
                            $cb = $('<input>', {
                                type: 'checkbox',
                                value: d
                            });

                        $text.appendTo($label);
                        $cb.appendTo($label);

                        ddmenu.append($('<li>').append($label));
                    });

                });
                this.api().columns('.DateHeaderType').every(function () {
                    var column = this;
                    var ddmenu = cbDropdown($(column.header()))
                        .on('change', ':checkbox', function () {
                            var vals = $(':checked', ddmenu).map(function (index, element) {
                                return $.fn.dataTable.util.escapeRegex($(element).val());
                            }).toArray().join(',');

                            column
                                .search(vals.length > 0 ? vals : '', true, false)
                                .draw();
                            if (vals === "") {
                                $(this).parent().parent().parent().removeClass("factive");
                            } else {
                                $(this).parent().parent().parent().addClass("factive");
                            }
                        });
                });
                document.body.style.width = "4481px";
                $("#ProposalTableDiv").width(2502);//($("#MyProposalTable").width() + 120) + 'px';
                $("#divHeader").width(1218);
                $("#divCalculatorEdit").width(1263);
                $("#divCalculatorEdit").css("margin-left", "590px");
                $(".cb-dropdown-wrap").each(function () {
                    $(this).width($(this).parent().width());
                });

                $(".stime").on("keyup", function () {
                    console.log('keyup');
                });
                $("#txtPropertyName").on("change", function () {
                    var propertyName = $(this).val().toLowerCase();
                    colIndex = 8;
                    $(".dataTables_scrollHead .HeaderPropertyName .cb-dropdown-wrap .cb-dropdown li").each(function () {
                        if ($(this).text().toLowerCase().indexOf(propertyName) >= 0 && $(this).text().toLowerCase() != "select all") {
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
                    if (!$(event.target).hasClass("clsPropertyName") && !$(event.target).hasClass("cb-dropdown") && !$(event.target).parent().parent().hasClass("cb-dropdown") && !$(event.target).parent().parent().parent().hasClass("cb-dropdown") && colIndex != -1 && selValue != '-1') {
                        ShowOverlayMain();  // Added By Shariq H Khan, ST-307,308, Add Loader on Property Filter
                        var table = $("#MyProposalTable").DataTable();
                        table.columns(colIndex).search(selValue).draw();
                        // Added By Shariq H Khan, ST-307,308, Add Loader on Property Filter
                        table.on('draw', function () {
                            ReloadTotals();
                            console.log("Drawing Table");
                            setTimeout(function () { HideOverlayMain(); }, 2000);
                        });

                    }
                    colIndex = -1;
                    selValue = '-1';
                    //setTimeout(function () { HideOverlayMain(); }, 2000);
                });
                //CalculateDiscountPrices(proptable, 1, 0, 1);
                //CalculateTotals(proptable);
                //ReloadTotals();
                _ReloadTotal = 1;
                ResizeMainTable();
                setTimeout(function () {
                    console.log("Checking Totals");
                    ReloadTotals();
                    HideOverlayMain(); 
                    //if (calctable == null) {
                    //    initCalcTable();
                    //}
                    //else {
                    //    //calctable.ajax.reload();
                    //    ReloadTotals();
                    //}
                },5000);
                
            },
            scrollX: true,
            //scrollY: '430px',
            scrollCollapse: true,
            fixedColumns: {
                leftColumns: $('th.HeaderUSD').attr('CountryId') == 2 ? 18 : 17,
            },

        });
    }
}

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
        proptable.ajax.reload();
    } 
    Codebase.blocks('#ProposalTableDiv', 'state_normal');   
}

$(document).ready(function () {
    ShowOverlayMain();//Added Displaying Overlay On Page Load By Shariq, 2022-08-31
    _GrossIncomeReady = false;
    initProposalTable();

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
                //$("#DiscountPriceHeader").html($("#DiscountPrice").find(":selected").text() + " Rate").show();
            }, false);
        }
    });

    $('#btnPropResetColumns').on('click', function (e) {
        //_Initialize = 1;
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

    var proptable = $("#MyProposalTable").DataTable();

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
        if (!$(event.target).hasClass("clsPropertyName") && !$(event.target).hasClass("cb-dropdown") && !$(event.target).parent().parent().hasClass("cb-dropdown") && !$(event.target).parent().parent().parent().hasClass("cb-dropdown")) {
            if (sortColumnDirection == "asc") {
                sortColumnDirection = "desc";
            }
            else {
                sortColumnDirection = "asc";
            }
            proptable.order([8, sortColumnDirection]).draw();
        }
    });

    /*Proposal Redesign - Added for Synchronous H-Scrolling for Proposal records Week SPOTS and Top right TOTALs Weeks*/
    $('.dataTables_scrollBody').on('scroll', function () {
        $('.dataTables_scrollBody').scrollLeft($(this).scrollLeft());
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

