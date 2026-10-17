import { r as reactive, c as computed, w as watch, o as onMounted, a as onBeforeUnmount, b as openBlock, d as createElementBlock, e as createBaseVNode, u as unref, f as withDirectives, v as vModelText, F as Fragment, g as renderList, h as createCommentVNode, i as createTextVNode, t as toDisplayString, j as ref, n as normalizeClass, k as renderSlot, l as normalizeStyle, m as createVNode, p as withCtx, q as createBlock, s as resolveDynamicComponent, x as nextTick, T as Transition, y as createStaticVNode, z as createApp } from "./vue.js";
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
const _hoisted_1$p = { class: "side" };
const _hoisted_2$m = {
  class: "brand",
  href: "#top"
};
const _hoisted_3$l = ["src"];
const _hoisted_4$k = ["aria-expanded", "aria-activedescendant"];
const _hoisted_5$j = {
  key: 0,
  class: "found-box"
};
const _hoisted_6$i = {
  key: 0,
  id: "found",
  class: "found",
  role: "listbox",
  "aria-label": "Найденные предметы"
};
const _hoisted_7$h = ["id", "aria-selected"];
const _hoisted_8$g = ["href", "onMouseenter"];
const _hoisted_9$e = ["src"];
const _hoisted_10$c = ["title"];
const _hoisted_11$b = { class: "found-kind" };
const _hoisted_12$b = {
  class: "search-hint",
  "aria-live": "polite"
};
const _hoisted_13$a = {
  key: 1,
  class: "search-hint"
};
const _hoisted_14$9 = ["href", "aria-current"];
const _hoisted_15$8 = {
  key: 0,
  class: "count"
};
const SHOWN = 8;
const _sfc_main$t = {
  __name: "SideNav",
  setup(__props) {
    const sections = [
      ["start", "С чего начать"],
      ["rarity", "Редкости"],
      ["weapons", "Оружие", data.counts.weapons],
      ["materials", "Материалы", data.counts.materials],
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
      var _a;
      if (e.key === "/" && !e.target.matches("input, textarea")) {
        e.preventDefault();
        (_a = input.value) == null ? void 0 : _a.focus();
      }
    };
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
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("aside", _hoisted_1$p, [
        createBaseVNode("a", _hoisted_2$m, [
          createBaseVNode("img", {
            class: "brand-mark",
            src: unref(data).icons.forge_heart,
            alt: ""
          }, null, 8, _hoisted_3$l),
          _cache[2] || (_cache[2] = createBaseVNode("span", { class: "brand-name" }, "Кодекс", -1))
        ]),
        createBaseVNode("div", {
          class: "search",
          role: "search",
          onFocusout: onBlur
        }, [
          _cache[3] || (_cache[3] = createBaseVNode("label", {
            for: "q",
            class: "sr-only"
          }, "Поиск по кодексу", -1)),
          _cache[4] || (_cache[4] = createBaseVNode("svg", {
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
            "aria-controls": "found",
            "aria-expanded": String(listOpen.value && unref(found).length > 0),
            "aria-autocomplete": "list",
            "aria-activedescendant": listOpen.value && unref(found).length ? `found-${cursor.value}` : void 0,
            onInput: onSearch,
            onFocus: _cache[1] || (_cache[1] = ($event) => listOpen.value = true),
            onKeydown: onSearchKey
          }, null, 40, _hoisted_4$k), [
            [vModelText, search.value]
          ]),
          _cache[5] || (_cache[5] = createBaseVNode("kbd", {
            class: "search-key",
            "aria-hidden": "true"
          }, "/", -1)),
          listOpen.value && unref(filters).query ? (openBlock(), createElementBlock("div", _hoisted_5$j, [
            unref(found).length ? (openBlock(), createElementBlock("ul", _hoisted_6$i, [
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
                    }, null, 8, _hoisted_9$e),
                    createBaseVNode("span", {
                      class: "found-name",
                      title: i.name
                    }, toDisplayString(i.name), 9, _hoisted_10$c),
                    createBaseVNode("span", _hoisted_11$b, toDisplayString(i.kind === "weapon" ? "клинок" : "материал"), 1)
                  ], 42, _hoisted_8$g)
                ], 8, _hoisted_7$h);
              }), 128))
            ])) : createCommentVNode("", true),
            createBaseVNode("p", _hoisted_12$b, [
              createTextVNode(toDisplayString(unref(hint)), 1),
              unref(found).length > SHOWN ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                createTextVNode(". В списке первые " + toDisplayString(SHOWN) + ", остальные подсвечены на странице")
              ], 64)) : createCommentVNode("", true)
            ])
          ])) : unref(filters).query ? (openBlock(), createElementBlock("p", _hoisted_13$a, [
            createTextVNode(toDisplayString(unref(hint)) + ". ", 1),
            createBaseVNode("button", {
              type: "button",
              class: "text-btn hint-clear",
              onClick: clear
            }, "Сбросить")
          ])) : createCommentVNode("", true)
        ], 32),
        createBaseVNode("nav", {
          ref_key: "nav",
          ref: nav,
          class: "nav",
          "aria-label": "Разделы"
        }, [
          (openBlock(), createElementBlock(Fragment, null, renderList(sections, ([id, title, count]) => {
            return createBaseVNode("a", {
              key: id,
              href: `#${id}`,
              class: normalizeClass({ on: current.value === id }),
              "aria-current": current.value === id ? "location" : void 0
            }, [
              createBaseVNode("span", null, toDisplayString(title), 1),
              count ? (openBlock(), createElementBlock("span", _hoisted_15$8, toDisplayString(count), 1)) : createCommentVNode("", true)
            ], 10, _hoisted_14$9);
          }), 64))
        ], 512),
        _cache[6] || (_cache[6] = createBaseVNode("p", { class: "side-foot" }, "Плагин для Paper 1.21.11. Модели — ресурспаки Fantasy Weapons (nongkos) и Blades of Majestica.", -1))
      ]);
    };
  }
};
const rarities = new Map(data.rarities.map((r) => [r.const, r]));
function rarityStyle(key) {
  const r = rarities.get(key);
  if (!r) return {};
  const pal = r.palette;
  const stops = [...pal, pal[0]];
  if (!r.period) return { backgroundImage: `linear-gradient(90deg, ${stops.join(", ")})` };
  return {
    backgroundImage: `linear-gradient(90deg, ${[...stops, ...pal.slice(1), pal[0]].join(", ")})`,
    backgroundSize: "200% 100%",
    animation: `shimmer ${(r.period / 20).toFixed(2)}s linear infinite`
  };
}
const _sfc_main$s = {
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
const _hoisted_1$o = { class: "tip" };
const _hoisted_2$l = ["innerHTML"];
const _hoisted_3$k = { class: "tlore" };
const _hoisted_4$j = {
  key: 0,
  class: "gap"
};
const _hoisted_5$i = ["innerHTML"];
const _hoisted_6$h = {
  key: 0,
  class: "tstats"
};
const _hoisted_7$g = { key: 0 };
const _hoisted_8$f = { class: "trar" };
const _sfc_main$r = {
  __name: "ItemTooltip",
  props: { item: { type: Object, required: true } },
  setup(__props) {
    const props = __props;
    const stats = computed(() => props.item.stats.split(/(\d+(?:\.\d+)?)/));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$o, [
        createBaseVNode("div", {
          class: "tname paint",
          style: normalizeStyle(unref(rarityStyle)(__props.item.rarity)),
          innerHTML: __props.item.name
        }, null, 12, _hoisted_2$l),
        createBaseVNode("div", _hoisted_3$k, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(__props.item.lore, (line, i) => {
            return openBlock(), createElementBlock(Fragment, { key: i }, [
              line === "" ? (openBlock(), createElementBlock("div", _hoisted_4$j)) : (openBlock(), createElementBlock("div", {
                key: 1,
                innerHTML: line
              }, null, 8, _hoisted_5$i))
            ], 64);
          }), 128))
        ]),
        __props.item.stats ? (openBlock(), createElementBlock("div", _hoisted_6$h, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(stats.value, (part, i) => {
            return openBlock(), createElementBlock(Fragment, { key: i }, [
              i % 2 ? (openBlock(), createElementBlock("b", _hoisted_7$g, toDisplayString(part), 1)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                createTextVNode(toDisplayString(part), 1)
              ], 64))
            ], 64);
          }), 128))
        ])) : createCommentVNode("", true),
        createBaseVNode("div", _hoisted_8$f, [
          _cache[0] || (_cache[0] = createTextVNode("Редкость: ", -1)),
          createVNode(_sfc_main$s, {
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
const _hoisted_1$n = { class: "hero-text" };
const _hoisted_2$k = { class: "facts" };
const _hoisted_3$j = { href: "#weapons" };
const _hoisted_4$i = { href: "#materials" };
const _hoisted_5$h = { href: "#blood" };
const _hoisted_6$g = { href: "#trophies" };
const _hoisted_7$f = { class: "stage" };
const _hoisted_8$e = {
  class: "held",
  "aria-hidden": "true"
};
const _hoisted_9$d = {
  class: "circle",
  viewBox: "-130 -130 260 260"
};
const _hoisted_10$b = { class: "circle-spin" };
const _hoisted_11$a = ["y2", "transform"];
const _hoisted_12$a = ["transform"];
const _hoisted_13$9 = ["x", "y"];
const _hoisted_14$8 = ["src"];
const _hoisted_15$7 = {
  class: "stage-tip",
  "aria-live": "polite"
};
const _hoisted_16$6 = { class: "hotbar-wrap" };
const _hoisted_17$6 = ["aria-label", "aria-pressed", "onClick"];
const _hoisted_18$5 = ["src"];
const _hoisted_19$5 = {
  class: "hkey",
  "aria-hidden": "true"
};
const SIZE = 320;
const _sfc_main$q = {
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
    const circleRunes = RUNE_CELLS.map((c, i) => ({ angle: i * 30, cells: c }));
    const ticks = Array.from({ length: 72 }, (_, i) => i * 5);
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
    let seen;
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
      seen = new IntersectionObserver(([e]) => {
        cancelAnimationFrame(raf);
        if (e.isIntersecting && !document.hidden) raf = requestAnimationFrame(frame);
      });
      seen.observe(hero.value);
    });
    onBeforeUnmount(() => {
      document.removeEventListener("keydown", onKey);
      cancelAnimationFrame(raf);
      seen == null ? void 0 : seen.disconnect();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("header", {
        id: "top",
        ref_key: "hero",
        ref: hero,
        class: "hero",
        style: normalizeStyle(aura.value)
      }, [
        createBaseVNode("div", _hoisted_1$n, [
          _cache[3] || (_cache[3] = createBaseVNode("p", { class: "hero-kicker" }, "Вики плагина VirusSwords для Paper 1.21.11", -1)),
          _cache[4] || (_cache[4] = createBaseVNode("h1", null, [
            createBaseVNode("span", { class: "h1-line" }, "Кодекс"),
            createTextVNode(),
            createBaseVNode("span", { class: "h1-line" }, "VirusSwords")
          ], -1)),
          _cache[5] || (_cache[5] = createBaseVNode("p", { class: "lead" }, "Клинки находят в мире, куют из душ и доводят до последней формы у алтарей святилищ. Здесь — что умеет каждый клинок, откуда он берётся, как растёт и кто стережёт святилища.", -1)),
          createBaseVNode("ul", _hoisted_2$k, [
            createBaseVNode("li", null, [
              createBaseVNode("a", _hoisted_3$j, [
                createBaseVNode("b", null, toDisplayString(unref(data).counts.weapons), 1),
                createTextVNode(toDisplayString(unref(data).words.weapons), 1)
              ])
            ]),
            createBaseVNode("li", null, [
              createBaseVNode("a", _hoisted_4$i, [
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
              createBaseVNode("a", _hoisted_5$h, [
                createBaseVNode("b", null, toDisplayString(unref(data).blood.length), 1),
                _cache[1] || (_cache[1] = createTextVNode("родословных", -1))
              ])
            ]),
            createBaseVNode("li", null, [
              createBaseVNode("a", _hoisted_6$g, [
                createBaseVNode("b", null, toDisplayString(unref(data).counts.trophies), 1),
                createTextVNode(toDisplayString(unref(data).words.trophies), 1)
              ])
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_7$f, [
          createBaseVNode("div", _hoisted_8$e, [
            _cache[11] || (_cache[11] = createBaseVNode("span", { class: "beam" }, null, -1)),
            (openBlock(), createElementBlock("svg", _hoisted_9$d, [
              createBaseVNode("g", _hoisted_10$b, [
                _cache[6] || (_cache[6] = createBaseVNode("circle", {
                  r: "124",
                  class: "ring"
                }, null, -1)),
                _cache[7] || (_cache[7] = createBaseVNode("circle", {
                  r: "116",
                  class: "ring thin"
                }, null, -1)),
                _cache[8] || (_cache[8] = createBaseVNode("circle", {
                  r: "90",
                  class: "ring"
                }, null, -1)),
                _cache[9] || (_cache[9] = createBaseVNode("circle", {
                  r: "62",
                  class: "ring thin dashed"
                }, null, -1)),
                (openBlock(true), createElementBlock(Fragment, null, renderList(unref(ticks), (t) => {
                  return openBlock(), createElementBlock("line", {
                    key: t,
                    class: "tick",
                    x1: "0",
                    y1: "-124",
                    x2: "0",
                    y2: t % 30 === 0 ? -130 : -127,
                    transform: `rotate(${t})`
                  }, null, 8, _hoisted_11$a);
                }), 128)),
                (openBlock(true), createElementBlock(Fragment, null, renderList(unref(circleRunes), (r) => {
                  return openBlock(), createElementBlock("g", {
                    key: r.angle,
                    transform: `rotate(${r.angle}) translate(0 -103)`
                  }, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(r.cells, ([x, y], k) => {
                      return openBlock(), createElementBlock("rect", {
                        key: k,
                        class: "rune",
                        x: x * 3 - 7.5,
                        y: y * 3 - 10.5,
                        width: "3",
                        height: "3"
                      }, null, 8, _hoisted_13$9);
                    }), 128))
                  ], 8, _hoisted_12$a);
                }), 128)),
                _cache[10] || (_cache[10] = createBaseVNode("path", {
                  class: "star",
                  d: "M0 -88 L22 -22 L88 0 L22 22 L0 88 L-22 22 L-88 0 L-22 -22 Z"
                }, null, -1))
              ])
            ])),
            createBaseVNode("canvas", {
              ref_key: "sparks",
              ref: sparks,
              class: "sparks"
            }, null, 512),
            (openBlock(), createElementBlock("span", {
              key: held.value.id,
              class: "held-item glint",
              style: normalizeStyle({ "--mask": `url(${held.value.icon})` })
            }, [
              createBaseVNode("img", {
                src: held.value.icon,
                alt: ""
              }, null, 8, _hoisted_14$8)
            ], 4))
          ]),
          createBaseVNode("div", _hoisted_15$7, [
            createVNode(_sfc_main$r, { item: held.value }, null, 8, ["item"]),
            createBaseVNode("button", {
              type: "button",
              class: "text-btn",
              onClick: _cache[0] || (_cache[0] = ($event) => unref(openItem)(held.value.id))
            }, "Открыть карточку клинка")
          ])
        ]),
        createBaseVNode("div", _hoisted_16$6, [
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
                }, null, 8, _hoisted_18$5),
                createBaseVNode("span", _hoisted_19$5, toDisplayString(i + 1), 1)
              ], 10, _hoisted_17$6);
            }), 128))
          ], 32),
          _cache[12] || (_cache[12] = createBaseVNode("p", { class: "hotbar-note" }, "Клавиши 1–9 или колесо мыши выбирают клинок, повторный клик открывает его карточку.", -1))
        ])
      ], 4);
    };
  }
};
const _hoisted_1$m = ["aria-label"];
const _hoisted_2$j = { class: "craft-table" };
const _hoisted_3$i = { class: "craft-grid" };
const _hoisted_4$h = ["href", "title"];
const _hoisted_5$g = ["src", "alt"];
const _hoisted_6$f = ["title"];
const _hoisted_7$e = ["src", "alt"];
const _hoisted_8$d = {
  key: 2,
  class: "cslot"
};
const _hoisted_9$c = ["title"];
const _hoisted_10$a = ["src", "alt"];
const _hoisted_11$9 = { key: 0 };
const _hoisted_12$9 = ["href"];
const _hoisted_13$8 = {
  key: 0,
  class: "note"
};
const _sfc_main$p = {
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
        createBaseVNode("div", _hoisted_2$j, [
          createBaseVNode("div", _hoisted_3$i, [
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
                  }, null, 8, _hoisted_5$g)
                ], 10, _hoisted_4$h)) : c ? (openBlock(), createElementBlock("span", {
                  key: 1,
                  class: "cslot",
                  title: c.name
                }, [
                  createBaseVNode("img", {
                    src: c.icon,
                    alt: c.name
                  }, null, 8, _hoisted_7$e)
                ], 8, _hoisted_6$f)) : (openBlock(), createElementBlock("span", _hoisted_8$d))
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
            }, null, 8, _hoisted_10$a)
          ], 8, _hoisted_9$c)
        ]),
        !__props.small ? (openBlock(), createElementBlock("figcaption", _hoisted_11$9, [
          createBaseVNode("b", null, [
            ((_e = result.value) == null ? void 0 : _e.ours) ? (openBlock(), createElementBlock("a", {
              key: 0,
              href: result.value.href
            }, toDisplayString(result.value.name), 9, _hoisted_12$9)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
              createTextVNode(toDisplayString((_f = result.value) == null ? void 0 : _f.name), 1)
            ], 64))
          ]),
          __props.recipe.note ? (openBlock(), createElementBlock("span", _hoisted_13$8, toDisplayString(__props.recipe.note), 1)) : createCommentVNode("", true)
        ])) : createCommentVNode("", true)
      ], 10, _hoisted_1$m);
    };
  }
};
const _hoisted_1$l = { class: "abilities" };
const _hoisted_2$i = { class: "chips" };
const _hoisted_3$h = {
  key: 0,
  class: "chip"
};
const _hoisted_4$g = {
  viewBox: "0 0 16 16",
  "aria-hidden": "true"
};
const _hoisted_5$f = {
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
const _hoisted_6$e = ["d", "fill", "stroke-width"];
const _hoisted_7$d = {
  key: 1,
  class: "chip rest"
};
const _hoisted_8$c = ["innerHTML"];
const _sfc_main$o = {
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
      return openBlock(), createElementBlock("div", _hoisted_1$l, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(__props.abilities, (a) => {
          return openBlock(), createElementBlock("article", {
            key: a.name,
            class: "ability",
            style: normalizeStyle({ "--c": a.colour })
          }, [
            createBaseVNode("header", null, [
              createBaseVNode("h4", null, toDisplayString(a.name), 1),
              createBaseVNode("div", _hoisted_2$i, [
                a.trigger ? (openBlock(), createElementBlock("span", _hoisted_3$h, [
                  (openBlock(), createElementBlock("svg", _hoisted_4$g, [
                    mouse(a.kind) ? (openBlock(), createElementBlock("rect", _hoisted_5$f)) : createCommentVNode("", true),
                    createBaseVNode("path", {
                      d: ICONS[a.kind],
                      fill: a.kind === "hit" || a.kind === "other" ? "none" : "currentColor",
                      stroke: "currentColor",
                      "stroke-width": a.kind === "hit" || a.kind === "other" || a.kind === "hold" ? 1.4 : 0,
                      "stroke-linecap": "round"
                    }, null, 8, _hoisted_6$e)
                  ])),
                  createTextVNode(toDisplayString(a.trigger), 1)
                ])) : createCommentVNode("", true),
                a.rest ? (openBlock(), createElementBlock("span", _hoisted_7$d, [
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
            }, null, 8, _hoisted_8$c)) : createCommentVNode("", true)
          ], 4);
        }), 128))
      ]);
    };
  }
};
const _hoisted_1$k = ["id", "href", "title", "aria-label"];
const _hoisted_2$h = { class: "islot-cell" };
const _hoisted_3$g = ["src"];
const _hoisted_4$f = {
  key: 0,
  class: "islot-name"
};
const _sfc_main$n = {
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
        createBaseVNode("span", _hoisted_2$h, [
          createBaseVNode("img", {
            src: __props.item.icon,
            alt: "",
            loading: "lazy"
          }, null, 8, _hoisted_3$g)
        ]),
        __props.named ? (openBlock(), createElementBlock("span", _hoisted_4$f, toDisplayString(__props.item.name), 1)) : createCommentVNode("", true)
      ], 14, _hoisted_1$k);
    };
  }
};
const _hoisted_1$j = ["aria-label"];
const _hoisted_2$g = {
  key: 0,
  class: "price-title"
};
const _hoisted_3$f = ["href"];
const _hoisted_4$e = { class: "price-head" };
const _hoisted_5$e = { class: "price-when" };
const _hoisted_6$d = {
  class: "price-row",
  "aria-hidden": "true"
};
const _hoisted_7$c = ["href", "title"];
const _hoisted_8$b = ["src"];
const _hoisted_9$b = ["src"];
const _hoisted_10$9 = {
  key: 0,
  class: "pcount"
};
const _hoisted_11$8 = ["title"];
const _hoisted_12$8 = ["src"];
const _hoisted_13$7 = { class: "price-words" };
const _hoisted_14$7 = {
  key: 1,
  class: "price-owner"
};
const _sfc_main$m = {
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
        __props.boxed ? (openBlock(), createElementBlock("figcaption", _hoisted_2$g, [
          createBaseVNode("a", {
            href: result.value.href
          }, toDisplayString(result.value.name), 9, _hoisted_3$f)
        ])) : createCommentVNode("", true),
        createBaseVNode("p", _hoisted_4$e, [
          createBaseVNode("b", null, toDisplayString(verb.value), 1),
          createTextVNode(" — " + toDisplayString(__props.entry.at), 1),
          when.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
            _cache[0] || (_cache[0] = createTextVNode(". ", -1)),
            createBaseVNode("span", _hoisted_5$e, toDisplayString(when.value), 1)
          ], 64)) : createCommentVNode("", true)
        ]),
        createBaseVNode("div", _hoisted_6$d, [
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
              }, null, 8, _hoisted_8$b)
            ], 8, _hoisted_7$c),
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
                }, null, 8, _hoisted_9$b),
                c.n > 1 ? (openBlock(), createElementBlock("span", _hoisted_10$9, toDisplayString(c.n), 1)) : createCommentVNode("", true)
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
            }, null, 8, _hoisted_12$8)
          ], 8, _hoisted_11$8)
        ]),
        createBaseVNode("p", _hoisted_13$7, toDisplayString(spoken.value), 1),
        __props.boxed && owner.value ? (openBlock(), createElementBlock("p", _hoisted_14$7, "Признаёт: " + toDisplayString(owner.value), 1)) : createCommentVNode("", true)
      ], 10, _hoisted_1$j);
    };
  }
};
const _sfc_main$l = {
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
const _hoisted_1$i = { class: "card-top" };
const _hoisted_2$f = { class: "card-relic" };
const _hoisted_3$e = ["src"];
const _hoisted_4$d = {
  key: 0,
  class: "statbars"
};
const _hoisted_5$d = { class: "statbar-label" };
const _hoisted_6$c = {
  class: "statbar-track",
  "aria-hidden": "true"
};
const _hoisted_7$b = { class: "statbar-value" };
const _hoisted_8$a = {
  key: 1,
  class: "card-owner"
};
const _hoisted_9$a = { class: "obtain" };
const _hoisted_10$8 = { class: "obtain-head" };
const _hoisted_11$7 = ["href"];
const _hoisted_12$7 = ["innerHTML"];
const _hoisted_13$6 = ["innerHTML"];
const _hoisted_14$6 = {
  key: 3,
  class: "card-chain"
};
const _hoisted_15$6 = { class: "chain-row" };
const _hoisted_16$5 = ["data-key"];
const _hoisted_17$5 = { class: "chain-row" };
const _hoisted_18$4 = {
  key: 0,
  class: "energy",
  "aria-hidden": "true"
};
const _hoisted_19$4 = {
  key: 1,
  class: "arrow",
  "aria-hidden": "true"
};
const _sfc_main$k = {
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
        createBaseVNode("div", _hoisted_1$i, [
          createBaseVNode("span", _hoisted_2$f, [
            _cache[0] || (_cache[0] = createBaseVNode("span", {
              class: "card-halo",
              "aria-hidden": "true"
            }, null, -1)),
            createBaseVNode("span", {
              class: "glint card-pic",
              style: normalizeStyle({ "--mask": `url(${__props.item.icon})` })
            }, [
              createBaseVNode("img", {
                src: __props.item.icon,
                alt: ""
              }, null, 8, _hoisted_3$e)
            ], 4)
          ]),
          createVNode(_sfc_main$r, { item: __props.item }, null, 8, ["item"])
        ]),
        bars.value.length ? (openBlock(), createElementBlock("div", _hoisted_4$d, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(bars.value, (b) => {
            return openBlock(), createElementBlock("div", {
              key: b.label,
              class: "statbar"
            }, [
              createBaseVNode("span", _hoisted_5$d, toDisplayString(b.label), 1),
              createBaseVNode("span", _hoisted_6$c, [
                createBaseVNode("span", {
                  class: "statbar-fill",
                  style: normalizeStyle({ width: `${Math.round(b.share * 100)}%` })
                }, null, 4)
              ]),
              createBaseVNode("b", _hoisted_7$b, toDisplayString(b.value), 1)
            ]);
          }), 128))
        ])) : createCommentVNode("", true),
        owner.value ? (openBlock(), createElementBlock("p", _hoisted_8$a, [
          owner.value.title ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
            createVNode(_sfc_main$l, {
              colour: owner.value.colour
            }, null, 8, ["colour"]),
            _cache[1] || (_cache[1] = createTextVNode("Признаёт только: ", -1)),
            createBaseVNode("b", null, toDisplayString(owner.value.title), 1),
            owner.value.form > 1 ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
              createTextVNode(", с " + toDisplayString(owner.value.form) + "-й формы", 1)
            ], 64)) : createCommentVNode("", true)
          ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
            createTextVNode("Служит любой крови.")
          ], 64))
        ])) : createCommentVNode("", true),
        __props.item.abilities && __props.item.abilities.length ? (openBlock(), createBlock(_sfc_main$o, {
          key: 2,
          abilities: __props.item.abilities
        }, null, 8, ["abilities"])) : createCommentVNode("", true),
        createBaseVNode("div", _hoisted_9$a, [
          createBaseVNode("div", _hoisted_10$8, [
            _cache[2] || (_cache[2] = createBaseVNode("h3", null, "Как получить", -1)),
            createBaseVNode("a", {
              class: normalizeClass(["mbadge", `m-${__props.item.method}`]),
              href: recipe.value ? "#craft" : "#craft-other"
            }, toDisplayString(__props.item.methodLabel), 11, _hoisted_11$7)
          ]),
          recipe.value ? (openBlock(), createBlock(_sfc_main$p, {
            key: 0,
            recipe: recipe.value,
            small: ""
          }, null, 8, ["recipe"])) : createCommentVNode("", true),
          (openBlock(true), createElementBlock(Fragment, null, renderList(altars.value, (a, i) => {
            return openBlock(), createBlock(_sfc_main$m, {
              key: i,
              entry: a
            }, null, 8, ["entry"]);
          }), 128)),
          createBaseVNode("p", {
            class: normalizeClass(["obtain-text", { muted: altars.value.length }]),
            innerHTML: recipe.value ? recipe.value.note : __props.item.obtain
          }, null, 10, _hoisted_12$7),
          recipe.value && __props.item.obtain.includes(" или ") ? (openBlock(), createElementBlock("p", {
            key: 1,
            class: "obtain-text muted",
            innerHTML: __props.item.obtain
          }, null, 8, _hoisted_13$6)) : createCommentVNode("", true)
        ]),
        usedIn.value.length ? (openBlock(), createElementBlock("div", _hoisted_14$6, [
          _cache[3] || (_cache[3] = createBaseVNode("h3", null, "Нужен для", -1)),
          createBaseVNode("div", _hoisted_15$6, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(usedIn.value, (u) => {
              return openBlock(), createBlock(_sfc_main$n, {
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
            createBaseVNode("div", _hoisted_17$5, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(c.entries, (e, i) => {
                return openBlock(), createElementBlock(Fragment, { key: i }, [
                  e.sep === "→" ? (openBlock(), createElementBlock("span", _hoisted_18$4)) : e.sep ? (openBlock(), createElementBlock("span", _hoisted_19$4, toDisplayString(e.sep), 1)) : createCommentVNode("", true),
                  createVNode(_sfc_main$n, {
                    item: unref(item)(e.id)
                  }, null, 8, ["item"])
                ], 64);
              }), 128))
            ])
          ], 8, _hoisted_16$5);
        }), 128))
      ], 4);
    };
  }
};
const _hoisted_1$h = {
  key: 0,
  class: "inspect-wrap"
};
const _hoisted_2$e = ["aria-label"];
const _hoisted_3$d = {
  class: "inspect-steps",
  "aria-label": "Соседние предметы"
};
const _hoisted_4$c = { class: "step-name" };
const _hoisted_5$c = ["src"];
const _hoisted_6$b = { class: "step-name" };
const _hoisted_7$a = ["src"];
const _hoisted_8$9 = { class: "inspect-foot" };
const _hoisted_9$9 = {
  class: "copied",
  "aria-live": "polite"
};
const _sfc_main$j = {
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
          current.value ? (openBlock(), createElementBlock("div", _hoisted_1$h, [
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
              (openBlock(), createBlock(_sfc_main$k, {
                key: current.value.id,
                item: current.value
              }, null, 8, ["item"])),
              createBaseVNode("nav", _hoisted_3$d, [
                prev.value ? (openBlock(), createElementBlock("button", {
                  key: 0,
                  type: "button",
                  class: "step-btn",
                  onClick: _cache[2] || (_cache[2] = ($event) => unref(openItem)(prev.value.id))
                }, [
                  _cache[5] || (_cache[5] = createBaseVNode("span", { class: "step-dir" }, "← Предыдущий", -1)),
                  createBaseVNode("span", _hoisted_4$c, [
                    createBaseVNode("img", {
                      src: prev.value.icon,
                      alt: ""
                    }, null, 8, _hoisted_5$c),
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
                  createBaseVNode("span", _hoisted_6$b, [
                    createBaseVNode("img", {
                      src: next.value.icon,
                      alt: ""
                    }, null, 8, _hoisted_7$a),
                    createTextVNode(toDisplayString(next.value.name), 1)
                  ])
                ])) : createCommentVNode("", true)
              ]),
              createBaseVNode("div", _hoisted_8$9, [
                createBaseVNode("button", {
                  type: "button",
                  class: "text-btn",
                  onClick: copyLink
                }, "Ссылка на карточку"),
                createBaseVNode("span", _hoisted_9$9, toDisplayString(copied.value), 1)
              ]),
              _cache[7] || (_cache[7] = createBaseVNode("p", { class: "inspect-keys" }, "Стрелки ← → листают карточки, Esc закрывает.", -1))
            ], 8, _hoisted_2$e)
          ])) : createCommentVNode("", true)
        ]),
        _: 1
      });
    };
  }
};
const _sfc_main$i = {
  __name: "Atmosphere",
  setup(__props) {
    const WORLDS = {
      top: "hero",
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
    const seen = /* @__PURE__ */ new Map();
    function pickWorld() {
      let best = null, bestHeight = Infinity;
      for (const [id, on] of seen) {
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
    function spawn(w, h, anywhere) {
      const rune = Math.random() < 0.38;
      return {
        x: Math.random() * w,
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
        ctx.globalAlpha = Math.max(0, fade) * (m.rune ? 0.32 : 0.55);
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
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting));
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
const _hoisted_1$g = {
  class: "xp",
  "aria-hidden": "true"
};
const _sfc_main$h = {
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
      return openBlock(), createElementBlock("div", _hoisted_1$g, [
        createBaseVNode("span", {
          class: "xp-fill",
          style: normalizeStyle({ transform: `scaleX(${filled.value})` })
        }, null, 4)
      ]);
    };
  }
};
const _sfc_main$g = {
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
        createVNode(_sfc_main$r, { item: current.value }, null, 8, ["item"])
      ], 4)) : createCommentVNode("", true);
    };
  }
};
const _hoisted_1$f = { class: "sec-head" };
const _hoisted_2$d = {
  class: "sec-rune",
  viewBox: "0 0 5 7",
  "aria-hidden": "true"
};
const _hoisted_3$c = ["x", "y"];
const _hoisted_4$b = { class: "sec-title" };
const _hoisted_5$b = {
  key: 0,
  class: "emblem",
  "aria-hidden": "true"
};
const _hoisted_6$a = ["src"];
const _sfc_main$f = {
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
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$f, [
        (openBlock(), createElementBlock("svg", _hoisted_2$d, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(rune.value, ([x, y], i) => {
            return openBlock(), createElementBlock("rect", {
              key: i,
              x,
              y,
              width: "1",
              height: "1"
            }, null, 8, _hoisted_3$c);
          }), 128))
        ])),
        createBaseVNode("div", _hoisted_4$b, [
          src.value ? (openBlock(), createElementBlock("span", _hoisted_5$b, [
            createBaseVNode("img", {
              src: src.value,
              alt: ""
            }, null, 8, _hoisted_6$a)
          ])) : createCommentVNode("", true),
          createBaseVNode("h2", null, toDisplayString(__props.title), 1),
          _cache[0] || (_cache[0] = createBaseVNode("span", {
            class: "sec-rule",
            "aria-hidden": "true"
          }, null, -1))
        ]),
        renderSlot(_ctx.$slots, "default")
      ]);
    };
  }
};
const _hoisted_1$e = { id: "start" };
const _sfc_main$e = {
  __name: "StartSection",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$e, [
        createVNode(_sfc_main$f, {
          title: "С чего начать",
          icon: "terra_compass"
        }),
        _cache[0] || (_cache[0] = createStaticVNode('<ol class="steps"><li><h4>Выберите кровь</h4><p>При первом входе откроется выбор родословной. От неё зависят ваша сила, книга, которую вы получите, и то, какие величайшие клинки вас признают.</p></li><li><h4>Выберите путеводителя</h4><p>Следом — чей голос будет с вами: Путеводитель с загадками, ZorahM-GPT, разум Древней фабрики, или Наблюдатель, помнящий Все-Чёрного с первого удара.</p></li><li><h4>Найдите первый клинок</h4><p>Погибель и Резак лежат в сундуках древнего города, Арахнид — в вагонетках заброшенных шахт, Сумрачная секира — в крепостях Незера.</p></li><li><h4>Добудьте Душу демона</h4><p>Она лежит в сокровищнице бастиона. Клинок плюс Душа на верстаке — и он становится адским.</p></li><li><h4>Растите мастерство</h4><p>Клинок учится от каждого удара. Мастерство открывает заточку и пробуждение; эволюция просит только материалы.</p></li><li><h4>Найдите святилище</h4><p>Дорогу к святилищам покажут компасы и карты. Пробейтесь через стражу — и алтарь откроет испытания.</p></li><li><h4>Куйте последнюю форму</h4><p>Высшие клинки — Все-Чёрный, Люцифер, Истинный Экскалибур и Селестиал — куют у алтарей святилищ. Корона отвечает только крови в четвёртой форме, а Все-Чёрный навсегда меняет кровь на бездну.</p></li></ol><p class="small muted">Сервер узнаёт о ваших делах: первый выкованный, улучшенный или собранный клинок, сломанная Печать ночи, вытянутая Луна и сработавшие Королевские часы объявляются в чате всем — имя клинка можно навести мышью и рассмотреть. Способности с долгой перезарядкой видят только игроки рядом.</p>', 2))
      ]);
    };
  }
};
const _hoisted_1$d = { id: "rarity" };
const _hoisted_2$c = { class: "rarities" };
const _hoisted_3$b = { class: "rhead" };
const _hoisted_4$a = ["href", "title"];
const _hoisted_5$a = ["src"];
const _hoisted_6$9 = { class: "rname" };
const _hoisted_7$9 = {
  class: "swatches",
  "aria-hidden": "true"
};
const _hoisted_8$8 = { class: "rmotion" };
const _hoisted_9$8 = { class: "rused" };
const _hoisted_10$7 = {
  key: 1,
  class: "muted"
};
const _sfc_main$d = {
  __name: "RaritySection",
  setup(__props) {
    const example = Object.fromEntries(data.rarities.map((r) => [r.const, data.items.find((i) => i.rarity === r.const)]));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$d, [
        createVNode(_sfc_main$f, {
          title: "Редкости",
          icon: "wanderer_cube"
        }, {
          default: withCtx(() => [..._cache[0] || (_cache[0] = [
            createBaseVNode("p", { class: "lead" }, "Имя предмета окрашено градиентом его редкости — так же, как в игре. Старшие редкости переливаются.", -1)
          ])]),
          _: 1
        }),
        createBaseVNode("ol", _hoisted_2$c, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(data).rarities, (r) => {
            return openBlock(), createElementBlock("li", {
              key: r.const,
              class: "rarity"
            }, [
              createBaseVNode("span", _hoisted_3$b, [
                unref(example)[r.const] ? (openBlock(), createElementBlock("a", {
                  key: 0,
                  class: "rex",
                  href: `#w-${unref(example)[r.const].id}`,
                  title: unref(example)[r.const].name
                }, [
                  createBaseVNode("img", {
                    src: unref(example)[r.const].icon,
                    alt: ""
                  }, null, 8, _hoisted_5$a)
                ], 8, _hoisted_4$a)) : createCommentVNode("", true),
                createBaseVNode("span", _hoisted_6$9, [
                  createVNode(_sfc_main$s, {
                    rarity: r.const
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(r.label), 1)
                    ]),
                    _: 2
                  }, 1032, ["rarity"])
                ])
              ]),
              createBaseVNode("span", _hoisted_7$9, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(r.palette, (c) => {
                  return openBlock(), createElementBlock("span", {
                    key: c,
                    class: "sw",
                    style: normalizeStyle({ background: c })
                  }, null, 4);
                }), 128))
              ]),
              createBaseVNode("span", _hoisted_8$8, toDisplayString(r.motion), 1),
              createBaseVNode("span", _hoisted_9$8, [
                r.used.length ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                  createTextVNode(toDisplayString(r.used.join(", ")), 1)
                ], 64)) : (openBlock(), createElementBlock("span", _hoisted_10$7, "пока ничем не окрашена"))
              ])
            ]);
          }), 128))
        ])
      ]);
    };
  }
};
const _hoisted_1$c = { id: "weapons" };
const _hoisted_2$b = { class: "weapon-bar" };
const _hoisted_3$a = {
  class: "filters",
  role: "group",
  "aria-label": "Фильтр по линии"
};
const _hoisted_4$9 = ["aria-pressed", "onClick"];
const _hoisted_5$9 = {
  class: "seg",
  role: "group",
  "aria-label": "Вид"
};
const _hoisted_6$8 = ["aria-pressed"];
const _hoisted_7$8 = ["aria-pressed"];
const _hoisted_8$7 = {
  key: 0,
  class: "tbl wtable"
};
const _hoisted_9$7 = ["aria-sort"];
const _hoisted_10$6 = { "aria-hidden": "true" };
const _hoisted_11$6 = ["aria-sort"];
const _hoisted_12$6 = { "aria-hidden": "true" };
const _hoisted_13$5 = ["aria-sort"];
const _hoisted_14$5 = { "aria-hidden": "true" };
const _hoisted_15$5 = ["aria-sort"];
const _hoisted_16$4 = { "aria-hidden": "true" };
const _hoisted_17$4 = { scope: "row" };
const _hoisted_18$3 = ["href"];
const _hoisted_19$3 = { class: "islot-cell sm" };
const _hoisted_20$3 = ["src"];
const _hoisted_21$3 = { class: "num" };
const _hoisted_22$2 = { class: "num" };
const _hoisted_23$2 = { class: "rname sm" };
const _hoisted_24$2 = {
  key: 1,
  class: "lines"
};
const _hoisted_25$2 = ["data-key"];
const _hoisted_26$2 = { class: "line-title" };
const _hoisted_27$1 = { class: "line-row" };
const _hoisted_28$1 = {
  key: 0,
  class: "energy",
  "aria-hidden": "true"
};
const _hoisted_29$1 = {
  key: 1,
  class: "arrow",
  "aria-hidden": "true"
};
const _hoisted_30$1 = {
  key: 2,
  class: "empty"
};
const VIEW_KEY = "codex-weapons-view";
const _sfc_main$c = {
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
      ["techno", "Техно"]
    ];
    const seen = /* @__PURE__ */ new Set();
    const chains = data.chains.map((chain) => ({
      ...chain,
      entries: chain.entries.map((e) => ({ ...e, item: item(e.id), anchor: !seen.has(e.id) && seen.add(e.id) }))
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
      return openBlock(), createElementBlock("section", _hoisted_1$c, [
        createVNode(_sfc_main$f, {
          title: "Оружие",
          icon: "all_black"
        }, {
          default: withCtx(() => [..._cache[6] || (_cache[6] = [
            createBaseVNode("p", { class: "lead" }, "Клинки выстроены в линии — от находки в мире до неломаемого оружия. Стрелка — эволюция у алтаря, «или» — развилка. Нажмите на клинок, чтобы открыть карточку.", -1)
          ])]),
          _: 1
        }),
        createBaseVNode("div", _hoisted_2$b, [
          createBaseVNode("div", _hoisted_3$a, [
            (openBlock(), createElementBlock(Fragment, null, renderList(lines, ([key, title]) => {
              return createBaseVNode("button", {
                key,
                type: "button",
                class: "chip",
                "aria-pressed": String(unref(filters).line === key),
                onClick: ($event) => unref(filters).line = key
              }, toDisplayString(title), 9, _hoisted_4$9);
            }), 64))
          ]),
          createBaseVNode("div", _hoisted_5$9, [
            createBaseVNode("button", {
              type: "button",
              "aria-pressed": String(view.value === "lines"),
              onClick: _cache[0] || (_cache[0] = ($event) => setView("lines"))
            }, "Линии", 8, _hoisted_6$8),
            createBaseVNode("button", {
              type: "button",
              "aria-pressed": String(view.value === "table"),
              onClick: _cache[1] || (_cache[1] = ($event) => setView("table"))
            }, "Таблица", 8, _hoisted_7$8)
          ])
        ]),
        view.value === "table" ? (openBlock(), createElementBlock("div", _hoisted_8$7, [
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
                    createBaseVNode("span", _hoisted_10$6, toDisplayString(mark("name")), 1)
                  ])
                ], 8, _hoisted_9$7),
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
                    createBaseVNode("span", _hoisted_12$6, toDisplayString(mark("damage")), 1)
                  ])
                ], 8, _hoisted_11$6),
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
                    createBaseVNode("span", _hoisted_14$5, toDisplayString(mark("speed")), 1)
                  ])
                ], 8, _hoisted_13$5),
                createBaseVNode("th", {
                  "aria-sort": ariaSort("rarity")
                }, [
                  createBaseVNode("button", {
                    type: "button",
                    class: "sort",
                    onClick: _cache[5] || (_cache[5] = ($event) => sortBy("rarity"))
                  }, [
                    _cache[10] || (_cache[10] = createTextVNode("Редкость ", -1)),
                    createBaseVNode("span", _hoisted_16$4, toDisplayString(mark("rarity")), 1)
                  ])
                ], 8, _hoisted_15$5),
                _cache[11] || (_cache[11] = createBaseVNode("th", null, "Как получить", -1))
              ])
            ]),
            createBaseVNode("tbody", null, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(sorted.value, (w) => {
                return openBlock(), createElementBlock("tr", {
                  key: w.id
                }, [
                  createBaseVNode("th", _hoisted_17$4, [
                    createBaseVNode("a", {
                      class: "wname",
                      href: `#w-${w.id}`
                    }, [
                      createBaseVNode("span", _hoisted_19$3, [
                        createBaseVNode("img", {
                          src: w.icon,
                          alt: ""
                        }, null, 8, _hoisted_20$3)
                      ]),
                      createTextVNode(toDisplayString(w.name), 1)
                    ], 8, _hoisted_18$3)
                  ]),
                  createBaseVNode("td", _hoisted_21$3, toDisplayString(w.damage), 1),
                  createBaseVNode("td", _hoisted_22$2, toDisplayString(w.speed), 1),
                  createBaseVNode("td", null, [
                    createBaseVNode("span", _hoisted_23$2, [
                      createVNode(_sfc_main$s, {
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
        ])) : (openBlock(), createElementBlock("div", _hoisted_24$2, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(visible.value, (chain) => {
            return openBlock(), createElementBlock("div", {
              key: chain.key,
              class: "line",
              "data-key": chain.key
            }, [
              createBaseVNode("h3", _hoisted_26$2, toDisplayString(chain.title), 1),
              createBaseVNode("div", _hoisted_27$1, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(chain.entries, (e, i) => {
                  return openBlock(), createElementBlock(Fragment, { key: i }, [
                    e.sep === "→" ? (openBlock(), createElementBlock("span", _hoisted_28$1)) : e.sep ? (openBlock(), createElementBlock("span", _hoisted_29$1, toDisplayString(e.sep), 1)) : createCommentVNode("", true),
                    createVNode(_sfc_main$n, {
                      item: e.item,
                      anchor: e.anchor,
                      named: "",
                      dim: !unref(shownIds).has(e.id)
                    }, null, 8, ["item", "anchor", "dim"])
                  ], 64);
                }), 128))
              ])
            ], 8, _hoisted_25$2);
          }), 128))
        ])),
        (view.value === "table" ? !sorted.value.length : !visible.value.length) ? (openBlock(), createElementBlock("p", _hoisted_30$1, "Ни одного клинка — попробуйте другое слово или линию «Все».")) : createCommentVNode("", true)
      ]);
    };
  }
};
const _hoisted_1$b = { id: "materials" };
const _hoisted_2$a = { class: "inventory" };
const _hoisted_3$9 = { class: "inv-title" };
const _hoisted_4$8 = { class: "inv-row" };
const _hoisted_5$8 = {
  key: 0,
  class: "empty"
};
const _sfc_main$b = {
  __name: "MaterialsSection",
  setup(__props) {
    const GROUPS = [
      ["Для крафта и эволюций", ["demon_soul", "wither_soul", "terra_ingot", "lord_soul"]],
      ["Валюта святилищ", ["soul_shard", "celestial_shard", "jungle_shard", "ancient_part"]],
      ["Реликвии стражей", ["forge_heart", "seraph_feather", "jungle_heart", "warden_heart", "harbinger_core", "royal_clock", "night_seal"]],
      ["Сущности", ["hell_essence", "terra_essence", "black_substance"]],
      ["Снаряжение крови", ["ash_box", "angel_box", "jungle_box", "tarot_hierophant", "tarot_justice", "tarot_moon", "terra_compass", "terra_magnet", "wanderer_cube"]],
      ["Машины фабрики", ["copper_automaton", "mini_harbinger", "assembly_dome"]]
    ];
    const placed = new Set(GROUPS.flatMap(([, ids]) => ids));
    const groups = computed(() => {
      const shown = new Map(materials.value.map((m) => [m.id, m]));
      const out = GROUPS.map(([title, ids]) => ({ title, items: ids.map((id) => shown.get(id)).filter(Boolean) }));
      out.push({ title: "Прочее", items: materials.value.filter((m) => !placed.has(m.id)) });
      return out.filter((g) => g.items.length);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$b, [
        createVNode(_sfc_main$f, {
          title: "Материалы",
          icon: "soul_shard"
        }, {
          default: withCtx(() => [..._cache[0] || (_cache[0] = [
            createBaseVNode("p", { class: "lead" }, "Душа демона и терра-слиток — для крафта. Осколки и детали — валюта святилищ, сердца, перо и ядро — реликвии их стражей. В обычные рецепты и торговлю материалы не уходят.", -1)
          ])]),
          _: 1
        }),
        createBaseVNode("div", _hoisted_2$a, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(groups.value, (g) => {
            return openBlock(), createElementBlock("div", {
              key: g.title,
              class: "inv-group"
            }, [
              createBaseVNode("h3", _hoisted_3$9, toDisplayString(g.title), 1),
              createBaseVNode("div", _hoisted_4$8, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(g.items, (m) => {
                  return openBlock(), createBlock(_sfc_main$n, {
                    key: m.id,
                    item: m,
                    anchor: "",
                    named: ""
                  }, null, 8, ["item"]);
                }), 128))
              ])
            ]);
          }), 128))
        ]),
        !unref(materials).length ? (openBlock(), createElementBlock("p", _hoisted_5$8, "Ни одного материала по этому слову.")) : createCommentVNode("", true)
      ]);
    };
  }
};
const _hoisted_1$a = { id: "craft" };
const _hoisted_2$9 = { class: "lead" };
const _hoisted_3$8 = { class: "crafts" };
const _hoisted_4$7 = { class: "methods" };
const _hoisted_5$7 = { class: "muted small" };
const _hoisted_6$7 = { class: "small" };
const _hoisted_7$7 = { class: "mitems" };
const _hoisted_8$6 = ["href", "title"];
const _hoisted_9$6 = ["src"];
const _sfc_main$a = {
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
      return openBlock(), createElementBlock("section", _hoisted_1$a, [
        createVNode(_sfc_main$f, {
          title: "Крафт",
          icon: "terra_ingot"
        }, {
          default: withCtx(() => [
            createBaseVNode("p", _hoisted_2$9, "На верстаке делается " + toDisplayString(unref(data).recipes.length) + " вещей. Остальное куют у алтарей святилищ или находят.", 1)
          ]),
          _: 1
        }),
        createBaseVNode("div", _hoisted_3$8, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(data).recipes, (r) => {
            return openBlock(), createBlock(_sfc_main$p, {
              key: r.result,
              recipe: r
            }, null, 8, ["recipe"]);
          }), 128))
        ]),
        _cache[0] || (_cache[0] = createBaseVNode("div", { class: "callout" }, [
          createBaseVNode("b", null, "Если результат не появляется"),
          createTextVNode(" — проверьте, что предметы плагина настоящие: обычный меч вместо Погибели рецепт не примет. ")
        ], -1)),
        _cache[1] || (_cache[1] = createBaseVNode("h3", { id: "craft-other" }, "Не на верстаке", -1)),
        createBaseVNode("div", _hoisted_4$7, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(groups.value, (g) => {
            return openBlock(), createElementBlock("article", {
              key: g.key,
              class: "method"
            }, [
              createBaseVNode("header", null, [
                createBaseVNode("span", {
                  class: normalizeClass(["mbadge", `m-${g.key}`])
                }, toDisplayString(g.label), 3),
                createBaseVNode("span", _hoisted_5$7, toDisplayString(g.items.length), 1)
              ]),
              createBaseVNode("p", _hoisted_6$7, toDisplayString(g.how), 1),
              createBaseVNode("div", _hoisted_7$7, [
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
                    }, null, 8, _hoisted_9$6),
                    createBaseVNode("span", null, toDisplayString(i.name), 1)
                  ], 8, _hoisted_8$6);
                }), 128))
              ])
            ]);
          }), 128))
        ])
      ]);
    };
  }
};
const _hoisted_1$9 = ["aria-label"];
const _hoisted_2$8 = { class: "mlabel" };
const _sfc_main$9 = {
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
            createBaseVNode("span", _hoisted_2$8, [
              createBaseVNode("b", null, toDisplayString(m.level), 1),
              createBaseVNode("span", null, toDisplayString(m.note || m.bonus), 1)
            ])
          ], 6);
        }), 128))
      ], 10, _hoisted_1$9);
    };
  }
};
const _hoisted_1$8 = { id: "growth" };
const _hoisted_2$7 = { class: "twocol" };
const _hoisted_3$7 = { class: "panel" };
const _hoisted_4$6 = { class: "tbl" };
const _hoisted_5$6 = { class: "num" };
const _hoisted_6$6 = { class: "num" };
const _hoisted_7$6 = { class: "prices" };
const _hoisted_8$5 = { class: "sets" };
const _hoisted_9$5 = { class: "set set-molten" };
const _hoisted_10$5 = { class: "slot" };
const _hoisted_11$5 = ["src"];
const _hoisted_12$5 = { class: "set set-paladin" };
const _hoisted_13$4 = { class: "slot" };
const _hoisted_14$4 = ["src"];
const _hoisted_15$4 = { class: "set set-nightking" };
const _hoisted_16$3 = { class: "slot" };
const _hoisted_17$3 = ["src"];
const _hoisted_18$2 = { class: "set set-terra" };
const _hoisted_19$2 = { class: "slot" };
const _hoisted_20$2 = ["src"];
const _hoisted_21$2 = { class: "set set-demon" };
const _hoisted_22$1 = { class: "slot" };
const _hoisted_23$1 = ["src"];
const _hoisted_24$1 = { class: "prices" };
const _hoisted_25$1 = { class: "prices" };
const _hoisted_26$1 = { class: "prices" };
const _sfc_main$8 = {
  __name: "GrowthSection",
  setup(__props) {
    const blades = new Set(data.items.filter((i) => i.kind === "weapon").map((i) => i.id));
    const evolutions = data.altar.filter((a) => a.kind === "evolve" && a.result !== "all_black");
    const forgedAt = (at) => data.altar.filter((a) => a.kind === "forge" && a.at === at && blades.has(a.result));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$8, [
        createVNode(_sfc_main$f, {
          title: "Рост клинка",
          icon: "forge_heart"
        }, {
          default: withCtx(() => [..._cache[0] || (_cache[0] = [
            createBaseVNode("p", { class: "lead" }, "У каждого клинка три дорожки роста; всё записано на самом клинке.", -1)
          ])]),
          _: 1
        }),
        createBaseVNode("div", _hoisted_2$7, [
          createBaseVNode("div", _hoisted_3$7, [
            _cache[2] || (_cache[2] = createBaseVNode("h3", null, "Мастерство 0–100", -1)),
            _cache[3] || (_cache[3] = createBaseVNode("p", { class: "small" }, "Клинок учится от нанесённого урона. Каждый уровень даёт +0,1% урона.", -1)),
            createVNode(_sfc_main$9),
            createBaseVNode("div", _hoisted_4$6, [
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
                      createBaseVNode("td", _hoisted_5$6, toDisplayString(row.total), 1),
                      createBaseVNode("td", _hoisted_6$6, toDisplayString(row.bonus), 1),
                      createBaseVNode("td", null, toDisplayString(row.note), 1)
                    ]);
                  }), 128))
                ])
              ])
            ])
          ]),
          _cache[4] || (_cache[4] = createStaticVNode('<div class="panel"><h3>Заточка <span class="stars">★★★★★</span></h3><p class="small">Каждая звезда +4% урона.</p><div class="tbl"><table><thead><tr><th>Звезда</th><th class="num">Мастерство</th><th class="num">Осколки</th><th class="num">Катализатор</th><th>Реликвия</th></tr></thead><tbody><tr><td class="stars">★</td><td class="num">15</td><td class="num">8</td><td class="num">1</td><td>—</td></tr><tr><td class="stars">★★</td><td class="num">30</td><td class="num">16</td><td class="num">2</td><td>—</td></tr><tr><td class="stars">★★★</td><td class="num">45</td><td class="num">24</td><td class="num">3</td><td>—</td></tr><tr><td class="stars">★★★★</td><td class="num">60</td><td class="num">32</td><td class="num">4</td><td>1</td></tr><tr><td class="stars">★★★★★</td><td class="num">75</td><td class="num">40</td><td class="num">5</td><td>1</td></tr></tbody></table></div><p class="small muted">Катализатор: незеритовый лом в кузне, осколки аметиста в храме. Небесные клинки точат в Небесном храме, остальные — в Незеритовой кузне.</p></div><div class="panel"><h3>Пробуждение</h3><p class="small">Один раз за жизнь клинка: нужны заточка ★3, мастерство 50, осколки и реликвия стража.</p><p class="small">Перезарядка способности короче на четверть, урон +5%.</p></div>', 2))
        ]),
        _cache[10] || (_cache[10] = createBaseVNode("h3", null, "Эволюции у алтарей", -1)),
        createBaseVNode("div", _hoisted_7$6, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(evolutions), (e, i) => {
            return openBlock(), createBlock(_sfc_main$m, {
              key: i,
              entry: e,
              boxed: ""
            }, null, 8, ["entry"]);
          }), 128))
        ]),
        _cache[11] || (_cache[11] = createStaticVNode('<p class="small"><a href="#w-all_black">Все-Чёрный</a> — эволюция короны своей крови за Чёрную субстанцию у алтаря своего храма; храм за это гневается.</p><p class="small">Сумрачная секира меняется сама: в испытании кузни она становится <b>Секирой берсерка</b>, в испытании Небесного храма — <b>Золотым фениксом</b>.</p><p class="small muted">Эволюция просит только материалы. Чары, заточка и пробуждение переходят на новую форму, мастерство начинается с нуля.</p><h3>Доспехи</h3><p>Кнопка в правом нижнем углу алтаря открывает экран доспехов. Защиту даёт каждая часть, а <b>бонус</b> — только когда надеты все четыре (у Демонического — уже от двух).</p>', 5)),
        createBaseVNode("div", _hoisted_8$5, [
          createBaseVNode("article", _hoisted_9$5, [
            createBaseVNode("span", _hoisted_10$5, [
              createBaseVNode("img", {
                src: unref(data).icons.molten_helmet,
                alt: ""
              }, null, 8, _hoisted_11$5)
            ]),
            _cache[5] || (_cache[5] = createBaseVNode("div", { class: "set-body" }, [
              createBaseVNode("h4", null, "Расплавленный доспех"),
              createBaseVNode("p", { class: "set-where" }, "Кузня, после третьего испытания: 64 осколка души, незеритовая часть брони и Душа лорда за каждую часть"),
              createBaseVNode("p", { class: "set-bonus" }, "Двойной прыжок в воздухе. Погибель, Бедствие, Воля Демона и Империум бьют на 25% сильнее.")
            ], -1))
          ]),
          createBaseVNode("article", _hoisted_12$5, [
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
              createBaseVNode("p", { class: "set-where" }, "Храм джунглей, после того как принесли ему Терра-сущность: 64 реликтовых осколка и Терра-слитки за часть"),
              createBaseVNode("p", { class: "set-bonus" }, "+4 сердца. Никакие вредные эффекты не действуют: яд, слабость, замедление и другие.")
            ], -1))
          ]),
          createBaseVNode("article", _hoisted_21$2, [
            createBaseVNode("span", _hoisted_22$1, [
              createBaseVNode("img", {
                src: unref(data).icons.demon_helmet,
                alt: ""
              }, null, 8, _hoisted_23$1)
            ]),
            _cache[9] || (_cache[9] = createBaseVNode("div", { class: "set-body" }, [
              createBaseVNode("h4", null, "Демонический доспех"),
              createBaseVNode("p", { class: "set-where" }, "???"),
              createBaseVNode("p", { class: "set-bonus" }, [
                createBaseVNode("b", null, "Адская ярость"),
                createTextVNode(" (от двух частей). Бейте врагов в ближнем бою — копятся заряды, до 10. Каждый заряд делает удар сильнее на 10% и чуть длиннее, а иногда удар повторяется. На 10 зарядах удар рассекает всех врагов на линии. Перестали бить — заряды тают.")
              ])
            ], -1))
          ])
        ]),
        _cache[12] || (_cache[12] = createBaseVNode("p", { class: "small" }, "Душа лорда остаётся там, где пало Горнило третьего испытания кузни, — одна за победу.", -1)),
        _cache[13] || (_cache[13] = createBaseVNode("h3", null, "Небесная ковка", -1)),
        _cache[14] || (_cache[14] = createBaseVNode("p", null, "Небесные клинки куют у алтаря Небесного храма: небесные осколки, Перо серафима и свой взнос. Золотой феникс вырастает из Сумрачной секиры, Призрачный страж лежит в сокровищнице Проклятого замка, Солнцестояние — в сокровищницах бастионов.", -1)),
        createBaseVNode("div", _hoisted_24$1, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(forgedAt("Небесный храм"), (e, i) => {
            return openBlock(), createBlock(_sfc_main$m, {
              key: i,
              entry: e,
              boxed: ""
            }, null, 8, ["entry"]);
          }), 128))
        ]),
        _cache[15] || (_cache[15] = createBaseVNode("h3", null, "Ночная ковка", -1)),
        _cache[16] || (_cache[16] = createBaseVNode("p", null, [
          createTextVNode("Синие клинки куют в "),
          createBaseVNode("b", null, "Тёмном храме"),
          createTextVNode("; они признают только ночную небесную кровь.")
        ], -1)),
        createBaseVNode("div", _hoisted_25$1, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(forgedAt("Тёмный храм"), (e, i) => {
            return openBlock(), createBlock(_sfc_main$m, {
              key: i,
              entry: e,
              boxed: ""
            }, null, 8, ["entry"]);
          }), 128))
        ]),
        _cache[17] || (_cache[17] = createBaseVNode("h3", null, "Ковка в джунглях", -1)),
        _cache[18] || (_cache[18] = createBaseVNode("p", null, "Эти клинки куёт алтарь Храма джунглей.", -1)),
        createBaseVNode("div", _hoisted_26$1, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(forgedAt("Храм джунглей"), (e, i) => {
            return openBlock(), createBlock(_sfc_main$m, {
              key: i,
              entry: e,
              boxed: ""
            }, null, 8, ["entry"]);
          }), 128))
        ]),
        _cache[19] || (_cache[19] = createBaseVNode("p", { class: "small" }, "Селестиал — эволюция Энигмы, она выше, среди эволюций.", -1))
      ]);
    };
  }
};
const _hoisted_1$7 = { class: "bossbar-name" };
const _hoisted_2$6 = {
  class: "bossbar-track",
  "aria-hidden": "true"
};
const _hoisted_3$6 = {
  key: 0,
  class: "bossbar-notch"
};
const _sfc_main$7 = {
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
        createBaseVNode("h4", _hoisted_1$7, toDisplayString(__props.name), 1),
        createBaseVNode("span", _hoisted_2$6, [
          _cache[0] || (_cache[0] = createBaseVNode("span", { class: "bossbar-fill" }, null, -1)),
          __props.notched ? (openBlock(), createElementBlock("span", _hoisted_3$6)) : createCommentVNode("", true)
        ])
      ], 2);
    };
  }
};
const _hoisted_1$6 = { class: "atlas-scroll" };
const _hoisted_2$5 = {
  class: "atlas-svg",
  viewBox: "0 0 1200 640",
  role: "img",
  "aria-labelledby": "atlas-title atlas-desc"
};
const _hoisted_3$5 = ["id"];
const _hoisted_4$5 = ["x", "y", "fill"];
const _hoisted_5$5 = { "clip-path": "url(#clip-ow)" };
const _hoisted_6$5 = ["x", "y", "width", "height"];
const _hoisted_7$5 = ["x", "y", "height"];
const _hoisted_8$4 = ["x", "y"];
const _hoisted_9$4 = ["x", "y"];
const _hoisted_10$4 = { class: "atlas-ruler" };
const _hoisted_11$4 = ["y1", "y2"];
const _hoisted_12$4 = ["y"];
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
const _sfc_main$6 = {
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
        createBaseVNode("div", _hoisted_1$6, [
          (openBlock(), createElementBlock("svg", _hoisted_2$5, [
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
                    }, null, 8, _hoisted_4$5);
                  }), 128))
                ], 8, _hoisted_3$5);
              }), 64)),
              _cache[0] || (_cache[0] = createStaticVNode('<linearGradient id="sky-day" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d5fb8"></stop><stop offset=".7" stop-color="#7fb3f0"></stop><stop offset="1" stop-color="#bfe0ff"></stop></linearGradient><linearGradient id="sky-night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05040e"></stop><stop offset=".7" stop-color="#151236"></stop><stop offset="1" stop-color="#2a2150"></stop></linearGradient><linearGradient id="sky-nether" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e0406"></stop><stop offset="1" stop-color="#3a0d0d"></stop></linearGradient><linearGradient id="lava" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd25a"></stop><stop offset=".25" stop-color="#ff8a1e"></stop><stop offset="1" stop-color="#c4380c"></stop></linearGradient><radialGradient id="glow-forge"><stop offset="0" stop-color="#ffb347" stop-opacity=".9"></stop><stop offset="1" stop-color="#ff5a2a" stop-opacity="0"></stop></radialGradient><radialGradient id="glow-factory"><stop offset="0" stop-color="#6ff0ff" stop-opacity=".6"></stop><stop offset="1" stop-color="#3fd0e0" stop-opacity="0"></stop></radialGradient><radialGradient id="glow-portal"><stop offset="0" stop-color="#d48bff" stop-opacity=".8"></stop><stop offset="1" stop-color="#8a3cff" stop-opacity="0"></stop></radialGradient><clipPath id="clip-ow"><rect x="0" y="0" width="740" height="640" rx="14"></rect></clipPath><clipPath id="clip-ne"><rect x="760" y="0" width="440" height="640" rx="14"></rect></clipPath>', 9))
            ]),
            createBaseVNode("g", _hoisted_5$5, [
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
                }, null, 12, _hoisted_6$5);
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
                  }, null, 8, _hoisted_7$5),
                  createBaseVNode("rect", {
                    x: x - 18,
                    y: top,
                    width: "36",
                    height: "24",
                    fill: "url(#pat-leaves)"
                  }, null, 8, _hoisted_8$4),
                  createBaseVNode("rect", {
                    x: x - 12,
                    y: top - 10,
                    width: "24",
                    height: "12",
                    fill: "url(#pat-leaves)"
                  }, null, 8, _hoisted_9$4)
                ]);
              }), 64)),
              _cache[5] || (_cache[5] = createStaticVNode('<g fill="url(#pat-moss)"><rect x="132" y="284" width="106" height="16"></rect><rect x="144" y="270" width="82" height="14"></rect><rect x="156" y="256" width="58" height="14"></rect><rect x="170" y="244" width="30" height="12"></rect></g><rect x="179" y="286" width="12" height="14" fill="#1a120a"></rect><rect x="626" y="286" width="22" height="14" fill="#6b4a2e"></rect><rect x="622" y="282" width="30" height="5" fill="#835c39"></rect><rect x="634" y="300" width="6" height="30" fill="#140c10"></rect><path d="M412 360 Q420 330 470 328 L640 328 Q690 334 694 372 L690 440 Q640 452 560 452 L460 452 Q414 448 410 420 Z" fill="#100b14"></path><ellipse cx="552" cy="400" rx="150" ry="60" fill="url(#glow-factory)" class="atlas-pulse"></ellipse><g fill="#2f8f99"><rect x="450" y="410" width="40" height="40"></rect><rect x="500" y="388" width="26" height="62"></rect><rect x="536" y="404" width="64" height="46"></rect><rect x="610" y="396" width="34" height="54"></rect></g><g fill="#b06a3a"><rect x="456" y="402" width="28" height="8"></rect><rect x="542" y="396" width="52" height="8"></rect></g><g class="atlas-blink"><rect x="508" y="396" width="10" height="6" fill="#9ff7ff"></rect><rect x="620" y="406" width="10" height="6" fill="#9ff7ff"></rect><rect x="562" y="414" width="12" height="6" fill="#ff5a5a"></rect></g><rect x="634" y="330" width="6" height="22" fill="#140c10"></rect><rect x="244" y="330" width="6" height="140" fill="#1a1414" opacity=".85"></rect><g fill="url(#pat-moss)"><rect x="150" y="470" width="190" height="96"></rect></g><g fill="#151a12"><rect x="160" y="480" width="54" height="34"></rect><rect x="222" y="480" width="54" height="34"></rect><rect x="284" y="480" width="46" height="34"></rect><rect x="160" y="522" width="170" height="36"></rect></g><g fill="#6be36b" class="atlas-blink slow"><rect x="240" y="534" width="10" height="10"></rect></g>', 15)),
              createBaseVNode("g", _hoisted_10$4, [
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
                    }, null, 8, _hoisted_11$4),
                    createBaseVNode("text", {
                      x: "24",
                      y: y + 4
                    }, toDisplayString(label), 9, _hoisted_12$4)
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
const _hoisted_1$5 = { id: "sanctums" };
const _hoisted_2$4 = { class: "guides" };
const _hoisted_3$4 = { class: "guide-card" };
const _hoisted_4$4 = { class: "guide-card" };
const _hoisted_5$4 = { class: "guide-card" };
const _hoisted_6$4 = { class: "guide-card" };
const _hoisted_7$4 = {
  class: "guide-item",
  "aria-hidden": "true"
};
const _hoisted_8$3 = ["src"];
const _hoisted_9$3 = { class: "guide-card" };
const _hoisted_10$3 = { class: "guide-card" };
const _hoisted_11$3 = {
  class: "guide-item",
  "aria-hidden": "true"
};
const _hoisted_12$3 = ["src"];
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
const _hoisted_68 = {
  class: "sanctum",
  id: "wanderer-cube"
};
const _hoisted_69 = { class: "terra-figure cube-figure" };
const _hoisted_70 = { class: "cube-row" };
const _hoisted_71 = ["src", "alt"];
const _hoisted_72 = { class: "sanctum-body" };
const _hoisted_73 = { class: "sanctum-info" };
const _hoisted_74 = { class: "kv" };
const _hoisted_75 = { class: "inline-icons" };
const _hoisted_76 = ["src"];
const _hoisted_77 = ["src"];
const _hoisted_78 = {
  class: "sanctum",
  id: "terra-trial"
};
const _hoisted_79 = { class: "terra-figure" };
const _hoisted_80 = ["src"];
const _hoisted_81 = { class: "sanctum-body" };
const _hoisted_82 = { class: "sanctum-info" };
const _hoisted_83 = { class: "kv" };
const _hoisted_84 = { class: "inline-icons" };
const _hoisted_85 = ["src"];
const _hoisted_86 = { class: "inline-icons" };
const _hoisted_87 = ["src"];
const _hoisted_88 = ["src"];
const _hoisted_89 = ["src"];
const _hoisted_90 = {
  class: "stack",
  style: { "align-content": "start" }
};
const _hoisted_91 = { class: "boss" };
const _sfc_main$5 = {
  __name: "SanctumsSection",
  setup(__props) {
    const recipe = (key) => data.recipes.find((r) => r.result === key);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$5, [
        createVNode(_sfc_main$f, {
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
        createVNode(_sfc_main$6),
        _cache[76] || (_cache[76] = createStaticVNode('<div class="flow" aria-label="Путь через святилище"><div class="step"><b>Вход</b><span>туннель, ступени или ворота</span></div><span class="to" aria-hidden="true">→</span><div class="step"><b>Три комнаты</b><span>в каждой стража; с неё падают осколки</span></div><span class="to" aria-hidden="true">→</span><div class="step"><b>Алтарь</b><span>откроется, когда падёт вся стража: эволюция, заточка, испытания</span></div><span class="to" aria-hidden="true">→</span><div class="step"><b>Арена</b><span>испытание: пять волн, в пятой — страж</span></div></div><h3>Пять святилищ коротко</h3><div class="tbl"><table><thead><tr><th>Святилище</th><th>Где</th><th>Чем искать</th><th>Страж</th><th>Кочует</th><th>Кровь</th></tr></thead><tbody><tr><th scope="row"><a href="#forge">Незеритовая кузня</a></th><td>Незер, в толще незерака</td><td>Карта кузни</td><td>Горнило</td><td>да</td><td>пепельная</td></tr><tr><th scope="row"><a href="#temple">Небесный храм</a></th><td>верхний мир, остров на высоте 200</td><td>Компас воздуха</td><td>Серафим Падшего Рассвета</td><td>да, и рушится от Печати ночи</td><td>небесная</td></tr><tr><th scope="row"><a href="#jungle">Храм джунглей</a></th><td>джунгли</td><td>Карта джунглей</td><td>Древний страж джунглей</td><td>да</td><td>предков</td></tr><tr><th scope="row"><a href="#night">Тёмный храм</a></th><td>верхний мир, только ночью</td><td>Ночной компас</td><td>Пустотный Серафим (призыв)</td><td>каждую ночь на новом месте</td><td>ночная небесная</td></tr><tr><th scope="row"><a href="#factory">Древняя фабрика</a></th><td>глубоко под землёй</td><td>Неизвестный компас</td><td>Предвестник</td><td>нет</td><td>техноорганическая</td></tr></tbody></table></div><h3>Как найти святилище</h3><p>Каждое святилище ищется своим предметом. Компас ведёт к храму, где бы тот ни стоял; карта показывает место, где святилище стояло, когда её сделали.</p>', 5)),
        createBaseVNode("div", _hoisted_2$4, [
          createBaseVNode("div", _hoisted_3$4, [
            createVNode(_sfc_main$p, {
              recipe: recipe("g:air_compass"),
              small: ""
            }, null, 8, ["recipe"]),
            _cache[1] || (_cache[1] = createBaseVNode("div", null, [
              createBaseVNode("h4", null, "Компас воздуха"),
              createBaseVNode("p", { class: "small muted" }, "Указывает на Небесный храм.")
            ], -1))
          ]),
          createBaseVNode("div", _hoisted_4$4, [
            createVNode(_sfc_main$p, {
              recipe: recipe("g:forge_map"),
              small: ""
            }, null, 8, ["recipe"]),
            _cache[2] || (_cache[2] = createBaseVNode("div", null, [
              createBaseVNode("h4", null, "Карта кузни"),
              createBaseVNode("p", { class: "small muted" }, "Отмечает Незеритовую кузню.")
            ], -1))
          ]),
          createBaseVNode("div", _hoisted_5$4, [
            createVNode(_sfc_main$p, {
              recipe: recipe("g:jungle_map"),
              small: ""
            }, null, 8, ["recipe"]),
            _cache[3] || (_cache[3] = createBaseVNode("div", null, [
              createBaseVNode("h4", null, "Карта джунглей"),
              createBaseVNode("p", { class: "small muted" }, "Отмечает Храм джунглей.")
            ], -1))
          ]),
          createBaseVNode("div", _hoisted_6$4, [
            createBaseVNode("div", _hoisted_7$4, [
              createBaseVNode("img", {
                src: unref(data).guideIcons.unknown_compass,
                alt: ""
              }, null, 8, _hoisted_8$3)
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
          createBaseVNode("div", _hoisted_9$3, [
            createVNode(_sfc_main$p, {
              recipe: recipe("g:night_compass"),
              small: ""
            }, null, 8, ["recipe"]),
            _cache[5] || (_cache[5] = createBaseVNode("div", null, [
              createBaseVNode("h4", null, "Ночной компас"),
              createBaseVNode("p", { class: "small muted" }, "Указывает на Тёмный храм, пока тот стоит.")
            ], -1))
          ]),
          createBaseVNode("div", _hoisted_10$3, [
            createBaseVNode("div", _hoisted_11$3, [
              createBaseVNode("img", {
                src: unref(data).icons.terra_compass,
                alt: ""
              }, null, 8, _hoisted_12$3)
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
              createVNode(_sfc_main$7, {
                name: "Горнило, кузнец Преисподней",
                colour: "red"
              }),
              _cache[14] || (_cache[14] = createStaticVNode('<div class="boss-stats"><span class="pill">400 здоровья</span><span class="pill">урон 7</span><span class="pill">броня 12</span><span class="pill">скелет-иссушитель</span></div><ul class="attacks"><li><b>Молот.</b> Прыгает к игроку; место посадки светится — уходите из круга, а после посадки бейте.</li><li><b>Огненное кольцо.</b> Катится по полу от босса — перепрыгивайте.</li><li><b>Извержение.</b> Из оранжевых кругов под бойцами бьёт лава — выйдите из них.</li><li><b>Подмастерья.</b> Зовёт скелетов-иссушителей.</li><li><b>Ярость.</b> Раненый — быстрее и сильнее.</li></ul>', 2))
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
              createVNode(_sfc_main$7, {
                name: "Серафим Падшего Рассвета",
                colour: "white"
              }),
              _cache[23] || (_cache[23] = createStaticVNode('<div class="boss-stats"><span class="pill">450 здоровья</span><span class="pill">броня 8</span><span class="pill">иллюзор</span></div><ul class="attacks"><li><b>Печать ночи.</b> Падает с него в третьем испытании.</li><li><b>Суд.</b> В столбы света бьёт молния — выйдите из света.</li><li><b>Перья.</b> На золотые кольца падает залп стрел — выйдите из кольца.</li><li><b>Щит рассвета.</b> Неуязвим, пока живы призванные стражи.</li><li><b>Лучи рассвета.</b> Лучи обходят его кругом — перепрыгивайте их.</li><li><b>Мерцание.</b> Переносится по двору.</li></ul>', 2))
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
                _cache[29] || (_cache[29] = createStaticVNode("<div><dt>Где</dt><dd>ступенчатая пирамида в джунглях</dd></div><div><dt>Внутри</dt><dd>большой зал, арена и алтарная комната</dd></div><div><dt>Стража</dt><dd>болотники, пещерные пауки, пауки, ведьмы</dd></div><div><dt>Алтарь</dt><dd>испытания, ковка Терра-блейда и Энигмы, четвёртая форма крови предков</dd></div>", 4)),
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
              ]),
              _cache[31] || (_cache[31] = createBaseVNode("p", { class: "sleeping" }, "Алтарь куёт и проводит испытания, но заточки и пробуждения терра-клинков здесь пока нет.", -1))
            ]),
            createBaseVNode("div", _hoisted_40, [
              createVNode(_sfc_main$7, {
                name: "Древний страж джунглей",
                colour: "green"
              }),
              _cache[32] || (_cache[32] = createStaticVNode('<div class="boss-stats"><span class="pill">550 здоровья</span><span class="pill">урон 16</span><span class="pill">броня 10</span><span class="pill">разоритель</span></div><ul class="attacks"><li><b>Землетрясение.</b> Подбрасывает всех на земле рядом.</li><li><b>Корни.</b> Под бойцами сжимаются зелёные кольца — выйдите из них, пока из пола не вырвались корни.</li><li><b>Споры.</b> Ядовитое облако вокруг босса — успейте выйти.</li><li><b>Таран.</b> Мчится по зелёной линии — сойдите с неё; врезавшись в стену, уязвим.</li><li><b>Зов и натиск.</b> Зовёт обитателей храма; раненый таранит чаще.</li></ul>', 2))
            ])
          ])
        ]),
        createBaseVNode("article", _hoisted_41, [
          createBaseVNode("figure", null, [
            _cache[33] || (_cache[33] = createBaseVNode("span", {
              class: "figure-title",
              "aria-hidden": "true"
            }, "Тёмный храм", -1)),
            createBaseVNode("img", {
              src: unref(data).images.night,
              alt: "Тёмный храм: вид снаружи, разрез и план"
            }, null, 8, _hoisted_42),
            _cache[34] || (_cache[34] = createBaseVNode("figcaption", null, "Снаружи · разрез · план", -1))
          ]),
          createBaseVNode("div", _hoisted_43, [
            createBaseVNode("div", _hoisted_44, [
              _cache[38] || (_cache[38] = createBaseVNode("div", { class: "sanctum-title" }, [
                createBaseVNode("h3", null, "Тёмный храм"),
                createBaseVNode("span", { class: "pill" }, "только ночью")
              ], -1)),
              createBaseVNode("dl", _hoisted_45, [
                _cache[37] || (_cache[37] = createStaticVNode("<div><dt>Когда</dt><dd>после того как сломали Печать ночи — каждую ночь в новом месте</dd></div><div><dt>Какой</dt><dd>тёмная тень Небесного храма</dd></div><div><dt>Стража</dt><dd>стражи полуночи</dd></div><div><dt>Алтарь</dt><dd>ночная ковка, заточка, призыв Пустотного Серафима</dd></div>", 4)),
                createBaseVNode("div", null, [
                  _cache[36] || (_cache[36] = createBaseVNode("dt", null, "Добыча", -1)),
                  createBaseVNode("dd", _hoisted_46, [
                    createBaseVNode("img", {
                      src: unref(data).icons.celestial_shard,
                      alt: ""
                    }, null, 8, _hoisted_47),
                    _cache[35] || (_cache[35] = createTextVNode("Небесные осколки со стражи и с Пустотного Серафима", -1))
                  ])
                ])
              ])
            ]),
            createBaseVNode("div", _hoisted_48, [
              createVNode(_sfc_main$7, {
                name: "Пустотный Серафим",
                colour: "purple"
              }),
              _cache[39] || (_cache[39] = createStaticVNode('<div class="boss-stats"><span class="pill">700 здоровья</span><span class="pill">урон 13</span><span class="pill">броня 10</span><span class="pill">эндермен</span></div><ul class="attacks"><li><b>Призыв.</b> Его зовут на алтаре. Призвавшему ночной крови третьей формы победа даёт четвёртую форму.</li><li><b>Щит ударов.</b> Снимается числом ударов, а не силой.</li><li><b>Головы пустоты.</b> Пока живы головы, Серафим получает меньше урона — фиолетовые нити ведут к ним.</li><li><b>Глиф.</b> Встаньте в круг упавшего маяка, иначе взрыв.</li><li><b>Лучи разбитого сердца.</b> Лучи обходят его кругом — прыгайте.</li><li><b>Шаг сквозь пустоту.</b> Встаёт за спиной — выйдите из фиолетового кольца.</li></ul>', 2))
            ])
          ])
        ]),
        createBaseVNode("article", _hoisted_49, [
          createBaseVNode("figure", null, [
            _cache[40] || (_cache[40] = createBaseVNode("span", {
              class: "figure-title",
              "aria-hidden": "true"
            }, "Древняя фабрика", -1)),
            createBaseVNode("img", {
              src: unref(data).images.factory,
              alt: "Древняя фабрика: пещера без потолка, разрез и план"
            }, null, 8, _hoisted_50),
            _cache[41] || (_cache[41] = createBaseVNode("figcaption", null, "Пещера без потолка · разрез · план", -1))
          ]),
          createBaseVNode("div", _hoisted_51, [
            createBaseVNode("div", _hoisted_52, [
              _cache[46] || (_cache[46] = createBaseVNode("div", { class: "sanctum-title" }, [
                createBaseVNode("h3", null, "Древняя фабрика"),
                createBaseVNode("span", { class: "pill" }, "под землёй")
              ], -1)),
              createBaseVNode("dl", _hoisted_53, [
                _cache[45] || (_cache[45] = createStaticVNode("<div><dt>Где</dt><dd>глубоко под землёй. Путь укажет Неизвестный компас</dd></div><div><dt>Внутри</dt><dd>огромный цех: погрузочный и сборочный залы, реактор и пульт управления</dd></div><div><dt>Стража</dt><dd>автоматоны и летучие дроны</dd></div><div><dt>Терминал</dt><dd>запуск Предвестника, рейды, техноорганический вирус, сборка машин</dd></div>", 4)),
                createBaseVNode("div", null, [
                  _cache[44] || (_cache[44] = createBaseVNode("dt", null, "Добыча", -1)),
                  createBaseVNode("dd", _hoisted_54, [
                    createBaseVNode("img", {
                      src: unref(data).icons.ancient_part,
                      alt: ""
                    }, null, 8, _hoisted_55),
                    _cache[42] || (_cache[42] = createTextVNode("Древние детали · ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.harbinger_core,
                      alt: ""
                    }, null, 8, _hoisted_56),
                    _cache[43] || (_cache[43] = createTextVNode("Ядро Предвестника", -1))
                  ])
                ])
              ])
            ]),
            createBaseVNode("div", _hoisted_57, [
              createVNode(_sfc_main$7, {
                name: "Предвестник",
                colour: "blue"
              }),
              _cache[47] || (_cache[47] = createStaticVNode('<div class="boss-stats"><span class="pill">600 здоровья</span><span class="pill">урон 18</span><span class="pill">броня 14</span><span class="pill">железный голем</span></div><ul class="attacks"><li><b>Запуск.</b> В первый раз встаёт сам, потом его запускают на терминале.</li><li><b>Павшим вход закрыт</b> до конца боя.</li><li><b>Луч смерти.</b> Красная линия желтеет и стреляет — сойдите с неё или спрячьтесь за стену.</li><li><b>Ракеты.</b> Падают в оранжевые кольца.</li><li><b>Магнитный импульс.</b> Тянет к себе и разряжается — бегите против тяги, после разряда бейте.</li><li><b>Дроны.</b> Зовёт подмогу.</li><li><b>Перегрузка.</b> Раненый — быстрее и бьёт током всех рядом.</li></ul>', 2))
            ])
          ])
        ]),
        createBaseVNode("article", _hoisted_58, [
          createBaseVNode("figure", null, [
            _cache[48] || (_cache[48] = createBaseVNode("span", {
              class: "figure-title",
              "aria-hidden": "true"
            }, "Проклятый замок", -1)),
            createBaseVNode("img", {
              src: unref(data).images.castle,
              alt: "Проклятый замок на бедроковой крыше Незера"
            }, null, 8, _hoisted_59),
            _cache[49] || (_cache[49] = createBaseVNode("figcaption", null, "Замок на бедроковой крыше Незера", -1))
          ]),
          createBaseVNode("div", _hoisted_60, [
            createBaseVNode("div", _hoisted_61, [
              _cache[55] || (_cache[55] = createBaseVNode("div", { class: "sanctum-title" }, [
                createBaseVNode("h3", null, "Проклятый замок"),
                createBaseVNode("span", { class: "pill" }, "крыша Незера")
              ], -1)),
              createBaseVNode("dl", _hoisted_62, [
                _cache[54] || (_cache[54] = createStaticVNode("<div><dt>Как найти</dt><dd>с третьей формы крови: на крыше Незера нажмите ПКМ Душой демона — она полетит к замку, как око Края. Замок встаёт к северу, воротами к вам</dd></div><div><dt>Где</dt><dd>на крыше Незера; один на сервер</dd></div><div><dt>Исчезает</dt><dd>опустевший замок растворяется, следующая душа найдёт новый. Король пробуждается в замке лишь однажды</dd></div><div><dt>Город</dt><dd>дома, рынок и таверна подданных короля</dd></div><div><dt>Жители</dt><dd>пока король жив, в замке появляются пиглины</dd></div><div><dt>Часовая башня</dt><dd>в атриуме висит Адская сущность; её охраняют Стражи пекла. Пока жив хоть один, поле не подпускает. В инвентаре сущность поджигает носителя</dd></div><div><dt>Донжон</dt><dd>большой зал, библиотека, спальня и тронный зал</dd></div><div><dt>Стража</dt><dd>пиглины-громилы и чемпионы: Мечники Бедствия и Берсерки короля</dd></div>", 8)),
                createBaseVNode("div", null, [
                  _cache[53] || (_cache[53] = createBaseVNode("dt", null, "Добыча", -1)),
                  createBaseVNode("dd", _hoisted_63, [
                    createBaseVNode("img", {
                      src: unref(data).icons.black_substance,
                      alt: ""
                    }, null, 8, _hoisted_64),
                    _cache[50] || (_cache[50] = createTextVNode("Чёрная субстанция в рамке над троном · ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.hell_essence,
                      alt: ""
                    }, null, 8, _hoisted_65),
                    _cache[51] || (_cache[51] = createTextVNode("Адская сущность в часовой башне · Призрачный страж в сокровищнице · ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.royal_clock,
                      alt: ""
                    }, null, 8, _hoisted_66),
                    _cache[52] || (_cache[52] = createTextVNode("Королевские часы с короля · сундуки с сокровищами", -1))
                  ])
                ])
              ])
            ]),
            createBaseVNode("div", _hoisted_67, [
              createVNode(_sfc_main$7, {
                name: "Проклятый король",
                colour: "red"
              }),
              _cache[56] || (_cache[56] = createStaticVNode('<div class="boss-stats"><span class="pill">1200 здоровья</span><span class="pill">урон 10</span><span class="pill">броня 12</span><span class="pill">пиглин-громила</span></div><ul class="attacks"><li><b>Тронный зал.</b> Колонны — укрытие от указа. Пока король жив, субстанцию не снять; потом её достаёт любой, встав на трон.</li><li><b>Акт I. Удар короны.</b> Выйдите из золотого веера или зайдите за спину.</li><li><b>Рывок.</b> Несётся по золотой линии, потом уязвим.</li><li><b>Золото.</b> В круги рушится золото.</li><li><b>Указ.</b> Тянет к ногам всех на виду — спасают расстояние и колонны.</li><li><b>Бросок топора.</b> Топор летит по золотой дорожке и возвращается — сойдите с неё.</li><li><b>Поступь.</b> По полу бегут золотые волны — перепрыгивайте.</li><li><b>Акт II. Золотой бастион.</b> Король на троне под щитом, который считает удары, — бейте часто. С ворот идёт подмога, с трона летят копья.</li><li><b>Акт III. Проклятие короны.</b> Ярость. <b>Проклятие</b> жжёт края зала — бегите в середину. <b>Казнь</b>: прыгает на самого слабого.</li><li><b>Рог.</b> В третьем акте весь замок бежит в тронный зал. Когда король падает, его народ теряет волю.</li><li><b>Дань.</b> Подданные в зале лечат короля — бейте сначала их.</li></ul>', 2))
            ])
          ])
        ]),
        createBaseVNode("article", _hoisted_68, [
          createBaseVNode("figure", _hoisted_69, [
            createBaseVNode("div", _hoisted_70, [
              (openBlock(), createElementBlock(Fragment, null, renderList(["green", "blue", "orange", "purple", "red", "gray"], (c) => {
                return createBaseVNode("img", {
                  key: c,
                  src: unref(data).icons["wanderer_cube_" + c],
                  alt: c
                }, null, 8, _hoisted_71);
              }), 64))
            ]),
            _cache[57] || (_cache[57] = createBaseVNode("figcaption", null, "Цвет Тессеракта подсказывает, что он сделает", -1))
          ]),
          createBaseVNode("div", _hoisted_72, [
            createBaseVNode("div", _hoisted_73, [
              _cache[63] || (_cache[63] = createBaseVNode("div", { class: "sanctum-title" }, [
                createBaseVNode("h3", null, "Тессеракт"),
                createBaseVNode("span", { class: "pill" }, "любая кровь")
              ], -1)),
              createBaseVNode("dl", _hoisted_74, [
                createBaseVNode("div", null, [
                  _cache[61] || (_cache[61] = createBaseVNode("dt", null, "Крафт", -1)),
                  createBaseVNode("dd", _hoisted_75, [
                    _cache[58] || (_cache[58] = createTextVNode("верстак: ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.terra_essence,
                      alt: ""
                    }, null, 8, _hoisted_76),
                    _cache[59] || (_cache[59] = createTextVNode("Терра-сущность, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.hell_essence,
                      alt: ""
                    }, null, 8, _hoisted_77),
                    _cache[60] || (_cache[60] = createTextVNode("Адская сущность, звезда Незера и плачущий обсидиан", -1))
                  ])
                ]),
                _cache[62] || (_cache[62] = createStaticVNode("<div><dt>Как работает</dt><dd>правый клик; что он сделает, видно по цвету</dd></div><div><dt>Красный</dt><dd>вы стоите в чужом куполе — Сделке с дьяволом, Тёмной территории, Сборочном куполе, Огненном эдикте или Мировом Господстве — либо рядом с тем, кто вытянул чужую Луну: тессеракт развеивает это</dd></div><div><dt>Зелёный</dt><dd>здоровье не полное: лечит вас и своих рядом</dd></div><div><dt>Голубой</dt><dd>полное здоровье, обычный мир: перенос к случайному храму</dd></div><div><dt>Оранжевый</dt><dd>полное здоровье, Незер: перенос к Незеритовой кузне</dd></div><div><dt>Фиолетовый</dt><dd>полное здоровье, Энд: перенос к точке возрождения</dd></div><div><dt>Перенос</dt><dd>забирает всех живых рядом; из арены испытания не уводит</dd></div>", 7))
              ])
            ])
          ])
        ]),
        _cache[77] || (_cache[77] = createBaseVNode("div", { class: "prose small" }, [
          createBaseVNode("p", null, [
            createBaseVNode("b", null, "Королевские часы"),
            createTextVNode(" работают как тотем бессмертия и, спасая от смерти, ненадолго останавливают время вокруг.")
          ])
        ], -1)),
        createBaseVNode("article", _hoisted_78, [
          createBaseVNode("figure", _hoisted_79, [
            createBaseVNode("img", {
              src: unref(data).icons.terra_essence,
              alt: "Терра-сущность"
            }, null, 8, _hoisted_80),
            _cache[64] || (_cache[64] = createBaseVNode("figcaption", null, "Терра-сущность", -1))
          ]),
          createBaseVNode("div", _hoisted_81, [
            createBaseVNode("div", _hoisted_82, [
              _cache[73] || (_cache[73] = createBaseVNode("div", { class: "sanctum-title" }, [
                createBaseVNode("h3", null, "Терра-подземелье"),
                createBaseVNode("span", { class: "pill" }, "под землёй")
              ], -1)),
              createBaseVNode("dl", _hoisted_83, [
                createBaseVNode("div", null, [
                  _cache[66] || (_cache[66] = createBaseVNode("dt", null, "Как найти", -1)),
                  createBaseVNode("dd", _hoisted_84, [
                    createBaseVNode("img", {
                      src: unref(data).icons.terra_compass,
                      alt: ""
                    }, null, 8, _hoisted_85),
                    _cache[65] || (_cache[65] = createTextVNode("Терра-компас; копайте к шахте, на которую он указывает", -1))
                  ])
                ]),
                _cache[72] || (_cache[72] = createStaticVNode("<div><dt>Где</dt><dd>верхний мир, глубоко под землёй; одно на сервер</dd></div><div><dt>Исчезает</dt><dd>когда все игроки его покинули; вернётся через несколько игровых суток в другом месте</dd></div><div><dt>Загадки</dt><dd>рычаги, кнопки и ловушки; дальний зал открывается загадками</dd></div><div><dt>Библиотека</dt><dd>лабиринт стеллажей; присмотритесь к рычагам под сводом</dd></div><div><dt>Разбойники</dt><dd>выходят с постов в залах, когда вы подходите</dd></div><div><dt>Всадники апокалипсиса</dt><dd>Война и Смерть в зале свечей; пока жив хоть один, голем спит</dd></div><div><dt>Терра-сущность в зале</dt><dd>появляется, когда голем пал; забрать — подойти к ней</dd></div><div><dt>Когда сущность взята</dt><dd>подземелье кишит болотниками</dd></div><div><dt>Терра-сущность</dt><dd>в инвентаре отравляет носителя, кроме крови предков и техноорганической</dd></div>", 9)),
                createBaseVNode("div", null, [
                  _cache[71] || (_cache[71] = createBaseVNode("dt", null, "Бочки", -1)),
                  createBaseVNode("dd", _hoisted_86, [
                    _cache[67] || (_cache[67] = createTextVNode("в одной из них — ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.ancient,
                      alt: ""
                    }, null, 8, _hoisted_87),
                    _cache[68] || (_cache[68] = createTextVNode("Древний; в остальных осколки, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.terra_ingot,
                      alt: ""
                    }, null, 8, _hoisted_88),
                    _cache[69] || (_cache[69] = createTextVNode("терра-слитки, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.demon_soul,
                      alt: ""
                    }, null, 8, _hoisted_89),
                    _cache[70] || (_cache[70] = createTextVNode("Душа демона и припасы", -1))
                  ])
                ])
              ])
            ]),
            createBaseVNode("div", _hoisted_90, [
              createBaseVNode("div", _hoisted_91, [
                createVNode(_sfc_main$7, {
                  name: "Джунглевый голем",
                  colour: "green"
                }),
                _cache[74] || (_cache[74] = createStaticVNode('<div class="boss-stats"><span class="pill">900 здоровья</span><span class="pill">7 блоков ростом</span><span class="pill">большой зал</span></div><ul class="attacks"><li><b>Сотрясение.</b> Выйдите из зелёного круга или подпрыгните.</li><li><b>Валун.</b> Уйдите со светящегося диска.</li><li><b>Плеть.</b> Сойдите с линии лоз.</li><li><b>Корни.</b> Щит из мха считает удары, а не урон.</li><li><b>Ярость.</b> Раненый — быстрее, оставляет ядовитые споры.</li><li><b>Награда.</b> Терра-слитки и Терра-сущность.</li></ul>', 2))
              ]),
              _cache[75] || (_cache[75] = createStaticVNode('<div class="boss"><div class="boss-name">Древний</div><div class="boss-stats"><span class="pill">кровь предков, вторая форма</span></div><ul class="attacks"><li><b>Гнев предков.</b> Сильнее против разбойников и ведьм, удар оплетает цель корнями.</li><li><b>Разлом</b> — правый клик: разлом бежит кольцами, подбрасывает и оплетает врагов.</li><li><b>Где взять.</b> В бочке Терра-подземелья.</li></ul></div>', 1))
            ])
          ])
        ]),
        _cache[78] || (_cache[78] = createBaseVNode("div", { class: "prose small" }, [
          createBaseVNode("p", null, "Каждый, кто бился со стражем, получает свою долю добычи. Пали все бойцы — страж уходит.")
        ], -1))
      ]);
    };
  }
};
const _hoisted_1$4 = { id: "raids" };
const _hoisted_2$3 = { class: "stack" };
const _hoisted_3$3 = { class: "panel" };
const _hoisted_4$3 = {
  class: "waves",
  "aria-label": "Пять волн: четыре волны стражи, в пятой — страж святилища"
};
const _hoisted_5$3 = { class: "wave-n" };
const _hoisted_6$3 = { class: "wave-t" };
const _hoisted_7$3 = {
  key: 0,
  class: "energy",
  "aria-hidden": "true"
};
const _hoisted_8$2 = { class: "tiers" };
const _hoisted_9$2 = {
  class: "tier-n",
  "aria-hidden": "true"
};
const _hoisted_10$2 = { class: "kv" };
const _hoisted_11$2 = {
  class: "panel",
  id: "fourth"
};
const _hoisted_12$2 = { class: "fourths" };
const _hoisted_13$1 = { class: "fourth-relic" };
const _hoisted_14$1 = ["src"];
const _hoisted_15$1 = { class: "fourth-blood" };
const _hoisted_16 = { class: "small" };
const _hoisted_17 = { class: "fourth-where" };
const _sfc_main$4 = {
  __name: "TrialsSection",
  setup(__props) {
    const TIERS = [
      { n: "I", price: "даром, раз в 10 минут на игрока", gives: "у всех бойцов этой крови и у начавшего первая форма → вторая", shards: 1 },
      { n: "II", price: "алмазный блок, изумрудный блок, 20 осколков", gives: "начавшему — реликвия святилища, даже если он погиб", shards: 2 },
      { n: "III", price: "32 осколка, реликвия, зачарованное золотое яблоко", gives: "начавшему — реликвия; у бойцов этой крови и у начавшего вторая форма → третья; Серафим роняет Печать ночи", shards: 3 }
    ];
    const blood = Object.fromEntries(data.blood.map((b) => [b.id, b]));
    const FOURTH = [
      { blood: "ember", what: "Адская сущность", from: "из часовой башни Проклятого замка", where: "кнопка крови у алтаря Незеритовой кузни", icon: "hell_essence" },
      { blood: "steel", what: "Терра-сущность", from: "из большого зала Терра-подземелья", where: "кнопка крови у алтаря Храма джунглей", icon: "terra_essence" },
      { blood: "night", what: "Пустотный Серафим", from: "победить его — форму получает тот, кто его призвал", where: "алтарь Тёмного храма", icon: "night_seal" },
      { blood: "techno", what: "Чёрная субстанция", from: "с трона Проклятого замка", where: "ZorahM-GPT: кнопка крови у терминала фабрики", icon: "black_substance" }
    ];
    const icon = (id) => {
      var _a;
      return ((_a = item(id)) == null ? void 0 : _a.icon) || data.icons[id];
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$4, [
        createVNode(_sfc_main$f, {
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
        createBaseVNode("div", _hoisted_2$3, [
          createBaseVNode("div", _hoisted_3$3, [
            _cache[4] || (_cache[4] = createBaseVNode("h3", null, "Испытание святилища", -1)),
            _cache[5] || (_cache[5] = createBaseVNode("p", { class: "small" }, "Пять волн в арене, в пятой — страж святилища. Уровень и награду определяет тот, кто начал. Покинуть арену до конца боя нельзя.", -1)),
            createBaseVNode("div", _hoisted_4$3, [
              (openBlock(), createElementBlock(Fragment, null, renderList(5, (w) => {
                return openBlock(), createElementBlock(Fragment, { key: w }, [
                  createBaseVNode("div", {
                    class: normalizeClass(["wave", { boss: w === 5 }])
                  }, [
                    createBaseVNode("span", _hoisted_5$3, toDisplayString(w), 1),
                    createBaseVNode("span", _hoisted_6$3, toDisplayString(w === 5 ? "страж" : "волна"), 1)
                  ], 2),
                  w < 5 ? (openBlock(), createElementBlock("span", _hoisted_7$3)) : createCommentVNode("", true)
                ], 64);
              }), 64))
            ]),
            createBaseVNode("div", _hoisted_8$2, [
              (openBlock(), createElementBlock(Fragment, null, renderList(TIERS, (t) => {
                return createBaseVNode("article", {
                  key: t.n,
                  class: normalizeClass(["tier", `tier-${t.n.length}`])
                }, [
                  createBaseVNode("span", _hoisted_9$2, toDisplayString(t.n), 1),
                  createBaseVNode("h4", null, "Уровень " + toDisplayString(t.n.length), 1),
                  createBaseVNode("dl", _hoisted_10$2, [
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
            _cache[7] || (_cache[7] = createBaseVNode("p", { class: "small" }, [
              createBaseVNode("b", null, "Провал"),
              createTextVNode(" забирает у каждого половину осколков, добытых в этом испытании.")
            ], -1))
          ]),
          createBaseVNode("div", _hoisted_11$2, [
            _cache[8] || (_cache[8] = createBaseVNode("h3", null, "Четвёртая форма", -1)),
            _cache[9] || (_cache[9] = createBaseVNode("p", { class: "small" }, [
              createTextVNode("Четвёртую форму "),
              createBaseVNode("b", null, "приносят к алтарю своей крови"),
              createTextVNode(".")
            ], -1)),
            createBaseVNode("div", _hoisted_12$2, [
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
            _cache[10] || (_cache[10] = createBaseVNode("p", { class: "small" }, [
              createTextVNode("Обе сущности с "),
              createBaseVNode("b", null, "проклятием утраты"),
              createTextVNode(": погибли с ней — она пропала.")
            ], -1))
          ])
        ]),
        _cache[11] || (_cache[11] = createStaticVNode('<div class="panel"><h3>Рейды фабрики</h3><p class="small">Рейды проводят в Древней фабрике после падения Предвестника: волны в реакторном зале, три уровня, как у испытаний.</p><div class="tbl"><table><thead><tr><th>Уровень</th><th>Цена</th><th>С каждого стражника</th><th>В конце всем в фабрике</th></tr></thead><tbody><tr><td>1</td><td>даром, раз в 10 минут</td><td>1 деталь</td><td>6–10 деталей</td></tr><tr><td>2</td><td>8 деталей</td><td>2 детали</td><td>12–20 деталей, шанс 15% на ядро</td></tr><tr><td>3</td><td>16 деталей</td><td>3 детали</td><td>20–30 деталей, шанс 30% на ядро</td></tr></tbody></table></div><p class="small">Провал забирает половину деталей, добытых в рейде.</p></div>', 1))
      ]);
    };
  }
};
const _hoisted_1$3 = { id: "blood" };
const _hoisted_2$2 = { class: "bloods" };
const _hoisted_3$2 = { class: "blood-motto" };
const _hoisted_4$2 = { class: "blood-home" };
const _hoisted_5$2 = { class: "blood-blades" };
const _hoisted_6$2 = ["href"];
const _hoisted_7$2 = ["src"];
const _hoisted_8$1 = {
  key: 0,
  class: "muted small"
};
const _hoisted_9$1 = {
  key: 0,
  class: "muted small"
};
const _hoisted_10$1 = { class: "tbl" };
const _hoisted_11$1 = { scope: "row" };
const _hoisted_12$1 = { class: "tbl" };
const _hoisted_13 = { scope: "row" };
const _hoisted_14 = {
  key: 0,
  colspan: "4"
};
const _hoisted_15 = {
  key: 0,
  class: "muted small"
};
const _sfc_main$3 = {
  __name: "BloodSection",
  setup(__props) {
    const quests = data.blood.filter((b) => !b.formless && b.deed);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$3, [
        createVNode(_sfc_main$f, {
          title: "Родословные",
          icon: "demon_soul"
        }, {
          default: withCtx(() => [..._cache[0] || (_cache[0] = [
            createBaseVNode("p", { class: "lead" }, "При первом входе каждый игрок сам выбирает одну из трёх родословных — пепельную, небесную или кровь предков —. Кровь решает, как игрок растёт, какую книгу получит и какие величайшие клинки его признают.", -1)
          ])]),
          _: 1
        }),
        _cache[6] || (_cache[6] = createBaseVNode("h3", null, "Клинки крови", -1)),
        _cache[7] || (_cache[7] = createBaseVNode("p", null, [
          createTextVNode("Величайшие клинки привязаны к крови: в чужих руках они не работают. "),
          createBaseVNode("b", null, "Короны"),
          createTextVNode(" — Люцифер, Истинный Экскалибур и Селестиал — отвечают только крови в "),
          createBaseVNode("b", null, "четвёртой форме"),
          createTextVNode(", а Все-Чёрный — только крови бездны.")
        ], -1)),
        createBaseVNode("div", _hoisted_2$2, [
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
                    w.form > 1 ? (openBlock(), createElementBlock("span", _hoisted_8$1, "с " + toDisplayString(w.form) + "-й", 1)) : createCommentVNode("", true)
                  ], 8, _hoisted_6$2);
                }), 128)),
                !b.weapons.length ? (openBlock(), createElementBlock("span", _hoisted_9$1, "ещё не выкованы")) : createCommentVNode("", true)
              ])
            ], 4);
          }), 128))
        ]),
        _cache[8] || (_cache[8] = createStaticVNode('<h3>Формы</h3><div class="flow" aria-label="Путь крови"><div class="step"><b>Первая</b><span>выбор при первом входе — или 20 осколков у алтаря святилища этой крови</span></div><span class="to" aria-hidden="true">→</span><div class="step"><b>Вторая</b><span>испытание 1-го уровня в святилище своей крови</span></div><span class="to" aria-hidden="true">→</span><div class="step"><b>Третья</b><span>испытание 3-го уровня там же</span></div><span class="to" aria-hidden="true">→</span><div class="step"><b>Четвёртая</b><span>сущность или субстанция у алтаря своей крови · корона крови</span></div></div><p><b>Огонь не берёт своё.</b> Брошенные в лаву или огонь клинки пепельной крови и адские материалы не сгорают.</p><p><b>Крылья.</b> С третьей формой у небесной и ночной небесной крови вырастают крылья, на которых они летают: голубые и синие. С четвёртой формой крылья появляются и у пепельной крови — огненные, и у крови предков — зелёные.</p><p><b>У небесной крови нет четвёртой формы.</b> Сломав <b>Печать ночи</b>, небесная кровь становится <b>ночной небесной</b>. С тех пор по ночам появляется <b>Тёмный храм</b> — там ночная кровь растёт дальше.</p><p><b>Техноорганическая кровь</b> растёт иначе: вторая форма — победа в рейде фабрики, третья — три подвига в любом порядке, четвёртая — Чёрная субстанция, сданная на терминале фабрики.</p>', 6)),
        createBaseVNode("div", _hoisted_10$1, [
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
                  createBaseVNode("th", _hoisted_11$1, [
                    createVNode(_sfc_main$l, {
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
        _cache[9] || (_cache[9] = createBaseVNode("p", { class: "small muted" }, "Третий подвиг — выковать любой клинок у любого алтаря. Подвиги засчитываются, пока кровь во второй форме.", -1)),
        _cache[10] || (_cache[10] = createBaseVNode("p", null, [
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
        createBaseVNode("div", _hoisted_12$1, [
          createBaseVNode("table", null, [
            _cache[5] || (_cache[5] = createBaseVNode("thead", null, [
              createBaseVNode("tr", null, [
                createBaseVNode("th", null, "Кровь"),
                createBaseVNode("th", null, "Первая форма"),
                createBaseVNode("th", null, "Вторая"),
                createBaseVNode("th", null, "Третья"),
                createBaseVNode("th", null, "Четвёртая · дар")
              ])
            ], -1)),
            createBaseVNode("tbody", null, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(data).blood, (b) => {
                return openBlock(), createElementBlock("tr", {
                  key: b.id
                }, [
                  createBaseVNode("th", _hoisted_13, [
                    createVNode(_sfc_main$l, {
                      colour: b.colour
                    }, null, 8, ["colour"]),
                    createTextVNode(toDisplayString(b.title), 1)
                  ]),
                  b.formless ? (openBlock(), createElementBlock("td", _hoisted_14, [
                    createTextVNode(toDisplayString(b.perks.join(" ")) + " ", 1),
                    _cache[4] || (_cache[4] = createBaseVNode("span", { class: "muted small" }, "Форм нет: всё сразу.", -1))
                  ])) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(b.perks, (perk, i) => {
                      return openBlock(), createElementBlock("td", { key: i }, toDisplayString(perk), 1);
                    }), 128)),
                    b.perks.length < 4 ? (openBlock(), createElementBlock("td", _hoisted_15, "Нет: Печать ночи делает её ночной небесной кровью третьей формы, четвёртая — уже у ночной")) : createCommentVNode("", true)
                  ], 64))
                ]);
              }), 128))
            ])
          ])
        ]),
        _cache[11] || (_cache[11] = createStaticVNode('<p class="small muted">Сменить кровь можно у алтаря её святилища — кроме ночной, бездны и техноорганической.</p><p><b>Кровь бездны</b> не выбирают и не покупают. Её получает тот, кто выковал <b>Все-Чёрный</b>: в тот же миг кровь меняется на бездну — навсегда. У бездны нет форм, подвигов и испытаний. Выковать Все-Чёрный можно из <b>короны своей крови</b> и <b>Чёрной субстанции</b> у алтаря <b>своего</b> храма — и храм за это <b>гневается</b>.</p><p><b>Техноорганическую кровь</b> принимают на терминале Древней фабрики. Вместе с ней вы получаете <b>Энцефало-меч</b>: он сам растёт вместе с кровью — в <b>Энцефало-клинок</b>, а затем в <b>Антихрист</b> — и возвращается к вам после смерти.</p><p class="small">Алтарь фабрики собирает своей крови <b>призывные машины</b>: медного голема, малого Предвестника и Сборочный купол.</p><h3>Путеводитель</h3><p>Сразу после крови выбирается голос, что будет с вами в пути: он даёт советы, рассказывает легенды и отзывается на то, что с вами происходит. Каждая реплика звучит один раз.</p><div class="tbl"><table><thead><tr><th>Голос</th><th>Какой</th></tr></thead><tbody><tr><td>Путеводитель</td><td>старый хранитель знаний о клинках: тёплый, насмешливый, говорит загадками</td></tr><tr><td>ZorahM-GPT</td><td>разум Древней фабрики: язвительный, спокойный, презирает органику и не скрывает своих целей</td></tr><tr><td>Наблюдатель</td><td>древний свидетель: торжественный и печальный, рассказывает легенды о Все-Чёрном</td></tr></tbody></table></div><p class="small muted">Кровь бездны всегда слышит Наблюдателя, техноорганическая — ZorahM-GPT: их выбор голоса не касается.</p><h3>Книги</h3><p>Выбрав кровь, игрок получает <b>книгу своей крови</b>. Оператор сервера получает ещё и <b>книгу хранителя</b>.</p>', 10))
      ]);
    };
  }
};
const _hoisted_1$2 = { id: "trophies" };
const _hoisted_2$1 = {
  class: "filters",
  role: "group",
  "aria-label": "Тип достижения"
};
const _hoisted_3$1 = ["aria-pressed", "onClick"];
const _hoisted_4$1 = { class: "group" };
const _hoisted_5$1 = { class: "advs" };
const _hoisted_6$1 = ["title"];
const _hoisted_7$1 = ["src"];
const _hoisted_8 = { class: "toast-head" };
const _hoisted_9 = { class: "toast-title" };
const _hoisted_10 = { class: "quote" };
const _hoisted_11 = { class: "cond" };
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
        createVNode(_sfc_main$f, {
          title: "Достижения",
          icon: "royal_clock"
        }, {
          default: withCtx(() => [..._cache[0] || (_cache[0] = [
            createBaseVNode("p", { class: "lead" }, "Отдельная вкладка в меню достижений.", -1)
          ])]),
          _: 1
        }),
        createBaseVNode("div", _hoisted_2$1, [
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
                      createBaseVNode("p", _hoisted_8, toDisplayString(TOAST[a.frame] || a.frameLabel), 1),
                      createBaseVNode("h4", _hoisted_9, toDisplayString(a.title), 1)
                    ])
                  ], 2),
                  createBaseVNode("p", _hoisted_10, "«" + toDisplayString(a.description) + "»", 1),
                  createBaseVNode("p", _hoisted_11, toDisplayString(a.condition), 1)
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
const _hoisted_2 = { class: "twocol" };
const _hoisted_3 = { class: "term" };
const _hoisted_4 = { class: "term-body" };
const _hoisted_5 = { class: "t-k" };
const _hoisted_6 = { class: "t-v" };
const _hoisted_7 = {
  key: 1,
  class: "t-c"
};
const _sfc_main$1 = {
  __name: "AdminSection",
  setup(__props) {
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
        createVNode(_sfc_main$f, {
          title: "Для администратора",
          icon: "ancient_part"
        }),
        createBaseVNode("div", _hoisted_2, [
          _cache[4] || (_cache[4] = createStaticVNode('<figure class="term"><figcaption class="term-bar"><span class="term-dots" aria-hidden="true"><i></i><i></i><i></i></span>Установка</figcaption><pre class="term-body"><code><span class="t-c"># собрать плагин (нужна Java 21+; на Windows — gradlew.bat build)</span>\n<span class="t-p">$</span> ./gradlew build\n<span class="t-c"># положить в папку плагинов сервера Paper 1.21.11</span>\n<span class="t-p">$</span> cp build/libs/virusswords-1.0.0.jar server/plugins/\n<span class="t-c"># раздать ресурспак (клиент 1.21.6+): строка в server.properties</span>\n<span class="t-k">resource-pack</span>=<span class="t-v">https://…/VirusSwords-ResourcePack.zip</span>\n<span class="t-c"># первый запуск: плагин сам ставит датапак достижений</span>\n<span class="t-c"># и один раз перезагружает данные</span>\n<span class="t-p">$</span> java -jar paper.jar --nogui\n<span class="t-ok">[VirusSwords] Enabling VirusSwords v1.0.0</span><span class="term-caret" aria-hidden="true"></span></code></pre></figure>', 1)),
          createBaseVNode("figure", _hoisted_3, [
            _cache[3] || (_cache[3] = createBaseVNode("figcaption", { class: "term-bar" }, [
              createBaseVNode("span", {
                class: "term-dots",
                "aria-hidden": "true"
              }, [
                createBaseVNode("i"),
                createBaseVNode("i"),
                createBaseVNode("i")
              ]),
              createTextVNode("Главное в config.yml")
            ], -1)),
            createBaseVNode("pre", _hoisted_4, [
              createBaseVNode("code", null, [
                (openBlock(), createElementBlock(Fragment, null, renderList(CONFIG, ([key, value, note], i) => {
                  return openBlock(), createElementBlock(Fragment, { key: i }, [
                    createBaseVNode("span", _hoisted_5, toDisplayString(key), 1),
                    _cache[1] || (_cache[1] = createTextVNode(":", -1)),
                    value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                      _cache[0] || (_cache[0] = createTextVNode()),
                      createBaseVNode("span", _hoisted_6, toDisplayString(value), 1)
                    ], 64)) : createCommentVNode("", true),
                    note ? (openBlock(), createElementBlock("span", _hoisted_7, "  # " + toDisplayString(note), 1)) : createCommentVNode("", true),
                    _cache[2] || (_cache[2] = createTextVNode("\n", -1))
                  ], 64);
                }), 64))
              ])
            ])
          ])
        ]),
        _cache[5] || (_cache[5] = createBaseVNode("footer", null, [
          createBaseVNode("span", null, "Кодекс собран из исходников плагина: имена, описания, урон, цены алтарей и достижения взяты прямо из кода."),
          createBaseVNode("span", null, "Модели оружия — ресурспаки Fantasy Weapons (автор nongkos) и Blades of Majestica, используются приватно.")
        ], -1))
      ]);
    };
  }
};
const _hoisted_1 = { class: "shell" };
const _sfc_main = {
  __name: "App",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createVNode(_sfc_main$i),
        createVNode(_sfc_main$h),
        _cache[0] || (_cache[0] = createBaseVNode("a", {
          class: "skip",
          href: "#weapons"
        }, "К оружию", -1)),
        createBaseVNode("div", _hoisted_1, [
          createVNode(_sfc_main$t),
          createBaseVNode("main", null, [
            createVNode(_sfc_main$q),
            createVNode(_sfc_main$e),
            createVNode(_sfc_main$d),
            createVNode(_sfc_main$c),
            createVNode(_sfc_main$b),
            createVNode(_sfc_main$a),
            createVNode(_sfc_main$8),
            createVNode(_sfc_main$5),
            createVNode(_sfc_main$4),
            createVNode(_sfc_main$3),
            createVNode(_sfc_main$2),
            createVNode(_sfc_main$1)
          ])
        ]),
        createVNode(_sfc_main$j),
        createVNode(_sfc_main$g)
      ], 64);
    };
  }
};
createApp(_sfc_main).mount("#app");
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
