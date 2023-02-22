let subgroups = {
    init: function () {
        $('#gridContainer').dxDataGrid({
            dataSource: "/group/getsubgroups/",
            paging: {
                pageSize: 10,
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

                let ctx = $('#add-subgroup');
                templateManager.getTemplete("group/create-subgroup").then(x => {
                    ctx.html(x);


                    $('#createSubGroup').on('submit',  function (e) {
                        e.preventDefault();
                        $.ajax({
                            type: 'POST',
                            url: "/group/savesubgroup",
                            data: ($('#createSubGroup').serialize()),
                            success: function () {
                                addSubGroupPopup.hide();
                                $('#gridContainer').dxDataGrid('instance').refresh();
                                showSuccessMessage((data) ? "Sub-Group updated successfully" : "Sub-Group added successfully");
                            }
                        });
                    })


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
                    });

                    $('#Name', ctx).dxTextBox({
                        name: 'Name',
                        label: "Sub-Group Name",
                        value: data ? data.Name : null
                    })
                        .dxValidator({
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
                    useDefaultBehaviour: true,
                    validationGroup: valGroup,
                    onClick(e) {
                        let res = (e.validationGroup.validate());
                        res.status === "pending" && res.complete.then((r) => {
                            if (r.status == 'valid') {
                                $('#createSubGroup').submit();
                            }
                        });
                    },
                },
            }],
        }).dxPopup('instance');
    }

}