$(document).foundation();

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
}

function lowerCaseKeys(dict) {
    var key, keys = Object.keys(dict);
    var n = keys.length;
    var new_dict={}
    while (n--) {
        key = keys[n];
        new_dict[key.toLowerCase()] = dict[key];
    }
    return new_dict;
}

// convert date format specification from the django/php syntax to the js 
// datepicker spec
function django2datepicker(django_format) {
    var translation_dict = {
        'y': 'yy',
        'Y': 'yyyy',
        'n': 'm',
        'm': 'mm',
        'j': 'd',
        'd': 'dd',
        'h': 'hh',
        'H': 'hh',
        'G': 'h',
        'g': 'h',
        'i': 'ii',
        'a': 'aa',
        'A': 'AA',
        'P': 'hh:ii aa'
    }

    var datepicker_format = '';
    for (var i = 0, len = django_format.length; i < len; i++) {
        if (django_format[i] in translation_dict) {
            datepicker_format += translation_dict[django_format[i]];
        }
        else {
            datepicker_format += django_format[i];
        }
    }

    return datepicker_format;
}

function inlineWidget(css_class, template, dict, list_separator) {
    $('.inline-widget.' + css_class).html(function(i, content) {
        var has_link = false;
        var text = $(content).text();
        var result = "";
        if ($(content).attr('href')) {
            text = $(content).children(':first').text();
            has_link = true;
        }

        var text_list = [text];
        if (list_separator) {
            text_list = text.split(list_separator);
        }

        for (i = 0; i < text_list.length; i++)
        {
            var item = text_list[i];
            if (list_separator) {
                item += list_separator;
            }

            if (!dict) {
                item = template.replaceAll('{{ key }}', text_list[i]);
            }
            else {
                var lower_dict = lowerCaseKeys(dict);
                var lower_text_item = text_list[i].toLowerCase();

                if (lower_text_item in lower_dict) {
                    item = template.replaceAll('{{ value }}', lower_dict[lower_text_item]);
                    item = item.replaceAll('{{ key }}', text_list[i]);
                }
            }
            result += item;
        }

        if (has_link) {
            result = $(content).empty().append(result);
        }

        return result;
    });
}

function set_input_widgets() {
    var s = $('.js-selectize');
    if (s.size()) {
        s.selectize({allowEmptyOption: true, highlight: false});
    }

    var s_tags = $('.js-selectize-tags');
    if (s_tags.size()) {
        s_tags.selectize({
            delimiter: ',',
            persist: false,
            create: function(input) {
                return {
                    value: input,
                    text: input
                }
            }
        });
    }

    $('.js-datepicker').each(function(index) {
        $(this).datepicker({
            todayButton: true,
            language: 'en',
            startDate: new Date($(this).attr("date")),
        	dateFormat: django2datepicker(DATE_FORMAT)
        });
    });

    $('.js-timepicker').each(function(index) {
        $(this).datepicker({
            onlyTimepicker: true,
            language: 'en',
            startDate: new Date($(this).attr("date")),
        	timeFormat: django2datepicker(TIME_FORMAT),
            timepicker: true
        });
    });

    $('.js-datetimepicker').each(function(index) {
        $(this).datepicker({
            language: 'en',
            todayButton: true,
            startDate: new Date($(this).attr("date")),
        	dateFormat: django2datepicker(DATE_FORMAT),
            timeFormat: django2datepicker(TIME_FORMAT),
            timepicker: true
        });
    });
}

// jquery stuff goes here
$(document).ready(function() {

    // Toggle menu hamburger to cross
    $('#menu-button').click(function (e) {
        $('#menu-button').toggleClass('is-active');
        // e.preventDefault();
    });

    // Toggle back menu button into hamburger when clicking overlay
    $('.js-off-canvas-exit').click(function(e) {
        $('#menu-button').removeClass('is-active');
        // e.preventDefault();
    });


    // Stepper input
    var $stepperInput = $('.stepper-input input');

    function incrementStepperInput(amount) {
        $stepperInput.val((parseInt($stepperInput.val()) || 0) + amount);
    }

    var stepperInputDecrement = $('.stepper-input button')[0];
    $(stepperInputDecrement).click(function() {
        incrementStepperInput(-1);
    });

    var stepperInputIncrement = $('.stepper-input button')[1];
    $(stepperInputIncrement).click(function() {
        incrementStepperInput(1);
    });

    var dirty_check = $('form.dirty-check');
    if (dirty_check.size()) {
        dirty_check.areYouSure();

        $('form').on('dirty.areYouSure', function() {
            var tab = $('.tabs-title.is-active a')[0];
            if (tab) {
                tab.text = '● ' + tab.text;
            }
            document.title = '● ' + document.title;
        });

        $('form').on('clean.areYouSure', function() {
            var tab = $('.tabs-title.is-active a')[0];
            if (tab) {
                tab.text = tab.text.slice(2);
            }
            document.title = document.title.slice(2);
        });
    }

    set_input_widgets();
});