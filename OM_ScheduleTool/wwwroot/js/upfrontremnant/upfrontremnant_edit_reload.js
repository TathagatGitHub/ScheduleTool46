

//New Code Starts here
var HeaderFilterResult;
function ReloadHeader(settings, data,isEdit) {
    $.ajax({
        url: '/UpfrontRemnant/GerUpfrontHeader',
        type: 'POST',
        data: {
            upfrontId: getParameterByName('upfrontid'),
            propertyNames: data.columns[3].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '')
        },
        success: function (result) {
            HeaderFilterResult = result;
            console.log(HeaderFilterResult);
            if (isEdit == true)
                ReloadApprovedNew(settings, data, HeaderFilterResult.data.lstApproved);
            else 
                ReloadDemoNamesNew(settings, data, HeaderFilterResult.data.lstDemoNames);
        },
        error: function (response) {
            var notify = $.notify(response.responseText, {
                type: 'danger',
                allow_dismiss: true,
            });
        }


    });
}

function ReloadApprovedNew(settings, data, resultData) {

    var approvedCol = 2;
    var headerApproved = $('.HeaderApproved').find('.cb-dropdown');
    var selApproved = data.columns[approvedCol].search.search;
    var selApproveds = selApproved.split(',');
    var withNonSelected = false;
    if (headerApproved) {
        // First, empty list
        headerApproved.empty();

        if (selApproved !== '') {
            for (var x = 0; x < resultData.length; x++) {
                // Mark if any is not selected
                if (jQuery.inArray(resultData[x], selApproveds) == -1) {
                    withNonSelected = true;
                }
            }
        }

        for (var x = 0; x < resultData.length; x++) {
            var // wrapped
                $label = $('<label>'),
                $text = $('<span>', {
                    text: resultData[x]
                }),
                $cb = $('<input>', {
                    type: 'checkbox',
                    checked: (selApproved === '' ? true : (jQuery.inArray(resultData[x], selApproveds) == -1 ? false : true)),
                    value: resultData[x]
                });

            $text.appendTo($label);
            $cb.appendTo($label);
            headerApproved.append($('<li>').append($label));
        }

        // Add Select All
        var // wrapped
            $label = $('<label>'),
            $text = $('<span>', {
                text: 'Select All'
            }),
            $cb = $('<input>', {
                type: 'checkbox',
                checked: (selApproved === '' ? true : (withNonSelected == true ? false : true)),
                value: 'Select All'
            });

        $text.appendTo($label);
        $cb.appendTo($label);
        headerApproved.prepend($('<li>').append($label));

        if (withNonSelected === true) {
            headerApproved.addClass("factive");
        }
        else {
            headerApproved.removeClass("factive");
        }

    }
    ReloadDemoNamesNew(settings, data, HeaderFilterResult.data.lstDemoNames);
}


function ReloadDemoNamesNew(settings, data, resultData) {

    var demoNameCol = 1;
    var headerDemoName = $('.HeaderDemoName').find('.cb-dropdown');
    var selDemoName = data.columns[demoNameCol].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '');
    var selDemoNames = selDemoName.split(',');
    var withNonSelected = false;
    if (headerDemoName) {
        // First, empty list
        headerDemoName.empty();

        if (selDemoName !== '') {
            for (var x = 0; x < resultData.length; x++) {
                // Mark if any is not selected
                if (jQuery.inArray(resultData[x].description, selDemoNames) == -1) {
                    withNonSelected = true;
                }
            }
        }

        for (var x = 0; x < resultData.length; x++) {
            var // wrapped
                $label = $('<label>'),
                $text = $('<span>', {
                    text: resultData[x].description
                }),
                $cb = $('<input>', {
                    type: 'checkbox',
                    checked: (selDemoName === '' ? true : (jQuery.inArray(resultData[x].description, selDemoNames) == -1 ? false : true)),
                    value: resultData[x].description
                });

            $text.appendTo($label);
            $cb.appendTo($label);
            if (headerDemoName[0] && headerDemoName[0].innerText.indexOf(resultData[x].description) == -1) {
                headerDemoName.append($('<li>').append($label));
            }
        }

        // Add Select All
        var // wrapped
            $label = $('<label>'),
            $text = $('<span>', {
                text: 'Select All'
            }),
            $cb = $('<input>', {
                type: 'checkbox',
                checked: (selDemoName === '' ? true : (withNonSelected == true ? false : true)),
                value: 'Select All'
            });

        $text.appendTo($label);
        $cb.appendTo($label);
        headerDemoName.prepend($('<li>').append($label));

        if (withNonSelected === true) {
            headerDemoName.addClass("factive");
        }
        else {
            headerDemoName.removeClass("factive");
        }
    }
    ReloadSPBuyNew(settings, data, HeaderFilterResult.data.spBuys);
}

function ReloadSPBuyNew(settings, data, resultData) {
    var spBuyCol = 15;
    var headerSPBuy = $('.HeaderSPBuy').find('.cb-dropdown');
    var selSPBuy = data.columns[spBuyCol].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '');
    var selSPBuys = selSPBuy.split(',');
    var withNonSelected = false;
    if (headerSPBuy) {
        // First, empty list
        headerSPBuy.empty();

        if (selSPBuy !== '') {
            for (var x = 0; x < resultData.length; x++) {
                // Mark if any is not selected                        
                if (jQuery.inArray(resultData[x], selSPBuys) == -1) {
                    withNonSelected = true;
                }
            }
        }
        for (var x = 0; x < resultData.length; x++) {
            var // wrapped
                $label = $('<label>'),
                $text = $('<span>', {
                    text: resultData[x] == "True" ? 'SP' : ''
                }),
                $cb = $('<input>', {
                    type: 'checkbox',
                    checked: (selSPBuy === '' ? true : (jQuery.inArray(resultData[x], selSPBuys) == -1 ? false : true)),
                    value: resultData[x]
                });

            $text.appendTo($label);
            $cb.appendTo($label);
            if (headerSPBuy[0] && headerSPBuy[0].innerText.indexOf(resultData[x]) == -1) {
                headerSPBuy.append($('<li>').append($label));
            }
        }

        // Add Select All
        var // wrapped
            $label = $('<label>'),
            $text = $('<span>', {
                text: 'Select All'
            }),
            $cb = $('<input>', {
                type: 'checkbox',
                checked: (selSPBuy === '' ? true : (withNonSelected == true ? false : true)),
                value: 'Select All'
            });

        $text.appendTo($label);
        $cb.appendTo($label);
        headerSPBuy.prepend($('<li>').append($label));

        if (withNonSelected === true) {
            headerSPBuy.addClass("factive");
        }
        else {
            headerSPBuy.removeClass("factive");
        }

    }
    //ReloadPropertyNamesNew(settings, data, HeaderFilterResult.data.lstProps);
    ReloadStartTimeNew(settings, data, HeaderFilterResult.data.lstStartTimes);
}
function ReloadPropertyNamesNew(settings, data, resultData) {

    var propertyNameCol = 3;
    var headerPropertyName = $('.HeaderPropertyName').find('.cb-dropdown');
    var selPropertyName = data.columns[propertyNameCol].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '');
    var selPropertyNames = selPropertyName.split(',');
    var withNonSelected = false;
    if (headerPropertyName) {
        // First, empty list
        headerPropertyName.empty();

        if (selPropertyName !== '') {
            for (var x = 0; x < resultData.length; x++) {
                // Mark if any is not selected
                if (jQuery.inArray(resultData[x].propertyName, selPropertyNames) == -1) {
                    withNonSelected = true;
                }
            }
        }

        for (var x = 0; x < resultData.length; x++) {
            var // wrapped
                $label = $('<label>'),
                $text = $('<span>', {
                    text: resultData[x].propertyName
                }),
                $cb = $('<input>', {
                    type: 'checkbox',
                    checked: (selPropertyName === '' ? true : (jQuery.inArray(resultData[x].propertyName, selPropertyNames) == -1 ? false : true)),
                    value: resultData.propertyName
                });

            $text.appendTo($label);
            $cb.appendTo($label);
            if (headerPropertyName[0] && jQuery.inArray(headerPropertyName[0].innerText.split('\n'), resultData[x].propertyName) == -1) {
                headerPropertyName.append($('<li>').append($label));
            }
        }

        // Add Select All
        var // wrapped
            $label = $('<label>'),
            $text = $('<span>', {
                text: 'Select All'
            }),
            $cb = $('<input>', {
                type: 'checkbox',
                checked: (selPropertyName === '' ? true : (withNonSelected == true ? false : true)),
                value: 'Select All'
            });

        $text.appendTo($label);
        $cb.appendTo($label);
        headerPropertyName.prepend($('<li>').append($label));

        if (withNonSelected === true) {
            headerPropertyName.addClass("factive");
        }
        else {
            headerPropertyName.removeClass("factive");
        }
        ReloadStartTimeNew(settings, data, HeaderFilterResult.data.lstStartTimes);

    }
}


function ReloadStartTimeNew(settings, data, resultData) {

    var startTimeCol = 11;
    var headerStartTime = $('.HeaderStartTime').find('.cb-dropdown');
    var selStartTime = data.columns[startTimeCol].search.search;
    var selStartTimes = selStartTime.split(',');
    var withNonSelected = false;
    if (headerStartTime) {
        // First, empty list
        headerStartTime.empty();

        if (selStartTime !== '') {
            for (var x = 0; x < resultData.length; x++) {
                // Mark if any is not selected
                if (jQuery.inArray(moment(resultData[x]).format("hh:mm a"), selStartTimes) == -1) {
                    withNonSelected = true;
                }
            }
        }

        for (var x = 0; x < resultData.length; x++) {
            var // wrapped
                $label = $('<label>'),
                $text = $('<span>', {
                    text: moment(resultData[x]).format("hh:mm a")
                }),
                $cb = $('<input>', {
                    type: 'checkbox',
                    checked: (selStartTime === '' ? true : (jQuery.inArray(moment(resultData[x]).format("hh:mm a"), selStartTimes) == -1 ? false : true)),
                    value: moment(resultData[x]).format("hh:mm a")
                });

            $text.appendTo($label);
            $cb.appendTo($label);
            if (headerStartTime[0] && headerStartTime[0].innerText.indexOf(moment(resultData[x]).format("hh:mm a")) == -1) {
                headerStartTime.append($('<li>').append($label));
            }
        }

        // Add Select All
        var // wrapped
            $label = $('<label>'),
            $text = $('<span>', {
                text: 'Select All'
            }),
            $cb = $('<input>', {
                type: 'checkbox',
                checked: (selStartTime === '' ? true : (withNonSelected == true ? false : true)),
                value: 'Select All'
            });

        $text.appendTo($label);
        $cb.appendTo($label);
        headerStartTime.prepend($('<li>').append($label));

        if (withNonSelected === true) {
            headerStartTime.addClass("factive");
        }
        else {
            headerStartTime.removeClass("factive");
        }

    }
    ReloadEndTimeNew(settings, data, HeaderFilterResult.data.lstEndTimes);
}

