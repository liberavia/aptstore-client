const Http = new XMLHttpRequest();
const url='http://localhost:8000/api/';
Http.open("GET", url);
Http.send();

Http.onreadystatechange = (e) => {
    if(Http.readyState === XMLHttpRequest.DONE) {
        MainPageData = JSON.parse(Http.responseText);
        console.log(MainPageData)
        Featured = MainPageData.featured
        console.log(Featured)
        Object.entries(Featured).forEach(([ident, app]) => {
            console.log(ident + ' - ' + app);
            var card = document.querySelector('#appcard');
            var card_title = card.content.querySelector('h5');
            var card_desc = card.content.querySelector('p');
            var card_image = card.content.querySelector('img');
            console.log('App name: ' +  app.name)
            card_title.textContent = app.name;
            card_desc.textContent = app.description;
            card_image.src = app.images.banner;

            var appcards = document.getElementById('appcards');
            var clone = document.importNode(card.content, true);
            appcards.appendChild(clone);
        })
    }
}
