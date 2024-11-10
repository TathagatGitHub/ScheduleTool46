var editor_ur;

$(document).ready(function () {
    editor_ur = new $.fn.dataTable.Editor({
        ajax: {
            url: '/UpfrontRemnant/GetEditUpfrontData',
            type: 'POST',
            data: {
                upfrontId: getParameterByName('upfrontid')
            },
            success: function (result) {
            },
            error: function (response) {
            }
        },
        table: "#UpfrontTable",
        idSrc: "upfrontLineId",
        serverSide: true,
        fields: [{
            label: "Demo Name:",
            name: "demoName"
        }
        ]
    });

    var upfronttable = $('#UpfrontTable').DataTable({
        ajax: {
            url: '/UpfrontRemnant/GetEditUpfrontData',
            type: 'POST',
            data: {
                upfrontId: getParameterByName('upfrontid')
            }
        },
        columns: [
            {
                targets: 0,
                data: "demoName",
                class: "d-none d-sm-table-cell text-center",
                className: "editable",
                visible: true,
                searchable: true,
                orderable: true
            },
        ],
    });


})