function ReloadEndTimeNew(settings, data, resultData) {

    var endTimeCol = 12;
    var headerEndTime = $('.HeaderEndTime').find('.cb-dropdown');
    var selEndTime = data.columns[endTimeCol].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '');
    var selEndTimes = selEndTime.split(',');
    var withNonSelected = false;
    if (headerEndTime) {
        // First, empty list
        headerEndTime.empty();

        if (selEndTime !== '') {
            for (var x = 0; x < resultData.length; x++) {
                // Mark if any is not selected
                if (jQuery.inArray(moment(resultData[x]).format("hh:mm a"), selEndTimes) == -1) {
                    withNonSelected = true;
                }
            }
        }

        for (var x = 0; x < resultData.length; x++) {
            var // wrapped
                $label = $('<label>'),
                $text = $('<span>', {
                    text: moment(resultData[x]).format("hh:mm a")
                }),
                $cb = $('<input>', {
                    type: 'checkbox',
                    checked: (selEndTime === '' ? true : (jQuery.inArray(moment(resultData[x]).format("hh:mm a"), selEndTimes) == -1 ? false : true)),
                    value: moment(resultData[x]).format("hh:mm a")
                });

            $text.appendTo($label);
            $cb.appendTo($label);
            if (headerEndTime[0] && headerEndTime[0].innerText.indexOf(moment(resultData[x]).format("hh:mm a")) == -1) {
                headerEndTime.append($('<li>').append($label));
            }
        }

        // Add Select All
        var // wrapped
            $label = $('<label>'),
            $text = $('<span>', {
                text: 'Select All'
            }),
            $cb = $('<input>', {
                type: 'checkbox',
                checked: (selEndTime === '' ? true : (withNonSelected == true ? false : true)),
                value: 'Select All'
            });

        $text.appendTo($label);
        $cb.appendTo($label);
        headerEndTime.prepend($('<li>').append($label));

        if (withNonSelected === true) {
            headerEndTime.addClass("factive");
        }
        else {
            headerEndTime.removeClass("factive");
        }

    }
    ReloadDayPartNew(settings, data, HeaderFilterResult.data.lstDayParts);
}

function ReloadDayPartNew(settings, data, resultData) {

    var dayPartCol = 13;
    var headerDayPart = $('.HeaderDP').find('.cb-dropdown');
    var selDayPart = data.columns[dayPartCol].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '');
    var selDayParts = selDayPart.split(',');
    var withNonSelected = false;
    if (headerDayPart) {
        // First, empty list
        headerDayPart.empty();

        if (selDayPart !== '') {
            for (var x = 0; x < resultData.length; x++) {
                // Mark if any is not selected
                if (jQuery.inArray(resultData[x].dayPartCd, selDayParts) == -1) {
                    withNonSelected = true;
                }
            }
        }

        for (var x = 0; x < resultData.length; x++) {
            var // wrapped
                $label = $('<label>'),
                $text = $('<span>', {
                    text: resultData[x].dayPartCd
                }),
                $cb = $('<input>', {
                    type: 'checkbox',
                    checked: (selDayPart === '' ? true : (jQuery.inArray(resultData[x].dayPartCd, selDayParts) == -1 ? false : true)),
                    value: resultData[x].dayPartCd
                });

            $text.appendTo($label);
            $cb.appendTo($label);
            if (headerDayPart[0] && headerDayPart[0].innerText.indexOf(resultData[x].dayPartCd) == -1) {
                headerDayPart.append($('<li>').append($label));
            }
        }

        // Add Select All
        var // wrapped
            $label = $('<label>'),
            $text = $('<span>', {
                text: 'Select All'
            }),
            $cb = $('<input>', {
                type: 'checkbox',
                checked: (selDayPart === '' ? true : (withNonSelected == true ? false : true)),
                value: 'Select All'
            });

        $text.appendTo($label);
        $cb.appendTo($label);
        headerDayPart.prepend($('<li>').append($label));

        if (withNonSelected === true) {
            headerDayPart.addClass("factive");
        }
        else {
            headerDayPart.removeClass("factive");
        }

    }
    ReloadOMDPNew(settings, data, HeaderFilterResult.data.lstOMDPs);
}

function ReloadOMDPNew(settings, data, resultData) {

    var OMDPCol = 14;
    var headerOMDP = $('.HeaderOMDP').find('.cb-dropdown');
    var selOMDP = data.columns[OMDPCol].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '');
    var selOMDPs = selOMDP.split(',');
    var withNonSelected = false;
    if (headerOMDP) {
        // First, empty list
        headerOMDP.empty();

        if (selOMDP !== '') {
            for (var x = 0; x < resultData.length; x++) {
                // Mark if any is not selected
                if (jQuery.inArray(resultData[x], selOMDPs) == -1) {
                    withNonSelected = true;
                }
            }
        }

        for (var x = 0; x < resultData.length; x++) {
            var // wrapped
                $label = $('<label>'),
                $text = $('<span>', {
                    text: resultData[x]
                }),
                $cb = $('<input>', {
                    type: 'checkbox',
                    checked: (selOMDP === '' ? true : (jQuery.inArray(resultData[x], selOMDPs) == -1 ? false : true)),
                    value: resultData[x]
                });

            $text.appendTo($label);
            $cb.appendTo($label);
            if (headerOMDP[0] && headerOMDP[0].innerText.indexOf(resultData[x]) == -1) {
                headerOMDP.append($('<li>').append($label));
            }
        }

        // Add Select All
        var // wrapped
            $label = $('<label>'),
            $text = $('<span>', {
                text: 'Select All'
            }),
            $cb = $('<input>', {
                type: 'checkbox',
                checked: (selOMDP === '' ? true : (withNonSelected == true ? false : true)),
                value: 'Select All'
            });

        $text.appendTo($label);
        $cb.appendTo($label);
        headerOMDP.prepend($('<li>').append($label));

        if (withNonSelected === true) {
            headerOMDP.addClass("factive");
        }
        else {
            headerOMDP.removeClass("factive");
        }

    }
    ReloadBuyTypeNew(settings, data, HeaderFilterResult.data.lstBuyTypes);
}

function ReloadBuyTypeNew(settings, data, resultData) {

    var BuyTypeCol = 16;
    var headerBuyType = $('.HeaderBuyType').find('.cb-dropdown');
    var selBuyType = data.columns[BuyTypeCol].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '');
    var selBuyTypes = selBuyType.split(',');
    var withNonSelected = false;
    if (headerBuyType) {
        // First, empty list
        headerBuyType.empty();

        if (selBuyType !== '') {
            for (var x = 0; x < resultData.length; x++) {
                // Mark if any is not selected
                if (jQuery.inArray(resultData[x].buyTypeCode, selBuyTypes) == -1) {
                    withNonSelected = true;
                }
            }
        }

        for (var x = 0; x < resultData.length; x++) {
            var // wrapped
                $label = $('<label>'),
                $text = $('<span>', {
                    text: resultData[x].buyTypeCode
                }),
                $cb = $('<input>', {
                    type: 'checkbox',
                    checked: (selBuyType === '' ? true : (jQuery.inArray(resultData[x].buyTypeCode, selBuyTypes) == -1 ? false : true)),
                    value: resultData[x].buyTypeCode
                });

            $text.appendTo($label);
            $cb.appendTo($label);
            if (headerBuyType[0].innerText.indexOf(resultData[x].buyTypeCode) == -1) {
                headerBuyType.append($('<li>').append($label));
            }
        }

        // Add Select All
        var // wrapped
            $label = $('<label>'),
            $text = $('<span>', {
                text: 'Select All'
            }),
            $cb = $('<input>', {
                type: 'checkbox',
                checked: (selBuyType === '' ? true : (withNonSelected == true ? false : true)),
                value: 'Select All'
            });

        $text.appendTo($label);
        $cb.appendTo($label);
        headerBuyType.prepend($('<li>').append($label));

        if (withNonSelected === true) {
            headerBuyType.addClass("factive");
        }
        else {
            headerBuyType.removeClass("factive");
        }

    }
    ReloadLensNew(settings, data, HeaderFilterResult.data.lstLens);
}

function ReloadLensNew(settings, data, resultData) {

    var LenCol = 17;
    var headerLen = $('.HeaderSpotLen').find('.cb-dropdown');
    var selLen = data.columns[LenCol].search.search;
    var selLens = selLen.split(',');
    var withNonSelected = false;
    if (headerLen) {
        // First, empty list
        headerLen.empty();

        if (selLen !== '') {
            for (var x = 0; x < resultData.length; x++) {
                // Mark if any is not selected
                if (jQuery.inArray(resultData[x], selLens) == -1) {
                    withNonSelected = true;
                }
            }
        }

        for (var x = 0; x < resultData.length; x++) {
            var // wrapped
                $label = $('<label>'),
                $text = $('<span>', {
                    text: resultData[x]
                }),
                $cb = $('<input>', {
                    type: 'checkbox',
                    checked: (selLen === '' ? true : (jQuery.inArray(resultData[x], selLens) == -1 ? false : true)),
                    value: resultData[x]
                });

            $text.appendTo($label);
            $cb.appendTo($label);
            headerLen.append($('<li>').append($label));
        }

        // Add Select All
        var // wrapped
            $label = $('<label>'),
            $text = $('<span>', {
                text: 'Select All'
            }),
            $cb = $('<input>', {
                type: 'checkbox',
                checked: (selLen === '' ? true : (withNonSelected == true ? false : true)),
                value: 'Select All'
            });

        $text.appendTo($label);
        $cb.appendTo($label);
        headerLen.prepend($('<li>').append($label));

        if (withNonSelected === true) {
            headerLen.addClass("factive");
        }
        else {
            headerLen.removeClass("factive");
        }

    }
    ReloadRateAmtsNew(settings, data, HeaderFilterResult.data.lstRates);
}

function ReloadRateAmtsNew(settings, data, resultData) {

    var rateAmtCol = 18;
    var headerRateAmt = $('.HeaderRateAmt').find('.cb-dropdown');
    var selRateAmt = data.columns[rateAmtCol].search.search;
    var selRateAmts = selRateAmt.split(',');
    var withNonSelected = false;
    if (headerRateAmt) {
        // First, empty list
        headerRateAmt.empty();

        if (selRateAmt !== '') {
            for (var x = 0; x < resultData.length; x++) {
                // Mark if any is not selected
                if (jQuery.inArray(resultData[x].toString(), selRateAmts) == -1) {
                    withNonSelected = true;
                }
            }
        }

        for (var x = 0; x < resultData.length; x++) {
            var // wrapped
                $label = $('<label>'),
                $text = $('<span>', {
                    text: $.fn.dataTable.render.number(',', '.', 2, '$').display(resultData[x])
                }),
                $cb = $('<input>', {
                    type: 'checkbox',
                    checked: (selRateAmt === '' ? true : (jQuery.inArray(resultData[x].toString(), selRateAmts) == -1 ? false : true)),
                    value: resultData[x]
                });

            $text.appendTo($label);
            $cb.appendTo($label);
            if (headerRateAmt[0].innerText.indexOf($.fn.dataTable.render.number(',', '.', 2, '$').display(resultData[x])) == -1) {
                headerRateAmt.append($('<li>').append($label));
            }
        }

        // Add Select All
        var // wrapped
            $label = $('<label>'),
            $text = $('<span>', {
                text: 'Select All'
            }),
            $cb = $('<input>', {
                type: 'checkbox',
                checked: (selRateAmt === '' ? true : (withNonSelected == true ? false : true)),
                value: 'Select All'
            });

        $text.appendTo($label);
        $cb.appendTo($label);
        headerRateAmt.prepend($('<li>').append($label));

        if (withNonSelected === true) {
            headerRateAmt.addClass("factive");
        }
        else {
            headerRateAmt.removeClass("factive");
        }

    }
    ReloadImpressionsNew(settings, data, HeaderFilterResult.data.lstImpressions);
}

