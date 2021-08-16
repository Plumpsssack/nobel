
import Vue from "vue";

const checkAppearance = (elm, args) => {
    const appearance = getAppearance(elm, args.offset, args.max);
    const oldVal = elm.style[args.prop];


    elm.style[args.prop] = `${args.value}(${appearance - 100}%)`;

    if (args.changeFunc && oldVal != elm.style[args.prop]) {
        args.changeFunc(appearance);
    }

}


const getAppearance = (elm, offset, max) => {
    var rect = elm.getBoundingClientRect();
    var viewHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight
    );

    if (rect.bottom < 0) return 0;


    const difference = viewHeight - rect.top - offset;

    if (!max) {
        max = 100;
    }


    return Math.min(max, Math.max(0, difference / rect.height * 100));

}


Vue.directive("scrollby", {
    inserted(el, binding) {
        checkAppearance(el, binding.value);
    },
    bind(el, binding) {
        binding.def.scrollEvent = checkAppearance.bind(this, el, binding.value);
        window.addEventListener("scroll", binding.def.scrollEvent);
        window.addEventListener("resize", binding.def.scrollEvent);
    }
})
