var isCloseButtonClicked = false;
var MediaPlanNotesJson = [];
var mediaPlanNoteIdToUpdate = 0;
var isFilter1ClickedToOpen = false;
var isFilter2ClickedToOpen = false;
var isfilterApplied = false;
$(document).ready(function () {
    
    $("body").click(function () {
        if (!isFilter1ClickedToOpen && !isFilter2ClickedToOpen) {
            $(".filterdata").hide();
        }
        isFilter1ClickedToOpen = false;
        isFilter2ClickedToOpen = false;
        isfilterApplied = false;
    });
 
    $("#txtNewNote").change(function () {
        $("#txtNewNote").css("border", "1.33333px solid rgb(220, 223, 227)");
    });

});
function ToggleFilter(index) {
    if ($("#divFilterCol_" + index).css("display") == "none") {
        $("#divFilterCol_" + index).show();
        if (index == 0)
            isFilter1ClickedToOpen = true;
        else
            isFilter2ClickedToOpen = true;
    }
    else {
        $("#divFilterCol_" + index).hide();
        isFilter1ClickedToOpen = false;
        isFilter2ClickedToOpen = false;
    }
    
    
}
function OpenMediaPlanNotes() {
    isCloseButtonClicked = false;
    $("#txtNewNote").css("border", "");
    $("#mpnSave").css({ display: "inline-block" });
    $("#mpnUpdate").css({ display: "none" });
    setTimeout(function () {        
        $("#tbodyMediaPlanNotes").html("");
        $('#MediaPlanNotesModal').modal('show');
        BindMediaPlanNotes();       
    }, 1000);
}
function BindMediaPlanNotes() {
    $.ajax({
        url: "/MediaPlan/GetAllMediaPlanNotes",
        data: {
            "MediaPlanId": $("#hdnMediaPlanId").val()
        },
        cache: false,
        type: "GET",
        success: function (result) {
            if (result) {
                initialLoad = false;
                MediaPlanNotesJson = result.notesList;                
                if (MediaPlanNotesJson != null) {
                    InitializeMediaPlanNotes();
                }
            }

        },
        error: function (response) {
            HideOverlayMediaSummary();
            swal('Wait ...', response, 'error');
        }
    });
}
var mediaPlanNotesTable = null;
function InitializeMediaPlanNotes() {
    if ($.fn.dataTable.isDataTable('#tblMediaPlanNotes')) {
        mediaPlanNotesTable = $('#tblMediaPlanNotes').DataTable().destroy();
        $("#tbodyMediaPlanNotes").html("");
    }
    if (MediaPlanNotesJson != null && MediaPlanNotesJson.length > 0) {
        MediaPlanNotesJson = MediaPlanNotesJson.sort(function (a, b) {
            // Assuming 'date' is the property to sort by
            // Convert date strings to Date objects if necessary
            return new Date(b.time) - new Date(a.time);
        });
        var NotesHTML = "";
        for (var i = 0; i < MediaPlanNotesJson.length; i++) {
            NotesHTML += '<tr style="border:1px solid #e5e5e5; min-height:60px;max-height:60px;height:60px;">';
            NotesHTML += '<td scope="col" style="width:151px;max-width:200px;border:1px solid #e5e5e5;text-transform: capitalize; text-align:left;padding: 5px;">' + MediaPlanNotesJson[i].user + '</td>';
            NotesHTML += '<td scope="col" style="width:1350px;max-width:1350px;border:1px solid #e5e5e5;text-transform: none;text-align:left;padding: 5px;">';
            NotesHTML += '<span>' + MediaPlanNotesJson[i].note + '</span>';
            NotesHTML += '</td>';
            NotesHTML += '<td scope="col" style="width:155px;max-width:300px;border:1px solid #e5e5e5;text-transform: capitalize;text-align:left;padding: 5px;">' + MediaPlanNotesJson[i].author + '</td>';
            NotesHTML += '<td scope="col" style="width:147px;max-width:150px;border:1px solid #e5e5e5;text-transform: capitalize;text-align:left;padding: 5px;">' + MediaPlanNotesJson[i].time + '</td>';
            NotesHTML += '<td scope="col" style="width:72px;max-width:72px;border:1px solid #e5e5e5;text-transform: capitalize;text-align:left;padding: 5px;">';
            if (MediaPlanNotesJson[i].canModify) {
                NotesHTML += '<i style="margin-left:15%;cursor:pointer;" data-media-plan-note-id="' + MediaPlanNotesJson[i].mediaPlanNoteId + '" onclick="EditMediaPlanNote(this);" class="fa fa-pencil fa-2x" aria-expanded="true"></i>';
                NotesHTML += '<i style="margin-left:10%;cursor:pointer;" onclick="return DeleteMediaPlanNote(' + MediaPlanNotesJson[i].mediaPlanNoteId + ');" class="fa fa-trash fa-2x" aria-expanded="true"></i>';
            }
            else {
                if (MediaPlanNotesJson[i].author.toLowerCase() != "system") {
                    NotesHTML += '<i style="margin-left:15%;cursor:not-allowed;color:#d1d1d1" class="fa fa-pencil fa-2x" aria-expanded="true"></i>';
                    NotesHTML += '<i style="margin-left:10%;cursor:not-allowed;color:#d1d1d1"  class="fa fa-trash fa-2x" aria-expanded="true"></i>';
                }
            }          
            NotesHTML += '</td>';
            NotesHTML += '</tr>';
        }
        $("#tbodyMediaPlanNotes").html(NotesHTML);
    }
    mediaPlanNotesTable = $('#tblMediaPlanNotes').DataTable({
        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, 'All']],
        "processing": true,
        "bAutoWidth": false,
        "order": [],       
        "paging": true,
        "language": {
            "lengthMenu": "_MENU_ items per page", 
        },        
        initComplete: function () {           
            this.api().columns().every(function () {
                var column = this;
                if (column.index() === 0 || column.index() === 2) {
                    // Checkbox for first and third columns
                    var checkboxList = $('<div style=width:180px;" id="divCol_' + column.index() + '" data-col="' + column.index() + '"></div>').appendTo($(column.footer()).empty());
                    column.data().unique().sort().each(function (d, j) {
                        var id = 'checkbox_' + column.index() + '_' + j;
                        checkboxList.append('<div><input data-index="' + id + '" style="color:#575757;" type="checkbox" id="' + id + '" value="' + d + '"><label style="color:#575757!important;padding-left:5px;" for="' + id + '">' + d + '</label></div>');
                    });
                    $("#divFilterCol_" + column.index()).html(checkboxList.html());

                    checkboxList.on('change', 'input[type="checkbox"]', function () {
                        var vals = $('input[type="checkbox"]:checked', checkboxList).map(function () {
                            return $.fn.dataTable.util.escapeRegex($(this).val());
                        }).toArray().join('|');

                        column
                            .search(vals.length > 0 ? '^(' + vals + ')$' : '', true, false)
                            .draw();
                    });
                } else if (column.index() === 1 || column.index() === 3) {
                    // Textbox for second and fourth columns
                    $("#divFilterCol_" + column.index()).html('<input id="txtSearch_' + column.index() + '" type="text" placeholder="Search" style="width: 100%;padding-left: 5px;" data-index="' + column.index() + '">');
                    var input = $('<input type="text" placeholder="Search">')
                        .appendTo($(column.footer()).empty())
                        .on('keyup change', function () {
                            column
                                .search($(this).val(), true, false)
                                .draw();
                        });
                }
            });
            $('#tblMediaPlanNotes thead').hide();
            $('#tblMediaPlanNotes tfoot').hide();
            $("#tblMediaPlanNotes_filter").hide();
            $($("#tblMediaPlanNotes").closest("div")).css("padding", "0");
            $('#tblMediaPlanNotes').css("width","2320px");
            $("#tblMediaPlanNotes_wrapper").css({ 'margin-top': '-9px', 'padding-left': '14px' });
            setTimeout(function () {                
                $("#tblMediaPlanNotes_length").css({ 'position': 'absolute', 'z-index': '1000', 'margin-top': $("#tblMediaPlanNotes").height() + 15, 'margin-left': $("#tblMediaPlanNotes_wrapper").parent().parent().width() / 2 + "px" });
                $("#tblMediaPlanNotes_info").css("margin-left", "2120px");
                $("#tblMediaPlanNotes_paginate").css("position", "absolute");
                if ($("#tblMediaPlanNotes_paginate").width() > 300) {
                    $("#tblMediaPlanNotes_paginate").css("left", "-948px");
                }
                else {
                    $("#tblMediaPlanNotes_paginate").css("left", "-968px");
                }               
            }, 1000);
        }
    });

    mediaPlanNotesTable.on('length', function (e, settings, len) {
        setTimeout(function () {           
            $("#tblMediaPlanNotes_length").css({ 'position': 'absolute', 'z-index': '1000', 'margin-top': $("#tblMediaPlanNotes").height() + 15, 'margin-left': $("#tblMediaPlanNotes_wrapper").parent().parent().width()/2+"px" });
            }, 100);
    });
    $("#tblMediaPlanNotes_paginate").on('click', function (e, settings, len) {
        setTimeout(function () {
            $("#tblMediaPlanNotes_length").css({ 'position': 'absolute', 'z-index': '1000', 'margin-top': $("#tblMediaPlanNotes").height() + 15, 'margin-left': $("#tblMediaPlanNotes_wrapper").parent().parent().width()/2+"px" });
            }, 100);
    });
    mediaPlanNotesTable.on('search', function (e, settings, len) {
       
        var noteSearchLength = $("#txtSearch_1").val().length;
        var timeSearchLength = $("#txtSearch_3").val().length;
        if (noteSearchLength == 0 && timeSearchLength == 0) {
            $("#tblMediaPlanNotes_info").css("margin-left", "2120px");
        }
        else {
            $("#tblMediaPlanNotes_info").css("margin-left", "1939px");
        }                
        setTimeout(function () {
            $("#tblMediaPlanNotes_length").css({ 'position': 'absolute', 'z-index': '1000', 'margin-top': $("#tblMediaPlanNotes").height() + 15, 'margin-left': $("#tblMediaPlanNotes_wrapper").parent().parent().width()/2+"px" });            
        }, 100);
    });

    $($($("#tblMediaPlanNotes2 tbody tr")[0]).find("td")[0]).find("input").on('change', function () {
        $($($($("#tblMediaPlanNotes tfoot tr")[0]).find("th")[0]).find("input[data-index=" + $(this).attr("data-index") + "]")).prop("checked", $(this).prop("checked"));
        isfilterApplied = true;
        var vals = $('#divFilterCol_0 input[type="checkbox"]:checked').map(function () {
            return $.fn.dataTable.util.escapeRegex($(this).val());
        }).toArray().join('|');
        $('#tblMediaPlanNotes').DataTable().column(0)
            .search(vals.length > 0 ? '^(' + vals + ')$' : '', true, false)
            .draw();

        var checkedLength = $('#divFilterCol_0 input[type="checkbox"]:checked').length;
        var totalCheckboxes = $('#divFilterCol_0 input[type="checkbox"]').length;
        if (checkedLength == totalCheckboxes || checkedLength == 0) {
            $("#tblMediaPlanNotes_info").css("margin-left", "2120px");
        }
        else {
            $("#tblMediaPlanNotes_info").css("margin-left", "1939px");
        }
        $("#divFilterCol_0").show();

    });

    $($($("#tblMediaPlanNotes2 tbody tr")[0]).find("td")[2]).find("input").on('change', function () {
        $($($($("#tblMediaPlanNotes tfoot tr")[0]).find("th")[2]).find("input[data-index=" + $(this).attr("data-index") + "]")).prop("checked", $(this).prop("checked"));
        isfilterApplied = true;

        $("#divFilterCol_2").show();

        var vals = $('#divFilterCol_2 input[type="checkbox"]:checked').map(function () {
            return $.fn.dataTable.util.escapeRegex($(this).val());
        }).toArray().join('|')

        $('#tblMediaPlanNotes').DataTable().column(2)
            .search(vals.length > 0 ? '^(' + vals + ')$' : '', true, false)
            .draw();
        var checkedLength = $('#divFilterCol_2 input[type="checkbox"]:checked').length;
        var totalCheckboxes = $('#divFilterCol_2 input[type="checkbox"]').length;
        if (checkedLength == totalCheckboxes || checkedLength == 0) {
            $("#tblMediaPlanNotes_info").css("margin-left", "2120px");
        }
        else {
            $("#tblMediaPlanNotes_info").css("margin-left", "1939px");
        }
    });

    $($($("#tblMediaPlanNotes2 tbody tr")[0]).find("td")[1]).find("input").on('keyup change', function () {
        $($($($("#tblMediaPlanNotes tfoot tr")[0]).find("th")[1]).find("input")).val($(this).val());        
        $('#tblMediaPlanNotes').DataTable().column(1).search(this.value).draw();
    });
    $($($("#tblMediaPlanNotes2 tbody tr")[0]).find("td")[3]).find("input").on('keyup change', function () {
        $($($($("#tblMediaPlanNotes tfoot tr")[0]).find("th")[3]).find("input")).val($(this).val());        
        $('#tblMediaPlanNotes').DataTable().column(3).search(this.value).draw();
    });
}


