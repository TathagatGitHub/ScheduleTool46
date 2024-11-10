$(document).ready(function () {

    /*
     * Capturing changes in the row
     */
    $('select.red-if-changed').change(function () {
        setChangeDropDown($(this));
    });

    $('input.red-if-changed').change(function () {
        setChangeInput($(this));
    });

    $('label.css-checkbox').click(function () {
        setChangeCheckBox($(this));
    });

    $('select.CellDoNotBuyType').change(function () {
        setClientMandate($(this));
    });

    $(".checkbox-select").change(function () {
    });

    $(".editableBoxStart").change(function () {
        $(".timeTextBoxStart").val($(".editableBoxStart option:selected").html());
    });

    $(".editableBoxEnd").change(function () {
        $(".timeTextBoxEnd").val($(".editableBoxEnd option:selected").html());
    });

    /*
     *  Stop event propagation on each cell of row clicked
     */
    var table = document.getElementById("UpfrontTable");
    if (table != null) {
        for (var i = 0; i < table.rows.length; i++) {
            for (var j = 0; j < table.rows[i].cells.length; j++)
                table.rows[i].cells[j].onclick = function () {
                    event.stopPropagation();
                };
        }
    }

    function tableText(tableCell) {
        //alert(tableCell.innerHTML);
    }

    /*
    $('#UpfrontTable tbody').on('click', 'tr', function () {
        // When the row is clicked, then we want the entire row selected
        $(this).toggleClass('selected');

        // Next, the selection chekckbox.   This is preferred over event.target.type === 'checkbox'
        // to avoid responding to other checkboxes in the row.
        var id = $(event.target).attr('id');
        if (id) {
            var res = id.split('-');
            if (res.length > 0) {
                //if (res[0] === 'chkSelect') {
                $(this).toggleClass('selected');
                //}
            }
        }
    });
    */

    $("#chkMon").click(function () {

    });

    $('#btnApprove').click(function () {
        var ConfirmQuestionText = '';
        var CountApprove = 0;
        var CountUnapprove = 0;

        $("#UpfrontTable tr:has(:input)").each(function () {
            $('td:eq(0)', this).each(function () {
                var id = $(this).find(":input").attr('id');
                var res = id.split('-');
                var _UpfrontLineId = $(this).find(":input").attr('UpfrontLineId');
                var _Approved = $(this).find(":input").attr('Approved');
                if (res[0] === 'chkSelect' &&
                    $(this).find(":input").is(':checked')) {
                    if (_Approved === '1') {
                        CountUnapprove = CountUnapprove + 1;
                    }
                    else {
                        CountApprove = CountApprove + 1;
                    }
                }

                if (CountApprove == 0) {
                    ConfirmQuestionText = 'No unapproved properties selected.';
                    swal('Stop', ConfirmQuestionText, 'danger');
                }
                else if (CountApprove == 1) {
                    ConfirmQuestionText = CountApprove + ' property will be approved.';
                }
                else {
                    ConfirmQuestionText = CountApprove + ' properties will be approved.';
                }
            });
        });

        if (CountApprove == 0) {
            return;
        }

        if (CountUnapprove > 0) {
            ConfirmQuestionText = ConfirmQuestionText + '  There are currently some approved properties selected.  These rows will be ignored.';
        }

        ConfirmQuestionText = ConfirmQuestionText + '  Are you sure you want to proceed?'
        swal({
            title: $(this).attr('UpfrontName'),
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
                $("#UpfrontTable tr:has(:input)").each(function () {
                    $('td:eq(0)', this).each(function () {
                        var id = $(this).find(":input").attr('id');
                        var res = id.split('-');
                        var _UpfrontLineId = $(this).find(":input").attr('UpfrontLineId');
                        var _Approved = $(this).find(":input").attr('Approved');
                        if (_Approved == '0' &&
                            res[0] === 'chkSelect' &&
                            $(this).find(":input").is(':checked')) {
                            // Approve the UpfrontLine
                            Approve(_UpfrontLineId, true);

                            /*
                            // Set Approved Attribute
                            $(this).find(":input").attr('Approved', '1');

                            // unselect row
                            $(this).find(":input").prop("checked", false);
                            $(this).find(":input").closest('tr').removeClass('selected');

                            // Change approve class
                            $(this).find(":input").closest('tr').each(function () {
                                $('td', this).each(function () {
                                    $(this).removeClass('upfront-notapproved');
                                    $(this).addClass('upfront-approved');

                                    // Change Approve Image
                                    $('#ApproveImage-' + _UpfrontLineId).removeClass('fa-check-circle');
                                    $('#ApproveImage-' + _UpfrontLineId).removeClass('fa-times-circle');
                                    $('#ApproveImage-' + _UpfrontLineId).addClass('fa-check-circle');
                                });
                            });
                            */
                        }

                    });
                });

                $('#btnApprove').attr('disabled', 'disabled');

                // window.location.reload();

                ReloadPage();

            }, function (dismiss) {
                // dismiss can be 'cancel', 'overlay', 'esc' or 'timer'
                swal("Note", "No properties approved.", "warning");
            });
    });

    $('#btnUnapprove').click(function () {
        var ConfirmQuestionText = '';
        var CountApprove = 0;
        var CountUnapprove = 0;

        $("#UpfrontTable tr:has(:input)").each(function () {
            $('td:eq(0)', this).each(function () {
                var id = $(this).find(":input").attr('id');
                var res = id.split('-');
                var _UpfrontLineId = $(this).find(":input").attr('UpfrontLineId');
                var _Approved = $(this).find(":input").attr('Approved');
                if (res[0] === 'chkSelect' &&
                    $(this).find(":input").is(':checked')) {
                    if (_Approved === '1') {
                        CountUnapprove = CountUnapprove + 1;
                    }
                    else {
                        CountApprove = CountApprove + 1;
                    }
                }

                if (CountUnapprove == 0) {
                    ConfirmQuestionText = 'No properties selected that can be unapproved.';
                    swal('Stop', ConfirmQuestionText, 'danger');
                }
                else if (CountUnapprove == 1) {
                    ConfirmQuestionText = CountUnapprove + ' property will be unapproved.';
                }
                else {
                    ConfirmQuestionText = CountUnapprove + ' properties will be unapproved.';
                }
            });
        });

        if (CountUnapprove == 0) {
            return;
        }

        if (CountApprove > 0) {
            ConfirmQuestionText = ConfirmQuestionText + '  There are currently some properties not approved that are selected.  These rows will be ignored.';
        }

        ConfirmQuestionText = ConfirmQuestionText + '  Are you sure you want to proceed?'
        swal({
            title: $(this).attr('UpfrontName'),
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
                $("#UpfrontTable tr:has(:input)").each(function () {
                    $('td:eq(0)', this).each(function () {
                        var id = $(this).find(":input").attr('id');
                        var res = id.split('-');
                        var _UpfrontLineId = $(this).find(":input").attr('UpfrontLineId');
                        var _Approved = $(this).find(":input").attr('Approved');
                        if (_Approved == '1' &&
                            res[0] === 'chkSelect' &&
                            $(this).find(":input").is(':checked')) {
                            // Unapprove the UpfrontLine
                            Approve(_UpfrontLineId, false);

                            /*

                            // Set Approved Attribute
                            $(this).find(":input").attr('Approved', '0');

                            // unselect row
                            $(this).find(":input").prop("checked", false);
                            $(this).find(":input").closest('tr').removeClass('selected');

                            // Change approve class
                            $(this).find(":input").closest('tr').each(function () {
                                $('td', this).each(function () {
                                    $(this).removeClass('upfront-approved');
                                    $(this).addClass('upfront-notapproved');

                                    // Change Approve Image
                                    $('#ApproveImage-' + _UpfrontLineId).removeClass('fa-check-circle');
                                    $('#ApproveImage-' + _UpfrontLineId).removeClass('fa-times-circle');
                                    $('#ApproveImage-' + _UpfrontLineId).addClass('fa-times-circle');
                                });
                            });
                            */

                        }

                    });
                });

                $('#btnUnapprove').attr('disabled', 'disabled');

                // window.location.reload();

                ReloadPage();

            }, function (dismiss) {
                // dismiss can be 'cancel', 'overlay', 'esc' or 'timer'
                swal("Note", "No properties approved.", "warning");
            });
    });

    $('#btnDelete').click(function () {
        $("#UpfrontTable tr:has(:input)").each(function () {
            $('td:eq(0)', this).each(function () {
                var id = $(this).find(":input").attr('id');
                var res = id.split('-');
                var _UpfrontLineId = $(this).find(":input").attr('UpfrontLineId');
                if (res[0] === 'chkSelect' &&
                    $(this).find(":input").is(':checked')) {
                    $('#txtUpfrontLineId').val(_UpfrontLineId);
                    PopulateDelete(_UpfrontLineId);
                    try {
                        $('#modal-deleteupfrontline').modal();
                    }
                    catch (err) 
                    {
                        window.location.reload();
                    }
                }
            });
        });
    });

    $('#btnRevisedEstimates').click(function () {
        var _upfrontid = GetParameterValues('upfrontid');
        try {
            PopulateReviseEstimate(_upfrontid);
        }
        catch (err) {
            swal("Wait", err, "warning");
        }

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

    $('#btnDRRateRevision').click(function () {
        var _upfrontid = GetParameterValues('upfrontid');
        try {
            PopulateRateRevision(_upfrontid);
        }
        catch (err) {
            swal("Wait", err, "warning");
        }

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

    $('#btnUpdateDealPointData').click(function () {
        var Country = $(this).attr('Country');
        var NetworkName = $(this).attr('NetworkName');
        if (Country == 'CA') {
            swal({
                text: 'Select your media type to DEAL POINT edits:',
                type: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                input: 'radio',
                inputOptions: {
                    'National Upfront/Scatter': 'National Upfront/Scatter',
                    'DR': 'DR',
                },

                // validator is optional
                inputValidator: function (result) {
                    return new Promise(function (resolve, reject) {
                        if (result) {
                            resolve();
                        } else {
                            reject('You need to select something!');
                        }
                    });
                }
            }).then(function (result) {
                if (result) {
                    if (result == 'National Upfront/Scatter') {
                        // Launch the Deal
                        var FineLine3 = 'Not withstanding anything herein or elsewhere contained to the company, ';
                        FineLine3 = FineLine3 + '<strong>' + NetworkName + '</strong>';
                        FineLine3 = FineLine3 + ' acknowledges that Ocean Media is an agent for a disclosed principal and, accordingly, has no liability to ';
                        FineLine3 = FineLine3 + '<strong>' + NetworkName + '</strong>';
                        FineLine3 = FineLine3 + ' unless and until said principal has paid Ocean Media. ';

                        LoadUpfrontDeal($(this).attr('NetworkId'), $(this).attr('PlanYr'), 'UP');

                        $('#lblFineLine3').html(FineLine3);
                        $('#modal-upfrontdeal').modal();
                    }
                    else {
                        // Launch the Deal
                        var FineLineCA = 'Not withstanding anything herein or elsewhere contained to the company, ';
                        FineLineCA = FineLineCA + '<strong>' + NetworkName + '</strong>';
                        FineLineCA = FineLineCA + ' acknowledges that Ocean Media is an agent for a disclosed principal and, accordingly, has no liability to ';
                        FineLineCA = FineLineCA + '<strong>' + NetworkName + '</strong>';
                        FineLineCA = FineLineCA + ' unless and until said principal has paid Ocean Media. ';

                        LoadUpfrontDealCA($(this).attr('NetworkId'), $(this).attr('PlanYr'), 'DR');

                        $('#lblFineLineCA').html(FineLineCA);
                        $('#modal-upfrontdealca').modal();

                    }
                }
            })
        }
        else {
            // Launch the Deal
            var FineLine3 = 'Not withstanding anything herein or elsewhere contained to the company, ';
            FineLine3 = FineLine3 + '<strong>' + $(this).attr('NetworkName') + '</strong>';
            FineLine3 = FineLine3 + ' acknowledges that Ocean Media is an agent for a disclosed principal and, accordingly, has no liability to ';
            FineLine3 = FineLine3 + '<strong>' + $(this).attr('NetworkName') + '</strong>';
            FineLine3 = FineLine3 + ' unless and until said principal has paid Ocean Media. ';

            LoadUpfrontDeal($(this).attr('NetworkId'), $(this).attr('PlanYr'), 'UP');

            $('#lblFineLine3').html(FineLine3);
            $('#modal-upfrontdeal').modal();
        }
    });


    $('#btnSaveUpfrontDeal').click(function () {
        // Save the cancellation policies
        SaveUpfrontDeal(
            $('#btnUpdateDealPointData').attr('NetworkId'),
            $('#btnUpdateDealPointData').attr('PlanYr'),
            'UP',
            $('#txtBillboardAddedValue').val(),
            $('#txtUpfrontSponsorship').val(),
            $('#txtUpfrontCancellation').val(),
            $('#txtScatterCancellation').val(),
            $('#txtNetworkSeparation').val()
        );
    });

    $('#btnAutoApprove').click(function () {
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
                swal("Auto-Approve", "More QA", "warning");
            }, function (dismiss) {
                // dismiss can be 'cancel', 'overlay', 'esc' or 'timer'
                swal("Auto-Approve", "No properties approved.", "warning");
            });
    });

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
        var bt = '&bt=';
        for (var i = 0; i < chkBuyType.length; i++) {
            if (chkBuyType[i].checked) {
                bt = bt + chkBuyType[i].value + ',';
                // alert(chkBuyType[i].value);
                // checkboxesChecked.push(chkBuyType[i]);
            }
        }

        var chkDemos = document.getElementsByName('demonames');
        var chkDemosChecked = [];
        var de = '&de=';
        for (var i2 = 0; i2 < chkDemos.length; i2++) {
            if (chkDemos[i2].checked) {
                de = de + chkDemos[i2].value + ',';
                // alert(chkBuyType[i].value);
                // checkboxesChecked.push(chkBuyType[i]);
            }
        }

        var popupExport = window.open('/ManageMedia/UpfrontReport?UpfrontId=' + _upfrontid + '&DR=UP' + bt + de, 'export_window', params);
        popupExport.moveTo(0, 0);

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

    function cbDropdown(column) {
        return $('<ul>', {
            'class': 'cb-dropdown'
        }).appendTo($('<div>', {
            'class': 'cb-dropdown-wrap'
        }).appendTo(column));
    }

    var upfronttable = $('#UpfrontTable').DataTable({
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
        stateSave: false,
        responsive: false,
        dom: 'Bfrtp',
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


                //added class "mymsel"
                /*
                var select = $('<select class="form-control form-control-sm mymsel" multiple="multiple"><option></option></select>')
                    .appendTo($(column.footer()).empty())
                    .on('change', function () {
                        var vals = $('option:selected', this).map(function (index, element) {
                            var data = $("<div/>").html($(element).val()).text();
                            return $.fn.dataTable.util.escapeRegex(data);
                        }).toArray().join('|');

                        column
                            .search(vals.length > 0 ? '^(' + vals + ')$' : '', true, false)
                            .draw();
                    });

                column.data().unique().sort().each(function (d, j) {
                    // Let's not add the rows with dropdowns in the selection.  This causes them to be auto-selected in the multiselect dropdown.
                    var data = $("<div/>").html(d).text();
                    if (d.toLowerCase().indexOf("<select") < 0 && data != "") {
                        select.append('<option value="' + data + '">' + data + '</option>');
                    }
                });
            */
            //select2 init for .mymsel class
            //$(".mymsel").select2();
        },
        columnDefs: [
            {
                targets: 3,
                render: $.fn.dataTable.render.ellipsis(50, true)
            }
        ],
        buttons: []

    });


    upfronttable.columns.adjust().draw();
    setTimeout(
        function () {
            ResizeMainTable();
        }, 2000);


});



function stripHTML(dirtyString) {
    var container = document.createElement('span');
    var text = document.createTextNode(dirtyString);
    container.appendChild(text);
    return container.innerHTML; // innerHTML will be a xss safe string
}


function setChangeInput(CellTextBox) {
    var ignoreChange = false;
    var UpfrontLineId = CellTextBox.attr("UpfrontLineId");

    if (CellTextBox.attr('type') == 'text') {
        if (CellTextBox.val() == '' ||
            (CellTextBox.val() == CellTextBox.attr("placeholder"))) {
            CellTextBox.parent().removeClass('upfront-change');
            CellTextBox.removeClass('upfront-change');
        }
        else {
            CellTextBox.parent().addClass('upfront-change');
            CellTextBox.addClass('upfront-change');
            $("[name=chkSelect-" + UpfrontLineId + "]").prop("checked", true);
        }

        // Specific to Rates
        CalculateCPM(UpfrontLineId);

    }

    else if (CellTextBox.attr('type') == 'checkbox') {
        var value = CellTextBox.attr('id');
        var res = value.split('-');
        var origvalstr = res[2];

        var origval = false;
        if (origvalstr == '1') {
            origval = true;
        }

        if (res[0] == 'chkApproved') {
            ignoreChange = true;
        }

        if (CellTextBox.is(':checked') == origval) {
            CellTextBox.removeClass('upfront-change');
            CellTextBox.parent().removeClass('upfront-change');
            CellTextBox.parent().parent().removeClass('upfront-change');
        }
        else {
            CellTextBox.addClass('upfront-change');
            CellTextBox.parent().addClass('upfront-change');
            CellTextBox.parent().parent().addClass('upfront-change');
            $("[name=chkSelect-" + UpfrontLineId + "]").prop("checked", true);
        }
    }

    if (ignoreChange == false) {
        $("#btnSaveChanges").attr("disabled", "disabled");
        $("#UpfrontTable td:has(:input.upfront-change)").each(function () {
            $("#btnSaveChanges").removeAttr("disabled");
            return false;
        })
    }
}

function setChangeDropDown(CellDropDown) {
    var UpfrontLineId = CellDropDown.attr("UpfrontLineId");
    var newClass = CellDropDown.find('option:selected').attr('value').substring(0, CellDropDown.find('option:selected').attr('value').indexOf('|'));

    CellDropDown.parent().removeClass('upfront-change');
    CellDropDown.removeClass('upfront-change');

    CellDropDown.parent().addClass(newClass);
    CellDropDown.addClass(newClass);

    CellDropDown.parent().addClass('upfront-change');
    CellDropDown.addClass('upfront-change');

    $("[name=chkSelect-" + UpfrontLineId + "]").prop("checked", true);

    $("#btnSaveChanges").attr("disabled", "disabled");
    $("#UpfrontTable td:has(:input.upfront-change)").each(function () {
        $("#btnSaveChanges").removeAttr("disabled");
        return false;
    })
}

function setChangeCheckBox(CellCheckBox) {
    //var value = CellCheckBox.attr('id');
    //var res = value.split('-');
    //var origval = res[2];

    //CellCheckBox.parent().removeClass('upfront-change');
    //CellCheckBox.parent().addClass('upfront-change');
}

function setClientMandate(CellDoNotBuyType) {
    var value = CellDoNotBuyType.find('option:selected').attr('value');
    var res = value.split("|");

    //var ClientRequired = value.substring(0, value.indexOf('|'));
    //var DoNotBuyTypeId = value.substring(value.indexOf('|') + 1);

    var newClass = res[0];
    var ClientRequired = res[1];
    var DoNotBuyTypeId = res[2];

    var id = CellDoNotBuyType.attr('id').substring(CellDoNotBuyType.attr('id').indexOf('-') + 1);
    if (ClientRequired == "True") {
        document.getElementById("DropdownClientName-" + id).style.visibility = "visible";
    }
    else {
        document.getElementById("DropdownClientName-" + id).style.visibility = "hidden";
    }
}

function setChangeTime(CellTime) {
    var value = CellTime.find('option:selected').attr('value');
    var res = value.split("|");

    var newClass = res[0];
    var ClientRequired = res[1];
    var DoNotBuyTypeId = res[2];

    var id = CellTime.attr('id').substring(CellTime.attr('id').indexOf('-') + 1);
    if (ClientRequired == "True") {
        document.getElementById("DropdownClientName-" + id).style.visibility = "visible";
    }
    else {
        document.getElementById("DropdownClientName-" + id).style.visibility = "hidden";
    }
}

function CalculateCPM(UpfrontLineId) {
    if (UpfrontLineId) {
        var Rate = 0;
        var Imp = 0;
        var cpm = 0;

        if ($("#txtRate-" + UpfrontLineId)) {
            Rate = $("#txtRate-" + UpfrontLineId).val();
        }

        if ($("#txtImp-" + UpfrontLineId)) {
            Imp = $("#txtImp-" + UpfrontLineId).val();
        }

        if (parseFloat(Imp) > 0) {
            cpm = parseFloat(Rate) / parseFloat(Imp);
        }
        $("#divCPM-" + UpfrontLineId).html(cpm.toFixed(2));
    }
}

function Approve(UpfrontLineId, IsToApprove) {
    var _upfrontlineid = UpfrontLineId;
    var url = "/ManageMedia/ApproveProperty";
    if (IsToApprove == false) {
        url = "/ManageMedia/UnapproveProperty";
    }

    $.ajax({
        url: url,
        data: { upfrontlineid: _upfrontlineid },
        cache: false,
        type: "POST",
        success: function (result) {
            if (result.success) {
                try {
                    var notify = $.notify(result.responseText, {
                        type: 'success',
                        allow_dismiss: true
                    });
                } catch (err) {
                    $("#shouldRefresh").val(err.message);
                    //document.getElementById("demo").innerHTML = err.message;
                }
            }
            else {
                swal('Error!', result.responseText, 'warning');
            }
       },
        error: function (response) {
            swal('Error1!', response.responseText, 'warning');
        }
    });
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function ReloadPage() {

    //if ($.fn.DataTable.isDataTable("#UpfrontTable") == true) {
    //    $('#UpfrontTable').DataTable().clear().destroy();
    //}

    if ($("#shouldRefresh").val() != "") {
        window.location.reload();
    }
    else {
        var date = new Date();
        var random = Math.floor(Math.random() * 1000) + 1 + date.getMilliseconds();
        $("#UpfrontTableDiv").load("/ManageMedia/ReloadDataTable?upfrontid=" + getParameterByName('upfrontid') + "&ViewOnly=false&type=1&r=" + random);
    }
}

function LoadUpfrontDeal(_networkId, _planyr, _dr) {
    var url = "/ManageMedia/LoadCancellationPolicy";

    $.ajax({
        url: url,
        data: {
            networkid: _networkId,
            planyr: _planyr,
            dr: _dr
        },
        cache: false,
        type: "POST",
        success: function (result) {
            if (result.success) {
                $('#txtBillboardAddedValue').val(result.cancelline1),
                    $('#txtUpfrontSponsorship').val(result.cancelline2),
                    $('#txtUpfrontCancellation').val(result.cancelline3),
                    $('#txtScatterCancellation').val(result.cancelline4),
                    $('#txtNetworkSeparation').val(result.cancelline5)
            }
            else {
                swal('Error!', result.responseText, 'warning');
            }
        },
        error: function (response) {
            swal('Error!', response.responseText, 'warning');
        }
    });

}

function LoadUpfrontDealCA(_networkId, _planyr, _dr) {
    var url = "/ManageMedia/LoadCancellationPolicy";

    $.ajax({
        url: url,
        data: {
            networkid: _networkId,
            planyr: _planyr,
            dr: _dr
        },
        cache: false,
        type: "POST",
        success: function (result) {
            if (result.success) {
                    $('#txtUpfrontCancellation').val(result.cancelline3),
                    $('#txtScatterCancellation').val(result.cancelline4),
                    $('#txtNetworkSeparation').val(result.cancelline5)
            }
            else {
                swal('Error!', result.responseText, 'warning');
            }
        },
        error: function (response) {
            swal('Error!', response.responseText, 'warning');
        }
    });

}









