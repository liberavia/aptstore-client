// fetch appid for details page
var appid = getUrlParameter('id');
if (appid === undefined || isNaN(appid)) {
    // no valid id? send right back to home
    location.href = 'index.html'
}

// request api
const Http = new XMLHttpRequest();
const url='http://localhost:8000/api/app/' + appid.toString();
Http.open("GET", url);
Http.send();

// process api result
Http.onreadystatechange = (e) => {
    AppData = JSON.parse(Http.responseText);
    var app_title = document.querySelector('h1');
    var main_image = document.querySelector('#app_details_mainicon');
    var usk = document.querySelector('#usk')
    if (AppData.required_age_usk == 99) {
        usk.remove();
    } else {
        var usk_base_url = "https://usk.de/wp-content/themes/neve-child/images/Assets/Icon/USK/%age%j.png"
        var usk_image_url = usk_base_url.replace('%age%', AppData.required_age_usk)
        usk.src = usk_image_url
    }
    main_image.src = AppData.image_details;
    app_title.textContent = AppData.name;

}

