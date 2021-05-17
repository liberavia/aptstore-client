$(function() {
    $("#includedNavigation").load("layout/navigation.html");
    var page = getUrlParameter('page');
    if (page) {
        $("#includedContent").load("pages/" + page + ".html");
    } else {
        $("#includedContent").load("pages/home.html");
    }
});
