var postlogtable = null;
var postlogeditor = null;

var default_network_options = [];
var default_daypart_options = [];
var default_buytype_options = [];
var default_media_options = [];
var isNetwrokLogLine = false;
var params1 = $("#postLogParams");
var createWeekNbr = 0;
var indexColumnClicked = -1;
var mousecursor_not_allowed_css_class = { cursor: 'not-allowed', backgroundColor : 'light-gray' };
var mousecursor_pointer_css_class = { cursor: 'pointer' };
var selectedDuplicatePropertyId = 0;
var networkLogId = 0;
var originalSpotDate = '';
var originalSpotTime = '';
var originalIsci = '';
var isDataSavedToActulize = true;


function GetNetworks() {
    $.ajax({
        url: '/Logs/GetNetworks',
        type: 'POST',
        data: {
            logsSelectedCountryId: getParameterByName('selectedCountry')
        },
        success: function (result) {
            for (var x = 0; x < result.data.length; x++) {
                default_network_options.push({
                    value: result.data[x].networkId,
                    label: result.data[x].stdNetName
                });
            }
        },
        error: function (response) {
            var notify = $.notify(response.responseText, {
                type: 'danger',
                allow_dismiss: true,
            });
        }
    });
}

function GetDayParts() {
    $.ajax({
        url: '/Logs/GetDayParts',
        type: 'POST',
        success: function (result) {
            for (var x = 0; x < result.data.length; x++) {
                default_daypart_options.push({
                    value: result.data[x].dayPartId,
                    label: result.data[x].dayPartCd
                });
            }
        },
        error: function (response) {
            var notify = $.notify(response.responseText, {
                type: 'danger',
                allow_dismiss: true,
            });
        }
    });
}

function GetBuyTypes() {
    $.ajax({
        url: '/Logs/GetBuyTypes',
        type: 'POST',
        success: function (result) {
            for (var x = 0; x < result.data.length; x++) {
                default_buytype_options.push({
                    value: result.data[x].buyTypeId,
                    label: result.data[x].buyTypeCode
                });
            }
        },
        error: function (response) {
            var notify = $.notify(response.responseText, {
                type: 'danger',
                allow_dismiss: true,
            });
        }


    });
}

function GetMediaTypes() {
    $.ajax({
        url: '/Logs/GetMediaTypes',
        type: 'POST',
        success: function (result) {
            for (var x = 0; x < result.data.length; x++) {
                default_media_options.push({
                    value: result.data[x].mediaTypeId,
                    label: result.data[x].mediaTypeCode
                });
            }
        },
        error: function (response) {
            var notify = $.notify(response.responseText, {
                type: 'danger',
                allow_dismiss: true,
            });
        }


    });
}

function SaveIsci(id, isci) {
    alert(isci);
}


