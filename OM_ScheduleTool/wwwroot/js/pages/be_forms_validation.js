/*
 *  Document   : be_forms_validation.js
 *  Author     : pixelcave
 *  Description: Custom JS code used in Form Validation Page
 */

var BeFormValidation = function() {
    // Init Bootstrap Forms Validation, for more examples you can check out https://github.com/jzaefferer/jquery-validation

    var validationBootstrap = "";
    var validationMaterial = "";

    var initValidationBootstrap = function () {
        validationBootstrap = jQuery('.js-validation-bootstrap').validate({
            ignore: [],
            errorClass: 'invalid-feedback animated fadeInDown',
            errorElement: 'div',
            errorPlacement: function (error, e) {
                jQuery(e).parents('.form-group > div').append(error);
            },
            highlight: function (e) {
                jQuery(e).closest('.form-group').removeClass('is-invalid').addClass('is-invalid');
            },
            unhighlight: function (e) {
                jQuery(e).closest('.form-group').removeClass('is-invalid');
            },
            success: function (e) {
                jQuery(e).closest('.form-group').removeClass('is-invalid');
                jQuery(e).remove();
            },
            rules: {
                'val-username': {
                    required: true,
                    minlength: 3
                },
                'val-email': {
                    required: true,
                    email: true
                },
                'val-password': {
                    required: true,
                    minlength: 5
                },
                'val-confirm-password': {
                    required: true,
                    equalTo: '#val-password'
                },
                'val-select2': {
                    required: true
                },
                'val-select2-mediatype': {
                    required: true
                },
                'val-select2-feedtype': {
                    required: true
                },
                'val-select2-country': {
                    required: true
                },
                'val-select2-multiple': {
                    required: true,
                    minlength: 2
                },
                'val-suggestions': {
                    required: true,
                    minlength: 5
                },
                'val-skill': {
                    required: true
                },
                'val-currency': {
                    required: true,
                    currency: ['$', true]
                },
                'val-website': {
                    required: true,
                    url: true
                },
                'val-phoneus': {
                    required: true,
                    phoneUS: true
                },
                'val-digits': {
                    required: true,
                    digits: true
                },
                'val-number': {
                    required: true,
                    number: true
                },
                'val-range': {
                    required: true,
                    range: [1, 5]
                },
                'val-terms': {
                    required: true
                },
                'val-start-time': {
                    required: true,
                    time12h: true
                },
                'val-end-time': {
                    required: true,
                    time12h: true,
                    notEqualTo: '#val-start-time'
                },
                'val-select2-planyear': {
                    required: true
                },
                /* Client CanadianExchange */
                'CanadianExchange_SelectedPlanYear': { required: true },
                'CanadianExchange_SelectedQuarter': { required: true },
                'CanadianExchange_SelectedClient': { required: true },
                'CanadianExchange_Rate': { required: true, number: true, range: [0, 1.99999] },

                /* Network */
                'txtAddAlias': {required: true},

                /* Actual Candaian Exchange */
                'AvgMon': { required: true, number: true, range: [0, 1] },
                'AvgTue': { required: true, number: true, range: [0, 1] },
                'AvgWed': { required: true, number: true, range: [0, 1] },
                'AvgThu': { required: true, number: true, range: [0, 1] },
                'AvgFri': { required: true, number: true, range: [0, 1] },
                'AvgSat': { required: true, number: true, range: [0, 1] },
                'AvgSun': { required: true, number: true, range: [0, 1] },

                'textEditDemographicName': { required : true },
                'textEditUniverse': { required : true, number : true },


                /* ClientCommission */
                'ClientId': { required: true },

                'val-select2-quarter': {
                    required: true
                },
                'val-select2-client': {
                    required: true
                },
                'val-select2-network': {
                    required: true
                },
                'val-text-propertyname': {
                    required: true
                },
                'val-select2-buytype': {
                    required: true
                },
                'val-select2-daypart': {
                    required: true
                },
                'val-select2-effectivedate': {
                    required: true,

                },
                'val-select2-expirationdate': {
                    required: true
                },

                /* Program Change */
                'ProgramChange_PropertyName_New': {
                    required: true,
                    notEqualTo: '#ProgramChange_PropertyName'
                },
                'val-start-time-pc': {
                    required: true,
                    time12h: true
                },
                'val-end-time-pc': {
                    required: true,
                    time12h: true,
                    notEqualTo: '#val-start-time-pc'
                },
                'txtYear1QStartWeek': { required: true },
                'txtYear1QEndWeek': { required: true },
                'txtYear2QStartWeek': { required: true },
                'txtYear2QEndWeek': { required: true },
                'txtYear3QStartWeek': { required: true },
                'txtYear3QEndWeek': { required: true },
                'txtYear4QStartWeek': { required: true },
                'txtYear4QEndWeek': { required: true },
                'ddlYear': { required:true }

            },
            messages: {
                'val-username': {
                    required: 'Please enter a username',
                    minlength: 'Your username must consist of at least 3 characters'
                },
                'val-email': 'Please enter a valid email address',
                'val-password': {
                    required: 'Please provide a password',
                    minlength: 'Your password must be at least 5 characters long'
                },
                'val-confirm-password': {
                    required: 'Please provide a password',
                    minlength: 'Your password must be at least 5 characters long',
                    equalTo: 'Please enter the same password as above'
                },
                'val-select2': 'Please select a value!',
                'val-select2-mediatype': 'Please select media type!',
                'val-select2-feedtype': 'Please select feed type!',
                'val-select2-country': 'Please select country!',
                'val-select2-multiple': 'Please select at least 2 values!',
                'val-suggestions': 'What can we do to become better?',
                'val-skill': 'Please select a skill!',
                'val-currency': 'Please enter a price!',
                'val-website': 'Please enter your website!',
                'val-phoneus': 'Please enter a US phone!',
                'val-digits': 'Please enter only digits!',
                'val-number': 'Please enter a number!',
                'val-range': 'Please enter a number between 1 and 5!',
                'val-terms': 'You must agree to the service terms!',
                'val-start-time': 'Please enter a valid time.',
                'val-end-time': 'Please enter a valid time.',
                'val-select2-planyear': 'Please select plan year.',
                'val-select2-client': 'Please select client.',
                'val-select2-quarter': 'Please select quarter.',
                'val-select2-network': 'Please select network.',
                'val-text-propertyname': 'Please enter property name.',
                'val-select2-buytype': 'Please select buy type.',
                'val-select2-daypart': 'Please select day part.',
                'val-select2-effectivedate': 'Please enter valid date.',
                'val-select2-expirationdate': 'Please enter valid date.',

                /* Client Canadian Exchange */
                'CanadianExchange_SelectedPlanYear': 'Please select plan year.',
                'CanadianExchange_SelectedClient': 'Please select a client.',
                'CanadianExchange_SelectedQuarter': 'Please select quarter.',
                'CanadianExchange_Rate': {
                    required: 'Please enter rate.',
                    range: 'Please enter rate between 0 and 1.99999.'
                },

                'textEditDemographicName':
                    {
                        required : 'Please enter Demographic Name.'
                    },

                'textEditUniverse': {
                    required: 'Please enter Universe.',
                    number : 'Please enter Valid Universe'
                },

                /* Network */                
                'txtAddAlias' : 'Please enter Alias.',

                /* Actual Canadian Exchange */
                'AvgMon': 'Please enter a number between 0 and 1.',
                'AvgTue': 'Please enter a number between 0 and 1.',
                'AvgWed': 'Please enter a number between 0 and 1.',
                'AvgThu': 'Please enter a number between 0 and 1.',
                'AvgFri': 'Please enter a number between 0 and 1.',
                'AvgSat': 'Please enter a number between 0 and 1.',
                'AvgSun': 'Please enter a number between 0 and 1.',

                /* ClientCommission */
                'ClientId': 'Please select client.',

                /* Program Change */
                'ProgramChange_PropertyName': 'New Property name cannot be the same as the old one.',
                'val-start-time-pc': 'Invalid time format',
                'val-end-time-pc': 'Invalid time format',
                'txtYear1QStartWeek': 'Please select Start Week.',
                'txtYear1QEndWeek': 'Please select End Week.',
                'txtYear2QStartWeek': 'Please select Start Week.',
                'txtYear2QEndWeek': 'Please select End Week.',
                'txtYear3QStartWeek': 'Please select Start Week.',
                'txtYear3QEndWeek': 'Please select End Week.',
                'txtYear4QStartWeek': 'Please select Start Week.',
                'txtYear4QEndWeek': 'Please select End Week.',
                'ddlYear': 'Please select Year.'

            }
        });        
    };

    var resetValidationBootstrap = function () {
        validationBootstrap.resetForm();        
    };  

    // Init Material Forms Validation, for more examples you can check out https://github.com/jzaefferer/jquery-validation
    var initValidationMaterial = function(){
        validationMaterial = jQuery('.js-validation-material').validate({
            ignore: [],
            errorClass: 'invalid-feedback animated fadeInDown',
            errorElement: 'div',
            errorPlacement: function(error, e) {
                jQuery(e).parents('.form-group > div').append(error);
            },
            highlight: function(e) {
                jQuery(e).closest('.form-group').removeClass('is-invalid').addClass('is-invalid');
            },
            unhighlight: function (e) {
                jQuery(e).closest('.form-group').removeClass('is-invalid');
            },
            success: function(e) {
                jQuery(e).closest('.form-group').removeClass('is-invalid');
                jQuery(e).remove();
            },
            rules: {
                'val-username2': {
                    required: true,
                    minlength: 3
                },
                'val-email2': {
                    required: true,
                    email: true
                },
                'val-password2': {
                    required: true,
                    minlength: 5
                },
                'val-confirm-password2': {
                    required: true,
                    equalTo: '#val-password2'
                },
                'val-select22': {
                    required: true
                },
                'val-select2-multiple2': {
                    required: true,
                    minlength: 2
                },
                'val-suggestions2': {
                    required: true,
                    minlength: 5
                },
                'val-skill2': {
                    required: true
                },
                'val-currency2': {
                    required: true,
                    currency: ['$', true]
                },
                'val-website2': {
                    required: true,
                    url: true
                },
                'val-phoneus2': {
                    required: true,
                    phoneUS: true
                },
                'val-digits2': {
                    required: true,
                    digits: true
                },
                'val-number2': {
                    required: true,
                    number: true
                },
                'val-range2': {
                    required: true,
                    range: [1, 5]
                },
                'val-terms2': {
                    required: true
                },
                'val-start-time2': {
                    required: true,
                    time12h: true
                },
                'val-end-time2': {
                    required: true,
                    time12h: true,
                    notEqualTo: '#val-start-time2'
                },
                /* CanadianExchange */
                'CanadianExchange_SelectedPlanYear': { required: true },
                'CanadianExchange_SelectedQuarter': { required: true },
                'CanadianExchange_SelectedClient': { required: true },
                'CanadianExchange_Rate': { required: true, number: true },      

                /* Network */
                'txtAddAlias': { required: true },

                /* Actual Candaian Exchange */
                'AvgMon': { required: true, number: true, range: [0, 1] },
                'AvgTue': { required: true, number: true, range: [0, 1] },
                'AvgWed': { required: true, number: true, range: [0, 1] },
                'AvgThu': { required: true, number: true, range: [0, 1] },
                'AvgFri': { required: true, number: true, range: [0, 1] },
                'AvgSat': { required: true, number: true, range: [0, 1] },
                'AvgSun': { required: true, number: true, range: [0, 1] },

                /* ClientCommission */
                'ClientId': { required: true },

                'val-select2-planyear2': {
                    required: true
                },
                'val-select2-quarter2': {
                    required: true
                },
                'val-select2-network2': {
                    required: true
                },
                'val-text-propertyname2': {
                    required: true
                },
                'val-select2-buytype2': {
                    required: true
                },
                'val-select2-daypart2': {
                    required: true
                },
                'val-select2-effectivedate2': {
                    required: true
                },
                'val-select2-expirationdate2': {
                    required: true
                },

                /* Program Change */
                'ProgramChange_PropertyName': { required: true },
                'val-start-time-pc': {
                    required: true,
                    time12h: true
                },
                'val-end-time-pc': {
                    required: true,
                    time12h: true,
                    notEqualTo: '#val-start-time-pc'
                },

            },
            messages: {
                'val-username2': {
                    required: 'Please enter a username',
                    minlength: 'Your username must consist of at least 3 characters'
                },
                'val-email2': 'Please enter a valid email address',
                'val-password2': {
                    required: 'Please provide a password',
                    minlength: 'Your password must be at least 5 characters long'
                },
                'val-confirm-password2': {
                    required: 'Please provide a password',
                    minlength: 'Your password must be at least 5 characters long',
                    equalTo: 'Please enter the same password as above'
                },
                'val-select22': 'Please select a value!',
                'val-select2-multiple2': 'Please select at least 2 values!',
                'val-suggestions2': 'What can we do to become better?',
                'val-skill2': 'Please select a skill!',
                'val-currency2': 'Please enter a price!',
                'val-website2': 'Please enter your website!',
                'val-phoneus2': 'Please enter a US phone!',
                'val-digits2': 'Please enter only digits!',
                'val-number2': 'Please enter a number!',
                'val-range2': 'Please enter a number between 1 and 5!',
                'val-terms2': 'You must agree to the service terms!',
                'val-start-time2': 'Please enter a valid time.',
                'val-end-time2': 'Please enter a valid time.',
                'val-select2-planyear2': 'Please select plan year.',
                'val-select2-quarter2': 'Please select quarter.',
                'val-text-propertyname2': 'Please enter property name.',
                'val-select2-buytype2': 'Please enter buy type.',
                'val-select2-daypart2': 'Please enter day part.',
                'val-select2-effectivedate2': 'Please enter valid date.',
                'val-select2-expirationdate2': 'Please enter valid date.',

                /* Canadian Exchange */
                'CanadianExchange_SelectedPlanYear': 'Please select plan year.',
                'CanadianExchange_SelectedClient': 'Please select a client.',
                'CanadianExchange_SelectedQuarter': 'Please select quarter.',
                'CanadianExchange_Rate': 'Please enter rate.',

                /* Network */
                'txtAddAlias': 'Please enter Alias.',

                
                /* Actual Canadian Exchange */
                'AvgMon': 'Please enter a number between 0 and 1.',
                'AvgTue': 'Please enter a number between 0 and 1.',
                'AvgWed': 'Please enter a number between 0 and 1.',
                'AvgThu': 'Please enter a number between 0 and 1.',
                'AvgFri': 'Please enter a number between 0 and 1.',
                'AvgSat': 'Please enter a number between 0 and 1.',
                'AvgSun': 'Please enter a number between 0 and 1.',

                /* ClientCommission */
                'ClientId': 'Please select a client.',

                /* Program Change */
                'val-start-time-pc': 'Please enter a valid time.',
                'val-end-time2-pc': 'Please enter a valid time.',

            }
        });
    };

    var resetValidationMaterial = function () {
        validationMaterial.resetForm();
    }

    return {

        init: function () {
            // Init Bootstrap Forms Validation
            initValidationBootstrap();

            // Init Material Forms Validation
            initValidationMaterial();

            // Init Validation on Select2 change
            jQuery('.js-select2').on('change', function(){
                jQuery(this).valid();
            });
        },
        resetValidationBootstrap: resetValidationBootstrap,
        resetValidationMaterial: resetValidationMaterial
    };
}();

// Initialize when page loads
jQuery(function(){ BeFormValidation.init(); });
