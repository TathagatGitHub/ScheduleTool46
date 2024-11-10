var postlogtable = null;

function initPostLogViewTable() {
    if (postlogtable == null) {
        postlogtable = $('#PostLogViewTable').DataTable({
            lengthMenu: [[20000], [20000]],
            //orderable: true,
            dom: 'rti<"bottom"f><"clear">',
            ajax: {
                url: '/Logs/GetPostLogLines',
                type: 'POST',
                data: {
                    postlogid: getParameterByName('postlogid'),
                    lock: false
                }
            },
            searching: true,
            info: true,
            stateSave: false,
            processing: true,
            stateSaveCallback: function (settings, data) {
                localStorage.setItem('DataTables_1' + settings.sInstance + "_" + getParameterByName('postlogid'), JSON.stringify(data))
            },
            stateLoadCallback: function (settings, data) {
                return JSON.parse(localStorage.getItem('DataTables_1' + settings.sInstance + "_" + getParameterByName('postlogid')))
            },
            ordering: false,
            stateDuration: 60 * 60 * 24 * 365,
            columns: [
                {
                    targets: 0,
                    data: "network.stdNetName",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true
                },
                {
                    targets: 1,
                    data: "property.propertyName",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: false,
                    searchable: false
                },
                {
                    targets: 2,
                    data: "property.monday",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (data, type, row, meta) {
                        if (data === true) {
                            //var icon = row.childPropertyId == 0 ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            var icon = !row.isDOWChanged ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            return icon;
                        }
                        else {
                            return "";
                        }
                    },
                    orderable: false,
                    searchable: false
                },
                {
                    targets: 3,
                    data: "property.tuesday",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (data, type, row, meta) {
                        if (data === true) {
                            //var icon = row.childPropertyId == 0 ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            var icon = !row.isDOWChanged ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            return icon;
                        }
                        else {
                            return "";
                        }
                    },
                    orderable: false,
                    searchable: false
                },
                {
                    targets: 4,
                    data: "property.wednesday",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (data, type, row, meta) {
                        if (data === true) {
                            //var icon = row.childPropertyId == 0 ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            var icon = !row.isDOWChanged ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            return icon;
                        }
                        else {
                            return "";
                        }
                    },
                    orderable: false,
                    searchable: false
                },
                {
                    targets: 5,
                    data: "property.thursday",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (data, type, row, meta) {
                        if (data === true) {
                            //var icon = row.childPropertyId == 0 ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            var icon = !row.isDOWChanged ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            return icon;
                        }
                        else {
                            return "";
                        }
                    },
                    orderable: false,
                    searchable: false
                },
                {
                    targets: 6,
                    data: "property.friday",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (data, type, row, meta) {
                        if (data === true) {
                            //var icon = row.childPropertyId == 0 ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            var icon = !row.isDOWChanged ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            return icon;
                        }
                        else {
                            return "";
                        }
                    },
                    orderable: false,
                    searchable: false
                },
                {
                    targets: 7,
                    data: "property.saturday",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (data, type, row, meta) {
                        if (data === true) {
                            //var icon = row.childPropertyId == 0 ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            var icon = !row.isDOWChanged ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            return icon;
                        }
                        else {
                            return "";
                        }
                    },
                    orderable: false,
                    searchable: false
                },
                {
                    targets: 8,
                    data: "property.sunday",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (data, type, row, meta) {
                        if (data === true) {
                            //var icon = row.childPropertyId == 0 ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            var icon = !row.isDOWChanged ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            return icon;
                        }
                        else {
                            return "";
                        }
                    },
                    orderable: false,
                    searchable: false
                },
                {
                    targets: 10,
                    data: "startTime",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true,
                    render: function (d, type, row, meta) {
                        //var color = row.childPropertyId == 0 || row.childPropertyId == null ? "#575757" : "#2971B9";
                        var color = !row.isTimeChanged ? "#575757" : "#2971B9";
                        if (d != null) {
                            var t = moment(d).format("hh:mm A")
                            return `<span style='color: ${color};'>${t}</span>`;
                        }
                        else {
                            return `<span style='color: ${color};'>${d}</span>`;
                        }
                    }
                },
                {
                    targets: 11,
                    data: "endTime",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true,
                    render: function (d, type, row, meta) {
                        /* var color = row.childPropertyId == 0 || row.childPropertyId == null ? "#575757" : "#2971B9";*/
                        var color = !row.isTimeChanged ? "#575757" : "#2971B9";
                        if (d != null) {
                            var t = moment(d).format("hh:mm A")
                            return `<span style='color: ${color};'>${t}</span>`;
                        }
                        else {
                            return `<span style='color: ${color};'>${d}</span>`;
                        }
                    }
                },
                {
                    targets: 12,
                    //data: "dayPart.dayPartCd",
                    data: "dayPartCd",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true
                },
        

                {
                    targets: 13,
                    data: "omdp",
                    class: "d-none d-sm-table-cell text-center",
                    visible: true
                },
                {
                    targets: 14,
                    //data: "rate.spotLen",
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
                    //data: "buyType.buyTypeCode",
                    data: "buyTypeCode",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true
                },
                {
                    targets: 31,
                    data: "sp_Buy",
                    class: "d-none d-sm-table-cell text-center",
                    visible: true
                },
                {
                    targets: 16,
                    //data: "rate.rateAmt",
                    data: "rateAmount",
                    class: "d-none d-sm-table-cell text-center",
                    render: $.fn.dataTable.render.number(',', '.', 2, '$'),
                    orderable: true
                },
                {
                    targets: 17,
                    //data: "fullRate",
                    data: "clientRate",
                    class: "d-none d-sm-table-cell text-center",
                    render: $.fn.dataTable.render.number(',', '.', 2, '$'),
                    orderable: true
                },
                {
                    targets: 34,
                    data: "usdGrossRate",
                    class: "d-none d-sm-table-cell text-center",
                    render: $.fn.dataTable.render.number(',', '.', 2, '$'),
                    visible: true
                },
                {
                    targets: 18,
                    //data: "rate.impressions",
                    data: "imp",
                    class: "d-none d-sm-table-cell text-center",
                    render: $.fn.dataTable.render.number(',', '.', 2, ''),
                    orderable: true
                },
                {
                    targets: 19,
                    data: "cpm",
                    class: "d-none d-sm-table-cell text-center",
                    render: $.fn.dataTable.render.number(',', '.', 2, '$'),
                    orderable: true
                },
                {
                    targets: 20,
                    data: "spotDate",
                    class: "d-none d-sm-table-cell text-center",
                    type: 'datetime',
                    render: function (d) {
                        if (d != null)
                            return moment(d).format("MM/DD/YYYY");
                        else
                            return "";
                    },
                    orderable: true
                },
                {
                    targets: 21,
                    data: "spotTime",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (d) {
                        if (d != null)
                            return moment(d).format("hh:mm:ss A");
                        else
                            return "";
                    },
                    orderable: true
                },
                {
                    targets: 22,
                    data: "mediaType.mediaTypeCode",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true,
                    visible: true
                },
                {
                    targets: 23,
                    data: "isci",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true
                },
                {
                    targets: 24,
                    data: "programTitle",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true
                },
                {
                    targets: 25,
                    data: "clearedPlaced",
                    class: "d-none d-sm-table-cell text-center"
                },
                {
                    targets: 26,
                    data: "omdpSpotDateTime",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true
                },
                {
                    targets: 27,
                    data: "sigmaProgramName",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true,
                    visible: true
                },
                {
                    targets: 32,
                    data: "commRate",
                    class: "d-none d-sm-table-cell text-center",
                    visible: true
                },
                {
                    targets: 35,
                    data: "caConvRate",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (d) {
                        return Math.round((d * 100)) + '%';
                    },
                    visible: true
                },
                {
                    targets: 28,
                    data: "postLog.postLogId",
                    class: "d-none d-sm-table-cell text-center",
                    visible: false
                },
                {
                    targets: 29,
                    data: "poorSeparation",
                    class: "d-none d-sm-table-cell text-center",
                    visible: false
                },
                {
                    targets: 30,
                    data: "scheduleId",
                    class: "d-none d-sm-table-cell text-center",
                    visible: false
                },
                {
                    targets: 33,
                    data: "networkLogId",
                    class: "d-none d-sm-table-cell text-center",
                    visible: false
                }
                //{
                //    targets: 27,
                //    data: "commRate",
                //    class: "d-none d-sm-table-cell text-center",
                //    render: function (d) {
                //        if (d) {
                //            return d.toFixed(2) + '%';
                //        }
                //        return d;
                //    },
                //    orderable: true
                //}
            ],
            drawCallback: function () {
                // Show or hide "Load more" button based on whether there is more data available
                //$('#btn-example-load-more').toggle(this.api().page.hasMore());
            },
            rowCallback: function (row, data, displayNum, displayIndex, dataIndex) {
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
                else if ((data.isci != null && data.isci != '') && (data.spotDate == null || data.spotDate == '' || data.spotTime == null || data.spotTime == '')) {
                    $(row).addClass('table-warning');
                }
                else if (data.doNotBuy == "DO NOT BUY") {
                    $(row).addClass('table-info');
                }
                if (!data.isValidISCI) {
                    $("td:eq(23)", row).addClass("pending-change");
                }
            },
            createdRow: function (row, data, dataIndex) {
                try {
                    if (postlogtable.rows(dataIndex - 1).data()[0].network.stdNetName != data.network.stdNetName) {
                        $(row).addClass('table-secondary');
                        $(row).css('font-weight', 'bold');
                    }
                }
                catch (err) { }

                if (data.scheduled == null || data.scheduled == false) {
                    $("td:eq(0)", row).css("background-color", "#66FF33");
                }

                if (data.networkLogId != null) {
                    $("td:eq(0)", row).css("background-color", "#66FF33");
                    $("td:eq(0)", row).css("color", "white");
                }

                if (data.cleared == "UNPLACED") {
                    $(row).addClass('table-success');
                }
                else {
                    try {
                        if (data.spotDate == null || data.spotDate == '') {
                            $(row).addClass('table-warning');
                        }
                        else if (dataIndex == 0) {
                        }
                        else {
                            var spotDate = new Date(data.spotDate);
                            if (postlogtable.rows(dataIndex - 1).data()[0].spotDate != null &&
                                postlogtable.rows(dataIndex - 1).data()[0].spotDate != '' &&
                                postlogtable.rows(dataIndex - 1).data()[0].network.stdNetName == data.network.stdNetName &&
                                new Date(spotDate - 30 * 60000) >= new Date(postlogtable.rows(dataIndex - 1).data()[0].spotDate)) {
                                if (data.property.monday && spotDate.getDay() == 1 ||
                                    data.property.tuesday && spotDate.getDay() == 2 ||
                                    data.property.wednesday && spotDate.getDay() == 3 ||
                                    data.property.thursday && spotDate.getDay() == 4 ||
                                    data.property.friday && spotDate.getDay() == 5 ||
                                    data.property.saturday && spotDate.getDay() == 6 ||
                                    data.property.sunday && spotDate.getDay() == 0) {
                                    var startTime = new Date(data.property.startTime);
                                    startTime.setMonth(spotDate.getMonth());
                                    startTime.setDate(spotDate.getDate());
                                    startTime.setYear(spotDate.getFullYear());

                                    var endTime = new Date(data.property.endTime);
                                    endTime.setMonth(spotDate.getMonth());
                                    endTime.setDate(spotDate.getDate());
                                    endTime.setYear(spotDate.getFullYear());

                                    // This means, it's overnight so there is a different calculation
                                    if (startTime > endTime) {
                                        endTime.setDate(endTime.getDate() + 1);

                                        if (spotDate >= startTime && spotDate <= endTime) {
                                            // Not out of day part

                                        }
                                        else {
                                            $(row).addClass('table-danger');
                                        }
                                    }
                                    // The rest is pretty straightforward, just check if it's between the start time and end time
                                    else {
                                        if (spotDate < startTime || spotDate > endTime) {
                                            $(row).addClass('table-danger');
                                        }
                                    }

                                }
                                else {
                                    $(row).addClass('table-danger');
                                }
                            }
                            else {
                                if (postlogtable.rows(dataIndex - 1).data()[0].network.stdNetName == data.network.stdNetName) {
                                    $(row).addClass('table-primary');
                                }
                            }
                        }
                    }
                    catch (err) {
                        $(row).addClass('table-warning');
                    }
                }
            },
            initComplete: function () {
                $('#PostLogViewTable').excelTableFilter();
                CalculateTotals();
                /*
                this.api().columns().every(function () {
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
                                checked: true,
                                value: d
                            });
    
                        $text.appendTo($label);
                        $cb.appendTo($label);
    
                        ddmenu.append($('<li>').append($label));
                    });
                });
                */

                document.body.style.width = ($("#PostLogViewTable").width() + 120) + 'px';

                $(".cb-dropdown-wrap").each(function () {
                    $(this).width($(this).parent().width());
                });
            }
        }).on('stateSaveParams.dt', function (e, settings, data) {
            // data.search.search = "";
        });
    }
}