function initPostLogEditTable() {
    if (postlogtable == null) {
        var weekStartDate = new Date($('#WeekStartDate').html());
        var weekEnd = weekStartDate.addDays(6);
        postlogeditor = new $.fn.dataTable.Editor({
            ajax: {
                create: {
                    type: 'POST',
                    url: '/Logs/AddPostLogLine',
                    data: function (d) {
                        d.postLogId =  getParameterByName('postlogid'),
                            d.weekStartDate = weekStartDate
                    },
                    success: function (result) {
                        postlogtable.ajax.reload(null, false);
                        if (result.success) {
                            isDataSavedToActulize = false;
                            swal({
                                title: "Success",
                                text: 'Row successfully added.  ',
                                type: 'success',
                            });
                        }
                        else {
                            swal({
                                title: "Error",
                                text: result.responseText,
                                type: 'error',
                            });
                        }
                    },
                    error: function (response) {
                        swal({
                            title: "Error",
                            text: response.responseText,
                            type: 'error',
                        });
                    }
                },
                edit: {
                    type: 'POST',
                    url: '/Logs/EditPostLogLines',
                    data: function (d) {
                        d.postLogLineId = Object.keys(d.data)[0],
                            d.postLogId = getParameterByName('postlogid'),
                            d.postLogLineIds = function () {
                                var _postLogLineIds = "";
                                if (isNetwrokLogLine) {
                                    if (postlogtable.rows({ selected: true }).count() > 1) {
                                        $.each(postlogtable.rows({ selected: true }).data(), function (key, value) {
                                            if (key == 0) {
                                                _postLogLineIds = value.pLineID;
                                            } else {
                                                _postLogLineIds += "," + value.pLineID;
                                            }
                                        });
                                    }
                                    else {
                                        _postLogLineIds = Object.keys(d.data)[0];
                                    }
                                }
                                else {
                                    _postLogLineIds = Object.keys(d.data)[0];
                                }
                                return _postLogLineIds;
                            }

                    },
                    success: function (result) {
                        console.log('success');
                        if (result.success) {
                            promptExit(1);
                            isDataSavedToActulize = false;
                            postlogtable.rows({ selected: true }).deselect();
                            //postlogtable.ajax.reload(null, false);
                        }
                        else {
                            swal({
                                title: "Error",
                                text: result.responseText,
                                type: 'error',
                            });
                        }
                    },
                    error: function (response) {
                        swal({
                            title: "Error",
                            text: response.responseText,
                            type: 'error',
                        });
                    }
                },

            },

            formOptions: {
                inline: {
                    submit: 'all'
                }
            },

            table: "#PostLogViewTable",
            idSrc: 'pLineID',
            fields: [
                {
                    label: "Property Number Count#:",
                    name: "propertyLineCount"
                },

                {
                    label: "Network Name:",
                    name: "network.networkId",
                    type: "select",
                    placeholder: "Select a network"
                },
                {
                    label: "Property Name:",
                    name: "property.propertyName"
                },
                {
                    label: "Days:",
                    name: "property.monday",
                    def: 1,
                    type: "checkbox",
                    separator: "|",
                    options: [
                        { label: 'Mon', "value": 1 }
                    ]
                },
                {
                    label: "",
                    name: "property.tuesday",
                    def: 1,
                    type: "checkbox",
                    separator: "|",
                    options: [
                        { label: 'Tue', "value": 1 }
                    ]
                },
                {
                    label: "",
                    name: "property.wednesday",
                    def: 1,
                    type: "checkbox",
                    separator: "|",
                    options: [
                        { label: 'Wed', "value": 1 }
                    ]
                },
                {
                    label: "",
                    name: "property.thursday",
                    def: 1,
                    type: "checkbox",
                    separator: "|",
                    options: [
                        { label: 'Thu', "value": 1 }
                    ]
                },
                {
                    label: "",
                    name: "property.friday",
                    def: 1,
                    type: "checkbox",
                    separator: "|",
                    options: [
                        { label: 'Fri', "value": 1 }
                    ]
                },
                {
                    label: "",
                    name: "property.saturday",
                    def: 1,
                    type: "checkbox",
                    separator: "|",
                    options: [
                        { label: 'Sat', "value": 1 }
                    ]
                },
                {
                    label: "",
                    name: "property.sunday",
                    def: 1,
                    type: "checkbox",
                    separator: "|",
                    options: [
                        { label: 'Sun', "value": 1 }
                    ]
                },
                {
                    label: "Start Time:",
                    name: "startTime"
                    //name: "property.startTime"
                },
                {
                    label: "End Time:",
                    name: "endTime"
                    //name: "property.endTime"
                },
                {
                    label: "Day Part:",
                    //name: "dayPart.dayPartId",
                    name: "dayPartId",
                    type: "select",
                    placeholder: "Select Day Part"
                },
                {
                    label: "Spot Length:",
                    //name: "rate.spotLen",
                    name: "spotLen",
                    type: "select",
                    placeholder: "Select Spot Length",
                    options: [
                        { label: "15", value: "15" },
                        { label: "30", value: "30" },
                        { label: "60", value: "60" },
                        { label: "120", value: "120" },
                    ]
                },
                {
                    label: "SP Buy",
                    name: "sp_Buy",
                    type: "select",
                    placeholder: "Select SP Buy",
                    options: [
                        { label: "", value: "" },
                        { label: "SP", value: "SP" }
                    ]
                },
                {
                    label: "Buy Type:",
                    //name: "buyType.buyTypeId",
                    name: "buyTypeId",
                    type: "select",
                    placeholder: "Select Buy Type"
                },

                {
                    label: "Gross Rate Amt:",
                    //name: "fullRate"
                    name: "clientRate",
                    type: 'hidden'
                },

                {
                    label: "Rate Amt:",
                    name: "rateAmount"
                    //name: "rate.rateAmt"
                },
                {
                    label: "Impressions:",
                    name: "imp",
                    //name: "rate.impressions",
                },
                {
                    label: "Spot Date:",
                    name: "spotDate",
                    //type: 'hidden'
                },
                {
                    label: "Spot Time:",
                    name: "spotTime",
                    //type: 'hidden'
                },
                {
                    label: "Program Title:",
                    name: "programTitle",
                    //type: 'hidden'
                },
                {
                    label: "Cleared",
                    name: "clearedPlaced",
                    type: "select",
                    options: [
                        { label: "Cleared", value: "CLEARED" },
                        { label: "Uncleared", value: "UNCLEARED" },
                        { label: "Unplaced", value: "UNPLACED" },
                        // { label: "", value: "NONE" },
                    ],
                },
                {
                    label: "Media Type:",
                    name: "mediaType.mediaTypeId",
                    type: "select",
                    placeholder: "Select Media Type",
                    type: "hidden"
                },
                {
                    label: "ISCI:",
                    name: "isci",
                    //type: 'hidden'
                },
                {
                    label: "Day Part:",
                    name: "dayPart.dayPartDesc",
                    type: 'hidden'
                },
                {
                    label: "Sigma Program:",
                    name: "sigmaProgramName",
                    //type: "hidden"
                },
                {
                    label: "",
                    name: "postLog.postLogId",
                    type: "hidden"
                },
                {
                    label: "ScheduleId",
                    name: "scheduleId",
                    type: "hidden"
                }
            ]
        });

        // Activate an inline edit on click of a table cell
        $('#PostLogViewTable').on('click', 'tbody td:not(:first-child)', function (e) {
            /*
            var data = postlogtable.row($(this).parents('tr')).data();

            // This condition is for new rows.  All columns except network can be edited
            if (data && data.postLogLineId <= 0) {
                postlogeditor.inline(this, {
                    submit: 'allIfChanged',
                    submitOnBlur: true
                });
            }
            else if (parseInt($(this).index()) == 18 ||  // Spot Date
                parseInt($(this).index()) == 19 ||  // Spot Time
                parseInt($(this).index()) == 21 ||  // ISCI
                parseInt($(this).index()) == 22 ||  // Program Title
                parseInt($(this).index()) == 23     // Cleared
            ) {
                postlogeditor.inline(this, {
                    submit: 'allIfChanged',
                    submitOnBlur: true
                });
            }
            */
        });


        $('#PostLogViewTable').on('click', 'tbody tr', function () {
            var data = postlogtable.row(this).data();
            isNetwrokLogLine = false;
            selectedDuplicatePropertyId = data.pLineID;
            networkLogId = data.networkLogId;
            originalSpotDate = moment(data.origSpotDate).format("MM/DD/YYYY"); //formatDate(data.origSpotDate);
            originalSpotTime = moment(data.origSpotTime).format("hh:mm:ss A");
            originalIsci = data.origISCI;
            var postLogLineIdMatched = false;
            var schedlueLine = false;
            var networkLogLine = true;
            var networkSpotLenRateMatched = true;
            var networkId = 0;
            var spotLen = 0;
            var rateAmount = 0;
            if (postlogtable.rows({ selected: true }).count() > 0 && indexColumnClicked > 0) {
                $.each(postlogtable.rows({ selected: true }).data(), function (key, value) {
                    if (value.pLineID == selectedDuplicatePropertyId) {
                        postLogLineIdMatched = true;
                    }
                });
                if (!postLogLineIdMatched) {
                    postlogtable.rows({ selected: true }).deselect();
                }
                $.each(postlogtable.rows({ selected: true }).data(), function (key, value) {
                    if (value.scheduleLineId != null && value.scheduleLine.scheduleLineId > 0) {
                        schedlueLine = true;
                    }
                    if (value.networkLogId == null || value.networkLogId == 0) {
                        networkLogLine = false;
                    }
                    if (key == 0) {
                        networkId = value.network.networkId;
                        spotLen = value.spotLen;
                        rateAmount = value.rateAmount;
                    } else {
                        if (networkId != value.network.networkId || spotLen != value.spotLen || rateAmount != value.rateAmount) {
                            networkSpotLenRateMatched = false;
                        }
                    }
                });
                if (schedlueLine) {
                    swal('', 'Schedule Line is not editable.', 'warning');
                    return false;
                }
                if (!networkLogLine) {
                    swal('', 'Please select Network Log Lines.', 'warning');
                    return false;
                }
                if (!networkSpotLenRateMatched) {
                    swal('', 'Please select same Network/Rate/Spot Length.', 'warning');
                    return false;
                }
            }
            ////**** Note:- scheduleId == 0 -> represents Network log line & scheduleId == -1 -> represents new added lines
            //if (data.postLogLineId < 0 || data.scheduleId == 0 || data.scheduleId == -1) {
            //  if (data.postLogLineId > 0 && data.networkLogId != null) {
            if (data.pLineID < 0 || data.scheduleId == 0 || data.scheduleId == -1) {
                if (data.pLineID > 0 && data.networkLogId != null) {

                    isNetwrokLogLine = true;
                }
                if (indexColumnClicked > 0 && indexColumnClicked < 17) { //Duplicate row
                    //if (indexColumnClicked < 17) {
                    postlogtable.row(this).edit();
                    postlogeditor.buttons([{ text: 'Update', action: function () { this.submit(); } }, { text: 'Copy Property Details', action: function () { PostLogGetPropertyDetails(); } }]);
                    postlogeditor.field('propertyLineCount').hide();
                }
            }
        });

        $('#PostLogViewTable').on('click', 'tbody td', function () {
            indexColumnClicked = $(this).index();
        });


        // This seems to execute every time any of the columns are clicked.  So it's a bit unreliable
        // so I will detect the change myself.
        /*
        postlogeditor.field('clearedPlaced').input().on('change', function () {
            postlogeditor.submit();
        });
        */

        postlogeditor.field('clearedPlaced').input().on('change', function (e, d) {
            if (d && d.editorSet) return;
            // alert("You selected " + $(this).val());
        });

        //postlogeditor.field('property.startTime').input().on('change', function (e, d) {
        postlogeditor.field('startTime').input().on('change', function (e, d) {
            if (d && d.editorSet) return;

            //var startTime = postlogeditor.field('property.startTime');
            var startTime = postlogeditor.field('startTime');
            if (startTime.val() != '') {
                $.ajax({
                    url: '/Logs/ValidateTime',
                    type: 'GET',
                    data: { time: $(this).val() },
                    success: function (result) {
                        if (result.success) {
                            startTime.val(moment(result.responseText).format("hh:mm a"));
                            startTime.error('');
                        }
                        else {
                            startTime.error(result.responseText);
                        }
                    },
                    error: function (result) {
                        startTime.error('Invalid input. (0x0002)');
                    }
                });
            }
        });

        //postlogeditor.field('property.endTime').input().on('change', function (e, d) {
        postlogeditor.field('endTime').input().on('change', function (e, d) {
            if (d && d.editorSet) return;

            //var endTime = postlogeditor.field('property.endTime');
            var endTime = postlogeditor.field('endTime');
            if (endTime.val() != '') {
                $.ajax({
                    url: '/Logs/ValidateTime',
                    type: 'GET',
                    data: { time: $(this).val() },
                    success: function (result) {
                        if (result.success) {
                            endTime.val(moment(result.responseText).format("hh:mm a"));
                            endTime.error('');
                        }
                        else {
                            endTime.error(result.responseText);
                        }
                    },
                    error: function (result) {
                        endTime.error('Invalid input. (0x0004)');
                    }
                });
            }
        });

        postlogeditor.field('spotDate').input().on('change', function (e, d) {
            if (d && d.editorSet) return;

            try {
                if ($(this).val() == '') return;
            }
            catch (err) {
                return;
            }

            var spotDate = postlogeditor.field('spotDate');
            $.ajax({
                url: '/Logs/ValidateSpotDate',
                type: 'GET',
                data: {
                    weekStartDate: $("#WeekStartDate").html(),
                    spotDate: $(this).val()
                },
                success: function (result) {
                    if (result.success) {
                        spotDate.val(moment(result.responseText).format("MM/DD/YYYY"));
                        spotDate.error('');
                    }
                    else {
                        spotDate.error(result.responseText);
                    }
                },
                error: function (result) {
                    spotDate.error('Invalid input. (0x0005) ');
                }
            });            
        });

        postlogeditor.field('propertyLineCount').input().on('blur', function (e, d) {

            if (postlogeditor.field('propertyLineCount').val().trim() > 1) {
                postlogeditor.field('spotDate').disable();
                postlogeditor.field('spotTime').disable();
                postlogeditor.field('programTitle').disable();
                postlogeditor.field('isci').disable();
            }
            else {
                postlogeditor.field('spotDate').enable();
                postlogeditor.field('spotTime').enable();
                postlogeditor.field('programTitle').enable();
                postlogeditor.field('isci').enable();
            }
        });


        postlogeditor.field('spotDate').input().on('focus', function (e, d) {

            if (isNetwrokLogLine) {
                SetMouseCursor(true);
            }
            else {
                SetMouseCursor(false);
            }


            if (d && d.editorSet) return;

            // $(this).select();
        });




        postlogeditor.field('spotTime').input().on('change', function (e, d) {
            if (d && d.editorSet) return;

            try {
                if ($(this).val() == '') {
                    // $(this).val = '';
                    return;
                }
            }
            catch (err) {
                return;
            }

            var spotTime = postlogeditor.field('spotTime');
            spotTime.error('');
            if (spotTime.val() != '') {
                $.ajax({
                    url: '/Logs/ValidateTime',
                    type: 'GET',
                    data: { time: $(this).val() },
                    success: function (result) {
                        if (result.success) {
                            spotTime.val(moment(result.responseText).format("hh:mm:ss a"));
                        }
                        else {
                            spotTime.error(result.responseText);
                        }
                    },
                    error: function (result) {
                        spotTime.error('Invalid input. (0x0006)');
                    }
                });
            }            
        });



        postlogeditor.field('spotTime').input().on('focus', function (e, d) {
            if (isNetwrokLogLine) {
                SetMouseCursor(true);
            }
            else {
                SetMouseCursor(false);
            }

            if (d && d.editorSet) return;

            // $(this).select();
        });


        postlogeditor.on('initCreate', function (e, json) {
            postlogeditor.hide('dayPart.dayPartDesc');
            postlogeditor.hide('postLog.postLogId');
            postlogeditor.hide('clearedPlaced');

            if (default_network_options.length == 0) {
                GetNetworks();
            }

            if (default_daypart_options.length == 0) {
                GetDayParts();
            }

            if (default_buytype_options.length == 0) {
                GetBuyTypes();
            }

            if (default_media_options.length == 0) {
                GetMediaTypes();
            }
        });

        // Set initial values for input boxes
        postlogeditor.on('onInitEdit', function () {
            // START TIME
            //if (postlogeditor.field('property.startTime').val() == '') {
            //    postlogeditor.field('property.startTime').val('');
            //}
            //else {
            //    postlogeditor.field('property.startTime').val(moment(postlogeditor.field('property.startTime').val()).format("hh:mm A"));
            //}

            if (postlogeditor.field('startTime').val() == '') {
                postlogeditor.field('startTime').val('');
            }
            else {
                postlogeditor.field('startTime').val(moment(postlogeditor.field('startTime').val()).format("hh:mm A"));
            }


            // END TIME
            //if (postlogeditor.field('property.endTime').val() == '') {
            //    postlogeditor.field('property.endTime').val('');
            //}
            //else {
            //    postlogeditor.field('property.endTime').val(moment(postlogeditor.field('property.endTime').val()).format("hh:mm A"));
            //}

            if (postlogeditor.field('endTime').val() == '') {
                postlogeditor.field('endTime').val('');
            }
            else {
                postlogeditor.field('endTime').val(moment(postlogeditor.field('endTime').val()).format("hh:mm A"));
            }

            // SPOT DATE
            if (postlogeditor.field('spotDate').val() == '') {
                postlogeditor.field('spotDate').val('');
            }
            else {
                postlogeditor.field('spotDate').val(moment(postlogeditor.field('spotDate').val()).format("MM/DD/YYYY"));
            }

            // SPOT TIME
            if (postlogeditor.field('spotTime').val() == '') {
                postlogeditor.field('spotTime').val('');
            }
            else {
                postlogeditor.field('spotTime').val(moment(postlogeditor.field('spotTime').val()).format("hh:mm:ss A"));
            }
        });

        // Validate prior to submission or saving.  This is used by botH CREATE NEW and EDIT
        postlogeditor.on('preSubmit', function (e, o, action) {
            if (action !== 'remove') {

                // checks if the Editor is open and if 'propertyLineCount' field is displayed.
                // This is needed to allow to update when editor is open in Edit line mode, otherwise throws JS error.
                if ($('#DTE_Field_propertyLineCount').is(":visible")) {
                    var propertyLineCountVal = this.field('propertyLineCount');

                    if (propertyLineCountVal.val().trim() == '') {
                        propertyLineCountVal.error("Please enter count.");
                    }
                    else if (isNaN(parseInt(propertyLineCountVal.val().trim())) == true) {
                        propertyLineCountVal.error("Entered value is not numeric.");
                    }
                    else if (parseInt(propertyLineCountVal.val().trim()) < 0) {
                        propertyLineCountVal.error("Count cannot be less than 1.");
                    }
                    else if (parseInt(propertyLineCountVal.val().trim()) > 10) {
                        propertyLineCountVal.error("Count cannot be greater than 10.");
                    }
                }

                //var networkName = this.field('network.networkId');
                //if (networkName.val() == '') {
                //    networkName.error('Please select a network.');
                //}

                //var dayPartId = this.field('dayPart.dayPartId');
                if (isNetwrokLogLine == false) {
                    var dayPartId = this.field('dayPartId');
                    var propertyDayLength = 1;


                    if (dayPartId.val() == '') {
                        dayPartId.error('Please select day part.');
                    }

                    var propName = this.field('property.propertyName');
                    if (!propName.val() || propName.val() == "") {
                        propName.error('Required');
                    }

                    var daysSelected = false;

                    // checks if the Editor is open and if field is displayed. 
                    // This is needed to allow inline editing of spotDate, spotTime, ISCII & ProgramTitle, otherwise throws JS error.
                    if ($('#DTE_Field_property-monday_0').length) {
                        if ($('#DTE_Field_property-monday_0').is(":checked") && daysSelected == false) {
                            daysSelected = true;
                        }
                    }
                    else {
                        propertyDayLength = 0;
                    }

                    if ($('#DTE_Field_property-tuesday_0').length) {
                        if ($('#DTE_Field_property-tuesday_0').is(":checked") && daysSelected == false) {
                            daysSelected = true;
                        }
                    }
                    else {
                        propertyDayLength = 0;
                    }

                    if ($('#DTE_Field_property-wednesday_0').length) {
                        if ($('#DTE_Field_property-wednesday_0').is(":checked") && daysSelected == false) {
                            daysSelected = true;
                        }
                    }
                    else {
                        propertyDayLength = 0;
                    }

                    if ($('#DTE_Field_property-thursday_0').length) {
                        if ($('#DTE_Field_property-thursday_0').is(":checked") && daysSelected == false) {
                            daysSelected = true;
                        }
                    }
                    else {
                        propertyDayLength = 0;
                    }

                    if ($('#DTE_Field_property-friday_0').length) {
                        if ($('#DTE_Field_property-friday_0').is(":checked") && daysSelected == false) {
                            daysSelected = true;
                        }
                    }
                    else {
                        propertyDayLength = 0;
                    }

                    if ($('#DTE_Field_property-saturday_0').length) {
                        if ($('#DTE_Field_property-saturday_0').is(":checked") && daysSelected == false) {
                            daysSelected = true;
                        }
                    }
                    else {
                        propertyDayLength = 0;
                    }

                    if ($('#DTE_Field_property-sunday_0').length) {
                        if ($('#DTE_Field_property-sunday_0').is(":checked") && daysSelected == false) {
                            daysSelected = true;
                        }
                    }
                    else {
                        propertyDayLength = 0;
                    }

                    var daysSelectedMessage = this.field('property.thursday');

                    if (propertyDayLength != 0 && daysSelected == false) {
                        daysSelectedMessage.error('<span style=color:#b11f1f;font-size:11px;padding-left:0px;> Please select atleast one day.</span>');
                    }



                    /*
                    else {
                        if (isAlphaNumeric(propName.val().replace(/ /g, 'a').replace(/-/g, "b").replace(/_/g, "c").replace(/+/g, "d")) == false) {
                            propName.error('Alphanumeric characters only.');
                        }
                    }
                    */

                    //var startTime = this.field('property.startTime');
                    var startTime = this.field('startTime');
                    if (!startTime.val() && startTime.val() == "") {
                        startTime.error('Required.');
                    }
                    else {
                        if (!startTime.val() && startTime.val() != '') {
                            $.ajax({
                                url: '/Logs/ValidateTime',
                                type: 'GET',
                                data: { time: startTime.val() },
                                success: function (result) {
                                    if (result.success) {
                                        startTime.val(moment(result.responseText).format("hh:mm A"));
                                        startTime.error('');
                                    }
                                    else {
                                        startTime.error('Invalid input. (0x0007)');
                                    }
                                },
                                error: function (result) {
                                    startTime.error('Invalid input. (0x0008)');
                                }
                            });
                        }

                        startTime.input().trigger('change');
                    }

                    //var endTime = this.field('property.endTime');
                    var endTime = this.field('endTime');
                    if (!endTime.val() && endTime.val() == "") {
                        endTime.error('Required.');
                    }
                    else {
                        if (!endTime.val() && endTime.val() != '') {
                            $.ajax({
                                url: '/Logs/ValidateTime',
                                type: 'GET',
                                data: { time: endTime.val() },
                                success: function (result) {
                                    if (result.success) {
                                        endTime.val(moment(result.responseText).format("hh:mm A"));
                                        endTime.error('');
                                    }
                                    else {
                                        endTime.error('Invalid input. (0x0009)');
                                    }
                                },
                                error: function (result) {
                                    endTime.error('Invalid input. (0x0010)');
                                }
                            });
                        }

                        endTime.input().trigger('change');
                    }


                    var propSpotLength = this.field('spotLen');
                    if (!propSpotLength.val() || propSpotLength.val() == "") {
                        propSpotLength.error('Required');
                    }

                    ///*** This validation of BuyTypeId is redundant here as per Brenda. As lines getting to Schedule have a rate and every rate has buyTypeId associated. 
                    //  So if records get to Schedule this validation is done already for BuyTypeId 

                    //var propBuyType = this.field('buyTypeId');
                    //if (!propBuyType.val() || propBuyType.val() == "") {
                    //    propBuyType.error('Required');
                    //}

                    var propRateAmount = this.field('rateAmount');
                    if (!propRateAmount.val() || propRateAmount.val() == "") {
                        propRateAmount.error('Required');
                    }

                    var propImpressions = this.field('imp');
                    if (!propImpressions.val() || propImpressions.val() == "") {
                        propImpressions.error('Required');
                    }


                    // var rateAmt = this.field('rate.rateAmt');
                    var rateAmt = this.field('rateAmount');
                    if (rateAmt.val() != '') {
                        if (isNumber(rateAmt.val()) == false) {
                            rateAmt.error('Invalid input. Decimal expected (0x0011)');
                        }
                    }

                    //var impressions = this.field('rate.impressions');
                    var impressions = this.field('imp');
                    if (impressions.val() != "") {
                        if (isNumber(impressions.val()) == false) {
                            impressions.error('Invalid input. Decimal expected (0x0012)');
                        }
                    }
                }// end if condition for  isNetwrokLogLine == false;

                var spotDate = this.field('spotDate');
                if (networkLogId == null || networkLogId == 0) {
                    if (!spotDate.val() && spotDate.val() != '') {
                        $.ajax({
                            url: '/Logs/ValidateSpotDate',
                            type: 'GET',
                            data: { time: spotDate.val() },
                            success: function (result) {
                                if (result.success) {
                                    spotDate.val(moment(result.responseText).format("hh:mm A"));
                                    spotDate.error('');
                                }
                                else {
                                    spotDate.error('Invalid input. (0x0015');
                                }
                            },
                            error: function (result) {
                                spotDate.error('Invalid input. (0x0016)');
                            }
                        });
                    }
                }
                else {
                    if (spotDate.val() != '' && originalSpotDate != spotDate.val()) {
                        alert("Cannot change networklog line spot date. You can only make it empty.");
                        return false;
                    }
                }

                var spotTime = this.field('spotTime');
                spotTime.error('');
                if (networkLogId == null || networkLogId == 0) {
                    //if (!spotTime.val() || (spotTime.val() && spotTime.val() != '')) {
                    if (spotTime.val() != '') {
                        $.ajax({
                            url: '/Logs/ValidateTime',
                            type: 'GET',
                            data: { time: spotTime.val() },
                            success: function (result) {
                                if (result.success) {
                                    spotTime.val(moment(result.responseText).format("hh:mm:ss A"));
                                }
                                else {
                                    spotTime.error('Invalid input. (0x0013)');
                                }
                            },
                            error: function (result) {
                                spotTime.error('Invalid input. (0x0014)');
                            }
                        });
                        spotTime.input().trigger('change');

                    }
                }
                else {
                    if (spotTime.val() != '' && originalSpotTime != spotTime.val()) {
                        alert("Cannot change networklog line spot time. You can only make it empty.");
                        return false;
                    }
                }

                if (networkLogId != null && networkLogId != 0) {
                    var isciVal = this.field('isci').val();
                    if (isciVal != '' && isciVal != originalIsci) {
                        alert("Cannot change networklog line ISCII You can only make it empty.");
                        return false;
                    }
                }
                // NetID, Qtr, DayPart, Days, Start Time and End Time --> will determine property so let's require this.

                // If any error was reported, cancel the submission so it can be corrected
                if (this.inError()) {
                    return false;
                }
            }
        });

        postlogeditor.on('submitComplete', function (e, json, data, action) {
            if (action == "edit") {

            }
        });

        postlogeditor.on('postSubmit', function (e, json, data, action) {
            if (action === "edit") {
                //json.data = data;
                if (json.success == false) {
                    // json.error = json.responseText;
                }
                /*
                else {
                    var modifier = postlogeditor.modifier();
                    var cell = postlogtable.cell(modifier).node();
                    var colIdx = postlogtable.column(modifier).index();
                    var rowIdx = postlogtable.row(modifier).selector.rows._DT_CellIndex.row;
                    var colStartTime = postlogtable.cell(rowIdx, 9).node();
                    var colEndTime = postlogtable.cell(rowIdx, 10).node();
                    var colSpotDate = postlogtable.cell(rowIdx, 19).node();
                    var colSpotTime = postlogtable.cell(rowIdx, 20).node();
                    var colSpotIsci = postlogtable.cell(rowIdx, 22).node();

                }
                */
            }

            if (action === "create") {
                // json.error = json.responseText;
            }
            //console.log(JSON.parse(json.d).data);
        });

        postlogeditor.on('close', function () {
            DisableEditFields(false);
            isNetwrokLogLine = false;
        });

        postlogeditor.on('open', function (e, mode, action) {
            createWeekNbr = params1.data('weeknbr');
            postlogeditor.field('propertyLineCount').show();
            postlogeditor.field('propertyLineCount').fieldInfo('(1-10)');
            if (isNetwrokLogLine) {
                DisableEditFields(true);
            }
            else {
                DisableEditFields(false);
            }

            $(".DTE_Field_Type_checkbox").css('float', 'left');
            $(".DTE_Field.DTE_Field_Type_checkbox").css('padding-right', '10px');
            $(".DTE_Field.DTE_Field_Type_checkbox").css('padding-top', '6px');

            if ($("div[class*='DTE_Field DTE_Field_Type_checkbox DTE_Field_Name_property.monday']")) {
                $("div[class*='DTE_Field DTE_Field_Type_checkbox DTE_Field_Name_property.monday']").css('float', 'left');
                $("div[class*='DTE_Field DTE_Field_Type_checkbox DTE_Field_Name_property.monday']").css('padding-right', '10px');
                $("div[class*='DTE_Field DTE_Field_Type_checkbox DTE_Field_Name_property.monday']").css('padding-left', '150px');
                $("div[class*='DTE_Field DTE_Field_Type_checkbox DTE_Field_Name_property.monday']").css('padding-top', '0px');
            }

            $(".DTE_Field.DTE_Field_Type_checkbox").removeClass("DTE_Field");
            $(".DTED_Lightbox_Wrapper").draggable();
        });


        /*
        postlogeditor.on('open', function (e, mode, action) {
            if (mode === 'inline') {
                postlogeditor.on('postSubmit.editorInline', function () {
                    var focused = postlogtable.cell({ focused: true });

                    if (focused.any()) {
                        var next = $(focused.node()).next();

                        if (next.length) {
                            postlogeditor.one('submitComplete', function () {
                                postlogtable.cell(next).focus();
                            });
                        }
                    }
                });
            }
        });

        postlogeditor.on('close', function () {
            postlogeditor.off('postSubmit.editorInline');
        });
        */

        $('button.create').on('click', function () {
            isNetwrokLogLine = false;
            postlogeditor
                .title('Insert New Row')
                .buttons('Create')
                .create();
        });

        postlogeditor.field("rateAmount").input().on("keyup", function (e, d) {
            var selectedCountryId = getParameterByName('selectedCountry');
            if (selectedCountryId == 5) {
                this.value = this.value.replace(/[^0-9]/g, '');
            }
        });

        postlogtable = $('#PostLogViewTable').DataTable({
            keys: {
                columns: [22, 23, 25, 26,27],
                //columns: [21, 22, 24, 25, 26],
                //columns: [23, 24, 24, 25, 26],
                editor: postlogeditor,
                editorKeys: 'tab-only'
            },
            lengthMenu: [[20000], [20000]],
            //orderable: true,
            dom: 'Brt<"bottom"f><"clear">',
            ajax: {
                url: '/Logs/GetPostLogLines',
                type: 'POST',
                data: {
                    postlogid: getParameterByName('postlogid'),
                    lock: true

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
            //Duplicate row
            select: {
                style: 'os',
                selector: 'td:first-child'//,
                //blurable: true
            },
            columns: [
                //Duplicate row
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
                    data: "network.stdNetName",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true
                },
                {
                    targets: 2,
                    data: "property.propertyName",
                    class: "d-none d-sm-table-cell text-center",
                    orderable: true
                },
                {
                    targets: 3,
                    data: "property.monday",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (data, type, row, meta) {
                        if (data === true) {
                            //var icon = row.childPropertyId == 0 || row.childPropertyId == null ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            var icon = !row.isDOWChanged ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            return icon;
                        }
                        else {
                            return "";
                        }
                    },
                    orderable: true
                },
                {
                    targets: 4,
                    data: "property.tuesday",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (data, type, row, meta) {
                        if (data === true) {
                            //var icon = row.childPropertyId == 0 || row.childPropertyId == null ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            var icon = !row.isDOWChanged ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            return icon;
                        }
                        else {
                            return "";
                        }
                    },
                    orderable: true
                },
                {
                    targets: 5,
                    data: "property.wednesday",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (data, type, row, meta) {
                        if (data === true) {
                            //var icon = row.childPropertyId == 0 || row.childPropertyId == null ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            var icon = !row.isDOWChanged ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            return icon;
                        }
                        else {
                            return "";
                        }
                    },
                    orderable: true
                },
                {
                    targets: 6,
                    data: "property.thursday",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (data, type, row, meta) {
                        if (data === true) {
                            //var icon = row.childPropertyId == 0 || row.childPropertyId == null ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            var icon = !row.isDOWChanged ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            return icon;
                        }
                        else {
                            return "";
                        }
                    },
                    orderable: true
                },
                {
                    targets: 7,
                    data: "property.friday",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (data, type, row, meta) {
                        if (data === true) {
                            //var icon = row.childPropertyId == 0 || row.childPropertyId == null ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            var icon = !row.isDOWChanged ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            return icon;
                        }
                        else {
                            return "";
                        }
                    },
                    orderable: true
                },
                {
                    targets: 8,
                    data: "property.saturday",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (data, type, row, meta) {
                        if (data === true) {
                            //var icon = row.childPropertyId == 0 || row.childPropertyId == null ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            var icon = !row.isDOWChanged ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            return icon;
                        }
                        else {
                            return "";
                        }
                    },
                    orderable: true
                },
                {
                    targets: 9,
                    data: "property.sunday",
                    class: "d-none d-sm-table-cell text-center",
                    render: function (data, type, row, meta) {
                        if (data === true) {
                            //var icon = row.childPropertyId == 0 || row.childPropertyId == null ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            var icon = !row.isDOWChanged ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-circle' style='color: #2971B9;'></i>";
                            return icon;
                        }
                        else {
                            return "";
                        }
                    },
                    orderable: true
                },
                {
                    targets: 10,
                    //data: "property.startTime",
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
                    // render: function (d) {
                    //    if (d && d.length > 0 && d.substr(0, 1) == "0")
                    //        return d.substr(1);
                    //    else
                    //        return d;
                    //}
                },
                {
                    targets: 11,
                    //data: "property.endTime",
                    data: "endTime",
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

                    //render: function (d) {
                    //    if (d && d.length > 0 && d.substr(0, 1) == "0")
                    //        return d.substr(1);
                    //    else
                    //        return d;
                    //}
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
                },

            ],
            buttons: [
                {
                    text: 'Add Duplicate Property',
                    enabled: false,

                    action: function (dt) {
                        swal({
                            title: "",
                            text: 'Are you sure you want to duplicate selected Property?',
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
                        }).then(() => {
                            var params = $("#postLogParams");
                            var postLogId = params.val();

                            swal({
                                showCancelButton: true,
                                html: 'Enter Duplicate Property Count (1-10): <input id="txtAddDuplicatePropertyCount" autofocus class="form-control swal2-input">',
                                preConfirm: function (selectedOption) {
                                    return new Promise(function (resolve) {
                                        var duplicatePropertyCount = document.getElementById('txtAddDuplicatePropertyCount').value;
                                        if (isNaN(duplicatePropertyCount)) {
                                            throw new Error("Entered value is not a numeric. Please enter valid number (1-10).")
                                        }
                                        if (duplicatePropertyCount > 10) {
                                            throw new Error("Count cannot be greater than 10.")
                                        }
                                        else {
                                            resolve({ value: document.getElementById('txtAddDuplicatePropertyCount').value });
                                        }
                                    });
                                    //    .catch(error => {
                                    //    swal.showValidationError(
                                    //        `Request failed: ${error}`
                                    //    )
                                    //});
                                },
                                onOpen: function () {
                                    $('#txtAddDuplicatePropertyCount').focus();
                                }

                            }).then(function (result) {
                                var propertyDuplicateCount = result.value;
                                $.ajax({
                                    url: '/Logs/PostlogAddDuplicateProperty',
                                    type: 'POST',
                                    data: { postLogId, selectedDuplicatePropertyId, propertyDuplicateCount },
                                    cache: false,
                                    success: function (result) {
                                        postlogtable.ajax.reload(null, false);
                                        selectedDuplicatePropertyId = 0;
                                        postlogtable.button(0).enable(false);
                                        swal({
                                            title: "Result",
                                            text: result.responseText,
                                            //type: 'success',
                                        });
                                    },
                                    error: function (response) {
                                        swal({
                                            title: "Error",
                                            text: response.responseText,
                                            type: 'error',
                                        });
                                    }
                                });
                            }).catch(swal.noop)
                        });
                    }
                },
                {
                    text: 'Save Changes',
                    action: function (dt) {
                        swal({
                            title: "",
                            text: 'Are you sure you want to Save?',
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
                        }).then(() => {
                            var params = $("#postLogParams");
                            var postlogId = params.val();
                            var weekNbr = params.data('weeknbr');
                            var weekDate = params.data('weekdate');
                            var clientId = params.data('clientid');

                            $.ajax({
                                url: '/Logs/PostlogSaveChanges',
                                type: 'POST',
                                data: { postlogId, weekNbr, weekDate, clientId },
                                cache: false,
                                //success: function (result) {
                                //    promptExit(0);
                                //    swal({
                                //        title: "Result",
                                //        text: result.responseText,
                                //        //type: 'success',
                                //    });
                                //    setTimeout(function () { location.reload(); }, 1000);
                                success: function (result) {
                                    swal({
                                        title: "Result",
                                        text: result.responseText,
                                    }).then(
                                        function (result) {                                            
                                            promptExit(0);
                                            isDataSavedToActulize = true;
                                            PostLogRealTimeReport(clientId);
                                            // Reloading the page should lock it again.
                                            window.location.reload();
                                        });
                                },
                                error: function (response) {
                                    swal({
                                        title: "Error",
                                        text: response.responseText,
                                        type: 'error',
                                    });
                                }
                            });
                        });
                    }
                },
                { extend: "create", editor: postlogeditor },
                'copy',
                //{
                //    extend: 'excelHtml5',
                //    messageTop: 'The information in this table is copyright to Ocean Media, Inc.',
                //    customize: function (xlsx) {
                //        var sheet = xlsx.xl.worksheets['sheet1.xml'];
                //        var selectedCountryId = getParameterByName('selectedCountry');

                //        $('c[r=A3] t', sheet).text('Network');
                //        $('c[r=B3] t', sheet).text('PROPERTY');
                //        $('c[r=J3] t', sheet).text('START TIME');
                //        $('c[r=K3] t', sheet).text('END TIME');
                //        $('c[r=L3] t', sheet).text('DP');
                //        $('c[r=M3] t', sheet).text('SP BUY');
                //        $('c[r=N3] t', sheet).text('OMDP');
                //        $('c[r=O3] t', sheet).text('LEN');
                //        $('c[r=P3] t', sheet).text('BUY TYPE');
                //        $('c[r=Q3] t', sheet).text('FULL RATE');
                //        $('c[r=R3] t', sheet).text('RATE');
                //        $('c[r=S3] t', sheet).text('USD GROSS RATE');
                //        $('c[r=T3] t', sheet).text('IMP');
                //        $('c[r=U3] t', sheet).text('CPM');
                //        $('c[r=V3] t', sheet).text('SPOT DATE');
                //        $('c[r=W3] t', sheet).text('SPOT TIME');
                //        $('c[r=X3] t', sheet).text('MEDIA TYPE');
                //        $('c[r=Y3] t', sheet).text('ISCI');
                //        $('c[r=Z3] t', sheet).text('PROGRAM');
                //        $('c[r=AA3] t', sheet).text('CLEARED');
                //        $('c[r=AB3] t', sheet).text('DAYPART');
                //        $('c[r=AC3] t', sheet).text('COMM RATE %');
                //        $('c[r=AD3] t', sheet).text('CA CONV. RATE %');

                //        //Align Text - 50 (left), 51 (center), 52 (right)
                //        $('row c[r^="A"]', sheet).attr('s', '50');
                //        $('row c[r^="B"]', sheet).attr('s', '50');
                //        $('row c[r^="J"]', sheet).attr('s', '50');
                //        $('row c[r^="K"]', sheet).attr('s', '50');
                //        $('row c[r^="M"]', sheet).attr('s', '50');
                //        $('row c[r^="N"]', sheet).attr('s', '50');
                //        $('row c[r^="O"]', sheet).attr('s', '50');
                //        $('row c[r^="P"]', sheet).attr('s', '50');
                //        $('row c[r^="Q"]', sheet).attr('s', '50');
                //        $('row c[r^="R"]', sheet).attr('s', '50');
                //        $('row c[r^="S"]', sheet).attr('s', '50');
                //        $('row c[r^="T"]', sheet).attr('s', '50');
                //        $('row c[r^="U"]', sheet).attr('s', '50');
                //        $('row c[r^="V"]', sheet).attr('s', '50');
                //        $('row c[r^="W"]', sheet).attr('s', '50');
                //        $('row c[r^="X"]', sheet).attr('s', '50');
                //        $('row c[r^="y"]', sheet).attr('s', '50');

                //        //Centerr align weekdays Monday-Sunday data
                //        $('row c[r^="C"]', sheet).attr('s', '51');
                //        $('row c[r^="D"]', sheet).attr('s', '51');
                //        $('row c[r^="E"]', sheet).attr('s', '51');
                //        $('row c[r^="F"]', sheet).attr('s', '51');
                //        $('row c[r^="G"]', sheet).attr('s', '51');
                //        $('row c[r^="H"]', sheet).attr('s', '51');
                //        $('row c[r^="I"]', sheet).attr('s', '51');

                //        //Set excel header row - with bold text and light green color background
                //        $('row c', sheet).each(function () {
                //            //select the index of the row
                //            var rowIndex = $(this).parent().index();
                //            if (rowIndex == 2) {
                //                $(this).attr('s', '42');
                //            }
                //        });

                //    },
                //    exportOptions: {
                //        // columns to display in excel export
                //        //Added datatable column - MEDIA TYPE index 23, OMDP - index 14, COMM RATE - index 29 
                //        columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,28,30,31],
                //        format: {
                //            body: function (data, row, column, node) {
                //                var selectedCountryId = getParameterByName('selectedCountry');

                //                // data formatting for Mon - Sun column
                //                if (column === 2 || column === 3 || column === 4 || column === 5 || column === 6 || column === 7 || column === 8) {
                //                    if (data === "<i class='fa fa-circle'></i>")
                //                        return "X";
                //                }
                //                else if (column == 14) { // data formatting for Spot Length column
                //                    if (data.includes("15")) { return "15"; }
                //                    else if (data.includes("30")) { return "30"; }
                //                    else if (data.includes("60")) { return "60"; }
                //                    else if (data.includes("120")) { return "120" };
                //                }
                //                else {
                //                    return data;
                //                }

                //                if (selectedCountryId == 2) {
                //                    if (column == 29 || column == 30) { // data formatting for COMM RATE column
                //                        data = data.replace('%', '');
                //                        return data;
                //                    }
                //                    else {
                //                        return data;
                //                    }
                //                }
                //                else if (selectedCountryId == 5) {
                //                    if (column == 28) { // data formatting for COMM RATE column
                //                        data = data.replace('%', '');
                //                        return data;
                //                    }
                //                    else {
                //                        return data;
                //                    }
                //                }
                //            }
                //        }
                //    }

                //}
            ],
            drawCallback: function () {
                $("#btnPostLogMoveSpotData").attr('disabled', 'disabled');
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

                //$("td:eq(20)", row).removeClass("pending-change");
                //$("td:eq(21)", row).removeClass("pending-change");
                //$("td:eq(22)", row).removeClass("pending-change");
                //$("td:eq(23)", row).removeClass("pending-change");

                //if (data.origSpotDate != data.spotDate) {
                //    $("td:eq(20)", row).addClass("pending-change");
                //}
                //if (data.origSpotTime != data.spotTime) {
                //    $("td:eq(21)", row).addClass("pending-change");
                //}
                //if (data.origISCI != data.isci) {
                //    $("td:eq(22)", row).addClass("pending-change");
                //}
                //if (data.origProgramTitle != data.programTitle) {
                //    $("td:eq(23)", row).addClass("pending-change");
                //}
                var selectedCountryId = getParameterByName('selectedCountry');

                if (selectedCountryId == 5) {
                    $("td:eq(21)", row).removeClass("pending-change");
                    $("td:eq(22)", row).removeClass("pending-change");
                    $("td:eq(23)", row).removeClass("pending-change");
                    $("td:eq(24)", row).removeClass("pending-change");

                    if (data.origSpotDate != data.spotDate) {
                        $("td:eq(21)", row).addClass("pending-change");
                    }
                    if (data.origSpotTime != data.spotTime) {
                        $("td:eq(22)", row).addClass("pending-change");
                    }
                    if (data.origISCI != data.isci) {
                        $("td:eq(24)", row).addClass("pending-change");
                    }
                    if (!data.isValidISCI) {
                        $("td:eq(24)", row).addClass("pending-change");
                    }
                    if (data.origProgramTitle != data.programTitle) {
                        $("td:eq(25)", row).addClass("pending-change");
                    }
                }

                if (selectedCountryId == 2) {
                    $("td:eq(22)", row).removeClass("pending-change");
                    $("td:eq(23)", row).removeClass("pending-change");
                    $("td:eq(24)", row).removeClass("pending-change");
                    $("td:eq(25)", row).removeClass("pending-change");

                    if (data.origSpotDate != data.spotDate) {
                        $("td:eq(22)", row).addClass("pending-change");
                    }
                    if (data.origSpotTime != data.spotTime) {
                        $("td:eq(23)", row).addClass("pending-change");
                    }
                    if (data.origISCI != data.isci) {
                        $("td:eq(25)", row).addClass("pending-change");
                    }
                    if (!data.isValidISCI) {
                        $("td:eq(25)", row).addClass("pending-change");
                    }
                    if (data.origProgramTitle != data.programTitle) {
                        $("td:eq(26)", row).addClass("pending-change");
                    }
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
                    $("td:eq(1)", row).css("background-color", "#66FF33");
                }

                if (data.networkLogId != null) {
                    $("td:eq(1)", row).css("background-color", "#66FF33");
                    $("td:eq(1)", row).css("color", "white");
                }

                if (data.property.propertyId == null || data.property.propertyId == 0) {
                    //$("td:eq(0)", row).css("background-color", "green");
                    //$("td:eq(0)", row).css("color", "white");
                    //$(row).css("color", "red");
                }


            },
            initComplete: function (settings, json) {
                $('#PostLogViewTable').excelTableFilter();
                CalculateTotals();
                postlogtable.buttons().container().appendTo($(".divButtons"));
                postlogeditor.field('network.networkId').update(default_network_options);

                //postlogeditor.field('dayPart.dayPartId').update(default_daypart_options);
                postlogeditor.field('dayPartId').update(default_daypart_options);

                //postlogeditor.field('buyType.buyTypeId').update(default_buytype_options);
                postlogeditor.field('buyTypeId').update(default_buytype_options);

                //postlogeditor.field('mediaType.mediaTypeId').update(default_media_options);

                document.body.style.width = ($("#PostLogViewTable").width() + 120) + 'px';

                $(".cb-dropdown-wrap").each(function () {
                    $(this).width($(this).parent().width());
                });

                //this.api().columns('.HeaderType').every(function () {
                //    var column = this;
                //    var select = $('<select><option value=""></option></select>');
                //    if ($(column.header()).hasClass("HeaderCPM")) {

                //        var sortFunction = function (a, b) {
                //            if (a < b) return -1;
                //            if (a > b) return 1;
                //            return 0;
                //        };
                //        column.data().unique().sort(sortFunction);
                //        //column.data().unique().sort(sortFunction).each(function (d, j) {
                //        //    select.append('<option value="' + d + '">' + d + '</option>')
                //        //});
                //    }
                //});

                //this.api().columns(21).every(function () {
                //    var column = this;
                //    var select = $('<select><option value=""></option></select>')
                //    var sortFunction = function (a, b) {
                //        if (a < b) return -1;
                //        if (a > b) return 1;
                //        return 0;
                //    };
                //    column.data().unique().sort(sortFunction).each(function (d, j) {
                //        select.append('<option value="' + d + '">' + d + '</option>')
                //    });
                //});

            }
        }).on('stateSaveParams.dt', function (e, settings, data) {
            // data.search.search = "";
        });

        postlogtable
            .on('key', function (e, datatable, key, cell, originalEvent) {
                console.log('Key press: ' + key + ' for cell <i>' + cell.data() + '</i>');
            })
            .on('key-focus', function (e, datatable, cell) {
                console.log('Cell focus: <i>' + cell.data() + '</i>');
            })
            .on('key-blur', function (e, datatable, cell) {
                console.log('Cell blur: <i>' + cell.data() + '</i>');
            })
    }
}


function PostLogRealTimeReport(clientId) {    
    $.ajax({
        url: "/Logs/PostLogRealTimeReport",
        data: { clientId },
        cache: false,
        type: "POST",
        success: function (result) {           
        },
        error: function (response) {
        }
    });
}
function SetMouseCursor(mouseStyleChange) {
    if (mouseStyleChange) {
        //$("#DTE_Field_spotDate").css(mousecursor_not_allowed_css_class);
        //$("#DTE_Field_spotTime").css(mousecursor_not_allowed_css_class);
        $("#DTE_Field_spotLen").css(mousecursor_not_allowed_css_class);
        $("#DTE_Field_rateAmount").css(mousecursor_not_allowed_css_class);
        //$("#DTE_Field_isci").css(mousecursor_not_allowed_css_class);
    }
    else {
        //$("#DTE_Field_spotDate").css(mousecursor_pointer_css_class);
        //$("#DTE_Field_spotTime").css(mousecursor_pointer_css_class);
        $("#DTE_Field_spotLen").css(mousecursor_pointer_css_class);
        $("#DTE_Field_rateAmount").css(mousecursor_pointer_css_class);
        //$("#DTE_Field_isci").css(mousecursor_pointer_css_class);
    }
}


function DisableEditFields(isDisable) {
    if (isDisable) {
        $("#DTE_Field_rateAmount").attr("readonly", true);
        $("#DTE_Field_network-networkId").attr("disabled", true);
        $("#DTE_Field_spotLen").attr("disabled", true);
        //$("#DTE_Field_spotDate").attr("readonly", true);
        //postlogeditor.disable('spotDate');
        //postlogeditor.disable('spotTime');

        //if ($("#DTE_Field_programTitle").val().trim() != "") {
        //    $("#DTE_Field_programTitle").attr("readonly", true);
        //}

        //if ($("#DTE_Field_isci").val().trim() != "") {
        //    $("#DTE_Field_isci").attr("readonly", true);
        //}
    }
    else {
        $("#DTE_Field_rateAmount").attr("readonly", false);
        $("#DTE_Field_rateAmount").attr("readonly", false);
        $("#DTE_Field_network-networkId").attr("disabled", false);
        $("#DTE_Field_spotLen").attr("disabled", false);
        postlogeditor.enable('spotDate');
        postlogeditor.enable('spotTime');
        //$("#DTE_Field_programTitle").attr("readonly", false);
        //$("#DTE_Field_isci").attr("readonly", false);
    }
}


$(document).ready(function () {
    GetNetworks();
    GetDayParts();
    GetBuyTypes();
    GetMediaTypes();
    initPostLogEditTable();
    postlogtable.on('select deselect', function () {
        var selectedRows = postlogtable.rows({ selected: true }).count();
        postlogtable.button(0).enable(selectedRows === 1);
        if (selectedRows >= 1) {
            $("#btnPostLogMoveSpotData").removeAttr('disabled');
        } else {
            $("#btnPostLogMoveSpotData").attr('disabled', 'disabled');
        }
    });


    var selectedCountryId = getParameterByName('selectedCountry');
    var usdGorssRateIndex = $('th:contains("USD GROSS RATE")').index();
    var caConvRateIndex = $('th:contains("CA CONV. RATE")').index() + 1;
    if (selectedCountryId == 5) {
        postlogtable.column(usdGorssRateIndex).visible(false);
        postlogtable.column(caConvRateIndex).visible(false);
        //postlogtable.Columns.RemoveAt(usdGorssRateIndex);
        //postlogtable.Columns.RemoveAt(caConvRateIndex);
    }
});

function actualizePostLog() {
    if (isDataSavedToActulize == false) {
        swal({
            title: "Error",
            text: "Please save changes before actualize.",
            type: 'error',
        });
        return false;
    }
    else {
        swal({
            title: "",
            text: 'Are you sure you want to actualize?',
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
        }).then(() => {

            var params = $("#postLogParams");
            var postlogId = params.val();
            var weekNbr = params.data('weeknbr');
            var weekDate = params.data('weekdate');
            var clientId = params.data('clientid');

            $.ajax({
                url: '/Logs/ActualizePostLog',
                type: 'POST',
                data: { postlogId, weekNbr, weekDate, clientId },
                cache: false,
                success: function (result) {
                    //alert('finished actualize');
                    //console.log(result);                    
                    swal({
                        title: "Result",
                        text: result.responseText,
                        //type: 'success',
                    }).then(
                        function () {
                            if (result.success) {
                                ActualizeGlobalPostLogAccountingReports(postlogId, weekNbr, clientId, weekDate);
                                AssignMirrorBuyType(clientId);
                                window.location.reload();
                            }
                        });
                },
                error: function (response) {
                    swal({
                        title: "Error",
                        text: response.responseText,
                        type: 'error',
                    });
                }
            });
        });
    }

}
function AssignMirrorBuyType(clientId) {   
    $.ajax({
        url: "/Logs/AssignMirrorBuyType",
        data: { clientId},
        cache: false,
        type: "POST",
        success: function (result) {
            if (result.success == true) {
            }
            else {
            }

        },
        error: function (response) {
        }

    });
}
function ActualizeGlobalPostLogAccountingReports(postlogId, weekNbr, clientId, weekDate) {
    var usrId = 0;
    $.ajax({
        url: "/Logs/ActualizeGlobalPostLogAccountingReports",
        data: { postlogId, weekNbr, weekDate, clientId, usrId },
        cache: false,
        type: "POST",
        success: function (result) {
            if (result.success == true) {
            }
            else {
            }

        },
        error: function (response) {
        }

    });
}


function SavePostLogNote(postLogId) {
    if ($("#txtNote").val() == "")
        return false;
    $.ajax({
        url: "/Logs/AddPostLogNote",
        data: {
            note: $("#txtNote").val(),
            postLogId: postLogId
        },
        cache: false,
        type: "POST",
        success: function (result) {
            if (result.success == true) {
                GetPostLogNotes();
                var notify = $.notify(result.responseText, {
                    type: 'success',
                    allow_dismiss: true
                });
                $("#txtNote").val("");
            }
            else {
                var notify = $.notify(result.responseText, {
                    type: 'danger',
                    allow_dismiss: true
                });
            }

        },
        error: function (response) {
            var notify = $.notify(response.responseText, {
                type: 'danger',
                allow_dismiss: true
            });
        }

    });
}

function AddPostLogSubNote(postLogNoteId) {
    swal({
        html: "Enter comment to note: <input id='txtSubNote' autofocus class='form-control swal2-input'>",
        preConfirm: function (selectedOption) {
            return new Promise(function (resolve, reject) {
                if ($("#txtSubNote").val()) {
                    resolve({ value: document.getElementById('txtSubNote').value });
                }
                else {
                    reject("Please enter comment to note.");
                }
            });
        },
        onOpen: function () {
            $("#txtSubNote").focus();
        }
    }).then(function (result) {
        SavePostLogSubNote(postLogNoteId, result.value);
    }).catch(swal.noop)
}

function SavePostLogSubNote(postLogNoteId, note) {
    $.ajax({
        url: "/Logs/AddPostLogSubNote",
        data: {
            postLogNoteId: postLogNoteId,
            note: note
        },
        cache: false,
        type: "POST",
        success: function (result) {
            if (result.success == true) {
                GetPostLogNotes();
                var notify = $.notify(result.responseText, {
                    type: 'success',
                    allow_dismiss: true
                });
                $("#txtSubNote").val("");
            }
            else {
                var notify = $.notify(result.responseText, {
                    type: 'danger',
                    allow_dismiss: true
                });
            }

        },
        error: function (response) {
            var notify = $.notify(response.responseText, {
                type: 'danger',
                allow_dismiss: true
            });
        }

    });
}

function GetPostLogNotes() {
    $.ajax({
        url: "/Logs/GetPostLogNotes",
        data: { postlogid: getParameterByName("postlogid") },
        type: "GET",
        success: function (result) {
            var markup = "";
            $.each(result, function (key, value) {
                var postLogNoteId = value.postLogNoteId;
                if (value.parentNoteId == null) {
                    markup += "<tr>";
                    markup += "<td class='d-none d-sm-table-cell bg-secondary-light'>" + moment(value.createDt).format("MM/DD/YYYY HH:mm:ss") + "</td>";
                    markup += "<td class='d-none d-sm-table-cell bg-secondary-light'>" + value.displayName + "</td>";
                    markup += "<td class='font-w600 bg-secondary-light'>" + value.note + "</td>";
                    markup += "<td class='d-none d-sm-table-cell text-center bg-secondary-light'>";
                    markup += "<button type='button' class='btn btn-sm btn-alt-secondary' id='btnAdd-" + postLogNoteId + "' name='btnAdd-" + postLogNoteId + "' onclick='javascript: AddPostLogSubNote(" + postLogNoteId + ");'>Add</button>";
                    markup += "</td>";
                    markup += "</tr>";
                }
                else {
                    markup += "<tr>";
                    markup += "<td class='d-none d-sm-table-cell'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i>" + moment(value.createDt).format("MM/DD/YYYY  HH:mm:ss") + "</i></td>";
                    markup += "<td class='d-none d-sm-table-cell'><i>" + value.displayName + "</i></td>";
                    markup += "<td class='font-w600'><i>" + value.note + "</i></td>";
                    markup += "<td class='d-none d-sm-table-cell text-center'></td>";
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

function PostLogGetPropertyDetails() {
    var markup = "";
    var _postLogId = GetParameterValues("postlogid");
    $("#divPropertyDetails tbody").html(markup);
    if (postlogtable.rows({ selected: true }).count() == 0) {
        swal("", "Please select the network log line.", "error");
        return false;
    }
    var _postLogLineIds = "";
    $.each(postlogtable.rows({ selected: true }).data(), function (key, value) {
        if (key == 0) {
            _postLogLineIds = value.pLineID;
        } else {
            _postLogLineIds += "," + value.pLineID;
        }
    });
    $.ajax({
        url: "/Logs/PostLogGetPropertyDetails",
        data: {
            PostLogId: _postLogId, PostLogLineIds: _postLogLineIds
        },
        type: "GET",
        success: function (result) {
            if (result.success) {
                $.each(result.result, function (key, value) {
                    markup += "<tr>";
                    markup += "<td class='d-none d-sm-table-cell'><input type='radio' name='pl' postloglineid=" + value.pLineID + "></td></td>";
                    markup += "<td class='d-none d-sm-table-cell'><i>" + value.propertyName + "</i></td>";
                    markup += (value.monday) ? "<td class='d-none d-sm-table-cell'><i class='fa fa-circle'></i></td>" : "<td class='d-none d-sm-table-cell'></td>";
                    markup += (value.tuesday) ? "<td class='d-none d-sm-table-cell'><i class='fa fa-circle'></i></td>" : "<td class='d-none d-sm-table-cell'></td>";
                    markup += (value.wednesday) ? "<td class='d-none d-sm-table-cell'><i class='fa fa-circle'></i></td>" : "<td class='d-none d-sm-table-cell'></td>";
                    markup += (value.thursday) ? "<td class='d-none d-sm-table-cell'><i class='fa fa-circle'></i></td>" : "<td class='d-none d-sm-table-cell'></td>";
                    markup += (value.friday) ? "<td class='d-none d-sm-table-cell'><i class='fa fa-circle'></i></td>" : "<td class='d-none d-sm-table-cell'></td>";
                    markup += (value.saturday) ? "<td class='d-none d-sm-table-cell'><i class='fa fa-circle'></i></td>" : "<td class='d-none d-sm-table-cell'></td>";
                    markup += (value.sunday) ? "<td class='d-none d-sm-table-cell'><i class='fa fa-circle'></i></td>" : "<td class='d-none d-sm-table-cell'></td>";
                    markup += "<td class='d-none d-sm-table-cell'><i>" + moment(value.startTime).format("hh:mm A") + "</i></td>";
                    markup += "<td class='d-none d-sm-table-cell'><i>" + moment(value.endTime).format("hh:mm A") + "</i></td>";
                    markup += "<td class='d-none d-sm-table-cell'><i>" + value.dayPartCd + "</i></td>";
                    markup += "<td class='d-none d-sm-table-cell'><i>" + value.omdp + "</i></td>";
                    markup += "<td class='d-none d-sm-table-cell'><i>" + value.buyTypeCode + "</i></td>";
                    markup += "<td class='d-none d-sm-table-cell'><i>" + value.rateAmount + "</i></td>";
                    markup += "<td class='d-none d-sm-table-cell'><i>" + value.imp + "</i></td>";
                    markup += "</tr>";
                });
                $("#divPropertyDetails tbody").html(markup);
                $("#divPropertyDetails").modal("show");
            }
            else {
                swal("Error!", result.responseText, "error");
            }
        },
        error: function (response) {
            swal("Error!", error.responseText, "error");
        }
    });

}
function PostLogCopyProprtyDetails() {
    if ($("#tblPropertydetails tbody tr:has(input:checked) td").length == 0) {
        swal("", "Please select the property that you would like to apply to this line.", "error");
        return false;
    }
    var _postLogId = GetParameterValues("postlogid");
    var selectedRow = "<tr>";
    var headerRow = "<tr>";
    var _postLogLineId = "";
    $("#tblPropertydetails tbody tr:has(input:checked) td").each(function (key, value) {
        if (key == 0) {
            _postLogLineId = $("input", this).attr("postloglineid");
        }
        else if (key > 0) {
            selectedRow += "<td>" + $(this).html() + "</td>";
        }
    });
    selectedRow += "</tr>";
    $("#tblPropertydetails thead tr th").each(function (key, value) {
        if (key > 0) {
            headerRow += "<th>" + $(this).html() + "</th>";
        }
    });
    headerRow += "</tr>";
    var _postLogLineIds = "";
    $.each(postlogtable.rows({ selected: true }).data(), function (key, value) {
        if (key == 0) {
            _postLogLineIds = value.pLineID;
        } else {
            _postLogLineIds += "," + value.pLineID;
        }
    });
    swal({
        title: "",
        html: "Please confirm this property is the property you would like to apply to this line." +
            "<table class='table table-bordered table-vcenter js-dataTable-simple'><thead>" + headerRow + "</thead>" + "<tbody>" + selectedRow + "</tbody></table>",
        type: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        width: 1500,
        preConfirm: function () {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    resolve();
                }, 50);
            });
        }
    }).then(
        function (result) {
            $.ajax({
                url: "/Logs/PostLogCopyPropertyDetails",
                type: "POST",
                data: {
                    PostLogId: _postLogId,
                    PostLogLineId: _postLogLineId,
                    PostLogLineIds: _postLogLineIds
                },
                success: function (result) {
                    if (result.success) {
                        swal("", result.responseText, "success");
                        $("#divPropertyDetails").modal("hide");
                        postlogtable.ajax.reload(null, false);
                    }
                    else {
                        swal("Error!", result.responseText, "error");
                    }

                },
                error: function (response) {
                    swal("Error!", response.responseText, "error");
                }
            })
        });

}

$('#btnPostlogEditExport').click(function () {
    var _postlogid = GetParameterValues('postlogid');
    var params = [
        'height=' + screen.height - 50,
        'width=' + screen.width - 50,
        'resizable=yes',
        'scrollbars=yes'
    ].join(',');

    var selectedCountryId = getParameterByName('selectedCountry');

    window.location.href = "/Logs/PostlogViewExcelExport?postlogid=" + _postlogid + "&countryID=" + selectedCountryId;
});

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [month, day, year].join('/');
}

function AddNetworkLine() {

    document.getElementById('abc').style.display = "block";
    populateNetworkList();
}

function check_empty() {
    if (document.getElementById('nwSelectNetwork').value.trim() == "Select network") {
        alert("To add networkline - Please select the network");
        return false;
    }

    if (
        document.getElementById('nwProduct').value.trim() == "" ||
        document.getElementById('nwSpotDate').value.trim() == "" ||
        document.getElementById('nwSpotTime').value.trim() == "" ||
        document.getElementById('nwSpotLen').value.trim() == "" ||
        document.getElementById('nwISCICode').value.trim() == "" ||
        document.getElementById('nwSpotRate').value.trim() == ""
    )
    {
        alert("Enter all fields value to add netrowk line!");
    } else {
        postLogAddNetworkLine();
        //document.getElementById('form').submit();
        //alert("Form Submitted Successfully...");
    }
}

function populateNetworkList() {
    var select = document.getElementById("nwSelectNetwork");

    for (var i = 0; i < default_network_options.length; i++) {
        var opt = default_network_options[i];
        var el = document.createElement("option");
        el.textContent = opt.label;
        el.value = opt.value;
        select.appendChild(el);
    }
}


function ClearFields() {
    document.getElementById('nwProduct').value = "";
    document.getElementById('nwSpotDate').value = "";
    document.getElementById('nwSpotTime').value = "";
    document.getElementById('nwSpotLen').value = "";
    document.getElementById('nwISCICode').value = "";
    document.getElementById('nwSpotRate').value = "";
    document.getElementById('nwProgram').value = "";
}

function postLogAddNetworkLine() {

    swal({
        title: "",
        text: 'Are you sure you want to add network log line?',
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
    }).then(() => {

        //var params = $("#postLogParams");
        //var postlogId = params.val();
        //var weekNbr = params.data('weeknbr');
        //var weekDate = params.data('weekdate');
        //var clientId = params.data('clientid');
        var nwSelectNetwork = document.getElementById('nwSelectNetwork').value.trim();
        var nwClientId = document.getElementById('nwClientId').value.trim();
        var nwSelectCountry = document.getElementById('nwSelectCountry').value.trim();
        var nwProduct = document.getElementById('nwProduct').value.trim();
        var nwSpotDate = document.getElementById('nwSpotDate').value.trim();
        var nwSpotTime = document.getElementById('nwSpotTime').value.trim();
        var nwSpotLen = document.getElementById('nwSpotLen').value.trim();
        var nwISCICode = document.getElementById('nwISCICode').value.trim();
        var nwSpotRate = document.getElementById('nwSpotRate').value.trim();
        var nwProgram = document.getElementById('nwProgram').value.trim();
        var hdnNwWeekOf = document.getElementById('hdnNwWeekOf').value.trim();


        $.ajax({
            url: '/Logs/AddNetworkLine',
            type: 'POST',
            data: {
                nwSelectNetwork, nwClientId, nwSelectCountry, nwProduct,nwSpotDate, nwSpotTime, nwSpotLen, nwISCICode, nwSpotRate, nwProgram, nwProgram, hdnNwWeekOf
            },
            cache: false,
            success: function (result) {
                if (result.success == true) {
                    ClearFields();
                }
                swal({
                    title: "Result",
                    text: result.responseText,
                });
            },
            error: function (response) {
                swal({
                    title: "Error",
                    text: response.responseText,
                    type: 'error',
                });
            }
        });
    });
}


function PostLogClearSpotData() {

    if (postlogtable.rows({ selected: true }).data().count() == 0) {
        swal("", "Please select the lines that you would like to clear spot data.", "error");
        return false;
    }

    var params = $("#postLogParams");
    var postlogId = params.val();
    var _postlogLineIds = "";

    $.each(postlogtable.rows({ selected: true }).data(), function (key, value) {
        if (key == 0) {
            _postlogLineIds = value.pLineID;
        } else {
            _postlogLineIds += "," + value.pLineID;
        }
    });
    swal({
        title: "",
        html: "Please confirm to clear spot data to the selected line(s).",
        type: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        width: 550,
        preConfirm: function () {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    resolve();
                }, 50);
            });
        }
    }).then(
        function (result) {
            $.ajax({
                url: "/Logs/PostLogClearSpotData",
                type: "POST",
                data: {
                    PostLogId: postlogId,
                    PostLogLineIds: _postlogLineIds
                },
                success: function (result) {
                    if (result.success) {                        
                        swal("", result.responseText, "success");
                        postlogtable.ajax.reload(null, false);
                    }
                    else {
                        swal("Error!", result.responseText, "error");
                    }

                },
                error: function (response) {
                    swal("Error!", response.responseText, "error");
                }
            })
        });

}

