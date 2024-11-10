$(document).ready(function () {
    var remnanttable = $('#RemnantTable').DataTable({
        lengthMenu: [[5, 10, 15, 20], [5, 10, 15, 20]],
        autoWidth: true,
        ordering: true,
        scrollResize: true,
        scrollX: true,
        scrollY: "60vh",
        scrollCollapse: true,
        paging: false,
        searching: true,
        lengthChange: false,
        //serverSide: true,
        stateSave: true,
        responsive: true,
        //"dom": 'lrtip',
        columnDefs: [
            {
                targets: 2,
                render: $.fn.dataTable.render.ellipsis(50, true)
            },
            {
                targets: 3,
                render: $.fn.dataTable.render.ellipsis(50, true)
            }
        ],

        initComplete: function () {
            this.api().columns('.HeaderType').every(function () {
                var column = this;
                //added class "mymsel"
                var select = $('<select class="form-control mymsel" multiple="multiple"><option></option></select>')
                    .appendTo($(column.footer()).empty())
                    .on('change', function () {
                        var vals = $('option:selected', this).map(function (index, element) {
                            return $.fn.dataTable.util.escapeRegex($(element).val());
                        }).toArray().join('|');

                        column
                            .search(vals.length > 0 ? '^(' + vals + ')$' : '', true, false)
                            .draw();
                    });

                column.data().unique().sort().each(function (d, j) {
                    select.append('<option value="' + d + '">' + d + '</option>')
                });
            });
            //select2 init for .mymsel class
            $(".mymsel").select2();
        }
    });



});