function EditMediaPlanNote(clickedElement) {
    var mediaPlanId = $("#hdnMediaPlanId").val();
    $.ajax({
        url: "/MediaPlan/MediaPlanCheckLock/",
        data: {
            MediaPlanId: mediaPlanId,
            Action: "editnote"
        },
        cache: false,
        type: "POST",
        success: function (response) {
            if (response.responseCode != 200) {                
                swal({
                    html: response.responseText,
                    type: 'error',
                });
                setTimeout(function () {
                    window.location.href = "/ManageMedia/Planning";
                }, 3000);
            }
            else {
                var mediaPlanNoteId = $(clickedElement).data('media-plan-note-id');
                var noteToEdit = MediaPlanNotesJson.find(note => note.mediaPlanNoteId === mediaPlanNoteId);
                mediaPlanNoteIdToUpdate = mediaPlanNoteId;
                $("#mpnSave").css({ display: "none" });
                $("#mpnUpdate").css({ display: "inline-block" });
                $("#txtNewNote").val(noteToEdit.note);
            }
        },
        error: function (response) {
            var err = response.result;
        }
    });    
}

function DeleteMediaPlanNote(MediaPlanNoteId) {
    var mediaPlanId = $("#hdnMediaPlanId").val();
    $.ajax({
        url: "/MediaPlan/MediaPlanCheckLock/",
        data: {
            MediaPlanId: mediaPlanId,
            Action: "deletenote"
        },
        cache: false,
        type: "POST",
        success: function (response) {
            if (response.responseCode != 200) {
                swal({
                    html: response.responseText,
                    type: 'error',
                });
                setTimeout(function () {
                    window.location.href = "/ManageMedia/Planning";
                }, 3000);
            }
            else {
                var data = {
                    MediaPlanNoteId: MediaPlanNoteId,
                };
                $.ajax({
                    type: "POST",
                    url: "/MediaPlan/DeleteMediaPlanNote",
                    data: data,
                    success: function (response) {
                        if (response.success) {
                            swal({
                                html: "Note deleted successfully.",
                                type: 'success',
                            });
                            $("#tbodyMediaPlanNotes").html("");

                            BindMediaPlanNotes();
                            $("#txtNewNote").val("");

                        }
                        else {
                            swal({
                                html: "Error occurred while deleting note.",
                                type: 'error',
                            });
                        }
                    },
                    error: function (response) {
                        swal({
                            html: "Error occurred while deleting note.",
                            type: 'error',
                        });
                    }
                });
            }
        },
        error: function (response) {
            var err = response.result;
        }
    });     
}
function ClearMedialNotes() {
    $("#mpnSave").css({ display: "inline-block" });
    $("#mpnUpdate").css({ display: "none" });
    $("#txtNewNote").val("");
}


