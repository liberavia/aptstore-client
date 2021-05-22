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
    var app_description = document.querySelector('#description')
    var app_reviews = document.querySelector('#reviews')
    var app_categories = document.querySelector('#categories')

    main_image.src = AppData.image_details;
    app_title.textContent = AppData.name;
    app_description.textContent = AppData.description_long

    if (AppData.required_age_usk == 99) {
        usk.remove();
    } else {
        var usk_base_url = "https://usk.de/wp-content/themes/neve-child/images/Assets/Icon/USK/%age%j.png"
        var usk_image_url = usk_base_url.replace('%age%', AppData.required_age_usk)
        usk.src = usk_image_url
    }

    Categories = AppData.categories
    console.log('before')
    console.log(Categories.length)
    console.log('end')
    Object.entries(Categories).forEach((category) => {
        console.log(category)
        category = category[1]
        console.log(category)
        if (category != undefined) {
            span = document.createElement('span')
            span.classList.add('badge')
            span.classList.add('rounded-pill')
            span.classList.add('bg-primary')
            node = document.createTextNode(category);
            span.appendChild(node);
            categories.appendChild(span)
        }
    })




}

