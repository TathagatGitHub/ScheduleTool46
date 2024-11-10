var prelogeditor = null;
var prelogviewtable = null;
var editPreLog = window.location.pathname.split('/')[2] == "EditPreLog" ? true : false;
var default_network_options = [];
var default_daypart_options = [];
var default_buytype_options = [];
var startTimeErr = false;
var endTimeErr = false;
var spotTimErr = false;
var spotDateErr = false;
var preLogLineId = 0;
var indexColumnClicked = -1;
var isNetwrokLogLine = false;
var originalSpotDate = null;
var originalSpotTime = null;
var originalISCI = null;
$(document).ready(function () {
    function cbDropdown(column) {
        return $('<ul>', {
            'class': 'cb-dropdown'
        }).appendTo($('<div>', {
            'class': 'cb-dropdown-wrap'
        }).appendTo(column));
    }


    var test;
    if (!editPreLog) {
        prelogviewtable = $('#PreLogViewTable').DataTable({
            lengthMenu: [[20000], [20000]],
            //orderable: true,
            dom: 'rti<"bottom"f><"clear">',
            ajax: {
                url: '/Logs/GetPreLogLines',
                type: 'POST',
                data: {
                    prelogid: getParameterByName('prelogid'),
                    editPreLog: editPreLog
                }
            },
            searching: true,
            info: true,
            processing: true,
            //serverSide: true,
            deferRender: true,
            stateSave: false,
            stateSaveCallback: function (settings, data) {
                localStorage.setItem('DataTables_' + settings.sInstance + "_" + getParameterByName('prelogid'), JSON.stringify(data))
            },
            stateLoadCallback: function (settings, data) {
                return JSON.parse(localStorage.getItem('DataTables_' + settings.sInstance + "_" + getParameterByName('prelogid')))
            },
            /*
            stateSaveParams: function (settings, data) {
                console.log(settings);
            },
            stateLoadParams: function (settings, data) {
                console.log(settings);
            },*/
            ordering: false,
            stateDuration: 60 * 60 * 24 * 365,
            columns: [
                {
                    targets: 0,
                    data: "stdNetName",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true
                },
                {
                    targets: 1,
                    data: "propertyName",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true
                },
                {
                    targets: 2,
                    data: "mon",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (data, type, row, meta) {
                        if (data === true) {
                            /*var icon = row.childPropertyId == 0 ? "<i class='fa fa-circle'></i>" :"<i class='fa fa-circle' style='color: #2971B9;'></i>";*/
                            var icon = !row.isDOWChanged ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            return icon;
                        }
                        else {
                            return "";
                        }
                    },
                    orderable: true
                },
                {
                    targets: 3,
                    data: "tue",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (data, type, row, meta) {
                        if (data === true) {
                            var icon = !row.isDOWChanged ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            return icon;
                        }
                        else {
                            return "";
                        }
                    },
                    orderable: true
                },
                {
                    targets: 4,
                    data: "wed",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (data, type, row, meta) {
                        if (data === true) {
                            var icon = !row.isDOWChanged ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            return icon;
                        }
                        else {
                            return "";
                        }
                    },
                    orderable: true
                },
                {
                    targets: 5,
                    data: "thu",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (data, type, row, meta) {
                        if (data === true) {
                            var icon = !row.isDOWChanged ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            return icon;
                        }
                        else {
                            return "";
                        }
                    },
                    orderable: true
                },
                {
                    targets: 6,
                    data: "fri",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (data, type, row, meta) {
                        if (data === true) {
                            var icon = !row.isDOWChanged ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            return icon;
                        }
                        else {
                            return "";
                        }
                    },
                    orderable: true
                },
                {
                    targets: 7,
                    data: "sat",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (data, type, row, meta) {
                        if (data === true) {
                            var icon = !row.isDOWChanged ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            return icon;
                        }
                        else {
                            return "";
                        }
                    },
                    orderable: true
                },
                {
                    targets: 8,
                    data: "sun",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (data, type, row, meta) {
                        if (data === true) {
                            var icon = !row.isDOWChanged ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            return icon;
                        }
                        else {
                            return "";
                        }
                    },
                    orderable: true
                },
                {
                    targets: 9,
                    data: "startTime",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true,
                    render: function (d, type, row, meta) {
                        var color = !row.isTimeChanged ? "#575757" : "#2971B9";
                        if (d.length > 0 && d.substr(0, 1) == "0")
                            return `<span style='color: ${color};'>${d.substr(1)}</span>`;
                        else
                            return `<span style='color: ${color};'>${d}</span>`;
                    }
                },
                {
                    targets: 10,
                    data: "endTime",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true,
                    render: function (d, type, row, meta) {
                        var color = !row.isTimeChanged ? "#575757" : "#2971B9";
                        if (d.length > 0 && d.substr(0, 1) == "0")
                            return `<span style='color: ${color};'>${d.substr(1)}</span>`;
                        else
                            return `<span style='color: ${color};'>${d}</span>`;
                    }
                },
                {
                    targets: 11,
                    data: "dayPartCd",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true
                },
                {
                    targets: 12,
                    data: "omdp",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true
                },
                {
                    targets: 13,
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
                    },
                    orderable: true
                },
                {
                    targets: 14,
                    data: "buyType",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true
                },
                {
                    targets: 15,
                    data: "spBuy",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true
                },
                {
                    targets: 16,
                    data: "fullRate",
                    class: "d-none d-sm-table-cell text-center",
                    render: $.fn.dataTable.render.number(',', '.', 2, '$'),
                    orderable: true
                },
                {
                    targets: 17,
                    data: "rate",
                    class: "d-none d-sm-table-cell text-center",
                    render: $.fn.dataTable.render.number(',', '.', 2, '$'),
                    orderable: true
                },
                {
                    targets: 18,
                    data: "usdGrossRate",
                    class: "d-none d-sm-table-cell text-center",
                    render: $.fn.dataTable.render.number(',', '.', 2, '$'),
                    visible: true,
                    orderable: true
                },
                {
                    targets: 19,
                    data: "imp",
                    class: "d-none d-sm-table-cell text-center",
                    render: $.fn.dataTable.render.number(',', '.', 2, ''),
                    orderable: true
                },
                {
                    targets: 20, /* CPM */
                    data: "cpm",
                    class: "d-none d-sm-table-cell text-center",
                    render: $.fn.dataTable.render.number(',', '.', 2, '$'),
                    orderable: true
                    /*
                    render: function (data, type, row) {
                        try {
                            return formatCurrency(parseFloat(data.impressions) > 0 ? (parseFloat(data.rateAmt) / parseFloat(data.impressions)) : 1);
                        }
                        catch (err) {
                            return err.message;
                        }
                    }*/
                },
                {
                    targets: 21,
                    data: "spotDate",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (d) {
                        //return moment(d).format("MM/DD/YYYY");
                        if (d != null)
                            return moment(d).format("MM/DD/YYYY");
                        else
                            return d;
                    },
                    orderable: true
                },
                {
                    targets: 22,
                    data: "spotTime",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (d) {
                        if (d.length > 0 && d.substr(0, 1) == "0")
                            return d.substr(1);
                        else
                            return d;
                    },
                    orderable: true
                },
                {
                    targets: 23,
                    data: "mediaTypeCode",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true
                },
                {
                    targets: 24,
                    data: "isci",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true
                },
                {
                    targets: 25,
                    data: "programTitle",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true
                },
                {
                    targets: 26,
                    data: "cleared",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true
                },
                {
                    targets: 27,
                    data: "omdpSpotDateTime",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true
                },
                {
                    targets: 28,
                    data: "commRate",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (d) {
                        return d + '%';
                    },
                    orderable: true
                },
                {
                    targets: 29,
                    data: "caConvRate",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (d) {
                        return d.toFixed(2) + '%';
                    },
                    visible: true,
                    orderable: true
                },

                {
                    targets: 30,
                    data: "poorSeparation",
                    class: "d-none d-sm-table-cell text-center",
                    visible: false
                },


                //{
                //    targets: 28,
                //    data: "preLogLineId",                
                //    visible: false                
                //}
            ],
            drawCallback: function () {
                // Show or hide "Load more" button based on whether there is more data available
                //$('#btn-example-load-more').toggle(this.api().page.hasMore());
            },
            createdRow: function (row, data, dataIndex) {

                $(row).removeClass('table-success');
                $(row).removeClass('table-primary');
                $(row).removeClass('table-danger');
                $(row).removeClass('table-warning');
                $(row).removeClass('table-info');
                if (data.scheduled == false && data.cleared == false) {
                    $(row).addClass('table-success');
                }
                else if (data.poorSeparation == true) {
                    $(row).addClass('table-primary');
                }
                else if (data.outOfDayPart == true) {
                    $(row).addClass('table-danger');
                }

                if (data.cleared == "UNPLACED") {
                    $(row).css("background-color", "#ebf5df");
                }

                if (dataIndex > 0)
                    if (test != data.stdNetName)
                        $(row).addClass('table-secondary');
                test = data.stdNetName;

                if (data.schedLineId == null) {
                    $("td:eq(0)", row).css("background-color", "#66FF33");
                }
                if (!editPreLog && data.networkLogId > 0) {
                    $("td:eq(0)", row).css("background-color", "#66FF33");
                    $("td:eq(0)", row).css("color", "white");
                }

                if (!data.isValidISCI) {
                    $("td:eq(23)", row).addClass("pending-change");
                }
                //if (data.outOfDayPart == true) {
                //    $(row).addClass("table-danger");
                //}
            },
            initComplete: function () {
                $('#PreLogViewTable').excelTableFilter();
                CalculateTotals();
                //this.api().columns('.HeaderType').every(function () {
                //    var column = this;
                //    var selNetworks = [];
                //    var selProperties = [];
                //    var selStartTime = [];
                //    var selEndTime = [];
                //    var selDP = [];
                //    var selOMDP = [];
                //    var selSpotLen = [];
                //    var selBuyType = [];
                //    var selSPBuy = [];
                //    var selFullRateAmt = [];
                //    var selRateAmt = [];
                //    var selImpression = [];
                //    var selCPM = [];
                //    var selSpotDate = [];
                //    var selSpotTime = [];
                //    var selMediaType = [];
                //    var selISCI = [];
                //    var selProgram = [];
                //    var selCleared = [];
                //    var selDayPart = [];
                //    var selCommRate = [];
                //    var selUSDGrossRate = [];
                //    var selCAConvRate = [];

                //    var ddmenu = cbDropdown($(column.header()))
                //        .on('change', ':checkbox', function () {
                //            var vals = $(':checked', ddmenu).map(function (index, element) {
                //                return $(element).val();
                //            }).toArray().join(',');
                //            console.log(vals);
                //            var valsArr = vals.split(',');
                //            if ($(this).val() == "Select All") {
                //                if (valsArr[0] == "Select All") {
                //                    $(':checkbox', ddmenu).map(function (index, element) {
                //                        if (index > 0) {
                //                            $(element).prop("checked", true);
                //                        }
                //                    });
                //                    column
                //                        .search('')
                //                        .draw();

                //                    //Change filter color to white
                //                    ddmenu.removeClass("factive");
                //                }
                //                else {
                //                    $(':checkbox', ddmenu).map(function (index, element) {
                //                        if (index > 0) {
                //                            $(element).prop("checked", false);
                //                        }
                //                    });
                //                    column
                //                        .search('Select All Unchecked')
                //                        .draw();
                //                    //Change filter color to white
                //                    ddmenu.addClass("factive");
                //                }
                //            }

                //            else {
                //                var AvailableLength;
                //                if ($(column.header()).hasClass("HeaderNetwork")) {
                //                    AvailableLength = parseInt($("#HeaderNetworks > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderProperty")) {
                //                    AvailableLength = parseInt($("#HeaderProperties > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderStartTime")) {
                //                    AvailableLength = parseInt($("#HeaderStartTimes > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderEndTime")) {
                //                    AvailableLength = parseInt($("#HeaderEndTimes > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderDP")) {
                //                    AvailableLength = parseInt($("#HeaderDPs > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderOMDP")) {
                //                    AvailableLength = parseInt($("#HeaderOMDPs > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderSpotLen")) {
                //                    AvailableLength = parseInt($("#HeaderSpotLens > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderBuyType")) {
                //                    AvailableLength = parseInt($("#HeaderBuyTypes > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderSpBuy")) {
                //                    AvailableLength = parseInt($("#HeaderSpBuys > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderFullRateAmt")) {
                //                    AvailableLength = parseInt($("#HeaderFullRateAmts > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderRateAmt")) {
                //                    AvailableLength = parseInt($("#HeaderRateAmts > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderImpression")) {
                //                    AvailableLength = parseInt($("#HeaderImpressions > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderCPM")) {
                //                    AvailableLength = parseInt($("#HeaderCPMs > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderSpotDate")) {
                //                    AvailableLength = parseInt($("#HeaderSpotDates > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderSpotTime")) {
                //                    AvailableLength = parseInt($("#HeaderSpotTimes > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderMediaType")) {
                //                    AvailableLength = parseInt($("#HeaderMediaTypes > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderISCI")) {
                //                    AvailableLength = parseInt($("#HeaderISCIs > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderProgram")) {
                //                    AvailableLength = parseInt($("#HeaderPrograms > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderCleared")) {
                //                    AvailableLength = parseInt($("#HeaderCleareds > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderDayPart")) {
                //                    AvailableLength = parseInt($("#HeaderDayParts > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderCommRate")) {
                //                    AvailableLength = parseInt($("#HeaderCommRates > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderUSDGrossRate")) {
                //                    AvailableLength = parseInt($("#HeaderUSDGrossRate > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderCAConvRate")) {
                //                    AvailableLength = parseInt($("#HeaderCAConvRate > option").length) - 1;
                //                }

                //                else {
                //                    AvailableLength = 0;
                //                }

                //                if (AvailableLength == valsArr.length) {
                //                    if (valsArr[0] == "Select All") {
                //                        // There is one unchecked so uncheck select all    
                //                        $(':checkbox', ddmenu).map(function (index, element) {
                //                            if (index == 0) {
                //                                $(element).prop("checked", false);
                //                            }
                //                        });
                //                        //Change filter color
                //                        $(this).parent().parent().parent().addClass("factive");
                //                    }
                //                    else {
                //                        // All are checked so check select all
                //                        $(':checkbox', ddmenu).map(function (index, element) {
                //                            if (index == 0) {
                //                                $(element).prop("checked", true);
                //                            }
                //                        });
                //                        //Change filter color
                //                        $(this).parent().parent().parent().removeClass("factive");
                //                    }
                //                }
                //                else if (AvailableLength > valsArr.length) {
                //                    // There is at least one unchecked
                //                    $(':checkbox', ddmenu).map(function (index, element) {
                //                        if (index == 0) {
                //                            $(element).prop("checked", false);
                //                        }
                //                    });
                //                    //Change filter color
                //                    $(this).parent().parent().parent().addClass("factive");
                //                }
                //                else if (AvailableLength < valsArr.length) {
                //                    // This should never happen
                //                    if (valsArr.length > 0 && valsArr[0] != 'Select All') {
                //                        console.log("why? This should never happen.  " + AvailableLength + " " + valsArr.length);
                //                    }
                //                }

                //                column
                //                    .search(vals)
                //                    .draw();
                //            }
                //        });

                //    // NETWORK 
                //    if ($(column.header()).hasClass("HeaderNetwork")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selNetworks.push($("<div/>").html(d).text());
                //        });

                //        $("#HeaderNetworks > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(this.value, selNetworks) == -1 ? (this.value == "Select All" && parseInt($("#HeaderNetworks > option").length) - 1 == selNetworks.length ? true : false) : true,
                //                    value: this.value
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(this.value, selNetworks) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });

                //    }

                //    // PROPERTY
                //    else if ($(column.header()).hasClass("HeaderProperty")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selProperties.push($("<div/>").html(d).text());
                //        });

                //        $("#HeaderProperties > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(this.value, selProperties) == -1 ? (this.value == "Select All" && parseInt($("#HeaderProperties > option").length) - 1 == selProperties.length ? true : false) : true,
                //                    value: this.value
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(this.value, selProperties) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });

                //    }

                //    // START TIME
                //    else if ($(column.header()).hasClass("HeaderStartTime")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selStartTime.push($("<div/>").html(d).text());
                //        });


                //        $("#HeaderStartTimes > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(this.text, selStartTime) == -1 ? (this.text == "Select All" && parseInt($("#HeaderStartTimes > option").length) - 1 == selStartTime.length ? true : false) : true,
                //                    value: this.text
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(this.text, selStartTime) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    // END TIME
                //    else if ($(column.header()).hasClass("HeaderEndTime")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selEndTime.push($("<div/>").html(d).text());
                //        });


                //        $("#HeaderEndTimes > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(this.text, selEndTime) == -1 ? (this.text == "Select All" && parseInt($("#HeaderEndTimes > option").length) - 1 == selEndTime.length ? true : false) : true,
                //                    value: this.text
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(this.text, selEndTime) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    // DP
                //    else if ($(column.header()).hasClass("HeaderDP")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selDP.push($("<div/>").html(d).text());
                //        });


                //        $("#HeaderDPs > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(this.value, selDP) == -1 ? (this.value == "Select All" && parseInt($("#HeaderDPs > option").length) - 1 == selDP.length ? true : false) : true,
                //                    value: this.value
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(this.value, selDP) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    // OMDP
                //    else if ($(column.header()).hasClass("HeaderOMDP")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selOMDP.push($("<div/>").html(d).text());
                //        });


                //        $("#HeaderOMDPs > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(this.value, selOMDP) == -1 ? (this.value == "Select All" && parseInt($("#HeaderOMDPs > option").length) - 1 == selOMDP.length ? true : false) : true,
                //                    value: this.value
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(this.value, selOMDP) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    // SpotLen
                //    else if ($(column.header()).hasClass("HeaderSpotLen")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selSpotLen.push($("<div/>").html(d).text());
                //        });


                //        $("#HeaderSpotLens > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(this.value, selSpotLen) == -1 ? (this.value == "Select All" && parseInt($("#HeaderSpotLens > option").length) - 1 == selSpotLen.length ? true : false) : true,
                //                    value: this.value
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(this.value, selSpotLen) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    // BuyType
                //    else if ($(column.header()).hasClass("HeaderBuyType")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selBuyType.push($("<div/>").html(d).text());
                //        });


                //        $("#HeaderBuyTypes > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(this.value, selBuyType) == -1 ? (this.value == "Select All" && parseInt($("#HeaderBuyTypes > option").length) - 1 == selBuyType.length ? true : false) : true,
                //                    value: this.value
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(this.value, selBuyType) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    // SP Buy
                //    else if ($(column.header()).hasClass("HeaderSpBuy")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selSPBuy.push($("<div/>").html(d).text());
                //        });


                //        $("#HeaderSpBuys > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(this.value, selSPBuy) == -1 ? (this.value == "Select All" && parseInt($("#HeaderSpBuys > option").length) - 1 == selSPBuy.length ? true : false) : true,
                //                    value: this.value
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(this.value, selSPBuy) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    // FullRateAmt
                //    else if ($(column.header()).hasClass("HeaderFullRateAmt")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selFullRateAmt.push(parseFloat($("<div/>").html(d).text()));
                //        });


                //        $("#HeaderFullRateAmts > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(parseFloat(this.value), selFullRateAmt) == -1 ? (this.value == "Select All" && parseInt($("#HeaderFullRateAmts > option").length) - 1 == selFullRateAmt.length ? true : false) : true,
                //                    value: this.value
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(parseFloat(this.value), selFullRateAmt) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }
                //    // RateAmt
                //    else if ($(column.header()).hasClass("HeaderRateAmt")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selRateAmt.push(parseFloat($("<div/>").html(d).text()));
                //        });


                //        $("#HeaderRateAmts > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(parseFloat(this.value), selRateAmt) == -1 ? (this.value == "Select All" && parseInt($("#HeaderRateAmts > option").length) - 1 == selRateAmt.length ? true : false) : true,
                //                    value: this.value
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(parseFloat(this.value), selRateAmt) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    //USDGrossRate
                //    else if ($(column.header()).hasClass("HeaderUSDGrossRate")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selUSDGrossRate.push(parseFloat($("<div/>").html(d).text()));
                //        });


                //        $("#HeaderUSDGrossRate > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(parseFloat(this.value), selUSDGrossRate) == -1 ? (this.value == "Select All" && parseInt($("#HeaderUSDGrossRate > option").length) - 1 == selUSDGrossRate.length ? true : false) : true,
                //                    value: this.value
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(parseFloat(this.value), selUSDGrossRate) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    // Impression
                //    else if ($(column.header()).hasClass("HeaderImpression")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selImpression.push(parseFloat($("<div/>").html(d).text()));
                //        });


                //        $("#HeaderImpressions > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(parseFloat(this.value), selImpression) == -1 ? (this.value == "Select All" && parseInt($("#HeaderImpressions > option").length) - 1 == selImpression.length ? true : false) : true,
                //                    value: this.value
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(parseFloat(this.value), selImpression) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    // CPM
                //    else if ($(column.header()).hasClass("HeaderCPM")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selCPM.push(parseFloat($("<div/>").html(d).text()));
                //        });


                //        $("#HeaderCPMs > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(parseFloat(this.value), selCPM) == -1 ? (this.value == "Select All" && parseInt($("#HeaderCPMs > option").length) - 1 == selCPM.length ? true : false) : true,
                //                    value: this.value
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(parseFloat(this.value), selCPM) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    // SPOT DATE
                //    else if ($(column.header()).hasClass("HeaderSpotDate")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selSpotDate.push(moment($("<div/>").html(d).text()).format("MM/DD/YYYY"));
                //        });


                //        $("#HeaderSpotDates > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(moment(this.text).format("MM/DD/YYYY"), selSpotDate) == -1 ? (this.text == "Select All" && parseInt($("#HeaderSpotDates > option").length) - 1 == selSpotDate.length ? true : false) : true,
                //                    value: this.text
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(moment(this.text).format("MM/DD/YYYY"), selSpotDate) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    // SPOT TIME
                //    else if ($(column.header()).hasClass("HeaderSpotTime")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selSpotTime.push($("<div/>").html(d).text());
                //        });


                //        $("#HeaderSpotTimes > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(this.text, selSpotTime) == -1 ? (this.text == "Select All" && parseInt($("#HeaderSpotTimes > option").length) - 1 == selSpotTime.length ? true : false) : true,
                //                    value: this.text
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(this.text, selSpotTime) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    // MEDIA TYPE 
                //    else if ($(column.header()).hasClass("HeaderMediaType")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selMediaType.push($("<div/>").html(d).text());
                //        });


                //        $("#HeaderMediaTypes > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(this.text, selMediaType) == -1 ? (this.text == "Select All" && parseInt($("#HeaderMediaTypes > option").length) - 1 == selMediaType.length ? true : false) : true,
                //                    value: this.text
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(this.text, selMediaType) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    // ISCI 
                //    else if ($(column.header()).hasClass("HeaderISCI")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selISCI.push($("<div/>").html(d).text());
                //        });


                //        $("#HeaderISCIs > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(this.text, selISCI) == -1 ? (this.text == "Select All" && parseInt($("#HeaderISCIs > option").length) - 1 == selISCI.length ? true : false) : true,
                //                    value: this.text
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(this.text, selISCI) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    // PROGRAM 
                //    else if ($(column.header()).hasClass("HeaderProgram")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selProgram.push($("<div/>").html(d).text());
                //        });


                //        $("#HeaderPrograms > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(this.text, selProgram) == -1 ? (this.text == "Select All" && parseInt($("#HeaderPrograms > option").length) - 1 == selProgram.length ? true : false) : true,
                //                    value: this.text
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(this.text, selProgram) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    // CLEARED 
                //    else if ($(column.header()).hasClass("HeaderCleared")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selCleared.push($("<div/>").html(d).text());
                //        });


                //        $("#HeaderCleareds > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(this.text, selCleared) == -1 ? (this.text == "Select All" && parseInt($("#HeaderCleareds > option").length) - 1 == selCleared.length ? true : false) : true,
                //                    value: this.text
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(this.text, selCleared) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    // DAYPART 
                //    else if ($(column.header()).hasClass("HeaderDayPart")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selDayPart.push($("<div/>").html(d).text());
                //        });


                //        $("#HeaderDayParts > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(this.text, selDayPart) == -1 ? (this.text == "Select All" && parseInt($("#HeaderDayParts > option").length) - 1 == selDayPart.length ? true : false) : true,
                //                    value: this.text
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(this.text, selDayPart) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    // COMM RATE 
                //    else if ($(column.header()).hasClass("HeaderCommRate")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selCommRate.push($("<div/>").html(d.toFixed(2)).text());
                //        });


                //        $("#HeaderCommRates > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(this.text, selCommRate) == -1 ? (this.text == "Select All" && parseInt($("#HeaderCommRates > option").length) - 1 == selCommRate.length ? true : false) : true,
                //                    value: this.text
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(this.text, selCommRate) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    //CAConvRate
                //    else if ($(column.header()).hasClass("HeaderCAConvRate")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selCAConvRate.push($("<div/>").html(d.toFixed(2)).text());
                //        });


                //        $("#HeaderCAConvRate > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(this.text, selCAConvRate) == -1 ? (this.text == "Select All" && parseInt($("#HeaderCAConvRate > option").length) - 1 == selCAConvRate.length ? true : false) : true,
                //                    value: this.text
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(this.text, selCAConvRate) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }


                //    //Code to set the color of filters on intial load.
                //    ddmenu.children().each(function () {
                //        if (this.children[0].innerText == "Select All" && $(this).find("input[type=checkbox]")[0].checked)
                //            ddmenu.removeClass("factive");
                //    });
                //});

                document.body.style.width = ($("#PreLogViewTable").width() + 120) + 'px';

                $(".cb-dropdown-wrap").each(function () {
                    $(this).width($(this).parent().width());
                });
            }
            //   }).on('stateSaveParams.dt', function (e, settings, data) {
            //        // data.search.search = "";
            //    });
        });
    }
    else if (editPreLog) {
        GetNetworks();
        GetDayParts();
        GetBuyTypes();
        prelogeditor = new $.fn.dataTable.Editor({
            ajax: {
                create: {
                    type: "POST",
                    url: "/Logs/AddPreLogLine",
                    data: function (d) {
                        d.preLogId = getParameterByName("prelogid")
                    },
                    success: function (result) {
                        if (result.success) {
                            prelogviewtable.ajax.reload(null, false);
                            swal({
                                title: "Success",
                                text: "Row successfully added.",
                                type: "success",
                            });

                        }
                        else {
                            swal({
                                title: "Error",
                                text: result.responseText,
                                type: "error",
                            });
                        }
                    },
                    error: function (response) {
                        swal({
                            title: "Error",
                            text: response.responseText,
                            type: "error",
                        });
                    }
                },
                edit: {
                    type: "POST",
                    url: "/Logs/EditPreLogLine",
                    data: function (d) {
                        d.preLogLineId = Object.keys(d.data)[0],
                            d.preLogId = getParameterByName("prelogid"),
                            d.preLogLineIds = function () {
                                var _preLogLineIds = "";
                                if (isNetwrokLogLine) {
                                    if (prelogviewtable.rows({ selected: true }).count() > 1) {
                                        $.each(prelogviewtable.rows({ selected: true }).data(), function (key, value) {
                                            if (key == 0) {
                                                _preLogLineIds = value.preLogLineId;
                                            } else {
                                                _preLogLineIds += "," + value.preLogLineId;
                                            }
                                        });
                                    }
                                    else {
                                        _preLogLineIds = Object.keys(d.data)[0];
                                    }
                                }
                                else {
                                    _preLogLineIds = Object.keys(d.data)[0];
                                }
                                return _preLogLineIds;
                            }
                    },
                    success: function (result) {
                        if (result.success) {
                            promptExit(1);
                            prelogviewtable.ajax.reload(null, false);
                        }
                        else {
                            swal({
                                title: "Error",
                                text: result.responseText,
                                type: "error",
                            });
                        }
                    },
                    error: function (response) {
                        swal({
                            title: "Error",
                            text: response.responseText,
                            type: "error",
                        });
                    }
                }

            },

            formOptions: {
                inline: {
                    submit: "all"
                }
            },
            table: "#PreLogViewTable",
            idSrc: "preLogLineId",
            fields: [
                {
                    label: "Property Number Count#:",
                    name: "propertyLineCount"
                },
                {
                    label: "Network Name:",
                    name: "netId",
                    type: "select",
                    placeholder: "Select a network"
                },
                {
                    label: "Property Name:",
                    name: "propertyName"
                },
                {
                    label: "Days:",
                    name: "mon",
                    def: 1,
                    type: "checkbox",
                    separator: "|",
                    options: [
                        { label: "Mon", "value": 1 }
                    ]
                },
                {
                    label: "",
                    name: "tue",
                    def: 1,
                    type: "checkbox",
                    separator: "|",
                    options: [
                        { label: "Tue", "value": 1 }
                    ]
                },
                {
                    label: "",
                    name: "wed",
                    def: 1,
                    type: "checkbox",
                    separator: "|",
                    options: [
                        { label: "Wed", "value": 1 }
                    ]
                },
                {
                    label: "",
                    name: "thu",
                    def: 1,
                    type: "checkbox",
                    separator: "|",
                    options: [
                        { label: "Thu", "value": 1 }
                    ]
                },
                {
                    label: "",
                    name: "fri",
                    def: 1,
                    type: "checkbox",
                    separator: "|",
                    options: [
                        { label: "Fri", "value": 1 }
                    ]
                },
                {
                    label: "",
                    name: "sat",
                    def: 1,
                    type: "checkbox",
                    separator: "|",
                    options: [
                        { label: "Sat", "value": 1 }
                    ]
                },
                {
                    label: "",
                    name: "sun",
                    def: 1,
                    type: "checkbox",
                    separator: "|",
                    options: [
                        { label: "Sun", "value": 1 }
                    ]
                },
                {
                    label: "Start Time:",
                    name: "startTime"
                },
                {
                    label: "End Time:",
                    name: "endTime"
                },
                {
                    label: "Day Part:",
                    name: "dayPartId",
                    type: "select",
                    placeholder: "Select Day Part"
                },
                {
                    label: "Spot Length:",
                    name: "spotLen",
                    type: "select",
                    placeholder: "Select Spot Length",
                    options: [
                        { label: "15", value: "15" },
                        { label: "30", value: "30" },
                        { label: "60", value: "60" },
                        { label: "120", value: "120" },
                    ]
                },
                {
                    label: "SP Buy:",
                    name: "spBuy",
                    type: "select",
                    placeholder: "Select SP Buy",
                    options: [
                        { label: "", value: "" },
                        { label: "SP", value: "SP" }
                    ]
                },
                {
                    label: "Buy Type:",
                    name: "buyTypeId",
                    type: "select",
                    placeholder: "Select Buy Type"
                },
                {
                    label: "Rate Amt:",
                    name: "fullRate"
                },
                {
                    label: "Impressions:",
                    name: "imp"
                },
                {
                    label: "Spot Date:",
                    name: "spotDate"
                },
                {
                    label: "Spot Time:",
                    name: "spotTime"
                },
                {
                    label: "Program Title:",
                    name: "programTitle"
                },
                {
                    label: "ISCI:",
                    name: "isci"
                },
                {
                    label: "Cleared:",
                    name: "cleared",
                    type: "select",
                    options: [
                        { label: "Cleared", value: "CLEARED" },
                        { label: "Uncleared", value: "UNCLEARED" },
                        { label: "Unplaced", value: "UNPLACED" },
                    ]
                }
            ]
        });

        prelogeditor.field("startTime").input().on("change", function (e, d) {
            if (d && d.editorSet) return;
            var startTime = prelogeditor.field("startTime");
            if (startTime.val().toString().trim() != "") {
                $.ajax({
                    url: "/Logs/ValidateTime",
                    type: "GET",
                    data: { time: $(this).val() },
                    success: function (result) {
                        if (result.success) {
                            startTime.val(moment(result.responseText).format("hh:mm:ss A"));
                            startTime.error("");
                            startTimeErr = false;
                        }
                        else {
                            startTime.error(result.responseText);
                            startTimeErr = true;
                        }
                    },
                    error: function (result) {
                        startTimeErr = true;
                        startTime.error("Invalid input.");
                    }
                });
            }
        });
        prelogeditor.field("endTime").input().on("change", function (e, d) {
            if (d && d.editorSet) return;
            var endTime = prelogeditor.field("endTime");
            if (endTime.val().toString().trim() != "") {
                $.ajax({
                    url: "/Logs/ValidateTime",
                    type: "GET",
                    data: { time: $(this).val() },
                    success: function (result) {
                        if (result.success) {
                            endTime.val(moment(result.responseText).format("hh:mm:ss A"));
                            endTime.error("");
                            endTimeErr = false;
                        }
                        else {
                            endTimeErr = true;
                            endTime.error(result.responseText);
                        }
                    },
                    error: function (result) {
                        endTimeErr = true;
                        endTime.error("Invalid input.");
                    }
                });
            }
        });
        prelogeditor.field("spotDate").input().on("change", function (e, d) {
            if (d && d.editorSet) return;

            try {
                if ($(this).val().toString().trim() == "") return;
            }
            catch (err) {
                return;
            }

            var spotDate = prelogeditor.field("spotDate");
            $.ajax({
                url: "/Logs/ValidateSpotDate",
                type: "GET",
                data: {
                    weekStartDate: $("#WeekDate").html(),
                    spotDate: $(this).val()
                },
                success: function (result) {
                    if (result.success) {
                        spotDate.val(moment(result.responseText).format("MM/DD/YYYY"));
                        spotDate.error("");
                        spotDateErr = false;
                    }
                    else {
                        spotDateErr = true;
                        spotDate.error(result.responseText);
                    }
                },
                error: function (result) {
                    spotDateErr = true;
                    spotDate.error("Invalid input.");
                }
            });
        });
        prelogeditor.field("spotTime").input().on("change", function (e, d) {
            if (d && d.editorSet) return;

            try {
                if ($(this).val().toString().trim() == "") return;
            }
            catch (err) {
                return;
            }

            var spotTime = prelogeditor.field("spotTime");
            if (spotTime.val().toString().trim() != "") {
                $.ajax({
                    url: "/Logs/ValidateTime",
                    type: "GET",
                    data: { time: $(this).val() },
                    success: function (result) {
                        if (result.success) {
                            spotTime.val(moment(result.responseText).format("hh:mm:ss A"));
                            spotTime.error("");
                            spotTimErr = false;
                        }
                        else {
                            spotTimErr = true;
                            spotTime.error(result.responseText);
                        }
                    },
                    error: function (result) {
                        spotTimErr = true;
                        spotTime.error("Invalid input.");
                    }
                });
            }
        });
        prelogeditor.field("cleared").input().on("change", function (e, d) {
            if (d && d.editorSet) return;
        });
        prelogeditor.on("onInitEdit", function () {
            prelogeditor.hide("propertyLineCount");
            if (prelogeditor.field("spotDate").val().toString().trim() == "") {
                prelogeditor.field("spotDate").val("");
            }
            else {
                prelogeditor.field("spotDate").val(moment(prelogeditor.field("spotDate").val()).format("MM/DD/YYYY"));
            }

        });
        prelogeditor.on("initCreate", function () {
            prelogeditor.hide("cleared");
            prelogeditor.field("propertyLineCount").show();
            prelogeditor.field("propertyLineCount").fieldInfo('(1-10)');

            if (default_network_options.length == 0) {
                GetNetworks();
            }

            if (default_daypart_options.length == 0) {
                GetDayParts();
            }

            if (default_buytype_options.length == 0) {
                GetBuyTypes();
            }
        });
        prelogeditor.on("preSubmit", function (e, o, action) {
            if (action == "create" || action == "edit") {
                if ($("#DTE_Field_propertyLineCount").is(":visible") && this.field("propertyLineCount").val().toString().trim() != "") {
                    var propertyLineCountVal = this.field("propertyLineCount");

                    if (isNaN(parseInt(propertyLineCountVal.val().toString().trim())) == true) {
                        propertyLineCountVal.error("Entered value is not numeric.");
                    }
                    else if (parseInt(propertyLineCountVal.val().toString().trim()) > 10) {
                        propertyLineCountVal.error("Count cannot be greater than 10.");
                    }
                    else if (parseInt(propertyLineCountVal.val().toString().trim()) < 1) {
                        propertyLineCountVal.error("Count cannot be less than 1.");
                    }
                }

                var networkName = this.field("netId");
                if (networkName.val().toString().trim() == "") {
                    networkName.error('Please select a network.');
                }
                if (!isNetwrokLogLine) {
                    var dayPartId = this.field("dayPartId");
                    var dayLength = 1;

                    if (dayPartId.val().toString().trim() == "") {
                        dayPartId.error("Please select day part.");
                    }

                    var propName = this.field("propertyName");
                    if (propName.val().toString().trim() == "") {
                        propName.error("Required.");
                    }

                    var daysSelected = false;

                    if ($("#DTE_Field_mon_0").length) {
                        if ($("#DTE_Field_mon_0").is(":checked") && daysSelected == false) {
                            daysSelected = true;
                        }
                    }
                    else {
                        dayLength = 0;
                    }

                    if ($("#DTE_Field_tue_0").length) {
                        if ($("#DTE_Field_tue_0").is(":checked") && daysSelected == false) {
                            daysSelected = true;
                        }
                    }
                    else {
                        dayLength = 0;
                    }

                    if ($("#DTE_Field_wed_0").length) {
                        if ($("#DTE_Field_wed_0").is(":checked") && daysSelected == false) {
                            daysSelected = true;
                        }
                    }
                    else {
                        dayLength = 0;
                    }

                    if ($("#DTE_Field_thu_0").length) {
                        if ($("#DTE_Field_thu_0").is(":checked") && daysSelected == false) {
                            daysSelected = true;
                        }
                    }
                    else {
                        dayLength = 0;
                    }

                    if ($("#DTE_Field_fri_0").length) {
                        if ($("#DTE_Field_fri_0").is(":checked") && daysSelected == false) {
                            daysSelected = true;
                        }
                    }
                    else {
                        dayLength = 0;
                    }

                    if ($("#DTE_Field_sat_0").length) {
                        if ($("#DTE_Field_sat_0").is(":checked") && daysSelected == false) {
                            daysSelected = true;
                        }
                    }
                    else {
                        dayLength = 0;
                    }

                    if ($("#DTE_Field_sun_0").length) {
                        if ($("#DTE_Field_sun_0").is(":checked") && daysSelected == false) {
                            daysSelected = true;
                        }
                    }
                    else {
                        dayLength = 0;
                    }

                    var daysSelectedMessage = this.field("thu");

                    if (dayLength != 0 && daysSelected == false) {
                        daysSelectedMessage.error("<span style=color:#b11f1f;font-size:11px;padding-left:0px;> Please select atleast one day.</span>");
                    }

                    var startTime = this.field("startTime");
                    if (startTime.val().toString().trim() == "") {
                        startTime.error("Required.");
                    }
                    else {

                        if (startTimeErr) {
                            startTime.error("Invalid input.");
                        }
                    }

                    var endTime = this.field("endTime");
                    if (endTime.val().toString().trim() == "") {
                        endTime.error("Required.");
                    }
                    else {
                        if (endTimeErr) {
                            endTime.error("Invalid input.");
                        }
                    }

                    var impressions = this.field("imp");
                    if (impressions.val().toString().trim() == "") {
                        impressions.error("Required.");
                    } else {
                        if (isNumber(impressions.val()) == false) {
                            impressions.error("Invalid input. Decimal expected.");
                        }
                    }
                }
                var spotLength = this.field("spotLen");
                if (spotLength.val().toString().trim() == "") {
                    spotLength.error("Required.");
                }

                var rateAmt = this.field("fullRate");
                if (rateAmt.val().toString().trim() == "") {
                    rateAmt.error("Required.");
                }
                else {
                    if (isNumber(rateAmt.val()) == false) {
                        rateAmt.error("Invalid input. Decimal expected.");
                    }
                }

                var spotDate = this.field("spotDate");
                if (spotDate.val().toString().trim() != "") {
                    if (spotDateErr || (isNetwrokLogLine && (spotDate.val() != originalSpotDate))) {
                        spotDate.error("Invalid input.");
                    }
                }

                var spotTime = this.field("spotTime");
                if (spotTime.val().toString().trim() != "") {
                    if (spotTimErr || (isNetwrokLogLine && (spotTime.val() != originalSpotTime))) {
                        spotTime.error("Invalid input.");
                    }

                }

                var isci = this.field("isci");
                if (isci.val().toString().trim() != "") {
                    if (isNetwrokLogLine && (isci.val() != originalISCI)) {
                        isci.error("Invalid input.");
                    }

                }


                if (this.inError()) {
                    return false;
                }
            }
        });
        prelogeditor.on('close', function () {
            DisableEditFields(false);
            isNetwrokLogLine = false;
        });
        prelogeditor.on("open", function () {
            if (isNetwrokLogLine) {
                DisableEditFields(true);
            }
            else {
                DisableEditFields(false);
            }
            $(".DTE_Field_Type_checkbox").css("float", "left");
            $(".DTE_Field.DTE_Field_Type_checkbox").css("padding-right", "10px");
            $(".DTE_Field.DTE_Field_Type_checkbox").css("padding-top", "6px");


            if ($("div[class*='DTE_Field DTE_Field_Type_checkbox DTE_Field_Name_mon']")) {
                $("div[class*='DTE_Field DTE_Field_Type_checkbox DTE_Field_Name_mon']").css("float", "left");
                $("div[class*='DTE_Field DTE_Field_Type_checkbox DTE_Field_Name_mon']").css("padding-right", "10px");
                $("div[class*='DTE_Field DTE_Field_Type_checkbox DTE_Field_Name_mon']").css("padding-left", "150px");
                $("div[class*='DTE_Field DTE_Field_Type_checkbox DTE_Field_Name_mon']").css("padding-top", "0px");

            }

            $(".DTE_Field.DTE_Field_Type_checkbox").removeClass("DTE_Field");
            $(".DTED_Lightbox_Wrapper").draggable();

        });
        prelogeditor.field('propertyLineCount').input().on('blur', function (e, d) {

            if (prelogeditor.field('propertyLineCount').val().toString().trim() > 1) {
                prelogeditor.field('spotDate').disable();
                prelogeditor.field('spotTime').disable();
                prelogeditor.field('programTitle').disable();
                prelogeditor.field('isci').disable();
            }
            else {
                prelogeditor.field('spotDate').enable();
                prelogeditor.field('spotTime').enable();
                prelogeditor.field('programTitle').enable();
                prelogeditor.field('isci').enable();
            }
        });
        prelogeditor.field("fullRate").input().on("keyup", function (e, d) {
            var selectedCountryId = getParameterByName('logsSelectedCountryId');
            if (selectedCountryId == 5) {
                this.value = this.value.replace(/[^0-9]/g, '');
            }
        });
        prelogviewtable = $('#PreLogViewTable').DataTable({
            //lengthMenu: [[100,200,300,400,500], [100,200,300,400,500]],
            lengthMenu: [[20000], [20000]],
            ajax: {
                url: '/Logs/GetPreLogLines',
                type: 'POST',
                data: {
                    prelogid: getParameterByName('prelogid'),
                    editPreLog: editPreLog
                }
            },
            searching: true,
            info: true,
            //pageLength: 500,
            //paging: true,
            processing: true,
            //serverSide: false,
            deferRender: true,
            stateSave: false,
            //stateSave: true,
            stateSaveCallback: function (settings, data) {
                localStorage.setItem('DataTables_' + settings.sInstance + "_" + getParameterByName('prelogid'), JSON.stringify(data))
            },
            stateLoadCallback: function (settings, data) {
                return JSON.parse(localStorage.getItem('DataTables_' + settings.sInstance + "_" + getParameterByName('prelogid')))
            },
            ordering: false,
            stateDuration: 60 * 60 * 24 * 365,
            //dom: 'B<"clear">lrtip', 
            dom: 'Brt<"bottom"f><"clear">',
            buttons: [
                {
                    text: "Add Duplicate Property",
                    enabled: false,
                    action: function (dt) {
                        swal({
                            title: "",
                            text: "Are you sure you want to duplicate selected Property?",
                            type: "question",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Yes",
                            preConfirm: function () {
                                return new Promise(function (resolve) {
                                    setTimeout(function () {
                                        resolve();
                                    }, 50);
                                });
                            }
                        }).then(() => {
                            var preLogId = GetParameterValues("prelogid");

                            swal({
                                showCancelButton: true,
                                html: "Enter Duplicate Property Count (1-10): <input id='txtAddDuplicatePropertyCount' autofocus class='form-control swal2-input'>",
                                preConfirm: function (selectedOption) {
                                    return new Promise(function (resolve) {
                                        var duplicatePropertyCount = document.getElementById("txtAddDuplicatePropertyCount").value;
                                        if (isNaN(duplicatePropertyCount)) {
                                            throw new Error("Entered value is not a numeric. Please enter valid number (1-10).")
                                        }
                                        if (duplicatePropertyCount > 10) {
                                            throw new Error("Count cannot be greater than 10.")
                                        }
                                        if (duplicatePropertyCount < 1) {
                                            throw new Error("Count cannot be less than 1.")
                                        }
                                        else {
                                            resolve({ value: document.getElementById("txtAddDuplicatePropertyCount").value });
                                        }
                                    });
                                },
                                onOpen: function () {
                                    $("#txtAddDuplicatePropertyCount").focus();
                                }

                            }).then(function (result) {
                                var propertyDuplicateCount = result.value;
                                $.ajax({
                                    url: "/Logs/PrelogAddDuplicateProperty",
                                    type: "POST",
                                    data: { preLogId, preLogLineId, propertyDuplicateCount },
                                    cache: false,
                                    success: function (result) {
                                        prelogviewtable.ajax.reload(null, false);
                                        prelogviewtable.button(0).enable(false);
                                        swal({
                                            title: "Result",
                                            text: result.responseText,
                                        });
                                    },
                                    error: function (response) {
                                        swal({
                                            title: "Error",
                                            text: response.responseText,
                                            type: "error",
                                        });
                                    }
                                });
                            }).catch(swal.noop)
                        });
                    }
                },
                "copy",
                { extend: "create", editor: prelogeditor },
                {
                    text: "Save Changes",
                    action: function () {
                        swal({
                            title: "",
                            text: "Are you sure you want to Save?",
                            type: "question",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Yes",
                            preConfirm: function () {
                                return new Promise(function (resolve) {
                                    setTimeout(function () {
                                        resolve();
                                    }, 50);
                                });
                            }
                        }).then(() => {
                            $.ajax({
                                url: "/Logs/PreLogSaveChanges",
                                type: "POST",
                                data: { preLogId: GetParameterValues("prelogid") },
                                cache: false,
                                //success: function (result) {
                                //    promptExit(0);
                                //    prelogviewtable.ajax.reload(null, false);
                                //    swal({
                                //        title: "Result",
                                //        text: result.responseText,
                                //    });
                                //    //setTimeout(function () { location.reload(); }, 1000);
                                success: function (result) {
                                    swal({
                                        title: "Result",
                                        text: result.responseText,
                                    }).then(
                                        function (result) {
                                            promptExit(0);
                                            // Reloading the page should lock it again.
                                            window.location.reload();
                                        });
                                },
                                error: function (response) {
                                    swal({
                                        title: "Error",
                                        text: response.responseText,
                                        type: 'error',
                                    });
                                }
                            });
                        });
                    }
                }
            ],
            keys: {
                columns: [22, 23, 25, 26, 27],
                editor: prelogeditor,
                editorKeys: "tab-only"
            },
            select: {
                style: "os",
                selector: "td:first-child",
                //blurable: true
            },
            columns: [
                {
                    targets: 0,
                    data: null,
                    defaultContent: "",
                    className: "select-checkbox",
                    searchable: false,
                    orderable: false,
                },
                {
                    targets: 1,
                    data: "stdNetName",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true
                },
                {
                    targets: 2,
                    data: "propertyName",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true
                },
                {
                    targets: 3,
                    data: "mon",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (data, type, row, meta) {
                        if (data === true) {
                            var icon = !row.isDOWChanged ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            return icon;
                        }
                        else {
                            return "";
                        }
                    },
                    orderable: true
                },
                {
                    targets: 4,
                    data: "tue",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (data, type, row, meta) {
                        if (data === true) {
                            var icon = !row.isDOWChanged ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            return icon;
                        }
                        else {
                            return "";
                        }
                    },
                    orderable: true
                },
                {
                    targets: 5,
                    data: "wed",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (data, type, row, meta) {
                        if (data === true) {
                            var icon = !row.isDOWChanged ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            return icon;
                        }
                        else {
                            return "";
                        }
                    },
                    orderable: true
                },
                {
                    targets: 6,
                    data: "thu",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (data, type, row, meta) {
                        if (data === true) {
                            var icon = !row.isDOWChanged ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            return icon;
                        }
                        else {
                            return "";
                        }
                    },
                    orderable: true
                },
                {
                    targets: 7,
                    data: "fri",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (data, type, row, meta) {
                        if (data === true) {
                            var icon = !row.isDOWChanged ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            return icon;
                        }
                        else {
                            return "";
                        }
                    },
                    orderable: true
                },
                {
                    targets: 8,
                    data: "sat",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (data, type, row, meta) {
                        if (data === true) {
                            var icon = !row.isDOWChanged ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            return icon;
                        }
                        else {
                            return "";
                        }
                    },
                    orderable: true
                },
                {
                    targets: 9,
                    data: "sun",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (data, type, row, meta) {
                        if (data === true) {
                            var icon = !row.isDOWChanged ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            return icon;
                        }
                        else {
                            return "";
                        }
                    },
                    orderable: true
                },
                {
                    targets: 10,
                    data: "startTime",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true,
                    render: function (d, type, row, meta) {
                        var color = !row.isTimeChanged ? "#575757" : "#2971B9";
                        if (d.length > 0 && d.substr(0, 1) == "0")
                            return `<span style='color: ${color};'>${d.substr(1)}</span>`;
                        else
                            return `<span style='color: ${color};'>${d}</span>`;

                    }
                },
                {
                    targets: 11,
                    data: "endTime",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true,
                    render: function (d, type, row, meta) {
                        var color = !row.isTimeChanged ? "#575757" : "#2971B9";
                        if (d.length > 0 && d.substr(0, 1) == "0")
                            return `<span style='color: ${color};'>${d.substr(1)}</span>`;
                        else
                            return `<span style='color: ${color};'>${d}</span>`;
                    }
                },
                {
                    targets: 12,
                    data: "dayPartCd",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true
                },
                {
                    targets: 13,
                    data: "omdp",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true
                },
                {
                    targets: 14,
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
                    },
                    orderable: true
                },
                {
                    targets: 15,
                    data: "buyType",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true
                },
                {
                    targets: 16,
                    data: "spBuy",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true
                },
                {
                    targets: 17,
                    data: "fullRate",
                    class: "d-none d-sm-table-cell text-center",
                    render: $.fn.dataTable.render.number(',', '.', 2, '$'),
                    orderable: true
                },
                {
                    targets: 18,
                    data: "rate",
                    class: "d-none d-sm-table-cell text-center",
                    render: $.fn.dataTable.render.number(',', '.', 2, '$'),
                    orderable: true
                },
                {
                    targets: 19,
                    data: "usdGrossRate",
                    class: "d-none d-sm-table-cell text-center",
                    render: $.fn.dataTable.render.number(',', '.', 2, '$'),
                    visible: true,
                    orderable: true
                },
                {
                    targets: 20,
                    data: "imp",
                    class: "d-none d-sm-table-cell text-center",
                    render: $.fn.dataTable.render.number(',', '.', 2, ''),
                    orderable: true
                },
                {
                    targets: 21,
                    data: "cpm",
                    class: "d-none d-sm-table-cell text-center",
                    render: $.fn.dataTable.render.number(',', '.', 2, '$'),
                    orderable: true
                },
                {
                    targets: 22,
                    data: "spotDate",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (d) {
                        if (d != null)
                            return moment(d).format("MM/DD/YYYY");
                        else
                            return d;
                    },
                    orderable: true
                },
                {
                    targets: 23,
                    data: "spotTime",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (d) {
                        if (d.length > 0 && d.substr(0, 1) == "0")
                            return d.substr(1);
                        else
                            return d;
                    },
                    orderable: true
                },
                {
                    targets: 24,
                    data: "mediaTypeCode",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true
                },
                {
                    targets: 25,
                    data: "isci",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true
                },
                {
                    targets: 26,
                    data: "programTitle",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true
                },
                {
                    targets: 27,
                    data: "cleared",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true
                },
                {
                    targets: 28,
                    data: "omdpSpotDateTime",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true
                },
                {
                    targets: 29,
                    data: "commRate",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (d) {
                        return d + '%';
                    },
                    orderable: true
                },
                {
                    targets: 30,
                    data: "caConvRate",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (d) {
                        return d.toFixed(2) + '%';
                    },
                    visible: true,
                    orderable: true
                },
                {
                    targets: 31,
                    data: "poorSeparation",
                    class: "d-none d-sm-table-cell text-center",
                    visible: false
                },

            ],
            createdRow: function (row, data, dataIndex) {
                $(row).removeClass('table-success');
                $(row).removeClass('table-primary');
                $(row).removeClass('table-danger');
                $(row).removeClass('table-warning');
                $(row).removeClass('table-info');
                if (data.scheduled == false && data.cleared == false) {
                    $(row).addClass('table-success');
                }
                else if (data.poorSeparation == true) {
                    $(row).addClass('table-primary');
                }
                else if (data.outOfDayPart == true) {
                    $(row).addClass('table-danger');
                }

                if (data.cleared == "UNPLACED") {
                    $(row).css("background-color", "#ebf5df");
                }

                if (dataIndex > 0)
                    if (test != data.stdNetName)
                        $(row).addClass('table-secondary');
                test = data.stdNetName;

                if (data.preLogLineId < 0 || data.schedLineId == null) {
                    $("td:eq(1)", row).css("background-color", "#66FF33");
                }
                if (data.networkLogId > 0) {
                    $("td:eq(1)", row).css("background-color", "#66FF33");
                    $("td:eq(1)", row).css("color", "white");
                }
                if (data.origSpotDate != data.spotDate) {
                    $("td:eq(21)", row).addClass("pending-change");
                }
                if (data.origSpotTime != data.spotTime) {
                    $("td:eq(22)", row).addClass("pending-change");
                }
                if (data.origISCI != data.isci) {
                    $("td:eq(24)", row).addClass("pending-change");
                }
                if (!data.isValidISCI) {
                    $("td:eq(24)", row).addClass("pending-change");
                }
                if (data.origProgramTitle != data.programTitle) {
                    $("td:eq(25)", row).addClass("pending-change");
                }

                //if (data.outOfDayPart == true) {
                //    $(row).addClass("table-danger");
                //}
            },
            initComplete: function () {
                prelogeditor.field("netId").update(default_network_options);
                prelogeditor.field("dayPartId").update(default_daypart_options)
                prelogeditor.field("buyTypeId").update(default_buytype_options);
                $('#PreLogViewTable').excelTableFilter();
                CalculateTotals();
                prelogviewtable.buttons().container().appendTo($(".divButtons"))
                //this.api().columns('.HeaderType').every(function () {
                //    var column = this;
                //    var selNetworks = [];
                //    var selProperties = [];
                //    var selStartTime = [];
                //    var selEndTime = [];
                //    var selDP = [];
                //    var selOMDP = [];
                //    var selSpotLen = [];
                //    var selBuyType = [];
                //    var selSPBuy = [];
                //    var selFullRateAmt = [];
                //    var selRateAmt = [];
                //    var selImpression = [];
                //    var selCPM = [];
                //    var selSpotDate = [];
                //    var selSpotTime = [];
                //    var selMediaType = [];
                //    var selISCI = [];
                //    var selProgram = [];
                //    var selCleared = [];
                //    var selDayPart = [];
                //    var selCommRate = [];
                //    var selUSDGrossRate = [];
                //    var selCAConvRate = [];

                //    var ddmenu = cbDropdown($(column.header()))
                //        .on('change', ':checkbox', function () {
                //            var vals = $(':checked', ddmenu).map(function (index, element) {
                //                return $(element).val();
                //            }).toArray().join(',');
                //            var valsArr = vals.split(',');
                //            if ($(this).val() == "Select All") {
                //                if (valsArr[0] == "Select All") {
                //                    $(':checkbox', ddmenu).map(function (index, element) {
                //                        if (index > 0) {
                //                            $(element).prop("checked", true);
                //                        }
                //                    });
                //                    column
                //                        .search('')
                //                        .draw();

                //                    //Change filter color to white
                //                    ddmenu.removeClass("factive");
                //                }
                //                else {
                //                    $(':checkbox', ddmenu).map(function (index, element) {
                //                        if (index > 0) {
                //                            $(element).prop("checked", false);
                //                        }
                //                    });
                //                    column
                //                        .search('Select All Unchecked')
                //                        .draw();
                //                    //Change filter color to white
                //                    ddmenu.addClass("factive");
                //                }
                //            }

                //            else {
                //                var AvailableLength;
                //                if ($(column.header()).hasClass("HeaderNetwork")) {
                //                    AvailableLength = parseInt($("#HeaderNetworks > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderProperty")) {
                //                    AvailableLength = parseInt($("#HeaderProperties > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderStartTime")) {
                //                    AvailableLength = parseInt($("#HeaderStartTimes > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderEndTime")) {
                //                    AvailableLength = parseInt($("#HeaderEndTimes > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderDP")) {
                //                    AvailableLength = parseInt($("#HeaderDPs > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderOMDP")) {
                //                    AvailableLength = parseInt($("#HeaderOMDPs > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderSpotLen")) {
                //                    AvailableLength = parseInt($("#HeaderSpotLens > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderBuyType")) {
                //                    AvailableLength = parseInt($("#HeaderBuyTypes > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderSpBuy")) {
                //                    AvailableLength = parseInt($("#HeaderSpBuys > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderFullRateAmt")) {
                //                    AvailableLength = parseInt($("#HeaderFullRateAmts > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderRateAmt")) {
                //                    AvailableLength = parseInt($("#HeaderRateAmts > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderImpression")) {
                //                    AvailableLength = parseInt($("#HeaderImpressions > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderCPM")) {
                //                    AvailableLength = parseInt($("#HeaderCPMs > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderSpotDate")) {
                //                    AvailableLength = parseInt($("#HeaderSpotDates > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderSpotTime")) {
                //                    AvailableLength = parseInt($("#HeaderSpotTimes > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderMediaType")) {
                //                    AvailableLength = parseInt($("#HeaderMediaTypes > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderISCI")) {
                //                    AvailableLength = parseInt($("#HeaderISCIs > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderProgram")) {
                //                    AvailableLength = parseInt($("#HeaderPrograms > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderCleared")) {
                //                    AvailableLength = parseInt($("#HeaderCleareds > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderDayPart")) {
                //                    AvailableLength = parseInt($("#HeaderDayParts > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderCommRate")) {
                //                    AvailableLength = parseInt($("#HeaderCommRates > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderUSDGrossRate")) {
                //                    AvailableLength = parseInt($("#HeaderUSDGrossRate > option").length) - 1;
                //                }
                //                else if ($(column.header()).hasClass("HeaderCAConvRate")) {
                //                    AvailableLength = parseInt($("#HeaderCAConvRate > option").length) - 1;
                //                }

                //                else {
                //                    AvailableLength = 0;
                //                }

                //                if (AvailableLength == valsArr.length) {
                //                    if (valsArr[0] == "Select All") {
                //                        // There is one unchecked so uncheck select all    
                //                        $(':checkbox', ddmenu).map(function (index, element) {
                //                            if (index == 0) {
                //                                $(element).prop("checked", false);
                //                            }
                //                        });
                //                        //Change filter color
                //                        $(this).parent().parent().parent().addClass("factive");
                //                    }
                //                    else {
                //                        // All are checked so check select all
                //                        $(':checkbox', ddmenu).map(function (index, element) {
                //                            if (index == 0) {
                //                                $(element).prop("checked", true);
                //                            }
                //                        });
                //                        //Change filter color
                //                        $(this).parent().parent().parent().removeClass("factive");
                //                    }
                //                }
                //                else if (AvailableLength > valsArr.length) {
                //                    // There is at least one unchecked
                //                    $(':checkbox', ddmenu).map(function (index, element) {
                //                        if (index == 0) {
                //                            $(element).prop("checked", false);
                //                        }
                //                    });
                //                    //Change filter color
                //                    $(this).parent().parent().parent().addClass("factive");
                //                }

                //                column
                //                    .search(vals)
                //                    .draw();
                //            }
                //        });

                //    // NETWORK 
                //    if ($(column.header()).hasClass("HeaderNetwork")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selNetworks.push($("<div/>").html(d).text());
                //        });

                //        $("#HeaderNetworks > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(this.value, selNetworks) == -1 ? (this.value == "Select All" && parseInt($("#HeaderNetworks > option").length) - 1 == selNetworks.length ? true : false) : true,
                //                    value: this.value
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(this.value, selNetworks) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });

                //    }

                //    // PROPERTY
                //    else if ($(column.header()).hasClass("HeaderProperty")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selProperties.push($("<div/>").html(d).text());
                //        });

                //        $("#HeaderProperties > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(this.value, selProperties) == -1 ? (this.value == "Select All" && parseInt($("#HeaderProperties > option").length) - 1 == selProperties.length ? true : false) : true,
                //                    value: this.value
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(this.value, selProperties) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });

                //    }

                //    // START TIME
                //    else if ($(column.header()).hasClass("HeaderStartTime")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selStartTime.push($("<div/>").html(d).text());
                //        });


                //        $("#HeaderStartTimes > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(this.text, selStartTime) == -1 ? (this.text == "Select All" && parseInt($("#HeaderStartTimes > option").length) - 1 == selStartTime.length ? true : false) : true,
                //                    value: this.text
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(this.text, selStartTime) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    // END TIME
                //    else if ($(column.header()).hasClass("HeaderEndTime")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selEndTime.push($("<div/>").html(d).text());
                //        });


                //        $("#HeaderEndTimes > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(this.text, selEndTime) == -1 ? (this.text == "Select All" && parseInt($("#HeaderEndTimes > option").length) - 1 == selEndTime.length ? true : false) : true,
                //                    value: this.text
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(this.text, selEndTime) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    // DP
                //    else if ($(column.header()).hasClass("HeaderDP")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selDP.push($("<div/>").html(d).text());
                //        });


                //        $("#HeaderDPs > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(this.value, selDP) == -1 ? (this.value == "Select All" && parseInt($("#HeaderDPs > option").length) - 1 == selDP.length ? true : false) : true,
                //                    value: this.value
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(this.value, selDP) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    // OMDP
                //    else if ($(column.header()).hasClass("HeaderOMDP")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selOMDP.push($("<div/>").html(d).text());
                //        });


                //        $("#HeaderOMDPs > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(this.value, selOMDP) == -1 ? (this.value == "Select All" && parseInt($("#HeaderOMDPs > option").length) - 1 == selOMDP.length ? true : false) : true,
                //                    value: this.value
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(this.value, selOMDP) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    // SpotLen
                //    else if ($(column.header()).hasClass("HeaderSpotLen")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selSpotLen.push($("<div/>").html(d).text());
                //        });


                //        $("#HeaderSpotLens > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(this.value, selSpotLen) == -1 ? (this.value == "Select All" && parseInt($("#HeaderSpotLens > option").length) - 1 == selSpotLen.length ? true : false) : true,
                //                    value: this.value
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(this.value, selSpotLen) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    // BuyType
                //    else if ($(column.header()).hasClass("HeaderBuyType")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selBuyType.push($("<div/>").html(d).text());
                //        });


                //        $("#HeaderBuyTypes > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(this.value, selBuyType) == -1 ? (this.value == "Select All" && parseInt($("#HeaderBuyTypes > option").length) - 1 == selBuyType.length ? true : false) : true,
                //                    value: this.value
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(this.value, selBuyType) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    // SP Buy
                //    else if ($(column.header()).hasClass("HeaderSpBuy")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selSPBuy.push($("<div/>").html(d).text());
                //        });


                //        $("#HeaderSpBuys > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(this.value, selSPBuy) == -1 ? (this.value == "Select All" && parseInt($("#HeaderSpBuys > option").length) - 1 == selSPBuy.length ? true : false) : true,
                //                    value: this.value
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(this.value, selSPBuy) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    // FullRateAmt
                //    else if ($(column.header()).hasClass("HeaderFullRateAmt")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selFullRateAmt.push(parseFloat($("<div/>").html(d).text()));
                //        });


                //        $("#HeaderFullRateAmts > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(parseFloat(this.value), selFullRateAmt) == -1 ? (this.value == "Select All" && parseInt($("#HeaderFullRateAmts > option").length) - 1 == selFullRateAmt.length ? true : false) : true,
                //                    value: this.value
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(parseFloat(this.value), selFullRateAmt) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }
                //    // RateAmt
                //    else if ($(column.header()).hasClass("HeaderRateAmt")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selRateAmt.push(parseFloat($("<div/>").html(d).text()));
                //        });


                //        $("#HeaderRateAmts > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(parseFloat(this.value), selRateAmt) == -1 ? (this.value == "Select All" && parseInt($("#HeaderRateAmts > option").length) - 1 == selRateAmt.length ? true : false) : true,
                //                    value: this.value
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(parseFloat(this.value), selRateAmt) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    //USDGrossRate
                //    else if ($(column.header()).hasClass("HeaderUSDGrossRate")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selUSDGrossRate.push(parseFloat($("<div/>").html(d).text()));
                //        });


                //        $("#HeaderUSDGrossRate > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(parseFloat(this.value), selUSDGrossRate) == -1 ? (this.value == "Select All" && parseInt($("#HeaderUSDGrossRate > option").length) - 1 == selUSDGrossRate.length ? true : false) : true,
                //                    value: this.value
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(parseFloat(this.value), selUSDGrossRate) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    // Impression
                //    else if ($(column.header()).hasClass("HeaderImpression")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selImpression.push(parseFloat($("<div/>").html(d).text()));
                //        });


                //        $("#HeaderImpressions > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(parseFloat(this.value), selImpression) == -1 ? (this.value == "Select All" && parseInt($("#HeaderImpressions > option").length) - 1 == selImpression.length ? true : false) : true,
                //                    value: this.value
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(parseFloat(this.value), selImpression) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    // CPM
                //    else if ($(column.header()).hasClass("HeaderCPM")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selCPM.push(parseFloat($("<div/>").html(d).text()));
                //        });


                //        $("#HeaderCPMs > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(parseFloat(this.value), selCPM) == -1 ? (this.value == "Select All" && parseInt($("#HeaderCPMs > option").length) - 1 == selCPM.length ? true : false) : true,
                //                    value: this.value
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(parseFloat(this.value), selCPM) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    // SPOT DATE
                //    else if ($(column.header()).hasClass("HeaderSpotDate")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selSpotDate.push(moment($("<div/>").html(d).text()).format("MM/DD/YYYY"));
                //        });


                //        $("#HeaderSpotDates > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(moment(this.text).format("MM/DD/YYYY"), selSpotDate) == -1 ? (this.text == "Select All" && parseInt($("#HeaderSpotDates > option").length) - 1 == selSpotDate.length ? true : false) : true,
                //                    value: this.text
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(moment(this.text).format("MM/DD/YYYY"), selSpotDate) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    // SPOT TIME
                //    else if ($(column.header()).hasClass("HeaderSpotTime")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selSpotTime.push($("<div/>").html(d).text());
                //        });


                //        $("#HeaderSpotTimes > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(this.text, selSpotTime) == -1 ? (this.text == "Select All" && parseInt($("#HeaderSpotTimes > option").length) - 1 == selSpotTime.length ? true : false) : true,
                //                    value: this.text
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(this.text, selSpotTime) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    // MEDIA TYPE 
                //    else if ($(column.header()).hasClass("HeaderMediaType")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selMediaType.push($("<div/>").html(d).text());
                //        });


                //        $("#HeaderMediaTypes > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(this.text, selMediaType) == -1 ? (this.text == "Select All" && parseInt($("#HeaderMediaTypes > option").length) - 1 == selMediaType.length ? true : false) : true,
                //                    value: this.text
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(this.text, selMediaType) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    // ISCI 
                //    else if ($(column.header()).hasClass("HeaderISCI")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selISCI.push($("<div/>").html(d).text());
                //        });


                //        $("#HeaderISCIs > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(this.text, selISCI) == -1 ? (this.text == "Select All" && parseInt($("#HeaderISCIs > option").length) - 1 == selISCI.length ? true : false) : true,
                //                    value: this.text
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(this.text, selISCI) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    // PROGRAM 
                //    else if ($(column.header()).hasClass("HeaderProgram")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selProgram.push($("<div/>").html(d).text());
                //        });


                //        $("#HeaderPrograms > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(this.text, selProgram) == -1 ? (this.text == "Select All" && parseInt($("#HeaderPrograms > option").length) - 1 == selProgram.length ? true : false) : true,
                //                    value: this.text
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(this.text, selProgram) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    // CLEARED 
                //    else if ($(column.header()).hasClass("HeaderCleared")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selCleared.push($("<div/>").html(d).text());
                //        });


                //        $("#HeaderCleareds > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(this.text, selCleared) == -1 ? (this.text == "Select All" && parseInt($("#HeaderCleareds > option").length) - 1 == selCleared.length ? true : false) : true,
                //                    value: this.text
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(this.text, selCleared) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    // DAYPART 
                //    else if ($(column.header()).hasClass("HeaderDayPart")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selDayPart.push($("<div/>").html(d).text());
                //        });


                //        $("#HeaderDayParts > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(this.text, selDayPart) == -1 ? (this.text == "Select All" && parseInt($("#HeaderDayParts > option").length) - 1 == selDayPart.length ? true : false) : true,
                //                    value: this.text
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(this.text, selDayPart) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    // COMM RATE 
                //    else if ($(column.header()).hasClass("HeaderCommRate")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selCommRate.push($("<div/>").html(d.toFixed(2)).text());
                //        });


                //        $("#HeaderCommRates > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(this.text, selCommRate) == -1 ? (this.text == "Select All" && parseInt($("#HeaderCommRates > option").length) - 1 == selCommRate.length ? true : false) : true,
                //                    value: this.text
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(this.text, selCommRate) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }

                //    //CAConvRate
                //    else if ($(column.header()).hasClass("HeaderCAConvRate")) {
                //        column.data().unique().sort().each(function (d, j) {
                //            selCAConvRate.push($("<div/>").html(d.toFixed(2)).text());
                //        });


                //        $("#HeaderCAConvRate > option").each(function () {
                //            var // wrapped
                //                $label = $('<label>'),
                //                $text = $('<span>', {
                //                    text: this.text
                //                }),
                //                $cb = $('<input>', {
                //                    type: 'checkbox',
                //                    checked: jQuery.inArray(this.text, selCAConvRate) == -1 ? (this.text == "Select All" && parseInt($("#HeaderCAConvRate > option").length) - 1 == selCAConvRate.length ? true : false) : true,
                //                    value: this.text
                //                });

                //            $text.appendTo($label);
                //            $cb.appendTo($label);
                //            ddmenu.append($('<li>').append($label));
                //            if (jQuery.inArray(this.text, selCAConvRate) != -1) {
                //                ddmenu.addClass("factive");
                //            }
                //        });
                //    }


                //    //Code to set the color of filters on intial load.
                //    ddmenu.children().each(function () {
                //        if (this.children[0].innerText == "Select All" && $(this).find("input[type=checkbox]")[0].checked)
                //            ddmenu.removeClass("factive");
                //    });
                //});

                document.body.style.width = ($("#PreLogViewTable").width() + 120) + 'px';

                $(".cb-dropdown-wrap").each(function () {
                    $(this).width($(this).parent().width());
                });
            }
        });        
    }


    // Clear filters.  The state saves this but OM doesn't want to save filters.
    /*
    var table = $('#UpfrontTable').DataTable();
    table
        .search('')
        .columns().search('')
        .draw();
    */

    // Add icons to all show/hide buttons
    prelogviewtable.columns().eq(0).each(function (index) {
        var colStat = prelogviewtable.column(index);
        var that = $('#ShowHideButton' + index.toString());
        if (colStat.visible()) {
            $(that).attr('class', 'btn btn-outline-secondary');
        }
        else {
            $(that).attr('class', 'btn btn-outline-danger');
        }
    });


    // EXPORT
    $('#btnExportSubmit').click(function () {
        var _prelogid = GetParameterValues('prelogid');
        var params = [
            'height=' + screen.height - 50,
            'width=' + screen.width - 50,
            'resizable=yes',
            'scrollbars=yes'
        ].join(',');

        var _preloglinesids = "";
        var table = $('#PreLogViewTable').DataTable();
        $("#PreLogViewTable tbody tr").each(function () {
            //_preloglinesids.push(table.row(this).data().preLogLineId);
            _preloglinesids += "," + table.row(this).data().preLogLineId;
        });

        window.location.href = "/Logs/Export?prelogid=" + _prelogid + "&preloglinesids=" + _preloglinesids;
    });

    $('#btnExportAllSubmit').click(function () {
        var _prelogid = GetParameterValues('prelogid');
        var params = [
            'height=' + screen.height - 50,
            'width=' + screen.width - 50,
            'resizable=yes',
            'scrollbars=yes'
        ].join(',');

        var selectedCountryId = getParameterByName('logsSelectedCountryId');
        window.location.href = "/Logs/PrelogExcelExport?prelogid=" + _prelogid + "&countryID=" + selectedCountryId;
    });

    $('#btnSummary').click(function () {
        var _prelogid = GetParameterValues('prelogid');
        var params = [
            'height=' + screen.height - 50,
            'width=' + screen.width - 50,
            'resizable=yes',
            'scrollbars=yes'
        ].join(',');

        window.location.href = "/Logs/Summary?prelogid=" + _prelogid;
    });

    // RELOAD
    $('#btnReload').on('click', function () {
        prelogviewtable.ajax.reload(null, false);
    });

    // RESET STATE
    $('#btnPropResetColumns').on('click', function (e) {
        var buttonName;
        var table = $('#PreLogViewTable').DataTable();
        table.columns().eq(0).each(function (index) {
            var column = table.column(index);
            if (!column.visible()) {
                column.visible(true);
                buttonName = "#ShowHideButton" + index;
                $(buttonName)[0].className = 'btn btn-outline-secondary';
            }
        });
        promptExit(0);
    });

    // RESET STATE
    $('#btnPropResetFilters').on('click', function (e) {
        var table = $('#PreLogViewTable').DataTable();
        table
            .search('')
            .columns().search('')
            .draw();
        setTimeout(function () {
            promptExit(0);
            window.location.reload();
        }, 1000);
    });

    // Show/Hide columns
    $('#btnPropShowColumns').on('click', function (e) {
        $("#divColumnVisibility").toggle();
    });
    if (editPreLog) {
        $('#PreLogViewTable').on('click', 'tbody td', function () {
            indexColumnClicked = $(this).index();
        });

        $('#PreLogViewTable').on('click', 'tbody tr', function () {
            var data = prelogviewtable.row(this).data();
            preLogLineId = data.preLogLineId;
            isNetwrokLogLine = false;
            originalSpotDate = moment(data.origSpotDate).format("MM/DD/YYYY");
            originalSpotTime = data.origSpotTime;
            originalISCI = data.origISCI;
            var preLogLineIdMatched = false;
            var schedlueLine = false;
            var networkLogLine = true;
            var networkSpotLenRateMatched = true;
            var netId = 0;
            var spotLen = 0;
            var rate = 0;
            if (prelogviewtable.rows({ selected: true }).count() > 0 && indexColumnClicked > 0) {
                $.each(prelogviewtable.rows({ selected: true }).data(), function (key, value) {
                    if (value.preLogLineId == preLogLineId) {
                        preLogLineIdMatched = true;
                    }
                });
                if (!preLogLineIdMatched) {
                    prelogviewtable.rows({ selected: true }).deselect();
                }
                $.each(prelogviewtable.rows({ selected: true }).data(), function (key, value) {
                    if (value.scheduleLineId != null && value.schedLineId > 0) {
                        schedlueLine = true;
                    }
                    if (value.networkLogId == null || value.networkLogId == 0) {
                        networkLogLine = false;
                    }
                    if (key == 0) {
                        netId = value.netId;
                        spotLen = value.spotLen;
                        rate = value.rate;
                    } else {
                        if (netId != value.netId || spotLen != value.spotLen || rate != value.rate) {
                            networkSpotLenRateMatched = false;
                        }
                    }
                });
                if (schedlueLine) {
                    swal('', 'Schedule Line is not editable.', 'warning');
                    return false;
                }
                if (!networkLogLine) {
                    swal('', 'Please select Network Log Lines.', 'warning');
                    return false;
                }
                if (!networkSpotLenRateMatched) {
                    swal('', 'Please select same Network/Rate/Spot Length.', 'warning');
                    return false;
                }
            }
            if (data.networkLogId > 0) {
                isNetwrokLogLine = true;
            }
            if (indexColumnClicked > 0 && indexColumnClicked < 17 && (data.preLogLineId < 0 || data.schedLineId == null || isNetwrokLogLine)) {
                prelogviewtable.row(this).edit();
                prelogeditor.buttons([{ text: 'Update', action: function () { this.submit(); } }, { text: 'Copy Property Details', action: function () { PreLogGetPropertyDetails(); } }]);
                prelogeditor.hide("cleared");
            }
            else if (indexColumnClicked == 26) {
                prelogeditor.show("cleared");
            }

        });

        prelogviewtable.on('select deselect', function () {
            var selectedRows = prelogviewtable.rows({ selected: true }).count();
            prelogviewtable.button(0).enable(selectedRows === 1);
            if (selectedRows >= 1) {
                $("#btnPreLogMoveSpotData").removeAttr('disabled');
            } else {
                $("#btnPreLogMoveSpotData").attr('disabled', 'disabled');
            }

        });
    }

    var prelogDataTable = $('#PreLogViewTable').DataTable();
    var selectedCountryId = getParameterByName('logsSelectedCountryId');
    var usdGorssRateIndex = $('th:contains("USD GROSS RATE")').index();
    var caConvRateIndex = $('th:contains("CA CONV. RATE")').index();
    if (selectedCountryId == 5) {
        prelogDataTable.column(usdGorssRateIndex).visible(false);
        prelogDataTable.column(caConvRateIndex).visible(false);
    }
})

