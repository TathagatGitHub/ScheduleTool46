$(document).ready(function () {

    var upfronttable = $('#UpfrontTable').DataTable({
        ajax: {
            url: '/UpfrontRemnant/GetUpfrontData',
            type: 'POST',
            data: {
                upfrontId: GetParameterValues('UpfrontId'),
                bt: getParameterByName('bt'),
                de: getParameterByName('de')
            }
        },
        paging: false,
        searching: false,
        info: false,
        processing: true,
        serverSide: true,
        deferRender: false,
        ordering: false,
        autoWidth: true,
        columns: [
            {
                targets: 0,
                data: "propertyName",
                class: "text-center"
            },
            {
                targets: 1,
                data: "monday",
                class: "text-center",
                render: function (data, type, row, meta) {
                    if (data === true) {
                        return "<i class='fa fa-check'></i>";
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                targets: 2,
                data: "tuesday",
                class: "text-center",
                render: function (data, type, row, meta) {
                    if (data === true) {
                        return "<i class='fa fa-check'></i>";
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                targets: 3,
                data: "wednesday",
                class: "text-center",
                render: function (data, type, row, meta) {
                    if (data === true) {
                        return "<i class='fa fa-check'></i>";
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                targets: 4,
                data: "thursday",
                class: "text-center",
                render: function (data, type, row, meta) {
                    if (data === true) {
                        return "<i class='fa fa-check'></i>";
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                targets: 5,
                data: "friday",
                class: "text-center",
                render: function (data, type, row, meta) {
                    if (data === true) {
                        return "<i class='fa fa-check'></i>";
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                targets: 6,
                data: "saturday",
                class: "text-center",
                render: function (data, type, row, meta) {
                    if (data === true) {
                        return "<i class='fa fa-check'></i>";
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                targets: 7,
                data: "sunday",
                class: "text-center",
                render: function (data, type, row, meta) {
                    if (data === true) {
                        return "<i class='fa fa-check'></i>";
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                targets: 8,
                data: "startTime",
                class: "text-center",
                render: function (d) {
                    return moment(d).format("hh:mm a");
                }
            },
            {
                targets: 9,
                data: "endTime",
                class: "text-center",
                render: function (d) {
                    return moment(d).format("hh:mm a");
                }
            },
            {
                targets: 10,
                data: "buyTypeCode",
                class: "text-center"
            },
            {
                targets: 11,
                data: "dayPartCd",
                class: "text-center"
            },
            {
                targets: 12,
                data: "spotLen",
                class: "text-center",
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
                targets: 13,
                data: "splitNo",
                class: "text-center"
            },
            {
                targets: 14,
                data: "demoName",
                class: "text-center"
            },
            {
                targets: 15,
                data: "universe",
                class: "text-center"
            },
            {
                targets: 16,
                data: "rateAmt",
                class: "text-center",
                render: $.fn.dataTable.render.number(',', '.', 2, '$')
            },
            {
                targets: 17,
                data: "impressions",
                class: "text-center",
                render: $.fn.dataTable.render.number(',', '.', 2, '')
            },
            {
                targets: 18,
                data: "cpm",
                class: "text-center",
                render: $.fn.dataTable.render.number(',', '.', 2, '$'),
                orderable: true
            },
            {
                targets: 19,
                data: "approvedDesc",
                class: "text-center"
            },
            {
                targets: 20,
                data: "doNotBuyTypeDescription",
                class: "text-center",
                render: $.fn.dataTable.render.number(',', '.', 2, '')
            },
            {
                targets: 21,
                data: "mandateClientName",
                class: "text-center"
            },
            {
                targets: 22,
                data: "effectiveDate",
                class: "text-center",
                render: function (d) {
                    return moment(d).format("MM/DD/YYYY");
                }
            },
            {
                targets: 23,
                data: "expirationDate",
                class: "text-center",
                render: function (d) {
                    return moment(d).format("MM/DD/YYYY");
                }
            },
            {
                targets: 24,
                data: "revision",
                class: "d-none d-sm-table-cell text-center",
                orderable: true
            },
            /*
            {
                targets: 14,
                data: "omdp",
                class: "d-none d-sm-table-cell text-center",
                orderable: true
            },
            {
                targets: 23,
                data: "rateRevisedDate",
                class: "d-none d-sm-table-cell text-center",
                render: function (d) {
                    return moment(d).format("MM/DD/YYYY");
                },
                orderable: true
            },
            */
        ],
        createdRow: function (row, data, dataIndex) {
            if (data.buyTypeCode === 'A' && data.spotLen === 30) {
                $(row).addClass('table-warning');
            }



        },
    });

})

