"use strict";
(() => {
    const rotateRange = 1000;
    const stayRange = 2000;
    const scaleRange = 8000;
    const scaleRate = 0.01;
    const ballRange = stayRange + scaleRange;
    const state = {
        screens: [],
    };
    function setStyle(self, style) {
        Object.keys(style).forEach((key) => (self.style[key] = style[key]));
    }
    function tag(name) {
        return document.createElement(name);
    }
    function div() {
        return tag("div");
    }
    function text(value) {
        return document.createTextNode(value);
    }
    function newScrollScreen() {
        const self = div();
        setStyle(self, {
            height: `calc(100vh + ${(rotateRange + stayRange + scaleRange) * 4}px)`,
        });
        return self;
    }
    function newContainer() {
        const self = div();
        setStyle(self, {
            position: `fixed`,
            top: `0px`,
            left: `0px`,
            width: `100vw`,
            height: `100vh`,
        });
        self.append(newScreen({
            message: "JavaScript",
            ballColors: [`pink`, `orange`, `tomato`, `hotpink`, `violet`],
            backgroundColor: `orangered`,
        }), newScreen({
            message: "TypeScript",
            ballColors: [
                `darkseagreen`,
                `teal`,
                `darkgreen`,
                `palegreen`,
                `yellowgreen`,
            ],
            backgroundColor: `green`,
        }), newScreen({
            message: "CoffeeScript",
            ballColors: [`yellow`, `khaki`, `peru`, `wheat`, `gold`],
            backgroundColor: `orange`,
        }), newScreen({
            message: "LiveScript",
            ballColors: [
                `royalblue`,
                `lightskyblue`,
                `darkblue`,
                `lightblue`,
                `turquoise`,
            ],
            backgroundColor: `blue`,
        }), snack());
        return self;
    }
    function newScreen({ message, ballColors, backgroundColor, }) {
        const self = div();
        const angle = state.screens.length === 0 ? 0 : 90;
        setStyle(self, {
            position: `fixed`,
            top: `0px`,
            left: `0px`,
            width: `100vw`,
            height: `100vh`,
            backgroundColor,
            display: `flex`,
            flexDirection: `column`,
            justifyContent: `center`,
            alignItems: `center`,
            transform: `rotate(${angle}deg)`,
            transformOrigin: `bottom left`,
            overflow: `hidden`,
        });
        const text = newText(message);
        const balls = newBalls(ballColors);
        state.screens.push({
            main: self,
            balls,
            text,
        });
        self.append(balls, text);
        return self;
    }
    function newBalls(colors) {
        const self = div();
        setStyle(self, {
            position: "absolute",
            top: `0px`,
            left: `0px`,
        });
        self.append(...Array.from({ length: 100 }).map(() => newBall(colors)));
        return self;
    }
    function newBall(colors) {
        const self = div();
        const radius = Math.round(Math.random() * 60 + 15);
        const colorIndex = Math.round(Math.random() * colors.length);
        const left = Math.round(Math.random() * window.innerWidth);
        const top = Math.round(Math.random() *
            (window.innerHeight + stayRange + scaleRange + rotateRange));
        setStyle(self, {
            position: `absolute`,
            left: `${left}px`,
            top: `${top}px`,
            width: `${radius * 2}px`,
            height: `${radius * 2}px`,
            borderRadius: `${radius}px`,
            backgroundColor: `${colors[colorIndex]}`,
        });
        return self;
    }
    function newText(value) {
        const self = div();
        setStyle(self, {
            position: `relative`,
            fontSize: `3rem`,
            fontWeight: `bold`,
            color: `white`,
            transform: `scale(${scaleRange * scaleRate + 1})`,
        });
        self.append(text(value));
        return self;
    }
    function snack() {
        const self = div();
        setStyle(self, {
            position: `absolute`,
            top: `0px`,
            left: `0px`,
            width: `100vw`,
            height: `100vh`,
            display: `flex`,
            flexDirection: `column`,
            justifyContent: `flex-end`,
            alignItems: `center`,
        });
        self.append(snackText());
        return self;
    }
    function snackText() {
        const self = div();
        setStyle(self, {
            color: `white`,
            fontSize: `2rem`,
            fontWeight: `bold`,
            filter: `drop-shadow(0px 0px 2px black)`,
            animation: `flash 1s ease 0s infinite`,
        });
        self.append(text(`↓SCROLL DOWN↓`));
        return self;
    }
    function onScroll(index) {
        const screen = state.screens[index];
        const startY = index === 0
            ? 0
            : index * (scaleRange + stayRange) + (index - 1) * rotateRange;
        const scrollY = window.scrollY;
        if (screen !== null) {
            if (index > 0) {
                const angle = scrollY < startY
                    ? 90
                    : scrollY > startY + rotateRange
                        ? 0
                        : 90 - ((scrollY - startY) * 90) / rotateRange;
                setStyle(screen.main, {
                    transform: `rotate(${angle}deg)`,
                });
            }
            const ballY = window.scrollY - startY - (index === 0 ? 0 : rotateRange);
            if (ballY > 0 && ballY < ballRange + rotateRange) {
                setStyle(screen.balls, {
                    transform: `translateY(${-ballY}px)`,
                });
            }
            const scaleY = window.scrollY - startY - (index === 0 ? 0 : rotateRange);
            if (scaleY > 0 && scaleY < scaleRange) {
                setStyle(screen.text, {
                    transform: `scale(${(scaleRange - scaleY) * scaleRate + 1})`,
                });
            }
        }
    }
    window.onload = () => {
        setStyle(document.body, {
            position: `relative`,
        });
        window.addEventListener("scroll", () => {
            state.screens.forEach((_, i) => onScroll(i));
        });
        document.body.append(newScrollScreen(), newContainer());
    };
})();
