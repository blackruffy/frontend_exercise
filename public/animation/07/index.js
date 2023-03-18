"use strict";
window.onload = () => {
    const state = {
        isOn: 0,
    };
  
    const xs = Array.from(document.getElementsByClassName(`text-cont`));
    xs.forEach((x, i) => {
        x.style.transform = `translateX(${i === 0 ? -100 : 100}vw)`;
        x.style.transition = `transform 600ms ease 0s`;
    });
    const button = document.getElementById("start-button");
    button.addEventListener("click", () => {
        if (state.isOn % 2 === 1) {
            const d = ((state.isOn + 1) / 2) % 2 === 0 ? 100 : -100;
            xs.forEach((x, i) => {
                x.style.transform = `translateX(${i === 0 ? d : -d}vw)`;
            });
            state.isOn += 1;
        }
        else {
            xs.forEach((x) => {
                x.style.transform = `translateX(0vw)`;
            });
            state.isOn += 1;
        }
    });
};
