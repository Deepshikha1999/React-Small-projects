import catbg from "../assets/photocards/catbg.png";
import cat from "../assets/photocards/cat2.png";
import sb from "../assets/photocards/strawberry.png";
import flower from "../assets/photocards/flower.png";
import stars from "../assets/photocards/stars.png";
import icecream from "../assets/photocards/icecream.png";
import sandwich from "../assets/photocards/sandwich.png";
import swimming_pool from "../assets/photocards/swimming_pool.png";
import fish from "../assets/photocards/fish.png";
import leaf from "../assets/photocards/leaf.png";
import flower2 from "../assets/photocards/flower2.png";
import flower3 from "../assets/photocards/flower3.png";
import candies from "../assets/photocards/candies.png";
import bricks from "../assets/photocards/bricks.png";
import scribble from "../assets/photocards/scribble.png";
import fox from "../assets/photocards/fox.png";
import coin from "../assets/photocards/coin.png";
import sun from "../assets/photocards/sun.png";
import owl from "../assets/photocards/owl.png";
import apples from "../assets/photocards/apples.png";


const CARDS = {
    catbg: {
        "url": catbg,
        "date": () => newDate()
    },
    cat: {
        "url": cat,
        "date": () => newDate()
    },
    sb: {
        "url": sb,
        "date": () => newDate()
    },
    flower: {
        "url": flower,
        "date": () => newDate()
    },
    stars: {
        "url": stars,
        "date": () => newDate()
    },
    icecream: {
        "url": icecream,
        "date": () => newDate()
    },
    sandwich: {
        "url": sandwich,
        "date": () => newDate()
    },
    swimming_pool: {
        "url": swimming_pool,
        "date": () => newDate()
    },
    fish: {
        "url": fish,
        "date": () => newDate()
    },
    leaf: {
        "url": leaf,
        "date": () => newDate()
    },
    flower2: {
        "url": flower2,
        "date": () => newDate()
    },
    flower3: {
        "url": flower3,
        "date": () => newDate()
    },
    candies: {
        "url": candies,
        "date": () => newDate()
    },
    bricks: {
        "url": bricks,
        "date": () => newDate()
    },
    scribble: {
        "url": scribble,
        "date": () => newDate()
    },
    fox: {
        "url": fox,
        "date": () => newDate()
    },
    coin: {
        "url": coin,
        "date": () => newDate()
    },
    sun: {
        "url": sun,
        "date": () => newDate()
    },
    owl: {
        "url": owl,
        "date": () => newDate()
    },
    apples: {
        "url": apples,
        "date": () => newDate()
    },
    blank: {
        "url": null,
        "date": () => newDate()
    },

}

export default CARDS;