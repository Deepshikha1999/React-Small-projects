import map from "../assets/AdventureKit/village.jpg";
import grandma from "../assets/AdventureKit/old-woman_6740290.png";
import explorer from "../assets/AdventureKit/traveler_10529825.png";
import golden_lotus_symbol from "../assets/AdventureKit/lotus_16830882.png";
import scroll_paper from "../assets/AdventureKit/black-piece-paper.png";
import adventureMap from "../assets/AdventureKit/map.png";
import key from "../assets/AdventureKit/key_4251744.png";
import stone from "../assets/AdventureKit/nature_14923780.png";
import elf from "../assets/AdventureKit/girl_3752776.png";
import cake from "../assets/AdventureKit/lasagna_1816311.png";
import gate from "../assets/AdventureKit/gate_3308301.png";
import nectar from "../assets/AdventureKit/beehive_13922550.png";
import cave from "../assets/AdventureKit/cave_1566543.png";
import bat from "../assets/AdventureKit/bat_8713638.png";
import letter from "../assets/AdventureKit/envelope_1872536.png";
import blueHouse from "../assets/AdventureKit/castle_4244700.png";
import diamond from "../assets/AdventureKit/diamond_7408575.png";
import streetLight from "../assets/AdventureKit/street-light_355722.png";
import witch from "../assets/AdventureKit/witch_18116951.png";
import magicPot from "../assets/AdventureKit/cauldron_5432162.png";
import iris from "../assets/AdventureKit/iris_3200079.png";
import python_egg from "../assets/AdventureKit/egg_1566468.png";
import forest from "../assets/AdventureKit/forest_2913520.png";
import snake from "../assets/AdventureKit/anaconda_3196011.png";
import lotus from "../assets/AdventureKit/water-lily_2159635.png";
import pink_lotus from "../assets/AdventureKit/lotus_3280261.png";
import pond from "../assets/AdventureKit/pond_10873835.png";

