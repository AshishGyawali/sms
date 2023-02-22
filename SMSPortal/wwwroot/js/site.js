function showErrorMessage(msg) {
    DevExpress.ui.notify({
        message: msg,
        width: 300,
        position: {
            my: 'right top',
            at: 'right top',
        },
    }, 'error', 3000);
}


function showSuccessMessage(msg) {
    DevExpress.ui.notify({
        message: msg,
        width: 300,
        position: {
            my: 'right top',
            at: 'right top',
        },
    }, 'success', 3000);
}

$.ajaxSetup({
    error: function (x, status, error) {
        if (x.status == 400) {
            if (x.responseJSON && x.responseJSON.Message) {
                showErrorMessage(x.responseJSON.Message);
            }
            else {
                showErrorMessage('Something went wrong');
            }
        }
        else {
           
        }
    }
});
