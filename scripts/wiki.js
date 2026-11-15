const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./soft3d.js","./data.js","./model3d.js","./three.js"])))=>i.map(i=>d[i]);
import { r as reactive, c as computed, w as watch, n as nextTick, o as onMounted, a as onBeforeUnmount, b as openBlock, d as createElementBlock, e as createBaseVNode, u as unref, f as withDirectives, v as vModelText, F as Fragment, g as renderList, h as createTextVNode, t as toDisplayString, i as createCommentVNode, j as normalizeClass, k as ref, l as normalizeStyle, m as withModifiers, p as renderSlot, q as createVNode, s as withCtx, x as vShow, y as createBlock, z as resolveDynamicComponent, T as Transition, A as withKeys, B as vModelSelect, C as createStaticVNode, D as vModelCheckbox, E as createApp } from "./vue.js";
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
const HIDDEN_ABILITIES = /* @__PURE__ */ new Set(["celestial", "architect"]);
const abilityRows = data.items.filter((i) => i.kind === "weapon" && !HIDDEN_ABILITIES.has(i.id)).flatMap((i) => (i.abilities || []).filter((a) => a.name && !a.name.includes("?")).map((a, n) => ({ key: `ability-${i.id}-${n}`, type: "ability", name: a.name, note: i.name, icon: i.icon, id: i.id, href: `#w-${i.id}` })));
const bloodRows = (data.blood || []).map((b) => ({ key: `blood-${b.id}`, type: "blood", name: b.title, note: "родословная", colour: b.colour, id: "blood", href: "#blood" }));
const sectionRows = (sections) => sections.map(([id, title]) => ({ key: `section-${id}`, type: "section", name: title, note: "раздел", id, href: `#${id}` }));
const byName = (rows, q) => rows.filter((r) => norm(r.name).includes(q)).sort((a, b) => (norm(a.name).startsWith(q) ? 0 : 1) - (norm(b.name).startsWith(q) ? 0 : 1));
function searchGroups(sections = []) {
  const q = filters.query;
  if (!q) return [];
  const items = found.value.map((i) => ({ key: `item-${i.id}`, type: "item", name: i.name, note: i.kind === "weapon" ? "клинок" : "материал", icon: i.icon, id: i.id, href: `#w-${i.id}` }));
  return [
    { key: "sections", label: "Разделы", rows: byName(sectionRows(sections), q) },
    { key: "items", label: "Предметы", rows: items },
    { key: "abilities", label: "Способности", rows: byName(abilityRows, q) },
    { key: "blood", label: "Родословные", rows: byName(bloodRows, q) }
  ].filter((g) => g.rows.length);
}
function nearestNames(sections = []) {
  const q = filters.query.trim();
  if (q.length < 3 || searchGroups(sections).length) return [];
  const names = /* @__PURE__ */ new Set([
    ...sections.map((s) => s[1]),
    ...data.items.filter((i) => i.kind === "weapon" || i.kind === "material").map((i) => i.name),
    ...abilityRows.map((a) => a.name),
    ...bloodRows.map((b) => b.name)
  ]);
  const limit = Math.max(2, Math.floor(q.length / 3));
  return [...names].map((name) => {
    const n = norm(name);
    return { name, d: Math.min(distance(q, n), ...n.split(/[\s-]+/).filter((w) => w.length > 2).map((w) => distance(q, w))) };
  }).filter((s) => s.d <= limit).sort((a, b) => a.d - b.d).slice(0, 3).map((s) => s.name);
}
const order = [.../* @__PURE__ */ new Set([...data.chains.flatMap((c) => c.entries.map((e) => e.id)), ...data.items.filter((i) => i.kind === "material").map((i) => i.id)])];
const shownIds = computed(() => new Set([...weapons.value, ...materials.value].map((i) => i.id)));
const inspector = reactive({ id: null });
const safe = (fn) => {
  try {
    fn();
  } catch (e) {
  }
};
const plain = () => location.pathname + location.search;
const openItem = (id) => {
  const first = !inspector.id;
  inspector.id = id;
  safe(() => {
    var _a;
    if (!first || ((_a = history.state) == null ? void 0 : _a.card)) {
      history.replaceState({ card: true }, "", `#w-${id}`);
      return;
    }
    if (location.hash === `#w-${id}`) history.replaceState(null, "", plain());
    history.pushState({ card: true }, "", `#w-${id}`);
  });
};
const closeItem = () => {
  var _a;
  if ((_a = history.state) == null ? void 0 : _a.card) {
    history.back();
    return;
  }
  inspector.id = null;
  safe(() => history.replaceState(null, "", plain()));
};
addEventListener("popstate", () => {
  var _a;
  const id = location.hash.startsWith("#w-") ? location.hash.slice(3) : null;
  if (id && item(id)) {
    inspector.id = id;
    if (!((_a = history.state) == null ? void 0 : _a.card)) safe(() => history.replaceState({ card: true }, "", location.hash));
  } else inspector.id = null;
});
const compare = reactive({ id: null });
const pageUrl = () => location.href.split(/[?#]/)[0];
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _hoisted_1$z = { class: "topbar" };
const _hoisted_2$w = { class: "topbar-in" };
const _hoisted_3$u = {
  class: "brand",
  href: "#top"
};
const _hoisted_4$s = ["src"];
const _hoisted_5$r = ["aria-expanded", "aria-activedescendant"];
const _hoisted_6$r = ["title"];
const _hoisted_7$r = {
  key: 0,
  class: "found-box"
};
const _hoisted_8$q = {
  key: 0,
  id: "found",
  class: "found",
  role: "listbox",
  "aria-label": "Результаты поиска"
};
const _hoisted_9$m = ["aria-labelledby"];
const _hoisted_10$l = ["id"];
const _hoisted_11$j = ["id", "aria-selected"];
const _hoisted_12$j = ["href", "onMouseenter", "onClick"];
const _hoisted_13$i = ["src"];
const _hoisted_14$f = ["title"];
const _hoisted_15$c = ["title"];
const _hoisted_16$c = {
  key: 1,
  class: "found-none"
};
const _hoisted_17$c = {
  class: "search-hint",
  "aria-live": "polite"
};
const _hoisted_18$c = {
  key: 2,
  class: "search-suggest"
};
const _hoisted_19$b = ["onClick"];
const _hoisted_20$b = {
  key: 1,
  class: "search-hint"
};
const _hoisted_21$9 = ["href", "aria-current"];
const _hoisted_22$8 = {
  key: 0,
  class: "count"
};
const SHOWN = 8;
const KEPT = 2;
const _sfc_main$D = {
  __name: "SideNav",
  setup(__props) {
    const sections = [
      ["catalog", "Каталог", data.items.length],
      ["start", "С чего начать"],
      ["rarity", "Редкости"],
      ["weapons", "Линии клинков", data.counts.weapons],
      ["compare", "Сравнение клинков", data.counts.weapons],
      ["craft", "Крафт", data.recipes.length],
      ["growth", "Рост клинка"],
      ["sanctums", "Святилища", 5],
      ["raids", "Испытания"],
      ["bestiary", "Бестиарий", 20],
      ["blood", "Родословные", data.blood.length],
      ["path", "Мой путь"],
      ["trophies", "Достижения", data.counts.trophies],
      ["faq", "Частые вопросы"],
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
    const groups = computed(() => searchGroups(sections));
    const total = computed(() => groups.value.reduce((n, g) => n + g.rows.length, 0));
    const shown = computed(() => {
      const take2 = groups.value.map((g) => Math.min(KEPT, g.rows.length));
      let room = SHOWN - take2.reduce((a, b) => a + b, 0);
      groups.value.forEach((g, k) => {
        const more = Math.max(0, Math.min(room, g.rows.length - take2[k]));
        take2[k] += more;
        room -= more;
      });
      let n = 0;
      return groups.value.map((g, k) => ({ ...g, rows: g.rows.slice(0, take2[k]).map((row) => ({ ...row, n: n++ })) })).filter((g) => g.rows.length);
    });
    const flat = computed(() => shown.value.flatMap((g) => g.rows));
    const nearest = computed(() => nearestNames(sections));
    const anyAchievements = computed(() => achievementGroups.value.length > 0);
    watch(flat, (list) => {
      if (cursor.value >= list.length) cursor.value = 0;
    });
    async function jump(row) {
      var _a, _b;
      search.value = "";
      onSearch();
      listOpen.value = false;
      (_a = input.value) == null ? void 0 : _a.blur();
      await nextTick();
      if (location.hash === row.href) (_b = document.getElementById(row.id)) == null ? void 0 : _b.scrollIntoView();
      else location.hash = row.href;
    }
    function take(row) {
      if (row.type === "item" || row.type === "ability") {
        openItem(row.id);
        listOpen.value = false;
      } else jump(row);
    }
    function choose(row, e) {
      if (row.type === "item" || row.type === "ability") {
        listOpen.value = false;
        return;
      }
      if (e.ctrlKey || e.metaKey || e.shiftKey) return;
      e.preventDefault();
      jump(row);
    }
    function onSearchKey(e) {
      const list = flat.value;
      if (e.key === "ArrowDown" && list.length) {
        e.preventDefault();
        if (!listOpen.value) listOpen.value = true;
        else cursor.value = (cursor.value + 1) % list.length;
      } else if (e.key === "ArrowUp" && list.length) {
        e.preventDefault();
        cursor.value = (cursor.value - 1 + list.length) % list.length;
      } else if (e.key === "Home" && list.length && listOpen.value) {
        e.preventDefault();
        cursor.value = 0;
      } else if (e.key === "End" && list.length && listOpen.value) {
        e.preventDefault();
        cursor.value = list.length - 1;
      } else if (e.key === "Enter" && list.length && listOpen.value) {
        e.preventDefault();
        take(list[cursor.value] || list[0]);
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
    watch(cursor, (k) => nextTick(() => {
      var _a;
      return (_a = document.getElementById(`found-${k}`)) == null ? void 0 : _a.scrollIntoView({ block: "nearest" });
    }));
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
      if (link) row.scrollTo({ left: link.offsetLeft - row.clientWidth / 2 + link.offsetWidth / 2, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
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
      if (el) el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
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
      return openBlock(), createElementBlock("header", _hoisted_1$z, [
        createBaseVNode("div", _hoisted_2$w, [
          createBaseVNode("a", _hoisted_3$u, [
            createBaseVNode("img", {
              class: "brand-mark",
              src: unref(data).icons.forge_heart,
              alt: ""
            }, null, 8, _hoisted_4$s),
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
              "aria-haspopup": "listbox",
              "aria-expanded": String(listOpen.value && flat.value.length > 0),
              "aria-autocomplete": "list",
              "aria-activedescendant": listOpen.value && flat.value.length ? `found-${cursor.value}` : void 0,
              onInput: onSearch,
              onFocus: _cache[1] || (_cache[1] = ($event) => listOpen.value = true),
              onKeydown: onSearchKey
            }, null, 40, _hoisted_5$r), [
              [vModelText, search.value]
            ]),
            createBaseVNode("kbd", {
              class: "search-key",
              "aria-hidden": "true",
              title: `Поиск: / или ${unref(mac) ? "⌘K" : "Ctrl+K"}`
            }, "/", 8, _hoisted_6$r),
            listOpen.value && unref(filters).query ? (openBlock(), createElementBlock("div", _hoisted_7$r, [
              flat.value.length ? (openBlock(), createElementBlock("div", _hoisted_8$q, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(shown.value, (g) => {
                  return openBlock(), createElementBlock("div", {
                    key: g.key,
                    class: "found-group",
                    role: "group",
                    "aria-labelledby": `found-g-${g.key}`
                  }, [
                    createBaseVNode("div", {
                      id: `found-g-${g.key}`,
                      class: "found-label",
                      role: "presentation"
                    }, toDisplayString(g.label), 9, _hoisted_10$l),
                    (openBlock(true), createElementBlock(Fragment, null, renderList(g.rows, (row) => {
                      return openBlock(), createElementBlock("div", {
                        id: `found-${row.n}`,
                        key: row.key,
                        role: "option",
                        "aria-selected": String(row.n === cursor.value)
                      }, [
                        createBaseVNode("a", {
                          href: row.href,
                          class: normalizeClass(["found-item", { on: row.n === cursor.value }]),
                          tabindex: "-1",
                          onMouseenter: ($event) => cursor.value = row.n,
                          onClick: ($event) => choose(row, $event)
                        }, [
                          row.icon ? (openBlock(), createElementBlock("img", {
                            key: 0,
                            src: row.icon,
                            alt: ""
                          }, null, 8, _hoisted_13$i)) : (openBlock(), createElementBlock("span", {
                            key: 1,
                            class: normalizeClass(["found-mark", row.type]),
                            style: normalizeStyle(row.colour ? { background: row.colour } : void 0),
                            "aria-hidden": "true"
                          }, null, 6)),
                          createBaseVNode("span", {
                            class: "found-name",
                            title: row.name
                          }, toDisplayString(row.name), 9, _hoisted_14$f),
                          createBaseVNode("span", {
                            class: "found-kind",
                            title: row.note
                          }, toDisplayString(row.note), 9, _hoisted_15$c)
                        ], 42, _hoisted_12$j)
                      ], 8, _hoisted_11$j);
                    }), 128))
                  ], 8, _hoisted_9$m);
                }), 128))
              ])) : (openBlock(), createElementBlock("p", _hoisted_16$c, "Ничего не найдено")),
              createBaseVNode("p", _hoisted_17$c, [
                flat.value.length || anyAchievements.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                  createTextVNode(toDisplayString(unref(hint)), 1)
                ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                  createTextVNode("По запросу «" + toDisplayString(search.value.trim()) + "» ничего нет", 1)
                ], 64)),
                total.value > flat.value.length ? (openBlock(), createElementBlock(Fragment, { key: 2 }, [
                  createTextVNode(". Показано " + toDisplayString(flat.value.length) + " из " + toDisplayString(total.value) + ", предметы подсвечены на странице", 1)
                ], 64)) : createCommentVNode("", true)
              ]),
              nearest.value.length ? (openBlock(), createElementBlock("p", _hoisted_18$c, [
                _cache[6] || (_cache[6] = createTextVNode("Возможно, вы искали: ", -1)),
                (openBlock(true), createElementBlock(Fragment, null, renderList(nearest.value, (name) => {
                  return openBlock(), createElementBlock("button", {
                    key: name,
                    type: "button",
                    class: "suggest-chip",
                    onMousedown: _cache[2] || (_cache[2] = withModifiers(() => {
                    }, ["prevent"])),
                    onClick: ($event) => suggest(name)
                  }, toDisplayString(name), 41, _hoisted_19$b);
                }), 128))
              ])) : createCommentVNode("", true)
            ])) : unref(filters).query ? (openBlock(), createElementBlock("p", _hoisted_20$b, [
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
                  count ? (openBlock(), createElementBlock("span", _hoisted_22$8, toDisplayString(count), 1)) : createCommentVNode("", true)
                ], 10, _hoisted_21$9);
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
const SideNav = /* @__PURE__ */ _export_sfc(_sfc_main$D, [["__scopeId", "data-v-2da65d61"]]);
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
const _sfc_main$C = {
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
const _hoisted_1$y = { class: "tip" };
const _hoisted_2$v = ["innerHTML"];
const _hoisted_3$t = { class: "tlore" };
const _hoisted_4$r = {
  key: 0,
  class: "gap"
};
const _hoisted_5$q = ["innerHTML"];
const _hoisted_6$q = {
  key: 0,
  class: "tstats"
};
const _hoisted_7$q = { key: 0 };
const _hoisted_8$p = { class: "trar" };
const _sfc_main$B = {
  __name: "ItemTooltip",
  props: { item: { type: Object, required: true } },
  setup(__props) {
    const props = __props;
    const stats = computed(() => props.item.stats.split(/(\d+(?:\.\d+)?)/));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$y, [
        createBaseVNode("div", {
          class: "tname paint",
          style: normalizeStyle(unref(rarityStyle)(__props.item.rarity)),
          innerHTML: __props.item.name
        }, null, 12, _hoisted_2$v),
        createBaseVNode("div", _hoisted_3$t, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(__props.item.lore, (line, i) => {
            return openBlock(), createElementBlock(Fragment, { key: i }, [
              line === "" ? (openBlock(), createElementBlock("div", _hoisted_4$r)) : (openBlock(), createElementBlock("div", {
                key: 1,
                innerHTML: line
              }, null, 8, _hoisted_5$q))
            ], 64);
          }), 128))
        ]),
        __props.item.stats ? (openBlock(), createElementBlock("div", _hoisted_6$q, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(stats.value, (part, i) => {
            return openBlock(), createElementBlock(Fragment, { key: i }, [
              i % 2 ? (openBlock(), createElementBlock("b", _hoisted_7$q, toDisplayString(part), 1)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                createTextVNode(toDisplayString(part), 1)
              ], 64))
            ], 64);
          }), 128))
        ])) : createCommentVNode("", true),
        createBaseVNode("div", _hoisted_8$p, [
          _cache[0] || (_cache[0] = createTextVNode("Редкость: ", -1)),
          createVNode(_sfc_main$C, {
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
const _hoisted_1$x = ["aria-label"];
const _hoisted_2$u = {
  class: "mstage-circle",
  viewBox: "-130 -130 260 260",
  "aria-hidden": "true"
};
const _hoisted_3$s = { class: "mstage-spin" };
const _hoisted_4$q = ["y2", "transform"];
const _hoisted_5$p = ["transform"];
const _hoisted_6$p = ["x", "y"];
const _hoisted_7$p = ["src"];
const _hoisted_8$o = {
  key: 1,
  class: "mstage-hint",
  "aria-hidden": "true"
};
const _sfc_main$A = {
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
        "aria-label": flat.value ? __props.item.name : `${__props.item.name}: модель, поворачивается перетаскиванием или стрелками`,
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
        (openBlock(), createElementBlock("svg", _hoisted_2$u, [
          createBaseVNode("g", _hoisted_3$s, [
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
              }, null, 8, _hoisted_4$q);
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
                  }, null, 8, _hoisted_6$p);
                }), 128))
              ], 8, _hoisted_5$p);
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
          }, null, 8, _hoisted_7$p)
        ])) : createCommentVNode("", true),
        !flat.value ? (openBlock(), createElementBlock("span", _hoisted_8$o, [..._cache[5] || (_cache[5] = [
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
      ], 46, _hoisted_1$x);
    };
  }
};
const _hoisted_1$w = { class: "hero-text" };
const _hoisted_2$t = { class: "facts" };
const _hoisted_3$r = { href: "#catalog" };
const _hoisted_4$p = { href: "#catalog" };
const _hoisted_5$o = { href: "#blood" };
const _hoisted_6$o = { href: "#trophies" };
const _hoisted_7$o = { class: "stage" };
const _hoisted_8$n = { class: "hero-model" };
const _hoisted_9$l = {
  class: "stage-tip",
  "aria-live": "polite"
};
const _hoisted_10$k = { class: "hotbar-wrap" };
const _hoisted_11$i = ["aria-label", "aria-pressed", "onClick"];
const _hoisted_12$i = ["src"];
const _hoisted_13$h = {
  class: "hkey",
  "aria-hidden": "true"
};
const SIZE = 320;
const _sfc_main$z = {
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
        createBaseVNode("div", _hoisted_1$w, [
          _cache[3] || (_cache[3] = createBaseVNode("p", { class: "hero-kicker" }, "Вики плагина VirusSwords для Paper 1.21.11", -1)),
          _cache[4] || (_cache[4] = createBaseVNode("h1", null, [
            createBaseVNode("span", { class: "h1-line" }, "Кодекс"),
            createTextVNode(),
            createBaseVNode("span", { class: "h1-line" }, "VirusSwords")
          ], -1)),
          _cache[5] || (_cache[5] = createBaseVNode("p", { class: "lead" }, "Клинки находят в мире, куют из душ и доводят до последней формы у алтарей святилищ. Здесь — что умеет каждый клинок, откуда он берётся, как растёт и кто стережёт святилища.", -1)),
          createBaseVNode("ul", _hoisted_2$t, [
            createBaseVNode("li", null, [
              createBaseVNode("a", _hoisted_3$r, [
                createBaseVNode("b", null, toDisplayString(unref(data).counts.weapons), 1),
                createTextVNode(toDisplayString(unref(data).words.weapons), 1)
              ])
            ]),
            createBaseVNode("li", null, [
              createBaseVNode("a", _hoisted_4$p, [
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
              createBaseVNode("a", _hoisted_5$o, [
                createBaseVNode("b", null, toDisplayString(unref(data).blood.length), 1),
                _cache[1] || (_cache[1] = createTextVNode("родословных", -1))
              ])
            ]),
            createBaseVNode("li", null, [
              createBaseVNode("a", _hoisted_6$o, [
                createBaseVNode("b", null, toDisplayString(unref(data).counts.trophies), 1),
                createTextVNode(toDisplayString(unref(data).words.trophies), 1)
              ])
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_7$o, [
          createBaseVNode("div", _hoisted_8$n, [
            createVNode(_sfc_main$A, {
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
          createBaseVNode("div", _hoisted_9$l, [
            createVNode(_sfc_main$B, { item: held.value }, null, 8, ["item"]),
            createBaseVNode("button", {
              type: "button",
              class: "text-btn",
              onClick: _cache[0] || (_cache[0] = ($event) => unref(openItem)(held.value.id))
            }, "Открыть карточку клинка")
          ])
        ]),
        createBaseVNode("div", _hoisted_10$k, [
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
                }, null, 8, _hoisted_12$i),
                createBaseVNode("span", _hoisted_13$h, toDisplayString(i + 1), 1)
              ], 10, _hoisted_11$i);
            }), 128))
          ], 32),
          _cache[6] || (_cache[6] = createBaseVNode("p", { class: "hotbar-note" }, [
            createBaseVNode("span", { class: "for-mouse" }, "Клавиши 1–9 или колесо мыши выбирают клинок, повторный клик открывает его карточку."),
            createBaseVNode("span", { class: "for-touch" }, "Коснитесь клинка, чтобы выбрать его; второе касание открывает карточку. Ряд листается в сторону.")
          ], -1))
        ])
      ], 4);
    };
  }
};
const _hoisted_1$v = ["aria-label"];
const _hoisted_2$s = { class: "craft-table" };
const _hoisted_3$q = { class: "craft-grid" };
const _hoisted_4$o = ["href", "title"];
const _hoisted_5$n = ["src", "alt"];
const _hoisted_6$n = ["title"];
const _hoisted_7$n = ["src", "alt"];
const _hoisted_8$m = {
  key: 2,
  class: "cslot"
};
const _hoisted_9$k = ["title"];
const _hoisted_10$j = ["src", "alt"];
const _hoisted_11$h = { key: 0 };
const _hoisted_12$h = ["href"];
const _hoisted_13$g = {
  key: 0,
  class: "note"
};
const _sfc_main$y = {
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
        createBaseVNode("div", _hoisted_2$s, [
          createBaseVNode("div", _hoisted_3$q, [
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
                  }, null, 8, _hoisted_5$n)
                ], 10, _hoisted_4$o)) : c ? (openBlock(), createElementBlock("span", {
                  key: 1,
                  class: "cslot",
                  title: c.name
                }, [
                  createBaseVNode("img", {
                    src: c.icon,
                    alt: c.name
                  }, null, 8, _hoisted_7$n)
                ], 8, _hoisted_6$n)) : (openBlock(), createElementBlock("span", _hoisted_8$m))
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
            }, null, 8, _hoisted_10$j)
          ], 8, _hoisted_9$k)
        ]),
        !__props.small ? (openBlock(), createElementBlock("figcaption", _hoisted_11$h, [
          createBaseVNode("b", null, [
            ((_e = result.value) == null ? void 0 : _e.ours) ? (openBlock(), createElementBlock("a", {
              key: 0,
              href: result.value.href
            }, toDisplayString(result.value.name), 9, _hoisted_12$h)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
              createTextVNode(toDisplayString((_f = result.value) == null ? void 0 : _f.name), 1)
            ], 64))
          ]),
          __props.recipe.note ? (openBlock(), createElementBlock("span", _hoisted_13$g, toDisplayString(__props.recipe.note), 1)) : createCommentVNode("", true)
        ])) : createCommentVNode("", true)
      ], 10, _hoisted_1$v);
    };
  }
};
const _hoisted_1$u = { class: "abilities" };
const _hoisted_2$r = { class: "chips" };
const _hoisted_3$p = {
  key: 0,
  class: "chip"
};
const _hoisted_4$n = {
  viewBox: "0 0 16 16",
  "aria-hidden": "true"
};
const _hoisted_5$m = {
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
const _hoisted_6$m = ["d", "fill", "stroke-width"];
const _hoisted_7$m = {
  key: 1,
  class: "chip rest"
};
const _hoisted_8$l = ["innerHTML"];
const _sfc_main$x = {
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
      return openBlock(), createElementBlock("div", _hoisted_1$u, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(__props.abilities, (a) => {
          return openBlock(), createElementBlock("article", {
            key: a.name,
            class: "ability",
            style: normalizeStyle({ "--c": a.colour })
          }, [
            createBaseVNode("header", null, [
              createBaseVNode("h4", null, toDisplayString(a.name), 1),
              createBaseVNode("div", _hoisted_2$r, [
                a.trigger ? (openBlock(), createElementBlock("span", _hoisted_3$p, [
                  (openBlock(), createElementBlock("svg", _hoisted_4$n, [
                    mouse(a.kind) ? (openBlock(), createElementBlock("rect", _hoisted_5$m)) : createCommentVNode("", true),
                    createBaseVNode("path", {
                      d: ICONS[a.kind],
                      fill: a.kind === "hit" || a.kind === "other" ? "none" : "currentColor",
                      stroke: "currentColor",
                      "stroke-width": a.kind === "hit" || a.kind === "other" || a.kind === "hold" ? 1.4 : 0,
                      "stroke-linecap": "round"
                    }, null, 8, _hoisted_6$m)
                  ])),
                  createTextVNode(toDisplayString(a.trigger), 1)
                ])) : createCommentVNode("", true),
                a.rest ? (openBlock(), createElementBlock("span", _hoisted_7$m, [
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
            }, null, 8, _hoisted_8$l)) : createCommentVNode("", true)
          ], 4);
        }), 128))
      ]);
    };
  }
};
const _hoisted_1$t = ["id", "href", "title", "aria-label"];
const _hoisted_2$q = { class: "islot-cell" };
const _hoisted_3$o = ["src"];
const _hoisted_4$m = {
  key: 0,
  class: "islot-name"
};
const _sfc_main$w = {
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
        createBaseVNode("span", _hoisted_2$q, [
          createBaseVNode("img", {
            src: __props.item.icon,
            alt: "",
            loading: "lazy"
          }, null, 8, _hoisted_3$o)
        ]),
        __props.named ? (openBlock(), createElementBlock("span", _hoisted_4$m, toDisplayString(__props.item.name), 1)) : createCommentVNode("", true)
      ], 14, _hoisted_1$t);
    };
  }
};
const _hoisted_1$s = ["aria-label"];
const _hoisted_2$p = {
  key: 0,
  class: "price-title"
};
const _hoisted_3$n = ["href"];
const _hoisted_4$l = { class: "price-head" };
const _hoisted_5$l = { class: "price-when" };
const _hoisted_6$l = {
  class: "price-row",
  "aria-hidden": "true"
};
const _hoisted_7$l = ["href", "title"];
const _hoisted_8$k = ["src"];
const _hoisted_9$j = ["src"];
const _hoisted_10$i = {
  key: 0,
  class: "pcount"
};
const _hoisted_11$g = ["title"];
const _hoisted_12$g = ["src"];
const _hoisted_13$f = { class: "price-words" };
const _hoisted_14$e = {
  key: 1,
  class: "price-owner"
};
const _sfc_main$v = {
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
        __props.boxed ? (openBlock(), createElementBlock("figcaption", _hoisted_2$p, [
          createBaseVNode("a", {
            href: result.value.href
          }, toDisplayString(result.value.name), 9, _hoisted_3$n)
        ])) : createCommentVNode("", true),
        createBaseVNode("p", _hoisted_4$l, [
          createBaseVNode("b", null, toDisplayString(verb.value), 1),
          createTextVNode(" — " + toDisplayString(__props.entry.at), 1),
          when.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
            _cache[0] || (_cache[0] = createTextVNode(". ", -1)),
            createBaseVNode("span", _hoisted_5$l, toDisplayString(when.value), 1)
          ], 64)) : createCommentVNode("", true)
        ]),
        createBaseVNode("div", _hoisted_6$l, [
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
              }, null, 8, _hoisted_8$k)
            ], 8, _hoisted_7$l),
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
                }, null, 8, _hoisted_9$j),
                c.n > 1 ? (openBlock(), createElementBlock("span", _hoisted_10$i, toDisplayString(c.n), 1)) : createCommentVNode("", true)
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
            }, null, 8, _hoisted_12$g)
          ], 8, _hoisted_11$g)
        ]),
        createBaseVNode("p", _hoisted_13$f, toDisplayString(spoken.value), 1),
        __props.boxed && owner.value ? (openBlock(), createElementBlock("p", _hoisted_14$e, "Признаёт: " + toDisplayString(owner.value), 1)) : createCommentVNode("", true)
      ], 10, _hoisted_1$s);
    };
  }
};
const _sfc_main$u = {
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
const _hoisted_1$r = { class: "card-top" };
const _hoisted_2$o = {
  key: 0,
  class: "versus"
};
const _hoisted_3$m = { class: "versus-pic" };
const _hoisted_4$k = ["src"];
const _hoisted_5$k = { class: "versus-body" };
const _hoisted_6$k = { class: "versus-title" };
const _hoisted_7$k = { class: "versus-nums" };
const _hoisted_8$j = {
  key: 1,
  class: "statbars"
};
const _hoisted_9$i = { class: "statbar-label" };
const _hoisted_10$h = {
  class: "statbar-track",
  "aria-hidden": "true"
};
const _hoisted_11$f = { class: "statbar-value" };
const _hoisted_12$f = {
  key: 2,
  class: "card-owner"
};
const _hoisted_13$e = {
  key: 4,
  class: "no-abil"
};
const _hoisted_14$d = { class: "obtain" };
const _hoisted_15$b = { class: "obtain-head" };
const _hoisted_16$b = ["href"];
const _hoisted_17$b = ["innerHTML"];
const _hoisted_18$b = ["innerHTML"];
const _hoisted_19$a = {
  key: 5,
  class: "card-chain"
};
const _hoisted_20$a = { class: "chain-row" };
const _hoisted_21$8 = ["data-key"];
const _hoisted_22$7 = { class: "chain-row" };
const _hoisted_23$7 = {
  key: 0,
  class: "energy",
  "aria-hidden": "true"
};
const _hoisted_24$5 = {
  key: 1,
  class: "arrow",
  "aria-hidden": "true"
};
const _hoisted_25$5 = { class: "card-give" };
const _hoisted_26$5 = {
  class: "sr-only",
  "aria-live": "polite"
};
const _sfc_main$t = {
  __name: "ItemCard",
  props: { item: { type: Object, required: true } },
  setup(__props) {
    const props = __props;
    const recipe = computed(() => props.item.recipe ? data.recipes.find((r) => r.result === props.item.id) : null);
    const command = computed(() => `/swords give ${props.item.id}`);
    const given = ref(false);
    watch(() => props.item.id, () => {
      given.value = false;
    });
    async function copyCommand() {
      try {
        await navigator.clipboard.writeText(command.value);
        given.value = true;
      } catch (e) {
        return;
      }
      setTimeout(() => {
        given.value = false;
      }, 1600);
    }
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
        createBaseVNode("div", _hoisted_1$r, [
          createVNode(_sfc_main$A, {
            item: __props.item,
            size: "card"
          }, null, 8, ["item"]),
          createVNode(_sfc_main$B, { item: __props.item }, null, 8, ["item"])
        ]),
        rival.value ? (openBlock(), createElementBlock("div", _hoisted_2$o, [
          createBaseVNode("span", _hoisted_3$m, [
            createBaseVNode("img", {
              src: rival.value.icon,
              alt: ""
            }, null, 8, _hoisted_4$k)
          ]),
          createBaseVNode("div", _hoisted_5$k, [
            createBaseVNode("p", _hoisted_6$k, [
              _cache[1] || (_cache[1] = createTextVNode("Против: ", -1)),
              createBaseVNode("b", null, toDisplayString(rival.value.name), 1)
            ]),
            createBaseVNode("p", _hoisted_7$k, [
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
        bars.value.length ? (openBlock(), createElementBlock("div", _hoisted_8$j, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(bars.value, (b) => {
            return openBlock(), createElementBlock("div", {
              key: b.label,
              class: "statbar"
            }, [
              createBaseVNode("span", _hoisted_9$i, toDisplayString(b.label), 1),
              createBaseVNode("span", _hoisted_10$h, [
                createBaseVNode("span", {
                  class: "statbar-fill",
                  style: normalizeStyle({ width: `${Math.round(b.share * 100)}%` })
                }, null, 4)
              ]),
              createBaseVNode("b", _hoisted_11$f, toDisplayString(b.value), 1)
            ]);
          }), 128)),
          createBaseVNode("button", {
            type: "button",
            class: "text-btn pin-btn",
            onClick: togglePin
          }, toDisplayString(unref(compare).id === __props.item.id ? "Убрать из сравнения" : "Сравнить с другими клинками"), 1)
        ])) : createCommentVNode("", true),
        owner.value ? (openBlock(), createElementBlock("p", _hoisted_12$f, [
          owner.value.title ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
            createVNode(_sfc_main$u, {
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
        __props.item.abilities && __props.item.abilities.length ? (openBlock(), createBlock(_sfc_main$x, {
          key: 3,
          abilities: __props.item.abilities
        }, null, 8, ["abilities"])) : __props.item.kind === "weapon" ? (openBlock(), createElementBlock("p", _hoisted_13$e, "Способностей нет — только сталь: урон и скорость.")) : createCommentVNode("", true),
        createBaseVNode("div", _hoisted_14$d, [
          createBaseVNode("div", _hoisted_15$b, [
            _cache[3] || (_cache[3] = createBaseVNode("h3", null, "Как получить", -1)),
            createBaseVNode("a", {
              class: normalizeClass(["mbadge", `m-${__props.item.method}`]),
              href: recipe.value ? "#craft" : "#craft-other"
            }, toDisplayString(__props.item.methodLabel), 11, _hoisted_16$b)
          ]),
          recipe.value ? (openBlock(), createBlock(_sfc_main$y, {
            key: 0,
            recipe: recipe.value,
            small: ""
          }, null, 8, ["recipe"])) : createCommentVNode("", true),
          (openBlock(true), createElementBlock(Fragment, null, renderList(altars.value, (a, i) => {
            return openBlock(), createBlock(_sfc_main$v, {
              key: i,
              entry: a
            }, null, 8, ["entry"]);
          }), 128)),
          createBaseVNode("p", {
            class: normalizeClass(["obtain-text", { muted: altars.value.length }]),
            innerHTML: recipe.value ? recipe.value.note : __props.item.obtain
          }, null, 10, _hoisted_17$b),
          recipe.value && __props.item.obtain.includes(" или ") ? (openBlock(), createElementBlock("p", {
            key: 1,
            class: "obtain-text muted",
            innerHTML: __props.item.obtain
          }, null, 8, _hoisted_18$b)) : createCommentVNode("", true)
        ]),
        usedIn.value.length ? (openBlock(), createElementBlock("div", _hoisted_19$a, [
          _cache[4] || (_cache[4] = createBaseVNode("h3", null, "Нужен для", -1)),
          createBaseVNode("div", _hoisted_20$a, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(usedIn.value, (u) => {
              return openBlock(), createBlock(_sfc_main$w, {
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
            createBaseVNode("div", _hoisted_22$7, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(c.entries, (e, i) => {
                return openBlock(), createElementBlock("span", {
                  key: i,
                  class: "chain-step"
                }, [
                  e.sep === "→" ? (openBlock(), createElementBlock("span", _hoisted_23$7)) : e.sep ? (openBlock(), createElementBlock("span", _hoisted_24$5, toDisplayString(e.sep), 1)) : createCommentVNode("", true),
                  createVNode(_sfc_main$w, {
                    item: unref(item)(e.id)
                  }, null, 8, ["item"])
                ]);
              }), 128))
            ])
          ], 8, _hoisted_21$8);
        }), 128)),
        createBaseVNode("div", _hoisted_25$5, [
          _cache[5] || (_cache[5] = createBaseVNode("span", { class: "card-give-label" }, "Выдать (оператор)", -1)),
          createBaseVNode("code", null, toDisplayString(command.value), 1),
          createBaseVNode("button", {
            type: "button",
            class: "term-copy",
            onClick: copyCommand
          }, toDisplayString(given.value ? "Скопировано" : "Копировать"), 1),
          createBaseVNode("span", _hoisted_26$5, toDisplayString(given.value ? "Команда скопирована" : ""), 1)
        ])
      ], 4);
    };
  }
};
const _hoisted_1$q = {
  key: 0,
  class: "inspect-wrap"
};
const _hoisted_2$n = ["aria-label"];
const _hoisted_3$l = {
  class: "inspect-steps",
  "aria-label": "Соседние предметы"
};
const _hoisted_4$j = { class: "step-name" };
const _hoisted_5$j = ["src"];
const _hoisted_6$j = { class: "step-name" };
const _hoisted_7$j = ["src"];
const _hoisted_8$i = { class: "inspect-foot" };
const _hoisted_9$h = {
  class: "copied",
  "aria-live": "polite"
};
const _sfc_main$s = {
  __name: "Inspector",
  setup(__props) {
    const current = computed(() => inspector.id && item(inspector.id));
    const at = computed(() => order.indexOf(inspector.id));
    const prev = computed(() => at.value > 0 ? item(order[at.value - 1]) : null);
    const next = computed(() => at.value >= 0 && at.value < order.length - 1 ? item(order[at.value + 1]) : null);
    const panel = ref(null);
    let pullFrom = null, pulled = 0;
    function pullStart(e) {
      const el = panel.value;
      if (!el || el.scrollTop > 0 || e.target.closest(".mstage") || !matchMedia("(max-width: 640px)").matches) {
        pullFrom = null;
        return;
      }
      pullFrom = e.touches[0].clientY;
      pulled = 0;
    }
    function pullMove(e) {
      if (pullFrom === null) return;
      pulled = Math.max(0, e.touches[0].clientY - pullFrom);
      if (panel.value.scrollTop > 0) {
        pullFrom = null;
        pulled = 0;
      }
      panel.value.style.transform = pulled ? `translateY(${pulled}px)` : "";
      panel.value.style.transition = "none";
    }
    function pullEnd() {
      if (pullFrom === null) return;
      const el = panel.value;
      el.style.transition = "";
      if (pulled > 110) closeItem();
      else el.style.transform = "";
      pullFrom = null;
      pulled = 0;
    }
    const copied = ref("");
    async function copyLink() {
      const url = pageUrl() + "#w-" + inspector.id;
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
          current.value ? (openBlock(), createElementBlock("div", _hoisted_1$q, [
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
              tabindex: "-1",
              onTouchstartPassive: pullStart,
              onTouchmovePassive: pullMove,
              onTouchend: pullEnd,
              onTouchcancel: pullEnd
            }, [
              _cache[7] || (_cache[7] = createBaseVNode("span", {
                class: "inspect-grab",
                "aria-hidden": "true"
              }, null, -1)),
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
              (openBlock(), createBlock(_sfc_main$t, {
                key: current.value.id,
                item: current.value
              }, null, 8, ["item"])),
              createBaseVNode("nav", _hoisted_3$l, [
                prev.value ? (openBlock(), createElementBlock("button", {
                  key: 0,
                  type: "button",
                  class: "step-btn",
                  onClick: _cache[2] || (_cache[2] = ($event) => unref(openItem)(prev.value.id))
                }, [
                  _cache[5] || (_cache[5] = createBaseVNode("span", { class: "step-dir" }, "← Предыдущий", -1)),
                  createBaseVNode("span", _hoisted_4$j, [
                    createBaseVNode("img", {
                      src: prev.value.icon,
                      alt: ""
                    }, null, 8, _hoisted_5$j),
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
                  createBaseVNode("span", _hoisted_6$j, [
                    createBaseVNode("img", {
                      src: next.value.icon,
                      alt: ""
                    }, null, 8, _hoisted_7$j),
                    createTextVNode(toDisplayString(next.value.name), 1)
                  ])
                ])) : createCommentVNode("", true)
              ]),
              createBaseVNode("div", _hoisted_8$i, [
                createBaseVNode("button", {
                  type: "button",
                  class: "text-btn",
                  onClick: copyLink
                }, "Ссылка на карточку"),
                createBaseVNode("span", _hoisted_9$h, toDisplayString(copied.value), 1)
              ]),
              _cache[8] || (_cache[8] = createBaseVNode("p", { class: "inspect-keys" }, "Стрелки ← → листают карточки, Esc закрывает.", -1))
            ], 40, _hoisted_2$n)
          ])) : createCommentVNode("", true)
        ]),
        _: 1
      });
    };
  }
};
const COLUMN = 1340;
const _sfc_main$r = {
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
const _hoisted_1$p = {
  class: "xp",
  "aria-hidden": "true"
};
const _sfc_main$q = {
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
      return openBlock(), createElementBlock("div", _hoisted_1$p, [
        createBaseVNode("span", {
          class: "xp-fill",
          style: normalizeStyle({ transform: `scaleX(${filled.value})` })
        }, null, 4)
      ]);
    };
  }
};
const _sfc_main$p = {
  __name: "HoverTip",
  setup(__props) {
    const tip = reactive({ id: null, x: 0, y: 0, flipX: false, flipY: false });
    const current = computed(() => tip.id && item(tip.id));
    const linkOf = (e) => {
      var _a, _b;
      return (_b = (_a = e.target).closest) == null ? void 0 : _b.call(_a, 'a[href^="#w-"], [data-tip]');
    };
    const idOf = (a) => a.dataset.tip || a.getAttribute("href").slice(3);
    function place(e) {
      tip.x = e.clientX;
      tip.y = e.clientY;
      tip.flipX = e.clientX > innerWidth - 380;
      tip.flipY = e.clientY > innerHeight - 300;
    }
    function onOver(e) {
      const a = linkOf(e);
      if (!a || a.matches(".wname, .found-item")) return;
      const id = idOf(a);
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
        createVNode(_sfc_main$B, { item: current.value }, null, 8, ["item"])
      ], 4)) : createCommentVNode("", true);
    };
  }
};
const _hoisted_1$o = ["tabindex"];
const _sfc_main$o = {
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
      ])], 10, _hoisted_1$o);
    };
  }
};
const _hoisted_1$n = { class: "keys-box" };
const _hoisted_2$m = { key: 0 };
const _hoisted_3$k = { key: 1 };
const _sfc_main$n = {
  __name: "KeysHelp",
  setup(__props) {
    const dialog = ref(null);
    const mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    const mod = mac ? "⌘" : "Ctrl";
    const groups = [
      ["Везде", [[["/"], "Поиск"], [[mod, "K"], "Поиск из любого поля"], [["?"], "Эта справка"], [["Esc"], "Закрыть справку"]]],
      ["Поле поиска", [[["↑", "↓"], "Пройти по найденному"], [["Enter"], "Открыть выбранный предмет"], [["Esc"], "Свернуть список, затем очистить поиск"]]],
      ["Шапка с хотбаром", [[["1", "…", "9"], "Выбрать слот"]]],
      ["Каталог", [[["←", "→", "↑", "↓"], "Соседний предмет, когда сетка в фокусе"], [["←", "→"], "Повернуть модель, когда она в фокусе"]]],
      ["Сравнение клинков", [[["Enter", "Пробел"], "Открыть карточку клинка из строки таблицы"]]],
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
        createBaseVNode("div", _hoisted_1$n, [
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
                          k !== "…" ? (openBlock(), createElementBlock("kbd", _hoisted_2$m, toDisplayString(k), 1)) : (openBlock(), createElementBlock("span", _hoisted_3$k, "…"))
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
const _hoisted_1$m = {
  key: 0,
  class: "netnote",
  role: "status"
};
const _sfc_main$m = {
  __name: "NetStatus",
  setup(__props) {
    const offline = ref(!navigator.onLine);
    const update = () => {
      offline.value = !navigator.onLine;
    };
    onMounted(() => {
      addEventListener("online", update);
      addEventListener("offline", update);
    });
    onBeforeUnmount(() => {
      removeEventListener("online", update);
      removeEventListener("offline", update);
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Transition, { name: "netnote" }, {
        default: withCtx(() => [
          offline.value ? (openBlock(), createElementBlock("p", _hoisted_1$m, [..._cache[0] || (_cache[0] = [
            createBaseVNode("svg", {
              viewBox: "0 0 16 16",
              "aria-hidden": "true"
            }, [
              createBaseVNode("path", {
                d: "M2 5.5a9 9 0 0 1 12 0M4.3 8a5.6 5.6 0 0 1 7.4 0M6.6 10.4a2.3 2.3 0 0 1 2.8 0M2 2l12 12",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "1.5",
                "stroke-linecap": "round"
              })
            ], -1),
            createTextVNode(" Нет сети — открыта сохранённая копия ", -1)
          ])])) : createCommentVNode("", true)
        ]),
        _: 1
      });
    };
  }
};
const _hoisted_1$l = {
  class: "sitefoot",
  "aria-labelledby": "sitefoot-title"
};
const _hoisted_2$l = { class: "sitefoot-in" };
const _hoisted_3$j = { class: "sitefoot-brand" };
const _hoisted_4$i = {
  class: "sitefoot-name",
  href: "#top"
};
const _hoisted_5$i = ["src"];
const _hoisted_6$i = { class: "sitefoot-stats" };
const _hoisted_7$i = ["aria-label"];
const _hoisted_8$h = ["href"];
const _hoisted_9$g = { class: "sitefoot-bottom" };
const _hoisted_10$g = { class: "for-mouse" };
const REPO = "https://github.com/virus-momentx/wiki-virus-swords";
const _sfc_main$l = {
  __name: "SiteFooter",
  setup(__props) {
    const columns = [
      ["Предметы", [["catalog", "Каталог"], ["rarity", "Редкости"], ["weapons", "Линии клинков"], ["compare", "Сравнение клинков"], ["craft", "Крафт"]]],
      ["Путь", [["start", "С чего начать"], ["growth", "Рост клинка"], ["blood", "Родословные"], ["path", "Мой путь"], ["trophies", "Достижения"]]],
      ["Мир", [["sanctums", "Святилища"], ["raids", "Испытания"], ["bestiary", "Бестиарий"], ["faq", "Частые вопросы"], ["admin", "Для администратора"]]]
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
      return openBlock(), createElementBlock("footer", _hoisted_1$l, [
        createBaseVNode("div", _hoisted_2$l, [
          createBaseVNode("div", _hoisted_3$j, [
            createBaseVNode("a", _hoisted_4$i, [
              createBaseVNode("img", {
                src: unref(data).icons.forge_heart,
                alt: "",
                width: "28",
                height: "28"
              }, null, 8, _hoisted_5$i),
              _cache[0] || (_cache[0] = createBaseVNode("span", { id: "sitefoot-title" }, "Кодекс VirusSwords", -1))
            ]),
            _cache[2] || (_cache[2] = createBaseVNode("p", null, "Энциклопедия плагина VirusSwords для Paper 1.21.11. Имена, описания, урон, цены алтарей и достижения взяты прямо из исходного кода плагина.", -1)),
            createBaseVNode("p", _hoisted_6$i, toDisplayString(unref(stats)), 1),
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
                    }, toDisplayString(label), 9, _hoisted_8$h)
                  ]);
                }), 128))
              ])
            ], 8, _hoisted_7$i);
          }), 64))
        ]),
        createBaseVNode("div", _hoisted_9$g, [
          _cache[3] || (_cache[3] = createBaseVNode("span", null, "Модели предметов — из ресурспака сервера: Fantasy Weapons (nongkos), Blades of Majestica и другие паки; используются приватно.", -1)),
          createBaseVNode("span", null, [
            createBaseVNode("span", _hoisted_10$g, [
              createBaseVNode("button", {
                type: "button",
                class: "sitefoot-keys",
                onClick: keys
              }, "Горячие клавиши"),
              unref(built) ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                createTextVNode(" · ")
              ], 64)) : createCommentVNode("", true)
            ]),
            unref(built) ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
              createTextVNode("Обновлено " + toDisplayString(unref(built)), 1)
            ], 64)) : createCommentVNode("", true)
          ])
        ])
      ]);
    };
  }
};
const _hoisted_1$k = {
  class: "sec-rune",
  viewBox: "0 0 5 7",
  "aria-hidden": "true"
};
const _hoisted_2$k = ["x", "y"];
const _hoisted_3$i = { class: "sec-title" };
const _hoisted_4$h = {
  key: 0,
  class: "emblem",
  "aria-hidden": "true"
};
const _hoisted_5$h = ["src"];
const _hoisted_6$h = ["href", "aria-label"];
const _hoisted_7$h = {
  class: "sec-anchor-tip",
  role: "status"
};
const _sfc_main$k = {
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
      const url = pageUrl() + (anchor.value === "catalog" ? location.search : "") + `#${anchor.value}`;
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
        (openBlock(), createElementBlock("svg", _hoisted_1$k, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(rune.value, ([x, y], i) => {
            return openBlock(), createElementBlock("rect", {
              key: i,
              x,
              y,
              width: "1",
              height: "1"
            }, null, 8, _hoisted_2$k);
          }), 128))
        ])),
        createBaseVNode("div", _hoisted_3$i, [
          src.value ? (openBlock(), createElementBlock("span", _hoisted_4$h, [
            createBaseVNode("img", {
              src: src.value,
              alt: ""
            }, null, 8, _hoisted_5$h)
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
            createBaseVNode("span", _hoisted_7$h, toDisplayString(copied.value ? "Ссылка скопирована" : ""), 1)
          ], 8, _hoisted_6$h)) : createCommentVNode("", true),
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
const _hoisted_1$j = { id: "start" };
const _hoisted_2$j = { class: "road" };
const _hoisted_3$h = { class: "road-head" };
const _hoisted_4$g = {
  class: "road-n",
  "aria-hidden": "true"
};
const _hoisted_5$g = { class: "road-text" };
const _hoisted_6$g = ["title", "onClick"];
const _hoisted_7$g = {
  key: 0,
  class: "road-icons"
};
const _hoisted_8$g = ["title", "aria-label", "onClick"];
const _hoisted_9$f = ["src"];
const _hoisted_10$f = ["title"];
const _hoisted_11$e = ["src", "alt"];
const _hoisted_12$e = ["href"];
const _hoisted_13$d = { class: "first" };
const _hoisted_14$c = { class: "first-list" };
const _sfc_main$j = {
  __name: "StartSection",
  setup(__props) {
    const icon = (id) => {
      var _a;
      return ((_a = item(id)) == null ? void 0 : _a.icon) || data.icons[id] || data.guideIcons[id];
    };
    const name = (id) => {
      var _a;
      return ((_a = item(id)) == null ? void 0 : _a.name) || id;
    };
    const guideName = { unknown_compass: "Неизвестный компас", air_compass: "Компас воздуха", forge_map: "Карта кузни", jungle_map: "Карта джунглей" };
    const it = (id, as) => ({ id, as: as || name(id) });
    const steps = [
      {
        title: "Выберите кровь",
        text: ["При первом входе откроется экран с тремя карточками: пепельная кровь, небесная и кровь предков. Первый клик — присмотреться, второй — выбрать. От крови зависят книга, которую вы получите, ваш рост и то, какие величайшие клинки вас признают."],
        items: [],
        to: "blood",
        toLabel: "Родословные"
      },
      {
        title: "Выберите путеводителя",
        text: ["Сразу после крови — второй экран: чей голос будет с вами. Путеводитель знает секреты трёх начальных кровей, ZorahM-GPT советует о фабрике и Неизвестном компасе, Наблюдатель рассказывает легенды о Все-Чёрном. Закрыли экран, не выбрав, — останется Путеводитель."],
        items: [],
        guides: ["unknown_compass"],
        to: "blood",
        toLabel: "Родословные"
      },
      {
        title: "Найдите первый клинок",
        text: [it("doom"), " и ", it("cutter"), " лежат в сундуках древнего города (шанс 10%), ", it("arachnid"), " — в сундуке вагонетки заброшенной шахты (33%), ", it("twilight_axe"), " — в сундуке крепости Незера (15%). Ни один из них не крафтится."],
        items: ["doom", "cutter", "arachnid", "twilight_axe"],
        to: "catalog",
        toLabel: "Каталог"
      },
      {
        title: "Добудьте Душу демона",
        text: [it("demon_soul"), " всегда лежит в сокровищнице бастиона. На верстаке ", it("cutter"), " и Душа дают ", it("demonic_cutter"), ". У алтаря Незеритовой кузни Душа превращает ", it("arachnid", "Арахнида"), " в ", it("demon_slayer", "Убийцу демонов"), ", а ", it("doom", "Погибель"), " — в ", it("calamity"), ", но здесь нужны ещё 8 осколков души."],
        items: ["demon_soul", "demonic_cutter", "demon_slayer", "calamity", "soul_shard"],
        to: "craft",
        toLabel: "Крафт"
      },
      {
        title: "Растите мастерство",
        text: ["Клинок учится от урона, который вы им нанесли, — от 0 до 100. Мастерство открывает заточку (звезда n требует мастерства 15·n) и пробуждение (три звезды и мастерство 50). Эволюция просит только материалы, но после неё мастерство начинается заново."],
        items: [],
        to: "growth",
        toLabel: "Рост клинка"
      },
      {
        title: "Найдите святилище",
        text: ["Каждое святилище ищется своим предметом: Компас воздуха ведёт к Небесному храму, Карта кузни — к Незеритовой кузне, Карта джунглей — к Храму джунглей. Все три собираются на верстаке. Внутри — вход, три комнаты со стражей и алтарь."],
        items: [],
        guides: ["air_compass", "forge_map", "jungle_map"],
        to: "sanctums",
        toLabel: "Святилища"
      },
      {
        title: "Пройдите посвящение",
        text: ["Первое испытание у алтаря бесплатно: пять волн, в пятой — страж. Победа в святилище своей крови поднимает первую форму до второй. Со стражи падают осколки — ", it("soul_shard", "души"), ", ", it("celestial_shard", "небесные"), " или ", it("jungle_shard", "реликтовые"), "; провал забирает половину добытого в бою."],
        items: ["soul_shard", "celestial_shard", "jungle_shard"],
        to: "raids",
        toLabel: "Испытания"
      },
      {
        title: "Доведите клинок до вершины",
        text: ["Высшие клинки получают у алтарей: ", it("imperium"), " — эволюцией в Незеритовой кузне, ", it("true_excalibur"), " — ковкой в Тёмном храме. Корона отвечает только своей крови: эти две — с четвёртой формы. ", it("all_black"), " — эволюция короны с ", it("black_substance", "Чёрной душой"), " у алтаря своего храма; он навсегда меняет кровь на бездну."],
        items: ["imperium", "true_excalibur", "all_black", "black_substance"],
        to: "weapons",
        toLabel: "Линии клинков"
      }
    ];
    const tips = [
      { title: "Играйте с ресурспаком", text: "Без него оружие работает, но выглядит как обычные мечи и топор, а экран выбора крови остаётся без своего фона." },
      { title: "Не спешите с кровью и голосом", text: "На обоих экранах первый клик только показывает карточку, выбирает второй. Кровь определяет, какое святилище ваше." },
      { title: "Откройте книгу своей крови", text: "Её выдают сразу после выбора. Глава «Первые шаги» говорит, чем найти святилище, что даёт первое испытание и какой клинок добыть первым." },
      { title: "Идите за первым клинком", text: "Древний город, заброшенная шахта, крепость Незера — и сокровищница бастиона за Душой демона. Рецепты плагина уже открыты в книге рецептов." },
      { title: "Не тратьте осколки зря", text: "Первая звезда заточки стоит 8 осколков, второе испытание — 20, принять кровь другого святилища у его алтаря — тоже 20. Проваленное испытание забирает половину добытого в нём." }
    ];
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$j, [
        createVNode(_sfc_main$k, {
          title: "С чего начать",
          icon: "terra_compass"
        }, {
          default: withCtx(() => [..._cache[0] || (_cache[0] = [
            createBaseVNode("p", { class: "lead" }, "Дорога новичка в восьми шагах: от выбора крови до клинка, который признаёт только её.", -1)
          ])]),
          _: 1
        }),
        createBaseVNode("ol", _hoisted_2$j, [
          (openBlock(), createElementBlock(Fragment, null, renderList(steps, (s, i) => {
            return createBaseVNode("li", {
              key: s.title,
              class: normalizeClass(["road-card", { last: i === steps.length - 1 }])
            }, [
              createBaseVNode("div", _hoisted_3$h, [
                createBaseVNode("span", _hoisted_4$g, toDisplayString(i + 1), 1),
                createBaseVNode("h3", null, toDisplayString(s.title), 1)
              ]),
              createBaseVNode("p", _hoisted_5$g, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(s.text, (part, k) => {
                  return openBlock(), createElementBlock(Fragment, { key: k }, [
                    typeof part === "string" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                      createTextVNode(toDisplayString(/^[,.;:]/.test(part) ? "⁠" + part : part), 1)
                    ], 64)) : (openBlock(), createElementBlock("button", {
                      key: 1,
                      type: "button",
                      class: "road-item",
                      title: "Открыть карточку: " + name(part.id),
                      onClick: ($event) => unref(openItem)(part.id)
                    }, toDisplayString(part.as), 9, _hoisted_6$g))
                  ], 64);
                }), 128))
              ]),
              s.items.length || s.guides ? (openBlock(), createElementBlock("div", _hoisted_7$g, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(s.items, (id) => {
                  return openBlock(), createElementBlock("button", {
                    key: id,
                    type: "button",
                    class: "road-icon",
                    title: name(id),
                    "aria-label": "Открыть карточку: " + name(id),
                    onClick: ($event) => unref(openItem)(id)
                  }, [
                    createBaseVNode("img", {
                      src: icon(id),
                      alt: "",
                      loading: "lazy"
                    }, null, 8, _hoisted_9$f)
                  ], 8, _hoisted_8$g);
                }), 128)),
                (openBlock(true), createElementBlock(Fragment, null, renderList(s.guides || [], (id) => {
                  return openBlock(), createElementBlock("span", {
                    key: id,
                    class: "road-icon plain",
                    title: guideName[id]
                  }, [
                    createBaseVNode("img", {
                      src: icon(id),
                      alt: guideName[id],
                      loading: "lazy"
                    }, null, 8, _hoisted_11$e)
                  ], 8, _hoisted_10$f);
                }), 128))
              ])) : createCommentVNode("", true),
              createBaseVNode("a", {
                class: "road-more",
                href: "#" + s.to
              }, [
                createTextVNode("Подробнее: " + toDisplayString(s.toLabel) + " ", 1),
                _cache[1] || (_cache[1] = createBaseVNode("span", { "aria-hidden": "true" }, "→", -1))
              ], 8, _hoisted_12$e)
            ], 2);
          }), 64))
        ]),
        createBaseVNode("div", _hoisted_13$d, [
          _cache[2] || (_cache[2] = createBaseVNode("h3", null, "Первые полчаса", -1)),
          createBaseVNode("ul", _hoisted_14$c, [
            (openBlock(), createElementBlock(Fragment, null, renderList(tips, (t) => {
              return createBaseVNode("li", {
                key: t.title
              }, [
                createBaseVNode("b", null, toDisplayString(t.title), 1),
                createBaseVNode("span", null, toDisplayString(t.text), 1)
              ]);
            }), 64))
          ])
        ]),
        _cache[3] || (_cache[3] = createBaseVNode("p", { class: "small muted" }, "Сервер узнаёт о ваших делах: первый выкованный, улучшенный или собранный клинок, сломанная Печать ночи, вытянутая Луна и сработавшие Королевские часы объявляются в чате всем — имя клинка можно навести мышью и рассмотреть. Способности с перезарядкой от минуты видят только игроки рядом, в 64 блоках.", -1))
      ]);
    };
  }
};
const StartSection = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["__scopeId", "data-v-060b7782"]]);
const _hoisted_1$i = { id: "rarity" };
const _hoisted_2$i = { class: "rarities" };
const _hoisted_3$g = { class: "rhead" };
const _hoisted_4$f = ["href", "title"];
const _hoisted_5$f = ["src"];
const _hoisted_6$f = { class: "rname" };
const _hoisted_7$f = {
  class: "swatches",
  "aria-hidden": "true"
};
const _hoisted_8$f = { class: "rmotion" };
const _hoisted_9$e = { class: "rused" };
const _hoisted_10$e = {
  key: 1,
  class: "muted"
};
const _sfc_main$i = {
  __name: "RaritySection",
  setup(__props) {
    const example = Object.fromEntries(data.rarities.map((r) => [r.const, data.items.find((i) => i.rarity === r.const)]));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$i, [
        createVNode(_sfc_main$k, {
          title: "Редкости",
          icon: "wanderer_cube"
        }, {
          default: withCtx(() => [..._cache[0] || (_cache[0] = [
            createBaseVNode("p", { class: "lead" }, "Имя предмета окрашено градиентом его редкости — так же, как в игре. Старшие редкости переливаются.", -1)
          ])]),
          _: 1
        }),
        createBaseVNode("ol", _hoisted_2$i, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(data).rarities, (r) => {
            return openBlock(), createElementBlock("li", {
              key: r.const,
              class: "rarity"
            }, [
              createBaseVNode("span", _hoisted_3$g, [
                unref(example)[r.const] ? (openBlock(), createElementBlock("a", {
                  key: 0,
                  class: "rex",
                  href: `#w-${unref(example)[r.const].id}`,
                  title: unref(example)[r.const].name
                }, [
                  createBaseVNode("img", {
                    src: unref(example)[r.const].icon,
                    alt: ""
                  }, null, 8, _hoisted_5$f)
                ], 8, _hoisted_4$f)) : createCommentVNode("", true),
                createBaseVNode("span", _hoisted_6$f, [
                  createVNode(_sfc_main$C, {
                    rarity: r.const
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(r.label), 1)
                    ]),
                    _: 2
                  }, 1032, ["rarity"])
                ])
              ]),
              createBaseVNode("span", _hoisted_7$f, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(r.palette, (c) => {
                  return openBlock(), createElementBlock("span", {
                    key: c,
                    class: "sw",
                    style: normalizeStyle({ background: c })
                  }, null, 4);
                }), 128))
              ]),
              createBaseVNode("span", _hoisted_8$f, toDisplayString(r.motion), 1),
              createBaseVNode("span", _hoisted_9$e, [
                r.used.length ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                  createTextVNode(toDisplayString(r.used.join(", ")), 1)
                ], 64)) : (openBlock(), createElementBlock("span", _hoisted_10$e, "пока ничем не окрашена"))
              ])
            ]);
          }), 128))
        ])
      ]);
    };
  }
};
const _hoisted_1$h = { id: "weapons" };
const _hoisted_2$h = { class: "weapon-bar" };
const _hoisted_3$f = {
  class: "filters",
  role: "group",
  "aria-label": "Фильтр по линии"
};
const _hoisted_4$e = ["aria-pressed", "onClick"];
const _hoisted_5$e = {
  class: "seg",
  role: "group",
  "aria-label": "Вид"
};
const _hoisted_6$e = ["aria-pressed"];
const _hoisted_7$e = ["aria-pressed"];
const _hoisted_8$e = {
  key: 0,
  class: "tbl wtable"
};
const _hoisted_9$d = ["aria-sort"];
const _hoisted_10$d = { "aria-hidden": "true" };
const _hoisted_11$d = ["aria-sort"];
const _hoisted_12$d = { "aria-hidden": "true" };
const _hoisted_13$c = ["aria-sort"];
const _hoisted_14$b = { "aria-hidden": "true" };
const _hoisted_15$a = ["aria-sort"];
const _hoisted_16$a = { "aria-hidden": "true" };
const _hoisted_17$a = { scope: "row" };
const _hoisted_18$a = ["href"];
const _hoisted_19$9 = { class: "islot-cell sm" };
const _hoisted_20$9 = ["src"];
const _hoisted_21$7 = { class: "num" };
const _hoisted_22$6 = { class: "num" };
const _hoisted_23$6 = { class: "rname sm" };
const _hoisted_24$4 = {
  key: 1,
  class: "lines"
};
const _hoisted_25$4 = ["data-key"];
const _hoisted_26$4 = { class: "line-title" };
const _hoisted_27$4 = { class: "line-row" };
const _hoisted_28$4 = {
  key: 0,
  class: "energy",
  "aria-hidden": "true"
};
const _hoisted_29$4 = {
  key: 1,
  class: "arrow",
  "aria-hidden": "true"
};
const _hoisted_30$3 = {
  key: 2,
  class: "empty"
};
const VIEW_KEY = "codex-weapons-view";
const _sfc_main$h = {
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
      return openBlock(), createElementBlock("section", _hoisted_1$h, [
        createVNode(_sfc_main$k, {
          title: "Линии клинков",
          icon: "all_black"
        }, {
          default: withCtx(() => [..._cache[6] || (_cache[6] = [
            createBaseVNode("p", { class: "lead" }, "Клинки выстроены в линии — от находки в мире до неломаемого оружия. Стрелка — эволюция у алтаря, «или» — развилка. Нажмите на клинок, чтобы открыть карточку.", -1)
          ])]),
          _: 1
        }),
        createBaseVNode("div", _hoisted_2$h, [
          createBaseVNode("div", _hoisted_3$f, [
            (openBlock(), createElementBlock(Fragment, null, renderList(lines, ([key, title]) => {
              return createBaseVNode("button", {
                key,
                type: "button",
                class: "chip",
                "aria-pressed": String(unref(filters).line === key),
                onClick: ($event) => unref(filters).line = key
              }, toDisplayString(title), 9, _hoisted_4$e);
            }), 64))
          ]),
          createBaseVNode("div", _hoisted_5$e, [
            createBaseVNode("button", {
              type: "button",
              "aria-pressed": String(view.value === "lines"),
              onClick: _cache[0] || (_cache[0] = ($event) => setView("lines"))
            }, "Линии", 8, _hoisted_6$e),
            createBaseVNode("button", {
              type: "button",
              "aria-pressed": String(view.value === "table"),
              onClick: _cache[1] || (_cache[1] = ($event) => setView("table"))
            }, "Таблица", 8, _hoisted_7$e)
          ])
        ]),
        view.value === "table" ? (openBlock(), createElementBlock("div", _hoisted_8$e, [
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
                    createBaseVNode("span", _hoisted_10$d, toDisplayString(mark("name")), 1)
                  ])
                ], 8, _hoisted_9$d),
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
                    createBaseVNode("span", _hoisted_12$d, toDisplayString(mark("damage")), 1)
                  ])
                ], 8, _hoisted_11$d),
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
                    createBaseVNode("span", _hoisted_14$b, toDisplayString(mark("speed")), 1)
                  ])
                ], 8, _hoisted_13$c),
                createBaseVNode("th", {
                  "aria-sort": ariaSort("rarity")
                }, [
                  createBaseVNode("button", {
                    type: "button",
                    class: "sort",
                    onClick: _cache[5] || (_cache[5] = ($event) => sortBy("rarity"))
                  }, [
                    _cache[10] || (_cache[10] = createTextVNode("Редкость ", -1)),
                    createBaseVNode("span", _hoisted_16$a, toDisplayString(mark("rarity")), 1)
                  ])
                ], 8, _hoisted_15$a),
                _cache[11] || (_cache[11] = createBaseVNode("th", null, "Как получить", -1))
              ])
            ]),
            createBaseVNode("tbody", null, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(sorted.value, (w) => {
                return openBlock(), createElementBlock("tr", {
                  key: w.id
                }, [
                  createBaseVNode("th", _hoisted_17$a, [
                    createBaseVNode("a", {
                      class: "wname",
                      href: `#w-${w.id}`
                    }, [
                      createBaseVNode("span", _hoisted_19$9, [
                        createBaseVNode("img", {
                          src: w.icon,
                          alt: ""
                        }, null, 8, _hoisted_20$9)
                      ]),
                      createTextVNode(toDisplayString(w.name), 1)
                    ], 8, _hoisted_18$a)
                  ]),
                  createBaseVNode("td", _hoisted_21$7, toDisplayString(w.damage), 1),
                  createBaseVNode("td", _hoisted_22$6, toDisplayString(w.speed), 1),
                  createBaseVNode("td", null, [
                    createBaseVNode("span", _hoisted_23$6, [
                      createVNode(_sfc_main$C, {
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
        ])) : (openBlock(), createElementBlock("div", _hoisted_24$4, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(visible.value, (chain) => {
            return openBlock(), createElementBlock("div", {
              key: chain.key,
              class: "line",
              "data-key": chain.key
            }, [
              createBaseVNode("h3", _hoisted_26$4, toDisplayString(chain.title), 1),
              createBaseVNode("div", _hoisted_27$4, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(chain.entries, (e, i) => {
                  return openBlock(), createElementBlock("span", {
                    key: i,
                    class: "chain-step"
                  }, [
                    e.sep === "→" ? (openBlock(), createElementBlock("span", _hoisted_28$4)) : e.sep ? (openBlock(), createElementBlock("span", _hoisted_29$4, toDisplayString(e.sep), 1)) : createCommentVNode("", true),
                    createVNode(_sfc_main$w, {
                      item: e.item,
                      anchor: e.anchor,
                      named: "",
                      dim: !unref(shownIds).has(e.id)
                    }, null, 8, ["item", "anchor", "dim"])
                  ]);
                }), 128))
              ])
            ], 8, _hoisted_25$4);
          }), 128))
        ])),
        (view.value === "table" ? !sorted.value.length : !visible.value.length) ? (openBlock(), createElementBlock("p", _hoisted_30$3, "Ни одного клинка — попробуйте другое слово или линию «Все».")) : createCommentVNode("", true)
      ]);
    };
  }
};
const _hoisted_1$g = { id: "compare" };
const _hoisted_2$g = { class: "cmp-bar" };
const _hoisted_3$e = {
  class: "cmp-chips",
  role: "group",
  "aria-label": "Фильтр по крови"
};
const _hoisted_4$d = ["aria-pressed"];
const _hoisted_5$d = { class: "facet" };
const _hoisted_6$d = ["aria-pressed", "onClick"];
const _hoisted_7$d = { class: "facet" };
const _hoisted_8$d = ["aria-pressed"];
const _hoisted_9$c = { class: "facet" };
const _hoisted_10$c = ["aria-pressed"];
const _hoisted_11$c = {
  class: "cmp-count",
  role: "status"
};
const _hoisted_12$c = { class: "tbl cmp-tbl" };
const _hoisted_13$b = ["aria-sort"];
const _hoisted_14$a = ["onClick"];
const _hoisted_15$9 = {
  class: "cmp-arrow",
  "aria-hidden": "true"
};
const _hoisted_16$9 = ["onClick", "onKeydown"];
const _hoisted_17$9 = {
  scope: "row",
  class: "cmp-name"
};
const _hoisted_18$9 = { class: "islot-cell sm" };
const _hoisted_19$8 = ["src"];
const _hoisted_20$8 = {
  class: "num",
  "data-label": "Урон"
};
const _hoisted_21$6 = {
  class: "num",
  "data-label": "Скорость"
};
const _hoisted_22$5 = {
  class: "num",
  "data-label": "Урон в секунду"
};
const _hoisted_23$5 = { "data-label": "Редкость" };
const _hoisted_24$3 = { "data-label": "Кровь и форма" };
const _hoisted_25$3 = {
  key: 0,
  class: "muted small"
};
const _hoisted_26$3 = {
  key: 1,
  class: "cmp-tag"
};
const _hoisted_27$3 = {
  key: 1,
  class: "muted"
};
const _hoisted_28$3 = {
  class: "num",
  "data-label": "Способности"
};
const _hoisted_29$3 = { key: 0 };
const _sfc_main$g = {
  __name: "CompareSection",
  setup(__props) {
    const bloods = data.blood.map((b) => ({ id: b.id, title: b.title, colour: b.colour }));
    const bloodOf = Object.fromEntries(bloods.map((b) => [b.id, b]));
    const bladeInfo = {};
    for (const b of data.blood) for (const w of b.weapons) bladeInfo[w.id] = { form: w.form, crown: !!w.crown };
    const rank = Object.fromEntries(data.rarities.map((r, i) => [r.const, i]));
    const BOW = /* @__PURE__ */ new Set(["ancient"]);
    const HIDDEN = /* @__PURE__ */ new Set(["celestial", "architect"]);
    const rows = data.items.filter((i) => i.kind === "weapon").map((w) => {
      const info = bladeInfo[w.id] || { form: 0, crown: false };
      const dps = BOW.has(w.id) ? null : Math.round(w.damage * w.speed * 10) / 10;
      return {
        id: w.id,
        name: w.name,
        icon: w.icon,
        damage: w.damage,
        speed: w.speed,
        dps,
        rarity: w.rarity,
        rarityLabel: w.rarityLabel,
        rank: rank[w.rarity] ?? 0,
        blood: w.blood || "",
        form: info.form,
        crown: info.crown,
        hidden: HIDDEN.has(w.id),
        abilities: w.abilities.length
      };
    });
    const blood = ref("any");
    const crownsOnly = ref(false);
    const facet = (id) => rows.filter((r) => (id === "any" || (id === "none" ? !r.blood : r.blood === id)) && (!crownsOnly.value || r.crown)).length;
    const filtered = computed(() => rows.filter((r) => (blood.value === "any" || (blood.value === "none" ? !r.blood : r.blood === blood.value)) && (!crownsOnly.value || r.crown)));
    const COLS = [
      ["name", "Клинок", false],
      ["damage", "Урон", true],
      ["speed", "Скорость", true],
      ["dps", "Урон в секунду", true],
      ["rarity", "Редкость", false],
      ["blood", "Кровь и форма", false],
      ["abilities", "Способности", true]
    ];
    const sort = ref({ key: "damage", dir: -1 });
    const sortBy = (key) => {
      sort.value = sort.value.key === key ? { key, dir: -sort.value.dir } : { key, dir: key === "name" || key === "blood" ? 1 : -1 };
    };
    const value = (r, key) => {
      var _a;
      if (key === "rarity") return r.rank;
      if (key === "blood") return r.blood ? ((_a = bloodOf[r.blood]) == null ? void 0 : _a.title) || r.blood : "￿";
      if (key === "abilities") return r.hidden ? -1 : r.abilities;
      if (key === "dps") return r.dps ?? -1;
      return r[key];
    };
    const sorted = computed(() => [...filtered.value].sort((a, b) => {
      const x = value(a, sort.value.key), y = value(b, sort.value.key);
      const d = typeof x === "string" ? x.localeCompare(y, "ru") : x - y;
      return d * sort.value.dir || a.name.localeCompare(b.name, "ru");
    }));
    const ariaSort = (key) => sort.value.key === key ? sort.value.dir > 0 ? "ascending" : "descending" : "none";
    const mark = (key) => sort.value.key === key ? sort.value.dir > 0 ? "▲" : "▼" : "";
    const formText = (r) => r.form > 1 ? `с ${r.form}-й формы` : r.form === 1 ? "с первой формы" : "";
    const num = (n) => String(n).replace(".", ",");
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$g, [
        createVNode(_sfc_main$k, {
          title: "Сравнение клинков",
          icon: "all_black"
        }, {
          default: withCtx(() => [..._cache[3] || (_cache[3] = [
            createBaseVNode("p", { class: "lead" }, "Все клинки в одной таблице. Нажмите на заголовок столбца, чтобы отсортировать, и ещё раз — чтобы развернуть порядок. Нажмите на строку, чтобы открыть карточку клинка.", -1)
          ])]),
          _: 1
        }),
        createBaseVNode("div", _hoisted_2$g, [
          createBaseVNode("div", _hoisted_3$e, [
            createBaseVNode("button", {
              type: "button",
              class: "bchip",
              "aria-pressed": String(blood.value === "any"),
              onClick: _cache[0] || (_cache[0] = ($event) => blood.value = "any")
            }, [
              _cache[4] || (_cache[4] = createTextVNode("Любая", -1)),
              createBaseVNode("span", _hoisted_5$d, toDisplayString(facet("any")), 1)
            ], 8, _hoisted_4$d),
            (openBlock(true), createElementBlock(Fragment, null, renderList(unref(bloods), (b) => {
              return openBlock(), createElementBlock("button", {
                key: b.id,
                type: "button",
                class: normalizeClass(["bchip", { none: !facet(b.id) && blood.value !== b.id }]),
                "aria-pressed": String(blood.value === b.id),
                onClick: ($event) => blood.value = blood.value === b.id ? "any" : b.id
              }, [
                createVNode(_sfc_main$u, {
                  colour: b.colour
                }, null, 8, ["colour"]),
                createTextVNode(toDisplayString(b.title), 1),
                createBaseVNode("span", _hoisted_7$d, toDisplayString(facet(b.id)), 1)
              ], 10, _hoisted_6$d);
            }), 128)),
            createBaseVNode("button", {
              type: "button",
              class: normalizeClass(["bchip", { none: !facet("none") && blood.value !== "none" }]),
              "aria-pressed": String(blood.value === "none"),
              onClick: _cache[1] || (_cache[1] = ($event) => blood.value = blood.value === "none" ? "any" : "none")
            }, [
              _cache[5] || (_cache[5] = createTextVNode("Ничьи клинки", -1)),
              createBaseVNode("span", _hoisted_9$c, toDisplayString(facet("none")), 1)
            ], 10, _hoisted_8$d)
          ]),
          createBaseVNode("button", {
            type: "button",
            class: "chip cmp-crown",
            "aria-pressed": String(crownsOnly.value),
            onClick: _cache[2] || (_cache[2] = ($event) => crownsOnly.value = !crownsOnly.value)
          }, "Только короны", 8, _hoisted_10$c)
        ]),
        createBaseVNode("p", _hoisted_11$c, "Показано " + toDisplayString(sorted.value.length) + " из " + toDisplayString(unref(rows).length), 1),
        createBaseVNode("div", _hoisted_12$c, [
          createBaseVNode("table", null, [
            createBaseVNode("thead", null, [
              createBaseVNode("tr", null, [
                (openBlock(), createElementBlock(Fragment, null, renderList(COLS, ([key, title, isNum]) => {
                  return createBaseVNode("th", {
                    key,
                    scope: "col",
                    class: normalizeClass({ num: isNum }),
                    "aria-sort": ariaSort(key)
                  }, [
                    createBaseVNode("button", {
                      type: "button",
                      class: "sort",
                      onClick: ($event) => sortBy(key)
                    }, [
                      createTextVNode(toDisplayString(title) + " ", 1),
                      createBaseVNode("span", _hoisted_15$9, toDisplayString(mark(key)), 1)
                    ], 8, _hoisted_14$a)
                  ], 10, _hoisted_13$b);
                }), 64))
              ])
            ]),
            createBaseVNode("tbody", null, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(sorted.value, (r) => {
                return openBlock(), createElementBlock("tr", {
                  key: r.id,
                  class: "cmp-row",
                  tabindex: "0",
                  onClick: ($event) => unref(openItem)(r.id),
                  onKeydown: [
                    withKeys(withModifiers(($event) => unref(openItem)(r.id), ["prevent"]), ["enter"]),
                    withKeys(withModifiers(($event) => unref(openItem)(r.id), ["prevent"]), ["space"])
                  ]
                }, [
                  createBaseVNode("th", _hoisted_17$9, [
                    createBaseVNode("span", _hoisted_18$9, [
                      createBaseVNode("img", {
                        src: r.icon,
                        alt: "",
                        loading: "lazy"
                      }, null, 8, _hoisted_19$8)
                    ]),
                    createBaseVNode("span", null, toDisplayString(r.name), 1)
                  ]),
                  createBaseVNode("td", _hoisted_20$8, toDisplayString(num(r.damage)), 1),
                  createBaseVNode("td", _hoisted_21$6, toDisplayString(num(r.speed)), 1),
                  createBaseVNode("td", _hoisted_22$5, toDisplayString(r.dps === null ? "—" : num(r.dps)), 1),
                  createBaseVNode("td", _hoisted_23$5, [
                    createVNode(_sfc_main$C, {
                      rarity: r.rarity
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(r.rarityLabel), 1)
                      ]),
                      _: 2
                    }, 1032, ["rarity"])
                  ]),
                  createBaseVNode("td", _hoisted_24$3, [
                    r.blood ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                      createVNode(_sfc_main$u, {
                        colour: unref(bloodOf)[r.blood].colour
                      }, null, 8, ["colour"]),
                      createTextVNode(toDisplayString(unref(bloodOf)[r.blood].title), 1),
                      formText(r) ? (openBlock(), createElementBlock("span", _hoisted_25$3, ", " + toDisplayString(formText(r)), 1)) : createCommentVNode("", true),
                      r.crown ? (openBlock(), createElementBlock("span", _hoisted_26$3, "корона")) : createCommentVNode("", true)
                    ], 64)) : (openBlock(), createElementBlock("span", _hoisted_27$3, "Любая кровь"))
                  ]),
                  createBaseVNode("td", _hoisted_28$3, toDisplayString(r.hidden ? "???" : r.abilities), 1)
                ], 40, _hoisted_16$9);
              }), 128)),
              !sorted.value.length ? (openBlock(), createElementBlock("tr", _hoisted_29$3, [..._cache[6] || (_cache[6] = [
                createBaseVNode("td", {
                  colspan: "7",
                  class: "cmp-empty"
                }, "Под такие условия не подходит ни один клинок.", -1)
              ])])) : createCommentVNode("", true)
            ])
          ])
        ])
      ]);
    };
  }
};
const CompareSection = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["__scopeId", "data-v-d9466e27"]]);
const _hoisted_1$f = { id: "catalog" };
const _hoisted_2$f = { class: "cat" };
const _hoisted_3$d = { class: "cat-side" };
const _hoisted_4$c = { class: "cat-filters" };
const _hoisted_5$c = { class: "cat-search" };
const _hoisted_6$c = {
  class: "seg cat-kind",
  role: "group",
  "aria-label": "Вид"
};
const _hoisted_7$c = ["aria-pressed", "onClick"];
const _hoisted_8$c = { class: "facet" };
const _hoisted_9$b = { class: "cat-group" };
const _hoisted_10$b = { class: "cat-chips" };
const _hoisted_11$b = ["aria-pressed", "onClick"];
const _hoisted_12$b = { class: "facet" };
const _hoisted_13$a = { class: "cat-group" };
const _hoisted_14$9 = { class: "cat-chips" };
const _hoisted_15$8 = ["aria-pressed"];
const _hoisted_16$8 = { class: "facet" };
const _hoisted_17$8 = ["aria-pressed", "onClick"];
const _hoisted_18$8 = { class: "facet" };
const _hoisted_19$7 = ["aria-pressed"];
const _hoisted_20$7 = { class: "facet" };
const _hoisted_21$5 = { class: "cat-count" };
const _hoisted_22$4 = { "aria-live": "polite" };
const _hoisted_23$4 = {
  class: "sr-only",
  "aria-live": "polite"
};
const _hoisted_24$2 = { class: "cat-order" };
const _hoisted_25$2 = ["value"];
const _hoisted_26$2 = {
  key: 0,
  class: "catsep first",
  "aria-hidden": "true"
};
const _hoisted_27$2 = {
  key: 1,
  class: "catsep",
  "aria-hidden": "true"
};
const _hoisted_28$2 = ["aria-selected", "data-tip", "onClick"];
const _hoisted_29$2 = ["src"];
const _hoisted_30$2 = { class: "sr-only" };
const _hoisted_31$2 = {
  key: 0,
  class: "cat-empty",
  role: "status"
};
const _hoisted_32$2 = { class: "cv-head" };
const _hoisted_33$2 = { class: "cv-tags" };
const _hoisted_34$2 = { class: "cv-tag" };
const _hoisted_35$2 = { class: "cv-tag" };
const _hoisted_36$2 = {
  key: 0,
  class: "cv-tag"
};
const _hoisted_37$2 = {
  key: 1,
  class: "cv-tag"
};
const _hoisted_38$2 = {
  key: 0,
  class: "cv-lore"
};
const _hoisted_39$1 = ["innerHTML"];
const _hoisted_40$1 = {
  key: 1,
  class: "cv-stats statbars"
};
const _hoisted_41$1 = { class: "statbar" };
const _hoisted_42$1 = {
  class: "statbar-track",
  "aria-hidden": "true"
};
const _hoisted_43$1 = { class: "statbar-value" };
const _hoisted_44$1 = { class: "statbar" };
const _hoisted_45$1 = {
  class: "statbar-track",
  "aria-hidden": "true"
};
const _hoisted_46$1 = { class: "statbar-value" };
const _hoisted_47$1 = {
  key: 3,
  class: "no-abil"
};
const _hoisted_48$1 = { class: "cv-obtain" };
const _hoisted_49$1 = ["innerHTML"];
const _sfc_main$f = {
  __name: "CatalogSection",
  setup(__props) {
    const items = data.items;
    const rarities2 = data.rarities.filter((r) => items.some((i) => i.rarity === r.const));
    const bloods = data.blood.map((b) => ({ id: b.id, title: b.title, colour: b.colour }));
    const bloodOf = Object.fromEntries(bloods.map((b) => [b.id, b]));
    const kind = ref("all");
    const rarity = ref(/* @__PURE__ */ new Set());
    const blood = ref("any");
    const query = ref("");
    const order2 = ref("rarity");
    const ORDERS = [["rarity", "По редкости"], ["name", "По названию"], ["damage", "По урону"]];
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
    const byName2 = (a, b) => a.name.localeCompare(b.name, "ru");
    const kindFirst = (a, b) => a.kind === b.kind ? 0 : a.kind === "weapon" ? -1 : 1;
    const ORDER_BY = {
      rarity: (a, b) => kindFirst(a, b) || rank[b.rarity] - rank[a.rarity] || byName2(a, b),
      name: byName2,
      damage: (a, b) => kindFirst(a, b) || (b.damage || 0) - (a.damage || 0) || rank[b.rarity] - rank[a.rarity] || byName2(a, b)
    };
    const byKind = (i, k) => k === "all" || i.kind === k;
    const byRarity = (i, set) => !set.size || set.has(i.rarity);
    const byBlood = (i, b) => b === "any" || (b === "none" ? !i.blood && i.kind === "weapon" : i.blood === b);
    const byQuery = computed(() => {
      const q = norm(query.value.trim());
      return (i) => !q || text(i).includes(q);
    });
    const shown = computed(() => items.filter((i) => byKind(i, kind.value) && byRarity(i, rarity.value) && byBlood(i, blood.value) && byQuery.value(i)).sort(ORDER_BY[order2.value]));
    const firstMaterial = computed(() => {
      if (order2.value === "name") return null;
      const list = shown.value;
      const at = list.findIndex((i) => i.kind === "material");
      return at > 0 ? list[at].id : null;
    });
    const facets = computed(() => {
      const q = byQuery.value;
      const count = (keep) => items.filter((i) => q(i) && keep(i)).length;
      return {
        kind: Object.fromEntries(KINDS.map(([k]) => [k, count((i) => byKind(i, k) && byRarity(i, rarity.value) && byBlood(i, blood.value))])),
        rarity: Object.fromEntries(rarities2.map((r) => [r.const, count((i) => i.rarity === r.const && byKind(i, kind.value) && byBlood(i, blood.value))])),
        blood: Object.fromEntries(["any", "none", ...bloods.map((b) => b.id)].map((b) => [b, count((i) => byBlood(i, b) && byKind(i, kind.value) && byRarity(i, rarity.value))]))
      };
    });
    const picked = ref("all_black");
    const current = computed(() => items.find((i) => i.id === picked.value) || shown.value[0] || items[0]);
    watch(shown, (list) => {
      if (list.length && !list.some((i) => i.id === picked.value)) picked.value = list[0].id;
    });
    const ids = new Set(items.map((i) => i.id));
    try {
      const u = new URLSearchParams(location.search);
      if (KINDS.some(([k]) => k === u.get("kind"))) kind.value = u.get("kind");
      const rs = (u.get("rarity") || "").split(",").filter((r) => rarities2.some((x) => x.const === r));
      if (rs.length) rarity.value = new Set(rs);
      if (u.get("blood") === "none" || bloodOf[u.get("blood")]) blood.value = u.get("blood");
      if (u.get("q")) query.value = u.get("q").slice(0, 80);
      if (ORDERS.some(([k]) => k === u.get("order"))) order2.value = u.get("order");
      if (ids.has(u.get("item"))) picked.value = u.get("item");
    } catch (err) {
    }
    watch([kind, rarity, blood, query, order2, picked], () => {
      const u = new URLSearchParams(location.search);
      const put = (key, value, plain3) => {
        if (value && value !== plain3) u.set(key, value);
        else u.delete(key);
      };
      put("kind", kind.value, "all");
      put("rarity", [...rarity.value].join(","), "");
      put("blood", blood.value, "any");
      put("q", query.value.trim(), "");
      put("order", order2.value, "rarity");
      put("item", picked.value, "all_black");
      const search = u.toString();
      try {
        history.replaceState(history.state, "", location.pathname + (search ? "?" + search : "") + location.hash);
      } catch (err) {
      }
    });
    const linked = ref(false);
    async function copyLink() {
      const url = location.href.split("#")[0] + "#catalog";
      try {
        await navigator.clipboard.writeText(url);
        linked.value = true;
      } catch (err) {
        linked.value = false;
        return;
      }
      setTimeout(() => {
        linked.value = false;
      }, 1800);
    }
    const viewer = ref(null);
    function pick(id) {
      var _a;
      picked.value = id;
      if (window.matchMedia("(max-width: 900px)").matches) (_a = viewer.value) == null ? void 0 : _a.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
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
    const plain2 = computed(() => current.value.lore.filter((l) => l !== ""));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$f, [
        createVNode(_sfc_main$k, {
          title: "Каталог",
          icon: "hyperion"
        }, {
          default: withCtx(() => [..._cache[5] || (_cache[5] = [
            createBaseVNode("p", { class: "lead" }, "Все предметы плагина. Отберите их по виду, редкости и крови и выберите любой: он встанет на магический круг. Объёмную модель можно тянуть мышью или пальцем, чтобы повернуть.", -1)
          ])]),
          _: 1
        }),
        createBaseVNode("div", _hoisted_2$f, [
          createBaseVNode("div", _hoisted_3$d, [
            createBaseVNode("div", _hoisted_4$c, [
              createBaseVNode("div", _hoisted_5$c, [
                _cache[6] || (_cache[6] = createBaseVNode("label", {
                  for: "cat-q",
                  class: "sr-only"
                }, "Найти в каталоге", -1)),
                _cache[7] || (_cache[7] = createBaseVNode("svg", {
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
              createBaseVNode("div", _hoisted_6$c, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(unref(KINDS), ([k, t]) => {
                  return openBlock(), createElementBlock("button", {
                    key: k,
                    type: "button",
                    "aria-pressed": String(kind.value === k),
                    onClick: ($event) => kind.value = k
                  }, [
                    createTextVNode(toDisplayString(t), 1),
                    createBaseVNode("span", _hoisted_8$c, toDisplayString(facets.value.kind[k]), 1)
                  ], 8, _hoisted_7$c);
                }), 128))
              ]),
              createBaseVNode("fieldset", _hoisted_9$b, [
                _cache[8] || (_cache[8] = createBaseVNode("legend", null, "Редкость", -1)),
                createBaseVNode("div", _hoisted_10$b, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(unref(rarities2), (r) => {
                    return openBlock(), createElementBlock("button", {
                      key: r.const,
                      type: "button",
                      class: normalizeClass(["rchip", { none: !facets.value.rarity[r.const] && !rarity.value.has(r.const) }]),
                      "aria-pressed": String(rarity.value.has(r.const)),
                      onClick: ($event) => toggleRarity(r.const)
                    }, [
                      createBaseVNode("span", {
                        class: "rchip-swatch",
                        style: normalizeStyle(unref(rarityStyle)(r.const)),
                        "aria-hidden": "true"
                      }, null, 4),
                      createVNode(_sfc_main$C, {
                        rarity: r.const
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(r.label), 1)
                        ]),
                        _: 2
                      }, 1032, ["rarity"]),
                      createBaseVNode("span", _hoisted_12$b, toDisplayString(facets.value.rarity[r.const]), 1)
                    ], 10, _hoisted_11$b);
                  }), 128))
                ])
              ]),
              createBaseVNode("fieldset", _hoisted_13$a, [
                _cache[11] || (_cache[11] = createBaseVNode("legend", null, "Кровь", -1)),
                createBaseVNode("div", _hoisted_14$9, [
                  createBaseVNode("button", {
                    type: "button",
                    class: "bchip",
                    "aria-pressed": String(blood.value === "any"),
                    onClick: _cache[1] || (_cache[1] = ($event) => blood.value = "any")
                  }, [
                    _cache[9] || (_cache[9] = createTextVNode("Любая", -1)),
                    createBaseVNode("span", _hoisted_16$8, toDisplayString(facets.value.blood.any), 1)
                  ], 8, _hoisted_15$8),
                  (openBlock(true), createElementBlock(Fragment, null, renderList(unref(bloods), (b) => {
                    return openBlock(), createElementBlock("button", {
                      key: b.id,
                      type: "button",
                      class: normalizeClass(["bchip", { none: !facets.value.blood[b.id] && blood.value !== b.id }]),
                      "aria-pressed": String(blood.value === b.id),
                      onClick: ($event) => blood.value = blood.value === b.id ? "any" : b.id
                    }, [
                      createVNode(_sfc_main$u, {
                        colour: b.colour
                      }, null, 8, ["colour"]),
                      createTextVNode(toDisplayString(b.title), 1),
                      createBaseVNode("span", _hoisted_18$8, toDisplayString(facets.value.blood[b.id]), 1)
                    ], 10, _hoisted_17$8);
                  }), 128)),
                  createBaseVNode("button", {
                    type: "button",
                    class: normalizeClass(["bchip", { none: !facets.value.blood.none && blood.value !== "none" }]),
                    "aria-pressed": String(blood.value === "none"),
                    onClick: _cache[2] || (_cache[2] = ($event) => blood.value = blood.value === "none" ? "any" : "none")
                  }, [
                    _cache[10] || (_cache[10] = createTextVNode("Ничьи клинки", -1)),
                    createBaseVNode("span", _hoisted_20$7, toDisplayString(facets.value.blood.none), 1)
                  ], 10, _hoisted_19$7)
                ])
              ]),
              createBaseVNode("p", _hoisted_21$5, [
                createBaseVNode("span", _hoisted_22$4, toDisplayString(shown.value.length) + " из " + toDisplayString(unref(items).length), 1),
                busy.value ? (openBlock(), createElementBlock("button", {
                  key: 0,
                  type: "button",
                  class: "text-btn",
                  onClick: reset
                }, "Сбросить фильтры")) : createCommentVNode("", true),
                createBaseVNode("button", {
                  type: "button",
                  class: "text-btn cat-link",
                  onClick: copyLink
                }, toDisplayString(linked.value ? "Ссылка скопирована" : "Ссылка на отбор"), 1),
                createBaseVNode("span", _hoisted_23$4, toDisplayString(linked.value ? "Ссылка на отбор скопирована" : ""), 1),
                createBaseVNode("label", _hoisted_24$2, [
                  _cache[12] || (_cache[12] = createTextVNode("Порядок ", -1)),
                  withDirectives(createBaseVNode("select", {
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => order2.value = $event)
                  }, [
                    (openBlock(), createElementBlock(Fragment, null, renderList(ORDERS, ([k, label]) => {
                      return createBaseVNode("option", {
                        key: k,
                        value: k
                      }, toDisplayString(label), 9, _hoisted_25$2);
                    }), 64))
                  ], 512), [
                    [vModelSelect, order2.value]
                  ])
                ])
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
                return openBlock(), createElementBlock(Fragment, {
                  key: i.id
                }, [
                  firstMaterial.value && i === shown.value[0] ? (openBlock(), createElementBlock("span", _hoisted_26$2, "Клинки")) : createCommentVNode("", true),
                  i.id === firstMaterial.value ? (openBlock(), createElementBlock("span", _hoisted_27$2, "Материалы")) : createCommentVNode("", true),
                  createBaseVNode("button", {
                    type: "button",
                    role: "option",
                    class: normalizeClass(["catslot", { on: i.id === current.value.id }]),
                    "aria-selected": String(i.id === current.value.id),
                    "data-tip": i.id,
                    onClick: ($event) => pick(i.id)
                  }, [
                    createBaseVNode("img", {
                      src: i.icon,
                      alt: "",
                      loading: "lazy"
                    }, null, 8, _hoisted_29$2),
                    createBaseVNode("span", _hoisted_30$2, toDisplayString(i.name), 1),
                    i.blood ? (openBlock(), createElementBlock("span", {
                      key: 0,
                      class: "catslot-blood",
                      style: normalizeStyle({ background: unref(bloodOf)[i.blood].colour }),
                      "aria-hidden": "true"
                    }, null, 4)) : createCommentVNode("", true)
                  ], 10, _hoisted_28$2)
                ], 64);
              }), 128))
            ], 544), [
              [vShow, shown.value.length]
            ]),
            !shown.value.length ? (openBlock(), createElementBlock("div", _hoisted_31$2, [
              _cache[13] || (_cache[13] = createBaseVNode("span", {
                class: "cat-empty-slot",
                "aria-hidden": "true"
              }, null, -1)),
              _cache[14] || (_cache[14] = createBaseVNode("p", null, [
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
            createVNode(_sfc_main$A, {
              item: current.value,
              size: "panel"
            }, null, 8, ["item"]),
            createBaseVNode("header", _hoisted_32$2, [
              createBaseVNode("h3", {
                class: "cv-name paint",
                style: normalizeStyle(unref(rarityStyle)(current.value.rarity))
              }, toDisplayString(current.value.name), 5),
              createBaseVNode("p", _hoisted_33$2, [
                createBaseVNode("span", _hoisted_34$2, [
                  createVNode(_sfc_main$C, {
                    rarity: current.value.rarity
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(current.value.rarityLabel), 1)
                    ]),
                    _: 1
                  }, 8, ["rarity"])
                ]),
                createBaseVNode("span", _hoisted_35$2, toDisplayString(current.value.kind === "weapon" ? "Клинок" : "Материал"), 1),
                owner.value ? (openBlock(), createElementBlock("span", _hoisted_36$2, [
                  createVNode(_sfc_main$u, {
                    colour: owner.value.colour
                  }, null, 8, ["colour"]),
                  createTextVNode(toDisplayString(owner.value.title), 1),
                  current.value.form ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                    createTextVNode(", " + toDisplayString(formText(current.value.form)), 1)
                  ], 64)) : createCommentVNode("", true)
                ])) : current.value.kind === "weapon" ? (openBlock(), createElementBlock("span", _hoisted_37$2, "Любая кровь")) : createCommentVNode("", true)
              ])
            ]),
            plain2.value.length ? (openBlock(), createElementBlock("div", _hoisted_38$2, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(plain2.value, (l, k) => {
                return openBlock(), createElementBlock("p", {
                  key: k,
                  innerHTML: l
                }, null, 8, _hoisted_39$1);
              }), 128))
            ])) : createCommentVNode("", true),
            current.value.kind === "weapon" ? (openBlock(), createElementBlock("div", _hoisted_40$1, [
              createBaseVNode("div", _hoisted_41$1, [
                _cache[15] || (_cache[15] = createBaseVNode("span", { class: "statbar-label" }, "Урон", -1)),
                createBaseVNode("span", _hoisted_42$1, [
                  createBaseVNode("span", {
                    class: "statbar-fill",
                    style: normalizeStyle({ width: `${Math.round(current.value.damage / MAX.damage * 100)}%` })
                  }, null, 4)
                ]),
                createBaseVNode("b", _hoisted_43$1, toDisplayString(current.value.damage), 1)
              ]),
              createBaseVNode("div", _hoisted_44$1, [
                _cache[16] || (_cache[16] = createBaseVNode("span", { class: "statbar-label" }, "Скорость", -1)),
                createBaseVNode("span", _hoisted_45$1, [
                  createBaseVNode("span", {
                    class: "statbar-fill",
                    style: normalizeStyle({ width: `${Math.round(current.value.speed / MAX.speed * 100)}%` })
                  }, null, 4)
                ]),
                createBaseVNode("b", _hoisted_46$1, toDisplayString(current.value.speed), 1)
              ])
            ])) : createCommentVNode("", true),
            current.value.abilities.length ? (openBlock(), createBlock(_sfc_main$x, {
              key: 2,
              abilities: current.value.abilities
            }, null, 8, ["abilities"])) : current.value.kind === "weapon" ? (openBlock(), createElementBlock("p", _hoisted_47$1, "Способностей нет — только сталь: урон и скорость.")) : createCommentVNode("", true),
            createBaseVNode("div", _hoisted_48$1, [
              createBaseVNode("h4", null, [
                _cache[17] || (_cache[17] = createTextVNode("Как получить ", -1)),
                createBaseVNode("span", {
                  class: normalizeClass(["mbadge", `m-${current.value.method}`])
                }, toDisplayString(current.value.methodLabel), 3)
              ]),
              createBaseVNode("p", {
                innerHTML: current.value.obtain || "Источник описан в разделах ниже."
              }, null, 8, _hoisted_49$1)
            ]),
            createBaseVNode("button", {
              type: "button",
              class: "cv-more",
              onClick: _cache[4] || (_cache[4] = ($event) => unref(openItem)(current.value.id))
            }, "Полная карточка: цены, рецепты, линии →")
          ], 6)
        ])
      ]);
    };
  }
};
const _hoisted_1$e = { id: "craft" };
const _hoisted_2$e = { class: "lead" };
const _hoisted_3$c = { class: "callout altar-note" };
const _hoisted_4$b = { class: "muted" };
const _hoisted_5$b = ["href"];
const _hoisted_6$b = { class: "muted" };
const _hoisted_7$b = ["href"];
const _hoisted_8$b = { class: "crafts" };
const _hoisted_9$a = { class: "methods" };
const _hoisted_10$a = { class: "muted small" };
const _hoisted_11$a = { class: "small" };
const _hoisted_12$a = { class: "mitems" };
const _hoisted_13$9 = ["href", "title"];
const _hoisted_14$8 = ["src"];
const _sfc_main$e = {
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
    const NOT_WORKBENCH = /* @__PURE__ */ new Set(["terra_cutter"]);
    const recipes = data.recipes.filter((r) => !NOT_WORKBENCH.has(r.result));
    const methodOf = (i) => NOT_WORKBENCH.has(i.id) ? "evolve" : i.method;
    const blade = (id) => data.items.find((i) => i.id === id && i.kind === "weapon");
    const byAltar = (kind) => {
      const at = /* @__PURE__ */ new Map();
      for (const a of data.altar) {
        const it = a.kind === kind && a.result !== "all_black" && blade(a.result);
        if (!it) continue;
        if (!at.has(a.at)) at.set(a.at, []);
        if (!at.get(a.at).includes(it)) at.get(a.at).push(it);
      }
      return [...at].map(([place, items]) => ({ place, items }));
    };
    const forged = byAltar("forge");
    const evolved = byAltar("evolve");
    const groups = computed(() => ORDER.map((key) => {
      var _a;
      return {
        key,
        label: (_a = data.items.find((i) => i.method === key)) == null ? void 0 : _a.methodLabel,
        how: HOW[key],
        items: data.items.filter((i) => methodOf(i) === key)
      };
    }).filter((g) => g.items.length));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$e, [
        createVNode(_sfc_main$k, {
          title: "Крафт",
          icon: "terra_ingot"
        }, {
          default: withCtx(() => [
            createBaseVNode("p", _hoisted_2$e, "На верстаке делается " + toDisplayString(unref(recipes).length) + " вещей. Остальное куют у алтарей святилищ или находят.", 1)
          ]),
          _: 1
        }),
        createBaseVNode("div", _hoisted_3$c, [
          _cache[2] || (_cache[2] = createBaseVNode("p", null, [
            createBaseVNode("b", null, "Клинки на верстаке почти не делаются."),
            createTextVNode(" Из клинков здесь собирается только Демонический резак. Ни один клинок пепельной крови не крафтится.")
          ], -1)),
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(forged), (g) => {
            return openBlock(), createElementBlock("p", {
              key: `f-${g.place}`,
              class: "small"
            }, [
              createBaseVNode("span", _hoisted_4$b, "Куют — " + toDisplayString(g.place) + ":", 1),
              (openBlock(true), createElementBlock(Fragment, null, renderList(g.items, (i, n) => {
                return openBlock(), createElementBlock(Fragment, {
                  key: i.id
                }, [
                  createTextVNode(toDisplayString(n ? ", " : " "), 1),
                  createBaseVNode("a", {
                    href: `#w-${i.id}`
                  }, toDisplayString(i.name), 9, _hoisted_5$b)
                ], 64);
              }), 128)),
              _cache[0] || (_cache[0] = createTextVNode(". ", -1))
            ]);
          }), 128)),
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(evolved), (g) => {
            return openBlock(), createElementBlock("p", {
              key: `e-${g.place}`,
              class: "small"
            }, [
              createBaseVNode("span", _hoisted_6$b, "Эволюция — " + toDisplayString(g.place) + ":", 1),
              (openBlock(true), createElementBlock(Fragment, null, renderList(g.items, (i, n) => {
                return openBlock(), createElementBlock(Fragment, {
                  key: i.id
                }, [
                  createTextVNode(toDisplayString(n ? ", " : " "), 1),
                  createBaseVNode("a", {
                    href: `#w-${i.id}`
                  }, toDisplayString(i.name), 9, _hoisted_7$b)
                ], 64);
              }), 128)),
              _cache[1] || (_cache[1] = createTextVNode(". ", -1))
            ]);
          }), 128)),
          _cache[3] || (_cache[3] = createBaseVNode("p", { class: "small" }, [
            createTextVNode("Где стоят алтари и как к ним попасть — в разделе "),
            createBaseVNode("a", { href: "#sanctums" }, "«Святилища»"),
            createTextVNode("; цены — в разделе "),
            createBaseVNode("a", { href: "#growth" }, "«Рост клинка»"),
            createTextVNode(".")
          ], -1))
        ]),
        createBaseVNode("div", _hoisted_8$b, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(recipes), (r) => {
            return openBlock(), createBlock(_sfc_main$y, {
              key: r.result,
              recipe: r
            }, null, 8, ["recipe"]);
          }), 128))
        ]),
        _cache[4] || (_cache[4] = createBaseVNode("div", { class: "callout" }, [
          createBaseVNode("b", null, "Если результат не появляется"),
          createTextVNode(" — проверьте, что предметы плагина настоящие: обычный меч вместо Погибели рецепт не примет. ")
        ], -1)),
        _cache[5] || (_cache[5] = createBaseVNode("h3", { id: "craft-other" }, "Не на верстаке", -1)),
        createBaseVNode("div", _hoisted_9$a, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(groups.value, (g) => {
            return openBlock(), createElementBlock("article", {
              key: g.key,
              class: "method"
            }, [
              createBaseVNode("header", null, [
                createBaseVNode("span", {
                  class: normalizeClass(["mbadge", `m-${g.key}`])
                }, toDisplayString(g.label), 3),
                createBaseVNode("span", _hoisted_10$a, toDisplayString(g.items.length), 1)
              ]),
              createBaseVNode("p", _hoisted_11$a, toDisplayString(g.how), 1),
              createBaseVNode("div", _hoisted_12$a, [
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
                    }, null, 8, _hoisted_14$8),
                    createBaseVNode("span", null, toDisplayString(i.name), 1)
                  ], 8, _hoisted_13$9);
                }), 128))
              ])
            ]);
          }), 128))
        ])
      ]);
    };
  }
};
const CraftingSection = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["__scopeId", "data-v-413af4d7"]]);
const _hoisted_1$d = ["aria-label"];
const _hoisted_2$d = { class: "mlabel" };
const _sfc_main$d = {
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
            createBaseVNode("span", _hoisted_2$d, [
              createBaseVNode("b", null, toDisplayString(m.level), 1),
              createBaseVNode("span", null, toDisplayString(m.note || m.bonus), 1)
            ])
          ], 6);
        }), 128))
      ], 10, _hoisted_1$d);
    };
  }
};
const _hoisted_1$c = { id: "growth" };
const _hoisted_2$c = { class: "twocol" };
const _hoisted_3$b = { class: "panel" };
const _hoisted_4$a = { class: "tbl" };
const _hoisted_5$a = { class: "num" };
const _hoisted_6$a = { class: "num" };
const _hoisted_7$a = { class: "panel calc" };
const _hoisted_8$a = { class: "calc-row" };
const _hoisted_9$9 = { for: "calc-level" };
const _hoisted_10$9 = {
  class: "calc-row",
  role: "group",
  "aria-label": "Заточка"
};
const _hoisted_11$9 = { class: "calc-stars" };
const _hoisted_12$9 = ["aria-pressed", "aria-label", "onClick"];
const _hoisted_13$8 = { class: "calc-check" };
const _hoisted_14$7 = {
  class: "calc-out",
  "aria-live": "polite"
};
const _hoisted_15$7 = { class: "calc-num" };
const _hoisted_16$7 = { class: "prices" };
const _hoisted_17$7 = { class: "sets" };
const _hoisted_18$7 = { class: "set set-molten" };
const _hoisted_19$6 = { class: "slot" };
const _hoisted_20$6 = ["src"];
const _hoisted_21$4 = { class: "set set-paladin" };
const _hoisted_22$3 = { class: "slot" };
const _hoisted_23$3 = ["src"];
const _hoisted_24$1 = { class: "set set-nightking" };
const _hoisted_25$1 = { class: "slot" };
const _hoisted_26$1 = ["src"];
const _hoisted_27$1 = { class: "set set-terra" };
const _hoisted_28$1 = { class: "slot" };
const _hoisted_29$1 = ["src"];
const _hoisted_30$1 = { class: "set set-celestial" };
const _hoisted_31$1 = { class: "slot" };
const _hoisted_32$1 = ["src"];
const _hoisted_33$1 = { class: "set set-demon" };
const _hoisted_34$1 = { class: "slot" };
const _hoisted_35$1 = ["src"];
const _hoisted_36$1 = { class: "prices" };
const _hoisted_37$1 = { class: "prices" };
const _hoisted_38$1 = { class: "prices" };
const MAX_MASTERY = 100;
const MAX_STARS = 5;
const MASTERY_BONUS = 1;
const STAR_BONUS = 40;
const AWAKENED_BONUS = 50;
const SAMPLE_DAMAGE = 14;
const _sfc_main$c = {
  __name: "GrowthSection",
  setup(__props) {
    const blades = new Set(data.items.filter((i) => i.kind === "weapon").map((i) => i.id));
    const evolutions = data.altar.filter((a) => a.kind === "evolve" && a.result !== "all_black");
    const forgedAt = (at) => data.altar.filter((a) => a.kind === "forge" && a.at === at && blades.has(a.result));
    const level = ref(0);
    const stars = ref(0);
    const awakened = ref(false);
    const bonus = computed(() => level.value * MASTERY_BONUS + stars.value * STAR_BONUS + (awakened.value ? AWAKENED_BONUS : 0));
    const comma = (n) => String(n).replace(".", ",");
    const bonusText = computed(() => comma(bonus.value / 10));
    const sampleText = computed(() => comma(Math.round(SAMPLE_DAMAGE * (1e3 + bonus.value) / 10) / 100));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$c, [
        createVNode(_sfc_main$k, {
          title: "Рост клинка",
          icon: "forge_heart"
        }, {
          default: withCtx(() => [..._cache[2] || (_cache[2] = [
            createBaseVNode("p", { class: "lead" }, "У каждого клинка три дорожки роста; всё записано на самом клинке.", -1)
          ])]),
          _: 1
        }),
        createBaseVNode("div", _hoisted_2$c, [
          createBaseVNode("div", _hoisted_3$b, [
            _cache[4] || (_cache[4] = createBaseVNode("h3", null, "Мастерство 0–100", -1)),
            _cache[5] || (_cache[5] = createBaseVNode("p", { class: "small" }, "Клинок учится от нанесённого урона. Каждый уровень даёт +0,1% урона.", -1)),
            createVNode(_sfc_main$d),
            createBaseVNode("div", _hoisted_4$a, [
              createBaseVNode("table", null, [
                _cache[3] || (_cache[3] = createBaseVNode("thead", null, [
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
                      createBaseVNode("td", _hoisted_5$a, toDisplayString(row.total), 1),
                      createBaseVNode("td", _hoisted_6$a, toDisplayString(row.bonus), 1),
                      createBaseVNode("td", null, toDisplayString(row.note), 1)
                    ]);
                  }), 128))
                ])
              ])
            ])
          ]),
          _cache[13] || (_cache[13] = createStaticVNode('<div class="panel" data-v-b814b206><h3 data-v-b814b206>Заточка <span class="stars" data-v-b814b206>★★★★★</span></h3><p class="small" data-v-b814b206>Каждая звезда +4% урона.</p><div class="tbl" data-v-b814b206><table data-v-b814b206><thead data-v-b814b206><tr data-v-b814b206><th data-v-b814b206>Звезда</th><th class="num" data-v-b814b206>Мастерство</th><th class="num" data-v-b814b206>Осколки</th><th class="num" data-v-b814b206>Катализатор</th><th data-v-b814b206>Реликвия</th></tr></thead><tbody data-v-b814b206><tr data-v-b814b206><td class="stars" data-v-b814b206>★</td><td class="num" data-v-b814b206>15</td><td class="num" data-v-b814b206>8</td><td class="num" data-v-b814b206>1</td><td data-v-b814b206>—</td></tr><tr data-v-b814b206><td class="stars" data-v-b814b206>★★</td><td class="num" data-v-b814b206>30</td><td class="num" data-v-b814b206>16</td><td class="num" data-v-b814b206>2</td><td data-v-b814b206>—</td></tr><tr data-v-b814b206><td class="stars" data-v-b814b206>★★★</td><td class="num" data-v-b814b206>45</td><td class="num" data-v-b814b206>24</td><td class="num" data-v-b814b206>3</td><td data-v-b814b206>—</td></tr><tr data-v-b814b206><td class="stars" data-v-b814b206>★★★★</td><td class="num" data-v-b814b206>60</td><td class="num" data-v-b814b206>32</td><td class="num" data-v-b814b206>4</td><td data-v-b814b206>1</td></tr><tr data-v-b814b206><td class="stars" data-v-b814b206>★★★★★</td><td class="num" data-v-b814b206>75</td><td class="num" data-v-b814b206>40</td><td class="num" data-v-b814b206>5</td><td data-v-b814b206>1</td></tr></tbody></table></div><p class="small muted" data-v-b814b206>Катализатор: незеритовый лом в кузне, осколки аметиста в Небесном и Тёмном храмах, изумруды в джунглях, медные слитки на фабрике. Небесные клинки точат в Небесном или Тёмном храме, терра-клинки — в Храме джунглей, техноклинки — на Древней фабрике, остальные — в Незеритовой кузне.</p></div><div class="panel" data-v-b814b206><h3 data-v-b814b206>Пробуждение</h3><p class="small" data-v-b814b206>Один раз за жизнь клинка: нужны заточка ★3 и мастерство 50. Цена — 32 осколка святилища и одна его реликвия.</p><p class="small" data-v-b814b206>Перезарядка способности короче на четверть, урон +5%.</p><p class="small muted" data-v-b814b206>Пробуждают там же, где точат. На самом верху — мастерство 100, пять звёзд, пробуждён — клинок бьёт на 35% сильнее своей базы.</p></div>', 2)),
          createBaseVNode("div", _hoisted_7$a, [
            _cache[10] || (_cache[10] = createBaseVNode("h3", null, "Сколько это даёт", -1)),
            _cache[11] || (_cache[11] = createBaseVNode("p", { class: "small" }, "Три бонуса складываются: мастерство, звёзды и пробуждение.", -1)),
            createBaseVNode("div", _hoisted_8$a, [
              _cache[6] || (_cache[6] = createBaseVNode("label", { for: "calc-level" }, "Мастерство", -1)),
              createBaseVNode("output", _hoisted_9$9, toDisplayString(level.value), 1),
              withDirectives(createBaseVNode("input", {
                id: "calc-level",
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => level.value = $event),
                type: "range",
                min: "0",
                max: MAX_MASTERY,
                step: "1"
              }, null, 512), [
                [
                  vModelText,
                  level.value,
                  void 0,
                  { number: true }
                ]
              ])
            ]),
            createBaseVNode("div", _hoisted_10$9, [
              _cache[7] || (_cache[7] = createBaseVNode("span", null, "Заточка", -1)),
              createBaseVNode("output", null, toDisplayString(stars.value ? "★".repeat(stars.value) : "нет"), 1),
              createBaseVNode("div", _hoisted_11$9, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(MAX_STARS + 1, (n) => {
                  return openBlock(), createElementBlock("button", {
                    key: n,
                    type: "button",
                    "aria-pressed": stars.value === n - 1,
                    "aria-label": `Звёзд: ${n - 1}`,
                    onClick: ($event) => stars.value = n - 1
                  }, toDisplayString(n - 1), 9, _hoisted_12$9);
                }), 128))
              ])
            ]),
            createBaseVNode("label", _hoisted_13$8, [
              withDirectives(createBaseVNode("input", {
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => awakened.value = $event),
                type: "checkbox"
              }, null, 512), [
                [vModelCheckbox, awakened.value]
              ]),
              _cache[8] || (_cache[8] = createTextVNode(" Пробуждён", -1))
            ]),
            createBaseVNode("p", _hoisted_14$7, [
              createBaseVNode("span", _hoisted_15$7, "+" + toDisplayString(bonusText.value) + "%", 1),
              createBaseVNode("span", null, [
                createTextVNode("к урону. Клинок с уроном " + toDisplayString(SAMPLE_DAMAGE) + " бьёт на "),
                createBaseVNode("b", null, toDisplayString(sampleText.value), 1),
                _cache[9] || (_cache[9] = createTextVNode(".", -1))
              ])
            ]),
            _cache[12] || (_cache[12] = createBaseVNode("p", { class: "small muted" }, "После эволюции мастерство начинается с нуля, а звёзды и пробуждение остаются.", -1))
          ])
        ]),
        _cache[20] || (_cache[20] = createBaseVNode("h3", null, "Эволюции у алтарей", -1)),
        createBaseVNode("div", _hoisted_16$7, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(evolutions), (e, i) => {
            return openBlock(), createBlock(_sfc_main$v, {
              key: i,
              entry: e,
              boxed: ""
            }, null, 8, ["entry"]);
          }), 128))
        ]),
        _cache[21] || (_cache[21] = createStaticVNode('<p class="small" data-v-b814b206><a href="#w-all_black" data-v-b814b206>Все-Чёрный</a> — эволюция короны своей крови за Чёрную душу у алтаря своего храма; храм за это гневается.</p><p class="small" data-v-b814b206>Сумрачная секира меняется сама: в испытании кузни она становится <b data-v-b814b206>Секирой берсерка</b>, в испытании Небесного храма — <b data-v-b814b206>Золотым фениксом</b>.</p><p class="small muted" data-v-b814b206>Эволюция просит только материалы. Чары, заточка и пробуждение переходят на новую форму, мастерство начинается с нуля.</p><h3 data-v-b814b206>Доспехи</h3><p data-v-b814b206>Кнопка в правом нижнем углу алтаря открывает экран доспехов. Защиту даёт каждая часть, а <b data-v-b814b206>бонус</b> — только когда надеты все четыре (у Демонического — уже от двух).</p><p data-v-b814b206>Доспехи <b data-v-b814b206>привязаны к крови</b>, но не к форме: Расплавленный — пепельной, доспех паладина — небесной и ночной, доспех Короля ночи — ночной, Терра и Целестиальный — крови предков. Чужая кровь их не наденет.</p>', 6)),
        createBaseVNode("div", _hoisted_17$7, [
          createBaseVNode("article", _hoisted_18$7, [
            createBaseVNode("span", _hoisted_19$6, [
              createBaseVNode("img", {
                src: unref(data).icons.molten_helmet,
                alt: ""
              }, null, 8, _hoisted_20$6)
            ]),
            _cache[14] || (_cache[14] = createBaseVNode("div", { class: "set-body" }, [
              createBaseVNode("h4", null, "Расплавленный доспех"),
              createBaseVNode("p", { class: "set-where" }, "Кузня, после третьего испытания: 64 осколка души, незеритовая часть брони и Душа лорда за каждую часть"),
              createBaseVNode("p", { class: "set-bonus" }, "Двойной прыжок в воздухе. Погибель, Бедствие, Воля Демона и Империум бьют на 25% сильнее.")
            ], -1))
          ]),
          createBaseVNode("article", _hoisted_21$4, [
            createBaseVNode("span", _hoisted_22$3, [
              createBaseVNode("img", {
                src: unref(data).icons.paladin_helmet,
                alt: ""
              }, null, 8, _hoisted_23$3)
            ]),
            _cache[15] || (_cache[15] = createBaseVNode("div", { class: "set-body" }, [
              createBaseVNode("h4", null, "Доспех паладина"),
              createBaseVNode("p", { class: "set-where" }, "Небесный храм, с третьей формы небесной или ночной крови: 64 небесных осколка за часть"),
              createBaseVNode("p", { class: "set-bonus" }, "15 секунд без урона — начинается исцеление. Падение с любой высоты не ранит.")
            ], -1))
          ]),
          createBaseVNode("article", _hoisted_24$1, [
            createBaseVNode("span", _hoisted_25$1, [
              createBaseVNode("img", {
                src: unref(data).icons.night_king_helmet,
                alt: ""
              }, null, 8, _hoisted_26$1)
            ]),
            _cache[16] || (_cache[16] = createBaseVNode("div", { class: "set-body" }, [
              createBaseVNode("h4", null, "Доспех Короля ночи"),
              createBaseVNode("p", { class: "set-where" }, "Тёмный храм, после победы над Пустотным Серафимом: часть доспеха паладина, 32 небесных осколка, лазурит и мембраны фантома"),
              createBaseVNode("p", { class: "set-bonus" }, "Всё, что даёт доспех паладина. Ночью, в Незере и в Крае — ещё сила и скорость. Фантомы рядом становятся вашими и бьют ваших врагов.")
            ], -1))
          ]),
          createBaseVNode("article", _hoisted_27$1, [
            createBaseVNode("span", _hoisted_28$1, [
              createBaseVNode("img", {
                src: unref(data).icons.terra_helmet,
                alt: ""
              }, null, 8, _hoisted_29$1)
            ]),
            _cache[17] || (_cache[17] = createBaseVNode("div", { class: "set-body" }, [
              createBaseVNode("h4", null, "Терра-доспех"),
              createBaseVNode("p", { class: "set-where" }, "Не куётся: только из сундуков Истинного Джунглевого голема в Забытом мире"),
              createBaseVNode("p", { class: "set-bonus" }, "+4 сердца. Никакие вредные эффекты не действуют: яд, слабость, замедление и другие.")
            ], -1))
          ]),
          createBaseVNode("article", _hoisted_30$1, [
            createBaseVNode("span", _hoisted_31$1, [
              createBaseVNode("img", {
                src: unref(data).icons.celestial_helmet,
                alt: ""
              }, null, 8, _hoisted_32$1)
            ]),
            _cache[18] || (_cache[18] = createBaseVNode("div", { class: "set-body" }, [
              createBaseVNode("h4", null, "Целестиальный доспех"),
              createBaseVNode("p", { class: "set-where" }, "Не куётся: части выпадают из сундуков Целестиала в Забытом мире"),
              createBaseVNode("p", { class: "set-bonus" }, "+5 сердец, вредные эффекты не действуют, днём под открытым небом — регенерация. Полный комплект раскрывает крылья за спиной.")
            ], -1))
          ]),
          createBaseVNode("article", _hoisted_33$1, [
            createBaseVNode("span", _hoisted_34$1, [
              createBaseVNode("img", {
                src: unref(data).icons.demon_helmet,
                alt: ""
              }, null, 8, _hoisted_35$1)
            ]),
            _cache[19] || (_cache[19] = createBaseVNode("div", { class: "set-body" }, [
              createBaseVNode("h4", null, "Демонический доспех"),
              createBaseVNode("p", { class: "set-where" }, "???"),
              createBaseVNode("p", { class: "set-bonus" }, [
                createBaseVNode("b", null, "Адская ярость"),
                createTextVNode(" (от двух частей). Бейте врагов в ближнем бою — копятся заряды, до 10. Каждый заряд делает удар сильнее на 10% и чуть длиннее, а иногда удар повторяется. На 10 зарядах удар рассекает всех врагов на линии. Перестали бить — заряды тают.")
              ])
            ], -1))
          ])
        ]),
        _cache[22] || (_cache[22] = createBaseVNode("p", { class: "small" }, "Душа лорда остаётся там, где пало Горнило третьего испытания кузни, — одна за победу.", -1)),
        _cache[23] || (_cache[23] = createBaseVNode("h3", null, "Небесная ковка", -1)),
        _cache[24] || (_cache[24] = createBaseVNode("p", null, "Небесные клинки куют у алтаря Небесного храма: небесные осколки, Перо серафима и свой взнос. Золотой феникс вырастает из Сумрачной секиры, Призрачный страж лежит в сокровищнице Проклятого замка, Солнцестояние — в сокровищницах бастионов.", -1)),
        createBaseVNode("div", _hoisted_36$1, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(forgedAt("Небесный храм"), (e, i) => {
            return openBlock(), createBlock(_sfc_main$v, {
              key: i,
              entry: e,
              boxed: ""
            }, null, 8, ["entry"]);
          }), 128))
        ]),
        _cache[25] || (_cache[25] = createBaseVNode("h3", null, "Ночная ковка", -1)),
        _cache[26] || (_cache[26] = createBaseVNode("p", null, [
          createTextVNode("Синие клинки куют в "),
          createBaseVNode("b", null, "Тёмном храме"),
          createTextVNode("; они признают только ночную небесную кровь.")
        ], -1)),
        createBaseVNode("div", _hoisted_37$1, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(forgedAt("Тёмный храм"), (e, i) => {
            return openBlock(), createBlock(_sfc_main$v, {
              key: i,
              entry: e,
              boxed: ""
            }, null, 8, ["entry"]);
          }), 128))
        ]),
        _cache[27] || (_cache[27] = createBaseVNode("h3", null, "Ковка в джунглях", -1)),
        _cache[28] || (_cache[28] = createBaseVNode("p", null, "Эти клинки куёт алтарь Храма джунглей.", -1)),
        createBaseVNode("div", _hoisted_38$1, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(forgedAt("Храм джунглей"), (e, i) => {
            return openBlock(), createBlock(_sfc_main$v, {
              key: i,
              entry: e,
              boxed: ""
            }, null, 8, ["entry"]);
          }), 128))
        ]),
        _cache[29] || (_cache[29] = createBaseVNode("p", { class: "small" }, "Целестиал и Архитектор не куются: их приносят только сундуки Целестиала в Забытом мире, а признают они кровь предков пятой формы.", -1))
      ]);
    };
  }
};
const GrowthSection = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-b814b206"]]);
const _hoisted_1$b = { class: "bossbar-name" };
const _hoisted_2$b = {
  class: "bossbar-track",
  "aria-hidden": "true"
};
const _hoisted_3$a = {
  key: 0,
  class: "bossbar-notch"
};
const _sfc_main$b = {
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
        createBaseVNode("h4", _hoisted_1$b, toDisplayString(__props.name), 1),
        createBaseVNode("span", _hoisted_2$b, [
          _cache[0] || (_cache[0] = createBaseVNode("span", { class: "bossbar-fill" }, null, -1)),
          __props.notched ? (openBlock(), createElementBlock("span", _hoisted_3$a)) : createCommentVNode("", true)
        ])
      ], 2);
    };
  }
};
const _hoisted_1$a = { class: "atlas-scroll" };
const _hoisted_2$a = {
  class: "atlas-svg",
  viewBox: "0 0 1200 640",
  role: "img",
  "aria-labelledby": "atlas-title atlas-desc"
};
const _hoisted_3$9 = ["id"];
const _hoisted_4$9 = ["x", "y", "fill"];
const _hoisted_5$9 = { "clip-path": "url(#clip-ow)" };
const _hoisted_6$9 = ["x", "y", "width", "height"];
const _hoisted_7$9 = ["x", "y", "height"];
const _hoisted_8$9 = ["x", "y"];
const _hoisted_9$8 = ["x", "y"];
const _hoisted_10$8 = { class: "atlas-ruler" };
const _hoisted_11$8 = ["y1", "y2"];
const _hoisted_12$8 = ["y"];
const _hoisted_13$7 = { "clip-path": "url(#clip-ne)" };
const _hoisted_14$6 = ["cx", "cy"];
const _hoisted_15$6 = { class: "atlas-ruler right" };
const _hoisted_16$6 = ["y1", "y2"];
const _hoisted_17$6 = ["y"];
const _hoisted_18$6 = ["href"];
const _hoisted_19$5 = ["transform"];
const _hoisted_20$5 = ["href"];
const _hoisted_21$3 = {
  y: "40",
  class: "pin-label"
};
const _sfc_main$a = {
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
        createBaseVNode("div", _hoisted_1$a, [
          (openBlock(), createElementBlock("svg", _hoisted_2$a, [
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
                    }, null, 8, _hoisted_4$9);
                  }), 128))
                ], 8, _hoisted_3$9);
              }), 64)),
              _cache[0] || (_cache[0] = createStaticVNode('<linearGradient id="sky-day" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d5fb8"></stop><stop offset=".7" stop-color="#7fb3f0"></stop><stop offset="1" stop-color="#bfe0ff"></stop></linearGradient><linearGradient id="sky-night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05040e"></stop><stop offset=".7" stop-color="#151236"></stop><stop offset="1" stop-color="#2a2150"></stop></linearGradient><linearGradient id="sky-nether" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e0406"></stop><stop offset="1" stop-color="#3a0d0d"></stop></linearGradient><linearGradient id="lava" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd25a"></stop><stop offset=".25" stop-color="#ff8a1e"></stop><stop offset="1" stop-color="#c4380c"></stop></linearGradient><radialGradient id="glow-forge"><stop offset="0" stop-color="#ffb347" stop-opacity=".9"></stop><stop offset="1" stop-color="#ff5a2a" stop-opacity="0"></stop></radialGradient><radialGradient id="glow-factory"><stop offset="0" stop-color="#6ff0ff" stop-opacity=".6"></stop><stop offset="1" stop-color="#3fd0e0" stop-opacity="0"></stop></radialGradient><radialGradient id="glow-portal"><stop offset="0" stop-color="#d48bff" stop-opacity=".8"></stop><stop offset="1" stop-color="#8a3cff" stop-opacity="0"></stop></radialGradient><clipPath id="clip-ow"><rect x="0" y="0" width="740" height="640" rx="14"></rect></clipPath><clipPath id="clip-ne"><rect x="760" y="0" width="440" height="640" rx="14"></rect></clipPath>', 9))
            ]),
            createBaseVNode("g", _hoisted_5$9, [
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
                }, null, 12, _hoisted_6$9);
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
                  }, null, 8, _hoisted_7$9),
                  createBaseVNode("rect", {
                    x: x - 18,
                    y: top,
                    width: "36",
                    height: "24",
                    fill: "url(#pat-leaves)"
                  }, null, 8, _hoisted_8$9),
                  createBaseVNode("rect", {
                    x: x - 12,
                    y: top - 10,
                    width: "24",
                    height: "12",
                    fill: "url(#pat-leaves)"
                  }, null, 8, _hoisted_9$8)
                ]);
              }), 64)),
              _cache[5] || (_cache[5] = createStaticVNode('<g fill="url(#pat-moss)"><rect x="132" y="284" width="106" height="16"></rect><rect x="144" y="270" width="82" height="14"></rect><rect x="156" y="256" width="58" height="14"></rect><rect x="170" y="244" width="30" height="12"></rect></g><rect x="179" y="286" width="12" height="14" fill="#1a120a"></rect><rect x="626" y="286" width="22" height="14" fill="#6b4a2e"></rect><rect x="622" y="282" width="30" height="5" fill="#835c39"></rect><rect x="634" y="300" width="6" height="30" fill="#140c10"></rect><path d="M412 360 Q420 330 470 328 L640 328 Q690 334 694 372 L690 440 Q640 452 560 452 L460 452 Q414 448 410 420 Z" fill="#100b14"></path><ellipse cx="552" cy="400" rx="150" ry="60" fill="url(#glow-factory)" class="atlas-pulse"></ellipse><g fill="#2f8f99"><rect x="450" y="410" width="40" height="40"></rect><rect x="500" y="388" width="26" height="62"></rect><rect x="536" y="404" width="64" height="46"></rect><rect x="610" y="396" width="34" height="54"></rect></g><g fill="#b06a3a"><rect x="456" y="402" width="28" height="8"></rect><rect x="542" y="396" width="52" height="8"></rect></g><g class="atlas-blink"><rect x="508" y="396" width="10" height="6" fill="#9ff7ff"></rect><rect x="620" y="406" width="10" height="6" fill="#9ff7ff"></rect><rect x="562" y="414" width="12" height="6" fill="#ff5a5a"></rect></g><rect x="634" y="330" width="6" height="22" fill="#140c10"></rect><rect x="244" y="330" width="6" height="140" fill="#1a1414" opacity=".85"></rect><g fill="url(#pat-moss)"><rect x="150" y="470" width="190" height="96"></rect></g><g fill="#151a12"><rect x="160" y="480" width="54" height="34"></rect><rect x="222" y="480" width="54" height="34"></rect><rect x="284" y="480" width="46" height="34"></rect><rect x="160" y="522" width="170" height="36"></rect></g><g fill="#6be36b" class="atlas-blink slow"><rect x="240" y="534" width="10" height="10"></rect></g>', 15)),
              createBaseVNode("g", _hoisted_10$8, [
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
                    }, null, 8, _hoisted_11$8),
                    createBaseVNode("text", {
                      x: "24",
                      y: y + 4
                    }, toDisplayString(label), 9, _hoisted_12$8)
                  ]);
                }), 64))
              ]),
              _cache[6] || (_cache[6] = createBaseVNode("text", {
                x: "20",
                y: "626",
                class: "atlas-world"
              }, "Верхний мир", -1))
            ]),
            createBaseVNode("g", _hoisted_13$7, [
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
                }, null, 12, _hoisted_14$6);
              }), 128)),
              _cache[9] || (_cache[9] = createStaticVNode('<g fill="url(#pat-blackstone)"><rect x="910" y="72" width="170" height="40"></rect><rect x="900" y="50" width="24" height="62"></rect><rect x="1066" y="50" width="24" height="62"></rect><rect x="972" y="34" width="46" height="78"></rect></g><g fill="#b3242a"><polygon points="896,50 912,30 928,50"></polygon><polygon points="1062,50 1078,30 1094,50"></polygon><polygon points="966,34 995,8 1024,34"></polygon></g><g fill="#ffcf5a" class="atlas-windows"><rect x="988" y="54" width="14" height="14"></rect><rect x="908" y="70" width="8" height="10"></rect><rect x="1074" y="70" width="8" height="10"></rect></g><rect x="760" y="112" width="440" height="24" fill="url(#pat-bedrock)"></rect><rect x="760" y="136" width="440" height="334" fill="url(#pat-nether)"></rect><rect x="846" y="326" width="168" height="78" fill="#1c0806"></rect><ellipse cx="930" cy="366" rx="110" ry="60" fill="url(#glow-forge)" class="atlas-pulse"></ellipse><g fill="#3a2a26"><rect x="858" y="352" width="10" height="52"></rect><rect x="992" y="352" width="10" height="52"></rect><rect x="916" y="380" width="28" height="12"></rect><rect x="922" y="392" width="16" height="12"></rect></g><rect x="846" y="398" width="168" height="6" fill="#ff8a1e" class="atlas-pulse"></rect><rect x="760" y="470" width="440" height="94" fill="url(#lava)" class="atlas-lava"></rect><rect x="760" y="564" width="440" height="76" fill="url(#pat-bedrock)"></rect>', 11)),
              createBaseVNode("g", _hoisted_15$6, [
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
                    }, null, 8, _hoisted_16$6),
                    createBaseVNode("text", {
                      x: "1176",
                      y: y + 4,
                      "text-anchor": "end"
                    }, toDisplayString(label), 9, _hoisted_17$6)
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
                  }, null, 8, _hoisted_20$5),
                  createBaseVNode("text", _hoisted_21$3, toDisplayString(p.name), 1)
                ], 8, _hoisted_19$5)
              ], 12, _hoisted_18$6);
            }), 64))
          ]))
        ]),
        _cache[16] || (_cache[16] = createBaseVNode("figcaption", null, "Разрез мира: небо, земля, недра и Незер. Нажмите на святилище, чтобы перейти к нему.", -1))
      ], 2);
    };
  }
};
const _hoisted_1$9 = { id: "sanctums" };
const _hoisted_2$9 = { class: "guides" };
const _hoisted_3$8 = { class: "guide-card" };
const _hoisted_4$8 = { class: "guide-card" };
const _hoisted_5$8 = { class: "guide-card" };
const _hoisted_6$8 = { class: "guide-card" };
const _hoisted_7$8 = {
  class: "guide-item",
  "aria-hidden": "true"
};
const _hoisted_8$8 = ["src"];
const _hoisted_9$7 = { class: "guide-card" };
const _hoisted_10$7 = { class: "guide-card" };
const _hoisted_11$7 = {
  class: "guide-item",
  "aria-hidden": "true"
};
const _hoisted_12$7 = ["src"];
const _hoisted_13$6 = {
  class: "sanctum",
  id: "forge"
};
const _hoisted_14$5 = ["src"];
const _hoisted_15$5 = { class: "sanctum-body" };
const _hoisted_16$5 = { class: "sanctum-info" };
const _hoisted_17$5 = { class: "kv" };
const _hoisted_18$5 = { class: "inline-icons" };
const _hoisted_19$4 = ["src"];
const _hoisted_20$4 = ["src"];
const _hoisted_21$2 = { class: "boss" };
const _hoisted_22$2 = {
  class: "sanctum",
  id: "temple"
};
const _hoisted_23$2 = ["src"];
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
const _hoisted_107 = { class: "inline-icons" };
const _hoisted_108 = ["src"];
const _hoisted_109 = ["src"];
const _hoisted_110 = { class: "kv" };
const _hoisted_111 = { class: "inline-icons" };
const _hoisted_112 = ["src"];
const _hoisted_113 = ["src"];
const _hoisted_114 = ["src"];
const _hoisted_115 = { class: "inline-icons" };
const _hoisted_116 = ["src"];
const _hoisted_117 = ["src"];
const _hoisted_118 = ["src"];
const _hoisted_119 = ["src"];
const _hoisted_120 = ["src"];
const _hoisted_121 = ["src"];
const _hoisted_122 = ["src"];
const _hoisted_123 = ["src"];
const _hoisted_124 = ["src"];
const _hoisted_125 = ["src"];
const _hoisted_126 = { class: "inline-icons" };
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
const _hoisted_137 = ["src"];
const _hoisted_138 = {
  class: "stack",
  style: { "align-content": "start" }
};
const _hoisted_139 = { class: "boss" };
const _hoisted_140 = { class: "boss" };
const _sfc_main$9 = {
  __name: "SanctumsSection",
  setup(__props) {
    const recipe = (key) => data.recipes.find((r) => r.result === key);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$9, [
        createVNode(_sfc_main$k, {
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
        createVNode(_sfc_main$a),
        _cache[129] || (_cache[129] = createStaticVNode('<div class="flow" aria-label="Путь через святилище" data-v-86c6a540><div class="step" data-v-86c6a540><b data-v-86c6a540>Вход</b><span data-v-86c6a540>туннель, ступени или ворота</span></div><span class="to" aria-hidden="true" data-v-86c6a540>→</span><div class="step" data-v-86c6a540><b data-v-86c6a540>Три комнаты</b><span data-v-86c6a540>в каждой стража; с неё падают осколки</span></div><span class="to" aria-hidden="true" data-v-86c6a540>→</span><div class="step" data-v-86c6a540><b data-v-86c6a540>Алтарь</b><span data-v-86c6a540>откроется, когда падёт вся стража: эволюция, заточка, испытания</span></div><span class="to" aria-hidden="true" data-v-86c6a540>→</span><div class="step" data-v-86c6a540><b data-v-86c6a540>Арена</b><span data-v-86c6a540>испытание: пять волн, в пятой — страж</span></div></div><h3 data-v-86c6a540>Пять святилищ коротко</h3><div class="tbl" data-v-86c6a540><table data-v-86c6a540><thead data-v-86c6a540><tr data-v-86c6a540><th data-v-86c6a540>Святилище</th><th data-v-86c6a540>Где</th><th data-v-86c6a540>Чем искать</th><th data-v-86c6a540>Страж</th><th data-v-86c6a540>Кочует</th><th data-v-86c6a540>Кровь</th></tr></thead><tbody data-v-86c6a540><tr data-v-86c6a540><th scope="row" data-v-86c6a540><a href="#forge" data-v-86c6a540>Незеритовая кузня</a></th><td data-v-86c6a540>Незер, в толще незерака</td><td data-v-86c6a540>Карта кузни</td><td data-v-86c6a540>Горнило</td><td data-v-86c6a540>да</td><td data-v-86c6a540>пепельная</td></tr><tr data-v-86c6a540><th scope="row" data-v-86c6a540><a href="#temple" data-v-86c6a540>Небесный храм</a></th><td data-v-86c6a540>верхний мир, остров на высоте 200</td><td data-v-86c6a540>Компас воздуха</td><td data-v-86c6a540>Серафим Падшего Рассвета</td><td data-v-86c6a540>да, и рушится от Печати ночи</td><td data-v-86c6a540>небесная</td></tr><tr data-v-86c6a540><th scope="row" data-v-86c6a540><a href="#jungle" data-v-86c6a540>Храм джунглей</a></th><td data-v-86c6a540>джунгли</td><td data-v-86c6a540>Карта джунглей</td><td data-v-86c6a540>Древний страж джунглей</td><td data-v-86c6a540>да</td><td data-v-86c6a540>предков</td></tr><tr data-v-86c6a540><th scope="row" data-v-86c6a540><a href="#night" data-v-86c6a540>Тёмный храм</a></th><td data-v-86c6a540>верхний мир, только ночью</td><td data-v-86c6a540>Ночной компас</td><td data-v-86c6a540>Пустотный Серафим (платформа)</td><td data-v-86c6a540>каждую ночь на новом месте</td><td data-v-86c6a540>ночная небесная</td></tr><tr data-v-86c6a540><th scope="row" data-v-86c6a540><a href="#factory" data-v-86c6a540>Древняя фабрика</a></th><td data-v-86c6a540>глубоко под землёй</td><td data-v-86c6a540>Неизвестный компас</td><td data-v-86c6a540>Предвестник</td><td data-v-86c6a540>нет</td><td data-v-86c6a540>техноорганическая</td></tr></tbody></table></div><h3 data-v-86c6a540>Как найти святилище</h3><p data-v-86c6a540>Каждое святилище ищется своим предметом. Компас ведёт к храму, где бы тот ни стоял; карта показывает место, где святилище стояло, когда её сделали.</p>', 5)),
        createBaseVNode("div", _hoisted_2$9, [
          createBaseVNode("div", _hoisted_3$8, [
            createVNode(_sfc_main$y, {
              recipe: recipe("g:air_compass"),
              small: ""
            }, null, 8, ["recipe"]),
            _cache[1] || (_cache[1] = createBaseVNode("div", null, [
              createBaseVNode("h4", null, "Компас воздуха"),
              createBaseVNode("p", { class: "small muted" }, "Указывает на маяк Врат ветра под Небесным храмом.")
            ], -1))
          ]),
          createBaseVNode("div", _hoisted_4$8, [
            createVNode(_sfc_main$y, {
              recipe: recipe("g:forge_map"),
              small: ""
            }, null, 8, ["recipe"]),
            _cache[2] || (_cache[2] = createBaseVNode("div", null, [
              createBaseVNode("h4", null, "Карта кузни"),
              createBaseVNode("p", { class: "small muted" }, "Отмечает Незеритовую кузню.")
            ], -1))
          ]),
          createBaseVNode("div", _hoisted_5$8, [
            createVNode(_sfc_main$y, {
              recipe: recipe("g:jungle_map"),
              small: ""
            }, null, 8, ["recipe"]),
            _cache[3] || (_cache[3] = createBaseVNode("div", null, [
              createBaseVNode("h4", null, "Карта джунглей"),
              createBaseVNode("p", { class: "small muted" }, "Отмечает Храм джунглей.")
            ], -1))
          ]),
          createBaseVNode("div", _hoisted_6$8, [
            createBaseVNode("div", _hoisted_7$8, [
              createBaseVNode("img", {
                src: unref(data).guideIcons.unknown_compass,
                alt: ""
              }, null, 8, _hoisted_8$8)
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
          createBaseVNode("div", _hoisted_9$7, [
            createVNode(_sfc_main$y, {
              recipe: recipe("g:night_compass"),
              small: ""
            }, null, 8, ["recipe"]),
            _cache[5] || (_cache[5] = createBaseVNode("div", null, [
              createBaseVNode("h4", null, "Ночной компас"),
              createBaseVNode("p", { class: "small muted" }, "Указывает на Тёмный храм, пока тот стоит.")
            ], -1))
          ]),
          createBaseVNode("div", _hoisted_10$7, [
            createBaseVNode("div", _hoisted_11$7, [
              createBaseVNode("img", {
                src: unref(data).icons.terra_compass,
                alt: ""
              }, null, 8, _hoisted_12$7)
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
        createBaseVNode("article", _hoisted_13$6, [
          createBaseVNode("figure", null, [
            _cache[7] || (_cache[7] = createBaseVNode("span", {
              class: "figure-title",
              "aria-hidden": "true"
            }, "Незеритовая кузня", -1)),
            createBaseVNode("img", {
              src: unref(data).images.forge,
              alt: "Незеритовая кузня: вид снаружи, разрез и план"
            }, null, 8, _hoisted_14$5),
            _cache[8] || (_cache[8] = createBaseVNode("figcaption", null, "Снаружи · разрез · план", -1))
          ]),
          createBaseVNode("div", _hoisted_15$5, [
            createBaseVNode("div", _hoisted_16$5, [
              _cache[13] || (_cache[13] = createBaseVNode("div", { class: "sanctum-title" }, [
                createBaseVNode("h3", null, "Незеритовая кузня"),
                createBaseVNode("span", { class: "pill" }, "Незер")
              ], -1)),
              createBaseVNode("dl", _hoisted_17$5, [
                _cache[12] || (_cache[12] = createStaticVNode("<div data-v-86c6a540><dt data-v-86c6a540>Где</dt><dd data-v-86c6a540>в Незере, внутри скалы</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Внутри</dt><dd data-v-86c6a540>вестибюль, кузнечный зал, арена и алтарная</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Стража</dt><dd data-v-86c6a540>скелеты-иссушители, ифриты, пиглины-громилы</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Алтарь</dt><dd data-v-86c6a540>испытания, эволюции, заточка и четвёртая форма пепельной крови</dd></div>", 4)),
                createBaseVNode("div", null, [
                  _cache[11] || (_cache[11] = createBaseVNode("dt", null, "Добыча", -1)),
                  createBaseVNode("dd", _hoisted_18$5, [
                    createBaseVNode("img", {
                      src: unref(data).icons.soul_shard,
                      alt: ""
                    }, null, 8, _hoisted_19$4),
                    _cache[9] || (_cache[9] = createTextVNode("Осколки души · ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.forge_heart,
                      alt: ""
                    }, null, 8, _hoisted_20$4),
                    _cache[10] || (_cache[10] = createTextVNode("Сердце кузни", -1))
                  ])
                ])
              ])
            ]),
            createBaseVNode("div", _hoisted_21$2, [
              createVNode(_sfc_main$b, {
                name: "Горнило, кузнец Преисподней",
                colour: "red"
              }),
              _cache[14] || (_cache[14] = createStaticVNode('<div class="boss-stats" data-v-86c6a540><span class="pill" data-v-86c6a540>400 здоровья</span><span class="pill" data-v-86c6a540>урон 7</span><span class="pill" data-v-86c6a540>броня 12</span><span class="pill" data-v-86c6a540>скелет-иссушитель</span></div><ul class="attacks" data-v-86c6a540><li data-v-86c6a540><b data-v-86c6a540>Молот.</b> Прыгает к игроку; место посадки светится — уходите из круга, а после посадки бейте.</li><li data-v-86c6a540><b data-v-86c6a540>Огненное кольцо.</b> Катится по полу от босса — перепрыгивайте.</li><li data-v-86c6a540><b data-v-86c6a540>Извержение.</b> Из оранжевых кругов под бойцами бьёт лава — выйдите из них.</li><li data-v-86c6a540><b data-v-86c6a540>Искры горна.</b> Пол в шахматку: сначала вспыхивает одна половина клеток, потом другая — стойте на тёмных.</li><li data-v-86c6a540><b data-v-86c6a540>Фаза 2 · Раскалённый металл (60%).</b> Кольцо катится дважды, один раз приходят подмастерья. <b data-v-86c6a540>Клеймо</b>: метка на двух бойцах взрывается вокруг них через 5 секунд — разойдитесь.</li><li data-v-86c6a540><b data-v-86c6a540>Фаза 3 · Переплавка (30%).</b> Быстрее и сильнее. Лава съедает арену от края, пока не останется круг в 8 блоков.</li></ul>', 2))
            ])
          ])
        ]),
        createBaseVNode("article", _hoisted_22$2, [
          createBaseVNode("figure", null, [
            _cache[15] || (_cache[15] = createBaseVNode("span", {
              class: "figure-title",
              "aria-hidden": "true"
            }, "Небесный храм", -1)),
            createBaseVNode("img", {
              src: unref(data).images.temple,
              alt: "Небесный храм: вид снаружи, разрез и план"
            }, null, 8, _hoisted_23$2),
            _cache[16] || (_cache[16] = createBaseVNode("figcaption", null, "Снаружи · разрез · план", -1))
          ]),
          createBaseVNode("div", _hoisted_24, [
            createBaseVNode("div", _hoisted_25, [
              _cache[22] || (_cache[22] = createBaseVNode("div", { class: "sanctum-title" }, [
                createBaseVNode("h3", null, "Небесный храм"),
                createBaseVNode("span", { class: "pill" }, "верхний мир")
              ], -1)),
              createBaseVNode("dl", _hoisted_26, [
                _cache[21] || (_cache[21] = createStaticVNode("<div data-v-86c6a540><dt data-v-86c6a540>Где</dt><dd data-v-86c6a540>летающий остров высоко в небе</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Внутри</dt><dd data-v-86c6a540>колоннада, неф с колокольнями и ротонда с алтарём</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Путь наверх</dt><dd data-v-86c6a540>поток ветра у Врат ветра</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Стража</dt><dd data-v-86c6a540>зимогоры и поборники в золоте</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Алтарь</dt><dd data-v-86c6a540>испытания, ковка, заточка и пробуждение небесных клинков</dd></div>", 5)),
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
              createVNode(_sfc_main$b, {
                name: "Серафим Падшего Рассвета",
                colour: "white"
              }),
              _cache[23] || (_cache[23] = createStaticVNode('<div class="boss-stats" data-v-86c6a540><span class="pill" data-v-86c6a540>450 здоровья</span><span class="pill" data-v-86c6a540>броня 8</span><span class="pill" data-v-86c6a540>иллюзор</span></div><ul class="attacks" data-v-86c6a540><li data-v-86c6a540><b data-v-86c6a540>Печать ночи.</b> Падает с него в третьем испытании.</li><li data-v-86c6a540><b data-v-86c6a540>Суд.</b> В столбы света бьёт молния — выйдите из света.</li><li data-v-86c6a540><b data-v-86c6a540>Перья.</b> На золотые кольца падает залп стрел — выйдите из кольца.</li><li data-v-86c6a540><b data-v-86c6a540>Фаза 2 · Полдень (66%).</b> Сначала <b data-v-86c6a540>Щит рассвета</b>: неуязвим, пока живы призванные стражи. Потом <b data-v-86c6a540>Зенит</b>: солнце бьёт всех, кого видит, — прячьтесь в тень колонн.</li><li data-v-86c6a540><b data-v-86c6a540>Фаза 3 · Закат (33%).</b> <b data-v-86c6a540>Падший нимб</b>: четыре осколка над двором лечат Серафима — сбивайте их луком. Суд падает очередью из шести столбов — уходите вбок.</li><li data-v-86c6a540><b data-v-86c6a540>Лучи рассвета.</b> Лучи обходят его кругом — перепрыгивайте их.</li><li data-v-86c6a540><b data-v-86c6a540>Мерцание.</b> Переносится по двору.</li></ul>', 2))
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
                _cache[29] || (_cache[29] = createStaticVNode("<div data-v-86c6a540><dt data-v-86c6a540>Где</dt><dd data-v-86c6a540>ступенчатая пирамида в джунглях</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Внутри</dt><dd data-v-86c6a540>большой зал, арена и алтарная комната</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Стража</dt><dd data-v-86c6a540>болотники, пещерные пауки, пауки, ведьмы</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Алтарь</dt><dd data-v-86c6a540>испытания, ковка Терра-блейда и эволюция в Энигму, ключи Забытого мира, заточка и пробуждение терра-клинков, третья форма крови предков за Терра-сущность</dd></div>", 4)),
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
              createVNode(_sfc_main$b, {
                name: "Древний страж джунглей",
                colour: "green"
              }),
              _cache[31] || (_cache[31] = createStaticVNode('<div class="boss-stats" data-v-86c6a540><span class="pill" data-v-86c6a540>550 здоровья</span><span class="pill" data-v-86c6a540>урон 16</span><span class="pill" data-v-86c6a540>броня 10</span><span class="pill" data-v-86c6a540>разоритель</span></div><ul class="attacks" data-v-86c6a540><li data-v-86c6a540><b data-v-86c6a540>Землетрясение.</b> Подбрасывает всех на земле рядом.</li><li data-v-86c6a540><b data-v-86c6a540>Корни.</b> Под бойцами сжимаются зелёные кольца — выйдите из них, пока из пола не вырвались корни.</li><li data-v-86c6a540><b data-v-86c6a540>Споры.</b> Ядовитое облако вокруг босса — успейте выйти.</li><li data-v-86c6a540><b data-v-86c6a540>Таран.</b> Мчится по зелёной линии — сойдите с неё; врезавшись в стену, уязвим.</li><li data-v-86c6a540><b data-v-86c6a540>Фаза 2 · Цветение (65%).</b> Зовёт обитателей храма. В углах распускаются цветы и лечат стража — постойте на цветке 3 секунды, и он завянет.</li><li data-v-86c6a540><b data-v-86c6a540>Фаза 3 · Гон (30%).</b> Таранит чаще и оставляет стены корней. Таран в стену оглушает стража.</li></ul>', 2))
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
                _cache[36] || (_cache[36] = createStaticVNode("<div data-v-86c6a540><dt data-v-86c6a540>Когда</dt><dd data-v-86c6a540>после того как сломали Печать ночи — каждую ночь в новом месте</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Какой</dt><dd data-v-86c6a540>тёмная тень Небесного храма</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Стража</dt><dd data-v-86c6a540>нет ни стражи, ни испытаний, ни рейдов: храм пуст, в ротонде — бесплатная платформа босса</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Алтарь</dt><dd data-v-86c6a540>ночная ковка, заточка и пробуждение; проход к нему закрыт, пока жив Серафим</dd></div>", 4)),
                createBaseVNode("div", null, [
                  _cache[35] || (_cache[35] = createBaseVNode("dt", null, "Добыча", -1)),
                  createBaseVNode("dd", _hoisted_46, [
                    createBaseVNode("img", {
                      src: unref(data).icons.celestial_shard,
                      alt: ""
                    }, null, 8, _hoisted_47),
                    _cache[34] || (_cache[34] = createTextVNode("Небесные осколки с Пустотного Серафима", -1))
                  ])
                ])
              ])
            ]),
            createBaseVNode("div", _hoisted_48, [
              createVNode(_sfc_main$b, {
                name: "Пустотный Серафим",
                colour: "purple"
              }),
              _cache[38] || (_cache[38] = createStaticVNode('<div class="boss-stats" data-v-86c6a540><span class="pill" data-v-86c6a540>700 здоровья</span><span class="pill" data-v-86c6a540>урон 13</span><span class="pill" data-v-86c6a540>броня 10</span><span class="pill" data-v-86c6a540>эндермен</span></div><ul class="attacks" data-v-86c6a540><li data-v-86c6a540><b data-v-86c6a540>Платформа.</b> Встаньте на неё в ротонде — придёт Серафим. Пока он жив, ночь стоит и рассвета нет; павшим вход в ротонду закрыт до конца боя. Победа даёт четвёртую форму всей ночной крови третьей формы, что билась с ним; падут все — храм исчезнет до следующей ночи.</li><li data-v-86c6a540><b data-v-86c6a540>Щит ударов.</b> Снимается числом ударов, а не силой.</li><li data-v-86c6a540><b data-v-86c6a540>Головы пустоты.</b> Пока живы головы, Серафим получает меньше урона — фиолетовые нити ведут к ним.</li><li data-v-86c6a540><b data-v-86c6a540>Глиф.</b> Встаньте в круг упавшего маяка, иначе взрыв.</li><li data-v-86c6a540><b data-v-86c6a540>Лучи разбитого сердца.</b> Лучи обходят его кругом — прыгайте.</li><li data-v-86c6a540><b data-v-86c6a540>Шаг сквозь пустоту.</b> Встаёт за спиной — выйдите из кольца.</li><li data-v-86c6a540><b data-v-86c6a540>Фазы.</b> Головы пустоты (70%) — щит и головы. <b data-v-86c6a540>Изнанка</b> (40%) — тень повторяет Глиф и Шаг зеркально через центр зала. <b data-v-86c6a540>Сингулярность</b> (15%) — чёрная дыра тянет к центру, держитесь дальше восьми блоков.</li></ul>', 2))
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
                _cache[44] || (_cache[44] = createStaticVNode("<div data-v-86c6a540><dt data-v-86c6a540>Где</dt><dd data-v-86c6a540>глубоко под землёй. Путь укажет Неизвестный компас</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Внутри</dt><dd data-v-86c6a540>огромный цех: погрузочный и сборочный залы, реактор и пульт управления</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Стража</dt><dd data-v-86c6a540>автоматоны и летучие дроны</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Проверка у алтаря</dt><dd data-v-86c6a540>терминал открывается не сразу: <b data-v-86c6a540>при каждом входе в алтарь</b> ZorahM-GPT показывает капчу — одну из 24 задач: искажённые коды, примеры, счёт предметов, часы, кубики. Ответ — до четырёх цифр, набирается клавишами на экране (время с часов вводят как ЧЧММ). За ошибку экран закрывается и бьёт молния: <b data-v-86c6a540>3 сердца</b> урона, без огня, и она <b data-v-86c6a540>не убивает</b> — останавливается на половине сердца. Задача после ошибки <b data-v-86c6a540>не меняется</b>: у терминала ждёт та же, пока её не решат; следующая не повторит только что решённую</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Терминал</dt><dd data-v-86c6a540>запуск Предвестника (24 детали), рейды, техноорганический вирус (20 деталей), кнопка крови. Молчит, пока стоит стража цехов и Предвестник в реакторе</dd></div>", 5)),
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
              createVNode(_sfc_main$b, {
                name: "Предвестник",
                colour: "blue"
              }),
              _cache[46] || (_cache[46] = createStaticVNode('<div class="boss-stats" data-v-86c6a540><span class="pill" data-v-86c6a540>600 здоровья</span><span class="pill" data-v-86c6a540>урон 18</span><span class="pill" data-v-86c6a540>броня 14</span><span class="pill" data-v-86c6a540>железный голем</span></div><ul class="attacks" data-v-86c6a540><li data-v-86c6a540><b data-v-86c6a540>Запуск.</b> В первый раз встаёт сам, потом его запускают на терминале. Каждому бойцу — Ядро Предвестника и 24 детали.</li><li data-v-86c6a540><b data-v-86c6a540>Павшим вход закрыт</b> до конца боя.</li><li data-v-86c6a540><b data-v-86c6a540>Луч смерти.</b> Красная линия желтеет и стреляет — сойдите с неё или спрячьтесь за стену.</li><li data-v-86c6a540><b data-v-86c6a540>Ракеты.</b> Падают в оранжевые кольца.</li><li data-v-86c6a540><b data-v-86c6a540>Магнитный импульс.</b> Тянет к себе и разряжается — бегите против тяги, после разряда бейте.</li><li data-v-86c6a540><b data-v-86c6a540>Фаза 2 · Протокол сноса (65%).</b> Зовёт дронов. Сектора пола мигают по очереди, потом взрываются в том же порядке — запомните путь.</li><li data-v-86c6a540><b data-v-86c6a540>Фаза 3 · Перегрузка (30%).</b> Быстрее, бьёт током всех рядом. Лучи греют его; перегревшись, он остывает 4 секунды, и урон по нему двойной.</li></ul>', 2))
            ])
          ])
        ]),
        _cache[130] || (_cache[130] = createStaticVNode('<h3 data-v-86c6a540>Рейды Древней фабрики</h3><p class="small muted" data-v-86c6a540>Открываются после первой победы над Предвестником; начать можно любой открытый уровень, победа открывает следующий. Награда — древние детали, а на высоких уровнях и Ядро Предвестника.</p><div class="tbl" data-v-86c6a540><table data-v-86c6a540><thead data-v-86c6a540><tr data-v-86c6a540><th data-v-86c6a540>Уровень</th><th data-v-86c6a540>Цена</th><th data-v-86c6a540>Стражники</th><th data-v-86c6a540>С каждого</th><th data-v-86c6a540>Награда всем в конце</th></tr></thead><tbody data-v-86c6a540><tr data-v-86c6a540><th scope="row" data-v-86c6a540>1</th><td data-v-86c6a540>даром, раз в 10 минут</td><td data-v-86c6a540>обычные</td><td data-v-86c6a540>1 деталь</td><td data-v-86c6a540>6–10 деталей</td></tr><tr data-v-86c6a540><th scope="row" data-v-86c6a540>2</th><td data-v-86c6a540>8 деталей</td><td data-v-86c6a540>на ступень крепче</td><td data-v-86c6a540>2 детали</td><td data-v-86c6a540>12–20 деталей, шанс на ядро</td></tr><tr data-v-86c6a540><th scope="row" data-v-86c6a540>3</th><td data-v-86c6a540>16 деталей</td><td data-v-86c6a540>на две ступени крепче</td><td data-v-86c6a540>3 детали</td><td data-v-86c6a540>20–26 деталей, двойной шанс на ядро</td></tr></tbody></table></div><p class="small muted" data-v-86c6a540>Рейд — 4 волны, 8 минут. Провал забирает половину деталей, добытых со стражи. Вторая форма техноорганической крови — победа в рейде и 24 детали, третья — рейд III уровня, 64 детали и Ядро Предвестника, четвёртая — Чёрная душа у терминала.</p>', 4)),
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
                _cache[53] || (_cache[53] = createStaticVNode("<div data-v-86c6a540><dt data-v-86c6a540>Как найти</dt><dd data-v-86c6a540>с любой формой крови: на крыше Незера нажмите ПКМ Душой демона — она полетит к замку, как око Края. Замок встаёт к северу, воротами к вам</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Где</dt><dd data-v-86c6a540>на крыше Незера; один на сервер</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Исчезает</dt><dd data-v-86c6a540>опустевший замок растворяется, следующая душа найдёт новый. Король пробуждается в замке лишь однажды</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Город</dt><dd data-v-86c6a540>дома, рынок и таверна подданных короля</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Жители</dt><dd data-v-86c6a540>пока король жив, в замке появляются пиглины</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Часовая башня</dt><dd data-v-86c6a540>в атриуме висит Адская сущность; её охраняют Стражи пекла. Пока жив хоть один, поле не подпускает. В инвентаре сущность поджигает носителя. Наверху — Зал маятника: люк к нему открывается, только когда сущность взята</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Донжон</dt><dd data-v-86c6a540>большой зал, библиотека, спальня и тронный зал</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Стража</dt><dd data-v-86c6a540>пиглины-громилы и чемпионы: Мечники Бедствия и Берсерки короля</dd></div>", 8)),
                createBaseVNode("div", null, [
                  _cache[52] || (_cache[52] = createBaseVNode("dt", null, "Добыча", -1)),
                  createBaseVNode("dd", _hoisted_63, [
                    createBaseVNode("img", {
                      src: unref(data).icons.black_substance,
                      alt: ""
                    }, null, 8, _hoisted_64),
                    _cache[49] || (_cache[49] = createTextVNode("Чёрная душа в рамке над троном · ", -1)),
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
              createVNode(_sfc_main$b, {
                name: "Проклятый король",
                colour: "red"
              }),
              _cache[55] || (_cache[55] = createStaticVNode('<div class="boss-stats" data-v-86c6a540><span class="pill" data-v-86c6a540>1200 здоровья</span><span class="pill" data-v-86c6a540>урон 10</span><span class="pill" data-v-86c6a540>броня 12</span><span class="pill" data-v-86c6a540>пиглин-громила</span></div><ul class="attacks" data-v-86c6a540><li data-v-86c6a540><b data-v-86c6a540>Тронный зал.</b> Колонны — укрытие от указа. Пока король жив, Чёрную душу не снять; потом её достаёт любой, встав на трон.</li><li data-v-86c6a540><b data-v-86c6a540>Акт I. Удар короны.</b> Выйдите из золотого веера или зайдите за спину.</li><li data-v-86c6a540><b data-v-86c6a540>Рывок.</b> Несётся по золотой линии, потом уязвим.</li><li data-v-86c6a540><b data-v-86c6a540>Золото.</b> В круги рушится золото.</li><li data-v-86c6a540><b data-v-86c6a540>Указ.</b> Тянет к ногам всех на виду — спасают расстояние и колонны.</li><li data-v-86c6a540><b data-v-86c6a540>Бросок топора.</b> Топор летит по золотой дорожке и возвращается — сойдите с неё.</li><li data-v-86c6a540><b data-v-86c6a540>Поступь.</b> По полу бегут золотые волны — перепрыгивайте.</li><li data-v-86c6a540><b data-v-86c6a540>Акт II. Золотой бастион.</b> Жаровни гаснут. Король на троне под щитом, который считает удары, — бейте часто. С ворот идёт подмога, с трона летят копья.</li><li data-v-86c6a540><b data-v-86c6a540>Акт III. Проклятие короны.</b> Ярость. <b data-v-86c6a540>Проклятие</b> жжёт края зала — бегите в середину. <b data-v-86c6a540>Казнь</b>: прыгает на самого слабого. В центр зала падает <b data-v-86c6a540>люстра-корона</b> и горит огненным кольцом до конца боя.</li><li data-v-86c6a540><b data-v-86c6a540>Рог.</b> В третьем акте весь замок бежит в тронный зал. Когда король падает, его народ теряет волю.</li><li data-v-86c6a540><b data-v-86c6a540>Дань.</b> Подданные в зале лечат короля — бейте сначала их.</li></ul>', 2))
            ]),
            createBaseVNode("div", _hoisted_68, [
              createVNode(_sfc_main$b, {
                name: "Хронарх",
                colour: "yellow"
              }),
              _cache[61] || (_cache[61] = createStaticVNode('<div class="boss-stats" data-v-86c6a540><span class="pill" data-v-86c6a540>800 здоровья</span><span class="pill" data-v-86c6a540>броня 12</span><span class="pill" data-v-86c6a540>бродяга с часами вместо головы</span><span class="pill" data-v-86c6a540>Зал маятника</span></div>', 1)),
              createBaseVNode("ul", _hoisted_69, [
                _cache[60] || (_cache[60] = createStaticVNode("<li data-v-86c6a540><b data-v-86c6a540>Путь.</b> Верх часовой башни. Люк над лестницей откроется, только когда Адская сущность взята.</li><li data-v-86c6a540><b data-v-86c6a540>Застывшее время.</b> На полу открываются три поля: в них вы медленны и не можете прыгать — обходите их.</li><li data-v-86c6a540><b data-v-86c6a540>Стрелки.</b> Две стрелки часов обходят его кругом — перепрыгивайте, но не из поля.</li><li data-v-86c6a540><b data-v-86c6a540>Бой часов.</b> Двенадцать часов на полу бьют по очереди по кругу.</li><li data-v-86c6a540><b data-v-86c6a540>Фаза 2 · Так (60%).</b> <b data-v-86c6a540>Перемотка</b> возвращает всех на золотые метки. <b data-v-86c6a540>Обратный отсчёт</b>: помеченным — под маятник за 8 секунд.</li><li data-v-86c6a540><b data-v-86c6a540>Фаза 3 · Полночь (25%).</b> Время стоит для всех, кроме одного: Хронарх нападает только на него и не трогает застывших. Он уязвим — бейте его; удары застывших его не ранят, а сбежать из полночи жемчугом или Шестернёй нельзя.</li>", 6)),
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
                _cache[67] || (_cache[67] = createStaticVNode("<div data-v-86c6a540><dt data-v-86c6a540>Как работает</dt><dd data-v-86c6a540>правый клик; что он сделает, видно по цвету</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Красный</dt><dd data-v-86c6a540>вы стоите в чужом куполе — Сделке с дьяволом, Сборочном куполе или Огненном эдикте (Мировое Господство Тессеракту не по силам) — либо рядом с тем, кто вытянул чужую Луну: тессеракт развеивает это</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Зелёный</dt><dd data-v-86c6a540>здоровье не полное: лечит вас и своих рядом</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Голубой</dt><dd data-v-86c6a540>полное здоровье, обычный мир: перенос ко входу случайного стоящего храма (в том числе Древней фабрики и Тёмного храма)</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Оранжевый</dt><dd data-v-86c6a540>полное здоровье, Незер: перенос к Незеритовой кузне</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Фиолетовый</dt><dd data-v-86c6a540>полное здоровье, Энд: перенос к точке возрождения</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Перенос</dt><dd data-v-86c6a540>забирает всех живых рядом, кроме боссов и осколков Падшего нимба; из арены испытания, Испытания крови и Забытого мира не уводит. Если перенос сорвался, тессеракт не тратится</dd></div>", 7))
              ])
            ])
          ])
        ]),
        _cache[131] || (_cache[131] = createBaseVNode("div", { class: "prose small" }, [
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
                _cache[80] || (_cache[80] = createStaticVNode("<div data-v-86c6a540><dt data-v-86c6a540>Где</dt><dd data-v-86c6a540>верхний мир, глубоко под землёй; одно на сервер</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Исчезает</dt><dd data-v-86c6a540>когда все игроки его покинули; вернётся через 7 игровых суток в другом месте</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Загадки</dt><dd data-v-86c6a540>рычаги, кнопки и ловушки; дальний зал открывается загадками</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Библиотека</dt><dd data-v-86c6a540>лабиринт стеллажей; присмотритесь к рычагам под сводом</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Разбойники</dt><dd data-v-86c6a540>выходят с постов в залах, когда вы подходите</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Всадники апокалипсиса</dt><dd data-v-86c6a540>Война и Смерть в зале свечей; пока жив хоть один, голем спит</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Терра-сущность в зале</dt><dd data-v-86c6a540>появляется, когда голем пал; забрать — подойти к ней</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Пробуждение</dt><dd data-v-86c6a540>когда голем пал и кто-то выходит из лабиринта в библиотеку (взята сущность или нет), из мха лезут болотники — 70 за всё время: 20 в зале голема и 50 в остальных комнатах</dd></div>", 8)),
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
                createVNode(_sfc_main$b, {
                  name: "Джунглевый голем",
                  colour: "green"
                }),
                _cache[83] || (_cache[83] = createStaticVNode('<div class="boss-stats" data-v-86c6a540><span class="pill" data-v-86c6a540>900 здоровья</span><span class="pill" data-v-86c6a540>7 блоков ростом</span><span class="pill" data-v-86c6a540>большой зал</span></div><ul class="attacks" data-v-86c6a540><li data-v-86c6a540><b data-v-86c6a540>Сотрясение.</b> Выйдите из зелёного круга или подпрыгните.</li><li data-v-86c6a540><b data-v-86c6a540>Валун.</b> Уйдите со светящегося диска.</li><li data-v-86c6a540><b data-v-86c6a540>Плеть.</b> Сойдите с линии лоз.</li><li data-v-86c6a540><b data-v-86c6a540>Мох-панцирь (60%).</b> Щит из мха считает удары, а не урон. Когда голем заносит кулаки, его спина открыта: удар сзади снимает сразу три удара щита.</li><li data-v-86c6a540><b data-v-86c6a540>Ярость (30%).</b> Быстрее, оставляет ядовитые споры, валун раскалывается на три осколка.</li><li data-v-86c6a540><b data-v-86c6a540>Награда.</b> Терра-слитки и Терра-сущность.</li></ul>', 2))
              ]),
              _cache[84] || (_cache[84] = createStaticVNode('<div class="boss" data-v-86c6a540><div class="boss-name" data-v-86c6a540>Шёпот Древнего Леса</div><div class="boss-stats" data-v-86c6a540><span class="pill" data-v-86c6a540>лук крови предков, вторая форма</span></div><ul class="attacks" data-v-86c6a540><li data-v-86c6a540><b data-v-86c6a540>Ядовитый шип.</b> Любая стрела из лука отравляет.</li><li data-v-86c6a540><b data-v-86c6a540>Сплетение корней.</b> 5 секунд натяжения — зелёный луч связывает врагов: урон по одному получают все.</li><li data-v-86c6a540><b data-v-86c6a540>Где взять.</b> В бочке Терра-подземелья.</li></ul></div>', 1))
            ])
          ])
        ]),
        _cache[132] || (_cache[132] = createBaseVNode("div", { class: "prose small" }, [
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
              _cache[124] || (_cache[124] = createBaseVNode("div", { class: "sanctum-title" }, [
                createBaseVNode("h3", null, "Забытый мир"),
                createBaseVNode("span", { class: "pill" }, "отдельный мир")
              ], -1)),
              _cache[125] || (_cache[125] = createBaseVNode("h4", { class: "kv-head" }, "Ключи и вход", -1)),
              createBaseVNode("dl", _hoisted_104, [
                createBaseVNode("div", null, [
                  _cache[87] || (_cache[87] = createBaseVNode("dt", null, "Джунглевый ключ", -1)),
                  createBaseVNode("dd", _hoisted_105, [
                    createBaseVNode("img", {
                      src: unref(data).icons.forgotten_key_moss,
                      alt: ""
                    }, null, 8, _hoisted_106),
                    _cache[86] || (_cache[86] = createTextVNode("Куёт только кровь предков, с 3-й формы: 8 терра-слитков и по 16 осколков души, небесных и реликтовых; внизу Истинный Джунглевый голем.", -1))
                  ])
                ]),
                createBaseVNode("div", null, [
                  _cache[90] || (_cache[90] = createBaseVNode("dt", null, "Целестиальный ключ", -1)),
                  createBaseVNode("dd", _hoisted_107, [
                    createBaseVNode("img", {
                      src: unref(data).icons.forgotten_key,
                      alt: ""
                    }, null, 8, _hoisted_108),
                    _cache[88] || (_cache[88] = createTextVNode("С 4-й формы: 16 терра-слитков, по 64 осколка каждого вида и ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.jungle_heart,
                      alt: ""
                    }, null, 8, _hoisted_109),
                    _cache[89] || (_cache[89] = createTextVNode("Сердце джунглей; внизу Целестиал. Оба куются у алтаря Храма джунглей", -1))
                  ])
                ]),
                _cache[91] || (_cache[91] = createStaticVNode("<div data-v-86c6a540><dt data-v-86c6a540>Вход</dt><dd data-v-86c6a540>в Терра-подземелье: когда Джунглевый голем пал и Терра-сущность взята, ключ поворачивают в его зале (ПКМ, ключ тратится) — за Терра-сущностью ложится платформа, её видят все; отсчёт 10 секунд, в мир уходят все, кто на ней стоит. Отряд в мире один; зал оживает через 5 секунд после входа</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Отряд</dt><dd data-v-86c6a540>чем больше игроков, тем больше мобов в комнатах, тем они крепче, быстрее и сильнее; боссы — +40% здоровья и +10% урона за каждого игрока сверх первого</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Карта</dt><dd data-v-86c6a540>в 9-м слоте: запертые, открытые и зачищенные комнаты, двери и отряд</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Без полёта</dt><dd data-v-86c6a540>весь путь, все хранители и тайники проходятся с двойным прыжком; на высокие уступы ведут колонны лиан</dd></div>", 4))
              ]),
              _cache[126] || (_cache[126] = createStaticVNode('<h4 class="kv-head" data-v-86c6a540>Путь и двери</h4><dl class="kv" data-v-86c6a540><div data-v-86c6a540><dt data-v-86c6a540>Как в данжах Skyblock</dt><dd data-v-86c6a540>комнаты со звёздными ✯ мобами, Двери Иссушения и Кровавая дверь открываются ключами, которые носят хранители комнат; тайники — сундуки на уступах и летучие мыши под сводами</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Ключи дверей</dt><dd data-v-86c6a540>общие на весь отряд: подобрал один — ключ сразу у каждого в инвентаре, а двери, которые им можно открыть прямо сейчас, подсвечиваются сквозь стены — Двери Иссушения чёрным, Кровавая дверь красным</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Мобы</dt><dd data-v-86c6a540>бьют в 1,4 раза сильнее и бегают на 20% быстрее обычных, не превращаются (зомби в воде не станет утопленником) — ключ с хранителя не теряется. У каждого вида свой приём, и всё, что бьёт сильно, сначала показано на полу или звуком</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Хранители ключей</dt><dd data-v-86c6a540>в полтора раза живучее и носят одно из усилений — Бронированный, Стремительный, Кровопийца, Взрывной или Призыватель. Все приёмы и усиления — в разделе <a href="#bestiary" data-v-86c6a540>«Бестиарий»</a></dd></div><div data-v-86c6a540><dt data-v-86c6a540>Головоломка</dt><dd data-v-86c6a540>одна из двух: «Три чудака» — правду говорит только один, откройте его сундук; или «Викторина Наблюдателя» — три вопроса о мире наверху, нажмите на того из троих, чей ответ верен. Ошибка: каждому −30% здоровья и −14 к навыку</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Кровавая комната</dt><dd data-v-86c6a540>в Библиотеке парит Наблюдатель — огромный налитый кровью глаз — и призывает кровавые копии боссов мира (8 + 2 за игрока), у каждой свой удар; чем быстрее они падают, тем быстрее выходят новые. Красный круг под ногами — Взгляд Наблюдателя: уйдите из него. Зачистка за 80 секунд — «Кровавая спешка». Когда все пали — открывается путь вниз</dd></div></dl><h4 class="kv-head" data-v-86c6a540>Классы, смерть и тайники</h4><dl class="kv" data-v-86c6a540><div data-v-86c6a540><dt data-v-86c6a540>Классы</dt><dd data-v-86c6a540>на входе каждый выбирает класс до конца прохода (пока зал не ожил; не выбравший становится Берсерком)</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Берсерк</dt><dd data-v-86c6a540>удары +20%, убийство лечит</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Танк</dt><dd data-v-86c6a540>+4 сердца и брони, хранители переключаются на него</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Лекарь</dt><dd data-v-86c6a540>регенерация рядом, быстро поднимает павших</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Маг</dt><dd data-v-86c6a540>способности перезаряжаются быстрее, чаще благословения из тайников</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Лучник</dt><dd data-v-86c6a540>стрелы +40%, скорость</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Смерть и души</dt><dd data-v-86c6a540>вы становитесь призраком, а на месте гибели остаётся ваша душа: союзник, простоявший у неё 3 секунды (Лекарь — полторы), поднимает вас; иначе вы встаёте сами через 30 секунд. Вещи не теряются; Камень возрождения из тайника возвращает призрака сразу</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Второе дыхание</dt><dd data-v-86c6a540>если погиб весь отряд — один раз за проход: через 3 секунды все встают у входа с полным здоровьем, навык −10. Во второй раз забег провален; каждый возвращается к своей точке возрождения со всеми вещами</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Выход с сервера</dt><dd data-v-86c6a540>как смерть: вышедший — призрак отряда; зашёл, пока забег идёт, — снова в данже призраком, и его можно оживить; после победы над боссом возвращается живым</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Тайники</dt><dd data-v-86c6a540>12 штук. В 35% — благословение Силы, Жизни или Камня на весь отряд до конца прохода; в 30% — ещё Камень возрождения</dd></div><div data-v-86c6a540><dt data-v-86c6a540>Мимик</dt><dd data-v-86c6a540>в 40% проходов один из сундуков оказывается мини-боссом</dd></div></dl><h4 class="kv-head" data-v-86c6a540>Оценка и награда</h4>', 5)),
              createBaseVNode("dl", _hoisted_110, [
                _cache[122] || (_cache[122] = createBaseVNode("div", null, [
                  createBaseVNode("dt", null, "Оценка"),
                  createBaseVNode("dd", null, "навык, исследование, скорость и бонус — от D до S+ (S+ от 300 очков, S от 270, A от 230). Лимит прохода 30 минут")
                ], -1)),
                createBaseVNode("div", null, [
                  _cache[98] || (_cache[98] = createBaseVNode("dt", null, "Награда", -1)),
                  createBaseVNode("dd", _hoisted_111, [
                    _cache[92] || (_cache[92] = createTextVNode("не меньше трёх сундуков: деревянный бесплатно и один платный на выбор за осколки своей крови (небесная и ночная — ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.celestial_shard,
                      alt: ""
                    }, null, 8, _hoisted_112),
                    _cache[93] || (_cache[93] = createTextVNode("небесные, пепельная — ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.soul_shard,
                      alt: ""
                    }, null, 8, _hoisted_113),
                    _cache[94] || (_cache[94] = createTextVNode("осколки души, остальные — ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.jungle_shard,
                      alt: ""
                    }, null, 8, _hoisted_114),
                    _cache[95] || (_cache[95] = createTextVNode("реликтовые), в любом порядке. Внутри осколки всех видов, терра-слитки и призы ", -1)),
                    _cache[96] || (_cache[96] = createBaseVNode("b", null, "своей крови", -1)),
                    _cache[97] || (_cache[97] = createTextVNode(" из пула босса, без ограничения числа — чем выше форма, с которой предмет отвечает, тем реже", -1))
                  ])
                ]),
                createBaseVNode("div", null, [
                  _cache[109] || (_cache[109] = createBaseVNode("dt", null, "Сундуки голема", -1)),
                  createBaseVNode("dd", _hoisted_115, [
                    createBaseVNode("img", {
                      src: unref(data).icons.bouquet_of_lies,
                      alt: ""
                    }, null, 8, _hoisted_116),
                    _cache[99] || (_cache[99] = createTextVNode("Букет лжи, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.solstice,
                      alt: ""
                    }, null, 8, _hoisted_117),
                    _cache[100] || (_cache[100] = createTextVNode("Солнцестояние, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.hyperion,
                      alt: ""
                    }, null, 8, _hoisted_118),
                    _cache[101] || (_cache[101] = createTextVNode("Hyperion, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.demon_slayer,
                      alt: ""
                    }, null, 8, _hoisted_119),
                    _cache[102] || (_cache[102] = createTextVNode("Убийца демонов, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.cutter,
                      alt: ""
                    }, null, 8, _hoisted_120),
                    _cache[103] || (_cache[103] = createTextVNode("Резак, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.twilight_axe,
                      alt: ""
                    }, null, 8, _hoisted_121),
                    _cache[104] || (_cache[104] = createTextVNode("Сумрачная секира, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.terra_helmet,
                      alt: ""
                    }, null, 8, _hoisted_122),
                    _cache[105] || (_cache[105] = createTextVNode("Терра-доспех (чаще обычного); пепельной крови ещё ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.arachnid,
                      alt: ""
                    }, null, 8, _hoisted_123),
                    _cache[106] || (_cache[106] = createTextVNode("Арахнид, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.demon_soul,
                      alt: ""
                    }, null, 8, _hoisted_124),
                    _cache[107] || (_cache[107] = createTextVNode("Душа демона и ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.crimson,
                      alt: ""
                    }, null, 8, _hoisted_125),
                    _cache[108] || (_cache[108] = createTextVNode("Кримсон", -1))
                  ])
                ]),
                createBaseVNode("div", null, [
                  _cache[121] || (_cache[121] = createBaseVNode("dt", null, "Сундуки Целестиала", -1)),
                  createBaseVNode("dd", _hoisted_126, [
                    createBaseVNode("img", {
                      src: unref(data).icons.bouquet_of_lies,
                      alt: ""
                    }, null, 8, _hoisted_127),
                    _cache[110] || (_cache[110] = createTextVNode("Букет лжи, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.berserker_axe,
                      alt: ""
                    }, null, 8, _hoisted_128),
                    _cache[111] || (_cache[111] = createTextVNode("Секира берсерка, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.golden_phoenix,
                      alt: ""
                    }, null, 8, _hoisted_129),
                    _cache[112] || (_cache[112] = createTextVNode("Золотой феникс, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.soul_collector,
                      alt: ""
                    }, null, 8, _hoisted_130),
                    _cache[113] || (_cache[113] = createTextVNode("Сборщик душ, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.crimson,
                      alt: ""
                    }, null, 8, _hoisted_131),
                    _cache[114] || (_cache[114] = createTextVNode("Кримсон, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.phantom_guard,
                      alt: ""
                    }, null, 8, _hoisted_132),
                    _cache[115] || (_cache[115] = createTextVNode("Призрачный страж, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.night_fury,
                      alt: ""
                    }, null, 8, _hoisted_133),
                    _cache[116] || (_cache[116] = createTextVNode("Ночная фурия, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.celestial,
                      alt: ""
                    }, null, 8, _hoisted_134),
                    _cache[117] || (_cache[117] = createTextVNode("Целестиал, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.architect,
                      alt: ""
                    }, null, 8, _hoisted_135),
                    _cache[118] || (_cache[118] = createTextVNode("Архитектор, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.celestial_helmet,
                      alt: ""
                    }, null, 8, _hoisted_136),
                    _cache[119] || (_cache[119] = createTextVNode("Целестиальный доспех (чаще обычного), карты таро, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.terra_magnet,
                      alt: ""
                    }, null, 8, _hoisted_137),
                    _cache[120] || (_cache[120] = createTextVNode("Терра-магнит (чаще обычного)", -1))
                  ])
                ]),
                _cache[123] || (_cache[123] = createBaseVNode("div", null, [
                  createBaseVNode("dt", null, "Формы предков"),
                  createBaseVNode("dd", null, "проход с Джунглевым ключом на оценку S или S+ поднимает кровь предков с третьей формы до четвёртой, с Целестиальным — с четвёртой до пятой; ниже S форма не растёт")
                ], -1))
              ])
            ]),
            createBaseVNode("div", _hoisted_138, [
              createBaseVNode("div", _hoisted_139, [
                createVNode(_sfc_main$b, {
                  name: "Истинный Джунглевый голем",
                  colour: "green"
                }),
                _cache[127] || (_cache[127] = createStaticVNode('<div class="boss-stats" data-v-86c6a540><span class="pill" data-v-86c6a540>2400 здоровья</span><span class="pill" data-v-86c6a540>≈11–13 блоков ростом</span><span class="pill" data-v-86c6a540>за Джунглевым ключом</span></div><ul class="attacks" data-v-86c6a540><li data-v-86c6a540><b data-v-86c6a540>Двойное сотрясение.</b> Два зелёных круга один за другим: уйдите из обоих или будьте в воздухе.</li><li data-v-86c6a540><b data-v-86c6a540>Камнепад.</b> Валун в каждого из трёх бойцов, каждый раскалывается на три.</li><li data-v-86c6a540><b data-v-86c6a540>Плети.</b> Лозы к трём бойцам тянут к голему — сойдите с линии.</li><li data-v-86c6a540><b data-v-86c6a540>Терновое кольцо.</b> Три кольца шипов по полу — перепрыгните каждое.</li><li data-v-86c6a540><b data-v-86c6a540>Корневая темница.</b> Круг под вами: не ушли — три секунды в корнях.</li><li data-v-86c6a540><b data-v-86c6a540>Споровый ливень.</b> Споровые круги: яд и замедление.</li><li data-v-86c6a540><b data-v-86c6a540>Каменный сад (до 66%).</b> Голем спит под мхом и неуязвим. Разбейте его замшелых стражей — статуи просыпаются по нескольку, и каждая павшая откалывает кусок его полосы.</li><li data-v-86c6a540><b data-v-86c6a540>Три исполина (66–33%).</b> По одному встают Камнемёт, Лозохлёст и Тернодел — у каждого один приём голема.</li><li data-v-86c6a540><b data-v-86c6a540>Истинная форма (с 33%).</b> Голем просыпается, растёт и бьёт всеми приёмами сразу. На нём мох-панцирь — щит из ударов; удар в спину во время сотрясения снимает три. Четыре цветка под люстрами лечат его — затопчите их.</li></ul>', 2))
              ]),
              createBaseVNode("div", _hoisted_140, [
                createVNode(_sfc_main$b, {
                  name: "Целестиал",
                  colour: "yellow"
                }),
                _cache[128] || (_cache[128] = createStaticVNode('<div class="boss-stats" data-v-86c6a540><span class="pill" data-v-86c6a540>1100 здоровья</span><span class="pill" data-v-86c6a540>≈19 блоков ростом</span><span class="pill" data-v-86c6a540>пещера под библиотекой</span></div><ul class="attacks" data-v-86c6a540><li data-v-86c6a540><b data-v-86c6a540>Звёздные нити.</b> Сойдите с красных линий, пока они не вспыхнули.</li><li data-v-86c6a540><b data-v-86c6a540>Небесная паутина.</b> Уйдите из фиолетового круга: внутри сильное замедление.</li><li data-v-86c6a540><b data-v-86c6a540>Взмах крыльев.</b> Волна по полу — перепрыгните её.</li><li data-v-86c6a540><b data-v-86c6a540>Небесный разрез.</b> Красный конус перед ним; после разреза он открыт.</li><li data-v-86c6a540><b data-v-86c6a540>Отражения (65–35%).</b> Он замирает за щитом и выходит из себя цветными отражениями. Настоящее — того же цвета, что его сияние: бейте только его. Ложное взрывается от удара. Каждые 10 секунд они меняются местами и цветами. Сверху падают звёзды — уходите из золотых кругов.</li><li data-v-86c6a540><b data-v-86c6a540>Затмение (35%).</b> Он за щитом: зажгите четыре фиолетовых круга под люстрами, стоя в каждом, — щит падает, урон по нему двойной. Пока круги не зажжены, каждые 3 секунды прилетает вредина.</li><li data-v-86c6a540><b data-v-86c6a540>Ближний бой.</b> Его обычные удары слабее, а способности бьют больно — уворачивайтесь.</li></ul>', 2))
              ])
            ])
          ])
        ]),
        _cache[133] || (_cache[133] = createStaticVNode('<h3 data-v-86c6a540>Платформа готовности</h3><div class="prose" data-v-86c6a540><p data-v-86c6a540>Перед испытанием, рейдом, призывом босса или боем с королём, Хронархом и големом там, где встанет босс, на полу появляется <b style="color:#4f9cff;" data-v-86c6a540>голубая платформа</b> 4 × 5 блоков. Встаньте на неё: в центре экрана пойдёт отсчёт от 5 до 1, платформа станет <b style="color:#4fe06a;" data-v-86c6a540>зелёной</b>. Встал ещё кто-то или кто-то сошёл — отсчёт начинается заново, а платформа на миг вспыхивает <b style="color:#ff3a3a;" data-v-86c6a540>красным</b>.</p><p data-v-86c6a540>Бой, за который заплатили, ждёт создателя комнаты — без него отсчёт не начнётся («Ждём создателя комнаты...» над хотбаром). Все, кто стоял на платформе, — бойцы этого боя: кто сбежал из святилища или вышел с сервера, считается погибшим. Неначатая платформа исчезает через 5 минут и возвращает плату.</p></div><h3 data-v-86c6a540>Как читать бой</h3><div class="prose" data-v-86c6a540><p data-v-86c6a540>У всех боссов один язык знаков на полу: <b style="color:#ff4d5e;" data-v-86c6a540>красный</b> — уйдите, <b style="color:#ffc24a;" data-v-86c6a540>жёлтый</b> — прыгайте или двигайтесь, <b style="color:#b77bff;" data-v-86c6a540>фиолетовый</b> — встаньте внутрь, <b style="color:#4fe08a;" data-v-86c6a540>зелёный</b> — укрытие, <b style="color:#5fd3ff;" data-v-86c6a540>голубой</b> — бейте, босс уязвим. Перед каждым ударом звучит сигнал, а над хотбаром видно, что летит и через сколько.</p><p data-v-86c6a540>Между фазами босс две секунды неуязвим, меняет название и цвет полосы и отбрасывает всех рядом. В последней фазе знаки короче. Щит, считающий удары, — белая полоса над здоровьем.</p></div><h3 data-v-86c6a540>Награды за чистый бой</h3><div class="tbl" data-v-86c6a540><table data-v-86c6a540><thead data-v-86c6a540><tr data-v-86c6a540><th data-v-86c6a540>Условие</th><th data-v-86c6a540>Награда</th></tr></thead><tbody data-v-86c6a540><tr data-v-86c6a540><th scope="row" data-v-86c6a540>Фаза без смертей</th><td data-v-86c6a540>шанс на реликвию удваивается за каждую такую фазу: 10% → 20% → 40% → 80%; у ослабленного стража испытания он меньше</td></tr><tr data-v-86c6a540><th scope="row" data-v-86c6a540>Ни разу не задет красным знаком</th><td data-v-86c6a540>+25% осколков босса</td></tr><tr data-v-86c6a540><th scope="row" data-v-86c6a540>Победа в одиночку</th><td data-v-86c6a540>босс вычеркнут из «Списка смертников» (страж испытания — с третьего уровня)</td></tr></tbody></table></div><div class="prose small" data-v-86c6a540><p data-v-86c6a540><b data-v-86c6a540>Список смертников</b> — каждого босса нужно победить в одиночку: Горнило, Серафим Падшего Рассвета, Древний страж джунглей, Пустотный Серафим, Предвестник, Джунглевый голем, Проклятый король, Хронарх, Целестиал и ещё один. Весь список — достижение и по реликвии кузни, Небесного храма и Храма джунглей.</p><p data-v-86c6a540>После победы в чате — итог боя: время, чистые фазы и шанс на реликвию.</p></div>', 7))
      ]);
    };
  }
};
const SanctumsSection = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-86c6a540"]]);
const _hoisted_1$8 = { id: "raids" };
const _hoisted_2$8 = { class: "stack" };
const _hoisted_3$7 = { class: "panel" };
const _hoisted_4$7 = {
  class: "waves",
  role: "img",
  "aria-label": "Пять волн: в первых четырёх 2, 3, 4 и 5 стражников, в пятой — страж святилища"
};
const _hoisted_5$7 = { class: "wave" };
const _hoisted_6$7 = { class: "wave-n" };
const _hoisted_7$7 = { class: "wave-t" };
const _hoisted_8$7 = { class: "tiers" };
const _hoisted_9$6 = {
  class: "tier-n",
  "aria-hidden": "true"
};
const _hoisted_10$6 = { class: "kv" };
const _hoisted_11$6 = {
  class: "panel",
  id: "fourth"
};
const _hoisted_12$6 = { class: "fourths" };
const _hoisted_13$5 = { class: "fourth-relic" };
const _hoisted_14$4 = ["src"];
const _hoisted_15$4 = { class: "fourth-blood" };
const _hoisted_16$4 = { class: "small" };
const _hoisted_17$4 = { class: "fourth-where" };
const _hoisted_18$4 = { class: "panel" };
const _hoisted_19$3 = {
  class: "waves",
  role: "img",
  "aria-label": "Четыре волны рейда: 3, 4, 5 и 6 стражников"
};
const _hoisted_20$3 = { class: "wave" };
const _hoisted_21$1 = { class: "wave-n" };
const _hoisted_22$1 = { class: "wave-t" };
const _hoisted_23$1 = {
  key: 0,
  class: "energy",
  "aria-hidden": "true"
};
const _sfc_main$8 = {
  __name: "TrialsSection",
  setup(__props) {
    const TIERS = [
      { n: "I", price: "даром, раз в 10 минут на игрока", gives: "у всех бойцов этой крови и у начавшего первая форма → вторая", shards: 1, boss: "40% здоровья, удар вполсилы" },
      { n: "II", price: "алмазный блок, изумрудный блок, 20 осколков", gives: "начавшему — реликвия святилища, даже если он погиб", shards: 2, boss: "60% здоровья, удар на три четверти" },
      { n: "III", price: "32 осколка, реликвия, зачарованное золотое яблоко", gives: "начавшему — реликвия; у бойцов этой крови и у начавшего вторая форма → третья; в кузне и Храме джунглей начавший сперва улучшает алтарь сущностью (Адской / Терра); Серафим роняет Печать ночи", shards: 3, boss: "85% здоровья, удар в полную силу" }
    ];
    const TRIAL_WAVES = [2, 3, 4, 5];
    const RAID_WAVES = [3, 4, 5, 6];
    const blood = Object.fromEntries(data.blood.map((b) => [b.id, b]));
    const FOURTH = [
      { blood: "ember", what: "Король пиглинов", from: "победить его — форму получают все пепельные третьей формы, кто в замке", where: "тронный зал Проклятого замка", icon: "demon_soul" },
      { blood: "steel", what: "Забытый мир на S", from: "Джунглевый ключ, Истинный Джунглевый голем — оценка S или S+; Целестиал на S — пятую", where: "Забытый мир", icon: "forgotten_key_moss" },
      { blood: "night", what: "Пустотный Серафим", from: "победить его — форму получает тот, кто его призвал", where: "алтарь Тёмного храма", icon: "night_seal" },
      { blood: "techno", what: "Чёрная душа", from: "с трона Проклятого замка", where: "ZorahM-GPT: кнопка крови у терминала фабрики", icon: "black_substance" }
    ];
    const icon = (id) => {
      var _a;
      return ((_a = item(id)) == null ? void 0 : _a.icon) || data.icons[id];
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$8, [
        createVNode(_sfc_main$k, {
          title: "Испытания",
          icon: "harbinger_core"
        }, {
          default: withCtx(() => [..._cache[0] || (_cache[0] = [
            createBaseVNode("p", { class: "lead" }, [
              createTextVNode("Стража святилища вызывают "),
              createBaseVNode("b", null, "испытанием"),
              createTextVNode(" у алтаря: в Незеритовой кузне, Небесном храме и Храме джунглей. В Древней фабрике вместо испытаний — рейды, а в Тёмном храме нет ни испытаний, ни рейдов, ни стражи.")
            ], -1)
          ])]),
          _: 1
        }),
        createBaseVNode("div", _hoisted_2$8, [
          createBaseVNode("div", _hoisted_3$7, [
            _cache[7] || (_cache[7] = createBaseVNode("h3", null, "Испытание святилища", -1)),
            _cache[8] || (_cache[8] = createBaseVNode("p", { class: "small" }, "Пять волн в арене, в пятой — страж святилища. Уровень и награду определяет тот, кто начал. Покинуть арену до конца боя нельзя.", -1)),
            createBaseVNode("div", _hoisted_4$7, [
              (openBlock(), createElementBlock(Fragment, null, renderList(TRIAL_WAVES, (g, i) => {
                return openBlock(), createElementBlock(Fragment, { key: i }, [
                  createBaseVNode("div", _hoisted_5$7, [
                    createBaseVNode("span", _hoisted_6$7, toDisplayString(i + 1), 1),
                    createBaseVNode("span", _hoisted_7$7, "×" + toDisplayString(g), 1)
                  ]),
                  _cache[1] || (_cache[1] = createBaseVNode("span", {
                    class: "energy",
                    "aria-hidden": "true"
                  }, null, -1))
                ], 64);
              }), 64)),
              _cache[2] || (_cache[2] = createBaseVNode("div", { class: "wave boss" }, [
                createBaseVNode("span", { class: "wave-n" }, "5"),
                createBaseVNode("span", { class: "wave-t" }, "страж")
              ], -1))
            ]),
            _cache[9] || (_cache[9] = createBaseVNode("p", { class: "small muted" }, "Под номером волны — сколько в ней стражников при одном бойце; за каждого следующего бойца в волне ещё по одному, но не больше трёх сверху. Стражники крепнут на ступень за уровень испытания и за каждые две волны. Пока в арене никого нет, волны стоят.", -1)),
            createBaseVNode("div", _hoisted_8$7, [
              (openBlock(), createElementBlock(Fragment, null, renderList(TIERS, (t) => {
                return createBaseVNode("article", {
                  key: t.n,
                  class: normalizeClass(["tier", `tier-${t.n.length}`])
                }, [
                  createBaseVNode("span", _hoisted_9$6, toDisplayString(t.n), 1),
                  createBaseVNode("h4", null, "Уровень " + toDisplayString(t.n.length), 1),
                  createBaseVNode("dl", _hoisted_10$6, [
                    createBaseVNode("div", null, [
                      _cache[3] || (_cache[3] = createBaseVNode("dt", null, "Цена", -1)),
                      createBaseVNode("dd", null, toDisplayString(t.price), 1)
                    ]),
                    createBaseVNode("div", null, [
                      _cache[4] || (_cache[4] = createBaseVNode("dt", null, "Даёт", -1)),
                      createBaseVNode("dd", null, toDisplayString(t.gives), 1)
                    ]),
                    createBaseVNode("div", null, [
                      _cache[5] || (_cache[5] = createBaseVNode("dt", null, "Со стражника", -1)),
                      createBaseVNode("dd", null, toDisplayString(t.shards) + " " + toDisplayString(t.shards === 1 ? "осколок — сразу в инвентарь" : "осколка"), 1)
                    ]),
                    createBaseVNode("div", null, [
                      _cache[6] || (_cache[6] = createBaseVNode("dt", null, "Страж", -1)),
                      createBaseVNode("dd", null, toDisplayString(t.boss), 1)
                    ])
                  ])
                ], 2);
              }), 64))
            ]),
            _cache[10] || (_cache[10] = createBaseVNode("p", { class: "small muted" }, "Пройденное испытание открывает следующий уровень; начать можно любой открытый. Уровень у каждого святилища свой.", -1)),
            _cache[11] || (_cache[11] = createBaseVNode("p", { class: "small" }, [
              createBaseVNode("b", null, "Провал"),
              createTextVNode(" — арена пустовала 30 секунд (пока она пуста, идёт отсчёт), прошло 12 минут или страж ушёл; причина пишется под «Провал». Провал забирает у каждого половину осколков, добытых в этом испытании (с округлением вниз); победа ничего не забирает.")
            ], -1))
          ]),
          createBaseVNode("div", _hoisted_11$6, [
            _cache[12] || (_cache[12] = createBaseVNode("h3", null, "Четвёртая форма", -1)),
            _cache[13] || (_cache[13] = createBaseVNode("p", { class: "small" }, [
              createTextVNode("Четвёртую форму "),
              createBaseVNode("b", null, "приносят к алтарю своей крови"),
              createTextVNode("; кровь предков добывает её в Забытом мире.")
            ], -1)),
            createBaseVNode("div", _hoisted_12$6, [
              (openBlock(), createElementBlock(Fragment, null, renderList(FOURTH, (f) => {
                return createBaseVNode("article", {
                  key: f.blood,
                  class: "fourth",
                  style: normalizeStyle({ "--b": unref(blood)[f.blood].colour })
                }, [
                  createBaseVNode("span", _hoisted_13$5, [
                    createBaseVNode("img", {
                      src: icon(f.icon),
                      alt: ""
                    }, null, 8, _hoisted_14$4)
                  ]),
                  createBaseVNode("div", null, [
                    createBaseVNode("p", _hoisted_15$4, toDisplayString(unref(blood)[f.blood].title), 1),
                    createBaseVNode("h4", null, toDisplayString(f.what), 1),
                    createBaseVNode("p", _hoisted_16$4, toDisplayString(f.from), 1),
                    createBaseVNode("p", _hoisted_17$4, toDisplayString(f.where), 1)
                  ])
                ], 4);
              }), 64))
            ]),
            _cache[14] || (_cache[14] = createBaseVNode("p", { class: "small" }, [
              createTextVNode("Обе сущности с "),
              createBaseVNode("b", null, "проклятием утраты"),
              createTextVNode(": погибли с ней — она пропала.")
            ], -1))
          ])
        ]),
        createBaseVNode("div", _hoisted_18$4, [
          _cache[15] || (_cache[15] = createBaseVNode("h3", null, "Рейды фабрики", -1)),
          _cache[16] || (_cache[16] = createBaseVNode("p", { class: "small" }, [
            createTextVNode("Рейды проводят в Древней фабрике после первой победы над Предвестником: три уровня, как у испытаний, начать можно любой открытый. В рейде "),
            createBaseVNode("b", null, "четыре волны"),
            createTextVNode(" стражи и нет стража в конце; на рейд даётся 8 минут.")
          ], -1)),
          createBaseVNode("div", _hoisted_19$3, [
            (openBlock(), createElementBlock(Fragment, null, renderList(RAID_WAVES, (g, i) => {
              return openBlock(), createElementBlock(Fragment, { key: i }, [
                createBaseVNode("div", _hoisted_20$3, [
                  createBaseVNode("span", _hoisted_21$1, toDisplayString(i + 1), 1),
                  createBaseVNode("span", _hoisted_22$1, "×" + toDisplayString(g), 1)
                ]),
                i < RAID_WAVES.length - 1 ? (openBlock(), createElementBlock("span", _hoisted_23$1)) : createCommentVNode("", true)
              ], 64);
            }), 64))
          ]),
          _cache[17] || (_cache[17] = createStaticVNode('<p class="small muted">Под номером волны — сколько в ней стражников: всего 18 за рейд.</p><div class="tbl"><table><thead><tr><th>Уровень</th><th>Цена</th><th>С каждого стражника</th><th>В конце всем в фабрике</th></tr></thead><tbody><tr><td>1</td><td>даром, раз в 10 минут на игрока</td><td>1 деталь</td><td>6–10 деталей</td></tr><tr><td>2</td><td>8 деталей</td><td>2 детали</td><td>12–20 деталей, шанс 15% на ядро</td></tr><tr><td>3</td><td>16 деталей</td><td>3 детали</td><td>20–26 деталей, шанс 30% на ядро</td></tr></tbody></table></div><p class="small"><b>Провал</b> — в арене 20 секунд не было ни одного бойца или вышло время. Он забирает половину деталей, добытых со стражи этого рейда.</p>', 3))
        ])
      ]);
    };
  }
};
const _hoisted_1$7 = { id: "bestiary" };
const _hoisted_2$7 = {
  class: "filters",
  role: "group",
  "aria-label": "Тип хранителя"
};
const _hoisted_3$6 = ["aria-pressed", "onClick"];
const _hoisted_4$6 = { class: "chip-count" };
const _hoisted_5$6 = {
  key: 0,
  class: "small"
};
const _hoisted_6$6 = {
  class: "beasts",
  "aria-live": "polite"
};
const _hoisted_7$6 = { class: "beast-head" };
const _hoisted_8$6 = { class: "beast-id" };
const _hoisted_9$5 = { class: "beast-role" };
const _hoisted_10$5 = {
  key: 0,
  class: "beast-type"
};
const _hoisted_11$5 = { class: "beast-hp" };
const _hoisted_12$5 = { class: "beast-facts" };
const _hoisted_13$4 = { class: "beast-counter" };
const _hoisted_14$3 = {
  key: 0,
  class: "beast-star"
};
const _hoisted_15$3 = { class: "beasts" };
const _hoisted_16$3 = { class: "beast-head" };
const _hoisted_17$3 = { class: "beast-id" };
const _hoisted_18$3 = { class: "beast-hp" };
const _hoisted_19$2 = { class: "beast-facts" };
const _hoisted_20$2 = { class: "beast-counter" };
const _sfc_main$7 = {
  __name: "BestiarySection",
  setup(__props) {
    const TYPES = [
      ["all", "Все"],
      ["melee", "Ближний бой"],
      ["ranged", "Стрелки"],
      ["mini", "Мини-боссы"],
      ["blood", "Кровавые"]
    ];
    const TYPE_NAME = { melee: "ближний бой", ranged: "стрелок", mini: "мини-босс", blood: "кровавый" };
    const MOBS = [
      {
        type: "melee",
        name: "Зомби-солдат",
        hp: 50,
        role: "щитоносец",
        star: true,
        trick: "Щит: удар спереди вдвое слабее, стрела спереди не проходит вовсе. Трое рядом встают в строй и получают сопротивление.",
        counter: "Заходить сбоку и сзади, разбивать строй по одному."
      },
      {
        type: "melee",
        name: "Зомби-рыцарь",
        hp: 80,
        role: "таран",
        star: true,
        trick: "Натиск: с 4–11 блоков замирает на 0,7 с и несётся на цель, сбивая всех на пути — урон ×1,4 и отброс.",
        counter: "Когда замер — шаг в сторону с его линии; ему нужна прямая видимость цели."
      },
      {
        type: "melee",
        name: "Командир-зомби",
        hp: 170,
        role: "командир",
        star: true,
        trick: "Боевой рог на 66% и 33% здоровья: зовёт двух солдат и даёт всем хранителям в 9 блоках силу и скорость на 8 с. Когда боец подошёл на 3,5 блока — после замаха бьёт топором по кругу на 4,5 блока.",
        counter: "Увидели кольцо на полу — выйти из него. Призванных солдат тоже придётся убить: они считаются хранителями комнаты."
      },
      {
        type: "ranged",
        name: "Скелет-солдат",
        hp: 42,
        role: "стрелок",
        star: true,
        trick: "Залп из трёх стрел веером раз в 7 с с расстояния 4–20 блоков, если видит цель; от подошедшего вплотную отбегает.",
        counter: "Сближаться и прижимать к стене; на дистанции — уходить из-под веера."
      },
      {
        type: "ranged",
        name: "Скелет-мастер",
        hp: 85,
        role: "снайпер",
        star: true,
        trick: "Прицельный выстрел с 5–24 блоков: полторы секунды красная линия к цели, затем стрела вдвое тяжелее обычной.",
        counter: "Пока горит красная линия — уйти за стену или с линии."
      },
      {
        type: "melee",
        name: "Страж глубины",
        hp: 75,
        role: "контроль",
        star: true,
        trick: "Водоворот: когда цель ближе 7 блоков, замирает и готовится, затем всех в 7 блоках притягивает к себе и замедляет. Его удар тоже замедляет.",
        counter: "Синее кольцо на полу — отойти дальше 7 блоков, пока он стоит и готовится."
      },
      {
        type: "melee",
        name: "Теневой убийца",
        hp: 90,
        role: "убийца",
        star: true,
        trick: "Невидим — видна только чёрная броня. Раз в 3,5 с появляется за спиной; удар сразу после появления двойной и слепит. Раненый, в четверти случаев исчезает в дыму.",
        counter: "Надпись «Теневой убийца за спиной!» — сразу развернуться или отскочить. Вплотную он не прыгает: за спину уходит только к цели дальше 5 блоков."
      },
      {
        type: "melee",
        name: "Фел",
        hp: 120,
        role: "засадник",
        star: true,
        trick: "Эндермен-статуя: оживает, когда к нему подошли на 5 блоков, не телепортируется. Раз в 6,5 с пускает пустотный сгусток — он летит за целью и поднимает её в воздух.",
        counter: "Не будить, пока рядом другие хранители. Сгусток пускает только по цели в 3–20 блоках, которую видит."
      },
      {
        type: "mini",
        name: "Потерянный искатель",
        hp: 420,
        role: "мини-босс",
        star: true,
        trick: "Прыжок на стоящего поодаль и удар по кругу при приземлении; разворот клинком, когда его обступили. Ниже половины здоровья лечится на 15% и на 4 с становится быстрее и сильнее — но только дважды за бой.",
        counter: "Не стоять кучей: кольцо на полу — разойтись. Добивать после второго лечения. Его падение прибавляет +2 к бонусу."
      },
      {
        type: "mini",
        name: "Мимик",
        hp: 260,
        role: "ловушка",
        star: false,
        trick: "Сундук тайника, который кусается: в 40% проходов один из сундуков — Мимик. Маленький и быстрый, прыгает на цель с 2,5–9 блоков, укус вызывает голод.",
        counter: "Открывать сундуки с полным здоровьем и запасом еды. В зачистку комнаты не считается, но как мини-босс прибавляет +2 к бонусу."
      },
      {
        type: "blood",
        name: "Кровавый король",
        hp: 170,
        role: "кровавый",
        star: false,
        trick: "После замаха бьёт по кругу на 5 блоков; его удар поджигает на 3 с.",
        counter: "Красное кольцо на полу — выйти из него до удара."
      },
      {
        type: "blood",
        name: "Кровавый Хронарх",
        hp: 130,
        role: "кровавый",
        star: false,
        trick: "Останавливает время в 7 блоках: замедление V и утомление на 2,5 с. Стрела замедляет.",
        counter: "Звон колокола и красное кольцо — секунда, чтобы выйти из 7 блоков."
      },
      {
        type: "blood",
        name: "Кровавое Горнило",
        hp: 110,
        role: "кровавый",
        star: false,
        trick: "Своего приёма с замахом нет, но жжёт дольше остальных: поджигает на 5 с.",
        counter: "Самое хрупкое из кровавых — убирать первым, пока не подожгло отряд."
      },
      {
        type: "blood",
        name: "Кровавый голем",
        hp: 200,
        role: "кровавый",
        star: false,
        trick: "После замаха бьёт по кругу на 5 блоков и подбрасывает; кулак кружит голову.",
        counter: "Красное кольцо на полу — выйти из него; самый живучий из кровавых."
      },
      {
        type: "blood",
        name: "Кровавый страж",
        hp: 150,
        role: "кровавый",
        star: false,
        trick: "Лечится своими ударами — на половину нанесённого урона; удар гасит свет на 3 с.",
        counter: "Не подставляться под удары: каждый пропущенный возвращает ему здоровье."
      }
    ];
    const AFFIXES = [
      {
        name: "Бронированный",
        big: "½",
        unit: "урона по нему",
        trick: "Любой урон по нему режется вдвое, и его нельзя отбросить.",
        counter: "Бой затянется: сперва убрать остальных хранителей комнаты."
      },
      {
        name: "Стремительный",
        big: "×1,5",
        unit: "скорость",
        trick: "В полтора раза быстрее своего вида — поверх общей прибавки к скорости в Забытом мире.",
        counter: "Убежать не выйдет — встречать лицом."
      },
      {
        name: "Кровопийца",
        big: "4%",
        unit: "здоровья за удар",
        trick: "Каждый его удар, попавший по игроку, возвращает ему 4% его полного здоровья.",
        counter: "Не пропускать удары — каждый продлевает бой."
      },
      {
        name: "Взрывной",
        big: "4,5",
        unit: "блока взрыв",
        trick: "Через 1,5 с после смерти взрывается в 4,5 блока — слышен запал, на полу оранжевое кольцо. Взрыв бьёт в полтора раза сильнее обычного удара этого вида и отбрасывает.",
        counter: "Добили — сразу выйти из кольца; ключ подобрать после взрыва."
      },
      {
        name: "Призыватель",
        big: "2",
        unit: "скелета-солдата",
        trick: "На половине здоровья один раз трубит в рог и зовёт двух скелетов-солдат.",
        counter: "Призванные — тоже хранители комнаты: их надо убить."
      }
    ];
    const type = ref("all");
    const counts = computed(() => Object.fromEntries(TYPES.map(([key]) => [key, key === "all" ? MOBS.length : MOBS.filter((m) => m.type === key).length])));
    const shown = computed(() => type.value === "all" ? MOBS : MOBS.filter((m) => m.type === type.value));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$7, [
        createVNode(_sfc_main$k, { title: "Бестиарий Забытого мира" }, {
          default: withCtx(() => [..._cache[0] || (_cache[0] = [
            createBaseVNode("p", { class: "lead" }, [
              createTextVNode("Хранители комнат Забытого мира. У каждого вида "),
              createBaseVNode("b", null, "свой приём"),
              createTextVNode("; всё, что бьёт сильно, сначала показано — кольцом на полу, линией прицела, звуком.")
            ], -1)
          ])]),
          _: 1
        }),
        createBaseVNode("div", _hoisted_2$7, [
          (openBlock(), createElementBlock(Fragment, null, renderList(TYPES, ([key, title]) => {
            return createBaseVNode("button", {
              key,
              type: "button",
              class: "chip",
              "aria-pressed": String(type.value === key),
              onClick: ($event) => type.value = key
            }, [
              createTextVNode(toDisplayString(title), 1),
              createBaseVNode("span", _hoisted_4$6, toDisplayString(counts.value[key]), 1)
            ], 8, _hoisted_3$6);
          }), 64))
        ]),
        type.value === "blood" ? (openBlock(), createElementBlock("p", _hoisted_5$6, [..._cache[1] || (_cache[1] = [
          createTextVNode("Кровавых призывает ", -1),
          createBaseVNode("b", null, "Наблюдатель", -1),
          createTextVNode(" в Библиотеке — копии боссов мира, 8 и ещё по 2 за каждого игрока. В зачистку комнат они не считаются.", -1)
        ])])) : createCommentVNode("", true),
        createBaseVNode("div", _hoisted_6$6, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(shown.value, (m) => {
            return openBlock(), createElementBlock("article", {
              key: m.name,
              class: normalizeClass(["beast", `beast-${m.type}`])
            }, [
              createBaseVNode("header", _hoisted_7$6, [
                createBaseVNode("div", _hoisted_8$6, [
                  createBaseVNode("p", _hoisted_9$5, [
                    createTextVNode(toDisplayString(m.role), 1),
                    m.role !== TYPE_NAME[m.type] ? (openBlock(), createElementBlock("span", _hoisted_10$5, " · " + toDisplayString(TYPE_NAME[m.type]), 1)) : createCommentVNode("", true)
                  ]),
                  createBaseVNode("h4", null, toDisplayString(m.name), 1)
                ]),
                createBaseVNode("p", _hoisted_11$5, [
                  createBaseVNode("b", null, toDisplayString(m.hp), 1),
                  _cache[2] || (_cache[2] = createBaseVNode("span", null, "здоровья", -1))
                ])
              ]),
              createBaseVNode("dl", _hoisted_12$5, [
                createBaseVNode("div", null, [
                  _cache[3] || (_cache[3] = createBaseVNode("dt", null, "Приём", -1)),
                  createBaseVNode("dd", null, toDisplayString(m.trick), 1)
                ]),
                createBaseVNode("div", _hoisted_13$4, [
                  _cache[4] || (_cache[4] = createBaseVNode("dt", null, "Как играть против", -1)),
                  createBaseVNode("dd", null, toDisplayString(m.counter), 1)
                ])
              ]),
              m.star ? (openBlock(), createElementBlock("p", _hoisted_14$3, "Звёздный: считается в зачистку комнаты")) : createCommentVNode("", true)
            ], 2);
          }), 128))
        ]),
        _cache[8] || (_cache[8] = createBaseVNode("h3", { id: "bestiary-affixes" }, "Аффиксы хранителей ключей", -1)),
        _cache[9] || (_cache[9] = createBaseVNode("p", { class: "affix-lead" }, [
          createTextVNode("Ключ Иссушения или Кровавый ключ носит "),
          createBaseVNode("b", null, "хранитель ключа"),
          createTextVNode(" — первый из хранителей комнаты: в имени у него ⚷, он светится. Он в полтора раза живучее своего вида и получает "),
          createBaseVNode("b", null, "один из пяти аффиксов"),
          createTextVNode(": какой — решает случай, когда он появляется; название стоит в имени перед видом. Убит — ключ остаётся висеть над полом.")
        ], -1)),
        createBaseVNode("div", _hoisted_15$3, [
          (openBlock(), createElementBlock(Fragment, null, renderList(AFFIXES, (a) => {
            return createBaseVNode("article", {
              key: a.name,
              class: "beast beast-affix"
            }, [
              createBaseVNode("header", _hoisted_16$3, [
                createBaseVNode("div", _hoisted_17$3, [
                  _cache[5] || (_cache[5] = createBaseVNode("p", { class: "beast-role" }, "аффикс", -1)),
                  createBaseVNode("h4", null, toDisplayString(a.name), 1)
                ]),
                createBaseVNode("p", _hoisted_18$3, [
                  createBaseVNode("b", null, toDisplayString(a.big), 1),
                  createBaseVNode("span", null, toDisplayString(a.unit), 1)
                ])
              ]),
              createBaseVNode("dl", _hoisted_19$2, [
                createBaseVNode("div", null, [
                  _cache[6] || (_cache[6] = createBaseVNode("dt", null, "Что делает", -1)),
                  createBaseVNode("dd", null, toDisplayString(a.trick), 1)
                ]),
                createBaseVNode("div", _hoisted_20$2, [
                  _cache[7] || (_cache[7] = createBaseVNode("dt", null, "Как играть против", -1)),
                  createBaseVNode("dd", null, toDisplayString(a.counter), 1)
                ])
              ])
            ]);
          }), 64))
        ]),
        _cache[10] || (_cache[10] = createBaseVNode("div", { class: "panel" }, [
          createBaseVNode("h3", null, "Общее для всех"),
          createBaseVNode("ul", { class: "beast-rules small" }, [
            createBaseVNode("li", null, "Комната оживает, когда в неё впервые входит игрок. Здоровье написано в имени каждого моба."),
            createBaseVNode("li", null, "Урон каждого хранителя умножен на 1,4 (и стрел тоже) а двигаются они на 20% быстрее, чем такие же мобы наверху."),
            createBaseVNode("li", null, "За каждого игрока сверх первого: +25% здоровья, +2,5% к урону, +3% к скорости, +1 к броне, а обычных мобов в каждой комнате на 30% больше (кроме мини-боссов)."),
            createBaseVNode("li", null, "Моб идёт за тем, с кем дерётся, и в соседние комнаты с открытой дверью (кроме Библиотеки и пещеры босса) — пока цель не дальше 24 блоков, а сам он не дальше 30 блоков от поста."),
            createBaseVNode("li", null, "Призванные — такие же хранители комнаты; больше 26 в комнате не бывает.")
          ])
        ], -1))
      ]);
    };
  }
};
const BestiarySection = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-80ac7c13"]]);
const _hoisted_1$6 = { class: "btrunk-title" };
const _hoisted_2$6 = {
  key: 0,
  class: "btrunk-then"
};
const _hoisted_3$5 = { class: "bforms" };
const _hoisted_4$5 = {
  class: "bnode",
  "aria-hidden": "true"
};
const _hoisted_5$5 = { class: "bform-body" };
const _hoisted_6$5 = { class: "bform-name" };
const _hoisted_7$5 = { class: "bform-perk" };
const _hoisted_8$5 = {
  key: 0,
  class: "bform-blades"
};
const _hoisted_9$4 = { class: "btrunk-title" };
const _hoisted_10$4 = { class: "babyss-flow" };
const _hoisted_11$4 = { class: "babyss-crowns" };
const _hoisted_12$4 = { class: "babyss-heart" };
const _sfc_main$6 = {
  __name: "BloodTree",
  setup(__props) {
    const ROMAN = ["I", "II", "III", "IV", "V"];
    const NAMES = ["Первая форма", "Вторая форма", "Третья форма", "Четвёртая форма · корона и дар", "Пятая форма"];
    const night = data.blood.find((b) => b.id === "night");
    const bladesOf = (b, pick) => b.weapons.filter((w) => pick(w.form || 1)).map((w) => item(w.id)).filter(Boolean);
    const trees = data.blood.filter((b) => !b.formless && b.id !== "night").map((b) => {
      const steps = ROMAN.map((n, i) => ({
        n,
        name: b.id === "steel" && i === 3 ? "Четвёртая форма · дар" : b.id === "steel" && i === 4 ? "Пятая форма · корона" : NAMES[i],
        perk: b.perks[i] || "",
        blades: bladesOf(b, (f) => f === i + 1),
        crown: false
      })).filter((s) => s.perk);
      if (steps.length && b.weapons.some((w) => w.crown)) steps[steps.length - 1].crown = true;
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
            createBaseVNode("h4", _hoisted_1$6, [
              _cache[0] || (_cache[0] = createBaseVNode("span", {
                class: "blood-gem",
                "aria-hidden": "true"
              }, null, -1)),
              createTextVNode(toDisplayString(t.title), 1),
              t.dual ? (openBlock(), createElementBlock("span", _hoisted_2$6, "→ ночная")) : createCommentVNode("", true)
            ]),
            createBaseVNode("ol", _hoisted_3$5, [
              (openBlock(true), createElementBlock(Fragment, null, renderList([...t.steps].reverse(), (f, i) => {
                return openBlock(), createElementBlock("li", {
                  key: f.name,
                  class: normalizeClass(["bform", { crown: f.crown, seal: f.seal }]),
                  style: normalizeStyle({ "--fi": t.steps.length - 1 - i, ...f.colour ? { "--b": f.colour } : {} })
                }, [
                  createBaseVNode("span", _hoisted_4$5, [
                    createBaseVNode("span", null, toDisplayString(f.n), 1)
                  ]),
                  createBaseVNode("div", _hoisted_5$5, [
                    createBaseVNode("p", _hoisted_6$5, toDisplayString(f.name), 1),
                    createBaseVNode("p", _hoisted_7$5, toDisplayString(f.perk), 1),
                    f.blades.length ? (openBlock(), createElementBlock("div", _hoisted_8$5, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(f.blades, (w) => {
                        return openBlock(), createBlock(_sfc_main$w, {
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
          createBaseVNode("h4", _hoisted_9$4, [
            _cache[1] || (_cache[1] = createBaseVNode("span", {
              class: "blood-gem",
              "aria-hidden": "true"
            }, null, -1)),
            createTextVNode(toDisplayString(unref(abyss).title), 1)
          ]),
          _cache[3] || (_cache[3] = createBaseVNode("p", { class: "bform-perk" }, "Форм нет. Короны всех кровей сходятся в бездну: корона своей крови и Чёрная душа у алтаря своего храма дают Все-Чёрный.", -1)),
          createBaseVNode("div", _hoisted_10$4, [
            createBaseVNode("div", _hoisted_11$4, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(crowns), (c) => {
                return openBlock(), createElementBlock("span", {
                  key: c.blade.id,
                  class: "babyss-crown",
                  style: normalizeStyle({ "--c": c.colour })
                }, [
                  createVNode(_sfc_main$w, {
                    item: c.blade
                  }, null, 8, ["item"])
                ], 4);
              }), 128))
            ]),
            _cache[2] || (_cache[2] = createBaseVNode("span", {
              class: "babyss-stream",
              "aria-hidden": "true"
            }, null, -1)),
            createBaseVNode("div", _hoisted_12$4, [
              unref(allBlack) ? (openBlock(), createBlock(_sfc_main$w, {
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
const _hoisted_1$5 = { id: "blood" };
const _hoisted_2$5 = { class: "bloods" };
const _hoisted_3$4 = { class: "blood-motto" };
const _hoisted_4$4 = { class: "blood-home" };
const _hoisted_5$4 = { class: "blood-blades" };
const _hoisted_6$4 = ["href"];
const _hoisted_7$4 = ["src"];
const _hoisted_8$4 = {
  key: 0,
  class: "muted small"
};
const _hoisted_9$3 = {
  key: 0,
  class: "muted small"
};
const _hoisted_10$3 = { class: "tbl" };
const _hoisted_11$3 = { scope: "row" };
const _hoisted_12$3 = {
  class: "cmp",
  role: "region",
  "aria-label": "Дары по формам"
};
const _hoisted_13$3 = { scope: "row" };
const _hoisted_14$2 = {
  key: 0,
  colspan: "5",
  class: "cmp-all"
};
const _hoisted_15$2 = ["data-label"];
const _hoisted_16$2 = {
  key: 0,
  class: "cmp-perk"
};
const _hoisted_17$2 = {
  key: 1,
  class: "cmp-blades"
};
const _hoisted_18$2 = {
  key: 1,
  class: "cmp-dash",
  "aria-label": "нет"
};
const _hoisted_19$1 = { class: "pick" };
const _hoisted_20$1 = { class: "tbl" };
const _hoisted_21 = { scope: "row" };
const _hoisted_22 = { class: "inline-icons" };
const _hoisted_23 = ["src"];
const _sfc_main$5 = {
  __name: "BloodSection",
  setup(__props) {
    const FORMS = [1, 2, 3, 4, 5];
    const order2 = ["ember", "sky", "night", "steel", "techno", "abyss"];
    const compare2 = order2.map((id) => data.blood.find((b) => b.id === id)).filter(Boolean).map((b) => ({
      ...b,
      cells: FORMS.map((f) => b.formless ? null : {
        perk: b.perks[f - 1] || "",
        blades: b.weapons.filter((w) => (w.form || 1) === f).map((w) => w.name)
      }).map((c) => c && (c.perk || c.blades.length) ? c : null)
    }));
    const choose = {
      ember: "Подходит тем, кто любит бой вплотную и Незер: огонь ей родня, удар поджигает, а смертельный удар даёт ещё один рывок.",
      sky: "Подходит тем, кто любит двигаться: двойной прыжок и полёт, падения и снаряды ранят слабее.",
      night: "Подходит тем, кто вырос из небесной крови и тянется к ночным вылазкам: ночное зрение, Восходящий поток и свой Тёмный храм.",
      steel: "Подходит тем, кто держит строй в гуще боя: броня, устойчивость к отбрасыванию и яду, щит в нужную минуту, долгий путь в пять форм.",
      techno: "Подходит тем, кто любит механизмы и рейды Древней фабрики: клинки фабрики, реактивные сапоги и меч, что растёт вместе с кровью.",
      abyss: "Не выбирается: её получает тот, кто выковал Все-Чёрный, — для игры из тени, с невидимостью и засадами."
    };
    const quests = data.blood.filter((b) => !b.formless && (b.secondPrice.length || b.thirdPrice.length));
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
      return openBlock(), createElementBlock("section", _hoisted_1$5, [
        createVNode(_sfc_main$k, {
          title: "Родословные",
          icon: "demon_soul"
        }, {
          default: withCtx(() => [..._cache[0] || (_cache[0] = [
            createBaseVNode("p", { class: "lead" }, "При первом входе каждый игрок сам выбирает одну из трёх родословных: пепельную, небесную или кровь предков. Кровь решает, как игрок растёт, какую книгу получит и какие величайшие клинки его признают.", -1)
          ])]),
          _: 1
        }),
        _cache[7] || (_cache[7] = createStaticVNode("<h3 data-v-bccb53ae>Клинки крови</h3><p data-v-bccb53ae>Величайшие клинки привязаны к крови: в чужих руках они не работают. <b data-v-bccb53ae>Короны</b> — Истинный Экскалибур и Антихрист — отвечают только крови в <b data-v-bccb53ae>четвёртой форме</b>; корона предков — <b data-v-bccb53ae>Целестиал</b>, вместе с Архитектором он отвечает только <b data-v-bccb53ae>пятой</b> форме (Энигма — великий клинок предков с третьей формы, не корона). У пепельной крови <b data-v-bccb53ae>две короны</b>: <b data-v-bccb53ae>Империум</b> — с четвёртой формы, <b data-v-bccb53ae>Люцифер</b> — уже с третьей. Все-Чёрный отвечает только крови бездны.</p>", 2)),
        createBaseVNode("div", _hoisted_2$5, [
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
              createBaseVNode("p", _hoisted_3$4, toDisplayString(b.motto), 1),
              createBaseVNode("p", _hoisted_4$4, [
                _cache[2] || (_cache[2] = createBaseVNode("span", { class: "muted" }, "Святилище:", -1)),
                createTextVNode(" " + toDisplayString(b.sanctum), 1)
              ]),
              createBaseVNode("div", _hoisted_5$4, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(b.weapons, (w) => {
                  return openBlock(), createElementBlock("a", {
                    key: w.id,
                    href: `#w-${w.id}`,
                    class: "mitem"
                  }, [
                    createBaseVNode("img", {
                      src: w.icon,
                      alt: ""
                    }, null, 8, _hoisted_7$4),
                    createBaseVNode("span", null, toDisplayString(w.name), 1),
                    w.form > 1 ? (openBlock(), createElementBlock("span", _hoisted_8$4, "с " + toDisplayString(w.form) + "-й", 1)) : createCommentVNode("", true)
                  ], 8, _hoisted_6$4);
                }), 128)),
                !b.weapons.length ? (openBlock(), createElementBlock("span", _hoisted_9$3, "ещё не выкованы")) : createCommentVNode("", true)
              ])
            ], 4);
          }), 128))
        ]),
        _cache[8] || (_cache[8] = createStaticVNode('<h3 data-v-bccb53ae>Формы</h3><div class="flow" aria-label="Путь крови" data-v-bccb53ae><div class="step" data-v-bccb53ae><b data-v-bccb53ae>Первая</b><span data-v-bccb53ae>выбор при первом входе — или 20 осколков у алтаря святилища этой крови</span></div><span class="to" aria-hidden="true" data-v-bccb53ae>→</span><div class="step" data-v-bccb53ae><b data-v-bccb53ae>Вторая</b><span data-v-bccb53ae>испытание 1-го уровня в святилище своей крови</span></div><span class="to" aria-hidden="true" data-v-bccb53ae>→</span><div class="step" data-v-bccb53ae><b data-v-bccb53ae>Третья</b><span data-v-bccb53ae>испытание 3-го уровня там же (у пепельной и предков — после улучшения алтаря сущностью)</span></div><span class="to" aria-hidden="true" data-v-bccb53ae>→</span><div class="step" data-v-bccb53ae><b data-v-bccb53ae>Четвёртая</b><span data-v-bccb53ae>победа над боссом или Чёрная душа у алтаря своей крови · корона крови (у пепельной — Империум)</span></div></div><p data-v-bccb53ae><b data-v-bccb53ae>Кровь предков</b> идёт своим путём: вторая форма — испытание 1-го уровня в Храме джунглей, третья — испытание 3-го уровня там же, но сперва алтарь нужно улучшить <b data-v-bccb53ae>Терра-сущностью</b> из Терра-подземелья, четвёртая — проход <b data-v-bccb53ae>Забытого мира</b> с Джунглевым ключом на оценку S или S+, пятая — проход с Целестиальным ключом на S или S+.</p><p data-v-bccb53ae><b data-v-bccb53ae>Пепельная кровь</b>: третье испытание кузни начнёт лишь тот, кто отдал её алтарю <b data-v-bccb53ae>Адскую сущность</b> из часовой башни Проклятого замка; четвёртая форма — падение <b data-v-bccb53ae>Короля пиглинов</b>: её получают все пепельные третьей формы, кто в замке. Сам замок теперь находят с любой формой крови.</p><p data-v-bccb53ae><b data-v-bccb53ae>Огонь не берёт своё.</b> Брошенные в лаву или огонь клинки пепельной крови и адские материалы не сгорают.</p><p data-v-bccb53ae><b data-v-bccb53ae>Крылья</b> растут не от формы, а от <b data-v-bccb53ae>полного комплекта брони</b>: наденьте все четыре части — и за спиной раскроются крылья. Расплавленный доспех — солнечные, доспех паладина — светлые небесные, доспех Короля ночи — небесные, Терра-доспех — зелёные крылья мудреца, Целестиальный доспех — крылья Целестиала: всё это объёмные модели, которые стоят за спиной и поворачиваются вместе с телом. У Демонического доспеха крылья багрово-чёрные, как у элитр. Снимите одну часть — крылья пропадут. Полёт небесной и ночной небесной крови от крыльев не зависит.</p><p data-v-bccb53ae><b data-v-bccb53ae>У небесной крови нет четвёртой формы.</b> Сломав <b data-v-bccb53ae>Печать ночи</b>, небесная кровь становится <b data-v-bccb53ae>ночной небесной</b>. С тех пор по ночам появляется <b data-v-bccb53ae>Тёмный храм</b> — там ночная кровь растёт дальше.</p><p data-v-bccb53ae><b data-v-bccb53ae>Техноорганическая кровь</b> растёт иначе: вторая форма — победа в рейде фабрики любого уровня и плата терминалу, третья — победа в рейде <b data-v-bccb53ae>третьего уровня</b> и плата, четвёртая — Чёрная душа, сданная на терминале фабрики. В бездну технокровь не переходит.</p>', 8)),
        createBaseVNode("div", _hoisted_10$3, [
          createBaseVNode("table", null, [
            _cache[3] || (_cache[3] = createBaseVNode("thead", null, [
              createBaseVNode("tr", null, [
                createBaseVNode("th", null, "Кровь"),
                createBaseVNode("th", null, "Вторая форма"),
                createBaseVNode("th", null, "Третья форма")
              ])
            ], -1)),
            createBaseVNode("tbody", null, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(quests), (b) => {
                return openBlock(), createElementBlock("tr", {
                  key: b.id
                }, [
                  createBaseVNode("th", _hoisted_11$3, [
                    createVNode(_sfc_main$u, {
                      colour: b.colour
                    }, null, 8, ["colour"]),
                    createTextVNode(toDisplayString(b.title), 1)
                  ]),
                  createBaseVNode("td", null, "рейд фабрики + " + toDisplayString(b.secondPrice.join(", ")), 1),
                  createBaseVNode("td", null, "рейд III + " + toDisplayString(b.thirdPrice.join(", ")), 1)
                ]);
              }), 128))
            ])
          ])
        ]),
        _cache[9] || (_cache[9] = createBaseVNode("p", { class: "small muted" }, "24 детали — ровно столько приносит одиночный рейд первого уровня. Платят кнопкой крови у терминала.", -1)),
        _cache[10] || (_cache[10] = createBaseVNode("p", null, [
          createTextVNode("С "),
          createBaseVNode("b", null, "третьей формы"),
          createTextVNode(" клинки своей крови бьют сильнее. "),
          createBaseVNode("b", null, "Четвёртая форма"),
          createTextVNode(" открывает корону крови и свой "),
          createBaseVNode("b", null, "дар"),
          createTextVNode(": он просыпается сам, когда нужен, и потом отдыхает 10 минут. У ночной небесной крови Восходящий поток есть уже с третьей формы, а на четвёртой он «пробуждён». У крови предков корона ждёт пятой формы. Как дойти до неё — в разделе "),
          createBaseVNode("a", { href: "#fourth" }, "«Четвёртая форма»"),
          createTextVNode(".")
        ], -1)),
        _cache[11] || (_cache[11] = createBaseVNode("h3", null, "Что даёт каждая форма", -1)),
        createBaseVNode("div", _hoisted_12$3, [
          createBaseVNode("table", null, [
            createBaseVNode("thead", null, [
              createBaseVNode("tr", null, [
                _cache[4] || (_cache[4] = createBaseVNode("th", { scope: "col" }, "Кровь", -1)),
                (openBlock(), createElementBlock(Fragment, null, renderList(FORMS, (f) => {
                  return createBaseVNode("th", {
                    key: f,
                    scope: "col"
                  }, toDisplayString(f) + "-я форма", 1);
                }), 64))
              ])
            ]),
            createBaseVNode("tbody", null, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(compare2), (b) => {
                return openBlock(), createElementBlock("tr", {
                  key: b.id,
                  style: normalizeStyle({ "--b": b.colour })
                }, [
                  createBaseVNode("th", _hoisted_13$3, [
                    createVNode(_sfc_main$u, {
                      colour: b.colour
                    }, null, 8, ["colour"]),
                    createTextVNode(toDisplayString(b.title), 1)
                  ]),
                  b.formless ? (openBlock(), createElementBlock("td", _hoisted_14$2, [
                    _cache[5] || (_cache[5] = createBaseVNode("span", { class: "cmp-tag" }, "Форм нет — всё сразу, с Все-Чёрным", -1)),
                    (openBlock(true), createElementBlock(Fragment, null, renderList(b.perks, (p, i) => {
                      return openBlock(), createElementBlock("span", {
                        key: i,
                        class: "cmp-perk"
                      }, toDisplayString(p), 1);
                    }), 128))
                  ])) : (openBlock(true), createElementBlock(Fragment, { key: 1 }, renderList(b.cells, (c, i) => {
                    return openBlock(), createElementBlock("td", {
                      key: i,
                      class: normalizeClass({ none: !c }),
                      "data-label": `${i + 1}-я форма`
                    }, [
                      c ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                        c.perk ? (openBlock(), createElementBlock("span", _hoisted_16$2, toDisplayString(c.perk), 1)) : createCommentVNode("", true),
                        c.blades.length ? (openBlock(), createElementBlock("span", _hoisted_17$2, "Клинки: " + toDisplayString(c.blades.join(", ")), 1)) : createCommentVNode("", true)
                      ], 64)) : (openBlock(), createElementBlock("span", _hoisted_18$2, "—"))
                    ], 10, _hoisted_15$2);
                  }), 128))
                ], 4);
              }), 128))
            ])
          ])
        ]),
        _cache[12] || (_cache[12] = createBaseVNode("p", { class: "small muted" }, "Прочерк — у крови нет такой формы. Дары и клинки взяты из тех же данных, что и дерево ниже.", -1)),
        _cache[13] || (_cache[13] = createBaseVNode("h3", null, "Как выбрать кровь", -1)),
        createBaseVNode("ul", _hoisted_19$1, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(compare2), (b) => {
            return openBlock(), createElementBlock("li", {
              key: b.id,
              style: normalizeStyle({ "--b": b.colour })
            }, [
              createVNode(_sfc_main$u, {
                colour: b.colour
              }, null, 8, ["colour"]),
              createBaseVNode("b", null, toDisplayString(b.title) + ".", 1),
              createTextVNode(" " + toDisplayString(choose[b.id]), 1)
            ], 4);
          }), 128))
        ]),
        _cache[14] || (_cache[14] = createBaseVNode("h3", null, "Дерево родословных", -1)),
        createVNode(_sfc_main$6),
        _cache[15] || (_cache[15] = createStaticVNode('<p class="small muted" data-v-bccb53ae>Сменить кровь можно у алтаря её святилища — кроме ночной, бездны и техноорганической.</p><p data-v-bccb53ae><b data-v-bccb53ae>Кровь бездны</b> не выбирают и не покупают. Её получает тот, кто выковал <b data-v-bccb53ae>Все-Чёрный</b>: в тот же миг кровь меняется на бездну — навсегда. У бездны нет форм, подвигов и испытаний. Выковать Все-Чёрный можно из <b data-v-bccb53ae>короны своей крови</b> (у пепельной — из Империума или Люцифера) и <b data-v-bccb53ae>Чёрной души</b> у алтаря <b data-v-bccb53ae>своего</b> храма — и храм за это <b data-v-bccb53ae>гневается</b>.</p><p data-v-bccb53ae><b data-v-bccb53ae>Техноорганическую кровь</b> принимают на терминале Древней фабрики. Вместе с ней вы получаете <b data-v-bccb53ae>Энцефало-меч</b>: он сам растёт вместе с кровью — в <b data-v-bccb53ae>Энцефало-клинок</b>, а затем в <b data-v-bccb53ae>Антихрист</b> — и возвращается к вам после смерти.</p><p class="small" data-v-bccb53ae>Алтарь фабрики собирает своей крови <b data-v-bccb53ae>призывные машины</b>: медного голема, малого Предвестника и Сборочный купол.</p><h3 id="titles" data-v-bccb53ae>Звания</h3><p data-v-bccb53ae>Кто прошёл свою кровь до конца — <b data-v-bccb53ae>последняя форма</b>, <b data-v-bccb53ae>свой доспех целиком</b> и <b data-v-bccb53ae>корона крови</b> в инвентаре, — получает её звание. Весь сервер видит в чате: <i data-v-bccb53ae>«ViRuS стал Королём в Чёрном»</i>, а звание навсегда встаёт перед ником префиксом и переливается цветами редкостей короны и доспеха.</p>', 6)),
        createBaseVNode("div", _hoisted_20$1, [
          createBaseVNode("table", null, [
            _cache[6] || (_cache[6] = createBaseVNode("thead", null, [
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
                  createBaseVNode("th", _hoisted_21, [
                    createBaseVNode("span", {
                      class: "btitle",
                      style: normalizeStyle(t.style)
                    }, toDisplayString(t.name), 5)
                  ]),
                  createBaseVNode("td", null, [
                    createVNode(_sfc_main$u, {
                      colour: t.line.colour
                    }, null, 8, ["colour"]),
                    createTextVNode(toDisplayString(t.line.title), 1)
                  ]),
                  createBaseVNode("td", _hoisted_22, [
                    t.icon ? (openBlock(), createElementBlock("img", {
                      key: 0,
                      src: t.icon,
                      alt: ""
                    }, null, 8, _hoisted_23)) : createCommentVNode("", true),
                    createTextVNode(toDisplayString((_a = t.item) == null ? void 0 : _a.name), 1)
                  ]),
                  createBaseVNode("td", null, toDisplayString(t.armour), 1)
                ]);
              }), 128))
            ])
          ])
        ]),
        _cache[16] || (_cache[16] = createStaticVNode('<p class="small muted" data-v-bccb53ae>Последняя форма бездны — сама кровь бездны: форм у неё нет, и доспех ей не нужен — хватает Все-Чёрного. Техноорганической крови тоже хватает формы и Антихриста.</p><h3 data-v-bccb53ae>Путеводитель</h3><p data-v-bccb53ae>Сразу после крови выбирается голос, что будет с вами в пути: он даёт советы, рассказывает легенды и отзывается на то, что с вами происходит. Каждая реплика звучит один раз.</p><div class="tbl" data-v-bccb53ae><table data-v-bccb53ae><thead data-v-bccb53ae><tr data-v-bccb53ae><th data-v-bccb53ae>Голос</th><th data-v-bccb53ae>Какой</th><th data-v-bccb53ae>Что знает</th></tr></thead><tbody data-v-bccb53ae><tr data-v-bccb53ae><td data-v-bccb53ae>Путеводитель</td><td data-v-bccb53ae>старый хранитель знаний о клинках: тёплый, насмешливый, говорит загадками</td><td data-v-bccb53ae>все секреты пепельной, небесной и ночной крови и крови предков; о технокрови — ничего; бездну считает злом и пути к ней не назовёт</td></tr><tr data-v-bccb53ae><td data-v-bccb53ae>ZorahM-GPT</td><td data-v-bccb53ae>разум Древней фабрики: обидчивый, язвительный, драматичный, с комплексом бога; презирает органику и не скрывает своих целей</td><td data-v-bccb53ae>путь технокрови — точно; формы других кровей — догадками; о бездне наслышан, но считает её слабой</td></tr><tr data-v-bccb53ae><td data-v-bccb53ae>Наблюдатель</td><td data-v-bccb53ae>древний свидетель: торжественный и печальный, рассказывает легенды о Все-Чёрном</td><td data-v-bccb53ae>о начальных кровях и технокрови — почти ничего; единственный знает путь к крови бездны и все её особенности</td></tr></tbody></table></div><p class="small muted" data-v-bccb53ae>Кровь бездны всегда слышит Наблюдателя, техноорганическая — ZorahM-GPT: их выбор голоса не касается. Дороги ко всем постройкам — от кузни и храмов до Проклятого замка, Терра-подземелья и Забытого мира — знают все трое и подскажут, пока вы там не побывали.</p><h3 data-v-bccb53ae>Книги</h3><p data-v-bccb53ae>Выбрав кровь, игрок получает <b data-v-bccb53ae>книгу своей крови</b>; сразу за обложкой — «Первые шаги»: чем найти святилище, что даёт первое испытание и какой клинок добыть первым. Оператор сервера получает ещё и <b data-v-bccb53ae>книгу хранителя</b> — её первые страницы стали панелью с кнопками.</p>', 7))
      ]);
    };
  }
};
const BloodSection = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-bccb53ae"]]);
const _hoisted_1$4 = { id: "path" };
const _hoisted_2$4 = {
  class: "path-bloods",
  role: "group",
  "aria-label": "Кровь"
};
const _hoisted_3$3 = ["aria-pressed", "onClick"];
const _hoisted_4$3 = { class: "path-bar" };
const _hoisted_5$3 = {
  class: "path-count",
  "aria-live": "polite"
};
const _hoisted_6$3 = {
  key: 0,
  class: "muted"
};
const _hoisted_7$3 = ["disabled"];
const _hoisted_8$3 = ["aria-valuemax", "aria-valuenow"];
const _hoisted_9$2 = { class: "path-steps" };
const _hoisted_10$2 = { class: "path-head" };
const _hoisted_11$2 = ["checked", "onChange"];
const _hoisted_12$2 = {
  class: "path-n",
  "aria-hidden": "true"
};
const _hoisted_13$2 = { class: "path-title" };
const _hoisted_14$1 = { class: "path-body" };
const _hoisted_15$1 = {
  key: 0,
  class: "small muted"
};
const _hoisted_16$1 = {
  key: 1,
  class: "path-blades"
};
const _hoisted_17$1 = { class: "path-opens" };
const _hoisted_18$1 = ["aria-label", "onClick"];
const _hoisted_19 = ["src"];
const _hoisted_20 = {
  key: 0,
  class: "path-crown"
};
const KEY = "vs-path";
const _sfc_main$4 = {
  __name: "PathSection",
  setup(__props) {
    const blood = Object.fromEntries(data.blood.map((b) => [b.id, b]));
    const blades = ([id, form]) => {
      var _a;
      return (((_a = blood[id]) == null ? void 0 : _a.weapons) || []).filter((w) => (w.form || 1) === form);
    };
    const price = (list) => (list || []).join(", ");
    const first = (id, how) => ({
      id: "f1",
      kind: "Кровь",
      title: "Первая форма",
      opens: [id, 1],
      text: how || `Выберите эту кровь при первом входе — или примите её позже за 20 осколков у алтаря своего святилища: ${blood[id].sanctum}.`
    });
    const second = (id) => ({
      id: "f2",
      kind: "Испытание",
      title: "Вторая форма",
      opens: [id, 2],
      text: `Пройдите испытание 1-го уровня (посвящение) в святилище своей крови: ${blood[id].sanctum}. Пять волн, в пятой — страж святилища.`
    });
    const third = (id, note) => ({
      id: "f3",
      kind: "Испытание",
      title: "Третья форма",
      opens: [id, 3],
      text: `Пройдите испытание 3-го уровня там же. Уровни открываются по порядку: каждое выигранное испытание открывает следующее.${note ? " " + note : ""}`,
      note: "С третьей формы клинки своей крови бьют на 10% сильнее."
    });
    const PATHS = [
      { id: "ember", title: blood.ember.title, colour: blood.ember.colour, steps: [
        first("ember"),
        second("ember"),
        {
          id: "essence",
          kind: "Предмет",
          title: "Улучшить алтарь кузни",
          text: "Добудьте Адскую сущность в часовой башне Проклятого замка и отдайте её алтарю Незеритовой кузни: без этого третье испытание не начать.",
          note: "На сущности проклятие утраты: погибли с ней — она пропала. Улучшение запоминается за вами навсегда."
        },
        third("ember"),
        {
          id: "f4",
          kind: "Босс",
          title: "Четвёртая форма",
          opens: ["ember", 4],
          text: "Победите Короля пиглинов в тронном зале Проклятого замка. Форму получают все пепельные третьей формы, кто в замке, когда он падёт."
        }
      ] },
      { id: "sky", title: "Небесная и ночная", colour: blood.sky.colour, steps: [
        first("sky"),
        second("sky"),
        third("sky", "Серафим третьего испытания роняет Печать ночи."),
        {
          id: "seal",
          kind: "Предмет",
          title: "Сломать Печать ночи",
          opens: ["night", 1],
          text: "У небесной крови четвёртой формы нет. С третьей формой сломайте Печать ночи: ПКМ и ещё раз в течение 5 секунд. Кровь станет ночной небесной той же формы.",
          note: "Сразу наступит ночь, а Небесный храм обрушится и поднимется в другом месте."
        },
        {
          id: "temple",
          kind: "Поиск",
          title: "Найти Тёмный храм",
          text: "После сломанной печати по ночам может встать Тёмный храм; на рассвете он исчезает. Найти его помогает Ночной компас: Компас воздуха и звезда Незера на верстаке."
        },
        {
          id: "f4",
          kind: "Босс",
          title: "Четвёртая форма",
          opens: ["night", 4],
          text: "Встаньте на платформу босса в ротонде Тёмного храма и победите Пустотного Серафима. Ночная небесная кровь третьей формы получает за него четвёртую.",
          note: "Падут все бойцы или все уйдут на минуту — храм исчезнет до следующей ночи."
        }
      ] },
      { id: "steel", title: blood.steel.title, colour: blood.steel.colour, steps: [
        first("steel"),
        second("steel"),
        {
          id: "essence",
          kind: "Предмет",
          title: "Улучшить алтарь храма",
          text: "Добудьте Терра-сущность в Терра-подземелье и отдайте её алтарю Храма джунглей: без этого третье испытание не начать.",
          note: "На сущности проклятие утраты: погибли с ней — она пропала. Улучшение запоминается за вами навсегда."
        },
        third("steel"),
        {
          id: "f4",
          kind: "Босс",
          title: "Четвёртая форма",
          opens: ["steel", 4],
          text: "Выкуйте у алтаря Храма джунглей Джунглевый ключ Забытого мира и пройдите Забытый мир на оценку S или S+. Внизу ждёт Истинный Джунглевый голем.",
          note: "Ниже S форма не растёт."
        },
        {
          id: "f5",
          kind: "Босс",
          title: "Пятая форма",
          opens: ["steel", 5],
          text: "Выкуйте Целестиальный ключ Забытого мира и пройдите Забытый мир с ним — снова на S или S+. За этим ключом ждёт босс Целестиал.",
          note: "Корона крови предков ждёт именно пятой формы."
        }
      ] },
      { id: "techno", title: blood.techno.title, colour: blood.techno.colour, steps: [
        first("techno", "Примите кровь у терминала Древней фабрики. При первом входе её не выбрать, а сменить потом нельзя. Фабрика сразу дарит Энцефало-меч: он растёт вместе с кровью."),
        {
          id: "harbinger",
          kind: "Босс",
          title: "Победить Предвестника",
          text: "Рейды фабрики открываются после первой победы над Предвестником. Его будят у терминала за 24 древние детали."
        },
        {
          id: "f2",
          kind: "Рейд",
          title: "Вторая форма",
          opens: ["techno", 2],
          text: `Победите в рейде фабрики любого уровня и заплатите терминалу кнопкой крови: ${price(blood.techno.secondPrice)}.`
        },
        {
          id: "f3",
          kind: "Рейд",
          title: "Третья форма",
          opens: ["techno", 3],
          text: `Победите в рейде фабрики III уровня и заплатите терминалу: ${price(blood.techno.thirdPrice)}.`,
          note: "С третьей формы клинки своей крови бьют на 10% сильнее."
        },
        {
          id: "f4",
          kind: "Предмет",
          title: "Четвёртая форма",
          opens: ["techno", 4],
          text: "Принесите Чёрную душу и отдайте её ZorahM-GPT кнопкой крови у терминала фабрики. Душа висит в рамке над троном Проклятого замка; взять её можно, когда пал король."
        }
      ] },
      { id: "abyss", title: blood.abyss.title, colour: blood.abyss.colour, steps: [
        {
          id: "crown",
          kind: "Кровь",
          title: "Дойти до короны своей крови",
          text: "Кровь бездны не выбирают и не покупают, форм у неё нет. Сперва пройдите путь своей крови до её короны. Техноорганическая кровь в бездну не переходит."
        },
        {
          id: "soul",
          kind: "Предмет",
          title: "Добыть Чёрную душу",
          text: "Она висит в рамке над троном Проклятого замка; пока король жив, её не снять. Рецепт Все-Чёрного появится в меню алтаря, когда вы хоть раз держали душу."
        },
        {
          id: "forge",
          kind: "Ковка",
          title: "Выковать Все-Чёрный",
          opens: ["abyss", 1],
          text: "У алтаря своего храма, с короной в руке — кнопка «Эволюция». В тот же миг кровь меняется на бездну — навсегда, все её дары приходят сразу."
        },
        {
          id: "wrath",
          kind: "Босс",
          title: "Пережить гнев храма",
          text: "Храм гневается: через пять секунд после ковки в нём просыпается страж. Он засыпает, если в святилище минуту никого нет."
        }
      ] }
    ];
    const state = reactive({ done: {} });
    const chosen = ref(PATHS[0].id);
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "null");
      if (saved && typeof saved === "object") {
        if (PATHS.some((p) => p.id === saved.blood)) chosen.value = saved.blood;
        if (saved.done && typeof saved.done === "object") {
          for (const k of Object.keys(saved.done)) if (saved.done[k] === true) state.done[k] = true;
        }
      }
    } catch (e) {
    }
    const save = () => {
      try {
        localStorage.setItem(KEY, JSON.stringify({ blood: chosen.value, done: state.done }));
      } catch (e) {
      }
    };
    const path = computed(() => PATHS.find((p) => p.id === chosen.value));
    const key = (step) => `${chosen.value}.${step.id}`;
    const total = computed(() => path.value.steps.length);
    const count = computed(() => path.value.steps.filter((s) => state.done[key(s)]).length);
    const next = computed(() => {
      var _a;
      return (_a = path.value.steps.find((s) => !state.done[key(s)])) == null ? void 0 : _a.id;
    });
    const choose = (id) => {
      chosen.value = id;
      save();
    };
    function toggle(step, on) {
      if (on) state.done[key(step)] = true;
      else delete state.done[key(step)];
      save();
    }
    function reset() {
      for (const s of path.value.steps) delete state.done[key(s)];
      save();
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$4, [
        createVNode(_sfc_main$k, {
          title: "Мой путь",
          icon: "forgotten_key_moss"
        }, {
          default: withCtx(() => [..._cache[0] || (_cache[0] = [
            createBaseVNode("p", { class: "lead" }, "Чек-лист роста крови: выберите свою и отмечайте пройденное. Отметки хранятся в этом браузере.", -1)
          ])]),
          _: 1
        }),
        createBaseVNode("div", {
          class: "panel path",
          style: normalizeStyle({ "--b": path.value.colour })
        }, [
          createBaseVNode("div", _hoisted_2$4, [
            (openBlock(), createElementBlock(Fragment, null, renderList(PATHS, (p) => {
              return createBaseVNode("button", {
                key: p.id,
                type: "button",
                class: "chip",
                "aria-pressed": p.id === chosen.value,
                onClick: ($event) => choose(p.id)
              }, [
                createBaseVNode("span", {
                  class: "path-gem",
                  style: normalizeStyle({ background: p.colour }),
                  "aria-hidden": "true"
                }, null, 4),
                createTextVNode(toDisplayString(p.title), 1)
              ], 8, _hoisted_3$3);
            }), 64))
          ]),
          createBaseVNode("div", _hoisted_4$3, [
            createBaseVNode("p", _hoisted_5$3, [
              _cache[1] || (_cache[1] = createTextVNode("Выполнено ", -1)),
              createBaseVNode("b", null, toDisplayString(count.value), 1),
              _cache[2] || (_cache[2] = createTextVNode(" из ", -1)),
              createBaseVNode("b", null, toDisplayString(total.value), 1),
              count.value === total.value ? (openBlock(), createElementBlock("span", _hoisted_6$3, " — путь пройден")) : createCommentVNode("", true)
            ]),
            createBaseVNode("button", {
              type: "button",
              class: "path-reset",
              disabled: !count.value,
              onClick: reset
            }, "Сбросить", 8, _hoisted_7$3),
            createBaseVNode("div", {
              class: "path-track",
              role: "progressbar",
              "aria-label": "Пройдено шагов",
              "aria-valuemin": "0",
              "aria-valuemax": total.value,
              "aria-valuenow": count.value
            }, [
              createBaseVNode("span", {
                style: normalizeStyle({ width: `${count.value / total.value * 100}%` })
              }, null, 4)
            ], 8, _hoisted_8$3)
          ]),
          createBaseVNode("ol", _hoisted_9$2, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(path.value.steps, (s, i) => {
              return openBlock(), createElementBlock("li", {
                key: key(s),
                class: normalizeClass(["path-step", { done: state.done[key(s)], next: s.id === next.value }])
              }, [
                createBaseVNode("label", _hoisted_10$2, [
                  createBaseVNode("input", {
                    type: "checkbox",
                    checked: !!state.done[key(s)],
                    onChange: ($event) => toggle(s, $event.target.checked)
                  }, null, 40, _hoisted_11$2),
                  createBaseVNode("span", _hoisted_12$2, toDisplayString(i + 1), 1),
                  createBaseVNode("span", _hoisted_13$2, toDisplayString(s.title), 1),
                  createBaseVNode("span", {
                    class: normalizeClass(["pill", { boss: s.kind === "Босс" }])
                  }, toDisplayString(s.kind), 3)
                ]),
                createBaseVNode("div", _hoisted_14$1, [
                  createBaseVNode("p", null, toDisplayString(s.text), 1),
                  s.note ? (openBlock(), createElementBlock("p", _hoisted_15$1, toDisplayString(s.note), 1)) : createCommentVNode("", true),
                  s.opens && blades(s.opens).length ? (openBlock(), createElementBlock("div", _hoisted_16$1, [
                    createBaseVNode("span", _hoisted_17$1, toDisplayString(unref(plural)(blades(s.opens).length, "Открывается клинок", "Открываются клинки", "Открываются клинки")), 1),
                    (openBlock(true), createElementBlock(Fragment, null, renderList(blades(s.opens), (w) => {
                      return openBlock(), createElementBlock("button", {
                        key: w.id,
                        type: "button",
                        class: "mitem",
                        "aria-label": `Открыть карточку: ${w.name}`,
                        onClick: ($event) => unref(openItem)(w.id)
                      }, [
                        createBaseVNode("img", {
                          src: w.icon,
                          alt: ""
                        }, null, 8, _hoisted_19),
                        createBaseVNode("span", null, toDisplayString(w.name), 1),
                        w.crown ? (openBlock(), createElementBlock("span", _hoisted_20, "корона")) : createCommentVNode("", true)
                      ], 8, _hoisted_18$1);
                    }), 128))
                  ])) : createCommentVNode("", true)
                ])
              ], 2);
            }), 128))
          ]),
          _cache[3] || (_cache[3] = createBaseVNode("p", { class: "small muted" }, [
            createTextVNode("Клинки по формам взяты из тех же данных, что и раздел "),
            createBaseVNode("a", { href: "#blood" }, "«Родословные»"),
            createTextVNode("; уровни испытаний — в разделе "),
            createBaseVNode("a", { href: "#raids" }, "«Испытания»"),
            createTextVNode(".")
          ], -1))
        ], 4)
      ]);
    };
  }
};
const PathSection = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-00269835"]]);
const _hoisted_1$3 = { id: "trophies" };
const _hoisted_2$3 = {
  class: "tally",
  "aria-live": "polite"
};
const _hoisted_3$2 = {
  class: "filters",
  role: "group",
  "aria-label": "Тип достижения"
};
const _hoisted_4$2 = ["aria-pressed", "onClick"];
const _hoisted_5$2 = { class: "chip-count" };
const _hoisted_6$2 = {
  class: "filters by-group",
  role: "group",
  "aria-label": "Группа достижений"
};
const _hoisted_7$2 = ["aria-pressed", "onClick"];
const _hoisted_8$2 = { class: "chip-count" };
const _hoisted_9$1 = { class: "group" };
const _hoisted_10$1 = { class: "group-count" };
const _hoisted_11$1 = { class: "advs" };
const _hoisted_12$1 = ["title"];
const _hoisted_13$1 = ["src"];
const _hoisted_14 = { class: "toast-head" };
const _hoisted_15 = { class: "toast-title" };
const _hoisted_16 = { class: "quote" };
const _hoisted_17 = { class: "cond" };
const _hoisted_18 = {
  key: 0,
  class: "empty"
};
const _sfc_main$3 = {
  __name: "TrophiesSection",
  setup(__props) {
    const FRAMES = [["all", "Все"], ["task", "Задачи"], ["goal", "Цели"], ["challenge", "Испытания"]];
    const frame = ref("all");
    const group = ref("all");
    const TOAST = { task: "Достижение получено!", goal: "Цель достигнута!", challenge: "Испытание завершено!" };
    const total = data.achievements.reduce((n, g) => n + g.cards.length, 0);
    const ofFrame = (a) => frame.value === "all" || a.frame === frame.value;
    const ofGroup = (g) => group.value === "all" || g.title === group.value;
    const counts = computed(() => {
      const all = achievementGroups.value.filter(ofGroup).flatMap((g) => g.cards);
      return Object.fromEntries(FRAMES.map(([key]) => [key, key === "all" ? all.length : all.filter((a) => a.frame === key).length]));
    });
    const groupChips = computed(() => {
      const found2 = Object.fromEntries(achievementGroups.value.map((g) => [g.title, g.cards.filter(ofFrame).length]));
      const chips = data.achievements.map((g) => ({ key: g.title, title: g.title, count: found2[g.title] || 0 }));
      return [{ key: "all", title: "Все группы", count: chips.reduce((n, c) => n + c.count, 0) }, ...chips];
    });
    const groups = computed(() => achievementGroups.value.filter(ofGroup).map((g) => ({ ...g, cards: g.cards.filter(ofFrame) })).filter((g) => g.cards.length));
    const shown = computed(() => groups.value.reduce((n, g) => n + g.cards.length, 0));
    const narrowed = computed(() => frame.value !== "all" || group.value !== "all");
    const reset = () => {
      frame.value = "all";
      group.value = "all";
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$3, [
        createVNode(_sfc_main$k, {
          title: "Достижения",
          icon: "royal_clock"
        }, {
          default: withCtx(() => [..._cache[0] || (_cache[0] = [
            createBaseVNode("p", { class: "lead" }, "Отдельная вкладка в меню достижений.", -1)
          ])]),
          _: 1
        }),
        createBaseVNode("p", _hoisted_2$3, [
          _cache[1] || (_cache[1] = createTextVNode("Показано ", -1)),
          createBaseVNode("b", null, toDisplayString(shown.value), 1),
          _cache[2] || (_cache[2] = createTextVNode(" из ", -1)),
          createBaseVNode("b", null, toDisplayString(unref(total)), 1),
          narrowed.value ? (openBlock(), createElementBlock("button", {
            key: 0,
            type: "button",
            class: "tally-reset",
            onClick: reset
          }, "Сбросить отбор")) : createCommentVNode("", true)
        ]),
        createBaseVNode("div", _hoisted_3$2, [
          (openBlock(), createElementBlock(Fragment, null, renderList(FRAMES, ([key, title]) => {
            return createBaseVNode("button", {
              key,
              type: "button",
              class: "chip",
              "aria-pressed": String(frame.value === key),
              onClick: ($event) => frame.value = key
            }, [
              createTextVNode(toDisplayString(title), 1),
              createBaseVNode("span", _hoisted_5$2, toDisplayString(counts.value[key]), 1)
            ], 8, _hoisted_4$2);
          }), 64))
        ]),
        createBaseVNode("div", _hoisted_6$2, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(groupChips.value, (c) => {
            return openBlock(), createElementBlock("button", {
              key: c.key,
              type: "button",
              class: "chip",
              "aria-pressed": String(group.value === c.key),
              onClick: ($event) => group.value = c.key
            }, [
              createTextVNode(toDisplayString(c.title), 1),
              createBaseVNode("span", _hoisted_8$2, toDisplayString(c.count), 1)
            ], 8, _hoisted_7$2);
          }), 128))
        ]),
        (openBlock(true), createElementBlock(Fragment, null, renderList(groups.value, (g) => {
          return openBlock(), createElementBlock(Fragment, {
            key: g.title
          }, [
            createBaseVNode("h3", _hoisted_9$1, [
              createTextVNode(toDisplayString(g.title), 1),
              createBaseVNode("span", _hoisted_10$1, toDisplayString(g.cards.length), 1)
            ]),
            createBaseVNode("div", _hoisted_11$1, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(g.cards, (a) => {
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
                      }, null, 8, _hoisted_13$1)) : a.gem ? (openBlock(), createElementBlock("span", {
                        key: 1,
                        class: "gem",
                        style: normalizeStyle({ "--gem": a.gem })
                      }, null, 4)) : createCommentVNode("", true)
                    ], 10, _hoisted_12$1),
                    createBaseVNode("div", null, [
                      createBaseVNode("p", _hoisted_14, toDisplayString(TOAST[a.frame] || a.frameLabel), 1),
                      createBaseVNode("h4", _hoisted_15, toDisplayString(a.title), 1)
                    ])
                  ], 2),
                  createBaseVNode("p", _hoisted_16, "«" + toDisplayString(a.description) + "»", 1),
                  createBaseVNode("p", _hoisted_17, toDisplayString(a.condition), 1)
                ]);
              }), 128))
            ])
          ], 64);
        }), 128)),
        !groups.value.length ? (openBlock(), createElementBlock("p", _hoisted_18, toDisplayString(narrowed.value ? "Под этот отбор не подходит ни одно достижение." : "Ни одного достижения по этому слову."), 1)) : createCommentVNode("", true)
      ]);
    };
  }
};
const TrophiesSection = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-852d83e2"]]);
const _hoisted_1$2 = { id: "admin" };
const _hoisted_2$2 = { class: "twocol" };
const _hoisted_3$1 = { class: "term" };
const _hoisted_4$1 = { class: "term-bar" };
const _hoisted_5$1 = { class: "term" };
const _hoisted_6$1 = { class: "term-bar" };
const _hoisted_7$1 = { class: "term-body" };
const _hoisted_8$1 = { class: "t-k" };
const _hoisted_9 = { class: "t-v" };
const _hoisted_10 = {
  key: 1,
  class: "t-c"
};
const _hoisted_11 = { class: "tbl adm-keys" };
const _hoisted_12 = { scope: "row" };
const _hoisted_13 = {
  class: "sr-only",
  "aria-live": "polite"
};
const _sfc_main$2 = {
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
      ["  raid-relic-chance", "0.15", "шанс ядра на втором уровне рейда фабрики"],
      ["abilities", null, ""],
      ["  cooldown-seconds", "…", "перезарядки способностей, по клинкам"],
      ["bound-drops", null, ""],
      ["  items", "[all_black]", "клинки, которые не теряются при смерти"]
    ];
    const KEYS = [
      ["balance-version", "9", "Версия баланса клинков. Когда в новой сборке меняется перезарядка по умолчанию, плагин при запуске сам переносит её в старый config.yml — но только туда, где стоит прежнее значение по умолчанию. Числа, которые вы поменяли сами, он не трогает."],
      ["abilities.cooldown-seconds.*", "секунды", "Перезарядки способностей: ключ — id клинка, значение — секунды. Например, all_black: 9, lucifer: 120. У второй способности клинка свой ключ: all_black_mirror, enigma_storm."],
      ["abilities.blaze-cooldown-seconds", "300", "Перезарядка Пекла у Бедствия задаётся отдельно: это ожидание после того, как действие закончилось."],
      ["abilities.genocide.per-kill", "0.3", "Геноцид Все-Чёрного: сколько урона клинку навсегда добавляет каждый убитый им моб."],
      ["abilities.genocide.max-bonus", "0", "Потолок этой прибавки. 0 — без потолка."],
      ["titles.enabled", "true", "Звания конца крови: последняя форма, свой доспех целиком и корона в инвентаре. Звание остаётся навсегда."],
      ["titles.announce", "true", "Писать всему серверу, что игрок получил звание."],
      ["titles.own-chat, titles.own-tab", "auto", "Звание в чате и в табе рисует сам плагин: auto — если нет плагина чата или плагина TAB, always — всегда, never — никогда."],
      ["titles.luckperms.*", "enabled: true, priority: 100", "Префикс звания через LuckPerms; его показывает плагин чата, который понимает префиксы LuckPerms. В prefix-format метка {color} — цвет звания: если его поменять, звание перестанет переливаться."],
      ["wings.enabled", "true", "Крылья за спиной у того, кто носит доспех целиком. false — крыльев нет."],
      ["wings.celestial.*", "height: 1.75, scale: 0.625, yaw-offset: 0", "Крылья Целестиального доспеха: высота над ногами в блоках, размер и поворот в градусах (180, если крылья оказались спереди)."],
      ["story.enabled", "true", "Сюжет: голос говорит с каждым, кто выбрал кровь."],
      ["story.tip-minutes", "10", "Через сколько минут молчания голос даёт совет или рассказывает легенду. Считается реальное время, пока игрок в игре; советы, которые игроку уже не нужны, пропускаются."]
    ];
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$2, [
        createVNode(_sfc_main$k, {
          title: "Для администратора",
          icon: "ancient_part"
        }),
        createBaseVNode("div", _hoisted_2$2, [
          createBaseVNode("figure", _hoisted_3$1, [
            createBaseVNode("figcaption", _hoisted_4$1, [
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
            _cache[4] || (_cache[4] = createStaticVNode('<pre class="term-body" data-v-fb2af66c><code data-v-fb2af66c><span class="t-c" data-v-fb2af66c># собрать плагин (нужна Java 21+; на Windows — gradlew.bat build)</span>\n<span class="t-p" data-v-fb2af66c>$</span> ./gradlew build\n<span class="t-c" data-v-fb2af66c># положить в папку плагинов сервера Paper 1.21.11</span>\n<span class="t-p" data-v-fb2af66c>$</span> cp build/libs/virusswords-1.0.0.jar server/plugins/\n<span class="t-c" data-v-fb2af66c># раздать ресурспак (клиент 1.21.6 и новее): строка в server.properties</span>\n<span class="t-k" data-v-fb2af66c>resource-pack</span>=<span class="t-v" data-v-fb2af66c>https://…/VirusSwords-ResourcePack.zip</span>\n<span class="t-c" data-v-fb2af66c># первый запуск: плагин сам ставит датапак достижений</span>\n<span class="t-c" data-v-fb2af66c># и один раз перезагружает данные</span>\n<span class="t-p" data-v-fb2af66c>$</span> java -jar paper.jar --nogui\n<span class="t-ok" data-v-fb2af66c>[VirusSwords] Enabling VirusSwords v1.0.0</span><span class="term-caret" aria-hidden="true" data-v-fb2af66c></span></code></pre>', 1))
          ]),
          createBaseVNode("figure", _hoisted_5$1, [
            createBaseVNode("figcaption", _hoisted_6$1, [
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
            createBaseVNode("pre", _hoisted_7$1, [
              createBaseVNode("code", null, [
                (openBlock(), createElementBlock(Fragment, null, renderList(CONFIG, ([key, value, note], i) => {
                  return openBlock(), createElementBlock(Fragment, { key: i }, [
                    createBaseVNode("span", _hoisted_8$1, toDisplayString(key), 1),
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
        _cache[11] || (_cache[11] = createStaticVNode('<ul class="adm-notes" data-v-fb2af66c><li data-v-fb2af66c>Сервер — Paper 1.21.11, для сборки нужен JDK 21 или новее.</li><li data-v-fb2af66c>Ресурспак <code data-v-fb2af66c>VirusSwords-ResourcePack.zip</code> рассчитан на клиент 1.21.6 и новее. Его можно раздать строкой <code data-v-fb2af66c>resource-pack</code> в <code data-v-fb2af66c>server.properties</code> или надеть локально в лаунчере.</li><li data-v-fb2af66c>Без ресурспака оружие работает, но выглядит как обычные мечи и топор.</li><li data-v-fb2af66c>Достижения ставить не нужно: плагин сам кладёт датапак в папку <code data-v-fb2af66c>datapacks</code> основного мира и один раз перезагружает данные сервера, когда датапак появился или изменился.</li></ul><h3 class="adm-h" data-v-fb2af66c>Полезные ключи config.yml</h3>', 2)),
        createBaseVNode("div", _hoisted_11, [
          createBaseVNode("table", null, [
            _cache[10] || (_cache[10] = createBaseVNode("thead", null, [
              createBaseVNode("tr", null, [
                createBaseVNode("th", null, "Ключ"),
                createBaseVNode("th", null, "По умолчанию"),
                createBaseVNode("th", null, "Что делает")
              ])
            ], -1)),
            createBaseVNode("tbody", null, [
              (openBlock(), createElementBlock(Fragment, null, renderList(KEYS, ([key, value, note]) => {
                return createBaseVNode("tr", { key }, [
                  createBaseVNode("th", _hoisted_12, [
                    createBaseVNode("code", null, toDisplayString(key), 1)
                  ]),
                  createBaseVNode("td", null, [
                    createBaseVNode("code", null, toDisplayString(value), 1)
                  ]),
                  createBaseVNode("td", null, toDisplayString(note), 1)
                ]);
              }), 64))
            ])
          ])
        ]),
        createBaseVNode("p", _hoisted_13, toDisplayString(copied.value ? "Скопировано в буфер обмена" : ""), 1)
      ]);
    };
  }
};
const AdminSection = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-fb2af66c"]]);
const _hoisted_1$1 = { id: "faq" };
const _hoisted_2$1 = { class: "faq-find" };
const _hoisted_3 = {
  class: "small muted",
  "aria-live": "polite"
};
const _hoisted_4 = { class: "faq-q" };
const _hoisted_5 = { class: "faq-a" };
const _hoisted_6 = {
  key: 0,
  class: "small faq-links"
};
const _hoisted_7 = ["href"];
const _hoisted_8 = { key: 0 };
const _sfc_main$1 = {
  __name: "FaqSection",
  setup(__props) {
    const GROUPS = [
      { title: "Первые шаги", items: [
        {
          q: "Какую кровь выбрать при первом входе?",
          a: "На выбор три крови: пепельная, небесная и кровь предков. Выбор решает, какую книгу вы получите, как растёте и какие величайшие клинки вас признают. Позже можно принять другую кровь у алтаря её святилища.",
          links: [["#blood", "Родословные"]]
        },
        {
          q: "Где взять первый клинок?",
          a: "Погибель и Резак лежат в сундуках древнего города, Арахнид — в вагонетках заброшенных шахт, Сумрачная секира — в крепостях Незера. Эти клинки не крафтятся, их только находят.",
          links: [["#start", "С чего начать"]]
        },
        {
          q: "Нужен ли ресурспак?",
          a: "Без него оружие работает, но выглядит как обычные мечи и топор. Ресурспак рассчитан на клиенты 1.21.6 и новее."
        },
        {
          q: "Как найти святилище?",
          a: "Святилища находят только компасами и картами: Компас воздуха (компас и 4 заряда ветра) ведёт к Небесному храму, карта кузни (пустая карта и 4 незерских кирпича) — к Незеритовой кузне, карта джунглей (пустая карта и 4 изумруда) — к Храму джунглей. Каждое святилище одно на сервер.",
          links: [["#sanctums", "Святилища"]]
        }
      ] },
      { title: "Клинки и мастерство", items: [
        {
          q: "Как растёт мастерство клинка?",
          a: "Каждая единица урона, реально снятая с цели, даёт одно очко; весь путь до 100 уровня — около 28 000 очков. Каждый уровень добавляет +0,1% урона и открывает заточку и пробуждение. Лук меч ничему не учит.",
          links: [["#growth", "Рост клинка"]]
        },
        {
          q: "Нужно ли мастерство, чтобы эволюционировать клинок?",
          a: "Нет, эволюция у алтаря просит только материалы. Зачарования, заточка и пробуждение переходят на новую форму, а мастерство начинается заново.",
          links: [["#growth", "Эволюции у алтарей"]]
        },
        {
          q: "Как заточить и пробудить клинок?",
          a: "Каждая звезда заточки даёт +4% урона; звезда n требует мастерства 15·n, 8·n осколков святилища и n штук катализатора, а ★4 и ★5 — ещё и реликвию. Пробуждение один раз на клинок: нужны ★3, мастерство 50, 32 осколка и реликвия; перезарядка способности короче на четверть, урон +5%.",
          links: [["#growth", "Рост клинка"]]
        },
        {
          q: "Можно ли скрафтить любой клинок на верстаке?",
          a: "Нет. Клинки пепельной крови — Убийца демонов, Бедствие, Воля Демона, Империум, Сборщик душ — получают только эволюцией у алтаря Незеритовой кузни, а Терра-резак куётся только у алтаря Храма джунглей.",
          links: [["#craft", "Крафт"], ["#weapons", "Линии клинков"]]
        }
      ] },
      { title: "Кровь", items: [
        {
          q: "Можно ли сменить кровь?",
          a: "Да: у алтаря святилища нужной крови за 20 его осколков (кнопка «Принять кровь святилища»). Новая кровь начинается с первой формы, и вы получаете новую книгу. Ночную небесную кровь купить нельзя — её даёт только Печать ночи.",
          links: [["#blood", "Родословные"]]
        },
        {
          q: "Как поднять форму крови?",
          a: "Вторую форму даёт первое испытание святилища своей крови, третью — третье испытание. У пепельной крови и крови предков третье испытание начинает только тот, кто сначала улучшил алтарь сущностью: кузню — Адской, Храм джунглей — Терра.",
          links: [["#raids", "Испытания"]]
        },
        {
          q: "Что такое корона крови и почему она не работает в руке?",
          a: "Корона — высший клинок своей крови: Истинный Экскалибур и Антихрист отвечают только четвёртой форме, Целестиал — пятой, Империум — четвёртой. Выковать корону можно раньше, но в руке она мертва, пока кровь не дойдёт до нужной формы.",
          links: [["#blood", "Родословные"]]
        },
        {
          q: "Как получить четвёртую форму?",
          a: "Пепельной — победить Короля пиглинов в Проклятом замке. Ночной небесной — победить Пустотного Серафима: четвёртую форму получает каждый ночной боец третьей формы, кто бился с ним. Предков — пройти Забытый мир с Джунглевым ключом на оценку S или S+. Техноорганической — отдать Чёрную душу ZorahM-GPT у терминала фабрики. У небесной крови четвёртой формы нет.",
          links: [["#raids", "Четвёртая форма"]]
        }
      ] },
      { title: "Святилища и боссы", items: [
        {
          q: "Как вызвать стража святилища и что будет при провале?",
          a: "Испытание начинают у алтаря: пять волн в арене, в пятой — сам страж; уровень и награду определяет тот, кто начал, а выйти из арены до конца боя нельзя. Провал — арена пустовала 30 секунд, прошло 12 минут или страж ушёл; он забирает у каждого половину осколков, добытых в этом бою.",
          links: [["#raids", "Испытания"]]
        },
        {
          q: "Что такое Печать ночи?",
          a: "Её роняет Серафим третьего испытания Небесного храма. Небесная кровь третьей формы ломает печать правым кликом (второй клик в течение 5 секунд подтверждает) и становится ночной небесной; Небесный храм при этом разваливается, чтобы подняться в другом месте. С этого момента по ночам может встать Тёмный храм.",
          links: [["#sanctums", "Святилища"]]
        },
        {
          q: "Как попасть на Древнюю фабрику?",
          a: "Фабрика стоит под землёй в 1500–3000 блоках от спавна, и на неё указывает только Неизвестный компас. Он не крафтится: лежит в сундуках заброшенных шахт (8%) и древних городов (20%) и ведёт к будке шахты на поверхности — единственному входу вниз.",
          links: [["#sanctums", "Святилища"]]
        }
      ] },
      { title: "Забытый мир", items: [
        {
          q: "Как войти в Забытый мир?",
          a: "Ключ куёт у алтаря Храма джунглей только кровь предков. Вход — из Терра-подземелья: когда Джунглевый голем пал и Терра-сущность взята, поверните ключ правым кликом, и рядом ляжет платформа. Встаньте на неё — через 10 секунд всех, кто стоит, перенесёт в Забытый мир.",
          links: [["#raids", "Четвёртая форма"]]
        },
        {
          q: "Что будет, если погибнуть в Забытом мире?",
          a: "Ничего не теряется: вы становитесь призраком, а на месте гибели остаётся ваша душа. Союзник, простоявший у души 3 секунды, поднимает вас с половиной здоровья; никто не подошёл — через 30 секунд вы встанете сами, пока жив хоть кто-то из отряда."
        },
        {
          q: "Какая оценка нужна для формы крови?",
          a: "Кровь предков растёт, только если проход закончен на S или S+: S+ начинается от 300 очков, S — от 270. Ниже S форма не растёт, а в чат приходит, почему.",
          links: [["#blood", "Родословные"]]
        }
      ] },
      { title: "Если что-то не работает", items: [
        {
          q: "Клинок не слушается — удар не проходит, ПКМ молчит.",
          a: "Скорее всего, это не ваша кровь или ещё не дошедшая до нужной форма: в чужих руках клинок мёртв, а над хотбаром пишется «признаёт только …». В описании клинка указано, чьей он крови. В креативе ограничений нет.",
          links: [["#blood", "Родословные"]]
        },
        {
          q: "Способность не срабатывает.",
          a: "Проверьте перезарядку: когда она заканчивается, над хотбаром появляется «… готово». Способности на правый клик работают и по воздуху, и по блоку, по направлению взгляда."
        },
        {
          q: "Вместо моделей обычные мечи и топор.",
          a: "Скорее всего, ресурспак не принят или не надет: без него оружие работает, но выглядит как обычные предметы. Паку нужен клиент 1.21.6 или новее."
        },
        {
          q: "Алтарь молчит и не открывается.",
          a: "Пока стоит хоть один стражник, алтарь закрыт: комната алтаря отталкивает бойцов к арене и пишет, сколько стражи осталось. Когда пал последний, появится титр «Стража пала — алтарь открыт». На фабрике терминал ждёт ещё и того, чтобы в реакторе не стоял Предвестник.",
          links: [["#sanctums", "Святилища"]]
        },
        {
          q: "Терминал фабрики бьёт молнией.",
          a: "Вы ответили на капчу неверно: молния наносит 6 урона и не убивает — останавливается на половине сердца. Задача после ошибки не меняется — у терминала ждёт та же, пока её не решат. Ответ набирают клавишами-предметами, до четырёх знаков."
        }
      ] }
    ];
    const query = ref("");
    const norm2 = (s) => s.toLowerCase().replace(/ё/g, "е");
    const shown = computed(() => {
      const q = norm2(query.value.trim());
      if (!q) return GROUPS;
      return GROUPS.map((g) => ({ ...g, items: g.items.filter((i) => norm2(i.q).includes(q)) })).filter((g) => g.items.length);
    });
    const total = computed(() => shown.value.reduce((n, g) => n + g.items.length, 0));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$1, [
        createVNode(_sfc_main$k, {
          title: "Частые вопросы",
          icon: "terra_compass"
        }, {
          default: withCtx(() => [..._cache[1] || (_cache[1] = [
            createBaseVNode("p", { class: "lead" }, "Короткие ответы для новичка: от первого входа до капчи на фабрике.", -1)
          ])]),
          _: 1
        }),
        createBaseVNode("div", _hoisted_2$1, [
          _cache[2] || (_cache[2] = createBaseVNode("label", {
            for: "faq-q",
            class: "sr-only"
          }, "Фильтр по вопросам", -1)),
          withDirectives(createBaseVNode("input", {
            id: "faq-q",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => query.value = $event),
            type: "search",
            class: "faq-input",
            placeholder: "Фильтр по вопросам",
            autocomplete: "off"
          }, null, 512), [
            [vModelText, query.value]
          ]),
          createBaseVNode("p", _hoisted_3, toDisplayString(query.value.trim() ? total.value ? `Найдено вопросов: ${total.value}` : "Ничего не найдено" : ""), 1)
        ]),
        (openBlock(true), createElementBlock(Fragment, null, renderList(shown.value, (g) => {
          return openBlock(), createElementBlock("div", {
            key: g.title,
            class: "faq-group"
          }, [
            createBaseVNode("h3", null, toDisplayString(g.title), 1),
            (openBlock(true), createElementBlock(Fragment, null, renderList(g.items, (i) => {
              return openBlock(), createElementBlock("details", {
                key: i.q,
                class: "faq-item"
              }, [
                createBaseVNode("summary", null, [
                  createBaseVNode("span", _hoisted_4, toDisplayString(i.q), 1)
                ]),
                createBaseVNode("div", _hoisted_5, [
                  createBaseVNode("p", null, toDisplayString(i.a), 1),
                  i.links ? (openBlock(), createElementBlock("p", _hoisted_6, [
                    _cache[3] || (_cache[3] = createTextVNode("Подробнее: ", -1)),
                    (openBlock(true), createElementBlock(Fragment, null, renderList(i.links, ([href, label], k) => {
                      return openBlock(), createElementBlock(Fragment, {
                        key: href + label
                      }, [
                        createBaseVNode("a", { href }, toDisplayString(label), 9, _hoisted_7),
                        k < i.links.length - 1 ? (openBlock(), createElementBlock("span", _hoisted_8, ", ")) : createCommentVNode("", true)
                      ], 64);
                    }), 128))
                  ])) : createCommentVNode("", true)
                ])
              ]);
            }), 128))
          ]);
        }), 128))
      ]);
    };
  }
};
const FaqSection = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-51cbbcd9"]]);
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
        createVNode(_sfc_main$r),
        createVNode(_sfc_main$q),
        _cache[0] || (_cache[0] = createBaseVNode("a", {
          class: "skip",
          href: "#main"
        }, "Перейти к содержанию", -1)),
        createVNode(SideNav),
        createBaseVNode("div", _hoisted_1, [
          createBaseVNode("main", _hoisted_2, [
            createVNode(_sfc_main$z),
            createVNode(_sfc_main$f),
            createVNode(StartSection),
            createVNode(_sfc_main$i),
            createVNode(_sfc_main$h),
            createVNode(CompareSection),
            createVNode(CraftingSection),
            createVNode(GrowthSection),
            createVNode(SanctumsSection),
            createVNode(_sfc_main$8),
            createVNode(BestiarySection),
            createVNode(BloodSection),
            createVNode(PathSection),
            createVNode(TrophiesSection),
            createVNode(FaqSection),
            createVNode(AdminSection)
          ])
        ]),
        createVNode(_sfc_main$l),
        createVNode(_sfc_main$s),
        createVNode(_sfc_main$p),
        createVNode(_sfc_main$o),
        createVNode(_sfc_main$n),
        createVNode(_sfc_main$m)
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
function hold(el, block) {
  if (!el) return;
  const put = () => el.scrollIntoView({ block, behavior: "instant" });
  put();
  const watch2 = new ResizeObserver(put);
  watch2.observe(document.querySelector("main") || document.body);
  const stop = () => {
    watch2.disconnect();
    for (const t of ["wheel", "touchstart", "keydown", "pointerdown"]) removeEventListener(t, stop, true);
  };
  for (const t of ["wheel", "touchstart", "keydown", "pointerdown"]) addEventListener(t, stop, { capture: true, passive: true });
  const later = () => setTimeout(stop, 800);
  if (document.readyState === "complete") later();
  else addEventListener("load", later, { once: true });
}
nextTick(() => {
  const hash = location.hash.slice(1);
  if (hash.startsWith("w-") && item(hash.slice(2))) {
    hold(document.getElementById(hash), "center");
    openItem(hash.slice(2));
  } else if (hash) hold(document.getElementById(hash), "start");
});
