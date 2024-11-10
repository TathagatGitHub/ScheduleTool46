var editor_ur;
var sortColumnDirection = "asc";
function cbDropdown(column) {
    return $('<ul>', {
        'class': 'cb-dropdown'
    }).appendTo($('<div>', {
        'class': 'cb-dropdown-wrap'
    }).appendTo(column));
}

$(document).ready(function () {
    var selected = [];
    editor_ur = new $.fn.dataTable.Editor({
        ajax: {
            url: '/UpfrontRemnant/GetUpfrontData',
            type: 'POST',
            data: {
                upfrontId: getParameterByName('upfrontid'),
                viewOnly: false
            },
            success: function (result) {
                if (result.success) {
                }
                else {
                    swal('Error!', result.responseText, 'error');
                }
            },
            error: function (response) {
                window.location.replace ('/Home/Logout');
            }
        },
        table: "#UpfrontTable",
        idSrc: "upfrontLineId",
        fields: [
            {
                label: "Property Name:",
                name: "propertyName",                
            },
            {
                label: "Start Time:  ",
                name: "startTime",
                type: 'datetime',
                format: 'h:mm A',
                fieldInfo: '12 hour clock format',
                opts: {
                    minutesIncrement: 30
                }
            },
            {
                label: "End Time:  ",
                name: "endTime",
                type: 'datetime',
                format: 'h:mm A',
                fieldInfo: '12 hour clock format',
                opts: {
                    minutesIncrement: 30,
                }
            },
            {
                label: "DP:",
                name: "dayPartCd",
                type: "select"
            },
            {
                label: "Rate:",
                name: "rateAmt",
                className: "editable"
            },
            {
                label: "Impressions:",
                name: "impressions",
                className: "editable"
            },
            {
                label: "Buy Type:",
                name: "buyTypeCode",
                type: "select"
            },
            {
                label: "Status (DNB):",
                name: "doNotBuyTypeDescription",
                className: "editable",
                type: "select"
            },
            {
                label: "Mandate Client:",
                name: "mandateClientName",
                className: "editable",
                type: "select"
            },
            {
                label: "Eff Dt:",
                name: "effectiveDate",
                type: "select"
            },
            {
                label: "Exp Dt:",
                name: "expirationDate",
                type: "select"
            },
            {
                label: "SP Buy:",
                name: "spBuy",
                type: "select"
            }

        ]
    });


    var upfronttable = $('#UpfrontTable').DataTable({
        lengthMenu: [[6000], [6000]],
        dom: 'rti<"bottom"f><"clear">',
        ajax: {
            url: '/UpfrontRemnant/GetUpfrontData',
            type: 'POST',
            data: {
                upfrontId: getParameterByName('upfrontid'),
                viewOnly: false
            },
        },
        searching: true,
        info: true,
        processing: true,
        serverSide: true,
        deferRender: true,
        stateSave: true,
        stateSaveCallback: function (settings, data) {            
            localStorage.setItem('DataTables_' + settings.sInstance + "_" + getParameterByName('upfrontid'), JSON.stringify(data));
          //  ReloadHeader(settings, data, true);
            ReloadApproved(settings, data);
            ReloadDemoNames(settings, data);
            ReloadPropertyNames(settings, data);
            ReloadStartTime(settings, data);
            ReloadEndTime(settings, data);
            ReloadDayPart(settings, data);
            ReloadOMDP(settings, data);
            ReloadBuyType(settings, data);
            ReloadLens(settings, data);
            ReloadRateAmts(settings, data);
            ReloadImpressions(settings, data);
            ReloadCPMs(settings, data);
            ReloadDoNotBuyTypes(settings, data);
            ReloadClients(settings, data);
            ReloadRev(settings, data);
            ReloadRevisedDates(settings, data);
            ReloadEffectiveDates(settings, data);
            ReloadExpirationDates(settings, data);
            ReloadSPBuy(settings, data);
            ReloadWeekDay(settings, data, 1); //Monday
            ReloadWeekDay(settings, data, 2); //tuesday
            ReloadWeekDay(settings, data, 3); //Wednesday
            ReloadWeekDay(settings, data, 4); // Thursday
            ReloadWeekDay(settings, data, 5); // Friday
            ReloadWeekDay(settings, data, 6); //Saturday
            ReloadWeekDay(settings, data, 7); // Sunday    
         //   ReloadHeader(settings, data, true);
            sortColumnDirection = data.order[0][1];
        },
        stateLoadCallback: function (settings, data) {
            return JSON.parse(localStorage.getItem('DataTables_' + settings.sInstance + "_" + getParameterByName('upfrontid')))
        },
        /*
        stateSaveParams: function (settings, data) {
            console.log(settings);
        },
        stateLoadParams: function (settings, data) {
            console.log(settings);
        },*/
        ordering: true,
        order: [[3, "asc"]],
        stateDuration: 60 * 60 * 24 * 365,
        keys: {
            columns: ':not(:first-child)',
            editor: editor_ur
        },        
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
                data: "demoName",
                class: "d-none d-sm-table-cell text-center",
                visible: true,
                searchable: true,
                orderable: false,
            },
            {
                targets: 2,
                /*data: "approvedDesc",*/
                data: "approved",
                class: "d-none d-sm-table-cell text-center",
                render: function (data, type, row, meta) {
                    /*if (data === "Approved") {*/
                    if (data === true) {
                        return "<i class='fa fa-check'></i>";
                    }
                    else {
                        return "<i class='fa fa-times'></i>";
                    }
                },
                orderable: false
            },
            {
                targets: 3,
                data: "propertyName",
                class: "d-none d-sm-table-cell text-center",
                className: "editable",
                render: $.fn.dataTable.render.ellipsis(39, true),
                orderable: false,
                width: '300px',
            },
            {
                targets: 4,
                data: "monday",
                class: "d-none d-sm-table-cell text-center",
                render: function (data, type, row, meta) {
                    if (data === true) {
                        return "<i class='fa fa-circle'></i>";
                    }
                    else {
                        return "<i class='fa fa-circle-o'></i>";
                    }
                },
                orderable: false
            },
            {
                targets: 5,
                data: "tuesday",
                class: "d-none d-sm-table-cell text-center",
                render: function (data, type, row, meta) {
                    if (data === true) {
                        return "<i class='fa fa-circle'></i>";
                    }
                    else {
                        return "<i class='fa fa-circle-o'></i>";
                    }
                },
                orderable: false
            },
            {
                targets: 6,
                data: "wednesday",
                class: "d-none d-sm-table-cell text-center",
                render: function (data, type, row, meta) {
                    if (data === true) {
                        return "<i class='fa fa-circle'></i>";
                    }
                    else {
                        return "<i class='fa fa-circle-o'></i>";
                    }
                },
                orderable: false
            },
            {
                targets: 7,
                data: "thursday",
                class: "d-none d-sm-table-cell text-center",
                render: function (data, type, row, meta) {
                    if (data === true) {
                        return "<i class='fa fa-circle'></i>";
                    }
                    else {
                        return "<i class='fa fa-circle-o'></i>";
                    }
                },
                orderable: false
            },
            {
                targets: 8,
                data: "friday",
                class: "d-none d-sm-table-cell text-center",
                render: function (data, type, row, meta) {
                    if (data === true) {
                        return "<i class='fa fa-circle'></i>";
                    }
                    else {
                        return "<i class='fa fa-circle-o'></i>";
                    }
                },
                orderable: false
            },
            {
                targets: 9,
                data: "saturday",
                class: "d-none d-sm-table-cell text-center",
                render: function (data, type, row, meta) {
                    if (data === true) {
                        return "<i class='fa fa-circle'></i>";
                    }
                    else {
                        return "<i class='fa fa-circle-o'></i>";
                    }
                },
                orderable: false
            },
            {
                targets: 10,
                data: "sunday",
                class: "d-none d-sm-table-cell text-center",
                render: function (data, type, row, meta) {
                    if (data === true) {
                        return "<i class='fa fa-circle'></i>";
                    }
                    else {
                        return "<i class='fa fa-circle-o'></i>";
                    }
                },
                orderable: false
            },
            {
                targets: 11,
                data: "startTime",
                class: "d-none d-sm-table-cell text-center",
                render: function (data, type, row, meta) {
                    return moment(data).format("hh:mm a");
                },
                orderable: false
            },
            {
                targets: 12,
                data: "endTime",
                class: "d-none d-sm-table-cell text-center",
                render: function (d) {
                    return moment(d).format("hh:mm a");
                },
                orderable: false
            },
            {
                targets: 13,
                data: "dayPartCd",
                class: "d-none d-sm-table-cell text-center",
                className: "editable",
                orderable: false,
            },
            {
                targets: 14,
                data: "omdp",
                class: "d-none d-sm-table-cell text-center",
                className: "editable",
                orderable: false,
            },   
            {
                targets: 15,
                data: "spBuy",
                class: "d-none d-sm-table-cell text-center",
                className: "editable",
                render: function (data, type, row, meta) {
                    if (data === "True") {
                        return "SP";
                    }
                    else if (data === "False") {
                        return "";
                    }
                },
                orderable: false,
            },
            {
                targets: 16,
                data: "buyTypeCode",
                class: "d-none d-sm-table-cell text-center",
                className: "editable",
                orderable: false,
            },
            {
                targets: 17,
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
                orderable: false
            },
            {
                targets: 18,
                data: "rateAmt",
                class: "d-none d-sm-table-cell text-center",
                render: function (d) {
                    if (d == 0) {
                        return '--';
                    }
                    else {
                        return $.fn.dataTable.render.number(',', '.', 2, '$').display(d);
                    }
                },
                orderable: false
            },
            {
                targets: 19,
                data: "impressions",
                class: "d-none d-sm-table-cell text-center",
                render: $.fn.dataTable.render.number(',', '.', 2, ''),
                orderable: false
            },
            {
                targets: 20, /* CPM */
                data: "cpm",
                class: "d-none d-sm-table-cell text-center",
                render: $.fn.dataTable.render.number(',', '.', 2, '$'),
                orderable: false
            },
            {
                targets: 21,
                data: "doNotBuyTypeDescription",
                class: "d-none d-sm-table-cell text-center",
                orderable: false,
            },
            {
                targets: 22,
                data: "mandateClientName",
                class: "d-none d-sm-table-cell text-center",
                orderable: false
            },
            {
                targets: 23,
                data: "revision",
                class: "d-none d-sm-table-cell text-center",
                orderable: false
            },
            {
                targets: 24,
                data: "rateRevisedDate",
                class: "d-none d-sm-table-cell text-center",
                render: function (d) {
                    return moment(d).format("MM/DD/YYYY");
                },
                orderable: false
            },
            {
                targets: 25,
                data: "effectiveDate",
                class: "d-none d-sm-table-cell text-center",
                className: "editable",
                render: function (d) {
                    return moment(d).format("MM/DD/YYYY");
                },
                orderable: false
            },
            {
                targets: 26,
                data: "expirationDate",
                class: "d-none d-sm-table-cell text-center",
                className: "editable",
                render: function (d) {
                    return moment(d).format("MM/DD/YYYY");
                },
                orderable: false
            },

        ],
        select: {
            style: 'multi+shift',
            selector: 'td:first-child',
            blurable: false
        },
        drawCallback: function () {
            //console.log('drawCallback');
            // If there is some more data
            //if ($('#btn-example-load-more').is(':visible')) {
            // Scroll to the "Load more" button
            //    $('html, body').animate({
            //        scrollTop: $('#btn-example-load-more').offset().top
            //    }, 1000);
            //}

            // Show or hide "Load more" button based on whether there is more data available
            $('#btn-example-load-more').toggle(this.api().page.hasMore());
        },
        createdRow: function (row, data, dataIndex, cells) {
            $(row).attr('id', data.upfrontLineId);
            if (data.spotLen === 30 && data.approved == false && data.approveLock == false) {
                $(row).addClass('bg-gray-lighter');
            }
            if (data.propertyNameUpdateDt) {
                // COLINDEX -- 3 is the current column index of PropertyName
                $('td', row).eq(3).addClass('text-danger');
            }
            if (data.spBuyUpdateDt) {                
                $('td', row).eq(15).addClass('text-danger');
            }
            if (data.buyTypeIdUpdateDt) {
                // COLINDEX -- 16 is the column index of BuyTypeId
                $('td', row).eq(16).addClass('text-danger');
            }
            if (Date.parse(data.rateUpdateDt) > Date.parse('1/1/2000')) {
                // COLINDEX -- 18 is the column index of RateAmt
                $('td', row).eq(18).addClass('text-danger');
                // COLINDEX -- 20 is the column index of CPM
                $('td', row).eq(20).addClass('text-danger');
            }
            if (data.impressionsUpdateDt) {
                // COLINDEX -- 19 is the column index of Impressions
                $('td', row).eq(19).addClass('text-danger');
                $('td', row).eq(20).addClass('text-danger');
            }
            if (data.daysUpdateDt) {
                // COLINDEX -- 18 is the column index of Monday-Sunday
                $('td', row).eq(4).addClass('text-danger'); // Monday
                $('td', row).eq(5).addClass('text-danger'); // Tuesday
                $('td', row).eq(6).addClass('text-danger'); // Wednesday
                $('td', row).eq(7).addClass('text-danger'); // Thursday
                $('td', row).eq(8).addClass('text-danger'); // Friday
                $('td', row).eq(9).addClass('text-danger'); // Saturday
                $('td', row).eq(10).addClass('text-danger'); // Sunday
            }
            if (data.startTimeUpdateDt) {
                // COLINDEX -- 11 is the column index of StartTime
                $('td', row).eq(11).addClass('text-danger');
            }
            if (data.endTimeUpdateDt) {
                // COLINDEX -- 12 is the column index of EndTime
                $('td', row).eq(12).addClass('text-danger');
            }
            if (data.dayPartUpdateDt) {
                // COLINDEX -- 13 is the column index of DP
                $('td', row).eq(13).addClass('text-danger');
            }
            if (data.omdpUpdateDt) {
                // COLINDEX -- 14 is the column index of OMDP
                $('td', row).eq(14).addClass('text-danger');
            }
            if (data.effectiveDateUpdateDt) {
                // COLINDEX -- 25 is the column index of effective date
                $('td', row).eq(25).addClass('text-danger');
            }
            if (data.expirationDateUpdateDt) {
                // COLINDEX -- 26 is the column index of expiration date
                $('td', row).eq(26).addClass('text-danger');
            }
            try {
                if ((new Date(row.cells[25].innerText) >= new Date(row.cells[26].innerText))) {
                    $('td', row).eq(25).addClass('bg-danger');
                    $('td', row).eq(25).addClass('text-gray');
                    $('td', row).eq(26).addClass('bg-danger');
                    $('td', row).eq(26).addClass('text-gray');
                }
            }
            catch (err) { }
            if (data.doNotBuyTypeUpdateDt) {
                $('td', row).eq(21).addClass('text-danger');
            }
            if (data.mandateClientUpdateDt) {
                $('td', row).eq(22).addClass('text-danger');
            }
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
            if (data.approved == true) {
                $(row).addClass('upfront-approved');
            }
            if (data.spotLen === 30 && data.approved == false && data.approveLock == false) {
                $(row).css('font-weight', 'bold');
            }

            if (data.isZeroRate) {
                editor_ur.disable('rateAmt');
            }
            else {
                editor_ur.enable('rateAmt');
            }

            if (data.isZeroImp) {
                editor_ur.disable('impressions');
            }
            else {
                editor_ur.enable('impressions');
            }

        },
        initComplete: function (settings, json) {
            editor_ur.field('dayPartCd').update(json.daypartcdoptions);
            editor_ur.field('buyTypeCode').update(json.buytypeoptions);
            editor_ur.field('doNotBuyTypeDescription').update(json.donotbuytypeoptions);
            editor_ur.field('mandateClientName').update(json.mandateclientoptions);
            editor_ur.field('expirationDate').update(json.expirationdateoptions);
            editor_ur.field('effectiveDate').update(json.effectivedateoptions);
            editor_ur.field('spBuy').update(json.spbuyoptions);

            var colIndex = -1;
            var selValue = '-1';          
            this.api().columns('.HeaderType').every(function () {
                var column = this;
                var selApproved = [];
                var selExpirationDate = [];
                var selEffectiveDate = [];

                var ddmenu = cbDropdown($(column.header()))
                    .on('change', ':checkbox', function () {                        
                        colIndex = column.index();
                        var vals = $(':checked', ddmenu).map(function (index, element) {
                            return $.fn.dataTable.util.escapeRegex($(element).val());
                        }).toArray().join(',');
                        var valsArr = vals.split(',');
                        if ($(this).val() == "Select All") {
                            if (valsArr[0] == "Select All") {
                                $(':checkbox', ddmenu).map(function (index, element) {
                                    if (index > 0) {
                                        $(element).prop("checked", true);
                                    }
                                });                                
                                selValue = '';
                            }
                            else {
                                $(':checkbox', ddmenu).map(function (index, element) {
                                    if (index > 0) {
                                        $(element).prop("checked", false);
                                    }
                                });
                                selValue = '12:06 am';
                            }
                        }
                        else {
                            var AvailableLength;
                            if ($(column.header()).hasClass("HeaderApproved")) {
                                AvailableLength = parseInt($("#HeaderApproveds > option").length) - 1;
                            }
                            else if ($(column.header()).hasClass("HeaderExpirationDate")) {
                                AvailableLength = parseInt($("#HeaderExpirationDates > option").length) - 1;
                            }
                            else if ($(column.header()).hasClass("HeaderEffectiveDate")) {
                                AvailableLength = parseInt($("#HeaderEffectiveDates > option").length) - 1;
                            }
                            else {
                                AvailableLength = 0;
                            }
                            if (AvailableLength == valsArr.length) {
                                if (valsArr[0] == "Select All") {
                                    // There is one unchecked so uncheck select all    
                                    $(':checkbox', ddmenu).map(function (index, element) {
                                        if (index == 0) {
                                            $(element).prop("checked", false);
                                        }
                                    });
                                }
                                else {
                                    // All are checked so check select all
                                    $(':checkbox', ddmenu).map(function (index, element) {
                                        if (index == 0) {
                                            $(element).prop("checked", true);
                                        }
                                    });
                                }
                            }
                            else if (AvailableLength > valsArr.length) {
                                // There is at least one unchecked
                                $(':checkbox', ddmenu).map(function (index, element) {
                                    if (index == 0) {
                                        $(element).prop("checked", false);
                                    }
                                });
                            }
                            else if (AvailableLength < valsArr.length) {
                                // This should never happen
                                if (valsArr.length > 0 && valsArr[0] != 'Select All') {
                                    console.log("why? This should never happen.  " + AvailableLength + " " + valsArr.length);
                                }
                            }

                            selValue = vals.length > 0 ? vals : '12:06 am';
                        }
                        if (vals === "") {
                            $(this).parent().parent().parent().removeClass("factive");
                        } else {
                            $(this).parent().parent().parent().addClass("factive");
                        }
                    });

                // APPROVED
                if ($(column.header()).hasClass("HeaderApproved")) {
                    column.data().unique().sort().each(function (d, j) {
                        selApproved.push($("<div/>").html(d).text());
                    });

                    $("#HeaderApproveds > option").each(function () {
                        var // wrapped
                            $label = $('<label>'),
                            $text = $('<span>', {
                                text: this.text
                            }),
                            $cb = $('<input>', {
                                type: 'checkbox',
                                checked: jQuery.inArray(this.text, selApproved) == -1 ? (this.text == "Select All" && parseInt($("#HeaderApproveds > option").length) - 1 == selApproved.length ? true : false) : true,
                                value: this.value
                            });

                        $text.appendTo($label);
                        $cb.appendTo($label);
                        ddmenu.append($('<li>').append($label));
                        if (jQuery.inArray(this.text, selApproved) != -1) {
                            ddmenu.addClass("factive");
                        }
                    });
                }
                
                // ExpirationDate
                else if ($(column.header()).hasClass("HeaderExpirationDate")) {
                    column.data().unique().sort().each(function (d, j) {
                        selExpirationDate.push(moment($("<div/>").html(d).text()).format("MM/DD/YYYY"));
                    });


                    $("#HeaderExpirationDates > option").each(function () {
                        var // wrapped
                            $label = $('<label>'),
                            $text = $('<span>', {
                                text: this.text
                            }),
                            $cb = $('<input>', {
                                type: 'checkbox',
                                checked: jQuery.inArray(this.value, selExpirationDate) == -1 ? (this.value == "Select All" && parseInt($("#HeaderExpirationDates > option").length) - 1 == selExpirationDate.length ? true : false) : true,
                                value: this.value
                            });

                        $text.appendTo($label);
                        $cb.appendTo($label);
                        ddmenu.append($('<li>').append($label));
                        if (jQuery.inArray(this.value, selExpirationDate) != -1) {
                            ddmenu.addClass("factive");
                        }
                    });
                }

                // EffectiveDate
                else if ($(column.header()).hasClass("HeaderEffectiveDate")) {
                    column.data().unique().sort().each(function (d, j) {
                        selEffectiveDate.push(moment($("<div/>").html(d).text()).format("MM/DD/YYYY"));
                    });


                    $("#HeaderEffectiveDates > option").each(function () {
                        var // wrapped
                            $label = $('<label>'),
                            $text = $('<span>', {
                                text: this.text
                            }),
                            $cb = $('<input>', {
                                type: 'checkbox',
                                checked: jQuery.inArray(this.value, selEffectiveDate) == -1 ? (this.value == "Select All" && parseInt($("#HeaderEffectiveDates > option").length) - 1 == selEffectiveDate.length ? true : false) : true,
                                value: this.value
                            });

                        $text.appendTo($label);
                        $cb.appendTo($label);
                        ddmenu.append($('<li>').append($label));
                        if (jQuery.inArray(this.value, selEffectiveDate) != -1) {
                            ddmenu.addClass("factive");
                        }
                    });
                }
            });
            this.api().columns('.TimeHeaderType').every(function () {
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
                column.data().unique().sort().each(function (d, j) {
                    var data = moment($("<div/>").html(d).text()).format("hh:mm a");

                    var // wrapped
                        $label = $('<label>'),
                        $text = $('<span>', {
                            text: data
                        }),
                        $cb = $('<input>', {
                            type: 'checkbox',
                            value: data
                        });

                    $text.appendTo($label);
                    $cb.appendTo($label);

                    ddmenu.append($('<li>').append($label));
                });

            });

            document.body.style.width = ($("#UpfrontTable").width() + 120) + 'px';            
            //$("#divUpfrontHeader").width ($(window).width()-20);            

            $(".cb-dropdown-wrap").each(function () {
                $(this).width($(this).parent().width());
            });

            $(".stime").on("keyup", function () {
                console.log('keyup');
            });

            $(document).on("click", function (event) {
                if (!$(event.target).hasClass("cb-dropdown") && !$(event.target).parent().parent().hasClass("cb-dropdown") && !$(event.target).parent().parent().parent().hasClass("cb-dropdown") && colIndex != -1 && selValue != '-1') {
                    var table = $("#UpfrontTable").DataTable();
                    table.columns(colIndex).search(selValue).draw();
                }
                colIndex = -1;
                selValue = '-1';                
            });
        }
    });

    var openVals;
    var openValsArray;
    editor_ur
        .on('select', function (e, dt, type, indexes) {
            //var rowData = upfronttable.rows(indexes).data().toArray();
            //alert(JSON.stringify(rowData));
            //events.prepend('<div><b>' + type + ' selection</b> - ' + JSON.stringify(rowData) + '</div>');
        })
        .on('deselect', function (e, dt, type, indexes) {
            //var rowData = upfronttable.rows(indexes).data().toArray();
            //alert(JSON.stringify(rowData));
            //events.prepend('<div><b>' + type + ' <i>de</i>selection</b> - ' + JSON.stringify(rowData) + '</div>');
        })
        .on('draw.dt', function () {
            //SetupMenus();
        })
        .on('open', function (e, type) {
            openVals = JSON.stringify(editor_ur.get());
            editor_ur.field('startTime').val(moment(editor_ur.get().startTime).format("hh:mm a"));
            editor_ur.field('endTime').val(moment(editor_ur.get().endTime).format("hh:mm a"));
        })
        .on('close', function (e, type) {
            //SetupMenus();
            RefreshTable(true, false, false);
        })
        .on('preBlur', function (e) {
            console.log(openVals);
            console.log(JSON.stringify(editor_ur.get()));
            var _upfrontLineId = e.target.s.setFocus.s.multiIds[0];
            if (openVals !== JSON.stringify(editor_ur.get())) {
                // PropertyName
                try {
                    var _propertyName = editor_ur.get().propertyName;
                    var obj = JSON.parse(openVals);
                    if (_propertyName && _propertyName != '' && _propertyName != obj.propertyName) {
                        SavePropertyName(_upfrontLineId, _propertyName);
                        return;
                    }
                }
                catch (err) {
                    var notify = $.notify("propertyName preBlur " + err.message, {
                        type: 'danger',
                        allow_dismiss: true,
                    });
                }

                // StartTime
                try {
                    var _startTime = editor_ur.get().startTime;
                    var obj = JSON.parse(openVals);
                    var hr = (new Date('01/01/1900 ' + _startTime).getHours()) - (new Date(obj.startTime).getHours());
                    var min = (new Date('01/01/1900 ' + _startTime).getMinutes()) - (new Date(obj.startTime).getMinutes());
                    if (_startTime && _startTime != '' && (hr != 0 || min != 0)) {
                        SaveStartTime(_upfrontLineId, _startTime);
                        return;
                    }
                }
                catch (err) {
                    var notify = $.notify("startTime preBlur " + err.message, {
                        type: 'danger',
                        allow_dismiss: true,
                    });
                }

                // EndTime
                try {
                    var _endTime = editor_ur.get().endTime;
                    var obj = JSON.parse(openVals);
                    var hr = (new Date('01/01/1900 ' + _endTime).getHours()) - (new Date(obj.endTime).getHours());
                    var min = (new Date('01/01/1900 ' + _endTime).getMinutes()) - (new Date(obj.endTime).getMinutes());
                    if (_endTime && _endTime != '' && (hr != 0 || min != 0)) {
                        SaveEndTime(_upfrontLineId, _endTime);
                        return;
                    }
                }
                catch (err) {
                    var notify = $.notify("endTime preBlur Error: " + err.message, {
                        type: 'danger',
                        allow_dismiss: true,
                    });
                }

                // rateAmt
                try {
                    var obj = JSON.parse(openVals);
                    var _rateAmt = editor_ur.get().rateAmt;

                    var params = new URLSearchParams(window.location.search);
                    if (params.get('URcountry') == 5) {
                        if (!(Math.floor(_rateAmt) == _rateAmt)) {
                            alert("Decimal are not allowed for Rate values");
                            return;
                        }
                    }
                    
                    if (_rateAmt && _rateAmt != '' && _rateAmt != obj.rateAmt) {
                        SaveRateAmt(_upfrontLineId, _rateAmt);
                        return;
                    }
                }
                catch (err) {
                    var notify = $.notify("rateAmt preBlur Error: " + err.message, {
                        type: 'danger',
                        allow_dismiss: true,
                    });
                }

                // impressions
                try {
                    var obj = JSON.parse(openVals);
                    var _impressions = editor_ur.get().impressions;
                    if (_impressions && _impressions != '' && _impressions != obj.impressions) {
                        SaveImpressions(_upfrontLineId, _impressions);
                        return;
                    }
                }
                catch (err) {
                    var notify = $.notify("impressions preBlur Error: " + err.message, {
                        type: 'danger',
                        allow_dismiss: true,
                    });
                }
                /*
                    // effectiveDate
                    try {
                        var _effectiveDate = editor_ur.get().effectiveDate;
                        var _expirationDate = editor_ur.get().expirationDate;
                        var obj = JSON.parse(openVals);
                        if (_effectiveDate > _expirationDate) {
                            swal('Stop', 'Effective date should be before expiration date.', 'warning');
                        }
                        else {
                            if (_effectiveDate && _effectiveDate != '' && _effectiveDate != obj.effectiveDate) {
                                SaveEffectiveDate(_upfrontLineId, _effectiveDate);
                            }
                        }
                    }
                    catch (err) {
                        var notify = $.notify("effectiveDate preBlur Error: " + err.message, {
                            type: 'danger',
                            allow_dismiss: true,
                        });
                    }
    
                    // expirationDate
                    try {
                        var _effectiveDate = editor_ur.get().effectiveDate;
                        var _expirationDate = editor_ur.get().expirationDate;
                        if (_effectiveDate > _expirationDate) {
                            swal('Stop', 'Effective date should be before expiration date.', 'warning');
                        }
                        else {
                            if (_expirationDate && _expirationDate != '' && _expirationDate != obj.expirationDate) {
                                var obj = JSON.parse(openVals);
                                SaveExpirationDate(_upfrontLineId, _expirationDate);
                                return;
                            }
                        }
                    }
                    catch (err) {
                        var notify = $.notify("expirationDate preBlur Error: " + err.message, {
                            type: 'danger',
                            allow_dismiss: true,
                        });
                    }
    
                    */

            }
        });


    $(editor_ur.field('buyTypeCode').node()).on('change', function () {
        try {
            var btc = editor_ur.field('buyTypeCode').val();
            var rowData = upfronttable.rows($(this).parent().parent().parent().parent()[0]._DT_RowIndex).data().toArray();
            console.log(btc);
            console.log(rowData);
            if (btc != -1 && btc != rowData[0].buyTypeId) {
                SaveBuyTypeId(rowData[0].upfrontLineId, btc);
            }
        }
        catch (err) {
            /*
            var notify = $.notify("onChange buyTypeCode Error:  " + err.message, {
                type: 'danger',
                allow_dismiss: true,
            });
            */
        }
    });

    $(editor_ur.field('dayPartCd').node()).on('change', function () {
        try {
            var dpc = editor_ur.field('dayPartCd').val();
            var rowData = upfronttable.rows($(this).parent().parent().parent().parent()[0]._DT_RowIndex).data().toArray();
            console.log(dpc);
            console.log(rowData);
            if (dpc != -1 && dpc != rowData[0].dayPartId) {
                SaveDayPartId(rowData[0].upfrontLineId, dpc);
            }
        }
        catch (err) {
            /*
            var notify = $.notify("onChange dayPartCd Error:  " + err.message, {
                type: 'danger',
                allow_dismiss: true,
            });
            */
        }
    });


    $(editor_ur.field('doNotBuyTypeDescription').node()).on('change', function () {
        try {
            var dnb = editor_ur.field('doNotBuyTypeDescription').val();
            var rowData = upfronttable.rows($(this).parent().parent().parent().parent()[0]._DT_RowIndex).data().toArray();
            console.log(dnb);
            console.log(rowData);
            if (dnb != -1 && dnb != rowData[0].doNotBuyTypeId) {
                SaveDoNotBuyTypeId(rowData[0].upfrontLineId, dnb);
            }
        }
        catch (err) {
            /*
            var notify = $.notify("onChange doNotBuyTypeDescription Error:  " + err.message, {
                type: 'danger',
                allow_dismiss: true,
            });
            */
        }
    });

    $(editor_ur.field('mandateClientName').node()).on('change', function () {
        try {
            var dnb = editor_ur.field('mandateClientName').val();
            var rowData = upfronttable.rows($(this).parent().parent().parent().parent()[0]._DT_RowIndex).data().toArray();
            console.log(dnb);
            console.log(rowData);
            if (dnb != -1 && dnb != rowData[0].mandateClientId) {
                SaveMandateClientId(rowData[0].upfrontLineId, dnb);
            }
        }
        catch (err) {
            /*
            var notify = $.notify("onChange mandateClientName Error:  " + err.message, {
                type: 'danger',
                allow_dismiss: true,
            });
            */
        }
    });

    $(editor_ur.field('effectiveDate').node()).on('change', function () {
        try {
            if (upfronttable) {
                var eff = editor_ur.field('effectiveDate').val();
                var rowData = upfronttable.rows($(this).parent().parent().parent().parent()[0]._DT_RowIndex).data().toArray();
                console.log(eff);
                console.log(rowData);
                if (eff != -1 && new Date(eff).getDate() != new Date(rowData[0].effectiveDate).getDate()) {
                    SaveEffectiveDate(rowData[0].upfrontLineId, eff);
                }
            }
        }
        catch (err) {
            /*
            var notify = $.notify("onChange effectiveDate Error:  " + err.message, {
                type: 'danger',
                allow_dismiss: true,
            });
            */
        }
    });

    $(editor_ur.field('expirationDate').node()).on('change', function () {
        try {
            if (upfronttable) {
                var exp = editor_ur.field('expirationDate').val();
                var rowData = upfronttable.rows($(this).parent().parent().parent().parent()[0]._DT_RowIndex).data().toArray();
                console.log(exp);
                console.log(rowData);
                if (exp != -1 && new Date(exp).getDate() != new Date(rowData[0].expirationDate).getDate()) {
                    SaveExpirationDate(rowData[0].upfrontLineId, exp);
                }
            }
        }
        catch (err) {
            /*
            var notify = $.notify("onChange effectiveDate Error:  " + err.message, {
                type: 'danger',
                allow_dismiss: true,
            });
            */
        }
    });

    /*
    editor_ur.field('doNotBuyTypeDescription').update(json.donotbuytypeoptions);
    editor_ur.field('mandateClientName').update(json.mandateclientoptions);
    editor_ur.field('expirationDate').update(json.expirationdateoptions);
    editor_ur.field('effectiveDate').update(json.effectivedateoptions);
    */

    /*****************************************************************************
     * Save Property Changes -- each cell change is saved to database.
     *****************************************************************************/
    /*
    $(editor_ur.field('propertyName').node()).on('change', function () {
        try {
            console.log ('propertyName');
            var rowData = upfronttable.rows($(this).parent().parent().parent().parent()[0]._DT_RowIndex).data().toArray();
            var _propertyName = editor_ur.field('propertyName').val();
            var _rateAmt = editor_ur.field('rateAmt').val();
            var _impressions = editor_ur.field('impressions').val();

            if (_propertyName != rowData[0].propertyName) {
                SavePropertyName(rowData[0].upfrontLineId
                    , _propertyName
                );
            }
        }
        catch (err) {
            var notify = $.notify(err.message, {
                type: 'danger',
                allow_dismiss: true,
            });
        }


    });
    */


    /*****************************************************************************/

    $(editor_ur.field('effectiveDate').node()).on('change', function () {
        var eff = editor_ur.field('effectiveDate').val();
    });

    $(editor_ur.field('spBuy').node()).on('change', function (e) {
        try {
            var spBuy = editor_ur.field('spBuy').val();
            if (spBuy != "-1") {                
                var rowData = upfronttable.rows($(this).parent().parent().parent().parent()[0]._DT_RowIndex).data().toArray();
                if (spBuy == "0") {
                    spBuy = "false";
                }
                else if (spBuy == "1") {
                    spBuy = "true";
                }
                if (spBuy != rowData[0].spBuy.toString().toLowerCase()) {
                    SaveSPBuy(rowData[0].upfrontLineId, spBuy);
                }
            }
        }
        catch(err){

        }
    });


    // For view, make the first column (checkbox) not selectable.
    var colStat = upfronttable.column(0);    
    colStat.visible(true);

    // Add icons to all show/hide buttons
    upfronttable.columns().eq(0).each(function (index) {
        var colStat = upfronttable.column(index);
        var that = $('#ShowHideButton' + index.toString());
        if (colStat.visible()) {
            $(that).attr('class', 'btn btn-outline-secondary');
        }
        else {
            $(that).attr('class', 'btn btn-outline-danger');
        }
    });

    // Selecting a row
    $('#UpfrontTable tbody').on('click', 'tr', function (e) {
        // Only SpotLen 30, Unapproved 30 and UnapproveLocked can be edited      
        try {
            var id = this.id;            
            var rowData = upfronttable.rows(this._DT_RowIndex).data().toArray();
            if (rowData[0].spotLen === 30 && rowData[0].approved == false && rowData[0].approveLock == false) {
                if (rowData[0].revision.trim() != '0') {  
                    if (rowData[0].revision.trim() == 'PC') {
                        if (e.target.cellIndex == 3 ||
                            e.target.cellIndex == 11 ||
                            e.target.cellIndex == 12 ||
                            e.target.cellIndex == 13 ||
                            e.target.cellIndex == 15 ||
                            e.target.cellIndex == 16) {

                            e.stopImmediatePropagation();
                            editor_ur.inline($(e.target));
                        }
                    }
                    if (e.target.cellIndex == 18 ||
                        e.target.cellIndex == 19 ||
                        e.target.cellIndex == 21 ||
                        e.target.cellIndex == 22 ||
                        e.target.cellIndex == 25 ||
                        e.target.cellIndex == 26) {

                        e.stopImmediatePropagation();
                        editor_ur.inline($(e.target));
                    }                    
                }
                else {
                    if (e.target.cellIndex == 3 ||
                        e.target.cellIndex == 4 ||
                        e.target.cellIndex == 5 ||
                        e.target.cellIndex == 6 ||
                        e.target.cellIndex == 7 ||
                        e.target.cellIndex == 8 ||
                        e.target.cellIndex == 9 ||
                        e.target.cellIndex == 10 ||
                        e.target.cellIndex == 11 ||
                        e.target.cellIndex == 12 ||
                        e.target.cellIndex == 13 ||
                        e.target.cellIndex == 15 ||
                        e.target.cellIndex == 16 ||
                        e.target.cellIndex == 18 ||
                        e.target.cellIndex == 19 ||
                        e.target.cellIndex == 21 ||
                        e.target.cellIndex == 22 ||
                        e.target.cellIndex == 25 ||
                        e.target.cellIndex == 26) {

                        e.stopImmediatePropagation();
                        editor_ur.inline($(e.target));
                    }
                }
            }

            var index = $.inArray(id, selected);
            if (index === -1) {
                selected.push(id);
            } else {
                selected.splice(index, 1);
            }

            RefreshTable(true, false, false);
            /*========================================================================*/
            // Determine how many of the spot len 30 can be deleted.
            var selectedDel = [];
            if (rowData[0].spotLen === 30) {
                var indexDel = $.inArray(id, selectedDel);
                if (indexDel === -1) {
                    selectedDel.push(id);
                } else {
                    selectedDel.splice(indexDel, 1);
                }
                // enable/disable DELETE button
                if (parseInt(ChangeCount) === 0) {
                    if (selectedDel.length > 0) {
                        $('#btnDelete').removeAttr("disabled");
                    }
                    else {
                        $('#btnDelete').attr("disabled", "disabled");
                    }
                }
            }
            else {
                $('#btnDelete').attr("disabled", "disabled");
            }

            /*========================================================================*/
            
            $(this).toggleClass('selected');
        }
        catch (err) {
            var notify = $.notify(err.message, {
                type: 'danger',
                allow_dismiss: true,
            });
        }

    });


    $('#UpfrontTable tbody').on('click', 'td i', function (e) {
        try {
            e.stopImmediatePropagation();
            var cellIndex = $(this).parent()[0]._DT_CellIndex.column;
            var rowData = upfronttable.rows(this.parentNode.parentNode._DT_RowIndex).data().toArray();
            if (rowData[0].spotLen === 30 && rowData[0].approved == false && rowData[0].approveLock == false && (rowData[0].revision.trim() == '0' || rowData[0].revision.trim() == 'PC')) {
                if (parseInt(cellIndex) === 4) {
                    if ($(this).hasClass('fa-circle')) {
                        SaveDay(rowData[0].upfrontLineId, 1, 0)
                    }
                    else {
                        SaveDay(rowData[0].upfrontLineId, 1, 1)
                    }
                }
                // Tuesday
                else if (parseInt(cellIndex) === 5) {
                    if ($(this).hasClass('fa-circle')) {
                        SaveDay(rowData[0].upfrontLineId, 2, 0)
                    }
                    else {
                        SaveDay(rowData[0].upfrontLineId, 2, 1)
                    }
                }
                // Wednesday
                else if (parseInt(cellIndex) === 6) {
                    if ($(this).hasClass('fa-circle')) {
                        SaveDay(rowData[0].upfrontLineId, 3, 0)
                    }
                    else {
                        SaveDay(rowData[0].upfrontLineId, 3, 1)
                    }
                }
                // Thursday
                else if (parseInt(cellIndex) === 7) {
                    if ($(this).hasClass('fa-circle')) {
                        SaveDay(rowData[0].upfrontLineId, 4, 0)
                    }
                    else {
                        SaveDay(rowData[0].upfrontLineId, 4, 1)
                    }
                }
                // Friday
                else if (parseInt(cellIndex) === 8) {
                    if ($(this).hasClass('fa-circle')) {
                        SaveDay(rowData[0].upfrontLineId, 5, 0)
                    }
                    else {
                        SaveDay(rowData[0].upfrontLineId, 5, 1)
                    }
                }
                // Saturday
                else if (parseInt(cellIndex) === 9) {
                    if ($(this).hasClass('fa-circle')) {
                        SaveDay(rowData[0].upfrontLineId, 6, 0)
                    }
                    else {
                        SaveDay(rowData[0].upfrontLineId, 6, 1)
                    }
                }
                // Sunday
                else if (parseInt(cellIndex) === 10) {
                    if ($(this).hasClass('fa-circle')) {
                        SaveDay(rowData[0].upfrontLineId, 7, 0)
                    }
                    else {
                        SaveDay(rowData[0].upfrontLineId, 7, 1)
                    }
                }
                //if (rowData[0].spotLen === 30 && rowData[0].approved == false && rowData[0].approveLock == false) {
                //e.stopImmediatePropagation();    
                // editor_ur.inline($(this).parent());
                //}
            }
        }
        catch (err) {
            var notify = $.notify(err.message, {
                type: 'danger',
                allow_dismiss: true,
            });
        }
    });
    // APPROVE
    $('#btnApprove').click(function () {
        if (parseInt(ChangeCount) > 0) {
            swal("Approve", 'The upfront/remnant has unsaved changes.  Please save changes before proceeding.', "warning");
            return;
        }
        PopulateApprove();
    });

    $('#btnApproveSubmit').click(function () {
        PopulateApprovalProgress();

        setTimeout(function () {
            RefreshTable(true, true, true);
            //$('#btnReload').click();
        }, 1000);
    });

    // UNAPPROVE
    $('#btnUnapprove').click(function () {
        if (parseInt(ChangeCount) > 0) {
            swal("Unapprove", 'The upfront/remnant has unsaved changes.  Please save changes before proceeding.', "warning");
            return;
        }
        PopulateUnapprove();

    });
    
    $('#btnUnapproveSubmit').click(function () {
        PopulateUnapprovalProgress();

        setTimeout(function () {
            RefreshTable(true, true, true);
            //$('#btnReload').click();
        }, 1000);
    });


    $('#btnDelete').click(function () {
        // I don't want to rely on a global so I'm going to traverse again and process the 
        // first spot len 30 found.
        var _30SpotLenFlag = false;
        var _30UpfrontLineIds = [];

        $("#UpfrontTable .selected").each(function () {
            var upfrontTbl = $("#UpfrontTable").DataTable();
            var rowData = upfrontTbl.row(this).data();
            var _UpfrontLineId = $(this).attr('id');
            if ($.trim(rowData.spotLen) == 30 && $.trim(rowData.buyTypeCode) != 'A') {
                _30SpotLenFlag = true;
                _30UpfrontLineIds.push(_UpfrontLineId);
            }
        });

        if (_30SpotLenFlag) {
            PopulateDelete(_30UpfrontLineIds);

            try {
                    $('#modal-deleteupfrontline').modal();
            }
            catch (err) {
                    window.location.reload();
        }

            //$('.selected').each(function (i, obj) {
            //    var _UpfrontLineId = $(this).attr('id');
            //    $('#txtUpfrontLineId').val(_UpfrontLineId);
            //    PopulateDelete(_UpfrontLineId);
            //    try {
            //        $('#modal-deleteupfrontline').modal();
            //    }
            //    catch (err) {
            //        window.location.reload();
            //    }
            //});
        }
        else {
            var warningMessage = "Sorry, there are no rows selected that meets all of the following criteria:" + "</br>"
                + "<p style='text-align:left'><strong><em>" +
                "1) Is NOT Approved" + "</br>" +
                "2) SpotLen is[30]" + "</br>" +
                "3) BuyType is NOT [ADU] or [A]" + "</br>" +
                "4) Does NOT have any related Properties that are [Approved]" + "</em></strong></p>"; 
            swal({
                title: "Warning",
                html: warningMessage,
                type: 'warning',
            });
            return false;
        }

        /*
        if (selectedDel.length > 0) {
            var _UpfrontLineId = selectedDel[0];
            $('#txtUpfrontLineId').val(_UpfrontLineId);
            PopulateDelete(_UpfrontLineId);
            try {
                $('#modal-deleteupfrontline').modal();
            }
            catch (err) {
                window.location.reload();
            }
        }
        */

    });

    $('#btnProgramChange').click(function () {
        var flag = false;
        $("#UpfrontTable .selected").each(function () {
            var upfrontTbl = $("#UpfrontTable").DataTable();
            var rowData = upfrontTbl.row(this).data();
            if ($.trim(rowData.buyTypeCode) == "A") {
                flag = true;
                swal("Program Change", "The BuyType must not be 'A'!", "warning");
                return false;
            }
            if ($.trim(rowData.revision) == "PC") {
                flag = true;
                swal("Program Change", "Program Change can only occur from original property! (Revision Number cannot be 'PC')", "warning");
                return false;
            }

        });
        if (flag) {
            return false;           
        }
        if (parseInt(ChangeCount) > 0) {
            swal("Program Change", 'The upfront/remnant has unsaved changes.  Please save changes before proceeding.', "warning");
            return;
        }
        PopulateProgramChange();
        try {
            $('#modal-programchange-select').modal();
        }
        catch (err) {
            window.location.reload();
        }
    });

    $('#btnReviseEstimate').click(function () {
        if (parseInt(ChangeCount) > 0) {
            swal("Revise Estimate", 'This remnant has unsaved changes.  Please save changes before proceeding.', "warning");
            return;
        }
        PopulateReviseEstimate(false);
    });


    function PopulateReviseEstimate(DRRateRevision) {
        if (DRRateRevision === true) {
            $("#ReviseEstimateHeader").html("Revise DR Rates");
            $("#btnReviseDRRatesSubmit").attr("hidden", false);
            $("#btnReviseEstimateSubmit").attr("hidden", true);
            $("#InfoReviseDRRates").attr("hidden", false);
            $("#InfoReviseEstimate").attr("hidden", true);

        }
        else {
            $("#ReviseEstimateHeader").html("Revise Estimates");
            $("#btnReviseDRRatesSubmit").attr("hidden", true);
            $("#btnReviseEstimateSubmit").attr("hidden", false);
            $("#InfoReviseDRRates").attr("hidden", true);
            $("#InfoReviseEstimate").attr("hidden", false);
        }
        if ($.fn.DataTable.isDataTable('#ReviseEstimateTable')) {
            $("#ReviseEstimateTable").dataTable().fnDestroy();
            $('#ReviseEstimateTable tbody').off('click');
        }
        var reviseestimatetable = $('#ReviseEstimateTable').DataTable({
            lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
            ajax: {
                url: '/UpfrontRemnant/GetUpfrontRemnantReviseLines',
                type: 'POST',
                data: {
                    upfrontId: getParameterByName('upfrontid'),
                    dRRateRevise: DRRateRevision
                },
            },
            searching: true,
            info: false,
            deferRender: true,
            ordering: true,
            language: {
                emptyTable: "No properties found that can be revised for this remnant.  Please click INFO button below for more details."
            },
            initComplete: function (settings, result) {
                if (result.success) {
                    $('#modal-reviseestimate').modal();
                }
                else {
                    swal("Wait", result.responseText, "warning");
                }
            },
            createdRow: function (row, data, dataIndex) {
                $(row).attr('id', data.upfrontLineId);
                console.log(data);
                if (data.approved == true) {
                    $(row).addClass('upfront-approved');
                }
            },
            columns: [
                {
                    targets: 0,
                    data: null,
                    defaultContent: '',
                    className: 'select-checkbox',
                    searchable: false,
                    orderable: false
                },
                {
                    targets: 1,
                    data: "demoName",
                    class: "d-none d-sm-table-cell",
                    visible: true,
                    searchable: true,
                    render: $.fn.dataTable.render.ellipsis(20, true),
                    orderable: true
                },
                {
                    targets: 2,
                    data: "propertyName",
                    class: "d-none d-sm-table-cell",
                    render: $.fn.dataTable.render.ellipsis(20, true),
                    orderable: true
                },
                {
                    targets: 3,
                    data: {
                        monday: "monday",
                        tuesday: "tuesday",
                        wednesday: "wednesday",
                        thursday: "thursday",
                        friday: "friday",
                        saturday: "saturday",
                        sunday: "sunday",
                    },
                    mRender: function (data, type, full) {
                        return (
                            (data.monday == true ? 'M' : '-') +
                            (data.tuesday == true ? 'T' : '-') +
                            (data.wednesday == true ? 'W' : '-') +
                            (data.thursday == true ? 'T' : '-') +
                            (data.friday == true ? 'F' : '-') +
                            (data.saturday == true ? 'S' : '-') +
                            (data.sunday == true ? 'S' : '-')
                        )
                    },
                    class: "d-none d-sm-table-cell",
                    orderable: true
                },
                {
                    targets: 4,
                    data: "startTime",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (d) {
                        return moment(d).format("hh:mm a");
                    },
                    orderable: true
                },
                {
                    targets: 5,
                    data: "endTime",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (d) {
                        return moment(d).format("hh:mm a");
                    },
                    orderable: true
                },
                {
                    targets: 6,
                    data: "buyTypeCode",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true
                },
                {
                    targets: 7,
                    data: "rateAmt",
                    class: "d-none d-sm-table-cell text-right",
                    render: $.fn.dataTable.render.number(',', '.', 2, '$'),
                    orderable: true
                },
                {
                    targets: 8,
                    data: "impressions",
                    class: "d-none d-sm-table-cell text-right",
                    render: $.fn.dataTable.render.number(',', '.', 0, ''),
                    orderable: true
                },
                {
                    targets: 9,
                    data: "cpm",
                    class: "d-none d-sm-table-cell text-right",
                    render: $.fn.dataTable.render.number(',', '.', 2, '$'),
                    orderable: true
                },
                {
                    targets: 10,
                    data: "revision",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true
                },
            ],
            select: true,
        });

        $('#ReviseEstimateTable tbody').on('click', 'tr', function () {
            $(this).toggleClass('selected');
        });


    }
    $('#btnReviseEstimateSubmit').click(function () {
        try {
            var ids = "";
            var btc = "";
            $("#ReviseEstimateTable tr.selected").each(function () {
                ids += this.id + ',';
                btc += this.cells[6].innerText + ',';
            });
            ReviseEstimate(ids, btc);
        }
        catch (err) {

        }

    });
    function ReviseEstimate(_UpfrontLineIds, _buytypeCodes) {

        $.ajax({
            url: "/UpfrontRemnant/ReviseEstimate",
            data: {
                UpfrontLineIds: _UpfrontLineIds,
                BuytypeCodes: _buytypeCodes
            },
            cache: false,
            async: false,
            type: "POST",
            success: function (result) {
                RefreshTable(true, true, true);
                if (result.success) {
                    swal({
                        title: "Success",
                        text: result.responseText,
                        type: 'success',
                        showCancelButton: false,
                        preConfirm: function () {
                            return new Promise(function (resolve) {
                                setTimeout(function () {
                                    resolve();
                                }, 50);
                            });
                        }
                    }).then(
                        function (result) {
                            //RefreshTable();
                            // window.location.reload();
                        });


                }
                else {
                    swal("Wait", result.responseText, "warning");
                }

            },
            error: function (response) {
                $('#modal-reviseestimate').modal('toggle');
                var notify = $.notify(response.responseText, {
                    type: 'danger',
                    allow_dismiss: true
                });
            }

        });
    }

    $('#btnReviseDRRates').click(function () {
        if (parseInt(ChangeCount) > 0) {
            swal("DR Rate Revision", 'This remnant has unsaved changes.  Please save changes before proceeding.', "warning");
            return;
        }
        PopulateReviseEstimate(true);
    });

    $('#btnAutoApprove').click(function () {
        if (parseInt(ChangeCount) > 0) {
            swal("Auto-Approve", 'This remnant has unsaved changes.  Please save changes before proceeding.', "warning");
            return;
        }
        var ConfirmQuestionText = 'All properties in this remnant with CPM between -0.02 and 0.02 will be approved.  Are you sure you want to proceed?'
        swal({
            title: 'Auto Approve',
            text: ConfirmQuestionText,
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            preConfirm: function () {
                return new Promise(function (resolve) {
                    setTimeout(function () {
                        resolve();
                    }, 50);
                });
            }
        }).then(
            function (result) {
                var _upfrontid = GetParameterValues('upfrontid');
                $.ajax({
                    url: '/UpfrontRemnant/AutoApprove',
                    type: 'POST',
                    data: {
                        upfrontId: _upfrontid
                    },
                    success: function (result) {
                        if (result.success) {
                            // upfronttable.ajax.reload(null, false);
                            RefreshTable(true, false, true);
                            swal("Auto-Approve", result.responseText, "success");
                        }
                        else {
                            swal("Auto-Approve", result.responseText, "warning");
                        }
                    },
                    error: function (response) {
                        var notify = $.notify(response.responseText, {
                            type: 'danger',
                            allow_dismiss: true,
                        });
                    }
                });
            }, function (dismiss) {
                // dismiss can be 'cancel', 'overlay', 'esc' or 'timer'
                swal("Auto-Approve", "No properties approved.", "warning");
            });


        //upfronttable.rows().every(function (rowIdx, tableLoop, rowLoop) {
        //    var data = this.data();
        //    console.log(data);
        // ... do something with data(), or this.node(), etc
        //});
    });

    $('#btnAddNewProperty').click(function () {
        var _upfrontid = GetParameterValues('upfrontid');
        var params = [
            'height=' + (screen.height >= 950 ? 950 : screen.height - 25),
            'width=1100',
            'top=0',
            'left=' + (screen.width - 1100) / 2,
            'resizable=yes',
            'scrollbars=yes'
        ].join(',');

        popupCreateProperty = window.open('/UpfrontRemnant/AddProperty?UpfrontId=' + _upfrontid, 'addprop_window', params);
        setTimeout(function () {
            popupCreateProperty.focus();
        }, 1000);
    });

    $('#btnManageUpfrontExpansion').click(function () {
        var _upfrontid = GetParameterValues('upfrontid');
        var params = [
            'height=' + (screen.height >= 950 ? 950 : screen.height - 25),
            'width=1100',
            'top=0',
            'left=' + (screen.width - 1100) / 2,
            'resizable=yes',
            'scrollbars=yes'
        ].join(',');

        var popupExpansion = window.open('/UpfrontExpansion/Index?upfrontid=' + _upfrontid, 'addprop_window', params);
        setTimeout(function () {
            popupExpansion.focus();
        }, 1000);
    });

    // EXPORT
    $('#btnExportSubmit').click(function () {
        var _upfrontid = GetParameterValues('upfrontid');
        var params = [
            'height=' + screen.height - 50,
            'width=' + screen.width - 50,
            'resizable=yes',
            'scrollbars=yes'
        ].join(',');

        var chkBuyType = document.getElementsByName('buytype');
        var chkBuyTypeChecked = [];
        var bt = '';
        for (var i = 0; i < chkBuyType.length; i++) {
            if (chkBuyType[i].checked) {
                bt = bt + chkBuyType[i].value + ',';
                // alert(chkBuyType[i].value);
                // checkboxesChecked.push(chkBuyType[i]);
            }
        }
        
        var rt = "";        
        $.ajax({
            url: '/UpfrontRemnant/BuyTypeValidation',
            type: 'POST',
            async:false,
            data: {
                bt: bt,
                upfrontId: _upfrontid
            },
            success: function (responseText) {                
                rt = responseText.responseText;
            },
            error: function (response) {
                var notify = $.notify(response.responseText, {
                    type: 'danger',
                    allow_dismiss: true,
                });
            }
        });        
        if (rt != "") {
            swal("", rt, "warning");
            return false;
        }
        $.ajax({
            url: '/UpfrontRemnant/CheckDealPoint',
            type: 'POST',
            async: false,
            data: {
                bt: bt,
                upfrontId: _upfrontid
            },
            success: function (response) {               
                if (response.responseText != "") {
                    swal('Information', response.responseText, 'info');
                }
            },
            error: function (response) {
                var notify = $.notify(response.responseText, {
                    type: 'danger',
                    allow_dismiss: true,
                });
            }
        });   
        var chkDemos = document.getElementsByName('demonames');
        var chkDemosChecked = [];
        var de = '';
        for (var i2 = 0; i2 < chkDemos.length; i2++) {
            if (chkDemos[i2].checked) {
                de = de + chkDemos[i2].value + ',';
                // alert(chkBuyType[i].value);
                // checkboxesChecked.push(chkBuyType[i]);
            }
        }    
        window.location.href = "/UpfrontRemnant/ExportToExcel?UpfrontId=" + _upfrontid + "&DR=UP&de=" + encodeURIComponent(de) + "&bt=" + encodeURIComponent(bt);
        //popupExport = window.open('/UpfrontRemnant/UpfrontReport?UpfrontId=' + _upfrontid + '&DR=UP' + '&bt=' + encodeURIComponent(bt) + '&de=' + encodeURIComponent(de), 'export_window', params);
        //setTimeout(function () {
        //    popupExport.focus();
        //}, 1000);

        function GetParameterValues(param) {
            var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < url.length; i++) {
                var urlparam = url[i].split('=');
                if (urlparam[0] == param) {
                    return urlparam[1];
                }
            }
        }

    });

    // Handle click on "Load more" buttonshow
    $('#btn-example-load-more').on('click', function () {
        // Load more data
        upfronttable.page.loadMore();
    });

    // RELOAD
    $('#btnReload').on('click', function () {
        /*
        upfronttable.ajax.reload(null, false);
        $('#btnDelete').attr('disabled', 'disabled');
        selected = [];
        */
        RefreshTable(true, true, true);
    });
       
    // RESET STATE
    $('#btnPropResetFilters').on('click', function (e) {
        var table = $('#UpfrontTable').DataTable();
        table
            .search('')
            .columns().search('')
            .draw();
        setTimeout(function () {
            promptExit(0);
            window.location.reload();
        }, 1000);

        // ResetState(upfronttable);
    });

    // Show/Hide columns
    $('#btnPropShowColumns').on('click', function (e) {
        $("#divColumnVisibility").toggle();
    });

    $(".HeaderPropertyName").on("click", function () {
        if (!$(event.target).hasClass("cb-dropdown") && !$(event.target).parent().parent().hasClass("cb-dropdown") && !$(event.target).parent().parent().parent().hasClass("cb-dropdown")) {
            if (sortColumnDirection == "asc") {
                sortColumnDirection = "desc";
            }
            else {
                sortColumnDirection = "asc";
            }
            upfronttable.order([3, sortColumnDirection]).draw();                        
        }        
    });

})

window.RefreshPage = function () {
    window.location.reload();
}

function RefreshTable(menus, filters, dt) {
    if (menus === true) {
        SetupMenus();
    }

    try {
        if (filters === true) {
            var table = $("#UpfrontTable").DataTable();
            table.columns('.HeaderPropertyName').search('').draw();
            return;
        }
    }
    catch (err) {
        promptExit(0);
        window.location.reload();
    }

    try {
        // Refresh Data Table
        if (dt === true) {
            var table = $('#UpfrontTable').DataTable();
            table.ajax.reload(null, false);
            $('#btnDelete').attr('disabled', 'disabled');
            selected = [];
        }
    }
    catch (err) {
        window.location.reload();
    }

}

