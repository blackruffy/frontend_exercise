function setStyle(self, style) {
    Object.keys(style).forEach(function (key) { return (self.style[key] = style[key]); });
}
function newDate(now) {
    var self = document.createElement("div");
    setStyle(self, {
        fontSize: "2rem",
        fontWeight: "bold"
    });
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    self.append(document.createTextNode("".concat(year, "\u5E74").concat(month, "\u6708").concat(day, "\u65E5")));
    return self;
}
function newTime(now) {
    var self = document.createElement("div");
    setStyle(self, {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end"
    });
    self.append(newHourMin(now), newSec(now));
    return self;
}
function newHourMin(now) {
    var self = document.createElement("div");
    setStyle(self, {
        fontSize: "3rem",
        fontWeight: "bold"
    });
    var hours = now.getHours().toString().padStart(2, "0");
    var mins = now.getMinutes().toString().padStart(2, "0");
    self.append(document.createTextNode("".concat(hours, "\u6642").concat(mins, "\u5206")));
    return self;
}
function newSec(now) {
    var self = document.createElement("div");
    setStyle(self, {
        fontSize: "2rem",
        fontWeight: "bold"
    });
    var sec = now.getSeconds().toString().padStart(2, "0");
    self.append(document.createTextNode("".concat(sec, "\u79D2")));
    return self;
}
function newContainer() {
    var now = new Date();
    var self = document.createElement("div");
    self.append(newDate(now), newTime(now));
    return self;
}
window.onload = function () {
    var state = {
        cont: newContainer()
    };
    var body = document.body;
    setStyle(body, {
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    });
    body.appendChild(state.cont);
    setInterval(function () {
        body.removeChild(state.cont);
        state.cont = newContainer();
        body.appendChild(state.cont);
    }, 1000);
};
