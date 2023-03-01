let templateManager = {
    getTemplete: function (name) {
        return $.ajax({
            cache: false,
            url: "/template/" + name + ".html"
        });
    }
};