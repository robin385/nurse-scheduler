import { d as set_current_component, r as run_all, f as current_component, o as onDestroy, h as get_store_value, i as createEventDispatcher, c as create_ssr_component, j as compute_rest_props, k as spread, l as escape_attribute_value, n as escape_object, b as add_attribute, s as setContext, g as getContext, a as subscribe, e as escape, v as validate_component, p as identity, q as each } from "../../chunks/ssr.js";
import { tv } from "tailwind-variants";
import "dequal";
import { d as derived, w as writable, r as readable, a as readonly } from "../../chunks/index2.js";
import { o as onMount } from "../../chunks/ssr2.js";
import { nanoid } from "nanoid/non-secure";
import { CalendarDateTime, CalendarDate, ZonedDateTime, parseZonedDateTime, parseDateTime, parseDate, toCalendar, getLocalTimeZone, getDayOfWeek, DateFormatter, startOfMonth, endOfMonth, isSameMonth, isSameDay, isToday } from "@internationalized/date";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createFocusTrap as createFocusTrap$1 } from "focus-trap";
import dayjs from "dayjs";
import { flip, offset, shift, arrow, size, autoUpdate, computePosition } from "@floating-ui/dom";
const dirty_components = [];
const binding_callbacks = [];
let render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = /* @__PURE__ */ Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function tick() {
  schedule_update();
  return resolved_promise;
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
const seen_callbacks = /* @__PURE__ */ new Set();
let flushidx = 0;
function flush() {
  if (flushidx !== 0) {
    return;
  }
  const saved_component = current_component;
  do {
    try {
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
    } catch (e) {
      dirty_components.length = 0;
      flushidx = 0;
      throw e;
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
const void_element_names = /^(?:area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/;
function is_void(name2) {
  return void_element_names.test(name2) || name2.toLowerCase() === "!doctype";
}
function arraysAreEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  return arr1.every((value, index) => value === arr2[index]);
}
function last(array) {
  return array[array.length - 1];
}
function chunk(arr, size2) {
  const result = [];
  for (let i = 0; i < arr.length; i += size2) {
    result.push(arr.slice(i, i + size2));
  }
  return result;
}
function isValidIndex(index, arr) {
  return index >= 0 && index < arr.length;
}
function styleToString(style) {
  return Object.keys(style).reduce((str, key) => {
    if (style[key] === void 0)
      return str;
    return str + `${key}:${style[key]};`;
  }, "");
}
function disabledAttr(disabled) {
  return disabled ? true : void 0;
}
({
  type: "hidden",
  "aria-hidden": true,
  hidden: true,
  tabIndex: -1,
  style: styleToString({
    position: "absolute",
    opacity: 0,
    "pointer-events": "none",
    margin: 0,
    transform: "translateX(-100%)"
  })
});
function portalAttr(portal) {
  if (portal !== null) {
    return "";
  }
  return void 0;
}
function lightable(value) {
  function subscribe2(run) {
    run(value);
    return () => {
    };
  }
  return { subscribe: subscribe2 };
}
const hiddenAction = (obj) => {
  return new Proxy(obj, {
    get(target, prop, receiver) {
      return Reflect.get(target, prop, receiver);
    },
    ownKeys(target) {
      return Reflect.ownKeys(target).filter((key) => key !== "action");
    }
  });
};
const isFunctionWithParams = (fn) => {
  return typeof fn === "function";
};
makeElement("empty");
function makeElement(name2, args) {
  const { stores, action, returned } = args ?? {};
  const derivedStore = (() => {
    if (stores && returned) {
      return derived(stores, (values) => {
        const result = returned(values);
        if (isFunctionWithParams(result)) {
          const fn = (...args2) => {
            return hiddenAction({
              ...result(...args2),
              [`data-melt-${name2}`]: "",
              action: action ?? noop
            });
          };
          fn.action = action ?? noop;
          return fn;
        }
        return hiddenAction({
          ...result,
          [`data-melt-${name2}`]: "",
          action: action ?? noop
        });
      });
    } else {
      const returnedFn = returned;
      const result = returnedFn?.();
      if (isFunctionWithParams(result)) {
        const resultFn = (...args2) => {
          return hiddenAction({
            ...result(...args2),
            [`data-melt-${name2}`]: "",
            action: action ?? noop
          });
        };
        resultFn.action = action ?? noop;
        return lightable(resultFn);
      }
      return lightable(hiddenAction({
        ...result,
        [`data-melt-${name2}`]: "",
        action: action ?? noop
      }));
    }
  })();
  const actionFn = action ?? (() => {
  });
  actionFn.subscribe = derivedStore.subscribe;
  return actionFn;
}
function createElHelpers(prefix2) {
  const name2 = (part) => part ? `${prefix2}-${part}` : prefix2;
  const attribute = (part) => `data-melt-${prefix2}${part ? `-${part}` : ""}`;
  const selector2 = (part) => `[data-melt-${prefix2}${part ? `-${part}` : ""}]`;
  const getEl = (part) => document.querySelector(selector2(part));
  return {
    name: name2,
    attribute,
    selector: selector2,
    getEl
  };
}
const isBrowser = typeof document !== "undefined";
const isFunction = (v) => typeof v === "function";
function isElement(element) {
  return element instanceof Element;
}
function isHTMLElement(element) {
  return element instanceof HTMLElement;
}
function isTouch(event) {
  return event.pointerType === "touch";
}
function isFocusVisible(element) {
  return element.matches(":focus-visible");
}
function isObject(value) {
  return value !== null && typeof value === "object";
}
function isReadable(value) {
  return isObject(value) && "subscribe" in value;
}
function getTabbableNodes(container) {
  const nodes = [];
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node) => {
      return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }
  return nodes;
}
function executeCallbacks(...callbacks) {
  return (...args) => {
    for (const callback of callbacks) {
      if (typeof callback === "function") {
        callback(...args);
      }
    }
  };
}
function noop() {
}
function addEventListener(target, event, handler, options) {
  const events = Array.isArray(event) ? event : [event];
  events.forEach((_event) => target.addEventListener(_event, handler, options));
  return () => {
    events.forEach((_event) => target.removeEventListener(_event, handler, options));
  };
}
function addMeltEventListener(target, event, handler, options) {
  const events = Array.isArray(event) ? event : [event];
  if (typeof handler === "function") {
    const handlerWithMelt = withMelt((_event) => handler(_event));
    events.forEach((_event) => target.addEventListener(_event, handlerWithMelt, options));
    return () => {
      events.forEach((_event) => target.removeEventListener(_event, handlerWithMelt, options));
    };
  }
  return () => noop();
}
function dispatchMeltEvent(originalEvent) {
  const node = originalEvent.currentTarget;
  if (!isHTMLElement(node))
    return null;
  const customMeltEvent = new CustomEvent(`m-${originalEvent.type}`, {
    detail: {
      originalEvent
    },
    cancelable: true
  });
  node.dispatchEvent(customMeltEvent);
  return customMeltEvent;
}
function withMelt(handler) {
  return (event) => {
    const customEvent = dispatchMeltEvent(event);
    if (customEvent?.defaultPrevented)
      return;
    return handler(event);
  };
}
const safeOnMount = (fn) => {
  try {
    onMount(fn);
  } catch {
    return fn;
  }
};
const safeOnDestroy = (fn) => {
  try {
    onDestroy(fn);
  } catch {
    return fn;
  }
};
function getElemDirection(elem) {
  const style = window.getComputedStyle(elem);
  const direction = style.getPropertyValue("direction");
  return direction;
}
function omit(obj, ...keys) {
  const result = {};
  for (const key of Object.keys(obj)) {
    if (!keys.includes(key)) {
      result[key] = obj[key];
    }
  }
  return result;
}
function removeUndefined$1(obj) {
  const result = {};
  for (const key in obj) {
    const value = obj[key];
    if (value !== void 0) {
      result[key] = value;
    }
  }
  return result;
}
function withGet(store) {
  return {
    ...store,
    get: () => get_store_value(store)
  };
}
withGet.writable = function(initial) {
  const internal = writable(initial);
  let value = initial;
  return {
    subscribe: internal.subscribe,
    set(newValue) {
      internal.set(newValue);
      value = newValue;
    },
    update(updater) {
      const newValue = updater(value);
      internal.set(newValue);
      value = newValue;
    },
    get() {
      return value;
    }
  };
};
withGet.derived = function(stores, fn) {
  const subscribers = /* @__PURE__ */ new Map();
  const get = () => {
    const values = Array.isArray(stores) ? stores.map((store) => store.get()) : stores.get();
    return fn(values);
  };
  const subscribe2 = (subscriber) => {
    const unsubscribers = [];
    const storesArr = Array.isArray(stores) ? stores : [stores];
    storesArr.forEach((store) => {
      unsubscribers.push(store.subscribe(() => {
        subscriber(get());
      }));
    });
    subscriber(get());
    subscribers.set(subscriber, unsubscribers);
    return () => {
      const unsubscribers2 = subscribers.get(subscriber);
      if (unsubscribers2) {
        for (const unsubscribe of unsubscribers2) {
          unsubscribe();
        }
      }
      subscribers.delete(subscriber);
    };
  };
  return {
    get,
    subscribe: subscribe2
  };
};
const overridable = (_store, onChange) => {
  const store = withGet(_store);
  const update2 = (updater, sideEffect) => {
    store.update((curr) => {
      const next = updater(curr);
      let res = next;
      if (onChange) {
        res = onChange({ curr, next });
      }
      sideEffect?.(res);
      return res;
    });
  };
  const set = (curr) => {
    update2(() => curr);
  };
  return {
    ...store,
    update: update2,
    set
  };
};
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function generateId() {
  return nanoid(10);
}
function generateIds(args) {
  return args.reduce((acc, curr) => {
    acc[curr] = generateId();
    return acc;
  }, {});
}
const kbd = {
  ALT: "Alt",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  ARROW_UP: "ArrowUp",
  BACKSPACE: "Backspace",
  CAPS_LOCK: "CapsLock",
  CONTROL: "Control",
  DELETE: "Delete",
  END: "End",
  ENTER: "Enter",
  ESCAPE: "Escape",
  F1: "F1",
  F10: "F10",
  F11: "F11",
  F12: "F12",
  F2: "F2",
  F3: "F3",
  F4: "F4",
  F5: "F5",
  F6: "F6",
  F7: "F7",
  F8: "F8",
  F9: "F9",
  HOME: "Home",
  META: "Meta",
  PAGE_DOWN: "PageDown",
  PAGE_UP: "PageUp",
  SHIFT: "Shift",
  SPACE: " ",
  TAB: "Tab",
  CTRL: "Control",
  ASTERISK: "*",
  A: "a",
  P: "p"
};
const getNextKey = (dir = "ltr", orientation = "horizontal") => {
  return {
    horizontal: dir === "rtl" ? kbd.ARROW_LEFT : kbd.ARROW_RIGHT,
    vertical: kbd.ARROW_DOWN
  }[orientation];
};
const getPrevKey = (dir = "ltr", orientation = "horizontal") => {
  return {
    horizontal: dir === "rtl" ? kbd.ARROW_RIGHT : kbd.ARROW_LEFT,
    vertical: kbd.ARROW_UP
  }[orientation];
};
const getDirectionalKeys = (dir = "ltr", orientation = "horizontal") => {
  return {
    nextKey: getNextKey(dir, orientation),
    prevKey: getPrevKey(dir, orientation)
  };
};
const isDom = () => typeof window !== "undefined";
function getPlatform() {
  const agent = navigator.userAgentData;
  return agent?.platform ?? navigator.platform;
}
const pt = (v) => isDom() && v.test(getPlatform().toLowerCase());
const isTouchDevice = () => isDom() && !!navigator.maxTouchPoints;
const isMac = () => pt(/^mac/) && !isTouchDevice();
const isApple = () => pt(/mac|iphone|ipad|ipod/i);
const isIos = () => isApple() && !isMac();
const LOCK_CLASSNAME = "data-melt-scroll-lock";
function assignStyle(el, style) {
  if (!el)
    return;
  const previousStyle = el.style.cssText;
  Object.assign(el.style, style);
  return () => {
    el.style.cssText = previousStyle;
  };
}
function setCSSProperty(el, property, value) {
  if (!el)
    return;
  const previousValue = el.style.getPropertyValue(property);
  el.style.setProperty(property, value);
  return () => {
    if (previousValue) {
      el.style.setProperty(property, previousValue);
    } else {
      el.style.removeProperty(property);
    }
  };
}
function getPaddingProperty(documentElement) {
  const documentLeft = documentElement.getBoundingClientRect().left;
  const scrollbarX = Math.round(documentLeft) + documentElement.scrollLeft;
  return scrollbarX ? "paddingLeft" : "paddingRight";
}
function removeScroll(_document) {
  const doc = _document ?? document;
  const win = doc.defaultView ?? window;
  const { documentElement, body } = doc;
  const locked = body.hasAttribute(LOCK_CLASSNAME);
  if (locked)
    return noop;
  body.setAttribute(LOCK_CLASSNAME, "");
  const scrollbarWidth = win.innerWidth - documentElement.clientWidth;
  const setScrollbarWidthProperty = () => setCSSProperty(documentElement, "--scrollbar-width", `${scrollbarWidth}px`);
  const paddingProperty = getPaddingProperty(documentElement);
  const scrollbarSidePadding = win.getComputedStyle(body)[paddingProperty];
  const setStyle = () => assignStyle(body, {
    overflow: "hidden",
    [paddingProperty]: `calc(${scrollbarSidePadding} + ${scrollbarWidth}px)`
  });
  const setIOSStyle = () => {
    const { scrollX, scrollY, visualViewport } = win;
    const offsetLeft = visualViewport?.offsetLeft ?? 0;
    const offsetTop = visualViewport?.offsetTop ?? 0;
    const restoreStyle = assignStyle(body, {
      position: "fixed",
      overflow: "hidden",
      top: `${-(scrollY - Math.floor(offsetTop))}px`,
      left: `${-(scrollX - Math.floor(offsetLeft))}px`,
      right: "0",
      [paddingProperty]: `calc(${scrollbarSidePadding} + ${scrollbarWidth}px)`
    });
    return () => {
      restoreStyle?.();
      win.scrollTo(scrollX, scrollY);
    };
  };
  const cleanups = [setScrollbarWidthProperty(), isIos() ? setIOSStyle() : setStyle()];
  return () => {
    cleanups.forEach((fn) => fn?.());
    body.removeAttribute(LOCK_CLASSNAME);
  };
}
function derivedVisible(obj) {
  const { open, forceVisible, activeTrigger } = obj;
  return derived([open, forceVisible, activeTrigger], ([$open, $forceVisible, $activeTrigger]) => ($open || $forceVisible) && $activeTrigger !== null);
}
function effect(stores, fn) {
  let cb = void 0;
  const destroy = derived(stores, (stores2) => {
    cb?.();
    cb = fn(stores2);
  }).subscribe(noop);
  const unsub = () => {
    destroy();
    cb?.();
  };
  safeOnDestroy(unsub);
  return unsub;
}
function toWritableStores(properties) {
  const result = {};
  Object.keys(properties).forEach((key) => {
    const propertyKey = key;
    const value = properties[propertyKey];
    result[propertyKey] = withGet(writable(value));
  });
  return result;
}
function getPortalParent(node) {
  let parent = node.parentElement;
  while (isHTMLElement(parent) && !parent.hasAttribute("data-portal")) {
    parent = parent.parentElement;
  }
  return parent || "body";
}
function getPortalDestination(node, portalProp) {
  if (portalProp !== void 0)
    return portalProp;
  const portalParent = getPortalParent(node);
  if (portalParent === "body")
    return document.body;
  return null;
}
async function handleFocus(args) {
  const { prop, defaultEl } = args;
  await Promise.all([sleep(1), tick]);
  if (prop === void 0) {
    defaultEl?.focus();
    return;
  }
  const returned = isFunction(prop) ? prop(defaultEl) : prop;
  if (typeof returned === "string") {
    const el = document.querySelector(returned);
    if (!isHTMLElement(el))
      return;
    el.focus();
  } else if (isHTMLElement(returned)) {
    returned.focus();
  }
}
readable(void 0, (set) => {
  function clicked(event) {
    set(event);
    set(void 0);
  }
  const unsubscribe = addEventListener(document, "pointerup", clicked, {
    passive: false,
    capture: true
  });
  return unsubscribe;
});
const documentEscapeKeyStore = readable(void 0, (set) => {
  function keydown(event) {
    if (event && event.key === kbd.ESCAPE) {
      set(event);
    }
    set(void 0);
  }
  const unsubscribe = addEventListener(document, "keydown", keydown, {
    passive: false
  });
  return unsubscribe;
});
const useEscapeKeydown = (node, config = {}) => {
  let unsub = noop;
  function update2(config2 = {}) {
    unsub();
    const options = { enabled: true, ...config2 };
    const enabled = isReadable(options.enabled) ? options.enabled : readable(options.enabled);
    unsub = executeCallbacks(
      // Handle escape keydowns
      documentEscapeKeyStore.subscribe((e) => {
        if (!e || !get_store_value(enabled))
          return;
        const target = e.target;
        if (!isHTMLElement(target) || target.closest("[data-escapee]") !== node) {
          return;
        }
        e.preventDefault();
        if (options.ignore) {
          if (isFunction(options.ignore)) {
            if (options.ignore(e))
              return;
          } else if (Array.isArray(options.ignore)) {
            if (options.ignore.length > 0 && options.ignore.some((ignoreEl) => {
              return ignoreEl && target === ignoreEl;
            }))
              return;
          }
        }
        options.handler?.(e);
      }),
      effect(enabled, ($enabled) => {
        if ($enabled) {
          node.dataset.escapee = "";
        } else {
          delete node.dataset.escapee;
        }
      })
    );
  }
  update2(config);
  return {
    update: update2,
    destroy() {
      node.removeAttribute("data-escapee");
      unsub();
    }
  };
};
const defaultConfig$1 = {
  strategy: "absolute",
  placement: "top",
  gutter: 5,
  flip: true,
  sameWidth: false,
  overflowPadding: 8
};
const ARROW_TRANSFORM = {
  bottom: "rotate(45deg)",
  left: "rotate(135deg)",
  top: "rotate(225deg)",
  right: "rotate(315deg)"
};
function useFloating(reference, floating, opts = {}) {
  if (!floating || !reference || opts === null)
    return {
      destroy: noop
    };
  const options = { ...defaultConfig$1, ...opts };
  const arrowEl = floating.querySelector("[data-arrow=true]");
  const middleware = [];
  if (options.flip) {
    middleware.push(flip({
      boundary: options.boundary,
      padding: options.overflowPadding
    }));
  }
  const arrowOffset = isHTMLElement(arrowEl) ? arrowEl.offsetHeight / 2 : 0;
  if (options.gutter || options.offset) {
    const data = options.gutter ? { mainAxis: options.gutter } : options.offset;
    if (data?.mainAxis != null) {
      data.mainAxis += arrowOffset;
    }
    middleware.push(offset(data));
  }
  middleware.push(shift({
    boundary: options.boundary,
    crossAxis: options.overlap,
    padding: options.overflowPadding
  }));
  if (arrowEl) {
    middleware.push(arrow({ element: arrowEl, padding: 8 }));
  }
  middleware.push(size({
    padding: options.overflowPadding,
    apply({ rects, availableHeight, availableWidth }) {
      if (options.sameWidth) {
        Object.assign(floating.style, {
          width: `${Math.round(rects.reference.width)}px`,
          minWidth: "unset"
        });
      }
      if (options.fitViewport) {
        Object.assign(floating.style, {
          maxWidth: `${availableWidth}px`,
          maxHeight: `${availableHeight}px`
        });
      }
    }
  }));
  function compute() {
    if (!reference || !floating)
      return;
    if (isHTMLElement(reference) && !reference.ownerDocument.documentElement.contains(reference))
      return;
    const { placement, strategy } = options;
    computePosition(reference, floating, {
      placement,
      middleware,
      strategy
    }).then((data) => {
      const x = Math.round(data.x);
      const y = Math.round(data.y);
      const [side, align] = getSideAndAlignFromPlacement(data.placement);
      floating.setAttribute("data-side", side);
      floating.setAttribute("data-align", align);
      Object.assign(floating.style, {
        position: options.strategy,
        top: `${y}px`,
        left: `${x}px`
      });
      if (isHTMLElement(arrowEl) && data.middlewareData.arrow) {
        const { x: x2, y: y2 } = data.middlewareData.arrow;
        const dir = data.placement.split("-")[0];
        arrowEl.setAttribute("data-side", dir);
        Object.assign(arrowEl.style, {
          position: "absolute",
          left: x2 != null ? `${x2}px` : "",
          top: y2 != null ? `${y2}px` : "",
          [dir]: `calc(100% - ${arrowOffset}px)`,
          transform: ARROW_TRANSFORM[dir],
          backgroundColor: "inherit",
          zIndex: "inherit"
        });
      }
      return data;
    });
  }
  Object.assign(floating.style, {
    position: options.strategy
  });
  return {
    destroy: autoUpdate(reference, floating, compute)
  };
}
function getSideAndAlignFromPlacement(placement) {
  const [side, align = "center"] = placement.split("-");
  return [side, align];
}
function createFocusTrap(config = {}) {
  let trap;
  const { immediate, ...focusTrapOptions } = config;
  const hasFocus = writable(false);
  const isPaused = writable(false);
  const activate = (opts) => trap?.activate(opts);
  const deactivate = (opts) => {
    trap?.deactivate(opts);
  };
  const pause = () => {
    if (trap) {
      trap.pause();
      isPaused.set(true);
    }
  };
  const unpause = () => {
    if (trap) {
      trap.unpause();
      isPaused.set(false);
    }
  };
  const useFocusTrap = (node) => {
    trap = createFocusTrap$1(node, {
      ...focusTrapOptions,
      onActivate() {
        hasFocus.set(true);
        config.onActivate?.();
      },
      onDeactivate() {
        hasFocus.set(false);
        config.onDeactivate?.();
      }
    });
    if (immediate) {
      activate();
    }
    return {
      destroy() {
        deactivate();
        trap = void 0;
      }
    };
  };
  return {
    useFocusTrap,
    hasFocus: readonly(hasFocus),
    isPaused: readonly(isPaused),
    activate,
    deactivate,
    pause,
    unpause
  };
}
const visibleModals = [];
function useModal(node, config) {
  let unsubInteractOutside = noop;
  function removeNodeFromVisibleModals() {
    const index = visibleModals.indexOf(node);
    if (index >= 0) {
      visibleModals.splice(index, 1);
    }
  }
  function update2(config2) {
    unsubInteractOutside();
    const { open, onClose, shouldCloseOnInteractOutside, closeOnInteractOutside } = config2;
    sleep(100).then(() => {
      if (open) {
        visibleModals.push(node);
      } else {
        removeNodeFromVisibleModals();
      }
    });
    function isLastModal() {
      return last(visibleModals) === node;
    }
    function closeModal() {
      if (isLastModal() && onClose) {
        onClose();
        removeNodeFromVisibleModals();
      }
    }
    function onInteractOutsideStart(e) {
      const target = e.target;
      if (!isElement(target))
        return;
      if (target && isLastModal()) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }
    function onInteractOutside(e) {
      if (shouldCloseOnInteractOutside?.(e) && isLastModal()) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        closeModal();
      }
    }
    unsubInteractOutside = useInteractOutside(node, {
      onInteractOutsideStart,
      onInteractOutside: closeOnInteractOutside ? onInteractOutside : void 0,
      enabled: open
    }).destroy;
  }
  update2(config);
  return {
    update: update2,
    destroy() {
      removeNodeFromVisibleModals();
      unsubInteractOutside();
    }
  };
}
const defaultConfig = {
  floating: {},
  focusTrap: {},
  modal: {},
  escapeKeydown: {},
  portal: "body"
};
const usePopper = (popperElement, args) => {
  popperElement.dataset.escapee = "";
  const { anchorElement, open, options } = args;
  if (!anchorElement || !open || !options) {
    return { destroy: noop };
  }
  const opts = { ...defaultConfig, ...options };
  const callbacks = [];
  if (opts.portal !== null) {
    const portal = usePortal(popperElement, opts.portal);
    if (portal?.destroy) {
      callbacks.push(portal.destroy);
    }
  }
  callbacks.push(useFloating(anchorElement, popperElement, opts.floating).destroy);
  if (opts.focusTrap !== null) {
    const { useFocusTrap } = createFocusTrap({
      immediate: true,
      escapeDeactivates: false,
      allowOutsideClick: true,
      returnFocusOnDeactivate: false,
      fallbackFocus: popperElement,
      ...opts.focusTrap
    });
    const usedFocusTrap = useFocusTrap(popperElement);
    if (usedFocusTrap?.destroy) {
      callbacks.push(usedFocusTrap.destroy);
    }
  }
  if (opts.modal !== null) {
    callbacks.push(useModal(popperElement, {
      onClose: () => {
        if (isHTMLElement(anchorElement)) {
          open.set(false);
          anchorElement.focus();
        }
      },
      shouldCloseOnInteractOutside: (e) => {
        if (e.defaultPrevented)
          return false;
        if (isHTMLElement(anchorElement) && anchorElement.contains(e.target)) {
          return false;
        }
        return true;
      },
      ...opts.modal
    }).destroy);
  }
  if (opts.escapeKeydown !== null) {
    callbacks.push(useEscapeKeydown(popperElement, {
      enabled: open,
      handler: () => {
        open.set(false);
      },
      ...opts.escapeKeydown
    }).destroy);
  }
  const unsubscribe = executeCallbacks(...callbacks);
  return {
    destroy() {
      unsubscribe();
    }
  };
};
const usePortal = (el, target = "body") => {
  let targetEl;
  if (!isHTMLElement(target) && typeof target !== "string") {
    return {
      destroy: noop
    };
  }
  async function update2(newTarget) {
    target = newTarget;
    if (typeof target === "string") {
      targetEl = document.querySelector(target);
      if (targetEl === null) {
        await tick();
        targetEl = document.querySelector(target);
      }
      if (targetEl === null) {
        throw new Error(`No element found matching css selector: "${target}"`);
      }
    } else if (target instanceof HTMLElement) {
      targetEl = target;
    } else {
      throw new TypeError(`Unknown portal target type: ${target === null ? "null" : typeof target}. Allowed types: string (CSS selector) or HTMLElement.`);
    }
    el.dataset.portal = "";
    targetEl.appendChild(el);
    el.hidden = false;
  }
  function destroy() {
    el.remove();
  }
  update2(target);
  return {
    update: update2,
    destroy
  };
};
function useInteractOutside(node, config) {
  let unsub = noop;
  let isPointerDown = false;
  let isPointerDownInside = false;
  let ignoreEmulatedMouseEvents = false;
  function update2(config2) {
    unsub();
    const { onInteractOutside, onInteractOutsideStart, enabled } = config2;
    if (!enabled)
      return;
    function onPointerDown(e) {
      if (onInteractOutside && isValidEvent(e, node)) {
        onInteractOutsideStart?.(e);
      }
      const target = e.target;
      if (isElement(target) && isOrContainsTarget(node, target)) {
        isPointerDownInside = true;
      }
      isPointerDown = true;
    }
    function triggerInteractOutside(e) {
      onInteractOutside?.(e);
    }
    const documentObj = getOwnerDocument(node);
    if (typeof PointerEvent !== "undefined") {
      const onPointerUp = (e) => {
        if (shouldTriggerInteractOutside(e)) {
          triggerInteractOutside(e);
        }
        resetPointerState();
      };
      unsub = executeCallbacks(addEventListener(documentObj, "pointerdown", onPointerDown, true), addEventListener(documentObj, "pointerup", onPointerUp, true));
    } else {
      const onMouseUp = (e) => {
        if (ignoreEmulatedMouseEvents) {
          ignoreEmulatedMouseEvents = false;
        } else if (shouldTriggerInteractOutside(e)) {
          triggerInteractOutside(e);
        }
        resetPointerState();
      };
      const onTouchEnd = (e) => {
        ignoreEmulatedMouseEvents = true;
        if (shouldTriggerInteractOutside(e)) {
          triggerInteractOutside(e);
        }
        resetPointerState();
      };
      unsub = executeCallbacks(addEventListener(documentObj, "mousedown", onPointerDown, true), addEventListener(documentObj, "mouseup", onMouseUp, true), addEventListener(documentObj, "touchstart", onPointerDown, true), addEventListener(documentObj, "touchend", onTouchEnd, true));
    }
  }
  function shouldTriggerInteractOutside(e) {
    if (isPointerDown && !isPointerDownInside && isValidEvent(e, node)) {
      return true;
    }
    return false;
  }
  function resetPointerState() {
    isPointerDown = false;
    isPointerDownInside = false;
  }
  update2(config);
  return {
    update: update2,
    destroy: unsub
  };
}
function isValidEvent(e, node) {
  if ("button" in e && e.button > 0)
    return false;
  const target = e.target;
  if (!isElement(target))
    return false;
  const ownerDocument = target.ownerDocument;
  if (!ownerDocument || !ownerDocument.documentElement.contains(target)) {
    return false;
  }
  return node && !isOrContainsTarget(node, target);
}
function isOrContainsTarget(node, target) {
  return node === target || node.contains(target);
}
function getOwnerDocument(el) {
  return el?.ownerDocument ?? document;
}
function toReadableStores(properties) {
  const result = {};
  Object.keys(properties).forEach((key) => {
    const propertyKey = key;
    const value = properties[propertyKey];
    if (isReadable(value)) {
      result[propertyKey] = withGet(value);
    } else {
      result[propertyKey] = withGet(readable(value));
    }
  });
  return result;
}
const defaults$5 = {
  prefix: "",
  disabled: readable(false),
  required: readable(false),
  name: readable(void 0)
};
function createHiddenInput(props) {
  const withDefaults = {
    ...defaults$5,
    ...removeUndefined$1(props)
  };
  const { name: elName } = createElHelpers(withDefaults.prefix);
  const { value, name: name2, disabled, required } = toReadableStores(omit(withDefaults, "prefix"));
  const nameStore = name2;
  const hiddenInput = makeElement(elName("hidden-input"), {
    stores: [value, nameStore, disabled, required],
    returned: ([$value, $name, $disabled, $required]) => {
      return {
        name: $name,
        value: $value?.toString(),
        "aria-hidden": "true",
        hidden: true,
        disabled: $disabled,
        required: $required,
        tabIndex: -1,
        style: styleToString({
          position: "absolute",
          opacity: 0,
          "pointer-events": "none",
          margin: 0,
          transform: "translateX(-100%)"
        })
      };
    },
    action: (node) => {
      const unsub = value.subscribe((newValue) => {
        node.value = newValue;
        node.dispatchEvent(new Event("change", { bubbles: true }));
      });
      return {
        destroy: unsub
      };
    }
  });
  return hiddenInput;
}
function createLabel() {
  const root = makeElement("label", {
    action: (node) => {
      const mouseDown = addMeltEventListener(node, "mousedown", (e) => {
        if (!e.defaultPrevented && e.detail > 1) {
          e.preventDefault();
        }
      });
      return {
        destroy: mouseDown
      };
    }
  });
  return {
    elements: {
      root
    }
  };
}
const defaultDateDefaults = {
  defaultValue: void 0,
  defaultPlaceholder: void 0,
  granularity: "day"
};
function getDefaultDate(props) {
  const withDefaults = { ...defaultDateDefaults, ...props };
  const { defaultValue, defaultPlaceholder, granularity } = withDefaults;
  if (Array.isArray(defaultValue) && defaultValue.length) {
    return defaultValue[defaultValue.length - 1];
  }
  if (defaultValue && !Array.isArray(defaultValue)) {
    return defaultValue;
  } else if (defaultPlaceholder) {
    return defaultPlaceholder;
  } else {
    const date = /* @__PURE__ */ new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const calendarDateTimeGranularities = ["hour", "minute", "second"];
    if (calendarDateTimeGranularities.includes(granularity ?? "day")) {
      return new CalendarDateTime(year, month, day, 0, 0, 0);
    }
    return new CalendarDate(year, month, day);
  }
}
function parseStringToDateValue(dateStr, referenceVal) {
  let dateValue;
  if (referenceVal instanceof ZonedDateTime) {
    dateValue = parseZonedDateTime(dateStr);
  } else if (referenceVal instanceof CalendarDateTime) {
    dateValue = parseDateTime(dateStr);
  } else {
    dateValue = parseDate(dateStr);
  }
  return dateValue.calendar !== referenceVal.calendar ? toCalendar(dateValue, referenceVal.calendar) : dateValue;
}
function toDate(dateValue, tz = getLocalTimeZone()) {
  if (dateValue instanceof ZonedDateTime) {
    return dateValue.toDate();
  } else {
    return dateValue.toDate(tz);
  }
}
function isCalendarDateTime(dateValue) {
  return dateValue instanceof CalendarDateTime;
}
function isZonedDateTime(dateValue) {
  return dateValue instanceof ZonedDateTime;
}
function hasTime(dateValue) {
  return isCalendarDateTime(dateValue) || isZonedDateTime(dateValue);
}
function getDaysInMonth(date) {
  if (date instanceof Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return new Date(year, month, 0).getDate();
  } else {
    return date.set({ day: 100 }).day;
  }
}
function isBefore(dateToCompare, referenceDate) {
  return dateToCompare.compare(referenceDate) < 0;
}
function isAfter(dateToCompare, referenceDate) {
  return dateToCompare.compare(referenceDate) > 0;
}
function getLastFirstDayOfWeek(date, firstDayOfWeek, locale) {
  const day = getDayOfWeek(date, locale);
  if (firstDayOfWeek > day) {
    return date.subtract({ days: day + 7 - firstDayOfWeek });
  }
  if (firstDayOfWeek === day) {
    return date;
  }
  return date.subtract({ days: day - firstDayOfWeek });
}
function getNextLastDayOfWeek(date, firstDayOfWeek, locale) {
  const day = getDayOfWeek(date, locale);
  const lastDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  if (day === lastDayOfWeek) {
    return date;
  }
  if (day > lastDayOfWeek) {
    return date.add({ days: 7 - day + lastDayOfWeek });
  }
  return date.add({ days: lastDayOfWeek - day });
}
function createFormatter(initialLocale) {
  let locale = initialLocale;
  function setLocale(newLocale) {
    locale = newLocale;
  }
  function getLocale() {
    return locale;
  }
  function custom(date, options) {
    return new DateFormatter(locale, options).format(date);
  }
  function selectedDate(date, includeTime = true) {
    if (hasTime(date) && includeTime) {
      return custom(toDate(date), {
        dateStyle: "long",
        timeStyle: "long"
      });
    } else {
      return custom(toDate(date), {
        dateStyle: "long"
      });
    }
  }
  function fullMonthAndYear(date) {
    return new DateFormatter(locale, { month: "long", year: "numeric" }).format(date);
  }
  function fullMonth(date) {
    return new DateFormatter(locale, { month: "long" }).format(date);
  }
  function fullYear(date) {
    return new DateFormatter(locale, { year: "numeric" }).format(date);
  }
  function toParts(date, options) {
    if (isZonedDateTime(date)) {
      return new DateFormatter(locale, {
        ...options,
        timeZone: date.timeZone
      }).formatToParts(toDate(date));
    } else {
      return new DateFormatter(locale, options).formatToParts(toDate(date));
    }
  }
  function dayOfWeek(date, length = "narrow") {
    return new DateFormatter(locale, { weekday: length }).format(date);
  }
  function dayPeriod(date) {
    const parts = new DateFormatter(locale, {
      hour: "numeric",
      minute: "numeric"
    }).formatToParts(date);
    const value = parts.find((p) => p.type === "dayPeriod")?.value;
    if (value === "PM") {
      return "PM";
    }
    return "AM";
  }
  const defaultPartOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  };
  function part(dateObj, type, options = {}) {
    const opts = { ...defaultPartOptions, ...options };
    const parts = toParts(dateObj, opts);
    const part2 = parts.find((p) => p.type === type);
    return part2 ? part2.value : "";
  }
  return {
    setLocale,
    getLocale,
    fullMonth,
    fullYear,
    fullMonthAndYear,
    toParts,
    custom,
    part,
    dayPeriod,
    selectedDate,
    dayOfWeek
  };
}
function dateStore(store, defaultValue) {
  const { set, update: update2, subscribe: subscribe2, get } = withGet(store);
  function add(duration) {
    update2((d) => {
      return d.add(duration);
    });
  }
  function nextPage(amount) {
    update2((d) => {
      return d.set({ day: 1 }).add({ months: amount });
    });
  }
  function prevPage(amount) {
    update2((d) => {
      return d.set({ day: 1 }).subtract({ months: amount });
    });
  }
  function subtract(duration) {
    update2((d) => {
      return d.subtract(duration);
    });
  }
  function setDate(fields, disambiguation) {
    if (disambiguation) {
      update2((d) => {
        return d.set(fields, disambiguation);
      });
      return;
    }
    update2((d) => {
      return d.set(fields);
    });
  }
  function reset() {
    update2(() => {
      return defaultValue;
    });
  }
  function toWritable() {
    return {
      set,
      subscribe: subscribe2,
      update: update2,
      get
    };
  }
  return {
    get,
    set,
    update: update2,
    subscribe: subscribe2,
    add,
    subtract,
    setDate,
    reset,
    toWritable,
    nextPage,
    prevPage
  };
}
function initAnnouncer() {
  if (!isBrowser)
    return null;
  let el = document.querySelector("[data-melt-announcer]");
  if (!isHTMLElement(el)) {
    const div = document.createElement("div");
    div.style.cssText = styleToString({
      border: "0px",
      clip: "rect(0px, 0px, 0px, 0px)",
      "clip-path": "inset(50%)",
      height: "1px",
      margin: "-1px",
      overflow: "hidden",
      padding: "0px",
      position: "absolute",
      "white-space": "nowrap",
      width: "1px"
    });
    div.setAttribute("data-melt-announcer", "");
    div.appendChild(createLog("assertive"));
    div.appendChild(createLog("polite"));
    el = div;
    document.body.insertBefore(el, document.body.firstChild);
  }
  function createLog(kind) {
    const log = document.createElement("div");
    log.role = "log";
    log.ariaLive = kind;
    log.setAttribute("aria-relevant", "additions");
    return log;
  }
  function getLog(kind) {
    if (!isHTMLElement(el))
      return null;
    const log = el.querySelector(`[aria-live="${kind}"]`);
    if (!isHTMLElement(log))
      return null;
    return log;
  }
  return {
    getLog
  };
}
function getAnnouncer() {
  const announcer = initAnnouncer();
  function announce(value, kind = "assertive", timeout = 7500) {
    if (!announcer || !isBrowser)
      return;
    const log = announcer.getLog(kind);
    const content = document.createElement("div");
    if (typeof value === "number") {
      value = value.toString();
    } else if (value === null) {
      value = "Empty";
    } else {
      value = value.trim();
    }
    content.innerText = value;
    if (kind === "assertive") {
      log?.replaceChildren(content);
    } else {
      log?.appendChild(content);
    }
    return setTimeout(() => {
      content.remove();
    }, timeout);
  }
  return {
    announce
  };
}
function isCalendarCell(node) {
  if (!isHTMLElement(node))
    return false;
  if (!node.hasAttribute("data-melt-calendar-cell"))
    return false;
  return true;
}
function getDaysBetween(start, end) {
  const days = [];
  let dCurrent = start.add({ days: 1 });
  const dEnd = end;
  while (dCurrent.compare(dEnd) < 0) {
    days.push(dCurrent);
    dCurrent = dCurrent.add({ days: 1 });
  }
  return days;
}
function createMonth(props) {
  const { dateObj, weekStartsOn, fixedWeeks, locale } = props;
  const daysInMonth = getDaysInMonth(dateObj);
  const datesArray = Array.from({ length: daysInMonth }, (_, i) => dateObj.set({ day: i + 1 }));
  const firstDayOfMonth = startOfMonth(dateObj);
  const lastDayOfMonth = endOfMonth(dateObj);
  const lastSunday = getLastFirstDayOfWeek(firstDayOfMonth, weekStartsOn, locale);
  const nextSaturday = getNextLastDayOfWeek(lastDayOfMonth, weekStartsOn, locale);
  const lastMonthDays = getDaysBetween(lastSunday.subtract({ days: 1 }), firstDayOfMonth);
  const nextMonthDays = getDaysBetween(lastDayOfMonth, nextSaturday.add({ days: 1 }));
  const totalDays = lastMonthDays.length + datesArray.length + nextMonthDays.length;
  if (fixedWeeks && totalDays < 42) {
    const extraDays = 42 - totalDays;
    let startFrom = nextMonthDays[nextMonthDays.length - 1];
    if (!startFrom) {
      startFrom = dateObj.add({ months: 1 }).set({ day: 1 });
    }
    const extraDaysArray = Array.from({ length: extraDays }, (_, i) => {
      const incr = i + 1;
      return startFrom.add({ days: incr });
    });
    nextMonthDays.push(...extraDaysArray);
  }
  const allDays = lastMonthDays.concat(datesArray, nextMonthDays);
  const weeks = chunk(allDays, 7);
  return {
    value: dateObj,
    dates: allDays,
    weeks
  };
}
function createMonths(props) {
  const { numberOfMonths, dateObj, ...monthProps } = props;
  const months = [];
  if (!numberOfMonths || numberOfMonths === 1) {
    months.push(createMonth({
      ...monthProps,
      dateObj
    }));
    return months;
  }
  months.push(createMonth({
    ...monthProps,
    dateObj
  }));
  for (let i = 1; i < numberOfMonths; i++) {
    const nextMonth = dateObj.add({ months: i });
    months.push(createMonth({
      ...monthProps,
      dateObj: nextMonth
    }));
  }
  return months;
}
function getSelectableCells(calendarId) {
  const node = document.getElementById(calendarId);
  if (!node)
    return [];
  const selectableSelector = `[data-melt-calendar-cell]:not([data-disabled]):not([data-outside-visible-months])`;
  return Array.from(node.querySelectorAll(selectableSelector)).filter((el) => isHTMLElement(el));
}
function setPlaceholderToNodeValue(node, placeholder) {
  const cellValue = node.getAttribute("data-value");
  if (!cellValue)
    return;
  placeholder.set(parseStringToDateValue(cellValue, get_store_value(placeholder)));
}
const defaults$4 = {
  isDateDisabled: void 0,
  isDateUnavailable: void 0,
  value: void 0,
  preventDeselect: false,
  numberOfMonths: 1,
  pagedNavigation: false,
  weekStartsOn: 0,
  fixedWeeks: false,
  calendarLabel: "Event Date",
  locale: "en",
  minValue: void 0,
  maxValue: void 0,
  disabled: false,
  readonly: false,
  weekdayFormat: "narrow"
};
const { name: name$4 } = createElHelpers("calendar");
const calendarIdParts = ["calendar", "accessibleHeading"];
function createCalendar(props) {
  const withDefaults = { ...defaults$4, ...props };
  const options = toWritableStores({
    ...omit(withDefaults, "value", "placeholder", "multiple", "ids"),
    multiple: withDefaults.multiple ?? false
  });
  const { preventDeselect, numberOfMonths, pagedNavigation, weekStartsOn, fixedWeeks, calendarLabel, locale, minValue, maxValue, multiple, isDateUnavailable, disabled, readonly: readonly2, weekdayFormat } = options;
  const ids = toWritableStores({ ...generateIds(calendarIdParts), ...withDefaults.ids });
  const defaultDate = getDefaultDate({
    defaultPlaceholder: withDefaults.defaultPlaceholder,
    defaultValue: withDefaults.defaultValue
  });
  const formatter = createFormatter(withDefaults.locale);
  const valueWritable = withDefaults.value ?? writable(withDefaults.defaultValue);
  const value = overridable(valueWritable, withDefaults.onValueChange);
  const placeholderWritable = withDefaults.placeholder ?? writable(withDefaults.defaultPlaceholder ?? defaultDate);
  const placeholder = dateStore(overridable(placeholderWritable, withDefaults.onPlaceholderChange), withDefaults.defaultPlaceholder ?? defaultDate);
  const months = withGet(writable(createMonths({
    dateObj: placeholder.get(),
    weekStartsOn: withDefaults.weekStartsOn,
    locale: withDefaults.locale,
    fixedWeeks: withDefaults.fixedWeeks,
    numberOfMonths: withDefaults.numberOfMonths
  })));
  const visibleMonths = withGet.derived([months], ([$months]) => {
    return $months.map((month) => {
      return month.value;
    });
  });
  const isOutsideVisibleMonths = derived([visibleMonths], ([$visibleMonths]) => {
    return (date) => {
      return !$visibleMonths.some((month) => isSameMonth(date, month));
    };
  });
  const isNextButtonDisabled = withGet.derived([months, maxValue, disabled], ([$months, $maxValue, $disabled]) => {
    if (!$maxValue || !$months.length)
      return false;
    if ($disabled)
      return true;
    const lastMonthInView = $months[$months.length - 1].value;
    const firstMonthOfNextPage = lastMonthInView.add({ months: 1 }).set({ day: 1 });
    return isAfter(firstMonthOfNextPage, $maxValue);
  });
  const isPrevButtonDisabled = withGet.derived([months, minValue, disabled], ([$months, $minValue, $disabled]) => {
    if (!$minValue || !$months.length)
      return false;
    if ($disabled)
      return true;
    const firstMonthInView = $months[0].value;
    const lastMonthOfPrevPage = firstMonthInView.subtract({ months: 1 }).set({ day: 35 });
    return isBefore(lastMonthOfPrevPage, $minValue);
  });
  const isDateDisabled = withGet.derived([options.isDateDisabled, minValue, maxValue, disabled], ([$isDateDisabled, $minValue, $maxValue, $disabled]) => {
    return (date) => {
      if ($isDateDisabled?.(date) || $disabled)
        return true;
      if ($minValue && isBefore(date, $minValue))
        return true;
      if ($maxValue && isBefore($maxValue, date))
        return true;
      return false;
    };
  });
  const isDateSelected = derived([value], ([$value]) => {
    return (date) => {
      if (Array.isArray($value)) {
        return $value.some((d) => isSameDay(d, date));
      } else if (!$value) {
        return false;
      } else {
        return isSameDay($value, date);
      }
    };
  });
  const isInvalid = derived([value, isDateDisabled, options.isDateUnavailable], ([$value, $isDateDisabled, $isDateUnavailable]) => {
    if (Array.isArray($value)) {
      if (!$value.length)
        return false;
      for (const date of $value) {
        if ($isDateDisabled?.(date))
          return true;
        if ($isDateUnavailable?.(date))
          return true;
      }
    } else {
      if (!$value)
        return false;
      if ($isDateDisabled?.($value))
        return true;
      if ($isDateUnavailable?.($value))
        return true;
    }
    return false;
  });
  let announcer = getAnnouncer();
  const headingValue = withGet.derived([months, locale], ([$months, $locale]) => {
    if (!$months.length)
      return "";
    if ($locale !== formatter.getLocale()) {
      formatter.setLocale($locale);
    }
    if ($months.length === 1) {
      const month = $months[0].value;
      return `${formatter.fullMonthAndYear(toDate(month))}`;
    }
    const startMonth = toDate($months[0].value);
    const endMonth = toDate($months[$months.length - 1].value);
    const startMonthName = formatter.fullMonth(startMonth);
    const endMonthName = formatter.fullMonth(endMonth);
    const startMonthYear = formatter.fullYear(startMonth);
    const endMonthYear = formatter.fullYear(endMonth);
    const content = startMonthYear === endMonthYear ? `${startMonthName} - ${endMonthName} ${endMonthYear}` : `${startMonthName} ${startMonthYear} - ${endMonthName} ${endMonthYear}`;
    return content;
  });
  const fullCalendarLabel = withGet.derived([headingValue, calendarLabel], ([$headingValue, $calendarLabel]) => {
    return `${$calendarLabel}, ${$headingValue}`;
  });
  const calendar = makeElement(name$4(), {
    stores: [fullCalendarLabel, isInvalid, disabled, readonly2, ids.calendar],
    returned: ([$fullCalendarLabel, $isInvalid, $disabled, $readonly, $calendarId]) => {
      return {
        id: $calendarId,
        role: "application",
        "aria-label": $fullCalendarLabel,
        "data-invalid": $isInvalid ? "" : void 0,
        "data-disabled": $disabled ? "" : void 0,
        "data-readonly": $readonly ? "" : void 0
      };
    },
    action: (node) => {
      createAccessibleHeading(node, fullCalendarLabel.get());
      announcer = getAnnouncer();
      const unsubKb = addMeltEventListener(node, "keydown", handleCalendarKeydown);
      return {
        destroy() {
          unsubKb();
        }
      };
    }
  });
  const heading = makeElement(name$4("heading"), {
    stores: [disabled],
    returned: ([$disabled]) => {
      return {
        "aria-hidden": true,
        "data-disabled": $disabled ? "" : void 0
      };
    }
  });
  const grid = makeElement(name$4("grid"), {
    stores: [readonly2, disabled],
    returned: ([$readonly, $disabled]) => {
      return {
        tabindex: -1,
        role: "grid",
        "aria-readonly": $readonly ? "true" : void 0,
        "aria-disabled": $disabled ? "true" : void 0,
        "data-readonly": $readonly ? "" : void 0,
        "data-disabled": $disabled ? "" : void 0
      };
    }
  });
  const prevButton = makeElement(name$4("prevButton"), {
    stores: [isPrevButtonDisabled],
    returned: ([$isPrevButtonDisabled]) => {
      const disabled2 = $isPrevButtonDisabled;
      return {
        role: "button",
        type: "button",
        "aria-label": "Previous",
        "aria-disabled": disabled2 ? "true" : void 0,
        "data-disabled": disabled2 ? "" : void 0,
        disabled: disabled2 ? true : void 0
      };
    },
    action: (node) => {
      const unsub = executeCallbacks(addMeltEventListener(node, "click", () => {
        if (isPrevButtonDisabled.get())
          return;
        prevPage();
      }));
      return {
        destroy: unsub
      };
    }
  });
  const nextButton = makeElement(name$4("nextButton"), {
    stores: [isNextButtonDisabled],
    returned: ([$isNextButtonDisabled]) => {
      const disabled2 = $isNextButtonDisabled;
      return {
        role: "button",
        type: "button",
        "aria-label": "Next",
        "aria-disabled": disabled2 ? "true" : void 0,
        "data-disabled": disabled2 ? "" : void 0,
        disabled: disabled2 ? true : void 0
      };
    },
    action: (node) => {
      const unsub = executeCallbacks(addMeltEventListener(node, "click", () => {
        if (isNextButtonDisabled.get())
          return;
        nextPage();
      }));
      return {
        destroy: unsub
      };
    }
  });
  const cell = makeElement(name$4("cell"), {
    stores: [
      isDateSelected,
      isDateDisabled,
      isDateUnavailable,
      isOutsideVisibleMonths,
      placeholder
    ],
    returned: ([$isDateSelected, $isDateDisabled, $isDateUnavailable, $isOutsideVisibleMonths, $placeholder]) => {
      return (cellValue, monthValue) => {
        const cellDate = toDate(cellValue);
        const isDisabled = $isDateDisabled?.(cellValue);
        const isUnavailable = $isDateUnavailable?.(cellValue);
        const isDateToday = isToday(cellValue, getLocalTimeZone());
        const isOutsideMonth = !isSameMonth(cellValue, monthValue);
        const isOutsideVisibleMonths2 = $isOutsideVisibleMonths(cellValue);
        const isFocusedDate = isSameDay(cellValue, $placeholder);
        const isSelectedDate = $isDateSelected(cellValue);
        const labelText = formatter.custom(cellDate, {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric"
        });
        return {
          role: "button",
          "aria-label": labelText,
          "aria-selected": isSelectedDate ? true : void 0,
          "aria-disabled": isOutsideMonth || isDisabled || isUnavailable ? true : void 0,
          "data-selected": isSelectedDate ? true : void 0,
          "data-value": cellValue.toString(),
          "data-disabled": isDisabled || isOutsideMonth ? "" : void 0,
          "data-unavailable": isUnavailable ? "" : void 0,
          "data-today": isDateToday ? "" : void 0,
          "data-outside-month": isOutsideMonth ? "" : void 0,
          "data-outside-visible-months": isOutsideVisibleMonths2 ? "" : void 0,
          "data-focused": isFocusedDate ? "" : void 0,
          tabindex: isFocusedDate ? 0 : isOutsideMonth || isDisabled ? void 0 : -1
        };
      };
    },
    action: (node) => {
      const getElArgs = () => {
        const value2 = node.getAttribute("data-value");
        const label = node.getAttribute("data-label");
        const disabled2 = node.hasAttribute("data-disabled");
        return {
          value: value2,
          label: label ?? node.textContent ?? null,
          disabled: disabled2 ? true : false
        };
      };
      const unsub = executeCallbacks(addMeltEventListener(node, "click", () => {
        const args = getElArgs();
        if (args.disabled)
          return;
        if (!args.value)
          return;
        handleCellClick(parseStringToDateValue(args.value, placeholder.get()));
      }));
      return {
        destroy: unsub
      };
    }
  });
  effect([locale], ([$locale]) => {
    if (formatter.getLocale() === $locale)
      return;
    formatter.setLocale($locale);
  });
  effect([placeholder], ([$placeholder]) => {
    if (!isBrowser || !$placeholder)
      return;
    const $visibleMonths = visibleMonths.get();
    if ($visibleMonths.some((month) => isSameMonth(month, $placeholder))) {
      return;
    }
    const $weekStartsOn = weekStartsOn.get();
    const $locale = locale.get();
    const $fixedWeeks = fixedWeeks.get();
    const $numberOfMonths = numberOfMonths.get();
    const defaultMonthProps = {
      weekStartsOn: $weekStartsOn,
      locale: $locale,
      fixedWeeks: $fixedWeeks,
      numberOfMonths: $numberOfMonths
    };
    months.set(createMonths({
      ...defaultMonthProps,
      dateObj: $placeholder
    }));
  });
  effect([weekStartsOn, locale, fixedWeeks, numberOfMonths], ([$weekStartsOn, $locale, $fixedWeeks, $numberOfMonths]) => {
    const $placeholder = placeholder.get();
    if (!isBrowser || !$placeholder)
      return;
    const defaultMonthProps = {
      weekStartsOn: $weekStartsOn,
      locale: $locale,
      fixedWeeks: $fixedWeeks,
      numberOfMonths: $numberOfMonths
    };
    months.set(createMonths({
      ...defaultMonthProps,
      dateObj: $placeholder
    }));
  });
  effect([fullCalendarLabel], ([$fullCalendarLabel]) => {
    if (!isBrowser)
      return;
    const node = document.getElementById(ids.accessibleHeading.get());
    if (!isHTMLElement(node))
      return;
    node.textContent = $fullCalendarLabel;
  });
  effect([value], ([$value]) => {
    if (Array.isArray($value) && $value.length) {
      const lastValue = $value[$value.length - 1];
      if (lastValue && placeholder.get() !== lastValue) {
        placeholder.set(lastValue);
      }
    } else if (!Array.isArray($value) && $value && placeholder.get() !== $value) {
      placeholder.set($value);
    }
  });
  const weekdays = derived([months, weekdayFormat, locale], ([$months, $weekdayFormat, _]) => {
    if (!$months.length)
      return [];
    return $months[0].weeks[0].map((date) => {
      return formatter.dayOfWeek(toDate(date), $weekdayFormat);
    });
  });
  function createAccessibleHeading(node, label) {
    if (!isBrowser)
      return;
    const div = document.createElement("div");
    div.style.cssText = styleToString({
      border: "0px",
      clip: "rect(0px, 0px, 0px, 0px)",
      "clip-path": "inset(50%)",
      height: "1px",
      margin: "-1px",
      overflow: "hidden",
      padding: "0px",
      position: "absolute",
      "white-space": "nowrap",
      width: "1px"
    });
    const h2 = document.createElement("div");
    h2.textContent = label;
    h2.id = ids.accessibleHeading.get();
    h2.role = "heading";
    h2.ariaLevel = "2";
    node.insertBefore(div, node.firstChild);
    div.appendChild(h2);
  }
  function nextPage() {
    const $months = months.get();
    const $numberOfMonths = numberOfMonths.get();
    if (pagedNavigation.get()) {
      const firstMonth = $months[0].value;
      placeholder.set(firstMonth.add({ months: $numberOfMonths }));
    } else {
      const firstMonth = $months[0].value;
      const newMonths = createMonths({
        dateObj: firstMonth.add({ months: 1 }),
        weekStartsOn: weekStartsOn.get(),
        locale: locale.get(),
        fixedWeeks: fixedWeeks.get(),
        numberOfMonths: $numberOfMonths
      });
      months.set(newMonths);
      placeholder.set(newMonths[0].value.set({ day: 1 }));
    }
  }
  function prevPage() {
    const $months = months.get();
    const $numberOfMonths = numberOfMonths.get();
    if (pagedNavigation.get()) {
      const firstMonth = $months[0].value;
      placeholder.set(firstMonth.subtract({ months: $numberOfMonths }));
    } else {
      const firstMonth = $months[0].value;
      const newMonths = createMonths({
        dateObj: firstMonth.subtract({ months: 1 }),
        weekStartsOn: weekStartsOn.get(),
        locale: locale.get(),
        fixedWeeks: fixedWeeks.get(),
        numberOfMonths: $numberOfMonths
      });
      months.set(newMonths);
      placeholder.set(newMonths[0].value.set({ day: 1 }));
    }
  }
  function nextYear() {
    placeholder.add({ years: 1 });
  }
  function prevYear() {
    placeholder.subtract({ years: 1 });
  }
  const ARROW_KEYS = [kbd.ARROW_DOWN, kbd.ARROW_UP, kbd.ARROW_LEFT, kbd.ARROW_RIGHT];
  function setYear(year) {
    placeholder.setDate({ year });
  }
  function setMonth(month) {
    placeholder.setDate({ month });
  }
  function handleCellClick(date) {
    const $readonly = readonly2.get();
    if ($readonly)
      return;
    const $isDateDisabled = isDateDisabled.get();
    const $isUnavailable = options.isDateUnavailable.get();
    if ($isDateDisabled?.(date) || $isUnavailable?.(date))
      return;
    value.update((prev) => {
      const $multiple = multiple.get();
      if ($multiple) {
        return handleMultipleUpdate(prev, date);
      } else {
        const next = handleSingleUpdate(prev, date);
        if (!next) {
          announcer.announce("Selected date is now empty.", "polite", 5e3);
        } else {
          announcer.announce(`Selected Date: ${formatter.selectedDate(next, false)}`, "polite");
        }
        return next;
      }
    });
  }
  function handleSingleUpdate(prev, date) {
    if (Array.isArray(prev))
      throw new Error("Invalid value for multiple prop.");
    if (!prev)
      return date;
    const $preventDeselect = preventDeselect.get();
    if (!$preventDeselect && isSameDay(prev, date)) {
      placeholder.set(date);
      return void 0;
    }
    return date;
  }
  function handleMultipleUpdate(prev, date) {
    if (!prev)
      return [date];
    if (!Array.isArray(prev))
      throw new Error("Invalid value for multiple prop.");
    const index = prev.findIndex((d) => isSameDay(d, date));
    const $preventDeselect = preventDeselect.get();
    if (index === -1) {
      return [...prev, date];
    } else if ($preventDeselect) {
      return prev;
    } else {
      const next = prev.filter((d) => !isSameDay(d, date));
      if (!next.length) {
        placeholder.set(date);
        return void 0;
      }
      return next;
    }
  }
  const SELECT_KEYS = [kbd.ENTER, kbd.SPACE];
  function handleCalendarKeydown(e) {
    const currentCell = e.target;
    if (!isCalendarCell(currentCell))
      return;
    if (!ARROW_KEYS.includes(e.key) && !SELECT_KEYS.includes(e.key))
      return;
    e.preventDefault();
    if (e.key === kbd.ARROW_DOWN) {
      shiftFocus(currentCell, 7);
    }
    if (e.key === kbd.ARROW_UP) {
      shiftFocus(currentCell, -7);
    }
    if (e.key === kbd.ARROW_LEFT) {
      shiftFocus(currentCell, -1);
    }
    if (e.key === kbd.ARROW_RIGHT) {
      shiftFocus(currentCell, 1);
    }
    if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
      const cellValue = currentCell.getAttribute("data-value");
      if (!cellValue)
        return;
      handleCellClick(parseStringToDateValue(cellValue, placeholder.get()));
    }
  }
  function shiftFocus(node, add) {
    const candidateCells = getSelectableCells(ids.calendar.get());
    if (!candidateCells.length)
      return;
    const index = candidateCells.indexOf(node);
    const nextIndex = index + add;
    if (isValidIndex(nextIndex, candidateCells)) {
      const nextCell = candidateCells[nextIndex];
      setPlaceholderToNodeValue(nextCell, placeholder);
      return nextCell.focus();
    }
    if (nextIndex < 0) {
      if (isPrevButtonDisabled.get())
        return;
      const $months = months.get();
      const firstMonth = $months[0].value;
      const $numberOfMonths = numberOfMonths.get();
      placeholder.set(firstMonth.subtract({ months: $numberOfMonths }));
      tick().then(() => {
        const newCandidateCells = getSelectableCells(ids.calendar.get());
        if (!newCandidateCells.length) {
          return;
        }
        const newIndex = newCandidateCells.length - Math.abs(nextIndex);
        if (isValidIndex(newIndex, newCandidateCells)) {
          const newCell = newCandidateCells[newIndex];
          setPlaceholderToNodeValue(newCell, placeholder);
          return newCell.focus();
        }
      });
    }
    if (nextIndex >= candidateCells.length) {
      if (isNextButtonDisabled.get())
        return;
      const $months = months.get();
      const firstMonth = $months[0].value;
      const $numberOfMonths = numberOfMonths.get();
      placeholder.set(firstMonth.add({ months: $numberOfMonths }));
      tick().then(() => {
        const newCandidateCells = getSelectableCells(ids.calendar.get());
        if (!newCandidateCells.length) {
          return;
        }
        const newIndex = nextIndex - candidateCells.length;
        if (isValidIndex(newIndex, newCandidateCells)) {
          const nextCell = newCandidateCells[newIndex];
          return nextCell.focus();
        }
      });
    }
  }
  const _isDateDisabled = derived([isDateDisabled, placeholder, minValue, maxValue, disabled], ([$isDateDisabled, $placeholder, $minValue, $maxValue, $disabled]) => {
    return (date) => {
      if ($isDateDisabled?.(date) || $disabled)
        return true;
      if ($minValue && isBefore(date, $minValue))
        return true;
      if ($maxValue && isAfter(date, $maxValue))
        return true;
      if (!isSameMonth(date, $placeholder))
        return true;
      return false;
    };
  });
  const _isDateUnavailable = derived(isDateUnavailable, ($isDateUnavailable) => {
    return (date) => $isDateUnavailable?.(date);
  });
  return {
    elements: {
      calendar,
      heading,
      grid,
      cell,
      nextButton,
      prevButton
    },
    states: {
      placeholder: placeholder.toWritable(),
      months,
      value,
      weekdays,
      headingValue
    },
    helpers: {
      nextPage,
      prevPage,
      nextYear,
      prevYear,
      setYear,
      setMonth,
      isDateDisabled: _isDateDisabled,
      isDateSelected,
      isDateUnavailable: _isDateUnavailable
    },
    options,
    ids
  };
}
({
  isDateDisabled: void 0,
  isDateUnavailable: void 0,
  value: void 0,
  positioning: {
    placement: "bottom"
  },
  closeOnEscape: true,
  closeOnOutsideClick: true,
  onOutsideClick: void 0,
  preventScroll: false,
  forceVisible: false,
  locale: "en",
  granularity: void 0,
  disabled: false,
  readonly: false,
  minValue: void 0,
  maxValue: void 0,
  weekdayFormat: "narrow",
  ...omit(defaults$4, "isDateDisabled", "isDateUnavailable", "value", "locale", "disabled", "readonly", "minValue", "maxValue", "weekdayFormat")
});
const { name: name$3 } = createElHelpers("dialog");
const defaults$3 = {
  preventScroll: true,
  closeOnEscape: true,
  closeOnOutsideClick: true,
  role: "dialog",
  defaultOpen: false,
  portal: void 0,
  forceVisible: false,
  openFocus: void 0,
  closeFocus: void 0,
  onOutsideClick: void 0
};
const dialogIdParts = ["content", "title", "description"];
function createDialog(props) {
  const withDefaults = { ...defaults$3, ...props };
  const options = toWritableStores(omit(withDefaults, "ids"));
  const { preventScroll, closeOnEscape, closeOnOutsideClick, role, portal, forceVisible, openFocus, closeFocus, onOutsideClick } = options;
  const activeTrigger = withGet.writable(null);
  const ids = toWritableStores({
    ...generateIds(dialogIdParts),
    ...withDefaults.ids
  });
  const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
  const open = overridable(openWritable, withDefaults?.onOpenChange);
  const isVisible = derived([open, forceVisible], ([$open, $forceVisible]) => {
    return $open || $forceVisible;
  });
  let unsubScroll = noop;
  function handleOpen(e) {
    const el = e.currentTarget;
    const triggerEl = e.currentTarget;
    if (!isHTMLElement(el) || !isHTMLElement(triggerEl))
      return;
    open.set(true);
    activeTrigger.set(triggerEl);
  }
  function handleClose() {
    open.set(false);
    handleFocus({
      prop: closeFocus.get(),
      defaultEl: activeTrigger.get()
    });
  }
  const trigger = makeElement(name$3("trigger"), {
    stores: [open],
    returned: ([$open]) => {
      return {
        "aria-haspopup": "dialog",
        "aria-expanded": $open,
        type: "button"
      };
    },
    action: (node) => {
      const unsub = executeCallbacks(addMeltEventListener(node, "click", (e) => {
        handleOpen(e);
      }), addMeltEventListener(node, "keydown", (e) => {
        if (e.key !== kbd.ENTER && e.key !== kbd.SPACE)
          return;
        e.preventDefault();
        handleOpen(e);
      }));
      return {
        destroy: unsub
      };
    }
  });
  const overlay = makeElement(name$3("overlay"), {
    stores: [isVisible, open],
    returned: ([$isVisible, $open]) => {
      return {
        hidden: $isVisible ? void 0 : true,
        tabindex: -1,
        style: styleToString({
          display: $isVisible ? void 0 : "none"
        }),
        "aria-hidden": true,
        "data-state": $open ? "open" : "closed"
      };
    },
    action: (node) => {
      let unsubEscapeKeydown = noop;
      if (closeOnEscape.get()) {
        const escapeKeydown = useEscapeKeydown(node, {
          handler: () => {
            handleClose();
          }
        });
        if (escapeKeydown && escapeKeydown.destroy) {
          unsubEscapeKeydown = escapeKeydown.destroy;
        }
      }
      return {
        destroy() {
          unsubEscapeKeydown();
        }
      };
    }
  });
  const content = makeElement(name$3("content"), {
    stores: [isVisible, ids.content, ids.description, ids.title, open],
    returned: ([$isVisible, $contentId, $descriptionId, $titleId, $open]) => {
      return {
        id: $contentId,
        role: role.get(),
        "aria-describedby": $descriptionId,
        "aria-labelledby": $titleId,
        "aria-modal": $isVisible ? "true" : void 0,
        "data-state": $open ? "open" : "closed",
        tabindex: -1,
        hidden: $isVisible ? void 0 : true,
        style: styleToString({
          display: $isVisible ? void 0 : "none"
        })
      };
    },
    action: (node) => {
      let activate = noop;
      let deactivate = noop;
      const destroy = executeCallbacks(effect([open], ([$open]) => {
        if (!$open)
          return;
        const focusTrap = createFocusTrap({
          immediate: false,
          escapeDeactivates: true,
          clickOutsideDeactivates: true,
          returnFocusOnDeactivate: false,
          fallbackFocus: node
        });
        activate = focusTrap.activate;
        deactivate = focusTrap.deactivate;
        const ac = focusTrap.useFocusTrap(node);
        if (ac && ac.destroy) {
          return ac.destroy;
        } else {
          return focusTrap.deactivate;
        }
      }), effect([closeOnOutsideClick, open], ([$closeOnOutsideClick, $open]) => {
        return useModal(node, {
          open: $open,
          closeOnInteractOutside: $closeOnOutsideClick,
          onClose() {
            handleClose();
          },
          shouldCloseOnInteractOutside(e) {
            onOutsideClick.get()?.(e);
            if (e.defaultPrevented)
              return false;
            return true;
          }
        }).destroy;
      }), effect([closeOnEscape], ([$closeOnEscape]) => {
        if (!$closeOnEscape)
          return noop;
        const escapeKeydown = useEscapeKeydown(node, {
          handler: () => {
            handleClose();
          }
        });
        if (escapeKeydown && escapeKeydown.destroy) {
          return escapeKeydown.destroy;
        }
        return noop;
      }), effect([isVisible], ([$isVisible]) => {
        tick().then(() => {
          if (!$isVisible) {
            deactivate();
          } else {
            activate();
          }
        });
      }));
      return {
        destroy: () => {
          unsubScroll();
          destroy();
        }
      };
    }
  });
  const portalled = makeElement(name$3("portalled"), {
    stores: portal,
    returned: ($portal) => ({
      "data-portal": portalAttr($portal)
    }),
    action: (node) => {
      const unsubPortal = effect([portal], ([$portal]) => {
        if ($portal === null)
          return noop;
        const portalDestination = getPortalDestination(node, $portal);
        if (portalDestination === null)
          return noop;
        const portalAction = usePortal(node, portalDestination);
        if (portalAction && portalAction.destroy) {
          return portalAction.destroy;
        } else {
          return noop;
        }
      });
      return {
        destroy() {
          unsubPortal();
        }
      };
    }
  });
  const title = makeElement(name$3("title"), {
    stores: [ids.title],
    returned: ([$titleId]) => ({
      id: $titleId
    })
  });
  const description = makeElement(name$3("description"), {
    stores: [ids.description],
    returned: ([$descriptionId]) => ({
      id: $descriptionId
    })
  });
  const close = makeElement(name$3("close"), {
    returned: () => ({
      type: "button"
    }),
    action: (node) => {
      const unsub = executeCallbacks(addMeltEventListener(node, "click", () => {
        handleClose();
      }), addMeltEventListener(node, "keydown", (e) => {
        if (e.key !== kbd.SPACE && e.key !== kbd.ENTER)
          return;
        e.preventDefault();
        handleClose();
      }));
      return {
        destroy: unsub
      };
    }
  });
  effect([open, preventScroll], ([$open, $preventScroll]) => {
    if (!isBrowser)
      return;
    if ($preventScroll && $open)
      unsubScroll = removeScroll();
    if ($open) {
      const contentEl = document.getElementById(ids.content.get());
      handleFocus({ prop: openFocus.get(), defaultEl: contentEl });
    }
    return () => {
      if (!forceVisible.get()) {
        unsubScroll();
      }
    };
  });
  return {
    ids,
    elements: {
      content,
      trigger,
      title,
      description,
      overlay,
      close,
      portalled
    },
    states: {
      open
    },
    options
  };
}
const { name: name$2 } = createElHelpers("hover-card");
const defaults$2 = {
  defaultOpen: false,
  openDelay: 1e3,
  closeDelay: 100,
  positioning: {
    placement: "bottom"
  },
  arrowSize: 8,
  closeOnOutsideClick: true,
  forceVisible: false,
  portal: void 0,
  closeOnEscape: true,
  onOutsideClick: void 0
};
const linkPreviewIdParts = ["trigger", "content"];
function createLinkPreview(props = {}) {
  const withDefaults = { ...defaults$2, ...props };
  const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
  const open = overridable(openWritable, withDefaults?.onOpenChange);
  const hasSelection = withGet.writable(false);
  const isPointerDownOnContent = withGet.writable(false);
  const containSelection = writable(false);
  const activeTrigger = writable(null);
  const options = toWritableStores(omit(withDefaults, "ids"));
  const { openDelay, closeDelay, positioning, arrowSize, closeOnOutsideClick, forceVisible, portal, closeOnEscape, onOutsideClick } = options;
  const ids = toWritableStores({ ...generateIds(linkPreviewIdParts), ...withDefaults.ids });
  let timeout = null;
  let originalBodyUserSelect;
  const handleOpen = withGet.derived(openDelay, ($openDelay) => {
    return () => {
      if (timeout) {
        window.clearTimeout(timeout);
        timeout = null;
      }
      timeout = window.setTimeout(() => {
        open.set(true);
      }, $openDelay);
    };
  });
  const handleClose = withGet.derived([closeDelay, isPointerDownOnContent, hasSelection], ([$closeDelay, $isPointerDownOnContent, $hasSelection]) => {
    return () => {
      if (timeout) {
        window.clearTimeout(timeout);
        timeout = null;
      }
      if (!$isPointerDownOnContent && !$hasSelection) {
        timeout = window.setTimeout(() => {
          open.set(false);
        }, $closeDelay);
      }
    };
  });
  const trigger = makeElement(name$2("trigger"), {
    stores: [open, ids.trigger, ids.content],
    returned: ([$open, $triggerId, $contentId]) => {
      return {
        role: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": $open,
        "data-state": $open ? "open" : "closed",
        "aria-controls": $contentId,
        id: $triggerId
      };
    },
    action: (node) => {
      const unsub = executeCallbacks(addMeltEventListener(node, "pointerenter", (e) => {
        if (isTouch(e))
          return;
        handleOpen.get()();
      }), addMeltEventListener(node, "pointerleave", (e) => {
        if (isTouch(e))
          return;
        handleClose.get()();
      }), addMeltEventListener(node, "focus", (e) => {
        if (!isElement(e.currentTarget) || !isFocusVisible(e.currentTarget))
          return;
        handleOpen.get()();
      }), addMeltEventListener(node, "blur", () => handleClose.get()()));
      return {
        destroy: unsub
      };
    }
  });
  const isVisible = derivedVisible({ open, forceVisible, activeTrigger });
  const content = makeElement(name$2("content"), {
    stores: [isVisible, portal, ids.content],
    returned: ([$isVisible, $portal, $contentId]) => {
      return {
        hidden: $isVisible ? void 0 : true,
        tabindex: -1,
        style: styleToString({
          "pointer-events": $isVisible ? void 0 : "none",
          opacity: $isVisible ? 1 : 0,
          userSelect: "text",
          WebkitUserSelect: "text"
        }),
        id: $contentId,
        "data-state": $isVisible ? "open" : "closed",
        "data-portal": portalAttr($portal)
      };
    },
    action: (node) => {
      let unsub = noop;
      const unsubTimers = () => {
        if (timeout) {
          window.clearTimeout(timeout);
        }
      };
      let unsubPopper = noop;
      const unsubDerived = effect([isVisible, activeTrigger, positioning, closeOnOutsideClick, portal, closeOnEscape], ([$isVisible, $activeTrigger, $positioning, $closeOnOutsideClick, $portal, $closeOnEscape]) => {
        unsubPopper();
        if (!$isVisible || !$activeTrigger)
          return;
        tick().then(() => {
          const popper = usePopper(node, {
            anchorElement: $activeTrigger,
            open,
            options: {
              floating: $positioning,
              modal: {
                closeOnInteractOutside: $closeOnOutsideClick,
                onClose: () => {
                  open.set(false);
                  $activeTrigger.focus();
                },
                shouldCloseOnInteractOutside: (e) => {
                  onOutsideClick.get()?.(e);
                  if (e.defaultPrevented)
                    return false;
                  if (isHTMLElement($activeTrigger) && $activeTrigger.contains(e.target))
                    return false;
                  return true;
                },
                open: $isVisible
              },
              portal: getPortalDestination(node, $portal),
              focusTrap: null,
              escapeKeydown: $closeOnEscape ? void 0 : null
            }
          });
          if (popper && popper.destroy) {
            unsubPopper = popper.destroy;
          }
        });
      });
      unsub = executeCallbacks(addMeltEventListener(node, "pointerdown", (e) => {
        const currentTarget = e.currentTarget;
        const target = e.target;
        if (!isHTMLElement(currentTarget) || !isHTMLElement(target))
          return;
        if (currentTarget.contains(target)) {
          containSelection.set(true);
        }
        hasSelection.set(false);
        isPointerDownOnContent.set(true);
      }), addMeltEventListener(node, "pointerenter", (e) => {
        if (isTouch(e))
          return;
        handleOpen.get()();
      }), addMeltEventListener(node, "pointerleave", (e) => {
        if (isTouch(e))
          return;
        handleClose.get()();
      }), addMeltEventListener(node, "focusout", (e) => {
        e.preventDefault();
      }));
      return {
        destroy() {
          unsub();
          unsubPopper();
          unsubTimers();
          unsubDerived();
        }
      };
    }
  });
  const arrow2 = makeElement(name$2("arrow"), {
    stores: arrowSize,
    returned: ($arrowSize) => ({
      "data-arrow": true,
      style: styleToString({
        position: "absolute",
        width: `var(--arrow-size, ${$arrowSize}px)`,
        height: `var(--arrow-size, ${$arrowSize}px)`
      })
    })
  });
  effect([containSelection], ([$containSelection]) => {
    if (!isBrowser || !$containSelection)
      return;
    const body = document.body;
    const contentElement = document.getElementById(ids.content.get());
    if (!contentElement)
      return;
    originalBodyUserSelect = body.style.userSelect || body.style.webkitUserSelect;
    const originalContentUserSelect = contentElement.style.userSelect || contentElement.style.webkitUserSelect;
    body.style.userSelect = "none";
    body.style.webkitUserSelect = "none";
    contentElement.style.userSelect = "text";
    contentElement.style.webkitUserSelect = "text";
    return () => {
      body.style.userSelect = originalBodyUserSelect;
      body.style.webkitUserSelect = originalBodyUserSelect;
      contentElement.style.userSelect = originalContentUserSelect;
      contentElement.style.webkitUserSelect = originalContentUserSelect;
    };
  });
  safeOnMount(() => {
    const triggerEl = document.getElementById(ids.trigger.get());
    if (!triggerEl)
      return;
    activeTrigger.set(triggerEl);
  });
  effect([open], ([$open]) => {
    if (!isBrowser || !$open) {
      hasSelection.set(false);
      return;
    }
    const handlePointerUp = () => {
      containSelection.set(false);
      isPointerDownOnContent.set(false);
      sleep(1).then(() => {
        const isSelection = document.getSelection()?.toString() !== "";
        if (isSelection) {
          hasSelection.set(true);
        }
      });
    };
    document.addEventListener("pointerup", handlePointerUp);
    const contentElement = document.getElementById(ids.content.get());
    if (!contentElement)
      return;
    const tabbables = getTabbableNodes(contentElement);
    tabbables.forEach((tabbable) => tabbable.setAttribute("tabindex", "-1"));
    return () => {
      document.removeEventListener("pointerup", handlePointerUp);
      hasSelection.set(false);
      isPointerDownOnContent.set(false);
    };
  });
  return {
    ids,
    elements: {
      trigger,
      content,
      arrow: arrow2
    },
    states: {
      open
    },
    options
  };
}
const defaults$1 = {
  positioning: {
    placement: "bottom"
  },
  arrowSize: 8,
  defaultOpen: false,
  disableFocusTrap: false,
  closeOnEscape: true,
  preventScroll: false,
  onOpenChange: void 0,
  closeOnOutsideClick: true,
  portal: void 0,
  forceVisible: false,
  openFocus: void 0,
  closeFocus: void 0,
  onOutsideClick: void 0
};
const { name: name$1 } = createElHelpers("popover");
const popoverIdParts = ["trigger", "content"];
function createPopover(args) {
  const withDefaults = { ...defaults$1, ...args };
  const options = toWritableStores(omit(withDefaults, "open", "ids"));
  const { positioning, arrowSize, disableFocusTrap, preventScroll, closeOnEscape, closeOnOutsideClick, portal, forceVisible, openFocus, closeFocus, onOutsideClick } = options;
  const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
  const open = overridable(openWritable, withDefaults?.onOpenChange);
  const activeTrigger = writable(null);
  const ids = toWritableStores({ ...generateIds(popoverIdParts), ...withDefaults.ids });
  safeOnMount(() => {
    activeTrigger.set(document.getElementById(ids.trigger.get()));
  });
  function handleClose() {
    open.set(false);
    const triggerEl = document.getElementById(ids.trigger.get());
    handleFocus({ prop: closeFocus.get(), defaultEl: triggerEl });
  }
  const isVisible = derivedVisible({ open, activeTrigger, forceVisible });
  const content = makeElement(name$1("content"), {
    stores: [isVisible, portal, ids.content],
    returned: ([$isVisible, $portal, $contentId]) => {
      return {
        hidden: $isVisible && isBrowser ? void 0 : true,
        tabindex: -1,
        style: styleToString({
          display: $isVisible ? void 0 : "none"
        }),
        id: $contentId,
        "data-state": $isVisible ? "open" : "closed",
        "data-portal": portalAttr($portal)
      };
    },
    action: (node) => {
      let unsubPopper = noop;
      const unsubDerived = effect([
        isVisible,
        activeTrigger,
        positioning,
        disableFocusTrap,
        closeOnEscape,
        closeOnOutsideClick,
        portal
      ], ([$isVisible, $activeTrigger, $positioning, $disableFocusTrap, $closeOnEscape, $closeOnOutsideClick, $portal]) => {
        unsubPopper();
        if (!$isVisible || !$activeTrigger)
          return;
        tick().then(() => {
          const popper = usePopper(node, {
            anchorElement: $activeTrigger,
            open,
            options: {
              floating: $positioning,
              focusTrap: $disableFocusTrap ? null : {
                returnFocusOnDeactivate: false,
                clickOutsideDeactivates: true,
                escapeDeactivates: true
              },
              modal: {
                shouldCloseOnInteractOutside,
                onClose: handleClose,
                open: $isVisible,
                closeOnInteractOutside: $closeOnOutsideClick
              },
              escapeKeydown: $closeOnEscape ? {
                handler: () => {
                  handleClose();
                }
              } : null,
              portal: getPortalDestination(node, $portal)
            }
          });
          if (popper && popper.destroy) {
            unsubPopper = popper.destroy;
          }
        });
      });
      return {
        destroy() {
          unsubDerived();
          unsubPopper();
        }
      };
    }
  });
  function toggleOpen(triggerEl) {
    open.update((prev) => {
      return !prev;
    });
    if (triggerEl) {
      activeTrigger.set(triggerEl);
    }
  }
  function shouldCloseOnInteractOutside(e) {
    onOutsideClick.get()?.(e);
    if (e.defaultPrevented)
      return false;
    const target = e.target;
    const triggerEl = document.getElementById(ids.trigger.get());
    if (triggerEl && isElement(target)) {
      if (target === triggerEl || triggerEl.contains(target))
        return false;
    }
    return true;
  }
  const trigger = makeElement(name$1("trigger"), {
    stores: [isVisible, ids.content, ids.trigger],
    returned: ([$isVisible, $contentId, $triggerId]) => {
      return {
        role: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": $isVisible ? "true" : "false",
        "data-state": stateAttr($isVisible),
        "aria-controls": $contentId,
        id: $triggerId
      };
    },
    action: (node) => {
      const unsub = executeCallbacks(addMeltEventListener(node, "click", () => {
        toggleOpen(node);
      }), addMeltEventListener(node, "keydown", (e) => {
        if (e.key !== kbd.ENTER && e.key !== kbd.SPACE)
          return;
        e.preventDefault();
        toggleOpen(node);
      }));
      return {
        destroy: unsub
      };
    }
  });
  const overlay = makeElement(name$1("overlay"), {
    stores: [isVisible],
    returned: ([$isVisible]) => {
      return {
        hidden: $isVisible ? void 0 : true,
        tabindex: -1,
        style: styleToString({
          display: $isVisible ? void 0 : "none"
        }),
        "aria-hidden": "true",
        "data-state": stateAttr($isVisible)
      };
    },
    action: (node) => {
      let unsubEscapeKeydown = noop;
      if (closeOnEscape.get()) {
        const escapeKeydown = useEscapeKeydown(node, {
          handler: () => {
            handleClose();
          }
        });
        if (escapeKeydown && escapeKeydown.destroy) {
          unsubEscapeKeydown = escapeKeydown.destroy;
        }
      }
      const unsubPortal = effect([portal], ([$portal]) => {
        if ($portal === null)
          return noop;
        const portalDestination = getPortalDestination(node, $portal);
        if (portalDestination === null)
          return noop;
        const portalAction = usePortal(node, portalDestination);
        if (portalAction && portalAction.destroy) {
          return portalAction.destroy;
        } else {
          return noop;
        }
      });
      return {
        destroy() {
          unsubEscapeKeydown();
          unsubPortal();
        }
      };
    }
  });
  const arrow2 = makeElement(name$1("arrow"), {
    stores: arrowSize,
    returned: ($arrowSize) => ({
      "data-arrow": true,
      style: styleToString({
        position: "absolute",
        width: `var(--arrow-size, ${$arrowSize}px)`,
        height: `var(--arrow-size, ${$arrowSize}px)`
      })
    })
  });
  const close = makeElement(name$1("close"), {
    returned: () => ({
      type: "button"
    }),
    action: (node) => {
      const unsub = executeCallbacks(addMeltEventListener(node, "click", (e) => {
        if (e.defaultPrevented)
          return;
        handleClose();
      }), addMeltEventListener(node, "keydown", (e) => {
        if (e.defaultPrevented)
          return;
        if (e.key !== kbd.ENTER && e.key !== kbd.SPACE)
          return;
        e.preventDefault();
        toggleOpen();
      }));
      return {
        destroy: unsub
      };
    }
  });
  effect([open, activeTrigger, preventScroll], ([$open, $activeTrigger, $preventScroll]) => {
    if (!isBrowser)
      return;
    const unsubs = [];
    if ($open) {
      if (!$activeTrigger) {
        tick().then(() => {
          const triggerEl2 = document.getElementById(ids.trigger.get());
          if (!isHTMLElement(triggerEl2))
            return;
          activeTrigger.set(triggerEl2);
        });
      }
      if ($preventScroll) {
        unsubs.push(removeScroll());
      }
      const triggerEl = $activeTrigger ?? document.getElementById(ids.trigger.get());
      handleFocus({ prop: openFocus.get(), defaultEl: triggerEl });
    }
    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  });
  return {
    ids,
    elements: {
      trigger,
      content,
      arrow: arrow2,
      close,
      overlay
    },
    states: {
      open
    },
    options
  };
}
function stateAttr(open) {
  return open ? "open" : "closed";
}
const defaults = {
  orientation: "vertical",
  loop: true,
  disabled: false,
  required: false,
  defaultValue: void 0
};
const prefix = "radio-group";
const { name, selector } = createElHelpers(prefix);
function createRadioGroup(props) {
  const withDefaults = { ...defaults, ...props };
  const options = toWritableStores(omit(withDefaults, "value"));
  const { disabled, required, loop, orientation } = options;
  const valueWritable = withDefaults.value ?? writable(withDefaults.defaultValue);
  const value = overridable(valueWritable, withDefaults?.onValueChange);
  safeOnMount(() => {
    return addEventListener(document, "focus", (e) => {
      const focusedItem = e.target;
      if (!isHTMLElement(focusedItem))
        return;
    });
  });
  let hasActiveTabIndex = false;
  effect(value, ($value) => {
    if ($value === void 0) {
      hasActiveTabIndex = false;
    } else {
      hasActiveTabIndex = true;
    }
  });
  const selectItem = (item2) => {
    const disabled2 = item2.dataset.disabled === "true";
    const itemValue = item2.dataset.value;
    if (disabled2 || itemValue === void 0)
      return;
    value.set(itemValue);
  };
  const root = makeElement(name(), {
    stores: [required, orientation],
    returned: ([$required, $orientation]) => {
      return {
        role: "radiogroup",
        "aria-required": $required,
        "data-orientation": $orientation
      };
    }
  });
  const item = makeElement(name("item"), {
    stores: [value, orientation, disabled],
    returned: ([$value, $orientation, $disabled]) => {
      return (props2) => {
        const itemValue = typeof props2 === "string" ? props2 : props2.value;
        const argDisabled = typeof props2 === "string" ? false : !!props2.disabled;
        const disabled2 = $disabled || argDisabled;
        const checked = $value === itemValue;
        const tabindex = !hasActiveTabIndex ? 0 : checked ? 0 : -1;
        hasActiveTabIndex = true;
        return {
          disabled: disabled2,
          "data-value": itemValue,
          "data-orientation": $orientation,
          "data-disabled": disabledAttr(disabled2),
          "data-state": checked ? "checked" : "unchecked",
          "aria-checked": checked,
          type: "button",
          role: "radio",
          tabindex
        };
      };
    },
    action: (node) => {
      const unsub = executeCallbacks(addMeltEventListener(node, "click", () => {
        selectItem(node);
      }), addMeltEventListener(node, "keydown", (e) => {
        const el = e.currentTarget;
        if (!isHTMLElement(el))
          return;
        const root2 = el.closest(selector());
        if (!isHTMLElement(root2))
          return;
        const items = Array.from(root2.querySelectorAll(selector("item"))).filter((el2) => isHTMLElement(el2) && !el2.hasAttribute("data-disabled"));
        const currentIndex = items.indexOf(el);
        const dir = getElemDirection(root2);
        const { nextKey, prevKey } = getDirectionalKeys(dir, orientation.get());
        const $loop = loop.get();
        let itemToFocus = null;
        if (e.key === nextKey) {
          e.preventDefault();
          const nextIndex = currentIndex + 1;
          if (nextIndex >= items.length && $loop) {
            itemToFocus = items[0];
          } else {
            itemToFocus = items[nextIndex];
          }
        } else if (e.key === prevKey) {
          e.preventDefault();
          const prevIndex = currentIndex - 1;
          if (prevIndex < 0 && $loop) {
            itemToFocus = items[items.length - 1];
          } else {
            itemToFocus = items[prevIndex];
          }
        } else if (e.key === kbd.HOME) {
          e.preventDefault();
          itemToFocus = items[0];
        } else if (e.key === kbd.END) {
          e.preventDefault();
          itemToFocus = items[items.length - 1];
        }
        if (itemToFocus) {
          itemToFocus.focus();
          selectItem(itemToFocus);
        }
      }));
      return {
        destroy: unsub
      };
    }
  });
  const hiddenInput = createHiddenInput({
    value,
    disabled,
    required
  });
  const isChecked = derived(value, ($value) => {
    return (itemValue) => {
      return $value === itemValue;
    };
  });
  return {
    elements: {
      root,
      item,
      hiddenInput
    },
    states: {
      value
    },
    helpers: {
      isChecked
    },
    options
  };
}
function createBitAttrs(bit, parts) {
  const attrs = {};
  parts.forEach((part) => {
    attrs[part] = {
      [`data-${bit}-${part}`]: ""
    };
  });
  return (part) => attrs[part];
}
function createDispatcher() {
  const dispatch = createEventDispatcher();
  return (e) => {
    const { originalEvent } = e.detail;
    const { cancelable } = e;
    const type = originalEvent.type;
    const shouldContinue = dispatch(type, { originalEvent, currentTarget: originalEvent.currentTarget }, { cancelable });
    if (!shouldContinue) {
      e.preventDefault();
    }
  };
}
function removeUndefined(obj) {
  const result = {};
  for (const key in obj) {
    const value = obj[key];
    if (value !== void 0) {
      result[key] = value;
    }
  }
  return result;
}
function getOptionUpdater(options) {
  return function(key, value) {
    if (value === void 0)
      return;
    const store = options[key];
    if (store) {
      store.set(value);
    }
  };
}
function getAttrs(builders) {
  const attrs = {};
  builders.forEach((builder) => {
    Object.keys(builder).forEach((key) => {
      if (key !== "action") {
        attrs[key] = builder[key];
      }
    });
  });
  return attrs;
}
const Button$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["href", "type", "builders", "el"]);
  let { href = void 0 } = $$props;
  let { type = void 0 } = $$props;
  let { builders = [] } = $$props;
  let { el = void 0 } = $$props;
  const attrs = { "data-button-root": "" };
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  if ($$props.builders === void 0 && $$bindings.builders && builders !== void 0)
    $$bindings.builders(builders);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  return `${builders && builders.length ? ` ${((tag) => {
    return tag ? `<${href ? "a" : "button"}${spread(
      [
        {
          type: escape_attribute_value(href ? void 0 : type)
        },
        { href: escape_attribute_value(href) },
        { tabindex: "0" },
        escape_object(getAttrs(builders)),
        escape_object($$restProps),
        escape_object(attrs)
      ],
      {}
    )}${add_attribute("this", el, 0)}>${is_void(tag) ? "" : `${slots.default ? slots.default({}) : ``}`}${is_void(tag) ? "" : `</${tag}>`}` : "";
  })(href ? "a" : "button")}` : ` ${((tag) => {
    return tag ? `<${href ? "a" : "button"}${spread(
      [
        {
          type: escape_attribute_value(href ? void 0 : type)
        },
        { href: escape_attribute_value(href) },
        { tabindex: "0" },
        escape_object($$restProps),
        escape_object(attrs)
      ],
      {}
    )}>${is_void(tag) ? "" : `${slots.default ? slots.default({}) : ``}`}${is_void(tag) ? "" : `</${tag}>`}` : "";
  })(href ? "a" : "button")}`}`;
});
function getCalendarData() {
  const NAME = "calendar";
  const PARTS = [
    "root",
    "prev-button",
    "next-button",
    "heading",
    "grid",
    "day",
    "header",
    "grid-head",
    "head-cell",
    "grid-body",
    "cell",
    "grid-row"
  ];
  return { NAME, PARTS };
}
function setCtx$4(props) {
  const { NAME, PARTS } = getCalendarData();
  const getCalendarAttrs = createBitAttrs(NAME, PARTS);
  const calendar = { ...createCalendar(removeUndefined(props)), getCalendarAttrs };
  setContext(NAME, calendar);
  return {
    ...calendar,
    updateOption: getOptionUpdater(calendar.options)
  };
}
function getCtx$4() {
  const { NAME } = getCalendarData();
  const ctx = getContext(NAME);
  return ctx;
}
const Calendar$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, [
    "placeholder",
    "onPlaceholderChange",
    "value",
    "onValueChange",
    "preventDeselect",
    "minValue",
    "maxValue",
    "pagedNavigation",
    "weekStartsOn",
    "locale",
    "isDateUnavailable",
    "isDateDisabled",
    "disabled",
    "readonly",
    "fixedWeeks",
    "calendarLabel",
    "weekdayFormat",
    "multiple",
    "asChild",
    "id",
    "numberOfMonths",
    "initialFocus",
    "el"
  ]);
  let $localMonths, $$unsubscribe_localMonths;
  let $calendar, $$unsubscribe_calendar;
  let $weekdays, $$unsubscribe_weekdays;
  let { placeholder = void 0 } = $$props;
  let { onPlaceholderChange = void 0 } = $$props;
  let { value = void 0 } = $$props;
  let { onValueChange = void 0 } = $$props;
  let { preventDeselect = void 0 } = $$props;
  let { minValue = void 0 } = $$props;
  let { maxValue = void 0 } = $$props;
  let { pagedNavigation = void 0 } = $$props;
  let { weekStartsOn = void 0 } = $$props;
  let { locale = void 0 } = $$props;
  let { isDateUnavailable = void 0 } = $$props;
  let { isDateDisabled = void 0 } = $$props;
  let { disabled = void 0 } = $$props;
  let { readonly: readonly2 = void 0 } = $$props;
  let { fixedWeeks = void 0 } = $$props;
  let { calendarLabel = void 0 } = $$props;
  let { weekdayFormat = void 0 } = $$props;
  let { multiple = false } = $$props;
  let { asChild = false } = $$props;
  let { id = void 0 } = $$props;
  let { numberOfMonths = void 0 } = $$props;
  let { initialFocus = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { calendar }, states: { value: localValue, placeholder: localPlaceholder, months: localMonths, weekdays }, updateOption, ids, getCalendarAttrs } = setCtx$4({
    defaultPlaceholder: placeholder,
    defaultValue: value,
    preventDeselect,
    minValue,
    maxValue,
    pagedNavigation,
    weekStartsOn,
    locale,
    isDateUnavailable,
    isDateDisabled,
    disabled,
    readonly: readonly2,
    fixedWeeks,
    calendarLabel,
    weekdayFormat,
    multiple,
    numberOfMonths,
    onPlaceholderChange: ({ next }) => {
      if (placeholder !== next) {
        onPlaceholderChange?.(next);
        placeholder = next;
      }
      return next;
    },
    onValueChange: ({ next }) => {
      if (Array.isArray(next)) {
        if (!Array.isArray(value) || !arraysAreEqual(value, next)) {
          onValueChange?.(next);
          value = next;
          return next;
        }
        return next;
      }
      if (value !== next) {
        onValueChange?.(next);
        value = next;
      }
      return next;
    }
  });
  $$unsubscribe_calendar = subscribe(calendar, (value2) => $calendar = value2);
  $$unsubscribe_localMonths = subscribe(localMonths, (value2) => $localMonths = value2);
  $$unsubscribe_weekdays = subscribe(weekdays, (value2) => $weekdays = value2);
  const attrs = getCalendarAttrs("root");
  createDispatcher();
  let months = $localMonths;
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0)
    $$bindings.placeholder(placeholder);
  if ($$props.onPlaceholderChange === void 0 && $$bindings.onPlaceholderChange && onPlaceholderChange !== void 0)
    $$bindings.onPlaceholderChange(onPlaceholderChange);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.onValueChange === void 0 && $$bindings.onValueChange && onValueChange !== void 0)
    $$bindings.onValueChange(onValueChange);
  if ($$props.preventDeselect === void 0 && $$bindings.preventDeselect && preventDeselect !== void 0)
    $$bindings.preventDeselect(preventDeselect);
  if ($$props.minValue === void 0 && $$bindings.minValue && minValue !== void 0)
    $$bindings.minValue(minValue);
  if ($$props.maxValue === void 0 && $$bindings.maxValue && maxValue !== void 0)
    $$bindings.maxValue(maxValue);
  if ($$props.pagedNavigation === void 0 && $$bindings.pagedNavigation && pagedNavigation !== void 0)
    $$bindings.pagedNavigation(pagedNavigation);
  if ($$props.weekStartsOn === void 0 && $$bindings.weekStartsOn && weekStartsOn !== void 0)
    $$bindings.weekStartsOn(weekStartsOn);
  if ($$props.locale === void 0 && $$bindings.locale && locale !== void 0)
    $$bindings.locale(locale);
  if ($$props.isDateUnavailable === void 0 && $$bindings.isDateUnavailable && isDateUnavailable !== void 0)
    $$bindings.isDateUnavailable(isDateUnavailable);
  if ($$props.isDateDisabled === void 0 && $$bindings.isDateDisabled && isDateDisabled !== void 0)
    $$bindings.isDateDisabled(isDateDisabled);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.readonly === void 0 && $$bindings.readonly && readonly2 !== void 0)
    $$bindings.readonly(readonly2);
  if ($$props.fixedWeeks === void 0 && $$bindings.fixedWeeks && fixedWeeks !== void 0)
    $$bindings.fixedWeeks(fixedWeeks);
  if ($$props.calendarLabel === void 0 && $$bindings.calendarLabel && calendarLabel !== void 0)
    $$bindings.calendarLabel(calendarLabel);
  if ($$props.weekdayFormat === void 0 && $$bindings.weekdayFormat && weekdayFormat !== void 0)
    $$bindings.weekdayFormat(weekdayFormat);
  if ($$props.multiple === void 0 && $$bindings.multiple && multiple !== void 0)
    $$bindings.multiple(multiple);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.numberOfMonths === void 0 && $$bindings.numberOfMonths && numberOfMonths !== void 0)
    $$bindings.numberOfMonths(numberOfMonths);
  if ($$props.initialFocus === void 0 && $$bindings.initialFocus && initialFocus !== void 0)
    $$bindings.initialFocus(initialFocus);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  {
    if (id) {
      ids.calendar.set(id);
    }
  }
  value !== void 0 && localValue.set(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Array.isArray(value) ? [...value] : value
  );
  placeholder !== void 0 && localPlaceholder.set(placeholder);
  {
    updateOption("preventDeselect", preventDeselect);
  }
  {
    updateOption("minValue", minValue);
  }
  {
    updateOption("maxValue", maxValue);
  }
  {
    updateOption("pagedNavigation", pagedNavigation);
  }
  {
    updateOption("weekStartsOn", weekStartsOn);
  }
  {
    updateOption("locale", locale);
  }
  {
    updateOption("isDateUnavailable", isDateUnavailable);
  }
  {
    updateOption("isDateDisabled", isDateDisabled);
  }
  {
    updateOption("disabled", disabled);
  }
  {
    updateOption("readonly", readonly2);
  }
  {
    updateOption("fixedWeeks", fixedWeeks);
  }
  {
    updateOption("calendarLabel", calendarLabel);
  }
  {
    updateOption("weekdayFormat", weekdayFormat);
  }
  {
    updateOption("numberOfMonths", numberOfMonths);
  }
  builder = $calendar;
  {
    Object.assign(builder, attrs);
  }
  months = $localMonths;
  $$unsubscribe_localMonths();
  $$unsubscribe_calendar();
  $$unsubscribe_weekdays();
  return `${asChild ? `${slots.default ? slots.default({ months, weekdays: $weekdays, builder }) : ``}` : `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ months, weekdays: $weekdays, builder }) : ``}</div>`}`;
});
const Calendar_day$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let disabled;
  let unavailable;
  let selected;
  let $$restProps = compute_rest_props($$props, ["date", "month", "asChild", "el"]);
  let $isDateSelected, $$unsubscribe_isDateSelected;
  let $isDateUnavailable, $$unsubscribe_isDateUnavailable;
  let $isDateDisabled, $$unsubscribe_isDateDisabled;
  let $cell, $$unsubscribe_cell;
  let { date } = $$props;
  let { month } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { cell }, helpers: { isDateDisabled, isDateUnavailable, isDateSelected }, getCalendarAttrs } = getCtx$4();
  $$unsubscribe_cell = subscribe(cell, (value) => $cell = value);
  $$unsubscribe_isDateDisabled = subscribe(isDateDisabled, (value) => $isDateDisabled = value);
  $$unsubscribe_isDateUnavailable = subscribe(isDateUnavailable, (value) => $isDateUnavailable = value);
  $$unsubscribe_isDateSelected = subscribe(isDateSelected, (value) => $isDateSelected = value);
  const attrs = getCalendarAttrs("day");
  createDispatcher();
  if ($$props.date === void 0 && $$bindings.date && date !== void 0)
    $$bindings.date(date);
  if ($$props.month === void 0 && $$bindings.month && month !== void 0)
    $$bindings.month(month);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  builder = $cell(date, month);
  {
    Object.assign(builder, attrs);
  }
  disabled = $isDateDisabled(date);
  unavailable = $isDateUnavailable(date);
  selected = $isDateSelected(date);
  $$unsubscribe_isDateSelected();
  $$unsubscribe_isDateUnavailable();
  $$unsubscribe_isDateDisabled();
  $$unsubscribe_cell();
  return `${asChild ? `${slots.default ? slots.default({ builder, disabled, unavailable, selected }) : ``}` : `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder, disabled, unavailable, selected }) : ` ${escape(date.day)} `}</div>`}`;
});
const Calendar_grid$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $grid, $$unsubscribe_grid;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { grid }, getCalendarAttrs } = getCtx$4();
  $$unsubscribe_grid = subscribe(grid, (value) => $grid = value);
  const attrs = getCalendarAttrs("grid");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  builder = $grid;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_grid();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<table${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</table>`}`;
});
const Calendar_grid_body$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { getCalendarAttrs } = getCtx$4();
  const attrs = getCalendarAttrs("grid-body");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  return `${asChild ? `${slots.default ? slots.default({ attrs }) : ``}` : `<tbody${spread([escape_object($$restProps), escape_object(attrs)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ attrs }) : ``}</tbody>`}`;
});
const Calendar_cell$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let attrs;
  let $$restProps = compute_rest_props($$props, ["date", "asChild", "el"]);
  let $isDateDisabled, $$unsubscribe_isDateDisabled;
  let $isDateUnavailable, $$unsubscribe_isDateUnavailable;
  let { date } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { helpers: { isDateDisabled, isDateUnavailable }, getCalendarAttrs } = getCtx$4();
  $$unsubscribe_isDateDisabled = subscribe(isDateDisabled, (value) => $isDateDisabled = value);
  $$unsubscribe_isDateUnavailable = subscribe(isDateUnavailable, (value) => $isDateUnavailable = value);
  if ($$props.date === void 0 && $$bindings.date && date !== void 0)
    $$bindings.date(date);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  attrs = {
    ...getCalendarAttrs("cell"),
    "aria-disabled": $isDateDisabled(date) || $isDateUnavailable(date),
    "data-disabled": $isDateDisabled(date) ? "" : void 0,
    role: "gridcell"
  };
  $$unsubscribe_isDateDisabled();
  $$unsubscribe_isDateUnavailable();
  return `${asChild ? `${slots.default ? slots.default({ attrs }) : ``}` : `<td${spread([escape_object($$restProps), escape_object(attrs)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ attrs }) : ``}</td>`}`;
});
const Calendar_grid_head$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { getCalendarAttrs } = getCtx$4();
  const attrs = {
    ...getCalendarAttrs("grid-head"),
    "aria-hidden": true
  };
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  return `${asChild ? `${slots.default ? slots.default({ attrs }) : ``}` : `<thead${spread([escape_object($$restProps), escape_object(attrs)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ attrs }) : ``}</thead>`}`;
});
const Calendar_head_cell$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { getCalendarAttrs } = getCtx$4();
  const attrs = getCalendarAttrs("head-cell");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  return `${asChild ? `${slots.default ? slots.default({ attrs }) : ``}` : `<th${spread([escape_object($$restProps), escape_object(attrs)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ attrs }) : ``}</th>`}`;
});
const Calendar_grid_row$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { getCalendarAttrs } = getCtx$4();
  const attrs = getCalendarAttrs("grid-row");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  return `${asChild ? `${slots.default ? slots.default({ attrs }) : ``}` : `<tr${spread([escape_object($$restProps), escape_object(attrs)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ attrs }) : ``}</tr>`}`;
});
const Calendar_header$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { getCalendarAttrs } = getCtx$4();
  const attrs = getCalendarAttrs("header");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  return `${asChild ? `${slots.default ? slots.default({ attrs }) : ``}` : `<header${spread([escape_object($$restProps), escape_object(attrs)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ attrs }) : ``}</header>`}`;
});
const Calendar_heading$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $heading, $$unsubscribe_heading;
  let $headingValue, $$unsubscribe_headingValue;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { heading }, states: { headingValue }, getCalendarAttrs } = getCtx$4();
  $$unsubscribe_heading = subscribe(heading, (value) => $heading = value);
  $$unsubscribe_headingValue = subscribe(headingValue, (value) => $headingValue = value);
  const attrs = getCalendarAttrs("heading");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  builder = $heading;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_heading();
  $$unsubscribe_headingValue();
  return `${asChild ? `${slots.default ? slots.default({ builder, headingValue: $headingValue }) : ``}` : `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder, headingValue: $headingValue }) : ` ${escape($headingValue)} `}</div>`}`;
});
const Calendar_next_button$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $nextButton, $$unsubscribe_nextButton;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { nextButton }, getCalendarAttrs } = getCtx$4();
  $$unsubscribe_nextButton = subscribe(nextButton, (value) => $nextButton = value);
  const attrs = getCalendarAttrs("next-button");
  createDispatcher();
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  builder = $nextButton;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_nextButton();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<button${spread([escape_object(builder), { type: "button" }, escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</button>`}`;
});
const Calendar_prev_button$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $prevButton, $$unsubscribe_prevButton;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { prevButton }, getCalendarAttrs } = getCtx$4();
  $$unsubscribe_prevButton = subscribe(prevButton, (value) => $prevButton = value);
  const attrs = getCalendarAttrs("prev-button");
  createDispatcher();
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  builder = $prevButton;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_prevButton();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<button${spread([escape_object(builder), { type: "button" }, escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</button>`}`;
});
function getPositioningUpdater(store) {
  return (props = {}) => {
    return updatePositioning$2(store, props);
  };
}
function updatePositioning$2(store, props) {
  const defaultPositioningProps = {
    side: "bottom",
    align: "center",
    sideOffset: 0,
    alignOffset: 0,
    sameWidth: false,
    avoidCollisions: true,
    collisionPadding: 8,
    fitViewport: false,
    strategy: "absolute",
    overlap: false
  };
  const withDefaults = { ...defaultPositioningProps, ...props };
  store.update((prev) => {
    return {
      ...prev,
      placement: joinPlacement(withDefaults.side, withDefaults.align),
      offset: {
        ...prev.offset,
        mainAxis: withDefaults.sideOffset,
        crossAxis: withDefaults.alignOffset
      },
      gutter: 0,
      sameWidth: withDefaults.sameWidth,
      flip: withDefaults.avoidCollisions,
      overflowPadding: withDefaults.collisionPadding,
      boundary: withDefaults.collisionBoundary,
      fitViewport: withDefaults.fitViewport,
      strategy: withDefaults.strategy,
      overlap: withDefaults.overlap
    };
  });
}
function joinPlacement(side, align) {
  if (align === "center")
    return side;
  return `${side}-${align}`;
}
function getPopoverData() {
  const NAME = "popover";
  const PARTS = ["arrow", "close", "content", "trigger"];
  return {
    NAME,
    PARTS
  };
}
function setCtx$3(props) {
  const { NAME, PARTS } = getPopoverData();
  const getAttrs2 = createBitAttrs(NAME, PARTS);
  const popover = {
    ...createPopover({
      positioning: {
        placement: "bottom",
        gutter: 0
      },
      ...removeUndefined(props),
      forceVisible: true
    }),
    getAttrs: getAttrs2
  };
  setContext(NAME, popover);
  return {
    ...popover,
    updateOption: getOptionUpdater(popover.options)
  };
}
function getCtx$3() {
  const { NAME } = getPopoverData();
  return getContext(NAME);
}
function updatePositioning$1(props) {
  const defaultPlacement = {
    side: "bottom",
    align: "center"
  };
  const withDefaults = { ...defaultPlacement, ...props };
  const { options: { positioning } } = getCtx$3();
  const updater = getPositioningUpdater(positioning);
  updater(withDefaults);
}
function getDialogData() {
  const NAME = "dialog";
  const PARTS = [
    "close",
    "content",
    "description",
    "overlay",
    "portal",
    "title",
    "trigger"
  ];
  return {
    NAME,
    PARTS
  };
}
function setCtx$2(props) {
  const { NAME, PARTS } = getDialogData();
  const getAttrs2 = createBitAttrs(NAME, PARTS);
  const dialog = {
    ...createDialog({ ...removeUndefined(props), role: "dialog", forceVisible: true }),
    getAttrs: getAttrs2
  };
  setContext(NAME, dialog);
  return {
    ...dialog,
    updateOption: getOptionUpdater(dialog.options)
  };
}
function getCtx$2() {
  const { NAME } = getDialogData();
  return getContext(NAME);
}
const Dialog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $idValues, $$unsubscribe_idValues;
  let { preventScroll = void 0 } = $$props;
  let { closeOnEscape = void 0 } = $$props;
  let { closeOnOutsideClick = void 0 } = $$props;
  let { portal = void 0 } = $$props;
  let { open = void 0 } = $$props;
  let { onOpenChange = void 0 } = $$props;
  let { openFocus = void 0 } = $$props;
  let { closeFocus = void 0 } = $$props;
  let { onOutsideClick = void 0 } = $$props;
  const { states: { open: localOpen }, updateOption, ids } = setCtx$2({
    closeOnEscape,
    preventScroll,
    closeOnOutsideClick,
    portal,
    forceVisible: true,
    defaultOpen: open,
    openFocus,
    closeFocus,
    onOutsideClick,
    onOpenChange: ({ next }) => {
      if (open !== next) {
        onOpenChange?.(next);
        open = next;
      }
      return next;
    }
  });
  const idValues = derived([ids.content, ids.description, ids.title], ([$contentId, $descriptionId, $titleId]) => ({
    content: $contentId,
    description: $descriptionId,
    title: $titleId
  }));
  $$unsubscribe_idValues = subscribe(idValues, (value) => $idValues = value);
  if ($$props.preventScroll === void 0 && $$bindings.preventScroll && preventScroll !== void 0)
    $$bindings.preventScroll(preventScroll);
  if ($$props.closeOnEscape === void 0 && $$bindings.closeOnEscape && closeOnEscape !== void 0)
    $$bindings.closeOnEscape(closeOnEscape);
  if ($$props.closeOnOutsideClick === void 0 && $$bindings.closeOnOutsideClick && closeOnOutsideClick !== void 0)
    $$bindings.closeOnOutsideClick(closeOnOutsideClick);
  if ($$props.portal === void 0 && $$bindings.portal && portal !== void 0)
    $$bindings.portal(portal);
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  if ($$props.onOpenChange === void 0 && $$bindings.onOpenChange && onOpenChange !== void 0)
    $$bindings.onOpenChange(onOpenChange);
  if ($$props.openFocus === void 0 && $$bindings.openFocus && openFocus !== void 0)
    $$bindings.openFocus(openFocus);
  if ($$props.closeFocus === void 0 && $$bindings.closeFocus && closeFocus !== void 0)
    $$bindings.closeFocus(closeFocus);
  if ($$props.onOutsideClick === void 0 && $$bindings.onOutsideClick && onOutsideClick !== void 0)
    $$bindings.onOutsideClick(onOutsideClick);
  open !== void 0 && localOpen.set(open);
  {
    updateOption("preventScroll", preventScroll);
  }
  {
    updateOption("closeOnEscape", closeOnEscape);
  }
  {
    updateOption("closeOnOutsideClick", closeOnOutsideClick);
  }
  {
    updateOption("portal", portal);
  }
  {
    updateOption("openFocus", openFocus);
  }
  {
    updateOption("closeFocus", closeFocus);
  }
  {
    updateOption("onOutsideClick", onOutsideClick);
  }
  $$unsubscribe_idValues();
  return `${slots.default ? slots.default({ ids: $idValues }) : ``}`;
});
const Dialog_title$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, ["level", "asChild", "id", "el"]);
  let $title, $$unsubscribe_title;
  let { level = "h2" } = $$props;
  let { asChild = false } = $$props;
  let { id = void 0 } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { title }, ids, getAttrs: getAttrs2 } = getCtx$2();
  $$unsubscribe_title = subscribe(title, (value) => $title = value);
  const attrs = getAttrs2("title");
  if ($$props.level === void 0 && $$bindings.level && level !== void 0)
    $$bindings.level(level);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  {
    if (id) {
      ids.title.set(id);
    }
  }
  builder = $title;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_title();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `${((tag) => {
    return tag ? `<${level}${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${is_void(tag) ? "" : `${slots.default ? slots.default({ builder }) : ``}`}${is_void(tag) ? "" : `</${tag}>`}` : "";
  })(level)}`}`;
});
const Dialog_close = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $close, $$unsubscribe_close;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { close }, getAttrs: getAttrs2 } = getCtx$2();
  $$unsubscribe_close = subscribe(close, (value) => $close = value);
  createDispatcher();
  const attrs = getAttrs2("close");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  builder = $close;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_close();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<button${spread([escape_object(builder), { type: "button" }, escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</button>`}`;
});
const Dialog_portal$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $portalled, $$unsubscribe_portalled;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { portalled }, getAttrs: getAttrs2 } = getCtx$2();
  $$unsubscribe_portalled = subscribe(portalled, (value) => $portalled = value);
  const attrs = getAttrs2("portal");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  builder = $portalled;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_portalled();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>`}`;
});
const Dialog_content$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, [
    "transition",
    "transitionConfig",
    "inTransition",
    "inTransitionConfig",
    "outTransition",
    "outTransitionConfig",
    "asChild",
    "id",
    "el"
  ]);
  let $content, $$unsubscribe_content;
  let $open, $$unsubscribe_open;
  let { transition = void 0 } = $$props;
  let { transitionConfig = void 0 } = $$props;
  let { inTransition = void 0 } = $$props;
  let { inTransitionConfig = void 0 } = $$props;
  let { outTransition = void 0 } = $$props;
  let { outTransitionConfig = void 0 } = $$props;
  let { asChild = false } = $$props;
  let { id = void 0 } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { content }, states: { open }, ids, getAttrs: getAttrs2 } = getCtx$2();
  $$unsubscribe_content = subscribe(content, (value) => $content = value);
  $$unsubscribe_open = subscribe(open, (value) => $open = value);
  const attrs = getAttrs2("content");
  if ($$props.transition === void 0 && $$bindings.transition && transition !== void 0)
    $$bindings.transition(transition);
  if ($$props.transitionConfig === void 0 && $$bindings.transitionConfig && transitionConfig !== void 0)
    $$bindings.transitionConfig(transitionConfig);
  if ($$props.inTransition === void 0 && $$bindings.inTransition && inTransition !== void 0)
    $$bindings.inTransition(inTransition);
  if ($$props.inTransitionConfig === void 0 && $$bindings.inTransitionConfig && inTransitionConfig !== void 0)
    $$bindings.inTransitionConfig(inTransitionConfig);
  if ($$props.outTransition === void 0 && $$bindings.outTransition && outTransition !== void 0)
    $$bindings.outTransition(outTransition);
  if ($$props.outTransitionConfig === void 0 && $$bindings.outTransitionConfig && outTransitionConfig !== void 0)
    $$bindings.outTransitionConfig(outTransitionConfig);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  {
    if (id) {
      ids.content.set(id);
    }
  }
  builder = $content;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_content();
  $$unsubscribe_open();
  return `${asChild && $open ? `${slots.default ? slots.default({ builder }) : ``}` : `${transition && $open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : `${inTransition && outTransition && $open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : `${inTransition && $open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : `${outTransition && $open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : `${$open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : ``}`}`}`}`}`}`;
});
const Dialog_overlay$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, [
    "transition",
    "transitionConfig",
    "inTransition",
    "inTransitionConfig",
    "outTransition",
    "outTransitionConfig",
    "asChild",
    "el"
  ]);
  let $overlay, $$unsubscribe_overlay;
  let $open, $$unsubscribe_open;
  let { transition = void 0 } = $$props;
  let { transitionConfig = void 0 } = $$props;
  let { inTransition = void 0 } = $$props;
  let { inTransitionConfig = void 0 } = $$props;
  let { outTransition = void 0 } = $$props;
  let { outTransitionConfig = void 0 } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { overlay }, states: { open }, getAttrs: getAttrs2 } = getCtx$2();
  $$unsubscribe_overlay = subscribe(overlay, (value) => $overlay = value);
  $$unsubscribe_open = subscribe(open, (value) => $open = value);
  const attrs = getAttrs2("overlay");
  if ($$props.transition === void 0 && $$bindings.transition && transition !== void 0)
    $$bindings.transition(transition);
  if ($$props.transitionConfig === void 0 && $$bindings.transitionConfig && transitionConfig !== void 0)
    $$bindings.transitionConfig(transitionConfig);
  if ($$props.inTransition === void 0 && $$bindings.inTransition && inTransition !== void 0)
    $$bindings.inTransition(inTransition);
  if ($$props.inTransitionConfig === void 0 && $$bindings.inTransitionConfig && inTransitionConfig !== void 0)
    $$bindings.inTransitionConfig(inTransitionConfig);
  if ($$props.outTransition === void 0 && $$bindings.outTransition && outTransition !== void 0)
    $$bindings.outTransition(outTransition);
  if ($$props.outTransitionConfig === void 0 && $$bindings.outTransitionConfig && outTransitionConfig !== void 0)
    $$bindings.outTransitionConfig(outTransitionConfig);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  builder = $overlay;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_overlay();
  $$unsubscribe_open();
  return `${asChild && $open ? `${slots.default ? slots.default({ builder }) : ``}` : `${transition && $open ? ` <div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}></div>` : `${inTransition && outTransition && $open ? ` <div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}></div>` : `${inTransition && $open ? ` <div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}></div>` : `${outTransition && $open ? ` <div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}></div>` : `${$open ? ` <div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}></div>` : ``}`}`}`}`}`}`;
});
const Dialog_trigger = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $trigger, $$unsubscribe_trigger;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { trigger }, getAttrs: getAttrs2 } = getCtx$2();
  $$unsubscribe_trigger = subscribe(trigger, (value) => $trigger = value);
  createDispatcher();
  const attrs = getAttrs2("trigger");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  builder = $trigger;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_trigger();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<button${spread([escape_object(builder), { type: "button" }, escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</button>`}`;
});
function getLabelData() {
  const NAME = "label";
  const PARTS = ["root"];
  const getAttrs2 = createBitAttrs(NAME, PARTS);
  return {
    NAME,
    getAttrs: getAttrs2
  };
}
const Label$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $root, $$unsubscribe_root;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { root } } = createLabel();
  $$unsubscribe_root = subscribe(root, (value) => $root = value);
  createDispatcher();
  const { getAttrs: getAttrs2 } = getLabelData();
  const attrs = getAttrs2("root");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  builder = $root;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_root();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<label${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</label>`}`;
});
function getLinkPreviewData() {
  const NAME = "link-preview";
  const PARTS = ["arrow", "content", "trigger"];
  return {
    NAME,
    PARTS
  };
}
function setCtx$1(props) {
  const { NAME, PARTS } = getLinkPreviewData();
  const getAttrs2 = createBitAttrs(NAME, PARTS);
  const linkPreview = {
    ...createLinkPreview({
      ...removeUndefined(props),
      forceVisible: true
    }),
    getAttrs: getAttrs2
  };
  setContext(NAME, linkPreview);
  return {
    ...linkPreview,
    updateOption: getOptionUpdater(linkPreview.options)
  };
}
function getCtx$1() {
  const { NAME } = getLinkPreviewData();
  return getContext(NAME);
}
function updatePositioning(props) {
  const defaultPlacement = {
    side: "bottom",
    align: "center"
  };
  const withDefaults = { ...defaultPlacement, ...props };
  const { options: { positioning } } = getCtx$1();
  const updater = getPositioningUpdater(positioning);
  updater(withDefaults);
}
const Link_preview = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $idValues, $$unsubscribe_idValues;
  let { open = void 0 } = $$props;
  let { onOpenChange = void 0 } = $$props;
  let { openDelay = 700 } = $$props;
  let { closeDelay = 300 } = $$props;
  let { closeOnOutsideClick = void 0 } = $$props;
  let { closeOnEscape = void 0 } = $$props;
  let { portal = void 0 } = $$props;
  let { onOutsideClick = void 0 } = $$props;
  const { states: { open: localOpen }, updateOption, ids } = setCtx$1({
    defaultOpen: open,
    openDelay,
    closeDelay,
    closeOnOutsideClick,
    closeOnEscape,
    portal,
    onOutsideClick,
    onOpenChange: ({ next }) => {
      if (open !== next) {
        onOpenChange?.(next);
        open = next;
      }
      return next;
    }
  });
  const idValues = derived([ids.content, ids.trigger], ([$contentId, $triggerId]) => ({ content: $contentId, trigger: $triggerId }));
  $$unsubscribe_idValues = subscribe(idValues, (value) => $idValues = value);
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  if ($$props.onOpenChange === void 0 && $$bindings.onOpenChange && onOpenChange !== void 0)
    $$bindings.onOpenChange(onOpenChange);
  if ($$props.openDelay === void 0 && $$bindings.openDelay && openDelay !== void 0)
    $$bindings.openDelay(openDelay);
  if ($$props.closeDelay === void 0 && $$bindings.closeDelay && closeDelay !== void 0)
    $$bindings.closeDelay(closeDelay);
  if ($$props.closeOnOutsideClick === void 0 && $$bindings.closeOnOutsideClick && closeOnOutsideClick !== void 0)
    $$bindings.closeOnOutsideClick(closeOnOutsideClick);
  if ($$props.closeOnEscape === void 0 && $$bindings.closeOnEscape && closeOnEscape !== void 0)
    $$bindings.closeOnEscape(closeOnEscape);
  if ($$props.portal === void 0 && $$bindings.portal && portal !== void 0)
    $$bindings.portal(portal);
  if ($$props.onOutsideClick === void 0 && $$bindings.onOutsideClick && onOutsideClick !== void 0)
    $$bindings.onOutsideClick(onOutsideClick);
  open !== void 0 && localOpen.set(open);
  {
    updateOption("openDelay", openDelay);
  }
  {
    updateOption("closeDelay", closeDelay);
  }
  {
    updateOption("closeOnOutsideClick", closeOnOutsideClick);
  }
  {
    updateOption("closeOnEscape", closeOnEscape);
  }
  {
    updateOption("portal", portal);
  }
  {
    updateOption("onOutsideClick", onOutsideClick);
  }
  $$unsubscribe_idValues();
  return `${slots.default ? slots.default({ ids: $idValues }) : ``}`;
});
const Link_preview_content = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, [
    "transition",
    "transitionConfig",
    "inTransition",
    "inTransitionConfig",
    "outTransition",
    "outTransitionConfig",
    "asChild",
    "id",
    "side",
    "align",
    "sideOffset",
    "alignOffset",
    "collisionPadding",
    "avoidCollisions",
    "collisionBoundary",
    "sameWidth",
    "fitViewport",
    "strategy",
    "overlap",
    "el"
  ]);
  let $open, $$unsubscribe_open;
  let $content, $$unsubscribe_content;
  let { transition = void 0 } = $$props;
  let { transitionConfig = void 0 } = $$props;
  let { inTransition = void 0 } = $$props;
  let { inTransitionConfig = void 0 } = $$props;
  let { outTransition = void 0 } = $$props;
  let { outTransitionConfig = void 0 } = $$props;
  let { asChild = false } = $$props;
  let { id = void 0 } = $$props;
  let { side = "bottom" } = $$props;
  let { align = "center" } = $$props;
  let { sideOffset = 0 } = $$props;
  let { alignOffset = 0 } = $$props;
  let { collisionPadding = 8 } = $$props;
  let { avoidCollisions = true } = $$props;
  let { collisionBoundary = void 0 } = $$props;
  let { sameWidth = false } = $$props;
  let { fitViewport = false } = $$props;
  let { strategy = "absolute" } = $$props;
  let { overlap = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { content }, states: { open }, ids, getAttrs: getAttrs2 } = getCtx$1();
  $$unsubscribe_content = subscribe(content, (value) => $content = value);
  $$unsubscribe_open = subscribe(open, (value) => $open = value);
  const attrs = getAttrs2("content");
  createDispatcher();
  if ($$props.transition === void 0 && $$bindings.transition && transition !== void 0)
    $$bindings.transition(transition);
  if ($$props.transitionConfig === void 0 && $$bindings.transitionConfig && transitionConfig !== void 0)
    $$bindings.transitionConfig(transitionConfig);
  if ($$props.inTransition === void 0 && $$bindings.inTransition && inTransition !== void 0)
    $$bindings.inTransition(inTransition);
  if ($$props.inTransitionConfig === void 0 && $$bindings.inTransitionConfig && inTransitionConfig !== void 0)
    $$bindings.inTransitionConfig(inTransitionConfig);
  if ($$props.outTransition === void 0 && $$bindings.outTransition && outTransition !== void 0)
    $$bindings.outTransition(outTransition);
  if ($$props.outTransitionConfig === void 0 && $$bindings.outTransitionConfig && outTransitionConfig !== void 0)
    $$bindings.outTransitionConfig(outTransitionConfig);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.side === void 0 && $$bindings.side && side !== void 0)
    $$bindings.side(side);
  if ($$props.align === void 0 && $$bindings.align && align !== void 0)
    $$bindings.align(align);
  if ($$props.sideOffset === void 0 && $$bindings.sideOffset && sideOffset !== void 0)
    $$bindings.sideOffset(sideOffset);
  if ($$props.alignOffset === void 0 && $$bindings.alignOffset && alignOffset !== void 0)
    $$bindings.alignOffset(alignOffset);
  if ($$props.collisionPadding === void 0 && $$bindings.collisionPadding && collisionPadding !== void 0)
    $$bindings.collisionPadding(collisionPadding);
  if ($$props.avoidCollisions === void 0 && $$bindings.avoidCollisions && avoidCollisions !== void 0)
    $$bindings.avoidCollisions(avoidCollisions);
  if ($$props.collisionBoundary === void 0 && $$bindings.collisionBoundary && collisionBoundary !== void 0)
    $$bindings.collisionBoundary(collisionBoundary);
  if ($$props.sameWidth === void 0 && $$bindings.sameWidth && sameWidth !== void 0)
    $$bindings.sameWidth(sameWidth);
  if ($$props.fitViewport === void 0 && $$bindings.fitViewport && fitViewport !== void 0)
    $$bindings.fitViewport(fitViewport);
  if ($$props.strategy === void 0 && $$bindings.strategy && strategy !== void 0)
    $$bindings.strategy(strategy);
  if ($$props.overlap === void 0 && $$bindings.overlap && overlap !== void 0)
    $$bindings.overlap(overlap);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  {
    if (id) {
      ids.content.set(id);
    }
  }
  builder = $content;
  {
    Object.assign(builder, attrs);
  }
  {
    if ($open) {
      updatePositioning({
        side,
        align,
        sideOffset,
        alignOffset,
        collisionPadding,
        avoidCollisions,
        collisionBoundary,
        sameWidth,
        fitViewport,
        strategy,
        overlap
      });
    }
  }
  $$unsubscribe_open();
  $$unsubscribe_content();
  return `${asChild && $open ? `${slots.default ? slots.default({ builder }) : ``}` : `${transition && $open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : `${inTransition && outTransition && $open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : `${inTransition && $open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : `${outTransition && $open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : `${$open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : ``}`}`}`}`}`}`;
});
const Link_preview_trigger = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, ["asChild", "id", "el"]);
  let $trigger, $$unsubscribe_trigger;
  let { asChild = false } = $$props;
  let { id = void 0 } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { trigger }, ids, getAttrs: getAttrs2 } = getCtx$1();
  $$unsubscribe_trigger = subscribe(trigger, (value) => $trigger = value);
  createDispatcher();
  const attrs = getAttrs2("trigger");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  {
    if (id) {
      ids.trigger.set(id);
    }
  }
  builder = $trigger;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_trigger();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `${((tag) => {
    return tag ? `<a${spread([escape_object(builder), escape_object($$restProps), escape_object(attrs)], {})}${add_attribute("this", el, 0)}>${is_void(tag) ? "" : `${slots.default ? slots.default({ builder }) : ``}`}</a>` : "";
  })("a")}`}`;
});
const Popover = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $idValues, $$unsubscribe_idValues;
  let { disableFocusTrap = void 0 } = $$props;
  let { closeOnEscape = void 0 } = $$props;
  let { closeOnOutsideClick = void 0 } = $$props;
  let { preventScroll = void 0 } = $$props;
  let { portal = void 0 } = $$props;
  let { open = void 0 } = $$props;
  let { onOpenChange = void 0 } = $$props;
  let { openFocus = void 0 } = $$props;
  let { closeFocus = void 0 } = $$props;
  let { onOutsideClick = void 0 } = $$props;
  const { updateOption, states: { open: localOpen }, ids } = setCtx$3({
    disableFocusTrap,
    closeOnEscape,
    closeOnOutsideClick,
    preventScroll,
    portal,
    defaultOpen: open,
    openFocus,
    closeFocus,
    onOutsideClick,
    onOpenChange: ({ next }) => {
      if (open !== next) {
        onOpenChange?.(next);
        open = next;
      }
      return next;
    },
    positioning: { gutter: 0, offset: { mainAxis: 1 } }
  });
  const idValues = derived([ids.content, ids.trigger], ([$contentId, $triggerId]) => ({ content: $contentId, trigger: $triggerId }));
  $$unsubscribe_idValues = subscribe(idValues, (value) => $idValues = value);
  if ($$props.disableFocusTrap === void 0 && $$bindings.disableFocusTrap && disableFocusTrap !== void 0)
    $$bindings.disableFocusTrap(disableFocusTrap);
  if ($$props.closeOnEscape === void 0 && $$bindings.closeOnEscape && closeOnEscape !== void 0)
    $$bindings.closeOnEscape(closeOnEscape);
  if ($$props.closeOnOutsideClick === void 0 && $$bindings.closeOnOutsideClick && closeOnOutsideClick !== void 0)
    $$bindings.closeOnOutsideClick(closeOnOutsideClick);
  if ($$props.preventScroll === void 0 && $$bindings.preventScroll && preventScroll !== void 0)
    $$bindings.preventScroll(preventScroll);
  if ($$props.portal === void 0 && $$bindings.portal && portal !== void 0)
    $$bindings.portal(portal);
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  if ($$props.onOpenChange === void 0 && $$bindings.onOpenChange && onOpenChange !== void 0)
    $$bindings.onOpenChange(onOpenChange);
  if ($$props.openFocus === void 0 && $$bindings.openFocus && openFocus !== void 0)
    $$bindings.openFocus(openFocus);
  if ($$props.closeFocus === void 0 && $$bindings.closeFocus && closeFocus !== void 0)
    $$bindings.closeFocus(closeFocus);
  if ($$props.onOutsideClick === void 0 && $$bindings.onOutsideClick && onOutsideClick !== void 0)
    $$bindings.onOutsideClick(onOutsideClick);
  open !== void 0 && localOpen.set(open);
  {
    updateOption("disableFocusTrap", disableFocusTrap);
  }
  {
    updateOption("closeOnEscape", closeOnEscape);
  }
  {
    updateOption("closeOnOutsideClick", closeOnOutsideClick);
  }
  {
    updateOption("preventScroll", preventScroll);
  }
  {
    updateOption("portal", portal);
  }
  {
    updateOption("openFocus", openFocus);
  }
  {
    updateOption("closeFocus", closeFocus);
  }
  {
    updateOption("onOutsideClick", onOutsideClick);
  }
  $$unsubscribe_idValues();
  return `${slots.default ? slots.default({ ids: $idValues }) : ``}`;
});
const Popover_content$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, [
    "transition",
    "transitionConfig",
    "inTransition",
    "inTransitionConfig",
    "outTransition",
    "outTransitionConfig",
    "asChild",
    "id",
    "side",
    "align",
    "sideOffset",
    "alignOffset",
    "collisionPadding",
    "avoidCollisions",
    "collisionBoundary",
    "sameWidth",
    "fitViewport",
    "strategy",
    "overlap",
    "el"
  ]);
  let $open, $$unsubscribe_open;
  let $content, $$unsubscribe_content;
  let { transition = void 0 } = $$props;
  let { transitionConfig = void 0 } = $$props;
  let { inTransition = void 0 } = $$props;
  let { inTransitionConfig = void 0 } = $$props;
  let { outTransition = void 0 } = $$props;
  let { outTransitionConfig = void 0 } = $$props;
  let { asChild = false } = $$props;
  let { id = void 0 } = $$props;
  let { side = "bottom" } = $$props;
  let { align = "center" } = $$props;
  let { sideOffset = 0 } = $$props;
  let { alignOffset = 0 } = $$props;
  let { collisionPadding = 8 } = $$props;
  let { avoidCollisions = true } = $$props;
  let { collisionBoundary = void 0 } = $$props;
  let { sameWidth = false } = $$props;
  let { fitViewport = false } = $$props;
  let { strategy = "absolute" } = $$props;
  let { overlap = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { content }, states: { open }, ids, getAttrs: getAttrs2 } = getCtx$3();
  $$unsubscribe_content = subscribe(content, (value) => $content = value);
  $$unsubscribe_open = subscribe(open, (value) => $open = value);
  const attrs = getAttrs2("content");
  if ($$props.transition === void 0 && $$bindings.transition && transition !== void 0)
    $$bindings.transition(transition);
  if ($$props.transitionConfig === void 0 && $$bindings.transitionConfig && transitionConfig !== void 0)
    $$bindings.transitionConfig(transitionConfig);
  if ($$props.inTransition === void 0 && $$bindings.inTransition && inTransition !== void 0)
    $$bindings.inTransition(inTransition);
  if ($$props.inTransitionConfig === void 0 && $$bindings.inTransitionConfig && inTransitionConfig !== void 0)
    $$bindings.inTransitionConfig(inTransitionConfig);
  if ($$props.outTransition === void 0 && $$bindings.outTransition && outTransition !== void 0)
    $$bindings.outTransition(outTransition);
  if ($$props.outTransitionConfig === void 0 && $$bindings.outTransitionConfig && outTransitionConfig !== void 0)
    $$bindings.outTransitionConfig(outTransitionConfig);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.side === void 0 && $$bindings.side && side !== void 0)
    $$bindings.side(side);
  if ($$props.align === void 0 && $$bindings.align && align !== void 0)
    $$bindings.align(align);
  if ($$props.sideOffset === void 0 && $$bindings.sideOffset && sideOffset !== void 0)
    $$bindings.sideOffset(sideOffset);
  if ($$props.alignOffset === void 0 && $$bindings.alignOffset && alignOffset !== void 0)
    $$bindings.alignOffset(alignOffset);
  if ($$props.collisionPadding === void 0 && $$bindings.collisionPadding && collisionPadding !== void 0)
    $$bindings.collisionPadding(collisionPadding);
  if ($$props.avoidCollisions === void 0 && $$bindings.avoidCollisions && avoidCollisions !== void 0)
    $$bindings.avoidCollisions(avoidCollisions);
  if ($$props.collisionBoundary === void 0 && $$bindings.collisionBoundary && collisionBoundary !== void 0)
    $$bindings.collisionBoundary(collisionBoundary);
  if ($$props.sameWidth === void 0 && $$bindings.sameWidth && sameWidth !== void 0)
    $$bindings.sameWidth(sameWidth);
  if ($$props.fitViewport === void 0 && $$bindings.fitViewport && fitViewport !== void 0)
    $$bindings.fitViewport(fitViewport);
  if ($$props.strategy === void 0 && $$bindings.strategy && strategy !== void 0)
    $$bindings.strategy(strategy);
  if ($$props.overlap === void 0 && $$bindings.overlap && overlap !== void 0)
    $$bindings.overlap(overlap);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  {
    if (id) {
      ids.content.set(id);
    }
  }
  builder = $content;
  {
    Object.assign(builder, attrs);
  }
  {
    if ($open) {
      updatePositioning$1({
        side,
        align,
        sideOffset,
        alignOffset,
        collisionPadding,
        avoidCollisions,
        collisionBoundary,
        sameWidth,
        fitViewport,
        strategy,
        overlap
      });
    }
  }
  $$unsubscribe_open();
  $$unsubscribe_content();
  return `${asChild && $open ? `${slots.default ? slots.default({ builder }) : ``}` : `${transition && $open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : `${inTransition && outTransition && $open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : `${inTransition && $open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : `${outTransition && $open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : `${$open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : ``}`}`}`}`}`}`;
});
const Popover_trigger = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let attrs;
  let builder;
  let $$restProps = compute_rest_props($$props, ["asChild", "id", "el"]);
  let $trigger, $$unsubscribe_trigger;
  let $open, $$unsubscribe_open;
  let { asChild = false } = $$props;
  let { id = void 0 } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { trigger }, states: { open }, ids, getAttrs: getAttrs2 } = getCtx$3();
  $$unsubscribe_trigger = subscribe(trigger, (value) => $trigger = value);
  $$unsubscribe_open = subscribe(open, (value) => $open = value);
  createDispatcher();
  const bitsAttrs = getAttrs2("trigger");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  {
    if (id) {
      ids.trigger.set(id);
    }
  }
  attrs = {
    ...bitsAttrs,
    "aria-controls": $open ? ids.content : void 0
  };
  builder = $trigger;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_trigger();
  $$unsubscribe_open();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<button${spread([escape_object(builder), { type: "button" }, escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</button>`}`;
});
function getRadioGroupData() {
  const NAME = "radio-group";
  const ITEM_NAME = "radio-group-item";
  const PARTS = ["root", "item", "input", "item-indicator"];
  return {
    NAME,
    ITEM_NAME,
    PARTS
  };
}
function setCtx(props) {
  const { NAME, PARTS } = getRadioGroupData();
  const getAttrs2 = createBitAttrs(NAME, PARTS);
  const radioGroup = { ...createRadioGroup(removeUndefined(props)), getAttrs: getAttrs2 };
  setContext(NAME, radioGroup);
  return {
    ...radioGroup,
    updateOption: getOptionUpdater(radioGroup.options)
  };
}
function getCtx() {
  const { NAME } = getRadioGroupData();
  return getContext(NAME);
}
function setItemCtx(value) {
  const { ITEM_NAME } = getRadioGroupData();
  const radioGroup = { ...getCtx(), value };
  setContext(ITEM_NAME, radioGroup);
  return radioGroup;
}
function getRadioIndicator() {
  const { ITEM_NAME } = getRadioGroupData();
  return getContext(ITEM_NAME);
}
const Radio_group$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, [
    "required",
    "disabled",
    "value",
    "onValueChange",
    "loop",
    "orientation",
    "asChild",
    "el"
  ]);
  let $root, $$unsubscribe_root;
  let { required = void 0 } = $$props;
  let { disabled = void 0 } = $$props;
  let { value = void 0 } = $$props;
  let { onValueChange = void 0 } = $$props;
  let { loop = void 0 } = $$props;
  let { orientation = void 0 } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { root }, states: { value: localValue }, updateOption, getAttrs: getAttrs2 } = setCtx({
    required,
    disabled,
    defaultValue: value,
    loop,
    orientation,
    onValueChange: ({ next }) => {
      if (value !== next) {
        onValueChange?.(next);
        value = next;
      }
      return next;
    }
  });
  $$unsubscribe_root = subscribe(root, (value2) => $root = value2);
  const attrs = getAttrs2("root");
  if ($$props.required === void 0 && $$bindings.required && required !== void 0)
    $$bindings.required(required);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.onValueChange === void 0 && $$bindings.onValueChange && onValueChange !== void 0)
    $$bindings.onValueChange(onValueChange);
  if ($$props.loop === void 0 && $$bindings.loop && loop !== void 0)
    $$bindings.loop(loop);
  if ($$props.orientation === void 0 && $$bindings.orientation && orientation !== void 0)
    $$bindings.orientation(orientation);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  value !== void 0 && localValue.set(value);
  {
    updateOption("required", required);
  }
  {
    updateOption("disabled", disabled);
  }
  {
    updateOption("loop", loop);
  }
  {
    updateOption("orientation", orientation);
  }
  builder = $root;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_root();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>`}`;
});
const Radio_group_item$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, ["value", "disabled", "asChild", "el"]);
  let $item, $$unsubscribe_item;
  let { value } = $$props;
  let { disabled = false } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { item }, getAttrs: getAttrs2 } = setItemCtx(value);
  $$unsubscribe_item = subscribe(item, (value2) => $item = value2);
  createDispatcher();
  const attrs = getAttrs2("item");
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  builder = $item({ value, disabled });
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_item();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<button${spread([escape_object(builder), { type: "button" }, escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</button>`}`;
});
const Radio_group_item_indicator = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let checked;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $isChecked, $$unsubscribe_isChecked;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { helpers: { isChecked }, value, getAttrs: getAttrs2 } = getRadioIndicator();
  $$unsubscribe_isChecked = subscribe(isChecked, (value2) => $isChecked = value2);
  const attrs = getAttrs2("item-indicator");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  checked = $isChecked(value);
  $$unsubscribe_isChecked();
  return `${asChild ? `${slots.default ? slots.default({ checked, attrs }) : ``}` : `<div${spread([escape_object(attrs), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${checked ? `${slots.default ? slots.default({ checked, attrs }) : ``}` : ``}</div>`}`;
});
function cubicOut(t) {
  const f = t - 1;
  return f * f * f + 1;
}
function cn$1(...inputs) {
  return twMerge(clsx(inputs));
}
const flyAndScale = (node, params = { y: -8, x: 0, start: 0.95, duration: 150 }) => {
  const style = getComputedStyle(node);
  const transform = style.transform === "none" ? "" : style.transform;
  const scaleConversion = (valueA, scaleA, scaleB) => {
    const [minA, maxA] = scaleA;
    const [minB, maxB] = scaleB;
    const percentage = (valueA - minA) / (maxA - minA);
    const valueB = percentage * (maxB - minB) + minB;
    return valueB;
  };
  const styleToString2 = (style2) => {
    return Object.keys(style2).reduce((str, key) => {
      if (style2[key] === void 0)
        return str;
      return str + `${key}:${style2[key]};`;
    }, "");
  };
  return {
    duration: params.duration ?? 200,
    delay: 0,
    css: (t) => {
      const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
      const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
      const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);
      return styleToString2({
        transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        opacity: t
      });
    },
    easing: cubicOut
  };
};
const Button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "variant", "size", "builders"]);
  let { class: className = void 0 } = $$props;
  let { variant = "default" } = $$props;
  let { size: size2 = "default" } = $$props;
  let { builders = [] } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.variant === void 0 && $$bindings.variant && variant !== void 0)
    $$bindings.variant(variant);
  if ($$props.size === void 0 && $$bindings.size && size2 !== void 0)
    $$bindings.size(size2);
  if ($$props.builders === void 0 && $$bindings.builders && builders !== void 0)
    $$bindings.builders(builders);
  return `${validate_component(Button$1, "ButtonPrimitive.Root").$$render(
    $$result,
    Object.assign(
      {},
      { builders },
      {
        class: cn$1(buttonVariants({ variant, size: size2, className }))
      },
      { type: "button" },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `${slots.default ? slots.default({}) : ``}`;
      }
    }
  )}`;
});
const buttonVariants = tv({
  base: "inline-flex items-center justify-center rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
      outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline"
    },
    size: {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-10 rounded-md px-8",
      icon: "h-9 w-9"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
});
const Table = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<div class="w-full overflow-auto"><table${spread(
    [
      {
        class: escape_attribute_value(cn$1("w-full caption-bottom text-sm", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</table></div>`;
});
const Table_body = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<tbody${spread(
    [
      {
        class: escape_attribute_value(cn$1("[&_tr:last-child]:border-0", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</tbody>`;
});
const Table_caption = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<caption${spread(
    [
      {
        class: escape_attribute_value(cn$1("mt-4 text-sm text-muted-foreground", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</caption>`;
});
const Table_cell = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<td${spread(
    [
      {
        class: escape_attribute_value(cn$1("p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</td>`;
});
const Table_head = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<th${spread(
    [
      {
        class: escape_attribute_value(cn$1("h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</th>`;
});
const Table_header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return ` <thead${spread(
    [
      {
        class: escape_attribute_value(cn$1("[&_tr]:border-b", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</thead>`;
});
const Table_row = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<tr${spread(
    [
      {
        class: escape_attribute_value(cn$1("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</tr>`;
});
const Dialog_title = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `${validate_component(Dialog_title$1, "DialogPrimitive.Title").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn$1("text-lg font-semibold leading-none tracking-tight", className)
      },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `${slots.default ? slots.default({}) : ``}`;
      }
    }
  )}`;
});
const Dialog_portal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, []);
  return `${validate_component(Dialog_portal$1, "DialogPrimitive.Portal").$$render($$result, Object.assign({}, $$restProps), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Dialog_footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<div${spread(
    [
      {
        class: escape_attribute_value(cn$1("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</div>`;
});
const Dialog_header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<div${spread(
    [
      {
        class: escape_attribute_value(cn$1("flex flex-col space-y-1.5 text-center sm:text-left", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</div>`;
});
function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
  const o = +getComputedStyle(node).opacity;
  return {
    delay,
    duration,
    easing,
    css: (t) => `opacity: ${t * o}`
  };
}
const Dialog_overlay = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "transition", "transitionConfig"]);
  let { class: className = void 0 } = $$props;
  let { transition = fade } = $$props;
  let { transitionConfig = { duration: 150 } } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.transition === void 0 && $$bindings.transition && transition !== void 0)
    $$bindings.transition(transition);
  if ($$props.transitionConfig === void 0 && $$bindings.transitionConfig && transitionConfig !== void 0)
    $$bindings.transitionConfig(transitionConfig);
  return `${validate_component(Dialog_overlay$1, "DialogPrimitive.Overlay").$$render(
    $$result,
    Object.assign(
      {},
      { transition },
      { transitionConfig },
      {
        class: cn$1("fixed inset-0 z-50 bg-background/80 backdrop-blur-sm ", className)
      },
      $$restProps
    ),
    {},
    {}
  )}`;
});
const Cross2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["size", "role", "color", "ariaLabel", "withEvents"]);
  const ctx = getContext("iconCtx") ?? {};
  let { size: size2 = ctx.size || "24" } = $$props;
  let { role = ctx.role || "img" } = $$props;
  let { color = ctx.color || "currentColor" } = $$props;
  let { ariaLabel = "cross 2," } = $$props;
  let { withEvents = false } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size2 !== void 0)
    $$bindings.size(size2);
  if ($$props.role === void 0 && $$bindings.role && role !== void 0)
    $$bindings.role(role);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.ariaLabel === void 0 && $$bindings.ariaLabel && ariaLabel !== void 0)
    $$bindings.ariaLabel(ariaLabel);
  if ($$props.withEvents === void 0 && $$bindings.withEvents && withEvents !== void 0)
    $$bindings.withEvents(withEvents);
  return `${withEvents ? `<svg${spread(
    [
      { width: escape_attribute_value(size2) },
      { height: escape_attribute_value(size2) },
      escape_object($$restProps),
      { role: escape_attribute_value(role) },
      {
        "aria-label": escape_attribute_value(ariaLabel)
      },
      { viewBox: "0 0 15 15" },
      { fill: escape_attribute_value(color) },
      { xmlns: "http://www.w3.org/2000/svg" }
    ],
    {}
  )}><path fill-rule="evenodd" clip-rule="evenodd" d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor"></path></svg>` : `<svg${spread(
    [
      { width: escape_attribute_value(size2) },
      { height: escape_attribute_value(size2) },
      escape_object($$restProps),
      { role: escape_attribute_value(role) },
      {
        "aria-label": escape_attribute_value(ariaLabel)
      },
      { viewBox: "0 0 15 15" },
      { fill: escape_attribute_value(color) },
      { xmlns: "http://www.w3.org/2000/svg" }
    ],
    {}
  )}><path fill-rule="evenodd" clip-rule="evenodd" d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor"></path></svg>`} `;
});
const Dialog_content = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "transition", "transitionConfig"]);
  let { class: className = void 0 } = $$props;
  let { transition = flyAndScale } = $$props;
  let { transitionConfig = { duration: 200 } } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.transition === void 0 && $$bindings.transition && transition !== void 0)
    $$bindings.transition(transition);
  if ($$props.transitionConfig === void 0 && $$bindings.transitionConfig && transitionConfig !== void 0)
    $$bindings.transitionConfig(transitionConfig);
  return `${validate_component(Dialog_portal, "Dialog.Portal").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Dialog_overlay, "Dialog.Overlay").$$render($$result, {}, {}, {})} ${validate_component(Dialog_content$1, "DialogPrimitive.Content").$$render(
        $$result,
        Object.assign(
          {},
          { transition },
          { transitionConfig },
          {
            class: cn$1("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg md:w-full", className)
          },
          $$restProps
        ),
        {},
        {
          default: () => {
            return `${slots.default ? slots.default({}) : ``} ${validate_component(Dialog_close, "DialogPrimitive.Close").$$render(
              $$result,
              {
                class: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              },
              {},
              {
                default: () => {
                  return `${validate_component(Cross2, "Cross2").$$render($$result, { class: "h-4 w-4" }, {}, {})} <span class="sr-only" data-svelte-h="svelte-1pewzs3">Close</span>`;
                }
              }
            )}`;
          }
        }
      )}`;
    }
  })}`;
});
const Root$2 = Dialog;
const Trigger$2 = Dialog_trigger;
const Input = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "value"]);
  let { class: className = void 0 } = $$props;
  let { value = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  return `<input${spread(
    [
      {
        class: escape_attribute_value(cn$1("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("value", value, 0)}>`;
});
/**
 * @license lucide-svelte v0.354.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
const defaultAttributes$1 = defaultAttributes;
const Icon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["name", "color", "size", "strokeWidth", "absoluteStrokeWidth", "iconNode"]);
  let { name: name2 } = $$props;
  let { color = "currentColor" } = $$props;
  let { size: size2 = 24 } = $$props;
  let { strokeWidth = 2 } = $$props;
  let { absoluteStrokeWidth = false } = $$props;
  let { iconNode } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name2 !== void 0)
    $$bindings.name(name2);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.size === void 0 && $$bindings.size && size2 !== void 0)
    $$bindings.size(size2);
  if ($$props.strokeWidth === void 0 && $$bindings.strokeWidth && strokeWidth !== void 0)
    $$bindings.strokeWidth(strokeWidth);
  if ($$props.absoluteStrokeWidth === void 0 && $$bindings.absoluteStrokeWidth && absoluteStrokeWidth !== void 0)
    $$bindings.absoluteStrokeWidth(absoluteStrokeWidth);
  if ($$props.iconNode === void 0 && $$bindings.iconNode && iconNode !== void 0)
    $$bindings.iconNode(iconNode);
  return `<svg${spread(
    [
      escape_object(defaultAttributes$1),
      escape_object($$restProps),
      { width: escape_attribute_value(size2) },
      { height: escape_attribute_value(size2) },
      { stroke: escape_attribute_value(color) },
      {
        "stroke-width": escape_attribute_value(absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size2) : strokeWidth)
      },
      {
        class: escape_attribute_value(`lucide-icon lucide lucide-${name2} ${$$props.class ?? ""}`)
      }
    ],
    {}
  )}>${each(iconNode, ([tag, attrs]) => {
    return `${((tag$1) => {
      return tag$1 ? `<${tag}${spread([escape_object(attrs)], {})}>${is_void(tag$1) ? "" : ``}${is_void(tag$1) ? "" : `</${tag$1}>`}` : "";
    })(tag)}`;
  })}${slots.default ? slots.default({}) : ``}</svg>`;
});
const Icon$1 = Icon;
const X = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [["path", { "d": "M18 6 6 18" }], ["path", { "d": "m6 6 12 12" }]];
  return `${validate_component(Icon$1, "Icon").$$render($$result, Object.assign({}, { name: "x" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const X$1 = X;
const Check$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [["path", { "d": "M20 6 9 17l-5-5" }]];
  return `${validate_component(Icon$1, "Icon").$$render($$result, Object.assign({}, { name: "check" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Check$2 = Check$1;
const Radio_group = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "value"]);
  let { class: className = void 0 } = $$props;
  let { value = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${validate_component(Radio_group$1, "RadioGroupPrimitive.Root").$$render(
      $$result,
      Object.assign({}, { class: cn$1("grid gap-2", className) }, $$restProps, { value }),
      {
        value: ($$value) => {
          value = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${slots.default ? slots.default({}) : ``}`;
        }
      }
    )}`;
  } while (!$$settled);
  return $$rendered;
});
const Check = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["size", "role", "color", "ariaLabel", "withEvents"]);
  const ctx = getContext("iconCtx") ?? {};
  let { size: size2 = ctx.size || "24" } = $$props;
  let { role = ctx.role || "img" } = $$props;
  let { color = ctx.color || "currentColor" } = $$props;
  let { ariaLabel = "check," } = $$props;
  let { withEvents = false } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size2 !== void 0)
    $$bindings.size(size2);
  if ($$props.role === void 0 && $$bindings.role && role !== void 0)
    $$bindings.role(role);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.ariaLabel === void 0 && $$bindings.ariaLabel && ariaLabel !== void 0)
    $$bindings.ariaLabel(ariaLabel);
  if ($$props.withEvents === void 0 && $$bindings.withEvents && withEvents !== void 0)
    $$bindings.withEvents(withEvents);
  return `${withEvents ? `<svg${spread(
    [
      { width: escape_attribute_value(size2) },
      { height: escape_attribute_value(size2) },
      escape_object($$restProps),
      { role: escape_attribute_value(role) },
      {
        "aria-label": escape_attribute_value(ariaLabel)
      },
      { viewBox: "0 0 15 15" },
      { fill: escape_attribute_value(color) },
      { xmlns: "http://www.w3.org/2000/svg" }
    ],
    {}
  )}><path fill-rule="evenodd" clip-rule="evenodd" d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor"></path></svg>` : `<svg${spread(
    [
      { width: escape_attribute_value(size2) },
      { height: escape_attribute_value(size2) },
      escape_object($$restProps),
      { role: escape_attribute_value(role) },
      {
        "aria-label": escape_attribute_value(ariaLabel)
      },
      { viewBox: "0 0 15 15" },
      { fill: escape_attribute_value(color) },
      { xmlns: "http://www.w3.org/2000/svg" }
    ],
    {}
  )}><path fill-rule="evenodd" clip-rule="evenodd" d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor"></path></svg>`} `;
});
const Radio_group_item = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "value"]);
  let { class: className = void 0 } = $$props;
  let { value } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  return `${validate_component(Radio_group_item$1, "RadioGroupPrimitive.Item").$$render(
    $$result,
    Object.assign(
      {},
      { value },
      {
        class: cn$1("aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className)
      },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `<div class="flex items-center justify-center">${validate_component(Radio_group_item_indicator, "RadioGroupPrimitive.ItemIndicator").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(Check, "Check").$$render($$result, { class: "h-3.5 w-3.5 fill-primary" }, {}, {})}`;
          }
        })}</div>`;
      }
    }
  )}`;
});
const Label = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `${validate_component(Label$1, "LabelPrimitive.Root").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn$1("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)
      },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `${slots.default ? slots.default({}) : ``}`;
      }
    }
  )}`;
});
const Calendar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["path", { "d": "M8 2v4" }],
    ["path", { "d": "M16 2v4" }],
    [
      "rect",
      {
        "width": "18",
        "height": "18",
        "x": "3",
        "y": "4",
        "rx": "2"
      }
    ],
    ["path", { "d": "M3 10h18" }]
  ];
  return `${validate_component(Icon$1, "Icon").$$render($$result, Object.assign({}, { name: "calendar" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const CalendarIcon = Calendar;
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const Calendar_cell = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["date", "class"]);
  let { date } = $$props;
  let { class: className = void 0 } = $$props;
  if ($$props.date === void 0 && $$bindings.date && date !== void 0)
    $$bindings.date(date);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `${validate_component(Calendar_cell$1, "CalendarPrimitive.Cell").$$render(
    $$result,
    Object.assign(
      {},
      { date },
      {
        class: cn$1("relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([data-selected])]:rounded-md [&:has([data-selected])]:bg-accent [&:has([data-selected][data-outside-month])]:bg-accent/50", className)
      },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `${slots.default ? slots.default({}) : ``}`;
      }
    }
  )}`;
});
const Calendar_day = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["date", "month", "class"]);
  let { date } = $$props;
  let { month } = $$props;
  let { class: className = void 0 } = $$props;
  if ($$props.date === void 0 && $$bindings.date && date !== void 0)
    $$bindings.date(date);
  if ($$props.month === void 0 && $$bindings.month && month !== void 0)
    $$bindings.month(month);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `${validate_component(Calendar_day$1, "CalendarPrimitive.Day").$$render(
    $$result,
    Object.assign(
      {},
      { date },
      { month },
      {
        class: cn$1(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal",
          // Today
          "[&[data-today]:not([data-selected])]:bg-accent [&[data-today]:not([data-selected])]:text-accent-foreground",
          // Selected
          "data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:opacity-100 data-[selected]:hover:bg-primary data-[selected]:hover:text-primary-foreground data-[selected]:focus:bg-primary data-[selected]:focus:text-primary-foreground",
          // Disabled
          "data-[disabled]:text-muted-foreground data-[disabled]:opacity-50",
          // Unavailable
          "data-[unavailable]:text-destructive-foreground data-[unavailable]:line-through",
          // Outside months
          "data-[outside-month]:pointer-events-none data-[outside-month]:text-muted-foreground data-[outside-month]:opacity-50 [&[data-outside-month][data-selected]]:bg-accent/50 [&[data-outside-month][data-selected]]:text-muted-foreground [&[data-outside-month][data-selected]]:opacity-30",
          className
        )
      },
      $$restProps
    ),
    {},
    {
      default: ({ selected, disabled, unavailable, builder }) => {
        return `${slots.default ? slots.default({ selected, disabled, unavailable, builder }) : ` ${escape(date.day)} `}`;
      }
    }
  )}`;
});
const Calendar_grid = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `${validate_component(Calendar_grid$1, "CalendarPrimitive.Grid").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn$1("w-full border-collapse space-y-1", className)
      },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `${slots.default ? slots.default({}) : ``}`;
      }
    }
  )}`;
});
const Calendar_header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `${validate_component(Calendar_header$1, "CalendarPrimitive.Header").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn$1("relative flex w-full items-center justify-between pt-1", className)
      },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `${slots.default ? slots.default({}) : ``}`;
      }
    }
  )}`;
});
const Calendar_months = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<div${spread(
    [
      {
        class: escape_attribute_value(cn$1("mt-4 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</div>`;
});
const Calendar_grid_row = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `${validate_component(Calendar_grid_row$1, "CalendarPrimitive.GridRow").$$render($$result, Object.assign({}, { class: cn$1("flex", className) }, $$restProps), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Calendar_heading = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `${validate_component(Calendar_heading$1, "CalendarPrimitive.Heading").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn$1("text-sm font-medium", className)
      },
      $$restProps
    ),
    {},
    {
      default: ({ headingValue }) => {
        return `${slots.default ? slots.default({ headingValue }) : ` ${escape(headingValue)} `}`;
      }
    }
  )}`;
});
const Calendar_grid_body = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `${validate_component(Calendar_grid_body$1, "CalendarPrimitive.GridBody").$$render($$result, Object.assign({}, { class: cn$1(className) }, $$restProps), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Calendar_grid_head = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `${validate_component(Calendar_grid_head$1, "CalendarPrimitive.GridHead").$$render($$result, Object.assign({}, { class: cn$1(className) }, $$restProps), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Calendar_head_cell = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `${validate_component(Calendar_head_cell$1, "CalendarPrimitive.HeadCell").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn$1("w-8 rounded-md text-[0.8rem] font-normal text-muted-foreground", className)
      },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `${slots.default ? slots.default({}) : ``}`;
      }
    }
  )}`;
});
const ChevronRight = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["size", "role", "color", "ariaLabel", "withEvents"]);
  const ctx = getContext("iconCtx") ?? {};
  let { size: size2 = ctx.size || "24" } = $$props;
  let { role = ctx.role || "img" } = $$props;
  let { color = ctx.color || "currentColor" } = $$props;
  let { ariaLabel = "chevron right," } = $$props;
  let { withEvents = false } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size2 !== void 0)
    $$bindings.size(size2);
  if ($$props.role === void 0 && $$bindings.role && role !== void 0)
    $$bindings.role(role);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.ariaLabel === void 0 && $$bindings.ariaLabel && ariaLabel !== void 0)
    $$bindings.ariaLabel(ariaLabel);
  if ($$props.withEvents === void 0 && $$bindings.withEvents && withEvents !== void 0)
    $$bindings.withEvents(withEvents);
  return `${withEvents ? `<svg${spread(
    [
      { width: escape_attribute_value(size2) },
      { height: escape_attribute_value(size2) },
      escape_object($$restProps),
      { role: escape_attribute_value(role) },
      {
        "aria-label": escape_attribute_value(ariaLabel)
      },
      { viewBox: "0 0 15 15" },
      { fill: escape_attribute_value(color) },
      { xmlns: "http://www.w3.org/2000/svg" }
    ],
    {}
  )}><path fill-rule="evenodd" clip-rule="evenodd" d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z" fill="currentColor"></path></svg>` : `<svg${spread(
    [
      { width: escape_attribute_value(size2) },
      { height: escape_attribute_value(size2) },
      escape_object($$restProps),
      { role: escape_attribute_value(role) },
      {
        "aria-label": escape_attribute_value(ariaLabel)
      },
      { viewBox: "0 0 15 15" },
      { fill: escape_attribute_value(color) },
      { xmlns: "http://www.w3.org/2000/svg" }
    ],
    {}
  )}><path fill-rule="evenodd" clip-rule="evenodd" d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z" fill="currentColor"></path></svg>`} `;
});
const Calendar_next_button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `${validate_component(Calendar_next_button$1, "CalendarPrimitive.NextButton").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn$1(buttonVariants({ variant: "outline" }), "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100", className)
      },
      $$restProps
    ),
    {},
    {
      default: ({ builder }) => {
        return `${slots.default ? slots.default({ builder }) : ` ${validate_component(ChevronRight, "ChevronRight").$$render($$result, { class: "h-4 w-4" }, {}, {})} `}`;
      }
    }
  )}`;
});
const ChevronLeft = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["size", "role", "color", "ariaLabel", "withEvents"]);
  const ctx = getContext("iconCtx") ?? {};
  let { size: size2 = ctx.size || "24" } = $$props;
  let { role = ctx.role || "img" } = $$props;
  let { color = ctx.color || "currentColor" } = $$props;
  let { ariaLabel = "chevron left," } = $$props;
  let { withEvents = false } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size2 !== void 0)
    $$bindings.size(size2);
  if ($$props.role === void 0 && $$bindings.role && role !== void 0)
    $$bindings.role(role);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.ariaLabel === void 0 && $$bindings.ariaLabel && ariaLabel !== void 0)
    $$bindings.ariaLabel(ariaLabel);
  if ($$props.withEvents === void 0 && $$bindings.withEvents && withEvents !== void 0)
    $$bindings.withEvents(withEvents);
  return `${withEvents ? `<svg${spread(
    [
      { width: escape_attribute_value(size2) },
      { height: escape_attribute_value(size2) },
      escape_object($$restProps),
      { role: escape_attribute_value(role) },
      {
        "aria-label": escape_attribute_value(ariaLabel)
      },
      { viewBox: "0 0 15 15" },
      { fill: escape_attribute_value(color) },
      { xmlns: "http://www.w3.org/2000/svg" }
    ],
    {}
  )}><path fill-rule="evenodd" clip-rule="evenodd" d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z" fill="currentColor"></path></svg>` : `<svg${spread(
    [
      { width: escape_attribute_value(size2) },
      { height: escape_attribute_value(size2) },
      escape_object($$restProps),
      { role: escape_attribute_value(role) },
      {
        "aria-label": escape_attribute_value(ariaLabel)
      },
      { viewBox: "0 0 15 15" },
      { fill: escape_attribute_value(color) },
      { xmlns: "http://www.w3.org/2000/svg" }
    ],
    {}
  )}><path fill-rule="evenodd" clip-rule="evenodd" d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z" fill="currentColor"></path></svg>`} `;
});
const Calendar_prev_button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `${validate_component(Calendar_prev_button$1, "CalendarPrimitive.PrevButton").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn$1(buttonVariants({ variant: "outline" }), "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100", className)
      },
      $$restProps
    ),
    {},
    {
      default: ({ builder }) => {
        return `${slots.default ? slots.default({ builder }) : ` ${validate_component(ChevronLeft, "ChevronLeft").$$render($$result, { class: "h-4 w-4" }, {}, {})} `}`;
      }
    }
  )}`;
});
const Calendar_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["value", "placeholder", "weekdayFormat", "class"]);
  let { value = void 0 } = $$props;
  let { placeholder = void 0 } = $$props;
  let { weekdayFormat = "short" } = $$props;
  let { class: className = void 0 } = $$props;
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0)
    $$bindings.placeholder(placeholder);
  if ($$props.weekdayFormat === void 0 && $$bindings.weekdayFormat && weekdayFormat !== void 0)
    $$bindings.weekdayFormat(weekdayFormat);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${validate_component(Calendar$1, "CalendarPrimitive.Root").$$render(
      $$result,
      Object.assign({}, { weekdayFormat }, { class: cn$1("p-3", className) }, $$restProps, { value }, { placeholder }),
      {
        value: ($$value) => {
          value = $$value;
          $$settled = false;
        },
        placeholder: ($$value) => {
          placeholder = $$value;
          $$settled = false;
        }
      },
      {
        default: ({ months, weekdays }) => {
          return `${validate_component(Calendar_header, "Calendar.Header").$$render($$result, {}, {}, {
            default: () => {
              return `${validate_component(Calendar_prev_button, "Calendar.PrevButton").$$render($$result, {}, {}, {})} ${validate_component(Calendar_heading, "Calendar.Heading").$$render($$result, {}, {}, {})} ${validate_component(Calendar_next_button, "Calendar.NextButton").$$render($$result, {}, {}, {})}`;
            }
          })} ${validate_component(Calendar_months, "Calendar.Months").$$render($$result, {}, {}, {
            default: () => {
              return `${each(months, (month) => {
                return `${validate_component(Calendar_grid, "Calendar.Grid").$$render($$result, {}, {}, {
                  default: () => {
                    return `${validate_component(Calendar_grid_head, "Calendar.GridHead").$$render($$result, {}, {}, {
                      default: () => {
                        return `${validate_component(Calendar_grid_row, "Calendar.GridRow").$$render($$result, { class: "flex" }, {}, {
                          default: () => {
                            return `${each(weekdays, (weekday) => {
                              return `${validate_component(Calendar_head_cell, "Calendar.HeadCell").$$render($$result, {}, {}, {
                                default: () => {
                                  return `${escape(weekday.slice(0, 2))} `;
                                }
                              })}`;
                            })} `;
                          }
                        })} `;
                      }
                    })} ${validate_component(Calendar_grid_body, "Calendar.GridBody").$$render($$result, {}, {}, {
                      default: () => {
                        return `${each(month.weeks, (weekDates) => {
                          return `${validate_component(Calendar_grid_row, "Calendar.GridRow").$$render($$result, { class: "mt-2 w-full" }, {}, {
                            default: () => {
                              return `${each(weekDates, (date) => {
                                return `${validate_component(Calendar_cell, "Calendar.Cell").$$render($$result, { date }, {}, {
                                  default: () => {
                                    return `${validate_component(Calendar_day, "Calendar.Day").$$render($$result, { date, month: month.value }, {}, {})} `;
                                  }
                                })}`;
                              })} `;
                            }
                          })}`;
                        })} `;
                      }
                    })} `;
                  }
                })}`;
              })}`;
            }
          })}`;
        }
      }
    )}`;
  } while (!$$settled);
  return $$rendered;
});
const Popover_content = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "transition", "transitionConfig", "align", "sideOffset"]);
  let { class: className = void 0 } = $$props;
  let { transition = flyAndScale } = $$props;
  let { transitionConfig = void 0 } = $$props;
  let { align = "center" } = $$props;
  let { sideOffset = 4 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.transition === void 0 && $$bindings.transition && transition !== void 0)
    $$bindings.transition(transition);
  if ($$props.transitionConfig === void 0 && $$bindings.transitionConfig && transitionConfig !== void 0)
    $$bindings.transitionConfig(transitionConfig);
  if ($$props.align === void 0 && $$bindings.align && align !== void 0)
    $$bindings.align(align);
  if ($$props.sideOffset === void 0 && $$bindings.sideOffset && sideOffset !== void 0)
    $$bindings.sideOffset(sideOffset);
  return `${validate_component(Popover_content$1, "PopoverPrimitive.Content").$$render(
    $$result,
    Object.assign({}, { transition }, { transitionConfig }, { align }, { sideOffset }, $$restProps, {
      class: cn$1("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none", className)
    }),
    {},
    {
      default: () => {
        return `${slots.default ? slots.default({}) : ``}`;
      }
    }
  )}`;
});
const Root$1 = Popover;
const Trigger$1 = Popover_trigger;
const DateTime = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const df = new DateFormatter("en-US", { dateStyle: "long" });
  let value = void 0;
  const dispatch = createEventDispatcher();
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      if (value !== void 0) {
        console.log(value);
        dispatch("change", { value });
      }
    }
    $$rendered = `${validate_component(Root$1, "Popover.Root").$$render($$result, { openFocus: true }, {}, {
      default: () => {
        return `${validate_component(Trigger$1, "Popover.Trigger").$$render($$result, { asChild: true }, {}, {
          default: ({ builder }) => {
            return `${validate_component(Button, "Button").$$render(
              $$result,
              {
                variant: "outline",
                class: cn("w-[280px] justify-start text-left font-normal", !value && "text-muted-foreground"),
                builders: [builder]
              },
              {},
              {
                default: () => {
                  return `${validate_component(CalendarIcon, "CalendarIcon").$$render($$result, { class: "mr-2 h-4 w-4" }, {}, {})} ${escape(value ? df.format(value.toDate(getLocalTimeZone())) : "Select a date")}`;
                }
              }
            )}`;
          }
        })} ${validate_component(Popover_content, "Popover.Content").$$render($$result, { class: "w-auto p-0" }, {}, {
          default: () => {
            return `${validate_component(Calendar_1, "Calendar").$$render(
              $$result,
              { initialFocus: true, value },
              {
                value: ($$value) => {
                  value = $$value;
                  $$settled = false;
                }
              },
              {}
            )}`;
          }
        })}`;
      }
    })}`;
  } while (!$$settled);
  return $$rendered;
});
const Numberinput = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { value = 0 } = $$props;
  createEventDispatcher();
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  return `<form class="max-w-xs mx-auto"><label for="quantity-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" data-svelte-h="svelte-1l83ico">min nurses per shift:</label> <div class="relative flex items-center max-w-[8rem] h-5px -mt-3"> <input type="number" id="quantity-input" class="bg-gray-50 border-x-0 border-gray-300 h-2 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="999" required${add_attribute("value", value, 0)}> </div></form>`;
});
const Hover_card_content = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "align", "sideOffset", "transition", "transitionConfig"]);
  let { class: className = void 0 } = $$props;
  let { align = "center" } = $$props;
  let { sideOffset = 4 } = $$props;
  let { transition = flyAndScale } = $$props;
  let { transitionConfig = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.align === void 0 && $$bindings.align && align !== void 0)
    $$bindings.align(align);
  if ($$props.sideOffset === void 0 && $$bindings.sideOffset && sideOffset !== void 0)
    $$bindings.sideOffset(sideOffset);
  if ($$props.transition === void 0 && $$bindings.transition && transition !== void 0)
    $$bindings.transition(transition);
  if ($$props.transitionConfig === void 0 && $$bindings.transitionConfig && transitionConfig !== void 0)
    $$bindings.transitionConfig(transitionConfig);
  return `${validate_component(Link_preview_content, "HoverCardPrimitive.Content").$$render(
    $$result,
    Object.assign(
      {},
      { transition },
      { transitionConfig },
      { sideOffset },
      { align },
      {
        class: cn$1("z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none", className)
      },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `${slots.default ? slots.default({}) : ``}`;
      }
    }
  )}`;
});
const Root = Link_preview;
const Trigger = Link_preview_trigger;
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $users, $$unsubscribe_users;
  let $possible, $$unsubscribe_possible;
  let open = false;
  let perShift = 3;
  let name2 = "";
  let email = "";
  let phone = "";
  let gender = "male";
  let users = writable([]);
  $$unsubscribe_users = subscribe(users, (value) => $users = value);
  let currentMonth = dayjs();
  let month;
  let daysInMonth;
  let holiday = writable({});
  let maxDaysOvertime = 0;
  async function fetchHolidays() {
    holiday = {};
    const lastDateOfMonth = currentMonth.endOf("month").date();
    fetch(`https://openholidaysapi.org/PublicHolidays?countryIsoCode=HR&languageIsoCode=HR&validFrom=${currentMonth["$y"]}-${currentMonth["$M"] + 1}-01&validTo=${currentMonth["$y"]}-${currentMonth["$M"] + 1}-${lastDateOfMonth}`).then((response) => response.json()).then((data) => {
      data.forEach((holidayy) => {
        holiday[Number(holidayy.startDate.slice(-2))] = true;
      });
    });
    console.log(holiday, currentMonth, "holiday");
  }
  let possible = writable(false);
  $$unsubscribe_possible = subscribe(possible, (value) => $possible = value);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      if (currentMonth) {
        month = currentMonth.daysInMonth();
        fetchHolidays();
      }
    }
    {
      if (month) {
        daysInMonth = Array.from({ length: month }, (_, i) => currentMonth.date(i + 1));
      }
    }
    {
      if (holiday) {
        maxDaysOvertime = 0;
        daysInMonth.forEach((day) => {
          const isWeekend = day.day() === 0 || day.day() === 6 || holiday[day.date()];
          maxDaysOvertime = isWeekend ? maxDaysOvertime + 1 : maxDaysOvertime;
        });
        const lastDateOfMonth = currentMonth.endOf("month").date();
        maxDaysOvertime = lastDateOfMonth - maxDaysOvertime;
      }
    }
    $$rendered = `<div class="print flex flex-col sm:flex-row justify-between">${validate_component(Button, "Button").$$render($$result, { class: "print sm:w-1/4" }, {}, {
      default: () => {
        return `Reset`;
      }
    })} <div class="print">${validate_component(DateTime, "DateTime").$$render($$result, {}, {}, {})}</div> <div class="print">${validate_component(Numberinput, "Numberinput").$$render($$result, { value: perShift }, {}, {})}</div></div> <div class="print">${validate_component(Root$2, "Dialog.Root").$$render($$result, { open }, {}, {
      default: () => {
        return `${validate_component(Trigger$2, "Dialog.Trigger").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(Button, "Button").$$render($$result, { variant: "outline" }, {}, {
              default: () => {
                return `Add User`;
              }
            })}`;
          }
        })} ${validate_component(Dialog_content, "Dialog.Content").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(Dialog_header, "Dialog.Header").$$render($$result, {}, {}, {
              default: () => {
                return `${validate_component(Dialog_title, "Dialog.Title").$$render($$result, {}, {}, {
                  default: () => {
                    return `Add a new user`;
                  }
                })}`;
              }
            })} ${validate_component(Input, "Input").$$render(
              $$result,
              { placeholder: "Name", value: name2 },
              {
                value: ($$value) => {
                  name2 = $$value;
                  $$settled = false;
                }
              },
              {}
            )} ${validate_component(Input, "Input").$$render(
              $$result,
              { placeholder: "Email", value: email },
              {
                value: ($$value) => {
                  email = $$value;
                  $$settled = false;
                }
              },
              {}
            )} ${validate_component(Input, "Input").$$render(
              $$result,
              { placeholder: "Phone", value: phone },
              {
                value: ($$value) => {
                  phone = $$value;
                  $$settled = false;
                }
              },
              {}
            )} ${validate_component(Radio_group, "RadioGroup.Root").$$render(
              $$result,
              { value: gender },
              {
                value: ($$value) => {
                  gender = $$value;
                  $$settled = false;
                }
              },
              {
                default: () => {
                  return `<div class="flex items-center space-x-2">${validate_component(Radio_group_item, "RadioGroup.Item").$$render($$result, { value: "male", id: "r1" }, {}, {})} ${validate_component(Label, "Label").$$render($$result, { for: "r1" }, {}, {
                    default: () => {
                      return `Male`;
                    }
                  })}</div> <div class="flex items-center space-x-2">${validate_component(Radio_group_item, "RadioGroup.Item").$$render($$result, { value: "female", id: "r2" }, {}, {})} ${validate_component(Label, "Label").$$render($$result, { for: "r2" }, {}, {
                    default: () => {
                      return `Female`;
                    }
                  })}</div>`;
                }
              }
            )} ${validate_component(Dialog_footer, "Dialog.Footer").$$render($$result, {}, {}, {
              default: () => {
                return `${validate_component(Button, "Button").$$render($$result, { variant: "default" }, {}, {
                  default: () => {
                    return `Add User`;
                  }
                })} ${validate_component(Button, "Button").$$render($$result, { variant: "destructive" }, {}, {
                  default: () => {
                    return `Cancel`;
                  }
                })}`;
              }
            })}`;
          }
        })}`;
      }
    })} ${validate_component(Root$2, "Dialog.Root").$$render($$result, { $possible, open: $possible }, {}, {
      default: () => {
        return `${validate_component(Dialog_content, "Dialog.Content").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(Dialog_header, "Dialog.Header").$$render($$result, {}, {}, {
              default: () => {
                return `${validate_component(Dialog_title, "Dialog.Title").$$render($$result, { onblur: () => $possible = false }, {}, {
                  default: () => {
                    return `Message`;
                  }
                })}`;
              }
            })} <p data-svelte-h="svelte-2ez990">Not possible</p> ${validate_component(Dialog_footer, "Dialog.Footer").$$render($$result, {}, {}, {
              default: () => {
                return `<button${add_attribute("tabindex", -1, 0)} style="display: none;" data-svelte-h="svelte-1g0qi28">Focusable Element</button> ${validate_component(Button, "Button").$$render($$result, {}, {}, {
                  default: () => {
                    return `Close`;
                  }
                })}`;
              }
            })}`;
          }
        })}`;
      }
    })}</div> <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Shifts for ${escape(currentMonth.format("MMMM YYYY"))}</h1> <p class="leading-7 [&:not(:first-child)]:mt-6 print">maximum days of overtime: ${escape(maxDaysOvertime)}</p> ${$users.length > 0 ? `${validate_component(Table, "Table.Root").$$render($$result, { style: "width: 100%;" }, {}, {
      default: () => {
        return `${validate_component(Table_caption, "Table.Caption").$$render($$result, {}, {}, {
          default: () => {
            return `A list of all the shifts`;
          }
        })} ${validate_component(Table_header, "Table.Header").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(Table_row, "Table.Row").$$render($$result, { class: "border-b border-black h-1" }, {}, {
              default: () => {
                return `${validate_component(Table_head, "Table.Head").$$render($$result, {}, {}, {
                  default: () => {
                    return `Name`;
                  }
                })} ${each(daysInMonth, (day) => {
                  return `${validate_component(Table_head, "Table.Head").$$render($$result, {}, {}, {
                    default: () => {
                      return `${escape(day.format("D"))}`;
                    }
                  })}`;
                })}`;
              }
            })}`;
          }
        })} ${validate_component(Table_body, "Table.Body").$$render($$result, {}, {}, {
          default: () => {
            return `${each($users, (user) => {
              return ` ${validate_component(Table_row, "Table.Row").$$render($$result, { class: "border-b border-black h-1 " }, {}, {
                default: () => {
                  return `${validate_component(Table_cell, "Table.Cell").$$render($$result, { class: "min-w-full" }, {}, {
                    default: () => {
                      return `${validate_component(Root, "HoverCard.Root").$$render($$result, {}, {}, {
                        default: () => {
                          return `${validate_component(Trigger, "HoverCard.Trigger").$$render($$result, {}, {}, {
                            default: () => {
                              return `<div style="display: flex; flex-direction: row; align-items: center; " class="max-w-12 h-8"><p class="w-12 text-xs" style="word-wrap: break-word;">${escape(user.name)}</p> <button class="print">${validate_component(X$1, "X").$$render($$result, {}, {}, {})}</button> </div>`;
                            }
                          })} ${validate_component(Hover_card_content, "HoverCard.Content").$$render($$result, {}, {}, {
                            default: () => {
                              return `<div class="print"><strong>${escape(user.name)}</strong> <p>Email: ${escape(user.email)}</p> <p>Phone: ${escape(user.phone)}</p> <p>Gender: ${escape(user.gender)}</p></div> `;
                            }
                          })} `;
                        }
                      })} `;
                    }
                  })} ${each(daysInMonth, (day, i) => {
                    return `${validate_component(Table_cell, "Table.Cell").$$render(
                      $$result,
                      {
                        class: "min-w-2 printer-cell",
                        style: "background: " + (day.day() === 0 || day.day() === 6 || holiday[i + 1] ? "gray" : "transparent") + "; max-width: 3px;"
                      },
                      {},
                      {
                        default: () => {
                          return `<button style="background: transparent; max-width: 20px;">${user.shifts && user.shifts.length > 20 ? `<span style="color: black; max-width:20px;">${escape(user.shifts[i + 1])}</span>` : `${user.offDays[day.date() - 1] ? `<span class="flex items-center justify-center -ml-2" style="color: red;">${validate_component(X$1, "X").$$render($$result, {}, {}, {})}</span>` : `<span class="flex items-center justify-center -ml-2" style="color: green;">${validate_component(Check$2, "Check").$$render($$result, {}, {}, {})}</span>`}`} </button>`;
                        }
                      }
                    )}`;
                  })} `;
                }
              })}`;
            })}`;
          }
        })}`;
      }
    })}` : ``} ${validate_component(Button, "Button").$$render($$result, { class: "print" }, {}, {
      default: () => {
        return `Generate Schedule`;
      }
    })}`;
  } while (!$$settled);
  $$unsubscribe_users();
  $$unsubscribe_possible();
  return $$rendered;
});
export {
  Page as default
};
