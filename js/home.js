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
            card_title.textContent = app.name;
            card_desc.textContent = app.description;
            card_image.src = app.images.banner;

            var appcards = document.getElementById('appcards');
            var clone = document.importNode(card.content, true);
            appcards.appendChild(clone);
        })

        Teaser = MainPageData.teaser
        var counter=0;
        Object.entries(Teaser).forEach(([ident, app]) => {
            console.log(ident + ' - ' + app);
            var slide = document.querySelector('#carousel-slide');
            var slide_image = slide.content.querySelector('img');
            var slide_div = slide.content.querySelector('div');

            slide_image.src = app.images.banner;
            if (counter == 0) {
                slide_div.setAttribute('class', 'carousel-item active');
            } else {
                slide_div.setAttribute('class', 'carousel-item');
            }

            var carousel_slides = document.getElementById('carousel-slides');
            var clone = document.importNode(slide.content, true);
            carousel_slides.appendChild(clone);
            counter++;
        })
    }
}
