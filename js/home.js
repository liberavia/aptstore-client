$("#template_appcard").load("templates/appcard.html");
$("#template_carousel_button").load("templates/carousel_button.html");
$("#template_carousel_element").load("templates/carousel_element.html");

const Http = new XMLHttpRequest();
const url='http://localhost:8000/api/';
Http.open("GET", url);
Http.send();

Http.onreadystatechange = (e) => {
    if(Http.readyState === XMLHttpRequest.DONE) {
        MainPageData = JSON.parse(Http.responseText);

        Featured = MainPageData.featured
        Object.entries(Featured).forEach(([ident, app]) => {
            console.log(ident + ' - ' + app);
            var card = document.querySelector('#appcard');
            var card_title = card.content.querySelector('h5');
            var card_desc = card.content.querySelector('p');
            var card_image = card.content.querySelector('img');
            var card_urls = card.content.querySelectorAll('a');
            card_urls[0].href = "index.html?page=details&ident=" + ident;
            card_urls[1].href = "index.html?page=details&ident=" + ident;
            card_title.textContent = app.name;
            card_desc.textContent = app.description;
            card_image.src = app.image_thumb;

            var appcards = document.getElementById('appcards');
            var clone = document.importNode(card.content, true);
            appcards.appendChild(clone);
        })

        Teaser = MainPageData.teaser
        var counter=0;
        Object.entries(Teaser).forEach(([ident, app]) => {
            console.log(ident + ' - ' + app);
            var button_tpl = document.querySelector('#carousel-button');
            var button_nav = button_tpl.content.querySelector('button');

            var slide_tpl = document.querySelector('#carousel-element');
            var slide_item = slide_tpl.content.querySelector('.carousel-item');
            var slide_image = slide_tpl.content.querySelector('img');
            var slide_caption = slide_tpl.content.querySelector('h5');

            slide_image.src = app.image_banner;
            slide_caption.textContent = app.name;
            button_nav.setAttribute('data-bs-slide-to', counter);
            slide_item.setAttribute('class', 'carousel-item');
            if (counter == 0) {
                slide_item.setAttribute('class', 'carousel-item active');
                button_nav.setAttribute('aria-current', 'true');
            }

            var carousel_elements = document.querySelector('#carousel-elements');
            var carousel_navigation = document.querySelector('#carousel-navigation');
            var clone_element = document.importNode(slide_tpl.content, true);
            var clone_nav = document.importNode(button_tpl.content, true);
            carousel_elements.appendChild(clone_element);
            carousel_navigation.appendChild(clone_nav);

            counter++;
        })
        $('#carouselTeaser').carousel();
    }
}


