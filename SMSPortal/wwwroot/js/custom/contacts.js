let contacts = {
    init: function () {
        var smsBtn = $('#send-sms').dxButton({
            stylingMode: 'contained',
            text: 'Send SMS',
            disabled: true,
            elementAttr: { class: "btn-send-sms" },
            width: 150,
            onClick() {
                sms.sendSMS();
            },
        }).dxButton('instance');; // send sms 
        $('#add-contacts').dxButton({
            icon: 'plus',
            width: 150,
            text: 'Add Contact',
            type: "default",
            onClick() {
                contacts.addNew();
            }
        });
        $('#import-contacts').dxButton({
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
        });
        $('a[data-bs-toggle="pill"]').on('shown.bs.tab', function (e) {
            var groupId = $(e.target).attr("data-groupId");
            var subgroupId = $(e.target).attr("data-subgroupId");
            var subgroupDataGrid = $('.dg-' + subgroupId).dxDataGrid({
                dataSource: "/contact/getContactBySubGroupId?groupId=" + groupId + "&subgroupId=" + subgroupId,
                paging: {
                    pageSize: 25,
                },
                pager: {
                    showPageSizeSelector: true,
                    allowedPageSizes: [10, 25, 50, 100],
                },
                selection: {
                    mode: 'multiple',
                    selectAllMode: 'allPages',
                    showCheckBoxesMode: 'always',
                },
                remoteOperations: false,
                searchPanel: {
                    visible: true,
                    highlightCaseSensitive: true,
                    width: 265,
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
                        dataField: 'Remarks',
                        caption: 'Remarks'
                    },
                    {
                        dataField: 'CreatedDate',
                        caption: 'Created Date',
                        width: 300,
                        cellTemplate: function (container, options) {
                            let data = options.data;
                            let dateTimeHtml = `<p>${moment((data.CreatedDate)).format('MMMM Do YYYY, h:mm:ss a')} <span class = tableDateFromNow>${(moment(data.CreatedDate).fromNow())}</span></p>`
                            container.append(dateTimeHtml);
                        }
                    }
                ],
                onSelectionChanged: function (e) { // Handler of the "selectionChanged" event
                    var selectedData = e.selectedRowsData;
                    if (selectedData.length > 0) {
                        ($('.dg-' + groupId).dxDataGrid('instance')).clearSelection();
                        dataGrid.clearSelection();
                        smsBtn.option('disabled', false);
                        smsBtn.option('text', 'Send SMS (' + selectedData.length + ')');

                    }
                    else {
                        smsBtn.option('text', 'Send SMS');
                        smsBtn.option('disabled', true);
                    }
                }
            }).dxDataGrid('instance');;
        }); // show grids of contacts filtering subgroups
        $('a[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
            var groupId = $(e.target).attr("data-groupId");
            var groupDataGrid = $('.dg-' + groupId).dxDataGrid({
                dataSource: "/contact/getContactByGroupId?groupId=" + groupId,
                paging: {
                    pageSize: 25,
                },
                pager: {
                    showPageSizeSelector: true,
                    allowedPageSizes: [10, 25, 50, 100],
                },
                selection: {
                    mode: 'multiple',
                    selectAllMode: 'allPages',
                    showCheckBoxesMode: 'always',
                },
                remoteOperations: false,
                searchPanel: {
                    visible: true,
                    highlightCaseSensitive: true,
                    width: 265,
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
                            let dateTimeHtml = `<p>${moment((data.CreatedDate)).format('MMMM Do YYYY, h:mm:ss a')} <span class = tableDateFromNow>${(moment(data.CreatedDate).fromNow())}</span></p>`
                            container.append(dateTimeHtml);
                        }
                    }
                ],
                onSelectionChanged: function (e) { // Handler of the "selectionChanged" event
                    var selectedData = groupDataGrid.getSelectedRowsData();
                    //subgroupDataGrid.clearSelection();
                    if (selectedData.length > 0) {
                        smsBtn.option('disabled', false);
                        smsBtn.option('text', 'Send SMS (' + selectedData.length + ')');
                        dataGrid.clearSelection();
                    }
                    else {
                        smsBtn.option('text', 'Send SMS');
                        smsBtn.option('disabled', true);
                    }
                }
            }).dxDataGrid('instance');
        }); // show grids of contacts filtering groups

        var dataGrid = $('#gridContainer').dxDataGrid({
            dataSource: "/contact/getcontacts/",

            paging: {
                pageSize: 25,
            },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [10, 25, 50, 100],
            },
            selection: {
                mode: 'multiple',
                selectAllMode: 'allPages',
                showCheckBoxesMode: 'always',
            },
            remoteOperations: false,
            searchPanel: {
                visible: true,
                width: 265,
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
                        let dateTimeHtml = `<p>${moment((data.CreatedDate)).format('MMMM Do YYYY, h:mm:ss a')} <span class = tableDateFromNow>${(moment(data.CreatedDate).fromNow())}</span></p>`
                        container.append(dateTimeHtml);
                    }
                }
            ],
            onSelectionChanged: function (e) { // Handler of the "selectionChanged" event
                var selectedData = dataGrid.getSelectedRowsData();
                if (selectedData.length > 0) {
                    smsBtn.option('disabled', false);
                    smsBtn.option('text', 'Send SMS (' + selectedData.length + ')');
                }
                else {
                    smsBtn.option('text', 'Send SMS');
                    smsBtn.option('disabled', true);
                }
            }
        }).dxDataGrid('instance'); // show grids of all contacts

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
                var groupsIdval = parseInt($("ul.nav a.active").attr("data-groupId"));
                var subgroupsIdval = parseInt($(".tab-pane.active a.active").attr("data-subgroupId"));
                var groupIdval = isNaN(groupsIdval) ? null : groupsIdval;
                var subgroupIdval = isNaN(subgroupsIdval) ? null : subgroupsIdval;
                templateManager.getTemplete("contact/create-contact").then(x => {
                    let ctx = $('#add-contact');
                    ctx.html(x);
                    $('#Id', ctx).val(data ? data.Id : 0);
                    $('#groupId', ctx).dxSelectBox({
                        dataSource: appStore.get('groups'),
                        name: 'GroupId',
                        displayExpr: 'Name',
                        showClearButton: true,
                        searchEnabled: true,
                        valueExpr: 'Id',
                        label: "Group Name",
                        labelMode: "static",
                        value: groupIdval,
                        onValueChanged(data) {
                            $('#subgroupId', ctx).dxSelectBox('instance').option('dataSource', appStore.get('subgroups', data.value || 0));
                        },
                        onEnterKey: function () {
                            $('#createContact').submit();
                        }
                    });

                    $('#subgroupId', ctx).dxSelectBox({
                        dataSource: [],
                        name: 'SubGroupId',
                        displayExpr: 'Name',
                        showClearButton: true,
                        searchEnabled: true,
                        valueExpr: 'Id',
                        value: subgroupIdval,
                        label: "Sub-Group Name",
                        labelMode: "static",
                        onEnterKey() {
                            $('#createContact').submit();
                        }
                    });
                    if (groupIdval != null) {
                        $('#subgroupId', ctx).dxSelectBox('instance').option('dataSource', appStore.get('subgroups', groupIdval || 0));
                    }
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
            }, {
                widget: 'dxButton',
                toolbar: 'bottom',
                location: 'after',
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
            }
            ],
        }).dxPopup('instance');
    }, // add new individual contact


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
                var groupsIdval = parseInt($("ul.nav a.active").attr("data-groupId"));
                var subgroupsIdval = parseInt($(".tab-pane.active a.active").attr("data-subgroupId"));
                var groupIdval = isNaN(groupsIdval) ? null : groupsIdval;
                var subgroupIdval = isNaN(subgroupsIdval) ? null : subgroupsIdval;
                templateManager.getTemplete("contact/import-contact").then(x => {
                    let ctx = $('#import-contact');
                    ctx.html(x);
                    $('#groupId', ctx).dxSelectBox({
                        dataSource: appStore.get('groups'),
                        name: 'GroupId',
                        displayExpr: 'Name',
                        showClearButton: true,
                        searchEnabled: true,
                        valueExpr: 'Id',
                        value: groupIdval,
                        label: "Group Name",
                        placeholder: "Select to place into or leave blank",
                        labelMode: "static",
                        onValueChanged(data) {

                            $('#subgroupId', ctx).dxSelectBox('instance').option('dataSource', appStore.get('subgroups', data.value || 0));
                        },
                        onEnterKey: function () {
                            $('#importContactFile').submit();
                        }
                    });
                    $('#subgroupId', ctx).dxSelectBox({
                        dataSource: [],
                        name: 'SubGroupId',
                        displayExpr: 'Name',
                        showClearButton: true,
                        searchEnabled: true,
                        valueExpr: 'Id',
                        value: subgroupIdval,
                        label: "Sub-Group Name",
                        placeholder: "Select to place into or leave blank",
                        labelMode: "static",
                        onEnterKey() {
                            $('#importContactFile').submit();
                        }
                    });
                    if (groupIdval != null) {
                        $('#subgroupId', ctx).dxSelectBox('instance').option('dataSource', appStore.get('subgroups', groupIdval || 0));
                    }
                    $('#importContactFile').submitPopupForm({
                        url: "/contact/importcontact",
                        method: 'POST',
                        data: { groupId: groupId, subgroupId: subgroupId },
                        submitBtn: $('#importContact').dxButton('instance'),
                        //hideSuccessMessage: true,
                        success: function (res) {
                            contacts.showImportedContact(res);
                            addContactPopup.hide();
                        },
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
                location: 'after',
                options: {
                    text: 'Import',
                    icon: 'check',
                    stylingMode: 'contained',
                    type: 'default',
                    width: 150,
                    onContentReady: function (e) {
                        e.element[0].id = "submitContact";
                    },
                    onClick() {
                        $('#importContactFile').submit();
                    }
                },
            }, {
                widget: 'dxButton',
                toolbar: 'bottom',
                location: 'after',
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
            }
            ],
        }).dxPopup('instance');
    }, // import bulk contact

    showImportedContact: function (data) {
        if ($("#showImportedContactPopup").length == 0) {

            $("<div />").attr("id", "showImportedContactPopup").appendTo("body")
        }
        let div = $("#showImportedContactPopup");
        const showImportedContactPopup = div.dxPopup({
            contentTemplate: function (c) {
                c.append("<div id = 'import-newcontact'></div>");

            },
            onShowing: function (e) {

                templateManager.getTemplete("contact/view-imported-contact").then(x => {
                    let ctx = $('#import-newcontact');
                    ctx.html(x);

                    $('#viewImportedContact').dxDataGrid({
                        dataSource: data.Contacts,
                        paging: {
                            pageSize: 25,
                        },
                        pager: {
                            showPageSizeSelector: true,
                            allowedPageSizes: [10, 25, 50, 100],
                        },
                        editing: {
                            mode: 'cell',
                            allowUpdating: true,
                            allowDeleting: true,
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
                                dataField: 'Name',
                                caption: 'FullName'
                            },
                            {
                                dataField: 'Number',
                                caption: 'Contact Number'
                            }],
                    });
                })
            },
            width: 900,
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
                location: 'after',
                options: {
                    text: 'Import',
                    icon: 'check',
                    stylingMode: 'contained',
                    type: 'default',
                    width: 150,
                    hint: 'Focus out from the cell once you\'re done editing',
                    onContentReady: function (e) {
                        e.element[0].id = "submitImportedContact";
                    },
                    onClick() {
                        $.ajax({
                            type: "POST",
                            url: "/contact/savebulkcontact",
                            data: { model: data.Contacts, groupId: data.GroupId, subgroupId: data.SubgroupId },
                            success: function (res) {
                                if (!res.HasError) {
                                    showImportedContactPopup.hide();
                                    $('#gridContainer').dxDataGrid('instance').refresh();
                                }
                                else
                                    console.log(res.message);
                            },
                            error: function (res) {
                                showErrorMessage(res.Message);
                            }
                        });
                    }
                },
            }, {
                widget: 'dxButton',
                toolbar: 'bottom',
                location: 'after',
                options: {
                    text: 'Close',
                    icon: 'fa-solid fa-circle-xmark',
                    stylingMode: 'outlined',
                    type: 'danger',
                    width: 150,
                    onClick() {
                        showImportedContactPopup.hide();
                    },
                },
            }
            ],
        }).dxPopup('instance');
    }, // show grid of imported contacts before saving
}