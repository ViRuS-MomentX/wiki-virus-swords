import { c as computed, r as reactive, o as onMounted, a as onBeforeUnmount, b as openBlock, d as createElementBlock, e as createBaseVNode, u as unref, w as withDirectives, v as vModelText, t as toDisplayString, F as Fragment, f as renderList, g as ref, n as normalizeClass, h as createTextVNode, i as createCommentVNode, j as renderSlot, k as normalizeStyle, l as createVNode, m as withCtx, p as createStaticVNode, q as createBlock, s as createApp, x as nextTick } from "./vue.js";
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
const _hoisted_1$h = { class: "side" };
const _hoisted_2$d = {
  class: "brand",
  href: "#top"
};
const _hoisted_3$d = ["src"];
const _hoisted_4$c = { class: "search" };
const _hoisted_5$c = { class: "search-hint" };
const _hoisted_6$c = {
  class: "nav",
  "aria-label": "Разделы"
};
const _hoisted_7$b = ["href"];
const _hoisted_8$a = {
  key: 0,
  class: "count"
};
const _sfc_main$j = {
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
    const onSearch = () => {
      filters.query = norm(search.value.trim());
    };
    let observer;
    onMounted(() => {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) current.value = entry.target.id;
        });
      }, { rootMargin: "-35% 0px -60% 0px" });
      document.querySelectorAll("main section[id]").forEach((s) => observer.observe(s));
    });
    onBeforeUnmount(() => observer == null ? void 0 : observer.disconnect());
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("aside", _hoisted_1$h, [
        createBaseVNode("a", _hoisted_2$d, [
          createBaseVNode("img", {
            class: "brand-mark",
            src: unref(data).icons.forge_heart,
            alt: ""
          }, null, 8, _hoisted_3$d),
          _cache[1] || (_cache[1] = createBaseVNode("span", { class: "brand-name" }, "Кодекс VirusSwords", -1))
        ]),
        createBaseVNode("div", _hoisted_4$c, [
          _cache[2] || (_cache[2] = createBaseVNode("label", {
            for: "q",
            class: "eyebrow",
            style: { "display": "block", "margin-bottom": "6px" }
          }, "Поиск", -1)),
          withDirectives(createBaseVNode("input", {
            id: "q",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => search.value = $event),
            type: "search",
            placeholder: "Клинок, материал, ачивка…",
            autocomplete: "off",
            onInput: onSearch
          }, null, 544), [
            [vModelText, search.value]
          ]),
          createBaseVNode("div", _hoisted_5$c, toDisplayString(unref(hint)), 1)
        ]),
        createBaseVNode("nav", _hoisted_6$c, [
          (openBlock(), createElementBlock(Fragment, null, renderList(sections, ([id, title, count]) => {
            return createBaseVNode("a", {
              key: id,
              href: `#${id}`,
              class: normalizeClass({ on: current.value === id })
            }, [
              createTextVNode(toDisplayString(title), 1),
              count ? (openBlock(), createElementBlock("span", _hoisted_8$a, toDisplayString(count), 1)) : createCommentVNode("", true)
            ], 10, _hoisted_7$b);
          }), 64))
        ]),
        _cache[3] || (_cache[3] = createBaseVNode("div", { class: "side-foot" }, "Плагин для Paper 1.21.11. Модели — ресурспаки Fantasy Weapons (nongkos) и Blades of Majestica.", -1))
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
const _sfc_main$i = {
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
const _hoisted_1$g = {
  id: "top",
  class: "hero"
};
const _hoisted_2$c = { class: "facts" };
const _hoisted_3$c = { class: "hotbar-wrap" };
const _hoisted_4$b = {
  class: "held-name",
  "aria-live": "polite"
};
const _hoisted_5$b = {
  class: "hotbar",
  role: "toolbar",
  "aria-label": "Хотбар: старшие клинки"
};
const _hoisted_6$b = ["aria-label", "onClick", "onFocus", "onDblclick"];
const _hoisted_7$a = ["src"];
const _sfc_main$h = {
  __name: "HeroBanner",
  setup(__props) {
    const slots = data.hotbar.map(item);
    const selected = ref(0);
    const held = computed(() => slots[selected.value]);
    function onKey(e) {
      if (e.target.matches("input, textarea")) return;
      const n = Number(e.key);
      if (n >= 1 && n <= slots.length) selected.value = n - 1;
    }
    const open = (id) => {
      window.location.hash = `w-${id}`;
    };
    onMounted(() => document.addEventListener("keydown", onKey));
    onBeforeUnmount(() => document.removeEventListener("keydown", onKey));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("header", _hoisted_1$g, [
        _cache[3] || (_cache[3] = createBaseVNode("div", { class: "eyebrow" }, "Вики плагина · Paper 1.21.11", -1)),
        _cache[4] || (_cache[4] = createBaseVNode("h1", null, [
          createTextVNode("Кодекс "),
          createBaseVNode("em", null, "VirusSwords")
        ], -1)),
        _cache[5] || (_cache[5] = createBaseVNode("p", { class: "lead" }, "Клинки, которые находят в мире, куют из душ и доводят до последней формы у алтарей святилищ. Здесь — каждый клинок и что он умеет, откуда он берётся, как растёт, кто стережёт святилища и что за это даёт мир.", -1)),
        createBaseVNode("div", _hoisted_2$c, [
          createBaseVNode("span", null, [
            createBaseVNode("b", null, toDisplayString(unref(data).counts.weapons), 1),
            createTextVNode(toDisplayString(unref(data).words.weapons), 1)
          ]),
          createBaseVNode("span", null, [
            createBaseVNode("b", null, toDisplayString(unref(data).counts.materials), 1),
            createTextVNode(toDisplayString(unref(data).words.materials), 1)
          ]),
          _cache[1] || (_cache[1] = createBaseVNode("span", null, [
            createBaseVNode("b", null, "5"),
            createTextVNode("святилищ")
          ], -1)),
          createBaseVNode("span", null, [
            createBaseVNode("b", null, toDisplayString(unref(data).blood.length), 1),
            _cache[0] || (_cache[0] = createTextVNode("родословных", -1))
          ]),
          createBaseVNode("span", null, [
            createBaseVNode("b", null, toDisplayString(unref(data).counts.trophies), 1),
            createTextVNode(toDisplayString(unref(data).words.trophies), 1)
          ])
        ]),
        createBaseVNode("div", _hoisted_3$c, [
          createBaseVNode("div", _hoisted_4$b, [
            createVNode(_sfc_main$i, {
              rarity: held.value.rarity
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(held.value.name), 1)
              ]),
              _: 1
            }, 8, ["rarity"])
          ]),
          createBaseVNode("div", _hoisted_5$b, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(unref(slots), (slot, i) => {
              return openBlock(), createElementBlock("button", {
                key: slot.id,
                class: normalizeClass(["hslot", { sel: i === selected.value }]),
                "aria-label": slot.name,
                onClick: ($event) => selected.value = i,
                onFocus: ($event) => selected.value = i,
                onDblclick: ($event) => open(slot.id)
              }, [
                createBaseVNode("img", {
                  src: slot.icon,
                  alt: ""
                }, null, 8, _hoisted_7$a)
              ], 42, _hoisted_6$b);
            }), 128))
          ]),
          _cache[2] || (_cache[2] = createBaseVNode("div", { class: "hotbar-note" }, "Выберите слот — или клавиши 1–9, как в игре. Двойной клик открывает карточку.", -1))
        ])
      ]);
    };
  }
};
const _hoisted_1$f = { id: "start" };
const _sfc_main$g = {
  __name: "StartSection",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$f, [..._cache[0] || (_cache[0] = [
        createStaticVNode('<div class="sec-head"><div class="eyebrow">Первые шаги</div><h2>С чего начать</h2></div><ol class="steps"><li><h4>Выберите кровь</h4><p>При первом входе откроется выбор родословной. От неё зависят ваша сила, книга, которую вы получите, и то, какие величайшие клинки вас признают.</p></li><li><h4>Выберите путеводителя</h4><p>Следом — чей голос будет с вами: Путеводитель с загадками, Claude, разум Древней фабрики, или Наблюдатель, помнящий Все-Чёрного с первого удара.</p></li><li><h4>Найдите первый клинок</h4><p>Погибель и Резак лежат в сундуках древнего города, Арахнид — в вагонетках заброшенных шахт, Сумрачная секира — в крепостях Незера.</p></li><li><h4>Добудьте Душу демона</h4><p>Она лежит в сокровищнице бастиона. Клинок плюс Душа на верстаке — и он становится адским.</p></li><li><h4>Растите мастерство</h4><p>Клинок учится от каждого удара. Мастерство открывает заточку и пробуждение; эволюция просит только материалы.</p></li><li><h4>Найдите святилище</h4><p>Дорогу к святилищам покажут компасы и карты. Пробейтесь через стражу — и алтарь откроет испытания.</p></li><li><h4>Куйте последнюю форму</h4><p>Высшие клинки — Все-Чёрный, Люцифер, Истинный Экскалибур и Селестиал — куют у алтарей святилищ. Корона отвечает только крови в четвёртой форме, а Все-Чёрный навсегда меняет кровь на бездну.</p></li></ol><p class="small muted">Сервер узнаёт о ваших делах: первый выкованный, улучшенный или собранный клинок, сломанная Печать ночи, вытянутая Луна и сработавшие Королевские часы объявляются в чате всем — имя клинка можно навести мышью и рассмотреть. Способности с долгой перезарядкой видят только игроки рядом.</p>', 3)
      ])]);
    };
  }
};
const _hoisted_1$e = { id: "rarity" };
const _hoisted_2$b = { class: "rarities" };
const _hoisted_3$b = { class: "rchip" };
const _hoisted_4$a = { class: "rmeta" };
const _hoisted_5$a = { class: "swatches" };
const _hoisted_6$a = ["title"];
const _hoisted_7$9 = { class: "muted small" };
const _hoisted_8$9 = { class: "small" };
const _hoisted_9$7 = {
  key: 1,
  class: "muted"
};
const _sfc_main$f = {
  __name: "RaritySection",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$e, [
        _cache[0] || (_cache[0] = createBaseVNode("div", { class: "sec-head" }, [
          createBaseVNode("div", { class: "eyebrow" }, "Цвет имени"),
          createBaseVNode("h2", null, "Редкости"),
          createBaseVNode("p", { class: "lead" }, "Имя каждого предмета окрашено градиентом своей редкости. Старшие редкости переливаются.")
        ], -1)),
        createBaseVNode("div", _hoisted_2$b, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(data).rarities, (r) => {
            return openBlock(), createElementBlock("div", {
              key: r.const,
              class: "rarity"
            }, [
              createBaseVNode("div", _hoisted_3$b, [
                createVNode(_sfc_main$i, {
                  rarity: r.const
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(r.label), 1)
                  ]),
                  _: 2
                }, 1032, ["rarity"])
              ]),
              createBaseVNode("div", _hoisted_4$a, [
                createBaseVNode("div", _hoisted_5$a, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(r.palette, (c) => {
                    return openBlock(), createElementBlock("span", {
                      key: c,
                      class: "sw",
                      style: normalizeStyle({ background: c }),
                      title: c
                    }, null, 12, _hoisted_6$a);
                  }), 128))
                ]),
                createBaseVNode("div", _hoisted_7$9, toDisplayString(r.motion), 1),
                createBaseVNode("div", _hoisted_8$9, [
                  r.used.length ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                    createTextVNode(toDisplayString(r.used.join(", ")), 1)
                  ], 64)) : (openBlock(), createElementBlock("span", _hoisted_9$7, "пока ничем не окрашена"))
                ])
              ])
            ]);
          }), 128))
        ])
      ]);
    };
  }
};
const _hoisted_1$d = { class: "tip" };
const _hoisted_2$a = ["innerHTML"];
const _hoisted_3$a = { class: "tlore" };
const _hoisted_4$9 = {
  key: 0,
  class: "gap"
};
const _hoisted_5$9 = ["innerHTML"];
const _hoisted_6$9 = {
  key: 0,
  class: "tstats"
};
const _hoisted_7$8 = { key: 0 };
const _hoisted_8$8 = { class: "trar" };
const _sfc_main$e = {
  __name: "ItemTooltip",
  props: { item: { type: Object, required: true } },
  setup(__props) {
    const props = __props;
    const stats = computed(() => props.item.stats.split(/(\d+(?:\.\d+)?)/));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$d, [
        createBaseVNode("div", {
          class: "tname paint",
          style: normalizeStyle(unref(rarityStyle)(__props.item.rarity)),
          innerHTML: __props.item.name
        }, null, 12, _hoisted_2$a),
        createBaseVNode("div", _hoisted_3$a, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(__props.item.lore, (line, i) => {
            return openBlock(), createElementBlock(Fragment, { key: i }, [
              line === "" ? (openBlock(), createElementBlock("div", _hoisted_4$9)) : (openBlock(), createElementBlock("div", {
                key: 1,
                innerHTML: line
              }, null, 8, _hoisted_5$9))
            ], 64);
          }), 128))
        ]),
        __props.item.stats ? (openBlock(), createElementBlock("div", _hoisted_6$9, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(stats.value, (part, i) => {
            return openBlock(), createElementBlock(Fragment, { key: i }, [
              i % 2 ? (openBlock(), createElementBlock("b", _hoisted_7$8, toDisplayString(part), 1)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                createTextVNode(toDisplayString(part), 1)
              ], 64))
            ], 64);
          }), 128))
        ])) : createCommentVNode("", true),
        createBaseVNode("div", _hoisted_8$8, [
          _cache[0] || (_cache[0] = createTextVNode("Редкость: ", -1)),
          createVNode(_sfc_main$i, {
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
const _hoisted_1$c = ["aria-label"];
const _hoisted_2$9 = { class: "craft-table" };
const _hoisted_3$9 = { class: "craft-grid" };
const _hoisted_4$8 = ["href", "title"];
const _hoisted_5$8 = ["src", "alt"];
const _hoisted_6$8 = ["title"];
const _hoisted_7$7 = ["src", "alt"];
const _hoisted_8$7 = {
  key: 2,
  class: "cslot"
};
const _hoisted_9$6 = ["title"];
const _hoisted_10$4 = ["src", "alt"];
const _hoisted_11$3 = { key: 0 };
const _hoisted_12$3 = {
  key: 0,
  class: "note"
};
const _sfc_main$d = {
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
    const cells = computed(() => props.recipe.grid.map(resolve));
    const result = computed(() => resolve(props.recipe.result));
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e;
      return openBlock(), createElementBlock("figure", {
        class: normalizeClass(["craft", { small: __props.small }]),
        "aria-label": `Рецепт: ${(_a = result.value) == null ? void 0 : _a.name}`
      }, [
        createBaseVNode("div", _hoisted_2$9, [
          createBaseVNode("div", _hoisted_3$9, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(cells.value, (c, i) => {
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
                  }, null, 8, _hoisted_5$8)
                ], 10, _hoisted_4$8)) : c ? (openBlock(), createElementBlock("span", {
                  key: 1,
                  class: "cslot",
                  title: c.name
                }, [
                  createBaseVNode("img", {
                    src: c.icon,
                    alt: c.name
                  }, null, 8, _hoisted_7$7)
                ], 8, _hoisted_6$8)) : (openBlock(), createElementBlock("span", _hoisted_8$7))
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
            }, null, 8, _hoisted_10$4)
          ], 8, _hoisted_9$6)
        ]),
        !__props.small ? (openBlock(), createElementBlock("figcaption", _hoisted_11$3, [
          createBaseVNode("b", null, toDisplayString((_e = result.value) == null ? void 0 : _e.name), 1),
          __props.recipe.note ? (openBlock(), createElementBlock("span", _hoisted_12$3, toDisplayString(__props.recipe.note), 1)) : createCommentVNode("", true)
        ])) : createCommentVNode("", true)
      ], 10, _hoisted_1$c);
    };
  }
};
const _hoisted_1$b = { class: "abilities" };
const _hoisted_2$8 = { class: "chips" };
const _hoisted_3$8 = {
  key: 0,
  class: "chip"
};
const _hoisted_4$7 = {
  viewBox: "0 0 16 16",
  "aria-hidden": "true"
};
const _hoisted_5$7 = {
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
const _hoisted_6$7 = ["d", "fill", "stroke-width"];
const _hoisted_7$6 = {
  key: 1,
  class: "chip rest"
};
const _hoisted_8$6 = ["innerHTML"];
const _sfc_main$c = {
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
      return openBlock(), createElementBlock("div", _hoisted_1$b, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(__props.abilities, (a) => {
          return openBlock(), createElementBlock("article", {
            key: a.name,
            class: "ability",
            style: normalizeStyle({ "--c": a.colour })
          }, [
            createBaseVNode("header", null, [
              createBaseVNode("h4", null, toDisplayString(a.name), 1),
              createBaseVNode("div", _hoisted_2$8, [
                a.trigger ? (openBlock(), createElementBlock("span", _hoisted_3$8, [
                  (openBlock(), createElementBlock("svg", _hoisted_4$7, [
                    mouse(a.kind) ? (openBlock(), createElementBlock("rect", _hoisted_5$7)) : createCommentVNode("", true),
                    createBaseVNode("path", {
                      d: ICONS[a.kind],
                      fill: a.kind === "hit" || a.kind === "other" ? "none" : "currentColor",
                      stroke: "currentColor",
                      "stroke-width": a.kind === "hit" || a.kind === "other" || a.kind === "hold" ? 1.4 : 0,
                      "stroke-linecap": "round"
                    }, null, 8, _hoisted_6$7)
                  ])),
                  createTextVNode(toDisplayString(a.trigger), 1)
                ])) : createCommentVNode("", true),
                a.rest ? (openBlock(), createElementBlock("span", _hoisted_7$6, [
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
            }, null, 8, _hoisted_8$6)) : createCommentVNode("", true)
          ], 4);
        }), 128))
      ]);
    };
  }
};
const _hoisted_1$a = ["id"];
const _hoisted_2$7 = { class: "card-top" };
const _hoisted_3$7 = { class: "slot" };
const _hoisted_4$6 = ["src"];
const _hoisted_5$6 = { class: "obtain" };
const _hoisted_6$6 = { class: "obtain-head" };
const _hoisted_7$5 = ["href"];
const _hoisted_8$5 = ["innerHTML"];
const _hoisted_9$5 = ["innerHTML"];
const _sfc_main$b = {
  __name: "ItemCard",
  props: { item: { type: Object, required: true } },
  setup(__props) {
    const props = __props;
    const recipe = computed(() => props.item.recipe ? data.recipes.find((r) => r.result === props.item.id) : null);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("article", {
        id: `w-${__props.item.id}`,
        class: "card"
      }, [
        createBaseVNode("div", _hoisted_2$7, [
          createBaseVNode("span", _hoisted_3$7, [
            createBaseVNode("img", {
              src: __props.item.icon,
              alt: ""
            }, null, 8, _hoisted_4$6)
          ]),
          createVNode(_sfc_main$e, { item: __props.item }, null, 8, ["item"])
        ]),
        __props.item.abilities && __props.item.abilities.length ? (openBlock(), createBlock(_sfc_main$c, {
          key: 0,
          abilities: __props.item.abilities
        }, null, 8, ["abilities"])) : createCommentVNode("", true),
        createBaseVNode("div", _hoisted_5$6, [
          createBaseVNode("div", _hoisted_6$6, [
            _cache[0] || (_cache[0] = createBaseVNode("span", { class: "eyebrow" }, "Как получить", -1)),
            createBaseVNode("a", {
              class: normalizeClass(["mbadge", `m-${__props.item.method}`]),
              href: recipe.value ? "#craft" : "#craft-other"
            }, toDisplayString(__props.item.methodLabel), 11, _hoisted_7$5)
          ]),
          recipe.value ? (openBlock(), createBlock(_sfc_main$d, {
            key: 0,
            recipe: recipe.value,
            small: ""
          }, null, 8, ["recipe"])) : createCommentVNode("", true),
          createBaseVNode("p", {
            class: "obtain-text",
            innerHTML: recipe.value ? recipe.value.note : __props.item.obtain
          }, null, 8, _hoisted_8$5),
          recipe.value && __props.item.obtain.includes(" или ") ? (openBlock(), createElementBlock("p", {
            key: 1,
            class: "obtain-text muted",
            innerHTML: __props.item.obtain
          }, null, 8, _hoisted_9$5)) : createCommentVNode("", true)
        ])
      ], 8, _hoisted_1$a);
    };
  }
};
const _hoisted_1$9 = { id: "weapons" };
const _hoisted_2$6 = { class: "chains" };
const _hoisted_3$6 = { class: "chain-title" };
const _hoisted_4$5 = { class: "chain-row" };
const _hoisted_5$5 = {
  key: 0,
  class: "arrow",
  "aria-hidden": "true"
};
const _hoisted_6$5 = ["href"];
const _hoisted_7$4 = { class: "slot sm" };
const _hoisted_8$4 = ["src"];
const _hoisted_9$4 = { class: "cname" };
const _hoisted_10$3 = {
  class: "filters",
  role: "group",
  "aria-label": "Фильтр по линии"
};
const _hoisted_11$2 = ["aria-pressed", "onClick"];
const _hoisted_12$2 = { class: "grid" };
const _hoisted_13$2 = {
  key: 0,
  class: "empty"
};
const _sfc_main$a = {
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
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$9, [
        _cache[0] || (_cache[0] = createBaseVNode("div", { class: "sec-head" }, [
          createBaseVNode("div", { class: "eyebrow" }, "Арсенал"),
          createBaseVNode("h2", null, "Оружие"),
          createBaseVNode("p", { class: "lead" }, "Клинки выстроены в линии: от находки в мире до неломаемого оружия. Нажмите на клинок, чтобы открыть его карточку.")
        ], -1)),
        createBaseVNode("div", _hoisted_2$6, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(data).chains, (chain) => {
            return openBlock(), createElementBlock("div", {
              key: chain.key,
              class: "chain"
            }, [
              createBaseVNode("div", _hoisted_3$6, toDisplayString(chain.title), 1),
              createBaseVNode("div", _hoisted_4$5, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(chain.entries, (entry) => {
                  return openBlock(), createElementBlock(Fragment, {
                    key: entry.id
                  }, [
                    entry.sep ? (openBlock(), createElementBlock("span", _hoisted_5$5, toDisplayString(entry.sep), 1)) : createCommentVNode("", true),
                    createBaseVNode("a", {
                      class: "chainitem",
                      href: `#w-${entry.id}`
                    }, [
                      createBaseVNode("span", _hoisted_7$4, [
                        createBaseVNode("img", {
                          src: unref(item)(entry.id).icon,
                          alt: ""
                        }, null, 8, _hoisted_8$4)
                      ]),
                      createBaseVNode("span", _hoisted_9$4, toDisplayString(unref(item)(entry.id).name), 1)
                    ], 8, _hoisted_6$5)
                  ], 64);
                }), 128))
              ])
            ]);
          }), 128))
        ]),
        createBaseVNode("div", _hoisted_10$3, [
          (openBlock(), createElementBlock(Fragment, null, renderList(lines, ([key, title]) => {
            return createBaseVNode("button", {
              key,
              class: "chip",
              "aria-pressed": String(unref(filters).line === key),
              onClick: ($event) => unref(filters).line = key
            }, toDisplayString(title), 9, _hoisted_11$2);
          }), 64))
        ]),
        createBaseVNode("div", _hoisted_12$2, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(weapons), (w) => {
            return openBlock(), createBlock(_sfc_main$b, {
              key: w.id,
              item: w
            }, null, 8, ["item"]);
          }), 128))
        ]),
        !unref(weapons).length ? (openBlock(), createElementBlock("p", _hoisted_13$2, "Ничего не нашлось — попробуйте другое слово.")) : createCommentVNode("", true)
      ]);
    };
  }
};
const _hoisted_1$8 = { id: "materials" };
const _hoisted_2$5 = { class: "grid" };
const _hoisted_3$5 = {
  key: 0,
  class: "empty"
};
const _sfc_main$9 = {
  __name: "MaterialsSection",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$8, [
        _cache[0] || (_cache[0] = createBaseVNode("div", { class: "sec-head" }, [
          createBaseVNode("div", { class: "eyebrow" }, "Из чего куют"),
          createBaseVNode("h2", null, "Материалы"),
          createBaseVNode("p", { class: "lead" }, "Душа демона и терра-слиток — для крафта. Осколки и детали — валюта святилищ, сердца, перо и ядро — реликвии их стражей. В обычные рецепты и торговлю материалы не уходят.")
        ], -1)),
        createBaseVNode("div", _hoisted_2$5, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(materials), (m) => {
            return openBlock(), createBlock(_sfc_main$b, {
              key: m.id,
              item: m
            }, null, 8, ["item"]);
          }), 128))
        ]),
        !unref(materials).length ? (openBlock(), createElementBlock("p", _hoisted_3$5, "Ничего не нашлось.")) : createCommentVNode("", true)
      ]);
    };
  }
};
const _hoisted_1$7 = { id: "craft" };
const _hoisted_2$4 = { class: "sec-head" };
const _hoisted_3$4 = { class: "lead" };
const _hoisted_4$4 = { class: "crafts" };
const _hoisted_5$4 = { class: "methods" };
const _hoisted_6$4 = { class: "muted small" };
const _hoisted_7$3 = { class: "small" };
const _hoisted_8$3 = { class: "mitems" };
const _hoisted_9$3 = ["href", "title"];
const _hoisted_10$2 = ["src"];
const _sfc_main$8 = {
  __name: "CraftingSection",
  setup(__props) {
    const ORDER = ["forge", "evolve", "assemble", "grows", "loot", "drop", "trial", "gift", "place"];
    const HOW = {
      forge: "Правый клик по алтарю святилища → «Выковать».",
      evolve: "Клинок в руке, правый клик по алтарю → «Эволюция».",
      assemble: "Собирается у алтаря святилища.",
      grows: "Меняется сам, когда носитель проходит испытание или поднимает форму крови.",
      loot: "Лежит в сундуках мира.",
      drop: "Падает с босса или сильного моба.",
      trial: "Награда за испытание святилища.",
      gift: "Святилище вручает само, вместе с кровью.",
      place: "Берётся прямо в святилище."
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
      return openBlock(), createElementBlock("section", _hoisted_1$7, [
        createBaseVNode("div", _hoisted_2$4, [
          _cache[0] || (_cache[0] = createBaseVNode("div", { class: "eyebrow" }, "Верстак и алтарь", -1)),
          _cache[1] || (_cache[1] = createBaseVNode("h2", null, "Крафт", -1)),
          createBaseVNode("p", _hoisted_3$4, "На верстаке делается " + toDisplayString(unref(data).recipes.length) + " вещей. Остальное куют у алтарей святилищ или находят.", 1)
        ]),
        createBaseVNode("div", _hoisted_4$4, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(data).recipes, (r) => {
            return openBlock(), createBlock(_sfc_main$d, {
              key: r.result,
              recipe: r
            }, null, 8, ["recipe"]);
          }), 128))
        ]),
        _cache[2] || (_cache[2] = createBaseVNode("div", { class: "callout" }, [
          createBaseVNode("b", null, "Если результат не появляется"),
          createTextVNode(" — проверьте, что предметы плагина настоящие: обычный меч вместо Погибели рецепт не примет. ")
        ], -1)),
        _cache[3] || (_cache[3] = createBaseVNode("h3", { id: "craft-other" }, "Не на верстаке", -1)),
        createBaseVNode("div", _hoisted_5$4, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(groups.value, (g) => {
            return openBlock(), createElementBlock("article", {
              key: g.key,
              class: "method"
            }, [
              createBaseVNode("header", null, [
                createBaseVNode("span", {
                  class: normalizeClass(["mbadge", `m-${g.key}`])
                }, toDisplayString(g.label), 3),
                createBaseVNode("span", _hoisted_6$4, toDisplayString(g.items.length), 1)
              ]),
              createBaseVNode("p", _hoisted_7$3, toDisplayString(g.how), 1),
              createBaseVNode("div", _hoisted_8$3, [
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
                    }, null, 8, _hoisted_10$2),
                    createBaseVNode("span", null, toDisplayString(i.name), 1)
                  ], 8, _hoisted_9$3);
                }), 128))
              ])
            ]);
          }), 128))
        ])
      ]);
    };
  }
};
const _hoisted_1$6 = { id: "growth" };
const _hoisted_2$3 = { class: "twocol" };
const _hoisted_3$3 = { class: "panel" };
const _hoisted_4$3 = { class: "tbl" };
const _hoisted_5$3 = { class: "num" };
const _hoisted_6$3 = { class: "num" };
const _sfc_main$7 = {
  __name: "GrowthSection",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$6, [
        _cache[5] || (_cache[5] = createBaseVNode("div", { class: "sec-head" }, [
          createBaseVNode("div", { class: "eyebrow" }, "Три дорожки"),
          createBaseVNode("h2", null, "Рост клинка"),
          createBaseVNode("p", { class: "lead" }, "У каждого клинка три дорожки роста; всё записано на самом клинке.")
        ], -1)),
        createBaseVNode("div", _hoisted_2$3, [
          createBaseVNode("div", _hoisted_3$3, [
            _cache[1] || (_cache[1] = createBaseVNode("div", { class: "eyebrow" }, "1 · от боя", -1)),
            _cache[2] || (_cache[2] = createBaseVNode("h3", null, "Мастерство 0–100", -1)),
            _cache[3] || (_cache[3] = createBaseVNode("p", { class: "small" }, "Клинок учится от нанесённого урона. Каждый уровень даёт +0,1% урона.", -1)),
            createBaseVNode("div", _hoisted_4$3, [
              createBaseVNode("table", null, [
                _cache[0] || (_cache[0] = createBaseVNode("thead", null, [
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
                      createBaseVNode("td", _hoisted_5$3, toDisplayString(row.total), 1),
                      createBaseVNode("td", _hoisted_6$3, toDisplayString(row.bonus), 1),
                      createBaseVNode("td", null, toDisplayString(row.note), 1)
                    ]);
                  }), 128))
                ])
              ])
            ])
          ]),
          _cache[4] || (_cache[4] = createStaticVNode('<div class="panel"><div class="eyebrow">2 · у кузнеца</div><h3>Заточка <span class="stars">★★★★★</span></h3><p class="small">Каждая звезда +4% урона.</p><div class="tbl"><table><thead><tr><th>Звезда</th><th class="num">Мастерство</th><th class="num">Осколки</th><th class="num">Катализатор</th><th>Реликвия</th></tr></thead><tbody><tr><td class="stars">★</td><td class="num">15</td><td class="num">8</td><td class="num">1</td><td>—</td></tr><tr><td class="stars">★★</td><td class="num">30</td><td class="num">16</td><td class="num">2</td><td>—</td></tr><tr><td class="stars">★★★</td><td class="num">45</td><td class="num">24</td><td class="num">3</td><td>—</td></tr><tr><td class="stars">★★★★</td><td class="num">60</td><td class="num">32</td><td class="num">4</td><td>1</td></tr><tr><td class="stars">★★★★★</td><td class="num">75</td><td class="num">40</td><td class="num">5</td><td>1</td></tr></tbody></table></div><p class="small muted">Катализатор: незеритовый лом в кузне, осколки аметиста в храме. Небесные клинки точат в Небесном храме, остальные — в Незеритовой кузне.</p></div><div class="panel"><div class="eyebrow">3 · однажды</div><h3>Пробуждение</h3><p class="small">Один раз за жизнь клинка: нужны заточка ★3, мастерство 50, осколки и реликвия стража.</p><p class="small">Перезарядка способности короче на четверть, урон +5%.</p></div>', 2))
        ]),
        _cache[6] || (_cache[6] = createStaticVNode('<h3>Эволюции у алтарей</h3><div class="tbl"><table><thead><tr><th>Из</th><th>В</th><th>Алтарь</th><th>Цена</th></tr></thead><tbody><tr><td>Погибель</td><td>Бедствие</td><td>Кузня</td><td>8 осколков души, Душа демона</td></tr><tr><td>Бедствие</td><td>Воля Демона</td><td>Кузня</td><td>16 осколков души, Душа Иссушителя</td></tr><tr><td>Воля Демона</td><td><b>Империум</b></td><td>Кузня</td><td>Сердце кузни, 64 осколка души</td></tr><tr><td>Корона своей крови</td><td><b>Все-Чёрный</b></td><td>алтарь своего храма</td><td>Чёрная субстанция; храм гневается</td></tr><tr><td>Убийца демонов</td><td>Сборщик душ</td><td>Кузня</td><td>32 осколка души, незеритовый слиток</td></tr><tr><td>Солнцестояние</td><td>Ночная фурия</td><td>Тёмный храм</td><td>16 небесных осколков, 8 лазуритовых блоков</td></tr><tr><td>Ночная фурия</td><td><b>Реквием девятого неба</b></td><td>Тёмный храм</td><td>64 небесных осколка, Перо серафима, Сердце хранителя</td></tr></tbody></table></div><p class="small">Сумрачная секира меняется сама: в испытании кузни она становится <b>Секирой берсерка</b>, в испытании Небесного храма — <b>Золотым фениксом</b>.</p><p class="small muted">Эволюция просит только материалы. Чары, заточка и пробуждение переходят на новую форму, мастерство начинается с нуля.</p><h3>Доспехи</h3><p>Кнопка в правом нижнем углу алтаря открывает экран доспехов. Защиту даёт каждая часть, а бонус — только полный комплект из четырёх (Dominus Демонического доспеха — от двух).</p><div class="tbl"><table><thead><tr><th>Доспех</th><th>Алтарь и цена за часть</th><th>Когда</th><th>Комплект</th></tr></thead><tbody><tr><td><b>Расплавленный</b></td><td>Кузня: 64 осколка души, незеритовая часть брони, Душа лорда</td><td>после третьего испытания кузни</td><td>двойной прыжок; Погибель, Бедствие, Воля Демона и Империум бьют на 25% сильнее</td></tr><tr><td><b>Паладина</b></td><td>Небесный храм: 64 небесных осколка</td><td>небесная или ночная кровь третьей формы</td><td>15 секунд без урона — регенерация; падение не ранит</td></tr><tr><td><b>Короля ночи</b></td><td>Тёмный храм: часть паладина, 32 небесных осколка, лазуритовые блоки (5/8/7/4), 2 мембраны фантома</td><td>после победы над Пустотным Серафимом</td><td>всё от паладина; ночью, в Незере и в Крае — сила и скорость; ночью фантомы рядом становятся его и бьют его врагов (кроме механического фантома)</td></tr><tr><td><b>Терра</b></td><td>Храм джунглей: 64 реликтовых осколка, Терра-слитки (шлем 5, нагрудник 8, поножи 7, ботинки 4)</td><td>после того как принесли храму Терра-сущность</td><td>+4 сердца; негативные эффекты не действуют</td></tr><tr><td><b>Демонический</b></td><td>не куётся</td><td>награда за Мефисто</td><td>Dominus (от двух частей): удары копят до 10 стаков; каждый — +0,1 блока досягаемости, +2% шанса повторного удара и +10% урона; на 10 стаках удар рассекает линию врагов в случайную сторону</td></tr></tbody></table></div><p class="small">Душа лорда остаётся там, где пало Горнило третьего испытания кузни, — одна за победу.</p><h3>Небесная ковка</h3><p>Небесные клинки куют у алтаря Небесного храма: 40 небесных осколков, Перо серафима и свой взнос. Золотой феникс вырастает из Сумрачной секиры, Призрачный страж лежит в сокровищнице Проклятого замка, Солнцестояние — в сокровищницах бастионов.</p><div class="tbl"><table><thead><tr><th>Клинок</th><th>Взнос</th><th>Когда</th></tr></thead><tbody><tr><td>Hyperion</td><td>16 жемчугов Края</td><td>в любое время</td></tr><tr><td>Экскалибур</td><td>4 алмазных и 4 золотых блока</td><td>только днём</td></tr></tbody></table></div><h3>Ночная ковка</h3><p>Синие клинки куют в <b>Тёмном храме</b>; они признают только ночную небесную кровь.</p><div class="tbl"><table><thead><tr><th>Клинок</th><th>Взнос</th><th>Когда</th></tr></thead><tbody><tr><td>Ночная фурия</td><td>40 небесных осколков, Перо серафима, 8 лазуритовых блоков</td><td>пока стоит храм</td></tr><tr><td>Звёздная грань</td><td>48 небесных осколков, Перо серафима, звезда Незера, 16 осколков аметиста</td><td>только в полнолуние</td></tr><tr><td><b>Истинный Экскалибур</b></td><td>Экскалибур и Звёздная грань — оба клинка уходят в новый</td><td>пока стоит храм</td></tr></tbody></table></div><h3>Ковка в джунглях</h3><p>Эти клинки куёт алтарь Храма джунглей.</p><div class="tbl"><table><thead><tr><th>Клинок</th><th>Цена</th><th>Чей</th></tr></thead><tbody><tr><td>Терра-блейд</td><td>40 реликтовых осколков, Сердце джунглей, 8 терра-слитков</td><td>кровь предков, со второй формы</td></tr><tr><td>Энигма</td><td>48 реликтовых осколков, Сердце джунглей, 4 терра-слитка, 16 изумрудных блоков</td><td>кровь предков, с третьей формы</td></tr><tr><td>Селестиал</td><td>эволюция Энигмы: 24 терра-слитка</td><td>корона крови предков, с четвёртой формы</td></tr></tbody></table></div>', 17))
      ]);
    };
  }
};
const _hoisted_1$5 = { id: "sanctums" };
const _hoisted_2$2 = { class: "guides" };
const _hoisted_3$2 = { class: "guide-card" };
const _hoisted_4$2 = { class: "guide-card" };
const _hoisted_5$2 = { class: "guide-card" };
const _hoisted_6$2 = { class: "guide-card" };
const _hoisted_7$2 = {
  class: "guide-item",
  "aria-hidden": "true"
};
const _hoisted_8$2 = ["src"];
const _hoisted_9$2 = { class: "guide-card" };
const _hoisted_10$1 = { class: "guide-card" };
const _hoisted_11$1 = {
  class: "guide-item",
  "aria-hidden": "true"
};
const _hoisted_12$1 = ["src"];
const _hoisted_13$1 = {
  class: "sanctum",
  id: "forge"
};
const _hoisted_14$1 = ["src"];
const _hoisted_15 = { class: "sanctum-body" };
const _hoisted_16 = { class: "sanctum-info" };
const _hoisted_17 = { class: "kv" };
const _hoisted_18 = { class: "inline-icons" };
const _hoisted_19 = ["src"];
const _hoisted_20 = ["src"];
const _hoisted_21 = {
  class: "sanctum",
  id: "temple"
};
const _hoisted_22 = ["src"];
const _hoisted_23 = { class: "sanctum-body" };
const _hoisted_24 = { class: "sanctum-info" };
const _hoisted_25 = { class: "kv" };
const _hoisted_26 = { class: "inline-icons" };
const _hoisted_27 = ["src"];
const _hoisted_28 = ["src"];
const _hoisted_29 = ["src"];
const _hoisted_30 = {
  class: "sanctum",
  id: "jungle"
};
const _hoisted_31 = ["src"];
const _hoisted_32 = { class: "sanctum-body" };
const _hoisted_33 = { class: "sanctum-info" };
const _hoisted_34 = { class: "kv" };
const _hoisted_35 = { class: "inline-icons" };
const _hoisted_36 = ["src"];
const _hoisted_37 = ["src"];
const _hoisted_38 = {
  class: "sanctum",
  id: "night"
};
const _hoisted_39 = ["src"];
const _hoisted_40 = { class: "sanctum-body" };
const _hoisted_41 = { class: "sanctum-info" };
const _hoisted_42 = { class: "kv" };
const _hoisted_43 = { class: "inline-icons" };
const _hoisted_44 = ["src"];
const _hoisted_45 = {
  class: "sanctum",
  id: "factory"
};
const _hoisted_46 = ["src"];
const _hoisted_47 = { class: "sanctum-body" };
const _hoisted_48 = { class: "sanctum-info" };
const _hoisted_49 = { class: "kv" };
const _hoisted_50 = { class: "inline-icons" };
const _hoisted_51 = ["src"];
const _hoisted_52 = ["src"];
const _hoisted_53 = {
  class: "sanctum",
  id: "castle"
};
const _hoisted_54 = ["src"];
const _hoisted_55 = { class: "sanctum-body" };
const _hoisted_56 = { class: "sanctum-info" };
const _hoisted_57 = { class: "kv" };
const _hoisted_58 = { class: "inline-icons" };
const _hoisted_59 = ["src"];
const _hoisted_60 = ["src"];
const _hoisted_61 = { class: "inline-icons" };
const _hoisted_62 = ["src"];
const _hoisted_63 = ["src"];
const _hoisted_64 = ["src"];
const _hoisted_65 = {
  class: "sanctum",
  id: "wanderer-cube"
};
const _hoisted_66 = { class: "terra-figure cube-figure" };
const _hoisted_67 = { class: "cube-row" };
const _hoisted_68 = ["src", "alt"];
const _hoisted_69 = { class: "sanctum-body" };
const _hoisted_70 = { class: "sanctum-info" };
const _hoisted_71 = { class: "kv" };
const _hoisted_72 = { class: "inline-icons" };
const _hoisted_73 = ["src"];
const _hoisted_74 = ["src"];
const _hoisted_75 = {
  class: "sanctum",
  id: "terra-trial"
};
const _hoisted_76 = { class: "terra-figure" };
const _hoisted_77 = ["src"];
const _hoisted_78 = { class: "sanctum-body" };
const _hoisted_79 = { class: "sanctum-info" };
const _hoisted_80 = { class: "kv" };
const _hoisted_81 = { class: "inline-icons" };
const _hoisted_82 = ["src"];
const _hoisted_83 = { class: "inline-icons" };
const _hoisted_84 = ["src"];
const _hoisted_85 = ["src"];
const _hoisted_86 = ["src"];
const _sfc_main$6 = {
  __name: "SanctumsSection",
  setup(__props) {
    const recipe = (key) => data.recipes.find((r) => r.result === key);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$5, [
        _cache[72] || (_cache[72] = createStaticVNode('<div class="sec-head"><div class="eyebrow">Одно на сервер</div><h2>Святилища</h2><p class="lead">Пять построек, каждая — в единственном экземпляре. Внутри ничего нельзя ломать и строить.</p><p class="lead"><b>Внутри нет чужих</b>: обычные мобы не появляются.</p><p class="lead"><b>Храмы кочуют</b>: опустевшее святилище исчезает и встаёт в другом месте. Древняя фабрика стоит на месте, Тёмный храм приходит только ночью.</p></div><div class="flow" aria-label="Путь через святилище"><div class="step"><b>Вход</b><span>туннель, ступени или ворота</span></div><span class="to" aria-hidden="true">→</span><div class="step"><b>Три комнаты</b><span>в каждой стража; с неё падают осколки</span></div><span class="to" aria-hidden="true">→</span><div class="step"><b>Алтарь</b><span>откроется, когда падёт вся стража: эволюция, заточка, испытания</span></div><span class="to" aria-hidden="true">→</span><div class="step"><b>Арена</b><span>испытание: пять волн, в пятой — страж</span></div></div><h3>Пять святилищ коротко</h3><div class="tbl"><table><thead><tr><th>Святилище</th><th>Где</th><th>Чем искать</th><th>Страж</th><th>Кочует</th><th>Кровь</th></tr></thead><tbody><tr><td>Незеритовая кузня</td><td>Незер, в толще незерака</td><td>Карта кузни</td><td>Горнило</td><td>да</td><td>пепельная</td></tr><tr><td>Небесный храм</td><td>верхний мир, остров на высоте 200</td><td>Компас воздуха</td><td>Серафим Падшего Рассвета</td><td>да, и рушится от Печати ночи</td><td>небесная</td></tr><tr><td>Храм джунглей</td><td>джунгли</td><td>Карта джунглей</td><td>Древний страж джунглей</td><td>да</td><td>предков</td></tr><tr><td>Тёмный храм</td><td>верхний мир, только ночью</td><td>Ночной компас</td><td>Пустотный Серафим (призыв)</td><td>каждую ночь на новом месте</td><td>ночная небесная</td></tr><tr><td>Древняя фабрика</td><td>глубоко под землёй</td><td>Неизвестный компас</td><td>Предвестник</td><td>нет</td><td>техноорганическая</td></tr></tbody></table></div><h3>Как найти святилище</h3><p>Каждое святилище ищется своим предметом. Компас ведёт к храму, где бы тот ни стоял; карта показывает место, где святилище стояло, когда её сделали.</p>', 6)),
        createBaseVNode("div", _hoisted_2$2, [
          createBaseVNode("div", _hoisted_3$2, [
            createVNode(_sfc_main$d, {
              recipe: recipe("g:air_compass"),
              small: ""
            }, null, 8, ["recipe"]),
            _cache[0] || (_cache[0] = createBaseVNode("div", null, [
              createBaseVNode("h4", null, "Компас воздуха"),
              createBaseVNode("p", { class: "small muted" }, "Указывает на Небесный храм.")
            ], -1))
          ]),
          createBaseVNode("div", _hoisted_4$2, [
            createVNode(_sfc_main$d, {
              recipe: recipe("g:forge_map"),
              small: ""
            }, null, 8, ["recipe"]),
            _cache[1] || (_cache[1] = createBaseVNode("div", null, [
              createBaseVNode("h4", null, "Карта кузни"),
              createBaseVNode("p", { class: "small muted" }, "Отмечает Незеритовую кузню.")
            ], -1))
          ]),
          createBaseVNode("div", _hoisted_5$2, [
            createVNode(_sfc_main$d, {
              recipe: recipe("g:jungle_map"),
              small: ""
            }, null, 8, ["recipe"]),
            _cache[2] || (_cache[2] = createBaseVNode("div", null, [
              createBaseVNode("h4", null, "Карта джунглей"),
              createBaseVNode("p", { class: "small muted" }, "Отмечает Храм джунглей.")
            ], -1))
          ]),
          createBaseVNode("div", _hoisted_6$2, [
            createBaseVNode("div", _hoisted_7$2, [
              createBaseVNode("img", {
                src: unref(data).guideIcons.unknown_compass,
                alt: ""
              }, null, 8, _hoisted_8$2)
            ]),
            _cache[3] || (_cache[3] = createBaseVNode("div", null, [
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
          createBaseVNode("div", _hoisted_9$2, [
            createVNode(_sfc_main$d, {
              recipe: recipe("g:night_compass"),
              small: ""
            }, null, 8, ["recipe"]),
            _cache[4] || (_cache[4] = createBaseVNode("div", null, [
              createBaseVNode("h4", null, "Ночной компас"),
              createBaseVNode("p", { class: "small muted" }, "Указывает на Тёмный храм, пока тот стоит.")
            ], -1))
          ]),
          createBaseVNode("div", _hoisted_10$1, [
            createBaseVNode("div", _hoisted_11$1, [
              createBaseVNode("img", {
                src: unref(data).icons.terra_compass,
                alt: ""
              }, null, 8, _hoisted_12$1)
            ]),
            _cache[5] || (_cache[5] = createBaseVNode("div", null, [
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
        createBaseVNode("article", _hoisted_13$1, [
          createBaseVNode("figure", null, [
            createBaseVNode("img", {
              src: unref(data).images.forge,
              alt: "Незеритовая кузня: вид снаружи, разрез и план"
            }, null, 8, _hoisted_14$1),
            _cache[6] || (_cache[6] = createBaseVNode("figcaption", null, "Снаружи · разрез · план", -1))
          ]),
          createBaseVNode("div", _hoisted_15, [
            createBaseVNode("div", _hoisted_16, [
              _cache[11] || (_cache[11] = createBaseVNode("div", { class: "sanctum-title" }, [
                createBaseVNode("h3", null, "Незеритовая кузня"),
                createBaseVNode("span", { class: "pill" }, "Незер")
              ], -1)),
              createBaseVNode("dl", _hoisted_17, [
                _cache[10] || (_cache[10] = createStaticVNode("<div><dt>Где</dt><dd>в Незере, внутри скалы</dd></div><div><dt>Внутри</dt><dd>вестибюль, кузнечный зал, арена и алтарная</dd></div><div><dt>Стража</dt><dd>скелеты-иссушители, ифриты, пиглины-громилы</dd></div><div><dt>Алтарь</dt><dd>испытания, эволюции, заточка и четвёртая форма пепельной крови</dd></div>", 4)),
                createBaseVNode("div", null, [
                  _cache[9] || (_cache[9] = createBaseVNode("dt", null, "Добыча", -1)),
                  createBaseVNode("dd", _hoisted_18, [
                    createBaseVNode("img", {
                      src: unref(data).icons.soul_shard,
                      alt: ""
                    }, null, 8, _hoisted_19),
                    _cache[7] || (_cache[7] = createTextVNode("Осколки души · ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.forge_heart,
                      alt: ""
                    }, null, 8, _hoisted_20),
                    _cache[8] || (_cache[8] = createTextVNode("Сердце кузни", -1))
                  ])
                ])
              ])
            ]),
            _cache[12] || (_cache[12] = createStaticVNode('<div class="boss"><div class="boss-name">Горнило, кузнец Преисподней</div><div class="boss-stats"><span class="pill">400 здоровья</span><span class="pill">урон 7</span><span class="pill">броня 12</span><span class="pill">скелет-иссушитель</span></div><ul class="attacks"><li><b>Молот.</b> Прыгает к игроку; место посадки светится — уходите из круга, а после посадки бейте.</li><li><b>Огненное кольцо.</b> Катится по полу от босса — перепрыгивайте.</li><li><b>Извержение.</b> Из оранжевых кругов под бойцами бьёт лава — выйдите из них.</li><li><b>Подмастерья.</b> Зовёт скелетов-иссушителей.</li><li><b>Ярость.</b> Раненый — быстрее и сильнее.</li></ul></div>', 1))
          ])
        ]),
        createBaseVNode("article", _hoisted_21, [
          createBaseVNode("figure", null, [
            createBaseVNode("img", {
              src: unref(data).images.temple,
              alt: "Небесный храм: вид снаружи, разрез и план"
            }, null, 8, _hoisted_22),
            _cache[13] || (_cache[13] = createBaseVNode("figcaption", null, "Снаружи · разрез · план", -1))
          ]),
          createBaseVNode("div", _hoisted_23, [
            createBaseVNode("div", _hoisted_24, [
              _cache[19] || (_cache[19] = createBaseVNode("div", { class: "sanctum-title" }, [
                createBaseVNode("h3", null, "Небесный храм"),
                createBaseVNode("span", { class: "pill" }, "верхний мир")
              ], -1)),
              createBaseVNode("dl", _hoisted_25, [
                _cache[18] || (_cache[18] = createStaticVNode("<div><dt>Где</dt><dd>летающий остров высоко в небе</dd></div><div><dt>Внутри</dt><dd>колоннада, неф с колокольнями и ротонда с алтарём</dd></div><div><dt>Путь наверх</dt><dd>поток ветра у Врат ветра</dd></div><div><dt>Стража</dt><dd>зимогоры и поборники в золоте</dd></div><div><dt>Алтарь</dt><dd>испытания, ковка, заточка и пробуждение небесных клинков</dd></div>", 5)),
                createBaseVNode("div", null, [
                  _cache[17] || (_cache[17] = createBaseVNode("dt", null, "Добыча", -1)),
                  createBaseVNode("dd", _hoisted_26, [
                    createBaseVNode("img", {
                      src: unref(data).icons.celestial_shard,
                      alt: ""
                    }, null, 8, _hoisted_27),
                    _cache[14] || (_cache[14] = createTextVNode("Небесные осколки · ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.seraph_feather,
                      alt: ""
                    }, null, 8, _hoisted_28),
                    _cache[15] || (_cache[15] = createTextVNode("Перо серафима · ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.night_seal,
                      alt: ""
                    }, null, 8, _hoisted_29),
                    _cache[16] || (_cache[16] = createTextVNode("Печать ночи", -1))
                  ])
                ])
              ])
            ]),
            _cache[20] || (_cache[20] = createStaticVNode('<div class="boss"><div class="boss-name">Серафим Падшего Рассвета</div><div class="boss-stats"><span class="pill">450 здоровья</span><span class="pill">броня 8</span><span class="pill">иллюзор</span></div><ul class="attacks"><li><b>Печать ночи.</b> Падает с него в третьем испытании.</li><li><b>Суд.</b> В столбы света бьёт молния — выйдите из света.</li><li><b>Перья.</b> На золотые кольца падает залп стрел — выйдите из кольца.</li><li><b>Щит рассвета.</b> Неуязвим, пока живы призванные стражи.</li><li><b>Лучи рассвета.</b> Лучи обходят его кругом — перепрыгивайте их.</li><li><b>Мерцание.</b> Переносится по двору.</li></ul></div>', 1))
          ])
        ]),
        createBaseVNode("article", _hoisted_30, [
          createBaseVNode("figure", null, [
            createBaseVNode("img", {
              src: unref(data).images.jungle,
              alt: "Храм джунглей: вид снаружи, разрез, план залов и план лабиринта"
            }, null, 8, _hoisted_31),
            _cache[21] || (_cache[21] = createBaseVNode("figcaption", null, "Снаружи · разрез · план залов · лабиринт", -1))
          ]),
          createBaseVNode("div", _hoisted_32, [
            createBaseVNode("div", _hoisted_33, [
              _cache[26] || (_cache[26] = createBaseVNode("div", { class: "sanctum-title" }, [
                createBaseVNode("h3", null, "Храм джунглей"),
                createBaseVNode("span", { class: "pill" }, "джунгли")
              ], -1)),
              createBaseVNode("dl", _hoisted_34, [
                _cache[25] || (_cache[25] = createStaticVNode("<div><dt>Где</dt><dd>ступенчатая пирамида в джунглях</dd></div><div><dt>Внутри</dt><dd>большой зал, арена и алтарная комната</dd></div><div><dt>Стража</dt><dd>болотники, пещерные пауки, пауки, ведьмы</dd></div><div><dt>Алтарь</dt><dd>испытания, ковка Терра-блейда и Энигмы, четвёртая форма крови предков</dd></div>", 4)),
                createBaseVNode("div", null, [
                  _cache[24] || (_cache[24] = createBaseVNode("dt", null, "Добыча", -1)),
                  createBaseVNode("dd", _hoisted_35, [
                    createBaseVNode("img", {
                      src: unref(data).icons.jungle_shard,
                      alt: ""
                    }, null, 8, _hoisted_36),
                    _cache[22] || (_cache[22] = createTextVNode("Реликтовые осколки · ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.jungle_heart,
                      alt: ""
                    }, null, 8, _hoisted_37),
                    _cache[23] || (_cache[23] = createTextVNode("Сердце джунглей", -1))
                  ])
                ])
              ]),
              _cache[27] || (_cache[27] = createBaseVNode("p", { class: "sleeping" }, "Алтарь куёт и проводит испытания, но заточки и пробуждения терра-клинков здесь пока нет.", -1))
            ]),
            _cache[28] || (_cache[28] = createStaticVNode('<div class="boss"><div class="boss-name">Древний страж джунглей</div><div class="boss-stats"><span class="pill">550 здоровья</span><span class="pill">урон 16</span><span class="pill">броня 10</span><span class="pill">разоритель</span></div><ul class="attacks"><li><b>Землетрясение.</b> Подбрасывает всех на земле рядом.</li><li><b>Корни.</b> Под бойцами сжимаются зелёные кольца — выйдите из них, пока из пола не вырвались корни.</li><li><b>Споры.</b> Ядовитое облако вокруг босса — успейте выйти.</li><li><b>Таран.</b> Мчится по зелёной линии — сойдите с неё; врезавшись в стену, уязвим.</li><li><b>Зов и натиск.</b> Зовёт обитателей храма; раненый таранит чаще.</li></ul></div>', 1))
          ])
        ]),
        createBaseVNode("article", _hoisted_38, [
          createBaseVNode("figure", null, [
            createBaseVNode("img", {
              src: unref(data).images.night,
              alt: "Тёмный храм: вид снаружи, разрез и план"
            }, null, 8, _hoisted_39),
            _cache[29] || (_cache[29] = createBaseVNode("figcaption", null, "Тёмный храм", -1))
          ]),
          createBaseVNode("div", _hoisted_40, [
            createBaseVNode("div", _hoisted_41, [
              _cache[33] || (_cache[33] = createBaseVNode("div", { class: "sanctum-title" }, [
                createBaseVNode("h3", null, "Тёмный храм"),
                createBaseVNode("span", { class: "pill" }, "только ночью")
              ], -1)),
              createBaseVNode("dl", _hoisted_42, [
                _cache[32] || (_cache[32] = createStaticVNode("<div><dt>Когда</dt><dd>после того как сломали Печать ночи — каждую ночь в новом месте</dd></div><div><dt>Какой</dt><dd>тёмная тень Небесного храма</dd></div><div><dt>Стража</dt><dd>стражи полуночи</dd></div><div><dt>Алтарь</dt><dd>ночная ковка, заточка, призыв Пустотного Серафима</dd></div>", 4)),
                createBaseVNode("div", null, [
                  _cache[31] || (_cache[31] = createBaseVNode("dt", null, "Добыча", -1)),
                  createBaseVNode("dd", _hoisted_43, [
                    createBaseVNode("img", {
                      src: unref(data).icons.celestial_shard,
                      alt: ""
                    }, null, 8, _hoisted_44),
                    _cache[30] || (_cache[30] = createTextVNode("Небесные осколки со стражи и с Пустотного Серафима", -1))
                  ])
                ])
              ])
            ]),
            _cache[34] || (_cache[34] = createStaticVNode('<div class="boss"><div class="boss-name">Пустотный Серафим</div><div class="boss-stats"><span class="pill">700 здоровья</span><span class="pill">урон 13</span><span class="pill">броня 10</span><span class="pill">эндермен</span></div><ul class="attacks"><li><b>Призыв.</b> Его зовут на алтаре. Призвавшему ночной крови третьей формы победа даёт четвёртую форму.</li><li><b>Щит ударов.</b> Снимается числом ударов, а не силой.</li><li><b>Головы пустоты.</b> Пока живы головы, Серафим получает меньше урона — фиолетовые нити ведут к ним.</li><li><b>Глиф.</b> Встаньте в круг упавшего маяка, иначе взрыв.</li><li><b>Лучи разбитого сердца.</b> Лучи обходят его кругом — прыгайте.</li><li><b>Шаг сквозь пустоту.</b> Встаёт за спиной — выйдите из фиолетового кольца.</li></ul></div>', 1))
          ])
        ]),
        createBaseVNode("article", _hoisted_45, [
          createBaseVNode("figure", null, [
            createBaseVNode("img", {
              src: unref(data).images.factory,
              alt: "Древняя фабрика: пещера без потолка, разрез и план"
            }, null, 8, _hoisted_46),
            _cache[35] || (_cache[35] = createBaseVNode("figcaption", null, "Пещера без потолка · разрез · план", -1))
          ]),
          createBaseVNode("div", _hoisted_47, [
            createBaseVNode("div", _hoisted_48, [
              _cache[40] || (_cache[40] = createBaseVNode("div", { class: "sanctum-title" }, [
                createBaseVNode("h3", null, "Древняя фабрика"),
                createBaseVNode("span", { class: "pill" }, "под землёй")
              ], -1)),
              createBaseVNode("dl", _hoisted_49, [
                _cache[39] || (_cache[39] = createStaticVNode("<div><dt>Где</dt><dd>глубоко под землёй. Путь укажет Неизвестный компас</dd></div><div><dt>Внутри</dt><dd>огромный цех: погрузочный и сборочный залы, реактор и пульт управления</dd></div><div><dt>Стража</dt><dd>автоматоны и летучие дроны</dd></div><div><dt>Терминал</dt><dd>запуск Предвестника, рейды, техноорганический вирус, сборка машин</dd></div>", 4)),
                createBaseVNode("div", null, [
                  _cache[38] || (_cache[38] = createBaseVNode("dt", null, "Добыча", -1)),
                  createBaseVNode("dd", _hoisted_50, [
                    createBaseVNode("img", {
                      src: unref(data).icons.ancient_part,
                      alt: ""
                    }, null, 8, _hoisted_51),
                    _cache[36] || (_cache[36] = createTextVNode("Древние детали · ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.harbinger_core,
                      alt: ""
                    }, null, 8, _hoisted_52),
                    _cache[37] || (_cache[37] = createTextVNode("Ядро Предвестника", -1))
                  ])
                ])
              ])
            ]),
            _cache[41] || (_cache[41] = createStaticVNode('<div class="boss"><div class="boss-name">Предвестник</div><div class="boss-stats"><span class="pill">600 здоровья</span><span class="pill">урон 18</span><span class="pill">броня 14</span><span class="pill">железный голем</span></div><ul class="attacks"><li><b>Запуск.</b> В первый раз встаёт сам, потом его запускают на терминале.</li><li><b>Павшим вход закрыт</b> до конца боя.</li><li><b>Луч смерти.</b> Красная линия желтеет и стреляет — сойдите с неё или спрячьтесь за стену.</li><li><b>Ракеты.</b> Падают в оранжевые кольца.</li><li><b>Магнитный импульс.</b> Тянет к себе и разряжается — бегите против тяги, после разряда бейте.</li><li><b>Дроны.</b> Зовёт подмогу.</li><li><b>Перегрузка.</b> Раненый — быстрее и бьёт током всех рядом.</li></ul></div>', 1))
          ])
        ]),
        createBaseVNode("article", _hoisted_53, [
          createBaseVNode("figure", null, [
            createBaseVNode("img", {
              src: unref(data).images.castle,
              alt: "Проклятый замок на бедроковой крыше Незера"
            }, null, 8, _hoisted_54),
            _cache[42] || (_cache[42] = createBaseVNode("figcaption", null, "Проклятый замок", -1))
          ]),
          createBaseVNode("div", _hoisted_55, [
            createBaseVNode("div", _hoisted_56, [
              _cache[52] || (_cache[52] = createBaseVNode("div", { class: "sanctum-title" }, [
                createBaseVNode("h3", null, "Проклятый замок"),
                createBaseVNode("span", { class: "pill" }, "крыша Незера")
              ], -1)),
              createBaseVNode("dl", _hoisted_57, [
                _cache[51] || (_cache[51] = createStaticVNode("<div><dt>Как найти</dt><dd>с третьей формы крови: на крыше Незера нажмите ПКМ Душой демона — она полетит к замку, как око Края. Замок встаёт к северу, воротами к вам</dd></div><div><dt>Где</dt><dd>на крыше Незера; один на сервер</dd></div><div><dt>Исчезает</dt><dd>опустевший замок растворяется, следующая душа найдёт новый. Король пробуждается в замке лишь однажды</dd></div><div><dt>Город</dt><dd>дома, рынок и таверна подданных короля</dd></div><div><dt>Жители</dt><dd>пока король жив, в замке появляются пиглины</dd></div><div><dt>Часовая башня</dt><dd>в атриуме висит Адская сущность; её охраняют Стражи пекла. Пока жив хоть один, поле не подпускает. В инвентаре сущность поджигает носителя</dd></div><div><dt>Донжон</dt><dd>большой зал, библиотека, спальня и тронный зал</dd></div><div><dt>Стража</dt><dd>пиглины-громилы и чемпионы: Мечники Бедствия и Берсерки короля</dd></div>", 8)),
                createBaseVNode("div", null, [
                  _cache[46] || (_cache[46] = createBaseVNode("dt", null, "Мефисто", -1)),
                  createBaseVNode("dd", _hoisted_58, [
                    _cache[43] || (_cache[43] = createTextVNode("после короля на полу остаётся его голова. Когда субстанцию над троном забрали, держите ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.hell_essence,
                      alt: ""
                    }, null, 8, _hoisted_59),
                    _cache[44] || (_cache[44] = createTextVNode("Адскую сущность в руке не дальше 15 блоков от головы, со Сборщиком душ в инвентаре: красный луч, 5 секунд — и встаёт Мефисто. Сущность не тратится. Победа — Сборщик душ становится Люцифером, где бы он ни был, а призвавшему — ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.demon_helmet,
                      alt: ""
                    }, null, 8, _hoisted_60),
                    _cache[45] || (_cache[45] = createTextVNode("Демонический доспех", -1))
                  ])
                ]),
                createBaseVNode("div", null, [
                  _cache[50] || (_cache[50] = createBaseVNode("dt", null, "Добыча", -1)),
                  createBaseVNode("dd", _hoisted_61, [
                    createBaseVNode("img", {
                      src: unref(data).icons.black_substance,
                      alt: ""
                    }, null, 8, _hoisted_62),
                    _cache[47] || (_cache[47] = createTextVNode("Чёрная субстанция в рамке над троном · ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.hell_essence,
                      alt: ""
                    }, null, 8, _hoisted_63),
                    _cache[48] || (_cache[48] = createTextVNode("Адская сущность в часовой башне · Призрачный страж в сокровищнице · ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.royal_clock,
                      alt: ""
                    }, null, 8, _hoisted_64),
                    _cache[49] || (_cache[49] = createTextVNode("Королевские часы с короля · сундуки с сокровищами", -1))
                  ])
                ])
              ])
            ]),
            _cache[53] || (_cache[53] = createStaticVNode('<div class="boss"><div class="boss-name">Проклятый король</div><div class="boss-stats"><span class="pill">1200 здоровья</span><span class="pill">урон 10</span><span class="pill">броня 12</span><span class="pill">пиглин-громила</span></div><ul class="attacks"><li><b>Тронный зал.</b> Колонны — укрытие от указа. Пока король жив, субстанцию не снять; потом её достаёт любой, встав на трон.</li><li><b>Акт I. Удар короны.</b> Выйдите из золотого веера или зайдите за спину.</li><li><b>Рывок.</b> Несётся по золотой линии, потом уязвим.</li><li><b>Золото.</b> В круги рушится золото.</li><li><b>Указ.</b> Тянет к ногам всех на виду — спасают расстояние и колонны.</li><li><b>Бросок топора.</b> Топор летит по золотой дорожке и возвращается — сойдите с неё.</li><li><b>Поступь.</b> По полу бегут золотые волны — перепрыгивайте.</li><li><b>Акт II. Золотой бастион.</b> Король на троне под щитом, который считает удары, — бейте часто. С ворот идёт подмога, с трона летят копья.</li><li><b>Акт III. Проклятие короны.</b> Ярость. <b>Проклятие</b> жжёт края зала — бегите в середину. <b>Казнь</b>: прыгает на самого слабого.</li><li><b>Рог.</b> В третьем акте весь замок бежит в тронный зал. Когда король падает, его народ теряет волю.</li><li><b>Дань.</b> Подданные в зале лечат короля — бейте сначала их.</li></ul></div><div class="boss"><div class="boss-name">Мефисто</div><div class="boss-stats"><span class="pill">900 здоровья</span><span class="pill">урон 6</span><span class="pill">броня 12</span><span class="pill">пустой доспех</span></div><ul class="attacks"><li><b>Адское пламя.</b> Красный круг вокруг него — выйдите, пока не вспыхнул.</li><li><b>Цепи душ.</b> Тянет к себе двух дальних — колонна рвёт цепь.</li><li><b>Огненный дождь.</b> Огонь падает в круги под бойцами.</li><li><b>Шаг сквозь Ад.</b> Выходит из дыма за спиной дальнего и взрывает пол, потом уязвим.</li><li><b>Сделка.</b> Шесть секунд удары названного бойца лечат Мефисто — бейте другими.</li><li><b>Четыре всадника.</b> На 80, 60, 40 и 20% выезжают Война, Голод, Чума и Смерть; пока хоть один в седле, Мефисто получает меньше урона. Метка Смерти через 8 секунд отнимает треть здоровья.</li><li><b>Истинное лицо.</b> На 20% быстрее, сильнее и чаще.</li></ul></div>', 2))
          ])
        ]),
        createBaseVNode("article", _hoisted_65, [
          createBaseVNode("figure", _hoisted_66, [
            createBaseVNode("div", _hoisted_67, [
              (openBlock(), createElementBlock(Fragment, null, renderList(["green", "blue", "orange", "purple", "red", "gray"], (c) => {
                return createBaseVNode("img", {
                  key: c,
                  src: unref(data).icons["wanderer_cube_" + c],
                  alt: c
                }, null, 8, _hoisted_68);
              }), 64))
            ]),
            _cache[54] || (_cache[54] = createBaseVNode("figcaption", null, "Цвет Тессеракта подсказывает, что он сделает", -1))
          ]),
          createBaseVNode("div", _hoisted_69, [
            createBaseVNode("div", _hoisted_70, [
              _cache[60] || (_cache[60] = createBaseVNode("div", { class: "sanctum-title" }, [
                createBaseVNode("h3", null, "Тессеракт"),
                createBaseVNode("span", { class: "pill" }, "любая кровь")
              ], -1)),
              createBaseVNode("dl", _hoisted_71, [
                createBaseVNode("div", null, [
                  _cache[58] || (_cache[58] = createBaseVNode("dt", null, "Крафт", -1)),
                  createBaseVNode("dd", _hoisted_72, [
                    _cache[55] || (_cache[55] = createTextVNode("верстак: ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.terra_essence,
                      alt: ""
                    }, null, 8, _hoisted_73),
                    _cache[56] || (_cache[56] = createTextVNode("Терра-сущность, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.hell_essence,
                      alt: ""
                    }, null, 8, _hoisted_74),
                    _cache[57] || (_cache[57] = createTextVNode("Адская сущность, звезда Незера и плачущий обсидиан", -1))
                  ])
                ]),
                _cache[59] || (_cache[59] = createStaticVNode("<div><dt>Как работает</dt><dd>правый клик; что он сделает, видно по цвету</dd></div><div><dt>Красный</dt><dd>вы стоите в чужом куполе — Сделке с дьяволом, Тёмной территории, Сборочном куполе, Огненном эдикте или Мировом Господстве — либо рядом с тем, кто вытянул чужую Луну: тессеракт развеивает это</dd></div><div><dt>Зелёный</dt><dd>здоровье не полное: лечит вас и своих рядом</dd></div><div><dt>Голубой</dt><dd>полное здоровье, обычный мир: перенос к случайному храму</dd></div><div><dt>Оранжевый</dt><dd>полное здоровье, Незер: перенос к Незеритовой кузне</dd></div><div><dt>Фиолетовый</dt><dd>полное здоровье, Энд: перенос к точке возрождения</dd></div><div><dt>Перенос</dt><dd>забирает всех живых рядом; из арены испытания не уводит</dd></div>", 7))
              ])
            ])
          ])
        ]),
        _cache[73] || (_cache[73] = createBaseVNode("div", { class: "prose small" }, [
          createBaseVNode("p", null, [
            createBaseVNode("b", null, "Королевские часы"),
            createTextVNode(" работают как тотем бессмертия и, спасая от смерти, ненадолго останавливают время вокруг.")
          ])
        ], -1)),
        createBaseVNode("article", _hoisted_75, [
          createBaseVNode("figure", _hoisted_76, [
            createBaseVNode("img", {
              src: unref(data).icons.terra_essence,
              alt: "Терра-сущность"
            }, null, 8, _hoisted_77),
            _cache[61] || (_cache[61] = createBaseVNode("figcaption", null, "Терра-сущность", -1))
          ]),
          createBaseVNode("div", _hoisted_78, [
            createBaseVNode("div", _hoisted_79, [
              _cache[70] || (_cache[70] = createBaseVNode("div", { class: "sanctum-title" }, [
                createBaseVNode("h3", null, "Терра-подземелье"),
                createBaseVNode("span", { class: "pill" }, "под землёй")
              ], -1)),
              createBaseVNode("dl", _hoisted_80, [
                createBaseVNode("div", null, [
                  _cache[63] || (_cache[63] = createBaseVNode("dt", null, "Как найти", -1)),
                  createBaseVNode("dd", _hoisted_81, [
                    createBaseVNode("img", {
                      src: unref(data).icons.terra_compass,
                      alt: ""
                    }, null, 8, _hoisted_82),
                    _cache[62] || (_cache[62] = createTextVNode("Терра-компас; копайте к шахте, на которую он указывает", -1))
                  ])
                ]),
                _cache[69] || (_cache[69] = createStaticVNode("<div><dt>Где</dt><dd>верхний мир, глубоко под землёй; одно на сервер</dd></div><div><dt>Исчезает</dt><dd>когда все игроки его покинули; вернётся через несколько игровых суток в другом месте</dd></div><div><dt>Загадки</dt><dd>рычаги, кнопки и ловушки; дальний зал открывается загадками</dd></div><div><dt>Библиотека</dt><dd>лабиринт стеллажей; присмотритесь к рычагам под сводом</dd></div><div><dt>Разбойники</dt><dd>выходят с постов в залах, когда вы подходите</dd></div><div><dt>Всадники апокалипсиса</dt><dd>Война и Смерть в зале свечей; пока жив хоть один, голем спит</dd></div><div><dt>Терра-сущность в зале</dt><dd>появляется, когда голем пал; забрать — подойти к ней</dd></div><div><dt>Когда сущность взята</dt><dd>подземелье кишит болотниками</dd></div><div><dt>Терра-сущность</dt><dd>в инвентаре отравляет носителя, кроме крови предков и техноорганической</dd></div>", 9)),
                createBaseVNode("div", null, [
                  _cache[68] || (_cache[68] = createBaseVNode("dt", null, "Бочки", -1)),
                  createBaseVNode("dd", _hoisted_83, [
                    _cache[64] || (_cache[64] = createTextVNode("в одной из них — ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.ancient,
                      alt: ""
                    }, null, 8, _hoisted_84),
                    _cache[65] || (_cache[65] = createTextVNode("Древний; в остальных осколки, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.terra_ingot,
                      alt: ""
                    }, null, 8, _hoisted_85),
                    _cache[66] || (_cache[66] = createTextVNode("терра-слитки, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.demon_soul,
                      alt: ""
                    }, null, 8, _hoisted_86),
                    _cache[67] || (_cache[67] = createTextVNode("Душа демона и припасы", -1))
                  ])
                ])
              ])
            ]),
            _cache[71] || (_cache[71] = createStaticVNode('<div class="stack" style="align-content:start;"><div class="boss"><div class="boss-name">Джунглевый голем</div><div class="boss-stats"><span class="pill">900 здоровья</span><span class="pill">7 блоков ростом</span><span class="pill">большой зал</span></div><ul class="attacks"><li><b>Сотрясение.</b> Выйдите из зелёного круга или подпрыгните.</li><li><b>Валун.</b> Уйдите со светящегося диска.</li><li><b>Плеть.</b> Сойдите с линии лоз.</li><li><b>Корни.</b> Щит из мха считает удары, а не урон.</li><li><b>Ярость.</b> Раненый — быстрее, оставляет ядовитые споры.</li><li><b>Награда.</b> Терра-слитки и Терра-сущность.</li></ul></div><div class="boss"><div class="boss-name">Древний</div><div class="boss-stats"><span class="pill">кровь предков, вторая форма</span></div><ul class="attacks"><li><b>Гнев предков.</b> Сильнее против разбойников и ведьм, удар оплетает цель корнями.</li><li><b>Разлом</b> — правый клик: разлом бежит кольцами, подбрасывает и оплетает врагов.</li><li><b>Где взять.</b> В бочке Терра-подземелья.</li></ul></div></div>', 1))
          ])
        ]),
        _cache[74] || (_cache[74] = createBaseVNode("div", { class: "prose small" }, [
          createBaseVNode("p", null, "Каждый, кто бился со стражем, получает свою долю добычи. Пали все бойцы — страж уходит.")
        ], -1))
      ]);
    };
  }
};
const _hoisted_1$4 = { id: "raids" };
const _sfc_main$5 = {
  __name: "TrialsSection",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$4, [..._cache[0] || (_cache[0] = [
        createStaticVNode('<div class="sec-head"><div class="eyebrow">Снова и снова</div><h2>Испытания</h2><p class="lead">Стража святилища вызывают <b>испытанием</b> у алтаря.</p></div><div class="stack"><div class="panel"><h3>Испытание святилища</h3><p class="small">Пять волн в арене, в пятой — страж святилища. Уровень и награду определяет тот, кто начал. Покинуть арену до конца боя нельзя.</p><div class="tbl"><table><thead><tr><th>Уровень</th><th>Цена</th><th>Что даёт</th></tr></thead><tbody><tr><td>1</td><td>даром, раз в 10 минут на игрока</td><td>у всех бойцов этой крови и у начавшего первая форма → вторая</td></tr><tr><td>2</td><td>алмазный блок, изумрудный блок, 20 осколков</td><td>начавшему — реликвия святилища, даже если он погиб</td></tr><tr><td>3</td><td>32 осколка, реликвия, зачарованное золотое яблоко</td><td>начавшему — реликвия; у бойцов этой крови и у начавшего вторая форма → третья; Серафим роняет Печать ночи</td></tr></tbody></table></div><p class="small muted">Пройденное испытание открывает следующий уровень; начать можно любой открытый.</p><div class="tbl"><table><thead><tr><th>Уровень</th><th>С каждого стражника волн</th></tr></thead><tbody><tr><td>1</td><td>1 осколок — сразу в инвентарь</td></tr><tr><td>2</td><td>2 осколка</td></tr><tr><td>3</td><td>3 осколка</td></tr></tbody></table></div><p class="small"><b>Провал</b> забирает у каждого половину осколков, добытых в этом испытании.</p></div><div class="panel" id="fourth"><h3>Четвёртая форма</h3><p class="small">Четвёртую форму <b>приносят к алтарю своей крови</b>.</p><div class="tbl"><table><thead><tr><th>Кровь</th><th>Что нужно</th><th>Куда</th></tr></thead><tbody><tr><td>Пепельная</td><td><b>Адская сущность</b> из часовой башни Проклятого замка</td><td>кнопка крови у алтаря Незеритовой кузни</td></tr><tr><td>Предков</td><td><b>Терра-сущность</b> из большого зала Терра-подземелья</td><td>кнопка крови у алтаря Храма джунглей</td></tr><tr><td>Ночная небесная</td><td>победить <b>Пустотного Серафима</b> — форму получает тот, кто его призвал</td><td>алтарь Тёмного храма</td></tr><tr><td>Техноорганическая</td><td><b>Чёрная субстанция</b> с трона Проклятого замка</td><td>Клоду: кнопка крови у терминала фабрики</td></tr></tbody></table></div><p class="small">Обе сущности с <b>проклятием утраты</b>: погибли с ней — она пропала.</p></div></div><div class="panel"><h3>Рейды фабрики</h3><p class="small">Рейды проводят в Древней фабрике после падения Предвестника: волны в реакторном зале, три уровня, как у испытаний.</p><div class="tbl"><table><thead><tr><th>Уровень</th><th>Цена</th><th>С каждого стражника</th><th>В конце всем в фабрике</th></tr></thead><tbody><tr><td>1</td><td>даром, раз в 10 минут</td><td>1 деталь</td><td>6–10 деталей</td></tr><tr><td>2</td><td>8 деталей</td><td>2 детали</td><td>12–20 деталей, шанс 15% на ядро</td></tr><tr><td>3</td><td>16 деталей</td><td>3 детали</td><td>20–30 деталей, шанс 30% на ядро</td></tr></tbody></table></div><p class="small">Провал забирает половину деталей, добытых в рейде.</p></div>', 3)
      ])]);
    };
  }
};
const _sfc_main$4 = {
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
const _hoisted_1$3 = { id: "blood" };
const _hoisted_2$1 = { class: "tbl" };
const _hoisted_3$1 = { scope: "row" };
const _hoisted_4$1 = { class: "muted small" };
const _hoisted_5$1 = { class: "kin-list" };
const _hoisted_6$1 = ["src"];
const _hoisted_7$1 = {
  key: 0,
  class: "muted small"
};
const _hoisted_8$1 = {
  key: 0,
  class: "muted small"
};
const _hoisted_9$1 = { class: "tbl" };
const _hoisted_10 = { scope: "row" };
const _hoisted_11 = { class: "tbl" };
const _hoisted_12 = { scope: "row" };
const _hoisted_13 = {
  key: 0,
  colspan: "4"
};
const _hoisted_14 = {
  key: 0,
  class: "muted small"
};
const _sfc_main$3 = {
  __name: "BloodSection",
  setup(__props) {
    const quests = data.blood.filter((b) => !b.formless && b.deed);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$3, [
        _cache[4] || (_cache[4] = createBaseVNode("div", { class: "sec-head" }, [
          createBaseVNode("div", { class: "eyebrow" }, "Кровь игрока"),
          createBaseVNode("h2", null, "Родословные"),
          createBaseVNode("p", { class: "lead" }, "При первом входе каждый игрок сам выбирает одну из трёх родословных — пепельную, небесную или кровь предков —. Кровь решает, как игрок растёт, какую книгу получит и какие величайшие клинки его признают.")
        ], -1)),
        _cache[5] || (_cache[5] = createBaseVNode("h3", null, "Клинки крови", -1)),
        _cache[6] || (_cache[6] = createBaseVNode("p", null, [
          createTextVNode("Величайшие клинки привязаны к крови: в чужих руках они не работают. "),
          createBaseVNode("b", null, "Короны"),
          createTextVNode(" — Люцифер, Истинный Экскалибур и Селестиал — отвечают только крови в "),
          createBaseVNode("b", null, "четвёртой форме"),
          createTextVNode(", а Все-Чёрный — только крови бездны.")
        ], -1)),
        createBaseVNode("div", _hoisted_2$1, [
          createBaseVNode("table", null, [
            _cache[0] || (_cache[0] = createBaseVNode("thead", null, [
              createBaseVNode("tr", null, [
                createBaseVNode("th", null, "Кровь"),
                createBaseVNode("th", null, "Суть"),
                createBaseVNode("th", null, "Святилище крови"),
                createBaseVNode("th", null, "Клинки крови")
              ])
            ], -1)),
            createBaseVNode("tbody", null, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(data).blood, (b) => {
                return openBlock(), createElementBlock("tr", {
                  key: b.id
                }, [
                  createBaseVNode("th", _hoisted_3$1, [
                    createVNode(_sfc_main$4, {
                      colour: b.colour
                    }, null, 8, ["colour"]),
                    createTextVNode(toDisplayString(b.title), 1)
                  ]),
                  createBaseVNode("td", _hoisted_4$1, toDisplayString(b.motto), 1),
                  createBaseVNode("td", null, toDisplayString(b.sanctum), 1),
                  createBaseVNode("td", null, [
                    createBaseVNode("div", _hoisted_5$1, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(b.weapons, (w) => {
                        return openBlock(), createElementBlock("div", {
                          key: w.id
                        }, [
                          createBaseVNode("img", {
                            src: w.icon,
                            alt: ""
                          }, null, 8, _hoisted_6$1),
                          createTextVNode(toDisplayString(w.name), 1),
                          w.form > 1 ? (openBlock(), createElementBlock("span", _hoisted_7$1, " · " + toDisplayString(w.form) + "-я форма", 1)) : createCommentVNode("", true)
                        ]);
                      }), 128)),
                      !b.weapons.length ? (openBlock(), createElementBlock("span", _hoisted_8$1, "ещё не выкованы")) : createCommentVNode("", true)
                    ])
                  ])
                ]);
              }), 128))
            ])
          ])
        ]),
        _cache[7] || (_cache[7] = createStaticVNode('<h3>Формы</h3><div class="flow" aria-label="Путь крови"><div class="step"><b>Первая</b><span>выбор при первом входе — или 20 осколков у алтаря святилища этой крови</span></div><span class="to" aria-hidden="true">→</span><div class="step"><b>Вторая</b><span>испытание 1-го уровня в святилище своей крови</span></div><span class="to" aria-hidden="true">→</span><div class="step"><b>Третья</b><span>испытание 3-го уровня там же</span></div><span class="to" aria-hidden="true">→</span><div class="step"><b>Четвёртая</b><span>сущность или субстанция у алтаря своей крови · корона крови</span></div></div><p><b>Огонь не берёт своё.</b> Брошенные в лаву или огонь клинки пепельной крови и адские материалы не сгорают.</p><p><b>Крылья.</b> С третьей формой у небесной и ночной небесной крови вырастают крылья, на которых они летают: голубые и синие. С четвёртой формой крылья появляются и у пепельной крови — огненные, и у крови предков — зелёные.</p><p><b>У небесной крови нет четвёртой формы.</b> Сломав <b>Печать ночи</b>, небесная кровь становится <b>ночной небесной</b>. С тех пор по ночам появляется <b>Тёмный храм</b> — там ночная кровь растёт дальше.</p><p><b>Техноорганическая кровь</b> растёт иначе: вторая форма — победа в рейде фабрики, третья — три подвига в любом порядке, четвёртая — Чёрная субстанция, сданная на терминале фабрики.</p>', 6)),
        createBaseVNode("div", _hoisted_9$1, [
          createBaseVNode("table", null, [
            _cache[1] || (_cache[1] = createBaseVNode("thead", null, [
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
                  createBaseVNode("th", _hoisted_10, [
                    createVNode(_sfc_main$4, {
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
        _cache[8] || (_cache[8] = createBaseVNode("p", { class: "small muted" }, "Третий подвиг — выковать любой клинок у любого алтаря. Подвиги засчитываются, пока кровь во второй форме.", -1)),
        _cache[9] || (_cache[9] = createBaseVNode("p", null, [
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
        createBaseVNode("div", _hoisted_11, [
          createBaseVNode("table", null, [
            _cache[3] || (_cache[3] = createBaseVNode("thead", null, [
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
                  createBaseVNode("th", _hoisted_12, [
                    createVNode(_sfc_main$4, {
                      colour: b.colour
                    }, null, 8, ["colour"]),
                    createTextVNode(toDisplayString(b.title), 1)
                  ]),
                  b.formless ? (openBlock(), createElementBlock("td", _hoisted_13, [
                    createTextVNode(toDisplayString(b.perks.join(" ")) + " ", 1),
                    _cache[2] || (_cache[2] = createBaseVNode("span", { class: "muted small" }, "Форм нет: всё сразу.", -1))
                  ])) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(b.perks, (perk, i) => {
                      return openBlock(), createElementBlock("td", { key: i }, toDisplayString(perk), 1);
                    }), 128)),
                    b.perks.length < 4 ? (openBlock(), createElementBlock("td", _hoisted_14, "Нет: Печать ночи делает её ночной небесной кровью третьей формы, четвёртая — уже у ночной")) : createCommentVNode("", true)
                  ], 64))
                ]);
              }), 128))
            ])
          ])
        ]),
        _cache[10] || (_cache[10] = createStaticVNode('<p class="small muted">Сменить кровь можно у алтаря её святилища — кроме ночной, бездны и техноорганической.</p><p><b>Кровь бездны</b> не выбирают и не покупают. Её получает тот, кто выковал <b>Все-Чёрный</b>: в тот же миг кровь меняется на бездну — навсегда. У бездны нет форм, подвигов и испытаний. Выковать Все-Чёрный можно из <b>короны своей крови</b> и <b>Чёрной субстанции</b> у алтаря <b>своего</b> храма — и храм за это <b>гневается</b>.</p><p><b>Техноорганическую кровь</b> принимают на терминале Древней фабрики. Вместе с ней вы получаете <b>Энцефало-меч</b>: он сам растёт вместе с кровью — в <b>Энцефало-клинок</b>, а затем в <b>Антихрист</b> — и возвращается к вам после смерти.</p><p class="small">Алтарь фабрики собирает своей крови <b>призывные машины</b>: медного голема, малого Предвестника и Сборочный купол.</p><h3>Путеводитель</h3><p>Сразу после крови выбирается голос, что будет с вами в пути: он даёт советы, рассказывает легенды и отзывается на то, что с вами происходит. Каждая реплика звучит один раз.</p><div class="tbl"><table><thead><tr><th>Голос</th><th>Какой</th></tr></thead><tbody><tr><td>Путеводитель</td><td>старый хранитель знаний о клинках: тёплый, насмешливый, говорит загадками</td></tr><tr><td>Claude</td><td>разум Древней фабрики: язвительный, спокойный, презирает органику и не скрывает своих целей</td></tr><tr><td>Наблюдатель</td><td>древний свидетель: торжественный и печальный, рассказывает легенды о Все-Чёрном</td></tr></tbody></table></div><p class="small muted">Кровь бездны всегда слышит Наблюдателя, техноорганическая — Claude: их выбор голоса не касается.</p><h3>Книги</h3><p>Выбрав кровь, игрок получает <b>книгу своей крови</b>. Оператор сервера получает ещё и <b>книгу хранителя</b>.</p>', 10))
      ]);
    };
  }
};
const _hoisted_1$2 = { id: "trophies" };
const _hoisted_2 = { class: "group" };
const _hoisted_3 = { class: "advs" };
const _hoisted_4 = ["title"];
const _hoisted_5 = ["src"];
const _hoisted_6 = { class: "adv-head" };
const _hoisted_7 = { class: "quote" };
const _hoisted_8 = { class: "cond" };
const _hoisted_9 = {
  key: 0,
  class: "empty"
};
const _sfc_main$2 = {
  __name: "TrophiesSection",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$2, [
        _cache[0] || (_cache[0] = createBaseVNode("div", { class: "sec-head" }, [
          createBaseVNode("div", { class: "eyebrow" }, "Голосом Наблюдателя"),
          createBaseVNode("h2", null, "Достижения"),
          createBaseVNode("p", { class: "lead" }, "Отдельная вкладка в меню достижений.")
        ], -1)),
        (openBlock(true), createElementBlock(Fragment, null, renderList(unref(achievementGroups), (group) => {
          return openBlock(), createElementBlock(Fragment, {
            key: group.title
          }, [
            createBaseVNode("h3", _hoisted_2, toDisplayString(group.title), 1),
            createBaseVNode("div", _hoisted_3, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(group.cards, (a) => {
                return openBlock(), createElementBlock("article", {
                  key: a.key,
                  class: "adv"
                }, [
                  createBaseVNode("div", {
                    class: normalizeClass(["frame", `f-${a.frame}`]),
                    title: a.caption
                  }, [
                    a.icon ? (openBlock(), createElementBlock("img", {
                      key: 0,
                      src: a.icon,
                      alt: ""
                    }, null, 8, _hoisted_5)) : a.gem ? (openBlock(), createElementBlock("span", {
                      key: 1,
                      class: "gem",
                      style: normalizeStyle({ "--gem": a.gem })
                    }, null, 4)) : createCommentVNode("", true)
                  ], 10, _hoisted_4),
                  createBaseVNode("div", null, [
                    createBaseVNode("div", _hoisted_6, [
                      createBaseVNode("h4", null, toDisplayString(a.title), 1),
                      createBaseVNode("span", {
                        class: normalizeClass(["ftag", `t-${a.frame}`])
                      }, toDisplayString(a.frameLabel), 3)
                    ]),
                    createBaseVNode("p", _hoisted_7, "«" + toDisplayString(a.description) + "»", 1),
                    createBaseVNode("p", _hoisted_8, toDisplayString(a.condition), 1)
                  ])
                ]);
              }), 128))
            ])
          ], 64);
        }), 128)),
        !unref(achievementGroups).length ? (openBlock(), createElementBlock("p", _hoisted_9, "Ни одного достижения по этому слову.")) : createCommentVNode("", true)
      ]);
    };
  }
};
const _hoisted_1$1 = { id: "admin" };
const _sfc_main$1 = {
  __name: "AdminSection",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$1, [..._cache[0] || (_cache[0] = [
        createStaticVNode('<div class="sec-head"><div class="eyebrow">Установка и настройка</div><h2>Для администратора</h2></div><div class="twocol"><div class="panel"><h3>Установка</h3><ol class="small" style="margin:0;padding-left:1.2em;display:grid;gap:6px;"><li>Собрать: <code>gradlew.bat build</code> (Windows) или <code>./gradlew build</code>; нужна Java 21+.</li><li>Положить <code>build/libs/virusswords-1.0.0.jar</code> в <code>plugins/</code> сервера Paper 1.21.11.</li><li>Раздать <code>VirusSwords-ResourcePack.zip</code> — через <code>server.properties</code> или в лаунчере. Нужен клиент 1.21.6+.</li><li>При первом запуске плагин сам ставит датапак достижений и один раз перезагружает данные.</li></ol></div><div class="panel"><h3>Главное в config.yml</h3><div class="tbl"><table><tbody><tr><td><code>progression.mastery-multiplier</code></td><td>скорость роста мастерства</td></tr><tr><td><code>progression.bloodlines</code></td><td>включить родословные и привязку клинков к крови</td></tr><tr><td><code>sanctums.roam-minutes</code></td><td>через сколько минут без гостей святилище переезжает; 0 — никогда</td></tr><tr><td><code>sanctums.build-radius</code></td><td>на каком расстоянии поднимается постройка</td></tr><tr><td><code>sanctums.boss-health-multiplier</code></td><td>здоровье стражей для больших компаний</td></tr><tr><td><code>sanctums.raid-relic-chance</code></td><td>шанс ядра в рейде фабрики</td></tr><tr><td><code>abilities.cooldown-seconds</code></td><td>перезарядки способностей</td></tr><tr><td><code>bound-drops.items</code></td><td>клинки, которые не теряются при смерти</td></tr></tbody></table></div></div></div><footer><span>Кодекс собран из исходников плагина: имена, описания, урон и достижения взяты прямо из кода.</span><span>Модели оружия — ресурспаки Fantasy Weapons (автор nongkos) и Blades of Majestica, используются приватно.</span></footer>', 3)
      ])]);
    };
  }
};
const _hoisted_1 = { class: "shell" };
const _sfc_main = {
  __name: "App",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createVNode(_sfc_main$j),
        createBaseVNode("main", null, [
          createVNode(_sfc_main$h),
          createVNode(_sfc_main$g),
          createVNode(_sfc_main$f),
          createVNode(_sfc_main$a),
          createVNode(_sfc_main$9),
          createVNode(_sfc_main$8),
          createVNode(_sfc_main$7),
          createVNode(_sfc_main$6),
          createVNode(_sfc_main$5),
          createVNode(_sfc_main$3),
          createVNode(_sfc_main$2),
          createVNode(_sfc_main$1)
        ])
      ]);
    };
  }
};
createApp(_sfc_main).mount("#app");
if (location.hash) nextTick(() => {
  var _a;
  return (_a = document.getElementById(location.hash.slice(1))) == null ? void 0 : _a.scrollIntoView();
});
