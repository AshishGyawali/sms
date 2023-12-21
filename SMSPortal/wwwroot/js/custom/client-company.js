let client = {
    init: function () {
        var companyLogo, companyName, companySlogan, typeOfBusiness;

        $.ajax({
            type: "POST",
            url: "/home/getclientcompanydetails",
            success: function (data) {
                $(".company-slogan").text(data.CompanySlogan);
                companyLogo = data.CompanyLogo;
                companyName = data.CompanyName;
                companySlogan = data.CompanySlogan;
                typeOfBusiness = data.TypeOfBusiness;
            }
        });
        console.log(companyLogo, companySlogan);
    },

}