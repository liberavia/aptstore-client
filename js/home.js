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
            card_image.src = app.images.banner;

            var appcards = document.getElementById('appcards');
            var clone = document.importNode(card.content, true);
            appcards.appendChild(clone);
        })

        Teaser = MainPageData.teaser
        var counter=0;
        Object.entries(Teaser).forEach(([ident, app]) => {
            console.log(ident + ' - ' + app);
            var slides = document.querySelectorAll('.carousel-item');
            console.log(slides)
            var slide = slides[counter]
            console.log(slide)
            var slide_image = slide.querySelector('img');
            console.log(slide_image)
            var slide_caption = slide.querySelector('h5');
            console.log(slide_caption)

            slide_image.src = app.images.banner;
            slide_caption.textContent = app.name;
            if (counter == 0) {
                slide.setAttribute('class', 'carousel-item active');
            } else {
                slide.setAttribute('class', 'carousel-item');
            }
            counter++;
        })
        $('#carouselTeaser').carousel();
    }
}


