/**
 * This javascript file checks for the brower/browser tab action.
 * It is based on the file menstioned by Daniel Melo.
 * Reference: http://stackoverflow.com/questions/1921941/close-kill-the-session-when-the-browser-or-tab-is-closed
 */
var validNavigation = false;
var dont_confirm_leave = 1; //set dont_confirm_leave to 1 when you want the user to be able to leave without confirmation
var dont_reload = 1;

function promptExit(prompt) {
    if (prompt === 1) {
        dont_confirm_leave = 0;
    }
    else {
        dont_confirm_leave = 1;
    }
}
function reloadParent(reload) {
    if (reload === 1) {
        dont_reload = 0;
    }
    else {
        dont_reload = 1;
    }
}
function wireUpEvents() {
    /**
     * For a list of events that triggers onbeforeunload on IE
     * check http://msdn.microsoft.com/en-us/library/ms536907(VS.85).aspx
     *
     * onbeforeunload for IE and chrome
     * check http://stackoverflow.com/questions/1802930/setting-onbeforeunload-on-body-element-in-chrome-and-ie-using-jquery
     */
    var leave_message = 'Changes have been made.  Please STAY ON THIS PAGE and save your changes before leaving.  To exit without saving, choose LEAVE THIS PAGE.'
    function goodbye(e) {
        console.log('goodbye');
        if (!validNavigation) {
            if (dont_confirm_leave !== 1) {
                if (!e) e = window.event;
                //e.cancelBubble is supported by IE - this will kill the bubbling process.
                e.cancelBubble = true;
                e.returnValue = leave_message;
                //e.stopPropagation works in Firefox.
                if (e.stopPropagation) {
                    e.stopPropagation();
                    e.preventDefault();
                }
                //return works for Chrome and Safari
                return leave_message;
            }
        }
    }

    function UnlockUpfront(e) {
        var url = "/ManageMedia/UnlockUpfront/";
        var _upfrontid = GetParameterValues('upfrontid');
        if (_upfrontid == null || _upfrontid == undefined || _upfrontid == "")
            _upfrontid = e.currentTarget.window.location.search.split("=")[1].split('&')[0];
        if (_upfrontid > 0) {
            $.ajax({
                url: url,
                data: { UpfrontId: _upfrontid },
                cache: false,
                type: "POST",
                success: function (result) {
                },
                error: function (response) {
                    swal('Stop!', response.responseText, 'error');
                }
            });
        }
    }  

    function unlock(e) {
        console.log('unlock');
        if ((dont_confirm_leave === 1 || dont_confirm_leave === 0) && dont_reload === 0) {            
            UnlockUpfront(e);           
        }
        if (dont_reload === 0) {            
            window.opener.location.reload();
        }
    }
    window.onbeforeunload = goodbye;    
    window.onunload = unlock;    
    
    // Attach the event keypress to exclude the F5 refresh
    $(document).bind('keydown', function (e) {       
        if (e.keyCode == 116) {
             validNavigation = true;
        }
    });



    // Attach the event click for all links in the page
    $("a").bind("click", function () {
        validNavigation = true;
    });

    // Attach the event submit for all forms in the page
    $("form").bind("submit", function () {
        validNavigation = true;
    });

    // Attach the event click for all inputs in the page
    $("input[type=submit]").bind("click", function () {
        validNavigation = true;
    });

}

// Wire up the events as soon as the DOM tree is ready
$(document).ready(function () {
    wireUpEvents();
});