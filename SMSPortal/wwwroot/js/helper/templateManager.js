let templateManager = {
    getTemplete: function (name) {
        return $.get("/template/" + name + ".html");
    }
};