function SaveMediaNote() {
    var Notes = $("#txtNewNote").val().trim();
    if (Notes.length > 500) {
        swal({
            html: "Note must be less than 500 characters.",
            type: 'warning',
        });
        return false;
    }
    if (Notes !== "" && Notes !== undefined && Notes !== null) {

        var data = {
            'MediaPlanId': $("#hdnMediaPlanId").val(),
            'Note': Notes
        };

        $.ajax({
            type: "POST",
            url: "/MediaPlan/SaveMediaPlanNote",
            data: data,
            success: function (response) {
                if (response.success) {
                    swal({
                        html: "Note saved successfully.",
                        type: 'success',
                    });                    
                    $("#txtNewNote").val("");
                    $("#txtNewNote").css("border", "1.33333px solid rgb(220, 223, 227)");
                    $("#tbodyMediaPlanNotes").html("");
                    BindMediaPlanNotes();
                }
                else {
                    swal({
                        html: response.responseText,
                        type: 'error',
                    });
                }
            },
            error: function (response) {
                swal({
                    html: "Error occurred while saving note.",
                    type: 'error',
                });
            }
        });
    }
}

function UpdateMediaNote() {
    var UpdatedNote = $("#txtNewNote").val().trim();
    if (UpdatedNote.length > 500) {
        swal({
            html: "Note must be less than 500 characters.",
            type: 'warning',
        });
        return false;
    }
    if (UpdatedNote !== "" && UpdatedNote !== undefined && UpdatedNote !== null) {

        var data = {
             MediaPlanNoteId: mediaPlanNoteIdToUpdate,
             Note: UpdatedNote
        };

        $.ajax({
            type: "POST",
            url: "/MediaPlan/UpdateMediaPlanNote",
            data: data,
            success: function (response) {
                if (response.success && response.mediaPlanNoteId != 0) {                    
                    swal({
                        html: "Note updated successfully.",
                        type: 'success',
                    }); 
                    $("#tbodyMediaPlanNotes").html("");   
                    $("#txtNewNote").css("border", "1.33333px solid rgb(220, 223, 227)");
                    BindMediaPlanNotes();
                    $("#txtNewNote").val("");
                    $("#mpnUpdate").css({ display: "none" });
                    $("#mpnSave").css({ display: "inline-block" });
                    
                }
                else {
                    swal({
                        html: "Error occurred while updating note.",
                        type: 'error',
                    });
                }
            },
            error: function (response) {
                swal({
                    html: "Error occurred while updating note.",
                    type: 'error',
                });
            }
        });
    }
    else {
        swal({
            html: "Note cannot be blank.",
            type: 'warning',
        });
    }
}