function CalculateTotals() {
    var countryId = getParameterByName('selectedCountry');
    var totalClearedSpots = 0; totalClearedFullRate = 0; totalClearedRate = 0; totalClearedIMP = 0;
    var totalUnClearedSpots = 0; totalUnClearedFullRate = 0; totalUnClearedRate = 0; totalUnClearedIMP = 0;
    var totalUnPlacedSpots = 0; totalUnPlacedFullRate = 0; totalUnPlacedRate = 0; totalUnPlacedIMP = 0;
    var totalSpots = 0; totalFullRate = 0; totalRate = 0; totalIMP = 0;
    var index1 = 26;
    var index2 = 17;
    if (countryId == 2)
        index1 = 27;
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

function FilterMenuItemVisibility(filterMenus, index) {

    var fm = filterMenus.map(function (filterMenu) {
        return {
            column: filterMenu.column,
            item: filterMenu.inputs.map(function (input) {
                return input.value.trim().replace(/ +(?= )/g, '');
            })
        };
    });

    var col2 = []; var col10 = []; var col11 = []; var col12 = []; var col13 = []; var col14 = []; var col15 = []; var col16 = []; var col17 = []; var col18 = [];
    var col19 = []; var col20 = []; var col21 = []; var col22 = []; var col23 = []; var col24 = []; var col25 = []; var col26 = []; var col27 = [];
    var col28 = []; var col29 = []; var col30 = [];

    if (index == 1) {

        $("#PostLogViewTable tbody tr").not("[style *= 'display: none']").each(function () {
            col2.push($(this).find("td:eq(2)")[0].innerText);
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
            col30.push($(this).find("td:eq(30)")[0].innerText);
        });

        for (var j = 0; j <= fm[2].item.length; j++) {
            if (jQuery.inArray(fm[2].item[j], col2) >= 0) { $($($($("#PostLogViewTable th .checkbox-container")[2])[0]).find("div")[j + 1]).removeClass("d-none"); }
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
        for (var j = 0; j <= fm[30].item.length; j++) {
            if (jQuery.inArray(fm[30].item[j], col30) >= 0) { $($($($("#PostLogViewTable th .checkbox-container")[23])[0]).find("div")[j + 1]).removeClass("d-none"); }
            else { $($($($("#PostLogViewTable th .checkbox-container")[23])[0]).find("div")[j + 1]).addClass("d-none"); }
        }

    }

}

var selectedRowFrom = "";
var selectedRowTo = "";
var selectedPostLogLineIdsFrom = "";
var selectedPostLogLineIdsTo = "";
var selectedRowFromCount = 0;
var selectedRowToCount = 0;

function PostLogMoveSpotData() {
    var errorMsg = "";
    if (postlogtable.rows({ selected: true }).data().count() > 0) {
        if (selectedRowFrom == "") {
            errorMsg = "";
            selectedRowFromCount = postlogtable.rows({ selected: true }).data().count();
            $.each(postlogtable.rows({ selected: true }).data(), function (key, value) {
                if ((value.spotDate == null || value.spotDate == '') && (value.spotTime == null || value.spotTime == '')
                    && (value.isci == null || value.isci == '') && (value.programTitle == null || value.programTitle == "")) {
                    errorMsg = "Selected line has blank spot data.";
                    return false;
                }
                if (key == 0) {selectedPostLogLineIdsFrom = value.pLineID;} else {selectedPostLogLineIdsFrom += "," + value.pLineID;}
                var spotDate = ""; var spotTime = ""; var isci = ""; var programTitle = "";
                if (value.spotDate != null) {spotDate = value.spotDate;}                
                if (value.spotTime != null) { spotTime = value.spotTime;}
                if (value.isci != null) { isci = value.isci; }
                if (value.programTitle != null) { programTitle = value.programTitle; }
                selectedRowFrom += "<tr><td>" + value.network.stdNetName + "</td><td>" + value.property.propertyName + "</td><td>" + moment(spotDate).format("MM/DD/YYYY") + "</td><td>" + moment(spotTime).format("hh:mm:ss A") + "</td><td>" + isci + "</td><td>" + programTitle + "</td></tr>"
            });
            if (errorMsg != "") {
                selectedRowFrom = "";
                swal("", errorMsg, "error");
                return false;
            }
        } else if (selectedRowTo == "") {
            errorMsg = "";
            selectedRowToCount = postlogtable.rows({ selected: true }).data().count();
            if (selectedRowFromCount != selectedRowToCount) {
                selectedRowTo = "";
                swal("", "Please select equal no. of lines.", "error");
                return false;
            }
            $.each(postlogtable.rows({ selected: true }).data(), function (key, value) {
                if ((value.spotDate != null && value.spotDate != '') || (value.spotTime != null && value.spotTime != '') || (value.isci != null && value.isci != '') || (value.programTitle != null && value.programTitle != "")) {
                    errorMsg = "Selected line has spot data.";
                    return false;
                }                
                if (key == 0) {selectedPostLogLineIdsTo = value.pLineID;} else { selectedPostLogLineIdsTo += "," + value.pLineID;}
                var spotDate = ""; var spotTime = ""; var isci = ""; var programTitle = "";
                if (value.spotDate != null) { spotDate = value.spotDate; }
                if (value.spotTime != null) { spotTime = value.spotTime; }
                if (value.isci != null) { isci = value.isci; }
                if (value.programTitle != null) { programTitle = value.programTitle; }
                selectedRowTo += "<tr><td>" + value.network.stdNetName + "</td><td>" + value.property.propertyName + "</td><td>" + spotDate + "</td><td>" + spotTime + "</td><td>" + isci + "</td><td>" + programTitle + "</td></tr>"
            });
            if (errorMsg != "") {
                selectedRowTo = "";
                swal("", errorMsg, "error");
                return false;
            }
        }
    }
    var markup = "";
    if (selectedRowFrom != "") {
        if (selectedRowTo == "") {
            markup = "<div style='font-weight:bold;'>Following lines Spot Data available for paste. </div>";
        }
        markup += "<div style='font-weight:bold;'>Please confirm selected lines. </div>" +    
            "<div style='text-align:left; font-weight:bold;'>Move From:</div><br/><table class='table table-bordered table-vcenter js-dataTable-simple'><thead><th>NETWORK</th><th>PROPERTY</th>" +
            "<th>Spot Date</th><th>Spot Time</th><th>ISCI</th><th>Program</th></thead>" +
            "<tbody>" + selectedRowFrom + "</tbody></table>";
    }
    if (selectedRowTo != "") {
        markup += "<div style='text-align:left; font-weight:bold;'>Move To:</div><br /><table class='table table-bordered table-vcenter js-dataTable-simple'><thead><th>NETWORK</th><th>PROPERTY</th>" +
            "<th>Spot Date</th><th>Spot Time</th><th>ISCI</th><th>Program</th></thead>" +
            "<tbody>" + selectedRowTo + "</tbody></table>";
    }
    swal({
        title: "",
        html: markup,
        type: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        width: 1200,
        preConfirm: function () {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    resolve();
                }, 50);
            });
        }
    }).then(
        function () {
            if (selectedRowFrom != "" && selectedRowTo != "") {
                $.ajax({
                    url: "/Logs/PostLogMoveSpotData",
                    type: "POST",
                    data: {
                        PostLogId: getParameterByName('postlogid'),
                        PostLogLineIdsFrom: selectedPostLogLineIdsFrom,
                        PostLogLineIdsTo: selectedPostLogLineIdsTo
                    },
                    success: function (result) {
                        if (result.success) {
                            ResetVariable();
                            swal("", result.responseText, "success");
                            postlogtable.ajax.reload(null, false);
                        }
                        else {
                            swal("Error!", result.responseText, "error");
                        }
                    },
                    error: function (response) {
                        swal("Error!", response.responseText, "error");
                    }
                })
            }

            postlogtable.rows({ selected: true }).deselect();
        }).catch(function () {
            ResetVariable();
            postlogtable.rows({ selected: true }).deselect();
        });
}

function ResetVariable() {
    selectedRowFrom = "";
    selectedRowTo = "";
    selectedRowFromCount = 0;
    selectedRowToCount = 0;
    selectedPostLogLineIdsFrom = "";
    selectedPostLogLineIdsTo = "";
}