$('#btnPostlogViewExport').click(function () {
    var _postlogid = GetParameterValues('postlogid');
    var params = [
        'height=' + screen.height - 50,
        'width=' + screen.width - 50,
        'resizable=yes',
        'scrollbars=yes'
    ].join(',');
    var selectedCountryId = getParameterByName('logsSelectedCountryId');

    window.location.href = "/Logs/PostlogViewExcelExport?postlogid=" + _postlogid + "&countryID=" + selectedCountryId;
});

function GetPostLogNotes() {
    $.ajax({
        url: "/Logs/GetPostLogNotes",
        data: { postlogid: getParameterByName("postlogid") },
        type: "GET",
        success: function (result) {
            var markup = "";
            $.each(result, function (key, value) {                
                if (value.parentNoteId == null) {
                    markup += "<tr>";
                    markup += "<td class='d-none d-sm-table-cell bg-secondary-light'>" + moment(value.createDt).format("MM/DD/YYYY HH:mm:ss") + "</td>";GeneratePostlogExcel
                    markup += "<td class='d-none d-sm-table-cell bg-secondary-light'>" + value.displayName + "</td>";
                    markup += "<td class='font-w600 bg-secondary-light'>" + value.note + "</td>";                    
                    markup += "</tr>";
                }
                else {
                    markup += "<tr>";
                    markup += "<td class='d-none d-sm-table-cell'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i>" + moment(value.createDt).format("MM/DD/YYYY  HH:mm:ss") + "</i></td>";
                    markup += "<td class='d-none d-sm-table-cell'><i>" + value.displayName + "</i></td>";
                    markup += "<td class='font-w600'><i>" + value.note + "</i></td>";                    
                    markup += "</tr>";
                }
            });
            $("#modal-notes").find('#tblNotes tbody').html(markup);

        },
        error: function (response) {
            swal('Error!', error.responseText, 'warning');
        }
    });
}

