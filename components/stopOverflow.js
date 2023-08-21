const Overflow = {
  start: function () {
    const body = document.querySelector("body");

    body.style.overflow = "auto";
    body.style.height = "auto";
  },
  stop: function () {
    const body = document.querySelector("body");

    body.style.overflow = "hidden";
    body.style.height = "100vh";
  },
};

export default Overflow;