function ReloadImpressionsNew(settings, data, resultData) {

    var impressionCol = 19;
    var headerImpression = $('.HeaderImpression').find('.cb-dropdown');
    var selImpression = data.columns[impressionCol].search.search;
    var selImpressions = selImpression.split(',');
    var withNonSelected = false;
    if (headerImpression) {
        // First, empty list
        headerImpression.empty();

        if (selImpression !== '') {
            for (var x = 0; x < resultData.length; x++) {
                // Mark if any is not selected
                if (jQuery.inArray(resultData[x].toString(), selImpressions) == -1) {
                    withNonSelected = true;
                }
            }
        }

        for (var x = 0; x < resultData.length; x++) {
            var // wrapped
                $label = $('<label>'),
                $text = $('<span>', {
                    text: $.fn.dataTable.render.number(',', '.', 2, '').display(resultData[x])
                }),
                $cb = $('<input>', {
                    type: 'checkbox',
                    checked: (selImpression === '' ? true : (jQuery.inArray(resultData[x].toString(), selImpressions) == -1 ? false : true)),
                    value: resultData[x]
                });

            $text.appendTo($label);
            $cb.appendTo($label);
            if (headerImpression[0].innerText.indexOf($.fn.dataTable.render.number(',', '.', 2, '$').display(resultData[x])) == -1) {
                headerImpression.append($('<li>').append($label));
            }
        }

        // Add Select All
        var // wrapped
            $label = $('<label>'),
            $text = $('<span>', {
                text: 'Select All'
            }),
            $cb = $('<input>', {
                type: 'checkbox',
                checked: (selImpression === '' ? true : (withNonSelected == true ? false : true)),
                value: 'Select All'
            });

        $text.appendTo($label);
        $cb.appendTo($label);
        headerImpression.prepend($('<li>').append($label));

        if (withNonSelected === true) {
            headerImpression.addClass("factive");
        }
        else {
            headerImpression.removeClass("factive");
        }

    }
    ReloadCPMsNew(settings, data, HeaderFilterResult.data.lstCPM);
}

function ReloadCPMsNew(settings, data, resultData) {

    var CPMCol = 20;
    var headerCPM = $('.HeaderCPM').find('.cb-dropdown');
    var selCPM = data.columns[CPMCol].search.search.replace(/[\/\\^*?|[\]{}]/g, '');
    var selCPMs = selCPM.split(',');
    var withNonSelected = false;
    if (headerCPM) {
        // First, empty list
        headerCPM.empty();

        if (selCPM !== '') {
            for (var x = 0; x < resultData.length; x++) {
                // Mark if any is not selected
                if (jQuery.inArray(resultData[x].toString(), selCPMs) == -1) {
                    withNonSelected = true;
                }
            }
        }

        for (var x = 0; x < resultData.length; x++) {
            var // wrapped
                $label = $('<label>'),
                $text = $('<span>', {
                    text: $.fn.dataTable.render.number(',', '.', 2, '$').display(resultData[x])
                }),
                $cb = $('<input>', {
                    type: 'checkbox',
                    checked: (selCPM === '' ? true : (jQuery.inArray(resultData[x].toString(), selCPMs) == -1 ? false : true)),
                    value: resultData[x]
                });

            $text.appendTo($label);
            $cb.appendTo($label);
            if (headerCPM[0].innerText.indexOf($.fn.dataTable.render.number(',', '.', 2, '$').display(resultData[x])) == -1) {
                headerCPM.append($('<li>').append($label));
            }
        }

        // Add Select All
        var // wrapped
            $label = $('<label>'),
            $text = $('<span>', {
                text: 'Select All'
            }),
            $cb = $('<input>', {
                type: 'checkbox',
                checked: (selCPM === '' ? true : (withNonSelected == true ? false : true)),
                value: 'Select All'
            });

        $text.appendTo($label);
        $cb.appendTo($label);
        headerCPM.prepend($('<li>').append($label));

        if (withNonSelected === true) {
            headerCPM.addClass("factive");
        }
        else {
            headerCPM.removeClass("factive");
        }

    }
    ReloadDoNotBuyTypesNew(settings, data, HeaderFilterResult.data.lstDoNotBuyTypes);
}

function ReloadDoNotBuyTypesNew(settings, data, resultData) {

    var DoNotBuyTypeCol = 21;
    var headerDoNotBuyType = $('.HeaderDoNotBuyType').find('.cb-dropdown');
    var selDoNotBuyType = data.columns[DoNotBuyTypeCol].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '');
    var selDoNotBuyTypes = selDoNotBuyType.split(',');
    var withNonSelected = false;
    if (headerDoNotBuyType) {
        // First, empty list
        headerDoNotBuyType.empty();

        if (selDoNotBuyType !== '') {
            for (var x = 0; x < resultData.length; x++) {
                // Mark if any is not selected
                if (jQuery.inArray(resultData[x].description, selDoNotBuyTypes) == -1) {
                    withNonSelected = true;
                }
            }
        }

        for (var x = 0; x < resultData.length; x++) {
            var // wrapped
                $label = $('<label>'),
                $text = $('<span>', {
                    text: resultData[x].description
                }),
                $cb = $('<input>', {
                    type: 'checkbox',
                    checked: (selDoNotBuyType === '' ? true : (jQuery.inArray(resultData[x].description, selDoNotBuyTypes) == -1 ? false : true)),
                    value: resultData[x].description
                });

            $text.appendTo($label);
            $cb.appendTo($label);
            if (headerDoNotBuyType[0].innerText.indexOf(resultData[x].description) == -1) {
                headerDoNotBuyType.append($('<li>').append($label));
            }
        }

        // Add Select All
        var // wrapped
            $label = $('<label>'),
            $text = $('<span>', {
                text: 'Select All'
            }),
            $cb = $('<input>', {
                type: 'checkbox',
                checked: (selDoNotBuyType === '' ? true : (withNonSelected == true ? false : true)),
                value: 'Select All'
            });

        $text.appendTo($label);
        $cb.appendTo($label);
        headerDoNotBuyType.prepend($('<li>').append($label));

        if (withNonSelected === true) {
            headerDoNotBuyType.addClass("factive");
        }
        else {
            headerDoNotBuyType.removeClass("factive");
        }

    }
    ReloadClientsNew(settings, data, HeaderFilterResult.data.lstClients);
}



function ReloadClientsNew(settings, data, resultData) {

    var ClientCol = 22;
    var headerClient = $('.HeaderClient').find('.cb-dropdown');
    var selClient = data.columns[ClientCol].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '');
    var selClients = selClient.split(',');
    var withNonSelected = false;
    if (headerClient) {
        // First, empty list
        headerClient.empty();

        if (selClient !== '') {
            for (var x = 0; x < resultData.length; x++) {
                // Mark if any is not selected
                if (jQuery.inArray(resultData[x].clientName.replace('\\', ''), selClients) == -1) {
                    withNonSelected = true;
                }
            }
        }

        for (var x = 0; x < resultData.length; x++) {
            var // wrapped
                $label = $('<label>'),
                $text = $('<span>', {
                    text: resultData[x].clientName
                }),
                $cb = $('<input>', {
                    type: 'checkbox',
                    checked: (selClient === '' ? true : (jQuery.inArray(resultData[x].clientName.replace('\\', ''), selClients) == -1 ? false : true)),
                    value: resultData[x].clientName
                });

            $text.appendTo($label);
            $cb.appendTo($label);
            if (headerClient[0].innerText.indexOf(resultData[x].clientName) == -1) {
                headerClient.append($('<li>').append($label));
            }
        }

        // Add Select All
        var // wrapped
            $label = $('<label>'),
            $text = $('<span>', {
                text: 'Select All'
            }),
            $cb = $('<input>', {
                type: 'checkbox',
                checked: (selClient === '' ? true : (withNonSelected == true ? false : true)),
                value: 'Select All'
            });

        $text.appendTo($label);
        $cb.appendTo($label);
        headerClient.prepend($('<li>').append($label));

        if (withNonSelected === true) {
            headerClient.addClass("factive");
        }
        else {
            headerClient.removeClass("factive");
        }

    }
    ReloadRevNew(settings, data, HeaderFilterResult.data.lstRevNos);
}


function ReloadRevNew(settings, data, resultData) {

    var RevisionCol = 23;
    var headerRevision = $('.HeaderRevNo').find('.cb-dropdown');
    var selRevision = data.columns[RevisionCol].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '');
    var selRevisions = selRevision.split(',');
    var withNonSelected = false;
    if (headerRevision) {
        // First, empty list
        headerRevision.empty();

        if (selRevision !== '') {
            for (var x = 0; x < resultData.length; x++) {
                // Mark if any is not selected
                if (jQuery.inArray(resultData[x], selRevisions) == -1) {
                    withNonSelected = true;
                }
            }
        }

        for (var x = 0; x < resultData.length; x++) {
            var // wrapped
                $label = $('<label>'),
                $text = $('<span>', {
                    text: resultData[x]
                }),
                $cb = $('<input>', {
                    type: 'checkbox',
                    checked: (selRevision === '' ? true : (jQuery.inArray(resultData[x], selRevisions) == -1 ? false : true)),
                    value: resultData[x]
                });

            $text.appendTo($label);
            $cb.appendTo($label);
            if (headerRevision[0].innerText.indexOf(resultData[x]) == -1) {
                headerRevision.append($('<li>').append($label));
            }
        }

        // Add Select All
        var // wrapped
            $label = $('<label>'),
            $text = $('<span>', {
                text: 'Select All'
            }),
            $cb = $('<input>', {
                type: 'checkbox',
                checked: (selRevision === '' ? true : (withNonSelected == true ? false : true)),
                value: 'Select All'
            });

        $text.appendTo($label);
        $cb.appendTo($label);
        headerRevision.prepend($('<li>').append($label));

        if (withNonSelected === true) {
            headerRevision.addClass("factive");
        }
        else {
            headerRevision.removeClass("factive");
        }

    }
    ReloadRevisedDatesNew(settings, data, HeaderFilterResult.data.lstRevisedDates);
}