$('#MediaPlanNotesModal').on('hide.bs.modal', function (e) {
    if (!isCloseButtonClicked) {       
        var hasNotesData = false;

        var notes_value = $("#txtNewNote").val();
        if (notes_value != "") {
            hasNotesData = true;
        }

        if (!hasNotesData) {
            $('#MediaPlanNotesModal').modal('hide');
        }
        else {
            $("#txtNewNote").css("border", "1.33333px solid red");
            $('#MediaPlanNotesModal').modal('show');
            e.stopPropagation();
            swal({
                title: "",
                html: 'You have an unsaved note. Do you wish to continue?',
                type: 'warning',
                showCancelButton: true,
                width: 458,
                height: 302,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                showLoaderOnConfirm: true,
                allowOutsideClick: false,
                allowEscapeKey: false,
                reverseButtons: false,
                preConfirm: function () {
                    return new Promise(function (resolve) {
                        setTimeout(function () {
                            resolve();
                        }, 50);
                    });
                }
            }).then(
                function (result) {
                    $('#MediaPlanNotesModal').modal('hide');
                    $("#txtNewNote").val("");
                }, function (dismiss) {
                    $('#MediaPlanNotesModal').modal('show');
                }
            );
        }
    }
});


function CloseMediaPlanNotesPopup(e) {
    var hasNotesData = false;

        var notes_value = $("#txtNewNote").val();
        if (notes_value != "") {
            hasNotesData = true;
        }

    if (!hasNotesData) {
        $('#MediaPlanNotesModal').modal('hide');
    }
    else {
        $("#txtNewNote").css("border", "1.33333px solid red");
        swal({
            title: "",
            html: 'You have an unsaved note. Do you wish to continue?',
            type: 'warning',
            showCancelButton: true,
            width: 458,
            height: 302,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'No',
            confirmButtonText: 'Yes',
            showLoaderOnConfirm: true,            
            allowEscapeKey: false,
            reverseButtons: false,
            preConfirm: function () {
                return new Promise(function (resolve) {
                    setTimeout(function () {
                        resolve();
                    }, 50);
                });
            }
        }).then(
            function (result) {
                isCloseButtonClicked = true;
                $('#MediaPlanNotesModal').modal('hide');
                $("#txtNewNote").val("");
            }, function (dismiss) {             
            }
        );
    }    
}
