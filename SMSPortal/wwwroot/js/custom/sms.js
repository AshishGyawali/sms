let sms = {
    init: function () {
    },
    tagline: function () {
        var user = $('#loggedInUser').text();
        if (user) {
            return '\r\n via ' + user;
        }
    },

    countSmsMessage: function (text) {
        // The maximum length of a 7-bit encoding message is 160 characters for the first message,
        // and 153 characters for subsequent messages
        const max7BitLength = {
            firstMessage: 160,
            subsequentMessages: 153,
        };

        // The maximum length of a UTF-16 message is 70 characters for the first message,
        // and 67 or 68 characters for subsequent messages, depending on the encoding
        const maxUTF16Length = {
            firstMessage: 70,
            subsequentMessages: 67,
        };

        // Check if the text has any UTF-16 characters using a regular expression
        const utf16Regex = /[\u0080-\uffff]/;
        const isUTF16 = utf16Regex.test(text);
        // Determine the maximum length based on the encoding type
        const maxMessageLength = isUTF16 ? maxUTF16Length : max7BitLength;

        // Calculate the number of message parts required to send the text
        const numParts = Math.ceil(text.length / maxMessageLength.firstMessage);

        // Calculate the number of characters in the last message
        const lastMessageLength = text.length % maxMessageLength.firstMessage || maxMessageLength.firstMessage;

        // Calculate the maximum number of characters for subsequent messages
        const maxSubsequentLength = maxMessageLength.subsequentMessages - 6;

        // Calculate the number of remaining characters in the last message
        let remainingCharacters;
        if (isUTF16 && numParts > 1) {
            // For subsequent UTF-16 messages, subtract the header length from the maximum length
            const headerLength = 6;
            const messageLength = maxMessageLength.subsequentMessages - headerLength;
            remainingCharacters = messageLength - (lastMessageLength - headerLength) / 2;
        } else {
            remainingCharacters = maxSubsequentLength - (lastMessageLength - 6);
        }

        // If there are no remaining characters, set the value to zero
        if (remainingCharacters < 0) {
            remainingCharacters = 0;
        }

        return { numParts, remainingCharacters };


    },

    //const GSM_CHARSET = '@£$¥èéùìòÇØøÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !"#¤%&\'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà\n';
    //const GSM_MAX_CHARS = 160;
    //const UNICODE_MAX_CHARS = 70;
    //const GSM_EXTENDED_CHARSET = '\\^{}\\\\\\[~\\]|€';

    //// Check if text contains any characters outside the GSM 7-bit character set
    //const hasUnicodeChars = new RegExp(`[^${GSM_CHARSET}${GSM_EXTENDED_CHARSET}]`, 'g').test(text);

    //if (hasUnicodeChars) {
    //    // If text contains Unicode characters, use the Unicode SMS message limit
    //    const unicodeSmsCount = Math.ceil(text.length / UNICODE_MAX_CHARS);
    //    const remainingChars = unicodeSmsCount * UNICODE_MAX_CHARS - text.length;
    //    return { smsCount: unicodeSmsCount, remainingChars: remainingChars };
    //} else {
    //    // If text only contains GSM 7-bit characters, use the GSM SMS message limit
    //    const gsmSmsCount = Math.ceil(text.length / GSM_MAX_CHARS);
    //    const remainingChars = gsmSmsCount * GSM_MAX_CHARS - text.length;
    //    return { smsCount: numParts, remainingChars: remainingChars };
    //}

    sendSMS: function (data) {
        {
            var selectedData = $('#gridContainer').dxDataGrid('instance').getSelectedRowsData();
            var contact = '';
            for (i = 0; i < selectedData.length; i++) {
                contact += selectedData[i].Contact + ',';
            }
            contact = contact.substr(0, contact.length - 1);
            if ($("#sendSMSPopup").length == 0) {

                $("<div />").attr("id", "sendSMSPopup").appendTo("body")
            }
            let div = $("#sendSMSPopup");

            let valGroup = 'sendSMS';
            const sendSMSPopup = div.dxPopup({
                contentTemplate: function (c) {
                    const scrollView = $('<div />');
                    scrollView.append("<div id = 'send-to'></div>");
                    scrollView.dxScrollView({
                        width: '100%',
                        height: '100%',
                    });
                    return scrollView;
                },
                onShowing: function (e) {

                    templateManager.getTemplete("SMS/send-sms").then(x => {
                        let ctx = $('#send-to');
                        var regex = /[^\u0000-\u00ff]/;

                        function containsDoubleByte(str) {
                            if (!str.length) return false;
                            if (str.charCodeAt(0) > 255) return true;
                            return regex.test(str);
                        }
                        ctx.html(x);
                        $('#lowCredit').hide();
                        let charCountnum = 0;
                        $("#charCount").html(charCountnum);
                        $("#lang").html('English');
                        $("#creditCount").html(0);
                        $.ajax({
                            type: "POST",
                            url: "/sms/getbalance",
                            success: function (data) {
                                $("#remaining-credit").empty().append(data.credits_available);
                                if (data.credits_available < data.minimum_credit) {
                                    $('#lowCredit').show();
                                }
                            }
                        });

                        $("#number-count").append(selectedData.length);
                        $('#contact-number').dxTextArea({
                            value: contact,
                            minHeight: 90,
                            label: 'Numbers',
                            labelMode: "static",
                            autoResizeEnabled: true,
                            valueChangeEvent: "keyup",
                            onValueChanged: function (e) {
                                var num = e.value;
                                if (num) {
                                    if (e.event.keyCode === 32) {
                                        var lastChar = num.substring(num.length - 1, num.length);
                                        if (lastChar == ' ') {
                                            num = num.substring(0, num.length - 1) + ',';
                                        }
                                        $('#contact-number').dxTextArea('instance').option('value', num);
                                        var newStr = num.substring(0, num.length - 1);
                                        var arr = newStr.split(',');
                                        var last = arr[arr.length - 1];
                                        if (last.length != 10 && (lastChar == ',' || lastChar == ' ')) {
                                            arr.pop();
                                            str = arr.join(',');
                                            $('#contact-number').dxTextArea('instance').option('value', str);
                                        }
                                    }
                                    if (e.event.keyCode === 188) {
                                        var newStr = num.substring(0, num.length - 1);
                                        var lastChar = num.substring(num.length - 1, num.length);
                                        var arr = newStr.split(',');
                                        var last = arr[arr.length - 1];
                                        if (last.length != 10 && lastChar == ',') {
                                            arr.pop();
                                            str = arr.join(',');
                                            $('#contact-number').dxTextArea('instance').option('value', str);
                                        }
                                    }
                                    var newNum = $('#contact-number').dxTextArea('instance').option('value');
                                    var numCount = newNum.split(',').length;
                                    $("#number-count").empty().append(numCount);

                                }
                            }

                        });
                        $('#chooseTemplete', ctx).dxSelectBox({
                            dataSource: appStore.get('template'),
                            valueExpr: 'Id',
                            displayExpr: 'Name',
                            placeholder: 'Select templete',
                            showClearButton: true,
                            label: 'Choose Templete',
                            labelMode: "static",
                            onSelectionChanged(data) {
                                $('#messageBody').dxTextArea('instance').option('value', (data.selectedItem) ? data.selectedItem.TemplateContent : '');
                            },
                        });
                        $('#messageBody').dxTextArea({
                            minHeight: 90,
                            autoResizeEnabled: true,
                            placeholder: 'Type your message here.',
                            label: 'Message',
                            labelMode: "static",
                            valueChangeEvent: "keyup",
                            onValueChanged: function (e) {
                                var string = e.value;
                                charCountnum = string.length;
                                var isUnicode = containsDoubleByte(string);
                                if (isUnicode) {
                                    $("#lang").html('नेपाली');
                                }
                                else {
                                    $("#lang").html('English');
                                }
                                let returnObj = sms.countSmsMessage(string);
                                $("#creditCount").html(returnObj.numParts);
                                $("#charCount").html(returnObj.remainingCharacters);
                                var width = (isUnicode ? (((charCountnum - 1) % 70) / 70 * 100) : (((charCountnum - 1) % 160) / 160 * 100));
                                if (width > 90) {
                                    $('#charProgress').addClass('bg-danger');
                                } else {
                                    $('#charProgress').removeClass('bg-danger');
                                }
                                var progressWidth = width + '%';
                                $('#charProgress').css('width', progressWidth);
                            }
                        });
                        $('#createTemplateTxt').dxButton({
                            stylingMode: 'text',
                            text: 'Create Template',
                            type: 'default',
                            width: 160,
                            onClick() {
                                sms.smsTemplate();
                            },
                        });
                        const now = new Date();
                        $('#scheduledDate').dxDateBox({
                            type: 'datetime',
                            min: now,
                            dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ss',
                            label: 'Schedule Date',
                            labelMode: "static",

                        });
                        $('#selfSms').dxCheckBox({
                            value: false,
                            text: 'Send message to me',
                            onValueChanged: function (e) {
                                if (e.value) {
                                    e.element.find(".dx-checkbox-text")
                                        .html('Sending to <span class = \'text-primary\'>9867225803.</span>');
                                }
                                else {
                                    e.element.find(".dx-checkbox-text")
                                        .html('Send message to me');
                                }
                            }
                        });
                        $('#tagline').dxCheckBox({
                            value: false,
                            text: 'Append your tagline',
                            onValueChanged: function (e) {
                                var old = $('#messageBody').dxTextArea('instance').option('value');
                                if (e.value) {
                                    $('#messageBody').dxTextArea('instance').option('value', old + sms.tagline());
                                }
                                else {
                                    if (old) {
                                        $('#messageBody').dxTextArea('instance').option('value', old.replace(sms.tagline(), ''));
                                    }
                                }
                            },
                        });
                    })
                },

                width: 550,
                height: 610,
                showTitle: true,
                title: 'Send Bulk SMS',
                visible: true,
                dragEnabled: false,
                hideOnOutsideClick: true,
                showCloseButton: false,
                toolbarItems: [{
                    widget: 'dxButton',
                    toolbar: 'bottom',
                    location: 'after',
                    options: {
                        text: 'Send',
                        icon: 'check',
                        stylingMode: 'contained',
                        type: 'default',
                        width: 150,
                        onContentReady: function (e) {
                            e.element[0].id = "submitContact";
                        },
                        onClick() {
                            //alert('Okay');
                            MobileNumbers = $('#contact-number').dxTextArea('instance').option('value');
                            Body = $('#messageBody').dxTextArea('instance').option('value');
                            Scheduled = $('#scheduledDate').dxDateBox('instance').option('value');
                            $.ajax({
                                type: "POST",
                                url: "/sms/sendsms",
                                data: { 'MobileNumbers': MobileNumbers, 'Body': Body, 'Scheduled': Scheduled },
                                success: function (data) {
                                    console.log('sent');
                                }
                            });
                        }
                    },
                }, {
                    widget: 'dxButton',
                    toolbar: 'bottom',
                    location: 'after',
                    options: {
                        text: 'Cancel',
                        icon: 'fa-solid fa-circle-xmark',
                        stylingMode: 'outlined',
                        type: 'danger',
                        width: 150,
                        onClick() {
                            sendSMSPopup.hide();
                        },
                    },
                }
                ],
            }).dxPopup('instance');
        }
    },

    smsTemplate: function (data) {
        var templateContent = $('#messageBody').dxTextArea('instance').option('value');
        if ($("#smsTemplatePopup").length == 0) {

            $("<div />").attr("id", "smsTemplatePopup").appendTo("body")
        }
        let div = $("#smsTemplatePopup");
        let valGroup = 'smsTemplate';
        const smsTemplatePopup = div.dxPopup({
            contentTemplate: function (c) {
                c.append("<div id = 'sms-template'></div>");
            },
            onShowing: function (e) {

                templateManager.getTemplete("SMS/sms-template").then(x => {
                    let ctx = $('#sms-template');
                    ctx.html(x);
                    $('#templateName').dxTextBox({
                        label: 'Template Name',
                        labelMode: "static",
                    });
                    $('#templateContent').dxTextArea({
                        value: templateContent ? templateContent : '',
                        minHeight: 90,
                        label: 'Message',
                        labelMode: "static",
                        autoResizeEnabled: true
                    });
                });
            },
            width: 550,
            minHeight: 200,
            height: 'auto',
            showTitle: true,
            title: 'Save Template',
            visible: true,
            dragEnabled: false,
            hideOnOutsideClick: true,
            showCloseButton: false,
            toolbarItems: [{
                widget: 'dxButton',
                toolbar: 'bottom',
                location: 'after',
                options: {
                    text: 'Save',
                    icon: 'check',
                    stylingMode: 'contained',
                    type: 'default',
                    width: 150,
                    onClick() {
                        var name = $('#templateName').dxTextBox('instance').option('value');
                        var message = $('#templateContent').dxTextArea('instance').option('value');
                        $.ajax({
                            type: "POST",
                            url: "/sms/savetemplate",
                            data: { 'Name': name, 'TemplateContent': message },
                            success: function (res) {
                                smsTemplatePopup.hide();
                                showSuccessMessage("Successfully processed your request.");
                            }
                        });
                    }
                }
            }, {
                widget: 'dxButton',
                toolbar: 'bottom',
                location: 'after',
                options: {
                    text: 'Cancel',
                    icon: 'fa-solid fa-circle-xmark',
                    stylingMode: 'outlined',
                    type: 'danger',
                    width: 150,
                    onClick() {
                        smsTemplatePopup.hide();
                    },
                },
            }
            ]
        }).dxPopup('instance');
    }
}