function ReloadRevisedDatesNew(settings, data, resultData) {
    var revisedDatesCol = 24;
    var headerRevisedDates = $('.HeaderRateRevisedDate').find('.cb-dropdown');
    var selRevisedDate = data.columns[revisedDatesCol].search.search.replace(/\\/g, '');
    var selRevisedDates = selRevisedDate.split(',');
    var withNonSelected = false;
    if (headerRevisedDates) {
        // First, empty list
        headerRevisedDates.empty();

        if (selRevisedDate !== '') {
            for (var x = 0; x < resultData.length; x++) {
                // Mark if any is not selected
                if (jQuery.inArray(moment(resultData[x]).format("MM/DD/YYYY"), selRevisedDates) == -1) {
                    withNonSelected = true;
                }
            }
        }

        for (var x = 0; x < resultData.length; x++) {
            var // wrapped
                $label = $('<label>'),
                $text = $('<span>', {
                    text: moment(resultData[x]).format("MM/DD/YYYY")
                }),
                $cb = $('<input>', {
                    type: 'checkbox',
                    checked: (selRevisedDate === '' ? true : (jQuery.inArray(moment(resultData[x]).format("MM/DD/YYYY"), selRevisedDates) == -1 ? false : true)),
                    value: moment(resultData[x]).format("MM/DD/YYYY")
                });

            $text.appendTo($label);
            $cb.appendTo($label);
            if (headerRevisedDates[0].innerText.indexOf(moment(resultData[x]).format("MM/DD/YYYY")) == -1) {
                headerRevisedDates.append($('<li>').append($label));
            }
        }

        // Add Select All
        var // wrapped
            $label = $('<label>'),
            $text = $('<span>', {
                text: 'Select All'
            }),
            $cb = $('<input>', {
                type: 'checkbox',
                checked: (selRevisedDate === '' ? true : (withNonSelected == true ? false : true)),
                value: 'Select All'
            });

        $text.appendTo($label);
        $cb.appendTo($label);
        headerRevisedDates.prepend($('<li>').append($label));

        if (withNonSelected === true) {
            headerRevisedDates.addClass("factive");
        }
        else {
            headerRevisedDates.removeClass("factive");
        }

    }
    ReloadEffectiveDatesNew(settings, data, HeaderFilterResult.data.lstEffectiveDates);

}

function ReloadEffectiveDatesNew(settings, data, resultData) {

    var effectiveDatesCol = 25;
    var headerEffectiveDates = $('.HeaderEffectiveDate').find('.cb-dropdown');
    var selEffectiveDate = data.columns[effectiveDatesCol].search.search.replace(/\\/g, '');
    var selEffectiveDates = selEffectiveDate.split(',');
    var withNonSelected = false;
    if (headerEffectiveDates) {
        // First, empty list
        headerEffectiveDates.empty();

        if (selEffectiveDate !== '') {
            for (var x = 0; x < resultData.length; x++) {
                // Mark if any is not selected
                if (jQuery.inArray(moment(resultData[x]).format("MM/DD/YYYY"), selEffectiveDates) == -1) {
                    withNonSelected = true;
                }
            }
        }

        for (var x = 0; x < resultData.length; x++) {
            var // wrapped
                $label = $('<label>'),
                $text = $('<span>', {
                    text: moment(resultData[x]).format("MM/DD/YYYY")
                }),
                $cb = $('<input>', {
                    type: 'checkbox',
                    checked: (selEffectiveDate === '' ? true : (jQuery.inArray(moment(resultData[x]).format("MM/DD/YYYY"), selEffectiveDates) == -1 ? false : true)),
                    value: moment(resultData[x]).format("MM/DD/YYYY")
                });

            $text.appendTo($label);
            $cb.appendTo($label);
            if (headerEffectiveDates[0].innerText.indexOf(moment(resultData[x]).format("MM/DD/YYYY")) == -1) {
                headerEffectiveDates.append($('<li>').append($label));
            }
        }

        // Add Select All
        var // wrapped
            $label = $('<label>'),
            $text = $('<span>', {
                text: 'Select All'
            }),
            $cb = $('<input>', {
                type: 'checkbox',
                checked: (selEffectiveDate === '' ? true : (withNonSelected == true ? false : true)),
                value: 'Select All'
            });

        $text.appendTo($label);
        $cb.appendTo($label);
        headerEffectiveDates.prepend($('<li>').append($label));

        if (withNonSelected === true) {
            headerEffectiveDates.addClass("factive");
        }
        else {
            headerEffectiveDates.removeClass("factive");
        }

    }
    ReloadExpirationDatesNew(settings, data, HeaderFilterResult.data.lstExpirationDates);

}

function ReloadExpirationDatesNew(settings, data, resultData) {

    var expirationDatesCol = 26;
    var headerExpirationDates = $('.HeaderExpirationDate').find('.cb-dropdown');
    var selExpirationDate = data.columns[expirationDatesCol].search.search.replace(/\\/g, '');
    var selExpirationDates = selExpirationDate.split(',');
    var withNonSelected = false;
    if (headerExpirationDates) {
        // First, empty list
        headerExpirationDates.empty();

        if (selExpirationDate !== '') {
            for (var x = 0; x < resultData.length; x++) {
                // Mark if any is not selected
                if (jQuery.inArray(moment(resultData[x]).format("MM/DD/YYYY"), selExpirationDates) == -1) {
                    withNonSelected = true;
                }
            }
        }

        for (var x = 0; x < resultData.length; x++) {
            var // wrapped
                $label = $('<label>'),
                $text = $('<span>', {
                    text: moment(resultData[x]).format("MM/DD/YYYY")
                }),
                $cb = $('<input>', {
                    type: 'checkbox',
                    checked: (selExpirationDate === '' ? true : (jQuery.inArray(moment(resultData[x]).format("MM/DD/YYYY"), selExpirationDates) == -1 ? false : true)),
                    value: moment(resultData[x]).format("MM/DD/YYYY")
                });

            $text.appendTo($label);
            $cb.appendTo($label);
            if (headerExpirationDates[0].innerText.indexOf(moment(resultData[x]).format("MM/DD/YYYY")) == -1) {
                headerExpirationDates.append($('<li>').append($label));
            }
        }

        // Add Select All
        var // wrapped
            $label = $('<label>'),
            $text = $('<span>', {
                text: 'Select All'
            }),
            $cb = $('<input>', {
                type: 'checkbox',
                checked: (selExpirationDate === '' ? true : (withNonSelected == true ? false : true)),
                value: 'Select All'
            });

        $text.appendTo($label);
        $cb.appendTo($label);
        headerExpirationDates.prepend($('<li>').append($label));

        if (withNonSelected === true) {
            headerExpirationDates.addClass("factive");
        }
        else {
            headerExpirationDates.removeClass("factive");
        }

    }
    ReloadWeekDayNew(settings, data, 1, HeaderFilterResult.data.lstWeekDay1);
}

function ReloadWeekDayNew(settings, data, weekdayId, resultData) {

    var weekdaycolumnIndex = 0;
    var headerWeekDayObj = null;
    switch (weekdayId) {
        case 1:// Monday
            weekdaycolumnIndex = 4;
            headerWeekDayObj = $('.HeaderWeekDayM').find('.cb-dropdown');
            break;
        case 2: // Thuesday
            weekdaycolumnIndex = 5;
            headerWeekDayObj = $('.HeaderWeekDayT').find('.cb-dropdown');
            break;
        case 3:// Wednesday
            weekdaycolumnIndex = 6;
            headerWeekDayObj = $('.HeaderWeekDayW').find('.cb-dropdown');
            break;
        case 4: //Thrusday
            weekdaycolumnIndex = 7;
            headerWeekDayObj = $('.HeaderWeekDayTH').find('.cb-dropdown');
            break;
        case 5: // Friday
            weekdaycolumnIndex = 8;
            headerWeekDayObj = $('.HeaderWeekDayF').find('.cb-dropdown');
            break;
        case 6: //Saturday
            weekdaycolumnIndex = 9;
            headerWeekDayObj = $('.HeaderWeekDaySA').find('.cb-dropdown');
            break;
        case 7: // Sunday
            weekdaycolumnIndex = 10;
            headerWeekDayObj = $('.HeaderWeekDaySU').find('.cb-dropdown');
            break;
        default:
    }
    var selweekdayValue = data.columns[weekdaycolumnIndex].search.search.replace(/\\/g, '');
    var selweekdayValues = selweekdayValue.split(',');
    var withNonSelected = false;
    if (headerWeekDayObj) {
        // First, empty list
        headerWeekDayObj.empty();

        withNonSelected = GetwithNonSelectedNew(resultData, selweekdayValue, selweekdayValues);

        CreateSearchListNew(resultData, selweekdayValue, selweekdayValues, headerWeekDayObj, withNonSelected);

        if (withNonSelected === true) {
            headerWeekDayObj.addClass("factive");
        }
        else {
            headerWeekDayObj.removeClass("factive");
        }

    }
    if (weekdayId == 1) {
        ReloadWeekDayNew(settings, data, 2, HeaderFilterResult.data.lstWeekDay2);
    }
    if (weekdayId == 2) {
        ReloadWeekDayNew(settings, data, 3, HeaderFilterResult.data.lstWeekDay3);
    }
    if (weekdayId == 3) {
        ReloadWeekDayNew(settings, data, 4, HeaderFilterResult.data.lstWeekDay4)
    }
    if (weekdayId == 4) {
        ReloadWeekDayNew(settings, data, 5, HeaderFilterResult.data.lstWeekDay5)
    }
    if (weekdayId == 5) {
        ReloadWeekDayNew(settings, data, 6, HeaderFilterResult.data.lstWeekDay6)
    }
    if (weekdayId == 6) {
        ReloadWeekDayNew(settings, data, 7, HeaderFilterResult.data.lstWeekDay7);
    }


}
function CreateSearchListNew(resulData, selweekdayValue, selweekdayValues, headerWeekDay, withNonSelected) {
    for (var x = 0; x < resulData.length; x++) {
        var text = resulData[x] == "1" ? 'Yes' : 'No'
        var
            $label = $('<label>'),
            $text = $('<span>', {
                text: text //result.data[x]
            }),
            $cb = $('<input>', {
                type: 'checkbox',
                checked: (selweekdayValue === '' ? true : (jQuery.inArray(resulData[x].toString(), selweekdayValues) == -1 ? false : true)),
                value: resulData[x]
            });

        $text.appendTo($label);
        $cb.appendTo($label);
        if (headerWeekDay[0].innerText.indexOf(resulData[x]) == -1) {
            headerWeekDay.append($('<li>').append($label));
        }

    }

    // Add Select All
    var
        $label = $('<label>'),
        $text = $('<span>', {
            text: 'Select All'
        }),
        $cb = $('<input>', {
            type: 'checkbox',
            checked: (selweekdayValue === '' ? true : (withNonSelected == true ? false : true)),
            value: 'Select All'
        });

    $text.appendTo($label);
    $cb.appendTo($label);
    headerWeekDay.prepend($('<li>').append($label));
}