function CalculateTotals() {
    var countryId = getParameterByName('logsSelectedCountryId');
    var totalClearedSpots = 0; totalClearedFullRate = 0; totalClearedRate = 0; totalClearedIMP = 0;
    var totalUnClearedSpots = 0; totalUnClearedFullRate = 0; totalUnClearedRate = 0; totalUnClearedIMP = 0;
    var totalUnPlacedSpots = 0; totalUnPlacedFullRate = 0; totalUnPlacedRate = 0; totalUnPlacedIMP = 0;
    var totalSpots = 0; totalFullRate = 0; totalRate = 0; totalIMP = 0;
    var index1 = 25;
    var index2 = 16;
    if (countryId == 2)
        index1 = 26;
    $("#PostLogViewTable tbody tr").not("tr[style *='display: none;']").each(function (index, row) {

        if (row.childNodes[index1].innerText == "CLEARED") {
            totalClearedSpots += 1;
            if (row.childNodes[index2].innerText != "")
                totalClearedFullRate += parseFloat(row.childNodes[index2].innerText.replace("$", "").replace(",", ""));
            if (row.childNodes[index2 + 1].innerText != "")
                totalClearedRate += parseFloat(row.childNodes[index2 + 1].innerText.replace("$", "").replace(",", ""));
            if (countryId == 5) {
                if (row.childNodes[index2 + 2].innerText != "")
                    totalClearedIMP += parseFloat(row.childNodes[index2 + 2].innerText.replace(",", ""));
            } else if (countryId == 2) {
                if (row.childNodes[index2 + 3].innerText != "")
                    totalClearedIMP += parseFloat(row.childNodes[index2 + 3].innerText.replace(",", ""));
            }

        } else if (row.childNodes[index1].innerText == "UNCLEARED") {
            totalUnClearedSpots += 1;
            if (row.childNodes[index2].innerText != "")
                totalUnClearedFullRate += parseFloat(row.childNodes[index2].innerText.replace("$", "").replace(",", ""));
            if (row.childNodes[index2 + 1].innerText != "")
                totalUnClearedRate += parseFloat(row.childNodes[index2 + 1].innerText.replace("$", "").replace(",", ""));
            if (countryId == 5) {
                if (row.childNodes[index2 + 2].innerText != "")
                    totalUnClearedIMP += parseFloat(row.childNodes[index2 + 2].innerText.replace(",", ""));
            } else if (countryId == 2) {
                if (row.childNodes[index2 + 3].innerText != "")
                    totalUnClearedIMP += parseFloat(row.childNodes[index2 + 3].innerText.replace(",", ""));
            } 
        } else if (row.childNodes[index1].innerText == "UNPLACED") {
            totalUnPlacedSpots += 1;
            if (row.childNodes[index2].innerText != "")
                totalUnPlacedFullRate += parseFloat(row.childNodes[index2].innerText.replace("$", "").replace(",", ""));
            if (row.childNodes[index2 + 1].innerText != "")
                totalUnPlacedRate += parseFloat(row.childNodes[index2 + 1].innerText.replace("$", "").replace(",", ""));
            if (countryId == 5) {
                if (row.childNodes[index2 + 2].innerText != "")
                    totalUnPlacedIMP += parseFloat(row.childNodes[index2 + 2].innerText.replace(",", ""));
            } else if (countryId == 2) {
                if (row.childNodes[index2 + 3].innerText != "")
                    totalUnPlacedIMP += parseFloat(row.childNodes[index2 + 3].innerText.replace(",", ""));
            }
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

    if ($("#PostLogViewTable tbody tr[style *='display: none;']").length > 0)
        $("#lblFilter").text("Yes");
    else
        $("#lblFilter").text("No");
};

$(document).ready(function () {
    function cbDropdown(column) {
        return $('<ul>', {
            'class': 'cb-dropdown'
        }).appendTo($('<div>', {
            'class': 'cb-dropdown-wrap'
        }).appendTo(column));
    }

    initPostLogViewTable();

    var selectedCountryId = getParameterByName('logsSelectedCountryId');
    var usdGorssRateIndex = $('th:contains("USD GROSS RATE")').index();
    var caConvRateIndex = $('th:contains("CA CONV. RATE")').index() + 1;
    if (selectedCountryId == 5) {
        postlogtable.column(usdGorssRateIndex).visible(false);
        postlogtable.column(caConvRateIndex).visible(false);
    }
});

function FilterMenuItemVisibility(filterMenus, index) {

    var fm = filterMenus.map(function (filterMenu) {
        return {
            column: filterMenu.column,
            item: filterMenu.inputs.map(function (input) {
                return input.value.trim().replace(/ +(?= )/g, '');
            })
        };
    });

    var col1 = []; var col9 = []; var col10 = []; var col11 = []; var col12 = []; var col13 = []; var col14 = []; var col15 = []; var col16 = []; var col17 = [];
    var col18 = []; var col19 = []; var col20 = []; var col21 = []; var col22 = []; var col23 = []; var col24 = []; var col25 = []; var col26 = []; var col27 = [];
    var col28 = []; var col29 = [];

    if (index == 0) {

        $("#PostLogViewTable tbody tr").not("[style *= 'display: none']").each(function () {
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
            col28.push($(this).find("td:eq(28)")[0].innerText);
            col29.push($(this).find("td:eq(29)")[0].innerText);
        });

        for (var j = 0; j <= fm[1].item.length; j++) {
            if (jQuery.inArray(fm[1].item[j], col1) >= 0) { $($($($("#PostLogViewTable th .checkbox-container")[1])[0]).find("div")[j + 1]).removeClass("d-none"); }
            else { $($($($("#PostLogViewTable th .checkbox-container")[1])[0]).find("div")[j + 1]).addClass("d-none"); }
        }
        for (var j = 0; j <= fm[9].item.length; j++) {
            if (jQuery.inArray(fm[9].item[j], col9) >= 0) { $($($($("#PostLogViewTable th .checkbox-container")[2])[0]).find("div")[j + 1]).removeClass("d-none"); }
            else { $($($($("#PostLogViewTable th .checkbox-container")[2])[0]).find("div")[j + 1]).addClass("d-none"); }
        }
        for (var j = 0; j <= fm[10].item.length; j++) {
            if (jQuery.inArray(fm[10].item[j], col10) >= 0) { $($($($("#PostLogViewTable th .checkbox-container")[3])[0]).find("div")[j + 1]).removeClass("d-none"); }
            else { $($($($("#PostLogViewTable th .checkbox-container")[3])[0]).find("div")[j + 1]).addClass("d-none"); }
        }
        for (var j = 0; j <= fm[11].item.length; j++) {
            if (jQuery.inArray(fm[11].item[j], col11) >= 0) { $($($($("#PostLogViewTable th .checkbox-container")[4])[0]).find("div")[j + 1]).removeClass("d-none"); }
            else { $($($($("#PostLogViewTable th .checkbox-container")[4])[0]).find("div")[j + 1]).addClass("d-none"); }
        }
        for (var j = 0; j <= fm[12].item.length; j++) {
            if (jQuery.inArray(fm[12].item[j], col12) >= 0) { $($($($("#PostLogViewTable th .checkbox-container")[5])[0]).find("div")[j + 1]).removeClass("d-none"); }
            else { $($($($("#PostLogViewTable th .checkbox-container")[5])[0]).find("div")[j + 1]).addClass("d-none"); }
        }
        for (var j = 0; j <= fm[13].item.length; j++) {
            if (jQuery.inArray(fm[13].item[j], col13) >= 0) { $($($($("#PostLogViewTable th .checkbox-container")[6])[0]).find("div")[j + 1]).removeClass("d-none"); }
            else { $($($($("#PostLogViewTable th .checkbox-container")[6])[0]).find("div")[j + 1]).addClass("d-none"); }
        }
        for (var j = 0; j <= fm[14].item.length; j++) {
            if (jQuery.inArray(fm[14].item[j], col14) >= 0) { $($($($("#PostLogViewTable th .checkbox-container")[7])[0]).find("div")[j + 1]).removeClass("d-none"); }
            else { $($($($("#PostLogViewTable th .checkbox-container")[7])[0]).find("div")[j + 1]).addClass("d-none"); }
        }
        for (var j = 0; j <= fm[15].item.length; j++) {
            if (jQuery.inArray(fm[15].item[j], col15) >= 0) { $($($($("#PostLogViewTable th .checkbox-container")[8])[0]).find("div")[j + 1]).removeClass("d-none"); }
            else { $($($($("#PostLogViewTable th .checkbox-container")[8])[0]).find("div")[j + 1]).addClass("d-none"); }
        }
        for (var j = 0; j <= fm[16].item.length; j++) {
            if (jQuery.inArray(fm[16].item[j], col16) >= 0) { $($($($("#PostLogViewTable th .checkbox-container")[9])[0]).find("div")[j + 1]).removeClass("d-none"); }
            else { $($($($("#PostLogViewTable th .checkbox-container")[9])[0]).find("div")[j + 1]).addClass("d-none"); }
        }
        for (var j = 0; j <= fm[17].item.length; j++) {
            if (jQuery.inArray(fm[17].item[j], col17) >= 0) { $($($($("#PostLogViewTable th .checkbox-container")[10])[0]).find("div")[j + 1]).removeClass("d-none"); }
            else { $($($($("#PostLogViewTable th .checkbox-container")[10])[0]).find("div")[j + 1]).addClass("d-none"); }
        }
        for (var j = 0; j <= fm[18].item.length; j++) {
            if (jQuery.inArray(fm[18].item[j], col18) >= 0) { $($($($("#PostLogViewTable th .checkbox-container")[11])[0]).find("div")[j + 1]).removeClass("d-none"); }
            else { $($($($("#PostLogViewTable th .checkbox-container")[11])[0]).find("div")[j + 1]).addClass("d-none"); }
        }
        for (var j = 0; j <= fm[19].item.length; j++) {
            if (jQuery.inArray(fm[19].item[j], col19) >= 0) { $($($($("#PostLogViewTable th .checkbox-container")[12])[0]).find("div")[j + 1]).removeClass("d-none"); }
            else { $($($($("#PostLogViewTable th .checkbox-container")[12])[0]).find("div")[j + 1]).addClass("d-none"); }
        }
        for (var j = 0; j <= fm[20].item.length; j++) {
            if (jQuery.inArray(fm[20].item[j], col20) >= 0) { $($($($("#PostLogViewTable th .checkbox-container")[13])[0]).find("div")[j + 1]).removeClass("d-none"); }
            else { $($($($("#PostLogViewTable th .checkbox-container")[13])[0]).find("div")[j + 1]).addClass("d-none"); }
        }
        for (var j = 0; j <= fm[21].item.length; j++) {
            if (jQuery.inArray(fm[21].item[j], col21) >= 0) { $($($($("#PostLogViewTable th .checkbox-container")[14])[0]).find("div")[j + 1]).removeClass("d-none"); }
            else { $($($($("#PostLogViewTable th .checkbox-container")[14])[0]).find("div")[j + 1]).addClass("d-none"); }
        }
        for (var j = 0; j <= fm[22].item.length; j++) {
            if (jQuery.inArray(fm[22].item[j], col22) >= 0) { $($($($("#PostLogViewTable th .checkbox-container")[15])[0]).find("div")[j + 1]).removeClass("d-none"); }
            else { $($($($("#PostLogViewTable th .checkbox-container")[15])[0]).find("div")[j + 1]).addClass("d-none"); }
        }
        for (var j = 0; j <= fm[23].item.length; j++) {
            if (jQuery.inArray(fm[23].item[j], col23) >= 0) { $($($($("#PostLogViewTable th .checkbox-container")[16])[0]).find("div")[j + 1]).removeClass("d-none"); }
            else { $($($($("#PostLogViewTable th .checkbox-container")[16])[0]).find("div")[j + 1]).addClass("d-none"); }
        }
        for (var j = 0; j <= fm[24].item.length; j++) {
            if (jQuery.inArray(fm[24].item[j], col24) >= 0) { $($($($("#PostLogViewTable th .checkbox-container")[17])[0]).find("div")[j + 1]).removeClass("d-none"); }
            else { $($($($("#PostLogViewTable th .checkbox-container")[17])[0]).find("div")[j + 1]).addClass("d-none"); }
        }
        for (var j = 0; j <= fm[25].item.length; j++) {
            if (jQuery.inArray(fm[25].item[j], col25) >= 0) { $($($($("#PostLogViewTable th .checkbox-container")[18])[0]).find("div")[j + 1]).removeClass("d-none"); }
            else { $($($($("#PostLogViewTable th .checkbox-container")[18])[0]).find("div")[j + 1]).addClass("d-none"); }
        }
        for (var j = 0; j <= fm[26].item.length; j++) {
            if (jQuery.inArray(fm[26].item[j], col26) >= 0) { $($($($("#PostLogViewTable th .checkbox-container")[19])[0]).find("div")[j + 1]).removeClass("d-none"); }
            else { $($($($("#PostLogViewTable th .checkbox-container")[19])[0]).find("div")[j + 1]).addClass("d-none"); }
        }
        for (var j = 0; j <= fm[27].item.length; j++) {
            if (jQuery.inArray(fm[27].item[j], col27) >= 0) { $($($($("#PostLogViewTable th .checkbox-container")[20])[0]).find("div")[j + 1]).removeClass("d-none"); }
            else { $($($($("#PostLogViewTable th .checkbox-container")[20])[0]).find("div")[j + 1]).addClass("d-none"); }
        }
        for (var j = 0; j <= fm[28].item.length; j++) {
            if (jQuery.inArray(fm[28].item[j], col28) >= 0) { $($($($("#PostLogViewTable th .checkbox-container")[21])[0]).find("div")[j + 1]).removeClass("d-none"); }
            else { $($($($("#PostLogViewTable th .checkbox-container")[21])[0]).find("div")[j + 1]).addClass("d-none"); }
        }
        for (var j = 0; j <= fm[29].item.length; j++) {
            if (jQuery.inArray(fm[29].item[j], col29) >= 0) { $($($($("#PostLogViewTable th .checkbox-container")[22])[0]).find("div")[j + 1]).removeClass("d-none"); }
            else { $($($($("#PostLogViewTable th .checkbox-container")[22])[0]).find("div")[j + 1]).addClass("d-none"); }
        }
    }


}