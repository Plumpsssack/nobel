let droppables = [];
let dragStopEventListener;
let lastCurrentDroppable = null;
let widthChanged = false;

const droppable = {
  bind(el, binding) {
    const value = binding.value;
    droppables.push({ el, value });
  },
  unbind(el) {
    droppables = droppables.filter(element => element.el != el);
  }
};

// Damit beim Draggen keine Textfelder selektiert werden
const pauseEvent = e => {
  if (e.stopPropagation) e.stopPropagation();
  if (e.preventDefault) e.preventDefault();
  e.cancelBubble = true;
  e.returnValue = false;
  return false;
};

const getCurrentLeftStyle = el => {
  return getAbsoluteOffsetVal(el.style.left, el.parentElement.offsetWidth) ?? 0;
};
const getCurrentTopStyle = el => {
  return getAbsoluteOffsetVal(el.style.top, el.parentElement.offsetHeight) ?? 0;
};

const getAbsoluteOffsetVal = (val, parentSize) => {
  let ret = null;
  if (val) {
    ret = parseFloat(val);

    if (val.includes("%")) {
      ret = (parentSize * ret) / 100;
    }
  }
  if (val == 0) {
    return val;
  }
  return ret;
};

const calculateBoundaries = (el, args) => {
  const boundaries = args.boundaries ?? {};

  let leftStart = getAbsoluteOffsetVal(
    boundaries.leftStart,
    el.parentElement.offsetWidth
  );

  let leftEnd = getAbsoluteOffsetVal(
    boundaries.leftEnd,
    el.parentElement.offsetWidth
  );

  let topStart = getAbsoluteOffsetVal(
    boundaries.topStart,
    el.parentElement.offsetHeight
  );
  let topEnd = getAbsoluteOffsetVal(
    boundaries.topEnd,
    el.parentElement.offsetHeight
  );

  return {
    leftStart,
    leftEnd,
    topStart,
    topEnd
  };
};

const dragStart = (el, vnode, args, event) => {
  const e = event || window.event;
  pauseEvent(e);

  // let currentLeftStyle = getCurrentLeftStyle(el);

  // let currentTopStyle = getCurrentTopStyle(el);
  const boundaries = calculateBoundaries(el, args);
  // LayerX und LayerY, weil offsetX und offsetY
  // const dragClickPositionX = event.layerX - el.offsetLeft + currentLeftStyle;
  // const dragClickPositionY = event.layerY - el.offsetTop + currentTopStyle;
  const dragClickPositionX = event.layerX;
  const dragClickPositionY = event.layerY;

  const style = window.getComputedStyle(el);
  const marginLeft = style.marginLeft.replace("px", "");
  const marginTop = style.marginTop.replace("px", "");

  el.style.left = el.offsetLeft - marginLeft + "px";
  el.style.top = el.offsetTop - marginTop + "px";
  if (!el.style.width) {
    el.style.width = el.clientWidth + "px";
    widthChanged = true;
  } else {
    widthChanged = false;
  }

  el.style.position = "absolute";

  let startParams = {};

  if (args.onStart) {
    /**
     *  * wenn das Event onStart gebunden ist,
     *  * kann es ein Object mit diversen Parametern zurueckgeben,
     *  * welche wiederum an die anderen Events weitergegeben wird
     * */
    startParams = args.onStart({ el, dragClickPositionX, dragClickPositionY });
  }

  const move = dragMove.bind(
    this,
    el,
    dragClickPositionX,
    dragClickPositionY,
    vnode,
    args,
    boundaries,
    startParams
  );

  dragStopEventListener = dragStop.bind(
    this,
    el,
    move,
    dragClickPositionX,
    dragClickPositionY,
    vnode,
    args,
    startParams
  );

  window.addEventListener("mouseup", dragStopEventListener);
  window.addEventListener("mousemove", move);
};

const getCurrentDroppable = evt => {
  for (let i = 0; i < droppables.length; i++) {
    const obj = droppables[i];
    const currentB = obj.el.getBoundingClientRect();
    if (
      evt.clientX >= currentB.left &&
      evt.clientX <= currentB.left + obj.el.clientWidth &&
      evt.clientY >= currentB.top &&
      evt.clientY <= currentB.top + obj.el.clientHeight
    ) {
      return obj;
    }
  }

  return null;
};

const checkDroppables = async (
  el,
  dragClickPositionX,
  dragClickPositionY,
  vnode,
  evt,
  args,
  startParams
) => {
  const droppableObj = getCurrentDroppable(evt);

  if (droppableObj) {
    const params = {
      dragClickPositionX,
      dragClickPositionY,
      vnode,
      startParams
    };
    if (droppableObj.value.onDrop) {
      droppableObj.value.onDrop(params);
    }

    if (droppableObj.value.onDropAsync) {
      await droppableObj.value.onDropAsync(params);
    }
  }
};

