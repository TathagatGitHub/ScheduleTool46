function OpenNewDataTablesWin(url) {
    var params = [
        'height=' + (screen.height),
        'width=' + (screen.width),
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
    var popup = window.open(url, url, params);
    popup.moveTo(0, 0);
    popup.resizeTo(screen.width, screen.height);
}