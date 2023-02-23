let subgroups = {
    init: function () {
        $('#gridContainer').dxDataGrid({
            dataSource: "/group/getsubgroups/",
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
            groupPanel: { visible: true },
            grouping: {
                autoExpandAll: true,
            },
            allowColumnReordering: true,
            rowAlternationEnabled: true,
            showBorders: true,
            columns: [
                {
                    dataField: 'GroupName',
                    caption: 'Group Name',
                    groupIndex: 0
                },
                {
                    dataField: 'Name',
                    caption: 'Sub-Group Name'
                },
                {
                    dataField: 'CreatedDate',
                    caption: 'Created Date',
                    width: 300,
                    cellTemplate: function (container, options) {
                        let data = options.data;
                        container.append((moment((data.CreatedDate)).format('MMMM Do YYYY, h:mm:ss a')) + " " + (moment(data.CreatedDate).fromNow()));
                    }
                }, {
                    caption: 'Action',
                    width: 100,
                    cellTemplate: function (container, options) {
                        $('<a />').attr('href', 'javascript:void(0)').on('click', function (e) {
                            subgroups.addNew(options.data);
                        }).text('Edit').appendTo(container);
                    }
                },
            ],
            toolbar: {
                items: [
                    {
                        location: 'after',
                        widget: 'dxButton',
                        options: {
                            icon: 'plus',
                            width: 150,
                            text: 'Add Sub-Group',
                            type: "default",
                            onClick() {
                                subgroups.addNew();
                            }
                        },
                    }, 'searchPanel',
                ],
            }
        });
    },

    addNew: function (data) {
        if ($("#addSubGroupPopup").length == 0) {

            $("<div />").attr("id", "addSubGroupPopup").appendTo("body")
        }
        let div = $("#addSubGroupPopup");

        let valGroup = 'CreateSubGroup';
        const addSubGroupPopup = div.dxPopup({
            contentTemplate: function (c) {

                c.append("<div id = 'add-subgroup'></div>");
            },
            onShowing: function (e) {

                templateManager.getTemplete("group/create-subgroup").then(x => {
                    let ctx = $('#add-subgroup');
                    ctx.html(x);
                    $('#Id', ctx).val(data ? data.Id : 0);
                    $('#groupId').dxSelectBox({
                        dataSource: appStore.get('groups'),
                        name: 'groupId',
                        displayExpr: 'Name',
                        showClearButton: true,
                        searchEnabled: true,
                        valueExpr: 'Id',
                        label: "Group Name",
                        labelMode: "static",
                        onEnterKey: function() {
                            $('#createSubGroup').submit();
                        }
                    });

                    $('#Name', ctx).dxTextBox({
                        name: 'Name',
                        label: "Sub-Group Name",
                        value: data ? data.Name : null,
                        onEnterKey() {
                            $('#createSubGroup').submit();
                        }
                    }).dxValidator({
                        validationGroup: valGroup,
                        validationRules: [{
                            type: "required",
                            message: 'Please enter sub group name'
                        }, {
                            type: 'async',
                            message: 'Sub-Group name already exists',
                            validationCallback(params) {
                                const d = $.Deferred();
                                $.ajax({
                                    type: "POST",
                                    url: "/group/validatesubgroup",
                                    data: { subGroupName: params.value, Id: (data != null ? data.Id : 0) },
                                    success: function (res) {
                                        d.resolve(res);
                                    }
                                });
                                return d.promise();
                            },
                        }]
                    });

                    $('#createSubGroup', ctx).submitPopupForm({
                        url: "/group/savesubgroup",
                        method: 'POST',
                        submitBtn: $('#submitSubGroup').dxButton('instance'),
                        popup: addSubGroupPopup,
                        refreshGrid: $('#gridContainer').dxDataGrid('instance'),
                        validationGroup: valGroup
                        });
                })
            },
            width: 500,
            minHeight: 300,
            height: 'auto',
            showTitle: true,
            title: data ? 'Edit Sub-Group (' + data.Name + ')' : 'Create new sub-group',
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
                        addSubGroupPopup.hide();
                    },
                },
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
                        e.element[0].id = "submitGroup";
                    },
                    onClick() {
                        $('#createSubGroup').submit();
                    }
                },
            }],
        }).dxPopup('instance');
    }

}