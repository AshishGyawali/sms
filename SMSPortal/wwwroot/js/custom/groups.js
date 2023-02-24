let groups = {
    init: function () {
        $('#gridContainer').dxDataGrid({
            dataSource: "/group/getgroups/",
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
                    dataField: 'Name',
                    caption: 'Group Name',
                    cellTemplate: function (container, options) {
                        let data = options.data;
                        container.append(data.Name + '<span class = "no-of-subgroup">('+data.SubgroupCount+' subgroups)</span>');
                    }
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
                            groups.addNew(options.data);
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
                            text: 'Add Group',
                            type: "default",
                            onClick() {
                                groups.addNew();
                            }
                        },
                    }, 'searchPanel',
                ],
            }
        });
    },

    addNew: function (data) {
        if ($("#addGroupPopup").length == 0) {

            $("<div />").attr("id", "addGroupPopup").appendTo("body")
        }
        let div = $("#addGroupPopup");

        let valGroup = 'CreateGroup';
        const addGroupPopup = div.dxPopup({
            contentTemplate: function (c) {

                c.append("<div id = 'add-group'></div>");
            },
            onShowing: function (e) {

                templateManager.getTemplete("group/create").then(x => {
                    let ctx = $('#add-group');
                    ctx.html(x);
                    $('#Id', ctx).val(data ? data.Id : 0);
                    $('#Name', ctx).dxTextBox({
                        name: 'Name',
                        label: "Group Name",
                        value: data ? data.Name : null
                    }).dxValidator({
                        validationGroup: valGroup,
                        validationRules: [{
                            type: "required",
                            message: 'Please enter group name'
                        }, {
                            type: 'async',
                            message: 'Group name already exists',
                            validationCallback(params) {
                                const d = $.Deferred();
                                $.ajax({
                                    type: "POST",
                                    url: "/group/validategroup",
                                    data: { groupName: params.value, Id: (data != null ? data.Id : 0) },
                                    success: function (res) {
                                        d.resolve(res);
                                    }
                                });
                                return d.promise();
                            },
                        }]
                    });


                    $('#createGroup', ctx).submitPopupForm({
                        url: "/group/savegroup",
                        method: 'POST',
                        submitBtn: $('#submitGroup').dxButton('instance'),
                        popup: addGroupPopup,
                        refreshGrid: $('#gridContainer').dxDataGrid('instance'),
                        validationGroup: valGroup
                        });

                })

            },
            width: 500,
            minHeight: 300,
            height: 'auto',
            showTitle: true,
            title: data ? 'Edit Group (' + data.Name + ')' : 'Create new group',
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
                        addGroupPopup.hide();
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
                        $('#createGroup').submit();
                    }
                },
            }],
        }).dxPopup('instance');
    }

}