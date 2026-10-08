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
const _hoisted_1$e = { class: "side" };
const _hoisted_2$b = {
  class: "brand",
  href: "#top"
};
const _hoisted_3$b = ["src"];
const _hoisted_4$9 = { class: "search" };
const _hoisted_5$9 = { class: "search-hint" };
const _hoisted_6$8 = {
  class: "nav",
  "aria-label": "Разделы"
};
const _hoisted_7$7 = ["href"];
const _hoisted_8$6 = {
  key: 0,
  class: "count"
};
const _sfc_main$g = {
  __name: "SideNav",
  setup(__props) {
    const sections = [
      ["start", "С чего начать"],
      ["rarity", "Редкости"],
      ["weapons", "Оружие", data.counts.weapons],
      ["materials", "Материалы", data.counts.materials],
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
      return openBlock(), createElementBlock("aside", _hoisted_1$e, [
        createBaseVNode("a", _hoisted_2$b, [
          createBaseVNode("img", {
            class: "brand-mark",
            src: unref(data).icons.forge_heart,
            alt: ""
          }, null, 8, _hoisted_3$b),
          _cache[1] || (_cache[1] = createBaseVNode("span", { class: "brand-name" }, "Кодекс VirusSwords", -1))
        ]),
        createBaseVNode("div", _hoisted_4$9, [
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
          createBaseVNode("div", _hoisted_5$9, toDisplayString(unref(hint)), 1)
        ]),
        createBaseVNode("nav", _hoisted_6$8, [
          (openBlock(), createElementBlock(Fragment, null, renderList(sections, ([id, title, count]) => {
            return createBaseVNode("a", {
              key: id,
              href: `#${id}`,
              class: normalizeClass({ on: current.value === id })
            }, [
              createTextVNode(toDisplayString(title), 1),
              count ? (openBlock(), createElementBlock("span", _hoisted_8$6, toDisplayString(count), 1)) : createCommentVNode("", true)
            ], 10, _hoisted_7$7);
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
const _sfc_main$f = {
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
const _hoisted_1$d = {
  id: "top",
  class: "hero"
};
const _hoisted_2$a = { class: "facts" };
const _hoisted_3$a = { class: "hotbar-wrap" };
const _hoisted_4$8 = {
  class: "held-name",
  "aria-live": "polite"
};
const _hoisted_5$8 = {
  class: "hotbar",
  role: "toolbar",
  "aria-label": "Хотбар: старшие клинки"
};
const _hoisted_6$7 = ["aria-label", "onClick", "onFocus", "onDblclick"];
const _hoisted_7$6 = ["src"];
const _sfc_main$e = {
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
      return openBlock(), createElementBlock("header", _hoisted_1$d, [
        _cache[3] || (_cache[3] = createBaseVNode("div", { class: "eyebrow" }, "Вики плагина · Paper 1.21.11", -1)),
        _cache[4] || (_cache[4] = createBaseVNode("h1", null, [
          createTextVNode("Кодекс "),
          createBaseVNode("em", null, "VirusSwords")
        ], -1)),
        _cache[5] || (_cache[5] = createBaseVNode("p", { class: "lead" }, "Клинки, которые находят в мире, куют из душ и доводят до последней формы у алтарей святилищ. Здесь — каждый клинок и что он умеет, откуда он берётся, как растёт, кто стережёт святилища и что за это даёт мир.", -1)),
        createBaseVNode("div", _hoisted_2$a, [
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
        createBaseVNode("div", _hoisted_3$a, [
          createBaseVNode("div", _hoisted_4$8, [
            createVNode(_sfc_main$f, {
              rarity: held.value.rarity
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(held.value.name), 1)
              ]),
              _: 1
            }, 8, ["rarity"])
          ]),
          createBaseVNode("div", _hoisted_5$8, [
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
                }, null, 8, _hoisted_7$6)
              ], 42, _hoisted_6$7);
            }), 128))
          ]),
          _cache[2] || (_cache[2] = createBaseVNode("div", { class: "hotbar-note" }, "Выберите слот — или клавиши 1–9, как в игре. Двойной клик открывает карточку.", -1))
        ])
      ]);
    };
  }
};
const _hoisted_1$c = { id: "start" };
const _sfc_main$d = {
  __name: "StartSection",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$c, [..._cache[0] || (_cache[0] = [
        createStaticVNode('<div class="sec-head"><div class="eyebrow">Первые шаги</div><h2>С чего начать</h2></div><ol class="steps"><li><h4>Выберите кровь</h4><p>При первом входе откроется выбор родословной. От неё зависят ваша сила, книга, которую вы получите, и то, какие величайшие клинки вас признают.</p></li><li><h4>Выберите путеводителя</h4><p>Следом — чей голос будет с вами: Путеводитель с загадками, Claude, разум Древней фабрики, или Наблюдатель, помнящий Все-Чёрного с первого удара. Вирус фабрики навсегда отдаёт вас Claude, Все-Чёрный — Наблюдателю.</p></li><li><h4>Найдите первый клинок</h4><p>Погибель и Резак лежат в сундуках древнего города, Арахнид — в вагонетках заброшенных шахт, Сумрачная секира — в крепостях Незера.</p></li><li><h4>Добудьте Душу демона</h4><p>Она всегда лежит в сокровищнице бастиона. Клинок плюс Душа на верстаке — и он становится адским. А Иссушитель, убитый клинком из набора, иногда роняет свою душу — из неё и Бедствия выходит Воля Демона.</p></li><li><h4>Растите мастерство</h4><p>Клинок учится от каждого удара. Мастерство открывает заточку и пробуждение; эволюция просит только материалы.</p></li><li><h4>Найдите святилище</h4><p>Они стоят далеко от спавна: кузня — в Незере, храмы — в верхнем мире. Дорогу покажут компас и карты. Пробейтесь через стражу — и алтарь откроет испытания. А глубоко под землёй ждёт Древняя фабрика.</p></li><li><h4>Куйте последнюю форму</h4><p>Высшие клинки — Все-Чёрный, Люцифер, Истинный Экскалибур и Селестиал — куют у алтарей святилищ. Корона отвечает только крови в четвёртой форме, а Все-Чёрный навсегда меняет кровь на бездну.</p></li></ol>', 2)
      ])]);
    };
  }
};
const _hoisted_1$b = { id: "rarity" };
const _hoisted_2$9 = { class: "rarities" };
const _hoisted_3$9 = { class: "rchip" };
const _hoisted_4$7 = { class: "rmeta" };
const _hoisted_5$7 = { class: "swatches" };
const _hoisted_6$6 = ["title"];
const _hoisted_7$5 = { class: "muted small" };
const _hoisted_8$5 = { class: "small" };
const _hoisted_9$4 = {
  key: 1,
  class: "muted"
};
const _sfc_main$c = {
  __name: "RaritySection",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$b, [
        _cache[0] || (_cache[0] = createBaseVNode("div", { class: "sec-head" }, [
          createBaseVNode("div", { class: "eyebrow" }, "Цвет имени"),
          createBaseVNode("h2", null, "Редкости"),
          createBaseVNode("p", { class: "lead" }, "Имя каждого предмета окрашено градиентом своей редкости. Старшие редкости переливаются — градиент бежит по буквам и в инвентаре, и в руке, и в подсказке над хотбаром: это делает шейдер ресурспака, а не сервер.")
        ], -1)),
        createBaseVNode("div", _hoisted_2$9, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(data).rarities, (r) => {
            return openBlock(), createElementBlock("div", {
              key: r.const,
              class: "rarity"
            }, [
              createBaseVNode("div", _hoisted_3$9, [
                createVNode(_sfc_main$f, {
                  rarity: r.const
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(r.label), 1)
                  ]),
                  _: 2
                }, 1032, ["rarity"])
              ]),
              createBaseVNode("div", _hoisted_4$7, [
                createBaseVNode("div", _hoisted_5$7, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(r.palette, (c) => {
                    return openBlock(), createElementBlock("span", {
                      key: c,
                      class: "sw",
                      style: normalizeStyle({ background: c }),
                      title: c
                    }, null, 12, _hoisted_6$6);
                  }), 128))
                ]),
                createBaseVNode("div", _hoisted_7$5, toDisplayString(r.motion), 1),
                createBaseVNode("div", _hoisted_8$5, [
                  r.used.length ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                    createTextVNode(toDisplayString(r.used.join(", ")), 1)
                  ], 64)) : (openBlock(), createElementBlock("span", _hoisted_9$4, "пока ничем не окрашена"))
                ])
              ])
            ]);
          }), 128))
        ])
      ]);
    };
  }
};
const _hoisted_1$a = { class: "tip" };
const _hoisted_2$8 = ["innerHTML"];
const _hoisted_3$8 = { class: "tlore" };
const _hoisted_4$6 = {
  key: 0,
  class: "gap"
};
const _hoisted_5$6 = ["innerHTML"];
const _hoisted_6$5 = {
  key: 0,
  class: "tstats"
};
const _hoisted_7$4 = { key: 0 };
const _hoisted_8$4 = { class: "trar" };
const _sfc_main$b = {
  __name: "ItemTooltip",
  props: { item: { type: Object, required: true } },
  setup(__props) {
    const props = __props;
    const stats = computed(() => props.item.stats.split(/(\d+(?:\.\d+)?)/));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$a, [
        createBaseVNode("div", {
          class: "tname paint",
          style: normalizeStyle(unref(rarityStyle)(__props.item.rarity)),
          innerHTML: __props.item.name
        }, null, 12, _hoisted_2$8),
        createBaseVNode("div", _hoisted_3$8, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(__props.item.lore, (line, i) => {
            return openBlock(), createElementBlock(Fragment, { key: i }, [
              line === "" ? (openBlock(), createElementBlock("div", _hoisted_4$6)) : (openBlock(), createElementBlock("div", {
                key: 1,
                innerHTML: line
              }, null, 8, _hoisted_5$6))
            ], 64);
          }), 128))
        ]),
        __props.item.stats ? (openBlock(), createElementBlock("div", _hoisted_6$5, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(stats.value, (part, i) => {
            return openBlock(), createElementBlock(Fragment, { key: i }, [
              i % 2 ? (openBlock(), createElementBlock("b", _hoisted_7$4, toDisplayString(part), 1)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                createTextVNode(toDisplayString(part), 1)
              ], 64))
            ], 64);
          }), 128))
        ])) : createCommentVNode("", true),
        createBaseVNode("div", _hoisted_8$4, [
          _cache[0] || (_cache[0] = createTextVNode("Редкость: ", -1)),
          createVNode(_sfc_main$f, {
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
const _hoisted_1$9 = ["id"];
const _hoisted_2$7 = { class: "card-top" };
const _hoisted_3$7 = { class: "slot" };
const _hoisted_4$5 = ["src"];
const _hoisted_5$5 = ["innerHTML"];
const _sfc_main$a = {
  __name: "ItemCard",
  props: { item: { type: Object, required: true } },
  setup(__props) {
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
            }, null, 8, _hoisted_4$5)
          ]),
          createVNode(_sfc_main$b, { item: __props.item }, null, 8, ["item"])
        ]),
        createBaseVNode("dl", null, [
          createBaseVNode("div", null, [
            _cache[0] || (_cache[0] = createBaseVNode("dt", null, "Как получить", -1)),
            createBaseVNode("dd", {
              innerHTML: __props.item.obtain
            }, null, 8, _hoisted_5$5)
          ])
        ])
      ], 8, _hoisted_1$9);
    };
  }
};
const _hoisted_1$8 = { id: "weapons" };
const _hoisted_2$6 = { class: "chains" };
const _hoisted_3$6 = { class: "chain-title" };
const _hoisted_4$4 = { class: "chain-row" };
const _hoisted_5$4 = {
  key: 0,
  class: "arrow",
  "aria-hidden": "true"
};
const _hoisted_6$4 = ["href"];
const _hoisted_7$3 = { class: "slot sm" };
const _hoisted_8$3 = ["src"];
const _hoisted_9$3 = { class: "cname" };
const _hoisted_10$2 = {
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
const _sfc_main$9 = {
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
      return openBlock(), createElementBlock("section", _hoisted_1$8, [
        _cache[0] || (_cache[0] = createBaseVNode("div", { class: "sec-head" }, [
          createBaseVNode("div", { class: "eyebrow" }, "Арсенал"),
          createBaseVNode("h2", null, "Оружие"),
          createBaseVNode("p", { class: "lead" }, "Клинки выстроены в линии: каждая начинается с находки в мире и заканчивается неломаемым оружием. На наковальне клинок можно зачаровать и назвать, но нельзя отдать вторым предметом; на точиле — снять с него чары, но не сплавить с другим предметом. Нажмите на клинок в цепочке, чтобы перейти к его карточке.")
        ], -1)),
        createBaseVNode("div", _hoisted_2$6, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(data).chains, (chain) => {
            return openBlock(), createElementBlock("div", {
              key: chain.key,
              class: "chain"
            }, [
              createBaseVNode("div", _hoisted_3$6, toDisplayString(chain.title), 1),
              createBaseVNode("div", _hoisted_4$4, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(chain.entries, (entry) => {
                  return openBlock(), createElementBlock(Fragment, {
                    key: entry.id
                  }, [
                    entry.sep ? (openBlock(), createElementBlock("span", _hoisted_5$4, toDisplayString(entry.sep), 1)) : createCommentVNode("", true),
                    createBaseVNode("a", {
                      class: "chainitem",
                      href: `#w-${entry.id}`
                    }, [
                      createBaseVNode("span", _hoisted_7$3, [
                        createBaseVNode("img", {
                          src: unref(item)(entry.id).icon,
                          alt: ""
                        }, null, 8, _hoisted_8$3)
                      ]),
                      createBaseVNode("span", _hoisted_9$3, toDisplayString(unref(item)(entry.id).name), 1)
                    ], 8, _hoisted_6$4)
                  ], 64);
                }), 128))
              ])
            ]);
          }), 128))
        ]),
        createBaseVNode("div", _hoisted_10$2, [
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
            return openBlock(), createBlock(_sfc_main$a, {
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
const _hoisted_1$7 = { id: "materials" };
const _hoisted_2$5 = { class: "grid" };
const _hoisted_3$5 = {
  key: 0,
  class: "empty"
};
const _sfc_main$8 = {
  __name: "MaterialsSection",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$7, [
        _cache[0] || (_cache[0] = createBaseVNode("div", { class: "sec-head" }, [
          createBaseVNode("div", { class: "eyebrow" }, "Из чего куют"),
          createBaseVNode("h2", null, "Материалы"),
          createBaseVNode("p", { class: "lead" }, "Душа демона и терра-слиток — для крафта. Осколки и детали — валюта святилищ, сердца, перо и ядро — реликвии их стражей. В обычные рецепты и торговлю материалы не уходят.")
        ], -1)),
        createBaseVNode("div", _hoisted_2$5, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(materials), (m) => {
            return openBlock(), createBlock(_sfc_main$a, {
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
const _hoisted_1$6 = { id: "growth" };
const _hoisted_2$4 = { class: "twocol" };
const _hoisted_3$4 = { class: "panel" };
const _hoisted_4$3 = { class: "tbl" };
const _hoisted_5$3 = { class: "num" };
const _hoisted_6$3 = { class: "num" };
const _sfc_main$7 = {
  __name: "GrowthSection",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$6, [
        _cache[6] || (_cache[6] = createBaseVNode("div", { class: "sec-head" }, [
          createBaseVNode("div", { class: "eyebrow" }, "Три дорожки"),
          createBaseVNode("h2", null, "Рост клинка"),
          createBaseVNode("p", { class: "lead" }, "У каждого клинка три дорожки роста, и всё записано на нём самом — мастерство и звёзды уходят с ним в сундук, в обмен и через смерть.")
        ], -1)),
        createBaseVNode("div", _hoisted_2$4, [
          createBaseVNode("div", _hoisted_3$4, [
            _cache[1] || (_cache[1] = createBaseVNode("div", { class: "eyebrow" }, "1 · от боя", -1)),
            _cache[2] || (_cache[2] = createBaseVNode("h3", null, "Мастерство 0–100", -1)),
            _cache[3] || (_cache[3] = createBaseVNode("p", { class: "small" }, "Одно очко — единица урона, реально снятая с цели: добивание моба с одним сердцем учит на одно сердце, а не на весь удар. Лук меч ничему не учит. Каждый уровень даёт +0,1% урона.", -1)),
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
            ]),
            _cache[4] || (_cache[4] = createBaseVNode("p", { class: "small muted" }, "Очки пишутся на клинок, когда он покидает руку или открывается инвентарь, — иначе меч дёргался бы при каждом ударе. Новый уровень пишется сразу и показывается внизу экрана, над хотбаром.", -1))
          ]),
          _cache[5] || (_cache[5] = createStaticVNode('<div class="panel"><div class="eyebrow">2 · у кузнеца</div><h3>Заточка <span class="stars">★★★★★</span></h3><p class="small">Каждая звезда +4% урона. Звезда n требует мастерства 15·n и стоит 8·n осколков святилища и n штук катализатора; ★4 и ★5 — ещё и реликвию стража.</p><div class="tbl"><table><thead><tr><th>Звезда</th><th class="num">Мастерство</th><th class="num">Осколки</th><th class="num">Катализатор</th><th>Реликвия</th></tr></thead><tbody><tr><td class="stars">★</td><td class="num">15</td><td class="num">8</td><td class="num">1</td><td>—</td></tr><tr><td class="stars">★★</td><td class="num">30</td><td class="num">16</td><td class="num">2</td><td>—</td></tr><tr><td class="stars">★★★</td><td class="num">45</td><td class="num">24</td><td class="num">3</td><td>—</td></tr><tr><td class="stars">★★★★</td><td class="num">60</td><td class="num">32</td><td class="num">4</td><td>1</td></tr><tr><td class="stars">★★★★★</td><td class="num">75</td><td class="num">40</td><td class="num">5</td><td>1</td></tr></tbody></table></div><p class="small muted">Катализатор: незеритовый лом в кузне, осколки аметиста в храме. Небесные клинки точат в Небесном храме, терра-клинки — будут в Храме джунглей, остальные — в Незеритовой кузне.</p></div><div class="panel"><div class="eyebrow">3 · однажды</div><h3>Пробуждение</h3><p class="small">Один раз за жизнь клинка: нужны заточка ★3 и мастерство 50. Цена — 32 осколка и реликвия стража.</p><p class="small">Перезарядка способности короче на четверть, урон +5%. Клинок на самом верху — мастерство 100, пять звёзд, пробуждён — бьёт на 35% сильнее своей базы.</p></div>', 2))
        ]),
        _cache[7] || (_cache[7] = createStaticVNode('<h3>Эволюции у алтарей</h3><div class="tbl"><table><thead><tr><th>Из</th><th>В</th><th>Алтарь</th><th>Цена</th></tr></thead><tbody><tr><td>Бедствие</td><td>Воля Демона</td><td>Кузня</td><td>16 осколков души, череп скелета-иссушителя</td></tr><tr><td>Воля Демона</td><td><b>Все-Чёрный</b></td><td>Кузня</td><td>64 осколка души, Сердце кузни, Чёрная субстанция</td></tr><tr><td>Убийца демонов</td><td>Рассекатель могил</td><td>Кузня</td><td>32 осколка души, незеритовый слиток</td></tr><tr><td>Рассекатель могил</td><td><b>Люцифер</b></td><td>Кузня</td><td>64 осколка души, Сердце кузни</td></tr><tr><td>Солнцестояние</td><td>Ночная фурия</td><td>Тёмный храм</td><td>16 небесных осколков, 8 лазуритовых блоков</td></tr><tr><td>Ночная фурия</td><td><b>Реквием девятого неба</b></td><td>Тёмный храм</td><td>64 небесных осколка, Перо серафима, Сердце хранителя</td></tr></tbody></table></div><p class="small">Сумрачная секира меняется сама: в испытании кузни она становится <b>Секирой берсерка</b>, в испытании Небесного храма — <b>Золотым фениксом</b>.</p><p class="small muted">Эволюция просит только материалы — мастерство для неё не нужно. Зачарования, заточка и пробуждение переходят на новую форму, мастерство начинается с нуля.</p><h3>Небесная ковка</h3><p>Небесные клинки не лежат в сундуках и не крафтятся: их куют у алтаря Небесного храма (кроме Золотого феникса — он получается из Сумрачной секиры, — и Призрачного стража: он лежит в сокровищнице Проклятого замка). Каждый стоит 40 небесных осколков и Перо серафима, плюс свой взнос. Солнцестояние и Экскалибур куются только днём.</p><div class="tbl"><table><thead><tr><th>Клинок</th><th>Взнос</th><th>Когда</th></tr></thead><tbody><tr><td>Hyperion</td><td>16 жемчугов Края</td><td>в любое время</td></tr><tr><td>Солнцестояние</td><td>8 золотых блоков</td><td>только днём</td></tr><tr><td>Экскалибур</td><td>4 алмазных и 4 золотых блока</td><td>только днём</td></tr></tbody></table></div><h3>Ночная ковка</h3><p>Синие небесные клинки куют только в <b>Тёмном храме</b>, который стоит лишь ночью. Они признают только ночную небесную кровь.</p><div class="tbl"><table><thead><tr><th>Клинок</th><th>Взнос</th><th>Когда</th></tr></thead><tbody><tr><td>Ночная фурия</td><td>40 небесных осколков, Перо серафима, 8 лазуритовых блоков</td><td>пока стоит храм</td></tr><tr><td>Звёздная грань</td><td>48 небесных осколков, Перо серафима, звезда Незера, 16 осколков аметиста</td><td>только в полнолуние</td></tr><tr><td><b>Истинный Экскалибур</b></td><td>Экскалибур, Звёздная грань, Око ночи (с Пустотного Серафима) — оба клинка уходят в новый</td><td>пока стоит храм</td></tr></tbody></table></div><h3>Ковка в джунглях</h3><p>Алтарь Храма джунглей пока не затачивает и не пробуждает клинки, но два клинка он уже куёт — в любое время.</p><div class="tbl"><table><thead><tr><th>Клинок</th><th>Цена</th><th>Чей</th></tr></thead><tbody><tr><td>Терра-блейд</td><td>40 реликтовых осколков, Сердце джунглей, 8 терра-слитков</td><td>кровь предков, со второй формы</td></tr><tr><td>Энигма</td><td>48 реликтовых осколков, Сердце джунглей, 4 терра-слитка, Терра-сущность, 16 изумрудных блоков</td><td>кровь предков, с третьей формы</td></tr><tr><td>Селестиал</td><td>эволюция Энигмы: 24 терра-слитка, Терра-сущность</td><td>корона крови предков, с четвёртой формы</td></tr></tbody></table></div>', 13))
      ]);
    };
  }
};
const _hoisted_1$5 = { id: "sanctums" };
const _hoisted_2$3 = { class: "guides" };
const _hoisted_3$3 = { class: "guide-card" };
const _hoisted_4$2 = {
  class: "guide-grid",
  "aria-hidden": "true"
};
const _hoisted_5$2 = { class: "gslot ring" };
const _hoisted_6$2 = ["src"];
const _hoisted_7$2 = { class: "gslot ring" };
const _hoisted_8$2 = ["src"];
const _hoisted_9$2 = { class: "gslot core" };
const _hoisted_10$1 = ["src"];
const _hoisted_11$1 = { class: "gslot ring" };
const _hoisted_12$1 = ["src"];
const _hoisted_13$1 = { class: "gslot ring" };
const _hoisted_14$1 = ["src"];
const _hoisted_15 = { class: "guide-card" };
const _hoisted_16 = {
  class: "guide-grid",
  "aria-hidden": "true"
};
const _hoisted_17 = { class: "gslot ring" };
const _hoisted_18 = ["src"];
const _hoisted_19 = { class: "gslot ring" };
const _hoisted_20 = ["src"];
const _hoisted_21 = { class: "gslot core" };
const _hoisted_22 = ["src"];
const _hoisted_23 = { class: "gslot ring" };
const _hoisted_24 = ["src"];
const _hoisted_25 = { class: "gslot ring" };
const _hoisted_26 = ["src"];
const _hoisted_27 = { class: "guide-card" };
const _hoisted_28 = {
  class: "guide-grid",
  "aria-hidden": "true"
};
const _hoisted_29 = { class: "gslot ring" };
const _hoisted_30 = ["src"];
const _hoisted_31 = { class: "gslot ring" };
const _hoisted_32 = ["src"];
const _hoisted_33 = { class: "gslot core" };
const _hoisted_34 = ["src"];
const _hoisted_35 = { class: "gslot ring" };
const _hoisted_36 = ["src"];
const _hoisted_37 = { class: "gslot ring" };
const _hoisted_38 = ["src"];
const _hoisted_39 = { class: "guide-card" };
const _hoisted_40 = {
  class: "guide-item",
  "aria-hidden": "true"
};
const _hoisted_41 = ["src"];
const _hoisted_42 = { class: "guide-card" };
const _hoisted_43 = {
  class: "guide-grid",
  "aria-hidden": "true"
};
const _hoisted_44 = { class: "gslot ring" };
const _hoisted_45 = ["src"];
const _hoisted_46 = { class: "gslot core" };
const _hoisted_47 = ["src"];
const _hoisted_48 = { class: "guide-card" };
const _hoisted_49 = {
  class: "guide-item",
  "aria-hidden": "true"
};
const _hoisted_50 = ["src"];
const _hoisted_51 = {
  class: "sanctum",
  id: "forge"
};
const _hoisted_52 = ["src"];
const _hoisted_53 = { class: "sanctum-body" };
const _hoisted_54 = { class: "sanctum-info" };
const _hoisted_55 = { class: "kv" };
const _hoisted_56 = { class: "inline-icons" };
const _hoisted_57 = ["src"];
const _hoisted_58 = ["src"];
const _hoisted_59 = {
  class: "sanctum",
  id: "temple"
};
const _hoisted_60 = ["src"];
const _hoisted_61 = { class: "sanctum-body" };
const _hoisted_62 = { class: "sanctum-info" };
const _hoisted_63 = { class: "kv" };
const _hoisted_64 = { class: "inline-icons" };
const _hoisted_65 = ["src"];
const _hoisted_66 = ["src"];
const _hoisted_67 = ["src"];
const _hoisted_68 = {
  class: "sanctum",
  id: "jungle"
};
const _hoisted_69 = ["src"];
const _hoisted_70 = { class: "sanctum-body" };
const _hoisted_71 = { class: "sanctum-info" };
const _hoisted_72 = { class: "kv" };
const _hoisted_73 = { class: "inline-icons" };
const _hoisted_74 = ["src"];
const _hoisted_75 = ["src"];
const _hoisted_76 = {
  class: "sanctum",
  id: "night"
};
const _hoisted_77 = ["src"];
const _hoisted_78 = { class: "sanctum-body" };
const _hoisted_79 = { class: "sanctum-info" };
const _hoisted_80 = { class: "kv" };
const _hoisted_81 = { class: "inline-icons" };
const _hoisted_82 = ["src"];
const _hoisted_83 = ["src"];
const _hoisted_84 = {
  class: "sanctum",
  id: "factory"
};
const _hoisted_85 = ["src"];
const _hoisted_86 = { class: "sanctum-body" };
const _hoisted_87 = { class: "sanctum-info" };
const _hoisted_88 = { class: "kv" };
const _hoisted_89 = { class: "inline-icons" };
const _hoisted_90 = ["src"];
const _hoisted_91 = ["src"];
const _hoisted_92 = {
  class: "sanctum",
  id: "castle"
};
const _hoisted_93 = ["src"];
const _hoisted_94 = { class: "sanctum-body" };
const _hoisted_95 = { class: "sanctum-info" };
const _hoisted_96 = { class: "kv" };
const _hoisted_97 = { class: "inline-icons" };
const _hoisted_98 = ["src"];
const _hoisted_99 = ["src"];
const _hoisted_100 = ["src"];
const _hoisted_101 = {
  class: "sanctum",
  id: "wanderer-cube"
};
const _hoisted_102 = { class: "terra-figure cube-figure" };
const _hoisted_103 = { class: "cube-row" };
const _hoisted_104 = ["src", "alt"];
const _hoisted_105 = { class: "sanctum-body" };
const _hoisted_106 = { class: "sanctum-info" };
const _hoisted_107 = { class: "kv" };
const _hoisted_108 = { class: "inline-icons" };
const _hoisted_109 = ["src"];
const _hoisted_110 = ["src"];
const _hoisted_111 = {
  class: "sanctum",
  id: "terra-trial"
};
const _hoisted_112 = { class: "terra-figure" };
const _hoisted_113 = ["src"];
const _hoisted_114 = { class: "sanctum-body" };
const _hoisted_115 = { class: "sanctum-info" };
const _hoisted_116 = { class: "kv" };
const _hoisted_117 = { class: "inline-icons" };
const _hoisted_118 = ["src"];
const _hoisted_119 = { class: "inline-icons" };
const _hoisted_120 = ["src"];
const _hoisted_121 = ["src"];
const _hoisted_122 = ["src"];
const _sfc_main$6 = {
  __name: "SanctumsSection",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$5, [
        _cache[88] || (_cache[88] = createStaticVNode('<div class="sec-head"><div class="eyebrow">Одно на сервер</div><h2>Святилища</h2><p class="lead">Пять построек, каждая существует в мире в единственном экземпляре. Постройка поднимается, когда игрок впервые подходит ближе 160 блоков. Внутри нельзя ломать, ставить, взрывать блоки и двигать их поршнями, лить лаву и воду и открывать порталы — решётку не обойти подкопом.</p><p class="lead"><b>Внутри светло и нет чужих.</b> Обычные мобы в святилищах не появляются — залы принадлежат только страже.</p><p class="lead"><b>Храмы кочуют.</b> Отсчёт начинается, когда игрок дошёл до святилища и ушёл или погиб: опустевшее на 10 минут святилище исчезает и встаёт в другом месте. До первого гостя оно ждёт сколько угодно. Древняя фабрика стоит на месте, а Тёмный храм приходит только ночью. Компас воздуха покажет новое место, а для карты нужна новая карта.</p><p class="lead">Меню алтаря с ресурспаком — свой экран: тёмный камень и лава в кузне, мрамор и облака в храме, мох и лианы в джунглях, медь и трубы на фабрике, звёздное небо в Тёмном храме.</p></div><div class="flow" aria-label="Путь через святилище"><div class="step"><b>Вход</b><span>туннель, ступени или ворота</span></div><span class="to" aria-hidden="true">→</span><div class="step"><b>Три комнаты</b><span>в каждой стража, светится сквозь стены; из храма она не выходит; осколки с неё — сразу в инвентарь</span></div><span class="to" aria-hidden="true">→</span><div class="step"><b>Алтарь</b><span>откроется, когда падёт вся стража: эволюция, заточка, испытания</span></div><span class="to" aria-hidden="true">→</span><div class="step"><b>Арена</b><span>испытание: пять волн светящейся стражи, в пятой — страж</span></div></div><h3>Пять святилищ коротко</h3><div class="tbl"><table><thead><tr><th>Святилище</th><th>Где</th><th>Чем искать</th><th>Страж</th><th>Кочует</th><th>Кровь</th></tr></thead><tbody><tr><td>Незеритовая кузня</td><td>Незер, в толще незерака</td><td>Карта кузни</td><td>Горнило</td><td>да, через 10 мин после ухода игроков</td><td>пепельная</td></tr><tr><td>Небесный храм</td><td>верхний мир, остров на высоте 200</td><td>Компас воздуха</td><td>Серафим Падшего Рассвета</td><td>да, и рушится от Печати ночи</td><td>небесная</td></tr><tr><td>Храм джунглей</td><td>джунгли</td><td>Карта джунглей</td><td>Древний страж джунглей</td><td>да, через 10 мин после ухода игроков</td><td>предков</td></tr><tr><td>Тёмный храм</td><td>верхний мир, только ночью</td><td>Ночной компас</td><td>нет; Бессмертный серафим — в Чертоге ночи</td><td>каждую ночь на новом месте</td><td>ночная небесная</td></tr><tr><td>Древняя фабрика</td><td>глубоко под землёй</td><td>Неизвестный компас</td><td>Предвестник</td><td>нет</td><td>техноорганическая</td></tr></tbody></table></div><h3>Как найти святилище</h3><p>Каждое святилище ищется своим предметом. Три крафтят на верстаке: нужный предмет в центр, четыре ингредиента крестом вокруг; Ночной компас делают из Компаса воздуха; Неизвестный только находят. Компас всегда ведёт к храму, где бы тот ни стоял; карта показывает место, где святилище стояло, когда её сделали.</p>', 6)),
        createBaseVNode("div", _hoisted_2$3, [
          createBaseVNode("div", _hoisted_3$3, [
            createBaseVNode("div", _hoisted_4$2, [
              _cache[0] || (_cache[0] = createBaseVNode("span", { class: "gslot" }, null, -1)),
              createBaseVNode("span", _hoisted_5$2, [
                createBaseVNode("img", {
                  src: unref(data).guideIcons.wind_charge,
                  alt: "Заряд ветра",
                  title: "Заряд ветра"
                }, null, 8, _hoisted_6$2)
              ]),
              _cache[1] || (_cache[1] = createBaseVNode("span", { class: "gslot" }, null, -1)),
              createBaseVNode("span", _hoisted_7$2, [
                createBaseVNode("img", {
                  src: unref(data).guideIcons.wind_charge,
                  alt: "Заряд ветра",
                  title: "Заряд ветра"
                }, null, 8, _hoisted_8$2)
              ]),
              createBaseVNode("span", _hoisted_9$2, [
                createBaseVNode("img", {
                  src: unref(data).guideIcons.compass,
                  alt: "Компас",
                  title: "Компас"
                }, null, 8, _hoisted_10$1)
              ]),
              createBaseVNode("span", _hoisted_11$1, [
                createBaseVNode("img", {
                  src: unref(data).guideIcons.wind_charge,
                  alt: "Заряд ветра",
                  title: "Заряд ветра"
                }, null, 8, _hoisted_12$1)
              ]),
              _cache[2] || (_cache[2] = createBaseVNode("span", { class: "gslot" }, null, -1)),
              createBaseVNode("span", _hoisted_13$1, [
                createBaseVNode("img", {
                  src: unref(data).guideIcons.wind_charge,
                  alt: "Заряд ветра",
                  title: "Заряд ветра"
                }, null, 8, _hoisted_14$1)
              ]),
              _cache[3] || (_cache[3] = createBaseVNode("span", { class: "gslot" }, null, -1))
            ]),
            _cache[4] || (_cache[4] = createBaseVNode("div", null, [
              createBaseVNode("h4", null, "Компас воздуха"),
              createBaseVNode("p", { class: "small" }, "Компас в центре, четыре заряда ветра крестом."),
              createBaseVNode("p", { class: "small muted" }, "Стрелка указывает на Небесный храм. Работает в верхнем мире.")
            ], -1))
          ]),
          createBaseVNode("div", _hoisted_15, [
            createBaseVNode("div", _hoisted_16, [
              _cache[5] || (_cache[5] = createBaseVNode("span", { class: "gslot" }, null, -1)),
              createBaseVNode("span", _hoisted_17, [
                createBaseVNode("img", {
                  src: unref(data).guideIcons.nether_brick,
                  alt: "Незерский кирпич",
                  title: "Незерский кирпич"
                }, null, 8, _hoisted_18)
              ]),
              _cache[6] || (_cache[6] = createBaseVNode("span", { class: "gslot" }, null, -1)),
              createBaseVNode("span", _hoisted_19, [
                createBaseVNode("img", {
                  src: unref(data).guideIcons.nether_brick,
                  alt: "Незерский кирпич",
                  title: "Незерский кирпич"
                }, null, 8, _hoisted_20)
              ]),
              createBaseVNode("span", _hoisted_21, [
                createBaseVNode("img", {
                  src: unref(data).guideIcons.map,
                  alt: "Пустая карта",
                  title: "Пустая карта"
                }, null, 8, _hoisted_22)
              ]),
              createBaseVNode("span", _hoisted_23, [
                createBaseVNode("img", {
                  src: unref(data).guideIcons.nether_brick,
                  alt: "Незерский кирпич",
                  title: "Незерский кирпич"
                }, null, 8, _hoisted_24)
              ]),
              _cache[7] || (_cache[7] = createBaseVNode("span", { class: "gslot" }, null, -1)),
              createBaseVNode("span", _hoisted_25, [
                createBaseVNode("img", {
                  src: unref(data).guideIcons.nether_brick,
                  alt: "Незерский кирпич",
                  title: "Незерский кирпич"
                }, null, 8, _hoisted_26)
              ]),
              _cache[8] || (_cache[8] = createBaseVNode("span", { class: "gslot" }, null, -1))
            ]),
            _cache[9] || (_cache[9] = createBaseVNode("div", null, [
              createBaseVNode("h4", null, "Карта кузни"),
              createBaseVNode("p", { class: "small" }, "Пустая карта в центре, четыре незерских кирпича крестом."),
              createBaseVNode("p", { class: "small muted" }, "Карта Незера, на ней крестом отмечена Незеритовая кузня. Земля прорисовывается, пока вы идёте с картой в руке.")
            ], -1))
          ]),
          createBaseVNode("div", _hoisted_27, [
            createBaseVNode("div", _hoisted_28, [
              _cache[10] || (_cache[10] = createBaseVNode("span", { class: "gslot" }, null, -1)),
              createBaseVNode("span", _hoisted_29, [
                createBaseVNode("img", {
                  src: unref(data).guideIcons.emerald,
                  alt: "Изумруд",
                  title: "Изумруд"
                }, null, 8, _hoisted_30)
              ]),
              _cache[11] || (_cache[11] = createBaseVNode("span", { class: "gslot" }, null, -1)),
              createBaseVNode("span", _hoisted_31, [
                createBaseVNode("img", {
                  src: unref(data).guideIcons.emerald,
                  alt: "Изумруд",
                  title: "Изумруд"
                }, null, 8, _hoisted_32)
              ]),
              createBaseVNode("span", _hoisted_33, [
                createBaseVNode("img", {
                  src: unref(data).guideIcons.map,
                  alt: "Пустая карта",
                  title: "Пустая карта"
                }, null, 8, _hoisted_34)
              ]),
              createBaseVNode("span", _hoisted_35, [
                createBaseVNode("img", {
                  src: unref(data).guideIcons.emerald,
                  alt: "Изумруд",
                  title: "Изумруд"
                }, null, 8, _hoisted_36)
              ]),
              _cache[12] || (_cache[12] = createBaseVNode("span", { class: "gslot" }, null, -1)),
              createBaseVNode("span", _hoisted_37, [
                createBaseVNode("img", {
                  src: unref(data).guideIcons.emerald,
                  alt: "Изумруд",
                  title: "Изумруд"
                }, null, 8, _hoisted_38)
              ]),
              _cache[13] || (_cache[13] = createBaseVNode("span", { class: "gslot" }, null, -1))
            ]),
            _cache[14] || (_cache[14] = createBaseVNode("div", null, [
              createBaseVNode("h4", null, "Карта джунглей"),
              createBaseVNode("p", { class: "small" }, "Пустая карта в центре, четыре изумруда крестом."),
              createBaseVNode("p", { class: "small muted" }, "Отмечает Храм джунглей. Все карты одного святилища на одном месте — одна карта: что разведал один, видят все. Святилище переехало — нужна новая.")
            ], -1))
          ]),
          createBaseVNode("div", _hoisted_39, [
            createBaseVNode("div", _hoisted_40, [
              createBaseVNode("img", {
                src: unref(data).guideIcons.unknown_compass,
                alt: ""
              }, null, 8, _hoisted_41)
            ]),
            _cache[15] || (_cache[15] = createBaseVNode("div", null, [
              createBaseVNode("h4", null, "Неизвестный компас"),
              createBaseVNode("p", { class: "small" }, [
                createTextVNode("Не крафтится. Лежит в сундуках "),
                createBaseVNode("b", null, "заброшенных шахт"),
                createTextVNode(" (8%) и "),
                createBaseVNode("b", null, "древних городов"),
                createTextVNode(" (20%).")
              ]),
              createBaseVNode("p", { class: "small muted" }, "«Стрелка указывает в неизвестном направлении». На деле — на будку шахты Древней фабрики, единственный вход вниз.")
            ], -1))
          ]),
          createBaseVNode("div", _hoisted_42, [
            createBaseVNode("div", _hoisted_43, [
              _cache[16] || (_cache[16] = createBaseVNode("span", { class: "gslot" }, null, -1)),
              _cache[17] || (_cache[17] = createBaseVNode("span", { class: "gslot" }, null, -1)),
              _cache[18] || (_cache[18] = createBaseVNode("span", { class: "gslot" }, null, -1)),
              createBaseVNode("span", _hoisted_44, [
                createBaseVNode("img", {
                  src: unref(data).guideIcons.compass,
                  alt: "Компас воздуха",
                  title: "Компас воздуха"
                }, null, 8, _hoisted_45)
              ]),
              createBaseVNode("span", _hoisted_46, [
                createBaseVNode("img", {
                  src: unref(data).guideIcons.nether_star,
                  alt: "Звезда Незера",
                  title: "Звезда Незера"
                }, null, 8, _hoisted_47)
              ]),
              _cache[19] || (_cache[19] = createBaseVNode("span", { class: "gslot" }, null, -1)),
              _cache[20] || (_cache[20] = createBaseVNode("span", { class: "gslot" }, null, -1)),
              _cache[21] || (_cache[21] = createBaseVNode("span", { class: "gslot" }, null, -1)),
              _cache[22] || (_cache[22] = createBaseVNode("span", { class: "gslot" }, null, -1))
            ]),
            _cache[23] || (_cache[23] = createBaseVNode("div", null, [
              createBaseVNode("h4", null, "Ночной компас"),
              createBaseVNode("p", { class: "small" }, "Компас воздуха и звезда Незера — в любых клетках верстака."),
              createBaseVNode("p", { class: "small muted" }, "Указывает на Тёмный храм, пока тот стоит; днём и без храма стрелка кружится.")
            ], -1))
          ]),
          createBaseVNode("div", _hoisted_48, [
            createBaseVNode("div", _hoisted_49, [
              createBaseVNode("img", {
                src: unref(data).icons.terra_compass,
                alt: ""
              }, null, 8, _hoisted_50)
            ]),
            _cache[24] || (_cache[24] = createBaseVNode("div", null, [
              createBaseVNode("h4", null, "Терра-компас"),
              createBaseVNode("p", { class: "small" }, [
                createTextVNode("Собирает "),
                createBaseVNode("b", null, "кровь предков"),
                createTextVNode(" у алтаря Храма джунглей: компас и 8 терра-слитков.")
              ]),
              createBaseVNode("p", { class: "small muted" }, "Указывает на Терра-подземелье глубоко под землёй — на шахту над входом. Подземелья нет — его создаёт сам компас.")
            ], -1))
          ])
        ]),
        createBaseVNode("article", _hoisted_51, [
          createBaseVNode("figure", null, [
            createBaseVNode("img", {
              src: unref(data).images.forge,
              alt: "Незеритовая кузня: вид снаружи, разрез и план"
            }, null, 8, _hoisted_52),
            _cache[25] || (_cache[25] = createBaseVNode("figcaption", null, "Снаружи · разрез на уровне игрока · план с зонами (оранжевые точки — стража, красная — страж, голубые — где встают волны испытания, белая — алтарь)", -1))
          ]),
          createBaseVNode("div", _hoisted_53, [
            createBaseVNode("div", _hoisted_54, [
              _cache[30] || (_cache[30] = createBaseVNode("div", { class: "sanctum-title" }, [
                createBaseVNode("h3", null, "Незеритовая кузня"),
                createBaseVNode("span", { class: "pill" }, "Незер")
              ], -1)),
              createBaseVNode("dl", _hoisted_55, [
                _cache[29] || (_cache[29] = createStaticVNode("<div><dt>Где</dt><dd>в Незере, в 250–600 блоках от центра, внутри скалы</dd></div><div><dt>Внутри</dt><dd>вестибюль, кузнечный зал, арена и алтарная</dd></div><div><dt>Стража</dt><dd>скелеты-иссушители, ифриты, пиглины-громилы (с золотыми мечами, бьют слабее обычных)</dd></div><div><dt>Алтарь</dt><dd>испытания, эволюции, заточка и Испытание крови пепельной крови</dd></div>", 4)),
                createBaseVNode("div", null, [
                  _cache[28] || (_cache[28] = createBaseVNode("dt", null, "Добыча", -1)),
                  createBaseVNode("dd", _hoisted_56, [
                    createBaseVNode("img", {
                      src: unref(data).icons.soul_shard,
                      alt: ""
                    }, null, 8, _hoisted_57),
                    _cache[26] || (_cache[26] = createTextVNode("Осколки души · ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.forge_heart,
                      alt: ""
                    }, null, 8, _hoisted_58),
                    _cache[27] || (_cache[27] = createTextVNode("Сердце кузни", -1))
                  ])
                ])
              ])
            ]),
            _cache[31] || (_cache[31] = createStaticVNode('<div class="boss"><div class="boss-name">Горнило, кузнец Преисподней</div><div class="boss-stats"><span class="pill">400 здоровья</span><span class="pill">урон 7</span><span class="pill">броня 12</span><span class="pill">скелет-иссушитель ×1,8</span></div><ul class="attacks"><li><b>Пятая волна.</b> Приходит в пятой волне испытания кузни.</li><li><b>Молот.</b> Прыгает к игроку и приземляется ударной волной: 7 урона в радиусе 5 блоков и отброс. Место посадки светится на полу — уходите из круга, а после посадки бейте: 6 секунд он уязвим.</li><li><b>Огненное кольцо.</b> Катится по полу от босса: 5 урона и поджог тем, кто стоит на земле. Кольцо перепрыгивают; ниже 30% за ним катится второе.</li><li><b>Извержение.</b> Под бойцами разгораются оранжевые круги — через полторы секунды оттуда бьёт лава: 7 урона, поджог и подброс.</li><li><b>Подмастерья.</b> На 75, 50 и 25% здоровья зовёт трёх скелетов-иссушителей.</li><li><b>Ярость.</b> Ниже 30% — быстрее и сильнее.</li></ul></div>', 1))
          ])
        ]),
        createBaseVNode("article", _hoisted_59, [
          createBaseVNode("figure", null, [
            createBaseVNode("img", {
              src: unref(data).images.temple,
              alt: "Небесный храм: вид снаружи, разрез и план"
            }, null, 8, _hoisted_60),
            _cache[32] || (_cache[32] = createBaseVNode("figcaption", null, "Снаружи · разрез на уровне игрока · план с зонами", -1))
          ]),
          createBaseVNode("div", _hoisted_61, [
            createBaseVNode("div", _hoisted_62, [
              _cache[38] || (_cache[38] = createBaseVNode("div", { class: "sanctum-title" }, [
                createBaseVNode("h3", null, "Небесный храм"),
                createBaseVNode("span", { class: "pill" }, "верхний мир")
              ], -1)),
              createBaseVNode("dl", _hoisted_63, [
                _cache[37] || (_cache[37] = createStaticVNode("<div><dt>Где</dt><dd>летающий остров на высоте 200, в 900–1800 блоках от спавна</dd></div><div><dt>Внутри</dt><dd>колоннада, неф с колокольнями и ротонда с алтарём</dd></div><div><dt>Путь наверх</dt><dd>встаньте в поток над маяком у Врат ветра; вниз — Shift</dd></div><div><dt>Стража</dt><dd>зимогоры и поборники в золоте</dd></div><div><dt>Алтарь</dt><dd>стол зачарований — испытания храма, ковка, заточка и пробуждение небесных клинков</dd></div>", 5)),
                createBaseVNode("div", null, [
                  _cache[36] || (_cache[36] = createBaseVNode("dt", null, "Добыча", -1)),
                  createBaseVNode("dd", _hoisted_64, [
                    createBaseVNode("img", {
                      src: unref(data).icons.celestial_shard,
                      alt: ""
                    }, null, 8, _hoisted_65),
                    _cache[33] || (_cache[33] = createTextVNode("Небесные осколки · ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.seraph_feather,
                      alt: ""
                    }, null, 8, _hoisted_66),
                    _cache[34] || (_cache[34] = createTextVNode("Перо серафима · ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.night_seal,
                      alt: ""
                    }, null, 8, _hoisted_67),
                    _cache[35] || (_cache[35] = createTextVNode("Печать ночи", -1))
                  ])
                ])
              ])
            ]),
            _cache[39] || (_cache[39] = createStaticVNode('<div class="boss"><div class="boss-name">Серафим Падшего Рассвета</div><div class="boss-stats"><span class="pill">450 здоровья</span><span class="pill">броня 8</span><span class="pill">иллюзор ×1,6</span></div><ul class="attacks"><li><b>Пятая волна.</b> Приходит в пятой волне испытания храма. В 3-м испытании роняет Печать ночи.</li><li><b>Суд.</b> Столбы света отмечают три места — через полторы секунды туда бьёт молния, 12 урона. Выйдите из света.</li><li><b>Перья.</b> Под бойцами сжимаются золотые кольца — через секунду на них падает залп стрел. Выйдите из кольца.</li><li><b>Щит рассвета.</b> На 60 и 30% здоровья неуязвим, пока живы четыре призванных стража. Щит лопается — и 4 секунды Серафим уязвим.</li><li><b>Лучи рассвета.</b> Три луча на уровне пояса 4 секунды обходят его кругом: 4 урона за касание. Перепрыгивайте их или держитесь дальше 14 блоков.</li><li><b>Мерцание.</b> Время от времени переносится в другую точку двора.</li></ul></div>', 1))
          ])
        ]),
        createBaseVNode("article", _hoisted_68, [
          createBaseVNode("figure", null, [
            createBaseVNode("img", {
              src: unref(data).images.jungle,
              alt: "Храм джунглей: вид снаружи, разрез, план залов и план лабиринта"
            }, null, 8, _hoisted_69),
            _cache[40] || (_cache[40] = createBaseVNode("figcaption", null, "Снаружи · разрез на уровне игрока · план залов · лабиринт на втором этаже", -1))
          ]),
          createBaseVNode("div", _hoisted_70, [
            createBaseVNode("div", _hoisted_71, [
              _cache[45] || (_cache[45] = createBaseVNode("div", { class: "sanctum-title" }, [
                createBaseVNode("h3", null, "Храм джунглей"),
                createBaseVNode("span", { class: "pill" }, "джунгли")
              ], -1)),
              createBaseVNode("dl", _hoisted_72, [
                _cache[44] || (_cache[44] = createStaticVNode("<div><dt>Где</dt><dd>ступенчатая пирамида в джунглях, в 1200–2400 блоках от спавна</dd></div><div><dt>Внутри</dt><dd>большой зал, арена и алтарная комната</dd></div><div><dt>Стража</dt><dd>болотники, пещерные пауки, пауки, ведьмы</dd></div><div><dt>Алтарь</dt><dd>магнетит — испытания храма, ковка Терра-блейда и Энигмы, Испытание крови для крови предков</dd></div>", 4)),
                createBaseVNode("div", null, [
                  _cache[43] || (_cache[43] = createBaseVNode("dt", null, "Добыча", -1)),
                  createBaseVNode("dd", _hoisted_73, [
                    createBaseVNode("img", {
                      src: unref(data).icons.jungle_shard,
                      alt: ""
                    }, null, 8, _hoisted_74),
                    _cache[41] || (_cache[41] = createTextVNode("Реликтовые осколки · ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.jungle_heart,
                      alt: ""
                    }, null, 8, _hoisted_75),
                    _cache[42] || (_cache[42] = createTextVNode("Сердце джунглей", -1))
                  ])
                ])
              ]),
              _cache[46] || (_cache[46] = createBaseVNode("p", { class: "sleeping" }, "Алтарь уже куёт Терра-блейд и Энигму и проводит испытания, а заточка и пробуждение терра-клинков пока спят.", -1))
            ]),
            _cache[47] || (_cache[47] = createStaticVNode('<div class="boss"><div class="boss-name">Древний страж джунглей</div><div class="boss-stats"><span class="pill">550 здоровья</span><span class="pill">урон 16</span><span class="pill">броня 10</span><span class="pill">разоритель ×1,4</span></div><ul class="attacks"><li><b>Пятая волна.</b> Приходит в пятой волне испытания храма джунглей.</li><li><b>Землетрясение.</b> Всех на земле в 7 блоках подбрасывает и ранит на 10.</li><li><b>Корни.</b> Под бойцами сжимаются зелёные кольца — выйдите из них, пока из пола не вырвались корни.</li><li><b>Споры.</b> Зелёное облако вокруг босса: первую секунду оно только собирается — успейте выйти, потом 6 секунд травит.</li><li><b>Таран.</b> Ревёт, к бойцу бежит зелёная линия — через полторы секунды страж мчится по ней: 12 урона и отброс. Врезавшись в стену, 3 секунды уязвим.</li><li><b>Зов и натиск.</b> На 70 и 40% зовёт обитателей храма, ниже 35% бросается в атаку быстрее и таранит чаще.</li></ul></div>', 1))
          ])
        ]),
        createBaseVNode("article", _hoisted_76, [
          createBaseVNode("figure", null, [
            createBaseVNode("img", {
              src: unref(data).images.night,
              alt: "Тёмный храм: вид снаружи, разрез и план"
            }, null, 8, _hoisted_77),
            _cache[48] || (_cache[48] = createBaseVNode("figcaption", null, "Вид снаружи: тот же остров и собор — в чернокамне и глубинном сланце, под чёрными облаками", -1))
          ]),
          createBaseVNode("div", _hoisted_78, [
            createBaseVNode("div", _hoisted_79, [
              _cache[53] || (_cache[53] = createBaseVNode("div", { class: "sanctum-title" }, [
                createBaseVNode("h3", null, "Тёмный храм"),
                createBaseVNode("span", { class: "pill" }, "только ночью")
              ], -1)),
              createBaseVNode("dl", _hoisted_80, [
                _cache[52] || (_cache[52] = createStaticVNode("<div><dt>Когда</dt><dd>после того как на сервере сломали Печать ночи — каждую ночь в новом месте, до рассвета. Ищите Ночным компасом</dd></div><div><dt>Какой</dt><dd>тёмная тень Небесного храма</dd></div><div><dt>Стража</dt><dd>зимогоры, досаждатели и скелеты-иссушители в кольчуге — «стражи полуночи»</dd></div><div><dt>Алтарь</dt><dd>открывается, когда пала стража: ночная ковка, заточка, призыв Пустотного Серафима и Испытание крови ночной крови</dd></div>", 4)),
                createBaseVNode("div", null, [
                  _cache[51] || (_cache[51] = createBaseVNode("dt", null, "Добыча", -1)),
                  createBaseVNode("dd", _hoisted_81, [
                    createBaseVNode("img", {
                      src: unref(data).icons.celestial_shard,
                      alt: ""
                    }, null, 8, _hoisted_82),
                    _cache[49] || (_cache[49] = createTextVNode("Небесные осколки со стражи · ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.night_eye,
                      alt: ""
                    }, null, 8, _hoisted_83),
                    _cache[50] || (_cache[50] = createTextVNode("Око ночи с Пустотного Серафима", -1))
                  ])
                ])
              ])
            ]),
            _cache[54] || (_cache[54] = createStaticVNode('<div class="boss"><div class="boss-name">Пустотный Серафим</div><div class="boss-stats"><span class="pill">700 здоровья</span><span class="pill">урон 13</span><span class="pill">броня 10</span><span class="pill">эндермен ×1,9</span></div><ul class="attacks"><li><b>Призыв.</b> Когда стража храма пала, его зовут на алтаре за 24 небесных осколка; он встаёт в ротонде. Каждому, кто бился, — Око ночи.</li><li><b>Щит ударов.</b> На 75, 50 и 25% урон не проходит: щит снимают числом ударов, а не силой — 30 и ещё 10 на каждого бойца сверх первого. Сломанный щит — 4 секунды уязвим.</li><li><b>Головы пустоты.</b> С каждым щитом приходят три головы и вцепляются в бойцов; пока жива хоть одна, Серафим получает вдвое меньше урона. Фиолетовые нити от Серафима показывают, где они.</li><li><b>Глиф.</b> Маяк пустоты падает рядом с бойцом. Встаньте в его круг за 5 секунд — иначе взрыв на 60% здоровья каждому.</li><li><b>Лучи разбитого сердца.</b> Поднимается над полом, четыре луча 5 секунд обходят его кругом на уровне пояса: 6 урона за касание. Прыгайте.</li><li><b>Шаг сквозь пустоту.</b> Встаёт у бойца за спиной, и вокруг того сжимается фиолетовое кольцо — выйдите из него за секунду.</li></ul></div><div class="boss"><div class="boss-name">Бессмертный серафим</div><div class="boss-stats"><span class="pill">не умирает</span><span class="pill">Чертог ночи</span><span class="pill">одна минута</span></div><ul class="attacks"><li><b>Чертог ночи.</b> Алтарь переносит начавшего Испытание крови в закрытый зал в небе. Через три секунды там встаёт Бессмертный серафим — с Судом, Перьями и Мерцанием, но без щита: урона он не получает вовсе.</li><li><b>Слуги.</b> Каждые 8 секунд приходят стражи полуночи, и к концу минуты их всё больше.</li><li><b>Итог.</b> Живы через минуту — ночная кровь четвёртой формы и Истинный Экскалибур; умерли или вышли — провал, вещи остаются, а храм вернётся лишь следующей ночью.</li></ul></div>', 2))
          ])
        ]),
        createBaseVNode("article", _hoisted_84, [
          createBaseVNode("figure", null, [
            createBaseVNode("img", {
              src: unref(data).images.factory,
              alt: "Древняя фабрика: пещера без потолка, разрез и план"
            }, null, 8, _hoisted_85),
            _cache[55] || (_cache[55] = createBaseVNode("figcaption", null, "Пещера со снятым каменным потолком (слева — шахта наверх) · разрез на уровне игрока · план с зонами", -1))
          ]),
          createBaseVNode("div", _hoisted_86, [
            createBaseVNode("div", _hoisted_87, [
              _cache[60] || (_cache[60] = createBaseVNode("div", { class: "sanctum-title" }, [
                createBaseVNode("h3", null, "Древняя фабрика"),
                createBaseVNode("span", { class: "pill" }, "под землёй")
              ], -1)),
              createBaseVNode("dl", _hoisted_88, [
                _cache[59] || (_cache[59] = createStaticVNode("<div><dt>Где</dt><dd>глубоко под землёй, в 1500–3000 блоках от спавна. Путь укажет Неизвестный компас</dd></div><div><dt>Внутри</dt><dd>огромный цех: погрузочный и сборочный залы, реактор и пульт управления</dd></div><div><dt>Стража</dt><dd>автоматоны в железе — скелеты и зомби — и летучие дроны; держат погрузочный и сборочный цеха, в третьей комнате — Предвестник</dd></div><div><dt>Терминал</dt><dd>открывается, когда пала стража: запуск Предвестника, рейды, техноорганический вирус, сборка машин и Испытание крови</dd></div>", 4)),
                createBaseVNode("div", null, [
                  _cache[58] || (_cache[58] = createBaseVNode("dt", null, "Добыча", -1)),
                  createBaseVNode("dd", _hoisted_89, [
                    createBaseVNode("img", {
                      src: unref(data).icons.ancient_part,
                      alt: ""
                    }, null, 8, _hoisted_90),
                    _cache[56] || (_cache[56] = createTextVNode("Древние детали · ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.harbinger_core,
                      alt: ""
                    }, null, 8, _hoisted_91),
                    _cache[57] || (_cache[57] = createTextVNode("Ядро Предвестника", -1))
                  ])
                ])
              ])
            ]),
            _cache[61] || (_cache[61] = createStaticVNode('<div class="boss"><div class="boss-name">Предвестник</div><div class="boss-stats"><span class="pill">600 здоровья</span><span class="pill">урон 18</span><span class="pill">броня 14</span><span class="pill">железный голем ×1,5</span></div><ul class="attacks"><li><b>Пробуждается сам — один раз.</b> Когда в только что построенную фабрику впервые входит игрок, Предвестник встаёт в реакторном зале сам; потом его запускают на терминале — и снова после каждой победы. Каждому, кто бился, — ядро и 24 детали.</li><li><b>Павшим вход закрыт.</b> Кто погиб в бою с Предвестником, не войдёт в реакторный зал, пока бой не кончится: у порога его мягко отталкивает. Пали все, кто с ним бился, — Предвестник уходит, ничего не оставив.</li><li><b>Луч смерти.</b> Красная линия полторы секунды следит за бойцом, желтеет, замирает и стреляет: 12 урона и поджог всем на линии. Сойдите с неё или спрячьтесь за стену — луч упирается в неё.</li><li><b>Ракеты.</b> Оранжевые кольца на полу — через полторы секунды туда падает ракета, 9 урона.</li><li><b>Магнитный импульс.</b> Полторы секунды тянет всех к себе, потом разряжается: 10 урона в 4,5 блока. Бегите против тяги — а после разряда бейте: 3 секунды он уязвим.</li><li><b>Дроны.</b> На 70 и 45% зовёт дронов и автоматона.</li><li><b>Перегрузка.</b> Ниже 30% — быстрее и каждую секунду бьёт током всех в 5 блоках.</li></ul></div>', 1))
          ])
        ]),
        createBaseVNode("article", _hoisted_92, [
          createBaseVNode("figure", null, [
            createBaseVNode("img", {
              src: unref(data).images.castle,
              alt: "Проклятый замок на бедроковой крыше Незера"
            }, null, 8, _hoisted_93),
            _cache[62] || (_cache[62] = createBaseVNode("figcaption", null, "Проклятый замок, 121 × 197 блоков, на цоколе: стена на контрфорсах с девятью башнями и фонарями по ходу, барбакан, город с часовой башней, рынком, таверной и статуей короля, внешний двор с казармами, кузней и фонтаном лавы, внутренняя стена, донжон с тронным залом и шпилем, крылья по бокам", -1))
          ]),
          createBaseVNode("div", _hoisted_94, [
            createBaseVNode("div", _hoisted_95, [
              _cache[68] || (_cache[68] = createBaseVNode("div", { class: "sanctum-title" }, [
                createBaseVNode("h3", null, "Проклятый замок"),
                createBaseVNode("span", { class: "pill" }, "крыша Незера")
              ], -1)),
              createBaseVNode("dl", _hoisted_96, [
                _cache[67] || (_cache[67] = createStaticVNode("<div><dt>Как найти</dt><dd>кровь третьей формы и выше: встаньте на бедрок крыши Незера и нажмите ПКМ Душой демона. В чате — «Сущность демона заметила в этом мире иное строение...», рассказчик подскажет сторону. Душа летит к замку, как око Края, и всегда разбивается</dd></div><div><dt>Где</dt><dd>в 300–500 блоках от того, кто отпустил душу; один на сервер</dd></div><div><dt>Исчезает</dt><dd>отсчёт начинается, когда игрок дошёл до замка и ушёл или погиб; через 10 минут без игроков замок растворяется, крыша становится прежней, а следующая душа найдёт новый. Если король уже пробудился, а живых игроков в замке не осталось, замок исчезает сразу вместе со всеми существами внутри. Король пробуждается в замке лишь однажды</dd></div><div><dt>Город</dt><dd>за аркой над дорогой живут подданные короля: шесть двухэтажных домов с очагами и спальнями, рынок из шести лавок вокруг колодца огня душ, таверна со стойкой и комнатами, золотая статуя короля на дороге, поле адского нароста и огромные багровые грибы. На этажах всех башен — койки, столы и бочки</dd></div><div><dt>Жители</dt><dd>пока король жив, пиглины сами появляются в домах, таверне, на рынке и в башнях — не на глазах у игроков, не больше 10 вокруг одного и 40 на замок. Четверть из них — детёныши, каждый восьмой — громила. После смерти короля новые больше не приходят</dd></div><div><dt>Часовая башня</dt><dd>80 блоков, четыре циферблата без пяти полночь, звонница, крытый мост на западную стену. В атриуме среди красных обелисков и кольца магмы над постаментом висит Адская сущность в поле красной энергии. Всякий, кроме пиглинов, кто подойдёт к ней ближе 7 блоков, загорается. Её охраняют шесть Стражей пекла с клинком Бедствие — поджигают ударом, вокруг вспыхивает Пекло; клинок с них не падает. Пока жив хоть один страж, поле отбрасывает. Последний пал — поле гаснет, и сущность забирает тот, кто подойдёт; в инвентаре она поджигает носителя</dd></div><div><dt>Внешний двор</dt><dd>караульни в башнях барбакана под красными шатрами (такие же над внутренними воротами), двухэтажные казармы с плацем и дымящей трубой, кузня с горном лавы, загоны с хоглинами, фонтан из лавы</dd></div><div><dt>Крылья</dt><dd>на западе — сокровищница, лаборатория алхимика, часовня душ; на востоке — оружейная, кухня, темница</dd></div><div><dt>Донжон</dt><dd>под высокой красной крышей с золотым коньком и окнами-розами: большой зал с длинными столами и каминами, над ним библиотека и королевская спальня, за ним — тронный зал в 31 блок высотой</dd></div><div><dt>Стража</dt><dd>пиглины-громилы в золоте и десять чемпионов: Мечники Бедствия с клинком Бедствие (поджигают, вокруг вспыхивает Пекло) и Берсерки короля с Секирой берсерка (раненые бьют больнее). Оружие с них не падает. Стражник, исчезнувший не погибнув (вы умерли и возродились далеко, чанк выгрузился), снова встаёт на пост, когда вы вернётесь.</dd></div>", 10)),
                createBaseVNode("div", null, [
                  _cache[66] || (_cache[66] = createBaseVNode("dt", null, "Добыча", -1)),
                  createBaseVNode("dd", _hoisted_97, [
                    createBaseVNode("img", {
                      src: unref(data).icons.black_substance,
                      alt: ""
                    }, null, 8, _hoisted_98),
                    _cache[63] || (_cache[63] = createTextVNode("Чёрная субстанция в рамке над троном · ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.hell_essence,
                      alt: ""
                    }, null, 8, _hoisted_99),
                    _cache[64] || (_cache[64] = createTextVNode("Адская сущность в часовой башне · Призрачный страж в сокровищнице · ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.royal_clock,
                      alt: ""
                    }, null, 8, _hoisted_100),
                    _cache[65] || (_cache[65] = createTextVNode("Королевские часы с короля · пять сундуков сокровищницы бастиона (незерит, древние обломки, золото) в сокровищнице, за троном и в спальне · сундуки в комнатах", -1))
                  ])
                ])
              ])
            ]),
            _cache[69] || (_cache[69] = createStaticVNode('<div class="boss"><div class="boss-name">Проклятый король</div><div class="boss-stats"><span class="pill">1200 здоровья</span><span class="pill">урон 10</span><span class="pill">броня 12</span><span class="pill">пиглин-громила ×2,4</span></div><ul class="attacks"><li><b>Тронный зал.</b> Шесть колонн — укрытие от указа, лава за перилами вдоль стен, жаровни по углам, над серединой — люстра-корона, у трона — кучи королевского золота. Король встаёт, когда боец входит в зал; пока он жив, субстанцию не снять.</li><li><b>Акт I. Удар короны.</b> Кто близко перед ним — на полу раскрывается золотой веер, затем удар: 8 урона. Выйдите из веера или зайдите за спину.</li><li><b>Рывок.</b> Золотая линия к бойцу — через секунду король несётся по ней: 7 урона. Потом 2 секунды уязвим.</li><li><b>Золото.</b> Круги под бойцами и по залу — сверху рушится золото, 6 урона.</li><li><b>Указ.</b> Тёмное кольцо радиусом 12 сжимается к нему; кого застало на виду — тянет к ногам, затем удар: 7 урона. Спасают расстояние и колонны; после — 3 секунды уязвим. На 70% из углов выходит свита.</li><li><b>Бросок топора.</b> Золотая дорожка к бойцу — через секунду король бросает вращающийся топор, и тот возвращается бумерангом: 7 урона туда и обратно. Сойдите с дорожки или спрячьтесь за колонну.</li><li><b>Поступь.</b> Король трижды бьёт оземь — по полу бегут золотые волны на 16 блоков: 5 урона и подброс тем, кто на земле. Перепрыгивайте их; после — 2 секунды уязвим.</li><li><b>Акт II. Золотой бастион.</b> На половине здоровья король садится на трон в золотой клетке: щит из 25 ударов (+10 за каждого бойца, до 60) — бейте часто, а не сильно. В начале акта у ворот замка появляются 8 пиглинов и брутов и идут в тронный зал драться с вами. Пока щит стоит, на зал рушится золото, на половине щита приходит свита, а с трона летят золотые копья — луч по золотой линии, 5 урона; уходите с линии или за колонну. Разбили — король прыгает в центр зала (7 урона) и 5 секунд уязвим.</li><li><b>Акт III. Проклятие короны.</b> Ниже 30% — ярость и снова свита. <b>Проклятие</b>: всё дальше 9 блоков от центра зала вспыхивает — бегите в середину. <b>Казнь</b>: самого слабого он сковывает цепью и прыгает на него — 11 урона, круг замирает за полсекунды до прыжка.</li><li><b>Рог.</b> В начале третьего акта над замком трубит рог, и весь замок бежит в тронный зал: стража, чемпионы, Стражи пекла из часовой башни и жители города — до 36 разом, а в воротах появляется толпа из 10 Стражников ворот. Все они бросаются на любого игрока, которого видят в 16 блоках. Когда король падает, его народ теряет волю: бросает цель, слабеет и замедляется.</li><li><b>Дань.</b> От каждого подданного в зале к королю тянется золотая цепь; через 2,5 секунды он лечится на 1,5% здоровья за каждого живого (до 12%), а они получают силу. Бейте сначала их.</li><li><b>Голоса.</b> Путеводитель, Наблюдатель и Claude говорят на каждом акте, при падении короля, при первом входе в часовую башню и когда гаснет её поле.</li></ul></div>', 1))
          ])
        ]),
        createBaseVNode("article", _hoisted_101, [
          createBaseVNode("figure", _hoisted_102, [
            createBaseVNode("div", _hoisted_103, [
              (openBlock(), createElementBlock(Fragment, null, renderList(["green", "blue", "orange", "purple", "red", "gray"], (c) => {
                return createBaseVNode("img", {
                  key: c,
                  src: unref(data).icons["wanderer_cube_" + c],
                  alt: c
                }, null, 8, _hoisted_104);
              }), 64))
            ]),
            _cache[70] || (_cache[70] = createBaseVNode("figcaption", null, "Тессеракт меняет цвет: зелёный — исцеление, голубой — к храму, оранжевый — к Незеритовой кузне, фиолетовый — к точке возрождения, красный — сломать чужой купол, серый — перезарядка", -1))
          ]),
          createBaseVNode("div", _hoisted_105, [
            createBaseVNode("div", _hoisted_106, [
              _cache[76] || (_cache[76] = createBaseVNode("div", { class: "sanctum-title" }, [
                createBaseVNode("h3", null, "Тессеракт"),
                createBaseVNode("span", { class: "pill" }, "любая кровь")
              ], -1)),
              createBaseVNode("dl", _hoisted_107, [
                createBaseVNode("div", null, [
                  _cache[74] || (_cache[74] = createBaseVNode("dt", null, "Крафт", -1)),
                  createBaseVNode("dd", _hoisted_108, [
                    _cache[71] || (_cache[71] = createTextVNode("верстак: в середине ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.terra_essence,
                      alt: ""
                    }, null, 8, _hoisted_109),
                    _cache[72] || (_cache[72] = createTextVNode("Терра-сущность, звезда Незера, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.hell_essence,
                      alt: ""
                    }, null, 8, _hoisted_110),
                    _cache[73] || (_cache[73] = createTextVNode("Адская сущность; сверху и снизу — по три плачущих обсидиана", -1))
                  ])
                ]),
                _cache[75] || (_cache[75] = createStaticVNode("<div><dt>Как работает</dt><dd>правый клик, пользоваться может кто угодно. Что сделает тессеракт, видно по его цвету. После применения он сереет на время перезарядки — она записана в самом тессеракте</dd></div><div><dt>Красный</dt><dd>вы стоите в чужом куполе — Сделке с дьяволом, Тёмной территории или Сборочном куполе: тессеракт ломает его, автоматоны купола исчезают. Если куполов несколько — только один. Перезарядка 10 минут</dd></div><div><dt>Зелёный</dt><dd>здоровье не полное: вы и свои в круге 3 блоков получаете по половине здоровья. Перезарядка 5 минут</dd></div><div><dt>Голубой</dt><dd>полное здоровье, обычный мир: перенос к случайному храму — Храму джунглей, Небесному, Древней фабрике или Тёмному храму, если он стоит. 10 минут</dd></div><div><dt>Оранжевый</dt><dd>полное здоровье, Незер: перенос к Незеритовой кузне. 10 минут</dd></div><div><dt>Фиолетовый</dt><dd>полное здоровье, Энд: перенос к кровати или якорю возрождения, а без них — к точке появления мира. 10 минут</dd></div><div><dt>Перенос</dt><dd>забирает всех живых в круге 3 блоков — друзей, врагов и мобов (кроме боссов). Круг на месте отправления горит ещё 5 секунд: кто войдёт в него, отправится следом. Из запертой арены испытания не уводит</dd></div>", 7))
              ])
            ])
          ])
        ]),
        _cache[89] || (_cache[89] = createBaseVNode("div", { class: "prose small" }, [
          createBaseVNode("p", null, [
            createBaseVNode("b", null, "Королевские часы"),
            createTextVNode(" работают как тотем бессмертия. Спасая от смерти, они на 5 секунд останавливают время: существа в 32 блоках замирают, стрелы висят в воздухе, другие игроки не могут ни сдвинуться, ни ударить. В чате — «Время, ник?» и «Неужели пришло то самое время?».")
          ])
        ], -1)),
        createBaseVNode("article", _hoisted_111, [
          createBaseVNode("figure", _hoisted_112, [
            createBaseVNode("img", {
              src: unref(data).icons.terra_essence,
              alt: "Терра-сущность"
            }, null, 8, _hoisted_113),
            _cache[77] || (_cache[77] = createBaseVNode("figcaption", null, "Терра-сущность висит в дальнем зале подземелья, в зелёной спирали; путь к ней — через загадки, всадников и Джунглевого голема", -1))
          ]),
          createBaseVNode("div", _hoisted_114, [
            createBaseVNode("div", _hoisted_115, [
              _cache[86] || (_cache[86] = createBaseVNode("div", { class: "sanctum-title" }, [
                createBaseVNode("h3", null, "Терра-подземелье"),
                createBaseVNode("span", { class: "pill" }, "под землёй")
              ], -1)),
              createBaseVNode("dl", _hoisted_116, [
                createBaseVNode("div", null, [
                  _cache[79] || (_cache[79] = createBaseVNode("dt", null, "Как найти", -1)),
                  createBaseVNode("dd", _hoisted_117, [
                    createBaseVNode("img", {
                      src: unref(data).icons.terra_compass,
                      alt: ""
                    }, null, 8, _hoisted_118),
                    _cache[78] || (_cache[78] = createTextVNode("Терра-компас: его собирает кровь предков (с первой формы) у алтаря Храма джунглей из компаса и 8 терра-слитков. Если подземелья ещё нет, оно появляется в 350–600 блоках от того, кто собрал компас. Стрелка указывает на шахту над входным залом — копайте к ней: в остальные стены не пробиться", -1))
                  ])
                ]),
                _cache[85] || (_cache[85] = createStaticVNode("<div><dt>Где</dt><dd>верхний мир, глубоко под землёй (низ на y −60), 155 × 302 блока; одно на сервер</dd></div><div><dt>Исчезает</dt><dd>когда в нём кто-то побывал и все игроки его покинули — ушли или погибли — через 30 секунд, вместе со всеми существами; камень возвращается как был. Вернётся только через 15 игровых суток, само, в 350–600 блоках от прежнего места; до тех пор стрелка компаса кружится</dd></div><div><dt>Загадки</dt><dd>старое подземелье из мха и камня: рычаги, кнопки, двери, поршни, растяжки и ловушки — нажимать можно всё, а ломать и ставить блоки нельзя; дикие мобы не появляются. Дальний зал открывается загадками</dd></div><div><dt>Библиотека</dt><dd>зал с лабиринтом стеллажей вокруг ямы. Когда вы впервые входите в неё, ваш путеводитель подскажет присмотреться к четырём рычагам под сводом</dd></div><div><dt>Разбойники</dt><dd>когда вы подходите к постам в залах, выходят разбойники и поборники с Терра-блейдами — не чаще раза в 2 минуты с поста и не больше 15 разом. Клинок с поборников не падает</dd></div><div><dt>Всадники апокалипсиса</dt><dd>в зале свечей по пути к большому залу: Война (вызыватель) и Смерть (иллюзор с луком) на лошадях-скелетах, появляются, когда вы входите. У всадников по 150 здоровья, у лошадей по 60, общая полоса здоровья; с каждого — тотем бессмертия. Пока жив хоть один, голем спит</dd></div><div><dt>Терра-сущность в зале</dt><dd>когда голем пал, вокруг всей арены поднимается большая зелёная спираль, а в центре над холмом висит Терра-сущность. Пока она на месте, всякий в зале отравлен (отравление III). Забрать сущность — подойти к ней</dd></div><div><dt>Когда сущность взята</dt><dd>спираль гаснет, а остальные комнаты кишат болотниками — они лезут из мха во всех комнатах, где бы вы ни были, до 60 разом, и нападают, пока вы в подземелье, прежде всего на того, у кого сущность</dd></div><div><dt>Терра-сущность</dt><dd>не кладётся ни в мешок, ни в сундук Края, ни в шалкер; в инвентаре отравляет всех, кроме техноорганической крови и крови предков</dd></div>", 9)),
                createBaseVNode("div", null, [
                  _cache[84] || (_cache[84] = createBaseVNode("dt", null, "Бочки", -1)),
                  createBaseVNode("dd", _hoisted_119, [
                    _cache[80] || (_cache[80] = createTextVNode("17 бочек наполняются при каждом появлении подземелья. В одной из них — ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.ancient,
                      alt: ""
                    }, null, 8, _hoisted_120),
                    _cache[81] || (_cache[81] = createTextVNode("Древний. В остальных осколки души, небесные и джунглей, ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.terra_ingot,
                      alt: ""
                    }, null, 8, _hoisted_121),
                    _cache[82] || (_cache[82] = createTextVNode("терра-слитки (25%), ", -1)),
                    createBaseVNode("img", {
                      src: unref(data).icons.demon_soul,
                      alt: ""
                    }, null, 8, _hoisted_122),
                    _cache[83] || (_cache[83] = createTextVNode("Душа демона (10%) и припасы", -1))
                  ])
                ])
              ])
            ]),
            _cache[87] || (_cache[87] = createStaticVNode('<div class="stack" style="align-content:start;"><div class="boss"><div class="boss-name">Джунглевый голем</div><div class="boss-stats"><span class="pill">900 здоровья</span><span class="pill">7 блоков ростом</span><span class="pill">большой зал</span></div><ul class="attacks"><li><b>Сотрясение.</b> Заносит кулаки — вокруг него заполняется зелёный круг в 8 блоков. Кто внутри и на земле, получает удар и взлетает. Выйдите из круга или подпрыгните; после удара голем ненадолго уязвим.</li><li><b>Валун.</b> Швыряет глыбу мшистого камня: место падения светится диском. Уйдите с диска.</li><li><b>Плеть.</b> Линия лоз тянется к вам и через миг хлещет по всей длине, притягивая к голему. Сойдите с линии.</li><li><b>Корни.</b> На 60% и 30% здоровья голем одевается мхом: щит считает удары, а не урон. Пока он держится, из мха лезут болотники. Сбейте щит — голем 5 секунд уязвим.</li><li><b>Ярость.</b> Ниже 30% он быстрее, а после Сотрясения на полу остаются ядовитые споры.</li><li><b>Награда.</b> 3–5 терра-слитков; в центре зала появляется Терра-сущность.</li></ul></div><div class="boss"><div class="boss-name">Древний</div><div class="boss-stats"><span class="pill">урон 7</span><span class="pill">скорость 1,6</span><span class="pill">кровь предков, вторая форма</span></div><ul class="attacks"><li><b>Гнев предков.</b> По разбойникам и ведьмам +4 урона; каждый удар оплетает цель корнями — замедление II на 1,5 секунды.</li><li><b>Разлом</b> (правый клик). Удар оземь: разлом бежит кольцами на 6 блоков — 8 урона, подброс и корни на 3 секунды каждому врагу, через которого прошёл. Вам — поглощение II на 8 секунд. Перезарядка 20 секунд.</li><li><b>Где взять.</b> В одной из бочек Терра-подземелья — по мечу в каждое его появление. Держать его может кровь предков со второй формы.</li></ul></div></div>', 1))
          ])
        ]),
        _cache[90] || (_cache[90] = createBaseVNode("div", { class: "prose small" }, [
          createBaseVNode("p", null, [
            createBaseVNode("b", null, "Стражи святилищ"),
            createTextVNode(" приходят в последней волне испытания, "),
            createBaseVNode("b", null, "Предвестника"),
            createTextVNode(" запускают на терминале фабрики. Каждый, кто бился, получает свою долю добычи. Пали все бойцы — страж уходит.")
          ])
        ], -1))
      ]);
    };
  }
};
const _hoisted_1$4 = { id: "raids" };
const _hoisted_2$2 = { class: "rooms" };
const _hoisted_3$2 = ["src"];
const _sfc_main$5 = {
  __name: "TrialsSection",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$4, [
        _cache[1] || (_cache[1] = createStaticVNode('<div class="sec-head"><div class="eyebrow">Снова и снова</div><h2>Испытания</h2><p class="lead">В Незеритовой кузне, Небесном храме и Храме джунглей рейдов больше нет, и страж не ждёт в арене: всё это заменило <b>испытание святилища</b>. Его начинают у алтаря.</p></div><div class="stack"><div class="panel"><h3>Испытание святилища</h3><p class="small">Пять волн в арене, в пятой — сам страж святилища. Сражаться может кто угодно, а уровень и награду определяет тот, кто начал. Покинуть арену до конца боя нельзя: в проходах наружу ветер мягко отталкивает назад, а по самому залу можно ходить свободно.</p><div class="tbl"><table><thead><tr><th>Уровень</th><th>Цена</th><th>Что даёт</th></tr></thead><tbody><tr><td>1</td><td>даром; начать может только кровь этого святилища</td><td>у всех бойцов этой крови и у начавшего первая форма → вторая</td></tr><tr><td>2</td><td>алмазный блок, изумрудный блок, 20 осколков</td><td>начавшему — реликвия святилища, даже если он погиб</td></tr><tr><td>3</td><td>32 осколка, реликвия, зачарованное золотое яблоко</td><td>начавшему — реликвия; у бойцов этой крови и у начавшего вторая форма → третья; Серафим роняет Печать ночи (её не берёт ни огонь, ни лава)</td></tr></tbody></table></div><p class="small muted">Каждое пройденное испытание открывает следующий уровень; третий можно проходить снова и снова.</p></div><div class="panel"><h3>Испытание крови</h3><p class="small">Путь к четвёртой форме: в своём <b>чертоге</b> над миром нужно <b>продержаться минуту</b> против бессмертного стража и его слуг. Выжили — четвёртая форма. Умерли или вышли — провал, но вещи останутся при вас.</p><div class="tbl"><table><thead><tr><th>Кровь</th><th>Где начать</th><th>Цена</th><th>Чертог</th></tr></thead><tbody><tr><td>Пепельная</td><td>Незеритовая кузня</td><td>6 незеритовых слитков</td><td>Чертог пепла: Бессмертное Горнило</td></tr><tr><td>Предков</td><td>Храм джунглей</td><td>32 терра-слитка</td><td>Чертог предков: Бессмертный страж джунглей</td></tr><tr><td>Ночная небесная</td><td>Тёмный храм</td><td>даром, один раз за ночь</td><td>Чертог ночи: Бессмертный серафим</td></tr></tbody></table></div><p class="small">Техноорганическая кровь проходит его <b>в Древней фабрике</b>, в реакторном зале, после падения Предвестника: 16 деталей и Ядро Предвестника, четыре волны в одиночку.</p></div></div>', 2)),
        createBaseVNode("figure", _hoisted_2$2, [
          createBaseVNode("img", {
            src: unref(data).images.rooms,
            alt: "Три чертога испытаний: ночи, пепла и предков"
          }, null, 8, _hoisted_3$2),
          _cache[0] || (_cache[0] = createBaseVNode("figcaption", null, "Чертоги ночи, пепла и предков — разрез на уровне игрока. Звезда в полу, пилоны по стенам, за стёклами — аметист, лава и свет.", -1))
        ]),
        _cache[2] || (_cache[2] = createBaseVNode("div", { class: "panel" }, [
          createBaseVNode("h3", null, "Рейды фабрики"),
          createBaseVNode("p", { class: "small" }, "Остались только в Древней фабрике: после падения Предвестника, вход — 8 деталей. Пять волн, каждому дошедшему — 12–19 деталей и шанс 15% на ядро. Провал — если зал пустеет на 20 секунд или проходит 6 минут.")
        ], -1))
      ]);
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
          createBaseVNode("p", { class: "lead" }, "При первом входе каждый игрок сам выбирает одну из трёх родословных (кровь бездны, техноорганическая и ночная небесная в этот выбор не входят) на отдельном экране: первый клик — присмотреться, второй — выбрать. Кровь решает, как игрок растёт, какую книгу получит и какие величайшие клинки его признают.")
        ], -1)),
        _cache[5] || (_cache[5] = createBaseVNode("h3", null, "Клинки крови", -1)),
        _cache[6] || (_cache[6] = createBaseVNode("p", null, [
          createTextVNode("Величайшие клинки привязаны к крови: в чужих руках они не работают. "),
          createBaseVNode("b", null, "Короны"),
          createTextVNode(" — Люцифер, Истинный Экскалибур и Селестиал — отвечают только крови в "),
          createBaseVNode("b", null, "четвёртой форме"),
          createTextVNode(", а Все-Чёрный — только крови бездны. В креативе ограничений нет.")
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
        _cache[7] || (_cache[7] = createStaticVNode('<h3>Формы</h3><div class="flow" aria-label="Путь крови"><div class="step"><b>Первая</b><span>выбор при первом входе — или 20 осколков у алтаря святилища этой крови</span></div><span class="to" aria-hidden="true">→</span><div class="step"><b>Вторая</b><span>испытание 1-го уровня в святилище своей крови</span></div><span class="to" aria-hidden="true">→</span><div class="step"><b>Третья</b><span>испытание 3-го уровня там же</span></div><span class="to" aria-hidden="true">→</span><div class="step"><b>Четвёртая</b><span>Испытание крови в чертоге · корона крови</span></div></div><p>Пепельная кровь растёт в Незеритовой кузне, небесная — в Небесном храме, кровь предков — в Храме джунглей. <b>Вторую</b> и <b>третью</b> формы дают испытания святилища, <b>четвёртую</b> — Испытание крови (см. «Испытания»).</p><p><b>Крылья.</b> С четвёртой формой у ночной небесной крови, пепельной крови и крови предков за спиной появляются крылья: у ночной — бледно-голубые, у пепельной — огненные, у крови предков — зелёные. Нужен ресурспак сервера. Крылья сидят на игроке и двигаются вместе с ним без отставания. Невидимость, наблюдатель и смерть их прячут.</p><p><b>У небесной крови нет четвёртой формы.</b> Сломав <b>Печать ночи</b> с Серафима третьего испытания, небесная кровь становится <b>ночной небесной</b>, а Небесный храм минуту разваливается — глыбы срываются с краёв и падают вниз, пока от него не останется пятая часть, — и встаёт в другом месте. С тех пор по ночам появляется <b>Тёмный храм</b> — там ночная кровь растёт дальше и куёт свои клинки. Клинки небесной крови ей тоже служат.</p><p><b>Техноорганическая кровь</b> растёт по-старому: вторая форма — победа в рейде фабрики, третья — три подвига в любом порядке, четвёртая — Испытание крови в реакторном зале.</p>', 6)),
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
        _cache[8] || (_cache[8] = createStaticVNode('<p class="small muted">Третий подвиг — выковать любой клинок у любого алтаря. Подвиги засчитываются, пока кровь во второй форме.</p><p>С <b>третьей формы</b> клинки своей крови бьют сильнее. <b>Четвёртая форма</b> открывает корону крови и пробуждение: шкала копится в бою, полная — <kbd>Shift</kbd> + смена рук. После — 10 минут отдыха.</p><p class="small"><b>Кровь предков</b> не отбрасывает, со второй формы даёт броню и медленную регенерацию, с третьей — двойной прыжок (возвращается при приземлении, падение после него не ранит) и удар в прыжке, притягивающий врагов (хорошо сочетается с булавой). Вместо пробуждения — <b>щит предков</b>: на половине здоровья он поглощает 20 ударов. Раз в 10 минут.</p>', 3)),
        createBaseVNode("div", _hoisted_11, [
          createBaseVNode("table", null, [
            _cache[3] || (_cache[3] = createBaseVNode("thead", null, [
              createBaseVNode("tr", null, [
                createBaseVNode("th", null, "Кровь"),
                createBaseVNode("th", null, "Первая форма"),
                createBaseVNode("th", null, "Вторая"),
                createBaseVNode("th", null, "Третья"),
                createBaseVNode("th", null, "Четвёртая · пробуждение")
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
        _cache[9] || (_cache[9] = createStaticVNode('<p class="small muted">Сменить кровь можно у алтаря её святилища. Ночную небесную не купить, а кровь бездны и техноорганическую сменить <b>нельзя</b>.</p><p><b>Кровь бездны</b> не выбирают и не покупают. Её получает тот, кто выковал <b>Все-Чёрный</b>: в тот же миг кровь меняется на бездну — навсегда. У бездны нет форм: все её дары и пробуждение действуют сразу, подвигов и испытания у неё нет. Отвечает ей только Все-Чёрный.</p><p><b>Техноорганическую кровь</b> принимают на терминале Древней фабрики. Вместе с ней вы получаете <b>Энцефало-меч</b>: он сам растёт вместе с кровью — в <b>Энцефало-клинок</b>, а затем в <b>Энцефало-истребитель</b> — и возвращается к вам после смерти. Сменить эту кровь нельзя.</p><p class="small">Её дары — <b>реактивные сапоги</b> (прыгните, в воздухе прыгните ещё раз и держите — взлёт со второго прыжка), здоровье цели в чате и <b>режим убийцы</b> на половине здоровья: скорость и взрывной таран. Раз в 10 минут.</p><p class="small">Алтарь фабрики собирает своей крови <b>призывные машины</b>: медного голема, малого Предвестника и Сборочный купол. Правый клик — и машина сражается за вас.</p><h3>Путеводитель</h3><p>Сразу после крови выбирается голос, что будет с вами в пути: когда он помолчит десять минут, даёт совет или рассказывает легенду — только те, что вам ещё пригодятся, — и отзывается на то, что с вами происходит — смерть, битвы, святилища, выкованные клинки. Закроете экран, не выбрав, — останется Путеводитель. Каждая реплика звучит один раз за всю игру.</p><div class="tbl"><table><thead><tr><th>Голос</th><th>Какой</th></tr></thead><tbody><tr><td>Путеводитель</td><td>старый хранитель знаний о клинках: тёплый, насмешливый, говорит загадками</td></tr><tr><td>Claude</td><td>разум Древней фабрики: язвительный, спокойный, презирает органику и не скрывает своих целей</td></tr><tr><td>Наблюдатель</td><td>древний свидетель: торжественный и печальный, рассказывает легенды о Все-Чёрном</td></tr></tbody></table></div><p class="small muted">Кровь бездны всегда слышит Наблюдателя, техноорганическая — Claude: их выбор голоса не касается.</p><h3>Книги</h3><p>Выбрав кровь, игрок получает <b>книгу своей крови</b>: формы и пробуждение, подвиги третьей формы, клинки крови и как их добыть, мастерство, святилища и алтарь. Оператор сервера при первом входе получает ещё и <b>книгу хранителя</b> — как всем этим управлять. С ресурспаком в книгах герб крови, узорные разделители и иконки клинков.</p>', 11))
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
          createBaseVNode("p", { class: "lead" }, "Отдельная вкладка в меню достижений. Плагин сам ставит датапак в мир; иконками служат модели самих клинков.")
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
        createStaticVNode('<div class="sec-head"><div class="eyebrow">Установка и настройка</div><h2>Для администратора</h2></div><div class="twocol"><div class="panel"><h3>Установка</h3><ol class="small" style="margin:0;padding-left:1.2em;display:grid;gap:6px;"><li>Собрать: <code>gradlew.bat build</code> (Windows) или <code>./gradlew build</code>; нужна Java 21+.</li><li>Положить <code>build/libs/virusswords-1.0.0.jar</code> в <code>plugins/</code> сервера Paper 1.21.11.</li><li>Раздать <code>VirusSwords-ResourcePack.zip</code> — через <code>server.properties</code> или в лаунчере. Нужен клиент 1.21.6+.</li><li>При первом запуске плагин сам ставит датапак достижений и один раз перезагружает данные.</li></ol></div><div class="panel"><h3>Главное в config.yml</h3><div class="tbl"><table><tbody><tr><td><code>progression.mastery-multiplier</code></td><td>скорость роста мастерства</td></tr><tr><td><code>progression.bloodlines</code></td><td>включить родословные и привязку клинков к крови</td></tr><tr><td><code>sanctums.roam-minutes</code></td><td>через сколько минут без гостей святилище переезжает (отсчёт — после первого визита); 0 — никогда</td></tr><tr><td><code>sanctums.build-radius</code></td><td>на каком расстоянии поднимается постройка</td></tr><tr><td><code>sanctums.boss-health-multiplier</code></td><td>здоровье стражей для больших компаний</td></tr><tr><td><code>sanctums.raid-relic-chance</code></td><td>шанс ядра в рейде фабрики</td></tr><tr><td><code>abilities.cooldown-seconds</code></td><td>перезарядки способностей</td></tr><tr><td><code>bound-drops.items</code></td><td>клинки, которые не теряются при смерти</td></tr></tbody></table></div></div></div><footer><span>Кодекс собран из исходников плагина: имена, описания, урон и достижения взяты прямо из кода.</span><span>Модели оружия — ресурспаки Fantasy Weapons (автор nongkos) и Blades of Majestica, используются приватно.</span></footer>', 3)
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
        createVNode(_sfc_main$g),
        createBaseVNode("main", null, [
          createVNode(_sfc_main$e),
          createVNode(_sfc_main$d),
          createVNode(_sfc_main$c),
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
