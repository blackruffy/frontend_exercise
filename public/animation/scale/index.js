"use strict";
function main() {
    window.onload = () => {
        const circles = [1, 2, 3, 4].map((i) => document.getElementById(`circle${i}`));
        circles.forEach((c) => {
            c.style.transform = `scale(0)`;
        });
        const button = document.getElementById("start-button");
        button.addEventListener("click", () => {
            circles.forEach((c) => {
                c.style.transform = `scale(0)`;
                c.style.transition = `transform 0ms linear 0s`;
                setTimeout(() => {
                    c.style.transform = `scale(10)`;
                    c.style.transition = `transform 600ms linear 0s`;
                }, 0);
            });
        });
    };
}
main();
