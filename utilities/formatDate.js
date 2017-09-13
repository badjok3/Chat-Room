module.exports = {
    formatDate: function(inputDate){

        let day = inputDate.getDate();
        if (day < 10)
            day = '0' + day;
        let month = inputDate.getMonth()+1;
        if (month < 10)
            month = '0' + month;
        let year = inputDate.getFullYear();

        return '' + day + '.' + month + '.' + year;
    }
};
