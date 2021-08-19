
import Vue from "vue";

const checkAppearance = (elm, args) => {

    const appearance = getAppearance(elm, args.offset, args.topOutMode, args.max);

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
                const valueString = attribute.value ? attribute.value.replaceAll("$value", value) : value;


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


const getAppearance = (elm, offset = 0, topOutMode, max = 100) => {
    var rect = elm.getBoundingClientRect();
    var viewHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight
    );
    if (topOutMode) {

        // This means that the element is out of the viewport (top direction)
        if (rect.top - offset < 0) {
            return Math.max(rect.height + rect.top - offset, 0) / rect.height * 100;
        }
        return max;

    }

    if (rect.bottom < 0) return 0;


    const difference = viewHeight - rect.top - offset;

    return Math.min(max, Math.max(0, difference / rect.height * 100));

}


Vue.directive("scrollby", {
    inserted(el, binding) {
        checkAppearance(el, binding.value);
    },
    bind(el, binding) {

        // binding.value = {
        //     topOutMode: {
        //         type: bool,
        //         description: "triggers when the element starts to disappear on top ",
        //         default: false
        //     }
        // };


        binding.def.scrollEvent = checkAppearance.bind(this, el, binding.value);

        window.addEventListener("scroll", binding.def.scrollEvent);
        window.addEventListener("resize", binding.def.scrollEvent);
    },
    unbind(el, binding) {
        window.removeEventListener("scroll", binding.def.scrollEvent);
        window.removeEventListener("resize", binding.def.scrollEvent);
    }
})
