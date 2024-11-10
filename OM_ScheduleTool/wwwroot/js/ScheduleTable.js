$(document).ready(function () {
    function cbDropdown(column) {
        return $('<ul>', {
            'class': 'cb-dropdown'
        }).appendTo($('<div>', {
            'class': 'cb-dropdown-wrap'
        }).appendTo(column));
    }
    var schedtable = $('#ScheduleTable').DataTable({
        lengthMenu: [[5, 10, 15, 20], [5, 10, 15, 20]],
        autoWidth: true,
        ordering: true,
        scrollResize: true,
        scrollX: true,
        scrollY: "55vh",
        scrollCollapse: true,
        paging: false,
        searching: true,
        lengthChange: false,
        //serverSide: true,
        stateSave: true,
        responsive: false,
        dom: 'Bfrtip',
        orderCellsTop: true,
        fixedColumns: {
            heightMatch: 'none'
        },
        initComplete: function () {
            this.api().columns('.HeaderType').every(function () {
                var column = this;
                var ddmenu = cbDropdown($(column.footer()))
                    .on('change', ':checkbox', function () {
                        var vals = $(':checked', ddmenu).map(function (index, element) {
                            return $.fn.dataTable.util.escapeRegex($(element).val());
                        }).toArray().join('|');

                        column
                            .search(vals.length > 0 ? '^(' + vals + ')$' : '', true, false)
                            .draw();
                        //console.log(vals);
                        if (vals === "") {
                            $(this).parent().parent().parent().removeClass("factive");
                        } else {
                            $(this).parent().parent().parent().addClass("factive");
                        }
                        //change callback
                    });

                column.data().unique().sort().each(function (d, j) {
                    var data = $("<div/>").html(d).text();
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

                    if (d.toLowerCase().indexOf("<select") < 0 && data != "") {
                        ddmenu.append($('<li>').append($label));
                    }
                });

            });

            $(".cb-dropdown-wrap").each(function () {
                console.log($(this).parent().width());
                $(this).width($(this).parent().width());
            });

            $(".mymsel").select2();
        },
        buttons: [
            {
                className: 'btn alt-danger',
                extend: 'colvisGroup',
                text: 'Show all',
                show: ':hidden'
            },
            {
                className: 'btn alt-danger',
                extend: 'colvisGroup',
                text: 'Schedule Line Info',
                show: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23, 24, 25],
                hide: [22, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39]
            },
            {
                className: 'btn alt-danger',
                extend: 'colvisGroup',
                text: 'Spot',
                show: [5, 6, 7, 18, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
                hide: [1, 2, 3, 4, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22, 23, 24, 25]
            },
            /*
            {
                className: 'btn alt-success',
                extend: 'colvisGroup',
                text: 'Rate',
                show: [5, 6, 7, 18, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53],
                hide: [1, 2, 3, 4, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39]
            },
            */
        ]
    });

    schedtable.columns.adjust().draw();


    /* Hide CanadaOnly columns */
    var elem = $('#ScheduleTable th');
    var rIndex;
    var index = elem.filter(
        function (index) {
            var isCanadaOnly = $(this).attr('CanadaOnly');
            var result = isCanadaOnly == '1';
            if (result)
                rIndex = index;
            return result;
        }).index();

    elem.each(function () {
        if (($(this).attr('CanadaOnly')) != 'undefined') {
            if (($(this).attr('CanadaOnly')) == '0') {
                var column = schedtable.column([elem.index(this)]);
                column.visible(false);
            }
        }
    });

    /*
    $('#ProposalTable th.CanadaOnly').each(function () {
        var column = proptable.column($(this));

        // Toggle the visibility
        column.visible(false);

        alert($(this).attr('class'));
    })
    */



});
