import Vue from "vue";

const checkAppearance = (el, className) => {
  if (checkVisible(el)) {
    el.classList.add(className);
  }
};

const checkVisible = elm => {
  var rect = elm.getBoundingClientRect();
  var viewHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight
  );

  return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
};



Vue.directive("appear", {
  inserted(el, binding) {
    checkAppearance(el, binding.value);

    //TODO Not best practise 
    // If there are other elements, which need to disappear, it could be that this element is rendered in the View afterwards
    setTimeout(() => {
      checkAppearance(el, binding.value);
    }, 200);
    setTimeout(() => {
      checkAppearance(el, binding.value);
    }, 500);
    setTimeout(() => {
      checkAppearance(el, binding.value);
    }, 700);
    setTimeout(() => {
      checkAppearance(el, binding.value);
    }, 1000);
  },

  bind(el, binding) {
    binding.def.scrollEvent = checkAppearance.bind(this, el, binding.value);
    window.addEventListener("scroll", binding.def.scrollEvent);
    window.addEventListener("resize", binding.def.scrollEvent);
  },
  unbind(el, binding) {
    window.removeEventListener("scroll", binding.def.scrollEvent);
    window.removeEventListener("resize", binding.def.scrollEvent);
  }
});
