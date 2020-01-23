// ==UserScript==
// @name         OLX
// @namespace    https://www.olx.ro/
// @version      0.1.5
// @description  Hide unwanted ads
// @author       Eros Nicolau
// @match        https://www.olx.ro/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict'
    console.clear()
    let ls = window.localStorage

    // Add the hide icons to the listing ads
    let cadAds = document.querySelectorAll('tr.wrap')
    cadAds.length > 0 && [...cadAds].map(e => {
        let el = e.querySelectorAll('table'),
            id = e.querySelector('table').getAttribute('data-id'),
            filter = [...el].map(e => {
                console.log(e, id)
                addMonkey(e, id)
            })
        if (e.querySelectorAll('.autovitro_label').length ==1) {
            let currentCars = JSON.parse(ls.getItem("Hidden Cars")) || [];
            !currentCars.includes(id) && ls.setItem("Hidden Cars", JSON.stringify([id, ...currentCars]))
        }
    })

    // Check to see if you're on a car page; If so, then add the hide icon to the Details box
    try { if (criteoEvents.product.events.viewItem.item) addMonkey(document.querySelector('.offer-sidebar'), criteoEvents.product.events.viewItem.item) } catch (e){}

    // Look into localStorage and hide all the cars that match the hidden cars list
    let currentCars = JSON.parse(ls.getItem("Hidden Cars")) || [];
    if (currentCars.length > 0) {
        currentCars.map(c => {
            let cars = document.querySelectorAll('[data-hiddenid="'+c+'"]')
            if(cars.length > 0){
                [...cars].map(car => toggleCar(car, [...car.classList].includes('hiddenButton')))
            }
        })
    }

    function addMonkey(e, id){
        let tlink = document.createElement('a'),
            link = e.parentNode.insertBefore(tlink, e);
        link.setAttribute('href','#')
        link.setAttribute('data-hiddenid', id);
        link.classList.add('hideMe')
        link.innerText = '🙈'
        link.addEventListener("click", function(el){
            el.preventDefault()
            let that = el.target
            toggleCar(that, [...that.classList].includes('hiddenButton'))
        }, false);
    }

    function toggleCar(el, hidden){
        let id = el.getAttribute('data-hiddenid')
        let currentCars = JSON.parse(ls.getItem("Hidden Cars")) || [];
        if(hidden == true) {
            el.nextSibling.classList.remove("hiddenAd")
            el.classList.remove('hiddenButton')
            ls.setItem("Hidden Cars", JSON.stringify(currentCars.filter(e => e != id)))
        } else {
            el.nextSibling.classList.add("hiddenAd")
            el.classList.add("hiddenButton")
            !currentCars.includes(id) && ls.setItem("Hidden Cars", JSON.stringify([id, ...currentCars]))
        }
    }

    // Add custom CSS
    var head = document.head || document.getElementsByTagName("head")[0],
        style = document.createElement("style"),
        customCSS = ''
    head.appendChild(style)
    style.type = "text/css"
    customCSS += ".hideMe {font-size: 18px; cursor: pointer; z-index: 6; position: absolute; right: -11px; top: 5px;}"
    customCSS += ".hideMe:hover {opacity: .5}"
    customCSS += ".adcontainer-tr, .a, .rightBranding, [id^=Crt], #bnr {display: none !important}"
    customCSS += ".hiddenAd:not(:hover) {height: 25px; min-height: unset !important; overflow: hidden; opacity: 0.15; display: block;}"
    customCSS += ".hiddenAd:not(:hover) td {display: block}"
    customCSS += ".hiddenAd:not(:hover) .tags, .hiddenAd:not(:hover) .autovitro_label {display: none;}"
    customCSS += ".hiddenAd:not(:hover) td {display: block; float: left;}"
    customCSS += ".hiddenAd:not(:hover) .td-price {position: absolute; right: 20px; padding: 0 !important; transform: translateY(-5px);}"
    customCSS += ".hiddenAd:not(:hover) .title-cell {padding: 0 !important; transform: translateY(-5px);}"
    customCSS += ".hiddenAd:not(:hover) .title-cell h3 {font-size: 16px !important}"
    customCSS += ".hiddenAd:not(:hover) .thumb {line-height: 0 !important; text-align: left}"
    customCSS += ".hiddenAd:not(:hover) .thumb img {max-height: 25px !important}"
    customCSS += ".hiddenAd h3 a:hover, .hiddenAd h3 a:visited:hover, .hiddenAd h3 a:hover>*, .hiddenAd h3 a:visited:hover>* {color: #0098d0 !important; background: none !important}"
    customCSS += ".hiddenButton {opacity: 0.15}"
    customCSS += ".price {font-size: 16px !important}"
    customCSS += ".price + span {display: none}"
    customCSS += "listHandler table.offers.redesigned .space h3 a,table.offers.redesigned .space h3 a,table.offers.redesigned.userobserved-list .space h3 a {transition: none !important;}"
    customCSS += ".offer-wrapper {position: relative}"
    if (style.styleSheet) style.styleSheet.cssText = customCSS
    else style.appendChild(document.createTextNode(customCSS))

})();
