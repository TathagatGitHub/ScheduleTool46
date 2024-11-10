    function SavePropertyName(_upfrontLineId, _propertyName) {
        console.log("SavePropertyName " + _upfrontLineId + " " + _propertyName)
        $.ajax({
            url: "/UpfrontRemnant/SavePropertyName",
            data: {
                UpfrontLineId: _upfrontLineId,
                PropertyName: _propertyName,
            },
            cache: false,
            type: "POST",
            success: function (result) {
                if (result.success == false) {
                    swal({
                        title: "Error",
                        text: "SavePropertyName Error: " + result.responseText,
                        type: 'error',
                    });
                }

                RefreshTable(true, true, true);
            },
            error: function (response) {
                //var notify = $.notify("SavePropertyName Error: " + response.responseText, {
                //    type: 'danger',
                //    allow_dismiss: true,
                //});

                swal({
                    title: "Error",
                    text: "SavePropertyName Error: " + response.responseText,
                    type: 'error',
                });
            }

        });
    }

function SaveDay(_UpfrontLineId, _Day, _Checked) {
        $.ajax({
            url: '/UpfrontRemnant/SaveDay',
            type: 'POST',
            data: {
                upfrontLineId: _UpfrontLineId,
                checked: _Checked,
                day: _Day
            },
            success: function (result) {
                //upfronttable.ajax.reload(null, false);
                $("#btnSaveChanges").removeAttr("disabled");

                if (result.success == false) {
                    swal({
                        title: "Error",
                        text: "SavePropertyName Error: " + result.responseText,
                        type: 'error',
                    });
                }

                RefreshTable(false, false, true);
            },
            error: function (response) {
                //var notify = $.notify(response.responseText, {
                //    type: 'danger',
                //    allow_dismiss: true,
                //});

                swal({
                    title: "Error",
                    text: "SavePropertyName Error: " + response.responseText,
                    type: 'error',
                });
            }
        });
    }

    function SaveStartTime(_upfrontLineId, _startTime) {
        console.log("SaveStartTime " + _upfrontLineId + " " + _startTime)
        $.ajax({
            url: "/UpfrontRemnant/SaveStartTime",
            data: {
                UpfrontLineId: _upfrontLineId,
                StartTime: _startTime,
            },
            cache: false,
            type: "POST",
            success: function (result) {
                if (result.success == false) {
                    //var notify = $.notify(result.responseText, {
                    //    type: 'danger',
                    //    allow_dismiss: true,
                    //});
                    swal({
                        title: "Error",
                        text: "SavePropertyName Error: " + result.responseText,
                        type: 'error',
                    });
                }
                else {
                    //upfronttable.ajax.reload(null, false);
                    RefreshTable(true, true, true);
                }
            },
            error: function (response) {
                //var notify = $.notify("SaveStartTime Error: " + response.responseText, {
                //    type: 'danger',
                //    allow_dismiss: true,
                //});

                swal({
                    title: "Error",
                    text: "SavePropertyName Error: " + response.responseText,
                    type: 'error',
                });
            }

        });
    }

    function SaveEndTime(_upfrontLineId, _endTime) {
        console.log("SaveEndTime " + _upfrontLineId + " " + _endTime)
        $.ajax({
            url: "/UpfrontRemnant/SaveEndTime",
            data: {
                UpfrontLineId: _upfrontLineId,
                EndTime: _endTime,
            },
            cache: false,
            type: "POST",
            success: function (result) {
                if (result.success == false) {
                    //var notify = $.notify(result.responseText, {
                    //    type: 'danger',
                    //    allow_dismiss: true,
                    //});
                    swal({
                        title: "Error",
                        text: "SavePropertyName Error: " + result.responseText,
                        type: 'error',
                    });
                }
                else {
                    //upfronttable.ajax.reload(null, false);
                    RefreshTable(true, true, true);
                }
            },
            error: function (response) {
                //var notify = $.notify("SaveEndTime Error: " + response.responseText, {
                //    type: 'danger',
                //    allow_dismiss: true,
                //});
                swal({
                    title: "Error",
                    text: "SavePropertyName Error: " + response.responseText,
                    type: 'error',
                });
            }

        });
    }

    function SaveRateAmt(_upfrontLineId, _RateAmt) {
        console.log("SaveRateAmt " + _upfrontLineId + " " + _RateAmt)
        $.ajax({
            url: "/UpfrontRemnant/SaveRateAmt",
            data: {
                UpfrontLineId: _upfrontLineId,
                RateAmt: _RateAmt,
            },
            cache: false,
            type: "POST",
            success: function (result) {
                //upfronttable.ajax.reload(null, false);
                if (result.success == false) {                   
                    swal({
                        title: "Error",
                        text: "Save Rate Amount Error: " + result.responseText,
                        type: 'error',
                    });
                }
                else {                   
                    RefreshTable(true, true, true);
                }               
            },
            error: function (response) {
                var notify = $.notify("SaveRateAmt Error: " + response.responseText, {
                    type: 'danger',
                    allow_dismiss: true,
                });
            }

        });
    }

    function SaveImpressions(_upfrontLineId, _Impressions) {
        console.log("SaveImpressions " + _upfrontLineId + " " + _Impressions)
        $.ajax({
            url: "/UpfrontRemnant/SaveImpressions",
            data: {
                UpfrontLineId: _upfrontLineId,
                Impressions: _Impressions,
            },
            cache: false,
            type: "POST",
            success: function (result) {
                if (result.success == false) {                  
                    swal({
                        title: "Error",
                        text: "Save Impressions Error: " + result.responseText,
                        type: 'error',
                    });
                }
                else {                  
                    RefreshTable(true, true, true);
                } 
            },
            error: function (response) {
                var notify = $.notify("SaveImpressions Error: " + response.responseText, {
                    type: 'danger',
                    allow_dismiss: true,
                });
            }

        });
    }

    function SaveBuyTypeId(_upfrontLineId, _BuyTypeId) {
        console.log("SaveBuyTypeId " + _upfrontLineId + " " + _BuyTypeId)
        $.ajax({
            url: "/UpfrontRemnant/SaveBuyTypeId",
            data: {
                UpfrontLineId: _upfrontLineId,
                BuyTypeId: _BuyTypeId,
            },
            cache: false,
            type: "POST",
            success: function (result) {
                // upfronttable.ajax.reload(null, false);
                RefreshTable(true, true, true);
            },
            error: function (response) {
                var notify = $.notify("SaveBuyTypeId Error: " + response.responseText, {
                    type: 'danger',
                    allow_dismiss: true,
                });
            }

        });
    }

    function SaveDayPartId(_upfrontLineId, _DayPartId) {
        console.log("SaveDayPartId " + _upfrontLineId + " " + _DayPartId)
        $.ajax({
            url: "/UpfrontRemnant/SaveDayPartId",
            data: {
                UpfrontLineId: _upfrontLineId,
                DayPartId: _DayPartId,
            },
            cache: false,
            type: "POST",
            success: function (result) {
                // upfronttable.ajax.reload(null, false);
                if (result.success == false) {
                    swal({
                        title: "Error",
                        text: "SavePropertyName Error: " + result.responseText,
                        type: 'error',
                    });
                }
                RefreshTable(true, true, true);
            },
            error: function (response) {
                //var notify = $.notify("SaveDayPartId Error: " + response.responseText, {
                //    type: 'danger',
                //    allow_dismiss: true,
                //});
                swal({
                    title: "Error",
                    text: "SavePropertyName Error: " + result.responseText,
                    type: 'error',
                });
            }

        });
    }

    function SaveDoNotBuyTypeId(_upfrontLineId, _DoNotBuyTypeId) {
        console.log("SaveDoNotBuyTypeId " + _upfrontLineId + " " + _DoNotBuyTypeId)
        $.ajax({
            url: "/UpfrontRemnant/SaveDoNotBuyTypeId",
            data: {
                UpfrontLineId: _upfrontLineId,
                DoNotBuyTypeId: _DoNotBuyTypeId,
            },
            cache: false,
            type: "POST",
            success: function (result) {
                if (result.success == false) {                  
                    swal({
                        title: "Error",
                        text: "Save DoNotBuyTypeId Error: " + result.responseText,
                        type: 'error',
                    });
                }
                else {                    
                    RefreshTable(true, true, true);
                } 
            },
            error: function (response) {
                var notify = $.notify("SaveDoNotBuyTypeId Error: " + response.responseText, {
                    type: 'danger',
                    allow_dismiss: true,
                });
            }

        });
    }

    function SaveMandateClientId(_upfrontLineId, _MandateClientId) {
        console.log("SaveMandateClientId " + _upfrontLineId + " " + _MandateClientId)
        $.ajax({
            url: "/UpfrontRemnant/SaveMandateClientId",
            data: {
                UpfrontLineId: _upfrontLineId,
                MandateClientId: _MandateClientId,
            },
            cache: false,
            type: "POST",
            success: function (result) {
                if (result.success == false) {                  
                    swal({
                        title: "Error",
                        text: "Save Mandate ClientId Error: " + result.responseText,
                        type: 'error',
                    });
                }
                else {                   
                    RefreshTable(true, true, true);
                } 
            },
            error: function (response) {
                var notify = $.notify("SaveMandateClientId Error: " + response.responseText, {
                    type: 'danger',
                    allow_dismiss: true,
                });
            }

        });
    }



    function SaveEffectiveDate(_upfrontLineId, _EffectiveDate) {
        console.log("SaveEffectiveDate " + _upfrontLineId + " " + _EffectiveDate)
        $.ajax({
            url: "/UpfrontRemnant/SaveEffectiveDate",
            data: {
                UpfrontLineId: _upfrontLineId,
                EffectiveDate: _EffectiveDate,
            },
            cache: false,
            type: "POST",
            success: function (result) {
                if (result.success == false) {                   
                    swal({
                        title: "Error",
                        text: "Save Effective Date Error: " + result.responseText,
                        type: 'error',
                    });
                }
                else {                   
                    RefreshTable(true, true, true);
                } 
            },
            error: function (response) {
                var notify = $.notify("SaveEffectiveDate Error: " + response.responseText, {
                    type: 'danger',
                    allow_dismiss: true,
                });
            }

        });
    }



    function SaveExpirationDate(_upfrontLineId, _ExpirationDate) {
        console.log("SaveExpirationDate " + _upfrontLineId + " " + _ExpirationDate)
        $.ajax({
            url: "/UpfrontRemnant/SaveExpirationDate",
            data: {
                UpfrontLineId: _upfrontLineId,
                ExpirationDate: _ExpirationDate,
            },
            cache: false,
            type: "POST",
            success: function (result) {
                if (result.success == false) {                  
                    swal({
                        title: "Error",
                        text: "Save Expiration Date Error: " + result.responseText,
                        type: 'error',
                    });
                }
                else {                   
                    RefreshTable(true, true, true);
                } 
            },
            error: function (response) {
                var notify = $.notify("SaveExpirationDate Error: " + response.responseText, {
                    type: 'danger',
                    allow_dismiss: true,
                });
            }

        });
}

function SaveSPBuy(_upfrontLineId, _spBuy) {    
    $.ajax({
        url: "/UpfrontRemnant/SaveSPBuy",
        data: {
            UpfrontLineId: _upfrontLineId,
            SPBuy: _spBuy
        },
        cache: false,
        type: "POST",
        success: function (result) {            
            RefreshTable(true, true, true);
        },
        error: function (response) {
            var notify = $.notify("SaveSPBuy Error: " + response.responseText, {
                type: 'danger',
                allow_dismiss: true,
            });
        }

    });
}