function GetwithNonSelectedNew(resulData, selweekdayValue, selweekdayValues) {
    if (selweekdayValue !== '') {
        for (var x = 0; x < resulData.length; x++) {
            // Mark if any is not selected
            if (jQuery.inArray(resulData[x].toString(), selweekdayValues) == -1) {
                return true;
            }
        }
    }
    return false;
}
/// New Code Ends here
//======================
function ReloadApproved(settings, data) {
    $.ajax({
        url: '/UpfrontRemnant/GetApproved',
        type: 'POST',
        data: {
            upfrontId: getParameterByName('upfrontid'),
        },
        success: function (result) {
            var approvedCol = 2;
            var headerApproved = $('.HeaderApproved').find('.cb-dropdown');
            var selApproved = data.columns[approvedCol].search.search;
            var selApproveds = selApproved.split(',');
            var withNonSelected = false;
            if (headerApproved) {
                // First, empty list
                headerApproved.empty();

                if (selApproved !== '') {
                    for (var x = 0; x < result.data.length; x++) {
                        // Mark if any is not selected
                        if (jQuery.inArray(result.data[x], selApproveds) == -1) {
                            withNonSelected = true;
                        }
                    }
                }

                for (var x = 0; x < result.data.length; x++) {
                    var // wrapped
                        $label = $('<label>'),
                        $text = $('<span>', {
                            text: result.data[x]
                        }),
                        $cb = $('<input>', {
                            type: 'checkbox',
                            checked: (selApproved === '' ? true : (jQuery.inArray(result.data[x], selApproveds) == -1 ? false : true)),
                            value: result.data[x]
                        });

                    $text.appendTo($label);
                    $cb.appendTo($label);
                    headerApproved.append($('<li>').append($label));
                }

                // Add Select All
                var // wrapped
                    $label = $('<label>'),
                    $text = $('<span>', {
                        text: 'Select All'
                    }),
                    $cb = $('<input>', {
                        type: 'checkbox',
                        checked: (selApproved === '' ? true : (withNonSelected == true ? false : true)),
                        value: 'Select All'
                    });

                $text.appendTo($label);
                $cb.appendTo($label);
                headerApproved.prepend($('<li>').append($label));

                if (withNonSelected === true) {
                    headerApproved.addClass("factive");
                }
                else {
                    headerApproved.removeClass("factive");
                }

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


function ReloadDemoNames(settings, data) {
    $.ajax({
        url: '/UpfrontRemnant/GetDemoNames',
        type: 'POST',
        data: {
            upfrontId: getParameterByName('upfrontid'),
        },
        success: function (result) {
            var demoNameCol = 1;
            var headerDemoName = $('.HeaderDemoName').find('.cb-dropdown');
            var selDemoName = data.columns[demoNameCol].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '');
            var selDemoNames = selDemoName.split(',');
            var withNonSelected = false;
            if (headerDemoName) {
                // First, empty list
                headerDemoName.empty();

                if (selDemoName !== '') {
                    for (var x = 0; x < result.data.length; x++) {
                        // Mark if any is not selected
                        if (jQuery.inArray(result.data[x].description, selDemoNames) == -1) {
                            withNonSelected = true;
                        }
                    }
                }

                for (var x = 0; x < result.data.length; x++) {
                    var // wrapped
                        $label = $('<label>'),
                        $text = $('<span>', {
                            text: result.data[x].description
                        }),
                        $cb = $('<input>', {
                            type: 'checkbox',
                            checked: (selDemoName === '' ? true : (jQuery.inArray(result.data[x].description, selDemoNames) == -1 ? false : true)),
                            value: result.data[x].description
                        });

                    $text.appendTo($label);
                    $cb.appendTo($label);
                    if (headerDemoName[0] && headerDemoName[0].innerText.indexOf(result.data[x].description) == -1) {
                        headerDemoName.append($('<li>').append($label));
                    }
                }

                // Add Select All
                var // wrapped
                    $label = $('<label>'),
                    $text = $('<span>', {
                        text: 'Select All'
                    }),
                    $cb = $('<input>', {
                        type: 'checkbox',
                        checked: (selDemoName === '' ? true : (withNonSelected == true ? false : true)),
                        value: 'Select All'
                    });

                $text.appendTo($label);
                $cb.appendTo($label);
                headerDemoName.prepend($('<li>').append($label));

                if (withNonSelected === true) {
                    headerDemoName.addClass("factive");
                }
                else {
                    headerDemoName.removeClass("factive");
                }

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

function ReloadSPBuy(settings, data) {
    $.ajax({
        url: '/UpfrontRemnant/GetSPBuy',
        type: 'POST',
        data: {
            upfrontId: getParameterByName('upfrontid'),
            propertyNames: data.columns[3].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '')
        },
        success: function (result) {
            var spBuyCol = 15;
            var headerSPBuy = $('.HeaderSPBuy').find('.cb-dropdown');
            var selSPBuy = data.columns[spBuyCol].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '');
            var selSPBuys = selSPBuy.split(',');
            var withNonSelected = false;
            if (headerSPBuy) {
                // First, empty list
                headerSPBuy.empty();

                if (selSPBuy !== '') {
                    for (var x = 0; x < result.data.length; x++) {
                        // Mark if any is not selected                        
                        if (jQuery.inArray(result.data[x], selSPBuys) == -1) {
                            withNonSelected = true;
                        }
                    }
                }
                for (var x = 0; x < result.data.length; x++) {
                    var // wrapped
                        $label = $('<label>'),
                        $text = $('<span>', {
                            text: result.data[x] == "True" ? 'SP' : ''
                        }),
                        $cb = $('<input>', {
                            type: 'checkbox',
                            checked: (selSPBuy === '' ? true : (jQuery.inArray(result.data[x], selSPBuys) == -1 ? false : true)),
                            value: result.data[x]
                        });

                    $text.appendTo($label);
                    $cb.appendTo($label);
                    if (headerSPBuy[0] && headerSPBuy[0].innerText.indexOf(result.data[x]) == -1) {
                        headerSPBuy.append($('<li>').append($label));
                    }
                }

                // Add Select All
                var // wrapped
                    $label = $('<label>'),
                    $text = $('<span>', {
                        text: 'Select All'
                    }),
                    $cb = $('<input>', {
                        type: 'checkbox',
                        checked: (selSPBuy === '' ? true : (withNonSelected == true ? false : true)),
                        value: 'Select All'
                    });

                $text.appendTo($label);
                $cb.appendTo($label);
                headerSPBuy.prepend($('<li>').append($label));

                if (withNonSelected === true) {
                    headerSPBuy.addClass("factive");
                }
                else {
                    headerSPBuy.removeClass("factive");
                }

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

function ReloadPropertyNames(settings, data) {
    $.ajax({
        url: '/UpfrontRemnant/GetPropertyNames',
        type: 'POST',
        data: {
            upfrontId: getParameterByName('upfrontid'),
        },
        success: function (result) {
            var propertyNameCol = 3;
            var headerPropertyName = $('.HeaderPropertyName').find('.cb-dropdown');
            var selPropertyName = data.columns[propertyNameCol].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '');
            var selPropertyNames = selPropertyName.split(',');
            var withNonSelected = false;
            if (headerPropertyName) {
                // First, empty list
                headerPropertyName.empty();

                if (selPropertyName !== '') {
                    for (var x = 0; x < result.data.length; x++) {
                        // Mark if any is not selected
                        if (jQuery.inArray(result.data[x].propertyName, selPropertyNames) == -1) {
                            withNonSelected = true;
                        }
                    }
                }

                for (var x = 0; x < result.data.length; x++) {
                    var // wrapped
                        $label = $('<label>'),
                        $text = $('<span>', {
                            text: result.data[x].propertyName
                        }),
                        $cb = $('<input>', {
                            type: 'checkbox',
                            checked: (selPropertyName === '' ? true : (jQuery.inArray(result.data[x].propertyName, selPropertyNames) == -1 ? false : true)),
                            value: result.data[x].propertyName
                        });

                    $text.appendTo($label);
                    $cb.appendTo($label);
                    if (headerPropertyName[0] && jQuery.inArray(headerPropertyName[0].innerText.split('\n'), result.data[x].propertyName) == -1) {
                        headerPropertyName.append($('<li>').append($label));
                    }
                }

                // Add Select All
                var // wrapped
                    $label = $('<label>'),
                    $text = $('<span>', {
                        text: 'Select All'
                    }),
                    $cb = $('<input>', {
                        type: 'checkbox',
                        checked: (selPropertyName === '' ? true : (withNonSelected == true ? false : true)),
                        value: 'Select All'
                    });

                $text.appendTo($label);
                $cb.appendTo($label);
                headerPropertyName.prepend($('<li>').append($label));

                if (withNonSelected === true) {
                    headerPropertyName.addClass("factive");
                }
                else {
                    headerPropertyName.removeClass("factive");
                }

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

function ReloadStartTime(settings, data) {
    $.ajax({
        url: '/UpfrontRemnant/GetStartTimes',
        type: 'POST',
        data: {
            upfrontId: getParameterByName('upfrontid'),
            propertyNames: data.columns[3].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '')
        },
        success: function (result) {
            var startTimeCol = 11;
            var headerStartTime = $('.HeaderStartTime').find('.cb-dropdown');
            var selStartTime = data.columns[startTimeCol].search.search;
            var selStartTimes = selStartTime.split(',');
            var withNonSelected = false;
            if (headerStartTime) {
                // First, empty list
                headerStartTime.empty();

                if (selStartTime !== '') {
                    for (var x = 0; x < result.data.length; x++) {
                        // Mark if any is not selected
                        if (jQuery.inArray(moment(result.data[x]).format("hh:mm a"), selStartTimes) == -1) {
                            withNonSelected = true;
                        }
                    }
                }

                for (var x = 0; x < result.data.length; x++) {
                    var // wrapped
                        $label = $('<label>'),
                        $text = $('<span>', {
                            text: moment(result.data[x]).format("hh:mm a")
                        }),
                        $cb = $('<input>', {
                            type: 'checkbox',
                            checked: (selStartTime === '' ? true : (jQuery.inArray(moment(result.data[x]).format("hh:mm a"), selStartTimes) == -1 ? false : true)),
                            value: moment(result.data[x]).format("hh:mm a")
                        });

                    $text.appendTo($label);
                    $cb.appendTo($label);
                    if (headerStartTime[0] && headerStartTime[0].innerText.indexOf(moment(result.data[x]).format("hh:mm a")) == -1) {
                        headerStartTime.append($('<li>').append($label));
                    }
                }

                // Add Select All
                var // wrapped
                    $label = $('<label>'),
                    $text = $('<span>', {
                        text: 'Select All'
                    }),
                    $cb = $('<input>', {
                        type: 'checkbox',
                        checked: (selStartTime === '' ? true : (withNonSelected == true ? false : true)),
                        value: 'Select All'
                    });

                $text.appendTo($label);
                $cb.appendTo($label);
                headerStartTime.prepend($('<li>').append($label));

                if (withNonSelected === true) {
                    headerStartTime.addClass("factive");
                }
                else {
                    headerStartTime.removeClass("factive");
                }

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

function ReloadEndTime(settings, data) {
    $.ajax({
        url: '/UpfrontRemnant/GetEndTimes',
        type: 'POST',
        data: {
            upfrontId: getParameterByName('upfrontid'),
            propertyNames: data.columns[3].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '')
        },
        success: function (result) {
            var endTimeCol = 12;
            var headerEndTime = $('.HeaderEndTime').find('.cb-dropdown');
            var selEndTime = data.columns[endTimeCol].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '');
            var selEndTimes = selEndTime.split(',');
            var withNonSelected = false;
            if (headerEndTime) {
                // First, empty list
                headerEndTime.empty();

                if (selEndTime !== '') {
                    for (var x = 0; x < result.data.length; x++) {
                        // Mark if any is not selected
                        if (jQuery.inArray(moment(result.data[x]).format("hh:mm a"), selEndTimes) == -1) {
                            withNonSelected = true;
                        }
                    }
                }

                for (var x = 0; x < result.data.length; x++) {
                    var // wrapped
                        $label = $('<label>'),
                        $text = $('<span>', {
                            text: moment(result.data[x]).format("hh:mm a")
                        }),
                        $cb = $('<input>', {
                            type: 'checkbox',
                            checked: (selEndTime === '' ? true : (jQuery.inArray(moment(result.data[x]).format("hh:mm a"), selEndTimes) == -1 ? false : true)),
                            value: moment(result.data[x]).format("hh:mm a")
                        });

                    $text.appendTo($label);
                    $cb.appendTo($label);
                    if (headerEndTime[0] && headerEndTime[0].innerText.indexOf(moment(result.data[x]).format("hh:mm a")) == -1) {
                        headerEndTime.append($('<li>').append($label));
                    }
                }

                // Add Select All
                var // wrapped
                    $label = $('<label>'),
                    $text = $('<span>', {
                        text: 'Select All'
                    }),
                    $cb = $('<input>', {
                        type: 'checkbox',
                        checked: (selEndTime === '' ? true : (withNonSelected == true ? false : true)),
                        value: 'Select All'
                    });

                $text.appendTo($label);
                $cb.appendTo($label);
                headerEndTime.prepend($('<li>').append($label));

                if (withNonSelected === true) {
                    headerEndTime.addClass("factive");
                }
                else {
                    headerEndTime.removeClass("factive");
                }

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

function ReloadDayPart(settings, data) {
    $.ajax({
        url: '/UpfrontRemnant/GetDayParts',
        type: 'POST',
        data: {
            upfrontId: getParameterByName('upfrontid'),
            propertyNames: data.columns[3].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '')
        },
        success: function (result) {
            var dayPartCol = 13;
            var headerDayPart = $('.HeaderDP').find('.cb-dropdown');
            var selDayPart = data.columns[dayPartCol].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '');
            var selDayParts = selDayPart.split(',');
            var withNonSelected = false;
            if (headerDayPart) {
                // First, empty list
                headerDayPart.empty();

                if (selDayPart !== '') {
                    for (var x = 0; x < result.data.length; x++) {
                        // Mark if any is not selected
                        if (jQuery.inArray(result.data[x].dayPartCd, selDayParts) == -1) {
                            withNonSelected = true;
                        }
                    }
                }

                for (var x = 0; x < result.data.length; x++) {
                    var // wrapped
                        $label = $('<label>'),
                        $text = $('<span>', {
                            text: result.data[x].dayPartCd
                        }),
                        $cb = $('<input>', {
                            type: 'checkbox',
                            checked: (selDayPart === '' ? true : (jQuery.inArray(result.data[x].dayPartCd, selDayParts) == -1 ? false : true)),
                            value: result.data[x].dayPartCd
                        });

                    $text.appendTo($label);
                    $cb.appendTo($label);
                    if (headerDayPart[0] && headerDayPart[0].innerText.indexOf(result.data[x].dayPartCd) == -1) {
                        headerDayPart.append($('<li>').append($label));
                    }
                }

                // Add Select All
                var // wrapped
                    $label = $('<label>'),
                    $text = $('<span>', {
                        text: 'Select All'
                    }),
                    $cb = $('<input>', {
                        type: 'checkbox',
                        checked: (selDayPart === '' ? true : (withNonSelected == true ? false : true)),
                        value: 'Select All'
                    });

                $text.appendTo($label);
                $cb.appendTo($label);
                headerDayPart.prepend($('<li>').append($label));

                if (withNonSelected === true) {
                    headerDayPart.addClass("factive");
                }
                else {
                    headerDayPart.removeClass("factive");
                }

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

function ReloadOMDP(settings, data) {
    $.ajax({
        url: '/UpfrontRemnant/GetOMDPs',
        type: 'POST',
        data: {
            upfrontId: getParameterByName('upfrontid'),
            propertyNames: data.columns[3].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '')
        },
        success: function (result) {
            var OMDPCol = 14;
            var headerOMDP = $('.HeaderOMDP').find('.cb-dropdown');
            var selOMDP = data.columns[OMDPCol].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '');
            var selOMDPs = selOMDP.split(',');
            var withNonSelected = false;
            if (headerOMDP) {
                // First, empty list
                headerOMDP.empty();

                if (selOMDP !== '') {
                    for (var x = 0; x < result.data.length; x++) {
                        // Mark if any is not selected
                        if (jQuery.inArray(result.data[x], selOMDPs) == -1) {
                            withNonSelected = true;
                        }
                    }
                }

                for (var x = 0; x < result.data.length; x++) {
                    var // wrapped
                        $label = $('<label>'),
                        $text = $('<span>', {
                            text: result.data[x]
                        }),
                        $cb = $('<input>', {
                            type: 'checkbox',
                            checked: (selOMDP === '' ? true : (jQuery.inArray(result.data[x], selOMDPs) == -1 ? false : true)),
                            value: result.data[x]
                        });

                    $text.appendTo($label);
                    $cb.appendTo($label);
                    if (headerOMDP[0] && headerOMDP[0].innerText.indexOf(result.data[x]) == -1) {
                        headerOMDP.append($('<li>').append($label));
                    }
                }

                // Add Select All
                var // wrapped
                    $label = $('<label>'),
                    $text = $('<span>', {
                        text: 'Select All'
                    }),
                    $cb = $('<input>', {
                        type: 'checkbox',
                        checked: (selOMDP === '' ? true : (withNonSelected == true ? false : true)),
                        value: 'Select All'
                    });

                $text.appendTo($label);
                $cb.appendTo($label);
                headerOMDP.prepend($('<li>').append($label));

                if (withNonSelected === true) {
                    headerOMDP.addClass("factive");
                }
                else {
                    headerOMDP.removeClass("factive");
                }

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

function ReloadBuyType(settings, data) {
    $.ajax({
        url: '/UpfrontRemnant/GetBuyTypes',
        type: 'POST',
        data: {
            upfrontId: getParameterByName('upfrontid'),
            propertyNames: data.columns[3].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '')
        },
        success: function (result) {
            var BuyTypeCol = 16;
            var headerBuyType = $('.HeaderBuyType').find('.cb-dropdown');
            var selBuyType = data.columns[BuyTypeCol].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '');
            var selBuyTypes = selBuyType.split(',');
            var withNonSelected = false;
            if (headerBuyType) {
                // First, empty list
                headerBuyType.empty();

                if (selBuyType !== '') {
                    for (var x = 0; x < result.data.length; x++) {
                        // Mark if any is not selected
                        if (jQuery.inArray(result.data[x].buyTypeCode, selBuyTypes) == -1) {
                            withNonSelected = true;
                        }
                    }
                }

                for (var x = 0; x < result.data.length; x++) {
                    var // wrapped
                        $label = $('<label>'),
                        $text = $('<span>', {
                            text: result.data[x].buyTypeCode
                        }),
                        $cb = $('<input>', {
                            type: 'checkbox',
                            checked: (selBuyType === '' ? true : (jQuery.inArray(result.data[x].buyTypeCode, selBuyTypes) == -1 ? false : true)),
                            value: result.data[x].buyTypeCode
                        });

                    $text.appendTo($label);
                    $cb.appendTo($label);
                    if (headerBuyType[0].innerText.indexOf(result.data[x].buyTypeCode) == -1) {
                        headerBuyType.append($('<li>').append($label));
                    }
                }

                // Add Select All
                var // wrapped
                    $label = $('<label>'),
                    $text = $('<span>', {
                        text: 'Select All'
                    }),
                    $cb = $('<input>', {
                        type: 'checkbox',
                        checked: (selBuyType === '' ? true : (withNonSelected == true ? false : true)),
                        value: 'Select All'
                    });

                $text.appendTo($label);
                $cb.appendTo($label);
                headerBuyType.prepend($('<li>').append($label));

                if (withNonSelected === true) {
                    headerBuyType.addClass("factive");
                }
                else {
                    headerBuyType.removeClass("factive");
                }

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

function ReloadLens(settings, data) {
    $.ajax({
        url: '/UpfrontRemnant/GetLens',
        type: 'POST',
        data: {
            upfrontId: getParameterByName('upfrontid'),
            propertyNames: data.columns[3].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '')
        },
        success: function (result) {
            var LenCol = 17;
            var headerLen = $('.HeaderSpotLen').find('.cb-dropdown');
            var selLen = data.columns[LenCol].search.search;
            var selLens = selLen.split(',');
            var withNonSelected = false;
            if (headerLen) {
                // First, empty list
                headerLen.empty();

                if (selLen !== '') {
                    for (var x = 0; x < result.data.length; x++) {
                        // Mark if any is not selected
                        if (jQuery.inArray(result.data[x], selLens) == -1) {
                            withNonSelected = true;
                        }
                    }
                }

                for (var x = 0; x < result.data.length; x++) {
                    var // wrapped
                        $label = $('<label>'),
                        $text = $('<span>', {
                            text: result.data[x]
                        }),
                        $cb = $('<input>', {
                            type: 'checkbox',
                            checked: (selLen === '' ? true : (jQuery.inArray(result.data[x], selLens) == -1 ? false : true)),
                            value: result.data[x]
                        });

                    $text.appendTo($label);
                    $cb.appendTo($label);
                    headerLen.append($('<li>').append($label));
                }

                // Add Select All
                var // wrapped
                    $label = $('<label>'),
                    $text = $('<span>', {
                        text: 'Select All'
                    }),
                    $cb = $('<input>', {
                        type: 'checkbox',
                        checked: (selLen === '' ? true : (withNonSelected == true ? false : true)),
                        value: 'Select All'
                    });

                $text.appendTo($label);
                $cb.appendTo($label);
                headerLen.prepend($('<li>').append($label));

                if (withNonSelected === true) {
                    headerLen.addClass("factive");
                }
                else {
                    headerLen.removeClass("factive");
                }

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

function ReloadRateAmts(settings, data) {
    $.ajax({
        url: '/UpfrontRemnant/GetRateAmts',
        type: 'POST',
        data: {
            upfrontId: getParameterByName('upfrontid'),
            propertyNames: data.columns[3].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '')
        },
        success: function (result) {
            var rateAmtCol = 18;
            var headerRateAmt = $('.HeaderRateAmt').find('.cb-dropdown');
            var selRateAmt = data.columns[rateAmtCol].search.search;
            var selRateAmts = selRateAmt.split(',');
            var withNonSelected = false;
            if (headerRateAmt) {
                // First, empty list
                headerRateAmt.empty();

                if (selRateAmt !== '') {
                    for (var x = 0; x < result.data.length; x++) {
                        // Mark if any is not selected
                        if (jQuery.inArray(result.data[x].toString(), selRateAmts) == -1) {
                            withNonSelected = true;
                        }
                    }
                }

                for (var x = 0; x < result.data.length; x++) {
                    var // wrapped
                        $label = $('<label>'),
                        $text = $('<span>', {
                            text: $.fn.dataTable.render.number(',', '.', 2, '$').display(result.data[x])
                        }),
                        $cb = $('<input>', {
                            type: 'checkbox',
                            checked: (selRateAmt === '' ? true : (jQuery.inArray(result.data[x].toString(), selRateAmts) == -1 ? false : true)),
                            value: result.data[x]
                        });

                    $text.appendTo($label);
                    $cb.appendTo($label);
                    if (headerRateAmt[0].innerText.indexOf($.fn.dataTable.render.number(',', '.', 2, '$').display(result.data[x])) == -1) {
                        headerRateAmt.append($('<li>').append($label));
                    }
                }

                // Add Select All
                var // wrapped
                    $label = $('<label>'),
                    $text = $('<span>', {
                        text: 'Select All'
                    }),
                    $cb = $('<input>', {
                        type: 'checkbox',
                        checked: (selRateAmt === '' ? true : (withNonSelected == true ? false : true)),
                        value: 'Select All'
                    });

                $text.appendTo($label);
                $cb.appendTo($label);
                headerRateAmt.prepend($('<li>').append($label));

                if (withNonSelected === true) {
                    headerRateAmt.addClass("factive");
                }
                else {
                    headerRateAmt.removeClass("factive");
                }

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

function ReloadImpressions(settings, data) {
    $.ajax({
        url: '/UpfrontRemnant/GetImpressions',
        type: 'POST',
        data: {
            upfrontId: getParameterByName('upfrontid'),
            propertyNames: data.columns[3].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '')
        },
        success: function (result) {
            var impressionCol = 19;
            var headerImpression = $('.HeaderImpression').find('.cb-dropdown');
            var selImpression = data.columns[impressionCol].search.search;
            var selImpressions = selImpression.split(',');
            var withNonSelected = false;
            if (headerImpression) {
                // First, empty list
                headerImpression.empty();

                if (selImpression !== '') {
                    for (var x = 0; x < result.data.length; x++) {
                        // Mark if any is not selected
                        if (jQuery.inArray(result.data[x].toString(), selImpressions) == -1) {
                            withNonSelected = true;
                        }
                    }
                }

                for (var x = 0; x < result.data.length; x++) {
                    var // wrapped
                        $label = $('<label>'),
                        $text = $('<span>', {
                            text: $.fn.dataTable.render.number(',', '.', 2, '').display(result.data[x])
                        }),
                        $cb = $('<input>', {
                            type: 'checkbox',
                            checked: (selImpression === '' ? true : (jQuery.inArray(result.data[x].toString(), selImpressions) == -1 ? false : true)),
                            value: result.data[x]
                        });

                    $text.appendTo($label);
                    $cb.appendTo($label);
                    if (headerImpression[0].innerText.indexOf($.fn.dataTable.render.number(',', '.', 2, '$').display(result.data[x])) == -1) {
                        headerImpression.append($('<li>').append($label));
                    }
                }

                // Add Select All
                var // wrapped
                    $label = $('<label>'),
                    $text = $('<span>', {
                        text: 'Select All'
                    }),
                    $cb = $('<input>', {
                        type: 'checkbox',
                        checked: (selImpression === '' ? true : (withNonSelected == true ? false : true)),
                        value: 'Select All'
                    });

                $text.appendTo($label);
                $cb.appendTo($label);
                headerImpression.prepend($('<li>').append($label));

                if (withNonSelected === true) {
                    headerImpression.addClass("factive");
                }
                else {
                    headerImpression.removeClass("factive");
                }

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

function ReloadCPMs(settings, data) {
    $.ajax({
        url: '/UpfrontRemnant/GetCPM',
        type: 'POST',
        data: {
            upfrontId: getParameterByName('upfrontid'),
            propertyNames: data.columns[3].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '')
        },
        success: function (result) {
            var CPMCol = 20;
            var headerCPM = $('.HeaderCPM').find('.cb-dropdown');
            var selCPM = data.columns[CPMCol].search.search.replace(/[\/\\^*?|[\]{}]/g, '');
            var selCPMs = selCPM.split(',');
            var withNonSelected = false;
            if (headerCPM) {
                // First, empty list
                headerCPM.empty();

                if (selCPM !== '') {
                    for (var x = 0; x < result.data.length; x++) {
                        // Mark if any is not selected
                        if (jQuery.inArray(result.data[x].toString(), selCPMs) == -1) {
                            withNonSelected = true;
                        }
                    }
                }

                for (var x = 0; x < result.data.length; x++) {
                    var // wrapped
                        $label = $('<label>'),
                        $text = $('<span>', {
                            text: $.fn.dataTable.render.number(',', '.', 2, '$').display(result.data[x])
                        }),
                        $cb = $('<input>', {
                            type: 'checkbox',
                            checked: (selCPM === '' ? true : (jQuery.inArray(result.data[x].toString(), selCPMs) == -1 ? false : true)),
                            value: result.data[x]
                        });

                    $text.appendTo($label);
                    $cb.appendTo($label);
                    if (headerCPM[0].innerText.indexOf($.fn.dataTable.render.number(',', '.', 2, '$').display(result.data[x])) == -1) {
                        headerCPM.append($('<li>').append($label));
                    }
                }

                // Add Select All
                var // wrapped
                    $label = $('<label>'),
                    $text = $('<span>', {
                        text: 'Select All'
                    }),
                    $cb = $('<input>', {
                        type: 'checkbox',
                        checked: (selCPM === '' ? true : (withNonSelected == true ? false : true)),
                        value: 'Select All'
                    });

                $text.appendTo($label);
                $cb.appendTo($label);
                headerCPM.prepend($('<li>').append($label));

                if (withNonSelected === true) {
                    headerCPM.addClass("factive");
                }
                else {
                    headerCPM.removeClass("factive");
                }

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

function ReloadDoNotBuyTypes(settings, data) {
    $.ajax({
        url: '/UpfrontRemnant/GetDoNotBuyTypes',
        type: 'POST',
        data: {
            upfrontId: getParameterByName('upfrontid'),
            propertyNames: data.columns[3].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '')
        },
        success: function (result) {
            var DoNotBuyTypeCol = 21;
            var headerDoNotBuyType = $('.HeaderDoNotBuyType').find('.cb-dropdown');
            var selDoNotBuyType = data.columns[DoNotBuyTypeCol].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '');
            var selDoNotBuyTypes = selDoNotBuyType.split(',');
            var withNonSelected = false;
            if (headerDoNotBuyType) {
                // First, empty list
                headerDoNotBuyType.empty();

                if (selDoNotBuyType !== '') {
                    for (var x = 0; x < result.data.length; x++) {
                        // Mark if any is not selected
                        if (jQuery.inArray(result.data[x].description, selDoNotBuyTypes) == -1) {
                            withNonSelected = true;
                        }
                    }
                }

                for (var x = 0; x < result.data.length; x++) {
                    var // wrapped
                        $label = $('<label>'),
                        $text = $('<span>', {
                            text: result.data[x].description
                        }),
                        $cb = $('<input>', {
                            type: 'checkbox',
                            checked: (selDoNotBuyType === '' ? true : (jQuery.inArray(result.data[x].description, selDoNotBuyTypes) == -1 ? false : true)),
                            value: result.data[x].description
                        });

                    $text.appendTo($label);
                    $cb.appendTo($label);
                    if (headerDoNotBuyType[0].innerText.indexOf(result.data[x].description) == -1) {
                        headerDoNotBuyType.append($('<li>').append($label));
                    }
                }

                // Add Select All
                var // wrapped
                    $label = $('<label>'),
                    $text = $('<span>', {
                        text: 'Select All'
                    }),
                    $cb = $('<input>', {
                        type: 'checkbox',
                        checked: (selDoNotBuyType === '' ? true : (withNonSelected == true ? false : true)),
                        value: 'Select All'
                    });

                $text.appendTo($label);
                $cb.appendTo($label);
                headerDoNotBuyType.prepend($('<li>').append($label));

                if (withNonSelected === true) {
                    headerDoNotBuyType.addClass("factive");
                }
                else {
                    headerDoNotBuyType.removeClass("factive");
                }

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

function ReloadClients(settings, data) {
    $.ajax({
        url: '/UpfrontRemnant/GetClients',
        type: 'POST',
        data: {
            upfrontId: getParameterByName('upfrontid'),
            propertyNames: data.columns[3].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '')
        },
        success: function (result) {
            var ClientCol = 22;
            var headerClient = $('.HeaderClient').find('.cb-dropdown');
            var selClient = data.columns[ClientCol].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '');
            var selClients = selClient.split(',');
            var withNonSelected = false;
            if (headerClient) {
                // First, empty list
                headerClient.empty();

                if (selClient !== '') {
                    for (var x = 0; x < result.data.length; x++) {
                        // Mark if any is not selected
                        if (jQuery.inArray(result.data[x].clientName.replace('\\', ''), selClients) == -1) {
                            withNonSelected = true;
                        }
                    }
                }

                for (var x = 0; x < result.data.length; x++) {
                    var // wrapped
                        $label = $('<label>'),
                        $text = $('<span>', {
                            text: result.data[x].clientName
                        }),
                        $cb = $('<input>', {
                            type: 'checkbox',
                            checked: (selClient === '' ? true : (jQuery.inArray(result.data[x].clientName.replace('\\', ''), selClients) == -1 ? false : true)),
                            value: result.data[x].clientName
                        });

                    $text.appendTo($label);
                    $cb.appendTo($label);
                    if (headerClient[0].innerText.indexOf(result.data[x].clientName) == -1) {
                        headerClient.append($('<li>').append($label));
                    }
                }

                // Add Select All
                var // wrapped
                    $label = $('<label>'),
                    $text = $('<span>', {
                        text: 'Select All'
                    }),
                    $cb = $('<input>', {
                        type: 'checkbox',
                        checked: (selClient === '' ? true : (withNonSelected == true ? false : true)),
                        value: 'Select All'
                    });

                $text.appendTo($label);
                $cb.appendTo($label);
                headerClient.prepend($('<li>').append($label));

                if (withNonSelected === true) {
                    headerClient.addClass("factive");
                }
                else {
                    headerClient.removeClass("factive");
                }

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

function ReloadRev(settings, data) {
    $.ajax({
        url: '/UpfrontRemnant/GetRevisions',
        type: 'POST',
        data: {
            upfrontId: getParameterByName('upfrontid'),
            propertyNames: data.columns[3].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '')
        },
        success: function (result) {
            var RevisionCol = 23;
            var headerRevision = $('.HeaderRevNo').find('.cb-dropdown');
            var selRevision = data.columns[RevisionCol].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '');
            var selRevisions = selRevision.split(',');
            var withNonSelected = false;
            if (headerRevision) {
                // First, empty list
                headerRevision.empty();

                if (selRevision !== '') {
                    for (var x = 0; x < result.data.length; x++) {
                        // Mark if any is not selected
                        if (jQuery.inArray(result.data[x], selRevisions) == -1) {
                            withNonSelected = true;
                        }
                    }
                }

                for (var x = 0; x < result.data.length; x++) {
                    var // wrapped
                        $label = $('<label>'),
                        $text = $('<span>', {
                            text: result.data[x]
                        }),
                        $cb = $('<input>', {
                            type: 'checkbox',
                            checked: (selRevision === '' ? true : (jQuery.inArray(result.data[x], selRevisions) == -1 ? false : true)),
                            value: result.data[x]
                        });

                    $text.appendTo($label);
                    $cb.appendTo($label);
                    if (headerRevision[0].innerText.indexOf(result.data[x]) == -1) {
                        headerRevision.append($('<li>').append($label));
                    }
                }

                // Add Select All
                var // wrapped
                    $label = $('<label>'),
                    $text = $('<span>', {
                        text: 'Select All'
                    }),
                    $cb = $('<input>', {
                        type: 'checkbox',
                        checked: (selRevision === '' ? true : (withNonSelected == true ? false : true)),
                        value: 'Select All'
                    });

                $text.appendTo($label);
                $cb.appendTo($label);
                headerRevision.prepend($('<li>').append($label));

                if (withNonSelected === true) {
                    headerRevision.addClass("factive");
                }
                else {
                    headerRevision.removeClass("factive");
                }

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

function ReloadRevisedDates(settings, data) {
    $.ajax({
        url: '/UpfrontRemnant/GetRevisedDates',
        type: 'POST',
        data: {
            upfrontId: getParameterByName('upfrontid'),
            propertyNames: data.columns[3].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '')
        },
        success: function (result) {
            var revisedDatesCol = 24;
            var headerRevisedDates = $('.HeaderRateRevisedDate').find('.cb-dropdown');
            var selRevisedDate = data.columns[revisedDatesCol].search.search.replace(/\\/g, '');
            var selRevisedDates = selRevisedDate.split(',');
            var withNonSelected = false;
            if (headerRevisedDates) {
                // First, empty list
                headerRevisedDates.empty();

                if (selRevisedDate !== '') {
                    for (var x = 0; x < result.data.length; x++) {
                        // Mark if any is not selected
                        if (jQuery.inArray(moment(result.data[x]).format("MM/DD/YYYY"), selRevisedDates) == -1) {
                            withNonSelected = true;
                        }
                    }
                }

                for (var x = 0; x < result.data.length; x++) {
                    var // wrapped
                        $label = $('<label>'),
                        $text = $('<span>', {
                            text: moment(result.data[x]).format("MM/DD/YYYY")
                        }),
                        $cb = $('<input>', {
                            type: 'checkbox',
                            checked: (selRevisedDate === '' ? true : (jQuery.inArray(moment(result.data[x]).format("MM/DD/YYYY"), selRevisedDates) == -1 ? false : true)),
                            value: moment(result.data[x]).format("MM/DD/YYYY")
                        });

                    $text.appendTo($label);
                    $cb.appendTo($label);
                    if (headerRevisedDates[0].innerText.indexOf(moment(result.data[x]).format("MM/DD/YYYY")) == -1) {
                        headerRevisedDates.append($('<li>').append($label));
                    }
                }

                // Add Select All
                var // wrapped
                    $label = $('<label>'),
                    $text = $('<span>', {
                        text: 'Select All'
                    }),
                    $cb = $('<input>', {
                        type: 'checkbox',
                        checked: (selRevisedDate === '' ? true : (withNonSelected == true ? false : true)),
                        value: 'Select All'
                    });

                $text.appendTo($label);
                $cb.appendTo($label);
                headerRevisedDates.prepend($('<li>').append($label));

                if (withNonSelected === true) {
                    headerRevisedDates.addClass("factive");
                }
                else {
                    headerRevisedDates.removeClass("factive");
                }

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

function ReloadEffectiveDates(settings, data) {
    $.ajax({
        url: '/UpfrontRemnant/GetEffectiveDates',
        type: 'POST',
        data: {
            upfrontId: getParameterByName('upfrontid'),
            propertyNames: data.columns[3].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '')
        },
        success: function (result) {
            var effectiveDatesCol = 25;
            var headerEffectiveDates = $('.HeaderEffectiveDate').find('.cb-dropdown');
            var selEffectiveDate = data.columns[effectiveDatesCol].search.search.replace(/\\/g, '');
            var selEffectiveDates = selEffectiveDate.split(',');
            var withNonSelected = false;
            if (headerEffectiveDates) {
                // First, empty list
                headerEffectiveDates.empty();

                if (selEffectiveDate !== '') {
                    for (var x = 0; x < result.data.length; x++) {
                        // Mark if any is not selected
                        if (jQuery.inArray(moment(result.data[x]).format("MM/DD/YYYY"), selEffectiveDates) == -1) {
                            withNonSelected = true;
                        }
                    }
                }

                for (var x = 0; x < result.data.length; x++) {
                    var // wrapped
                        $label = $('<label>'),
                        $text = $('<span>', {
                            text: moment(result.data[x]).format("MM/DD/YYYY")
                        }),
                        $cb = $('<input>', {
                            type: 'checkbox',
                            checked: (selEffectiveDate === '' ? true : (jQuery.inArray(moment(result.data[x]).format("MM/DD/YYYY"), selEffectiveDates) == -1 ? false : true)),
                            value: moment(result.data[x]).format("MM/DD/YYYY")
                        });

                    $text.appendTo($label);
                    $cb.appendTo($label);
                    if (headerEffectiveDates[0].innerText.indexOf(moment(result.data[x]).format("MM/DD/YYYY")) == -1) {
                        headerEffectiveDates.append($('<li>').append($label));
                    }
                }

                // Add Select All
                var // wrapped
                    $label = $('<label>'),
                    $text = $('<span>', {
                        text: 'Select All'
                    }),
                    $cb = $('<input>', {
                        type: 'checkbox',
                        checked: (selEffectiveDate === '' ? true : (withNonSelected == true ? false : true)),
                        value: 'Select All'
                    });

                $text.appendTo($label);
                $cb.appendTo($label);
                headerEffectiveDates.prepend($('<li>').append($label));

                if (withNonSelected === true) {
                    headerEffectiveDates.addClass("factive");
                }
                else {
                    headerEffectiveDates.removeClass("factive");
                }

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

function ReloadExpirationDates(settings, data) {
    $.ajax({
        url: '/UpfrontRemnant/GetExpirationDates',
        type: 'POST',
        data: {
            upfrontId: getParameterByName('upfrontid'),
            propertyNames: data.columns[3].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, '')
        },
        success: function (result) {
            var expirationDatesCol = 26;
            var headerExpirationDates = $('.HeaderExpirationDate').find('.cb-dropdown');
            var selExpirationDate = data.columns[expirationDatesCol].search.search.replace(/\\/g, '');
            var selExpirationDates = selExpirationDate.split(',');
            var withNonSelected = false;
            if (headerExpirationDates) {
                // First, empty list
                headerExpirationDates.empty();

                if (selExpirationDate !== '') {
                    for (var x = 0; x < result.data.length; x++) {
                        // Mark if any is not selected
                        if (jQuery.inArray(moment(result.data[x]).format("MM/DD/YYYY"), selExpirationDates) == -1) {
                            withNonSelected = true;
                        }
                    }
                }

                for (var x = 0; x < result.data.length; x++) {
                    var // wrapped
                        $label = $('<label>'),
                        $text = $('<span>', {
                            text: moment(result.data[x]).format("MM/DD/YYYY")
                        }),
                        $cb = $('<input>', {
                            type: 'checkbox',
                            checked: (selExpirationDate === '' ? true : (jQuery.inArray(moment(result.data[x]).format("MM/DD/YYYY"), selExpirationDates) == -1 ? false : true)),
                            value: moment(result.data[x]).format("MM/DD/YYYY")
                        });

                    $text.appendTo($label);
                    $cb.appendTo($label);
                    if (headerExpirationDates[0].innerText.indexOf(moment(result.data[x]).format("MM/DD/YYYY")) == -1) {
                        headerExpirationDates.append($('<li>').append($label));
                    }
                }

                // Add Select All
                var // wrapped
                    $label = $('<label>'),
                    $text = $('<span>', {
                        text: 'Select All'
                    }),
                    $cb = $('<input>', {
                        type: 'checkbox',
                        checked: (selExpirationDate === '' ? true : (withNonSelected == true ? false : true)),
                        value: 'Select All'
                    });

                $text.appendTo($label);
                $cb.appendTo($label);
                headerExpirationDates.prepend($('<li>').append($label));

                if (withNonSelected === true) {
                    headerExpirationDates.addClass("factive");
                }
                else {
                    headerExpirationDates.removeClass("factive");
                }

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

function ReloadWeekDay(settings, data, weekdayId) {

    $.ajax({
        url: '/UpfrontRemnant/GetWeekDay',
        type: 'POST',
        data: {
            upfrontId: getParameterByName('upfrontid'),
            propertyNames: data.columns[3].search.search.replace(/[\/\\^$*?.()|[\]{}]/g, ''),
            weekdayId: weekdayId,
        },
        success: function (result) {
            var weekdaycolumnIndex = 0;
            var headerWeekDayObj = null;
            switch (weekdayId) {
                case 1:// Monday
                    weekdaycolumnIndex = 4;
                    headerWeekDayObj = $('.HeaderWeekDayM').find('.cb-dropdown');
                    break;
                case 2: // Thuesday
                    weekdaycolumnIndex = 5;
                    headerWeekDayObj = $('.HeaderWeekDayT').find('.cb-dropdown');
                    break;
                case 3:// Wednesday
                    weekdaycolumnIndex = 6;
                    headerWeekDayObj = $('.HeaderWeekDayW').find('.cb-dropdown');
                    break;
                case 4: //Thrusday
                    weekdaycolumnIndex = 7;
                    headerWeekDayObj = $('.HeaderWeekDayTH').find('.cb-dropdown');
                    break;
                case 5: // Friday
                    weekdaycolumnIndex = 8;
                    headerWeekDayObj = $('.HeaderWeekDayF').find('.cb-dropdown');
                    break;
                case 6: //Saturday
                    weekdaycolumnIndex = 9;
                    headerWeekDayObj = $('.HeaderWeekDaySA').find('.cb-dropdown');
                    break;
                case 7: // Sunday
                    weekdaycolumnIndex = 10;
                    headerWeekDayObj = $('.HeaderWeekDaySU').find('.cb-dropdown');
                    break;
                default:
            }
            var selweekdayValue = data.columns[weekdaycolumnIndex].search.search.replace(/\\/g, '');
            var selweekdayValues = selweekdayValue.split(',');
            var withNonSelected = false;
            if (headerWeekDayObj) {
                // First, empty list
                headerWeekDayObj.empty();

                withNonSelected = GetwithNonSelected(result, selweekdayValue, selweekdayValues);

                CreateSearchList(result, selweekdayValue, selweekdayValues, headerWeekDayObj, withNonSelected);

                if (withNonSelected === true) {
                    headerWeekDayObj.addClass("factive");
                }
                else {
                    headerWeekDayObj.removeClass("factive");
                }

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

function CreateSearchList(result, selweekdayValue, selweekdayValues, headerWeekDay, withNonSelected) {
    for (var x = 0; x < result.data.length; x++) {
        var text = result.data[x] == "1" ? 'Yes' : 'No'
        var
            $label = $('<label>'),
            $text = $('<span>', {
                text: text //result.data[x]
            }),
            $cb = $('<input>', {
                type: 'checkbox',
                checked: (selweekdayValue === '' ? true : (jQuery.inArray(result.data[x].toString(), selweekdayValues) == -1 ? false : true)),
                value: result.data[x]
            });

        $text.appendTo($label);
        $cb.appendTo($label);
        if (headerWeekDay[0].innerText.indexOf(result.data[x]) == -1) {
            headerWeekDay.append($('<li>').append($label));
        }

    }

    // Add Select All
    var
        $label = $('<label>'),
        $text = $('<span>', {
            text: 'Select All'
        }),
        $cb = $('<input>', {
            type: 'checkbox',
            checked: (selweekdayValue === '' ? true : (withNonSelected == true ? false : true)),
            value: 'Select All'
        });

    $text.appendTo($label);
    $cb.appendTo($label);
    headerWeekDay.prepend($('<li>').append($label));
}

function GetwithNonSelected(result, selweekdayValue, selweekdayValues) {
    if (selweekdayValue !== '') {
        for (var x = 0; x < result.data.length; x++) {
            // Mark if any is not selected
            if (jQuery.inArray(result.data[x].toString(), selweekdayValues) == -1) {
                return true;
            }
        }
    }
    return false;
}
/*
*/