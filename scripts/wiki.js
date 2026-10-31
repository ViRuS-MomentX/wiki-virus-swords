const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./soft3d.js","./data.js","./model3d.js","./three.js"])))=>i.map(i=>d[i]);
import { r as reactive, c as computed, w as watch, o as onMounted, a as onBeforeUnmount, b as openBlock, d as createElementBlock, e as createBaseVNode, u as unref, f as withDirectives, v as vModelText, F as Fragment, g as renderList, h as createCommentVNode, i as createTextVNode, t as toDisplayString, n as normalizeClass, j as ref, k as withModifiers, l as renderSlot, m as normalizeStyle, p as createVNode, q as withCtx, s as vShow, x as createBlock, y as resolveDynamicComponent, z as nextTick, T as Transition, A as createStaticVNode, B as createApp } from "./vue.js";
import { d as data } from "./data.js";
const norm = (s) => s.toLowerCase().replace(/ё/g, "е");
const plural = (n, one, few, many) => {
  const t = n % 100, u = n % 10;
  return t >= 11 && t <= 14 ? many : u === 1 ? one : u >= 2 && u <= 4 ? few : many;
};
const byId = new Map(data.items.map((item2) => [item2.id, item2]));
const item = (id) => byId.get(id);
const searchText = (i) => norm([i.name, i.rarityLabel, i.obtain, i.lore.join(" ").replace(/<[^>]+>/g, "")].join(" "));
const advText = (a) => norm([a.title, a.description, a.condition].join(" "));
const filters = reactive({ query: "", line: "all" });
const matches = (text) => !filters.query || text.includes(filters.query);
const weapons = computed(() => data.items.filter((i) => i.kind === "weapon" && (filters.line === "all" || i.line === filters.line) && matches(searchText(i))));
const materials = computed(() => data.items.filter((i) => i.kind === "material" && matches(searchText(i))));
const achievementGroups = computed(() => data.achievements.map((group) => ({ ...group, cards: group.cards.filter((card) => matches(advText(card))) })).filter((group) => group.cards.length));
const hint = computed(() => {
  if (!filters.query) return "";
  const shown = weapons.value.length + materials.value.length;
  const adv = achievementGroups.value.reduce((n, g) => n + g.cards.length, 0);
  return `Нашлось: ${shown} ${plural(shown, "предмет", "предмета", "предметов")}, ${adv} ${plural(adv, "достижение", "достижения", "достижений")}`;
});
const found = computed(() => {
  if (!filters.query) return [];
  const hits = data.items.filter((i) => (i.kind === "weapon" || i.kind === "material") && searchText(i).includes(filters.query));
  const inName = (i) => norm(i.name).includes(filters.query) ? 0 : 1;
  return hits.sort((a, b) => inName(a) - inName(b));
});
function distance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const keep = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = keep;
    }
  }
  return row[b.length];
}
const suggestions = computed(() => {
  const q = filters.query.trim();
  if (q.length < 3 || found.value.length) return [];
  const scored = data.items.filter((i) => i.kind === "weapon" || i.kind === "material").map((i) => {
    const name = norm(i.name);
    const best = Math.min(distance(q, name), ...name.split(/[\s-]+/).filter((w) => w.length > 2).map((w) => distance(q, w)));
    return { item: i, d: best };
  }).filter((s) => s.d <= Math.max(2, Math.floor(q.length / 3)));
  return scored.sort((a, b) => a.d - b.d).slice(0, 3).map((s) => s.item);
});
const order = [.../* @__PURE__ */ new Set([...data.chains.flatMap((c) => c.entries.map((e) => e.id)), ...data.items.filter((i) => i.kind === "material").map((i) => i.id)])];
const shownIds = computed(() => new Set([...weapons.value, ...materials.value].map((i) => i.id)));
const inspector = reactive({ id: null });
const openItem = (id) => {
  inspector.id = id;
  history.replaceState(null, "", `#w-${id}`);
};
const closeItem = () => {
  inspector.id = null;
  history.replaceState(null, "", location.pathname + location.search);
};
const compare = reactive({ id: null });
const _hoisted_1$u = { class: "topbar" };
const _hoisted_2$r = { class: "topbar-in" };
const _hoisted_3$p = {
  class: "brand",
  href: "#top"
};
const _hoisted_4$n = ["src"];
const _hoisted_5$m = ["aria-expanded", "aria-activedescendant"];
const _hoisted_6$m = ["title"];
const _hoisted_7$m = {
  key: 0,
  class: "found-box"
};
const _hoisted_8$l = {
  key: 0,
  id: "found",
  class: "found",
  role: "listbox",
  "aria-label": "Найденные предметы"
};
const _hoisted_9$i = ["id", "aria-selected"];
const _hoisted_10$f = ["href", "onMouseenter"];
const _hoisted_11$e = ["src"];
const _hoisted_12$d = ["title"];
const _hoisted_13$b = { class: "found-kind" };
const _hoisted_14$9 = {
  class: "search-hint",
  "aria-live": "polite"
};
const _hoisted_15$8 = {
  key: 1,
  class: "search-suggest"
};
const _hoisted_16$7 = ["onClick"];
const _hoisted_17$7 = {
  key: 1,
  class: "search-hint"
};
const _hoisted_18$6 = ["href", "aria-current"];
const _hoisted_19$6 = {
  key: 0,
  class: "count"
};
const SHOWN = 8;
const _sfc_main$y = {
  __name: "SideNav",
  setup(__props) {
    const sections = [
      ["catalog", "Каталог", data.items.length],
      ["start", "С чего начать"],
      ["rarity", "Редкости"],
      ["weapons", "Линии клинков", data.counts.weapons],
      ["craft", "Крафт", data.recipes.length],
      ["growth", "Рост клинка"],
      ["sanctums", "Святилища", 5],
      ["raids", "Испытания"],
      ["blood", "Родословные", data.blood.length],
      ["trophies", "Достижения", data.counts.trophies],
      ["admin", "Для администратора"]
    ];
    const current = ref("");
    const search = ref("");
    const input = ref(null);
    const nav = ref(null);
    const cursor = ref(0);
    const listOpen = ref(false);
    const onSearch = () => {
      filters.query = norm(search.value.trim());
      cursor.value = 0;
      listOpen.value = true;
    };
    function suggest(name) {
      var _a;
      search.value = name;
      onSearch();
      (_a = input.value) == null ? void 0 : _a.focus();
    }
    function onSearchKey(e) {
      const list = found.value.slice(0, SHOWN);
      if (e.key === "ArrowDown" && list.length) {
        e.preventDefault();
        listOpen.value = true;
        cursor.value = (cursor.value + 1) % list.length;
      } else if (e.key === "ArrowUp" && list.length) {
        e.preventDefault();
        cursor.value = (cursor.value - 1 + list.length) % list.length;
      } else if (e.key === "Enter" && list.length) {
        e.preventDefault();
        openItem(list[cursor.value].id);
        listOpen.value = false;
      } else if (e.key === "Escape") {
        e.stopPropagation();
        if (listOpen.value && search.value) listOpen.value = false;
        else {
          search.value = "";
          onSearch();
          listOpen.value = false;
        }
      }
    }
    const choose = () => {
      listOpen.value = false;
    };
    const clear = () => {
      var _a;
      search.value = "";
      onSearch();
      listOpen.value = false;
      (_a = input.value) == null ? void 0 : _a.focus();
    };
    const onBlur = (e) => {
      if (!e.currentTarget.contains(e.relatedTarget)) listOpen.value = false;
    };
    let observer;
    const onKey = (e) => {
      var _a, _b;
      const combo = (e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === "k";
      if (combo || e.key === "/" && !e.target.matches("input, textarea")) {
        e.preventDefault();
        (_a = input.value) == null ? void 0 : _a.focus();
        (_b = input.value) == null ? void 0 : _b.select();
      }
    };
    const mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    watch(current, (id) => {
      const row = nav.value;
      if (!row || row.scrollWidth <= row.clientWidth) return;
      const link = row.querySelector(`a[href="#${id}"]`);
      if (link) row.scrollTo({ left: link.offsetLeft - row.clientWidth / 2 + link.offsetWidth / 2, behavior: "smooth" });
    });
    onMounted(() => {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) current.value = entry.target.id;
        });
      }, { rootMargin: "-35% 0px -60% 0px" });
      document.querySelectorAll("main section[id]").forEach((s) => observer.observe(s));
      document.addEventListener("keydown", onKey);
    });
    onBeforeUnmount(() => {
      observer == null ? void 0 : observer.disconnect();
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", edges2);
    });
    const moreLeft = ref(false);
    const moreRight = ref(false);
    function edges2() {
      const el = nav.value;
      if (!el) return;
      moreLeft.value = el.scrollLeft > 2;
      moreRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 2;
    }
    function step(dir) {
      const el = nav.value;
      if (el) el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: "smooth" });
    }
    function onWheel(e) {
      const el = nav.value;
      if (!el || el.scrollWidth <= el.clientWidth || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    }
    onMounted(() => {
      edges2();
      window.addEventListener("resize", edges2);
    });
    watch(current, () => setTimeout(edges2, 400));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("header", _hoisted_1$u, [
        createBaseVNode("div", _hoisted_2$r, [
          createBaseVNode("a", _hoisted_3$p, [
            createBaseVNode("img", {
              class: "brand-mark",
              src: unref(data).icons.forge_heart,
              alt: ""
            }, null, 8, _hoisted_4$n),
            _cache[5] || (_cache[5] = createBaseVNode("span", { class: "brand-name" }, "Кодекс", -1))
          ]),
          createBaseVNode("div", {
            class: "search",
            role: "search",
            onFocusout: onBlur
          }, [
            _cache[7] || (_cache[7] = createBaseVNode("label", {
              for: "q",
              class: "sr-only"
            }, "Поиск по кодексу", -1)),
            _cache[8] || (_cache[8] = createBaseVNode("svg", {
              class: "search-icon",
              viewBox: "0 0 16 16",
              "aria-hidden": "true"
            }, [
              createBaseVNode("circle", {
                cx: "7",
                cy: "7",
                r: "4.6",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "1.6"
              }),
              createBaseVNode("path", {
                d: "M10.4 10.4L14 14",
                stroke: "currentColor",
                "stroke-width": "1.6",
                "stroke-linecap": "square"
              })
            ], -1)),
            withDirectives(createBaseVNode("input", {
              id: "q",
              ref_key: "input",
              ref: input,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => search.value = $event),
              type: "search",
              placeholder: "Поиск",
              autocomplete: "off",
              role: "combobox",
              "aria-keyshortcuts": "/ Control+K Meta+K",
              "aria-controls": "found",
              "aria-expanded": String(listOpen.value && unref(found).length > 0),
              "aria-autocomplete": "list",
              "aria-activedescendant": listOpen.value && unref(found).length ? `found-${cursor.value}` : void 0,
              onInput: onSearch,
              onFocus: _cache[1] || (_cache[1] = ($event) => listOpen.value = true),
              onKeydown: onSearchKey
            }, null, 40, _hoisted_5$m), [
              [vModelText, search.value]
            ]),
            createBaseVNode("kbd", {
              class: "search-key",
              "aria-hidden": "true",
              title: `Поиск: / или ${unref(mac) ? "⌘K" : "Ctrl+K"}`
            }, "/", 8, _hoisted_6$m),
            listOpen.value && unref(filters).query ? (openBlock(), createElementBlock("div", _hoisted_7$m, [
              unref(found).length ? (openBlock(), createElementBlock("ul", _hoisted_8$l, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(unref(found).slice(0, SHOWN), (i, k) => {
                  return openBlock(), createElementBlock("li", {
                    id: `found-${k}`,
                    key: i.id,
                    role: "option",
                    "aria-selected": String(k === cursor.value)
                  }, [
                    createBaseVNode("a", {
                      href: `#w-${i.id}`,
                      class: normalizeClass(["found-item", { on: k === cursor.value }]),
                      tabindex: "-1",
                      onMouseenter: ($event) => cursor.value = k,
                      onClick: choose
                    }, [
                      createBaseVNode("img", {
                        src: i.icon,
                        alt: ""
                      }, null, 8, _hoisted_11$e),
                      createBaseVNode("span", {
                        class: "found-name",
                        title: i.name
                      }, toDisplayString(i.name), 9, _hoisted_12$d),
                      createBaseVNode("span", _hoisted_13$b, toDisplayString(i.kind === "weapon" ? "клинок" : "материал"), 1)
                    ], 42, _hoisted_10$f)
                  ], 8, _hoisted_9$i);
                }), 128))
              ])) : createCommentVNode("", true),
              createBaseVNode("p", _hoisted_14$9, [
                createTextVNode(toDisplayString(unref(hint)), 1),
                unref(found).length > SHOWN ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                  createTextVNode(". В списке первые " + toDisplayString(SHOWN) + ", остальные подсвечены на странице")
                ], 64)) : createCommentVNode("", true)
              ]),
              unref(suggestions).length ? (openBlock(), createElementBlock("p", _hoisted_15$8, [
                _cache[6] || (_cache[6] = createTextVNode("Возможно, вы искали: ", -1)),
                (openBlock(true), createElementBlock(Fragment, null, renderList(unref(suggestions), (i) => {
                  return openBlock(), createElementBlock("button", {
                    key: i.id,
                    type: "button",
                    class: "suggest-chip",
                    onMousedown: _cache[2] || (_cache[2] = withModifiers(() => {
                    }, ["prevent"])),
                    onClick: ($event) => suggest(i.name)
                  }, toDisplayString(i.name), 41, _hoisted_16$7);
                }), 128))
              ])) : createCommentVNode("", true)
            ])) : unref(filters).query ? (openBlock(), createElementBlock("p", _hoisted_17$7, [
              createTextVNode(toDisplayString(unref(hint)) + ". ", 1),
              createBaseVNode("button", {
                type: "button",
                class: "text-btn hint-clear",
                onClick: clear
              }, "Сбросить")
            ])) : createCommentVNode("", true)
          ], 32),
          createBaseVNode("div", {
            class: normalizeClass(["nav-wrap", { "more-left": moreLeft.value, "more-right": moreRight.value }])
          }, [
            createBaseVNode("button", {
              type: "button",
              class: "nav-step left",
              tabindex: "-1",
              "aria-hidden": "true",
              onClick: _cache[3] || (_cache[3] = ($event) => step(-1))
            }, [..._cache[9] || (_cache[9] = [
              createBaseVNode("svg", { viewBox: "0 0 16 16" }, [
                createBaseVNode("path", {
                  d: "M10 3L5 8l5 5",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "1.8"
                })
              ], -1)
            ])]),
            createBaseVNode("nav", {
              ref_key: "nav",
              ref: nav,
              class: "nav",
              "aria-label": "Разделы",
              onScrollPassive: edges2,
              onWheel
            }, [
              (openBlock(), createElementBlock(Fragment, null, renderList(sections, ([id, title, count]) => {
                return createBaseVNode("a", {
                  key: id,
                  href: `#${id}`,
                  class: normalizeClass({ on: current.value === id }),
                  "aria-current": current.value === id ? "location" : void 0
                }, [
                  createBaseVNode("span", null, toDisplayString(title), 1),
                  count ? (openBlock(), createElementBlock("span", _hoisted_19$6, toDisplayString(count), 1)) : createCommentVNode("", true)
                ], 10, _hoisted_18$6);
              }), 64))
            ], 544),
            createBaseVNode("button", {
              type: "button",
              class: "nav-step right",
              tabindex: "-1",
              "aria-hidden": "true",
              onClick: _cache[4] || (_cache[4] = ($event) => step(1))
            }, [..._cache[10] || (_cache[10] = [
              createBaseVNode("svg", { viewBox: "0 0 16 16" }, [
                createBaseVNode("path", {
                  d: "M6 3l5 5-5 5",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "1.8"
                })
              ], -1)
            ])])
          ], 2)
        ])
      ]);
    };
  }
};
const rarities = new Map(data.rarities.map((r) => [r.const, r]));
const MIN_LIGHT = 0.42;
function luminance([r, g, b]) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}
function lift(hex) {
  const n = parseInt(hex.slice(1), 16);
  const rgb = [n >> 16, n >> 8 & 255, n & 255];
  const l = luminance(rgb);
  if (l >= MIN_LIGHT) return hex;
  const t = (MIN_LIGHT - l) / (1 - l);
  return "#" + rgb.map((c) => Math.round(c + (255 - c) * t).toString(16).padStart(2, "0")).join("");
}
function rarityStyle(key) {
  const r = rarities.get(key);
  if (!r) return {};
  const pal = r.palette.map(lift);
  const stops = [...pal, pal[0]];
  if (!r.period) return { backgroundImage: `linear-gradient(90deg, ${stops.join(", ")})` };
  return {
    backgroundImage: `linear-gradient(90deg, ${[...stops, ...pal.slice(1), pal[0]].join(", ")})`,
    backgroundSize: "200% 100%",
    animation: `shimmer ${(r.period / 20).toFixed(2)}s linear infinite`
  };
}
const _sfc_main$x = {
  __name: "Paint",
  props: { rarity: { type: String, required: true } },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("span", {
        class: "paint",
        style: normalizeStyle(unref(rarityStyle)(__props.rarity))
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 4);
    };
  }
};
const _hoisted_1$t = { class: "tip" };
const _hoisted_2$q = ["innerHTML"];
const _hoisted_3$o = { class: "tlore" };
const _hoisted_4$m = {
  key: 0,
  class: "gap"
};
const _hoisted_5$l = ["innerHTML"];
const _hoisted_6$l = {
  key: 0,
  class: "tstats"
};
const _hoisted_7$l = { key: 0 };
const _hoisted_8$k = { class: "trar" };
const _sfc_main$w = {
  __name: "ItemTooltip",
  props: { item: { type: Object, required: true } },
  setup(__props) {
    const props = __props;
    const stats = computed(() => props.item.stats.split(/(\d+(?:\.\d+)?)/));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$t, [
        createBaseVNode("div", {
          class: "tname paint",
          style: normalizeStyle(unref(rarityStyle)(__props.item.rarity)),
          innerHTML: __props.item.name
        }, null, 12, _hoisted_2$q),
        createBaseVNode("div", _hoisted_3$o, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(__props.item.lore, (line, i) => {
            return openBlock(), createElementBlock(Fragment, { key: i }, [
              line === "" ? (openBlock(), createElementBlock("div", _hoisted_4$m)) : (openBlock(), createElementBlock("div", {
                key: 1,
                innerHTML: line
              }, null, 8, _hoisted_5$l))
            ], 64);
          }), 128))
        ]),
        __props.item.stats ? (openBlock(), createElementBlock("div", _hoisted_6$l, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(stats.value, (part, i) => {
            return openBlock(), createElementBlock(Fragment, { key: i }, [
              i % 2 ? (openBlock(), createElementBlock("b", _hoisted_7$l, toDisplayString(part), 1)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                createTextVNode(toDisplayString(part), 1)
              ], 64))
            ], 64);
          }), 128))
        ])) : createCommentVNode("", true),
        createBaseVNode("div", _hoisted_8$k, [
          _cache[0] || (_cache[0] = createTextVNode("Редкость: ", -1)),
          createVNode(_sfc_main$x, {
            rarity: __props.item.rarity
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(__props.item.rarityLabel), 1)
            ]),
            _: 1
          }, 8, ["rarity"])
        ])
      ]);
    };
  }
};
const scriptRel = /* @__PURE__ */ (function detectScriptRel() {
  const relList = typeof document !== "undefined" && document.createElement("link").relList;
  return relList && relList.supports && relList.supports("modulepreload") ? "modulepreload" : "preload";
})();
const assetsURL = function(dep, importerUrl) {
  return new URL(dep, importerUrl).href;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (deps && deps.length > 0) {
    let allSettled2 = function(promises) {
      return Promise.all(
        promises.map(
          (p) => Promise.resolve(p).then(
            (value) => ({ status: "fulfilled", value }),
            (reason) => ({ status: "rejected", reason })
          )
        )
      );
    };
    const links = document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector(
      "meta[property=csp-nonce]"
    );
    const cspNonce = (cspNonceMeta == null ? void 0 : cspNonceMeta.nonce) || (cspNonceMeta == null ? void 0 : cspNonceMeta.getAttribute("nonce"));
    promise = allSettled2(
      deps.map((dep) => {
        dep = assetsURL(dep, importerUrl);
        if (dep in seen) return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        const isBaseRelative = !!importerUrl;
        if (isBaseRelative) {
          for (let i = links.length - 1; i >= 0; i--) {
            const link2 = links[i];
            if (link2.href === dep && (!isCss || link2.rel === "stylesheet")) {
              return;
            }
          }
        } else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
          return;
        }
        const link = document.createElement("link");
        link.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) {
          link.as = "script";
        }
        link.crossOrigin = "";
        link.href = dep;
        if (cspNonce) {
          link.setAttribute("nonce", cspNonce);
        }
        document.head.appendChild(link);
        if (isCss) {
          return new Promise((res, rej) => {
            link.addEventListener("load", res);
            link.addEventListener(
              "error",
              () => rej(new Error(`Unable to preload CSS for ${dep}`))
            );
          });
        }
      })
    );
  }
  function handlePreloadError(err) {
    const e = new Event("vite:preloadError", {
      cancelable: true
    });
    e.payload = err;
    window.dispatchEvent(e);
    if (!e.defaultPrevented) {
      throw err;
    }
  }
  return promise.then((res) => {
    for (const item2 of res || []) {
      if (item2.status !== "rejected") continue;
      handlePreloadError(item2.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};
const RUNES = [
  ["#...#", "##.##", "#.#.#", "#...#", "#...#", "#...#", "#...#"],
  [".###.", "#...#", "....#", "..##.", "....#", "#...#", ".###."],
  ["#####", "..#..", "..#..", ".###.", "..#..", "..#..", "#####"],
  ["#....", "#....", "#.##.", "##..#", "#...#", "#...#", "#...#"],
  ["..#..", ".#.#.", "#...#", ".#.#.", "..#..", "..#..", "..#.."],
  ["#.#.#", "#.#.#", "#.#.#", ".###.", "..#..", "..#..", "..#.."],
  ["####.", "#...#", "#...#", "####.", "#.#..", "#..#.", "#...#"],
  [".....", "#...#", ".#.#.", "..#..", ".#.#.", "#...#", "....."],
  ["..#..", "..#..", "#####", "..#..", ".#.#.", "#...#", "#...#"],
  ["#...#", "#...#", ".###.", "..#..", ".###.", "#...#", "#...#"],
  ["##...", "#.#..", "#..#.", "#...#", "#..#.", "#.#..", "##..."],
  [".###.", "#....", "#....", ".###.", "....#", "....#", ".###."]
];
const cells = (rune) => rune.flatMap((row, y) => [...row].map((c, x) => c === "#" ? [x, y] : null).filter(Boolean));
const _hoisted_1$s = ["aria-label"];
const _hoisted_2$p = {
  class: "mstage-circle",
  viewBox: "-130 -130 260 260",
  "aria-hidden": "true"
};
const _hoisted_3$n = { class: "mstage-spin" };
const _hoisted_4$l = ["y2", "transform"];
const _hoisted_5$k = ["transform"];
const _hoisted_6$k = ["x", "y"];
const _hoisted_7$k = ["src"];
const _hoisted_8$j = {
  key: 1,
  class: "mstage-hint",
  "aria-hidden": "true"
};
const _sfc_main$v = {
  __name: "ModelStage",
  props: {
    item: { type: Object, required: true },
    /** hero, panel or card: how big the stage is. */
    size: { type: String, default: "panel" }
  },
  setup(__props) {
    const props = __props;
    const palettes = Object.fromEntries(data.rarities.map((r) => [r.const, r.palette]));
    const light = (hex) => {
      const n = parseInt(hex.slice(1), 16);
      return 0.299 * (n >> 16) + 0.587 * (n >> 8 & 255) + 0.114 * (n & 255);
    };
    const aura = computed(() => {
      const pal = [...palettes[props.item.rarity] || ["#8a5cff", "#6fe4dc"]].sort((a, b) => light(b) - light(a));
      return { "--h1": pal[0], "--h2": pal[Math.min(1, pal.length - 1)], "--h3": pal[Math.min(1, pal.length - 1)] };
    });
    const RUNE_CELLS = RUNES.map(cells);
    const circleRunes = RUNE_CELLS.map((c, i) => ({ angle: i * 30, cells: c }));
    const ticks = Array.from({ length: 72 }, (_, i) => i * 5);
    const host = ref(null);
    const canvas = ref(null);
    const flat = ref(true);
    const reduced = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lib = null, renderer, scene, camera, holder, model, raf = 0, seen2, sizer;
    let soft = null, softCtx = null, quads = null, softGrow = 1, asked = 0;
    const softCanvas = ref(null);
    const mode = ref("flat");
    let yaw = -0.42, swing = 0, dragging = false, lastX = 0, idle = 999, start = 0, onScreen = false;
    function canGL() {
      try {
        const c = document.createElement("canvas");
        return !!(c.getContext("webgl2") || c.getContext("webgl"));
      } catch (e) {
        return false;
      }
    }
    function place() {
      if (mode.value === "soft") {
        placeSoft();
        return;
      }
      if (!lib) return;
      const { build, dispose } = lib;
      if (model) {
        holder.remove(model);
        dispose(model);
      }
      model = build(props.item.id);
      flat.value = !model;
      if (model) {
        holder.add(model);
        model.scale.setScalar(0.6);
        model.userData.grow = 0;
      }
    }
    function frame(now) {
      raf = requestAnimationFrame(frame);
      if (!start) start = now;
      const t = (now - start) / 1e3;
      if (!dragging) {
        swing *= 0.93;
        yaw += swing;
        idle++;
        if (!reduced && idle > 90) yaw += 6e-3;
      }
      if (mode.value === "soft" && quads) {
        if (softGrow < 1) softGrow = Math.min(1, softGrow + 0.08);
        const c = softCanvas.value;
        softCtx.setTransform(1, 0, 0, 1, 0, 0);
        draw(c.width, c.height, t);
      } else if (lib && model) {
        holder.rotation.y = yaw;
        holder.position.y = reduced ? 0 : Math.sin(t * 2) * 0.06;
        if (model.userData.grow < 1) {
          model.userData.grow = Math.min(1, model.userData.grow + 0.08);
          const g = model.userData.grow;
          model.scale.setScalar(0.6 + 0.4 * (1 - (1 - g) ** 3));
        }
        lib.animate(Math.floor(t * 20));
        renderer.render(scene, camera);
      }
    }
    function draw(w, h, t) {
      const g = 1 - (1 - softGrow) ** 3;
      soft.draw(softCtx, w, h, quads, yaw, reduced ? 0 : Math.sin(t * 2) * 0.06, 0.6 + 0.4 * g);
    }
    async function placeSoft() {
      const id = props.item.id, ask = ++asked;
      const built = await soft.build(id);
      if (ask !== asked) return;
      quads = built;
      softGrow = 0;
      flat.value = !quads;
    }
    async function setupSoft() {
      soft = await __vitePreload(() => import("./soft3d.js"), true ? __vite__mapDeps([0,1]) : void 0, import.meta.url);
      mode.value = "soft";
      softCtx = softCanvas.value.getContext("2d");
      resize();
      await placeSoft();
    }
    function run() {
      cancelAnimationFrame(raf);
      if (onScreen && !document.hidden) raf = requestAnimationFrame(frame);
    }
    function down(e) {
      var _a, _b;
      dragging = true;
      lastX = e.clientX;
      idle = 0;
      (_b = (_a = host.value).setPointerCapture) == null ? void 0 : _b.call(_a, e.pointerId);
    }
    function move(e) {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      swing = dx * 0.011;
      yaw += swing;
    }
    function up() {
      dragging = false;
      idle = 0;
    }
    function key(e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        e.stopPropagation();
        swing = -0.09;
        idle = 0;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        e.stopPropagation();
        swing = 0.09;
        idle = 0;
      }
    }
    async function setup() {
      lib = await __vitePreload(() => import("./model3d.js"), true ? __vite__mapDeps([2,3,1]) : void 0, import.meta.url);
      const { THREE } = lib;
      renderer = new THREE.WebGLRenderer({ canvas: canvas.value, alpha: true, antialias: true });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
      camera.position.set(0, 0.35, 7.2);
      camera.lookAt(0, 0.1, 0);
      scene.add(new THREE.AmbientLight(16777215, 1.9));
      const sun = new THREE.DirectionalLight(16777215, 1.5);
      sun.position.set(2, 3, 4);
      scene.add(sun);
      const back = new THREE.DirectionalLight(16777215, 0.9);
      back.position.set(-2, 1, -4);
      scene.add(back);
      holder = new THREE.Group();
      holder.position.y = 0;
      scene.add(holder);
      mode.value = "gl";
      resize();
      place();
    }
    function resize() {
      if (mode.value === "soft" && softCanvas.value) {
        const c = softCanvas.value, dpr = Math.min(window.devicePixelRatio || 1, 2);
        c.width = Math.round(c.clientWidth * dpr);
        c.height = Math.round(c.clientHeight * dpr);
        return;
      }
      if (!renderer || !host.value) return;
      const w = canvas.value.clientWidth, h = canvas.value.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    watch(() => props.item.id, () => {
      if (lib || soft) place();
      idle = 0;
    });
    onMounted(async () => {
      seen2 = new IntersectionObserver(([e]) => {
        onScreen = e.isIntersecting;
        run();
      });
      seen2.observe(host.value);
      document.addEventListener("visibilitychange", run);
      if (data.models) {
        let gl = false;
        if (canGL()) {
          try {
            await setup();
            gl = true;
          } catch (e) {
            renderer == null ? void 0 : renderer.dispose();
            renderer = null;
            lib = null;
          }
        }
        if (!gl) await setupSoft();
      }
      sizer = new ResizeObserver(resize);
      sizer.observe(host.value);
      run();
    });
    onBeforeUnmount(() => {
      cancelAnimationFrame(raf);
      seen2 == null ? void 0 : seen2.disconnect();
      sizer == null ? void 0 : sizer.disconnect();
      document.removeEventListener("visibilitychange", run);
      if (lib && model) lib.dispose(model);
      renderer == null ? void 0 : renderer.dispose();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "host",
        ref: host,
        class: normalizeClass(["mstage", [`ms-${__props.size}`, { flat: flat.value }]]),
        style: normalizeStyle(aura.value),
        tabindex: "0",
        role: "img",
        "aria-label": `${__props.item.name}: модель, поворачивается перетаскиванием или стрелками`,
        onPointerdown: down,
        onPointermove: move,
        onPointerup: up,
        onPointercancel: up,
        onKeydown: key
      }, [
        _cache[6] || (_cache[6] = createBaseVNode("span", {
          class: "mstage-beam",
          "aria-hidden": "true"
        }, null, -1)),
        (openBlock(), createElementBlock("svg", _hoisted_2$p, [
          createBaseVNode("g", _hoisted_3$n, [
            _cache[0] || (_cache[0] = createBaseVNode("circle", {
              r: "124",
              class: "mc-ring"
            }, null, -1)),
            _cache[1] || (_cache[1] = createBaseVNode("circle", {
              r: "116",
              class: "mc-ring thin"
            }, null, -1)),
            _cache[2] || (_cache[2] = createBaseVNode("circle", {
              r: "90",
              class: "mc-ring"
            }, null, -1)),
            _cache[3] || (_cache[3] = createBaseVNode("circle", {
              r: "62",
              class: "mc-ring thin dashed"
            }, null, -1)),
            (openBlock(true), createElementBlock(Fragment, null, renderList(unref(ticks), (t) => {
              return openBlock(), createElementBlock("line", {
                key: t,
                class: "mc-tick",
                x1: "0",
                y1: "-124",
                x2: "0",
                y2: t % 30 === 0 ? -130 : -127,
                transform: `rotate(${t})`
              }, null, 8, _hoisted_4$l);
            }), 128)),
            (openBlock(true), createElementBlock(Fragment, null, renderList(unref(circleRunes), (r) => {
              return openBlock(), createElementBlock("g", {
                key: r.angle,
                transform: `rotate(${r.angle}) translate(0 -103)`
              }, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(r.cells, ([x, y], k) => {
                  return openBlock(), createElementBlock("rect", {
                    key: k,
                    class: "mc-rune",
                    x: x * 3 - 7.5,
                    y: y * 3 - 10.5,
                    width: "3",
                    height: "3"
                  }, null, 8, _hoisted_6$k);
                }), 128))
              ], 8, _hoisted_5$k);
            }), 128)),
            _cache[4] || (_cache[4] = createBaseVNode("path", {
              class: "mc-star",
              d: "M0 -88 L22 -22 L88 0 L22 22 L0 88 L-22 22 L-88 0 L-22 -22 Z"
            }, null, -1))
          ])
        ])),
        withDirectives(createBaseVNode("canvas", {
          ref_key: "canvas",
          ref: canvas,
          class: "mstage-gl"
        }, null, 512), [
          [vShow, !flat.value && mode.value === "gl"]
        ]),
        withDirectives(createBaseVNode("canvas", {
          ref_key: "softCanvas",
          ref: softCanvas,
          class: "mstage-gl"
        }, null, 512), [
          [vShow, !flat.value && mode.value === "soft"]
        ]),
        flat.value ? (openBlock(), createElementBlock("span", {
          key: __props.item.id,
          class: "mstage-flat"
        }, [
          createBaseVNode("img", {
            src: __props.item.icon,
            alt: ""
          }, null, 8, _hoisted_7$k)
        ])) : createCommentVNode("", true),
        !flat.value ? (openBlock(), createElementBlock("span", _hoisted_8$j, [..._cache[5] || (_cache[5] = [
          createBaseVNode("svg", { viewBox: "0 0 16 16" }, [
            createBaseVNode("path", {
              d: "M5 5L2 8l3 3M11 5l3 3-3 3M2 8h12",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "1.4"
            })
          ], -1),
          createTextVNode("Тяните, чтобы повернуть", -1)
        ])])) : createCommentVNode("", true)
      ], 46, _hoisted_1$s);
    };
  }
};
const _hoisted_1$r = { class: "hero-text" };
const _hoisted_2$o = { class: "facts" };
const _hoisted_3$m = { href: "#catalog" };
const _hoisted_4$k = { href: "#catalog" };
const _hoisted_5$j = { href: "#blood" };
const _hoisted_6$j = { href: "#trophies" };
const _hoisted_7$j = { class: "stage" };
const _hoisted_8$i = { class: "hero-model" };
const _hoisted_9$h = {
  class: "stage-tip",
  "aria-live": "polite"
};
const _hoisted_10$e = { class: "hotbar-wrap" };
const _hoisted_11$d = ["aria-label", "aria-pressed", "onClick"];
const _hoisted_12$c = ["src"];
const _hoisted_13$a = {
  class: "hkey",
  "aria-hidden": "true"
};
const SIZE = 320;
const _sfc_main$u = {
  __name: "HeroBanner",
  setup(__props) {
    const slots = data.hotbar.map(item);
    const selected = ref(0);
    const held = computed(() => slots[selected.value]);
    const palettes = Object.fromEntries(data.rarities.map((r) => [r.const, r.palette]));
    const light = (hex) => {
      const n = parseInt(hex.slice(1), 16);
      return 0.299 * (n >> 16) + 0.587 * (n >> 8 & 255) + 0.114 * (n & 255);
    };
    const aura = computed(() => {
      const pal = [...palettes[held.value.rarity] || ["#8a5cff", "#6fe4dc"]].sort((a, b) => light(b) - light(a));
      return { "--h1": pal[0], "--h2": pal[Math.min(1, pal.length - 1)], "--h3": pal[Math.min(1, pal.length - 1)] };
    });
    const RUNE_CELLS = RUNES.map(cells);
    function onKey(e) {
      if (e.target.matches("input, textarea") || e.ctrlKey || e.metaKey || e.altKey) return;
      const n = Number(e.key);
      if (n >= 1 && n <= slots.length) selected.value = n - 1;
    }
    function onWheel(e) {
      e.preventDefault();
      selected.value = (selected.value + (e.deltaY > 0 ? 1 : -1) + slots.length) % slots.length;
    }
    const pick = (i) => {
      if (selected.value === i) openItem(slots[i].id);
      else selected.value = i;
    };
    const sparks = ref(null);
    let raf = 0, ctx, motes = [], colours = ["#8a5cff", "#6fe4dc"];
    function spawn(burst) {
      const a = Math.random() * Math.PI * 2;
      const r = burst ? 40 + Math.random() * 30 : 120 + Math.random() * 40;
      return {
        a,
        r,
        speed: burst ? -1.6 - Math.random() : 0.45 + Math.random() * 0.5,
        spin: (Math.random() - 0.5) * 0.012,
        rune: Math.random() < 0.55 ? RUNE_CELLS[Math.floor(Math.random() * RUNE_CELLS.length)] : null,
        tone: Math.random() < 0.5 ? 0 : 1,
        life: 0,
        burst
      };
    }
    function frame() {
      raf = requestAnimationFrame(frame);
      ctx.clearRect(0, 0, SIZE, SIZE);
      const c = SIZE / 2;
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        m.life++;
        m.r -= m.speed;
        m.a += m.spin + (m.burst ? 0 : 4e-3);
        const done = m.burst ? m.r > 150 || m.life > 70 : m.r < 18;
        if (done) {
          if (m.burst) {
            motes.splice(i, 1);
            i--;
          } else motes[i] = spawn(false);
          continue;
        }
        const x = c + Math.cos(m.a) * m.r, y = c + Math.sin(m.a) * m.r * 0.92;
        const alpha = m.burst ? Math.max(0, 1 - m.life / 70) : Math.min(1, m.life / 40) * Math.min(1, (m.r - 18) / 50);
        ctx.globalAlpha = alpha * 0.85;
        ctx.fillStyle = colours[m.tone];
        if (m.rune) for (const [cx, cy] of m.rune) ctx.fillRect(Math.round(x + cx * 1.5 - 4), Math.round(y + cy * 1.5 - 5), 1.5, 1.5);
        else {
          ctx.beginPath();
          ctx.arc(x, y, 1.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }
    watch(held, () => {
      colours = [aura.value["--h1"], aura.value["--h3"]];
      if (ctx) for (let i = 0; i < 18; i++) motes.push(spawn(true));
    });
    let seen2;
    const hero = ref(null);
    onMounted(() => {
      document.addEventListener("keydown", onKey);
      colours = [aura.value["--h1"], aura.value["--h3"]];
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const canvas = sparks.value;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = SIZE * dpr;
      canvas.height = SIZE * dpr;
      ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      motes = Array.from({ length: 34 }, () => {
        const m = spawn(false);
        m.r = 20 + Math.random() * 140;
        return m;
      });
      seen2 = new IntersectionObserver(([e]) => {
        cancelAnimationFrame(raf);
        if (e.isIntersecting && !document.hidden) raf = requestAnimationFrame(frame);
      });
      seen2.observe(hero.value);
    });
    onBeforeUnmount(() => {
      document.removeEventListener("keydown", onKey);
      cancelAnimationFrame(raf);
      seen2 == null ? void 0 : seen2.disconnect();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("header", {
        id: "top",
        ref_key: "hero",
        ref: hero,
        class: "hero",
        style: normalizeStyle(aura.value)
      }, [
        createBaseVNode("div", _hoisted_1$r, [
          _cache[3] || (_cache[3] = createBaseVNode("p", { class: "hero-kicker" }, "Вики плагина VirusSwords для Paper 1.21.11", -1)),
          _cache[4] || (_cache[4] = createBaseVNode("h1", null, [
            createBaseVNode("span", { class: "h1-line" }, "Кодекс"),
            createTextVNode(),
            createBaseVNode("span", { class: "h1-line" }, "VirusSwords")
          ], -1)),
          _cache[5] || (_cache[5] = createBaseVNode("p", { class: "lead" }, "Клинки находят в мире, куют из душ и доводят до последней формы у алтарей святилищ. Здесь — что умеет каждый клинок, откуда он берётся, как растёт и кто стережёт святилища.", -1)),
          createBaseVNode("ul", _hoisted_2$o, [
            createBaseVNode("li", null, [
              createBaseVNode("a", _hoisted_3$m, [
                createBaseVNode("b", null, toDisplayString(unref(data).counts.weapons), 1),
                createTextVNode(toDisplayString(unref(data).words.weapons), 1)
              ])
            ]),
            createBaseVNode("li", null, [
              createBaseVNode("a", _hoisted_4$k, [
                createBaseVNode("b", null, toDisplayString(unref(data).counts.materials), 1),
                createTextVNode(toDisplayString(unref(data).words.materials), 1)
              ])
            ]),
            _cache[2] || (_cache[2] = createBaseVNode("li", null, [
              createBaseVNode("a", { href: "#sanctums" }, [
                createBaseVNode("b", null, "5"),
                createTextVNode("святилищ")
              ])
            ], -1)),
            createBaseVNode("li", null, [
              createBaseVNode("a", _hoisted_5$j, [
                createBaseVNode("b", null, toDisplayString(unref(data).blood.length), 1),
                _cache[1] || (_cache[1] = createTextVNode("родословных", -1))
              ])
            ]),
            createBaseVNode("li", null, [
              createBaseVNode("a", _hoisted_6$j, [
                createBaseVNode("b", null, toDisplayString(unref(data).counts.trophies), 1),
                createTextVNode(toDisplayString(unref(data).words.trophies), 1)
              ])
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_7$j, [
          createBaseVNode("div", _hoisted_8$i, [
            createVNode(_sfc_main$v, {
              item: held.value,
              size: "hero"
            }, null, 8, ["item"]),
            createBaseVNode("canvas", {
              ref_key: "sparks",
              ref: sparks,
              class: "sparks",
              "aria-hidden": "true"
            }, null, 512)
          ]),
          createBaseVNode("div", _hoisted_9$h, [
            createVNode(_sfc_main$w, { item: held.value }, null, 8, ["item"]),
            createBaseVNode("button", {
              type: "button",
              class: "text-btn",
              onClick: _cache[0] || (_cache[0] = ($event) => unref(openItem)(held.value.id))
            }, "Открыть карточку клинка")
          ])
        ]),
        createBaseVNode("div", _hoisted_10$e, [
          createBaseVNode("div", {
            class: "hotbar",
            role: "toolbar",
            "aria-label": "Хотбар: старшие клинки",
            onWheel
          }, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(unref(slots), (slot, i) => {
              return openBlock(), createElementBlock("button", {
                key: slot.id,
                type: "button",
                class: normalizeClass(["hslot", { sel: i === selected.value }]),
                "aria-label": slot.name,
                "aria-pressed": String(i === selected.value),
                onClick: ($event) => pick(i)
              }, [
                createBaseVNode("img", {
                  src: slot.icon,
                  alt: ""
                }, null, 8, _hoisted_12$c),
                createBaseVNode("span", _hoisted_13$a, toDisplayString(i + 1), 1)
              ], 10, _hoisted_11$d);
            }), 128))
          ], 32),
          _cache[6] || (_cache[6] = createBaseVNode("p", { class: "hotbar-note" }, "Клавиши 1–9 или колесо мыши выбирают клинок, повторный клик открывает его карточку.", -1))
        ])
      ], 4);
    };
  }
};
const _hoisted_1$q = ["aria-label"];
const _hoisted_2$n = { class: "craft-table" };
const _hoisted_3$l = { class: "craft-grid" };
const _hoisted_4$j = ["href", "title"];
const _hoisted_5$i = ["src", "alt"];
const _hoisted_6$i = ["title"];
const _hoisted_7$i = ["src", "alt"];
const _hoisted_8$h = {
  key: 2,
  class: "cslot"
};
const _hoisted_9$g = ["title"];
const _hoisted_10$d = ["src", "alt"];
const _hoisted_11$c = { key: 0 };
const _hoisted_12$b = ["href"];
const _hoisted_13$9 = {
  key: 0,
  class: "note"
};
const _sfc_main$t = {
  __name: "CraftGrid",
  props: {
    recipe: { type: Object, required: true },
    small: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const resolve = (key) => {
      if (!key) return null;
      if (key.startsWith("v:")) return { icon: data.guideIcons[key.slice(2)], name: data.vanillaNames[key.slice(2)] };
      if (key.startsWith("g:")) return { icon: data.guideIcons[key.slice(2)], name: data.guideNames[key.slice(2)], href: "#sanctums" };
      const it = item(key);
      return it ? { icon: it.icon, name: it.name, href: `#w-${key}`, ours: true } : null;
    };
    const cells2 = computed(() => props.recipe.grid.map(resolve));
    const result = computed(() => resolve(props.recipe.result));
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e, _f;
      return openBlock(), createElementBlock("figure", {
        class: normalizeClass(["craft", { small: __props.small }]),
        "aria-label": `Рецепт: ${(_a = result.value) == null ? void 0 : _a.name}`
      }, [
        createBaseVNode("div", _hoisted_2$n, [
          createBaseVNode("div", _hoisted_3$l, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(cells2.value, (c, i) => {
              return openBlock(), createElementBlock(Fragment, { key: i }, [
                c && c.href ? (openBlock(), createElementBlock("a", {
                  key: 0,
                  class: normalizeClass(["cslot", { ours: c.ours }]),
                  href: c.href,
                  title: c.name
                }, [
                  createBaseVNode("img", {
                    src: c.icon,
                    alt: c.name
                  }, null, 8, _hoisted_5$i)
                ], 10, _hoisted_4$j)) : c ? (openBlock(), createElementBlock("span", {
                  key: 1,
                  class: "cslot",
                  title: c.name
                }, [
                  createBaseVNode("img", {
                    src: c.icon,
                    alt: c.name
                  }, null, 8, _hoisted_7$i)
                ], 8, _hoisted_6$i)) : (openBlock(), createElementBlock("span", _hoisted_8$h))
              ], 64);
            }), 128))
          ]),
          _cache[0] || (_cache[0] = createBaseVNode("span", {
            class: "craft-arrow",
            "aria-hidden": "true"
          }, null, -1)),
          createBaseVNode("span", {
            class: "cslot out",
            title: (_b = result.value) == null ? void 0 : _b.name
          }, [
            createBaseVNode("img", {
              src: (_c = result.value) == null ? void 0 : _c.icon,
              alt: (_d = result.value) == null ? void 0 : _d.name
            }, null, 8, _hoisted_10$d)
          ], 8, _hoisted_9$g)
        ]),
        !__props.small ? (openBlock(), createElementBlock("figcaption", _hoisted_11$c, [
          createBaseVNode("b", null, [
            ((_e = result.value) == null ? void 0 : _e.ours) ? (openBlock(), createElementBlock("a", {
              key: 0,
              href: result.value.href
            }, toDisplayString(result.value.name), 9, _hoisted_12$b)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
              createTextVNode(toDisplayString((_f = result.value) == null ? void 0 : _f.name), 1)
            ], 64))
          ]),
          __props.recipe.note ? (openBlock(), createElementBlock("span", _hoisted_13$9, toDisplayString(__props.recipe.note), 1)) : createCommentVNode("", true)
        ])) : createCommentVNode("", true)
      ], 10, _hoisted_1$q);
    };
  }
};
const _hoisted_1$p = { class: "abilities" };
const _hoisted_2$m = { class: "chips" };
const _hoisted_3$k = {
  key: 0,
  class: "chip"
};
const _hoisted_4$i = {
  viewBox: "0 0 16 16",
  "aria-hidden": "true"
};
const _hoisted_5$h = {
  key: 0,
  x: "3.5",
  y: "1.5",
  width: "9",
  height: "13",
  rx: "4.5",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.4"
};
const _hoisted_6$h = ["d", "fill", "stroke-width"];
const _hoisted_7$h = {
  key: 1,
  class: "chip rest"
};
const _hoisted_8$g = ["innerHTML"];
const _sfc_main$s = {
  __name: "AbilityCards",
  props: { abilities: { type: Array, required: true } },
  setup(__props) {
    const ICONS = {
      rmb: "M8 1.5v5h4.5V6A4.5 4.5 0 0 0 8 1.5z",
      hold: "M8 1.5v5h4.5V6A4.5 4.5 0 0 0 8 1.5zM.8 10h2.2M13 10h2.2",
      passive: "M8 2.2l1.7 3.6 3.9.5-2.9 2.7.7 3.9L8 11l-3.4 1.9.7-3.9L2.4 6.3l3.9-.5z",
      hit: "M3 13L13 3M9.5 3H13v3.5M2.5 9.5l4 4",
      other: "M8 2.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zM8 5.2v3.3M8 10.6v.3"
    };
    const mouse = (kind) => kind === "rmb" || kind === "hold";
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$p, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(__props.abilities, (a) => {
          return openBlock(), createElementBlock("article", {
            key: a.name,
            class: "ability",
            style: normalizeStyle({ "--c": a.colour })
          }, [
            createBaseVNode("header", null, [
              createBaseVNode("h4", null, toDisplayString(a.name), 1),
              createBaseVNode("div", _hoisted_2$m, [
                a.trigger ? (openBlock(), createElementBlock("span", _hoisted_3$k, [
                  (openBlock(), createElementBlock("svg", _hoisted_4$i, [
                    mouse(a.kind) ? (openBlock(), createElementBlock("rect", _hoisted_5$h)) : createCommentVNode("", true),
                    createBaseVNode("path", {
                      d: ICONS[a.kind],
                      fill: a.kind === "hit" || a.kind === "other" ? "none" : "currentColor",
                      stroke: "currentColor",
                      "stroke-width": a.kind === "hit" || a.kind === "other" || a.kind === "hold" ? 1.4 : 0,
                      "stroke-linecap": "round"
                    }, null, 8, _hoisted_6$h)
                  ])),
                  createTextVNode(toDisplayString(a.trigger), 1)
                ])) : createCommentVNode("", true),
                a.rest ? (openBlock(), createElementBlock("span", _hoisted_7$h, [
                  _cache[0] || (_cache[0] = createBaseVNode("svg", {
                    viewBox: "0 0 16 16",
                    "aria-hidden": "true"
                  }, [
                    createBaseVNode("circle", {
                      cx: "8",
                      cy: "8",
                      r: "6.2",
                      fill: "none",
                      stroke: "currentColor",
                      "stroke-width": "1.4"
                    }),
                    createBaseVNode("path", {
                      d: "M8 4.5V8l2.4 1.6",
                      fill: "none",
                      stroke: "currentColor",
                      "stroke-width": "1.4",
                      "stroke-linecap": "round"
                    })
                  ], -1)),
                  createTextVNode(toDisplayString(a.rest), 1)
                ])) : createCommentVNode("", true)
              ])
            ]),
            a.text ? (openBlock(), createElementBlock("p", {
              key: 0,
              innerHTML: a.text
            }, null, 8, _hoisted_8$g)) : createCommentVNode("", true)
          ], 4);
        }), 128))
      ]);
    };
  }
};
const _hoisted_1$o = ["id", "href", "title", "aria-label"];
const _hoisted_2$l = { class: "islot-cell" };
const _hoisted_3$j = ["src"];
const _hoisted_4$h = {
  key: 0,
  class: "islot-name"
};
const _sfc_main$r = {
  __name: "ItemSlot",
  props: {
    item: { type: Object, required: true },
    /** The one tile per item that a #w-<id> link scrolls to. */
    anchor: { type: Boolean, default: false },
    named: { type: Boolean, default: false },
    dim: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const RARITY = Object.fromEntries(data.rarities.map((r) => [r.const, r]));
    const rarity = computed(() => RARITY[props.item.rarity]);
    const glow = computed(() => {
      var _a;
      const pal = ((_a = rarity.value) == null ? void 0 : _a.palette) || ["#8a5cff"];
      return { "--r1": pal[0], "--r2": pal[pal.length - 1] };
    });
    return (_ctx, _cache) => {
      var _a;
      return openBlock(), createElementBlock("a", {
        id: __props.anchor ? `w-${__props.item.id}` : void 0,
        class: normalizeClass(["islot", { named: __props.named, dim: __props.dim, rare: !!((_a = rarity.value) == null ? void 0 : _a.period), open: unref(inspector).id === __props.item.id }]),
        href: `#w-${__props.item.id}`,
        style: normalizeStyle(glow.value),
        title: __props.named ? void 0 : __props.item.name,
        "aria-label": __props.item.name
      }, [
        createBaseVNode("span", _hoisted_2$l, [
          createBaseVNode("img", {
            src: __props.item.icon,
            alt: "",
            loading: "lazy"
          }, null, 8, _hoisted_3$j)
        ]),
        __props.named ? (openBlock(), createElementBlock("span", _hoisted_4$h, toDisplayString(__props.item.name), 1)) : createCommentVNode("", true)
      ], 14, _hoisted_1$o);
    };
  }
};
const _hoisted_1$n = ["aria-label"];
const _hoisted_2$k = {
  key: 0,
  class: "price-title"
};
const _hoisted_3$i = ["href"];
const _hoisted_4$g = { class: "price-head" };
const _hoisted_5$g = { class: "price-when" };
const _hoisted_6$g = {
  class: "price-row",
  "aria-hidden": "true"
};
const _hoisted_7$g = ["href", "title"];
const _hoisted_8$f = ["src"];
const _hoisted_9$f = ["src"];
const _hoisted_10$c = {
  key: 0,
  class: "pcount"
};
const _hoisted_11$b = ["title"];
const _hoisted_12$a = ["src"];
const _hoisted_13$8 = { class: "price-words" };
const _hoisted_14$8 = {
  key: 1,
  class: "price-owner"
};
const _sfc_main$q = {
  __name: "AltarPrice",
  props: {
    entry: { type: Object, required: true },
    /** Drawn as a card of its own, in a grid of prices, rather than inside an item's card. */
    boxed: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const thing = (key) => {
      var _a, _b;
      return key.startsWith("v:") ? { icon: data.guideIcons[key.slice(2)], name: data.vanillaNames[key.slice(2)] } : { icon: (_a = item(key)) == null ? void 0 : _a.icon, name: (_b = item(key)) == null ? void 0 : _b.name, href: `#w-${key}` };
    };
    const from = computed(() => props.entry.from && thing(props.entry.from));
    const costs = computed(() => props.entry.costs.map((c) => ({ ...thing(c.key), n: c.n })));
    const result = computed(() => thing(props.entry.result));
    const verb = computed(() => {
      var _a;
      return props.entry.kind === "evolve" ? "Эволюция" : ((_a = item(props.entry.result)) == null ? void 0 : _a.method) === "assemble" ? "Сборка" : "Ковка";
    });
    const when = computed(() => [
      props.entry.blood && `${props.entry.blood}${props.entry.form > 1 ? `, с ${props.entry.form}-й формы` : ""}`,
      props.entry.time
    ].filter(Boolean).join("; "));
    const owner = computed(() => {
      if (props.entry.blood) return "";
      for (const b of data.blood) {
        const w = b.weapons.find((w2) => w2.id === props.entry.result);
        if (w) return `${b.title}${w.form > 1 ? `, с ${w.form}-й формы` : ""}`;
      }
      return "";
    });
    const spoken = computed(() => [from.value && from.value.name, ...costs.value.map((c) => c.n > 1 ? `${c.n} × ${c.name}` : c.name)].filter(Boolean).join(", "));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("figure", {
        class: normalizeClass(["price", { boxed: __props.boxed }]),
        "aria-label": `${verb.value}: ${spoken.value} — ${result.value.name}`
      }, [
        __props.boxed ? (openBlock(), createElementBlock("figcaption", _hoisted_2$k, [
          createBaseVNode("a", {
            href: result.value.href
          }, toDisplayString(result.value.name), 9, _hoisted_3$i)
        ])) : createCommentVNode("", true),
        createBaseVNode("p", _hoisted_4$g, [
          createBaseVNode("b", null, toDisplayString(verb.value), 1),
          createTextVNode(" — " + toDisplayString(__props.entry.at), 1),
          when.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
            _cache[0] || (_cache[0] = createTextVNode(". ", -1)),
            createBaseVNode("span", _hoisted_5$g, toDisplayString(when.value), 1)
          ], 64)) : createCommentVNode("", true)
        ]),
        createBaseVNode("div", _hoisted_6$g, [
          from.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
            createBaseVNode("a", {
              class: "pslot",
              href: from.value.href,
              title: from.value.name,
              tabindex: "-1"
            }, [
              createBaseVNode("img", {
                src: from.value.icon,
                alt: ""
              }, null, 8, _hoisted_8$f)
            ], 8, _hoisted_7$g),
            _cache[1] || (_cache[1] = createBaseVNode("span", { class: "price-plus" }, "+", -1))
          ], 64)) : createCommentVNode("", true),
          (openBlock(true), createElementBlock(Fragment, null, renderList(costs.value, (c, i) => {
            return openBlock(), createBlock(resolveDynamicComponent(c.href ? "a" : "span"), {
              key: i,
              class: "pslot",
              href: c.href,
              title: c.n > 1 ? `${c.n} × ${c.name}` : c.name,
              tabindex: "-1"
            }, {
              default: withCtx(() => [
                createBaseVNode("img", {
                  src: c.icon,
                  alt: ""
                }, null, 8, _hoisted_9$f),
                c.n > 1 ? (openBlock(), createElementBlock("span", _hoisted_10$c, toDisplayString(c.n), 1)) : createCommentVNode("", true)
              ]),
              _: 2
            }, 1032, ["href", "title"]);
          }), 128)),
          _cache[2] || (_cache[2] = createBaseVNode("span", { class: "craft-arrow" }, null, -1)),
          createBaseVNode("span", {
            class: "pslot out",
            title: result.value.name
          }, [
            createBaseVNode("img", {
              src: result.value.icon,
              alt: ""
            }, null, 8, _hoisted_12$a)
          ], 8, _hoisted_11$b)
        ]),
        createBaseVNode("p", _hoisted_13$8, toDisplayString(spoken.value), 1),
        __props.boxed && owner.value ? (openBlock(), createElementBlock("p", _hoisted_14$8, "Признаёт: " + toDisplayString(owner.value), 1)) : createCommentVNode("", true)
      ], 10, _hoisted_1$n);
    };
  }
};
const _sfc_main$p = {
  __name: "BloodDot",
  props: { colour: { type: String, required: true } },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("span", {
        class: "dot",
        style: normalizeStyle({ background: __props.colour })
      }, null, 4);
    };
  }
};
const _hoisted_1$m = { class: "card-top" };
const _hoisted_2$j = {
  key: 0,
  class: "versus"
};
const _hoisted_3$h = { class: "versus-pic" };
const _hoisted_4$f = ["src"];
const _hoisted_5$f = { class: "versus-body" };
const _hoisted_6$f = { class: "versus-title" };
const _hoisted_7$f = { class: "versus-nums" };
const _hoisted_8$e = {
  key: 1,
  class: "statbars"
};
const _hoisted_9$e = { class: "statbar-label" };
const _hoisted_10$b = {
  class: "statbar-track",
  "aria-hidden": "true"
};
const _hoisted_11$a = { class: "statbar-value" };
const _hoisted_12$9 = {
  key: 2,
  class: "card-owner"
};
const _hoisted_13$7 = { class: "obtain" };
const _hoisted_14$7 = { class: "obtain-head" };
const _hoisted_15$7 = ["href"];
const _hoisted_16$6 = ["innerHTML"];
const _hoisted_17$6 = ["innerHTML"];
const _hoisted_18$5 = {
  key: 4,
  class: "card-chain"
};
const _hoisted_19$5 = { class: "chain-row" };
const _hoisted_20$5 = ["data-key"];
const _hoisted_21$5 = { class: "chain-row" };
const _hoisted_22$4 = {
  key: 0,
  class: "energy",
  "aria-hidden": "true"
};
const _hoisted_23$4 = {
  key: 1,
  class: "arrow",
  "aria-hidden": "true"
};
const _sfc_main$o = {
  __name: "ItemCard",
  props: { item: { type: Object, required: true } },
  setup(__props) {
    const props = __props;
    const recipe = computed(() => props.item.recipe ? data.recipes.find((r) => r.result === props.item.id) : null);
    const RARITY = Object.fromEntries(data.rarities.map((r) => [r.const, r]));
    const glow = computed(() => {
      var _a;
      const pal = ((_a = RARITY[props.item.rarity]) == null ? void 0 : _a.palette) || ["#8a5cff"];
      const light = (hex) => {
        const n = parseInt(hex.slice(1), 16);
        return 0.299 * (n >> 16) + 0.587 * (n >> 8 & 255) + 0.114 * (n & 255);
      };
      const bright = [...pal].sort((a, b) => light(b) - light(a));
      return { "--r1": bright[0], "--r2": bright[Math.min(1, bright.length - 1)] };
    });
    const blades = data.items.filter((i) => i.kind === "weapon");
    const MAX = { damage: Math.max(...blades.map((b) => b.damage)), speed: Math.max(...blades.map((b) => b.speed)) };
    const bars = computed(() => props.item.kind !== "weapon" ? [] : [
      { label: "Урон", value: props.item.damage, share: props.item.damage / MAX.damage },
      { label: "Скорость", value: props.item.speed, share: props.item.speed / MAX.speed }
    ]);
    const rival = computed(() => props.item.kind === "weapon" && compare.id && compare.id !== props.item.id ? item(compare.id) : null);
    const delta = (a, b) => {
      const d = Math.round((a - b) * 10) / 10;
      return d > 0 ? `+${d}` : `${d}`;
    };
    const sign = (a, b) => a > b ? "up" : a < b ? "down" : "same";
    const togglePin = () => {
      compare.id = compare.id === props.item.id ? null : props.item.id;
    };
    const owner = computed(() => {
      if (props.item.kind !== "weapon") return null;
      for (const b of data.blood) {
        const w = b.weapons.find((w2) => w2.id === props.item.id);
        if (w) return { title: b.title, colour: b.colour, form: w.form };
      }
      return { title: "", colour: "", form: 0 };
    });
    const altars = computed(() => data.altar.filter((a) => a.result === props.item.id));
    const usedIn = computed(() => {
      const id = props.item.id;
      const bench = data.recipes.filter((r) => r.result !== id && r.grid.includes(id)).map((r) => r.result);
      const altar = data.altar.filter((a) => a.result !== id && (a.from === id || a.costs.some((c) => c.key === id))).map((a) => a.result);
      return [.../* @__PURE__ */ new Set([...bench, ...altar])].map(item).filter(Boolean);
    });
    const chains = computed(() => data.chains.filter((c) => c.entries.some((e) => e.id === props.item.id)));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "card",
        style: normalizeStyle(glow.value)
      }, [
        createBaseVNode("div", _hoisted_1$m, [
          createVNode(_sfc_main$v, {
            item: __props.item,
            size: "card"
          }, null, 8, ["item"]),
          createVNode(_sfc_main$w, { item: __props.item }, null, 8, ["item"])
        ]),
        rival.value ? (openBlock(), createElementBlock("div", _hoisted_2$j, [
          createBaseVNode("span", _hoisted_3$h, [
            createBaseVNode("img", {
              src: rival.value.icon,
              alt: ""
            }, null, 8, _hoisted_4$f)
          ]),
          createBaseVNode("div", _hoisted_5$f, [
            createBaseVNode("p", _hoisted_6$f, [
              _cache[1] || (_cache[1] = createTextVNode("Против: ", -1)),
              createBaseVNode("b", null, toDisplayString(rival.value.name), 1)
            ]),
            createBaseVNode("p", _hoisted_7$f, [
              createBaseVNode("span", {
                class: normalizeClass(sign(__props.item.damage, rival.value.damage))
              }, "Урон " + toDisplayString(delta(__props.item.damage, rival.value.damage)), 3),
              createBaseVNode("span", {
                class: normalizeClass(sign(__props.item.speed, rival.value.speed))
              }, "Скорость " + toDisplayString(delta(__props.item.speed, rival.value.speed)), 3)
            ])
          ]),
          createBaseVNode("button", {
            type: "button",
            class: "text-btn",
            onClick: _cache[0] || (_cache[0] = ($event) => unref(compare).id = null)
          }, "Сбросить")
        ])) : createCommentVNode("", true),
        bars.value.length ? (openBlock(), createElementBlock("div", _hoisted_8$e, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(bars.value, (b) => {
            return openBlock(), createElementBlock("div", {
              key: b.label,
              class: "statbar"
            }, [
              createBaseVNode("span", _hoisted_9$e, toDisplayString(b.label), 1),
              createBaseVNode("span", _hoisted_10$b, [
                createBaseVNode("span", {
                  class: "statbar-fill",
                  style: normalizeStyle({ width: `${Math.round(b.share * 100)}%` })
                }, null, 4)
              ]),
              createBaseVNode("b", _hoisted_11$a, toDisplayString(b.value), 1)
            ]);
          }), 128)),
          createBaseVNode("button", {
            type: "button",
            class: "text-btn pin-btn",
            onClick: togglePin
          }, toDisplayString(unref(compare).id === __props.item.id ? "Убрать из сравнения" : "Сравнить с другими клинками"), 1)
        ])) : createCommentVNode("", true),
        owner.value ? (openBlock(), createElementBlock("p", _hoisted_12$9, [
          owner.value.title ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
            createVNode(_sfc_main$p, {
              colour: owner.value.colour
            }, null, 8, ["colour"]),
            _cache[2] || (_cache[2] = createTextVNode("Признаёт только: ", -1)),
            createBaseVNode("b", null, toDisplayString(owner.value.title), 1),
            owner.value.form > 1 ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
              createTextVNode(", с " + toDisplayString(owner.value.form) + "-й формы", 1)
            ], 64)) : createCommentVNode("", true)
          ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
            createTextVNode("Служит любой крови.")
          ], 64))
        ])) : createCommentVNode("", true),
        __props.item.abilities && __props.item.abilities.length ? (openBlock(), createBlock(_sfc_main$s, {
          key: 3,
          abilities: __props.item.abilities
        }, null, 8, ["abilities"])) : createCommentVNode("", true),
        createBaseVNode("div", _hoisted_13$7, [
          createBaseVNode("div", _hoisted_14$7, [
            _cache[3] || (_cache[3] = createBaseVNode("h3", null, "Как получить", -1)),
            createBaseVNode("a", {
              class: normalizeClass(["mbadge", `m-${__props.item.method}`]),
              href: recipe.value ? "#craft" : "#craft-other"
            }, toDisplayString(__props.item.methodLabel), 11, _hoisted_15$7)
          ]),
          recipe.value ? (openBlock(), createBlock(_sfc_main$t, {
            key: 0,
            recipe: recipe.value,
            small: ""
          }, null, 8, ["recipe"])) : createCommentVNode("", true),
          (openBlock(true), createElementBlock(Fragment, null, renderList(altars.value, (a, i) => {
            return openBlock(), createBlock(_sfc_main$q, {
              key: i,
              entry: a
            }, null, 8, ["entry"]);
          }), 128)),
          createBaseVNode("p", {
            class: normalizeClass(["obtain-text", { muted: altars.value.length }]),
            innerHTML: recipe.value ? recipe.value.note : __props.item.obtain
          }, null, 10, _hoisted_16$6),
          recipe.value && __props.item.obtain.includes(" или ") ? (openBlock(), createElementBlock("p", {
            key: 1,
            class: "obtain-text muted",
            innerHTML: __props.item.obtain
          }, null, 8, _hoisted_17$6)) : createCommentVNode("", true)
        ]),
        usedIn.value.length ? (openBlock(), createElementBlock("div", _hoisted_18$5, [
          _cache[4] || (_cache[4] = createBaseVNode("h3", null, "Нужен для", -1)),
          createBaseVNode("div", _hoisted_19$5, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(usedIn.value, (u) => {
              return openBlock(), createBlock(_sfc_main$r, {
                key: u.id,
                item: u
              }, null, 8, ["item"]);
            }), 128))
          ])
        ])) : createCommentVNode("", true),
        (openBlock(true), createElementBlock(Fragment, null, renderList(chains.value, (c) => {
          return openBlock(), createElementBlock("div", {
            key: c.key,
            class: "card-chain line-tint",
            "data-key": c.key
          }, [
            createBaseVNode("h3", null, toDisplayString(c.title), 1),
            createBaseVNode("div", _hoisted_21$5, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(c.entries, (e, i) => {
                return openBlock(), createElementBlock(Fragment, { key: i }, [
                  e.sep === "→" ? (openBlock(), createElementBlock("span", _hoisted_22$4)) : e.sep ? (openBlock(), createElementBlock("span", _hoisted_23$4, toDisplayString(e.sep), 1)) : createCommentVNode("", true),
                  createVNode(_sfc_main$r, {
                    item: unref(item)(e.id)
                  }, null, 8, ["item"])
                ], 64);
              }), 128))
            ])
          ], 8, _hoisted_20$5);
        }), 128))
      ], 4);
    };
  }
};
const _hoisted_1$l = {
  key: 0,
  class: "inspect-wrap"
};
const _hoisted_2$i = ["aria-label"];
const _hoisted_3$g = {
  class: "inspect-steps",
  "aria-label": "Соседние предметы"
};
const _hoisted_4$e = { class: "step-name" };
const _hoisted_5$e = ["src"];
const _hoisted_6$e = { class: "step-name" };
const _hoisted_7$e = ["src"];
const _hoisted_8$d = { class: "inspect-foot" };
const _hoisted_9$d = {
  class: "copied",
  "aria-live": "polite"
};
const _sfc_main$n = {
  __name: "Inspector",
  setup(__props) {
    const current = computed(() => inspector.id && item(inspector.id));
    const at = computed(() => order.indexOf(inspector.id));
    const prev = computed(() => at.value > 0 ? item(order[at.value - 1]) : null);
    const next = computed(() => at.value >= 0 && at.value < order.length - 1 ? item(order[at.value + 1]) : null);
    const panel = ref(null);
    const copied = ref("");
    async function copyLink() {
      const url = location.href.split("#")[0] + "#w-" + inspector.id;
      try {
        await navigator.clipboard.writeText(url);
        copied.value = "Ссылка скопирована";
      } catch (e) {
        copied.value = url;
      }
    }
    watch(() => inspector.id, () => {
      copied.value = "";
    });
    let opener = null;
    watch(() => inspector.id, async (id, was) => {
      var _a, _b, _c;
      if (id && !was) {
        opener = document.activeElement;
        const root = document.documentElement;
        root.style.setProperty("--scrollbar", `${window.innerWidth - root.clientWidth}px`);
        root.classList.add("inspecting");
      }
      if (id) {
        await nextTick();
        (_a = panel.value) == null ? void 0 : _a.scrollTo({ top: 0 });
        (_b = panel.value) == null ? void 0 : _b.focus({ preventScroll: true });
      } else {
        document.documentElement.classList.remove("inspecting");
        if (opener) {
          (_c = opener.focus) == null ? void 0 : _c.call(opener, { preventScroll: true });
          opener = null;
        }
      }
    });
    function onKey(e) {
      if (!inspector.id) return;
      if (e.key === "Escape") {
        closeItem();
        return;
      }
      if (e.target.matches("input, textarea")) return;
      if (e.key === "ArrowLeft" && prev.value) {
        e.preventDefault();
        openItem(prev.value.id);
      }
      if (e.key === "ArrowRight" && next.value) {
        e.preventDefault();
        openItem(next.value.id);
      }
      if (e.key === "Tab" && panel.value) {
        const stops = [...panel.value.querySelectorAll("a[href], button:not([disabled])")];
        if (!stops.length) return;
        const first = stops[0], last = stops[stops.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === panel.value)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    onMounted(() => document.addEventListener("keydown", onKey));
    onBeforeUnmount(() => document.removeEventListener("keydown", onKey));
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Transition, { name: "inspect" }, {
        default: withCtx(() => [
          current.value ? (openBlock(), createElementBlock("div", _hoisted_1$l, [
            createBaseVNode("div", {
              class: "inspect-veil",
              onClick: _cache[0] || (_cache[0] = (...args) => unref(closeItem) && unref(closeItem)(...args))
            }),
            createBaseVNode("aside", {
              ref_key: "panel",
              ref: panel,
              class: "inspect",
              role: "dialog",
              "aria-modal": "true",
              "aria-label": current.value.name,
              tabindex: "-1"
            }, [
              createBaseVNode("button", {
                class: "inspect-close",
                type: "button",
                "aria-label": "Закрыть карточку",
                onClick: _cache[1] || (_cache[1] = (...args) => unref(closeItem) && unref(closeItem)(...args))
              }, [..._cache[4] || (_cache[4] = [
                createBaseVNode("svg", {
                  viewBox: "0 0 16 16",
                  "aria-hidden": "true"
                }, [
                  createBaseVNode("path", {
                    d: "M3 3l10 10M13 3L3 13",
                    stroke: "currentColor",
                    "stroke-width": "2",
                    "stroke-linecap": "square"
                  })
                ], -1)
              ])]),
              (openBlock(), createBlock(_sfc_main$o, {
                key: current.value.id,
                item: current.value
              }, null, 8, ["item"])),
              createBaseVNode("nav", _hoisted_3$g, [
                prev.value ? (openBlock(), createElementBlock("button", {
                  key: 0,
                  type: "button",
                  class: "step-btn",
                  onClick: _cache[2] || (_cache[2] = ($event) => unref(openItem)(prev.value.id))
                }, [
                  _cache[5] || (_cache[5] = createBaseVNode("span", { class: "step-dir" }, "← Предыдущий", -1)),
                  createBaseVNode("span", _hoisted_4$e, [
                    createBaseVNode("img", {
                      src: prev.value.icon,
                      alt: ""
                    }, null, 8, _hoisted_5$e),
                    createTextVNode(toDisplayString(prev.value.name), 1)
                  ])
                ])) : createCommentVNode("", true),
                next.value ? (openBlock(), createElementBlock("button", {
                  key: 1,
                  type: "button",
                  class: "step-btn next",
                  onClick: _cache[3] || (_cache[3] = ($event) => unref(openItem)(next.value.id))
                }, [
                  _cache[6] || (_cache[6] = createBaseVNode("span", { class: "step-dir" }, "Следующий →", -1)),
                  createBaseVNode("span", _hoisted_6$e, [
                    createBaseVNode("img", {
                      src: next.value.icon,
                      alt: ""
                    }, null, 8, _hoisted_7$e),
                    createTextVNode(toDisplayString(next.value.name), 1)
                  ])
                ])) : createCommentVNode("", true)
              ]),
              createBaseVNode("div", _hoisted_8$d, [
                createBaseVNode("button", {
                  type: "button",
                  class: "text-btn",
                  onClick: copyLink
                }, "Ссылка на карточку"),
                createBaseVNode("span", _hoisted_9$d, toDisplayString(copied.value), 1)
              ]),
              _cache[7] || (_cache[7] = createBaseVNode("p", { class: "inspect-keys" }, "Стрелки ← → листают карточки, Esc закрывает.", -1))
            ], 8, _hoisted_2$i)
          ])) : createCommentVNode("", true)
        ]),
        _: 1
      });
    };
  }
};
const COLUMN = 1340;
const _sfc_main$m = {
  __name: "Atmosphere",
  setup(__props) {
    const WORLDS = {
      top: "hero",
      catalog: "catalog",
      start: "start",
      rarity: "rarity",
      weapons: "weapons",
      materials: "materials",
      craft: "craft",
      growth: "growth",
      sanctums: "sanctums",
      forge: "forge",
      temple: "temple",
      jungle: "jungle",
      night: "night",
      factory: "factory",
      castle: "castle",
      "wanderer-cube": "cube",
      "terra-trial": "terra",
      raids: "raids",
      blood: "blood",
      trophies: "trophies",
      admin: "admin"
    };
    const canvas = ref(null);
    let observer, raf = 0, ctx, motes = [], colours = ["#8a5cff", "#6fe4dc"], running = false;
    const RUNE_CELLS = RUNES.map(cells);
    const seen2 = /* @__PURE__ */ new Map();
    function pickWorld() {
      let best = null, bestHeight = Infinity;
      for (const [id, on] of seen2) {
        if (!on) continue;
        const el = document.getElementById(id);
        const h = el ? el.offsetHeight : Infinity;
        if (h < bestHeight) {
          best = id;
          bestHeight = h;
        }
      }
      if (best) {
        document.documentElement.dataset.world = WORLDS[best];
        setTimeout(readColours, 600);
      }
    }
    function readColours() {
      const css = getComputedStyle(document.documentElement);
      colours = [css.getPropertyValue("--w1").trim() || colours[0], css.getPropertyValue("--w2").trim() || colours[1]];
    }
    function gutter(w) {
      return Math.max(0, (w - COLUMN) / 2);
    }
    function spawnX(w, rune) {
      const g = gutter(w);
      if (!rune || g < 60) return Math.random() * w;
      const x = Math.random() * (g - 24);
      return Math.random() < 0.5 ? x : w - x;
    }
    function spawn(w, h, anywhere) {
      const rune = Math.random() < 0.3;
      return {
        x: spawnX(w, rune),
        y: anywhere ? Math.random() * h : h + 20,
        vy: -(0.12 + Math.random() * 0.35),
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 4e-3 + Math.random() * 0.01,
        size: rune ? 1.6 + Math.random() * 1.4 : 0.8 + Math.random() * 1.8,
        rune: rune ? RUNE_CELLS[Math.floor(Math.random() * RUNE_CELLS.length)] : null,
        tone: Math.random() < 0.6 ? 0 : 1,
        life: 0,
        max: 600 + Math.random() * 900
      };
    }
    function resize() {
      const c = canvas.value;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = innerWidth * dpr;
      c.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function frame() {
      raf = requestAnimationFrame(frame);
      const w = innerWidth, h = innerHeight;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        m.life++;
        m.y += m.vy;
        m.sway += m.swaySpeed;
        const x = m.x + Math.sin(m.sway) * 14;
        const fade = Math.min(1, m.life / 90, (m.max - m.life) / 120);
        if (m.life > m.max || m.y < -20) {
          motes[i] = spawn(w, h, false);
          continue;
        }
        const runeAlpha = gutter(w) >= 60 ? 0.28 : 0.1;
        ctx.globalAlpha = Math.max(0, fade) * (m.rune ? runeAlpha : 0.4);
        ctx.fillStyle = colours[m.tone];
        if (m.rune) {
          for (const [cx, cy] of m.rune) ctx.fillRect(Math.round(x + cx * m.size), Math.round(m.y + cy * m.size), Math.ceil(m.size), Math.ceil(m.size));
        } else {
          ctx.beginPath();
          ctx.arc(x, m.y, m.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }
    function start() {
      if (running || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      running = true;
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }
    const onVisibility = () => document.hidden ? stop() : start();
    onMounted(() => {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((e) => seen2.set(e.target.id, e.isIntersecting));
        pickWorld();
      }, { rootMargin: "-45% 0px -50% 0px" });
      Object.keys(WORLDS).forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
      document.documentElement.dataset.world = "hero";
      readColours();
      ctx = canvas.value.getContext("2d");
      resize();
      const count = innerWidth < 700 ? 26 : 64;
      motes = Array.from({ length: count }, () => spawn(innerWidth, innerHeight, true));
      addEventListener("resize", resize);
      document.addEventListener("visibilitychange", onVisibility);
      start();
    });
    onBeforeUnmount(() => {
      observer == null ? void 0 : observer.disconnect();
      stop();
      removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        _cache[0] || (_cache[0] = createBaseVNode("div", {
          class: "sky",
          "aria-hidden": "true"
        }, null, -1)),
        createBaseVNode("canvas", {
          ref_key: "canvas",
          ref: canvas,
          class: "motes",
          "aria-hidden": "true"
        }, null, 512)
      ], 64);
    };
  }
};
const _hoisted_1$k = {
  class: "xp",
  "aria-hidden": "true"
};
const _sfc_main$l = {
  __name: "XpBar",
  setup(__props) {
    const filled = ref(0);
    let ticking = false;
    function measure() {
      ticking = false;
      const max = document.documentElement.scrollHeight - innerHeight;
      filled.value = max > 0 ? Math.min(1, scrollY / max) : 0;
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(measure);
      }
    };
    onMounted(() => {
      measure();
      addEventListener("scroll", onScroll, { passive: true });
      addEventListener("resize", onScroll);
    });
    onBeforeUnmount(() => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$k, [
        createBaseVNode("span", {
          class: "xp-fill",
          style: normalizeStyle({ transform: `scaleX(${filled.value})` })
        }, null, 4)
      ]);
    };
  }
};
const _sfc_main$k = {
  __name: "HoverTip",
  setup(__props) {
    const tip = reactive({ id: null, x: 0, y: 0, flipX: false, flipY: false });
    const current = computed(() => tip.id && item(tip.id));
    const linkOf = (e) => {
      var _a, _b;
      return (_b = (_a = e.target).closest) == null ? void 0 : _b.call(_a, 'a[href^="#w-"]');
    };
    function place(e) {
      tip.x = e.clientX;
      tip.y = e.clientY;
      tip.flipX = e.clientX > innerWidth - 380;
      tip.flipY = e.clientY > innerHeight - 300;
    }
    function onOver(e) {
      const a = linkOf(e);
      if (!a || a.matches(".wname, .found-item")) return;
      const id = a.getAttribute("href").slice(3);
      if (!item(id)) return;
      tip.id = id;
      place(e);
    }
    function onOut(e) {
      const a = linkOf(e);
      if (a && !a.contains(e.relatedTarget)) tip.id = null;
    }
    const onMove = (e) => {
      if (tip.id) place(e);
    };
    const hide = () => {
      tip.id = null;
    };
    let fine = false;
    onMounted(() => {
      fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (!fine) return;
      document.addEventListener("pointerover", onOver);
      document.addEventListener("pointerout", onOut);
      document.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("scroll", hide, { passive: true, capture: true });
      document.addEventListener("click", hide, true);
    });
    onBeforeUnmount(() => {
      if (!fine) return;
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("scroll", hide, { capture: true });
      document.removeEventListener("click", hide, true);
    });
    return (_ctx, _cache) => {
      return current.value ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: "hovertip",
        "aria-hidden": "true",
        style: normalizeStyle({ left: `${tip.x}px`, top: `${tip.y}px`, transform: `translate(${tip.flipX ? "calc(-100% - 14px)" : "16px"}, ${tip.flipY ? "calc(-100% - 10px)" : "18px"})` })
      }, [
        createVNode(_sfc_main$w, { item: current.value }, null, 8, ["item"])
      ], 4)) : createCommentVNode("", true);
    };
  }
};
const _hoisted_1$j = ["tabindex"];
const _sfc_main$j = {
  __name: "ToTop",
  setup(__props) {
    const shown = ref(false);
    const onScroll = () => {
      shown.value = scrollY > innerHeight * 1.5;
    };
    const up = () => scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    onMounted(() => addEventListener("scroll", onScroll, { passive: true }));
    onBeforeUnmount(() => removeEventListener("scroll", onScroll));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("button", {
        type: "button",
        class: normalizeClass(["totop", { shown: shown.value }]),
        "aria-label": "Наверх",
        tabindex: shown.value ? 0 : -1,
        onClick: up
      }, [..._cache[0] || (_cache[0] = [
        createBaseVNode("svg", {
          viewBox: "0 0 16 16",
          "aria-hidden": "true"
        }, [
          createBaseVNode("path", {
            d: "M8 3l5 6H9.5v4h-3V9H3z",
            fill: "currentColor"
          })
        ], -1)
      ])], 10, _hoisted_1$j);
    };
  }
};
const _hoisted_1$i = { class: "keys-box" };
const _hoisted_2$h = { key: 0 };
const _hoisted_3$f = { key: 1 };
const _sfc_main$i = {
  __name: "KeysHelp",
  setup(__props) {
    const dialog = ref(null);
    const mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    const mod = mac ? "⌘" : "Ctrl";
    const groups = [
      ["Везде", [[["/"], "Поиск"], [[mod, "K"], "Поиск из любого поля"], [["?"], "Эта справка"]]],
      ["Шапка с хотбаром", [[["1", "…", "9"], "Выбрать слот"]]],
      ["Каталог", [[["←", "→", "↑", "↓"], "Соседний предмет в сетке"], [["←", "→"], "Повернуть модель, когда она в фокусе"]]],
      ["Карточка предмета", [[["←", "→"], "Предыдущий и следующий предмет"], [["Esc"], "Закрыть"]]]
    ];
    const open = () => {
      var _a;
      return (_a = dialog.value) == null ? void 0 : _a.showModal();
    };
    const onKey = (e) => {
      var _a;
      if (e.key !== "?" || e.ctrlKey || e.metaKey || e.altKey || e.target.matches("input, textarea, [contenteditable]")) return;
      if ((_a = dialog.value) == null ? void 0 : _a.open) return;
      e.preventDefault();
      open();
    };
    const onClick = (e) => {
      if (e.target === dialog.value) dialog.value.close();
    };
    onMounted(() => {
      document.addEventListener("keydown", onKey);
      addEventListener("codex:keys", open);
    });
    onBeforeUnmount(() => {
      document.removeEventListener("keydown", onKey);
      removeEventListener("codex:keys", open);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("dialog", {
        ref_key: "dialog",
        ref: dialog,
        class: "keys",
        "aria-labelledby": "keys-title",
        onClick
      }, [
        createBaseVNode("div", _hoisted_1$i, [
          _cache[0] || (_cache[0] = createBaseVNode("header", { class: "keys-head" }, [
            createBaseVNode("h2", { id: "keys-title" }, "Горячие клавиши"),
            createBaseVNode("form", { method: "dialog" }, [
              createBaseVNode("button", {
                class: "keys-close",
                "aria-label": "Закрыть"
              }, "✕")
            ])
          ], -1)),
          (openBlock(), createElementBlock(Fragment, null, renderList(groups, ([title, rows]) => {
            return createBaseVNode("div", {
              key: title,
              class: "keys-group"
            }, [
              createBaseVNode("h3", null, toDisplayString(title), 1),
              createBaseVNode("dl", null, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(rows, ([combo, what]) => {
                  return openBlock(), createElementBlock("div", {
                    key: what,
                    class: "keys-row"
                  }, [
                    createBaseVNode("dt", null, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(combo, (k, i) => {
                        return openBlock(), createElementBlock(Fragment, { key: i }, [
                          k !== "…" ? (openBlock(), createElementBlock("kbd", _hoisted_2$h, toDisplayString(k), 1)) : (openBlock(), createElementBlock("span", _hoisted_3$f, "…"))
                        ], 64);
                      }), 128))
                    ]),
                    createBaseVNode("dd", null, toDisplayString(what), 1)
                  ]);
                }), 128))
              ])
            ]);
          }), 64))
        ])
      ], 512);
    };
  }
};
const _hoisted_1$h = {
  class: "sitefoot",
  "aria-labelledby": "sitefoot-title"
};
const _hoisted_2$g = { class: "sitefoot-in" };
const _hoisted_3$e = { class: "sitefoot-brand" };
const _hoisted_4$d = {
  class: "sitefoot-name",
  href: "#top"
};
const _hoisted_5$d = ["src"];
const _hoisted_6$d = { class: "sitefoot-stats" };
const _hoisted_7$d = ["aria-label"];
const _hoisted_8$c = ["href"];
const _hoisted_9$c = { class: "sitefoot-bottom" };
const REPO = "https://github.com/virus-momentx/wiki-virus-swords";
const _sfc_main$h = {
  __name: "SiteFooter",
  setup(__props) {
    const columns = [
      ["Предметы", [["catalog", "Каталог"], ["rarity", "Редкости"], ["weapons", "Линии клинков"], ["craft", "Крафт"]]],
      ["Путь", [["start", "С чего начать"], ["growth", "Рост клинка"], ["blood", "Родословные"], ["trophies", "Достижения"]]],
      ["Мир", [["sanctums", "Святилища"], ["raids", "Испытания"], ["admin", "Для администратора"]]]
    ];
    const MONTHS = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    const built = (() => {
      const [y, m, d] = (data.built || "").split("-").map(Number);
      return y ? `${d} ${MONTHS[m - 1]} ${y}` : "";
    })();
    const c = data.counts;
    const stats = [
      `${c.weapons} ${plural(c.weapons, "клинок", "клинка", "клинков")}`,
      `${c.materials} ${plural(c.materials, "материал", "материала", "материалов")}`,
      `${c.trophies} ${plural(c.trophies, "достижение", "достижения", "достижений")}`
    ].join(" · ");
    const keys = () => dispatchEvent(new Event("codex:keys"));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("footer", _hoisted_1$h, [
        createBaseVNode("div", _hoisted_2$g, [
          createBaseVNode("div", _hoisted_3$e, [
            createBaseVNode("a", _hoisted_4$d, [
              createBaseVNode("img", {
                src: unref(data).icons.forge_heart,
                alt: "",
                width: "28",
                height: "28"
              }, null, 8, _hoisted_5$d),
              _cache[0] || (_cache[0] = createBaseVNode("span", { id: "sitefoot-title" }, "Кодекс VirusSwords", -1))
            ]),
            _cache[2] || (_cache[2] = createBaseVNode("p", null, "Энциклопедия плагина VirusSwords для Paper 1.21.11. Имена, описания, урон, цены алтарей и достижения взяты прямо из исходного кода плагина.", -1)),
            createBaseVNode("p", _hoisted_6$d, toDisplayString(unref(stats)), 1),
            createBaseVNode("p", { class: "sitefoot-gh" }, [
              createBaseVNode("a", {
                href: REPO,
                rel: "noopener",
                target: "_blank"
              }, [..._cache[1] || (_cache[1] = [
                createBaseVNode("svg", {
                  viewBox: "0 0 16 16",
                  width: "16",
                  height: "16",
                  "aria-hidden": "true"
                }, [
                  createBaseVNode("path", {
                    fill: "currentColor",
                    d: "M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.71 1.23 1.88.87 2.34.67.07-.52.28-.87.5-1.07-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.59.83-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 8 0z"
                  })
                ], -1),
                createTextVNode("Исходники вики на GitHub", -1),
                createBaseVNode("span", { class: "sr-only" }, " (откроется в новой вкладке)", -1)
              ])])
            ])
          ]),
          (openBlock(), createElementBlock(Fragment, null, renderList(columns, ([title, links]) => {
            return createBaseVNode("nav", {
              key: title,
              class: "sitefoot-col",
              "aria-label": title
            }, [
              createBaseVNode("h2", null, toDisplayString(title), 1),
              createBaseVNode("ul", null, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(links, ([id, label]) => {
                  return openBlock(), createElementBlock("li", { key: id }, [
                    createBaseVNode("a", {
                      href: `#${id}`
                    }, toDisplayString(label), 9, _hoisted_8$c)
                  ]);
                }), 128))
              ])
            ], 8, _hoisted_7$d);
          }), 64))
        ]),
        createBaseVNode("div", _hoisted_9$c, [
          _cache[3] || (_cache[3] = createBaseVNode("span", null, "Модели предметов — из ресурспака сервера: Fantasy Weapons (nongkos), Blades of Majestica и другие паки; используются приватно.", -1)),
          createBaseVNode("span", null, [
            createBaseVNode("button", {
              type: "button",
              class: "sitefoot-keys",
              onClick: keys
            }, "Горячие клавиши"),
            unref(built) ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
              createTextVNode(" · Обновлено " + toDisplayString(unref(built)), 1)
            ], 64)) : createCommentVNode("", true)
          ])
        ])
      ]);
    };
  }
};
const _hoisted_1$g = {
  class: "sec-rune",
  viewBox: "0 0 5 7",
  "aria-hidden": "true"
};
const _hoisted_2$f = ["x", "y"];
const _hoisted_3$d = { class: "sec-title" };
const _hoisted_4$c = {
  key: 0,
  class: "emblem",
  "aria-hidden": "true"
};
const _hoisted_5$c = ["src"];
const _hoisted_6$c = ["href", "aria-label"];
const _hoisted_7$c = {
  class: "sec-anchor-tip",
  role: "status"
};
const _sfc_main$g = {
  __name: "SecHead",
  props: {
    title: { type: String, required: true },
    /** The item whose picture stands in the section's emblem. */
    icon: { type: String, default: "" }
  },
  setup(__props) {
    const props = __props;
    const src = computed(() => {
      var _a;
      return props.icon && (((_a = item(props.icon)) == null ? void 0 : _a.icon) || data.icons[props.icon]);
    });
    const rune = computed(() => cells(RUNES[[...props.title].reduce((n, c) => n + c.charCodeAt(0), 0) % RUNES.length]));
    const root = ref(null);
    const anchor = ref("");
    const copied = ref(false);
    onMounted(() => {
      var _a, _b;
      anchor.value = ((_b = (_a = root.value) == null ? void 0 : _a.closest("section[id]")) == null ? void 0 : _b.id) || "";
    });
    async function copyLink(e) {
      if (!anchor.value) return;
      e.preventDefault();
      history.replaceState(null, "", `#${anchor.value}`);
      const url = location.href;
      try {
        await navigator.clipboard.writeText(url);
      } catch (err) {
      }
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 1600);
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "root",
        ref: root,
        class: "sec-head"
      }, [
        (openBlock(), createElementBlock("svg", _hoisted_1$g, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(rune.value, ([x, y], i) => {
            return openBlock(), createElementBlock("rect", {
              key: i,
              x,
              y,
              width: "1",
              height: "1"
            }, null, 8, _hoisted_2$f);
          }), 128))
        ])),
        createBaseVNode("div", _hoisted_3$d, [
          src.value ? (openBlock(), createElementBlock("span", _hoisted_4$c, [
            createBaseVNode("img", {
              src: src.value,
              alt: ""
            }, null, 8, _hoisted_5$c)
          ])) : createCommentVNode("", true),
          createBaseVNode("h2", null, toDisplayString(__props.title), 1),
          anchor.value ? (openBlock(), createElementBlock("a", {
            key: 1,
            class: "sec-anchor",
            href: `#${anchor.value}`,
            "aria-label": `Ссылка на раздел «${__props.title}»`,
            onClick: copyLink
          }, [
            _cache[0] || (_cache[0] = createBaseVNode("svg", {
              viewBox: "0 0 16 16",
              "aria-hidden": "true"
            }, [
              createBaseVNode("path", {
                d: "M6.5 9.5l3-3M7 4.5l1.2-1.2a2.6 2.6 0 0 1 3.7 3.7L10.7 8.2M9 11.5l-1.2 1.2a2.6 2.6 0 0 1-3.7-3.7L5.3 7.8",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "1.5",
                "stroke-linecap": "round"
              })
            ], -1)),
            createBaseVNode("span", _hoisted_7$c, toDisplayString(copied.value ? "Ссылка скопирована" : ""), 1)
          ], 8, _hoisted_6$c)) : createCommentVNode("", true),
          _cache[1] || (_cache[1] = createBaseVNode("span", {
            class: "sec-rule",
            "aria-hidden": "true"
          }, null, -1))
        ]),
        renderSlot(_ctx.$slots, "default")
      ], 512);
    };
  }
};
const _hoisted_1$f = { id: "start" };
const _sfc_main$f = {
  __name: "StartSection",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$f, [
        createVNode(_sfc_main$g, {
          title: "С чего начать",
          icon: "terra_compass"
        }),
        _cache[0] || (_cache[0] = createStaticVNode('<ol class="steps"><li><h3>Выберите кровь</h3><p>При первом входе откроется выбор родословной. От неё зависят ваша сила, книга, которую вы получите, и то, какие величайшие клинки вас признают.</p></li><li><h3>Выберите путеводителя</h3><p>Следом — чей голос будет с вами: Путеводитель с загадками, ZorahM-GPT, разум Древней фабрики, или Наблюдатель, помнящий Все-Чёрного с первого удара.</p></li><li><h3>Найдите первый клинок</h3><p>Погибель и Резак лежат в сундуках древнего города, Арахнид — в вагонетках заброшенных шахт, Сумрачная секира — в крепостях Незера.</p></li><li><h3>Добудьте Душу демона</h3><p>Она лежит в сокровищнице бастиона. Резак и Душа на верстаке дают Демонический резак, а у алтаря Незеритовой кузни Душа превращает Погибель в Бедствие и Арахнида в Убийцу демонов.</p></li><li><h3>Растите мастерство</h3><p>Клинок учится от каждого удара. Мастерство открывает заточку и пробуждение; эволюция просит только материалы.</p></li><li><h3>Найдите святилище</h3><p>Дорогу к святилищам покажут компасы и карты. Пробейтесь через стражу — и алтарь откроет испытания.</p></li><li><h3>Доведите клинок до вершины</h3><p>Высшие клинки — Империум, Истинный Экскалибур, Энигма и другие — получают эволюцией или ковкой у алтарей святилищ. Корона отвечает только своей крови, обычно с четвёртой формы, а Все-Чёрный, выкованный из короны за Чёрную субстанцию, навсегда меняет кровь на бездну.</p></li></ol><p class="small muted">Сервер узнаёт о ваших делах: первый выкованный, улучшенный или собранный клинок, сломанная Печать ночи, вытянутая Луна и сработавшие Королевские часы объявляются в чате всем — имя клинка можно навести мышью и рассмотреть. Способности с долгой перезарядкой видят только игроки рядом.</p>', 2))
      ]);
    };
  }
};
const _hoisted_1$e = { id: "rarity" };
const _hoisted_2$e = { class: "rarities" };
const _hoisted_3$c = { class: "rhead" };
const _hoisted_4$b = ["href", "title"];
const _hoisted_5$b = ["src"];
const _hoisted_6$b = { class: "rname" };
const _hoisted_7$b = {
  class: "swatches",
  "aria-hidden": "true"
};
const _hoisted_8$b = { class: "rmotion" };
const _hoisted_9$b = { class: "rused" };
const _hoisted_10$a = {
  key: 1,
  class: "muted"
};
const _sfc_main$e = {
  __name: "RaritySection",
  setup(__props) {
    const example = Object.fromEntries(data.rarities.map((r) => [r.const, data.items.find((i) => i.rarity === r.const)]));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$e, [
        createVNode(_sfc_main$g, {
          title: "Редкости",
          icon: "wanderer_cube"
        }, {
          default: withCtx(() => [..._cache[0] || (_cache[0] = [
            createBaseVNode("p", { class: "lead" }, "Имя предмета окрашено градиентом его редкости — так же, как в игре. Старшие редкости переливаются.", -1)
          ])]),
          _: 1
        }),
        createBaseVNode("ol", _hoisted_2$e, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(data).rarities, (r) => {
            return openBlock(), createElementBlock("li", {
              key: r.const,
              class: "rarity"
            }, [
              createBaseVNode("span", _hoisted_3$c, [
                unref(example)[r.const] ? (openBlock(), createElementBlock("a", {
                  key: 0,
                  class: "rex",
                  href: `#w-${unref(example)[r.const].id}`,
                  title: unref(example)[r.const].name
                }, [
                  createBaseVNode("img", {
                    src: unref(example)[r.const].icon,
                    alt: ""
                  }, null, 8, _hoisted_5$b)
                ], 8, _hoisted_4$b)) : createCommentVNode("", true),
                createBaseVNode("span", _hoisted_6$b, [
                  createVNode(_sfc_main$x, {
                    rarity: r.const
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(r.label), 1)
                    ]),
                    _: 2
                  }, 1032, ["rarity"])
                ])
              ]),
              createBaseVNode("span", _hoisted_7$b, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(r.palette, (c) => {
                  return openBlock(), createElementBlock("span", {
                    key: c,
                    class: "sw",
                    style: normalizeStyle({ background: c })
                  }, null, 4);
                }), 128))
              ]),
              createBaseVNode("span", _hoisted_8$b, toDisplayString(r.motion), 1),
              createBaseVNode("span", _hoisted_9$b, [
                r.used.length ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                  createTextVNode(toDisplayString(r.used.join(", ")), 1)
                ], 64)) : (openBlock(), createElementBlock("span", _hoisted_10$a, "пока ничем не окрашена"))
              ])
            ]);
          }), 128))
        ])
      ]);
    };
  }
};
const _hoisted_1$d = { id: "weapons" };
const _hoisted_2$d = { class: "weapon-bar" };
const _hoisted_3$b = {
  class: "filters",
  role: "group",
  "aria-label": "Фильтр по линии"
};
const _hoisted_4$a = ["aria-pressed", "onClick"];
const _hoisted_5$a = {
  class: "seg",
  role: "group",
  "aria-label": "Вид"
};
const _hoisted_6$a = ["aria-pressed"];
const _hoisted_7$a = ["aria-pressed"];
const _hoisted_8$a = {
  key: 0,
  class: "tbl wtable"
};
const _hoisted_9$a = ["aria-sort"];
const _hoisted_10$9 = { "aria-hidden": "true" };
const _hoisted_11$9 = ["aria-sort"];
const _hoisted_12$8 = { "aria-hidden": "true" };
const _hoisted_13$6 = ["aria-sort"];
const _hoisted_14$6 = { "aria-hidden": "true" };
const _hoisted_15$6 = ["aria-sort"];
const _hoisted_16$5 = { "aria-hidden": "true" };
const _hoisted_17$5 = { scope: "row" };
const _hoisted_18$4 = ["href"];
const _hoisted_19$4 = { class: "islot-cell sm" };
const _hoisted_20$4 = ["src"];
const _hoisted_21$4 = { class: "num" };
const _hoisted_22$3 = { class: "num" };
const _hoisted_23$3 = { class: "rname sm" };
const _hoisted_24$3 = {
  key: 1,
  class: "lines"
};
const _hoisted_25$3 = ["data-key"];
const _hoisted_26$3 = { class: "line-title" };
const _hoisted_27$3 = { class: "line-row" };
const _hoisted_28$3 = {
  key: 0,
  class: "energy",
  "aria-hidden": "true"
};
const _hoisted_29$3 = {
  key: 1,
  class: "arrow",
  "aria-hidden": "true"
};
const _hoisted_30$2 = {
  key: 2,
  class: "empty"
};
const VIEW_KEY = "codex-weapons-view";
const _sfc_main$d = {
  __name: "WeaponsSection",
  setup(__props) {
    const lines = [
      ["all", "Все"],
      ["hell", "Адская"],
      ["cleaver", "Резаки"],
      ["blood", "Кровавая"],
      ["axe", "Секиры"],
      ["sky", "Небесные"],
      ["night", "Ночь"],
      ["jungle", "Джунгли"],
      ["techno", "Техно"],
      ["forgotten", "Забытый мир"]
    ];
    const seen2 = /* @__PURE__ */ new Set();
    const chains = data.chains.map((chain) => ({
      ...chain,
      entries: chain.entries.map((e) => ({ ...e, item: item(e.id), anchor: !seen2.has(e.id) && seen2.add(e.id) }))
    }));
    let saved = "lines";
    try {
      saved = localStorage.getItem(VIEW_KEY) || "lines";
    } catch (e) {
    }
    const view = ref(saved === "table" ? "table" : "lines");
    const setView = (v) => {
      view.value = v;
      try {
        localStorage.setItem(VIEW_KEY, v);
      } catch (e) {
      }
    };
    const rank = Object.fromEntries(data.rarities.map((r, i) => [r.const, i]));
    const sort = ref({ key: "damage", dir: -1 });
    const sortBy = (key) => {
      sort.value = sort.value.key === key ? { key, dir: -sort.value.dir } : { key, dir: key === "name" ? 1 : -1 };
    };
    const value = (w, key) => key === "rarity" ? rank[w.rarity] : key === "name" ? w.name : w[key];
    const sorted = computed(() => [...weapons.value].sort((a, b) => {
      const x = value(a, sort.value.key), y = value(b, sort.value.key);
      const d = typeof x === "string" ? x.localeCompare(y, "ru") : x - y;
      return d * sort.value.dir || a.name.localeCompare(b.name, "ru");
    }));
    const ariaSort = (key) => sort.value.key === key ? sort.value.dir > 0 ? "ascending" : "descending" : "none";
    const mark = (key) => sort.value.key === key ? sort.value.dir > 0 ? "↑" : "↓" : "";
    const inLine = (chain) => filters.line === "all" || chain.key === filters.line || filters.line === "jungle" && chain.key === "terra";
    const visible = computed(() => chains.filter((c) => inLine(c) && c.entries.some((e) => shownIds.value.has(e.id))));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$d, [
        createVNode(_sfc_main$g, {
          title: "Линии клинков",
          icon: "all_black"
        }, {
          default: withCtx(() => [..._cache[6] || (_cache[6] = [
            createBaseVNode("p", { class: "lead" }, "Клинки выстроены в линии — от находки в мире до неломаемого оружия. Стрелка — эволюция у алтаря, «или» — развилка. Нажмите на клинок, чтобы открыть карточку.", -1)
          ])]),
          _: 1
        }),
        createBaseVNode("div", _hoisted_2$d, [
          createBaseVNode("div", _hoisted_3$b, [
            (openBlock(), createElementBlock(Fragment, null, renderList(lines, ([key, title]) => {
              return createBaseVNode("button", {
                key,
                type: "button",
                class: "chip",
                "aria-pressed": String(unref(filters).line === key),
                onClick: ($event) => unref(filters).line = key
              }, toDisplayString(title), 9, _hoisted_4$a);
            }), 64))
          ]),
          createBaseVNode("div", _hoisted_5$a, [
            createBaseVNode("button", {
              type: "button",
              "aria-pressed": String(view.value === "lines"),
              onClick: _cache[0] || (_cache[0] = ($event) => setView("lines"))
            }, "Линии", 8, _hoisted_6$a),
            createBaseVNode("button", {
              type: "button",
              "aria-pressed": String(view.value === "table"),
              onClick: _cache[1] || (_cache[1] = ($event) => setView("table"))
            }, "Таблица", 8, _hoisted_7$a)
          ])
        ]),
        view.value === "table" ? (openBlock(), createElementBlock("div", _hoisted_8$a, [
          createBaseVNode("table", null, [
            createBaseVNode("thead", null, [
              createBaseVNode("tr", null, [
                createBaseVNode("th", {
                  "aria-sort": ariaSort("name")
                }, [
                  createBaseVNode("button", {
                    type: "button",
                    class: "sort",
                    onClick: _cache[2] || (_cache[2] = ($event) => sortBy("name"))
                  }, [
                    _cache[7] || (_cache[7] = createTextVNode("Клинок ", -1)),
                    createBaseVNode("span", _hoisted_10$9, toDisplayString(mark("name")), 1)
                  ])
                ], 8, _hoisted_9$a),
                createBaseVNode("th", {
                  class: "num",
                  "aria-sort": ariaSort("damage")
                }, [
                  createBaseVNode("button", {
                    type: "button",
                    class: "sort",
                    onClick: _cache[3] || (_cache[3] = ($event) => sortBy("damage"))
                  }, [
                    _cache[8] || (_cache[8] = createTextVNode("Урон ", -1)),
                    createBaseVNode("span", _hoisted_12$8, toDisplayString(mark("damage")), 1)
                  ])
                ], 8, _hoisted_11$9),
                createBaseVNode("th", {
                  class: "num",
                  "aria-sort": ariaSort("speed")
                }, [
                  createBaseVNode("button", {
                    type: "button",
                    class: "sort",
                    onClick: _cache[4] || (_cache[4] = ($event) => sortBy("speed"))
                  }, [
                    _cache[9] || (_cache[9] = createTextVNode("Скорость ", -1)),
                    createBaseVNode("span", _hoisted_14$6, toDisplayString(mark("speed")), 1)
                  ])
                ], 8, _hoisted_13$6),
                createBaseVNode("th", {
                  "aria-sort": ariaSort("rarity")
                }, [
                  createBaseVNode("button", {
                    type: "button",
                    class: "sort",
                    onClick: _cache[5] || (_cache[5] = ($event) => sortBy("rarity"))
                  }, [
                    _cache[10] || (_cache[10] = createTextVNode("Редкость ", -1)),
                    createBaseVNode("span", _hoisted_16$5, toDisplayString(mark("rarity")), 1)
                  ])
                ], 8, _hoisted_15$6),
                _cache[11] || (_cache[11] = createBaseVNode("th", null, "Как получить", -1))
              ])
            ]),
            createBaseVNode("tbody", null, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(sorted.value, (w) => {
                return openBlock(), createElementBlock("tr", {
                  key: w.id
                }, [
                  createBaseVNode("th", _hoisted_17$5, [
                    createBaseVNode("a", {
                      class: "wname",
                      href: `#w-${w.id}`
                    }, [
                      createBaseVNode("span", _hoisted_19$4, [
                        createBaseVNode("img", {
                          src: w.icon,
                          alt: ""
                        }, null, 8, _hoisted_20$4)
                      ]),
                      createTextVNode(toDisplayString(w.name), 1)
                    ], 8, _hoisted_18$4)
                  ]),
                  createBaseVNode("td", _hoisted_21$4, toDisplayString(w.damage), 1),
                  createBaseVNode("td", _hoisted_22$3, toDisplayString(w.speed), 1),
                  createBaseVNode("td", null, [
                    createBaseVNode("span", _hoisted_23$3, [
                      createVNode(_sfc_main$x, {
                        rarity: w.rarity
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(w.rarityLabel), 1)
                        ]),
                        _: 2
                      }, 1032, ["rarity"])
                    ])
                  ]),
                  createBaseVNode("td", null, [
                    createBaseVNode("span", {
                      class: normalizeClass(["mbadge", `m-${w.method}`])
                    }, toDisplayString(w.methodLabel), 3)
                  ])
                ]);
              }), 128))
            ])
          ])
        ])) : (openBlock(), createElementBlock("div", _hoisted_24$3, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(visible.value, (chain) => {
            return openBlock(), createElementBlock("div", {
              key: chain.key,
              class: "line",
              "data-key": chain.key
            }, [
              createBaseVNode("h3", _hoisted_26$3, toDisplayString(chain.title), 1),
              createBaseVNode("div", _hoisted_27$3, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(chain.entries, (e, i) => {
                  return openBlock(), createElementBlock(Fragment, { key: i }, [
                    e.sep === "→" ? (openBlock(), createElementBlock("span", _hoisted_28$3)) : e.sep ? (openBlock(), createElementBlock("span", _hoisted_29$3, toDisplayString(e.sep), 1)) : createCommentVNode("", true),
                    createVNode(_sfc_main$r, {
                      item: e.item,
                      anchor: e.anchor,
                      named: "",
                      dim: !unref(shownIds).has(e.id)
                    }, null, 8, ["item", "anchor", "dim"])
                  ], 64);
                }), 128))
              ])
            ], 8, _hoisted_25$3);
          }), 128))
        ])),
        (view.value === "table" ? !sorted.value.length : !visible.value.length) ? (openBlock(), createElementBlock("p", _hoisted_30$2, "Ни одного клинка — попробуйте другое слово или линию «Все».")) : createCommentVNode("", true)
      ]);
    };
  }
};
const _hoisted_1$c = { id: "catalog" };
const _hoisted_2$c = { class: "cat" };
const _hoisted_3$a = { class: "cat-side" };
const _hoisted_4$9 = { class: "cat-filters" };
const _hoisted_5$9 = { class: "cat-search" };
const _hoisted_6$9 = {
  class: "seg cat-kind",
  role: "group",
  "aria-label": "Вид"
};
const _hoisted_7$9 = ["aria-pressed", "onClick"];
const _hoisted_8$9 = { class: "cat-group" };
const _hoisted_9$9 = { class: "cat-chips" };
const _hoisted_10$8 = ["aria-pressed", "onClick"];
const _hoisted_11$8 = { class: "cat-group" };
const _hoisted_12$7 = { class: "cat-chips" };
const _hoisted_13$5 = ["aria-pressed"];
const _hoisted_14$5 = ["aria-pressed", "onClick"];
const _hoisted_15$5 = ["aria-pressed"];
const _hoisted_16$4 = {
  class: "cat-count",
  "aria-live": "polite"
};
const _hoisted_17$4 = ["aria-selected", "title", "onClick"];
const _hoisted_18$3 = ["src"];
const _hoisted_19$3 = { class: "sr-only" };
const _hoisted_20$3 = {
  key: 0,
  class: "cat-empty",
  role: "status"
};
const _hoisted_21$3 = { class: "cv-head" };
const _hoisted_22$2 = { class: "cv-tags" };
const _hoisted_23$2 = { class: "cv-tag" };
const _hoisted_24$2 = { class: "cv-tag" };
const _hoisted_25$2 = {
  key: 0,
  class: "cv-tag"
};
const _hoisted_26$2 = {
  key: 1,
  class: "cv-tag"
};
const _hoisted_27$2 = {
  key: 0,
  class: "cv-lore"
};
const _hoisted_28$2 = ["innerHTML"];
const _hoisted_29$2 = {
  key: 1,
  class: "cv-stats statbars"
};
const _hoisted_30$1 = { class: "statbar" };
const _hoisted_31$1 = {
  class: "statbar-track",
  "aria-hidden": "true"
};
const _hoisted_32$1 = { class: "statbar-value" };
const _hoisted_33$1 = { class: "statbar" };
const _hoisted_34$1 = {
  class: "statbar-track",
  "aria-hidden": "true"
};
const _hoisted_35$1 = { class: "statbar-value" };
const _hoisted_36$1 = { class: "cv-obtain" };
const _hoisted_37$1 = ["innerHTML"];
const _sfc_main$c = {
  __name: "CatalogSection",
  setup(__props) {
    const items = data.items.filter((i) => i.model3d);
    const rarities2 = data.rarities.filter((r) => items.some((i) => i.rarity === r.const));
    const bloods = data.blood.map((b) => ({ id: b.id, title: b.title, colour: b.colour }));
    const bloodOf = Object.fromEntries(bloods.map((b) => [b.id, b]));
    const kind = ref("all");
    const rarity = ref(/* @__PURE__ */ new Set());
    const blood = ref("any");
    const query = ref("");
    const KINDS = [["all", "Всё"], ["weapon", "Клинки"], ["material", "Материалы"]].filter(([k]) => k === "all" || items.some((i) => i.kind === k));
    const toggleRarity = (key) => {
      const next = new Set(rarity.value);
      next.has(key) ? next.delete(key) : next.add(key);
      rarity.value = next;
    };
    const reset = () => {
      kind.value = "all";
      rarity.value = /* @__PURE__ */ new Set();
      blood.value = "any";
      query.value = "";
    };
    const busy = computed(() => kind.value !== "all" || rarity.value.size || blood.value !== "any" || query.value);
    const rank = Object.fromEntries(data.rarities.map((r, i) => [r.const, i]));
    const text = (i) => norm([i.name, i.rarityLabel, i.obtain, i.lore.join(" ").replace(/<[^>]+>/g, ""), i.abilities.map((a) => a.name).join(" ")].join(" "));
    const shown = computed(() => {
      const q = norm(query.value.trim());
      return items.filter((i) => kind.value === "all" || i.kind === kind.value).filter((i) => !rarity.value.size || rarity.value.has(i.rarity)).filter((i) => blood.value === "any" || (blood.value === "none" ? !i.blood && i.kind === "weapon" : i.blood === blood.value)).filter((i) => !q || text(i).includes(q)).sort((a, b) => (a.kind === b.kind ? 0 : a.kind === "weapon" ? -1 : 1) || rank[b.rarity] - rank[a.rarity] || a.name.localeCompare(b.name, "ru"));
    });
    const picked = ref("all_black");
    const current = computed(() => items.find((i) => i.id === picked.value) || shown.value[0] || items[0]);
    watch(shown, (list) => {
      if (list.length && !list.some((i) => i.id === picked.value)) picked.value = list[0].id;
    });
    const viewer = ref(null);
    function pick(id) {
      var _a;
      picked.value = id;
      if (window.matchMedia("(max-width: 900px)").matches) (_a = viewer.value) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    function onGridKey(e) {
      const list = shown.value;
      const at = list.findIndex((i) => i.id === picked.value);
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        picked.value = list[Math.min(list.length - 1, at + 1)].id;
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        picked.value = list[Math.max(0, at - 1)].id;
      }
    }
    const blades = items.filter((i) => i.kind === "weapon");
    const MAX = { damage: Math.max(...blades.map((b) => b.damage)), speed: Math.max(...blades.map((b) => b.speed)) };
    const owner = computed(() => current.value.blood ? bloodOf[current.value.blood] : null);
    const formText = (f) => f > 1 ? `с ${f}-й формы` : "с первой формы";
    const light = (hex) => {
      const n = parseInt(hex.slice(1), 16);
      return 0.299 * (n >> 16) + 0.587 * (n >> 8 & 255) + 0.114 * (n & 255);
    };
    const glow = computed(() => {
      var _a;
      const pal = [...((_a = data.rarities.find((r) => r.const === current.value.rarity)) == null ? void 0 : _a.palette) || ["#8a5cff"]].sort((a, b) => light(b) - light(a));
      return { "--r1": pal[0], "--r2": pal[Math.min(1, pal.length - 1)] };
    });
    const plain = computed(() => current.value.lore.filter((l) => l !== ""));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$c, [
        createVNode(_sfc_main$g, {
          title: "Каталог",
          icon: "hyperion"
        }, {
          default: withCtx(() => [..._cache[4] || (_cache[4] = [
            createBaseVNode("p", { class: "lead" }, "Предметы плагина с объёмной моделью. Отберите их по виду, редкости и крови и выберите любой: он встанет на магический круг. Тяните его мышью или пальцем, чтобы повернуть.", -1)
          ])]),
          _: 1
        }),
        createBaseVNode("div", _hoisted_2$c, [
          createBaseVNode("div", _hoisted_3$a, [
            createBaseVNode("div", _hoisted_4$9, [
              createBaseVNode("div", _hoisted_5$9, [
                _cache[5] || (_cache[5] = createBaseVNode("label", {
                  for: "cat-q",
                  class: "sr-only"
                }, "Найти в каталоге", -1)),
                _cache[6] || (_cache[6] = createBaseVNode("svg", {
                  viewBox: "0 0 16 16",
                  "aria-hidden": "true"
                }, [
                  createBaseVNode("circle", {
                    cx: "7",
                    cy: "7",
                    r: "4.6",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "1.6"
                  }),
                  createBaseVNode("path", {
                    d: "M10.4 10.4L14 14",
                    stroke: "currentColor",
                    "stroke-width": "1.6"
                  })
                ], -1)),
                withDirectives(createBaseVNode("input", {
                  id: "cat-q",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => query.value = $event),
                  type: "search",
                  placeholder: "Название, способность, источник",
                  autocomplete: "off"
                }, null, 512), [
                  [vModelText, query.value]
                ])
              ]),
              createBaseVNode("div", _hoisted_6$9, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(unref(KINDS), ([k, t]) => {
                  return openBlock(), createElementBlock("button", {
                    key: k,
                    type: "button",
                    "aria-pressed": String(kind.value === k),
                    onClick: ($event) => kind.value = k
                  }, toDisplayString(t), 9, _hoisted_7$9);
                }), 128))
              ]),
              createBaseVNode("fieldset", _hoisted_8$9, [
                _cache[7] || (_cache[7] = createBaseVNode("legend", null, "Редкость", -1)),
                createBaseVNode("div", _hoisted_9$9, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(unref(rarities2), (r) => {
                    return openBlock(), createElementBlock("button", {
                      key: r.const,
                      type: "button",
                      class: "rchip",
                      "aria-pressed": String(rarity.value.has(r.const)),
                      onClick: ($event) => toggleRarity(r.const)
                    }, [
                      createBaseVNode("span", {
                        class: "rchip-swatch",
                        style: normalizeStyle(unref(rarityStyle)(r.const)),
                        "aria-hidden": "true"
                      }, null, 4),
                      createVNode(_sfc_main$x, {
                        rarity: r.const
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(r.label), 1)
                        ]),
                        _: 2
                      }, 1032, ["rarity"])
                    ], 8, _hoisted_10$8);
                  }), 128))
                ])
              ]),
              createBaseVNode("fieldset", _hoisted_11$8, [
                _cache[8] || (_cache[8] = createBaseVNode("legend", null, "Кровь", -1)),
                createBaseVNode("div", _hoisted_12$7, [
                  createBaseVNode("button", {
                    type: "button",
                    class: "bchip",
                    "aria-pressed": String(blood.value === "any"),
                    onClick: _cache[1] || (_cache[1] = ($event) => blood.value = "any")
                  }, "Любая", 8, _hoisted_13$5),
                  (openBlock(true), createElementBlock(Fragment, null, renderList(unref(bloods), (b) => {
                    return openBlock(), createElementBlock("button", {
                      key: b.id,
                      type: "button",
                      class: "bchip",
                      "aria-pressed": String(blood.value === b.id),
                      onClick: ($event) => blood.value = blood.value === b.id ? "any" : b.id
                    }, [
                      createVNode(_sfc_main$p, {
                        colour: b.colour
                      }, null, 8, ["colour"]),
                      createTextVNode(toDisplayString(b.title), 1)
                    ], 8, _hoisted_14$5);
                  }), 128)),
                  createBaseVNode("button", {
                    type: "button",
                    class: "bchip",
                    "aria-pressed": String(blood.value === "none"),
                    onClick: _cache[2] || (_cache[2] = ($event) => blood.value = blood.value === "none" ? "any" : "none")
                  }, "Ничьи клинки", 8, _hoisted_15$5)
                ])
              ]),
              createBaseVNode("p", _hoisted_16$4, [
                createTextVNode(toDisplayString(shown.value.length) + " из " + toDisplayString(unref(items).length) + " ", 1),
                busy.value ? (openBlock(), createElementBlock("button", {
                  key: 0,
                  type: "button",
                  class: "text-btn",
                  onClick: reset
                }, "Сбросить фильтры")) : createCommentVNode("", true)
              ])
            ]),
            withDirectives(createBaseVNode("div", {
              class: "cat-grid",
              role: "listbox",
              "aria-label": "Предметы",
              tabindex: "0",
              onKeydown: onGridKey
            }, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(shown.value, (i) => {
                return openBlock(), createElementBlock("button", {
                  key: i.id,
                  type: "button",
                  role: "option",
                  class: normalizeClass(["catslot", { on: i.id === current.value.id }]),
                  "aria-selected": String(i.id === current.value.id),
                  title: i.name,
                  onClick: ($event) => pick(i.id)
                }, [
                  createBaseVNode("img", {
                    src: i.icon,
                    alt: "",
                    loading: "lazy"
                  }, null, 8, _hoisted_18$3),
                  createBaseVNode("span", _hoisted_19$3, toDisplayString(i.name), 1),
                  i.blood ? (openBlock(), createElementBlock("span", {
                    key: 0,
                    class: "catslot-blood",
                    style: normalizeStyle({ background: unref(bloodOf)[i.blood].colour }),
                    "aria-hidden": "true"
                  }, null, 4)) : createCommentVNode("", true)
                ], 10, _hoisted_17$4);
              }), 128))
            ], 544), [
              [vShow, shown.value.length]
            ]),
            !shown.value.length ? (openBlock(), createElementBlock("div", _hoisted_20$3, [
              _cache[9] || (_cache[9] = createBaseVNode("span", {
                class: "cat-empty-slot",
                "aria-hidden": "true"
              }, null, -1)),
              _cache[10] || (_cache[10] = createBaseVNode("p", null, [
                createBaseVNode("strong", null, "Под такие фильтры не подходит ни один предмет."),
                createBaseVNode("br"),
                createTextVNode("Уберите часть условий или начните заново.")
              ], -1)),
              createBaseVNode("button", {
                type: "button",
                class: "suggest-chip",
                onClick: reset
              }, "Сбросить фильтры")
            ])) : createCommentVNode("", true)
          ]),
          createBaseVNode("article", {
            ref_key: "viewer",
            ref: viewer,
            class: normalizeClass(["cat-view", { stale: !shown.value.length }]),
            style: normalizeStyle(glow.value),
            "aria-live": "polite"
          }, [
            createVNode(_sfc_main$v, {
              item: current.value,
              size: "panel"
            }, null, 8, ["item"]),
            createBaseVNode("header", _hoisted_21$3, [
              createBaseVNode("h3", {
                class: "cv-name paint",
                style: normalizeStyle(unref(rarityStyle)(current.value.rarity))
              }, toDisplayString(current.value.name), 5),
              createBaseVNode("p", _hoisted_22$2, [
                createBaseVNode("span", _hoisted_23$2, [
                  createVNode(_sfc_main$x, {
                    rarity: current.value.rarity
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(current.value.rarityLabel), 1)
                    ]),
                    _: 1
                  }, 8, ["rarity"])
                ]),
                createBaseVNode("span", _hoisted_24$2, toDisplayString(current.value.kind === "weapon" ? "Клинок" : "Материал"), 1),
                owner.value ? (openBlock(), createElementBlock("span", _hoisted_25$2, [
                  createVNode(_sfc_main$p, {
                    colour: owner.value.colour
                  }, null, 8, ["colour"]),
                  createTextVNode(toDisplayString(owner.value.title), 1),
                  current.value.form ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                    createTextVNode(", " + toDisplayString(formText(current.value.form)), 1)
                  ], 64)) : createCommentVNode("", true)
                ])) : current.value.kind === "weapon" ? (openBlock(), createElementBlock("span", _hoisted_26$2, "Любая кровь")) : createCommentVNode("", true)
              ])
            ]),
            plain.value.length ? (openBlock(), createElementBlock("div", _hoisted_27$2, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(plain.value, (l, k) => {
                return openBlock(), createElementBlock("p", {
                  key: k,
                  innerHTML: l
                }, null, 8, _hoisted_28$2);
              }), 128))
            ])) : createCommentVNode("", true),
            current.value.kind === "weapon" ? (openBlock(), createElementBlock("div", _hoisted_29$2, [
              createBaseVNode("div", _hoisted_30$1, [
                _cache[11] || (_cache[11] = createBaseVNode("span", { class: "statbar-label" }, "Урон", -1)),
                createBaseVNode("span", _hoisted_31$1, [
                  createBaseVNode("span", {
                    class: "statbar-fill",
                    style: normalizeStyle({ width: `${Math.round(current.value.damage / MAX.damage * 100)}%` })
                  }, null, 4)
                ]),
                createBaseVNode("b", _hoisted_32$1, toDisplayString(current.value.damage), 1)
              ]),
              createBaseVNode("div", _hoisted_33$1, [
                _cache[12] || (_cache[12] = createBaseVNode("span", { class: "statbar-label" }, "Скорость", -1)),
                createBaseVNode("span", _hoisted_34$1, [
                  createBaseVNode("span", {
                    class: "statbar-fill",
                    style: normalizeStyle({ width: `${Math.round(current.value.speed / MAX.speed * 100)}%` })
                  }, null, 4)
                ]),
                createBaseVNode("b", _hoisted_35$1, toDisplayString(current.value.speed), 1)
              ])
            ])) : createCommentVNode("", true),
            current.value.abilities.length ? (openBlock(), createBlock(_sfc_main$s, {
              key: 2,
              abilities: current.value.abilities
            }, null, 8, ["abilities"])) : createCommentVNode("", true),
            createBaseVNode("div", _hoisted_36$1, [
              createBaseVNode("h4", null, [
                _cache[13] || (_cache[13] = createTextVNode("Как получить ", -1)),
                createBaseVNode("span", {
                  class: normalizeClass(["mbadge", `m-${current.value.method}`])
                }, toDisplayString(current.value.methodLabel), 3)
              ]),
              createBaseVNode("p", {
                innerHTML: current.value.obtain || "Источник описан в разделах ниже."
              }, null, 8, _hoisted_37$1)
            ]),
            createBaseVNode("button", {
              type: "button",
              class: "cv-more",
              onClick: _cache[3] || (_cache[3] = ($event) => unref(openItem)(current.value.id))
            }, "Полная карточка: цены, рецепты, линии →")
          ], 6)
        ])
      ]);
    };
  }
};
const _hoisted_1$b = { id: "craft" };
const _hoisted_2$b = { class: "lead" };
const _hoisted_3$9 = { class: "crafts" };
const _hoisted_4$8 = { class: "methods" };
const _hoisted_5$8 = { class: "muted small" };
const _hoisted_6$8 = { class: "small" };
const _hoisted_7$8 = { class: "mitems" };
const _hoisted_8$8 = ["href", "title"];
const _hoisted_9$8 = ["src"];
const _sfc_main$b = {
  __name: "CraftingSection",
  setup(__props) {
    const ORDER = ["forge", "evolve", "assemble", "grows", "loot", "drop", "trial", "gift", "place", "secret"];
    const HOW = {
      forge: "Правый клик по алтарю святилища → «Выковать».",
      evolve: "Клинок в руке, правый клик по алтарю → «Эволюция».",
      assemble: "Собирается у алтаря святилища.",
      grows: "Меняется сам, когда носитель проходит испытание или поднимает форму крови.",
      loot: "Лежит в сундуках мира.",
      drop: "Падает с босса или сильного моба.",
      trial: "Награда за испытание святилища.",
      gift: "Святилище вручает само, вместе с кровью.",
      place: "Берётся прямо в святилище.",
      secret: "Как их получить — тайна."
    };
    const groups = computed(() => ORDER.map((key) => {
      var _a;
      return {
        key,
        label: (_a = data.items.find((i) => i.method === key)) == null ? void 0 : _a.methodLabel,
        how: HOW[key],
        items: data.items.filter((i) => i.method === key)
      };
    }).filter((g) => g.items.length));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$b, [
        createVNode(_sfc_main$g, {
          title: "Крафт",
          icon: "terra_ingot"
        }, {
          default: withCtx(() => [
            createBaseVNode("p", _hoisted_2$b, "На верстаке делается " + toDisplayString(unref(data).recipes.length) + " вещей. Остальное куют у алтарей святилищ или находят.", 1)
          ]),
          _: 1
        }),
        createBaseVNode("div", _hoisted_3$9, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(data).recipes, (r) => {
            return openBlock(), createBlock(_sfc_main$t, {
              key: r.result,
              recipe: r
            }, null, 8, ["recipe"]);
          }), 128))
        ]),
        _cache[0] || (_cache[0] = createBaseVNode("div", { class: "callout" }, [
          createBaseVNode("b", null, "Клинки пепельной крови на верстаке не делаются."),
          createTextVNode(" Бедствие, Воля Демона, Империум, Убийца демонов, Сборщик душ и Магморос — только эволюция у алтаря Незеритовой кузни. ")
        ], -1)),
        _cache[1] || (_cache[1] = createBaseVNode("div", { class: "callout" }, [
          createBaseVNode("b", null, "Если результат не появляется"),
          createTextVNode(" — проверьте, что предметы плагина настоящие: обычный меч вместо Погибели рецепт не примет. ")
        ], -1)),
        _cache[2] || (_cache[2] = createBaseVNode("h3", { id: "craft-other" }, "Не на верстаке", -1)),
        createBaseVNode("div", _hoisted_4$8, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(groups.value, (g) => {
            return openBlock(), createElementBlock("article", {
              key: g.key,
              class: "method"
            }, [
              createBaseVNode("header", null, [
                createBaseVNode("span", {
                  class: normalizeClass(["mbadge", `m-${g.key}`])
                }, toDisplayString(g.label), 3),
                createBaseVNode("span", _hoisted_5$8, toDisplayString(g.items.length), 1)
              ]),
              createBaseVNode("p", _hoisted_6$8, toDisplayString(g.how), 1),
              createBaseVNode("div", _hoisted_7$8, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(g.items, (i) => {
                  return openBlock(), createElementBlock("a", {
                    key: i.id,
                    href: `#w-${i.id}`,
                    class: "mitem",
                    title: i.obtain
                  }, [
                    createBaseVNode("img", {
                      src: i.icon,
                      alt: ""
                    }, null, 8, _hoisted_9$8),
                    createBaseVNode("span", null, toDisplayString(i.name), 1)
                  ], 8, _hoisted_8$8);
                }), 128))
              ])
            ]);
          }), 128))
        ])
      ]);
    };
  }
};
const _hoisted_1$a = ["aria-label"];
const _hoisted_2$a = { class: "mlabel" };
const _sfc_main$a = {
  __name: "MasteryTrack",
  setup(__props) {
    const marks = data.mastery.map((m, i) => ({ ...m, note: m.note.replace(" клинка", ""), up: i % 2 === 0, star: /★/.test(m.note), big: /пробуждение|предел/.test(m.note) }));
    const root = ref(null);
    const lit = ref(false);
    let observer;
    onMounted(() => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
        lit.value = true;
        return;
      }
      observer = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
          lit.value = true;
          observer.disconnect();
        }
      }, { threshold: 0.5 });
      observer.observe(root.value);
    });
    onBeforeUnmount(() => observer == null ? void 0 : observer.disconnect());
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "root",
        ref: root,
        class: normalizeClass(["mtrack", { lit: lit.value }]),
        role: "img",
        "aria-label": `Мастерство: ${unref(marks).map((m) => `${m.level} — ${m.note || m.bonus}`).join("; ")}`
      }, [
        _cache[1] || (_cache[1] = createBaseVNode("div", { class: "mtrack-rail" }, [
          createBaseVNode("span", { class: "mtrack-fill" })
        ], -1)),
        (openBlock(true), createElementBlock(Fragment, null, renderList(unref(marks), (m) => {
          return openBlock(), createElementBlock("div", {
            key: m.level,
            class: normalizeClass(["mmark", { up: m.up, star: m.star, big: m.big }]),
            style: normalizeStyle({ left: `${m.level}%`, "--delay": `${m.level * 14}ms` })
          }, [
            _cache[0] || (_cache[0] = createBaseVNode("span", { class: "mgem" }, null, -1)),
            createBaseVNode("span", _hoisted_2$a, [
              createBaseVNode("b", null, toDisplayString(m.level), 1),
              createBaseVNode("span", null, toDisplayString(m.note || m.bonus), 1)
            ])
          ], 6);
        }), 128))
      ], 10, _hoisted_1$a);
    };
  }
};
const _hoisted_1$9 = { id: "growth" };
const _hoisted_2$9 = { class: "twocol" };
const _hoisted_3$8 = { class: "panel" };
const _hoisted_4$7 = { class: "tbl" };
const _hoisted_5$7 = { class: "num" };
const _hoisted_6$7 = { class: "num" };
const _hoisted_7$7 = { class: "prices" };
const _hoisted_8$7 = { class: "sets" };
const _hoisted_9$7 = { class: "set set-molten" };
const _hoisted_10$7 = { class: "slot" };
const _hoisted_11$7 = ["src"];
const _hoisted_12$6 = { class: "set set-paladin" };
const _hoisted_13$4 = { class: "slot" };
const _hoisted_14$4 = ["src"];
const _hoisted_15$4 = { class: "set set-nightking" };
const _hoisted_16$3 = { class: "slot" };
const _hoisted_17$3 = ["src"];
const _hoisted_18$2 = { class: "set set-terra" };
const _hoisted_19$2 = { class: "slot" };
const _hoisted_20$2 = ["src"];
const _hoisted_21$2 = { class: "set set-celestial" };
const _hoisted_22$1 = { class: "slot" };
const _hoisted_23$1 = ["src"];
const _hoisted_24$1 = { class: "set set-demon" };
const _hoisted_25$1 = { class: "slot" };
const _hoisted_26$1 = ["src"];
const _hoisted_27$1 = { class: "prices" };
const _hoisted_28$1 = { class: "prices" };
const _hoisted_29$1 = { class: "prices" };
const _sfc_main$9 = {
  __name: "GrowthSection",
  setup(__props) {
    const blades = new Set(data.items.filter((i) => i.kind === "weapon").map((i) => i.id));
    const evolutions = data.altar.filter((a) => a.kind === "evolve" && a.result !== "all_black");
    const forgedAt = (at) => data.altar.filter((a) => a.kind === "forge" && a.at === at && blades.has(a.result));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$9, [
        createVNode(_sfc_main$g, {
          title: "Рост клинка",
          icon: "forge_heart"
        }, {
          default: withCtx(() => [..._cache[0] || (_cache[0] = [
            createBaseVNode("p", { class: "lead" }, "У каждого клинка три дорожки роста; всё записано на самом клинке.", -1)
          ])]),
          _: 1
        }),
        createBaseVNode("div", _hoisted_2$9, [
          createBaseVNode("div", _hoisted_3$8, [
            _cache[2] || (_cache[2] = createBaseVNode("h3", null, "Мастерство 0–100", -1)),
            _cache[3] || (_cache[3] = createBaseVNode("p", { class: "small" }, "Клинок учится от нанесённого урона. Каждый уровень даёт +0,1% урона.", -1)),
            createVNode(_sfc_main$a),
            createBaseVNode("div", _hoisted_4$7, [
              createBaseVNode("table", null, [
                _cache[1] || (_cache[1] = createBaseVNode("thead", null, [
                  createBaseVNode("tr", null, [
                    createBaseVNode("th", null, "Уровень"),
                    createBaseVNode("th", { class: "num" }, "Всего очков"),
                    createBaseVNode("th", { class: "num" }, "Урон"),
                    createBaseVNode("th", null, "Открывает")
                  ])
                ], -1)),
                createBaseVNode("tbody", null, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(unref(data).mastery, (row) => {
                    return openBlock(), createElementBlock("tr", {
                      key: row.level
                    }, [
                      createBaseVNode("td", null, toDisplayString(row.level), 1),
                      createBaseVNode("td", _hoisted_5$7, toDisplayString(row.total), 1),
                      createBaseVNode("td", _hoisted_6$7, toDisplayString(row.bonus), 1),
                      createBaseVNode("td", null, toDisplayString(row.note), 1)
                    ]);
                  }), 128))
                ])
              ])
            ])
          ]),
          _cache[4] || (_cache[4] = createStaticVNode('<div class="panel"><h3>Заточка <span class="stars">★★★★★</span></h3><p class="small">Каждая звезда +4% урона.</p><div class="tbl"><table><thead><tr><th>Звезда</th><th class="num">Мастерство</th><th class="num">Осколки</th><th class="num">Катализатор</th><th>Реликвия</th></tr></thead><tbody><tr><td class="stars">★</td><td class="num">15</td><td class="num">8</td><td class="num">1</td><td>—</td></tr><tr><td class="stars">★★</td><td class="num">30</td><td class="num">16</td><td class="num">2</td><td>—</td></tr><tr><td class="stars">★★★</td><td class="num">45</td><td class="num">24</td><td class="num">3</td><td>—</td></tr><tr><td class="stars">★★★★</td><td class="num">60</td><td class="num">32</td><td class="num">4</td><td>1</td></tr><tr><td class="stars">★★★★★</td><td class="num">75</td><td class="num">40</td><td class="num">5</td><td>1</td></tr></tbody></table></div><p class="small muted">Катализатор: незеритовый лом в кузне, осколки аметиста в Небесном и Тёмном храмах, изумруды в джунглях, медные слитки на фабрике. Небесные клинки точат в Небесном или Тёмном храме, терра-клинки — в Храме джунглей, техноклинки — на Древней фабрике, остальные — в Незеритовой кузне.</p></div><div class="panel"><h3>Пробуждение</h3><p class="small">Один раз за жизнь клинка: нужны заточка ★3, мастерство 50, осколки и реликвия стража.</p><p class="small">Перезарядка способности короче на четверть, урон +5%.</p></div>', 2))
        ]),
        _cache[11] || (_cache[11] = createBaseVNode("h3", null, "Эволюции у алтарей", -1)),
        createBaseVNode("div", _hoisted_7$7, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(evolutions), (e, i) => {
            return openBlock(), createBlock(_sfc_main$q, {
              key: i,
              entry: e,
              boxed: ""
            }, null, 8, ["entry"]);
          }), 128))
        ]),
        _cache[12] || (_cache[12] = createStaticVNode('<p class="small"><a href="#w-all_black">Все-Чёрный</a> — эволюция короны своей крови за Чёрную субстанцию у алтаря своего храма; храм за это гневается.</p><p class="small">Сумрачная секира меняется сама: в испытании кузни она становится <b>Секирой берсерка</b>, в испытании Небесного храма — <b>Золотым фениксом</b>.</p><p class="small muted">Эволюция просит только материалы. Чары, заточка и пробуждение переходят на новую форму, мастерство начинается с нуля.</p><h3>Доспехи</h3><p>Кнопка в правом нижнем углу алтаря открывает экран доспехов. Защиту даёт каждая часть, а <b>бонус</b> — только когда надеты все четыре (у Демонического — уже от двух).</p>', 5)),
        createBaseVNode("div", _hoisted_8$7, [
          createBaseVNode("article", _hoisted_9$7, [
            createBaseVNode("span", _hoisted_10$7, [
              createBaseVNode("img", {
                src: unref(data).icons.molten_helmet,
                alt: ""
              }, null, 8, _hoisted_11$7)
            ]),
            _cache[5] || (_cache[5] = createBaseVNode("div", { class: "set-body" }, [
              createBaseVNode("h4", null, "Расплавленный доспех"),
              createBaseVNode("p", { class: "set-where" }, "Кузня, после третьего испытания: 64 осколка души, незеритовая часть брони и Душа лорда за каждую часть"),
              createBaseVNode("p", { class: "set-bonus" }, "Двойной прыжок в воздухе. Погибель, Бедствие, Воля Демона и Империум бьют на 25% сильнее.")
            ], -1))
          ]),
          createBaseVNode("article", _hoisted_12$6, [
            createBaseVNode("span", _hoisted_13$4, [
              createBaseVNode("img", {
                src: unref(data).icons.paladin_helmet,
                alt: ""
              }, null, 8, _hoisted_14$4)
            ]),
            _cache[6] || (_cache[6] = createBaseVNode("div", { class: "set-body" }, [
              createBaseVNode("h4", null, "Доспех паладина"),
              createBaseVNode("p", { class: "set-where" }, "Небесный храм, с третьей формы небесной или ночной крови: 64 небесных осколка за часть"),
              createBaseVNode("p", { class: "set-bonus" }, "15 секунд без урона — начинается исцеление. Падение с любой высоты не ранит.")
            ], -1))
          ]),
          createBaseVNode("article", _hoisted_15$4, [
            createBaseVNode("span", _hoisted_16$3, [
              createBaseVNode("img", {
                src: unref(data).icons.night_king_helmet,
                alt: ""
              }, null, 8, _hoisted_17$3)
            ]),
            _cache[7] || (_cache[7] = createBaseVNode("div", { class: "set-body" }, [
              createBaseVNode("h4", null, "Доспех Короля ночи"),
              createBaseVNode("p", { class: "set-where" }, "Тёмный храм, после победы над Пустотным Серафимом: часть доспеха паладина, 32 небесных осколка, лазурит и мембраны фантома"),
              createBaseVNode("p", { class: "set-bonus" }, "Всё, что даёт доспех паладина. Ночью, в Незере и в Крае — ещё сила и скорость. Фантомы рядом становятся вашими и бьют ваших врагов.")
            ], -1))
          ]),
          createBaseVNode("article", _hoisted_18$2, [
            createBaseVNode("span", _hoisted_19$2, [
              createBaseVNode("img", {
                src: unref(data).icons.terra_helmet,
                alt: ""
              }, null, 8, _hoisted_20$2)
            ]),
            _cache[8] || (_cache[8] = createBaseVNode("div", { class: "set-body" }, [
              createBaseVNode("h4", null, "Терра-доспех"),
              createBaseVNode("p", { class: "set-where" }, "Не куётся: только из сундуков Истинного Джунглевого голема в Забытом мире"),
              createBaseVNode("p", { class: "set-bonus" }, "+4 сердца. Никакие вредные эффекты не действуют: яд, слабость, замедление и другие.")
            ], -1))
          ]),
          createBaseVNode("article", _hoisted_21$2, [
            createBaseVNode("span", _hoisted_22$1, [
              createBaseVNode("img", {
                src: unref(data).icons.celestial_helmet,
                alt: ""
              }, null, 8, _hoisted_23$1)
            ]),
            _cache[9] || (_cache[9] = createBaseVNode("div", { class: "set-body" }, [
              createBaseVNode("h4", null, "Целестиальный доспех"),
              createBaseVNode("p", { class: "set-where" }, "Не куётся: части выпадают из сундуков Целестиала в Забытом мире"),
              createBaseVNode("p", { class: "set-bonus" }, "+5 сердец, вредные эффекты не действуют, днём под открытым небом — регенерация. Полный комплект раскрывает крылья за спиной.")
            ], -1))
          ]),
          createBaseVNode("article", _hoisted_24$1, [
            createBaseVNode("span", _hoisted_25$1, [
              createBaseVNode("img", {
                src: unref(data).icons.demon_helmet,
                alt: ""
              }, null, 8, _hoisted_26$1)
            ]),
            _cache[10] || (_cache[10] = createBaseVNode("div", { class: "set-body" }, [
              createBaseVNode("h4", null, "Демонический доспех"),
              createBaseVNode("p", { class: "set-where" }, "???"),
              createBaseVNode("p", { class: "set-bonus" }, [
                createBaseVNode("b", null, "Адская ярость"),
                createTextVNode(" (от двух частей). Бейте врагов в ближнем бою — копятся заряды, до 10. Каждый заряд делает удар сильнее на 10% и чуть длиннее, а иногда удар повторяется. На 10 зарядах удар рассекает всех врагов на линии. Перестали бить — заряды тают.")
              ])
            ], -1))
          ])
        ]),
        _cache[13] || (_cache[13] = createBaseVNode("p", { class: "small" }, "Душа лорда остаётся там, где пало Горнило третьего испытания кузни, — одна за победу.", -1)),
        _cache[14] || (_cache[14] = createBaseVNode("h3", null, "Небесная ковка", -1)),
        _cache[15] || (_cache[15] = createBaseVNode("p", null, "Небесные клинки куют у алтаря Небесного храма: небесные осколки, Перо серафима и свой взнос. Золотой феникс вырастает из Сумрачной секиры, Призрачный страж лежит в сокровищнице Проклятого замка, Солнцестояние — в сокровищницах бастионов.", -1)),
        createBaseVNode("div", _hoisted_27$1, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(forgedAt("Небесный храм"), (e, i) => {
            return openBlock(), createBlock(_sfc_main$q, {
              key: i,
              entry: e,
              boxed: ""
            }, null, 8, ["entry"]);
          }), 128))
        ]),
        _cache[16] || (_cache[16] = createBaseVNode("h3", null, "Ночная ковка", -1)),
        _cache[17] || (_cache[17] = createBaseVNode("p", null, [
          createTextVNode("Синие клинки куют в "),
          createBaseVNode("b", null, "Тёмном храме"),
          createTextVNode("; они признают только ночную небесную кровь.")
        ], -1)),
        createBaseVNode("div", _hoisted_28$1, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(forgedAt("Тёмный храм"), (e, i) => {
            return openBlock(), createBlock(_sfc_main$q, {
              key: i,
              entry: e,
              boxed: ""
            }, null, 8, ["entry"]);
          }), 128))
        ]),
        _cache[18] || (_cache[18] = createBaseVNode("h3", null, "Ковка в джунглях", -1)),
        _cache[19] || (_cache[19] = createBaseVNode("p", null, "Эти клинки куёт алтарь Храма джунглей.", -1)),
        createBaseVNode("div", _hoisted_29$1, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(forgedAt("Храм джунглей"), (e, i) => {
            return openBlock(), createBlock(_sfc_main$q, {
              key: i,
              entry: e,
              boxed: ""
            }, null, 8, ["entry"]);
          }), 128))
        ]),
        _cache[20] || (_cache[20] = createBaseVNode("p", { class: "small" }, "Целестиал и Архитектор не куются: их приносят только сундуки Целестиала в Забытом мире, а признают они кровь предков пятой формы.", -1))
      ]);
    };
  }
};
const _hoisted_1$8 = { class: "bossbar-name" };
const _hoisted_2$8 = {
  class: "bossbar-track",
  "aria-hidden": "true"
};
const _hoisted_3$7 = {
  key: 0,
  class: "bossbar-notch"
};
const _sfc_main$8 = {
  __name: "BossBar",
  props: {
    name: { type: String, required: true },
    colour: { type: String, default: "purple" },
    notched: { type: Boolean, default: false }
  },
  setup(__props) {
    const root = ref(null);
    const full = ref(false);
    let observer;
    onMounted(() => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
        full.value = true;
        return;
      }
      observer = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
          full.value = true;
          observer.disconnect();
        }
      }, { threshold: 0.6 });
      observer.observe(root.value);
    });
    onBeforeUnmount(() => observer == null ? void 0 : observer.disconnect());
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "root",
        ref: root,
        class: normalizeClass(["bossbar", [`bb-${__props.colour}`, { full: full.value }]])
      }, [
        createBaseVNode("h4", _hoisted_1$8, toDisplayString(__props.name), 1),
        createBaseVNode("span", _hoisted_2$8, [
          _cache[0] || (_cache[0] = createBaseVNode("span", { class: "bossbar-fill" }, null, -1)),
          __props.notched ? (openBlock(), createElementBlock("span", _hoisted_3$7)) : createCommentVNode("", true)
        ])
      ], 2);
    };
  }
};
const _hoisted_1$7 = { class: "atlas-scroll" };
const _hoisted_2$7 = {
  class: "atlas-svg",
  viewBox: "0 0 1200 640",
  role: "img",
  "aria-labelledby": "atlas-title atlas-desc"
};
const _hoisted_3$6 = ["id"];
const _hoisted_4$6 = ["x", "y", "fill"];
const _hoisted_5$6 = { "clip-path": "url(#clip-ow)" };
const _hoisted_6$6 = ["x", "y", "width", "height"];
const _hoisted_7$6 = ["x", "y", "height"];
const _hoisted_8$6 = ["x", "y"];
const _hoisted_9$6 = ["x", "y"];
const _hoisted_10$6 = { class: "atlas-ruler" };
const _hoisted_11$6 = ["y1", "y2"];
const _hoisted_12$5 = ["y"];
const _hoisted_13$3 = { "clip-path": "url(#clip-ne)" };
const _hoisted_14$3 = ["cx", "cy"];
const _hoisted_15$3 = { class: "atlas-ruler right" };
const _hoisted_16$2 = ["y1", "y2"];
const _hoisted_17$2 = ["y"];
const _hoisted_18$1 = ["href"];
const _hoisted_19$1 = ["transform"];
const _hoisted_20$1 = ["href"];
const _hoisted_21$1 = {
  y: "40",
  class: "pin-label"
};
const _sfc_main$7 = {
  __name: "WorldAtlas",
  setup(__props) {
    function rng(seed) {
      return () => {
        seed |= 0;
        seed = seed + 1831565813 | 0;
        let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
      };
    }
    function tile(id, shades, seed) {
      const r2 = rng(seed), px = [];
      for (let y = 0; y < 16; y += 4) for (let x = 0; x < 16; x += 4) px.push({ x, y, fill: shades[Math.floor(r2() * shades.length)] });
      return { id, px };
    }
    const PATTERNS = [
      tile("pat-grass", ["#4e8a2a", "#5d9c33", "#447a24", "#68a83a"], 1),
      tile("pat-dirt", ["#6b4a2e", "#7a5534", "#5e4027", "#835c39"], 2),
      tile("pat-stone", ["#5f5f66", "#6e6e75", "#545459", "#66666d"], 3),
      tile("pat-deep", ["#3a3a44", "#45454f", "#30303a", "#3f3f49"], 4),
      tile("pat-bedrock", ["#2a2a2a", "#4a4a4a", "#1c1c1c", "#5a5a5a"], 5),
      tile("pat-nether", ["#6e2424", "#7d2b2b", "#5e1d1d", "#8a3434"], 6),
      tile("pat-moss", ["#4f6b44", "#5d7d4f", "#46603d", "#6a8a5a"], 7),
      tile("pat-leaves", ["#2f7a2a", "#3c8f34", "#286a24", "#47a03c"], 8),
      tile("pat-obsidian", ["#1a1028", "#2a1a40", "#140c20", "#24163a"], 9),
      tile("pat-blackstone", ["#24202a", "#2e2934", "#1c1820", "#35303c"], 10)
    ];
    const r = rng(42);
    const stars = Array.from({ length: 46 }, () => ({ x: 372 + r() * 366, y: 6 + r() * 230, s: r() < 0.2 ? 3 : 2, d: (r() * 4).toFixed(2) }));
    const embers = Array.from({ length: 22 }, () => ({ x: 765 + r() * 430, y: 8 + r() * 96, d: (r() * 5).toFixed(2) }));
    const trees = [[56, 236], [96, 222], [262, 230], [300, 244], [326, 228]];
    const PINS = [
      { id: "temple", name: "Небесный храм", x: 210, y: 64, icon: "seraph_feather", colour: "#f5d58a" },
      { id: "night", name: "Тёмный храм", x: 560, y: 64, icon: "night_seal", colour: "#7f8bff" },
      { id: "jungle", name: "Храм джунглей", x: 185, y: 262, icon: "jungle_heart", colour: "#4fd66e" },
      { id: "factory", name: "Древняя фабрика", x: 540, y: 392, icon: "harbinger_core", colour: "#3fd0e0" },
      { id: "terra-trial", name: "Терра-подземелье", x: 246, y: 512, icon: "terra_essence", colour: "#6be36b" },
      { id: "forge", name: "Незеритовая кузня", x: 930, y: 362, icon: "forge_heart", colour: "#ff6a2a" },
      { id: "castle", name: "Проклятый замок", x: 990, y: 52, icon: "black_substance", colour: "#e03a3a" }
    ];
    const icon = (key) => data.icons[key];
    const root = ref(null);
    const idle = ref(true);
    let observer;
    onMounted(() => {
      observer = new IntersectionObserver(([e]) => {
        idle.value = !e.isIntersecting;
      });
      observer.observe(root.value);
    });
    onBeforeUnmount(() => observer == null ? void 0 : observer.disconnect());
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("figure", {
        ref_key: "root",
        ref: root,
        class: normalizeClass(["atlas", { idle: idle.value }])
      }, [
        createBaseVNode("div", _hoisted_1$7, [
          (openBlock(), createElementBlock("svg", _hoisted_2$7, [
            _cache[13] || (_cache[13] = createBaseVNode("title", { id: "atlas-title" }, "Атлас мира", -1)),
            _cache[14] || (_cache[14] = createBaseVNode("desc", { id: "atlas-desc" }, "Разрез мира от неба до крыши Незера с местами всех святилищ.", -1)),
            createBaseVNode("defs", null, [
              (openBlock(), createElementBlock(Fragment, null, renderList(PATTERNS, (p) => {
                return createBaseVNode("pattern", {
                  id: p.id,
                  key: p.id,
                  width: "16",
                  height: "16",
                  patternUnits: "userSpaceOnUse"
                }, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(p.px, (c, i) => {
                    return openBlock(), createElementBlock("rect", {
                      key: i,
                      x: c.x,
                      y: c.y,
                      width: "4",
                      height: "4",
                      fill: c.fill
                    }, null, 8, _hoisted_4$6);
                  }), 128))
                ], 8, _hoisted_3$6);
              }), 64)),
              _cache[0] || (_cache[0] = createStaticVNode('<linearGradient id="sky-day" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d5fb8"></stop><stop offset=".7" stop-color="#7fb3f0"></stop><stop offset="1" stop-color="#bfe0ff"></stop></linearGradient><linearGradient id="sky-night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05040e"></stop><stop offset=".7" stop-color="#151236"></stop><stop offset="1" stop-color="#2a2150"></stop></linearGradient><linearGradient id="sky-nether" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e0406"></stop><stop offset="1" stop-color="#3a0d0d"></stop></linearGradient><linearGradient id="lava" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd25a"></stop><stop offset=".25" stop-color="#ff8a1e"></stop><stop offset="1" stop-color="#c4380c"></stop></linearGradient><radialGradient id="glow-forge"><stop offset="0" stop-color="#ffb347" stop-opacity=".9"></stop><stop offset="1" stop-color="#ff5a2a" stop-opacity="0"></stop></radialGradient><radialGradient id="glow-factory"><stop offset="0" stop-color="#6ff0ff" stop-opacity=".6"></stop><stop offset="1" stop-color="#3fd0e0" stop-opacity="0"></stop></radialGradient><radialGradient id="glow-portal"><stop offset="0" stop-color="#d48bff" stop-opacity=".8"></stop><stop offset="1" stop-color="#8a3cff" stop-opacity="0"></stop></radialGradient><clipPath id="clip-ow"><rect x="0" y="0" width="740" height="640" rx="14"></rect></clipPath><clipPath id="clip-ne"><rect x="760" y="0" width="440" height="640" rx="14"></rect></clipPath>', 9))
            ]),
            createBaseVNode("g", _hoisted_5$6, [
              _cache[2] || (_cache[2] = createBaseVNode("rect", {
                x: "0",
                y: "0",
                width: "370",
                height: "300",
                fill: "url(#sky-day)"
              }, null, -1)),
              _cache[3] || (_cache[3] = createBaseVNode("rect", {
                x: "370",
                y: "0",
                width: "370",
                height: "300",
                fill: "url(#sky-night)"
              }, null, -1)),
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(stars), (s, i) => {
                return openBlock(), createElementBlock("rect", {
                  key: "s" + i,
                  class: "atlas-star",
                  x: s.x,
                  y: s.y,
                  width: s.s,
                  height: s.s,
                  style: normalizeStyle({ animationDelay: `${s.d}s` })
                }, null, 12, _hoisted_6$6);
              }), 128)),
              _cache[4] || (_cache[4] = createStaticVNode('<rect x="34" y="26" width="30" height="30" fill="#fff6b0"></rect><rect x="38" y="30" width="22" height="22" fill="#ffe46a"></rect><rect x="676" y="24" width="26" height="26" fill="#e8ecff"></rect><rect x="684" y="30" width="8" height="8" fill="#c5ccef"></rect><rect x="690" y="40" width="6" height="6" fill="#c5ccef"></rect><g class="atlas-clouds"><g fill="#ffffff" opacity=".92"><rect x="80" y="130" width="64" height="12"></rect><rect x="92" y="122" width="36" height="10"></rect><rect x="250" y="160" width="80" height="12"></rect><rect x="268" y="150" width="40" height="12"></rect></g></g><g class="atlas-clouds night"><g fill="#0b0918" opacity=".9"><rect x="420" y="140" width="90" height="12"></rect><rect x="440" y="130" width="46" height="12"></rect><rect x="600" y="170" width="70" height="12"></rect></g></g><polygon points="134,96 290,96 270,112 236,128 190,128 152,112" fill="url(#pat-dirt)"></polygon><polygon points="150,112 270,112 236,128 190,128" fill="url(#pat-stone)" opacity=".9"></polygon><rect x="134" y="92" width="156" height="6" fill="url(#pat-grass)"></rect><g fill="#f4f1e6"><rect x="170" y="66" width="84" height="6"></rect><rect x="176" y="72" width="8" height="20"></rect><rect x="196" y="72" width="8" height="20"></rect><rect x="218" y="72" width="8" height="20"></rect><rect x="240" y="72" width="8" height="20"></rect><rect x="186" y="58" width="52" height="8"></rect></g><rect x="204" y="50" width="16" height="8" fill="#ffd25a"></rect><polygon points="484,96 640,96 620,112 586,128 540,128 502,112" fill="url(#pat-deep)"></polygon><rect x="484" y="92" width="156" height="6" fill="url(#pat-blackstone)"></rect><g fill="url(#pat-blackstone)"><rect x="522" y="58" width="80" height="34"></rect><rect x="532" y="40" width="14" height="18"></rect><rect x="578" y="40" width="14" height="18"></rect><rect x="552" y="22" width="20" height="36"></rect></g><g fill="#8a7bff" class="atlas-windows"><rect x="558" y="34" width="8" height="8"></rect><rect x="536" y="68" width="6" height="10"></rect><rect x="582" y="68" width="6" height="10"></rect></g><rect x="0" y="300" width="740" height="8" fill="url(#pat-grass)"></rect><rect x="0" y="308" width="740" height="22" fill="url(#pat-dirt)"></rect><rect x="0" y="330" width="740" height="92" fill="url(#pat-stone)"></rect><rect x="0" y="422" width="740" height="156" fill="url(#pat-deep)"></rect><rect x="0" y="578" width="740" height="62" fill="url(#pat-bedrock)"></rect>', 21)),
              (openBlock(), createElementBlock(Fragment, null, renderList(trees, ([x, top], i) => {
                return createBaseVNode("g", {
                  key: "t" + i
                }, [
                  createBaseVNode("rect", {
                    x: x - 3,
                    y: top + 18,
                    width: "6",
                    height: 300 - top - 18,
                    fill: "#5a3b1e"
                  }, null, 8, _hoisted_7$6),
                  createBaseVNode("rect", {
                    x: x - 18,
                    y: top,
                    width: "36",
                    height: "24",
                    fill: "url(#pat-leaves)"
                  }, null, 8, _hoisted_8$6),
                  createBaseVNode("rect", {
                    x: x - 12,
                    y: top - 10,
                    width: "24",
                    height: "12",
                    fill: "url(#pat-leaves)"
                  }, null, 8, _hoisted_9$6)
                ]);
              }), 64)),
              _cache[5] || (_cache[5] = createStaticVNode('<g fill="url(#pat-moss)"><rect x="132" y="284" width="106" height="16"></rect><rect x="144" y="270" width="82" height="14"></rect><rect x="156" y="256" width="58" height="14"></rect><rect x="170" y="244" width="30" height="12"></rect></g><rect x="179" y="286" width="12" height="14" fill="#1a120a"></rect><rect x="626" y="286" width="22" height="14" fill="#6b4a2e"></rect><rect x="622" y="282" width="30" height="5" fill="#835c39"></rect><rect x="634" y="300" width="6" height="30" fill="#140c10"></rect><path d="M412 360 Q420 330 470 328 L640 328 Q690 334 694 372 L690 440 Q640 452 560 452 L460 452 Q414 448 410 420 Z" fill="#100b14"></path><ellipse cx="552" cy="400" rx="150" ry="60" fill="url(#glow-factory)" class="atlas-pulse"></ellipse><g fill="#2f8f99"><rect x="450" y="410" width="40" height="40"></rect><rect x="500" y="388" width="26" height="62"></rect><rect x="536" y="404" width="64" height="46"></rect><rect x="610" y="396" width="34" height="54"></rect></g><g fill="#b06a3a"><rect x="456" y="402" width="28" height="8"></rect><rect x="542" y="396" width="52" height="8"></rect></g><g class="atlas-blink"><rect x="508" y="396" width="10" height="6" fill="#9ff7ff"></rect><rect x="620" y="406" width="10" height="6" fill="#9ff7ff"></rect><rect x="562" y="414" width="12" height="6" fill="#ff5a5a"></rect></g><rect x="634" y="330" width="6" height="22" fill="#140c10"></rect><rect x="244" y="330" width="6" height="140" fill="#1a1414" opacity=".85"></rect><g fill="url(#pat-moss)"><rect x="150" y="470" width="190" height="96"></rect></g><g fill="#151a12"><rect x="160" y="480" width="54" height="34"></rect><rect x="222" y="480" width="54" height="34"></rect><rect x="284" y="480" width="46" height="34"></rect><rect x="160" y="522" width="170" height="36"></rect></g><g fill="#6be36b" class="atlas-blink slow"><rect x="240" y="534" width="10" height="10"></rect></g>', 15)),
              createBaseVNode("g", _hoisted_10$6, [
                _cache[1] || (_cache[1] = createBaseVNode("line", {
                  x1: "12",
                  y1: "64",
                  x2: "12",
                  y2: "600"
                }, null, -1)),
                (openBlock(), createElementBlock(Fragment, null, renderList([[70, "y 200"], [300, "y 64"], [440, "y 0"], [566, "y −60"]], ([y, label]) => {
                  return createBaseVNode("g", { key: label }, [
                    createBaseVNode("line", {
                      x1: "8",
                      y1: y,
                      x2: "20",
                      y2: y
                    }, null, 8, _hoisted_11$6),
                    createBaseVNode("text", {
                      x: "24",
                      y: y + 4
                    }, toDisplayString(label), 9, _hoisted_12$5)
                  ]);
                }), 64))
              ]),
              _cache[6] || (_cache[6] = createBaseVNode("text", {
                x: "20",
                y: "626",
                class: "atlas-world"
              }, "Верхний мир", -1))
            ]),
            createBaseVNode("g", _hoisted_13$3, [
              _cache[8] || (_cache[8] = createBaseVNode("rect", {
                x: "760",
                y: "0",
                width: "440",
                height: "112",
                fill: "url(#sky-nether)"
              }, null, -1)),
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(embers), (e, i) => {
                return openBlock(), createElementBlock("circle", {
                  key: "e" + i,
                  class: "atlas-ember",
                  cx: e.x,
                  cy: e.y,
                  r: "1.6",
                  style: normalizeStyle({ animationDelay: `${e.d}s` })
                }, null, 12, _hoisted_14$3);
              }), 128)),
              _cache[9] || (_cache[9] = createStaticVNode('<g fill="url(#pat-blackstone)"><rect x="910" y="72" width="170" height="40"></rect><rect x="900" y="50" width="24" height="62"></rect><rect x="1066" y="50" width="24" height="62"></rect><rect x="972" y="34" width="46" height="78"></rect></g><g fill="#b3242a"><polygon points="896,50 912,30 928,50"></polygon><polygon points="1062,50 1078,30 1094,50"></polygon><polygon points="966,34 995,8 1024,34"></polygon></g><g fill="#ffcf5a" class="atlas-windows"><rect x="988" y="54" width="14" height="14"></rect><rect x="908" y="70" width="8" height="10"></rect><rect x="1074" y="70" width="8" height="10"></rect></g><rect x="760" y="112" width="440" height="24" fill="url(#pat-bedrock)"></rect><rect x="760" y="136" width="440" height="334" fill="url(#pat-nether)"></rect><rect x="846" y="326" width="168" height="78" fill="#1c0806"></rect><ellipse cx="930" cy="366" rx="110" ry="60" fill="url(#glow-forge)" class="atlas-pulse"></ellipse><g fill="#3a2a26"><rect x="858" y="352" width="10" height="52"></rect><rect x="992" y="352" width="10" height="52"></rect><rect x="916" y="380" width="28" height="12"></rect><rect x="922" y="392" width="16" height="12"></rect></g><rect x="846" y="398" width="168" height="6" fill="#ff8a1e" class="atlas-pulse"></rect><rect x="760" y="470" width="440" height="94" fill="url(#lava)" class="atlas-lava"></rect><rect x="760" y="564" width="440" height="76" fill="url(#pat-bedrock)"></rect>', 11)),
              createBaseVNode("g", _hoisted_15$3, [
                _cache[7] || (_cache[7] = createBaseVNode("line", {
                  x1: "1188",
                  y1: "100",
                  x2: "1188",
                  y2: "600"
                }, null, -1)),
                (openBlock(), createElementBlock(Fragment, null, renderList([[112, "y 128"], [470, "y 31"]], ([y, label]) => {
                  return createBaseVNode("g", { key: label }, [
                    createBaseVNode("line", {
                      x1: "1180",
                      y1: y,
                      x2: "1194",
                      y2: y
                    }, null, 8, _hoisted_16$2),
                    createBaseVNode("text", {
                      x: "1176",
                      y: y + 4,
                      "text-anchor": "end"
                    }, toDisplayString(label), 9, _hoisted_17$2)
                  ]);
                }), 64))
              ]),
              _cache[10] || (_cache[10] = createBaseVNode("text", {
                x: "1180",
                y: "626",
                class: "atlas-world",
                "text-anchor": "end"
              }, "Незер", -1))
            ]),
            _cache[15] || (_cache[15] = createBaseVNode("g", { class: "atlas-portal" }, [
              createBaseVNode("ellipse", {
                cx: "750",
                cy: "320",
                rx: "60",
                ry: "90",
                fill: "url(#glow-portal)",
                class: "atlas-pulse"
              }),
              createBaseVNode("rect", {
                x: "726",
                y: "250",
                width: "48",
                height: "140",
                fill: "url(#pat-obsidian)"
              }),
              createBaseVNode("rect", {
                x: "734",
                y: "258",
                width: "32",
                height: "124",
                fill: "#7a2bd6",
                class: "atlas-portal-face"
              })
            ], -1)),
            (openBlock(), createElementBlock(Fragment, null, renderList(PINS, (p) => {
              return createBaseVNode("a", {
                key: p.id,
                href: `#${p.id}`,
                class: "pin",
                style: normalizeStyle({ "--pin": p.colour })
              }, [
                createBaseVNode("g", {
                  transform: `translate(${p.x} ${p.y})`
                }, [
                  _cache[11] || (_cache[11] = createBaseVNode("circle", {
                    r: "26",
                    class: "pin-glow"
                  }, null, -1)),
                  _cache[12] || (_cache[12] = createBaseVNode("rect", {
                    x: "-15",
                    y: "-15",
                    width: "30",
                    height: "30",
                    rx: "4",
                    transform: "rotate(45)",
                    class: "pin-gem"
                  }, null, -1)),
                  createBaseVNode("image", {
                    href: icon(p.icon),
                    x: "-11",
                    y: "-11",
                    width: "22",
                    height: "22",
                    class: "pin-icon"
                  }, null, 8, _hoisted_20$1),
                  createBaseVNode("text", _hoisted_21$1, toDisplayString(p.name), 1)
                ], 8, _hoisted_19$1)
              ], 12, _hoisted_18$1);
            }), 64))
          ]))
        ]),
        _cache[16] || (_cache[16] = createBaseVNode("figcaption", null, "Разрез мира: небо, земля, недра и Незер. Нажмите на святилище, чтобы перейти к нему.", -1))
      ], 2);
    };
  }
};
const _hoisted_1$6 = { id: "sanctums" };
const _hoisted_2$6 = { class: "guides" };
const _hoisted_3$5 = { class: "guide-card" };
const _hoisted_4$5 = { class: "guide-card" };
const _hoisted_5$5 = { class: "guide-card" };
const _hoisted_6$5 = { class: "guide-card" };
const _hoisted_7$5 = {
  class: "guide-item",
  "aria-hidden": "true"
};
const _hoisted_8$5 = ["src"];
const _hoisted_9$5 = { class: "guide-card" };
const _hoisted_10$5 = { class: "guide-card" };
const _hoisted_11$5 = {
  class: "guide-item",
  "aria-hidden": "true"
};
const _hoisted_12$4 = ["src"];
const _hoisted_13$2 = {
  class: "sanctum",
  id: "forge"
};
const _hoisted_14$2 = ["src"];
const _hoisted_15$2 = { class: "sanctum-body" };
const _hoisted_16$1 = { class: "sanctum-info" };
const _hoisted_17$1 = { class: "kv" };
const _hoisted_18 = { class: "inline-icons" };
const _hoisted_19 = ["src"];
const _hoisted_20 = ["src"];
const _hoisted_21 = { class: "boss" };
const _hoisted_22 = {
  class: "sanctum",
  id: "temple"
};
const _hoisted_23 = ["src"];
const _hoisted_24 = { class: "sanctum-body" };
const _hoisted_25 = { class: "sanctum-info" };
const _hoisted_26 = { class: "kv" };
const _hoisted_27 = { class: "inline-icons" };
const _hoisted_28 = ["src"];
const _hoisted_29 = ["src"];
const _hoisted_30 = ["src"];
const _hoisted_31 = { class: "boss" };
const _hoisted_32 = {
  class: "sanctum",
  id: "jungle"
};
const _hoisted_33 = ["src"];
const _hoisted_34 = { class: "sanctum-body" };
const _hoisted_35 = { class: "sanctum-info" };
const _hoisted_36 = { class: "kv" };
const _hoisted_37 = { class: "inline-icons" };
const _hoisted_38 = ["src"];
const _hoisted_39 = ["src"];
const _hoisted_40 = { class: "boss" };
const _hoisted_41 = {
  class: "sanctum",
  id: "night"
};
const _hoisted_42 = ["src"];
const _hoisted_43 = { class: "sanctum-body" };
const _hoisted_44 = { class: "sanctum-info" };
const _hoisted_45 = { class: "kv" };
const _hoisted_46 = { class: "inline-icons" };
const _hoisted_47 = ["src"];
const _hoisted_48 = { class: "boss" };
const _hoisted_49 = {
  class: "sanctum",
  id: "factory"
};
const _hoisted_50 = ["src"];
const _hoisted_51 = { class: "sanctum-body" };
const _hoisted_52 = { class: "sanctum-info" };
const _hoisted_53 = { class: "kv" };
const _hoisted_54 = { class: "inline-icons" };
const _hoisted_55 = ["src"];
const _hoisted_56 = ["src"];
const _hoisted_57 = { class: "boss" };
const _hoisted_58 = {
  class: "sanctum",
  id: "castle"
};
const _hoisted_59 = ["src"];
const _hoisted_60 = { class: "sanctum-body" };
const _hoisted_61 = { class: "sanctum-info" };
const _hoisted_62 = { class: "kv" };
const _hoisted_63 = { class: "inline-icons" };
const _hoisted_64 = ["src"];
const _hoisted_65 = ["src"];
const _hoisted_66 = ["src"];
const _hoisted_67 = { class: "boss" };
const _hoisted_68 = { class: "boss" };
const _hoisted_69 = { class: "attacks" };
const _hoisted_70 = { class: "inline-icons" };
const _hoisted_71 = ["src"];
const _hoisted_72 = ["src"];
const _hoisted_73 = {
  class: "sanctum",
  id: "wanderer-cube"
};
const _hoisted_74 = { class: "terra-figure cube-figure" };
const _hoisted_75 = { class: "cube-row" };
const _hoisted_76 = ["src", "alt"];
const _hoisted_77 = { class: "sanctum-body" };
const _hoisted_78 = { class: "sanctum-info" };
const _hoisted_79 = { class: "kv" };
const _hoisted_80 = { class: "inline-icons" };
const _hoisted_81 = ["src"];
const _hoisted_82 = ["src"];
const _hoisted_83 = {
  class: "sanctum",
  id: "terra-trial"
};
const _hoisted_84 = { class: "terra-figure" };
const _hoisted_85 = ["src"];
const _hoisted_86 = { class: "sanctum-body" };
const _hoisted_87 = { class: "sanctum-info" };
const _hoisted_88 = { class: "kv" };
const _hoisted_89 = { class: "inline-icons" };
const _hoisted_90 = ["src"];
const _hoisted_91 = { class: "inline-icons" };
const _hoisted_92 = ["src"];
const _hoisted_93 = { class: "inline-icons" };
const _hoisted_94 = ["src"];
const _hoisted_95 = ["src"];
const _hoisted_96 = ["src"];
const _hoisted_97 = {
  class: "stack",
  style: { "align-content": "start" }
};
const _hoisted_98 = { class: "boss" };
const _hoisted_99 = {
  class: "sanctum",
  id: "forgotten-world"
};
const _hoisted_100 = { class: "terra-figure" };
const _hoisted_101 = ["src"];
const _hoisted_102 = { class: "sanctum-body" };
const _hoisted_103 = { class: "sanctum-info" };
const _hoisted_104 = { class: "kv" };
const _hoisted_105 = { class: "inline-icons" };
const _hoisted_106 = ["src"];
const _hoisted_107 = ["src"];
const _hoisted_108 = ["src"];
const _hoisted_109 = { class: "inline-icons" };
const _hoisted_110 = ["src"];
const _hoisted_111 = ["src"];
const _hoisted_112 = ["src"];
const _hoisted_113 = { class: "inline-icons" };
const _hoisted_114 = ["src"];
const _hoisted_115 = ["src"];
const _hoisted_116 = ["src"];
const _hoisted_117 = ["src"];
const _hoisted_118 = ["src"];
const _hoisted_119 = ["src"];
const _hoisted_120 = ["src"];
const _hoisted_121 = ["src"];
const _hoisted_122 = ["src"];
const _hoisted_123 = ["src"];
const _hoisted_124 = { class: "inline-icons" };
const _hoisted_125 = ["src"];
const _hoisted_126 = ["src"];
const _hoisted_127 = ["src"];
const _hoisted_128 = ["src"];
const _hoisted_129 = ["src"];
const _hoisted_130 = ["src"];
const _hoisted_131 = ["src"];
const _hoisted_132 = ["src"];
const _hoisted_133 = ["src"];
const _hoisted_134 = ["src"];
const _hoisted_135 = ["src"];
const _hoisted_136 = ["src"];
const _hoisted_137 = {
  class: "stack",
  style: { "align-content": "start" }
};
const _hoisted_138 = { class: "boss" };
const _hoisted_139 = { class: "boss" };
const _sfc_main$6 = {
  __name: "SanctumsSection",
  setup(__props) {
    const recipe = (key) => data.recipes.find((r) => r.result === key);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$6, [
        createVNode(_sfc_main$g, {
          title: "Святилища",
          icon: "night_seal"
        }, {
          default: withCtx(() => [..._cache[0] || (_cache[0] = [
            createBaseVNode("p", { class: "lead" }, "Пять построек, каждая — в единственном экземпляре. Внутри ничего нельзя ломать и строить.", -1),
            createBaseVNode("p", { class: "lead" }, [
              createBaseVNode("b", null, "Внутри нет чужих"),
              createTextVNode(": обычные мобы не появляются.")
            ], -1),
            createBaseVNode("p", { class: "lead" }, [
              createBaseVNode("b", null, "Храмы кочуют"),
              createTextVNode(": опустевшее святилище исчезает и встаёт в другом месте. Древняя фабрика стоит на месте, Тёмный храм приходит только ночью.")
            ], -1)
          ])]),
          _: 1
        }),
        createVNode(_sfc_main$7),
        _cache[126] || (_cache[126] = createStaticVNode('<div class="flow" aria-label="Путь через святилище"><div class="step"><b>Вход</b><span>туннель, ступени или ворота</span></div><span class="to" aria-hidden="true">→</span><div class="step"><b>Три комнаты</b><span>в каждой стража; с неё падают осколки</span></div><span class="to" aria-hidden="true">→</span><div class="step"><b>Алтарь</b><span>откроется, когда падёт вся стража: эволюция, заточка, испытания</span></div><span class="to" aria-hidden="true">→</span><div class="step"><b>Арена</b><span>испытание: пять волн, в пятой — страж</span></div></div><h3>Пять святилищ коротко</h3><div class="tbl"><table><thead><tr><th>Святилище</th><th>Где</th><th>Чем искать</th><th>Страж</th><th>Кочует</th><th>Кровь</th></tr></thead><tbody><tr><th scope="row"><a href="#forge">Незеритовая кузня</a></th><td>Незер, в толще незерака</td><td>Карта кузни</td><td>Горнило</td><td>да</td><td>пепельная</td></tr><tr><th scope="row"><a href="#temple">Небесный храм</a></th><td>верхний мир, остров на высоте 200</td><td>Компас воздуха</td><td>Серафим Падшего Рассвета</td><td>да, и рушится от Печати ночи</td><td>небесная</td></tr><tr><th scope="row"><a href="#jungle">Храм джунглей</a></th><td>джунгли</td><td>Карта джунглей</td><td>Древний страж джунглей</td><td>да</td><td>предков</td></tr><tr><th scope="row"><a href="#night">Тёмный храм</a></th><td>верхний мир, только ночью</td><td>Ночной компас</td><td>Пустотный Серафим (призыв)</td><td>каждую ночь на новом месте</td><td>ночная небесная</td></tr><tr><th scope="row"><a href="#factory">Древняя фабрика</a></th><td>глубоко под землёй</td><td>Неизвестный компас</td><td>Предвестник</td><td>нет</td><td>техноорганическая</td></tr></tbody></table></div><h3>Как найти святилище</h3><p>Каждое святилище ищется своим предметом. Компас ведёт к храму, где бы тот ни стоял; карта показывает место, где святилище стояло, когда её сделали.</p>', 5)),
        createBaseVNode("div", _hoisted_2$6, [
          createBaseVNode("div", _hoisted_3$5, [
            createVNode(_sfc_main$t, {
              recipe: recipe("g:air_compass"),
              small: ""
            }, null, 8, ["recipe"]),
            _cache[1] || (_cache[1] = createBaseVNode("div", null, [
              createBaseVNode("h4", null, "Компас воздуха"),
              createBaseVNode("p", { class: "small muted" }, "Указывает на маяк Врат ветра под Небесным храмом.")
            ], -1))
          ]),
          createBaseVNode("div", _hoisted_4$5, [
            createVNode(_sfc_main$t, {
              recipe: recipe("g:forge_map"),
              small: ""
            }, null, 8, ["recipe"]),
            _cache[2] || (_cache[2] = createBaseVNode("div", null, [
              createBaseVNode("h4", null, "Карта кузни"),
              createBaseVNode("p", { class: "small muted" }, "Отмечает Незеритовую кузню.")
            ], -1))
          ]),
          createBaseVNode("div", _hoisted_5$5, [
            createVNode(_sfc_main$t, {
              recipe: recipe("g:jungle_map"),
              small: ""
            }, null, 8, ["recipe"]),
            _cache[3] || (_cache[3] = createBaseVNode("div", null, [
              createBaseVNode("h4", null, "Карта джунглей"),
              createBaseVNode("p", { class: "small muted" }, "Отмечает Храм джунглей.")
            ], -1))
          ]),
          createBaseVNode("div", _hoisted_6$5, [
            createBaseVNode("div", _hoisted_7$5, [
              createBaseVNode("img", {
                src: unref(data).guideIcons.unknown_compass,
                alt: ""
              }, null, 8, _hoisted_8$5)
            ]),
            _cache[4] || (_cache[4] = createBaseVNode("div", null, [
              createBaseVNode("h4", null, "Неизвестный компас"),
              createBaseVNode("p", { class: "small" }, [
                createTextVNode("Лежит в сундуках "),
                createBaseVNode("b", null, "заброшенных шахт"),
                createTextVNode(" и "),
                createBaseVNode("b", null, "древних городов"),
                createTextVNode(".")
              ]),
              createBaseVNode("p", { class: "small muted" }, "Ведёт к Древней фабрике.")
            ], -1))
          ]),
          createBaseVNode("div", _hoisted_9$5, [
            createVNode(_sfc_main$t, {
              recipe: recipe("g:night_compass"),
              small: ""
            }, null, 8, ["recipe"]),
            _cache[5] || (_cache[5] = createBaseVNode("div", null, [
              createBaseVNode("h4", null, "Ночной компас"),
              createBaseVNode("p", { class: "small muted" }, "Указывает на Тёмный храм, пока тот стоит.")
            ], -1))
          ]),
          createBaseVNode("div", _hoisted_10$5, [
            createBaseVNode("div", _hoisted_11$5, [
              createBaseVNode("img", {
                src: unref(data).icons.terra_compass,
                alt: ""
              }, null, 8, _hoisted_12$4)
            ]),
            _cache[6] || (_cache[6] = createBaseVNode("div", null, [
              createBaseVNode("h4", null, "Терра-компас"),
              createBaseVNode("p", { class: "small" }, [
                createTextVNode("Собирает "),
                createBaseVNode("b", null, "кровь предков"),
                createTextVNode(" у алтаря Храма джунглей.")
              ]),
              createBaseVNode("p", { class: "small muted" }, "Ведёт к Терра-подземелью.")
            ], -1))
          ])
        ]),
        createBaseVNode("article", _hoisted_13$2, [
          createBaseVNode("figure", null, [
            _cache[7] || (_cache[7] = createBaseVNode("span", {
              class: "figure-title",
              "aria-hidden": "true"
            }, "Незеритовая кузня", -1)),
            createBaseVNode("img", {
              src: unref(data).images.forge,
              alt: "Незеритовая кузня: вид снаружи, разрез и план"
            }, null, 8, _hoisted_14$2),
            _cache[8] || (_cache[8] = createBaseVNode("figcaption", null, "Снаружи · разрез · план", -1))
          ]),
          createBaseVNode("div", _hoisted_15$2, [
            createBaseVNode("div", _hoisted_16$1, [
              _cache[13] || (_cache[13] = createBaseVNode("div", { class: "sanctum-title" }, [
                createBaseVNode("h3", null, "Незеритовая кузня"),
                createBaseVNode("span", { class: "pill" }, "Незер")
              ], -1)),
              createBaseVNode("dl", _hoisted_17$1, [
                _cache[12] || (_cache[12] = createStaticVNode("<div><dt>Где</dt><dd>в Незере, внутри скалы</dd></div><div><dt>Внутри</dt><dd>вестибюль, кузнечный зал, арена и алтарная</dd></div><div><dt>Стража</dt><dd>скелеты-иссушители, ифриты, пиглины-громилы</dd></div><div><dt>Алтарь</dt><dd>испытания, эволюции, заточка и четвёртая форма пепельной крови</dd></div>", 4)),
                createBaseVNode("div", null, [
                  _cache[11] || (_cache[11] = createBaseVNode("dt", null, "Добыча", -1)),
                  createBaseVNode("dd", _hoisted_18, [
                    createBaseVNode("img", {
                      src: unref(data).icons.soul_shard,
                      alt: ""
                    }, null, 8, _hoisted_19),
                    _cache[9] || (_cache[9] = createTextVNode("Осколки души · ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.forge_heart,
                      alt: ""
                    }, null, 8, _hoisted_20),
                    _cache[10] || (_cache[10] = createTextVNode("Сердце кузни", -1))
                  ])
                ])
              ])
            ]),
            createBaseVNode("div", _hoisted_21, [
              createVNode(_sfc_main$8, {
                name: "Горнило, кузнец Преисподней",
                colour: "red"
              }),
              _cache[14] || (_cache[14] = createStaticVNode('<div class="boss-stats"><span class="pill">400 здоровья</span><span class="pill">урон 7</span><span class="pill">броня 12</span><span class="pill">скелет-иссушитель</span></div><ul class="attacks"><li><b>Молот.</b> Прыгает к игроку; место посадки светится — уходите из круга, а после посадки бейте.</li><li><b>Огненное кольцо.</b> Катится по полу от босса — перепрыгивайте.</li><li><b>Извержение.</b> Из оранжевых кругов под бойцами бьёт лава — выйдите из них.</li><li><b>Искры горна.</b> Пол в шахматку: сначала вспыхивает одна половина клеток, потом другая — стойте на тёмных.</li><li><b>Фаза 2 · Раскалённый металл (60%).</b> Кольцо катится дважды, один раз приходят подмастерья. <b>Клеймо</b>: метка на двух бойцах взрывается вокруг них через 5 секунд — разойдитесь.</li><li><b>Фаза 3 · Переплавка (30%).</b> Быстрее и сильнее. Лава съедает арену от края, пока не останется круг в 8 блоков.</li></ul>', 2))
            ])
          ])
        ]),
        createBaseVNode("article", _hoisted_22, [
          createBaseVNode("figure", null, [
            _cache[15] || (_cache[15] = createBaseVNode("span", {
              class: "figure-title",
              "aria-hidden": "true"
            }, "Небесный храм", -1)),
            createBaseVNode("img", {
              src: unref(data).images.temple,
              alt: "Небесный храм: вид снаружи, разрез и план"
            }, null, 8, _hoisted_23),
            _cache[16] || (_cache[16] = createBaseVNode("figcaption", null, "Снаружи · разрез · план", -1))
          ]),
          createBaseVNode("div", _hoisted_24, [
            createBaseVNode("div", _hoisted_25, [
              _cache[22] || (_cache[22] = createBaseVNode("div", { class: "sanctum-title" }, [
                createBaseVNode("h3", null, "Небесный храм"),
                createBaseVNode("span", { class: "pill" }, "верхний мир")
              ], -1)),
              createBaseVNode("dl", _hoisted_26, [
                _cache[21] || (_cache[21] = createStaticVNode("<div><dt>Где</dt><dd>летающий остров высоко в небе</dd></div><div><dt>Внутри</dt><dd>колоннада, неф с колокольнями и ротонда с алтарём</dd></div><div><dt>Путь наверх</dt><dd>поток ветра у Врат ветра</dd></div><div><dt>Стража</dt><dd>зимогоры и поборники в золоте</dd></div><div><dt>Алтарь</dt><dd>испытания, ковка, заточка и пробуждение небесных клинков</dd></div>", 5)),
                createBaseVNode("div", null, [
                  _cache[20] || (_cache[20] = createBaseVNode("dt", null, "Добыча", -1)),
                  createBaseVNode("dd", _hoisted_27, [
                    createBaseVNode("img", {
                      src: unref(data).icons.celestial_shard,
                      alt: ""
                    }, null, 8, _hoisted_28),
                    _cache[17] || (_cache[17] = createTextVNode("Небесные осколки · ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.seraph_feather,
                      alt: ""
                    }, null, 8, _hoisted_29),
                    _cache[18] || (_cache[18] = createTextVNode("Перо серафима · ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.night_seal,
                      alt: ""
                    }, null, 8, _hoisted_30),
                    _cache[19] || (_cache[19] = createTextVNode("Печать ночи", -1))
                  ])
                ])
              ])
            ]),
            createBaseVNode("div", _hoisted_31, [
              createVNode(_sfc_main$8, {
                name: "Серафим Падшего Рассвета",
                colour: "white"
              }),
              _cache[23] || (_cache[23] = createStaticVNode('<div class="boss-stats"><span class="pill">450 здоровья</span><span class="pill">броня 8</span><span class="pill">иллюзор</span></div><ul class="attacks"><li><b>Печать ночи.</b> Падает с него в третьем испытании.</li><li><b>Суд.</b> В столбы света бьёт молния — выйдите из света.</li><li><b>Перья.</b> На золотые кольца падает залп стрел — выйдите из кольца.</li><li><b>Фаза 2 · Полдень (66%).</b> Сначала <b>Щит рассвета</b>: неуязвим, пока живы призванные стражи. Потом <b>Зенит</b>: солнце бьёт всех, кого видит, — прячьтесь в тень колонн.</li><li><b>Фаза 3 · Закат (33%).</b> <b>Падший нимб</b>: четыре осколка над двором лечат Серафима — сбивайте их луком. Суд падает очередью из шести столбов — уходите вбок.</li><li><b>Лучи рассвета.</b> Лучи обходят его кругом — перепрыгивайте их.</li><li><b>Мерцание.</b> Переносится по двору.</li></ul>', 2))
            ])
          ])
        ]),
        createBaseVNode("article", _hoisted_32, [
          createBaseVNode("figure", null, [
            _cache[24] || (_cache[24] = createBaseVNode("span", {
              class: "figure-title",
              "aria-hidden": "true"
            }, "Храм джунглей", -1)),
            createBaseVNode("img", {
              src: unref(data).images.jungle,
              alt: "Храм джунглей: вид снаружи, разрез, план залов и план лабиринта"
            }, null, 8, _hoisted_33),
            _cache[25] || (_cache[25] = createBaseVNode("figcaption", null, "Снаружи · разрез · план залов · лабиринт", -1))
          ]),
          createBaseVNode("div", _hoisted_34, [
            createBaseVNode("div", _hoisted_35, [
              _cache[30] || (_cache[30] = createBaseVNode("div", { class: "sanctum-title" }, [
                createBaseVNode("h3", null, "Храм джунглей"),
                createBaseVNode("span", { class: "pill" }, "джунгли")
              ], -1)),
              createBaseVNode("dl", _hoisted_36, [
                _cache[29] || (_cache[29] = createStaticVNode("<div><dt>Где</dt><dd>ступенчатая пирамида в джунглях</dd></div><div><dt>Внутри</dt><dd>большой зал, арена и алтарная комната</dd></div><div><dt>Стража</dt><dd>болотники, пещерные пауки, пауки, ведьмы</dd></div><div><dt>Алтарь</dt><dd>испытания, ковка Терра-блейда и эволюция в Энигму, ключи Забытого мира, заточка и пробуждение терра-клинков, третья форма крови предков за Терра-сущность</dd></div>", 4)),
                createBaseVNode("div", null, [
                  _cache[28] || (_cache[28] = createBaseVNode("dt", null, "Добыча", -1)),
                  createBaseVNode("dd", _hoisted_37, [
                    createBaseVNode("img", {
                      src: unref(data).icons.jungle_shard,
                      alt: ""
                    }, null, 8, _hoisted_38),
                    _cache[26] || (_cache[26] = createTextVNode("Реликтовые осколки · ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.jungle_heart,
                      alt: ""
                    }, null, 8, _hoisted_39),
                    _cache[27] || (_cache[27] = createTextVNode("Сердце джунглей", -1))
                  ])
                ])
              ])
            ]),
            createBaseVNode("div", _hoisted_40, [
              createVNode(_sfc_main$8, {
                name: "Древний страж джунглей",
                colour: "green"
              }),
              _cache[31] || (_cache[31] = createStaticVNode('<div class="boss-stats"><span class="pill">550 здоровья</span><span class="pill">урон 16</span><span class="pill">броня 10</span><span class="pill">разоритель</span></div><ul class="attacks"><li><b>Землетрясение.</b> Подбрасывает всех на земле рядом.</li><li><b>Корни.</b> Под бойцами сжимаются зелёные кольца — выйдите из них, пока из пола не вырвались корни.</li><li><b>Споры.</b> Ядовитое облако вокруг босса — успейте выйти.</li><li><b>Таран.</b> Мчится по зелёной линии — сойдите с неё; врезавшись в стену, уязвим.</li><li><b>Фаза 2 · Цветение (65%).</b> Зовёт обитателей храма. В углах распускаются цветы и лечат стража — постойте на цветке 3 секунды, и он завянет.</li><li><b>Фаза 3 · Гон (30%).</b> Таранит чаще и оставляет стены корней. Таран в стену оглушает стража.</li></ul>', 2))
            ])
          ])
        ]),
        createBaseVNode("article", _hoisted_41, [
          createBaseVNode("figure", null, [
            _cache[32] || (_cache[32] = createBaseVNode("span", {
              class: "figure-title",
              "aria-hidden": "true"
            }, "Тёмный храм", -1)),
            createBaseVNode("img", {
              src: unref(data).images.night,
              alt: "Тёмный храм: вид снаружи, разрез и план"
            }, null, 8, _hoisted_42),
            _cache[33] || (_cache[33] = createBaseVNode("figcaption", null, "Снаружи · разрез · план", -1))
          ]),
          createBaseVNode("div", _hoisted_43, [
            createBaseVNode("div", _hoisted_44, [
              _cache[37] || (_cache[37] = createBaseVNode("div", { class: "sanctum-title" }, [
                createBaseVNode("h3", null, "Тёмный храм"),
                createBaseVNode("span", { class: "pill" }, "только ночью")
              ], -1)),
              createBaseVNode("dl", _hoisted_45, [
                _cache[36] || (_cache[36] = createStaticVNode("<div><dt>Когда</dt><dd>после того как сломали Печать ночи — каждую ночь в новом месте</dd></div><div><dt>Какой</dt><dd>тёмная тень Небесного храма</dd></div><div><dt>Стража</dt><dd>стражи полуночи</dd></div><div><dt>Алтарь</dt><dd>ночная ковка, заточка, призыв Пустотного Серафима</dd></div>", 4)),
                createBaseVNode("div", null, [
                  _cache[35] || (_cache[35] = createBaseVNode("dt", null, "Добыча", -1)),
                  createBaseVNode("dd", _hoisted_46, [
                    createBaseVNode("img", {
                      src: unref(data).icons.celestial_shard,
                      alt: ""
                    }, null, 8, _hoisted_47),
                    _cache[34] || (_cache[34] = createTextVNode("Небесные осколки со стражи и с Пустотного Серафима", -1))
                  ])
                ])
              ])
            ]),
            createBaseVNode("div", _hoisted_48, [
              createVNode(_sfc_main$8, {
                name: "Пустотный Серафим",
                colour: "purple"
              }),
              _cache[38] || (_cache[38] = createStaticVNode('<div class="boss-stats"><span class="pill">700 здоровья</span><span class="pill">урон 13</span><span class="pill">броня 10</span><span class="pill">эндермен</span></div><ul class="attacks"><li><b>Призыв.</b> Его зовут на алтаре. Призвавшему ночной крови третьей формы победа даёт четвёртую форму.</li><li><b>Щит ударов.</b> Снимается числом ударов, а не силой.</li><li><b>Головы пустоты.</b> Пока живы головы, Серафим получает меньше урона — фиолетовые нити ведут к ним.</li><li><b>Глиф.</b> Встаньте в круг упавшего маяка, иначе взрыв.</li><li><b>Лучи разбитого сердца.</b> Лучи обходят его кругом — прыгайте.</li><li><b>Шаг сквозь пустоту.</b> Встаёт за спиной — выйдите из кольца.</li><li><b>Фазы.</b> Головы пустоты (70%) — щит и головы. <b>Изнанка</b> (40%) — тень повторяет Глиф и Шаг зеркально через центр зала. <b>Сингулярность</b> (15%) — чёрная дыра тянет к центру, держитесь дальше восьми блоков.</li></ul>', 2))
            ])
          ])
        ]),
        createBaseVNode("article", _hoisted_49, [
          createBaseVNode("figure", null, [
            _cache[39] || (_cache[39] = createBaseVNode("span", {
              class: "figure-title",
              "aria-hidden": "true"
            }, "Древняя фабрика", -1)),
            createBaseVNode("img", {
              src: unref(data).images.factory,
              alt: "Древняя фабрика: пещера без потолка, разрез и план"
            }, null, 8, _hoisted_50),
            _cache[40] || (_cache[40] = createBaseVNode("figcaption", null, "Пещера без потолка · разрез · план", -1))
          ]),
          createBaseVNode("div", _hoisted_51, [
            createBaseVNode("div", _hoisted_52, [
              _cache[45] || (_cache[45] = createBaseVNode("div", { class: "sanctum-title" }, [
                createBaseVNode("h3", null, "Древняя фабрика"),
                createBaseVNode("span", { class: "pill" }, "под землёй")
              ], -1)),
              createBaseVNode("dl", _hoisted_53, [
                _cache[44] || (_cache[44] = createStaticVNode("<div><dt>Где</dt><dd>глубоко под землёй. Путь укажет Неизвестный компас</dd></div><div><dt>Внутри</dt><dd>огромный цех: погрузочный и сборочный залы, реактор и пульт управления</dd></div><div><dt>Стража</dt><dd>автоматоны и летучие дроны</dd></div><div><dt>Терминал</dt><dd>запуск Предвестника, рейды, техноорганический вирус, сборка машин</dd></div>", 4)),
                createBaseVNode("div", null, [
                  _cache[43] || (_cache[43] = createBaseVNode("dt", null, "Добыча", -1)),
                  createBaseVNode("dd", _hoisted_54, [
                    createBaseVNode("img", {
                      src: unref(data).icons.ancient_part,
                      alt: ""
                    }, null, 8, _hoisted_55),
                    _cache[41] || (_cache[41] = createTextVNode("Древние детали · ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.harbinger_core,
                      alt: ""
                    }, null, 8, _hoisted_56),
                    _cache[42] || (_cache[42] = createTextVNode("Ядро Предвестника", -1))
                  ])
                ])
              ])
            ]),
            createBaseVNode("div", _hoisted_57, [
              createVNode(_sfc_main$8, {
                name: "Предвестник",
                colour: "blue"
              }),
              _cache[46] || (_cache[46] = createStaticVNode('<div class="boss-stats"><span class="pill">600 здоровья</span><span class="pill">урон 18</span><span class="pill">броня 14</span><span class="pill">железный голем</span></div><ul class="attacks"><li><b>Запуск.</b> В первый раз встаёт сам, потом его запускают на терминале.</li><li><b>Павшим вход закрыт</b> до конца боя.</li><li><b>Луч смерти.</b> Красная линия желтеет и стреляет — сойдите с неё или спрячьтесь за стену.</li><li><b>Ракеты.</b> Падают в оранжевые кольца.</li><li><b>Магнитный импульс.</b> Тянет к себе и разряжается — бегите против тяги, после разряда бейте.</li><li><b>Фаза 2 · Протокол сноса (65%).</b> Зовёт дронов. Сектора пола мигают по очереди, потом взрываются в том же порядке — запомните путь.</li><li><b>Фаза 3 · Перегрузка (30%).</b> Быстрее, бьёт током всех рядом. Лучи греют его; перегревшись, он остывает 4 секунды, и урон по нему двойной.</li></ul>', 2))
            ])
          ])
        ]),
        createBaseVNode("article", _hoisted_58, [
          createBaseVNode("figure", null, [
            _cache[47] || (_cache[47] = createBaseVNode("span", {
              class: "figure-title",
              "aria-hidden": "true"
            }, "Проклятый замок", -1)),
            createBaseVNode("img", {
              src: unref(data).images.castle,
              alt: "Проклятый замок на бедроковой крыше Незера"
            }, null, 8, _hoisted_59),
            _cache[48] || (_cache[48] = createBaseVNode("figcaption", null, "Замок на бедроковой крыше Незера", -1))
          ]),
          createBaseVNode("div", _hoisted_60, [
            createBaseVNode("div", _hoisted_61, [
              _cache[54] || (_cache[54] = createBaseVNode("div", { class: "sanctum-title" }, [
                createBaseVNode("h3", null, "Проклятый замок"),
                createBaseVNode("span", { class: "pill" }, "крыша Незера")
              ], -1)),
              createBaseVNode("dl", _hoisted_62, [
                _cache[53] || (_cache[53] = createStaticVNode("<div><dt>Как найти</dt><dd>с третьей формы крови: на крыше Незера нажмите ПКМ Душой демона — она полетит к замку, как око Края. Замок встаёт к северу, воротами к вам</dd></div><div><dt>Где</dt><dd>на крыше Незера; один на сервер</dd></div><div><dt>Исчезает</dt><dd>опустевший замок растворяется, следующая душа найдёт новый. Король пробуждается в замке лишь однажды</dd></div><div><dt>Город</dt><dd>дома, рынок и таверна подданных короля</dd></div><div><dt>Жители</dt><dd>пока король жив, в замке появляются пиглины</dd></div><div><dt>Часовая башня</dt><dd>в атриуме висит Адская сущность; её охраняют Стражи пекла. Пока жив хоть один, поле не подпускает. В инвентаре сущность поджигает носителя. Наверху — Зал маятника: люк к нему открывается, только когда сущность взята</dd></div><div><dt>Донжон</dt><dd>большой зал, библиотека, спальня и тронный зал</dd></div><div><dt>Стража</dt><dd>пиглины-громилы и чемпионы: Мечники Бедствия и Берсерки короля</dd></div>", 8)),
                createBaseVNode("div", null, [
                  _cache[52] || (_cache[52] = createBaseVNode("dt", null, "Добыча", -1)),
                  createBaseVNode("dd", _hoisted_63, [
                    createBaseVNode("img", {
                      src: unref(data).icons.black_substance,
                      alt: ""
                    }, null, 8, _hoisted_64),
                    _cache[49] || (_cache[49] = createTextVNode("Чёрная субстанция в рамке над троном · ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.hell_essence,
                      alt: ""
                    }, null, 8, _hoisted_65),
                    _cache[50] || (_cache[50] = createTextVNode("Адская сущность в часовой башне · Призрачный страж в сокровищнице · ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.royal_clock,
                      alt: ""
                    }, null, 8, _hoisted_66),
                    _cache[51] || (_cache[51] = createTextVNode("Королевские часы и Шестерня вспять с Хронарха · сундуки с сокровищами", -1))
                  ])
                ])
              ])
            ]),
            createBaseVNode("div", _hoisted_67, [
              createVNode(_sfc_main$8, {
                name: "Проклятый король",
                colour: "red"
              }),
              _cache[55] || (_cache[55] = createStaticVNode('<div class="boss-stats"><span class="pill">1200 здоровья</span><span class="pill">урон 10</span><span class="pill">броня 12</span><span class="pill">пиглин-громила</span></div><ul class="attacks"><li><b>Тронный зал.</b> Колонны — укрытие от указа. Пока король жив, субстанцию не снять; потом её достаёт любой, встав на трон.</li><li><b>Акт I. Удар короны.</b> Выйдите из золотого веера или зайдите за спину.</li><li><b>Рывок.</b> Несётся по золотой линии, потом уязвим.</li><li><b>Золото.</b> В круги рушится золото.</li><li><b>Указ.</b> Тянет к ногам всех на виду — спасают расстояние и колонны.</li><li><b>Бросок топора.</b> Топор летит по золотой дорожке и возвращается — сойдите с неё.</li><li><b>Поступь.</b> По полу бегут золотые волны — перепрыгивайте.</li><li><b>Акт II. Золотой бастион.</b> Жаровни гаснут. Король на троне под щитом, который считает удары, — бейте часто. С ворот идёт подмога, с трона летят копья.</li><li><b>Акт III. Проклятие короны.</b> Ярость. <b>Проклятие</b> жжёт края зала — бегите в середину. <b>Казнь</b>: прыгает на самого слабого. В центр зала падает <b>люстра-корона</b> и горит огненным кольцом до конца боя.</li><li><b>Рог.</b> В третьем акте весь замок бежит в тронный зал. Когда король падает, его народ теряет волю.</li><li><b>Дань.</b> Подданные в зале лечат короля — бейте сначала их.</li></ul>', 2))
            ]),
            createBaseVNode("div", _hoisted_68, [
              createVNode(_sfc_main$8, {
                name: "Хронарх",
                colour: "yellow"
              }),
              _cache[61] || (_cache[61] = createStaticVNode('<div class="boss-stats"><span class="pill">800 здоровья</span><span class="pill">броня 12</span><span class="pill">бродяга с часами вместо головы</span><span class="pill">Зал маятника</span></div>', 1)),
              createBaseVNode("ul", _hoisted_69, [
                _cache[60] || (_cache[60] = createStaticVNode("<li><b>Путь.</b> Верх часовой башни. Люк над лестницей откроется, только когда Адская сущность взята.</li><li><b>Застывшее время.</b> На полу открываются три поля: в них вы медленны и не можете прыгать — обходите их.</li><li><b>Стрелки.</b> Две стрелки часов обходят его кругом — перепрыгивайте, но не из поля.</li><li><b>Бой часов.</b> Двенадцать часов на полу бьют по очереди по кругу.</li><li><b>Фаза 2 · Так (60%).</b> <b>Перемотка</b> возвращает всех на золотые метки. <b>Обратный отсчёт</b>: помеченным — под маятник за 8 секунд.</li><li><b>Фаза 3 · Полночь (25%).</b> Время стоит для всех, кроме одного: Хронарх нападает только на него и не трогает застывших. Он уязвим — бейте его; удары застывших его не ранят, а сбежать из полночи жемчугом или Шестернёй нельзя.</li>", 6)),
                createBaseVNode("li", _hoisted_70, [
                  _cache[56] || (_cache[56] = createBaseVNode("b", null, "Добыча.", -1)),
                  _cache[57] || (_cache[57] = createTextVNode()),
                  createBaseVNode("img", {
                    src: unref(data).icons.royal_clock,
                    alt: ""
                  }, null, 8, _hoisted_71),
                  _cache[58] || (_cache[58] = createTextVNode("Королевские часы и ", -1)),
                  createBaseVNode("img", {
                    src: unref(data).icons.rewind_gear,
                    alt: ""
                  }, null, 8, _hoisted_72),
                  _cache[59] || (_cache[59] = createTextVNode("Шестерня вспять.", -1))
                ])
              ])
            ])
          ])
        ]),
        createBaseVNode("article", _hoisted_73, [
          createBaseVNode("figure", _hoisted_74, [
            createBaseVNode("div", _hoisted_75, [
              (openBlock(), createElementBlock(Fragment, null, renderList(["green", "blue", "orange", "purple", "red", "gray"], (c) => {
                return createBaseVNode("img", {
                  key: c,
                  src: unref(data).icons["wanderer_cube_" + c],
                  alt: c
                }, null, 8, _hoisted_76);
              }), 64))
            ]),
            _cache[62] || (_cache[62] = createBaseVNode("figcaption", null, "Цвет Тессеракта подсказывает, что он сделает", -1))
          ]),
          createBaseVNode("div", _hoisted_77, [
            createBaseVNode("div", _hoisted_78, [
              _cache[68] || (_cache[68] = createBaseVNode("div", { class: "sanctum-title" }, [
                createBaseVNode("h3", null, "Тессеракт"),
                createBaseVNode("span", { class: "pill" }, "любая кровь")
              ], -1)),
              createBaseVNode("dl", _hoisted_79, [
                createBaseVNode("div", null, [
                  _cache[66] || (_cache[66] = createBaseVNode("dt", null, "Крафт", -1)),
                  createBaseVNode("dd", _hoisted_80, [
                    _cache[63] || (_cache[63] = createTextVNode("верстак: ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.terra_essence,
                      alt: ""
                    }, null, 8, _hoisted_81),
                    _cache[64] || (_cache[64] = createTextVNode("Терра-сущность, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.hell_essence,
                      alt: ""
                    }, null, 8, _hoisted_82),
                    _cache[65] || (_cache[65] = createTextVNode("Адская сущность, звезда Незера и плачущий обсидиан", -1))
                  ])
                ]),
                _cache[67] || (_cache[67] = createStaticVNode("<div><dt>Как работает</dt><dd>правый клик; что он сделает, видно по цвету</dd></div><div><dt>Красный</dt><dd>вы стоите в чужом куполе — Сделке с дьяволом, Сборочном куполе или Огненном эдикте (Мировое Господство Тессеракту не по силам) — либо рядом с тем, кто вытянул чужую Луну: тессеракт развеивает это</dd></div><div><dt>Зелёный</dt><dd>здоровье не полное: лечит вас и своих рядом</dd></div><div><dt>Голубой</dt><dd>полное здоровье, обычный мир: перенос к случайному храму</dd></div><div><dt>Оранжевый</dt><dd>полное здоровье, Незер: перенос к Незеритовой кузне</dd></div><div><dt>Фиолетовый</dt><dd>полное здоровье, Энд: перенос к точке возрождения</dd></div><div><dt>Перенос</dt><dd>забирает всех живых рядом, кроме боссов и осколков Падшего нимба; из арены испытания и из Забытого мира не уводит. Если перенос сорвался, тессеракт не тратится</dd></div>", 7))
              ])
            ])
          ])
        ]),
        _cache[127] || (_cache[127] = createBaseVNode("div", { class: "prose small" }, [
          createBaseVNode("p", null, [
            createBaseVNode("b", null, "Королевские часы"),
            createTextVNode(" работают как тотем бессмертия и, спасая от смерти, ненадолго останавливают время вокруг. "),
            createBaseVNode("b", null, "Шестерня вспять"),
            createTextVNode(" возвращает туда, где вы стояли 5 секунд назад, со здоровьем, какое было тогда; перезарядка 3 минуты.")
          ])
        ], -1)),
        createBaseVNode("article", _hoisted_83, [
          createBaseVNode("figure", _hoisted_84, [
            createBaseVNode("img", {
              src: unref(data).icons.terra_essence,
              alt: "Терра-сущность"
            }, null, 8, _hoisted_85),
            _cache[69] || (_cache[69] = createBaseVNode("figcaption", null, "Терра-сущность", -1))
          ]),
          createBaseVNode("div", _hoisted_86, [
            createBaseVNode("div", _hoisted_87, [
              _cache[82] || (_cache[82] = createBaseVNode("div", { class: "sanctum-title" }, [
                createBaseVNode("h3", null, "Терра-подземелье"),
                createBaseVNode("span", { class: "pill" }, "под землёй")
              ], -1)),
              createBaseVNode("dl", _hoisted_88, [
                createBaseVNode("div", null, [
                  _cache[71] || (_cache[71] = createBaseVNode("dt", null, "Как найти", -1)),
                  createBaseVNode("dd", _hoisted_89, [
                    createBaseVNode("img", {
                      src: unref(data).icons.terra_compass,
                      alt: ""
                    }, null, 8, _hoisted_90),
                    _cache[70] || (_cache[70] = createTextVNode("Терра-компас; копайте к шахте, на которую он указывает", -1))
                  ])
                ]),
                _cache[80] || (_cache[80] = createStaticVNode("<div><dt>Где</dt><dd>верхний мир, глубоко под землёй; одно на сервер</dd></div><div><dt>Исчезает</dt><dd>когда все игроки его покинули; вернётся через 7 игровых суток в другом месте</dd></div><div><dt>Загадки</dt><dd>рычаги, кнопки и ловушки; дальний зал открывается загадками</dd></div><div><dt>Библиотека</dt><dd>лабиринт стеллажей; присмотритесь к рычагам под сводом</dd></div><div><dt>Разбойники</dt><dd>выходят с постов в залах, когда вы подходите</dd></div><div><dt>Всадники апокалипсиса</dt><dd>Война и Смерть в зале свечей; пока жив хоть один, голем спит</dd></div><div><dt>Терра-сущность в зале</dt><dd>появляется, когда голем пал; забрать — подойти к ней</dd></div><div><dt>Когда сущность взята</dt><dd>из мха лезут болотники — 70 за всё время: 20 в зале голема и 50 в остальных комнатах</dd></div>", 8)),
                createBaseVNode("div", null, [
                  _cache[74] || (_cache[74] = createBaseVNode("dt", null, "Путь в Забытый мир", -1)),
                  createBaseVNode("dd", _hoisted_91, [
                    _cache[72] || (_cache[72] = createTextVNode("голем пал и сущность взята — поверните в его зале ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.forgotten_key_moss,
                      alt: ""
                    }, null, 8, _hoisted_92),
                    _cache[73] || (_cache[73] = createTextVNode("ключ Забытого мира (ПКМ): за сущностью ляжет платформа для всех", -1))
                  ])
                ]),
                _cache[81] || (_cache[81] = createBaseVNode("div", null, [
                  createBaseVNode("dt", null, "Терра-сущность"),
                  createBaseVNode("dd", null, "в инвентаре отравляет носителя, кроме крови предков и техноорганической")
                ], -1)),
                createBaseVNode("div", null, [
                  _cache[79] || (_cache[79] = createBaseVNode("dt", null, "Бочки", -1)),
                  createBaseVNode("dd", _hoisted_93, [
                    _cache[75] || (_cache[75] = createTextVNode("в одной из них — ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.ancient,
                      alt: ""
                    }, null, 8, _hoisted_94),
                    _cache[76] || (_cache[76] = createTextVNode("Шёпот Древнего Леса; в остальных осколки, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.terra_ingot,
                      alt: ""
                    }, null, 8, _hoisted_95),
                    _cache[77] || (_cache[77] = createTextVNode("терра-слитки, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.demon_soul,
                      alt: ""
                    }, null, 8, _hoisted_96),
                    _cache[78] || (_cache[78] = createTextVNode("Душа демона и припасы", -1))
                  ])
                ])
              ])
            ]),
            createBaseVNode("div", _hoisted_97, [
              createBaseVNode("div", _hoisted_98, [
                createVNode(_sfc_main$8, {
                  name: "Джунглевый голем",
                  colour: "green"
                }),
                _cache[83] || (_cache[83] = createStaticVNode('<div class="boss-stats"><span class="pill">900 здоровья</span><span class="pill">7 блоков ростом</span><span class="pill">большой зал</span></div><ul class="attacks"><li><b>Сотрясение.</b> Выйдите из зелёного круга или подпрыгните.</li><li><b>Валун.</b> Уйдите со светящегося диска.</li><li><b>Плеть.</b> Сойдите с линии лоз.</li><li><b>Мох-панцирь (60%).</b> Щит из мха считает удары, а не урон. Когда голем заносит кулаки, его спина открыта: удар сзади снимает сразу три удара щита.</li><li><b>Ярость (30%).</b> Быстрее, оставляет ядовитые споры, валун раскалывается на три осколка.</li><li><b>Награда.</b> Терра-слитки и Терра-сущность.</li></ul>', 2))
              ]),
              _cache[84] || (_cache[84] = createStaticVNode('<div class="boss"><div class="boss-name">Шёпот Древнего Леса</div><div class="boss-stats"><span class="pill">лук крови предков, вторая форма</span></div><ul class="attacks"><li><b>Ядовитый шип.</b> Любая стрела из лука отравляет.</li><li><b>Сплетение корней.</b> 5 секунд натяжения — зелёный луч связывает врагов: урон по одному получают все.</li><li><b>Где взять.</b> В бочке Терра-подземелья.</li></ul></div>', 1))
            ])
          ])
        ]),
        _cache[128] || (_cache[128] = createBaseVNode("div", { class: "prose small" }, [
          createBaseVNode("p", null, "Каждый, кто бился со стражем, получает свою долю добычи. Пали все бойцы — страж уходит.")
        ], -1)),
        createBaseVNode("article", _hoisted_99, [
          createBaseVNode("figure", _hoisted_100, [
            createBaseVNode("img", {
              src: unref(data).icons.forgotten_key,
              alt: "Ключ Забытого мира"
            }, null, 8, _hoisted_101),
            _cache[85] || (_cache[85] = createBaseVNode("figcaption", null, "Ключ Забытого мира", -1))
          ]),
          createBaseVNode("div", _hoisted_102, [
            createBaseVNode("div", _hoisted_103, [
              _cache[123] || (_cache[123] = createBaseVNode("div", { class: "sanctum-title" }, [
                createBaseVNode("h3", null, "Забытый мир"),
                createBaseVNode("span", { class: "pill" }, "отдельный мир")
              ], -1)),
              createBaseVNode("dl", _hoisted_104, [
                createBaseVNode("div", null, [
                  _cache[89] || (_cache[89] = createBaseVNode("dt", null, "Ключи", -1)),
                  createBaseVNode("dd", _hoisted_105, [
                    createBaseVNode("img", {
                      src: unref(data).icons.forgotten_key_moss,
                      alt: ""
                    }, null, 8, _hoisted_106),
                    _cache[86] || (_cache[86] = createTextVNode("Только кровь предков. Джунглевый — с 3-й формы: 8 терра-слитков и по 16 осколков души, небесных и реликтовых; внизу Истинный Джунглевый голем. ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.forgotten_key,
                      alt: ""
                    }, null, 8, _hoisted_107),
                    _cache[87] || (_cache[87] = createTextVNode("Целестиальный — с 4-й формы: 16 терра-слитков, по 64 осколка каждого вида и ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.jungle_heart,
                      alt: ""
                    }, null, 8, _hoisted_108),
                    _cache[88] || (_cache[88] = createTextVNode("Сердце джунглей; внизу Целестиал. Оба куются у алтаря Храма джунглей", -1))
                  ])
                ]),
                _cache[121] || (_cache[121] = createStaticVNode("<div><dt>Вход</dt><dd>в Терра-подземелье: когда Джунглевый голем пал и Терра-сущность взята, ключ поворачивают в его зале (ПКМ, ключ тратится) — за Терра-сущностью ложится платформа, её видят все; отсчёт 10 секунд, в мир уходят все, кто на ней стоит</dd></div><div><dt>Отряд</dt><dd>чем больше игроков, тем больше мобов в комнатах, тем они крепче, быстрее и сильнее; боссы — +40% здоровья и +10% урона за каждого игрока сверх первого</dd></div><div><dt>Как в данжах Skyblock</dt><dd>комнаты со звёздными ✯ мобами, Двери Иссушения и Кровавая дверь открываются ключами, которые носят хранители комнат; тайники — сундуки на уступах и летучие мыши под сводами</dd></div><div><dt>Ключи дверей</dt><dd>общие на весь отряд: подобрал один — ключ сразу у каждого в инвентаре, а двери, которые им можно открыть прямо сейчас, подсвечиваются сквозь стены — Двери Иссушения чёрным, Кровавая дверь красным</dd></div><div><dt>Мобы</dt><dd>бьют сильнее и бегают быстрее обычных, не уходят из своей комнаты и не превращаются (зомби в воде не станет утопленником) — ключ с хранителя не теряется</dd></div><div><dt>Без полёта</dt><dd>весь путь, все хранители и тайники проходятся с двойным прыжком; на высокие уступы ведут колонны лиан</dd></div><div><dt>Карта</dt><dd>в 9-м слоте: запертые, открытые и зачищенные комнаты, двери и отряд</dd></div><div><dt>Головоломка</dt><dd>«Три чудака»: правду говорит только один — откройте его сундук</dd></div><div><dt>Кровавая комната</dt><dd>в Библиотеке Наблюдатель призывает кровавые копии боссов мира; когда все пали — открывается путь вниз</dd></div><div><dt>Смерть</dt><dd>вы становитесь призраком до зачистки следующей комнаты; вещи не теряются; Камень возрождения из тайника возвращает призрака сразу</dd></div><div><dt>Выход с сервера</dt><dd>как смерть: вышедший — призрак отряда; зашёл, пока забег идёт, — снова в данже призраком, и его можно оживить; после победы над боссом возвращается живым</dd></div><div><dt>Мимик</dt><dd>иногда сундук-тайник оказывается мини-боссом</dd></div><div><dt>Благословения</dt><dd>в тайниках — Силы, Жизни или Камня: на весь отряд до конца прохода</dd></div><div><dt>Оценка</dt><dd>навык, исследование, скорость и бонус — от D до S+; от неё зависят наградные сундуки</dd></div>", 14)),
                createBaseVNode("div", null, [
                  _cache[96] || (_cache[96] = createBaseVNode("dt", null, "Награда", -1)),
                  createBaseVNode("dd", _hoisted_109, [
                    _cache[90] || (_cache[90] = createTextVNode("не меньше трёх сундуков: деревянный бесплатно и один платный на выбор за осколки своей крови (небесная и ночная — ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.celestial_shard,
                      alt: ""
                    }, null, 8, _hoisted_110),
                    _cache[91] || (_cache[91] = createTextVNode("небесные, пепельная — ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.soul_shard,
                      alt: ""
                    }, null, 8, _hoisted_111),
                    _cache[92] || (_cache[92] = createTextVNode("осколки души, остальные — ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.jungle_shard,
                      alt: ""
                    }, null, 8, _hoisted_112),
                    _cache[93] || (_cache[93] = createTextVNode("реликтовые), в любом порядке. Внутри осколки всех видов, терра-слитки и призы ", -1)),
                    _cache[94] || (_cache[94] = createBaseVNode("b", null, "своей крови", -1)),
                    _cache[95] || (_cache[95] = createTextVNode(" из пула босса, без ограничения числа — чем выше форма, с которой предмет отвечает, тем реже", -1))
                  ])
                ]),
                createBaseVNode("div", null, [
                  _cache[107] || (_cache[107] = createBaseVNode("dt", null, "Сундуки голема", -1)),
                  createBaseVNode("dd", _hoisted_113, [
                    createBaseVNode("img", {
                      src: unref(data).icons.bouquet_of_lies,
                      alt: ""
                    }, null, 8, _hoisted_114),
                    _cache[97] || (_cache[97] = createTextVNode("Букет лжи, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.solstice,
                      alt: ""
                    }, null, 8, _hoisted_115),
                    _cache[98] || (_cache[98] = createTextVNode("Солнцестояние, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.hyperion,
                      alt: ""
                    }, null, 8, _hoisted_116),
                    _cache[99] || (_cache[99] = createTextVNode("Hyperion, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.demon_slayer,
                      alt: ""
                    }, null, 8, _hoisted_117),
                    _cache[100] || (_cache[100] = createTextVNode("Убийца демонов, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.cutter,
                      alt: ""
                    }, null, 8, _hoisted_118),
                    _cache[101] || (_cache[101] = createTextVNode("Резак, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.twilight_axe,
                      alt: ""
                    }, null, 8, _hoisted_119),
                    _cache[102] || (_cache[102] = createTextVNode("Сумрачная секира, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.terra_helmet,
                      alt: ""
                    }, null, 8, _hoisted_120),
                    _cache[103] || (_cache[103] = createTextVNode("Терра-доспех (чаще обычного); пепельной крови ещё ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.arachnid,
                      alt: ""
                    }, null, 8, _hoisted_121),
                    _cache[104] || (_cache[104] = createTextVNode("Арахнид, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.demon_soul,
                      alt: ""
                    }, null, 8, _hoisted_122),
                    _cache[105] || (_cache[105] = createTextVNode("Душа демона и ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.crimson,
                      alt: ""
                    }, null, 8, _hoisted_123),
                    _cache[106] || (_cache[106] = createTextVNode("Кримсон", -1))
                  ])
                ]),
                createBaseVNode("div", null, [
                  _cache[120] || (_cache[120] = createBaseVNode("dt", null, "Сундуки Целестиала", -1)),
                  createBaseVNode("dd", _hoisted_124, [
                    createBaseVNode("img", {
                      src: unref(data).icons.bouquet_of_lies,
                      alt: ""
                    }, null, 8, _hoisted_125),
                    _cache[108] || (_cache[108] = createTextVNode("Букет лжи, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.berserker_axe,
                      alt: ""
                    }, null, 8, _hoisted_126),
                    _cache[109] || (_cache[109] = createTextVNode("Секира берсерка, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.golden_phoenix,
                      alt: ""
                    }, null, 8, _hoisted_127),
                    _cache[110] || (_cache[110] = createTextVNode("Золотой феникс, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.soul_collector,
                      alt: ""
                    }, null, 8, _hoisted_128),
                    _cache[111] || (_cache[111] = createTextVNode("Сборщик душ, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.crimson,
                      alt: ""
                    }, null, 8, _hoisted_129),
                    _cache[112] || (_cache[112] = createTextVNode("Кримсон, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.phantom_guard,
                      alt: ""
                    }, null, 8, _hoisted_130),
                    _cache[113] || (_cache[113] = createTextVNode("Призрачный страж, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.night_fury,
                      alt: ""
                    }, null, 8, _hoisted_131),
                    _cache[114] || (_cache[114] = createTextVNode("Ночная фурия, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.celestial,
                      alt: ""
                    }, null, 8, _hoisted_132),
                    _cache[115] || (_cache[115] = createTextVNode("Целестиал, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.architect,
                      alt: ""
                    }, null, 8, _hoisted_133),
                    _cache[116] || (_cache[116] = createTextVNode("Архитектор, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.celestial_helmet,
                      alt: ""
                    }, null, 8, _hoisted_134),
                    _cache[117] || (_cache[117] = createTextVNode("Целестиальный доспех (чаще обычного), ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.wither_soul,
                      alt: ""
                    }, null, 8, _hoisted_135),
                    _cache[118] || (_cache[118] = createTextVNode("Душа Иссушителя, карты таро, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.terra_magnet,
                      alt: ""
                    }, null, 8, _hoisted_136),
                    _cache[119] || (_cache[119] = createTextVNode("Терра-магнит (чаще обычного)", -1))
                  ])
                ]),
                _cache[122] || (_cache[122] = createBaseVNode("div", null, [
                  createBaseVNode("dt", null, "Формы предков"),
                  createBaseVNode("dd", null, "проход с Джунглевым ключом на оценку S или S+ поднимает кровь предков с третьей формы до четвёртой, с Целестиальным — с четвёртой до пятой; ниже S форма не растёт")
                ], -1))
              ])
            ]),
            createBaseVNode("div", _hoisted_137, [
              createBaseVNode("div", _hoisted_138, [
                createVNode(_sfc_main$8, {
                  name: "Истинный Джунглевый голем",
                  colour: "green"
                }),
                _cache[124] || (_cache[124] = createStaticVNode('<div class="boss-stats"><span class="pill">1300 здоровья</span><span class="pill">≈11–13 блоков ростом</span><span class="pill">за Джунглевым ключом</span></div><ul class="attacks"><li><b>Двойное сотрясение.</b> Два зелёных круга один за другим: уйдите из обоих или будьте в воздухе.</li><li><b>Камнепад.</b> Валун в каждого из трёх бойцов, каждый раскалывается на три.</li><li><b>Плети.</b> Лозы к трём бойцам тянут к голему — сойдите с линии.</li><li><b>Терновое кольцо.</b> Три кольца шипов по полу — перепрыгните каждое.</li><li><b>Корневая темница.</b> Круг под вами: не ушли — три секунды в корнях.</li><li><b>Споровый ливень.</b> Споровые круги: яд и замедление.</li><li><b>Мох-панцирь (66%, 33%).</b> Щит из ударов и болотники; удар в спину во время сотрясения снимает три.</li><li><b>Истинная форма (33%).</b> Голем растёт; четыре цветка под люстрами лечат его — затопчите их.</li></ul>', 2))
              ]),
              createBaseVNode("div", _hoisted_139, [
                createVNode(_sfc_main$8, {
                  name: "Целестиал",
                  colour: "yellow"
                }),
                _cache[125] || (_cache[125] = createStaticVNode('<div class="boss-stats"><span class="pill">1100 здоровья</span><span class="pill">≈19 блоков ростом</span><span class="pill">пещера под библиотекой</span></div><ul class="attacks"><li><b>Звёздные нити.</b> Сойдите с красных линий, пока они не вспыхнули.</li><li><b>Небесная паутина.</b> Уйдите из фиолетового круга: внутри сильное замедление.</li><li><b>Взмах крыльев.</b> Волна по полу — перепрыгните её.</li><li><b>Небесный разрез.</b> Красный конус перед ним; после разреза он открыт.</li><li><b>Звёздная сеть (60%).</b> Звездопад по золотым кругам и стражи света; звезда, попавшая по игроку, поднимает моба данжа.</li><li><b>Затмение (30%).</b> Он за щитом: зажгите четыре фиолетовых круга под люстрами, стоя в каждом, — щит падает, урон по нему двойной. Пока круги не зажжены, каждые 3 секунды прилетает вредина.</li><li><b>Ближний бой.</b> Его обычные удары слабее, а способности бьют больно — уворачивайтесь.</li></ul>', 2))
              ])
            ])
          ])
        ]),
        _cache[129] || (_cache[129] = createStaticVNode('<h3>Платформа готовности</h3><div class="prose"><p>Перед испытанием, рейдом, призывом босса или боем с королём, Хронархом и големом там, где встанет босс, на полу появляется <b style="color:#4f9cff;">голубая платформа</b> 4 × 5 блоков. Встаньте на неё: в центре экрана пойдёт отсчёт от 5 до 1, платформа станет <b style="color:#4fe06a;">зелёной</b>. Встал ещё кто-то или кто-то сошёл — отсчёт начинается заново, а платформа на миг вспыхивает <b style="color:#ff3a3a;">красным</b>.</p><p>Бой, за который заплатили, ждёт создателя комнаты — без него отсчёт не начнётся («Ждём создателя комнаты...» над хотбаром). Все, кто стоял на платформе, — бойцы этого боя: кто сбежал из святилища или вышел с сервера, считается погибшим. Неначатая платформа исчезает через 5 минут и возвращает плату.</p></div><h3>Как читать бой</h3><div class="prose"><p>У всех боссов один язык знаков на полу: <b style="color:#ff4d5e;">красный</b> — уйдите, <b style="color:#ffc24a;">жёлтый</b> — прыгайте или двигайтесь, <b style="color:#b77bff;">фиолетовый</b> — встаньте внутрь, <b style="color:#4fe08a;">зелёный</b> — укрытие, <b style="color:#5fd3ff;">голубой</b> — бейте, босс уязвим. Перед каждым ударом звучит сигнал, а над хотбаром видно, что летит и через сколько.</p><p>Между фазами босс две секунды неуязвим, меняет название и цвет полосы и отбрасывает всех рядом. В последней фазе знаки короче. Щит, считающий удары, — белая полоса над здоровьем.</p></div><h3>Награды за чистый бой</h3><div class="tbl"><table><thead><tr><th>Условие</th><th>Награда</th></tr></thead><tbody><tr><th scope="row">Фаза без смертей</th><td>шанс на реликвию удваивается за каждую такую фазу: 10% → 20% → 40% → 80%; у ослабленного стража испытания он меньше</td></tr><tr><th scope="row">Ни разу не задет красным знаком</th><td>+25% осколков босса</td></tr><tr><th scope="row">Победа в одиночку</th><td>босс вычеркнут из «Списка смертников» (страж испытания — с третьего уровня)</td></tr></tbody></table></div><div class="prose small"><p><b>Список смертников</b> — каждого босса нужно победить в одиночку: Горнило, Серафим Падшего Рассвета, Древний страж джунглей, Пустотный Серафим, Предвестник, Джунглевый голем, Проклятый король, Хронарх, Целестиал и ещё один. Весь список — достижение и по реликвии кузни, Небесного храма и Храма джунглей.</p><p>После победы в чате — итог боя: время, чистые фазы и шанс на реликвию.</p></div>', 7))
      ]);
    };
  }
};
const _hoisted_1$5 = { id: "raids" };
const _hoisted_2$5 = { class: "stack" };
const _hoisted_3$4 = { class: "panel" };
const _hoisted_4$4 = {
  class: "waves",
  "aria-label": "Пять волн: четыре волны стражи, в пятой — страж святилища"
};
const _hoisted_5$4 = { class: "wave-n" };
const _hoisted_6$4 = { class: "wave-t" };
const _hoisted_7$4 = {
  key: 0,
  class: "energy",
  "aria-hidden": "true"
};
const _hoisted_8$4 = { class: "tiers" };
const _hoisted_9$4 = {
  class: "tier-n",
  "aria-hidden": "true"
};
const _hoisted_10$4 = { class: "kv" };
const _hoisted_11$4 = {
  class: "panel",
  id: "fourth"
};
const _hoisted_12$3 = { class: "fourths" };
const _hoisted_13$1 = { class: "fourth-relic" };
const _hoisted_14$1 = ["src"];
const _hoisted_15$1 = { class: "fourth-blood" };
const _hoisted_16 = { class: "small" };
const _hoisted_17 = { class: "fourth-where" };
const _sfc_main$5 = {
  __name: "TrialsSection",
  setup(__props) {
    const TIERS = [
      { n: "I", price: "даром, раз в 10 минут на игрока", gives: "у всех бойцов этой крови и у начавшего первая форма → вторая", shards: 1 },
      { n: "II", price: "алмазный блок, изумрудный блок, 20 осколков", gives: "начавшему — реликвия святилища, даже если он погиб", shards: 2 },
      { n: "III", price: "32 осколка, реликвия, зачарованное золотое яблоко", gives: "начавшему — реликвия; у бойцов этой крови и у начавшего вторая форма → третья (кроме крови предков: её третья — Терра-сущность); Серафим роняет Печать ночи", shards: 3 }
    ];
    const blood = Object.fromEntries(data.blood.map((b) => [b.id, b]));
    const FOURTH = [
      { blood: "ember", what: "Адская сущность", from: "из часовой башни Проклятого замка", where: "кнопка крови у алтаря Незеритовой кузни", icon: "hell_essence" },
      { blood: "steel", what: "Забытый мир на S", from: "Джунглевый ключ, Истинный Джунглевый голем — оценка S или S+; Терра-сущность к алтарю джунглей даёт предкам третью форму, Целестиал на S — пятую", where: "Забытый мир", icon: "forgotten_key_moss" },
      { blood: "night", what: "Пустотный Серафим", from: "победить его — форму получает тот, кто его призвал", where: "алтарь Тёмного храма", icon: "night_seal" },
      { blood: "techno", what: "Чёрная субстанция", from: "с трона Проклятого замка", where: "ZorahM-GPT: кнопка крови у терминала фабрики", icon: "black_substance" }
    ];
    const icon = (id) => {
      var _a;
      return ((_a = item(id)) == null ? void 0 : _a.icon) || data.icons[id];
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$5, [
        createVNode(_sfc_main$g, {
          title: "Испытания",
          icon: "harbinger_core"
        }, {
          default: withCtx(() => [..._cache[0] || (_cache[0] = [
            createBaseVNode("p", { class: "lead" }, [
              createTextVNode("Стража святилища вызывают "),
              createBaseVNode("b", null, "испытанием"),
              createTextVNode(" у алтаря.")
            ], -1)
          ])]),
          _: 1
        }),
        createBaseVNode("div", _hoisted_2$5, [
          createBaseVNode("div", _hoisted_3$4, [
            _cache[4] || (_cache[4] = createBaseVNode("h3", null, "Испытание святилища", -1)),
            _cache[5] || (_cache[5] = createBaseVNode("p", { class: "small" }, "Пять волн в арене, в пятой — страж святилища. Уровень и награду определяет тот, кто начал. Покинуть арену до конца боя нельзя.", -1)),
            createBaseVNode("div", _hoisted_4$4, [
              (openBlock(), createElementBlock(Fragment, null, renderList(5, (w) => {
                return openBlock(), createElementBlock(Fragment, { key: w }, [
                  createBaseVNode("div", {
                    class: normalizeClass(["wave", { boss: w === 5 }])
                  }, [
                    createBaseVNode("span", _hoisted_5$4, toDisplayString(w), 1),
                    createBaseVNode("span", _hoisted_6$4, toDisplayString(w === 5 ? "страж" : "волна"), 1)
                  ], 2),
                  w < 5 ? (openBlock(), createElementBlock("span", _hoisted_7$4)) : createCommentVNode("", true)
                ], 64);
              }), 64))
            ]),
            createBaseVNode("div", _hoisted_8$4, [
              (openBlock(), createElementBlock(Fragment, null, renderList(TIERS, (t) => {
                return createBaseVNode("article", {
                  key: t.n,
                  class: normalizeClass(["tier", `tier-${t.n.length}`])
                }, [
                  createBaseVNode("span", _hoisted_9$4, toDisplayString(t.n), 1),
                  createBaseVNode("h4", null, "Уровень " + toDisplayString(t.n.length), 1),
                  createBaseVNode("dl", _hoisted_10$4, [
                    createBaseVNode("div", null, [
                      _cache[1] || (_cache[1] = createBaseVNode("dt", null, "Цена", -1)),
                      createBaseVNode("dd", null, toDisplayString(t.price), 1)
                    ]),
                    createBaseVNode("div", null, [
                      _cache[2] || (_cache[2] = createBaseVNode("dt", null, "Даёт", -1)),
                      createBaseVNode("dd", null, toDisplayString(t.gives), 1)
                    ]),
                    createBaseVNode("div", null, [
                      _cache[3] || (_cache[3] = createBaseVNode("dt", null, "Со стражника", -1)),
                      createBaseVNode("dd", null, toDisplayString(t.shards) + " " + toDisplayString(t.shards === 1 ? "осколок — сразу в инвентарь" : "осколка"), 1)
                    ])
                  ])
                ], 2);
              }), 64))
            ]),
            _cache[6] || (_cache[6] = createBaseVNode("p", { class: "small muted" }, "Пройденное испытание открывает следующий уровень; начать можно любой открытый.", -1)),
            _cache[7] || (_cache[7] = createBaseVNode("p", { class: "small" }, "Страж пятой волны на 1-м уровне — с 40% здоровья и бьёт вполсилы, на 2-м — 60% и три четверти силы, на 3-м — 85% и в полную силу.", -1)),
            _cache[8] || (_cache[8] = createBaseVNode("p", { class: "small" }, [
              createBaseVNode("b", null, "Провал"),
              createTextVNode(" — арена пустовала 30 секунд (пока она пуста, идёт отсчёт), прошло 12 минут или страж ушёл; причина пишется под «Провал». Провал забирает у каждого половину осколков, добытых в этом испытании.")
            ], -1))
          ]),
          createBaseVNode("div", _hoisted_11$4, [
            _cache[9] || (_cache[9] = createBaseVNode("h3", null, "Четвёртая форма", -1)),
            _cache[10] || (_cache[10] = createBaseVNode("p", { class: "small" }, [
              createTextVNode("Четвёртую форму "),
              createBaseVNode("b", null, "приносят к алтарю своей крови"),
              createTextVNode("; кровь предков добывает её в Забытом мире.")
            ], -1)),
            createBaseVNode("div", _hoisted_12$3, [
              (openBlock(), createElementBlock(Fragment, null, renderList(FOURTH, (f) => {
                return createBaseVNode("article", {
                  key: f.blood,
                  class: "fourth",
                  style: normalizeStyle({ "--b": unref(blood)[f.blood].colour })
                }, [
                  createBaseVNode("span", _hoisted_13$1, [
                    createBaseVNode("img", {
                      src: icon(f.icon),
                      alt: ""
                    }, null, 8, _hoisted_14$1)
                  ]),
                  createBaseVNode("div", null, [
                    createBaseVNode("p", _hoisted_15$1, toDisplayString(unref(blood)[f.blood].title), 1),
                    createBaseVNode("h4", null, toDisplayString(f.what), 1),
                    createBaseVNode("p", _hoisted_16, toDisplayString(f.from), 1),
                    createBaseVNode("p", _hoisted_17, toDisplayString(f.where), 1)
                  ])
                ], 4);
              }), 64))
            ]),
            _cache[11] || (_cache[11] = createBaseVNode("p", { class: "small" }, [
              createTextVNode("Обе сущности с "),
              createBaseVNode("b", null, "проклятием утраты"),
              createTextVNode(": погибли с ней — она пропала.")
            ], -1))
          ])
        ]),
        _cache[12] || (_cache[12] = createStaticVNode('<div class="panel"><h3>Рейды фабрики</h3><p class="small">Рейды проводят в Древней фабрике после падения Предвестника: волны в реакторном зале, три уровня, как у испытаний.</p><div class="tbl"><table><thead><tr><th>Уровень</th><th>Цена</th><th>С каждого стражника</th><th>В конце всем в фабрике</th></tr></thead><tbody><tr><td>1</td><td>даром, раз в 10 минут</td><td>1 деталь</td><td>6–10 деталей</td></tr><tr><td>2</td><td>8 деталей</td><td>2 детали</td><td>12–20 деталей, шанс 15% на ядро</td></tr><tr><td>3</td><td>16 деталей</td><td>3 детали</td><td>20–30 деталей, шанс 30% на ядро</td></tr></tbody></table></div><p class="small">Провал забирает половину деталей, добытых в рейде.</p></div>', 1))
      ]);
    };
  }
};
const _hoisted_1$4 = { class: "btrunk-title" };
const _hoisted_2$4 = {
  key: 0,
  class: "btrunk-then"
};
const _hoisted_3$3 = { class: "bforms" };
const _hoisted_4$3 = {
  class: "bnode",
  "aria-hidden": "true"
};
const _hoisted_5$3 = { class: "bform-body" };
const _hoisted_6$3 = { class: "bform-name" };
const _hoisted_7$3 = { class: "bform-perk" };
const _hoisted_8$3 = {
  key: 0,
  class: "bform-blades"
};
const _hoisted_9$3 = { class: "btrunk-title" };
const _hoisted_10$3 = { class: "babyss-flow" };
const _hoisted_11$3 = { class: "babyss-crowns" };
const _hoisted_12$2 = { class: "babyss-heart" };
const _sfc_main$4 = {
  __name: "BloodTree",
  setup(__props) {
    const ROMAN = ["I", "II", "III", "IV"];
    const NAMES = ["Первая форма", "Вторая форма", "Третья форма", "Четвёртая форма · корона и дар"];
    const night = data.blood.find((b) => b.id === "night");
    const bladesOf = (b, pick) => b.weapons.filter((w) => pick(w.form || 1)).map((w) => item(w.id)).filter(Boolean);
    const trees = data.blood.filter((b) => !b.formless && b.id !== "night").map((b) => {
      const steps = ROMAN.map((n, i) => ({ n, name: NAMES[i], perk: b.perks[i] || "", blades: bladesOf(b, (f) => f === i + 1), crown: i === 3 })).filter((s) => s.perk);
      if (b.id === "sky" && night) {
        steps.push({
          n: "☾",
          name: "Печать ночи · ночная небесная кровь",
          seal: true,
          colour: night.colour,
          perk: "Серафим третьего испытания роняет Печать ночи: сломайте её — кровь станет ночной той же формы. " + (night.perks[2] || ""),
          blades: bladesOf(night, (f) => f < 4)
        });
        steps.push({ n: "IV", name: "Четвёртая форма ночи · корона и дар", perk: night.perks[3] || "", blades: bladesOf(night, (f) => f === 4), crown: true, colour: night.colour });
      }
      return { ...b, steps, dual: b.id === "sky" && night ? night.colour : null };
    });
    const abyss = data.blood.find((b) => b.formless);
    const crowns = data.blood.filter((b) => !b.formless).flatMap((b) => b.weapons.filter((w) => w.crown).map((w) => ({ blade: item(w.id), colour: b.colour })));
    const allBlack = item("all_black");
    const root = ref(null);
    const lit = ref(false);
    let observer;
    onMounted(() => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
        lit.value = true;
        return;
      }
      observer = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
          lit.value = true;
          observer.disconnect();
        }
      }, { threshold: 0.15 });
      observer.observe(root.value);
    });
    onBeforeUnmount(() => observer == null ? void 0 : observer.disconnect());
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "root",
        ref: root,
        class: normalizeClass(["btree", { lit: lit.value }])
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(unref(trees), (t, ti) => {
          return openBlock(), createElementBlock("article", {
            key: t.id,
            class: normalizeClass(["btrunk", { dual: t.dual }]),
            style: normalizeStyle({ "--b": t.colour, "--b2": t.dual || t.colour, "--ti": ti })
          }, [
            createBaseVNode("h4", _hoisted_1$4, [
              _cache[0] || (_cache[0] = createBaseVNode("span", {
                class: "blood-gem",
                "aria-hidden": "true"
              }, null, -1)),
              createTextVNode(toDisplayString(t.title), 1),
              t.dual ? (openBlock(), createElementBlock("span", _hoisted_2$4, "→ ночная")) : createCommentVNode("", true)
            ]),
            createBaseVNode("ol", _hoisted_3$3, [
              (openBlock(true), createElementBlock(Fragment, null, renderList([...t.steps].reverse(), (f, i) => {
                return openBlock(), createElementBlock("li", {
                  key: f.name,
                  class: normalizeClass(["bform", { crown: f.crown, seal: f.seal }]),
                  style: normalizeStyle({ "--fi": t.steps.length - 1 - i, ...f.colour ? { "--b": f.colour } : {} })
                }, [
                  createBaseVNode("span", _hoisted_4$3, [
                    createBaseVNode("span", null, toDisplayString(f.n), 1)
                  ]),
                  createBaseVNode("div", _hoisted_5$3, [
                    createBaseVNode("p", _hoisted_6$3, toDisplayString(f.name), 1),
                    createBaseVNode("p", _hoisted_7$3, toDisplayString(f.perk), 1),
                    f.blades.length ? (openBlock(), createElementBlock("div", _hoisted_8$3, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(f.blades, (w) => {
                        return openBlock(), createBlock(_sfc_main$r, {
                          key: w.id,
                          item: w
                        }, null, 8, ["item"]);
                      }), 128))
                    ])) : createCommentVNode("", true)
                  ])
                ], 6);
              }), 128))
            ])
          ], 6);
        }), 128)),
        unref(abyss) ? (openBlock(), createElementBlock("article", {
          key: 0,
          class: "btrunk babyss",
          style: normalizeStyle({ "--b": unref(abyss).colour, "--ti": unref(trees).length })
        }, [
          createBaseVNode("h4", _hoisted_9$3, [
            _cache[1] || (_cache[1] = createBaseVNode("span", {
              class: "blood-gem",
              "aria-hidden": "true"
            }, null, -1)),
            createTextVNode(toDisplayString(unref(abyss).title), 1)
          ]),
          _cache[3] || (_cache[3] = createBaseVNode("p", { class: "bform-perk" }, "Форм нет. Короны всех кровей сходятся в бездну: корона своей крови и Чёрная субстанция у алтаря своего храма дают Все-Чёрный.", -1)),
          createBaseVNode("div", _hoisted_10$3, [
            createBaseVNode("div", _hoisted_11$3, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(crowns), (c) => {
                return openBlock(), createElementBlock("span", {
                  key: c.blade.id,
                  class: "babyss-crown",
                  style: normalizeStyle({ "--c": c.colour })
                }, [
                  createVNode(_sfc_main$r, {
                    item: c.blade
                  }, null, 8, ["item"])
                ], 4);
              }), 128))
            ]),
            _cache[2] || (_cache[2] = createBaseVNode("span", {
              class: "babyss-stream",
              "aria-hidden": "true"
            }, null, -1)),
            createBaseVNode("div", _hoisted_12$2, [
              unref(allBlack) ? (openBlock(), createBlock(_sfc_main$r, {
                key: 0,
                item: unref(allBlack),
                named: ""
              }, null, 8, ["item"])) : createCommentVNode("", true)
            ])
          ]),
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(abyss).perks, (p, i) => {
            return openBlock(), createElementBlock("p", {
              key: i,
              class: "bform-perk"
            }, toDisplayString(p), 1);
          }), 128))
        ], 4)) : createCommentVNode("", true)
      ], 2);
    };
  }
};
const _hoisted_1$3 = { id: "blood" };
const _hoisted_2$3 = { class: "bloods" };
const _hoisted_3$2 = { class: "blood-motto" };
const _hoisted_4$2 = { class: "blood-home" };
const _hoisted_5$2 = { class: "blood-blades" };
const _hoisted_6$2 = ["href"];
const _hoisted_7$2 = ["src"];
const _hoisted_8$2 = {
  key: 0,
  class: "muted small"
};
const _hoisted_9$2 = {
  key: 0,
  class: "muted small"
};
const _hoisted_10$2 = { class: "tbl" };
const _hoisted_11$2 = { scope: "row" };
const _hoisted_12$1 = { class: "tbl" };
const _hoisted_13 = { scope: "row" };
const _hoisted_14 = { class: "inline-icons" };
const _hoisted_15 = ["src"];
const _sfc_main$3 = {
  __name: "BloodSection",
  setup(__props) {
    const quests = data.blood.filter((b) => !b.formless && b.deed);
    const icon = (id) => {
      var _a;
      return (_a = data.items.find((i) => i.id === id)) == null ? void 0 : _a.icon;
    };
    const titles = [
      { name: "Сатана", blood: "ember", crown: "imperium", armour: "Расплавленный доспех", palette: ["#ffe66b", "#ff6a1e", "#8f1400", "#c4c4c4"] },
      { name: "Король Ночи", blood: "night", crown: "true_excalibur", armour: "Доспех Короля ночи", palette: ["#0a1440", "#2f6bff", "#a9c8ff", "#2f6bff"] },
      { name: "Король в Чёрном", blood: "abyss", crown: "all_black", armour: "—", palette: ["#141414", "#5c5c5c", "#c4c4c4", "#5c5c5c"] },
      { name: "Целестиал", blood: "steel", crown: "celestial", armour: "Целестиальный доспех", palette: ["#ffe7a3", "#f08a5d", "#b8235a", "#f08a5d"] },
      { name: "Бог из Машины", blood: "techno", crown: "antichrist", armour: "—", palette: ["#e6e9ec", "#8e959c", "#3a3f45", "#d61f1f"] }
    ].map((t) => ({
      ...t,
      line: data.blood.find((b) => b.id === t.blood),
      item: data.items.find((i) => i.id === t.crown),
      icon: icon(t.crown),
      style: { "--g": `linear-gradient(90deg, ${[...t.palette, t.palette[0]].map(lift).join(", ")})` }
    }));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$3, [
        createVNode(_sfc_main$g, {
          title: "Родословные",
          icon: "demon_soul"
        }, {
          default: withCtx(() => [..._cache[0] || (_cache[0] = [
            createBaseVNode("p", { class: "lead" }, "При первом входе каждый игрок сам выбирает одну из трёх родословных: пепельную, небесную или кровь предков. Кровь решает, как игрок растёт, какую книгу получит и какие величайшие клинки его признают.", -1)
          ])]),
          _: 1
        }),
        _cache[5] || (_cache[5] = createStaticVNode("<h3>Клинки крови</h3><p>Величайшие клинки привязаны к крови: в чужих руках они не работают. <b>Короны</b> — Истинный Экскалибур и Антихрист — отвечают только крови в <b>четвёртой форме</b>, Энигма предков — уже с <b>третьей</b>, а Целестиал и Архитектор — только с <b>пятой</b> формы крови предков. У пепельной крови <b>две короны</b>: <b>Империум</b> — с четвёртой формы, <b>Люцифер</b> — уже с третьей. Все-Чёрный отвечает только крови бездны.</p>", 2)),
        createBaseVNode("div", _hoisted_2$3, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(data).blood, (b) => {
            return openBlock(), createElementBlock("article", {
              key: b.id,
              class: "blood",
              style: normalizeStyle({ "--b": b.colour })
            }, [
              createBaseVNode("h4", null, [
                _cache[1] || (_cache[1] = createBaseVNode("span", {
                  class: "blood-gem",
                  "aria-hidden": "true"
                }, null, -1)),
                createTextVNode(toDisplayString(b.title), 1)
              ]),
              createBaseVNode("p", _hoisted_3$2, toDisplayString(b.motto), 1),
              createBaseVNode("p", _hoisted_4$2, [
                _cache[2] || (_cache[2] = createBaseVNode("span", { class: "muted" }, "Святилище:", -1)),
                createTextVNode(" " + toDisplayString(b.sanctum), 1)
              ]),
              createBaseVNode("div", _hoisted_5$2, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(b.weapons, (w) => {
                  return openBlock(), createElementBlock("a", {
                    key: w.id,
                    href: `#w-${w.id}`,
                    class: "mitem"
                  }, [
                    createBaseVNode("img", {
                      src: w.icon,
                      alt: ""
                    }, null, 8, _hoisted_7$2),
                    createBaseVNode("span", null, toDisplayString(w.name), 1),
                    w.form > 1 ? (openBlock(), createElementBlock("span", _hoisted_8$2, "с " + toDisplayString(w.form) + "-й", 1)) : createCommentVNode("", true)
                  ], 8, _hoisted_6$2);
                }), 128)),
                !b.weapons.length ? (openBlock(), createElementBlock("span", _hoisted_9$2, "ещё не выкованы")) : createCommentVNode("", true)
              ])
            ], 4);
          }), 128))
        ]),
        _cache[6] || (_cache[6] = createStaticVNode('<h3>Формы</h3><div class="flow" aria-label="Путь крови"><div class="step"><b>Первая</b><span>выбор при первом входе — или 20 осколков у алтаря святилища этой крови</span></div><span class="to" aria-hidden="true">→</span><div class="step"><b>Вторая</b><span>испытание 1-го уровня в святилище своей крови</span></div><span class="to" aria-hidden="true">→</span><div class="step"><b>Третья</b><span>испытание 3-го уровня там же</span></div><span class="to" aria-hidden="true">→</span><div class="step"><b>Четвёртая</b><span>сущность или субстанция у алтаря своей крови · корона крови (у пепельной — Империум)</span></div></div><p><b>Кровь предков</b> идёт своим путём: вторая форма — испытание 1-го уровня в Храме джунглей, третья — <b>Терра-сущность</b>, принесённая к алтарю джунглей, четвёртая — проход <b>Забытого мира</b> с Джунглевым ключом на оценку S или S+, пятая — проход с Целестиальным ключом на S или S+.</p><p><b>Огонь не берёт своё.</b> Брошенные в лаву или огонь клинки пепельной крови и адские материалы не сгорают.</p><p><b>Крылья</b> растут не от формы, а от <b>полного комплекта брони</b>: наденьте все четыре части — и за спиной раскроются крылья. Расплавленный доспех — солнечные, доспех паладина — светлые небесные, доспех Короля ночи — небесные, Терра-доспех — зелёные крылья мудреца, Целестиальный доспех — крылья Целестиала: всё это объёмные модели, которые стоят за спиной и поворачиваются вместе с телом. У Демонического доспеха крылья багрово-чёрные, как у элитр. Снимите одну часть — крылья пропадут. Полёт небесной и ночной небесной крови от крыльев не зависит.</p><p><b>У небесной крови нет четвёртой формы.</b> Сломав <b>Печать ночи</b>, небесная кровь становится <b>ночной небесной</b>. С тех пор по ночам появляется <b>Тёмный храм</b> — там ночная кровь растёт дальше.</p><p><b>Техноорганическая кровь</b> растёт иначе: вторая форма — победа в рейде фабрики, третья — три подвига в любом порядке, четвёртая — Чёрная субстанция, сданная на терминале фабрики.</p>', 7)),
        createBaseVNode("div", _hoisted_10$2, [
          createBaseVNode("table", null, [
            _cache[3] || (_cache[3] = createBaseVNode("thead", null, [
              createBaseVNode("tr", null, [
                createBaseVNode("th", null, "Кровь"),
                createBaseVNode("th", null, "Подношение"),
                createBaseVNode("th", null, "Подвиг крови")
              ])
            ], -1)),
            createBaseVNode("tbody", null, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(quests), (b) => {
                return openBlock(), createElementBlock("tr", {
                  key: b.id
                }, [
                  createBaseVNode("th", _hoisted_11$2, [
                    createVNode(_sfc_main$p, {
                      colour: b.colour
                    }, null, 8, ["colour"]),
                    createTextVNode(toDisplayString(b.title), 1)
                  ]),
                  createBaseVNode("td", null, toDisplayString(b.offering.join(", ")), 1),
                  createBaseVNode("td", null, toDisplayString(b.deed[0].toUpperCase() + b.deed.slice(1)), 1)
                ]);
              }), 128))
            ])
          ])
        ]),
        _cache[7] || (_cache[7] = createBaseVNode("p", { class: "small muted" }, "Третий подвиг — выковать любой клинок у любого алтаря. Подвиги засчитываются, пока кровь во второй форме.", -1)),
        _cache[8] || (_cache[8] = createBaseVNode("p", null, [
          createTextVNode("С "),
          createBaseVNode("b", null, "третьей формы"),
          createTextVNode(" клинки своей крови бьют сильнее. "),
          createBaseVNode("b", null, "Четвёртая форма"),
          createTextVNode(" открывает корону крови и свой "),
          createBaseVNode("b", null, "дар"),
          createTextVNode(": он просыпается сам, когда нужен, и потом отдыхает 10 минут. Как дойти до неё — в разделе "),
          createBaseVNode("a", { href: "#fourth" }, "«Четвёртая форма»"),
          createTextVNode(".")
        ], -1)),
        _cache[9] || (_cache[9] = createBaseVNode("h3", null, "Дерево родословных", -1)),
        createVNode(_sfc_main$4),
        _cache[10] || (_cache[10] = createStaticVNode('<p class="small muted">Сменить кровь можно у алтаря её святилища — кроме ночной, бездны и техноорганической.</p><p><b>Кровь бездны</b> не выбирают и не покупают. Её получает тот, кто выковал <b>Все-Чёрный</b>: в тот же миг кровь меняется на бездну — навсегда. У бездны нет форм, подвигов и испытаний. Выковать Все-Чёрный можно из <b>короны своей крови</b> (у пепельной — из Империума или Люцифера) и <b>Чёрной субстанции</b> у алтаря <b>своего</b> храма — и храм за это <b>гневается</b>.</p><p><b>Техноорганическую кровь</b> принимают на терминале Древней фабрики. Вместе с ней вы получаете <b>Энцефало-меч</b>: он сам растёт вместе с кровью — в <b>Энцефало-клинок</b>, а затем в <b>Антихрист</b> — и возвращается к вам после смерти.</p><p class="small">Алтарь фабрики собирает своей крови <b>призывные машины</b>: медного голема, малого Предвестника и Сборочный купол.</p><h3 id="titles">Звания</h3><p>Кто прошёл свою кровь до конца — <b>последняя форма</b>, <b>свой доспех целиком</b> и <b>корона крови</b> в инвентаре, — получает её звание. Весь сервер видит в чате: <i>«ViRuS стал Королём в Чёрном»</i>, а звание навсегда встаёт перед ником префиксом и переливается цветами редкостей короны и доспеха.</p>', 6)),
        createBaseVNode("div", _hoisted_12$1, [
          createBaseVNode("table", null, [
            _cache[4] || (_cache[4] = createBaseVNode("thead", null, [
              createBaseVNode("tr", null, [
                createBaseVNode("th", null, "Звание"),
                createBaseVNode("th", null, "Кровь"),
                createBaseVNode("th", null, "Корона"),
                createBaseVNode("th", null, "Доспех")
              ])
            ], -1)),
            createBaseVNode("tbody", null, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(titles), (t) => {
                var _a;
                return openBlock(), createElementBlock("tr", {
                  key: t.name
                }, [
                  createBaseVNode("th", _hoisted_13, [
                    createBaseVNode("span", {
                      class: "btitle",
                      style: normalizeStyle(t.style)
                    }, toDisplayString(t.name), 5)
                  ]),
                  createBaseVNode("td", null, [
                    createVNode(_sfc_main$p, {
                      colour: t.line.colour
                    }, null, 8, ["colour"]),
                    createTextVNode(toDisplayString(t.line.title), 1)
                  ]),
                  createBaseVNode("td", _hoisted_14, [
                    t.icon ? (openBlock(), createElementBlock("img", {
                      key: 0,
                      src: t.icon,
                      alt: ""
                    }, null, 8, _hoisted_15)) : createCommentVNode("", true),
                    createTextVNode(toDisplayString((_a = t.item) == null ? void 0 : _a.name), 1)
                  ]),
                  createBaseVNode("td", null, toDisplayString(t.armour), 1)
                ]);
              }), 128))
            ])
          ])
        ]),
        _cache[11] || (_cache[11] = createStaticVNode('<p class="small muted">Последняя форма бездны — сама кровь бездны: форм у неё нет, и доспех ей не нужен — хватает Все-Чёрного. Техноорганической крови тоже хватает формы и Антихриста.</p><h3>Путеводитель</h3><p>Сразу после крови выбирается голос, что будет с вами в пути: он даёт советы, рассказывает легенды и отзывается на то, что с вами происходит. Каждая реплика звучит один раз.</p><div class="tbl"><table><thead><tr><th>Голос</th><th>Какой</th><th>Что знает</th></tr></thead><tbody><tr><td>Путеводитель</td><td>старый хранитель знаний о клинках: тёплый, насмешливый, говорит загадками</td><td>все секреты пепельной, небесной и ночной крови и крови предков; о технокрови — ничего; бездну считает злом и пути к ней не назовёт</td></tr><tr><td>ZorahM-GPT</td><td>разум Древней фабрики: обидчивый, язвительный, драматичный, с комплексом бога; презирает органику и не скрывает своих целей</td><td>путь технокрови — точно; формы других кровей — догадками; о бездне наслышан, но считает её слабой</td></tr><tr><td>Наблюдатель</td><td>древний свидетель: торжественный и печальный, рассказывает легенды о Все-Чёрном</td><td>о начальных кровях и технокрови — почти ничего; единственный знает путь к крови бездны и все её особенности</td></tr></tbody></table></div><p class="small muted">Кровь бездны всегда слышит Наблюдателя, техноорганическая — ZorahM-GPT: их выбор голоса не касается. Дороги ко всем постройкам — от кузни и храмов до Проклятого замка, Терра-подземелья и Забытого мира — знают все трое и подскажут, пока вы там не побывали.</p><h3>Книги</h3><p>Выбрав кровь, игрок получает <b>книгу своей крови</b>; сразу за обложкой — «Первые шаги»: чем найти святилище, что даёт первое испытание и какой клинок добыть первым. Оператор сервера получает ещё и <b>книгу хранителя</b> — её первые страницы стали панелью с кнопками.</p>', 7))
      ]);
    };
  }
};
const _hoisted_1$2 = { id: "trophies" };
const _hoisted_2$2 = {
  class: "filters",
  role: "group",
  "aria-label": "Тип достижения"
};
const _hoisted_3$1 = ["aria-pressed", "onClick"];
const _hoisted_4$1 = { class: "group" };
const _hoisted_5$1 = { class: "advs" };
const _hoisted_6$1 = ["title"];
const _hoisted_7$1 = ["src"];
const _hoisted_8$1 = { class: "toast-head" };
const _hoisted_9$1 = { class: "toast-title" };
const _hoisted_10$1 = { class: "quote" };
const _hoisted_11$1 = { class: "cond" };
const _hoisted_12 = {
  key: 0,
  class: "empty"
};
const _sfc_main$2 = {
  __name: "TrophiesSection",
  setup(__props) {
    const FRAMES = [["all", "Все"], ["task", "Задачи"], ["goal", "Цели"], ["challenge", "Испытания"]];
    const frame = ref("all");
    const TOAST = { task: "Достижение получено!", goal: "Цель достигнута!", challenge: "Испытание завершено!" };
    const groups = computed(() => achievementGroups.value.map((g) => ({ ...g, cards: g.cards.filter((a) => frame.value === "all" || a.frame === frame.value) })).filter((g) => g.cards.length));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$2, [
        createVNode(_sfc_main$g, {
          title: "Достижения",
          icon: "royal_clock"
        }, {
          default: withCtx(() => [..._cache[0] || (_cache[0] = [
            createBaseVNode("p", { class: "lead" }, "Отдельная вкладка в меню достижений.", -1)
          ])]),
          _: 1
        }),
        createBaseVNode("div", _hoisted_2$2, [
          (openBlock(), createElementBlock(Fragment, null, renderList(FRAMES, ([key, title]) => {
            return createBaseVNode("button", {
              key,
              type: "button",
              class: "chip",
              "aria-pressed": String(frame.value === key),
              onClick: ($event) => frame.value = key
            }, toDisplayString(title), 9, _hoisted_3$1);
          }), 64))
        ]),
        (openBlock(true), createElementBlock(Fragment, null, renderList(groups.value, (group) => {
          return openBlock(), createElementBlock(Fragment, {
            key: group.title
          }, [
            createBaseVNode("h3", _hoisted_4$1, toDisplayString(group.title), 1),
            createBaseVNode("div", _hoisted_5$1, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(group.cards, (a) => {
                return openBlock(), createElementBlock("article", {
                  key: a.key,
                  class: "adv"
                }, [
                  createBaseVNode("div", {
                    class: normalizeClass(["toast", `t-${a.frame}`])
                  }, [
                    createBaseVNode("div", {
                      class: normalizeClass(["frame", `f-${a.frame}`]),
                      title: a.caption
                    }, [
                      a.icon ? (openBlock(), createElementBlock("img", {
                        key: 0,
                        src: a.icon,
                        alt: ""
                      }, null, 8, _hoisted_7$1)) : a.gem ? (openBlock(), createElementBlock("span", {
                        key: 1,
                        class: "gem",
                        style: normalizeStyle({ "--gem": a.gem })
                      }, null, 4)) : createCommentVNode("", true)
                    ], 10, _hoisted_6$1),
                    createBaseVNode("div", null, [
                      createBaseVNode("p", _hoisted_8$1, toDisplayString(TOAST[a.frame] || a.frameLabel), 1),
                      createBaseVNode("h4", _hoisted_9$1, toDisplayString(a.title), 1)
                    ])
                  ], 2),
                  createBaseVNode("p", _hoisted_10$1, "«" + toDisplayString(a.description) + "»", 1),
                  createBaseVNode("p", _hoisted_11$1, toDisplayString(a.condition), 1)
                ]);
              }), 128))
            ])
          ], 64);
        }), 128)),
        !groups.value.length ? (openBlock(), createElementBlock("p", _hoisted_12, "Ни одного достижения по этому слову.")) : createCommentVNode("", true)
      ]);
    };
  }
};
const _hoisted_1$1 = { id: "admin" };
const _hoisted_2$1 = { class: "twocol" };
const _hoisted_3 = { class: "term" };
const _hoisted_4 = { class: "term-bar" };
const _hoisted_5 = { class: "term" };
const _hoisted_6 = { class: "term-bar" };
const _hoisted_7 = { class: "term-body" };
const _hoisted_8 = { class: "t-k" };
const _hoisted_9 = { class: "t-v" };
const _hoisted_10 = {
  key: 1,
  class: "t-c"
};
const _hoisted_11 = {
  class: "sr-only",
  "aria-live": "polite"
};
const _sfc_main$1 = {
  __name: "AdminSection",
  setup(__props) {
    const copied = ref("");
    async function copy(e, which, shell) {
      const text = e.currentTarget.closest(".term").querySelector("code").textContent;
      const lines = shell ? text.split("\n").filter((l) => l.startsWith("$ ")).map((l) => l.slice(2)) : text.split("\n").filter((l) => l.trim());
      try {
        await navigator.clipboard.writeText(lines.join("\n") + "\n");
        copied.value = which;
      } catch (err) {
        copied.value = "";
      }
      setTimeout(() => {
        if (copied.value === which) copied.value = "";
      }, 1800);
    }
    const CONFIG = [
      ["progression", null, ""],
      ["  mastery-multiplier", "1.0", "скорость роста мастерства"],
      ["  bloodlines", "true", "родословные и привязка клинков к крови"],
      ["sanctums", null, ""],
      ["  build-radius", "160.0", "с какого расстояния поднимается постройка"],
      ["  roam-minutes", "10", "через сколько минут без гостей святилище переезжает; 0 — никогда"],
      ["  boss-health-multiplier", "1.0", "здоровье стражей для больших компаний"],
      ["  raid-relic-chance", "0.15", "шанс ядра в рейде фабрики"],
      ["abilities", null, ""],
      ["  cooldown-seconds", "…", "перезарядки способностей, по клинкам"],
      ["bound-drops", null, ""],
      ["  items", "[all_black]", "клинки, которые не теряются при смерти"]
    ];
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$1, [
        createVNode(_sfc_main$g, {
          title: "Для администратора",
          icon: "ancient_part"
        }),
        createBaseVNode("div", _hoisted_2$1, [
          createBaseVNode("figure", _hoisted_3, [
            createBaseVNode("figcaption", _hoisted_4, [
              _cache[2] || (_cache[2] = createBaseVNode("span", {
                class: "term-dots",
                "aria-hidden": "true"
              }, [
                createBaseVNode("i"),
                createBaseVNode("i"),
                createBaseVNode("i")
              ], -1)),
              _cache[3] || (_cache[3] = createTextVNode("Установка ", -1)),
              createBaseVNode("button", {
                type: "button",
                class: "term-copy",
                onClick: _cache[0] || (_cache[0] = ($event) => copy($event, "install", true))
              }, toDisplayString(copied.value === "install" ? "Скопировано" : "Копировать"), 1)
            ]),
            _cache[4] || (_cache[4] = createStaticVNode('<pre class="term-body"><code><span class="t-c"># собрать плагин (нужна Java 21+; на Windows — gradlew.bat build)</span>\n<span class="t-p">$</span> ./gradlew build\n<span class="t-c"># положить в папку плагинов сервера Paper 1.21.11</span>\n<span class="t-p">$</span> cp build/libs/virusswords-1.0.0.jar server/plugins/\n<span class="t-c"># раздать ресурспак (клиент 1.21.6+): строка в server.properties</span>\n<span class="t-k">resource-pack</span>=<span class="t-v">https://…/VirusSwords-ResourcePack.zip</span>\n<span class="t-c"># первый запуск: плагин сам ставит датапак достижений</span>\n<span class="t-c"># и один раз перезагружает данные</span>\n<span class="t-p">$</span> java -jar paper.jar --nogui\n<span class="t-ok">[VirusSwords] Enabling VirusSwords v1.0.0</span><span class="term-caret" aria-hidden="true"></span></code></pre>', 1))
          ]),
          createBaseVNode("figure", _hoisted_5, [
            createBaseVNode("figcaption", _hoisted_6, [
              _cache[5] || (_cache[5] = createBaseVNode("span", {
                class: "term-dots",
                "aria-hidden": "true"
              }, [
                createBaseVNode("i"),
                createBaseVNode("i"),
                createBaseVNode("i")
              ], -1)),
              _cache[6] || (_cache[6] = createTextVNode("Главное в config.yml ", -1)),
              createBaseVNode("button", {
                type: "button",
                class: "term-copy",
                onClick: _cache[1] || (_cache[1] = ($event) => copy($event, "config", false))
              }, toDisplayString(copied.value === "config" ? "Скопировано" : "Копировать"), 1)
            ]),
            createBaseVNode("pre", _hoisted_7, [
              createBaseVNode("code", null, [
                (openBlock(), createElementBlock(Fragment, null, renderList(CONFIG, ([key, value, note], i) => {
                  return openBlock(), createElementBlock(Fragment, { key: i }, [
                    createBaseVNode("span", _hoisted_8, toDisplayString(key), 1),
                    _cache[8] || (_cache[8] = createTextVNode(":", -1)),
                    value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                      _cache[7] || (_cache[7] = createTextVNode()),
                      createBaseVNode("span", _hoisted_9, toDisplayString(value), 1)
                    ], 64)) : createCommentVNode("", true),
                    note ? (openBlock(), createElementBlock("span", _hoisted_10, "  # " + toDisplayString(note), 1)) : createCommentVNode("", true),
                    _cache[9] || (_cache[9] = createTextVNode("\n", -1))
                  ], 64);
                }), 64))
              ])
            ])
          ])
        ]),
        createBaseVNode("p", _hoisted_11, toDisplayString(copied.value ? "Скопировано в буфер обмена" : ""), 1)
      ]);
    };
  }
};
const _hoisted_1 = { class: "shell" };
const _hoisted_2 = {
  id: "main",
  tabindex: "-1"
};
const _sfc_main = {
  __name: "App",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createVNode(_sfc_main$m),
        createVNode(_sfc_main$l),
        _cache[0] || (_cache[0] = createBaseVNode("a", {
          class: "skip",
          href: "#main"
        }, "Перейти к содержанию", -1)),
        createVNode(_sfc_main$y),
        createBaseVNode("div", _hoisted_1, [
          createBaseVNode("main", _hoisted_2, [
            createVNode(_sfc_main$u),
            createVNode(_sfc_main$c),
            createVNode(_sfc_main$f),
            createVNode(_sfc_main$e),
            createVNode(_sfc_main$d),
            createVNode(_sfc_main$b),
            createVNode(_sfc_main$9),
            createVNode(_sfc_main$6),
            createVNode(_sfc_main$5),
            createVNode(_sfc_main$3),
            createVNode(_sfc_main$2),
            createVNode(_sfc_main$1)
          ])
        ]),
        createVNode(_sfc_main$h),
        createVNode(_sfc_main$n),
        createVNode(_sfc_main$k),
        createVNode(_sfc_main$j),
        createVNode(_sfc_main$i)
      ], 64);
    };
  }
};
createApp(_sfc_main).mount("#app");
const edges = (el) => {
  const max = el.scrollWidth - el.clientWidth;
  el.classList.toggle("more-left", max > 1 && el.scrollLeft > 1);
  el.classList.toggle("more-right", max > 1 && el.scrollLeft < max - 1);
};
let queued = false;
const markAll = () => {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    document.querySelectorAll(".tbl").forEach(edges);
  });
};
document.addEventListener("scroll", (e) => {
  var _a;
  if ((_a = e.target.classList) == null ? void 0 : _a.contains("tbl")) edges(e.target);
}, { capture: true, passive: true });
addEventListener("resize", markAll);
new MutationObserver(markAll).observe(document.getElementById("app"), { childList: true, subtree: true });
markAll();
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#w-"]');
  if (!a || e.ctrlKey || e.metaKey || e.shiftKey) return;
  const id = a.getAttribute("href").slice(3);
  if (!item(id)) return;
  e.preventDefault();
  openItem(id);
});
nextTick(() => {
  var _a, _b;
  const hash = location.hash.slice(1);
  if (hash.startsWith("w-") && item(hash.slice(2))) {
    (_a = document.getElementById(hash)) == null ? void 0 : _a.scrollIntoView({ block: "center" });
    openItem(hash.slice(2));
  } else if (hash) (_b = document.getElementById(hash)) == null ? void 0 : _b.scrollIntoView();
});
