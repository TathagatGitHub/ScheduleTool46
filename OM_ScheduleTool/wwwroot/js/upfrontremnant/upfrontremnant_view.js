var sortColumnDirection = "asc";
$(document).ready(function () {
    function cbDropdown(column) {
        return $('<ul>', {
            'class': 'cb-dropdown'
        }).appendTo($('<div>', {
            'class': 'cb-dropdown-wrap'
        }).appendTo(column));
    }

    var upfronttable = $('#UpfrontTable').DataTable({
        lengthMenu: [[6000], [6000]],
        //orderable: true,
        dom: 'rti<"bottom"f><"clear">',
        ajax: {
            url: '/UpfrontRemnant/GetUpfrontData',
            type: 'POST',
            data: {
                upfrontId: getParameterByName('upfrontid'),
                viewOnly: true
            }
        },
        searching: true,
        info: true,
        processing: true,
        serverSide: true,
        deferRender: true,
        stateSave: true,
        stateSaveCallback: function (settings, data) {
            localStorage.setItem('DataTables_' + settings.sInstance + "_" + getParameterByName('upfrontid'), JSON.stringify(data))
            //ReloadHeader(settings, data, false);
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
           // ReloadHeader(settings, data, false);
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
                render: $.fn.dataTable.render.ellipsis(39, true),
                orderable: false,
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
                orderable: false,
            },
            {
                targets: 14,
                data: "omdp",
                class: "d-none d-sm-table-cell text-center",
                orderable: false,
            },          
            {
                targets: 15,
                data: "spBuy",
                class: "d-none d-sm-table-cell text-center",
                render: function (data, type, row, meta) {
                    if (data === "True") {
                        return "<span>SP</span>";
                    }
                    else if (data === "False") {
                        return "";
                    }
                },
                orderable: false

            },

            {
                targets: 16,
                data: "buyTypeCode",
                class: "d-none d-sm-table-cell text-center",
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
                render: function (d) {
                    return moment(d).format("MM/DD/YYYY");
                },
                orderable: false
            },
            {
                targets: 26,
                data: "expirationDate",
                class: "d-none d-sm-table-cell text-center",
                render: function (d) {
                    return moment(d).format("MM/DD/YYYY");
                },
                orderable: false
           }, 
        ],
        select: {
            style: 'os',
            selector: 'td:first-child'
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
        createdRow: function (row, data, dataIndex) {
            //console.log('createdRow');
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

        },
        initComplete: function () {                        
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


    // For view, make the first column (checkbox) not selectable.
    var colStat = upfronttable.column(0);
    colStat.visible(false);

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


    // Activate an inline edit on click of a table cell
    $('#UpfrontTable').on('click', 'tbody td:not(:first-child)', function (e) {
        //editor.inline(this);
    });

    $('#UpfrontTable').on('stateSaveParams.dt', function (e, settings, data) {
        //data.search.search = "";
    });

    $('#UpfrontTable').on('stateLoadParams.dt', function (e, settings, data) {
        //data.search.search = "";
    });

    $('#UpfrontTable')
        .on('select', function (e, dt, type, indexes) {
            var rowData = table.rows(indexes).data().toArray();
            alert(JSON.stringify(rowData));
            //events.prepend('<div><b>' + type + ' selection</b> - ' + JSON.stringify(rowData) + '</div>');
        })
        .on('deselect', function (e, dt, type, indexes) {
            var rowData = table.rows(indexes).data().toArray();
            alert(JSON.stringify(rowData));
            //events.prepend('<div><b>' + type + ' <i>de</i>selection</b> - ' + JSON.stringify(rowData) + '</div>');
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
            async: false,
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
        //var popupExport = window.open('/UpfrontRemnant/UpfrontReport?UpfrontId=' + _upfrontid + '&DR=UP' + bt + de, 'export_window', params);
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
        upfronttable.ajax.reload(null, false);
    });
       
    // RESET STATE
    $('#btnPropResetFilters').on('click', function (e) {
        var table = $('#UpfrontTable').DataTable();
        table
            .search('')
            .columns().search('')
            .draw();
        setTimeout(function () {
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

