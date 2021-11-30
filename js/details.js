// add templates
$("#template_carousel_button").load("templates/carousel_button.html");
$("#template_carousel_element").load("templates/carousel_element_details.html");


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
    if (Http.readyState == 4 && Http.status == 200) {
        if (Http.responseText)  {
            AppData = JSON.parse(Http.responseText);
            var app_title = document.querySelector('h1');
            var main_image = document.querySelector('#app_details_mainicon');
            var usk = document.querySelector('#usk')
            var app_description = document.querySelector('#description')
            var app_reviews = document.querySelector('#reviews')
            var app_categories = document.querySelector('#categories')
            var app_platform = document.querySelector('#platform')

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
            Object.entries(Categories).forEach((category) => {
                category = category[1]
                if (category != undefined) {
                    span = document.createElement('span')
                    span.classList.add('badge')
                    span.classList.add('rounded-pill')
                    span.classList.add('bg-primary')
                    node = document.createTextNode(category);
                    span.appendChild(node);
                    app_categories.appendChild(span)
                }
            })

            Platforms = AppData.platforms
            Object.entries(Platforms).forEach((platform) => {
                platform = platform[1]
                if (platform != undefined) {
                    option = document.createElement('option')
                    node = document.createTextNode(platform);
                    option.appendChild(node);
                    app_platform.appendChild(option)
                }
            })

            Screenshots = AppData.screenshots
            var counter=0;
            Object.entries(Screenshots).forEach((screen) => {
                screen = screen[1]
                console.log(screen)
                var button_tpl = document.querySelector('#carousel-button');
                var button_nav = button_tpl.content.querySelector('button');
                var slide_tpl = document.querySelector('#carousel-element');
                var slide_item = slide_tpl.content.querySelector('.carousel-item');

                button_nav.setAttribute('data-bs-slide-to', counter);
                button_nav.setAttribute('data-bs-target', '#carouselScreenshots');
                slide_item.setAttribute('class', 'carousel-item');
                if (counter == 0) {
                    slide_item.setAttribute('class', 'carousel-item active');
                    button_nav.setAttribute('aria-current', 'true');
                }

                var image_loaded = false;
                var canvas_element = slide_tpl.content.querySelector('canvas');
                var canvas_ident = 'canvas_' + counter.toString()
                canvas_element.setAttribute('id', canvas_ident)
                canvas = slide_tpl.content.querySelector('#' + canvas_ident)
                var image = new Image();
                image.onload = function () {
                    console.log('Image loaded!')
                    var canvasContext = canvas.getContext('2d');
                    var wrh = image.width / image.height;
                    var newWidth = canvas.width;
                    var newHeight = newWidth / wrh;
                    if (newHeight > canvas.height) {
                                newHeight = canvas.height;
                        newWidth = newHeight * wrh;
                    }
                    var xOffset = newWidth < canvas.width ? ((canvas.width - newWidth) / 2) : 0;
                    var yOffset = newHeight < canvas.height ? ((canvas.height - newHeight) / 2) : 0;
                    console.log(image)
                    console.log(xOffset)
                    console.log(yOffset)
                    console.log(newWidth)
                    console.log(newHeight)
                    canvasContext.drawImage(image, xOffset, yOffset, newWidth, newHeight);
                    image_loaded = true;
                };
                image.src = screen.image;

                var carousel_elements = document.querySelector('#carousel-elements');
                var carousel_navigation = document.querySelector('#carousel-navigation');
                var clone_element = document.importNode(slide_tpl.content, true);
                console.log('Append Screenshot!')
                var clone_nav = document.importNode(button_tpl.content, true);
                carousel_elements.appendChild(clone_element);
                carousel_navigation.appendChild(clone_nav);

                counter++;
            })
            $('#carouselScreenshots').carousel();
            if (Screenshots.length == 0) {
                $('#carouselScreenshots').remove()
            }

        }
    }


}