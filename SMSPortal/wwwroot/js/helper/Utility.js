let appStore = {
    get: function (name, parentId) {
        return new DevExpress.data.DataSource({
            store: new DevExpress.data.CustomStore({
                key: "Id",
                load: function (loadOptions) {
                    const d = $.Deferred();
                    $.ajax({
                        type: "POST",
                        url: "/datastore/getdata",
                        data: { searchKey: loadOptions.searchValue, parentId: parentId, take: loadOptions.take, skip: loadOptions.skip, name: name },
                        success: function (res) {
                            d.resolve(res);
                        }
                    });
                    return d.promise();
                },
                byKey: function (key) {
                    const d = $.Deferred();
                    $.ajax({
                        type: "POST",
                        url: "/datastore/getdata",
                        data: { id: key, name: name },
                        success: function (res) {
                            d.resolve(res);
                        }
                    });
                    return d.promise();
                }
            }),
            paginate: true,
            pageSize: 10
        })
    }
};

(function ($) {
    $.fn.submitPopupForm = function (options) {
        let form = $(this);
        
        form.on('submit', function (e) {
            e.preventDefault();
            if (!options.url) {
                console.error('Url is missing.');
                return false;
            }
            let method = ((options.method == 'GET') ? 'GET' : 'POST');
            let button = options.submitBtn;
            let popup = options.popup;
            let refreshGrid = options.refreshGrid;
            let valgroup = options.validationGroup;
            console.log(form);
            var formData = new FormData(form[0]);
            let ajaxoptions = {
                type: method,
                url: options.url,
                data: formData,
                contentType: false,
                processData: false,
                beforeSend: function () {
                    if (button) {
                        button.option("disabled", true);
                    }
                    if (options.beforeSend && typeof options.beforeSend == 'function') {
                        options.beforeSend(formData);
                    }

                },
                success: function (res) {
                    if (options.success && typeof options.success == 'function') {
                        options.success(res);
                    }
                    if (!options.hideSuccessMessage) {
                        if (!res.HasError) {
                            if (res.Message) {
                                showSuccessMessage(res.Message);
                            }
                            else {
                                showSuccessMessage("Successfully processed your request.");
                            }
                        }
                    }
                    if (res.HasError) {
                        if (res.Message) {
                            showErrorMessage(res.Message);
                        }
                        else {
                            showErrorMessage("Something went wrong. Please try again.");
                        }
                    }
                    else {
                        if (popup) {
                            popup.hide();
                        }
                        if (refreshGrid) {
                            refreshGrid.refresh();
                        }
                    }
                },
                complete: function () {
                    if (button) {
                        button.option("disabled", false);
                    }
                },
                error: function () {
                    showErrorMessage("Something went wrong please try again.");
                }
            };
            if (valgroup) {
                let res = DevExpress.validationEngine.validateGroup(valgroup);
                if (res) {
                    if (res.status == "valid") {
                        $.ajax(ajaxoptions);
                    }
                    else if (res.status === "pending") {
                        res.complete.then((r) => {
                            if (r.status == 'valid') {
                                $.ajax(ajaxoptions);
                            }
                        });
                    }   
                }
                else {
                    return false;
                }
            }
            else {
                $.ajax(ajaxoptions);
            }


        });
    }
}(jQuery));

