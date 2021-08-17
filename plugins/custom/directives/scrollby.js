
import Vue from "vue";

const checkAppearance = (elm, args) => {
    const appearance = getAppearance(elm, args.offset, args.max);


    let change = false;

    // loop through styleAttributes and set them
    if (args.styleAttributes) {
        for (const attribute of args.styleAttributes) {
            let oldVal;

            if (typeof attribute === 'object') {

                oldVal = elm.style[attribute.prop];

                let value = appearance;
                if (attribute.reverse) {
                    value = appearance - 100;
                }

                if (attribute.factor) {
                    value *= attribute.factor;
                }
                const valueString = attribute.value ? attribute.value.replace("$value", value) : value;

                elm.style[attribute.prop] = valueString

                // Check if value has changed
                if (valueString != oldVal) {
                    change = true;
                }

            }

        }
    }


    if (args.changeFunc && change) {
        args.changeFunc(appearance);
    }

}


const getAppearance = (elm, offset, max = 100) => {
    var rect = elm.getBoundingClientRect();
    var viewHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight
    );

    if (rect.bottom < 0) return 0;


    const difference = viewHeight - rect.top - offset;

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
