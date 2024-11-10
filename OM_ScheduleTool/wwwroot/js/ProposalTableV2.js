$(document).ready(function () {
    function cbDropdown(column) {
        return $('<ul>', {
            'class': 'cb-dropdown'
        }).appendTo($('<div>', {
            'class': 'cb-dropdown-wrap'
        }).appendTo(column));
    }
    function formatCurrency(total) {
        var neg = false;
        if (total < 0) {
            neg = true;
            total = Math.abs(total);
        }
        return (neg ? "-$" : '$') + parseFloat(total, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString();
    }
    var proptable = $('#ProposalTable').DataTable({
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
        processing: true,
        //serverSide: true,
        stateSave: false,
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
                        CalculateTotals(proptable);
                        //change callback
                        ReloadCalculator();
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

            //$(".mymsel").select2();
        },
        "rowCallback": function (row, data) {
            /*
            var columnIndex = $('th:contains("%")').index();
            $('td:eq(columnIndex)', row).html($("#DiscountPrice").find(":selected").text());
            */
        },
        columnDefs: [
        {
            targets: 7,
            render: $.fn.dataTable.render.ellipsis(50, true)
        }, 
        {
            targets: 8,
            visible: false
        }, 
        {
            targets: 9,
            visible: false
        }, 
        {
            targets: 24,
            visible: false
        }, 

        ],
        buttons: [
            /*
            {
                className: 'btn alt-success',
                extend: 'colvisGroup',
                text: 'Show all',
                show: ':hidden'
            },
            {
                className: 'btn alt-success',
                //extend: 'colvisGroup',
                text: 'Proposal Line Info',
                //show: [1, 2, 3, 4, 5, 6, 7, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
                //hide: [8, 9, 25, 26, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41]
            },
            */
        /*
            {
                className: 'btn alt-success toggle-vis',
                //extend: 'colvisGroup',
                text: 'Show Eff/Exp Dt',
                //show: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
                //hide: [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41]
            },
            {
                text: 'Show Eff/Exp Dt',
                className: 'btn alt-success',
                extend: 'columnsToggle',
                columns: '.toggle'
            },
            */

        /*
            {
                text: 'Show Eff/Exp Dt',
                className: 'btn alt-success',
                action: function (e, dt, node, config) {
                    var columnEff = proptable.column(8);
                    columnEff.visible(!columnEff.visible());

                    var columnExp = proptable.column(9);
                    columnExp.visible(!columnExp.visible());
                }
            },
            {
                text: 'Notes',
                className: 'btn alt-success',
                action: function (e, dt, node, config) {
                    dt.ajax.reload();
                }
            },
            {
                text: 'Reload',
                className: 'btn alt-success',
                action: function (e, dt, node, config) {
                    dt.ajax.reload();
                }
            },
            */
            /*
            {
                className: 'btn alt-success',
                extend: 'colvisGroup',
                text: 'Spot',
                show: [5, 6, 7, 18, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
                hide: [1, 2, 3, 4, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22, 23, 24, 25]
            },
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

    $('#btnPropShowDates').on('click', function (e) {
        var columnEff = proptable.column(8);
        columnEff.visible(!columnEff.visible());

        var columnExp = proptable.column(9);
        columnExp.visible(!columnExp.visible());
    });

    $('#btnPropAddNotes').on('click', function (e) {
        var columnEff = proptable.column(8);
        columnEff.visible(!columnEff.visible());

        var columnExp = proptable.column(9);
        columnExp.visible(!columnExp.visible());
    });

    $('#DiscountPrice').on('change', function (e) {
        // Change Header to Discount Percent
        $("#DiscountPriceHeader").html($("#DiscountPrice").find(":selected").text() + "<br/>Rate").show();
        // $(".DiscountPriceCell").html($("#DiscountPrice").find(":selected").text()).show();

        CalculateTotals(proptable);
    });

    $("#RefreshTotals").click(function () {
        CalculateTotals(proptable);
    });

    $(".refresh-trigger").click(function () {
        CalculateTotals(proptable);
    });

    function CalculateTotals(proptable) {
        var elem = $('#ProposalTable th');
        var colTotalSpots = elem.filter(
            function (index) {
                return $(this).text() == 'Total Spots';
            }).index();

        var TotalSpots = 0;
        var TotalSpotsWk01 = 0;
        var TotalSpotsWk02 = 0;
        var TotalSpotsWk03 = 0;
        var TotalSpotsWk04 = 0;
        var TotalSpotsWk05 = 0;
        var TotalSpotsWk06 = 0;
        var TotalSpotsWk07 = 0;
        var TotalSpotsWk08 = 0;
        var TotalSpotsWk09 = 0;
        var TotalSpotsWk10 = 0;
        var TotalSpotsWk11 = 0;
        var TotalSpotsWk12 = 0;
        var TotalSpotsWk13 = 0;
        var TotalSpotsWk14 = 0;

        var TotalGrossDollars = 0;
        var TotalGrossDollarsWk01 = 0;
        var TotalGrossDollarsWk02 = 0;
        var TotalGrossDollarsWk03 = 0;
        var TotalGrossDollarsWk04 = 0;
        var TotalGrossDollarsWk05 = 0;
        var TotalGrossDollarsWk06 = 0;
        var TotalGrossDollarsWk07 = 0;
        var TotalGrossDollarsWk08 = 0;
        var TotalGrossDollarsWk09 = 0;
        var TotalGrossDollarsWk10 = 0;
        var TotalGrossDollarsWk11 = 0;
        var TotalGrossDollarsWk12 = 0;
        var TotalGrossDollarsWk13 = 0;
        var TotalGrossDollarsWk14 = 0;

        var TotalGrossImpressions = 0;
        var TotalGrossImpressionsWk01 = 0;
        var TotalGrossImpressionsWk02 = 0;
        var TotalGrossImpressionsWk03 = 0;
        var TotalGrossImpressionsWk04 = 0;
        var TotalGrossImpressionsWk05 = 0;
        var TotalGrossImpressionsWk06 = 0;
        var TotalGrossImpressionsWk07 = 0;
        var TotalGrossImpressionsWk08 = 0;
        var TotalGrossImpressionsWk09 = 0;
        var TotalGrossImpressionsWk10 = 0;
        var TotalGrossImpressionsWk11 = 0;
        var TotalGrossImpressionsWk12 = 0;
        var TotalGrossImpressionsWk13 = 0;
        var TotalGrossImpressionsWk14 = 0;

        var TotalClientDollars = 0;
        var TotalClientDollarsWk01 = 0;
        var TotalClientDollarsWk02 = 0;
        var TotalClientDollarsWk03 = 0;
        var TotalClientDollarsWk04 = 0;
        var TotalClientDollarsWk05 = 0;
        var TotalClientDollarsWk06 = 0;
        var TotalClientDollarsWk07 = 0;
        var TotalClientDollarsWk08 = 0;
        var TotalClientDollarsWk09 = 0;
        var TotalClientDollarsWk10 = 0;
        var TotalClientDollarsWk11 = 0;
        var TotalClientDollarsWk12 = 0;
        var TotalClientDollarsWk13 = 0;
        var TotalClientDollarsWk14 = 0;

        var TotalGRP = 0;
        var TotalGRPWk01 = 0;
        var TotalGRPWk02 = 0;
        var TotalGRPWk03 = 0;
        var TotalGRPWk04 = 0;
        var TotalGRPWk05 = 0;
        var TotalGRPWk06 = 0;
        var TotalGRPWk07 = 0;
        var TotalGRPWk08 = 0;
        var TotalGRPWk09 = 0;
        var TotalGRPWk10 = 0;
        var TotalGRPWk11 = 0;
        var TotalGRPWk12 = 0;
        var TotalGRPWk13 = 0;
        var TotalGRPWk14 = 0;



        var TotalGrossCPM = 0;
        var TotalGrossCPMWk01 = 0;
        var TotalGrossCPMWk02 = 0;
        var TotalGrossCPMWk03 = 0;
        var TotalGrossCPMWk04 = 0;
        var TotalGrossCPMWk05 = 0;
        var TotalGrossCPMWk06 = 0;
        var TotalGrossCPMWk07 = 0;
        var TotalGrossCPMWk08 = 0;
        var TotalGrossCPMWk09 = 0;
        var TotalGrossCPMWk10 = 0;
        var TotalGrossCPMWk11 = 0;
        var TotalGrossCPMWk12 = 0;
        var TotalGrossCPMWk13 = 0;
        var TotalGrossCPMWk14 = 0;

        var TotalClientCPM = 0;
        var TotalClientCPMWk01 = 0;
        var TotalClientCPMWk02 = 0;
        var TotalClientCPMWk03 = 0;
        var TotalClientCPMWk04 = 0;
        var TotalClientCPMWk05 = 0;
        var TotalClientCPMWk06 = 0;
        var TotalClientCPMWk07 = 0;
        var TotalClientCPMWk08 = 0;
        var TotalClientCPMWk09 = 0;
        var TotalClientCPMWk10 = 0;
        var TotalClientCPMWk11 = 0;
        var TotalClientCPMWk12 = 0;
        var TotalClientCPMWk13 = 0;
        var TotalClientCPMWk14 = 0;
       
        var Total15 = 0
        var Total15Wk01 = 0
        var Total15Wk02 = 0
        var Total15Wk03 = 0
        var Total15Wk04 = 0
        var Total15Wk05 = 0
        var Total15Wk06 = 0
        var Total15Wk07 = 0
        var Total15Wk08 = 0
        var Total15Wk09 = 0
        var Total15Wk10 = 0
        var Total15Wk11 = 0
        var Total15Wk12 = 0
        var Total15Wk13 = 0
        var Total15Wk14 = 0

        var TotalGI15 = 0
        var TotalGI15Wk01 = 0
        var TotalGI15Wk02 = 0
        var TotalGI15Wk03 = 0
        var TotalGI15Wk04 = 0
        var TotalGI15Wk05 = 0
        var TotalGI15Wk06 = 0
        var TotalGI15Wk07 = 0
        var TotalGI15Wk08 = 0
        var TotalGI15Wk09 = 0
        var TotalGI15Wk10 = 0
        var TotalGI15Wk11 = 0
        var TotalGI15Wk12 = 0
        var TotalGI15Wk13 = 0
        var TotalGI15Wk14 = 0

        var Total30 = 0
        var Total30Wk01 = 0
        var Total30Wk02 = 0
        var Total30Wk03 = 0
        var Total30Wk04 = 0
        var Total30Wk05 = 0
        var Total30Wk06 = 0
        var Total30Wk07 = 0
        var Total30Wk08 = 0
        var Total30Wk09 = 0
        var Total30Wk10 = 0
        var Total30Wk11 = 0
        var Total30Wk12 = 0
        var Total30Wk13 = 0
        var Total30Wk14 = 0

        var TotalGI30 = 0
        var TotalGI30Wk01 = 0
        var TotalGI30Wk02 = 0
        var TotalGI30Wk03 = 0
        var TotalGI30Wk04 = 0
        var TotalGI30Wk05 = 0
        var TotalGI30Wk06 = 0
        var TotalGI30Wk07 = 0
        var TotalGI30Wk08 = 0
        var TotalGI30Wk09 = 0
        var TotalGI30Wk10 = 0
        var TotalGI30Wk11 = 0
        var TotalGI30Wk12 = 0
        var TotalGI30Wk13 = 0
        var TotalGI30Wk14 = 0

        var Total60 = 0
        var Total60Wk01 = 0
        var Total60Wk02 = 0
        var Total60Wk03 = 0
        var Total60Wk04 = 0
        var Total60Wk05 = 0
        var Total60Wk06 = 0
        var Total60Wk07 = 0
        var Total60Wk08 = 0
        var Total60Wk09 = 0
        var Total60Wk10 = 0
        var Total60Wk11 = 0
        var Total60Wk12 = 0
        var Total60Wk13 = 0
        var Total60Wk14 = 0

        var TotalGI60 = 0
        var TotalGI60Wk01 = 0
        var TotalGI60Wk02 = 0
        var TotalGI60Wk03 = 0
        var TotalGI60Wk04 = 0
        var TotalGI60Wk05 = 0
        var TotalGI60Wk06 = 0
        var TotalGI60Wk07 = 0
        var TotalGI60Wk08 = 0
        var TotalGI60Wk09 = 0
        var TotalGI60Wk10 = 0
        var TotalGI60Wk11 = 0
        var TotalGI60Wk12 = 0
        var TotalGI60Wk13 = 0
        var TotalGI60Wk14 = 0

        var Total120 = 0
        var Total120Wk01 = 0
        var Total120Wk02 = 0
        var Total120Wk03 = 0
        var Total120Wk04 = 0
        var Total120Wk05 = 0
        var Total120Wk06 = 0
        var Total120Wk07 = 0
        var Total120Wk08 = 0
        var Total120Wk09 = 0
        var Total120Wk10 = 0
        var Total120Wk11 = 0
        var Total120Wk12 = 0
        var Total120Wk13 = 0
        var Total120Wk14 = 0

        var TotalGI120 = 0
        var TotalGI120Wk01 = 0
        var TotalGI120Wk02 = 0
        var TotalGI120Wk03 = 0
        var TotalGI120Wk04 = 0
        var TotalGI120Wk05 = 0
        var TotalGI120Wk06 = 0
        var TotalGI120Wk07 = 0
        var TotalGI120Wk08 = 0
        var TotalGI120Wk09 = 0
        var TotalGI120Wk10 = 0
        var TotalGI120Wk11 = 0
        var TotalGI120Wk12 = 0
        var TotalGI120Wk13 = 0
        var TotalGI120Wk14 = 0

        var TotalM = 0
        var TotalMWk01 = 0
        var TotalMWk02 = 0
        var TotalMWk03 = 0
        var TotalMWk04 = 0
        var TotalMWk05 = 0
        var TotalMWk06 = 0
        var TotalMWk07 = 0
        var TotalMWk08 = 0
        var TotalMWk09 = 0
        var TotalMWk10 = 0
        var TotalMWk11 = 0
        var TotalMWk12 = 0
        var TotalMWk13 = 0
        var TotalMWk14 = 0

        var TotalDPM = 0
        var TotalDPMWk01 = 0
        var TotalDPMWk02 = 0
        var TotalDPMWk03 = 0
        var TotalDPMWk04 = 0
        var TotalDPMWk05 = 0
        var TotalDPMWk06 = 0
        var TotalDPMWk07 = 0
        var TotalDPMWk08 = 0
        var TotalDPMWk09 = 0
        var TotalDPMWk10 = 0
        var TotalDPMWk11 = 0
        var TotalDPMWk12 = 0
        var TotalDPMWk13 = 0
        var TotalDPMWk14 = 0

        var TotalD = 0
        var TotalDWk01 = 0
        var TotalDWk02 = 0
        var TotalDWk03 = 0
        var TotalDWk04 = 0
        var TotalDWk05 = 0
        var TotalDWk06 = 0
        var TotalDWk07 = 0
        var TotalDWk08 = 0
        var TotalDWk09 = 0
        var TotalDWk10 = 0
        var TotalDWk11 = 0
        var TotalDWk12 = 0
        var TotalDWk13 = 0
        var TotalDWk14 = 0

        var TotalDPD = 0
        var TotalDPDWk01 = 0
        var TotalDPDWk02 = 0
        var TotalDPDWk03 = 0
        var TotalDPDWk04 = 0
        var TotalDPDWk05 = 0
        var TotalDPDWk06 = 0
        var TotalDPDWk07 = 0
        var TotalDPDWk08 = 0
        var TotalDPDWk09 = 0
        var TotalDPDWk10 = 0
        var TotalDPDWk11 = 0
        var TotalDPDWk12 = 0
        var TotalDPDWk13 = 0
        var TotalDPDWk14 = 0

        var TotalF = 0
        var TotalFWk01 = 0
        var TotalFWk02 = 0
        var TotalFWk03 = 0
        var TotalFWk04 = 0
        var TotalFWk05 = 0
        var TotalFWk06 = 0
        var TotalFWk07 = 0
        var TotalFWk08 = 0
        var TotalFWk09 = 0
        var TotalFWk10 = 0
        var TotalFWk11 = 0
        var TotalFWk12 = 0
        var TotalFWk13 = 0
        var TotalFWk14 = 0

        var TotalDPF = 0
        var TotalDPFWk01 = 0
        var TotalDPFWk02 = 0
        var TotalDPFWk03 = 0
        var TotalDPFWk04 = 0
        var TotalDPFWk05 = 0
        var TotalDPFWk06 = 0
        var TotalDPFWk07 = 0
        var TotalDPFWk08 = 0
        var TotalDPFWk09 = 0
        var TotalDPFWk10 = 0
        var TotalDPFWk11 = 0
        var TotalDPFWk12 = 0
        var TotalDPFWk13 = 0
        var TotalDPFWk14 = 0

        var TotalP = 0
        var TotalPWk01 = 0
        var TotalPWk02 = 0
        var TotalPWk03 = 0
        var TotalPWk04 = 0
        var TotalPWk05 = 0
        var TotalPWk06 = 0
        var TotalPWk07 = 0
        var TotalPWk08 = 0
        var TotalPWk09 = 0
        var TotalPWk10 = 0
        var TotalPWk11 = 0
        var TotalPWk12 = 0
        var TotalPWk13 = 0
        var TotalPWk14 = 0

        var TotalDPP = 0
        var TotalDPPWk01 = 0
        var TotalDPPWk02 = 0
        var TotalDPPWk03 = 0
        var TotalDPPWk04 = 0
        var TotalDPPWk05 = 0
        var TotalDPPWk06 = 0
        var TotalDPPWk07 = 0
        var TotalDPPWk08 = 0
        var TotalDPPWk09 = 0
        var TotalDPPWk10 = 0
        var TotalDPPWk11 = 0
        var TotalDPPWk12 = 0
        var TotalDPPWk13 = 0
        var TotalDPPWk14 = 0

        var TotalL = 0
        var TotalLWk01 = 0
        var TotalLWk02 = 0
        var TotalLWk03 = 0
        var TotalLWk04 = 0
        var TotalLWk05 = 0
        var TotalLWk06 = 0
        var TotalLWk07 = 0
        var TotalLWk08 = 0
        var TotalLWk09 = 0
        var TotalLWk10 = 0
        var TotalLWk11 = 0
        var TotalLWk12 = 0
        var TotalLWk13 = 0
        var TotalLWk14 = 0

        var TotalDPL = 0
        var TotalDPLWk01 = 0
        var TotalDPLWk02 = 0
        var TotalDPLWk03 = 0
        var TotalDPLWk04 = 0
        var TotalDPLWk05 = 0
        var TotalDPLWk06 = 0
        var TotalDPLWk07 = 0
        var TotalDPLWk08 = 0
        var TotalDPLWk09 = 0
        var TotalDPLWk10 = 0
        var TotalDPLWk11 = 0
        var TotalDPLWk12 = 0
        var TotalDPLWk13 = 0
        var TotalDPLWk14 = 0

        var TotalO = 0
        var TotalOWk01 = 0
        var TotalOWk02 = 0
        var TotalOWk03 = 0
        var TotalOWk04 = 0
        var TotalOWk05 = 0
        var TotalOWk06 = 0
        var TotalOWk07 = 0
        var TotalOWk08 = 0
        var TotalOWk09 = 0
        var TotalOWk10 = 0
        var TotalOWk11 = 0
        var TotalOWk12 = 0
        var TotalOWk13 = 0
        var TotalOWk14 = 0

        var TotalDPO = 0
        var TotalDPOWk01 = 0
        var TotalDPOWk02 = 0
        var TotalDPOWk03 = 0
        var TotalDPOWk04 = 0
        var TotalDPOWk05 = 0
        var TotalDPOWk06 = 0
        var TotalDPOWk07 = 0
        var TotalDPOWk08 = 0
        var TotalDPOWk09 = 0
        var TotalDPOWk10 = 0
        var TotalDPOWk11 = 0
        var TotalDPOWk12 = 0
        var TotalDPOWk13 = 0
        var TotalDPOWk14 = 0

        var TotalW = 0
        var TotalWWk01 = 0
        var TotalWWk02 = 0
        var TotalWWk03 = 0
        var TotalWWk04 = 0
        var TotalWWk05 = 0
        var TotalWWk06 = 0
        var TotalWWk07 = 0
        var TotalWWk08 = 0
        var TotalWWk09 = 0
        var TotalWWk10 = 0
        var TotalWWk11 = 0
        var TotalWWk12 = 0
        var TotalWWk13 = 0
        var TotalWWk14 = 0

        var TotalDPW = 0
        var TotalDPWWk01 = 0
        var TotalDPWWk02 = 0
        var TotalDPWWk03 = 0
        var TotalDPWWk04 = 0
        var TotalDPWWk05 = 0
        var TotalDPWWk06 = 0
        var TotalDPWWk07 = 0
        var TotalDPWWk08 = 0
        var TotalDPWWk09 = 0
        var TotalDPWWk10 = 0
        var TotalDPWWk11 = 0
        var TotalDPWWk12 = 0
        var TotalDPWWk13 = 0
        var TotalDPWWk14 = 0

        var TotalR = 0
        var TotalRWk01 = 0
        var TotalRWk02 = 0
        var TotalRWk03 = 0
        var TotalRWk04 = 0
        var TotalRWk05 = 0
        var TotalRWk06 = 0
        var TotalRWk07 = 0
        var TotalRWk08 = 0
        var TotalRWk09 = 0
        var TotalRWk10 = 0
        var TotalRWk11 = 0
        var TotalRWk12 = 0
        var TotalRWk13 = 0
        var TotalRWk14 = 0

        var TotalDPR = 0
        var TotalDPRWk01 = 0
        var TotalDPRWk02 = 0
        var TotalDPRWk03 = 0
        var TotalDPRWk04 = 0
        var TotalDPRWk05 = 0
        var TotalDPRWk06 = 0
        var TotalDPRWk07 = 0
        var TotalDPRWk08 = 0
        var TotalDPRWk09 = 0
        var TotalDPRWk10 = 0
        var TotalDPRWk11 = 0
        var TotalDPRWk12 = 0
        var TotalDPRWk13 = 0
        var TotalDPRWk14 = 0

        var TotalBTU = 0
        var TotalBTUWk01 = 0
        var TotalBTUWk02 = 0
        var TotalBTUWk03 = 0
        var TotalBTUWk04 = 0
        var TotalBTUWk05 = 0
        var TotalBTUWk06 = 0
        var TotalBTUWk07 = 0
        var TotalBTUWk08 = 0
        var TotalBTUWk09 = 0
        var TotalBTUWk10 = 0
        var TotalBTUWk11 = 0
        var TotalBTUWk12 = 0
        var TotalBTUWk13 = 0
        var TotalBTUWk14 = 0

        var TotalBuyTypeU = 0
        var TotalBuyTypeUWk01 = 0
        var TotalBuyTypeUWk02 = 0
        var TotalBuyTypeUWk03 = 0
        var TotalBuyTypeUWk04 = 0
        var TotalBuyTypeUWk05 = 0
        var TotalBuyTypeUWk06 = 0
        var TotalBuyTypeUWk07 = 0
        var TotalBuyTypeUWk08 = 0
        var TotalBuyTypeUWk09 = 0
        var TotalBuyTypeUWk10 = 0
        var TotalBuyTypeUWk11 = 0
        var TotalBuyTypeUWk12 = 0
        var TotalBuyTypeUWk13 = 0
        var TotalBuyTypeUWk14 = 0

        var TotalBTGPU = 0
        var TotalBTGPUWk01 = 0
        var TotalBTGPUWk02 = 0
        var TotalBTGPUWk03 = 0
        var TotalBTGPUWk04 = 0
        var TotalBTGPUWk05 = 0
        var TotalBTGPUWk06 = 0
        var TotalBTGPUWk07 = 0
        var TotalBTGPUWk08 = 0
        var TotalBTGPUWk09 = 0
        var TotalBTGPUWk10 = 0
        var TotalBTGPUWk11 = 0
        var TotalBTGPUWk12 = 0
        var TotalBTGPUWk13 = 0
        var TotalBTGPUWk14 = 0

        var TotalBuyTypeGPU = 0
        var TotalBuyTypeGPUWk01 = 0
        var TotalBuyTypeGPUWk02 = 0
        var TotalBuyTypeGPUWk03 = 0
        var TotalBuyTypeGPUWk04 = 0
        var TotalBuyTypeGPUWk05 = 0
        var TotalBuyTypeGPUWk06 = 0
        var TotalBuyTypeGPUWk07 = 0
        var TotalBuyTypeGPUWk08 = 0
        var TotalBuyTypeGPUWk09 = 0
        var TotalBuyTypeGPUWk10 = 0
        var TotalBuyTypeGPUWk11 = 0
        var TotalBuyTypeGPUWk12 = 0
        var TotalBuyTypeGPUWk13 = 0
        var TotalBuyTypeGPUWk14 = 0

        var TotalBTGR = 0
        var TotalBTGRWk01 = 0
        var TotalBTGRWk02 = 0
        var TotalBTGRWk03 = 0
        var TotalBTGRWk04 = 0
        var TotalBTGRWk05 = 0
        var TotalBTGRWk06 = 0
        var TotalBTGRWk07 = 0
        var TotalBTGRWk08 = 0
        var TotalBTGRWk09 = 0
        var TotalBTGRWk10 = 0
        var TotalBTGRWk11 = 0
        var TotalBTGRWk12 = 0
        var TotalBTGRWk13 = 0
        var TotalBTGRWk14 = 0

        var TotalBuyTypeGR = 0
        var TotalBuyTypeGRWk01 = 0
        var TotalBuyTypeGRWk02 = 0
        var TotalBuyTypeGRWk03 = 0
        var TotalBuyTypeGRWk04 = 0
        var TotalBuyTypeGRWk05 = 0
        var TotalBuyTypeGRWk06 = 0
        var TotalBuyTypeGRWk07 = 0
        var TotalBuyTypeGRWk08 = 0
        var TotalBuyTypeGRWk09 = 0
        var TotalBuyTypeGRWk10 = 0
        var TotalBuyTypeGRWk11 = 0
        var TotalBuyTypeGRWk12 = 0
        var TotalBuyTypeGRWk13 = 0
        var TotalBuyTypeGRWk14 = 0

        var TotalBTNR = 0
        var TotalBTNRWk01 = 0
        var TotalBTNRWk02 = 0
        var TotalBTNRWk03 = 0
        var TotalBTNRWk04 = 0
        var TotalBTNRWk05 = 0
        var TotalBTNRWk06 = 0
        var TotalBTNRWk07 = 0
        var TotalBTNRWk08 = 0
        var TotalBTNRWk09 = 0
        var TotalBTNRWk10 = 0
        var TotalBTNRWk11 = 0
        var TotalBTNRWk12 = 0
        var TotalBTNRWk13 = 0
        var TotalBTNRWk14 = 0

        var TotalBuyTypeNR = 0
        var TotalBuyTypeNRWk01 = 0
        var TotalBuyTypeNRWk02 = 0
        var TotalBuyTypeNRWk03 = 0
        var TotalBuyTypeNRWk04 = 0
        var TotalBuyTypeNRWk05 = 0
        var TotalBuyTypeNRWk06 = 0
        var TotalBuyTypeNRWk07 = 0
        var TotalBuyTypeNRWk08 = 0
        var TotalBuyTypeNRWk09 = 0
        var TotalBuyTypeNRWk10 = 0
        var TotalBuyTypeNRWk11 = 0
        var TotalBuyTypeNRWk12 = 0
        var TotalBuyTypeNRWk13 = 0
        var TotalBuyTypeNRWk14 = 0

        var TotalBTPDR = 0
        var TotalBTPDRWk01 = 0
        var TotalBTPDRWk02 = 0
        var TotalBTPDRWk03 = 0
        var TotalBTPDRWk04 = 0
        var TotalBTPDRWk05 = 0
        var TotalBTPDRWk06 = 0
        var TotalBTPDRWk07 = 0
        var TotalBTPDRWk08 = 0
        var TotalBTPDRWk09 = 0
        var TotalBTPDRWk10 = 0
        var TotalBTPDRWk11 = 0
        var TotalBTPDRWk12 = 0
        var TotalBTPDRWk13 = 0
        var TotalBTPDRWk14 = 0

        var TotalBuyTypePDR = 0
        var TotalBuyTypePDRWk01 = 0
        var TotalBuyTypePDRWk02 = 0
        var TotalBuyTypePDRWk03 = 0
        var TotalBuyTypePDRWk04 = 0
        var TotalBuyTypePDRWk05 = 0
        var TotalBuyTypePDRWk06 = 0
        var TotalBuyTypePDRWk07 = 0
        var TotalBuyTypePDRWk08 = 0
        var TotalBuyTypePDRWk09 = 0
        var TotalBuyTypePDRWk10 = 0
        var TotalBuyTypePDRWk11 = 0
        var TotalBuyTypePDRWk12 = 0
        var TotalBuyTypePDRWk13 = 0
        var TotalBuyTypePDRWk14 = 0

        var TotalBTPE = 0
        var TotalBTPEWk01 = 0
        var TotalBTPEWk02 = 0
        var TotalBTPEWk03 = 0
        var TotalBTPEWk04 = 0
        var TotalBTPEWk05 = 0
        var TotalBTPEWk06 = 0
        var TotalBTPEWk07 = 0
        var TotalBTPEWk08 = 0
        var TotalBTPEWk09 = 0
        var TotalBTPEWk10 = 0
        var TotalBTPEWk11 = 0
        var TotalBTPEWk12 = 0
        var TotalBTPEWk13 = 0
        var TotalBTPEWk14 = 0

        var TotalBuyTypePE = 0
        var TotalBuyTypePEWk01 = 0
        var TotalBuyTypePEWk02 = 0
        var TotalBuyTypePEWk03 = 0
        var TotalBuyTypePEWk04 = 0
        var TotalBuyTypePEWk05 = 0
        var TotalBuyTypePEWk06 = 0
        var TotalBuyTypePEWk07 = 0
        var TotalBuyTypePEWk08 = 0
        var TotalBuyTypePEWk09 = 0
        var TotalBuyTypePEWk10 = 0
        var TotalBuyTypePEWk11 = 0
        var TotalBuyTypePEWk12 = 0
        var TotalBuyTypePEWk13 = 0
        var TotalBuyTypePEWk14 = 0

        var TotalBTGPE = 0
        var TotalBTGPEWk01 = 0
        var TotalBTGPEWk02 = 0
        var TotalBTGPEWk03 = 0
        var TotalBTGPEWk04 = 0
        var TotalBTGPEWk05 = 0
        var TotalBTGPEWk06 = 0
        var TotalBTGPEWk07 = 0
        var TotalBTGPEWk08 = 0
        var TotalBTGPEWk09 = 0
        var TotalBTGPEWk10 = 0
        var TotalBTGPEWk11 = 0
        var TotalBTGPEWk12 = 0
        var TotalBTGPEWk13 = 0
        var TotalBTGPEWk14 = 0

        var TotalBuyTypeGPE = 0
        var TotalBuyTypeGPEWk01 = 0
        var TotalBuyTypeGPEWk02 = 0
        var TotalBuyTypeGPEWk03 = 0
        var TotalBuyTypeGPEWk04 = 0
        var TotalBuyTypeGPEWk05 = 0
        var TotalBuyTypeGPEWk06 = 0
        var TotalBuyTypeGPEWk07 = 0
        var TotalBuyTypeGPEWk08 = 0
        var TotalBuyTypeGPEWk09 = 0
        var TotalBuyTypeGPEWk10 = 0
        var TotalBuyTypeGPEWk11 = 0
        var TotalBuyTypeGPEWk12 = 0
        var TotalBuyTypeGPEWk13 = 0
        var TotalBuyTypeGPEWk14 = 0

        var TotalBTA = 0
        var TotalBTAWk01 = 0
        var TotalBTAWk02 = 0
        var TotalBTAWk03 = 0
        var TotalBTAWk04 = 0
        var TotalBTAWk05 = 0
        var TotalBTAWk06 = 0
        var TotalBTAWk07 = 0
        var TotalBTAWk08 = 0
        var TotalBTAWk09 = 0
        var TotalBTAWk10 = 0
        var TotalBTAWk11 = 0
        var TotalBTAWk12 = 0
        var TotalBTAWk13 = 0
        var TotalBTAWk14 = 0

        var TotalBuyTypeA = 0
        var TotalBuyTypeAWk01 = 0
        var TotalBuyTypeAWk02 = 0
        var TotalBuyTypeAWk03 = 0
        var TotalBuyTypeAWk04 = 0
        var TotalBuyTypeAWk05 = 0
        var TotalBuyTypeAWk06 = 0
        var TotalBuyTypeAWk07 = 0
        var TotalBuyTypeAWk08 = 0
        var TotalBuyTypeAWk09 = 0
        var TotalBuyTypeAWk10 = 0
        var TotalBuyTypeAWk11 = 0
        var TotalBuyTypeAWk12 = 0
        var TotalBuyTypeAWk13 = 0
        var TotalBuyTypeAWk14 = 0

        var TotalBTMG = 0
        var TotalBTMGWk01 = 0
        var TotalBTMGWk02 = 0
        var TotalBTMGWk03 = 0
        var TotalBTMGWk04 = 0
        var TotalBTMGWk05 = 0
        var TotalBTMGWk06 = 0
        var TotalBTMGWk07 = 0
        var TotalBTMGWk08 = 0
        var TotalBTMGWk09 = 0
        var TotalBTMGWk10 = 0
        var TotalBTMGWk11 = 0
        var TotalBTMGWk12 = 0
        var TotalBTMGWk13 = 0
        var TotalBTMGWk14 = 0

        var TotalBuyTypeMG = 0
        var TotalBuyTypeMGWk01 = 0
        var TotalBuyTypeMGWk02 = 0
        var TotalBuyTypeMGWk03 = 0
        var TotalBuyTypeMGWk04 = 0
        var TotalBuyTypeMGWk05 = 0
        var TotalBuyTypeMGWk06 = 0
        var TotalBuyTypeMGWk07 = 0
        var TotalBuyTypeMGWk08 = 0
        var TotalBuyTypeMGWk09 = 0
        var TotalBuyTypeMGWk10 = 0
        var TotalBuyTypeMGWk11 = 0
        var TotalBuyTypeMGWk12 = 0
        var TotalBuyTypeMGWk13 = 0
        var TotalBuyTypeMGWk14 = 0

        var TotalBTM = 0
        var TotalBTMWk01 = 0
        var TotalBTMWk02 = 0
        var TotalBTMWk03 = 0
        var TotalBTMWk04 = 0
        var TotalBTMWk05 = 0
        var TotalBTMWk06 = 0
        var TotalBTMWk07 = 0
        var TotalBTMWk08 = 0
        var TotalBTMWk09 = 0
        var TotalBTMWk10 = 0
        var TotalBTMWk11 = 0
        var TotalBTMWk12 = 0
        var TotalBTMWk13 = 0
        var TotalBTMWk14 = 0

        var TotalBuyTypeM = 0
        var TotalBuyTypeMWk01 = 0
        var TotalBuyTypeMWk02 = 0
        var TotalBuyTypeMWk03 = 0
        var TotalBuyTypeMWk04 = 0
        var TotalBuyTypeMWk05 = 0
        var TotalBuyTypeMWk06 = 0
        var TotalBuyTypeMWk07 = 0
        var TotalBuyTypeMWk08 = 0
        var TotalBuyTypeMWk09 = 0
        var TotalBuyTypeMWk10 = 0
        var TotalBuyTypeMWk11 = 0
        var TotalBuyTypeMWk12 = 0
        var TotalBuyTypeMWk13 = 0
        var TotalBuyTypeMWk14 = 0

        var TotalBTB = 0
        var TotalBTBWk01 = 0
        var TotalBTBWk02 = 0
        var TotalBTBWk03 = 0
        var TotalBTBWk04 = 0
        var TotalBTBWk05 = 0
        var TotalBTBWk06 = 0
        var TotalBTBWk07 = 0
        var TotalBTBWk08 = 0
        var TotalBTBWk09 = 0
        var TotalBTBWk10 = 0
        var TotalBTBWk11 = 0
        var TotalBTBWk12 = 0
        var TotalBTBWk13 = 0
        var TotalBTBWk14 = 0

        var TotalBuyTypeB = 0
        var TotalBuyTypeBWk01 = 0
        var TotalBuyTypeBWk02 = 0
        var TotalBuyTypeBWk03 = 0
        var TotalBuyTypeBWk04 = 0
        var TotalBuyTypeBWk05 = 0
        var TotalBuyTypeBWk06 = 0
        var TotalBuyTypeBWk07 = 0
        var TotalBuyTypeBWk08 = 0
        var TotalBuyTypeBWk09 = 0
        var TotalBuyTypeBWk10 = 0
        var TotalBuyTypeBWk11 = 0
        var TotalBuyTypeBWk12 = 0
        var TotalBuyTypeBWk13 = 0
        var TotalBuyTypeBWk14 = 0

        var TotalBTUE = 0
        var TotalBTUEWk01 = 0
        var TotalBTUEWk02 = 0
        var TotalBTUEWk03 = 0
        var TotalBTUEWk04 = 0
        var TotalBTUEWk05 = 0
        var TotalBTUEWk06 = 0
        var TotalBTUEWk07 = 0
        var TotalBTUEWk08 = 0
        var TotalBTUEWk09 = 0
        var TotalBTUEWk10 = 0
        var TotalBTUEWk11 = 0
        var TotalBTUEWk12 = 0
        var TotalBTUEWk13 = 0
        var TotalBTUEWk14 = 0

        var TotalBuyTypeUE = 0
        var TotalBuyTypeUEWk01 = 0
        var TotalBuyTypeUEWk02 = 0
        var TotalBuyTypeUEWk03 = 0
        var TotalBuyTypeUEWk04 = 0
        var TotalBuyTypeUEWk05 = 0
        var TotalBuyTypeUEWk06 = 0
        var TotalBuyTypeUEWk07 = 0
        var TotalBuyTypeUEWk08 = 0
        var TotalBuyTypeUEWk09 = 0
        var TotalBuyTypeUEWk10 = 0
        var TotalBuyTypeUEWk11 = 0
        var TotalBuyTypeUEWk12 = 0
        var TotalBuyTypeUEWk13 = 0
        var TotalBuyTypeUEWk14 = 0

        var TotalBTAD = 0
        var TotalBTADWk01 = 0
        var TotalBTADWk02 = 0
        var TotalBTADWk03 = 0
        var TotalBTADWk04 = 0
        var TotalBTADWk05 = 0
        var TotalBTADWk06 = 0
        var TotalBTADWk07 = 0
        var TotalBTADWk08 = 0
        var TotalBTADWk09 = 0
        var TotalBTADWk10 = 0
        var TotalBTADWk11 = 0
        var TotalBTADWk12 = 0
        var TotalBTADWk13 = 0
        var TotalBTADWk14 = 0

        var TotalBuyTypeAD = 0
        var TotalBuyTypeADWk01 = 0
        var TotalBuyTypeADWk02 = 0
        var TotalBuyTypeADWk03 = 0
        var TotalBuyTypeADWk04 = 0
        var TotalBuyTypeADWk05 = 0
        var TotalBuyTypeADWk06 = 0
        var TotalBuyTypeADWk07 = 0
        var TotalBuyTypeADWk08 = 0
        var TotalBuyTypeADWk09 = 0
        var TotalBuyTypeADWk10 = 0
        var TotalBuyTypeADWk11 = 0
        var TotalBuyTypeADWk12 = 0
        var TotalBuyTypeADWk13 = 0
        var TotalBuyTypeADWk14 = 0

        var TotalBTNLV = 0
        var TotalBTNLVWk01 = 0
        var TotalBTNLVWk02 = 0
        var TotalBTNLVWk03 = 0
        var TotalBTNLVWk04 = 0
        var TotalBTNLVWk05 = 0
        var TotalBTNLVWk06 = 0
        var TotalBTNLVWk07 = 0
        var TotalBTNLVWk08 = 0
        var TotalBTNLVWk09 = 0
        var TotalBTNLVWk10 = 0
        var TotalBTNLVWk11 = 0
        var TotalBTNLVWk12 = 0
        var TotalBTNLVWk13 = 0
        var TotalBTNLVWk14 = 0

        var TotalBuyTypeNLV = 0
        var TotalBuyTypeNLVWk01 = 0
        var TotalBuyTypeNLVWk02 = 0
        var TotalBuyTypeNLVWk03 = 0
        var TotalBuyTypeNLVWk04 = 0
        var TotalBuyTypeNLVWk05 = 0
        var TotalBuyTypeNLVWk06 = 0
        var TotalBuyTypeNLVWk07 = 0
        var TotalBuyTypeNLVWk08 = 0
        var TotalBuyTypeNLVWk09 = 0
        var TotalBuyTypeNLVWk10 = 0
        var TotalBuyTypeNLVWk11 = 0
        var TotalBuyTypeNLVWk12 = 0
        var TotalBuyTypeNLVWk13 = 0
        var TotalBuyTypeNLVWk14 = 0

        var TotalBTPM = 0
        var TotalBTPMWk01 = 0
        var TotalBTPMWk02 = 0
        var TotalBTPMWk03 = 0
        var TotalBTPMWk04 = 0
        var TotalBTPMWk05 = 0
        var TotalBTPMWk06 = 0
        var TotalBTPMWk07 = 0
        var TotalBTPMWk08 = 0
        var TotalBTPMWk09 = 0
        var TotalBTPMWk10 = 0
        var TotalBTPMWk11 = 0
        var TotalBTPMWk12 = 0
        var TotalBTPMWk13 = 0
        var TotalBTPMWk14 = 0

        var TotalBuyTypePM = 0
        var TotalBuyTypePMWk01 = 0
        var TotalBuyTypePMWk02 = 0
        var TotalBuyTypePMWk03 = 0
        var TotalBuyTypePMWk04 = 0
        var TotalBuyTypePMWk05 = 0
        var TotalBuyTypePMWk06 = 0
        var TotalBuyTypePMWk07 = 0
        var TotalBuyTypePMWk08 = 0
        var TotalBuyTypePMWk09 = 0
        var TotalBuyTypePMWk10 = 0
        var TotalBuyTypePMWk11 = 0
        var TotalBuyTypePMWk12 = 0
        var TotalBuyTypePMWk13 = 0
        var TotalBuyTypePMWk14 = 0

        proptable.rows({ search: 'applied' }).every(function (rowIdx, tableLoop, rowLoop) {
            var data = this.data();
            var node = this.node();

            var cellPercent = proptable.cell({ row: rowIdx, column: 23 }).node();
            var cellCPM = proptable.cell({ row: rowIdx, column: 25 }).node();

            var stringOfSpotLen = data[20];
            var htmlSpotLen = $(stringOfSpotLen);

            var DayPart = data[18];
            var SpotLen = $(htmlSpotLen).text();
            var BuyType = data[21];
            var Universe = parseInt(data[4]);
            var FullRate = parseFloat(data[22].replace('$', ' ').replace(',', ''));
            var Discount = parseFloat($("#DiscountPrice").find(":selected").text().replace('%', ''));
            var Impressions = parseInt(data[26].replace('$', ' ').replace(',', ''));
            var Spot = parseInt(data[27]);
            var SpotsWk01 = parseInt(data[28]);
            var SpotsWk02 = parseInt(data[29]);
            var SpotsWk03 = parseInt(data[30]);
            var SpotsWk04 = parseInt(data[31]);
            var SpotsWk05 = parseInt(data[32]);
            var SpotsWk06 = parseInt(data[33]);
            var SpotsWk07 = parseInt(data[34]);
            var SpotsWk08 = parseInt(data[35]);
            var SpotsWk09 = parseInt(data[36]);
            var SpotsWk10 = parseInt(data[37]);
            var SpotsWk11 = parseInt(data[38]);
            var SpotsWk12 = parseInt(data[39]);
            var SpotsWk13 = parseInt(data[40]);
            var SpotsWk14 = parseInt(data[41]);

            $(cellPercent).html('$' + ((FullRate * .85) + (FullRate * Discount * .03)).toFixed(2)).show();

            TotalSpots = TotalSpots + Spot;
            TotalSpotsWk01 = TotalSpotsWk01 + SpotsWk01;
            TotalSpotsWk02 = TotalSpotsWk02 + SpotsWk02;
            TotalSpotsWk03 = TotalSpotsWk03 + SpotsWk03;
            TotalSpotsWk04 = TotalSpotsWk04 + SpotsWk04;
            TotalSpotsWk05 = TotalSpotsWk05 + SpotsWk05;
            TotalSpotsWk06 = TotalSpotsWk06 + SpotsWk06;
            TotalSpotsWk07 = TotalSpotsWk07 + SpotsWk07;
            TotalSpotsWk08 = TotalSpotsWk08 + SpotsWk08;
            TotalSpotsWk09 = TotalSpotsWk09 + SpotsWk09;
            TotalSpotsWk10 = TotalSpotsWk10 + SpotsWk10;
            TotalSpotsWk11 = TotalSpotsWk11 + SpotsWk11;
            TotalSpotsWk12 = TotalSpotsWk12 + SpotsWk12;
            TotalSpotsWk13 = TotalSpotsWk13 + SpotsWk13;
            TotalSpotsWk14 = TotalSpotsWk14 + SpotsWk14;

            TotalGrossDollarsWk01 = TotalGrossDollarsWk01 + (FullRate * SpotsWk01);
            TotalGrossDollarsWk02 = TotalGrossDollarsWk02 + (FullRate * SpotsWk02);
            TotalGrossDollarsWk03 = TotalGrossDollarsWk03 + (FullRate * SpotsWk03);
            TotalGrossDollarsWk04 = TotalGrossDollarsWk04 + (FullRate * SpotsWk04);
            TotalGrossDollarsWk05 = TotalGrossDollarsWk05 + (FullRate * SpotsWk05);
            TotalGrossDollarsWk06 = TotalGrossDollarsWk06 + (FullRate * SpotsWk06);
            TotalGrossDollarsWk07 = TotalGrossDollarsWk07 + (FullRate * SpotsWk07);
            TotalGrossDollarsWk08 = TotalGrossDollarsWk08 + (FullRate * SpotsWk08);
            TotalGrossDollarsWk09 = TotalGrossDollarsWk09 + (FullRate * SpotsWk09);
            TotalGrossDollarsWk10 = TotalGrossDollarsWk10 + (FullRate * SpotsWk10);
            TotalGrossDollarsWk11 = TotalGrossDollarsWk11 + (FullRate * SpotsWk11);
            TotalGrossDollarsWk12 = TotalGrossDollarsWk12 + (FullRate * SpotsWk12);
            TotalGrossDollarsWk13 = TotalGrossDollarsWk13 + (FullRate * SpotsWk13);
            TotalGrossDollarsWk14 = TotalGrossDollarsWk14 + (FullRate * SpotsWk14);
            TotalGrossDollars = TotalGrossDollarsWk01 + TotalGrossDollarsWk02 +
                TotalGrossDollarsWk03 + TotalGrossDollarsWk04 +
                TotalGrossDollarsWk05 + TotalGrossDollarsWk06 +
                TotalGrossDollarsWk07 + TotalGrossDollarsWk08 +
                TotalGrossDollarsWk09 + TotalGrossDollarsWk10 +
                TotalGrossDollarsWk11 + TotalGrossDollarsWk12 +
                TotalGrossDollarsWk13 + TotalGrossDollarsWk14;

            TotalGrossImpressionsWk01 = TotalGrossImpressionsWk01 + (Impressions * SpotsWk01);
            TotalGrossImpressionsWk02 = TotalGrossImpressionsWk02 + (Impressions * SpotsWk02);
            TotalGrossImpressionsWk03 = TotalGrossImpressionsWk03 + (Impressions * SpotsWk03);
            TotalGrossImpressionsWk04 = TotalGrossImpressionsWk04 + (Impressions * SpotsWk04);
            TotalGrossImpressionsWk05 = TotalGrossImpressionsWk05 + (Impressions * SpotsWk05);
            TotalGrossImpressionsWk06 = TotalGrossImpressionsWk06 + (Impressions * SpotsWk06);
            TotalGrossImpressionsWk07 = TotalGrossImpressionsWk07 + (Impressions * SpotsWk07);
            TotalGrossImpressionsWk08 = TotalGrossImpressionsWk08 + (Impressions * SpotsWk08);
            TotalGrossImpressionsWk09 = TotalGrossImpressionsWk09 + (Impressions * SpotsWk09);
            TotalGrossImpressionsWk10 = TotalGrossImpressionsWk10 + (Impressions * SpotsWk10);
            TotalGrossImpressionsWk11 = TotalGrossImpressionsWk11 + (Impressions * SpotsWk11);
            TotalGrossImpressionsWk12 = TotalGrossImpressionsWk12 + (Impressions * SpotsWk12);
            TotalGrossImpressionsWk13 = TotalGrossImpressionsWk13 + (Impressions * SpotsWk13);
            TotalGrossImpressionsWk14 = TotalGrossImpressionsWk14 + (Impressions * SpotsWk14);
            TotalGrossImpressions = TotalGrossImpressionsWk01 + TotalGrossImpressionsWk02 +
                TotalGrossImpressionsWk03 + TotalGrossImpressionsWk04 +
                TotalGrossImpressionsWk05 + TotalGrossImpressionsWk06 +
                TotalGrossImpressionsWk07 + TotalGrossImpressionsWk08 +
                TotalGrossImpressionsWk09 + TotalGrossImpressionsWk10 +
                TotalGrossImpressionsWk11 + TotalGrossImpressionsWk12 +
                TotalGrossImpressionsWk13 + TotalGrossImpressionsWk14;

            TotalClientDollarsWk01 = TotalClientDollarsWk01 + (SpotsWk01 * (FullRate * 0.85));
            TotalClientDollarsWk02 = TotalClientDollarsWk02 + (SpotsWk02 * (FullRate * 0.85));
            TotalClientDollarsWk03 = TotalClientDollarsWk03 + (SpotsWk03 * (FullRate * 0.85));
            TotalClientDollarsWk04 = TotalClientDollarsWk04 + (SpotsWk04 * (FullRate * 0.85));
            TotalClientDollarsWk05 = TotalClientDollarsWk05 + (SpotsWk05 * (FullRate * 0.85));
            TotalClientDollarsWk06 = TotalClientDollarsWk06 + (SpotsWk06 * (FullRate * 0.85));
            TotalClientDollarsWk07 = TotalClientDollarsWk07 + (SpotsWk07 * (FullRate * 0.85));
            TotalClientDollarsWk08 = TotalClientDollarsWk08 + (SpotsWk08 * (FullRate * 0.85));
            TotalClientDollarsWk09 = TotalClientDollarsWk09 + (SpotsWk09 * (FullRate * 0.85));
            TotalClientDollarsWk10 = TotalClientDollarsWk10 + (SpotsWk10 * (FullRate * 0.85));
            TotalClientDollarsWk11 = TotalClientDollarsWk11 + (SpotsWk11 * (FullRate * 0.85));
            TotalClientDollarsWk12 = TotalClientDollarsWk12 + (SpotsWk12 * (FullRate * 0.85));
            TotalClientDollarsWk13 = TotalClientDollarsWk13 + (SpotsWk13 * (FullRate * 0.85));
            TotalClientDollarsWk14 = TotalClientDollarsWk14 + (SpotsWk14 * (FullRate * 0.85));
            TotalClientDollars = TotalClientDollarsWk01 + TotalClientDollarsWk02 +
                TotalClientDollarsWk03 + TotalClientDollarsWk04 +
                TotalClientDollarsWk05 + TotalClientDollarsWk06 +
                TotalClientDollarsWk07 + TotalClientDollarsWk08 +
                TotalClientDollarsWk09 + TotalClientDollarsWk10 +
                TotalClientDollarsWk11 + TotalClientDollarsWk12 +
                TotalClientDollarsWk13 + TotalClientDollarsWk14;

            TotalGRPWk01 = TotalGRPWk01 + (Universe <= 0 ? 0 : TotalGrossImpressionsWk01 / (.1 * Universe));
            TotalGRPWk02 = TotalGRPWk02 + (Universe <= 0 ? 0 : TotalGrossImpressionsWk02 / (.1 * Universe));
            TotalGRPWk03 = TotalGRPWk03 + (Universe <= 0 ? 0 : TotalGrossImpressionsWk03 / (.1 * Universe));
            TotalGRPWk04 = TotalGRPWk04 + (Universe <= 0 ? 0 : TotalGrossImpressionsWk04 / (.1 * Universe));
            TotalGRPWk05 = TotalGRPWk05 + (Universe <= 0 ? 0 : TotalGrossImpressionsWk05 / (.1 * Universe));
            TotalGRPWk06 = TotalGRPWk06 + (Universe <= 0 ? 0 : TotalGrossImpressionsWk06 / (.1 * Universe));
            TotalGRPWk07 = TotalGRPWk07 + (Universe <= 0 ? 0 : TotalGrossImpressionsWk07 / (.1 * Universe));
            TotalGRPWk08 = TotalGRPWk08 + (Universe <= 0 ? 0 : TotalGrossImpressionsWk08 / (.1 * Universe));
            TotalGRPWk09 = TotalGRPWk09 + (Universe <= 0 ? 0 : TotalGrossImpressionsWk09 / (.1 * Universe));
            TotalGRPWk10 = TotalGRPWk10 + (Universe <= 0 ? 0 : TotalGrossImpressionsWk10 / (.1 * Universe));
            TotalGRPWk11 = TotalGRPWk11 + (Universe <= 0 ? 0 : TotalGrossImpressionsWk11 / (.1 * Universe));
            TotalGRPWk12 = TotalGRPWk12 + (Universe <= 0 ? 0 : TotalGrossImpressionsWk12 / (.1 * Universe));
            TotalGRPWk13 = TotalGRPWk13 + (Universe <= 0 ? 0 : TotalGrossImpressionsWk13 / (.1 * Universe));
            TotalGRPWk14 = TotalGRPWk14 + (Universe <= 0 ? 0 : TotalGrossImpressionsWk14 / (.1 * Universe));
            TotalGRP = TotalGRPWk01 + TotalGRPWk02 +
                TotalGRPWk03 + TotalGRPWk04 +
                TotalGRPWk05 + TotalGRPWk06 +
                TotalGRPWk07 + TotalGRPWk08 +
                TotalGRPWk09 + TotalGRPWk10 +
                TotalGRPWk11 + TotalGRPWk12 +
                TotalGRPWk13 + TotalGRPWk14;

            /* Gross Income -- Spot Len */
            if (SpotLen == 15) {
                Total15Wk01 = Total15Wk01 + (SpotsWk01 * Impressions);
                Total15Wk02 = Total15Wk02 + (SpotsWk02 * Impressions);
                Total15Wk03 = Total15Wk03 + (SpotsWk03 * Impressions);
                Total15Wk04 = Total15Wk04 + (SpotsWk04 * Impressions);
                Total15Wk05 = Total15Wk05 + (SpotsWk05 * Impressions);
                Total15Wk06 = Total15Wk06 + (SpotsWk06 * Impressions);
                Total15Wk07 = Total15Wk07 + (SpotsWk07 * Impressions);
                Total15Wk08 = Total15Wk08 + (SpotsWk08 * Impressions);
                Total15Wk09 = Total15Wk09 + (SpotsWk09 * Impressions);
                Total15Wk10 = Total15Wk10 + (SpotsWk10 * Impressions);
                Total15Wk11 = Total15Wk11 + (SpotsWk11 * Impressions);
                Total15Wk12 = Total15Wk12 + (SpotsWk12 * Impressions);
                Total15Wk13 = Total15Wk13 + (SpotsWk13 * Impressions);
                Total15Wk14 = Total15Wk14 + (SpotsWk14 * Impressions);
            }
            else if (SpotLen == 30) {
                Total30Wk01 = Total30Wk01 + (SpotsWk01 * Impressions);
                Total30Wk02 = Total30Wk02 + (SpotsWk02 * Impressions);
                Total30Wk03 = Total30Wk03 + (SpotsWk03 * Impressions);
                Total30Wk04 = Total30Wk04 + (SpotsWk04 * Impressions);
                Total30Wk05 = Total30Wk05 + (SpotsWk05 * Impressions);
                Total30Wk06 = Total30Wk06 + (SpotsWk06 * Impressions);
                Total30Wk07 = Total30Wk07 + (SpotsWk07 * Impressions);
                Total30Wk08 = Total30Wk08 + (SpotsWk08 * Impressions);
                Total30Wk09 = Total30Wk09 + (SpotsWk09 * Impressions);
                Total30Wk10 = Total30Wk10 + (SpotsWk10 * Impressions);
                Total30Wk11 = Total30Wk11 + (SpotsWk11 * Impressions);
                Total30Wk12 = Total30Wk12 + (SpotsWk12 * Impressions);
                Total30Wk13 = Total30Wk13 + (SpotsWk13 * Impressions);
                Total30Wk14 = Total30Wk14 + (SpotsWk14 * Impressions);
            }
            else if (SpotLen == 60) {
                Total60Wk01 = Total60Wk01 + (SpotsWk01 * Impressions);
                Total60Wk02 = Total60Wk02 + (SpotsWk02 * Impressions);
                Total60Wk03 = Total60Wk03 + (SpotsWk03 * Impressions);
                Total60Wk04 = Total60Wk04 + (SpotsWk04 * Impressions);
                Total60Wk05 = Total60Wk05 + (SpotsWk05 * Impressions);
                Total60Wk06 = Total60Wk06 + (SpotsWk06 * Impressions);
                Total60Wk07 = Total60Wk07 + (SpotsWk07 * Impressions);
                Total60Wk08 = Total60Wk08 + (SpotsWk08 * Impressions);
                Total60Wk09 = Total60Wk09 + (SpotsWk09 * Impressions);
                Total60Wk10 = Total60Wk10 + (SpotsWk10 * Impressions);
                Total60Wk11 = Total60Wk11 + (SpotsWk11 * Impressions);
                Total60Wk12 = Total60Wk12 + (SpotsWk12 * Impressions);
                Total60Wk13 = Total60Wk13 + (SpotsWk13 * Impressions);
                Total60Wk14 = Total60Wk14 + (SpotsWk14 * Impressions);
            }
            else if (SpotLen == 120) {
                Total120Wk01 = Total120Wk01 + (SpotsWk01 * Impressions);
                Total120Wk02 = Total120Wk02 + (SpotsWk02 * Impressions);
                Total120Wk03 = Total120Wk03 + (SpotsWk03 * Impressions);
                Total120Wk04 = Total120Wk04 + (SpotsWk04 * Impressions);
                Total120Wk05 = Total120Wk05 + (SpotsWk05 * Impressions);
                Total120Wk06 = Total120Wk06 + (SpotsWk06 * Impressions);
                Total120Wk07 = Total120Wk07 + (SpotsWk07 * Impressions);
                Total120Wk08 = Total120Wk08 + (SpotsWk08 * Impressions);
                Total120Wk09 = Total120Wk09 + (SpotsWk09 * Impressions);
                Total120Wk10 = Total120Wk10 + (SpotsWk10 * Impressions);
                Total120Wk11 = Total120Wk11 + (SpotsWk11 * Impressions);
                Total120Wk12 = Total120Wk12 + (SpotsWk12 * Impressions);
                Total120Wk13 = Total120Wk13 + (SpotsWk13 * Impressions);
                Total120Wk14 = Total120Wk14 + (SpotsWk14 * Impressions);
            }

            if (DayPart == 'M') {
                TotalMWk01 = TotalMWk01 + (SpotsWk01 * Impressions);
                TotalMWk02 = TotalMWk02 + (SpotsWk02 * Impressions);
                TotalMWk03 = TotalMWk03 + (SpotsWk03 * Impressions);
                TotalMWk04 = TotalMWk04 + (SpotsWk04 * Impressions);
                TotalMWk05 = TotalMWk05 + (SpotsWk05 * Impressions);
                TotalMWk06 = TotalMWk06 + (SpotsWk06 * Impressions);
                TotalMWk07 = TotalMWk07 + (SpotsWk07 * Impressions);
                TotalMWk08 = TotalMWk08 + (SpotsWk08 * Impressions);
                TotalMWk09 = TotalMWk09 + (SpotsWk09 * Impressions);
                TotalMWk10 = TotalMWk10 + (SpotsWk10 * Impressions);
                TotalMWk11 = TotalMWk11 + (SpotsWk11 * Impressions);
                TotalMWk12 = TotalMWk12 + (SpotsWk12 * Impressions);
                TotalMWk13 = TotalMWk13 + (SpotsWk13 * Impressions);
                TotalMWk14 = TotalMWk14 + (SpotsWk14 * Impressions);
            }
            else if (DayPart == 'D') {
                TotalDWk01 = TotalDWk01 + (SpotsWk01 * Impressions);
                TotalDWk02 = TotalDWk02 + (SpotsWk02 * Impressions);
                TotalDWk03 = TotalDWk03 + (SpotsWk03 * Impressions);
                TotalDWk04 = TotalDWk04 + (SpotsWk04 * Impressions);
                TotalDWk05 = TotalDWk05 + (SpotsWk05 * Impressions);
                TotalDWk06 = TotalDWk06 + (SpotsWk06 * Impressions);
                TotalDWk07 = TotalDWk07 + (SpotsWk07 * Impressions);
                TotalDWk08 = TotalDWk08 + (SpotsWk08 * Impressions);
                TotalDWk09 = TotalDWk09 + (SpotsWk09 * Impressions);
                TotalDWk10 = TotalDWk10 + (SpotsWk10 * Impressions);
                TotalDWk11 = TotalDWk11 + (SpotsWk11 * Impressions);
                TotalDWk12 = TotalDWk12 + (SpotsWk12 * Impressions);
                TotalDWk13 = TotalDWk13 + (SpotsWk13 * Impressions);
                TotalDWk14 = TotalDWk14 + (SpotsWk14 * Impressions);
            }
            else if (DayPart == 'F') {
                TotalFWk01 = TotalFWk01 + (SpotsWk01 * Impressions);
                TotalFWk02 = TotalFWk02 + (SpotsWk02 * Impressions);
                TotalFWk03 = TotalFWk03 + (SpotsWk03 * Impressions);
                TotalFWk04 = TotalFWk04 + (SpotsWk04 * Impressions);
                TotalFWk05 = TotalFWk05 + (SpotsWk05 * Impressions);
                TotalFWk06 = TotalFWk06 + (SpotsWk06 * Impressions);
                TotalFWk07 = TotalFWk07 + (SpotsWk07 * Impressions);
                TotalFWk08 = TotalFWk08 + (SpotsWk08 * Impressions);
                TotalFWk09 = TotalFWk09 + (SpotsWk09 * Impressions);
                TotalFWk10 = TotalFWk10 + (SpotsWk10 * Impressions);
                TotalFWk11 = TotalFWk11 + (SpotsWk11 * Impressions);
                TotalFWk12 = TotalFWk12 + (SpotsWk12 * Impressions);
                TotalFWk13 = TotalFWk13 + (SpotsWk13 * Impressions);
                TotalFWk14 = TotalFWk14 + (SpotsWk14 * Impressions);

            }
            else if (DayPart == 'P') {
                TotalPWk01 = TotalPWk01 + (SpotsWk01 * Impressions);
                TotalPWk02 = TotalPWk02 + (SpotsWk02 * Impressions);
                TotalPWk03 = TotalPWk03 + (SpotsWk03 * Impressions);
                TotalPWk04 = TotalPWk04 + (SpotsWk04 * Impressions);
                TotalPWk05 = TotalPWk05 + (SpotsWk05 * Impressions);
                TotalPWk06 = TotalPWk06 + (SpotsWk06 * Impressions);
                TotalPWk07 = TotalPWk07 + (SpotsWk07 * Impressions);
                TotalPWk08 = TotalPWk08 + (SpotsWk08 * Impressions);
                TotalPWk09 = TotalPWk09 + (SpotsWk09 * Impressions);
                TotalPWk10 = TotalPWk10 + (SpotsWk10 * Impressions);
                TotalPWk11 = TotalPWk11 + (SpotsWk11 * Impressions);
                TotalPWk12 = TotalPWk12 + (SpotsWk12 * Impressions);
                TotalPWk13 = TotalPWk13 + (SpotsWk13 * Impressions);
                TotalPWk14 = TotalPWk14 + (SpotsWk14 * Impressions);
            }
            else if (DayPart == 'L') {
                TotalLWk01 = TotalLWk01 + (SpotsWk01 * Impressions);
                TotalLWk02 = TotalLWk02 + (SpotsWk02 * Impressions);
                TotalLWk03 = TotalLWk03 + (SpotsWk03 * Impressions);
                TotalLWk04 = TotalLWk04 + (SpotsWk04 * Impressions);
                TotalLWk05 = TotalLWk05 + (SpotsWk05 * Impressions);
                TotalLWk06 = TotalLWk06 + (SpotsWk06 * Impressions);
                TotalLWk07 = TotalLWk07 + (SpotsWk07 * Impressions);
                TotalLWk08 = TotalLWk08 + (SpotsWk08 * Impressions);
                TotalLWk09 = TotalLWk09 + (SpotsWk09 * Impressions);
                TotalLWk10 = TotalLWk10 + (SpotsWk10 * Impressions);
                TotalLWk11 = TotalLWk11 + (SpotsWk11 * Impressions);
                TotalLWk12 = TotalLWk12 + (SpotsWk12 * Impressions);
                TotalLWk13 = TotalLWk13 + (SpotsWk13 * Impressions);
                TotalLWk14 = TotalLWk14 + (SpotsWk14 * Impressions);
            }
            else if (DayPart == 'O') {
                TotalOWk01 = TotalOWk01 + (SpotsWk01 * Impressions);
                TotalOWk02 = TotalOWk02 + (SpotsWk02 * Impressions);
                TotalOWk03 = TotalOWk03 + (SpotsWk03 * Impressions);
                TotalOWk04 = TotalOWk04 + (SpotsWk04 * Impressions);
                TotalOWk05 = TotalOWk05 + (SpotsWk05 * Impressions);
                TotalOWk06 = TotalOWk06 + (SpotsWk06 * Impressions);
                TotalOWk07 = TotalOWk07 + (SpotsWk07 * Impressions);
                TotalOWk08 = TotalOWk08 + (SpotsWk08 * Impressions);
                TotalOWk09 = TotalOWk09 + (SpotsWk09 * Impressions);
                TotalOWk10 = TotalOWk10 + (SpotsWk10 * Impressions);
                TotalOWk11 = TotalOWk11 + (SpotsWk11 * Impressions);
                TotalOWk12 = TotalOWk12 + (SpotsWk12 * Impressions);
                TotalOWk13 = TotalOWk13 + (SpotsWk13 * Impressions);
                TotalOWk14 = TotalOWk14 + (SpotsWk14 * Impressions);
            }
            else if (DayPart == 'W') {
                TotalWWk01 = TotalWWk01 + (SpotsWk01 * Impressions);
                TotalWWk02 = TotalWWk02 + (SpotsWk02 * Impressions);
                TotalWWk03 = TotalWWk03 + (SpotsWk03 * Impressions);
                TotalWWk04 = TotalWWk04 + (SpotsWk04 * Impressions);
                TotalWWk05 = TotalWWk05 + (SpotsWk05 * Impressions);
                TotalWWk06 = TotalWWk06 + (SpotsWk06 * Impressions);
                TotalWWk07 = TotalWWk07 + (SpotsWk07 * Impressions);
                TotalWWk08 = TotalWWk08 + (SpotsWk08 * Impressions);
                TotalWWk09 = TotalWWk09 + (SpotsWk09 * Impressions);
                TotalWWk10 = TotalWWk10 + (SpotsWk10 * Impressions);
                TotalWWk11 = TotalWWk11 + (SpotsWk11 * Impressions);
                TotalWWk12 = TotalWWk12 + (SpotsWk12 * Impressions);
                TotalWWk13 = TotalWWk13 + (SpotsWk13 * Impressions);
                TotalWWk14 = TotalWWk14 + (SpotsWk14 * Impressions);
            }
            else if (DayPart == 'R') {
                TotalRWk01 = TotalRWk01 + (SpotsWk01 * Impressions);
                TotalRWk02 = TotalRWk02 + (SpotsWk02 * Impressions);
                TotalRWk03 = TotalRWk03 + (SpotsWk03 * Impressions);
                TotalRWk04 = TotalRWk04 + (SpotsWk04 * Impressions);
                TotalRWk05 = TotalRWk05 + (SpotsWk05 * Impressions);
                TotalRWk06 = TotalRWk06 + (SpotsWk06 * Impressions);
                TotalRWk07 = TotalRWk07 + (SpotsWk07 * Impressions);
                TotalRWk08 = TotalRWk08 + (SpotsWk08 * Impressions);
                TotalRWk09 = TotalRWk09 + (SpotsWk09 * Impressions);
                TotalRWk10 = TotalRWk10 + (SpotsWk10 * Impressions);
                TotalRWk11 = TotalRWk11 + (SpotsWk11 * Impressions);
                TotalRWk12 = TotalRWk12 + (SpotsWk12 * Impressions);
                TotalRWk13 = TotalRWk13 + (SpotsWk13 * Impressions);
                TotalRWk14 = TotalRWk14 + (SpotsWk14 * Impressions);
            }

            if (BuyType == 'U') {
                TotalBTUWk01 = TotalBTUWk01 + (SpotsWk01 * Impressions);
                TotalBTUWk02 = TotalBTUWk02 + (SpotsWk02 * Impressions);
                TotalBTUWk03 = TotalBTUWk03 + (SpotsWk03 * Impressions);
                TotalBTUWk04 = TotalBTUWk04 + (SpotsWk04 * Impressions);
                TotalBTUWk05 = TotalBTUWk05 + (SpotsWk05 * Impressions);
                TotalBTUWk06 = TotalBTUWk06 + (SpotsWk06 * Impressions);
                TotalBTUWk07 = TotalBTUWk07 + (SpotsWk07 * Impressions);
                TotalBTUWk08 = TotalBTUWk08 + (SpotsWk08 * Impressions);
                TotalBTUWk09 = TotalBTUWk09 + (SpotsWk09 * Impressions);
                TotalBTUWk10 = TotalBTUWk10 + (SpotsWk10 * Impressions);
                TotalBTUWk11 = TotalBTUWk11 + (SpotsWk11 * Impressions);
                TotalBTUWk12 = TotalBTUWk12 + (SpotsWk12 * Impressions);
                TotalBTUWk13 = TotalBTUWk13 + (SpotsWk13 * Impressions);
                TotalBTUWk14 = TotalBTUWk14 + (SpotsWk14 * Impressions);
            }
            else if (BuyType == 'GPU') {
                TotalBTGPUWk01 = TotalBTGPUWk01 + (SpotsWk01 * Impressions);
                TotalBTGPUWk02 = TotalBTGPUWk02 + (SpotsWk02 * Impressions);
                TotalBTGPUWk03 = TotalBTGPUWk03 + (SpotsWk03 * Impressions);
                TotalBTGPUWk04 = TotalBTGPUWk04 + (SpotsWk04 * Impressions);
                TotalBTGPUWk05 = TotalBTGPUWk05 + (SpotsWk05 * Impressions);
                TotalBTGPUWk06 = TotalBTGPUWk06 + (SpotsWk06 * Impressions);
                TotalBTGPUWk07 = TotalBTGPUWk07 + (SpotsWk07 * Impressions);
                TotalBTGPUWk08 = TotalBTGPUWk08 + (SpotsWk08 * Impressions);
                TotalBTGPUWk09 = TotalBTGPUWk09 + (SpotsWk09 * Impressions);
                TotalBTGPUWk10 = TotalBTGPUWk10 + (SpotsWk10 * Impressions);
                TotalBTGPUWk11 = TotalBTGPUWk11 + (SpotsWk11 * Impressions);
                TotalBTGPUWk12 = TotalBTGPUWk12 + (SpotsWk12 * Impressions);
                TotalBTGPUWk13 = TotalBTGPUWk13 + (SpotsWk13 * Impressions);
                TotalBTGPUWk14 = TotalBTGPUWk14 + (SpotsWk14 * Impressions);


            }
            else if (BuyType == 'GR') {
                TotalBTGRWk01 = TotalBTGRWk01 + (SpotsWk01 * Impressions);
                TotalBTGRWk02 = TotalBTGRWk02 + (SpotsWk02 * Impressions);
                TotalBTGRWk03 = TotalBTGRWk03 + (SpotsWk03 * Impressions);
                TotalBTGRWk04 = TotalBTGRWk04 + (SpotsWk04 * Impressions);
                TotalBTGRWk05 = TotalBTGRWk05 + (SpotsWk05 * Impressions);
                TotalBTGRWk06 = TotalBTGRWk06 + (SpotsWk06 * Impressions);
                TotalBTGRWk07 = TotalBTGRWk07 + (SpotsWk07 * Impressions);
                TotalBTGRWk08 = TotalBTGRWk08 + (SpotsWk08 * Impressions);
                TotalBTGRWk09 = TotalBTGRWk09 + (SpotsWk09 * Impressions);
                TotalBTGRWk10 = TotalBTGRWk10 + (SpotsWk10 * Impressions);
                TotalBTGRWk11 = TotalBTGRWk11 + (SpotsWk11 * Impressions);
                TotalBTGRWk12 = TotalBTGRWk12 + (SpotsWk12 * Impressions);
                TotalBTGRWk13 = TotalBTGRWk13 + (SpotsWk13 * Impressions);
                TotalBTGRWk14 = TotalBTGRWk14 + (SpotsWk14 * Impressions);
            }
            else if (BuyType == 'NR') {
                TotalBTNRWk01 = TotalBTNRWk01 + (SpotsWk01 * Impressions);
                TotalBTNRWk02 = TotalBTNRWk02 + (SpotsWk02 * Impressions);
                TotalBTNRWk03 = TotalBTNRWk03 + (SpotsWk03 * Impressions);
                TotalBTNRWk04 = TotalBTNRWk04 + (SpotsWk04 * Impressions);
                TotalBTNRWk05 = TotalBTNRWk05 + (SpotsWk05 * Impressions);
                TotalBTNRWk06 = TotalBTNRWk06 + (SpotsWk06 * Impressions);
                TotalBTNRWk07 = TotalBTNRWk07 + (SpotsWk07 * Impressions);
                TotalBTNRWk08 = TotalBTNRWk08 + (SpotsWk08 * Impressions);
                TotalBTNRWk09 = TotalBTNRWk09 + (SpotsWk09 * Impressions);
                TotalBTNRWk10 = TotalBTNRWk10 + (SpotsWk10 * Impressions);
                TotalBTNRWk11 = TotalBTNRWk11 + (SpotsWk11 * Impressions);
                TotalBTNRWk12 = TotalBTNRWk12 + (SpotsWk12 * Impressions);
                TotalBTNRWk13 = TotalBTNRWk13 + (SpotsWk13 * Impressions);
                TotalBTNRWk14 = TotalBTNRWk14 + (SpotsWk14 * Impressions);
            }
            else if (BuyType == 'PDR') {
                TotalBTPDRWk01 = TotalBTPDRWk01 + (SpotsWk01 * Impressions);
                TotalBTPDRWk02 = TotalBTPDRWk02 + (SpotsWk02 * Impressions);
                TotalBTPDRWk03 = TotalBTPDRWk03 + (SpotsWk03 * Impressions);
                TotalBTPDRWk04 = TotalBTPDRWk04 + (SpotsWk04 * Impressions);
                TotalBTPDRWk05 = TotalBTPDRWk05 + (SpotsWk05 * Impressions);
                TotalBTPDRWk06 = TotalBTPDRWk06 + (SpotsWk06 * Impressions);
                TotalBTPDRWk07 = TotalBTPDRWk07 + (SpotsWk07 * Impressions);
                TotalBTPDRWk08 = TotalBTPDRWk08 + (SpotsWk08 * Impressions);
                TotalBTPDRWk09 = TotalBTPDRWk09 + (SpotsWk09 * Impressions);
                TotalBTPDRWk10 = TotalBTPDRWk10 + (SpotsWk10 * Impressions);
                TotalBTPDRWk11 = TotalBTPDRWk11 + (SpotsWk11 * Impressions);
                TotalBTPDRWk12 = TotalBTPDRWk12 + (SpotsWk12 * Impressions);
                TotalBTPDRWk13 = TotalBTPDRWk13 + (SpotsWk13 * Impressions);
                TotalBTPDRWk14 = TotalBTPDRWk14 + (SpotsWk14 * Impressions);
            }
            else if (BuyType == 'PE') {
                TotalBTPEWk01 = TotalBTPEWk01 + (SpotsWk01 * Impressions);
                TotalBTPEWk02 = TotalBTPEWk02 + (SpotsWk02 * Impressions);
                TotalBTPEWk03 = TotalBTPEWk03 + (SpotsWk03 * Impressions);
                TotalBTPEWk04 = TotalBTPEWk04 + (SpotsWk04 * Impressions);
                TotalBTPEWk05 = TotalBTPEWk05 + (SpotsWk05 * Impressions);
                TotalBTPEWk06 = TotalBTPEWk06 + (SpotsWk06 * Impressions);
                TotalBTPEWk07 = TotalBTPEWk07 + (SpotsWk07 * Impressions);
                TotalBTPEWk08 = TotalBTPEWk08 + (SpotsWk08 * Impressions);
                TotalBTPEWk09 = TotalBTPEWk09 + (SpotsWk09 * Impressions);
                TotalBTPEWk10 = TotalBTPEWk10 + (SpotsWk10 * Impressions);
                TotalBTPEWk11 = TotalBTPEWk11 + (SpotsWk11 * Impressions);
                TotalBTPEWk12 = TotalBTPEWk12 + (SpotsWk12 * Impressions);
                TotalBTPEWk13 = TotalBTPEWk13 + (SpotsWk13 * Impressions);
                TotalBTPEWk14 = TotalBTPEWk14 + (SpotsWk14 * Impressions);
            }
            else if (BuyType == 'GPE') {
                TotalBTGPEWk01 = TotalBTGPEWk01 + (SpotsWk01 * Impressions);
                TotalBTGPEWk02 = TotalBTGPEWk02 + (SpotsWk02 * Impressions);
                TotalBTGPEWk03 = TotalBTGPEWk03 + (SpotsWk03 * Impressions);
                TotalBTGPEWk04 = TotalBTGPEWk04 + (SpotsWk04 * Impressions);
                TotalBTGPEWk05 = TotalBTGPEWk05 + (SpotsWk05 * Impressions);
                TotalBTGPEWk06 = TotalBTGPEWk06 + (SpotsWk06 * Impressions);
                TotalBTGPEWk07 = TotalBTGPEWk07 + (SpotsWk07 * Impressions);
                TotalBTGPEWk08 = TotalBTGPEWk08 + (SpotsWk08 * Impressions);
                TotalBTGPEWk09 = TotalBTGPEWk09 + (SpotsWk09 * Impressions);
                TotalBTGPEWk10 = TotalBTGPEWk10 + (SpotsWk10 * Impressions);
                TotalBTGPEWk11 = TotalBTGPEWk11 + (SpotsWk11 * Impressions);
                TotalBTGPEWk12 = TotalBTGPEWk12 + (SpotsWk12 * Impressions);
                TotalBTGPEWk13 = TotalBTGPEWk13 + (SpotsWk13 * Impressions);
                TotalBTGPEWk14 = TotalBTGPEWk14 + (SpotsWk14 * Impressions);
            }
            else if (BuyType == 'A') {
                TotalBTAWk01 = TotalBTAWk01 + (SpotsWk01 * Impressions);
                TotalBTAWk02 = TotalBTAWk02 + (SpotsWk02 * Impressions);
                TotalBTAWk03 = TotalBTAWk03 + (SpotsWk03 * Impressions);
                TotalBTAWk04 = TotalBTAWk04 + (SpotsWk04 * Impressions);
                TotalBTAWk05 = TotalBTAWk05 + (SpotsWk05 * Impressions);
                TotalBTAWk06 = TotalBTAWk06 + (SpotsWk06 * Impressions);
                TotalBTAWk07 = TotalBTAWk07 + (SpotsWk07 * Impressions);
                TotalBTAWk08 = TotalBTAWk08 + (SpotsWk08 * Impressions);
                TotalBTAWk09 = TotalBTAWk09 + (SpotsWk09 * Impressions);
                TotalBTAWk10 = TotalBTAWk10 + (SpotsWk10 * Impressions);
                TotalBTAWk11 = TotalBTAWk11 + (SpotsWk11 * Impressions);
                TotalBTAWk12 = TotalBTAWk12 + (SpotsWk12 * Impressions);
                TotalBTAWk13 = TotalBTAWk13 + (SpotsWk13 * Impressions);
                TotalBTAWk14 = TotalBTAWk14 + (SpotsWk14 * Impressions);
            }
            else if (BuyType == 'MG') {
                TotalBTMGWk01 = TotalBTMGWk01 + (SpotsWk01 * Impressions);
                TotalBTMGWk02 = TotalBTMGWk02 + (SpotsWk02 * Impressions);
                TotalBTMGWk03 = TotalBTMGWk03 + (SpotsWk03 * Impressions);
                TotalBTMGWk04 = TotalBTMGWk04 + (SpotsWk04 * Impressions);
                TotalBTMGWk05 = TotalBTMGWk05 + (SpotsWk05 * Impressions);
                TotalBTMGWk06 = TotalBTMGWk06 + (SpotsWk06 * Impressions);
                TotalBTMGWk07 = TotalBTMGWk07 + (SpotsWk07 * Impressions);
                TotalBTMGWk08 = TotalBTMGWk08 + (SpotsWk08 * Impressions);
                TotalBTMGWk09 = TotalBTMGWk09 + (SpotsWk09 * Impressions);
                TotalBTMGWk10 = TotalBTMGWk10 + (SpotsWk10 * Impressions);
                TotalBTMGWk11 = TotalBTMGWk11 + (SpotsWk11 * Impressions);
                TotalBTMGWk12 = TotalBTMGWk12 + (SpotsWk12 * Impressions);
                TotalBTMGWk13 = TotalBTMGWk13 + (SpotsWk13 * Impressions);
                TotalBTMGWk14 = TotalBTMGWk14 + (SpotsWk14 * Impressions);
            }
            else if (BuyType == 'M') {
                TotalBTMWk01 = TotalBTMWk01 + (SpotsWk01 * Impressions);
                TotalBTMWk02 = TotalBTMWk02 + (SpotsWk02 * Impressions);
                TotalBTMWk03 = TotalBTMWk03 + (SpotsWk03 * Impressions);
                TotalBTMWk04 = TotalBTMWk04 + (SpotsWk04 * Impressions);
                TotalBTMWk05 = TotalBTMWk05 + (SpotsWk05 * Impressions);
                TotalBTMWk06 = TotalBTMWk06 + (SpotsWk06 * Impressions);
                TotalBTMWk07 = TotalBTMWk07 + (SpotsWk07 * Impressions);
                TotalBTMWk08 = TotalBTMWk08 + (SpotsWk08 * Impressions);
                TotalBTMWk09 = TotalBTMWk09 + (SpotsWk09 * Impressions);
                TotalBTMWk10 = TotalBTMWk10 + (SpotsWk10 * Impressions);
                TotalBTMWk11 = TotalBTMWk11 + (SpotsWk11 * Impressions);
                TotalBTMWk12 = TotalBTMWk12 + (SpotsWk12 * Impressions);
                TotalBTMWk13 = TotalBTMWk13 + (SpotsWk13 * Impressions);
                TotalBTMWk14 = TotalBTMWk14 + (SpotsWk14 * Impressions);
            }
            else if (BuyType == 'B') {
                TotalBTBWk01 = TotalBTBWk01 + (SpotsWk01 * Impressions);
                TotalBTBWk02 = TotalBTBWk02 + (SpotsWk02 * Impressions);
                TotalBTBWk03 = TotalBTBWk03 + (SpotsWk03 * Impressions);
                TotalBTBWk04 = TotalBTBWk04 + (SpotsWk04 * Impressions);
                TotalBTBWk05 = TotalBTBWk05 + (SpotsWk05 * Impressions);
                TotalBTBWk06 = TotalBTBWk06 + (SpotsWk06 * Impressions);
                TotalBTBWk07 = TotalBTBWk07 + (SpotsWk07 * Impressions);
                TotalBTBWk08 = TotalBTBWk08 + (SpotsWk08 * Impressions);
                TotalBTBWk09 = TotalBTBWk09 + (SpotsWk09 * Impressions);
                TotalBTBWk10 = TotalBTBWk10 + (SpotsWk10 * Impressions);
                TotalBTBWk11 = TotalBTBWk11 + (SpotsWk11 * Impressions);
                TotalBTBWk12 = TotalBTBWk12 + (SpotsWk12 * Impressions);
                TotalBTBWk13 = TotalBTBWk13 + (SpotsWk13 * Impressions);
                TotalBTBWk14 = TotalBTBWk14 + (SpotsWk14 * Impressions);
            }
            else if (BuyType == 'UE') {
                TotalBTUEWk01 = TotalBTUEWk01 + (SpotsWk01 * Impressions);
                TotalBTUEWk02 = TotalBTUEWk02 + (SpotsWk02 * Impressions);
                TotalBTUEWk03 = TotalBTUEWk03 + (SpotsWk03 * Impressions);
                TotalBTUEWk04 = TotalBTUEWk04 + (SpotsWk04 * Impressions);
                TotalBTUEWk05 = TotalBTUEWk05 + (SpotsWk05 * Impressions);
                TotalBTUEWk06 = TotalBTUEWk06 + (SpotsWk06 * Impressions);
                TotalBTUEWk07 = TotalBTUEWk07 + (SpotsWk07 * Impressions);
                TotalBTUEWk08 = TotalBTUEWk08 + (SpotsWk08 * Impressions);
                TotalBTUEWk09 = TotalBTUEWk09 + (SpotsWk09 * Impressions);
                TotalBTUEWk10 = TotalBTUEWk10 + (SpotsWk10 * Impressions);
                TotalBTUEWk11 = TotalBTUEWk11 + (SpotsWk11 * Impressions);
                TotalBTUEWk12 = TotalBTUEWk12 + (SpotsWk12 * Impressions);
                TotalBTUEWk13 = TotalBTUEWk13 + (SpotsWk13 * Impressions);
                TotalBTUEWk14 = TotalBTUEWk14 + (SpotsWk14 * Impressions);
            }
            else if (BuyType == 'AD') {
                TotalBTADWk01 = TotalBTADWk01 + (SpotsWk01 * Impressions);
                TotalBTADWk02 = TotalBTADWk02 + (SpotsWk02 * Impressions);
                TotalBTADWk03 = TotalBTADWk03 + (SpotsWk03 * Impressions);
                TotalBTADWk04 = TotalBTADWk04 + (SpotsWk04 * Impressions);
                TotalBTADWk05 = TotalBTADWk05 + (SpotsWk05 * Impressions);
                TotalBTADWk06 = TotalBTADWk06 + (SpotsWk06 * Impressions);
                TotalBTADWk07 = TotalBTADWk07 + (SpotsWk07 * Impressions);
                TotalBTADWk08 = TotalBTADWk08 + (SpotsWk08 * Impressions);
                TotalBTADWk09 = TotalBTADWk09 + (SpotsWk09 * Impressions);
                TotalBTADWk10 = TotalBTADWk10 + (SpotsWk10 * Impressions);
                TotalBTADWk11 = TotalBTADWk11 + (SpotsWk11 * Impressions);
                TotalBTADWk12 = TotalBTADWk12 + (SpotsWk12 * Impressions);
                TotalBTADWk13 = TotalBTADWk13 + (SpotsWk13 * Impressions);
                TotalBTADWk14 = TotalBTADWk14 + (SpotsWk14 * Impressions);
            }
            else if (BuyType == 'NLV') {
                TotalBTNLVWk01 = TotalBTNLVWk01 + (SpotsWk01 * Impressions);
                TotalBTNLVWk02 = TotalBTNLVWk02 + (SpotsWk02 * Impressions);
                TotalBTNLVWk03 = TotalBTNLVWk03 + (SpotsWk03 * Impressions);
                TotalBTNLVWk04 = TotalBTNLVWk04 + (SpotsWk04 * Impressions);
                TotalBTNLVWk05 = TotalBTNLVWk05 + (SpotsWk05 * Impressions);
                TotalBTNLVWk06 = TotalBTNLVWk06 + (SpotsWk06 * Impressions);
                TotalBTNLVWk07 = TotalBTNLVWk07 + (SpotsWk07 * Impressions);
                TotalBTNLVWk08 = TotalBTNLVWk08 + (SpotsWk08 * Impressions);
                TotalBTNLVWk09 = TotalBTNLVWk09 + (SpotsWk09 * Impressions);
                TotalBTNLVWk10 = TotalBTNLVWk10 + (SpotsWk10 * Impressions);
                TotalBTNLVWk11 = TotalBTNLVWk11 + (SpotsWk11 * Impressions);
                TotalBTNLVWk12 = TotalBTNLVWk12 + (SpotsWk12 * Impressions);
                TotalBTNLVWk13 = TotalBTNLVWk13 + (SpotsWk13 * Impressions);
                TotalBTNLVWk14 = TotalBTNLVWk14 + (SpotsWk14 * Impressions);
            }
            else if (BuyType == 'PM') {
                TotalBTPMWk01 = TotalBTPMWk01 + (SpotsWk01 * Impressions);
                TotalBTPMWk02 = TotalBTPMWk02 + (SpotsWk02 * Impressions);
                TotalBTPMWk03 = TotalBTPMWk03 + (SpotsWk03 * Impressions);
                TotalBTPMWk04 = TotalBTPMWk04 + (SpotsWk04 * Impressions);
                TotalBTPMWk05 = TotalBTPMWk05 + (SpotsWk05 * Impressions);
                TotalBTPMWk06 = TotalBTPMWk06 + (SpotsWk06 * Impressions);
                TotalBTPMWk07 = TotalBTPMWk07 + (SpotsWk07 * Impressions);
                TotalBTPMWk08 = TotalBTPMWk08 + (SpotsWk08 * Impressions);
                TotalBTPMWk09 = TotalBTPMWk09 + (SpotsWk09 * Impressions);
                TotalBTPMWk10 = TotalBTPMWk10 + (SpotsWk10 * Impressions);
                TotalBTPMWk11 = TotalBTPMWk11 + (SpotsWk11 * Impressions);
                TotalBTPMWk12 = TotalBTPMWk12 + (SpotsWk12 * Impressions);
                TotalBTPMWk13 = TotalBTPMWk13 + (SpotsWk13 * Impressions);
                TotalBTPMWk14 = TotalBTPMWk14 + (SpotsWk14 * Impressions);
            }
        });

        TotalGI15Wk01 = (TotalGrossImpressionsWk01 == 0 ? 0 : parseFloat(Total15Wk01) / parseFloat(TotalGrossImpressionsWk01));
        TotalGI15Wk02 = (TotalGrossImpressionsWk02 == 0 ? 0 : parseFloat(Total15Wk02) / parseFloat(TotalGrossImpressionsWk02));
        TotalGI15Wk03 = (TotalGrossImpressionsWk03 == 0 ? 0 : parseFloat(Total15Wk03) / parseFloat(TotalGrossImpressionsWk03));
        TotalGI15Wk04 = (TotalGrossImpressionsWk04 == 0 ? 0 : parseFloat(Total15Wk04) / parseFloat(TotalGrossImpressionsWk04));
        TotalGI15Wk05 = (TotalGrossImpressionsWk05 == 0 ? 0 : parseFloat(Total15Wk05) / parseFloat(TotalGrossImpressionsWk05));
        TotalGI15Wk06 = (TotalGrossImpressionsWk06 == 0 ? 0 : parseFloat(Total15Wk06) / parseFloat(TotalGrossImpressionsWk06));
        TotalGI15Wk07 = (TotalGrossImpressionsWk07 == 0 ? 0 : parseFloat(Total15Wk07) / parseFloat(TotalGrossImpressionsWk07));
        TotalGI15Wk08 = (TotalGrossImpressionsWk08 == 0 ? 0 : parseFloat(Total15Wk08) / parseFloat(TotalGrossImpressionsWk08));
        TotalGI15Wk09 = (TotalGrossImpressionsWk09 == 0 ? 0 : parseFloat(Total15Wk09) / parseFloat(TotalGrossImpressionsWk09));
        TotalGI15Wk10 = (TotalGrossImpressionsWk10 == 0 ? 0 : parseFloat(Total15Wk10) / parseFloat(TotalGrossImpressionsWk10));
        TotalGI15Wk11 = (TotalGrossImpressionsWk11 == 0 ? 0 : parseFloat(Total15Wk11) / parseFloat(TotalGrossImpressionsWk11));
        TotalGI15Wk12 = (TotalGrossImpressionsWk12 == 0 ? 0 : parseFloat(Total15Wk12) / parseFloat(TotalGrossImpressionsWk12));
        TotalGI15Wk13 = (TotalGrossImpressionsWk13 == 0 ? 0 : parseFloat(Total15Wk13) / parseFloat(TotalGrossImpressionsWk13));
        TotalGI15Wk14 = (TotalGrossImpressionsWk14 == 0 ? 0 : parseFloat(Total15Wk14) / parseFloat(TotalGrossImpressionsWk14));

        TotalGI30Wk01 = (TotalGrossImpressionsWk01 == 0 ? 0 : parseFloat(Total30Wk01) / parseFloat(TotalGrossImpressionsWk01));
        TotalGI30Wk02 = (TotalGrossImpressionsWk02 == 0 ? 0 : parseFloat(Total30Wk02) / parseFloat(TotalGrossImpressionsWk02));
        TotalGI30Wk03 = (TotalGrossImpressionsWk03 == 0 ? 0 : parseFloat(Total30Wk03) / parseFloat(TotalGrossImpressionsWk03));
        TotalGI30Wk04 = (TotalGrossImpressionsWk04 == 0 ? 0 : parseFloat(Total30Wk04) / parseFloat(TotalGrossImpressionsWk04));
        TotalGI30Wk05 = (TotalGrossImpressionsWk05 == 0 ? 0 : parseFloat(Total30Wk05) / parseFloat(TotalGrossImpressionsWk05));
        TotalGI30Wk06 = (TotalGrossImpressionsWk06 == 0 ? 0 : parseFloat(Total30Wk06) / parseFloat(TotalGrossImpressionsWk06));
        TotalGI30Wk07 = (TotalGrossImpressionsWk07 == 0 ? 0 : parseFloat(Total30Wk07) / parseFloat(TotalGrossImpressionsWk07));
        TotalGI30Wk08 = (TotalGrossImpressionsWk08 == 0 ? 0 : parseFloat(Total30Wk08) / parseFloat(TotalGrossImpressionsWk08));
        TotalGI30Wk09 = (TotalGrossImpressionsWk09 == 0 ? 0 : parseFloat(Total30Wk09) / parseFloat(TotalGrossImpressionsWk09));
        TotalGI30Wk10 = (TotalGrossImpressionsWk10 == 0 ? 0 : parseFloat(Total30Wk10) / parseFloat(TotalGrossImpressionsWk10));
        TotalGI30Wk11 = (TotalGrossImpressionsWk11 == 0 ? 0 : parseFloat(Total30Wk11) / parseFloat(TotalGrossImpressionsWk11));
        TotalGI30Wk12 = (TotalGrossImpressionsWk12 == 0 ? 0 : parseFloat(Total30Wk12) / parseFloat(TotalGrossImpressionsWk12));
        TotalGI30Wk13 = (TotalGrossImpressionsWk13 == 0 ? 0 : parseFloat(Total30Wk13) / parseFloat(TotalGrossImpressionsWk13));
        TotalGI30Wk14 = (TotalGrossImpressionsWk14 == 0 ? 0 : parseFloat(Total30Wk14) / parseFloat(TotalGrossImpressionsWk14));

        TotalGI60Wk01 = (TotalGrossImpressionsWk01 == 0 ? 0 : parseFloat(Total60Wk01) / parseFloat(TotalGrossImpressionsWk01));
        TotalGI60Wk02 = (TotalGrossImpressionsWk02 == 0 ? 0 : parseFloat(Total60Wk02) / parseFloat(TotalGrossImpressionsWk02));
        TotalGI60Wk03 = (TotalGrossImpressionsWk03 == 0 ? 0 : parseFloat(Total60Wk03) / parseFloat(TotalGrossImpressionsWk03));
        TotalGI60Wk04 = (TotalGrossImpressionsWk04 == 0 ? 0 : parseFloat(Total60Wk04) / parseFloat(TotalGrossImpressionsWk04));
        TotalGI60Wk05 = (TotalGrossImpressionsWk05 == 0 ? 0 : parseFloat(Total60Wk05) / parseFloat(TotalGrossImpressionsWk05));
        TotalGI60Wk06 = (TotalGrossImpressionsWk06 == 0 ? 0 : parseFloat(Total60Wk06) / parseFloat(TotalGrossImpressionsWk06));
        TotalGI60Wk07 = (TotalGrossImpressionsWk07 == 0 ? 0 : parseFloat(Total60Wk07) / parseFloat(TotalGrossImpressionsWk07));
        TotalGI60Wk08 = (TotalGrossImpressionsWk08 == 0 ? 0 : parseFloat(Total60Wk08) / parseFloat(TotalGrossImpressionsWk08));
        TotalGI60Wk09 = (TotalGrossImpressionsWk09 == 0 ? 0 : parseFloat(Total60Wk09) / parseFloat(TotalGrossImpressionsWk09));
        TotalGI60Wk10 = (TotalGrossImpressionsWk10 == 0 ? 0 : parseFloat(Total60Wk10) / parseFloat(TotalGrossImpressionsWk10));
        TotalGI60Wk11 = (TotalGrossImpressionsWk11 == 0 ? 0 : parseFloat(Total60Wk11) / parseFloat(TotalGrossImpressionsWk11));
        TotalGI60Wk12 = (TotalGrossImpressionsWk12 == 0 ? 0 : parseFloat(Total60Wk12) / parseFloat(TotalGrossImpressionsWk12));
        TotalGI60Wk13 = (TotalGrossImpressionsWk13 == 0 ? 0 : parseFloat(Total60Wk13) / parseFloat(TotalGrossImpressionsWk13));
        TotalGI60Wk14 = (TotalGrossImpressionsWk14 == 0 ? 0 : parseFloat(Total60Wk14) / parseFloat(TotalGrossImpressionsWk14));

        TotalGI120Wk01 = (TotalGrossImpressionsWk01 == 0 ? 0 : parseFloat(Total120Wk01) / parseFloat(TotalGrossImpressionsWk01));
        TotalGI120Wk02 = (TotalGrossImpressionsWk02 == 0 ? 0 : parseFloat(Total120Wk02) / parseFloat(TotalGrossImpressionsWk02));
        TotalGI120Wk03 = (TotalGrossImpressionsWk03 == 0 ? 0 : parseFloat(Total120Wk03) / parseFloat(TotalGrossImpressionsWk03));
        TotalGI120Wk04 = (TotalGrossImpressionsWk04 == 0 ? 0 : parseFloat(Total120Wk04) / parseFloat(TotalGrossImpressionsWk04));
        TotalGI120Wk05 = (TotalGrossImpressionsWk05 == 0 ? 0 : parseFloat(Total120Wk05) / parseFloat(TotalGrossImpressionsWk05));
        TotalGI120Wk06 = (TotalGrossImpressionsWk06 == 0 ? 0 : parseFloat(Total120Wk06) / parseFloat(TotalGrossImpressionsWk06));
        TotalGI120Wk07 = (TotalGrossImpressionsWk07 == 0 ? 0 : parseFloat(Total120Wk07) / parseFloat(TotalGrossImpressionsWk07));
        TotalGI120Wk08 = (TotalGrossImpressionsWk08 == 0 ? 0 : parseFloat(Total120Wk08) / parseFloat(TotalGrossImpressionsWk08));
        TotalGI120Wk09 = (TotalGrossImpressionsWk09 == 0 ? 0 : parseFloat(Total120Wk09) / parseFloat(TotalGrossImpressionsWk09));
        TotalGI120Wk10 = (TotalGrossImpressionsWk10 == 0 ? 0 : parseFloat(Total120Wk10) / parseFloat(TotalGrossImpressionsWk10));
        TotalGI120Wk11 = (TotalGrossImpressionsWk11 == 0 ? 0 : parseFloat(Total120Wk11) / parseFloat(TotalGrossImpressionsWk11));
        TotalGI120Wk12 = (TotalGrossImpressionsWk12 == 0 ? 0 : parseFloat(Total120Wk12) / parseFloat(TotalGrossImpressionsWk12));
        TotalGI120Wk13 = (TotalGrossImpressionsWk13 == 0 ? 0 : parseFloat(Total120Wk13) / parseFloat(TotalGrossImpressionsWk13));
        TotalGI120Wk14 = (TotalGrossImpressionsWk14 == 0 ? 0 : parseFloat(Total120Wk14) / parseFloat(TotalGrossImpressionsWk14));

        TotalDPMWk01 = (TotalGrossImpressionsWk01 == 0 ? 0 : parseFloat(TotalMWk01) / parseFloat(TotalGrossImpressionsWk01));
        TotalDPMWk02 = (TotalGrossImpressionsWk02 == 0 ? 0 : parseFloat(TotalMWk02) / parseFloat(TotalGrossImpressionsWk02));
        TotalDPMWk03 = (TotalGrossImpressionsWk03 == 0 ? 0 : parseFloat(TotalMWk03) / parseFloat(TotalGrossImpressionsWk03));
        TotalDPMWk04 = (TotalGrossImpressionsWk04 == 0 ? 0 : parseFloat(TotalMWk04) / parseFloat(TotalGrossImpressionsWk04));
        TotalDPMWk05 = (TotalGrossImpressionsWk05 == 0 ? 0 : parseFloat(TotalMWk05) / parseFloat(TotalGrossImpressionsWk05));
        TotalDPMWk06 = (TotalGrossImpressionsWk06 == 0 ? 0 : parseFloat(TotalMWk06) / parseFloat(TotalGrossImpressionsWk06));
        TotalDPMWk07 = (TotalGrossImpressionsWk07 == 0 ? 0 : parseFloat(TotalMWk07) / parseFloat(TotalGrossImpressionsWk07));
        TotalDPMWk08 = (TotalGrossImpressionsWk08 == 0 ? 0 : parseFloat(TotalMWk08) / parseFloat(TotalGrossImpressionsWk08));
        TotalDPMWk09 = (TotalGrossImpressionsWk09 == 0 ? 0 : parseFloat(TotalMWk09) / parseFloat(TotalGrossImpressionsWk09));
        TotalDPMWk10 = (TotalGrossImpressionsWk10 == 0 ? 0 : parseFloat(TotalMWk10) / parseFloat(TotalGrossImpressionsWk10));
        TotalDPMWk11 = (TotalGrossImpressionsWk11 == 0 ? 0 : parseFloat(TotalMWk11) / parseFloat(TotalGrossImpressionsWk11));
        TotalDPMWk12 = (TotalGrossImpressionsWk12 == 0 ? 0 : parseFloat(TotalMWk12) / parseFloat(TotalGrossImpressionsWk12));
        TotalDPMWk13 = (TotalGrossImpressionsWk13 == 0 ? 0 : parseFloat(TotalMWk13) / parseFloat(TotalGrossImpressionsWk13));
        TotalDPMWk14 = (TotalGrossImpressionsWk14 == 0 ? 0 : parseFloat(TotalMWk14) / parseFloat(TotalGrossImpressionsWk14));

        TotalDPDWk01 = (TotalGrossImpressionsWk01 == 0 ? 0 : parseFloat(TotalDWk01) / parseFloat(TotalGrossImpressionsWk01));
        TotalDPDWk02 = (TotalGrossImpressionsWk02 == 0 ? 0 : parseFloat(TotalDWk02) / parseFloat(TotalGrossImpressionsWk02));
        TotalDPDWk03 = (TotalGrossImpressionsWk03 == 0 ? 0 : parseFloat(TotalDWk03) / parseFloat(TotalGrossImpressionsWk03));
        TotalDPDWk04 = (TotalGrossImpressionsWk04 == 0 ? 0 : parseFloat(TotalDWk04) / parseFloat(TotalGrossImpressionsWk04));
        TotalDPDWk05 = (TotalGrossImpressionsWk05 == 0 ? 0 : parseFloat(TotalDWk05) / parseFloat(TotalGrossImpressionsWk05));
        TotalDPDWk06 = (TotalGrossImpressionsWk06 == 0 ? 0 : parseFloat(TotalDWk06) / parseFloat(TotalGrossImpressionsWk06));
        TotalDPDWk07 = (TotalGrossImpressionsWk07 == 0 ? 0 : parseFloat(TotalDWk07) / parseFloat(TotalGrossImpressionsWk07));
        TotalDPDWk08 = (TotalGrossImpressionsWk08 == 0 ? 0 : parseFloat(TotalDWk08) / parseFloat(TotalGrossImpressionsWk08));
        TotalDPDWk09 = (TotalGrossImpressionsWk09 == 0 ? 0 : parseFloat(TotalDWk09) / parseFloat(TotalGrossImpressionsWk09));
        TotalDPDWk10 = (TotalGrossImpressionsWk10 == 0 ? 0 : parseFloat(TotalDWk10) / parseFloat(TotalGrossImpressionsWk10));
        TotalDPDWk11 = (TotalGrossImpressionsWk11 == 0 ? 0 : parseFloat(TotalDWk11) / parseFloat(TotalGrossImpressionsWk11));
        TotalDPDWk12 = (TotalGrossImpressionsWk12 == 0 ? 0 : parseFloat(TotalDWk12) / parseFloat(TotalGrossImpressionsWk12));
        TotalDPDWk13 = (TotalGrossImpressionsWk13 == 0 ? 0 : parseFloat(TotalDWk13) / parseFloat(TotalGrossImpressionsWk13));
        TotalDPDWk14 = (TotalGrossImpressionsWk14 == 0 ? 0 : parseFloat(TotalDWk14) / parseFloat(TotalGrossImpressionsWk14));

        TotalDPFWk01 = (TotalGrossImpressionsWk01 == 0 ? 0 : parseFloat(TotalFWk01) / parseFloat(TotalGrossImpressionsWk01));
        TotalDPFWk02 = (TotalGrossImpressionsWk02 == 0 ? 0 : parseFloat(TotalFWk02) / parseFloat(TotalGrossImpressionsWk02));
        TotalDPFWk03 = (TotalGrossImpressionsWk03 == 0 ? 0 : parseFloat(TotalFWk03) / parseFloat(TotalGrossImpressionsWk03));
        TotalDPFWk04 = (TotalGrossImpressionsWk04 == 0 ? 0 : parseFloat(TotalFWk04) / parseFloat(TotalGrossImpressionsWk04));
        TotalDPFWk05 = (TotalGrossImpressionsWk05 == 0 ? 0 : parseFloat(TotalFWk05) / parseFloat(TotalGrossImpressionsWk05));
        TotalDPFWk06 = (TotalGrossImpressionsWk06 == 0 ? 0 : parseFloat(TotalFWk06) / parseFloat(TotalGrossImpressionsWk06));
        TotalDPFWk07 = (TotalGrossImpressionsWk07 == 0 ? 0 : parseFloat(TotalFWk07) / parseFloat(TotalGrossImpressionsWk07));
        TotalDPFWk08 = (TotalGrossImpressionsWk08 == 0 ? 0 : parseFloat(TotalFWk08) / parseFloat(TotalGrossImpressionsWk08));
        TotalDPFWk09 = (TotalGrossImpressionsWk09 == 0 ? 0 : parseFloat(TotalFWk09) / parseFloat(TotalGrossImpressionsWk09));
        TotalDPFWk10 = (TotalGrossImpressionsWk10 == 0 ? 0 : parseFloat(TotalFWk10) / parseFloat(TotalGrossImpressionsWk10));
        TotalDPFWk11 = (TotalGrossImpressionsWk11 == 0 ? 0 : parseFloat(TotalFWk11) / parseFloat(TotalGrossImpressionsWk11));
        TotalDPFWk12 = (TotalGrossImpressionsWk12 == 0 ? 0 : parseFloat(TotalFWk12) / parseFloat(TotalGrossImpressionsWk12));
        TotalDPFWk13 = (TotalGrossImpressionsWk13 == 0 ? 0 : parseFloat(TotalFWk13) / parseFloat(TotalGrossImpressionsWk13));
        TotalDPFWk14 = (TotalGrossImpressionsWk14 == 0 ? 0 : parseFloat(TotalFWk14) / parseFloat(TotalGrossImpressionsWk14));

        TotalDPPWk01 = (TotalGrossImpressionsWk01 == 0 ? 0 : parseFloat(TotalPWk01) / parseFloat(TotalGrossImpressionsWk01));
        TotalDPPWk02 = (TotalGrossImpressionsWk02 == 0 ? 0 : parseFloat(TotalPWk02) / parseFloat(TotalGrossImpressionsWk02));
        TotalDPPWk03 = (TotalGrossImpressionsWk03 == 0 ? 0 : parseFloat(TotalPWk03) / parseFloat(TotalGrossImpressionsWk03));
        TotalDPPWk04 = (TotalGrossImpressionsWk04 == 0 ? 0 : parseFloat(TotalPWk04) / parseFloat(TotalGrossImpressionsWk04));
        TotalDPPWk05 = (TotalGrossImpressionsWk05 == 0 ? 0 : parseFloat(TotalPWk05) / parseFloat(TotalGrossImpressionsWk05));
        TotalDPPWk06 = (TotalGrossImpressionsWk06 == 0 ? 0 : parseFloat(TotalPWk06) / parseFloat(TotalGrossImpressionsWk06));
        TotalDPPWk07 = (TotalGrossImpressionsWk07 == 0 ? 0 : parseFloat(TotalPWk07) / parseFloat(TotalGrossImpressionsWk07));
        TotalDPPWk08 = (TotalGrossImpressionsWk08 == 0 ? 0 : parseFloat(TotalPWk08) / parseFloat(TotalGrossImpressionsWk08));
        TotalDPPWk09 = (TotalGrossImpressionsWk09 == 0 ? 0 : parseFloat(TotalPWk09) / parseFloat(TotalGrossImpressionsWk09));
        TotalDPPWk10 = (TotalGrossImpressionsWk10 == 0 ? 0 : parseFloat(TotalPWk10) / parseFloat(TotalGrossImpressionsWk10));
        TotalDPPWk11 = (TotalGrossImpressionsWk11 == 0 ? 0 : parseFloat(TotalPWk11) / parseFloat(TotalGrossImpressionsWk11));
        TotalDPPWk12 = (TotalGrossImpressionsWk12 == 0 ? 0 : parseFloat(TotalPWk12) / parseFloat(TotalGrossImpressionsWk12));
        TotalDPPWk13 = (TotalGrossImpressionsWk13 == 0 ? 0 : parseFloat(TotalPWk13) / parseFloat(TotalGrossImpressionsWk13));
        TotalDPPWk14 = (TotalGrossImpressionsWk14 == 0 ? 0 : parseFloat(TotalPWk14) / parseFloat(TotalGrossImpressionsWk14));

        TotalDPLWk01 = (TotalGrossImpressionsWk01 == 0 ? 0 : parseFloat(TotalLWk01) / parseFloat(TotalGrossImpressionsWk01));
        TotalDPLWk02 = (TotalGrossImpressionsWk02 == 0 ? 0 : parseFloat(TotalLWk02) / parseFloat(TotalGrossImpressionsWk02));
        TotalDPLWk03 = (TotalGrossImpressionsWk03 == 0 ? 0 : parseFloat(TotalLWk03) / parseFloat(TotalGrossImpressionsWk03));
        TotalDPLWk04 = (TotalGrossImpressionsWk04 == 0 ? 0 : parseFloat(TotalLWk04) / parseFloat(TotalGrossImpressionsWk04));
        TotalDPLWk05 = (TotalGrossImpressionsWk05 == 0 ? 0 : parseFloat(TotalLWk05) / parseFloat(TotalGrossImpressionsWk05));
        TotalDPLWk06 = (TotalGrossImpressionsWk06 == 0 ? 0 : parseFloat(TotalLWk06) / parseFloat(TotalGrossImpressionsWk06));
        TotalDPLWk07 = (TotalGrossImpressionsWk07 == 0 ? 0 : parseFloat(TotalLWk07) / parseFloat(TotalGrossImpressionsWk07));
        TotalDPLWk08 = (TotalGrossImpressionsWk08 == 0 ? 0 : parseFloat(TotalLWk08) / parseFloat(TotalGrossImpressionsWk08));
        TotalDPLWk09 = (TotalGrossImpressionsWk09 == 0 ? 0 : parseFloat(TotalLWk09) / parseFloat(TotalGrossImpressionsWk09));
        TotalDPLWk10 = (TotalGrossImpressionsWk10 == 0 ? 0 : parseFloat(TotalLWk10) / parseFloat(TotalGrossImpressionsWk10));
        TotalDPLWk11 = (TotalGrossImpressionsWk11 == 0 ? 0 : parseFloat(TotalLWk11) / parseFloat(TotalGrossImpressionsWk11));
        TotalDPLWk12 = (TotalGrossImpressionsWk12 == 0 ? 0 : parseFloat(TotalLWk12) / parseFloat(TotalGrossImpressionsWk12));
        TotalDPLWk13 = (TotalGrossImpressionsWk13 == 0 ? 0 : parseFloat(TotalLWk13) / parseFloat(TotalGrossImpressionsWk13));
        TotalDPLWk14 = (TotalGrossImpressionsWk14 == 0 ? 0 : parseFloat(TotalLWk14) / parseFloat(TotalGrossImpressionsWk14));

        TotalDPOWk01 = (TotalGrossImpressionsWk01 == 0 ? 0 : parseFloat(TotalOWk01) / parseFloat(TotalGrossImpressionsWk01));
        TotalDPOWk02 = (TotalGrossImpressionsWk02 == 0 ? 0 : parseFloat(TotalOWk02) / parseFloat(TotalGrossImpressionsWk02));
        TotalDPOWk03 = (TotalGrossImpressionsWk03 == 0 ? 0 : parseFloat(TotalOWk03) / parseFloat(TotalGrossImpressionsWk03));
        TotalDPOWk04 = (TotalGrossImpressionsWk04 == 0 ? 0 : parseFloat(TotalOWk04) / parseFloat(TotalGrossImpressionsWk04));
        TotalDPOWk05 = (TotalGrossImpressionsWk05 == 0 ? 0 : parseFloat(TotalOWk05) / parseFloat(TotalGrossImpressionsWk05));
        TotalDPOWk06 = (TotalGrossImpressionsWk06 == 0 ? 0 : parseFloat(TotalOWk06) / parseFloat(TotalGrossImpressionsWk06));
        TotalDPOWk07 = (TotalGrossImpressionsWk07 == 0 ? 0 : parseFloat(TotalOWk07) / parseFloat(TotalGrossImpressionsWk07));
        TotalDPOWk08 = (TotalGrossImpressionsWk08 == 0 ? 0 : parseFloat(TotalOWk08) / parseFloat(TotalGrossImpressionsWk08));
        TotalDPOWk09 = (TotalGrossImpressionsWk09 == 0 ? 0 : parseFloat(TotalOWk09) / parseFloat(TotalGrossImpressionsWk09));
        TotalDPOWk10 = (TotalGrossImpressionsWk10 == 0 ? 0 : parseFloat(TotalOWk10) / parseFloat(TotalGrossImpressionsWk10));
        TotalDPOWk11 = (TotalGrossImpressionsWk11 == 0 ? 0 : parseFloat(TotalOWk11) / parseFloat(TotalGrossImpressionsWk11));
        TotalDPOWk12 = (TotalGrossImpressionsWk12 == 0 ? 0 : parseFloat(TotalOWk12) / parseFloat(TotalGrossImpressionsWk12));
        TotalDPOWk13 = (TotalGrossImpressionsWk13 == 0 ? 0 : parseFloat(TotalOWk13) / parseFloat(TotalGrossImpressionsWk13));
        TotalDPOWk14 = (TotalGrossImpressionsWk14 == 0 ? 0 : parseFloat(TotalOWk14) / parseFloat(TotalGrossImpressionsWk14));

        TotalDPWWk01 = (TotalGrossImpressionsWk01 == 0 ? 0 : parseFloat(TotalWWk01) / parseFloat(TotalGrossImpressionsWk01));
        TotalDPWWk02 = (TotalGrossImpressionsWk02 == 0 ? 0 : parseFloat(TotalWWk02) / parseFloat(TotalGrossImpressionsWk02));
        TotalDPWWk03 = (TotalGrossImpressionsWk03 == 0 ? 0 : parseFloat(TotalWWk03) / parseFloat(TotalGrossImpressionsWk03));
        TotalDPWWk04 = (TotalGrossImpressionsWk04 == 0 ? 0 : parseFloat(TotalWWk04) / parseFloat(TotalGrossImpressionsWk04));
        TotalDPWWk05 = (TotalGrossImpressionsWk05 == 0 ? 0 : parseFloat(TotalWWk05) / parseFloat(TotalGrossImpressionsWk05));
        TotalDPWWk06 = (TotalGrossImpressionsWk06 == 0 ? 0 : parseFloat(TotalWWk06) / parseFloat(TotalGrossImpressionsWk06));
        TotalDPWWk07 = (TotalGrossImpressionsWk07 == 0 ? 0 : parseFloat(TotalWWk07) / parseFloat(TotalGrossImpressionsWk07));
        TotalDPWWk08 = (TotalGrossImpressionsWk08 == 0 ? 0 : parseFloat(TotalWWk08) / parseFloat(TotalGrossImpressionsWk08));
        TotalDPWWk09 = (TotalGrossImpressionsWk09 == 0 ? 0 : parseFloat(TotalWWk09) / parseFloat(TotalGrossImpressionsWk09));
        TotalDPWWk10 = (TotalGrossImpressionsWk10 == 0 ? 0 : parseFloat(TotalWWk10) / parseFloat(TotalGrossImpressionsWk10));
        TotalDPWWk11 = (TotalGrossImpressionsWk11 == 0 ? 0 : parseFloat(TotalWWk11) / parseFloat(TotalGrossImpressionsWk11));
        TotalDPWWk12 = (TotalGrossImpressionsWk12 == 0 ? 0 : parseFloat(TotalWWk12) / parseFloat(TotalGrossImpressionsWk12));
        TotalDPWWk13 = (TotalGrossImpressionsWk13 == 0 ? 0 : parseFloat(TotalWWk13) / parseFloat(TotalGrossImpressionsWk13));
        TotalDPWWk14 = (TotalGrossImpressionsWk14 == 0 ? 0 : parseFloat(TotalWWk14) / parseFloat(TotalGrossImpressionsWk14));

        TotalDPRWk01 = (TotalGrossImpressionsWk01 == 0 ? 0 : parseFloat(TotalRWk01) / parseFloat(TotalGrossImpressionsWk01));
        TotalDPRWk02 = (TotalGrossImpressionsWk02 == 0 ? 0 : parseFloat(TotalRWk02) / parseFloat(TotalGrossImpressionsWk02));
        TotalDPRWk03 = (TotalGrossImpressionsWk03 == 0 ? 0 : parseFloat(TotalRWk03) / parseFloat(TotalGrossImpressionsWk03));
        TotalDPRWk04 = (TotalGrossImpressionsWk04 == 0 ? 0 : parseFloat(TotalRWk04) / parseFloat(TotalGrossImpressionsWk04));
        TotalDPRWk05 = (TotalGrossImpressionsWk05 == 0 ? 0 : parseFloat(TotalRWk05) / parseFloat(TotalGrossImpressionsWk05));
        TotalDPRWk06 = (TotalGrossImpressionsWk06 == 0 ? 0 : parseFloat(TotalRWk06) / parseFloat(TotalGrossImpressionsWk06));
        TotalDPRWk07 = (TotalGrossImpressionsWk07 == 0 ? 0 : parseFloat(TotalRWk07) / parseFloat(TotalGrossImpressionsWk07));
        TotalDPRWk08 = (TotalGrossImpressionsWk08 == 0 ? 0 : parseFloat(TotalRWk08) / parseFloat(TotalGrossImpressionsWk08));
        TotalDPRWk09 = (TotalGrossImpressionsWk09 == 0 ? 0 : parseFloat(TotalRWk09) / parseFloat(TotalGrossImpressionsWk09));
        TotalDPRWk10 = (TotalGrossImpressionsWk10 == 0 ? 0 : parseFloat(TotalRWk10) / parseFloat(TotalGrossImpressionsWk10));
        TotalDPRWk11 = (TotalGrossImpressionsWk11 == 0 ? 0 : parseFloat(TotalRWk11) / parseFloat(TotalGrossImpressionsWk11));
        TotalDPRWk12 = (TotalGrossImpressionsWk12 == 0 ? 0 : parseFloat(TotalRWk12) / parseFloat(TotalGrossImpressionsWk12));
        TotalDPRWk13 = (TotalGrossImpressionsWk13 == 0 ? 0 : parseFloat(TotalRWk13) / parseFloat(TotalGrossImpressionsWk13));
        TotalDPRWk14 = (TotalGrossImpressionsWk14 == 0 ? 0 : parseFloat(TotalRWk14) / parseFloat(TotalGrossImpressionsWk14));

        TotalBuyTypeUWk01 = (TotalGrossImpressionsWk01 == 0 ? 0 : parseFloat(TotalBTUWk01) / parseFloat(TotalGrossImpressionsWk01));
        TotalBuyTypeUWk02 = (TotalGrossImpressionsWk02 == 0 ? 0 : parseFloat(TotalBTUWk02) / parseFloat(TotalGrossImpressionsWk02));
        TotalBuyTypeUWk03 = (TotalGrossImpressionsWk03 == 0 ? 0 : parseFloat(TotalBTUWk03) / parseFloat(TotalGrossImpressionsWk03));
        TotalBuyTypeUWk04 = (TotalGrossImpressionsWk04 == 0 ? 0 : parseFloat(TotalBTUWk04) / parseFloat(TotalGrossImpressionsWk04));
        TotalBuyTypeUWk05 = (TotalGrossImpressionsWk05 == 0 ? 0 : parseFloat(TotalBTUWk05) / parseFloat(TotalGrossImpressionsWk05));
        TotalBuyTypeUWk06 = (TotalGrossImpressionsWk06 == 0 ? 0 : parseFloat(TotalBTUWk06) / parseFloat(TotalGrossImpressionsWk06));
        TotalBuyTypeUWk07 = (TotalGrossImpressionsWk07 == 0 ? 0 : parseFloat(TotalBTUWk07) / parseFloat(TotalGrossImpressionsWk07));
        TotalBuyTypeUWk08 = (TotalGrossImpressionsWk08 == 0 ? 0 : parseFloat(TotalBTUWk08) / parseFloat(TotalGrossImpressionsWk08));
        TotalBuyTypeUWk09 = (TotalGrossImpressionsWk09 == 0 ? 0 : parseFloat(TotalBTUWk09) / parseFloat(TotalGrossImpressionsWk09));
        TotalBuyTypeUWk10 = (TotalGrossImpressionsWk10 == 0 ? 0 : parseFloat(TotalBTUWk10) / parseFloat(TotalGrossImpressionsWk10));
        TotalBuyTypeUWk11 = (TotalGrossImpressionsWk11 == 0 ? 0 : parseFloat(TotalBTUWk11) / parseFloat(TotalGrossImpressionsWk11));
        TotalBuyTypeUWk12 = (TotalGrossImpressionsWk12 == 0 ? 0 : parseFloat(TotalBTUWk12) / parseFloat(TotalGrossImpressionsWk12));
        TotalBuyTypeUWk13 = (TotalGrossImpressionsWk13 == 0 ? 0 : parseFloat(TotalBTUWk13) / parseFloat(TotalGrossImpressionsWk13));
        TotalBuyTypeUWk14 = (TotalGrossImpressionsWk14 == 0 ? 0 : parseFloat(TotalBTUWk14) / parseFloat(TotalGrossImpressionsWk14));

        TotalBuyTypeGPUWk01 = (TotalGrossImpressionsWk01 == 0 ? 0 : parseFloat(TotalBTGPUWk01) / parseFloat(TotalGrossImpressionsWk01));
        TotalBuyTypeGPUWk02 = (TotalGrossImpressionsWk02 == 0 ? 0 : parseFloat(TotalBTGPUWk02) / parseFloat(TotalGrossImpressionsWk02));
        TotalBuyTypeGPUWk03 = (TotalGrossImpressionsWk03 == 0 ? 0 : parseFloat(TotalBTGPUWk03) / parseFloat(TotalGrossImpressionsWk03));
        TotalBuyTypeGPUWk04 = (TotalGrossImpressionsWk04 == 0 ? 0 : parseFloat(TotalBTGPUWk04) / parseFloat(TotalGrossImpressionsWk04));
        TotalBuyTypeGPUWk05 = (TotalGrossImpressionsWk05 == 0 ? 0 : parseFloat(TotalBTGPUWk05) / parseFloat(TotalGrossImpressionsWk05));
        TotalBuyTypeGPUWk06 = (TotalGrossImpressionsWk06 == 0 ? 0 : parseFloat(TotalBTGPUWk06) / parseFloat(TotalGrossImpressionsWk06));
        TotalBuyTypeGPUWk07 = (TotalGrossImpressionsWk07 == 0 ? 0 : parseFloat(TotalBTGPUWk07) / parseFloat(TotalGrossImpressionsWk07));
        TotalBuyTypeGPUWk08 = (TotalGrossImpressionsWk08 == 0 ? 0 : parseFloat(TotalBTGPUWk08) / parseFloat(TotalGrossImpressionsWk08));
        TotalBuyTypeGPUWk09 = (TotalGrossImpressionsWk09 == 0 ? 0 : parseFloat(TotalBTGPUWk09) / parseFloat(TotalGrossImpressionsWk09));
        TotalBuyTypeGPUWk10 = (TotalGrossImpressionsWk10 == 0 ? 0 : parseFloat(TotalBTGPUWk10) / parseFloat(TotalGrossImpressionsWk10));
        TotalBuyTypeGPUWk11 = (TotalGrossImpressionsWk11 == 0 ? 0 : parseFloat(TotalBTGPUWk11) / parseFloat(TotalGrossImpressionsWk11));
        TotalBuyTypeGPUWk12 = (TotalGrossImpressionsWk12 == 0 ? 0 : parseFloat(TotalBTGPUWk12) / parseFloat(TotalGrossImpressionsWk12));
        TotalBuyTypeGPUWk13 = (TotalGrossImpressionsWk13 == 0 ? 0 : parseFloat(TotalBTGPUWk13) / parseFloat(TotalGrossImpressionsWk13));
        TotalBuyTypeGPUWk14 = (TotalGrossImpressionsWk14 == 0 ? 0 : parseFloat(TotalBTGPUWk14) / parseFloat(TotalGrossImpressionsWk14));

        TotalBuyTypeGRWk01 = (TotalGrossImpressionsWk01 == 0 ? 0 : parseFloat(TotalBTGRWk01) / parseFloat(TotalGrossImpressionsWk01));
        TotalBuyTypeGRWk02 = (TotalGrossImpressionsWk02 == 0 ? 0 : parseFloat(TotalBTGRWk02) / parseFloat(TotalGrossImpressionsWk02));
        TotalBuyTypeGRWk03 = (TotalGrossImpressionsWk03 == 0 ? 0 : parseFloat(TotalBTGRWk03) / parseFloat(TotalGrossImpressionsWk03));
        TotalBuyTypeGRWk04 = (TotalGrossImpressionsWk04 == 0 ? 0 : parseFloat(TotalBTGRWk04) / parseFloat(TotalGrossImpressionsWk04));
        TotalBuyTypeGRWk05 = (TotalGrossImpressionsWk05 == 0 ? 0 : parseFloat(TotalBTGRWk05) / parseFloat(TotalGrossImpressionsWk05));
        TotalBuyTypeGRWk06 = (TotalGrossImpressionsWk06 == 0 ? 0 : parseFloat(TotalBTGRWk06) / parseFloat(TotalGrossImpressionsWk06));
        TotalBuyTypeGRWk07 = (TotalGrossImpressionsWk07 == 0 ? 0 : parseFloat(TotalBTGRWk07) / parseFloat(TotalGrossImpressionsWk07));
        TotalBuyTypeGRWk08 = (TotalGrossImpressionsWk08 == 0 ? 0 : parseFloat(TotalBTGRWk08) / parseFloat(TotalGrossImpressionsWk08));
        TotalBuyTypeGRWk09 = (TotalGrossImpressionsWk09 == 0 ? 0 : parseFloat(TotalBTGRWk09) / parseFloat(TotalGrossImpressionsWk09));
        TotalBuyTypeGRWk10 = (TotalGrossImpressionsWk10 == 0 ? 0 : parseFloat(TotalBTGRWk10) / parseFloat(TotalGrossImpressionsWk10));
        TotalBuyTypeGRWk11 = (TotalGrossImpressionsWk11 == 0 ? 0 : parseFloat(TotalBTGRWk11) / parseFloat(TotalGrossImpressionsWk11));
        TotalBuyTypeGRWk12 = (TotalGrossImpressionsWk12 == 0 ? 0 : parseFloat(TotalBTGRWk12) / parseFloat(TotalGrossImpressionsWk12));
        TotalBuyTypeGRWk13 = (TotalGrossImpressionsWk13 == 0 ? 0 : parseFloat(TotalBTGRWk13) / parseFloat(TotalGrossImpressionsWk13));
        TotalBuyTypeGRWk14 = (TotalGrossImpressionsWk14 == 0 ? 0 : parseFloat(TotalBTGRWk14) / parseFloat(TotalGrossImpressionsWk14));

        TotalBuyTypeNRWk01 = (TotalGrossImpressionsWk01 == 0 ? 0 : parseFloat(TotalBTNRWk01) / parseFloat(TotalGrossImpressionsWk01));
        TotalBuyTypeNRWk02 = (TotalGrossImpressionsWk02 == 0 ? 0 : parseFloat(TotalBTNRWk02) / parseFloat(TotalGrossImpressionsWk02));
        TotalBuyTypeNRWk03 = (TotalGrossImpressionsWk03 == 0 ? 0 : parseFloat(TotalBTNRWk03) / parseFloat(TotalGrossImpressionsWk03));
        TotalBuyTypeNRWk04 = (TotalGrossImpressionsWk04 == 0 ? 0 : parseFloat(TotalBTNRWk04) / parseFloat(TotalGrossImpressionsWk04));
        TotalBuyTypeNRWk05 = (TotalGrossImpressionsWk05 == 0 ? 0 : parseFloat(TotalBTNRWk05) / parseFloat(TotalGrossImpressionsWk05));
        TotalBuyTypeNRWk06 = (TotalGrossImpressionsWk06 == 0 ? 0 : parseFloat(TotalBTNRWk06) / parseFloat(TotalGrossImpressionsWk06));
        TotalBuyTypeNRWk07 = (TotalGrossImpressionsWk07 == 0 ? 0 : parseFloat(TotalBTNRWk07) / parseFloat(TotalGrossImpressionsWk07));
        TotalBuyTypeNRWk08 = (TotalGrossImpressionsWk08 == 0 ? 0 : parseFloat(TotalBTNRWk08) / parseFloat(TotalGrossImpressionsWk08));
        TotalBuyTypeNRWk09 = (TotalGrossImpressionsWk09 == 0 ? 0 : parseFloat(TotalBTNRWk09) / parseFloat(TotalGrossImpressionsWk09));
        TotalBuyTypeNRWk10 = (TotalGrossImpressionsWk10 == 0 ? 0 : parseFloat(TotalBTNRWk10) / parseFloat(TotalGrossImpressionsWk10));
        TotalBuyTypeNRWk11 = (TotalGrossImpressionsWk11 == 0 ? 0 : parseFloat(TotalBTNRWk11) / parseFloat(TotalGrossImpressionsWk11));
        TotalBuyTypeNRWk12 = (TotalGrossImpressionsWk12 == 0 ? 0 : parseFloat(TotalBTNRWk12) / parseFloat(TotalGrossImpressionsWk12));
        TotalBuyTypeNRWk13 = (TotalGrossImpressionsWk13 == 0 ? 0 : parseFloat(TotalBTNRWk13) / parseFloat(TotalGrossImpressionsWk13));
        TotalBuyTypeNRWk14 = (TotalGrossImpressionsWk14 == 0 ? 0 : parseFloat(TotalBTNRWk14) / parseFloat(TotalGrossImpressionsWk14));

        TotalBuyTypePDRWk01 = (TotalGrossImpressionsWk01 == 0 ? 0 : parseFloat(TotalBTPDRWk01) / parseFloat(TotalGrossImpressionsWk01));
        TotalBuyTypePDRWk02 = (TotalGrossImpressionsWk02 == 0 ? 0 : parseFloat(TotalBTPDRWk02) / parseFloat(TotalGrossImpressionsWk02));
        TotalBuyTypePDRWk03 = (TotalGrossImpressionsWk03 == 0 ? 0 : parseFloat(TotalBTPDRWk03) / parseFloat(TotalGrossImpressionsWk03));
        TotalBuyTypePDRWk04 = (TotalGrossImpressionsWk04 == 0 ? 0 : parseFloat(TotalBTPDRWk04) / parseFloat(TotalGrossImpressionsWk04));
        TotalBuyTypePDRWk05 = (TotalGrossImpressionsWk05 == 0 ? 0 : parseFloat(TotalBTPDRWk05) / parseFloat(TotalGrossImpressionsWk05));
        TotalBuyTypePDRWk06 = (TotalGrossImpressionsWk06 == 0 ? 0 : parseFloat(TotalBTPDRWk06) / parseFloat(TotalGrossImpressionsWk06));
        TotalBuyTypePDRWk07 = (TotalGrossImpressionsWk07 == 0 ? 0 : parseFloat(TotalBTPDRWk07) / parseFloat(TotalGrossImpressionsWk07));
        TotalBuyTypePDRWk08 = (TotalGrossImpressionsWk08 == 0 ? 0 : parseFloat(TotalBTPDRWk08) / parseFloat(TotalGrossImpressionsWk08));
        TotalBuyTypePDRWk09 = (TotalGrossImpressionsWk09 == 0 ? 0 : parseFloat(TotalBTPDRWk09) / parseFloat(TotalGrossImpressionsWk09));
        TotalBuyTypePDRWk10 = (TotalGrossImpressionsWk10 == 0 ? 0 : parseFloat(TotalBTPDRWk10) / parseFloat(TotalGrossImpressionsWk10));
        TotalBuyTypePDRWk11 = (TotalGrossImpressionsWk11 == 0 ? 0 : parseFloat(TotalBTPDRWk11) / parseFloat(TotalGrossImpressionsWk11));
        TotalBuyTypePDRWk12 = (TotalGrossImpressionsWk12 == 0 ? 0 : parseFloat(TotalBTPDRWk12) / parseFloat(TotalGrossImpressionsWk12));
        TotalBuyTypePDRWk13 = (TotalGrossImpressionsWk13 == 0 ? 0 : parseFloat(TotalBTPDRWk13) / parseFloat(TotalGrossImpressionsWk13));
        TotalBuyTypePDRWk14 = (TotalGrossImpressionsWk14 == 0 ? 0 : parseFloat(TotalBTPDRWk14) / parseFloat(TotalGrossImpressionsWk14));

        TotalBuyTypePEWk01 = (TotalGrossImpressionsWk01 == 0 ? 0 : parseFloat(TotalBTPEWk01) / parseFloat(TotalGrossImpressionsWk01));
        TotalBuyTypePEWk02 = (TotalGrossImpressionsWk02 == 0 ? 0 : parseFloat(TotalBTPEWk02) / parseFloat(TotalGrossImpressionsWk02));
        TotalBuyTypePEWk03 = (TotalGrossImpressionsWk03 == 0 ? 0 : parseFloat(TotalBTPEWk03) / parseFloat(TotalGrossImpressionsWk03));
        TotalBuyTypePEWk04 = (TotalGrossImpressionsWk04 == 0 ? 0 : parseFloat(TotalBTPEWk04) / parseFloat(TotalGrossImpressionsWk04));
        TotalBuyTypePEWk05 = (TotalGrossImpressionsWk05 == 0 ? 0 : parseFloat(TotalBTPEWk05) / parseFloat(TotalGrossImpressionsWk05));
        TotalBuyTypePEWk06 = (TotalGrossImpressionsWk06 == 0 ? 0 : parseFloat(TotalBTPEWk06) / parseFloat(TotalGrossImpressionsWk06));
        TotalBuyTypePEWk07 = (TotalGrossImpressionsWk07 == 0 ? 0 : parseFloat(TotalBTPEWk07) / parseFloat(TotalGrossImpressionsWk07));
        TotalBuyTypePEWk08 = (TotalGrossImpressionsWk08 == 0 ? 0 : parseFloat(TotalBTPEWk08) / parseFloat(TotalGrossImpressionsWk08));
        TotalBuyTypePEWk09 = (TotalGrossImpressionsWk09 == 0 ? 0 : parseFloat(TotalBTPEWk09) / parseFloat(TotalGrossImpressionsWk09));
        TotalBuyTypePEWk10 = (TotalGrossImpressionsWk10 == 0 ? 0 : parseFloat(TotalBTPEWk10) / parseFloat(TotalGrossImpressionsWk10));
        TotalBuyTypePEWk11 = (TotalGrossImpressionsWk11 == 0 ? 0 : parseFloat(TotalBTPEWk11) / parseFloat(TotalGrossImpressionsWk11));
        TotalBuyTypePEWk12 = (TotalGrossImpressionsWk12 == 0 ? 0 : parseFloat(TotalBTPEWk12) / parseFloat(TotalGrossImpressionsWk12));
        TotalBuyTypePEWk13 = (TotalGrossImpressionsWk13 == 0 ? 0 : parseFloat(TotalBTPEWk13) / parseFloat(TotalGrossImpressionsWk13));
        TotalBuyTypePEWk14 = (TotalGrossImpressionsWk14 == 0 ? 0 : parseFloat(TotalBTPEWk14) / parseFloat(TotalGrossImpressionsWk14));

        TotalBuyTypeGPEWk01 = (TotalGrossImpressionsWk01 == 0 ? 0 : parseFloat(TotalBTGPEWk01) / parseFloat(TotalGrossImpressionsWk01));
        TotalBuyTypeGPEWk02 = (TotalGrossImpressionsWk02 == 0 ? 0 : parseFloat(TotalBTGPEWk02) / parseFloat(TotalGrossImpressionsWk02));
        TotalBuyTypeGPEWk03 = (TotalGrossImpressionsWk03 == 0 ? 0 : parseFloat(TotalBTGPEWk03) / parseFloat(TotalGrossImpressionsWk03));
        TotalBuyTypeGPEWk04 = (TotalGrossImpressionsWk04 == 0 ? 0 : parseFloat(TotalBTGPEWk04) / parseFloat(TotalGrossImpressionsWk04));
        TotalBuyTypeGPEWk05 = (TotalGrossImpressionsWk05 == 0 ? 0 : parseFloat(TotalBTGPEWk05) / parseFloat(TotalGrossImpressionsWk05));
        TotalBuyTypeGPEWk06 = (TotalGrossImpressionsWk06 == 0 ? 0 : parseFloat(TotalBTGPEWk06) / parseFloat(TotalGrossImpressionsWk06));
        TotalBuyTypeGPEWk07 = (TotalGrossImpressionsWk07 == 0 ? 0 : parseFloat(TotalBTGPEWk07) / parseFloat(TotalGrossImpressionsWk07));
        TotalBuyTypeGPEWk08 = (TotalGrossImpressionsWk08 == 0 ? 0 : parseFloat(TotalBTGPEWk08) / parseFloat(TotalGrossImpressionsWk08));
        TotalBuyTypeGPEWk09 = (TotalGrossImpressionsWk09 == 0 ? 0 : parseFloat(TotalBTGPEWk09) / parseFloat(TotalGrossImpressionsWk09));
        TotalBuyTypeGPEWk10 = (TotalGrossImpressionsWk10 == 0 ? 0 : parseFloat(TotalBTGPEWk10) / parseFloat(TotalGrossImpressionsWk10));
        TotalBuyTypeGPEWk11 = (TotalGrossImpressionsWk11 == 0 ? 0 : parseFloat(TotalBTGPEWk11) / parseFloat(TotalGrossImpressionsWk11));
        TotalBuyTypeGPEWk12 = (TotalGrossImpressionsWk12 == 0 ? 0 : parseFloat(TotalBTGPEWk12) / parseFloat(TotalGrossImpressionsWk12));
        TotalBuyTypeGPEWk13 = (TotalGrossImpressionsWk13 == 0 ? 0 : parseFloat(TotalBTGPEWk13) / parseFloat(TotalGrossImpressionsWk13));
        TotalBuyTypeGPEWk14 = (TotalGrossImpressionsWk14 == 0 ? 0 : parseFloat(TotalBTGPEWk14) / parseFloat(TotalGrossImpressionsWk14));

        TotalBuyTypeAWk01 = (TotalGrossImpressionsWk01 == 0 ? 0 : parseFloat(TotalBTAWk01) / parseFloat(TotalGrossImpressionsWk01));
        TotalBuyTypeAWk02 = (TotalGrossImpressionsWk02 == 0 ? 0 : parseFloat(TotalBTAWk02) / parseFloat(TotalGrossImpressionsWk02));
        TotalBuyTypeAWk03 = (TotalGrossImpressionsWk03 == 0 ? 0 : parseFloat(TotalBTAWk03) / parseFloat(TotalGrossImpressionsWk03));
        TotalBuyTypeAWk04 = (TotalGrossImpressionsWk04 == 0 ? 0 : parseFloat(TotalBTAWk04) / parseFloat(TotalGrossImpressionsWk04));
        TotalBuyTypeAWk05 = (TotalGrossImpressionsWk05 == 0 ? 0 : parseFloat(TotalBTAWk05) / parseFloat(TotalGrossImpressionsWk05));
        TotalBuyTypeAWk06 = (TotalGrossImpressionsWk06 == 0 ? 0 : parseFloat(TotalBTAWk06) / parseFloat(TotalGrossImpressionsWk06));
        TotalBuyTypeAWk07 = (TotalGrossImpressionsWk07 == 0 ? 0 : parseFloat(TotalBTAWk07) / parseFloat(TotalGrossImpressionsWk07));
        TotalBuyTypeAWk08 = (TotalGrossImpressionsWk08 == 0 ? 0 : parseFloat(TotalBTAWk08) / parseFloat(TotalGrossImpressionsWk08));
        TotalBuyTypeAWk09 = (TotalGrossImpressionsWk09 == 0 ? 0 : parseFloat(TotalBTAWk09) / parseFloat(TotalGrossImpressionsWk09));
        TotalBuyTypeAWk10 = (TotalGrossImpressionsWk10 == 0 ? 0 : parseFloat(TotalBTAWk10) / parseFloat(TotalGrossImpressionsWk10));
        TotalBuyTypeAWk11 = (TotalGrossImpressionsWk11 == 0 ? 0 : parseFloat(TotalBTAWk11) / parseFloat(TotalGrossImpressionsWk11));
        TotalBuyTypeAWk12 = (TotalGrossImpressionsWk12 == 0 ? 0 : parseFloat(TotalBTAWk12) / parseFloat(TotalGrossImpressionsWk12));
        TotalBuyTypeAWk13 = (TotalGrossImpressionsWk13 == 0 ? 0 : parseFloat(TotalBTAWk13) / parseFloat(TotalGrossImpressionsWk13));
        TotalBuyTypeAWk14 = (TotalGrossImpressionsWk14 == 0 ? 0 : parseFloat(TotalBTAWk14) / parseFloat(TotalGrossImpressionsWk14));

        TotalBuyTypeMGWk01 = (TotalGrossImpressionsWk01 == 0 ? 0 : parseFloat(TotalBTMGWk01) / parseFloat(TotalGrossImpressionsWk01));
        TotalBuyTypeMGWk02 = (TotalGrossImpressionsWk02 == 0 ? 0 : parseFloat(TotalBTMGWk02) / parseFloat(TotalGrossImpressionsWk02));
        TotalBuyTypeMGWk03 = (TotalGrossImpressionsWk03 == 0 ? 0 : parseFloat(TotalBTMGWk03) / parseFloat(TotalGrossImpressionsWk03));
        TotalBuyTypeMGWk04 = (TotalGrossImpressionsWk04 == 0 ? 0 : parseFloat(TotalBTMGWk04) / parseFloat(TotalGrossImpressionsWk04));
        TotalBuyTypeMGWk05 = (TotalGrossImpressionsWk05 == 0 ? 0 : parseFloat(TotalBTMGWk05) / parseFloat(TotalGrossImpressionsWk05));
        TotalBuyTypeMGWk06 = (TotalGrossImpressionsWk06 == 0 ? 0 : parseFloat(TotalBTMGWk06) / parseFloat(TotalGrossImpressionsWk06));
        TotalBuyTypeMGWk07 = (TotalGrossImpressionsWk07 == 0 ? 0 : parseFloat(TotalBTMGWk07) / parseFloat(TotalGrossImpressionsWk07));
        TotalBuyTypeMGWk08 = (TotalGrossImpressionsWk08 == 0 ? 0 : parseFloat(TotalBTMGWk08) / parseFloat(TotalGrossImpressionsWk08));
        TotalBuyTypeMGWk09 = (TotalGrossImpressionsWk09 == 0 ? 0 : parseFloat(TotalBTMGWk09) / parseFloat(TotalGrossImpressionsWk09));
        TotalBuyTypeMGWk10 = (TotalGrossImpressionsWk10 == 0 ? 0 : parseFloat(TotalBTMGWk10) / parseFloat(TotalGrossImpressionsWk10));
        TotalBuyTypeMGWk11 = (TotalGrossImpressionsWk11 == 0 ? 0 : parseFloat(TotalBTMGWk11) / parseFloat(TotalGrossImpressionsWk11));
        TotalBuyTypeMGWk12 = (TotalGrossImpressionsWk12 == 0 ? 0 : parseFloat(TotalBTMGWk12) / parseFloat(TotalGrossImpressionsWk12));
        TotalBuyTypeMGWk13 = (TotalGrossImpressionsWk13 == 0 ? 0 : parseFloat(TotalBTMGWk13) / parseFloat(TotalGrossImpressionsWk13));
        TotalBuyTypeMGWk14 = (TotalGrossImpressionsWk14 == 0 ? 0 : parseFloat(TotalBTMGWk14) / parseFloat(TotalGrossImpressionsWk14));

        TotalBuyTypeMWk01 = (TotalGrossImpressionsWk01 == 0 ? 0 : parseFloat(TotalBTMWk01) / parseFloat(TotalGrossImpressionsWk01));
        TotalBuyTypeMWk02 = (TotalGrossImpressionsWk02 == 0 ? 0 : parseFloat(TotalBTMWk02) / parseFloat(TotalGrossImpressionsWk02));
        TotalBuyTypeMWk03 = (TotalGrossImpressionsWk03 == 0 ? 0 : parseFloat(TotalBTMWk03) / parseFloat(TotalGrossImpressionsWk03));
        TotalBuyTypeMWk04 = (TotalGrossImpressionsWk04 == 0 ? 0 : parseFloat(TotalBTMWk04) / parseFloat(TotalGrossImpressionsWk04));
        TotalBuyTypeMWk05 = (TotalGrossImpressionsWk05 == 0 ? 0 : parseFloat(TotalBTMWk05) / parseFloat(TotalGrossImpressionsWk05));
        TotalBuyTypeMWk06 = (TotalGrossImpressionsWk06 == 0 ? 0 : parseFloat(TotalBTMWk06) / parseFloat(TotalGrossImpressionsWk06));
        TotalBuyTypeMWk07 = (TotalGrossImpressionsWk07 == 0 ? 0 : parseFloat(TotalBTMWk07) / parseFloat(TotalGrossImpressionsWk07));
        TotalBuyTypeMWk08 = (TotalGrossImpressionsWk08 == 0 ? 0 : parseFloat(TotalBTMWk08) / parseFloat(TotalGrossImpressionsWk08));
        TotalBuyTypeMWk09 = (TotalGrossImpressionsWk09 == 0 ? 0 : parseFloat(TotalBTMWk09) / parseFloat(TotalGrossImpressionsWk09));
        TotalBuyTypeMWk10 = (TotalGrossImpressionsWk10 == 0 ? 0 : parseFloat(TotalBTMWk10) / parseFloat(TotalGrossImpressionsWk10));
        TotalBuyTypeMWk11 = (TotalGrossImpressionsWk11 == 0 ? 0 : parseFloat(TotalBTMWk11) / parseFloat(TotalGrossImpressionsWk11));
        TotalBuyTypeMWk12 = (TotalGrossImpressionsWk12 == 0 ? 0 : parseFloat(TotalBTMWk12) / parseFloat(TotalGrossImpressionsWk12));
        TotalBuyTypeMWk13 = (TotalGrossImpressionsWk13 == 0 ? 0 : parseFloat(TotalBTMWk13) / parseFloat(TotalGrossImpressionsWk13));
        TotalBuyTypeMWk14 = (TotalGrossImpressionsWk14 == 0 ? 0 : parseFloat(TotalBTMWk14) / parseFloat(TotalGrossImpressionsWk14));

        TotalBuyTypeBWk01 = (TotalGrossImpressionsWk01 == 0 ? 0 : parseFloat(TotalBTBWk01) / parseFloat(TotalGrossImpressionsWk01));
        TotalBuyTypeBWk02 = (TotalGrossImpressionsWk02 == 0 ? 0 : parseFloat(TotalBTBWk02) / parseFloat(TotalGrossImpressionsWk02));
        TotalBuyTypeBWk03 = (TotalGrossImpressionsWk03 == 0 ? 0 : parseFloat(TotalBTBWk03) / parseFloat(TotalGrossImpressionsWk03));
        TotalBuyTypeBWk04 = (TotalGrossImpressionsWk04 == 0 ? 0 : parseFloat(TotalBTBWk04) / parseFloat(TotalGrossImpressionsWk04));
        TotalBuyTypeBWk05 = (TotalGrossImpressionsWk05 == 0 ? 0 : parseFloat(TotalBTBWk05) / parseFloat(TotalGrossImpressionsWk05));
        TotalBuyTypeBWk06 = (TotalGrossImpressionsWk06 == 0 ? 0 : parseFloat(TotalBTBWk06) / parseFloat(TotalGrossImpressionsWk06));
        TotalBuyTypeBWk07 = (TotalGrossImpressionsWk07 == 0 ? 0 : parseFloat(TotalBTBWk07) / parseFloat(TotalGrossImpressionsWk07));
        TotalBuyTypeBWk08 = (TotalGrossImpressionsWk08 == 0 ? 0 : parseFloat(TotalBTBWk08) / parseFloat(TotalGrossImpressionsWk08));
        TotalBuyTypeBWk09 = (TotalGrossImpressionsWk09 == 0 ? 0 : parseFloat(TotalBTBWk09) / parseFloat(TotalGrossImpressionsWk09));
        TotalBuyTypeBWk10 = (TotalGrossImpressionsWk10 == 0 ? 0 : parseFloat(TotalBTBWk10) / parseFloat(TotalGrossImpressionsWk10));
        TotalBuyTypeBWk11 = (TotalGrossImpressionsWk11 == 0 ? 0 : parseFloat(TotalBTBWk11) / parseFloat(TotalGrossImpressionsWk11));
        TotalBuyTypeBWk12 = (TotalGrossImpressionsWk12 == 0 ? 0 : parseFloat(TotalBTBWk12) / parseFloat(TotalGrossImpressionsWk12));
        TotalBuyTypeBWk13 = (TotalGrossImpressionsWk13 == 0 ? 0 : parseFloat(TotalBTBWk13) / parseFloat(TotalGrossImpressionsWk13));
        TotalBuyTypeBWk14 = (TotalGrossImpressionsWk14 == 0 ? 0 : parseFloat(TotalBTBWk14) / parseFloat(TotalGrossImpressionsWk14));

        TotalBuyTypeUEWk01 = (TotalGrossImpressionsWk01 == 0 ? 0 : parseFloat(TotalBTUEWk01) / parseFloat(TotalGrossImpressionsWk01));
        TotalBuyTypeUEWk02 = (TotalGrossImpressionsWk02 == 0 ? 0 : parseFloat(TotalBTUEWk02) / parseFloat(TotalGrossImpressionsWk02));
        TotalBuyTypeUEWk03 = (TotalGrossImpressionsWk03 == 0 ? 0 : parseFloat(TotalBTUEWk03) / parseFloat(TotalGrossImpressionsWk03));
        TotalBuyTypeUEWk04 = (TotalGrossImpressionsWk04 == 0 ? 0 : parseFloat(TotalBTUEWk04) / parseFloat(TotalGrossImpressionsWk04));
        TotalBuyTypeUEWk05 = (TotalGrossImpressionsWk05 == 0 ? 0 : parseFloat(TotalBTUEWk05) / parseFloat(TotalGrossImpressionsWk05));
        TotalBuyTypeUEWk06 = (TotalGrossImpressionsWk06 == 0 ? 0 : parseFloat(TotalBTUEWk06) / parseFloat(TotalGrossImpressionsWk06));
        TotalBuyTypeUEWk07 = (TotalGrossImpressionsWk07 == 0 ? 0 : parseFloat(TotalBTUEWk07) / parseFloat(TotalGrossImpressionsWk07));
        TotalBuyTypeUEWk08 = (TotalGrossImpressionsWk08 == 0 ? 0 : parseFloat(TotalBTUEWk08) / parseFloat(TotalGrossImpressionsWk08));
        TotalBuyTypeUEWk09 = (TotalGrossImpressionsWk09 == 0 ? 0 : parseFloat(TotalBTUEWk09) / parseFloat(TotalGrossImpressionsWk09));
        TotalBuyTypeUEWk10 = (TotalGrossImpressionsWk10 == 0 ? 0 : parseFloat(TotalBTUEWk10) / parseFloat(TotalGrossImpressionsWk10));
        TotalBuyTypeUEWk11 = (TotalGrossImpressionsWk11 == 0 ? 0 : parseFloat(TotalBTUEWk11) / parseFloat(TotalGrossImpressionsWk11));
        TotalBuyTypeUEWk12 = (TotalGrossImpressionsWk12 == 0 ? 0 : parseFloat(TotalBTUEWk12) / parseFloat(TotalGrossImpressionsWk12));
        TotalBuyTypeUEWk13 = (TotalGrossImpressionsWk13 == 0 ? 0 : parseFloat(TotalBTUEWk13) / parseFloat(TotalGrossImpressionsWk13));
        TotalBuyTypeUEWk14 = (TotalGrossImpressionsWk14 == 0 ? 0 : parseFloat(TotalBTUEWk14) / parseFloat(TotalGrossImpressionsWk14));

        TotalBuyTypeADWk01 = (TotalGrossImpressionsWk01 == 0 ? 0 : parseFloat(TotalBTADWk01) / parseFloat(TotalGrossImpressionsWk01));
        TotalBuyTypeADWk02 = (TotalGrossImpressionsWk02 == 0 ? 0 : parseFloat(TotalBTADWk02) / parseFloat(TotalGrossImpressionsWk02));
        TotalBuyTypeADWk03 = (TotalGrossImpressionsWk03 == 0 ? 0 : parseFloat(TotalBTADWk03) / parseFloat(TotalGrossImpressionsWk03));
        TotalBuyTypeADWk04 = (TotalGrossImpressionsWk04 == 0 ? 0 : parseFloat(TotalBTADWk04) / parseFloat(TotalGrossImpressionsWk04));
        TotalBuyTypeADWk05 = (TotalGrossImpressionsWk05 == 0 ? 0 : parseFloat(TotalBTADWk05) / parseFloat(TotalGrossImpressionsWk05));
        TotalBuyTypeADWk06 = (TotalGrossImpressionsWk06 == 0 ? 0 : parseFloat(TotalBTADWk06) / parseFloat(TotalGrossImpressionsWk06));
        TotalBuyTypeADWk07 = (TotalGrossImpressionsWk07 == 0 ? 0 : parseFloat(TotalBTADWk07) / parseFloat(TotalGrossImpressionsWk07));
        TotalBuyTypeADWk08 = (TotalGrossImpressionsWk08 == 0 ? 0 : parseFloat(TotalBTADWk08) / parseFloat(TotalGrossImpressionsWk08));
        TotalBuyTypeADWk09 = (TotalGrossImpressionsWk09 == 0 ? 0 : parseFloat(TotalBTADWk09) / parseFloat(TotalGrossImpressionsWk09));
        TotalBuyTypeADWk10 = (TotalGrossImpressionsWk10 == 0 ? 0 : parseFloat(TotalBTADWk10) / parseFloat(TotalGrossImpressionsWk10));
        TotalBuyTypeADWk11 = (TotalGrossImpressionsWk11 == 0 ? 0 : parseFloat(TotalBTADWk11) / parseFloat(TotalGrossImpressionsWk11));
        TotalBuyTypeADWk12 = (TotalGrossImpressionsWk12 == 0 ? 0 : parseFloat(TotalBTADWk12) / parseFloat(TotalGrossImpressionsWk12));
        TotalBuyTypeADWk13 = (TotalGrossImpressionsWk13 == 0 ? 0 : parseFloat(TotalBTADWk13) / parseFloat(TotalGrossImpressionsWk13));
        TotalBuyTypeADWk14 = (TotalGrossImpressionsWk14 == 0 ? 0 : parseFloat(TotalBTADWk14) / parseFloat(TotalGrossImpressionsWk14));

        TotalBuyTypeNLVWk01 = (TotalGrossImpressionsWk01 == 0 ? 0 : parseFloat(TotalBTNLVWk01) / parseFloat(TotalGrossImpressionsWk01));
        TotalBuyTypeNLVWk02 = (TotalGrossImpressionsWk02 == 0 ? 0 : parseFloat(TotalBTNLVWk02) / parseFloat(TotalGrossImpressionsWk02));
        TotalBuyTypeNLVWk03 = (TotalGrossImpressionsWk03 == 0 ? 0 : parseFloat(TotalBTNLVWk03) / parseFloat(TotalGrossImpressionsWk03));
        TotalBuyTypeNLVWk04 = (TotalGrossImpressionsWk04 == 0 ? 0 : parseFloat(TotalBTNLVWk04) / parseFloat(TotalGrossImpressionsWk04));
        TotalBuyTypeNLVWk05 = (TotalGrossImpressionsWk05 == 0 ? 0 : parseFloat(TotalBTNLVWk05) / parseFloat(TotalGrossImpressionsWk05));
        TotalBuyTypeNLVWk06 = (TotalGrossImpressionsWk06 == 0 ? 0 : parseFloat(TotalBTNLVWk06) / parseFloat(TotalGrossImpressionsWk06));
        TotalBuyTypeNLVWk07 = (TotalGrossImpressionsWk07 == 0 ? 0 : parseFloat(TotalBTNLVWk07) / parseFloat(TotalGrossImpressionsWk07));
        TotalBuyTypeNLVWk08 = (TotalGrossImpressionsWk08 == 0 ? 0 : parseFloat(TotalBTNLVWk08) / parseFloat(TotalGrossImpressionsWk08));
        TotalBuyTypeNLVWk09 = (TotalGrossImpressionsWk09 == 0 ? 0 : parseFloat(TotalBTNLVWk09) / parseFloat(TotalGrossImpressionsWk09));
        TotalBuyTypeNLVWk10 = (TotalGrossImpressionsWk10 == 0 ? 0 : parseFloat(TotalBTNLVWk10) / parseFloat(TotalGrossImpressionsWk10));
        TotalBuyTypeNLVWk11 = (TotalGrossImpressionsWk11 == 0 ? 0 : parseFloat(TotalBTNLVWk11) / parseFloat(TotalGrossImpressionsWk11));
        TotalBuyTypeNLVWk12 = (TotalGrossImpressionsWk12 == 0 ? 0 : parseFloat(TotalBTNLVWk12) / parseFloat(TotalGrossImpressionsWk12));
        TotalBuyTypeNLVWk13 = (TotalGrossImpressionsWk13 == 0 ? 0 : parseFloat(TotalBTNLVWk13) / parseFloat(TotalGrossImpressionsWk13));
        TotalBuyTypeNLVWk14 = (TotalGrossImpressionsWk14 == 0 ? 0 : parseFloat(TotalBTNLVWk14) / parseFloat(TotalGrossImpressionsWk14));

        TotalBuyTypePMWk01 = (TotalGrossImpressionsWk01 == 0 ? 0 : parseFloat(TotalBTPMWk01) / parseFloat(TotalGrossImpressionsWk01));
        TotalBuyTypePMWk02 = (TotalGrossImpressionsWk02 == 0 ? 0 : parseFloat(TotalBTPMWk02) / parseFloat(TotalGrossImpressionsWk02));
        TotalBuyTypePMWk03 = (TotalGrossImpressionsWk03 == 0 ? 0 : parseFloat(TotalBTPMWk03) / parseFloat(TotalGrossImpressionsWk03));
        TotalBuyTypePMWk04 = (TotalGrossImpressionsWk04 == 0 ? 0 : parseFloat(TotalBTPMWk04) / parseFloat(TotalGrossImpressionsWk04));
        TotalBuyTypePMWk05 = (TotalGrossImpressionsWk05 == 0 ? 0 : parseFloat(TotalBTPMWk05) / parseFloat(TotalGrossImpressionsWk05));
        TotalBuyTypePMWk06 = (TotalGrossImpressionsWk06 == 0 ? 0 : parseFloat(TotalBTPMWk06) / parseFloat(TotalGrossImpressionsWk06));
        TotalBuyTypePMWk07 = (TotalGrossImpressionsWk07 == 0 ? 0 : parseFloat(TotalBTPMWk07) / parseFloat(TotalGrossImpressionsWk07));
        TotalBuyTypePMWk08 = (TotalGrossImpressionsWk08 == 0 ? 0 : parseFloat(TotalBTPMWk08) / parseFloat(TotalGrossImpressionsWk08));
        TotalBuyTypePMWk09 = (TotalGrossImpressionsWk09 == 0 ? 0 : parseFloat(TotalBTPMWk09) / parseFloat(TotalGrossImpressionsWk09));
        TotalBuyTypePMWk10 = (TotalGrossImpressionsWk10 == 0 ? 0 : parseFloat(TotalBTPMWk10) / parseFloat(TotalGrossImpressionsWk10));
        TotalBuyTypePMWk11 = (TotalGrossImpressionsWk11 == 0 ? 0 : parseFloat(TotalBTPMWk11) / parseFloat(TotalGrossImpressionsWk11));
        TotalBuyTypePMWk12 = (TotalGrossImpressionsWk12 == 0 ? 0 : parseFloat(TotalBTPMWk12) / parseFloat(TotalGrossImpressionsWk12));
        TotalBuyTypePMWk13 = (TotalGrossImpressionsWk13 == 0 ? 0 : parseFloat(TotalBTPMWk13) / parseFloat(TotalGrossImpressionsWk13));
        TotalBuyTypePMWk14 = (TotalGrossImpressionsWk14 == 0 ? 0 : parseFloat(TotalBTPMWk14) / parseFloat(TotalGrossImpressionsWk14));

        Total15 = Total15Wk01 + Total15Wk02 + Total15Wk03 +
            Total15Wk04 + Total15Wk05 + Total15Wk06 + Total15Wk07 +
            Total15Wk08 + Total15Wk09 + Total15Wk10 + Total15Wk11 +
            Total15Wk12 + Total15Wk13 + Total15Wk14;

        TotalGI15 = (TotalGrossImpressions == 0 ? 0 : parseFloat(Total15) / parseFloat(TotalGrossImpressions));

        Total30 = Total30Wk01 + Total30Wk02 + Total30Wk03 +
            Total30Wk04 + Total30Wk05 + Total30Wk06 + Total30Wk07 +
            Total30Wk08 + Total30Wk09 + Total30Wk10 + Total30Wk11 +
            Total30Wk12 + Total30Wk13 + Total30Wk14;

        TotalGI30 = (TotalGrossImpressions == 0 ? 0 : parseFloat(Total30) / parseFloat(TotalGrossImpressions));

        Total60 = Total60Wk01 + Total60Wk02 + Total60Wk03 +
            Total60Wk04 + Total60Wk05 + Total60Wk06 + Total60Wk07 +
            Total60Wk08 + Total60Wk09 + Total60Wk10 + Total60Wk11 +
            Total60Wk12 + Total60Wk13 + Total60Wk14;

        TotalGI60 = (TotalGrossImpressions == 0 ? 0 : parseFloat(Total60) / parseFloat(TotalGrossImpressions));

        TotalGI120 = TotalGI120Wk01 + TotalGI120Wk02 + TotalGI120Wk03 +
            TotalGI120Wk04 + TotalGI120Wk05 + TotalGI120Wk06 + TotalGI120Wk07 +
            TotalGI120Wk08 + TotalGI120Wk09 + TotalGI120Wk10 + TotalGI120Wk11 +
            TotalGI120Wk12 + TotalGI120Wk13 + TotalGI120Wk14;

        TotalGI120 = (TotalGrossImpressions == 0 ? 0 : parseFloat(Total120) / parseFloat(TotalGrossImpressions));

        TotalM = TotalMWk01 + TotalMWk02 + TotalMWk03 +
            TotalMWk04 + TotalMWk05 + TotalMWk06 + TotalMWk07 +
            TotalMWk08 + TotalMWk09 + TotalMWk10 + TotalMWk11 +
            TotalMWk12 + TotalMWk13 + TotalMWk14;

        TotalDPM = (TotalGrossImpressions == 0 ? 0 : parseFloat(TotalM) / parseFloat(TotalGrossImpressions));

        TotalD = TotalDWk01 + TotalDWk02 + TotalDWk03 +
            TotalDWk04 + TotalDWk05 + TotalDWk06 + TotalDWk07 +
            TotalDWk08 + TotalDWk09 + TotalDWk10 + TotalDWk11 +
            TotalDWk12 + TotalDWk13 + TotalDWk14;

        TotalDPD = (TotalGrossImpressions == 0 ? 0 : parseFloat(TotalD) / parseFloat(TotalGrossImpressions));

        TotalF = TotalFWk01 + TotalFWk02 + TotalFWk03 +
            TotalFWk04 + TotalFWk05 + TotalFWk06 + TotalFWk07 +
            TotalFWk08 + TotalFWk09 + TotalFWk10 + TotalFWk11 +
            TotalFWk12 + TotalFWk13 + TotalFWk14;

        TotalDPF = (TotalGrossImpressions == 0 ? 0 : parseFloat(TotalF) / parseFloat(TotalGrossImpressions));

        TotalP = TotalPWk01 + TotalPWk02 + TotalPWk03 +
            TotalPWk04 + TotalPWk05 + TotalPWk06 + TotalPWk07 +
            TotalPWk08 + TotalPWk09 + TotalPWk10 + TotalPWk11 +
            TotalPWk12 + TotalPWk13 + TotalPWk14;

        TotalDPP = (TotalGrossImpressions == 0 ? 0 : parseFloat(TotalP) / parseFloat(TotalGrossImpressions));

        TotalL = TotalLWk01 + TotalLWk02 + TotalLWk03 +
            TotalLWk04 + TotalLWk05 + TotalLWk06 + TotalLWk07 +
            TotalLWk08 + TotalLWk09 + TotalLWk10 + TotalLWk11 +
            TotalLWk12 + TotalLWk13 + TotalLWk14;

        TotalDPL = (TotalGrossImpressions == 0 ? 0 : parseFloat(TotalL) / parseFloat(TotalGrossImpressions));

        TotalO = TotalOWk01 + TotalOWk02 + TotalOWk03 +
            TotalOWk04 + TotalOWk05 + TotalOWk06 + TotalOWk07 +
            TotalOWk08 + TotalOWk09 + TotalOWk10 + TotalOWk11 +
            TotalOWk12 + TotalOWk13 + TotalOWk14;

        TotalDPO = (TotalGrossImpressions == 0 ? 0 : parseFloat(TotalO) / parseFloat(TotalGrossImpressions));

        TotalW = TotalWWk01 + TotalWWk02 + TotalWWk03 +
            TotalWWk04 + TotalWWk05 + TotalWWk06 + TotalWWk07 +
            TotalWWk08 + TotalWWk09 + TotalWWk10 + TotalWWk11 +
            TotalWWk12 + TotalWWk13 + TotalWWk14;

        TotalDPW = (TotalGrossImpressions == 0 ? 0 : parseFloat(TotalW) / parseFloat(TotalGrossImpressions));

        TotalR = TotalRWk01 + TotalRWk02 + TotalRWk03 +
            TotalRWk04 + TotalRWk05 + TotalRWk06 + TotalRWk07 +
            TotalRWk08 + TotalRWk09 + TotalRWk10 + TotalRWk11 +
            TotalRWk12 + TotalRWk13 + TotalRWk14;

        TotalDPR = (TotalGrossImpressions == 0 ? 0 : parseFloat(TotalR) / parseFloat(TotalGrossImpressions));


        TotalBuyTypeU = parseFloat(TotalBTUWk01 + TotalBTUWk02 + TotalBTUWk03 +
            TotalBTUWk04 + TotalBTUWk05 + TotalBTUWk06 + TotalBTUWk07 +
            TotalBTUWk08 + TotalBTUWk09 + TotalBTUWk10 + TotalBTUWk11 +
            TotalBTUWk12 + TotalBTUWk13 + TotalBTUWk14) / parseFloat(TotalGrossImpressions);

        TotalBuyTypeGPU = parseFloat(TotalBuyTypeGPUWk01 + TotalBuyTypeGPUWk02 + TotalBuyTypeGPUWk03 +
            TotalBuyTypeGPUWk04 + TotalBuyTypeGPUWk05 + TotalBuyTypeGPUWk06 + TotalBuyTypeGPUWk07 +
            TotalBuyTypeGPUWk08 + TotalBuyTypeGPUWk09 + TotalBuyTypeGPUWk10 + TotalBuyTypeGPUWk11 +
            TotalBuyTypeGPUWk12 + TotalBuyTypeGPUWk13 + TotalBuyTypeGPUWk14) / parseFloat(TotalGrossImpressions);

        TotalBuyTypeGR = parseFloat(TotalBuyTypeGRWk01 + TotalBuyTypeGRWk02 + TotalBuyTypeGRWk03 +
            TotalBuyTypeGRWk04 + TotalBuyTypeGRWk05 + TotalBuyTypeGRWk06 + TotalBuyTypeGRWk07 +
            TotalBuyTypeGRWk08 + TotalBuyTypeGRWk09 + TotalBuyTypeGRWk10 + TotalBuyTypeGRWk11 +
            TotalBuyTypeGRWk12 + TotalBuyTypeGRWk13 + TotalBuyTypeGRWk14) / parseFloat(TotalGrossImpressions);

        TotalBuyTypeNR = parseFloat(TotalBuyTypeNRWk01 + TotalBuyTypeNRWk02 + TotalBuyTypeNRWk03 +
            TotalBuyTypeNRWk04 + TotalBuyTypeNRWk05 + TotalBuyTypeNRWk06 + TotalBuyTypeNRWk07 +
            TotalBuyTypeNRWk08 + TotalBuyTypeNRWk09 + TotalBuyTypeNRWk10 + TotalBuyTypeNRWk11 +
            TotalBuyTypeNRWk12 + TotalBuyTypeNRWk13 + TotalBuyTypeNRWk14) / parseFloat(TotalGrossImpressions);

        TotalBuyTypePDR = parseFloat(TotalBuyTypePDRWk01 + TotalBuyTypePDRWk02 + TotalBuyTypePDRWk03 +
            TotalBuyTypePDRWk04 + TotalBuyTypePDRWk05 + TotalBuyTypePDRWk06 + TotalBuyTypePDRWk07 +
            TotalBuyTypePDRWk08 + TotalBuyTypePDRWk09 + TotalBuyTypePDRWk10 + TotalBuyTypePDRWk11 +
            TotalBuyTypePDRWk12 + TotalBuyTypePDRWk13 + TotalBuyTypePDRWk14) / parseFloat(TotalGrossImpressions);

        TotalBuyTypePE = parseFloat(TotalBuyTypePEWk01 + TotalBuyTypePEWk02 + TotalBuyTypePEWk03 +
            TotalBuyTypePEWk04 + TotalBuyTypePEWk05 + TotalBuyTypePEWk06 + TotalBuyTypePEWk07 +
            TotalBuyTypePEWk08 + TotalBuyTypePEWk09 + TotalBuyTypePEWk10 + TotalBuyTypePEWk11 +
            TotalBuyTypePEWk12 + TotalBuyTypePEWk13 + TotalBuyTypePEWk14) / parseFloat(TotalGrossImpressions);

        TotalBuyTypeGPE = parseFloat(TotalBuyTypeGPEWk01 + TotalBuyTypeGPEWk02 + TotalBuyTypeGPEWk03 +
            TotalBuyTypeGPEWk04 + TotalBuyTypeGPEWk05 + TotalBuyTypeGPEWk06 + TotalBuyTypeGPEWk07 +
            TotalBuyTypeGPEWk08 + TotalBuyTypeGPEWk09 + TotalBuyTypeGPEWk10 + TotalBuyTypeGPEWk11 +
            TotalBuyTypeGPEWk12 + TotalBuyTypeGPEWk13 + TotalBuyTypeGPEWk14) / parseFloat(TotalGrossImpressions);

        TotalBuyTypeA = parseFloat(TotalBuyTypeAWk01 + TotalBuyTypeAWk02 + TotalBuyTypeAWk03 +
            TotalBuyTypeAWk04 + TotalBuyTypeAWk05 + TotalBuyTypeAWk06 + TotalBuyTypeAWk07 +
            TotalBuyTypeAWk08 + TotalBuyTypeAWk09 + TotalBuyTypeAWk10 + TotalBuyTypeAWk11 +
            TotalBuyTypeAWk12 + TotalBuyTypeAWk13 + TotalBuyTypeAWk14) / parseFloat(TotalGrossImpressions);

        TotalBuyTypeMG = parseFloat(TotalBuyTypeMGWk01 + TotalBuyTypeMGWk02 + TotalBuyTypeMGWk03 +
            TotalBuyTypeMGWk04 + TotalBuyTypeMGWk05 + TotalBuyTypeMGWk06 + TotalBuyTypeMGWk07 +
            TotalBuyTypeMGWk08 + TotalBuyTypeMGWk09 + TotalBuyTypeMGWk10 + TotalBuyTypeMGWk11 +
            TotalBuyTypeMGWk12 + TotalBuyTypeMGWk13 + TotalBuyTypeMGWk14) / parseFloat(TotalGrossImpressions);

        TotalBuyTypeM = parseFloat(TotalBuyTypeMWk01 + TotalBuyTypeMWk02 + TotalBuyTypeMWk03 +
            TotalBuyTypeMWk04 + TotalBuyTypeMWk05 + TotalBuyTypeMWk06 + TotalBuyTypeMWk07 +
            TotalBuyTypeMWk08 + TotalBuyTypeMWk09 + TotalBuyTypeMWk10 + TotalBuyTypeMWk11 +
            TotalBuyTypeMWk12 + TotalBuyTypeMWk13 + TotalBuyTypeMWk14) / parseFloat(TotalGrossImpressions);

        TotalBuyTypeB = parseFloat(TotalBuyTypeBWk01 + TotalBuyTypeBWk02 + TotalBuyTypeBWk03 +
            TotalBuyTypeBWk04 + TotalBuyTypeBWk05 + TotalBuyTypeBWk06 + TotalBuyTypeBWk07 +
            TotalBuyTypeBWk08 + TotalBuyTypeBWk09 + TotalBuyTypeBWk10 + TotalBuyTypeBWk11 +
            TotalBuyTypeBWk12 + TotalBuyTypeBWk13 + TotalBuyTypeBWk14) / parseFloat(TotalGrossImpressions);

        TotalBuyTypeUE = parseFloat(TotalBuyTypeUEWk01 + TotalBuyTypeUEWk02 + TotalBuyTypeUEWk03 +
            TotalBuyTypeUEWk04 + TotalBuyTypeUEWk05 + TotalBuyTypeUEWk06 + TotalBuyTypeUEWk07 +
            TotalBuyTypeUEWk08 + TotalBuyTypeUEWk09 + TotalBuyTypeUEWk10 + TotalBuyTypeUEWk11 +
            TotalBuyTypeUEWk12 + TotalBuyTypeUEWk13 + TotalBuyTypeUEWk14) / parseFloat(TotalGrossImpressions);

        TotalBuyTypeAD = parseFloat(TotalBuyTypeADWk01 + TotalBuyTypeADWk02 + TotalBuyTypeADWk03 +
            TotalBuyTypeADWk04 + TotalBuyTypeADWk05 + TotalBuyTypeADWk06 + TotalBuyTypeADWk07 +
            TotalBuyTypeADWk08 + TotalBuyTypeADWk09 + TotalBuyTypeADWk10 + TotalBuyTypeADWk11 +
            TotalBuyTypeADWk12 + TotalBuyTypeADWk13 + TotalBuyTypeADWk14) / parseFloat(TotalGrossImpressions);

        TotalBuyTypeNLV = parseFloat(TotalBuyTypeNLVWk01 + TotalBuyTypeNLVWk02 + TotalBuyTypeNLVWk03 +
            TotalBuyTypeNLVWk04 + TotalBuyTypeNLVWk05 + TotalBuyTypeNLVWk06 + TotalBuyTypeNLVWk07 +
            TotalBuyTypeNLVWk08 + TotalBuyTypeNLVWk09 + TotalBuyTypeNLVWk10 + TotalBuyTypeNLVWk11 +
            TotalBuyTypeNLVWk12 + TotalBuyTypeNLVWk13 + TotalBuyTypeNLVWk14) / parseFloat(TotalGrossImpressions);

        TotalBuyTypePM = parseFloat(TotalBuyTypePMWk01 + TotalBuyTypePMWk02 + TotalBuyTypePMWk03 +
            TotalBuyTypePMWk04 + TotalBuyTypePMWk05 + TotalBuyTypePMWk06 + TotalBuyTypePMWk07 +
            TotalBuyTypePMWk08 + TotalBuyTypePMWk09 + TotalBuyTypePMWk10 + TotalBuyTypePMWk11 +
            TotalBuyTypePMWk12 + TotalBuyTypePMWk13 + TotalBuyTypePMWk14) / parseFloat(TotalGrossImpressions);

        TotalGrossCPMWk01 = TotalGrossCPMWk01 + (TotalGrossImpressionsWk01 <= 0 ? 0 : TotalGrossDollarsWk01 / TotalGrossImpressionsWk01);
        TotalGrossCPMWk02 = TotalGrossCPMWk02 + (TotalGrossImpressionsWk02 <= 0 ? 0 : TotalGrossDollarsWk02 / TotalGrossImpressionsWk02);
        TotalGrossCPMWk03 = TotalGrossCPMWk03 + (TotalGrossImpressionsWk03 <= 0 ? 0 : TotalGrossDollarsWk03 / TotalGrossImpressionsWk03);
        TotalGrossCPMWk04 = TotalGrossCPMWk04 + (TotalGrossImpressionsWk04 <= 0 ? 0 : TotalGrossDollarsWk04 / TotalGrossImpressionsWk04);
        TotalGrossCPMWk05 = TotalGrossCPMWk05 + (TotalGrossImpressionsWk05 <= 0 ? 0 : TotalGrossDollarsWk05 / TotalGrossImpressionsWk05);
        TotalGrossCPMWk06 = TotalGrossCPMWk06 + (TotalGrossImpressionsWk06 <= 0 ? 0 : TotalGrossDollarsWk06 / TotalGrossImpressionsWk06);
        TotalGrossCPMWk07 = TotalGrossCPMWk07 + (TotalGrossImpressionsWk07 <= 0 ? 0 : TotalGrossDollarsWk07 / TotalGrossImpressionsWk07);
        TotalGrossCPMWk08 = TotalGrossCPMWk08 + (TotalGrossImpressionsWk08 <= 0 ? 0 : TotalGrossDollarsWk08 / TotalGrossImpressionsWk08);
        TotalGrossCPMWk09 = TotalGrossCPMWk09 + (TotalGrossImpressionsWk09 <= 0 ? 0 : TotalGrossDollarsWk09 / TotalGrossImpressionsWk09);
        TotalGrossCPMWk10 = TotalGrossCPMWk10 + (TotalGrossImpressionsWk10 <= 0 ? 0 : TotalGrossDollarsWk10 / TotalGrossImpressionsWk10);
        TotalGrossCPMWk11 = TotalGrossCPMWk11 + (TotalGrossImpressionsWk11 <= 0 ? 0 : TotalGrossDollarsWk11 / TotalGrossImpressionsWk11);
        TotalGrossCPMWk12 = TotalGrossCPMWk12 + (TotalGrossImpressionsWk12 <= 0 ? 0 : TotalGrossDollarsWk12 / TotalGrossImpressionsWk12);
        TotalGrossCPMWk13 = TotalGrossCPMWk13 + (TotalGrossImpressionsWk13 <= 0 ? 0 : TotalGrossDollarsWk13 / TotalGrossImpressionsWk13);
        TotalGrossCPMWk14 = TotalGrossCPMWk14 + (TotalGrossImpressionsWk14 <= 0 ? 0 : TotalGrossDollarsWk14 / TotalGrossImpressionsWk14);
        TotalGrossCPM = (TotalGrossImpressions <= 0 ? 0 : TotalGrossDollars / TotalGrossImpressions);

        TotalClientCPMWk01 = TotalClientCPMWk01 + (TotalGrossImpressionsWk01 <= 0 ? 0 : TotalClientDollarsWk01 / TotalGrossImpressionsWk01);
        TotalClientCPMWk02 = TotalClientCPMWk02 + (TotalGrossImpressionsWk02 <= 0 ? 0 : TotalClientDollarsWk02 / TotalGrossImpressionsWk02);
        TotalClientCPMWk03 = TotalClientCPMWk03 + (TotalGrossImpressionsWk03 <= 0 ? 0 : TotalClientDollarsWk03 / TotalGrossImpressionsWk03);
        TotalClientCPMWk04 = TotalClientCPMWk04 + (TotalGrossImpressionsWk04 <= 0 ? 0 : TotalClientDollarsWk04 / TotalGrossImpressionsWk04);
        TotalClientCPMWk05 = TotalClientCPMWk05 + (TotalGrossImpressionsWk05 <= 0 ? 0 : TotalClientDollarsWk05 / TotalGrossImpressionsWk05);
        TotalClientCPMWk06 = TotalClientCPMWk06 + (TotalGrossImpressionsWk06 <= 0 ? 0 : TotalClientDollarsWk06 / TotalGrossImpressionsWk06);
        TotalClientCPMWk07 = TotalClientCPMWk07 + (TotalGrossImpressionsWk07 <= 0 ? 0 : TotalClientDollarsWk07 / TotalGrossImpressionsWk07);
        TotalClientCPMWk08 = TotalClientCPMWk08 + (TotalGrossImpressionsWk08 <= 0 ? 0 : TotalClientDollarsWk08 / TotalGrossImpressionsWk08);
        TotalClientCPMWk09 = TotalClientCPMWk09 + (TotalGrossImpressionsWk09 <= 0 ? 0 : TotalClientDollarsWk09 / TotalGrossImpressionsWk09);
        TotalClientCPMWk10 = TotalClientCPMWk10 + (TotalGrossImpressionsWk10 <= 0 ? 0 : TotalClientDollarsWk10 / TotalGrossImpressionsWk10);
        TotalClientCPMWk11 = TotalClientCPMWk11 + (TotalGrossImpressionsWk11 <= 0 ? 0 : TotalClientDollarsWk11 / TotalGrossImpressionsWk11);
        TotalClientCPMWk12 = TotalClientCPMWk12 + (TotalGrossImpressionsWk12 <= 0 ? 0 : TotalClientDollarsWk12 / TotalGrossImpressionsWk12);
        TotalClientCPMWk13 = TotalClientCPMWk13 + (TotalGrossImpressionsWk13 <= 0 ? 0 : TotalClientDollarsWk13 / TotalGrossImpressionsWk13);
        TotalClientCPMWk14 = TotalClientCPMWk14 + (TotalGrossImpressionsWk14 <= 0 ? 0 : TotalClientDollarsWk14 / TotalGrossImpressionsWk14);
        TotalClientCPM = (TotalGrossImpressions <= 0 ? 0 : TotalClientDollars / TotalGrossImpressions);

        $("#TotalSpotsWk01").html(TotalSpotsWk01).show();
        $("#TotalGrossDollarsWk01").html(formatCurrency(TotalGrossDollarsWk01)).show();
        $("#TotalClientDollarsWk01").html(formatCurrency(TotalClientDollarsWk01)).show();
        $("#TotalGRPWk01").html(formatCurrency(TotalGRPWk01)).show();
        $("#TotalGrossImpressionsWk01").html(TotalGrossImpressionsWk01).show();
        $("#TotalGrossCPMWk01").html(formatCurrency(TotalGrossCPMWk01)).show();
        $("#TotalClientCPMWk01").html(formatCurrency(TotalClientCPMWk01)).show();
        $("#TotalGI15Wk01").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI15Wk01)).show();
        $("#TotalGI30Wk01").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI30Wk01)).show();
        $("#TotalGI60Wk01").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI60Wk01)).show();
        $("#TotalGI120Wk01").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI120Wk01)).show();
        $("#TotalDPMWk01").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPMWk01)).show();
        $("#TotalDPDWk01").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPDWk01)).show();
        $("#TotalDPFWk01").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPFWk01)).show();
        $("#TotalDPPWk01").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPPWk01)).show();
        $("#TotalDPLWk01").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPLWk01)).show();
        $("#TotalDPOWk01").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPOWk01)).show();
        $("#TotalDPWWk01").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPWWk01)).show();
        $("#TotalDPRWk01").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPRWk01)).show();
        $("#TotalBuyTypeUWk01").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeUWk01)).show();
        $("#TotalBuyTypeGPUWk01").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGPUWk01)).show();
        $("#TotalBuyTypeGRWk01").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGRWk01)).show();
        $("#TotalBuyTypeNRWk01").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeNRWk01)).show();
        $("#TotalBuyTypePDRWk01").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePDRWk01)).show();
        $("#TotalBuyTypePEWk01").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePEWk01)).show();
        $("#TotalBuyTypeGPEWk01").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGPEWk01)).show();
        $("#TotalBuyTypeAWk01").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeAWk01)).show();
        $("#TotalBuyTypeMGWk01").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeMGWk01)).show();
        $("#TotalBuyTypeMWk01").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeMWk01)).show();
        $("#TotalBuyTypeBWk01").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeBWk01)).show();
        $("#TotalBuyTypeUEWk01").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeUEWk01)).show();
        $("#TotalBuyTypeADWk01").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeADWk01)).show();
        $("#TotalBuyTypeNLVWk01").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeNLVWk01)).show();
        $("#TotalBuyTypePMWk01").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePMWk01)).show();

        $("#TotalSpotsWk02").html(TotalSpotsWk02).show();
        $("#TotalGrossDollarsWk02").html(formatCurrency(TotalGrossDollarsWk02)).show();
        $("#TotalClientDollarsWk02").html(formatCurrency(TotalClientDollarsWk02)).show();
        $("#TotalGRPWk02").html(formatCurrency(TotalGRPWk02)).show();
        $("#TotalGrossImpressionsWk02").html(TotalGrossImpressionsWk02).show();
        $("#TotalGrossCPMWk02").html(formatCurrency(TotalGrossCPMWk02)).show();
        $("#TotalClientCPMWk02").html(formatCurrency(TotalClientCPMWk02)).show();
        $("#TotalGI15Wk02").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI15Wk02)).show();
        $("#TotalGI30Wk02").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI30Wk02)).show();
        $("#TotalGI60Wk02").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI60Wk02)).show();
        $("#TotalGI120Wk02").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI120Wk02)).show();
        $("#TotalDPMWk02").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPMWk02)).show();
        $("#TotalDPDWk02").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPDWk02)).show();
        $("#TotalDPFWk02").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPFWk02)).show();
        $("#TotalDPPWk02").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPPWk02)).show();
        $("#TotalDPLWk02").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPLWk02)).show();
        $("#TotalDPOWk02").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPOWk02)).show();
        $("#TotalDPWWk02").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPWWk02)).show();
        $("#TotalDPRWk02").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPRWk02)).show();
        $("#TotalBuyTypeUWk02").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeUWk02)).show();
        $("#TotalBuyTypeGPUWk02").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGPUWk02)).show();
        $("#TotalBuyTypeGRWk02").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGRWk02)).show();
        $("#TotalBuyTypeNRWk02").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeNRWk02)).show();
        $("#TotalBuyTypePDRWk02").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePDRWk02)).show();
        $("#TotalBuyTypePEWk02").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePEWk02)).show();
        $("#TotalBuyTypeGPEWk02").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGPEWk02)).show();
        $("#TotalBuyTypeAWk02").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeAWk02)).show();
        $("#TotalBuyTypeMGWk02").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeMGWk02)).show();
        $("#TotalBuyTypeMWk02").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeMWk02)).show();
        $("#TotalBuyTypeBWk02").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeBWk02)).show();
        $("#TotalBuyTypeUEWk02").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeUEWk02)).show();
        $("#TotalBuyTypeADWk02").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeADWk02)).show();
        $("#TotalBuyTypeNLVWk02").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeNLVWk02)).show();
        $("#TotalBuyTypePMWk02").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePMWk02)).show();

        $("#TotalSpotsWk03").html(TotalSpotsWk03).show();
        $("#TotalGrossDollarsWk03").html(formatCurrency(TotalGrossDollarsWk03)).show();
        $("#TotalClientDollarsWk03").html(formatCurrency(TotalClientDollarsWk03)).show();
        $("#TotalGRPWk03").html(formatCurrency(TotalGRPWk03)).show();
        $("#TotalGrossImpressionsWk03").html(TotalGrossImpressionsWk03).show();
        $("#TotalGrossCPMWk03").html(formatCurrency(TotalGrossCPMWk03)).show();
        $("#TotalClientCPMWk03").html(formatCurrency(TotalClientCPMWk03)).show();
        $("#TotalGI15Wk03").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI15Wk03)).show();
        $("#TotalGI30Wk03").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI30Wk03)).show();
        $("#TotalGI60Wk03").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI60Wk03)).show();
        $("#TotalGI120Wk03").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI120Wk03)).show();
        $("#TotalDPMWk03").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPMWk03)).show();
        $("#TotalDPDWk03").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPDWk03)).show();
        $("#TotalDPFWk03").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPFWk03)).show();
        $("#TotalDPPWk03").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPPWk03)).show();
        $("#TotalDPLWk03").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPLWk03)).show();
        $("#TotalDPOWk03").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPOWk03)).show();
        $("#TotalDPWWk03").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPWWk03)).show();
        $("#TotalDPRWk03").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPRWk03)).show();
        $("#TotalBuyTypeUWk03").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeUWk03)).show();
        $("#TotalBuyTypeGPUWk03").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGPUWk03)).show();
        $("#TotalBuyTypeGRWk03").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGRWk03)).show();
        $("#TotalBuyTypeNRWk03").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeNRWk03)).show();
        $("#TotalBuyTypePDRWk03").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePDRWk03)).show();
        $("#TotalBuyTypePEWk03").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePEWk03)).show();
        $("#TotalBuyTypeGPEWk03").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGPEWk03)).show();
        $("#TotalBuyTypeAWk03").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeAWk03)).show();
        $("#TotalBuyTypeMGWk03").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeMGWk03)).show();
        $("#TotalBuyTypeMWk03").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeMWk03)).show();
        $("#TotalBuyTypeBWk03").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeBWk03)).show();
        $("#TotalBuyTypeUEWk03").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeUEWk03)).show();
        $("#TotalBuyTypeADWk03").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeADWk03)).show();
        $("#TotalBuyTypeNLVWk03").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeNLVWk03)).show();
        $("#TotalBuyTypePMWk03").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePMWk03)).show();

        $("#TotalSpotsWk04").html(TotalSpotsWk04).show();
        $("#TotalGrossDollarsWk04").html(formatCurrency(TotalGrossDollarsWk04)).show();
        $("#TotalClientDollarsWk04").html(formatCurrency(TotalClientDollarsWk04)).show();
        $("#TotalGRPWk04").html(formatCurrency(TotalGRPWk04)).show();
        $("#TotalGrossImpressionsWk04").html(TotalGrossImpressionsWk04).show();
        $("#TotalGrossCPMWk04").html(formatCurrency(TotalGrossCPMWk04)).show();
        $("#TotalClientCPMWk04").html(formatCurrency(TotalClientCPMWk04)).show();
        $("#TotalGI15Wk04").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI15Wk04)).show();
        $("#TotalGI30Wk04").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI30Wk04)).show();
        $("#TotalGI60Wk04").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI60Wk04)).show();
        $("#TotalGI120Wk04").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI120Wk04)).show();
        $("#TotalDPMWk04").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPMWk04)).show();
        $("#TotalDPDWk04").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPDWk04)).show();
        $("#TotalDPFWk04").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPFWk04)).show();
        $("#TotalDPPWk04").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPPWk04)).show();
        $("#TotalDPLWk04").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPLWk04)).show();
        $("#TotalDPOWk04").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPOWk04)).show();
        $("#TotalDPWWk04").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPWWk04)).show();
        $("#TotalDPRWk04").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPRWk04)).show();
        $("#TotalBuyTypeUWk04").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeUWk04)).show();
        $("#TotalBuyTypeGPUWk04").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGPUWk04)).show();
        $("#TotalBuyTypeGRWk04").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGRWk04)).show();
        $("#TotalBuyTypeNRWk04").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeNRWk04)).show();
        $("#TotalBuyTypePDRWk04").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePDRWk04)).show();
        $("#TotalBuyTypePEWk04").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePEWk04)).show();
        $("#TotalBuyTypeGPEWk04").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGPEWk04)).show();
        $("#TotalBuyTypeAWk04").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeAWk04)).show();
        $("#TotalBuyTypeMGWk04").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeMGWk04)).show();
        $("#TotalBuyTypeMWk04").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeMWk04)).show();
        $("#TotalBuyTypeBWk04").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeBWk04)).show();
        $("#TotalBuyTypeUEWk04").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeUEWk04)).show();
        $("#TotalBuyTypeADWk04").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeADWk04)).show();
        $("#TotalBuyTypeNLVWk04").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeNLVWk04)).show();
        $("#TotalBuyTypePMWk04").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePMWk04)).show();

        $("#TotalSpotsWk05").html(TotalSpotsWk05).show();
        $("#TotalGrossDollarsWk05").html(formatCurrency(TotalGrossDollarsWk05)).show();
        $("#TotalClientDollarsWk05").html(formatCurrency(TotalClientDollarsWk05)).show();
        $("#TotalGRPWk05").html(formatCurrency(TotalGRPWk05)).show();
        $("#TotalGrossImpressionsWk05").html(TotalGrossImpressionsWk05).show();
        $("#TotalGrossCPMWk05").html(formatCurrency(TotalGrossCPMWk05)).show();
        $("#TotalClientCPMWk05").html(formatCurrency(TotalClientCPMWk05)).show();
        $("#TotalGI15Wk05").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI15Wk05)).show();
        $("#TotalGI30Wk05").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI30Wk05)).show();
        $("#TotalGI60Wk05").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI60Wk05)).show();
        $("#TotalGI120Wk05").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI120Wk05)).show();
        $("#TotalDPMWk05").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPMWk05)).show();
        $("#TotalDPDWk05").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPDWk05)).show();
        $("#TotalDPFWk05").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPFWk05)).show();
        $("#TotalDPPWk05").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPPWk05)).show();
        $("#TotalDPLWk05").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPLWk05)).show();
        $("#TotalDPOWk05").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPOWk05)).show();
        $("#TotalDPWWk05").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPWWk05)).show();
        $("#TotalDPRWk05").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPRWk05)).show();
        $("#TotalBuyTypeUWk05").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeUWk05)).show();
        $("#TotalBuyTypeGPUWk05").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGPUWk05)).show();
        $("#TotalBuyTypeGRWk05").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGRWk05)).show();
        $("#TotalBuyTypeNRWk05").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeNRWk05)).show();
        $("#TotalBuyTypePDRWk05").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePDRWk05)).show();
        $("#TotalBuyTypePEWk05").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePEWk05)).show();
        $("#TotalBuyTypeGPEWk05").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGPEWk05)).show();
        $("#TotalBuyTypeAWk05").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeAWk05)).show();
        $("#TotalBuyTypeMGWk05").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeMGWk05)).show();
        $("#TotalBuyTypeMWk05").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeMWk05)).show();
        $("#TotalBuyTypeBWk05").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeBWk05)).show();
        $("#TotalBuyTypeUEWk05").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeUEWk05)).show();
        $("#TotalBuyTypeADWk05").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeADWk05)).show();
        $("#TotalBuyTypeNLVWk05").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeNLVWk05)).show();
        $("#TotalBuyTypePMWk05").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePMWk05)).show();

        $("#TotalSpotsWk06").html(TotalSpotsWk06).show();
        $("#TotalGrossDollarsWk06").html(formatCurrency(TotalGrossDollarsWk06)).show();
        $("#TotalClientDollarsWk06").html(formatCurrency(TotalClientDollarsWk06)).show();
        $("#TotalGRPWk06").html(formatCurrency(TotalGRPWk06)).show();
        $("#TotalGrossImpressionsWk06").html(TotalGrossImpressionsWk06).show();
        $("#TotalGrossCPMWk06").html(formatCurrency(TotalGrossCPMWk06)).show();
        $("#TotalClientCPMWk06").html(formatCurrency(TotalClientCPMWk06)).show();
        $("#TotalGI15Wk06").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI15Wk06)).show();
        $("#TotalGI30Wk06").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI30Wk06)).show();
        $("#TotalGI60Wk06").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI60Wk06)).show();
        $("#TotalGI120Wk06").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI120Wk06)).show();
        $("#TotalDPMWk06").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPMWk06)).show();
        $("#TotalDPDWk06").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPDWk06)).show();
        $("#TotalDPFWk06").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPFWk06)).show();
        $("#TotalDPPWk06").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPPWk06)).show();
        $("#TotalDPLWk06").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPLWk06)).show();
        $("#TotalDPOWk06").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPOWk06)).show();
        $("#TotalDPWWk06").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPWWk06)).show();
        $("#TotalDPRWk06").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPRWk06)).show();
        $("#TotalBuyTypeUWk06").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeUWk06)).show();
        $("#TotalBuyTypeGPUWk06").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGPUWk06)).show();
        $("#TotalBuyTypeGRWk06").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGRWk06)).show();
        $("#TotalBuyTypeNRWk06").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeNRWk06)).show();
        $("#TotalBuyTypePDRWk06").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePDRWk06)).show();
        $("#TotalBuyTypePEWk06").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePEWk06)).show();
        $("#TotalBuyTypeGPEWk06").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGPEWk06)).show();
        $("#TotalBuyTypeAWk06").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeAWk06)).show();
        $("#TotalBuyTypeMGWk06").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeMGWk06)).show();
        $("#TotalBuyTypeMWk06").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeMWk06)).show();
        $("#TotalBuyTypeBWk06").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeBWk06)).show();
        $("#TotalBuyTypeUEWk06").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeUEWk06)).show();
        $("#TotalBuyTypeADWk06").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeADWk06)).show();
        $("#TotalBuyTypeNLVWk06").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeNLVWk06)).show();
        $("#TotalBuyTypePMWk06").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePMWk06)).show();

        $("#TotalSpotsWk07").html(TotalSpotsWk07).show();
        $("#TotalGrossDollarsWk07").html(formatCurrency(TotalGrossDollarsWk07)).show();
        $("#TotalClientDollarsWk07").html(formatCurrency(TotalClientDollarsWk07)).show();
        $("#TotalGRPWk07").html(formatCurrency(TotalGRPWk07)).show();
        $("#TotalGrossImpressionsWk07").html(TotalGrossImpressionsWk07).show();
        $("#TotalGrossCPMWk07").html(formatCurrency(TotalGrossCPMWk07)).show();
        $("#TotalClientCPMWk07").html(formatCurrency(TotalClientCPMWk07)).show();
        $("#TotalGI15Wk07").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI15Wk07)).show();
        $("#TotalGI30Wk07").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI30Wk07)).show();
        $("#TotalGI60Wk07").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI60Wk07)).show();
        $("#TotalGI120Wk07").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI120Wk07)).show();
        $("#TotalDPMWk07").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPMWk07)).show();
        $("#TotalDPDWk07").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPDWk07)).show();
        $("#TotalDPFWk07").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPFWk07)).show();
        $("#TotalDPPWk07").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPPWk07)).show();
        $("#TotalDPLWk07").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPLWk07)).show();
        $("#TotalDPOWk07").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPOWk07)).show();
        $("#TotalDPWWk07").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPWWk07)).show();
        $("#TotalDPRWk07").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPRWk07)).show();
        $("#TotalBuyTypeUWk07").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeUWk07)).show();
        $("#TotalBuyTypeGPUWk07").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGPUWk07)).show();
        $("#TotalBuyTypeGRWk07").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGRWk07)).show();
        $("#TotalBuyTypeNRWk07").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeNRWk07)).show();
        $("#TotalBuyTypePDRWk07").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePDRWk07)).show();
        $("#TotalBuyTypePEWk07").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePEWk07)).show();
        $("#TotalBuyTypeGPEWk07").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGPEWk07)).show();
        $("#TotalBuyTypeAWk07").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeAWk07)).show();
        $("#TotalBuyTypeMGWk07").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeMGWk07)).show();
        $("#TotalBuyTypeMWk07").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeMWk07)).show();
        $("#TotalBuyTypeBWk07").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeBWk07)).show();
        $("#TotalBuyTypeUEWk07").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeUEWk07)).show();
        $("#TotalBuyTypeADWk07").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeADWk07)).show();
        $("#TotalBuyTypeNLVWk07").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeNLVWk07)).show();
        $("#TotalBuyTypePMWk07").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePMWk07)).show();

        $("#TotalSpotsWk08").html(TotalSpotsWk08).show();
        $("#TotalGrossDollarsWk08").html(formatCurrency(TotalGrossDollarsWk08)).show();
        $("#TotalClientDollarsWk08").html(formatCurrency(TotalClientDollarsWk08)).show();
        $("#TotalGRPWk08").html(formatCurrency(TotalGRPWk08)).show();
        $("#TotalGrossImpressionsWk08").html(TotalGrossImpressionsWk08).show();
        $("#TotalGrossCPMWk08").html(formatCurrency(TotalGrossCPMWk08)).show();
        $("#TotalClientCPMWk08").html(formatCurrency(TotalClientCPMWk08)).show();
        $("#TotalGI15Wk08").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI15Wk08)).show();
        $("#TotalGI30Wk08").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI30Wk08)).show();
        $("#TotalGI60Wk08").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI60Wk08)).show();
        $("#TotalGI120Wk08").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI120Wk08)).show();
        $("#TotalDPMWk08").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPMWk08)).show();
        $("#TotalDPDWk08").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPDWk08)).show();
        $("#TotalDPFWk08").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPFWk08)).show();
        $("#TotalDPPWk08").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPPWk08)).show();
        $("#TotalDPLWk08").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPLWk08)).show();
        $("#TotalDPOWk08").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPOWk08)).show();
        $("#TotalDPWWk08").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPWWk08)).show();
        $("#TotalDPRWk08").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPRWk08)).show();
        $("#TotalBuyTypeUWk08").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeUWk08)).show();
        $("#TotalBuyTypeGPUWk08").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGPUWk08)).show();
        $("#TotalBuyTypeGRWk08").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGRWk08)).show();
        $("#TotalBuyTypeNRWk08").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeNRWk08)).show();
        $("#TotalBuyTypePDRWk08").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePDRWk08)).show();
        $("#TotalBuyTypePEWk08").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePEWk08)).show();
        $("#TotalBuyTypeGPEWk08").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGPEWk08)).show();
        $("#TotalBuyTypeAWk08").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeAWk08)).show();
        $("#TotalBuyTypeMGWk08").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeMGWk08)).show();
        $("#TotalBuyTypeMWk08").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeMWk08)).show();
        $("#TotalBuyTypeBWk08").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeBWk08)).show();
        $("#TotalBuyTypeUEWk08").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeUEWk08)).show();
        $("#TotalBuyTypeADWk08").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeADWk08)).show();
        $("#TotalBuyTypeNLVWk08").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeNLVWk08)).show();
        $("#TotalBuyTypePMWk08").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePMWk08)).show();

        $("#TotalSpotsWk09").html(TotalSpotsWk09).show();
        $("#TotalGrossDollarsWk09").html(formatCurrency(TotalGrossDollarsWk09)).show();
        $("#TotalClientDollarsWk09").html(formatCurrency(TotalClientDollarsWk09)).show();
        $("#TotalGRPWk09").html(formatCurrency(TotalGRPWk09)).show();
        $("#TotalGrossImpressionsWk09").html(TotalGrossImpressionsWk09).show();
        $("#TotalGrossCPMWk09").html(formatCurrency(TotalGrossCPMWk09)).show();
        $("#TotalClientCPMWk09").html(formatCurrency(TotalClientCPMWk09)).show();
        $("#TotalGI15Wk09").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI15Wk09)).show();
        $("#TotalGI30Wk09").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI30Wk09)).show();
        $("#TotalGI60Wk09").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI60Wk09)).show();
        $("#TotalGI120Wk09").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI120Wk09)).show();
        $("#TotalDPMWk09").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPMWk09)).show();
        $("#TotalDPDWk09").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPDWk09)).show();
        $("#TotalDPFWk09").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPFWk09)).show();
        $("#TotalDPPWk09").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPPWk09)).show();
        $("#TotalDPLWk09").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPLWk09)).show();
        $("#TotalDPOWk09").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPOWk09)).show();
        $("#TotalDPWWk09").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPWWk09)).show();
        $("#TotalDPRWk09").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPRWk09)).show();
        $("#TotalBuyTypeUWk09").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeUWk09)).show();
        $("#TotalBuyTypeGPUWk09").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGPUWk09)).show();
        $("#TotalBuyTypeGRWk09").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGRWk09)).show();
        $("#TotalBuyTypeNRWk09").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeNRWk09)).show();
        $("#TotalBuyTypePDRWk09").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePDRWk09)).show();
        $("#TotalBuyTypePEWk09").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePEWk09)).show();
        $("#TotalBuyTypeGPEWk09").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGPEWk09)).show();
        $("#TotalBuyTypeAWk09").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeAWk09)).show();
        $("#TotalBuyTypeMGWk09").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeMGWk09)).show();
        $("#TotalBuyTypeMWk09").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeMWk09)).show();
        $("#TotalBuyTypeBWk09").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeBWk09)).show();
        $("#TotalBuyTypeUEWk09").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeUEWk09)).show();
        $("#TotalBuyTypeADWk09").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeADWk09)).show();
        $("#TotalBuyTypeNLVWk09").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeNLVWk09)).show();
        $("#TotalBuyTypePMWk09").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePMWk09)).show();

        $("#TotalSpotsWk10").html(TotalSpotsWk10).show();
        $("#TotalGrossDollarsWk10").html(formatCurrency(TotalGrossDollarsWk10)).show();
        $("#TotalClientDollarsWk10").html(formatCurrency(TotalClientDollarsWk10)).show();
        $("#TotalGRPWk10").html(formatCurrency(TotalGRPWk10)).show();
        $("#TotalGrossImpressionsWk10").html(TotalGrossImpressionsWk10).show();
        $("#TotalGrossCPMWk10").html(formatCurrency(TotalGrossCPMWk10)).show();
        $("#TotalClientCPMWk10").html(formatCurrency(TotalClientCPMWk10)).show();
        $("#TotalGI15Wk10").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI15Wk10)).show();
        $("#TotalGI30Wk10").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI30Wk10)).show();
        $("#TotalGI60Wk10").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI60Wk10)).show();
        $("#TotalGI120Wk10").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI120Wk10)).show();
        $("#TotalDPMWk10").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPMWk10)).show();
        $("#TotalDPDWk10").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPDWk10)).show();
        $("#TotalDPFWk10").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPFWk10)).show();
        $("#TotalDPPWk10").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPPWk10)).show();
        $("#TotalDPLWk10").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPLWk10)).show();
        $("#TotalDPOWk10").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPOWk10)).show();
        $("#TotalDPWWk10").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPWWk10)).show();
        $("#TotalDPRWk10").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPRWk10)).show();
        $("#TotalBuyTypeUWk10").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeUWk10)).show();
        $("#TotalBuyTypeGPUWk10").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGPUWk10)).show();
        $("#TotalBuyTypeGRWk10").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGRWk10)).show();
        $("#TotalBuyTypeNRWk10").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeNRWk10)).show();
        $("#TotalBuyTypePDRWk10").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePDRWk10)).show();
        $("#TotalBuyTypePEWk10").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePEWk10)).show();
        $("#TotalBuyTypeGPEWk10").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGPEWk10)).show();
        $("#TotalBuyTypeAWk10").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeAWk10)).show();
        $("#TotalBuyTypeMGWk10").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeMGWk10)).show();
        $("#TotalBuyTypeMWk10").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeMWk10)).show();
        $("#TotalBuyTypeBWk10").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeBWk10)).show();
        $("#TotalBuyTypeUEWk10").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeUEWk10)).show();
        $("#TotalBuyTypeADWk10").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeADWk10)).show();
        $("#TotalBuyTypeNLVWk10").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeNLVWk10)).show();
        $("#TotalBuyTypePMWk10").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePMWk10)).show();

        $("#TotalSpotsWk11").html(TotalSpotsWk11).show();
        $("#TotalGrossDollarsWk11").html(formatCurrency(TotalGrossDollarsWk11)).show();
        $("#TotalClientDollarsWk11").html(formatCurrency(TotalClientDollarsWk11)).show();
        $("#TotalGRPWk11").html(formatCurrency(TotalGRPWk11)).show();
        $("#TotalGrossImpressionsWk11").html(TotalGrossImpressionsWk11).show();
        $("#TotalGrossCPMWk11").html(formatCurrency(TotalGrossCPMWk11)).show();
        $("#TotalClientCPMWk11").html(formatCurrency(TotalClientCPMWk11)).show();
        $("#TotalGI15Wk11").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI15Wk11)).show();
        $("#TotalGI30Wk11").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI30Wk11)).show();
        $("#TotalGI60Wk11").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI60Wk11)).show();
        $("#TotalGI120Wk11").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI120Wk11)).show();
        $("#TotalDPMWk11").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPMWk11)).show();
        $("#TotalDPDWk11").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPDWk11)).show();
        $("#TotalDPFWk11").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPFWk11)).show();
        $("#TotalDPPWk11").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPPWk11)).show();
        $("#TotalDPLWk11").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPLWk11)).show();
        $("#TotalDPOWk11").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPOWk11)).show();
        $("#TotalDPWWk11").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPWWk11)).show();
        $("#TotalDPRWk11").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPRWk11)).show();
        $("#TotalBuyTypeUWk11").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeUWk11)).show();
        $("#TotalBuyTypeGPUWk11").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGPUWk11)).show();
        $("#TotalBuyTypeGRWk11").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGRWk11)).show();
        $("#TotalBuyTypeNRWk11").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeNRWk11)).show();
        $("#TotalBuyTypePDRWk11").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePDRWk11)).show();
        $("#TotalBuyTypePEWk11").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePEWk11)).show();
        $("#TotalBuyTypeGPEWk11").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGPEWk11)).show();
        $("#TotalBuyTypeAWk11").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeAWk11)).show();
        $("#TotalBuyTypeMGWk11").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeMGWk11)).show();
        $("#TotalBuyTypeMWk11").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeMWk11)).show();
        $("#TotalBuyTypeBWk11").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeBWk11)).show();
        $("#TotalBuyTypeUEWk11").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeUEWk11)).show();
        $("#TotalBuyTypeADWk11").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeADWk11)).show();
        $("#TotalBuyTypeNLVWk11").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeNLVWk11)).show();
        $("#TotalBuyTypePMWk11").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePMWk11)).show();

        $("#TotalSpotsWk12").html(TotalSpotsWk12).show();
        $("#TotalGrossDollarsWk12").html(formatCurrency(TotalGrossDollarsWk12)).show();
        $("#TotalClientDollarsWk12").html(formatCurrency(TotalClientDollarsWk12)).show();
        $("#TotalGRPWk12").html(formatCurrency(TotalGRPWk12)).show();
        $("#TotalGrossImpressionsWk12").html(TotalGrossImpressionsWk12).show();
        $("#TotalGrossCPMWk12").html(formatCurrency(TotalGrossCPMWk12)).show();
        $("#TotalClientCPMWk12").html(formatCurrency(TotalClientCPMWk12)).show();
        $("#TotalGI15Wk12").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI15Wk12)).show();
        $("#TotalGI30Wk12").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI30Wk12)).show();
        $("#TotalGI60Wk12").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI60Wk12)).show();
        $("#TotalGI120Wk12").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI120Wk12)).show();
        $("#TotalDPMWk12").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPMWk12)).show();
        $("#TotalDPDWk12").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPDWk12)).show();
        $("#TotalDPFWk12").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPFWk12)).show();
        $("#TotalDPPWk12").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPPWk12)).show();
        $("#TotalDPLWk12").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPLWk12)).show();
        $("#TotalDPOWk12").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPOWk12)).show();
        $("#TotalDPWWk12").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPWWk12)).show();
        $("#TotalDPRWk12").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPRWk12)).show();
        $("#TotalBuyTypeUWk12").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeUWk12)).show();
        $("#TotalBuyTypeGPUWk12").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGPUWk12)).show();
        $("#TotalBuyTypeGRWk12").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGRWk12)).show();
        $("#TotalBuyTypeNRWk12").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeNRWk12)).show();
        $("#TotalBuyTypePDRWk12").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePDRWk12)).show();
        $("#TotalBuyTypePEWk12").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePEWk12)).show();
        $("#TotalBuyTypeGPEWk12").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGPEWk12)).show();
        $("#TotalBuyTypeAWk12").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeAWk12)).show();
        $("#TotalBuyTypeMGWk12").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeMGWk12)).show();
        $("#TotalBuyTypeMWk12").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeMWk12)).show();
        $("#TotalBuyTypeBWk12").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeBWk12)).show();
        $("#TotalBuyTypeUEWk12").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeUEWk12)).show();
        $("#TotalBuyTypeADWk12").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeADWk12)).show();
        $("#TotalBuyTypeNLVWk12").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeNLVWk12)).show();
        $("#TotalBuyTypePMWk12").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePMWk12)).show();

        $("#TotalSpotsWk13").html(TotalSpotsWk13).show();
        $("#TotalGrossDollarsWk13").html(formatCurrency(TotalGrossDollarsWk13)).show();
        $("#TotalClientDollarsWk13").html(formatCurrency(TotalClientDollarsWk13)).show();
        $("#TotalGRPWk13").html(formatCurrency(TotalGRPWk13)).show();
        $("#TotalGrossImpressionsWk13").html(TotalGrossImpressionsWk13).show();
        $("#TotalGrossCPMWk13").html(formatCurrency(TotalGrossCPMWk13)).show();
        $("#TotalClientCPMWk13").html(formatCurrency(TotalClientCPMWk13)).show();
        $("#TotalGI15Wk13").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI15Wk13)).show();
        $("#TotalGI30Wk13").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI30Wk13)).show();
        $("#TotalGI60Wk13").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI60Wk13)).show();
        $("#TotalGI120Wk13").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI120Wk13)).show();
        $("#TotalDPMWk13").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPMWk13)).show();
        $("#TotalDPDWk13").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPDWk13)).show();
        $("#TotalDPFWk13").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPFWk13)).show();
        $("#TotalDPPWk13").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPPWk13)).show();
        $("#TotalDPLWk13").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPLWk13)).show();
        $("#TotalDPOWk13").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPOWk13)).show();
        $("#TotalDPWWk13").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPWWk13)).show();
        $("#TotalDPRWk13").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPRWk13)).show();
        $("#TotalBuyTypeUWk13").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeUWk13)).show();
        $("#TotalBuyTypeGPUWk13").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGPUWk13)).show();
        $("#TotalBuyTypeGRWk13").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGRWk13)).show();
        $("#TotalBuyTypeNRWk13").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeNRWk13)).show();
        $("#TotalBuyTypePDRWk13").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePDRWk13)).show();
        $("#TotalBuyTypePEWk13").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePEWk13)).show();
        $("#TotalBuyTypeGPEWk13").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGPEWk13)).show();
        $("#TotalBuyTypeAWk13").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeAWk13)).show();
        $("#TotalBuyTypeMGWk13").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeMGWk13)).show();
        $("#TotalBuyTypeMWk13").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeMWk13)).show();
        $("#TotalBuyTypeBWk13").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeBWk13)).show();
        $("#TotalBuyTypeUEWk13").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeUEWk13)).show();
        $("#TotalBuyTypeADWk13").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeADWk13)).show();
        $("#TotalBuyTypeNLVWk13").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeNLVWk13)).show();
        $("#TotalBuyTypePMWk13").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePMWk13)).show();

        $("#TotalSpotsWk14").html(TotalSpotsWk14).show();
        $("#TotalGrossDollarsWk14").html(formatCurrency(TotalGrossDollarsWk14)).show();
        $("#TotalClientDollarsWk14").html(formatCurrency(TotalClientDollarsWk14)).show();
        $("#TotalGRPWk14").html(formatCurrency(TotalGRPWk14)).show();
        $("#TotalGrossImpressionsWk14").html(TotalGrossImpressionsWk14).show();
        $("#TotalGrossCPMWk14").html(formatCurrency(TotalGrossCPMWk14)).show();
        $("#TotalClientCPMWk14").html(formatCurrency(TotalClientCPMWk14)).show();
        $("#TotalGI15Wk14").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI15Wk14)).show();
        $("#TotalGI30Wk14").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI30Wk14)).show();
        $("#TotalGI60Wk14").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI60Wk14)).show();
        $("#TotalGI120Wk14").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI120Wk14)).show();
        $("#TotalDPMWk14").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPMWk14)).show();
        $("#TotalDPDWk14").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPDWk14)).show();
        $("#TotalDPFWk14").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPFWk14)).show();
        $("#TotalDPPWk14").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPPWk14)).show();
        $("#TotalDPLWk14").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPLWk14)).show();
        $("#TotalDPOWk14").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPOWk14)).show();
        $("#TotalDPWWk14").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPWWk14)).show();
        $("#TotalDPRWk14").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPRWk14)).show();
        $("#TotalBuyTypeUWk14").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeUWk14)).show();
        $("#TotalBuyTypeGPUWk14").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGPUWk14)).show();
        $("#TotalBuyTypeGRWk14").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGRWk14)).show();
        $("#TotalBuyTypeNRWk14").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeNRWk14)).show();
        $("#TotalBuyTypePDRWk14").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePDRWk14)).show();
        $("#TotalBuyTypePEWk14").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePEWk14)).show();
        $("#TotalBuyTypeGPEWk14").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGPEWk14)).show();
        $("#TotalBuyTypeAWk14").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeAWk14)).show();
        $("#TotalBuyTypeMGWk14").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeMGWk14)).show();
        $("#TotalBuyTypeMWk14").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeMWk14)).show();
        $("#TotalBuyTypeBWk14").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeBWk14)).show();
        $("#TotalBuyTypeUEWk14").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeUEWk14)).show();
        $("#TotalBuyTypeADWk14").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeADWk14)).show();
        $("#TotalBuyTypeNLVWk14").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeNLVWk14)).show();
        $("#TotalBuyTypePMWk14").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePMWk14)).show();


        $("#TotalSpots").html(TotalSpots).show();
        $("#TotalGrossDollars").html(formatCurrency(TotalGrossDollars)).show();
        $("#TotalClientDollars").html(formatCurrency(TotalClientDollars)).show();
        $("#TotalGRP").html(formatCurrency(TotalGRP)).show();
        $("#TotalGrossImpressions").html(TotalGrossImpressions).show();
        $("#TotalGrossCPM").html(formatCurrency(TotalGrossCPM)).show();
        $("#TotalClientCPM").html(formatCurrency(TotalClientCPM)).show();
        $("#TotalGI15").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI15)).show();
        $("#TotalGI30").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI30)).show();
        $("#TotalGI60").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI60)).show();
        $("#TotalGI120").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalGI120)).show();
        $("#TotalDPM").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPM)).show();
        $("#TotalDPD").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPD)).show();
        $("#TotalDPF").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPF)).show();
        $("#TotalDPP").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPP)).show();
        $("#TotalDPL").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPL)).show();
        $("#TotalDPO").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPO)).show();
        $("#TotalDPW").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPW)).show();
        $("#TotalDPR").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalDPR)).show();
        $("#TotalBuyTypeU").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeU)).show();
        $("#TotalBuyTypeGPU").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGPU)).show();
        $("#TotalBuyTypeGR").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGR)).show();
        $("#TotalBuyTypeNR").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeNR)).show();
        $("#TotalBuyTypePDR").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePDR)).show();
        $("#TotalBuyTypePE").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePE)).show();
        $("#TotalBuyTypeGPE").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeGPE)).show();
        $("#TotalBuyTypeA").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeA)).show();
        $("#TotalBuyTypeMG").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeMG)).show();
        $("#TotalBuyTypeM").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeM)).show();
        $("#TotalBuyTypeB").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeB)).show();
        $("#TotalBuyTypeUE").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeUE)).show();
        $("#TotalBuyTypeAD").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeAD)).show();
        $("#TotalBuyTypeNLV").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypeNLV)).show();
        $("#TotalBuyTypePM").html(new Intl.NumberFormat("en", { style: "percent" }).format(TotalBuyTypePM)).show();
    }


    CalculateTotals(proptable);

    /* Hide CanadaOnly columns */
    /*
    var elem = $('#ProposalTable th');
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
                var column = proptable.column([elem.index(this)]);
                column.visible(false);
            }
        }
    });
    */
    proptable.columns.adjust().draw();
});

function ReloadCalculator() {
    //var date = new Date();
    //var random = Math.floor(Math.random() * 1000) + 1 + date.getMilliseconds();
    //alert("reload");
    //$("#ProposalCalculatorTable").load("/ManageMedia/ReloadDataTable?proposalid=" + getParameterByName('proposalid') + "&ViewOnly=false&type=1&r=" + random);
}