function CalculateTotals() {
    var totalClearedSpots = 0; totalClearedFullRate = 0; totalClearedRate = 0; totalClearedIMP = 0;
    var totalUnClearedSpots = 0; totalUnClearedFullRate = 0; totalUnClearedRate = 0; totalUnClearedIMP = 0;
    var totalUnPlacedSpots = 0; totalUnPlacedFullRate = 0; totalUnPlacedRate = 0; totalUnPlacedIMP = 0;
    var totalSpots = 0; totalFullRate = 0; totalRate = 0; totalIMP = 0;
    var index1 = 25;
    var index2 = 16;
    if (editPreLog) {
        index1 = 26;
        index2 = 17;
    }
    $("#PreLogViewTable tbody tr").not("tr[style *='display: none;']").each(function (index, row) {
        if (row.childNodes[index1].innerText == "CLEARED") {
            totalClearedSpots += 1;
            if (row.childNodes[index2].innerText != "")
                totalClearedFullRate += parseFloat(row.childNodes[index2].innerText.replace("$", "").replace(",", ""));
            if (row.childNodes[index2 + 1].innerText != "")
                totalClearedRate += parseFloat(row.childNodes[index2 + 1].innerText.replace("$", "").replace(",", ""));
            if (row.childNodes[index2 + 2].innerText != "")
                totalClearedIMP += parseFloat(row.childNodes[index2 + 2].innerText.replace(",", ""));
        } else if (row.childNodes[index1].innerText == "UNCLEARED") {
            totalUnClearedSpots += 1;
            if (row.childNodes[index2].innerText != "")
                totalUnClearedFullRate += parseFloat(row.childNodes[index2].innerText.replace("$", "").replace(",", ""));
            if (row.childNodes[index2 + 1].innerText != "")
                totalUnClearedRate += parseFloat(row.childNodes[index2 + 1].innerText.replace("$", "").replace(",", ""));
            if (row.childNodes[index2 + 2].innerText != "")
                totalUnClearedIMP += parseFloat(row.childNodes[index2 + 2].innerText.replace(",", ""));
        } else if (row.childNodes[index1].innerText == "UNPLACED") {
            totalUnPlacedSpots += 1;
            if (row.childNodes[index2].innerText != "")
                totalUnPlacedFullRate += parseFloat(row.childNodes[index2].innerText.replace("$", "").replace(",", ""));
            if (row.childNodes[index2 + 1].innerText != "")
                totalUnPlacedRate += parseFloat(row.childNodes[index2 + 1].innerText.replace("$", "").replace(",", ""));
            if (row.childNodes[index2 + 2].innerText != "")
                totalUnPlacedIMP += parseFloat(row.childNodes[index2 + 2].innerText.replace(",", ""));
        }
    });
    totalSpots = totalClearedSpots + totalUnClearedSpots + totalUnPlacedSpots;
    totalFullRate = totalClearedFullRate + totalUnClearedFullRate + totalUnPlacedFullRate;
    totalRate = totalClearedRate + totalUnClearedRate + totalUnPlacedRate;
    totalIMP = totalClearedIMP + totalUnClearedIMP + totalUnPlacedIMP;

    $("#lblTotalClearedSpots").text(ReplaceNumberWithCommas(totalClearedSpots));
    $("#lblTotalClearedFullRate").text(formatCurrency(totalClearedFullRate, 2));
    $("#lblTotalClearedRate").text(formatCurrency(totalClearedRate, 2));
    $("#lblTotalClearedIMP").text(ReplaceNumberWithCommas(totalClearedIMP.toFixed(2)));

    $("#lblTotalUnClearedSpots").text(ReplaceNumberWithCommas(totalUnClearedSpots));
    $("#lblTotalUnClearedFullRate").text(formatCurrency(totalUnClearedFullRate, 2));
    $("#lblTotalUnClearedRate").text(formatCurrency(totalUnClearedRate, 2));
    $("#lblTotalUnClearedIMP").text(ReplaceNumberWithCommas(totalUnClearedIMP.toFixed(2)));

    $("#lblTotalUnPlacedSpots").text(ReplaceNumberWithCommas(totalUnPlacedSpots));
    $("#lblTotalUnPlacedFullRate").text(formatCurrency(totalUnPlacedFullRate, 2));
    $("#lblTotalUnPlacedRate").text(formatCurrency(totalUnPlacedRate, 2));
    $("#lblTotalUnPlacedIMP").text(ReplaceNumberWithCommas(totalUnPlacedIMP.toFixed(2)));

    $("#lblTotalSpots").text(ReplaceNumberWithCommas(totalSpots));
    $("#lblTotalFullRate").text(formatCurrency(totalFullRate, 2));
    $("#lblTotalRate").text(formatCurrency(totalRate, 2));
    $("#lblTotalIMP").text(ReplaceNumberWithCommas(totalIMP.toFixed(2)));

    if ($("#PreLogViewTable tbody tr[style *='display: none;']").length > 0)
        $("#lblFilter").text("Yes");
    else
        $("#lblFilter").text("No");
};
function ShowHideColumn(columnIdx, that) {
    var prelogtable = $("#PreLogViewTable").DataTable();
    var colStat = prelogtable.column(columnIdx);
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
function FilterMenuItemVisibility(filterMenus, index) {
    var fm = filterMenus.map(function (filterMenu) {
        return {
            column: filterMenu.column,
            item: filterMenu.inputs.map(function (input) {
                return input.value.trim().replace(/ +(?= )/g, '');
            })
        };
    });

    if (editPreLog) {
        var col2 = []; var col10 = []; var col11 = []; var col12 = []; var col13 = []; var col14 = []; var col15 = []; var col16 = []; var col17 = []; var col18 = [];
        var col19 = []; var col20 = []; var col21 = []; var col22 = []; var col23 = []; var col24 = []; var col25 = []; var col26 = []; var col27 = []; var col28 = [];

        if (index == 1) {
            $("#PreLogViewTable tbody tr").not("[style *= 'display: none']").each(function () {
                col2.push($(this).find("td:eq(2)")[0].innerText);
                col10.push($(this).find("td:eq(10)")[0].innerText);
                col11.push($(this).find("td:eq(11)")[0].innerText);
                col12.push($(this).find("td:eq(12)")[0].innerText);
                col13.push($(this).find("td:eq(13)")[0].innerText);
                col14.push($(this).find("td:eq(14)")[0].innerText);
                col15.push($(this).find("td:eq(15)")[0].innerText);
                col16.push($(this).find("td:eq(16)")[0].innerText);
                col17.push($(this).find("td:eq(17)")[0].innerText);
                col18.push($(this).find("td:eq(18)")[0].innerText);
                col19.push($(this).find("td:eq(19)")[0].innerText);
                col20.push($(this).find("td:eq(20)")[0].innerText);
                col21.push($(this).find("td:eq(21)")[0].innerText);
                col22.push($(this).find("td:eq(22)")[0].innerText);
                col23.push($(this).find("td:eq(23)")[0].innerText);
                col24.push($(this).find("td:eq(24)")[0].innerText);
                col25.push($(this).find("td:eq(25)")[0].innerText);
                col26.push($(this).find("td:eq(26)")[0].innerText);
                col27.push($(this).find("td:eq(27)")[0].innerText);
                col28.push($(this).find("td:eq(28)")[0].innerText);
            });
            for (var j = 0; j <= fm[2].item.length; j++) {
                if (jQuery.inArray(fm[2].item[j], col2) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[2])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[2])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[10].item.length; j++) {
                if (jQuery.inArray(fm[10].item[j], col10) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[10])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[10])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[11].item.length; j++) {
                if (jQuery.inArray(fm[11].item[j], col11) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[11])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[11])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[12].item.length; j++) {
                if (jQuery.inArray(fm[12].item[j], col12) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[12])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[12])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[13].item.length; j++) {
                if (jQuery.inArray(fm[13].item[j], col13) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[13])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[13])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[14].item.length; j++) {
                if (jQuery.inArray(fm[14].item[j], col14) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[14])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[14])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[15].item.length; j++) {
                if (jQuery.inArray(fm[15].item[j], col15) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[15])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[15])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[16].item.length; j++) {
                if (jQuery.inArray(fm[16].item[j], col16) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[16])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[16])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[17].item.length; j++) {
                if (jQuery.inArray(fm[17].item[j], col17) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[17])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[17])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[18].item.length; j++) {
                if (jQuery.inArray(fm[18].item[j], col18) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[18])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[18])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[19].item.length; j++) {
                if (jQuery.inArray(fm[19].item[j], col19) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[19])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[19])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[20].item.length; j++) {
                if (jQuery.inArray(fm[20].item[j], col20) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[20])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[20])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[21].item.length; j++) {
                if (jQuery.inArray(fm[21].item[j], col21) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[21])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[21])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[22].item.length; j++) {
                if (jQuery.inArray(fm[22].item[j], col22) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[22])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[22])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[23].item.length; j++) {
                if (jQuery.inArray(fm[23].item[j], col23) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[23])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[23])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[24].item.length; j++) {
                if (jQuery.inArray(fm[24].item[j], col24) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[24])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[24])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[25].item.length; j++) {
                if (jQuery.inArray(fm[25].item[j], col25) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[25])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[25])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[26].item.length; j++) {
                if (jQuery.inArray(fm[26].item[j], col26) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[26])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[26])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[27].item.length; j++) {
                if (jQuery.inArray(fm[27].item[j], col27) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[27])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[27])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[28].item.length; j++) {
                if (jQuery.inArray(fm[28].item[j], col28) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[28])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[28])[0]).find("div")[j + 1]).addClass("d-none"); }
            }

        }
    }
    else if (!editPreLog) {
        var col1 = []; var col9 = []; var col10 = []; var col11 = []; var col12 = []; var col13 = []; var col14 = []; var col15 = []; var col16 = []; var col17 = [];
        var col18 = []; var col19 = []; var col20 = []; var col21 = []; var col22 = []; var col23 = []; var col24 = []; var col25 = []; var col26 = []; var col27 = [];

        if (index == 0) {

            $("#PreLogViewTable tbody tr").not("[style *= 'display: none']").each(function () {
                col1.push($(this).find("td:eq(1)")[0].innerText);
                col9.push($(this).find("td:eq(9)")[0].innerText);
                col10.push($(this).find("td:eq(10)")[0].innerText);
                col11.push($(this).find("td:eq(11)")[0].innerText);
                col12.push($(this).find("td:eq(12)")[0].innerText);
                col13.push($(this).find("td:eq(13)")[0].innerText);
                col14.push($(this).find("td:eq(14)")[0].innerText);
                col15.push($(this).find("td:eq(15)")[0].innerText);
                col16.push($(this).find("td:eq(16)")[0].innerText);
                col17.push($(this).find("td:eq(17)")[0].innerText);
                col18.push($(this).find("td:eq(18)")[0].innerText);
                col19.push($(this).find("td:eq(19)")[0].innerText);
                col20.push($(this).find("td:eq(20)")[0].innerText);
                col21.push($(this).find("td:eq(21)")[0].innerText);
                col22.push($(this).find("td:eq(22)")[0].innerText);
                col23.push($(this).find("td:eq(23)")[0].innerText);
                col24.push($(this).find("td:eq(24)")[0].innerText);
                col25.push($(this).find("td:eq(25)")[0].innerText);
                col26.push($(this).find("td:eq(26)")[0].innerText);
                col27.push($(this).find("td:eq(27)")[0].innerText);
            });

            for (var j = 0; j <= fm[1].item.length; j++) {
                if (jQuery.inArray(fm[1].item[j], col1) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[1])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[1])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[9].item.length; j++) {
                if (jQuery.inArray(fm[9].item[j], col9) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[9])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[9])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[10].item.length; j++) {
                if (jQuery.inArray(fm[10].item[j], col10) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[10])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[10])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[11].item.length; j++) {
                if (jQuery.inArray(fm[11].item[j], col11) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[11])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[11])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[12].item.length; j++) {
                if (jQuery.inArray(fm[12].item[j], col12) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[12])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[12])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[13].item.length; j++) {
                if (jQuery.inArray(fm[13].item[j], col13) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[13])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[13])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[14].item.length; j++) {
                if (jQuery.inArray(fm[14].item[j], col14) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[14])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[14])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[15].item.length; j++) {
                if (jQuery.inArray(fm[15].item[j], col15) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[15])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[15])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[16].item.length; j++) {
                if (jQuery.inArray(fm[16].item[j], col16) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[16])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[16])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[17].item.length; j++) {
                if (jQuery.inArray(fm[17].item[j], col17) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[17])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[17])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[18].item.length; j++) {
                if (jQuery.inArray(fm[18].item[j], col18) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[18])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[18])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[19].item.length; j++) {
                if (jQuery.inArray(fm[19].item[j], col19) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[19])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[19])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[20].item.length; j++) {
                if (jQuery.inArray(fm[20].item[j], col20) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[20])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[20])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[21].item.length; j++) {
                if (jQuery.inArray(fm[21].item[j], col21) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[21])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[21])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[22].item.length; j++) {
                if (jQuery.inArray(fm[22].item[j], col22) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[22])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[22])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[23].item.length; j++) {
                if (jQuery.inArray(fm[23].item[j], col23) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[23])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[23])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[24].item.length; j++) {
                if (jQuery.inArray(fm[24].item[j], col24) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[24])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[24])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[25].item.length; j++) {
                if (jQuery.inArray(fm[25].item[j], col25) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[25])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[25])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[26].item.length; j++) {
                if (jQuery.inArray(fm[26].item[j], col26) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[26])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[26])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
            for (var j = 0; j <= fm[27].item.length; j++) {
                if (jQuery.inArray(fm[27].item[j], col27) >= 0) { $($($($("#PreLogViewTable th .checkbox-container")[27])[0]).find("div")[j + 1]).removeClass("d-none"); }
                else { $($($($("#PreLogViewTable th .checkbox-container")[27])[0]).find("div")[j + 1]).addClass("d-none"); }
            }
        }

    }
}
if (editPreLog) {
    function GetNetworks() {
        $.ajax({
            url: "/Logs/GetNetworks",
            type: "POST",
            data: {
                logsSelectedCountryId: getParameterByName('logsSelectedCountryId')
            },
            success: function (result) {
                for (var x = 0; x < result.data.length; x++) {
                    default_network_options.push({
                        value: result.data[x].networkId,
                        label: result.data[x].stdNetName
                    });
                }
            },
            error: function (response) {
                var notify = $.notify(response.responseText, {
                    type: "danger",
                    allow_dismiss: true,
                });
            }
        });
    }

    function GetDayParts() {
        $.ajax({
            url: "/Logs/GetDayParts",
            type: "POST",
            success: function (result) {
                for (var x = 0; x < result.data.length; x++) {
                    default_daypart_options.push({
                        value: result.data[x].dayPartId,
                        label: result.data[x].dayPartCd
                    });
                }
            },
            error: function (response) {
                var notify = $.notify(response.responseText, {
                    type: "danger",
                    allow_dismiss: true,
                });
            }
        });
    }

    function GetBuyTypes() {
        $.ajax({
            url: "/Logs/GetBuyTypes",
            type: "POST",
            success: function (result) {
                for (var x = 0; x < result.data.length; x++) {
                    default_buytype_options.push({
                        value: result.data[x].buyTypeId,
                        label: result.data[x].buyTypeCode
                    });
                }
            },
            error: function (response) {
                var notify = $.notify(response.responseText, {
                    type: "danger",
                    allow_dismiss: true,
                });
            }


        });
    }

    function DisableEditFields(isDisable) {
        if (isDisable) {
            prelogeditor.disable("netId");
            prelogeditor.disable("spotLen");
            prelogeditor.disable("fullRate");
            //prelogeditor.disable("spotDate");
            //prelogeditor.disable("spotTime");             
        }
        else {
            prelogeditor.enable("netId");
            prelogeditor.enable("spotLen");
            prelogeditor.enable("fullRate");
            prelogeditor.enable("spotDate");
            prelogeditor.enable("spotTime");
            prelogeditor.enable("isci");
            prelogeditor.enable("programTitle");
        }
    }

}