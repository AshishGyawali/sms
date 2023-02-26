let contacts = {
    init: function () {
        $('#gridContainer').dxDataGrid({
            dataSource: "/contact/getcontacts/",
            paging: {
                pageSize: 25,
            },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [10, 25, 50, 100],
            },
            remoteOperations: false,
            searchPanel: {
                visible: true,
                highlightCaseSensitive: true,
            },
            groupPanel: { visible: false },
            grouping: {
                autoExpandAll: false,
            },
            allowColumnReordering: true,
            rowAlternationEnabled: true,
            showBorders: true,
            columns: [
                {
                    dataField: 'FullName',
                    caption: 'FullName'
                },
                {
                    dataField: 'Contact',
                    caption: 'Contact Number'
                },
                {
                    dataField: 'GroupName',
                    caption: 'Group'
                },
                {
                    dataField: 'SubGroupName',
                    caption: 'Sub Group'
                },
                {
                    dataField: 'Remarks',
                    caption: 'Remarks'
                },
                {
                    dataField: 'CreatedDate',
                    caption: 'Created Date',
                    width: 300,
                    cellTemplate: function (container, options) {
                        let data = options.data;
                        container.append((moment((data.CreatedDate)).format('MMMM Do YYYY, h:mm:ss a')) + " " + (moment(data.CreatedDate).fromNow()));
                    }
                }
            ],
            toolbar: {
                items: [
                    {
                        location: 'after',
                        widget: 'dxButton',
                        options: {
                            text: 'Import',
                            icon: 'xlsfile',
                            stylingMode: 'contained',
                            type: 'success',
                            width: 150,
                            onContentReady: function (e) {
                                e.element[0].id = "importContact";
                            },
                            onClick() {
                                contacts.importContact();
                            }
                        },
                    }, {
                        location: 'after',
                        widget: 'dxButton',
                        options: {
                            icon: 'plus',
                            width: 150,
                            text: 'Add Contact',
                            type: "default",
                            onClick() {
                                contacts.addNew();
                            }
                        },
                    }, 'searchPanel',
                ],
            }
        });
    },

    addNew: function (data) {
        if ($("#addContactPopup").length == 0) {

            $("<div />").attr("id", "addContactPopup").appendTo("body")
        }
        let div = $("#addContactPopup");

        let valGroup = 'CreateContact';
        const addContactPopup = div.dxPopup({
            contentTemplate: function (c) {

                c.append("<div id = 'add-contact'></div>");
            },
            onShowing: function (e) {

                templateManager.getTemplete("contact/create-contact").then(x => {
                    let ctx = $('#add-contact');
                    ctx.html(x);
                    $('#Id', ctx).val(data ? data.Id : 0);
                    $('#groupId').dxSelectBox({
                        dataSource: appStore.get('groups'),
                        name: 'GroupId',
                        displayExpr: 'Name',
                        showClearButton: true,
                        searchEnabled: true,
                        valueExpr: 'Id',
                        label: "Group Name",
                        labelMode: "static",
                        onValueChanged(data) {
                            $('#subgroupId').dxSelectBox('instance').option('dataSource', appStore.get('subgroups', data.value || 0));
                        },
                        onEnterKey: function () {
                            $('#createContact').submit();
                        }
                    });
                    $('#subgroupId').dxSelectBox({
                        dataSource: [],
                        name: 'SubGroupId',
                        displayExpr: 'Name',
                        showClearButton: true,
                        searchEnabled: true,
                        valueExpr: 'Id',
                        label: "Sub-Group Name",
                        labelMode: "static",
                        onEnterKey() {
                            $('#createContact').submit();
                        }
                    });

                    $('#FirstName', ctx).dxTextBox({
                        name: 'FirstName',
                        label: "First Name",
                        value: data ? data.FirstName : null,
                        onEnterKey() {
                            $('#createContact').submit();
                        }
                    }).dxValidator({
                        validationGroup: valGroup,
                        validationRules: [{
                            type: "required",
                            message: 'Please enter first name'
                        }]
                    });

                    $('#LastName', ctx).dxTextBox({
                        name: 'LastName',
                        label: "Last Name",
                        value: data ? data.LastName : null,
                        onEnterKey() {
                            $('#createContact').submit();
                        }
                    }).dxValidator({
                        validationGroup: valGroup,
                        validationRules: [{
                            type: "required",
                            message: 'Please enter last name'
                        }]
                    });

                    $('#Contact', ctx).dxTextBox({
                        name: 'Contact',
                        label: "Contact Number",
                        value: data ? data.Contact : null,
                        onEnterKey() {
                            $('#createContact').submit();
                        }
                    }).dxValidator({
                        validationGroup: valGroup,
                        validationRules: [{
                            type: "required",
                            message: 'Please enter contact number'
                        }]
                    });

                    $('#Remarks', ctx).dxTextBox({
                        name: 'Remarks',
                        label: "Remarks",
                        value: data ? data.Contact : null,
                        onEnterKey() {
                            $('#createContact').submit();
                        }
                    })

                    $('#createContact', ctx).submitPopupForm({
                        url: "/contact/savecontact",
                        method: 'POST',
                        submitBtn: $('#submitContact').dxButton('instance'),
                        popup: addContactPopup,
                        refreshGrid: $('#gridContainer').dxDataGrid('instance'),
                        validationGroup: valGroup
                    });
                })
            },
            width: 550,
            minHeight: 400,
            height: 'auto',
            showTitle: true,
            title: 'Add new contact',
            visible: true,
            dragEnabled: false,
            hideOnOutsideClick: true,
            showCloseButton: false,
            toolbarItems: [{
                widget: 'dxButton',
                toolbar: 'bottom',
                location: 'before',
                options: {
                    text: 'Close',
                    icon: 'fa-solid fa-circle-xmark',
                    stylingMode: 'outlined',
                    type: 'danger',
                    width: 150,
                    onClick() {
                        addContactPopup.hide();
                    },
                },
            }, {
                widget: 'dxButton',
                toolbar: 'bottom',
                location: 'after',
                options: {
                    text: 'Import',
                    icon: 'xlsfile',
                    stylingMode: 'contained',
                    type: 'success',
                    width: 150,
                    validationGroup: valGroup,
                    onContentReady: function (e) {
                        e.element[0].id = "importContact";
                    },
                    onClick() {
                        alert('hey');
                    }
                }
            }, {
                widget: 'dxButton',
                toolbar: 'bottom',
                location: 'after',
                options: {
                    text: 'Proceed',
                    icon: 'check',
                    stylingMode: 'contained',
                    type: 'default',
                    width: 150,
                    validationGroup: valGroup,
                    onContentReady: function (e) {
                        e.element[0].id = "submitContact";
                    },
                    onClick() {
                        $('#createContact').submit();
                    }
                },
            }],
        }).dxPopup('instance');
    },


     importContact: function (data) {
         if ($("#importContactPopup").length == 0) {

            $("<div />").attr("id", "importContactPopup").appendTo("body")
        }
        let div = $("#importContactPopup");

         let valGroup = 'importContact';
        const addContactPopup = div.dxPopup({
            contentTemplate: function (c) {

                c.append("<div id = 'import-contact'></div>");
            },
            onShowing: function (e) {

                templateManager.getTemplete("contact/import-contact").then(x => {
                    let ctx = $('#import-contact');
                    ctx.html(x);
                    $('#ExcelFile').dxFileUploader({
                        selectButtonText: 'Select File',
                        dropZone: '.drop-div',
                        name: 'File',
                        labelText: '',
                        accept: 'image/*',
                        uploadMode: 'useForm',
                    });

                    $('#importContact', ctx).submitPopupForm({
                        url: "/contact/importcontact",
                        method: 'POST',
                        submitBtn: $('#importContact').dxButton('instance'),
                        popup: addContactPopup,
                        refreshGrid: $('#gridContainer').dxDataGrid('instance'),
                        validationGroup: valGroup
                    });
                })
            },
            width: 550,
            minHeight: 400,
            height: 'auto',
            showTitle: true,
            title: 'Import Contacts',
            visible: true,
            dragEnabled: false,
            hideOnOutsideClick: true,
            showCloseButton: false,
            toolbarItems: [{
                widget: 'dxButton',
                toolbar: 'bottom',
                location: 'before',
                options: {
                    text: 'Close',
                    icon: 'fa-solid fa-circle-xmark',
                    stylingMode: 'outlined',
                    type: 'danger',
                    width: 150,
                    onClick() {
                        addContactPopup.hide();
                    },
                },
            }, {
                widget: 'dxButton',
                toolbar: 'bottom',
                location: 'after',
                options: {
                    text: 'Import',
                    icon: 'check',
                    stylingMode: 'contained',
                    type: 'default',
                    width: 150,
                    validationGroup: valGroup,
                    onContentReady: function (e) {
                        e.element[0].id = "submitContact";
                    },
                    onClick() {
                        $('#importContact').submit();
                    }
                },
            }],
        }).dxPopup('instance');
    }
}