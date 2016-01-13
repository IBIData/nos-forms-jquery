/* global jQuery */
;(function ( $, window, document, undefined ) {

    "use strict";
    
        // Create the defaults
        var defaults = {
                fields: {},
                animationSpeed: 100,
                validate: true,
                htmlValidation: false,
                messages: {
                    required: 'Please fill out all required fields',
                    invalid: 'Please correct errors'
                }
            };
            
            

        // The plugin constructor
        function Nos ( element, options ) {
                
                // need access to this later
                var self = this;
                
                // form element
                this.form = $(element);
                
                // final plugin settings
                this.settings = $.extend({}, defaults, options);
                
                // need access to this later
                var userdata = this.settings;
                
                // Store arrays of element types
                // These are used to determine which function will be called from the 'getElements' object below
                this.elements = {
                    text: ['text', 'email', 'tel', 'password', 'number', 'hidden', 'zip', 'date', 'week', 'time', 'month', 'datetime-local', 'search', 'url', 'range', 'color'],
                    textarea: ['textarea'],
                    buttons: ['submit', 'reset', 'button', 'image'],
                    select: ['select'],
                    file: ['file'],
                    check: ['checkbox', 'radio'],
                    state: ['state'],
                    clone: ['clone']
                };
                
                
                
                // takes user form object and converts to string fragments for creating html
                this.getAttrs = function (input) {
                    
                    return $.extend({}, input, {
                        type: input.type && ' type="' + input.type + '"' || '',
                        name: input.name && ' name="' + input.name + '"' || '',
                        id: (input.id || input.name) && ' id="' + (input.id || input.name) + '"' || '',
                        minlength: input.minlength && ' minlength="' + input.minlength + '"' || '',
                        maxlength: input.maxlength && ' maxlength="' + input.maxlength + '"' || '',
                        required: input.required && ' required' || '',
                        value: input.value && ' value="' + input.value + '"' || '',
                        placeholder: input.placeholder && ' placeholder="' + input.placeholder + '"' || '',
                        formGroup: input.formGroup && this.getElements.formGroup() || '',
                        label: input.label && this.getElements.label(input) || '',
                        classname: input.classname && ' class="' + input.classname + '"' || '',
                        multiple: input.multiple && ' multiple' || '',
                        autofocus: input.autofocus && ' autofocus' || '',
                        disabled: input.disabled && ' disabled' || '',
                        readonly: input.readonly && ' readonly' || '',
                        title: input.title && ' title="' + input.title + '"' || '',
                        size: input.size && ' size="' + input.size + '"' || '',
                        message: self.getUserErrorMessages(input) // returns object that stores user error messages
                    });
                    
                },
                
                // assigns an object to the 'message' property above
                // this will contain the user error messages that will display on the form
                this.getUserErrorMessages = function (element) {
                    return $.extend({}, {
                        required: element.required && self.userErrorMessage.required(element),
                        valid: (element.type === 'email' || element.type === 'zip' || element.type === 'tel' || element.pattern) && self.userErrorMessage.valid(element) || '',
                        minlength: (element.minlength && element.minlength > 1) && self.userErrorMessage.minlength(element) || '',
                        min: (element.min && element.min > 1) && self.userErrorMessage.min(element) || '',
                        max: element.max && self.userErrorMessage.max(element) || ''
                    });
                };
                
                // Group of functions used to return a form element
                this.getElements = {
                    
                    self: this,
                    
                    // returns bootstrap form-group div
                    formGroup: function () {
                        return {
                            start: '<div class="form-group nos-group">',
                            end: '</div>'
                        };
                    },
                    
                    div: function (classname) {
                        return {
                            start: '<div class="' + classname + '">',
                            end: '</div>'
                        };
                    },
                    
                    fieldset: function (id) {
                        return {
                            start: '<fieldset id="' + id + '">',
                            end: '</fieldset>'
                        };
                    },
                    
                    label: function (input) {
                        var required;
                        input.required ? required = ' class="required-field"' : ''; 
                        return '<label for="' + (input.id || input.name) + '"' + required + '>' + input.label + '</label>';
                    },
                    
                    // returns text-based elements
                    text: function (input) {
                        var el = $.extend(this.self.getAttrs(input), {
                            pattern: input.pattern && ' pattern="' + input.pattern + '"' || '',
                            autocomplete: input.autocomplete && ' autocomplete="' + input.autocomplete + '"' || '',
                            step: input.step && ' step="' + input.step + '"' || '',
                            min: input.min && ' min="' + input.min + '"' || '',
                            max: input.max && ' max="' + input.max + '"' || ''
                        });
                        var element = (el.formGroup.start || '') + el.label + 
                            '<input data-nos' + el.type + el.name + el.id + el.minlength + el.maxlength + el.placeholder + el.classname + 
                            el.value + el.title + el.min + el.max + el.step + el.size + el.pattern + el.autocomplete + el.multiple + el.readonly + 
                            el.disabled + el.autofocus + el.required + '>' + 
                            (el.message.required || '') + (el.message.minlength || '') + (el.message.valid || '') + (el.message.min || '') + (el.message.max || '') + 
                            (el.formGroup.end || '');
                        return element;
                    },
                   
                    // returns buttons
                    buttons: function (input) {
                        var nosgroup = input.formGroup && 'nos-form-group nos-group ' || '',
                            inline = input.inline && 'nos-inline' || '';
                        var el = $.extend(this.self.getAttrs(input), {
                            src: input.src && ' src="' + input.src + '"' || '',
                            alt: input.alt && ' alt="' + input.alt + '"' || '',
                            formaction: input.formaction && ' formaction="' + input.formaction + '"' || '',
                            formenctype: input.formenctype && ' formenctype="' + input.formenctype + '"' || '',
                            formmethod: input.formmethod && ' formmethod="' + input.formmethod + '"' || '',
                            formnovalidate: input.formnovalidate && ' formnovalidate' || '',
                            formtarget: input.formtarget && ' formtarget="' + input.formtarget + '"' || '',
                            height: input.height && ' height="' + input.height + '"' || '',
                            width: input.width && ' width="' + input.width + '"' || '',
                            formGroup: (input.formGroup || input.inline) && this.div(nosgroup + inline) || ''
                        });
                        var element = (el.formGroup.start || '') + 
                            '<input data-nos' + el.type + el.name + el.id + el.classname + el.title + el.src + el.alt + el.height + el.width + 
                            el.formtarget + el.formmethod + el.formaction + el.formenctype + el.disabled + el.value + el.formnovalidate + '>&nbsp;' + 
                            (el.formGroup.end || '');
                        return element;
                    },
                    
                    // returns textarea elements
                    textarea: function (input) {
                        var el = $.extend(this.self.getAttrs(input), {
                            rows: input.rows && ' rows="' + input.rows + '"' || '',
                            cols: input.cols && ' cols="' + input.cols + '"' || '',
                            wrap: input.wrap && ' wrap="' + input.wrap + '"' || ''
                        });
                        var element = (el.formGroup.start || '') + el.label + 
                            '<textarea data-nos' + 
                            el.name + el.id + el.title + el.minlength + el.maxlength + el.placeholder + el.classname + el.value + el.rows + el.cols + el.wrap + el.readonly + el.disabled + el.autofocus + el.required + 
                            '></textarea>' + 
                            (el.message.required || '') + (el.message.minlength || '') + 
                            (el.formGroup.end || '');
                        return element;
                    },
                    
                    // returns select elements
                    select: function (input) {
                        var el = this.self.getAttrs(input);
                        $.each(input.options, function (k,v) {
                            var selectedOption;
                            el.selected === k ? selectedOption = ' selected' : selectedOption = '';
                            options += '<option value="' + k + '" ' + selectedOption + '>' + v + '</option>';
                        });
                        var element = (el.formGroup.start || '') + el.label + 
                            '<select data-nos' + 
                            el.name + el.id + el.classname + el.multiple + el.title + el.size + el.readonly + el.disabled + el.autofocus + el.required + '>' + 
                            options + 
                            '</select>' + 
                            (el.message.required || '') +  
                            (el.formGroup.end || '');
                        return element;
                    },
                    
                    // returns checkbox and radio elements
                    check: function (input) {
                        var checked = '';
                        var el = $.extend(this.self.getAttrs(input), {
                            inline: input.inline && ' class="' + input.type + '-inline"' || '',
                            name: (input.name && input.type === 'checkbox') ? ' name="' + input.name + '[]' + '"' : ' name="' + input.name + '"',
                            id: ' id="' + input.name + '-',
                            div: !input.inline && this.div(input.type) || '',
                            fieldset: this.fieldset(input.name) || ''
                        });
                        
                        var element = (el.formGroup.start || '') + el.label + (el.fieldset.start || '');
                        
                        $.each(input.options, function (k, v) {
                            if (typeof input.checked === 'object') {
                                $.inArray(k, input.checked) > -1 ? checked = ' checked': checked = '';
                            } else if (typeof input.checked === 'string') {
                                k === input.checked ? checked = ' checked': checked = '';
                            } else {
                                console.warn('Your checkbox/radio "checked" property must be an object or string');
                            }
                            element += (el.div.start || '') + 
                                    '<label' + el.inline + '><input data-nos' +
                                    el.type + el.name + el.title + el.id+k+'" ' + el.classname + ' value="' + k + '"' + checked + el.disabled + el.autofocus + el.required + 
                                    '>' + 
                                    v + 
                                    '</label>' + 
                                    (el.div.end || '');
                        });
                        
                        element += (el.fieldset.end || '') + 
                        (el.message.required || '') +  
                        (el.formGroup.end || '');
                        return element;
                    },
                    
                    // returns file elements
                    file: function (input) {
                        var el = $.extend(this.self.getAttrs(input), {
                            accept: input.accept && ' accept="' + input.accept + '"' || '',
                            div: input.classname && this.div(input.classname) || ''
                        });
                        var element = (el.formGroup.start || '') + el.label + 
                            (el.div.start || '') + 
                            '<input data-nos' + el.type + el.name + el.id + el.title + el.accept + el.multiple + el.disabled + el.autofocus + el.required + 
                            '>' +  
                            (el.message.required || '') + 
                            (el.div.end || '') + 
                            (el.formGroup.end || '');
                        return element;
                    },
                    
                    clone: function (input) {
                        
                        var maxFields = (input.maxFields || 10) + 1,
                            startFields = (input.start || 1),
                            hideFields,
                            element = '';
                        
                        var el = $.extend(this.self.getAttrs(input), {
                            placeholder: input.placeholder && input.placeholder || '',
                            classname: input.classname && input.classname || '',
                            addValue: input.addButtonValue && input.addButtonValue || 'Add Field',
                            removeValue: input.removeButtonValue && input.removeButtonValue || 'Remove Field'
                        });
                        
                        element += el.label;
                        
                        var i = 1;
                        for (i; i < maxFields; i++) {
                            
                            var addon = (input.addon || i);
                            
                            i <= startFields ? hideFields = '' : hideFields = ' hidden';
                            
                            var div = this.div('input-group nos-input-group' + hideFields);
                            
                            element += 
                            
                            (el.formGroup.start || '') + 
                            
                            div.start + 
                            
                            '<span class="input-group-addon nos-input-group-addon">' + addon + '</span>' + 
                            '<input data-nos type="text" class="' + el.classname + '">' + 
                            
                            div.end +
                            
                            (el.formGroup.end || '');
                            
                        }
                        
                        element += '<input type="button" data-nos-add-button class="btn btn-primary nos-form-group" value="' + el.addValue + '">&nbsp;<input type="button" data-nos-remove-button value="' + el.removeValue + '" class="btn btn-danger nos-form-group">';
                        
                        
                        return element;
                        
                    },
                    
                    // returns select box with 50 states/territories/Canadian Provinces
                    // the user specifies what to include, and this function will combine the appropriate objects to create the select element
                    state: function (input) {
                        
                        var territories = {"American Samoa": "AS","Federated States Of Micronesia": "FM","Guam": "GU","Marshall Islands": "MH","Northern Mariana Islands": "MP","Palau": "PW","Puerto Rico": "PR","Virgin Islands": "VI"};
                        
                        var states = {"Alabama": "AL","Alaska": "AK","Arizona": "AZ","Arkansas": "AR","California": "CA","Colorado": "CO","Connecticut": "CT","Delaware": "DE","District Of Columbia": "DC","Florida": "FL","Georgia": "GA","Hawaii": "HI","Idaho": "ID","Illinois": "IL","Indiana": "IN","Iowa": "IA","Kansas": "KS","Kentucky": "KY","Louisiana": "LA","Maine": "ME","Maryland": "MD","Massachusetts": "MA","Michigan": "MI","Minnesota": "MN","Mississippi": "MS","Missouri": "MO","Montana": "MT","Nebraska": "NE","Nevada": "NV","New Hampshire": "NH","New Jersey": "NJ","New Mexico": "NM","New York": "NY","North Carolina": "NC","North Dakota": "ND","Ohio": "OH","Oklahoma": "OK","Oregon": "OR","Pennsylvania": "PA","Rhode Island": "RI","South Carolina": "SC","South Dakota": "SD","Tennessee": "TN","Texas": "TX","Utah": "UT","Vermont": "VT","Virginia": "VA","Washington": "WA","West Virginia": "WV","Wisconsin": "WI","Wyoming": "WY"};
                        
                        var provinces = {"Alberta": "AB","British Columbia": "BC","Manitoba": "MB","New Brunswick": "NB","Newfoundland and Labrador": "NL","Nova Scotia": "NS","Northwest Territories": "NT","Nunavut": "NU","Ontario": "ON","Prince Edward Island": "PE","Quebec": "QC","Saskatchewan": "SK","Yukon": "YT"};
                        
                        // this function orders our state object alphabetically by key
                        function sortObject(obj, order) {
                            var key,
                                i,
                                tempArray = [],
                                tempObj = {};
                                
                            for (key in obj) {
                                tempArray.push(key);
                            }
                            
                            tempArray.sort(function(a, b) {
                                return a.toLowerCase().localeCompare(b.toLowerCase());
                            });
                            
                            if (order === 'desc') {
                                for ( i = tempArray.length - 1; i >= 0; i-- ) {
                                    tempObj[tempArray[i]] = obj[tempArray[i]];
                                }
                            } else {
                                for ( i = 0; i < tempArray.length; i++ ) {
                                    tempObj[tempArray[i]] = obj[tempArray[i]];
                                }
                            }
                            return tempObj;
                        }
                        
                        // function to combine the objects and call the sort function once that is done
                        // after object is complete, we create the html
                        var stateObj = sortObject($.extend(states, (input.usTerritory && territories), (input.canada && provinces))),
                            options = '<option value="">' + (input.defaultSelected || "Select One...") + '</option>';
                        var el = this.self.getAttrs(input);
                        $.each(stateObj, function (k,v) {
                            var selectedOption;
                            el.selected === v ? selectedOption = ' selected' : selectedOption = '';
                            options += '<option value="' + v + '" ' + selectedOption + '>' + k + '</option>';
                        });
                        var element = (el.formGroup.start || '') + el.label + 
                            '<select data-nos ' + el.name + el.id + el.classname + el.size + el.multiple + el.readonly + el.disabled + el.autofocus + el.required + 
                            '>' + 
                            options + 
                            '</select>' + 
                            (el.message.required || '') + 
                            (el.formGroup.end || '');
                            return element;
                    }
                };
                
                // field validation messages
                this.userErrorMessage = {
                    
                    required: function (el) {
                        var message;
                        el.messages ? message = el.messages.required : message = null;
                        return '<div style="display: none;" class="alert alert-danger nos-help nos-required msg-required-' + el.name + '">' + (message || (el.label || el.placeholder) + ' is a required field') + '</div>';
                    },
                    
                    valid: function (el) {
                        var message;
                        el.messages ? message = el.messages.invalid : message = null;
                        return '<div style="display: none;" class="alert alert-warning nos-help nos-invalid msg-invalid-' + el.name + '">' + (message || (el.label || el.placeholder) + ' must be valid') + '</div>';
                    },
                    
                    minlength: function (el) {
                        var message;
                        el.messages ? message = el.messages.minlength : message = null;
                        return '<div style="display: none;" class="alert alert-warning nos-help nos-invalid msg-minlength-' + el.name + '">' + (message || (el.label || el.placeholder) + ' must be a minimum of ' + el.minlength + ' characters') + '</div>';
                    },
                    
                    min: function (el) {
                        var message;
                        el.messages ? message = el.messages.min : message = null;
                        return '<div style="display: none;" class="alert alert-warning nos-help nos-invalid msg-min-' + el.name + '">' + (message || (el.label || el.placeholder) + ' must have a minimum value of ' + el.min)+ '</div>';
                    },
                    
                    max: function (el) {
                        var message;
                        el.messages ? message = el.messages.max : message = null;
                        return '<div style="display: none;" class="alert alert-warning nos-help nos-invalid msg-max-' + el.name + '">' + (message || (el.label || el.placeholder) + ' must have a maximum value of ' + el.max) + '</div>';
                    },
                    
                    form: {
                        required: function (form) {
                            return '<div style="display: none;" class="alert alert-danger nos-help nos-form-required msg-required-' + (form.name || form.id) + '">' + self.settings.messages.required + '</div>';
                        },
                        invalid: function (form) {
                            return '<div style="display: none;" class="alert alert-warning nos-help nos-form-invalid msg-invalid-' + (form.name || form.id) + '">' + self.settings.messages.invalid + '</div>';
                        }
                    }
                };
                
                // field validation functions
                this.validator = {
                    
                    email: function (email) {
                        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        return re.test(email);
                    },
                    
                    phone: function (tel) {
                        return /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/.test(tel);
                    },
                    
                    zipcode: function (zip) {
                        return /^\d{5}(-\d{4})?$/.test(zip);
                    },
                    
                    // sanitizes text-based form inputs
                    sanitize: function (input) {
                        var output = input.replace(/<script[^>]*?>.*?<\/script>/gi, '').
                            replace(/<[\/\!]*?[^<>]*?>/gi, '').
                            replace(/<style[^>]*?>.*?<\/style>/gi, '').
                            replace(/<![\s\S]*?--[ \t\n\r]*>/gi, '');
                        return output;
                    }
                    
                };
                
                // validation that runs on form submit
                this.submitValidation = function (data) {
                    
                    var form = $(data).serializeArray(),
                        formdata = {};
                        
                    // assign serialized form object properties to new form submit object, unless it is a checkbox field
                    $.each(form, function (key, value) {
                        if (value.name.indexOf('[]') === -1) {
                            formdata[value.name] = value.value;
                        }
                    });
                
                    // selectors for required fields
                    var reqInput = $('[data-nos]:not(:radio, :checkbox, :button, :submit, :reset, :file, :image, select)').filter('[required]:visible'),
                        reqSR = $('select[data-nos]').filter('[required]:visible'),
                        fileField = $(':file[data-nos]').filter('[required]:visible'),
                        cbgroup = $(':checkbox[data-nos]').parents('fieldset'),
                        cb = $(':checkbox, :radio[data-nos]').filter('[required]:visible').parents('fieldset');
                   
                    // checkbox and radio validation
                    // build individual arrays for each required field and check to see if arrays are empty on form submit
                    if (cb) {
                        var cba = {},
                            cmsg = {};
                        cb.each(function (i) {
                            var checkboxes = $(this).find(':checkbox, :radio');
                            cmsg[i] = '.msg-required-' + $(this).attr('id');
                            cba[i] = [];
                            $(checkboxes).each(function () {
                                $(this).is(':checked') && cba[i].push(this.value);
                            });
                            cba[i].length < 1 && $(cmsg[i]).slideDown();
                            $(checkboxes).change(function () {
                                $.inArray(this, cba[i]) > -1 ? cba[i].splice(this, 1) : cba[i].push(this);
                                cba[i].length > 0 && $(cmsg[i]).slideUp();
                            });
                        });
                    }

                    // create checkbox object for form submit response
                    if (cbgroup) {
                        var obj = {};
                        cbgroup.each(function (i) {
                            var str = $(this).attr('id'),
                                fcb = $(this).find(':checkbox');
                            obj[i] = {};
                            fcb.each(function () {
                                var uid = $(this).attr('value');
                                obj[i][uid] = this.checked;
                            });
                            formdata[str] = obj[i];
                        });
                    }
                
                    // check all text-based fields for a blank value
                    $(reqInput).each(function (i) {
                        var field = reqInput[i],
                            msg = '.msg-required-' + field.name,
                            mask = $(this).attr('data-mask');
                        field.value = self.validator.sanitize(field.value);
                        if (mask) {
                            if ($(field).caret().begin < 1) {
                                $(msg).slideDown();
                                $(this).bind('keyup keydown change blur paste', function () {
                                    $(this).caret().begin > 0 && $(msg).slideUp();
                                    $(this).caret().begin < 1 && $(msg).slideDown();
                                });
                            }
                        } else {
                           if ($(field).val().length < 1) {
                                $(msg).slideDown();
                                $(this).bind('keyup keydown change blur paste', function () {
                                    this.value.length > 0 && $(msg).slideUp();
                                    this.value.length < 1 && $(msg).slideDown();
                                });
                            }
                        }
                        
                    });
                
                    // select Required field validation
                    $(reqSR).each(function (i) {
                        var sfield = reqSR[i],
                            msg = '.msg-required-' + sfield.name;
                        if ($(sfield).val() === '') {
                            $(msg).slideDown();
                            $(this).change(function () {
                                $(this).val() !== '' && $(msg).slideUp();
                                $(this).val() === '' && $(msg).slideDown();
                            });
                        }    
                    });
                    
                    // file Required field validation
                    $(fileField).each(function (i) {
                        var field = fileField[i];
                        var msg = '.msg-required-' + field.name;
                        var filelist = (document.getElementById(field.id).files || document.getElementById(field.id).value); // ie8 doesn't support 'files'
                        if (filelist.length === 0) {
                            $(msg).slideDown();
                            $(this).change(function () {
                                $(this).val() !== '' && $(msg).slideUp();
                                $(this).val() === '' && $(msg).slideDown();
                            });
                        } 
                        formdata[field.name] = filelist;   
                    });
                    
                    // send form submit object back to user if all fields are valid
                    if (!$('.nos-help').is(':visible')) {
                         userdata.submit(formdata);
                    } else {
                        if ($('.nos-required').is(':visible')) {
                            $('.nos-form-required').slideDown();
                            $(':input, select, textarea').bind('change keyup blur focus paste', function () {
                                if ($('.nos-required').is(':visible')) {
                                    $('.nos-form-required').slideDown();
                                } else {
                                    $('.nos-form-required').slideUp();
                                }
                            });
                        }
                        if ($('.nos-invalid').is(':visible')) {
                            $('.nos-form-invalid').slideDown();
                            $(':input, select, textarea').bind('change keyup blur focus paste', function () {
                                if ($('.nos-invalid').is(':visible')) {
                                    $('.nos-form-invalid').slideDown();
                                } else {
                                    $('.nos-form-invalid').slideUp();
                                }
                            });
                        }
                    }
                };
                
                // this function handles real time error messages while user is typing
                this.validate = function (fields) {
                    
                    // resets form
                    function reset () {
                        $(':reset[data-nos]').click(function () {
                            $(this).closest('form').find(':input:not(:submit, :reset, :button, :image)').val('');
                            $('.nos-help').slideUp();
                        });
                    }
                    
                    // checks maxlength on fields if browser doesn't catch/support it
                    function maxLength (v) {
                        var maxLengthId = (v.id || v.name);
                        $('#' + maxLengthId).keydown(function (e) {
                            if ($(this).val().length > v.maxlength) {
                                e.preventDefault();
                            }
                        });
                    }
                    
                    // validates that the minlength has been met and displays/hides message to user
                    function minLength (v) {
                        var msg = '.msg-minlength-' + v.name;
                        var id = '#' + (v.id || v.name);
                        $(id).bind('keyup change blur focus paste', function () {
                            var minval = $(this).val().length;
                            if (minval > 0) {
                                minval < v.minlength ? $(msg).slideDown() : $(msg).slideUp();
                            } else {
                                $(msg).slideUp();
                            }
                        });
                    }
                    
                    // validates the min and max attributes on number fields
                    function minMax (v) {
                        var minMsg = '.msg-min-' + v.name;
                        var maxMsg = '.msg-max-' + v.name;
                        var id = '#' + (v.id || v.name);
                        $(id).bind('keyup keydown change blur focus paste', function () {
                            var numVal = $(this).val();
                            if (numVal > 0) {
                                numVal < v.min ? $(minMsg).slideDown() : $(minMsg).slideUp();
                                numVal > v.max ? $(maxMsg).slideDown() : $(maxMsg).slideUp();
                            } else { 
                                $(minMsg).slideUp(); 
                            }
                        });
                    }
                    
                    // validates regex patterns 
                    function validatePattern (v) {
                        var nm = v.name,
                            msg = '.msg-invalid-' + nm,
                            id = '#' + (v.id || nm),
                            regex = new RegExp(v.pattern);
                        $(id).bind('keyup change blur focus paste', function () {
                            if ($(this).val().length > 0) {
                                regex.test($(this).val()) ? $(msg).slideUp() : $(msg).slideDown();
                            }
                            else {
                                $(msg).slideUp();
                            }
                        });
                    }
                    
                    // calls email/zip/phone validation functions and hides/displays messages to user
                    function validateFields (v) {
                        var nm = v.name,
                            msg = '.msg-invalid-' + nm,
                            id = '#' + (v.id || nm);
                        var emval;
                        $(id).bind('keyup change blur paste', function () {
                            switch (v.type) {
                                
                                // once the user starts to type, email/zip/tel will be sent through a validator and a 
                                // message will be displayed to warn user about invalid input
                                // message will disappear once input is valid
                                case 'email':
                                    emval = $(this).val();
                                    if (emval.length > 0) {
                                        self.validator.email(emval) ? $(msg).slideUp() : $(msg).slideDown();
                                    }
                                        emval === '' && $(msg).slideUp();
                                    break;
                                    
                                case 'zip':
                                    emval = $(this).val();
                                    if ($.mask && v.mask) {
                                        if ($(this).caret().begin > 0) {
                                            self.validator.zipcode(emval) ? $(msg).slideUp() : $(msg).slideDown();
                                        }
                                        $(this).caret().end === 0 && $(msg).slideUp();
                                    } else {
                                        if (emval.length > 0) {
                                            self.validator.zipcode(emval) ? $(msg).slideUp() : $(msg).slideDown();
                                        }
                                        emval === '' && $(msg).slideUp();
                                    }
                                    break;
                                    
                                case 'tel':
                                    emval = $(this).val();
                                    if ($.mask && v.mask) {
                                        if ($(this).caret().begin > 0) {
                                            self.validator.phone(emval) ? $(msg).slideUp() : $(msg).slideDown();
                                        }
                                        $(this).caret().end === 0 && $(msg).slideUp();
                                    } else {
                                        if (emval.length > 0) {
                                            self.validator.phone(emval) ? $(msg).slideUp() : $(msg).slideDown();
                                        }
                                        emval === '' && $(msg).slideUp();
                                    }
                                    break;
                                    
                            }
                        });
                    }
                    
                    // clone field add button functionality
                    $('[data-nos-add-button]').click(function () {
                        $('.nos-input-group.hidden').length > 0 && $('.nos-input-group.hidden').eq(0).removeClass('hidden');
                        $('.nos-input-group.hidden').length === 0 && $(this).addClass('disabled');
                        $('.nos-input-group:not(.hidden)').length > 1 && $('[data-nos-remove-button]').removeClass('disabled');
                    });
                    
                    // clone field remove button functionality
                    $('[data-nos-remove-button]').click(function () {
                        $('.nos-input-group:not(.hidden)').length > 1 && $('.nos-input-group:not(.hidden)').eq(-1).addClass('hidden');
                        $('.nos-input-group:not(.hidden)').length === 1 && $(this).addClass('disabled');
                        $('.nos-input-group.hidden').length > 0 && $('[data-nos-add-button]').removeClass('disabled');
                    });
                    
                    // calls the validation functions
                    function callValidation(k, v) {
                        
                        // set mask
                        if (v.mask) {
                            
                            $.mask ? $('#'+(v.id || v.name)).mask(v.mask): console.warn('You must include the masked input plugin to use "mask". Go here: https://github.com/digitalBush/jquery.maskedinput');
                            $('#' + (v.id || v.name)).attr('data-mask', true); 
                            
                        }
                        
                        // call reset function
                        v.type === 'reset' && reset();
        
                        // call email/zip/phone validation function
                        if ((v.type === 'email' || v.type === 'zip' || v.type === 'tel') && (v.validate || v.validate === undefined)) {
                            validateFields(v);
                        }
                        
                        v.pattern && validatePattern(v);
                        
                        // call maxLength function
                        v.maxlength && maxLength(v);
                        
                        // call minLength function 
                        v.minlength && minLength(v);
                        
                        // call min / max function
                        (v.min || v.max) && minMax(v);
                        
                    }
                    
                    // find out if the form is one column or multi-column
                    // multi-column forms send multiple objects
                    $.each(fields, function (k, v) {
                        
                        if (this.column) {
                            
                            $.each(this.column, function (key, value) {
                                
                                callValidation(key, value);
                                
                            });
                            
                        }
                        
                        else {
                            
                            callValidation(k, v);
                                
                        }
                        
                    });
                    
                };
                
                // error messages to warn of incorrect types in the configuration
                this.errorMessages = function () {
                    
                    var settings = this.settings;
                    typeof settings.fields !== 'object' && console.warn('Your form data is not an object!');
                    typeof settings.validate !== 'boolean' && console.warn('"validate" must have a boolean value!');
                    typeof settings.htmlValidation !== 'boolean' && console.warn('"htmlValidation" must have a boolean value!');
                    typeof settings.submit !== 'function' && console.warn('"submit" must be a function!');
                    typeof settings.animationSpeed !== 'number' && console.warn('"animationSpeed" must be a number!');
                    typeof settings.messages !== 'object' && console.warn('"messages" must be an object!');
                    
                };
                
                // change the animation speed for validation messages
                // these can be set by user
                this.setBehavior = function (settings) {
                    
                    // toggles browser validation on/off based on user input - default is 'off'
                    !this.settings.htmlValidation && this.form.attr('novalidate', '');
                    
                    $.prototype.slideDown = (function(slideDown){
                        var defaultSpeed = settings.animationSpeed;
                        return function(speed){
                            slideDown.call( this, speed || defaultSpeed );
                        };
                    })($.prototype.slideDown);
                    
                    $.prototype.slideUp = (function(slideUp){
                        var defaultSpeed = settings.animationSpeed;
                        return function(speed){
                            slideUp.call( this, speed || defaultSpeed );
                        };
                    })($.prototype.slideUp);
                    
                },
                
                // builds form
                this.build = function () {
                    
                    var self = this,
                    
                        // counter used to find the last element in a one-column layout
                        // and the last column in a two-column layout
                        counter = 0;
                        
                    // create empty form string to build upon
                    var form = '', 
                    
                        // user supplied json fields
                        field = (this.settings.fields),
                        
                        // find the last column in a two-column layout
                        lastColumn = this.settings.fields.length,
                        
                        // find the last element in a one-column layout
                        lastElement = this.settings.fields.length;
                        
                    // loop through all field objects
                    $.each(field, function () {
                        
                        
                       
                       // check for a column property
                       // this signals a multi-column form
                       if (this.column) {
                           
                           // increment counter
                           ++counter;
                           
                           // add a div with a supplied class to separate columns
                           form += '<div class="' + this.classname + '">';
                           
                           $.each(this.column, function () {
                               
                               var each = this;
                               
                                // loop through all element arrays and categorize each element type
                                $.each(self.elements, function (k) {
                                    
                                    // when element type is matched to an array, it is sent to be built in the associated 'getElements' function
                                    if ($.inArray(each.type, this) > -1) { 
                                        form += self.getElements[k](each); 
                                    }
                                    
                                });
                                
                           });
                           
                           // if looping through the last column, append form error messages before the closing div
                           if (counter === lastColumn) {
                               
                                // append an error message onto the form for required fields
                                form += self.userErrorMessage.form.required(self.form[0]);
                                
                                // append an error message onto the form for invalid fields
                                form += self.userErrorMessage.form.invalid(self.form[0]);
                           }
                           
                           form += '</div>';
                       }
                       
                       // standard one column layout
                       else {
                           
                            var each = this;
                       
                            // loop through all element arrays and categorize each element type
                            $.each(self.elements, function (k) {
                                
                                // when element type is matched to an array, it is sent to be built in the associated 'getElements' function
                                if ($.inArray(each.type, this) > -1) {
                                    ++counter;
                                    form += self.getElements[k](each); 
                                    
                                    if (counter === lastElement) {
                                        // append an error message onto the form for required fields
                                        form += self.userErrorMessage.form.required(self.form[0]);
                                        
                                        // append an error message onto the form for invalid fields
                                        form += self.userErrorMessage.form.invalid(self.form[0]);
                                    }
                                    
                                }
                                
                            });
                            
                       }
                       
                    });
                    
                    // call to render the form (below)
                    this.render(form);
                };
                
                // renders form
                this.render = function (input) {
                    $(element).append(input);  
                },
                
                // initialize the plugin
                this.init();
                
        }

        // Avoid Plugin.prototype conflicts
        $.extend(Nos.prototype, {
                init: function () {
                    
                    var userdata = this.settings,
                        self = this;
                    
                    // displays error messages if the config object has incorrect types
                    this.errorMessages();
                    
                    // set some form behaviors
                    this.setBehavior(this.settings);
                    
                    // build the form
                    this.build();
                    
                    // run validation
                    this.settings.validate && this.validate(this.settings.fields);
                    
                    // form submit function
                    // runs validation and passes submit object to user
                    this.form.submit(function(e) {
                        
                        // prevent default form submit
                        e.preventDefault();
                        
                        // run submit form validation, unless user specifies not to
                        userdata.validate && self.submitValidation($(this));
                    
                    });
                }
        });

        // A really lightweight plugin wrapper around the constructor,
        // preventing against multiple instantiations
        $.fn.nosForm = function Run ( options ) {
                return this.each(function() {
                        if ( !$.data( this, "plugin_nosForm" ) ) {
                                $.data( this, "plugin_nosForm", new Nos( this, options ) );
                        }
                });
        };

})( jQuery, window, document );
