/*
function GetSettings(_profileKey) {
    var url = "/ManageMedia/GetUserProfile/";

    $.ajax({
        url: url,
        data: {
            ProfileKey: _profileKey
        },
        cache: false,
        type: "POST",
        success: function (result) {
        },
        error: function (response) {
        }
    });

}
*/

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

function OpenNewWindow(_WindowHeight, _WindowWidth, _Url) {
    var params = [
        'height=' + screen.height,
        'width=' + screen.width
    ].join(',');
    var popup = window.open(_Url, 'popup_window', params);
    popup.moveTo(0, 0);
    //window.open(_Url, '_blank', 'directories=0,titlebar=0,toolbar=0,location=0,status=0,menubar=0,scrollbars=no,resizable=yes,height=' + _WindowHeight + ',width=' + _WindowWidth + ',scrollbars=yes,status=yes');
    window.location.reload();
}


