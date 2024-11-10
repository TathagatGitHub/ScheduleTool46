function SaveSettings(_profileKey, _profileValue) {
    var url = "/User/SetUserProfile/";

    $.ajax({
        url: url,
        data: {
            ProfileKey: _profileKey,
            ProfileValue: _profileValue
        },
        cache: false,
        type: "POST",
        success: function (result) {
        },
        error: function (response) {
        }
    });

}

function LoadUrl(url) {
    window.location.href = url;
}

function formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + " " + strTime;
}

function formatDateOnly(date) {
    return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
}

function ReplaceNumberWithCommas(yourNumber) {
    //Seperates the components of the number
    var n = yourNumber.toString().split(".");
    //Comma-fies the first part
    n[0] = n[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //Combines the two sections
    return n.join(".");
}


function formatCurrency(total) {
    var neg = false;
    if (total < 0) {
        neg = true;
        total = Math.abs(total);
    }
    return (neg ? "-$" : '$') + parseFloat(total, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString();
}

function formatCurrency(total, precision) {
    try {
        var neg = false;
        if (!isNumber(total)) {
            return total;
        }
        if (total < 0) {
            neg = true;
            total = Math.abs(total);
        }
        return (neg ? "-$" : '$') + (ReplaceNumberWithCommas(parseFloat(total, 10).toFixed(precision).replace(/(\d)(?=(\d{3})+\.)/g, "$1,"))).toString();
    }
    catch (err) {
        return 'N/A';
    }
}

function unformatCurrency(currency) {
        return Number(currency.replace(/[^0-9.-]+/g, ""));
}

function OpenNewWindow(_WindowHeight, _WindowWidth, _Url, _UrlParent) {
    var params = [
        'height=' + (screen.height - 50),
        'width=' + (screen.width - 100),
        'fullscreen=yes', // only works in IE, but here for completeness
        'resizable=yes',
        'scrollable=yes',
        'scrollbars=yes',
        'directories=0',
        'titlebar=0',
        'toolbar=0',
        'location=0',
        'status=0',
        'menubar=0',
        'status=yes'
    ].join(',');
    var popup = window.open(_Url, _Url, params);
    popup.moveTo(0, 0)
    window.location.href = _UrlParent;
}


function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function isAlphaNumeric(str) {
    var code, i, len;

    for (i = 0, len = str.length; i < len; i++) {
        code = str.charCodeAt(i);
        if (!(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123) && // lower alpha (a-z)
            !(code = 43)) { 
            return false;
        }
    }
    return true;
};


function validateHhMm(time) {
    if (!time) {
        return false;
    }
    var military = /^\s*([01]?\d|2[0-3]):[0-5]\d\s*$/i;
    var standard = /^\s*(0?\d|1[0-2]):[0-5]\d(\s+(AM|PM))?\s*$/i;
    return time.match(military) || time.match(standard);
}

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function validateCurrency(currency) {
    if (!currency)
        return false;

    var currencyFormat = '(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$';
    return currency.match(currencyFormat);

}

function ValidateDate(testdate) {
    var Status
    var reg = /^(((0[13578]|1[02])[\/\.-](0[1-9]|[12]\d|3[01])[\/\.-]((19|[2-9]\d)\d{2})\s(0[0-9]|1[0-2]):(0[0-9]|[1-59]\d):(0[0-9]|[1-59]\d)\s(AM|am|PM|pm))|((0[13456789]|1[012])[\/\.-](0[1-9]|[12]\d|30)[\/\.-]((19|[2-9]\d)\d{2})\s(0[0-9]|1[0-2]):(0[0-9]|[1-59]\d):(0[0-9]|[1-59]\d)\s(AM|am|PM|pm))|((02)[\/\.-](0[1-9]|1\d|2[0-8])[\/\.-]((19|[2-9]\d)\d{2})\s(0[0-9]|1[0-2]):(0[0-9]|[1-59]\d):(0[0-9]|[1-59]\d)\s(AM|am|PM|pm))|((02)[\/\.-](29)[\/\.-]((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))\s(0[0-9]|1[0-2]):(0[0-9]|[1-59]\d):(0[0-9]|[1-59]\d)\s(AM|am|PM|pm)))$/g;

    if (!reg.test(testdate)) {
        Status = false;
    }
    return Status;
}

function ValidateDateOnly(dtValue2) {
    // your desired pattern
    var pattern = /(0\d{1}|1[0-2])\/([0-2]\d{1}|3[0-1])\/(19|20)(\d{2})/
    var m = dtValue2.match(pattern);
    if (!m)
        return false;
    var d = new Date(dtValue2);
    // Now let's ensure that the date is not out of index


    if (d.getMonth() + 1 == parseInt(m[1], 10) && d.getDate() == parseInt(m[2], 10)) {
        return true;
    }
    return false;
}

function ValidateHhMmSs(time) {
    if (!time) {
        return false;
    }
    var military = /^\s*([01]?\d|2[0-3]):[0-5]\d:[0-5]\d\s*$/i;
    var standard = /^((([0]?[1-9]|1[0-2])(:|\.)[0-5][0-9]((:|\.)[0-5][0-9])?( )?(AM|am|aM|Am|PM|pm|pM|Pm))|(([0]?[0-9]|1[0-9]|2[0-3])(:|\.)[0-5][0-9]((:|\.)[0-5][0-9])?))$/i;
    return time.match(military) || time.match(standard);
}

function GetClients(_countryid) {
    var procemessage = "<option value='0'> Please wait...</option>";
    $("#ddlClient").html(procemessage).show();
    var url = "/Client/GetClientByCountryId/";

    $.ajax({
        url: url,
        data: { countryid: _countryid },
        cache: false,
        type: "POST",
        success: function (result) {
            var markup = "";
            markup += "<option>Please select ...</option>";
            for (var x = 0; x < result.length; x++) {
                markup += "<option value=" + result[x].value + ">" + result[x].text + "</option>";
            }
            $("#ddlClient").html(markup).show();
        },
        error: function (response) {
            alert ("error : " + response.responseText);
        }
    });
}

function AutoFillTime(TimeTextBox) {
    if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:0a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:00a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12: a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:0 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0000'
    ) {
        $(TimeTextBox).val('12:00 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:3a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:30a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:3 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:30 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0030'
    ) {
        $(TimeTextBox).val('12:30 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase().toLowerCase() == '1a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:0a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:00a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1: a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:0 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0100'
    ) {
        $(TimeTextBox).val('1:00 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:3a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:30a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:3 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:30 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0130'
    ) {
        $(TimeTextBox).val('1:30 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:0a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:00a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2: a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:0 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0200'
    ) {
        $(TimeTextBox).val('2:00 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:3a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:30a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:3 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:30 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0230'
    ) {
        $(TimeTextBox).val('2:30 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:0a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:00a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3: a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:0 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0300'
    ) {
        $(TimeTextBox).val('3:00 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:3a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:30a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:3 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:30 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0330'
    ) {
        $(TimeTextBox).val('3:30 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:0a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:00a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4: a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:0 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0400'
    ) {
        $(TimeTextBox).val('4:00 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:3a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:30a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:3 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:30 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0430'
    ) {
        $(TimeTextBox).val('4:30 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:0a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:00a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5: a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:0 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0500'
    ) {
        $(TimeTextBox).val('5:00 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:3a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:30a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:3 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:30 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0530'
    ) {
        $(TimeTextBox).val('5:30 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:0a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:00a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6: a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:0 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0600'
    ) {
        $(TimeTextBox).val('6:00 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:3a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:30a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:3 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:30 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0630'
    ) {
        $(TimeTextBox).val('6:30 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:0a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:00a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7: a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:0 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0700'
    ) {
        $(TimeTextBox).val('7:00 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:3a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:30a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:3 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:30 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0730'
    ) {
        $(TimeTextBox).val('7:30 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:0a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:00a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8: a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:0 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0800'
    ) {
        $(TimeTextBox).val('8:00 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:3a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:30a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:3 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:30 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0830'
    ) {
        $(TimeTextBox).val('8:30 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:0a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:00a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9: a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:0 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0900'
    ) {
        $(TimeTextBox).val('9:00 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:3a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:30a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:3 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:30 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '0930'
    ) {
        $(TimeTextBox).val('9:30 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:0a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:00a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10: a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:0 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1000'
    ) {
        $(TimeTextBox).val('10:00 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:3a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:30a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:3 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:30 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1030'
    ) {
        $(TimeTextBox).val('10:30 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:0a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:00a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11: a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:0 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:00 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1100'
    ) {
        $(TimeTextBox).val('11:00 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:3a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:30a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:3 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:30 a' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1130'
    ) {
        $(TimeTextBox).val('11:30 AM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:0p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:00p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12: p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:0 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1200'
    ) {
        $(TimeTextBox).val('12:00 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:3p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:30p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:3 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '12:30 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1230'
    ) {
        $(TimeTextBox).val('12:30 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:0p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:00p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1: p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:0 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1300'
    ) {
        $(TimeTextBox).val('1:00 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:3p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:30p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:3 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1:30 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1330'
    ) {
        $(TimeTextBox).val('1:30 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:0p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:00p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2: p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:0 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1400'
    ) {
        $(TimeTextBox).val('2:00 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:3p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:30p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:3 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2:30 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1430'
    ) {
        $(TimeTextBox).val('2:30 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:0p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:00p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3: p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:0 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1500'
    ) {
        $(TimeTextBox).val('3:00 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:3p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:30p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:3 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '3:30 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1530'
    ) {
        $(TimeTextBox).val('3:30 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:0p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:00p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4: p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:0 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1600'
    ) {
        $(TimeTextBox).val('4:00 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:3p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:30p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:3 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '4:30 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1630'
    ) {
        $(TimeTextBox).val('4:30 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:0p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:00p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5: p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:0 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1700'
    ) {
        $(TimeTextBox).val('5:00 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:3p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:30p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:3 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '5:30 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1730'
    ) {
        $(TimeTextBox).val('5:30 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:0p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:00p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6: p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:0 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1800'
    ) {
        $(TimeTextBox).val('6:00 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:3p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:30p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:3 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '6:30 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1830'
    ) {
        $(TimeTextBox).val('6:30 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:0p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:00p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7: p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:0 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1900'
    ) {
        $(TimeTextBox).val('7:00 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:3p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:30p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:3 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '7:30 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '1930'
    ) {
        $(TimeTextBox).val('7:30 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:0p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:00p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8: p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:0 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2000'
    ) {
        $(TimeTextBox).val('8:00 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:3p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:30p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:3 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '8:30 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2030'
    ) {
        $(TimeTextBox).val('8:30 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:0p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:00p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9: p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:0 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2100'
    ) {
        $(TimeTextBox).val('9:00 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:3p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:30p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:3 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '9:30 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2130'
    ) {
        $(TimeTextBox).val('9:30 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:0p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:00p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10: p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:0 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2200'
    ) {
        $(TimeTextBox).val('10:00 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:3p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:30p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:3 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '10:30 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2230'
    ) {
        $(TimeTextBox).val('10:30 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:0p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:00p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11: p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:0 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:00 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2300'
    ) {
        $(TimeTextBox).val('11:00 PM');
    }
    else if (
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:3p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:30p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:3 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '11:30 p' ||
        ($(TimeTextBox).val().replace(/\s+/g, '')).toLowerCase() == '2330'
    ) {
        $(TimeTextBox).val('11:30 PM');
    }

}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
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













