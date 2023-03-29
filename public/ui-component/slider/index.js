var state = {
    knob: null,
    frontBar: null,
    backBar: null,
    knobRadius: 13,
    color: "forestgreen",
    pos: 50,
    isDragging: false,
    initialX: null
};
function setStyle(self, style) {
    Object.keys(style).forEach(function (key) { return (self.style[key] = style[key]); });
}
function newContainer() {
    var self = document.createElement("div");
    setStyle(self, {
        padding: "24px",
        backgroundColor: "whitesmoke"
    });
    self.append(newSlider({
        width: 300,
        height: 10
    }));
    return self;
}
function newSlider(_a) {
    var width = _a.width, height = _a.height;
    var self = document.createElement("div");
    setStyle(self, {
        position: "relative",
        width: "".concat(width, "px"),
        height: "".concat(height, "px"),
        borderRadius: "".concat(height, "px")
    });
    var radius = height / 2;
    self.append(newBackBar({ radius: radius }), newFrontBar({ radius: radius }), newKnob({ radius: state.knobRadius, barHeight: height }));
    return self;
}
function newBackBar(_a) {
    var radius = _a.radius;
    var self = document.createElement("div");
    state.backBar = self;
    setStyle(self, {
        position: "absolute",
        top: "0px",
        left: "0px",
        width: "100%",
        height: "100%",
        borderRadius: "".concat(radius, "px"),
        backgroundColor: "gainsboro",
        overflow: "hidden"
    });
    return self;
}
function newFrontBar(_a) {
    var radius = _a.radius;
    var self = document.createElement("div");
    state.frontBar = self;
    setStyle(self, {
        position: "absolute",
        top: "0px",
        left: "0px",
        width: "".concat(state.pos, "%"),
        height: "100%",
        borderTopLeftRadius: "".concat(radius, "px"),
        borderBottomLeftRadius: "".concat(radius, "px"),
        backgroundColor: "".concat(state.color)
    });
    return self;
}
function newKnob(_a) {
    var radius = _a.radius, barHeight = _a.barHeight;
    var self = document.createElement("div");
    state.knob = self;
    var offset = barHeight / 2 - radius;
    setStyle(self, {
        position: "absolute",
        top: "".concat(offset, "px"),
        left: "calc(".concat(state.pos, "% - ").concat(radius, "px)"),
        width: "".concat(radius * 2, "px"),
        height: "".concat(radius * 2, "px"),
        borderRadius: "".concat(radius * 2, "px"),
        backgroundColor: "".concat(state.color),
        border: "1px solid ".concat(state.color)
    });
    self.addEventListener("mousedown", function (e) {
        onDown(e.clientX);
    });
    self.addEventListener("touchstart", function (e) {
        onDown(e.touches[0].clientX);
    });
    return self;
}
function onDown(clientX) {
    state.isDragging = true;
    state.initialX = clientX;
}
function onMove(clientX) {
    if (state.isDragging) {
        var pos = getPos(clientX);
        setStyle(state.frontBar, {
            width: "".concat(pos, "%")
        });
        setStyle(state.knob, {
            left: "calc(".concat(pos, "% - ").concat(state.knobRadius, "px)")
        });
    }
}
function onUp(clientX) {
    state.isDragging = false;
    state.pos = getPos(clientX);
}
function getPos(clientX) {
    var width = state.backBar.getBoundingClientRect().width;
    var diffX = clientX - state.initialX;
    var pos_ = state.pos + (diffX / width) * 100;
    return pos_ > 100 ? 100 : pos_ < 0 ? 0 : pos_;
}
window.onload = function () {
    var body = document.body;
    setStyle(body, {
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    });
    body.addEventListener("mousemove", function (e) {
        onMove(e.clientX);
    });
    body.addEventListener("touchmove", function (e) {
        onMove(e.touches[0].clientX);
    });
    body.addEventListener("mouseup", function (e) {
        onUp(e.clientX);
    });
    body.addEventListener("touchend", function (e) {
        onUp(e.touches[0].clientX);
    });
    body.appendChild(newContainer());
};