const dragStop = async (
  el,
  moveFunction,
  dragClickPositionX,
  dragClickPositionY,
  vnode,
  args,
  startParams,
  evt
) => {
  window.removeEventListener("mousemove", moveFunction);
  window.removeEventListener("mouseup", dragStopEventListener);

  await checkDroppables(
    el,
    dragClickPositionX,
    dragClickPositionY,
    vnode,
    evt,
    args,
    startParams
  );

  lastCurrentDroppable = null;

  const stopParams = { el, left: el.style.left, top: el.style.top };

  if (args.onStop) {
    args.onStop(stopParams);
  }

  // Wenn ignoriert, auf jeden Fall wieder zurücksetzen
  if (args.disableY) {
    el.style.top = "";
  }
  if (args.disableX) {
    el.style.left = "";
  }

  if (args.resetPosOnStop) {
    el.style.top = "";
    el.style.left = "";
  }
  el.style.position = "";

  if (widthChanged) {
    el.style.width = "";
  }
};

const dragMove = (
  el,
  dragClickPositionX,
  dragClickPositionY,
  vnode,
  args,
  boundaries,
  startParams,
  event
) => {
  const b = el.getBoundingClientRect();
  const leftDifference = b.left - el.offsetLeft;
  const topDifference = b.top - el.offsetTop;

  let posLeft = event.clientX - leftDifference - dragClickPositionX;

  let posTop = event.clientY - topDifference - dragClickPositionY;

  // Grenzen beachten
  if (boundaries.leftStart != null && boundaries.leftStart > posLeft) {
    posLeft = boundaries.leftStart;
  }
  if (boundaries.leftEnd != null && boundaries.leftEnd < posLeft) {
    posLeft = boundaries.leftEnd;
  }
  if (boundaries.topStart != null && boundaries.topStart > posTop) {
    posTop = boundaries.topStart;
  }
  if (boundaries.topEnd != null && boundaries.topEnd < posTop) {
    posTop = boundaries.topEnd;
  }

  if (!args.disableX) {
    el.style.left = posLeft + "px";
  }

  if (!args.disableY) {
    el.style.top = posTop + "px";
  }

  const currentDroppable = getCurrentDroppable(event);

  // Event fuer Droppable auslösen, wenn es nicht mehr gehovert wird
  if (
    lastCurrentDroppable &&
    currentDroppable != lastCurrentDroppable &&
    lastCurrentDroppable.value.onHoverLeave
  ) {
    lastCurrentDroppable.value.onHoverLeave();
  }

  if (currentDroppable) {
    // Nur Hover ausloesen, falls es sich um ein anderes Droppable handelt
    if (currentDroppable != lastCurrentDroppable) {
      if (currentDroppable.value.onHover) {
        currentDroppable.value.onHover({
          dragClickPositionX,
          dragClickPositionY,
          vnode,
          startParams
        });

        lastCurrentDroppable = currentDroppable;
      }
    }

    if (args.onMove)
      args.onMove({
        droppable: currentDroppable.el,
        left: posLeft,
        top: posTop,
        el,
        startParams
      });
  } else {
    lastCurrentDroppable = null;

    if (args.onMove)
      args.onMove({
        droppable: null,
        left: posLeft,
        top: posTop,
        el,
        startParams
      });
  }
};


/** Be sure to set the parent tag to 'position:relative' */
const draggable = {
  bind(el, binding, vnode) {
    el.ondragstart = function () {
      return false;
    };
    const args = binding.value ?? {};
    if (!args.disable) el.onmousedown = dragStart.bind(this, el, vnode, args);

    // el.addEventListener("mousedown", binding.def.dragStartEvt, true);
  },
  update(el, binding, vnode) {
    const val = binding.value;
    const oldVal = binding.oldValue;

    // (val.params != null &&
    //   val.params.eventObj.length != oldVal.params.eventObj.length) ||
    // val.params.eventObj.from != oldVal.params.eventObj.from

    // Das darf nicht rein, da sonst der Kalender andauernd ein refresh macht
    // val.onStart != oldVal.onStart ||
    if (
      !val ||
      !oldVal ||
      val.disable != oldVal.disable ||
      val.onMove != oldVal.onMove ||
      val.onHover != oldVal.onHover ||
      val.onStop != oldVal.onStop ||
      val.leftStart != oldVal.leftStart ||
      val.leftEnd != oldVal.leftEnd ||
      val.disableY != oldVal.disableY ||
      val.disableX != oldVal.disableX ||
      val.resetPosOnStop != oldVal.resetPosOnStop ||
      (!val.boundaries && oldVal.boundaries) ||
      (val.boundaries && !oldVal.boundaries) ||
      (val.boundaries &&
        oldVal.boundaries &&
        (val.boundaries.leftStart != oldVal.boundaries.leftStart ||
          val.boundaries.leftEnd != oldVal.boundaries.leftEnd))
    ) {
      const args = val ?? {};

      el.onmousedown = args.disable
        ? null
        : dragStart.bind(this, el, vnode, args);

      // el.addEventListener("mousedown", binding.def.dragStartEvt, true);
    }
  },
  unbind(el, binding, vnode) {
    el.onmousedown = null;
  }
};
// export default directive;

const draggablePlugin = {
  install(vue, options) {
    vue.directive("draggable", draggable);
    vue.directive("droppable", droppable);
  }
};

export { draggable, droppable, draggablePlugin };
