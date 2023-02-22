let appStore = {
    get: function (name) {
        return new DevExpress.data.DataSource({
            store: new DevExpress.data.CustomStore({
                key: "Id",
                load: function (loadOptions) {
                    const d = $.Deferred();
                    $.ajax({
                        type: "POST",
                        url: "/datastore/getdata",
                        data: { searchKey: loadOptions.searchValue, take: loadOptions.take, skip: loadOptions.skip,name: name },
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
                        data: { id: key},
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