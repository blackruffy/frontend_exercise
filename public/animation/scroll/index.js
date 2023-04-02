(function () {
    var rotateRange = 1000;
    var stayRange = 2000;
    var scaleRange = 8000;
    var scaleRate = 0.01;
    var ballRange = stayRange + scaleRange;
    var state = {
        screens: []
    };
    function setStyle(self, style) {
        Object.keys(style).forEach(function (key) { return (self.style[key] = style[key]); });
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
        var self = div();
        setStyle(self, {
            height: "calc(100vh + ".concat((rotateRange + stayRange + scaleRange) * 4, "px)")
        });
        return self;
    }
    function newContainer() {
        var self = div();
        setStyle(self, {
            position: "fixed",
            top: "0px",
            left: "0px",
            width: "100vw",
            height: "100vh"
        });
        self.append(newScreen({
            message: "JavaScript",
            ballColors: ["pink", "orange", "tomato", "hotpink", "violet"],
            backgroundColor: "orangered"
        }), newScreen({
            message: "TypeScript",
            ballColors: [
                "darkseagreen",
                "teal",
                "darkgreen",
                "palegreen",
                "yellowgreen",
            ],
            backgroundColor: "green"
        }), newScreen({
            message: "CoffeeScript",
            ballColors: ["yellow", "khaki", "peru", "wheat", "gold"],
            backgroundColor: "orange"
        }), newScreen({
            message: "LiveScript",
            ballColors: [
                "royalblue",
                "lightskyblue",
                "darkblue",
                "lightblue",
                "turquoise",
            ],
            backgroundColor: "blue"
        }), snack());
        return self;
    }
    function newScreen(_a) {
        var message = _a.message, ballColors = _a.ballColors, backgroundColor = _a.backgroundColor;
        var self = div();
        var angle = state.screens.length === 0 ? 0 : 90;
        setStyle(self, {
            position: "fixed",
            top: "0px",
            left: "0px",
            width: "100vw",
            height: "100vh",
            backgroundColor: backgroundColor,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            transform: "rotate(".concat(angle, "deg)"),
            transformOrigin: "bottom left",
            overflow: "hidden"
        });
        var text = newText(message);
        var balls = newBalls(ballColors);
        state.screens.push({
            main: self,
            balls: balls,
            text: text
        });
        self.append(balls, text);
        return self;
    }
    function newBalls(colors) {
        var self = div();
        setStyle(self, {
            position: "absolute",
            top: "0px",
            left: "0px"
        });
        self.append.apply(self, Array.from({ length: 100 }).map(function () { return newBall(colors); }));
        return self;
    }
    function newBall(colors) {
        var self = div();
        var radius = Math.round(Math.random() * 60 + 15);
        var colorIndex = Math.round(Math.random() * colors.length);
        var left = Math.round(Math.random() * window.innerWidth);
        var top = Math.round(Math.random() *
            (window.innerHeight + stayRange + scaleRange + rotateRange));
        setStyle(self, {
            position: "absolute",
            left: "".concat(left, "px"),
            top: "".concat(top, "px"),
            width: "".concat(radius * 2, "px"),
            height: "".concat(radius * 2, "px"),
            borderRadius: "".concat(radius, "px"),
            backgroundColor: "".concat(colors[colorIndex])
        });
        return self;
    }
    function newText(value) {
        var self = div();
        setStyle(self, {
            position: "relative",
            fontSize: "3rem",
            fontWeight: "bold",
            color: "white",
            transform: "scale(".concat(scaleRange * scaleRate + 1, ")")
        });
        self.append(text(value));
        return self;
    }
    function snack() {
        var self = div();
        setStyle(self, {
            position: "absolute",
            top: "0px",
            left: "0px",
            width: "100vw",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center"
        });
        self.append(snackText());
        return self;
    }
    function snackText() {
        var self = div();
        setStyle(self, {
            color: "white",
            fontSize: "2rem",
            fontWeight: "bold",
            filter: "drop-shadow(0px 0px 2px black)",
            animation: "flash 1s ease 0s infinite"
        });
        self.append(text("\u2193SCROLL DOWN\u2193"));
        return self;
    }
    function onScroll(index) {
        var screen = state.screens[index];
        var startY = index === 0
            ? 0
            : index * (scaleRange + stayRange) + (index - 1) * rotateRange;
        var scrollY = window.scrollY;
        if (screen !== null) {
            if (index > 0) {
                var angle = scrollY < startY
                    ? 90
                    : scrollY > startY + rotateRange
                        ? 0
                        : 90 - ((scrollY - startY) * 90) / rotateRange;
                setStyle(screen.main, {
                    transform: "rotate(".concat(angle, "deg)")
                });
            }
            var ballY = window.scrollY - startY - (index === 0 ? 0 : rotateRange);
            if (ballY > 0 && ballY < ballRange + rotateRange) {
                setStyle(screen.balls, {
                    transform: "translateY(".concat(-ballY, "px)")
                });
            }
            var scaleY = window.scrollY - startY - (index === 0 ? 0 : rotateRange);
            if (scaleY > 0 && scaleY < scaleRange) {
                setStyle(screen.text, {
                    transform: "scale(".concat((scaleRange - scaleY) * scaleRate + 1, ")")
                });
            }
        }
    }
    window.onload = function () {
        setStyle(document.body, {
            position: "relative"
        });
        window.addEventListener("scroll", function () {
            state.screens.forEach(function (_, i) { return onScroll(i); });
        });
        document.body.append(newScrollScreen(), newContainer());
    };
})();