const questMap = {
    "Intro": {
        name: "Intro Page",
        coords: { x: 0, y: 0 },
        message: "In the village, the explorer’s grandmother has fallen ill with a mysterious fading sickness. The village elder reveals that only the Golden Lotus, which grows in the sacred blue waters at the edge of the world, can restore her strength. But the path is long, and the land is protected by ancient magic.Now you as an explorer needs to help your grandmother to get the golden lotus to cure her illness...",
        hint: "To Start The Page, Enter Start",
        action: "Riddle",
        key: "MAP",
        check: (password) => {
            return password.toUpperCase() == "START"
        },
        imagesUrl: {
            map: map,
            grandma: grandma,
            explorer: explorer,
            golden_lotus: golden_lotus_symbol,
            scroll_paper: scroll_paper
        },
        drawPages: (ctx, width, height, page, imagesRef) => {
            ctx.fillStyle = "#EB5D50";
            ctx.fillRect(0, 0, width, height);

            const mapImg = imagesRef.current["map"];
            const grandmaImg = imagesRef.current["grandma"];
            const explorerImg = imagesRef.current["explorer"];
            const goldenLotusSymbolImg = imagesRef.current["golden_lotus"];
            const scroll_paperImg = imagesRef.current["scroll_paper"];

            // Check if image exists AND is not broken
            let checkImgCanBeLoaded = [mapImg, grandmaImg, explorerImg, goldenLotusSymbolImg, scroll_paperImg].every(img => img && img.complete && img.naturalWidth !== 0);

            if (!checkImgCanBeLoaded) {
                ctx.fillStyle = "white";
                ctx.fillText("Image failed to load: map", 20, 20);
                console.error("Canvas skipped drawing 'map' because the image is broken.");
                return;
            }

            let sx = 0;
            let sy = 0;
            let imgWidth = mapImg.width;
            let imgHeight = mapImg.height;
            ctx.drawImage(mapImg, sx, sy, imgWidth, imgHeight, 0, 0, width, height);

            let x = width / 4;
            let y = height / 4;
            let w = width / 2;
            let h = height / 2;

            ctx.drawImage(scroll_paperImg, 0, 0, width, height);
            ctx.globalAlpha = 0.5;
            ctx.drawImage(goldenLotusSymbolImg, width / 2 - height / 8, height / 2 - height / 8, height / 4, height / 4);
            ctx.globalAlpha = 1;
            let font = Math.floor(height / 20)
            ctx.font = `${font}px "Irish Grover", system-ui`;
            ctx.textBaseline = "top";

            ctx.fillStyle = "black";


            let words = page.message.split(" ")
            let line = "";
            for (let i = 0; i < words.length; i++) {
                let testLine = line + words[i] + " ";
                let metrics = ctx.measureText(testLine).width;

                if (metrics > w && i > 0) {
                    ctx.fillText(line, x, y);
                    line = words[i] + " ";
                    y += font;
                } else {
                    line = testLine;
                }
            }

            ctx.fillText(line, x, y);

            ctx.fillStyle = "#EB5D50";

            x = width / 4;
            y = height / 4;

            ctx.beginPath();
            ctx.arc(width / 16, height - height / 8, Math.max(width / 8, height / 4), 0, Math.PI * 2);
            ctx.fill();

            ctx.drawImage(grandmaImg, 0, height - y, width / 8, height / 4);

            ctx.beginPath();
            ctx.arc(width - width / 16, height - height / 8, Math.max(width / 8, height / 4), 0, Math.PI * 2);
            ctx.fill();

            ctx.drawImage(explorerImg, width - width / 8, height - y, width / 8, height / 4);
        }
    },
    "Map": {
        name: "Map",
        coords: { x: 0, y: 0 },
        message: "",
        hint: "To get the Key , Enter the thing you see as password",
        action: "Riddle",
        key: "KEY",
        check: (password) => {
            return password.toUpperCase() == "MAP"
        },
        imagesUrl: {
            map: adventureMap,
            key: key
        },
        drawPages: (ctx, width, height, page, imagesRef) => {
            ctx.fillStyle = "#03A678";
            ctx.fillRect(0, 0, width, height);

            const mapImg = imagesRef.current["map"];
            const keyImg = imagesRef.current["key"];

            // Check if image exists AND is not broken
            let checkImgCanBeLoaded = [mapImg, keyImg].every(img => img && img.complete && img.naturalWidth !== 0);

            if (!checkImgCanBeLoaded) {
                ctx.fillStyle = "white";
                ctx.fillText("Image failed to load: map", 20, 20);
                console.error("Canvas skipped drawing 'map' because the image is broken.");
                return;
            }

            let w = 1.5 * width * (32 / 77);
            let h = 1.5 * height * (45 / 77);
            let x = 0;
            let y = height / 2 - h / 2;

            ctx.drawImage(mapImg, x, y, w, h);

            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fillRect(x + w, y, width - w, h)
            // ctx.drawImage(keyImg, x + w, y, width - w, h);
            let font = Math.floor(h / 8);
            ctx.font = `${font}px "Irish Grover", system-ui`;
            ctx.textBaseline = "top";
            ctx.textAlign = "center";

            ctx.fillStyle = "rgba(0,0,0,0.7)";
            ctx.fillRect(x + w, y, width - w, h / 3)

            ctx.fillStyle = "rgba(255,255,255,1)";
            let l = ctx.measureText("inventory").width;
            ctx.fillText("inventory", 3 * (x + w) / 2 - l / 2, y + h / 6);

            ctx.fillStyle = "rgba(0,0,0,0.5)";
            let x_b = (width - w) / 4;
            let y_b = y + h / 3;
            for (let i = 1; i <= 2; i++) {
                let y1 = y_b + (i - 1) * (h / 3);
                for (let j = 1; j <= 4; j++) {
                    let x1 = (x + w) + x_b * (j - 1);
                    ctx.fillRect(x1 + 10, y1 + 10, x_b - 20, h / 3 - 20);
                }
            }

            let m = Math.min(x_b - 30, h / 3 - 30);
            ctx.drawImage(keyImg, x + w + 15, y_b + 15, m, m);
        }
    },
    "Start": {
        name: "The Backyard Gate",
        coords: { x: 0, y: 0 },
        message: " The Stone Sentinel waits where the tall trees wake. \n He holds the key you seek, but refuses the silver you take. \n Feed his hunger with the garden's brightest prize, \n Hidden in a frosted coat, a treat for elven eyes.",
        hint: "how will you open the backyard?",
        action: "Riddle",
        key: "CARROT CAKE",
        check: (password) => {
            return password.toUpperCase() == "KEY"
        },
        imagesUrl: {
            key: key,
            gate: gate,
            cake: cake
        },
        drawPages: (ctx, width, height, page, imagesRef) => {
            ctx.fillStyle = "#03A678";
            ctx.fillRect(0, 0, width, height);

            const stoneImg = imagesRef.current["gate"];
            const keyImg = imagesRef.current["key"];
            const cakeImg = imagesRef.current["cake"];

            // Check if image exists AND is not broken
            let checkImgCanBeLoaded = [stoneImg, keyImg, cakeImg].every(img => img && img.complete && img.naturalWidth !== 0);

            if (!checkImgCanBeLoaded) {
                ctx.fillStyle = "white";
                ctx.fillText("Image failed to load: map", 20, 20);
                console.error("Canvas skipped drawing 'map' because the image is broken.");
                return;
            }
            ctx.fillStyle = "#03318C";
            ctx.fillRect(0, 0, width, height / 2);

            let x = 0;
            let y = 0;
            let w = (3 * width / 4) / 10;
            let h = (height / 2) / 4;

            ctx.fillStyle = "#0476D9";
            for (let i = 0; i < 15; i++) {
                for (let j = 0; j < 4; j++)
                    if (i % 2 == 0 && j % 2 == 0) {
                        ctx.roundRect(x + i * w, y + j * h, w, h, 10);
                        ctx.fill();
                    }
            }
            let font = Math.floor(height / 8);
            ctx.font = `${font}px "Irish Grover", system-ui`;
            ctx.textBaseline = "top";
            ctx.textAlign = "left";
            ctx.fillStyle = "white";
            ctx.fillText(page.name, x + w, y + h);

            ctx.drawImage(stoneImg, 3 * width / 4, h, width / 4, 3 * h);

            ctx.fillStyle = "black";
            font = Math.floor(height / 16);
            ctx.font = `${font}px "Irish Grover", system-ui`;
            ctx.textBaseline = "top";
            // ctx.textAlign = "left";
            let lines = page.message.split("\n");

            let x1 = 20;
            let y1 = height / 2 + 40;
            let maxWidth = width - 40;
            lines.forEach((line, i) => {
                ctx.fillText(line, x1, y1)
                y1 += font;
            })

            ctx.fillText(page.key + ">>", x1, y1 + font);
            ctx.drawImage(cakeImg, x1 + ctx.measureText(page.key + ">>").width + 10, y1 + font / 2, 1.5 * font, 1.5 * font);
        }
    },
    "Key_1": {
        name: "The Elf & Rock",
        message: `"The Elf nibbles a crumb and whispers: 'The cake is the key, but the tongue of the forest is Math. \nTake the name of my favorite treat: CARROT CAKE. \nFor every letter, find its third successor in the alphabet. \nSum the values of those new spirits ($A=1, B=2...$). \nFinally, seek the nearest multiple of 7 that is greater than 125.'"`,
        hint: "Answer is the number",
        action: "Riddle",
        key: (k) => {
            return k;
        },
        check: (password) => {
            password = parseInt(password);
            if (password > 125 && password % 7 == 0)
                return true;

            else
                return false;
        },
        imagesUrl: {
            key: key,
            stone: stone,
            elf: elf,
            cake: cake,
            nectar: nectar
        },
        drawPages: (ctx, width, height, page, imagesRef, randomWord) => {
            ctx.fillStyle = "#03A678";
            ctx.fillRect(0, 0, width, height);

            const stoneImg = imagesRef.current["stone"];
            const keyImg = imagesRef.current["key"];
            const cakeImg = imagesRef.current["cake"];
            const elfImg = imagesRef.current["elf"];
            const nectar = imagesRef.current["nectar"];

            // Check if image exists AND is not broken
            let checkImgCanBeLoaded = [stoneImg, keyImg, cakeImg, elfImg, nectar].every(img => img && img.complete && img.naturalWidth !== 0);

            if (!checkImgCanBeLoaded) {
                ctx.fillStyle = "white";
                ctx.fillText("Image failed to load: map", 20, 20);
                console.error("Canvas skipped drawing 'map' because the image is broken.");
                return;
            }

            let x = 0;
            let y = 0;
            let w = (3 * width / 4) / 10;
            let h = (height / 2) / 4;

            ctx.fillStyle = "rgba(0,0,0,0.7)";
            ctx.fillRect(0, height / 2, width, height / 2);

            ctx.drawImage(stoneImg, (3 * width / 4), h, width / 4, 3 * h);
            ctx.drawImage(elfImg, (3 * width / 4) - w, height / 2 - 100, 100, 100);
            ctx.drawImage(cakeImg, (3 * width / 4), height / 2 - 50, 50, 50);

            let font = Math.floor(height / 8);
            ctx.font = `${font}px "Irish Grover", system-ui`;
            ctx.textBaseline = "top";
            ctx.textAlign = "left";
            ctx.fillStyle = "white";
            ctx.fillText(page.name, x + w, y + h);

            font = Math.floor(height / 22);
            ctx.font = `${font}px "Irish Grover", system-ui`;
            ctx.textBaseline = "top";
            // ctx.textAlign = "left";
            let lines = page.message.split("\n");

            let x1 = 20;
            let y1 = height / 2 + 40;
            let maxWidth = width - 40;
            lines.forEach((line, i) => {
                ctx.fillText(line, x1, y1)
                y1 += font;
            })

            if (randomWord) {
                let w = page.key(randomWord);
                ctx.fillText(w + ">>", x1, y1 + font);
                ctx.drawImage(nectar, x1 + ctx.measureText(w + ">>").width, y1 + font / 2, 1.5 * font, 1.5 * font);
            }

        }
    },
    "Key_2": {
        name: "Magical Cave & Bat",
        message: " I hang upside down in a coat of velvet fur,\n Speak my five-letter name to make the air stir.\n Not a bird, not a bug, but a shadow with wings,\n The cave only opens when the right name rings.",
        hint: "Check the hidden inspect or remember the previous word you read",
        action: "Riddle",
        key: "letter",
        check: (password, guessWord) => {
            return password.toUpperCase() == guessWord.toUpperCase();
        },
        imagesUrl: {
            key: key,
            cake: cake,
            nectar: nectar,
            cave: cave,
            bat: bat,
            letter: letter
        },
        drawPages: (ctx, width, height, page, imagesRef) => {
            ctx.fillStyle = "#03A678";
            ctx.fillRect(0, 0, width, height);

            const caveImg = imagesRef.current["cave"];
            const keyImg = imagesRef.current["key"];
            const cakeImg = imagesRef.current["cake"];
            const batImg = imagesRef.current["bat"];
            const nectar = imagesRef.current["nectar"];
            const letter = imagesRef.current["letter"];

            // Check if image exists AND is not broken
            let checkImgCanBeLoaded = [caveImg, keyImg, cakeImg, batImg, nectar, letter].every(img => img && img.complete && img.naturalWidth !== 0);

            if (!checkImgCanBeLoaded) {
                ctx.fillStyle = "white";
                ctx.fillText("Image failed to load: map", 20, 20);
                console.error("Canvas skipped drawing 'map' because the image is broken.");
                return;
            }

            let x = 0;
            let y = 0;
            let w = (3 * width / 4) / 10;
            let h = (height / 2) / 4;

            ctx.fillStyle = "rgba(0,0,0,0.7)";
            ctx.fillRect(0, height / 2, width, height / 2);

            ctx.drawImage(caveImg, width / 2, y, width / 2, 1.5 * height / 2);
            ctx.drawImage(nectar, (3 * width / 4), height / 2 - 50, 100, 100);
            ctx.drawImage(batImg, (3 * width / 4), height / 2 - 50, 50, 50);

            let font = Math.floor(height / 8);
            ctx.font = `${font}px "Irish Grover", system-ui`;
            ctx.textBaseline = "top";
            ctx.textAlign = "left";
            ctx.fillStyle = "white";
            ctx.fillText(page.name, x + w, y + h);

            font = Math.floor(height / 22);
            ctx.font = `${font}px "Irish Grover", system-ui`;
            ctx.textBaseline = "top";
            // ctx.textAlign = "left";
            let lines = page.message.split("\n");

            let x1 = 20;
            let y1 = height / 2 + 100;
            let maxWidth = width - 40;
            lines.forEach((line, i) => {
                ctx.fillText(line, x1, y1)
                y1 += font;
            })

            ctx.fillText(page.key + ">>", x1, y1 + font);
            ctx.drawImage(letter, x1 + ctx.measureText(page.key + ">>").width, y1 + font / 2, 1.5 * font, 1.5 * font);
        }
    },
    "Key_3": {
        name: "The Blue House",
        message: " A house pin of 5 digit where first 3 digit are of no same digit or consecutive to each other ,\n sum of all its digit is 36 and last 3 digit is a multiple of 3.",
        hint: "5 digit number",
        action: "Riddle",
        key: "diamond",
        check: (password) => {
            if (password.length !== 5 || !/^\d+$/.test(password)) return false;

            const digits = password.split('').map(Number);
            const [a, b, c, d, e] = digits;
            // 1. First 3 unique and non-consecutive
            const firstThreeUnique = (a !== b && b !== c && a !== c);
            const nonConsecutive = Math.abs(a - b) !== 1 && Math.abs(b - c) !== 1 && Math.abs(a - c) !== 1;

            // 2. Sum is 36
            const totalSum = digits.reduce((sum, d) => sum + d, 0) === 36;

            // 3. Last 3 multiple of 3
            const lastThreeVal = parseInt(password.substring(2, 5));
            const multipleOfThree = lastThreeVal % 3 === 0;

            return firstThreeUnique && nonConsecutive && totalSum && multipleOfThree;

        },
        imagesUrl: {
            key: key,
            cake: cake,
            nectar: nectar,
            letter: letter,
            blueHouse: blueHouse,
            diamond: diamond,
            street_light: streetLight

        },
        drawPages: (ctx, width, height, page, imagesRef) => {
            ctx.fillStyle = "#94D7F2";
            ctx.fillRect(0, 0, width, height);

            const blueHouseImg = imagesRef.current["blueHouse"];
            const keyImg = imagesRef.current["key"];
            const cakeImg = imagesRef.current["cake"];
            const diamond = imagesRef.current["diamond"];
            const nectar = imagesRef.current["nectar"];
            const letter = imagesRef.current["letter"];
            const street_light = imagesRef.current["street_light"];

            // Check if image exists AND is not broken
            let checkImgCanBeLoaded = [blueHouseImg, keyImg, cakeImg, diamond, nectar, letter, street_light].every(img => img && img.complete && img.naturalWidth !== 0);

            if (!checkImgCanBeLoaded) {
                ctx.fillStyle = "white";
                ctx.fillText("Image failed to load: map", 20, 20);
                console.error("Canvas skipped drawing 'map' because the image is broken.");
                return;
            }

            let x = 0;
            let y = 0;
            let w = (3 * width / 4) / 10;
            let h = (height / 2) / 4;

            ctx.fillStyle = "rgba(0,0,0,0.7)";
            ctx.fillRect(0, height / 2, width, height / 2);

            ctx.drawImage(blueHouseImg, x, y + 25, width / 2, height);
            ctx.drawImage(street_light, x + width / 2, height / 2, width / 4, height / 2);
            // ctx.drawImage(batImg, (3 * width / 4), height / 2 - 50, 50, 50);

            let font = Math.floor(height / 8);
            ctx.font = `${font}px "Irish Grover", system-ui`;
            ctx.textBaseline = "top";
            ctx.textAlign = "left";
            ctx.fillStyle = "black";
            ctx.fillText(page.name, width - ctx.measureText(page.name).width, y + h);

            font = Math.floor(height / 22);
            ctx.font = `${font}px "Irish Grover", system-ui`;
            ctx.textBaseline = "top";
            // ctx.textAlign = "left";
            let lines = page.message.split("\n");
            ctx.fillStyle = "white";

            let x1 = 20;
            let y1 = height / 2 + 100;
            let maxWidth = width - 40;
            lines.forEach((line, i) => {
                ctx.fillText(line, x1, y1)
                y1 += font;
            })

            ctx.fillText(page.key + ">>", x1, y1 + font);
            ctx.drawImage(diamond, x1 + ctx.measureText(page.key + ">>").width, y1 + font / 2, 1.5 * font, 1.5 * font);
        }
    },
    "Key_4": {
        name: "Iris Witch",
        message: ` "The iris of the eye sees the rainbow, but the iris of the witch sees the code.\n To pass my gate, you must brew a password from the three sacred blooms:\n Amethyst Purple, Goldenrod Yellow, and Azure Blue."\n The Secret Formula:\n The Weight: First, calculate the mathematical sum of the numbers within each bloom's essence (Hex).\n The Chant: Then, gather every letter in the order they appear.\n The Tally: Finally, count how many times each digit from 0 to 9 appears across all three essences\n and write those counts at the very end.`,
        key: "python egg",
        hint: `The Amethyst Purple: #800080;The Goldenrod Yellow: #FFFF00;The Azure Blue: #0000FF"`,
        check: (password) => {
            return password.toUpperCase() == "1600FFFFFF1000000020"
        },
        action: "Riddle",
        imagesUrl: {
            key: key,
            cake: cake,
            nectar: nectar,
            letter: letter,
            diamond: diamond,
            witch: witch,
            magicPot: magicPot,
            iris: iris,
            python_egg: python_egg
        },
        drawPages: (ctx, width, height, page, imagesRef) => {
            ctx.fillStyle = "#3B0273";
            ctx.fillRect(0, 0, width, height);

            const iris = imagesRef.current["iris"];
            const keyImg = imagesRef.current["key"];
            const cakeImg = imagesRef.current["cake"];
            const diamond = imagesRef.current["diamond"];
            const nectar = imagesRef.current["nectar"];
            const letter = imagesRef.current["letter"];
            const magicPot = imagesRef.current["magicPot"];
            const witch = imagesRef.current["witch"];
            const python_egg = imagesRef.current["python_egg"];

            // Check if image exists AND is not broken
            let checkImgCanBeLoaded = [iris, keyImg, cakeImg, diamond, nectar, letter, magicPot, witch, python_egg].every(img => img && img.complete && img.naturalWidth !== 0);

            if (!checkImgCanBeLoaded) {
                ctx.fillStyle = "white";
                ctx.fillText("Image failed to load: map", 20, 20);
                console.error("Canvas skipped drawing 'map' because the image is broken.");
                return;
            }

            let x = 0;
            let y = 0;
            let w = (3 * width / 4) / 10;
            let h = (height / 2) / 4;



            ctx.drawImage(iris, x, y + 25, width / 2, height);
            ctx.drawImage(magicPot, x + width / 2, height / 2, width / 4, height / 2);
            ctx.drawImage(witch, x + width / 2, 50, width / 4, height / 2);
            ctx.drawImage(diamond, x + width / 2 + 75, 200, width / 8, height / 4);

            ctx.fillStyle = "rgba(0,0,0,0.7)";
            ctx.fillRect(0, height / 2, width, height / 2);

            let font = Math.floor(height / 8);
            ctx.font = `${font}px "Irish Grover", system-ui`;
            ctx.textBaseline = "top";
            ctx.textAlign = "left";
            ctx.fillStyle = "white";
            ctx.fillText(page.name, width - ctx.measureText(page.name).width - 10, y + h);

            font = Math.floor(height / 22);
            ctx.font = `${font}px "Irish Grover", system-ui`;
            ctx.textBaseline = "top";
            // ctx.textAlign = "left";
            let lines = page.message.split("\n");
            ctx.fillStyle = "white";

            let x1 = 20;
            let y1 = height / 2 + 10;
            let maxWidth = width - 40;
            lines.forEach((line, i) => {
                ctx.fillText(line, x1, y1)
                y1 += font;
            })

            ctx.fillText(page.key + ">>", x1, y1 + font);
            ctx.drawImage(python_egg, x1 + ctx.measureText(page.key + ">>").width, y1 + font / 2, 1.5 * font, 1.5 * font);
        }
    },
    "Key_5": {
        name: "Snake Island",
        message: " To open the leather gate, you must find the tooth that only bites once.\n To hatch the stone, speak the name of the tooth.\n But do not just say the letters.\n You must count them as they breathe.\n One E, Two Gs... and so the shell bleeds.",
        hint: "eggtooth",
        key: "golden lotus",
        check: (password) => {
            return password.toUpperCase() == "E1G2T1O2T1H1"
        },
        action: "Riddle",
        imagesUrl: {
            key: key,
            cake: cake,
            nectar: nectar,
            letter: letter,
            diamond: diamond,
            forest: forest,
            goldenLotusSymbolImg: golden_lotus_symbol,
            python_egg: python_egg,
            snake: snake
        },
        drawPages: (ctx, width, height, page, imagesRef) => {
            ctx.fillStyle = "#4A8C4F";
            ctx.fillRect(0, 0, width, height);

            const forest = imagesRef.current["forest"];
            const keyImg = imagesRef.current["key"];
            const cakeImg = imagesRef.current["cake"];
            const diamond = imagesRef.current["diamond"];
            const nectar = imagesRef.current["nectar"];
            const letter = imagesRef.current["letter"];
            const snake = imagesRef.current["snake"];
            const goldenLotusSymbol = imagesRef.current["goldenLotusSymbolImg"];
            const python_egg = imagesRef.current["python_egg"];

            // Check if image exists AND is not broken
            let checkImgCanBeLoaded = [forest, keyImg, cakeImg, diamond, nectar, letter, snake, goldenLotusSymbol, python_egg].every(img => img && img.complete && img.naturalWidth !== 0);

            if (!checkImgCanBeLoaded) {
                ctx.fillStyle = "white";
                ctx.fillText("Image failed to load: map", 20, 20);
                console.error("Canvas skipped drawing 'map' because the image is broken.");
                return;
            }

            let x = 0;
            let y = 0;
            let w = (3 * width / 4) / 10;
            let h = (height / 2) / 4;



            ctx.drawImage(forest, x + width / 4, y, 3 * width / 4, 1.5 * height);
            ctx.drawImage(snake, x + width / 2, height / 2, width / 4, height / 2);
            ctx.drawImage(python_egg, x + width / 2 + 100, height / 2 + 75, 75, 75);

            ctx.fillStyle = "rgba(0,0,0,0.7)";
            ctx.fillRect(0, height / 2, width, height / 2);

            let font = Math.floor(height / 8);
            ctx.font = `${font}px "Irish Grover", system-ui`;
            ctx.textBaseline = "top";
            ctx.textAlign = "left";
            ctx.fillStyle = "white";
            ctx.fillText(page.name, 10, y + h);

            font = Math.floor(height / 22);
            ctx.font = `${font}px "Irish Grover", system-ui`;
            ctx.textBaseline = "top";
            // ctx.textAlign = "left";
            let lines = page.message.split("\n");
            ctx.fillStyle = "white";

            let x1 = 20;
            let y1 = height / 2 + 10;
            let maxWidth = width - 40;
            lines.forEach((line, i) => {
                ctx.fillText(line, x1, y1)
                y1 += font;
            })

            ctx.fillText(page.key + ">>", x1, y1 + font);
            ctx.drawImage(goldenLotusSymbol, x1 + ctx.measureText(page.key + ">>").width, y1 + font / 2, 1.5 * font, 1.5 * font);
        }
    },
    "End": {
        name: "The Lotus Pavilion",
        message: " The silk barrier rips as if cut by a tiny tooth.\n The scent of nectar fills the air.\n Grandma smiles from the center of the bloom.\n The hunt is over. The Lotus is yours.\n To cure the fever, do not take the bloom.\n Seek the Rhizome for the gut, the Seed for the heart, and the Leaf for the mind.\n The clock strikes ten to five!\n You mix the RSL Lotus brew for your 78-year-old Grandma.\n You pour the 2, 5, and 3 drops carefully into her cup.\n She drinks, she smiles, and the journey is complete.",
        hint: "Combine the letters,lotus, the age, the drops, and the time into one long string with no spaces!",
        action: "Riddle",
        key: null,
        check: (password) => {
            return password.toUpperCase() == "RSLLOTUS78253450pm".toUpperCase()
        },
        imagesUrl: {
            key: key,
            cake: cake,
            nectar: nectar,
            letter: letter,
            diamond: diamond,
            python_egg: python_egg,
            pond: pond,
            pink_lotus: pink_lotus,
            lotus: lotus
        },
        drawPages: (ctx, width, height, page, imagesRef) => {
            ctx.fillStyle = "#2D592C";
            ctx.fillRect(0, 0, width, height);

            const pond = imagesRef.current["pond"];
            const keyImg = imagesRef.current["key"];
            const cakeImg = imagesRef.current["cake"];
            const diamond = imagesRef.current["diamond"];
            const nectar = imagesRef.current["nectar"];
            const letter = imagesRef.current["letter"];
            const lotus = imagesRef.current["lotus"];
            const pink_lotus = imagesRef.current["pink_lotus"];

            // Check if image exists AND is not broken
            let checkImgCanBeLoaded = [pond, keyImg, cakeImg, diamond, nectar, letter, lotus, pink_lotus].every(img => img && img.complete && img.naturalWidth !== 0);

            if (!checkImgCanBeLoaded) {
                ctx.fillStyle = "white";
                ctx.fillText("Image failed to load: map", 20, 20);
                console.error("Canvas skipped drawing 'map' because the image is broken.");
                return;
            }

            let x = 0;
            let y = 0;
            let w = (3 * width / 4) / 10;
            let h = (height / 2) / 4;



            ctx.drawImage(pond, x + width / 4, y, 3 * width / 4, 1.5 * height);
            ctx.drawImage(lotus, x + width / 2, height / 2, width / 4, height / 2);
            ctx.drawImage(pink_lotus, x + width / 2 + width / 5, height / 2 + 75, width / 5, height / 3);

            ctx.fillStyle = "rgba(0,0,0,0.7)";
            ctx.fillRect(0, height / 2, width, height / 2);

            let font = Math.floor(height / 8);
            ctx.font = `${font}px "Irish Grover", system-ui`;
            ctx.textBaseline = "top";
            ctx.textAlign = "left";
            ctx.fillStyle = "white";
            ctx.fillText(page.name, 10, y + h);

            font = Math.floor(height / 22);
            ctx.font = `${font}px "Irish Grover", system-ui`;
            ctx.textBaseline = "top";
            // ctx.textAlign = "left";
            let lines = page.message.split("\n");
            ctx.fillStyle = "white";

            let x1 = 20;
            let y1 = height / 2 + 10;
            let maxWidth = width - 40;
            lines.forEach((line, i) => {
                ctx.fillText(line, x1, y1)
                y1 += font;
            })
        }
    },
    "Cured": {
        name: "A New Dawn",
        message: "The fever has broken! \nGrandma stands tall once more, the color returned to her cheeks. \nThe village elders sing of your bravery, and the Golden Lotus \nnow blooms in the garden as a symbol of your love. \nYou have mastered the elements and saved your family. \nTHE END",
        hint: "Enter end to stop & Restart",
        action: "Victory",
        imagesUrl: {
            grandma: grandma,
            explorer: explorer,
            lotus: lotus,
            village: map
        },
        key: null,
        check: (password) => {
            return password.toUpperCase() === "END";
        },
        drawPages: (ctx, width, height, page, imagesRef) => {
            // A bright, celebratory sky blue background
            ctx.fillStyle = "#87CEEB";
            ctx.fillRect(0, 0, width, height);

            const grandmaImg = imagesRef.current["grandma"];
            const explorerImg = imagesRef.current["explorer"];
            const lotusImg = imagesRef.current["lotus"];
            const villageImg = imagesRef.current["village"];

            // Draw the village in the background with lower opacity
            ctx.globalAlpha = 0.3;
            ctx.drawImage(villageImg, 0, 0, width, height);
            ctx.globalAlpha = 1.0;

            // Draw the Golden Lotus in the center
            ctx.drawImage(lotusImg, width / 2 - 100, height / 4, 200, 200);

            // Draw Grandma and Explorer together
            ctx.drawImage(grandmaImg, width / 2 - 250, height - 250, 250, 250);
            ctx.drawImage(explorerImg, width / 2, height - 250, 250, 250);

            // Success Text
            let font = Math.floor(height / 20);
            ctx.font = `bold ${font}px "Irish Grover", system-ui`;
            ctx.fillStyle = "#2D592C";
            ctx.textAlign = "center";

            let lines = page.message.split("\n");
            let y = 100;
            lines.forEach(line => {
                ctx.fillText(line.trim(), width / 2, y);
                y += font + 10;
            });
        }
    }
}

export default questMap;